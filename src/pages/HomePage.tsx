import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Leaf, 
  ArrowRight, 
  CheckCircle2, 
  TrendingUp, 
  BarChart2, 
  Zap, 
  Recycle, 
  Building2, 
  AlertTriangle,
  PlusCircle,
  Camera,
  MapPin,
  Clock,
  Wrench,
  ShieldAlert,
  Droplets,
  Flame,
  ClipboardList,
  Sparkles,
  Layers,
  ChevronRight,
  FileText
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { currentRole, currentUser, reports, isDarkMode, departments } = useApp();
  const navigate = useNavigate();

  // If student: render way simpler student UI
  if (currentRole === 'student') {
    const studentReports = reports.filter(r => r.reporterName === currentUser.name || r.reporterRole === 'student');
    const activeStudentReports = studentReports.filter(r => r.status !== 'resolved');

    return (
      <div className="space-y-8 pb-16 text-left max-w-5xl mx-auto px-4 sm:px-6 pt-6">
        
        {/* Simple Welcoming Hero */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-emerald-950/60 via-slate-900 to-cyan-950/40 border border-emerald-500/30 shadow-xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Student & Campus Reporter Portal</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-black font-display text-white tracking-tight">
              Welcome back, {currentUser.name.split(' ')[0]} 👋
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl">
              Spot a water leak, overflowing bin, or unneeded lights on campus? Report it in seconds and track until fixed.
            </p>
          </div>

          {/* Direct Simple Actions */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              to="/reports?new=true"
              className="px-5 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 hover:brightness-110 shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report an Issue Now</span>
            </Link>

            <Link
              to="/dashboard"
              className="px-5 py-3 rounded-xl text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-2 transition"
            >
              <BarChart2 className="w-4 h-4 text-cyan-400" />
              <span>View Campus Dashboard</span>
            </Link>
          </div>
        </div>

        {/* 1-Click Quick Issue Category Triggers */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            Quick Report by Category
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Link
              to="/reports?new=true&category=water"
              className="p-4 rounded-2xl bg-slate-900 hover:bg-cyan-950/40 border border-slate-800 hover:border-cyan-500/50 transition flex flex-col items-center text-center gap-2 group"
            >
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition">
                <Droplets className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-xs text-slate-100">Water Leak</div>
                <div className="text-[10px] text-slate-400">Restrooms, taps, pipes</div>
              </div>
            </Link>

            <Link
              to="/reports?new=true&category=energy"
              className="p-4 rounded-2xl bg-slate-900 hover:bg-amber-950/40 border border-slate-800 hover:border-amber-500/50 transition flex flex-col items-center text-center gap-2 group"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-110 transition">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-xs text-slate-100">Power & Lights</div>
                <div className="text-[10px] text-slate-400">Empty room lights, AC</div>
              </div>
            </Link>

            <Link
              to="/reports?new=true&category=waste"
              className="p-4 rounded-2xl bg-slate-900 hover:bg-emerald-950/40 border border-slate-800 hover:border-emerald-500/50 transition flex flex-col items-center text-center gap-2 group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition">
                <Recycle className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-xs text-slate-100">Waste Bin</div>
                <div className="text-[10px] text-slate-400">Overflowing, sorted waste</div>
              </div>
            </Link>

            <Link
              to="/reports?new=true&category=maintenance"
              className="p-4 rounded-2xl bg-slate-900 hover:bg-teal-950/40 border border-slate-800 hover:border-teal-500/50 transition flex flex-col items-center text-center gap-2 group"
            >
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center group-hover:scale-110 transition">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-xs text-slate-100">Facility Repair</div>
                <div className="text-[10px] text-slate-400">Broken door, bench, fan</div>
              </div>
            </Link>
          </div>
        </div>

        {/* Simple Stats for Student */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-[11px] font-semibold text-slate-400">Your Eco Points</span>
            <div className="text-2xl font-black text-emerald-400">340 Pts</div>
            <span className="text-[10px] text-slate-500">Tier: Campus Eco Guardian</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-[11px] font-semibold text-slate-400">Average Fix Time</span>
            <div className="text-2xl font-black text-cyan-400">3.2 Hours</div>
            <span className="text-[10px] text-slate-500">Fast maintenance response</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-[11px] font-semibold text-slate-400">Campus Resolution Rate</span>
            <div className="text-2xl font-black text-teal-400">98.4%</div>
            <span className="text-[10px] text-slate-500">Verified by university team</span>
          </div>
        </div>

        {/* My Active Reports Status Tracker */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <h2 className="text-sm font-bold text-slate-100">My Reported Issues</h2>
            </div>
            <Link to="/reports" className="text-xs text-cyan-400 hover:underline font-semibold flex items-center gap-1">
              <span>View All Reports</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {activeStudentReports.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-400 space-y-1">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
              <div className="font-semibold text-slate-200">All your reported issues are resolved!</div>
              <div>Found a new leak or waste problem? Use the button above to report.</div>
            </div>
          ) : (
            <div className="space-y-3">
              {activeStudentReports.slice(0, 3).map(rep => (
                <div key={rep.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-bold text-slate-300 bg-slate-800 px-1.5 py-0.5 rounded">
                        {rep.id}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        {rep.status.replace('_', ' ')}
                      </span>
                      <span className="text-xs text-slate-400">{rep.building} • {rep.locationDetails}</span>
                    </div>
                    <div className="font-bold text-xs text-slate-100">{rep.title}</div>
                  </div>

                  <Link
                    to="/reports"
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 self-start sm:self-center"
                  >
                    Track Status
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    );
  }

  // If Technician or Administrator:
  // "for technician digital mapping,order of working,report details and for administrator keep it same for technician and administrator erase the explaination about individual topics dont provides statemnet provide necessary options"
  const pendingOrders = reports.filter(r => r.status === 'submitted' || r.status === 'assigned');
  const criticalOrders = reports.filter(r => r.urgency === 'critical');

  return (
    <div className="space-y-6 pb-20 text-left max-w-6xl mx-auto px-4 sm:px-6 pt-6">
      
      {/* Crisp Operational Header - No Essays */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-cyan-950/60 text-cyan-400 border border-cyan-800/40 text-xs font-mono font-bold">
            <Wrench className="w-3.5 h-3.5" />
            <span>OPERATIONAL COMMAND HUB • {currentRole.toUpperCase()}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-100 mt-1">
            Campus Operations Center
          </h1>
          <p className="text-xs text-slate-400">
            Direct action dispatches, spatial digital mapping, and facility repair execution.
          </p>
        </div>

        {/* Direct Action Hub */}
        <div className="flex flex-wrap items-center gap-2">
          {currentRole === 'admin' && (
            <Link
              to="/admin-reporting"
              className="px-4 py-2 rounded-xl text-xs font-bold bg-purple-500 hover:bg-purple-400 text-white shadow-sm flex items-center gap-1.5 transition"
            >
              <FileText className="w-4 h-4" />
              <span>Reporting Dashboard</span>
            </Link>
          )}

          <Link
            to="/orders"
            className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-sm flex items-center gap-1.5 transition"
          >
            <ClipboardList className="w-4 h-4" />
            <span>Order of Working ({pendingOrders.length})</span>
          </Link>

          <Link
            to="/digital-twin"
            className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-sm flex items-center gap-1.5 transition"
          >
            <MapPin className="w-4 h-4" />
            <span>Digital Mapping</span>
          </Link>

          <Link
            to="/reports"
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition"
          >
            <span>{currentRole === 'admin' ? 'Work Inspection' : 'Report Details'}</span>
          </Link>
        </div>
      </div>

      {/* Primary Operational Action Cards */}
      <div className={`grid grid-cols-1 ${currentRole === 'admin' ? 'md:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-3'} gap-4`}>
        {currentRole === 'admin' && (
          <Link
            to="/admin-reporting"
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-purple-500/50 transition group flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center group-hover:scale-105 transition">
                <FileText className="w-5 h-5" />
              </div>
              <h2 className="text-base font-bold text-slate-100">
                Reporting Dashboard
              </h2>
              <div className="text-xs text-slate-400">
                Complete workflow breakdown (Not Assigned, In Progress, Work Done, Resolved) with date limits and PDF generation.
              </div>
            </div>
            <div className="flex items-center justify-between text-xs font-bold text-purple-400 pt-2 border-t border-slate-800/80">
              <span>Open Reporting</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </Link>
        )}
        
        {/* Card 1: Digital Mapping */}
        <Link
          to="/digital-twin"
          className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 transition group flex flex-col justify-between space-y-4"
        >
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center group-hover:scale-105 transition">
              <MapPin className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-slate-100">
              Digital Mapping
            </h2>
            <div className="text-xs text-slate-400">
              Interactive 2D/3D spatial twin with aerial photogrammetry, building telemetry pins, and live incident locations.
            </div>
          </div>
          <div className="flex items-center justify-between text-xs font-bold text-cyan-400 pt-2 border-t border-slate-800/80">
            <span>Launch Spatial Mapping</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </div>
        </Link>

        {/* Card 2: Order of Working */}
        <Link
          to="/orders"
          className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 transition group flex flex-col justify-between space-y-4"
        >
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-105 transition">
              <ClipboardList className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-slate-100">
              Order of Working
            </h2>
            <div className="text-xs text-slate-400">
              Action work order board: acknowledge tickets, dispatch crews, upload repair proof, and execute equipment overrides.
            </div>
          </div>
          <div className="flex items-center justify-between text-xs font-bold text-amber-400 pt-2 border-t border-slate-800/80">
            <span>Open Work Orders ({pendingOrders.length} Pending)</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </div>
        </Link>

        {/* Card 3: Report Details */}
        <Link
          to="/reports"
          className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition group flex flex-col justify-between space-y-4"
        >
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-slate-100">
              Report Details
            </h2>
            <div className="text-xs text-slate-400">
              Comprehensive ticket audit log, department assignment records, resolution verification, and historical telemetry data.
            </div>
          </div>
          <div className="flex items-center justify-between text-xs font-bold text-emerald-400 pt-2 border-t border-slate-800/80">
            <span>Inspect All Records ({reports.length})</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </div>
        </Link>

      </div>

      {/* Immediate Triage & Critical Alerts - Pure Action */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Critical Dispatches & High Priority Queue
            </h2>
          </div>
          <span className="text-xs font-mono font-bold text-rose-400 bg-rose-950/60 border border-rose-800/40 px-2 py-0.5 rounded">
            {criticalOrders.length} Urgent Incidents
          </span>
        </div>

        <div className="space-y-2">
          {reports.slice(0, 4).map(item => (
            <div key={item.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                  item.urgency === 'critical' ? 'bg-rose-500/20 text-rose-300' :
                  item.urgency === 'high' ? 'bg-amber-500/20 text-amber-300' :
                  'bg-slate-800 text-slate-300'
                }`}>
                  {item.urgency.toUpperCase()}
                </span>
                <div>
                  <div className="font-bold text-slate-200">{item.title}</div>
                  <div className="text-[11px] text-slate-500">{item.building} • {item.assignedDepartmentName}</div>
                </div>
              </div>

              <Link
                to="/orders"
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700"
              >
                Execute
              </Link>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
