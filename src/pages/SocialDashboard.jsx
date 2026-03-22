import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Heart, MessageCircle, Share2, Target, Users, Globe, Building2, Upload } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { mockDB, saveToMockSocialPosts } from '../lib/supabase';

const TABS = [
  { id: 'foryou', label: 'For You', icon: Target },
  { id: 'following', label: 'Following', icon: Users },
  { id: 'discover', label: 'Discover', icon: Globe },
  { id: 'biggames', label: 'Big Games', icon: Building2 }
];

const SocialDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('foryou');
  const [posts, setPosts] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    // In a real app we would subscribe, here we just load.
    const allPosts = mockDB.socialPosts || [];
    // Only show approved posts unless admin
    setPosts(allPosts.filter(p => p.status === 'approved' || p.userId === user?.id));
  }, [user]);

  if (!user) return <Navigate to="/signin" replace />;

  const handlePost = (e) => {
    e.preventDefault();
    if(!videoUrl) return;

    const newPost = {
      id: 'p' + Date.now(),
      userId: user.id,
      username: user.username,
      videoUrl: videoUrl,
      description: description,
      status: 'pending', // Requires admin review
      likes: 0,
      comments: 0,
      created_at: new Date().toISOString(),
      tab: activeTab
    };

    const updated = [newPost, ...mockDB.socialPosts];
    saveToMockSocialPosts(updated);
    setPosts([newPost, ...posts]);
    setIsUploading(false);
    setVideoUrl('');
    setDescription('');
  };

  return (
    <div className="max-w-7xl mx-auto px-0 md:px-6 relative h-[calc(100vh-80px)] md:h-[calc(100vh-96px)] flex">
      {/* Sidebar Navigation for Social */}
      <div className="hidden lg:flex w-64 flex-col gap-4 py-8 pr-8 border-r border-white/10">
         <button onClick={() => setIsUploading(true)} className="btn-primary w-full py-4 uppercase font-black flex items-center justify-center gap-3 shadow-xl mb-4">
            <Upload size={18} /> Upload Video
         </button>
         
         {TABS.map(tab => {
           const Icon = tab.icon;
           return (
             <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id)}
               className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-primary text-black' : 'text-white/50 hover:bg-white/5 hover:text-white'}`}
             >
               <Icon size={20} />
               {tab.label}
             </button>
           )
         })}
      </div>

      {/* Main Feed */}
      <div className="flex-1 flex flex-col relative bg-black">
        {/* Mobile Tabs */}
        <div className="lg:hidden flex items-center justify-between px-4 py-4 absolute top-0 w-full z-20 bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm">
           <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
             {TABS.slice(0, 3).map(tab => (
               <button
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id)}
                 className={`text-[11px] whitespace-nowrap font-black uppercase tracking-widest px-4 py-2 rounded-full ${activeTab === tab.id ? 'bg-primary text-black' : 'text-white/50 bg-white/5'}`}
               >
                 {tab.label}
               </button>
             ))}
           </div>
           <button onClick={() => setIsUploading(true)} className="p-2 bg-primary text-black rounded-full ml-2">
             <Upload size={16} />
           </button>
        </div>

        {/* Feed Container (Snap Scrolling) */}
        <div className="flex-1 overflow-y-scroll snap-y snap-mandatory relative z-10 no-scrollbar">
           {posts.length === 0 ? (
             <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
               <div className="p-6 bg-white/5 rounded-full text-white/20 mb-4"><Upload size={48} /></div>
               <h2 className="text-3xl font-black italic uppercase text-white/50">The Void is Empty</h2>
               <p className="text-text-secondary">Be the first to upload a transmission.</p>
             </div>
           ) : (
             posts.map(post => (
               <div key={post.id} className="h-full w-full snap-start relative bg-black flex items-center justify-center">
                  <div className="relative w-full max-w-md h-full md:h-[90%] md:rounded-[2rem] overflow-hidden bg-white/5 shadow-2xl">
                     {post.videoUrl.includes('youtube.com') || post.videoUrl.includes('youtu.be') ? (
                       <iframe 
                         src={post.videoUrl + '?autoplay=1&mute=1&loop=1&playlist=' + post.videoUrl.split('/').pop()}
                         className="w-[150%] h-[150%] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 object-cover pointer-events-none"
                         frameBorder="0"
                         allow="autoplay; encrypted-media"
                         allowFullScreen
                       />
                     ) : (
                       <video 
                         src={post.videoUrl} 
                         className="w-full h-full object-cover" 
                         autoPlay 
                         muted 
                         loop 
                         playsInline 
                       />
                     )}
                     
                     {/* Overlay info */}
                     <div className="absolute bottom-0 w-full p-6 md:p-8 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
                        <div className="flex justify-between items-end">
                          <div className="space-y-4 max-w-[80%]">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-black uppercase">{(post.username || 'U').charAt(0)}</div>
                              <span className="font-black text-white text-lg drop-shadow-md">@{post.username || 'user'}</span>
                              {post.status === 'pending' && <span className="bg-orange-500/20 text-orange-400 text-[9px] px-2 py-1 rounded uppercase tracking-widest font-black border border-orange-500/30">Pending Review</span>}
                            </div>
                            <p className="text-sm font-medium text-white drop-shadow-md leading-relaxed">
                              {post.description}
                            </p>
                          </div>
                          
                          <div className="flex flex-col gap-6 items-center">
                            <button className="flex flex-col items-center gap-1 group">
                               <div className="p-3 rounded-full bg-black/40 backdrop-blur-md group-hover:bg-primary/20 transition-all text-white"><Heart size={24} className="group-hover:text-primary transition-colors" /></div>
                               <span className="text-xs font-black">{post.likes}</span>
                            </button>
                            <button className="flex flex-col items-center gap-1 group">
                               <div className="p-3 rounded-full bg-black/40 backdrop-blur-md group-hover:bg-primary/20 transition-all text-white"><MessageCircle size={24} className="group-hover:text-primary transition-colors" /></div>
                               <span className="text-xs font-black">{post.comments}</span>
                            </button>
                            <button className="flex flex-col items-center gap-1 group">
                               <div className="p-3 rounded-full bg-black/40 backdrop-blur-md group-hover:bg-primary/20 transition-all text-white"><Share2 size={24} className="group-hover:text-primary transition-colors" /></div>
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

      {/* Upload Modal */}
      {isUploading && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="premium-card max-w-lg w-full p-8 relative">
            <button onClick={() => setIsUploading(false)} className="absolute top-4 right-4 text-white/50 hover:text-white">✕</button>
            <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-6">Transmit Video</h3>
            
            <form onSubmit={handlePost} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-text-secondary uppercase tracking-widest ml-1">Video URL (YouTube/MP4)</label>
                <input 
                  type="url" 
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://" 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-primary transition-all font-bold"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-text-secondary uppercase tracking-widest ml-1">Transmission Description</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add your intel..." 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-primary transition-all font-bold min-h-[100px]"
                  required
                />
              </div>
              <button type="submit" className="btn-primary w-full py-4 text-sm tracking-widest uppercase font-black">
                Submit for Security Review
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialDashboard;
