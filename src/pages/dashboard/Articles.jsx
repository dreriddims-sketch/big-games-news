/* src/pages/dashboard/Articles.jsx */
import React, { useState, useEffect } from 'react';
import { Files, Search, Filter, Edit3, Trash2, Calendar, Eye, Plus } from 'lucide-react';
import { mockDB, saveToMockPosts, dbEvents } from '../../lib/supabase';
import { Link } from 'react-router-dom';

const Articles = () => {
  const [posts, setPosts] = useState([...mockDB.posts]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const handleUpdate = () => setPosts([...mockDB.posts]);
    dbEvents.addEventListener('change', handleUpdate);
    return () => dbEvents.removeEventListener('change', handleUpdate);
  }, []);

  const handleDelete = (id) => {
    if (window.confirm('Confirm article deletion? This action cannot be undone.')) {
      const updated = posts.filter((p) => p.id !== id);
      saveToMockPosts(updated);
    }
  };

  const filteredPosts = posts.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/5">
         <div className="relative group max-w-md w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search Article Database..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-primary transition-all text-sm font-bold tracking-tight"
            />
         </div>
         <div className="flex gap-4">
            <button className="btn-secondary py-3 flex items-center gap-2 text-[10px] uppercase font-black">
               <Filter size={16} /> Filter by Category
            </button>
            <Link to="/dashboard/publish" className="btn-primary py-3 flex items-center gap-2 text-[10px] uppercase font-black">
               <Plus size={16} /> New Article
            </Link>
         </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredPosts.map((post) => (
          <div key={post.id} className="premium-card p-4 flex items-center gap-6 group hover:translate-x-2 border-white/5 hover:border-primary/20 transition-all">
             <div className="relative w-40 h-24 rounded-2xl overflow-hidden glass border-white/10 group-hover:scale-105 transition-transform duration-700">
                <img src={post.banner_url} alt={post.title} className="w-full h-full object-cover brightness-[0.6] group-hover:brightness-100 transition-all" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-3">
                   <div className="text-[8px] font-black uppercase text-primary border border-primary/20 bg-primary/10 px-2 py-1 rounded-full">
                      ID: #{post.id.toString().slice(-4)}
                   </div>
                </div>
             </div>
             
             <div className="flex-1 space-y-2">
                <h3 className="text-xl font-black uppercase tracking-tight italic text-white group-hover:text-primary transition-colors leading-none truncate max-w-lg">
                   {post.title}
                </h3>
                <div className="flex items-center gap-6">
                   <span className="flex items-center gap-2 text-[10px] text-text-secondary uppercase font-black tracking-widest leading-none">
                      <Calendar size={12} className="text-primary" /> {new Date(post.created_at).toLocaleDateString()}
                   </span>
                   <span className="flex items-center gap-2 text-[10px] text-emerald-500 uppercase font-black tracking-widest leading-none">
                      <Eye size={12} /> Published
                   </span>
                   <span className="flex items-center gap-2 text-[10px] text-text-secondary/50 uppercase font-black tracking-widest leading-none italic">
                      Author: Master Admin
                   </span>
                </div>
             </div>

              <div className="flex items-center gap-3 pr-4">
                 <Link 
                   to={`/#article-${post.id}`}
                   className="p-4 glass rounded-2xl hover:bg-white/10 hover:text-emerald-500 transition-all"
                   title="View Live"
                 >
                    <Eye size={18} />
                 </Link>
                 <Link 
                   to={`/dashboard/publish?edit=${post.id}`}
                   className="p-4 glass rounded-2xl hover:bg-white/10 hover:text-primary transition-all"
                   title="Edit Article"
                 >
                    <Edit3 size={18} />
                 </Link>
                 <button 
                   onClick={() => handleDelete(post.id)}
                   className="p-4 glass rounded-2xl hover:bg-red-500/10 hover:text-red-500 transition-all"
                   title="Delete Article"
                 >
                    <Trash2 size={18} />
                 </button>
              </div>
          </div>
        ))}
      </div>

      {filteredPosts.length === 0 && (
         <div className="text-center py-24 opacity-30 space-y-4">
            <Files size={64} className="mx-auto" />
            <p className="text-xl font-black uppercase tracking-tighter">No Articles Found</p>
         </div>
      )}
    </div>
  );
};

export default Articles;
