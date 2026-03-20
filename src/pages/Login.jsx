/* src/pages/Login.jsx */
import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, ShieldCheck, ArrowLeft, Key } from 'lucide-react';

const Login = () => {
  const { pinVerified, isAdmin, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  if (!pinVerified) return <Navigate to="/login/pin" replace />;
  if (isAdmin) return <Navigate to="/dashboard" replace />;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (login(email, password)) {
      navigate('/dashboard');
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-[radial-gradient(circle_at_center,_#0a0e14_0%,_#000000_100%)]">
      <div className="max-w-md w-full premium-card space-y-8 animate-in fade-in duration-700">
        <button 
          onClick={() => navigate('/login/pin')}
          className="flex items-center gap-2 text-text-secondary hover:text-white transition-colors text-sm"
        >
          <ArrowLeft size={16} /> Back to PIN
        </button>

        <div className="text-center space-y-4">
          <div className="inline-flex p-4 rounded-full bg-emerald-500/10 text-emerald-500 mb-2">
            <ShieldCheck size={40} />
          </div>
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Big Games News Admin</h1>
          <p className="text-text-secondary text-base">Stage 2: Master Administrator Verification</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-text-secondary ml-1">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors" size={20} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="dreriddims@gmail.com"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-base"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-text-secondary ml-1">Master Password</label>
            <div className="relative group">
              <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors" size={20} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Admin-exclusive password"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-base"
                required
              />
            </div>
          </div>

          {error && (
            <div className="text-red-400 bg-red-500/10 p-3 rounded-lg text-sm text-center font-medium border border-red-500/20">
              {error}
            </div>
          )}

          <button type="submit" className="btn-primary w-full py-4 text-base tracking-wide mt-4 uppercase font-black">
            Secure Entry
          </button>
        </form>

        <div className="text-center pt-4">
          <p className="text-text-secondary text-xs uppercase tracking-widest opacity-50">
            Internal Security Protocol V2.1
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
