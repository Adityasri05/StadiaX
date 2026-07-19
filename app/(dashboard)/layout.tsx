"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStadiaStore } from "@/store/useStadiaStore";
import Sidebar from "@/components/sidebar";
import Topbar from "@/components/topbar";
import { Cpu } from "lucide-react";

/**
 * CommandCenterLayout Component
 * Renders the dashboard shell including the global top navigation bar,
 * the operational sidebar, and the main viewport space.
 * Enforces authentication: redirects unauthorized requests to the /auth terminal.
 */
export default function CommandCenterLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const router = useRouter();
  const { user, authLoading } = useStadiaStore();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth");
    }
  }, [user, authLoading, router]);

  if (authLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-screen bg-[#07111F] text-[#F8FAFC]">
        <div className="relative flex flex-col items-center gap-6">
          {/* Glowing scanner/logo */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#00E5FF] to-[#3B82F6] flex items-center justify-center shadow-[0_0_30px_rgba(0,229,255,0.4)] animate-pulse relative overflow-hidden">
            <Cpu className="w-8 h-8 text-[#07111F]" />
            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-[#00E5FF]/40 to-transparent w-full h-1/2 animate-scanline" />
          </div>
          <div className="flex flex-col items-center text-center">
            <span className="font-heading font-bold text-lg tracking-wider text-[#F8FAFC]">
              STADIA<span className="text-[#00E5FF] text-glow">X</span> AI OS
            </span>
            <span className="text-[10px] font-mono text-[#00E5FF]/80 tracking-widest uppercase mt-1 animate-pulse">
              DECRYPTING CREDENTIALS...
            </span>
          </div>
        </div>
      </div>
    );
  }

  // If not logged in, render nothing while redirecting
  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#07111F]">
      <Topbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-grid-pattern relative">
          {children}
        </main>
      </div>
    </div>
  );
}
