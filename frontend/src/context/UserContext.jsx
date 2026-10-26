import React, { createContext, useState, useEffect, useContext } from 'react';
import { loginUser, registerUser, getUserProfile } from '../utils/api';

export const UserContext = createContext();

const DEFAULT_DEMO_USER = {
  name: 'Prasad Mahajan',
  username: 'prasad_m',
  email: 'prasad@devreview.io',
  role: 'user', // 'user' or 'admin'
  karma: 150,
  isModMode: false,
};

export function UserProvider({ children }) {
  // Load initial token and user from localStorage
  const [token, setToken] = useState(() => localStorage.getItem('devrev_token') || localStorage.getItem('token') || null);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('devrev_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return DEFAULT_DEMO_USER;
  });
  const [loading, setLoading] = useState(!token);

  // Sync user state changes to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('devrev_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('devrev_user');
    }
  }, [user]);

  // Sync token state to localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem('devrev_token', token);
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('devrev_token');
      localStorage.removeItem('token');
    }
  }, [token]);

  // Standard Login handler called by LoginPage
  const handleLogin = (authToken, userData) => {
    if (typeof authToken === 'object' && !userData) {
      userData = authToken;
      authToken = userData.token || 'devrev_demo_offline_jwt_token';
    }
    setToken(authToken);
    setUser({
      ...userData,
      isModMode: userData?.role === 'admin',
    });
  };

  // Logout handler
  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('devrev_token');
    localStorage.removeItem('token');
    localStorage.removeItem('devrev_user');
  };

  // Quick Demo Login (for easy viva / teacher demonstration of EXP 5 & 6)
  const quickDemoLogin = async (targetRole = 'user') => {
    const demoEmail = targetRole === 'admin' ? 'admin@devreview.io' : 'prasad@devreview.io';
    const demoPassword = 'password123';
    const demoName = targetRole === 'admin' ? 'Prof. Sharma (Admin)' : 'Prasad Mahajan (Student)';

    try {
      // 1. Attempt login with backend (EXP 5: POST /api/users/login)
      const res = await loginUser({ email: demoEmail, password: demoPassword });
      handleLogin(res.token, res.user);
      return { success: true, user: res.user, token: res.token };
    } catch (err) {
      // 2. If user doesn't exist yet in DB, auto-register them with the requested role
      try {
        const regRes = await registerUser({
          name: demoName,
          email: demoEmail,
          password: demoPassword,
          role: targetRole,
        });
        handleLogin(regRes.token, regRes.user);
        return { success: true, user: regRes.user, token: regRes.token };
      } catch (regErr) {
        // 3. Fallback mock session if backend is unreachable
        const fallbackToken = 'devrev_demo_offline_jwt_token';
        const fallbackUser = {
          name: demoName,
          username: demoEmail.split('@')[0],
          email: demoEmail,
          role: targetRole,
          karma: targetRole === 'admin' ? 500 : 150,
          isModMode: targetRole === 'admin',
        };
        handleLogin(fallbackToken, fallbackUser);
        return { success: true, user: fallbackUser, token: fallbackToken, offline: true };
      }
    }
  };

  // Auto-login as default Student user if no token exists on startup
  useEffect(() => {
    if (!token) {
      quickDemoLogin('user').finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  // Switch role on the fly (re-issues a genuine JWT token for that role)
  const switchRole = async (newRole) => {
    return await quickDemoLogin(newRole);
  };

  const toggleModMode = () => {
    setUser((prev) => ({
      ...(prev || DEFAULT_DEMO_USER),
      isModMode: !prev?.isModMode,
    }));
  };

  const addKarma = (points) => {
    setUser((prev) => ({
      ...(prev || DEFAULT_DEMO_USER),
      karma: (prev?.karma || 0) + points,
    }));
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        token,
        loading,
        login: handleLogin,
        logout: handleLogout,
        quickDemoLogin,
        switchRole,
        toggleModMode,
        addKarma,
        isAdmin: user?.role === 'admin' || user?.isModMode,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  return useContext(UserContext);
};