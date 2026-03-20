/* src/context/AuthContext.jsx */
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [pinVerified, setPinVerified] = useState(() => {
    return localStorage.getItem('bg_pin_verified') === 'true';
  });

  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem('bg_admin_logged_in') === 'true';
  });

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('bg_admin_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    localStorage.setItem('bg_pin_verified', pinVerified);
  }, [pinVerified]);

  useEffect(() => {
    localStorage.setItem('bg_admin_logged_in', isAdmin);
  }, [isAdmin]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('bg_admin_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('bg_admin_user');
    }
  }, [user]);

  const verifyPin = (pin) => {
    if (pin === '1990') {
      setPinVerified(true);
      return true;
    }
    return false;
  };

  const login = (email, password) => {
    // Stage 2 verification
    if (email === 'dreriddims@gmail.com' && password === 'Mtvkannon2020@1') {
      setIsAdmin(true);
      setUser({ email: 'dreriddims@gmail.com', role: 'admin' });
      return true;
    }
    return false;
  };

  const [editMode, setEditMode] = useState(() => {
    return localStorage.getItem('bg_edit_mode') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('bg_edit_mode', editMode && isAdmin);
  }, [editMode, isAdmin]);

  const toggleEditMode = () => setEditMode(prev => !prev);

  const logout = () => {
    setIsAdmin(false);
    setPinVerified(false);
    setEditMode(false);
    setUser(null);
    localStorage.removeItem('bg_pin_verified');
    localStorage.removeItem('bg_admin_logged_in');
    localStorage.removeItem('bg_admin_user');
    localStorage.removeItem('bg_edit_mode');
  };

  return (
    <AuthContext.Provider value={{ 
      pinVerified, 
      isAdmin, 
      user, 
      editMode: editMode && isAdmin, 
      toggleEditMode,
      verifyPin, 
      login, 
      logout 
    }}>
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
