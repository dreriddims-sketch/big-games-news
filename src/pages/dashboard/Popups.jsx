/* src/pages/dashboard/Popups.jsx */
import React, { useState } from 'react';
import { Bell, Clock, Settings, Save, Sparkles, MessageSquare } from 'lucide-react';
import { mockDB, saveToMockSettings } from '../../lib/supabase';

const Popups = () => {
  const [settings, setSettings] = useState(mockDB.settings);

  const handleSave = () => {
    saveToMockSettings(settings);
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
           <h2 className="text-3xl font-black uppercase tracking-tighter italic">Engagement Controls</h2>
           <p className="text-base text-text-secondary font-medium">Manage how the Terminal interacts with new recruits and visitors.</p>
        </div>
        <button onClick={handleSave} className="btn-primary py-4 uppercase font-black text-xs tracking-widest shadow-2xl">
          Deploy Engagement Strategy
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-12 xl:col-span-8 premium-card p-12 space-y-10 border-white/5 bg-white/5 backdrop-blur-3xl overflow-hidden relative">
           <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <Sparkles size={200} className="text-primary rotate-12" />
           </div>

           <div className="space-y-8 relative z-10">
              <div className="flex items-center gap-4 pb-4 border-b border-white/5">
                 <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-500">
                    <MessageSquare size={24} />
                 </div>
                 <h3 className="text-xl font-black uppercase tracking-tight italic">Newsletter Capture Message</h3>
              </div>
              
              <div className="space-y-8">
                <div className="space-y-2">
                   <label className="text-[10px] text-text-secondary uppercase font-black tracking-widest pl-1">Transmission Text (Popup Message)</label>
                   <textarea 
                     value={settings.popup_text}
                     onChange={(e) => setSettings({...settings, popup_text: e.target.value})}
                     rows="4"
                     placeholder="The transmission shown to new visitors..."
                     className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white outline-none focus:border-amber-500 transition-all text-2xl font-black italic tracking-tighter leading-tight"
                   />
                </div>
              </div>
           </div>
        </div>

        <div className="lg:col-span-12 xl:col-span-4 premium-card p-8 border-white/5 space-y-8">
           <div className="flex items-center gap-4 border-b border-white/5 pb-4">
              <Clock size={20} className="text-primary" />
              <h3 className="text-lg font-black uppercase italic">Timing Engine</h3>
           </div>
           
           <div className="space-y-6">
              <div className="space-y-4">
                 <p className="text-[10px] text-text-secondary uppercase font-black tracking-widest pl-1">Display Delay (Milliseconds)</p>
                 <div className="flex items-center gap-4">
                    <input 
                      type="range" 
                      min="1000" 
                      max="60000" 
                      step="1000"
                      value={settings.popup_frequency}
                      onChange={(e) => setSettings({...settings, popup_frequency: parseInt(e.target.value)})}
                      className="flex-1 accent-primary h-2 rounded-full bg-white/5 transition-all"
                    />
                    <span className="text-2xl font-black text-white italic">{settings.popup_frequency / 1000}s</span>
                 </div>
              </div>

              <div className="pt-8 space-y-4">
                 <div className="flex items-center justify-between p-5 glass rounded-2xl border-white/10 group hover:border-primary/20 transition-all">
                    <span className="text-sm font-bold uppercase text-text-secondary">Smart Exit Intent</span>
                    <div className="w-12 h-6 bg-emerald-500 rounded-full relative">
                       <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-black shadow-lg" />
                    </div>
                 </div>
                 <div className="flex items-center justify-between p-5 glass rounded-2xl border-white/10 group hover:border-primary/20 transition-all">
                    <span className="text-sm font-bold uppercase text-text-secondary">Persistent Re-prompt</span>
                    <div className="w-12 h-6 bg-white/5 rounded-full relative">
                       <div className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white/20" />
                    </div>
                 </div>
              </div>
           </div>

           <div className="pt-8 border-t border-white/5 text-center">
              <p className="text-[10px] text-text-secondary/50 font-bold uppercase tracking-widest leading-relaxed">
                Recruits are tracked via Session Transmissions. Clearing cache will reset popup timers.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Popups;
