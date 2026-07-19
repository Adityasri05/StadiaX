"use client";

import { useState } from "react";


import {
  HeartHandshake,
  UserCheck,
  MapPin,
  Clock,
  MessageSquare,
  AlertTriangle,
  Send,
  Languages,
  Accessibility
} from "lucide-react";
import toast from "react-hot-toast";

interface VolunteerRequest {
  id: string;
  type: "Language" | "Medical Support" | "Accessibility" | "General";
  desc: string;
  location: string;
  time: string;
  status: "Pending" | "Dispatched" | "Complete";
}

export default function VolunteerHubPage() {
  const [requests, setRequests] = useState<VolunteerRequest[]>([
    { id: "req-1", type: "Language", desc: "Spanish translation assistance needed for VIP ticketing", location: "Sector 104 Entrance", time: "14:42", status: "Pending" },
    { id: "req-2", type: "Medical Support", desc: "Support medical M-4 with cooling hydration packs", location: "Sector 112 Row F", time: "14:44", status: "Dispatched" },
    { id: "req-3", type: "Accessibility", desc: "Escort wheelchair guest around Elevator B-3 outage", location: "Sector 204 Lift Corridor", time: "14:43", status: "Pending" },
    { id: "req-4", type: "General", desc: "Distribute waste bags at concession gate exit", location: "Gate 6 Exit Area", time: "14:40", status: "Complete" }
  ]);

  const [aiMessage, setAiMessage] = useState("");

  const teams = [
    { name: "Volunteer Team A", members: 12, location: "Sector 108", status: "Active", task: "Directing crowd flow gates" },
    { name: "Volunteer Team B", members: 8, location: "Gate 4", status: "Active", task: "Assisting queue divisions" },
    { name: "Volunteer Team C", members: 15, location: "Standby Bay A", status: "Standby", task: "Awaiting incident dispatch" },
    { name: "Volunteer Team D", members: 6, location: "Sector 204", status: "Active", task: "Escorting accessibility guests" }
  ];

  const handleDispatch = (requestId: string, teamName: string) => {
    setRequests(prev => prev.map(req => 
      req.id === requestId ? { ...req, status: "Dispatched" } : req
    ));
    toast.success(`Dispatched ${teamName} to handle request.`, {
      icon: "👥"
    });
  };

  const handleBroadcastToAll = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiMessage.trim()) return;

    toast.success(`Message sent to all 41 volunteer terminals: "${aiMessage}"`, {
      icon: "🛰️"
    });
    setAiMessage("");
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[rgba(248,250,252,0.05)]">
        <div>
          <h1 className="font-heading font-bold text-xl text-white tracking-wide flex items-center gap-2">
            <HeartHandshake className="w-5.5 h-5.5 text-[#00D084]" />
            VOLUNTEER COMMAND CENTER
          </h1>
          <p className="text-xs text-[#94A3B8] font-mono mt-0.5">
            STAFF ALLOCATION INDEX // LIVE VISITOR ASSISTANCE DISPATCH
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Column: Volunteer Teams Index */}
        <div className="xl:col-span-1 bg-glass-card border border-[rgba(0,229,255,0.1)] rounded-xl flex flex-col overflow-hidden h-[500px]">
          <div className="p-4 bg-[rgba(16,28,45,0.8)] border-b border-[rgba(248,250,252,0.05)] flex items-center gap-2 shrink-0">
            <UserCheck className="w-4 h-4 text-[#00E5FF]" />
            <h3 className="font-heading font-bold text-sm text-white">Active Teams Index</h3>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-3">
            {teams.map((team, idx) => (
              <div key={idx} className="p-3 bg-[rgba(19,34,56,0.3)] border border-white/5 rounded-lg space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-white font-sans">{team.name}</span>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold font-mono ${
                    team.status === "Active" 
                      ? "bg-[#00D084]/15 text-[#00D084]" 
                      : "bg-[#3B82F6]/15 text-[#3B82F6]"
                  }`}>
                    {team.status.toUpperCase()}
                  </span>
                </div>
                
                <div className="space-y-1.5 font-mono text-[10px] text-[#94A3B8]">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#00E5FF]" />
                    <span>Sector: {team.location} ({team.members} crew)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#94A3B8]" />
                    <span>Task: {team.task}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Center Column: Live Assistance Requests */}
        <div className="xl:col-span-1 bg-glass-card border border-[rgba(0,229,255,0.1)] rounded-xl flex flex-col overflow-hidden h-[500px]">
          <div className="p-4 bg-[rgba(16,28,45,0.8)] border-b border-[rgba(248,250,252,0.05)] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#FACC15]" />
              <h3 className="font-heading font-bold text-sm text-white">Live Requests Queue</h3>
            </div>
            <span className="text-[10px] font-mono text-[#FACC15] animate-pulse">● NEW REQUESTS</span>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-3">
            {requests.map((req) => (
              <div
                key={req.id}
                className={`p-3 rounded-lg border space-y-2 ${
                  req.status === "Complete"
                    ? "bg-[rgba(0,208,132,0.02)] border-[#00D084]/20"
                    : req.status === "Dispatched"
                    ? "bg-[rgba(59,130,246,0.02)] border-[#3B82F6]/20"
                    : req.type === "Medical Support"
                    ? "bg-[rgba(255,77,109,0.03)] border-[#FF4D6D]/20"
                    : "bg-[rgba(19,34,56,0.3)] border-white/5"
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-mono text-[#94A3B8] flex items-center gap-1">
                    {req.type === "Language" && <Languages className="w-3 h-3 text-[#00E5FF]" />}
                    {req.type === "Accessibility" && <Accessibility className="w-3 h-3 text-[#FACC15]" />}
                    {req.type === "Medical Support" && <AlertTriangle className="w-3 h-3 text-[#FF4D6D]" />}
                    {req.type}
                  </span>
                  <span className="text-[9px] font-mono text-[#94A3B8]">{req.time}</span>
                </div>
                
                <h6 className="text-xs font-semibold text-white leading-normal">{req.desc}</h6>
                <p className="text-[10px] text-[#94A3B8] font-mono">Location: {req.location}</p>

                {req.status === "Pending" ? (
                  <div className="flex gap-2 pt-2 border-t border-[rgba(248,250,252,0.03)]">
                    <button
                      onClick={() => handleDispatch(req.id, "Volunteer Team C")}
                      className="flex-1 py-1 rounded bg-[#00E5FF] text-[#07111F] text-[10px] font-mono font-bold hover:brightness-110 transition-all"
                    >
                      DISPATCH STANDBY TEAM C
                    </button>
                  </div>
                ) : (
                  <div className={`text-[10px] font-mono font-bold pt-2 border-t border-[rgba(248,250,252,0.03)] ${
                    req.status === "Complete" ? "text-[#00D084]" : "text-[#3B82F6]"
                  }`}>
                    ● STATUS: {req.status.toUpperCase()}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: AI Assistant Dispatcher */}
        <div className="xl:col-span-1 bg-glass-card border border-[rgba(0,229,255,0.1)] rounded-xl p-4 flex flex-col justify-between h-[500px]">
          <div className="space-y-4">
            <h3 className="font-heading font-bold text-sm text-[#00E5FF] flex items-center gap-2">
              <HeartHandshake className="w-4 h-4 text-[#00E5FF] animate-pulse" />
              AI Volunteer Assistant
            </h3>

            <div className="bg-[rgba(7,17,31,0.4)] border border-white/5 p-3.5 rounded-lg space-y-3">
              <span className="text-[9px] font-mono text-[#00E5FF] block">SYSTEM ADVISORY</span>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Spanish speakers are concentrated in Sector 104 today due to regional ticketing groups. Suggest moving 2 bilingual volunteers from Team A standby to Sector 104 gate area.
              </p>
              <button
                onClick={() => toast.success("Re-deployment advice pushed to Team A Lead.")}
                className="py-1 px-3 rounded bg-[rgba(0,229,255,0.1)] text-[#00E5FF] border border-[#00E5FF]/20 text-[10px] font-mono font-bold hover:bg-[#00E5FF]/20 transition-all"
              >
                ENGAGE RECOMMENDATION
              </button>
            </div>
            
            <form onSubmit={handleBroadcastToAll} className="space-y-3">
              <span className="text-[9px] font-mono text-[#94A3B8] block">COGNITIVE HUD BROADCAST</span>
              <textarea
                placeholder="Broadcast instructions to all team leads..."
                value={aiMessage}
                onChange={(e) => setAiMessage(e.target.value)}
                className="w-full h-24 p-2 bg-[rgba(7,17,31,0.5)] border border-[rgba(248,250,252,0.08)] focus:border-[#00E5FF] text-[11px] rounded outline-none text-white resize-none font-sans"
              />
              <button
                type="submit"
                disabled={!aiMessage.trim()}
                className="w-full py-2 rounded bg-[#00E5FF] text-[#07111F] text-[10px] font-mono font-bold hover:brightness-110 disabled:opacity-50 disabled:pointer-events-none transition-all flex items-center justify-center gap-1.5"
              >
                <Send className="w-3 h-3" /> BROADCAST TO VOLUNTEERS
              </button>
            </form>
          </div>

          <div className="border-t border-[rgba(248,250,252,0.05)] pt-3 text-[10px] font-mono text-[#94A3B8] flex justify-between">
            <span>VOLUNTEERS ONLINE: 104</span>
            <span className="text-[#00D084]">INTEGRITY: 100%</span>
          </div>
        </div>

      </div>
    </div>
  );
}
