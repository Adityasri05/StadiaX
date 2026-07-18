"use client";

import { useState, useEffect } from "react";
import { useStadiaStore, Incident, AIAgent } from "@/store/useStadiaStore";
import {
  Activity,
  AlertTriangle,
  BrainCircuit,
  Check,
  Shield,
  Zap,
  Sparkles,
  RefreshCw,
  Terminal,
  Play
} from "lucide-react";
import toast from "react-hot-toast";

export default function MissionControlPage() {
  const {
    incidents,
    agents,
    resolveIncident,
    dismissIncident,
    triggerAction,
    simulationMode,
    setSimulationMode,
    matchMinute
  } = useStadiaStore();

  const [activeTab, setActiveTab] = useState<"active" | "all">("active");
  const [synapticLatency, setSynapticLatency] = useState(14);
  const [cognitiveLoad, setCognitiveLoad] = useState(64);

  // Filter incidents
  const filteredIncidents = incidents.filter((inc) => {
    if (activeTab === "active") return inc.status !== "Resolved";
    return true;
  });

  // Trivial interval to fluctuate system health indices
  useEffect(() => {
    const interval = setInterval(() => {
      setSynapticLatency(Math.floor(Math.random() * 8) + 10);
      setCognitiveLoad(Math.floor(Math.random() * 12) + (simulationMode === "Evacuation" ? 85 : 55));
    }, 4000);
    return () => clearInterval(interval);
  }, [simulationMode]);

  const handleApproveAction = (agentId: string, actionDesc: string) => {
    triggerAction(agentId);
    toast.success(`Protocol Approved: Dispatched instructions for ${actionDesc}`, {
      icon: "🛰️",
      style: {
        background: "#101C2D",
        border: "1px solid #00D084",
        color: "#F8FAFC"
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner - System Health HUD */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-glass-card p-4 rounded-xl border border-[rgba(0,229,255,0.1)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BrainCircuit className="w-8 h-8 text-[#00E5FF] animate-pulse" />
            <div>
              <p className="text-[10px] font-mono text-[#94A3B8] uppercase">Cognitive Sync</p>
              <h4 className="text-xl font-mono font-bold text-[#F8FAFC]">STADIAX-CORE</h4>
            </div>
          </div>
          <span className="text-xs bg-[rgba(0,208,132,0.1)] text-[#00D084] font-bold font-mono px-2 py-0.5 rounded">
            ONLINE
          </span>
        </div>

        <div className="bg-glass-card p-4 rounded-xl border border-[rgba(0,229,255,0.1)] flex items-center justify-between">
          <div>
            <p className="text-[10px] font-mono text-[#94A3B8] uppercase">Synaptic Latency</p>
            <h4 className="text-xl font-mono font-bold text-[#00E5FF]">{synapticLatency} ms</h4>
          </div>
          <Activity className="w-8 h-8 text-[#00E5FF] opacity-60" />
        </div>

        <div className="bg-glass-card p-4 rounded-xl border border-[rgba(0,229,255,0.1)]">
          <div className="flex justify-between items-center mb-1.5">
            <p className="text-[10px] font-mono text-[#94A3B8] uppercase">Cognitive Load</p>
            <span className={`text-xs font-mono font-bold ${cognitiveLoad > 80 ? "text-[#FF4D6D]" : "text-[#00D084]"}`}>
              {cognitiveLoad}%
            </span>
          </div>
          <div className="w-full bg-[rgba(248,250,252,0.05)] h-2 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${cognitiveLoad > 80 ? "bg-[#FF4D6D]" : "bg-[#00E5FF]"}`} 
              style={{ width: `${cognitiveLoad}%` }} 
            />
          </div>
        </div>

        <div className="bg-glass-card p-4 rounded-xl border border-[rgba(0,229,255,0.1)] flex items-center justify-between">
          <div>
            <p className="text-[10px] font-mono text-[#94A3B8] uppercase">Simulation Environment</p>
            <h4 className={`text-lg font-heading font-bold ${simulationMode !== "Normal" ? "text-[#FF4D6D] animate-pulse" : "text-[#00D084]"}`}>
              {simulationMode} Mode
            </h4>
          </div>
          <Zap className={`w-6 h-6 ${simulationMode !== "Normal" ? "text-[#FF4D6D] animate-bounce" : "text-[#00D084]"}`} />
        </div>
      </section>

      {/* Main Cockpit Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        
        {/* Left Panel: Live Incidents */}
        <div className="bg-glass-card rounded-xl border border-[rgba(0,229,255,0.1)] overflow-hidden xl:col-span-1 flex flex-col h-[520px]">
          <div className="p-4 bg-[rgba(16,28,45,0.8)] border-b border-[rgba(248,250,252,0.05)] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#FF4D6D] animate-pulse" />
              <span className="font-heading font-bold text-sm text-[#F8FAFC] tracking-wide">Live Incidents</span>
            </div>
            
            <div className="flex bg-[rgba(7,17,31,0.5)] border border-[rgba(248,250,252,0.05)] rounded p-0.5">
              <button
                onClick={() => setActiveTab("active")}
                className={`px-2.5 py-0.5 text-[10px] font-mono rounded transition-all ${
                  activeTab === "active" ? "bg-[#00E5FF] text-[#07111F] font-bold" : "text-[#94A3B8]"
                }`}
              >
                ACTIVE
              </button>
              <button
                onClick={() => setActiveTab("all")}
                className={`px-2.5 py-0.5 text-[10px] font-mono rounded transition-all ${
                  activeTab === "all" ? "bg-[#00E5FF] text-[#07111F] font-bold" : "text-[#94A3B8]"
                }`}
              >
                ALL
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-3">
            {filteredIncidents.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-[#94A3B8] p-6">
                <Check className="w-10 h-10 text-[#00D084] border border-[#00D084]/20 rounded-full p-2 mb-2 bg-[#00D084]/5" />
                <p className="text-sm font-sans font-medium text-white">No Incidents Detected</p>
                <p className="text-xs mt-1">StadiaX security monitoring system reports 0 active anomalies.</p>
              </div>
            ) : (
              filteredIncidents.map((inc) => (
                <div
                  key={inc.id}
                  className={`p-3 rounded-lg border transition-all ${
                    inc.status === "Resolved"
                      ? "bg-[rgba(0,208,132,0.02)] border-[#00D084]/20"
                      : inc.priority === "high"
                      ? "bg-[rgba(255,77,109,0.03)] border-[#FF4D6D]/30"
                      : "bg-[rgba(19,34,56,0.4)] border-white/5"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`px-2 py-0.5 rounded text-[8px] font-bold font-mono tracking-wider ${
                      inc.priority === "high"
                        ? "bg-[#FF4D6D] text-white"
                        : inc.priority === "medium"
                        ? "bg-[#FACC15] text-[#07111F]"
                        : "bg-[#3B82F6] text-white"
                    }`}>
                      {inc.priority.toUpperCase()}
                    </span>
                    <span className="text-[9px] font-mono text-[#94A3B8]">{inc.time}</span>
                  </div>
                  
                  <h5 className="text-xs font-semibold text-white font-sans">{inc.title}</h5>
                  <p className="text-[10px] text-[#94A3B8] font-mono mt-1">Loc: {inc.location}</p>
                  
                  {inc.status !== "Resolved" ? (
                    <div className="flex gap-2 mt-3 pt-2 border-t border-[rgba(248,250,252,0.03)]">
                      <button
                        onClick={() => {
                          resolveIncident(inc.id);
                          toast.success("Incident resolved and cleared.");
                        }}
                        className="flex-1 py-1 rounded bg-[#00D084] text-[#07111F] text-[10px] font-mono font-bold hover:brightness-110 transition-all"
                      >
                        RESOLVE
                      </button>
                      <button
                        onClick={() => {
                          dismissIncident(inc.id);
                          toast("Alert dismissed.");
                        }}
                        className="py-1 px-2.5 rounded bg-[rgba(248,250,252,0.05)] text-white text-[10px] font-mono hover:bg-[rgba(248,250,252,0.1)] transition-all border border-white/5"
                      >
                        DISMISS
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-[#00D084] text-[10px] font-mono font-semibold mt-2.5">
                      <Check className="w-3.5 h-3.5" /> RESOLVED
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Center Panels: AI Mission Feed */}
        <div className="bg-glass-card rounded-xl border border-[rgba(0,229,255,0.1)] overflow-hidden xl:col-span-2 flex flex-col h-[520px]">
          <div className="p-4 bg-[rgba(16,28,45,0.8)] border-b border-[rgba(248,250,252,0.05)] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-[#00E5FF]" />
              <span className="font-heading font-bold text-sm text-[#F8FAFC] tracking-wide">Real-time Cognitive Telemetry</span>
            </div>
            <span className="text-[10px] font-mono text-[#00E5FF] animate-pulse">● FEED SECURE</span>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4 font-mono text-xs text-[#94A3B8] bg-[rgba(7,17,31,0.3)]">
            <div className="text-[11px] text-[#00E5FF]/60">// Initializing AI agent mesh telemetry... Done.</div>
            <div className="text-[11px] text-[#00E5FF]/60">// Connecting to FIFA command center gateway... Sync 100%.</div>
            
            {simulationMode === "Evacuation" && (
              <div className="bg-[#FF4D6D]/10 border border-[#FF4D6D]/30 p-3 rounded text-[#FF4D6D] text-[11px] space-y-1 animate-pulse">
                <div>[14:45:02] !CRITICAL! SYSTEM MODE OVERRIDE: STADIA EVACUATION PLAN ACTIVE</div>
                <div>[14:45:03] Opening all 24 gates. Rerouting all fans to closest perimeter evacuation exit vectors.</div>
                <div>[14:45:04] Overriding standard digital signboards, flashing directional LED routes.</div>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-[#00D084] shrink-0">[14:44:12]</span>
                <span><strong className="text-white">X-Secure:</strong> Dispatched Medical responder M-4 to Sector 112 for heat exhaustion assistance.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#00D084] shrink-0">[14:43:08]</span>
                <span><strong className="text-white">X-Transit:</strong> Rerouted Shuttle Loop 12 to parking bay B. Crowd density at Metro Station East exceeded warning buffer.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#00D084] shrink-0">[14:42:05]</span>
                <span><strong className="text-white">X-Assist:</strong> Activated South Ramp 3 rerouting instructions for wheelchair itineraries due to Lift B-3 outage.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#00D084] shrink-0">[14:40:55]</span>
                <span><strong className="text-white">X-Crowd:</strong> Commenced visual redirection displays on main concourse signage. Routing incoming fans away from Gate 4 security check.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#00D084] shrink-0">[14:38:19]</span>
                <span><strong className="text-white">X-Ops:</strong> Increased smart airflow nodes output by 12% in Sector 108 cooling systems.</span>
              </div>
            </div>
            
            <div className="border-t border-[rgba(248,250,252,0.05)] pt-3 text-[10px] text-[#94A3B8]/60 flex items-center gap-1.5">
              <RefreshCw className="w-3 h-3 animate-spin text-[#00E5FF]" />
              <span>Awaiting agent neural updates... Ticking at match minute {matchMinute}</span>
            </div>
          </div>
        </div>

        {/* Right Panel: Recommended Actions */}
        <div className="bg-glass-card rounded-xl border border-[rgba(0,229,255,0.1)] overflow-hidden xl:col-span-1 flex flex-col h-[520px]">
          <div className="p-4 bg-[rgba(16,28,45,0.8)] border-b border-[rgba(248,250,252,0.05)] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#FACC15] animate-pulse" />
              <span className="font-heading font-bold text-sm text-[#F8FAFC] tracking-wide">Recommended Actions</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-3">
            {/* Action 1 */}
            <div className="p-3 bg-[rgba(16,28,45,0.4)] border border-[rgba(0,229,255,0.1)] rounded-lg space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-mono text-[#00E5FF] font-bold">X-TRANSIT</span>
                <span className="text-[9px] font-mono text-[#00D084]">92% CONFIDENCE</span>
              </div>
              <h6 className="text-xs font-semibold text-white">Approve Metrorail train bypass</h6>
              <p className="text-[10px] text-[#94A3B8] leading-relaxed">
                Bypass next empty shuttle train from station 3 straight to Metro East station to absorb the crowd spike.
              </p>
              <button
                onClick={() => handleApproveAction("x-transit", "Metrorail train bypass")}
                className="w-full py-1 rounded bg-[#00E5FF] text-[#07111F] text-[10px] font-mono font-bold hover:brightness-110 transition-all flex items-center justify-center gap-1"
              >
                <Check className="w-3.5 h-3.5" /> APPROVE ACTION
              </button>
            </div>

            {/* Action 2 */}
            <div className="p-3 bg-[rgba(16,28,45,0.4)] border border-[rgba(0,229,255,0.1)] rounded-lg space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-mono text-[#FF4D6D] font-bold">X-SECURE</span>
                <span className="text-[9px] font-mono text-[#00D084]">99% CONFIDENCE</span>
              </div>
              <h6 className="text-xs font-semibold text-white">Lock gate 8 security lane 3</h6>
              <p className="text-[10px] text-[#94A3B8] leading-relaxed">
                Approve isolating unattended bag area. Dispatch K9 unit S-2 immediately.
              </p>
              <button
                onClick={() => handleApproveAction("x-secure", "Gate 8 K9 dispatch & isolation")}
                className="w-full py-1 rounded bg-[#FF4D6D] text-white text-[10px] font-mono font-bold hover:brightness-110 transition-all flex items-center justify-center gap-1 shadow-[0_0_10px_rgba(255,77,109,0.2)]"
              >
                <Check className="w-3.5 h-3.5" /> APPROVE ISOLATION
              </button>
            </div>

            {/* Action 3 */}
            <div className="p-3 bg-[rgba(16,28,45,0.4)] border border-[rgba(248,250,252,0.05)] rounded-lg space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-mono text-[#00D084] font-bold">X-GREEN</span>
                <span className="text-[9px] font-mono text-[#94A3B8]">89% CONFIDENCE</span>
              </div>
              <h6 className="text-xs font-semibold text-white">Activate solar grid feed-in</h6>
              <p className="text-[10px] text-[#94A3B8] leading-relaxed">
                Draw 150kW reserve solar battery power to offset cooling load spike in Sector 108.
              </p>
              <button
                onClick={() => handleApproveAction("x-green", "Solar battery feed-in")}
                className="w-full py-1 rounded bg-[rgba(248,250,252,0.05)] hover:bg-[rgba(248,250,252,0.1)] text-white text-[10px] font-mono hover:text-white transition-all border border-white/5"
              >
                APPROVE DISPATCH
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: AI Agent Collaboration */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <BrainCircuit className="w-5 h-5 text-[#00E5FF]" />
          <h3 className="font-heading font-bold text-lg text-white">AI Neural Agent Network</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-9 gap-4">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className={`p-4 rounded-xl bg-glass-card border flex flex-col justify-between group relative overflow-hidden transition-all duration-300 ${
                agent.status === "Alerting"
                  ? "border-[#FF4D6D]/40 shadow-[0_0_15px_rgba(255,77,109,0.1)] bg-[rgba(255,77,109,0.02)]"
                  : agent.status === "Resolving"
                  ? "border-[#00D084]/40 shadow-[0_0_15px_rgba(0,208,132,0.1)]"
                  : "border-[rgba(0,229,255,0.07)] hover:border-[#00E5FF]/30"
              }`}
            >
              {/* Scanline Animation for thinking state */}
              {agent.status !== "Idle" && (
                <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#00E5FF] to-transparent opacity-40 animate-scanline pointer-events-none" />
              )}

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-heading font-bold text-white tracking-wide">
                    {agent.name}
                  </span>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    agent.status === "Alerting"
                      ? "bg-[#FF4D6D] animate-ping"
                      : agent.status === "Resolving"
                      ? "bg-[#00D084] animate-pulse"
                      : agent.status === "Analyzing"
                      ? "bg-[#00E5FF] animate-pulse"
                      : "bg-[#94A3B8]"
                  }`} />
                </div>

                <div className="flex justify-between items-center text-[9px] font-mono">
                  <span className="text-[#94A3B8]">{agent.title}</span>
                  <span className={agent.status === "Alerting" ? "text-[#FF4D6D]" : "text-[#00E5FF]"}>
                    {agent.status}
                  </span>
                </div>

                <p className="text-[10px] text-[#94A3B8] leading-relaxed font-sans min-h-[50px] line-clamp-4">
                  {agent.currentReasoning}
                </p>
              </div>

              <div className="space-y-2 pt-3 border-t border-[rgba(248,250,252,0.03)] mt-3">
                <div className="flex justify-between text-[9px] font-mono">
                  <span className="text-[#94A3B8]">Confidence</span>
                  <span className="text-white font-bold">{agent.confidenceScore}%</span>
                </div>
                <div className="w-full bg-[rgba(248,250,252,0.05)] h-1 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${agent.status === "Alerting" ? "bg-[#FF4D6D]" : "bg-[#00E5FF]"}`} 
                    style={{ width: `${agent.confidenceScore}%` }} 
                  />
                </div>

                <div className="text-[9px] font-mono text-[#00D084] truncate">
                  <span className="text-white font-semibold">Impact:</span> {agent.estimatedImpact}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
