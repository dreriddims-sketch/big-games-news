import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockDB, dbEvents, saveToMockPosts } from '../lib/supabase';
import { ArrowLeft, Calendar, Share2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AdBanner from '../components/AdBanner';


const ArticlePage = () => {
  const { slug } = useParams();
  const { editMode } = useAuth();
  const [posts, setPosts] = useState(mockDB.posts);
  const post = posts.find(p => p.slug === slug);

  useEffect(() => {
    const handleUpdate = () => setPosts([...mockDB.posts]);
    dbEvents.addEventListener('change', handleUpdate);
    return () => dbEvents.removeEventListener('change', handleUpdate);
  }, []);

  const handlePostEdit = (field, value) => {
    if (!editMode || !post) return;
    const newPosts = posts.map(p => 
      p.id === post.id ? { ...p, [field]: value } : p
    );
    saveToMockPosts(newPosts);
  };

  if (!post) {
    return (
      <div className="min-h-screen bg-black text-white p-20 text-center">
        <h1 className="text-4xl font-black mb-8">TRANSMISSION_LOST</h1>
        <Link to="/" className="text-primary uppercase tracking-widest text-[10px] font-black underline">Return to Core</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-white font-sans selection:bg-primary selection:text-black">
      <main className="max-w-4xl mx-auto px-6 py-32 space-y-16">
        {/* Back Link */}
        <Link to="/" className="inline-flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-white/40 hover:text-primary transition-all group">
           <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform" />
           Back to Terminal
        </Link>

        {/* Header */}
        <header className="space-y-12">
           <div className="inline-flex items-center gap-4 px-6 py-2 rounded-full glass border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.4em]">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Intelligence Log // {new Date(post.created_at).toLocaleDateString()}
           </div>
           
           <h1 
             contentEditable={editMode}
             onBlur={(e) => handlePostEdit('title', e.target.innerText)}
             suppressContentEditableWarning={true}
             className={`text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-[0.9] outline-none ${editMode ? 'bg-primary/5 rounded-3xl p-8 focus:ring-1 focus:ring-primary/20 block' : ''}`}
           >
             {post.title}
           </h1>

           <div className="aspect-[21/9] rounded-3xl overflow-hidden glass border-white/10 shadow-3xl">
              <img src={post.banner_url} alt={post.title} className="w-full h-full object-cover" />
           </div>
        </header>

        {/* Content */}
        <div className="space-y-12">
           <div 
             contentEditable={editMode}
             onBlur={(e) => handlePostEdit('content', e.target.innerText)}
             suppressContentEditableWarning={true}
             className={`prose prose-invert prose-2xl max-w-none text-text-secondary leading-relaxed font-medium outline-none ${editMode ? 'bg-primary/5 rounded-3xl p-8' : ''}`}
           >
             {post.content}
           </div>
           
           <div className="h-px w-full bg-white/5" />
           
           <AdBanner className="!px-0 !py-8" />
           
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-black uppercase text-[10px]">BG</div>
                 <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-white">Big Games Ops</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-white/30">Verified Node</div>
                 </div>
              </div>
              <button className="flex items-center gap-3 px-8 py-4 glass rounded-2xl hover:bg-primary/20 transition-all border-none text-[10px] font-black uppercase tracking-widest">
                 <Share2 size={16} /> Share Intel
              </button>
           </div>
        </div>
      </main>
    </div>
  );
};

export default ArticlePage;
