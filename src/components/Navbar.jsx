/* src/components/Navbar.jsx */
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAdmin, logout, editMode, toggleEditMode } = useAuth();
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Feed', path: '/feed' },
    { name: 'Archive', path: '/archive' },
    { name: 'Signals', path: '/signals' },
  ];

  return (
    <nav className="glass sticky top-0 z-50 border-b border-white/5 backdrop-blur-3xl">
      <div className="max-w-7xl mx-auto px-6 h-20 md:h-24 flex items-center justify-between relative z-10">
        <Link to="/" className="flex items-center gap-4 md:gap-6 group">
          <div className="relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/20 blur-[30px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 mix-blend-screen" />
            <img 
              src="/logo.png" 
              alt="Big Games" 
              className="h-10 md:h-12 w-auto relative z-10 drop-shadow-[0_0_12px_rgba(255,255,255,0.2)] group-hover:drop-shadow-[0_0_20px_rgba(255,153,0,0.6)] group-hover:scale-110 transition-all duration-500" 
            />
            {isAdmin && (
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 md:w-3 md:h-3 bg-primary rounded-full border-2 border-black z-20 shadow-[0_0_10px_rgba(255,153,0,0.8)]" />
            )}
          </div>
          <div className="flex flex-col -space-y-1">
            <span className="text-xl md:text-3xl font-black text-white uppercase tracking-tighter italic leading-none transition-colors group-hover:text-primary">
              Network
            </span>
            <span className="text-[8px] md:text-[10px] font-black text-white/30 uppercase tracking-[0.4em] leading-none">
              News Terminal
            </span>
          </div>
        </Link>
        
        {/* Mobile Menu Toggle Button */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-white/70 hover:text-white transition-colors"
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link key={link.name} to={link.path} className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40 hover:text-white transition-all">
              {link.name}
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

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-black/95 backdrop-blur-3xl border-b border-white/10 flex flex-col items-center py-8 gap-6 shadow-2xl">
          {navLinks.map((link) => (
            <Link key={link.name} to={link.path} className="text-[14px] font-black uppercase tracking-[0.3em] text-white/70 hover:text-white transition-all">
              {link.name}
            </Link>
          ))}
          
          <div className="w-1/2 h-px bg-white/10 my-2" />

          {isAdmin ? (
            <div className="flex flex-col items-center gap-6 w-full px-6">
              {!isDashboard && (
                <div className="flex items-center justify-between w-full max-w-xs px-6 py-4 bg-white/5 rounded-2xl border border-white/5">
                  <span className={`text-[12px] font-black uppercase tracking-widest ${editMode ? 'text-primary' : 'text-white/30'}`}>
                    {editMode ? 'Edit Mode On' : 'Edit Mode Off'}
                  </span>
                  <button 
                    onClick={toggleEditMode}
                    className={`w-14 h-7 rounded-full relative transition-all duration-500 ${editMode ? 'bg-primary' : 'bg-white/10'}`}
                  >
                    <div className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white transition-all duration-500 ${editMode ? 'translate-x-7' : 'translate-x-0'}`} />
                  </button>
                </div>
              )}
              
              <Link 
                to="/dashboard" 
                className={`flex items-center justify-center gap-3 w-full max-w-xs py-4 rounded-xl text-[12px] font-black uppercase tracking-widest bg-white/5 ${isDashboard ? 'text-primary border border-primary/20' : 'text-white/70 hover:text-white'}`}
              >
                <LayoutDashboard size={18} />
                Dashboard
              </Link>

              {!isDashboard && (
                <button onClick={logout} className="flex items-center justify-center gap-3 w-full max-w-xs py-4 rounded-xl bg-red-500/10 text-red-500 text-[12px] font-black uppercase tracking-widest hover:bg-red-500/20 transition-all">
                  <LogOut size={18} /> Sign Out
                </button>
              )}
            </div>
          ) : (
            <Link to="/login/pin" className="btn-primary w-full max-w-xs py-4 text-center text-[12px] uppercase font-black tracking-widest">
              Admin Access
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
