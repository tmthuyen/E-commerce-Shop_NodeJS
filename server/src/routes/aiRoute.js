const express = require('express');
const router = express.Router();
const aiController = require('../app/controllers/AIController');
const { authRequired, tryAuth } = require('../app/middlewares/AuthMiddleware');

// Chat endpoint - không cần auth (public)
router.post('/chat', aiController.chat);

// Recommendations - cần auth (có thể optional)
router.get('/recommendations', tryAuth, aiController.getRecommendations);

// Generate description - chỉ admin
router.post('/generate-description', authRequired, aiController.generateDescription);

module.exports = router;

