/* src/pages/Profile.jsx */
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchSocialPosts, deletePost, updateSocialPost } from '../lib/supabase';
import { Video, Heart, LogOut, ShieldAlert, Trash2, Edit2, Check, Upload, Shield, Gift, Zap, Share2, X as Close, Play, Volume2, TrendingUp } from 'lucide-react';
import UploadModal from '../components/UploadModal';

const VideoModal = ({ post, isOpen, onClose, onDelete }) => {
  if (!isOpen || !post) return null;

  return (
    <div className="fixed inset-0 z-[500] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-0 md:p-8 animate-in fade-in zoom-in duration-300">
      <div className="relative w-full max-w-5xl h-full md:h-[90vh] glass rounded-none md:rounded-[3rem] overflow-hidden flex flex-col md:flex-row border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.8)]">
        
        {/* CLOSE BUTTON */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-[600] p-3 bg-black/40 hover:bg-black/80 rounded-full text-white/60 hover:text-white transition-all backdrop-blur-md border border-white/5"
        >
          <Close size={24} />
        </button>

        {/* VIDEO SECTION */}
        <div className="flex-1 bg-black relative flex items-center justify-center overflow-hidden">
          {post.videoUrl.includes('youtube.com') || post.videoUrl.includes('youtu.be') ? (
            <iframe 
               src={post.videoUrl.replace('watch?v=', 'embed/') + '?autoplay=1&mute=0&modestbranding=1'}
               className="w-full h-full object-cover"
               frameBorder="0"
               allow="autoplay; encrypted-media"
               allowFullScreen
            />
          ) : (
            <video 
               src={post.videoUrl} 
               className="w-full h-full object-contain" 
               autoPlay 
               controls 
               playsInline
            />
          )}
          
          {/* FLOATING ACTION BAR - MOBILE STYLE OVER VIDEO */}
          <div className="absolute right-4 bottom-24 md:hidden flex flex-col gap-6 items-center">
             <div className="flex flex-col items-center gap-1 group">
               <div className="p-4 bg-black/40 backdrop-blur-xl rounded-full text-white border border-white/10 shadow-lg">
                 <Heart size={24} className="group-hover:text-primary transition-colors" />
               </div>
               <span className="text-[10px] font-black">{post.likes || 0}</span>
             </div>
             <div className="flex flex-col items-center gap-1 group">
               <div className="p-4 bg-black/40 backdrop-blur-xl rounded-full text-white border border-white/10 shadow-lg">
                 <Gift size={24} className="group-hover:text-primary transition-colors" />
               </div>
               <span className="text-[10px] font-black uppercase text-white/60">Gift</span>
             </div>
          </div>
        </div>

        {/* SIDEBAR SECTION - DESKTOP CONTROLS */}
        <div className="w-full md:w-[380px] bg-black/40 backdrop-blur-xl border-l border-white/5 p-8 flex flex-col justify-between">
           <div className="space-y-8">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-black text-xl border border-primary/10 shadow-lg">
                    {(post.username || 'U').charAt(0)}
                 </div>
                 <div>
                    <h3 className="font-black text-white text-xl italic">@{post.username || 'user'}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                       <Shield size={12} className="text-primary fill-primary" />
                       <span className="text-[9px] font-black uppercase tracking-widest text-primary">Certified Contributor</span>
                    </div>
                 </div>
              </div>

              <div className="space-y-4">
                 <p className="text-white/80 font-medium leading-relaxed">{post.description}</p>
                 {post.status === 'pending' && (
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-full text-[9px] font-black uppercase tracking-widest">
                       <ShieldAlert size={12} /> Transmission in Security Review
                    </div>
                 )}
              </div>

              {/* SOCIAL BUTTONS GRID */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                 <button className="flex items-center justify-center gap-3 py-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all group">
                    <Heart size={20} className="group-hover:text-primary group-hover:fill-primary transition-all" />
                    <div className="text-[10px] font-black uppercase tracking-widest text-white/60 group-hover:text-white">Like</div>
                 </button>
                 <button className="flex items-center justify-center gap-3 py-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all group">
                    <Share2 size={20} className="group-hover:text-primary transition-all" />
                    <div className="text-[10px] font-black uppercase tracking-widest text-white/60 group-hover:text-white">Share</div>
                 </button>
                 <button className="flex items-center justify-center gap-3 py-4 bg-primary/10 hover:bg-primary/20 rounded-2xl transition-all group border border-primary/20 shadow-lg shadow-primary/5">
                    <Gift size={20} className="text-primary group-hover:scale-110 transition-all" />
                    <div className="text-[10px] font-black uppercase tracking-widest text-primary">Send Gift</div>
                 </button>
                 <button className="flex items-center justify-center gap-3 py-4 bg-white/5 hover:bg-primary text-white hover:text-black rounded-2xl transition-all group border border-white/5 hover:border-primary shadow-lg">
                    <TrendingUp size={20} className="group-hover:scale-110 transition-all" />
                    <div className="text-[10px] font-black uppercase tracking-widest">Promote</div>
                 </button>
              </div>
           </div>

           <div className="space-y-4">
              <button 
                onClick={() => {
                  if (window.confirm('Erase this transmission record?')) {
                    onDelete(post.id);
                    onClose();
                  }
                }}
                className="w-full py-4 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3"
              >
                <Trash2 size={16} /> Delete Forever
              </button>
              <div className="text-[8px] text-white/20 font-black uppercase tracking-[0.3em] text-center">Security ID: {post.id}</div>
           </div>
        </div>
      </div>
    </div>
  );
};

const Profile = () => {
    const { user, logout } = useAuth();
    const [myPosts, setMyPosts] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
    const [isGiftingOpen, setIsGiftingOpen] = useState(false);
    const [profileData, setProfileData] = useState({
        username: user.username || user.email?.split('@')[0],
        bio: user.bio || '',
        photo: user.photoUrl || null
    });
    const [credits, setCredits] = useState(100); // Mock credits for design
    const [isFollowing, setIsFollowing] = useState(false);

    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setProfileData(prev => ({ ...prev, photo: url }));
        }
    };

    useEffect(() => {
      const getPosts = async () => {
        if (user) {
          const allPosts = await fetchSocialPosts();
          const normalised = allPosts.map(p => ({
            ...p,
            userId: p.userId || p.user_id,
            videoUrl: p.videoUrl || p.video_url,
            fileName: p.fileName || p.file_name,
          }));
          setMyPosts(normalised.filter(p => p.userId === user.id));
        }
      };
      getPosts();
    }, [user]);

    if (!user) return <Navigate to="/signin" replace />;

    return (
       <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-8 relative z-10 min-h-screen">
          {/* UNIFIED COMMAND BOX - FACEBOOK STYLE */}
          <div className="premium-card p-0 overflow-hidden bg-white/5 border-white/10 shadow-2xl rounded-[3rem]">
             <div className="h-40 md:h-56 bg-gradient-to-r from-primary/40 via-orange-500/20 to-black relative">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-overlay" />
             </div>
             
             <div className="px-8 md:px-12 pb-12 -mt-16 relative flex flex-col md:flex-row items-end gap-8">
                <div className="relative group">
                    <div className="w-32 h-32 md:w-44 md:h-44 rounded-full bg-black border-[6px] border-black shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden flex items-center justify-center">
                        {profileData.photo ? (
                            <img src={profileData.photo} className="w-full h-full object-cover" alt="Profile" />
                        ) : (
                            <span className="text-primary font-black text-6xl uppercase">{(profileData.username || 'U').charAt(0)}</span>
                        )}
                    </div>
                    <button 
                        onClick={() => setIsEditProfileOpen(true)}
                        className="absolute bottom-2 right-2 p-3 bg-primary text-black rounded-full shadow-lg hover:scale-110 transition-all border-4 border-black"
                    >
                        <Edit2 size={16} />
                    </button>
                </div>

                <div className="flex-1 pb-4 space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic text-white drop-shadow-xl flex items-center gap-4">
                                @{profileData.username}
                                <Shield size={24} className="text-primary fill-primary animate-pulse" />
                            </h1>
                            <div className="flex items-center gap-6 mt-3">
                                <div className="flex items-center gap-2 text-primary font-black uppercase text-[10px] tracking-widest bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                                    <TrendingUp size={12} /> Elite Rank
                                </div>
                                <div className="flex items-center gap-2 text-white/40 font-black uppercase text-[10px] tracking-widest">
                                    <Users size={12} /> 4.9k Followers
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3">
                           <button 
                             onClick={() => setIsFollowing(!isFollowing)}
                             className={`px-8 py-3 rounded-full font-black uppercase tracking-widest text-[10px] transition-all flex items-center gap-2 border shadow-lg ${isFollowing ? 'bg-white/10 text-white border-white/20' : 'bg-primary text-black border-primary hover:scale-105'}`}
                           >
                             {isFollowing ? 'Following' : 'Connect Network'}
                           </button>
                           <button 
                             onClick={() => setIsGiftingOpen(true)}
                             className="px-8 py-3 bg-white/5 text-white border border-white/10 rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-primary hover:text-black hover:border-primary transition-all flex items-center gap-2"
                           >
                             <Gift size={14} /> Send Gift
                           </button>
                           <a 
                             href="https://buy.stripe.com/8x28wJ1nXejA6VTcUie7m00" 
                             target="_blank" 
                             rel="noopener noreferrer"
                             className="px-8 py-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-emerald-500 hover:text-black transition-all flex items-center gap-2"
                           >
                             <TrendingUp size={14} /> Top Up Credits
                           </a>
                        </div>
                    </div>

                    <div className="max-w-2xl">
                        <p className="text-white/70 font-medium leading-relaxed italic border-l-4 border-primary/30 pl-4 py-1">
                            {profileData.bio || 'Node signature awaiting transmission. Define your presence in the global network.'}
                        </p>
                    </div>
                </div>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             {/* NETWORK POWERS CARD */}
             <div className="premium-card p-8 bg-black/40 border-primary/20 shadow-[0_0_40px_rgba(255,153,0,0.05)] space-y-6 lg:col-span-1">
                <div className="flex items-center gap-4">
                   <div className="p-3 bg-primary/20 rounded-2xl text-primary"><Zap size={24} className="animate-pulse" /></div>
                   <h3 className="text-xl font-black uppercase tracking-tighter italic">Network Powers</h3>
                </div>
                <div className="space-y-4">
                   <button 
                     onClick={() => {
                       if (credits >= 500) {
                          setCredits(prev => prev - 500);
                          alert('Broadcast Boosted For 3 Hours! Returning to sector For You...');
                       } else {
                          alert('Insufficient credits for a Boost. Reload at the Network Hub.');
                       }
                     }}
                     className="w-full p-4 bg-primary/10 hover:bg-primary text-primary hover:text-black border border-primary/20 rounded-2xl transition-all flex items-center justify-between group"
                   >
                     <div className="text-left">
                        <p className="text-[10px] font-black uppercase tracking-widest leading-none">Boost Transmitter</p>
                        <p className="text-[8px] font-black uppercase opacity-60 group-hover:opacity-100">Top of For You (3 Hrs)</p>
                     </div>
                     <span className="text-xs font-black">500 CR</span>
                   </button>
                   <div className="p-4 bg-white/5 border border-white/5 rounded-2xl opacity-40 cursor-not-allowed flex items-center justify-between">
                     <div className="text-left">
                        <p className="text-[10px] font-black uppercase tracking-widest leading-none">Network Cloak</p>
                        <p className="text-[8px] font-black uppercase">Stealth browsing active (24H)</p>
                     </div>
                     <span className="text-xs font-black">2.5k CR</span>
                   </div>
                </div>
             </div>

             {/* RECEIVED GIFTS CARD */}
             <div className="premium-card p-8 bg-black/40 border-white/10 space-y-6 lg:col-span-2">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="p-3 bg-white/5 rounded-2xl text-white/40"><Gift size={24} /></div>
                      <h3 className="text-xl font-black uppercase tracking-tighter italic">Contributions Received</h3>
                   </div>
                   <div className="text-[10px] font-black uppercase tracking-widest text-primary">Influencer Score: 8.4k</div>
                </div>
                <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                   {[
                      { name: 'Crystal Heart', icon: 'crystal_heart', count: 12 },
                      { name: 'Digital Coin', icon: 'digital_coin', count: 5 },
                      { name: 'Power Bolt', icon: 'lightning_bolt', count: 1 },
                   ].map(gift => (
                      <div key={gift.name} className="flex-shrink-0 bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4 min-w-[160px]">
                         <img src={`/gifts/${gift.icon}.png`} className="w-10 h-10 object-contain drop-shadow-[0_0_10px_rgba(255,153,0,0.2)]" alt={gift.name} />
                         <div>
                            <p className="text-[8px] font-black uppercase text-white/40 leading-none">{gift.name}</p>
                            <p className="text-xl font-black text-white mt-1">x{gift.count}</p>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          </div>

          {/* VIDEO GRID - TIKTOK STYLE TILES */}
          {/* VIDEO GRID - TIKTOK STYLE TILES */}
          <div className="px-0 space-y-8">
             <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black uppercase tracking-tight italic flex items-center gap-4">
                  <Video size={24} className="text-primary" /> My Feed Vault
                </h2>
                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Archive Sector 7G</div>
             </div>

             <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {myPosts.length === 0 ? (
                   <div className="col-span-full text-center py-20 text-text-secondary font-black uppercase tracking-widest text-sm bg-white/5 rounded-3xl premium-card border-none">
                      You haven't transmitted any video logs yet.
                   </div>
                ) : (
                  myPosts.map(post => (
                     <div 
                        key={post.id} 
                        onClick={() => setSelectedPost(post)}
                        className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-black group border border-white/10 shadow-xl transition-all hover:border-primary/40 cursor-pointer"
                     >
                        {post.videoUrl.includes('youtube.com') || post.videoUrl.includes('youtu.be') ? (
                           <iframe src={post.videoUrl} className="w-[150%] h-[150%] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 object-cover pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity" />
                        ) : (
                           <video src={post.videoUrl} className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity" />
                        )}
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-4">
                           <div className="flex justify-between items-end gap-2">
                              {editingId === post.id ? (
                                <div className="flex-1 flex gap-2">
                                  <input 
                                    autoFocus
                                    className="bg-white/10 border border-white/20 rounded-lg px-2 py-1 text-[10px] text-white outline-none w-full"
                                    value={editValue}
                                    onChange={(e) => setEditValue(e.target.value)}
                                    onKeyDown={async (e) => {
                                      if (e.key === 'Enter') {
                                        await updateSocialPost(post.id, { description: editValue });
                                        setMyPosts(prev => prev.map(p => p.id === post.id ? { ...p, description: editValue } : p));
                                        setEditingId(null);
                                      }
                                    }}
                                  />
                                </div>
                              ) : (
                                <p className="text-[10px] text-white/80 line-clamp-2 font-medium flex-1">{post.description}</p>
                              )}
                              <div className="flex items-center gap-1 text-primary text-[10px] font-black"><Heart size={12} /> {post.likes || 0}</div>
                           </div>
                           
                           {/* OVERLAY CONTROLS - ALWAYS VISIBLE ON MOBILE, HOVER ON DESKTOP */}
                           <div className="absolute top-3 right-3 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity flex flex-col gap-2">
                             <button 
                               onClick={() => {
                                 setEditingId(editingId === post.id ? null : post.id);
                                 setEditValue(post.description);
                               }}
                               className="p-3 glass rounded-full text-white hover:bg-white/10 border border-white/10"
                               title="Edit Transcription"
                             >
                               {editingId === post.id ? <Check size={16} className="text-emerald-400" /> : <Edit2 size={16} />}
                             </button>
                             <button 
                               onClick={async (e) => {
                                 e.stopPropagation();
                                 if (window.confirm('Delete this video?')) {
                                   await deletePost(post.id);
                                   setMyPosts(prev => prev.filter(p => p.id !== post.id));
                                 }
                               }}
                               className="p-3 bg-red-500/80 md:bg-red-500 text-white rounded-full shadow-2xl hover:bg-red-600 transition-all border border-red-400/20"
                             >
                               <Trash2 size={16} />
                             </button>
                           </div>

                           {post.status === 'pending' && (
                             <div className="flex items-center justify-center gap-2 w-full mt-3 py-2 bg-orange-500/20 text-orange-400 text-[9px] font-black uppercase tracking-widest rounded-lg border border-orange-500/20 backdrop-blur-md">
                               <ShieldAlert size={12} /> Review Pending
                             </div>
                           )}
                        </div>
                     </div>
                  ))
                )}
             </div>
          </div>

          {/* EDIT PROFILE MODAL */}
          {isEditProfileOpen && (
            <div className="fixed inset-0 z-[600] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
              <div className="relative max-w-xl w-full glass rounded-[3rem] border border-white/10 p-10 space-y-8">
                <button onClick={() => setIsEditProfileOpen(false)} className="absolute top-8 right-8 text-white/40 hover:text-white transition-colors">
                  <Close size={24} />
                </button>
                <div>
                  <h2 className="text-3xl font-black uppercase tracking-tighter italic text-white mb-2 text-center">Studio Node Edit</h2>
                  <p className="text-text-secondary text-xs font-black uppercase tracking-widest text-center">Refine your network presence.</p>
                </div>

                <div className="flex flex-col items-center gap-6">
                   <div className="relative">
                      <div className="w-32 h-32 rounded-full border-4 border-primary/20 overflow-hidden bg-black flex items-center justify-center">
                         {profileData.photo ? (
                            <img src={profileData.photo} className="w-full h-full object-cover" alt="Preview" />
                         ) : (
                            <Users size={48} className="text-white/10" />
                         )}
                      </div>
                      <label className="absolute bottom-1 right-1 p-2.5 bg-primary text-black rounded-full cursor-pointer hover:scale-110 transition-all border-4 border-black shadow-lg">
                         <Upload size={14} />
                         <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                      </label>
                   </div>
                   <p className="text-[8px] font-black uppercase tracking-[0.2em] text-white/30 text-center">IMAGE AUTO-PROCESSED TO SQUARE RATIO</p>
                </div>

                <div className="space-y-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Broadcast Alias</label>
                      <input 
                         type="text" 
                         className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-primary transition-all font-bold"
                         value={profileData.username}
                         onChange={(e) => setProfileData(prev => ({ ...prev, username: e.target.value }))}
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Transmission Log (Bio)</label>
                      <textarea 
                         className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-primary transition-all font-bold min-h-[120px] resize-none text-sm"
                         value={profileData.bio}
                         onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                      />
                   </div>
                </div>

                <button 
                  onClick={() => setIsEditProfileOpen(false)}
                  className="btn-primary w-full py-5 text-sm tracking-[0.25em] font-black uppercase shadow-xl"
                >
                  Synchronize Data
                </button>
              </div>
            </div>
          )}

          {/* GIFTING MODAL */}
          {isGiftingOpen && (
            <div className="fixed inset-0 z-[600] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
              <div className="relative max-w-2xl w-full glass rounded-[3rem] border border-white/10 p-12 space-y-10 animate-in fade-in zoom-in duration-300">
                <button onClick={() => setIsGiftingOpen(false)} className="absolute top-10 right-10 text-white/40 hover:text-white">
                  <Close size={28} />
                </button>
                <div className="text-center space-y-2">
                  <h3 className="text-4xl font-black uppercase tracking-tighter italic text-white">Network Contributions</h3>
                  <p className="text-primary text-[10px] font-black uppercase tracking-[0.3em]">Reward Elite Contributors with Credits</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                   {[
                      { id: 1, name: 'Crystal Heart', cost: 50, icon: 'crystal_heart' },
                      { id: 2, name: 'Digital Coin', cost: 100, icon: 'digital_coin' },
                      { id: 3, name: 'Power Bolt', cost: 250, icon: 'lightning_bolt' },
                      { id: 4, name: 'Golden Star', cost: 500, icon: 'golden_star' }
                   ].map(gift => (
                      <button 
                        key={gift.id}
                        onClick={() => {
                           if (credits >= gift.cost) {
                              setCredits(prev => prev - gift.cost);
                              alert(`${gift.name} Sent Successfully!`);
                              setIsGiftingOpen(false);
                           } else {
                              alert('Insufficient Network Credits. Top up in your Profile.');
                           }
                        }}
                        className="group relative bg-white/5 border border-white/10 rounded-[2rem] p-6 hover:border-primary/40 hover:bg-white/10 transition-all flex flex-col items-center gap-4 overflow-hidden"
                      >
                         <div className="absolute inset-x-0 bottom-0 h-1 bg-primary/20 scale-x-0 group-hover:scale-x-100 transition-transform" />
                         <img src={`/gifts/${gift.icon}.png`} className="w-20 h-20 object-contain drop-shadow-[0_0_15px_rgba(255,153,0,0.3)] group-hover:scale-110 transition-transform" alt={gift.name} />
                         <div className="text-center">
                            <p className="text-[9px] font-black uppercase text-white/40 group-hover:text-primary transition-colors">{gift.name}</p>
                            <p className="text-sm font-black text-white mt-1">{gift.cost} CR</p>
                         </div>
                      </button>
                   ))}
                </div>

                <div className="p-6 bg-primary/5 border border-primary/20 rounded-3xl flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <TrendingUp size={20} className="text-primary" />
                      <div>
                         <p className="text-[10px] font-black uppercase text-white/60">Current Credit Balance</p>
                         <p className="text-xl font-black text-white">{credits} CR</p>
                      </div>
                   </div>
                   <a 
                      href="https://buy.stripe.com/8x28wJ1nXejA6VTcUie7m00" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-6 py-2 bg-primary text-black font-black uppercase tracking-widest text-[9px] rounded-full hover:scale-105 transition-all shadow-lg shadow-primary/20"
                   >
                     Reload Network Credits
                   </a>
                </div>
              </div>
            </div>
          )}
       </div>
    );
};

export default Profile;
