"use client";

import { useEffect, useState } from "react";
import { useStadiaStore } from "@/store/useStadiaStore";
import {
  Users,
  TrendingUp,
  AlertTriangle,
  Zap,
  Activity,
  ArrowRight,
  UserCheck
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts";
import toast from "react-hot-toast";

// Mock data for graphs
const densityData = [
  { name: "13:00", density: 45, limit: 80 },
  { name: "13:30", density: 60, limit: 80 },
  { name: "14:00", density: 82, limit: 80 }, // Alert
  { name: "14:30", density: 75, limit: 80 },
  { name: "15:00", density: 92, limit: 80 }, // Alert
  { name: "15:30", density: 95, limit: 80 }, // Alert
];

const gateUsageData = [
  { name: "Gate 1", current: 120, capacity: 200 },
  { name: "Gate 2", current: 150, capacity: 200 },
  { name: "Gate 4", current: 240, capacity: 200 }, // Over capacity
  { name: "Gate 6", current: 80, capacity: 200 },
  { name: "Gate 8", current: 130, capacity: 200 },
];

const queueWaitData = [
  { name: "14:00", gate4: 5, gate6: 2 },
  { name: "14:15", gate4: 8, gate6: 2 },
  { name: "14:30", gate4: 12, gate6: 3 },
  { name: "14:45", gate4: 11, gate6: 2 },
  { name: "15:00", gate4: 18, gate6: 4 },
];

export default function CrowdIntelligencePage() {
  const { attendance, occupancyRate } = useStadiaStore();
  const [mounted, setMounted] = useState(false);

  // Client-only mount check to prevent Recharts SSR hydration errors
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleApplyStrategy = (strategy: string) => {
    toast.success(`Crowd Strategy Engaged: ${strategy}`, { icon: "📈" });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[rgba(248,250,252,0.05)]">
        <div>
          <h1 className="font-heading font-bold text-xl text-white tracking-wide flex items-center gap-2">
            <Users className="w-5.5 h-5.5 text-[#00E5FF]" />
            CROWD INTELLIGENCE COCKPIT
          </h1>
          <p className="text-xs text-[#94A3B8] font-mono mt-0.5">
            REAL-TIME VISUAL DENSITY INDEX // DYNAMIC FLOW PATHWAYS
          </p>
        </div>
      </div>

      {/* Grid containing Stats Widgets */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-glass-card p-4 rounded-xl border border-[rgba(0,229,255,0.1)] flex items-center justify-between">
          <div>
            <p className="text-[10px] font-mono text-[#94A3B8] uppercase">Current Crowd flow</p>
            <h4 className="text-xl font-mono font-bold text-white">1,480 / min</h4>
            <span className="text-[10px] text-[#00D084] font-mono">Nominal dispersal</span>
          </div>
          <Activity className="w-8 h-8 text-[#00D084] opacity-50" />
        </div>

        <div className="bg-glass-card p-4 rounded-xl border border-[rgba(0,229,255,0.1)] flex items-center justify-between">
          <div>
            <p className="text-[10px] font-mono text-[#94A3B8] uppercase">Avg Concourse Wait</p>
            <h4 className="text-xl font-mono font-bold text-white">4.8 mins</h4>
            <span className="text-[10px] text-[#FF4D6D] font-mono">Gate 4 anomaly active</span>
          </div>
          <TrendingUp className="w-8 h-8 text-[#FF4D6D] opacity-50" />
        </div>

        <div className="bg-glass-card p-4 rounded-xl border border-[rgba(0,229,255,0.1)] flex items-center justify-between">
          <div>
            <p className="text-[10px] font-mono text-[#94A3B8] uppercase">Dispersal Risk Level</p>
            <h4 className="text-xl font-mono font-bold text-[#FACC15]">MODERATE</h4>
            <span className="text-[10px] text-[#94A3B8] font-mono">Heat density: 92% East</span>
          </div>
          <AlertTriangle className="w-8 h-8 text-[#FACC15] opacity-50" />
        </div>
      </section>

      {/* Charts Section */}
      {mounted && (
        <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Chart 1: Crowd Density Forecast */}
          <div className="bg-glass-card border border-[rgba(0,229,255,0.1)] rounded-xl p-4 space-y-4">
            <h3 className="text-xs font-heading font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span>Crowd Density Forecast vs Security Threshold</span>
            </h3>
            <div className="h-60 w-full font-mono text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={densityData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorDensity" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00e5ff" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#00e5ff" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(248, 250, 252, 0.05)" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ backgroundColor: "#132238", borderColor: "rgba(0,229,255,0.2)" }} />
                  <Area type="monotone" dataKey="density" stroke="#00e5ff" strokeWidth={2} fillOpacity={1} fill="url(#colorDensity)" name="Density Index" />
                  <Area type="monotone" dataKey="limit" stroke="#ff4d6d" strokeWidth={1} strokeDasharray="4 4" fill="none" name="Safety Ceiling" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Gate Queue Times Comparison */}
          <div className="bg-glass-card border border-[rgba(0,229,255,0.1)] rounded-xl p-4 space-y-4">
            <h3 className="text-xs font-heading font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span>Queue Times: Gate 4 (Bottleneck) vs Gate 6 (Nominal)</span>
            </h3>
            <div className="h-60 w-full font-mono text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={queueWaitData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(248, 250, 252, 0.05)" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" label={{ value: 'minutes', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} />
                  <Tooltip contentStyle={{ backgroundColor: "#132238", borderColor: "rgba(0,229,255,0.2)" }} />
                  <Line type="monotone" dataKey="gate4" stroke="#ff4d6d" strokeWidth={2.5} name="Gate 4 Wait" />
                  <Line type="monotone" dataKey="gate6" stroke="#00d084" strokeWidth={2.5} name="Gate 6 Wait" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 3: Gate Capacity Allocation */}
          <div className="bg-glass-card border border-[rgba(0,229,255,0.1)] rounded-xl p-4 space-y-4 xl:col-span-2">
            <h3 className="text-xs font-heading font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span>Security Lane Flow Ingest (current vs nominal threshold)</span>
            </h3>
            <div className="h-60 w-full font-mono text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={gateUsageData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(248, 250, 252, 0.05)" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ backgroundColor: "#132238", borderColor: "rgba(0,229,255,0.2)" }} />
                  <Bar dataKey="current" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Active Flow rate (p/m)" />
                  <Bar dataKey="capacity" fill="rgba(248,250,252,0.05)" radius={[4, 4, 0, 0]} name="Buffer Capacity limit" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>
      )}

      {/* AI Recommendations Panel */}
      <section className="bg-glass-card border border-[rgba(0,229,255,0.1)] rounded-xl p-4 space-y-4">
        <h3 className="font-heading font-bold text-sm text-white flex items-center gap-2">
          <Zap className="w-4 h-4 text-[#FACC15]" />
          AI Crowd Dispersal Strategies
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 bg-[rgba(16,28,45,0.4)] border border-white/5 rounded-lg flex flex-col justify-between gap-3">
            <div>
              <span className="text-[9px] font-mono text-[#FF4D6D] font-bold uppercase tracking-wider">Bottleneck Detection</span>
              <h5 className="text-xs font-bold text-white mt-1">Engage Gate 6 Reroute Signs</h5>
              <p className="text-[10px] text-[#94A3B8] leading-relaxed mt-1">
                Gate 4 queue exceeds 11m threshold. Digital sign boards in concourse ring 3 will update to display redirection vectors.
              </p>
            </div>
            <button
              onClick={() => handleApplyStrategy("Gate 6 signage bypass override")}
              className="py-1 rounded bg-[#00E5FF] text-[#07111F] text-[10px] font-mono font-bold hover:brightness-110 transition-all flex items-center justify-center gap-1.5"
            >
              APPROVE DIRECT OVERRIDE <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="p-3 bg-[rgba(16,28,45,0.4)] border border-white/5 rounded-lg flex flex-col justify-between gap-3">
            <div>
              <span className="text-[9px] font-mono text-[#00E5FF] font-bold uppercase tracking-wider">Volunteer Relocation</span>
              <h5 className="text-xs font-bold text-white mt-1">Relocate Volunteer Team C</h5>
              <p className="text-[10px] text-[#94A3B8] leading-relaxed mt-1">
                Dispatch Volunteer team C from stand-by bay A to Gate 4 bypass lanes to direct ticket holders.
              </p>
            </div>
            <button
              onClick={() => handleApplyStrategy("Redeploy Team C to security bypass lanes")}
              className="py-1 rounded bg-[rgba(0,229,255,0.1)] text-[#00E5FF] border border-[#00E5FF]/20 text-[10px] font-mono font-bold hover:bg-[#00E5FF]/20 transition-all flex items-center justify-center gap-1.5"
            >
              DISPATCH COMMAND <UserCheck className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
