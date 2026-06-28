import GameLayout from "@/components/layout/GameLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import {
  Users,
  Heart,
  TrendingUp,
  TrendingDown,
  Wheat,
  Droplets,
  Home,
  Shield,
  Brain,
  Wrench,
  Building2,
  Baby,
  Crosshair,
  AlertTriangle,
  Clock,
  BarChart3,
  Star,
  Flame,
  Hospital,
  Skull,
  Syringe,
  Gavel,
  Swords,
  Rocket,
  Factory,
  Orbit,
  LucideIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import Navigation from "./Navigation";
import { BACKGROUND_ASSETS, SHIP_ASSETS, MENU_ASSETS, OGAMEX_FEATURED_ASSETS, PLANET_ASSETS } from "@shared/config";

const TEMP_THEME_IMAGE = "/theme-temp.png";

type PopulationSnapshotResponse = {
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
};

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, { credentials: "include" });
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(payload?.message || payload?.error || "Request failed");
  }
  return payload as T;
}

function pressureColor(pressure: string) {
  switch (pressure) {
    case "surplus": return "text-emerald-600 bg-emerald-50";
    case "stable": return "text-blue-600 bg-blue-50";
    case "strained": return "text-amber-600 bg-amber-50";
    default: return "text-red-600 bg-red-50";
  }
}

function happinessColor(happiness: number) {
  if (happiness >= 80) return "text-emerald-600";
  if (happiness >= 60) return "text-blue-600";
  if (happiness >= 40) return "text-amber-600";
  return "text-red-600";
}

function happinessLabel(happiness: number) {
  if (happiness >= 80) return "Ecstatic";
  if (happiness >= 60) return "Happy";
  if (happiness >= 40) return "Content";
  if (happiness >= 20) return "Unhappy";
  return "Rebellious";
}

function happinessBg(happiness: number) {
  if (happiness >= 80) return "bg-emerald-500";
  if (happiness >= 60) return "bg-blue-500";
  if (happiness >= 40) return "bg-amber-500";
  return "bg-red-500";
}

type PopulationClassInfo = {
  key: string;
  icon: LucideIcon;
  label: string;
  description: string;
  color: string;
  bgColor: string;
};

const POPULATION_CLASSES: PopulationClassInfo[] = [
  { key: "workers", icon: Wrench, label: "Workers", description: "Resource production in mines, farms, and factories", color: "text-amber-600", bgColor: "bg-amber-50" },
  { key: "scientists", icon: Brain, label: "Scientists", description: "Research output and technological discovery", color: "text-purple-600", bgColor: "bg-purple-50" },
  { key: "engineers", icon: Building2, label: "Engineers", description: "Building construction and ship maintenance", color: "text-cyan-600", bgColor: "bg-cyan-50" },
  { key: "military", icon: Shield, label: "Military", description: "Ground combat, garrison duty, and planetary defense", color: "text-red-600", bgColor: "bg-red-50" },
  { key: "administrators", icon: Users, label: "Administrators", description: "Trade route income, marketplace taxes, and governance", color: "text-indigo-600", bgColor: "bg-indigo-50" },
  { key: "civilians", icon: Heart, label: "Civilians", description: "General population — idle labor pool for reassignment", color: "text-slate-600", bgColor: "bg-slate-50" },
];

export default function Population() {
  const [classAssignments, setClassAssignments] = useState<Record<string, number[]>>({});

  const snapshotQuery = useQuery<PopulationSnapshotResponse>({
    queryKey: ["population-snapshot"],
    queryFn: () => fetchJson<PopulationSnapshotResponse>("/api/population/snapshot"),
    refetchInterval: 30000,
  });

  const snapshot = snapshotQuery.data?.snapshot;
  const classes = snapshot?.population.classes ?? {};
  const totalPopulation = snapshot?.population.current ?? 0;

  const sortedClasses = POPULATION_CLASSES.map((pc) => ({
    ...pc,
    count: classes[pc.key] ?? 0,
    pct: totalPopulation > 0 ? ((classes[pc.key] ?? 0) / totalPopulation) * 100 : 0,
  })).sort((a, b) => b.count - a.count);

  useEffect(() => {
    if (totalPopulation > 0 && Object.keys(classAssignments).length === 0) {
      const initial: Record<string, number[]> = {};
      for (const pc of POPULATION_CLASSES) {
        const current = classes[pc.key] ?? 0;
        const pct = totalPopulation > 0 ? Math.round((current / totalPopulation) * 100) : 0;
        initial[pc.key] = [pct];
      }
      setClassAssignments(initial);
    }
  }, [totalPopulation, classes, classAssignments]);

  return (
    <GameLayout>
      <div className="space-y-6 animate-in fade-in duration-500">
        <Navigation />

        <section className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm bg-cover bg-center" style={{ backgroundImage: `linear-gradient(rgba(15,23,42,0.78), rgba(15,23,42,0.92)), url(${BACKGROUND_ASSETS.GALAXY_MAP.path})` }}>
          <div className="p-5 lg:p-6 space-y-4 text-white">
            <div className="flex items-center gap-2">
              <img src={SHIP_ASSETS.SPECIAL.COLONIZER.path} alt="Icon" className="w-8 h-8 rounded-lg border border-white/10 bg-white/10 p-1.5 object-contain" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = TEMP_THEME_IMAGE; }} />
              <h1 className="text-2xl font-bold">Population Management</h1>
            </div>
            <p className="text-sm leading-6 text-slate-300">Monitor population demographics, assign citizen classes, and manage growth, happiness, and life support systems across your empire.</p>
            <div className="flex flex-wrap gap-3">
              {[{ label: "Census", image: MENU_ASSETS.RESOURCES.SCIENCE.path }, { label: "Growth", image: OGAMEX_FEATURED_ASSETS.BACKGROUND.path }, { label: "Happiness", image: MENU_ASSETS.NAVIGATION.EMPIRE.path }].map((item) => (
                <div key={item.label} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                  <img src={item.image} alt={item.label} className="w-10 h-10 rounded-lg border border-white/10 bg-black/10 p-1.5 object-contain" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = TEMP_THEME_IMAGE; }} />
                  <div className="text-sm font-semibold">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {snapshotQuery.isLoading ? (
          <Card className="bg-white border-slate-200">
            <CardContent className="p-12 text-center text-slate-500">
              Loading population telemetry...
            </CardContent>
          </Card>
        ) : snapshotQuery.isError ? (
          <Card className="bg-white border-red-200">
            <CardContent className="p-12 text-center text-red-600">
              Failed to load population data. Ensure the server is running.
            </CardContent>
          </Card>
        ) : !snapshot ? (
          <Card className="bg-white border-slate-200">
            <CardContent className="p-12 text-center text-slate-500">
              No population data available yet.
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-xs text-blue-600 uppercase">Total Population</div>
                      <div className="text-xl font-orbitron font-bold text-blue-900">{snapshot.population.current.toLocaleString()}</div>
                    </div>
                  </div>
                  <Progress value={snapshot.population.utilization * 100} className="mt-2 h-1.5" />
                  <div className="text-xs text-slate-500 mt-1">{Math.round(snapshot.population.utilization * 100)}% of {snapshot.population.capacity.toLocaleString()} capacity</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                      <Heart className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <div className="text-xs text-emerald-600 uppercase">Happiness</div>
                      <div className="text-xl font-orbitron font-bold text-emerald-900">{Math.round(snapshot.population.happiness * 100)}%</div>
                    </div>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">{happinessLabel(snapshot.population.happiness * 100)}</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="text-xs text-purple-600 uppercase">Growth / hr</div>
                      <div className="text-xl font-orbitron font-bold text-purple-900">
                        {snapshot.population.estimatedGrowthPerHour > 0 ? "+" : ""}{snapshot.population.estimatedGrowthPerHour.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">{snapshot.frame.name} active</div>
                </CardContent>
              </Card>

              <Card className={cn("border", snapshot.food.pressure === "critical" || snapshot.food.pressure === "strained" ? "bg-gradient-to-br from-red-50 to-red-100 border-red-200" : "bg-gradient-to-br from-green-50 to-green-100 border-green-200")}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                      <Wheat className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <div className="text-xs text-amber-600 uppercase">Food</div>
                      <div className="text-xl font-orbitron font-bold text-amber-900">{snapshot.food.stock.toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">{snapshot.food.netPerHour.toFixed(1)}/h net &middot; <Badge className={pressureColor(snapshot.food.pressure)} variant="outline">{snapshot.food.pressure}</Badge></div>
                </CardContent>
              </Card>

              <Card className={cn("border", snapshot.water.pressure === "critical" || snapshot.water.pressure === "strained" ? "bg-gradient-to-br from-red-50 to-red-100 border-red-200" : "bg-gradient-to-br from-cyan-50 to-cyan-100 border-cyan-200")}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center">
                      <Droplets className="w-5 h-5 text-cyan-600" />
                    </div>
                    <div>
                      <div className="text-xs text-cyan-600 uppercase">Water</div>
                      <div className="text-xl font-orbitron font-bold text-cyan-900">{snapshot.water.stock.toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">{snapshot.water.netPerHour.toFixed(1)}/h net &middot; <Badge className={pressureColor(snapshot.water.pressure)} variant="outline">{snapshot.water.pressure}</Badge></div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card className="bg-white border-slate-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-slate-900 text-base">
                      <BarChart3 className="w-5 h-5 text-blue-600" /> Population Distribution by Class
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {sortedClasses.map((pc) => (
                      <div key={pc.key} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <pc.icon className={cn("w-4 h-4", pc.color)} />
                            <span className="font-medium text-slate-800">{pc.label}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-slate-600">{pc.count.toLocaleString()}</span>
                            <span className="text-xs text-slate-400 w-12 text-right">{pc.pct.toFixed(1)}%</span>
                          </div>
                        </div>
                        <Progress value={pc.pct} className="h-2" />
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="bg-white border-slate-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-slate-900 text-base">
                      <Users className="w-5 h-5 text-indigo-600" /> Citizen Class Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {sortedClasses.map((pc) => (
                      <div key={pc.key} className={cn("rounded-lg border p-3", pc.bgColor)}>
                        <div className="flex items-center gap-2 mb-2">
                          <pc.icon className={cn("w-5 h-5", pc.color)} />
                          <span className="font-bold text-slate-800">{pc.label}</span>
                          <span className="text-sm text-slate-500 ml-auto">{pc.count.toLocaleString()}</span>
                        </div>
                        <p className="text-xs text-slate-600">{pc.description}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="bg-white border-slate-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-slate-900 text-base">
                      <Heart className="w-5 h-5 text-emerald-600" /> Happiness & Morale
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-5xl font-orbitron font-bold" style={{ color: happinessColor(snapshot.population.happiness * 100).replace("text-", "") }}>
                        {Math.round(snapshot.population.happiness * 100)}%
                      </div>
                      <Badge className={cn("mt-2", happinessColor(snapshot.population.happiness * 100))} variant="outline">
                        {happinessLabel(snapshot.population.happiness * 100)}
                      </Badge>
                    </div>
                    <Progress value={snapshot.population.happiness * 100} className={cn("h-3", happinessBg(snapshot.population.happiness * 100))} />

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Happiness Threshold</span>
                        <span className="font-medium">{happinessLabel(snapshot.population.happiness * 100)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Frame Stability Bonus</span>
                        <span className="font-medium">+{Math.round(snapshot.frame.stabilityBonus * 100)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Capacity Utilization</span>
                        <span className="font-medium">{Math.round(snapshot.population.utilization * 100)}%</span>
                      </div>
                    </div>

                    <div className="border-t border-slate-200 pt-3 mt-3">
                      <div className="text-xs text-slate-500 uppercase mb-2">Happiness Thresholds</div>
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500" /> 80-100% Ecstatic &mdash; +25% prod, +15% growth</div>
                        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500" /> 60-79% Happy &mdash; +10% prod, +5% growth</div>
                        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-amber-500" /> 40-59% Content &mdash; No bonuses</div>
                        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500" /> 20-39% Unhappy &mdash; -20% prod</div>
                        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-700" /> 0-19% Rebellious &mdash; -50% prod, riots</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border-slate-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-slate-900 text-base">
                      <TrendingUp className="w-5 h-5 text-purple-600" /> Growth & Sustainability
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Growth Rate</span>
                      <span className="font-bold text-emerald-700">+{snapshot.population.estimatedGrowthPerHour.toLocaleString()}/hr</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Food Production</span>
                      <span className="font-medium">{snapshot.food.productionPerHour.toFixed(1)}/hr</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Food Demand</span>
                      <span className="font-medium">{snapshot.food.demandPerHour.toFixed(1)}/hr</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Food Net</span>
                      <span className={cn("font-bold", snapshot.food.netPerHour >= 0 ? "text-emerald-600" : "text-red-600")}>
                        {snapshot.food.netPerHour >= 0 ? "+" : ""}{snapshot.food.netPerHour.toFixed(1)}/hr
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Water Production</span>
                      <span className="font-medium">{snapshot.water.productionPerHour.toFixed(1)}/hr</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Water Demand</span>
                      <span className="font-medium">{snapshot.water.demandPerHour.toFixed(1)}/hr</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Water Net</span>
                      <span className={cn("font-bold", snapshot.water.netPerHour >= 0 ? "text-emerald-600" : "text-red-600")}>
                        {snapshot.water.netPerHour >= 0 ? "+" : ""}{snapshot.water.netPerHour.toFixed(1)}/hr
                      </span>
                    </div>
                    <div className="border-t border-slate-200 pt-3 mt-2">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Food Depletion In</span>
                        <span className="font-bold">{snapshot.food.hoursToDepletion ? `${snapshot.food.hoursToDepletion}h` : "Stable"}</span>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-slate-600">Water Depletion In</span>
                        <span className="font-bold">{snapshot.water.hoursToDepletion ? `${snapshot.water.hoursToDepletion}h` : "Stable"}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border-slate-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-slate-900 text-base">
                      <Orbit className="w-5 h-5 text-slate-600" /> Frame System
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Frame Tier</span>
                      <span className="font-bold">T{snapshot.frameTier}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Frame Name</span>
                      <span className="font-bold">{snapshot.frame.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Capacity Bonus</span>
                      <span className="font-bold">+{Math.round(snapshot.frame.populationCapacityBonus * 100)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Food Efficiency</span>
                      <span className="font-bold">+{Math.round(snapshot.frame.foodEfficiencyBonus * 100)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Water Efficiency</span>
                      <span className="font-bold">+{Math.round(snapshot.frame.waterEfficiencyBonus * 100)}%</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}
      </div>
    </GameLayout>
  );
}
