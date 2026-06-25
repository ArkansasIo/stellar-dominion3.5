import GameLayout from "@/components/layout/GameLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Globe,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  ShieldAlert,
  Hexagon,
  Triangle,
  CircleDot,
  Orbit,
  Search,
  Rocket,
  Moon,
  Thermometer,
  Droplets,
  Wind,
  Mountain,
  Star,
  Factory,
  X,
  Eye,
  Zap,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

type SystemObjectType = "planet" | "asteroid" | "nebula" | "blackhole" | "station" | "empty";

interface NPCPresence {
  raceId: string;
  raceName: string;
  faction: string;
  fleetPower: number;
  diplomaticStance: string;
  isHostile: boolean;
}

interface MoonDetail {
  name: string;
  type: string;
  size: string;
  diameter: number;
  gravity: number;
  habitable: boolean;
  atmosphere: string;
  temperature: number;
  resources: string[];
  specialFeatures: string[];
}

interface SystemPosition {
  position: number;
  type: SystemObjectType;
  name: string;
  owner?: string;
  alliance?: string;
  debris?: { metal: number; crystal: number };
  moon?: boolean;
  moonDetails?: MoonDetail;
  class?: string;
  subclass?: string;
  category?: string;
  subcategory?: string;
  planetType?: string;
  temperature?: number;
  resources?: string[];
  habitable?: boolean;
  gravity?: number;
  atmosphere?: string;
  activity?: number;
  stations?: { name: string; level: number; type: string }[];
  diameter?: number;
  mass?: number;
  waterPercent?: number;
  specialFeatures?: string[];
  planetId?: string;
  npcs?: NPCPresence[];
}

interface GalaxyClassification {
  morphology: string;
  class: string;
  subclass: string;
  category: string;
  subcategory: string;
  designation: string;
}

interface SystemInfo {
  totalPlanets: number;
  habitablePlanets: number;
  asteroidBelts: number;
  specialObjects: number;
}

interface SystemData {
  universe: string;
  galaxy: number;
  sector: number;
  system: number;
  systemName?: string;
  star?: { type: string; name: string };
  positions: SystemPosition[];
  galaxyClassification?: GalaxyClassification;
  npcPresence?: NPCPresence[];
  pirateActivity?: { id: string; name: string; aggression: number; controlledSectors: string[] }[];
  systemInfo?: SystemInfo;
}

interface SystemData {
  universe: string;
  galaxy: number;
  sector: number;
  system: number;
  systemName?: string;
  star?: { type: string; name: string };
  positions: SystemPosition[];
}

interface ScanResponse {
  success: boolean;
  message: string;
  report: {
    targetName: string;
    targetType: SystemObjectType;
    threatLevel: "low" | "medium" | "high";
    anomalies: string[];
    estimatedResources: { metal: number; crystal: number; deuterium: number };
    timestamp: number;
  };
}

interface FleetActionPayload {
  targetName: string;
  destination: string;
  missionType: "attack" | "espionage";
  ships: Record<string, number>;
}

interface MessageActionPayload {
  targetName: string;
  recipientName: string;
  destination: string;
}

const PLANET_GRADIENT: Record<string, string> = {
  M: "from-blue-400 to-emerald-600",
  H: "from-yellow-500 to-orange-700",
  L: "from-lime-500 to-emerald-700",
  K: "from-red-700 to-stone-500",
  Y: "from-red-500 to-orange-900",
  D: "from-slate-400 to-stone-600",
  J: "from-amber-400 to-orange-700",
  T: "from-sky-300 to-indigo-600",
};

const getPlanetGradient = (cls?: string) =>
  cls && PLANET_GRADIENT[cls] ? PLANET_GRADIENT[cls] : "from-blue-500 to-purple-800";

const PLANET_CLASS_BADGE: Record<string, string> = {
  M: "bg-green-100 text-green-700",
  H: "bg-yellow-100 text-yellow-700",
  L: "bg-lime-100 text-lime-700",
  K: "bg-stone-100 text-stone-600",
  Y: "bg-red-100 text-red-700",
  D: "bg-slate-100 text-slate-600",
  J: "bg-orange-100 text-orange-700",
  T: "bg-sky-100 text-sky-700",
};

const PLANET_TYPE_LABEL: Record<string, string> = {
  rocky: "Rocky",
  gas_giant: "Gas Giant",
  ice_giant: "Ice Giant",
  desert: "Desert",
  ocean: "Ocean",
  volcanic: "Volcanic",
  frozen: "Frozen",
  terran: "Terran",
  barren: "Barren",
  toxic: "Toxic",
};

const PLANET_TYPE_ICON: Record<string, string> = {
  rocky: "🪨",
  gas_giant: "🪐",
  ice_giant: "🧊",
  desert: "🏜️",
  ocean: "🌊",
  volcanic: "🌋",
  frozen: "❄️",
  terran: "🌍",
  barren: "🌑",
  toxic: "☠️",
};

const MOON_TYPE_LABEL: Record<string, string> = {
  rocky: "Rocky",
  icy: "Icy",
  volcanic: "Volcanic",
  "ice-rock": "Ice-Rock",
  "gas-moon": "Gas Moon",
  metallic: "Metallic",
  captured: "Captured",
};

const STAR_INFO: Record<string, { label: string; color: string; glow: string }> = {
  O: { label: "Blue Giant", color: "#9bb0ff", glow: "shadow-[0_0_16px_#9bb0ff]" },
  B: { label: "Blue-White", color: "#aabfff", glow: "shadow-[0_0_14px_#aabfff]" },
  A: { label: "White Star", color: "#e0e8ff", glow: "shadow-[0_0_12px_#cad7ff]" },
  F: { label: "Yellow-White", color: "#fff8dc", glow: "shadow-[0_0_12px_#f8f7ff]" },
  G: { label: "Yellow Dwarf", color: "#fff4ea", glow: "shadow-[0_0_12px_#ffe4a0]" },
  K: { label: "Orange Dwarf", color: "#ffd2a1", glow: "shadow-[0_0_12px_#ffa060]" },
  M: { label: "Red Dwarf", color: "#ffcc6f", glow: "shadow-[0_0_12px_#ff6040]" },
};

const RESOURCE_COLORS: Record<string, string> = {
  metal: "text-slate-400",
  crystal: "text-blue-400",
  deuterium: "text-cyan-400",
  water: "text-blue-300",
  food: "text-green-400",
  energy: "text-amber-400",
  helium: "text-purple-300",
  exotic: "text-pink-400",
};

export default function Galaxy() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const searchParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const parsePositiveInt = (value: string | null, fallback: number) => {
    const parsed = Number.parseInt(value ?? "", 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
  };

  const syncGalaxyStateFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    setUniverse(params.get("universe") || "uni1");
    setGalaxy(parsePositiveInt(params.get("galaxy"), 1));
    setSector(parsePositiveInt(params.get("sector"), 4));
    setSystem(parsePositiveInt(params.get("system"), 102));
  };

  const [universe, setUniverse] = useState(searchParams.get("universe") || "uni1");
  const [galaxy, setGalaxy] = useState(parsePositiveInt(searchParams.get("galaxy"), 1));
  const [sector, setSector] = useState(parsePositiveInt(searchParams.get("sector"), 4));
  const [system, setSystem] = useState(parsePositiveInt(searchParams.get("system"), 102));
  const [selectedPlanet, setSelectedPlanet] = useState<SystemPosition | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  useEffect(() => {
    const handlePopState = () => syncGalaxyStateFromUrl();
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set("universe", universe);
    params.set("galaxy", String(galaxy));
    params.set("sector", String(sector));
    params.set("system", String(system));

    const nextUrl = `/galaxy?${params.toString()}`;
    const currentUrl = `${window.location.pathname}${window.location.search}`;

    if (currentUrl !== nextUrl) {
      window.history.replaceState(null, "", nextUrl);
    }
  }, [universe, galaxy, sector, system]);

  const { data: systemData, isFetching } = useQuery<SystemData>({
    queryKey: ["galaxy", universe, galaxy, sector, system],
    queryFn: async () => {
      const res = await fetch(`/api/galaxy/${universe}/${galaxy}/${sector}/${system}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load system data");
      return res.json();
    },
    staleTime: 30_000,
  });

  const deepScanMutation = useMutation({
    mutationFn: async (target: { position: number; name: string; type: SystemObjectType }) => {
      const response = await fetch(`/api/galaxy/${universe}/${galaxy}/${sector}/${system}/scan`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ position: target.position, targetName: target.name, targetType: target.type }),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok) throw new Error(payload?.error || payload?.message || "Deep scan failed");
      return payload as ScanResponse;
    },
    onSuccess: (result) => {
      const report = result.report;
      toast({
        title: `Scan Complete · ${report.targetName}`,
        description: `${report.threatLevel.toUpperCase()} threat | M ${report.estimatedResources.metal.toLocaleString()} · C ${report.estimatedResources.crystal.toLocaleString()} · D ${report.estimatedResources.deuterium.toLocaleString()} | ${report.anomalies.join(", ")}`,
      });
    },
    onError: (error: Error) => {
      toast({ title: "Deep scan failed", description: error.message, variant: "destructive" });
    },
  });

  const fleetActionMutation = useMutation({
    mutationFn: async (payload: FleetActionPayload) => {
      const response = await fetch("/api/game/send-fleet", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ destination: payload.destination, missionType: payload.missionType, ships: payload.ships }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.error || data?.message || "Fleet dispatch failed");
      return { ...data, payload };
    },
    onSuccess: (result) => {
      toast({ title: "Fleet dispatched", description: result?.message || `${result.payload.missionType} mission launched toward ${result.payload.targetName}.` });
      setLocation("/fleet?tab=active");
    },
    onError: (error: Error) => {
      toast({ title: "Fleet dispatch failed", description: error.message, variant: "destructive" });
    },
  });

  const messageActionMutation = useMutation({
    mutationFn: async (payload: MessageActionPayload) => {
      const response = await fetch("/api/messages", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: payload.recipientName,
          subject: `Transmission from ${universe} ${galaxy}:${sector}:${system}`,
          body: `Scouting transmission for ${payload.targetName} at coordinates ${payload.destination}.`,
          type: "player",
        }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.error || data?.message || "Message send failed");
      return { ...data, payload };
    },
    onSuccess: (result) => {
      toast({ title: "Message sent", description: `Transmission delivered to ${result.payload.recipientName}.` });
    },
    onError: (error: Error) => {
      toast({ title: "Message failed", description: error.message, variant: "destructive" });
    },
  });

  const openPlanetDetail = (pos: SystemPosition) => {
    setSelectedPlanet(pos);
    setDetailOpen(true);
  };

  const planetPositions = systemData?.positions?.filter(p => p.type === "planet") || [];
  const totalMoons = planetPositions.filter(p => p.moon).length;
  const habitableCount = planetPositions.filter(p => p.habitable).length;

  return (
    <GameLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="relative rounded-xl overflow-hidden shadow-lg mb-2" style={{ minHeight: 140 }}>
          <img src="/assets/backgrounds/galaxy_map.png" alt="Galaxy" className="absolute inset-0 w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display='none'; }} />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/70 to-transparent" />
          <div className="relative z-10 p-6 flex items-center gap-6">
            <img src="/assets/planets/gas_giant.png" alt="Planet" className="w-20 h-20 rounded-full object-cover ring-2 ring-cyan-400/50 shadow-lg" onError={(e) => { e.currentTarget.style.display='none'; }} />
            <div>
              <h2 className="text-3xl font-orbitron font-bold text-white drop-shadow">Galaxy View</h2>
              <p className="text-cyan-300 font-rajdhani text-lg">Explore star systems with up to 50 orbital positions. Click any planet for a detailed overview.</p>
            </div>
          </div>
        </div>

        {/* Navigation Bar */}
        <div className="bg-white border border-slate-200 p-4 rounded-lg flex flex-wrap justify-center items-center gap-4 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground uppercase text-xs font-bold">Universe</span>
            <Select value={universe} onValueChange={setUniverse}>
              <SelectTrigger className="w-[140px] bg-slate-50 border-slate-200 text-slate-900 h-8">
                <SelectValue placeholder="Select Universe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="uni1">Nexus-Alpha</SelectItem>
                <SelectItem value="uni2">Cyborg-Beta</SelectItem>
                <SelectItem value="uni3">Quantum-Gamma</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="h-8 w-px bg-slate-200 mx-2 hidden md:block" />

          <div className="flex items-center gap-2">
            <span className="text-muted-foreground uppercase text-xs font-bold">Galaxy</span>
            <div className="flex items-center">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setGalaxy(g => Math.max(1, g - 1))}><ChevronLeft className="w-4 h-4" /></Button>
              <Input className="w-14 h-8 text-center font-mono bg-slate-50 border-slate-200 text-slate-900" value={galaxy} onChange={(e) => setGalaxy(parseInt(e.target.value) || 1)} />
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setGalaxy(g => g + 1)}><ChevronRight className="w-4 h-4" /></Button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-muted-foreground uppercase text-xs font-bold text-primary">Sector</span>
            <div className="flex items-center">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSector(s => Math.max(1, s - 1))}><ChevronLeft className="w-4 h-4" /></Button>
              <Input className="w-14 h-8 text-center font-mono bg-slate-50 border-primary/30 text-primary font-bold" value={sector} onChange={(e) => setSector(parseInt(e.target.value) || 1)} />
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSector(s => s + 1)}><ChevronRight className="w-4 h-4" /></Button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-muted-foreground uppercase text-xs font-bold">System</span>
            <div className="flex items-center">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSystem(s => Math.max(1, s - 1))}><ChevronLeft className="w-4 h-4" /></Button>
              <Input className="w-16 h-8 text-center font-mono bg-slate-50 border-slate-200 text-slate-900" value={system} onChange={(e) => setSystem(parseInt(e.target.value) || 1)} />
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSystem(s => s + 1)}><ChevronRight className="w-4 h-4" /></Button>
            </div>
          </div>

          <div className="flex-1" />
        </div>

        {/* System Info / Star Display + System Summary */}
        {systemData?.star && (
          <div className="flex gap-4 flex-wrap">
            <div className="bg-white border border-slate-200 p-4 rounded-lg flex items-center gap-4 shadow-sm flex-[2] min-w-[300px]">
              <div
                className={cn("w-12 h-12 rounded-full flex-shrink-0", STAR_INFO[systemData.star.type]?.glow)}
                style={{ background: `radial-gradient(circle at 35% 35%, white, ${STAR_INFO[systemData.star.type]?.color ?? "#ffe4a0"})` }}
              />
              <div className="flex-1 min-w-0">
                <div className="font-bold text-slate-900 font-orbitron text-lg truncate">
                  {systemData.systemName ?? systemData.star.name} System
                </div>
                <div className="text-sm text-muted-foreground font-rajdhani">
                  [{systemData.galaxy}:{systemData.sector}:{systemData.system}]
                  {" · "}Star: <span className="font-semibold text-slate-700">{systemData.star.name}</span>
                  {" · "}Type <span className="font-semibold text-slate-700">{systemData.star.type}</span>
                  {" · "}
                  <span className="italic">{STAR_INFO[systemData.star.type]?.label ?? "Unknown"}</span>
                </div>
                {systemData.galaxyClassification && (
                  <div className="text-[11px] text-slate-500 mt-1">
                    <span className="font-semibold text-purple-600">{systemData.galaxyClassification.designation}</span>
                    {" · "}{systemData.galaxyClassification.morphology}
                    {" · "}Class {systemData.galaxyClassification.class}-{systemData.galaxyClassification.subclass}
                    {" · "}{systemData.galaxyClassification.category}/{systemData.galaxyClassification.subcategory}
                  </div>
                )}
                {systemData.npcPresence && systemData.npcPresence.length > 0 && (
                  <div className="text-[11px] text-slate-500 mt-1 flex flex-wrap gap-x-3">
                    {systemData.npcPresence.map((npc) => (
                      <span key={npc.raceId} className={cn("font-medium", npc.isHostile ? "text-red-500" : "text-green-600")}>
                        {npc.raceName} ({npc.faction}) · {npc.diplomaticStance}
                      </span>
                    ))}
                  </div>
                )}
                {systemData.pirateActivity && systemData.pirateActivity.length > 0 && (
                  <div className="text-[11px] text-red-500 mt-1">
                    <span className="font-semibold">Pirate Activity:</span> {systemData.pirateActivity.map(p => p.name).join(", ")}
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Card className="bg-white border-slate-200 shadow-sm min-w-[80px]">
                <CardContent className="p-3 text-center">
                  <div className="text-lg font-bold text-blue-600">{planetPositions.length}</div>
                  <div className="text-xs text-slate-500">Planets</div>
                </CardContent>
              </Card>
              <Card className="bg-white border-slate-200 shadow-sm min-w-[80px]">
                <CardContent className="p-3 text-center">
                  <div className="text-lg font-bold text-green-600">{habitableCount}</div>
                  <div className="text-xs text-slate-500">Habitable</div>
                </CardContent>
              </Card>
              <Card className="bg-white border-slate-200 shadow-sm min-w-[80px]">
                <CardContent className="p-3 text-center">
                  <div className="text-lg font-bold text-slate-600">{totalMoons}</div>
                  <div className="text-xs text-slate-500">Moons</div>
                </CardContent>
              </Card>
              {systemData.systemInfo && (
                <>
                  <Card className="bg-white border-slate-200 shadow-sm min-w-[80px]">
                    <CardContent className="p-3 text-center">
                      <div className="text-lg font-bold text-amber-600">{systemData.systemInfo.asteroidBelts}</div>
                      <div className="text-xs text-slate-500">Belts</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-white border-slate-200 shadow-sm min-w-[80px]">
                    <CardContent className="p-3 text-center">
                      <div className="text-lg font-bold text-purple-600">{systemData.systemInfo.specialObjects}</div>
                      <div className="text-xs text-slate-500">Anomalies</div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </div>
        )}

        {/* Main Content: Table + Detail Panel */}
        <div className="flex gap-4">
          {/* Galaxy Table - OGame Style 7 columns */}
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm flex-1">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-600 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-200">
                    <th className="text-center w-8 py-2 px-1">Pos</th>
                    <th className="text-left py-2 px-1">Planet</th>
                    <th className="text-left py-2 px-1">Moon</th>
                    <th className="text-left py-2 px-1">Debris</th>
                    <th className="text-left py-2 px-1">Player</th>
                    <th className="text-left py-2 px-1">Alliance</th>
                    <th className="text-right py-2 px-1">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isFetching && !systemData && (
                    <tr><td colSpan={7} className="text-center py-8 text-muted-foreground text-xs">Loading system data...</td></tr>
                  )}
                  {systemData?.positions?.map((data) => {
                    const isMe = false;
                    const showPlanetActions = data.type === "planet" || data.type === "station";
                    return (
                      <tr
                        key={data.position}
                        className={cn(
                          "border-b border-slate-100 transition-colors cursor-pointer",
                          selectedPlanet?.position === data.position ? "bg-blue-50" : "hover:bg-slate-50"
                        )}
                        onClick={() => data.type !== "empty" && openPlanetDetail(data)}
                      >
                        <td className="text-center text-slate-400 font-mono w-8 py-1.5 px-1">{data.position}</td>

                        <td className="py-1.5 px-1">
                          {data.type !== "empty" ? (
                            <div className="flex items-center gap-2">
                              <div className="flex-shrink-0 w-5 text-center">
                                {data.type === "planet" && (
                                  <div className={cn("w-5 h-5 rounded-full bg-gradient-to-br shadow-sm border border-slate-300 mx-auto", getPlanetGradient(data.class))} />
                                )}
                                {data.type === "asteroid" && <div className="w-4 h-4 rounded bg-slate-300 rotate-45 border border-slate-400 mx-auto" />}
                                {data.type === "blackhole" && <div className="w-4 h-4 rounded-full bg-black border border-slate-700 mx-auto" />}
                                {data.type === "nebula" && <div className="w-4 h-4 rounded-full bg-purple-200 blur-sm mx-auto" />}
                                {data.type === "station" && <Hexagon className="w-4 h-4 text-slate-600 fill-slate-200 mx-auto" />}
                              </div>
                              <div className="min-w-0">
                                <div className="text-slate-700 font-medium leading-tight truncate max-w-[130px]">{data.name}</div>
                                {data.planetId && (
                                  <div className="text-[9px] text-slate-400 font-mono leading-tight">{data.planetId}</div>
                                )}
                                {data.diameter && data.type === "planet" && (
                                  <div className="text-[9px] text-slate-400 leading-tight">{data.diameter.toLocaleString()} km</div>
                                )}
                              </div>
                            </div>
                          ) : (
                            <span className="text-slate-300 italic">-- Empty --</span>
                          )}
                        </td>

                        <td className="py-1.5 px-1">
                          {data.moon && data.moonDetails ? (
                            <div className="flex items-center gap-1.5">
                              <Moon className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                              <div className="min-w-0">
                                <div className="text-slate-600 font-medium truncate max-w-[100px] leading-tight">{data.moonDetails.name}</div>
                                {data.moonDetails.diameter && (
                                  <div className="text-[9px] text-slate-400 leading-tight">{data.moonDetails.diameter.toLocaleString()} km</div>
                                )}
                              </div>
                            </div>
                          ) : (
                            <span className="text-slate-300">--</span>
                          )}
                        </td>

                        <td className="py-1.5 px-1">
                          {data.debris ? (
                            <div className="flex items-center gap-1">
                              <Triangle className="w-3 h-3 fill-yellow-600 rotate-180 flex-shrink-0" />
                              <div className="leading-tight">
                                <span className="text-[9px] font-mono text-yellow-700">M: {data.debris.metal.toLocaleString()}</span>
                                <span className="text-[9px] font-mono text-blue-600 ml-1">C: {data.debris.crystal.toLocaleString()}</span>
                              </div>
                            </div>
                          ) : (
                            <span className="text-slate-300">--</span>
                          )}
                        </td>

                        <td className="py-1.5 px-1">
                          {data.owner ? (
                            <div className="flex items-center gap-1">
                              <div className={cn(
                                "w-2 h-2 rounded-full flex-shrink-0",
                                data.activity && data.activity > 0 ? "bg-green-400" : "bg-yellow-400"
                              )} />
                              <span className={cn(
                                "text-xs leading-tight truncate max-w-[100px]",
                                isMe ? "text-green-600" : data.type === "station" ? "text-red-600" : "text-slate-700"
                              )}>
                                {data.owner}
                              </span>
                            </div>
                          ) : data.type === "planet" ? (
                            <span className="text-emerald-600 font-medium text-[10px]">Uncolonized</span>
                          ) : (
                            <span className="text-slate-300">--</span>
                          )}
                        </td>

                        <td className="py-1.5 px-1">
                          {data.alliance ? (
                            <span className="text-blue-600 font-bold text-xs">[{data.alliance}]</span>
                          ) : (
                            <span className="text-slate-300">--</span>
                          )}
                        </td>

                        <td className="text-right py-1.5 px-1 whitespace-nowrap">
                          {data.type !== "empty" && (
                            <div className="flex justify-end gap-0.5" onClick={(e) => e.stopPropagation()}>
                              <button className="p-1 rounded hover:bg-blue-50 text-slate-400 hover:text-blue-600" title="Scan"
                                onClick={() => deepScanMutation.mutate({ position: data.position, name: data.name || `Position ${data.position}`, type: data.type })}
                                disabled={deepScanMutation.isPending}>
                                <Search className="w-3 h-3" />
                              </button>
                              <button className="p-1 rounded hover:bg-slate-100 text-slate-400" title="Details"
                                onClick={() => openPlanetDetail(data)}>
                                <Eye className="w-3 h-3" />
                              </button>
                              {showPlanetActions && (
                                <>
                                  <button className="p-1 rounded hover:bg-blue-50 text-slate-400 hover:text-blue-600" title="Message"
                                    onClick={() => messageActionMutation.mutate({ targetName: data.name || `Position ${data.position}`, recipientName: data.owner || "", destination: `${galaxy}:${system}:${data.position}` })}
                                    disabled={messageActionMutation.isPending || !data.owner}>
                                    <MessageSquare className="w-3 h-3" />
                                  </button>
                                  <button className="p-1 rounded hover:bg-red-50 text-slate-400 hover:text-red-600" title="Attack"
                                    onClick={() => fleetActionMutation.mutate({ targetName: data.name || `Position ${data.position}`, destination: `${galaxy}:${system}:${data.position}`, missionType: "attack", ships: { lightFighter: 10, cruiser: 2 } })}
                                    disabled={fleetActionMutation.isPending}>
                                    <ShieldAlert className="w-3 h-3" />
                                  </button>
                                </>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  {/* Expedition Slot - Position 16 */}
                  <tr className="border-b border-slate-200 bg-gradient-to-r from-slate-50/50 to-transparent hover:bg-blue-50/50 transition-colors cursor-pointer">
                    <td className="text-center text-slate-400 font-mono w-8 py-2 px-1">16</td>
                    <td className="py-2 px-1" colSpan={6}>
                      <div className="flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-indigo-400 to-purple-600 shadow-sm flex items-center justify-center">
                            <Rocket className="w-3 h-3 text-white" />
                          </div>
                          <div>
                            <div className="text-slate-600 font-medium text-xs">Expedition</div>
                            <div className="text-[9px] text-slate-400">Deep space exploration · Up to 16h</div>
                          </div>
                        </div>
                        <Button className="h-7 text-[10px] px-3 bg-indigo-500 hover:bg-indigo-600 text-white mr-1">
                          <Rocket className="w-3 h-3 mr-1" /> Send Expedition
                        </Button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Planet Overview Panel (OGame-style sidebar) */}
          {detailOpen && selectedPlanet && (
            <div className="w-[380px] flex-shrink-0">
              <Card className="bg-white border-slate-200 shadow-sm sticky top-24">
                <CardHeader className="pb-3 border-b border-slate-100">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-orbitron flex items-center gap-2">
                      {selectedPlanet.type === "planet" && (
                        <div className={cn("w-8 h-8 rounded-full bg-gradient-to-br shadow-sm border border-slate-200", getPlanetGradient(selectedPlanet.class))}></div>
                      )}
                      {selectedPlanet.type === "asteroid" && <div className="w-6 h-6 rounded bg-slate-300 rotate-45 border border-slate-400"></div>}
                      {selectedPlanet.type === "blackhole" && <div className="w-6 h-6 rounded-full bg-black border border-white/20"></div>}
                      {selectedPlanet.type === "nebula" && <div className="w-6 h-6 rounded-full bg-purple-200 blur-sm"></div>}
                      {selectedPlanet.type === "station" && <Hexagon className="w-6 h-6 text-slate-600 fill-slate-200" />}
                      {selectedPlanet.name || `Position ${selectedPlanet.position}`}
                    </CardTitle>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setDetailOpen(false)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {universe} · Galaxy {galaxy} · Sector {sector} · System {system} · Orbit {selectedPlanet.position}
                  </div>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  {/* Planet Type & Class */}
                  {selectedPlanet.type === "planet" && (
                    <>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-2 bg-slate-50 rounded border border-slate-200">
                          <div className="text-xs text-slate-500">Class</div>
                          <div className="font-bold text-sm">{selectedPlanet.class}</div>
                        </div>
                        <div className="p-2 bg-slate-50 rounded border border-slate-200">
                          <div className="text-xs text-slate-500">Type</div>
                          <div className="font-bold text-sm">{PLANET_TYPE_LABEL[selectedPlanet.planetType || ""] || selectedPlanet.planetType}</div>
                        </div>
                      </div>

                      {/* Planet ID */}
                      {selectedPlanet.planetId && (
                        <div className="p-2 bg-slate-50 rounded border border-slate-200">
                          <div className="text-xs text-slate-500">Planet ID</div>
                          <div className="font-mono text-xs font-bold text-slate-700">{selectedPlanet.planetId}</div>
                        </div>
                      )}

                      {/* Physical Properties */}
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider">Physical Properties</h4>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="flex items-center gap-1.5">
                            <Thermometer className="w-3.5 h-3.5 text-orange-400" />
                            <span className="text-slate-500">Temperature:</span>
                            <span className="font-medium">{selectedPlanet.temperature}K</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Mountain className="w-3.5 h-3.5 text-stone-400" />
                            <span className="text-slate-500">Gravity:</span>
                            <span className="font-medium">{selectedPlanet.gravity}g</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <CircleDot className="w-3.5 h-3.5 text-slate-400" />
                            <span className="text-slate-500">Diameter:</span>
                            <span className="font-medium">{selectedPlanet.diameter?.toLocaleString()} km</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Star className="w-3.5 h-3.5 text-amber-400" />
                            <span className="text-slate-500">Mass:</span>
                            <span className="font-medium">{selectedPlanet.mass} M⊕</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Droplets className="w-3.5 h-3.5 text-blue-400" />
                            <span className="text-slate-500">Water:</span>
                            <span className="font-medium">{selectedPlanet.waterPercent ?? 0}%</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Wind className="w-3.5 h-3.5 text-blue-400" />
                            <span className="text-slate-500">Atmosphere:</span>
                            <span className="font-medium truncate">{selectedPlanet.atmosphere}</span>
                          </div>
                        </div>
                        {selectedPlanet.habitable !== undefined && (
                          <div className={cn("text-xs font-medium px-2 py-1 rounded", selectedPlanet.habitable ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-600 border border-red-200")}>
                            {selectedPlanet.habitable ? "Habitable Zone" : "Non-Habitable"}
                          </div>
                        )}
                      </div>

                      {/* Special Features */}
                      {selectedPlanet.specialFeatures && selectedPlanet.specialFeatures.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider">Special Features</h4>
                          <div className="flex flex-wrap gap-1">
                            {selectedPlanet.specialFeatures.map((feat) => (
                              <Badge key={feat} variant="outline" className="text-[10px] bg-amber-50 text-amber-700 border-amber-200 capitalize">
                                {feat.replace(/_/g, ' ')}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Resources */}
                      {selectedPlanet.resources && selectedPlanet.resources.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider">Resources</h4>
                          <div className="flex flex-wrap gap-1.5">
                            {selectedPlanet.resources.map((res) => (
                              <Badge key={res} variant="outline" className={cn("text-xs", RESOURCE_COLORS[res] || "text-slate-500")}>
                                {res}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Moon */}
                      {selectedPlanet.moon && selectedPlanet.moonDetails && (
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                            <Moon className="w-3.5 h-3.5" /> Moon
                          </h4>
                          <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-2">
                            <div className="font-medium text-sm">{selectedPlanet.moonDetails.name}</div>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div>
                                <span className="text-slate-500">Type:</span>{" "}
                                <span className="font-medium">{MOON_TYPE_LABEL[selectedPlanet.moonDetails.type] || selectedPlanet.moonDetails.type}</span>
                              </div>
                              <div>
                                <span className="text-slate-500">Size:</span>{" "}
                                <span className="font-medium capitalize">{selectedPlanet.moonDetails.size}</span>
                              </div>
                              <div>
                                <span className="text-slate-500">Diameter:</span>{" "}
                                <span className="font-medium">{selectedPlanet.moonDetails.diameter?.toLocaleString()} km</span>
                              </div>
                              <div>
                                <span className="text-slate-500">Gravity:</span>{" "}
                                <span className="font-medium">{selectedPlanet.moonDetails.gravity}g</span>
                              </div>
                              <div className="col-span-2">
                                <span className="text-slate-500">Atmosphere:</span>{" "}
                                <span className="font-medium">{selectedPlanet.moonDetails.atmosphere}</span>
                              </div>
                              <div className="col-span-2">
                                <span className="text-slate-500">Temperature:</span>{" "}
                                <span className="font-medium">{selectedPlanet.moonDetails.temperature}K</span>
                              </div>
                              {selectedPlanet.moonDetails.resources && selectedPlanet.moonDetails.resources.length > 0 && (
                                <div className="col-span-2">
                                  <span className="text-slate-500">Resources:</span>{" "}
                                  <span className="font-medium">{selectedPlanet.moonDetails.resources.join(", ")}</span>
                                </div>
                              )}
                              {selectedPlanet.moonDetails.specialFeatures && selectedPlanet.moonDetails.specialFeatures.length > 0 && (
                                <div className="col-span-2">
                                  <span className="text-slate-500">Features:</span>{" "}
                                  <span className="font-medium">{selectedPlanet.moonDetails.specialFeatures.join(", ")}</span>
                                </div>
                              )}
                            </div>
                            {selectedPlanet.moonDetails.habitable && (
                              <div className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded border border-green-200">
                                Habitable Moon
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Orbital Stations */}
                      {selectedPlanet.stations && selectedPlanet.stations.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                            <Factory className="w-3.5 h-3.5" /> Orbital Stations
                          </h4>
                          {selectedPlanet.stations.map((station, idx) => (
                            <div key={idx} className="p-3 bg-slate-50 rounded border border-slate-200">
                              <div className="font-medium text-sm">{station.name}</div>
                              <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                                <span>Type: <span className="font-medium capitalize">{station.type}</span></span>
                                <span>Level: <span className="font-medium">{station.level}</span></span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Owner */}
                      {selectedPlanet.owner && (
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5" /> Colony
                          </h4>
                          <div className="p-3 bg-slate-50 rounded border border-slate-200">
                            <div className="font-medium text-sm">{selectedPlanet.owner}</div>
                            {selectedPlanet.alliance && (
                              <div className="text-xs text-blue-500 font-bold mt-0.5">[{selectedPlanet.alliance}]</div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* NPC Presence */}
                      {selectedPlanet.npcs && selectedPlanet.npcs.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider">NPC Presence</h4>
                          {selectedPlanet.npcs.map((npc) => (
                            <div key={npc.raceId} className={cn("p-3 rounded border", npc.isHostile ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200")}>
                              <div className="font-medium text-sm">{npc.raceName}</div>
                              <div className="text-xs text-slate-500 mt-0.5">
                                {npc.faction} · Fleet: {npc.fleetPower.toLocaleString()} · {npc.diplomaticStance}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="space-y-2 pt-2 border-t border-slate-100">
                        <Button className="w-full" size="sm" onClick={() => deepScanMutation.mutate({ position: selectedPlanet.position, name: selectedPlanet.name, type: selectedPlanet.type })} disabled={deepScanMutation.isPending}>
                          <Search className="w-3.5 h-3.5 mr-2" /> Deep Scan
                        </Button>
                        {selectedPlanet.owner && (
                          <div className="grid grid-cols-2 gap-2">
                            <Button variant="outline" size="sm" onClick={() => messageActionMutation.mutate({ targetName: selectedPlanet.name, recipientName: selectedPlanet.owner || "", destination: `${galaxy}:${system}:${selectedPlanet.position}` })} disabled={messageActionMutation.isPending}>
                              <MessageSquare className="w-3.5 h-3.5 mr-1" /> Message
                            </Button>
                            <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => fleetActionMutation.mutate({ targetName: selectedPlanet.name, destination: `${galaxy}:${system}:${selectedPlanet.position}`, missionType: "attack", ships: { lightFighter: 10, cruiser: 2 } })} disabled={fleetActionMutation.isPending}>
                              <ShieldAlert className="w-3.5 h-3.5 mr-1" /> Attack
                            </Button>
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  {/* Non-planet types */}
                  {selectedPlanet.type !== "planet" && (
                    <div className="text-center py-6 text-muted-foreground text-sm">
                      {selectedPlanet.type === "asteroid" && (
                        <div className="space-y-3">
                          <div className="text-3xl">☄️</div>
                          <div className="font-bold text-slate-700">Asteroid Belt</div>
                          {selectedPlanet.debris && (
                            <div className="text-xs space-y-1">
                              <div>Metal: <span className="font-mono font-bold text-slate-600">{selectedPlanet.debris.metal.toLocaleString()}</span></div>
                              <div>Crystal: <span className="font-mono font-bold text-blue-600">{selectedPlanet.debris.crystal.toLocaleString()}</span></div>
                            </div>
                          )}
                          <Button size="sm" className="w-full" onClick={() => fleetActionMutation.mutate({ targetName: selectedPlanet.name, destination: `${galaxy}:${system}:${selectedPlanet.position}`, missionType: "espionage", ships: { espionageProbe: 3 } })}>
                            <Rocket className="w-3.5 h-3.5 mr-1" /> Send Recyclers
                          </Button>
                        </div>
                      )}
                      {selectedPlanet.type === "blackhole" && (
                        <div className="space-y-3">
                          <div className="text-3xl">🕳️</div>
                          <div className="font-bold text-slate-700">Singularity</div>
                          <div className="text-xs text-red-500">Extreme gravitational anomaly detected. Unstable for fleet operations.</div>
                        </div>
                      )}
                      {selectedPlanet.type === "nebula" && (
                        <div className="space-y-3">
                          <div className="text-3xl">🌌</div>
                          <div className="font-bold text-slate-700">Ion Cloud</div>
                          <div className="text-xs text-purple-500">Electromagnetic interference zone. Sensor range reduced by 60%.</div>
                        </div>
                      )}
                      {selectedPlanet.type === "station" && (
                        <div className="space-y-3">
                          <div className="text-3xl">🏴‍☠️</div>
                          <div className="font-bold text-red-600">Pirate Outpost</div>
                          <div className="text-xs text-red-500">Hostile station. Armed defenders detected.</div>
                          {selectedPlanet.owner && <div className="text-xs">Operated by: <span className="font-bold">{selectedPlanet.owner}</span></div>}
                          <Button size="sm" variant="destructive" className="w-full" onClick={() => fleetActionMutation.mutate({ targetName: selectedPlanet.name, destination: `${galaxy}:${system}:${selectedPlanet.position}`, missionType: "attack", ships: { lightFighter: 20, cruiser: 5 } })}>
                            <ShieldAlert className="w-3.5 h-3.5 mr-1" /> Raid Outpost
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </GameLayout>
  );
}
