import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';
import { 
  LayoutDashboard, 
  LogOut, 
  Menu, 
  X,
  MessageSquare
} from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setMobileMenuOpen(false);
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border-subtle bg-[#05060f]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left: Branding */}
        <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2">
          <Logo size={32} />
        </Link>

        {/* Center: Navigation links */}
        {user && (
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                  isActive(item.path)
                    ? 'text-brand-cyan bg-brand-cyan/10 border border-brand-cyan/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <item.icon size={14} />
                {item.name}
              </Link>
            ))}
          </nav>
        )}

        {/* Right: Actions */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-border-subtle">
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-brand-rose to-brand-blue flex items-center justify-center font-bold text-[10px] text-white uppercase font-mono">
                  {user.name ? user.name[0] : 'S'}
                </div>
                <span className="text-xs font-bold text-slate-300 max-w-[120px] truncate">{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl border border-border-subtle hover:bg-brand-rose hover:text-white text-slate-300 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
              >
                <LogOut size={12} />
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link 
                to="/login" 
                className="px-4 py-2 rounded-xl border border-border-subtle hover:bg-white hover:text-black text-white text-xs font-bold uppercase tracking-wider transition-all"
              >
                Sign In
              </Link>
              <Link 
                to="/register" 
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-brand-blue to-brand-indigo hover:opacity-90 text-white text-xs font-bold uppercase tracking-wider transition-all"
              >
                Create Account
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white focus:outline-none"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-[#0a0c21]/95 border-b border-border-subtle p-4 space-y-4 shadow-xl">
          {user ? (
            <>
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/5 border border-border-subtle">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-rose to-brand-blue flex items-center justify-center font-bold text-white uppercase">
                  {user.name ? user.name[0] : 'S'}
                </div>
                <div>
                  <p className="text-xs font-bold text-white">{user.name}</p>
                  <p className="text-[10px] text-slate-500">{user.email}</p>
                </div>
              </div>
              <div className="space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
                      isActive(item.path)
                        ? 'text-brand-cyan bg-brand-cyan/10 border-l-4 border-brand-cyan'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <item.icon size={16} />
                    {item.name}
                  </Link>
                ))}
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-brand-rose/20 bg-brand-rose/10 text-brand-rose text-xs font-bold uppercase tracking-wider transition-all"
              >
                <LogOut size={14} />
                Sign Out
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-2 pt-2">
              <Link 
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2.5 rounded-xl border border-border-subtle text-white font-bold text-xs uppercase tracking-wider hover:bg-white/5 transition-all"
              >
                Sign In
              </Link>
              <Link 
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2.5 rounded-xl bg-gradient-to-r from-brand-blue to-brand-indigo text-white font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-all"
              >
                Create Account
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
