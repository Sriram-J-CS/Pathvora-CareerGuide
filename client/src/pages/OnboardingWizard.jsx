import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, ArrowLeft, Sparkles, Check, GraduationCap, Briefcase, Users, Laptop, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "How do you prefer to spend your free creative hours?",
    options: [
      { text: "Writing scripts or coding small automation files", category: "Tech" },
      { text: "Sketching interface screens or visual wireframes in Figma", category: "Arts" },
      { text: "Analyzing statistics sheets, stock trends, or accounts", category: "Business" },
      { text: "Reading scientific journals or performing biology experiments", category: "Sciences" }
    ]
  },
  {
    id: 2,
    question: "Which of the following topics sparks your highest curiosity?",
    options: [
      { text: "Artificial Intelligence, Neural networks, and computer code", category: "Tech" },
      { text: "Layout spacing, typography colors, and user interface styling", category: "Arts" },
      { text: "Venture capitals, startups, and stock market ratios", category: "Business" },
      { text: "Clinical diagnostics, genome sequencing, and chemicals", category: "Sciences" }
    ]
  },
  {
    id: 3,
    question: "When working in a team project, which role do you naturally fall into?",
    options: [
      { text: "The coder who builds the backend API pipelines", category: "Tech" },
      { text: "The designer who aligns the visual specs and styles", category: "Arts" },
      { text: "The coordinator who creates milestones and assigns tasks", category: "Business" },
      { text: "The researcher who gathers empirical data and analyzes reports", category: "Sciences" }
    ]
  },
  {
    id: 4,
    question: "What type of problem solving challenges do you enjoy most?",
    options: [
      { text: "Debugging compile logic errors or network bugs", category: "Tech" },
      { text: "Arranging visual grids for optimal aesthetic clarity", category: "Arts" },
      { text: "Negotiating plans and structuring trade-offs", category: "Business" },
      { text: "Solving equations and conducting lab diagnostics", category: "Sciences" }
    ]
  },
  {
    id: 5,
    question: "Which tool or environment would you prefer to master?",
    options: [
      { text: "Vite, VSCode, and database query terminals", category: "Tech" },
      { text: "Figma, Canva, and styling packages", category: "Arts" },
      { text: "Excel sheets, Trello, and CRM systems", category: "Business" },
      { text: "Python data tables, calculators, and microscope tools", category: "Sciences" }
    ]
  },
  {
    id: 6,
    question: "Which career achievement sounds most satisfying to you?",
    options: [
      { text: "Deploying a server infrastructure scaling to millions of hits", category: "Tech" },
      { text: "Having your design featured on a major brand app landing page", category: "Arts" },
      { text: "Launching a high-revenue startup or lead business deal", category: "Business" },
      { text: "Publishing a breakthrough computational biology paper", category: "Sciences" }
    ]
  },
  {
    id: 7,
    question: "Choose a favorite subject in school or college:",
    options: [
      { text: "Computer Science or Information Systems", category: "Tech" },
      { text: "Fine Arts, Design, or Writing", category: "Arts" },
      { text: "Economics, Commerce, or Accounts", category: "Business" },
      { text: "Biology, Physics, or Mathematics", category: "Sciences" }
    ]
  },
  {
    id: 8,
    question: "What is your main career motivation driver?",
    options: [
      { text: "Automating manual workflows using software components", category: "Tech" },
      { text: "Creating premium user experiences that feel interactive", category: "Arts" },
      { text: "Managing resources, budgets, and launching campaigns", category: "Business" },
      { text: "Advancing knowledge and finding medical/analytical insights", category: "Sciences" }
    ]
  }
];

export default function OnboardingWizard() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationAlert, setValidationAlert] = useState('');

  // Form State
  const [personalDetails, setPersonalDetails] = useState({
    age: '',
    gender: 'Male',
    phone: '',
    location: '',
    preferredLanguage: 'English'
  });

  const [educationStage, setEducationStage] = useState('UG'); // '12th' | 'UG' | 'PG'
  const [educationStatus, setEducationStatus] = useState('pursuing'); // 'completed' | 'pursuing'

  // Stage Specific Details
  const [schoolDetails, setSchoolDetails] = useState({
    schoolName: '',
    board: 'CBSE',
    stream: 'Science',
    completionYear: ''
  });

  const [universityDetails, setUniversityDetails] = useState({
    collegeName: '',
    degree: '',
    specialization: '',
    completionYear: ''
  });

  // Step 4 Direction selection
  const [directionStatus, setDirectionStatus] = useState({
    knowsDirection: 'yes',
    knownDomain: 'AI & Machine Learning Engineering',
    postGradGoal: 'job', // 'job' | 'studies' | 'unsure'
    pgLeaning: 'industry' // 'research' | 'industry'
  });

  // Quiz State
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [currentQuizQuestion, setCurrentQuizQuestion] = useState(0);

  // Load existing profile if onboarding was partially completed
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/onboarding/profile');
        if (res.ok) {
          const profile = await res.json();
          if (profile.onboardingStep) {
            setCurrentStep(profile.onboardingStep);
          }
          if (profile.personalDetails) {
            setPersonalDetails({
              age: profile.personalDetails.age || '',
              gender: profile.personalDetails.gender || 'Male',
              phone: profile.personalDetails.phone || '',
              location: profile.personalDetails.location || '',
              preferredLanguage: profile.personalDetails.preferredLanguage || 'English'
            });
          }
          if (profile.educationStage) {
            setEducationStage(profile.educationStage);
          }
          if (profile.educationStatus) {
            setEducationStatus(profile.educationStatus);
          }
          if (profile.educationDetails) {
            if (profile.educationStage === '12th') {
              setSchoolDetails({
                schoolName: profile.educationDetails.schoolName || '',
                board: profile.educationDetails.board || 'CBSE',
                stream: profile.educationDetails.stream || 'Science',
                completionYear: profile.educationDetails.completionYear || ''
              });
            } else {
              setUniversityDetails({
                collegeName: profile.educationDetails.collegeName || '',
                degree: profile.educationDetails.degree || '',
                specialization: profile.educationDetails.specialization || '',
                completionYear: profile.educationDetails.completionYear || ''
              });
            }
          }
        }
      } catch (err) {
        console.error('Error fetching onboarding profile:', err);
      }
    };
    fetchProfile();
  }, []);

  const saveStepData = async (stepNumber, dataToSave) => {
    setLoading(true);
    setError('');
    setValidationAlert('');
    try {
      const res = await fetch('/api/onboarding/step', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ step: stepNumber, data: dataToSave })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save onboarding details');
      }
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleNextStep1 = async () => {
    if (!personalDetails.age || !personalDetails.phone || !personalDetails.location) {
      setValidationAlert('Please fill in age, phone, and location.');
      return;
    }
    const result = await saveStepData(1, personalDetails);
    if (result) setCurrentStep(2);
  };

  const handleNextStep2 = async () => {
    const result = await saveStepData(2, { educationStage, educationStatus });
    if (result) setCurrentStep(3);
  };

  const handleNextStep3 = async () => {
    const data = educationStage === '12th' ? schoolDetails : universityDetails;
    if (educationStage === '12th') {
      if (!schoolDetails.schoolName || !schoolDetails.completionYear) {
        setValidationAlert('Please fill in school name and year.');
        return;
      }
    } else {
      if (!universityDetails.collegeName || !universityDetails.degree || !universityDetails.specialization || !universityDetails.completionYear) {
        setValidationAlert('Please fill in all college details.');
        return;
      }
    }
    const result = await saveStepData(3, data);
    if (result) setCurrentStep(4);
  };

  // Submit Direction status directly (Step 4 standard selection)
  const handleNextStep4 = async () => {
    // Branching Check
    if (educationStage === '12th' && directionStatus.knowsDirection === 'no') {
      setShowQuiz(true);
      return;
    }
    if (educationStage === 'UG' && directionStatus.postGradGoal === 'unsure') {
      setShowQuiz(true);
      return;
    }

    const result = await saveStepData(4, directionStatus);
    if (result) {
      await refreshUser();
      navigate('/dashboard');
    }
  };

  // Handle option selection during the quiz
  const handleQuizAnswer = (option) => {
    const newAnswers = [...quizAnswers, {
      questionId: QUIZ_QUESTIONS[currentQuizQuestion].id,
      questionText: QUIZ_QUESTIONS[currentQuizQuestion].question,
      selectedOption: option.text
    }];
    setQuizAnswers(newAnswers);

    if (currentQuizQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuizQuestion(currentQuizQuestion + 1);
    } else {
      // Evaluate quiz on backend
      submitQuizEvaluation(newAnswers);
    }
  };

  const submitQuizEvaluation = async (answersList) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/quiz/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quizType: educationStage === '12th' ? 'aptitude' : 'ug-unsure',
          answers: answersList
        })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit quiz.');
      }
      await refreshUser();
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] bg-dot-grid flex items-center justify-center p-4">
      {/* Decorative spotlights */}
      <div className="absolute top-[15%] left-[20%] w-[400px] h-[400px] bg-brand-cyan/5 glowing-spotlight" />
      <div className="absolute bottom-[15%] right-[20%] w-[400px] h-[400px] bg-brand-purple/5 glowing-spotlight" />

      <div className="w-full max-w-2xl glass-card p-6 md:p-8 space-y-6 relative z-10 text-left">
        
        {/* Header Indicator */}
        {!showQuiz && (
          <div className="flex justify-between items-center border-b border-border-subtle pb-4">
            <div>
              <span className="inline-flex items-center gap-1 text-[9px] font-bold text-brand-cyan uppercase tracking-wider font-mono">
                <Sparkles size={10} className="animate-pulse" />
                Pathvora Registration wizard
              </span>
              <h2 className="text-xl font-extrabold text-white font-display">Onboarding Wizard</h2>
            </div>

            
            {/* Stepper indicators */}
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((step) => (
                <div 
                  key={step} 
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                    currentStep === step 
                      ? 'bg-brand-cyan text-black shadow-md shadow-brand-cyan/20' 
                      : currentStep > step 
                      ? 'bg-brand-emerald/20 text-brand-emerald border border-brand-emerald/30' 
                      : 'bg-white/5 text-slate-500 border border-border-subtle'
                  }`}
                >
                  {currentStep > step ? <Check size={10} /> : step}
                </div>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="p-3 bg-brand-rose/10 border border-brand-rose/25 rounded-xl text-brand-rose text-xs font-semibold font-mono">
            ⚠️ {error}
          </div>
        )}

        {validationAlert && (
          <div className="p-3 bg-brand-purple/15 border border-brand-purple/20 rounded-xl text-brand-purple text-xs font-semibold font-mono">
            ⚠️ {validationAlert}
          </div>
        )}

        <AnimatePresence mode="wait">
          
          {/* STEP 1: Personal Details */}
          {currentStep === 1 && !showQuiz && (
            <motion.div key="step1" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Step 1 — Tell us about yourself</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Age</label>
                  <input
                    type="number"
                    value={personalDetails.age}
                    onChange={(e) => setPersonalDetails({ ...personalDetails, age: e.target.value })}
                    className="w-full p-3 glass-input text-xs font-semibold"
                    placeholder="e.g. 18"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Gender (Optional)</label>
                  <select
                    value={personalDetails.gender}
                    onChange={(e) => setPersonalDetails({ ...personalDetails, gender: e.target.value })}
                    className="w-full p-3 bg-black/60 border border-border-subtle rounded-xl text-xs font-semibold"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Phone Number</label>
                  <input
                    type="tel"
                    value={personalDetails.phone}
                    onChange={(e) => setPersonalDetails({ ...personalDetails, phone: e.target.value })}
                    className="w-full p-3 glass-input text-xs font-semibold"
                    placeholder="e.g. +91 9876543210"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Location (City/State)</label>
                  <input
                    type="text"
                    value={personalDetails.location}
                    onChange={(e) => setPersonalDetails({ ...personalDetails, location: e.target.value })}
                    className="w-full p-3 glass-input text-xs font-semibold"
                    placeholder="e.g. Chennai, Tamil Nadu"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Preferred Language</label>
                  <select
                    value={personalDetails.preferredLanguage}
                    onChange={(e) => setPersonalDetails({ ...personalDetails, preferredLanguage: e.target.value })}
                    className="w-full p-3 bg-black/60 border border-border-subtle rounded-xl text-xs font-semibold"
                  >
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Tamil">Tamil</option>
                    <option value="Telugu">Telugu</option>
                    <option value="Kannada">Kannada</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 text-right">
                <button
                  onClick={handleNextStep1}
                  disabled={loading}
                  className="py-3 px-6 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-blue font-bold text-xs uppercase tracking-widest text-white hover:opacity-90 flex items-center gap-1.5 ml-auto cursor-pointer"
                >
                  {loading ? 'Saving...' : 'Next Step'}
                  <ArrowRight size={14} />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Education Status selection */}
          {currentStep === 2 && !showQuiz && (
            <motion.div key="step2" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Step 2 — Educational Status</h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-350">Q: Have you completed or are you currently pursuing your education?</label>
                  <div className="grid grid-cols-2 gap-3 text-xs font-bold">
                    {['completed', 'pursuing'].map((status) => (
                      <button
                        key={status}
                        onClick={() => setEducationStatus(status)}
                        className={`p-4 rounded-xl border text-left capitalize ${
                          educationStatus === status 
                            ? 'border-brand-cyan bg-brand-cyan/10 text-white font-extrabold' 
                            : 'border-border-subtle bg-black/40 text-slate-400'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <label className="text-xs font-bold text-slate-350">Q: Which stage of education fits you best?</label>
                  <div className="grid grid-cols-3 gap-3 text-xs font-bold">
                    {[
                      { stage: '12th', label: '12th Standard' },
                      { stage: 'UG', label: 'Undergraduate (UG)' },
                      { stage: 'PG', label: 'Postgraduate (PG)' }
                    ].map((item) => (
                      <button
                        key={item.stage}
                        onClick={() => setEducationStage(item.stage)}
                        className={`p-4 rounded-xl border text-left flex flex-col justify-between aspect-video ${
                          educationStage === item.stage 
                            ? 'border-brand-cyan bg-brand-cyan/10 text-white font-extrabold' 
                            : 'border-border-subtle bg-black/40 text-slate-400'
                        }`}
                      >
                        <GraduationCap size={16} className={educationStage === item.stage ? 'text-brand-cyan' : 'text-slate-500'} />
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-6 flex justify-between">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="py-3 px-4 rounded-xl border border-border-subtle text-slate-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 hover:text-white"
                >
                  <ArrowLeft size={14} />
                  Back
                </button>
                <button
                  onClick={handleNextStep2}
                  disabled={loading}
                  className="py-3 px-6 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-blue font-bold text-xs uppercase tracking-widest text-white hover:opacity-90 flex items-center gap-1.5 cursor-pointer"
                >
                  {loading ? 'Saving...' : 'Next Step'}
                  <ArrowRight size={14} />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Stage Specific details */}
          {currentStep === 3 && !showQuiz && (
            <motion.div key="step3" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Step 3 — Stage Details ({educationStage})</h3>
              
              {educationStage === '12th' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">School Name</label>
                    <input
                      type="text"
                      value={schoolDetails.schoolName}
                      onChange={(e) => setSchoolDetails({ ...schoolDetails, schoolName: e.target.value })}
                      className="w-full p-3 glass-input text-xs font-semibold"
                      placeholder="e.g. KV Higher Secondary School"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Education Board</label>
                    <select
                      value={schoolDetails.board}
                      onChange={(e) => setSchoolDetails({ ...schoolDetails, board: e.target.value })}
                      className="w-full p-3 bg-black/60 border border-border-subtle rounded-xl text-xs font-semibold"
                    >
                      <option value="CBSE">CBSE</option>
                      <option value="State Board">State Board</option>
                      <option value="ICSE">ICSE</option>
                      <option value="IB">IB</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Stream</label>
                    <select
                      value={schoolDetails.stream}
                      onChange={(e) => setSchoolDetails({ ...schoolDetails, stream: e.target.value })}
                      className="w-full p-3 bg-black/60 border border-border-subtle rounded-xl text-xs font-semibold"
                    >
                      <option value="Science">Science (PCM/PCB)</option>
                      <option value="Commerce">Commerce</option>
                      <option value="Arts">Arts / Humanities</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Year of Completion</label>
                    <input
                      type="number"
                      value={schoolDetails.completionYear}
                      onChange={(e) => setSchoolDetails({ ...schoolDetails, completionYear: e.target.value })}
                      className="w-full p-3 glass-input text-xs font-semibold"
                      placeholder="e.g. 2026"
                      required
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">College/University Name</label>
                    <input
                      type="text"
                      value={universityDetails.collegeName}
                      onChange={(e) => setUniversityDetails({ ...universityDetails, collegeName: e.target.value })}
                      className="w-full p-3 glass-input text-xs font-semibold"
                      placeholder="e.g. Loyola College"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Degree Name</label>
                    <input
                      type="text"
                      value={universityDetails.degree}
                      onChange={(e) => setUniversityDetails({ ...universityDetails, degree: e.target.value })}
                      className="w-full p-3 glass-input text-xs font-semibold"
                      placeholder="e.g. B.Tech / B.Sc / M.Sc"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Specialization / Major</label>
                    <input
                      type="text"
                      value={universityDetails.specialization}
                      onChange={(e) => setUniversityDetails({ ...universityDetails, specialization: e.target.value })}
                      className="w-full p-3 glass-input text-xs font-semibold"
                      placeholder="e.g. Computer Science"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">{educationStatus === 'completed' ? 'Year of Completion' : 'Expected Year of Completion'}</label>
                    <input
                      type="number"
                      value={universityDetails.completionYear}
                      onChange={(e) => setUniversityDetails({ ...universityDetails, completionYear: e.target.value })}
                      className="w-full p-3 glass-input text-xs font-semibold"
                      placeholder="e.g. 2027"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="pt-6 flex justify-between">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="py-3 px-4 rounded-xl border border-border-subtle text-slate-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 hover:text-white"
                >
                  <ArrowLeft size={14} />
                  Back
                </button>
                <button
                  onClick={handleNextStep3}
                  disabled={loading}
                  className="py-3 px-6 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-blue font-bold text-xs uppercase tracking-widest text-white hover:opacity-90 flex items-center gap-1.5 cursor-pointer"
                >
                  {loading ? 'Saving...' : 'Next Step'}
                  <ArrowRight size={14} />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: Direction Branching */}
          {currentStep === 4 && !showQuiz && (
            <motion.div key="step4" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Step 4 — Direction Audit</h3>
              
              {/* 12th Branching */}
              {educationStage === '12th' && (
                <div className="space-y-4 text-left">
                  <label className="text-xs font-bold text-slate-350">Q: Do you already know which degree or field you want to pursue?</label>
                  
                  <div className="grid grid-cols-2 gap-3 text-xs font-bold">
                    <button
                      onClick={() => setDirectionStatus({ ...directionStatus, knowsDirection: 'yes' })}
                      className={`p-4 rounded-xl border text-left ${
                        directionStatus.knowsDirection === 'yes' ? 'border-brand-cyan bg-brand-cyan/10 text-white' : 'border-border-subtle bg-black/40 text-slate-400'
                      }`}
                    >
                      Yes, I know
                    </button>
                    <button
                      onClick={() => setDirectionStatus({ ...directionStatus, knowsDirection: 'no' })}
                      className={`p-4 rounded-xl border text-left ${
                        directionStatus.knowsDirection === 'no' ? 'border-brand-cyan bg-brand-cyan/10 text-white' : 'border-border-subtle bg-black/40 text-slate-400'
                      }`}
                    >
                      No, help me decide
                    </button>
                  </div>

                  {directionStatus.knowsDirection === 'yes' && (
                    <div className="space-y-1.5 pt-2 animate-fadeIn">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Enter Intended Degree/Domain</label>
                      <input
                        type="text"
                        value={directionStatus.knownDomain}
                        onChange={(e) => setDirectionStatus({ ...directionStatus, knownDomain: e.target.value })}
                        className="w-full p-3 glass-input text-xs font-semibold"
                        placeholder="e.g. B.Tech Computer Science / B.Des Graphic Design"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* UG Branching */}
              {educationStage === 'UG' && (
                <div className="space-y-4 text-left">
                  <label className="text-xs font-bold text-slate-350">Q: Are you planning to go straight into a job after graduation, or pursue higher studies (PG)?</label>
                  
                  <div className="grid grid-cols-3 gap-3 text-xs font-bold">
                    {[
                      { id: 'job', label: 'Go Straight into a Job', icon: Briefcase },
                      { id: 'studies', label: 'Pursue Higher Studies', icon: GraduationCap },
                      { id: 'unsure', label: 'Unsure / Deciding', icon: Laptop }
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setDirectionStatus({ ...directionStatus, postGradGoal: item.id })}
                        className={`p-4 rounded-xl border text-left flex flex-col justify-between aspect-video ${
                          directionStatus.postGradGoal === item.id ? 'border-brand-cyan bg-brand-cyan/10 text-white' : 'border-border-subtle bg-black/40 text-slate-400'
                        }`}
                      >
                        <item.icon size={16} />
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* PG Branching */}
              {educationStage === 'PG' && (
                <div className="space-y-4 text-left">
                  <label className="text-xs font-bold text-slate-350">Q: Are you leaning toward research/academia or industry roles?</label>
                  
                  <div className="grid grid-cols-2 gap-3 text-xs font-bold">
                    <button
                      onClick={() => setDirectionStatus({ ...directionStatus, pgLeaning: 'research' })}
                      className={`p-4 rounded-xl border text-left flex flex-col justify-between aspect-video ${
                        directionStatus.pgLeaning === 'research' ? 'border-brand-cyan bg-brand-cyan/10 text-white' : 'border-border-subtle bg-black/40 text-slate-400'
                      }`}
                    >
                      <FileText size={16} />
                      Research & Academia
                    </button>
                    <button
                      onClick={() => setDirectionStatus({ ...directionStatus, pgLeaning: 'industry' })}
                      className={`p-4 rounded-xl border text-left flex flex-col justify-between aspect-video ${
                        directionStatus.pgLeaning === 'industry' ? 'border-brand-cyan bg-brand-cyan/10 text-white' : 'border-border-subtle bg-black/40 text-slate-400'
                      }`}
                    >
                      <Briefcase size={16} />
                      Industry Roles
                    </button>
                  </div>
                </div>
              )}

              <div className="pt-6 flex justify-between">
                <button
                  onClick={() => setCurrentStep(3)}
                  className="py-3 px-4 rounded-xl border border-border-subtle text-slate-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 hover:text-white"
                >
                  <ArrowLeft size={14} />
                  Back
                </button>
                <button
                  onClick={handleNextStep4}
                  disabled={loading}
                  className="py-3 px-6 rounded-xl bg-gradient-to-r from-brand-purple via-brand-blue to-brand-cyan font-bold text-xs uppercase tracking-widest text-white hover:opacity-90 flex items-center gap-1.5 cursor-pointer"
                >
                  {loading ? 'Processing...' : (educationStage === '12th' && directionStatus.knowsDirection === 'no') || (educationStage === 'UG' && directionStatus.postGradGoal === 'unsure') ? 'Begin Quiz' : 'Complete Setup'}
                  <ArrowRight size={14} />
                </button>
              </div>
            </motion.div>
          )}

          {/* INTEREST DIAGNOSTIC APITITUDE QUIZ MODAL */}
          {showQuiz && (
            <motion.div key="quizPanel" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              
              <div className="flex justify-between items-center border-b border-border-subtle pb-3">
                <div>
                  <span className="text-[8px] font-black text-brand-purple tracking-widest uppercase block font-mono">Assessment Matrix</span>
                  <h3 className="text-sm font-extrabold text-white leading-none mt-1">Diagnostic Question {currentQuizQuestion + 1} of {QUIZ_QUESTIONS.length}</h3>
                </div>
                <div className="text-[10px] font-bold text-slate-500 font-mono">
                  {Math.round(((currentQuizQuestion) / QUIZ_QUESTIONS.length) * 100)}% Complete
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-md font-bold text-slate-200">{QUIZ_QUESTIONS[currentQuizQuestion].question}</h4>
                
                <div className="grid grid-cols-1 gap-2.5">
                  {QUIZ_QUESTIONS[currentQuizQuestion].options.map((opt, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuizAnswer(opt)}
                      className="p-4 rounded-xl border border-border-subtle bg-black/40 text-left text-xs font-semibold text-slate-300 hover:border-brand-purple hover:text-white transition-all w-full cursor-pointer hover:bg-white/5"
                    >
                      {opt.text}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex justify-between items-center border-t border-border-subtle">
                {currentQuizQuestion > 0 && (
                  <button
                    onClick={() => {
                      setCurrentQuizQuestion(currentQuizQuestion - 1);
                      setQuizAnswers(quizAnswers.slice(0, -1));
                    }}
                    className="text-[10px] font-extrabold uppercase text-slate-500 hover:text-slate-300 flex items-center gap-1"
                  >
                    <ArrowLeft size={10} /> Back
                  </button>
                )}
                <button
                  onClick={() => {
                    setShowQuiz(false);
                    setCurrentQuizQuestion(0);
                    setQuizAnswers([]);
                  }}
                  className="text-[10px] font-extrabold uppercase text-brand-rose hover:opacity-90 ml-auto"
                >
                  Cancel Assessment
                </button>
              </div>

            </motion.div>
          )}

        </AnimatePresence>

      </div>
    </div>
  );
}
