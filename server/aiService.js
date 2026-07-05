const db = require('./db');
const fs = require('fs');
const path = require('path');

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY;
const isClaudeAvailable = !!ANTHROPIC_API_KEY;
const ERRORS_LOG_FILE = path.join(__dirname, '../data_db/errors.log');

// Helper: Call Claude API via standard HTTP fetch with 1 automatic retry
const callClaude = async (prompt, systemInstruction = '', retries = 1) => {
  if (!isClaudeAvailable) {
    throw new Error('Claude API Key is not configured');
  }

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          model: 'claude-3-5-haiku-20241022',
          max_tokens: 2048,
          system: systemInstruction || 'You are an elite career intelligence counselor for Indian students.',
          messages: [{ role: 'user', content: prompt }]
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error?.message || 'Error communicating with Claude');
      }

      return data.content[0].text;
    } catch (error) {
      console.warn(`[AI Calling] Failed attempt ${attempt + 1}/${retries + 1}: ${error.message}`);
      
      if (attempt === retries) {
        // Permanent failure: Log to local error log file
        try {
          const logDir = path.dirname(ERRORS_LOG_FILE);
          if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir, { recursive: true });
          }
          const errorEntry = `
========================================
[AI ERROR] Timestamp: ${new Date().toISOString()}
Prompt: ${prompt.substring(0, 500)}${prompt.length > 500 ? '...' : ''}
Error Message: ${error.message}
Stack Trace:
${error.stack}
========================================
`;
          fs.appendFileSync(ERRORS_LOG_FILE, errorEntry, 'utf-8');
          console.error('[AI Fatal Error] Stack trace logged to data_db/errors.log');
        } catch (logErr) {
          console.error('Failed writing to local errors log:', logErr);
        }
        throw error;
      }
    }
  }
};

// ==========================================
// COMPREHENSIVE MOCK AI SYSTEM (FALLBACK)
// ==========================================

const mockAIEngine = {
  // 1. Evaluate quiz answers
  evaluateQuiz: (answers, stage) => {
    let counts = { Tech: 0, Business: 0, Sciences: 0, Arts: 0 };
    answers.forEach(ans => {
      const text = (ans.selectedOption || '').toLowerCase();
      if (text.includes('code') || text.includes('program') || text.includes('tech') || text.includes('computer')) counts.Tech++;
      else if (text.includes('business') || text.includes('finance') || text.includes('manage') || text.includes('market')) counts.Business++;
      else if (text.includes('science') || text.includes('biology') || text.includes('math') || text.includes('research')) counts.Sciences++;
      else if (text.includes('design') || text.includes('art') || text.includes('wireframe') || text.includes('layout')) counts.Arts++;
    });

    let topCat = 'Tech';
    let max = -1;
    Object.keys(counts).forEach(cat => {
      if (counts[cat] > max) {
        max = counts[cat];
        topCat = cat;
      }
    });

    const suggestions = {
      Tech: [
        { domain: 'AI & Machine Learning Engineering', reason: 'You demonstrate high logical capabilities and coding interests, matching computational algorithm designs.', highGrowth: true },
        { domain: 'Full-Stack Web Development', reason: 'You enjoy building tangible products and structuring cloud databases.', highGrowth: true },
        { domain: 'Cloud Infrastructure & Cybersecurity', reason: 'Your responses show concern for server security and scaling systems.', highGrowth: true }
      ],
      Business: [
        { domain: 'Product Management & Systems', reason: 'You show empathy, leadership, and structured roadmap coordinates.', highGrowth: true },
        { domain: 'Investment Banking & Finance', reason: 'You show mathematical preference combined with fiscal analytical interests.', highGrowth: false },
        { domain: 'Digital Marketing & Analytics', reason: 'You balance creative narratives with data metrics tracking.', highGrowth: false }
      ],
      Sciences: [
        { domain: 'Bio-Informatics & Allied Healthcare', reason: 'You bridge laboratory clinical interests with automated scripting tools.', highGrowth: true },
        { domain: 'Academic Science Research & Mathematics', reason: 'You show preference for solving equations and advanced fellowships.', highGrowth: false },
        { domain: 'Data Science & Biostatistics', reason: 'You enjoy reading scientific reports and graphing statistical variables.', highGrowth: true }
      ],
      Arts: [
        { domain: 'Spatial UI/UX Interface Design', reason: 'You prefer layouts wireframes in Figma, color typography, and spatial UX.', highGrowth: true },
        { domain: 'Graphic Design & Digital Branding', reason: 'You focus on brand campaigns and styling vector coordinates.', highGrowth: false },
        { domain: 'Creative Copywriting & Content Strategy', reason: 'You prefer writing copy hooks and script dialogue structures.', highGrowth: false }
      ]
    };

    return suggestions[topCat];
  },

  // 2. Generate roadmap steps
  generateRoadmapSteps: (stage, domain) => {
    const dom = (domain || 'Full-Stack Web Development');
    
    // Detailed guidelines builder depending on domain name
    const isTech = dom.toLowerCase().includes('web') || dom.toLowerCase().includes('machine') || dom.toLowerCase().includes('ai') || dom.toLowerCase().includes('cloud') || dom.toLowerCase().includes('data');

    if (isTech) {
      return [
        {
          month: 'Month 1-2',
          title: 'Syntax & Foundations',
          task: `Study core programming syntax (ES6+, Python variables, logic conditions, data types). Learn memory management, call stacks, basic algorithms (sorting, searching), and version control systems using Git commands (commit, push, branch).`,
          XAIDetails: {
            what: `Study Javascript ES6 (Arrow functions, Promises, async/await) or Python core structures, alongside basic console debugging.`,
            why: `A solid grasp of variables and memory execution prevents syntax compilation errors and scaling bottlenecks later.`,
            estimatedTime: '6 Weeks'
          }
        },
        {
          month: 'Month 3-4',
          title: 'Backend Systems & API Architecture',
          task: `Study how to set up Node.js runtimes, build server routes using Express.js middleware, structure REST API request endpoints (GET, POST, PUT, DELETE), and handle HTTP headers, sessions, and JWT tokens.`,
          XAIDetails: {
            what: `Study Express routing, token validation, secure CORS handshakes, and input sanitization parameters.`,
            why: `Modern clients rely on server API handshakes to sync state. Understanding routes and authentication is critical.`,
            estimatedTime: '8 Weeks'
          }
        },
        {
          month: 'Month 5-6',
          title: 'Database Normalization & Query Caching',
          task: `Study relational (PostgreSQL) vs non-relational (MongoDB) database architectures. Learn how to write Mongoose schemas, handle table joins/foreign keys, optimize database index structures, and configure Redis caching layers.`,
          XAIDetails: {
            what: `Study Mongoose schema modeling, index performance checks, and caching database queries using Redis.`,
            why: `Poorly indexed database queries cause application timeouts. Caching keeps latency under 50ms.`,
            estimatedTime: '6 Weeks'
          }
        },
        {
          month: 'Month 7-8',
          title: 'Frontend Frameworks & State Sync',
          task: `Study React component life cycles, client-side routing using React Router, state management hooks (useState, useEffect, useContext), and CSS utility classes (Tailwind layouts, HSL color tokens).`,
          XAIDetails: {
            what: `Study React component structure, state props passing, fetching API streams, and flexbox/grid alignments.`,
            why: `User interfaces require fluid, responsive render states. Hook lifecycles prevent unnecessary re-renders.`,
            estimatedTime: '4 Weeks'
          }
        },
        {
          month: 'Month 9-10',
          title: 'Cloud Containers & CI/CD Pipelines',
          task: `Study cloud virtualization concepts. Learn how to write Dockerfiles, build isolated container images, configure AWS EC2/S3 services, and establish automated GitHub actions compilation pipelines.`,
          XAIDetails: {
            what: `Study Docker containerization, AWS bucket configurations, and automated server build triggers.`,
            why: `Manual server deployments are error-prone. Virtualized containers ensure environment parity between dev and prod.`,
            estimatedTime: '4 Weeks'
          }
        },
        {
          month: 'Month 11-12',
          title: 'Mock Placement Assessments',
          task: `Practice explaining technical sprint problems (e.g. system design trade-offs, security handshakes) in text and oral audits. Take Mock coding challenges under time constraints.`,
          XAIDetails: {
            what: `Practice technical mock assessments, optimizing space/time complexity explanations (Big O notation).`,
            why: `Technical recruiters evaluate candidate communication and structural problem-solving under sprint constraints.`,
            estimatedTime: '8 Weeks'
          }
        }
      ];
    } else {
      // Non-tech / Creative / Business path guidelines
      return [
        {
          month: 'Month 1-2',
          title: 'Market Research & Core Metrics',
          task: `Study market positioning variables, customer demographic profiling, and core domain business models. Learn how to execute standard SWAT analyses and track user conversion metrics.`,
          XAIDetails: {
            what: `Study user interviews, demographic analysis, SWAT frameworks, and business coordinates.`,
            why: `All projects require market validation before committing resources.`,
            estimatedTime: '6 Weeks'
          }
        },
        {
          month: 'Month 3-4',
          title: 'Product Mockups & Wireframing',
          task: `Study layout visual design guidelines. Learn how to draw low-fidelity paper wireframes, compile brand style colors, and construct high-fidelity interactive component designs in Figma.`,
          XAIDetails: {
            what: `Study layout columns, HSL color combinations, button assets, and click flow prototypes.`,
            why: `Visual wireframes bridge client descriptions and developers builds, preventing alignment misunderstandings.`,
            estimatedTime: '8 Weeks'
          }
        },
        {
          month: 'Month 5-6',
          title: 'User Experience Auditing',
          task: `Study customer journey maps and behavioral analytics. Learn how to conduct accessibility audits, structure clear A/B tests, and gather raw feedback from telemetry channels.`,
          XAIDetails: {
            what: `Study accessibility standards, journey tracking maps, and user testing logs.`,
            why: `Friction points in UI coordinates lead to high user drop-off rates. UX research validates solutions.`,
            estimatedTime: '6 Weeks'
          }
        },
        {
          month: 'Month 7-8',
          title: 'Project Management & roadmaps',
          task: `Study agile software methodologies. Learn how to build Sprint plans, define task estimates, organize Kanban boards, and draft product lifecycle milestones.`,
          XAIDetails: {
            what: `Study Kanban workflows, task ticket writing, and roadmap Gantt chart coordinates.`,
            why: `Delivering complex platforms requires strict milestones alignment and stakeholder updates.`,
            estimatedTime: '4 Weeks'
          }
        },
        {
          month: 'Month 9-10',
          title: 'Placement Portfolio Showcase',
          task: `Build a clean personal brand showcase. Document case studies outlining the "problem statement, user research, wireframe iterations, and measured success outcomes" of your projects.`,
          XAIDetails: {
            what: `Study portfolio copywriting, case study logs, and corporate presentation decks.`,
            why: `Hiring managers verify problem-solving capacity by reading structured project case narratives.`,
            estimatedTime: '4 Weeks'
          }
        },
        {
          month: 'Month 11-12',
          title: 'Technical Case Interviews',
          task: `Practice presenting case study reviews and answering product/business strategy questions under assessment conditions. Highlight metrics improvement in mock tests.`,
          XAIDetails: {
            what: `Practice oral presentation mock reviews, focusing on conversion rates and metrics.`,
            why: `Firms check the candidate's strategic alignment and clarity of presentation.`,
            estimatedTime: '8 Weeks'
          }
        }
      ];
    }
  },

  // 3. Analyze resume
  analyzeResume: (text, targetJob) => {
    const lower = text.toLowerCase();
    let score = 55 + Math.floor(Math.random() * 25);
    const toRemove = ['Generic personal profiles', 'Bulky paragraph blocks of text'];
    const toAdd = [];
    const formattingIssues = [];

    if (!lower.includes('jwt') && !lower.includes('security')) {
      toAdd.push('Authentication mechanisms (e.g. JWT secure handshake)');
    }
    if (!lower.includes('redis') && !lower.includes('cache')) {
      toAdd.push('Performance metrics (e.g. Redis queries caching & latency optimizations)');
    }
    if (!lower.includes('docker') && !lower.includes('aws')) {
      toAdd.push('Cloud pipelines (e.g. AWS serverless, Docker containers)');
    }

    if (toAdd.length === 0) {
      score += 15;
      toAdd.push('More metrics on scale (e.g. improved speed by 25%)');
    }

    if (lower.includes('column') || text.length > 5000) {
      formattingIssues.push('Double-column layout (ATS favors single-column linear grids)');
    }
    formattingIssues.push('Remove graphic chart bars representing skill levels (ATS cannot index images)');

    return {
      score: Math.min(score, 98),
      toRemove,
      toAdd,
      formattingIssues
    };
  },

  // 4. Mock Interview feedback
  interviewFeedback: (question, answer) => {
    const lowerAns = answer.toLowerCase();
    let score = 'Medium';
    let strengths = 'You clearly state the definitions of the terms.';
    let improvements = 'Lacks description of performance latency, database cache structures, or security.';
    let sample = 'A stronger response: "I secure operations by checking token encryption handshakes over HTTPS, and implement Redis cache indices to keep database queries under 50ms latency."';

    if (lowerAns.includes('cache') || lowerAns.includes('redis') || lowerAns.includes('token') || lowerAns.includes('jwt')) {
      score = 'High';
      strengths = 'Excellent! You integrated key operational terminology (caching/tokens) demonstrating placement readiness.';
      improvements = 'Can expand slightly on team delegation or git branches.';
    }

    return { score, strengths, improvements, sample };
  },

  // 5. Success Fit Score
  successFit: (profile, domain) => {
    let score = 65 + Math.floor(Math.random() * 20);
    const factors = [
      { text: `Profile stream matches domain coordinates: +15%`, positive: true },
      { text: `Good educational milestones (completion years aligned): +10%`, positive: true }
    ];

    if (profile.personalDetails?.location?.toLowerCase().includes('bangalore') || profile.personalDetails?.location?.toLowerCase().includes('chennai')) {
      score += 5;
      factors.push({ text: 'Location corresponds to tech hub openings: +5%', positive: true });
    }

    factors.push({ text: 'Lacking cloud certifications (AWS/Google Cloud): -8%', positive: false });
    factors.push({ text: 'No live deployed project repositories: -5%', positive: false });

    return { score: Math.min(score, 98), factors };
  },

  // 6. Compare Careers
  compare: (dom1, dom2) => {
    return {
      title: `${dom1} vs ${dom2}`,
      comparison: {
        cost: { dom1: '₹1.5L - ₹4L (Certifications)', dom2: '₹3L - ₹10L (Specialized tuition)' },
        time: { dom1: '6 - 12 Months self study', dom2: '1 - 2 Years Degree' },
        difficulty: { dom1: 'High technical coding logic', dom2: 'Medium business alignment' },
        outlook: { dom1: '95% (High demand, scaling)', dom2: '88% (Moderate expansion)' },
        dayToDay: { dom1: 'Fixing compilation bottlenecks, managing databases', dom2: 'Meeting stakeholders, building wireframes, testing design components' }
      }
    };
  },

  // 7. Chatbot dialogue
  chatbotResponse: (msg, history, profile) => {
    const lower = msg.toLowerCase();
    const name = profile?.personalDetails?.name || 'Aspirant';
    const domain = profile?.selectedDomain || 'AI & Machine Learning Engineering';

    if (lower.includes('hello') || lower.includes('hi')) {
      return `Hello ${name}! I am your Pathvora Career Chatbot. I see your target domain is ${domain}. Ask me anything about skills gap or mock interview preparation!`;
    }
    if (lower.includes('resume') || lower.includes('ats')) {
      return `For your ${domain} resume, ensure you upload a PDF in our Resume Checker tab. Make sure it highlights JWT security handshakes and database cache latency optimizations.`;
    }
    if (lower.includes('roadmap') || lower.includes('3d')) {
      return `Your 3D Roadmap visualizes your steps month-by-month. Currently, you should focus on step 1: basic foundations of ${domain}.`;
    }
    if (lower.includes('interview') || lower.includes('mock')) {
      return `Let's practice! Go to our AI Mock Interview simulator in the sidebar, where I will ask you questions and grade your answers.`;
    }

    return `I have evaluated your query regarding "${msg}". To optimize your placement index for ${domain}, make sure you solve skills gaps using the Course Recommender and log your milestones.`;
  }
};

// ==========================================
// EXPOSED SERVICE ACTIONS
// ==========================================

const aiService = {
  logAndJournal: async (userId, title, prompt, response) => {
    try {
      await db.createJournalEntry({
        userId,
        title,
        promptSent: prompt,
        responseReceived: response
      });
    } catch (e) {
      console.error('Journal entry logger failed:', e);
    }
  },

  // Evaluate quiz
  evaluateQuiz: async (userId, answers, stage) => {
    const prompt = `Evaluate Onboarding Quiz. Answers: ${JSON.stringify(answers)}. Stage: ${stage}`;
    let resultText = '';
    
    if (isClaudeAvailable) {
      const systemMsg = 'You are a career counselor. Respond ONLY with a JSON array of 3 objects containing domain (string), reason (string), and highGrowth (boolean).';
      try {
        resultText = await callClaude(prompt, systemMsg);
        const parsed = JSON.parse(resultText);
        await aiService.logAndJournal(userId, 'Quiz Evaluation (AI Live)', prompt, resultText);
        return parsed;
      } catch (err) {
        console.warn('Claude evaluation failed. Swapping to Mock AI...');
      }
    }

    const mockRes = mockAIEngine.evaluateQuiz(answers, stage);
    resultText = JSON.stringify(mockRes);
    await aiService.logAndJournal(userId, 'Quiz Evaluation (Mock Fallback)', prompt, resultText);
    return mockRes;
  },

  // Generate roadmap steps
  generateRoadmap: async (userId, stage, domain) => {
    const prompt = `Generate a 6-month timeline roadmap for a ${stage} student targeting ${domain}.`;
    let resultText = '';

    if (isClaudeAvailable) {
      const systemMsg = 'Respond ONLY with a JSON array of 6 objects, each containing: month (string), title (string), task (string), and XAIDetails (object with what: string, why: string, estimatedTime: string).';
      try {
        resultText = await callClaude(prompt, systemMsg);
        const parsed = JSON.parse(resultText);
        await aiService.logAndJournal(userId, 'Roadmap Generation (AI Live)', prompt, resultText);
        return parsed;
      } catch (err) {
        console.warn('Claude roadmap generation failed. Swapping to Mock AI...');
      }
    }

    const mockRes = mockAIEngine.generateRoadmapSteps(stage, domain);
    resultText = JSON.stringify(mockRes);
    await aiService.logAndJournal(userId, 'Roadmap Generation (Mock Fallback)', prompt, resultText);
    return mockRes;
  },

  // Analyze Resume
  analyzeResume: async (userId, resumeText, targetJob) => {
    const prompt = `Grade resume against job title "${targetJob}". Resume text: ${resumeText}`;
    let resultText = '';

    if (isClaudeAvailable) {
      const systemMsg = 'Analyze the resume. Respond ONLY with a JSON object containing: score (number 0-100), toRemove (array of strings), toAdd (array of strings), and formattingIssues (array of strings).';
      try {
        resultText = await callClaude(prompt, systemMsg);
        const parsed = JSON.parse(resultText);
        await aiService.logAndJournal(userId, 'Resume Analysis (AI Live)', prompt, resultText);
        return parsed;
      } catch (err) {
        console.warn('Claude resume audit failed. Swapping to Mock AI...');
      }
    }

    const mockRes = mockAIEngine.analyzeResume(resumeText, targetJob);
    resultText = JSON.stringify(mockRes);
    await aiService.logAndJournal(userId, 'Resume Analysis (Mock Fallback)', prompt, resultText);
    return mockRes;
  },

  // Mock Interview feedback
  getInterviewFeedback: async (userId, question, answer, domain) => {
    const prompt = `Question: ${question}. Answer: ${answer}. Domain: ${domain}`;
    let resultText = '';

    if (isClaudeAvailable) {
      const systemMsg = 'Respond ONLY with a JSON object containing: score (string "High"|"Medium"|"Low"), strengths (string), improvements (string), and sample (string).';
      try {
        resultText = await callClaude(prompt, systemMsg);
        const parsed = JSON.parse(resultText);
        await aiService.logAndJournal(userId, 'Mock Interview Feedback (AI Live)', prompt, resultText);
        return parsed;
      } catch (err) {
        console.warn('Claude interview grading failed. Swapping to Mock AI...');
      }
    }

    const mockRes = mockAIEngine.interviewFeedback(question, answer);
    resultText = JSON.stringify(mockRes);
    await aiService.logAndJournal(userId, 'Mock Interview Feedback (Mock Fallback)', prompt, resultText);
    return mockRes;
  },

  // Success Fit Score
  computeFitScore: async (userId, profile, domain) => {
    const prompt = `Compute fit score for target: ${domain}. Profile parameters: ${JSON.stringify(profile)}`;
    let resultText = '';

    if (isClaudeAvailable) {
      const systemMsg = 'Respond ONLY with a JSON object containing: score (number 0-100) and factors (array of objects with text: string and positive: boolean).';
      try {
        resultText = await callClaude(prompt, systemMsg);
        const parsed = JSON.parse(resultText);
        await aiService.logAndJournal(userId, 'Success Fit Score (AI Live)', prompt, resultText);
        return parsed;
      } catch (err) {
        console.warn('Claude fit score evaluation failed. Swapping to Mock AI...');
      }
    }

    const mockRes = mockAIEngine.successFit(profile, domain);
    resultText = JSON.stringify(mockRes);
    await aiService.logAndJournal(userId, 'Success Fit Score (Mock Fallback)', prompt, resultText);
    return mockRes;
  },

  // Career Comparison Tool
  compareCareers: async (userId, domainA, domainB) => {
    const prompt = `Compare Career Domain ${domainA} with ${domainB}.`;
    let resultText = '';

    if (isClaudeAvailable) {
      const systemMsg = 'Respond ONLY with a JSON object containing: title (string) and comparison (object containing fields cost, time, difficulty, outlook, dayToDay. Each field should be an object with dom1 (string) and dom2 (string) properties).';
      try {
        resultText = await callClaude(prompt, systemMsg);
        const parsed = JSON.parse(resultText);
        await aiService.logAndJournal(userId, 'Career Comparison (AI Live)', prompt, resultText);
        return parsed;
      } catch (err) {
        console.warn('Claude comparison failed. Swapping to Mock AI...');
      }
    }

    const mockRes = mockAIEngine.compare(domainA, domainB);
    resultText = JSON.stringify(mockRes);
    await aiService.logAndJournal(userId, 'Career Comparison (Mock Fallback)', prompt, resultText);
    return mockRes;
  },

  // Floating chatbot dialogue
  getChatResponse: async (userId, message, history, profile) => {
    const prompt = `Message: ${message}. History: ${JSON.stringify(history)}. Profile context: ${JSON.stringify(profile)}`;
    let responseText = '';

    if (isClaudeAvailable) {
      const systemMsg = `You are a floating career advisor chatbot. Speak directly to the user. User profile details: ${JSON.stringify(profile)}. Keep responses helpful and under 3 sentences.`;
      try {
        responseText = await callClaude(prompt, systemMsg);
        return responseText;
      } catch (err) {
        console.warn('Claude chat failed. Swapping to Mock AI...');
      }
    }

    responseText = mockAIEngine.chatbotResponse(message, history, profile);
    return responseText;
  }
};

module.exports = aiService;
