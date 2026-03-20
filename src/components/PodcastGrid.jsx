import React from 'react';
import { Play, Disc, ChevronRight, Mic } from 'lucide-react';
import { mockDB, saveToMockPosts } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const PodcastGrid = () => {
  const { editMode } = useAuth();

  const handleInlineEdit = (id, field, value) => {
    if (!editMode) return;
    // Note: Podcasts are currently just mock data in mockDB. 
    // If we wanted to persist them, we'd need a saveToMockPodcasts function.
    // For now, I'll just update the local object to show it's possible.
    mockDB.podcasts = mockDB.podcasts.map(p => p.id === id ? { ...p, [field]: value } : p);
  };

  return (
    <div id="podcasts" className="py-24 px-6 max-w-7xl mx-auto space-y-20 relative z-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 pb-12 border-b border-white/5">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-3 text-primary font-black uppercase tracking-widest text-[10px] bg-primary/5 px-6 py-2 rounded-full border border-primary/10">
            <Mic size={14} className="animate-pulse" /> Intelligence Original
          </div>
          <h2 className="text-6xl md:text-9xl font-black uppercase tracking-tighter italic leading-none transition-colors hover:text-primary">Podcasts</h2>
        </div>
        <button className="btn-secondary group flex items-center gap-4">
          Access Archive <ChevronRight size={18} className="group-hover:translate-x-2 transition-transform" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
        {mockDB.podcasts.map((podcast, i) => (
          <div 
            key={podcast.id} 
            className="premium-card group p-12 flex flex-col items-center text-center gap-12 rounded-3xl"
          >
            <div className="relative">
              <div className="w-44 h-44 rounded-full bg-gradient-to-br from-primary/5 to-white/5 flex items-center justify-center group-hover:scale-105 transition-transform duration-1000 border border-white/5 shadow-inner">
                <Play size={44} className="text-white group-hover:text-primary transition-colors ml-1 relative z-10" />
              </div>
            </div>
            
            <div className="space-y-6 w-full">
              <h3 
                contentEditable={editMode}
                onBlur={(e) => handleInlineEdit(podcast.id, 'title', e.target.innerText)}
                suppressContentEditableWarning={true}
                className={`text-2xl font-black text-white uppercase tracking-tight italic transition-colors group-hover:text-primary ${editMode ? 'bg-primary/5 rounded-xl px-2 py-4 outline-none ring-1 ring-primary/20' : ''}`}
              >
                {podcast.title}
              </h3>
              <div className="flex flex-col gap-4 items-center">
                <p className="text-[10px] text-white/30 uppercase font-black tracking-widest leading-none">
                   Stream ID #0{podcast.id}
                </p>
                <div className="w-12 h-0.5 bg-white/5 group-hover:w-20 group-hover:bg-primary/20 transition-all duration-700" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PodcastGrid;
