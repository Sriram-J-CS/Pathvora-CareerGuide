const express = require('express');
const router = express.Router();
const db = require('../db');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/journal/entries
// @desc    Retrieve user's decision journal feed
router.get('/entries', protect, async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const entries = await db.getJournalEntries(userId);
    res.json(entries);
  } catch (error) {
    console.error('Fetch Journal Entries Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
