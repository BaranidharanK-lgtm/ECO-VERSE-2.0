import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Leaf, Eye, Box, Sparkles, ShieldCheck, Github, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  const { currentRole } = useApp();
  return (
    <footer className="border-t border-slate-800 bg-[#050811] text-slate-400 text-xs mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-cyan-400 flex items-center justify-center">
                <Leaf className="w-4 h-4 text-slate-950 fill-slate-950" />
              </div>
              <span className="font-display font-bold text-base text-slate-100">
                EcoVerse<span className="text-cyan-400">.AI</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              An intelligent enterprise sustainability platform combining Computer Vision, Digital Twins, and Generative AI to accelerate university campus decarbonization, circular waste management, and accountable environmental problem resolution.
            </p>
            <div className="flex items-center gap-3 pt-2 text-slate-300">
              <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded text-[11px]">
                <Eye className="w-3.5 h-3.5 text-cyan-400" />
                <span>Computer Vision</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded text-[11px]">
                <Box className="w-3.5 h-3.5 text-emerald-400" />
                <span>Digital Twin</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded text-[11px]">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>Generative AI</span>
              </div>
            </div>
          </div>

          {/* Conditionally display Tracks and Platform sections for admin only */}
          {currentRole === 'admin' && (
            <>
              {/* Six Tracks */}
              <div>
                <h4 className="font-semibold text-slate-200 text-xs uppercase tracking-wider mb-3">
                  Sustainability Tracks
                </h4>
                <ul className="space-y-2 text-xs">
                  <li>
                    <Link to="/tracks/smart-waste-management" className="hover:text-cyan-400 transition">
                      1. Smart Waste Digital Twin
                    </Link>
                  </li>
                  <li>
                    <Link to="/tracks/sustainable-campus" className="hover:text-emerald-400 transition font-medium text-slate-300">
                      2. Sustainable Campus (Flagship)
                    </Link>
                  </li>
                  <li>
                    <Link to="/tracks/energy-optimization" className="hover:text-cyan-400 transition">
                      3. Energy Optimization
                    </Link>
                  </li>
                  <li>
                    <Link to="/tracks/green-building" className="hover:text-cyan-400 transition">
                      4. Green Building Twin
                    </Link>
                  </li>
                  <li>
                    <Link to="/tracks/carbon-intelligence" className="hover:text-cyan-400 transition">
                      5. Carbon Intelligence
                    </Link>
                  </li>
                  <li>
                    <Link to="/tracks/smart-recycling" className="hover:text-cyan-400 transition">
                      6. Smart Recycling AI
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Platform & Portals */}
              <div>
                <h4 className="font-semibold text-slate-200 text-xs uppercase tracking-wider mb-3">
                  Platform & Tools
                </h4>
                <ul className="space-y-2 text-xs">
                  <li>
                    <Link to="/digital-twin" className="hover:text-emerald-400 transition">
                      Interactive Campus Twin
                    </Link>
                  </li>
                  <li>
                    <Link to="/dashboard" className="hover:text-emerald-400 transition">
                      Executive Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link to="/reports" className="hover:text-emerald-400 transition">
                      Issue Reporting & Resolution
                    </Link>
                  </li>
                  <li>
                    <Link to="/about" className="hover:text-emerald-400 transition">
                      Mission & Tech Architecture
                    </Link>
                  </li>
                </ul>
              </div>
            </>
          )}

          {/* Competition & Disclosure */}
          <div>
            <h4 className="font-semibold text-slate-200 text-xs uppercase tracking-wider mb-3">
              Transparency & Tech
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
              Engineered for university innovation competitions and hackathons. All displayed metrics and AI detections are realistic simulated demonstrations.
            </p>
            <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-lg text-[11px] text-slate-400 space-y-1 font-mono">
              <div>Frontend: React + Vite + TS</div>
              <div>Backend: FastAPI Ready</div>
              <div>Database: PostgreSQL DDL</div>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <div>
            © {new Date().getFullYear()} EcoVerse AI — University Campus Sustainability Initiative. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              Academic Presentation Prototype
            </span>
            <Link to="/about" className="hover:text-slate-300">Architecture Specs</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
