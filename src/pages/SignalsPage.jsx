/* src/pages/SignalsPage.jsx */
import React from 'react';
import { PlayCircle, Globe, Terminal, Network, Shield, MessageSquare, Zap } from 'lucide-react';

const SignalsPage = () => {
  return (
    <div className="min-h-screen bg-background text-white font-sans selection:bg-primary selection:text-black pb-40">
      <header className="max-w-7xl mx-auto px-6 pt-40 pb-20 border-b border-white/5 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
           <div className="space-y-6">
              <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full glass border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.4em]">
                 <Zap size={14} className="animate-pulse" />
                 Active Network Activity // REAL-TIME
              </div>
              <h1 className="text-7xl md:text-9xl font-black uppercase italic tracking-tighter leading-none">
                 Signals_Hub
              </h1>
              <p className="text-text-secondary text-xl max-w-2xl font-medium leading-relaxed">
                 Real-time telemetry and community node communication signals from the Big Games global infrastructure.
              </p>
           </div>
           
           <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between text-[10px] uppercase font-black tracking-widest text-white/40">
                 <span>Latency</span>
                 <span className="text-primary italic">24ms // FAST</span>
              </div>
              <div className="flex items-center justify-between text-[10px] uppercase font-black tracking-widest text-white/40 gap-12">
                 <span>Node Connectivity</span>
                 <span className="text-primary italic">99.8% // OPTIMAL</span>
              </div>
           </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-32 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {/* Signal Cards */}
        {[
           { icon:Globe, title: 'Global Node Trace', desc: 'Real-time geography of active players across the network.', color: 'blue' },
           { icon:Shield, title: 'Security Protocol', desc: 'Latest encryptions and server status logs from the core developer team.', color: 'green' },
           { icon:MessageSquare, title: 'Community Pulse', desc: 'Live community feedback signals and trending developer topics.', color: 'primary' },
           { icon:Network, title: 'Satellite Uplink', desc: 'Connectivity status of remote servers across all regions.', color: 'yellow' },
           { icon:Terminal, title: 'Telemetry Data', desc: 'Raw system logs from the future of gaming engine nodes.', color: 'cyan' },
           { icon:Zap, title: 'Speed Test', desc: 'Network speed and performance logs for the Big Games Global Grid.', color: 'orange' },
        ].map((signal, i) => (
           <div key={i} className="premium-card p-12 bg-white/5 border-white/10 rounded-3xl space-y-8 group hover:-translate-y-4 transition-transform duration-700 glass-panel">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-primary/40 group-hover:text-primary transition-all duration-700">
                 <signal.icon size={28} />
              </div>
              <div className="space-y-4">
                 <h3 className="text-2xl font-black italic uppercase tracking-tight">{signal.title}</h3>
                 <p className="text-text-secondary font-medium leading-relaxed opacity-60 group-hover:opacity-100 transition-opacity">
                    {signal.desc}
                 </p>
              </div>
              <button className="w-full py-6 border-t border-white/5 text-[10px] font-black uppercase tracking-[0.4em] text-white/20 group-hover:text-primary transition-all">
                 VERIFY_SIGNAL_0x{i+1}
              </button>
           </div>
        ))}

        {/* Big CTA */}
        <div className="md:col-span-2 lg:col-span-3 mt-12 premium-card p-12 md:p-24 bg-primary/20 border-primary/40 flex flex-col md:flex-row items-center justify-between gap-12 rounded-[50px] relative overflow-hidden group">
           <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity bg-grid" />
           <div className="space-y-6 relative z-10 text-center md:text-left">
              <h2 className="text-4xl md:text-7xl font-black uppercase italic tracking-tighter leading-none text-white">
                 JOIN THE_SIGNALS <br /> <span className="text-primary">CORE NETWORK</span>
              </h2>
              <p className="text-lg md:text-xl font-medium text-white/60 max-w-xl">
                 Apply for core contributor access and become part of the Big Games developer signals program.
              </p>
           </div>
           
           <button className="px-16 py-8 bg-primary text-black text-xl font-black italic uppercase tracking-tighter rounded-full hover:scale-110 transition-transform active:scale-95 shadow-2xl shadow-primary/40 relative z-10">
              UPLINK_NOW
           </button>
        </div>
      </main>
    </div>
  );
};

export default SignalsPage;
