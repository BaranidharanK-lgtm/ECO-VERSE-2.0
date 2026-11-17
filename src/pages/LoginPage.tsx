import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { 
  GraduationCap, 
  Wrench, 
  ShieldCheck, 
  Leaf, 
  ArrowRight, 
  CheckCircle2, 
  Sun, 
  Moon, 
  Key, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff,
  Sparkles,
  AlertCircle
} from 'lucide-react';

interface Props {
  onSuccess?: () => void;
}

export const LoginPage: React.FC<Props> = ({ onSuccess }) => {
  const { login, isDarkMode, toggleDarkMode } = useApp();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [email, setEmail] = useState('aria.sharma@ecoverse.edu');
  const [password, setPassword] = useState('demo123456');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState<string | null>(null);

  const roleConfigs: {
    role: UserRole;
    title: string;
    personName: string;
    department: string;
    email: string;
    badge: string;
    badgeColor: string;
    cardBorder: string;
    buttonColor: string;
    icon: React.ReactNode;
    features: string[];
    description: string;
  }[] = [
    {
      role: 'student',
      title: 'Student / Faculty Reporter',
      personName: 'Aria Sharma',
      department: 'Environmental Science & Engineering',
      email: 'aria.sharma@ecoverse.edu',
      badge: 'Civic Reporter',
      badgeColor: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
      cardBorder: 'hover:border-emerald-500/60 focus:border-emerald-500',
      buttonColor: 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold',
      icon: <GraduationCap className="w-7 h-7 text-emerald-400" />,
      description: 'Submit campus environmental incidents with Computer Vision photo evidence, monitor AI auto-routing, and verify completed repairs.',
      features: [
        'Report leaks, energy waste & overflowing bins',
        'Computer Vision automated classification',
        'Track personal complaint resolution history',
        'Direct resolution sign-off / reopen access'
      ]
    },
    {
      role: 'maintenance',
      title: 'Maintenance & Facilities Team',
      personName: 'Marcus Vance',
      department: 'Plumbing, HVAC & Facilities Ops',
      email: 'marcus.vance@ecoverse.edu',
      badge: 'Operational Crew',
      badgeColor: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
      cardBorder: 'hover:border-amber-500/60 focus:border-amber-500',
      buttonColor: 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold',
      icon: <Wrench className="w-7 h-7 text-amber-400" />,
      description: 'Review assigned departmental work orders, update repair statuses, record operational logs, and upload verification proof.',
      features: [
        'Acknowledge & claim department tickets',
        'Live status transitions (In-Progress / Resolved)',
        'Upload before & after repair photo evidence',
        'Technician dispatch note logs & turnaround SLA'
      ]
    },
    {
      role: 'admin',
      title: 'Campus Sustainability Administrator',
      personName: 'Dr. Sophia Vance',
      department: 'Chief Sustainability Officer',
      email: 'sophia.vance@ecoverse.edu',
      badge: 'Executive Admin',
      badgeColor: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
      cardBorder: 'hover:border-purple-500/60 focus:border-purple-500',
      buttonColor: 'bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold',
      icon: <ShieldCheck className="w-7 h-7 text-purple-400" />,
      description: 'University-wide executive analytics, automated department routing rule governance, 2D digital twin telemetry, and SLA monitoring.',
      features: [
        'Cross-campus ESG & Scope 1-3 GHG metrics',
        'Configure AI auto-routing department rules',
        'Interactive 2D Digital Twin facility oversight',
        'Audit logs, confidence thresholds & ticket overrides'
      ]
    }
  ];

  const handleSelectRole = (cfg: typeof roleConfigs[0]) => {
    setSelectedRole(cfg.role);
    setEmail(cfg.email);
    setPassword('demo123456');
  };

  const getFirstTabForRole = (role: UserRole): string => {
    switch (role) {
      case 'student':
        return '/';
      case 'maintenance':
        return '/digital-twin';
      case 'admin':
        return '/admin-reporting';
      default:
        return '/';
    }
  };

  const handleDirectLogin = (role: UserRole) => {
    setIsLoading(true);
    const cfg = roleConfigs.find(r => r.role === role)!;
    setLoginSuccess(`Signed in as ${cfg.title}`);
    
    setTimeout(() => {
      login(role);
      setIsLoading(false);
      if (onSuccess) {
        onSuccess();
      } else {
        navigate(getFirstTabForRole(role));
      }
    }, 600);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const cfg = roleConfigs.find(r => r.role === selectedRole)!;
    setLoginSuccess(`Authenticated: ${cfg.title} (${cfg.personName})`);

    setTimeout(() => {
      login(selectedRole);
      setIsLoading(false);
      if (onSuccess) {
        onSuccess();
      } else {
        navigate(getFirstTabForRole(selectedRole));
      }
    }, 600);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between relative overflow-hidden bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-white">
      
      {/* Background Glow Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <header className="relative z-10 w-full border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Leaf className="w-5 h-5 text-slate-950 fill-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-emerald-300 bg-clip-text text-transparent">
                  EcoVerse<span className="text-cyan-400">.AI</span>
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono">
                  Campus SSO
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Intelligent Sustainability Solutions & Digital Twin
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-white transition"
              title="Toggle theme"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-300" />}
            </button>
            <button
              onClick={() => handleDirectLogin('student')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Quick Guest Demo
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 my-auto w-full">
        
        {/* Title Section */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-mono">
            <Key className="w-3.5 h-3.5" />
            <span>ROLE-BASED ACCESS CONTROL (RBAC)</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display tracking-tight text-slate-100">
            Sign In to <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">EcoVerse AI</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Select your operational role below to access dedicated university sustainability workflows, digital twins, and AI triage tools.
          </p>
        </div>

        {/* Success Alert */}
        {loginSuccess && (
          <div className="max-w-xl mx-auto mb-6 p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-sm flex items-center gap-3 animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{loginSuccess} — Entering workspace...</span>
          </div>
        )}

        {/* 3 Role Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {roleConfigs.map((cfg) => {
            const isSelected = selectedRole === cfg.role;
            return (
              <div
                key={cfg.role}
                onClick={() => handleSelectRole(cfg)}
                className={`relative rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between border cursor-pointer group ${
                  isSelected
                    ? 'bg-slate-900/90 border-cyan-400 ring-2 ring-cyan-400/40 shadow-xl shadow-cyan-500/10 scale-[1.02]'
                    : 'bg-slate-900/60 border-slate-800 hover:bg-slate-900/80 hover:border-slate-700'
                }`}
              >
                {/* Header of card */}
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 group-hover:scale-110 transition-transform">
                      {cfg.icon}
                    </div>
                    <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border ${cfg.badgeColor}`}>
                      {cfg.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold font-display text-slate-100 group-hover:text-cyan-300 transition-colors">
                    {cfg.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1 mb-3">
                    <span className="font-semibold text-slate-300">{cfg.personName}</span>
                    <span>•</span>
                    <span className="line-clamp-1">{cfg.department}</span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    {cfg.description}
                  </p>

                  <div className="space-y-2 pt-2 border-t border-slate-800/80 mb-6">
                    <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
                      Role Privileges & Scope:
                    </span>
                    {cfg.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="text-[11px] leading-snug">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Role Selected Indicator */}
                <div className={`mt-4 pt-3 border-t border-slate-800 flex items-center justify-center gap-1.5 text-xs font-semibold ${isSelected ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-400'}`}>
                  {isSelected ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Role Selected</span>
                    </>
                  ) : (
                    <span>Click to select role</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Credentials Form Section */}
        <div className="max-w-xl mx-auto rounded-2xl p-6 sm:p-8 bg-slate-900/80 border border-slate-800 shadow-2xl relative">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
            <div>
              <h2 className="text-sm font-bold font-display text-slate-100 flex items-center gap-2">
                <Lock className="w-4 h-4 text-cyan-400" />
                <span>Single Sign-On (SSO) & Demo Credentials</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Selected: <strong className="text-cyan-300">{roleConfigs.find(r => r.role === selectedRole)?.title}</strong>
              </p>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded">
              Ready
            </span>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5">
                Campus Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
                  placeholder="name@ecoverse.edu"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Key className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
                  placeholder="••••••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 transition"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-950 text-cyan-500 focus:ring-cyan-500"
                />
                <span>Remember session</span>
              </label>
              <span className="text-[11px] text-cyan-400 font-mono">Demo Auto-Fill Enabled</span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold text-sm transition shadow-lg shadow-cyan-500/20 active:scale-[0.99] flex items-center justify-center gap-2 mt-4"
            >
              {isLoading ? (
                <span>Authenticating Credentials...</span>
              ) : (
                <>
                  <span>Sign In & Open Workspace</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full border-t border-slate-800/80 py-4 px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>EcoVerse AI — Intelligent Campus Sustainability Platform</span>
          <div className="flex items-center gap-4 font-mono text-[11px]">
            <span>ISO 14064 Compliance</span>
            <span>•</span>
            <span>PostgreSQL Ready</span>
            <span>•</span>
            <span>Zero-Trust RBAC</span>
          </div>
        </div>
      </footer>

    </div>
  );
};
