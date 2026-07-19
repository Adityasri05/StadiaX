"use client";

import { useStadiaStore } from "@/store/useStadiaStore";
import { Activity, X } from "lucide-react";
import toast from "react-hot-toast";


interface MapVisualizerProps {
  /** If true, expands the map visualizer to take up full available layout container dimensions */
  fullscreen?: boolean;
}

/**
 * MapVisualizer Component
 * Renders the interactive 2D vector SVG stadium blueprint overlaying seats,
 * entrances, gates, elevators, first-aid, food zones, and evacuations.
 * Subscribes to mapLayers, selected sector, selected gate, and path overlays.
 */
export default function MapVisualizer({ fullscreen = false }: MapVisualizerProps) {

  const {
    mapLayers,
    selectedSector,
    selectedGate,
    activeRouteType,
    setSelectedSector,
    setSelectedGate,
    simulationMode
  } = useStadiaStore();

  const handleSectorClick = (sectorId: string) => {
    setSelectedSector(selectedSector === sectorId ? null : sectorId);
    setSelectedGate(null);
    toast(`Sector ${sectorId} telemetry loaded.`, { icon: "📊" });
  };

  const handleGateClick = (gateId: string) => {
    setSelectedGate(selectedGate === gateId ? null : gateId);
    setSelectedSector(null);
    toast(`Gate ${gateId} security telemetry loaded.`, { icon: "🔒" });
  };

  // Mock telemetry data based on sector/gate selections
  const getSectorTelemetry = (sector: string) => {
    switch (sector) {
      case "North":
        return { occupancy: 84, temp: "21.5°C", flowRate: "120 p/m", status: "Nominal" };
      case "South":
        return { occupancy: 95, temp: "22.8°C", flowRate: "70 p/m", status: "Nominal" };
      case "East":
        return { occupancy: 98, temp: "22.1°C", flowRate: "45 p/m", status: "Crowded" };
      case "West":
        return { occupancy: 78, temp: "20.9°C", flowRate: "160 p/m", status: "Nominal" };
      default:
        return { occupancy: 0, temp: "0°C", flowRate: "0 p/m", status: "Unknown" };
    }
  };

  const getGateTelemetry = (gate: string) => {
    const numbers: Record<string, { queueTime: string; flowRate: string; density: string; status: string }> = {
      "Gate 4": { queueTime: "11 mins", flowRate: "35 p/m", density: "Critical (94%)", status: "Bottleneck" },
      "Gate 6": { queueTime: "2 mins", flowRate: "125 p/m", density: "Low (30%)", status: "Clear" },
      "Gate 8": { queueTime: "4 mins", flowRate: "70 p/m", density: "Medium (55%)", status: "Security Sweep" }
    };
    return numbers[gate] || { queueTime: "1 min", flowRate: "180 p/m", density: "Optimal (15%)", status: "Optimal" };
  };

  const activeSectorData = selectedSector ? getSectorTelemetry(selectedSector) : null;
  const activeGateData = selectedGate ? getGateTelemetry(selectedGate) : null;

  return (
    <div className={`relative bg-[#101C2D]/60 border border-[rgba(0,229,255,0.1)] rounded-xl overflow-hidden flex flex-col ${fullscreen ? "h-[calc(100vh-10rem)]" : "h-[450px]"}`}>
      {/* HUD Watermark */}
      <div className="absolute top-4 left-4 pointer-events-none z-10 font-mono text-[9px] text-[#94A3B8] tracking-widest leading-relaxed">
        <div>STADIAX VECTOR RENDER (VIRTUAL VIEW)</div>
        <div>LATENCY: 12MS // LAYER FILTER: ACTIVE</div>
        {simulationMode !== "Normal" && (
          <div className="text-[#FF4D6D] font-bold animate-pulse">OVERRIDE ACTIVE: {simulationMode.toUpperCase()} SIM</div>
        )}
      </div>

      {/* SVG Canvas Map */}
      <div className="flex-1 flex items-center justify-center p-6 relative">
        <svg
          viewBox="0 0 800 500"
          className="w-full h-full max-h-[420px] select-none"
        >
          {/* Outer Transit Ring */}
          <circle cx="400" cy="250" r="230" fill="none" stroke="rgba(59, 130, 246, 0.05)" strokeWidth="2" strokeDasharray="5,5" />
          
          {/* Car Park A & B representation */}
          <rect x="50" y="200" width="70" height="100" rx="6" fill="rgba(19, 34, 56, 0.3)" stroke="rgba(0, 229, 255, 0.08)" />
          <text x="85" y="255" textAnchor="middle" fill="#94A3B8" className="text-[10px] font-mono">PARK A</text>

          <rect x="680" y="200" width="70" height="100" rx="6" fill="rgba(19, 34, 56, 0.3)" stroke="rgba(0, 229, 255, 0.08)" />
          <text x="715" y="255" textAnchor="middle" fill="#94A3B8" className="text-[10px] font-mono">PARK B</text>

          {/* Metro East Station Representation */}
          {mapLayers.transport && (
            <g className="animate-pulse">
              <rect x="360" y="20" width="80" height="30" rx="4" fill="rgba(59, 130, 246, 0.15)" stroke="#3B82F6" strokeWidth="1" />
              <text x="400" y="38" textAnchor="middle" fill="#3B82F6" className="text-[9px] font-mono font-bold">METRO EAST</text>
            </g>
          )}

          {/* Interactive Routing Overlays */}
          {activeRouteType && (
            <path
              d="M 85,250 C 200,200 300,150 400,210 C 440,230 460,250 470,250"
              fill="none"
              stroke={activeRouteType === "wheelchair" ? "#FACC15" : activeRouteType === "safest" ? "#00D084" : "#00E5FF"}
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="6,4"
              className="animate-[dash_2s_linear_infinite]"
              style={{
                strokeDashoffset: 10
              }}
            />
          )}

          {/* Seating Sectors (North, South, East, West) */}
          {/* North Stand */}
          <path
            d="M 280,180 Q 400,120 520,180 L 550,150 Q 400,80 250,150 Z"
            fill={selectedSector === "North" ? "rgba(0, 229, 255, 0.2)" : mapLayers.crowdHeatmap ? "rgba(0, 208, 132, 0.2)" : "rgba(19, 34, 56, 0.6)"}
            stroke={selectedSector === "North" ? "#00E5FF" : "rgba(0, 229, 255, 0.15)"}
            strokeWidth={selectedSector === "North" ? 2 : 1}
            onClick={() => handleSectorClick("North")}
            className="cursor-pointer transition-all hover:fill-[rgba(0,229,255,0.15)]"
          />
          <text x="400" y="130" textAnchor="middle" fill="#F8FAFC" className="text-[11px] font-heading font-bold pointer-events-none">NORTH STAND</text>

          {/* South Stand */}
          <path
            d="M 280,320 Q 400,380 520,320 L 550,350 Q 400,420 250,350 Z"
            fill={selectedSector === "South" ? "rgba(0, 229, 255, 0.2)" : mapLayers.crowdHeatmap ? "rgba(250, 204, 21, 0.2)" : "rgba(19, 34, 56, 0.6)"}
            stroke={selectedSector === "South" ? "#00E5FF" : "rgba(0, 229, 255, 0.15)"}
            strokeWidth={selectedSector === "South" ? 2 : 1}
            onClick={() => handleSectorClick("South")}
            className="cursor-pointer transition-all hover:fill-[rgba(0,229,255,0.15)]"
          />
          <text x="400" y="375" textAnchor="middle" fill="#F8FAFC" className="text-[11px] font-heading font-bold pointer-events-none">SOUTH STAND</text>

          {/* East Stand */}
          <path
            d="M 520,180 Q 580,250 520,320 L 550,350 Q 620,250 550,150 Z"
            fill={selectedSector === "East" ? "rgba(0, 229, 255, 0.2)" : mapLayers.crowdHeatmap ? "rgba(255, 77, 109, 0.25)" : "rgba(19, 34, 56, 0.6)"}
            stroke={selectedSector === "East" ? "#00E5FF" : "rgba(0, 229, 255, 0.15)"}
            strokeWidth={selectedSector === "East" ? 2 : 1}
            onClick={() => handleSectorClick("East")}
            className="cursor-pointer transition-all hover:fill-[rgba(0,229,255,0.15)]"
          />
          <text x="565" y="255" textAnchor="middle" fill="#F8FAFC" className="text-[11px] font-heading font-bold pointer-events-none" transform="rotate(90 565 255)">EAST STAND</text>

          {/* West Stand */}
          <path
            d="M 280,180 Q 220,250 280,320 L 250,350 Q 180,250 250,150 Z"
            fill={selectedSector === "West" ? "rgba(0, 229, 255, 0.2)" : mapLayers.crowdHeatmap ? "rgba(0, 208, 132, 0.15)" : "rgba(19, 34, 56, 0.6)"}
            stroke={selectedSector === "West" ? "#00E5FF" : "rgba(0, 229, 255, 0.15)"}
            strokeWidth={selectedSector === "West" ? 2 : 1}
            onClick={() => handleSectorClick("West")}
            className="cursor-pointer transition-all hover:fill-[rgba(0,229,255,0.15)]"
          />
          <text x="235" y="255" textAnchor="middle" fill="#F8FAFC" className="text-[11px] font-heading font-bold pointer-events-none" transform="rotate(-90 235 255)">WEST STAND</text>

          {/* Football Pitch Rendering in Center */}
          <rect x="310" y="195" width="180" height="110" rx="3" fill="rgba(0, 208, 132, 0.05)" stroke="rgba(0, 208, 132, 0.2)" strokeWidth="1.5" />
          <line x1="400" y1="195" x2="400" y2="305" stroke="rgba(0, 208, 132, 0.2)" strokeWidth="1.5" />
          <circle cx="400" cy="250" r="30" fill="none" stroke="rgba(0, 208, 132, 0.2)" strokeWidth="1.5" />

          {/* Security Gates */}
          {mapLayers.entrances && (
            <g>
              {/* Gate 4 - Congested */}
              <g onClick={() => handleGateClick("Gate 4")} className="cursor-pointer group">
                <circle cx="210" cy="200" r="14" fill="rgba(255, 77, 109, 0.2)" stroke="#FF4D6D" strokeWidth="2" className="animate-pulse" />
                <text x="210" y="204" textAnchor="middle" fill="#FF4D6D" className="text-[9px] font-mono font-bold">G4</text>
              </g>
              {/* Gate 6 - Clear */}
              <g onClick={() => handleGateClick("Gate 6")} className="cursor-pointer">
                <circle cx="590" cy="200" r="14" fill="rgba(0, 208, 132, 0.2)" stroke="#00D084" strokeWidth="2" />
                <text x="590" y="204" textAnchor="middle" fill="#00D084" className="text-[9px] font-mono font-bold">G6</text>
              </g>
              {/* Gate 8 - Security Sweep */}
              <g onClick={() => handleGateClick("Gate 8")} className="cursor-pointer">
                <circle cx="400" cy="420" r="14" fill="rgba(250, 204, 21, 0.2)" stroke="#FACC15" strokeWidth="2" />
                <text x="400" y="424" textAnchor="middle" fill="#FACC15" className="text-[9px] font-mono font-bold">G8</text>
              </g>
            </g>
          )}

          {/* Medical Icon overlay */}
          {mapLayers.medical && (
            <g className="pulsing-node text-[#FF4D6D]">
              <circle cx="510" cy="220" r="6" fill="#FF4D6D" />
              <rect x="508" y="217" width="4" height="6" fill="white" />
              <rect x="507" y="219" width="6" height="2" fill="white" />
            </g>
          )}

          {/* Food Court Icon Overlay */}
          {mapLayers.food && (
            <g className="text-[#00E5FF]">
              <circle cx="290" cy="280" r="7" fill="rgba(0, 229, 255, 0.15)" stroke="#00E5FF" strokeWidth="1" />
              <circle cx="290" cy="280" r="2.5" fill="#00E5FF" />
            </g>
          )}

          {/* Emergency Hazard icon if evac is running */}
          {simulationMode === "Evacuation" && (
            <g className="animate-bounce">
              <path d="M 400,230 L 415,260 L 385,260 Z" fill="#FF4D6D" stroke="#07111F" strokeWidth="1" />
              <text x="400" y="258" textAnchor="middle" fill="white" className="text-[10px] font-mono font-bold">!</text>
            </g>
          )}
        </svg>
      </div>

      {/* Selected Node Telemetry Sidebar */}
      {(selectedSector || selectedGate) && (
        <div className="absolute right-4 top-4 w-72 bg-[#132238]/90 border border-[#00E5FF]/30 rounded-xl p-4 shadow-[0_4px_30px_rgba(7,17,31,0.5)] backdrop-blur-md z-30">
          <div className="flex items-center justify-between pb-2 border-b border-[rgba(248,250,252,0.05)] mb-3">
            <h5 className="font-heading font-bold text-sm text-[#00E5FF] tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-[#00E5FF]" />
              {selectedSector ? `SECTOR: ${selectedSector.toUpperCase()}` : `SECURITY: ${selectedGate}`}
            </h5>
            <button
              onClick={() => {
                setSelectedSector(null);
                setSelectedGate(null);
              }}
              className="text-[#94A3B8] hover:text-white transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {selectedSector && activeSectorData && (
            <div className="space-y-2.5 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-[#94A3B8]">Occupancy:</span>
                <span className="text-white font-bold">{activeSectorData.occupancy}%</span>
              </div>
              <div className="w-full bg-[rgba(248,250,252,0.05)] h-1.5 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${activeSectorData.occupancy > 90 ? "bg-[#FF4D6D]" : "bg-[#00D084]"}`} 
                  style={{ width: `${activeSectorData.occupancy}%` }} 
                />
              </div>
              
              <div className="flex justify-between">
                <span className="text-[#94A3B8]">Thermal Level:</span>
                <span className="text-white font-semibold">{activeSectorData.temp}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#94A3B8]">Concourse Flow:</span>
                <span className="text-[#00E5FF] font-semibold">{activeSectorData.flowRate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#94A3B8]">Status Alert:</span>
                <span className={`font-bold ${activeSectorData.status === "Nominal" ? "text-[#00D084]" : "text-[#FF4D6D] animate-pulse"}`}>
                  {activeSectorData.status.toUpperCase()}
                </span>
              </div>
            </div>
          )}

          {selectedGate && activeGateData && (
            <div className="space-y-2.5 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-[#94A3B8]">Est. Queue Time:</span>
                <span className={`font-bold ${selectedGate === "Gate 4" ? "text-[#FF4D6D]" : "text-[#00D084]"}`}>
                  {activeGateData.queueTime}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#94A3B8]">Inflow Speed:</span>
                <span className="text-white font-semibold">{activeGateData.flowRate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#94A3B8]">Queue Density:</span>
                <span className="text-white font-semibold">{activeGateData.density}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#94A3B8]">Gate Status:</span>
                <span className={`font-bold ${activeGateData.status === "Clear" ? "text-[#00D084]" : "text-[#FF4D6D] animate-pulse"}`}>
                  {activeGateData.status.toUpperCase()}
                </span>
              </div>
              
              {selectedGate === "Gate 4" && (
                <div className="bg-[#FF4D6D]/10 border border-[#FF4D6D]/20 p-2.5 rounded text-[11px] text-[#FF4D6D] mt-3 font-sans leading-relaxed">
                  <strong>AI Intervention:</strong> Proposing Gate 6 bypass. Press Approve in recommended actions to engage signage rerouting.
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
