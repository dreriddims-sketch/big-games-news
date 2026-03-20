/* src/pages/dashboard/Stats.jsx */
import React from 'react';
import { TrendingUp, Users, Eye, Mail, ArrowUpRight, ArrowDownRight, Globe, Target, BarChart3 } from 'lucide-react';

const StatCard = ({ label, value, trend, icon: Icon, color }) => (
  <div className="premium-card p-6 space-y-6 group hover:translate-y-0 hover:scale-[1.02] cursor-default border-white/5 bg-white/5 backdrop-blur-3xl">
    <div className="flex items-center justify-between">
      <div className={`p-3 rounded-2xl ${color} bg-opacity-20`}>
        <Icon size={24} className={color.replace('bg-', 'text-')} />
      </div>
      {trend > 0 ? (
        <span className="flex items-center gap-1 text-emerald-500 font-bold text-xs uppercase tracking-widest leading-none">
          <ArrowUpRight size={14} /> {trend}%
        </span>
      ) : (
        <span className="flex items-center gap-1 text-red-500 font-bold text-xs uppercase tracking-widest leading-none">
          <ArrowDownRight size={14} /> {Math.abs(trend)}%
        </span>
      )}
    </div>
    <div className="space-y-1">
      <p className="text-[10px] text-text-secondary uppercase font-black tracking-[0.2em]">{label}</p>
      <h3 className="text-4xl font-black text-white">{value}</h3>
    </div>
  </div>
);

const Stats = () => {
  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Views" value="842.5K" trend={12.5} icon={Eye} color="bg-primary" />
        <StatCard label="Unique Visitors" value="124.2K" trend={8.3} icon={Users} color="bg-blue-500" />
        <StatCard label="Newsletter Signups" value="8.4K" trend={18.1} icon={Mail} color="bg-emerald-500" />
        <StatCard label="Conversion Rate" value="6.4%" trend={-2.4} icon={Target} color="bg-purple-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
         <div className="lg:col-span-8 premium-card p-8 border-white/5 space-y-8 min-h-[400px]">
            <div className="flex items-center justify-between">
               <h3 className="text-xl font-black uppercase flex items-center gap-2">
                 <Globe size={24} className="text-primary" /> Global Growth Traffic
               </h3>
               <div className="flex gap-2">
                  <div className="px-3 py-1.5 glass rounded-lg text-[10px] font-black uppercase text-text-secondary cursor-pointer hover:text-white transition-colors">7 Days</div>
                  <div className="px-3 py-1.5 bg-primary text-black rounded-lg text-[10px] font-black uppercase">30 Days</div>
               </div>
            </div>
            <div className="flex-1 flex items-center justify-center border-2 border-dashed border-white/5 rounded-3xl min-h-[300px]">
               <div className="text-center space-y-2 opacity-30">
                  <BarChart3 size={48} className="mx-auto" />
                  <p className="text-sm font-black uppercase tracking-widest">Real-time Waveform Incoming</p>
               </div>
            </div>
         </div>

         <div className="lg:col-span-4 premium-card p-8 border-white/5 space-y-8">
            <h3 className="text-xl font-black uppercase">Recent Transmissions</h3>
            <div className="space-y-6">
               {[1,2,3,4].map((i) => (
                 <div key={i} className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-black text-xs group-hover:bg-primary/20 group-hover:text-primary transition-all">
                       0{i}
                    </div>
                    <div className="flex-1 space-y-1">
                       <p className="text-sm font-black text-white uppercase italic truncate">New user signed up from NYC</p>
                       <p className="text-[10px] text-text-secondary font-bold uppercase tracking-widest opacity-50">Just now</p>
                    </div>
                 </div>
               ))}
            </div>
            <button className="w-full btn-secondary py-3 text-xs uppercase font-black mt-4">Generate Log Audit</button>
         </div>
      </div>
    </div>
  );
};

export default Stats;
