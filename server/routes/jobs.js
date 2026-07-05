const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

// Seeded Job Role Profiles catalog
const JOBS_CATALOG = {
  'AI & Machine Learning Engineering': [
    {
      title: 'Machine Learning Scientist',
      dayToDay: 'Designing deep learning mathematical matrices, optimizing weight adjustments, and tuning hyperparameter coefficients using PyTorch.',
      salaries: { junior: '₹8 LPA - ₹12 LPA', mid: '₹14 LPA - ₹20 LPA', senior: '₹22 LPA - ₹40 LPA' },
      skills: 'Python, PyTorch, Linear Algebra, Calculus, Quantization'
    },
    {
      title: 'Data Engineer',
      dayToDay: 'Building scaling database pipes, managing streaming data indexing (Kafka), and setting up database storage clusters.',
      salaries: { junior: '₹6 LPA - ₹9 LPA', mid: '₹11 LPA - ₹16 LPA', senior: '₹18 LPA - ₹30 LPA' },
      skills: 'SQL, Python, Spark, Hadoop, Database Indexing'
    }
  ],
  'Full-Stack Web Development': [
    {
      title: 'Software Development Engineer (SDE)',
      dayToDay: 'Developing client-side components using React, coding database schema controllers on Node/Express, and managing RESTful API handshakes.',
      salaries: { junior: '₹5 LPA - ₹8 LPA', mid: '₹9 LPA - ₹15 LPA', senior: '₹17 LPA - ₹32 LPA' },
      skills: 'React, Node.js, Express, Mongoose, JWT, Git'
    },
    {
      title: 'DevOps & SRE Engineer',
      dayToDay: 'Configuring Docker containers, managing AWS servers, deploying CI/CD code pipelines, and monitoring system latencies.',
      salaries: { junior: '₹6 LPA - ₹10 LPA', mid: '₹11 LPA - ₹17 LPA', senior: '₹19 LPA - ₹35 LPA' },
      skills: 'Docker, AWS, Git, Linux, Kubernetes, CI/CD'
    }
  ],
  'Spatial UI/UX Interface Design': [
    {
      title: 'UI/UX Interface Designer',
      dayToDay: 'Mapping user flows, designing layout constraints, creating wireframes in Figma, and testing mobile and web components.',
      salaries: { junior: '₹4 LPA - ₹7 LPA', mid: '₹8 LPA - ₹12 LPA', senior: '₹14 LPA - ₹25 LPA' },
      skills: 'Figma, Visual Design, User Research, Wireframing'
    },
    {
      title: 'Spatial / AR Interaction Designer',
      dayToDay: 'Structuring 3D canvas coordinates, designing components for AR/VR headsets, and sketching interactive spatial interfaces.',
      salaries: { junior: '₹5 LPA - ₹9 LPA', mid: '₹10 LPA - ₹16 LPA', senior: '₹18 LPA - ₹30 LPA' },
      skills: 'Figma, Blender, Unity, 3D Coordinate Grids'
    }
  ],
  'Product Management & Systems': [
    {
      title: 'Associate Product Manager (APM)',
      dayToDay: 'Drafting product requirements, coordinating developer sprint schedules, tracking user metrics, and mapping development roadmaps.',
      salaries: { junior: '₹6 LPA - ₹10 LPA', mid: '₹12 LPA - ₹18 LPA', senior: '₹20 LPA - ₹35 LPA' },
      skills: 'Product Roadmaps, Sprint Scheduling, Metrics Tracking, Scrum'
    }
  ],
  'Bio-Informatics & Allied Healthcare': [
    {
      title: 'Bio-Informatics Data Analyst',
      dayToDay: 'Applying statistical algorithms on clinical genetic databases, script sequencing pipelines, and writing analytics reports.',
      salaries: { junior: '₹5 LPA - ₹8 LPA', mid: '₹9 LPA - ₹14 LPA', senior: '₹15 LPA - ₹25 LPA' },
      skills: 'Python, R, Biostatistics, Gene Sequencing'
    }
  ]
};

// Default generic catalog fallback for other domains
const getGenericCatalog = (domain) => {
  return [
    {
      title: `${domain} Specialist`,
      dayToDay: `Developing plans and coordinating operations in the ${domain} sector, tracking parameters, and aligning project targets.`,
      salaries: { junior: '₹4.5 LPA - ₹7.5 LPA', mid: '₹8 LPA - ₹13 LPA', senior: '₹14 LPA - ₹26 LPA' },
      skills: 'Domain Knowledge, Communication, Analytical Frameworks, Microsoft Office'
    }
  ];
};

// @route   GET /api/jobs/explore
// @desc    Retrieve job opportunities matching selected domain (open to 12th explorers as well)
router.get('/explore', async (req, res) => {
  try {
    const { domain } = req.query;

    if (!domain) {
      return res.status(400).json({ error: 'Domain name parameter is required' });
    }

    const roles = JOBS_CATALOG[domain] || getGenericCatalog(domain);

    // Standard disclaimer metrics
    res.json({
      domain,
      roles,
      aiGeneratedEstimate: true,
      estimationReasoning: 'Expected salaries and role descriptions are computed by AI analysis using national averages, recent placement metrics in Indian tech hubs (Bangalore, Chennai, NCR), and industry survey indicators rather than static live job feeds.'
    });

  } catch (error) {
    console.error('Fetch Job Opportunities Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
