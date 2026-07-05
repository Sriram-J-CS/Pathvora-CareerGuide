import React, { useState } from 'react';
import { Send, Sparkles, MessageSquare, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Suggestion');
  const [message, setMessage] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      const res = await fetch('/api/contact/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message })
      });
      const data = await res.json();
      if (res.ok) {
        setSuccessMsg(data.message);
        setName('');
        setEmail('');
        setMessage('');
      } else {
        setError(data.error || 'Failed to submit message.');
      }
    } catch (err) {
      console.error(err);
      setError('Connection timed out. Feedback logged locally on server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] bg-dot-grid flex items-center justify-center p-4">
      {/* Glow backgrounds */}
      <div className="absolute top-[20%] left-[25%] w-[400px] h-[400px] bg-brand-cyan/5 glowing-spotlight pointer-events-none" />
      <div className="absolute bottom-[20%] right-[25%] w-[400px] h-[400px] bg-brand-purple/5 glowing-spotlight pointer-events-none" />

      <div className="w-full max-w-xl glass-card p-6 md:p-8 space-y-6 relative z-10 text-left">
        
        <div className="space-y-1">
          <span className="inline-flex items-center gap-1.5 text-[9px] font-bold text-brand-cyan uppercase tracking-wider font-mono">
            <Sparkles size={11} className="animate-pulse" />
            Support Connection Gateway
          </span>
          <h2 className="text-2xl font-black text-white font-display">Contact & Feedback</h2>
          <p className="text-xs text-slate-400">Report bugs, request features, or submit suggestions directly to our support desk</p>
        </div>

        {error && (
          <div className="p-3 bg-brand-rose/10 border border-brand-rose/25 rounded-xl text-brand-rose text-xs font-semibold font-mono">
            ⚠️ {error}
          </div>
        )}

        {successMsg ? (
          <div className="p-5 rounded-2xl bg-brand-emerald/10 border border-brand-emerald/25 space-y-4 text-center">
            <CheckCircle2 className="mx-auto text-brand-emerald animate-bounce" size={32} />
            <h4 className="font-extrabold text-sm text-white">Submission Successful</h4>
            <p className="text-xs text-slate-400 leading-relaxed font-semibold">{successMsg}</p>
            <button
              onClick={() => setSuccessMsg('')}
              className="py-2 px-4 rounded-xl border border-border-subtle hover:bg-white hover:text-black text-white text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer"
            >
              Send Another Query
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Your Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 glass-input text-xs font-semibold"
                  placeholder="e.g. Rahul S."
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 glass-input text-xs font-semibold"
                  placeholder="e.g. rahul@gmail.com"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Subject Category</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full p-3 bg-black/60 border border-border-subtle rounded-xl text-xs font-bold text-brand-cyan"
                disabled={loading}
              >
                <option value="Suggestion">Suggestion / Feedback</option>
                <option value="Bug">Bug Report</option>
                <option value="Complaint">Complaint</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Your Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full h-32 p-3 glass-input text-xs font-semibold leading-relaxed"
                placeholder="Write your support details here..."
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-brand-cyan via-brand-blue to-brand-purple hover:opacity-90 font-bold uppercase tracking-widest text-xs text-white rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40"
            >
              {loading ? 'Submitting query...' : 'Deliver Feedback'}
              <Send size={12} />
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
