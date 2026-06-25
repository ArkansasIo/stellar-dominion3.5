import GameLayout from "@/components/layout/GameLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Globe, Grid3x3, Hexagon, Layers, Search, Star, Orbit } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const SECTOR_ROWS = 5;
const SECTOR_COLS = 5;
const GALAXY_NAMES = [
  "Nexus-Alpha", "Cyborg-Beta", "Quantum-Gamma", "Andromeda-Prime", "Sirius-Delta",
  "Lyra-Epsilon", "Orion-Zeta", "Taurus-Eta", "Pegasus-Theta", "Vela-Iota",
];

function sectorNumFromGrid(row: number, col: number): number {
  return (row - 1) * SECTOR_COLS + col;
}

interface Planet {
  id: string; name: string; class: string; owner?: string; alliance?: string; coordinates: string;
  type?: string; temperature?: number; gravity?: number; resources?: string[]; habitable?: boolean;
}

interface System {
  id: string; name: string; coordinates: string; planetCount: number; habitableCount: number;
  activity: number; starType: string;
}

interface RealmServer {
  id: string; name: string; slug: string; region: "NA" | "EU" | "APAC";
  status: "online" | "maintenance" | "degraded";
  playersOnline: number; maxPlayers: number; tickRateMs: number; uptimePercent: number; universes: string[];
}

interface RealmResponse {
  realms: RealmServer[]; selectedRealmId: string; selectedRealm: RealmServer;
}

interface SeedConfigResponse {
  selected: { seed: string };
  limits: { galaxies: number; sectorsPerGalaxy: number; systemsPerSector: number; };
}

interface SectorPreviewSystem {
  system: number; starType: string; planetCount: number;
  habitableCount: number; anomalyScore: number;
}

interface SectorPreviewResponse {
  preview: { coordinates: { galaxy: number; sector: number }; systems: SectorPreviewSystem[]; };
}

interface SystemDetailResponse {
  generated: {
    coordinates: { galaxy: number; sector: number; system: number };
    star: { type: string; name: string };
    planets: Array<{
      orbit: number; type: string; class: string; habitable: boolean;
      temperature: number; resources: string[]; hasMoon: boolean;
      diameter: number; gravity: number; atmosphere: string;
    }>;
  };
}

const ACTIVITY_LEVELS = [
  { min: 0, label: "Quiet", color: "text-green-400", bar: "bg-green-500" },
  { min: 30, label: "Moderate", color: "text-yellow-400", bar: "bg-yellow-500" },
  { min: 60, label: "Active", color: "text-orange-400", bar: "bg-orange-500" },
  { min: 85, label: "Critical", color: "text-red-400", bar: "bg-red-500" },
];

function getActivityLevel(activity: number) {
  return ACTIVITY_LEVELS.slice().reverse().find(l => activity >= l.min) || ACTIVITY_LEVELS[0];
}

function getPlanetColor(planetClass: string) {
  const colors: Record<string, string> = { M: "bg-emerald-500", G: "bg-amber-400", D: "bg-slate-400", R: "bg-orange-600", V: "bg-yellow-500", T: "bg-cyan-500", A: "bg-gray-300" };
  return colors[planetClass] || "bg-blue-400";
}

const PLANET_TYPE_LABEL: Record<string, string> = {
  rocky: "Rocky", gas_giant: "Gas Giant", ice_giant: "Ice Giant",
  desert: "Desert", ocean: "Ocean", volcanic: "Volcanic",
  frozen: "Frozen", terran: "Terran", barren: "Barren", toxic: "Toxic",
};

const CLASS_COLORS: Record<string, string> = {
  M: "bg-emerald-500/20 border-emerald-500/40 text-emerald-300",
  G: "bg-amber-400/20 border-amber-400/40 text-amber-300",
  D: "bg-slate-400/20 border-slate-400/40 text-slate-300",
  R: "bg-orange-600/20 border-orange-600/40 text-orange-300",
  V: "bg-yellow-500/20 border-yellow-500/40 text-yellow-300",
  T: "bg-cyan-500/20 border-cyan-500/40 text-cyan-300",
  A: "bg-gray-300/20 border-gray-300/40 text-gray-300",
};

export default function Universe() {
  const { toast } = useToast();
  const [selectedGalaxyIdx, setSelectedGalaxyIdx] = useState(0);
  const [selectedSectorRow, setSelectedSectorRow] = useState(3);
  const [selectedSectorCol, setSelectedSectorCol] = useState(3);
  const [selectedSystemNum, setSelectedSystemNum] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { data: realmData } = useQuery<RealmResponse>({
    queryKey: ["/api/universe/realms"],
    queryFn: async () => {
      const res = await fetch("/api/universe/realms", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load realm servers");
      return res.json();
    },
  });

  const { data: seedConfig } = useQuery<SeedConfigResponse>({
    queryKey: ["/api/universe/seed/config"],
    queryFn: async () => {
      const res = await fetch("/api/universe/seed/config", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load seed config");
      return res.json();
    },
  });

  const selectedRealmId = realmData?.selectedRealmId || "nexus-alpha";
  const selectedRealm = realmData?.selectedRealm;
  const galaxyCount = Math.min(seedConfig?.limits.galaxies ?? 256, 10);
  const currentGalaxyNum = selectedGalaxyIdx + 1;
  const selectedSectorNum = sectorNumFromGrid(selectedSectorRow, selectedSectorCol);

  const selectRealmMutation = useMutation({
    mutationFn: async (realmId: string) => {
      const res = await apiRequest("POST", "/api/universe/realms/select", { realmId });
      return res.json();
    },
    onSuccess: (data: RealmResponse) => {
      queryClient.setQueryData<RealmResponse>(["/api/universe/realms"], (current) => ({
        realms: current?.realms || data.realms || [],
        selectedRealmId: data.selectedRealmId,
        selectedRealm: data.selectedRealm,
      }));
      toast({ title: "Realm switched", description: "Universe server realm updated." });
    },
    onError: (error: any) => {
      toast({ title: "Realm switch failed", description: error?.message || "Unknown error", variant: "destructive" });
    },
  });

  const { data: sectorData, isFetching: sectorLoading } = useQuery<SectorPreviewResponse>({
    queryKey: ["/api/universe/seed/sector", currentGalaxyNum, selectedSectorNum],
    queryFn: async () => {
      const res = await fetch(`/api/universe/seed/sector/${currentGalaxyNum}/${selectedSectorNum}?limit=25`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load sector data");
      return res.json();
    },
    enabled: currentGalaxyNum > 0 && selectedSectorNum > 0,
  });

  const { data: systemDetail } = useQuery<SystemDetailResponse>({
    queryKey: ["/api/universe/seed/system", currentGalaxyNum, selectedSectorNum, selectedSystemNum],
    queryFn: async () => {
      const res = await fetch(`/api/universe/seed/system/${currentGalaxyNum}/${selectedSectorNum}/${selectedSystemNum}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load system details");
      return res.json();
    },
    enabled: currentGalaxyNum > 0 && selectedSectorNum > 0 && selectedSystemNum !== null,
  });

  const systems: System[] = useMemo(() => {
    if (!sectorData?.preview?.systems) return [];
    return sectorData.preview.systems.map(sys => ({
      id: `sys-${sys.system}`,
      name: `System ${currentGalaxyNum}-${selectedSectorNum}.${sys.system}`,
      coordinates: `[${currentGalaxyNum}:${selectedSectorNum}:${sys.system}]`,
      planetCount: sys.planetCount,
      habitableCount: sys.habitableCount,
      activity: Math.round((1 - sys.anomalyScore / 100) * 100),
      starType: sys.starType,
    }));
  }, [sectorData, currentGalaxyNum, selectedSectorNum]);

  const averageActivity = systems.length > 0
    ? Math.round(systems.reduce((sum, s) => sum + s.activity, 0) / systems.length)
    : 0;

  const searchedSystem = useMemo(() => {
    if (!searchQuery.trim()) return null;
    return systems.find(s => s.coordinates.includes(searchQuery) || s.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [searchQuery, systems]);

  const handleSectorClick = (row: number, col: number) => {
    setSelectedSectorRow(row);
    setSelectedSectorCol(col);
    setSelectedSystemNum(null);
  };

  const detailPlanets = systemDetail?.generated?.planets;

  const renderSystemGrid = () => {
    if (!systems.length) return null;
    const gridSize = Math.ceil(Math.sqrt(systems.length));
    const grid: (System | null)[][] = [];
    let idx = 0;
    for (let r = 0; r < gridSize; r++) {
      const row: (System | null)[] = [];
      for (let c = 0; c < gridSize; c++) {
        row.push(systems[idx] || null);
        idx++;
      }
      grid.push(row);
    }
    return grid;
  };

  const systemGrid = renderSystemGrid();

  return (
    <GameLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="relative rounded-xl overflow-hidden shadow-lg" style={{ minHeight: 120 }}>
          <img src="/assets/backgrounds/galaxy_map.png" alt="" className="absolute inset-0 w-full h-full object-cover" onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/65 to-transparent" />
          <div className="relative z-10 p-6 flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500/30 to-purple-500/30 border border-blue-400/30 flex items-center justify-center">
              <Globe className="w-8 h-8 text-blue-300" />
            </div>
            <div>
              <h1 className="text-3xl font-orbitron font-bold text-white">Universe Map</h1>
              <p className="text-slate-400 font-rajdhani text-lg">Coordinate grid navigation across galaxies, sectors, and planetary systems</p>
            </div>
          </div>
        </div>

        <Card className="bg-slate-800/40 border-slate-700">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-slate-400 uppercase tracking-wide">Realm</label>
                <Select value={selectedRealmId} onValueChange={v => selectRealmMutation.mutate(v)}>
                  <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                    <SelectValue placeholder="Select Realm" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600 text-white">
                    {(realmData?.realms || []).map(r => (
                      <SelectItem key={r.id} value={r.slug || r.id}>{r.name} · {r.region}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-400 uppercase tracking-wide">Galaxy</label>
                <Select value={String(currentGalaxyNum)} onValueChange={v => { setSelectedGalaxyIdx(parseInt(v) - 1); setSelectedSystemNum(null); }}>
                  <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600 text-white">
                    {Array.from({ length: galaxyCount }, (_, i) => (
                      <SelectItem key={i + 1} value={String(i + 1)}>
                        {GALAXY_NAMES[i] || `Galaxy ${i + 1}`} [{i + 1}:0:0]
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1 lg:col-span-2">
                <label className="text-xs text-slate-400 uppercase tracking-wide">Search Coordinates / System</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <Input
                    placeholder="e.g. [1:2:3] or system name"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="bg-slate-800 border-slate-600 text-white pl-10"
                  />
                </div>
              </div>
            </div>

            {selectedRealm && (
              <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-slate-400">
                <div className="bg-slate-800/60 rounded p-2 border border-slate-700">Region: <span className="font-semibold text-white">{selectedRealm.region}</span></div>
                <div className="bg-slate-800/60 rounded p-2 border border-slate-700">Players: <span className="font-semibold text-white">{(selectedRealm.playersOnline ?? 0).toLocaleString()} / {(selectedRealm.maxPlayers ?? 0).toLocaleString()}</span></div>
                <div className="bg-slate-800/60 rounded p-2 border border-slate-700">Tick: <span className="font-semibold text-white">{selectedRealm.tickRateMs}ms</span></div>
                <div className="bg-slate-800/60 rounded p-2 border border-slate-700">Status: <span className={`font-semibold uppercase ${selectedRealm.status === "online" ? "text-green-400" : "text-red-400"}`}>{selectedRealm.status}</span></div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-slate-800/30 border-slate-700">
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold text-white">{galaxyCount}</div>
              <div className="text-xs text-slate-400">Galaxies</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/30 border-slate-700">
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold text-blue-400">{SECTOR_ROWS * SECTOR_COLS}</div>
              <div className="text-xs text-slate-400">Sectors in view</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/30 border-slate-700">
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold text-green-400">{sectorLoading ? "..." : systems.length}</div>
              <div className="text-xs text-slate-400">Star Systems</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/30 border-slate-700">
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold text-amber-400">{sectorLoading ? "..." : `${averageActivity}%`}</div>
              <div className="text-xs text-slate-400">Avg Activity</div>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Layers className="w-4 h-4" />
            <span>Galaxy {currentGalaxyNum} · Sector {selectedSectorNum}</span>
          </div>
          <div className="flex gap-1">
            <Button variant={viewMode === "grid" ? "default" : "ghost"} size="sm" className="text-xs" onClick={() => setViewMode("grid")}>
              <Grid3x3 className="w-4 h-4 mr-1" /> Grid
            </Button>
            <Button variant={viewMode === "list" ? "default" : "ghost"} size="sm" className="text-xs" onClick={() => setViewMode("list")}>
              <Layers className="w-4 h-4 mr-1" /> List
            </Button>
          </div>
        </div>

        {searchQuery.trim() && searchedSystem && (
          <Card className="bg-indigo-900/30 border-indigo-700/50">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Star className="w-5 h-5 text-indigo-400" />
                <div>
                  <span className="text-white font-semibold">{searchedSystem.name}</span>
                  <span className="text-slate-400 text-sm ml-2">{searchedSystem.coordinates}</span>
                </div>
              </div>
              <Button size="sm" variant="outline" className="border-indigo-600 text-indigo-300" onClick={() => { setSelectedSystemNum(parseInt(searchedSystem.id.split("-").pop() || "1")); setSearchQuery(""); }}>
                View
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <div className="xl:col-span-1 space-y-4">
            <Card className="bg-slate-800/30 border-slate-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-white flex items-center gap-2">
                  <Grid3x3 className="w-4 h-4 text-slate-400" />
                  Sectors
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">Galaxy {currentGalaxyNum} · {SECTOR_ROWS}x{SECTOR_COLS} grid</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-1">
                  {Array.from({ length: SECTOR_ROWS * SECTOR_COLS }, (_, i) => {
                    const r = Math.floor(i / SECTOR_COLS) + 1;
                    const c = (i % SECTOR_COLS) + 1;
                    const secNum = sectorNumFromGrid(r, c);
                    const isSelected = r === selectedSectorRow && c === selectedSectorCol;
                    return (
                      <button
                        key={`${r}-${c}`}
                        onClick={() => handleSectorClick(r, c)}
                        className={`aspect-square rounded text-[9px] font-mono font-bold flex items-center justify-center transition-all border ${
                          isSelected
                            ? "bg-blue-600/40 border-blue-500 text-white ring-1 ring-blue-400"
                            : "bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-700/60 hover:border-slate-600 cursor-pointer"
                        }`}
                        title={`Sector ${secNum} (row ${r}, col ${c})`}
                      >
                        {secNum}
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {viewMode === "list" && (
              <Card className="bg-slate-800/30 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-white flex items-center gap-2">
                    <Orbit className="w-4 h-4 text-slate-400" />
                    Systems
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500">Sector {selectedSectorNum}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-1 max-h-60 overflow-y-auto">
                  {systems.map(sys => (
                    <Button
                      key={sys.id}
                      variant={selectedSystemNum === parseInt(sys.id.split("-").pop() || "0") ? "default" : "ghost"}
                      size="sm"
                      className="w-full justify-start text-left text-xs h-auto py-2"
                      onClick={() => setSelectedSystemNum(parseInt(sys.id.split("-").pop() || "1"))}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="truncate">{sys.name}</span>
                        <Badge variant="outline" className={`text-[10px] ${getActivityLevel(sys.activity).color}`}>{sys.activity}%</Badge>
                      </div>
                    </Button>
                  ))}
                </CardContent>
              </Card>
            )}

            <Card className="bg-slate-800/30 border-slate-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-white">Sector {selectedSectorNum}</CardTitle>
                <CardDescription className="text-xs text-slate-500">Row {selectedSectorRow} · Col {selectedSectorCol} · Galaxy {currentGalaxyNum}</CardDescription>
              </CardHeader>
              <CardContent className="text-xs text-slate-400 space-y-1">
                <div className="flex justify-between"><span>Systems</span><span className="text-white">{systems.length}</span></div>
                <div className="flex justify-between"><span>Total Planets</span><span className="text-white">{systems.reduce((sum, s) => sum + s.planetCount, 0)}</span></div>
                <div className="flex justify-between"><span>Avg Activity</span><span className={`${getActivityLevel(averageActivity).color}`}>{averageActivity}%</span></div>
              </CardContent>
            </Card>
          </div>

          <div className="xl:col-span-3 space-y-6">
            <Card className="bg-slate-800/30 border-slate-700">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm text-white flex items-center gap-2">
                    <Hexagon className="w-4 h-4 text-slate-400" />
                    Sector {selectedSectorNum} — System Grid
                  </CardTitle>
                  <Badge variant="outline" className="text-xs text-slate-400 border-slate-600">
                    {systems.length} systems
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {sectorLoading ? (
                  <div className="py-12 text-center text-slate-500 text-sm">Loading systems...</div>
                ) : systemGrid ? (
                  <div className="space-y-2">
                    {systemGrid.map((row, ri) => (
                      <div key={ri} className="flex gap-2 justify-center">
                        {row.map((sys, ci) => {
                          if (!sys) return <div key={`empty-${ci}`} className="w-24 h-24 rounded-lg bg-slate-900/30 border border-dashed border-slate-800" />;
                          const level = getActivityLevel(sys.activity);
                          const isSelected = selectedSystemNum === parseInt(sys.id.split("-").pop() || "0");
                          return (
                            <button
                              key={sys.id}
                              onClick={() => setSelectedSystemNum(parseInt(sys.id.split("-").pop() || "1"))}
                              className={`w-24 h-24 rounded-lg border p-2 flex flex-col items-center justify-center text-center transition-all ${
                                isSelected
                                  ? "bg-blue-600/30 border-blue-500 ring-1 ring-blue-400"
                                  : "bg-slate-800/50 border-slate-700 hover:bg-slate-700/50 hover:border-slate-600"
                              }`}
                            >
                              <Star className={`w-5 h-5 mb-1 ${sys.activity > 50 ? "text-yellow-400" : "text-slate-500"}`} />
                              <div className="text-[10px] font-semibold text-white leading-tight truncate w-full">{sys.name.split(" ").slice(-1)[0]}</div>
                              <div className={`text-[9px] font-mono ${level.color}`}>{sys.activity}%</div>
                              <div className="text-[8px] text-slate-500">{sys.planetCount}pl</div>
                            </button>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center text-slate-500 text-sm">No systems in this sector.</div>
                )}
              </CardContent>
            </Card>

            {selectedSystemNum !== null && detailPlanets && (
              <Card className="bg-slate-800/30 border-slate-700">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500/30 to-orange-500/30 border border-yellow-500/40 flex items-center justify-center">
                        <Star className="w-5 h-5 text-yellow-400" />
                      </div>
                      <div>
                        <CardTitle className="text-white text-sm">{systemDetail?.generated?.star?.name || `System ${selectedSystemNum}`}</CardTitle>
                        <CardDescription className="text-xs text-slate-400">
                          [{currentGalaxyNum}:{selectedSectorNum}:{selectedSystemNum}] · {systemDetail?.generated?.star?.type} star
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-20 bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500" style={{ width: `${Math.min(100, averageActivity)}%` }} />
                      </div>
                      <span className="text-xs font-mono font-bold text-green-400">{averageActivity}%</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                    {detailPlanets.map((planet) => (
                      <div key={planet.orbit} className="bg-slate-800/50 border border-slate-700 rounded-lg p-2 hover:border-slate-600 transition-colors">
                        <div className="flex items-center gap-2 mb-1">
                          <div className={`w-3 h-3 rounded-full ${getPlanetColor(planet.class)}`} />
                          <span className="text-xs font-semibold text-white truncate">Pos {planet.orbit}</span>
                        </div>
                        <Badge variant="outline" className={`text-[10px] ${CLASS_COLORS[planet.class] || CLASS_COLORS.M}`}>{planet.class}-Class</Badge>
                        <div className="text-[9px] text-slate-500 mt-1">
                          {PLANET_TYPE_LABEL[planet.type] || planet.type}
                          {planet.habitable && <span className="text-green-400 ml-1">✓</span>}
                        </div>
                        <div className="text-[9px] text-slate-500">{planet.temperature}K · {planet.gravity}g</div>
                        {planet.hasMoon && <div className="text-[9px] text-slate-400">🌙 moon</div>}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {selectedSystemNum !== null && detailPlanets && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-3 text-center">
                  <div className="text-xs text-slate-400">Planets</div>
                  <div className="text-lg font-bold text-white">{detailPlanets.length}</div>
                </div>
                <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-3 text-center">
                  <div className="text-xs text-slate-400">Habitable</div>
                  <div className="text-lg font-bold text-green-400">{detailPlanets.filter(p => p.habitable).length}</div>
                </div>
                <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-3 text-center">
                  <div className="text-xs text-slate-400">With Moon</div>
                  <div className="text-lg font-bold text-slate-400">{detailPlanets.filter(p => p.hasMoon).length}</div>
                </div>
                <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-3 text-center">
                  <div className="text-xs text-slate-400">Activity</div>
                  <div className="text-lg font-bold text-green-400">{averageActivity}%</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </GameLayout>
  );
}
