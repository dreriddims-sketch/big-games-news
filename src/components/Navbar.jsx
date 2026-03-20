/* src/components/Navbar.jsx */
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, LogOut, Disc, MessageSquare, Play, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAdmin, logout, editMode, toggleEditMode } = useAuth();
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');

  return (
    <nav className="glass sticky top-0 z-50">
      <div className="max-w-7xl auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="relative">
            <img src="/logo.png" alt="Big Games" className="h-10 w-auto" />
            {isAdmin && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full border-2 border-black" title="Admin Active" />
            )}
          </div>
          <span className="text-2xl font-black bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent uppercase tracking-tighter">
            News
          </span>
        </Link>
        
        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className={`text-sm font-semibold hover:text-primary transition-colors ${location.pathname === '/' ? 'text-primary' : 'text-text-secondary'}`}>
            Home
          </Link>
          
          {isAdmin && !isDashboard && (
            <div className="flex items-center gap-3 px-4 py-2 glass rounded-2xl border-primary/20 bg-primary/5">
              <span className={`text-[10px] font-black uppercase tracking-widest ${editMode ? 'text-primary' : 'text-text-secondary'}`}>
                {editMode ? 'Edit Mode ON' : 'Edit Mode OFF'}
              </span>
              <button 
                onClick={toggleEditMode}
                className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${editMode ? 'bg-primary' : 'bg-white/10'}`}
              >
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-300 ${editMode ? 'left-5.5' : 'left-0.5'} ${editMode ? 'translate-x-[18px]' : ''}`} />
              </button>
            </div>
          )}

          {isAdmin ? (
            <>
              <div className="h-4 w-px bg-border-glass"></div>
              <Link 
                to="/dashboard" 
                className={`flex items-center gap-2 text-sm font-semibold ${isDashboard ? 'text-primary' : 'text-text-secondary hover:text-primary transition-colors'}`}
              >
                <LayoutDashboard size={18} />
                Dashboard
              </Link>
              {!isDashboard && (
                <button onClick={logout} className="btn-secondary py-2 flex items-center gap-2 text-xs uppercase font-black">
                  <LogOut size={16} /> Exit
                </button>
              )}
            </>
          ) : (
            <Link to="/login/pin" className="btn-primary py-2 text-sm uppercase font-black tracking-widest">
              Admin Access
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
