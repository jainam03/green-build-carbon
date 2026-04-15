import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  FileText, 
  BookOpen, 
  Calculator, 
  Truck, 
  BarChart3, 
  ChevronRight,
  Database,
  Recycle,
  Sparkles
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { TraceCarbonLogo } from "@/components/ui/TraceCarbonLogo";

const navItems = [
  {
    title: "Getting Started",
    icon: BookOpen,
    items: [
      { title: "Introduction", href: "/docs" },
      { title: "Platform Philosophy", href: "/docs/philosophy" },
    ],
  },
  {
    title: "Calculation Engine",
    icon: Calculator,
    items: [
      { title: "Core Formulas", href: "/docs/formulas" },
      { title: "Material Mass", href: "/docs/material-mass" },
      { title: "Embodied Carbon Values", href: "/docs/embodied-carbon" },
    ],
  },
  {
    title: "Logistics & Activity",
    icon: Truck,
    items: [
      { title: "Machine Impact", href: "/docs/machine-impact" },
      { title: "Transport Logistics", href: "/docs/transport" },
      { title: "Waste Processing", href: "/docs/processing" },
    ],
  },
  {
    title: "Reporting & Insights",
    icon: BarChart3,
    items: [
      { title: "Projection Engine", href: "/docs/projections" },
      { title: "Recycling Benefits", href: "/docs/recycling" },
      { title: "Data Quality Protocol", href: "/docs/data-quality" },
      { title: "Master Headline Formula", href: "/docs/master-formula" },
    ],
  },
];

export function DocsSidebar() {
  const location = useLocation();

  return (
    <Sidebar variant="inset" className="border-r border-border/50 bg-background/50 backdrop-blur-sm">
      <SidebarHeader className="border-b border-border/50 p-6">
        <Link to="/" className="hover:opacity-80 transition-opacity">
          <TraceCarbonLogo className="scale-90 origin-left" />
        </Link>
      </SidebarHeader>
      <SidebarContent className="p-4">
        {navItems.map((group) => (
          <SidebarGroup key={group.title} className="mb-6">
            <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2 px-2">
              <span className="flex items-center gap-2">
                <group.icon size={14} className="text-accent" />
                {group.title}
              </span>
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        isActive={isActive}
                        className={`transition-all duration-200 hover:bg-secondary/80 ${isActive ? 'bg-secondary font-semibold text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                      >
                        <Link to={item.href} className="flex items-center gap-2 px-2 py-1.5 w-full">
                          <ChevronRight size={12} className={`shrink-0 transition-transform ${isActive ? 'rotate-90' : 'opacity-0'}`} />
                          <span className="truncate">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
