import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  MessageSquare, 
  ChevronRight, 
  HelpCircle, 
  Database,
  Building,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  chips?: string[];
}

export const FloatingCopilot: React.FC = () => {
  const { isCopilotOpen, setIsCopilotOpen, reports, wasteBins, currentRole } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'ai',
      text: "Hello! I am EcoVerse Copilot, your campus sustainability intelligence assistant. I can analyze visual reports, digital twin telemetry, energy consumption, and campus waste streams. How can I assist your sustainability workflow today?",
      timestamp: 'Just now',
      chips: [
        "What are the most common issues on campus?",
        "Which building has the most open complaints?",
        "How can we reduce electricity peak wastage?",
        "What is the status of report ECO-2026-0104?"
      ]
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const generateAnswer = (query: string): string => {
    const q = query.toLowerCase();

    // Check specific report
    const reportMatch = query.match(/ECO-2026-\d{4}/i);
    if (reportMatch) {
      const rep = reports.find(r => r.id.toLowerCase() === reportMatch[0].toLowerCase());
      if (rep) {
        return `Report **${rep.id}** ("${rep.title}") is currently in **${rep.status.replace('_', ' ').toUpperCase()}** status.\n\n- **Location**: ${rep.building} (${rep.locationDetails})\n- **Category**: ${rep.category.toUpperCase()}\n- **Assigned Team**: ${rep.assignedDepartmentName || 'Pending routing'}\n- **Latest Update**: ${rep.history[rep.history.length - 1]?.comment || 'Ticket registered.'}\n\n*(Telemetry verified from campus demo datastore)*`;
      } else {
        return `Report reference ${reportMatch[0]} was not found in the current session. Active reports include: ${reports.slice(0, 3).map(r => r.id).join(', ')}.`;
      }
    }

    if (q.includes('common') || q.includes('frequent') || q.includes('trend')) {
      const waterCount = reports.filter(r => r.category === 'water').length;
      const energyCount = reports.filter(r => r.category === 'energy').length;
      const wasteCount = reports.filter(r => r.category === 'waste').length;
      return `Based on active campus observation telemetry:\n\n1. **Water Wastage** (${waterCount} incidents) — primarily leaking solenoid valves and irrigation fractures.\n2. **Energy Inefficiencies** (${energyCount} incidents) — unoccupied lab illumination and HVAC setpoint drifts.\n3. **Waste & Contamination** (${wasteCount} incidents) — non-biodegradable plastics in dining composting chutes.\n\n*(Note: Insights generated from current demonstration data)*`;
    }

    if (q.includes('building') || q.includes('unresolved') || q.includes('most')) {
      return `Currently, **Nursing** and **School of Engineering** have the highest concentration of open maintenance tickets (3 active issues each).\n\nKey hotspot: **School of Engineering Restroom 204B** (estimated 15 L/min fluid loss under repair) and **Nursing Ground Floor Sort Station**. Digital Twin suggests prioritizing sensor recalibration in these sectors.`;
    }

    if (q.includes('electricity') || q.includes('energy') || q.includes('peak') || q.includes('hvac')) {
      return `Campus Energy Intelligence recommendations:\n\n1. **PIR Sensor Calibration**: Automated daylight harvesting in School of Engineering Studio C can save ~42 kWh/day.\n2. **HVAC Deadband Adjustment**: Shifting baseline cooling setpoints from 21°C to 23.5°C during off-hours yields a projected **14.2% monthly power reduction**.\n3. **Solar PV Optimization**: Nursing solar array currently offsets 28% of baseline daytime demand.`;
    }

    if (q.includes('recycl') || q.includes('trash') || q.includes('waste') || q.includes('bin')) {
      const fullBins = wasteBins.filter(b => b.fullness >= 85);
      return `Campus Waste Digital Twin status:\n\n- **${fullBins.length} smart bins** currently exceed 85% volumetric threshold and require urgent collection (notably **School of Engineering Cafe** at 94% and **Nursing Central Sort** at 96%).\n- Automated dispatch has scheduled route optimization for the Housekeeping team.\n- Smart recycling AI classifier is accessible at **/tracks/smart-recycling**.`;
    }

    if (q.includes('role') || q.includes('permission') || q.includes('who are you')) {
      return `You are currently logged in as **${currentRole.toUpperCase()}**. You have access to ${currentRole === 'admin' ? 'full campus routing, department administration, and analytics' : currentRole === 'maintenance' ? 'assigned tickets, repair logs, and work verification' : 'sustainability reporting, personal timeline tracking, and resolution confirmation'}.`;
    }

    return `EcoVerse AI analyzes real-time campus data streams combining Computer Vision detections, 2D Digital Twin virtual states, and generative sustainability algorithms.\n\nYou can ask about specific reports (e.g. "ECO-2026-0104"), building energy consumption, overflowing bins, or campus decarbonization recommendations. *(Generated using simulated demonstration data)*`;
  };

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: 'Just now'
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const answer = generateAnswer(query);
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: answer,
        timestamp: 'Just now'
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <>
      {/* Floating Launcher Button */}
      {!isCopilotOpen && (
        <button
          onClick={() => setIsCopilotOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 font-bold shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 group"
          aria-label="Open EcoVerse AI Copilot"
        >
          <div className="relative">
            <Sparkles className="w-5 h-5 text-slate-950 animate-spin" style={{ animationDuration: '6s' }} />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-300 rounded-full animate-ping"></span>
          </div>
          <span className="text-sm font-display tracking-tight">EcoVerse Copilot</span>
          <span className="text-[10px] bg-slate-950/20 px-1.5 py-0.5 rounded font-mono">AI</span>
        </button>
      )}

      {/* Floating Chat Modal */}
      {isCopilotOpen && (
        <div className="fixed bottom-6 right-4 sm:right-6 z-50 w-[95vw] sm:w-[440px] h-[580px] max-h-[85vh] rounded-2xl glass-panel bg-slate-900/95 border border-cyan-500/30 shadow-2xl flex flex-col overflow-hidden text-slate-100 animate-in fade-in slide-in-from-bottom-5 duration-300">
          
          {/* Header */}
          <div className="p-3.5 bg-gradient-to-r from-slate-900 via-slate-800 to-cyan-950/80 border-b border-slate-700/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-cyan-400 flex items-center justify-center shadow-glow-cyan">
                <Bot className="w-5 h-5 text-slate-950" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-semibold text-sm font-display">EcoVerse Copilot</h3>
                  <span className="text-[9px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-1 rounded font-mono">
                    ONLINE
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">Contextual Campus AI Assistant</p>
              </div>
            </div>

            <button
              onClick={() => setIsCopilotOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              aria-label="Close Copilot"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Demonstration Notice */}
          <div className="bg-slate-950/60 px-3 py-1.5 text-[10px] text-slate-400 border-b border-slate-800/80 flex items-center gap-1.5">
            <Database className="w-3 h-3 text-cyan-400 shrink-0" />
            <span>Answers generated using simulated campus telemetry & sample records.</span>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3 leading-relaxed whitespace-pre-wrap ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-cyan-600 to-emerald-600 text-white rounded-tr-none shadow-md'
                      : 'bg-slate-800/90 border border-slate-700/80 text-slate-200 rounded-tl-none shadow'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[10px] text-slate-500 mt-1 px-1">
                  {msg.timestamp}
                </span>

                {/* Quick Action Suggestion Chips */}
                {msg.chips && msg.chips.length > 0 && (
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {msg.chips.map((chip, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(chip)}
                        className="text-[11px] text-left bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 hover:border-cyan-500/50 px-2.5 py-1.5 rounded-lg transition"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-slate-400 w-fit">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce [animation-delay:0.4s]"></span>
                <span className="text-[11px] ml-1">Analyzing campus records...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <div className="p-3 bg-slate-900/90 border-t border-slate-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask about reports, waste bins, energy, or recycling..."
                className="flex-1 bg-slate-950/80 border border-slate-700 focus:border-cyan-500 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="p-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-bold hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed transition"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
