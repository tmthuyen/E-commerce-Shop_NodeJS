const aiService = require('../../services/aiService');
const OrderModel = require('../models/OrderModel');
const ProductModel = require('../models/ProductModel');

class AIController {
  // [POST] /api/ai/chat - Chatbot endpoint
  async chat(req, res) {
    try {
      const { message, context = {} } = req.body;

      if (!message || !message.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Message không được để trống',
        });
      }

      const result = await aiService.chat(message, context);

      return res.status(200).json({
        success: true,
        data: {
          response: result.response,
          usage: result.usage,
        },
      });
    } catch (error) {
      console.error('AI Chat error:', error);
      return res.status(500).json({
        success: false,
        message: 'Lỗi AI service: ' + error.message,
      });
    }
  }

  // [GET] /api/ai/recommendations - AI-powered recommendations
  async getRecommendations(req, res) {
    try {
      const user_id = req.user?._id || req.user?.id;
      const { preferences = '' } = req.query;

      // Lấy lịch sử mua hàng
      let purchaseHistory = [];
      if (user_id) {
        const orders = await OrderModel.find({ customer_id: user_id })
          .populate('items.product_id', 'name category_id')
          .limit(10)
          .lean();

        purchaseHistory = orders.flatMap(order => 
          order.items.map(item => ({
            name: item.product_id?.name || '',
            category_id: item.product_id?.category_id || null,
          }))
        );
      }

      // Lấy recommendations từ AI
      const aiSuggestions = await aiService.getRecommendations(
        preferences,
        purchaseHistory
      );

      // Tìm products dựa trên AI suggestions
      const recommendedProducts = [];
      for (const suggestion of aiSuggestions.slice(0, 5)) {
        const products = await ProductModel.find({
          $or: [
            { name: { $regex: suggestion.keywords, $options: 'i' } },
            { description: { $regex: suggestion.keywords, $options: 'i' } },
          ],
          status: 'ACTIVE',
          deleted: false,
        })
        .limit(3)
        .lean();

        recommendedProducts.push(...products);
      }

      // Remove duplicates
      const uniqueProducts = Array.from(
        new Map(recommendedProducts.map(p => [p._id, p])).values()
      ).slice(0, 10);

      return res.status(200).json({
        success: true,
        data: uniqueProducts,
        meta: {
          aiEnabled: !!process.env.OPENAI_API_KEY,
          suggestions: aiSuggestions,
        },
      });
    } catch (error) {
      console.error('AI Recommendations error:', error);
      return res.status(500).json({
        success: false,
        message: 'Lỗi AI service: ' + error.message,
      });
    }
  }

  // [POST] /api/ai/generate-description - Generate product description
  async generateDescription(req, res) {
    try {
      const { specifications } = req.body;

      if (!specifications) {
        return res.status(400).json({
          success: false,
          message: 'Specifications không được để trống',
        });
      }

      const description = await aiService.generateProductDescription(specifications);

      if (!description) {
        return res.status(500).json({
          success: false,
          message: 'Không thể tạo mô tả sản phẩm',
        });
      }

      return res.status(200).json({
        success: true,
        data: { description },
      });
    } catch (error) {
      console.error('AI Description generation error:', error);
      return res.status(500).json({
        success: false,
        message: 'Lỗi AI service: ' + error.message,
      });
    }
  }
}

module.exports = new AIController();

