import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { AlertCircle, Gauge, Leaf, LayoutDashboard, Truck, Settings, Sparkles, CheckCircle, PlusCircle, Calendar, Trash2, Info } from "lucide-react";
import { useCarbonMappingEngine, ActivityLog } from "@/lib/useCarbonMappingEngine";
import { TraceCarbonLogo } from "@/components/ui/TraceCarbonLogo";

// Beautiful simple colors
const COLORS = ["#0ea5e9", "#f59e0b", "#10b981", "#64748b"];

// Recharts Custom Tooltip (Plain Language)
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border rounded shadow-md text-sm">
        <p className="font-bold text-slate-800 mb-1">{label}</p>
        <p className="text-slate-600 font-medium">Impact: {payload[0].value.toFixed(1)} tons</p>
      </div>
    );
  }
  return null;
};

export default function DashboardPage() {
  const { user, signOut } = useAuth();
  
  // Use Simplified Contractor Engine
  const { 
    projectInputs, 
    setProjectInputs, 
    activityLogs,
    setActivityLogs,
    activeImpact,
    currentImpact,
    simulatedImpact,
    simulationActive,
    toggleSimulation
  } = useCarbonMappingEngine();

  // Modal State for New Activity Log
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [newLog, setNewLog] = useState<ActivityLog>({
    id: "",
    date: new Date().toISOString().split("T")[0],
    dieselLiters: 0,
    machineryUsage: "Medium",
    transportDistanceKm: 20,
    disposalType: "Mixed",
    truckLoads: 1,
  });

  // Pie Chart Data (Dynamic to Simulation)
  const breakdownData = [
    { name: "Material Impact", value: activeImpact.materialImpact },
    { name: "Machine Impact", value: activeImpact.machineImpact },
    { name: "Transport Impact", value: activeImpact.transportImpact },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      {/* Top Application Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm sticky top-0 z-50">
        <TraceCarbonLogo />
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold text-slate-700 hidden sm:inline-block">
             Project Area: {projectInputs.areaSqft.toLocaleString()} sq ft
          </span>
           <button
            onClick={signOut}
            className="text-xs font-bold text-slate-600 border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 px-4 py-2 rounded transition-colors"
          >
            Log Out
          </button>
        </div>
      </header>

      {/* Main Two-Column Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* --- LEFT COLUMN: INTUITIVE DATA INPUTS --- */}
        <section className="lg:col-span-4 space-y-6">
          
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 relative group">
            <h2 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5 text-emerald-600"/> 1. Basic Project Info
            </h2>
            <div className="space-y-4">
               <div>
                 <label className="text-sm font-semibold text-slate-700 block mb-1">Area of structure (sq ft)</label>
                 <input 
                   type="number" 
                   value={projectInputs.areaSqft || ""} 
                   placeholder="e.g. 50000"
                   onChange={(e) => setProjectInputs({...projectInputs, areaSqft: Number(e.target.value)})}
                   className="w-full border border-slate-300 rounded-md p-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                 />
               </div>
               <div>
                 <label className="text-sm font-semibold text-slate-700 block mb-1">Type of demolition</label>
                 <select 
                   value={projectInputs.demolitionType} 
                   onChange={(e: any) => setProjectInputs({...projectInputs, demolitionType: e.target.value})}
                   className="w-full border border-slate-300 rounded-md p-2.5 text-sm bg-white outline-none focus:border-emerald-500 mb-1"
                 >
                   <option value="Mechanical">Mechanical</option>
                   <option value="Semi-mechanical">Semi-mechanical</option>
                   <option value="Manual">Manual</option>
                 </select>
                 <p className="text-[10px] text-slate-500 flex items-start gap-1">
                   <Info className="w-3 h-3 shrink-0 mt-0.5" />
                   Scales the machinery fuel estimator. Manual demolition generates ~80% less machine fuel emissions than Mechanical.
                 </p>
               </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                <LayoutDashboard className="w-5 h-5 text-blue-600"/> 2. Material Mix
              </h2>
              <span className={`text-xs px-2 py-1 rounded font-bold border ${projectInputs.concretePercent + projectInputs.steelPercent + projectInputs.bricksPercent + projectInputs.othersPercent === 100 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
                {projectInputs.concretePercent + projectInputs.steelPercent + projectInputs.bricksPercent + projectInputs.othersPercent}%
              </span>
            </div>
            <div className="space-y-4">
               <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-700 text-sm">Concrete</span>
                  <div className="relative w-24">
                    <input type="number" min="0" max="100" value={projectInputs.concretePercent || ""} placeholder="60" onChange={(e) => setProjectInputs({...projectInputs, concretePercent: Number(e.target.value)})} className="w-full border border-slate-300 rounded-md p-2 pr-6 text-sm text-right focus:ring-2 focus:ring-blue-500 outline-none"/>
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">%</span>
                  </div>
               </div>
               <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-700 text-sm">Steel</span>
                  <div className="relative w-24">
                    <input type="number" min="0" max="100" value={projectInputs.steelPercent || ""} placeholder="15" onChange={(e) => setProjectInputs({...projectInputs, steelPercent: Number(e.target.value)})} className="w-full border border-slate-300 rounded-md p-2 pr-6 text-sm text-right focus:ring-2 focus:ring-amber-500 outline-none"/>
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">%</span>
                  </div>
               </div>
               <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-700 text-sm">Bricks / Masonry</span>
                  <div className="relative w-24">
                    <input type="number" min="0" max="100" value={projectInputs.bricksPercent || ""} placeholder="15" onChange={(e) => setProjectInputs({...projectInputs, bricksPercent: Number(e.target.value)})} className="w-full border border-slate-300 rounded-md p-2 pr-6 text-sm text-right focus:ring-2 focus:ring-red-500 outline-none"/>
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">%</span>
                  </div>
               </div>
               <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-700 text-sm">Aggregates / Others</span>
                  <div className="relative w-24">
                    <input type="number" min="0" max="100" value={projectInputs.othersPercent || ""} placeholder="10" onChange={(e) => setProjectInputs({...projectInputs, othersPercent: Number(e.target.value)})} className="w-full border border-slate-300 rounded-md p-2 pr-6 text-sm text-right focus:ring-2 focus:ring-slate-500 outline-none"/>
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">%</span>
                  </div>
               </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <div className="flex justify-between items-center mb-4">
               <h2 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                 <Truck className="w-5 h-5 text-amber-600"/> 3. Daily Activity Logs
               </h2>
               <button 
                 onClick={() => {
                   setNewLog({...newLog, id: Date.now().toString(), date: new Date().toISOString().split("T")[0]});
                   setIsLogModalOpen(true);
                 }}
                 className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-md transition border border-amber-200"
               >
                 <PlusCircle className="w-4 h-4"/> Add Log
               </button>
            </div>
            
            <div className="space-y-3">
               {activityLogs.length === 0 ? (
                 <p className="text-sm text-slate-500 italic text-center py-4 bg-slate-50 rounded-lg border border-dashed border-slate-300">No daily logs recorded yet. Add activities.</p>
               ) : (
                 <div className="max-h-[300px] overflow-y-auto pr-2 space-y-3">
                   {activityLogs.map((log) => (
                     <div key={log.id} className="border border-slate-200 bg-slate-50 rounded-lg p-3 flex flex-col gap-2 relative group hover:border-amber-300 transition-colors">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                             <Calendar className="w-4 h-4 text-slate-400"/>
                             <span className="text-sm font-bold text-slate-700">{log.date}</span>
                          </div>
                          <button 
                             onClick={() => setActivityLogs(activityLogs.filter(l => l.id !== log.id))}
                             className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition bg-white rounded-md p-1 border border-slate-200 shadow-sm"
                             title="Delete Log"
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

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <h2 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-indigo-500"/> 4. Compliance Check
            </h2>
            <div className="space-y-4">
               <div>
                 <label className="text-sm font-semibold text-slate-700 block mb-1">Were rules followed during demolition?</label>
                 <select 
                   value={projectInputs.rulesFollowed} 
                   onChange={(e: any) => setProjectInputs({...projectInputs, rulesFollowed: e.target.value})}
                   className="w-full border border-slate-300 rounded-md p-2.5 text-sm bg-white outline-none focus:border-indigo-500 mb-1"
                 >
                   <option value="Yes">Yes</option>
                   <option value="No">No</option>
                   <option value="Not sure">Not sure</option>
                 </select>
               </div>
               {projectInputs.rulesFollowed === "Yes" && (
                 <div>
                   <label className="text-sm font-semibold text-slate-700 block mb-1">Type of compliance</label>
                   <select 
                     value={projectInputs.complianceType} 
                     onChange={(e: any) => setProjectInputs({...projectInputs, complianceType: e.target.value})}
                     className="w-full border border-slate-300 rounded-md p-2.5 text-sm bg-white outline-none focus:border-indigo-500 mb-1"
                   >
                     <option value="BMC guidelines">BMC guidelines followed</option>
                     <option value="CPCB rules">CPCB rules followed</option>
                     <option value="Informal / none">Informal / none</option>
                   </select>
                 </div>
               )}
               <p className="text-[10px] text-slate-500 flex items-start gap-1">
                 <Info className="w-3 h-3 shrink-0 mt-0.5" />
                 Ignored rules or informal demolition applies a 5% data quality penalty to your total emissions count due to fugitive leaks.
               </p>
            </div>
          </div>

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
                   <span className="inline-block bg-white text-emerald-800 px-3 py-1 rounded-full text-sm font-bold animate-pulse shadow-lg">
                     Simulation Active: You saved {Math.round(currentImpact.totalEmissions - simulatedImpact.totalEmissions).toLocaleString()} tons!
                   </span>
                 )}
                 {activeImpact.compliancePenalty > 0 && !simulationActive && (
                   <span className="inline-block bg-red-500/20 text-red-200 border border-red-500/30 px-3 py-1 rounded text-xs font-semibold">
                     Includes {Math.round(activeImpact.compliancePenalty)}t non-compliance penalty
                   </span>
                 )}
               </div>
             </div>

             {/* Scenario Simulation Button */}
             <button
               onClick={toggleSimulation}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {/* Charts: Emission Breakdown */}
             <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center">
                <h3 className="font-bold text-slate-800 text-lg mb-2 self-start flex gap-2 items-center">
                  Emission Breakdown
                </h3>
                {activityLogs.length === 0 ? (
                  <div className="w-full h-[250px] flex items-center justify-center">
                    <p className="text-sm font-medium text-slate-400 text-center px-8 border border-dashed border-slate-200 p-4 rounded-xl">Add activity logs to see forecasted breakdown.</p>
                  </div>
                ) : (
                  <>
                    <div className="w-full h-[250px]">
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
                    <div className="grid grid-cols-2 w-full gap-2 mt-2">
                       {breakdownData.map((entry, idx) => {
                         const totalSum = breakdownData[0].value + breakdownData[1].value + breakdownData[2].value;
                         const percent = totalSum > 0 ? ((entry.value / totalSum) * 100).toFixed(0) : "0";
                         return (
                           <div key={idx} className="flex items-center gap-2 text-sm text-slate-600 font-medium bg-slate-50 p-2 rounded border border-slate-100">
                             <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: COLORS[idx] }}></span>
                             <span className="truncate">{percent}% {entry.name.replace(" Impact", "")}</span>
                           </div>
                         )
                       })}
                    </div>
                  </>
                )}
             </div>

             {/* Auto-Insights (Static Cards) */}
             <div className="flex flex-col gap-4">
                <div className="bg-blue-50/50 p-4 border border-blue-100 rounded-xl hover:shadow-md transition">
                  <h4 className="font-bold text-blue-900 border-b border-blue-200 pb-2 mb-2 text-sm">Timeline Forecasting</h4>
                  <p className="text-sm text-blue-800">Your total score actively scales up based on the efficiency of your logs. Small daily emissions from transport compound enormously over large projects.</p>
                </div>
                
                <div className="bg-emerald-50/50 p-4 border border-emerald-100 rounded-xl hover:shadow-md transition">
                  <h4 className="font-bold text-emerald-900 border-b border-emerald-200 pb-2 mb-2 text-sm">Decision Support</h4>
                  <p className="text-sm text-emerald-800">Switching from mechanical excavation to manual sorting, or reducing massive transport distances, significantly reduces forecasted emissions immediately.</p>
                </div>

                <div className="bg-amber-50/50 p-4 border border-amber-100 rounded-xl hover:shadow-md transition">
                  <h4 className="font-bold text-amber-900 border-b border-amber-200 pb-2 mb-2 text-sm">Circular Economy</h4>
                  <p className="text-sm text-amber-800">The <strong>Disposal Facility Type</strong> directly subtracts carbon from your score by recognizing avoided virgin material extraction when selecting Recycling.</p>
                </div>
             </div>
          </div>

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

      {/* --- ADD LOG MODAL --- */}
      {isLogModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
           <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200 border border-slate-200">
              <h2 className="text-xl font-black text-slate-800 mb-5 items-center flex gap-2">
                 <Truck className="w-5 h-5 text-amber-500"/> Record Daily Activity
              </h2>
              <div className="space-y-4">
                 <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="text-sm font-bold text-slate-700 block mb-1">Date</label>
                     <input type="date" value={newLog.date} onChange={e => setNewLog({...newLog, date: e.target.value})} className="w-full border border-slate-300 bg-slate-50 rounded-md p-2 text-sm outline-none focus:border-amber-500 focus:bg-white transition-colors"/>
                   </div>
                   <div>
                     <label className="text-sm font-bold text-slate-700 block mb-1">Truck Loads (Output)</label>
                     <div className="relative">
                       <input type="number" min="1" value={newLog.truckLoads} onChange={e => setNewLog({...newLog, truckLoads: Number(e.target.value)})} className="w-full border border-slate-300 bg-slate-50 rounded-md p-2 pr-12 text-sm outline-none focus:border-amber-500 focus:bg-white transition-colors"/>
                       <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">loads</span>
                     </div>
                   </div>
                 </div>

                 <div className="bg-amber-50/50 p-4 border border-amber-100 rounded-lg space-y-3">
                   <h3 className="font-bold text-amber-800 text-sm border-b border-amber-200 pb-1 -mx-2 px-2 flex justify-between items-center">
                     Logistics
                   </h3>
                   <div>
                     <label className="text-xs font-bold text-slate-600 block mb-1">Disposal Facility Type</label>
                     <select value={newLog.disposalType} onChange={(e: any) => setNewLog({...newLog, disposalType: e.target.value})} className="w-full border border-slate-300 rounded-md p-2 text-sm bg-white outline-none focus:border-amber-500 mb-1">
                       <option value="Dumping">Dumping (Landfill)</option>
                       <option value="Mixed">Mixed Processing</option>
                       <option value="Recycling">Advanced Recycling</option>
                     </select>
                     <p className="text-[10px] text-amber-700 leading-tight">Selecting Recycling applies heavy negative carbon benefits to offset emissions.</p>
                   </div>
                   <div>
                     <label className="text-xs font-bold text-slate-600 block mb-1">Distance to Facility</label>
                     <div className="relative">
                       <input type="number" min="0" value={newLog.transportDistanceKm} onChange={e => setNewLog({...newLog, transportDistanceKm: Number(e.target.value)})} className="w-full border border-slate-300 rounded-md p-2 pr-10 text-sm outline-none focus:border-amber-500"/>
                       <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">km</span>
                     </div>
                   </div>
                 </div>

                 <div className="bg-slate-50 p-4 border border-slate-200 rounded-lg space-y-3">
                   <h3 className="font-bold text-slate-700 text-sm border-b border-slate-200 pb-1 -mx-2 px-2">Machinery Fuel</h3>
                   <div>
                     <label className="text-xs font-bold text-slate-600 block mb-1 flex justify-between">Exact Diesel Used <span>(Optional)</span></label>
                     <div className="relative">
                       <input type="number" placeholder="e.g. 50" min="0" value={newLog.dieselLiters || ""} onChange={e => setNewLog({...newLog, dieselLiters: Number(e.target.value)})} className="w-full border border-slate-300 rounded-md p-2 pr-10 text-sm outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 bg-white"/>
                       <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">litres</span>
                     </div>
                   </div>
                   
                   <div>
                     <label className="text-xs font-bold text-slate-600 block mb-1 flex justify-between">OR Estimate Usage <span title="10% penalty applied">(Penalty applies)</span></label>
                     <select disabled={newLog.dieselLiters > 0} value={newLog.machineryUsage} onChange={(e: any) => setNewLog({...newLog, machineryUsage: e.target.value})} className={`w-full border font-medium rounded-md p-2 text-sm outline-none focus:border-amber-500 ${newLog.dieselLiters > 0 ? 'bg-slate-100 border-slate-200 text-slate-400' : 'bg-white border-slate-300 shadow-inner'}`}>
                       <option value="Low">Low / Light work</option>
                       <option value="Medium">Medium usage</option>
                       <option value="High">Heavy / Constant usage</option>
                     </select>
                   </div>
                 </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                 <button onClick={() => setIsLogModalOpen(false)} className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-md transition">Cancel</button>
                 <button onClick={() => { setActivityLogs([...activityLogs, newLog]); setIsLogModalOpen(false); }} className="px-5 py-2 bg-amber-500 hover:bg-amber-600 shadow-md hover:shadow-lg text-white font-bold rounded-md text-sm transition transform hover:-translate-y-0.5 active:translate-y-0">Save Log Entry</button>
              </div>
           </div>
        </div>
      )}

    </div>
  );
}
