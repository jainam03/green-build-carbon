import React from "react";
import { 
  Leaf, 
  Settings, 
  LayoutDashboard, 
  Truck, 
  BarChart3, 
  Sparkles, 
  Zap, 
  Recycle,
  AlertTriangle,
  Info,
  CheckCircle2
} from "lucide-react";

/* ─── Shared Doc Components ─── */
const Section = ({ title, id, children }: { title: string; id: string; children: React.ReactNode }) => (
  <section id={id} className="mb-16 scroll-mt-24">
    <h2 className="text-3xl font-bold tracking-tight text-foreground mb-6 flex items-center gap-3">
      {title}
    </h2>
    <div className="text-muted-foreground leading-relaxed text-lg">
      {children}
    </div>
  </section>
);

const Callout = ({ type, title, children }: { type: 'info' | 'warning' | 'tip', title: string, children: React.ReactNode }) => (
  <div className={`my-8 p-6 rounded-xl border flex gap-4 ${
    type === 'info' ? 'bg-blue-50/50 border-blue-200 text-blue-900' :
    type === 'warning' ? 'bg-amber-50/50 border-amber-200 text-amber-900' :
    'bg-emerald-50/50 border-emerald-200 text-emerald-900'
  }`}>
    <div className="shrink-0 mt-1">
      {type === 'info' ? <Info size={20} className="text-blue-600" /> :
       type === 'warning' ? <AlertTriangle size={20} className="text-amber-600" /> :
       <CheckCircle2 size={20} className="text-emerald-600" />}
    </div>
    <div>
      <h4 className="font-bold mb-1">{title}</h4>
      <div className="text-sm opacity-90">{children}</div>
    </div>
  </div>
);

const Formula = ({ latex, desc }: { latex: string, desc: string }) => (
  <div className="my-8 bg-foreground rounded-xl p-8 text-center shadow-lg transform hover:scale-[1.01] transition-transform">
    <p className="text-emerald-300 font-mono text-xl md:text-2xl tracking-tighter mb-4">{latex}</p>
    <p className="text-background/60 text-sm font-medium">{desc}</p>
  </div>
);

/* ─── Individual Page Components ─── */

export const IntroSection = () => (
  <div className="animate-in fade-in duration-700">
    <Section title="Introduction" id="intro">
      <p className="mb-6">
        Welcome to the <span className="text-foreground font-semibold italic">Trace Carbon Intelligence</span> technical documentation. 
        As the construction and demolition (C&D) sector faces increasing global scrutiny for its environmental footprint—contributing nearly 11% of global emissions—the need for a <span className="text-foreground font-semibold">Contractor-Friendly</span> carbon tracking platform has never been greater.
      </p>
      <p className="mb-6">
        Unlike traditional LCA software designed for academic experts, Green Build Carbon is engineered for real-world site supervisors and project managers. We translate complex environmental science into daily operational insights without sacrificing scientific rigor.
      </p>
      <Callout type="tip" title="Platform Philosophy">
        Our three-pillar philosophy—<span className="font-bold">Measure, Recycle, Reduce</span>—mirrors international sustainability frameworks while remaining intuitive for on-site teams.
      </Callout>
    </Section>
  </div>
);

export const FormulaSection = () => (
  <div className="animate-in fade-in duration-700">
    <Section title="Core Calculation Engine" id="formulas">
      <p className="mb-6">
        The system automatically derives a baseline embodied carbon footprint based on physical inputs. Instead of requiring exact material manifests (which are rare in early-stage demolition), we use derived mass estimation.
      </p>
      
      <h3 className="text-xl font-bold text-foreground mt-10 mb-4">1. Project Mass Derivation</h3>
      <p className="mb-4 text-sm">Mass is derived from typical building density (1400 kg/m²) for structural stability:</p>
      <Formula 
        latex="Total Mass (tons) = (Area(m²) × 1400) / 1000" 
        desc="Where Area(m²) = Area(sqft) / 10.7639"
      />

      <h3 className="text-xl font-bold text-foreground mt-10 mb-4">2. Material Impact Baseline</h3>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {[
          { label: "Concrete", factor: "0.12 tCO₂/t" },
          { label: "Steel", factor: "2.15 tCO₂/t" },
          { label: "Bricks", factor: "0.30 tCO₂/t" },
          { label: "Others", factor: "0.05 tCO₂/t" },
        ].map(m => (
          <li key={m.label} className="bg-secondary/40 p-4 rounded-lg border border-border flex justify-between items-center">
            <span className="font-semibold">{m.label}</span>
            <code className="bg-emerald-bg px-2 py-1 rounded text-xs font-bold text-emerald-deep">{m.factor}</code>
          </li>
        ))}
      </ul>
      <Formula 
        latex="Material Impact = Σ(Mass_i × EF_i) × DQ_material" 
        desc="Sum of each material multiplied by its emission factor and quality modifier."
      />
    </Section>
  </div>
);

export const LogisticsSection = () => (
  <div className="animate-in fade-in duration-700">
    <Section title="Operational Activity Tracking" id="logistics">
      <p className="mb-6">
        Operational tracking accounts for the dynamic emissions generated by daily site activities. This is where contractors have the most control over their carbon debt.
      </p>

      <div className="space-y-10">
        <div>
          <h4 className="flex items-center gap-2 font-bold text-foreground mb-4">
            <Zap className="text-amber-500" size={18} /> Machinery Fuel Estimation
          </h4>
          <p className="text-sm mb-4">Fuel consumption is scaled by demolition intensity and machine utilization:</p>
          <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 font-mono text-sm leading-relaxed mb-4">
            Usage_Base = Truckloads × Utilization_Factor (L:10, M:30, H:60)<br/>
            Fuel_Est = Usage_Base × Intensity_Multiplier (Manual:0.2, Semi:0.6, Mechanical:1.0)
          </div>
          <Formula latex="Machine Impact = ((Fuel × 2.68 kg CO₂/L) / 1000)" desc="Factor: 2.68 kg CO₂/L (Diesel)" />
        </div>

        <div>
          <h4 className="flex items-center gap-2 font-bold text-foreground mb-4">
            <Truck className="text-blue-500" size={18} /> Transport Logistics
          </h4>
          <p className="text-sm mb-4">Logistics emissions are mapped to the total distance traveled by transport vehicles:</p>
          <Formula latex="Transport = (Logistics Distance × Total Tons × 0.10) / 1000" desc="Factor: 0.10 kg CO₂ per ton-km" />
        </div>
      </div>
    </Section>
  </div>
);

export const ReportingSection = () => (
  <div className="animate-in fade-in duration-700">
    <Section title="The Projection & Reporting Engine" id="reporting">
      <p className="mb-6">
        One of Green Build's most powerful features is the **Projection Engine**. It calculates terminal project impact based on current activity rates, providing early warning signs for carbon overruns.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
        <div className="bg-foreground text-background p-6 rounded-xl">
          <h5 className="font-bold text-accent mb-2">Forecasting Scale</h5>
          <p className="text-sm opacity-70 mb-4">The multiplier used to project current logs over the entire building size.</p>
          <code className="text-emerald-400 font-bold">Total Mass / Logged Mass</code>
        </div>
        <div className="bg-emerald-deep text-white p-6 rounded-xl">
          <h5 className="font-bold text-emerald-vibrant mb-2">Recycling Yields</h5>
          <p className="text-sm opacity-70 mb-4">Material recovered from the waste stream creates avoidance credits.</p>
          <div className="flex justify-between text-xs font-bold">
            <span>PURE RECYCLING</span>
            <span>80% Yield</span>
          </div>
          <div className="flex justify-between text-xs font-bold mt-2">
            <span>MIXED WASTE</span>
            <span>30% Yield</span>
          </div>
        </div>
      </div>

      <h3 className="text-xl font-bold text-foreground mt-10 mb-4">Master Headline Formula</h3>
      <p className="mb-4">The final dashboard figure consolidates baseline embodied carbon with scaled operational projections:</p>
      <Formula 
        latex="Total Emissions = Material + Projected(Machine + Transport + Processing - Recycling)" 
        desc="Consolidated terminal forecast."
      />
      
      <Callout type="warning" title="Data Quality Protocols">
        An estimation penalty of 10% (DQ_fuel = 1.10) is automatically applied to unmeasured fuel data to build accountability in sustainability reporting.
      </Callout>
    </Section>
  </div>
);
