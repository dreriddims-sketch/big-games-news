import React, { useState, useRef, useEffect } from 'react';
import { Play, Disc, ChevronRight, Mic, Upload } from 'lucide-react';
import { mockDB, saveToMockPodcasts, dbEvents } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const PodcastGrid = () => {
  const { editMode } = useAuth();
  const fileInputRef = useRef(null);
  const activePodcastIdRef = useRef(null);
  const [podcasts, setPodcasts] = useState(mockDB.podcasts);

  useEffect(() => {
    const handleUpdate = () => {
      setPodcasts([...mockDB.podcasts]);
    };
    dbEvents.addEventListener('change', handleUpdate);
    return () => dbEvents.removeEventListener('change', handleUpdate);
  }, []);

  const handleInlineEdit = (id, field, value) => {
    if (!editMode) return;
    const newPodcasts = mockDB.podcasts.map(p => p.id === id ? { ...p, [field]: value } : p);
    saveToMockPodcasts(newPodcasts);
  };

  const handleImageClick = (id) => {
    if (!editMode) return;
    activePodcastIdRef.current = id;
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const targetId = activePodcastIdRef.current;
    
    if (file && targetId) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new window.Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const size = 400; // Perfect for podcast grid display
          canvas.width = size;
          canvas.height = size;
          const ctx = canvas.getContext('2d');
          
          // Center crop to square
          const minDim = Math.min(img.width, img.height);
          const startX = (img.width - minDim) / 2;
          const startY = (img.height - minDim) / 2;
          
          ctx.drawImage(img, startX, startY, minDim, minDim, 0, 0, size, size);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.8); // Compress to save storage
          
          handleInlineEdit(targetId, 'image_url', dataUrl);
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div id="podcasts" className="py-24 px-6 max-w-7xl mx-auto space-y-20 relative z-10">
      {editMode && (
         <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
      )}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, margin: "-50px" }}
        transition={{ type: "spring", bounce: 0.4, duration: 0.8 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-12 pb-8 md:pb-12 border-b border-white/5"
      >
        <div className="space-y-4 md:space-y-6">
          <div className="inline-flex items-center gap-3 text-primary font-black uppercase tracking-widest text-[10px] bg-primary/5 px-6 py-2 rounded-full border border-primary/10">
            <Mic size={14} className="animate-pulse" /> Intelligence Original
          </div>
          <h2 className="text-5xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter italic leading-none transition-colors hover:text-primary">Podcasts</h2>
        </div>
        <button className="btn-secondary group flex items-center justify-center gap-4 w-full md:w-auto">
          Access Archive <ChevronRight size={18} className="group-hover:translate-x-2 transition-transform" />
        </button>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
        {podcasts.map((podcast, i) => (
          <motion.div
            initial={{ opacity: 0, x: i % 2 === 0 ? -150 : 150, scale: 0.85 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: false, margin: "-50px" }}
            transition={{ type: "spring", bounce: 0.5, duration: 0.8, delay: i * 0.1 }}
            key={podcast.id}
            className="h-full"
          >
            <div 
              className="premium-card group p-8 md:p-12 h-full flex flex-col items-center text-center gap-8 md:gap-12 rounded-3xl"
            >
            <div className={`relative ${editMode ? 'cursor-pointer' : ''}`} onClick={() => handleImageClick(podcast.id)}>
              <div className="w-44 h-44 rounded-full bg-gradient-to-br from-primary/5 to-white/5 flex items-center justify-center group-hover:scale-105 transition-transform duration-1000 border border-white/5 shadow-inner overflow-hidden relative">
                
                {podcast.image_url && (
                  <img 
                    src={podcast.image_url} 
                    alt={podcast.title} 
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${editMode ? 'group-hover:opacity-40' : 'group-hover:opacity-80'}`} 
                  />
                )}
                
                <div className="absolute inset-0 bg-black/20 pointer-events-none" />
                
                <Play size={44} className="text-white group-hover:text-primary transition-colors ml-1 relative z-10" />
                
                {editMode && (
                   <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                     <Upload className="text-primary mb-2" size={24} />
                     <span className="text-[10px] font-black uppercase text-primary tracking-widest">Upload</span>
                   </div>
                )}
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
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PodcastGrid;
