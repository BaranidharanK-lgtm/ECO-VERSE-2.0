import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Menu, PlusCircle, Leaf, UserCheck, Wrench, ShieldCheck, GraduationCap } from 'lucide-react';

interface TopBarProps {
  onOpenMobileSidebar: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onOpenMobileSidebar }) => {
  const { currentRole, currentUser } = useApp();
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return currentRole === 'student' ? 'Student Portal' : 'Operational Center';
      case '/dashboard':
        return 'Sustainability Dashboard';
      case '/reports':
        return currentRole === 'student' ? 'Report Campus Issue' : 'Report Details & Audit';
      case '/orders':
        return 'Order of Working';
      case '/digital-twin':
        return 'Campus Digital Mapping';
      case '/admin-reporting':
        return 'Reporting Dashboard';
      default:
        return 'EcoVerse Campus';
    }
  };

  return (
    <header className="sticky top-0 z-20 w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-800 px-4 py-2.5 flex items-center justify-between">
      
      {/* Mobile Hamburger & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition"
          aria-label="Open left menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <h2 className="text-sm sm:text-base font-extrabold text-slate-100 font-display">
            {getPageTitle()}
          </h2>
          <span className="hidden sm:inline-block text-[11px] text-slate-400 font-mono">
            • {currentUser.name.split(' ')[0]}
          </span>
        </div>
      </div>

      {/* Right Action */}
      <div className="flex items-center gap-2">
        {currentRole === 'student' ? (
          <Link
            to="/reports?new=true"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 hover:brightness-110 shadow-sm transition"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Report Issue</span>
          </Link>
        ) : currentRole === 'admin' ? (
          <Link
            to="/admin-reporting"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40 hover:bg-purple-500/30 transition"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
            <span>Workflow Analytics</span>
          </Link>
        ) : (
          <span className="text-[11px] font-mono text-amber-400 bg-amber-950/60 border border-amber-800/40 px-2.5 py-1 rounded-md">
            Technician Active
          </span>
        )}
      </div>

    </header>
  );
};
