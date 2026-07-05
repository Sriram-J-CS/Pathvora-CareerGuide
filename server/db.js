const User = require('./models/User');
const Profile = require('./models/Profile');
const TrendingDomain = require('./models/TrendingDomain');
const QuizResult = require('./models/QuizResult');
const ConfidenceCheck = require('./models/ConfidenceCheck');
const JournalEntry = require('./models/JournalEntry');
const RoadmapStep = require('./models/RoadmapStep');
const ResumeCheck = require('./models/ResumeCheck');
const ChatHistory = require('./models/ChatHistory');
const ContactMessage = require('./models/ContactMessage');

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

let isMongoConnected = false;

// Monitor connection status
mongoose.connection.on('connected', () => {
  isMongoConnected = true;
  console.log('Database adapter switched to live MongoDB engine.');
});
mongoose.connection.on('disconnected', () => {
  isMongoConnected = false;
  console.log('Database adapter switched to local JSON file engine.');
});

// JSON fallback directory
const JSON_DIR = path.join(__dirname, '../data_db');
if (!fs.existsSync(JSON_DIR)) {
  fs.mkdirSync(JSON_DIR, { recursive: true });
}

const readJSON = (filename, defaultVal = []) => {
  const filePath = path.join(JSON_DIR, filename);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultVal, null, 2));
    return defaultVal;
  }
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch (e) {
    return defaultVal;
  }
};

const writeJSON = (filename, data) => {
  const filePath = path.join(JSON_DIR, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// Seed default trending domains in local JSON if empty
const seedLocalTrendingDomains = () => {
  const domains = readJSON('trending_domains.json', []);
  if (domains.length === 0) {
    const defaultDomains = [
      { domain: 'AI & Machine Learning Engineering', demand_score: 95, avg_salary_range: '₹8 LPA - ₹25 LPA' },
      { domain: 'Full-Stack Web Development', demand_score: 90, avg_salary_range: '₹6 LPA - ' },
      { domain: 'Cloud Infrastructure & Cybersecurity', demand_score: 88, avg_salary_range: '₹7 LPA - ₹20 LPA' },
      { domain: 'Product Management & Systems', demand_score: 85, avg_salary_range: '₹8 LPA - ₹22 LPA' },
      { domain: 'Spatial UI/UX Interface Design', demand_score: 82, avg_salary_range: '₹5 LPA - ' },
      { domain: 'Bio-Informatics & Allied Healthcare', demand_score: 80, avg_salary_range: '₹5 LPA - ₹12 LPA' }
    ];
    writeJSON('trending_domains.json', defaultDomains);
  }
};
seedLocalTrendingDomains();

const db = {
  isMongo: () => isMongoConnected,

  getUserByEmail: async (email) => {
    if (isMongoConnected) {
      return await User.findOne({ email: email.toLowerCase() });
    }
    const users = readJSON('users.json');
    const u = users.find(user => user.email.toLowerCase() === email.toLowerCase());
    return u ? { ...u, _id: u._id, id: u._id } : null;
  },

  createUser: async (userData) => {
    if (isMongoConnected) {
      return await User.create(userData);
    }
    const users = readJSON('users.json');
    const newUserId = 'usr_' + Math.random().toString(36).substring(2, 11);
    const newUser = {
      _id: newUserId,
      id: newUserId,
      ...userData,
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    writeJSON('users.json', users);
    return newUser;
  },

  getUserById: async (id) => {
    const targetId = id ? id.toString() : '';
    if (isMongoConnected) {
      return await User.findById(id);
    }
    const users = readJSON('users.json');
    const u = users.find(user => user._id === targetId || user.id === targetId);
    return u ? { ...u, _id: u._id, id: u._id } : null;
  },

  getProfileByUserId: async (userId) => {
    const uId = userId.toString();
    if (isMongoConnected) {
      return await Profile.findOne({ userId });
    }
    const profiles = readJSON('profiles.json');
    let profile = profiles.find(p => p.userId === uId);
    if (!profile) {
      profile = {
        userId: uId,
        onboardingStep: 1,
        personalDetails: {},
        educationStage: 'UG',
        educationStatus: 'pursuing',
        educationDetails: {},
        directionStatus: {},
        quizCompleted: false,
        recommendedDomains: [],
        skillsGapChecklist: [],
        roadmapGenerated: false
      };
    }
    
    profile.save = async function() {
      const list = readJSON('profiles.json');
      const idx = list.findIndex(p => p.userId === uId);
      const { save, ...cleanProfile } = this;
      if (idx >= 0) {
        list[idx] = { ...list[idx], ...cleanProfile };
      } else {
        list.push(cleanProfile);
      }
      writeJSON('profiles.json', list);
      return this;
    };
    return profile;
  },

  saveProfile: async (userId, profileData) => {
    const uId = userId.toString();
    if (isMongoConnected) {
      let profile = await Profile.findOne({ userId });
      if (!profile) {
        profile = new Profile({ userId, ...profileData });
      } else {
        Object.assign(profile, profileData);
      }
      return await profile.save();
    }
    
    const profiles = readJSON('profiles.json');
    const idx = profiles.findIndex(p => p.userId === uId);
    let profile = { userId: uId, ...profileData, updatedAt: new Date().toISOString() };
    
    if (idx >= 0) {
      profiles[idx] = { ...profiles[idx], ...profile };
    } else {
      profiles.push(profile);
    }
    writeJSON('profiles.json', profiles);
    return profile;
  },

  getTrendingDomains: async () => {
    if (isMongoConnected) {
      return await TrendingDomain.find({}).sort({ demand_score: -1 });
    }
    return readJSON('trending_domains.json').sort((a, b) => b.demand_score - a.demand_score);
  },

  createQuizResult: async (quizData) => {
    if (isMongoConnected) {
      return await QuizResult.create(quizData);
    }
    const quizResults = readJSON('quiz_results.json');
    const newResult = {
      _id: 'qrz_' + Math.random().toString(36).substring(2, 11),
      ...quizData,
      submittedAt: new Date().toISOString()
    };
    quizResults.push(newResult);
    writeJSON('quiz_results.json', quizResults);
    return newResult;
  },

  createJournalEntry: async (journalData) => {
    if (isMongoConnected) {
      return await JournalEntry.create(journalData);
    }
    const entries = readJSON('journal_entries.json');
    const newEntry = {
      _id: 'jrn_' + Math.random().toString(36).substring(2, 11),
      ...journalData,
      timestamp: new Date().toISOString()
    };
    entries.push(newEntry);
    writeJSON('journal_entries.json', entries);
    return newEntry;
  },

  getJournalEntries: async (userId) => {
    const uId = userId.toString();
    if (isMongoConnected) {
      return await JournalEntry.find({ userId }).sort({ timestamp: -1 });
    }
    return readJSON('journal_entries.json')
      .filter(e => e.userId === uId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  },

  createConfidenceCheck: async (checkData) => {
    if (isMongoConnected) {
      return await ConfidenceCheck.create(checkData);
    }
    const checks = readJSON('confidence_checks.json');
    const newCheck = {
      _id: 'cnf_' + Math.random().toString(36).substring(2, 11),
      ...checkData,
      timestamp: new Date().toISOString()
    };
    checks.push(newCheck);
    writeJSON('confidence_checks.json', checks);
    return newCheck;
  },

  getConfidenceHistory: async (userId) => {
    const uId = userId.toString();
    if (isMongoConnected) {
      return await ConfidenceCheck.find({ userId }).sort({ timestamp: 1 });
    }
    return readJSON('confidence_checks.json')
      .filter(c => c.userId === uId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  },

  // RoadmapSteps fallback methods
  getRoadmapSteps: async (userId) => {
    const uId = userId.toString();
    if (isMongoConnected) {
      return await RoadmapStep.find({ userId }).sort({ month: 1 });
    }
    const steps = readJSON('roadmap_steps.json');
    return steps.filter(s => s.userId === uId).map(s => {
      // Bind mock save method
      const mockStep = { ...s };
      mockStep.save = async function() {
        const list = readJSON('roadmap_steps.json');
        const idx = list.findIndex(item => item._id === this._id);
        const { save, ...cleanStep } = this;
        if (idx >= 0) {
          list[idx] = { ...list[idx], ...cleanStep };
        }
        writeJSON('roadmap_steps.json', list);
        return this;
      };
      return mockStep;
    });
  },

  createRoadmapStep: async (stepData) => {
    if (isMongoConnected) {
      return await RoadmapStep.create(stepData);
    }
    const steps = readJSON('roadmap_steps.json');
    const newStep = {
      _id: 'step_' + Math.random().toString(36).substring(2, 11),
      ...stepData,
      status: stepData.status || 'Pending',
      createdAt: new Date().toISOString()
    };
    steps.push(newStep);
    writeJSON('roadmap_steps.json', steps);
    return newStep;
  },

  saveRoadmapStepsBatch: async (userId, stepsList) => {
    const uId = userId.toString();
    if (isMongoConnected) {
      await RoadmapStep.deleteMany({ userId });
      return await RoadmapStep.insertMany(stepsList.map(s => ({ ...s, userId })));
    }
    const steps = readJSON('roadmap_steps.json');
    const filtered = steps.filter(s => s.userId !== uId);
    
    const formatted = stepsList.map((s, idx) => ({
      _id: `step_${uId}_${idx}`,
      userId: uId,
      ...s,
      status: s.status || 'Pending',
      createdAt: new Date().toISOString()
    }));

    writeJSON('roadmap_steps.json', [...filtered, ...formatted]);
    return formatted;
  },

  // Resume Checks fallback methods
  getResumeChecks: async (userId) => {
    const uId = userId.toString();
    if (isMongoConnected) {
      return await ResumeCheck.find({ userId }).sort({ timestamp: -1 });
    }
    return readJSON('resume_checks.json')
      .filter(r => r.userId === uId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  },

  createResumeCheck: async (checkData) => {
    if (isMongoConnected) {
      return await ResumeCheck.create(checkData);
    }
    const checks = readJSON('resume_checks.json');
    const newCheck = {
      _id: 'res_' + Math.random().toString(36).substring(2, 11),
      ...checkData,
      timestamp: new Date().toISOString()
    };
    checks.push(newCheck);
    writeJSON('resume_checks.json', checks);
    return newCheck;
  },

  // Chat History fallback methods
  getChatHistory: async (userId) => {
    const uId = userId.toString();
    if (isMongoConnected) {
      return await ChatHistory.findOne({ userId });
    }
    const list = readJSON('chat_histories.json');
    return list.find(c => c.userId === uId) || { userId: uId, messages: [] };
  },

  saveChatHistory: async (userId, messagesList) => {
    const uId = userId.toString();
    if (isMongoConnected) {
      return await ChatHistory.findOneAndUpdate(
        { userId },
        { messages: messagesList, lastActive: new Date() },
        { upsert: true, new: true }
      );
    }
    const list = readJSON('chat_histories.json');
    const idx = list.findIndex(c => c.userId === uId);
    const updated = {
      userId: uId,
      messages: messagesList,
      lastActive: new Date().toISOString()
    };
    if (idx >= 0) {
      list[idx] = updated;
    } else {
      list.push(updated);
    }
    writeJSON('chat_histories.json', list);
    return updated;
  },

  // Contact messages fallback methods
  createContactMessage: async (messageData) => {
    if (isMongoConnected) {
      return await ContactMessage.create(messageData);
    }
    const messages = readJSON('contact_messages.json');
    const newMsg = {
      _id: 'msg_' + Math.random().toString(36).substring(2, 11),
      ...messageData,
      timestamp: new Date().toISOString()
    };
    messages.push(newMsg);
    writeJSON('contact_messages.json', messages);
    return newMsg;
  }
};

module.exports = db;
