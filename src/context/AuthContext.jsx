import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabaseUpdateUser, fetchUserSync } from '../lib/supabase';

const AuthContext = createContext(null);

const STARTER_CREDITS = 150;

// Helper: get credits store
const getCreditsStore = () => JSON.parse(localStorage.getItem('bg_credits') || '{}');
const saveCreditsStore = (store) => localStorage.setItem('bg_credits', JSON.stringify(store));

// Helper: get likes store
const getLikesStore = () => JSON.parse(localStorage.getItem('bg_likes') || '{}');
const saveLikesStore = (store) => localStorage.setItem('bg_likes', JSON.stringify(store));

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

  const [showLowCreditAlert, setShowLowCreditAlert] = useState(false);

  useEffect(() => {
    localStorage.setItem('bg_pin_verified', pinVerified);
  }, [pinVerified]);

  useEffect(() => {
    localStorage.setItem('bg_admin_logged_in', isAdmin);
  }, [isAdmin]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('bg_admin_user', JSON.stringify(user));
      // AUTO-SYNC TO CLOUD IF LOGGED IN
      if (user.id) {
        supabaseUpdateUser(user.id, {
          username: user.username,
          bio: user.bio,
          photo: user.photo,
          banner: user.banner,
          likes_map: getLikesStore()[user.id] || {}
        });
      }
    } else {
      localStorage.removeItem('bg_admin_user');
    }
  }, [user]);

  // ────────── CREDITS ──────────
  const getUserCredits = (userId) => {
    if (!userId) return 0;
    const store = getCreditsStore();
    return store[userId] ?? STARTER_CREDITS;
  };

  const currentCredits = user ? getUserCredits(user.id) : 0;

  const addCredits = (amount, targetUserId) => {
    const uid = targetUserId || user?.id;
    if (!uid) return;
    const store = getCreditsStore();
    const prev = store[uid] ?? STARTER_CREDITS;
    store[uid] = prev + amount;
    saveCreditsStore(store);
    if (uid === user?.id) {
      // force re-render via a dummy state update
      setUser(u => ({ ...u }));
    }
  };

  const spendCredits = (amount) => {
    if (!user?.id) return false;
    const store = getCreditsStore();
    const prev = store[user.id] ?? STARTER_CREDITS;
    if (prev < amount) {
      setShowLowCreditAlert(true);
      return false;
    }
    store[user.id] = prev - amount;
    saveCreditsStore(store);
    // warn if now low
    if (store[user.id] < 50) {
      setShowLowCreditAlert(true);
    }
    setUser(u => ({ ...u }));
    return true;
  };

  const dismissLowCreditAlert = () => setShowLowCreditAlert(false);

  // ────────── LIKES ──────────
  const getLikedPosts = () => {
    if (!user?.id) return {};
    const store = getLikesStore();
    return store[user.id] || {};
  };

  const toggleLike = (postId) => {
    if (!user?.id) return false;
    const store = getLikesStore();
    const userLikes = store[user.id] || {};
    if (userLikes[postId]) {
      delete userLikes[postId];
    } else {
      userLikes[postId] = true;
    }
    store[user.id] = userLikes;
    saveLikesStore(store);
    return userLikes[postId] === true;
  };

  const isPostLiked = (postId) => {
    if (!user?.id) return false;
    const store = getLikesStore();
    return !!(store[user.id]?.[postId]);
  };

  // ────────── ALL USERS (for admin) ──────────
  const getAllUsers = () => {
    const savedUsers = JSON.parse(localStorage.getItem('bg_users') || '[]');
    const store = getCreditsStore();
    return savedUsers.map(u => ({
      ...u,
      credits: store[u.id] ?? STARTER_CREDITS
    }));
  };

  const setUserCreditsAdmin = (userId, amount) => {
    const store = getCreditsStore();
    store[userId] = amount;
    saveCreditsStore(store);
    if (userId === user?.id) setUser(u => ({ ...u }));
  };

  // ────────── AUTH ──────────
  const verifyPin = (pin) => {
    if (pin === '1990') {
      setPinVerified(true);
      return true;
    }
    return false;
  };

  const signupUser = (email, password, isOver18) => {
    if (!isOver18) return { success: false, message: 'You must be 18+ to sign up' };
    
    const savedUsers = JSON.parse(localStorage.getItem('bg_users') || '[]');
    if (savedUsers.find(u => u.email === email)) {
      return { success: false, message: 'User already exists' };
    }
    
    const newUser = {
      id: 'u' + Date.now(),
      email,
      password,
      isOver18,
      role: 'user',
      username: email.split('@')[0],
      bio: '',
      credits: STARTER_CREDITS,
      created_at: new Date().toISOString()
    };
    
    savedUsers.push(newUser);
    localStorage.setItem('bg_users', JSON.stringify(savedUsers));

    // Give starter credits
    const store = getCreditsStore();
    store[newUser.id] = STARTER_CREDITS;
    saveCreditsStore(store);
    
    setUser(newUser);
    return { success: true };
  };

  const login = async (email, password) => {
    // Stage 2 verification (admin)
    if (email === 'dreriddims@gmail.com' && password === 'Mtvkannon2020@1') {
      const adminUser = { id: 'admin-1', email: 'dreriddims@gmail.com', role: 'admin', username: 'dreriddims' };
      setIsAdmin(true);
      setUser(adminUser);
      // Give admin unlimited credits
      const store = getCreditsStore();
      if (!store['admin-1']) { store['admin-1'] = 9999; saveCreditsStore(store); }
      return true;
    }
    
    // Check normal users
    const savedUsers = JSON.parse(localStorage.getItem('bg_users') || '[]');
    
    // Check info.p2sr@gmail.com (standardised fallback)
    if (email === 'info.p2sr@gmail.com' && password === 'Mtvkannon2020@1' && savedUsers.filter(u => u.id === 'u-info-p2sr').length === 0) {
      const initUser = { id: 'u-info-p2sr', email: 'info.p2sr@gmail.com', password: 'Mtvkannon2020@1', isOver18: true, role: 'user', username: 'info_p2sr', bio: 'Content Creator' };
      savedUsers.push(initUser);
      localStorage.setItem('bg_users', JSON.stringify(savedUsers));
    }

    const foundUser = savedUsers.find(u => u.email === email && u.password === password);
    if (foundUser) {
       // Deep Sync from Supabase if available
       const cloudUser = await fetchUserSync(foundUser.id);
       const syncUser = cloudUser ? { ...foundUser, ...cloudUser } : foundUser;
       
       // Restore Likes for this device
       if (syncUser.likes_map) {
         const likesStore = getLikesStore();
         likesStore[syncUser.id] = syncUser.likes_map;
         saveLikesStore(likesStore);
       }
       
       // Ensure starter credits
       const store = getCreditsStore();
       if (store[syncUser.id] === undefined) {
         store[syncUser.id] = STARTER_CREDITS;
         saveCreditsStore(store);
       }
       setUser(syncUser);
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

  const updateUser = async (updatedData) => {
    if (!user) return false;
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    
    // 1. Sync Mock LS
    const savedUsers = JSON.parse(localStorage.getItem('bg_users') || '[]');
    const index = savedUsers.findIndex(u => u.id === user.id);
    if (index !== -1) {
      savedUsers[index] = updatedUser;
      localStorage.setItem('bg_users', JSON.stringify(savedUsers));
    }

    // 2. Sync Real Supabase
    await supabaseUpdateUser(user.id, updatedUser);
    return true;
  };

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
      signupUser,
      login, 
      logout,
      updateUser,
      // Credits
      currentCredits,
      getUserCredits,
      addCredits,
      spendCredits,
      showLowCreditAlert,
      dismissLowCreditAlert,
      getAllUsers,
      setUserCreditsAdmin,
      STARTER_CREDITS,
      // Likes
      toggleLike,
      isPostLiked,
      getLikedPosts,
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
