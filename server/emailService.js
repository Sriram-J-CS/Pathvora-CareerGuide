const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

const LOG_FILE = path.join(__dirname, '../data_db/emails.log');

// Helper to write to local email log
const logEmailLocal = (mailOptions) => {
  const logDir = path.dirname(LOG_FILE);
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  const logEntry = `
========================================
[EMAIL LOGGED] Timestamp: ${new Date().toISOString()}
From: ${mailOptions.from}
To: ${mailOptions.to}
Subject: ${mailOptions.subject}
Body:
${mailOptions.text}
========================================
`;
  
  fs.appendFileSync(LOG_FILE, logEntry, 'utf-8');
  console.log(`[Email Fallback] Email to ${mailOptions.to} written to data_db/emails.log`);
};

// Create transporter
let transporter = null;
const isSMTPConfigured = process.env.SMTP_USER && process.env.SMTP_PASS;

if (isSMTPConfigured) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 465,
    secure: process.env.SMTP_SECURE !== 'false', // default true for port 465
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
}

const sendEmail = async (options) => {
  const mailOptions = {
    from: options.from || process.env.SMTP_FROM || 'no-reply@pathvoracareerguide.com',
    to: options.to,
    subject: options.subject,
    text: options.text
  };

  if (!isSMTPConfigured || !transporter) {
    logEmailLocal(mailOptions);
    return { success: true, logged: true };
  }

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('SMTP sending error. Falling back to local logging...', error.message);
    logEmailLocal(mailOptions);
    return { success: true, logged: true, error: error.message };
  }
};

module.exports = { sendEmail };
