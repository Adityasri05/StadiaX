"use client";

import { useEffect, useState } from "react";
import { useStadiaStore } from "@/store/useStadiaStore";
import {
  Train,
  Bus,
  Car,
  Compass,
  Zap,
  Clock,
  ExternalLink,
  ArrowRight,
  TrendingUp,
  Gauge
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import toast from "react-hot-toast";

const trafficForecastData = [
  { name: "Match Min 80", congestion: 30, capacity: 85 },
  { name: "Match End", congestion: 65, capacity: 85 },
  { name: "End + 15m", congestion: 95, capacity: 85 }, // Exceeds capacity
  { name: "End + 30m", congestion: 80, capacity: 85 },
  { name: "End + 45m", congestion: 45, capacity: 85 },
  { name: "End + 60m", congestion: 20, capacity: 85 }
];

export default function TransportationPage() {
  const { transitStatus, parkingAvailability } = useStadiaStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleBroadcastReroute = () => {
    toast.success("AI Egress Routing pushed to all stadium app devices.", {
      icon: "📲",
      duration: 4000
    });
  };

  const transitCards = [
    {
      title: "Metro East Hub",
      icon: Train,
      status: "Delayed",
      metric: "Headway: 4.5m",
      desc: "Line 1 platform congestion due to escalator block.",
      color: "text-[#FF4D6D]",
      bg: "bg-[#FF4D6D]/5",
      border: "border-[#FF4D6D]/30"
    },
    {
      title: "Shuttle Loop B",
      icon: Bus,
      status: "Normal",
      metric: "12 buses active",
      desc: "Looping parking lots A/B with 90s intervals.",
      color: "text-[#00D084]",
      bg: "bg-[#00D084]/5",
      border: "border-[#00D084]/20"
    },
    {
      title: "Uber/Rideshare Zone",
      icon: Compass,
      status: "Normal",
      metric: "Est. wait: 4 mins",
      desc: "Pick-up lanes 1-4 clear. Staging area filled.",
      color: "text-[#00E5FF]",
      bg: "bg-[#00E5FF]/5",
      border: "border-[#00E5FF]/20"
    },
    {
      title: "Car Park B Capacity",
      icon: Car,
      status: "Nearing Limit",
      metric: `${100 - parkingAvailability}% Capacity`,
      desc: "Gate 4 queue feeding Lot B. Directing excess to Lot C.",
      color: "text-[#FACC15]",
      bg: "bg-[#FACC15]/5",
      border: "border-[#FACC15]/20"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[rgba(248,250,252,0.05)]">
        <div>
          <h1 className="font-heading font-bold text-xl text-white tracking-wide flex items-center gap-2">
            <Train className="w-5.5 h-5.5 text-[#00E5FF]" />
            TRANSPORTATION INTELLIGENCE
          </h1>
          <p className="text-xs text-[#94A3B8] font-mono mt-0.5">
            LOCAL TRANSIT SYNC // EGRESS PATHWAY ROUTING ALGORITHMS
          </p>
        </div>
      </div>

      {/* Transit status cards */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {transitCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className={`p-4 rounded-xl bg-glass-card border flex flex-col justify-between gap-3 transition-all ${card.border}`}
            >
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-lg bg-[rgba(16,28,45,0.8)] border border-white/5 flex items-center justify-center">
                  <Icon className={`w-5 h-5 ${card.color}`} />
                </div>
                <span className={`px-2 py-0.5 rounded text-[9px] font-bold font-mono ${
                  card.status === "Normal" 
                    ? "bg-[#00D084]/15 text-[#00D084]" 
                    : card.status === "Delayed"
                    ? "bg-[#FF4D6D]/15 text-[#FF4D6D]"
                    : "bg-[#FACC15]/15 text-[#FACC15]"
                }`}>
                  {card.status.toUpperCase()}
                </span>
              </div>
              <div>
                <h4 className="text-sm font-heading font-bold text-white">{card.title}</h4>
                <p className="text-xs font-mono font-semibold text-white mt-1">{card.metric}</p>
                <p className="text-[11px] text-[#94A3B8] leading-normal mt-1">{card.desc}</p>
              </div>
            </div>
          );
        })}
      </section>

      {/* Traffic Forecast & AI Egress Strategy */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Forecast Chart */}
        {mounted && (
          <div className="xl:col-span-2 bg-glass-card border border-[rgba(0,229,255,0.1)] rounded-xl p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-heading font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#00E5FF]" />
                Post-Match Station Congestion Forecast
              </h3>
              <span className="text-[9px] font-mono text-[#FF4D6D] bg-[#FF4D6D]/10 px-2 py-0.5 rounded animate-pulse">
                SPIKE WARNING
              </span>
            </div>
            <div className="h-60 w-full font-mono text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trafficForecastData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCongestion" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(248, 250, 252, 0.05)" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ backgroundColor: "#132238", borderColor: "rgba(0,229,255,0.2)" }} />
                  <Area type="monotone" dataKey="congestion" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorCongestion)" name="Predicted Station Load (%)" />
                  <Area type="monotone" dataKey="capacity" stroke="#ff4d6d" strokeWidth={1} strokeDasharray="4 4" fill="none" name="Platform Capacity Limit" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* AI Exit Advisor */}
        <div className="xl:col-span-1 bg-glass-card border border-[rgba(0,229,255,0.1)] rounded-xl p-4 flex flex-col justify-between gap-4">
          <div className="space-y-4">
            <h3 className="font-heading font-bold text-sm text-[#00E5FF] flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#00E5FF] animate-pulse" />
              AI Egress Optimization
            </h3>

            <div className="bg-[rgba(7,17,31,0.4)] border border-white/5 p-3.5 rounded-lg space-y-3">
              <div className="flex gap-2 items-center text-[10px] font-mono text-[#FACC15]">
                <Clock className="w-3.5 h-3.5" />
                <span>EGRESS ADVICE IN EFFECT</span>
              </div>
              <p className="text-xs text-white leading-relaxed font-sans">
                Due to escalator blockage at Metro Station East, passengers exiting from Sectors 101-112 are advised to proceed through West Gate and board Shuttle Loop B to Lot C, bypassing the metro queue.
              </p>
              <div className="text-[10px] font-mono text-[#94A3B8] border-t border-[rgba(248,250,252,0.05)] pt-2.5">
                Expected wait reduction: <strong className="text-[#00D084]">14 minutes</strong>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={handleBroadcastReroute}
              className="w-full py-2.5 rounded bg-[#00E5FF] text-[#07111F] text-xs font-mono font-bold hover:brightness-110 transition-all flex items-center justify-center gap-1.5"
            >
              BROADCAST TO FANS <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => toast.success("Metro ticketing gates set to FREE PASS mode to speed up entry.")}
              className="w-full py-2.5 rounded bg-[rgba(248,250,252,0.05)] border border-white/5 text-white text-xs font-mono hover:bg-[rgba(248,250,252,0.1)] transition-all flex items-center justify-center gap-1.5"
            >
              ENABLE FREE-PASS METRO GATES <Gauge className="w-4 h-4 text-[#94A3B8]" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
