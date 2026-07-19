"use client";

import React, { useMemo, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStadiaStore } from "@/store/useStadiaStore";
import {
  LayoutDashboard,
  ShieldAlert,
  MessageSquareCode,
  Map,
  Cpu,
  Users,
  Train,
  Eye,
  HeartHandshake,
  Settings2,
  Store,
  Accessibility,
  Leaf,
  LineChart,
  FileText,
  Settings,
} from "lucide-react";

/**
 * Sidebar component displaying the navigation items of the StadiaX AI cockpit.
 * Leverages React.memo, useMemo, and useCallback to optimize re-renders and memory efficiency.
 */
function SidebarComponent() {
  const pathname = usePathname();
  const incidents = useStadiaStore((state) => state.incidents);

  // Group active incidents by category
  const activeIncidents = useMemo(() => {
    return incidents.filter((i) => i.status !== "Resolved");
  }, [incidents]);

  const countByCategory = useCallback((cat: string) => {
    return activeIncidents.filter((i) => i.category.toLowerCase() === cat.toLowerCase()).length;
  }, [activeIncidents]);

  const navItems = useMemo(() => [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Mission Control", href: "/mission-control", icon: ShieldAlert, highlight: true },
    { label: "AI Fan Concierge", href: "/concierge", icon: MessageSquareCode },
    { label: "Live Stadium Map", href: "/map", icon: Map },
    { label: "Digital Twin", href: "/digital-twin", icon: Cpu },
    { label: "Crowd Intelligence", href: "/crowd", icon: Users, badge: countByCategory("Crowd") },
    { label: "Transportation AI", href: "/transit", icon: Train, badge: countByCategory("Transit") },
    { label: "Security Command", href: "/security", icon: Eye, badge: countByCategory("Security") },
    { label: "Volunteer Hub", href: "/volunteers", icon: HeartHandshake },
    { label: "Operations Center", href: "/operations", icon: Settings2, badge: countByCategory("Operations") },
    { label: "Vendor Intelligence", href: "/vendors", icon: Store, badge: countByCategory("Vendor") },
    { label: "Accessibility AI", href: "/accessibility", icon: Accessibility, badge: countByCategory("Accessibility") },
    { label: "Sustainability", href: "/sustainability", icon: Leaf },
    { label: "Analytics", href: "/analytics", icon: LineChart },
    { label: "Reports", href: "/reports", icon: FileText },
    { label: "Settings", href: "/settings", icon: Settings },
  ], [countByCategory]);

  return (
    <aside className="w-64 bg-glass border-r border-[rgba(248,250,252,0.05)] h-[calc(100vh-4rem)] flex flex-col overflow-y-auto custom-scrollbar shrink-0 select-none z-10">
      <div className="flex-1 py-4 px-3 space-y-1">
        <div className="px-3 mb-2 text-xs font-semibold text-[#94A3B8] tracking-widest uppercase font-sans">
          Operations cockpit
        </div>
        
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all duration-200 group relative ${
                isActive
                  ? "bg-[rgba(0,229,255,0.07)] text-[#00E5FF] font-medium border-l-2 border-[#00E5FF] shadow-[inset_4px_0_12px_rgba(0,229,255,0.05)]"
                  : "text-[#94A3B8] hover:bg-[rgba(248,250,252,0.03)] hover:text-[#F8FAFC]"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-all duration-200 ${
                    isActive ? "text-[#00E5FF]" : "text-[#94A3B8] group-hover:text-[#F8FAFC]"
                  } ${item.highlight ? "animate-pulse text-[#FF4D6D] group-hover:text-[#FF4D6D]" : ""}`}
                />
                <span className={`font-sans tracking-wide ${item.highlight ? "text-[#FF4D6D] font-semibold" : ""}`}>
                  {item.label}
                </span>
              </div>
              
              {/* Badge indicating active alerts */}
              {item.badge !== undefined && item.badge > 0 ? (
                <span className={`px-1.5 py-0.5 text-[10px] font-bold font-mono rounded ${
                  item.label === "Security Command" 
                    ? "bg-[#FF4D6D] text-white animate-pulse" 
                    : "bg-[#FACC15] text-[#07111F]"
                }`}>
                  {item.badge}
                </span>
              ) : null}

              {/* Cyan light indicator on active menu item hover */}
              {isActive && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#00E5FF] shadow-[0_0_8px_#00E5FF] mr-2" />
              )}
            </Link>
          );
        })}
      </div>
      
      {/* Footer System Telemetry Status */}
      <div className="p-4 border-t border-[rgba(248,250,252,0.05)] bg-[rgba(16,28,45,0.4)]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-[#94A3B8] font-mono">SYSTEM COGNITION</span>
          <span className="text-[10px] bg-[#00D084] text-[#07111F] px-1.5 py-0.5 rounded font-bold font-mono">
            NOMINAL
          </span>
        </div>
        <div className="w-full bg-[rgba(248,250,252,0.05)] h-1 rounded-full overflow-hidden">
          <div className="bg-[#00E5FF] h-full w-[94%] shadow-[0_0_8px_#00E5FF]" />
        </div>
      </div>
    </aside>
  );
}

export const Sidebar = React.memo(SidebarComponent);
export default Sidebar;
