"use client";

import { useState } from "react";
import { useStadiaStore, MapLayers } from "@/store/useStadiaStore";
import MapVisualizer from "@/components/map-visualizer";
import {
  Compass,
  Layers,
  Search,
  CheckCircle,
  Clock,
  Accessibility,
  Heart,
  TrendingDown,
  Navigation2,
  X
} from "lucide-react";
import toast from "react-hot-toast";

export default function FullscreenMapPage() {
  const {
    mapLayers,
    toggleMapLayer,
    activeRouteType,
    setMapActiveRoute,
  } = useStadiaStore();

  const [searchQuery, setSearchQuery] = useState("");

  const layersList = [
    { key: "seats" as keyof MapLayers, label: "Seat Zones", color: "text-[#00E5FF]" },
    { key: "entrances" as keyof MapLayers, label: "Entrances / Gates", color: "text-[#00D084]" },
    { key: "exits" as keyof MapLayers, label: "Exit Gates", color: "text-[#FF4D6D]" },
    { key: "food" as keyof MapLayers, label: "Food Courts", color: "text-[#3B82F6]" },
    { key: "parking" as keyof MapLayers, label: "Parking Lots", color: "text-[#FACC15]" },
    { key: "medical" as keyof MapLayers, label: "Medical Rooms", color: "text-[#FF4D6D]" },
    { key: "emergency" as keyof MapLayers, label: "Emergency Zones", color: "text-[#FF4D6D]" },
    { key: "transport" as keyof MapLayers, label: "Transport Hubs", color: "text-[#3B82F6]" },
    { key: "security" as keyof MapLayers, label: "Security Hubs", color: "text-[#FACC15]" },
    { key: "restrooms" as keyof MapLayers, label: "Restrooms", color: "text-[#94A3B8]" },
    { key: "accessibility" as keyof MapLayers, label: "Accessibility Routes", color: "text-[#00E5FF]" },
    { key: "crowdHeatmap" as keyof MapLayers, label: "Crowd Heatmap", color: "text-[#FF4D6D]" },
  ];

  const routeTypes = [
    { id: "shortest", label: "Shortest Path", desc: "Minimal direct distance", distance: "280m", time: "3.5 min" },
    { id: "fastest", label: "Fastest Path", desc: "Bypasses queues & delays", distance: "390m", time: "2 min" },
    { id: "safest", label: "Safest Path", desc: "Optimized security coverage", distance: "420m", time: "5 min" },
    { id: "wheelchair", label: "Wheelchair Friendly", desc: "100% elevators & ramped", distance: "450m", time: "7 min" },
    { id: "family", label: "Family Friendly", desc: "Near restrooms & strollers", distance: "310m", time: "4.5 min" },
    { id: "least_crowded", label: "Least Crowded", desc: "Maximum personal space", distance: "480m", time: "6.5 min" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    toast.success(`Search completed: Target '${searchQuery}' highlighted on map.`, { icon: "🔍" });
    setSearchQuery("");
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[rgba(248,250,252,0.05)]">
        <div>
          <h1 className="font-heading font-bold text-xl text-white tracking-wide flex items-center gap-2">
            <Compass className="w-5.5 h-5.5 text-[#00E5FF]" />
            LIVE STADIUM MAP CONTROL
          </h1>
          <p className="text-xs text-[#94A3B8] font-mono mt-0.5">
            FULLSCREEN HUD // LAYERS & DIRECT VECTOR PATH OPTIMIZERS
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 h-[calc(100vh-14rem)]">
        {/* Left Side: Layer Manager */}
        <div className="xl:col-span-1 bg-glass-card border border-[rgba(0,229,255,0.1)] rounded-xl flex flex-col overflow-hidden h-full">
          <div className="p-4 bg-[rgba(16,28,45,0.8)] border-b border-[rgba(248,250,252,0.05)] flex items-center gap-2 shrink-0">
            <Layers className="w-4 h-4 text-[#00E5FF]" />
            <h3 className="font-heading font-bold text-sm text-white">Layer Selection</h3>
          </div>

          {/* Search Input */}
          <form onSubmit={handleSearch} className="p-3 border-b border-[rgba(248,250,252,0.04)] shrink-0">
            <div className="relative">
              <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search Gate, Sector, Restroom..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-8 pl-9 pr-3 bg-[rgba(7,17,31,0.5)] border border-[rgba(248,250,252,0.08)] focus:border-[#00E5FF] text-[11px] rounded outline-none text-white transition-all font-sans"
              />
            </div>
          </form>

          {/* Checklist of Layers */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2 select-none">
            {layersList.map((layer) => (
              <label
                key={layer.key}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-[rgba(248,250,252,0.02)] transition-all cursor-pointer border border-transparent hover:border-white/5"
              >
                <div className="flex items-center gap-2.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${layer.color}`} />
                  <span className="text-xs text-[#94A3B8] font-sans">{layer.label}</span>
                </div>
                <input
                  type="checkbox"
                  checked={mapLayers[layer.key]}
                  onChange={() => toggleMapLayer(layer.key)}
                  className="w-3.5 h-3.5 rounded accent-[#00E5FF] cursor-pointer"
                />
              </label>
            ))}
          </div>
        </div>

        {/* Center: Map */}
        <div className="xl:col-span-3 h-full">
          <MapVisualizer fullscreen={true} />
        </div>

        {/* Right Side: AI Route Optimizer */}
        <div className="xl:col-span-1 bg-glass-card border border-[rgba(0,229,255,0.1)] rounded-xl flex flex-col overflow-hidden h-full">
          <div className="p-4 bg-[rgba(16,28,45,0.8)] border-b border-[rgba(248,250,252,0.05)] flex items-center justify-between shrink-0">
            <h3 className="font-heading font-bold text-sm text-white flex items-center gap-2">
              <Navigation2 className="w-4 h-4 text-[#00E5FF]" />
              AI Route Optimizer
            </h3>
            {activeRouteType && (
              <button
                onClick={() => setMapActiveRoute(null)}
                className="text-[#94A3B8] hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-3.5 space-y-3">
            {routeTypes.map((route) => {
              const isSelected = activeRouteType === route.id;
              return (
                <div
                  key={route.id}
                  onClick={() => {
                    setMapActiveRoute(isSelected ? null : (route.id as any));
                    if (!isSelected) {
                      toast.success(`Calculating ${route.label} overlay path...`, { icon: "🧭" });
                    }
                  }}
                  className={`p-3 rounded-lg border transition-all duration-200 cursor-pointer flex flex-col gap-1.5 ${
                    isSelected
                      ? "bg-[rgba(0,229,255,0.05)] border-[#00E5FF] shadow-[0_0_12px_rgba(0,229,255,0.1)]"
                      : "bg-[rgba(19,34,56,0.3)] border-white/5 hover:border-[rgba(0,229,255,0.2)]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white font-sans">{route.label}</span>
                    <span className="text-[10px] font-mono font-bold text-[#00D084]">{route.time}</span>
                  </div>
                  
                  <p className="text-[10px] text-[#94A3B8] leading-tight font-sans">{route.desc}</p>
                  
                  <div className="flex justify-between items-center text-[9px] font-mono text-[#94A3B8] pt-2 border-t border-[rgba(248,250,252,0.03)]">
                    <span>Est. Distance: {route.distance}</span>
                    <span className={isSelected ? "text-[#00E5FF]" : ""}>
                      {isSelected ? "ACTIVE OVERLAY" : "CLICK TO PROJECT"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
