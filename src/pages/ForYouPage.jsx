/* src/pages/ForYouPage.jsx - Public-facing For You feed */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Share2, Gift, Play, Zap, UserPlus, MessageCircle, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { fetchSocialPosts } from '../lib/supabase';

const GIFT_OPTIONS = [
  { id: 1, name: 'Crystal Heart', cost: 50, emoji: '💎' },
  { id: 2, name: 'Digital Coin', cost: 100, emoji: '🪙' },
  { id: 3, name: 'Power Bolt', cost: 250, emoji: '⚡' },
  { id: 4, name: 'Golden Star', cost: 500, emoji: '⭐' },
];

const GiftPanel = ({ post, onClose }) => {
  const { spendCredits, currentCredits, user } = useAuth();
  const [sent, setSent] = useState(null);

  const handleGift = (gift) => {
    if (!user) return;
    const ok = spendCredits(gift.cost);
    if (ok) {
      setSent(gift);
      setTimeout(() => { setSent(null); onClose(); }, 1500);
    }
  };

  return (
    <div className="absolute inset-0 z-30 bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center p-6 gap-4 rounded-inherit">
      {sent ? (
        <div className="text-center space-y-4 animate-in zoom-in duration-300">
          <div className="text-6xl">{sent.emoji}</div>
          <p className="text-white font-black uppercase tracking-widest text-lg">{sent.name} Sent!</p>
        </div>
      ) : (
        <>
          <div className="text-center space-y-1">
            <p className="text-[10px] text-white/50 font-black uppercase tracking-widest">Send a Gift</p>
            <p className="text-xs text-primary font-black">Your Credits: {currentCredits} CR</p>
          </div>
          <div className="grid grid-cols-2 gap-3 w-full">
            {GIFT_OPTIONS.map(gift => (
              <button
                key={gift.id}
                onClick={() => handleGift(gift)}
                disabled={!user}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/40 hover:bg-primary/5 transition-all group"
              >
                <span className="text-3xl group-hover:scale-110 transition-transform">{gift.emoji}</span>
                <p className="text-[9px] font-black uppercase text-white/50">{gift.name}</p>
                <p className="text-xs font-black text-white">{gift.cost} CR</p>
              </button>
            ))}
          </div>
          {!user && (
            <Link to="/signup" className="w-full py-3 bg-primary text-black font-black text-xs uppercase tracking-widest rounded-xl text-center hover:bg-primary/90 transition-all">
              Sign up to Gift
            </Link>
          )}
          <button onClick={onClose} className="text-[10px] text-white/30 hover:text-white uppercase tracking-widest font-black transition-colors">
            Cancel
          </button>
        </>
      )}
    </div>
  );
};


const VideoPost = ({ post, isLiked, onLike, onGift, activePostId }) => {
  const videoRef = React.useRef(null);
  const [isInView, setIsInView] = React.useState(false);
  const isActive = activePostId === post.id;

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.6 }
    );

    if (videoRef.current) observer.observe(videoRef.current);
    return () => observer.disconnect();
  }, []);

  // Play/Pause logic for native videos
  React.useEffect(() => {
    if (videoRef.current && !post.videoUrl?.includes('youtube.com')) {
      const video = videoRef.current.querySelector('video');
      if (video) {
        if (isActive && isInView) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      }
    }
  }, [isActive, isInView, post.videoUrl]);

  return (
    <div ref={videoRef} className="h-full w-full snap-start relative bg-black flex items-center justify-center overflow-hidden">
      <div className="relative w-full h-full overflow-hidden bg-black shadow-none border-none">
        
        {/* Full-screen video content */}
        {(isInView || isActive) ? (
          post.videoUrl?.includes('youtube.com') || post.videoUrl?.includes('youtu.be') ? (
            <iframe
              src={post.videoUrl.replace('watch?v=', 'embed/') + `?autoplay=${isActive ? 1 : 0}&mute=1&loop=1&controls=0&modestbranding=1&rel=0`}
              className="w-full h-full absolute inset-0 object-cover scale-[1.05]"
              frameBorder="0"
              allow="autoplay"
              loading="lazy"
            />
          ) : (
            <video 
              src={post.videoUrl} 
              className="w-full h-full object-cover" 
              loop 
              muted 
              playsInline 
              preload="metadata"
              autoPlay={isActive}
            />
          )
        ) : (
          <div className="w-full h-full bg-black flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          </div>
        )}

        {/* Gradient overlay - lighter to let video shine */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

        {/* Bottom info - pinned to bottom of screen */}
        <div className="absolute bottom-0 left-0 right-0 p-8 pb-32 flex justify-between items-end">
          <div className="space-y-3 max-w-[80%] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-black text-sm border border-primary/20 backdrop-blur-md">
                {(post.username || 'U').charAt(0)}
              </div>
              <span className="font-black text-white text-lg drop-shadow-lg italic">@{post.username || 'user'}</span>
              <button className="px-3 py-1 bg-white text-black font-black text-[9px] uppercase rounded-lg hover:bg-primary transition-all ml-2">Follow</button>
            </div>
            {post.description && (
              <p className="text-white text-sm leading-relaxed drop-shadow-md italic line-clamp-2">"{post.description}"</p>
            )}
            <div className="flex items-center gap-2 text-white/60 text-[10px] uppercase font-black tracking-widest">
              <Zap size={10} className="text-primary" /> Core Extraction Node: {activePostId?.toString().slice(-4)}
            </div>
          </div>

          <div className="flex flex-col gap-6 items-center pb-32 pointer-events-auto">
            <button onClick={() => onLike(post.id)} className="flex flex-col items-center gap-1 group">
              <div className={`p-4 rounded-full backdrop-blur-2xl border transition-all group-active:scale-90 shadow-2xl ${isLiked ? 'bg-red-500/40 border-red-500/60' : 'bg-black/40 border-white/20'}`}>
                <Heart size={28} className={`transition-colors ${isLiked ? 'text-red-400 fill-red-400' : 'text-white'}`} />
              </div>
              <span className="text-[10px] font-black text-white drop-shadow-lg">Like</span>
            </button>

            <button onClick={() => onGift(post.id)} className="flex flex-col items-center gap-1 group">
              <div className="p-4 rounded-full bg-black/40 backdrop-blur-2xl border border-white/20 group-hover:bg-primary/20 group-hover:border-primary/40 transition-all group-active:scale-90 shadow-2xl">
                <Gift size={28} className="text-white group-hover:text-primary transition-colors" />
              </div>
              <span className="text-[10px] font-black text-white/60 drop-shadow-lg">Gift</span>
            </button>

            <button
              onClick={() => navigator.share?.({ url: window.location.href }) || navigator.clipboard?.writeText(window.location.href)}
              className="flex flex-col items-center gap-1 group"
            >
              <div className="p-4 rounded-full bg-black/40 backdrop-blur-2xl border border-white/20 group-hover:bg-white/10 transition-all group-active:scale-90 shadow-2xl">
                <Share2 size={28} className="text-white" />
              </div>
              <span className="text-[10px] font-black text-white/60 drop-shadow-lg">Share</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ForYouPage = () => {
  const { user, isPostLiked, toggleLike, currentCredits } = useAuth();
  const [posts, setPosts] = useState([]);
  const [likeCounts, setLikeCounts] = useState({});
  const [giftingPost, setGiftingPost] = useState(null);
  const [activePostId, setActivePostId] = useState(null);

  useEffect(() => {
    const load = async () => {
      const allPosts = await fetchSocialPosts();
      const normalised = allPosts
        .filter(p => p.status !== 'pending')
        .map(p => ({
          ...p,
          userId: p.userId || p.user_id,
          videoUrl: p.videoUrl || p.video_url,
        }));
      setPosts(normalised);
      if (normalised.length > 0) setActivePostId(normalised[0].id);
      
      const counts = {};
      normalised.forEach(p => { counts[p.id] = p.likes || 0; });
      const bumps = JSON.parse(localStorage.getItem('bg_like_bumps') || '{}');
      Object.keys(bumps).forEach(id => {
        if (counts[id] !== undefined) counts[id] = (counts[id]) + bumps[id];
      });
      setLikeCounts(counts);
    };
    load();
  }, []);

  const handleLike = (postId) => {
    const wasLiked = isPostLiked(postId);
    toggleLike(postId);
    const bumps = JSON.parse(localStorage.getItem('bg_like_bumps') || '{}');
    if (wasLiked) {
      bumps[postId] = Math.max(0, (bumps[postId] || 1) - 1);
    } else {
      bumps[postId] = (bumps[postId] || 0) + 1;
    }
    localStorage.setItem('bg_like_bumps', JSON.stringify(bumps));
    setLikeCounts(prev => ({
      ...prev,
      [postId]: (prev[postId] || 0) + (wasLiked ? -1 : 1)
    }));
  };

  return (
    <div className="relative bg-black h-svh w-screen flex flex-col overflow-hidden">
      {/* Minimal Overlay Info (Instead of Navbar) */}
      <div className="absolute top-8 left-8 z-50 pointer-events-none">
        <div className="flex items-center gap-4">
          <Link to="/" className="pointer-events-auto bg-black/40 backdrop-blur-md p-3 rounded-full border border-white/10 text-white/60 hover:text-white transition-all">
            <X size={20} />
          </Link>
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 flex items-center gap-2">
              <Zap size={10} className="text-primary" /> For You 
            </span>
            <span className="text-[8px] font-black uppercase tracking-[0.1em] text-primary">LIVE_TERMINAL</span>
          </div>
        </div>
      </div>

      <div 
        className="flex-1 h-full w-full overflow-y-scroll snap-y snap-mandatory no-scrollbar overflow-x-hidden"
        onScroll={(e) => {
          const index = Math.round(e.target.scrollTop / e.target.clientHeight);
          if (posts[index] && posts[index].id !== activePostId) {
            setActivePostId(posts[index].id);
          }
        }}
      >
        {posts.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
            <div className="p-8 bg-white/5 rounded-full text-white/10 animate-pulse"><Play size={64} /></div>
            <h2 className="text-3xl font-black italic uppercase text-white/30 tracking-tighter">No Videos Yet</h2>
            <p className="text-white/20 text-xs font-black tracking-widest uppercase">Be the first to upload a transmission.</p>
            {!user && (
              <Link to="/signup" className="btn-primary px-8 py-4 text-xs font-black uppercase tracking-widest mt-4">
                Join & Upload
              </Link>
            )}
          </div>
        ) : (
          posts.map(post => (
            <div key={post.id} className="relative h-full w-full">
              <VideoPost 
                post={post} 
                isLiked={isPostLiked(post.id)}
                onLike={handleLike}
                onGift={(id) => setGiftingPost(id)}
                activePostId={activePostId}
              />
              
              {giftingPost === post.id && (
                <div className="absolute inset-0 z-40 flex items-center justify-center p-4">
                  <div className="w-full max-w-sm">
                    <GiftPanel post={post} onClose={() => setGiftingPost(null)} />
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {!user && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30">
          <Link
            to="/signup"
            className="flex items-center gap-3 px-6 py-3 bg-primary text-black font-black text-xs uppercase tracking-widest rounded-full shadow-xl shadow-primary/30 hover:scale-105 transition-all"
          >
            <UserPlus size={16} /> Join Free — Get 150 Credits
          </Link>
        </div>
      )}
    </div>
  );
};

export default ForYouPage;
