/* src/components/FloatingNav.jsx */
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Newspaper, Target, Plus, LogIn } from 'lucide-react';
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

    const navItems = [
        { label: 'News', path: '/', icon: Newspaper },
        { label: 'For You', path: '/foryou', icon: Target },
    ];

    const handlePostClick = () => {
        if (!user) {
            navigate('/signup');
            return;
        }
        setIsUploadOpen(true);
    };

    return (
        <>
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] w-full max-w-xs px-4 pointer-events-none">
                <div className="glass rounded-[2.5rem] p-2 flex items-center justify-around shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 pointer-events-auto backdrop-blur-3xl bg-black/40">
                    
                    {/* NEWS LINK */}
                    <Link 
                        to="/" 
                        className={`flex flex-col items-center gap-1 group py-2 px-4 rounded-3xl transition-all ${location.pathname === '/' || location.pathname === '/news' ? 'text-primary' : 'text-white/40 hover:text-white'}`}
                    >
                        <Newspaper size={20} className={location.pathname === '/' || location.pathname === '/news' ? 'text-primary' : ''} />
                        <span className="text-[8px] font-black uppercase tracking-widest">News</span>
                    </Link>

                    {/* POST BUTTON (CENTER) */}
                    <div className="relative -top-8 flex flex-col items-center gap-2">
                        <button 
                            onClick={handlePostClick}
                            className="w-16 h-16 rounded-full bg-primary text-black flex items-center justify-center shadow-[0_0_30px_rgba(255,153,0,0.4)] hover:shadow-[0_0_40px_rgba(255,153,0,0.7)] transform hover:scale-110 active:scale-95 transition-all relative z-10 border-[6px] border-black"
                        >
                            <Plus size={32} strokeWidth={3} />
                        </button>
                        <span className="absolute -bottom-6 text-[9px] font-black uppercase text-primary tracking-widest text-center w-20">Post Signal</span>
                    </div>

                    {/* FOR YOU LINK */}
                    <Link 
                        to="/foryou" 
                        className={`flex flex-col items-center gap-1 group py-2 px-4 rounded-3xl transition-all ${location.pathname === '/foryou' ? 'text-primary' : 'text-white/40 hover:text-white'}`}
                    >
                        <Target size={20} className={location.pathname === '/foryou' ? 'text-primary' : ''} />
                        <span className="text-[8px] font-black uppercase tracking-widest">For You</span>
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
                        // Redirect to foryou or social to see the pending post
                        navigate('/social');
                    }}
                />
            )}
        </>
    );
};

export default FloatingNav;
