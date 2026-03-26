import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ReferenceLine
} from "recharts";
import { CheckCircle, AlertTriangle, Leaf, Database, Truck, Building, Globe, Zap, Settings2, Activity } from "lucide-react";
import { useCarbonMappingEngine, DataQuality } from "@/lib/useCarbonMappingEngine";

// Recharts Custom Tooltip (Formats large decimals safely)
const CustomBarTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border rounded shadow-lg text-sm min-w-[150px] z-50 relative">
        <p className="font-bold mb-2 text-slate-800 border-b pb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={`item-${index}`} style={{ color: entry.color }} className="font-medium flex justify-between gap-4 py-0.5">
            <span>{entry.name}:</span>
            <span>{entry.value.toFixed(1)} tCO₂</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Colors for ISO/Scope Charts
const SCOPE_COLORS = ["#047857", "#3B82F6"]; // Scope 1 (Green), Scope 3 (Blue)

export default function DashboardPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  // Use isolated mathematical Engine
  const { 
    projectInputs, 
    setProjectInputs, 
    baselineScenario, 
    setBaselineScenario, 
    alternativeScenario, 
    setAlternativeScenario, 
    results 
  } = useCarbonMappingEngine();

  // Mapped Data for ISO 14044 Boundaries Bar Chart (Baseline vs Alternative)
  const boundaryData = [
    { name: "C1: Demolition", Baseline: results.baseline.boundaries.c1_demolition, Alternative: results.alternative.boundaries.c1_demolition },
    { name: "C2: Transport", Baseline: results.baseline.boundaries.c2_transport, Alternative: results.alternative.boundaries.c2_transport },
    { name: "C3: Processing", Baseline: results.baseline.boundaries.c3_processing, Alternative: results.alternative.boundaries.c3_processing },
    { name: "C4: Disposal", Baseline: results.baseline.boundaries.c4_disposal, Alternative: results.alternative.boundaries.c4_disposal },
    { name: "Mod D: Recovery", Baseline: results.baseline.boundaries.d_recovery, Alternative: results.alternative.boundaries.d_recovery },
  ];

  // Mapped Data for GHG Protocol Scopes Donut Chart (Alternative Scenario)
  const scopeData = [
    { name: "Scope 1 (Direct Fuel)", value: results.alternative.scopes.scope1 },
    { name: "Scope 3 (Value Chain)", value: results.alternative.scopes.scope3 },
  ];

  // Helper component to render an Enterprise Input row cleanly
  const InputRow = ({ 
    label, 
    value, 
    onChange, 
    quality, 
    onQualityChange,
    type = "number",
    suffix = ""
  }: any) => (
    <div className="flex flex-col gap-1.5 mb-4 group">
       <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{label}</label>
       <div className="flex shadow-sm rounded-md overflow-hidden border border-slate-300 transition-colors focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500">
         <div className="flex-1 relative">
            <input 
              type={type}
              value={value}
              onChange={onChange}
              className="w-full px-3 py-2 text-sm text-slate-800 bg-white border-0 focus:ring-0 outline-none h-full"
            />
            {suffix && (
               <span className="absolute right-3 top-[10px] text-xs font-semibold text-slate-400 pointer-events-none bg-white pl-2">
                 {suffix}
               </span>
            )}
         </div>
         {onQualityChange && (
           <select 
             value={quality}
             onChange={onQualityChange}
             className="w-28 bg-slate-50 border-0 border-l border-slate-300 text-xs text-slate-600 font-medium focus:ring-0 outline-none px-2 appearance-none cursor-pointer hover:bg-slate-100"
             style={{ backgroundImage: 'url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3E%3Cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3E%3C/svg%3E")', backgroundPosition: 'right 0.25rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.2em 1.2em' }}
           >
             <option value="Measured">Measured</option>
             <option value="Estimated">Estimated</option>
             <option value="Default">Default</option>
           </select>
         )}
       </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-slate-900 font-sans flex flex-col">
      {/* Top Enterprise Edge Navigation */}
      <header className="bg-slate-900 px-6 py-3.5 flex justify-between items-center sticky top-0 z-50 shadow-md border-b border-emerald-900/50">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-500 text-slate-900 w-8 h-8 rounded shrink-0 flex items-center justify-center font-bold text-lg">
            V
          </div>
          <div>
            <h1 className="text-white font-semibold tracking-tight leading-tight">Veridian Enterprise</h1>
            <p className="text-[10px] text-emerald-400 font-medium uppercase tracking-widest leading-none mt-0.5">LCA Carbon Footprint Mapping</p>
          </div>
        </div>
        <div className="flex items-center gap-5">
          <div className="hidden md:flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-slate-300 font-medium">Session Active • {user?.company}</span>
          </div>
          <button
            onClick={signOut}
            className="text-xs text-slate-300 font-bold bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded transition"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Grid Workspace */}
      <main className="flex-1 max-w-[1800px] w-full mx-auto p-4 md:p-6 grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* --- LEFT COLUMN: DATA ENTRY / INPUT MODULE --- */}
        <section className="xl:col-span-3 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col min-h-[500px] xl:h-[calc(100vh-[88px])] sticky top-20">
          <div className="bg-slate-50 px-5 py-4 border-b border-slate-200 flex justify-between items-center">
            <h2 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
              <Settings2 className="w-4 h-4 text-emerald-600"/> Simulation Parameters
            </h2>
            <div className={`px-2 py-0.5 rounded text-[10px] font-bold ${results.alternative.dataQualityScore > 75 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
              Data DQ: {Math.round(results.alternative.dataQualityScore)}%
            </div>
          </div>

          <div className="p-5 overflow-y-auto flex-1 custom-scrollbar">
            
            <h3 className="text-[12px] font-extrabold text-slate-900 mb-4 border-b border-slate-100 pb-2">PROJECT DEFINITION</h3>
            <InputRow 
              label="Built-Up Area" 
              suffix="m²"
              value={projectInputs.builtUpArea.value} 
              onChange={(e: any) => setProjectInputs({...projectInputs, builtUpArea: {...projectInputs.builtUpArea, value: Number(e.target.value)}})}
              quality={projectInputs.builtUpArea.quality}
              onQualityChange={(e: any) => setProjectInputs({...projectInputs, builtUpArea: {...projectInputs.builtUpArea, quality: e.target.value as DataQuality}})}
            />
            <InputRow 
              label="Total Floors" 
              value={projectInputs.floors.value} 
              onChange={(e: any) => setProjectInputs({...projectInputs, floors: {...projectInputs.floors, value: Number(e.target.value)}})}
              quality={projectInputs.floors.quality}
              onQualityChange={(e: any) => setProjectInputs({...projectInputs, floors: {...projectInputs.floors, quality: e.target.value as DataQuality}})}
            />
            <InputRow 
              label="Material Density" 
              suffix="kg/m²"
              value={projectInputs.materialDensity.value} 
              onChange={(e: any) => setProjectInputs({...projectInputs, materialDensity: {...projectInputs.materialDensity, value: Number(e.target.value)}})}
              quality={projectInputs.materialDensity.quality}
              onQualityChange={(e: any) => setProjectInputs({...projectInputs, materialDensity: {...projectInputs.materialDensity, quality: e.target.value as DataQuality}})}
            />

            <h3 className="text-[12px] font-extrabold text-slate-900 mt-8 mb-4 border-b border-slate-100 pb-2">BASELINE (CURRENT STATE)</h3>
            <div className="flex flex-col gap-1.5 mb-4 group">
               <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Demolition Approach</label>
               <select 
                 value={baselineScenario.demolitionType}
                 onChange={(e: any) => setBaselineScenario({...baselineScenario, demolitionType: e.target.value})}
                 className="w-full px-3 py-2 text-sm text-slate-800 bg-white border border-slate-300 rounded-md focus:ring-1 focus:ring-emerald-500 outline-none"
               >
                 <option value="Mechanical">Mechanical (Heavy)</option>
                 <option value="Semi-mechanical">Semi-mechanical</option>
                 <option value="Manual">Manual (Light)</option>
               </select>
            </div>
            <InputRow 
              label="Transport Distance to Landfill" 
              suffix="km"
              value={baselineScenario.transportDistance.value} 
              onChange={(e: any) => setBaselineScenario({...baselineScenario, transportDistance: {...baselineScenario.transportDistance, value: Number(e.target.value)}})}
              quality={baselineScenario.transportDistance.quality}
              onQualityChange={(e: any) => setBaselineScenario({...baselineScenario, transportDistance: {...baselineScenario.transportDistance, quality: e.target.value as DataQuality}})}
            />

            <h3 className="text-[12px] font-extrabold text-slate-900 mt-8 mb-4 border-b border-slate-100 pb-2 flex items-center gap-1">
               <Activity className="w-3.5 h-3.5 text-emerald-600"/> ALTERNATIVE SCENARIO TARGETS
            </h3>
            <InputRow 
              label="Target Recycling Rate" 
              suffix="%"
              value={alternativeScenario.recyclingRate.value} 
              onChange={(e: any) => setAlternativeScenario({...alternativeScenario, recyclingRate: {...alternativeScenario.recyclingRate, value: Number(e.target.value)}})}
              quality={alternativeScenario.recyclingRate.quality}
              onQualityChange={(e: any) => setAlternativeScenario({...alternativeScenario, recyclingRate: {...alternativeScenario.recyclingRate, quality: e.target.value as DataQuality}})}
            />
            <div className="flex flex-col gap-1.5 mb-4 group">
               <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Recovery Processing Facility</label>
               <select 
                 value={alternativeScenario.processingType}
                 onChange={(e: any) => setAlternativeScenario({...alternativeScenario, processingType: e.target.value})}
                 className="w-full px-3 py-2 text-sm text-slate-800 border border-slate-300 rounded-md focus:border-emerald-500 outline-none"
               >
                 <option value="Recycling">Advanced Recycling Plant</option>
                 <option value="Mixed">Mixed Processing Facility (MRF)</option>
               </select>
            </div>
            <InputRow 
              label="Transport Dist (To MRF)" 
              suffix="km"
              value={alternativeScenario.transportDistance.value} 
              onChange={(e: any) => setAlternativeScenario({...alternativeScenario, transportDistance: {...alternativeScenario.transportDistance, value: Number(e.target.value)}})}
              quality={alternativeScenario.transportDistance.quality}
              onQualityChange={(e: any) => setAlternativeScenario({...alternativeScenario, transportDistance: {...alternativeScenario.transportDistance, quality: e.target.value as DataQuality}})}
            />
          </div>
        </section>

        {/* --- CENTER & RIGHT COLUMNS: LCA OUTPUT MODULE --- */}
        <section className="xl:col-span-9 flex flex-col gap-6">
          
          {/* KPI Dashboard Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 hover:shadow-md transition-shadow rounded-xl border border-slate-200">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Baseline Standard</p>
              <p className="text-3xl font-black text-slate-800 tabular-nums">
                {results.baseline.netTotal.toLocaleString(undefined, {maximumFractionDigits: 0})} <span className="text-[14px] font-semibold text-slate-400">tCO₂e</span>
              </p>
            </div>

            <div className="bg-white p-5 hover:shadow-md transition-shadow rounded-xl border border-slate-200 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-2 h-full bg-emerald-500"></div>
              <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1">Proposed Optimization</p>
              <p className="text-3xl font-black text-slate-800 tabular-nums">
                {results.alternative.netTotal.toLocaleString(undefined, {maximumFractionDigits: 0})} <span className="text-[14px] font-semibold text-slate-400">tCO₂e</span>
              </p>
            </div>

            <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 text-white relative shadow-lg">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Net LCA Savings</p>
              <p className="text-3xl font-black text-emerald-400 tabular-nums">
                ↓ {results.netSavings.toLocaleString(undefined, {maximumFractionDigits: 0})}
              </p>
              <div className="mt-3 text-[11px] font-bold tracking-wider bg-white/10 text-white inline-flex px-2 py-1 rounded">
                - {results.savingsPercent.toFixed(1)}% EMISSIONS
              </div>
            </div>

            <div className={`p-5 rounded-xl border ${results.alternative.dataQualityScore >= 80 ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'}`}>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 flex justify-between">
                Data Quality Index
                <Database className="w-4 h-4 text-slate-400"/>
              </p>
              <p className={`text-3xl font-black tabular-nums ${results.alternative.dataQualityScore >= 80 ? 'text-emerald-700' : 'text-amber-600'}`}>
                {Math.round(results.alternative.dataQualityScore)}%
              </p>
              <p className="mt-3 text-[11px] text-slate-600 font-medium leading-tight">
                Confidence based on measured variables vs default standards.
              </p>
            </div>
          </div>

          {/* MAIN CHARTS ROW */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* C1-D Boundaries Bar Chart */}
            <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
              <div className="flex justify-between items-center mb-6">
                 <div>
                   <h3 className="font-bold text-slate-800 text-lg leading-tight">Lifecycle Stages (C1-D Boundaries)</h3>
                   <p className="text-xs text-slate-500 mt-1">ISO 14040 Comparative Mapping</p>
                 </div>
                 <div className="flex gap-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <span className="flex items-center gap-1"><span className="w-3 h-3 bg-slate-300 rounded-sm"></span> Baseline</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-3 bg-emerald-600 rounded-sm"></span> Alternative</span>
                 </div>
              </div>

              <div className="flex-1 min-h-[300px] w-full mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={boundaryData} margin={{ top: 10, right: 30, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0"/>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 11, fontWeight: 600}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11}} tickFormatter={(val) => `${val}t`} />
                    <RechartsTooltip content={<CustomBarTooltip />} cursor={{fill: '#f1f5f9'}} />
                    <ReferenceLine y={0} stroke="#94a3b8" strokeWidth={2}/>
                    <Bar dataKey="Baseline" fill="#cbd5e1" radius={[2, 2, 0, 0]} barSize={32} />
                    <Bar dataKey="Alternative" fill="#059669" radius={[2, 2, 0, 0]} barSize={32} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* GHG Protocol Scope Donut */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
               <h3 className="font-bold text-slate-800 text-lg leading-tight">GHG Protocol Allocation</h3>
               <p className="text-xs text-slate-500 mb-6 mt-1">Alternative Scope 1 vs Scope 3 Breakdown.</p>
               
               <div className="flex-1 w-full relative min-h-[220px]">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={scopeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={100}
                        paddingAngle={3}
                        dataKey="value"
                        stroke="none"
                      >
                        {scopeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={SCOPE_COLORS[index % SCOPE_COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip content={<CustomBarTooltip />} />
                    </PieChart>
                 </ResponsiveContainer>
                 <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Alt Gross</span>
                    <span className="text-3xl font-black text-slate-800 tabular-nums -mt-1 leading-none">
                      {Math.round(scopeData[0].value + scopeData[1].value)}
                    </span>
                 </div>
               </div>
               
               <div className="grid grid-cols-1 gap-y-3 mt-4 pt-4 border-t border-slate-100">
                 {scopeData.map((entry, index) => (
                   <div key={entry.name} className="flex justify-between items-center text-sm font-medium text-slate-700">
                     <span className="flex items-center gap-2">
                       <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: SCOPE_COLORS[index % SCOPE_COLORS.length] }}></span>
                       {entry.name}
                     </span>
                     <span className="font-bold tabular-nums">{Math.round(entry.value)}t</span>
                   </div>
                 ))}
               </div>
            </div>
          </div>

          {/* LOWER ROW: Strict Compliance & Standards */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-6">
              
              <div className="flex items-center gap-6">
                <div className="bg-slate-100 p-4 rounded-full border border-slate-200 shrink-0">
                  <Globe className="w-8 h-8 text-slate-700"/>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800 mb-1 leading-tight">Enterprise Compliance & Frameworks</p>
                  <p className="text-xs font-medium text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-md inline-block border border-emerald-100">
                    “This tool is aligned with ISO 14040/14044, GHG Protocol, and GRI 305 for lifecycle-based carbon estimation.”
                  </p>
                </div>
              </div>

              <div className="lg:text-right flex-1 border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-6 max-w-xl">
                 <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1">Professional Disclaimer</p>
                 <p className="text-[#64748b] text-[11px] leading-relaxed">
                   This simulator translates modeled inputs against national (CPCB, BIS, GRIHA) and global frameworks (ISO 14040/44, GHG Protocol) to estimate carbon footprint. Outputs incorporate Data Quality (DQ) estimation margins ({Math.round(results.alternative.dataQualityScore)}% strict confidence). Intended for decision-support and scenario analysis prior to verified regulatory reporting.
                 </p>
              </div>

          </div>

        </section>
      </main>
    </div>
  );
}
