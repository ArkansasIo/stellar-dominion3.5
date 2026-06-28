import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import GameLayout from "@/components/layout/GameLayout";
import { TECH_BRANCH_ASSETS } from "@shared/config";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import {
  FileText, Globe, Layers, Moon, Settings2, Search, Rocket,
  Pickaxe, Shield, Eye, ChevronRight, MapPin, Star, Zap,
  ArrowUpRight, Info, Hammer, RotateCcw
} from "lucide-react";
import { Link } from "wouter";
import {
  applyManagementProfile,
  ColonyManagementProfile,
  COLONIES_PER_PAGE,
  getEmpireColoniesPage,
  getSystemOverview,
  TOTAL_COLONY_PAGES,
} from "@/lib/colonySystems";

const TEMP_THEME_IMAGE = "/theme-temp.png";

type PlanetTypeRecord = {
  id: string;
  name: string;
  family: string;
  class: string;
  rarity: string;
  description: string;
  stats: {
    habitabilityIndex: number;
    metalRichness: number;
    crystalRichness: number;
    deuteriumRichness: number;
    temperature: number;
    gravity: number;
    atmosphere: string;
    radiation: number;
    waterCoverage: number;
    biomeDiversity: number;
    strategicValue: number;
    defenseRating: number;
  };
};

type PlanetResponse = {
  count: number;
  planets: PlanetTypeRecord[];
};

type TravelStateResponse = {
  travelState: { activeRoute: any; discoveredWormholes: string[] };
  travelLog: Array<{ id: string; createdAt: string; route: any }>;
  knownPlanets: string[];
};

export default function EmpirePlanetViewer() {
  const [rarityFilter, setRarityFilter] = useState("all");
  const [classFilter, setClassFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [selectedColonyId, setSelectedColonyId] = useState("");
  const [scope, setScope] = useState<"individual" | "page" | "all">("individual");
  const [profile, setProfile] = useState<ColonyManagementProfile>("balanced");
  const [profileOverrides, setProfileOverrides] = useState<Record<string, ColonyManagementProfile>>({});
  const [globalProfile, setGlobalProfile] = useState<ColonyManagementProfile | null>(null);
  const [expandedPlanet, setExpandedPlanet] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const planetsQuery = useQuery<PlanetResponse>({
    queryKey: ["planet-types"],
    queryFn: async () => {
      const res = await fetch("/api/planets/types", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load planet types");
      return res.json();
    },
  });

  const travelStateQuery = useQuery<TravelStateResponse>({
    queryKey: ["travel-player-state"],
    queryFn: async () => {
      const res = await fetch("/api/travel/player/state", { credentials: "include" });
      if (!res.ok) return { travelState: { activeRoute: null, discoveredWormholes: [] }, travelLog: [], knownPlanets: [] };
      return res.json();
    },
    retry: false,
    staleTime: 60000,
  });

  const colonizeMutation = useMutation({
    mutationFn: async (planetId: string) => {
      const res = await fetch("/api/planets/colonize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ planetType: planetId }),
      });
      if (!res.ok) throw new Error("Colonization failed");
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Colonization Started", description: "Colony ship dispatched successfully." });
      queryClient.invalidateQueries({ queryKey: ["planet-types"] });
    },
    onError: (err: Error) => {
      toast({ title: "Colonization Failed", description: err.message, variant: "destructive" });
    },
  });

  const scanMutation = useMutation({
    mutationFn: async (planetId: string) => {
      const res = await fetch("/api/espionage/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ targetId: planetId, scanType: "planetary" }),
      });
      if (!res.ok) throw new Error("Scan failed");
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Scan Complete", description: "Planetary intelligence gathered." });
    },
    onError: (err: Error) => {
      toast({ title: "Scan Failed", description: err.message, variant: "destructive" });
    },
  });

  const extractMutation = useMutation({
    mutationFn: async (planetId: string) => {
      const res = await fetch("/api/planets/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ planetId, resourceType: "metal" }),
      });
      if (!res.ok) throw new Error("Extraction failed");
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Extraction Complete", description: "Resources extracted from the planet." });
      queryClient.invalidateQueries({ queryKey: ["player-state"] });
    },
    onError: (err: Error) => {
      toast({ title: "Extraction Failed", description: err.message, variant: "destructive" });
    },
  });

  const filteredPlanets = useMemo(() => {
    const planets = planetsQuery.data?.planets || [];
    return planets.filter(p => {
      const rarityMatch = rarityFilter === "all" || p.rarity === rarityFilter;
      const classMatch = classFilter === "all" || p.class === classFilter;
      return rarityMatch && classMatch;
    });
  }, [planetsQuery.data?.planets, rarityFilter, classFilter]);

  const classes = useMemo(() => {
    const set = new Set<string>();
    (planetsQuery.data?.planets || []).forEach(p => set.add(p.class));
    return Array.from(set).sort();
  }, [planetsQuery.data?.planets]);

  const stats = useMemo(() => {
    return filteredPlanets.reduce(
      (acc, planet) => ({
        habitability: acc.habitability + planet.stats.habitabilityIndex,
        metal: acc.metal + planet.stats.metalRichness,
        crystal: acc.crystal + planet.stats.crystalRichness,
        deuterium: acc.deuterium + planet.stats.deuteriumRichness,
        temperature: acc.temperature + planet.stats.temperature,
        gravity: acc.gravity + planet.stats.gravity,
        radiation: acc.radiation + planet.stats.radiation,
        waterCoverage: acc.waterCoverage + planet.stats.waterCoverage,
        biomeDiversity: acc.biomeDiversity + planet.stats.biomeDiversity,
        strategicValue: acc.strategicValue + planet.stats.strategicValue,
        defenseRating: acc.defenseRating + planet.stats.defenseRating,
      }),
      { habitability: 0, metal: 0, crystal: 0, deuterium: 0, temperature: 0, gravity: 0, radiation: 0, waterCoverage: 0, biomeDiversity: 0, strategicValue: 0, defenseRating: 0 },
    );
  }, [filteredPlanets]);

  const avgHabitability = filteredPlanets.length
    ? Math.round(stats.habitability / filteredPlanets.length)
    : 0;

  const avgTemperature = filteredPlanets.length
    ? Math.round(stats.temperature / filteredPlanets.length)
    : 0;

  const avgGravity = filteredPlanets.length
    ? (stats.gravity / filteredPlanets.length).toFixed(2)
    : "0.00";

  const avgWaterCoverage = filteredPlanets.length
    ? Math.round(stats.waterCoverage / filteredPlanets.length)
    : 0;

  const avgBiomeDiversity = filteredPlanets.length
    ? Math.round(stats.biomeDiversity / filteredPlanets.length)
    : 0;

  const avgStrategicValue = filteredPlanets.length
    ? Math.round(stats.strategicValue / filteredPlanets.length)
    : 0;

  const avgDefenseRating = filteredPlanets.length
    ? Math.round(stats.defenseRating / filteredPlanets.length)
    : 0;

  const pageData = useMemo(() => getEmpireColoniesPage(page, COLONIES_PER_PAGE), [page]);
  const effectiveColonies = useMemo(
    () =>
      pageData.items.map((item) => {
        const active = profileOverrides[item.id] || globalProfile || "balanced";
        return applyManagementProfile(item, active);
      }),
    [globalProfile, pageData.items, profileOverrides],
  );

  const selectedColony = useMemo(() => {
    if (!selectedColonyId) return effectiveColonies[0] || null;
    return effectiveColonies.find((item) => item.id === selectedColonyId) || effectiveColonies[0] || null;
  }, [effectiveColonies, selectedColonyId]);

  const systemBodies = useMemo(() => (selectedColony ? getSystemOverview(selectedColony) : []), [selectedColony]);

  const applyViewerProfile = () => {
    if (scope === "individual") {
      if (!selectedColony) return;
      setProfileOverrides((current) => ({ ...current, [selectedColony.id]: profile }));
      toast({ title: "Profile Applied", description: `Applied ${profile} profile to ${selectedColony.name}.` });
      return;
    }
    if (scope === "page") {
      const updates: Record<string, ColonyManagementProfile> = {};
      for (const item of effectiveColonies) updates[item.id] = profile;
      setProfileOverrides((current) => ({ ...current, ...updates }));
      toast({ title: "Profile Applied", description: `Applied ${profile} profile to ${effectiveColonies.length} colonies.` });
      return;
    }
    setGlobalProfile(profile);
    setProfileOverrides({});
    toast({ title: "Global Profile Applied", description: `Applied ${profile} profile to all colonies.` });
  };

  const getRarityBadgeClass = (rarity: string) => {
    switch (rarity) {
      case "legendary": return "bg-amber-100 text-amber-800 border-amber-200";
      case "epic": return "bg-purple-100 text-purple-800 border-purple-200";
      case "rare": return "bg-blue-100 text-blue-800 border-blue-200";
      case "uncommon": return "bg-emerald-100 text-emerald-800 border-emerald-200";
      default: return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const getHabitabilityColor = (val: number) => {
    if (val >= 70) return "text-emerald-700";
    if (val >= 40) return "text-amber-700";
    return "text-red-600";
  };

  return (
    <GameLayout>
      <div className="space-y-6 animate-in fade-in duration-500" data-testid="empire-planet-viewer">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-3xl font-orbitron font-bold text-slate-900 flex items-center gap-2">
              <Globe className="w-8 h-8 text-primary" />
              Empire Planets
            </h1>
            <p className="text-muted-foreground font-rajdhani text-lg mt-1">
              Planet catalog, colonization, and interstellar reconnaissance.
            </p>
          </div>
          <div className="text-right text-sm text-slate-500">
            <div className="font-mono">{new Date().toLocaleTimeString()}</div>
            <div className="text-xs">{new Date().toLocaleDateString()}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-orange-600 uppercase tracking-wider">Avg Temperature</div>
                  <div className="text-2xl font-orbitron font-bold text-orange-900">{avgTemperature}°C</div>
                  <div className="text-[10px] text-orange-600 mt-1">Climate stability index</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-600 text-xs font-bold">
                  TEMP
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-indigo-600 uppercase tracking-wider">Avg Gravity</div>
                  <div className="text-2xl font-orbitron font-bold text-indigo-900">{avgGravity}g</div>
                  <div className="text-[10px] text-indigo-600 mt-1">Surface gravity force</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-600 text-xs font-bold">
                  GRAV
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-cyan-50 to-cyan-100 border-cyan-200 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-cyan-600 uppercase tracking-wider">Water Coverage</div>
                  <div className="text-2xl font-orbitron font-bold text-cyan-900">{avgWaterCoverage}%</div>
                  <div className="text-[10px] text-cyan-600 mt-1">Hydrological potential</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-600 text-xs font-bold">
                  H2O
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-rose-50 to-rose-100 border-rose-200 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-rose-600 uppercase tracking-wider">Biome Diversity</div>
                  <div className="text-2xl font-orbitron font-bold text-rose-900">{avgBiomeDiversity}</div>
                  <div className="text-[10px] text-rose-600 mt-1">Ecosystem variety index</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-600 text-xs font-bold">
                  BIO
                </div>
              </div>
            </CardContent>
          </Card>
        </div>


        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-400" /> Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 pb-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="space-y-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Rarity</span>
                <select className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm" value={rarityFilter} onChange={(e) => setRarityFilter(e.target.value)}>
                  <option value="all">All</option>
                  <option value="common">Common</option>
                  <option value="uncommon">Uncommon</option>
                  <option value="rare">Rare</option>
                  <option value="epic">Epic</option>
                  <option value="legendary">Legendary</option>
                </select>
              </label>
              <label className="space-y-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Class</span>
                <select className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm" value={classFilter} onChange={(e) => setClassFilter(e.target.value)}>
                  <option value="all">All</option>
                  {classes.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </label>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <Settings2 className="w-4 h-4 text-slate-500" /> Colony Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              <select className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm" value={scope} onChange={(e) => setScope(e.target.value as "individual" | "page" | "all")}>
                <option value="individual">Individual</option>
                <option value="page">Page</option>
                <option value="all">All</option>
              </select>
              <select className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm" value={profile} onChange={(e) => setProfile(e.target.value as ColonyManagementProfile)}>
                <option value="balanced">Balanced</option>
                <option value="industry">Industry</option>
                <option value="defense">Defense</option>
                <option value="science">Science</option>
              </select>
              <select className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm" value={selectedColony?.id || ""} onChange={(e) => setSelectedColonyId(e.target.value)}>
                {effectiveColonies.map((colony) => (
                  <option key={colony.id} value={colony.id}>{colony.name} [{colony.coordinates}]</option>
                ))}
              </select>
              <div className="h-10 rounded-md border border-input bg-slate-50 px-3 py-2 text-sm">Page {page.toLocaleString()} / {TOTAL_COLONY_PAGES.toLocaleString()}</div>
              <Button onClick={applyViewerProfile} data-testid="button-apply-viewer-profile">Apply Profile</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={() => setPage(1)} disabled={page === 1}>First</Button>
              <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Prev</Button>
              <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(TOTAL_COLONY_PAGES, p + 1))} disabled={page >= TOTAL_COLONY_PAGES}>Next</Button>
              <Button variant="outline" size="sm" onClick={() => setPage(TOTAL_COLONY_PAGES)} disabled={page >= TOTAL_COLONY_PAGES}>Last</Button>
              <div className="text-xs text-slate-500 self-center">Records {pageData.startIndex + 1}-{pageData.endIndex + 1} of {pageData.totalItems.toLocaleString()} ({COLONIES_PER_PAGE}/page)</div>
            </div>
            {selectedColony && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="rounded border border-slate-200 bg-slate-50 p-3">
                  <div className="text-sm font-semibold text-slate-800 mb-2">Selected Colony Status</div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-white rounded border border-slate-200 px-2 py-1 flex justify-between"><span>Stability</span><span className="font-bold">{selectedColony.planetStatus.stability}%</span></div>
                    <div className="bg-white rounded border border-slate-200 px-2 py-1 flex justify-between"><span>Security</span><span className="font-bold">{selectedColony.planetStatus.security}%</span></div>
                    <div className="bg-white rounded border border-slate-200 px-2 py-1 flex justify-between"><span>Infrastructure</span><span className="font-bold">{selectedColony.planetStatus.infrastructure}%</span></div>
                    <div className="bg-white rounded border border-slate-200 px-2 py-1 flex justify-between"><span>Logistics</span><span className="font-bold">{selectedColony.planetStatus.logistics}%</span></div>
                    <div className="bg-white rounded border border-slate-200 px-2 py-1 flex justify-between"><span>Mining</span><span className="font-bold">{selectedColony.subStats.miningRate}</span></div>
                    <div className="bg-white rounded border border-slate-200 px-2 py-1 flex justify-between"><span>Research</span><span className="font-bold">{selectedColony.subStats.researchOutput}</span></div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" asChild>
                      <Link to={`/planet/${selectedColony.id}`}><Eye className="w-3 h-3 mr-1" /> View Details</Link>
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => extractMutation.mutate(selectedColony.id)} disabled={extractMutation.isPending}>
                      <Pickaxe className="w-3 h-3 mr-1" /> Extract
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => scanMutation.mutate(selectedColony.id)} disabled={scanMutation.isPending}>
                      <Search className="w-3 h-3 mr-1" /> Scan
                    </Button>
                  </div>
                </div>
                <div className="rounded border border-slate-200 bg-slate-50 p-3">
                  <div className="text-sm font-semibold text-slate-800 mb-2">System + Moon Overview</div>
                  <div className="text-xs text-slate-600 mb-2">
                    {selectedColony.solarOverview.galaxy}:{selectedColony.solarOverview.sector}:{selectedColony.solarOverview.system} • Star {selectedColony.solarOverview.starClass}
                  </div>
                  <div className="max-h-40 overflow-y-auto space-y-1">
                    {systemBodies.map((body) => (
                      <div key={`${body.coordinates}-${body.type}`} className="bg-white rounded border border-slate-200 px-2 py-1 text-xs flex justify-between items-center">
                        <span className="flex items-center gap-1">
                          {body.type === "moon" ? <Moon className="w-3 h-3 text-indigo-600" /> : <Layers className="w-3 h-3 text-blue-600" />}
                          {body.type} O{body.orbit}
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="font-mono text-slate-500">{body.coordinates}</span>
                          <Button size="sm" variant="ghost" className="h-5 w-5 p-0" onClick={() => toast({ title: "Moon Details", description: `Details for ${body.type} at ${body.coordinates}` })}>
                            <ChevronRight className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 shadow-sm overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-orbitron text-slate-900">Planet Type Intelligence</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {planetsQuery.isLoading && (
              <div className="px-4 py-8 text-center text-slate-500">Loading empire planetary intelligence...</div>
            )}

            {planetsQuery.isError && (
              <div className="px-4 py-8 text-center text-red-600">Unable to load planet intelligence data.</div>
            )}

            {!planetsQuery.isLoading && !planetsQuery.isError && filteredPlanets.length === 0 && (
              <div className="px-4 py-8 text-center text-slate-500">No planet types match the current filters.</div>
            )}

            {filteredPlanets.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1000px] text-sm">
                   <thead className="bg-slate-50 border-y border-slate-200">
                     <tr>
                       <th className="text-left px-4 py-3 font-bold text-slate-600 uppercase tracking-wider text-xs">Planet</th>
                       <th className="text-left px-4 py-3 font-bold text-slate-600 uppercase tracking-wider text-xs">Family / Class</th>
                       <th className="text-left px-4 py-3 font-bold text-slate-600 uppercase tracking-wider text-xs">Habitability</th>
                       <th className="text-left px-4 py-3 font-bold text-slate-600 uppercase tracking-wider text-xs">Temperature</th>
                       <th className="text-left px-4 py-3 font-bold text-slate-600 uppercase tracking-wider text-xs">Gravity</th>
                       <th className="text-left px-4 py-3 font-bold text-slate-600 uppercase tracking-wider text-xs">Resources (M/C/D)</th>
                       <th className="text-left px-4 py-3 font-bold text-slate-600 uppercase tracking-wider text-xs">Water</th>
                       <th className="text-left px-4 py-3 font-bold text-slate-600 uppercase tracking-wider text-xs">Biomes</th>
                       <th className="text-left px-4 py-3 font-bold text-slate-600 uppercase tracking-wider text-xs">Rarity</th>
                       <th className="text-left px-4 py-3 font-bold text-slate-600 uppercase tracking-wider text-xs">Actions</th>
                     </tr>
                   </thead>
                  <tbody>
                    {filteredPlanets.map((planet) => (
                      <>
                        <tr key={planet.id} className="border-b border-slate-100 hover:bg-slate-50/80 align-top">
                          <td className="px-4 py-3">
                            <div className="font-semibold text-slate-900">{planet.name}</div>
                            <div className="text-xs text-slate-500 mt-1 max-w-[240px] line-clamp-2">{planet.description}</div>
                          </td>
                          <td className="px-4 py-3 text-slate-700">
                            <div>{planet.family}</div>
                            <div className="text-xs text-slate-500 mt-1">Class {planet.class}</div>
                          </td>
                           <td className="px-4 py-3">
                             <span className={`font-mono font-bold ${getHabitabilityColor(planet.stats.habitabilityIndex)}`}>
                               {planet.stats.habitabilityIndex}
                             </span>
                             <div className="text-[10px] text-slate-500 mt-0.5">/100</div>
                           </td>
                           <td className="px-4 py-3">
                             <div className="font-mono font-bold text-orange-700">{planet.stats.temperature}°C</div>
                             <div className="text-[10px] text-slate-500 mt-0.5">Surface temp</div>
                           </td>
                           <td className="px-4 py-3">
                             <div className="font-mono font-bold text-indigo-700">{planet.stats.gravity.toFixed(2)}g</div>
                             <div className="text-[10px] text-slate-500 mt-0.5">Gravity force</div>
                           </td>
                           <td className="px-4 py-3 font-mono text-slate-800">
                             <div className="flex gap-2">
                               <span title="Metal" className="text-blue-700 font-bold">{planet.stats.metalRichness}</span>
                               <span className="text-slate-400">/</span>
                               <span title="Crystal" className="text-purple-700 font-bold">{planet.stats.crystalRichness}</span>
                               <span className="text-slate-400">/</span>
                               <span title="Deuterium" className="text-cyan-700 font-bold">{planet.stats.deuteriumRichness}</span>
                             </div>
                             <div className="text-[10px] text-slate-500 mt-0.5">M/C/D</div>
                           </td>
                           <td className="px-4 py-3">
                             <div className="font-mono font-bold text-cyan-700">{planet.stats.waterCoverage}%</div>
                             <div className="text-[10px] text-slate-500 mt-0.5">Coverage</div>
                           </td>
                           <td className="px-4 py-3">
                             <div className="font-mono font-bold text-rose-700">{planet.stats.biomeDiversity}</div>
                             <div className="text-[10px] text-slate-500 mt-0.5">Types</div>
                           </td>
                          <td className="px-4 py-3">
                            <Badge variant="outline" className={`capitalize ${getRarityBadgeClass(planet.rarity)}`}>
                              {planet.rarity}
                            </Badge>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap gap-1">
                              <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => setExpandedPlanet(expandedPlanet === planet.id ? null : planet.id)}>
                                <Info className="w-3 h-3 mr-1" /> Info
                              </Button>
                              <Button size="sm" variant="ghost" className="h-7 text-xs text-blue-600" onClick={() => scanMutation.mutate(planet.id)} disabled={scanMutation.isPending}>
                                <Search className="w-3 h-3 mr-1" /> Scan
                              </Button>
                              <Button size="sm" variant="ghost" className="h-7 text-xs text-emerald-600" onClick={() => colonizeMutation.mutate(planet.id)} disabled={colonizeMutation.isPending}>
                                <Rocket className="w-3 h-3 mr-1" /> Colonize
                              </Button>
                            </div>
                          </td>
                        </tr>
                         {expandedPlanet === planet.id && (
                           <tr key={`${planet.id}-expanded`}>
                             <td colSpan={10} className="px-4 py-4 bg-slate-50 border-b border-slate-200">
                               <div className="space-y-4">
                                 <div>
                                   <div className="text-sm font-bold text-slate-800 mb-2">Planet Description</div>
                                   <p className="text-xs text-slate-600 leading-relaxed">{planet.description}</p>
                                 </div>

                                 <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                                   <div className="bg-white rounded border border-slate-200 p-3">
                                     <div className="font-bold text-emerald-700 mb-1">Habitability Index</div>
                                     <Progress value={planet.stats.habitabilityIndex} className="h-2" />
                                     <div className="mt-2 text-slate-500">{planet.stats.habitabilityIndex}/100</div>
                                     <div className="text-[10px] text-slate-400 mt-1">Suitability for human colonization</div>
                                   </div>
                                   <div className="bg-white rounded border border-slate-200 p-3">
                                     <div className="font-bold text-blue-700 mb-1">Metal Richness</div>
                                     <Progress value={planet.stats.metalRichness} className="h-2" />
                                     <div className="mt-2 text-slate-500">{planet.stats.metalRichness}/100</div>
                                     <div className="text-[10px] text-slate-400 mt-1">Industrial resource density</div>
                                   </div>
                                   <div className="bg-white rounded border border-slate-200 p-3">
                                     <div className="font-bold text-purple-700 mb-1">Crystal Richness</div>
                                     <Progress value={planet.stats.crystalRichness} className="h-2" />
                                     <div className="mt-2 text-slate-500">{planet.stats.crystalRichness}/100</div>
                                     <div className="text-[10px] text-slate-400 mt-1">Rare mineral abundance</div>
                                   </div>
                                   <div className="bg-white rounded border border-slate-200 p-3">
                                     <div className="font-bold text-cyan-700 mb-1">Deuterium Richness</div>
                                     <Progress value={planet.stats.deuteriumRichness} className="h-2" />
                                     <div className="mt-2 text-slate-500">{planet.stats.deuteriumRichness}/100</div>
                                     <div className="text-[10px] text-slate-400 mt-1">Fusion fuel potential</div>
                                   </div>
                                   <div className="bg-white rounded border border-slate-200 p-3">
                                     <div className="font-bold text-orange-700 mb-1">Temperature</div>
                                     <div className="text-lg font-bold text-orange-900">{planet.stats.temperature}°C</div>
                                     <div className="text-[10px] text-slate-400 mt-1">Average surface temperature</div>
                                   </div>
                                   <div className="bg-white rounded border border-slate-200 p-3">
                                     <div className="font-bold text-indigo-700 mb-1">Gravity</div>
                                     <div className="text-lg font-bold text-indigo-900">{planet.stats.gravity.toFixed(2)}g</div>
                                     <div className="text-[10px] text-slate-400 mt-1">Surface gravity force</div>
                                   </div>
                                   <div className="bg-white rounded border border-slate-200 p-3">
                                     <div className="font-bold text-cyan-700 mb-1">Water Coverage</div>
                                     <div className="text-lg font-bold text-cyan-900">{planet.stats.waterCoverage}%</div>
                                     <div className="text-[10px] text-slate-400 mt-1">Hydrological coverage</div>
                                   </div>
                                   <div className="bg-white rounded border border-slate-200 p-3">
                                     <div className="font-bold text-rose-700 mb-1">Biome Diversity</div>
                                     <div className="text-lg font-bold text-rose-900">{planet.stats.biomeDiversity}</div>
                                     <div className="text-[10px] text-slate-400 mt-1">Ecosystem variety</div>
                                   </div>
                                   <div className="bg-white rounded border border-slate-200 p-3">
                                     <div className="font-bold text-amber-700 mb-1">Strategic Value</div>
                                     <div className="text-lg font-bold text-amber-900">{planet.stats.strategicValue}/100</div>
                                     <div className="text-[10px] text-slate-400 mt-1">Military & economic importance</div>
                                   </div>
                                   <div className="bg-white rounded border border-slate-200 p-3">
                                     <div className="font-bold text-slate-700 mb-1">Defense Rating</div>
                                     <div className="text-lg font-bold text-slate-900">{planet.stats.defenseRating}/100</div>
                                     <div className="text-[10px] text-slate-400 mt-1">Natural fortification score</div>
                                   </div>
                                   <div className="bg-white rounded border border-slate-200 p-3">
                                     <div className="font-bold text-violet-700 mb-1">Atmosphere</div>
                                     <div className="text-sm font-bold text-violet-900">{planet.stats.atmosphere}</div>
                                     <div className="text-[10px] text-slate-400 mt-1">Primary atmospheric composition</div>
                                   </div>
                                   <div className="bg-white rounded border border-slate-200 p-3">
                                     <div className="font-bold text-red-700 mb-1">Radiation</div>
                                     <div className="text-lg font-bold text-red-900">{planet.stats.radiation} mSv</div>
                                     <div className="text-[10px] text-slate-400 mt-1">Background radiation level</div>
                                   </div>
                                 </div>

                                 <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
                                   <div className="text-xs font-bold text-blue-900 mb-1">Colonization Assessment</div>
                                   <div className="text-xs text-blue-700">
                                     {planet.stats.habitabilityIndex >= 70 && planet.stats.waterCoverage >= 50
                                       ? "Excellent colonization candidate. High habitability and water resources support large populations."
                                       : planet.stats.habitabilityIndex >= 50
                                         ? "Moderate colonization potential. Requires terraforming or specialized habitats."
                                         : "Challenging environment. Advanced life support systems required for permanent settlement."}
                                   </div>
                                 </div>

                                 <div className="mt-3 p-4 bg-slate-50 border border-slate-200 rounded">
                                   <div className="text-sm font-bold text-slate-800 mb-2">About Planet Statistics</div>
                                   <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-600">
                                     <div>
                                       <div className="font-bold text-slate-700 mb-1">Habitability Index (0-100)</div>
                                       <p className="text-slate-600">Measures overall suitability for human colonization. Factors include temperature range, atmospheric composition, water availability, and radiation levels. Higher values indicate less terraforming required.</p>
                                     </div>
                                     <div>
                                       <div className="font-bold text-blue-700 mb-1">Resource Richness (0-100)</div>
                                       <p className="text-slate-600">Metal, Crystal, and Deuterium values represent resource density. Higher values mean more efficient extraction and greater long-term economic value. Deuterium is critical for fusion reactors and FTL fuel.</p>
                                     </div>
                                     <div>
                                       <div className="font-bold text-orange-700 mb-1">Temperature & Gravity</div>
                                       <p className="text-slate-600">Surface temperature affects infrastructure costs and life support requirements. Gravity influences construction, transportation, and human physiological adaptation. Standard Earth gravity is 1.0g.</p>
                                     </div>
                                     <div>
                                       <div className="font-bold text-cyan-700 mb-1">Water Coverage & Biomes</div>
                                       <p className="text-slate-600">Water coverage percentage indicates hydrological potential for agriculture and industry. Biome diversity represents ecosystem variety, which correlates with biological resources and research opportunities.</p>
                                     </div>
                                     <div>
                                       <div className="font-bold text-amber-700 mb-1">Strategic Value (0-100)</div>
                                       <p className="text-slate-600">Combined military and economic importance. Factors include location, resources, defensibility, and infrastructure potential. High-value planets are priority targets for expansion and defense.</p>
                                     </div>
                                     <div>
                                       <div className="font-bold text-slate-700 mb-1">Defense Rating (0-100)</div>
                                       <p className="text-slate-600">Natural fortification score based on terrain, atmospheric conditions, and strategic positioning. Higher ratings reduce invasion success rates and provide defensive bonuses during combat.</p>
                                     </div>
                                     <div>
                                       <div className="font-bold text-violet-700 mb-1">Atmosphere & Radiation</div>
                                       <p className="text-slate-600">Atmospheric composition affects breathability and industrial processes. Radiation levels indicate background radiation from the star and planetary core. High radiation requires shielding and affects population health.</p>
                                     </div>
                                     <div>
                                       <div className="font-bold text-rose-700 mb-1">Rarity Classification</div>
                                       <p className="text-slate-600">Common planets are abundant but may lack strategic value. Legendary planets possess exceptional stats across multiple categories and are highly sought after for capital worlds or military bases.</p>
                                     </div>
                                   </div>
                                 </div>

                                 <div className="mt-2 flex flex-wrap gap-2">
                                   <Button size="sm" variant="outline" onClick={() => toast({ title: "Planet Info", description: `${planet.name}: ${planet.description}` })}>
                                     <Info className="w-3 h-3 mr-1" /> Full Details
                                   </Button>
                                   <Button size="sm" variant="outline" onClick={() => scanMutation.mutate(planet.id)} disabled={scanMutation.isPending}>
                                     <Search className="w-3 h-3 mr-1" /> Deep Scan
                                   </Button>
                                   <Button size="sm" variant="outline" onClick={() => colonizeMutation.mutate(planet.id)} disabled={colonizeMutation.isPending}>
                                     <Rocket className="w-3 h-3 mr-1" /> Send Colony Ship
                                   </Button>
                                   <Button size="sm" variant="outline" onClick={() => toast({ title: "Moon Survey", description: `Scanning moons around ${planet.name}...` })}>
                                     <Moon className="w-3 h-3 mr-1" /> Survey Moons
                                   </Button>
                                   <Button size="sm" variant="outline" onClick={() => extractMutation.mutate(planet.id)} disabled={extractMutation.isPending}>
                                     <Pickaxe className="w-3 h-3 mr-1" /> Extract Resources
                                   </Button>
                                 </div>
                               </div>
                             </td>
                           </tr>
                         )}
                      </>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </GameLayout>
  );
}
