// src/services/aiService.js
const axios = require('axios');

/**
 * AI Service - Tích hợp AI cho chatbot và recommendations
 * Có thể sử dụng OpenAI API, Google Gemini, hoặc local AI model
 */

class AIService {
  constructor() {
    // Có thể dùng OpenAI, Google Gemini, hoặc local model
    this.apiKey = process.env.OPENAI_API_KEY || process.env.AI_API_KEY;
    this.apiUrl = process.env.AI_API_URL || 'https://api.openai.com/v1';
    this.model = process.env.AI_MODEL || 'gpt-3.5-turbo';
    this.enabled = !!this.apiKey;
  }

  /**
   * Chatbot response cho customer support
   */
  async chat(message, context = {}) {
    if (!this.enabled) {
      return {
        response: 'Xin lỗi, tính năng AI chatbot tạm thời không khả dụng. Vui lòng liên hệ support@eshop.com',
        error: 'AI service not configured'
      };
    }

    try {
      const systemPrompt = `Bạn là trợ lý AI của một cửa hàng bán máy tính và linh kiện máy tính online. 
Hãy trả lời câu hỏi của khách hàng một cách thân thiện, chuyên nghiệp và hữu ích.
Nếu không biết câu trả lời, hãy hướng dẫn khách hàng liên hệ bộ phận hỗ trợ.
Chỉ trả lời bằng tiếng Việt.`;

      const response = await axios.post(
        `${this.apiUrl}/chat/completions`,
        {
          model: this.model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message }
          ],
          max_tokens: 200,
          temperature: 0.7,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        response: response.data.choices[0].message.content,
        usage: response.data.usage,
      };
    } catch (error) {
      console.error('AI Chat error:', error.response?.data || error.message);
      return {
        response: 'Xin lỗi, tôi không thể xử lý câu hỏi này ngay bây giờ. Vui lòng thử lại sau.',
        error: error.message,
      };
    }
  }

  /**
   * AI-powered product recommendations
   * Dựa trên mô tả sản phẩm và lịch sử mua hàng
   */
  async getRecommendations(userPreferences, purchaseHistory = []) {
    if (!this.enabled) {
      return [];
    }

    try {
      const prompt = `Dựa trên thông tin sau, đề xuất 5 sản phẩm máy tính/linh kiện phù hợp:
- Sở thích: ${userPreferences}
- Lịch sử mua: ${purchaseHistory.map(p => p.name).join(', ') || 'Chưa có'}

Trả lời dạng JSON array: [{"category": "...", "keywords": "..."}, ...]`;

      const response = await axios.post(
        `${this.apiUrl}/chat/completions`,
        {
          model: this.model,
          messages: [
            { role: 'system', content: 'Bạn là chuyên gia tư vấn sản phẩm công nghệ. Trả lời chỉ bằng JSON.' },
            { role: 'user', content: prompt }
          ],
          max_tokens: 300,
          temperature: 0.5,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const content = response.data.choices[0].message.content;
      // Parse JSON từ response
      const jsonMatch = content.match(/\[.*\]/s);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      return [];
    } catch (error) {
      console.error('AI Recommendations error:', error.response?.data || error.message);
      return [];
    }
  }

  /**
   * Generate product description từ specifications
   */
  async generateProductDescription(specifications) {
    if (!this.enabled) {
      return null;
    }

    try {
      const prompt = `Tạo mô tả sản phẩm hấp dẫn (200-300 từ) cho sản phẩm máy tính/linh kiện với thông số:
${JSON.stringify(specifications, null, 2)}

Mô tả phải:
- Hấp dẫn, dễ hiểu
- Nêu bật ưu điểm
- Phù hợp với thị trường Việt Nam
- Bằng tiếng Việt`;

      const response = await axios.post(
        `${this.apiUrl}/chat/completions`,
        {
          model: this.model,
          messages: [
            { role: 'user', content: prompt }
          ],
          max_tokens: 400,
          temperature: 0.8,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data.choices[0].message.content.trim();
    } catch (error) {
      console.error('AI Description generation error:', error.response?.data || error.message);
      return null;
    }
  }

  /**
   * Analyze customer sentiment từ reviews
   */
  async analyzeSentiment(reviews) {
    if (!this.enabled) {
      return { sentiment: 'neutral', score: 0 };
    }

    try {
      const reviewsText = reviews.map(r => r.content).join('\n');
      const prompt = `Phân tích cảm xúc của các đánh giá sau (positive/negative/neutral) và cho điểm từ 0-1:
${reviewsText}

Trả lời JSON: {"sentiment": "...", "score": 0.0-1.0}`;

      const response = await axios.post(
        `${this.apiUrl}/chat/completions`,
        {
          model: this.model,
          messages: [
            { role: 'user', content: prompt }
          ],
          max_tokens: 100,
          temperature: 0.3,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const content = response.data.choices[0].message.content;
      const jsonMatch = content.match(/\{.*\}/s);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      return { sentiment: 'neutral', score: 0.5 };
    } catch (error) {
      console.error('AI Sentiment analysis error:', error.response?.data || error.message);
      return { sentiment: 'neutral', score: 0.5 };
    }
  }
}

module.exports = new AIService();

