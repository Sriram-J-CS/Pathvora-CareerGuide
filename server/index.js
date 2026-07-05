const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/careeros';

// Middlewares
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Database connection
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Successfully connected to MongoDB database.'))
  .catch(err => {
    console.error('MongoDB database connection error:', err);
    console.log('Ensure you have a MongoDB instance running or configure MONGODB_URI in your .env file.');
  });

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/onboarding', require('./routes/onboarding'));
app.use('/api/quiz', require('./routes/quiz'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/journal', require('./routes/journal'));
app.use('/api/roadmap', require('./routes/roadmap'));
app.use('/api/resume', require('./routes/resume'));
app.use('/api/chatbot', require('./routes/chatbot'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/jobs', require('./routes/jobs'));

// Basic health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Pathvora CareerGuide API is fully functional' });
});

// Production Setup: Serve static build files if in production mode
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client', 'dist', 'index.html'));
  });
}

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Global Server Error Log:', err.stack);
  res.status(500).json({ error: err.message || 'Internal server error occurred. Please check logs.' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Pathvora CareerGuide API Server is running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode.`);
});
