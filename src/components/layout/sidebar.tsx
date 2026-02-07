"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  Layers,
  FileText,
  Shield,
  Users,
  Box,
  GraduationCap,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Products", href: "/products", icon: Package },
  { name: "Categories", href: "/categories", icon: Layers },
  { name: "Learning Center", href: "/learning", icon: GraduationCap },
  { name: "Regulatory Hub", href: "/regulatory", icon: Shield },
  { name: "Documents", href: "/documents", icon: FileText },
];


const adminNavigation = [
  { name: "User Management", href: "/admin/users", icon: Users },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <div className="flex h-full flex-col border-r border-white/10 bg-background/60 backdrop-blur-xl">
      <div className="flex h-16 items-center border-b border-white/10 px-6">
        <Link href="/dashboard" className="flex items-center gap-3 transition-opacity hover:opacity-80">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20">
            <Box className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight">STYRENICS HUB</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest leading-none">by Versalis</span>
          </div>
        </Link>
      </div>
      <nav className="flex-1 space-y-2 p-4">
        <div className="px-3 pb-2 pt-1">
          <p className="text-[10px] font-bold uppercase text-muted-foreground/60 tracking-wider">
            Menu
          </p>
        </div>
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
              )}
            >
              <item.icon className={cn(
                "h-5 w-5 transition-transform duration-200 group-hover:scale-110",
                isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary"
              )} />
              {item.name}
            </Link>
          );
        })}

        {isAdmin && (
          <div className="mt-8 space-y-2">
            <div className="px-3 pb-2 pt-1">
              <p className="text-[10px] font-bold uppercase text-muted-foreground/60 tracking-wider">
                Admin Settings
              </p>
            </div>
            {adminNavigation.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                      : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                  )}
                >
                  <item.icon className={cn(
                    "h-5 w-5 transition-transform duration-200 group-hover:scale-110",
                    isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary"
                  )} />
                  {item.name}
                </Link>
              );
            })}
          </div>
        )}
      </nav>
      <div className="p-4">
        <div className="rounded-2xl bg-primary/5 border border-primary/10 p-4">
          <p className="text-xs font-semibold text-primary">Need help?</p>
          <p className="mt-1 text-[11px] text-muted-foreground leading-relaxed">
            Contact support for access or technical issues.
          </p>
          <Link href="mailto:support@versalis.it" className="mt-2 block text-[11px] font-bold text-primary hover:underline">
            Get Support &rarr;
          </Link>
        </div>
        <div className="mt-6 px-2 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40">
            Built by <span className="text-muted-foreground/60">Marc Ross</span>
          </p>
          <p className="text-[9px] font-medium text-muted-foreground/30 mt-1 uppercase tracking-widest">
            Sales Styrenics
          </p>
        </div>
      </div>
    </div>
  );
}

