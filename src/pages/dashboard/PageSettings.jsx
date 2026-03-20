import React, { useState, useRef } from 'react';
import { Layout, Save, Globe, Smartphone, Play, Image, Upload, Check, Loader2 } from 'lucide-react';
import { mockDB, saveToMockSettings } from '../../lib/supabase';

const PageSettings = () => {
  const [settings, setSettings] = useState(mockDB.settings);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const logoFileRef = useRef(null);
  const bannerFileRef = useRef(null);

  const handleSave = () => {
    setIsSaving(true);
    saveToMockSettings(settings);
    
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1500);
  };

  const handleFileUpload = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSettings({ ...settings, [field]: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const getEmbedUrl = (url) => {
    if (!url) return '';
    if (url.includes('youtube.com/embed/')) return url;
    let videoId = '';
    try {
      if (url.includes('youtube.com/watch')) {
        videoId = new URL(url).searchParams.get('v');
      } else if (url.includes('youtu.be/')) {
        videoId = new URL(url).pathname.slice(1);
      }
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    } catch (e) {
      return url;
    }
  };

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
           <h2 className="text-3xl font-black uppercase tracking-tighter italic">Content Layout Editor</h2>
           <p className="text-base text-text-secondary font-medium pl-1">Modify the primary Hero and Spotlight assets across the platform.</p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={isSaving}
          className={`btn-primary py-4 px-12 uppercase font-black text-xs tracking-[0.2em] shadow-2xl transition-all flex items-center gap-4 ${
            showSuccess ? 'bg-emerald-500 text-white shadow-emerald-500/40' : ''
          }`}
        >
          {isSaving ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Broadcasting...
            </>
          ) : showSuccess ? (
            <>
              <Check size={18} />
              Transmission_Success
            </>
          ) : (
            <>
              <Save size={18} />
              Apply Live Changes
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="premium-card p-10 space-y-8 border-white/5 bg-white/5 backdrop-blur-3xl">
           <div className="flex items-center gap-4 pb-4 border-b border-white/5">
              <div className="p-3 rounded-2xl bg-primary/20 text-primary">
                 <Layout size={24} />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight italic">Main Hero Section</h3>
           </div>
           
           <div className="space-y-6">
              <div className="space-y-2">
                 <label className="text-[10px] text-text-secondary uppercase font-black tracking-widest pl-1">Hero Title Script</label>
                 <textarea 
                   value={settings.hero_text}
                   onChange={(e) => setSettings({...settings, hero_text: e.target.value})}
                   rows="3"
                   className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-primary transition-all text-xl font-black tracking-tight"
                 />
              </div>

              <div className="space-y-2">
                 <label className="text-[10px] text-text-secondary uppercase font-black tracking-widest pl-1">Hero Brand Logo</label>
                 <div className="flex gap-4">
                    <div className="relative group flex-1">
                       <button 
                         onClick={() => logoFileRef.current?.click()}
                         className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-primary transition-colors z-20"
                         title="Click to Upload Logo"
                       >
                         <Image size={20} />
                       </button>
                       <input 
                         type="text" 
                         value={settings.hero_logo}
                         onChange={(e) => setSettings({...settings, hero_logo: e.target.value})}
                         className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-primary transition-all text-xs font-bold"
                       />
                       <input type="file" ref={logoFileRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'hero_logo')} />
                    </div>
                    <label 
                      onClick={() => logoFileRef.current?.click()}
                      className="btn-secondary py-4 px-6 flex items-center gap-3 cursor-pointer hover:text-primary"
                    >
                       <Upload size={18} />
                       <span className="text-[10px] font-black uppercase">Upload</span>
                    </label>
                 </div>
              </div>

              <div className="space-y-2">
                 <label className="text-[10px] text-text-secondary uppercase font-black tracking-widest pl-1">Primary Banner Artwork</label>
                 <div className="flex gap-4">
                    <div className="relative group flex-1">
                       <button 
                          onClick={() => bannerFileRef.current?.click()}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-primary transition-colors z-20"
                          title="Click to Upload Artwork"
                       >
                          <Image size={20} />
                       </button>
                       <input 
                         type="text" 
                         value={settings.hero_banner}
                         onChange={(e) => setSettings({...settings, hero_banner: e.target.value})}
                         className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-primary transition-all text-xs font-bold"
                       />
                       <input type="file" ref={bannerFileRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'hero_banner')} />
                    </div>
                    <label 
                      onClick={() => bannerFileRef.current?.click()}
                      className="btn-secondary py-4 px-6 flex items-center gap-3 cursor-pointer hover:text-primary"
                    >
                       <Upload size={18} />
                       <span className="text-[10px] font-black uppercase">Upload</span>
                    </label>
                 </div>
              </div>
           </div>
        </div>

        <div className="premium-card p-10 space-y-8 border-white/5 bg-white/5 backdrop-blur-3xl">
           <div className="flex items-center gap-4 pb-4 border-b border-white/5">
              <div className="p-3 rounded-2xl bg-red-500/20 text-red-500">
                 <Play size={24} />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight italic">Spotlight Media (YouTube)</h3>
           </div>
           
           <div className="space-y-6">
              <div className="space-y-2">
                 <label className="text-[10px] text-text-secondary uppercase font-black tracking-widest pl-1">Embed Transmission URL</label>
                 <div className="relative group">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-red-500 transition-colors" size={20} />
                    <input 
                      type="text" 
                      value={settings.youtube_url}
                      onChange={(e) => setSettings({...settings, youtube_url: e.target.value})}
                      placeholder="https://www.youtube.com/embed/..."
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-red-500 transition-all text-xs font-bold"
                    />
                 </div>
              </div>
              <div className="p-6 rounded-3xl glass border-white/10 mt-6 bg-red-500/5 aspect-video overflow-hidden shadow-2xl">
                 <iframe 
                    src={getEmbedUrl(settings.youtube_url)} 
                    className="w-full h-full rounded-2xl transition-transform hover:scale-105 duration-700"
                    title="Preview"
                 ></iframe>
              </div>
           </div>
        </div>
      </div>
      
      <div className="premium-card p-12 text-center bg-emerald-500/5 animate-pulse border-emerald-500/20">
         <div className="space-y-2">
            <h4 className="text-2xl font-black text-emerald-400 uppercase italic tracking-tighter">Instant Update Mode Active</h4>
            <p className="text-sm text-emerald-500/60 font-bold">Changes saved here are broadcast to all visitors in real-time.</p>
         </div>
      </div>
    </div>
  );
};

export default PageSettings;
