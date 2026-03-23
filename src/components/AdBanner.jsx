/* src/components/AdBanner.jsx */
import React, { useEffect } from 'react';

const AdBanner = ({ slot = "1234567890", className = "" }) => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error('AdSense banner error:', e);
    }
  }, []);

  return (
    <div className={`w-full max-w-7xl mx-auto px-6 py-12 ${className}`}>
      <div className="glass rounded-[2rem] border-white/5 bg-white/5 p-8 flex flex-col items-center gap-6 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        
        <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20 italic">MISSION_FINANCED_DATA_STREAM</span>

        <div className="w-full min-h-[90px] flex items-center justify-center">
            <ins className="adsbygoogle"
                 style={{ display: 'block', width: '100%' }}
                 data-ad-client="ca-pub-7387486657216825"
                 data-ad-slot={slot}
                 data-ad-format="horizontal"
                 data-full-width-responsive="true"></ins>
        </div>

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,153,0,0.02)_0%,transparent_100%)] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      </div>
    </div>
  );
};

export default AdBanner;
