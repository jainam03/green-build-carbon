import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Mail,
  Lock,
  User,
  Building2,
  Phone,
  UserCheck,
  Truck,
  Eye,
  EyeOff,
  CheckCircle2,
  ShieldCheck,
  BarChart3,
  Leaf
} from "lucide-react";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

type Tab = "signin" | "register";

const VENDOR_SERVICES = [
  "Waste Collection & Transport",
  "Recycling & Processing",
  "Material Recovery",
  "Carbon Offset Consulting"
];

const USER_PURPOSES = [
  "Carbon Footprint Analysis",
  "Waste Audit Reports",
  "Sustainability Consulting",
  "Regulatory Compliance Check"
];

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState<Tab>("signin");
  const navigate = useNavigate();
  const { signIn, register, isAuthenticated } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/profile", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      
      {/* ─── LEFT PANEL (Marketing / Value Prop) ─── */}
      <div className="hidden lg:flex lg:w-5/12 xl:w-1/2 relative flex-col justify-between p-12 bg-[#051a14] text-background overflow-hidden border-r border-border/10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-900/40 via-[#051a14] to-[#051a14] z-0" />
        <div className="absolute w-[600px] h-[600px] bg-accent/10 rounded-full blur-[120px] -bottom-40 -left-40 z-0 pointer-events-none" />
        
        <div className="relative z-10 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 font-bold text-2xl tracking-tighter hover:opacity-90 transition-opacity">
            <div className="w-10 h-10 bg-accent rounded-[8px] flex items-center justify-center text-accent-foreground text-lg font-extrabold shadow-sm">
              V
            </div>
            VERIDIAN
          </Link>
        </div>

        <div className="relative z-10 flex flex-col gap-10 max-w-lg mt-12 mb-auto">
          <div>
            <h1 className="text-4xl xl:text-5xl font-semibold tracking-tight text-white mb-6 leading-[1.1]">
              The foundation for a net-zero built environment.
            </h1>
            <p className="text-lg text-emerald-100/70 leading-relaxed font-medium">
              Join the unified platform measuring footprint, generating compliance exports, and uniting contractors with green vendors.
            </p>
          </div>

          <div className="space-y-6">
            <FeatureRow 
              icon={<BarChart3 size={22} className="text-accent" />} 
              title="Enterprise-grade Analytics" 
              desc="Calculate your scope 3 emissions dynamically based on material type and disposal logistics." 
            />
            <FeatureRow 
              icon={<ShieldCheck size={22} className="text-accent" />} 
              title="Audit-Ready Compliance" 
              desc="Align your projects seamlessly with regional and global environmental standards." 
            />
            <FeatureRow 
              icon={<Leaf size={22} className="text-accent" />} 
              title="Verified Green Network" 
              desc="Plug into a verified ecosystem of sustainable vendors and recycling facilities." 
            />
          </div>
        </div>

        <div className="relative z-10 text-sm text-emerald-100/50 flex items-center gap-2 pb-4">
          <CheckCircle2 size={16} /> 
          Strictly confidential. Bank-grade encryption for all project data.
        </div>
      </div>

      {/* ─── RIGHT PANEL (Form Area) ─── */}
      <div className="flex-1 flex flex-col border-l border-border/40 bg-card overflow-y-auto w-full relative">
        {/* Mobile Header (Only visible on < lg screens) */}
        <div className="lg:hidden flex items-center justify-between p-6 border-b border-border/40 bg-background/95 sticky top-0 z-20">
          <Link to="/" className="flex items-center gap-2 font-bold text-lg tracking-tighter">
            <div className="w-7 h-7 bg-foreground rounded-[6px] flex items-center justify-center text-background text-xs font-extrabold">
              V
            </div>
            VERIDIAN
          </Link>
          <button onClick={() => navigate("/")} className="text-sm text-muted-foreground font-medium hover:text-foreground">
            Back to Home
          </button>
        </div>

        <div className="lg:absolute lg:top-8 lg:right-10 hidden lg:block z-20">
           <button onClick={() => navigate("/")} className="inline-flex items-center gap-2 text-sm text-muted-foreground font-semibold hover:text-foreground transition-colors bg-secondary/50 px-4 py-2 rounded-full border border-border">
             <ArrowLeft size={14} /> Back to Platform
           </button>
        </div>

        <div className="flex-1 flex flex-col justify-center max-w-2xl w-full mx-auto p-6 md:p-12 lg:p-16 my-auto">
          {/* Header */}
          <div className="mb-10 lg:mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground mb-3">
              {activeTab === "signin" ? "Welcome back" : "Create an account"}
            </h2>
            <p className="text-muted-foreground text-base">
              {activeTab === "signin" 
                ? "Enter your credentials to access your dashboard." 
                : "Register as a developer, supervisor, or vendor to get started."}
            </p>
          </div>

          {/* Inline Tabs */}
          <div className="flex mb-10 bg-secondary/80 rounded-[8px] p-1.5 w-full md:w-max min-w-[320px]">
            {(["signin", "register"] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-8 py-2.5 text-sm font-semibold rounded-[6px] transition-all ${
                  activeTab === tab
                    ? "bg-card text-foreground shadow-sm border border-border/50"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab === "signin" ? "Sign In" : "Register"}
              </button>
            ))}
          </div>

          {/* Form Content */}
          <div className="w-full">
            <AnimatePresence mode="wait">
              {activeTab === "signin" ? (
                <motion.div
                  key="signin"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.25 }}
                >
                  <SignInForm
                    onSignIn={async (email, password) => {
                      const result = await signIn(email, password);
                      if (result.success) {
                        toast({ title: "Welcome back!", description: "You've been signed in successfully." });
                        navigate("/profile");
                      } else {
                        toast({ title: "Sign in failed", description: result.error, variant: "destructive" });
                      }
                    }}
                    onSwitchToRegister={() => setActiveTab("register")}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="register"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.25 }}
                >
                  <RegisterForm
                    onRegister={async (data) => {
                      const result = await register(data);
                      if (result.success) {
                        toast({ title: "Registration successful!", description: "Please sign in with your credentials." });
                        setActiveTab("signin");
                      } else {
                        toast({ title: "Registration failed", description: result.error, variant: "destructive" });
                      }
                    }}
                    onSwitchToSignIn={() => setActiveTab("signin")}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── Sign In Form ─── */
function SignInForm({
  onSignIn,
  onSwitchToRegister,
}: {
  onSignIn: (email: string, password: string) => void;
  onSwitchToRegister: () => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSignIn(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="text-sm font-semibold text-foreground mb-2 block">Work Email</label>
          <InputWithIcon
            icon={<Mail size={16} />}
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={setEmail}
            required
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-foreground mb-2 block flex justify-between">
            <span>Password</span>
            <span className="text-accent cursor-pointer hover:underline font-medium">Forgot password?</span>
          </label>
          <div className="relative">
            <InputWithIcon
              icon={<Lock size={16} />}
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={setPassword}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-foreground text-background py-3.5 rounded-[8px] font-semibold hover:bg-foreground/90 transition-all active:scale-[0.98] shadow-sm mt-8 text-base"
      >
        Sign In to Platform
      </button>

      <p className="text-center text-sm text-muted-foreground mt-8">
        Don't have an account?{" "}
        <button type="button" onClick={onSwitchToRegister} className="text-foreground font-semibold hover:text-accent transition-colors underline underline-offset-4 decoration-border">
          Create one now
        </button>
      </p>
    </form>
  );
}

/* ─── Register Form (Wide Layout) ─── */
function RegisterForm({
  onRegister,
  onSwitchToSignIn,
}: {
  onRegister: (data: {
    email: string;
    name: string;
    password: string;
    role: UserRole;
    company: string;
    phone: string;
    vendorServices?: string[];
    userPurpose?: string;
  }) => void;
  onSwitchToSignIn: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<UserRole>("user");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const [vendorServices, setVendorServices] = useState<string[]>([]);
  const [userPurpose, setUserPurpose] = useState("");

  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({ title: "Passwords don't match", description: "Please make sure both passwords are identical.", variant: "destructive" });
      return;
    }
    if (password.length < 6) {
      toast({ title: "Password too short", description: "Password must be at least 6 characters.", variant: "destructive" });
      return;
    }

    if (role === "vendor" && vendorServices.length === 0) {
      toast({ title: "Select services", description: "Please select at least one service you offer.", variant: "destructive" });
      return;
    }

    if (role === "user" && !userPurpose) {
      toast({ title: "Select a purpose", description: "Please let us know your primary goal.", variant: "destructive" });
      return;
    }

    onRegister({ 
      email, 
      name, 
      password, 
      role, 
      company, 
      phone,
      vendorServices: role === "vendor" ? vendorServices : undefined,
      userPurpose: role === "user" ? userPurpose : undefined
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      
      {/* Role Selection section (Big prominence) */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-foreground">Select Primary Role</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <RoleButton
            icon={<UserCheck size={20} />}
            label="Client User"
            description="Track footprint, audit sites"
            active={role === "user"}
            onClick={() => {
              setRole("user");
              setVendorServices([]); 
            }}
          />
          <RoleButton
            icon={<Truck size={20} />}
            label="Vendor / Partner"
            description="Offer sustainable services"
            active={role === "vendor"}
            onClick={() => {
              setRole("vendor");
              setUserPurpose(""); 
            }}
          />
        </div>
      </div>

      <hr className="border-border/60" />

      {/* Basic Demographics (Grid) */}
      <div className="space-y-5">
         <h3 className="text-sm font-semibold text-foreground">Personal Details</h3>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
           <div>
             <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Full Name</label>
             <InputWithIcon
               icon={<User size={16} />}
               type="text"
               placeholder="Jane Doe"
               value={name}
               onChange={setName}
               required
             />
           </div>
           <div>
             <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Work Email</label>
             <InputWithIcon
               icon={<Mail size={16} />}
               type="email"
               placeholder="jane@company.com"
               value={email}
               onChange={setEmail}
               required
             />
           </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
           <div>
             <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Company / Org</label>
             <InputWithIcon
               icon={<Building2 size={16} />}
               type="text"
               placeholder="ABC Construction"
               value={company}
               onChange={setCompany}
               required
             />
           </div>
           <div>
             <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Phone Number</label>
             <InputWithIcon
               icon={<Phone size={16} />}
               type="tel"
               placeholder="+1 (555) 000-0000"
               value={phone}
               onChange={setPhone}
               required
             />
           </div>
         </div>
      </div>

      <hr className="border-border/60" />

      {/* Dynamic Role-specific details (Wide and spacious) */}
      <div className="space-y-4 bg-muted/30 border border-border/60 rounded-[12px] p-6 lg:p-8">
        <h3 className="text-sm font-semibold text-foreground mb-4">
           {role === "vendor" ? "Service Offerings" : "Primary Objective"}
        </h3>
        
        {role === "vendor" ? (
          <div>
            <p className="text-sm text-muted-foreground mb-4">Select all services your organization is capable of offering to the network.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {VENDOR_SERVICES.map((service) => (
                <label key={service} className="flex items-center gap-3 p-3 rounded-md border border-border/50 bg-background cursor-pointer hover:border-accent/40 transition-colors">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded-sm border-border text-accent focus:ring-accent accent-accent flex-shrink-0"
                    checked={vendorServices.includes(service)}
                    onChange={(e) => {
                      if (e.target.checked) setVendorServices([...vendorServices, service]);
                      else setVendorServices(vendorServices.filter((s) => s !== service));
                    }}
                  />
                  <span className="text-sm font-medium text-foreground">{service}</span>
                </label>
              ))}
            </div>
          </div>
        ) : (
          <div>
             <p className="text-sm text-muted-foreground mb-4">What brings your organization to Veridian?</p>
             <select
                value={userPurpose}
                onChange={(e) => setUserPurpose(e.target.value)}
                className="w-full p-3.5 rounded-[8px] border border-border bg-background focus:ring-2 focus:ring-accent/40 outline-none text-sm transition-all appearance-none font-medium cursor-pointer shadow-sm"
                required
             >
                <option value="" disabled>Select your primary objective...</option>
                {USER_PURPOSES.map((purpose) => (
                  <option key={purpose} value={purpose}>{purpose}</option>
                ))}
            </select>
          </div>
        )}
      </div>

      <hr className="border-border/60" />

      {/* Security (Passwords Side by side) */}
      <div className="space-y-5">
        <h3 className="text-sm font-semibold text-foreground">Security Setup</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative">
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Choose Password</label>
            <div className="relative">
              <InputWithIcon
                icon={<Lock size={16} />}
                type={showPassword ? "text" : "password"}
                placeholder="Min 6 characters"
                value={password}
                onChange={setPassword}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Confirm Password</label>
             <InputWithIcon
              icon={<Lock size={16} />}
              type={showPassword ? "text" : "password"}
              placeholder="Match password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              required
            />
          </div>
        </div>
      </div>

      <div className="pt-4">
        <button
          type="submit"
          className="w-full bg-foreground text-background py-4 rounded-[8px] font-semibold hover:bg-foreground/90 transition-all active:scale-[0.98] shadow-md text-base"
        >
          Create Enterprise Account
        </button>
      </div>

      <p className="text-center text-sm text-muted-foreground mt-8 pb-8">
        Already have an account?{" "}
        <button type="button" onClick={onSwitchToSignIn} className="text-foreground font-semibold hover:text-accent transition-colors underline underline-offset-4 decoration-border">
          Sign in
        </button>
      </p>
    </form>
  );
}

/* ─── Shared Visual Builders ─── */

function FeatureRow({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center shrink-0 border border-accent/20">
        {icon}
      </div>
      <div>
        <h4 className="font-semibold text-white mb-1.5 text-base">{title}</h4>
        <p className="text-emerald-100/60 leading-relaxed text-sm">{desc}</p>
      </div>
    </div>
  );
}

function InputWithIcon({
  icon,
  type,
  placeholder,
  value,
  onChange,
  required,
}: {
  icon: React.ReactNode;
  type: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <div className="relative">
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">{icon}</span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full pl-11 pr-4 py-3.5 rounded-[8px] border border-border bg-background focus:ring-2 focus:ring-accent/40 outline-none transition-all text-sm shadow-sm placeholder:text-muted-foreground/60"
      />
    </div>
  );
}

function RoleButton({
  icon,
  label,
  description,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`p-5 rounded-[12px] border-2 transition-all flex flex-col items-start text-left w-full relative overflow-hidden group ${
        active
          ? "border-accent bg-emerald-bg/50 shadow-sm"
          : "border-border bg-card hover:border-accent/40 hover:bg-muted/30"
      }`}
    >
      <span className={`inline-block mb-3 p-2 rounded-full ${active ? "bg-accent/20 text-accent" : "bg-secondary text-muted-foreground group-hover:text-foreground"}`}>
        {icon}
      </span>
      <p className={`text-base font-semibold mb-1 ${active ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"}`}>
        {label}
      </p>
      <p className="text-xs text-muted-foreground leading-snug">{description}</p>
      
      {active && (
         <div className="absolute top-4 right-4 text-accent">
           <CheckCircle2 size={18} fill="currentColor" className="text-white" />
         </div>
      )}
    </button>
  );
}

export default AuthPage;
