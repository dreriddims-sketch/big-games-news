import { Play, Disc, ChevronRight, Mic } from 'lucide-react';
import { mockDB } from '../lib/supabase';

const PodcastGrid = () => {
  return (
    <div id="podcasts" className="pt-24 pb-12 px-6 max-w-7xl mx-auto space-y-12">
      <div className="flex items-center justify-between border-b border-white/5 pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-xs">
            <Mic size={16} /> Latest Audio
          </div>
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">Big Games Podcasts</h2>
        </div>
        <button className="btn-secondary group">
          Browse Library <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-8">
        {mockDB.podcasts.map((podcast, i) => (
          <div key={podcast.id} className="relative group animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: `${i * 100}ms` }}>
            <div className="aspect-square rounded-3xl overflow-hidden glass border-white/10 group-hover:border-primary/40 transition-colors p-4 flex flex-col items-center justify-center text-center gap-6 group-hover:shadow-[0_0_30px_rgba(245,158,11,0.1)]">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <Play size={32} className="text-primary group-hover:fill-primary" />
                </div>
                <div className="absolute -bottom-2 -right-2 p-2 bg-black/80 rounded-full border border-white/10 group-hover:rotate-45 transition-transform">
                  <Disc size={16} className="text-primary animate-spin-slow" />
                </div>
              </div>
              
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white uppercase tracking-tighter group-hover:text-primary transition-colors">
                  {podcast.title}
                </h3>
                <p className="text-[10px] text-text-secondary uppercase font-bold tracking-widest opacity-60">
                   Big Games Original
                </p>
              </div>
            </div>
            
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-5 transition-opacity rounded-3xl pointer-events-none" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PodcastGrid;
