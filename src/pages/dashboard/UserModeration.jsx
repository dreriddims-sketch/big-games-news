import React, { useState, useEffect } from 'react';
import { User, Video, ShieldAlert, Trash2, CheckCircle } from 'lucide-react';
import { mockDB, saveToMockSocialPosts, saveToMockUsers } from '../../lib/supabase';

const UserModeration = () => {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('pending'); // pending, users, all

  useEffect(() => {
    // We get from mockDB initialized states
    const lsUsers = JSON.parse(localStorage.getItem('bg_users') || '[]');
    setUsers(lsUsers.length > 0 ? lsUsers : mockDB.users);

    const lsPosts = JSON.parse(localStorage.getItem('bg_social_posts') || '[]');
    setPosts(lsPosts.length > 0 ? lsPosts : mockDB.socialPosts || []);
  }, []);

  const handleApprove = (id) => {
    const updated = posts.map(p => p.id === id ? { ...p, status: 'approved' } : p);
    setPosts(updated);
    saveToMockSocialPosts(updated);
  };

  const handleDelete = (id) => {
    const updated = posts.filter(p => p.id !== id);
    setPosts(updated);
    saveToMockSocialPosts(updated);
  };

  const handleDeleteUser = (id) => {
    const updatedUsers = users.filter(u => u.id !== id);
    setUsers(updatedUsers);
    saveToMockUsers(updatedUsers);
    
    // Cascade delete their posts
    const updatedPosts = posts.filter(p => p.userId !== id);
    setPosts(updatedPosts);
    saveToMockSocialPosts(updatedPosts);
  };

  const pendingPosts = posts.filter(p => p.status === 'pending');
  const approvedPosts = posts.filter(p => p.status === 'approved');

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
           <h2 className="text-3xl font-black uppercase tracking-tighter italic">Network Citizens & Moderation</h2>
           <p className="text-base text-text-secondary font-medium pl-1">Monitor, approve, and delete user-submitted transmissions.</p>
        </div>
      </div>

      <div className="flex gap-4 border-b border-white/10 pb-4 overflow-x-auto">
        <button 
          onClick={() => setActiveTab('pending')}
          className={`flex items-center gap-3 px-6 py-3 rounded-xl font-black uppercase tracking-widest text-xs transition-all ${activeTab === 'pending' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}
        >
           <ShieldAlert size={16} /> Pending Review ({pendingPosts.length})
        </button>
        <button 
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-3 px-6 py-3 rounded-xl font-black uppercase tracking-widest text-xs transition-all ${activeTab === 'users' ? 'bg-primary/20 text-primary border border-primary/20' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}
        >
           <User size={16} /> Registered Users ({users.length})
        </button>
        <button 
          onClick={() => setActiveTab('all')}
          className={`flex items-center gap-3 px-6 py-3 rounded-xl font-black uppercase tracking-widest text-xs transition-all ${activeTab === 'all' ? 'bg-primary/20 text-primary border border-primary/20' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}
        >
           <Video size={16} /> Approved Content ({approvedPosts.length})
        </button>
      </div>

      {activeTab === 'pending' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pendingPosts.length === 0 ? (
            <div className="col-span-full text-center py-20 text-text-secondary font-black uppercase tracking-widest text-sm bg-white/5 rounded-3xl">
              No content pending security review.
            </div>
          ) : (
            pendingPosts.map(post => (
              <div key={post.id} className="premium-card p-6 space-y-6 flex flex-col bg-white/5 border-orange-500/20">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-orange-500/10 text-orange-500 flex items-center justify-center font-black">{post.username?.charAt(0)}</div>
                     <div>
                       <div className="font-black uppercase tracking-tight text-white">@{post.username}</div>
                       <div className="text-[10px] text-text-secondary uppercase tracking-widest">{new Date(post.created_at).toLocaleDateString()}</div>
                     </div>
                  </div>
                  <div className="bg-orange-500/20 text-orange-400 text-[10px] px-3 py-1 rounded-full border border-orange-500/30 uppercase font-black">
                    Pending
                  </div>
                </div>
                
                <p className="text-sm text-white/80 line-clamp-2 italic">"{post.description}"</p>
                <div className="bg-black/50 p-3 rounded-xl break-all text-[10px] font-mono text-white/40 mb-4">{post.videoUrl}</div>
                
                <div className="grid grid-cols-2 gap-4 mt-auto">
                   <button onClick={() => handleDelete(post.id)} className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-red-500/10 text-red-500 font-black uppercase text-[10px] tracking-widest hover:bg-red-500/20">
                     <Trash2 size={16} /> Reject
                   </button>
                   <button onClick={() => handleApprove(post.id)} className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-500/10 text-emerald-400 font-black uppercase text-[10px] tracking-widest hover:bg-emerald-500/20">
                     <CheckCircle size={16} /> Approve
                   </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

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
                      <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex justify-center flex-col items-center font-black uppercase">{u.username?.charAt(0) || u.email?.charAt(0)}</div>
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

      {activeTab === 'all' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {approvedPosts.length === 0 ? (
            <div className="col-span-full text-center py-20 text-text-secondary font-black uppercase tracking-widest text-sm bg-white/5 rounded-3xl">
              No approved content available.
            </div>
          ) : (
            approvedPosts.map(post => (
              <div key={post.id} className="premium-card p-6 space-y-4 flex flex-col bg-white/5 border-white/10">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-xs">{(post.username || 'U').charAt(0)}</div>
                     <div className="font-black uppercase tracking-tight text-white text-xs">@{post.username || 'user'}</div>
                  </div>
                  <button onClick={() => handleDelete(post.id)} className="p-2 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500/20 transition-colors">
                     <Trash2 size={14} />
                  </button>
                </div>
                <p className="text-sm text-white/80 line-clamp-2 italic">"{post.description}"</p>
                <div className="text-[10px] text-text-secondary uppercase tracking-widest">{new Date(post.created_at).toLocaleDateString()}</div>
              </div>
            ))
           )}
        </div>
      )}
    </div>
  );
};

export default UserModeration;
