import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import GameLayout from "@/components/layout/GameLayout";
import { TECH_BRANCH_ASSETS } from "@shared/config";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Globe, Layers } from "lucide-react";

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
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-3xl font-orbitron font-bold text-slate-900 flex items-center gap-2">
              <Globe className="w-8 h-8 text-primary" />
              Empire Planets
            </h1>
            <p className="text-muted-foreground font-rajdhani text-lg mt-1">
              Planet catalog and interstellar reconnaissance overview.
            </p>
          </div>
          <div className="text-right text-sm text-slate-500">
            <div className="font-mono">{new Date().toLocaleTimeString()}</div>
            <div className="text-xs">{new Date().toLocaleDateString()}</div>
          </div>
        </div>

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
