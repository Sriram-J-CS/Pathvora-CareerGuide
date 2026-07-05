const express = require('express');
const router = express.Router();
const db = require('../db');
const { sendEmail } = require('../emailService');

// @route   POST /api/contact/submit
// @desc    Submit name, email, subject, and message. Send mail & log to database.
router.post('/submit', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (!['Complaint', 'Suggestion', 'Bug', 'Other'].includes(subject)) {
      return res.status(400).json({ error: 'Invalid message subject' });
    }

    // Save in database
    const loggedMessage = await db.createContactMessage({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject,
      message: message.trim()
    });

    // Send email to pathvoracareerguide@gmail.com
    const emailBody = `
Pathvora CareerGuide Contact Form Submission
---------------------------------------------
Timestamp: ${new Date().toISOString()}
Sender Name: ${name.trim()}
Sender Email: ${email.trim().toLowerCase()}
Subject Category: ${subject}

Message Body:
${message.trim()}
`;

    // Fire email asynchronously (won't crash the server if SMTP fails)
    sendEmail({
      to: 'pathvoracareerguide@gmail.com',
      subject: `[${subject}] Contact Form - ${name.trim()}`,
      text: emailBody
    }).catch(err => console.error('Failed delivering support mail:', err));

    res.json({
      message: 'Thank you! Your feedback has been received. Our team will review it shortly.',
      id: loggedMessage._id || loggedMessage.id
    });

  } catch (error) {
    console.error('Contact Submit Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
