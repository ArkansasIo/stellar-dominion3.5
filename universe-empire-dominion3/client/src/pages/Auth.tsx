import { useState, useEffect } from "react";
import { useGame } from "@/lib/gameContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Rocket, Eye, EyeOff, Copy, Check, Github, Globe2,
  ShieldCheck, ShieldAlert, AlertTriangle,
  Swords, Target, Trophy, Crown, Zap, Brain, Coins,
  FlaskConical, Users, ChevronRight, Star, Shield,
  Clock, Activity, Server, Gauge, Sparkles,
} from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { BUILD_INFO, getDisplayVersion } from "@shared/config/buildConfig";

type PublicHealthCheck = { status: "ok" | "warning" | "critical"; value: number; threshold: number; message: string; lastChecked: number };
type PublicHealthResponse = { success: boolean; status: "healthy" | "degraded" | "unhealthy"; score: number; timestamp: number; checks?: Record<string, PublicHealthCheck>; message?: string };

function getHealthBadgeClass(s: PublicHealthResponse["status"]) {
  if (s === "healthy") return "border-emerald-300 bg-emerald-50 text-emerald-700";
  if (s === "degraded") return "border-amber-300 bg-amber-50 text-amber-700";
  return "border-red-300 bg-red-50 text-red-700";
}
function getHealthIcon(s: PublicHealthResponse["status"]) {
  if (s === "healthy") return ShieldCheck;
  if (s === "degraded") return AlertTriangle;
  return ShieldAlert;
}
function formatHealthStatus(s: PublicHealthResponse["status"]) {
  if (s === "healthy") return "Healthy";
  if (s === "degraded") return "Degraded";
  return "Unhealthy";
}
function formatTimeAgo(ts?: number) {
  if (!ts) return "Awaiting telemetry";
  const s = Math.max(0, Math.floor((Date.now() - ts) / 1000));
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  return `${Math.floor(m / 60)}h ago`;
}

function LandingStarfield() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="starfield-layer" />
      <div className="nebula-layer" />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950/80 to-slate-950" />
    </div>
  );
}

function HeroParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 20 }).map((_, i) => (
        <div key={i} className="absolute w-1 h-1 bg-amber-400/40 rounded-full opacity-0 animate-particle-float"
          style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 8}s`, animationDuration: `${6 + Math.random() * 6}s` }} />
      ))}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl animate-nebula-pulse" />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl animate-nebula-pulse-delayed" />
    </div>
  );
}

function OrbitSpinner() {
  return (
    <div className="relative w-5 h-5">
      <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-amber-400 animate-spin" />
      <div className="absolute inset-0.5 rounded-full border border-transparent border-t-orange-400 animate-spin" style={{ animationDirection: "reverse", animationDuration: "1.5s" }} />
    </div>
  );
}

const SYSTEMS = [
  { icon: Shield, title: "Fleet Command", desc: "Deploy and manage your fleets across the cosmos" },
  { icon: Brain, title: "Research & Tech", desc: "Unlock advanced technologies and blueprints" },
  { icon: Coins, title: "Economy", desc: "Balance production, trade, and resource flow" },
  { icon: Users, title: "Alliance", desc: "Form alliances and conquer together" },
  { icon: FlaskConical, title: "Exploration", desc: "Discover hidden systems and ancient relics" },
  { icon: Zap, title: "Warfare", desc: "Engage in real-time tactical combat" },
];

const ROADMAP = [
  { phase: "I", title: "Foundation", items: ["Core economy & resource systems", "Basic fleet mechanics", "Research tree v1", "Alliance framework"] },
  { phase: "II", title: "Expansion", items: ["Alliance warfare", "Dynamic universe events", "Commander progression", "Market systems"] },
  { phase: "III", title: "Dominion", items: ["Seasonal content", "Relic & artifact systems", "Narrative story arcs", "Mega-structures"] },
  { phase: "IV", title: "Legacy", items: ["Endgame sovereignty", "Cross-universe competition", "Legacy rankings", "Empire legacy system"] },
];

const TEAM = [
  { name: "STEPHEN", role: "Lead Developer & Visionary", desc: "Architect of the dominion systems, builder of empires" },
];

const TESTIMONIALS = [
  { text: "An empire building test is unmatched. Every decision shapes the fate of your civilization across the stars.", author: "Commander Atlas", realm: "Alpha Centauri" },
];

export default function Auth() {
  const { isLoading, login } = useGame();
  const [isLogin, setIsLogin] = useState(true);
  const [isForgot, setIsForgot] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [tempPassword, setTempPassword] = useState("");
  const [copied, setCopied] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const buildChannel = BUILD_INFO.buildChannel;

  const { data: healthData } = useQuery<PublicHealthResponse>({
    queryKey: ["/api/status/health", "landing"],
    queryFn: async () => {
      const response = await fetch("/api/status/health");
      const payload = (await response.json().catch(() => null)) as PublicHealthResponse | null;
      return payload && typeof payload === "object" ? payload : { success: false, status: "unhealthy" as const, score: 0, timestamp: Date.now(), checks: {}, message: "Health telemetry unavailable" };
    },
    refetchInterval: 30000, staleTime: 15000, retry: false,
  });

  const HealthIcon = getHealthIcon(healthData?.status || "unhealthy");

  useEffect(() => {
    const su = localStorage.getItem("stellar_username");
    const sp = localStorage.getItem("stellar_password");
    if (su) setUsername(su);
    if (sp) setPassword(sp);
  }, []);

  const clearCredentials = () => { localStorage.removeItem("stellar_username"); localStorage.removeItem("stellar_password"); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
      const body: Record<string, string> = { username: username.trim(), password };
      if (!isLogin) {
        body.email = email.trim();
        body.firstName = firstName.trim() || username.trim();
      }
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Authentication failed");
        setSubmitting(false);
        return;
      }
      localStorage.setItem("stellar_username", username.trim());
      localStorage.setItem("stellar_password", password);
      login();
    } catch {
      setError("Connection error. Please try again.");
      setSubmitting(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault(); setError("");
    if (!username.trim()) { setError("Username is required"); return; }
    if (!email.trim()) { setError("Email is required"); return; }
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/reset-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username: username.trim(), email: email.trim() }), credentials: "include" });
      const data = await res.json();
      if (!res.ok) { setError(data.message || "Password reset failed"); setSubmitting(false); return; }
      setTempPassword(data.temporaryPassword); setSubmitting(false);
    } catch { setError("Failed to reset password. Please try again."); setSubmitting(false); }
  };

  const copyPassword = () => { navigator.clipboard.writeText(tempPassword); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <div className="min-h-screen bg-[#0a0a12] text-white relative overflow-x-hidden">

      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <LandingStarfield />
        <HeroParticles />

        {/* Decorative gold lines */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-500/50" />
              <Crown className="w-5 h-5 text-amber-500" />
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-500/50" />
            </div>
            <p className="text-amber-500/80 font-rajdhani text-sm tracking-[0.4em] uppercase mb-4">A 4X Space Strategy Experience</p>
          </div>

          <h1 className="font-orbitron text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[0.95] mb-6">
            <span className="text-white block">FORGE YOUR</span>
            <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent block mt-2">CIVILIZATION</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300/80 font-rajdhani max-w-2xl mx-auto mb-10 leading-relaxed">
            Command your empire across the vast expanse of space. Build, research, and conquer your way to galactic supremacy.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <button
              onClick={() => setShowLoginModal(true)}
              className="group relative px-10 py-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-orbitron text-sm tracking-[0.2em] uppercase rounded-lg shadow-lg shadow-amber-500/25 transition-all hover:shadow-xl hover:shadow-amber-500/30 hover:scale-[1.03] flex items-center gap-3"
            >
              <Rocket className="w-4 h-4" />
              ENTER THE DOMINION
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <Link href="/realms">
              <Button variant="outline" className="border-amber-500/30 bg-amber-500/5 text-amber-300 hover:bg-amber-500/10 font-orbitron text-sm tracking-wider px-8 py-4 h-auto">
                Browse Realms
              </Button>
            </Link>
          </div>

          <div className="flex items-center justify-center gap-6 mt-10 text-xs text-slate-500">
            <div className="flex items-center gap-2"><Swords className="w-3.5 h-3.5 text-amber-500/60" />4X Strategy</div>
            <div className="flex items-center gap-2"><Target className="w-3.5 h-3.5 text-amber-500/60" />Real-time Combat</div>
            <div className="flex items-center gap-2"><Globe2 className="w-3.5 h-3.5 text-amber-500/60" />Alliance Wars</div>
            <div className="flex items-center gap-2"><Trophy className="w-3.5 h-3.5 text-amber-500/60" />Season Pass</div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500 animate-bounce">
          <span className="text-[10px] tracking-[0.3em] uppercase">Scroll</span>
          <ChevronRight className="w-4 h-4 rotate-90" />
        </div>
      </section>

      {/* ===== BUILD YOUR DOMINION ===== */}
      <section className="relative py-24 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a12] via-[#0d0d18] to-[#0a0a12]" />
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-amber-500/70 text-xs tracking-[0.4em] uppercase mb-3 font-rajdhani">The Pillars of Power</p>
            <h2 className="font-orbitron text-3xl sm:text-4xl font-bold text-white tracking-wide">
              Build Your <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">Dominion</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Swords, title: "Military Might", desc: "Forge unstoppable fleets and crush your enemies with overwhelming firepower across the stars.", color: "from-red-500 to-orange-500" },
              { icon: Coins, title: "Economic Power", desc: "Build thriving economies, establish trade routes, and accumulate vast wealth to fuel your empire.", color: "from-amber-500 to-yellow-500" },
              { icon: Users, title: "Diplomatic Mastery", desc: "Navigate complex political landscapes, forge alliances, and outmaneuver rivals through cunning diplomacy.", color: "from-blue-500 to-cyan-500" },
            ].map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="group relative rounded-xl border border-amber-500/10 bg-[#12121f]/80 backdrop-blur-sm p-8 hover:border-amber-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/5">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${color} bg-opacity-10 flex items-center justify-center mb-5 border border-white/5`}
                  style={{ background: `linear-gradient(135deg, ${color.includes('red') ? 'rgba(239,68,68,0.15)' : color.includes('amber') ? 'rgba(245,158,11,0.15)' : 'rgba(59,130,246,0.15)'}, transparent)` }}>
                  <Icon className="w-6 h-6 text-amber-400" />
                </div>
                <h3 className="font-orbitron text-lg font-bold text-white tracking-wide mb-3">{title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SYSTEMS OF THE EMPIRE ===== */}
      <section className="relative py-24 px-6">
        <div className="absolute inset-0 bg-[#0a0a12]" />
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-amber-500/70 text-xs tracking-[0.4em] uppercase mb-3 font-rajdhani">Deep Strategic Systems</p>
            <h2 className="font-orbitron text-3xl sm:text-4xl font-bold text-white tracking-wide">
              Systems of the <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">Empire</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {SYSTEMS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-xl border border-amber-500/10 bg-[#12121f]/60 p-6 hover:border-amber-500/25 transition-all group">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-amber-400" />
                  </div>
                  <h3 className="font-orbitron text-sm font-bold text-white tracking-wide">{title}</h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CONQUEST REDEFINED ===== */}
      <section className="relative py-24 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a12] via-[#0d0d18] to-[#0a0a12]" />
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-amber-500/70 text-xs tracking-[0.4em] uppercase mb-3 font-rajdhani">Real-Time Strategy</p>
              <h2 className="font-orbitron text-3xl sm:text-4xl font-bold text-white tracking-wide mb-6">
                Conquest<br />
                <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">Redefined</span>
              </h2>
              <div className="space-y-4">
                {[
                  "Real-time tactical combat with fleet management",
                  "Deep technology trees and research progression",
                  "Dynamic alliances and diplomatic systems",
                  "Seasonal content and competitive leaderboards",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <ChevronRight className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                    <span className="text-sm text-slate-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="rounded-2xl border border-amber-500/20 bg-[#12121f]/80 p-6 shadow-2xl shadow-amber-500/5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                  <span className="ml-2 text-[10px] text-slate-500 font-mono">STELLAR DOMINION v{getDisplayVersion()}</span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-lg bg-[#1a1a2e] border border-amber-500/10 p-3 text-center">
                    <Zap className="w-5 h-5 text-amber-400 mx-auto mb-1" />
                    <div className="text-[10px] text-slate-500">Fleet Power</div>
                    <div className="text-sm font-orbitron font-bold text-white">12.8M</div>
                  </div>
                  <div className="rounded-lg bg-[#1a1a2e] border border-amber-500/10 p-3 text-center">
                    <FlaskConical className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                    <div className="text-[10px] text-slate-500">Research</div>
                    <div className="text-sm font-orbitron font-bold text-white">Lv. 847</div>
                  </div>
                  <div className="rounded-lg bg-[#1a1a2e] border border-amber-500/10 p-3 text-center">
                    <Globe2 className="w-5 h-5 text-green-400 mx-auto mb-1" />
                    <div className="text-[10px] text-slate-500">Colonies</div>
                    <div className="text-sm font-orbitron font-bold text-white">23</div>
                  </div>
                </div>
                <div className="mt-4 rounded-lg bg-[#1a1a2e] border border-amber-500/10 p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] text-slate-500">EMPIRE SCORE</span>
                    <span className="text-xs font-orbitron font-bold text-amber-400">3.2M</span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full" style={{ width: "68%" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== BUILD YOUR CIVILIZATION ===== */}
      <section className="relative py-24 px-6">
        <div className="absolute inset-0 bg-[#0a0a12]" />
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-amber-500/70 text-xs tracking-[0.4em] uppercase mb-3 font-rajdhani">Expand Your Reach</p>
            <h2 className="font-orbitron text-3xl sm:text-4xl font-bold text-white tracking-wide">
              Build Your <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">Civilization</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Colony Management", desc: "Expand from a single world to a vast interstellar empire with diverse planetary colonies.", img: "/assets/planets/terra.png" },
              { title: "Technology Trees", desc: "Research hundreds of technologies across multiple disciplines to unlock new capabilities.", img: "/assets/research/astrophysics.png" },
              { title: "Infrastructure", desc: "Build mines, factories, shipyards, and orbital stations to power your growing dominion.", img: "/assets/buildings/shipyard.png" },
            ].map(({ title, desc, img }) => (
              <div key={title} className="group rounded-xl border border-amber-500/10 bg-[#12121f]/60 overflow-hidden hover:border-amber-500/25 transition-all">
                <div className="h-44 bg-gradient-to-br from-amber-900/20 to-orange-900/10 flex items-center justify-center overflow-hidden">
                  <img src={img} alt={title} className="w-24 h-24 object-contain opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                </div>
                <div className="p-6">
                  <h3 className="font-orbitron text-base font-bold text-white tracking-wide mb-2">{title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== STATS SECTION ===== */}
      <section className="relative py-24 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a12] via-[#0d0d18] to-[#0a0a12]" />
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="absolute inset-0 bg-amber-500/5 rounded-3xl blur-3xl" />
              <div className="relative rounded-2xl border border-amber-500/15 bg-[#12121f]/80 p-8 text-center">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/10 flex items-center justify-center border border-amber-500/20">
                  <Globe2 className="w-10 h-10 text-amber-400" />
                </div>
                <div className="text-5xl font-orbitron font-black text-white mb-2">30</div>
                <div className="text-sm text-amber-400/80 font-rajdhani tracking-wider uppercase">Universes</div>
                <div className="w-16 h-px bg-amber-500/30 mx-auto my-4" />
                <div className="text-5xl font-orbitron font-black text-white mb-2">300</div>
                <div className="text-sm text-amber-400/80 font-rajdhani tracking-wider uppercase">Realms</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Active Players", value: "50K+", icon: Users },
                { label: "Alliances", value: "1,200+", icon: Shield },
                { label: "Total Empires", value: "8.5M", icon: Crown },
                { label: "Daily Battles", value: "240K+", icon: Swords },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="rounded-xl border border-amber-500/10 bg-[#12121f]/60 p-5 text-center">
                  <Icon className="w-6 h-6 text-amber-400/60 mx-auto mb-2" />
                  <div className="text-2xl font-orbitron font-bold text-white">{value}</div>
                  <div className="text-xs text-slate-500 mt-1">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== ROADMAP ===== */}
      <section className="relative py-24 px-6">
        <div className="absolute inset-0 bg-[#0a0a12]" />
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-amber-500/70 text-xs tracking-[0.4em] uppercase mb-3 font-rajdhani">The Path Forward</p>
            <h2 className="font-orbitron text-3xl sm:text-4xl font-bold text-white tracking-wide">
              Roadmap to <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">Greatness</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ROADMAP.map(({ phase, title, items }, i) => (
              <div key={phase} className="relative rounded-xl border border-amber-500/10 bg-[#12121f]/60 p-6 group hover:border-amber-500/25 transition-all">
                <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
                <div className="text-3xl font-orbitron font-black text-amber-500/20 mb-2">{phase}</div>
                <h3 className="font-orbitron text-base font-bold text-white tracking-wide mb-4">{title}</h3>
                <ul className="space-y-2">
                  {items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-xs text-slate-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500/40 mt-1.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== DEVELOPMENT TEAM ===== */}
      <section className="relative py-24 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a12] via-[#0d0d18] to-[#0a0a12]" />
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-amber-500/70 text-xs tracking-[0.4em] uppercase mb-3 font-rajdhani">The Visionaries</p>
            <h2 className="font-orbitron text-3xl sm:text-4xl font-bold text-white tracking-wide">
              Development <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">Team</span>
            </h2>
          </div>

          <div className="flex justify-center">
            {TEAM.map(({ name, role, desc }) => (
              <div key={name} className="rounded-xl border border-amber-500/15 bg-[#12121f]/80 p-8 text-center max-w-sm w-full">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/10 flex items-center justify-center border border-amber-500/20">
                  <Crown className="w-8 h-8 text-amber-400" />
                </div>
                <h3 className="font-orbitron text-lg font-bold text-white tracking-wider mb-1">{name}</h3>
                <p className="text-xs text-amber-400/80 font-rajdhani tracking-wider uppercase mb-3">{role}</p>
                <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== VOICES OF THE EMPIRE ===== */}
      <section className="relative py-24 px-6">
        <div className="absolute inset-0 bg-[#0a0a12]" />
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-amber-500/70 text-xs tracking-[0.4em] uppercase mb-3 font-rajdhani">Commander Testimonials</p>
            <h2 className="font-orbitron text-3xl sm:text-4xl font-bold text-white tracking-wide">
              Voices of the <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">Empire</span>
            </h2>
          </div>

          <div className="flex justify-center">
            {TESTIMONIALS.map(({ text, author, realm }, i) => (
              <div key={i} className="rounded-xl border border-amber-500/15 bg-[#12121f]/80 p-8 max-w-xl w-full">
                <Star className="w-6 h-6 text-amber-400/40 mb-4" />
                <p className="text-sm text-slate-300 leading-relaxed italic mb-6">"{text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/10 flex items-center justify-center border border-amber-500/20">
                    <Crown className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">{author}</div>
                    <div className="text-xs text-amber-400/60">{realm}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CLAIM YOUR THRONE CTA ===== */}
      <section className="relative py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a12] via-[#12100a] to-[#0a0a12]" />
        <div className="absolute inset-0 bg-[url('/assets/backgrounds/deep_space.png')] bg-cover bg-center opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a12] via-transparent to-[#0a0a12]" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <p className="text-amber-500/70 text-xs tracking-[0.4em] uppercase mb-3 font-rajdhani">Your Journey Begins</p>
          <h2 className="font-orbitron text-4xl sm:text-5xl font-black text-white tracking-wide mb-6">
            Claim Your<br />
            <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">Throne</span>
          </h2>
          <p className="text-lg text-slate-300/70 font-rajdhani max-w-xl mx-auto mb-10">
            Forge your legacy among the stars. The galaxy awaits its new ruler.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <button
              onClick={() => setShowLoginModal(true)}
              className="group relative px-10 py-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-orbitron text-sm tracking-[0.2em] uppercase rounded-lg shadow-lg shadow-amber-500/25 transition-all hover:shadow-xl hover:shadow-amber-500/30 hover:scale-[1.03] flex items-center gap-3"
            >
              <Rocket className="w-4 h-4" />
              ENTER THE DOMINION
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="relative bg-[#0a0a12] border-t border-amber-500/10 py-10 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <Rocket className="w-5 h-5 text-amber-400" />
              <span className="font-orbitron font-bold text-sm text-white tracking-wide">{BUILD_INFO.appName}</span>
              <span className="text-xs text-slate-600">•</span>
              <span className="text-xs text-slate-500">{getDisplayVersion()}</span>
            </div>
            <div className="flex items-center gap-6 text-xs text-slate-500">
              <Link href="/terms" className="hover:text-amber-400 transition-colors">Terms of Service</Link>
              <Link href="/privacy" className="hover:text-amber-400 transition-colors">Privacy Policy</Link>
              <Link href="/forums" className="hover:text-amber-400 transition-colors">Forums</Link>
              <a href={BUILD_INFO.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-amber-400/60 hover:text-amber-300 transition-colors">
                <Github className="w-3.5 h-3.5" /> {BUILD_INFO.devAlias}
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* ===== LOGIN MODAL ===== */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => { setShowLoginModal(false); setError(""); setTempPassword(""); }} />
          <div className="relative w-full max-w-md bg-[#12121f] border border-amber-500/15 rounded-2xl shadow-2xl shadow-amber-500/5 p-8">
            <button onClick={() => { setShowLoginModal(false); setError(""); setTempPassword(""); }}
              className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors text-xl">&times;</button>

            <div className="text-center mb-6">
              <h2 className="font-orbitron text-2xl font-bold text-white tracking-wider">{isForgot ? "Account Recovery" : isLogin ? "Welcome Back, Commander" : "Join the Dominion"}</h2>
              <p className="text-sm text-slate-400 mt-2">{isForgot ? "Reset your access credentials" : isLogin ? "Enter your credentials to command your fleet" : "Create an account to begin your conquest"}</p>
            </div>

            {tempPassword ? (
              <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl space-y-3">
                <div className="flex gap-2 items-start">
                  <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div><p className="font-semibold text-emerald-300">Password Reset Successful!</p><p className="text-sm text-emerald-400/80 mt-1">Your temporary password is:</p></div>
                </div>
                <div className="bg-slate-900/50 border border-emerald-500/20 p-3 rounded flex items-center justify-between font-mono text-sm">
                  <span className="text-white break-all">{tempPassword}</span>
                  <button type="button" onClick={copyPassword} className="ml-2 shrink-0 p-1 hover:bg-slate-800 rounded transition-colors">
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
                  </button>
                </div>
                <p className="text-xs text-emerald-400/70">Use this password to login, then change it in your account settings.</p>
                <button type="button" onClick={() => { setIsForgot(false); setTempPassword(""); setUsername(""); setEmail(""); }}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-2 rounded-lg font-semibold transition-all">
                  Back to Login
                </button>
              </div>
            ) : (
              <>
                <form onSubmit={isForgot ? handleForgotPassword : handleSubmit} className="space-y-4">
                  {isLogin && !isForgot && (
                    <Button type="button" onClick={() => login()} variant="outline" className="w-full border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 hover:border-amber-400/50 font-semibold tracking-wide" disabled={submitting}>
                      <Sparkles className="w-4 h-4 mr-2" /> Try Demo Account
                    </Button>
                  )}

                  <div className="space-y-1.5">
                    <Label htmlFor="modal-username" className="text-slate-300 text-sm font-medium">Username</Label>
                    <Input id="modal-username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter username"
                      className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-amber-500/50 focus:ring-amber-500/25 h-11"
                      disabled={submitting} required minLength={3} autoComplete="username" />
                  </div>

                  {isForgot && (
                    <div className="space-y-1.5">
                      <Label htmlFor="modal-email" className="text-slate-300 text-sm font-medium">Email</Label>
                      <Input id="modal-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email"
                        className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-amber-500/50 focus:ring-amber-500/25 h-11"
                        disabled={submitting} required />
                    </div>
                  )}

                  {!isLogin && !isForgot && (
                    <>
                      <div className="space-y-1.5">
                        <Label htmlFor="modal-reg-email" className="text-slate-300 text-sm font-medium">Email Address</Label>
                        <Input id="modal-reg-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email"
                          className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-amber-500/50 focus:ring-amber-500/25 h-11"
                          disabled={submitting} required />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="modal-firstName" className="text-slate-300 text-sm font-medium">First Name (Optional)</Label>
                        <Input id="modal-firstName" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Your first name"
                          className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-amber-500/50 focus:ring-amber-500/25 h-11"
                          disabled={submitting} />
                      </div>
                    </>
                  )}

                  {!isForgot && (
                    <div className="space-y-1.5">
                      <Label htmlFor="modal-password" className="text-slate-300 text-sm font-medium">Password</Label>
                      <div className="relative">
                        <Input id="modal-password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter password"
                          className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 pr-10 focus:border-amber-500/50 focus:ring-amber-500/25 h-11"
                          disabled={submitting} required minLength={6} autoComplete={isLogin ? "current-password" : "new-password"} />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} disabled={submitting}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors disabled:opacity-50">
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  )}

                  {!isLogin && !isForgot && (
                    <div className="space-y-3 p-3 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex items-start gap-3">
                        <input type="checkbox" id="modal-terms" checked={agreedToTerms} onChange={(e) => setAgreedToTerms(e.target.checked)}
                          className="mt-1 h-4 w-4 rounded border-white/20 bg-white/5 text-amber-500 focus:ring-amber-500/25" disabled={submitting} />
                        <label htmlFor="modal-terms" className="text-xs text-slate-400 leading-relaxed">
                          I agree to the <Link href="/terms" className="text-amber-400 hover:text-amber-300 underline" target="_blank">Terms of Service</Link> and understand the rules.
                        </label>
                      </div>
                      <div className="flex items-start gap-3">
                        <input type="checkbox" id="modal-privacy" checked={agreedToPrivacy} onChange={(e) => setAgreedToPrivacy(e.target.checked)}
                          className="mt-1 h-4 w-4 rounded border-white/20 bg-white/5 text-amber-500 focus:ring-amber-500/25" disabled={submitting} />
                        <label htmlFor="modal-privacy" className="text-xs text-slate-400 leading-relaxed">
                          I have read and agree to the <Link href="/privacy" className="text-amber-400 hover:text-amber-300 underline" target="_blank">Privacy Policy</Link>.
                        </label>
                      </div>
                    </div>
                  )}

                  {error && (
                    <div className="text-red-300 text-sm bg-red-500/10 border border-red-500/30 p-3 rounded-lg flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />{error}
                    </div>
                  )}

                  <Button type="submit" className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-orbitron tracking-widest h-12 shadow-lg shadow-amber-500/25 transition-all hover:shadow-xl hover:shadow-amber-500/30 hover:scale-[1.02]"
                    disabled={submitting || isLoading || (!isLogin && !isForgot && (!agreedToTerms || !agreedToPrivacy))}>
                    {submitting || isLoading ? (<div className="flex items-center gap-2"><OrbitSpinner /><span>PROCESSING</span></div>) : isForgot ? "RESET PASSWORD" : isLogin ? "ENTER GAME" : "CREATE ACCOUNT"}
                  </Button>
                </form>

                <div className="mt-5 space-y-2 text-center">
                  {isForgot ? (
                    <button type="button" onClick={() => { setIsForgot(false); setEmail(""); setError(""); }}
                      className="w-full text-sm text-slate-400 hover:text-white underline transition-colors" disabled={submitting}>Back to login</button>
                  ) : (
                    <>
                      <button type="button" onClick={() => { setIsLogin(!isLogin); setError(""); }}
                        className="w-full text-sm text-slate-400 hover:text-white underline transition-colors" disabled={submitting}>
                        {isLogin ? "Create new account" : "Already have an account? Sign in"}
                      </button>
                      <button type="button" onClick={() => { clearCredentials(); setUsername(""); setPassword(""); setError(""); }}
                        className="w-full text-xs text-slate-500 hover:text-slate-300 underline transition-colors" disabled={submitting}>Clear saved credentials</button>
                      {isLogin && (
                        <button type="button" onClick={() => { setIsForgot(true); setError(""); setTempPassword(""); }}
                          className="w-full text-xs text-slate-500 hover:text-slate-300 underline transition-colors" disabled={submitting}>Forgot password?</button>
                      )}
                    </>
                  )}
                </div>
              </>
            )}

            <div className="mt-5 pt-5 border-t border-white/10 text-center">
              <Link href="/about" className="text-sm text-slate-400 hover:text-white transition-colors inline-flex items-center gap-2">
                About Stellar Dominion
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
