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
  ClipboardCheck,
  Truck,
  Recycle,
  PackageSearch,
  BadgeDollarSign,
  Target,
  BookOpen,
  Download,
  Activity,
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

const userServices = [
  {
    icon: BarChart3,
    title: "Carbon Footprint Analysis",
    desc: "Get detailed insights into your project's carbon emissions across the entire construction lifecycle.",
  },
  {
    icon: FileText,
    title: "Waste Audit Reports",
    desc: "Comprehensive reports on waste generation, disposal methods, and recycling opportunities.",
  },
  {
    icon: Leaf,
    title: "Sustainability Consulting",
    desc: "Expert guidance on reducing your environmental impact and achieving green certifications.",
  },
  {
    icon: ClipboardCheck,
    title: "Regulatory Compliance Check",
    desc: "Ensure your project meets local and national environmental regulations and standards.",
  },
];

const vendorServicesData = [
  {
    icon: Truck,
    title: "Waste Collection & Transport",
    desc: "Offer efficient waste pickup and transportation services to construction sites in your region.",
  },
  {
    icon: Recycle,
    title: "Recycling & Processing",
    desc: "Provide material recycling and processing capabilities for C&D waste streams.",
  },
  {
    icon: PackageSearch,
    title: "Material Recovery",
    desc: "List recovered materials for resale and contribute to the circular economy.",
  },
  {
    icon: BadgeDollarSign,
    title: "Carbon Offset Consulting",
    desc: "Help clients offset their carbon footprint through certified programs and initiatives.",
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

  const details = [
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

  // Quick action cards (Nielsen H6: Recognition rather than recall)
  const quickActions = [
    {
      icon: BarChart3,
      title: "Open Dashboard",
      desc: "Continue analyzing your carbon data",
      action: () => navigate("/dashboard"),
      color: "text-emerald-600 bg-emerald-50 border-emerald-200",
    },
    {
      icon: BookOpen,
      title: "View Methodology",
      desc: "LCA formulas and data quality explained",
      action: () => navigate("/methodology"),
      color: "text-blue-600 bg-blue-50 border-blue-200",
    },
    {
      icon: Download,
      title: "Export Report",
      desc: "Download your carbon assessment",
      action: () => navigate("/methodology"), // Redirects to methodology page with print option
      color: "text-purple-600 bg-purple-50 border-purple-200",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <nav className="flex justify-between items-center px-6 md:px-8 py-5 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center gap-2.5 font-bold text-xl tracking-tighter">
          <div className="flex items-center gap-2">
            <TraceCarbonLogo />
          </div>
        </div>
        <button
          onClick={() => {
            signOut();
            navigate("/");
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-button text-sm font-medium border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        >
          <LogOut size={14} /> Sign Out
        </button>
      </nav>

      <div className="max-w-7xl mx-auto px-6 md:px-8 py-8 md:py-12">
        {/* Welcome */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.1 } },
          }}
        >
          <motion.div variants={fadeUp} custom={0} className="mb-10">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">
                Welcome, {user.name.split(" ")[0]}
              </h1>
              <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${roleColor}`}>
                {roleLabel} {user.role === "vendor" ? "Partner" : "Account"}
              </span>
            </div>
            <p className="text-muted-foreground max-w-2xl text-lg mt-3">
              {user.role === "vendor"
                ? "Manage your vendor profile, view your service offerings, and access our dashboard tools."
                : "Manage your profile, set your sustainability goals, and track your construction waste carbon footprint."}
            </p>
          </motion.div>

          {/* Quick Actions (Nielsen H6: Recognition — common tasks at a glance) */}
          <motion.div variants={fadeUp} custom={0.5} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-10">
            {/* Details Card */}
            <motion.div
              variants={fadeUp}
              custom={1}
              className="lg:col-span-2 bg-card rounded-card p-6 md:p-8 shadow-card border border-border"
            >
              <h3 className="font-bold text-lg mb-5 flex items-center gap-2 text-foreground">
                <User size={18} className="text-accent" /> Account Info
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {details.map((d, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-button bg-secondary/50 border border-border/40">
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

            {/* Persona Objectives Snippet */}
            <motion.div
              variants={fadeUp}
              custom={2}
              className="bg-accent/10 rounded-card p-6 md:p-8 border border-accent/20 shadow-sm"
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
                <div className="p-4 bg-background rounded-md border border-border text-center shadow-sm h-full flex items-center justify-center flex-col gap-2">
                  <div className="w-10 h-10 rounded-full bg-emerald-bg flex items-center justify-center mb-1">
                    <Leaf size={20} className="text-accent" />
                  </div>
                  <p className="text-sm font-bold text-foreground">
                    {user.userPurpose || "Carbon Footprint Tracking"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Aligned with global sustainability standards
                  </p>
                </div>
              )}
            </motion.div>
          </div>

          {/* Services Array */}
          <motion.div variants={fadeUp} custom={3} className="mb-10">
            <h3 className="font-bold text-lg mb-1">
              {user.role === "vendor" ? "Platform Market Overview" : "Available Platform Services"}
            </h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-2xl">
              {user.role === "vendor"
                ? "Connecting contractors with sustainable vendors. See where your services fit in the ecosystem."
                : "Explore the different capabilities on TraceCarbon tailored to reduce your structural emissions."}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {services.map((s, i) => (
                <motion.div
                  key={i}
                  initial="hidden"
                  animate="visible"
                  custom={i + 4}
                  variants={fadeUp}
                  className="bg-card rounded-card p-5 shadow-card border border-border hover:shadow-elevated transition-shadow flex flex-col"
                >
                  <div className="w-10 h-10 rounded-button bg-secondary flex items-center justify-center mb-4">
                    <s.icon size={18} className="text-foreground" />
                  </div>
                  <h4 className="font-bold text-sm mb-2 leading-tight">{s.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-auto">
                    {s.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div variants={fadeUp} custom={8} className="text-center pt-4 pb-8 border-t border-border mt-12">
            <h3 className="font-bold text-xl mb-4">Ready to analyze your site data?</h3>
            <button
              onClick={() => navigate("/dashboard")}
              className="inline-flex items-center gap-2.5 bg-accent text-accent-foreground px-8 py-4 rounded-button text-base font-semibold hover:brightness-110 transition-all active:scale-[0.98] shadow-elevated"
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
