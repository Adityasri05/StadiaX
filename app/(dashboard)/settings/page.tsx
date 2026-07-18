"use client";

import { useState } from "react";
import { useStadiaStore } from "@/store/useStadiaStore";
import {
  Settings,
  Shield,
  Sliders,
  Bell,
  Eye,
  Phone,
  Cpu,
  Save,
  Languages
} from "lucide-react";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const { simulationMode } = useStadiaStore();
  const [confidence, setConfidence] = useState(90);
  const [autoEvac, setAutoEvac] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [audioAlarms, setAudioAlarms] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

  const handleSaveSettings = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1200)),
      {
        loading: "Syncing system parameters to all nodes...",
        success: "Configuration successfully synchronized.",
        error: "Failed to sync settings."
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
            <Settings className="w-5.5 h-5.5 text-[#94A3B8]" />
            SYSTEM CONFIGURATION PLATFORM
          </h1>
          <p className="text-xs text-[#94A3B8] font-mono mt-0.5">
            AI DECISION TOLERANCES // ALARM CHANNELS & EMERGENCY NODE GATEWAYS
          </p>
        </div>
        
        <button
          onClick={handleSaveSettings}
          className="h-9 px-4 text-xs font-mono font-bold bg-[#00E5FF] text-[#07111F] hover:brightness-110 rounded-md transition-all flex items-center gap-1.5 shadow-[0_0_12px_rgba(0,229,255,0.2)]"
        >
          <Save className="w-3.5 h-3.5" /> SAVE PARAMETERS
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* Left Column: AI Parameters & Notification Alarms */}
        <div className="space-y-6">
          {/* AI Settings */}
          <div className="bg-glass-card border border-[rgba(0,229,255,0.1)] rounded-xl p-5 space-y-4">
            <h3 className="font-heading font-bold text-sm text-[#00E5FF] flex items-center gap-2">
              <Cpu className="w-4.5 h-4.5 text-[#00E5FF]" />
              AI Cognitive Thresholds
            </h3>

            <div className="space-y-4 font-mono text-xs text-[#94A3B8]">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>AI DECISION CONFIDENCE TOLERANCE</span>
                  <span className="text-white font-bold">{confidence}%</span>
                </div>
                <input
                  type="range"
                  min="80"
                  max="99"
                  value={confidence}
                  onChange={(e) => setConfidence(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-[rgba(248,250,252,0.05)] rounded-lg appearance-none cursor-pointer accent-[#00E5FF]"
                />
                <span className="text-[10px] text-[#94A3B8]/60 block leading-tight">
                  Tolerances below 90% may trigger autonomous routing bypass strategies without operator verification loops.
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded bg-[rgba(7,17,31,0.3)] border border-white/5">
                <div className="space-y-0.5">
                  <span className="text-white font-bold block">AUTONOMOUS EMERGENCY OVERRIDES</span>
                  <span className="text-[9px] text-[#94A3B8]/60 block">Allow AI agents to override gate controls in emergency</span>
                </div>
                <input
                  type="checkbox"
                  checked={autoEvac}
                  onChange={() => setAutoEvac(!autoEvac)}
                  className="w-4 h-4 rounded accent-[#00E5FF] cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Alarm Notifications */}
          <div className="bg-glass-card border border-[rgba(0,229,255,0.1)] rounded-xl p-5 space-y-4">
            <h3 className="font-heading font-bold text-sm text-white flex items-center gap-2">
              <Bell className="w-4.5 h-4.5 text-[#00E5FF]" />
              Alarm Notification Triggers
            </h3>

            <div className="space-y-3 font-mono text-xs text-[#94A3B8] select-none">
              <label className="flex items-center justify-between p-2 rounded hover:bg-[rgba(248,250,252,0.02)] transition-all cursor-pointer">
                <div className="space-y-0.5">
                  <span className="text-white font-bold block">SMS COMMAND ALERTER</span>
                  <span className="text-[9px]">Push critical priority incidents to emergency phone logs</span>
                </div>
                <input
                  type="checkbox"
                  checked={smsAlerts}
                  onChange={() => setSmsAlerts(!smsAlerts)}
                  className="w-4 h-4 rounded accent-[#00E5FF] cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded hover:bg-[rgba(248,250,252,0.02)] transition-all cursor-pointer">
                <div className="space-y-0.5">
                  <span className="text-white font-bold block">ACOUSTIC HUD WARNINGS</span>
                  <span className="text-[9px]">Enable sound indicators inside operator command center</span>
                </div>
                <input
                  type="checkbox"
                  checked={audioAlarms}
                  onChange={() => setAudioAlarms(!audioAlarms)}
                  className="w-4 h-4 rounded accent-[#00E5FF] cursor-pointer"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Accessibility Settings & Contacts */}
        <div className="space-y-6">
          {/* Accessibility Settings */}
          <div className="bg-glass-card border border-[rgba(0,229,255,0.1)] rounded-xl p-5 space-y-4">
            <h3 className="font-heading font-bold text-sm text-white flex items-center gap-2">
              <Eye className="w-4.5 h-4.5 text-[#00E5FF]" />
              HUD Accessibility overrides
            </h3>

            <div className="space-y-3 font-mono text-xs text-[#94A3B8] select-none">
              <label className="flex items-center justify-between p-2 rounded hover:bg-[rgba(248,250,252,0.02)] transition-all cursor-pointer">
                <div className="space-y-0.5">
                  <span className="text-white font-bold block">HIGH CONTRAST WIREFRAMES</span>
                  <span className="text-[9px]">Enforce stark blueprint graphics on stadium map renders</span>
                </div>
                <input
                  type="checkbox"
                  checked={highContrast}
                  onChange={() => setHighContrast(!highContrast)}
                  className="w-4 h-4 rounded accent-[#00E5FF] cursor-pointer"
                />
              </label>

              <div className="flex justify-between items-center p-2">
                <div className="space-y-0.5">
                  <span className="text-white font-bold block">AUDIO DESCRIPTION SPEED</span>
                  <span className="text-[9px]">Text-to-speech commentary playback rate</span>
                </div>
                <select className="bg-[#101C2D] border border-white/5 text-xs text-white rounded p-1 font-mono outline-none">
                  <option>1.0x (Standard)</option>
                  <option>1.25x (Fast)</option>
                  <option>1.5x (Swift)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Emergency Dispatch Connections */}
          <div className="bg-glass-card border border-[rgba(0,229,255,0.1)] rounded-xl p-5 space-y-4">
            <h3 className="font-heading font-bold text-sm text-[#FF4D6D] flex items-center gap-2">
              <Phone className="w-4.5 h-4.5 text-[#FF4D6D] animate-pulse" />
              Emergency Node Connections
            </h3>

            <div className="space-y-2.5 font-mono text-xs text-[#94A3B8]">
              <div className="flex justify-between items-center p-2 rounded bg-[rgba(255,77,109,0.02)] border border-[#FF4D6D]/10">
                <span>FIFA SECURITY LINE:</span>
                <span className="text-white font-bold">+1-206-555-0911</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded bg-[rgba(255,77,109,0.02)] border border-[#FF4D6D]/10">
                <span>LOCAL FIRE DISPATCH:</span>
                <span className="text-white font-bold">+1-206-555-9111</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded bg-[rgba(255,77,109,0.02)] border border-[#FF4D6D]/10">
                <span>MEDICAL TRIAGE DEPOT:</span>
                <span className="text-white font-bold">+1-206-555-4911</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
