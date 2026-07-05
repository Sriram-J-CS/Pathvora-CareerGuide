import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';

export default function Register() {
  const { user, signup, loading } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (user) {
      navigate('/onboarding');
    }
  }, [user, navigate]);

  const validate = () => {
    const errors = {};
    
    // Name checks
    if (!name.trim()) {
      errors.name = 'Name is required';
    } else if (name.trim().length < 3) {
      errors.name = 'Name must be at least 3 characters long';
    } else if (/^(.)\1{2,}$/.test(name.trim())) {
      errors.name = 'Character repetition detected. Please write your real name.';
    }

    // Email checks
    if (!email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Invalid email address';
    }

    // Password checks
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }

    // Confirm password checks
    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validate()) return;

    try {
      await signup(name, email, password, confirmPassword);
      navigate('/onboarding');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-[85vh] bg-dot-grid flex items-center justify-center p-4">
      {/* Decorative glows */}
      <div className="absolute top-1/4 left-1/3 w-[300px] h-[300px] bg-brand-cyan/5 glowing-spotlight" />
      <div className="absolute bottom-1/4 right-1/3 w-[300px] h-[300px] bg-brand-purple/5 glowing-spotlight" />

      <div className="w-full max-w-md glass-card p-8 space-y-6 relative z-10 text-left">
        <div className="space-y-1">
          <span className="inline-flex items-center gap-1.5 text-[9px] font-bold text-brand-purple uppercase tracking-wider font-mono">
            <Sparkles size={10} className="animate-pulse" />
            Establish Career Coordinates
          </span>
          <h2 className="text-2xl font-black text-white font-display">Create Your Account</h2>
          <p className="text-xs text-slate-400">Initialize your digital Career Twin profile</p>
        </div>

        {error && (
          <div className="p-3 bg-brand-rose/10 border border-brand-rose/25 rounded-xl text-brand-rose text-xs font-semibold font-mono">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Full Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (validationErrors.name) setValidationErrors(prev => ({ ...prev, name: '' }));
                }}
                className={`w-full pl-10 pr-4 py-3 glass-input text-xs font-semibold ${
                  validationErrors.name ? 'border-brand-rose' : ''
                }`}
                placeholder="Rahul Subramanian"
                required
              />
            </div>
            {validationErrors.name && (
              <span className="text-[10px] font-bold text-brand-rose font-mono block mt-0.5">{validationErrors.name}</span>
            )}
          </div>

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
                placeholder="rahul@gmail.com"
                required
              />
            </div>
            {validationErrors.email && (
              <span className="text-[10px] font-bold text-brand-rose font-mono block mt-0.5">{validationErrors.email}</span>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Choose passcode</label>
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

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Confirm Passcode</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (validationErrors.confirmPassword) setValidationErrors(prev => ({ ...prev, confirmPassword: '' }));
                }}
                className={`w-full pl-10 pr-4 py-3 glass-input text-xs font-semibold ${
                  validationErrors.confirmPassword ? 'border-brand-rose' : ''
                }`}
                placeholder="••••••••"
                required
              />
            </div>
            {validationErrors.confirmPassword && (
              <span className="text-[10px] font-bold text-brand-rose font-mono block mt-0.5">{validationErrors.confirmPassword}</span>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-brand-purple via-brand-blue to-brand-cyan hover:opacity-90 font-bold uppercase tracking-widest text-xs text-white rounded-xl shadow-lg shadow-brand-purple/20 transition-all flex items-center justify-center gap-1.5 mt-6 cursor-pointer"
          >
            {loading ? 'Registering Twin...' : 'Register Twin & Create Account'}
            <ArrowRight size={13} />
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-slate-500">
          Already have coordinates?{' '}
          <Link to="/login" className="text-brand-purple hover:underline font-bold">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
