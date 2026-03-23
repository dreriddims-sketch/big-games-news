/* src/pages/dashboard/Publish.jsx */
import React, { useState } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { PlusCircle, Upload, Save, Eye, Trash2, ArrowLeft } from 'lucide-react';
import { mockDB, saveToMockPosts } from '../../lib/supabase';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';

const Publish = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');

  const existingPost = editId 
    ? mockDB.posts.find(p => p.id.toString() === editId) 
    : null;

  const [title, setTitle] = useState(existingPost?.title || '');
  const [content, setContent] = useState(existingPost?.content || '');
  const [banner, setBanner] = useState(existingPost?.banner_url || '');
  const [tags, setTags] = useState(existingPost?.tags?.map(t => `#${t}`).join(' ') || '');
  const [preview, setPreview] = useState(false);

  const handleSave = () => {
    if (!title) return;
    
    const tagArray = tags.split(' ').filter(t => t.startsWith('#')).map(t => t.replace('#', '').toLowerCase());
    
    let updatedPosts;
    
    if (existingPost) {
      updatedPosts = mockDB.posts.map(p => 
        p.id.toString() === editId 
          ? { ...p, title, content, tags: tagArray, banner_url: banner || p.banner_url || '/hero.png' } 
          : p
      );
    } else {
      const newPost = {
        id: Date.now(),
        title,
        content,
        tags: tagArray,
        banner_url: banner || '/hero.png',
        created_at: new Date().toISOString(),
        order_index: 0,
        status: 'published'
      };
      updatedPosts = [newPost, ...mockDB.posts];
    }

    saveToMockPosts(updatedPosts);
    navigate('/dashboard/articles');
  };

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <div className="space-y-4 max-w-2xl">
           <div className="flex items-center gap-4">
              <Link to="/dashboard/articles" className="p-3 glass rounded-2xl hover:text-primary transition-all">
                 <ArrowLeft size={20} />
              </Link>
              <h3 className="text-xl font-black uppercase text-text-secondary tracking-widest pl-1">
                {existingPost ? 'Edit Article Transmission' : 'New Article Metadata'}
              </h3>
           </div>
           <input 
             type="text" 
             value={title} 
             onChange={(e) => setTitle(e.target.value)} 
             placeholder="Story Headline (Impactful & Bold)" 
             className="w-full bg-white/5 border border-white/10 rounded-3xl py-6 px-8 text-3xl font-black text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-white/20 uppercase italic tracking-tighter"
           />
        </div>
        <div className="flex gap-4">
           <button onClick={() => setPreview(!preview)} className="btn-secondary py-3 flex items-center gap-2 text-xs uppercase font-black">
             <Eye size={18} /> {preview ? 'Edit Source' : 'Live Preview'}
           </button>
           <button onClick={handleSave} className="btn-primary py-3 flex items-center gap-2 text-xs uppercase font-black">
             <Save size={18} /> {existingPost ? 'Save Changes' : 'Post News'}
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
         <div className="lg:col-span-8 space-y-8">
            <div className="premium-card p-2 bg-white/5 border-white/10 overflow-hidden min-h-[500px]">
               {preview ? (
                 <div className="p-12 space-y-8 animate-in zoom-in-95 duration-500">
                    <img src={banner || '/hero.png'} className="w-full aspect-video object-cover rounded-2xl shadow-2xl" placeholder="Banner Preview" />
                    <h1 className="text-5xl font-black uppercase tracking-tighter italic">{title || 'Headline Preview'}</h1>
                    <div className="prose prose-invert prose-lg max-w-none text-text-secondary" dangerouslySetInnerHTML={{ __html: content }} />
                 </div>
               ) : (
                 <div className="h-full bg-white rounded-3xl overflow-hidden shadow-2xl">
                    <ReactQuill 
                      theme="snow" 
                      value={content} 
                      onChange={setContent} 
                      className="h-[500px] text-black"
                      placeholder="Transmission body content goes here..."
                      modules={{
                        toolbar: [
                          [{ 'header': [1, 2, 3, false] }],
                          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                          [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
                          ['link', 'image', 'video'],
                          ['clean']
                        ],
                      }}
                    />
                 </div>
               )}
            </div>
         </div>

         <div className="lg:col-span-4 space-y-8">
            <div className="premium-card p-8 border-white/5 space-y-6">
               <h3 className="text-xl font-black uppercase">Publishing Settings</h3>
               <div className="space-y-4">
                  <div className="space-y-2">
                     <label className="text-[10px] text-text-secondary uppercase font-black tracking-widest pl-1">Banner Texture (URL)</label>
                     <div className="relative group">
                        <Upload className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors" size={20} />
                        <input
                          type="text"
                          value={banner}
                          onChange={(e) => setBanner(e.target.value)}
                          placeholder="https://images.unsplash.com/..."
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-primary transition-all text-xs font-bold"
                        />
                     </div>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] text-text-secondary uppercase font-black tracking-widest pl-1">Story Tags (#label #tag)</label>
                     <div className="relative group">
                         <PlusCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors" size={20} />
                         <input
                           type="text"
                           value={tags}
                           onChange={(e) => setTags(e.target.value)}
                           placeholder="#gaming #announcement #beta"
                           className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-primary transition-all text-xs font-bold"
                         />
                     </div>
                  </div>
                  
                  <div className="pt-4 space-y-4">
                     <div className="flex items-center justify-between p-4 glass rounded-2xl border-white/10">
                        <span className="text-xs font-bold uppercase text-text-secondary">Instant Push</span>
                        <div className="w-10 h-5 bg-primary rounded-full relative">
                           <div className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-black" />
                        </div>
                     </div>
                     <div className="flex items-center justify-between p-4 glass rounded-2xl border-white/10">
                        <span className="text-xs font-bold uppercase text-text-secondary">Priority Order</span>
                        <span className="text-xs font-black text-primary">TOP FEED</span>
                     </div>
                  </div>
               </div>
               
               <div className="pt-8 flex gap-4">
                  <button className="flex-1 btn-secondary py-3 text-[10px] uppercase font-black text-red-400 border-red-500/10 hover:bg-red-500/10 hover:border-red-500/40">
                    Discard Draft
                  </button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Publish;
