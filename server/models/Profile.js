const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  onboardingStep: {
    type: Number,
    default: 1
  },
  personalDetails: {
    age: Number,
    gender: String,
    phone: String,
    location: String,
    preferredLanguage: String
  },
  educationStage: {
    type: String,
    enum: ['12th', 'UG', 'PG'],
    required: true
  },
  educationStatus: {
    type: String,
    enum: ['completed', 'pursuing'],
    required: true
  },
  educationDetails: {
    schoolName: String,
    board: String,
    stream: String,
    collegeName: String,
    degree: String,
    specialization: String,
    completionYear: Number
  },
  directionStatus: {
    knownDomain: String,          // For 12th "Yes" path
    postGradGoal: String,         // 'job' | 'studies' | 'unsure' (for UG)
    pgLeaning: String             // 'research' | 'industry' (for PG)
  },
  quizCompleted: {
    type: Boolean,
    default: false
  },
  selectedDomain: {
    type: String
  },
  recommendedDomains: [{
    domain: String,
    reason: String,
    highGrowth: Boolean
  }],
  skillsGapChecklist: [{
    skill: String,
    status: {
      type: String,
      enum: ['Not Started', 'In Progress', 'Completed'],
      default: 'Not Started'
    },
    resources: String,
    timeline: String
  }],
  roadmap: [{
    month: String,
    task: String,
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Completed'],
      default: 'Pending'
    }
  }],
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Profile', profileSchema);
