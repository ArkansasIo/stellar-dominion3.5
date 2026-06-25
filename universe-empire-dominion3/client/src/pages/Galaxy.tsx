import GameLayout from "@/components/layout/GameLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Globe, ChevronLeft, ChevronRight, MessageSquare,
  Moon, X, Eye, Crosshair, Radio, Target, Download, Upload,
  Thermometer, User, Rocket, AlertTriangle,
} from "lucide-react";
import { useEffect, useState, useCallback, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const MAX_GALAXY = 9;
const MAX_SYSTEM = 499;
const MAX_POSITIONS = 15;
const DEBRIS_POSITION = 16;
const EXPEDITION_POSITION = 17;

type CelestialType = "planet" | "moon" | "debris" | "empty";

interface GalaxyPosition {
  position: number;
  celestialType: CelestialType;
  planetName: string;
  planetType: string;
  planetClass: string;
  planetDiameter: number;
  planetTemperature: number;
  playerName: string;
  playerRank: number;
  allianceTag: string;
  allianceName: string;
  status: string;
  hasActivity: boolean;
  activityTypes: number[];
  moonExists: boolean;
  moonName: string;
  moonSize: number;
  debrisMetal: number;
  debrisCrystal: number;
  isInactive: boolean;
  isVacation: boolean;
}

interface GalaxySystemData {
  galaxy: number;
  system: number;
  systemName: string;
  star: { type: string; name: string };
  positions: GalaxyPosition[];
  totals: {
    totalPositions: number;
    occupiedPlanets: number;
    debrisFields: number;
    activePlayers: number;
  };
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

const POSITION_ZONES: Record<string, { label: string; positions: number[]; color: string; bg: string }> = {
  veryHot: { label: "Very Hot", positions: [1, 2, 3], color: "text-red-300", bg: "bg-red-950/30" },
  warm: { label: "Warm", positions: [4, 5, 6], color: "text-orange-300", bg: "bg-orange-950/20" },
  moderate: { label: "Moderate", positions: [7, 8, 9], color: "text-yellow-300", bg: "bg-yellow-950/20" },
  cold: { label: "Cold", positions: [10, 11, 12], color: "text-cyan-300", bg: "bg-cyan-950/30" },
  veryCold: { label: "Very Cold", positions: [13, 14, 15], color: "text-blue-300", bg: "bg-blue-950/30" },
};

const PLANET_CLASS_COLORS: Record<string, string> = {
  M: "from-blue-400 to-emerald-600",
  H: "from-yellow-500 to-orange-700",
  L: "from-lime-500 to-emerald-700",
  D: "from-slate-400 to-stone-600",
  J: "from-amber-400 to-orange-700",
  T: "from-sky-300 to-indigo-600",
  Y: "from-red-500 to-orange-900",
  K: "from-blue-500 to-purple-800",
};

export default function Galaxy() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [galaxy, setGalaxy] = useState(1);
  const [system, setSystem] = useState(1);
  const [selectedPos, setSelectedPos] = useState<GalaxyPosition | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: systemData, isFetching, refetch } = useQuery<GalaxySystemData>({
    queryKey: ["ogame-galaxy-v2", galaxy, system],
    queryFn: async () => {
      const res = await fetch(`/api/ogame/galaxy/v2/${galaxy}/${system}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load system data");
      return res.json();
    },
    staleTime: 30_000,
    refetchInterval: 60_000,
  });

  const data = systemData?.positions ? systemData : null;
  const positions = data?.positions || [];

  const navTo = useCallback((deltaGal: number, deltaSys: number) => {
    setGalaxy(g => Math.max(1, Math.min(MAX_GALAXY, g + deltaGal)));
    setSystem(s => Math.max(1, Math.min(MAX_SYSTEM, s + deltaSys)));
    setDetailOpen(false);
  }, []);

  const getZoneKey = (pos: number): string | undefined => {
    for (const [key, zone] of Object.entries(POSITION_ZONES)) {
      if (zone.positions.includes(pos)) return key;
    }
    return undefined;
  };

  const getActivityIcon = (types: number[]) => {
    if (types.includes(4)) return "combat";
    if (types.includes(3)) return "spy";
    if (types.includes(2)) return "fleet";
    if (types.includes(1)) return "login";
    return null;
  };

  return (
    <GameLayout>
      <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-500 p-1 sm:p-2">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-lg border border-slate-700/50 shadow-lg overflow-hidden">
          <div className="px-3 py-2 flex items-center gap-3">
            <Globe className="w-5 h-5 text-cyan-400 shrink-0" />
            <h2 className="text-base font-bold text-white tracking-wider">Galaxy</h2>
            <div className="h-4 w-px bg-slate-700" />
            {data && (
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <div className="w-4 h-4 rounded-full" style={{ background: `radial-gradient(circle at 35% 35%, white, ${STAR_INFO[data.star.type]?.color || "#ffe4a0"})` }} />
                <span className="text-white font-semibold">{data.systemName || data.star.name}</span>
                <span className="text-slate-500">[{data.star.type}]</span>
              </div>
            )}
            <div className="ml-auto flex items-center gap-1.5">
              <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-white" onClick={() => refetch()} title="Refresh">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              </Button>
              {data?.totals && (
                <div className="hidden sm:flex items-center gap-2 text-[10px] text-slate-500">
                  <span className="text-green-400">{data.totals.occupiedPlanets} occupied</span>
                  <span className="text-yellow-400">{data.totals.debrisFields} debris</span>
                  <span className="text-cyan-400">{data.totals.activePlayers} active</span>
                </div>
              )}
            </div>
          </div>

          {/* Coordinate Navigator */}
          <div className="bg-slate-900/80 border-t border-slate-700/50 px-3 py-2 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-cyan-400 font-bold">Galaxy</span>
            <div className="flex items-center gap-0.5">
              <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-white" onClick={() => navTo(-1, 0)}><ChevronLeft className="w-3 h-3" /></Button>
              <Input className="w-10 h-6 text-center font-bold bg-slate-800 border-slate-600 text-cyan-400 text-xs p-0" value={galaxy} onChange={e => setGalaxy(Math.max(1, Math.min(MAX_GALAXY, Number(e.target.value) || 1)))} />
              <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-white" onClick={() => navTo(1, 0)}><ChevronRight className="w-3 h-3" /></Button>
            </div>

            <span className="text-green-400 font-bold">System</span>
            <div className="flex items-center gap-0.5">
              <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-white" onClick={() => navTo(0, -1)}><ChevronLeft className="w-3 h-3" /></Button>
              <Input className="w-12 h-6 text-center font-bold bg-slate-800 border-slate-600 text-green-400 text-xs p-0" value={system} onChange={e => setSystem(Math.max(1, Math.min(MAX_SYSTEM, Number(e.target.value) || 1)))} />
              <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-white" onClick={() => navTo(0, 1)}><ChevronRight className="w-3 h-3" /></Button>
            </div>

            <span className="text-slate-500 font-mono ml-auto">[{galaxy}:{system}]</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex gap-3">
          {/* Galaxy Grid */}
          <div className="flex-1 min-w-0">
            <div className="bg-slate-900 border border-slate-700/50 rounded-lg overflow-hidden shadow-lg">
              <div className="overflow-x-auto" style={{ maxHeight: "calc(100vh - 280px)" }}>
                <table className="w-full text-xs border-collapse">
                  <thead className="sticky top-0 z-10">
                    <tr className="bg-slate-800 text-slate-300 uppercase tracking-wider text-[10px] border-b border-slate-700">
                      <th className="text-center w-8 py-2 px-1 border-r border-slate-700">Pos</th>
                      <th className="text-center py-2 px-2 border-r border-slate-700 w-10">Zone</th>
                      <th className="text-left py-2 px-2 border-r border-slate-700">Planet</th>
                      <th className="text-left py-2 px-2 border-r border-slate-700 w-14">Class</th>
                      <th className="text-center py-2 px-2 border-r border-slate-700 w-10">Temp</th>
                      <th className="text-left py-2 px-2 border-r border-slate-700 w-18">Moon</th>
                      <th className="text-right py-2 px-1 border-r border-slate-700 w-22">Debris</th>
                      <th className="text-left py-2 px-2 border-r border-slate-700">Player</th>
                      <th className="text-left py-2 px-2 border-r border-slate-700 w-14">Alliance</th>
                      <th className="text-left py-2 px-2 w-14">Status</th>
                      <th className="text-center py-2 px-2 w-28">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isFetching && !data && (
                      <tr><td colSpan={11} className="text-center py-12 text-slate-500 text-xs">Loading galaxy data...</td></tr>
                    )}
                    {positions.map((pos, idx) => {
                      const zoneKey = getZoneKey(pos.position);
                      const zone = zoneKey ? POSITION_ZONES[zoneKey] : null;
                      const isEven = idx % 2 === 0;
                      const isOccupied = !!pos.playerName;
                      const isPlanet = pos.celestialType === "planet";
                      const zoneBg = zone ? zone.bg : "";

                      return (
                        <tr key={pos.position}
                          className={cn(
                            isEven ? "bg-slate-800/60" : "bg-slate-800/30",
                            zoneBg,
                            "border-b border-slate-700/50 transition-colors",
                            isPlanet && "cursor-pointer hover:bg-slate-700/50",
                          )}
                          onClick={() => { if (isPlanet) { setSelectedPos(pos); setDetailOpen(true); } }}
                        >
                          <td className="text-center py-1.5 px-1 border-r border-slate-700/50">
                            <div className="flex items-center justify-center gap-1">
                              <span className="text-slate-500 font-mono">{pos.position}</span>
                              {pos.hasActivity && (
                                <div className="relative flex items-center justify-center" title="Recent activity detected">
                                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping absolute" />
                                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 relative" />
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="text-center py-1.5 px-2 border-r border-slate-700/50">
                            {zone && <span className={cn("text-[9px] font-semibold", zone.color)}>{zone.label}</span>}
                          </td>
                          <td className="py-1.5 px-2 border-r border-slate-700/50">
                            {isPlanet ? (
                              <div className="flex items-center gap-2">
                                <div className={cn(
                                  "w-5 h-5 rounded-full bg-gradient-to-br border border-slate-600 shrink-0",
                                  PLANET_CLASS_COLORS[pos.planetClass] || "from-blue-500 to-purple-800",
                                )} />
                                <span className="text-slate-200 font-medium truncate max-w-[120px]">{pos.planetName}</span>
                              </div>
                            ) : (
                              <span className="text-slate-600">--</span>
                            )}
                          </td>
                          <td className="py-1.5 px-2 border-r border-slate-700/50">
                            {pos.planetClass ? (
                              <Badge variant="outline" className="text-[10px] font-mono border-slate-600 text-slate-300">
                                {pos.planetClass}
                              </Badge>
                            ) : <span className="text-slate-600">-</span>}
                          </td>
                          <td className="text-center py-1.5 px-2 border-r border-slate-700/50">
                            {pos.planetTemperature > 0 ? (
                              <div className="flex items-center justify-center gap-1">
                                <Thermometer className="w-3 h-3 text-slate-500" />
                                <span className={cn(
                                  "text-xs font-mono",
                                  pos.planetTemperature > 300 ? "text-red-400" :
                                  pos.planetTemperature > 200 ? "text-orange-300" :
                                  pos.planetTemperature > 100 ? "text-yellow-300" : "text-cyan-300",
                                )}>
                                  {pos.planetTemperature}°
                                </span>
                              </div>
                            ) : <span className="text-slate-600">-</span>}
                          </td>
                          <td className="py-1.5 px-2 border-r border-slate-700/50">
                            {pos.moonExists ? (
                              <div className="flex items-center gap-1.5">
                                <Moon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span className="text-slate-300 truncate max-w-[60px]">{pos.moonName}</span>
                                {pos.hasActivity && (
                                  <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                                )}
                              </div>
                            ) : <span className="text-slate-600">--</span>}
                          </td>
                          <td className="text-right py-1.5 px-1 border-r border-slate-700/50">
                            {(pos.debrisMetal > 0 || pos.debrisCrystal > 0) ? (
                              <div className="flex flex-col text-[10px] leading-tight items-end">
                                <span className="text-yellow-400">M: {pos.debrisMetal >= 1000 ? `${(pos.debrisMetal / 1000).toFixed(0)}k` : pos.debrisMetal}</span>
                                <span className="text-blue-400">C: {pos.debrisCrystal >= 1000 ? `${(pos.debrisCrystal / 1000).toFixed(0)}k` : pos.debrisCrystal}</span>
                              </div>
                            ) : <span className="text-slate-600">--</span>}
                          </td>
                          <td className="py-1.5 px-2 border-r border-slate-700/50">
                            {pos.playerName ? (
                              <div className="flex items-center gap-1.5">
                                <div className={cn(
                                  "w-1.5 h-1.5 rounded-full shrink-0",
                                  pos.hasActivity ? "bg-green-400" :
                                  pos.isVacation ? "bg-yellow-400" :
                                  pos.isInactive ? "bg-slate-500" : "bg-slate-400",
                                )} />
                                <span className="text-slate-200 truncate max-w-[80px] font-semibold">{pos.playerName}</span>
                              </div>
                            ) : (
                              <span className="text-emerald-500 font-medium">Free</span>
                            )}
                          </td>
                          <td className="py-1.5 px-2 border-r border-slate-700/50">
                            {pos.allianceTag ? (
                              <span className="text-blue-300 font-bold text-[10px]">[{pos.allianceTag}]</span>
                            ) : <span className="text-slate-600">--</span>}
                          </td>
                          <td className="py-1.5 px-2">
                            {pos.playerName ? (
                              <span className={cn(
                                "text-[10px] capitalize",
                                pos.hasActivity ? "text-green-400" :
                                pos.isVacation ? "text-yellow-400" :
                                pos.isInactive ? "text-slate-500" : "text-green-400",
                              )}>
                                {pos.hasActivity ? "Active" : pos.isVacation ? "Vacation" : pos.isInactive ? "Inactive" : "Active"}
                              </span>
                            ) : <span className="text-slate-600">-</span>}
                          </td>
                          <td className="text-center py-1.5 px-1">
                            {isPlanet && (
                              <div className="flex justify-center gap-0.5" onClick={e => e.stopPropagation()}>
                                <button className="p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-white transition-colors" title="Details"
                                  onClick={() => { setSelectedPos(pos); setDetailOpen(true); }}>
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                                {pos.playerName && (
                                  <>
                                    <button className="p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-cyan-300 transition-colors" title="Espionage">
                                      <Crosshair className="w-3.5 h-3.5" />
                                    </button>
                                    <button className="p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-red-400 transition-colors" title="Attack">
                                      <Target className="w-3.5 h-3.5" />
                                    </button>
                                    <button className="p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-blue-300 transition-colors" title="Message">
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
                <span className="flex items-center gap-3">
                  <span>{positions.length} positions</span>
                  {data?.totals && (
                    <>
                      <span className="text-green-400">{data.totals.occupiedPlanets} occupied</span>
                      <span className="text-yellow-400">{data.totals.debrisFields} debris</span>
                      <span className="text-cyan-400">{data.totals.activePlayers} active</span>
                    </>
                  )}
                </span>
                <span className="text-slate-500 font-mono">[{galaxy}:{system}]</span>
              </div>
            </div>

            {/* Zone Legend */}
            <div className="flex gap-3 flex-wrap text-[10px] text-slate-400 mt-1 px-1">
              {Object.values(POSITION_ZONES).map(z => (
                <div key={z.label} className={cn("flex items-center gap-1", z.color)}>
                  <div className={cn("w-2 h-2 rounded-full", z.bg.replace("bg-", "bg-").replace("/20", "/40").replace("/30", "/40"))} />
                  {z.label}
                </div>
              ))}
              <div className="flex items-center gap-1 text-green-400">
                <div className="w-2 h-2 rounded-full bg-green-400/40" />
                Activity
              </div>
            </div>
          </div>

          {/* Detail Panel */}
          {detailOpen && selectedPos && (
            <div className="w-[360px] shrink-0 hidden lg:block">
              <Card className="bg-slate-900 border-slate-700 shadow-lg sticky top-4">
                <CardHeader className="pb-2 border-b border-slate-700/50">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm flex items-center gap-2 text-white">
                      {selectedPos.planetName || `Position ${selectedPos.position}`}
                    </CardTitle>
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-white" onClick={() => setDetailOpen(false)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    [{galaxy}:{system}:{selectedPos.position}]
                  </div>
                </CardHeader>
                <CardContent className="p-3 space-y-3 text-xs">
                  {selectedPos.celestialType === "planet" && (
                    <>
                      {/* Activity Indicator */}
                      {selectedPos.hasActivity && (
                        <div className="p-1.5 bg-green-950/40 border border-green-800/50 rounded flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-400 animate-ping" />
                          <div className="w-2 h-2 rounded-full bg-green-400 absolute" />
                          <span className="text-green-400 text-[10px] font-semibold ml-1">Activity Detected</span>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-1.5 bg-slate-800 rounded border border-slate-700">
                          <div className="text-[10px] text-slate-400">Class</div>
                          <div className="font-bold text-white">{selectedPos.planetClass || "-"}</div>
                        </div>
                        <div className="p-1.5 bg-slate-800 rounded border border-slate-700">
                          <div className="text-[10px] text-slate-400">Type</div>
                          <div className="font-bold text-white capitalize">{selectedPos.planetType?.replace(/_/g, " ") || "-"}</div>
                        </div>
                        <div className="p-1.5 bg-slate-800 rounded border border-slate-700">
                          <div className="text-[10px] text-slate-400">Diameter</div>
                          <div className="font-bold text-white">{selectedPos.planetDiameter?.toLocaleString()} km</div>
                        </div>
                        <div className="p-1.5 bg-slate-800 rounded border border-slate-700">
                          <div className="text-[10px] text-slate-400">Temperature</div>
                          <div className="font-bold text-white">{selectedPos.planetTemperature}K</div>
                        </div>
                      </div>

                      {selectedPos.moonExists && (
                        <div className="p-2 bg-slate-800 rounded border border-slate-700 space-y-1">
                          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-300">
                            <Moon className="w-3 h-3" /> Moon
                          </div>
                          <div className="font-medium text-white text-sm">{selectedPos.moonName}</div>
                          <div className="grid grid-cols-2 gap-1 text-[10px] text-slate-400">
                            <span>Size: <span className="text-slate-200">{selectedPos.moonSize?.toLocaleString()} km</span></span>
                          </div>
                        </div>
                      )}

                      {(selectedPos.debrisMetal > 0 || selectedPos.debrisCrystal > 0) && (
                        <div className="p-2 bg-slate-800 rounded border border-slate-700 space-y-1">
                          <div className="text-[10px] font-bold text-slate-400">Debris Field</div>
                          <div className="grid grid-cols-2 gap-1 text-[10px]">
                            <span className="text-yellow-400">Metal: {selectedPos.debrisMetal.toLocaleString()}</span>
                            <span className="text-blue-400">Crystal: {selectedPos.debrisCrystal.toLocaleString()}</span>
                          </div>
                        </div>
                      )}

                      {selectedPos.playerName && (
                        <div className="p-2 bg-slate-800 rounded border border-slate-700">
                          <div className="text-[10px] text-slate-400">Colony</div>
                          <div className="font-medium text-white">{selectedPos.playerName}</div>
                          {selectedPos.allianceTag && <div className="text-[10px] text-blue-300 font-bold">[{selectedPos.allianceTag}]</div>}
                          <div className="text-[10px] text-slate-400 capitalize mt-0.5">
                            Status: {selectedPos.hasActivity ? "Active" : selectedPos.isVacation ? "Vacation" : selectedPos.isInactive ? "Inactive" : "Active"}
                          </div>
                        </div>
                      )}

                      <div className="space-y-1.5 pt-1 border-t border-slate-700/50">
                        <Button size="sm" className="w-full h-7 text-xs">
                          <Radio className="w-3 h-3 mr-1" /> Scan
                        </Button>
                        {selectedPos.playerName && (
                          <div className="grid grid-cols-3 gap-1">
                            <Button variant="outline" size="sm" className="h-7 text-xs border-slate-600 text-slate-300 hover:bg-slate-800">
                              <Crosshair className="w-3 h-3 mr-0.5" /> Spy
                            </Button>
                            <Button variant="outline" size="sm" className="h-7 text-xs border-red-800 text-red-300 hover:bg-red-900/30">
                              <Target className="w-3 h-3 mr-0.5" /> Attack
                            </Button>
                            <Button variant="outline" size="sm" className="h-7 text-xs border-slate-600 text-slate-300 hover:bg-slate-800">
                              <MessageSquare className="w-3 h-3 mr-0.5" /> Msg
                            </Button>
                          </div>
                        )}
                      </div>
                    </>
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
