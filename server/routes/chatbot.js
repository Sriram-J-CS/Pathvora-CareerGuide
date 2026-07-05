const express = require('express');
const router = express.Router();
const db = require('../db');
const aiService = require('../aiService');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/chatbot/history
// @desc    Retrieve user's chat logs
router.get('/history', protect, async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const history = await db.getChatHistory(userId);
    res.json(history.messages || []);
  } catch (error) {
    console.error('Fetch Chat History Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// @route   POST /api/chatbot/message
// @desc    Send a message and get an AI context-aware reply
router.post('/message', protect, async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message content is required' });
    }

    const userId = req.user._id || req.user.id;
    const profile = await db.getProfileByUserId(userId);
    const chatHistory = await db.getChatHistory(userId);
    const messages = chatHistory.messages || [];

    // Format chat logs as prompt context
    const cleanHistory = messages.map(m => ({ role: m.role, content: m.content }));

    // Get response from AI Service
    const aiResponse = await aiService.getChatResponse(
      userId,
      message.trim(),
      cleanHistory,
      profile
    );

    // Save dialogue in DB history
    const updatedMessages = [
      ...messages,
      { role: 'user', content: message.trim(), timestamp: new Date() },
      { role: 'assistant', content: aiResponse, timestamp: new Date() }
    ];

    await db.saveChatHistory(userId, updatedMessages);

    res.json({
      role: 'assistant',
      content: aiResponse
    });

  } catch (error) {
    console.error('Chatbot Message Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
