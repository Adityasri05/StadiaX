"use client";

import { useStadiaStore } from "@/store/useStadiaStore";
import {
  FileText,
  Download,
  Calendar,
  Layers,
  CheckCircle,
  FileSpreadsheet
} from "lucide-react";
import toast from "react-hot-toast";

export default function ReportsPage() {
  const { incidents, simulationMode } = useStadiaStore();
  const activeCount = incidents.filter(i => i.status !== "Resolved").length;

  const reportCards = [
    {
      title: "Operational Report",
      date: "18 July 2026",
      desc: "Full log of concourse operations, smart ventilation statuses, elevator outages, and gate capacity indexes.",
      metrics: `Active Incidents: ${activeCount} // Environment: ${simulationMode}`
    },
    {
      title: "Security & Incidents Report",
      date: "18 July 2026",
      desc: "Detailed registry of perimeter alarms, visual bag checks, K9 deployments, and crowd control overrides.",
      metrics: "Incident Response Time: 3.4 mins avg"
    },
    {
      title: "Vendor POS Report",
      date: "18 July 2026",
      desc: "POS transactions revenue, food court queue wait times, halal/vegetarian supply stocks, and waste estimations.",
      metrics: "Live Revenue: $412,480 // Outage Risks: 1"
    },
    {
      title: "Transportation & Transit Report",
      date: "18 July 2026",
      desc: "Metro East Hub boarding speeds, shuttle loop turnarounds, rideshare lane queues, and Car Park space checks.",
      metrics: "Metro Wait Peak: 4.5m // Shuttles: 12 active"
    },
    {
      title: "Crowd Flow Dynamics Report",
      date: "18 July 2026",
      desc: "Concourse densities, gate validation flows, bottleneck forecasts, and volunteer staff allocation matrices.",
      metrics: "Dispersal Risk Index: MODERATE"
    },
    {
      title: "Environmental & Eco Report",
      date: "18 July 2026",
      desc: "Solar grids battery feeding logs, recycled rainwater consumption ratios, carbon footprint levels, and food compost rates.",
      metrics: "Solar battery cap: 85% // Green index: 94.8%"
    }
  ];

  const handleDownload = (format: "PDF" | "CSV", title: string) => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: `Compiling analytical data for ${title}...`,
        success: `${title} successfully downloaded as ${format}.`,
        error: "Failed to generate file."
      },
      {
        style: {
          background: "#101C2D",
          border: "1px solid rgba(0, 229, 255, 0.2)",
          color: "#F8FAFC"
        }
      }
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[rgba(248,250,252,0.05)]">
        <div>
          <h1 className="font-heading font-bold text-xl text-white tracking-wide flex items-center gap-2">
            <FileText className="w-5.5 h-5.5 text-[#00E5FF]" />
            EXECUTIVE REPORT EXPORTER
          </h1>
          <p className="text-xs text-[#94A3B8] font-mono mt-0.5">
            GENERATE CRYPTO-SIGNED COMPLIANCE FILESETS // FIFA AUDITING GATEWAY
          </p>
        </div>
      </div>

      {/* Reports Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {reportCards.map((rep, idx) => (
          <div
            key={idx}
            className="p-5 rounded-xl bg-glass-card border border-[rgba(0,229,255,0.07)] hover:border-[#00E5FF]/30 transition-all flex flex-col justify-between gap-4 group relative overflow-hidden"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-[#94A3B8] flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#00E5FF]" /> {rep.date}
                </span>
                <span className="text-[8px] font-mono bg-[rgba(0,229,255,0.1)] text-[#00E5FF] px-1.5 py-0.5 rounded font-bold uppercase">
                  SECURE SIGNED
                </span>
              </div>
              
              <h3 className="text-sm font-heading font-bold text-white tracking-wide group-hover:text-[#00E5FF] transition-all">
                {rep.title}
              </h3>
              
              <p className="text-[11px] text-[#94A3B8] leading-relaxed">
                {rep.desc}
              </p>
            </div>

            <div className="pt-3 border-t border-[rgba(248,250,252,0.04)] space-y-3">
              <div className="text-[9px] font-mono text-[#00D084] truncate">
                <span className="text-white font-semibold">Live telemetry:</span> {rep.metrics}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleDownload("PDF", rep.title)}
                  className="flex-1 py-1.5 rounded bg-[#00E5FF] text-[#07111F] text-[10px] font-mono font-bold hover:brightness-110 transition-all flex items-center justify-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" /> PDF
                </button>
                <button
                  onClick={() => handleDownload("CSV", rep.title)}
                  className="flex-1 py-1.5 rounded bg-[rgba(248,250,252,0.05)] border border-white/5 text-white text-[10px] font-mono hover:bg-[rgba(248,250,252,0.1)] transition-all flex items-center justify-center gap-1"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-[#94A3B8]" /> CSV
                </button>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
