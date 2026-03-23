/* src/components/AdPost.jsx */
import React, { useEffect } from 'react';

const AdPost = ({ slot = "default" }) => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error('AdSense error:', e);
    }
  }, []);

  return (
    <div className="h-full w-full snap-start relative bg-black flex flex-col items-center justify-center overflow-hidden p-8 pb-32">
      {/* Premium Ad Container */}
      <div className="w-full max-w-xl aspect-[9/16] md:aspect-video rounded-3xl bg-white/5 border border-white/10 overflow-hidden flex flex-col justify-between p-6 md:p-12 relative">
        <div className="absolute top-8 left-8 flex items-center gap-3">
            <span className="px-3 py-1 bg-white/10 text-white/40 text-[8px] font-black uppercase tracking-widest rounded-full border border-white/5">
                SPONSORED_CONTENT
            </span>
        </div>

        <div className="flex-1 flex items-center justify-center w-full py-12">
            <ins className="adsbygoogle"
                 style={{ display: 'block', width: '100%', height: '100%' }}
                 data-ad-client="ca-pub-7387486657216825"
                 data-ad-slot={slot !== "default" ? slot : "1234567890"} // Placeholder slot if not provided
                 data-ad-format="auto"
                 data-full-width-responsive="true"></ins>
        </div>

        <div className="space-y-4">
            <h2 className="text-3xl md:text-5xl font-black uppercase italic text-white/90 leading-none tracking-tighter">
                Discover_More
            </h2>
            <p className="text-text-secondary text-sm md:text-base font-medium opacity-60 italic">
                Support the Big Games Network by engaging with our verified partners.
            </p>
        </div>

        {/* Decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none" />
      </div>
      
      {/* Background Ambience */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(255,153,0,0.05)_0%,transparent_100%)] animate-pulse" />
    </div>
  );
};

export default AdPost;
