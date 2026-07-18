"use client";

import { useState } from "react";
import { useStadiaStore } from "@/store/useStadiaStore";
import {
  Accessibility,
  Eye,
  Sliders,
  Check,
  AlertTriangle,
  HelpCircle,
  Clock,
  Compass,
  Zap,
  Ear
} from "lucide-react";
import toast from "react-hot-toast";

interface EscortRequest {
  id: string;
  name: string;
  from: string;
  to: string;
  status: "Pending" | "Escorted" | "Complete";
}

export default function AccessibilityPage() {
  const { incidents } = useStadiaStore();
  const [escorts, setEscorts] = useState<EscortRequest[]>([
    { id: "esc-1", name: "Guest #891 (Wheelchair)", from: "Gate 4 Entrance", to: "Sector 204 accessible stand", status: "Pending" },
    { id: "esc-2", name: "Guest #904 (Visual Aid)", from: "Gate 2 Ticketing", to: "Sector 108 Row D", status: "Escorted" },
    { id: "esc-3", name: "Guest #421 (Senior Assist)", from: "Metro East exit ramp", to: "Sector 112 stand", status: "Pending" }
  ]);

  const elevators = [
    { name: "Elevator B-3 (Main Stand)", status: "Offline", error: "Hydraulic pressure drops" },
    { name: "Elevator B-4 (South)", status: "Nominal", error: "" },
    { name: "North Lift Concourse 1", status: "Nominal", error: "" },
    { name: "South Lift Concourse 2", status: "Nominal", error: "" }
  ];

  const handleDispatchEscort = (id: string, guest: string) => {
    setEscorts(prev => prev.map(esc => 
      esc.id === id ? { ...esc, status: "Escorted" } : esc
    ));
    toast.success(`Volunteer dispatched to escort ${guest}.`, {
      icon: "👥"
    });
  };

  const elevatorOutageActive = incidents.some(
    i => i.category === "Accessibility" && i.status !== "Resolved"
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[rgba(248,250,252,0.05)]">
        <div>
          <h1 className="font-heading font-bold text-xl text-white tracking-wide flex items-center gap-2">
            <Accessibility className="w-5.5 h-5.5 text-[#00E5FF] animate-pulse" />
            ACCESSIBILITY SERVICE CENTER
          </h1>
          <p className="text-xs text-[#94A3B8] font-mono mt-0.5">
            STEP-FREE ROUTING CONTROLS // ASSISTIVE AUDIO/VISUAL SERVICES
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Column: Elevator & Facility Status Board */}
        <div className="xl:col-span-1 bg-glass-card border border-[rgba(0,229,255,0.1)] rounded-xl flex flex-col overflow-hidden h-[500px]">
          <div className="p-4 bg-[rgba(16,28,45,0.8)] border-b border-[rgba(248,250,252,0.05)] flex items-center gap-2 shrink-0">
            <Compass className="w-4 h-4 text-[#00E5FF]" />
            <h3 className="font-heading font-bold text-sm text-white">Lift & Ramp Status</h3>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-3.5 space-y-3 font-mono text-xs text-[#94A3B8]">
            {elevators.map((elv, idx) => (
              <div key={idx} className="p-3 bg-[rgba(16,28,45,0.4)] border border-white/5 rounded-lg space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-white font-sans">{elv.name}</span>
                  <span className={`px-2 py-0.5 rounded text-[8px] font-bold ${
                    elv.status === "Nominal" 
                      ? "bg-[#00D084]/15 text-[#00D084]" 
                      : "bg-[#FF4D6D]/15 text-[#FF4D6D] animate-pulse"
                  }`}>
                    {elv.status.toUpperCase()}
                  </span>
                </div>
                {elv.error && (
                  <p className="text-[10px] text-[#FF4D6D] bg-[#FF4D6D]/5 p-1 rounded border border-[#FF4D6D]/10">
                    Warning: {elv.error}
                  </p>
                )}
              </div>
            ))}

            <div className="pt-3 border-t border-[rgba(248,250,252,0.05)] space-y-2">
              <span className="text-[10px] text-[#00E5FF]">AID EQUIPMENT STOCK</span>
              <div className="flex justify-between items-center">
                <span>Audio Description Receivers:</span>
                <span className="text-white font-bold">14 / 80 available</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Wheelchair loan units:</span>
                <span className="text-white font-bold">5 / 30 available</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center Column: Escort Dispatch Queue */}
        <div className="xl:col-span-1 bg-glass-card border border-[rgba(0,229,255,0.1)] rounded-xl flex flex-col overflow-hidden h-[500px]">
          <div className="p-4 bg-[rgba(16,28,45,0.8)] border-b border-[rgba(248,250,252,0.05)] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <Accessibility className="w-4 h-4 text-[#FACC15]" />
              <h3 className="font-heading font-bold text-sm text-white">Escort Requests</h3>
            </div>
            <span className="text-[10px] font-mono text-[#FACC15] animate-pulse">● ACTIVE DISPATCH</span>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-3">
            {escorts.map((esc) => (
              <div
                key={esc.id}
                className={`p-3 rounded-lg border space-y-2.5 ${
                  esc.status === "Escorted"
                    ? "bg-[rgba(59,130,246,0.02)] border-[#3B82F6]/20"
                    : "bg-[rgba(19,34,56,0.3)] border-white/5"
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-white font-sans">{esc.name}</span>
                  <span className="text-[9px] font-mono text-[#94A3B8]">OS #ACC-94</span>
                </div>
                
                <div className="text-[10px] font-mono text-[#94A3B8] space-y-1">
                  <div>From: <strong className="text-white">{esc.from}</strong></div>
                  <div>To: <strong className="text-white">{esc.to}</strong></div>
                </div>

                {esc.status === "Pending" ? (
                  <button
                    onClick={() => handleDispatchEscort(esc.id, esc.name)}
                    className="w-full py-1 rounded bg-[#00E5FF] text-[#07111F] text-[10px] font-mono font-bold hover:brightness-110 transition-all"
                  >
                    DISPATCH VOLUNTEER ASSIST
                  </button>
                ) : (
                  <div className="text-[10px] font-mono font-bold text-[#00D084] flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> STAFF DISPATCHED
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: AI Accessibility Assistant */}
        <div className="xl:col-span-1 bg-glass-card border border-[rgba(0,229,255,0.1)] p-4 rounded-xl flex flex-col justify-between h-[500px]">
          <div className="space-y-4">
            <h3 className="font-heading font-bold text-sm text-[#00E5FF] flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#00E5FF] animate-pulse" />
              AI Accessibility Assistant
            </h3>

            {elevatorOutageActive ? (
              <div className="bg-[#FF4D6D]/10 border border-[#FF4D6D]/30 p-3.5 rounded-lg space-y-2.5">
                <div className="flex gap-2 items-center text-[10px] font-mono text-[#FF4D6D] font-bold">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>ELEVATOR B-3 OUTAGE REDIRECT</span>
                </div>
                <p className="text-xs text-white leading-relaxed">
                  Elevator B-3 blockage is active. Automated concourse signages have been updated to direct wheelchair guests via South Ramp 3 to the lower concourse, bypassing the blockage.
                </p>
                <div className="text-[9px] font-mono text-[#94A3B8] border-t border-[rgba(248,250,252,0.05)] pt-2.5">
                  Action status: <strong className="text-[#00D084]">Active Signage Override</strong>
                </div>
              </div>
            ) : (
              <div className="bg-[#00D084]/10 border border-[#00D084]/20 p-3.5 rounded-lg space-y-2.5">
                <div className="flex gap-2 items-center text-[10px] font-mono text-[#00D084] font-bold">
                  <Check className="w-3.5 h-3.5" />
                  <span>SYSTEM NORMAL</span>
                </div>
                <p className="text-xs text-white leading-relaxed">
                  All elevator nodes are sync-locked. Stroller parking, nursing rooms, and companion restrooms report nominal status.
                </p>
              </div>
            )}

            <div className="bg-[rgba(7,17,31,0.4)] border border-white/5 p-3 rounded-lg space-y-2 font-mono text-[10px]">
              <span className="text-[#00E5FF]">SERVICE CHANNELS STATUS</span>
              <div className="flex justify-between">
                <span>Loop Induction systems:</span>
                <span className="text-[#00D084] font-bold">100% ONLINE</span>
              </div>
              <div className="flex justify-between">
                <span>Sensory Room occupancy:</span>
                <span className="text-white">45% (Nominal)</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => toast.success("Accessibility warning alert pushed to concourse monitors.")}
              className="w-full py-2.5 rounded bg-[rgba(248,250,252,0.05)] border border-white/5 text-white text-xs font-mono hover:bg-[rgba(248,250,252,0.1)] transition-all flex items-center justify-center gap-1.5"
            >
              BROADCAST PATH OVERRIDES <Compass className="w-4 h-4 text-[#94A3B8]" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
