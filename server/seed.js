const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const TrendingDomain = require('./models/TrendingDomain');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/careeros';

const domains = [
  { domain: 'AI & Machine Learning Engineering', demand_score: 95, avg_salary_range: '₹8 LPA - ₹25 LPA' },
  { domain: 'Full-Stack Web Development', demand_score: 90, avg_salary_range: '₹6 LPA - ₹18 LPA' },
  { domain: 'Cloud Infrastructure & Cybersecurity', demand_score: 88, avg_salary_range: '₹7 LPA - ₹20 LPA' },
  { domain: 'Product Management & Systems', demand_score: 85, avg_salary_range: '₹8 LPA - ₹22 LPA' },
  { domain: 'Spatial UI/UX Interface Design', demand_score: 82, avg_salary_range: '₹5 LPA - ₹15 LPA' },
  { domain: 'Bio-Informatics & Allied Healthcare', demand_score: 80, avg_salary_range: '₹5 LPA - ₹12 LPA' }
];

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    // Connect with a 2-second timeout to check if service exists
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 2000 });
    console.log('Connected. Seeding trending domains in live MongoDB...');

    await TrendingDomain.deleteMany({});
    await TrendingDomain.insertMany(domains);

    console.log('Trending domains seeded successfully in live MongoDB!');
    process.exit(0);
  } catch (error) {
    console.warn('\n⚠️ MongoDB service connection failed. Fallback: Seeding local JSON database instead...');
    console.warn(`Reason: ${error.message}\n`);
    
    try {
      const JSON_DIR = path.join(__dirname, '../data_db');
      if (!fs.existsSync(JSON_DIR)) {
        fs.mkdirSync(JSON_DIR, { recursive: true });
      }
      
      const filePath = path.join(JSON_DIR, 'trending_domains.json');
      fs.writeFileSync(filePath, JSON.stringify(domains, null, 2), 'utf-8');
      
      console.log('✔ Trending domains successfully seeded in local fallback file:');
      console.log(`  ${filePath}`);
      process.exit(0);
    } catch (fsError) {
      console.error('Fatal error seeding local JSON database:', fsError);
      process.exit(1);
    }
  }
}

seed();
