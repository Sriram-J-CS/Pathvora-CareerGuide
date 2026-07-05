const mongoose = require('mongoose');

const trendingDomainSchema = new mongoose.Schema({
  domain: {
    type: String,
    required: true,
    unique: true
  },
  demand_score: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  avg_salary_range: {
    type: String,
    required: true
  },
  last_updated: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('TrendingDomain', trendingDomainSchema);
