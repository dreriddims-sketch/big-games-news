/* src/App.jsx */
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import NewsPage from './pages/NewsPage';
import ArticlePage from './pages/ArticlePage';
import FeedPage from './pages/FeedPage';
import ArchivePage from './pages/ArchivePage';
import SignalsPage from './pages/SignalsPage';
import PinEntry from './pages/PinEntry';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar';
import SignUp from './pages/SignUp';
import UserLogin from './pages/UserLogin';
import SocialDashboard from './pages/SocialDashboard';
import Profile from './pages/Profile';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { pinVerified, isAdmin } = useAuth();
  
  if (!pinVerified) {
    return <Navigate to="/login/pin" replace />;
  }
  
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

import LegalPage from './pages/LegalPage';

function AppRoutes() {
  const { isAdmin } = useAuth();

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<NewsPage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/archive" element={<ArchivePage />} />
        <Route path="/signals" element={<SignalsPage />} />
        <Route path="/article/:slug" element={<ArticlePage />} />
        <Route path="/login/pin" element={<PinEntry />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<UserLogin />} />
        <Route path="/social" element={<SocialDashboard />} />
        <Route path="/profile" element={<Profile />} />
        
        {/* Legal & Corporate Pages */}
        <Route path="/privacy" element={<LegalPage type="privacy" />} />
        <Route path="/terms" element={<LegalPage type="terms" />} />
        <Route path="/careers" element={<LegalPage type="careers" />} />
        <Route path="/press" element={<LegalPage type="press" />} />
        
        {/* Protected Dashboard Routes */}
        <Route 
          path="/dashboard/*" 
          element={
            <ProtectedRoute requireAdmin={true}>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
