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
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

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

const vendorServices = [
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

  const services = user.role === "vendor" ? vendorServices : userServices;
  const roleLabel = user.role === "vendor" ? "Vendor" : "User";
  const roleColor = user.role === "vendor" ? "bg-amber-100 text-amber-800" : "bg-emerald-bg text-emerald-deep";

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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <nav className="flex justify-between items-center px-6 md:px-8 py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-2.5 font-bold text-xl tracking-tighter">
          <div className="w-8 h-8 bg-accent rounded-button flex items-center justify-center text-accent-foreground text-sm font-extrabold">
            V
          </div>
          VERIDIAN
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
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                Welcome, {user.name.split(" ")[0]}
              </h1>
              <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${roleColor}`}>
                {roleLabel}
              </span>
            </div>
            <p className="text-muted-foreground">
              {user.role === "vendor"
                ? "Here's your vendor profile and the services you can provide on Veridian."
                : "Here's your profile and the services available to you on Veridian."}
            </p>
          </motion.div>

          {/* Details Card */}
          <motion.div
            variants={fadeUp}
            custom={1}
            className="bg-card rounded-card p-6 md:p-8 shadow-card mb-10 border border-border"
          >
            <h3 className="font-bold text-lg mb-5 flex items-center gap-2">
              <User size={18} className="text-accent" /> Profile Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {details.map((d, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-button bg-secondary/50">
                  <d.icon size={16} className="text-accent mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                      {d.label}
                    </p>
                    <p className="text-sm font-semibold mt-0.5">{d.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Services */}
          <motion.div variants={fadeUp} custom={2} className="mb-10">
            <h3 className="font-bold text-lg mb-1">
              {user.role === "vendor" ? "Services You Can Provide" : "Available Services"}
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              {user.role === "vendor"
                ? "As a vendor on Veridian, you can offer these services to construction projects."
                : "As a registered user, you can avail these services for your construction projects."}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {services.map((s, i) => (
                <motion.div
                  key={i}
                  initial="hidden"
                  animate="visible"
                  custom={i + 3}
                  variants={fadeUp}
                  className="bg-card rounded-card p-5 shadow-card border border-border hover:shadow-elevated transition-shadow"
                >
                  <div className="w-10 h-10 rounded-button bg-emerald-bg flex items-center justify-center mb-3">
                    <s.icon size={20} className="text-accent" />
                  </div>
                  <h4 className="font-bold text-sm mb-1">{s.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div variants={fadeUp} custom={7} className="text-center pt-4 pb-8">
            <button
              onClick={() => navigate("/dashboard")}
              className="inline-flex items-center gap-2.5 bg-accent text-accent-foreground px-8 py-4 rounded-button text-base font-semibold hover:brightness-110 transition-all active:scale-[0.98] shadow-elevated"
            >
              Go to Carbon Dashboard <ArrowRight size={18} />
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;
