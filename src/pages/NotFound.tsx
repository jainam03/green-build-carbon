import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Home, ArrowLeft, Search, FileQuestion } from "lucide-react";
import { TraceCarbonLogo } from "@/components/ui/TraceCarbonLogo";

/**
 * Nielsen H9: Help users recognize, diagnose, and recover from errors
 * Shneiderman R5: Simple error handling
 * 
 * Upgraded from basic 404 to a helpful recovery page with:
 * - Clear explanation of what happened
 * - Suggested navigation links
 * - Auto-redirect countdown
 * - Consistent design system styling
 */
const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(15);

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  // Auto-redirect countdown (Shneiderman R4: Dialog closure)
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [navigate]);

  const suggestedLinks = [
    { label: "Home", path: "/", icon: Home },
    { label: "Sign In", path: "/auth", icon: ArrowLeft },
    { label: "Dashboard", path: "/dashboard", icon: Search },
  ];

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-md w-full text-center"
      >
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <TraceCarbonLogo />
        </div>

        {/* Error Icon */}
        <div className="w-20 h-20 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-6 border border-border">
          <FileQuestion className="w-10 h-10 text-muted-foreground" />
        </div>

        {/* Error Message */}
        <h1 className="text-5xl font-bold tracking-tight text-foreground mb-3">404</h1>
        <p className="text-lg text-muted-foreground font-medium mb-2">Page not found</p>
        <p className="text-sm text-muted-foreground/70 mb-8 max-w-sm mx-auto leading-relaxed">
          The page <code className="px-1.5 py-0.5 rounded bg-secondary text-foreground text-xs font-mono font-semibold">{location.pathname}</code> doesn't exist or has been moved.
        </p>

        {/* Suggested Links (Nielsen H9: Recovery) */}
        <div className="space-y-2 mb-8">
          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-3">Try one of these instead</p>
          {suggestedLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-card border border-border hover:bg-secondary hover:border-border/80 transition-all text-sm font-semibold text-foreground"
            >
              <link.icon className="w-4 h-4 text-accent" />
              {link.label}
              <span className="ml-auto text-xs text-muted-foreground font-mono">{link.path}</span>
            </button>
          ))}
        </div>

        {/* Auto-redirect countdown */}
        <div className="text-xs text-muted-foreground/60 font-medium">
          Redirecting to home in{" "}
          <span className="tabular-nums font-bold text-muted-foreground">{countdown}s</span>
          <span className="mx-2">·</span>
          <button onClick={() => navigate("/")} className="text-accent hover:underline font-semibold">
            Go now →
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
