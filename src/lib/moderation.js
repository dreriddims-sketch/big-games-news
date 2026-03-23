/* src/lib/moderation.js */
import { updatePostStatus } from './supabase';

/**
 * AI Content Moderation System
 * Scans video metadata and thumbnails for violations.
 * In a production environment, this would call Gemini 1.5 Flash.
 */
export const scanVideoSafety = async (post) => {
  console.log(`[AI Radar] Scanning video: ${post.id} for ${post.username}...`);

  // Simulate AI Latency
  await new Promise(resolve => setTimeout(resolve, 1500));

  // LOGIC: Simple heuristic for local testing + AI placeholder
  // In reality: const aiResult = await gemini.analyze(post.videoUrl);
  
  let riskLevel = 'safe';
  let reason = 'Clean transmission.';

  // Example heuristic: 18+ check or specific keywords in description
  const description = (post.description || '').toLowerCase();
  const violations = ['nude', 'kill', 'abuse', 'violence', 'blood', 'sex'];
  
  const foundViolations = violations.filter(v => description.includes(v));

  if (foundViolations.length > 0) {
    riskLevel = 'dangerous';
    reason = `AI identified risky keywords: ${foundViolations.join(', ')}`;
  } else if (post.is_over_18 === false && description.includes('horror')) {
    riskLevel = 'warning';
    reason = 'Age-restricted content suspected.';
  }

  return { riskLevel, reason };
};

export const autoModerate = async (post) => {
  const { riskLevel, reason } = await scanVideoSafety(post);
  
  if (riskLevel === 'safe') {
    // Auto-approve if AI is extremely confident
    console.log(`[AI Radar] Auto-approving post ${post.id}`);
    await updatePostStatus(post.id, 'approved');
    return { status: 'approved', reason };
  } else if (riskLevel === 'dangerous') {
    // Auto-reject or flag
    console.log(`[AI Radar] Flagging dangerous content in post ${post.id}`);
    // We keep it as pending but add an AI Flag
    return { status: 'flagged', reason };
  }
  
  return { status: 'pending', reason };
};
