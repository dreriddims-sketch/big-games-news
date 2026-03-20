/* src/components/NewsletterPopup.jsx */
import React, { useState, useEffect } from 'react';
import { X, Mail, Bell, Sparkles } from 'lucide-react';
import { mockDB, dbEvents } from '../lib/supabase';

const NewsletterPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const [settings, setSettings] = useState(mockDB.settings);

  useEffect(() => {
    const handleUpdate = () => setSettings({...mockDB.settings});
    dbEvents.addEventListener('change', handleUpdate);
    
    const timer = setTimeout(() => {
      const shown = sessionStorage.getItem('newsletter_shown');
      if (!shown) {
        setIsOpen(true);
      }
    }, settings.popup_frequency || 5000);

    return () => {
      clearTimeout(timer);
      dbEvents.removeEventListener('change', handleUpdate);
    };
  }, [settings.popup_frequency]);

  const closePopup = () => {
    setIsOpen(false);
    sessionStorage.setItem('newsletter_shown', 'true');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(closePopup, 3000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-500">
      <div className="max-w-md w-full premium-card relative overflow-hidden p-0 shadow-[0_0_100px_rgba(245,158,11,0.2)] border-primary/20">
        <button 
          onClick={closePopup}
          className="absolute top-4 right-4 p-2 glass rounded-full hover:bg-white/10 transition-colors z-20"
        >
          <X size={20} />
        </button>

        <div className="p-8 space-y-8">
          <div className="text-center space-y-4">
             <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-primary to-orange-400 p-0.5 animate-pulse">
                <div className="w-full h-full rounded-[22px] bg-black/80 flex items-center justify-center text-primary">
                   <Bell size={32} />
                </div>
             </div>
             <h2 className="text-4xl font-black uppercase tracking-tighter leading-none italic">
                Get Exclusive Access
             </h2>
             <p className="text-text-secondary text-sm font-medium leading-relaxed">
                {settings.popup_text}
             </p>
          </div>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm font-bold tracking-wide"
                  required
                />
              </div>
              <button 
                type="submit" 
                className="btn-primary w-full py-4 uppercase font-black tracking-widest text-sm shadow-xl flex items-center justify-center gap-3"
              >
                Sign Me Up <Sparkles size={18} />
              </button>
            </form>
          ) : (
            <div className="text-center py-6 animate-in zoom-in-95 duration-500 space-y-2">
               <div className="text-emerald-400 text-lg font-black uppercase italic tracking-tighter">
                  Welcome to the Brotherhood!
               </div>
               <p className="text-text-secondary text-xs">Verify your inbox to confirm your transmission.</p>
            </div>
          )}

          <p className="text-center text-[10px] text-text-secondary/40 font-bold uppercase tracking-widest">
            Privacy Guaranteed • 0 Spam Transmission
          </p>
        </div>

        <div className="h-2 w-full bg-gradient-to-r from-primary via-orange-500 to-amber-600 animate-gradient-x" />
      </div>
    </div>
  );
};

export default NewsletterPopup;
