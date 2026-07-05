const mongoose = require('mongoose');

const resumeCheckSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  toRemove: {
    type: [String],
    default: []
  },
  toAdd: {
    type: [String],
    default: []
  },
  formattingIssues: {
    type: [String],
    default: []
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ResumeCheck', resumeCheckSchema);
