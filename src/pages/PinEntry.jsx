/* src/pages/PinEntry.jsx */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Smartphone, ChevronRight } from 'lucide-react';

const PinEntry = () => {
  const [pin, setPin] = useState(['', '', '', '']);
  const [error, setError] = useState(false);
  const { verifyPin } = useAuth();
  const navigate = useNavigate();

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    
    const newPin = [...pin];
    newPin[index] = value.slice(-1);
    setPin(newPin);

    // Auto-focus next
    if (value && index < 3) {
      document.getElementById(`pin-${index + 1}`).focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const pinStr = pin.join('');
    if (verifyPin(pinStr)) {
      navigate('/login');
    } else {
      setError(true);
      setPin(['', '', '', '']);
      document.getElementById('pin-0').focus();
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-[radial-gradient(circle_at_center,_var(--bg-darker)_0%,_var(--bg-deep)_100%)]">
      <div className="premium-card max-w-sm w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="text-center space-y-2">
          <div className="inline-flex p-4 rounded-full bg-primary/10 text-primary mb-4">
            <Lock size={32} />
          </div>
          <h1 className="text-3xl font-black">Secure Terminal</h1>
          <p className="text-text-secondary text-sm">Enter Stage 1 Access Code</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center gap-4">
            {pin.map((digit, i) => (
              <input
                key={i}
                id={`pin-${i}`}
                type="password"
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                className={`w-14 h-16 text-center text-2xl font-bold rounded-xl glass border-2 transition-all outline-none ${
                  error ? 'border-red-500 animate-shake' : 'focus:border-primary border-white/10'
                }`}
                maxLength={1}
                required
              />
            ))}
          </div>

          {error && <p className="text-red-500 text-center text-sm font-medium">Invalid Access Code</p>}

          <button type="submit" className="btn-primary w-full py-4 justify-center">
            Continue Stage 2 <ChevronRight size={20} />
          </button>
        </form>

        <p className="text-center text-xs text-text-secondary">
          Restricted access. Unauthorized entry attempts are logged.
        </p>
      </div>
    </div>
  );
};

export default PinEntry;
