import React from "react";
import { useNavigate } from "react-router-dom";
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
  Activity,
  Globe2,
  ShieldCheck,
  Zap,
} from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
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

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-accent/20 selection:text-foreground">
      {/* Precision Enterprise Nav */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex justify-between items-center px-6 md:px-8 py-4 max-w-[1400px] mx-auto">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2.5 font-bold text-xl tracking-tighter">
              <div className="w-7 h-7 bg-foreground rounded-[6px] flex items-center justify-center text-background text-xs font-extrabold shadow-sm">
                V
              </div>
              <span className="text-foreground">VERIDIAN</span>
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
              className="px-5 py-2.5 rounded-[6px] text-sm font-medium bg-foreground text-background hover:bg-foreground/90 transition-all shadow-sm"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Enterprise SaaS Hero */}
      <section className="relative overflow-hidden max-w-[1400px] mx-auto px-6 md:px-8 pt-20 md:pt-32 pb-24 md:pb-36 text-center">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-bg/50 via-background to-background"></div>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          className="max-w-4xl mx-auto"
        >
          <motion.div variants={fadeUp} custom={0} className="mb-6 flex justify-center">
             <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-bg border border-emerald-deep/10 text-xs font-semibold text-emerald-deep tracking-wide uppercase">
                <Globe2 size={14} /> Global standard for C&D waste
             </span>
          </motion.div>
          <motion.h1
            variants={fadeUp}
            custom={1}
            className="text-5xl md:text-7xl font-semibold tracking-tighter mb-6 text-balance leading-[1.05] text-foreground"
          >
            Measure, reduce, and report your{" "}
            <span className="text-accent underline decoration-accent/30 underline-offset-[6px]">carbon impact</span>.
          </motion.h1>
          <motion.p
            variants={fadeUp}
            custom={2}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed font-medium"
          >
            The leading enterprise sustainability platform for construction networks. Turn fragmented logistics and disposal data into audit-ready climate action.
          </motion.p>
          <motion.div variants={fadeUp} custom={3} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate("/auth")}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-accent text-accent-foreground px-8 py-4 rounded-[8px] text-base font-semibold hover:brightness-110 transition-all shadow-sm"
            >
              Start analyzing <ArrowRight size={18} />
            </button>
            <button
              onClick={() => navigate("/auth")}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-card border border-border text-foreground px-8 py-4 rounded-[8px] text-base font-semibold hover:bg-secondary transition-all"
            >
              Explore Dashboard
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* Carbon Dashboard Intro (Inspired by Watershed's deep dives) */}
      <section className="bg-foreground text-background py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            >
              <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-semibold tracking-tight mb-6 leading-tight">
                The Carbon Dashboard:<br/>Your Central Ledger of Truth
              </motion.h2>
              <motion.p variants={fadeUp} className="text-background/70 text-lg mb-8 leading-relaxed">
                Veridian’s flagship Carbon Dashboard is the operational center for structural footprint analysis. Engineered for developers and authorities, it calculates site-specific emissions down to the logistics level.
              </motion.p>
              
              <ul className="space-y-6">
                {[
                  { icon: Activity, title: "Real-time Footprint Tracking", desc: "Monitor Scope 3 emissions as waste is generated, sorted, and transported in real-time." },
                  { icon: SlidersHorizontal, title: "Dynamic Scenario Modeling", desc: "Instantly see how altering disposal distance or boosting recycling rates impacts your net tonnage." },
                  { icon: ShieldCheck, title: "Audit-Ready Exporting", desc: "Ensure compliance with regional environmental regulations using transparent, traceable calculation formulas." },
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

            {/* Dashboard Mockup Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true }}
              className="relative rounded-[16px] overflow-hidden shadow-2xl border border-background/10 bg-background/5"
            >
              <div className="aspect-[4/3] bg-gradient-to-br from-emerald-deep to-[#051a14] p-8 flex flex-col justify-between">
                 <div className="flex justify-between items-center opacity-50">
                   <div className="w-32 h-4 bg-background/20 rounded-full" />
                   <div className="w-16 h-4 bg-background/20 rounded-full" />
                 </div>
                 <div className="text-center">
                   <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-4">Estimated Total Emissions</p>
                   <p className="text-8xl font-bold tracking-tighter text-background">36.85</p>
                   <p className="text-xl text-background/60 mt-2">Tons CO₂e</p>
                 </div>
                 <div className="grid grid-cols-3 gap-4 border-t border-background/10 pt-6">
                    <div className="h-2 bg-accent rounded-full w-full" />
                    <div className="h-2 bg-emerald-vibrant rounded-full w-full opacity-60" />
                    <div className="h-2 bg-emerald-light rounded-full w-full opacity-30" />
                 </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Role-Based Solutions */}
      <section className="py-24 md:py-32 max-w-[1400px] mx-auto px-6 md:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-5 text-foreground">
            A united platform for every stakeholder
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Sustainability isn't solved in silos. Veridian connects the entire C&D ecosystem—from site supervisors to recycling vendors.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Building2,
              role: "Builders & Developers",
              desc: "De-risk portfolios by tracking aggregate carbon profiles across dozens of concurrent construction sites.",
            },
            {
              icon: Truck,
              role: "Logistics & Vendors",
              desc: "Provide verifiable green services. Register as a certified vendor and integrate directly into developer workflows.",
            },
            {
              icon: Gavel,
              role: "Authorities",
              desc: "Access aggregated compliance reports, benchmark regional sustainability, and enforce greener building codes.",
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
              <p className="text-muted-foreground leading-relaxed">
                {s.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Platform Features Grid */}
      <section className="bg-secondary/50 py-24 md:py-32 border-y border-border">
        <div className="max-w-[1400px] mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
             <div>
               <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-6">
                 Rigorous data.<br/>Real outcomes.
               </h2>
               <p className="text-muted-foreground text-lg mb-8 leading-relaxed max-w-md">
                 Our proprietary Life Cycle Assessment (LCA) engine translates raw logistics inputs into granular, actionable carbon intelligence.
               </p>
               <button onClick={() => navigate("/auth")} className="inline-flex items-center gap-2 text-foreground font-semibold border-b border-foreground pb-1 hover:text-accent hover:border-accent transition-colors">
                  Explore methodology <ArrowRight size={16} />
               </button>
             </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-12">
               {[
                  { icon: Factory, title: "Waste Generation", desc: "Track RCC, framing, and masonry tonnage as demolition begins." },
                  { icon: Zap, title: "Machinery Impact", desc: "Capture footprint metrics from fuel loads on heavy site machinery." },
                  { icon: BarChart3, title: "Distance Algorithms", desc: "Calculate exact transport footprints mapped to disposal distances." },
                  { icon: Recycle, title: "Recycling Credits", desc: "Automatically subtract salvaged material from your gross emissions." },
               ].map((f, i) => (
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

      {/* Final CTA */}
      <section className="bg-background py-32 text-center border-b border-border">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            visible: { transition: { staggerChildren: 0.1 } },
          }}
          className="max-w-3xl mx-auto px-6"
        >
          <motion.h2
            variants={fadeUp}
            custom={0}
            className="text-4xl md:text-5xl font-semibold tracking-tight mb-6 text-foreground"
          >
            Let’s get to work.
          </motion.h2>
          <motion.p
            variants={fadeUp}
            custom={1}
            className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto leading-relaxed"
          >
            Join the developers, contractors, and vendors leading the shift toward a net-zero construction economy.
          </motion.p>
          <motion.button
            variants={fadeUp}
            custom={2}
            onClick={() => navigate("/auth")}
            className="inline-flex items-center gap-2.5 bg-foreground text-background px-10 py-4 rounded-[8px] text-base font-semibold hover:bg-foreground/90 transition-all shadow-md"
          >
            Sign up for Veridian <ArrowRight size={18} />
          </motion.button>
        </motion.div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 px-6 md:px-8 max-w-[1400px] mx-auto text-sm text-muted-foreground flex flex-col md:flex-row justify-between items-center gap-4">
        <p>© 2026 Veridian Carbon Intelligence. All rights reserved.</p>
        <div className="flex gap-6">
           <span className="hover:text-foreground cursor-pointer transition-colors">Privacy Policy</span>
           <span className="hover:text-foreground cursor-pointer transition-colors">Terms of Service</span>
           <span className="hover:text-foreground cursor-pointer transition-colors">System Status</span>
        </div>
      </footer>
    </div>
  );
};

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
                    href="/"
                  >
                    <div className="w-8 h-8 bg-foreground rounded-[6px] flex items-center justify-center text-background text-xs font-extrabold shadow-sm mb-4">
                      V
                    </div>
                    <div className="mb-2 mt-4 text-lg font-semibold tracking-tight">
                      Carbon Dashboard
                    </div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      The premier operational tool for C&D waste emissions analysis.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <ListItem href="/" title="Methodology">
                LCA algorithms and formulas explained.
              </ListItem>
              <ListItem href="/" title="Vendor Integration">
                How waste management vendors plug into Veridian.
              </ListItem>
              <ListItem href="/" title="Compliance Exports">
                Generate localized audit-ready green reports.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Solutions Menu */}
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent text-foreground/80 hover:text-foreground font-medium text-sm data-[active]:bg-secondary/50 data-[state=open]:bg-secondary/50">Solutions</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-popover shadow-elevated border-border">
              {solutions.map((solution) => (
                <ListItem
                  key={solution.title}
                  title={solution.title}
                  href={solution.href}
                >
                  {solution.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Resources Link */}
        <NavigationMenuItem>
           <a href="/" className="inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary/50 hover:text-foreground text-foreground/80 focus:bg-secondary/50 focus:text-accent-foreground outline-none">
             Resources
           </a>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

const solutions = [
  {
    title: "For Developers",
    href: "/",
    description: "Manage footprint limits across multiple concurrent sites.",
  },
  {
    title: "For Logistics Partners",
    href: "/",
    description: "Connect APIs to transmit distance and vehicle fuel data.",
  },
  {
    title: "For Authorities",
    href: "/",
    description: "Review comprehensive regulatory checks for civil permits.",
  },
  {
    title: "Green Certifications",
    href: "/",
    description: "Pathways to achieve LEED credits via waste diversion.",
  },
];

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
