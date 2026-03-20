import { motion } from "framer-motion";
import {
  ArrowRight,
  AlertCircle,
  Building2,
  HardHat,
  Gavel,
  Truck,
  Recycle,
  Factory,
  BarChart3,
  SlidersHorizontal,
  ChevronRight,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
  }),
};

interface LandingPageProps {
  onNavigate: () => void;
}

const LandingPage = ({ onNavigate }: LandingPageProps) => (
  <div className="min-h-screen bg-background text-foreground">
    {/* Nav */}
    <nav className="flex justify-between items-center px-6 md:px-8 py-5 max-w-7xl mx-auto">
      <div className="flex items-center gap-2.5 font-bold text-xl tracking-tighter">
        <div className="w-8 h-8 bg-accent rounded-button flex items-center justify-center text-accent-foreground text-sm font-extrabold">
          V
        </div>
        VERIDIAN
      </div>
      <button
        onClick={onNavigate}
        className="px-5 py-2.5 rounded-button text-sm font-medium border border-border bg-card text-foreground hover:bg-secondary transition-colors"
      >
        Sign In
      </button>
    </nav>

    {/* Hero */}
    <section className="max-w-7xl mx-auto px-6 md:px-8 pt-16 md:pt-24 pb-24 md:pb-32 text-center">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.12 } },
        }}
      >
        <motion.h1
          variants={fadeUp}
          custom={0}
          className="text-4xl md:text-6xl font-extrabold tracking-tight mb-5 text-balance leading-[1.08]"
        >
          C&D Waste Carbon{" "}
          <span className="text-accent">Intelligence</span>
        </motion.h1>
        <motion.p
          variants={fadeUp}
          custom={1}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
        >
          Track, measure, and reduce carbon emissions across the construction
          waste lifecycle with ERP-grade precision.
        </motion.p>
        <motion.button
          variants={fadeUp}
          custom={2}
          onClick={onNavigate}
          className="inline-flex items-center gap-2.5 bg-accent text-accent-foreground px-8 py-4 rounded-button text-base font-semibold hover:brightness-110 transition-all active:scale-[0.98] shadow-elevated"
        >
          Calculate Carbon Footprint <ArrowRight size={18} />
        </motion.button>
      </motion.div>
    </section>

    {/* Problems */}
    <section className="bg-card py-20 md:py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-2xl md:text-3xl font-bold text-center mb-12"
        >
          The Problem
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Zero Carbon Tracking",
              desc: "Most construction sites have no visibility into waste-related CO₂ emissions.",
            },
            {
              title: "Fragmented Systems",
              desc: "Logistics, disposal, and material data live in disconnected silos.",
            },
            {
              title: "No Lifecycle Visibility",
              desc: "Rising regulatory pressure demands full lifecycle transparency.",
            },
          ].map((p, i) => (
            <motion.div
              key={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i}
              variants={fadeUp}
              className="bg-background rounded-card p-6 shadow-card border-t-[3px] border-accent"
            >
              <AlertCircle className="mb-4 text-accent" size={22} />
              <h3 className="font-bold text-lg mb-2">{p.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {p.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Stakeholders */}
    <section className="py-20 md:py-24 max-w-7xl mx-auto px-6 md:px-8">
      <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">
        Role-Based Intelligence
      </h2>
      <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
        Tailored views for every stakeholder in the construction lifecycle.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            icon: Building2,
            role: "Builder / Developer",
            tag: "Strategic View",
            desc: "Monitor total project carbon impact and cost-to-emission ratios across portfolios.",
          },
          {
            icon: HardHat,
            role: "Site Supervisor",
            tag: "Operational View",
            desc: "Real-time logging of waste loads, material types, and transport logistics.",
          },
          {
            icon: Gavel,
            role: "Government Authority",
            tag: "Compliance View",
            desc: "Audit-ready reports, regional benchmarking, and sustainability compliance monitoring.",
          },
        ].map((s, i) => (
          <motion.div
            key={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={i}
            variants={fadeUp}
            className="bg-card rounded-card p-6 shadow-card text-center"
          >
            <s.icon className="mx-auto mb-4 text-accent" size={32} />
            <h4 className="font-bold text-base mb-1">{s.role}</h4>
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-4">
              {s.tag}
            </p>
            <p className="text-sm text-muted-foreground">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>

    {/* Workflow */}
    <section className="bg-card py-20 md:py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
          Waste-to-Carbon Workflow
        </h2>
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-0">
          {[
            { icon: Factory, label: "Waste Generation" },
            { icon: Truck, label: "Transport" },
            { icon: Building2, label: "Disposal" },
            { icon: BarChart3, label: "Carbon Calculation" },
          ].map((step, i) => (
            <div key={i} className="flex items-center gap-4">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                variants={fadeUp}
                className="flex flex-col items-center gap-3"
              >
                <div className="w-16 h-16 rounded-card bg-emerald-bg flex items-center justify-center">
                  <step.icon className="text-accent" size={28} />
                </div>
                <span className="text-sm font-medium">{step.label}</span>
              </motion.div>
              {i < 3 && (
                <ChevronRight
                  className="text-muted-foreground hidden md:block"
                  size={20}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Features */}
    <section className="py-20 md:py-24 max-w-7xl mx-auto px-6 md:px-8">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
        Platform Features
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            icon: Building2,
            title: "Role-Based Dashboards",
            desc: "Custom views for developers, supervisors, and authorities.",
          },
          {
            icon: Recycle,
            title: "Lifecycle Tracking",
            desc: "End-to-end tracking from generation to disposal.",
          },
          {
            icon: BarChart3,
            title: "Carbon Visibility",
            desc: "Real-time emissions data across every project stage.",
          },
          {
            icon: SlidersHorizontal,
            title: "Scenario Simulation",
            desc: "Model impact of recycling, distance, and material choices.",
          },
        ].map((f, i) => (
          <motion.div
            key={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={i}
            variants={fadeUp}
            className="bg-card rounded-card p-6 shadow-card"
          >
            <div className="w-10 h-10 rounded-button bg-emerald-bg flex items-center justify-center mb-4">
              <f.icon className="text-accent" size={20} />
            </div>
            <h4 className="font-bold mb-2">{f.title}</h4>
            <p className="text-sm text-muted-foreground">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>

    {/* Final CTA */}
    <section className="bg-emerald-deep py-20 text-center">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          visible: { transition: { staggerChildren: 0.1 } },
        }}
      >
        <motion.h2
          variants={fadeUp}
          custom={0}
          className="text-3xl font-bold mb-3 text-primary-foreground"
        >
          Ready to audit your site?
        </motion.h2>
        <motion.p
          variants={fadeUp}
          custom={1}
          className="text-emerald-light mb-8"
        >
          Start calculating your construction carbon footprint today.
        </motion.p>
        <motion.button
          variants={fadeUp}
          custom={2}
          onClick={onNavigate}
          className="inline-flex items-center gap-2.5 bg-accent text-accent-foreground px-8 py-4 rounded-button text-base font-semibold hover:brightness-110 transition-all active:scale-[0.98]"
        >
          Go to Carbon Dashboard <ArrowRight size={18} />
        </motion.button>
      </motion.div>
    </section>
  </div>
);

export default LandingPage;
