"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { LineChart as ChartIcon, Calendar } from "lucide-react";
import toast from "react-hot-toast";


const incidentsData = [
  { name: "Crowd", count: 42, color: "#00E5FF" },
  { name: "Transit", count: 28, color: "#3B82F6" },
  { name: "Security", count: 14, color: "#FF4D6D" },
  { name: "Medical", count: 22, color: "#FF4D6D" },
  { name: "Accessibility", count: 19, color: "#FACC15" },
  { name: "Operations", count: 25, color: "#94A3B8" }
];

const attendanceTrends = [
  { match: "Match 1", fans: 82000, target: 90000 },
  { match: "Match 2", fans: 85500, target: 90000 },
  { match: "Match 3", fans: 88450, target: 90000 },
  { match: "Match 4", fans: 89100, target: 90000 }
];

const volunteerPerformance = [
  { group: "A (Crowd)", response: 4.2 },
  { group: "B (Gates)", response: 3.8 },
  { group: "C (Standby)", response: 5.1 },
  { group: "D (Accessibility)", response: 2.9 } // Fastest
];

const vendorSalesBreakdown = [
  { name: "Beverages", sales: 142000 },
  { name: "Snacks", sales: 98000 },
  { name: "Hot Meals", sales: 120000 },
  { name: "Merchandise", sales: 52480 }
];

export default function AnalyticsPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[rgba(248,250,252,0.05)]">
        <div>
          <h1 className="font-heading font-bold text-xl text-white tracking-wide flex items-center gap-2">
            <ChartIcon className="w-5.5 h-5.5 text-[#00E5FF]" />
            ENTERPRISE ANALYTICS INDEX
          </h1>
          <p className="text-xs text-[#94A3B8] font-mono mt-0.5">
            TOURNAMENT TELEMETRY HISTOGRAMS // REVENUE & LOGISTICS INTELLIGENCE
          </p>
        </div>
        
        <button
          onClick={() => toast.success("Refreshed analytical database.")}
          className="h-9 px-3 text-xs font-mono font-bold bg-[#101C2D] border border-white/5 text-white hover:bg-[#132238] rounded-md transition-all flex items-center gap-1.5"
        >
          <Calendar className="w-3.5 h-3.5" /> SELECT MATCH TELEMETRY
        </button>
      </div>

      {mounted && (
        <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Chart 1: Attendance Growth */}
          <div className="bg-glass-card border border-[rgba(0,229,255,0.1)] rounded-xl p-4 space-y-4">
            <h3 className="text-xs font-heading font-bold text-white uppercase tracking-wider">
              Attendance Trends vs Capacity Targets
            </h3>
            <div className="h-60 w-full font-mono text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={attendanceTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorFans" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00e5ff" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#00e5ff" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(248, 250, 252, 0.05)" />
                  <XAxis dataKey="match" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ backgroundColor: "#132238", borderColor: "rgba(0,229,255,0.2)" }} />
                  <Area type="monotone" dataKey="fans" stroke="#00e5ff" strokeWidth={2} fillOpacity={1} fill="url(#colorFans)" name="Attendance" />
                  <Area type="monotone" dataKey="target" stroke="#ff4d6d" strokeWidth={1} strokeDasharray="4 4" fill="none" name="Max Buffer" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Security Incidents Breakdown */}
          <div className="bg-glass-card border border-[rgba(0,229,255,0.1)] rounded-xl p-4 space-y-4">
            <h3 className="text-xs font-heading font-bold text-white uppercase tracking-wider">
              Anomalies Frequency Index by Category
            </h3>
            <div className="h-60 w-full font-mono text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={incidentsData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(248, 250, 252, 0.05)" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ backgroundColor: "#132238", borderColor: "rgba(0,229,255,0.2)" }} />
                  <Bar dataKey="count" fill="#ff4d6d" radius={[4, 4, 0, 0]} name="Incident Count" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 3: Volunteer Response Latency */}
          <div className="bg-glass-card border border-[rgba(0,229,255,0.1)] rounded-xl p-4 space-y-4">
            <h3 className="text-xs font-heading font-bold text-white uppercase tracking-wider">
              Volunteer Team Response Latency (minutes)
            </h3>
            <div className="h-60 w-full font-mono text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={volunteerPerformance} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(248, 250, 252, 0.05)" />
                  <XAxis dataKey="group" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ backgroundColor: "#132238", borderColor: "rgba(0,229,255,0.2)" }} />
                  <Bar dataKey="response" fill="#00d084" radius={[4, 4, 0, 0]} name="Response time" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 4: Sales Revenue Breakdown */}
          <div className="bg-glass-card border border-[rgba(0,229,255,0.1)] rounded-xl p-4 space-y-4">
            <h3 className="text-xs font-heading font-bold text-white uppercase tracking-wider">
              Sales Revenue Concessions Split
            </h3>
            <div className="h-60 w-full font-mono text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={vendorSalesBreakdown} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(248, 250, 252, 0.05)" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ backgroundColor: "#132238", borderColor: "rgba(0,229,255,0.2)" }} />
                  <Area type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={2} fill="rgba(59,130,246,0.1)" name="POS Sales ($)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
