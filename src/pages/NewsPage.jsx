/* src/pages/NewsPage.jsx */
import React from 'react';
import HeroBanner from '../components/HeroBanner';
import PodcastGrid from '../components/PodcastGrid';
import ArticleFeed from '../components/ArticleFeed';
import NewsletterPopup from '../components/NewsletterPopup';
import Footer from '../components/Footer';
import AdBanner from '../components/AdBanner';


const NewsPage = () => {
  return (
    <div className="flex-1 bg-deep relative min-h-screen flex flex-col">
      {/* Subtle Background Layer */}
      <div className="fixed inset-0 bg-grid pointer-events-none opacity-10 z-0 bg-black/40" />
      
      <main className="relative z-10 flex-1 pb-32">
        {/* 1. Hero Spotlight - Focused & Premium */}
        <section className="border-b border-white/5 bg-black/40 backdrop-blur-3xl">
          <HeroBanner />
        </section>
        
        <AdBanner className="pt-24 md:pt-32" />

        <div className="max-w-[1440px] mx-auto">
          {/* 2. Content Hub - Podcasts / Intelligence */}
          <PodcastGrid />

          {/* 3. Main Transmission Feed */}
          <ArticleFeed />
        </div>
      </main>

      {/* Global Newsletter Popup */}
      <NewsletterPopup />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default NewsPage;
