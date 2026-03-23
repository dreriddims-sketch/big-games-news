/* src/pages/LegalPage.jsx */
import React from 'react';
import { Shield, Scale, Briefcase, Mail, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

const LegalPage = ({ type = 'privacy' }) => {
  const content = {
    privacy: {
      title: 'Privacy Policy',
      icon: <Shield className="text-primary" size={48} />,
      desc: 'Our commitment to protecting your digital footprint within the Big Games network.',
      text: `At Big Games, we take data sovereignty seriously. This policy outlines how we handle terminal session data, user identification logs, and network telemetry. We do not sell your soul or your data to 3rd party advertising conglomerates.`
    },
    terms: {
      title: 'Terms of Service',
      icon: <Scale className="text-primary" size={48} />,
      desc: 'The rules of engagement for interacting with the Big Games News Terminal.',
      text: `By accessing this uplink, you agree to abide by the Network Code of Conduct. Any attempt to breach the core developer nodes or inject malicious logic will result in immediate termination of your digital identity.`
    },
    careers: {
      title: 'Jobs & Careers',
      icon: <Briefcase className="text-primary" size={48} />,
      desc: 'Join the engineering elite building the future of the network.',
      text: `We are always looking for rogue developers, data architects, and sonic experimenters. If you believe you have the bandwidth to contribute to the Big Games core, submit your portfolio to our intelligence department.`
    },
    press: {
      title: 'Press Inquiries',
      icon: <Mail className="text-primary" size={48} />,
      desc: 'Official communication channel for media and global broadcast updates.',
      text: `For official statements, brand assets, and high-resolution terminal logs, contact our communications array. We prioritize requests from verified independent journalism nodes.`
    }
  };

  const { title, icon, desc, text } = content[type] || content.privacy;

  return (
    <div className="min-h-screen bg-deep flex flex-col pt-32 px-6">
      <div className="max-w-4xl mx-auto w-full flex-1 space-y-12">
        <Link to="/" className="inline-flex items-center gap-2 text-white/40 hover:text-primary transition-colors text-xs font-black uppercase tracking-widest group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Terminal
        </Link>

        <div className="space-y-6">
          <div className="w-20 h-20 rounded-3xl glass flex items-center justify-center border-white/10 shadow-2xl">
            {icon}
          </div>
          <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter text-white">
            {title}
          </h1>
          <p className="text-primary text-lg font-black uppercase tracking-[0.2em] italic opacity-80">
            {desc}
          </p>
        </div>

        <div className="premium-card p-8 md:p-12 space-y-8 border-white/10 bg-white/5 backdrop-blur-3xl rounded-3xl text-text-secondary leading-relaxed text-lg">
           <p className="border-l-4 border-primary/40 pl-8 italic">
             {text}
           </p>
           <div className="space-y-4 pt-8">
             <h3 className="text-white font-black uppercase tracking-widest text-sm">Protocol Update</h3>
             <p className="text-sm opacity-60">
               Last Synchronized: {new Date().toLocaleDateString()} // STATUS: COMPLIANT
             </p>
           </div>
        </div>
      </div>
      <div className="mt-32">
        <Footer />
      </div>
    </div>
  );
};

export default LegalPage;
