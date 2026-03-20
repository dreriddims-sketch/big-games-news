/* src/pages/FeedPage.jsx */
import React from 'react';
import ArticleFeed from '../components/ArticleFeed';
import { Network, Zap, Play } from 'lucide-react';

const FeedPage = () => {
  return (
    <div className="min-h-screen bg-background text-white font-sans selection:bg-primary selection:text-black">
      <header className="max-w-7xl mx-auto px-6 pt-40 pb-20 border-b border-white/5 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
           <div className="space-y-6">
              <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full glass border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.4em]">
                 <Network size={14} className="animate-pulse" />
                 Transmission Feed // LIVE_STREAM
              </div>
              <h1 className="text-7xl md:text-9xl font-black uppercase italic tracking-tighter leading-none">
                 The_Feed
              </h1>
              <p className="text-text-secondary text-xl font-medium max-w-2xl leading-relaxed">
                 The latest unfiltered intelligence, transmissions, and developer news from across the Big Games Network.
              </p>
           </div>
           
           <div className="flex items-center gap-8">
              {['LATEST', 'POPULAR', 'ARCHIVED'].map(filter => (
                 <button key={filter} className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 hover:text-white transition-all">
                    {filter}_SORT
                 </button>
              ))}
           </div>
        </div>
      </header>

      <main className="py-24">
        <ArticleFeed />
      </main>

      <div className="max-w-7xl mx-auto px-6 py-40 border-t border-white/5 text-center space-y-12">
         <h2 className="text-4xl md:text-7xl font-black italic uppercase italic tracking-tighter leading-none text-white">
            END_OF <span className="text-primary italic">NEWS_TERMINAL</span>
         </h2>
         <p className="text-xl text-white/40 font-medium max-w-2xl mx-auto">
            Stay tuned for the next phase of transmissions. The network never sleeps.
         </p>
         <button className="px-16 py-8 glass rounded-full text-xl font-black italic uppercase tracking-tighter hover:bg-primary/20 transition-all border-none">
            RELOAD_TERMINAL
         </button>
      </div>
    </div>
  );
};

export default FeedPage;
