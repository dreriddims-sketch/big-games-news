/* src/components/HeroBanner.jsx */
import React, { useState, useEffect } from 'react';
import { Play, PlayCircle, ChevronRight } from 'lucide-react';
import { mockDB, dbEvents, saveToMockSettings, isSupabaseConfigured, supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const HeroBanner = () => {
  const { editMode } = useAuth();
  const [settings, setSettings] = useState(mockDB.settings);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const handleUpdate = () => {
      setSettings({...mockDB.settings});
    };
    dbEvents.addEventListener('change', handleUpdate);
    return () => dbEvents.removeEventListener('change', handleUpdate);
  }, []);

  const handleInlineEdit = (field, value) => {
    if (!editMode) return;
    saveToMockSettings({ [field]: value });
  };

  return (
    <div className="w-full relative overflow-hidden bg-black/60">
      <div className="max-w-7xl mx-auto px-6 py-20 lg:py-32 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center relative z-10">
        {/* Main Content */}
        <div className="lg:col-span-12 space-y-12 text-center flex flex-col items-center">
           <div className="space-y-6 max-w-5xl">
              <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full glass border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.4em]">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Featured Intelligence
              </div>
              
              <h1 
                contentEditable={editMode}
                onBlur={(e) => handleInlineEdit('hero_text', e.target.innerText)}
                suppressContentEditableWarning={true}
                className={`text-6xl md:text-9xl font-black leading-[0.9] uppercase tracking-tighter italic text-white transition-all select-none ${editMode ? 'bg-primary/5 rounded-3xl outline-none ring-1 ring-primary/20 p-6' : ''}`}
              >
                {settings.hero_text}
              </h1>
              
              <div className="flex flex-wrap items-center justify-center gap-8 pt-8">
                <a href="#feed" className="btn-primary flex items-center gap-4 text-xs font-black italic uppercase tracking-widest shadow-2xl shadow-primary/20 hover:scale-105 transition-transform active:scale-95">
                  Read Intel <ChevronRight size={18} />
                </a>
                <div className="flex items-center gap-6 text-[11px] font-black uppercase tracking-[0.3em] text-white/40">
                  REF_0x822 // ALPHA
                </div>
              </div>
           </div>
        </div>

        {/* Feature Grid - Re-balanced */}
        <div className="lg:col-span-8 group">
           <div className="premium-card relative min-h-[500px] flex flex-col justify-end p-0 rounded-3xl overflow-hidden border-white/10 shadow-3xl bg-black">
              <img 
                src={settings.hero_banner} 
                alt="Main" 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[4s] brightness-[0.5]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
           </div>
        </div>

        <div className="lg:col-span-4">
           <div className="premium-card p-10 flex flex-col gap-8 rounded-3xl border-white/10 glass-panel">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black uppercase italic flex items-center gap-4">
                  <PlayCircle className="text-primary" size={28} />
                  Spotlight
                </h3>
                <div className="text-[10px] bg-primary/10 text-primary px-3 py-1 rounded-full font-black uppercase tracking-widest border border-primary/20">
                   Rec_Live
                </div>
              </div>
              
              <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
                <iframe 
                  src={settings.youtube_url} 
                  title="Spotlight" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
              
              <div className="space-y-4">
                 <h4 className="text-xl font-black text-white italic uppercase leading-none tracking-tight">
                   Quantum Node Evolution
                 </h4>
                 <p className="text-sm text-text-secondary leading-relaxed opacity-60">
                   Deep dive into the decentralized architecture powering the future of the network.
                 </p>
                 <button className="w-full py-4 border-t border-white/5 text-[10px] font-black uppercase tracking-[0.3em] text-text-secondary hover:text-primary transition-colors">
                   View Documentation
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
