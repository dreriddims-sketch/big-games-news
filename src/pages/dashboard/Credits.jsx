/* src/pages/dashboard/Credits.jsx - Admin Credit Control Panel */
import React, { useState, useEffect } from 'react';
import { Zap, TrendingUp, Plus, Minus, Search, DollarSign, Users, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const CREDIT_PACKS = [
  { name: 'Starter Pack', credits: 150, price: 1.99, stripe: 'https://buy.stripe.com/8x28wJ1nXejA6VTcUie7m00' },
  { name: 'Power Pack', credits: 500, price: 4.99, stripe: 'https://buy.stripe.com/8x28wJ1nXejA6VTcUie7m00' },
  { name: 'Elite Bundle', credits: 1500, price: 9.99, stripe: 'https://buy.stripe.com/8x28wJ1nXejA6VTcUie7m00' },
];

const Credits = () => {
  const { getAllUsers, setUserCreditsAdmin, addCredits } = useAuth();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [grantAmount, setGrantAmount] = useState(150);
  const [selectedUser, setSelectedUser] = useState(null);
  const [tab, setTab] = useState('users');
  const [toast, setToast] = useState('');

  // Mock revenue data (in real app this comes from Stripe webhook events)
  const [revenueLog] = useState([
    { id: 'pi_001', user: 'info_p2sr', pack: 'Power Pack', credits: 500, amount: '$4.99', date: '2026-03-22' },
    { id: 'pi_002', user: 'gamer_x', pack: 'Starter Pack', credits: 150, amount: '$1.99', date: '2026-03-21' },
    { id: 'pi_003', user: 'node_pilot', pack: 'Elite Bundle', credits: 1500, amount: '$9.99', date: '2026-03-20' },
  ]);

  const refreshUsers = () => {
    setUsers(getAllUsers());
  };

  useEffect(() => {
    refreshUsers();
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleGrant = (userId) => {
    addCredits(grantAmount, userId);
    refreshUsers();
    showToast(`✓ ${grantAmount} credits granted`);
    setSelectedUser(null);
  };

  const handleSetCredits = (userId, amount) => {
    setUserCreditsAdmin(userId, Math.max(0, amount));
    refreshUsers();
    showToast('✓ Credits updated');
  };

  const filteredUsers = users.filter(u =>
    u.username?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const totalCreditsIssued = users.reduce((sum, u) => sum + (u.credits || 0), 0);
  const totalRevenue = revenueLog.reduce((sum, r) => sum + parseFloat(r.amount.replace('$', '')), 0);

  return (
    <div className="space-y-8">
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 px-6 py-3 bg-emerald-500 text-black font-black text-xs uppercase tracking-widest rounded-full shadow-xl animate-in slide-in-from-top-2">
          {toast}
        </div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="premium-card p-6 bg-primary/5 border border-primary/20 space-y-2">
          <div className="flex items-center gap-3">
            <Zap size={20} className="text-primary" />
            <p className="text-[10px] font-black uppercase tracking-widest text-white/50">Total Credits In Circulation</p>
          </div>
          <p className="text-4xl font-black text-white">{totalCreditsIssued.toLocaleString()}</p>
        </div>
        <div className="premium-card p-6 bg-white/5 space-y-2">
          <div className="flex items-center gap-3">
            <Users size={20} className="text-white/40" />
            <p className="text-[10px] font-black uppercase tracking-widest text-white/50">Total Users</p>
          </div>
          <p className="text-4xl font-black text-white">{users.length}</p>
        </div>
        <div className="premium-card p-6 bg-emerald-500/5 border border-emerald-500/20 space-y-2">
          <div className="flex items-center gap-3">
            <DollarSign size={20} className="text-emerald-400" />
            <p className="text-[10px] font-black uppercase tracking-widest text-white/50">Revenue This Month</p>
          </div>
          <p className="text-4xl font-black text-emerald-400">${totalRevenue.toFixed(2)}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-white/5">
        {['users', 'revenue', 'packs'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-6 py-3 font-black text-[11px] uppercase tracking-widest border-b-2 transition-all ${tab === t ? 'border-primary text-primary' : 'border-transparent text-white/30 hover:text-white'}`}
          >
            {t === 'users' ? 'User Credits' : t === 'revenue' ? 'Revenue' : 'Credit Packs'}
          </button>
        ))}
      </div>

      {/* Users Tab */}
      {tab === 'users' && (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={16} />
              <input
                type="text"
                placeholder="Search users..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white outline-none focus:border-primary transition-all font-bold text-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={grantAmount}
                onChange={e => setGrantAmount(Number(e.target.value))}
                className="w-24 bg-white/5 border border-white/10 rounded-xl p-3 text-white text-center font-black outline-none focus:border-primary"
                min="1"
              />
              <span className="text-[10px] text-white/30 font-black uppercase">CR</span>
            </div>
            <button
              onClick={() => { users.forEach(u => addCredits(grantAmount, u.id)); refreshUsers(); showToast(`✓ ${grantAmount} CR granted to all users`); }}
              className="px-6 py-3 bg-primary text-black font-black text-xs uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-all flex items-center gap-2"
            >
              <Zap size={14} /> Grant All
            </button>
            <button onClick={refreshUsers} className="p-3 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 transition-all">
              <RefreshCw size={16} />
            </button>
          </div>

          <div className="space-y-3">
            {filteredUsers.length === 0 ? (
              <div className="text-center py-12 text-white/20 font-black uppercase tracking-widest text-xs">No users found.</div>
            ) : filteredUsers.map(u => (
              <div key={u.id} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-all">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-black uppercase border border-primary/10">
                  {(u.username || u.email || 'U').charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-white text-sm truncate">@{u.username}</p>
                  <p className="text-[10px] text-white/30 truncate">{u.email}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-xl border border-primary/20">
                    <Zap size={12} className="text-primary" />
                    <span className="font-black text-primary text-sm">{u.credits} CR</span>
                  </div>
                  <button
                    onClick={() => handleSetCredits(u.id, u.credits - 50)}
                    className="p-2 bg-white/5 hover:bg-red-500/20 text-white hover:text-red-400 rounded-lg transition-all border border-white/10"
                    title="Remove 50 CR"
                  >
                    <Minus size={14} />
                  </button>
                  <button
                    onClick={() => handleGrant(u.id)}
                    className="p-2 bg-primary/10 hover:bg-primary text-primary hover:text-black rounded-lg transition-all border border-primary/20"
                    title={`Grant ${grantAmount} CR`}
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Revenue Tab */}
      {tab === 'revenue' && (
        <div className="space-y-4">
          <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-2xl text-xs text-amber-400 font-bold">
            ⚠ Connect your Stripe webhook to <code className="bg-black/40 px-2 py-0.5 rounded">/api/stripe-webhook</code> to automatically log purchases here.
          </div>
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-white/5">
                {['Transaction', 'User', 'Pack', 'Credits', 'Amount', 'Date'].map(h => (
                  <th key={h} className="py-3 px-4 text-[10px] font-black uppercase tracking-widest text-white/30">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {revenueLog.map(r => (
                <tr key={r.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4 text-[10px] text-white/30 font-mono">{r.id}</td>
                  <td className="py-3 px-4 font-black text-white text-sm">@{r.user}</td>
                  <td className="py-3 px-4 text-white/60 text-sm">{r.pack}</td>
                  <td className="py-3 px-4">
                    <span className="flex items-center gap-1 text-primary font-black text-sm">
                      <Zap size={12} /> {r.credits}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-emerald-400 font-black">{r.amount}</td>
                  <td className="py-3 px-4 text-white/30 text-xs">{r.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-end pt-4 border-t border-white/5">
            <div className="text-right space-y-1">
              <p className="text-[10px] text-white/30 uppercase font-black tracking-widest">Total Revenue</p>
              <p className="text-3xl font-black text-emerald-400">${totalRevenue.toFixed(2)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Packs Tab */}
      {tab === 'packs' && (
        <div className="space-y-6">
          <p className="text-white/40 text-sm font-medium">These are your active Stripe payment links. Users buy credits directly via Stripe.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CREDIT_PACKS.map(pack => (
              <div key={pack.name} className="premium-card p-6 bg-white/5 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary/10 rounded-xl"><Zap size={20} className="text-primary" /></div>
                  <div>
                    <h3 className="font-black text-white text-lg">{pack.name}</h3>
                    <p className="text-[10px] text-primary font-black uppercase tracking-widest">{pack.credits} Credits</p>
                  </div>
                </div>
                <p className="text-4xl font-black text-white">${pack.price}</p>
                <a
                  href={pack.stripe}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-primary text-black font-black text-xs uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-all"
                >
                  <TrendingUp size={14} /> View Stripe Link
                </a>
                <p className="text-[9px] text-white/20 font-mono break-all">{pack.stripe}</p>
              </div>
            ))}
          </div>
          <div className="p-6 bg-white/5 border border-white/10 rounded-2xl space-y-3">
            <h4 className="font-black text-white uppercase tracking-widest text-sm flex items-center gap-2">
              <DollarSign size={16} className="text-primary" /> Replace with Your Own Stripe Links
            </h4>
            <p className="text-white/40 text-xs leading-relaxed">
              Go to your Stripe Dashboard → Products → Create 3 products (150 CR, 500 CR, 1500 CR).
              Copy the Payment Links and replace the <code className="bg-black/40 px-1 rounded">stripe</code> URLs in <code className="bg-black/40 px-1 rounded">src/pages/dashboard/Credits.jsx</code>.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Credits;
