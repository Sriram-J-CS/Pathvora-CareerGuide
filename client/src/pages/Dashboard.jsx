import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  LineChart, Line, CartesianGrid 
} from 'recharts';
import { 
  LayoutDashboard, Compass, TrendingUp, FileText, 
  SlidersHorizontal, Award, Layers, 
  HelpCircle, BookOpen, ChevronRight, Sparkles, Send, 
  CheckCircle2, X, AlertCircle, Upload, Check, RefreshCw, Calendar, Target, GraduationCap 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Roadmap3D from '../components/Roadmap3D';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSandboxMode, setIsSandboxMode] = useState(false);

  // Core profile details
  const [profile, setProfile] = useState(null);
  const [overview, setOverview] = useState(null);

  // 1. Roadmap State
  const [roadmapSteps, setRoadmapSteps] = useState([]);
  const [selectedStep, setSelectedStep] = useState(null);
  const [updatingStepId, setUpdatingStepId] = useState(null);
  const [roadmapGenerating, setRoadmapGenerating] = useState(false);

  // 2. Market & Job Insights
  const [trendingDomains, setTrendingDomains] = useState([]);
  const [marketDomain, setMarketDomain] = useState('');
  const [marketReport, setMarketReport] = useState(null);
  const [marketLoading, setMarketLoading] = useState(false);

  // 3. AI ATS Resume Checker
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeTargetJob, setResumeTargetJob] = useState('');
  const [resumeAuditReport, setResumeAuditReport] = useState(null);
  const [resumeChecking, setResumeChecking] = useState(false);
  const [resumeHistory, setResumeHistory] = useState([]);

  // 4. Skill Gap & Learning Plan
  const [skillsChecklist, setSkillsChecklist] = useState([]);

  // 5. Fit & Confidence Score
  const [fitDomain, setFitDomain] = useState('');
  const [fitReport, setFitReport] = useState(null);
  const [fitLoading, setFitLoading] = useState(false);
  const [confidenceHistory, setConfidenceHistory] = useState([]);
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [checkInAnswers, setCheckInAnswers] = useState([7, 8, 7]);
  const [checkInSubmitting, setCheckInSubmitting] = useState(false);

  // 6. Path Comparison Simulator
  const [compareDomA, setCompareDomA] = useState('');
  const [compareDomB, setCompareDomB] = useState('');
  const [comparisonReport, setComparisonReport] = useState(null);
  const [comparisonLoading, setComparisonLoading] = useState(false);

  // 7. AI Mock Interview Simulator
  const [interviewDomain, setInterviewDomain] = useState('');
  const [interviewQuestion, setInterviewQuestion] = useState('Explain how you optimize database index query caching to keep latencies under 50ms in a high-traffic app.');
  const [interviewAnswer, setInterviewAnswer] = useState('');
  const [interviewFeedback, setInterviewFeedback] = useState(null);
  const [interviewEvaluating, setInterviewEvaluating] = useState(false);

  // 8. Decision Journal
  const [journalEntries, setJournalEntries] = useState([]);

  // Client Fetch Wrapper with 1 automatic retry
  const fetchWithRetry = async (url, options = {}, retries = 1) => {
    for (let i = 0; i <= retries; i++) {
      try {
        const res = await fetch(url, options);
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
        }
        return await res.json();
      } catch (err) {
        if (i === retries) {
          console.error(`Client fetch permanently failed for ${url}:`, err);
          throw err;
        }
        console.warn(`[Fetch Retry] Attempt ${i + 1} failed for ${url}. Retrying...`);
      }
    }
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const session = await fetchWithRetry('/api/auth/me');
      if (!session.user.isOnboarded) {
        navigate('/onboarding');
        return;
      }

      const profileData = await fetchWithRetry('/api/onboarding/profile');
      setProfile(profileData);
      setMarketDomain(profileData.selectedDomain || 'AI & Machine Learning Engineering');
      setFitDomain(profileData.selectedDomain || 'AI & Machine Learning Engineering');
      setInterviewDomain(profileData.selectedDomain || 'AI & Machine Learning Engineering');
      setSkillsChecklist(profileData.skillsGapChecklist || []);

      const steps = await fetchWithRetry('/api/roadmap/steps');
      setRoadmapSteps(steps);

      const overviewTelemetry = await fetchWithRetry('/api/dashboard/overview');
      setOverview(overviewTelemetry);

      const trends = await fetchWithRetry('/api/dashboard/trending');
      setTrendingDomains(trends);

      const confHistory = await fetchWithRetry('/api/dashboard/confidence-history');
      setConfidenceHistory(confHistory);

      const journal = await fetchWithRetry('/api/journal/entries');
      setJournalEntries(journal);

      const resHistory = await fetchWithRetry('/api/resume/history');
      setResumeHistory(resHistory);

    } catch (error) {
      console.warn('Backend connection failed. Switching to static client-side sandbox mode.');
      setIsSandboxMode(true);
      loadMockClientStates();
    } finally {
      setLoading(false);
    }
  };

  const loadMockClientStates = () => {
    const mockProfile = {
      name: 'Aspirant Student',
      email: 'student@pathvora.in',
      isOnboarded: true,
      quizCompleted: true,
      selectedDomain: 'AI & Machine Learning Engineering',
      educationStage: 'UG',
      educationStatus: 'pursuing',
      skillsGapChecklist: [
        { skill: 'Data Structures & Algorithms', status: 'Not Started', resources: 'freeCodeCamp DSA Curriculum', timeline: '3 Months' },
        { skill: 'Version Control (Git/GitHub)', status: 'Completed', resources: 'GitHub Skills labs and tutorials', timeline: '1 Week' },
        { skill: 'Express API Design & JWT Handshakes', status: 'Not Started', resources: 'Coursera Node backend specialization', timeline: '2 Months' }
      ]
    };
    setProfile(mockProfile);
    setMarketDomain('AI & Machine Learning Engineering');
    setFitDomain('AI & Machine Learning Engineering');
    setInterviewDomain('AI & Machine Learning Engineering');
    setSkillsChecklist(mockProfile.skillsGapChecklist);

    const mockSteps = [
      {
        _id: 'mock-1',
        month: 'Month 1-2',
        title: 'Syntax & Foundations',
        task: 'Study core programming syntax (ES6+, Python variables, logic conditions, data types). Learn memory management, call stacks, basic algorithms (sorting, searching), and version control systems using Git commands (commit, push, branch).',
        status: 'Completed',
        XAIDetails: {
          what: 'Study Javascript ES6 (Arrow functions, Promises, async/await) or Python core structures, alongside basic console debugging.',
          why: 'A solid grasp of variables and memory execution prevents syntax compilation errors and scaling bottlenecks later.',
          estimatedTime: '6 Weeks'
        }
      },
      {
        _id: 'mock-2',
        month: 'Month 3-4',
        title: 'Backend Systems & API Architecture',
        task: 'Study how to set up Node.js runtimes, build server routes using Express.js middleware, structure REST API request endpoints (GET, POST, PUT, DELETE), and handle HTTP headers, sessions, and JWT tokens.',
        status: 'In Progress',
        XAIDetails: {
          what: 'Study Express routing, token validation, secure CORS handshakes, and input sanitization parameters.',
          why: 'Modern clients rely on server API handshakes to sync state. Understanding routes and authentication is critical.',
          estimatedTime: '8 Weeks'
        }
      },
      {
        _id: 'mock-3',
        month: 'Month 5-6',
        title: 'Database Normalization & Query Caching',
        task: 'Study relational (PostgreSQL) vs non-relational (MongoDB) database architectures. Learn how to write Mongoose schemas, handle table joins/foreign keys, optimize database index structures, and configure Redis caching layers.',
        status: 'Pending',
        XAIDetails: {
          what: 'Study Mongoose schema modeling, index performance checks, and caching database queries using Redis.',
          why: 'Poorly indexed database queries cause application timeouts. Caching keeps latency under 50ms.',
          estimatedTime: '6 Weeks'
        }
      }
    ];
    setRoadmapSteps(mockSteps);
    setSelectedStep(mockSteps[1]);

    setOverview({
      selectedDomain: 'AI & Machine Learning Engineering',
      confidenceScore: 85,
      nextStep: mockSteps[1]
    });

    setTrendingDomains([
      { domain: 'AI & Machine Learning Engineering', demand_score: 95, avg_salary_range: '12-25 LPA' },
      { domain: 'Full-Stack Web Development', demand_score: 90, avg_salary_range: '8-18 LPA' },
      { domain: 'Cloud Infrastructure & Cybersecurity', demand_score: 85, avg_salary_range: '10-22 LPA' }
    ]);

    setConfidenceHistory([
      { score: 65, timestamp: Date.now() - 60*24*60*60*1000 },
      { score: 75, timestamp: Date.now() - 30*24*60*60*1000 },
      { score: 85, timestamp: Date.now() }
    ]);

    setJournalEntries([
      {
        title: 'SUCCESS FIT SCORE (SANDBOX MODE)',
        promptSent: 'Compute fit score for target: AI & Machine Learning Engineering. Parameters: {"educationStage":"UG","specialization":"CSE"}',
        responseReceived: '{"score":85,"factors":[{"text":"Profile matches domain criteria: +15%","positive":true},{"text":"Education timeline aligned: +10%","positive":true}]}',
        timestamp: new Date().toISOString()
      }
    ]);

    setResumeHistory([
      {
        _id: 'mock-resume-1',
        fileName: 'Sample_Aspirant_Resume.pdf',
        score: 82,
        timestamp: Date.now(),
        toRemove: ['Irrelevant high-school hobbies', 'Objective summary paragraphs'],
        toAdd: ['RESTful Web Services', 'React Hooks', 'Data Structures & Algorithms'],
        formattingIssues: ['Double columns cause scanning errors on older ATS systems']
      }
    ]);
  };

  useEffect(() => {
    fetchDashboardData();
  }, [navigate]);

  useEffect(() => {
    if (marketDomain && activeSection === 'jobs') {
      loadMarketDetails();
    }
  }, [marketDomain, activeSection]);

  useEffect(() => {
    if (fitDomain && activeSection === 'fit') {
      loadFitScore();
    }
  }, [fitDomain, activeSection]);

  const loadMarketDetails = async () => {
    setMarketLoading(true);
    try {
      if (isSandboxMode) {
        setMarketReport({
          aiGeneratedEstimate: true,
          estimationReasoning: 'Estimates generated using localized placement coordinates for Indian graduates.',
          roles: [
            {
              title: 'AI Development Engineer',
              dayToDay: 'Develop LLM architectures, fine-tune models, and manage semantic search vector layers.',
              skills: 'Python, PyTorch, LangChain, vector DBs',
              salaries: { junior: '8-12 LPA', mid: '15-20 LPA', senior: '25-45 LPA' }
            }
          ]
        });
        return;
      }
      const data = await fetchWithRetry(`/api/jobs/explore?domain=${encodeURIComponent(marketDomain)}`);
      setMarketReport(data);
    } catch (e) {
      console.error(e);
    } finally {
      setMarketLoading(false);
    }
  };

  const loadFitScore = async () => {
    setFitLoading(true);
    try {
      if (isSandboxMode) {
        setFitReport({
          score: 88,
          factors: [
            { text: 'Academic stream matches AI algorithms: +15%', positive: true },
            { text: 'Good milestones completed on Git and logic: +10%', positive: true },
            { text: 'Lacking production container certificates: -5%', positive: false }
          ]
        });
        return;
      }
      const data = await fetchWithRetry(`/api/dashboard/fit-score?domain=${encodeURIComponent(fitDomain)}`);
      setFitReport(data);
    } catch (e) {
      console.error(e);
    } finally {
      setFitLoading(false);
    }
  };

  const handleGenerateRoadmap = async () => {
    setRoadmapGenerating(true);
    try {
      if (isSandboxMode) {
        loadMockClientStates();
        return;
      }
      const data = await fetchWithRetry('/api/roadmap/generate', { method: 'POST' });
      setRoadmapSteps(data);
      const overviewTelemetry = await fetchWithRetry('/api/dashboard/overview');
      setOverview(overviewTelemetry);
    } catch (e) {
      alert('Failed to generate AI roadmap steps.');
    } finally {
      setRoadmapGenerating(false);
    }
  };

  const handleToggleStepStatus = async (stepId, currentStatus) => {
    if (isSandboxMode) {
      let nextStatus = 'In Progress';
      if (currentStatus === 'In Progress') nextStatus = 'Completed';
      else if (currentStatus === 'Completed') nextStatus = 'Pending';

      setRoadmapSteps(prev => prev.map(s => {
        if (s._id === stepId) {
          const updated = { ...s, status: nextStatus };
          if (selectedStep && selectedStep._id === stepId) setSelectedStep(updated);
          return updated;
        }
        return s;
      }));
      return;
    }

    setUpdatingStepId(stepId);
    let nextStatus = 'In Progress';
    if (currentStatus === 'In Progress') nextStatus = 'Completed';
    else if (currentStatus === 'Completed') nextStatus = 'Pending';

    try {
      const res = await fetch(`/api/roadmap/step/${stepId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
      });
      if (!res.ok) throw new Error('Status update failed');
      const data = await res.json();
      
      setRoadmapSteps(prev => prev.map(s => s._id === stepId ? data.step : s));
      if (selectedStep && selectedStep._id === stepId) {
        setSelectedStep(data.step);
      }

      const overviewTelemetry = await fetchWithRetry('/api/dashboard/overview');
      setOverview(overviewTelemetry);
    } catch (e) {
      alert('Error updating milestone status');
    } finally {
      setUpdatingStepId(null);
    }
  };

  const handleResumeScanSubmit = async (e) => {
    e.preventDefault();
    if (!resumeFile || !resumeTargetJob) return;

    setResumeChecking(true);
    setResumeAuditReport(null);

    if (isSandboxMode) {
      setTimeout(() => {
        const newReport = {
          _id: 'mock-res-' + Date.now(),
          fileName: resumeFile.name,
          score: Math.floor(Math.random() * 20) + 70,
          timestamp: Date.now(),
          toRemove: ['Objective statement', 'Excessive formatting shapes'],
          toAdd: ['RESTful Web Services', 'React Hooks', 'Data Structures', resumeTargetJob],
          formattingIssues: ['Avoid complex header layouts to prevent text parsing cutoffs']
        };
        setResumeAuditReport(newReport);
        setResumeHistory(prev => [newReport, ...prev]);
        setResumeFile(null);
        setResumeChecking(false);
      }, 1500);
      return;
    }

    const formData = new FormData();
    formData.append('resume', resumeFile);
    formData.append('targetJob', resumeTargetJob);

    try {
      const res = await fetch('/api/resume/check', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to scan resume');
      
      setResumeAuditReport(data.check);
      setResumeFile(null);
      
      const history = await fetchWithRetry('/api/resume/history');
      setResumeHistory(history);
    } catch (err) {
      alert(err.message || 'Error processing resume file.');
    } finally {
      setResumeChecking(false);
    }
  };

  const handleToggleSkill = async (skillIndex) => {
    const updated = [...skillsChecklist];
    const prevStatus = updated[skillIndex].status;
    updated[skillIndex].status = prevStatus === 'Completed' ? 'Not Started' : 'Completed';
    setSkillsChecklist(updated);

    if (isSandboxMode) return;

    try {
      await fetch('/api/onboarding/step', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ step: 4, data: profile.directionStatus })
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleConfidenceSubmit = async () => {
    setCheckInSubmitting(true);
    if (isSandboxMode) {
      setTimeout(() => {
        const avg = Math.round((checkInAnswers[0] + checkInAnswers[1] + checkInAnswers[2]) * 10 / 3);
        const newCheck = { score: avg, timestamp: Date.now() };
        setConfidenceHistory(prev => [...prev, newCheck]);
        setOverview(prev => ({ ...prev, confidenceScore: avg }));
        setShowCheckIn(false);
        setCheckInSubmitting(false);
      }, 1000);
      return;
    }

    try {
      const res = await fetch('/api/dashboard/confidence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: checkInAnswers })
      });
      if (!res.ok) throw new Error('Failed saving confidence rating');
      setShowCheckIn(false);
      
      const confHistory = await fetchWithRetry('/api/dashboard/confidence-history');
      setConfidenceHistory(confHistory);
      
      const overviewTelemetry = await fetchWithRetry('/api/dashboard/overview');
      setOverview(overviewTelemetry);
    } catch (e) {
      alert(e.message);
    } finally {
      setCheckInSubmitting(false);
    }
  };

  const handleInterviewSubmit = async (e) => {
    e.preventDefault();
    if (!interviewAnswer.trim() || interviewEvaluating) return;

    setInterviewEvaluating(true);
    setInterviewFeedback(null);

    if (isSandboxMode) {
      setTimeout(() => {
        setInterviewFeedback({
          score: 'High',
          strengths: 'Excellent use of industry keywords and architectural structure.',
          improvements: 'Consider mentioning backup fallback plans or caching details under load.',
          sample: 'To optimize DB queries under 50ms, index search keys on the table, and front it with a Redis cache using cache invalidation strategies.'
        });
        setInterviewEvaluating(false);
      }, 1500);
      return;
    }

    try {
      const data = await fetchWithRetry('/api/dashboard/interview/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: interviewQuestion,
          answer: interviewAnswer.trim(),
          domain: interviewDomain
        })
      });
      setInterviewFeedback(data);
    } catch (err) {
      alert('Mock interview evaluation failed. Verify backend logs.');
    } finally {
      setInterviewEvaluating(false);
    }
  };

  const handleCompareSubmit = async (e) => {
    e.preventDefault();
    if (!compareDomA || !compareDomB) return;

    setComparisonLoading(true);
    setComparisonReport(null);

    if (isSandboxMode) {
      setTimeout(() => {
        setComparisonReport({
          comparison: {
            cost: { dom1: 'Moderate ($1,200 avg tuition/year)', dom2: 'Slightly higher due to specialized compute lab tokens' },
            time: { dom1: '3-4 years standard academic progression', dom2: '2-3 years intensive master/sprint courses' },
            difficulty: { dom1: 'Medium (focused on design and logic scripting)', dom2: 'High (requires complex system algorithms)' },
            outlook: { dom1: 'Strong demand across all consumer startups', dom2: 'Critical growth in cybersecurity infrastructure sectors' },
            dayToDay: { dom1: `Building user experience coordinates for ${compareDomA}`, dom2: `Optimizing algorithms and managing pipelines for ${compareDomB}` }
          }
        });
        setComparisonLoading(false);
      }, 1200);
      return;
    }

    try {
      const data = await fetchWithRetry(`/api/dashboard/compare?domainA=${encodeURIComponent(compareDomA)}&domainB=${encodeURIComponent(compareDomB)}`);
      setComparisonReport(data);
    } catch (e) {
      alert('Career comparison failed.');
    } finally {
      setComparisonLoading(false);
    }
  };

  // Graph formatters
  const chartTrendingData = (trendingDomains || []).map(item => ({
    name: item.domain ? item.domain.split(' ')[0] : 'Unknown',
    fullName: item.domain || 'Unknown',
    score: item.demand_score || 0,
    salary: item.avg_salary_range || ''
  }));

  const chartConfidenceData = (confidenceHistory || []).map((item, idx) => ({
    name: `Month ${idx + 1}`,
    score: item.score || 0,
    date: item.timestamp ? new Date(item.timestamp).toLocaleDateString() : ''
  }));

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4 bg-slate-950">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-rose via-brand-blue to-brand-cyan animate-spin flex items-center justify-center text-white font-bold text-sm shadow-xl shadow-brand-blue/35">
          P
        </div>
        <p className="text-xs text-slate-400 animate-pulse font-mono font-bold tracking-widest uppercase">Syncing console data...</p>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4 bg-slate-950 p-6">
        <AlertCircle className="text-brand-rose animate-bounce" size={40} />
        <h3 className="text-md font-extrabold text-white uppercase tracking-wider font-mono">Telemetry Error</h3>
        <p className="text-xs text-slate-400 max-w-md text-center leading-relaxed">{errorMsg}</p>
        <button
          onClick={fetchDashboardData}
          className="py-2.5 px-5 bg-gradient-to-r from-brand-cyan to-brand-blue font-bold uppercase tracking-widest text-xs text-white rounded-xl shadow-lg transition-all flex items-center gap-1.5 cursor-pointer mt-4"
        >
          <RefreshCw size={12} />
          Retry Connection
        </button>
      </div>
    );
  }

  const isProfileEmpty = !profile || !profile.quizCompleted;

  // Sidebar links (Numbers removed, Senior Path Replay removed)
  const sidebarLinks = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'roadmap3d', label: '3D Career Roadmap', icon: Compass },
    { id: 'jobs', label: 'Market & Job Insights', icon: TrendingUp },
    { id: 'resume', label: 'AI Resume Checker', icon: FileText },
    { id: 'skills', label: 'Skill Gap & Plan', icon: SlidersHorizontal },
    { id: 'fit', label: 'Fit & Confidence', icon: Award },
    { id: 'compare', label: 'Path Comparison', icon: Layers },
    { id: 'interview', label: 'AI Mock Interview', icon: HelpCircle },
    { id: 'journal', label: 'Decision Journal', icon: BookOpen }
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row relative">
      
      {/* Decorative spotlights */}
      <div className="absolute top-[10%] left-[5%] w-[500px] h-[500px] bg-brand-cyan/5 glowing-spotlight pointer-events-none" />
      <div className="absolute bottom-[10%] right-[5%] w-[500px] h-[500px] bg-brand-purple/5 glowing-spotlight pointer-events-none" />

      {/* Sidebar Layout */}
      <aside className="w-full md:w-64 border-r border-border-subtle bg-black/60 backdrop-blur-xl flex flex-col justify-between shrink-0 relative z-25">
        <div className="flex flex-col">
          {/* Mobile Tab dropdown */}
          <div className="p-4 border-b border-border-subtle flex items-center justify-between md:hidden bg-slate-950/40">
            <span className="text-xs font-black text-white uppercase tracking-wider font-mono">Select Tab</span>
            <select
              value={activeSection}
              onChange={(e) => setActiveSection(e.target.value)}
              className="py-2 px-3 bg-slate-900 border border-border-subtle rounded-xl text-xs font-bold text-brand-cyan outline-none"
            >
              {sidebarLinks.map(link => (
                <option key={link.id} value={link.id}>{link.label}</option>
              ))}
            </select>
          </div>

          <div className="hidden md:block p-6 border-b border-border-subtle text-left">
            <span className="inline-flex items-center gap-1.5 text-[9px] font-black text-brand-cyan uppercase tracking-widest font-mono">
              <Sparkles size={10} className="animate-pulse" />
              Pathvora core
            </span>
            <h2 className="text-md font-black text-white mt-1 leading-none tracking-tight">Console Command</h2>
          </div>

          <nav className="hidden md:flex flex-col p-4 space-y-1.5 overflow-y-auto max-h-[70vh]">
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              const active = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setActiveSection(link.id)}
                  className={`w-full py-3 px-4 rounded-xl text-[11px] font-black text-left uppercase tracking-wider transition-all flex items-center gap-3 border cursor-pointer ${
                    active
                      ? 'bg-gradient-to-r from-brand-cyan/15 to-brand-blue/5 border-brand-cyan/30 text-brand-cyan shadow-md shadow-brand-cyan/5'
                      : 'border-transparent text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon size={14} className={active ? 'text-brand-cyan animate-pulse' : 'text-slate-500'} />
                  {link.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User profile details badge */}
        <div className="p-4 border-t border-border-subtle bg-slate-950/60 text-left space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-rose to-brand-blue flex items-center justify-center font-bold text-white uppercase text-xs font-mono shadow-md shadow-brand-rose/20">
              {user?.name ? user.name[0] : 'S'}
            </div>
            <div className="truncate">
              <h4 className="text-xs font-bold text-white truncate leading-none">{user?.name}</h4>
              <span className="text-[8px] font-extrabold text-slate-500 uppercase tracking-widest font-mono block mt-1">Aspirant account</span>
            </div>
          </div>
          <button
            onClick={async () => {
              await logout();
              navigate('/login');
            }}
            className="w-full py-2.5 rounded-xl border border-brand-rose/30 bg-brand-rose/5 text-brand-rose text-[9px] font-black uppercase tracking-widest text-center hover:bg-brand-rose/10 transition-all cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Workspace content */}
      <main className="flex-grow p-6 md:p-8 overflow-y-auto relative z-10 text-left flex flex-col justify-between">
        
        {isProfileEmpty ? (
          <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4 max-w-md mx-auto text-center">
            <Compass className="text-slate-650 animate-spin" size={44} />
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider font-mono">Onboarding Required</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-semibold">
              Please complete the initial diagnostic onboarding quiz to compile your AI telemetry parameters.
            </p>
            <button
              onClick={() => navigate('/onboarding')}
              className="py-3 px-6 bg-gradient-to-r from-brand-cyan via-brand-blue to-brand-purple hover:opacity-90 font-extrabold text-white text-xs uppercase tracking-widest rounded-xl transition-all mt-4 cursor-pointer shadow-lg shadow-brand-blue/20"
            >
              Start Diagnostic Wizard
            </button>
          </div>
        ) : (
          <div className="space-y-8 flex-grow">
            
            {/* STUNNING ACTIVE HEADER GAUGE */}
            <div className="glass-card p-5 border border-white/5 bg-gradient-to-r from-slate-900/50 to-black/30 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div>
                <span className="text-[8px] font-black text-brand-cyan tracking-widest uppercase font-mono bg-brand-cyan/10 px-2 py-0.5 rounded-md">
                  Active Career Twin profile
                </span>
                <h2 className="text-lg font-black text-white mt-1 leading-none font-display">
                  Welcome back, <span className="bg-gradient-to-r from-brand-cyan to-brand-blue bg-clip-text text-transparent">{user?.name}</span>!
                </h2>
              </div>

              {overview && (
                <div className="flex flex-wrap items-center gap-4 text-[10px] font-bold font-mono">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-border-subtle">
                    <Target className="text-brand-cyan" size={12} />
                    <span className="text-slate-400">Target:</span>
                    <strong className="text-white truncate max-w-[150px]">{overview.selectedDomain}</strong>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-border-subtle">
                    <GraduationCap className="text-brand-purple" size={12} />
                    <span className="text-slate-400">Stage:</span>
                    <strong className="text-white capitalize">{profile.educationStage} ({profile.educationStatus})</strong>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-border-subtle">
                    <Award className="text-brand-emerald" size={12} />
                    <span className="text-slate-400">Confidence:</span>
                    <strong className="text-brand-emerald">{overview.confidenceScore}%</strong>
                  </div>
                </div>
              )}
            </div>

            {/* TAB CONTENTS */}
            <AnimatePresence mode="wait">
              
              {/* 1. OVERVIEW */}
              {activeSection === 'overview' && overview && (
                <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                      { title: 'Current Stage', val: profile.educationStage, sub: `Status: ${profile.educationStatus}`, color: 'brand-blue', icon: GraduationCap },
                      { title: 'Chosen Specialization', val: overview.selectedDomain, sub: 'Target pathway active', color: 'brand-cyan', icon: Target },
                      { title: 'Latest Confidence Rating', val: `${overview.confidenceScore}%`, sub: 'Updated from monthly checks', color: 'brand-purple', icon: Award },
                      { title: 'Next Step Milestone', val: overview.nextStep ? overview.nextStep.title : 'None Pending', sub: overview.nextStep ? overview.nextStep.task : 'Roadmap complete!', color: 'brand-emerald', icon: Compass }
                    ].map((card, i) => {
                      const CardIcon = card.icon;
                      return (
                        <div 
                          key={i} 
                          className="p-5 rounded-2xl border border-white/5 bg-slate-900/25 hover:bg-slate-900/40 hover:border-brand-cyan/20 hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-40 group relative overflow-hidden text-left"
                        >
                          {/* Inner soft glow */}
                          <div className={`absolute top-0 right-0 w-24 h-24 bg-${card.color}/5 rounded-full blur-2xl group-hover:bg-${card.color}/10 transition-colors`} />
                          
                          <div className="flex justify-between items-center z-10">
                            <h4 className="text-[9px] font-extrabold uppercase tracking-widest text-slate-500">{card.title}</h4>
                            <CardIcon size={14} className="text-slate-400 group-hover:text-brand-cyan transition-colors" />
                          </div>
                          <div className="space-y-1 z-10">
                            <p className="text-md font-black text-white leading-tight truncate">{card.val}</p>
                            <p className="text-[9px] text-slate-400 font-bold">{card.sub}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="glass-card p-6 border border-brand-cyan/15 bg-brand-cyan/5 text-left space-y-3 relative overflow-hidden">
                    <div className="absolute -top-12 -right-12 w-32 h-32 bg-brand-cyan/5 rounded-full blur-2xl" />
                    <span className="inline-flex items-center gap-1.5 text-[9px] font-black text-brand-cyan uppercase tracking-widest font-mono">
                      <Sparkles size={11} className="animate-pulse" />
                      Counselor diagnostics telemetry
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                      "Your student stage coordinates are locked as <strong className="text-white capitalize">{profile.educationStage} ({profile.educationStatus})</strong> with path specialization in <strong className="text-brand-cyan">{profile.selectedDomain}</strong>. Ask the persistent floating AI Counselor chatbot (bottom right) for real-time portfolio reviews or upskilling tips."
                    </p>
                  </div>
                </motion.div>
              )}

              {/* 2. 3D CAREER ROADMAP */}
              {activeSection === 'roadmap3d' && (
                <motion.div key="roadmap3d" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                  
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Left Canvas Panel */}
                    <div className="lg:col-span-8 space-y-4">
                      {roadmapSteps.length === 0 ? (
                        <div className="h-[400px] md:h-[500px] glass-card flex flex-col items-center justify-center text-center p-6 space-y-4">
                          <Compass className="text-slate-550 animate-bounce" size={40} />
                          <h4 className="font-extrabold text-xs text-white uppercase tracking-widest font-mono">No active roadmap compiled</h4>
                          <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                            Your profile has a selected target domain, but the month-by-month AI milestone sequence is empty.
                          </p>
                          <button
                            onClick={handleGenerateRoadmap}
                            disabled={roadmapGenerating}
                            className="py-3 px-6 bg-gradient-to-r from-brand-cyan to-brand-blue font-bold uppercase tracking-widest text-xs text-white rounded-xl shadow-lg hover:opacity-90 transition-all cursor-pointer disabled:opacity-40"
                          >
                            {roadmapGenerating ? 'Compiling Nodes...' : 'Compile AI Career Milestones'}
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <Roadmap3D steps={roadmapSteps} onSelectStep={setSelectedStep} />
                          
                          {/* PROGRESS SIDE-LIST (Short titles next to the canvas) */}
                          <div className="p-4 glass-card border border-white/5 bg-slate-900/20 text-left">
                            <h4 className="text-[10px] font-black text-white uppercase tracking-wider mb-3">Milestone Progress Steps:</h4>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                              {roadmapSteps.map((step, idx) => {
                                const active = selectedStep && selectedStep._id === step._id;
                                // Concise short name: first 2 words
                                const shortName = step.title.split(' ').slice(0, 2).join(' ');
                                return (
                                  <button
                                    key={step._id}
                                    onClick={() => setSelectedStep(step)}
                                    className={`p-2.5 rounded-xl border text-[10px] text-left transition-all cursor-pointer ${
                                      active 
                                        ? 'bg-brand-cyan/10 border-brand-cyan/30 text-brand-cyan font-black' 
                                        : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'
                                    }`}
                                  >
                                    <div className="flex items-center justify-between">
                                      <span className="text-[8px] font-bold text-slate-500 font-mono block leading-none">{step.month}</span>
                                      {step.status === 'Completed' && <Check size={8} className="text-brand-emerald" />}
                                    </div>
                                    <span className="block mt-1 font-bold truncate">{shortName}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Right Detail Panel */}
                    <div className="lg:col-span-4">
                      <AnimatePresence mode="wait">
                        {selectedStep ? (
                          <motion.div 
                            key={selectedStep._id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="glass-card p-6 border border-brand-cyan/20 bg-black/45 space-y-5 text-left"
                          >
                            <div className="flex justify-between items-start border-b border-border-subtle pb-3">
                              <div>
                                <span className="text-[9px] font-bold text-brand-cyan uppercase font-mono">{selectedStep.month}</span>
                                <h3 className="font-extrabold text-sm text-white mt-0.5 leading-tight">{selectedStep.title}</h3>
                              </div>
                              <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase font-mono ${
                                selectedStep.status === 'Completed' ? 'bg-brand-emerald/10 border border-brand-emerald/30 text-brand-emerald' :
                                selectedStep.status === 'In Progress' ? 'bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan' :
                                'bg-slate-800 border border-slate-700 text-slate-450'
                              }`}>
                                {selectedStep.status}
                              </span>
                            </div>

                            <div className="space-y-4">
                              <div>
                                <h5 className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest font-mono">Detailed Study Guide:</h5>
                                <p className="text-xs text-slate-200 mt-1 leading-relaxed font-semibold">{selectedStep.task}</p>
                              </div>

                              {selectedStep.XAIDetails && (
                                <>
                                  <div className="p-3 rounded-xl bg-white/5 border border-border-subtle space-y-1">
                                    <h5 className="text-[9px] font-black text-brand-cyan uppercase tracking-widest font-mono">Target Concepts & Modules:</h5>
                                    <p className="text-xs text-slate-300 font-semibold">{selectedStep.XAIDetails.what}</p>
                                  </div>
                                  <div className="p-3 rounded-xl bg-white/5 border border-border-subtle space-y-1">
                                    <h5 className="text-[9px] font-black text-brand-cyan uppercase tracking-widest font-mono">Why does it matter?</h5>
                                    <p className="text-xs text-slate-350 leading-relaxed font-semibold italic">"{selectedStep.XAIDetails.why}"</p>
                                  </div>
                                  <div className="p-3 rounded-xl bg-white/5 border border-border-subtle flex justify-between items-center text-[10px]">
                                    <span className="font-bold text-slate-405">Estimated Study Time:</span>
                                    <span className="font-black text-brand-cyan font-mono">{selectedStep.XAIDetails.estimatedTime}</span>
                                  </div>
                                </>
                              )}
                            </div>

                            <button
                              onClick={() => handleToggleStepStatus(selectedStep._id, selectedStep.status)}
                              disabled={updatingStepId}
                              className="w-full py-3 bg-gradient-to-r from-brand-cyan to-brand-blue hover:opacity-90 font-bold uppercase tracking-widest text-xs text-white rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-6"
                            >
                              <CheckCircle2 size={13} />
                              {selectedStep.status === 'Completed' ? 'Reset Status to Pending' :
                               selectedStep.status === 'In Progress' ? 'Mark Completed' : 'Start Milestone'}
                            </button>
                          </motion.div>
                        ) : (
                          <div className="p-6 rounded-2xl border border-dashed border-border-subtle text-slate-500 text-xs py-12 text-center">
                            Click a 3D milestone sphere node on the canvas to load its detailed AI study guide
                          </div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* 3. MARKET & JOB INSIGHTS */}
              {activeSection === 'jobs' && (
                <motion.div key="jobs" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                  <div className="border-b border-border-subtle pb-4 flex flex-col md:flex-row justify-between md:items-end gap-4">
                    <div>
                      <h1 className="text-2xl font-black text-white font-display">Market & Job Insights</h1>
                      <p className="text-xs text-slate-400">High-growth sectors demand indices combined with job role pay scales</p>
                    </div>

                    <select
                      value={marketDomain}
                      onChange={(e) => setMarketDomain(e.target.value)}
                      className="py-2.5 px-4 bg-[#0a0c21] border border-border-subtle rounded-xl text-xs font-bold text-brand-cyan max-w-sm outline-none"
                    >
                      {trendingDomains.map((t, idx) => (
                        <option key={idx} value={t.domain}>{t.domain}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    <div className="lg:col-span-6 glass-card p-6 flex flex-col justify-between min-h-[400px]">
                      <h4 className="font-extrabold text-xs text-white uppercase tracking-wider mb-4">Live Domain Demand Growth Rates</h4>
                      <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={chartTrendingData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                            <XAxis dataKey="name" stroke="#64748b" fontSize={9} tickLine={false} />
                            <YAxis stroke="#64748b" fontSize={9} tickLine={false} domain={[0, 100]} />
                            <Tooltip 
                              contentStyle={{ background: '#0a0c21', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', fontSize: '10px' }}
                              labelStyle={{ color: '#fff', fontWeight: 'bold' }}
                            />
                            <Bar dataKey="score" fill="#a855f7" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="lg:col-span-6 space-y-4">
                      {marketLoading ? (
                        <div className="py-12 text-slate-500 text-xs font-semibold animate-pulse text-center">Querying market indices...</div>
                      ) : marketReport ? (
                        <div className="space-y-4">
                          {marketReport.aiGeneratedEstimate && (
                            <div className="p-4 rounded-xl bg-brand-cyan/5 border border-brand-cyan/15 space-y-1.5 text-left">
                              <span className="inline-flex items-center gap-1.5 text-[8px] font-black text-brand-cyan uppercase tracking-widest font-mono">
                                <Sparkles size={11} className="animate-pulse" />
                                AI-Generated Estimate Disclosure
                              </span>
                              <p className="text-[10px] text-slate-400 leading-relaxed font-semibold italic">
                                "{marketReport.estimationReasoning}"
                              </p>
                            </div>
                          )}

                          {marketReport.roles.map((role, idx) => (
                            <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-border-subtle text-left space-y-3 hover:border-brand-cyan/20 transition-all duration-300 hover:scale-[1.01]">
                              <div className="flex justify-between items-center border-b border-border-subtle pb-2">
                                <h5 className="font-extrabold text-xs text-white leading-none">{role.title}</h5>
                                <span className="text-[8px] font-bold text-slate-550 uppercase font-mono">Outcome Profile</span>
                              </div>

                              <div className="space-y-2 text-[10.5px] font-semibold">
                                <p><strong className="text-slate-450 uppercase text-[8px] block">Day-to-day work:</strong> {role.dayToDay}</p>
                                <p><strong className="text-slate-450 uppercase text-[8px] block">Target Skills:</strong> <span className="text-brand-cyan">{role.skills}</span></p>
                                
                                <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-[9px] text-center">
                                  <div className="p-1.5 rounded-lg bg-black/40 border border-border-subtle">
                                    <span className="text-slate-500 block uppercase font-bold text-[7.5px]">Junior</span>
                                    <strong className="text-white mt-0.5 block truncate">{role.salaries.junior}</strong>
                                  </div>
                                  <div className="p-1.5 rounded-lg bg-black/40 border border-border-subtle">
                                    <span className="text-slate-500 block uppercase font-bold text-[7.5px]">Mid-Level</span>
                                    <strong className="text-brand-cyan mt-0.5 block truncate">{role.salaries.mid}</strong>
                                  </div>
                                  <div className="p-1.5 rounded-lg bg-black/40 border border-border-subtle">
                                    <span className="text-slate-500 block uppercase font-bold text-[7.5px]">Senior</span>
                                    <strong className="text-brand-purple mt-0.5 block truncate">{role.salaries.senior}</strong>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-slate-500 text-xs py-6 text-center">Select target domain to explore job outcomes</div>
                      )}
                    </div>

                  </div>
                </motion.div>
              )}

              {/* 4. AI ATS RESUME CHECKER */}
              {activeSection === 'resume' && (
                <motion.div key="resume" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    <div className="lg:col-span-5 space-y-6">
                      <form onSubmit={handleResumeScanSubmit} className="glass-card p-5 space-y-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Target Job Title</label>
                          <input
                            type="text"
                            value={resumeTargetJob}
                            onChange={(e) => setResumeTargetJob(e.target.value)}
                            className="w-full p-3 glass-input text-xs font-semibold"
                            placeholder="e.g. Full-Stack Engineer"
                            required
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Select File (PDF/DOCX)</label>
                          <div className="border-2 border-dashed border-border-subtle rounded-2xl p-6 text-center hover:border-brand-cyan/45 transition-colors relative bg-black/20">
                            <input
                              type="file"
                              accept=".pdf,.docx"
                              onChange={(e) => setResumeFile(e.target.files[0])}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              required={!resumeFile}
                            />
                            <Upload className="mx-auto text-slate-500 mb-2" size={24} />
                            <span className="text-[10px] font-bold text-slate-400 uppercase block">
                              {resumeFile ? resumeFile.name : 'Upload File Here'}
                            </span>
                          </div>
                        </div>

                      <button
                        type="submit"
                        disabled={resumeChecking}
                        className="w-full py-3 bg-gradient-to-r from-brand-cyan via-brand-blue to-brand-purple hover:opacity-90 font-bold uppercase tracking-widest text-xs text-white rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        {resumeChecking ? 'Critiquing...' : 'Scan Resume File'}
                      </button>
                    </form>

                    <div className="space-y-3">
                      <h4 className="font-extrabold text-xs text-white uppercase tracking-wider">Historical Audit Logs</h4>
                      {resumeHistory.length === 0 ? (
                        <div className="text-slate-500 text-xs py-4 text-center">No resume scans tracked yet</div>
                      ) : (
                        resumeHistory.map((h, i) => (
                          <button
                            key={h._id || i}
                            onClick={() => setResumeAuditReport(h)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-border-subtle hover:border-brand-cyan/20 transition-all flex justify-between items-center text-left cursor-pointer"
                          >
                            <div>
                              <h5 className="font-bold text-xs text-slate-205 leading-none">{h.fileName}</h5>
                              <span className="text-[8px] font-bold text-slate-550 uppercase font-mono block mt-1">{new Date(h.timestamp).toLocaleDateString()}</span>
                            </div>
                            <span className="px-2 py-1 rounded bg-brand-cyan/10 border border-brand-cyan/35 text-brand-cyan font-black text-xs font-mono">
                              {h.score}%
                            </span>
                          </button>
                        ))
                      )}
                    </div>

                  </div>

                  <div className="lg:col-span-7">
                    <AnimatePresence mode="wait">
                      {resumeAuditReport ? (
                        <motion.div
                          key={resumeAuditReport._id || 'new'}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="glass-card p-6 space-y-6"
                        >
                          <div className="flex justify-between items-center border-b border-border-subtle pb-4">
                            <div>
                              <span className="text-[8px] font-black text-brand-purple tracking-widest uppercase block font-mono">Analysis Result</span>
                              <h3 className="text-md font-bold text-white leading-none mt-1">Audit Score Report</h3>
                            </div>
                            <div className="flex flex-col items-end">
                              <span className="text-2xl font-black text-brand-cyan font-mono leading-none">{resumeAuditReport.score}%</span>
                              <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1 font-mono">ATS compatibility</span>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div>
                              <h5 className="text-[9px] font-extrabold text-brand-rose uppercase tracking-widest font-mono">Omit / Remove Sections</h5>
                              <ul className="list-disc pl-4 text-xs text-slate-300 font-semibold space-y-1.5 mt-1">
                                {resumeAuditReport.toRemove.map((item, idx) => <li key={idx}>{item}</li>)}
                              </ul>
                            </div>

                            <div>
                              <h5 className="text-[9px] font-extrabold text-brand-emerald uppercase tracking-widest font-mono">Add Skills / Keywords</h5>
                              <ul className="list-disc pl-4 text-xs text-slate-300 font-semibold space-y-1.5 mt-1">
                                {resumeAuditReport.toAdd.map((item, idx) => <li key={idx}>{item}</li>)}
                              </ul>
                            </div>

                            <div>
                              <h5 className="text-[9px] font-extrabold text-brand-cyan uppercase tracking-widest font-mono">Formatting Issues</h5>
                              <ul className="list-disc pl-4 text-xs text-slate-305 font-semibold space-y-1.5 mt-1">
                                {resumeAuditReport.formattingIssues.map((item, idx) => <li key={idx}>{item}</li>)}
                              </ul>
                            </div>
                          </div>
                        </motion.div>
                      ) : (
                        <div className="p-6 rounded-2xl border border-dashed border-border-subtle text-slate-500 text-xs py-16 text-center">
                          Upload your resume file on the left to analyze and audit ATS parameters
                        </div>
                      )}
                    </AnimatePresence>
                  </div>

                </div>
              </motion.div>
            )}

            {/* 5. SKILL GAP & LEARNING PLAN */}
            {activeSection === 'skills' && (
              <motion.div key="skills" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                <div className="space-y-4 max-w-4xl">
                  {skillsChecklist.length === 0 ? (
                    <div className="text-slate-500 text-xs py-6 text-center">No skill gaps configured for your path</div>
                  ) : (
                    skillsChecklist.map((skill, index) => (
                      <div 
                        key={index} 
                        className="p-5 rounded-2xl bg-white/5 border border-border-subtle hover:border-brand-emerald/30 transition-all flex items-start gap-4 hover:scale-[1.01] duration-250"
                      >
                        <input 
                          type="checkbox"
                          checked={skill.status === 'Completed'}
                          onChange={() => handleToggleSkill(index)}
                          className="mt-1 cursor-pointer w-4 h-4 rounded text-brand-emerald focus:ring-brand-emerald focus:ring-offset-0 accent-brand-emerald"
                        />
                        <div className="space-y-2 text-left flex-grow">
                          <div className="flex justify-between items-start">
                            <h5 className={`font-bold text-xs ${skill.status === 'Completed' ? 'line-through text-slate-550' : 'text-slate-205'}`}>{skill.skill}</h5>
                            <span className="px-2 py-0.5 rounded bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan text-[8px] font-bold uppercase tracking-wider font-mono">
                              {skill.resources.toLowerCase().includes('coursera') ? 'Coursera Recommendation' : 'freeCodeCamp Core'}
                            </span>
                          </div>
                          
                          <p className="text-[10.5px] text-slate-400 leading-relaxed font-semibold">
                            <strong className="text-brand-emerald">Target Course/Platform:</strong> {skill.resources}
                          </p>
                          
                          <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono pt-1">
                            <span>Estimated Timeline to Complete: {skill.timeline}</span>
                            <a 
                              href="https://www.coursera.org" 
                              target="_blank" 
                              rel="noreferrer" 
                              className="text-brand-cyan hover:underline font-bold"
                            >
                              Visit platform coordinate
                            </a>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}

            {/* 6. FIT & CONFIDENCE SCORE */}
            {activeSection === 'fit' && (
              <motion.div key="fit" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                <div className="border-b border-border-subtle pb-4 flex flex-col md:flex-row justify-between md:items-end gap-4">
                  <div>
                    <h1 className="text-2xl font-black text-white font-display">Fit & Confidence Score</h1>
                    <p className="text-xs text-slate-400">AI success fit scoring combined with monthly confidence tracker indicators</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <select
                      value={fitDomain}
                      onChange={(e) => setFitDomain(e.target.value)}
                      className="py-2.5 px-4 bg-[#0a0c21] border border-border-subtle rounded-xl text-xs font-bold text-brand-cyan max-w-sm outline-none"
                    >
                      {trendingDomains.map((t, idx) => (
                        <option key={idx} value={t.domain}>{t.domain}</option>
                      ))}
                    </select>

                    <button
                      onClick={() => setShowCheckIn(true)}
                      className="py-2.5 px-4 rounded-xl border border-brand-cyan/20 bg-brand-cyan/10 text-brand-cyan text-[10px] font-bold uppercase tracking-widest hover:bg-brand-cyan hover:text-black transition-all cursor-pointer"
                    >
                      Check In
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  <div className="lg:col-span-5 space-y-6">
                    {fitLoading ? (
                      <div className="py-12 text-slate-500 text-xs font-semibold animate-pulse text-center">Loading fit telemetry...</div>
                    ) : fitReport ? (
                      <div className="glass-card p-5 space-y-5">
                        <div className="text-center flex flex-col items-center justify-center space-y-3">
                          <span className="text-[9px] font-black text-brand-cyan uppercase tracking-widest font-mono">AI Compatibility Score</span>
                          <div className="w-24 h-24 rounded-full border-4 border-brand-cyan/20 flex items-center justify-center relative">
                            <div className="absolute inset-2 rounded-full border border-dashed border-brand-cyan/30 flex items-center justify-center">
                              <span className="text-2xl font-black text-white font-mono leading-none">{fitReport.score}%</span>
                            </div>
                          </div>
                        </div>

                        <div className="border-t border-border-subtle pt-4 space-y-3 text-[11px] font-semibold text-left">
                          <h5 className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest font-mono">Breakdown Factors</h5>
                          {fitReport.factors.map((f, i) => (
                            <div key={i} className="flex items-start gap-2">
                              <span className={f.positive ? 'text-brand-emerald' : 'text-brand-rose'}>{f.positive ? '✓' : '✕'}</span>
                              <span className="text-slate-300">{f.text}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-slate-500 text-xs py-4 text-center">Select target domain above</div>
                    )}
                  </div>

                  <div className="lg:col-span-7 glass-card p-6 flex flex-col justify-between min-h-[350px]">
                    <h4 className="font-extrabold text-xs text-white uppercase tracking-wider mb-4">Monthly Self-Assessment Confidence Indexes</h4>
                    <div className="h-64 w-full">
                      {confidenceHistory.length === 0 ? (
                        <div className="h-full flex items-center justify-center text-slate-500 text-[10px] font-semibold">
                          No confidence checks logged yet. Click Check In to submit.
                        </div>
                      ) : (
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={chartConfidenceData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                            <XAxis dataKey="name" stroke="#64748b" fontSize={9} tickLine={false} />
                            <YAxis stroke="#64748b" fontSize={9} tickLine={false} domain={[0, 100]} />
                            <Tooltip contentStyle={{ background: '#0a0c21', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', fontSize: '10px' }} />
                            <Line type="monotone" dataKey="score" stroke="#06b6d4" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                          </LineChart>
                        </ResponsiveContainer>
                      )}
                    </div>
                  </div>

                </div>
              </motion.div>
            )}

            {/* 7. PATH COMPARISON SIMULATOR */}
            {activeSection === 'compare' && (
              <motion.div key="compare" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                <form onSubmit={handleCompareSubmit} className="p-5 glass-card max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">First Domain/Degree Path</label>
                    <select
                      value={compareDomA}
                      onChange={(e) => setCompareDomA(e.target.value)}
                      className="w-full p-3 bg-[#0a0c21] border border-border-subtle rounded-xl text-xs font-bold text-brand-cyan outline-none"
                      required
                    >
                      <option value="">-- Choose Option A --</option>
                      {trendingDomains.map((t, idx) => (
                        <option key={idx} value={t.domain}>{t.domain}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Second Domain/Degree Path</label>
                    <select
                      value={compareDomB}
                      onChange={(e) => setCompareDomB(e.target.value)}
                      className="w-full p-3 bg-[#0a0c21] border border-border-subtle rounded-xl text-xs font-bold text-brand-cyan outline-none"
                      required
                    >
                      <option value="">-- Choose Option B --</option>
                      {trendingDomains.map((t, idx) => (
                        <option key={idx} value={t.domain}>{t.domain}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={comparisonLoading || !compareDomA || !compareDomB}
                    className="w-full py-3 bg-gradient-to-r from-brand-cyan to-brand-blue hover:opacity-90 font-bold uppercase tracking-widest text-xs text-white rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40"
                  >
                    {comparisonLoading ? 'Comparing...' : 'Simulate Paths'}
                  </button>
                </form>

                {comparisonReport ? (
                  <div className="glass-card p-6 max-w-4xl overflow-x-auto">
                    <table className="w-full border-collapse text-left text-xs font-semibold">
                      <thead>
                        <tr className="border-b border-border-subtle text-slate-450 uppercase text-[9px] tracking-wider">
                          <th className="py-3 pr-4">Evaluation Dimension</th>
                          <th className="py-3 px-4 text-brand-cyan">{compareDomA}</th>
                          <th className="py-3 pl-4 text-brand-purple">{compareDomB}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border-subtle text-slate-205 leading-relaxed">
                        {[
                          { label: 'Expected Tuition Costs', key: 'cost' },
                          { label: 'Time Investment', key: 'time' },
                          { label: 'Difficulty Curve', key: 'difficulty' },
                          { label: '5-Year Projected Outlook', key: 'outlook' },
                          { label: 'Day-to-day lifestyle work', key: 'dayToDay' }
                        ].map((row, idx) => (
                          <tr key={idx} className="hover:bg-white/5 transition-colors">
                            <td className="py-4 pr-4 font-bold text-slate-400">{row.label}</td>
                            <td className="py-4 px-4">{comparisonReport.comparison[row.key].dom1}</td>
                            <td className="py-4 pl-4">{comparisonReport.comparison[row.key].dom2}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  !comparisonLoading && (
                    <div className="p-6 rounded-2xl border border-dashed border-border-subtle text-slate-500 text-xs py-12 text-center max-w-4xl">
                      Select two different paths above to load side-by-side comparisons
                    </div>
                  )
                )}
              </motion.div>
            )}

            {/* 8. AI MOCK INTERVIEW SIMULATOR */}
            {activeSection === 'interview' && (
              <motion.div key="interview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  <div className="lg:col-span-6 space-y-6">
                    <form onSubmit={handleInterviewSubmit} className="glass-card p-5 space-y-4">
                      <div className="space-y-1.5 text-left">
                        <span className="inline-flex items-center gap-1.5 text-[8px] font-black text-brand-purple uppercase tracking-widest font-mono">
                          Target Question
                        </span>
                        <p className="text-xs text-slate-205 leading-relaxed font-bold border-l-2 border-brand-purple pl-3 py-1 bg-white/5">
                          "{interviewQuestion}"
                        </p>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Your Technical Response</label>
                        <textarea
                          value={interviewAnswer}
                          onChange={(e) => setInterviewAnswer(e.target.value)}
                          className="w-full h-32 p-3 glass-input text-xs font-semibold leading-relaxed font-mono bg-black/45"
                          placeholder="Type response code or workflow description..."
                          required
                          disabled={interviewEvaluating}
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={interviewEvaluating || !interviewAnswer.trim()}
                        className="w-full py-3 bg-gradient-to-r from-brand-purple to-brand-blue hover:opacity-90 font-bold uppercase tracking-widest text-xs text-white rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40"
                      >
                        {interviewEvaluating ? 'Grading Response...' : 'Submit Answer'}
                      </button>
                    </form>
                  </div>

                  <div className="lg:col-span-6">
                    <AnimatePresence mode="wait">
                      {interviewFeedback ? (
                        <motion.div
                          key="feedback"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="glass-card p-6 space-y-5 text-left"
                        >
                          <div className="flex justify-between items-center border-b border-border-subtle pb-3">
                            <div>
                              <span className="text-[8px] font-black text-brand-purple tracking-widest uppercase block font-mono">Diagnostic Report</span>
                              <h3 className="text-md font-bold text-white leading-none mt-1">AI Grading Feedback</h3>
                            </div>
                            <span className={`px-3 py-1.5 rounded-lg border font-mono font-black text-xs ${
                              interviewFeedback.score === 'High' ? 'bg-brand-emerald/10 border-brand-emerald/20 text-brand-emerald' :
                              interviewFeedback.score === 'Medium' ? 'bg-brand-cyan/10 border-brand-cyan/20 text-brand-cyan' :
                              'bg-brand-rose/10 border-brand-rose/20 text-brand-rose'
                            }`}>
                              Grade: {interviewFeedback.score}
                            </span>
                          </div>

                          <div className="space-y-4">
                            <div>
                              <h5 className="text-[9px] font-extrabold text-brand-emerald uppercase tracking-widest font-mono">Strengths:</h5>
                              <p className="text-xs text-slate-300 font-semibold leading-relaxed mt-1">{interviewFeedback.strengths}</p>
                            </div>
                            <div>
                              <h5 className="text-[9px] font-extrabold text-brand-rose uppercase tracking-widest font-mono">Areas to Improve:</h5>
                              <p className="text-xs text-slate-350 font-semibold leading-relaxed mt-1">{interviewFeedback.improvements}</p>
                            </div>
                            <div className="p-3 bg-white/5 border border-border-subtle rounded-xl space-y-1">
                              <h5 className="text-[9px] font-black text-brand-cyan uppercase tracking-widest font-mono">Sample Stronger Response:</h5>
                              <p className="text-xs text-slate-205 leading-relaxed font-semibold italic">"{interviewFeedback.sample}"</p>
                            </div>
                          </div>
                        </motion.div>
                      ) : (
                        <div className="p-6 rounded-2xl border border-dashed border-border-subtle text-slate-500 text-xs py-16 text-center">
                          Submit your response on the left to trigger AI grading metrics
                        </div>
                      )}
                    </AnimatePresence>
                  </div>

                </div>
              </motion.div>
            )}

            {/* 9. DECISION JOURNAL */}
            {activeSection === 'journal' && (
              <motion.div key="journal" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                <div className="space-y-4 max-w-4xl">
                  {journalEntries.length === 0 ? (
                    <div className="text-slate-500 text-xs py-4 text-center">No journal logs recorded yet</div>
                  ) : (
                    journalEntries.map((entry, idx) => (
                      <div key={idx} className="p-5 rounded-2xl bg-[#0a0c21]/60 border border-border-subtle space-y-4 text-left hover:border-brand-purple/20 transition-all duration-300">
                        <div className="flex justify-between items-center border-b border-border-subtle pb-3">
                          <h4 className="font-extrabold text-xs text-white uppercase tracking-wider">{entry.title}</h4>
                          <span className="text-[8px] font-bold text-slate-500 uppercase font-mono">{new Date(entry.timestamp).toLocaleString()}</span>
                        </div>

                        <div className="space-y-3.5 text-[10.5px]">
                          <div>
                            <strong className="text-brand-purple uppercase text-[8px] tracking-wider block mb-1">Prompt sent (AI Context):</strong>
                            <div className="text-slate-350 leading-relaxed bg-black/60 p-4 rounded-xl border border-white/5 font-mono overflow-x-auto whitespace-pre-wrap max-h-48 scrollbar-thin">
                              {entry.promptSent}
                            </div>
                          </div>
                          <div>
                            <strong className="text-brand-cyan uppercase text-[8px] tracking-wider block mb-1 mt-2">Response received (Auditable):</strong>
                            <div className="text-slate-205 leading-relaxed bg-black/60 p-4 rounded-xl border border-white/5 font-mono overflow-x-auto whitespace-pre-wrap max-h-48 scrollbar-thin">
                              {entry.responseReceived}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      )}

      </main>

      {/* CONFIDENCE CHECK MODAL */}
      <AnimatePresence>
        {showCheckIn && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg glass-card p-6 md:p-8 space-y-6 text-left relative overflow-hidden"
            >
              <button 
                onClick={() => setShowCheckIn(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-xl border border-white/10 hover:bg-white/5 cursor-pointer"
              >
                <X size={14} />
              </button>

              <div className="space-y-1">
                <span className="inline-flex items-center gap-1.5 text-[9px] font-bold text-brand-cyan uppercase tracking-wider font-mono">
                  <Sparkles size={11} className="animate-pulse" />
                  Monthly Diagnostic Alignment Check
                </span>
                <h3 className="text-lg font-extrabold text-white font-display">Assess Your Career Confidence</h3>
                <p className="text-xs text-slate-400">Rate the parameters below on a scale of 1 to 10</p>
              </div>

              <div className="space-y-5">
                {[
                  "1. How confident are you in your current skill development speed?",
                  "2. How ready do you feel to apply for placements/internships?",
                  "3. How confident are you that your current roadmap will lead to your goal?"
                ].map((qText, idx) => (
                  <div key={idx} className="space-y-1.5 text-left">
                    <label className="text-xs font-bold text-slate-300 block">{qText}</label>
                    <div className="flex items-center gap-4">
                      <input 
                        type="range"
                        min="1"
                        max="10"
                        value={checkInAnswers[idx]}
                        onChange={(e) => {
                          const updated = [...checkInAnswers];
                          updated[idx] = Number(e.target.value);
                          setCheckInAnswers(updated);
                        }}
                        className="w-full h-1.5 bg-white/5 rounded-full outline-none accent-brand-cyan cursor-pointer"
                      />
                      <span className="w-6 text-right text-xs font-black text-brand-cyan font-mono">{checkInAnswers[idx]}</span>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={handleConfidenceSubmit}
                disabled={checkInSubmitting}
                className="w-full py-3 bg-gradient-to-r from-brand-cyan to-brand-blue hover:opacity-90 font-bold uppercase tracking-widest text-xs text-white rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-6"
              >
                {checkInSubmitting ? 'Recording...' : 'Register Assessment'}
                <ChevronRight size={14} />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
