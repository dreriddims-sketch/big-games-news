/* src/App.jsx */
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import NewsPage from './pages/NewsPage';
import ArticlePage from './pages/ArticlePage';
import PinEntry from './pages/PinEntry';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar';

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
  const { isAdmin } = useAuth();

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<NewsPage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/article/:slug" element={<ArticlePage />} />
        <Route path="/login/pin" element={<PinEntry />} />
        <Route path="/login" element={<Login />} />
        
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
