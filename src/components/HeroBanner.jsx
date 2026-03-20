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
    <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
      {/* Featured Banner (Main News) */}
      <div className="lg:col-span-12 xl:col-span-8 premium-card relative overflow-hidden group p-0 min-h-[400px] flex flex-col justify-end">
        <img 
          src={settings.hero_banner} 
          alt="Featured" 
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 brightness-[0.4]"
        />
        <div className="relative z-10 p-12 text-left space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-primary/20 text-primary text-xs font-bold uppercase tracking-widest backdrop-blur-xl">
            Featured News
          </div>
          <h1 
            contentEditable={editMode}
            onBlur={(e) => handleInlineEdit('hero_text', e.target.innerText)}
            suppressContentEditableWarning={true}
            className={`text-5xl md:text-7xl font-black max-w-2xl leading-[0.9] uppercase tracking-tighter transition-all ${editMode ? 'hover:bg-primary/10 rounded-lg outline-none cursor-text' : ''}`}
          >
            {settings.hero_text}
          </h1>
          <div className="flex flex-wrap gap-4 pt-4">
            <button className="btn-primary px-8 py-4 text-sm uppercase font-black tracking-widest">
              Read More <ChevronRight size={18} />
            </button>
            <button className="btn-secondary px-8 py-4 text-sm uppercase font-black tracking-widest">
              View All Posts
            </button>
          </div>
        </div>
      </div>

      {/* YouTube Section (Sidebar) */}
      <div className="lg:col-span-12 xl:col-span-4 premium-card p-6 flex flex-col gap-6">
        <div className="flex items-center justify-between pb-4 border-b border-white/5">
          <h3 className="text-xl font-black uppercase flex items-center gap-2">
            <Play className="text-red-500" size={24} />
            Live Spotlight
          </h3>
          <span className="text-xs text-emerald-500 flex items-center gap-1 font-bold animate-pulse">
            <div className="w-2 h-2 rounded-full bg-emerald-500" /> LIVE
          </span>
        </div>
        
        <div className="relative aspect-video rounded-xl overflow-hidden glass border-white/10 group">
          <iframe 
            src={settings.youtube_url} 
            title="YouTube video player" 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
            className="w-full h-full group-hover:scale-105 transition-transform duration-700"
          ></iframe>
        </div>

        <div className="bg-white/5 p-4 rounded-xl space-y-2 border border-white/5">
           <h4 className="text-sm font-bold text-white uppercase tracking-wider">Big Games Broadcast #112</h4>
           <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed">
             Watch our latest developer breakdown as we discuss the future of the Big Games universe.
           </p>
           <div className="pt-2 flex items-center justify-between">
              <span className="text-[10px] text-text-secondary/50 font-bold uppercase">Published 2h ago</span>
              <button className="text-[10px] text-primary font-bold uppercase hover:underline">Subscribe</button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
