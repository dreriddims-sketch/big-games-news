import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchSocialPosts, deletePost, updateSocialPost } from '../lib/supabase';
import { Video, Heart, LogOut, ShieldAlert, Trash2, Edit2, Check, X as Close } from 'lucide-react';

const Profile = () => {
   const { user, logout } = useAuth();
   const [myPosts, setMyPosts] = useState([]);
   const [editingId, setEditingId] = useState(null);
   const [editValue, setEditValue] = useState('');

   useEffect(() => {
     const getPosts = async () => {
       if (user) {
         const allPosts = await fetchSocialPosts();
         // Normalise field names (Supabase uses snake_case)
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
      <div className="max-w-5xl mx-auto px-6 py-20 space-y-12 relative z-10 min-h-[calc(100vh-80px)]">
         <div className="premium-card p-12 bg-white/5 border-white/10 flex flex-col md:flex-row items-center gap-10">
            <div className="w-32 h-32 rounded-full bg-primary/20 flex flex-col justify-center items-center text-primary font-black text-4xl uppercase border-2 border-primary/40 shadow-[0_0_30px_rgba(255,153,0,0.3)]">
               {(user.username || user.email || 'U').charAt(0)}
            </div>
            <div className="flex-1 space-y-4 text-center md:text-left">
               <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic">@{user.username || user.email?.split('@')[0] || 'citizen'}</h1>
               <div className="flex items-center gap-4 justify-center md:justify-start">
                  <span className="text-xs uppercase font-black text-text-secondary tracking-widest">{user.email}</span>
                  <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] rounded-full uppercase tracking-widest font-black">
                    Verified User
                  </span>
               </div>
               <p className="text-white/60 font-medium">{user.bio || 'New citizen of the network.'}</p>
               
               <div className="flex gap-6 mt-6 pt-6 border-t border-white/10 justify-center md:justify-start">
                  <div className="text-center">
                    <div className="text-2xl font-black text-white">{myPosts.length}</div>
                    <div className="text-[10px] uppercase font-black text-text-secondary tracking-widest">Transmissions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-black text-white">
                      {myPosts.reduce((acc, curr) => acc + (curr.likes || 0), 0)}
                    </div>
                    <div className="text-[10px] uppercase font-black text-text-secondary tracking-widest">Total Likes</div>
                  </div>
               </div>
            </div>
            <div className="mt-6 md:mt-0 flex flex-col gap-4 w-full md:w-auto">
               <button onClick={logout} className="btn-secondary flex items-center justify-center gap-3 py-4 bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20">
                 <LogOut size={16} /> Sign Out
               </button>
            </div>
         </div>

         <div className="space-y-8">
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
                    <div key={post.id} className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-black group border border-white/10 shadow-xl transition-all hover:border-primary/30">
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
      </div>
   );
};

export default Profile;
