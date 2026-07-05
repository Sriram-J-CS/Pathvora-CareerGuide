const express = require('express');
const router = express.Router();
const db = require('../db');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/roadmap/steps
// @desc    Retrieve all generated roadmap steps for the authenticated user
router.get('/steps', protect, async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const steps = await db.getRoadmapSteps(userId);
    res.json(steps);
  } catch (error) {
    console.error('Fetch Roadmap Steps Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// @route   PUT /api/roadmap/step/:id
// @desc    Update a specific roadmap step's status
router.put('/step/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['Pending', 'In Progress', 'Completed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid or missing step status' });
    }

    const userId = req.user._id || req.user.id;
    const steps = await db.getRoadmapSteps(userId);
    const targetStep = steps.find(s => s._id.toString() === id);

    if (!targetStep) {
      return res.status(404).json({ error: 'Roadmap step not found or unauthorized' });
    }

    targetStep.status = status;
    await targetStep.save();

    res.json({
      message: 'Step status updated successfully',
      step: targetStep
    });

  } catch (error) {
    console.error('Update Roadmap Step Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const aiService = require('../aiService');

// @route   POST /api/roadmap/generate
// @desc    Generate/Regenerate roadmap steps if they are missing
router.post('/generate', protect, async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const profile = await db.getProfileByUserId(userId);

    if (!profile || !profile.selectedDomain) {
      return res.status(400).json({ error: 'Profile must have a selected target domain' });
    }

    const stage = profile.educationStage || 'UG';
    const domain = profile.selectedDomain;

    const steps = await aiService.generateRoadmap(userId, stage, domain);
    const saved = await db.saveRoadmapStepsBatch(userId, steps);

    profile.roadmapGenerated = true;
    if (typeof profile.save === 'function') {
      await profile.save();
    } else {
      await db.saveProfile(userId, profile);
    }

    res.json(saved);
  } catch (error) {
    console.error('Generate Roadmap Steps Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
