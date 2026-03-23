/* src/pages/SocialDashboard.jsx */
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { 
  Heart, MessageCircle, Share2, Target, Users, Globe, Building2, 
  Upload, Clock, Trash2, Video, Zap, Gift, X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { fetchSocialPosts, deletePost } from '../lib/supabase';
import UploadModal from '../components/UploadModal';

const TABS = [
  { id: 'foryou', label: 'For You', icon: Target },
  { id: 'following', label: 'Following', icon: Users },
  { id: 'discover', label: 'Discover', icon: Globe },
  { id: 'biggames', label: 'Big Games', icon: Building2 }
];

const GIFT_OPTIONS = [
  { id: 1, name: 'Crystal Heart', cost: 50, emoji: '💎' },
  { id: 2, name: 'Digital Coin', cost: 100, emoji: '🪙' },
  { id: 3, name: 'Power Bolt', cost: 250, emoji: '⚡' },
  { id: 4, name: 'Golden Star', cost: 500, emoji: '⭐' },
];

const GiftOverlay = ({ onClose, onGift, currentCredits }) => {
  const [sent, setSent] = useState(null);
  const handleGift = (gift) => {
    const ok = onGift(gift);
    if (ok) {
      setSent(gift);
      setTimeout(() => { setSent(null); onClose(); }, 1500);
    }
  };
  return (
    <div className="absolute inset-0 z-40 bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center p-6 gap-4 rounded-[3rem]">
      {sent ? (
        <div className="text-center animate-in zoom-in space-y-3">
          <div className="text-6xl">{sent.emoji}</div>
          <p className="text-white font-black uppercase tracking-widest">{sent.name} Sent!</p>
        </div>
      ) : (
        <>
          <button onClick={onClose} className="absolute top-6 right-6 p-2 text-white/30 hover:text-white"><X size={20} /></button>
          <p className="text-[10px] text-primary font-black uppercase tracking-widest">Your Credits: {currentCredits} CR</p>
          <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
            {GIFT_OPTIONS.map(gift => (
              <button
                key={gift.id}
                onClick={() => handleGift(gift)}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/40 hover:bg-primary/5 transition-all group"
              >
                <span className="text-3xl group-hover:scale-110 transition-transform">{gift.emoji}</span>
                <p className="text-[9px] font-black uppercase text-white/40">{gift.name}</p>
                <p className="text-xs font-black text-white">{gift.cost} CR</p>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const SocialDashboard = () => {
  const { user, isPostLiked, toggleLike, spendCredits, currentCredits } = useAuth();
  const [activeTab, setActiveTab] = useState('foryou');
  const [posts, setPosts] = useState([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [giftingPostId, setGiftingPostId] = useState(null);
  const [likeCounts, setLikeCounts] = useState({});

  useEffect(() => {
    const loadPosts = async () => {
      const allPosts = await fetchSocialPosts();
      const normalised = allPosts.map(p => ({
        ...p,
        userId: p.userId || p.user_id,
        videoUrl: p.videoUrl || p.video_url,
        fileName: p.fileName || p.file_name,
      }));
      setPosts(normalised);
      // Init like counts
      const counts = {};
      normalised.forEach(p => { counts[p.id] = p.likes || 0; });
      const bumps = JSON.parse(localStorage.getItem('bg_like_bumps') || '{}');
      Object.keys(bumps).forEach(id => {
        if (counts[id] !== undefined) counts[id] = counts[id] + bumps[id];
      });
      setLikeCounts(counts);
    };
    loadPosts();
  }, [user]);

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
      [postId]: Math.max(0, (prev[postId] || 0) + (wasLiked ? -1 : 1))
    }));
  };

  const handleGift = (gift) => {
    return spendCredits(gift.cost);
  };

  if (!user) return <Navigate to="/signin" replace />;

  return (
    <div className="max-w-7xl mx-auto px-0 md:px-6 relative h-[calc(100vh-80px)] md:h-[calc(100vh-96px)] flex">
      {/* Sidebar - Desktop */}
      <div className="hidden lg:flex w-64 flex-col gap-4 py-8 pr-8 border-r border-white/10">
        <button onClick={() => setIsUploadModalOpen(true)} className="btn-primary w-full py-4 uppercase font-black flex items-center justify-center gap-3 shadow-xl mb-4 text-xs tracking-widest">
          <Upload size={18} /> New Transmission
        </button>
        {TABS.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all ${activeTab === tab.id ? 'bg-primary text-black shadow-lg shadow-primary/20' : 'text-white/50 hover:bg-white/5 hover:text-white'}`}
            >
              <Icon size={18} />
              {tab.label}
            </button>
          );
        })}
        {/* Credits display in sidebar */}
        <div className="mt-auto p-4 bg-primary/5 border border-primary/20 rounded-2xl flex items-center gap-3">
          <Zap size={16} className="text-primary shrink-0" />
          <div>
            <p className="text-[9px] font-black uppercase tracking-widest text-white/30">Your Credits</p>
            <p className="font-black text-primary text-lg">{currentCredits} CR</p>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 flex flex-col relative bg-black">
        {/* Mobile Header / Tab Bar */}
        <div className="lg:hidden flex items-center justify-between px-4 py-4 fixed top-20 left-0 w-full z-[100] bg-black/80 backdrop-blur-md border-b border-white/5">
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`text-[9px] whitespace-nowrap font-black uppercase tracking-widest px-4 py-2 rounded-full border ${activeTab === tab.id ? 'bg-primary text-black border-primary' : 'text-white/50 bg-white/5 border-white/5'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-black text-primary">{currentCredits} CR</span>
            <button onClick={() => setIsUploadModalOpen(true)} className="p-2.5 bg-primary text-black rounded-full shadow-lg">
              <Upload size={16} />
            </button>
          </div>
        </div>

        {/* Global Feed Content */}
        <div className="flex-1 overflow-y-scroll snap-y snap-mandatory relative z-10 no-scrollbar p-0">
          
          {/* USER'S OWN PENDING SECTION */}
          {posts.filter(p => p.userId === user?.id && p.status === 'pending').length > 0 && (
            <div className="snap-start min-h-screen flex items-center justify-center p-4 md:p-8">
              <div className="glass rounded-[2.5rem] p-8 md:p-12 border-white/10 max-w-4xl w-full">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-white font-black uppercase tracking-[0.2em] text-sm flex items-center gap-3">
                      <Clock size={18} className="text-primary" /> My Pending Submissions
                    </h3>
                    <p className="text-text-secondary text-[10px] mt-1 uppercase tracking-widest font-bold">Awaiting Network Clearance</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {posts
                    .filter(p => p.userId === user?.id && p.status === 'pending')
                    .map(post => (
                      <div key={post.id} className="relative aspect-[9/16] rounded-2xl overflow-hidden group bg-black/40 border border-white/10 hover:border-primary/40 transition-all">
                        <video src={post.videoUrl} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-black/40 text-center opacity-100 group-hover:opacity-0 transition-opacity">
                            <Clock size={20} className="text-white/20 mb-2" />
                            <span className="text-[8px] text-white/60 font-black uppercase tracking-widest">In Review</span>
                        </div>
                        <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={async (e) => {
                              e.stopPropagation();
                              if (window.confirm('Retract this submission?')) {
                                await deletePost(post.id);
                                setPosts(prev => prev.filter(p => p.id !== post.id));
                              }
                            }}
                            className="p-4 bg-red-500 text-white rounded-full shadow-2xl hover:bg-red-600 transition-all"
                          >
                            <Trash2 size={24} />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {posts.filter(p => p.status !== 'pending' || p.userId === user?.id).length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
              <div className="p-8 bg-white/5 rounded-full text-white/10 mb-4 animate-pulse"><Video size={64} /></div>
              <h2 className="text-3xl font-black italic uppercase text-white/50 tracking-tighter">Transmission Void</h2>
              <p className="text-text-secondary text-xs font-black tracking-widest">NO SIGNALS DETECTED IN THIS SECTOR.</p>
            </div>
          ) : (
            posts
              .filter(p => p.status !== 'pending' || p.userId === user?.id)
              .map(post => (
              <div key={post.id} className="h-full w-full snap-start relative bg-black flex items-center justify-center overflow-hidden">
                <div className="relative w-full max-w-md h-full md:h-[94%] md:rounded-[3rem] overflow-hidden bg-white/5 shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/5">
                  {post.videoUrl?.includes('youtube.com') || post.videoUrl?.includes('youtu.be') ? (
                    <iframe 
                      src={post.videoUrl.replace('watch?v=', 'embed/') + '?autoplay=1&mute=1&loop=1&controls=0&modestbranding=1'}
                      className="w-[150%] h-[150%] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 object-cover pointer-events-none opacity-80"
                      frameBorder="0"
                      allow="autoplay"
                    />
                  ) : (
                    <video src={post.videoUrl} className="w-full h-full object-cover" autoPlay muted loop playsInline />
                  )}
                  
                  {/* Gift overlay */}
                  {giftingPostId === post.id && (
                    <GiftOverlay
                      onClose={() => setGiftingPostId(null)}
                      onGift={handleGift}
                      currentCredits={currentCredits}
                    />
                  )}

                  {/* Overlay UI */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-black/40 flex flex-col justify-between p-6 md:p-8 pb-32 md:pb-12 pointer-events-none">
                    <div className="flex justify-between items-start pt-4 pointer-events-none">
                      <div className="flex items-center gap-2">
                        <Zap size={14} className="text-primary animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">Verified Transmission</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-end">
                      <div className="space-y-4 max-w-[75%] pb-4 pointer-events-none">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-black uppercase border border-primary/20 shadow-lg">
                            {(post.username || 'U').charAt(0)}
                          </div>
                          <div>
                            <span className="font-black text-white text-lg drop-shadow-lg italic">@{post.username || 'user'}</span>
                            {post.status === 'pending' && (
                              <div className="flex items-center gap-1.5 text-orange-400 text-[8px] font-black uppercase tracking-widest mt-0.5">
                                <Clock size={10} /> Review Pending
                              </div>
                            )}
                          </div>
                        </div>
                        <p className="text-sm font-medium text-white/90 drop-shadow-lg leading-relaxed">{post.description}</p>
                      </div>

                      {/* Action buttons */}
                      <div className="flex flex-col gap-5 items-center pb-2 pointer-events-auto">
                        {/* Like */}
                        <button
                          onClick={() => handleLike(post.id)}
                          className="flex flex-col items-center gap-1 group"
                        >
                          <div className={`p-4 rounded-full backdrop-blur-xl transition-all group-active:scale-95 shadow-2xl ${isPostLiked(post.id) ? 'bg-red-500/20 border border-red-500/40' : 'bg-black/60 border border-white/10 group-hover:bg-primary/20'}`}>
                            <Heart size={24} className={`transition-colors ${isPostLiked(post.id) ? 'text-red-400 fill-red-400' : 'text-white group-hover:text-primary'}`} />
                          </div>
                          <span className="text-[10px] font-black text-white tracking-widest">{likeCounts[post.id] || 0}</span>
                        </button>

                        {/* Gift */}
                        <button
                          onClick={() => setGiftingPostId(giftingPostId === post.id ? null : post.id)}
                          className="flex flex-col items-center gap-1 group"
                        >
                          <div className="p-4 rounded-full bg-black/60 backdrop-blur-xl group-hover:bg-primary/20 transition-all text-white border border-white/10 group-active:scale-95 shadow-2xl">
                            <Gift size={24} className="group-hover:text-primary transition-colors" />
                          </div>
                          <span className="text-[10px] font-black text-white/60">Gift</span>
                        </button>

                        {/* Share */}
                        <button
                          onClick={() => navigator.share?.({ url: window.location.href }) || navigator.clipboard?.writeText(window.location.href)}
                          className="flex flex-col items-center gap-1 group"
                        >
                          <div className="p-4 rounded-full bg-black/60 backdrop-blur-xl group-hover:bg-primary/20 transition-all text-white border border-white/10 group-active:scale-95 shadow-2xl">
                            <Share2 size={24} />
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <UploadModal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)} 
        user={user} 
        onUploadSuccess={(newPost) => setPosts([newPost, ...posts])}
      />
    </div>
  );
};

export default SocialDashboard;
