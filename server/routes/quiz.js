const express = require('express');
const router = express.Router();
const db = require('../db');
const aiService = require('../aiService');
const { protect } = require('../middleware/authMiddleware');

// Helper to generate skills checklist based on recommended domain
const generateChecklistForDomain = (domain) => {
  return [
    { skill: `${domain} Foundations`, status: 'In Progress', resources: 'freeCodeCamp, YouTube Crash Courses, and documentation', timeline: '1 Month' },
    { skill: 'Core Portfolio Project', status: 'Not Started', resources: 'Build and deploy a modular application or design file', timeline: '2 Months' },
    { skill: 'Interview Readiness Checks', status: 'Not Started', resources: 'Review CareerOS Mock Interview questions and terms', timeline: '2 Weeks' }
  ];
};

// @route   POST /api/quiz/evaluate
// @desc    Evaluate quiz answers and update profile recommendations
router.post('/evaluate', protect, async (req, res) => {
  try {
    const { quizType, answers } = req.body;

    if (!quizType || !answers || !Array.isArray(answers)) {
      return res.status(400).json({ error: 'Quiz type and answers list are required' });
    }

    const userId = req.user._id || req.user.id;
    const profile = await db.getProfileByUserId(userId);
    const stage = profile.educationStage || 'UG';

    // 1. Call AI Service to evaluate quiz and return top 3 domains
    const finalRecommended = await aiService.evaluateQuiz(userId, answers, stage);
    const primaryDomain = finalRecommended[0].domain;

    // 2. Call AI Service to generate personalized roadmap steps
    const steps = await aiService.generateRoadmap(userId, stage, primaryDomain);
    await db.saveRoadmapStepsBatch(userId, steps);

    // 3. Update profile details
    profile.quizCompleted = true;
    profile.onboardingStep = 5; // Complete
    profile.selectedDomain = primaryDomain;
    profile.recommendedDomains = finalRecommended;
    profile.skillsGapChecklist = generateChecklistForDomain(primaryDomain);
    profile.roadmapGenerated = true;
    await profile.save();

    res.json({
      message: 'Evaluation completed successfully',
      recommendedDomains: finalRecommended,
      primaryDomain
    });

  } catch (error) {
    console.error('Quiz Evaluation Route Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
