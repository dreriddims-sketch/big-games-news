import React, { useState, useEffect, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { Heart, MessageCircle, Share2, Target, Users, Globe, Building2, Upload, Film, Link2, X, Play } from 'lucide-react';
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
  const [uploadMode, setUploadMode] = useState('file'); // 'file' | 'url'
  const [videoUrl, setVideoUrl] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [videoBlobUrl, setVideoBlobUrl] = useState(null);
  const [description, setDescription] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const allPosts = mockDB.socialPosts || [];
    setPosts(allPosts.filter(p => p.status === 'approved' || p.userId === user?.id));
  }, [user]);

  useEffect(() => {
    if (!isUploading && videoBlobUrl) {
      URL.revokeObjectURL(videoBlobUrl);
      setVideoBlobUrl(null);
      setVideoFile(null);
    }
  }, [isUploading]);

  if (!user) return <Navigate to="/signin" replace />;

  const handleFileSelect = (file) => {
    if (!file || !file.type.startsWith('video/')) {
      alert('Please select a valid video file (MP4, MOV, WebM).');
      return;
    }
    if (file.size > 500 * 1024 * 1024) {
      alert('File must be under 500MB.');
      return;
    }
    if (videoBlobUrl) URL.revokeObjectURL(videoBlobUrl);
    const blobUrl = URL.createObjectURL(file);
    setVideoFile(file);
    setVideoBlobUrl(blobUrl);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handlePost = (e) => {
    e.preventDefault();
    const finalUrl = uploadMode === 'file' ? videoBlobUrl : videoUrl;
    if (!finalUrl) return;

    const newPost = {
      id: 'p' + Date.now(),
      userId: user.id,
      username: user.username,
      videoUrl: finalUrl,
      description,
      status: 'pending',
      likes: 0,
      comments: 0,
      created_at: new Date().toISOString(),
      tab: activeTab,
      isLocalFile: uploadMode === 'file',
      fileName: videoFile?.name || null
    };

    const updated = [newPost, ...mockDB.socialPosts];
    saveToMockSocialPosts(updated);
    setPosts([newPost, ...posts]);
    closeModal();
  };

  const closeModal = () => {
    setIsUploading(false);
    setVideoUrl('');
    setDescription('');
    setVideoFile(null);
    setUploadMode('file');
  };

  return (
    <div className="max-w-7xl mx-auto px-0 md:px-6 relative h-[calc(100vh-80px)] md:h-[calc(100vh-96px)] flex">
      {/* Sidebar */}
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
          );
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

        {/* Feed */}
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
                    <video src={post.videoUrl} className="w-full h-full object-cover" autoPlay muted loop playsInline />
                  )}
                  <div className="absolute bottom-0 w-full p-6 md:p-8 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
                    <div className="flex justify-between items-end">
                      <div className="space-y-4 max-w-[80%]">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-black uppercase">{(post.username || 'U').charAt(0)}</div>
                          <span className="font-black text-white text-lg drop-shadow-md">@{post.username || 'user'}</span>
                          {post.status === 'pending' && <span className="bg-orange-500/20 text-orange-400 text-[9px] px-2 py-1 rounded uppercase tracking-widest font-black border border-orange-500/30">Pending Review</span>}
                        </div>
                        <p className="text-sm font-medium text-white drop-shadow-md leading-relaxed">{post.description}</p>
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
          <div className="premium-card max-w-lg w-full p-8 relative space-y-6 max-h-[90vh] overflow-y-auto">
            <button onClick={closeModal} className="absolute top-4 right-4 p-2 glass rounded-full hover:bg-white/10 transition-colors text-white/60 hover:text-white">
              <X size={18} />
            </button>

            <div>
              <h3 className="text-2xl font-black uppercase italic tracking-tighter">Transmit Video</h3>
              <p className="text-text-secondary text-xs mt-1 uppercase tracking-widest font-bold">Select a source for your transmission</p>
            </div>

            {/* Mode Switcher */}
            <div className="flex gap-2 p-1 bg-white/5 rounded-2xl">
              <button
                type="button"
                onClick={() => { setUploadMode('file'); setVideoUrl(''); }}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black uppercase text-xs tracking-widest transition-all ${uploadMode === 'file' ? 'bg-primary text-black' : 'text-white/50 hover:text-white'}`}
              >
                <Film size={14} /> Upload File
              </button>
              <button
                type="button"
                onClick={() => {
                  setUploadMode('url');
                  setVideoFile(null);
                  if (videoBlobUrl) { URL.revokeObjectURL(videoBlobUrl); setVideoBlobUrl(null); }
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black uppercase text-xs tracking-widest transition-all ${uploadMode === 'url' ? 'bg-primary text-black' : 'text-white/50 hover:text-white'}`}
              >
                <Link2 size={14} /> Paste URL
              </button>
            </div>

            <form onSubmit={handlePost} className="space-y-5">
              {uploadMode === 'file' ? (
                <div className="space-y-2">
                  <label className="text-xs font-black text-text-secondary uppercase tracking-widest ml-1">Video File</label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                      isDragging ? 'border-primary bg-primary/10 scale-[1.02]'
                      : videoBlobUrl ? 'border-emerald-500/40 bg-emerald-500/5'
                      : 'border-white/10 hover:border-primary/40 hover:bg-white/5'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="video/mp4,video/mov,video/quicktime,video/webm,video/avi"
                      className="hidden"
                      onChange={(e) => handleFileSelect(e.target.files[0])}
                    />
                    {videoBlobUrl ? (
                      <div className="space-y-3">
                        <video src={videoBlobUrl} className="w-full max-h-32 rounded-xl object-cover mx-auto" muted />
                        <div className="text-emerald-400 font-black uppercase text-xs tracking-widest">✓ {videoFile?.name}</div>
                        <div className="text-white/30 text-xs">{(videoFile?.size / 1024 / 1024).toFixed(1)} MB · Click to change</div>
                      </div>
                    ) : (
                      <div className="space-y-3 pointer-events-none">
                        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto text-white/20">
                          <Upload size={28} />
                        </div>
                        <div>
                          <p className="font-black uppercase text-white/80 text-sm">Drop video here or click to browse</p>
                          <p className="text-text-secondary text-xs mt-1">MP4 · MOV · WebM · Max 500MB</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="text-xs font-black text-text-secondary uppercase tracking-widest ml-1">Video URL</label>
                  <input
                    type="url"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://youtube.com/... or https://example.com/video.mp4"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-primary transition-all font-bold text-sm"
                    required={uploadMode === 'url'}
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-black text-text-secondary uppercase tracking-widest ml-1">Transmission Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add your intel..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-primary transition-all font-bold min-h-[80px] text-sm resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={uploadMode === 'file' ? !videoBlobUrl : !videoUrl}
                className="btn-primary w-full py-4 text-sm tracking-widest uppercase font-black disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                <Play size={16} /> Submit for Security Review
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialDashboard;
