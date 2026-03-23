/* src/pages/Profile.jsx */
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchSocialPosts, deletePost, updateSocialPost } from '../lib/supabase';
import { Video, Heart, LogOut, ShieldAlert, Trash2, Edit2, Check, Upload, Shield } from 'lucide-react';
import UploadModal from '../components/UploadModal';

const Profile = () => {
    const { user, logout } = useAuth();
    const [myPosts, setMyPosts] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editValue, setEditValue] = useState('');
    const [isUploadOpen, setIsUploadOpen] = useState(false);

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
       <div className="max-w-5xl mx-auto px-0 md:px-6 py-10 space-y-12 relative z-10 min-h-[calc(100vh-80px)]">
          {/* COVER PHOTO AREA - FACEBOOK STYLE */}
          <div className="relative h-48 md:h-64 rounded-b-[3rem] overflow-hidden -mt-10 mx-0 group shadow-2xl border-x border-b border-white/5">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-black to-black opacity-90" />
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay" />
            
            <div className="absolute bottom-8 left-8 md:left-12 flex items-end gap-6 z-20">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-black flex flex-col justify-center items-center text-primary font-black text-4xl uppercase border-4 border-primary/20 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
                 {(user.username || user.email || 'U').charAt(0)}
              </div>
              <div className="hidden md:block pb-2">
                <h1 className="text-4xl font-black uppercase tracking-tighter italic text-white drop-shadow-lg">@{user.username || user.email?.split('@')[0]}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <Shield size={14} className="text-primary fill-primary" />
                  <span className="text-[10px] font-black uppercase text-primary tracking-widest">Network Verified Elite</span>
                </div>
              </div>
            </div>
          </div>

          {/* SOCIAL STATS CARD */}
          <div className="premium-card p-8 md:p-12 bg-white/5 border-white/10 relative -mt-16 z-20 mx-4 md:mx-0">
             <div className="md:pl-44 space-y-6">
                 {/* Mobile Name Display */}
                 <div className="md:hidden text-center mb-6">
                    <h1 className="text-4xl font-black uppercase tracking-tighter italic text-white drop-shadow-lg">@{user.username || user.email?.split('@')[0]}</h1>
                    <div className="flex justify-center items-center gap-2 mt-1">
                      <Shield size={14} className="text-primary fill-primary" />
                      <span className="text-[10px] font-black uppercase text-primary tracking-widest">Verified elite</span>
                    </div>
                 </div>

                 <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-y border-white/5">
                    <div className="text-center md:text-left">
                      <div className="text-2xl font-black text-white">{myPosts.length}</div>
                      <div className="text-[10px] uppercase font-black text-text-secondary tracking-widest">Post History</div>
                    </div>
                    <div className="text-center md:text-left">
                      <div className="text-2xl font-black text-white">
                         {myPosts.reduce((acc, curr) => acc + (curr.likes || 0), 0)}
                      </div>
                      <div className="text-[10px] uppercase font-black text-text-secondary tracking-widest">Network Impact</div>
                    </div>
                    <div className="text-center md:text-left">
                      <div className="text-2xl font-black text-white">4.9k</div>
                      <div className="text-[10px] uppercase font-black text-text-secondary tracking-widest">Subscribers</div>
                    </div>
                    <div className="text-center md:text-left">
                      <div className="text-2xl font-black text-white">Elite</div>
                      <div className="text-[10px] uppercase font-black text-text-secondary tracking-widest">Global Rank</div>
                    </div>
                 </div>

                 <p className="text-white/60 font-medium text-sm leading-relaxed max-w-2xl">{user.bio || 'This transmission node is currently awaiting your personal biography input. Define your role in the network.'}</p>
                 
                 <div className="flex flex-wrap gap-4 mt-6">
                    <button 
                      onClick={() => setIsUploadOpen(true)}
                      className="px-8 py-3 bg-primary text-black font-black uppercase tracking-widest text-[10px] rounded-full hover:scale-105 transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
                    >
                      <Upload size={14} /> New Production
                    </button>
                    <button onClick={logout} className="px-8 py-3 bg-red-500/10 text-red-500 border border-red-500/20 text-[10px] font-black uppercase rounded-full hover:bg-red-500/20 transition-all flex items-center gap-2">
                      <LogOut size={14} /> Terminal Exit
                    </button>
                 </div>
             </div>
          </div>

          {/* VIDEO GRID - TIKTOK STYLE TILES */}
          <div className="px-4 md:px-0 space-y-8">
             <h2 className="text-2xl font-black uppercase tracking-tight italic flex items-center gap-4">
               <Video size={24} className="text-primary" /> My Feed Vault
             </h2>

             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {myPosts.length === 0 ? (
                   <div className="col-span-full text-center py-20 text-text-secondary font-black uppercase tracking-widest text-sm bg-white/5 rounded-3xl premium-card border-none">
                      You haven't transmitted any video logs yet.
                   </div>
                ) : (
                  myPosts.map(post => (
                     <div key={post.id} className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-black group border border-white/10 shadow-xl transition-all hover:border-primary/40">
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

          <UploadModal 
            isOpen={isUploadOpen} 
            onClose={() => setIsUploadOpen(false)} 
            user={user} 
            onUploadSuccess={(newPost) => setMyPosts([newPost, ...myPosts])}
          />

          {/* Floating Action Button (Mobile) */}
          <button 
            onClick={() => setIsUploadOpen(true)}
            className="fixed bottom-24 right-6 md:hidden z-[200] w-14 h-14 bg-primary text-black rounded-full shadow-[0_0_30px_rgba(255,153,0,0.5)] flex items-center justify-center scale-110 active:scale-95 transition-all"
          >
            <Upload size={24} />
          </button>
       </div>
    );
};

export default Profile;
