import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, PlayCircle, ChevronRight, Pencil, Upload, Image as ImageIcon } from 'lucide-react';
import { mockDB, dbEvents, saveToMockSettings, isSupabaseConfigured, supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const HeroBanner = () => {
  const { editMode } = useAuth();
  const [settings, setSettings] = useState(mockDB.settings);
  const [isEditing, setIsEditing] = useState(false);
  const titleRef = React.useRef(null);
  const fileInputRef = React.useRef(null);
  const logoInputRef = React.useRef(null);

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

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        saveToMockSettings({ [field]: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const extractVideoId = (url) => {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      return match[2];
    }
    if (url.length === 11) return url;
    // Fallback logic
    try {
      if (url.includes('youtube.com/watch')) {
        return new URL(url).searchParams.get('v') || url;
      } else if (url.includes('youtu.be/')) {
        return new URL(url).pathname.slice(1) || url;
      }
    } catch (e) {}
    return url.split(/[=/]/).pop()?.split('?')[0] || '';
  };

  const getEmbedUrl = (url) => {
    const videoId = extractVideoId(url);
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };

  return (
    <div className="w-full flex flex-col">
      <div className="w-full border-b border-primary/10">
        {/* Full Bleed Banner Section */}
        <div className="relative group/logo w-full bg-black flex overflow-hidden">
          <input 
            type="file" 
            ref={logoInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={(e) => handleFileChange(e, 'hero_brand_banner')} 
          />
          
          <div 
            className={`relative w-full ${editMode ? 'cursor-pointer' : ''}`}
            onClick={() => editMode && logoInputRef.current?.click()}
          >
             <img 
               src={settings.hero_brand_banner || '/brand-banner.png'} 
               alt="Big Games Banner Desktop" 
               className="w-full h-auto block transition-transform duration-[2s] group-hover/logo:scale-[1.01] bg-black relative z-10"
             />
             {/* Transparent Video Overlay */}
             <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden mix-blend-screen opacity-60 mix-blend-lighten">
                <iframe
                 src={`${getEmbedUrl(settings.banner_youtube_url || settings.youtube_url)}?autoplay=1&mute=1&playsinline=1&controls=0&loop=1&playlist=${extractVideoId(settings.banner_youtube_url || settings.youtube_url)}&disablekb=1&vq=hd1080`}
                 className="absolute top-1/2 left-1/2 w-[150vw] md:w-[120vw] h-[150vw] md:h-[120vw] -translate-x-1/2 -translate-y-1/2 opacity-70 scale-125"
                 title="Banner Background Loop"
                 frameBorder="0"
                 allow="autoplay; encrypted-media"
                 allowFullScreen
               />
               <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]" />
             </div>
             
             {editMode && (
               <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 ring-4 ring-inset ring-primary/50 opacity-0 group-hover/logo:opacity-100 transition-opacity z-20 backdrop-blur-md gap-4">
                 <div className="flex flex-col items-center pointer-events-none">
                   <Upload className="text-primary mb-2 animate-bounce flex-shrink-0" size={32} />
                   <span className="text-sm font-black uppercase tracking-[0.3em] text-primary drop-shadow-md text-center shadow-black">Update Full-Width Banner Image</span>
                 </div>
                 
                 <input 
                   type="text"
                   value={settings.banner_youtube_url || ''}
                   onChange={(e) => handleInlineEdit('banner_youtube_url', e.target.value)}
                   onClick={(e) => e.stopPropagation()}
                   placeholder="Or Paste YouTube URL Here..."
                   className="w-3/4 max-w-md bg-black/50 border border-white/20 rounded-full py-3 px-6 text-white text-xs font-bold text-center outline-none focus:border-primary focus:ring-1 focus:ring-primary pointer-events-auto backdrop-blur-2xl shadow-2xl transition-all"
                 />
               </div>
             )}
          </div>
        </div>
      </div>

      <div className="w-full relative overflow-hidden bg-black/60 pt-0">
        <div className="max-w-7xl mx-auto px-4 md:px-6 pb-12 pt-8 md:pb-20 md:pt-16 lg:py-24 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center relative z-10">
          {/* Main Content */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false, margin: "-50px" }}
            transition={{ type: "spring", bounce: 0.5, duration: 1, delay: 0.1 }}
            className="lg:col-span-12 space-y-8 md:space-y-12 text-center flex flex-col items-center"
          >
             <div className="space-y-8 max-w-5xl relative group/hero">

              <div className="relative inline-block mt-4">
                <h1 
                  ref={titleRef}
                  contentEditable={editMode}
                  onBlur={(e) => handleInlineEdit('hero_text', e.target.innerText)}
                  suppressContentEditableWarning={true}
                  className={`text-5xl md:text-8xl lg:text-9xl font-black leading-[0.9] md:leading-[0.9] uppercase tracking-tighter italic text-white transition-all select-none ${editMode ? 'bg-primary/5 rounded-3xl outline-none ring-1 ring-primary/20 p-4 md:p-6 pr-16 md:pr-20' : ''}`}
                >
                  {settings.hero_text}
                </h1>
                
                {editMode && (
                  <button 
                    onClick={() => titleRef.current?.focus()}
                    className="absolute right-6 top-1/2 -translate-y-1/2 p-4 bg-primary text-black rounded-2xl hover:scale-110 transition-transform shadow-2xl shadow-primary/40 animation-pulse"
                    title="Edit Headline"
                  >
                    <Pencil size={20} />
                  </button>
                )}
              </div>
              
              <div className="flex flex-wrap items-center justify-center gap-8 pt-8">
                <Link to="/feed" className="btn-primary flex items-center gap-4 text-xs font-black italic uppercase tracking-widest shadow-2xl shadow-primary/20 hover:scale-105 transition-transform active:scale-95">
                  Read Intel <ChevronRight size={18} />
                </Link>
                <div className="flex items-center gap-6 text-[11px] font-black uppercase tracking-[0.3em] text-white/40">
                  REF_0x822 // ALPHA
                </div>
              </div>
           </div>
        </motion.div>

        {/* Feature Grid - Re-balanced */}
        <motion.div 
           initial={{ opacity: 0, x: -150, scale: 0.95 }}
           whileInView={{ opacity: 1, x: 0, scale: 1 }}
           viewport={{ once: false, margin: "-50px" }}
           transition={{ type: "spring", bounce: 0.4, duration: 1, delay: 0.1 }}
           className="lg:col-span-8 group relative w-full"
        >
           <input 
             type="file" 
             ref={fileInputRef} 
             className="hidden" 
             accept="image/*" 
             onChange={(e) => handleFileChange(e, 'hero_banner')} 
           />
           
           <a 
             href={editMode ? undefined : "/article/global-esports-tournament-announced"}
             className="premium-card relative min-h-[350px] md:min-h-[500px] flex flex-col justify-end p-0 rounded-2xl md:rounded-3xl overflow-hidden border-white/10 shadow-3xl bg-black block group"
           >
              <img 
                src={settings.hero_banner} 
                alt="Main" 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[4s]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
              
              {editMode && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); fileInputRef.current?.click(); }}
                    className="flex items-center gap-4 px-12 py-6 bg-primary text-black text-xs font-black uppercase tracking-widest rounded-2xl hover:scale-110 transition-transform shadow-2xl shadow-primary/40"
                  >
                    <Upload size={20} /> Upload Artwork
                  </button>
                </div>
              )}
           </a>
        </motion.div>

        <motion.div 
           initial={{ opacity: 0, x: 150, scale: 0.95 }}
           whileInView={{ opacity: 1, x: 0, scale: 1 }}
           viewport={{ once: false, margin: "-50px" }}
           transition={{ type: "spring", bounce: 0.4, duration: 1, delay: 0.2 }}
           className="lg:col-span-4 w-full"
        >
           <div className="premium-card p-6 md:p-10 flex flex-col gap-6 md:gap-8 rounded-2xl md:rounded-3xl border-white/10 glass-panel">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black uppercase italic flex items-center gap-4">
                  <PlayCircle className="text-primary" size={28} />
                  Spotlight
                </h3>
              </div>
              
              <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
                <iframe 
                  src={getEmbedUrl(settings.youtube_url)} 
                  title="Spotlight" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
                {editMode && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 ring-2 ring-inset ring-primary/50 opacity-0 group-hover:opacity-100 transition-opacity z-20 backdrop-blur-md gap-4">
                    <div className="flex flex-col items-center pointer-events-none">
                      <Play className="text-primary mb-2 flex-shrink-0" size={24} />
                      <span className="text-xs font-black uppercase tracking-[0.2em] text-primary drop-shadow-md text-center shadow-black">Update Spotlight Video</span>
                    </div>
                    
                    <input 
                      type="text"
                      value={settings.youtube_url || ''}
                      onChange={(e) => handleInlineEdit('youtube_url', e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      placeholder="Paste YouTube URL Here..."
                      className="w-[90%] bg-black/50 border border-white/20 rounded-xl py-2 px-4 text-white text-[10px] font-bold text-center outline-none focus:border-primary focus:ring-1 focus:ring-primary pointer-events-auto backdrop-blur-2xl transition-all"
                    />
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                 <a 
                   href={editMode ? undefined : "/article/global-esports-tournament-announced"}
                   className={`block transition-all ${!editMode ? 'hover:text-primary group-hover:translate-x-1' : ''}`}
                 >
                   <h4 
                     contentEditable={editMode}
                     onBlur={(e) => handleInlineEdit('spotlight_title', e.target.innerText)}
                     suppressContentEditableWarning={true}
                     className={`text-xl font-black italic uppercase leading-none tracking-tight outline-none transition-colors ${editMode ? 'bg-primary/5 rounded-xl p-3 ring-1 ring-primary/20 text-white block' : 'text-white'}`}
                   >
                     {settings.spotlight_title || 'Global eSports Tournament Announced'}
                   </h4>
                 </a>
                 <p 
                   contentEditable={editMode}
                   onBlur={(e) => handleInlineEdit('spotlight_desc', e.target.innerText)}
                   suppressContentEditableWarning={true}
                   className={`text-sm leading-relaxed outline-none transition-colors ${editMode ? 'bg-primary/5 rounded-xl p-3 ring-1 ring-primary/20 text-text-secondary block' : 'text-text-secondary opacity-60'}`}
                 >
                   {settings.spotlight_desc || 'Get ready for the biggest event in our history. The Big Games World Championship kicks off this Summer with a $1M prize pool.'}
                 </p>
                 <a 
                   href="/article/global-esports-tournament-announced"
                   className="block w-full py-4 border-t border-white/5 text-[10px] font-black uppercase tracking-[0.3em] text-text-secondary hover:text-primary transition-colors text-center"
                 >
                   Access Intelligence Feed
                 </a>
              </div>
           </div>
        </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
