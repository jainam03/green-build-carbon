import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  BarChart3,
  Recycle,
  AlertCircle,
  Lightbulb,
  ArrowLeft,
  Settings,
  Download,
  Activity,
  ChevronDown,
} from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.4, ease: "easeOut" },
  }),
};

// Recharts colors
const COLORS = {
  materials: "#065f46", // emerald-deep
  machinery: "#059669", // emerald-600
  transport: "#34d399", // emerald-400
};

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Model States
  const [area, setArea] = useState(25000); // Larger default for enterprise feel
  const [type, setType] = useState("RCC");
  const [distance, setDistance] = useState(45);
  const [recycling, setRecycling] = useState(15);
  const [fuel, setFuel] = useState(200);

  // Dynamic Calculation Logic
  const stats = useMemo(() => {
    // Basic coefficients mapping logic
    const wasteKg = area * 0.0929 * 150; // Approximation of waste generated per sqft
    const baseCarbon = (wasteKg * 0.15) / 1000;
    const fuelCarbon = (fuel * 2.68) / 1000;
    const transportCarbon = distance * wasteKg * 0.0001;
    const savings = baseCarbon * (recycling / 100);
    const total = Math.max(0, baseCarbon + fuelCarbon + transportCarbon - savings);

    return {
      total: total,
      breakdown: [
        { name: "Materials", value: baseCarbon, fill: COLORS.materials },
        { name: "Machinery", value: fuelCarbon, fill: COLORS.machinery },
        { name: "Transport", value: transportCarbon, fill: COLORS.transport },
      ],
      savings: savings,
    };
  }, [area, type, distance, recycling, fuel]);

  // Generate mock historical data that shifts dynamically based on current simulation
  const trendData = useMemo(() => {
    const baseLine = stats.total * 1.2; 
    return [
      { month: "Jan", emissions: baseLine * 1.15, baseline: baseLine * 1.2 },
      { month: "Feb", emissions: baseLine * 1.1, baseline: baseLine * 1.2 },
      { month: "Mar", emissions: baseLine * 0.95, baseline: baseLine * 1.15 },
      { month: "Apr", emissions: baseLine * 0.9, baseline: baseLine * 1.1 },
      { month: "May", emissions: baseLine * 0.85, baseline: baseLine * 1.1 },
      { month: "Jun", emissions: stats.total, baseline: baseLine * 1.05 }, // The live simulated point
    ];
  }, [stats.total]);

  // --- Helpers ---
  const formatNumber = (num: number) =>
    num.toLocaleString("en-US", { maximumFractionDigits: 1 });

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      
      {/* ─── ENTERPRISE NAV ─── */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex justify-between items-center px-6 md:px-8 py-4 max-w-[1600px] mx-auto">
          <div className="flex items-center gap-6 md:gap-10">
            <button
              onClick={() => navigate("/profile")}
              className="w-8 h-8 bg-foreground rounded-[6px] flex items-center justify-center text-background text-sm font-extrabold shadow-sm hover:opacity-90 transition-opacity"
            >
              V
            </button>
            
            <div className="hidden md:flex items-center gap-2 text-sm font-semibold opacity-80 cursor-pointer hover:opacity-100 transition-opacity p-2 rounded-md hover:bg-secondary">
               <span>Project Alpha: Mixed-Use Dev</span>
               <ChevronDown size={14} />
            </div>
          </div>

          <div className="flex items-center gap-4">
             <button
               onClick={() => navigate("/profile")}
               className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-md hover:bg-secondary"
             >
               <ArrowLeft size={16} /> Exit Dashboard
             </button>
          </div>
        </div>
      </header>

      {/* ─── DASHBOARD WORKSPACE ─── */}
      <main className="flex-1 max-w-[1600px] mx-auto w-full p-4 md:p-8 flex flex-col gap-6 md:gap-8">
        
        {/* Header Title */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0} className="flex flex-col md:flex-row md:items-end justify-between gap-4 mt-2">
           <div>
              <p className="text-sm font-semibold text-accent tracking-widest uppercase mb-1 flex items-center gap-1.5">
                <Activity size={14} /> Live Analysis Mode
              </p>
              <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
                Carbon Operations Console
              </h1>
           </div>
           <div className="flex gap-3">
              <button className="inline-flex items-center gap-2 px-4 py-2 border border-border bg-card rounded-[6px] text-sm font-medium hover:bg-secondary transition-colors shadow-sm text-foreground">
                 <Settings size={16} /> Configure
              </button>
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-[6px] text-sm font-medium hover:bg-foreground/90 transition-colors shadow-sm">
                 <Download size={16} /> Export Report
              </button>
           </div>
        </motion.div>

        {/* ─── KPI ROW ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            title="Gross Emissions"
            value={`${formatNumber(stats.total)}`}
            unit="tCO₂e"
            trend="-12.5%"
            positive={true}
            index={1}
            highlight={true}
          />
          <KpiCard
            title="Diverted via Recycling"
            value={`${formatNumber(stats.savings)}`}
            unit="tCO₂e"
            trend="+8.2%"
            positive={true}
            index={2}
          />
          <KpiCard
            title="Active Scope 3 (Logistics)"
            value={`${formatNumber(stats.breakdown[2].value)}`}
            unit="tCO₂e"
            trend="Stable"
            positive={null}
            index={3}
          />
          <KpiCard
            title="Target Variance"
            value="-4.1"
            unit="tCO₂e"
            trend="Ahead of schedule"
            positive={true}
            index={4}
          />
        </div>

        {/* ─── MAIN GRID ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 lg:items-start lg:min-h-[600px]">
          
          {/* Left Column: Visualizations (Charts) spanning 8 cols */}
          <div className="lg:col-span-8 flex flex-col gap-6 md:gap-8 w-full h-full min-w-0">
             
             {/* Trend Chart */}
             <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={5} className="bg-card border border-border/60 rounded-[12px] p-6 shadow-sm w-full relative">
                <h3 className="text-base font-semibold mb-6 flex items-center justify-between">
                   <span>Emissions Trajectory (Jan - Jun)</span>
                   <span className="text-xs font-medium px-2 py-1 bg-secondary rounded text-muted-foreground border border-border">Based on live inputs</span>
                </h3>
                
                <div className="h-[280px] w-full mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorEmissions" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                      <RechartsTooltip 
                        contentStyle={{ backgroundColor: "hsl(var(--card))", borderRadius: "8px", border: "1px solid hsl(var(--border))", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
                        itemStyle={{ color: "hsl(var(--foreground))", fontSize: "14px", fontWeight: 500 }}
                      />
                      <Area type="monotone" dataKey="emissions" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorEmissions)" />
                      <Area type="monotone" dataKey="baseline" stroke="hsl(var(--muted-foreground))" strokeDasharray="4 4" fill="none" opacity={0.5} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
             </motion.div>

             {/* Distribution Row */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 h-full">
                
                {/* Composition Donut */}
                <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={6} className="bg-card border border-border/60 rounded-[12px] p-6 shadow-sm flex flex-col w-full h-full min-h-[320px]">
                   <h3 className="text-base font-semibold mb-2">Scope Scope Composition</h3>
                   <div className="flex-1 min-h-0 h-full w-full relative -left-4">
                     <ResponsiveContainer width="100%" height="100%">
                       <PieChart>
                         <Pie
                           data={stats.breakdown}
                           cx="50%"
                           cy="50%"
                           innerRadius={70}
                           outerRadius={90}
                           paddingAngle={4}
                           dataKey="value"
                           stroke="none"
                         >
                           {stats.breakdown.map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={entry.fill} />
                           ))}
                         </Pie>
                         <RechartsTooltip 
                           formatter={(val: number) => [`${formatNumber(val)} tCO₂e`, 'Emissions']}
                           contentStyle={{ backgroundColor: "hsl(var(--card))", borderRadius: "8px", border: "1px solid hsl(var(--border))", padding: "8px 12px" }}
                           itemStyle={{ color: "hsl(var(--foreground))", fontSize: "13px", fontWeight: 600 }}
                         />
                       </PieChart>
                     </ResponsiveContainer>
                   </div>
                   
                   <div className="mt-4 pt-4 border-t border-border/50 grid grid-cols-3 gap-2">
                      {stats.breakdown.map((item, i) => (
                         <div key={i} className="text-center">
                            <div className="flex items-center justify-center gap-1.5 mb-1 text-xs text-muted-foreground">
                              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.fill }} />
                              {item.name}
                            </div>
                            <p className="text-sm font-semibold tabular-nums">{formatNumber(item.value)}</p>
                         </div>
                      ))}
                   </div>
                </motion.div>

                {/* AI Insights Panel */}
                <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={7} className="bg-gradient-to-b from-[#051a14] to-[#03120d] border border-emerald-900/50 rounded-[12px] p-6 shadow-sm flex flex-col text-emerald-50 h-full">
                  <h3 className="text-base font-semibold mb-5 flex items-center gap-2 text-emerald-100">
                    <Lightbulb size={18} className="text-accent" /> AI Insights & Recommendations
                  </h3>
                  
                  <div className="space-y-4 flex-1">
                     <InsightCard 
                        title="Optimization Available" 
                        text={`Increasing your current recycling rate from ${recycling}% to 35% will yield an estimated additional savings of ${formatNumber(stats.total * 0.15)} tCO₂e.`}
                     />
                     <InsightCard 
                        title="Transport Inefficiency" 
                        text={distance > 50 ? "Your disposal distance exceeds the local average of 30km. Consider nearer processing facilities to cut Scope 3 transport." : "Transport emissions are well within regional thresholds."}
                     />
                  </div>
                </motion.div>
             </div>

          </div>

          {/* Right Column: Live Scenario Modeler spanning 4 cols */}
          <div className="lg:col-span-4 h-full">
             <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={8} className="bg-card border border-border/80 rounded-[12px] overflow-hidden shadow-lg h-full flex flex-col sticky top-24">
               {/* Modeler Header */}
               <div className="bg-secondary/50 p-5 md:p-6 border-b border-border/60">
                  <h2 className="text-lg font-bold flex items-center gap-2 text-foreground">
                    <BarChart3 size={18} className="text-accent" /> Live Simulator
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">Adjust parameters over time to view instant recalculations of your final ledger.</p>
               </div>

               {/* Modeler Inputs */}
               <div className="p-5 md:p-6 space-y-6 md:space-y-7 flex-1 overflow-y-auto">
                 
                 <div className="space-y-3">
                   <InputField label="Project Floor Area (sq ft)">
                     <input
                       type="number"
                       value={area}
                       onChange={(e) => setArea(Number(e.target.value) || 0)}
                       className="w-full px-4 py-2.5 rounded-[6px] border border-border bg-background focus:ring-2 focus:ring-accent/40 outline-none transition-all text-sm font-medium shadow-sm"
                     />
                   </InputField>
                 </div>

                 <div className="space-y-3">
                   <InputField label="Primary Structural Material">
                     <select
                       value={type}
                       onChange={(e) => setType(e.target.value)}
                       className="w-full px-4 py-2.5 rounded-[6px] border border-border bg-background outline-none text-sm font-medium focus:ring-2 focus:ring-accent/40 transition-all shadow-sm appearance-none cursor-pointer"
                     >
                       <option value="RCC">RCC Structure (High Density)</option>
                       <option value="Brick">Brick & Mortar (Medium Density)</option>
                       <option value="Wood">Timber Frame (Low Impact)</option>
                     </select>
                   </InputField>
                 </div>

                 <div className="pt-2 border-t border-border/50">
                    <SliderField
                      label="Disposal Travel Distance"
                      value={distance}
                      unit=" km"
                      min={1}
                      max={150}
                      step={1}
                      onChange={setDistance}
                      subtext="Average radius to designated waste facility."
                    />
                 </div>

                 <div className="pt-2 border-t border-border/50">
                    <SliderField
                      label="Targeted Recycling Diversion"
                      value={recycling}
                      unit="%"
                      min={0}
                      max={100}
                      step={1}
                      onChange={setRecycling}
                      subtext="Percentage of mass recovered structurally."
                    />
                 </div>

                 <div className="pt-2 border-t border-border/50">
                    <SliderField
                      label="Heavy Machinery Fuel"
                      value={fuel}
                      unit=" Liters"
                      min={0}
                      max={2000}
                      step={10}
                      onChange={setFuel}
                      subtext="Estimated diesel/gas consumption on-site."
                    />
                 </div>

               </div>
               
               {/* Modeler Footer Note */}
               <div className="p-4 bg-muted/20 border-t border-border/40">
                  <p className="text-[11px] text-muted-foreground uppercase tracking-widest text-center font-semibold">
                     LCA Formula Engine V2.4 Active
                  </p>
               </div>
             </motion.div>
          </div>

        </div>
      </main>
    </div>
  );
};

/* ─── Shared UI Components ─── */

function KpiCard({ title, value, unit, trend, positive, index, highlight = false }: any) {
  return (
    <motion.div 
      initial="hidden" animate="visible" variants={fadeUp} custom={index}
      className={`rounded-[12px] p-5 border ${highlight ? 'bg-emerald-deep text-white border-none shadow-md' : 'bg-card border-border/60 shadow-sm'}`}
    >
       <p className={`text-sm font-medium mb-3 ${highlight ? 'text-emerald-100/80' : 'text-muted-foreground'}`}>{title}</p>
       <div className="flex items-baseline gap-1.5 mb-1.5">
          <span className={`text-3xl font-bold tracking-tight ${highlight ? 'text-white' : 'text-foreground'} tabular-nums`}>{value}</span>
          <span className={`text-sm font-medium ${highlight ? 'text-emerald-100/60' : 'text-muted-foreground'}`}>{unit}</span>
       </div>
       <div className={`text-xs font-semibold px-2 py-0.5 inline-flex rounded mt-1 bg-black/10`}>
          {positive === true && <span className={highlight ? 'text-emerald-300' : 'text-accent'}>{trend}</span>}
          {positive === false && <span className="text-red-500">{trend}</span>}
          {positive === null && <span className={highlight ? 'text-white/70' : 'text-muted-foreground'}>{trend}</span>}
       </div>
    </motion.div>
  );
}

const InputField = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-semibold text-foreground/80">{label}</label>
    {children}
  </div>
);

const SliderField = ({
  label,
  value,
  unit,
  min,
  max,
  step = 1,
  onChange,
  subtext
}: {
  label: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  subtext?: string;
}) => (
  <div className="flex flex-col gap-2 relative group touch-manipulation">
    <div className="flex items-end justify-between">
      <div className="flex flex-col">
        <label className="text-sm font-semibold text-foreground/80">
          {label}
        </label>
        {subtext && <span className="text-xs text-muted-foreground mt-0.5">{subtext}</span>}
      </div>
      <span className="text-base font-bold text-accent tabular-nums bg-accent/10 px-2.5 py-1 rounded-[6px]">
        {value}{unit}
      </span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full accent-accent h-2.5 rounded-full cursor-pointer bg-secondary appearance-none mt-2"
      style={{
        background: `linear-gradient(to right, hsl(158, 64%, 45%) ${(value - min) / (max - min) * 100}%, hsl(var(--secondary)) ${(value - min) / (max - min) * 100}%)`
      }}
    />
  </div>
);

function InsightCard({ title, text}: {title: string, text: string}) {
  return (
    <div className="bg-[#051a14]/60 border border-emerald-900/30 rounded-[8px] p-4 text-sm leading-relaxed">
       <span className="text-emerald-300 font-semibold mb-1 block">{title}</span>
       <span className="text-emerald-100/70">{text}</span>
    </div>
  )
}

export default DashboardPage;
