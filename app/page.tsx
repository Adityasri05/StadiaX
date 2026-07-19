"use client";

import Link from "next/link";
import { useStadiaStore } from "@/store/useStadiaStore";
import ParticleBg from "@/components/particle-bg";
import {
  MessageSquareCode,
  Users,
  ShieldCheck,
  Cpu,
  Train,
  Eye,
  Accessibility,
  Store,
  Leaf,
  ArrowRight,
  Play,
  Activity,
  ExternalLink
} from "lucide-react";
import toast from "react-hot-toast";

export default function LandingPage() {
  const { user, authLoading } = useStadiaStore();

  const stats = [
    { value: "104", label: "Matches scheduled", suffix: "" },
    { value: "48", label: "National teams", suffix: "" },
    { value: "3", label: "Host nations", suffix: "USA | CAN | MEX" },
    { value: "Millions", label: "Live fans", suffix: "" },
    { value: "50,000+", label: "AI decisions/min", suffix: "" }
  ];

  const features = [
    {
      title: "AI Fan Concierge",
      desc: "Instant conversational guidance, custom multi-modal route finding, and localization in multiple languages.",
      icon: MessageSquareCode,
      color: "text-[#00E5FF]",
      border: "hover:border-[#00E5FF]/40",
      href: "/concierge"
    },
    {
      title: "Crowd Intelligence",
      desc: "Computer vision and predictive modeling for gate flow rates, restroom waits, and queue bottlenecks.",
      icon: Users,
      color: "text-[#3B82F6]",
      border: "hover:border-[#3B82F6]/40",
      href: "/crowd"
    },
    {
      title: "AI Mission Control",
      desc: "Unified cognitive cockpit coordinate telemetry across 9 AI agents with real-time incident resolution.",
      icon: ShieldCheck,
      color: "text-[#FF4D6D]",
      border: "hover:border-[#FF4D6D]/40",
      href: "/mission-control"
    },
    {
      title: "Digital Twin",
      desc: "Procedural 3D WebGL layout mapping live thermal crowd patterns, personnel distribution, and flows.",
      icon: Cpu,
      color: "text-[#00D084]",
      border: "hover:border-[#00D084]/40",
      href: "/digital-twin"
    },
    {
      title: "Transportation AI",
      desc: "Autonomous coordination with local transit services, traffic forecasts, and smart exit advice.",
      icon: Train,
      color: "text-[#FACC15]",
      border: "hover:border-[#FACC15]/40",
      href: "/transit"
    },
    {
      title: "Security Intelligence",
      desc: "Automated object recognition, unattended bag localization, security grid sync, and broadcast tools.",
      icon: Eye,
      color: "text-[#FF4D6D]",
      border: "hover:border-[#FF4D6D]/40",
      href: "/security"
    },
    {
      title: "Accessibility AI",
      desc: "Dynamic wheelchair routing, elevator priority scheduling, and sensory relief mapping.",
      icon: Accessibility,
      color: "text-[#00E5FF]",
      border: "hover:border-[#00E5FF]/40",
      href: "/accessibility"
    },
    {
      title: "Vendor Intelligence",
      desc: "Sales transaction forecasting, POS queue metrics, supply chain replenishment, and waste forecasting.",
      icon: Store,
      color: "text-[#3B82F6]",
      border: "hover:border-[#3B82F6]/40",
      href: "/vendors"
    },
    {
      title: "Sustainability AI",
      desc: "Real-time energy consumption dashboards, solar grid feeds, water use diagnostics, and sorting optimization.",
      icon: Leaf,
      color: "text-[#00D084]",
      border: "hover:border-[#00D084]/40",
      href: "/sustainability"
    }
  ];

  return (
    <div className="relative min-h-screen bg-[#07111F] text-[#F8FAFC] overflow-x-hidden">
      <ParticleBg />
      <div className="absolute inset-0 bg-grid-pattern opacity-60 pointer-events-none z-0" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#07111F]/30 via-transparent to-[#07111F] pointer-events-none z-0" />

      {/* Navbar */}
      <header className="relative z-10 max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-[#00E5FF] to-[#3B82F6] flex items-center justify-center shadow-[0_0_15px_rgba(0,229,255,0.4)]">
            <Cpu className="w-5 h-5 text-[#07111F]" />
          </div>
          <span className="font-heading font-bold text-xl tracking-wider">
            STADIA<span className="text-[#00E5FF]">X</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs font-mono text-[#94A3B8] hidden sm:inline-block bg-[#101C2D] border border-white/5 px-3 py-1.5 rounded">
            FIFA 2026 AUDIT: PASS
          </span>
          {!authLoading && user ? (
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-[#94A3B8] hidden md:inline-block bg-[rgba(16,28,45,0.6)] border border-white/5 px-3 py-1.5 rounded">
                OPERATOR: <span className="text-[#00E5FF] font-semibold">{user.displayName || user.email?.split("@")[0]}</span>
              </span>
              <Link
                href="/dashboard"
                className="px-4 py-2 text-xs font-mono font-bold tracking-widest text-[#00D084] bg-[rgba(0,208,132,0.1)] border border-[#00D084]/30 rounded-md hover:bg-[#00D084]/20 hover:border-[#00D084]/60 hover:shadow-[0_0_15px_rgba(0,208,132,0.25)] transition-all"
              >
                GO TO COCKPIT
              </Link>
            </div>
          ) : (
            <Link
              href="/auth"
              className="px-4 py-2 text-xs font-mono font-bold tracking-widest text-[#00E5FF] bg-[rgba(0,229,255,0.1)] border border-[#00E5FF]/30 rounded-md hover:bg-[#00E5FF]/20 hover:border-[#00E5FF]/60 hover:shadow-[0_0_15px_rgba(0,229,255,0.25)] transition-all"
            >
              SIGN IN
            </Link>
          )}
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pt-16 pb-12 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[rgba(16,28,45,0.85)] border border-[rgba(0,229,255,0.2)] text-xs font-semibold text-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.1)] mb-8 animate-neon-pulse">
          <Activity className="w-3.5 h-3.5" />
          <span>FIFA World Cup 2026 Operational Intelligence</span>
        </div>

        <h1 className="font-heading font-bold text-5xl md:text-7xl leading-tight tracking-tight text-white mb-6">
          The Autonomous AI Brain <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] via-[#3B82F6] to-[#00D084] text-glow">
            Behind Every Smart Stadium
          </span>
        </h1>

        <p className="max-w-3xl mx-auto text-[#94A3B8] text-base md:text-lg leading-relaxed font-sans mb-10">
          StadiaX transforms major stadiums into self-orchestrating ecosystems.
          By unifying crowd flows, security protocols, accessibility networks, transit nodes,
          and food vendor operations into a single generative AI operating system.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          <Link
            href="/auth"
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#00E5FF] to-[#3B82F6] text-[#07111F] font-bold rounded-lg shadow-[0_4px_25px_rgba(0,229,255,0.3)] hover:shadow-[0_4px_35px_rgba(0,229,255,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            Launch Mission Control
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="#explore"
            className="w-full sm:w-auto px-8 py-4 bg-[#101C2D] border border-white/5 text-[#F8FAFC] font-semibold rounded-lg hover:bg-[#132238] hover:border-[#00E5FF]/20 hover:text-white transition-all flex items-center justify-center"
          >
            Explore Platform
          </a>
          <button
            onClick={() => {
              toast("Loading video telemetry feed...", { icon: "📹" });
            }}
            className="w-full sm:w-auto px-8 py-4 bg-transparent text-[#94A3B8] hover:text-white transition-all flex items-center justify-center gap-2 group"
          >
            <div className="w-8 h-8 rounded-full bg-[#101C2D] border border-white/5 flex items-center justify-center group-hover:bg-[#00E5FF]/10 group-hover:border-[#00E5FF]/20 transition-all">
              <Play className="w-3 h-3 text-[#00E5FF] fill-[#00E5FF]" />
            </div>
            Watch Operations Demo
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 p-8 rounded-2xl bg-glass border border-[rgba(248,250,252,0.04)] shadow-2xl relative">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00E5FF]/20 to-transparent" />
          {stats.map((s, idx) => (
            <div key={idx} className="flex flex-col text-center">
              <span className="text-2xl md:text-3xl font-mono font-bold text-[#00E5FF] tracking-tight">
                {s.value}
              </span>
              <span className="text-[11px] font-sans text-[#94A3B8] font-medium mt-1 uppercase tracking-wider">
                {s.label}
              </span>
              {s.suffix && (
                <span className="text-[9px] font-mono text-[#00D084]/80 mt-0.5">
                  {s.suffix}
                </span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Feature Cards — all now clickable Links */}
      <section id="explore" className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-white mb-4">
            Autonomous Intelligent Ecosystems
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#00E5FF] to-[#3B82F6] mx-auto rounded-full mb-6" />
          <p className="max-w-2xl mx-auto text-[#94A3B8] text-sm md:text-base font-sans">
            Every stadium aspect is overseen by a specialized, communicating AI agent, delivering
            integrated control and foresight directly to command operators.
          </p>
          <p className="max-w-xl mx-auto text-[#00E5FF]/60 text-xs font-mono mt-3 tracking-wide">
            ↓ Click any module below to enter the live AI cockpit ↓
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const IconComponent = feat.icon;
            return (
              <Link
                key={idx}
                href={feat.href}
                className={`p-6 rounded-2xl bg-glass-card border border-[rgba(0,229,255,0.07)] transition-all duration-300 flex flex-col group relative ${feat.border} hover:scale-[1.02] hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)] cursor-pointer`}
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-[#00E5FF]/0 to-[#00E5FF]/[0.02] rounded-2xl pointer-events-none" />
                <div className="w-12 h-12 rounded-xl bg-[rgba(16,28,45,0.8)] border border-[rgba(248,250,252,0.05)] flex items-center justify-center mb-5 group-hover:scale-105 group-hover:border-[#00E5FF]/30 transition-all duration-300">
                  <IconComponent className={`w-5 h-5 ${feat.color}`} />
                </div>
                <h3 className="text-lg font-heading font-bold text-white mb-2 tracking-wide">
                  {feat.title}
                </h3>
                <p className="text-sm text-[#94A3B8] leading-relaxed flex-1">
                  {feat.desc}
                </p>
                <div className="flex items-center justify-between mt-4">
                  <div className="w-0 h-[2px] bg-[#00E5FF] group-hover:w-full transition-all duration-300 rounded-full" />
                  <ExternalLink className={`w-3.5 h-3.5 ${feat.color} opacity-0 group-hover:opacity-100 transition-all duration-200 shrink-0 ml-2`} />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 p-8 rounded-2xl bg-gradient-to-r from-[#00E5FF]/5 via-[#3B82F6]/5 to-[#00D084]/5 border border-[rgba(0,229,255,0.12)] text-center">
          <h3 className="font-heading font-bold text-2xl text-white mb-3">
            Ready to operate at scale?
          </h3>
          <p className="text-[#94A3B8] text-sm mb-6 max-w-lg mx-auto">
            Sign in to the StadiaX command center and access all 16 live AI modules simultaneously.
          </p>
          <Link
            href="/auth"
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#00E5FF] to-[#3B82F6] text-[#07111F] font-bold rounded-lg hover:shadow-[0_4px_25px_rgba(0,229,255,0.4)] hover:scale-[1.02] transition-all"
          >
            Access Mission Control
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[rgba(248,250,252,0.05)] py-10 bg-[rgba(16,28,45,0.5)]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Cpu className="w-4.5 h-4.5 text-[#00E5FF]" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider">
              StadiaX AI OS • FIFA World Cup 2026 Edition
            </span>
          </div>
          <span className="text-[10px] font-mono text-[#94A3B8]">
            CONFIDENTIAL // FOR INTERNAL FIFA OPERATOR USE ONLY
          </span>
        </div>
      </footer>
    </div>
  );
}
