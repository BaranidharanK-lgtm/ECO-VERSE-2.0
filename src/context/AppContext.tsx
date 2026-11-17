import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserRole, 
  SustainabilityReport, 
  AppNotification, 
  WasteBin, 
  IssueCategory, 
  ReportStatus, 
  AIAnalysisResult,
  Department
} from '../types';
import { 
  INITIAL_REPORTS, 
  INITIAL_NOTIFICATIONS, 
  WASTE_BINS, 
  DEPARTMENTS 
} from '../data/mockData';

interface AppContextType {
  // Auth & Role
  isAuthenticated: boolean;
  login: (role: UserRole) => void;
  logout: () => void;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  currentUser: { id: string; name: string; role: UserRole; email: string; department?: string };
  isDarkMode: boolean;
  toggleDarkMode: () => void;

  // Reports
  reports: SustainabilityReport[];
  addReport: (newReport: Omit<SustainabilityReport, 'id' | 'dateReported' | 'status' | 'history' | 'isSimulated' | 'aiAnalysis'>) => SustainabilityReport;
  updateReportStatus: (reportId: string, newStatus: ReportStatus, comment?: string, evidenceUrl?: string) => void;
  assignReportDepartment: (reportId: string, deptId: string, deptName: string) => void;
  getReportById: (id: string) => SustainabilityReport | undefined;

  // Waste Bins
  wasteBins: WasteBin[];
  updateBinFullness: (binId: string, fullness: number) => void;
  emptyBin: (binId: string) => void;

  // Notifications
  notifications: AppNotification[];
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
  unreadCount: number;

  // Departments
  departments: Department[];

  // Global AI Copilot
  isCopilotOpen: boolean;
  setIsCopilotOpen: (open: boolean) => void;
  copilotContext: string;
  setCopilotContext: (ctx: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const ROLE_USERS: Record<UserRole, { id: string; name: string; role: UserRole; email: string; department?: string }> = {
  student: {
    id: 'usr-student-1',
    name: 'Aria Sharma',
    role: 'student',
    email: 'aria.sharma@ecoverse.edu',
  },
  maintenance: {
    id: 'usr-maint-1',
    name: 'Marcus Vance (Facility Tech)',
    role: 'maintenance',
    email: 'marcus.vance@ecoverse.edu',
    department: 'Plumbing & Water Resources'
  },
  admin: {
    id: 'usr-admin-1',
    name: 'Dr. Sophia Vance (Chief Sustainability Officer)',
    role: 'admin',
    email: 'sophia.vance@ecoverse.edu'
  }
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('ecoverse_theme');
    return saved ? saved === 'dark' : true;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      root.classList.remove('light');
      localStorage.setItem('ecoverse_theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
      localStorage.setItem('ecoverse_theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  // Role state (with localStorage persistence)
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem('ecoverse_role');
    return (saved as UserRole) || 'student';
  });

  // Auth state (with localStorage persistence)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem('ecoverse_auth');
    return saved === 'true';
  });

  const login = (role: UserRole) => {
    setCurrentRole(role);
    setIsAuthenticated(true);
    localStorage.setItem('ecoverse_role', role);
    localStorage.setItem('ecoverse_auth', 'true');
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.setItem('ecoverse_auth', 'false');
  };

  const handleSetCurrentRole = (role: UserRole) => {
    setCurrentRole(role);
    localStorage.setItem('ecoverse_role', role);
  };

  const currentUser = ROLE_USERS[currentRole];

  // Reports state (with localStorage persistence)
  const [reports, setReports] = useState<SustainabilityReport[]>(() => {
    const saved = localStorage.getItem('ecoverse_reports');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved reports', e);
      }
    }
    return INITIAL_REPORTS;
  });

  useEffect(() => {
    localStorage.setItem('ecoverse_reports', JSON.stringify(reports));
  }, [reports]);

  // Waste bins state
  const [wasteBins, setWasteBins] = useState<WasteBin[]>(() => {
    const saved = localStorage.getItem('ecoverse_waste_bins');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved bins', e);
      }
    }
    return WASTE_BINS;
  });

  useEffect(() => {
    localStorage.setItem('ecoverse_waste_bins', JSON.stringify(wasteBins));
  }, [wasteBins]);

  // Notifications state
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('ecoverse_notifications');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved notifications', e);
      }
    }
    return INITIAL_NOTIFICATIONS;
  });

  useEffect(() => {
    localStorage.setItem('ecoverse_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Copilot state
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [copilotContext, setCopilotContext] = useState('Overview');

  // Simulated AI Computer Vision analysis generator
  const runSimulatedAIAnalysis = (category: IssueCategory, title: string, desc: string): AIAnalysisResult => {
    const text = (title + ' ' + desc).toLowerCase();
    let suggestedDept = 'Integrated Facilities & Civil Infra';
    let suggestedAction = 'Dispatch initial inspector to verify site parameters.';
    let urgency: 'low' | 'medium' | 'high' | 'critical' = 'medium';
    let keywords = ['campus visual feed', 'anomaly check'];

    if (category === 'water' || text.includes('water') || text.includes('leak') || text.includes('pipe') || text.includes('flush')) {
      suggestedDept = 'Plumbing & Water Resources';
      suggestedAction = 'Check isolation valves, meter flow rates, replace damaged seals or pipe segments.';
      urgency = text.includes('flood') || text.includes('heavy') || text.includes('high') ? 'critical' : 'high';
      keywords = ['fluid flow pattern', 'hydrostatic pressure loss', 'fixture valve'];
    } else if (category === 'energy' || text.includes('light') || text.includes('power') || text.includes('ac') || text.includes('hvac')) {
      suggestedDept = 'Electrical & Energy Optimization';
      suggestedAction = 'Inspect occupancy sensor circuit, verify BMS schedule override, replace ballast.';
      urgency = 'medium';
      keywords = ['lux level anomaly', 'parasitic energy draw', 'unoccupied illumination'];
    } else if (category === 'waste' || text.includes('trash') || text.includes('bin') || text.includes('overflow') || text.includes('compost')) {
      suggestedDept = 'Housekeeping & Circular Waste';
      suggestedAction = 'Schedule emergency bag changeout; audit bin signage and volume telemetry.';
      urgency = text.includes('spill') || text.includes('overflow') ? 'high' : 'medium';
      keywords = ['volumetric fill threshold', 'contamination index', 'chute blockage'];
    } else if (category === 'biodiversity' || text.includes('plant') || text.includes('tree') || text.includes('garden')) {
      suggestedDept = 'Gardening & Campus Biodiversity';
      suggestedAction = 'Conduct root health check, recalibrate drip irrigation line, apply organic mulch.';
      urgency = 'medium';
      keywords = ['canopy vigor', 'soil moisture deficiency', 'flora habitat'];
    }

    return {
      detectedCategory: category,
      confidenceScore: +(0.88 + Math.random() * 0.1).toFixed(2),
      urgency,
      suggestedDepartment: suggestedDept,
      suggestedAction,
      evidenceSummary: `Computer Vision model analyzed visual evidence against 12,000+ campus facilities training records. Categorized as ${category.toUpperCase()} with high fidelity.`,
      requiresHumanReview: urgency === 'critical',
      visualKeywords: keywords
    };
  };

  const addReport = (newReportData: Omit<SustainabilityReport, 'id' | 'dateReported' | 'status' | 'history' | 'isSimulated' | 'aiAnalysis'>) => {
    const newId = `ECO-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    
    const aiAnalysis = runSimulatedAIAnalysis(newReportData.category, newReportData.title, newReportData.description);
    
    // Auto-resolve assigned department based on routing rules
    const targetDept = DEPARTMENTS.find(d => d.categoriesHandled.includes(newReportData.category)) || DEPARTMENTS[4];

    const newReport: SustainabilityReport = {
      ...newReportData,
      id: newId,
      dateReported: now,
      status: 'assigned',
      assignedDepartmentId: targetDept.id,
      assignedDepartmentName: targetDept.name,
      urgency: aiAnalysis.urgency,
      aiAnalysis,
      isSimulated: true,
      history: [
        {
          id: `h-${Date.now()}-1`,
          status: 'submitted',
          timestamp: now,
          actorName: currentUser.name,
          actorRole: currentUser.role,
          comment: 'Report submitted through EcoVerse Campus portal.'
        },
        {
          id: `h-${Date.now()}-2`,
          status: 'ai_analysis',
          timestamp: now,
          actorName: 'EcoVision AI Pipeline',
          actorRole: 'admin',
          comment: `Computer Vision auto-classified item (${(aiAnalysis.confidenceScore * 100).toFixed(0)}% confidence). Urgency: ${aiAnalysis.urgency.toUpperCase()}.`
        },
        {
          id: `h-${Date.now()}-3`,
          status: 'assigned',
          timestamp: now,
          actorName: 'EcoVerse Routing Engine',
          actorRole: 'admin',
          comment: `Automatically routed to ${targetDept.name} based on campus policy.`
        }
      ]
    };

    setReports(prev => [newReport, ...prev]);

    // Create notification
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: 'New Sustainability Report Created',
      message: `${newId} (${newReport.title}) was submitted and routed to ${targetDept.name}.`,
      timestamp: 'Just now',
      read: false,
      reportId: newId,
      type: 'assignment'
    };
    setNotifications(prev => [newNotif, ...prev]);

    return newReport;
  };

  const updateReportStatus = (reportId: string, newStatus: ReportStatus, comment?: string, evidenceUrl?: string) => {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    
    setReports(prev => prev.map(report => {
      if (report.id !== reportId) return report;

      const newHistoryEntry = {
        id: `h-${Date.now()}`,
        status: newStatus,
        timestamp: now,
        actorName: currentUser.name,
        actorRole: currentUser.role,
        comment: comment || `Status updated to ${newStatus.replace('_', ' ').toUpperCase()}`,
        evidenceUrl: evidenceUrl || undefined
      };

      return {
        ...report,
        status: newStatus,
        resolutionEvidenceUrl: evidenceUrl || report.resolutionEvidenceUrl,
        resolutionNotes: comment || report.resolutionNotes,
        history: [...report.history, newHistoryEntry]
      };
    }));

    // Trigger notification
    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: `Status Updated: ${newStatus.replace('_', ' ').toUpperCase()}`,
      message: `Report ${reportId} status was updated by ${currentUser.name}.`,
      timestamp: 'Just now',
      read: false,
      reportId,
      type: 'status_change'
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const assignReportDepartment = (reportId: string, deptId: string, deptName: string) => {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    
    setReports(prev => prev.map(report => {
      if (report.id !== reportId) return report;

      return {
        ...report,
        status: 'assigned',
        assignedDepartmentId: deptId,
        assignedDepartmentName: deptName,
        history: [
          ...report.history,
          {
            id: `h-${Date.now()}`,
            status: 'assigned',
            timestamp: now,
            actorName: currentUser.name,
            actorRole: currentUser.role,
            comment: `Reassigned to ${deptName} by Administrator.`
          }
        ]
      };
    }));
  };

  const getReportById = (id: string) => reports.find(r => r.id === id);

  // Waste Bin modifications
  const updateBinFullness = (binId: string, fullness: number) => {
    setWasteBins(prev => prev.map(bin => {
      if (bin.id !== binId) return bin;
      const status = fullness >= 90 ? 'overflowing' : fullness >= 75 ? 'near_full' : 'normal';
      const priority = fullness >= 90 ? 'urgent' : fullness >= 75 ? 'high' : fullness >= 50 ? 'medium' : 'low';
      return { ...bin, fullness, status, collectionPriority: priority };
    }));
  };

  const emptyBin = (binId: string) => {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    setWasteBins(prev => prev.map(bin => {
      if (bin.id !== binId) return bin;
      return {
        ...bin,
        fullness: 0,
        status: 'collected',
        collectionPriority: 'low',
        lastEmptied: now
      };
    }));
  };

  // Notification actions
  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearAllNotifications = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        currentRole,
        setCurrentRole: handleSetCurrentRole,
        currentUser,
        isDarkMode,
        toggleDarkMode,
        reports,
        addReport,
        updateReportStatus,
        assignReportDepartment,
        getReportById,
        wasteBins,
        updateBinFullness,
        emptyBin,
        notifications,
        markNotificationAsRead,
        clearAllNotifications,
        unreadCount,
        departments: DEPARTMENTS,
        isCopilotOpen,
        setIsCopilotOpen,
        copilotContext,
        setCopilotContext
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
