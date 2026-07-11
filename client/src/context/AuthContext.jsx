import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sync token from localStorage or session
  const checkSession = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        // Clear state if token validation failed
        setUser(null);
      }
    } catch (error) {
      console.warn('Session verification failed, attempting sandbox fallback:', error);
      const storedUser = localStorage.getItem('pathvora_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Invalid credentials');
      }

      setUser(data.user);
      localStorage.setItem('pathvora_token', data.token || 'real-token');
      localStorage.setItem('pathvora_user', JSON.stringify(data.user));
      return data.user;
    } catch (error) {
      // If it's a network error or running on GitHub Pages (static site)
      if (error.message.includes('Failed to fetch') || window.location.hostname.endsWith('github.io') || window.location.port === '') {
        console.warn('Backend connection failed. Authenticating in static sandbox mode.');
        const mockUser = {
          id: 'sandbox-user-id',
          name: email.split('@')[0] || 'Sandbox User',
          email: email,
          isOnboarded: true
        };
        setUser(mockUser);
        localStorage.setItem('pathvora_token', 'sandbox-token');
        localStorage.setItem('pathvora_user', JSON.stringify(mockUser));
        return mockUser;
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name, email, password, confirmPassword) => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, confirmPassword })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to register');
      }

      setUser(data.user);
      localStorage.setItem('pathvora_token', data.token || 'real-token');
      localStorage.setItem('pathvora_user', JSON.stringify(data.user));
      return data.user;
    } catch (error) {
      if (error.message.includes('Failed to fetch') || window.location.hostname.endsWith('github.io') || window.location.port === '') {
        console.warn('Backend connection failed. Creating profile in static sandbox mode.');
        const mockUser = {
          id: 'sandbox-user-id',
          name: name || 'Sandbox User',
          email: email,
          isOnboarded: true
        };
        setUser(mockUser);
        localStorage.setItem('pathvora_token', 'sandbox-token');
        localStorage.setItem('pathvora_user', JSON.stringify(mockUser));
        return mockUser;
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.warn('Logout server request failed, clearing local sandbox session:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('pathvora_token');
      localStorage.removeItem('pathvora_user');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, refreshUser: checkSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
