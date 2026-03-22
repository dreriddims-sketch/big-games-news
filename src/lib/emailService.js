import { mockDB } from './supabase';

/**
 * Mock Email Service
 * In a production environment, this would call your backend endpoint
 * (e.g. Supabase Edge Function, Resend, SendGrid) to securely dispatch the email.
 */
export const sendWelcomeEmail = async (emailAddress) => {
  return new Promise((resolve) => {
    console.log(`[EMAIL DISPATCHER] Initiating welcome sequence for: ${emailAddress}`);

    // 1. Check if the email belongs to an already registered member
    const isMember = mockDB.users.some(u => u.email === emailAddress);

    // 2. Fetch the 3 latest news articles
    const latestPosts = mockDB.posts
      .filter(p => p.status === 'published')
      .slice(0, 3);

    // 3. Fetch the latest podcasts
    const latestPodcasts = mockDB.podcasts.slice(0, 3);

    // 4. Construct the Email HTML Template
    const emailHTML = `
      <!DOCTYPE html>
      <html>
      <body style="font-family: 'Inter', sans-serif; background-color: #08080a; color: #ffffff; padding: 40px; max-width: 600px; margin: 0 auto; line-height: 1.6;">
        
        <div style="text-align: center; margin-bottom: 40px;">
          <h1 style="color: #ff9900; font-size: 32px; font-weight: 900; font-style: italic; text-transform: uppercase; margin: 0;">Big Games Inc.</h1>
          <p style="color: #94a3b8; font-size: 14px; letter-spacing: 2px; text-transform: uppercase;">Connection Established</p>
        </div>

        <div style="background-color: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 30px; margin-bottom: 30px;">
          <h2 style="font-size: 20px; font-weight: 800; margin-top: 0;">Welcome to the Inner Circle.</h2>
          <p style="color: #cccccc;">You've successfully secured exclusive access to the Big Games network. From now on, you'll be the first to receive critical transmissions, developer intelligence, and unreleased content.</p>
          
          <div style="text-align: center; margin-top: 30px;">
            ${isMember 
              ? `<a href="https://bgnetwork.com/signin" style="display: inline-block; background-color: #ff9900; color: #000000; padding: 16px 32px; text-decoration: none; border-radius: 50px; font-weight: 900; text-transform: uppercase; letter-spacing: 1px;">Sign In To The Node</a>`
              : `<a href="https://bgnetwork.com/signup" style="display: inline-block; background-color: #ffffff; color: #000000; padding: 16px 32px; text-decoration: none; border-radius: 50px; font-weight: 900; text-transform: uppercase; letter-spacing: 1px;">Setup Your Identity Profile</a>`
            }
          </div>
        </div>

        <h3 style="color: #ff9900; text-transform: uppercase; letter-spacing: 1px; font-size: 14px; border-bottom: 1px solid rgba(255,153,0,0.3); padding-bottom: 10px;">Latest Transmissions</h3>
        ${latestPosts.map(post => `
          <div style="margin-bottom: 20px;">
            <a href="https://bgnetwork.com/article/${post.slug}" style="color: #ffffff; text-decoration: none; font-weight: 700; font-size: 16px;">${post.title}</a>
            <p style="color: #94a3b8; font-size: 13px; margin: 4px 0 0 0;">${post.content.substring(0, 80)}...</p>
          </div>
        `).join('')}

        <h3 style="color: #ff9900; text-transform: uppercase; letter-spacing: 1px; font-size: 14px; border-bottom: 1px solid rgba(255,153,0,0.3); padding-bottom: 10px; margin-top: 40px;">Audio Logs</h3>
        ${latestPodcasts.map(pod => `
          <div style="margin-bottom: 12px; background-color: rgba(255,255,255,0.05); padding: 12px; border-radius: 8px;">
            <p style="margin: 0; font-size: 14px; font-weight: 600;">🔈 ${pod.title}</p>
          </div>
        `).join('')}

      </body>
      </html>
    `;

    // Simulate network delay for sending email
    setTimeout(() => {
      console.log(`[EMAIL DISPATCHER] Successfully delivered payload to ${emailAddress}`);
      console.log("-----------------------------------------------------------------");
      console.log("HTML PAYLOAD RENDER:");
      console.log(emailHTML);
      console.log("-----------------------------------------------------------------");
      resolve({ success: true, htmlPreview: emailHTML });
    }, 800);
  });
};
