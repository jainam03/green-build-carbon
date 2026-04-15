import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from "recharts";
import { AlertCircle, BarChart3, Leaf, LayoutDashboard, Truck, Settings, Sparkles, CheckCircle, PlusCircle, Calendar, Trash2, Info, HelpCircle, RotateCcw, ChevronDown, ChevronUp, ArrowRight, Keyboard, Check, AlertTriangle, FileText, Recycle } from "lucide-react";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useCarbonMappingEngine, ActivityLog } from "@/lib/useCarbonMappingEngine";
import { TraceCarbonLogo } from "@/components/ui/TraceCarbonLogo";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import KeyboardShortcutsHelp from "@/components/KeyboardShortcutsHelp";
import UnsavedChangesGuard from "@/components/UnsavedChangesGuard";

// Beautiful simple colors
const COLORS = ["#0ea5e9", "#f59e0b", "#10b981", "#64748b"];

/* ─── KPI Card Component (C&D Compliance KPIs) ─── */
interface KpiCardProps {
  label: string;
  value: string;
  sub: string;
  color: "emerald" | "blue" | "indigo" | "amber" | "rose";
  icon: React.ReactNode;
  isEmpty?: boolean;
  tooltip?: string;
}

const KPI_COLOR_MAP = {
  emerald: { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700", value: "text-emerald-800", icon: "bg-emerald-100 text-emerald-600" },
  blue:    { bg: "bg-blue-50",    border: "border-blue-200",    text: "text-blue-700",    value: "text-blue-800",    icon: "bg-blue-100 text-blue-600" },
  indigo:  { bg: "bg-indigo-50",  border: "border-indigo-200",  text: "text-indigo-700",  value: "text-indigo-800",  icon: "bg-indigo-100 text-indigo-600" },
  amber:   { bg: "bg-amber-50",   border: "border-amber-200",   text: "text-amber-700",   value: "text-amber-800",   icon: "bg-amber-100 text-amber-600" },
  rose:    { bg: "bg-rose-50",    border: "border-rose-200",    text: "text-rose-700",    value: "text-rose-800",    icon: "bg-rose-100 text-rose-600" },
};

function KpiCard({ label, value, sub, color, icon, isEmpty, tooltip }: KpiCardProps) {
  const c = KPI_COLOR_MAP[color];
  const card = (
    <div className={`rounded-xl border ${c.border} ${c.bg} p-4 flex flex-col gap-3 transition-shadow hover:shadow-md`}>
      <div className="flex items-center justify-between">
        <span className={`text-[10px] font-black uppercase tracking-widest ${c.text}`}>{label}</span>
        <span className={`w-7 h-7 rounded-lg flex items-center justify-center ${c.icon}`}>{icon}</span>
      </div>
      {isEmpty ? (
        <div className="text-center py-1">
          <p className={`text-xs font-semibold ${c.text} opacity-60`}>Add logs to calculate</p>
        </div>
      ) : (
        <>
          <p className={`text-3xl font-black tabular-nums tracking-tighter ${c.value}`}>{value}</p>
          <p className={`text-[11px] font-semibold ${c.text} opacity-70 leading-tight`}>{sub}</p>
        </>
      )}
    </div>
  );

  if (!tooltip) return card;
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild><div>{card}</div></TooltipTrigger>
        <TooltipContent className="max-w-xs text-xs"><p>{tooltip}</p></TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// Recharts Custom Tooltip (Plain Language)
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border rounded-lg shadow-lg text-sm">
        <p className="font-bold text-slate-800 mb-1">{label}</p>
        <p className="text-slate-600 font-medium">Impact: {payload[0].value.toFixed(1)} tons</p>
      </div>
    );
  }
  return null;
};

/* ─── Completion Helpers (Nielsen H1: Visibility of system status) ─── */

interface StepStatus {
  label: string;
  complete: boolean;
  icon: React.ReactNode;
}

function getStepStatuses(
  projectInputs: any,
  activityLogs: ActivityLog[]
): StepStatus[] {
  const materialTotal = projectInputs.concretePercent + projectInputs.steelPercent + projectInputs.bricksPercent + projectInputs.othersPercent;
  return [
    {
      label: "Project Info",
      complete: projectInputs.areaSqft > 0,
      icon: <Settings className="w-3.5 h-3.5" />,
    },
    {
      label: "Material Mix",
      complete: materialTotal === 100,
      icon: <LayoutDashboard className="w-3.5 h-3.5" />,
    },
    {
      label: "Activity Logs",
      complete: activityLogs.length > 0,
      icon: <Truck className="w-3.5 h-3.5" />,
    },
    {
      label: "Compliance",
      complete: projectInputs.rulesFollowed !== "Not sure",
      icon: <CheckCircle className="w-3.5 h-3.5" />,
    },
  ];
}

/* ─── Unit Conversion Helper (Nielsen H2: Real-world match) ─── */
function sqftToSqm(sqft: number): string {
  if (!sqft || sqft <= 0) return "";
  return `≈ ${(sqft / 10.7639).toLocaleString(undefined, { maximumFractionDigits: 0 })} m²`;
}

/* ─── Save Indicator Component (Nielsen H1: System status) ─── */
function SaveIndicator({ state }: { state: "" | "saving" | "saved" }) {
  if (!state) return null;
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full transition-all duration-300 ${
      state === "saving"
        ? "bg-amber-50 text-amber-700 border border-amber-200"
        : "bg-emerald-50 text-emerald-700 border border-emerald-200"
    }`}>
      {state === "saving" ? (
        <>
          Saving
          <span className="inline-flex gap-0.5">
            <span className="w-1 h-1 bg-amber-500 rounded-full save-dot" />
            <span className="w-1 h-1 bg-amber-500 rounded-full save-dot" />
            <span className="w-1 h-1 bg-amber-500 rounded-full save-dot" />
          </span>
        </>
      ) : (
        <>
          <Check className="w-3 h-3" /> Saved to cloud
        </>
      )}
    </span>
  );
}

/* ─── Inline Validation Message (Nielsen H9: Error diagnosis) ─── */
function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="flex items-center gap-1.5 text-[11px] font-semibold text-red-600 mt-1.5 ml-0.5">
      <AlertCircle className="w-3 h-3 shrink-0" /> {message}
    </p>
  );
}

function FieldSuccess({ message }: { message: string }) {
  return (
    <p className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 mt-1.5 ml-0.5">
      <Check className="w-3 h-3 shrink-0" /> {message}
    </p>
  );
}


export default function DashboardPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  // Use Firestore-Synced Engine
  const { 
    projectInputs, 
    setProjectInputs, 
    activityLogs,
    addActivityLog,
    deleteActivityLog,
    activeImpact,
    currentImpact,
    simulatedImpact,
    simulationActive,
    toggleSimulation,
    isLoading
  } = useCarbonMappingEngine(user?.id);

  // Modal State for New Activity Log
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [newLog, setNewLog] = useState<Omit<ActivityLog, 'id'>>({
    date: new Date().toISOString().split("T")[0],
    dieselLiters: 0,
    machineryUsage: "Medium",
    transportDistanceKm: 20,
    disposalType: "Mixed",
    truckLoads: 1,
  });

  // UX State
  const [savingState, setSavingState] = useState<"" | "saving" | "saved">("");
  const [showInsights, setShowInsights] = useState(false);
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showComplianceSection, setShowComplianceSection] = useState(false);

  // Modal form validation state (Nielsen H5: Error prevention)
  const [logFormTouched, setLogFormTouched] = useState<Record<string, boolean>>({});

  const handleSetInputs = (newInputs: any) => {
    setProjectInputs(newInputs);
    setHasUnsavedChanges(true);
    setSavingState("saving");
    setTimeout(() => setSavingState("saved"), 500);
    setTimeout(() => { setSavingState(""); setHasUnsavedChanges(false); }, 2500);
  };

  const handleSaveLog = () => {
    // Inline validation (Nielsen H5)
    if (newLog.truckLoads <= 0) {
      toast.error("Truck loads must be at least 1 to record activity.");
      return;
    }
    if (newLog.transportDistanceKm < 0) {
      toast.error("Distance cannot be negative.");
      return;
    }

    // Nielsen H5: Duplicate date warning (non-blocking)
    const existingDateLog = activityLogs.find(log => log.date === newLog.date);
    
    // Shneiderman R4: Closure — Confirmation with impact preview
    const estimatedDailyTons = newLog.truckLoads * 20;
    addActivityLog(newLog);
    setIsLogModalOpen(false);
    setLogFormTouched({});
    
    if (existingDateLog) {
      toast.warning(`Note: You already have a log entry for ${newLog.date}.`, {
        description: `Activity logged (~${estimatedDailyTons}t). Multiple entries per day are allowed.`,
      });
    } else {
      toast.success(`Activity logged: ~${estimatedDailyTons}t moved on ${newLog.date}`, {
        description: "Impact recalculated automatically.",
      });
    }
  };

  const handleDeleteLog = (log: ActivityLog) => {
    const { id, ...logData } = log;
    deleteActivityLog(id);
    toast.error("Activity log deleted.", {
      action: {
        label: "Undo",
        onClick: () => {
           addActivityLog(logData);
           toast.success("Log restored successfully.");
        }
      }
    });
  };

  const onToggleSimulation = () => {
    toggleSimulation();
    if (!simulationActive) {
      toast.success("Simulation activated: Optimized workflow applied.", {
        description: "Shows best-case emissions with perfect compliance, fuel tracking, and 100% recycling.",
      });
    } else {
      toast.info("Reverted to your actual baseline metrics.");
    }
  };

  const handleResetForm = () => {
    handleSetInputs({
      areaSqft: 0,
      demolitionType: "Mechanical",
      concretePercent: 0,
      steelPercent: 0,
      bricksPercent: 0,
      othersPercent: 0,
      rulesFollowed: "Not sure",
      complianceType: "Informal / none",
    });
    setShowResetConfirm(false);
    toast.info("Project inputs have been reset to defaults.");
  };

  // ─── Keyboard Shortcuts (Shneiderman R7 / Nielsen H7) ─── 
  useKeyboardShortcuts([
    {
      key: "n",
      ctrl: true,
      description: "New Activity Log",
      action: () => {
        setNewLog({ ...newLog, date: new Date().toISOString().split("T")[0] });
        setIsLogModalOpen(true);
      },
    },
    {
      key: "s",
      ctrl: true,
      description: "Toggle Simulation",
      action: onToggleSimulation,
    },
    {
      key: "Escape",
      description: "Close modal",
      action: () => {
        setIsLogModalOpen(false);
        setShowShortcutsHelp(false);
        setShowResetConfirm(false);
      },
    },
    {
      key: "?",
      description: "Show shortcuts",
      disableInInputs: true,
      action: () => setShowShortcutsHelp(true),
    },
    {
      key: "z",
      ctrl: true,
      description: "Undo last change",
      action: () => {
        toast.info("Undo is available for delete actions via the toast notification.");
      },
    },
  ]);

  // Step completion state (Nielsen H1)
  const steps = useMemo(() => getStepStatuses(projectInputs, activityLogs), [projectInputs, activityLogs]);
  const completedSteps = steps.filter(s => s.complete).length;

  // Material total validation
  const materialTotal = projectInputs.concretePercent + projectInputs.steelPercent + projectInputs.bricksPercent + projectInputs.othersPercent;
  const materialValid = materialTotal === 100;

  // Log form validation messages (inline, not toast-only) 
  const logValidation = useMemo(() => ({
    truckLoads: logFormTouched.truckLoads && newLog.truckLoads <= 0 ? "Must be at least 1 truck load" : undefined,
    distance: logFormTouched.distance && newLog.transportDistanceKm < 0 ? "Distance cannot be negative" : undefined,
    date: logFormTouched.date && !newLog.date ? "Please select a date" : undefined,
  }), [newLog, logFormTouched]);

  // ─── C&D KPI Derivations (from existing captured data) ───
  // These must be above the early-return guard to satisfy Rules of Hooks.

  // KPI 1: Waste Diversion Rate
  const kpiDiversion = useMemo(() => {
    if (activityLogs.length === 0) return null;
    const totalTons = activityLogs.reduce((s, l) => s + l.truckLoads * 20, 0);
    const diverted = activityLogs.reduce((s, l) => {
      if (l.disposalType === "Recycling") return s + l.truckLoads * 20 * 1.0;
      if (l.disposalType === "Mixed")     return s + l.truckLoads * 20 * 0.50;
      return s;
    }, 0);
    const rate = totalTons > 0 ? (diverted / totalTons) * 100 : 0;
    return { rate: Math.round(rate), totalTons: Math.round(totalTons) };
  }, [activityLogs]);

  // KPI 2: Waste Generation Rate (tons / sqm)
  const kpiWasteRate = useMemo(() => {
    if (activityLogs.length === 0 || projectInputs.areaSqft <= 0) return null;
    const totalTons = activityLogs.reduce((s, l) => s + l.truckLoads * 20, 0);
    const areaSqm = projectInputs.areaSqft / 10.7639;
    const rate = totalTons / areaSqm;
    return { rate: parseFloat(rate.toFixed(3)), totalTons: Math.round(totalTons) };
  }, [activityLogs, projectInputs.areaSqft]);

  // KPI 3: Compliance Score (0–100%)
  const kpiCompliance = useMemo(() => {
    let score = 0;
    if (projectInputs.rulesFollowed === "Yes")      score += 60;
    else if (projectInputs.rulesFollowed === "No")  score += 0;
    else                                             score += 20;
    if (projectInputs.complianceType === "CPCB rules")          score += 40;
    else if (projectInputs.complianceType === "BMC guidelines") score += 35;
    const riskLevel = score >= 80 ? "Low Risk" : score >= 40 ? "Medium Risk" : "High Risk";
    const riskColor: KpiCardProps["color"] = score >= 80 ? "emerald" : score >= 40 ? "amber" : "rose";
    return { score, riskLevel, riskColor };
  }, [projectInputs.rulesFollowed, projectInputs.complianceType]);


  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-500">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-emerald-500 rounded-full animate-spin mb-4"></div>
        <p className="font-semibold text-lg">Syncing Project Data...</p>
        <p className="text-sm text-slate-400 mt-1">Loading from cloud database</p>
      </div>
    );
  }

  // Pie Chart Data (Dynamic to Simulation)
  const breakdownData = [
    { name: "Material Impact", value: activeImpact.materialImpact },
    { name: "Machine Impact", value: activeImpact.machineImpact },
    { name: "Transport Impact", value: activeImpact.transportImpact },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      {/* Nielsen H5: Warn before leaving with unsaved changes */}
      <UnsavedChangesGuard hasUnsavedChanges={hasUnsavedChanges} />

      {/* Top Application Header */}
      <header className="bg-white border-b border-slate-200 px-4 md:px-6 py-3 flex justify-between items-center shadow-sm sticky top-0 z-50">
        <TraceCarbonLogo />
        <div className="flex items-center gap-3">
          {/* Persistent emissions summary (Shneiderman R8: Reduce memory load) */}
          <div className="hidden md:flex items-center gap-3 text-sm">
            <span className="font-semibold text-slate-700">
              {projectInputs.areaSqft > 0 ? `${projectInputs.areaSqft.toLocaleString()} sq ft` : "No project set"}
            </span>
            <span className="text-slate-300">|</span>
            <span className="font-bold text-emerald-700 tabular-nums">
              {Math.round(activeImpact.totalEmissions).toLocaleString()} tCO₂
            </span>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setShowShortcutsHelp(true)}
                  className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label="Keyboard shortcuts"
                >
                  <Keyboard className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent><p className="text-xs">Keyboard shortcuts (?)</p></TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <button
            onClick={() => navigate("/docs/formulas")}
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 px-3 py-2 rounded-lg transition-colors"
          >
            <FileText className="w-3.5 h-3.5" /> Methodology
          </button>
          <button
            onClick={signOut}
            className="text-xs font-bold text-slate-600 border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 px-4 py-2 rounded-lg transition-colors"
          >
            Log Out
          </button>
        </div>
      </header>

      {/* ─── Progress Stepper (Nielsen H1: System status) ─── */}
      <div className="bg-white border-b border-slate-100 px-4 md:px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">Setup</span>
          {steps.map((step, i) => (
            <React.Fragment key={i}>
              {i > 0 && (
                <div className={`w-6 h-px shrink-0 transition-colors ${steps[i - 1].complete ? "bg-emerald-400" : "bg-slate-200"}`} />
              )}
              <div
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-all duration-300 ${
                  step.complete
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200 step-complete-pulse"
                    : "bg-slate-50 text-slate-400 border border-slate-200"
                }`}
              >
                {step.complete ? <Check className="w-3 h-3" /> : step.icon}
                {step.label}
              </div>
            </React.Fragment>
          ))}
          <span className="ml-auto shrink-0 text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
            {completedSteps}/{steps.length}
          </span>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* --- LEFT COLUMN: INTUITIVE DATA INPUTS --- */}
        <section className="lg:col-span-4 space-y-6">
          
          {/* Card 1: Project Info */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 relative group">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                <Settings className="w-5 h-5 text-emerald-600"/> 1. Project Info
                {projectInputs.areaSqft > 0 && <Check className="w-4 h-4 text-emerald-500" />}
              </h2>
              <div className="flex items-center gap-2">
                <SaveIndicator state={savingState} />
              </div>
            </div>
            <div className="space-y-4">
               <div>
                 {/* Nielsen H2: Natural language label */}
                 <label className="text-sm font-semibold text-slate-700 block mb-1">How large is the building? (sq ft)</label>
                 <input 
                   type="number" 
                   value={projectInputs.areaSqft || ""} 
                   placeholder="e.g. 50,000"
                   onChange={(e) => handleSetInputs({...projectInputs, areaSqft: Number(e.target.value)})}
                   className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                 />
                 {/* Unit conversion helper (Nielsen H2: Real-world match) */}
                 {projectInputs.areaSqft > 0 && (
                   <p className="text-[11px] text-slate-400 font-medium mt-1 ml-0.5">{sqftToSqm(projectInputs.areaSqft)}</p>
                 )}
               </div>
               <div>
                  <div className="flex justify-between items-center mb-1">
                    {/* Nielsen H2: Natural language */}
                    <label className="text-sm font-semibold text-slate-700 block">How is demolition being done?</label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="w-4 h-4 text-slate-400 hover:text-slate-600 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs text-xs">
                          <p>Sets baseline fuel estimates when exact daily diesel isn't tracked. Manual demolition uses far less fuel.</p>
                          <Link to="/methodology" className="text-emerald-600 underline font-semibold mt-1 inline-block">Learn more →</Link>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                 <select 
                   value={projectInputs.demolitionType} 
                   onChange={(e: any) => handleSetInputs({...projectInputs, demolitionType: e.target.value})}
                   className="w-full border border-slate-300 rounded-lg p-2.5 text-sm bg-white outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 transition-all"
                 >
                   <option value="Mechanical">Mechanical (heavy machinery)</option>
                   <option value="Semi-mechanical">Semi-mechanical (mixed)</option>
                   <option value="Manual">Manual (hand labor)</option>
                 </select>
               </div>
            </div>
          </div>

          {/* Card 2: Material Mix */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                <LayoutDashboard className="w-5 h-5 text-blue-600"/> 2. Material Mix
                {materialValid && <Check className="w-4 h-4 text-emerald-500" />}
              </h2>
              <span className={`text-xs px-2.5 py-1 rounded-full font-bold border transition-all ${materialValid ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : materialTotal > 100 ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                {materialTotal}%
              </span>
            </div>
            <div className="space-y-4">
               {/* Nielsen H9: Specific, contextual error messages */}
               {materialTotal !== 100 && materialTotal > 0 && (
                 <div className={`text-xs font-semibold p-2.5 rounded-lg border flex gap-2 items-start shadow-sm ${
                   materialTotal > 100
                     ? "text-red-700 bg-red-50 border-red-200"
                     : "text-amber-700 bg-amber-50 border-amber-200"
                 }`}>
                    {materialTotal > 100 ? <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" /> : <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />}
                    <span>
                      {materialTotal > 100
                        ? `Total is ${materialTotal}% — exceeds 100%. Please reduce values.`
                        : `Total is ${materialTotal}% — add ${100 - materialTotal}% more to reach 100%.`}
                    </span>
                 </div>
               )}
               {[
                 { label: "Concrete", key: "concretePercent", ringColor: "focus:ring-blue-500" },
                 { label: "Steel", key: "steelPercent", ringColor: "focus:ring-amber-500" },
                 { label: "Bricks / Masonry", key: "bricksPercent", ringColor: "focus:ring-red-500" },
                 { label: "Aggregates / Others", key: "othersPercent", ringColor: "focus:ring-slate-500" },
               ].map((mat) => (
                 <div key={mat.key} className="flex justify-between items-center">
                   <span className="font-semibold text-slate-700 text-sm">{mat.label}</span>
                   <div className="relative w-24">
                     <input
                       type="number"
                       min="0"
                       max="100"
                       value={(projectInputs as any)[mat.key] || ""}
                       placeholder="0"
                       onChange={(e) => handleSetInputs({...projectInputs, [mat.key]: Number(e.target.value)})}
                       className={`w-full border border-slate-300 rounded-lg p-2 pr-6 text-sm text-right ${mat.ringColor} focus:ring-2 outline-none transition-all`}
                     />
                     <span className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">%</span>
                   </div>
                 </div>
               ))}
            </div>
          </div>

          {/* Card 3: Activity Logs */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <div className="flex justify-between items-center mb-4">
               <h2 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                 <Truck className="w-5 h-5 text-amber-600"/> 3. Daily Activity Logs
                 {activityLogs.length > 0 && <Check className="w-4 h-4 text-emerald-500" />}
               </h2>
               <button 
                 onClick={() => {
                   setNewLog({...newLog, date: new Date().toISOString().split("T")[0]});
                   setIsLogModalOpen(true);
                   setLogFormTouched({});
                 }}
                 className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg transition border border-amber-200"
               >
                 <PlusCircle className="w-4 h-4"/> Add Log
               </button>
            </div>
            
            <div className="space-y-3">
               {activityLogs.length === 0 ? (
                 <div className="text-center py-6 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                   <Truck className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                   <p className="text-sm text-slate-500 font-medium">No daily logs recorded yet.</p>
                   <p className="text-xs text-slate-400 mt-1">Press <kbd className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-600 font-mono text-[10px] font-bold">Ctrl+N</kbd> to add one.</p>
                 </div>
               ) : (
                 <div className="max-h-[300px] overflow-y-auto pr-1 space-y-3 custom-scrollbar">
                   {activityLogs.map((log) => (
                     <div key={log.id} className="border border-slate-200 bg-slate-50 rounded-lg p-3 flex flex-col gap-2 relative group hover:border-amber-300 transition-colors">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                             <Calendar className="w-4 h-4 text-slate-400"/>
                             <span className="text-sm font-bold text-slate-700">{log.date}</span>
                          </div>
                          <button 
                             onClick={() => handleDeleteLog(log)}
                             className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-all bg-white rounded-md p-1 border border-slate-200 shadow-sm"
                             title="Delete Log (reversible — Undo available)"
                             aria-label={`Delete log from ${log.date}`}
                          >
                             <Trash2 className="w-3.5 h-3.5"/>
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-y-2 gap-x-1 text-[11px] text-slate-600">
                           <div><span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Output:</span><br/> {log.truckLoads} truck loads</div>
                           <div><span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Disposal:</span><br/> {log.disposalType} <span className="text-slate-400">({log.transportDistanceKm}km)</span></div>
                           <div className="col-span-2"><span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Machinery Fuel:</span><br/> {log.dieselLiters > 0 ? <span className="font-medium text-emerald-700">{log.dieselLiters} L exact</span> : <span className="font-medium text-amber-600">Estimated ({log.machineryUsage})</span>}</div>
                        </div>
                     </div>
                   ))}
                 </div>
               )}
            </div>
          </div>

          {/* Card 4: Compliance (Nielsen H8: Progressive disclosure — collapsed until steps 1-3 done) */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <button
              onClick={() => setShowComplianceSection(!showComplianceSection)}
              className="w-full font-bold text-lg text-slate-800 flex items-center justify-between gap-2"
            >
              <span className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-indigo-500"/> 4. Compliance Check
                {projectInputs.rulesFollowed !== "Not sure" && <Check className="w-4 h-4 text-emerald-500" />}
              </span>
              {showComplianceSection ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>
            {!showComplianceSection && (
              <p className="text-xs text-slate-400 mt-2 ml-7">
                {completedSteps >= 3 ? "Click to expand and complete your setup." : "Complete Steps 1-3 first to unlock this section."}
              </p>
            )}
            {showComplianceSection && (
             <div className="space-y-4 mt-4">
               <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-sm font-semibold text-slate-700 block">Were demolition rules followed?</label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="w-4 h-4 text-slate-400 hover:text-slate-600 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs text-xs">
                          <p>Non-compliance applies a Data Quality (DQ) penalty to Material & Processing emissions due to unrecorded fugitive dust/leaks.</p>
                          <Link to="/methodology" className="text-emerald-600 underline font-semibold mt-1 inline-block">Learn more →</Link>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                 <select 
                   value={projectInputs.rulesFollowed} 
                   onChange={(e: any) => handleSetInputs({...projectInputs, rulesFollowed: e.target.value})}
                   className="w-full border border-slate-300 rounded-lg p-2.5 text-sm bg-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 transition-all mb-1"
                 >
                   <option value="Yes">Yes — rules were followed</option>
                   <option value="No">No — rules were not followed</option>
                   <option value="Not sure">Not sure (default penalty applies)</option>
                 </select>
               </div>
               {projectInputs.rulesFollowed === "Yes" && (
                 <div>
                   <label className="text-sm font-semibold text-slate-700 block mb-1">Type of compliance framework</label>
                   <select 
                     value={projectInputs.complianceType} 
                     onChange={(e: any) => handleSetInputs({...projectInputs, complianceType: e.target.value})}
                     className="w-full border border-slate-300 rounded-lg p-2.5 text-sm bg-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 transition-all mb-1"
                   >
                     <option value="BMC guidelines">BMC guidelines followed</option>
                     <option value="CPCB rules">CPCB rules followed</option>
                     <option value="Informal / none">Informal / none</option>
                   </select>
                 </div>
               )}
            </div>
            )}
          </div>

          {/* Reset Form (Nielsen H3: User control and freedom / Shneiderman R6) */}
          <button
            onClick={() => setShowResetConfirm(true)}
            className="w-full flex items-center justify-center gap-2 text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors py-2"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset all project inputs
          </button>

        </section>

        {/* --- RIGHT COLUMN: VISUAL OUTPUTS & INSIGHTS --- */}
        <section className="lg:col-span-8 space-y-6">
          
          {/* Top Metric Header */}
          <div className={`p-8 rounded-2xl shadow border flex flex-col items-start md:items-center md:flex-row justify-between transition-colors duration-500 ${simulationActive ? "bg-emerald-700 border-emerald-800" : "bg-slate-900 border-slate-800"}`}>
             <div className="text-white mb-6 md:mb-0">
               <h3 className="text-emerald-300 font-bold uppercase tracking-widest text-xs mb-2">
                 {activeImpact.isProjected ? "Projected Carbon Emissions" : "Total Carbon Emissions"}
               </h3>
               <p className="text-5xl lg:text-7xl font-black tabular-nums tracking-tighter">
                 {Math.round(activeImpact.totalEmissions).toLocaleString()} <span className="text-2xl lg:text-4xl font-semibold opacity-70 tracking-normal">tons CO₂</span>
               </p>
               
               <div className="flex flex-col gap-2 mt-4 items-start">
                 {activeImpact.isProjected && (
                   <span className="inline-block bg-slate-800 border border-slate-700 text-emerald-200 px-3 py-1 rounded text-xs font-semibold">
                     Forecasted using your current log rate
                   </span>
                 )}
                 {simulationActive && (
                   <span className="inline-block bg-white text-emerald-800 px-3 py-1 rounded-sm text-xs font-bold shadow-lg max-w-sm leading-tight">
                     Optimized: Saved {Math.round(currentImpact.totalEmissions - simulatedImpact.totalEmissions).toLocaleString()} tons — perfect compliance, exact fuel, 100% recycling.
                   </span>
                 )}
                 {activeImpact.compliancePenalty > 0 && !simulationActive && (
                   <span className="inline-block bg-red-500/20 text-red-200 border border-red-500/30 px-3 py-1 rounded text-xs font-semibold">
                     Includes {Math.round(activeImpact.compliancePenalty)}t non-compliance DQ penalty
                   </span>
                 )}
               </div>
             </div>

             {/* Scenario Simulation Button */}
             <button
               onClick={onToggleSimulation}
               className={`px-6 py-4 rounded-xl font-bold flex items-center gap-2 transition shadow-lg transform active:scale-95 whitespace-nowrap ${
                 simulationActive 
                   ? "bg-white text-emerald-800 border-2 border-emerald-500" 
                   : "bg-emerald-500 text-white hover:bg-emerald-400 border-2 border-transparent"
               }`}
             >
               <Sparkles className="w-5 h-5" />
               {simulationActive ? "Revert to Baseline" : "Optimize My Workflow"}
             </button>
          </div>

          {/* ─── C&D Compliance KPI Row ─── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <KpiCard
              label="Waste Diversion Rate"
              value={kpiDiversion ? `${kpiDiversion.rate}%` : "—"}
              sub={
                kpiDiversion
                  ? `${kpiDiversion.totalTons.toLocaleString()}t total · ${kpiDiversion.rate >= 50 ? "✓ Above 50% target" : "↑ Target: ≥50% diverted"}`
                  : ""
              }
              color="emerald"
              icon={<Recycle className="w-4 h-4" />}
              isEmpty={!kpiDiversion}
              tooltip="% of total waste tonnage routed to Recycling or Mixed (partial) processing, rather than landfill. Target: ≥50% per CPCB C&D Guidelines."
            />
            <KpiCard
              label="Waste Generation Rate"
              value={kpiWasteRate ? `${kpiWasteRate.rate} t/m²` : "—"}
              sub={
                kpiWasteRate
                  ? `${kpiWasteRate.totalTons.toLocaleString()}t logged · ${kpiWasteRate.rate <= 0.5 ? "✓ Within benchmark" : "↓ Benchmark: <0.5 t/m²"}`
                  : ""
              }
              color="blue"
              icon={<BarChart3 className="w-4 h-4" />}
              isEmpty={!kpiWasteRate}
              tooltip="Tons of C&D waste generated per square metre of construction/demolition area. Industry benchmark: <0.5 t/m². Used for regulatory benchmarking and Waste Management Plan submissions."
            />
            <KpiCard
              label="Compliance Score"
              value={`${kpiCompliance.score}/100`}
              sub={`${kpiCompliance.riskLevel} · Based on rules followed & framework`}
              color={kpiCompliance.riskColor}
              icon={<CheckCircle className="w-4 h-4" />}
              tooltip="Composite score derived from whether demolition rules were followed (60 pts) and the compliance framework in use (40 pts). Reflects regulatory adherence quality per C&D Waste Rules 2016."
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             {/* Charts: Emission Breakdown */}
             <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center h-[380px]">
                <h3 className="font-bold text-slate-800 text-lg mb-2 self-start flex gap-2 items-center">
                  Emission Breakdown
                </h3>
                {activityLogs.length === 0 ? (
                  <div className="w-full flex-1 flex items-center justify-center">
                    <div className="text-center px-8 border border-dashed border-slate-200 p-6 rounded-xl">
                      <BarChart3 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="text-sm font-medium text-slate-400">Add activity logs to see forecasted breakdown.</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="w-full h-[220px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={breakdownData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={90}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                          >
                            {breakdownData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <RechartsTooltip content={<CustomTooltip />} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="grid grid-cols-2 w-full gap-2 mt-4">
                       {breakdownData.map((entry, idx) => {
                         const totalSum = breakdownData[0].value + breakdownData[1].value + breakdownData[2].value;
                         const percent = totalSum > 0 ? ((entry.value / totalSum) * 100).toFixed(0) : "0";
                         return (
                           <div key={idx} className="flex items-center gap-2 text-xs text-slate-600 font-medium bg-slate-50 p-2 rounded-lg border border-slate-100">
                             <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: COLORS[idx] }}></span>
                             <span className="truncate">{percent}% {entry.name.replace(" Impact", "")}</span>
                           </div>
                         )
                       })}
                    </div>
                  </>
                )}
             </div>

             {/* Charts: Timeline Trend */}
             <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col h-[380px]">
                <h3 className="font-bold text-slate-800 text-lg mb-2 flex gap-2 items-center">
                  Cumulative Impact Trend
                </h3>
                {activityLogs.length === 0 ? (
                  <div className="w-full flex-1 flex items-center justify-center">
                    <div className="text-center px-8 border border-dashed border-slate-200 p-6 rounded-xl">
                      <BarChart3 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="text-sm font-medium text-slate-400">Add activity logs to see timeline trend.</p>
                    </div>
                  </div>
                ) : (
                  <div className="w-full flex-1 mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={activeImpact.timelineData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} dx={-10} width={35} />
                        <RechartsTooltip content={<CustomTooltip />} />
                        <Line type="monotone" dataKey="impact" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 4, fill: "#0ea5e9", strokeWidth: 0 }} activeDot={{ r: 6, strokeWidth: 0 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
             </div>
          </div>

          {/* Auto-Insights — Togglable (Nielsen H8: Minimalist design / Progressive disclosure) */}
          <button
            onClick={() => setShowInsights(!showInsights)}
            className="w-full flex items-center justify-between py-3 px-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:bg-slate-50 transition-colors text-sm font-semibold text-slate-700"
          >
            <span className="flex items-center gap-2">
              <Info className="w-4 h-4 text-slate-400" />
              Platform Insights
            </span>
            {showInsights ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {showInsights && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in duration-300">
               <div className="bg-amber-50/50 p-4 border border-amber-100 rounded-xl hover:shadow-md transition">
                 <h4 className="font-bold text-amber-900 border-b border-amber-200 pb-2 mb-2 text-sm">Plain English LCA</h4>
                 <p className="text-xs text-amber-800 leading-relaxed">Translates complex LCA science into plain English with intuitive inputs like Square Footage, saving you from navigating confusing technical jargon.</p>
               </div>

               <div className="bg-blue-50/50 p-4 border border-blue-100 rounded-xl hover:shadow-md transition">
                 <h4 className="font-bold text-blue-900 border-b border-blue-200 pb-2 mb-2 text-sm">Chronological Trendlines</h4>
                 <p className="text-xs text-blue-800 leading-relaxed">Provides real-time chronological trendlines and transparent data alignment. Your total score tracks exactly what happens on site, day by day.</p>
               </div>
               
               <div className="bg-emerald-50/50 p-4 border border-emerald-100 rounded-xl hover:shadow-md transition">
                 <h4 className="font-bold text-emerald-900 border-b border-emerald-200 pb-2 mb-2 text-sm">Actionable Insights</h4>
                 <p className="text-xs text-emerald-800 leading-relaxed">Empowers demolition teams with actionable insights to optimize site operations and reduce emissions, like simulating 100% recycling routing.</p>
               </div>
            </div>
          )}

          <div className="mt-8 pt-4 border-t border-slate-200">
             <p className="text-sm font-semibold text-slate-700 mb-1">
               "This tool uses a lifecycle-based carbon estimation approach aligned with international sustainability frameworks such as ISO lifecycle methods, GHG Protocol, and GRI."
             </p>
             <p className="text-xs text-slate-500 italic">
               "This tool provides estimated carbon values for awareness and decision-making, not for regulatory or audited reporting."
             </p>
          </div>

        </section>
      </main>

      {/* --- ADD LOG MODAL (Enhanced with inline validation — Nielsen H5, H9) --- */}
      {isLogModalOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          onClick={() => setIsLogModalOpen(false)}
          onKeyDown={(e) => {
             if (e.key === "Enter") handleSaveLog();
             if (e.key === "Escape") setIsLogModalOpen(false);
          }}
        >
           <div 
             className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200 border border-slate-200"
             onClick={e => e.stopPropagation()}
           >
              {/* Breadcrumb context (Nielsen H6: Recognition) */}
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Dashboard → New Activity Log</p>
              <h2 className="text-xl font-black text-slate-800 mb-5 items-center flex gap-2">
                 <Truck className="w-5 h-5 text-amber-500"/> Record Daily Activity
              </h2>
              <div className="space-y-4">
                 <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="text-sm font-bold text-slate-700 block mb-1">Date</label>
                     <input
                       type="date"
                       value={newLog.date}
                       onChange={e => { setNewLog({...newLog, date: e.target.value}); setLogFormTouched({...logFormTouched, date: true}); }}
                       className={`w-full border rounded-lg p-2 text-sm outline-none transition-all ${logValidation.date ? "border-red-300 bg-red-50 focus:border-red-500" : "border-slate-300 bg-slate-50 focus:border-amber-500 focus:bg-white"}`}
                     />
                     <FieldError message={logValidation.date} />
                   </div>
                   <div>
                     <label className="text-sm font-bold text-slate-700 block mb-1">Truck Loads (Output)</label>
                     <div className="relative">
                       <input
                         type="number"
                         min="1"
                         value={newLog.truckLoads}
                         onChange={e => { setNewLog({...newLog, truckLoads: Number(e.target.value)}); setLogFormTouched({...logFormTouched, truckLoads: true}); }}
                         className={`w-full border rounded-lg p-2 pr-12 text-sm outline-none transition-all ${logValidation.truckLoads ? "border-red-300 bg-red-50 focus:border-red-500" : "border-slate-300 bg-slate-50 focus:border-amber-500 focus:bg-white"}`}
                       />
                       <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">loads</span>
                     </div>
                     <FieldError message={logValidation.truckLoads} />
                   </div>
                 </div>

                 <div className="bg-amber-50/50 p-4 border border-amber-100 rounded-lg space-y-3">
                   <h3 className="font-bold text-amber-800 text-sm border-b border-amber-200 pb-1 -mx-2 px-2 flex justify-between items-center">
                     Logistics
                   </h3>
                   <div>
                     <div className="flex justify-between items-center mb-1">
                       <label className="text-xs font-bold text-slate-600 block">Where is waste going?</label>
                       <TooltipProvider>
                         <Tooltip>
                           <TooltipTrigger asChild>
                             <HelpCircle className="w-3 h-3 text-amber-600/70 hover:text-amber-800 cursor-help" />
                           </TooltipTrigger>
                           <TooltipContent className="max-w-[200px] text-xs">
                             <p>Recycling applies heavy negative carbon benefits by replacing virgin material extraction.</p>
                           </TooltipContent>
                         </Tooltip>
                       </TooltipProvider>
                     </div>
                     <select value={newLog.disposalType} onChange={(e: any) => setNewLog({...newLog, disposalType: e.target.value})} className="w-full border border-slate-300 rounded-lg p-2 text-sm bg-white outline-none focus:border-amber-500 mb-1">
                       <option value="Dumping">Dumping (Landfill)</option>
                       <option value="Mixed">Mixed Processing</option>
                       <option value="Recycling">Advanced Recycling</option>
                     </select>
                     {newLog.disposalType === "Recycling" && (
                       <FieldSuccess message="Best option — maximizes carbon offset credits" />
                     )}
                   </div>
                   <div>
                     <label className="text-xs font-bold text-slate-600 block mb-1">Distance to facility</label>
                     <div className="relative">
                       <input
                         type="number"
                         min="0"
                         value={newLog.transportDistanceKm}
                         onChange={e => { setNewLog({...newLog, transportDistanceKm: Number(e.target.value)}); setLogFormTouched({...logFormTouched, distance: true}); }}
                         className={`w-full border rounded-lg p-2 pr-10 text-sm outline-none transition-all ${logValidation.distance ? "border-red-300 bg-red-50 focus:border-red-500" : "border-slate-300 focus:border-amber-500"}`}
                       />
                       <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">km</span>
                     </div>
                     <FieldError message={logValidation.distance} />
                   </div>
                 </div>

                 <div className="bg-slate-50 p-4 border border-slate-200 rounded-lg space-y-3">
                   <h3 className="font-bold text-slate-700 text-sm border-b border-slate-200 pb-1 -mx-2 px-2">Machinery Fuel</h3>
                   <div>
                     <label className="text-xs font-bold text-slate-600 block mb-1 flex justify-between">Exact Diesel Used <span className="text-slate-400">(Optional)</span></label>
                     <div className="relative">
                       <input type="number" placeholder="e.g. 50" min="0" value={newLog.dieselLiters || ""} onChange={e => setNewLog({...newLog, dieselLiters: Number(e.target.value)})} className="w-full border border-slate-300 rounded-lg p-2 pr-10 text-sm outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 bg-white transition-all"/>
                       <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">litres</span>
                     </div>
                     {newLog.dieselLiters > 0 && (
                       <FieldSuccess message="Exact data — no estimation penalty (DQ=1.0)" />
                     )}
                   </div>
                   
                   <div>
                     <label className="text-xs font-bold text-slate-600 block mb-1 flex justify-between">OR Estimate Usage <span className="text-amber-600 font-bold">(+10% penalty)</span></label>
                     <select disabled={newLog.dieselLiters > 0} value={newLog.machineryUsage} onChange={(e: any) => setNewLog({...newLog, machineryUsage: e.target.value})} className={`w-full border font-medium rounded-lg p-2 text-sm outline-none focus:border-amber-500 transition-all ${newLog.dieselLiters > 0 ? 'bg-slate-100 border-slate-200 text-slate-400' : 'bg-white border-slate-300 shadow-inner'}`}>
                       <option value="Low">Low / Light work</option>
                       <option value="Medium">Medium usage</option>
                       <option value="High">Heavy / Constant usage</option>
                     </select>
                   </div>
                 </div>
              </div>

              {/* Impact preview before submission (Shneiderman R4: Closure) */}
              {newLog.truckLoads > 0 && (
                <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 font-semibold flex items-center gap-2">
                  <Leaf className="w-4 h-4 shrink-0" />
                  This will log ~{newLog.truckLoads * 20}t of material moved. Dashboard will recalculate automatically.
                </div>
              )}

              <div className="flex justify-end gap-3 mt-6">
                 <button onClick={() => setIsLogModalOpen(false)} className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition">Cancel</button>
                 <button 
                    onClick={handleSaveLog} 
                    className={`px-5 py-2 bg-amber-500 shadow-md text-white font-bold rounded-lg text-sm transition transform active:translate-y-0 ${
                      newLog.truckLoads > 0 ? "hover:bg-amber-600 hover:shadow-lg hover:-translate-y-0.5" : "opacity-50 cursor-not-allowed"
                    }`}
                    disabled={newLog.truckLoads <= 0}
                 >
                    Save Log Entry
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* --- RESET CONFIRMATION DIALOG (Nielsen H3 / Shneiderman R6) --- */}
      {showResetConfirm && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          onClick={() => setShowResetConfirm(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-in fade-in zoom-in duration-200 border border-slate-200"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800">Reset all inputs?</h3>
                <p className="text-xs text-slate-500 mt-0.5">This clears project info, material mix, and compliance settings.</p>
              </div>
            </div>
            <p className="text-sm text-slate-600 mb-6">
              Activity logs will <strong>not</strong> be deleted. You can add them back anytime.
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowResetConfirm(false)} className="px-4 py-2 text-sm font-semibold text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition">
                Cancel
              </button>
              <button onClick={handleResetForm} className="px-4 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition shadow-sm">
                Reset Inputs
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Keyboard Shortcuts Help (Nielsen H10) */}
      <KeyboardShortcutsHelp open={showShortcutsHelp} onClose={() => setShowShortcutsHelp(false)} />

    </div>
  );
}
