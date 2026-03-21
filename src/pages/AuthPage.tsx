import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
} from "lucide-react";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

type Tab = "signin" | "register";

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState<Tab>("signin");
  const navigate = useNavigate();
  const { signIn, register, isAuthenticated } = useAuth();
  const { toast } = useToast();

  // Redirect if already logged in
  if (isAuthenticated) {
    navigate("/profile", { replace: true });
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Nav */}
      <nav className="flex justify-between items-center px-6 md:px-8 py-5 max-w-7xl mx-auto w-full">
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={16} /> Back to Home
        </button>
        <div className="flex items-center gap-2.5 font-bold text-xl tracking-tighter">
          <div className="w-8 h-8 bg-accent rounded-button flex items-center justify-center text-accent-foreground text-sm font-extrabold">
            V
          </div>
          VERIDIAN
        </div>
      </nav>

      {/* Main */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          className="w-full max-w-md"
        >
          {/* Tabs */}
          <div className="flex mb-8 bg-secondary rounded-button p-1">
            {(["signin", "register"] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2.5 text-sm font-medium rounded-button transition-all ${
                  activeTab === tab
                    ? "bg-card text-foreground shadow-card"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab === "signin" ? "Sign In" : "Register"}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "signin" ? (
              <motion.div
                key="signin"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.25 }}
              >
                <SignInForm
                  onSignIn={(email, password) => {
                    const result = signIn(email, password);
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
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <RegisterForm
                  onRegister={(data) => {
                    const result = register(data);
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
        </motion.div>
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
    <div className="bg-card rounded-card p-8 shadow-elevated border border-border">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-1">Welcome Back</h2>
        <p className="text-sm text-muted-foreground">Sign in to your Veridian account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <InputWithIcon
          icon={<Mail size={16} />}
          type="email"
          placeholder="Email address"
          value={email}
          onChange={setEmail}
          required
        />

        <div className="relative">
          <InputWithIcon
            icon={<Lock size={16} />}
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={setPassword}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-accent text-accent-foreground py-3 rounded-button font-semibold hover:brightness-110 transition-all active:scale-[0.98] shadow-elevated"
        >
          Sign In
        </button>
      </form>

      <p className="text-center text-sm text-muted-foreground mt-6">
        Don't have an account?{" "}
        <button onClick={onSwitchToRegister} className="text-accent font-medium hover:underline">
          Register here
        </button>
      </p>
    </div>
  );
}

/* ─── Register Form ─── */
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
    onRegister({ email, name, password, role, company, phone });
  };

  return (
    <div className="bg-card rounded-card p-8 shadow-elevated border border-border">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-1">Create Account</h2>
        <p className="text-sm text-muted-foreground">Join Veridian as a user or vendor</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Role selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">I am a</label>
          <div className="grid grid-cols-2 gap-3">
            <RoleButton
              icon={<UserCheck size={18} />}
              label="User"
              description="Avail services"
              active={role === "user"}
              onClick={() => setRole("user")}
            />
            <RoleButton
              icon={<Truck size={18} />}
              label="Vendor"
              description="Provide services"
              active={role === "vendor"}
              onClick={() => setRole("vendor")}
            />
          </div>
        </div>

        <InputWithIcon
          icon={<User size={16} />}
          type="text"
          placeholder="Full name"
          value={name}
          onChange={setName}
          required
        />

        <InputWithIcon
          icon={<Mail size={16} />}
          type="email"
          placeholder="Email address"
          value={email}
          onChange={setEmail}
          required
        />

        <InputWithIcon
          icon={<Building2 size={16} />}
          type="text"
          placeholder="Company / Organization"
          value={company}
          onChange={setCompany}
          required
        />

        <InputWithIcon
          icon={<Phone size={16} />}
          type="tel"
          placeholder="Phone number"
          value={phone}
          onChange={setPhone}
          required
        />

        <div className="relative">
          <InputWithIcon
            icon={<Lock size={16} />}
            type={showPassword ? "text" : "password"}
            placeholder="Password (min 6 chars)"
            value={password}
            onChange={setPassword}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        <InputWithIcon
          icon={<Lock size={16} />}
          type={showPassword ? "text" : "password"}
          placeholder="Confirm password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          required
        />

        <button
          type="submit"
          className="w-full bg-accent text-accent-foreground py-3 rounded-button font-semibold hover:brightness-110 transition-all active:scale-[0.98] shadow-elevated"
        >
          Create Account
        </button>
      </form>

      <p className="text-center text-sm text-muted-foreground mt-6">
        Already have an account?{" "}
        <button onClick={onSwitchToSignIn} className="text-accent font-medium hover:underline">
          Sign in
        </button>
      </p>
    </div>
  );
}

/* ─── Helpers ─── */
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
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{icon}</span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full pl-10 pr-4 py-3 rounded-button border border-border bg-background focus:ring-2 focus:ring-accent/40 outline-none transition-all text-sm"
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
      className={`p-3 rounded-card border-2 transition-all text-center ${
        active
          ? "border-accent bg-emerald-bg shadow-card"
          : "border-border bg-background hover:border-muted-foreground/30"
      }`}
    >
      <span className={`inline-block mb-1 ${active ? "text-accent" : "text-muted-foreground"}`}>
        {icon}
      </span>
      <p className={`text-sm font-semibold ${active ? "text-foreground" : "text-muted-foreground"}`}>
        {label}
      </p>
      <p className="text-xs text-muted-foreground">{description}</p>
    </button>
  );
}

export default AuthPage;
