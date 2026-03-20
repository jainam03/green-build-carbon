import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LandingPage from "@/components/LandingPage";
import DashboardPage from "@/components/DashboardPage";

const Index = () => {
  const [page, setPage] = useState<"landing" | "dashboard">("landing");

  return (
    <div className="selection:bg-accent selection:text-accent-foreground">
      <AnimatePresence mode="wait">
        {page === "landing" ? (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <LandingPage onNavigate={() => setPage("dashboard")} />
          </motion.div>
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <DashboardPage onBack={() => setPage("landing")} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
