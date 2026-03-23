import { mockDB } from './supabase';

/**
 * Mock Email Service
 * In a production environment, this would call your backend endpoint
 * (e.g. Supabase Edge Function, Resend, SendGrid) to securely dispatch the email.
 */
export const sendWelcomeEmail = async (emailAddress) => {
  return new Promise((resolve) => {
    console.log(`[EMAIL DISPATCHER] Initiating welcome sequence for: ${emailAddress}`);

    const settings = mockDB.settings;
    const isMember = mockDB.users.some(u => u.email === emailAddress);
    const latestPosts = mockDB.posts
      .filter(p => p.status === 'published')
      .slice(0, 3);
    const latestPodcasts = mockDB.podcasts.slice(0, 3);

    // Dynamic Site Information
    const siteLogo = settings.hero_logo || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=200';
    const siteBanner = settings.hero_brand_banner || settings.hero_banner || 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=1200';
    const welcomeText = settings.popup_text || "You've successfully secured exclusive access to the Big Games network. From now on, you'll be the first to receive critical transmissions, developer intelligence, and unreleased content.";

    const baseUrl = window.location.origin;

    const emailHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Outfit', 'Inter', sans-serif; background-color: #08080a; color: #ffffff; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; background-color: #08080a; }
          .header { text-align: center; padding: 40px 20px; }
          .logo { height: 50px; width: auto; margin-bottom: 20px; }
          .banner { width: 100%; height: 250px; object-fit: cover; border-radius: 20px; }
          .content-box { background-color: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08); border-radius: 24px; padding: 35px; margin: 25px; }
          .title { color: #f59e0b; font-size: 28px; font-weight: 900; margin: 0; text-transform: uppercase; font-style: italic; }
          .subtitle { color: #94a3b8; font-size: 12px; letter-spacing: 4px; text-transform: uppercase; font-weight: 900; margin-top: 10px; }
          .welcome-title { font-size: 24px; font-weight: 900; color: #ffffff; text-transform: uppercase; margin-bottom: 15px; }
          .welcome-text { color: #94a3b8; font-size: 15px; line-height: 1.8; margin-bottom: 30px; }
          .btn { display: inline-block; padding: 18px 40px; border-radius: 50px; font-weight: 900; text-decoration: none; text-transform: uppercase; letter-spacing: 2px; font-size: 12px; transition: all 0.3s ease; }
          .btn-primary { background-color: #f59e0b; color: #000000; }
          .btn-secondary { background-color: #ffffff; color: #000000; }
          .section-title { color: #f59e0b; font-size: 12px; font-weight: 900; text-transform: uppercase; letter-spacing: 3px; border-bottom: 1px solid rgba(245,158,11,0.2); padding-bottom: 10px; margin: 40px 25px 20px; }
          .article-card { margin: 25px; background: rgba(255,255,255,0.03); border-radius: 20px; overflow: hidden; border: 1px solid rgba(255,255,255,0.05); }
          .article-img { width: 100%; height: 180px; object-fit: cover; }
          .article-content { padding: 25px; }
          .article-title { color: #ffffff; font-size: 18px; font-weight: 800; text-decoration: none; display: block; margin-bottom: 10px; text-transform: uppercase; }
          .article-excerpt { color: #64748b; font-size: 14px; line-height: 1.6; margin-bottom: 0; }
          .podcast-item { margin: 0 25px 12px; background: rgba(255,255,255,0.02); padding: 15px 20px; border-radius: 12px; border-left: 3px solid #f59e0b; }
          .footer { padding: 60px 25px; text-align: center; border-top: 1px solid rgba(255,255,255,0.05); color: rgba(148,163,184,0.4); font-size: 10px; text-transform: uppercase; font-weight: 800; letter-spacing: 2px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="${siteLogo}" class="logo" alt="Big Games Logo" />
            <div class="title">Big Games Network</div>
            <div class="subtitle">Transmission // Secured</div>
          </div>

          <div style="padding: 0 25px;">
            <img src="${siteBanner}" class="banner" alt="Network Banner" />
          </div>

          <div class="content-box">
            <h2 class="welcome-title">Connection Established.</h2>
            <p class="welcome-text">${welcomeText}</p>
            <div style="text-align: center;">
              ${isMember 
                ? `<a href="${baseUrl}/signin" class="btn btn-primary">Enter the Node</a>`
                : `<a href="${baseUrl}/signup" class="btn btn-secondary">Claim Identity</a>`
              }
            </div>
          </div>

          <div class="section-title">Latest Intelligence Feed</div>
          ${latestPosts.map(post => `
            <div class="article-card">
              <img src="${post.banner_url || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=2070'}" class="article-img" />
              <div class="article-content">
                <a href="${baseUrl}/article/${post.slug}" class="article-title">${post.title}</a>
                <p class="article-excerpt">${(post.content || '').replace(/<[^>]*>/g, '').substring(0, 100)}...</p>
              </div>
            </div>
          `).join('')}

          <div class="section-title">Audio Transmissions</div>
          ${latestPodcasts.map(pod => `
            <div class="podcast-item">
              <p style="margin: 0; font-size: 14px; font-weight: 700; color: #ffffff;">🔉 SIGNAL_ID: ${pod.title}</p>
            </div>
          `).join('')}

          <div class="footer">
            © 2026 Big Games Network // All Rights Reserved<br/>
            Ref_ID: BG-INTEL-00${Math.floor(Math.random() * 99)}
          </div>
        </div>
      </body>
      </html>
    `;

    setTimeout(() => {
      console.log(`[EMAIL DISPATCHER] Successfully delivered payload to ${emailAddress}`);
      console.log("-----------------------------------------------------------------");
      console.log("HTML PAYLOAD RENDERED SUCCESSFULLY:");
      console.log(emailHTML);
      console.log("-----------------------------------------------------------------");
      resolve({ success: true, htmlPreview: emailHTML });
    }, 800);
  });
};
