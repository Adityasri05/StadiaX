"use client";

import { useEffect, useState } from "react";
import { useStadiaStore } from "@/store/useStadiaStore";
import {
  Store,
  TrendingUp,
  AlertTriangle,
  Zap,
  ShoppingBag,
  TrendingDown,
  ArrowRight,
  ClipboardList
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

const demandData = [
  { name: "Min 15", sales: 40, limit: 120 },
  { name: "Min 30", sales: 55, limit: 120 },
  { name: "Min 45 (Half-time)", sales: 180, limit: 120 }, // Surge
  { name: "Min 60", sales: 60, limit: 120 },
  { name: "Min 75", sales: 95, limit: 120 },
  { name: "Min 90 (End)", sales: 210, limit: 120 } // Extreme surge
];

export default function VendorIntelligencePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const handleRestock = (concession: string, item: string) => {
    toast.success(`Restock order dispatched for ${item} at ${concession}.`, {
      icon: "📦"
    });
  };

  const inventoryItems = [
    { name: "Halal Chicken Shawarma", stock: 85, threshold: 30, salesRate: "+18/m", status: "Optimal" },
    { name: "Vegetarian Hummus Wraps", stock: 68, threshold: 25, salesRate: "+8/m", status: "Optimal" },
    { name: "Halal Beef Hotdogs", stock: 12, threshold: 40, salesRate: "+32/m", status: "Restock Alert" },
    { name: "Stadium Commemorative Cup", stock: 94, threshold: 15, salesRate: "+5/m", status: "Optimal" }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[rgba(248,250,252,0.05)]">
        <div>
          <h1 className="font-heading font-bold text-xl text-white tracking-wide flex items-center gap-2">
            <Store className="w-5.5 h-5.5 text-[#3B82F6]" />
            CONCESSION VENDOR INTELLIGENCE
          </h1>
          <p className="text-xs text-[#94A3B8] font-mono mt-0.5">
            REAL-TIME POS TRANSACTION telemetry // SUPPLY CHAIN RESTOCKING ALIGNMENTS
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-glass-card p-4 rounded-xl border border-[rgba(0,229,255,0.1)] flex items-center justify-between">
          <div>
            <p className="text-[10px] font-mono text-[#94A3B8] uppercase">Total Sales Revenue (Live)</p>
            <h4 className="text-xl font-mono font-bold text-[#00D084]">$412,480</h4>
            <span className="text-[10px] text-[#00D084] font-mono">+12.4% vs last match</span>
          </div>
          <TrendingUp className="w-8 h-8 text-[#00D084] opacity-50" />
        </div>

        <div className="bg-glass-card p-4 rounded-xl border border-[rgba(0,229,255,0.1)] flex items-center justify-between">
          <div>
            <p className="text-[10px] font-mono text-[#94A3B8] uppercase">Average POS Queue wait</p>
            <h4 className="text-xl font-mono font-bold text-white">3.2 mins</h4>
            <span className="text-[10px] text-[#FF4D6D] font-mono">Concourse 3 peak queue alert</span>
          </div>
          <TrendingUp className="w-8 h-8 text-[#FF4D6D] opacity-50" />
        </div>

        <div className="bg-glass-card p-4 rounded-xl border border-[rgba(0,229,255,0.1)] flex items-center justify-between">
          <div>
            <p className="text-[10px] font-mono text-[#94A3B8] uppercase">Predicted food waste</p>
            <h4 className="text-xl font-mono font-bold text-white">4.2%</h4>
            <span className="text-[10px] text-[#00D084] font-mono">Target benchmark &lt; 5.0%</span>
          </div>
          <TrendingDown className="w-8 h-8 text-[#00D084] opacity-50" />
        </div>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Column: Popular & Low Stock Items */}
        <div className="xl:col-span-2 bg-glass-card border border-[rgba(0,229,255,0.1)] rounded-xl p-4 flex flex-col justify-between h-[450px]">
          <div className="space-y-4">
            <h3 className="text-xs font-heading font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-[#00E5FF]" />
              Concessions Inventory Monitor
            </h3>
            
            <div className="space-y-4">
              {inventoryItems.map((item, idx) => (
                <div key={idx} className="p-3 bg-[rgba(16,28,45,0.4)] border border-white/5 rounded-lg space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-white">{item.name}</span>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-bold font-mono tracking-wider ${
                      item.status === "Optimal"
                        ? "bg-[#00D084]/15 text-[#00D084]"
                        : "bg-[#FF4D6D]/15 text-[#FF4D6D] animate-pulse"
                    }`}>
                      {item.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-[10px] font-mono text-[#94A3B8]">
                    <span>Stock: {item.stock} units (Threshold: {item.threshold})</span>
                    <span>Rate: {item.salesRate}</span>
                  </div>

                  <div className="w-full bg-[rgba(248,250,252,0.05)] h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${item.stock <= item.threshold ? "bg-[#FF4D6D]" : "bg-[#3B82F6]"}`} 
                      style={{ width: `${item.stock}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Demand Forecast & Restocking Trigger */}
        <div className="xl:col-span-1 space-y-6">
          {/* Recharts chart inside container */}
          {mounted && (
            <div className="bg-glass-card border border-[rgba(0,229,255,0.1)] rounded-xl p-4 space-y-4 h-[260px]">
              <h3 className="text-[10px] font-mono text-[#94A3B8] uppercase flex items-center gap-1">
                <ShoppingBag className="w-3.5 h-3.5 text-[#00E5FF]" />
                Halftime Sales Surge Predictor
              </h3>
              <div className="h-40 w-full font-mono text-[10px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={demandData} margin={{ top: 10, right: 10, left: -30, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(248, 250, 252, 0.05)" />
                    <XAxis dataKey="name" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip contentStyle={{ backgroundColor: "#132238", borderColor: "rgba(0,229,255,0.2)" }} />
                    <Area type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorSales)" name="POS Transactions" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Quick restock dispatch */}
          <div className="bg-glass-card border border-[rgba(0,229,255,0.1)] p-4 rounded-xl space-y-4">
            <h3 className="font-heading font-bold text-sm text-[#00E5FF] flex items-center gap-2">
              <Zap className="w-4.5 h-4.5 text-[#00E5FF] animate-pulse" />
              AI Stocking Optimizer
            </h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Halal beef hotdogs are at 12% capacity at Concourse 3 North. AI predicts complete outage within 8 minutes. Restock from supply Bay D now.
            </p>
            <button
              onClick={() => handleRestock("Concourse 3 North", "Halal Beef Hotdogs")}
              className="w-full py-2 rounded bg-[#00E5FF] text-[#07111F] text-[10px] font-mono font-bold hover:brightness-110 transition-all flex items-center justify-center gap-1.5 shadow-[0_0_12px_rgba(0,229,255,0.25)]"
            >
              APPROVE RESTOCK DEPLOYMENT <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
