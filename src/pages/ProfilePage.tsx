import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  LogOut,
  User,
  Mail,
  Building2,
  Phone,
  Calendar,
  Shield,
  BarChart3,
  FileText,
  Leaf,
  Truck,
  Recycle,
  PackageSearch,
  BadgeDollarSign,
  Target,
  BookOpen,
  Activity,
  Settings,
  CheckCircle,
  Sparkles,
  SlidersHorizontal,
  ClipboardList,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { TraceCarbonLogo } from "@/components/ui/TraceCarbonLogo";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
  }),
};

/* ─── Dashboard steps preview (what awaits the user) ─── */
const dashboardSteps = [
  {
    n: "01",
    icon: Settings,
    title: "Project Info",
    desc: "Building size + demolition method",
    color: "text-emerald-600 bg-emerald-50 border-emerald-200",
    dotColor: "bg-emerald-500",
  },
  {
    n: "02",
    icon: SlidersHorizontal,
    title: "Material Mix",
    desc: "Concrete, steel, bricks %",
    color: "text-blue-600 bg-blue-50 border-blue-200",
    dotColor: "bg-blue-500",
  },
  {
    n: "03",
    icon: Truck,
    title: "Daily Logs",
    desc: "Truck loads, fuel, disposal",
    color: "text-amber-600 bg-amber-50 border-amber-200",
    dotColor: "bg-amber-500",
  },
  {
    n: "04",
    icon: ShieldCheck,
    title: "Compliance",
    desc: "CPCB / BMC framework check",
    color: "text-indigo-600 bg-indigo-50 border-indigo-200",
    dotColor: "bg-indigo-500",
  },
];

/* ─── Platform services for Users ─── */
const userServices = [
  {
    icon: BarChart3,
    title: "Carbon Footprint Analysis",
    desc: "Calculate scope 3 emissions from material type, machinery fuel consumption, and waste transport — all from one structured dashboard.",
  },
  {
    icon: ClipboardList,
    title: "Daily Activity Logging",
    desc: "Record each site day's truck dispatches, diesel usage, and disposal routes. Your total carbon tally updates with every entry.",
  },
  {
    icon: Activity,
    title: "Live KPI Monitoring",
    desc: "Three automatic KPIs: Waste Diversion Rate, Waste Generation Rate (t/m²), and a 0–100 Compliance Score — all derived from your logs.",
  },
  {
    icon: Sparkles,
    title: "Best-Case Simulation",
    desc: "One-click 'Optimize My Workflow' shows your ideal emissions baseline — perfect compliance, exact fuel, 100% recycling — so you know where the ceiling is.",
  },
];

/* ─── Platform services for Vendors ─── */
const vendorServicesData = [
  {
    icon: Truck,
    title: "Waste Collection & Transport",
    desc: "Contractors on the platform select approved disposal routes. Your verified transport services appear as an option in their workflow.",
  },
  {
    icon: Recycle,
    title: "Recycling & Processing",
    desc: "Recycling-type disposal lowers a contractor's emission totals. Being a verified recycling partner makes your network position clear.",
  },
  {
    icon: PackageSearch,
    title: "Material Recovery",
    desc: "Recovered and resaleable materials reduce gross waste tonnage. Help contractors log these correctly and improve their diversion rates.",
  },
  {
    icon: BadgeDollarSign,
    title: "Carbon Offset Consulting",
    desc: "Beyond the dashboard metrics, help clients take verified programs toward net-zero. A growing part of the TraceCarbon ecosystem.",
  },
];

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  if (!user) {
    navigate("/auth", { replace: true });
    return null;
  }

  const services = user.role === "vendor" ? vendorServicesData : userServices;
  const roleLabel = user.role === "vendor" ? "Vendor" : "User";
  const roleColor = user.role === "vendor" ? "bg-amber-100 text-amber-800 border-amber-200" : "bg-emerald-bg text-emerald-deep border-emerald-deep/20";

  const accountDetails = [
    { icon: User, label: "Full Name", value: user.name },
    { icon: Mail, label: "Email", value: user.email },
    { icon: Building2, label: "Company", value: user.company },
    { icon: Phone, label: "Phone", value: user.phone },
    {
      icon: Calendar,
      label: "Registered",
      value: new Date(user.registeredAt).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    },
    { icon: Shield, label: "Role", value: roleLabel },
  ];

  // Quick action cards
  const quickActions = [
    {
      icon: BarChart3,
      title: "Open Carbon Dashboard",
      desc: "Start logging your demolition site data",
      action: () => navigate("/dashboard"),
      color: "text-emerald-600 bg-emerald-50 border-emerald-200",
    },
    {
      icon: BookOpen,
      title: "View Methodology",
      desc: "LCA formulas, CPCB standards & DQ scores",
      action: () => navigate("/docs"),
      color: "text-blue-600 bg-blue-50 border-blue-200",
    },
    {
      icon: FileText,
      title: "Read the Docs",
      desc: "Understand how emission factors are applied",
      action: () => navigate("/docs"),
      color: "text-purple-600 bg-purple-50 border-purple-200",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Top Nav */}
      <nav className="flex justify-between items-center px-6 md:px-8 py-5 max-w-7xl mx-auto border-b border-border/40">
        <TraceCarbonLogo />
        <button
          onClick={() => {
            signOut();
            navigate("/");
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[8px] text-sm font-medium border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        >
          <LogOut size={14} /> Sign Out
        </button>
      </nav>

      <div className="max-w-7xl mx-auto px-6 md:px-8 py-10 md:py-14">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
        >
          {/* ─── Welcome Header ─── */}
          <motion.div variants={fadeUp} custom={0} className="mb-10">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">
                Welcome, {user.name.split(" ")[0]}
              </h1>
              <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${roleColor}`}>
                {roleLabel} {user.role === "vendor" ? "Partner" : "Account"}
              </span>
            </div>
            <p className="text-muted-foreground max-w-2xl text-lg mt-2">
              {user.role === "vendor"
                ? "Your vendor profile is active. Explore the platform to understand where your services integrate with contractor workflows."
                : "You're all set. Your Carbon Dashboard is ready — add your first project details to start calculating emissions."}
            </p>
          </motion.div>

          {/* ─── Quick Actions ─── */}
          <motion.div variants={fadeUp} custom={1} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            {quickActions.map((action, i) => (
              <button
                key={i}
                onClick={action.action}
                className={`flex items-start gap-3 p-4 rounded-xl border transition-all hover:shadow-md text-left group ${action.color}`}
              >
                <div className="w-10 h-10 rounded-lg bg-white/80 flex items-center justify-center shrink-0 shadow-sm border border-current/10">
                  <action.icon size={18} />
                </div>
                <div>
                  <p className="font-bold text-sm mb-0.5 group-hover:underline">{action.title}</p>
                  <p className="text-[11px] opacity-70 leading-snug">{action.desc}</p>
                </div>
              </button>
            ))}
          </motion.div>

          {/* ─── Dashboard Journey Preview (Users) ─── */}
          {user.role !== "vendor" && (
            <motion.div
              variants={fadeUp}
              custom={2}
              className="mb-10 rounded-[16px] border border-border bg-card p-6 md:p-8 shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="font-bold text-lg text-foreground mb-1">Your path to carbon clarity</h3>
                  <p className="text-sm text-muted-foreground">4 quick steps inside your dashboard — takes under 5 minutes.</p>
                </div>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-5 py-2.5 rounded-[8px] text-sm font-semibold hover:brightness-110 transition-all shadow-sm shrink-0"
                >
                  Go to Dashboard <ArrowRight size={16} />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {dashboardSteps.map((step, i) => (
                  <div
                    key={i}
                    className={`relative flex flex-col gap-3 p-4 rounded-xl border ${step.color}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black opacity-50 uppercase tracking-widest">{step.n}</span>
                      <step.icon size={16} className="opacity-70" />
                    </div>
                    <div>
                      <p className="font-bold text-sm mb-0.5">{step.title}</p>
                      <p className="text-[11px] opacity-60 leading-snug">{step.desc}</p>
                    </div>
                    {i < 3 && (
                      <ChevronRight className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 opacity-30" size={16} />
                    )}
                  </div>
                ))}
              </div>

              {/* What you get after setup */}
              <div className="mt-6 pt-6 border-t border-border/60">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">After setup, you'll see:</p>
                <div className="flex flex-wrap gap-3">
                  {[
                    { icon: Activity, label: "Total CO₂ Emissions (tons)" },
                    { icon: Recycle, label: "Waste Diversion Rate %" },
                    { icon: BarChart3, label: "Emission Breakdown Chart" },
                    { icon: Sparkles, label: "Best-Case Simulation" },
                    { icon: CheckCircle, label: "Compliance Score 0–100" },
                  ].map((item, j) => (
                    <span key={j} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-secondary rounded-full text-xs font-semibold text-foreground/70 border border-border/60">
                      <item.icon size={11} className="text-accent" />
                      {item.label}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ─── Account Info + Objective ─── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-10">
            {/* Account Details */}
            <motion.div
              variants={fadeUp}
              custom={3}
              className="lg:col-span-2 bg-card rounded-[12px] p-6 md:p-8 shadow-sm border border-border"
            >
              <h3 className="font-bold text-lg mb-5 flex items-center gap-2 text-foreground">
                <User size={18} className="text-accent" /> Account Info
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {accountDetails.map((d, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50 border border-border/40">
                    <d.icon size={16} className="text-accent mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider mb-0.5">
                        {d.label}
                      </p>
                      <p className="text-sm font-semibold">{d.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Primary Objective / Services */}
            <motion.div
              variants={fadeUp}
              custom={4}
              className="bg-accent/10 rounded-[12px] p-6 md:p-8 border border-accent/20 shadow-sm"
            >
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-emerald-deep dark:text-emerald-light">
                <Target size={18} />
                {user.role === "vendor" ? "Your Services" : "Primary Objective"}
              </h3>
              {user.role === "vendor" ? (
                <div className="space-y-3">
                  {user.vendorServices && user.vendorServices.length > 0 ? (
                    user.vendorServices.map((srv, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2.5 bg-background rounded-md text-sm font-medium border border-border shadow-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                        {srv}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No services listed yet.</p>
                  )}
                </div>
              ) : (
                <div className="p-4 bg-background rounded-md border border-border text-center shadow-sm flex items-center justify-center flex-col gap-2 min-h-[140px]">
                  <div className="w-10 h-10 rounded-full bg-emerald-bg flex items-center justify-center mb-1">
                    <Leaf size={20} className="text-accent" />
                  </div>
                  <p className="text-sm font-bold text-foreground">
                    {user.userPurpose || "Carbon Footprint Tracking"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Aligned with CPCB C&D Waste Rules 2016
                  </p>
                </div>
              )}
            </motion.div>
          </div>

          {/* ─── Platform Capabilities Grid ─── */}
          <motion.div variants={fadeUp} custom={5} className="mb-10">
            <div className="mb-6">
              <h3 className="font-bold text-lg mb-1">
                {user.role === "vendor" ? "How the platform works for vendors" : "What you can do on TraceCarbon"}
              </h3>
              <p className="text-sm text-muted-foreground max-w-2xl">
                {user.role === "vendor"
                  ? "Understand how your services connect with contractors actively tracking waste on the platform."
                  : "Everything in your dashboard, explained — so you can hit the ground running."}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {services.map((s, i) => (
                <motion.div
                  key={i}
                  initial="hidden"
                  animate="visible"
                  custom={i + 5}
                  variants={fadeUp}
                  className="bg-card rounded-[12px] p-5 shadow-sm border border-border hover:shadow-elevated transition-shadow flex flex-col"
                >
                  <div className="w-10 h-10 rounded-[8px] bg-secondary flex items-center justify-center mb-4 shrink-0">
                    <s.icon size={18} className="text-foreground" />
                  </div>
                  <h4 className="font-bold text-sm mb-2 leading-tight">{s.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-auto">{s.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ─── CTA Strip ─── */}
          <motion.div
            variants={fadeUp}
            custom={9}
            className="text-center pt-6 pb-8 border-t border-border mt-4"
          >
            <h3 className="font-bold text-xl mb-2">Ready to analyze your site data?</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
              Your dashboard is live and cloud-synced. Every log you add is saved automatically.
            </p>
            <button
              onClick={() => navigate("/dashboard")}
              className="inline-flex items-center gap-2.5 bg-accent text-accent-foreground px-8 py-4 rounded-[8px] text-base font-semibold hover:brightness-110 transition-all active:scale-[0.98] shadow-elevated"
            >
              Open Carbon Dashboard <ArrowRight size={18} />
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;
