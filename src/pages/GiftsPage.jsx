/* src/pages/GiftsPage.jsx */
import React from 'react';
import { motion } from 'framer-motion';
import { Gift, Zap, Star, Shield, Layout, Play, X, Heart, Gem, ArrowRight, CreditCard, Sparkles, Trophy, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const GIFT_TIERS = [
  {
    id: 'starter',
    name: 'Starter Node',
    credits: 750,
    price: '$4.99',
    bonus: '+10% Extra Bandwidth',
    color: 'from-blue-600/30 to-blue-400/10',
    borderColor: 'border-blue-500/40',
    glowColor: 'shadow-blue-500/20',
    icon: <Zap size={28} className="text-blue-400" />,
    features: ['Instant Feed Access', 'Global Node Badge', '10 Transmission Boosts', 'Community Chat Entry']
  },
  {
    id: 'elite',
    name: 'Elite Signal',
    credits: 2500,
    price: '$12.99',
    bonus: '+25% Priority Queue',
    color: 'from-primary/40 to-primary/5',
    borderColor: 'border-primary/60',
    glowColor: 'shadow-primary/30',
    featured: true,
    icon: <Trophy size={28} className="text-primary" />,
    features: ['Priority Stream Sync', 'Custom Name Protocol', '50 Transmission Boosts', 'Exclusive Gift Protocols', 'Ad-Free Intelligence']
  },
  {
    id: 'legendary',
    name: 'Legendary Core',
    credits: 8000,
    price: '$39.99',
    bonus: '+50% Developer Access',
    color: 'from-purple-600/30 to-purple-400/10',
    borderColor: 'border-purple-500/40',
    glowColor: 'shadow-purple-500/20',
    icon: <Crown size={28} className="text-purple-400" />,
    features: ['Alpha Node Clearance', 'Founder Encryption', 'Unlimited Stream Boosts', 'Direct Dev Link Sector', 'Legacy Archive Access']
  }
];

const GiftsPage = () => {
  const { currentCredits, user } = useAuth();

  return (
    <div className="min-h-screen bg-[#08080a] text-white selection:bg-primary/30 overflow-x-hidden">
      {/* Dynamic Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-5%] w-[50%] h-[50%] bg-primary/20 blur-[150px] rounded-full animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-purple-600/10 blur-[150px] rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,153,0,0.03)_0%,transparent_70%)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 lg:py-40">
        {/* Floating Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-12 mb-24">
          <div className="max-w-3xl space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full"
            >
              <Sparkles size={14} className="text-primary animate-spin-slow" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Global_Resource_Terminal</span>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.8 }}
              className="text-6xl lg:text-9xl font-black uppercase tracking-tighter italic leading-[0.8] mb-8"
            >
              Fuel the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-500 to-amber-300 drop-shadow-[0_0_30px_rgba(255,153,0,0.3)]">Network</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-white/50 text-xl font-medium leading-relaxed max-w-xl italic border-l-2 border-primary/30 pl-8"
            >
              Enhance your digital presence. Acquire credits to synchronize high-priority streams, reward elite contributors, and unlock exclusive clearance levels.
            </motion.p>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            className="relative group cursor-pointer"
          >
            <div className="absolute inset-0 bg-primary/20 blur-3xl group-hover:bg-primary/40 transition-all rounded-full" />
            <div className="relative bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10 flex flex-col items-center gap-4 shadow-2xl">
              <div className="p-5 bg-primary rounded-full text-black shadow-[0_0_30px_rgba(255,153,0,0.5)]">
                <Gift size={40} strokeWidth={2.5} />
              </div>
              <div className="text-center">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Current Sync Balance</p>
                <div className="flex items-center justify-center gap-3">
                   <p className="text-6xl font-black italic tracking-tighter">{currentCredits || 0}</p>
                   <span className="text-lg font-black text-primary leading-none mt-4 uppercase">CR</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tiers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {GIFT_TIERS.map((tier, idx) => (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 * idx, duration: 0.8, ease: "circOut" }}
              className="relative group h-full"
            >
              {tier.featured && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-20">
                  <div className="px-6 py-2 bg-primary text-black text-[10px] font-black uppercase tracking-widest rounded-full shadow-[0_0_30px_rgba(255,153,0,0.4)] border-4 border-[#08080a]">
                    Most Transmitted
                  </div>
                </div>
              )}
              
              <div className={`h-full bg-gradient-to-br ${tier.color} backdrop-blur-3xl rounded-[3.5rem] border ${tier.borderColor} p-12 flex flex-col items-start transition-all duration-500 hover:scale-[1.03] hover:shadow-[0_40px_100px_rgba(0,0,0,0.5)] relative overflow-hidden`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl rounded-full -translate-x-1/2 -translate-y-1/2" />
                
                <div className={`p-5 bg-black/60 rounded-3xl mb-10 shadow-xl border border-white/5 group-hover:scale-110 group-hover:border-white/20 transition-all duration-500`}>
                  {tier.icon}
                </div>
                
                <div className="mb-10 w-full">
                  <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-2 text-white/90">{tier.name}</h3>
                  <div className="flex items-end gap-2">
                    <span className="text-6xl font-black tracking-tighter italic">{tier.credits}</span>
                    <span className="text-lg font-black text-primary mb-2">CR</span>
                  </div>
                  <div className="mt-2 inline-block px-3 py-1 bg-white/5 border border-white/10 rounded-full">
                    <p className="text-[10px] font-black text-white/60 uppercase tracking-widest">{tier.bonus}</p>
                  </div>
                </div>

                <div className="flex-1 w-full space-y-5 mb-12">
                  {tier.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-4 text-[13px] font-medium text-white/50 group-hover:text-white/80 transition-colors">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_10px_rgba(255,153,0,0.8)]" />
                      {f}
                    </div>
                  ))}
                </div>

                <div className="w-full space-y-6">
                  <div className="flex items-center justify-between px-2">
                    <div className="flex flex-col">
                      <span className="text-[9px] uppercase font-black tracking-widest text-white/20">Protocol Cost</span>
                      <span className="text-2xl font-black text-white italic">{tier.price}</span>
                    </div>
                    <div className="h-10 w-px bg-white/10" />
                    <div className="flex flex-col items-end">
                      <span className="text-[9px] uppercase font-black tracking-widest text-white/20">Frequency</span>
                      <span className="text-[10px] font-black text-primary uppercase">One-Time Sync</span>
                    </div>
                  </div>
                  <button 
                    disabled={!user}
                    className={`w-full py-6 rounded-[2rem] flex items-center justify-center gap-3 font-black uppercase text-xs tracking-[0.2em] transition-all duration-500 shadow-xl ${tier.featured ? 'bg-primary text-black hover:bg-white hover:text-black shadow-primary/20' : 'bg-white/5 text-white hover:bg-white hover:text-black border border-white/10 hover:border-white'}`}
                  >
                    <CreditCard size={18} /> Initialize Secure Purchase
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Global Security Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="mt-32 p-16 rounded-[4rem] border border-white/5 bg-[radial-gradient(ellipse_at_top_right,rgba(255,153,0,0.05)_0%,transparent_60%)] relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-white/[0.02] backdrop-blur-3xl" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-64 h-64 bg-primary/10 blur-[100px] rounded-full group-hover:bg-primary/20 transition-all duration-1000" />
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-16">
            <div className="max-w-2xl space-y-6">
              <h2 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter italic leading-none">The Future of <br /><span className="text-primary truncate">Network Contribution</span></h2>
              <p className="text-white/40 text-lg font-medium leading-relaxed italic">
                All transactions are verified through the Signal_Core infrastructure. Every credit exchange directly powers the next generation of decentralized gaming intelligence.
              </p>
              <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-primary">
                <Shield size={20} className="animate-pulse" /> End-to-End Encryption Active
              </div>
            </div>
            
            <div className="flex flex-col gap-4 w-full lg:w-auto">
               <Link to="/foryou" className="px-12 py-6 bg-white text-black text-xs font-black uppercase tracking-widest rounded-[2rem] hover:bg-primary transition-all flex items-center justify-center gap-3 shadow-2xl group/btn">
                 Return to Primary Feed <ArrowRight size={18} className="group-hover/btn:translate-x-2 transition-transform" />
               </Link>
               <div className="flex items-center justify-center gap-6 pt-4 grayscale opacity-40">
                  <span className="text-[10px] font-black uppercase tracking-widest">VISA</span>
                  <span className="text-[10px] font-black uppercase tracking-widest">STRIPE</span>
                  <span className="text-[10px] font-black uppercase tracking-widest">G_PAY</span>
               </div>
            </div>
          </div>
        </motion.div>
        
        {/* Footer info */}
        <div className="mt-20 text-center space-y-4">
          <div className="h-px w-24 bg-white/10 mx-auto" />
          <p className="text-[10px] font-normal uppercase tracking-[0.5em] text-white/20">All resource tokens are property of Big Games Infrastructure Terminal</p>
        </div>
      </div>
    </div>
  );
};

export default GiftsPage;
