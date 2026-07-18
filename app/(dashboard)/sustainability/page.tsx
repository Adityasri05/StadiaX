"use client";

import { useEffect, useState } from "react";
import { useStadiaStore } from "@/store/useStadiaStore";
import {
  Leaf,
  Activity,
  Zap,
  TrendingDown,
  TrendingUp,
  Sliders,
  Sparkles,
  ArrowRight,
  RefreshCw
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

const energyDrawData = [
  { name: "13:00", grid: 140, solar: 60 },
  { name: "13:30", grid: 180, solar: 80 },
  { name: "14:00", grid: 240, solar: 120 }, // Halftime load start
  { name: "14:30", grid: 210, solar: 120 },
  { name: "15:00", grid: 190, solar: 100 },
  { name: "15:30", grid: 150, solar: 70 }
];

export default function SustainabilityPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleEcoOverride = (strategy: string) => {
    toast.success(`Eco Protocol Engaged: ${strategy}`, {
      icon: "🌱"
    });
  };

  const metrics = [
    {
      title: "Solar Battery Offset",
      value: "42.5%",
      sub: "120kW active generation",
      icon: Zap,
      color: "text-[#00D084]",
      border: "border-[#00D084]/20"
    },
    {
      title: "Water Conservation",
      value: "88.1%",
      sub: "Rainwater recycle loop: OK",
      icon: Activity,
      color: "text-[#00E5FF]",
      border: "border-[#00E5FF]/20"
    },
    {
      title: "Waste Sorting Efficiency",
      value: "82.5%",
      sub: "Recycling goal: 85.0%",
      icon: Leaf,
      color: "text-[#FACC15]",
      border: "border-[#FACC15]/20"
    },
    {
      title: "Carbon Offset Index",
      value: "94.8%",
      sub: "Net-zero target match",
      icon: TrendingDown,
      color: "text-[#00D084]",
      border: "border-[#00D084]/20"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[rgba(248,250,252,0.05)]">
        <div>
          <h1 className="font-heading font-bold text-xl text-white tracking-wide flex items-center gap-2">
            <Leaf className="w-5.5 h-5.5 text-[#00D084]" />
            SUSTAINABILITY CONTROL ROOM
          </h1>
          <p className="text-xs text-[#94A3B8] font-mono mt-0.5">
            SMART ENERGY ECO-GRID // WASTE & WATER OPTIMIZERS
          </p>
        </div>
      </div>

      {/* Sustainability Metrics */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div
              key={idx}
              className={`p-4 rounded-xl bg-glass-card border flex flex-col justify-between gap-3 ${m.border}`}
            >
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-sans font-semibold text-[#94A3B8] uppercase tracking-wide">
                  {m.title}
                </span>
                <Icon className={`w-4 h-4 ${m.color}`} />
              </div>
              <div>
                <h4 className="text-xl font-mono font-bold text-white tracking-tight">{m.value}</h4>
                <p className="text-[10px] text-[#94A3B8] font-mono mt-0.5">{m.sub}</p>
              </div>
            </div>
          );
        })}
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Column: Energy Draw Chart */}
        {mounted && (
          <div className="xl:col-span-2 bg-glass-card border border-[rgba(0,229,255,0.1)] rounded-xl p-4 space-y-4 h-[400px]">
            <h3 className="text-xs font-heading font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#00D084]" />
              Stadium Energy Grid Balance (Grid Draw vs Solar Offset)
            </h3>
            <div className="h-72 w-full font-mono text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={energyDrawData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorGrid" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorSolar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00d084" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#00d084" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(248, 250, 252, 0.05)" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ backgroundColor: "#132238", borderColor: "rgba(0,229,255,0.2)" }} />
                  <Area type="monotone" dataKey="grid" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorGrid)" name="Main Grid Load (kW)" />
                  <Area type="monotone" dataKey="solar" stroke="#00d084" strokeWidth={2} fillOpacity={1} fill="url(#colorSolar)" name="Solar Batteries Offset (kW)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Right Column: AI Eco Advisor */}
        <div className="xl:col-span-1 bg-glass-card border border-[rgba(0,229,255,0.1)] p-4 rounded-xl flex flex-col justify-between h-[400px]">
          <div className="space-y-4">
            <h3 className="font-heading font-bold text-sm text-[#00D084] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#00D084] animate-pulse" />
              AI Sustainability Advisor
            </h3>

            <div className="bg-[rgba(7,17,31,0.4)] border border-white/5 p-3.5 rounded-lg space-y-3">
              <div className="flex gap-2 items-center text-[10px] font-mono text-[#FACC15]">
                <Sliders className="w-3.5 h-3.5" />
                <span>ECO RECOMENDATION ACTIVE</span>
              </div>
              <p className="text-xs text-white leading-relaxed">
                Recycling sorting efficiency in the East Stand concourse is currently 82.5% (against the target threshold of 85.0%). Advise displaying sorting guidance reminders on concourse video walls.
              </p>
              <div className="text-[10px] font-mono text-[#94A3B8] border-t border-[rgba(248,250,252,0.05)] pt-2.5">
                Expected sorting gain: <strong className="text-[#00D084]">+3.2%</strong>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => handleEcoOverride("Concourse video wall recycling loops")}
              className="w-full py-2.5 rounded bg-[#00D084] text-[#07111F] text-xs font-mono font-bold hover:brightness-110 transition-all flex items-center justify-center gap-1.5 shadow-[0_0_12px_rgba(0,208,132,0.25)]"
            >
              ENGAGE VIDEO OVERLAYS <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleEcoOverride("Solar Battery Grid dispatch offset")}
              className="w-full py-2.5 rounded bg-[rgba(248,250,252,0.05)] border border-white/5 text-white text-xs font-mono hover:bg-[rgba(248,250,252,0.1)] transition-all flex items-center justify-center"
            >
              DISPATCH SOLAR RESERVES BUFFER
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
