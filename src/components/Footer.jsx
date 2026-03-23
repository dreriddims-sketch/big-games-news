/* src/components/Footer.jsx */
import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Instagram, Youtube, Github, Mail, Shield, Scale, Briefcase, Network } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const sections = [
    {
      title: 'Corporate',
      links: [
        { name: 'Jobs & Careers', path: '/careers', icon: <Briefcase size={14} /> },
        { name: 'Press Inquiries', path: '/press', icon: <Mail size={14} /> },
        { name: 'Privacy Policy', path: '/privacy', icon: <Shield size={14} /> },
        { name: 'Terms of Service', path: '/terms', icon: <Scale size={14} /> }
      ]
    },
    {
      title: 'Network',
      links: [
        { name: 'Developer Hub', path: '/signals', icon: <Network size={14} /> },
        { name: 'Partner Portal', path: '/archive', icon: <Scale size={14} /> },
        { name: 'Brand Assets', path: '/feed', icon: <Shield size={14} /> }
      ]
    }
  ];

  const socialLinks = [
    { name: 'Twitter', icon: <Twitter size={18} />, url: 'https://twitter.com/biggames' },
    { name: 'Instagram', icon: <Instagram size={18} />, url: 'https://instagram.com/biggames' },
    { name: 'Youtube', icon: <Youtube size={18} />, url: 'https://youtube.com/biggames' },
    { name: 'Github', icon: <Github size={18} />, url: 'https://github.com/biggames' }
  ];

  return (
    <footer className="py-24 px-6 border-t border-white/5 bg-bg-darker relative z-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 lg:gap-24">
        <div className="col-span-1 md:col-span-2 space-y-8">
          <Link to="/" className="flex items-center gap-4 group">
             <img src="/nav-logo.png" alt="Big Games" className="h-14 w-auto grayscale brightness-200 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700" />
             <div className="flex flex-col">
               <span className="text-2xl font-black text-white uppercase tracking-tighter italic leading-none">Big_Games</span>
               <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Network Intelligence</span>
             </div>
          </Link>
          <p className="text-text-secondary max-w-sm text-sm leading-relaxed font-medium opacity-60">
            Pioneering the next evolution of decentralized interactive entertainment. Big Games News is your direct uplink to the core developer network and the evolving digital landscape.
          </p>
          <div className="flex items-center gap-4 pt-4">
             {socialLinks.map((social) => (
               <a 
                 key={social.name}
                 href={social.url}
                 target="_blank"
                 rel="noopener noreferrer"
                 className="w-12 h-12 rounded-2xl glass border-white/5 hover:border-primary/40 transition-all flex items-center justify-center text-text-secondary hover:text-primary hover:scale-110 group shadow-2xl shadow-black/40"
                 title={social.name}
               >
                 {social.icon}
               </a>
             ))}
          </div>
        </div>
        
        {sections.map((section) => (
          <div key={section.title} className="space-y-8">
             <h4 className="text-white font-black uppercase tracking-[0.3em] text-xs flex items-center gap-3">
               <div className="w-6 h-px bg-primary/40" />
               {section.title}
             </h4>
             <ul className="space-y-4">
               {section.links.map((link) => (
                 <li key={link.name}>
                   <Link 
                     to={link.path} 
                     className="group flex items-center gap-3 text-sm text-text-secondary font-bold hover:text-primary transition-all uppercase italic tracking-wider"
                   >
                     <span className="text-primary/0 group-hover:text-primary transition-all duration-300">
                       {link.icon}
                     </span>
                     {link.name}
                   </Link>
                 </li>
               ))}
             </ul>
          </div>
        ))}
      </div>
      
      <div className="max-w-7xl mx-auto pt-12 mt-16 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 opacity-40 text-[10px] font-black uppercase tracking-[0.4em]">
         <div className="flex items-center gap-6">
           <p>© {currentYear} Big Games Inc. All Rights Reserved.</p>
           <div className="w-1 h-1 rounded-full bg-white/20" />
           <p>Terminal Session ID: BG-{Math.floor(Math.random() * 8999) + 1000}</p>
         </div>
         <div className="flex items-center gap-8">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
            <span className="text-primary">Status: OPTIMIZED</span>
         </div>
      </div>
    </footer>
  );
};

export default Footer;
