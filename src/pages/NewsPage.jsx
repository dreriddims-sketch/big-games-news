/* src/pages/NewsPage.jsx */
import React from 'react';
import HeroBanner from '../components/HeroBanner';
import PodcastGrid from '../components/PodcastGrid';
import ArticleFeed from '../components/ArticleFeed';
import NewsletterPopup from '../components/NewsletterPopup';

const NewsPage = () => {
  return (
    <div className="flex-1 animate-in fade-in duration-1000">
      {/* Podcasts Section (directly under Nav) */}
      <PodcastGrid />
      
      {/* Hero Section */}
      <section className="py-12 border-y border-white/5 bg-gradient-to-b from-transparent to-bg-darker/30">
        <HeroBanner />
      </section>

      {/* Main Content Feed */}
      <ArticleFeed />

      {/* Global Newsletter Popup */}
      <NewsletterPopup />

      {/* Footer */}
      <footer className="py-24 px-6 border-t border-white/5 bg-bg-darker">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-2 space-y-6">
            <img src="/logo.png" alt="Big Games" className="h-12 w-auto grayscale brightness-200" />
            <p className="text-text-secondary max-w-sm text-sm leading-relaxed">
              Experience the future of gaming. Big Games News brings you the latest stories, deep dives, and exclusive access to our evolving digital landscape.
            </p>
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-xl glass border-white/10 hover:border-primary/40 transition-all flex items-center justify-center cursor-pointer text-text-secondary hover:text-primary">
                 TW
               </div>
               <div className="w-10 h-10 rounded-xl glass border-white/10 hover:border-primary/40 transition-all flex items-center justify-center cursor-pointer text-text-secondary hover:text-primary">
                 IG
               </div>
               <div className="w-10 h-10 rounded-xl glass border-white/10 hover:border-primary/40 transition-all flex items-center justify-center cursor-pointer text-text-secondary hover:text-primary">
                 YT
               </div>
            </div>
          </div>
          
          <div className="space-y-4">
             <h4 className="text-white font-black uppercase tracking-widest text-sm">Corporate</h4>
             <ul className="space-y-2 text-sm text-text-secondary font-medium">
               <li className="hover:text-primary transition-colors cursor-pointer italic uppercase">Jobs & Careers</li>
               <li className="hover:text-primary transition-colors cursor-pointer italic uppercase">Press Inquiries</li>
               <li className="hover:text-primary transition-colors cursor-pointer italic uppercase">Privacy Policy</li>
               <li className="hover:text-primary transition-colors cursor-pointer italic uppercase">Terms of Service</li>
             </ul>
          </div>

          <div className="space-y-4">
             <h4 className="text-white font-black uppercase tracking-widest text-sm">Network</h4>
             <ul className="space-y-2 text-sm text-text-secondary font-medium">
               <li className="hover:text-primary transition-colors cursor-pointer italic uppercase">Developer Hub</li>
               <li className="hover:text-primary transition-colors cursor-pointer italic uppercase">Partner Portal</li>
               <li className="hover:text-primary transition-colors cursor-pointer italic uppercase">Brand Assets</li>
             </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto pt-12 mt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 opacity-30 text-[10px] font-black uppercase tracking-[0.2em]">
           <p>© 2026 Big Games Inc. All Rights Reserved.</p>
           <p>Terminal Session ACTIVE // ID: BG-0042</p>
        </div>
      </footer>
    </div>
  );
};

export default NewsPage;
