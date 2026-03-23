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
import LegalPage from './pages/LegalPage';
import ForYouPage from './pages/ForYouPage';
import LowCreditAlert from './components/LowCreditAlert';
import FloatingNav from './components/FloatingNav';

// Error boundary to prevent white screen crashes
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ background: '#08080a', color: '#fff', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', fontFamily: 'monospace' }}>
          <div style={{ fontSize: '3rem', fontWeight: 900, textTransform: 'uppercase', fontStyle: 'italic', color: '#f59e0b', marginBottom: '1rem' }}>SIGNAL_LOST</div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', maxWidth: '600px', textAlign: 'center', marginBottom: '2rem' }}>A runtime error occurred. Reconnecting to the terminal...</div>
          <pre style={{ background: '#ffffff10', padding: '1rem', borderRadius: '0.5rem', fontSize: '0.6rem', color: '#ef4444', maxWidth: '100%', overflow: 'auto' }}>
            {this.state.error?.toString()}
          </pre>
          <button onClick={() => window.location.reload()} style={{ marginTop: '2rem', background: '#f59e0b', color: '#000', border: 'none', padding: '1rem 2rem', borderRadius: '9999px', fontWeight: 900, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            REBOOT TERMINAL
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

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

function AppRoutes() {
  return (
    <>
      <Navbar />
      <LowCreditAlert />
      <FloatingNav />
      <Routes>
        <Route path="/" element={<NewsPage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/foryou" element={<ForYouPage />} />
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
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <ErrorBoundary>
            <AppRoutes />
          </ErrorBoundary>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
