import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';

export default function Login() {
  const { user, login, loading, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (user) {
      if (user.isOnboarded) {
        navigate('/dashboard');
      } else {
        navigate('/onboarding');
      }
    }
  }, [user, navigate]);

  const validate = () => {
    const errors = {};
    if (!email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Invalid email address';
    }
    if (!password) {
      errors.password = 'Password is required';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validate()) return;

    try {
      const u = await login(email, password);
      // Refresh user context to verify onboarding status
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const session = await response.json();
        if (session.user.isOnboarded) {
          navigate('/dashboard');
        } else {
          navigate('/onboarding');
        }
        // Force state sync
        await refreshUser();
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    }
  };

  return (
    <div className="min-h-[85vh] bg-dot-grid flex items-center justify-center p-4">
      {/* Decorative glows */}
      <div className="absolute top-1/4 left-1/3 w-[300px] h-[300px] bg-brand-cyan/5 glowing-spotlight" />
      <div className="absolute bottom-1/4 right-1/3 w-[300px] h-[300px] bg-brand-purple/5 glowing-spotlight" />

      <div className="w-full max-w-md glass-card p-8 space-y-6 relative z-10 text-left">
        <div className="space-y-1">
          <span className="inline-flex items-center gap-1.5 text-[9px] font-bold text-brand-cyan uppercase tracking-wider font-mono">
            <Sparkles size={10} className="animate-pulse" />
            Security Gateway Active
          </span>
          <h2 className="text-2xl font-black text-white font-display">Sign In to Pathvora</h2>
          <p className="text-xs text-slate-400 mt-1">Unlock your AI-guided career pathways</p>
        </div>

        {error && (
          <div className="p-3 bg-brand-rose/10 border border-brand-rose/25 rounded-xl text-brand-rose text-xs font-semibold font-mono">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (validationErrors.email) setValidationErrors(prev => ({ ...prev, email: '' }));
                }}
                className={`w-full pl-10 pr-4 py-3 glass-input text-xs font-semibold ${
                  validationErrors.email ? 'border-brand-rose' : ''
                }`}
                placeholder="name@domain.com"
                required
              />
            </div>
            {validationErrors.email && (
              <span className="text-[10px] font-bold text-brand-rose font-mono block mt-0.5">{validationErrors.email}</span>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Credential Passcode</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (validationErrors.password) setValidationErrors(prev => ({ ...prev, password: '' }));
                }}
                className={`w-full pl-10 pr-4 py-3 glass-input text-xs font-semibold ${
                  validationErrors.password ? 'border-brand-rose' : ''
                }`}
                placeholder="••••••••"
                required
              />
            </div>
            {validationErrors.password && (
              <span className="text-[10px] font-bold text-brand-rose font-mono block mt-0.5">{validationErrors.password}</span>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-brand-cyan via-brand-blue to-brand-purple hover:opacity-90 font-bold uppercase tracking-widest text-xs text-white rounded-xl shadow-lg shadow-brand-blue/20 transition-all flex items-center justify-center gap-1.5 mt-6 cursor-pointer"
          >
            {loading ? 'Authenticating...' : 'Sign In and Launch Console'}
            <ArrowRight size={13} />
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-slate-500">
          First-time user?{' '}
          <Link to="/register" className="text-brand-cyan hover:underline font-bold">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}
