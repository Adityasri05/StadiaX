"use client";

import { useStadiaStore } from "@/store/useStadiaStore";
import MapVisualizer from "@/components/map-visualizer";
import {
  Users,
  Activity,
  DoorOpen,
  AlertTriangle,
  Car,
  CloudSun,
  Train,
  Trophy,
  Cpu,
  ArrowRight,
  TrendingUp,
  Clock,
  Sparkles
} from "lucide-react";
import toast from "react-hot-toast";

export default function MainDashboardPage() {
  const {
    attendance,
    occupancyRate,
    openGates,
    activeAlertsCount,
    parkingAvailability,
    weatherTemp,
    transitStatus,
    matchScore,
    matchMinute,
    simulationMode,
  } = useStadiaStore();

  const kpis = [
    {
      title: "Live Attendance",
      value: attendance.toLocaleString(),
      sub: `${((attendance / 90000) * 100).toFixed(1)}% Capacity`,
      icon: Users,
      color: "text-[#00E5FF]",
      border: "border-[#00E5FF]/20"
    },
    {
      title: "Crowd Density",
      value: `${occupancyRate}%`,
      sub: "Flow: 140 p/min",
      icon: Activity,
      color: "text-[#3B82F6]",
      border: "border-[#3B82F6]/20"
    },
    {
      title: "Open Gates",
      value: `${openGates} / 24`,
      sub: "All perimeter secure",
      icon: DoorOpen,
      color: "text-[#00D084]",
      border: "border-[#00D084]/20"
    },
    {
      title: "Active Alerts",
      value: activeAlertsCount,
      sub: activeAlertsCount > 4 ? "Action Required" : "Nominal State",
      icon: AlertTriangle,
      color: activeAlertsCount > 4 ? "text-[#FF4D6D]" : "text-[#FACC15]",
      border: activeAlertsCount > 4 ? "border-[#FF4D6D]/30" : "border-[#FACC15]/20",
      alert: activeAlertsCount > 4
    },
    {
      title: "Parking Occupancy",
      value: `${100 - parkingAvailability}%`,
      sub: `${parkingAvailability}% Vacant`,
      icon: Car,
      color: "text-[#FACC15]",
      border: "border-[#FACC15]/20"
    },
    {
      title: "Weather Station",
      value: weatherTemp,
      sub: "Wind: NNE 14km/h",
      icon: CloudSun,
      color: "text-[#94A3B8]",
      border: "border-white/5"
    },
    {
      title: "Transit Network",
      value: transitStatus,
      sub: "Metro headways: 2.5m",
      icon: Train,
      color: "text-[#00E5FF]",
      border: "border-[#00E5FF]/20"
    },
    {
      title: "Current Match",
      value: `ARG ${matchScore} FRA`,
      sub: `Min: ${matchMinute}'`,
      icon: Trophy,
      color: "text-[#FF4D6D]",
      border: "border-[#FF4D6D]/20"
    }
  ];

  const insights = [
    { text: "Gate 4 congestion predicted within 11 minutes.", priority: "high" },
    { text: "Recommend redirecting visitors through Gate 6.", priority: "medium" },
    { text: "Volunteer Team C should relocate to Sector 112.", priority: "medium" },
    { text: "Parking Lot B nearing capacity (94% occupied).", priority: "low" },
    { text: "Metro Station East expected to overload at match end.", priority: "high" },
    { text: "Food Court C inventory below threshold (Halal items).", priority: "low" }
  ];

  const timelineEvents = [
    { time: "14:44:02", category: "Medical", desc: "Medical Team dispatch confirmed for Sector 112 Row F." },
    { time: "14:42:15", category: "Transit", desc: "Shuttle Loop 12 schedule adjusted to offset Metro East load." },
    { time: "14:41:40", category: "Vendor", desc: "Food Court C vendor flagged restock order #942." },
    { time: "14:40:02", category: "Crowd", desc: "Bypass signages enabled: Redirecting fans to Gate 6." },
    { time: "14:38:50", category: "Security", desc: "Unattended bag isolated near Gate 8. K9 sweep in progress." }
  ];

  return (
    <div className="space-y-6">
      {/* HUD Headers */}
      <div className="flex items-center justify-between pb-4 border-b border-[rgba(248,250,252,0.05)]">
        <div>
          <h1 className="font-heading font-bold text-2xl text-white tracking-wide flex items-center gap-2">
            <Cpu className="w-6 h-6 text-[#00E5FF]" />
            MISSION CONTROL CENTER
          </h1>
          <p className="text-xs text-[#94A3B8] font-mono mt-0.5">
            FIFA 2026 OPERATIONAL TELEMETRY HUB // INTEGRATION LEVEL 9
          </p>
        </div>
        
        {simulationMode !== "Normal" && (
          <div className="bg-[#FF4D6D]/10 border border-[#FF4D6D]/40 text-[#FF4D6D] font-mono text-xs px-3.5 py-1.5 rounded-lg animate-pulse flex items-center gap-2 font-bold shadow-[0_0_15px_rgba(255,77,109,0.15)]">
            <AlertTriangle className="w-4.5 h-4.5" />
            STADIUM EVACUATION SIMULATOR ACTIVE
          </div>
        )}
      </div>

      {/* KPI Cards Row */}
      <section className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className={`bg-glass-card border rounded-xl p-3 flex flex-col justify-between transition-all duration-300 hover:border-[#00E5FF]/40 ${kpi.border} ${
                kpi.alert ? "animate-pulse shadow-[0_0_10px_rgba(255,77,109,0.1)]" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-sans font-semibold text-[#94A3B8] uppercase tracking-wide truncate">
                  {kpi.title}
                </span>
                <Icon className={`w-4 h-4 ${kpi.color} shrink-0`} />
              </div>
              <div className="mt-2.5">
                <span className="text-xl font-mono font-bold text-white tracking-tight">
                  {kpi.value}
                </span>
                <span className="block text-[10px] text-[#94A3B8] font-mono mt-0.5 truncate">
                  {kpi.sub}
                </span>
              </div>
            </div>
          );
        })}
      </section>

      {/* Center Layout: Map + Insights */}
      <section className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Interactive Map Visualizer */}
        <div className="xl:col-span-3 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-sm text-white tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#00E5FF]" />
              LIVE TELEMETRY MAP OVERLAY
            </h3>
            <span className="text-[10px] text-[#94A3B8] font-mono uppercase">
              Click elements to query telemetry
            </span>
          </div>
          <MapVisualizer />
        </div>

        {/* Right Panel: AI Operational Insights */}
        <div className="xl:col-span-1 bg-glass-card border border-[rgba(0,229,255,0.1)] rounded-xl flex flex-col overflow-hidden h-[482px]">
          <div className="p-4 bg-[rgba(16,28,45,0.8)] border-b border-[rgba(248,250,252,0.05)] flex items-center justify-between">
            <h3 className="font-heading font-bold text-sm text-[#F8FAFC] tracking-wide flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#00E5FF]" />
              AI Operational Insights
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-3.5 space-y-3">
            {insights.map((ins, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg border flex gap-2.5 transition-all duration-200 hover:translate-x-1 ${
                  ins.priority === "high"
                    ? "bg-[rgba(255,77,109,0.04)] border-[#FF4D6D]/20"
                    : ins.priority === "medium"
                    ? "bg-[rgba(250,204,21,0.04)] border-[#FACC15]/20"
                    : "bg-[rgba(19,34,56,0.3)] border-white/5"
                }`}
              >
                <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                  ins.priority === "high"
                    ? "bg-[#FF4D6D] animate-ping"
                    : ins.priority === "medium"
                    ? "bg-[#FACC15]"
                    : "bg-[#3B82F6]"
                }`} />
                <div className="flex-1 space-y-1">
                  <p className="text-xs text-white font-sans leading-snug">
                    {ins.text}
                  </p>
                  <div className="flex items-center gap-1.5 text-[9px] font-mono text-[#00E5FF] cursor-pointer hover:underline" onClick={() => toast("Deploying intervention protocols...")}>
                    <span>Dispatch intervention</span>
                    <ArrowRight className="w-2.5 h-2.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom Layout: Live Operational Timeline */}
      <section className="bg-glass-card border border-[rgba(0,229,255,0.1)] rounded-xl overflow-hidden">
        <div className="p-4 bg-[rgba(16,28,45,0.8)] border-b border-[rgba(248,250,252,0.05)] flex items-center justify-between">
          <h3 className="font-heading font-bold text-sm text-[#F8FAFC] tracking-wide flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#00E5FF]" />
            Live Operational Timeline
          </h3>
          <span className="text-[10px] font-mono text-[#00E5FF] animate-pulse">● STREAM ACTIVE</span>
        </div>

        <div className="p-4 space-y-3.5 max-h-[160px] overflow-y-auto custom-scrollbar font-mono text-xs text-[#94A3B8]">
          {timelineEvents.map((evt, idx) => (
            <div key={idx} className="flex items-center gap-4 border-l border-[rgba(0,229,255,0.2)] pl-4 relative">
              <div className="absolute left-[-4.5px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[#101C2D] border border-[#00E5FF] shadow-[0_0_8px_#00E5FF]" />
              <span className="text-white font-semibold">{evt.time}</span>
              <span className="px-1.5 py-0.5 rounded bg-[rgba(0,229,255,0.1)] text-[#00E5FF] text-[9px] font-bold uppercase tracking-wider">
                {evt.category}
              </span>
              <span className="text-[#F8FAFC]">{evt.desc}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
