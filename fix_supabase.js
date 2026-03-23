
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://crctustykqeazzzlhliq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNyY3R1c3R5a3FlYXp6emxobGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2MDUzNjgsImV4cCI6MjA4OTE4MTM2OH0.ESK-0FsG2E7niegtHLpvkHaTf-7_k9l7Kly62nUecjc';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function fixPendingPosts() {
  console.log('--- SCANNING FOR UNRESOLVED TRANSMISSIONS ---');
  
  const { data: posts, error: fetchError } = await supabase
    .from('social_posts')
    .select('id, username, status, description')
    .eq('status', 'pending');

  if (fetchError) {
    console.error('Fetch Error:', fetchError.message);
    return;
  }

  if (!posts || posts.length === 0) {
    console.log('No pending transmissions found.');
    return;
  }

  console.log(`Found ${posts.length} pending posts. Initiating override...`);

  for (const post of posts) {
    console.log(`Authorizing: @${post.username} | ID: ${post.id}`);
    
    // Attempt standard update
    const { data, error } = await supabase
      .from('social_posts')
      .update({ status: 'active' })
      .eq('id', post.id)
      .select();

    if (error) {
      console.error(`- FAILED (RLS Restriction?): ${error.message}`);
    } else if (data && data.length > 0) {
      console.log(`- SUCCESS: Transmission ${post.id} is now LIVE.`);
    } else {
      console.warn(`- NO MATCH: ID ${post.id} could not be resolved during update.`);
    }
  }
}

fixPendingPosts();
