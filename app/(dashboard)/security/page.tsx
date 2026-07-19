"use client";

import { useState } from "react";
import { useStadiaStore } from "@/store/useStadiaStore";
import {
  Eye,
  AlertTriangle,
  Radio,
  Volume2,
  Video,
  Shield,
  Activity,
  Send,
  Languages
} from "lucide-react";
import toast from "react-hot-toast";

export default function SecurityPage() {
  const { incidents, resolveIncident, simulationMode, setSimulationMode } = useStadiaStore();
  const [customAnnouncement, setCustomAnnouncement] = useState("");
  const [activeCam, setActiveCam] = useState<string>("CAM-04");

  const cameras = [
    { id: "CAM-04", name: "CCTV - Gate 4 Security", desc: "Density: 92% - Queue overflow", status: "Critical" },
    { id: "CAM-08", name: "CCTV - Gate 8 Perimeter", desc: "Object check active - K9 sweep", status: "Alerting" },
    { id: "CAM-108", name: "CCTV - Sector 108 Stand", desc: "Crowd density: 64% - Stable", status: "Nominal" },
    { id: "CAM-204", name: "CCTV - Elevator B-3 Lift", desc: "Elevator blockage corridor", status: "Warning" }
  ];

  const handleEvacTrigger = () => {
    if (simulationMode === "Evacuation") {
      setSimulationMode("Normal");
      toast.success("Emergency lockdown deactivated. Concourse normal.");
    } else {
      setSimulationMode("Evacuation");
      toast.error("LOCKDOWN ENGAGED: Broadcasting emergency evacuation to all terminals!", { duration: 5000 });
    }
  };

  const handleBroadcastAnnouncement = (text: string) => {
    if (!text.trim()) return;
    toast.success(`Stadium Broadcast Engaged in 4 languages: "${text}"`, {
      icon: "📢",
      duration: 5000
    });
    setCustomAnnouncement("");
  };

  const loadTemplate = (tpl: string) => {
    setCustomAnnouncement(tpl);
  };

  const activeSecurityIncidents = incidents.filter(
    (i) => i.status !== "Resolved" && (i.category === "Security" || i.category === "Crowd")
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[rgba(248,250,252,0.05)]">
        <div>
          <h1 className="font-heading font-bold text-xl text-white tracking-wide flex items-center gap-2">
            <Eye className="w-5.5 h-5.5 text-[#FF4D6D] animate-pulse" />
            SECURITY COMMAND COCKPIT
          </h1>
          <p className="text-xs text-[#94A3B8] font-mono mt-0.5">
            SURVEILLANCE CAMERA MATRIX // HIGH-LEVEL PROTOCOL DISPATCHER
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Column: Surveillance CCTV Grid */}
        <div className="xl:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-sm text-white flex items-center gap-2">
              <Video className="w-4 h-4 text-[#00E5FF]" />
              Surveillance Camera Matrix
            </h3>
            <span className="text-[10px] font-mono text-[#00E5FF] animate-pulse">● CCTV MULTI-CAST ENCRYPTED</span>
          </div>

          {/* 2x2 CCTV Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cameras.map((cam) => (
              <div
                key={cam.id}
                onClick={() => setActiveCam(cam.id)}
                className={`relative h-56 rounded-xl border overflow-hidden cursor-pointer transition-all bg-[#0a0f1d] ${
                  activeCam === cam.id
                    ? "border-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.15)]"
                    : "border-white/5 hover:border-[#00E5FF]/40"
                }`}
              >
                {/* Simulated CCTV Static/Scanning Line Overlay */}
                <div className="absolute inset-0 bg-dot-pattern opacity-10 pointer-events-none" />
                <div className="absolute inset-x-0 top-0 h-[1.5px] bg-[#00E5FF] opacity-15 animate-scanline pointer-events-none" />
                
                {/* Camera Feed Watermark */}
                <div className="absolute top-3 left-3 bg-black/60 px-2 py-0.5 rounded text-[9px] font-mono text-white flex items-center gap-1.5 z-10">
                  <span className={`w-1.5 h-1.5 rounded-full ${cam.status === "Critical" || cam.status === "Alerting" ? "bg-[#FF4D6D] animate-ping" : "bg-[#00D084]"}`} />
                  {cam.id} {"// REC"}
                </div>

                <div className="absolute top-3 right-3 bg-black/60 px-2 py-0.5 rounded text-[9px] font-mono text-[#94A3B8] z-10">
                  14:44:12 UTC
                </div>

                {/* Simulated Wireframe/Vector Video Feed */}
                <div className="h-full w-full flex items-center justify-center relative">
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3.5 space-y-0.5">
                    <p className="text-xs font-heading font-bold text-white leading-none">{cam.name}</p>
                    <p className="text-[10px] text-[#94A3B8] font-mono">{cam.desc}</p>
                  </div>

                  {/* Wireframe Stadium Ring Graphics */}
                  <svg viewBox="0 0 100 100" className="w-24 h-24 opacity-30 text-[#3B82F6]">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3,3" />
                    <circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" strokeWidth="0.5" />
                    <line x1="50" y1="10" x2="50" y2="90" stroke="currentColor" strokeWidth="0.2" />
                    <line x1="10" y1="50" x2="90" y2="50" stroke="currentColor" strokeWidth="0.2" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: PA Broadcast & Evacuation Dispatcher */}
        <div className="xl:col-span-1 space-y-6">
          {/* Evacuation dispatch card */}
          <div className="bg-glass-card border border-[#FF4D6D]/30 p-4 rounded-xl space-y-4 shadow-[0_0_15px_rgba(255,77,109,0.05)]">
            <h3 className="font-heading font-bold text-sm text-[#FF4D6D] flex items-center gap-2">
              <AlertTriangle className="w-4.5 h-4.5 animate-bounce" />
              Evacuation Control Override
            </h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Activating stadium evacuation overrides digital signage screens, opens all 24 perimeter gates, flashes emergency LED exit lights, and engages PA audio warnings.
            </p>
            <button
              onClick={handleEvacTrigger}
              className={`w-full py-2.5 rounded text-xs font-mono font-bold tracking-wider transition-all duration-300 ${
                simulationMode === "Evacuation"
                  ? "bg-[#00D084] text-[#07111F] hover:brightness-110 shadow-[0_0_15px_rgba(0,208,132,0.3)]"
                  : "bg-[#FF4D6D] text-white hover:brightness-110 shadow-[0_0_15px_rgba(255,77,109,0.25)]"
              }`}
            >
              {simulationMode === "Evacuation" ? "DEACTIVATE EVAC LOCKDOWN" : "INITIATE EVAC OVERRIDE"}
            </button>
          </div>

          {/* PA Broadcast Board */}
          <div className="bg-glass-card border border-[rgba(0,229,255,0.1)] p-4 rounded-xl flex flex-col justify-between gap-4 h-[280px]">
            <div className="space-y-3">
              <h3 className="font-heading font-bold text-sm text-white flex items-center gap-2">
                <Volume2 className="w-4.5 h-4.5 text-[#00E5FF]" />
                PA Announcement Generator
              </h3>
              
              <div className="flex gap-1.5 flex-wrap select-none">
                <button
                  onClick={() => loadTemplate("Attention: Gate 4 queue is congested. Please redirect to Gate 6.")}
                  className="px-2 py-0.5 bg-[#101C2D] border border-white/5 rounded text-[10px] text-[#94A3B8] hover:border-[#00E5FF]/40 hover:text-white"
                >
                  Gate 4 Bypass
                </button>
                <button
                  onClick={() => loadTemplate("Elevator B-3 is offline. Wheelchair route redirected to lift B-4.")}
                  className="px-2 py-0.5 bg-[#101C2D] border border-white/5 rounded text-[10px] text-[#94A3B8] hover:border-[#00E5FF]/40 hover:text-white"
                >
                  Accessibility
                </button>
                <button
                  onClick={() => loadTemplate("Security Alert: Standard checks active. Keep bags with you.")}
                  className="px-2 py-0.5 bg-[#101C2D] border border-white/5 rounded text-[10px] text-[#94A3B8] hover:border-[#00E5FF]/40 hover:text-white"
                >
                  Bag Alert
                </button>
              </div>

              <textarea
                placeholder="Type safety alert message..."
                value={customAnnouncement}
                onChange={(e) => setCustomAnnouncement(e.target.value)}
                className="w-full h-24 p-2 bg-[rgba(7,17,31,0.5)] border border-[rgba(248,250,252,0.08)] focus:border-[#00E5FF] text-[11px] rounded outline-none text-white resize-none font-sans leading-normal"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleBroadcastAnnouncement(customAnnouncement)}
                disabled={!customAnnouncement.trim()}
                className="flex-1 py-2 rounded bg-[#00E5FF] text-[#07111F] text-[10px] font-mono font-bold hover:brightness-110 disabled:opacity-50 disabled:pointer-events-none transition-all flex items-center justify-center gap-1"
              >
                <Send className="w-3 h-3" /> BROADCAST STADIUM
              </button>
              <button
                type="button"
                onClick={() => toast("AI translated draft into: Spanish, French, Arabic.")}
                disabled={!customAnnouncement.trim()}
                className="px-3 rounded bg-[rgba(248,250,252,0.05)] border border-white/5 text-[#94A3B8] hover:text-white hover:bg-[rgba(248,250,252,0.1)] transition-all flex items-center justify-center"
              >
                <Languages className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
