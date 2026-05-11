import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { logout } from './utils/storage';
import { Newspaper, Info, Trophy, FileText, Activity, Users, Phone, LogOut, LayoutDashboard, ArrowLeft } from 'lucide-react';

const adminTabs = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/news', label: 'News', icon: Newspaper },
  { path: '/admin/about', label: 'About', icon: Info },
  { path: '/admin/achievements', label: 'Achievements', icon: Trophy },
  { path: '/admin/documents', label: 'Documents', icon: FileText },
  { path: '/admin/activities', label: 'Activities', icon: Activity },
  { path: '/admin/applications', label: 'Applications', icon: Users },
  { path: '/admin/contact', label: 'Contact', icon: Phone },
];

export const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="bg-school-gold text-school-navy text-center py-1 text-xs font-bold uppercase tracking-widest">
        ⚙ Admin Mode — Changes affect the live website
      </div>
      <nav className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <button onClick={() => navigate('/')} className="flex items-center gap-2 text-sm text-gray-300 hover:text-white">
                <ArrowLeft size={16} /> Back
              </button>
              <Link to="/admin" className="text-lg font-bold text-white">
                <span style={{ color: '#F5A800' }}>PTHS</span> Staff Portal
              </Link>
            </div>
            <div className="hidden md:flex items-center gap-1">
              {adminTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = location.pathname === tab.path;
                return (
                  <Link key={tab.path} to={tab.path} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-school-navy text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}>
                    <Icon size={16} />{tab.label}
                  </Link>
                );
              })}
            </div>
            <button onClick={() => { logout(); navigate('/admin/login'); }} className="flex items-center gap-2 text-sm text-gray-400 hover:text-red-400">
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
        <div className="md:hidden overflow-x-auto px-2 pb-2 flex gap-1">
          {adminTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = location.pathname === tab.path;
            return (
              <Link key={tab.path} to={tab.path} className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap font-medium ${isActive ? 'bg-school-navy text-white' : 'text-gray-400 bg-gray-700'}`}>
                <Icon size={14} />{tab.label}
              </Link>
            );
          })}
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
};
