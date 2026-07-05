const express = require('express');
const router = express.Router();
const db = require('../db');
const aiService = require('../aiService');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/dashboard/overview
// @desc    Retrieve quick summary cards for the user dashboard
router.get('/overview', protect, async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const profile = await db.getProfileByUserId(userId);
    
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    const steps = await db.getRoadmapSteps(userId);
    const nextStep = steps.find(s => s.status === 'Pending' || s.status === 'In Progress') || null;

    const confHistory = await db.getConfidenceHistory(userId);
    const latestConfidence = confHistory.length > 0 ? confHistory[confHistory.length - 1].score : 70;

    res.json({
      educationStage: profile.educationStage,
      educationStatus: profile.educationStatus,
      selectedDomain: profile.selectedDomain || 'Unspecified',
      confidenceScore: latestConfidence,
      nextStep: nextStep ? { id: nextStep._id, title: nextStep.title, task: nextStep.task } : null
    });

  } catch (error) {
    console.error('Fetch Overview Data Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// @route   GET /api/dashboard/fit-score
// @desc    Calculate user success compatibility rating for a domain
router.get('/fit-score', protect, async (req, res) => {
  try {
    const { domain } = req.query;
    if (!domain) {
      return res.status(400).json({ error: 'Domain parameter is required' });
    }

    const userId = req.user._id || req.user.id;
    const profile = await db.getProfileByUserId(userId);
    
    const analysis = await aiService.computeFitScore(userId, profile, domain);
    res.json(analysis);

  } catch (error) {
    console.error('Fetch Fit Score Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// @route   GET /api/dashboard/compare
// @desc    Generate career lifestyle comparison details for 2 domains
router.get('/compare', protect, async (req, res) => {
  try {
    const { domainA, domainB } = req.query;
    if (!domainA || !domainB) {
      return res.status(400).json({ error: 'Both domainA and domainB query parameters are required' });
    }

    const userId = req.user._id || req.user.id;
    const comparison = await aiService.compareCareers(userId, domainA, domainB);
    res.json(comparison);

  } catch (error) {
    console.error('Fetch Career Comparison Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// @route   GET /api/dashboard/trending
// @desc    Retrieve Trending Domains for charts
router.get('/trending', protect, async (req, res) => {
  try {
    const domains = await db.getTrendingDomains();
    res.json(domains);
  } catch (error) {
    console.error('Fetch Trending Domains Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// @route   POST /api/dashboard/confidence
// @desc    Submit 3-question monthly check-in
router.post('/confidence', protect, async (req, res) => {
  try {
    const { answers } = req.body;

    if (!answers || !Array.isArray(answers) || answers.length !== 3) {
      return res.status(400).json({ error: 'Confidence check requires exactly 3 score ratings' });
    }

    const validAnswers = answers.map(Number).filter(n => n >= 1 && n <= 10);
    if (validAnswers.length !== 3) {
      return res.status(400).json({ error: 'Scores must be integers between 1 and 10' });
    }

    const average = validAnswers.reduce((sum, score) => sum + score, 0) / 3;
    const finalPercentage = Math.round(average * 10);

    const userId = req.user._id || req.user.id;
    const newCheck = await db.createConfidenceCheck({
      userId,
      answers: validAnswers,
      score: finalPercentage
    });

    res.status(201).json({
      message: 'Confidence assessment recorded successfully',
      check: newCheck
    });

  } catch (error) {
    console.error('Record Confidence Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// @route   GET /api/dashboard/confidence-history
// @desc    Retrieve user confidence check history
router.get('/confidence-history', protect, async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const history = await db.getConfidenceHistory(userId);
    res.json(history);
  } catch (error) {
    console.error('Fetch Confidence History Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// @route   GET /api/dashboard/data
// @desc    Retrieve senior trajectories and option simulator metrics
router.get('/data', protect, async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const profile = await db.getProfileByUserId(userId);
    const domain = profile?.selectedDomain || 'AI & Machine Learning Engineering';

    const seniorPaths = [
      {
        name: 'Arjun Mehta',
        role: `Lead Specialist in ${domain}`,
        journey: [
          { year: 'Year 1', task: `Completed entry training in ${domain}; built basic GitHub portfolios.` },
          { year: 'Year 2', task: `Acquired certifications in cloud engineering; led a team of 3 developers.` },
          { year: 'Year 3', task: 'Joined global IT consultancy; optimized latency limits and security.' },
          { year: 'Year 4', task: 'Senior Engineer; specialized in high-performance computing structures.' },
          { year: 'Year 5', task: 'ML / Operations Architect; designing enterprise cloud coordination systems.' }
        ]
      },
      {
        name: 'Kriti Sharma',
        role: `Senior Consultant, ${domain}`,
        journey: [
          { year: 'Year 1', task: `Self-taught coding; built sandbox REST API systems.` },
          { year: 'Year 2', task: 'Completed industrial internship; integrated Redis caching.' },
          { year: 'Year 3', task: 'Junior Dev; managed microservices deployment pipelines.' },
          { year: 'Year 4', task: 'Tech Lead; refactored relational database indexing.' },
          { year: 'Year 5', task: 'Principal Consultant; leading scalable system designs.' }
        ]
      }
    ];

    res.json({ seniorPaths });
  } catch (error) {
    console.error('Fetch Dashboard Data Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// @route   POST /api/dashboard/interview/feedback
// @desc    Evaluate mock interview response using AI
router.post('/interview/feedback', protect, async (req, res) => {
  try {
    const { question, answer, domain } = req.body;
    if (!question || !answer || !domain) {
      return res.status(400).json({ error: 'Question, answer, and domain are required' });
    }

    const userId = req.user._id || req.user.id;
    const feedback = await aiService.getInterviewFeedback(userId, question, answer, domain);
    res.json(feedback);
  } catch (error) {
    console.error('Fetch Interview Feedback Error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

module.exports = router;

