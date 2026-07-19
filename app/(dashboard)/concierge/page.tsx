"use client";

import { useState, useRef, useEffect } from "react";
import { useStadiaStore } from "@/store/useStadiaStore";
import {
  Mic,
  Send,
  Sparkles,
  Clock,
  Accessibility,
  AlertOctagon,
  Compass,
  Volume2
} from "lucide-react";

import toast from "react-hot-toast";

export default function FanConciergePage() {
  const { chatHistory, sendConciergeMessage } = useStadiaStore();
  const [inputText, setInputText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [activeRoute, setActiveRoute] = useState<string | null>(null);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const prompts = [
    "Guide me to my seat",
    "Find halal food",
    "Find vegetarian food",
    "Nearest wheelchair route",
    "Least crowded restroom",
    "My child is missing",
    "Fastest exit",
    "Nearest medical room"
  ];

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    sendConciergeMessage(inputText);
    
    // Check keywords to set map route overlay
    const lower = inputText.toLowerCase();
    if (lower.includes("seat") || lower.includes("guide")) {
      setActiveRoute("seat");
    } else if (lower.includes("food") || lower.includes("halal") || lower.includes("vegetarian")) {
      setActiveRoute("food");
    } else if (lower.includes("wheelchair") || lower.includes("lift")) {
      setActiveRoute("wheelchair");
    } else if (lower.includes("restroom") || lower.includes("washroom")) {
      setActiveRoute("restroom");
    } else if (lower.includes("child") || lower.includes("missing")) {
      setActiveRoute("security");
    } else if (lower.includes("exit") || lower.includes("leave")) {
      setActiveRoute("exit");
    } else if (lower.includes("medical") || lower.includes("doctor")) {
      setActiveRoute("medical");
    } else {
      setActiveRoute("general");
    }

    setInputText("");
  };

  const handlePromptClick = (prompt: string) => {
    sendConciergeMessage(prompt);
    
    const lower = prompt.toLowerCase();
    if (lower.includes("seat") || lower.includes("guide")) {
      setActiveRoute("seat");
    } else if (lower.includes("food") || lower.includes("halal") || lower.includes("vegetarian")) {
      setActiveRoute("food");
    } else if (lower.includes("wheelchair") || lower.includes("route")) {
      setActiveRoute("wheelchair");
    } else if (lower.includes("restroom") || lower.includes("crowded")) {
      setActiveRoute("restroom");
    } else if (lower.includes("child") || lower.includes("missing")) {
      setActiveRoute("security");
    } else if (lower.includes("exit")) {
      setActiveRoute("exit");
    } else if (lower.includes("medical")) {
      setActiveRoute("medical");
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      setInputText("Guide me to my seat");
      toast.success("Voice transcribed: 'Guide me to my seat'", { icon: "🎙️" });
    } else {
      setIsRecording(true);
      toast("Voice channel open. Speak now...", { icon: "🎙️" });
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-[calc(100vh-9rem)]">
      
      {/* Left Columns: Chat interface */}
      <div className="xl:col-span-2 bg-glass-card border border-[rgba(0,229,255,0.1)] rounded-xl flex flex-col overflow-hidden h-full">
        
        {/* Chat Header */}
        <div className="p-4 bg-[rgba(16,28,45,0.8)] border-b border-[rgba(248,250,252,0.05)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#00E5FF] animate-pulse" />
            <div>
              <h2 className="font-heading font-bold text-sm text-[#F8FAFC]">AI FAN CONCIERGE</h2>
              <p className="text-[9px] font-mono text-[#94A3B8] uppercase">Autonomous Fan Assistance Node</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#94A3B8]">
            <span className="w-2 h-2 rounded-full bg-[#00D084] animate-pulse" />
            <span>EN | ES | FR | AR</span>
          </div>
        </div>

        {/* Suggested prompts list */}
        <div className="p-3 bg-[rgba(7,17,31,0.2)] border-b border-[rgba(248,250,252,0.03)] flex gap-2 overflow-x-auto scrollbar-none shrink-0 select-none">
          {prompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handlePromptClick(p)}
              className="px-3 py-1 text-[11px] font-medium rounded-full bg-[#101C2D] border border-white/5 text-[#94A3B8] hover:border-[#00E5FF]/40 hover:text-white transition-all whitespace-nowrap"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Conversation Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
          {chatHistory.map((msg) => {
            const isUser = msg.sender === "user";
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[85%] ${isUser ? "ml-auto flex-row-reverse" : ""}`}
              >
                {/* Avatar representation */}
                <div className={`w-8 h-8 rounded-full border shrink-0 flex items-center justify-center text-xs font-mono font-bold ${
                  isUser 
                    ? "bg-[rgba(59,130,246,0.1)] border-[#3B82F6]/30 text-[#3B82F6]" 
                    : "bg-[rgba(0,229,255,0.1)] border-[#00E5FF]/30 text-[#00E5FF]"
                }`}>
                  {isUser ? "U" : "AI"}
                </div>
                
                {/* Text Bubble */}
                <div className="space-y-2">
                  <div className={`p-3.5 rounded-2xl text-xs leading-relaxed font-sans ${
                    isUser
                      ? "bg-[#3B82F6] text-white rounded-tr-none"
                      : "bg-[#101C2D] border border-[rgba(248,250,252,0.06)] text-[#F8FAFC] rounded-tl-none shadow-md"
                  }`}>
                    {msg.text}
                  </div>
                  
                  {/* Custom Route Card for AI answers */}
                  {!isUser && msg.routeData && (
                    <div className="bg-[#132238] border border-[#00E5FF]/20 rounded-xl p-3.5 space-y-3 shadow-lg max-w-[420px]">
                      <div className="flex items-center justify-between pb-2 border-b border-[rgba(248,250,252,0.05)]">
                        <span className="text-[10px] font-mono text-[#00E5FF] font-bold tracking-wider">
                          {msg.routeData.routeType.toUpperCase()}
                        </span>
                        <span className="text-[9px] font-mono text-[#94A3B8]">OS SYNCED</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-[#00E5FF]" />
                          <div>
                            <p className="text-[10px] text-[#94A3B8]">Estimated Time</p>
                            <p className="text-xs font-mono font-bold text-white">{msg.routeData.estimatedTime}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Accessibility className="w-4 h-4 text-[#00D084]" />
                          <div>
                            <p className="text-[10px] text-[#94A3B8]">Accessibility Info</p>
                            <p className="text-[10px] text-white font-medium leading-none mt-0.5">{msg.routeData.accessibilityInfo}</p>
                          </div>
                        </div>
                      </div>

                      {msg.routeData.hasEmergencyShortcut && (
                        <button
                          onClick={() => toast.error("Initiating Direct Comms line with Security Command...")}
                          className="w-full py-2 rounded bg-[#FF4D6D] hover:bg-[#FF4D6D]/90 text-white text-[10px] font-mono font-bold transition-all shadow-[0_0_15px_rgba(255,77,109,0.25)] flex items-center justify-center gap-1.5"
                        >
                          <AlertOctagon className="w-3.5 h-3.5" /> ESTABLISH DIRECT SECURITY COMMS
                        </button>
                      )}

                      <div className="flex gap-2">
                        <button
                          onClick={() => toast.success("Navigation overlay projected to mobile device.")}
                          className="flex-1 py-1.5 rounded bg-[#00E5FF] text-[#07111F] text-[10px] font-mono font-bold hover:brightness-110 transition-all flex items-center justify-center gap-1"
                        >
                          <Compass className="w-3.5 h-3.5" /> GPS NAVIGATION
                        </button>
                        <button
                          onClick={() => toast("Voice guidance started...")}
                          className="px-3 rounded bg-[rgba(248,250,252,0.05)] border border-white/5 text-white text-[10px] font-mono hover:bg-[rgba(248,250,252,0.1)] transition-all flex items-center justify-center"
                        >
                          <Volume2 className="w-3.5 h-3.5 text-[#94A3B8]" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          <div ref={chatEndRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={handleSendMessage}
          className="p-4 bg-[rgba(16,28,45,0.8)] border-t border-[rgba(248,250,252,0.05)] flex items-center gap-3 shrink-0"
        >
          {/* Recording wave overlay */}
          {isRecording ? (
            <div className="flex items-center gap-2 flex-1 px-4 py-2 bg-[rgba(7,17,31,0.5)] border border-[#FF4D6D]/30 rounded-full">
              <span className="text-xs text-[#FF4D6D] font-mono animate-pulse">RECORDING SYSTEM CHANNEL...</span>
              <div className="flex items-center">
                <span className="audio-bar" />
                <span className="audio-bar" />
                <span className="audio-bar" />
                <span className="audio-bar" />
                <span className="audio-bar" />
              </div>
            </div>
          ) : (
            <input
              type="text"
              placeholder="Ask anything... (e.g. 'Guide me to Sector 108' or 'Find halal food')"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 px-4 py-2 bg-[rgba(7,17,31,0.5)] border border-[rgba(248,250,252,0.08)] focus:border-[#00E5FF] text-xs rounded-full outline-none text-white transition-all font-sans"
            />
          )}

          {/* Voice Input Button */}
          <button
            type="button"
            onClick={toggleRecording}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
              isRecording 
                ? "bg-[#FF4D6D] text-white animate-pulse" 
                : "bg-[rgba(16,28,45,0.6)] border border-[rgba(248,250,252,0.08)] text-[#94A3B8] hover:text-[#00E5FF] hover:border-[#00E5FF]"
            }`}
          >
            <Mic className="w-4.5 h-4.5" />
          </button>

          {/* Send Button */}
          <button
            type="submit"
            disabled={!inputText.trim() && !isRecording}
            className="w-9 h-9 rounded-full bg-[#00E5FF] text-[#07111F] flex items-center justify-center hover:brightness-110 disabled:opacity-50 disabled:pointer-events-none transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Right Column: Live Route Projection Map */}
      <div className="xl:col-span-1 bg-glass-card border border-[rgba(0,229,255,0.1)] rounded-xl overflow-hidden flex flex-col h-full">
        <div className="p-4 bg-[rgba(16,28,45,0.8)] border-b border-[rgba(248,250,252,0.05)] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-[#00E5FF]" />
            <h3 className="font-heading font-bold text-sm text-[#F8FAFC]">ROUTE PROJECTION</h3>
          </div>
          <span className="text-[9px] font-mono bg-[rgba(0,229,255,0.1)] text-[#00E5FF] px-1.5 py-0.5 rounded uppercase">
            3D HUD
          </span>
        </div>

        {/* Vector SVG projecting path */}
        <div className="flex-1 bg-[rgba(7,17,31,0.2)] flex items-center justify-center p-4 relative">
          <svg viewBox="0 0 400 400" className="w-full h-full max-h-[350px]">
            {/* Inner stadium blueprint outline */}
            <circle cx="200" cy="200" r="130" fill="none" stroke="rgba(0, 229, 255, 0.04)" strokeWidth="3" />
            <circle cx="200" cy="200" r="100" fill="none" stroke="rgba(0, 229, 255, 0.08)" strokeWidth="1.5" />
            
            {/* Seating areas wireframe */}
            <path d="M 130,130 L 70,70" stroke="rgba(0, 229, 255, 0.05)" strokeWidth="1.5" />
            <path d="M 270,130 L 330,70" stroke="rgba(0, 229, 255, 0.05)" strokeWidth="1.5" />
            <path d="M 130,270 L 70,330" stroke="rgba(0, 229, 255, 0.05)" strokeWidth="1.5" />
            <path d="M 270,270 L 330,330" stroke="rgba(0, 229, 255, 0.05)" strokeWidth="1.5" />

            {/* Target nodes */}
            {/* Gate 4 Entrance */}
            <circle cx="90" cy="200" r="6" fill="#101C2D" stroke="rgba(0, 229, 255, 0.4)" strokeWidth="1.5" />
            <text x="75" y="203" fill="#94A3B8" className="text-[8px] font-mono">GATE 4</text>
            
            {/* Sector 108 Seat target */}
            <circle cx="250" cy="140" r="6" fill="#101C2D" stroke="rgba(0, 208, 132, 0.4)" strokeWidth="1.5" />
            <text x="262" y="143" fill="#94A3B8" className="text-[8px] font-mono">SECTOR 108</text>

            {/* Food area target */}
            <circle cx="290" cy="230" r="6" fill="#101C2D" stroke="rgba(59, 130, 246, 0.4)" strokeWidth="1.5" />
            <text x="302" y="233" fill="#94A3B8" className="text-[8px] font-mono">FOOD COURT</text>

            {/* Medical station target */}
            <circle cx="150" cy="280" r="6" fill="#101C2D" stroke="rgba(255, 77, 109, 0.4)" strokeWidth="1.5" />
            <text x="140" y="295" fill="#94A3B8" className="text-[8px] font-mono">MED STATION</text>

            {/* Path Drawing animations based on state */}
            {activeRoute === "seat" && (
              <g>
                <path
                  d="M 90,200 C 130,160 180,130 250,140"
                  fill="none"
                  stroke="#00E5FF"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeDasharray="6,4"
                  className="animate-[dash_2s_linear_infinite]"
                />
                <circle cx="250" cy="140" r="6" fill="#00E5FF" className="animate-ping" />
              </g>
            )}

            {activeRoute === "food" && (
              <g>
                <path
                  d="M 250,140 C 270,170 280,200 290,230"
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeDasharray="6,4"
                />
                <circle cx="290" cy="230" r="6" fill="#3B82F6" className="animate-ping" />
              </g>
            )}

            {activeRoute === "wheelchair" && (
              <g>
                <path
                  d="M 90,200 C 110,230 130,260 150,280"
                  fill="none"
                  stroke="#FACC15"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeDasharray="6,4"
                />
                <circle cx="150" cy="280" r="6" fill="#FACC15" className="animate-ping" />
              </g>
            )}

            {activeRoute === "medical" && (
              <g>
                <path
                  d="M 250,140 C 200,200 180,250 150,280"
                  fill="none"
                  stroke="#FF4D6D"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeDasharray="6,4"
                />
                <circle cx="150" cy="280" r="6" fill="#FF4D6D" className="animate-ping" />
              </g>
            )}

            {activeRoute === "security" && (
              <g>
                <circle cx="250" cy="140" r="20" fill="rgba(255, 77, 109, 0.15)" stroke="#FF4D6D" strokeWidth="1" className="animate-ping" />
                <circle cx="250" cy="140" r="5" fill="#FF4D6D" />
              </g>
            )}

            {activeRoute === "exit" && (
              <g>
                <path
                  d="M 250,140 C 200,100 130,80 90,200"
                  fill="none"
                  stroke="#FF4D6D"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeDasharray="6,4"
                />
                <circle cx="90" cy="200" r="6" fill="#FF4D6D" className="animate-ping" />
              </g>
            )}
          </svg>

          {/* Interactive route overlay legend */}
          <div className="absolute bottom-4 left-4 right-4 bg-[#101C2D]/85 border border-white/5 rounded-lg p-2.5 flex items-center justify-between text-[10px] font-mono">
            <span className="text-[#94A3B8]">PROJECTION ENGINE:</span>
            <span className="text-[#00E5FF] font-bold">
              {activeRoute ? `${activeRoute.toUpperCase()} OVERLAY` : "STANDBY"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
