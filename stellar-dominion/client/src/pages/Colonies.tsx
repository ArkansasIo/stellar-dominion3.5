import GameLayout from "@/components/layout/GameLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Globe, Zap, Users, Shield, Building2, Orbit, Cpu, Wheat, Droplets, TrendingUp } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { SOL_SYSTEM_COLONIES, EMPIRE_SLOTS_LIMIT } from "@/lib/empireManager";
import { cn } from "@/lib/utils";
import Navigation from "./Navigation";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { PLANET_ASSETS } from "@shared/config";

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
  const response = await fetch(url, {
    credentials: "include",
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
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

const TEMP_THEME_IMAGE = "/theme-temp.png";

function getPlanetImagePath(planetClass: string) {
  const normalized = planetClass.toUpperCase();
  if (normalized === "M") return PLANET_ASSETS.TERRESTRIAL.EARTH_LIKE.path;
  if (normalized === "D") return PLANET_ASSETS.TERRESTRIAL.DESERT.path;
  if (normalized === "V") return PLANET_ASSETS.TERRESTRIAL.VOLCANIC.path;
  if (normalized === "R") return PLANET_ASSETS.TERRESTRIAL.JUNGLE.path;
  if (normalized === "G") return PLANET_ASSETS.GAS_GIANTS.JUPITER_CLASS.path;
  if (normalized === "I") return PLANET_ASSETS.TERRESTRIAL.ICE.path;
  if (normalized === "A") return PLANET_ASSETS.EXOTIC.RING_WORLD.path;
  if (normalized === "P") return PLANET_ASSETS.EXOTIC.DYSON_SPHERE.path;
  return PLANET_ASSETS.TERRESTRIAL.EARTH_LIKE.path;
}

export default function Colonies() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [selectedColony, setSelectedColony] = useState<string | null>("1:1:100:3");
  const populationSnapshotQuery = useQuery<PopulationSnapshotResponse>({
    queryKey: ["population-snapshot"],
    queryFn: () => fetchJson<PopulationSnapshotResponse>("/api/population/snapshot"),
    refetchInterval: 30000,
  });
  const colonizeMutation = useMutation({
    mutationFn: async (slot: (typeof SOL_SYSTEM_COLONIES)[number]) => {
      const response = await fetch("/api/game/send-fleet", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          destination: slot.coordinates,
          missionType: "colonize",
          ships: {
            colonyShip: 1,
            lightFighter: 3,
            largeCargo: 1,
          },
        }),
      });

      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(payload?.error || payload?.message || "Failed to queue colonization mission");
      }

      return payload;
    },
    onSuccess: (result, slot) => {
      toast({
        title: "Colonization mission queued",
        description: result?.message || `Fleet launched for ${slot.name} (${slot.coordinates}).`,
      });
      setLocation(`/fleet?tab=active&mission=colonize&targetType=planet`);
    },
    onError: (error: Error) => {
      toast({ title: "Colonization failed", description: error.message, variant: "destructive" });
    },
  });
  const ownedColonies = SOL_SYSTEM_COLONIES.filter(c => c.owner);
  const emptySlots = SOL_SYSTEM_COLONIES.filter(c => !c.owner);
  const totalPopulation = SOL_SYSTEM_COLONIES.reduce((acc, c) => acc + c.population, 0);
  const totalDefenses = SOL_SYSTEM_COLONIES.reduce((acc, c) => acc + c.defenses, 0);
  const selectedColonyData = SOL_SYSTEM_COLONIES.find(c => c.coordinates === selectedColony);
  const snapshot = populationSnapshotQuery.data?.snapshot;

  const classColors: {[key: string]: string} = {
    "M": "bg-blue-100 text-blue-900",
    "D": "bg-red-100 text-red-900",
    "V": "bg-yellow-100 text-yellow-900",
    "R": "bg-gray-100 text-gray-900",
    "G": "bg-green-100 text-green-900",
    "I": "bg-cyan-100 text-cyan-900",
    "A": "bg-amber-100 text-amber-900",
    "P": "bg-purple-100 text-purple-900",
  };

  return (
    <GameLayout>
      <div className="space-y-6 animate-in fade-in duration-500">
        <Navigation />

        <div>
          <h2 className="text-3xl font-orbitron font-bold text-slate-900">Planetary Empire</h2>
          <p className="text-muted-foreground font-rajdhani text-lg">Manage your {ownedColonies.length}/{EMPIRE_SLOTS_LIMIT} colonized worlds.</p>
        </div>

        {/* Empire Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-white border-slate-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="w-5 h-5 text-blue-600" />
                <span className="text-xs uppercase text-slate-600 font-bold">Colonies</span>
              </div>
              <div className="text-2xl font-orbitron font-bold">{ownedColonies.length}/{EMPIRE_SLOTS_LIMIT}</div>
              <Progress value={(ownedColonies.length / EMPIRE_SLOTS_LIMIT) * 100} className="mt-2 h-1" />
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-green-600" />
                <span className="text-xs uppercase text-slate-600 font-bold">Population</span>
              </div>
              <div className="text-2xl font-orbitron font-bold">{(totalPopulation / 1000000).toFixed(1)}M</div>
              <div className="text-xs text-slate-500">{totalPopulation.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-red-600" />
                <span className="text-xs uppercase text-slate-600 font-bold">Defenses</span>
              </div>
              <div className="text-2xl font-orbitron font-bold">{totalDefenses.toLocaleString()}</div>
              <div className="text-xs text-slate-500">Across empire</div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-purple-600" />
                <span className="text-xs uppercase text-slate-600 font-bold">Available Slots</span>
              </div>
              <div className="text-2xl font-orbitron font-bold">{EMPIRE_SLOTS_LIMIT - ownedColonies.length}</div>
              <div className="text-xs text-slate-500">Colonization available</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="owned" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white border border-slate-200 h-16">
            <TabsTrigger value="owned" className="font-orbitron flex flex-col items-center justify-center h-full gap-1">
              <Globe className="w-4 h-4" /> Owned Colonies ({ownedColonies.length})
            </TabsTrigger>
            <TabsTrigger value="available" className="font-orbitron flex flex-col items-center justify-center h-full gap-1">
              <Orbit className="w-4 h-4" /> Available ({emptySlots.length})
            </TabsTrigger>
            <TabsTrigger value="overview" className="font-orbitron flex flex-col items-center justify-center h-full gap-1">
              <Building2 className="w-4 h-4" /> Overview
            </TabsTrigger>
          </TabsList>

          {/* Owned Colonies */}
          <TabsContent value="owned" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ownedColonies.map(colony => (
                <Card
                  key={colony.id}
                  className={cn("cursor-pointer border-slate-200 transition-all", selectedColony === colony.coordinates ? "border-primary shadow-lg" : "hover:shadow-md")}
                  onClick={() => setSelectedColony(colony.coordinates)}
                  data-testid={`colony-card-${colony.id}`}
                >
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={getPlanetImagePath(colony.class)}
                          alt={colony.name}
                          className="w-12 h-12 rounded object-cover border border-slate-200 bg-slate-100"
                          onError={(event) => {
                            event.currentTarget.onerror = null;
                            event.currentTarget.src = TEMP_THEME_IMAGE;
                          }}
                        />
                        <div>
                          <div className="font-orbitron font-bold text-slate-900">{colony.name}</div>
                          <div className="text-xs text-slate-500 font-mono">{colony.coordinates}</div>
                        </div>
                      </div>
                      <Badge className={classColors[colony.class] || "bg-slate-100 text-slate-900"}>
                        {colony.class}
                      </Badge>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Type:</span>
                        <span className="font-bold capitalize">{colony.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Population:</span>
                        <span className="font-bold">{(colony.population / 1000).toFixed(0)}K</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Defenses:</span>
                        <span className="font-bold text-red-600">{colony.defenses}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-1 text-[10px] text-center pt-2 border-t border-slate-200">
                      <div><span className="text-amber-600 font-bold">{colony.resources.metal.toLocaleString()}</span><div>Metal</div></div>
                      <div><span className="text-blue-600 font-bold">{colony.resources.crystal.toLocaleString()}</span><div>Crystal</div></div>
                      <div><span className="text-green-600 font-bold">{colony.resources.deuterium.toLocaleString()}</span><div>Deut</div></div>
                    </div>

                    <Link href={`/planet/${colony.id}`}>
                      <Button size="sm" className="w-full" variant="outline" data-testid={`btn-manage-${colony.id}`}>
                        Manage Colony
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Available Slots */}
          <TabsContent value="available" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {emptySlots.map(slot => (
                <Card key={slot.id} className="border-slate-200 bg-slate-50 opacity-60">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={getPlanetImagePath(slot.class)}
                          alt={slot.name}
                          className="w-12 h-12 rounded object-cover border border-slate-200 bg-slate-100"
                          onError={(event) => {
                            event.currentTarget.onerror = null;
                            event.currentTarget.src = TEMP_THEME_IMAGE;
                          }}
                        />
                        <div>
                          <div className="font-orbitron font-bold text-slate-700">{slot.name}</div>
                          <div className="text-xs text-slate-500 font-mono">{slot.coordinates}</div>
                        </div>
                      </div>
                      <Badge variant="secondary" className={classColors[slot.class] || "bg-slate-100 text-slate-900"}>
                        {slot.class}
                      </Badge>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Type:</span>
                        <span className="font-bold capitalize">{slot.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Status:</span>
                        <Badge variant="outline" className="text-slate-600">Available</Badge>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={() => {
                        setSelectedColony(slot.coordinates);
                        colonizeMutation.mutate(slot);
                      }}
                      disabled={colonizeMutation.isPending}
                      data-testid={`btn-colonize-${slot.id}`}
                    >
                      {colonizeMutation.isPending && colonizeMutation.variables?.id === slot.id ? "Queuing..." : "Colonize"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Overview */}
          <TabsContent value="overview" className="mt-6">
            {selectedColonyData ? (
              <Card className="bg-white border-slate-200">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={getPlanetImagePath(selectedColonyData.class)}
                        alt={selectedColonyData.name}
                        className="w-8 h-8 rounded object-cover border border-slate-200 bg-slate-100"
                        onError={(event) => {
                          event.currentTarget.onerror = null;
                          event.currentTarget.src = TEMP_THEME_IMAGE;
                        }}
                      />
                      {selectedColonyData.name}
                    </div>
                    <Badge className={classColors[selectedColonyData.class] || "bg-slate-100 text-slate-900"}>
                      {selectedColonyData.class}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-4">
                      <div className="bg-slate-50 p-4 rounded border border-slate-200">
                        <div className="text-sm font-bold mb-2 text-slate-700">Colony Details</div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-600">Type:</span>
                            <span className="font-bold capitalize">{selectedColonyData.type}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Coordinates:</span>
                            <span className="font-mono font-bold">{selectedColonyData.coordinates}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">System:</span>
                            <span className="font-bold">{selectedColonyData.systemName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Status:</span>
                            <Badge className="bg-green-100 text-green-900">Active</Badge>
                          </div>
                        </div>
                      </div>

                      <div className="bg-slate-50 p-4 rounded border border-slate-200">
                        <div className="text-sm font-bold mb-2 text-slate-700">Population</div>
                        <div className="text-2xl font-orbitron font-bold mb-2">{(selectedColonyData.population / 1000).toFixed(0)}K</div>
                        <Progress value={75} className="h-2" />
                        <div className="text-xs text-slate-500 mt-1">75% of max capacity</div>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4">
                      <div className="bg-slate-50 p-4 rounded border border-slate-200">
                        <div className="text-sm font-bold mb-3 text-slate-700">Resources</div>
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div className="p-2 bg-white rounded border border-slate-200">
                            <div className="text-lg font-bold text-amber-600">{(selectedColonyData.resources.metal / 1000).toFixed(0)}K</div>
                            <div className="text-xs text-slate-600">Metal</div>
                          </div>
                          <div className="p-2 bg-white rounded border border-slate-200">
                            <div className="text-lg font-bold text-blue-600">{(selectedColonyData.resources.crystal / 1000).toFixed(0)}K</div>
                            <div className="text-xs text-slate-600">Crystal</div>
                          </div>
                          <div className="p-2 bg-white rounded border border-slate-200">
                            <div className="text-lg font-bold text-green-600">{(selectedColonyData.resources.deuterium / 1000).toFixed(0)}K</div>
                            <div className="text-xs text-slate-600">Deut</div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-slate-50 p-4 rounded border border-slate-200">
                        <div className="text-sm font-bold mb-2 text-slate-700">Military</div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-600">Defenses:</span>
                            <span className="font-bold text-red-600">{selectedColonyData.defenses}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Fleet Units:</span>
                            <span className="font-bold">{selectedColonyData.unitCount}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
                    <div className="bg-slate-950 text-white p-4 rounded border border-slate-800">
                      <div className="flex items-center gap-2 text-slate-300 text-xs uppercase tracking-[0.2em]">
                        <Cpu className="w-4 h-4" /> Frame System
                      </div>
                      <div className="mt-3 text-2xl font-orbitron font-bold">T{snapshot?.frameTier ?? "-"}</div>
                      <div className="text-sm text-slate-300">{snapshot?.frame.name ?? "Awaiting sync"}</div>
                      <div className="mt-3 text-xs text-slate-400">
                        Stability +{snapshot ? Math.round(snapshot.frame.stabilityBonus * 100) : 0}%
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded border border-slate-200">
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
                    </div>

                    <div className="bg-white p-4 rounded border border-slate-200">
                      <div className="flex items-center gap-2 text-slate-500 text-xs uppercase tracking-[0.2em]">
                        <Wheat className="w-4 h-4 text-amber-600" /> Food System
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="text-2xl font-orbitron font-bold text-slate-900">{snapshot?.food.stock?.toLocaleString() ?? "-"}</div>
                        <Badge className={pressureClasses(snapshot?.food.pressure ?? "critical")}>{snapshot?.food.pressure ?? "offline"}</Badge>
                      </div>
                      <div className="mt-2 text-xs text-slate-500">
                        {snapshot ? `${snapshot.food.productionPerHour.toFixed(1)}/h produced • ${snapshot.food.demandPerHour.toFixed(1)}/h consumed` : "Awaiting food telemetry"}
                      </div>
                      <div className="mt-2 text-sm font-semibold text-slate-800">
                        Net {snapshot ? snapshot.food.netPerHour.toFixed(1) : "-"}/h
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded border border-slate-200">
                      <div className="flex items-center gap-2 text-slate-500 text-xs uppercase tracking-[0.2em]">
                        <Droplets className="w-4 h-4 text-cyan-600" /> Water System
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="text-2xl font-orbitron font-bold text-slate-900">{snapshot?.water.stock?.toLocaleString() ?? "-"}</div>
                        <Badge className={pressureClasses(snapshot?.water.pressure ?? "critical")}>{snapshot?.water.pressure ?? "offline"}</Badge>
                      </div>
                      <div className="mt-2 text-xs text-slate-500">
                        {snapshot ? `${snapshot.water.productionPerHour.toFixed(1)}/h produced • ${snapshot.water.demandPerHour.toFixed(1)}/h consumed` : "Awaiting water telemetry"}
                      </div>
                      <div className="mt-2 text-sm font-semibold text-slate-800">
                        Net {snapshot ? snapshot.water.netPerHour.toFixed(1) : "-"}/h
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded border border-slate-200">
                      <div className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3">
                        <TrendingUp className="w-4 h-4 text-emerald-600" /> Growth and Sustainability
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        <div className="bg-white rounded border border-slate-200 p-3">
                          <div className="text-xs text-slate-500 uppercase">Growth/hr</div>
                          <div className="font-bold text-slate-900">{snapshot?.population.estimatedGrowthPerHour?.toLocaleString() ?? "-"}</div>
                        </div>
                        <div className="bg-white rounded border border-slate-200 p-3">
                          <div className="text-xs text-slate-500 uppercase">Food Depletion</div>
                          <div className="font-bold text-slate-900">{snapshot?.food.hoursToDepletion ?? "Safe"}</div>
                        </div>
                        <div className="bg-white rounded border border-slate-200 p-3">
                          <div className="text-xs text-slate-500 uppercase">Water Depletion</div>
                          <div className="font-bold text-slate-900">{snapshot?.water.hoursToDepletion ?? "Safe"}</div>
                        </div>
                        <div className="bg-white rounded border border-slate-200 p-3">
                          <div className="text-xs text-slate-500 uppercase">Frame Bonus</div>
                          <div className="font-bold text-slate-900">+{snapshot ? Math.round(snapshot.frame.populationCapacityBonus * 100) : 0}%</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded border border-slate-200">
                      <div className="text-sm font-bold text-slate-700 mb-3">Population Classes</div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {Object.entries(snapshot?.population.classes ?? {}).map(([populationClass, count]) => (
                          <div key={populationClass} className="bg-white rounded border border-slate-200 p-3">
                            <div className="text-xs uppercase text-slate-500">{populationClass}</div>
                            <div className="font-bold text-slate-900">{count.toLocaleString()}</div>
                          </div>
                        ))}
                        {!snapshot && (
                          <div className="col-span-full text-sm text-slate-500">Population telemetry is loading.</div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-white border-slate-200">
                <CardContent className="p-8 text-center text-slate-600">
                  Select a colony to view detailed information
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </GameLayout>
  );
}
