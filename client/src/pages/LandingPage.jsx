import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Compass, Shield, SlidersHorizontal, TrendingUp, GraduationCap, Briefcase, Users, Laptop, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="relative min-h-[90vh] bg-dot-grid overflow-hidden">
      {/* Decorative spotlights */}
      <div className="absolute top-[10%] left-[15%] w-[500px] h-[500px] bg-brand-blue/10 glowing-spotlight" />
      <div className="absolute top-[40%] right-[10%] w-[500px] h-[500px] bg-brand-purple/10 glowing-spotlight" />

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Left Text */}
          <div className="lg:col-span-7 text-left space-y-6">
            <motion.div 
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-cyan/15 border border-brand-cyan/20 text-[10px] font-bold tracking-widest text-brand-cyan uppercase select-none"
            >
              <Sparkles size={12} className="animate-bounce" />
              AI Decision Intelligence platform
            </motion.div>
            
            <motion.h1 
              variants={itemVariants}
              className="text-4xl md:text-7xl font-extrabold tracking-tight leading-none text-white font-display"
            >
              Architect Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan via-brand-blue to-brand-purple">Career Path.</span>
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className="text-sm md:text-base text-slate-400 leading-relaxed font-medium max-w-xl"
            >
              Pathvora CareerGuide is an AI-powered career counseling operating system, mapping and guiding your transition from basic academic streams to high-growth placement vectors.
            </motion.p>

            <motion.div variants={itemVariants} className="pt-4 flex flex-col sm:flex-row gap-4">
              <Link 
                to="/register"
                className="group py-4 px-8 rounded-2xl bg-gradient-to-r from-brand-cyan via-brand-blue to-brand-purple hover:opacity-95 font-extrabold text-white text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-brand-blue/30 transition-all duration-300"
              >
                <span>Get Started (AI Assessment)</span>
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to="/login"
                className="py-4 px-8 rounded-2xl border border-border-subtle hover:border-white/20 bg-white/5 backdrop-blur-xl hover:bg-white/10 font-extrabold text-slate-300 hover:text-white text-xs uppercase tracking-widest transition-all duration-300 text-center"
              >
                Sign In
              </Link>
            </motion.div>
          </div>

          {/* Right Floating Display Card */}
          <motion.div 
            variants={itemVariants}
            className="lg:col-span-5 flex justify-center items-center"
          >
            <div className="w-full max-w-[400px] aspect-square glass-card p-6 flex flex-col justify-between relative overflow-hidden group animate-float">
              <div className="absolute -top-12 -right-12 w-28 h-28 rounded-full bg-brand-cyan/10 blur-2xl group-hover:bg-brand-cyan/20 transition-colors" />
              <div className="absolute -bottom-12 -left-12 w-28 h-28 rounded-full bg-brand-purple/10 blur-2xl group-hover:bg-brand-purple/20 transition-colors" />
              
              <div className="flex justify-between items-center border-b border-border-subtle pb-4">
                <div>
                  <span className="text-[8px] font-black text-brand-cyan tracking-widest uppercase block font-mono">Counseling Status</span>
                  <h3 className="text-sm font-black text-white mt-1 leading-none">Diagnostic core active</h3>
                </div>
                <span className="px-2 py-0.5 rounded text-[8px] font-bold uppercase bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan font-mono">Active</span>
              </div>

              <div className="space-y-4 my-6">
                {[
                  { label: "Fit Score Compatibility", val: "94%", color: "text-brand-cyan", w: "w-[94%]", bg: "from-brand-cyan to-brand-blue" },
                  { label: "Skills Gap Alignment", val: "88%", color: "text-brand-blue", w: "w-[88%]", bg: "from-brand-blue to-brand-indigo" },
                  { label: "Personalized Projections", val: "Complete", color: "text-brand-purple", w: "w-full", bg: "from-brand-purple to-brand-rose" }
                ].map((stat, idx) => (
                  <div key={idx} className="space-y-1 text-left">
                    <div className="flex justify-between text-[10px] font-bold">
                      <span className="text-slate-400">{stat.label}</span>
                      <span className={stat.color}>{stat.val}</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden border border-border-subtle">
                      <div className={`h-full rounded-full bg-gradient-to-r ${stat.bg} ${stat.w} shadow-lg`} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-xl bg-black/60 border border-border-subtle text-[9px] text-slate-400 leading-relaxed font-semibold text-left">
                <span className="text-brand-cyan uppercase font-black tracking-widest block mb-1">Explainable AI (XAI) Insight:</span>
                "Academic stream coordinates align with specialized AI & ML engineering metrics. Certification pipeline compiled."
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Section 2: Why Pathvora */}
        <section className="py-24 text-left space-y-12">
          <div className="max-w-2xl space-y-3">
            <span className="text-[10px] font-extrabold text-brand-cyan tracking-widest uppercase block">Why Pathvora?</span>
            <h2 className="text-3xl md:text-5xl font-black text-white leading-none font-display">Traditional Guidance is Flat.</h2>
            <p className="text-xs md:text-sm text-slate-400 leading-relaxed font-semibold">
              Static counselors recommend flat career titles. Pathvora CareerGuide builds a dynamic 3D timeline indexing credentials, resume gaps, and mock interview diagnostics in real-time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { 
                target: "Students Face", 
                problems: ["Academic stream confusion after class 10/12", "Lacking cutoff predictors and fee databases", "Opaque scholarship registration channels"], 
                sol: "Double-Helix Stream calculations maps JEE, NEET, and regional counselings automatically.",
                color: "from-brand-purple/10 to-brand-indigo/5 border-brand-purple/20 text-brand-purple"
              },
              { 
                target: "Job Seekers Face", 
                problems: ["Flat static resume formats rejected by ATS algorithms", "Lack of specialized, targeted mock interview loops", "Opaque compensation expectations"], 
                sol: "ATS Scan evaluations grade keywords live while Interview simulators model technical answers.",
                color: "from-brand-blue/10 to-brand-cyan/5 border-brand-blue/20 text-brand-cyan"
              },
              { 
                target: "Professionals Face", 
                problems: ["Difficult, high-risk sector switch directions", "Stagnant salary projections and opaque reviews", "Uncertain promotion timing parameters"], 
                sol: "Transition planners compute readiness indexes and map step-by-step upskilling timelines.",
                color: "from-brand-emerald/10 to-brand-cyan/5 border-brand-emerald/20 text-brand-emerald"
              }
            ].map((box, idx) => (
              <div key={idx} className="p-6 glass-card flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <h4 className="text-lg font-black text-white leading-none">{box.target}</h4>
                  <ul className="space-y-2 text-[11px] text-slate-400 font-semibold">
                    {box.problems.map((p, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <span className="text-brand-rose">✕</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className={`p-4 rounded-2xl bg-gradient-to-br ${box.color} text-[10px] space-y-1.5`}>
                  <span className="font-extrabold uppercase tracking-widest block leading-none">The Pathvora Solution:</span>
                  <p className="font-semibold leading-relaxed text-slate-355">{box.sol}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Target Audiences */}
        <section className="py-16 text-left space-y-12">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <span className="text-[10px] font-extrabold text-brand-blue tracking-widest uppercase block">Target Audiences</span>
            <h2 className="text-3xl font-black text-white leading-none font-display">Isolated Portals, Unified System</h2>
            <p className="text-xs text-slate-400 font-semibold leading-relaxed mt-2">
              Isolated user dashboard experiences compiled onto a single, high-fidelity Pathvora decision intelligence framework.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: "School Students", desc: "Select optimal streams (PCM/Commerce/Arts) and map JEE/NEET counseling parameters.", icon: GraduationCap, color: "text-brand-purple border-brand-purple/20 bg-brand-purple/5" },
              { title: "College Students", desc: "Scan plain resumes against ATS checkers and grade technical mock interview simulations.", icon: Laptop, color: "text-brand-cyan border-brand-cyan/20 bg-brand-cyan/5" },
              { title: "Professionals", desc: "Model high-growth industry switches, timeline steps, and option pricing promotion indexes.", icon: Briefcase, color: "text-brand-rose border-brand-rose/20 bg-brand-rose/5" },
              { title: "AI Diagnostics", desc: "Identify deep alignment vectors using interactive 3D roadmap projections and Claude counselors.", icon: Activity, color: "text-brand-emerald border-brand-emerald/20 bg-brand-emerald/5" }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div 
                  key={idx} 
                  className={`p-5 rounded-2xl border ${item.color} backdrop-blur-xl flex flex-col justify-between space-y-6 group hover:scale-[1.02] transition-transform duration-300`}
                >
                  <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center shrink-0"><Icon size={16} /></div>
                  <div className="space-y-1.5">
                    <h4 className="font-extrabold text-xs text-white uppercase tracking-wider">{item.title}</h4>
                    <p className="text-[10px] text-slate-400 leading-relaxed font-semibold">{item.desc}</p>
                  </div>
                  <span className="text-[9px] font-bold text-slate-500 group-hover:text-white flex items-center gap-1.5 transition-colors uppercase">
                    Learn more <ArrowRight size={10} />
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="w-full py-6 border-t border-border-subtle text-center text-[10px] text-slate-500 bg-black/40 relative z-10">
        <p>© 2026 Pathvora Technologies Inc. AI Career Guidance Platform.</p>
      </footer>
    </div>
  );
}
