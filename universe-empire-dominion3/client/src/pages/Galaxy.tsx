import GameLayout from "@/components/layout/GameLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Globe, ChevronLeft, ChevronRight, MessageSquare,
  Hexagon, Moon, X, Eye,
  Crosshair, Radio, Target,
} from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const MAX_POSITIONS = 15;

type SystemObjectType = "planet" | "asteroid" | "nebula" | "blackhole" | "station" | "empty";

interface MoonDetail {
  name: string; type: string; size: string; diameter: number;
  gravity: number; habitable: boolean; atmosphere: string;
  temperature: number; resources: string[]; specialFeatures: string[];
}

interface SystemPosition {
  position: number; type: SystemObjectType; name: string;
  owner?: string; alliance?: string;
  debris?: { metal: number; crystal: number };
  moon?: boolean; moonDetails?: MoonDetail;
  class?: string; subclass?: string; category?: string;
  subcategory?: string; planetType?: string;
  temperature?: number; resources?: string[];
  habitable?: boolean; gravity?: number; atmosphere?: string;
  activity?: number;
  stations?: { name: string; level: number; type: string }[];
  diameter?: number; mass?: number; waterPercent?: number;
  specialFeatures?: string[]; planetId?: string;
}

interface SystemData {
  universe: string; galaxy: number; sector: number; system: number;
  systemName?: string; star?: { type: string; name: string };
  positions: SystemPosition[];
  galaxyClassification?: any; npcPresence?: any[];
  systemInfo?: { totalPlanets: number; habitablePlanets: number; asteroidBelts: number; specialObjects: number };
}

const STAR_INFO: Record<string, { label: string; color: string; glow: string }> = {
  O: { label: "Blue Giant", color: "#9bb0ff", glow: "shadow-[0_0_16px_#9bb0ff]" },
  B: { label: "Blue-White", color: "#aabfff", glow: "shadow-[0_0_14px_#aabfff]" },
  A: { label: "White Star", color: "#e0e8ff", glow: "shadow-[0_0_12px_#cad7ff]" },
  F: { label: "Yellow-White", color: "#fff8dc", glow: "shadow-[0_0_12px_#f8f7ff]" },
  G: { label: "Yellow Dwarf", color: "#fff4ea", glow: "shadow-[0_0_12px_#ffe4a0]" },
  K: { label: "Orange Dwarf", color: "#ffd2a1", glow: "shadow-[0_0_12px_#ffa060]" },
  M: { label: "Red Dwarf", color: "#ffcc6f", glow: "shadow-[0_0_12px_#ff6040]" },
};

const POSITION_BG: Record<string, string> = {
  planet: "bg-gradient-to-r from-slate-800 to-slate-750",
  asteroid: "bg-gradient-to-r from-amber-900/30 to-slate-800",
  blackhole: "bg-gradient-to-r from-violet-900/30 to-slate-800",
  nebula: "bg-gradient-to-r from-purple-900/20 to-slate-800",
  station: "bg-gradient-to-r from-red-900/20 to-slate-800",
  empty: "bg-slate-800/40",
};

export default function Galaxy() {
  const { toast } = useToast();
  const [universe, setUniverse] = useState("uni1");
  const [galaxy, setGalaxy] = useState(1);
  const [sector, setSector] = useState(4);
  const [system, setSystem] = useState(102);
  const [selectedPlanet, setSelectedPlanet] = useState<SystemPosition | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

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
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ position: target.position, targetName: target.name, targetType: target.type }),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok) throw new Error(payload?.error || payload?.message || "Deep scan failed");
      return payload;
    },
    onSuccess: (result: any) => {
      const r = result?.report;
      if (r) {
        const metal = r.estimatedResources?.metal ?? 0;
        const crystal = r.estimatedResources?.crystal ?? 0;
        const deut = r.estimatedResources?.deuterium ?? 0;
        toast({ title: `Scan Complete - ${r.targetName}`, description: `${(r.threatLevel ?? 'unknown').toUpperCase()} | Metal ${metal.toLocaleString()} Crystal ${crystal.toLocaleString()} Deuterium ${deut.toLocaleString()}` });
      } else {
        toast({ title: "Scan Complete", description: "No detailed report available" });
      }
    },
    onError: (error: Error) => { toast({ title: "Scan failed", description: error.message, variant: "destructive" }); },
  });

  const fleetActionMutation = useMutation({
    mutationFn: async (payload: { targetName: string; destination: string; missionType: string }) => {
      const response = await fetch("/api/game/send-fleet", {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ destination: payload.destination, missionType: payload.missionType, ships: { espionageProbe: 1 } }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.error || data?.message || "Fleet dispatch failed");
      return data;
    },
    onSuccess: (result: any, vars) => {
      toast({ title: "Fleet dispatched", description: `${vars.missionType} mission to ${vars.targetName}` });
    },
    onError: (error: Error) => { toast({ title: "Fleet dispatch failed", description: error.message, variant: "destructive" }); },
  });

  const messageMutation = useMutation({
    mutationFn: async (payload: { recipientName: string; targetName: string }) => {
      const response = await fetch("/api/messages", {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: payload.recipientName, subject: `RE: ${payload.targetName}`, body: `Regarding ${payload.targetName} at [${galaxy}:${sector}:${system}]`, type: "player" }),
      });
      if (!response.ok) throw new Error("Message failed");
      return response.json();
    },
    onSuccess: (_data, vars) => { toast({ title: "Message sent", description: `To ${vars.recipientName}` }); },
    onError: (error: Error) => { toast({ title: "Message failed", description: error.message, variant: "destructive" }); },
  });

  const positions = systemData?.positions?.filter(p => p.position <= MAX_POSITIONS) || [];
  const planetPositions = positions.filter(p => p.type === "planet");
  const ownedPositions = positions.filter(p => p.owner);

  const navTo = useCallback((deltaGalaxy: number, deltaSector: number, deltaSystem: number) => {
    setGalaxy(g => Math.max(1, g + deltaGalaxy));
    setSector(s => Math.max(1, s + deltaSector));
    setSystem(s => Math.max(1, s + deltaSystem));
    setDetailOpen(false);
  }, []);

  return (
    <GameLayout>
      <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-500 p-1 sm:p-2">
        {/* OGame-style Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-lg border border-slate-700/50 shadow-lg overflow-hidden">
          <div className="px-3 py-2 flex items-center gap-3">
            <Globe className="w-5 h-5 text-cyan-400 shrink-0" />
            <h2 className="text-base font-bold text-white tracking-wider">Galaxy</h2>
            <div className="h-4 w-px bg-slate-700" />
            {systemData?.star && (
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <div className="w-4 h-4 rounded-full" style={{ background: `radial-gradient(circle at 35% 35%, white, ${STAR_INFO[systemData.star.type]?.color || "#ffe4a0"})` }} />
                <span className="text-white font-semibold">{systemData.systemName || systemData.star.name}</span>
                <span className="text-slate-500">[{systemData.star.type}]</span>
              </div>
            )}
            <div className="ml-auto flex items-center gap-1.5">
              <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-white" onClick={() => window.location.reload()}>
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              </Button>
            </div>
          </div>

          {/* OGame Coordinate Navigator */}
          <div className="bg-slate-900/80 border-t border-slate-700/50 px-3 py-2 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-semibold uppercase tracking-wider mr-1">Universe</span>
            <Select value={universe} onValueChange={setUniverse}>
              <SelectTrigger className="h-7 w-24 bg-slate-800 border-slate-600 text-white text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="uni1">Nexus-Alpha</SelectItem>
                <SelectItem value="uni2">Cyborg-Beta</SelectItem>
                <SelectItem value="uni3">Quantum-Gamma</SelectItem>
              </SelectContent>
            </Select>

            <div className="h-4 w-px bg-slate-700" />

            <span className="text-cyan-400 font-bold">Galaxy</span>
            <div className="flex items-center gap-0.5">
              <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-white" onClick={() => navTo(-1, 0, 0)}><ChevronLeft className="w-3 h-3" /></Button>
              <Input className="w-10 h-6 text-center font-bold bg-slate-800 border-slate-600 text-cyan-400 text-xs p-0" value={galaxy} onChange={e => setGalaxy(Number(e.target.value) || 1)} />
              <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-white" onClick={() => navTo(1, 0, 0)}><ChevronRight className="w-3 h-3" /></Button>
            </div>

            <span className="text-orange-400 font-bold">Sector</span>
            <div className="flex items-center gap-0.5">
              <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-white" onClick={() => navTo(0, -1, 0)}><ChevronLeft className="w-3 h-3" /></Button>
              <Input className="w-10 h-6 text-center font-bold bg-slate-800 border-slate-600 text-orange-400 text-xs p-0" value={sector} onChange={e => setSector(Number(e.target.value) || 1)} />
              <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-white" onClick={() => navTo(0, 1, 0)}><ChevronRight className="w-3 h-3" /></Button>
            </div>

            <span className="text-green-400 font-bold">System</span>
            <div className="flex items-center gap-0.5">
              <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-white" onClick={() => navTo(0, 0, -1)}><ChevronLeft className="w-3 h-3" /></Button>
              <Input className="w-12 h-6 text-center font-bold bg-slate-800 border-slate-600 text-green-400 text-xs p-0" value={system} onChange={e => setSystem(Number(e.target.value) || 1)} />
              <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-white" onClick={() => navTo(0, 0, 1)}><ChevronRight className="w-3 h-3" /></Button>
            </div>
          </div>
        </div>

        {/* Main Content: 15-Position OGame Grid + Detail Panel */}
        <div className="flex gap-3">
          {/* Galaxy Grid */}
          <div className="flex-1 min-w-0">
            <div className="bg-slate-900 border border-slate-700/50 rounded-lg overflow-hidden shadow-lg">
              <div className="overflow-x-auto" style={{ maxHeight: "calc(100vh - 280px)" }}>
                <table className="w-full text-xs border-collapse">
                  <thead className="sticky top-0 z-10">
                    <tr className="bg-slate-800 text-slate-300 uppercase tracking-wider text-[10px] border-b border-slate-700">
                      <th className="text-center w-8 py-2 px-1 border-r border-slate-700">Pos</th>
                      <th className="text-left py-2 px-2 border-r border-slate-700">Planet</th>
                      <th className="text-left py-2 px-2 border-r border-slate-700 w-20">Class</th>
                      <th className="text-left py-2 px-2 border-r border-slate-700 w-20">Moon</th>
                      <th className="text-left py-2 px-2 border-r border-slate-700 w-20">Debris</th>
                      <th className="text-left py-2 px-2 border-r border-slate-700">Player</th>
                      <th className="text-left py-2 px-2 border-r border-slate-700 w-16">Alliance</th>
                      <th className="text-center py-2 px-2 w-28">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isFetching && !systemData && (
                      <tr><td colSpan={8} className="text-center py-12 text-slate-500 text-xs">Loading galaxy data...</td></tr>
                    )}
                    {positions.map((data, idx) => {
                      const isEven = idx % 2 === 0;
                      const isOccupied = data.type === "planet" && !!data.owner;
                      const bgClass = data.type !== "empty" ? POSITION_BG[data.type] || "bg-slate-800" : (isEven ? "bg-slate-800/60" : "bg-slate-800/30");
                      return (
                        <tr key={data.position}
                          className={cn(bgClass, "border-b border-slate-700/50 transition-colors", data.type !== "empty" && "cursor-pointer hover:bg-slate-700/50")}
                          onClick={() => { if (data.type !== "empty") { setSelectedPlanet(data); setDetailOpen(true); } }}>
                          <td className="text-center text-slate-500 font-mono py-1.5 px-1 border-r border-slate-700/50">{data.position}</td>
                          <td className="py-1.5 px-2 border-r border-slate-700/50">
                            {data.type === "planet" ? (
                              <div className="flex items-center gap-2">
                                <div className={cn("w-5 h-5 rounded-full bg-gradient-to-br border border-slate-600 shrink-0",
                                  data.class === "M" ? "from-blue-400 to-emerald-600" :
                                  data.class === "H" ? "from-yellow-500 to-orange-700" :
                                  data.class === "L" ? "from-lime-500 to-emerald-700" :
                                  data.class === "D" ? "from-slate-400 to-stone-600" :
                                  data.class === "J" ? "from-amber-400 to-orange-700" :
                                  data.class === "T" ? "from-sky-300 to-indigo-600" :
                                  data.class === "Y" ? "from-red-500 to-orange-900" :
                                  "from-blue-500 to-purple-800")} />
                                <span className="text-slate-200 font-medium truncate max-w-[120px]">{data.name}</span>
                                {data.habitable && <span className="text-[9px] text-green-400 shrink-0">H</span>}
                              </div>
                            ) : data.type === "asteroid" ? (
                              <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-sm bg-amber-600 rotate-45 border border-amber-500 shrink-0" /><span className="text-amber-300">Asteroid Belt</span></div>
                            ) : data.type === "blackhole" ? (
                              <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-black border border-violet-500 shrink-0" /><span className="text-violet-300">Singularity</span></div>
                            ) : data.type === "nebula" ? (
                              <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-purple-500/40 blur-sm shrink-0" /><span className="text-purple-300">Ion Cloud</span></div>
                            ) : data.type === "station" ? (
                              <div className="flex items-center gap-2"><Hexagon className="w-4 h-4 text-red-400 shrink-0" /><span className="text-red-300">{data.name || "Pirate Outpost"}</span></div>
                            ) : (
                              <span className="text-slate-600">--</span>
                            )}
                          </td>
                          <td className="py-1.5 px-2 border-r border-slate-700/50">
                            {data.class ? (
                              <Badge variant="outline" className={cn("text-[10px] font-mono border-slate-600",
                                data.class === "M" ? "text-green-300 border-green-700" :
                                data.class === "H" ? "text-yellow-300 border-yellow-700" :
                                data.class === "L" ? "text-lime-300 border-lime-700" :
                                data.class === "D" ? "text-slate-300 border-slate-600" :
                                data.class === "J" ? "text-orange-300 border-orange-700" :
                                data.class === "T" ? "text-sky-300 border-sky-700" :
                                data.class === "Y" ? "text-red-300 border-red-700" :
                                "text-blue-300 border-blue-700")}>
                                {data.class}
                              </Badge>
                            ) : <span className="text-slate-600">-</span>}
                          </td>
                          <td className="py-1.5 px-2 border-r border-slate-700/50">
                            {data.moon && data.moonDetails ? (
                              <div className="flex items-center gap-1.5">
                                <Moon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span className="text-slate-300 truncate max-w-[60px]">{data.moonDetails.name}</span>
                              </div>
                            ) : <span className="text-slate-600">--</span>}
                          </td>
                          <td className="py-1.5 px-2 border-r border-slate-700/50">
                            {data.debris ? (
                              <div className="flex flex-col text-[10px] leading-tight">
                                <span className="text-yellow-400">M: {data.debris.metal >= 1000 ? `${(data.debris.metal / 1000).toFixed(0)}k` : data.debris.metal}</span>
                                <span className="text-blue-400">C: {data.debris.crystal >= 1000 ? `${(data.debris.crystal / 1000).toFixed(0)}k` : data.debris.crystal}</span>
                              </div>
                            ) : <span className="text-slate-600">--</span>}
                          </td>
                          <td className="py-1.5 px-2 border-r border-slate-700/50">
                            {data.owner ? (
                              <div className="flex items-center gap-1.5">
                                <div className={cn("w-1.5 h-1.5 rounded-full shrink-0", data.activity && data.activity > 0 ? "bg-green-400" : "bg-yellow-400")} />
                                <span className={cn("text-slate-200 truncate max-w-[80px]", isOccupied && "font-semibold")}>{data.owner}</span>
                              </div>
                            ) : data.type === "planet" ? (
                              <span className="text-emerald-500 font-medium">Free</span>
                            ) : <span className="text-slate-600">--</span>}
                          </td>
                          <td className="py-1.5 px-2 border-r border-slate-700/50">
                            {data.alliance ? (
                              <span className="text-blue-300 font-bold text-[10px]">[{data.alliance}]</span>
                            ) : <span className="text-slate-600">--</span>}
                          </td>
                          <td className="text-center py-1.5 px-1">
                            {data.type !== "empty" && (
                              <div className="flex justify-center gap-0.5" onClick={e => e.stopPropagation()}>
                                <button className="p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-white transition-colors" title="Deep Scan"
                                  onClick={() => deepScanMutation.mutate({ position: data.position, name: data.name || `Pos ${data.position}`, type: data.type })}>
                                  <Radio className="w-3.5 h-3.5" />
                                </button>
                                <button className="p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-white transition-colors" title="Details"
                                  onClick={() => { setSelectedPlanet(data); setDetailOpen(true); }}>
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                                {data.owner && (
                                  <>
                                    <button className="p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-cyan-300 transition-colors" title="Espionage"
                                      onClick={() => fleetActionMutation.mutate({ targetName: data.name, destination: `${galaxy}:${sector}:${system}:${data.position}`, missionType: "espionage" })}>
                                      <Crosshair className="w-3.5 h-3.5" />
                                    </button>
                                    <button className="p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-red-400 transition-colors" title="Attack"
                                      onClick={() => fleetActionMutation.mutate({ targetName: data.name, destination: `${galaxy}:${sector}:${system}:${data.position}`, missionType: "attack" })}>
                                      <Target className="w-3.5 h-3.5" />
                                    </button>
                                    <button className="p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-blue-300 transition-colors" title="Message"
                                      onClick={() => messageMutation.mutate({ recipientName: data.owner || "", targetName: data.name })}>
                                      <MessageSquare className="w-3.5 h-3.5" />
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
              <div className="bg-slate-800/80 border-t border-slate-700/50 px-3 py-1.5 flex items-center justify-between text-[10px] text-slate-400">
                <span>{positions.length} positions · {planetPositions.length} planets · {ownedPositions.length} occupied</span>
                <span className="text-slate-500 font-mono">[{galaxy}:{sector}:{system}]</span>
              </div>
            </div>
          </div>

          {/* Detail Panel */}
          {detailOpen && selectedPlanet && (
            <div className="w-[360px] shrink-0 hidden lg:block">
              <Card className="bg-slate-900 border-slate-700 shadow-lg sticky top-4">
                <CardHeader className="pb-2 border-b border-slate-700/50">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-orbitron flex items-center gap-2 text-white">
                      {selectedPlanet.name || `Position ${selectedPlanet.position}`}
                    </CardTitle>
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-white" onClick={() => setDetailOpen(false)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    [{galaxy}:{sector}:{system}:{selectedPlanet.position}]
                  </div>
                </CardHeader>
                <CardContent className="p-3 space-y-3 text-xs">
                  {selectedPlanet.type === "planet" && (
                    <>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-1.5 bg-slate-800 rounded border border-slate-700">
                          <div className="text-[10px] text-slate-400">Class</div>
                          <div className="font-bold text-white">{selectedPlanet.class || "-"}</div>
                        </div>
                        <div className="p-1.5 bg-slate-800 rounded border border-slate-700">
                          <div className="text-[10px] text-slate-400">Type</div>
                          <div className="font-bold text-white capitalize">{selectedPlanet.planetType?.replace(/_/g, " ") || "-"}</div>
                        </div>
                        <div className="p-1.5 bg-slate-800 rounded border border-slate-700">
                          <div className="text-[10px] text-slate-400">Diameter</div>
                          <div className="font-bold text-white">{selectedPlanet.diameter?.toLocaleString()} km</div>
                        </div>
                        <div className="p-1.5 bg-slate-800 rounded border border-slate-700">
                          <div className="text-[10px] text-slate-400">Gravity</div>
                          <div className="font-bold text-white">{selectedPlanet.gravity}g</div>
                        </div>
                        <div className="p-1.5 bg-slate-800 rounded border border-slate-700">
                          <div className="text-[10px] text-slate-400">Temperature</div>
                          <div className="font-bold text-white">{selectedPlanet.temperature}K</div>
                        </div>
                        <div className={cn("p-1.5 rounded border", selectedPlanet.habitable ? "bg-emerald-900/30 border-emerald-700" : "bg-red-900/30 border-red-700")}>
                          <div className="text-[10px] text-slate-400">Habitable</div>
                          <div className={cn("font-bold", selectedPlanet.habitable ? "text-emerald-300" : "text-red-300")}>{selectedPlanet.habitable ? "Yes" : "No"}</div>
                        </div>
                      </div>

                      {selectedPlanet.resources && selectedPlanet.resources.length > 0 && (
                        <div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Resources</div>
                          <div className="flex flex-wrap gap-1">
                            {selectedPlanet.resources.map(r => <Badge key={r} variant="outline" className="text-[10px] text-slate-300 border-slate-600 bg-slate-800 capitalize">{r}</Badge>)}
                          </div>
                        </div>
                      )}

                      {selectedPlanet.moon && selectedPlanet.moonDetails && (
                        <div className="p-2 bg-slate-800 rounded border border-slate-700 space-y-1">
                          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-300"><Moon className="w-3 h-3" /> Moon</div>
                          <div className="font-medium text-white text-sm">{selectedPlanet.moonDetails.name}</div>
                          <div className="grid grid-cols-2 gap-1 text-[10px] text-slate-400">
                            <span>Type: <span className="text-slate-200">{selectedPlanet.moonDetails.type}</span></span>
                            <span>Size: <span className="text-slate-200 capitalize">{selectedPlanet.moonDetails.size}</span></span>
                            <span>Diameter: <span className="text-slate-200">{selectedPlanet.moonDetails.diameter.toLocaleString()} km</span></span>
                            <span>Temp: <span className="text-slate-200">{selectedPlanet.moonDetails.temperature}K</span></span>
                          </div>
                        </div>
                      )}

                      {selectedPlanet.owner && (
                        <div className="p-2 bg-slate-800 rounded border border-slate-700">
                          <div className="text-[10px] text-slate-400">Colony</div>
                          <div className="font-medium text-white">{selectedPlanet.owner}</div>
                          {selectedPlanet.alliance && <div className="text-[10px] text-blue-300 font-bold">[{selectedPlanet.alliance}]</div>}
                        </div>
                      )}

                      <div className="space-y-1.5 pt-1 border-t border-slate-700/50">
                        <Button size="sm" className="w-full h-7 text-xs" onClick={() => deepScanMutation.mutate({ position: selectedPlanet.position, name: selectedPlanet.name, type: selectedPlanet.type })} disabled={deepScanMutation.isPending}>
                          <Radio className="w-3 h-3 mr-1" /> Deep Scan
                        </Button>
                        {selectedPlanet.owner && (
                          <div className="grid grid-cols-3 gap-1">
                            <Button variant="outline" size="sm" className="h-7 text-xs border-slate-600 text-slate-300 hover:bg-slate-800" onClick={() => fleetActionMutation.mutate({ targetName: selectedPlanet.name, destination: `${galaxy}:${sector}:${system}:${selectedPlanet.position}`, missionType: "espionage" })} disabled={fleetActionMutation.isPending}>
                              <Crosshair className="w-3 h-3 mr-0.5" /> Spy
                            </Button>
                            <Button variant="outline" size="sm" className="h-7 text-xs border-red-800 text-red-300 hover:bg-red-900/30" onClick={() => fleetActionMutation.mutate({ targetName: selectedPlanet.name, destination: `${galaxy}:${sector}:${system}:${selectedPlanet.position}`, missionType: "attack" })} disabled={fleetActionMutation.isPending}>
                              <Target className="w-3 h-3 mr-0.5" /> Attack
                            </Button>
                            <Button variant="outline" size="sm" className="h-7 text-xs border-slate-600 text-slate-300 hover:bg-slate-800" onClick={() => messageMutation.mutate({ recipientName: selectedPlanet.owner || "", targetName: selectedPlanet.name })} disabled={messageMutation.isPending}>
                              <MessageSquare className="w-3 h-3 mr-0.5" /> Msg
                            </Button>
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  {selectedPlanet.type !== "planet" && (
                    <div className="text-center py-4 text-slate-400 text-xs space-y-2">
                      {selectedPlanet.type === "asteroid" && <><div className="text-2xl">☄️</div><div className="font-bold text-amber-300">Asteroid Belt</div>{selectedPlanet.debris && <div className="text-[10px]">M: {selectedPlanet.debris.metal.toLocaleString()} C: {selectedPlanet.debris.crystal.toLocaleString()}</div>}</>}
                      {selectedPlanet.type === "blackhole" && <><div className="text-2xl">🕳️</div><div className="font-bold text-violet-300">Singularity</div><div className="text-[10px] text-red-400">Unstable - no fleet operations</div></>}
                      {selectedPlanet.type === "nebula" && <><div className="text-2xl">🌌</div><div className="font-bold text-purple-300">Ion Cloud</div><div className="text-[10px] text-purple-400">Sensor interference zone</div></>}
                      {selectedPlanet.type === "station" && <><div className="text-2xl">🏴‍☠️</div><div className="font-bold text-red-300">Pirate Outpost</div><div className="text-[10px] text-red-400">Hostile</div></>}
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
