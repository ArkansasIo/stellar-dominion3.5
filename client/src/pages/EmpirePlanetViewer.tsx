import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import GameLayout from "@/components/layout/GameLayout";
import { BACKGROUND_ASSETS, SHIP_ASSETS, MENU_ASSETS, OGAMEX_FEATURED_ASSETS, TECH_BRANCH_ASSETS } from "@shared/config";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Globe, Layers, Moon, Settings2 } from "lucide-react";
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
      if (!res.ok) throw new Error("Failed to load travel state");
      return res.json();
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
      }),
      { habitability: 0, metal: 0, crystal: 0, deuterium: 0 },
    );
  }, [filteredPlanets]);

  const avgHabitability = filteredPlanets.length
    ? Math.round(stats.habitability / filteredPlanets.length)
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
      return;
    }

    if (scope === "page") {
      const updates: Record<string, ColonyManagementProfile> = {};
      for (const item of effectiveColonies) updates[item.id] = profile;
      setProfileOverrides((current) => ({ ...current, ...updates }));
      return;
    }

    setGlobalProfile(profile);
    setProfileOverrides({});
  };

  const getRarityBadgeClass = (rarity: string) => {
    switch (rarity) {
      case "legendary":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "epic":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "rare":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "uncommon":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <GameLayout>
      <div className="space-y-6 animate-in fade-in duration-500" data-testid="empire-planet-viewer">
        <section className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm bg-cover bg-center" style={{ backgroundImage: `linear-gradient(rgba(15,23,42,0.78), rgba(15,23,42,0.92)), url(${BACKGROUND_ASSETS.GALAXY_MAP.path})` }}>
          <div className="p-5 lg:p-6 space-y-4 text-white">
            <div className="flex items-center gap-2">
              <img src={MENU_ASSETS.NAVIGATION.EMPIRE.path} alt="Icon" className="w-8 h-8 rounded-lg border border-white/10 bg-white/10 p-1.5 object-contain" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = TEMP_THEME_IMAGE; }} />
              <h1 className="text-2xl font-bold">Empire Planets</h1>
            </div>
            <p className="text-sm leading-6 text-slate-300">Planet catalog and interstellar reconnaissance overview.</p>
            <div className="flex flex-wrap gap-3">
              {[{ label: "Planet Catalog", image: SHIP_ASSETS.CAPITALS.BATTLECRUISER.path }, { label: "Survey Data", image: MENU_ASSETS.BUILDINGS.SHIPYARD.path }, { label: "Recon Overview", image: OGAMEX_FEATURED_ASSETS.BACKGROUND.path }].map((item) => (
                <div key={item.label} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                  <img src={item.image} alt={item.label} className="w-10 h-10 rounded-lg border border-white/10 bg-black/10 p-1.5 object-contain" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = TEMP_THEME_IMAGE; }} />
                  <div className="text-sm font-semibold">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">Known Types</div>
                  <div className="text-2xl font-orbitron font-bold text-slate-900">{planetsQuery.data?.count ?? 0}</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                  <img src={TECH_BRANCH_ASSETS.COMPUTING.path} alt="known types" className="w-8 h-8 object-contain" onError={(e) => { (e.target as HTMLImageElement).src = TEMP_THEME_IMAGE; }} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-blue-600 uppercase tracking-wider">Known Planets</div>
                  <div className="text-2xl font-orbitron font-bold text-blue-900">{travelStateQuery.data?.knownPlanets?.length ?? 0}</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center overflow-hidden">
                  <img src={TECH_BRANCH_ASSETS.SENSORS.path} alt="known planets" className="w-8 h-8 object-contain" onError={(e) => { (e.target as HTMLImageElement).src = TEMP_THEME_IMAGE; }} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-purple-600 uppercase tracking-wider">Travel Logs</div>
                  <div className="text-2xl font-orbitron font-bold text-purple-900">{travelStateQuery.data?.travelLog?.length ?? 0}</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center overflow-hidden">
                  <img src={TECH_BRANCH_ASSETS.PROPULSION.path} alt="travel logs" className="w-8 h-8 object-contain" onError={(e) => { (e.target as HTMLImageElement).src = TEMP_THEME_IMAGE; }} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-emerald-700 uppercase tracking-wider">Avg Habitability</div>
                  <div className="text-2xl font-orbitron font-bold text-emerald-900">{avgHabitability}</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center overflow-hidden">
                  <img src={TECH_BRANCH_ASSETS.RESOURCES.path} alt="habitability" className="w-8 h-8 object-contain" onError={(e) => { (e.target as HTMLImageElement).src = TEMP_THEME_IMAGE; }} />
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
                <select
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={rarityFilter}
                  onChange={(e) => setRarityFilter(e.target.value)}
                >
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
                <select
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={classFilter}
                  onChange={(e) => setClassFilter(e.target.value)}
                >
                  <option value="all">All</option>
                  {classes.map((planetClass) => (
                    <option key={planetClass} value={planetClass}>
                      {planetClass}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <Settings2 className="w-4 h-4 text-slate-500" /> Colony Viewer Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              <select className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm" value={scope} onChange={(e) => setScope(e.target.value as "individual" | "page" | "all") }>
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
                </div>
                <div className="rounded border border-slate-200 bg-slate-50 p-3">
                  <div className="text-sm font-semibold text-slate-800 mb-2">System + Moon Overview</div>
                  <div className="text-xs text-slate-600 mb-2">
                    {selectedColony.solarOverview.galaxy}:{selectedColony.solarOverview.sector}:{selectedColony.solarOverview.system} • Star {selectedColony.solarOverview.starClass}
                  </div>
                  <div className="max-h-40 overflow-y-auto space-y-1">
                    {systemBodies.map((body) => (
                      <div key={`${body.coordinates}-${body.type}`} className="bg-white rounded border border-slate-200 px-2 py-1 text-xs flex justify-between">
                        <span className="flex items-center gap-1">{body.type === "moon" ? <Moon className="w-3 h-3 text-indigo-600" /> : <Layers className="w-3 h-3 text-blue-600" />} {body.type} O{body.orbit}</span>
                        <span className="font-mono text-slate-500">{body.coordinates}</span>
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
            {(planetsQuery.isLoading || travelStateQuery.isLoading) && (
              <div className="px-4 py-8 text-center text-slate-500">Loading empire planetary intelligence...</div>
            )}

            {(planetsQuery.isError || travelStateQuery.isError) && (
              <div className="px-4 py-8 text-center text-red-600">Unable to load planet intelligence data.</div>
            )}

            {!planetsQuery.isLoading && !travelStateQuery.isLoading && filteredPlanets.length === 0 && (
              <div className="px-4 py-8 text-center text-slate-500">No planet types match the current filters.</div>
            )}

            {filteredPlanets.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] text-sm">
                  <thead className="bg-slate-50 border-y border-slate-200">
                    <tr>
                      <th className="text-left px-4 py-3 font-bold text-slate-600 uppercase tracking-wider text-xs">Planet</th>
                      <th className="text-left px-4 py-3 font-bold text-slate-600 uppercase tracking-wider text-xs">Family / Class</th>
                      <th className="text-left px-4 py-3 font-bold text-slate-600 uppercase tracking-wider text-xs">Habitability</th>
                      <th className="text-left px-4 py-3 font-bold text-slate-600 uppercase tracking-wider text-xs">Resources (M/C/D)</th>
                      <th className="text-left px-4 py-3 font-bold text-slate-600 uppercase tracking-wider text-xs">Rarity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPlanets.map((planet) => (
                      <tr key={planet.id} className="border-b border-slate-100 hover:bg-slate-50/80 align-top">
                        <td className="px-4 py-3">
                          <div className="font-semibold text-slate-900">{planet.name}</div>
                          <div className="text-xs text-slate-500 mt-1 max-w-[280px] line-clamp-2">{planet.description}</div>
                        </td>
                        <td className="px-4 py-3 text-slate-700">
                          <div>{planet.family}</div>
                          <div className="text-xs text-slate-500 mt-1">Class {planet.class}</div>
                        </td>
                        <td className="px-4 py-3 font-mono text-slate-800">{planet.stats.habitabilityIndex}</td>
                        <td className="px-4 py-3 font-mono text-slate-800">
                          {planet.stats.metalRichness}/{planet.stats.crystalRichness}/{planet.stats.deuteriumRichness}
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="outline" className={`capitalize ${getRarityBadgeClass(planet.rarity)}`}>
                            {planet.rarity}
                          </Badge>
                        </td>
                      </tr>
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
