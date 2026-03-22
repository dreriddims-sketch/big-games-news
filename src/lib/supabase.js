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

export const saveToMockSettings = (newSettings) => {
  mockDB.settings = { ...mockDB.settings, ...newSettings };
  localStorage.setItem('bg_settings', JSON.stringify(mockDB.settings));
  notifyChange();
};

export const saveToMockPosts = (newPosts) => {
  mockDB.posts = newPosts;
  localStorage.setItem('bg_posts', JSON.stringify(mockDB.posts));
  notifyChange();
};

export const saveToMockPodcasts = (newPodcasts) => {
  mockDB.podcasts = newPodcasts;
  try {
    localStorage.setItem('bg_podcasts', JSON.stringify(mockDB.podcasts));
  } catch(e) {
    console.warn('Storage quota exceeded, changes saved to memory only');
  }
  notifyChange();
};
