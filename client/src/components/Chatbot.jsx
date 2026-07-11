import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, X, Sparkles, MessageCircleCode } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMsg, setInputMsg] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef();

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/chatbot/history');
      if (res.ok) {
        const history = await res.json();
        setMessages(history);
      }
    } catch (e) {
      console.error('Error fetching chat history:', e);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchHistory();
    }
  }, [isOpen]);

  useEffect(() => {
    // Scroll to bottom
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, sending]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMsg.trim() || sending) return;

    const userText = inputMsg.trim();
    setInputMsg('');
    setSending(true);

    // Optimistically update UI
    setMessages(prev => [...prev, { role: 'user', content: userText, timestamp: new Date() }]);

    try {
      const res = await fetch('/api/chatbot/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText })
      });
      const data = await res.json();
      if (res.ok) {
        setMessages(prev => [...prev, data]);
      } else {
        setMessages(prev => [
          ...prev, 
          { role: 'assistant', content: 'Connection timed out. Swapping backup counselor parameters...' }
        ]);
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev, 
        { role: 'assistant', content: 'Sandbox Counselor: This is a simulated response. To access the live AI Counselor, please ensure the backend API server is running.' }
      ]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      
      {/* Floating Toggle Bubble */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-tr from-brand-rose via-brand-blue to-brand-cyan flex items-center justify-center text-white shadow-xl shadow-brand-blue/30 cursor-pointer pointer-events-auto border border-white/10"
      >
        {isOpen ? <X size={20} /> : <MessageCircleCode size={22} className="animate-pulse" />}
      </motion.button>

      {/* Floating Dialogue Box */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="absolute bottom-16 md:bottom-20 right-0 w-[320px] md:w-[380px] h-[450px] md:h-[500px] glass-card flex flex-col justify-between overflow-hidden shadow-2xl border border-border-subtle"
          >
            {/* Header */}
            <div className="p-4 border-b border-border-subtle bg-black/60 flex items-center justify-between text-left">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-brand-cyan animate-pulse" />
                <div>
                  <h4 className="font-extrabold text-xs text-white uppercase tracking-wider leading-none">Pathvora Counselor</h4>
                  <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest font-mono">Explainable AI Core</span>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 text-[8px] font-bold text-brand-purple uppercase tracking-wider font-mono">
                <Sparkles size={10} className="animate-spin" />
                Live context
              </span>
            </div>

            {/* Messages Body */}
            <div className="flex-grow p-4 overflow-y-auto space-y-3 max-h-[350px]">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-2 p-6">
                  <MessageSquare className="text-slate-600 animate-bounce" size={24} />
                  <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                    Hello aspirant! I have reviewed your career telemetry index. Ask me any specialized questions about certifications, mock exams, or salary growth.
                  </p>
                </div>
              ) : (
                messages.map((m, idx) => (
                  <div 
                    key={idx} 
                    className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} text-left`}
                  >
                    <div 
                      className={`p-3 rounded-2xl max-w-[85%] text-xs font-semibold leading-relaxed ${
                        m.role === 'user'
                          ? 'bg-brand-blue text-white rounded-tr-none'
                          : 'bg-white/5 border border-border-subtle text-slate-200 rounded-tl-none'
                      }`}
                    >
                      {m.content}
                    </div>
                  </div>
                ))
              )}
              {sending && (
                <div className="flex justify-start text-left">
                  <div className="p-3 rounded-2xl bg-white/5 border border-border-subtle text-slate-400 rounded-tl-none text-[10px] font-bold font-mono animate-pulse">
                    Consulting AI Counseling vectors...
                  </div>
                </div>
              )}
              <div ref={scrollRef} />
            </div>

            {/* Input Form Footer */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-border-subtle bg-black/40 flex gap-2">
              <input
                type="text"
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                className="flex-grow py-2 px-3 glass-input text-xs font-semibold"
                placeholder="Ask counseling Twin..."
                disabled={sending}
              />
              <button
                type="submit"
                disabled={sending || !inputMsg.trim()}
                className="w-10 h-10 rounded-xl bg-brand-cyan hover:opacity-90 flex items-center justify-center text-black shrink-0 transition-opacity cursor-pointer disabled:opacity-40"
              >
                <Send size={14} />
              </button>
            </form>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
