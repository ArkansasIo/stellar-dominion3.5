import { useState } from "react";
import { useGame } from "@/lib/gameContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import GameLogo from "@/components/GameLogo";
import {
  Calendar, Shield, Flame, Clock, Globe2, ArrowRight, ArrowLeft,
  Check, Server, Wifi, Loader2,
} from "lucide-react";

type SeasonType = "permanent" | "active" | "archived";
type ServerStatus = "healthy" | "degraded" | "unhealthy";

interface Season {
  id: string;
  type: SeasonType;
  name: string;
  description: string;
  badge: string;
  badgeColor: string;
  stats: string;
  timer?: string;
  icon: typeof Shield;
  gradient: string;
  border: string;
  bg: string;
}

interface GameServer {
  id: string;
  name: string;
  region: string;
  flag: string;
  ping: number;
  population: string;
  status: ServerStatus;
}

const SEASONS: Season[] = [
  {
    id: "permanent",
    type: "permanent",
    name: "Permanent Universe",
    description: "Your empire persists forever. No season resets.",
    badge: "STABLE",
    badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    stats: "Standard rules, no seasonal content",
    icon: Shield,
    gradient: "from-blue-600 to-blue-800",
    border: "border-blue-500/40",
    bg: "bg-blue-500/10",
  },
  {
    id: "season4",
    type: "active",
    name: "Season 4: Galactic Conquest",
    description: "12-week season with unique rewards.",
    badge: "ACTIVE",
    badgeColor: "bg-green-500/20 text-green-300 border-green-500/30",
    stats: "100-tier pass, 6 events, 18 cosmetics",
    timer: "Ends in 6 weeks, 2 days",
    icon: Flame,
    gradient: "from-amber-500 to-orange-600",
    border: "border-amber-500/40",
    bg: "bg-amber-500/10",
  },
  {
    id: "archived",
    type: "archived",
    name: "Previous Seasons",
    description: "Access completed season content.",
    badge: "ARCHIVED",
    badgeColor: "bg-slate-500/20 text-slate-300 border-slate-500/30",
    stats: "Season 1-3 archives available",
    icon: Clock,
    gradient: "from-slate-500 to-slate-700",
    border: "border-slate-500/40",
    bg: "bg-slate-500/10",
  },
];

const SERVERS: GameServer[] = [
  { id: "nexus", name: "Nexus Alpha", region: "US East", flag: "🇺🇸", ping: 30, population: "42,000", status: "healthy" },
  { id: "cygnus", name: "Cygnus", region: "EU West", flag: "🇪🇺", ping: 80, population: "28,000", status: "healthy" },
  { id: "orion", name: "Orion", region: "APAC", flag: "🌏", ping: 150, population: "18,000", status: "healthy" },
];

const STATUS_COLORS: Record<ServerStatus, string> = {
  healthy: "bg-green-500",
  degraded: "bg-amber-500",
  unhealthy: "bg-red-500",
};

const STATUS_TEXT: Record<ServerStatus, string> = {
  healthy: "Healthy",
  degraded: "Degraded",
  unhealthy: "Unhealthy",
};

export default function SeasonServerPicker() {
  const { setOnboardingStep } = useGame();
  const [selectedSeason, setSelectedSeason] = useState<string | null>(null);
  const [selectedServer, setSelectedServer] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canProceed = selectedSeason && selectedServer;

  const handleBack = () => setOnboardingStep(0);

  const handleProceed = async () => {
    if (!canProceed) return;
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    setOnboardingStep(2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 2 + 1,
              height: Math.random() * 2 + 1,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.4 + 0.1,
            }}
          />
        ))}
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-indigo-500/5 rounded-full blur-[140px] pointer-events-none" />

      <Button
        variant="ghost"
        className="absolute top-4 left-4 text-slate-400 hover:text-white z-20 transition-colors"
        onClick={handleBack}
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Realm Selection
      </Button>
      <div className="text-sm text-slate-500 absolute top-4 right-4 font-mono">
        Step 2 of 3 — Season & Server
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-3xl space-y-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg overflow-hidden">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-orbitron font-bold tracking-wider text-white">
              SELECT SEASON & SERVER
            </h1>
            <p className="text-slate-400 font-rajdhani text-lg font-medium mt-2">
              Choose your playing environment. Each season offers unique rewards and challenges.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-400" />
              <h2 className="text-lg font-orbitron font-semibold text-white tracking-wider">
                SEASON
              </h2>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {SEASONS.map((season) => {
                const Icon = season.icon;
                const isSelected = selectedSeason === season.id;
                return (
                  <Card
                    key={season.id}
                    className={cn(
                      "bg-slate-900/80 border transition-all cursor-pointer group",
                      isSelected
                        ? `${season.border} shadow-lg bg-opacity-100`
                        : "border-slate-700/50 hover:border-slate-600",
                    )}
                    onClick={() => setSelectedSeason(season.id)}
                  >
                    <CardContent className="p-5 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br", season.gradient)}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        {isSelected && (
                          <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-white">{season.name}</h3>
                      <p className="text-slate-400 text-sm">{season.description}</p>
                      <Badge className={cn("text-[10px] border", season.badgeColor)}>
                        {season.badge}
                      </Badge>
                      <p className="text-slate-500 text-xs">{season.stats}</p>
                      {season.timer && (
                        <div className="flex items-center gap-1.5 text-amber-400 text-xs font-semibold">
                          <Clock className="w-3.5 h-3.5" />
                          {season.timer}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Server className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-orbitron font-semibold text-white tracking-wider">
                SELECT SERVER
              </h2>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {SERVERS.map((server) => {
                const isSelected = selectedServer === server.id;
                return (
                  <Card
                    key={server.id}
                    className={cn(
                      "bg-slate-900/80 border transition-all cursor-pointer",
                      isSelected
                        ? "border-cyan-500/50 shadow-lg shadow-cyan-500/10"
                        : "border-slate-700/50 hover:border-slate-600",
                    )}
                    onClick={() => setSelectedServer(server.id)}
                  >
                    <CardContent className="p-5 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="text-3xl">{server.flag}</div>
                        {isSelected && (
                          <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white">{server.name}</h3>
                        <p className="text-slate-400 text-xs">{server.region}</p>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1 text-slate-300">
                          <Wifi className="w-3.5 h-3.5 text-green-400" />
                          ~{server.ping}ms
                        </div>
                        <div className="text-slate-400">{server.population} online</div>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs">
                        <div className={cn("w-2 h-2 rounded-full", STATUS_COLORS[server.status])} />
                        <span className="text-slate-300">{STATUS_TEXT[server.status]}</span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          <Card className="bg-slate-900/80 border-slate-700/50">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="text-sm text-slate-400 font-mono">
                Season:{" "}
                <span className="text-white">
                  {SEASONS.find((s) => s.id === selectedSeason)?.name || "Not selected"}
                </span>
                {" | "}
                Server:{" "}
                <span className="text-white">
                  {SERVERS.find((s) => s.id === selectedServer)?.name || "Not selected"}
                </span>
              </div>
              <Button
                className={cn(
                  "font-orbitron tracking-wider px-8 shadow-lg transition-all",
                  canProceed
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white hover:shadow-xl"
                    : "bg-slate-800 text-slate-600 cursor-not-allowed",
                )}
                disabled={!canProceed || isSubmitting}
                onClick={handleProceed}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    INITIALIZING...
                  </>
                ) : (
                  <>
                    PROCEED TO EMPIRE VAULT
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
