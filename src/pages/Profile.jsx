/* src/pages/Profile.jsx */
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchSocialPosts, deletePost } from '../lib/supabase';
import { Video, Heart, ShieldAlert, Trash2, Edit2, Upload, Shield, Gift, Zap, Share2, X as Close, Play, TrendingUp, Users } from 'lucide-react';
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
    const { user, logout, updateUser, spendCredits, currentCredits, isPostLiked, toggleLike } = useAuth();
    const [myPosts, setMyPosts] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
    const [isGiftingOpen, setIsGiftingOpen] = useState(false);
    const [editValue, setEditValue] = useState('');
    const [profileData, setProfileData] = useState({
        username: user?.username || user?.email?.split('@')[0] || 'Node_Pilot',
        bio: user?.bio || '',
        photo: user?.photoUrl || user?.photo || null,
        banner: user?.bannerUrl || user?.banner || null
    });
    const [credits, setCredits] = useState(currentCredits);
    const [isFollowing, setIsFollowing] = useState(false);
    const [activeTab, setActiveTab] = useState('videos');
    const [likeCounts, setLikeCounts] = useState({});
    const [giftSent, setGiftSent] = useState(null);

    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileData(prev => ({ ...prev, photo: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleBannerUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileData(prev => ({ ...prev, banner: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveProfile = () => {
        updateUser({
            username: profileData.username,
            bio: profileData.bio,
            photo: profileData.photo,
            banner: profileData.banner
        });
        setIsEditProfileOpen(false);
    };

    useEffect(() => {
      const getPosts = async () => {
        if (user?.id) {
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
       <div className="max-w-4xl mx-auto pb-32 relative z-10 min-h-screen bg-black/20 backdrop-blur-sm">
          {/* BANNER SECTION */}
          <div className="relative h-48 md:h-64 w-full overflow-hidden group">
             {profileData.banner ? (
                <img src={profileData.banner} className="w-full h-full object-cover" alt="Banner" />
             ) : (
                <div className="w-full h-full bg-gradient-to-r from-primary/20 via-black to-primary/10 flex items-center justify-center">
                   <Zap size={64} className="text-primary/10 animate-pulse" />
                </div>
             ) }
             <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
             
             <button 
                onClick={() => setIsEditProfileOpen(true)}
                className="absolute top-4 right-4 p-2.5 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full text-white/80 hover:text-white border border-white/10 transition-all opacity-0 group-hover:opacity-100"
             >
                <Edit2 size={16} />
             </button>
          </div>

          {/* PROFILE HEADER - TIKTOK STYLE COMPACT CENTERED */}
          <div className="px-4 md:px-8 -mt-12 md:-mt-16 pb-6 space-y-4 text-center">
             {/* Profile Pic */}
             <div className="relative shrink-0 mx-auto">
                <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-black p-[4px] shadow-2xl ring-4 ring-black/40 mx-auto">
                   <div className="w-full h-full rounded-full bg-neutral-900 overflow-hidden flex items-center justify-center border-2 border-white/5">
                      {profileData.photo ? (
                         <img src={profileData.photo} className="w-full h-full object-cover" alt="Profile" />
                      ) : (
                         <span className="text-primary font-black text-4xl md:text-5xl uppercase">{(profileData.username || 'U').charAt(0)}</span>
                      )}
                   </div>
                </div>
                <button 
                   onClick={() => setIsEditProfileOpen(true)}
                   className="absolute bottom-1 right-1/2 translate-x-1/2 md:right-1 md:translate-x-0 p-2.5 bg-primary text-black rounded-full shadow-xl hover:scale-110 transition-all border-4 border-black"
                >
                   <Edit2 size={12} />
                </button>
             </div>

             {/* Info & Buttons */}
             <div className="space-y-2">
                <h1 className="text-2xl md:text-3xl font-black tracking-tight flex items-center justify-center gap-2 text-white italic">
                   @{profileData.username}
                   <Shield size={20} className="text-primary fill-primary" />
                </h1>
                <p className="text-xs text-white/40 font-bold uppercase tracking-[0.2em]">Certified Digital Node</p>
                
                {/* STATS ROW COMPACT */}
                <div className="flex items-center justify-center gap-6 pt-2">
                   <div className="flex flex-col items-center gap-0.5">
                      <span className="text-sm md:text-base font-black text-white">47</span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Following</span>
                   </div>
                   <div className="flex flex-col items-center gap-0.5">
                      <span className="text-sm md:text-base font-black text-white">12.2k</span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Followers</span>
                   </div>
                   <div className="flex flex-col items-center gap-0.5">
                      <span className="text-sm md:text-base font-black text-white">8.4k</span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Likes</span>
                   </div>
                </div>
             </div>

             {/* Action Buttons */}
             <div className="flex items-center justify-center gap-2 pt-4">
                <button 
                   onClick={() => setIsEditProfileOpen(true)}
                   className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-black rounded-xl font-black uppercase tracking-widest text-[10px] transition-all shadow-lg shadow-primary/20"
                >
                   Edit Profile
                </button>
                <button 
                   className="p-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl font-black transition-all border border-white/10"
                >
                   <Share2 size={16} />
                </button>
             </div>

             {/* Bio */}
             <div className="max-w-xl mx-auto pt-4">
                <p className="text-white/70 text-sm md:text-base font-medium leading-relaxed">
                   {profileData.bio || 'Define your presence in the global network.'}
                </p>
             </div>
          </div>

          {/* CONTENT TABS - TIKTOK STYLE */}
          <div className="border-t border-white/5 mt-8">
             <div className="flex justify-center -mt-px">
                <div className="flex items-center gap-12 md:gap-20">
                   <button 
                    onClick={() => setActiveTab('videos')}
                    className={`flex items-center gap-2 py-4 border-t-2 font-black uppercase tracking-[0.2em] text-[10px] transition-all ${activeTab === 'videos' ? 'border-primary text-primary' : 'border-transparent text-white/30 hover:text-white/60'}`}
                   >
                      <Video size={14} /> Videos
                   </button>
                   <button 
                    onClick={() => setActiveTab('network')}
                    className={`flex items-center gap-2 py-4 border-t-2 font-black uppercase tracking-[0.2em] text-[10px] transition-all ${activeTab === 'network' ? 'border-primary text-primary' : 'border-transparent text-white/30 hover:text-white/60'}`}
                   >
                      <Zap size={14} /> Network
                   </button>
                   <button 
                    onClick={() => setActiveTab('liked')}
                    className={`flex items-center gap-2 py-4 border-t-2 font-black uppercase tracking-[0.2em] text-[10px] transition-all ${activeTab === 'liked' ? 'border-primary text-primary' : 'border-transparent text-white/30 hover:text-white/60'}`}
                   >
                      <Heart size={14} /> Liked
                   </button>
                </div>
             </div>
          </div>

          {/* TAB CONTENT */}
          <div className="pt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
             {activeTab === 'videos' && (
                <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-1 md:gap-4">
                   {myPosts.length === 0 ? (
                      <div className="col-span-full text-center py-20 text-white/20 font-black uppercase tracking-widest text-xs border border-white/5 rounded-3xl">
                         No transmissions in archive sector.
                      </div>
                   ) : (
                     myPosts.map(post => (
                        <div 
                           key={post.id} 
                           onClick={() => setSelectedPost(post)}
                           className="relative aspect-[9/16] rounded-none md:rounded-2xl overflow-hidden bg-black group transition-all cursor-pointer"
                        >
                           {post.videoUrl.includes('youtube.com') || post.videoUrl.includes('youtu.be') ? (
                              <div className="w-full h-full bg-white/5 flex items-center justify-center">
                                 <Play size={24} className="text-white/20" />
                              </div>
                           ) : (
                              <video src={post.videoUrl} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                           )}
                           
                           <div className="absolute bottom-2 left-2 flex items-center gap-1 text-white text-[10px] font-black drop-shadow-lg">
                              <Play size={10} fill="currentColor" /> {post.likes || 0}
                           </div>

                           {post.status === 'pending' && (
                              <div className="absolute top-2 right-2 p-1 bg-orange-500/80 rounded flex items-center gap-1 text-[8px] font-black uppercase">
                                <ShieldAlert size={8} /> Review
                              </div>
                           )}
                        </div>
                     ))
                   )}
                </div>
             )}

             {activeTab === 'network' && (
                <div className="space-y-8 animate-in fade-in duration-500">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* NETWORK POWERS */}
                      <div className="premium-card p-6 bg-white/5 space-y-6">
                         <div className="flex items-center gap-4">
                            <div className="p-3 bg-primary/20 rounded-2xl text-primary"><Zap size={24} /></div>
                            <h3 className="text-lg font-black uppercase">Network Powers</h3>
                         </div>
                         <div className="space-y-4">
                            <button 
                              onClick={() => {
                                if (credits >= 500) {
                                   setCredits(prev => prev - 500);
                                   alert('Broadcast Boosted! Transmission prioritizing active...');
                                } else {
                                   alert('Insufficient credits. Reload at the Hub.');
                                }
                              }}
                              className="w-full p-4 bg-primary/10 hover:bg-primary text-primary hover:text-black border border-primary/20 rounded-2xl transition-all flex items-center justify-between group"
                            >
                              <div className="text-left">
                                 <p className="text-[10px] font-black uppercase tracking-widest">Boost Transmitter</p>
                                 <p className="text-[8px] font-black uppercase opacity-60">Top of For You (3 Hrs)</p>
                              </div>
                              <span className="text-xs font-black">500 CR</span>
                            </button>
                            <div className="p-4 bg-white/5 border border-white/5 rounded-2xl opacity-40 cursor-not-allowed flex items-center justify-between">
                              <div className="text-left">
                                 <p className="text-[10px] font-black uppercase tracking-widest">Network Cloak</p>
                                 <p className="text-[8px] font-black uppercase">Stealth active (24H)</p>
                              </div>
                              <span className="text-xs font-black">2.5k CR</span>
                            </div>
                         </div>
                      </div>

                      {/* CONTRIBUTIONS */}
                      <div className="premium-card p-6 bg-white/5 space-y-6">
                         <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                               <div className="p-3 bg-white/10 rounded-2xl text-white/40"><Gift size={24} /></div>
                               <h3 className="text-lg font-black uppercase">Contributions</h3>
                            </div>
                            <div className="text-[9px] font-black tracking-widest text-primary">Score: 8.4k</div>
                         </div>
                         <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                            {[
                               { name: 'Crystal Heart', icon: 'crystal_heart', count: 12 },
                               { name: 'Digital Coin', icon: 'digital_coin', count: 5 },
                               { name: 'Power Bolt', icon: 'lightning_bolt', count: 1 },
                            ].map(gift => (
                               <div key={gift.name} className="flex-shrink-0 bg-black/40 border border-white/5 rounded-2xl p-4 flex items-center gap-3 min-w-[140px]">
                                  <img src={`/gifts/${gift.icon}.png`} className="w-8 h-8 object-contain" alt={gift.name} />
                                  <div>
                                     <p className="text-[8px] font-black uppercase text-white/40">{gift.name}</p>
                                     <p className="text-sm font-black text-white">x{gift.count}</p>
                                  </div>
                               </div>
                            ))}
                         </div>
                         <div className="pt-2">
                            <button 
                               onClick={() => setIsGiftingOpen(true)}
                               className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-black uppercase tracking-[0.2em] text-[9px] transition-all"
                            >
                               Open Gifting Terminal
                            </button>
                         </div>
                      </div>
                   </div>
                </div>
             )}

             {activeTab === 'liked' && (
                <div className="py-20 text-center">
                   <p className="text-white/20 font-black uppercase tracking-[0.3em] text-xs">No saved transmissions found.</p>
                </div>
             )}
          </div>

          {/* VIDEO MODAL */}
          <VideoModal 
            post={selectedPost} 
            isOpen={!!selectedPost} 
            onClose={() => setSelectedPost(null)} 
            onDelete={deletePost} 
          />

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

                 <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                    {/* PHOTO UPLOAD */}
                    <div className="space-y-4 flex flex-col items-center">
                       <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Avatar</label>
                       <div className="relative">
                          <div className="w-24 h-24 rounded-full border-4 border-primary/20 overflow-hidden bg-black flex items-center justify-center">
                             {profileData.photo ? (
                                <img src={profileData.photo} className="w-full h-full object-cover" alt="Preview" />
                             ) : (
                                <Users size={32} className="text-white/10" />
                             )}
                          </div>
                          <label className="absolute bottom-0 right-0 p-2 bg-primary text-black rounded-full cursor-pointer hover:scale-110 transition-all border-4 border-black">
                             <Upload size={12} />
                             <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                          </label>
                       </div>
                    </div>

                    {/* BANNER UPLOAD */}
                    <div className="flex-1 w-full space-y-4 flex flex-col items-center md:items-start">
                       <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Profile Banner</label>
                       <div className="relative w-full h-24 rounded-2xl border-2 border-dashed border-white/10 overflow-hidden bg-white/5 flex items-center justify-center group">
                          {profileData.banner ? (
                             <img src={profileData.banner} className="w-full h-full object-cover" alt="Banner Preview" />
                          ) : (
                             <div className="flex flex-col items-center gap-2 text-white/20">
                                <Upload size={20} />
                                <span className="text-[8px] font-black uppercase tracking-widest">Select Banner</span>
                             </div>
                          )}
                          <label className="absolute inset-0 cursor-pointer flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                             <Upload size={24} className="text-white" />
                             <input type="file" accept="image/*" className="hidden" onChange={handleBannerUpload} />
                          </label>
                       </div>
                    </div>
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
                          className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-primary transition-all font-bold min-h-[100px] resize-none text-sm"
                          value={profileData.bio}
                          onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                       />
                    </div>
                 </div>

                 <button 
                   onClick={handleSaveProfile}
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
                {giftSent ? (
                  <div className="text-center py-10 space-y-4 animate-in zoom-in duration-300">
                    <div className="text-6xl">{giftSent.emoji}</div>
                    <h3 className="text-3xl font-black text-white uppercase">{giftSent.name} Sent!</h3>
                    <p className="text-primary font-black text-sm uppercase tracking-widest">Remaining: {currentCredits} CR</p>
                  </div>
                ) : (
                  <>
                    <div className="text-center space-y-2">
                      <h3 className="text-4xl font-black uppercase tracking-tighter italic text-white">Network Contributions</h3>
                      <p className="text-primary text-[10px] font-black uppercase tracking-[0.3em]">Reward Elite Contributors with Credits</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                       {[
                          { id: 1, name: 'Crystal Heart', cost: 50, emoji: '💎' },
                          { id: 2, name: 'Digital Coin', cost: 100, emoji: '🪙' },
                          { id: 3, name: 'Power Bolt', cost: 250, emoji: '⚡' },
                          { id: 4, name: 'Golden Star', cost: 500, emoji: '⭐' }
                       ].map(gift => (
                          <button 
                            key={gift.id}
                            onClick={() => {
                               const ok = spendCredits(gift.cost);
                               if (ok) {
                                 setGiftSent(gift);
                                 setTimeout(() => { setGiftSent(null); setIsGiftingOpen(false); }, 1800);
                               }
                            }}
                            className="group relative bg-white/5 border border-white/10 rounded-[2rem] p-6 hover:border-primary/40 hover:bg-white/10 transition-all flex flex-col items-center gap-4 overflow-hidden"
                          >
                             <div className="absolute inset-x-0 bottom-0 h-1 bg-primary/20 scale-x-0 group-hover:scale-x-100 transition-transform" />
                             <span className="text-5xl group-hover:scale-110 transition-transform">{gift.emoji}</span>
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
                             <p className="text-xl font-black text-white">{currentCredits} CR</p>
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
                  </>
                )}
              </div>
            </div>
          )}
       </div>
    );
};

export default Profile;
