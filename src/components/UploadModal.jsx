/* src/components/UploadModal.jsx */
import React, { useState, useRef } from 'react';
import { X, Upload, Film, Link2, Play, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { uploadVideoToStorage, insertSocialPost } from '../lib/supabase';

const UploadModal = ({ isOpen, onClose, user, onUploadSuccess }) => {
  const [uploadMode, setUploadMode] = useState('file');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [videoBlobUrl, setVideoBlobUrl] = useState(null);
  const [description, setDescription] = useState('');
  const [uploadState, setUploadState] = useState('idle'); // 'idle' | 'uploading' | 'success' | 'error'
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (videoBlobUrl) URL.revokeObjectURL(videoBlobUrl);
      setVideoFile(file);
      setVideoBlobUrl(URL.createObjectURL(file));
      setUploadMode('file');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (uploadMode === 'file' && !videoFile) return;
    if (uploadMode === 'link' && !videoUrl) return;

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

      const newPost = {
        id: Date.now().toString(),
        userId: user?.id || 'anonymous',
        username: user?.username || user?.email?.split('@')[0] || 'anonymous',
        videoUrl: finalVideoUrl,
        avatarUrl: user?.photo || user?.photoUrl || null,
        description: description || 'New Transmission',
        status: 'pending',
        likes: 0,
        comments: 0,
        tab: 'foryou',
        fileName: finalFileName,
        created_at: new Date().toISOString()
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
      }, 1500);
    } catch (err) {
      console.error('Upload error:', err);
      setUploadState('error');
      setUploadError(err.message || 'Failed to sync with network.');
    }
  };

  return (
    <div className="fixed inset-0 z-[300] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="relative max-w-xl w-full glass rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden p-8 md:p-12">
        <button onClick={onClose} className="absolute top-8 right-8 text-white/40 hover:text-white transition-colors">
          <X size={24} />
        </button>

        <div className="space-y-8">
          <div>
            <h2 className="text-3xl font-black uppercase tracking-tighter italic text-white mb-2">Initialize Transmission</h2>
            <p className="text-text-secondary text-sm font-medium">Capture evidence or link a network stream.</p>
          </div>

          <div className="flex gap-4 p-1 bg-white/5 rounded-2xl border border-white/5">
            <button 
              onClick={() => setUploadMode('file')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${uploadMode === 'file' ? 'bg-primary text-black' : 'text-white/40 hover:text-white'}`}
            >
              <Film size={14} /> File Upload
            </button>
            <button 
              onClick={() => setUploadMode('link')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${uploadMode === 'link' ? 'bg-primary text-black' : 'text-white/40 hover:text-white'}`}
            >
              <Link2 size={14} /> Global Link
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
                    <div className="p-5 bg-primary/10 rounded-full text-primary mb-4 group-hover:scale-110 transition-transform">
                      <Upload size={32} />
                    </div>
                    <p className="text-white font-black uppercase text-xs tracking-widest">Select Video File</p>
                    <p className="text-white/30 text-[10px] uppercase font-black mt-2">MP4/MOV Max 50MB</p>
                  </>
                )}
                <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" accept="video/*" />
              </div>
            ) : (
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Stream Source (YouTube/MP4 URL)</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary"><Link2 size={18} /></div>
                  <input 
                    type="url" 
                    placeholder="https://youtube.com/watch?v=..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 outline-none focus:border-primary/40 focus:bg-white/10 transition-all font-medium"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Transmission Log (Description)</label>
              <textarea 
                placeholder="What happened in this capture?"
                className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 text-white placeholder:text-white/20 outline-none focus:border-primary/40 focus:bg-white/10 transition-all font-medium min-h-[120px] resize-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {uploadError && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 text-xs font-black uppercase tracking-widest">
                <AlertCircle size={16} /> {uploadError}
              </div>
            )}

            <button 
              disabled={uploadState === 'uploading' || uploadState === 'success' || (uploadMode === 'file' && !videoFile) || (uploadMode === 'link' && !videoUrl)}
              className="btn-primary w-full py-4 text-sm tracking-widest uppercase font-black disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {uploadState === 'uploading' ? (
                <><Loader2 size={16} className="animate-spin" /> Uploading...</>
              ) : uploadState === 'success' ? (
                <><CheckCircle2 size={16} /> Transmitted!</>
              ) : (
                <><Play size={16} /> Upload to Network</>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;
