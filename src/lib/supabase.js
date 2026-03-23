/* src/lib/supabase.js */
import { createClient } from '@supabase/supabase-js'

// IMPORTANT: Replace with actual Supabase URL and Key
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project-url.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

// For demo purposes, we'll gracefully handle missing keys
export const isSupabaseConfigured = 
  import.meta.env.VITE_SUPABASE_URL && 
  import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * Upload a video file to Supabase Storage and return the permanent public URL.
 * Bucket: 'videos' (must be created in Supabase dashboard as a public bucket)
 */
export const uploadVideoToStorage = async (file, onProgress) => {
  if (!isSupabaseConfigured) {
    // Fallback: return a local blob URL (session-only)
    return { url: URL.createObjectURL(file), error: null, isBlobFallback: true };
  }

  const ext = file.name.split('.').pop() || 'mp4';
  const fileName = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
  const filePath = `uploads/${fileName}`;

  // Supabase Storage upload
  const { data, error } = await supabase.storage
    .from('videos')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type || 'video/mp4',
    });

  if (error) {
    console.error('[Storage] Upload failed:', error.message);
    // Fallback to blob URL so the user can still post
    return { url: URL.createObjectURL(file), error: error.message, isBlobFallback: true };
  }

  // Get public URL
  const { data: publicData } = supabase.storage.from('videos').getPublicUrl(filePath);
  const publicUrl = publicData?.publicUrl;

  return { url: publicUrl, error: null, isBlobFallback: false, filePath };
};

// ─────────────────────────────────────────────
// SUPABASE SOCIAL POSTS DB (real cross-browser)
// ─────────────────────────────────────────────

/**
 * Fetch all social posts from Supabase (or localStorage fallback).
 * Table: social_posts
 */
export const fetchSocialPosts = async () => {
  if (!isSupabaseConfigured) {
    const lsPosts = JSON.parse(localStorage.getItem('bg_social_posts') || '[]');
    return lsPosts;
  }
  const { data, error } = await supabase
    .from('social_posts')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) {
    console.error('[DB] fetchSocialPosts error:', error.message);
    return JSON.parse(localStorage.getItem('bg_social_posts') || '[]');
  }
  return data || [];
};

/**
 * Insert a new social post into Supabase.
 */
export const insertSocialPost = async (post) => {
  if (!isSupabaseConfigured) {
    const existing = JSON.parse(localStorage.getItem('bg_social_posts') || '[]');
    const updated = [post, ...existing];
    localStorage.setItem('bg_social_posts', JSON.stringify(updated));
    return { data: post, error: null };
  }
  const { data, error } = await supabase
    .from('social_posts')
    .insert([{
      id: post.id,
      user_id: post.userId,
      username: post.username,
      video_url: post.videoUrl,
      description: post.description,
      status: post.status,
      likes: post.likes || 0,
      comments: post.comments || 0,
      tab: post.tab || 'foryou',
      file_name: post.fileName || null,
      created_at: post.created_at,
    }])
    .select()
    .single();
  if (error) console.error('[DB] insertSocialPost error:', error.message);
  return { data, error };
};

/**
 * Update a post's status (e.g. 'approved' or 'rejected').
 */
export const updatePostStatus = async (id, status, aiScore = null) => {
  if (!isSupabaseConfigured) {
    const lsPosts = JSON.parse(localStorage.getItem('bg_social_posts') || '[]');
    const updated = lsPosts.map(p => p.id === id ? { ...p, status, ai_moderation_score: aiScore } : p);
    localStorage.setItem('bg_social_posts', JSON.stringify(updated));
    return { data: updated, error: null };
  }
  const { data, error } = await supabase
    .from('social_posts')
    .update({ status, ai_moderation_score: aiScore })
    .eq('id', id);
  if (error) console.error('[DB] updatePostStatus error:', error.message);
  return { data, error };
};

/**
 * Delete a social post permanently.
 */
export const deletePost = async (id) => {
  if (!isSupabaseConfigured) {
    const existing = JSON.parse(localStorage.getItem('bg_social_posts') || '[]');
    localStorage.setItem('bg_social_posts', JSON.stringify(existing.filter(p => p.id !== id)));
    return { error: null };
  }
  const { error } = await supabase
    .from('social_posts')
    .delete()
    .eq('id', id);
  if (error) console.error('[DB] deletePost error:', error.message);
  return { error };
};



/**
 * MOCK DATABASE (Used when Supabase is not configured)
 */
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
};

const getInitialPosts = () => {
  try {
    const saved = localStorage.getItem('bg_posts');
    const posts = saved ? JSON.parse(saved) : [
      {
        id: 1,
        title: 'Big Games Launches Next-Gen Console Support',
        slug: 'big-games-launches-next-gen-console-support',
        content: 'We are thrilled to announce that our entire library is now optimized for the latest generation of gaming hardware. Players can expect 4K resolution at 120FPS across all titles.',
        banner_url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=2070',
        created_at: new Date().toISOString(),
        order_index: 0,
        status: 'published'
      },
      {
        id: 2,
        title: 'Global eSports Tournament Announced',
        slug: 'global-esports-tournament-announced',
        content: 'Get ready for the biggest event in our history. The Big Games World Championship kicks off this Summer with a $1M prize pool.',
        banner_url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=2071',
        created_at: new Date().toISOString(),
        order_index: 1,
        status: 'published'
      }
    ];

    // Ensure all posts have slugs
    return posts.map(post => ({
      ...post,
      slug: post.slug || generateSlug(post.title)
    }));
  } catch (e) {
    console.error('Error parsing posts', e);
    return [];
  }
};

const getInitialPodcasts = () => {
  try {
    const saved = localStorage.getItem('bg_podcasts');
    return saved ? JSON.parse(saved) : [
      { id: 1, title: 'Episode 42: The Future of VR', audio_url: '#', image_url: '' },
      { id: 2, title: 'Episode 41: Dev Log #12', audio_url: '#', image_url: '' },
      { id: 3, title: 'Episode 40: Community Q&A', audio_url: '#', image_url: '' },
      { id: 4, title: 'Episode 39: Soundtrack Breakdown', audio_url: '#', image_url: '' },
    ];
  } catch (e) {
    console.error('Error parsing podcasts', e);
    return [];
  }
};

const getInitialSettings = () => {
  try {
    const saved = localStorage.getItem('bg_settings');
    const defaults = {
      hero_text: 'The Future of Gaming is Here.',
      hero_banner: '/hero.png',
      hero_logo: '/logo.png',
      hero_brand_banner: '/brand-banner.png',
      banner_youtube_url: 'https://youtube.com/embed/dQw4w9WgXcQ',
      youtube_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      spotlight_title: 'Quantum Node Evolution',
      spotlight_desc: 'Deep dive into the decentralized architecture powering the future of the network.',
      popup_text: 'Join the Big Games Inner Circle',
      popup_frequency: 2000,
      page_data: {
        feed: { title: 'The_Feed', desc: 'The latest unfiltered intelligence, transmissions, and developer news from across the Big Games Network.' },
        archive: { title: 'Archive_Logs', desc: 'Access the complete historical record of developer logs, community broadcasts, and sonic experimentations from the Big Games core.' },
        signals: { title: 'Signals_Hub', desc: 'Real-time telemetry and community node communication signals from the Big Games global infrastructure.' }
      }
    };
    if (!saved) return defaults;
    const parsed = JSON.parse(saved);
    return { ...defaults, ...parsed, page_data: { ...defaults.page_data, ...(parsed.page_data || {}) } };
  } catch (e) {
    console.error('Error parsing settings', e);
    return {
      hero_text: 'The Future of Gaming is Here.',
      hero_banner: '/hero.png',
      hero_logo: '/logo.png',
      youtube_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      spotlight_title: 'Quantum Node Evolution',
      spotlight_desc: 'Deep dive into the decentralized architecture powering the future of the network.',
      popup_text: 'Join the Big Games Inner Circle',
      popup_frequency: 2000,
      page_data: {
        feed: { title: 'The_Feed', desc: 'The latest unfiltered intelligence, transmissions, and developer news from across the Big Games Network.' },
        archive: { title: 'Archive_Logs', desc: 'Access the complete historical record of developer logs, community broadcasts, and sonic experimentations from the Big Games core.' },
        signals: { title: 'Signals_Hub', desc: 'Real-time telemetry and community node communication signals from the Big Games global infrastructure.' }
      }
    };
  }
};

const getInitialUsers = () => {
  try {
    const saved = localStorage.getItem('bg_users');
    return saved ? JSON.parse(saved) : [
      { id: 'u1', email: 'info.p2sr@gmail.com', password: 'Mtvkannon2020@1', isOver18: true, role: 'user', username: 'info_p2sr', bio: 'Content Creator', created_at: new Date().toISOString() }
    ];
  } catch (e) {
    return [];
  }
};

const getInitialSocialPosts = () => {
  try {
    const saved = localStorage.getItem('bg_social_posts');
    const posts = saved ? JSON.parse(saved) : [];
    return posts;
  } catch (e) {
    return [];
  }
};
export const mockDB = {
  posts: getInitialPosts(),
  podcasts: getInitialPodcasts(),
  settings: getInitialSettings(),
  users: getInitialUsers(),
  socialPosts: getInitialSocialPosts()
};

// Simple event system for local "real-time" updates
export const dbEvents = new EventTarget();
export const notifyChange = () => dbEvents.dispatchEvent(new Event('change'));

// REAL SUPABASE PERSISTENCE
export const saveToMockSettings = async (newSettings) => {
  mockDB.settings = { ...mockDB.settings, ...newSettings };
  
  // 1. Local Fallback
  try {
    localStorage.setItem('bg_settings', JSON.stringify(mockDB.settings));
  } catch(e) {
    console.warn('Storage quota exceeded');
  }

  // 2. Real Supabase Push
  if (isSupabaseConfigured) {
    const { error } = await supabase
      .from('settings')
      .upsert({ id: 'global', ...mockDB.settings });
    if (error) console.error('Supabase settings sync failed:', error.message);
  }

  notifyChange();
};

export const saveToMockPosts = async (newPosts) => {
  mockDB.posts = newPosts;
  
  // 1. Local Fallback
  try {
    localStorage.setItem('bg_posts', JSON.stringify(mockDB.posts));
  } catch(e) {
    console.warn('Storage quota exceeded');
  }

  // 2. Real Supabase Push
  if (isSupabaseConfigured) {
    const { error } = await supabase
      .from('posts')
      .upsert(newPosts);
    if (error) console.error('Supabase posts sync failed:', error.message);
  }

  notifyChange();
};

export const saveToMockPodcasts = async (newPodcasts) => {
  mockDB.podcasts = newPodcasts;
  try {
    localStorage.setItem('bg_podcasts', JSON.stringify(mockDB.podcasts));
  } catch(e) {
    console.warn('Storage quota exceeded');
  }

  if (isSupabaseConfigured) {
    const { error } = await supabase
      .from('podcasts')
      .upsert(newPodcasts);
    if (error) console.error('Supabase podcasts sync failed:', error.message);
  }

  notifyChange();
};

export const saveToMockUsers = async (newUsers) => {
  mockDB.users = newUsers;
  try {
    localStorage.setItem('bg_users', JSON.stringify(mockDB.users));
  } catch(e) {
    console.warn('Storage quota exceeded');
  }

  if (isSupabaseConfigured) {
    const { error } = await supabase
      .from('users')
      .upsert(newUsers);
    if (error) console.error('Supabase user sync failed:', error.message);
  }

  notifyChange();
};

export const saveToMockSocialPosts = async (newSocialPosts) => {
  mockDB.socialPosts = newSocialPosts;
  try {
    localStorage.setItem('bg_social_posts', JSON.stringify(mockDB.socialPosts));
  } catch(e) {
    console.warn('Storage quota exceeded');
  }

  if (isSupabaseConfigured) {
    const { error } = await supabase
      .from('social_posts')
      .upsert(newSocialPosts);
    if (error) console.error('Supabase social sync failed:', error.message);
  }

  notifyChange();
};

