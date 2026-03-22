import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Key, UserPlus, AlertCircle } from 'lucide-react';

const SignUp = () => {
  const { signupUser, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isOver18, setIsOver18] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  if (user) {
    navigate('/social');
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isOver18) {
      setError('You must be 18+ to register.');
      return;
    }
    const res = signupUser(email, password, isOver18);
    if (res.success) {
      navigate('/social');
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center py-20 px-6 max-w-7xl mx-auto space-y-20 relative z-10">
      <div className="max-w-md w-full premium-card space-y-8 p-10 mt-10">
        <div className="text-center space-y-4">
          <div className="inline-flex p-4 rounded-full bg-primary/10 text-primary mb-2">
            <UserPlus size={40} />
          </div>
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter italic">Join The Network</h1>
          <p className="text-text-secondary text-base">Create your account to access the social feed.</p>
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
                placeholder="citizen@network.com"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-primary transition-all font-bold"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-text-secondary ml-1">Password</label>
            <div className="relative group">
              <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors" size={20} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Secure Password"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-primary transition-all font-bold"
                required
              />
            </div>
          </div>

          <label className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
            <input 
              type="checkbox" 
              checked={isOver18}
              onChange={(e) => setIsOver18(e.target.checked)}
              className="mt-1 w-5 h-5 accent-primary bg-black/50 border-white/20 rounded cursor-pointer"
            />
            <div className="flex flex-col gap-1">
              <span className="text-sm font-black text-white uppercase tracking-tight">I am 18 years or older</span>
              <span className="text-xs text-text-secondary">By checking this box, you confirm your age and agree to our transmission protocols and terms of service.</span>
            </div>
          </label>

          {error && (
            <div className="flex gap-3 text-red-400 bg-red-500/10 p-4 rounded-2xl text-sm font-medium border border-red-500/20">
              <AlertCircle size={20} className="flex-shrink-0" />
              {error}
            </div>
          )}

          <button type="submit" className="btn-primary w-full py-5 text-lg tracking-widest mt-4 uppercase font-black">
            Register Network Identity
          </button>
        </form>

        <div className="text-center pt-8 border-t border-white/5">
          <p className="text-text-secondary text-sm">
            Already registered? <Link to="/signin" className="text-primary font-black uppercase tracking-wider hover:underline hover:text-white transition-colors">Login Here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
