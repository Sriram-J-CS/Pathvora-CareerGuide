import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import OnboardingWizard from './pages/OnboardingWizard';
import Dashboard from './pages/Dashboard';

import Chatbot from './components/Chatbot';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4 bg-slate-950">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-rose via-brand-blue to-brand-cyan animate-spin flex items-center justify-center text-white font-bold text-sm">
          P
        </div>
        <p className="text-xs text-slate-400 animate-pulse font-mono font-semibold">Consulting Pathvora AI Counselor...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

import Contact from './pages/Contact';

function AppContent() {
  const { user } = useAuth();
  return (
    <div className="flex flex-col min-h-screen bg-slate-950">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/contact" element={<Contact />} />
          <Route 
            path="/onboarding" 
            element={
              <ProtectedRoute>
                <OnboardingWizard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {user && <Chatbot />}
    </div>
  );
}


export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}
