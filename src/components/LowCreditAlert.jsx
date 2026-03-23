/* src/components/LowCreditAlert.jsx */
import React from 'react';
import { Zap, X, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const CREDIT_PACKS = [
  { name: 'Starter', credits: 150, price: '$1.99', link: 'https://buy.stripe.com/8x28wJ1nXejA6VTcUie7m00', highlight: false },
  { name: 'Power Pack', credits: 500, price: '$4.99', link: 'https://buy.stripe.com/8x28wJ1nXejA6VTcUie7m00', highlight: true },
  { name: 'Elite Bundle', credits: 1500, price: '$9.99', link: 'https://buy.stripe.com/8x28wJ1nXejA6VTcUie7m00', highlight: false },
];

const LowCreditAlert = () => {
  const { showLowCreditAlert, dismissLowCreditAlert, currentCredits } = useAuth();

  if (!showLowCreditAlert) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-[#0a0a0c] rounded-[2rem] border border-primary/30 shadow-[0_0_80px_rgba(255,153,0,0.2)] p-8 space-y-6">
        <button
          onClick={dismissLowCreditAlert}
          className="absolute top-5 right-5 p-2 text-white/30 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
            <Zap size={32} className="text-primary animate-pulse" />
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tighter italic text-white">
            Credits Running Low
          </h2>
          <p className="text-white/50 text-sm font-medium">
            You have <span className="text-primary font-black">{currentCredits} credits</span> remaining.
            Reload to keep gifting and boosting.
          </p>
        </div>

        {/* Credit Packs */}
        <div className="grid grid-cols-3 gap-3">
          {CREDIT_PACKS.map(pack => (
            <a
              key={pack.name}
              href={pack.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all hover:scale-105 ${
                pack.highlight
                  ? 'bg-primary/10 border-primary/40 shadow-lg shadow-primary/10'
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
            >
              <Zap size={18} className={pack.highlight ? 'text-primary' : 'text-white/40'} />
              <div className="text-center">
                <p className={`text-[10px] font-black uppercase tracking-widest ${pack.highlight ? 'text-primary' : 'text-white/50'}`}>
                  {pack.name}
                </p>
                <p className="text-lg font-black text-white">{pack.credits} CR</p>
                <p className="text-[10px] text-white/40 font-bold">{pack.price}</p>
              </div>
              {pack.highlight && (
                <span className="text-[8px] font-black uppercase tracking-widest bg-primary text-black px-2 py-0.5 rounded-full">
                  Best Value
                </span>
              )}
            </a>
          ))}
        </div>

        <button
          onClick={dismissLowCreditAlert}
          className="w-full py-3 border border-white/10 text-white/40 hover:text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-colors"
        >
          Continue with {currentCredits} Credits
        </button>
      </div>
    </div>
  );
};

export default LowCreditAlert;
