const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const { protect } = require('../middleware/authMiddleware');
const { sendEmail } = require('../emailService');

const JWT_SECRET = process.env.JWT_SECRET || 'careeros-super-secret-key-2026';

const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// @route   POST /api/auth/register
// @desc    Register a new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address' });
    }

    const trimmedName = name.trim();
    if (trimmedName.length < 3) {
      return res.status(400).json({ error: 'Name must be at least 3 characters long' });
    }
    if (/^(.)\1{2,}$/.test(trimmedName)) {
      return res.status(400).json({ error: 'Invalid name format. Character repetitions detected.' });
    }

    const userExists = await db.getUserByEmail(email);
    if (userExists) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await db.createUser({
      name: trimmedName,
      email: email.toLowerCase(),
      passwordHash,
      role: 'student'
    });

    // Send welcome email immediately on signup
    const welcomeSubject = 'Welcome to Pathvora CareerGuide!';
    const welcomeText = `Hello ${trimmedName},

Welcome to Pathvora CareerGuide! We are thrilled to help you navigate your academic and professional journey. Whether you are aiming to decide on a course of study, bridge technical skill gaps, or audit your credentials, our platform is here to support you at every milestone.

Pathvora CareerGuide is a fully AI-powered platform. Every roadmap, career suggestion, resume audit, and chatbot response is generated specifically for you using your unique profile context—no generic advice. As you explore, be sure to check out our 3D Career Roadmap timeline, the AI Resume checker, our Job Explorer, and the persistent floating AI Counselor chatbot.

Wishing you the very best in your career journey!

Sincerely,
The Pathvora CareerGuide Team`;

    // Fire email asynchronously (doesn't block user register response)
    sendEmail({
      to: email.toLowerCase(),
      subject: welcomeSubject,
      text: welcomeText
    }).catch(err => console.error('Failed sending welcome email:', err));

    const token = jwt.sign({ userId: user._id || user.id }, JWT_SECRET, { expiresIn: '7d' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(201).json({
      message: 'Account created successfully',
      token,
      user: {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user and get token
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await db.getUserByEmail(email);
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id || user.id }, JWT_SECRET, { expiresIn: '7d' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// @route   POST /api/auth/logout
// @desc    Clear JWT Cookie
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
});

// @route   GET /api/auth/me
// @desc    Get user session details
router.get('/me', protect, async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const profile = await db.getProfileByUserId(userId);
    res.json({
      user: {
        id: userId,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        isOnboarded: !!(profile && profile.quizCompleted)
      }
    });
  } catch (error) {
    console.error('Session Check Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
