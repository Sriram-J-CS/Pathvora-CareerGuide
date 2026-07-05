const express = require('express');
const router = express.Router();
const db = require('../db');
const aiService = require('../aiService');
const { protect } = require('../middleware/authMiddleware');

// Helper to generate a default skill gap checklist fallback
const generateDefaultSkillsChecklist = (stage, specialization = '') => {
  if (stage === 'UG') {
    return [
      { skill: 'Data Structures & Algorithms', status: 'Not Started', resources: 'LeetCode and freeCodeCamp DSA Curriculum', timeline: '3 Months' },
      { skill: 'Version Control (Git/GitHub)', status: 'In Progress', resources: 'GitHub Skills labs and tutorials', timeline: '1 Week' },
      { skill: 'Industry Project Architecture', status: 'Not Started', resources: 'Full-stack responsive React application tutorials', timeline: '2 Months' }
    ];
  } else if (stage === 'PG') {
    return [
      { skill: 'System Design & Scalability', status: 'Not Started', resources: 'System Design Primer (GitHub) & ByteByteGo', timeline: '2 Months' },
      { skill: 'Cloud infrastructure (AWS/Docker)', status: 'Not Started', resources: 'AWS Certified Developer Associate modules', timeline: '3 Months' },
      { skill: 'Advanced Research Methodology / Analytics', status: 'In Progress', resources: 'Coursera Academic Writing and Research Design', timeline: '2 Months' }
    ];
  } else {
    return [
      { skill: 'Logic & Analytical Math Foundations', status: 'In Progress', resources: 'Khan Academy Advanced Algebra & Statistics', timeline: '1 Month' },
      { skill: 'Introduction to Code / Scripting', status: 'Not Started', resources: 'freeCodeCamp Python / Web Basics', timeline: '2 Months' }
    ];
  }
};

// @route   GET /api/onboarding/profile
// @desc    Get user onboarding profile
router.get('/profile', protect, async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const profile = await db.getProfileByUserId(userId);
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found. Onboarding not started.' });
    }
    res.json(profile);
  } catch (error) {
    console.error('Fetch Profile Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// @route   POST /api/onboarding/step
// @desc    Save step-specific onboarding details
router.post('/step', protect, async (req, res) => {
  try {
    const { step, data } = req.body;
    if (!step) {
      return res.status(400).json({ error: 'Onboarding step is required' });
    }

    const userId = req.user._id || req.user.id;
    let profile = await db.getProfileByUserId(userId);

    // Step 1: Personal Details
    if (step === 1) {
      const { age, gender, phone, location, preferredLanguage } = data;
      if (!age || !phone || !location || !preferredLanguage) {
        return res.status(400).json({ error: 'Missing personal details' });
      }
      profile.personalDetails = { age: Number(age), gender, phone, location, preferredLanguage };
      profile.onboardingStep = Math.max(profile.onboardingStep || 1, 2);
    }

    // Step 2: Educational Stage
    else if (step === 2) {
      const { educationStage, educationStatus } = data;
      if (!educationStage || !educationStatus) {
        return res.status(400).json({ error: 'Education stage and status are required' });
      }
      profile.educationStage = educationStage;
      profile.educationStatus = educationStatus;
      profile.onboardingStep = Math.max(profile.onboardingStep || 1, 3);
    }

    // Step 3: Stage-Specific Details
    else if (step === 3) {
      const stage = profile.educationStage;
      if (stage === '12th') {
        const { schoolName, board, stream, completionYear } = data;
        if (!schoolName || !board || !stream || !completionYear) {
          return res.status(400).json({ error: 'All school details are required' });
        }
        profile.educationDetails = { schoolName, board, stream, completionYear: Number(completionYear) };
      } else if (stage === 'UG' || stage === 'PG') {
        const { collegeName, degree, specialization, completionYear } = data;
        if (!collegeName || !degree || !specialization || !completionYear) {
          return res.status(400).json({ error: 'All university details are required' });
        }
        profile.educationDetails = { collegeName, degree, specialization, completionYear: Number(completionYear) };
      }
      profile.onboardingStep = Math.max(profile.onboardingStep || 1, 4);
    }

    // Step 4: Direction Status Check & AI Roadmap generation
    else if (step === 4) {
      const stage = profile.educationStage;
      profile.directionStatus = data;

      if (stage === '12th') {
        const { knowsDirection, knownDomain } = data;
        if (knowsDirection === 'yes') {
          if (!knownDomain) {
            return res.status(400).json({ error: 'Please enter/select your intended degree/domain' });
          }
          profile.selectedDomain = knownDomain;
          profile.onboardingStep = 5;
          profile.quizCompleted = true;
          
          // Generate AI roadmap steps
          const steps = await aiService.generateRoadmap(userId, '12th', knownDomain);
          await db.saveRoadmapStepsBatch(userId, steps);
          profile.roadmapGenerated = true;
        } else {
          profile.onboardingStep = 4; // Route to Quiz
        }
      } 
      
      else if (stage === 'UG') {
        const { postGradGoal } = data;
        if (postGradGoal === 'job') {
          const spec = profile.educationDetails.specialization || 'Engineering';
          profile.selectedDomain = spec;
          profile.skillsGapChecklist = generateDefaultSkillsChecklist('UG', spec);
          profile.onboardingStep = 5;
          profile.quizCompleted = true;
          
          const steps = await aiService.generateRoadmap(userId, 'UG', spec);
          await db.saveRoadmapStepsBatch(userId, steps);
          profile.roadmapGenerated = true;
        } else if (postGradGoal === 'studies') {
          profile.selectedDomain = 'Higher Studies PG';
          profile.onboardingStep = 5;
          profile.quizCompleted = true;

          const steps = await aiService.generateRoadmap(userId, 'UG', 'Higher Studies PG');
          await db.saveRoadmapStepsBatch(userId, steps);
          profile.roadmapGenerated = true;
        } else {
          profile.onboardingStep = 4; // Route to Quiz
        }
      } 
      
      else if (stage === 'PG') {
        const { pgLeaning } = data;
        if (pgLeaning === 'research') {
          const domainName = 'Academic Research / Fellowship';
          profile.selectedDomain = domainName;
          profile.onboardingStep = 5;
          profile.quizCompleted = true;

          const steps = await aiService.generateRoadmap(userId, 'PG', domainName);
          await db.saveRoadmapStepsBatch(userId, steps);
          profile.roadmapGenerated = true;
        } else if (pgLeaning === 'industry') {
          const spec = profile.educationDetails.specialization || 'Management';
          profile.selectedDomain = spec;
          profile.skillsGapChecklist = generateDefaultSkillsChecklist('PG', spec);
          profile.onboardingStep = 5;
          profile.quizCompleted = true;

          const steps = await aiService.generateRoadmap(userId, 'PG', spec);
          await db.saveRoadmapStepsBatch(userId, steps);
          profile.roadmapGenerated = true;
        } else {
          profile.onboardingStep = 4;
        }
      }
    }

    profile.updatedAt = Date.now();
    await profile.save();

    res.json({
      message: `Step ${step} saved successfully`,
      profile
    });

  } catch (error) {
    console.error('Save Onboarding Step Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
