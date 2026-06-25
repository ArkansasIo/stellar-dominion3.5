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
      <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-lg px-4 py-2 flex items-center gap-3 shadow-sm">
          <Globe className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-bold text-white">Galaxy</h2>
          <span className="text-slate-400 text-xs">Spreadsheet · {galaxy}:{sector}:{system}</span>
          <span className="ml-auto flex gap-2">
            <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-white" title="Refresh" onClick={() => window.location.reload()}>
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            </Button>
          </span>
        </div>

        {/* Navigation Toolbar */}
        <div className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 flex items-center gap-3 shadow-sm text-[10px]">
          <Select value={universe} onValueChange={setUniverse}>
            <SelectTrigger className="w-[100px] bg-slate-50 border-slate-200 h-7 text-[10px]">
              <SelectValue placeholder="Universe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="uni1">Nexus-Alpha</SelectItem>
              <SelectItem value="uni2">Cyborg-Beta</SelectItem>
              <SelectItem value="uni3">Quantum-Gamma</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-1">
            <span className="text-slate-500 font-medium">G</span>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setGalaxy(g => Math.max(1, g - 1))}><ChevronLeft className="w-3 h-3" /></Button>
            <Input className="w-10 h-6 text-center font-mono bg-slate-50 border-slate-200 text-slate-900 text-[10px] p-0" value={galaxy} onChange={(e) => setGalaxy(parseInt(e.target.value) || 1)} />
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setGalaxy(g => g + 1)}><ChevronRight className="w-3 h-3" /></Button>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-primary font-bold">S</span>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setSector(s => Math.max(1, s - 1))}><ChevronLeft className="w-3 h-3" /></Button>
            <Input className="w-10 h-6 text-center font-mono bg-slate-50 border-primary/30 text-primary font-bold text-[10px] p-0" value={sector} onChange={(e) => setSector(parseInt(e.target.value) || 1)} />
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setSector(s => s + 1)}><ChevronRight className="w-3 h-3" /></Button>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-slate-500 font-medium">Sys</span>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setSystem(s => Math.max(1, s - 1))}><ChevronLeft className="w-3 h-3" /></Button>
            <Input className="w-11 h-6 text-center font-mono bg-slate-50 border-slate-200 text-slate-900 text-[10px] p-0" value={system} onChange={(e) => setSystem(parseInt(e.target.value) || 1)} />
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setSystem(s => s + 1)}><ChevronRight className="w-3 h-3" /></Button>
          </div>

          {systemData?.star && (
            <span className="text-slate-400 ml-auto truncate max-w-[200px]">
              {systemData.systemName ?? systemData.star.name} · {systemData.star.type}
            </span>
          )}
        </div>

        {/* Compact System Info Bar */}
        {systemData?.star && (
          <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-lg px-3 py-1.5 flex items-center gap-3 text-[10px] shadow-sm">
            <div className={cn("w-5 h-5 rounded-full flex-shrink-0", STAR_INFO[systemData.star.type]?.glow)}
              style={{ background: `radial-gradient(circle at 35% 35%, white, ${STAR_INFO[systemData.star.type]?.color ?? "#ffe4a0"})` }} />
            <span className="text-white font-semibold truncate max-w-[150px]">{systemData.systemName ?? systemData.star.name}</span>
            <span className="text-slate-300">[{systemData.galaxy}:{systemData.sector}:{systemData.system}]</span>
            <span className="text-slate-400">{systemData.star.type} · {STAR_INFO[systemData.star.type]?.label}</span>
            {systemData.galaxyClassification && (
              <span className="text-purple-300 hidden md:inline">{systemData.galaxyClassification.designation}</span>
            )}
            <span className="ml-auto flex gap-2">
              <span className="text-blue-300">{planetPositions.length} planets</span>
              <span className="text-green-300">{habitableCount} habitable</span>
              <span className="text-slate-300">{totalMoons} moons</span>
            </span>
          </div>
        )}

        {/* Main Content: Galaxy Spreadsheet */}
        <div className="flex gap-4">
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm flex-1">
            <div className="overflow-x-auto" style={{ maxHeight: 'calc(100vh - 320px)' }}>
              <table className="w-full text-[10px] border-collapse">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-slate-800 text-white font-semibold uppercase tracking-wider text-[9px] border-b border-slate-600">
                    <th className="text-center w-7 py-1.5 px-0.5 border-r border-slate-600">#</th>
                    <th className="text-center w-7 py-1.5 px-0.5 border-r border-slate-600"></th>
                    <th className="text-left py-1.5 px-1 border-r border-slate-600 min-w-[100px]">Planet / ID</th>
                    <th className="text-left py-1.5 px-1 border-r border-slate-600 w-14">Class</th>
                    <th className="text-right py-1.5 px-1 border-r border-slate-600 w-16">Diameter</th>
                    <th className="text-left py-1.5 px-1 border-r border-slate-600 min-w-[90px]">Moon</th>
                    <th className="text-left py-1.5 px-1 border-r border-slate-600 min-w-[75px]">Debris</th>
                    <th className="text-left py-1.5 px-1 border-r border-slate-600 min-w-[80px]">Player</th>
                    <th className="text-left py-1.5 px-1 border-r border-slate-600 w-14">Alliance</th>
                    <th className="text-center py-1.5 px-1 w-16">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isFetching && !systemData && (
                    <tr><td colSpan={10} className="text-center py-8 text-muted-foreground text-[10px]">Loading system data...</td></tr>
                  )}
                  {systemData?.positions?.map((data, idx) => {
                    const isMe = false;
                    const showPlanetActions = data.type === "planet" || data.type === "station";
                    const isEven = (data.position - 1) % 2 === 0;
                    return (
                      <tr
                        key={data.position}
                        className={cn(
                          "border-b border-slate-200 cursor-pointer transition-colors",
                          isEven ? "bg-white" : "bg-slate-50/50",
                          selectedPlanet?.position === data.position ? "bg-blue-100!" : "hover:bg-blue-50"
                        )}
                        onClick={() => data.type !== "empty" && openPlanetDetail(data)}
                      >
                        <td className="text-center text-slate-500 font-mono py-1 px-0.5 border-r border-slate-200 w-7">{data.position}</td>

                        <td className="text-center py-1 px-0.5 border-r border-slate-200 w-7">
                          {data.type === "planet" && (
                            <div className={cn("w-4 h-4 rounded-full bg-gradient-to-br border border-slate-300 mx-auto inline-block align-middle", getPlanetGradient(data.class))} />
                          )}
                          {data.type === "asteroid" && <div className="w-3 h-3 rounded-sm bg-slate-300 rotate-45 border border-slate-400 mx-auto inline-block align-middle" />}
                          {data.type === "blackhole" && <div className="w-3 h-3 rounded-full bg-black border border-slate-700 mx-auto inline-block align-middle" />}
                          {data.type === "nebula" && <div className="w-3 h-3 rounded-full bg-purple-200 blur-sm mx-auto inline-block align-middle" />}
                          {data.type === "station" && <Hexagon className="w-3.5 h-3.5 text-slate-600 fill-slate-200 mx-auto inline-block align-middle" />}
                          {data.type === "empty" && <span className="text-slate-300">-</span>}
                        </td>

                        <td className="py-1 px-1 border-r border-slate-200 min-w-[100px]">
                          {data.type !== "empty" ? (
                            <div className="flex items-center gap-1">
                              <span className="text-slate-700 font-medium truncate max-w-[80px]">{data.name}</span>
                              {data.planetId && (
                                <span className="text-[8px] text-slate-400 font-mono">#{data.planetId.slice(-6)}</span>
                              )}
                            </div>
                          ) : (
                            <span className="text-slate-300 italic">--</span>
                          )}
                        </td>

                        <td className="py-1 px-1 border-r border-slate-200 w-14">
                          {data.type === "planet" ? (
                            <span className={cn(
                              "text-[9px] font-medium px-1 rounded",
                              data.class && PLANET_CLASS_BADGE[data.class] ? PLANET_CLASS_BADGE[data.class] : "text-slate-500"
                            )}>
                              {data.class ?? "-"}
                            </span>
                          ) : data.type === "asteroid" ? (
                            <span className="text-slate-400 text-[9px]">Belt</span>
                          ) : (
                            <span className="text-slate-400 text-[9px] capitalize">{data.type}</span>
                          )}
                        </td>

                        <td className="text-right py-1 px-1 border-r border-slate-200 w-16 text-slate-500 font-mono text-[9px]">
                          {data.diameter ? `${(data.diameter / 1000).toFixed(0)}k` : data.type === "planet" ? '--' : '-'}
                        </td>

                        <td className="py-1 px-1 border-r border-slate-200 min-w-[90px]">
                          {data.moon && data.moonDetails ? (
                            <div className="flex items-center gap-1">
                              <Moon className="w-3 h-3 text-slate-400 flex-shrink-0" />
                              <span className="text-slate-600 truncate max-w-[50px]">{data.moonDetails.name}</span>
                              <span className="text-[8px] text-slate-400">{data.moonDetails.diameter ? `${(data.moonDetails.diameter / 1000).toFixed(0)}k` : ''}</span>
                            </div>
                          ) : (
                            <span className="text-slate-300">--</span>
                          )}
                        </td>

                        <td className="py-1 px-1 border-r border-slate-200 min-w-[75px]">
                          {data.debris ? (
                            <div className="flex items-center gap-0.5">
                              <Triangle className="w-2.5 h-2.5 fill-yellow-600 rotate-180 flex-shrink-0" />
                              <span className="text-[8px] font-mono text-yellow-700">{data.debris.metal >= 1000 ? `${(data.debris.metal / 1000).toFixed(0)}k` : data.debris.metal}</span>
                              <span className="text-[8px] font-mono text-blue-600">/{data.debris.crystal >= 1000 ? `${(data.debris.crystal / 1000).toFixed(0)}k` : data.debris.crystal}</span>
                            </div>
                          ) : (
                            <span className="text-slate-300">--</span>
                          )}
                        </td>

                        <td className="py-1 px-1 border-r border-slate-200 min-w-[80px]">
                          {data.owner ? (
                            <div className="flex items-center gap-1">
                              <div className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", data.activity && data.activity > 0 ? "bg-green-400" : "bg-yellow-400")} />
                              <span className={cn("text-[10px] truncate max-w-[65px]", isMe ? "text-green-600 font-semibold" : data.type === "station" ? "text-red-600" : "text-slate-700")}>
                                {data.owner}
                              </span>
                            </div>
                          ) : data.type === "planet" ? (
                            <span className="text-emerald-600 font-medium text-[9px]">Free</span>
                          ) : (
                            <span className="text-slate-300">--</span>
                          )}
                        </td>

                        <td className="py-1 px-1 border-r border-slate-200 w-14">
                          {data.alliance ? (
                            <span className="text-blue-600 font-bold text-[9px]">[{data.alliance}]</span>
                          ) : (
                            <span className="text-slate-300">--</span>
                          )}
                        </td>

                        <td className="text-center py-1 px-0.5 w-16">
                          {data.type !== "empty" && (
                            <div className="flex justify-center gap-0.5" onClick={(e) => e.stopPropagation()}>
                              <button className="p-0.5 rounded hover:bg-blue-50 text-slate-400 hover:text-blue-600" title="Scan"
                                onClick={() => deepScanMutation.mutate({ position: data.position, name: data.name || `Position ${data.position}`, type: data.type })}>
                                <Search className="w-2.5 h-2.5" />
                              </button>
                              <button className="p-0.5 rounded hover:bg-slate-100 text-slate-400" title="Details"
                                onClick={() => openPlanetDetail(data)}>
                                <Eye className="w-2.5 h-2.5" />
                              </button>
                              {showPlanetActions && data.owner && (
                                <>
                                  <button className="p-0.5 rounded hover:bg-red-50 text-slate-400 hover:text-red-600" title="Attack"
                                    onClick={() => fleetActionMutation.mutate({ targetName: data.name || `Position ${data.position}`, destination: `${galaxy}:${system}:${data.position}`, missionType: "attack", ships: { lightFighter: 10, cruiser: 2 } })}>
                                    <ShieldAlert className="w-2.5 h-2.5" />
                                  </button>
                                </>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="bg-slate-50 border-t border-slate-200 px-3 py-1.5 flex items-center justify-between text-[9px] text-slate-500">
              <span>{systemData?.positions?.length ?? 0} positions · {planetPositions.length} planets · {totalMoons} moons</span>
              <span className="text-slate-400">G{galaxy}:S{sector}:S{system}</span>
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
