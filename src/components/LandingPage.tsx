import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Building2,
  HardHat,
  Gavel,
  Factory,
  BarChart3,
  SlidersHorizontal,
  ChevronRight,
  Activity,
  Globe2,
  ShieldCheck,
  Zap,
  Menu,
  X,
  Recycle,
  Truck,
  ClipboardList,
  Sparkles,
  TrendingDown,
  CheckCircle2,
  Layers,
} from "lucide-react";
import { TraceCarbonLogo } from "@/components/ui/TraceCarbonLogo";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

const LandingPage = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-accent/20 selection:text-foreground">
      {/* Skip-to-content link */}
      <a href="#main-content" className="sr-skip-link">
        Skip to main content
      </a>

      {/* Sticky Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex justify-between items-center px-6 md:px-8 py-4 max-w-[1400px] mx-auto">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2.5 font-bold text-xl tracking-tighter">
              <TraceCarbonLogo className="scale-[0.85] origin-left" />
            </div>
            <div className="hidden md:flex">
              <NavMenu />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/auth")}
              className="hidden sm:block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/auth")}
              className="hidden sm:inline-flex px-5 py-2.5 rounded-[6px] text-sm font-medium bg-foreground text-background hover:bg-foreground/90 transition-all shadow-sm"
            >
              Get Started →
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-secondary transition-colors"
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="md:hidden overflow-hidden border-t border-border/40 bg-background"
              aria-label="Mobile navigation"
            >
              <div className="px-6 py-6 space-y-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2 px-3">Platform</p>
                <MobileNavLink onClick={() => { document.getElementById('dashboard-section')?.scrollIntoView({ behavior: 'smooth' }); setMobileMenuOpen(false); }}>
                  Carbon Dashboard
                </MobileNavLink>
                <MobileNavLink onClick={() => { navigate("/docs"); setMobileMenuOpen(false); }}>
                  Methodology & Docs
                </MobileNavLink>
                <MobileNavLink onClick={() => { document.getElementById('stakeholders-section')?.scrollIntoView({ behavior: 'smooth' }); setMobileMenuOpen(false); }}>
                  Who Is It For
                </MobileNavLink>

                <div className="h-px bg-border my-3" />

                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2 px-3">Features</p>
                {platformFeatures.map((f) => (
                  <MobileNavLink key={f.title} onClick={() => { document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' }); setMobileMenuOpen(false); }}>
                    {f.title}
                  </MobileNavLink>
                ))}

                <div className="h-px bg-border my-3" />

                <div className="flex flex-col gap-3 pt-2">
                  <button
                    onClick={() => { navigate("/auth"); setMobileMenuOpen(false); }}
                    className="w-full py-3 rounded-[8px] text-sm font-semibold bg-foreground text-background hover:bg-foreground/90 transition-all shadow-sm"
                  >
                    Get Started
                  </button>
                  <button
                    onClick={() => { navigate("/auth"); setMobileMenuOpen(false); }}
                    className="w-full py-3 rounded-[8px] text-sm font-semibold bg-secondary text-foreground hover:bg-secondary/80 transition-all border border-border"
                  >
                    Sign In
                  </button>
                </div>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      {/* ─── Hero ─── */}
      <section id="main-content" className="relative overflow-hidden max-w-[1400px] mx-auto px-6 md:px-8 pt-20 md:pt-32 pb-24 md:pb-36 text-center">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-bg/50 via-background to-background" />
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          className="max-w-4xl mx-auto"
        >
          {/* Badge */}
          <motion.div variants={fadeUp} custom={0} className="mb-6 flex justify-center">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-bg border border-emerald-deep/10 text-xs font-semibold text-emerald-deep tracking-wide uppercase">
              <Globe2 size={14} /> C&D Carbon Intelligence · India
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            custom={1}
            className="text-5xl md:text-7xl font-semibold tracking-tighter mb-6 text-balance leading-[1.05] text-foreground"
          >
            Turn demolition data into{" "}
            <span className="text-accent underline decoration-accent/30 underline-offset-[6px]">climate accountability</span>.
          </motion.h1>

          {/* Sub-copy */}
          <motion.p
            variants={fadeUp}
            custom={2}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed font-medium"
          >
            TraceCarbon is a demolition-focused carbon tracking dashboard. Log your site's daily activity — truck loads, machinery fuel, disposal routes — and get real-time emission analysis aligned with CPCB & BMC compliance standards.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={fadeUp} custom={3} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate("/auth")}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-accent text-accent-foreground px-8 py-4 rounded-[8px] text-base font-semibold hover:brightness-110 transition-all shadow-sm"
            >
              Start Tracking Your Site <ArrowRight size={18} />
            </button>
            <button
              onClick={() => document.getElementById('dashboard-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-card border border-border text-foreground px-8 py-4 rounded-[8px] text-base font-semibold hover:bg-secondary transition-all"
            >
              See How It Works
            </button>
          </motion.div>

          {/* Trust strip */}
          <motion.div variants={fadeUp} custom={4} className="mt-14 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-muted-foreground">
            {[
              "CPCB C&D Waste Rules 2016",
              "BMC Guidelines",
              "ISO-aligned LCA methodology",
              "Firebase cloud sync",
            ].map((item) => (
              <span key={item} className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-accent" />
                {item}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ─── Dashboard Showcase ─── */}
      <section id="dashboard-section" className="bg-foreground text-background py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Copy */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            >
              <motion.div variants={fadeUp} className="mb-3">
                <span className="text-xs font-bold uppercase tracking-widest text-accent">The Carbon Dashboard</span>
              </motion.div>
              <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-semibold tracking-tight mb-6 leading-tight">
                Your site's carbon output,<br />visible in real time.
              </motion.h2>
              <motion.p variants={fadeUp} className="text-background/70 text-lg mb-8 leading-relaxed">
                Set up your demolition project in 4 steps, log daily activity, and watch your carbon footprint calculate live — broken down by material type, machinery fuel, and transport distance.
              </motion.p>

              <ul className="space-y-6">
                {[
                  {
                    icon: ClipboardList,
                    title: "4-Step Setup Flow",
                    desc: "Project area & demolition type → material mix (concrete, steel, bricks) → daily activity logs → compliance check. Done.",
                  },
                  {
                    icon: Activity,
                    title: "3 Live KPI Cards",
                    desc: "Waste Diversion Rate, Waste Generation Rate (t/m²), and a Compliance Score. Calculated dynamically from your logs.",
                  },
                  {
                    icon: Sparkles,
                    title: "Best-Case Simulation",
                    desc: "Hit 'Optimize My Workflow' to see how much CO₂ you'd save with perfect compliance, exact fuel tracking, and 100% recycling.",
                  },
                ].map((item, i) => (
                  <motion.li variants={fadeUp} custom={i} key={i} className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-background/10 flex items-center justify-center shrink-0">
                      <item.icon className="text-accent" size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-1">{item.title}</h4>
                      <p className="text-background/60 leading-relaxed text-sm">{item.desc}</p>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Representational Dashboard Mockup */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true }}
              className="relative rounded-[16px] overflow-hidden shadow-2xl border border-background/10"
            >
              <div className="bg-slate-900 p-5">
                {/* Mock header bar */}
                <div className="flex justify-between items-center mb-5 pb-4 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-accent" />
                    <span className="text-white/60 text-xs font-bold tracking-widest uppercase">TraceCarbon · Dashboard</span>
                  </div>
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-white/10" />
                    <div className="w-2 h-2 rounded-full bg-white/10" />
                    <div className="w-2 h-2 rounded-full bg-white/10" />
                  </div>
                </div>

                {/* Total emissions hero */}
                <div className="text-center py-5 mb-5 rounded-xl bg-slate-800 border border-white/5">
                  <p className="text-accent text-[10px] font-bold tracking-widest uppercase mb-2">Total Carbon Emissions</p>
                  <p className="text-5xl font-black text-white tracking-tighter tabular-nums">36.85</p>
                  <p className="text-white/50 text-sm mt-1.5">Tons CO₂e · Mechanical demolition</p>
                  <div className="mt-3 mx-auto w-max px-3 py-1 bg-red-500/20 text-red-300 text-[10px] font-bold rounded border border-red-500/30">
                    +4.2t non-compliance DQ penalty
                  </div>
                </div>

                {/* KPI row */}
                <div className="grid grid-cols-3 gap-3 mb-5">
                  {[
                    { label: "Diversion Rate", value: "62%", sub: "✓ Above 50% target", bg: "bg-emerald-900/40 border-emerald-700/40", val: "text-emerald-300" },
                    { label: "Waste Rate", value: "0.48 t/m²", sub: "✓ Within benchmark", bg: "bg-blue-900/40 border-blue-700/40", val: "text-blue-300" },
                    { label: "Compliance", value: "60/100", sub: "Medium Risk", bg: "bg-amber-900/40 border-amber-700/40", val: "text-amber-300" },
                  ].map((k, i) => (
                    <div key={i} className={`rounded-lg border p-3 ${k.bg}`}>
                      <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1.5">{k.label}</p>
                      <p className={`text-base font-black tabular-nums ${k.val}`}>{k.value}</p>
                      <p className="text-[9px] text-white/40 mt-1 leading-tight">{k.sub}</p>
                    </div>
                  ))}
                </div>

                {/* Chart bars (static representation) */}
                <div className="rounded-lg border border-white/5 bg-slate-800/60 p-4">
                  <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest mb-3">Cumulative Impact Trend</p>
                  <div className="flex items-end gap-1.5 h-14">
                    {[28, 38, 44, 52, 58, 62, 70, 80, 88, 95, 100, 108].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-t"
                        style={{ height: `${h}%`, background: `hsl(${158 + i * 0.5}, 64%, ${30 + i * 1.5}%)`, opacity: 0.8 }}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between mt-2">
                    {["Jan", "Mar", "May", "Jul", "Sep", "Nov"].map((m) => (
                      <span key={m} className="text-[8px] text-white/20 font-bold">{m}</span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Who Is It For ─── */}
      <section id="stakeholders-section" className="py-24 md:py-32 max-w-[1400px] mx-auto px-6 md:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-5 text-foreground">
            Built for everyone on the demolition site
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            From project developers to site supervisors and compliance authorities — TraceCarbon gives each stakeholder the visibility they need.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Building2,
              role: "Builders & Developers",
              desc: "Set site parameters like building area and material composition. Get a full carbon liability view at the project level before demolition begins.",
            },
            {
              icon: HardHat,
              role: "Site Supervisors & Contractors",
              desc: "Log daily truck movements, fuel consumption, and disposal routes. Watch your actual emissions update in real time with every entry.",
            },
            {
              icon: Gavel,
              role: "Authorities & Auditors",
              desc: "Review compliance scores, waste diversion rates, and generation benchmarks against CPCB C&D Waste Rules 2016 and BMC guidelines.",
            },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i}
              variants={fadeUp}
              className="bg-card rounded-[12px] p-8 border border-border shadow-sm hover:shadow-md transition-shadow"
            >
              <s.icon className="mb-6 text-foreground" size={28} />
              <h4 className="font-semibold text-xl mb-3 tracking-tight">{s.role}</h4>
              <p className="text-muted-foreground leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── Platform Features ─── */}
      <section id="features-section" className="bg-secondary/50 py-24 md:py-32 border-y border-border">
        <div className="max-w-[1400px] mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-6">
                Every emission source.<br />Accounted for.
              </h2>
              <p className="text-muted-foreground text-lg mb-8 leading-relaxed max-w-md">
                Our LCA engine covers all three demolition emission vectors — materials, machinery, and transport — and applies CPCB-aligned data quality multipliers automatically.
              </p>
              <button onClick={() => navigate("/docs")} className="inline-flex items-center gap-2 text-foreground font-semibold border-b border-foreground pb-1 hover:text-accent hover:border-accent transition-colors">
                Read the full methodology <ArrowRight size={16} />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-12">
              {platformFeatures.map((f, i) => (
                <motion.div
                  key={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                  variants={fadeUp}
                >
                  <f.icon className="text-accent mb-4" size={24} />
                  <h4 className="font-semibold mb-2">{f.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── How It Works Strip ─── */}
      <section className="py-24 md:py-32 max-w-[1400px] mx-auto px-6 md:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">Up and running in 4 steps</h2>
          <p className="text-muted-foreground text-lg">No training required. No specialists needed. Just your site data.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { n: "01", icon: Layers, title: "Set Project Info", desc: "Enter your building's square footage and select the demolition method — mechanical, semi-mechanical, or manual." },
            { n: "02", icon: SlidersHorizontal, title: "Define Material Mix", desc: "Input the percentages of concrete, steel, bricks, and aggregates. The total must reach 100% to unlock calculations." },
            { n: "03", icon: Truck, title: "Log Daily Activity", desc: "Each day, add truck loads dispatched, diesel used, transport distance, and disposal type (landfill, mixed, or recycling)." },
            { n: "04", icon: ShieldCheck, title: "Check Compliance", desc: "Indicate whether demolition rules were followed and which framework applies. Your Compliance Score updates instantly." },
          ].map((step, i) => (
            <motion.div
              key={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i}
              variants={fadeUp}
              className="relative bg-card border border-border rounded-[12px] p-7 hover:shadow-md transition-shadow"
            >
              <span className="text-[10px] font-black text-accent/60 tracking-widest uppercase mb-4 block">{step.n}</span>
              <step.icon className="text-foreground mb-4" size={22} />
              <h4 className="font-semibold text-base mb-2">{step.title}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              {i < 3 && (
                <ChevronRight className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 text-border" size={20} />
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── Final CTA ─── */}
      <section className="bg-foreground text-background py-32 text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          className="max-w-3xl mx-auto px-6"
        >
          <motion.div variants={fadeUp} custom={0} className="mb-4 flex justify-center">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-background/10 border border-background/20 text-xs font-semibold text-background/70 tracking-wide uppercase">
              <TrendingDown size={12} className="text-accent" /> Start reducing. Right now.
            </span>
          </motion.div>
          <motion.h2
            variants={fadeUp}
            custom={1}
            className="text-4xl md:text-5xl font-semibold tracking-tighter mb-6"
          >
            Your first site analysis<br />takes under 5 minutes.
          </motion.h2>
          <motion.p
            variants={fadeUp}
            custom={2}
            className="text-lg text-background/60 mb-10 max-w-xl mx-auto leading-relaxed"
          >
            Join contractors, developers, and compliance teams using TraceCarbon to make C&D waste visible, measurable, and improvable.
          </motion.p>
          <motion.div variants={fadeUp} custom={3} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate("/auth")}
              className="inline-flex items-center gap-2.5 bg-accent text-accent-foreground px-10 py-4 rounded-[8px] text-base font-semibold hover:brightness-110 transition-all shadow-md"
            >
              Create Free Account <ArrowRight size={18} />
            </button>
            <button
              onClick={() => navigate("/docs")}
              className="inline-flex items-center gap-2.5 border border-background/20 text-background/80 hover:text-background px-10 py-4 rounded-[8px] text-base font-semibold hover:bg-background/5 transition-all"
            >
              Read the Methodology
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="py-12 px-6 md:px-8 max-w-[1400px] mx-auto text-sm text-muted-foreground flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <TraceCarbonLogo className="scale-75 origin-left" />
          <span className="text-muted-foreground/60">·</span>
          <p>© 2026 Trace Carbon Intelligence. All rights reserved.</p>
        </div>
        <div className="flex gap-6">
          <Link to="/docs" className="hover:text-foreground cursor-pointer transition-colors">Methodology</Link>
          <Link to="/auth" className="hover:text-foreground cursor-pointer transition-colors">Sign In</Link>
          <Link to="/auth" className="hover:text-foreground cursor-pointer transition-colors">Register</Link>
        </div>
      </footer>
    </div>
  );
};

/* ─── Platform Features Data ─── */
const platformFeatures = [
  {
    icon: Factory,
    title: "Material Emission Engine",
    desc: "Calculate CO₂ from RCC, steel framing, masonry, and aggregates based on your exact material mix percentages.",
  },
  {
    icon: Zap,
    title: "Machinery Fuel Tracking",
    desc: "Enter exact diesel liters per day or pick a usage intensity — High / Medium / Low. Real fuel always overrides estimates.",
  },
  {
    icon: BarChart3,
    title: "Transport Distance Impact",
    desc: "Log kilometers to disposal site per truck load. The engine calculates transport emissions using IPCC emission factors.",
  },
  {
    icon: Recycle,
    title: "Recycling & Diversion Credits",
    desc: "Route waste to recycling instead of landfill and watch your Waste Diversion Rate climb toward the 50% CPCB target.",
  },
  {
    icon: ShieldCheck,
    title: "Compliance Scoring",
    desc: "A composite 0–100 score based on rules-followed status and framework type (CPCB / BMC / Informal). Risk-flagged automatically.",
  },
  {
    icon: Sparkles,
    title: "Best-Case Simulation",
    desc: "One click shows your ideal emissions baseline — perfect compliance, exact fuel tracking, 100% recycling. Know your ceiling.",
  },
];

/* ─── Mobile Nav Link ─── */
function MobileNavLink({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-secondary/60 transition-colors"
    >
      {children}
    </button>
  );
}

/* ─── Navigation Menu Component ─── */
const NavMenu = () => {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {/* Platform Menu */}
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent text-foreground/80 hover:text-foreground font-medium text-sm data-[active]:bg-secondary/50 data-[state=open]:bg-secondary/50">Platform</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr] border-border bg-popover shadow-elevated">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <a
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-secondary/50 to-secondary p-6 no-underline outline-none focus:shadow-md border border-border/50"
                    href="/auth"
                  >
                    <div className="w-8 h-8 bg-foreground rounded-[6px] flex items-center justify-center text-background text-xs font-extrabold shadow-sm mb-4">
                      TC
                    </div>
                    <div className="mb-2 mt-4 text-lg font-semibold tracking-tight">
                      Carbon Dashboard
                    </div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      Calculate, track, and reduce demolition emissions in real time.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <ListItem href="/docs" title="Methodology & Docs">
                LCA algorithms, CPCB compliance formulas, and data quality explained.
              </ListItem>
              <ListItem href="/auth" title="KPI Tracking">
                Monitor Waste Diversion Rate, Generation Rate, and Compliance Score.
              </ListItem>
              <ListItem href="/auth" title="Emission Simulation">
                Run best-case scenarios and see how much CO₂ you could save.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Features Menu */}
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent text-foreground/80 hover:text-foreground font-medium text-sm data-[active]:bg-secondary/50 data-[state=open]:bg-secondary/50">Features</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-popover shadow-elevated border-border">
              {platformFeatures.map((feature) => (
                <ListItem
                  key={feature.title}
                  title={feature.title}
                  href="/auth"
                >
                  {feature.desc}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Docs Link */}
        <NavigationMenuItem>
          <Link to="/docs" className="inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary/50 hover:text-foreground text-foreground/80 focus:bg-secondary/50 focus:text-accent-foreground outline-none">
            Docs
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-secondary/50 hover:text-accent-foreground focus:bg-secondary/50 focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none mb-1 text-foreground">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export default LandingPage;
