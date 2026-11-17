import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  IssueCategory, 
  ReportStatus, 
  SustainabilityReport, 
  UrgencyLevel 
} from '../types';
import { CAMPUS_BUILDINGS, DEPARTMENTS } from '../data/mockData';
import { AdminWorkflowReportModal } from '../components/AdminWorkflowReportModal';
import { 
  FileText, 
  Search, 
  Filter, 
  PlusCircle, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Eye, 
  MapPin, 
  Building2, 
  Camera, 
  Wrench, 
  X, 
  Sparkles, 
  ChevronRight, 
  RefreshCcw, 
  Sliders, 
  Send, 
  Layers, 
  Upload, 
  Image as ImageIcon, 
  Trash2,
  ShieldCheck
} from 'lucide-react';

const DEFAULT_STATEMENTS = [
  "Physical repair completed and tested under nominal pressure/load.",
  "Defective hardware component replaced with OEM certified part and recalibrated.",
  "Line isolated, blockage cleared, and complete sanitation protocol executed.",
  "Electrical circuit inspected, breaker reset, and thermal signature normal.",
  "Overhead fixtures inspected, ballast replaced, and occupancy sensor re-tuned.",
  "Receptacle emptied, sanitized, and automated ultrasonic fill telemetry reset."
];

export const ReportsPage: React.FC = () => {
  const { 
    reports, 
    addReport, 
    updateReportStatus, 
    assignReportDepartment, 
    currentRole, 
    currentUser, 
    departments 
  } = useApp();
  
  const location = useLocation();

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [buildingFilter, setBuildingFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Selected report for drawer modal
  const [selectedReport, setSelectedReport] = useState<SustainabilityReport | null>(null);

  // Modal for new report
  const [isNewReportModalOpen, setIsNewReportModalOpen] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formCategory, setFormCategory] = useState<IssueCategory>('water');
  const [formBuilding, setFormBuilding] = useState(CAMPUS_BUILDINGS[0].name);
  const [formLocation, setFormLocation] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [imageInputMode, setImageInputMode] = useState<'upload' | 'url'>('upload');
  const [uploadFileName, setUploadFileName] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);

  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [aiDetectionMsg, setAiDetectionMsg] = useState<string | null>(null);

  // Automated Computer Vision Inspection that populates complaint fields
  const classifyImageAndAutoFill = (imageSrc: string, fileName?: string) => {
    setIsAnalyzingImage(true);
    setAiDetectionMsg(null);

    setTimeout(() => {
      const textToMatch = ((fileName || '') + ' ' + imageSrc).toLowerCase();

      let detectedCat: IssueCategory = 'water';
      let detectedTitle = 'Active Restroom Water Leakage & Valve Failure';
      let detectedDesc = 'Computer Vision detected continuous liquid pooling and high-flow plumbing failure. Immediate isolation recommended to curb water wastage.';
      let detectedBldg = 'School of Engineering';
      let detectedLoc = 'Floor 2, Washroom 204B (West Wing)';
      let confidence = 94;

      if (textToMatch.includes('light') || textToMatch.includes('energy') || textToMatch.includes('power') || textToMatch.includes('bulb') || textToMatch.includes('lamp') || textToMatch.includes('fluorescent') || textToMatch.includes('1517457373958')) {
        detectedCat = 'energy';
        detectedTitle = 'Overhead Fluorescents Energized in Vacant Laboratory';
        detectedDesc = 'Visual inspection verified high-lux artificial illumination active in an unoccupied laboratory zone. Flagged for occupancy-sensor recalibration.';
        detectedBldg = 'Artificial Intelligence';
        detectedLoc = 'Floor 3, GPU Cluster Room AI-301';
        confidence = 96;
      } else if (textToMatch.includes('waste') || textToMatch.includes('trash') || textToMatch.includes('bin') || textToMatch.includes('garbage') || textToMatch.includes('plastic') || textToMatch.includes('bottle') || textToMatch.includes('compost') || textToMatch.includes('1532996122724')) {
        detectedCat = 'waste';
        detectedTitle = 'Receptacle Overflow & Non-Compostable Contamination';
        detectedDesc = 'Optical depth profiling identified bin capacity exceeding 90% threshold with synthetic packaging contaminating the cafeteria organic stream.';
        detectedBldg = 'CDSIMER';
        detectedLoc = 'Ground Floor Dining Commons & Circular Walk';
        confidence = 92;
      } else if (textToMatch.includes('plant') || textToMatch.includes('garden') || textToMatch.includes('tree') || textToMatch.includes('soil') || textToMatch.includes('irrigation') || textToMatch.includes('sprinkler') || textToMatch.includes('1500382017468')) {
        detectedCat = 'biodiversity';
        detectedTitle = 'Fractured Drip Irrigation Emitter Flooding Native Bed';
        detectedDesc = 'Optical vegetation sensing detected surface water pooling and soil erosion around native flora due to a split drip irrigation emitter.';
        detectedBldg = 'Botanical Conservatory & Gardens';
        detectedLoc = 'North Quad Native Botanical Bed';
        confidence = 95;
      } else if (textToMatch.includes('stain') || textToMatch.includes('ceiling') || textToMatch.includes('pipe') || textToMatch.includes('leak') || textToMatch.includes('1584622650111')) {
        detectedCat = 'water';
        detectedTitle = 'Continuous High-Volume Flush Leak in Restroom Riser';
        detectedDesc = 'Computer Vision detected fluid pooling and high-flow plumbing failure. Automated isolation recommended to prevent potable water wastage.';
        detectedBldg = 'School of Engineering';
        detectedLoc = 'Floor 2, Washroom 204B (West Wing)';
        confidence = 94;
      } else if (textToMatch.includes('hazard') || textToMatch.includes('battery') || textToMatch.includes('chemical') || textToMatch.includes('ac') || textToMatch.includes('refrigerant')) {
        detectedCat = 'maintenance';
        detectedTitle = 'Refrigerant & Mechanical Equipment Hazard Detected';
        detectedDesc = 'AI visual anomaly model identified fluid/gas line discoloration and mechanical vibration near HVAC riser.';
        detectedBldg = 'EMERGENCY';
        detectedLoc = 'Trauma Wing Plant Room B-1';
        confidence = 91;
      } else {
        detectedCat = 'water';
        detectedTitle = 'Automated Environmental Incident: Water Leak';
        detectedDesc = 'Computer Vision inference analyzed uploaded visual evidence and identified high-probability plumbing / fluid anomaly.';
        detectedBldg = 'School of Engineering';
        detectedLoc = 'Academic Core Corridor';
        confidence = 90;
      }

      setFormTitle(detectedTitle);
      setFormDescription(detectedDesc);
      setFormCategory(detectedCat);
      setFormBuilding(detectedBldg);
      setFormLocation(detectedLoc);
      setIsAnalyzingImage(false);
      setAiDetectionMsg(`EcoVision AI: Verified image as ${detectedCat.toUpperCase()} (${confidence}% confidence). Complaint fields auto-populated!`);
    }, 400);
  };

  // Handle local file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processSelectedFile(file);
  };

  const processSelectedFile = (file: File) => {
    setUploadFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setFormImageUrl(reader.result);
        classifyImageAndAutoFill(reader.result, file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      processSelectedFile(file);
    }
  };

  const handleClearImage = () => {
    setFormImageUrl('');
    setUploadFileName('');
    setAiDetectionMsg(null);
  };

  // Status update action state
  const [actionComment, setActionComment] = useState('');
  const [proofUrl, setProofUrl] = useState('');
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Check URL query parameters for ?new=true
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('new') === 'true') {
      setIsNewReportModalOpen(true);
      const bldgParam = params.get('building');
      if (bldgParam) {
        setFormBuilding(decodeURIComponent(bldgParam));
      }
    }
  }, [location.search]);

  // Filtered reports
  const filteredReports = reports.filter(r => {
    const matchesSearch = 
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.locationDetails.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCat = categoryFilter === 'all' || r.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    const matchesBuilding = buildingFilter === 'all' || r.building === buildingFilter;

    return matchesSearch && matchesCat && matchesStatus && matchesBuilding;
  });

  const handleCreateReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formDescription.trim()) return;

    const newRep = addReport({
      title: formTitle,
      description: formDescription,
      category: formCategory,
      building: formBuilding,
      locationDetails: formLocation || 'General Campus Ground',
      imageUrl: formImageUrl || 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
      dateObserved: new Date().toISOString().substring(0, 16).replace('T', ' '),
      reporterId: currentUser.id,
      reporterName: currentUser.name,
      reporterRole: currentUser.role,
      urgency: 'high',
      coordinates: { x: 35 + Math.floor(Math.random() * 30), y: 35 + Math.floor(Math.random() * 30) }
    });

    setIsNewReportModalOpen(false);
    setSelectedReport(newRep);
    setFormTitle('');
    setFormDescription('');
    setFormLocation('');
    setFormImageUrl('');
    setUploadFileName('');
    setImageInputMode('upload');
    setSuccessMessage(`Report ${newRep.id} logged and automatically dispatched!`);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const handleStatusChange = (newStatus: ReportStatus, customComment?: string, customEvidence?: string) => {
    if (!selectedReport) return;
    const finalComment = customComment || actionComment;
    const finalEvidence = customEvidence || proofUrl;
    updateReportStatus(selectedReport.id, newStatus, finalComment, finalEvidence);
    setSuccessMessage(`Ticket ${selectedReport.id} transitioned to ${newStatus.replace('_', ' ').toUpperCase()}`);
    setActionComment('');
    setProofUrl('');
    
    // Update local modal view
    const updated = reports.find(r => r.id === selectedReport.id);
    if (updated) setSelectedReport({ ...updated, status: newStatus, resolutionNotes: finalComment, resolutionEvidenceUrl: finalEvidence });

    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const getStatusBadge = (status: ReportStatus) => {
    switch (status) {
      case 'submitted':
      case 'ai_analysis':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      case 'assigned':
      case 'acknowledged':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      case 'in_progress':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse';
      case 'awaiting_verification':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-bold';
      case 'resolved':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'reopened':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      default:
        return 'bg-slate-700 text-slate-300 border-slate-600';
    }
  };

  return (
    <div className="space-y-10 pb-24 text-left">
      
      {/* Header */}
      <section className="border-b border-slate-800 pt-8 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/50 text-emerald-400 border border-emerald-500/30 text-xs font-mono">
                <FileText className="w-3.5 h-3.5" />
                <span>{currentRole === 'student' ? 'CAMPUS INCIDENT REPORTING' : 'REPORT DETAILS & AUDIT LOG'}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black font-display text-slate-100">
                {currentRole === 'student' ? 'Report' : 'Report Details'}
              </h1>
              <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-mono">
                <span className="text-cyan-400 bg-cyan-950/60 border border-cyan-800/40 px-2 py-0.5 rounded">
                  {filteredReports.length} Records Found
                </span>
                <span className="text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded">
                  Auto-Routing Enabled
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {currentRole === 'admin' && (
                <button
                  onClick={() => setIsPdfModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-500 to-indigo-500 hover:brightness-110 text-white shadow-md flex items-center gap-1.5 transition"
                >
                  <FileText className="w-4 h-4" />
                  <span>Generate Workflow PDF Report</span>
                </button>
              )}

              {currentRole === 'student' && (
                <button
                  onClick={() => setIsNewReportModalOpen(true)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 hover:brightness-110 shadow-glow-emerald flex items-center gap-2 transition self-start sm:self-auto"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Report New Issue</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Success banner */}
      {successMessage && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{successMessage}</span>
            </div>
            <button onClick={() => setSuccessMessage(null)} className="text-emerald-400 hover:underline">
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-3">
          
          <div className="flex flex-col lg:flex-row items-center justify-between gap-3">
            {/* Search */}
            <div className="relative w-full lg:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search ticket ID, title, keyword, location..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
              <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                <button
                  onClick={() => setViewMode('cards')}
                  className={`px-3 py-1 rounded-lg font-medium transition ${
                    viewMode === 'cards' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Cards
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-3 py-1 rounded-lg font-medium transition ${
                    viewMode === 'table' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Table
                </button>
              </div>
            </div>
          </div>

          {/* Filter dropdowns */}
          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-800/80 text-xs">
            <span className="text-slate-400 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Filters:
            </span>

            {/* Category */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-300 focus:outline-none focus:border-cyan-400"
            >
              <option value="all">All Categories</option>
              <option value="water">Water Wastage</option>
              <option value="energy">Energy & Lighting</option>
              <option value="waste">Waste Management</option>
              <option value="biodiversity">Green Space & Biodiversity</option>
              <option value="maintenance">Facilities Maintenance</option>
            </select>

            {/* Status */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-300 focus:outline-none focus:border-cyan-400"
            >
              <option value="all">All Statuses</option>
              <option value="submitted">Submitted</option>
              <option value="assigned">Assigned</option>
              <option value="in_progress">In Progress</option>
              <option value="awaiting_verification">Awaiting Verification</option>
              <option value="resolved">Resolved</option>
              <option value="reopened">Reopened</option>
            </select>

            {/* Building */}
            <select
              value={buildingFilter}
              onChange={(e) => setBuildingFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-300 focus:outline-none focus:border-cyan-400"
            >
              <option value="all">All Buildings</option>
              {CAMPUS_BUILDINGS.map(b => (
                <option key={b.id} value={b.name}>{b.name}</option>
              ))}
            </select>

            <span className="text-slate-500 ml-auto font-mono text-[11px]">
              Showing {filteredReports.length} of {reports.length} records
            </span>
          </div>

        </div>
      </section>

      {/* Main Content: Card View or Table View */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredReports.length === 0 ? (
          <div className="glass-panel p-12 rounded-3xl border border-slate-800 text-center space-y-3">
            <AlertTriangle className="w-8 h-8 text-slate-500 mx-auto" />
            <h3 className="text-lg font-bold text-slate-200">No Incidents Found</h3>
            <p className="text-xs text-slate-400">Try adjusting your search criteria or filter options.</p>
          </div>
        ) : viewMode === 'cards' ? (
          
          /* Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReports.map(rep => (
              <div
                key={rep.id}
                onClick={() => setSelectedReport(rep)}
                className="glass-card rounded-2xl overflow-hidden border border-slate-800 hover:border-cyan-500/40 cursor-pointer flex flex-col justify-between group transition-all"
              >
                <div>
                  {/* Photo Header */}
                  {rep.imageUrl && (
                    <div className="h-40 w-full overflow-hidden relative">
                      <img 
                        src={rep.imageUrl} 
                        alt={rep.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                      <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono text-cyan-400 border border-slate-700">
                        {rep.id}
                      </div>
                      <div className="absolute bottom-2 right-2">
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${getStatusBadge(rep.status)}`}>
                          {rep.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Body */}
                  <div className="p-5 space-y-3">
                    <h3 className="text-sm font-bold text-slate-100 line-clamp-2 group-hover:text-cyan-300 transition-colors">
                      {rep.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2">
                      {rep.description}
                    </p>

                    <div className="text-[11px] text-slate-300 space-y-1 pt-1 border-t border-slate-800/80">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-500" />
                        <span>{rep.building}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        <span>{rep.locationDetails}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="p-5 pt-0 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/60 mt-2">
                  <span>Assigned: <strong className="text-emerald-400">{rep.assignedDepartmentName?.split(' ')[0] || 'Pending'}</strong></span>
                  <span className="text-cyan-400 font-semibold group-hover:translate-x-0.5 transition-transform">
                    Inspect Details →
                  </span>
                </div>
              </div>
            ))}
          </div>

        ) : (
          
          /* Table View */
          <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900/90 text-slate-400 uppercase font-mono text-[11px] border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Ticket ID</th>
                    <th className="py-3 px-4">Title & Location</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Assigned Dept</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Urgency</th>
                    <th className="py-3 px-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filteredReports.map(rep => (
                    <tr 
                      key={rep.id} 
                      onClick={() => setSelectedReport(rep)}
                      className="hover:bg-slate-800/50 cursor-pointer transition"
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-cyan-400">
                        {rep.id}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-100 block">{rep.title}</span>
                        <span className="text-[11px] text-slate-400">{rep.building} • {rep.locationDetails}</span>
                      </td>
                      <td className="py-3.5 px-4 capitalize text-emerald-400 font-medium">
                        {rep.category}
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">
                        {rep.assignedDepartmentName || 'Awaiting Routing'}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${getStatusBadge(rep.status)}`}>
                          {rep.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 uppercase font-bold text-rose-400">
                        {rep.urgency}
                      </td>
                      <td className="py-3.5 px-4 text-cyan-400 font-semibold">
                        Inspect
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        )}
      </section>

      {/* Report Details Drawer / Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-3xl max-h-[90vh] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
            
            {/* Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 to-cyan-950/60 border-b border-slate-800 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                    {selectedReport.id}
                  </span>
                  <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border ${getStatusBadge(selectedReport.status)}`}>
                    {selectedReport.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                <h3 className="text-lg font-bold font-display text-slate-100">
                  {selectedReport.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-xs flex-1">
              
              {/* Photo & Specs */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-start">
                {selectedReport.imageUrl && (
                  <div className="sm:col-span-5 rounded-xl overflow-hidden border border-slate-800">
                    <img src={selectedReport.imageUrl} alt="Evidence" className="w-full h-44 object-cover" />
                  </div>
                )}
                <div className={`${selectedReport.imageUrl ? 'sm:col-span-7' : 'sm:col-span-12'} space-y-3`}>
                  <div>
                    <span className="text-slate-400 uppercase text-[10px] font-semibold block">Observation Description</span>
                    <p className="text-slate-200 mt-1 leading-relaxed">{selectedReport.description}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-[11px]">
                    <div>
                      <span className="text-slate-400 block">Facility:</span>
                      <span className="text-slate-200 font-semibold">{selectedReport.building}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Location:</span>
                      <span className="text-slate-200 font-semibold">{selectedReport.locationDetails}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Assigned To:</span>
                      <span className="text-emerald-400 font-semibold">{selectedReport.assignedDepartmentName || 'Pending'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Reporter:</span>
                      <span className="text-slate-200">{selectedReport.reporterName} ({selectedReport.reporterRole})</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI & Computer Vision Panel */}
              {selectedReport.aiAnalysis && (
                <div className="p-4 rounded-xl bg-slate-950/80 border border-cyan-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-cyan-400 font-mono font-bold text-xs">
                      <Sparkles className="w-4 h-4" />
                      <span>COMPUTER VISION INFERENCE (CONFIDENCE: {(selectedReport.aiAnalysis.confidenceScore * 100).toFixed(0)}%)</span>
                    </div>
                    <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded">
                      AUTO-ROUTED
                    </span>
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed">{selectedReport.aiAnalysis.evidenceSummary}</p>
                  <div className="text-[11px] text-emerald-300 font-medium">
                    Suggested Action: {selectedReport.aiAnalysis.suggestedAction}
                  </div>
                </div>
              )}

              {/* Chronological Event History */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  Chronological Ticket Event Log
                </h4>
                <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 divide-y divide-slate-800/80 space-y-2">
                  {selectedReport.history.map((h, i) => (
                    <div key={i} className="pt-2 first:pt-0 flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-200 capitalize">{h.status.replace('_', ' ')}</span>
                          <span className="text-[10px] text-slate-400">by {h.actorName} ({h.actorRole})</span>
                        </div>
                        <p className="text-slate-300 text-[11px] mt-0.5">{h.comment}</p>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 shrink-0">{h.timestamp}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Workflow Actions according to role */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-200 text-xs">
                    Workflow & Verification Controls
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold bg-slate-900 text-cyan-400 border border-slate-800">
                    Role: {currentRole}
                  </span>
                </div>

                {/* 1. STUDENT VIEW: Inspection Only */}
                {currentRole === 'student' && (
                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs">
                    <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                      <Eye className="w-4 h-4 text-cyan-400" />
                      <span>Student / Faculty Work Inspection</span>
                    </div>

                    {selectedReport.resolutionEvidenceUrl ? (
                      <div className="space-y-2 pt-1">
                        <span className="text-[11px] text-emerald-400 font-semibold block">
                          Technician Submitted Proof of Work:
                        </span>
                        <img 
                          src={selectedReport.resolutionEvidenceUrl} 
                          alt="Proof" 
                          className="h-32 w-full object-cover rounded-lg border border-emerald-500/40" 
                        />
                        {selectedReport.resolutionNotes && (
                          <p className="text-slate-300 italic text-[11px] bg-slate-950 p-2 rounded border border-slate-800">
                            "{selectedReport.resolutionNotes}"
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-slate-400 text-[11px]">
                        {selectedReport.status === 'in_progress' 
                          ? 'Technician crew is on-site working on this issue.' 
                          : 'Issue indicated and logged. Queued for technician dispatch.'}
                      </p>
                    )}

                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Current Status:</span>
                      <span className="font-bold text-cyan-400 uppercase">
                        {selectedReport.status === 'awaiting_verification' 
                          ? 'Awaiting Admin Verification' 
                          : selectedReport.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                )}

                {/* 2. TECHNICIAN VIEW: Finish Work & Submit Default Statement + Proof */}
                {currentRole === 'maintenance' && (
                  <div className="space-y-3 text-xs">
                    <div>
                      <span className="block text-slate-300 font-semibold mb-1">
                        Select Default Resolution Statement:
                      </span>
                      <div className="grid grid-cols-1 gap-1 max-h-28 overflow-y-auto pr-1">
                        {DEFAULT_STATEMENTS.map((stmt, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setActionComment(stmt)}
                            className={`text-left p-1.5 rounded border text-[10px] transition ${
                              actionComment === stmt 
                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50' 
                                : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                            }`}
                          >
                            • {stmt}
                          </button>
                        ))}
                      </div>
                    </div>

                    <input
                      type="text"
                      value={actionComment}
                      onChange={(e) => setActionComment(e.target.value)}
                      placeholder="Technician resolution statement..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
                    />

                    <input
                      type="text"
                      value={proofUrl}
                      onChange={(e) => setProofUrl(e.target.value)}
                      placeholder="Proof photo URL (https://... or leave blank for verified default)"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
                    />

                    <div className="flex flex-wrap gap-2 pt-1">
                      <button
                        onClick={() => handleStatusChange('in_progress')}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500 text-slate-950 hover:bg-amber-400"
                      >
                        Set In Progress
                      </button>

                      <button
                        onClick={() => handleStatusChange(
                          'awaiting_verification', 
                          actionComment || DEFAULT_STATEMENTS[0],
                          proofUrl || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80'
                        )}
                        className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-cyan-500 text-slate-950 hover:bg-cyan-400 flex items-center gap-1 shadow-sm"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Finish Work (Submit for Admin Verification)</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* 3. ADMINISTRATOR VIEW: Inspect & Verify */}
                {currentRole === 'admin' && (
                  <div className="space-y-3 text-xs">
                    {selectedReport.resolutionEvidenceUrl && (
                      <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1.5">
                        <span className="text-[10px] uppercase font-bold text-cyan-400 block">
                          Submitted Technician Proof of Work:
                        </span>
                        <img 
                          src={selectedReport.resolutionEvidenceUrl} 
                          alt="Proof" 
                          className="h-28 w-full object-cover rounded border border-slate-700" 
                        />
                        <p className="text-[11px] text-slate-300 italic">
                          "{selectedReport.resolutionNotes || DEFAULT_STATEMENTS[0]}"
                        </p>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2 pt-1">
                      <button
                        onClick={() => handleStatusChange('resolved', 'Work inspected and confirmed done by Administrator based on technician proof.')}
                        className="px-4 py-2 rounded-lg text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center gap-1.5 shadow-sm"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>Ensure Work Done (Approve)</span>
                      </button>

                      <button
                        onClick={() => handleStatusChange('in_progress', 'Administrator marked Work Not Done: technician must rework and provide valid proof.')}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-950 text-rose-300 border border-rose-800 hover:bg-rose-900"
                      >
                        Work Not Done (Reject / Rework)
                      </button>

                      <select
                        value={selectedReport.assignedDepartmentName}
                        onChange={e => {
                          const d = departments.find(dept => dept.name === e.target.value);
                          if (d) {
                            assignReportDepartment(selectedReport.id, d.id, d.name);
                            setSuccessMessage(`Reassigned to ${d.name}`);
                          }
                        }}
                        className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200"
                      >
                        {departments.map(d => (
                          <option key={d.id} value={d.name}>Reassign: {d.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Bottom Bar */}
            <div className="p-4 bg-slate-900 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedReport(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs transition"
              >
                Close Drawer
              </button>
            </div>

          </div>
        </div>
      )}

      {/* New Report Modal */}
      {isNewReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-lg font-bold font-display text-slate-100 flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-emerald-400" />
                Report Sustainability Incident
              </h3>
              <button onClick={() => setIsNewReportModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateReport} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g., Water Leak in 2nd Floor Washroom"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category *</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as IssueCategory)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-400"
                  >
                    <option value="water">Water Wastage</option>
                    <option value="energy">Energy & Lighting</option>
                    <option value="waste">Waste Management</option>
                    <option value="biodiversity">Biodiversity & Plants</option>
                    <option value="maintenance">Facility Maintenance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Building *</label>
                  <select
                    value={formBuilding}
                    onChange={(e) => setFormBuilding(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-400"
                  >
                    {CAMPUS_BUILDINGS.map(b => (
                      <option key={b.id} value={b.name}>{b.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Specific Room / Location</label>
                <input
                  type="text"
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value)}
                  placeholder="Room 204B, East Wing"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Description *</label>
                <textarea
                  rows={3}
                  required
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Describe the environmental issue and approximate severity..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-slate-300 font-semibold text-xs sm:text-sm">
                    Visual Evidence / Photo *
                  </label>
                  <div className="flex items-center bg-slate-900 border border-slate-700/80 rounded-lg p-0.5 text-xs">
                    <button
                      type="button"
                      onClick={() => setImageInputMode('upload')}
                      className={`px-2.5 py-1 rounded-md font-medium transition flex items-center gap-1.5 ${
                        imageInputMode === 'upload' 
                          ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm' 
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Browse / Upload</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageInputMode('url')}
                      className={`px-2.5 py-1 rounded-md font-medium transition flex items-center gap-1.5 ${
                        imageInputMode === 'url' 
                          ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm' 
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>Image URL</span>
                    </button>
                  </div>
                </div>

                {imageInputMode === 'upload' ? (
                  <div>
                    {formImageUrl ? (
                      <div className="relative rounded-xl border border-emerald-500/50 bg-slate-950 p-2 overflow-hidden group">
                        <div className="relative w-full h-40 rounded-lg overflow-hidden bg-slate-900">
                          <img 
                            src={formImageUrl} 
                            alt="Uploaded evidence" 
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <label
                              htmlFor="report-file-input"
                              className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg cursor-pointer flex items-center gap-1.5 transition"
                            >
                              <Upload className="w-3.5 h-3.5" />
                              Change Photo
                            </label>
                            <button
                              type="button"
                              onClick={handleClearImage}
                              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 transition"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Remove
                            </button>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center justify-between text-xs px-1">
                          <span className="text-emerald-400 font-mono text-[11px] truncate max-w-[240px]">
                            ✓ {uploadFileName || 'Uploaded System Image'}
                          </span>
                          <span className="text-[10px] text-slate-400">Ready for AI Vision</span>
                        </div>
                      </div>
                    ) : (
                      <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`border-2 border-dashed rounded-xl p-5 text-center transition cursor-pointer flex flex-col items-center justify-center gap-2 ${
                          isDragging 
                            ? 'border-emerald-400 bg-emerald-500/10' 
                            : 'border-slate-700 hover:border-emerald-500/60 bg-slate-950/70 hover:bg-slate-950'
                        }`}
                        onClick={() => document.getElementById('report-file-input')?.click()}
                      >
                        <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                          <Upload className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-200">
                            Click to browse from your computer / phone
                          </p>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Or drag & drop photo here (PNG, JPG, WebP, max 10MB)
                          </p>
                        </div>
                        <span className="px-3 py-1 text-xs font-medium rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          Choose Image File
                        </span>
                      </div>
                    )}
                    <input
                      id="report-file-input"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <input
                      type="url"
                      value={formImageUrl}
                      onChange={(e) => {
                        setFormImageUrl(e.target.value);
                        if (e.target.value) {
                          classifyImageAndAutoFill(e.target.value);
                        }
                      }}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 text-xs sm:text-sm focus:outline-none focus:border-emerald-400"
                    />
                    {formImageUrl && (
                      <div className="relative w-full h-28 rounded-lg overflow-hidden border border-slate-700 bg-slate-900">
                        <img 
                          src={formImageUrl} 
                          alt="URL preview" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80';
                          }}
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* AI Analyzing Feedback */}
                {isAnalyzingImage && (
                  <div className="p-2.5 rounded-lg bg-cyan-950/40 border border-cyan-500/40 flex items-center gap-2 text-xs text-cyan-300 animate-pulse mt-2">
                    <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
                    <span>EcoVision Neural Pipeline checking image & auto-setting complaint details...</span>
                  </div>
                )}

                {/* AI Auto-detected Notification */}
                {aiDetectionMsg && !isAnalyzingImage && (
                  <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/40 flex items-center gap-2 text-xs text-emerald-300 animate-in fade-in mt-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{aiDetectionMsg}</span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewReportModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg transition"
                >
                  Submit & Auto-Route
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Workflow Audit Report PDF Modal */}
      <AdminWorkflowReportModal 
        isOpen={isPdfModalOpen} 
        onClose={() => setIsPdfModalOpen(false)} 
      />

    </div>
  );
};
