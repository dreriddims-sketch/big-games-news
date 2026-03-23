/* src/pages/ForYouPage.jsx - Public-facing For You feed */
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Heart, Share2, Gift, Play, Zap, UserPlus, MessageCircle, X, Volume2, VolumeX, Eye, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { fetchSocialPosts, fetchArticles, incrementViews } from '../lib/supabase';
import AdPost from '../components/AdPost';


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

const GiftIcon = ({ size = 16, className = "" }) => (
  <Gift size={size} className={className} />
);

const FloatingGifts = () => {
  const [offsets] = useState(() => 
    Array.from({ length: 4 }).map(() => ({
      x: (Math.random() - 0.5) * 60,
      y: (Math.random() - 0.5) * 60,
      scale: 0.5 + Math.random() * 0.5,
      rotate: Math.random() * 360,
      delay: Math.random() * 2
    }))
  );

  return (
    <>
      {offsets.map((off, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 0.4, 0], scale: [0, off.scale, 0], rotate: off.rotate }}
          transition={{ duration: 4, repeat: Infinity, delay: off.delay }}
          style={{ position: 'absolute', left: `calc(50% + ${off.x}px)`, top: `calc(50% + ${off.y}px)` }}
          className="pointer-events-none text-primary/50"
        >
          <GiftIcon size={10} />
        </motion.div>
      ))}
    </>
  );
};

const TagList = ({ tags, onTagClick, className = "" }) => {
  if (!tags || tags.length === 0) return null;
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {tags.map(tag => (
        <button
          key={tag}
          onClick={(e) => { e.stopPropagation(); onTagClick(tag); }}
          className="px-2 py-1 bg-primary/10 hover:bg-primary/20 border border-primary/20 rounded-lg text-[10px] font-black text-primary uppercase tracking-widest transition-all backdrop-blur-md"
        >
          #{tag}
        </button>
      ))}
    </div>
  );
};

const VideoPost = React.memo(({ post, isLiked, onLike, onGift, activePostId, likeCount, isMuted, onToggleMute, onTagClick }) => {
  const videoRef = React.useRef(null);
  const [isInView, setIsInView] = React.useState(false);
  const [showIcon, setShowIcon] = React.useState(false);
  const isActive = activePostId === post.id;

  React.useEffect(() => {
    if (isActive) {
      setShowIcon(true);
      const timer = setTimeout(() => setShowIcon(false), 800);
      incrementViews(post.id); // Increment view when active
      return () => clearTimeout(timer);
    }
  }, [isMuted, isActive, post.id]);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { setIsInView(entry.isIntersecting); },
      { threshold: 0.6 }
    );
    if (videoRef.current) observer.observe(videoRef.current);
    return () => observer.disconnect();
  }, [post.id]);

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
    <div 
      ref={videoRef} 
      className="h-full w-full snap-start relative bg-black flex items-center justify-center overflow-hidden cursor-pointer touch-pan-y"
      onClick={onToggleMute}
    >
      <div className="relative w-full h-full overflow-hidden bg-black shadow-none border-none pointer-events-none">
        
        {/* Full-screen video content */}
        {(isInView || isActive) ? (
          post.videoUrl?.includes('youtube.com') || post.videoUrl?.includes('youtu.be') ? (
            <iframe
              src={post.videoUrl.replace('watch?v=', 'embed/') + `?autoplay=${isActive ? 1 : 0}&mute=${isMuted ? 1 : 0}&loop=1&controls=0&modestbranding=1&rel=0`}
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
              muted={isMuted} 
              playsInline 
              webkit-playsinline="true"
              preload={isActive ? "auto" : "metadata"}
              autoPlay={isActive}
            />
          )
        ) : (
          <div className="w-full h-full bg-black flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          </div>
        )}

        {/* Visual feedback for Mute/Unmute */}
        <AnimatePresence>
           {showIcon && (
             <motion.div 
               key="feedback"
               initial={{ scale: 0.5, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               exit={{ scale: 1.2, opacity: 0 }}
               className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
             >
               <div className="bg-black/60 backdrop-blur-3xl p-10 rounded-full border border-white/20 text-white shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                 {isMuted ? <VolumeX size={64} className="text-white/80" /> : <Volume2 size={64} className="text-primary" />}
               </div>
             </motion.div>
           )}
        </AnimatePresence>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

        {/* Bottom info */}
        <div className="absolute bottom-0 left-0 right-0 p-8 pb-32 flex justify-between items-end">
          <div className="space-y-4 max-w-[80%] pb-4 lg:pointer-events-auto pointer-events-none">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full border-2 border-primary overflow-hidden bg-black flex items-center justify-center shadow-[0_0_15px_rgba(255,153,0,0.3)]">
                {post.avatarUrl ? (
                  <img src={post.avatarUrl} className="w-full h-full object-cover" alt={post.username} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-primary font-black text-lg backdrop-blur-md">
                    {(post.username || 'U').charAt(0)}
                  </div>
                )}
              </div>
              <div className="flex flex-col">
                <span className="font-black text-white text-lg drop-shadow-lg italic">@{post.username || 'user'}</span>
                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-primary">Certified Contributor</span>
              </div>
              <button className="px-4 py-1.5 bg-white text-black font-black text-[10px] uppercase rounded-full hover:bg-primary transition-all ml-2 pointer-events-auto shadow-lg">Follow</button>
            </div>
            {post.description && (
              <p className="text-white text-sm font-medium leading-relaxed drop-shadow-md italic">"{post.description}"</p>
            )}
            <TagList tags={post.tags} onTagClick={onTagClick} className="pointer-events-auto" />
          </div>

          <div className="flex flex-col gap-6 items-center pb-32 pointer-events-auto">
            <button onClick={(e) => { e.stopPropagation(); onLike(post.id); }} className="flex flex-col items-center gap-1 group">
              <div className={`p-4 rounded-full backdrop-blur-2xl border transition-all group-active:scale-90 shadow-2xl ${isLiked ? 'bg-red-500/40 border-red-500/60' : 'bg-black/40 border-white/20'}`}>
                <Heart size={24} className={`transition-colors ${isLiked ? 'text-red-400 fill-red-400' : 'text-white'}`} />
              </div>
              <span className="text-[10px] font-black text-white drop-shadow-lg uppercase tracking-widest">{likeCount || 0}</span>
            </button>
            <div className="flex flex-col items-center gap-1 group">
              <div className="p-4 rounded-full bg-black/40 backdrop-blur-2xl border border-white/20 shadow-2xl group-hover:bg-white/10 group-active:scale-95 transition-all">
                <Eye size={24} className="text-white/80 group-hover:text-primary transition-colors" />
              </div>
              <span className="text-[10px] font-black text-white/60 drop-shadow-lg uppercase tracking-widest leading-none">{post.views || 0}</span>
            </div>
            <button onClick={(e) => { e.stopPropagation(); onGift(post.id); }} className="flex flex-col items-center gap-1 group relative">
              <FloatingGifts />
              <div className="p-4 rounded-full bg-black/40 backdrop-blur-2xl border border-white/20 group-hover:bg-primary/20 group-hover:border-primary/40 transition-all group-active:scale-90 shadow-2xl relative z-10">
                <Gift size={24} className="text-white group-hover:text-primary transition-colors" />
              </div>
              <span className="text-[10px] font-black text-white drop-shadow-lg uppercase tracking-widest">{post.gifts || 0} GIFTS</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

const ArticlePost = React.memo(({ post, isLiked, onLike, onGift, likeCount, onTagClick }) => {
  return (
    <div className="h-full w-full snap-start relative bg-black flex items-center justify-center overflow-hidden">
      {/* Background Banner */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.img 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
          src={post.banner_url || '/hero.png'} 
          className="w-full h-full object-cover opacity-40" 
          alt="" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#08080a] via-[#08080a]/80 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
      </div>

      <div className="relative z-10 w-full h-full flex flex-col justify-end p-8 pb-32 max-w-full mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "circOut" }}
          className="space-y-8"
        >
          <div className="flex items-center gap-4">
            <span className="px-4 py-1.5 bg-primary text-black text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-[0_0_20px_rgba(255,153,0,0.3)]">INTELLIGENCE_SIGNAL</span>
            <div className="h-px w-12 bg-white/20" />
            <span className="text-[10px] text-white/40 font-black uppercase tracking-[0.3em] font-mono">
              {new Date(post.created_at).toLocaleDateString(undefined, { month: 'short', day: '2-digit', year: 'numeric' })}
            </span>
          </div>
          
          <h2 className="text-5xl md:text-8xl font-black uppercase italic tracking-tighter leading-[0.85] text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
            {post.title}
          </h2>

          <div className="prose prose-invert prose-lg max-w-2xl line-clamp-3 text-white/60 font-medium leading-relaxed italic border-l-4 border-primary/40 pl-6">
             <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>
          
          <div className="flex flex-wrap gap-4 items-center">
            <TagList tags={post.tags} onTagClick={onTagClick} />
          </div>

          <div className="pt-8 flex flex-wrap items-center gap-6">
            <Link 
              to={`/feed/${post.slug || post.id}`}
              className="px-10 py-5 bg-primary text-black text-xs font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-white transition-all flex items-center gap-3 group shadow-[0_10px_40px_rgba(255,153,0,0.2)]"
            >
              Access Data Stream <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        </motion.div>

        {/* Article Sidebar Interactions */}
        <div className="flex flex-col gap-6 items-center pb-32 pointer-events-auto">
          <button onClick={(e) => { e.stopPropagation(); onLike(post.id); }} className="flex flex-col items-center gap-1 group">
            <div className={`p-4 rounded-full backdrop-blur-2xl border transition-all group-active:scale-90 shadow-2xl ${isLiked ? 'bg-red-500/40 border-red-500/60' : 'bg-black/40 border-white/20'}`}>
              <Heart size={24} className={`transition-colors ${isLiked ? 'text-red-400 fill-red-400' : 'text-white'}`} />
            </div>
            <span className="text-[10px] font-black text-white drop-shadow-lg uppercase tracking-widest">{likeCount || 0}</span>
          </button>
          
          <div className="flex flex-col items-center gap-1 group">
            <div className="p-4 rounded-full bg-black/40 backdrop-blur-2xl border border-white/20 shadow-2xl group-hover:bg-white/10 group-active:scale-95 transition-all">
              <Eye size={24} className="text-white/80 group-hover:text-primary transition-colors" />
            </div>
            <span className="text-[10px] font-black text-white/60 drop-shadow-lg uppercase tracking-widest leading-none">{post.views || 0}</span>
          </div>

          <button onClick={(e) => { e.stopPropagation(); onGift(post.id); }} className="flex flex-col items-center gap-1 group relative">
            <FloatingGifts />
            <div className="p-4 rounded-full bg-black/40 backdrop-blur-2xl border border-white/20 group-hover:bg-primary/20 group-hover:border-primary/40 transition-all group-active:scale-90 shadow-2xl relative z-10">
              <Gift size={24} className="text-white group-hover:text-primary transition-colors" />
            </div>
            <span className="text-[10px] font-black text-white drop-shadow-lg uppercase tracking-widest leading-none mt-1 text-center">{post.gifts || 0} GIFTS</span>
          </button>

          <button 
            onClick={() => navigator.share?.({ title: post.title, url: window.location.origin + '/feed/' + (post.slug || post.id) })}
            className="flex flex-col items-center gap-1 group"
          >
            <div className="p-4 rounded-full bg-black/40 backdrop-blur-2xl border border-white/20 group-hover:bg-white/10 transition-all group-active:scale-90 shadow-2xl">
              <Share2 size={24} className="text-white group-hover:text-primary transition-colors" />
            </div>
            <span className="text-[10px] font-black text-white/60 drop-shadow-lg uppercase tracking-widest leading-none mt-1 text-center">SHARE</span>
          </button>
        </div>
      </div>
      
      {/* Decorative scanline effect */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-20 bg-[length:100%_2px,3px_100%]" />
    </div>
  );
});



const ForYouPage = ({ mode = 'mixed' }) => {
  const { user, isPostLiked, toggleLike } = useAuth();
  const { slug } = useParams();
  const scrollContainerRef = React.useRef(null);
  const [items, setItems] = useState([]);
  const [likeCounts, setLikeCounts] = useState({});
  const [giftingPost, setGiftingPost] = useState(null);
  const [activePostId, setActivePostId] = useState(null);
  const [isMuted, setIsMuted] = useState(true);
  const [filterTag, setFilterTag] = useState(null);

  useEffect(() => {
    const load = async () => {
      const [allSocial, allArticles] = await Promise.all([
        fetchSocialPosts(),
        fetchArticles()
      ]);

      const normalisedSocial = allSocial
        .filter(p => p.status !== 'pending')
        .map(p => ({ ...p, type: 'video' }));

      const normalisedArticles = allArticles.map(p => ({ 
        ...p, 
        type: 'article',
        id: p.id.toString(),
        created_at: p.created_at || new Date().toISOString()
      }));

      const combined = [...normalisedSocial, ...normalisedArticles]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      setItems(combined);
      
      // If slug exists, find the item and set activePostId
      if (slug) {
        const target = combined.find(i => (i.slug || i.id.toString()) === slug);
        if (target) {
          setActivePostId(target.id);
          // Small delay to ensure items are rendered before scrolling
          setTimeout(() => {
            const el = document.getElementById(`${target.type}-${target.id}`);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        } else if (combined.length > 0) {
          setActivePostId(combined[0].id);
        }
      } else if (combined.length > 0) {
        setActivePostId(combined[0].id);
      }
      
      const counts = {};
      normalisedSocial.forEach(p => { counts[p.id] = p.likes || 0; });
      normalisedArticles.forEach(p => { counts[p.id] = (p.likes || 0); });
      
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
    if (wasLiked) bumps[postId] = Math.max(0, (bumps[postId] || 1) - 1);
    else bumps[postId] = (bumps[postId] || 0) + 1;
    localStorage.setItem('bg_like_bumps', JSON.stringify(bumps));
    setLikeCounts(prev => ({ ...prev, [postId]: (prev[postId] || 0) + (wasLiked ? -1 : 1) }));
  };

  const filteredItems = (mode === 'news' ? items.filter(i => i.type === 'article') : items)
    .filter(item => !filterTag || item.tags?.includes(filterTag));

  return (
    <div className="relative bg-black h-svh w-screen flex flex-col overflow-hidden">
      {/* Top Header Overlay */}
      <div className="absolute top-8 left-8 right-8 z-50 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-4">
          <Link to="/" className="pointer-events-auto bg-black/40 backdrop-blur-md p-3 rounded-full border border-white/10 text-white/60 hover:text-white transition-all">
            <X size={20} />
          </Link>
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 flex items-center gap-2">
              <Zap size={10} className="text-primary" /> {filterTag ? `TAG: #${filterTag.toUpperCase()}` : mode === 'news' ? 'News Feed' : 'For You'} 
            </span>
            <span className="text-[8px] font-black uppercase tracking-[0.1em] text-primary">{mode === 'news' ? 'LIVE_ARTICLE_STREAM' : 'LIVE_MIXED_FEED'}</span>
          </div>
        </div>

        {filterTag && (
          <button 
            onClick={() => setFilterTag(null)}
            className="pointer-events-auto px-4 py-2 bg-white text-black text-[9px] font-black uppercase tracking-widest rounded-full hover:bg-primary transition-all"
          >
            Clear Filter
          </button>
        )}
      </div>

      <div 
        ref={scrollContainerRef}
        className="flex-1 h-full w-full overflow-y-scroll snap-y snap-mandatory no-scrollbar overflow-x-hidden"
        onScroll={(e) => {
          const index = Math.round(e.target.scrollTop / e.target.clientHeight);
          if (filteredItems[index] && filteredItems[index].id !== activePostId) {
            setActivePostId(filteredItems[index].id);
          }
        }}
      >
        {filteredItems.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
            <div className="p-8 bg-white/5 rounded-full text-white/10 animate-pulse"><Play size={64} /></div>
            <h2 className="text-3xl font-black italic uppercase text-white/30 tracking-tighter">End of Signals</h2>
            <p className="text-white/20 text-xs font-black tracking-widest uppercase">No content matches this frequency.</p>
            {filterTag && (
              <button 
                onClick={() => setFilterTag(null)}
                className="btn-primary px-8 py-4 text-xs font-black uppercase tracking-widest mt-4"
              >
                Reset Feed
              </button>
            )}
          </div>
        ) : (
          filteredItems.reduce((acc, item, index) => {
            // Push the content item
            acc.push(
              <div key={`${item.type}-${item.id}`} id={`${item.type}-${item.id}`} className="relative h-full w-full">
                {item.type === 'video' ? (
                  <VideoPost 
                    post={item} 
                    isLiked={isPostLiked(item.id)}
                    onLike={handleLike}
                    onGift={(id) => setGiftingPost(id)}
                    activePostId={activePostId}
                    likeCount={likeCounts[item.id]}
                    isMuted={isMuted}
                    onToggleMute={() => setIsMuted(prev => !prev)}
                    onTagClick={setFilterTag}
                  />
                ) : (
                  <ArticlePost 
                    post={item} 
                    isLiked={isPostLiked(item.id)}
                    onLike={handleLike}
                    onGift={(id) => setGiftingPost(id)}
                    likeCount={likeCounts[item.id]}
                    onTagClick={setFilterTag}
                  />
                )}
                
                {giftingPost === item.id && (
                  <div className="absolute inset-0 z-40 flex items-center justify-center p-4">
                    <div className="w-full max-w-sm">
                      <GiftPanel post={item} onClose={() => setGiftingPost(null)} />
                    </div>
                  </div>
                )}
              </div>
            );

            // Inject ad every 3 items (adjusting for index)
            if ((index + 1) % 3 === 0) {
              acc.push(
                <div key={`ad-${index}`} className="relative h-full w-full">
                   <AdPost />
                </div>
              );
            }

            return acc;
          }, [])

        )}
      </div>

      {!user && !filterTag && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30">
          <Link
            to="/signup"
            className="flex items-center gap-3 px-6 py-3 bg-primary text-black font-black text-xs uppercase tracking-widest rounded-full shadow-xl shadow-primary/30 hover:scale-105 transition-all"
          >
            <UserPlus size={16} /> Join the Network
          </Link>
        </div>
      )}
    </div>
  );
};

export default ForYouPage;
