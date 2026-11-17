import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Leaf, 
  Home, 
  BarChart3, 
  PlusCircle, 
  MapPin, 
  ClipboardList, 
  FileText, 
  UserCheck, 
  LogOut, 
  Sun, 
  Moon, 
  Bell, 
  Menu, 
  X,
  Layers,
  Wrench,
  ShieldCheck,
  GraduationCap,
  Activity
} from 'lucide-react';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen }) => {
  const { 
    currentRole, 
    currentUser, 
    isDarkMode, 
    toggleDarkMode, 
    notifications, 
    unreadCount, 
    markNotificationAsRead,
    clearAllNotifications,
    logout 
  } = useApp();

  const location = useLocation();
  const navigate = useNavigate();
  const [notifOpen, setNotifOpen] = useState(false);

  // Strictly segregated nav options according to user role:
  // - Student: ONLY Home, Dashboard, Report
  // - Technician: ONLY Digital Mapping, Order of Working, Report Details
  // - Administrator: ONLY Digital Mapping, Order of Working, Report Details
  const getNavItems = () => {
    if (currentRole === 'student') {
      return [
        { name: 'Home', path: '/', icon: <Home className="w-5 h-5" />, badge: null },
        { name: 'Dashboard', path: '/dashboard', icon: <BarChart3 className="w-5 h-5" />, badge: 'Student View' },
        { name: 'Report', path: '/reports', icon: <PlusCircle className="w-5 h-5" />, badge: 'New' }
      ];
    } else if (currentRole === 'maintenance') {
      return [
        { name: 'Digital Mapping', path: '/digital-twin', icon: <MapPin className="w-5 h-5" />, badge: 'Live Twin' },
        { name: 'Order of Working', path: '/orders', icon: <ClipboardList className="w-5 h-5" />, badge: 'Tasks' },
        { name: 'Report Details', path: '/reports', icon: <FileText className="w-5 h-5" />, badge: null }
      ];
    } else {
      // Administrator: Reporting Dashboard, Digital Mapping, Work Inspection (Order of Working removed!)
      return [
        { name: 'Reporting Dashboard', path: '/admin-reporting', icon: <FileText className="w-5 h-5" />, badge: 'Workflow Graphs' },
        { name: 'Digital Mapping', path: '/digital-twin', icon: <MapPin className="w-5 h-5" />, badge: 'Spatial' },
        { name: 'Work Inspection', path: '/reports', icon: <ShieldCheck className="w-5 h-5" />, badge: 'Ensure Proof' }
      ];
    }
  };

  const navItems = getNavItems();

  const roleDetails = {
    student: {
      title: 'Student Reporter',
      icon: <GraduationCap className="w-4 h-4 text-cyan-400" />,
      color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
    },
    maintenance: {
      title: 'Technician Crew',
      icon: <Wrench className="w-4 h-4 text-amber-400" />,
      color: 'bg-amber-500/10 text-amber-400 border-amber-500/30'
    },
    admin: {
      title: 'Sustainability Admin',
      icon: <ShieldCheck className="w-4 h-4 text-purple-400" />,
      color: 'bg-purple-500/10 text-purple-400 border-purple-500/30'
    }
  }[currentRole];

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between p-4 text-left select-none">
      
      {/* Top Branding & Profile Header */}
      <div className="space-y-4">
        
        {/* Brand */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <Link to="/" className="flex items-center gap-2.5 group" onClick={() => setMobileOpen(false)}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 flex items-center justify-center shadow-glow-cyan transform group-hover:scale-105 transition-transform">
              <Leaf className="w-5 h-5 text-slate-950 fill-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-black text-base tracking-tight text-white">
                  EcoVerse<span className="text-cyan-400">.AI</span>
                </span>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.2 rounded font-mono">
                  v2.4
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium block">
                Campus Facility Intelligence
              </span>
            </div>
          </Link>

          {/* Close button for mobile */}
          <button 
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Persona Profile Card */}
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${roleDetails.color}`}>
              {roleDetails.icon}
              <span>{roleDetails.title}</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Active</span>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 text-slate-950 font-bold flex items-center justify-center text-xs shadow-sm">
              {currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-slate-100 truncate">{currentUser.name}</div>
              <div className="text-[10px] text-slate-400 truncate">{currentUser.email}</div>
            </div>
          </div>
        </div>

        {/* Vertical Navigation (Top-to-Bottom) */}
        <div className="space-y-1 pt-1">
          <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            {currentRole === 'student' ? 'Student Workspace' : currentRole === 'maintenance' ? 'Technician Controls' : 'Administrator Console'}
          </div>

          {navItems.map(item => {
            const isActive = location.pathname === item.path || (item.path === '/' && location.pathname === '');

            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500/20 to-cyan-500/10 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-cyan-400' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-semibold ${
                    isActive ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

      </div>

      {/* Bottom Actions: Theme, Notifications, Status, Logout */}
      <div className="space-y-3 pt-4 border-t border-slate-800">
        
        {/* Telemetry Status Indicator */}
        <div className="px-3 py-2 rounded-lg bg-slate-950/80 border border-slate-800/80 flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-slate-400">Campus IoT Net</span>
          </div>
          <span className="text-emerald-400 font-mono font-semibold">Online</span>
        </div>

        {/* Quick Utility Toggles (Alerts hidden for student) */}
        <div className={currentRole === 'student' ? 'flex flex-col gap-2' : 'grid grid-cols-2 gap-2'}>
          
          {/* Notifications Modal Trigger - Hidden for Students/Faculty */}
          {currentRole !== 'student' && (
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="w-full flex items-center justify-center gap-1.5 p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-semibold transition"
                title="Notifications"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>Alerts</span>
                {unreadCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 rounded-full bg-cyan-500 text-slate-950 text-[10px] font-bold">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Popover */}
              {notifOpen && (
                <div className="absolute bottom-12 left-0 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-3 z-50 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="font-bold text-slate-100">Live Alerts ({notifications.length})</span>
                    {unreadCount > 0 && (
                      <button onClick={clearAllNotifications} className="text-[10px] text-cyan-400 hover:underline">
                        Mark read
                      </button>
                    )}
                  </div>
                  <div className="max-h-48 overflow-y-auto space-y-2 mt-2 divide-y divide-slate-800">
                    {notifications.map(n => (
                      <div 
                        key={n.id} 
                        onClick={() => markNotificationAsRead(n.id)}
                        className="pt-1.5 cursor-pointer hover:text-cyan-300"
                      >
                        <div className="font-semibold text-slate-200 text-[11px]">{n.title}</div>
                        <div className="text-[10px] text-slate-400 line-clamp-1">{n.message}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Theme Toggle */}
          <button
            onClick={toggleDarkMode}
            className="w-full flex items-center justify-center gap-1.5 p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-semibold transition"
            title="Toggle Theme"
          >
            {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-400" />}
            <span>{isDarkMode ? 'Light' : 'Dark'}</span>
          </button>
        </div>

        {/* Sign Out Button */}
        <button
          onClick={handleSignOut}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-800 hover:border-rose-500/40 transition"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>

      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Left Sidebar (Arranged Top to Bottom) */}
      <aside className="hidden lg:flex flex-col w-64 flex-shrink-0 h-screen sticky top-0 bg-slate-950 border-r border-slate-800 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer (Slide in from left) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-72 max-w-[80vw] h-full bg-slate-950 border-r border-slate-800 z-10 shadow-2xl">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
