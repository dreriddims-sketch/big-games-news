/* src/components/ArticleFeed.jsx */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Share2, Link2, ExternalLink, Calendar, User, ArrowRight } from 'lucide-react';
import { mockDB, dbEvents, saveToMockPosts } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

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
    <div id="feed" className="max-w-7xl mx-auto px-6 py-32 space-y-24 relative z-10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-12 pb-10 md:pb-16 border-b border-white/10"
      >
        <div className="space-y-4 md:space-y-6">
          <h2 className="text-5xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter italic leading-none select-none">Feed_Data</h2>
          <p className="text-text-secondary font-medium text-xl max-w-2xl leading-relaxed text-tech">
            Unfiltered transmissions from the core developer nodes. 
          </p>
        </div>
        
        {/* Social Terminal */}
        <div className="flex flex-wrap items-center gap-8">
           <div className="h-12 w-px bg-white/10 hidden md:block" />
           {['X_INTEL', 'IG_LOGS', 'DC_COMMMS'].map(link => (
             <button key={link} className="text-[11px] font-black uppercase tracking-[0.4em] text-text-secondary hover:text-primary transition-all hover:neon-glow text-tech">
                {link}
             </button>
           ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {posts.map((post, i) => (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, delay: i * 0.1, ease: "easeOut" }}
            key={post.id}
          >
            <article 
              id={`article-${post.id}`}
              className="group flex flex-col h-full premium-card p-0 bg-white/5 border-white/10 rounded-3xl overflow-hidden hover:-translate-y-2 transition-transform duration-700"
            >
            {/* Image Section */}
            <div className="relative aspect-[16/10] overflow-hidden">
               <img 
                 src={post.banner_url} 
                 alt={post.title} 
                 className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s] brightness-[0.7] group-hover:brightness-100"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
               <div className="absolute top-6 left-6">
                  <div className="glass px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-primary border-primary/20 backdrop-blur-xl">
                    {new Date(post.created_at).toLocaleDateString()}
                  </div>
               </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 p-6 md:p-10 flex flex-col justify-between gap-6 md:gap-8">
              <div className="space-y-4">
                <h3 
                  contentEditable={editMode}
                  onBlur={(e) => handleInlineEdit(post.id, 'title', e.target.innerText)}
                  suppressContentEditableWarning={true}
                  className={`text-xl md:text-3xl font-black uppercase tracking-tight leading-none italic transition-colors group-hover:text-primary ${editMode ? 'bg-primary/5 rounded-xl p-2 outline-none ring-1 ring-primary/20' : ''}`}
                >
                  {post.title}
                </h3>
                <p 
                  contentEditable={editMode}
                  onBlur={(e) => handleInlineEdit(post.id, 'content', e.target.innerText)}
                  suppressContentEditableWarning={true}
                  className={`text-text-secondary text-base leading-relaxed line-clamp-2 opacity-60 group-hover:opacity-100 transition-opacity ${editMode ? 'bg-primary/5 rounded-xl p-2 outline-none ring-1 ring-primary/20' : ''}`}
                >
                  {post.content}
                </p>
              </div>

              <div className="pt-8 flex items-center justify-between border-t border-white/5">
                <Link to={`/article/${post.slug}`} className="flex items-center gap-3 text-white font-black uppercase text-[11px] tracking-widest group/btn hover:text-primary transition-colors">
                  Read Transmission <ArrowRight size={16} className="group-hover/btn:translate-x-2 transition-transform" />
                </Link>
                <div className="flex items-center gap-2">
                   <button className="p-3 glass rounded-xl hover:bg-primary/20 transition-all border-none">
                     <Share2 size={16} />
                   </button>
                </div>
              </div>
            </div>
            </article>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ArticleFeed;
