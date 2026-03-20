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
    <nav className="glass sticky top-0 z-50 border-b border-white/5 backdrop-blur-3xl">
      <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between relative z-10">
        <Link to="/" className="flex items-center gap-6 group">
          <div className="relative">
            <img src="/logo.png" alt="Big Games" className="h-10 w-auto relative z-10 brightness-200" />
            {isAdmin && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full border-2 border-black z-20" />
            )}
          </div>
          <div className="flex flex-col -space-y-1">
            <span className="text-3xl font-black text-white uppercase tracking-tighter italic leading-none transition-colors group-hover:text-primary">
              Network
            </span>
            <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] leading-none">
              News Terminal
            </span>
          </div>
        </Link>
        
        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-10">
          {['Feed', 'Archive', 'Signals'].map(link => (
            <Link key={link} to="/" className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40 hover:text-white transition-all">
              {link}
            </Link>
          ))}
          
          {isAdmin && !isDashboard && (
            <div className="flex items-center gap-4 px-6 py-2 bg-white/5 rounded-full border border-white/5">
              <span className={`text-[10px] font-black uppercase tracking-widest ${editMode ? 'text-primary' : 'text-white/30'}`}>
                {editMode ? 'Edit Mode On' : 'Edit Mode Off'}
              </span>
              <button 
                onClick={toggleEditMode}
                className={`w-12 h-6 rounded-full relative transition-all duration-500 ${editMode ? 'bg-primary' : 'bg-white/10'}`}
              >
                <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-all duration-500 ${editMode ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>
          )}

          {isAdmin ? (
            <div className="flex items-center gap-8">
              <Link 
                to="/dashboard" 
                className={`flex items-center gap-3 text-[11px] font-black uppercase tracking-widest ${isDashboard ? 'text-primary' : 'text-white/40 hover:text-white transition-all'}`}
              >
                <LayoutDashboard size={14} />
                Dashboard
              </Link>
              {!isDashboard && (
                <button onClick={logout} className="p-3 glass rounded-full hover:bg-red-500/20 hover:text-red-500 transition-all border-none">
                  <LogOut size={16} />
                </button>
              )}
            </div>
          ) : (
            <Link to="/login/pin" className="btn-primary py-3 px-8 text-[11px] uppercase font-black tracking-widest">
              Admin Access
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
