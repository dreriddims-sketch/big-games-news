/* src/pages/ArchivePage.jsx */
import React, { useState, useEffect } from 'react';
import PodcastGrid from '../components/PodcastGrid';
import { Disc, Music, Mic2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { mockDB, dbEvents, saveToMockSettings } from '../lib/supabase';

const ArchivePage = () => {
  const { editMode } = useAuth();
  const [settings, setSettings] = useState(mockDB.settings);

  useEffect(() => {
    const handleUpdate = () => setSettings({...mockDB.settings});
    dbEvents.addEventListener('change', handleUpdate);
    return () => dbEvents.removeEventListener('change', handleUpdate);
  }, []);

  const handlePageEdit = (field, value) => {
    if (!editMode) return;
    const newData = { ...settings.page_data };
    newData.archive[field] = value;
    saveToMockSettings({ page_data: newData });
  };

  return (
    <div className="min-h-screen bg-background text-white font-sans">
      <header className="max-w-7xl mx-auto px-6 pt-40 pb-20 space-y-12 border-b border-white/5">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full glass border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.4em]">
              <Disc size={14} className="animate-spin" />
              Intelligence Audio Archive // DECODED
            </div>
            <h1 
              contentEditable={editMode}
              onBlur={(e) => handlePageEdit('title', e.target.innerText)}
              suppressContentEditableWarning={true}
              className={`text-7xl md:text-9xl font-black uppercase tracking-tighter italic leading-none ${editMode ? 'bg-primary/5 rounded-2xl p-4 outline-none ring-1 ring-primary/20' : ''}`}
            >
              {settings.page_data.archive.title}
            </h1>
            <p 
              contentEditable={editMode}
              onBlur={(e) => handlePageEdit('desc', e.target.innerText)}
              suppressContentEditableWarning={true}
              className={`text-text-secondary text-xl max-w-2xl leading-relaxed font-medium ${editMode ? 'bg-primary/5 rounded-xl p-4 outline-none ring-1 ring-primary/20 mt-4 block' : ''}`}
            >
              {settings.page_data.archive.desc}
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-12 text-center">
             <div>
                <div className="text-primary text-4xl font-black italic uppercase">42+</div>
                <div className="text-[10px] text-white/30 font-black uppercase tracking-widest mt-2">Transmissions</div>
             </div>
             <div>
                <div className="text-primary text-4xl font-black italic uppercase">12k</div>
                <div className="text-[10px] text-white/30 font-black uppercase tracking-widest mt-2">Core Listeners</div>
             </div>
          </div>
        </div>
      </header>

      <main className="py-24">
        <PodcastGrid />
      </main>

      <footer className="max-w-7xl mx-auto px-6 py-24 border-t border-white/5 text-center space-y-8">
         <div className="text-4xl font-black uppercase italic tracking-tighter">SUBSCRIBE // CORE_FEED</div>
         <div className="flex justify-center gap-12">
            {['Apple', 'Spotify', 'Youtube', 'RSS'].map(platform => (
               <button key={platform} className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 hover:text-white transition-all">
                  {platform}_LOGS
               </button>
            ))}
         </div>
      </footer>
    </div>
  );
};

export default ArchivePage;
