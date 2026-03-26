import React, { useState, useEffect } from "react";
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
import { AlertCircle, Gauge, Leaf, LayoutDashboard, Truck, Settings, Sparkles, AlertTriangle, CheckCircle } from "lucide-react";
import { useCarbonMappingEngine } from "@/lib/useCarbonMappingEngine";
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
    inputs, 
    setInputs, 
    activeImpact,
    currentImpact,
    simulatedImpact,
    simulationActive,
    toggleSimulation
  } = useCarbonMappingEngine();

  // Pie Chart Data (Dynamic to Simulation)
  const breakdownData = [
    { name: "Material Impact", value: activeImpact.materialImpact },
    { name: "Machine Impact", value: activeImpact.machineImpact },
    { name: "Transport Impact", value: activeImpact.transportImpact },
  ];

  // Auto-generate plain-english insights
  const generateKeyInsight = () => {
    const total = activeImpact.materialImpact + activeImpact.machineImpact + activeImpact.transportImpact + activeImpact.processingImpact;
    if (activeImpact.transportImpact > total * 0.3 && inputs.transportDistanceKm > 30) {
      return "Transport is contributing the highest emissions, which is often ignored in real projects.";
    }
    if (inputs.disposalType === "Dumping") {
      return "Low recycling is increasing your overall emissions significantly.";
    }
    if (inputs.dieselLiters > 1000 || inputs.machineryUsage === "High") {
      return "High machinery usage is heavily adding to your carbon impact.";
    }
    if (activeImpact.isEstimated) {
      return "You are using estimated machinery fuel. A +10% penalty is automatically applied. Enter exact diesel logs for accuracy.";
    }
    return "Operations are currently balanced. Look for local recycling plants to optimize further.";
  };

  const keyInsightAlert = generateKeyInsight();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      {/* Top Application Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm sticky top-0 z-50">
        <TraceCarbonLogo />
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold text-slate-700 hidden sm:inline-block">
             Project Area: {inputs.areaSqft.toLocaleString()} sq ft
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
          
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <h2 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5 text-emerald-600"/> 1. Basic Project Info
            </h2>
            <div className="space-y-4">
               <div>
                 <label className="text-sm font-semibold text-slate-700 block mb-1">Area of structure (sq ft)</label>
                 <input 
                   type="number" 
                   value={inputs.areaSqft} 
                   onChange={(e) => setInputs({...inputs, areaSqft: Number(e.target.value)})}
                   className="w-full border border-slate-300 rounded-md p-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                 />
               </div>
               <div>
                 <label className="text-sm font-semibold text-slate-700 block mb-1">Type of demolition</label>
                 <select 
                   value={inputs.demolitionType} 
                   onChange={(e: any) => setInputs({...inputs, demolitionType: e.target.value})}
                   className="w-full border border-slate-300 rounded-md p-2.5 text-sm bg-white outline-none focus:border-emerald-500"
                 >
                   <option value="Mechanical">Mechanical</option>
                   <option value="Semi-mechanical">Semi-mechanical</option>
                   <option value="Manual">Manual</option>
                 </select>
               </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                <LayoutDashboard className="w-5 h-5 text-blue-600"/> 2. Material Mix
              </h2>
              <span className={`text-xs px-2 py-1 rounded font-bold border ${inputs.concretePercent + inputs.steelPercent + inputs.bricksPercent + inputs.othersPercent === 100 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
                {inputs.concretePercent + inputs.steelPercent + inputs.bricksPercent + inputs.othersPercent}%
              </span>
            </div>
            {/* Number Input Boxes */}
            <div className="space-y-4">
               <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-700 text-sm">Concrete</span>
                  <div className="relative w-24">
                    <input type="number" min="0" max="100" value={inputs.concretePercent} onChange={(e) => setInputs({...inputs, concretePercent: Number(e.target.value)})} className="w-full border border-slate-300 rounded-md p-2 pr-6 text-sm text-right focus:ring-2 focus:ring-blue-500 outline-none"/>
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">%</span>
                  </div>
               </div>
               <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-700 text-sm">Steel</span>
                  <div className="relative w-24">
                    <input type="number" min="0" max="100" value={inputs.steelPercent} onChange={(e) => setInputs({...inputs, steelPercent: Number(e.target.value)})} className="w-full border border-slate-300 rounded-md p-2 pr-6 text-sm text-right focus:ring-2 focus:ring-amber-500 outline-none"/>
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">%</span>
                  </div>
               </div>
               <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-700 text-sm">Bricks / Masonry</span>
                  <div className="relative w-24">
                    <input type="number" min="0" max="100" value={inputs.bricksPercent} onChange={(e) => setInputs({...inputs, bricksPercent: Number(e.target.value)})} className="w-full border border-slate-300 rounded-md p-2 pr-6 text-sm text-right focus:ring-2 focus:ring-red-500 outline-none"/>
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">%</span>
                  </div>
               </div>
               <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-700 text-sm">Aggregates / Others</span>
                  <div className="relative w-24">
                    <input type="number" min="0" max="100" value={inputs.othersPercent} onChange={(e) => setInputs({...inputs, othersPercent: Number(e.target.value)})} className="w-full border border-slate-300 rounded-md p-2 pr-6 text-sm text-right focus:ring-2 focus:ring-slate-500 outline-none"/>
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">%</span>
                  </div>
               </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <h2 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
              <Truck className="w-5 h-5 text-amber-600"/> 3. Handling & Activity
            </h2>
            <div className="space-y-4">
               <div>
                 <label className="text-sm font-semibold text-slate-700 block mb-1">Type of disposal</label>
                 <select 
                   value={inputs.disposalType} 
                   onChange={(e: any) => setInputs({...inputs, disposalType: e.target.value})}
                   className="w-full border border-slate-300 rounded-md p-2.5 text-sm bg-white"
                 >
                   <option value="Dumping">Dumping (Landfill)</option>
                   <option value="Mixed">Mixed Processing</option>
                   <option value="Recycling">Advanced Recycling</option>
                 </select>
               </div>
               <div>
                 <label className="text-sm font-semibold text-slate-700 block mb-1">Distance to disposal site (km)</label>
                 <input 
                   type="number" 
                   value={inputs.transportDistanceKm} 
                   onChange={(e) => setInputs({...inputs, transportDistanceKm: Number(e.target.value)})}
                   className="w-full border border-slate-300 rounded-md p-2.5 text-sm"
                 />
               </div>
               <hr className="border-slate-100 my-2" />
               <div>
                 <label className="text-sm font-semibold text-slate-700 block mb-1">Diesel used (litres) <span className="text-slate-400 font-normal">Optional</span></label>
                 <input 
                   type="number" 
                   placeholder="e.g. 500"
                   value={inputs.dieselLiters || ""}
                   onChange={(e) => setInputs({...inputs, dieselLiters: Number(e.target.value)})}
                   className="w-full border border-slate-300 rounded-md p-2.5 text-sm mb-2"
                 />
                 <label className="text-sm font-semibold text-slate-700 block mb-1">OR Machinery Usage (if diesel unknown)</label>
                 <select 
                   disabled={inputs.dieselLiters > 0}
                   value={inputs.machineryUsage} 
                   onChange={(e: any) => setInputs({...inputs, machineryUsage: e.target.value})}
                   className={`w-full border rounded-md p-2.5 text-sm bg-white ${inputs.dieselLiters > 0 ? 'border-slate-200 opacity-50' : 'border-slate-300'}`}
                 >
                   <option value="Low">Low machinery usage</option>
                   <option value="Medium">Medium machinery usage</option>
                   <option value="High">High machinery usage</option>
                 </select>
                 {inputs.dieselLiters === 0 && <p className="text-[10px] text-amber-600 mt-1.5">* Using estimates adds a 10% data-quality penalty to total emissions.</p>}
               </div>
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
                   value={inputs.rulesFollowed} 
                   onChange={(e: any) => setInputs({...inputs, rulesFollowed: e.target.value})}
                   className="w-full border border-slate-300 rounded-md p-2.5 text-sm bg-white"
                 >
                   <option value="Yes">Yes</option>
                   <option value="No">No</option>
                   <option value="Not sure">Not sure</option>
                 </select>
               </div>
               {inputs.rulesFollowed === "Yes" && (
                 <div>
                   <label className="text-sm font-semibold text-slate-700 block mb-1">Type of compliance</label>
                   <select 
                     value={inputs.complianceType} 
                     onChange={(e: any) => setInputs({...inputs, complianceType: e.target.value})}
                     className="w-full border border-slate-300 rounded-md p-2.5 text-sm bg-white"
                   >
                     <option value="BMC guidelines">BMC guidelines followed</option>
                     <option value="CPCB rules">CPCB rules followed</option>
                     <option value="Informal / none">Informal / none</option>
                   </select>
                 </div>
               )}
            </div>
          </div>

        </section>

        {/* --- RIGHT COLUMN: VISUAL OUTPUTS & INSIGHTS --- */}
        <section className="lg:col-span-8 space-y-6">
          
          {/* Top Metric Header */}
          <div className={`p-8 rounded-2xl shadow border flex flex-col md:flex-row items-center justify-between transition-colors duration-500 ${simulationActive ? "bg-emerald-700 border-emerald-800" : "bg-slate-900 border-slate-800"}`}>
             <div className="text-white mb-4 md:mb-0">
               <h3 className="text-emerald-300 font-bold uppercase tracking-widest text-xs mb-2">
                 Total Carbon Emissions
               </h3>
               <p className="text-5xl lg:text-7xl font-black tabular-nums tracking-tighter">
                 {Math.round(activeImpact.totalEmissions).toLocaleString()} <span className="text-2xl lg:text-4xl font-semibold opacity-70 tracking-normal">tons CO₂</span>
               </p>
               {simulationActive && (
                 <div className="mt-3 inline-block bg-white text-emerald-800 px-3 py-1 rounded-full text-sm font-bold animate-pulse shadow-lg">
                   Simulation Active: You saved {Math.round(currentImpact.totalEmissions - simulatedImpact.totalEmissions)} tons!
                 </div>
               )}
             </div>

             {/* Scenario Simulation Button */}
             <button
               onClick={toggleSimulation}
               className={`px-6 py-4 rounded-xl font-bold flex items-center gap-2 transition shadow-lg transform active:scale-95 ${
                 simulationActive 
                   ? "bg-white text-emerald-800 border-2 border-emerald-500" 
                   : "bg-emerald-500 text-white hover:bg-emerald-400 border-2 border-transparent"
               }`}
             >
               <Sparkles className="w-5 h-5" />
               {simulationActive ? "Revert to Baseline Target" : "What if I improve this?"}
             </button>
          </div>

          {/* Dynamic Alert Banner */}
          <div className={`p-4 rounded-lg flex items-start gap-3 border ${simulationActive ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200 text-red-900'}`}>
             <AlertTriangle className={`w-6 h-6 shrink-0 mt-0.5 ${simulationActive ? 'text-emerald-500' : 'text-red-500'}`}/>
             <div>
               <h4 className="font-bold text-sm mb-0.5">Key Operations Insight</h4>
               <p className="text-sm opacity-90">{simulationActive ? "Excellent. Local recycling facilities drastically slash transport impact and generate material savings." : keyInsightAlert}</p>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {/* Charts: Emission Breakdown */}
             <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center">
                <h3 className="font-bold text-slate-800 text-lg mb-2 self-start">Emission Breakdown</h3>
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
                     const percent = ((entry.value / Math.max(1, (breakdownData[0].value + breakdownData[1].value + breakdownData[2].value))) * 100).toFixed(0);
                     return (
                       <div key={idx} className="flex items-center gap-2 text-sm text-slate-600 font-medium bg-slate-50 p-2 rounded">
                         <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx] }}></span>
                         {percent}% {entry.name.replace(" Impact", "")}
                       </div>
                     )
                   })}
                </div>
             </div>

             {/* Auto-Insights (Static Cards) */}
             <div className="flex flex-col gap-4">
                <div className="bg-blue-50/50 p-4 border border-blue-100 rounded-xl hover:shadow-md transition">
                  <h4 className="font-bold text-blue-900 border-b border-blue-200 pb-2 mb-2 text-sm">Carbon Visibility</h4>
                  <p className="text-sm text-blue-800">Most emissions come from specific lifecycle stages that are usually not tracked. Visibility across the timeline prevents hidden leaks.</p>
                </div>
                
                <div className="bg-emerald-50/50 p-4 border border-emerald-100 rounded-xl hover:shadow-md transition">
                  <h4 className="font-bold text-emerald-900 border-b border-emerald-200 pb-2 mb-2 text-sm">Decision Support</h4>
                  <p className="text-sm text-emerald-800">Switching from mechanical excavation to manual sorting, or reducing massive transport distances, can significantly reduce emissions immediately.</p>
                </div>

                <div className="bg-amber-50/50 p-4 border border-amber-100 rounded-xl hover:shadow-md transition">
                  <h4 className="font-bold text-amber-900 border-b border-amber-200 pb-2 mb-2 text-sm">Circular Economy</h4>
                  <p className="text-sm text-amber-800">Increasing recycling can drastically lower total carbon impact because you are preventing the extraction of new virgin materials.</p>
                </div>
             </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-200">
             <p className="text-sm font-semibold text-slate-700 mb-1">
               "This tool uses a lifecycle-based carbon estimation approach aligned with international sustainability frameworks such as ISO lifecycle methods, GHG Protocol, and GRI emissions reporting."
             </p>
             <p className="text-xs text-slate-500 italic">
               "This tool provides estimated carbon values for awareness and decision-making, not for regulatory or audited reporting."
             </p>
          </div>

        </section>
      </main>
    </div>
  );
}
