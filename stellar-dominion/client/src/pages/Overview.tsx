import GameLayout from "@/components/layout/GameLayout";
import { useGame } from "@/lib/gameContext";
import { PLANET_ASSETS, TECH_BRANCH_ASSETS, SHIP_ASSETS } from "@shared/config";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useMutation, useQuery } from "@tanstack/react-query";
import { 
  Activity, Thermometer, Ruler, User, Shield, Crosshair, Send, AlertTriangle, 
  Info, CheckCircle, AlertCircle, Box, Gem, Database, Zap, TrendingUp, 
  Clock, Rocket, FlaskConical, Factory, Pickaxe, Globe, Star, Target,
  ArrowUpCircle, Users, Trophy, Swords, Eye, MessageSquare, Bell
} from "lucide-react";
import { getPlanetDetails } from "@/lib/planetUtils";
import Navigation from "./Navigation";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

const TEMP_THEME_IMAGE = "/theme-temp.png";

interface SeasonPassProgressResponse {
  success: boolean;
  state: {
    currentTier: number;
    xp: number;
    xpIntoTier: number;
    xpForNextTier: number;
    completionRatio: number;
  };
}

interface BattlePassOverviewResponse {
  state: {
    currentTier: number;
    xp: number;
    xpIntoTier: number;
    xpForNextTier: number;
    completionRatio: number;
    premiumUnlocked: boolean;
    eliteUnlocked: boolean;
  };
}

interface PopulationSnapshotResponse {
  success: boolean;
  snapshot: {
    frameTier: number;
    frame: {
      name: string;
    };
    population: {
      current: number;
      capacity: number;
      utilization: number;
      happiness: number;
      estimatedGrowthPerHour: number;
    };
    food: {
      pressure: "surplus" | "stable" | "strained" | "critical";
      netPerHour: number;
      hoursToDepletion: number | null;
    };
    water: {
      pressure: "surplus" | "stable" | "strained" | "critical";
      netPerHour: number;
      hoursToDepletion: number | null;
    };
    civilizationSystems: {
      projectedProductivity: number;
      foodDemandFromJobsPerHour: number;
      waterDemandFromJobsPerHour: number;
    };
  };
}

function pressureBadgeClass(pressure: "surplus" | "stable" | "strained" | "critical"): string {
  if (pressure === "surplus") return "text-emerald-700 border-emerald-300";
  if (pressure === "stable") return "text-blue-700 border-blue-300";
  if (pressure === "strained") return "text-amber-700 border-amber-300";
  return "text-red-700 border-red-300";
}

function getPlanetImagePath(planetClass: string): string {
  const c = planetClass.toUpperCase();
  if (c === "M") return PLANET_ASSETS.TERRESTRIAL.EARTH_LIKE.path;
  if (c === "H") return PLANET_ASSETS.TERRESTRIAL.DESERT.path;
  if (c === "L") return PLANET_ASSETS.TERRESTRIAL.JUNGLE.path;
  if (c === "K") return PLANET_ASSETS.TERRESTRIAL.ICE.path;
  if (c === "Y") return PLANET_ASSETS.TERRESTRIAL.VOLCANIC.path;
  if (c === "D") return PLANET_ASSETS.TERRESTRIAL.DESERT.path;
  if (c === "J") return PLANET_ASSETS.GAS_GIANTS.JUPITER_CLASS.path;
  if (c === "T") return PLANET_ASSETS.GAS_GIANTS.NEPTUNE_CLASS.path;
  return PLANET_ASSETS.TERRESTRIAL.EARTH_LIKE.path;
}

export default function Overview() {
  const { toast } = useToast();
  const { 
    planetName, resources, buildings, events, coordinates, username, 
    queue, activeMissions, research, units, messages, alliance
  } = useGame();
  
  const coordParts = coordinates.split(':').map(p => parseInt(p) || 0);
  const planetSeed = (coordParts[0] || 1) * 10000 + (coordParts[1] || 1) * 1000 + (coordParts[2] || 100) * 100 + (coordParts[3] || 3);
  const planetInfo = getPlanetDetails(planetSeed);
  
  const displayUsername = username || localStorage.getItem("stellar_username") || "Commander";

  const metalProduction = Math.floor(30 * buildings.metalMine * 1.1);
  const crystalProduction = Math.floor(20 * buildings.crystalMine * 1.05);
  const deuteriumProduction = Math.floor(10 * buildings.deuteriumSynthesizer * 1.02);
  const energyProduction = Math.floor(20 * buildings.solarPlant) - Math.floor(10 * (buildings.metalMine + buildings.crystalMine + buildings.deuteriumSynthesizer));

  const totalFleetPower = Object.values(units).reduce((sum, count) => sum + (count * 100), 0);
  const totalResearchLevels = Object.values(research).reduce((sum, level) => sum + level, 0);
  const unreadMessages = messages.filter((m: any) => !m.read && m.to === "Commander").length;

  const buildQueue = queue.filter(q => q.type === "building");
  const researchQueue = queue.filter(q => q.type === "research");
  const unitQueue = queue.filter(q => q.type === "unit");
  const totalUnits = Object.values(units).reduce((sum, count) => sum + count, 0);

  const missionBreakdown = {
    outbound: activeMissions.filter((mission) => mission.status === "outbound").length,
    return: activeMissions.filter((mission) => mission.status === "return").length,
    combat: activeMissions.filter((mission) => mission.type === "attack").length,
    logistics: activeMissions.filter((mission) => ["transport", "colonize", "deploy"].includes(mission.type)).length,
  };

  const nextQueueCompletion = queue.length
    ? Math.max(0, Math.min(...queue.map((item) => item.endTime)) - Date.now())
    : 0;
  const nextQueueCompletionSeconds = Math.ceil(nextQueueCompletion / 1000);

  const economyReadiness = Math.max(
    0,
    Math.min(
      100,
      Math.round(
        45 +
          buildings.metalMine * 2 +
          buildings.crystalMine * 2 +
          buildings.deuteriumSynthesizer * 2 -
          (energyProduction < 0 ? Math.min(30, Math.abs(Math.floor(energyProduction / 50))) : 0)
      )
    )
  );
  const defenseReadiness = Math.max(0, Math.min(100, Math.round(25 + totalFleetPower / 250 + totalUnits / 20)));
  const researchReadiness = Math.max(0, Math.min(100, Math.round(20 + totalResearchLevels * 3)));
  const logisticsReadiness = Math.max(0, Math.min(100, Math.round(35 + activeMissions.length * 5 + unitQueue.length * 4)));

  const alerts: Array<{ title: string; detail: string; level: "warning" | "danger" | "info" }> = [];
  if (energyProduction < 0) {
    alerts.push({
      title: "Energy Deficit",
      detail: `Production is ${energyProduction.toLocaleString()}/h. Upgrade Solar Plant or pause heavy industry.`,
      level: "danger",
    });
  }
  if (resources.metal < 10000 || resources.crystal < 8000) {
    alerts.push({
      title: "Low Core Reserves",
      detail: "Metal/Crystal reserves are low for sustained upgrades.",
      level: "warning",
    });
  }
  if (activeMissions.length === 0) {
    alerts.push({
      title: "Idle Fleet",
      detail: "No active missions. Consider scouting, transport, or combat deployment.",
      level: "info",
    });
  }
  if (queue.length === 0) {
    alerts.push({
      title: "No Active Queue",
      detail: "Construction/research queue is empty. Queue next growth milestone.",
      level: "info",
    });
  }

  const recommendations = [
    {
      label: energyProduction < 0 ? "Stabilize energy economy" : "Scale mineral production",
      reason: energyProduction < 0 ? "Prevent production penalties from power deficit." : "Increase hourly throughput for faster upgrades.",
      href: "/resources",
    },
    {
      label: queue.length === 0 ? "Queue next build/research" : "Review active queue priorities",
      reason: queue.length === 0 ? "Avoid idle development time." : `Next completion in ~${nextQueueCompletionSeconds}s.`,
      href: queue.length === 0 ? "/facilities" : "/research",
    },
    {
      label: activeMissions.length === 0 ? "Dispatch strategic mission" : "Track mission outcomes",
      reason: activeMissions.length === 0 ? "Keep fleet active for expansion and intel." : `${missionBreakdown.outbound} outbound / ${missionBreakdown.return} returning.`,
      href: "/fleet",
    },
  ];

  const { data: seasonProgress } = useQuery<SeasonPassProgressResponse>({
    queryKey: ["/api/season-pass/progression"],
    queryFn: async () => {
      const response = await fetch("/api/season-pass/progression", { credentials: "include" });
      if (!response.ok) throw new Error("Failed to load season progression");
      return response.json();
    },
  });

  const { data: battlePassOverview } = useQuery<BattlePassOverviewResponse>({
    queryKey: ["/api/battle-pass/overview"],
    queryFn: async () => {
      const response = await fetch("/api/battle-pass/overview", { credentials: "include" });
      if (!response.ok) throw new Error("Failed to load battle pass overview");
      return response.json();
    },
  });

  const { data: populationSnapshot } = useQuery<PopulationSnapshotResponse>({
    queryKey: ["/api/population/snapshot"],
    queryFn: async () => {
      const response = await fetch("/api/population/snapshot", { credentials: "include" });
      if (!response.ok) throw new Error("Failed to load population snapshot");
      return response.json();
    },
  });

  const seasonXpMutation = useMutation({
    mutationFn: async (xp: number) => {
      const response = await apiRequest("POST", "/api/season-pass/xp", { xp });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/season-pass/progression"] });
      queryClient.invalidateQueries({ queryKey: ["/api/season-pass/overview"] });
      toast({ title: "Season XP Added", description: "Season progress updated." });
    },
    onError: (error: any) => {
      toast({ title: "Season XP failed", description: error?.message || "Unknown error", variant: "destructive" });
    },
  });

  const battleXpMutation = useMutation({
    mutationFn: async (xp: number) => {
      const response = await apiRequest("POST", "/api/battle-pass/xp", { xp });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/battle-pass/overview"] });
      toast({ title: "Battle XP Added", description: "Battle pass progress updated." });
    },
    onError: (error: any) => {
      toast({ title: "Battle XP failed", description: error?.message || "Unknown error", variant: "destructive" });
    },
  });

  return (
    <GameLayout>
      <div className="space-y-8 animate-in fade-in duration-500">
        
        <Navigation />

        <div className="flex justify-between items-end border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-3xl font-orbitron font-bold text-slate-900">Command Center</h2>
            <p className="text-muted-foreground font-rajdhani text-lg">{planetName} • {coordinates}</p>
            <p className="text-sm text-slate-600 mt-1" data-testid="text-commander-name">Commander: {displayUsername}</p>
          </div>
          <div className="text-right">
             <div className="text-sm text-primary font-mono">SERVER TIME</div>
             <div className="text-xl font-mono text-slate-900">{new Date().toLocaleTimeString()}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200 shadow-sm" data-testid="card-empire-score">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">Empire Score</div>
                  <div className="text-2xl font-orbitron font-bold text-slate-900">
                    {((totalFleetPower / 10) + (totalResearchLevels * 100) + (Object.values(buildings).reduce((s, v) => s + v, 0) * 50)).toLocaleString()}
                  </div>
                </div>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                  <img src={TECH_BRANCH_ASSETS.SENSORS.path} alt="score" className="w-8 h-8 object-contain" onError={(e) => { (e.target as HTMLImageElement).src = TEMP_THEME_IMAGE; }} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-sm" data-testid="card-fleet-power">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-blue-600 uppercase tracking-wider">Fleet Power</div>
                  <div className="text-2xl font-orbitron font-bold text-blue-900">{totalFleetPower.toLocaleString()}</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center overflow-hidden">
                  <img src={SHIP_ASSETS.FIGHTERS.FIGHTER.path} alt="fleet" className="w-8 h-8 object-contain" onError={(e) => { (e.target as HTMLImageElement).src = TEMP_THEME_IMAGE; }} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-sm" data-testid="card-research-level">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-green-600 uppercase tracking-wider">Research Level</div>
                  <div className="text-2xl font-orbitron font-bold text-green-900">{totalResearchLevels}</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center overflow-hidden">
                  <img src={TECH_BRANCH_ASSETS.COMPUTING.path} alt="research" className="w-8 h-8 object-contain" onError={(e) => { (e.target as HTMLImageElement).src = TEMP_THEME_IMAGE; }} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-sm" data-testid="card-active-missions">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-purple-600 uppercase tracking-wider">Active Missions</div>
                  <div className="text-2xl font-orbitron font-bold text-purple-900">{activeMissions.length}</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center overflow-hidden">
                  <img src={TECH_BRANCH_ASSETS.PROPULSION.path} alt="missions" className="w-8 h-8 object-contain" onError={(e) => { (e.target as HTMLImageElement).src = TEMP_THEME_IMAGE; }} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Card className="bg-white border-slate-200 shadow-sm" data-testid="card-quick-actions">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-500" /> Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/resources">
                <Button variant="outline" className="w-full justify-start h-10 text-slate-700 hover:bg-slate-50" data-testid="button-goto-resources">
                  <Pickaxe className="w-4 h-4 mr-2 text-slate-500" /> Manage Resources
                </Button>
              </Link>
              <Link href="/shipyard">
                <Button variant="outline" className="w-full justify-start h-10 text-slate-700 hover:bg-slate-50" data-testid="button-goto-shipyard">
                  <Rocket className="w-4 h-4 mr-2 text-blue-500" /> Build Ships
                </Button>
              </Link>
              <Link href="/research">
                <Button variant="outline" className="w-full justify-start h-10 text-slate-700 hover:bg-slate-50" data-testid="button-goto-research">
                  <FlaskConical className="w-4 h-4 mr-2 text-green-500" /> Research Tech
                </Button>
              </Link>
              <Link href="/fleet">
                <Button variant="outline" className="w-full justify-start h-10 text-slate-700 hover:bg-slate-50" data-testid="button-goto-fleet">
                  <Send className="w-4 h-4 mr-2 text-red-500" /> Dispatch Fleet
                </Button>
              </Link>
              <Link href="/messages">
                <Button variant="outline" className="w-full justify-start h-10 text-slate-700 hover:bg-slate-50 relative" data-testid="button-goto-messages">
                  <MessageSquare className="w-4 h-4 mr-2 text-purple-500" /> Messages
                  {unreadMessages > 0 && (
                    <Badge className="ml-auto bg-red-500 text-white text-[10px] h-5">{unreadMessages}</Badge>
                  )}
                </Button>
              </Link>
              <Link href="/story-mode">
                <Button variant="outline" className="w-full justify-start h-10 text-slate-700 hover:bg-slate-50" data-testid="button-goto-story-mode">
                  <Target className="w-4 h-4 mr-2 text-indigo-500" /> Story Mode
                </Button>
              </Link>
              <Link href="/season-pass">
                <Button variant="outline" className="w-full justify-start h-10 text-slate-700 hover:bg-slate-50" data-testid="button-goto-season-pass">
                  <Trophy className="w-4 h-4 mr-2 text-amber-500" /> Season Pass
                </Button>
              </Link>
              <Link href="/battle-pass">
                <Button variant="outline" className="w-full justify-start h-10 text-slate-700 hover:bg-slate-50" data-testid="button-goto-battle-pass">
                  <Swords className="w-4 h-4 mr-2 text-red-500" /> Battle Pass
                </Button>
              </Link>
              <Link href="/civilization-systems">
                <Button variant="outline" className="w-full justify-start h-10 text-slate-700 hover:bg-slate-50" data-testid="button-goto-civilization-systems">
                  <Users className="w-4 h-4 mr-2 text-cyan-600" /> Civilization Systems
                </Button>
              </Link>
              <Link href="/storefront">
                <Button variant="outline" className="w-full justify-start h-10 text-slate-700 hover:bg-slate-50" data-testid="button-goto-storefront">
                  <Gem className="w-4 h-4 mr-2 text-blue-500" /> Storefront
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2 bg-white border-slate-200 overflow-hidden relative shadow-sm" data-testid="card-planet-status">
            <img
              src={getPlanetImagePath(planetInfo.class)}
              alt={planetInfo.type}
              className="absolute inset-0 w-full h-full object-cover opacity-10 pointer-events-none"
              onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = TEMP_THEME_IMAGE; }}
            />
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-slate-900">
                 <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-primary" />
                    Planet Status
                 </div>
                 <Badge variant="outline" className="border-primary text-primary font-orbitron tracking-widest">
                    CLASS {planetInfo.class}
                 </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                     <div className="bg-slate-50 p-4 rounded border border-slate-200">
                        <div className="text-xs uppercase text-muted-foreground font-bold mb-2 tracking-widest flex items-center gap-2">
                           <Info className="w-3 h-3" /> Classification
                        </div>
                        <div className="text-xl font-orbitron text-slate-900 mb-1">{planetInfo.type}</div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                           {planetInfo.description}
                        </p>
                     </div>
                     <div className="grid grid-cols-2 gap-3">
                        <div className="bg-slate-50 p-3 rounded border border-slate-200">
                           <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                              <Thermometer className="w-3 h-3" /> Temperature
                           </div>
                           <div className="font-mono text-slate-900">{planetInfo.temperature}°C</div>
                        </div>
                        <div className="bg-slate-50 p-3 rounded border border-slate-200">
                           <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                              <Globe className="w-3 h-3" /> Gravity
                           </div>
                           <div className="font-mono text-slate-900">{(0.8 + (planetSeed % 10) * 0.05).toFixed(2)}g</div>
                        </div>
                     </div>
                  </div>
                  <div className="space-y-4">
                     <div className="bg-slate-50 p-4 rounded border border-slate-200">
                        <div className="flex items-center justify-between mb-2">
                           <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase font-bold">
                              <Ruler className="w-3 h-3" /> Diameter
                           </div>
                           <span className="text-xs text-slate-500">189/193 fields</span>
                        </div>
                        <div className="text-xl font-orbitron text-slate-900">12,800 km</div>
                        <Progress value={98} className="h-1 mt-2 bg-slate-200" />
                     </div>
                     <div className="bg-slate-50 p-4 rounded border border-slate-200">
                        <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase font-bold mb-2">
                           <Star className="w-3 h-3" /> Resource Richness
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                           <div className="text-center">
                              <div className="font-bold text-slate-600">Metal</div>
                              <div className="text-slate-900">{['Low', 'Normal', 'High', 'Rich'][planetSeed % 4]}</div>
                           </div>
                           <div className="text-center">
                              <div className="font-bold text-blue-600">Crystal</div>
                              <div className="text-slate-900">{['Low', 'Normal', 'High', 'Rich'][(planetSeed + 1) % 4]}</div>
                           </div>
                           <div className="text-center">
                              <div className="font-bold text-green-600">Deuterium</div>
                              <div className="text-slate-900">{['Low', 'Normal', 'High', 'Rich'][(planetSeed + 2) % 4]}</div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-sm" data-testid="card-production-rates">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-500" /> Production /hour
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-2 bg-slate-50 rounded border border-slate-100">
                <span className="flex items-center gap-2 text-sm text-slate-600">
                  <Box className="w-4 h-4" /> Metal
                </span>
                <span className="font-mono font-bold text-slate-900">+{metalProduction.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-blue-50 rounded border border-blue-100">
                <span className="flex items-center gap-2 text-sm text-blue-600">
                  <Gem className="w-4 h-4" /> Crystal
                </span>
                <span className="font-mono font-bold text-blue-900">+{crystalProduction.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-green-50 rounded border border-green-100">
                <span className="flex items-center gap-2 text-sm text-green-600">
                  <Database className="w-4 h-4" /> Deuterium
                </span>
                <span className="font-mono font-bold text-green-900">+{deuteriumProduction.toLocaleString()}</span>
              </div>
              <div className={cn("flex items-center justify-between p-2 rounded border", energyProduction >= 0 ? "bg-yellow-50 border-yellow-100" : "bg-red-50 border-red-100")}>
                <span className={cn("flex items-center gap-2 text-sm", energyProduction >= 0 ? "text-yellow-600" : "text-red-600")}>
                  <Zap className="w-4 h-4" /> Energy
                </span>
                <span className={cn("font-mono font-bold", energyProduction >= 0 ? "text-yellow-900" : "text-red-900")}>
                  {energyProduction >= 0 ? "+" : ""}{energyProduction.toLocaleString()}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="bg-white border-slate-200 shadow-sm" data-testid="card-operational-readiness">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" /> Operational Readiness
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="flex items-center justify-between text-xs mb-1"><span>Economy</span><span className="font-mono">{economyReadiness}%</span></div>
                <Progress value={economyReadiness} className="h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between text-xs mb-1"><span>Defense</span><span className="font-mono">{defenseReadiness}%</span></div>
                <Progress value={defenseReadiness} className="h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between text-xs mb-1"><span>Research</span><span className="font-mono">{researchReadiness}%</span></div>
                <Progress value={researchReadiness} className="h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between text-xs mb-1"><span>Logistics</span><span className="font-mono">{logisticsReadiness}%</span></div>
                <Progress value={logisticsReadiness} className="h-2" />
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 bg-slate-50 rounded border border-slate-100">
                  <div className="text-slate-500">Missions</div>
                  <div className="font-bold text-slate-900">{activeMissions.length}</div>
                </div>
                <div className="p-2 bg-slate-50 rounded border border-slate-100">
                  <div className="text-slate-500">Queue Items</div>
                  <div className="font-bold text-slate-900">{queue.length}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-sm" data-testid="card-game-logic-snapshot">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-500" /> Game Logic Snapshot
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="p-2 bg-slate-50 rounded border border-slate-100">
                <div className="font-semibold text-slate-800">Empire Score Formula</div>
                <div className="text-slate-600">Fleet ÷ 10 + Research × 100 + Building Levels × 50</div>
              </div>
              <div className="p-2 bg-slate-50 rounded border border-slate-100">
                <div className="font-semibold text-slate-800">Production Drivers</div>
                <div className="text-slate-600">Mines scale with building level multipliers; energy deficit reduces effective output.</div>
              </div>
              <div className="p-2 bg-slate-50 rounded border border-slate-100">
                <div className="font-semibold text-slate-800">Mission Flow</div>
                <div className="text-slate-600">Outbound: {missionBreakdown.outbound} · Returning: {missionBreakdown.return} · Combat: {missionBreakdown.combat}</div>
              </div>
              <div className="p-2 bg-slate-50 rounded border border-slate-100">
                <div className="font-semibold text-slate-800">Queue Forecast</div>
                <div className="text-slate-600">Next completion in {queue.length ? `${nextQueueCompletionSeconds}s` : "—"}.</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-sm" data-testid="card-priority-actions">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Bell className="w-4 h-4 text-orange-500" /> Priority Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {alerts.slice(0, 3).map((alert, index) => (
                <div key={`${alert.title}-${index}`} className={cn(
                  "rounded border p-2 text-xs",
                  alert.level === "danger" && "bg-red-50 border-red-200 text-red-700",
                  alert.level === "warning" && "bg-amber-50 border-amber-200 text-amber-700",
                  alert.level === "info" && "bg-blue-50 border-blue-200 text-blue-700"
                )}>
                  <div className="font-semibold">{alert.title}</div>
                  <div>{alert.detail}</div>
                </div>
              ))}

              <Separator />

              {recommendations.map((recommendation) => (
                <Link key={recommendation.label} href={recommendation.href}>
                  <Button variant="outline" className="w-full justify-between text-xs h-9">
                    <span>{recommendation.label}</span>
                    <span className="text-muted-foreground">→</span>
                  </Button>
                </Link>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-sm" data-testid="card-civilization-life-support">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-600" /> Civilization Life Support
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 bg-slate-50 rounded border border-slate-100">
                  <div className="text-slate-500">Frame Tier</div>
                  <div className="font-semibold text-slate-900">
                    T{populationSnapshot?.snapshot.frameTier || 1} {populationSnapshot?.snapshot.frame?.name || "Baseline Frame"}
                  </div>
                </div>
                <div className="p-2 bg-slate-50 rounded border border-slate-100">
                  <div className="text-slate-500">Population</div>
                  <div className="font-semibold text-slate-900">
                    {(populationSnapshot?.snapshot.population.current || 0).toLocaleString()} / {(populationSnapshot?.snapshot.population.capacity || 0).toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span>Food Pressure</span>
                  <Badge variant="outline" className={pressureBadgeClass(populationSnapshot?.snapshot.food.pressure || "stable")}>
                    {(populationSnapshot?.snapshot.food.pressure || "stable").toUpperCase()}
                  </Badge>
                </div>
                <div className="text-[11px] text-slate-500">
                  Net {Number(populationSnapshot?.snapshot.food.netPerHour || 0).toFixed(2)} /h
                  {populationSnapshot?.snapshot.food.hoursToDepletion !== null && populationSnapshot?.snapshot.food.hoursToDepletion !== undefined
                    ? ` • Depletion in ${populationSnapshot.snapshot.food.hoursToDepletion}h`
                    : " • No depletion projected"}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span>Water Pressure</span>
                  <Badge variant="outline" className={pressureBadgeClass(populationSnapshot?.snapshot.water.pressure || "stable")}>
                    {(populationSnapshot?.snapshot.water.pressure || "stable").toUpperCase()}
                  </Badge>
                </div>
                <div className="text-[11px] text-slate-500">
                  Net {Number(populationSnapshot?.snapshot.water.netPerHour || 0).toFixed(2)} /h
                  {populationSnapshot?.snapshot.water.hoursToDepletion !== null && populationSnapshot?.snapshot.water.hoursToDepletion !== undefined
                    ? ` • Depletion in ${populationSnapshot.snapshot.water.hoursToDepletion}h`
                    : " • No depletion projected"}
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 bg-cyan-50 rounded border border-cyan-100">
                  <div className="text-cyan-700">Projected Growth</div>
                  <div className="font-semibold text-cyan-900">+{(populationSnapshot?.snapshot.population.estimatedGrowthPerHour || 0).toLocaleString()}/h</div>
                </div>
                <div className="p-2 bg-indigo-50 rounded border border-indigo-100">
                  <div className="text-indigo-700">Workforce Output</div>
                  <div className="font-semibold text-indigo-900">{(populationSnapshot?.snapshot.civilizationSystems.projectedProductivity || 0).toLocaleString()}</div>
                </div>
              </div>

              <Link href="/civilization-systems">
                <Button variant="outline" size="sm" className="w-full">Open Civilization Systems</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-sm" data-testid="card-live-pass-progress">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500" /> Pass Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">Season Pass</span>
                  <span className="font-mono">Tier {seasonProgress?.state.currentTier || 1}</span>
                </div>
                <Progress value={Math.min(100, (seasonProgress?.state.completionRatio || 0) * 100)} className="h-2" />
                <div className="text-[11px] text-slate-500">
                  XP {(seasonProgress?.state.xpIntoTier || 0).toLocaleString()} / {(seasonProgress?.state.xpForNextTier || 1).toLocaleString()}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">Battle Pass</span>
                  <span className="font-mono">Tier {battlePassOverview?.state.currentTier || 1}</span>
                </div>
                <Progress value={Math.min(100, (battlePassOverview?.state.completionRatio || 0) * 100)} className="h-2" />
                <div className="text-[11px] text-slate-500">
                  XP {(battlePassOverview?.state.xpIntoTier || 0).toLocaleString()} / {(battlePassOverview?.state.xpForNextTier || 1).toLocaleString()}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className={battlePassOverview?.state.premiumUnlocked ? "text-amber-700 border-amber-300" : "text-slate-500"}>
                  Premium {battlePassOverview?.state.premiumUnlocked ? "Unlocked" : "Locked"}
                </Badge>
                <Badge variant="outline" className={battlePassOverview?.state.eliteUnlocked ? "text-indigo-700 border-indigo-300" : "text-slate-500"}>
                  Elite {battlePassOverview?.state.eliteUnlocked ? "Unlocked" : "Locked"}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Link href="/season-pass">
                  <Button variant="outline" size="sm" className="w-full">Open Season</Button>
                </Link>
                <Link href="/battle-pass">
                  <Button variant="outline" size="sm" className="w-full">Open Battle</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-sm" data-testid="card-pass-shortcuts">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Target className="w-4 h-4 text-indigo-600" /> Pass Mission Shortcuts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-xs text-slate-600">
                Quick balance actions for pass progression and reward-flow testing.
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={seasonXpMutation.isPending}
                  onClick={() => seasonXpMutation.mutate(1200)}
                >
                  +1 Season Tier
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={seasonXpMutation.isPending}
                  onClick={() => seasonXpMutation.mutate(2400)}
                >
                  +2 Season Tiers
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={battleXpMutation.isPending}
                  onClick={() => battleXpMutation.mutate(900)}
                >
                  +1 Battle Tier
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={battleXpMutation.isPending}
                  onClick={() => battleXpMutation.mutate(1800)}
                >
                  +2 Battle Tiers
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Link href="/season-pass">
                  <Button variant="ghost" size="sm" className="w-full">Season Rewards →</Button>
                </Link>
                <Link href="/battle-pass">
                  <Button variant="ghost" size="sm" className="w-full">Battle Rewards →</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-sm" data-testid="card-construction-queue">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Factory className="w-4 h-4 text-orange-500" /> Construction Queue
              </CardTitle>
            </CardHeader>
            <CardContent>
              {buildQueue.length === 0 && researchQueue.length === 0 && unitQueue.length === 0 ? (
                <div className="text-center py-6 text-slate-400">
                  <Clock className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No active construction</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {buildQueue.map((item, i) => {
                    const timeLeft = Math.max(0, Math.floor((item.endTime - Date.now()) / 1000));
                    return (
                      <div key={`b-${i}`} className="bg-orange-50 p-3 rounded border border-orange-100">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium text-slate-900">{item.name}</span>
                          <span className="font-mono text-orange-600">{timeLeft}s</span>
                        </div>
                        <Progress value={Math.max(0, 100 - (timeLeft / 10) * 100)} className="h-1" />
                      </div>
                    );
                  })}
                  {researchQueue.map((item, i) => {
                    const timeLeft = Math.max(0, Math.floor((item.endTime - Date.now()) / 1000));
                    return (
                      <div key={`r-${i}`} className="bg-blue-50 p-3 rounded border border-blue-100">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium text-slate-900">{item.name}</span>
                          <span className="font-mono text-blue-600">{timeLeft}s</span>
                        </div>
                        <Progress value={Math.max(0, 100 - (timeLeft / 5) * 100)} className="h-1" />
                      </div>
                    );
                  })}
                  {unitQueue.map((item, i) => {
                    const timeLeft = Math.max(0, Math.floor((item.endTime - Date.now()) / 1000));
                    return (
                      <div key={`u-${i}`} className="bg-purple-50 p-3 rounded border border-purple-100">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium text-slate-900">{item.amount}x {item.name}</span>
                          <span className="font-mono text-purple-600">{timeLeft}s</span>
                        </div>
                        <Progress value={Math.max(0, 100 - (timeLeft / 2) * 100)} className="h-1" />
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-sm" data-testid="card-fleet-summary">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Rocket className="w-4 h-4 text-blue-500" /> Fleet Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              {Object.values(units).every(v => v === 0) ? (
                <div className="text-center py-6 text-slate-400">
                  <Rocket className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No ships in hangar</p>
                  <Link href="/shipyard">
                    <Button variant="link" size="sm" className="mt-2">Build ships →</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {Object.entries(units).filter(([_, count]) => count > 0).slice(0, 5).map(([id, count]) => (
                    <div key={id} className="flex items-center justify-between p-2 bg-slate-50 rounded border border-slate-100">
                      <span className="text-sm text-slate-700 capitalize">{id.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <span className="font-mono font-bold text-slate-900">{count}</span>
                    </div>
                  ))}
                  {Object.entries(units).filter(([_, count]) => count > 0).length > 5 && (
                    <Link href="/fleet">
                      <Button variant="ghost" size="sm" className="w-full text-primary">View all units →</Button>
                    </Link>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-sm flex flex-col" data-testid="card-events">
             <CardHeader className="pb-2">
               <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                 <Bell className="w-4 h-4 text-blue-600" />
                 Notifications
               </CardTitle>
             </CardHeader>
             <CardContent className="flex-1 p-0">
                <ScrollArea className="h-[250px] px-6">
                   <div className="space-y-3 pb-4">
                      {events.length === 0 ? (
                        <div className="text-center py-6 text-slate-400">
                          <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
                          <p className="text-sm">No recent events</p>
                        </div>
                      ) : (
                        events.map(event => (
                           <div key={event.id} className="flex gap-3 items-start animate-in fade-in slide-in-from-right-4 p-2 bg-slate-50 rounded border border-slate-100">
                              <div className="mt-0.5">
                                 {event.type === "success" && <CheckCircle className="w-4 h-4 text-green-500" />}
                                 {event.type === "warning" && <AlertTriangle className="w-4 h-4 text-yellow-500" />}
                                 {event.type === "danger" && <AlertCircle className="w-4 h-4 text-red-500" />}
                                 {event.type === "info" && <Info className="w-4 h-4 text-blue-500" />}
                              </div>
                              <div className="flex-1 min-w-0">
                                 <div className="text-sm font-bold text-slate-900 truncate">{event.title}</div>
                                 <div className="text-xs text-slate-500 truncate">{event.description}</div>
                                 <div className="text-[10px] text-slate-400 mt-1">{new Date(event.timestamp).toLocaleTimeString()}</div>
                              </div>
                           </div>
                        ))
                      )}
                   </div>
                </ScrollArea>
             </CardContent>
          </Card>
        </div>

        {alliance && (
          <Card className="bg-white border-slate-200 shadow-sm" data-testid="card-alliance-info">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                    <img src={TECH_BRANCH_ASSETS.SHIELDS.path} alt="alliance" className="w-8 h-8 object-contain" onError={(e) => { (e.target as HTMLImageElement).src = TEMP_THEME_IMAGE; }} />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Alliance</div>
                    <div className="font-orbitron font-bold text-slate-900">[{alliance.tag}] {alliance.name}</div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground">Members</div>
                    <div className="font-mono font-bold text-slate-900">{alliance.members?.length || 0}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground">Total Points</div>
                    <div className="font-mono font-bold text-slate-900">
                      {(alliance.members?.reduce((acc: number, m: any) => acc + m.points, 0) || 0).toLocaleString()}
                    </div>
                  </div>
                  <Link href="/alliance">
                    <Button variant="outline" size="sm">View Alliance</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {activeMissions.length > 0 && (
          <Card className="bg-white border-slate-200 shadow-sm" data-testid="card-active-fleet-missions">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Send className="w-4 h-4 text-red-500" /> Active Fleet Missions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeMissions.slice(0, 6).map(mission => {
                  const now = Date.now();
                  const isReturn = mission.status === "return" || (now > mission.arrivalTime);
                  const endTime = isReturn ? mission.returnTime : mission.arrivalTime;
                  const timeLeft = Math.max(0, endTime - now);
                  
                  return (
                    <div key={mission.id} className={cn("p-3 rounded border", isReturn ? "bg-blue-50 border-blue-200" : "bg-red-50 border-red-200")}>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className={isReturn ? "border-blue-300 text-blue-700" : "border-red-300 text-red-700"}>
                          {mission.type}
                        </Badge>
                        <span className="font-mono text-sm font-bold">{Math.ceil(timeLeft / 1000)}s</span>
                      </div>
                      <div className="text-xs text-slate-600">
                        <span className="font-bold">{isReturn ? "Returning from" : "Target"}:</span> [{mission.target}]
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </GameLayout>
  );
}
