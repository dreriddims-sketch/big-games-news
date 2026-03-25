/* src/components/FloatingNav.jsx */
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Newspaper, Target, Plus, Gift, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import UploadModal from './UploadModal';

const FloatingNav = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [isUploadOpen, setIsUploadOpen] = useState(false);

    // Only show on mobile or for quick access, but visible globally as requested
    // Ensure we don't show on dashboard if it's too cluttered (can be added back if needed)
    if (location.pathname.startsWith('/dashboard')) return null;

    const navItemStyle = (path) => {
        const isActive = location.pathname === path;
        return `flex flex-col items-center gap-1 group py-2 px-3 rounded-2xl transition-all ${isActive ? 'text-primary' : 'text-white/40 hover:text-white'}`;
    };

    const handlePostClick = () => {
        if (!user) {
            navigate('/signup');
            return;
        }
        setIsUploadOpen(true);
    };

    return (
        <>
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] w-full max-w-sm px-4 pointer-events-none">
                <div className="glass rounded-[2.5rem] p-1.5 flex items-center justify-between shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 pointer-events-auto backdrop-blur-3xl bg-black/60 relative">
                    {/* VERSION SYNC BADGE */}
                    <div className="absolute top-0 right-8 px-2 py-0.5 bg-primary/30 text-primary text-[6px] font-black uppercase tracking-tighter rounded-b-md border border-t-0 border-primary/20">
                      v1.6 Active
                    </div>
                    
                    {/* NEWS */}
                    <Link to="/feed" className={navItemStyle('/feed')}>
                        <Newspaper size={18} />
                        <span className="text-[7px] font-black uppercase tracking-widest">News</span>
                    </Link>

                    {/* GIFTS */}
                    <Link to="/gifts" className={navItemStyle('/gifts')}>
                        <Gift size={18} />
                        <span className="text-[7px] font-black uppercase tracking-widest">Gifts</span>
                    </Link>

                    {/* POST BUTTON (CENTER) */}
                    <div className="relative -top-6 flex flex-col items-center">
                        <button 
                            onClick={handlePostClick}
                            className="w-14 h-14 rounded-full bg-primary text-black flex items-center justify-center shadow-[0_0_30px_rgba(255,153,0,0.6)] hover:shadow-[0_0_50px_rgba(255,153,0,0.9)] transform hover:scale-110 active:scale-95 transition-all duration-300 relative z-10 border-4 border-[#08080a]"
                        >
                            <Plus size={28} strokeWidth={4} />
                        </button>
                    </div>

                    {/* FEED */}
                    <Link to="/foryou" className={navItemStyle('/foryou')}>
                        <Target size={18} />
                        <span className="text-[7px] font-black uppercase tracking-widest">Feed</span>
                    </Link>

                    {/* PROFILE */}
                    <Link to="/profile" className={navItemStyle('/profile')}>
                        <User size={18} />
                        <span className="text-[7px] font-black uppercase tracking-widest">You</span>
                    </Link>
                </div>
            </div>

            {/* Global Upload Trigger */}
            {user && (
                <UploadModal 
                    isOpen={isUploadOpen} 
                    onClose={() => setIsUploadOpen(false)} 
                    user={user} 
                    onUploadSuccess={(newPost) => {
                        navigate('/foryou');
                    }}
                />
            )}
        </>
    );
};

export default FloatingNav;
