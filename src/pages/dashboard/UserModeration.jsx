import React, { useState, useEffect } from 'react';
import { User, Video, ShieldAlert, Trash2, CheckCircle, Play, X, Eye, RefreshCw, Cpu, ShieldCheck, AlertTriangle, Zap } from 'lucide-react';
import { fetchSocialPosts, updatePostStatus, deletePost, saveToMockUsers } from '../../lib/supabase';
import { mockDB } from '../../lib/supabase';
import { autoModerate } from '../../lib/moderation';

const VideoPreview = ({ post, onClose }) => (
  <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4" onClick={onClose}>
    <div className="relative max-w-md w-full" onClick={(e) => e.stopPropagation()}>
      <button onClick={onClose} className="absolute -top-12 right-0 text-white/60 hover:text-white flex items-center gap-2 font-black uppercase text-xs tracking-widest">
        <X size={16} /> Close Preview
      </button>
      <div className="rounded-3xl overflow-hidden bg-white/5 border border-white/10 shadow-2xl aspect-[9/16]">
        {post.videoUrl?.includes('youtube.com') || post.videoUrl?.includes('youtu.be') ? (
          <iframe
            src={(post.videoUrl || '').replace('watch?v=', 'embed/') + '?autoplay=1&mute=0'}
            className="w-full h-full"
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        ) : post.videoUrl.startsWith('blob:') ? (
          <div className="w-full h-full flex flex-col items-center justify-center text-center p-8 space-y-4 bg-black/60">
            <div className="w-16 h-16 rounded-2xl bg-red-500/20 flex items-center justify-center text-red-500">
              <ShieldAlert size={32} />
            </div>
            <div className="space-y-2">
              <p className="font-black uppercase text-white text-sm">Broken Transmission</p>
              <p className="text-text-secondary text-xs leading-relaxed px-4">
                This transmission was captured as a local session blob and has expired, or the source file was never reached in the cloud (Supabase Storage).
              </p>
              <p className="text-red-500 text-xs font-black uppercase tracking-widest mt-2">
                Status: Cloud Storage Missing
              </p>
            </div>
          </div>
        ) : (
          <video src={post.videoUrl} className="w-full h-full object-cover" controls autoPlay />
        )}
      </div>
      <div className="mt-4 glass rounded-2xl p-4 border-white/10 space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-black text-xs">
            {(post.username || 'U').charAt(0)}
          </div>
          <span className="font-black text-white text-sm">@{post.username}</span>
          <span className="text-text-secondary text-xs ml-auto">{new Date(post.created_at).toLocaleDateString()}</span>
        </div>
        <p className="text-sm text-white/80 italic leading-relaxed">"{post.description}"</p>
      </div>
    </div>
  </div>
);

const UserModeration = () => {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [previewPost, setPreviewPost] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isAIBusy, setIsAIBusy] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    // Users still from localStorage (they register client-side)
    const lsUsers = JSON.parse(localStorage.getItem('bg_users') || '[]');
    setUsers(lsUsers.length > 0 ? lsUsers : mockDB.users);

    // Posts from real Supabase (cross-browser)
    const allPosts = await fetchSocialPosts();
    const normalised = allPosts.map(p => ({
      ...p,
      userId: p.userId || p.user_id,
      videoUrl: p.videoUrl || p.video_url,
      fileName: p.fileName || p.file_name,
    }));
    setPosts(normalised);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApprove = async (id) => {
    const { data, error } = await updatePostStatus(id, 'approved');
    
    if (error) {
      alert("Authorization Failed: " + (error.message || JSON.stringify(error)));
    } else if (!data || data.length === 0) {
      alert("Target Trace Lost: Could not find transmission " + id + " in the network database. Verify ID type and RLS permissions.");
    } else {
      // Local update for instant response, then reload to be sure
      setPosts(prev => prev.map(p => (String(p.id) === String(id) || p.id === id) ? { ...p, status: 'approved' } : p));
      await loadData();
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Retract this transmission from the network?")) return;
    const { error } = await deletePost(id);
    if (error) {
      alert("Retraction Failed: " + (error.message || JSON.stringify(error)));
    } else {
      setPosts(prev => prev.filter(p => String(p.id) !== String(id) && p.id !== id));
      if (previewPost && (String(previewPost.id) === String(id) || previewPost.id === id)) setPreviewPost(null);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("CRITICAL: Proceed with absolute deletion of this identity and all associated content?")) return;
    const updatedUsers = users.filter(u => String(u.id) !== String(id) && u.id !== id);
    setUsers(updatedUsers);
    saveToMockUsers(updatedUsers);
    
    // Cascade delete their posts from Supabase
    const userPosts = posts.filter(p => String(p.userId) === String(id) || p.userId === id);
    for (const p of userPosts) {
      await deletePost(p.id);
    }
    setPosts(prev => prev.filter(p => String(p.userId) !== String(id) && p.userId !== id));
  };

  const handleBulkModerate = async () => {
    setIsAIBusy(true);
    const pending = posts.filter(p => p.status === 'pending');
    const results = await autoModerate(pending);

    for (const result of results) {
      if (result.status === 'approved' || result.status === 'active') {
        const finalStatus = 'approved';
        await updatePostStatus(result.id, finalStatus, result.ai_moderation_score);
      } else if (result.status === 'rejected') {
        await updatePostStatus(result.id, 'rejected', result.ai_moderation_score);
      }
    }
    await loadData(); // Reload all data to reflect changes
    setIsAIBusy(false);
  };

  const pendingPosts = posts.filter(p => p.status === 'pending');
  const approvedPosts = posts.filter(p => p.status === 'approved' || p.status === 'active');

  const PostCard = ({ post, showApprove = false }) => (
    <div className="premium-card p-0 flex flex-col bg-white/5 overflow-hidden border-white/10 hover:border-primary/20 transition-all">
      {/* Video Thumbnail / Preview Area */}
      <div
        className="relative aspect-[9/16] max-h-64 bg-black/60 cursor-pointer group flex items-center justify-center"
        onClick={() => setPreviewPost(post)}
      >
        {post.videoUrl?.startsWith('blob:') ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/20 flex items-center justify-center text-orange-400">
              <Video size={24} />
            </div>
            <p className="text-orange-400 font-black uppercase text-[9px] tracking-widest">Local File</p>
            {post.fileName && <p className="text-white/30 text-[9px] break-all">{post.fileName}</p>}
          </div>
        ) : (post.videoUrl?.includes('youtube.com') || post.videoUrl?.includes('youtu.be')) ? (
          <div className="absolute inset-0">
            <img
              src={`https://img.youtube.com/vi/${post.videoUrl.split('v=')[1]?.split('&')[0] || post.videoUrl.split('/').pop()}/mqdefault.jpg`}
              className="w-full h-full object-cover brightness-[0.6]"
              onError={(e) => { e.target.style.display = 'none'; }}
              alt="thumbnail"
            />
          </div>
        ) : (
          <video src={post.videoUrl} className="absolute inset-0 w-full h-full object-cover brightness-[0.6]" preload="metadata" />
        )}

        {/* Play overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
          <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-2xl shadow-primary/40">
            <Play size={20} className="text-black ml-1" fill="black" />
          </div>
        </div>

        {showApprove ? (
          <div className="absolute top-3 left-3 bg-orange-500/20 text-orange-400 text-[8px] px-2 py-1 rounded-full border border-orange-500/30 uppercase font-black">
            ⏳ Pending
          </div>
        ) : (
          <div className="absolute top-3 left-3 bg-emerald-500/20 text-emerald-400 text-[8px] px-2 py-1 rounded-full border border-emerald-500/20 uppercase font-black">
            ✓ Approved
          </div>
        )}

        {post.ai_moderation_score !== null && (
          <div className="absolute top-3 right-3 flex items-center gap-1">
            {post.ai_moderation_score >= 0.8 ? (
              <span className="bg-emerald-500/20 text-emerald-400 text-[8px] px-2 py-1 rounded-full border border-emerald-500/20 uppercase font-black flex items-center gap-1">
                <ShieldCheck size={10} /> AI Approved
              </span>
            ) : post.ai_moderation_score >= 0.5 ? (
              <span className="bg-orange-500/20 text-orange-400 text-[8px] px-2 py-1 rounded-full border border-orange-500/30 uppercase font-black flex items-center gap-1">
                <AlertTriangle size={10} /> AI Review
              </span>
            ) : (
              <span className="bg-red-500/20 text-red-400 text-[8px] px-2 py-1 rounded-full border border-red-500/30 uppercase font-black flex items-center gap-1">
                <ShieldAlert size={10} /> AI Rejected
              </span>
            )}
            <span className="bg-white/5 text-white/60 text-[8px] px-2 py-1 rounded-full border border-white/10 uppercase font-black">
              Score: {(post.ai_moderation_score * 100).toFixed(0)}%
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-5 space-y-4 flex-1 flex flex-col">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-black text-xs">
            {(post.username || 'U').charAt(0)}
          </div>
          <div>
            <div className="font-black text-white text-sm">@{post.username || 'user'}</div>
            <div className="text-[9px] text-text-secondary uppercase tracking-widest">{new Date(post.created_at).toLocaleDateString()}</div>
          </div>
        </div>

        <p className="text-xs text-white/70 italic leading-relaxed line-clamp-2 flex-1">"{post.description}"</p>

        <div className="flex gap-2 mt-auto">
          <button
            onClick={() => setPreviewPost(post)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-white/5 text-white/60 font-black uppercase text-[9px] tracking-widest hover:bg-white/10 transition-colors"
          >
            <Eye size={12} /> Preview
          </button>
          {showApprove && (
            <button
              onClick={() => handleApprove(post.id)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-emerald-500/10 text-emerald-400 font-black uppercase text-[9px] tracking-widest hover:bg-emerald-500/20 transition-colors"
            >
              <CheckCircle size={12} /> Approve
            </button>
          )}
          <button
            onClick={() => handleDelete(post.id)}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-red-500/10 text-red-500 font-black uppercase text-[9px] tracking-widest hover:bg-red-500/20 transition-colors"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-10">
      {previewPost && <VideoPreview post={previewPost} onClose={() => setPreviewPost(null)} />}

      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-black uppercase tracking-tighter italic">Network Citizens & Moderation</h2>
          <p className="text-base text-text-secondary font-medium pl-1">Monitor, preview, approve, and delete user-submitted transmissions.</p>
        </div>
        <button 
          onClick={loadData}
          className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-primary hover:border-primary/20 transition-all group"
        >
          <RefreshCw size={14} className={isLoading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'} />
          {isLoading ? 'Syncing...' : 'Sync Node'}
        </button>
      </div>

      <div className="flex gap-3 border-b border-white/10 pb-4 overflow-x-auto">
        <button
          onClick={() => setActiveTab('pending')}
          className={`flex items-center gap-3 px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all whitespace-nowrap ${activeTab === 'pending' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}
        >
          <ShieldAlert size={16} /> Pending Review
          {pendingPosts.length > 0 && (
            <span className="bg-orange-500 text-black text-[9px] w-5 h-5 rounded-full flex items-center justify-center font-black">
              {pendingPosts.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-3 px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all whitespace-nowrap ${activeTab === 'users' ? 'bg-primary/20 text-primary border border-primary/20' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}
        >
          <User size={16} /> Citizens ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('all')}
          className={`flex items-center gap-3 px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all whitespace-nowrap ${activeTab === 'all' ? 'bg-primary/20 text-primary border border-primary/20' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}
        >
          <Video size={16} /> Network Logs ({approvedPosts.length})
        </button>
      </div>

      {/* Pending Videos */}
      {activeTab === 'pending' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pendingPosts.length === 0 ? (
            <div className="col-span-full text-center py-20 text-text-secondary font-black uppercase tracking-widest text-sm bg-white/5 rounded-3xl">
              No content pending security review.
            </div>
          ) : (
            pendingPosts.map(post => (
              <PostCard key={post.id} post={post} showApprove={true} />
            ))
          )}
        </div>
      )}

      {/* Users */}
      {activeTab === 'users' && (
        <div className="premium-card overflow-hidden !rounded-3xl border-white/5">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10 uppercase font-black text-[10px] tracking-widest text-text-secondary">
                <th className="p-6">Identity</th>
                <th className="p-6">Credentials / Role</th>
                <th className="p-6">Status</th>
                <th className="p-6">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex justify-center flex-col items-center font-black uppercase">
                        {u.username?.charAt(0) || u.email?.charAt(0)}
                      </div>
                      <div>
                        <div className="font-black text-white text-sm">@{u.username || 'unknown'}</div>
                        <div className="text-[10px] text-text-secondary">{u.created_at ? new Date(u.created_at).toLocaleDateString() : 'Legacy'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-6 space-y-1">
                    <div className="text-xs font-black text-white/80">{u.email}</div>
                    <div className="text-[10px] uppercase tracking-widest text-primary font-black">{u.role}</div>
                  </td>
                  <td className="p-6">
                    <div className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] uppercase font-black tracking-widest">
                      {u.isOver18 ? 'Valid 18+' : 'Unverified'}
                    </div>
                  </td>
                  <td className="p-6">
                    {u.role !== 'admin' && (
                      <button onClick={() => handleDeleteUser(u.id)} className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500/20 transition-colors" title="Delete Account & Content">
                        <Trash2 size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Approved Content */}
      {activeTab === 'all' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {approvedPosts.length === 0 ? (
            <div className="col-span-full text-center py-20 text-text-secondary font-black uppercase tracking-widest text-sm bg-white/5 rounded-3xl">
              No approved content available.
            </div>
          ) : (
            approvedPosts.map(post => (
              <PostCard key={post.id} post={post} showApprove={false} />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default UserModeration;
