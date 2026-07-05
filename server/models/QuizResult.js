const mongoose = require('mongoose');

const quizResultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  quizType: {
    type: String,
    enum: ['aptitude', 'ug-unsure', 'pg-fit'],
    required: true
  },
  answers: [{
    questionId: Number,
    questionText: String,
    selectedOption: String
  }],
  recommendedDomains: [{
    domain: String,
    reason: String,
    highGrowth: Boolean
  }],
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('QuizResult', quizResultSchema);
