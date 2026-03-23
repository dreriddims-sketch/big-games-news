/* src/pages/ForYouPage.jsx - Public-facing For You feed */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Share2, Gift, Play, Zap, UserPlus, MessageCircle } from 'lucide-react';
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

const ForYouPage = () => {
  const { user, isPostLiked, toggleLike, currentCredits } = useAuth();
  const [posts, setPosts] = useState([]);
  const [likeCounts, setLikeCounts] = useState({});
  const [giftingPost, setGiftingPost] = useState(null);

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
      // Init like counts from post data
      const counts = {};
      normalised.forEach(p => { counts[p.id] = p.likes || 0; });
      // Load persisted local like bumps
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
    <div className="relative bg-black min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-20 px-4 pt-4 pb-2 bg-gradient-to-b from-black to-transparent pointer-events-none">
        <div className="text-center pointer-events-auto">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 flex items-center justify-center gap-2">
            <Zap size={10} className="text-primary" /> For You Feed
          </span>
        </div>
      </div>

      {/* Feed */}
      <div className="h-[calc(100svh-80px)] overflow-y-scroll snap-y snap-mandatory no-scrollbar">
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
            <div key={post.id} className="h-[100svh] w-full snap-start relative bg-black flex items-center justify-center overflow-hidden">
              <div className="relative w-full max-w-sm h-full md:h-[94%] md:rounded-[2.5rem] overflow-hidden bg-white/5 shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/5">
                {post.videoUrl?.includes('youtube.com') || post.videoUrl?.includes('youtu.be') ? (
                  <iframe
                    src={post.videoUrl.replace('watch?v=', 'embed/') + '?autoplay=1&mute=1&loop=1&controls=0&modestbranding=1'}
                    className="w-[150%] h-[150%] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 object-cover pointer-events-none"
                    frameBorder="0"
                    allow="autoplay"
                  />
                ) : (
                  <video src={post.videoUrl} className="w-full h-full object-cover" autoPlay muted loop playsInline />
                )}

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-black/30 pointer-events-none" />

                {/* Gift panel */}
                {giftingPost === post.id && (
                  <GiftPanel post={post} onClose={() => setGiftingPost(null)} />
                )}

                {/* Bottom info */}
                <div className="absolute bottom-0 left-0 right-0 p-6 pb-24 md:pb-12 flex justify-between items-end">
                  <div className="space-y-2 max-w-[75%]">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-black text-sm border border-primary/20">
                        {(post.username || 'U').charAt(0)}
                      </div>
                      <span className="font-black text-white italic">@{post.username || 'user'}</span>
                    </div>
                    {post.description && (
                      <p className="text-white/80 text-sm leading-relaxed line-clamp-2">{post.description}</p>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-col gap-5 items-center pb-24 md:pb-12 pointer-events-auto">
                    <button
                      onClick={() => handleLike(post.id)}
                      className="flex flex-col items-center gap-1 group"
                    >
                      <div className={`p-3.5 rounded-full backdrop-blur-xl border transition-all group-active:scale-90 ${isPostLiked(post.id) ? 'bg-red-500/20 border-red-500/40' : 'bg-black/60 border-white/10'}`}>
                        <Heart size={24} className={`transition-colors ${isPostLiked(post.id) ? 'text-red-400 fill-red-400' : 'text-white'}`} />
                      </div>
                      <span className="text-[10px] font-black text-white">{likeCounts[post.id] || 0}</span>
                    </button>

                    <button
                      onClick={() => setGiftingPost(giftingPost === post.id ? null : post.id)}
                      className="flex flex-col items-center gap-1 group"
                    >
                      <div className="p-3.5 rounded-full bg-black/60 backdrop-blur-xl border border-white/10 group-hover:bg-primary/20 group-hover:border-primary/40 transition-all group-active:scale-90">
                        <Gift size={24} className="text-white group-hover:text-primary transition-colors" />
                      </div>
                      <span className="text-[10px] font-black text-white/60">Gift</span>
                    </button>

                    <button
                      onClick={() => navigator.share?.({ url: window.location.href }) || navigator.clipboard?.writeText(window.location.href)}
                      className="flex flex-col items-center gap-1 group"
                    >
                      <div className="p-3.5 rounded-full bg-black/60 backdrop-blur-xl border border-white/10 group-hover:bg-white/10 transition-all group-active:scale-90">
                        <Share2 size={24} className="text-white" />
                      </div>
                      <span className="text-[10px] font-black text-white/60">Share</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Sign up CTA for non-users */}
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
