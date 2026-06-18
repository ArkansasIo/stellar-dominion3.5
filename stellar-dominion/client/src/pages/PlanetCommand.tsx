import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import GameLayout from "@/components/layout/GameLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Box, Cpu, Database, Droplets, Factory, Gem, Globe, Moon, Orbit, Shield, TrendingUp, Users, Wheat, Zap } from "lucide-react";

type MainMenu = "planet" | "moon" | "station";
type PlanetSubMenu = "infrastructure" | "governance";
type MoonSubMenu = "facilities" | "intel";
type StationSubMenu = "modules" | "operations";

interface PlanetSummary {
  id: string;
  name: string;
  coordinates: string;
  colonized: boolean;
}

interface PlanetDetails {
  id: string;
  name: string;
  type: string;
  class: string;
  size: string;
  coordinates: string;
  colonized: boolean;
  owner?: string;
  population?: number;
  defenses?: number;
  temperature: number;
  habitability: number;
  resources: {
    metal: number;
    crystal: number;
    deuterium: number;
  };
  buildings?: {
    metalMine: number;
    crystalMine: number;
    deuteriumSynthesizer: number;
    solarPlant: number;
    roboticsFactory: number;
  };
}

interface SubPlaneModule {
  key: string;
  label: string;
  level: number;
  nextCost: {
    metal: number;
    crystal: number;
    deuterium: number;
  };
}

interface SubPlaneResponse {
  moon: {
    exists: boolean;
    name: string;
    level: number;
    stability: number;
    structures: SubPlaneModule[];
    bonuses: {
      surveillance: number;
      stealth: number;
      resourceAmplification: number;
    };
  };
  station: {
    exists: boolean;
    name: string;
    level: number;
    integrity: number;
    modules: SubPlaneModule[];
    bonuses: {
      logistics: number;
      shipCapacity: number;
      defenseCoordination: number;
    };
  };
  commandSummary: {
    defenseRating: number;
    logisticsRating: number;
    productionBonus: number;
  };
}

interface PopulationSnapshotResponse {
  success: boolean;
  snapshot: {
    frameTier: number;
    frame: {
      name: string;
      populationCapacityBonus: number;
      foodEfficiencyBonus: number;
      waterEfficiencyBonus: number;
      stabilityBonus: number;
    };
    population: {
      current: number;
      capacity: number;
      utilization: number;
      happiness: number;
      estimatedGrowthPerHour: number;
      classes: Record<string, number>;
    };
    food: {
      stock: number;
      productionPerHour: number;
      demandPerHour: number;
      netPerHour: number;
      pressure: string;
      hoursToDepletion: number | null;
    };
    water: {
      stock: number;
      productionPerHour: number;
      demandPerHour: number;
      netPerHour: number;
      pressure: string;
      hoursToDepletion: number | null;
    };
  };
}

function formatCost(cost: { metal: number; crystal: number; deuterium: number }) {
  return `${cost.metal.toLocaleString()}M / ${cost.crystal.toLocaleString()}C / ${cost.deuterium.toLocaleString()}D`;
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { credentials: "include" });
  const payload = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(payload?.message || payload?.error || "Request failed");
  }

  return payload as T;
}

function pressureClasses(pressure: string) {
  switch (pressure) {
    case "surplus":
      return "bg-emerald-100 text-emerald-900";
    case "stable":
      return "bg-blue-100 text-blue-900";
    case "strained":
      return "bg-amber-100 text-amber-900";
    default:
      return "bg-red-100 text-red-900";
  }
}

export default function PlanetCommand() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [selectedPlanetId, setSelectedPlanetId] = useState<string>("");
  const [mainMenu, setMainMenu] = useState<MainMenu>("planet");
  const [planetSubMenu, setPlanetSubMenu] = useState<PlanetSubMenu>("infrastructure");
  const [moonSubMenu, setMoonSubMenu] = useState<MoonSubMenu>("facilities");
  const [stationSubMenu, setStationSubMenu] = useState<StationSubMenu>("modules");

  const planetsQuery = useQuery<{ planets: PlanetSummary[] }>({
    queryKey: ["/api/planets"],
  });

  useEffect(() => {
    if (!selectedPlanetId && planetsQuery.data?.planets?.length) {
      setSelectedPlanetId(planetsQuery.data.planets[0].id);
    }
  }, [selectedPlanetId, planetsQuery.data?.planets]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const menuParam = params.get("tab") || params.get("menu");
    const subParam = params.get("sub");

    if (menuParam === "planet" || menuParam === "moon" || menuParam === "station") {
      setMainMenu(menuParam);

      if (menuParam === "planet" && (subParam === "infrastructure" || subParam === "governance")) {
        setPlanetSubMenu(subParam);
      }

      if (menuParam === "moon" && (subParam === "facilities" || subParam === "intel")) {
        setMoonSubMenu(subParam);
      }

      if (menuParam === "station" && (subParam === "modules" || subParam === "operations")) {
        setStationSubMenu(subParam);
      }
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const activeSub =
      mainMenu === "planet" ? planetSubMenu :
      mainMenu === "moon" ? moonSubMenu :
      stationSubMenu;

    params.set("tab", mainMenu);
    params.delete("menu");
    params.set("sub", activeSub);

    const nextUrl = `/planet-command?${params.toString()}`;
    const currentUrl = `${window.location.pathname}${window.location.search}`;

    if (currentUrl !== nextUrl) {
      window.history.replaceState(null, "", nextUrl);
    }
  }, [mainMenu, planetSubMenu, moonSubMenu, stationSubMenu]);

  const selectedPlanet = useMemo(
    () => planetsQuery.data?.planets?.find((planet) => planet.id === selectedPlanetId),
    [planetsQuery.data?.planets, selectedPlanetId],
  );

  const planetDetailsQuery = useQuery<PlanetDetails>({
    queryKey: ["planet-command-planet", selectedPlanetId],
    queryFn: async () => {
      const res = await fetch(`/api/planets/${selectedPlanetId}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load planet details");
      return res.json();
    },
    enabled: Boolean(selectedPlanetId),
  });

  const subPlaneQuery = useQuery<SubPlaneResponse>({
    queryKey: ["planet-command-subplanes", selectedPlanetId],
    queryFn: async () => {
      const res = await fetch(`/api/planets/${selectedPlanetId}/sub-planes`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load sub-plane data");
      return res.json();
    },
    enabled: Boolean(selectedPlanetId),
  });

  const populationSnapshotQuery = useQuery<PopulationSnapshotResponse>({
    queryKey: ["planet-command-population-snapshot"],
    queryFn: () => fetchJson<PopulationSnapshotResponse>("/api/population/snapshot"),
    refetchInterval: 30000,
  });

  const upgradePlanetStructureMutation = useMutation({
    mutationFn: async (buildingType: string) => {
      const res = await fetch(`/api/planets/${selectedPlanetId}/build`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ buildingType }),
      });
      if (!res.ok) {
        const errorBody = await res.json();
        throw new Error(errorBody.error || "Failed to upgrade structure");
      }
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Planet upgraded", description: "Planet infrastructure is now stronger." });
      queryClient.invalidateQueries({ queryKey: ["planet-command-planet", selectedPlanetId] });
    },
    onError: (error: Error) => {
      toast({ title: "Upgrade failed", description: error.message, variant: "destructive" });
    },
  });

  const upgradeSubPlaneMutation = useMutation({
    mutationFn: async ({ type, moduleKey }: { type: "moon" | "station"; moduleKey: string }) => {
      const res = await fetch(`/api/planets/${selectedPlanetId}/sub-planes/${type}/upgrade`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ moduleKey }),
      });
      if (!res.ok) {
        const errorBody = await res.json();
        throw new Error(errorBody.error || "Failed to upgrade module");
      }
      return res.json();
    },
    onSuccess: (_data, variables) => {
      toast({
        title: "Sub-plane upgraded",
        description: `${variables.type === "moon" ? "Moon" : "Station"} module upgraded successfully.`,
      });
      queryClient.invalidateQueries({ queryKey: ["planet-command-subplanes", selectedPlanetId] });
    },
    onError: (error: Error) => {
      toast({ title: "Upgrade failed", description: error.message, variant: "destructive" });
    },
  });

  const planet = planetDetailsQuery.data;
  const subPlanes = subPlaneQuery.data;
  const snapshot = populationSnapshotQuery.data?.snapshot;

  return (
    <GameLayout>
      <div className="space-y-6" data-testid="planet-command-page">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-orbitron font-bold text-slate-900">Planet Command</h1>
            <p className="text-slate-600">Planet, moon, and orbital station command menus with operational sub-menus.</p>
          </div>
          <div className="w-full lg:w-[340px]">
            <Select value={selectedPlanetId} onValueChange={setSelectedPlanetId}>
              <SelectTrigger data-testid="select-planet-command-world">
                <SelectValue placeholder="Select world" />
              </SelectTrigger>
              <SelectContent>
                {(planetsQuery.data?.planets || []).map((planetOption) => (
                  <SelectItem key={planetOption.id} value={planetOption.id}>
                    {planetOption.name} [{planetOption.coordinates}]
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {selectedPlanet && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-xs text-slate-500 uppercase tracking-wider">World</div>
                <div className="text-lg font-orbitron font-bold text-slate-900">{selectedPlanet.name}</div>
                <div className="text-xs text-slate-500">{selectedPlanet.coordinates}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-xs text-slate-500 uppercase tracking-wider">Command Layer</div>
                <div className="text-lg font-bold text-slate-900">{mainMenu.toUpperCase()}</div>
                <div className="text-xs text-slate-500">Main menu + sub-menu controls active</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-xs text-slate-500 uppercase tracking-wider">Colonized</div>
                <div className="text-lg font-bold text-slate-900">{selectedPlanet.colonized ? "Yes" : "No"}</div>
                <div className="text-xs text-slate-500">Colonization controls readiness</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-xs text-slate-500 uppercase tracking-wider">Sub-Plane Status</div>
                <div className="text-lg font-bold text-slate-900">
                  {subPlanes ? `${subPlanes.moon.level + subPlanes.station.level}` : "--"}
                </div>
                <div className="text-xs text-slate-500">Combined moon + station command levels</div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
          <Card className="bg-slate-950 text-white border-slate-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-slate-300 text-xs uppercase tracking-[0.2em]">
                <Cpu className="w-4 h-4" /> Frame System
              </div>
              <div className="mt-3 text-2xl font-orbitron font-bold">T{snapshot?.frameTier ?? "-"}</div>
              <div className="text-sm text-slate-300">{snapshot?.frame.name ?? "Awaiting sync"}</div>
              <div className="mt-3 text-xs text-slate-400">
                Stability +{snapshot ? Math.round(snapshot.frame.stabilityBonus * 100) : 0}%
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-slate-500 text-xs uppercase tracking-[0.2em]">
                <Users className="w-4 h-4 text-blue-600" /> Population Snapshot
              </div>
              <div className="mt-3 text-2xl font-orbitron font-bold text-slate-900">
                {snapshot?.population.current?.toLocaleString() ?? "-"}
              </div>
              <div className="text-sm text-slate-500">
                Capacity {snapshot?.population.capacity?.toLocaleString() ?? "-"}
              </div>
              <Progress value={(snapshot?.population.utilization ?? 0) * 100} className="mt-3 h-2" />
              <div className="mt-2 text-xs text-slate-500">
                Happiness {snapshot ? Math.round(snapshot.population.happiness * 100) : 0}%
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-slate-500 text-xs uppercase tracking-[0.2em]">
                <Wheat className="w-4 h-4 text-amber-600" /> Food System
              </div>
              <div className="mt-3 flex items-center justify-between gap-2">
                <div className="text-2xl font-orbitron font-bold text-slate-900">{snapshot?.food.stock?.toLocaleString() ?? "-"}</div>
                <Badge className={pressureClasses(snapshot?.food.pressure ?? "critical")}>
                  {snapshot?.food.pressure ?? "offline"}
                </Badge>
              </div>
              <div className="mt-2 text-xs text-slate-500">
                {snapshot ? `${snapshot.food.productionPerHour.toFixed(1)}/h produced • ${snapshot.food.demandPerHour.toFixed(1)}/h consumed` : "Awaiting food telemetry"}
              </div>
              <div className="mt-2 text-sm font-semibold text-slate-800">
                Net {snapshot ? snapshot.food.netPerHour.toFixed(1) : "-"}/h
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-slate-500 text-xs uppercase tracking-[0.2em]">
                <Droplets className="w-4 h-4 text-cyan-600" /> Water System
              </div>
              <div className="mt-3 flex items-center justify-between gap-2">
                <div className="text-2xl font-orbitron font-bold text-slate-900">{snapshot?.water.stock?.toLocaleString() ?? "-"}</div>
                <Badge className={pressureClasses(snapshot?.water.pressure ?? "critical")}>
                  {snapshot?.water.pressure ?? "offline"}
                </Badge>
              </div>
              <div className="mt-2 text-xs text-slate-500">
                {snapshot ? `${snapshot.water.productionPerHour.toFixed(1)}/h produced • ${snapshot.water.demandPerHour.toFixed(1)}/h consumed` : "Awaiting water telemetry"}
              </div>
              <div className="mt-2 text-sm font-semibold text-slate-800">
                Net {snapshot ? snapshot.water.netPerHour.toFixed(1) : "-"}/h
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-900">
              <TrendingUp className="w-5 h-5 text-emerald-600" /> Life Support Sustainability
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
            <div className="p-4 bg-slate-50 rounded border border-slate-200">
              <div className="text-xs uppercase tracking-wider text-slate-500">Growth / Hour</div>
              <div className="text-xl font-bold text-slate-900">{snapshot?.population.estimatedGrowthPerHour?.toLocaleString() ?? "-"}</div>
            </div>
            <div className="p-4 bg-slate-50 rounded border border-slate-200">
              <div className="text-xs uppercase tracking-wider text-slate-500">Food Depletion</div>
              <div className="text-xl font-bold text-slate-900">{snapshot?.food.hoursToDepletion ?? "Safe"}</div>
            </div>
            <div className="p-4 bg-slate-50 rounded border border-slate-200">
              <div className="text-xs uppercase tracking-wider text-slate-500">Water Depletion</div>
              <div className="text-xl font-bold text-slate-900">{snapshot?.water.hoursToDepletion ?? "Safe"}</div>
            </div>
            <div className="p-4 bg-slate-50 rounded border border-slate-200">
              <div className="text-xs uppercase tracking-wider text-slate-500">Frame Capacity Bonus</div>
              <div className="text-xl font-bold text-slate-900">+{snapshot ? Math.round(snapshot.frame.populationCapacityBonus * 100) : 0}%</div>
            </div>
            <div className="p-4 bg-slate-50 rounded border border-slate-200">
              <div className="text-xs uppercase tracking-wider text-slate-500">Workers</div>
              <div className="text-xl font-bold text-slate-900">{snapshot?.population.classes.workers?.toLocaleString() ?? "-"}</div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={mainMenu} onValueChange={(value) => setMainMenu(value as MainMenu)}>
          <TabsList className="grid grid-cols-3 w-full lg:w-[480px]">
            <TabsTrigger value="planet" data-testid="tab-menu-planet">
              <Globe className="w-4 h-4 mr-2" /> Planet
            </TabsTrigger>
            <TabsTrigger value="moon" data-testid="tab-menu-moon">
              <Moon className="w-4 h-4 mr-2" /> Moon Base
            </TabsTrigger>
            <TabsTrigger value="station" data-testid="tab-menu-station">
              <Orbit className="w-4 h-4 mr-2" /> Orbital Station
            </TabsTrigger>
          </TabsList>

          <TabsContent value="planet" className="space-y-4 mt-4">
            <Tabs value={planetSubMenu} onValueChange={(value) => setPlanetSubMenu(value as PlanetSubMenu)}>
              <TabsList className="grid grid-cols-2 w-full lg:w-[360px]">
                <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
                <TabsTrigger value="governance">Governance</TabsTrigger>
              </TabsList>

              <TabsContent value="infrastructure" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Factory className="w-5 h-5" /> Planet Infrastructure Sub-Menu
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {planet?.buildings && (
                      <>
                        {[
                          { key: "metalMine", label: "Metal Mine", icon: Box },
                          { key: "crystalMine", label: "Crystal Mine", icon: Gem },
                          { key: "deuteriumSynthesizer", label: "Deuterium Synth", icon: Database },
                          { key: "solarPlant", label: "Solar Plant", icon: Zap },
                          { key: "roboticsFactory", label: "Robotics Factory", icon: Factory },
                        ].map((entry) => {
                          const level = planet.buildings?.[entry.key as keyof PlanetDetails["buildings"]] ?? 0;
                          const Icon = entry.icon;

                          return (
                            <Card key={entry.key} className="border-slate-200">
                              <CardContent className="p-4 space-y-3">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2 text-slate-800">
                                    <Icon className="w-4 h-4" />
                                    <span className="font-medium">{entry.label}</span>
                                  </div>
                                  <Badge variant="outline">Lvl {level}</Badge>
                                </div>
                                <Progress value={Math.min(100, level * 10)} />
                                <Button
                                  className="w-full"
                                  onClick={() => upgradePlanetStructureMutation.mutate(entry.key)}
                                  disabled={!planet.colonized || upgradePlanetStructureMutation.isPending}
                                  data-testid={`button-upgrade-${entry.key}`}
                                >
                                  Upgrade
                                </Button>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="governance" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5" /> Planet Governance Sub-Menu
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded border border-slate-200">
                      <div className="text-xs uppercase tracking-wider text-slate-500">Population</div>
                      <div className="text-xl font-bold text-slate-900">{planet?.population?.toLocaleString() ?? "0"}</div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded border border-slate-200">
                      <div className="text-xs uppercase tracking-wider text-slate-500">Defense</div>
                      <div className="text-xl font-bold text-slate-900">{planet?.defenses?.toLocaleString() ?? "0"}</div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded border border-slate-200">
                      <div className="text-xs uppercase tracking-wider text-slate-500">Habitability</div>
                      <div className="text-xl font-bold text-slate-900">{planet?.habitability ?? 0}%</div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded border border-slate-200">
                      <div className="text-xs uppercase tracking-wider text-slate-500">Owner</div>
                      <div className="text-xl font-bold text-slate-900">{planet?.owner || "Unclaimed"}</div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="moon" className="space-y-4 mt-4">
            <Tabs value={moonSubMenu} onValueChange={(value) => setMoonSubMenu(value as MoonSubMenu)}>
              <TabsList className="grid grid-cols-2 w-full lg:w-[360px]">
                <TabsTrigger value="facilities">Facilities</TabsTrigger>
                <TabsTrigger value="intel">Intel</TabsTrigger>
              </TabsList>

              <TabsContent value="facilities" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Moon className="w-5 h-5" /> Moon Facilities Sub-Menu
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-sm text-slate-600">{subPlanes?.moon.name ?? "Moon Base"} • Stability {subPlanes?.moon.stability ?? 0}%</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      {(subPlanes?.moon.structures || []).map((module) => (
                        <Card key={module.key} className="border-slate-200">
                          <CardContent className="p-4 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-slate-900">{module.label}</span>
                              <Badge variant="outline">Lvl {module.level}</Badge>
                            </div>
                            <div className="text-xs text-slate-500">Next Cost: {formatCost(module.nextCost)}</div>
                            <Button
                              className="w-full"
                              onClick={() => upgradeSubPlaneMutation.mutate({ type: "moon", moduleKey: module.key })}
                              disabled={!subPlanes?.moon.exists || upgradeSubPlaneMutation.isPending}
                            >
                              Upgrade Module
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="intel" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Moon Intelligence Sub-Menu</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-slate-50 rounded border border-slate-200">
                      <div className="text-xs text-slate-500 uppercase">Surveillance</div>
                      <div className="text-xl font-bold text-slate-900">{subPlanes?.moon.bonuses.surveillance ?? 0}%</div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded border border-slate-200">
                      <div className="text-xs text-slate-500 uppercase">Stealth</div>
                      <div className="text-xl font-bold text-slate-900">{subPlanes?.moon.bonuses.stealth ?? 0}%</div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded border border-slate-200">
                      <div className="text-xs text-slate-500 uppercase">Resource Amplification</div>
                      <div className="text-xl font-bold text-slate-900">{subPlanes?.moon.bonuses.resourceAmplification ?? 0}%</div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="station" className="space-y-4 mt-4">
            <Tabs value={stationSubMenu} onValueChange={(value) => setStationSubMenu(value as StationSubMenu)}>
              <TabsList className="grid grid-cols-2 w-full lg:w-[360px]">
                <TabsTrigger value="modules">Modules</TabsTrigger>
                <TabsTrigger value="operations">Operations</TabsTrigger>
              </TabsList>

              <TabsContent value="modules" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Orbit className="w-5 h-5" /> Station Modules Sub-Menu
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-sm text-slate-600">{subPlanes?.station.name ?? "Orbital Station"} • Integrity {subPlanes?.station.integrity ?? 0}%</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      {(subPlanes?.station.modules || []).map((module) => (
                        <Card key={module.key} className="border-slate-200">
                          <CardContent className="p-4 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-slate-900">{module.label}</span>
                              <Badge variant="outline">Lvl {module.level}</Badge>
                            </div>
                            <div className="text-xs text-slate-500">Next Cost: {formatCost(module.nextCost)}</div>
                            <Button
                              className="w-full"
                              onClick={() => upgradeSubPlaneMutation.mutate({ type: "station", moduleKey: module.key })}
                              disabled={!subPlanes?.station.exists || upgradeSubPlaneMutation.isPending}
                            >
                              Upgrade Module
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="operations" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5" /> Command Operations Sub-Menu
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-slate-50 rounded border border-slate-200">
                      <div className="text-xs text-slate-500 uppercase">Defense Rating</div>
                      <div className="text-xl font-bold text-slate-900">{subPlanes?.commandSummary.defenseRating ?? 0}</div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded border border-slate-200">
                      <div className="text-xs text-slate-500 uppercase">Logistics Rating</div>
                      <div className="text-xl font-bold text-slate-900">{subPlanes?.commandSummary.logisticsRating ?? 0}</div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded border border-slate-200">
                      <div className="text-xs text-slate-500 uppercase">Production Bonus</div>
                      <div className="text-xl font-bold text-slate-900">{subPlanes?.commandSummary.productionBonus ?? 0}%</div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </div>
    </GameLayout>
  );
}