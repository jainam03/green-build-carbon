import React from "react";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DocsSidebar } from "./DocsSidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { Printer, ArrowLeft } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export function DocsLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter(Boolean);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background selection:bg-accent/20">
        <DocsSidebar />
        <SidebarInset className="flex flex-col">
          <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-border/50 px-6 backdrop-blur-md bg-background/80 sticky top-0 z-30">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink asChild>
                      <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">Platform</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="font-semibold text-foreground">Documentation</BreadcrumbPage>
                  </BreadcrumbItem>
                  {pathSegments.length > 1 && (
                    <>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        <BreadcrumbPage className="capitalize opacity-70">
                          {pathSegments[pathSegments.length - 1].replace(/-/g, " ")}
                        </BreadcrumbPage>
                      </BreadcrumbItem>
                    </>
                  )}
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={() => window.print()} 
                className="hidden sm:inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground bg-secondary/50 px-3 py-1.5 rounded-md border border-border/50 transition-all hover:shadow-sm"
              >
                <Printer size={14} /> Print Documentation
              </button>
              <Link to="/dashboard" className="text-xs font-bold text-background bg-foreground hover:bg-foreground/90 px-4 py-2 rounded-md transition-all">
                Go to Dashboard
              </Link>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto px-6 py-10 md:px-12 lg:px-20 max-w-[1000px] w-full mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500">
             {children}

             {/* Footer Navigation */}
             <footer className="mt-20 pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-6 pb-20">
                <p className="text-sm text-muted-foreground font-medium">© 2026 Trace Carbon Intelligence. All rights reserved.</p>
                <div className="flex gap-6 text-xs font-semibold text-muted-foreground">
                  <span className="hover:text-foreground cursor-pointer transition-colors">Privacy</span>
                  <span className="hover:text-foreground cursor-pointer transition-colors">Terms</span>
                  <span className="hover:text-foreground cursor-pointer transition-colors">API Status</span>
                </div>
             </footer>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
