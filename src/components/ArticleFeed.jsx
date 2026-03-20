/* src/components/ArticleFeed.jsx */
import React, { useState, useEffect } from 'react';
import { Share2, Link2, ExternalLink, Calendar, User, ArrowRight } from 'lucide-react';
import { mockDB, dbEvents, saveToMockPosts } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const ArticleFeed = () => {
  const { editMode } = useAuth();
  const [posts, setPosts] = useState([...mockDB.posts]);

  useEffect(() => {
    const handleUpdate = () => {
      setPosts([...mockDB.posts]);
    };
    dbEvents.addEventListener('change', handleUpdate);
    return () => dbEvents.removeEventListener('change', handleUpdate);
  }, []);

  const handleInlineEdit = (id, field, value) => {
    if (!editMode) return;
    const updated = posts.map(p => p.id === id ? { ...p, [field]: value } : p);
    saveToMockPosts(updated);
  };

  return (
    <div id="feed" className="max-w-7xl mx-auto px-6 py-24 space-y-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/5">
        <div className="space-y-3">
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">Content Feed</h2>
          <p className="text-text-secondary font-medium text-lg max-w-xl leading-relaxed">
            Latest stories, updates, and deep dives from across the Big Games universe.
          </p>
        </div>
        
        {/* Social Bar */}
        <div className="flex flex-wrap items-center gap-4">
           <button className="btn-secondary flex items-center gap-2 text-sm font-black uppercase tracking-widest">
             Follow @BigGames
           </button>
           <button className="btn-secondary flex items-center gap-2 text-sm font-black uppercase tracking-widest">
             Share Gallery
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {posts.map((post, i) => (
          <article 
            id={`article-${post.id}`}
            key={post.id} 
            className="group flex flex-col premium-card p-0 overflow-hidden min-h-[500px] animate-in fade-in slide-in-from-bottom-8 duration-1000"
            style={{ animationDelay: `${i * 150}ms` }}
          >
            <div className="relative aspect-[16/10] overflow-hidden">
               <img 
                 src={post.banner_url} 
                 alt={post.title} 
                 className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
               />
               <div className="absolute top-4 left-4 flex gap-2">
                 <div className="glass px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-primary border-primary/20">
                   {new Date(post.created_at).toLocaleDateString()}
                 </div>
               </div>
            </div>

            <div className="flex-1 p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <h3 
                  contentEditable={editMode}
                  onBlur={(e) => handleInlineEdit(post.id, 'title', e.target.innerText)}
                  suppressContentEditableWarning={true}
                  className={`text-2xl font-black uppercase tracking-tight leading-tight transition-all ${editMode ? 'hover:bg-primary/5 rounded px-1 -mx-1 outline-none cursor-text' : ''}`}
                >
                  {post.title}
                </h3>
                <p 
                  contentEditable={editMode}
                  onBlur={(e) => handleInlineEdit(post.id, 'content', e.target.innerText)}
                  suppressContentEditableWarning={true}
                  className={`text-text-secondary text-sm leading-relaxed line-clamp-3 transition-all ${editMode ? 'hover:bg-primary/5 rounded px-1 -mx-1 outline-none cursor-text' : ''}`}
                >
                  {post.content}
                </p>
              </div>

              <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                <button className="flex items-center gap-2 text-primary font-black uppercase text-xs tracking-widest hover:gap-4 transition-all">
                  Read Article <ArrowRight size={16} />
                </button>
                <div className="flex items-center gap-3">
                   <button className="p-2 glass rounded-lg hover:text-primary transition-colors">
                     <Share2 size={16} />
                   </button>
                   <button className="p-2 glass rounded-lg hover:text-primary transition-colors">
                     <Link2 size={16} />
                   </button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default ArticleFeed;
