const express = require('express');
const router = express.Router();
const multer = require('multer');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const db = require('../db');
const aiService = require('../aiService');
const { protect } = require('../middleware/authMiddleware');

// Configure Multer in-memory storage (prevents write latency and storage footprint)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // limit: 5MB
  fileFilter: (req, file, cb) => {
    const isPDF = file.mimetype === 'application/pdf';
    const isDOCX = file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    
    if (isPDF || isDOCX) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and DOCX files are allowed for resume scans'), false);
    }
  }
});

// @route   POST /api/resume/check
// @desc    Upload a resume file, parse text, audit via Claude against target job
router.post('/check', protect, upload.single('resume'), async (req, res) => {
  try {
    const { targetJob } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ error: 'Please upload a resume file (PDF or DOCX)' });
    }

    if (!targetJob) {
      return res.status(400).json({ error: 'Please provide a target job title for this audit' });
    }

    let parsedText = '';
    const buffer = req.file.buffer;

    // Parse file based on mime-type
    if (req.file.mimetype === 'application/pdf') {
      try {
        const data = await pdfParse(buffer);
        parsedText = data.text;
      } catch (err) {
        console.error('PDF Parse Error:', err);
        return res.status(400).json({ error: 'Failed to extract text from the PDF file. Ensure the file is not corrupted.' });
      }
    } else {
      try {
        const result = await mammoth.extractRawText({ buffer });
        parsedText = result.value;
      } catch (err) {
        console.error('Word Parse Error:', err);
        return res.status(400).json({ error: 'Failed to extract text from the DOCX file.' });
      }
    }

    if (!parsedText.trim()) {
      return res.status(400).json({ error: 'The uploaded file appears to contain no indexable text.' });
    }

    const userId = req.user._id || req.user.id;

    // Call AI auditor to check resume text against target job title
    const analysis = await aiService.analyzeResume(userId, parsedText, targetJob);

    // Save resume check audit record in database
    const newCheck = await db.createResumeCheck({
      userId,
      fileName: req.file.originalname,
      score: analysis.score,
      toRemove: analysis.toRemove,
      toAdd: analysis.toAdd,
      formattingIssues: analysis.formattingIssues
    });

    res.json({
      message: 'Resume audited successfully',
      check: newCheck
    });

  } catch (error) {
    console.error('Resume Checker Route Error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// @route   GET /api/resume/history
// @desc    Retrieve user's historical resume scan audits
router.get('/history', protect, async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const history = await db.getResumeChecks(userId);
    res.json(history);
  } catch (error) {
    console.error('Fetch Resume History Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
