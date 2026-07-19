"use client";

import { useState } from "react";

import {
  Settings2,
  CheckSquare,
  Square,
  Sliders,
  Wrench,
  Sparkles,
  RefreshCw
} from "lucide-react";
import toast from "react-hot-toast";

interface OpTask {
  id: string;
  title: string;
  category: "Gate" | "Cleaning" | "Maintenance" | "HVAC";
  status: "Normal" | "Attention" | "Dispatched" | "Complete";
  desc: string;
}

export default function OperationsPage() {

  const [tasks, setTasks] = useState<OpTask[]>([
    { id: "op-1", category: "Maintenance", title: "Elevator B-3 Technicians Dispatch", status: "Dispatched", desc: "Contractor is on-site repairing block B hydraulic guide." },
    { id: "op-2", category: "Cleaning", title: "Concourse 2 West Restrooms Sanitization", status: "Attention", desc: "Cleaners flagged for urgent restocking. High occupancy." },
    { id: "op-3", category: "HVAC", title: "Sector 108 Smart Airflow Boost", status: "Normal", desc: "Cooling nodes adjusted to +12% flow to maintain 21.5°C." },
    { id: "op-4", category: "Gate", title: "Gate 6 Aux Lanes Release", status: "Complete", desc: "4 standby validation gates opened. Flow stabilized." },
    { id: "op-5", category: "Maintenance", title: "Sector 204 Ramp Lights Inspection", status: "Attention", desc: "Flickering row lights reported by volunteer team D." }
  ]);

  const handleToggleTaskStatus = (taskId: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        const nextStatus = task.status === "Complete" ? "Attention" : "Complete";
        toast(`Task marked as ${nextStatus}`, { icon: "📝" });
        return { ...task, status: nextStatus };
      }
      return task;
    }));
  };

  const handleCoolingBoost = () => {
    toast.success("HVAC smart cooling grid boost applied (+15% output).", {
      icon: "❄️"
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[rgba(248,250,252,0.05)]">
        <div>
          <h1 className="font-heading font-bold text-xl text-white tracking-wide flex items-center gap-2">
            <Settings2 className="w-5.5 h-5.5 text-[#00E5FF]" />
            EXECUTIVE OPERATIONS COMMAND
          </h1>
          <p className="text-xs text-[#94A3B8] font-mono mt-0.5">
            CORE FACILITY LOGISTICS // MAINTENANCE & HVAC DEPLOYMENTS
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Column: Core Facility Logistics checklist */}
        <div className="xl:col-span-2 bg-glass-card border border-[rgba(0,229,255,0.1)] rounded-xl flex flex-col overflow-hidden h-[520px]">
          <div className="p-4 bg-[rgba(16,28,45,0.8)] border-b border-[rgba(248,250,252,0.05)] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-[#00E5FF]" />
              <h3 className="font-heading font-bold text-sm text-white font-sans">Facility Operations Checklist</h3>
            </div>
            <span className="text-[10px] font-mono text-[#94A3B8] uppercase">Toggles status</span>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3.5">
            {tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => handleToggleTaskStatus(task.id)}
                className={`p-3.5 rounded-xl border flex items-start gap-3.5 cursor-pointer transition-all hover:bg-[rgba(248,250,252,0.01)] ${
                  task.status === "Complete"
                    ? "bg-[rgba(0,208,132,0.02)] border-[#00D084]/20 opacity-70"
                    : task.status === "Attention"
                    ? "bg-[rgba(250,204,21,0.02)] border-[#FACC15]/20"
                    : "bg-[rgba(19,34,56,0.3)] border-white/5"
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {task.status === "Complete" ? (
                    <CheckSquare className="w-4.5 h-4.5 text-[#00D084]" />
                  ) : (
                    <Square className="w-4.5 h-4.5 text-[#94A3B8] hover:text-[#00E5FF]" />
                  )}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-center">
                    <h5 className={`text-xs font-bold font-sans ${task.status === "Complete" ? "line-through text-[#94A3B8]" : "text-white"}`}>
                      {task.title}
                    </h5>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-bold font-mono tracking-wider ${
                      task.status === "Complete"
                        ? "bg-[#00D084]/15 text-[#00D084]"
                        : task.status === "Attention"
                        ? "bg-[#FACC15]/15 text-[#FACC15]"
                        : "bg-[#3B82F6]/15 text-[#3B82F6]"
                    }`}>
                      {task.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#94A3B8] leading-relaxed">{task.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: AI Summary & Facility Tuner */}
        <div className="xl:col-span-1 space-y-6">
          {/* Executive AI Operations summary */}
          <div className="bg-glass-card border border-[rgba(0,229,255,0.1)] p-4 rounded-xl flex flex-col justify-between h-[250px]">
            <div className="space-y-3">
              <h3 className="font-heading font-bold text-sm text-[#00E5FF] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#00E5FF] animate-pulse" />
                Executive AI Ops Summary
              </h3>

              <div className="bg-[rgba(7,17,31,0.4)] border border-white/5 p-3 rounded-lg space-y-2">
                <div className="flex justify-between text-[10px] font-mono text-[#94A3B8]">
                  <span>STAFF UPTIME:</span>
                  <span className="text-[#00D084] font-bold">98.5%</span>
                </div>
                <div className="flex justify-between text-[10px] font-mono text-[#94A3B8]">
                  <span>HVAC LOAD:</span>
                  <span className="text-[#00D084] font-bold">NOMINAL</span>
                </div>
                <div className="flex justify-between text-[10px] font-mono text-[#94A3B8]">
                  <span>CLEANLINESS INDEX:</span>
                  <span className="text-[#00E5FF] font-bold">94/100</span>
                </div>
              </div>
              <p className="text-[11px] text-[#94A3B8] leading-relaxed">
                Elevator B-3 is the only active system fault. Hydration levels and ventilation indices in the East Stand are operating within safety parameters.
              </p>
            </div>
            
            <div className="text-[9px] font-mono text-[#94A3B8]/60 flex items-center gap-1.5 pt-2 border-t border-[rgba(248,250,252,0.05)]">
              <RefreshCw className="w-3 h-3 animate-spin text-[#00E5FF]" />
              <span>Operations telemetry synced 3s ago</span>
            </div>
          </div>

          {/* Smart facility tuner */}
          <div className="bg-glass-card border border-[rgba(0,229,255,0.1)] p-4 rounded-xl space-y-4">
            <h3 className="font-heading font-bold text-sm text-white flex items-center gap-2">
              <Sliders className="w-4.5 h-4.5 text-[#00E5FF]" />
              Smart Grid Tuner
            </h3>

            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono text-[#94A3B8]">
                  <span>SMART HVAC COOLING RATE</span>
                  <span className="text-white font-bold">18.5°C Target</span>
                </div>
                <div className="w-full bg-[rgba(248,250,252,0.05)] h-2 rounded-full overflow-hidden">
                  <div className="bg-[#00E5FF] h-full w-[78%]" />
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono text-[#94A3B8]">
                  <span>SOLAR BATTERY GRID CAP</span>
                  <span className="text-[#00D084] font-bold">85% Charging</span>
                </div>
                <div className="w-full bg-[rgba(248,250,252,0.05)] h-2 rounded-full overflow-hidden">
                  <div className="bg-[#00D084] h-full w-[85%]" />
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={handleCoolingBoost}
                className="flex-1 py-2 rounded bg-[#00E5FF] text-[#07111F] text-[10px] font-mono font-bold hover:brightness-110 transition-all flex items-center justify-center gap-1"
              >
                <Wrench className="w-3.5 h-3.5" /> DISPATCH COOLING BOOST
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
