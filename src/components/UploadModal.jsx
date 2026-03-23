/* src/components/UploadModal.jsx */
import React, { useState, useRef } from 'react';
import { X, Upload, Film, Link2, Play, Loader2, CheckCircle2, AlertCircle, Newspaper, Image as ImageIcon } from 'lucide-react';
import { uploadVideoToStorage, insertSocialPost } from '../lib/supabase';

const UploadModal = ({ isOpen, onClose, user, onUploadSuccess }) => {
  const [uploadMode, setUploadMode] = useState('file'); // 'file', 'link', 'news'
  const [videoUrl, setVideoUrl] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [videoBlobUrl, setVideoBlobUrl] = useState(null);
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [title, setTitle] = useState(''); // For news
  const [uploadState, setUploadState] = useState('idle');
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
      setVideoBlobUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (uploadMode === 'file' && !videoFile) return;
    if (uploadMode === 'link' && !videoUrl) return;
    if (uploadMode === 'news' && !title) return;

    try {
      setUploadState('uploading');
      setUploadError('');

      let finalVideoUrl = videoUrl;
      let finalFileName = '';

      if (uploadMode === 'file' && videoFile) {
        const result = await uploadVideoToStorage(videoFile);
        if (result.error) throw new Error(result.error);
        finalVideoUrl = result.url;
        finalFileName = videoFile.name;
      }

      const tagArray = tags.split(' ').filter(t => t.startsWith('#')).map(t => t.replace('#', '').toLowerCase());

      const newPost = {
        id: Date.now().toString(),
        userId: user?.id || 'anonymous',
        username: user?.username || user?.email?.split('@')[0] || 'anonymous',
        videoUrl: uploadMode === 'news' ? null : finalVideoUrl,
        avatarUrl: user?.photo || user?.photoUrl || null,
        description: description || (uploadMode === 'news' ? 'News Intelligence Reported' : 'New Transmission'),
        tags: tagArray,
        status: 'pending',
        likes: 0,
        comments: 0,
        views: 0,
        tab: 'foryou',
        fileName: finalFileName,
        created_at: new Date().toISOString(),
        // For news type posts within the social feed
        type: uploadMode === 'news' ? 'article' : 'video',
        title: uploadMode === 'news' ? title : null,
        content: uploadMode === 'news' ? description : null,
        banner_url: uploadMode === 'news' ? videoUrl : null // Reuse videoUrl field for banner URL for news in this quick post
      };

      const { error: dbError } = await insertSocialPost(newPost);
      if (dbError) throw new Error(dbError);

      setUploadState('success');
      setTimeout(() => {
        onUploadSuccess?.(newPost);
        onClose();
        // Reset state
        setUploadState('idle');
        setVideoFile(null);
        setVideoUrl('');
        setDescription('');
        setTags('');
        setTitle('');
        setVideoBlobUrl(null);
      }, 1500);
    } catch (err) {
      console.error('Upload error:', err);
      setUploadState('error');
      setUploadError(err.message || 'Failed to sync with network.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4">
      <div className="relative max-w-2xl w-full glass rounded-[3rem] border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden p-8 md:p-12 animate-in fade-in zoom-in duration-300">
        <button onClick={onClose} className="absolute top-8 right-8 text-white/40 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full">
          <X size={24} />
        </button>

        <div className="space-y-8">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-black uppercase tracking-tighter italic text-white mb-2">Initialize Transmission</h2>
            <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">Broadcast your signal to the global network feed.</p>
          </div>

          <div className="flex gap-2 p-1 bg-white/5 rounded-2xl border border-white/5">
            <button 
              onClick={() => setUploadMode('file')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${uploadMode === 'file' ? 'bg-primary text-black' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
            >
              <Film size={14} /> File
            </button>
            <button 
              onClick={() => setUploadMode('link')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${uploadMode === 'link' ? 'bg-primary text-black' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
            >
              <Link2 size={14} /> Link
            </button>
            <button 
              onClick={() => setUploadMode('news')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${uploadMode === 'news' ? 'bg-primary text-black' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
            >
              <Newspaper size={14} /> News
            </button>
          </div>

          <form onSubmit={handleUpload} className="space-y-6">
            {uploadMode === 'file' ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="group relative aspect-video rounded-3xl border-2 border-dashed border-white/10 hover:border-primary/40 bg-white/5 flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden"
              >
                {videoBlobUrl ? (
                  <video src={videoBlobUrl} className="w-full h-full object-cover" />
                ) : (
                  <>
                    <div className="p-6 bg-primary/10 rounded-full text-primary mb-4 group-hover:scale-110 transition-transform shadow-[0_0_30px_rgba(255,153,0,0.1)]">
                      <Upload size={32} />
                    </div>
                    <p className="text-white font-black uppercase text-xs tracking-widest">Select Video File</p>
                    <p className="text-white/30 text-[9px] uppercase font-black mt-2 tracking-widest">MP4/MOV Max 50MB</p>
                  </>
                )}
                <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" accept="video/*" />
              </div>
            ) : (
              <div className="space-y-4">
                {uploadMode === 'news' && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2 italic">Report Headline</label>
                    <input 
                      type="text" 
                      placeholder="Enter the breaking news title..."
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-lg font-black italic uppercase tracking-tight placeholder:text-white/10 outline-none focus:border-primary/40 focus:bg-white/10 transition-all"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2 italic">
                    {uploadMode === 'news' ? 'Banner URL or Reference' : 'Stream Source (YouTube/MP4 URL)'}
                  </label>
                  <div className="relative">
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-primary">
                      {uploadMode === 'news' ? <ImageIcon size={18} /> : <Link2 size={18} />}
                    </div>
                    <input 
                      type="url" 
                      placeholder={uploadMode === 'news' ? "https://images.unsplash.com/..." : "https://youtube.com/watch?v=..."}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white placeholder:text-white/10 outline-none focus:border-primary/40 focus:bg-white/10 transition-all font-medium"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2 italic">
                  {uploadMode === 'news' ? 'Report Content' : 'Log Entry (Description)'}
                </label>
                <textarea 
                  placeholder={uploadMode === 'news' ? "Details of the intelligence report..." : "Transmission details..."}
                  className="w-full bg-white/5 border border-white/10 rounded-[2rem] p-6 text-white placeholder:text-white/10 outline-none focus:border-primary/40 focus:bg-white/10 transition-all font-medium min-h-[140px] resize-none text-sm"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2 italic">Network Tags (#label)</label>
                <textarea 
                  placeholder="#gaming #network #update"
                  className="w-full bg-white/5 border border-white/10 rounded-[2rem] p-6 text-white placeholder:text-white/10 outline-none focus:border-primary/40 focus:bg-white/10 transition-all font-medium min-h-[140px] resize-none text-sm"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
              </div>
            </div>

            {uploadError && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 text-[10px] font-black uppercase tracking-widest">
                <AlertCircle size={16} /> {uploadError}
              </div>
            )}

            <button 
              type="submit"
              disabled={uploadState === 'uploading' || uploadState === 'success' || (uploadMode === 'file' && !videoFile) || (uploadMode === 'link' && !videoUrl) || (uploadMode === 'news' && !title)}
              className="w-full py-5 bg-primary text-black rounded-2xl text-xs tracking-[0.3em] uppercase font-black disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-3 transition-all hover:bg-white hover:shadow-[0_0_40px_rgba(255,153,0,0.3)] shadow-xl"
            >
              {uploadState === 'uploading' ? (
                <><Loader2 size={18} className="animate-spin" /> Transmitting...</>
              ) : uploadState === 'success' ? (
                <><CheckCircle2 size={18} /> Signal Locked</>
              ) : (
                <><Play size={18} fill="currentColor" /> {uploadMode === 'news' ? 'Broadcast News' : 'Initialize Stream'}</>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;
