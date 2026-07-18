"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStadiaStore } from "@/store/useStadiaStore";
import {
  Bell,
  Search,
  AlertTriangle,
  Globe,
  User,
  Sparkles,
  Command,
  CheckCircle,
  Clock,
  MapPin,
  ChevronDown,
  Cpu
} from "lucide-react";
import toast from "react-hot-toast";

export default function Topbar() {
  const router = useRouter();
  const {
    matchMinute,
    matchScore,
    attendance,
    activeAlertsCount,
    incidents,
    resolveIncident,
    simulationMode,
    setSimulationMode,
    tickMatchTime,
    sendConciergeMessage,
  } = useStadiaStore();

  const [aiInput, setAiInput] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [selectedLang, setSelectedLang] = useState("EN");
  const [selectedHost, setSelectedHost] = useState("USA");
  const [showHostDropdown, setShowHostDropdown] = useState(false);
  
  const notificationRef = useRef<HTMLDivElement>(null);

  // Tick match time in background
  useEffect(() => {
    const timer = setInterval(() => {
      tickMatchTime();
    }, 8000); // Ticks every 8 seconds
    return () => clearInterval(timer);
  }, [tickMatchTime]);

  // Click outside notification dropdown to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAiCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim()) return;

    const cmd = aiInput.toLowerCase();
    
    if (cmd.includes("evacuate") || cmd.includes("evacuation")) {
      setSimulationMode("Evacuation");
      toast.error("EMERGENCY SIGNAL DETECTED: Initializing Evacuation Protocol!", {
        icon: "🚨",
        duration: 5000
      });
      router.push("/mission-control");
    } else if (cmd.includes("normal") || cmd.includes("reset")) {
      setSimulationMode("Normal");
      toast.success("System returned to nominal operations.");
    } else if (cmd.includes("incident") || cmd.includes("alerts")) {
      router.push("/mission-control");
      toast.success("Navigating to Live Incidents cockpit.");
    } else {
      // Forward query to Concierge
      sendConciergeMessage(aiInput);
      router.push("/concierge");
      toast("AI Concierge analyzing command...", {
        icon: "🤖"
      });
    }
    setAiInput("");
  };

  const handleTriggerEmergency = () => {
    if (simulationMode === "Evacuation") {
      setSimulationMode("Normal");
      toast.success("Emergency simulation deactivated. System nominal.");
    } else {
      setSimulationMode("Evacuation");
      toast.error("CRITICAL COMMAND: Evacuation Simulation Activated!", {
        icon: "🚨",
        duration: 6000
      });
      router.push("/mission-control");
    }
  };

  const activeIncidents = incidents.filter((i) => i.status !== "Resolved");

  return (
    <header className="h-16 bg-glass border-b border-[rgba(248,250,252,0.05)] flex items-center justify-between px-6 select-none shrink-0 z-20 sticky top-0">
      {/* Logo Area */}
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#00E5FF] to-[#3B82F6] flex items-center justify-center shadow-[0_0_15px_rgba(0,229,255,0.4)] transition-all group-hover:scale-105">
            <Cpu className="w-4.5 h-4.5 text-[#07111F] font-bold" />
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-bold text-lg tracking-wider text-[#F8FAFC]">
              STADIA<span className="text-[#00E5FF] text-glow">X</span>
            </span>
            <span className="text-[9px] font-mono text-[#94A3B8] tracking-widest -mt-1 uppercase">
              Stadium OS
            </span>
          </div>
        </Link>

        {/* Live Match Widget */}
        <div className="hidden lg:flex items-center gap-3 bg-[rgba(16,28,45,0.8)] border border-[rgba(0,229,255,0.15)] rounded-full px-4 py-1.5 ml-4">
          <div className="w-2 h-2 rounded-full bg-[#FF4D6D] animate-ping" />
          <span className="text-xs font-mono font-bold text-[#F8FAFC]">
            FIFA WORLD CUP 2026
          </span>
          <span className="text-[#94A3B8] text-xs">|</span>
          <span className="text-xs font-heading font-semibold text-[#00E5FF]">
            ARG {matchScore} FRA
          </span>
          <span className="text-xs font-mono text-[#94A3B8]">
            ({matchMinute}&apos;)
          </span>
        </div>
      </div>

      {/* Center Search & AI Command Input */}
      <form
        onSubmit={handleAiCommand}
        className="flex-1 max-w-lg mx-6 relative hidden md:block"
      >
        <div className="relative">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Universal AI Command... (e.g. 'Guide me to seat' or 'Evacuate')"
            value={aiInput}
            onChange={(e) => setAiInput(e.target.value)}
            className="w-full h-9 bg-[rgba(7,17,31,0.5)] border border-[rgba(248,250,252,0.08)] focus:border-[#00E5FF] focus:shadow-[0_0_12px_rgba(0,229,255,0.15)] text-sm rounded-full pl-10 pr-24 text-[#F8FAFC] placeholder-[#94A3B8] outline-none transition-all font-sans"
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <span className="text-[10px] text-[#94A3B8] bg-[rgba(248,250,252,0.05)] border border-[rgba(248,250,252,0.1)] px-1.5 py-0.5 rounded font-mono flex items-center gap-0.5">
              <Command className="w-2.5 h-2.5" /> Enter
            </span>
            <Sparkles className="w-3.5 h-3.5 text-[#00E5FF] animate-pulse" />
          </div>
        </div>
      </form>

      {/* Right Side Buttons */}
      <div className="flex items-center gap-4">
        {/* Emergency Trigger */}
        <button
          onClick={handleTriggerEmergency}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md border text-xs font-semibold font-mono tracking-wider transition-all duration-300 ${
            simulationMode === "Evacuation"
              ? "bg-[#FF4D6D] text-white border-[#FF4D6D] animate-pulse shadow-[0_0_20px_#FF4D6D]"
              : "bg-transparent text-[#FF4D6D] border-[rgba(255,77,109,0.3)] hover:bg-[rgba(255,77,109,0.1)]"
          }`}
        >
          <AlertTriangle className={`w-3.5 h-3.5 ${simulationMode === "Evacuation" ? "animate-bounce" : ""}`} />
          {simulationMode === "Evacuation" ? "EVAC ACTIVE" : "EMERGENCY SIM"}
        </button>

        {/* Notifications Button & Dropdown */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-9 h-9 rounded-full bg-[rgba(16,28,45,0.6)] border border-[rgba(248,250,252,0.08)] flex items-center justify-center text-[#F8FAFC] hover:border-[#00E5FF] hover:text-[#00E5FF] transition-all relative"
          >
            <Bell className="w-4 h-4" />
            {activeIncidents.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-[#FF4D6D] text-white text-[9px] font-bold font-mono rounded-full flex items-center justify-center animate-pulse">
                {activeIncidents.length}
              </span>
            )}
          </button>

          {/* Notifications Dropdown menu */}
          {showNotifications && (
            <div className="absolute right-0 mt-2.5 w-96 bg-[#132238] border border-[rgba(0,229,255,0.2)] rounded-xl shadow-[0_10px_40px_rgba(7,17,31,0.8)] backdrop-blur-md overflow-hidden z-50">
              <div className="p-3 bg-[rgba(16,28,45,0.8)] border-b border-[rgba(248,250,252,0.05)] flex items-center justify-between">
                <span className="text-xs font-semibold text-[#F8FAFC] font-heading tracking-wide">
                  ACTIVE ALERTS ({activeIncidents.length})
                </span>
                <span className="text-[10px] font-mono text-[#00E5FF] bg-[rgba(0,229,255,0.1)] px-1.5 py-0.5 rounded">
                  OS V3.8
                </span>
              </div>
              <div className="max-h-[360px] overflow-y-auto custom-scrollbar divide-y divide-[rgba(248,250,252,0.04)]">
                {activeIncidents.length === 0 ? (
                  <div className="p-8 text-center text-[#94A3B8]">
                    <CheckCircle className="w-8 h-8 text-[#00D084] mx-auto mb-2 opacity-60" />
                    <p className="text-sm font-sans">All systems nominal</p>
                    <p className="text-[10px] font-mono mt-1">No active incidents detected</p>
                  </div>
                ) : (
                  activeIncidents.map((inc) => (
                    <div key={inc.id} className="p-3 hover:bg-[rgba(248,250,252,0.02)] transition-all">
                      <div className="flex items-start gap-2">
                        <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                          inc.priority === "high" ? "bg-[#FF4D6D] animate-ping" : "bg-[#FACC15]"
                        }`} />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#94A3B8]">
                              {inc.category} • {inc.location}
                            </span>
                            <span className="text-[9px] font-mono text-[#94A3B8] flex items-center gap-1">
                              <Clock className="w-2.5 h-2.5" /> {inc.time}
                            </span>
                          </div>
                          <p className="text-xs font-medium text-[#F8FAFC] mt-0.5 leading-snug">
                            {inc.title}
                          </p>
                          <p className="text-[10px] text-[#94A3B8] mt-1 bg-[rgba(7,17,31,0.4)] p-1.5 rounded border border-[rgba(248,250,252,0.03)] font-mono leading-relaxed">
                            <span className="text-[#00E5FF] font-bold">Action:</span> {inc.actionRecommended}
                          </p>
                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={() => {
                                resolveIncident(inc.id);
                                toast.success(`Incident resolved.`);
                              }}
                              className="px-2 py-0.5 text-[9px] font-mono rounded bg-[#00D084] text-[#07111F] font-bold hover:brightness-110 transition-all"
                            >
                              RESOLVE
                            </button>
                            <button
                              onClick={() => {
                                router.push("/mission-control");
                                setShowNotifications(false);
                              }}
                              className="px-2 py-0.5 text-[9px] font-mono rounded bg-[rgba(0,229,255,0.1)] text-[#00E5FF] font-semibold hover:bg-[rgba(0,229,255,0.2)] transition-all"
                            >
                              LOCATE
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Language Selector */}
        <div className="relative">
          <button
            onClick={() => {
              setShowLangDropdown(!showLangDropdown);
              setShowHostDropdown(false);
            }}
            className="h-9 px-3 rounded-md bg-[rgba(16,28,45,0.6)] border border-[rgba(248,250,252,0.08)] flex items-center gap-1.5 text-xs text-[#94A3B8] hover:text-[#F8FAFC] transition-all"
          >
            <Globe className="w-3.5 h-3.5" />
            <span className="font-mono font-semibold">{selectedLang}</span>
            <ChevronDown className="w-3 h-3" />
          </button>
          {showLangDropdown && (
            <div className="absolute right-0 mt-2 w-28 bg-[#132238] border border-[rgba(248,250,252,0.1)] rounded-md shadow-xl overflow-hidden z-50">
              {["EN", "ES", "FR", "AR"].map((lang) => (
                <button
                  key={lang}
                  onClick={() => {
                    setSelectedLang(lang);
                    setShowLangDropdown(false);
                    toast(`Language updated: ${lang}`, { icon: "🌐" });
                  }}
                  className="w-full px-3 py-2 text-left text-xs font-mono text-[#94A3B8] hover:bg-[rgba(0,229,255,0.05)] hover:text-[#00E5FF] transition-all"
                >
                  {lang === "EN" && "English (EN)"}
                  {lang === "ES" && "Español (ES)"}
                  {lang === "FR" && "Français (FR)"}
                  {lang === "AR" && "العربية (AR)"}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Host Country Selector */}
        <div className="relative">
          <button
            onClick={() => {
              setShowHostDropdown(!showHostDropdown);
              setShowLangDropdown(false);
            }}
            className="h-9 px-3 rounded-md bg-[rgba(16,28,45,0.6)] border border-[rgba(248,250,252,0.08)] flex items-center gap-1.5 text-xs text-[#94A3B8] hover:text-[#F8FAFC] transition-all"
          >
            <MapPin className="w-3.5 h-3.5 text-[#00E5FF]" />
            <span className="font-mono font-semibold">{selectedHost}</span>
            <ChevronDown className="w-3 h-3" />
          </button>
          {showHostDropdown && (
            <div className="absolute right-0 mt-2 w-28 bg-[#132238] border border-[rgba(248,250,252,0.1)] rounded-md shadow-xl overflow-hidden z-50">
              {["USA", "MEX", "CAN"].map((host) => (
                <button
                  key={host}
                  onClick={() => {
                    setSelectedHost(host);
                    setShowHostDropdown(false);
                    toast(`Host region set: ${host}`, { icon: "📍" });
                  }}
                  className="w-full px-3 py-2 text-left text-xs font-mono text-[#94A3B8] hover:bg-[rgba(0,229,255,0.05)] hover:text-[#00E5FF] transition-all"
                >
                  {host === "USA" && "United States"}
                  {host === "MEX" && "México"}
                  {host === "CAN" && "Canada"}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Profile Button */}
        <button
          onClick={() => toast.success("Connected as FIFA Operator #482", { icon: "🔑" })}
          className="w-9 h-9 rounded-full bg-gradient-to-tr from-[rgba(0,229,255,0.1)] to-[rgba(59,130,246,0.1)] border border-[rgba(0,229,255,0.2)] flex items-center justify-center text-[#00E5FF] hover:shadow-[0_0_12px_rgba(0,229,255,0.2)] transition-all"
        >
          <User className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
