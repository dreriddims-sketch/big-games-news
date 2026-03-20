/* src/pages/Dashboard.jsx */
import React from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { 
  BarChart3, 
  PlusCircle, 
  Files, 
  Move, 
  Layout, 
  Bell, 
  ChevronRight,
  LogOut,
  User
} from 'lucide-react';
import Stats from './dashboard/Stats';
import Publish from './dashboard/Publish';
import Articles from './dashboard/Articles';
import Rearrange from './dashboard/Rearrange';
import PageSettings from './dashboard/PageSettings';
import Popups from './dashboard/Popups';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const menuItems = [
    { label: 'Statistics', icon: <BarChart3 size={20} />, path: '/dashboard' },
    { label: 'Publish News', icon: <PlusCircle size={20} />, path: '/dashboard/publish' },
    { label: 'Manage Articles', icon: <Files size={20} />, path: '/dashboard/articles' },
    { label: 'Rearrange Tool', icon: <Move size={20} />, path: '/dashboard/rearrange' },
    { label: 'Page Editor', icon: <Layout size={20} />, path: '/dashboard/settings' },
    { label: 'Visitor Prompts', icon: <Bell size={20} />, path: '/dashboard/prompts' },
  ];

  const currentTab = menuItems.find(item => item.path === location.pathname) || menuItems[0];

  return (
    <div className="flex-1 flex min-h-[calc(100vh-80px)]">
      {/* Sidebar */}
      <aside className="w-80 glass border-r border-white/5 p-8 flex flex-col gap-12 sticky top-20 h-[calc(100vh-80px)] overflow-y-auto">
        <div className="space-y-2">
          <p className="text-[10px] text-text-secondary uppercase font-black tracking-widest pl-2">Control Terminal</p>
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <Link 
                key={item.path}
                to={item.path}
                className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all font-bold text-sm tracking-tight ${
                  location.pathname === item.path 
                    ? 'bg-primary text-black shadow-lg shadow-primary/20 scale-[1.02]' 
                    : 'text-text-secondary hover:bg-white/5 hover:text-white'
                }`}
              >
                {item.icon}
                {item.label}
                {location.pathname === item.path && <ChevronRight size={16} className="ml-auto" />}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-auto space-y-6">
           <Link to="/" className="w-full btn-secondary py-3 flex items-center justify-center gap-2 text-xs uppercase font-black hover:text-primary">
              <LogOut size={14} className="rotate-180" /> Back to News
           </Link>
           <div className="glass p-4 rounded-2xl border-white/10 space-y-3">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-black uppercase text-xs">AD</div>
                 <div className="overflow-hidden">
                    <p className="text-sm font-bold truncate text-white uppercase italic">{user?.email}</p>
                    <p className="text-[10px] text-text-secondary font-black uppercase tracking-widest">Master Admin</p>
                 </div>
              </div>
              <button 
                onClick={logout}
                className="w-full btn-secondary py-3 flex items-center justify-center gap-2 text-xs uppercase font-black"
              >
                <LogOut size={14} /> Exit Terminal
              </button>
           </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-12 bg-black/20">
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-right-4 duration-700">
           <div className="flex items-end justify-between border-b border-white/5 pb-8">
              <div className="space-y-2">
                 <h1 className="text-5xl font-black uppercase tracking-tighter">{currentTab.label}</h1>
                 <p className="text-text-secondary text-base font-medium">Manage and refine your digital network assets.</p>
              </div>
              <div className="hidden lg:flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-text-secondary/50">
                 System Status: <span className="text-emerald-500">Operational</span>
                 <div className="h-4 w-px bg-white/10 mx-2" />
                 Server: <span className="text-white">US-EAST-1</span>
              </div>
           </div>

           <div className="py-4">
              <Routes>
                <Route index element={<Stats />} />
                <Route path="publish" element={<Publish />} />
                <Route path="articles" element={<Articles />} />
                <Route path="rearrange" element={<Rearrange />} />
                <Route path="settings" element={<PageSettings />} />
                <Route path="prompts" element={<Popups />} />
              </Routes>
           </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
