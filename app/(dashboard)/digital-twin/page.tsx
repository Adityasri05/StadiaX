"use client";

import { useStadiaStore } from "@/store/useStadiaStore";
import TwinVisualizer from "@/components/twin-visualizer";
import {
  Cpu,
  Play,
  Zap,
  Activity,
  Radio,
  Thermometer,
  ShieldAlert
} from "lucide-react";

import toast from "react-hot-toast";

export default function DigitalTwinPage() {
  const {
    simulationMode,
    setSimulationMode,
    attendance,
    openGates,
    transitStatus
  } = useStadiaStore();

  const handleModeChange = (mode: "Normal" | "Prediction" | "Emergency" | "Evacuation" | "Traffic" | "Energy") => {
    setSimulationMode(mode);
    toast.success(`Simulation mode initialized: ${mode} Mode`, {
      icon: "🕹️"
    });
  };

  // Dynamically adjust statistics based on simulationMode
  const getSimulationStats = () => {
    switch (simulationMode) {
      case "Evacuation":
        return {
          title: "Evacuation Telemetry",
          items: [
            { label: "Active Egress Gates", value: `${openGates}/24`, color: "text-[#00D084]" },
            { label: "Est. Clear Time", value: "8.5 mins", color: "text-[#FF4D6D]" },
            { label: "Evacuated Fans", value: "14%", color: "text-[#00E5FF]" },
            { label: "Safe Assembly Zones", value: "4/4 Active", color: "text-[#00D084]" }
          ]
        };
      case "Prediction":
        return {
          title: "Crowd Predictions (Next 15m)",
          items: [
            { label: "Gate 4 Max Delay", value: "11 mins", color: "text-[#FF4D6D]" },
            { label: "Gate 6 Flow Rate", value: "125 p/m", color: "text-[#00D084]" },
            { label: "Sector 108 Density", value: "92%", color: "text-[#FF4D6D]" },
            { label: "Restroom Wait Time", value: "90s (S-107)", color: "text-[#00E5FF]" }
          ]
        };
      case "Traffic":
        return {
          title: "Traffic & Transit Simulator",
          items: [
            { label: "Metro Headways", value: "150s", color: "text-[#00E5FF]" },
            { label: "Park B Congestion", value: "High (94%)", color: "text-[#FF4D6D]" },
            { label: "Rideshare Waiting", value: "4 mins", color: "text-[#00D084]" },
            { label: "Transit Network", value: transitStatus, color: "text-[#00E5FF]" }
          ]
        };
      case "Energy":
        return {
          title: "Thermal & Smart Grid Stats",
          items: [
            { label: "Cooling Node Sync", value: "94.2%", color: "text-[#00D084]" },
            { label: "Central Grid Load", value: "240 kW", color: "text-[#00E5FF]" },
            { label: "Solar Offset Ratio", value: "42.5%", color: "text-[#00D084]" },
            { label: "Water Conservation", value: "88.1%", color: "text-[#00D084]" }
          ]
        };
      default:
        return {
          title: "Standard Stadium Telemetry",
          items: [
            { label: "Total Occupancy", value: attendance.toLocaleString(), color: "text-[#00E5FF]" },
            { label: "Open Gates", value: `${openGates}/24`, color: "text-[#00D084]" },
            { label: "Cooling Power", value: "18.5°C avg", color: "text-[#00D084]" },
            { label: "Acoustic Levels", value: "98 dB", color: "text-[#FACC15]" }
          ]
        };
    }
  };

  const simStats = getSimulationStats();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[rgba(248,250,252,0.05)]">
        <div>
          <h1 className="font-heading font-bold text-xl text-white tracking-wide flex items-center gap-2">
            <Cpu className="w-5.5 h-5.5 text-[#00E5FF]" />
            DIGITAL TWIN COCKPIT
          </h1>
          <p className="text-xs text-[#94A3B8] font-mono mt-0.5">
            THREE.JS WebGL PHYSICS PLATFORM // REAL-TIME PARTICLES ENGINE
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 h-[calc(100vh-14rem)]">
        
        {/* Left Side: System Telemetry */}
        <div className="xl:col-span-1 bg-glass-card border border-[rgba(0,229,255,0.1)] rounded-xl flex flex-col overflow-hidden h-full">
          <div className="p-4 bg-[rgba(16,28,45,0.8)] border-b border-[rgba(248,250,252,0.05)] flex items-center gap-2 shrink-0">
            <Radio className="w-4 h-4 text-[#00E5FF] animate-pulse" />
            <h3 className="font-heading font-bold text-sm text-white">{simStats.title}</h3>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4 font-mono text-xs text-[#94A3B8]">
            <div className="space-y-4">
              {simStats.items.map((stat, idx) => (
                <div key={idx} className="p-2.5 rounded bg-[rgba(7,17,31,0.4)] border border-white/5 space-y-1">
                  <span className="text-[10px] text-[#94A3B8] uppercase block">{stat.label}</span>
                  <span className={`text-base font-bold ${stat.color}`}>{stat.value}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-[rgba(248,250,252,0.05)] space-y-2 font-sans">
              <span className="text-[10px] font-mono text-[#00E5FF] block">DIAGNOSTIC STATUS</span>
              <p className="text-[11px] leading-relaxed">
                Render frames circulating crowd nodes at 60 FPS. Gravity simulation enabled. Mouse drag canvas to rotate, scroll to zoom.
              </p>
            </div>
          </div>
        </div>

        {/* Center: 3D Twin Render Canvas */}
        <div className="xl:col-span-2 bg-[#07111F] border border-[rgba(0,229,255,0.1)] rounded-xl overflow-hidden relative h-full flex flex-col justify-between">
          
          {/* Compass overlay */}
          <div className="absolute top-4 left-4 pointer-events-none z-10 text-[9px] font-mono text-[#94A3B8] space-y-0.5">
            <div>3D PERSPECTIVE: WEBGL MODEL</div>
            <div>MESH DENSITY: 12,000 POLYGONS</div>
            <div className="text-[#00D084]">RENDER STATS: 60FPS // 12MS</div>
          </div>

          <TwinVisualizer simulationState={simulationMode} />

          {/* Canvas bottom controls overlay */}
          <div className="absolute bottom-4 left-4 right-4 bg-[#132238]/85 border border-[#00E5FF]/20 rounded-lg p-2.5 flex items-center justify-between z-10 text-[10px] font-mono">
            <span className="text-[#94A3B8]">GRID VIEW OPTION:</span>
            <span className="text-[#00E5FF] font-bold">ISOMETRIC 3D ROTATION</span>
          </div>
        </div>

        {/* Right Side: Simulation Controllers */}
        <div className="xl:col-span-1 bg-glass-card border border-[rgba(0,229,255,0.1)] rounded-xl flex flex-col overflow-hidden h-full">
          <div className="p-4 bg-[rgba(16,28,45,0.8)] border-b border-[rgba(248,250,252,0.05)] flex items-center gap-2 shrink-0">
            <Zap className="w-4 h-4 text-[#FACC15]" />
            <h3 className="font-heading font-bold text-sm text-white">Simulation Controls</h3>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-3.5 space-y-3 select-none">
            {/* Normal Mode */}
            <button
              onClick={() => handleModeChange("Normal")}
              className={`w-full p-3 rounded-lg border text-left flex flex-col gap-1 transition-all ${
                simulationMode === "Normal"
                  ? "bg-[rgba(0,208,132,0.05)] border-[#00D084] shadow-[0_0_12px_rgba(0,208,132,0.15)]"
                  : "bg-[rgba(19,34,56,0.3)] border-white/5 hover:border-[rgba(0,229,255,0.2)]"
              }`}
            >
              <div className="flex justify-between items-center w-full">
                <span className="text-xs font-bold text-white">Normal Operations</span>
                {simulationMode === "Normal" && <Activity className="w-3.5 h-3.5 text-[#00D084]" />}
              </div>
              <span className="text-[10px] text-[#94A3B8] leading-tight font-sans">
                Standard circulation, cooling grids normal, entry lanes balanced.
              </span>
            </button>

            {/* Prediction Mode */}
            <button
              onClick={() => handleModeChange("Prediction")}
              className={`w-full p-3 rounded-lg border text-left flex flex-col gap-1 transition-all ${
                simulationMode === "Prediction"
                  ? "bg-[rgba(0,229,255,0.05)] border-[#00E5FF] shadow-[0_0_12px_rgba(0,229,255,0.15)]"
                  : "bg-[rgba(19,34,56,0.3)] border-white/5 hover:border-[rgba(0,229,255,0.2)]"
              }`}
            >
              <div className="flex justify-between items-center w-full">
                <span className="text-xs font-bold text-white">Prediction Mode</span>
                {simulationMode === "Prediction" && <Play className="w-3.5 h-3.5 text-[#00E5FF]" />}
              </div>
              <span className="text-[10px] text-[#94A3B8] leading-tight font-sans">
                Forecast queue spikes, Gate 4 anomalies, and transit bottlenecks.
              </span>
            </button>

            {/* Evacuation Mode */}
            <button
              onClick={() => handleModeChange("Evacuation")}
              className={`w-full p-3 rounded-lg border text-left flex flex-col gap-1 transition-all ${
                simulationMode === "Evacuation"
                  ? "bg-[rgba(255,77,109,0.05)] border-[#FF4D6D] shadow-[0_0_12px_rgba(255,77,109,0.15)]"
                  : "bg-[rgba(19,34,56,0.3)] border-white/5 hover:border-[#FF4D6D]/30"
              }`}
            >
              <div className="flex justify-between items-center w-full">
                <span className="text-xs font-bold text-white">Evacuation Mode</span>
                {simulationMode === "Evacuation" && <ShieldAlert className="w-3.5 h-3.5 text-[#FF4D6D]" />}
              </div>
              <span className="text-[10px] text-[#94A3B8] leading-tight font-sans">
                Rapid crowd dispersion simulator. Standard gates overridden.
              </span>
            </button>

            {/* Traffic Mode */}
            <button
              onClick={() => handleModeChange("Traffic")}
              className={`w-full p-3 rounded-lg border text-left flex flex-col gap-1 transition-all ${
                simulationMode === "Traffic"
                  ? "bg-[rgba(250,204,21,0.05)] border-[#FACC15] shadow-[0_0_12px_rgba(250,204,21,0.15)]"
                  : "bg-[rgba(19,34,56,0.3)] border-white/5 hover:border-[rgba(0,229,255,0.2)]"
              }`}
            >
              <div className="flex justify-between items-center w-full">
                <span className="text-xs font-bold text-white">Traffic Mode</span>
                {simulationMode === "Traffic" && <Activity className="w-3.5 h-3.5 text-[#FACC15]" />}
              </div>
              <span className="text-[10px] text-[#94A3B8] leading-tight font-sans">
                Local shuttle dispatch synchronization and parking lot buffers.
              </span>
            </button>

            {/* Energy Mode */}
            <button
              onClick={() => handleModeChange("Energy")}
              className={`w-full p-3 rounded-lg border text-left flex flex-col gap-1 transition-all ${
                simulationMode === "Energy"
                  ? "bg-[rgba(0,208,132,0.05)] border-[#00D084] shadow-[0_0_12px_rgba(0,208,132,0.15)]"
                  : "bg-[rgba(19,34,56,0.3)] border-white/5 hover:border-[rgba(0,229,255,0.2)]"
              }`}
            >
              <div className="flex justify-between items-center w-full">
                <span className="text-xs font-bold text-white">Energy Mode</span>
                {simulationMode === "Energy" && <Thermometer className="w-3.5 h-3.5 text-[#00D084]" />}
              </div>
              <span className="text-[10px] text-[#94A3B8] leading-tight font-sans">
                Visualize building thermal maps, smart cooling grid offsets.
              </span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
