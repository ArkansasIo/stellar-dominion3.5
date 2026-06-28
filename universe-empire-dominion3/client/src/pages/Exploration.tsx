import GameLayout from "@/components/layout/GameLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Compass, Zap, AlertTriangle, Database, Star, Trophy } from "lucide-react";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { SPACE_ANOMALIES, generateAnomalyForCoordinates } from "@/lib/spaceAnomalies";
import { WARP_GATES, TRADE_ROUTES, calculateWarpTime, calculateWarpCost } from "@/lib/warpNetwork";
import { ACHIEVEMENTS, QUESTS } from "@/lib/achievementsSystem";
import { UNIVERSE_EVENTS, DEBRIS_FIELDS } from "@/lib/universeEvents";
import { FRONTIER_FEATURES, STRONGHOLD_PROGRAMS, WORMHOLE_ROUTES } from "@/lib/wormholeStrongholdCatalog";
import { cn } from "@/lib/utils";
import Navigation from "./Navigation";

export default function Exploration() {
  const { toast } = useToast();
  const [selectedAnomaly, setSelectedAnomaly] = useState<string | null>(null);
  const [selectedQuest, setSelectedQuest] = useState<string | null>(null);
  const [scannedAnomalies, setScannedAnomalies] = useState<Set<string>>(new Set());
  const [surveyedWormholes, setSurveyedWormholes] = useState<Set<string>>(new Set());

  const explorationStateQuery = useQuery<{ claimedQuestIds: string[]; harvestedDebrisIds: string[] }>({
    queryKey: ["exploration-state"],
    queryFn: async () => {
      const response = await fetch("/api/exploration/state", { credentials: "include" });
      if (!response.ok) {
        throw new Error("Failed to load exploration state");
      }
      return response.json();
    },
    staleTime: 30000,
  });

  const claimedQuestIds = new Set(explorationStateQuery.data?.claimedQuestIds || []);
  const harvestedDebrisIds = new Set(explorationStateQuery.data?.harvestedDebrisIds || []);

  const scanMutation = useMutation({
    mutationFn: async (anomaly: any) => {
      const response = await fetch("/api/exploration/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          anomalyId: anomaly.id,
          anomalyName: anomaly.name,
          hazardLevel: anomaly.hazardLevel,
          rewards: anomaly.rewards,
        }),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || "Failed to scan anomaly");
      }
      return response.json();
    },
    onSuccess: (data, anomaly) => {
      setScannedAnomalies((prev) => new Set(prev).add(anomaly.id));
      toast({
        title: "Anomaly scanned",
        description: `${anomaly.name}: +${data.gained.metal}M, +${data.gained.crystal}C, +${data.gained.deuterium}D`,
      });
    },
    onError: (error: Error) => {
      toast({ title: "Scan failed", description: error.message, variant: "destructive" });
    },
  });

  const gateMutation = useMutation({
    mutationFn: async ({ gate, action }: { gate: any; action: "jump" | "capture" }) => {
      const response = await fetch("/api/exploration/warp-action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          gateId: gate.id,
          gateName: gate.name,
          action,
          energyCost: gate.energyCost,
        }),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || "Failed warp action");
      }
      return response.json();
    },
    onSuccess: (_data, variables) => {
      toast({
        title: variables.action === "jump" ? "Warp jump executed" : "Warp gate captured",
        description: `${variables.gate.name} operation completed.`,
      });
    },
    onError: (error: Error) => {
      toast({ title: "Warp action failed", description: error.message, variant: "destructive" });
    },
  });

  const questClaimMutation = useMutation({
    mutationFn: async (quest: any) => {
      const response = await fetch("/api/exploration/quest-claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          questId: quest.id,
          rewards: quest.rewards,
        }),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || "Failed to claim quest reward");
      }
      return response.json();
    },
    onSuccess: (data, quest) => {
      explorationStateQuery.refetch();
      toast({
        title: "Quest reward claimed",
        description: `${quest.title}: +${data.gain.metal || 0}M, +${data.gain.crystal || 0}C, +${data.gain.deuterium || 0}D, +${data.gain.xp || 0} XP`,
      });
    },
    onError: (error: Error) => {
      toast({ title: "Quest claim failed", description: error.message, variant: "destructive" });
    },
  });

  const debrisHarvestMutation = useMutation({
    mutationFn: async (debris: any) => {
      const response = await fetch("/api/exploration/debris-harvest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          debrisId: debris.id,
          debrisName: debris.name,
          resources: debris.resources,
          harvestProgress: debris.harvestProgress,
        }),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || "Failed to harvest debris");
      }
      return response.json();
    },
    onSuccess: (data, debris) => {
      explorationStateQuery.refetch();
      toast({
        title: "Debris harvested",
        description: `${debris.name}: +${data.gain.metal}M, +${data.gain.crystal}C, +${data.gain.deuterium}D`,
      });
    },
    onError: (error: Error) => {
      toast({ title: "Harvest failed", description: error.message, variant: "destructive" });
    },
  });

  const rarityColors = {
    common: "bg-slate-100 text-slate-900",
    uncommon: "bg-green-100 text-green-900",
    rare: "bg-blue-100 text-blue-900",
    epic: "bg-purple-100 text-purple-900",
    legendary: "bg-yellow-100 text-yellow-900"
  };

  const surveyedCount = surveyedWormholes.size;
  const stabilizedRoutes = WORMHOLE_ROUTES.filter((route) => route.status === "stabilized").length;
  const strongholdIntelCount = STRONGHOLD_PROGRAMS.filter((program) => program.status !== "surveyed").length;
  const frontierUnlockCount = FRONTIER_FEATURES.reduce((sum, feature) => sum + feature.unlocks.length, 0);

  const handleSurveyWormhole = (route: typeof WORMHOLE_ROUTES[number]) => {
    setSurveyedWormholes((prev) => new Set(prev).add(route.id));
    toast({
      title: "Wormhole signature resolved",
      description: `${route.name} mapped. ${route.destinationMask} now feeds exploration, research, and logistics planning.`,
    });
  };

  return (
    <GameLayout>
      <div className="space-y-6 animate-in fade-in duration-500">
        <Navigation />
        
        <div className="relative rounded-xl overflow-hidden shadow-lg" style={{ minHeight: 140 }}>
          <img src="/assets/backgrounds/deep_space.png" alt="Exploration" className="absolute inset-0 w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display='none'; }} />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-cyan-950/60 to-transparent" />
          <div className="relative z-10 p-6 flex items-center gap-6">
            <img src="/assets/ships/scout.png" alt="Scout" className="w-20 h-20 rounded-xl object-cover ring-2 ring-cyan-400/60 shadow-lg" onError={(e) => { e.currentTarget.style.display='none'; }} />
            <div>
              <h2 className="text-3xl font-orbitron font-bold text-white drop-shadow">Deep Space Exploration</h2>
              <p className="text-cyan-300 font-rajdhani text-lg">Discover anomalies, manage warp networks, and pursue achievements.</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="anomalies" className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-white border border-slate-200 h-16">
            <TabsTrigger value="anomalies" className="font-orbitron flex flex-col items-center justify-center h-full gap-1">
              <Compass className="w-4 h-4" /> Anomalies
            </TabsTrigger>
            <TabsTrigger value="warp" className="font-orbitron flex flex-col items-center justify-center h-full gap-1">
              <Zap className="w-4 h-4" /> Warp Network
            </TabsTrigger>
            <TabsTrigger value="trade" className="font-orbitron flex flex-col items-center justify-center h-full gap-1">
              <Database className="w-4 h-4" /> Trade Routes
            </TabsTrigger>
            <TabsTrigger value="quests" className="font-orbitron flex flex-col items-center justify-center h-full gap-1">
              <Trophy className="w-4 h-4" /> Quests
            </TabsTrigger>
            <TabsTrigger value="events" className="font-orbitron flex flex-col items-center justify-center h-full gap-1">
              <AlertTriangle className="w-4 h-4" /> Events
            </TabsTrigger>
          </TabsList>

          {/* Anomalies Tab */}
          <TabsContent value="anomalies" className="mt-6 space-y-4">
            <Card className="bg-white border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Compass className="w-5 h-5 text-orange-600" /> Space Anomalies
                </CardTitle>
                <CardDescription>Discover rare phenomena and exotic resources throughout the galaxy.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {SPACE_ANOMALIES.map(anomaly => (
                    <Card
                      key={anomaly.id}
                      className={cn("cursor-pointer transition-all", selectedAnomaly === anomaly.id ? "border-primary shadow-lg" : "border-slate-200")}
                      onClick={() => setSelectedAnomaly(anomaly.id)}
                      data-testid={`anomaly-card-${anomaly.id}`}
                    >
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-orbitron font-bold text-slate-900">{anomaly.name}</div>
                            <div className="text-xs text-slate-500 font-mono">{anomaly.coordinates}</div>
                          </div>
                          <Badge className={rarityColors[anomaly.rarity]}>
                            {anomaly.rarity}
                          </Badge>
                        </div>
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span className="text-slate-600">Type:</span>
                            <span className="font-bold capitalize">{anomaly.type.replace(/_/g, ' ')}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Hazard:</span>
                            <span className={cn("font-bold", anomaly.hazardLevel > 7 ? "text-red-600" : anomaly.hazardLevel > 4 ? "text-yellow-600" : "text-green-600")}>
                              {anomaly.hazardLevel}/10
                            </span>
                          </div>
                          <div className="mt-2 pt-2 border-t border-slate-200">
                            <div className="text-xs font-bold text-slate-700 mb-1">Potential Rewards:</div>
                            <div className="grid grid-cols-3 gap-1 text-center">
                              <div><span className="text-amber-600">{anomaly.rewards.metal.toLocaleString()}</span><div className="text-[10px]">Metal</div></div>
                              <div><span className="text-blue-600">{anomaly.rewards.crystal.toLocaleString()}</span><div className="text-[10px]">Crystal</div></div>
                              <div><span className="text-green-600">{anomaly.rewards.deuterium.toLocaleString()}</span><div className="text-[10px]">Deut</div></div>
                            </div>
                          </div>
                        </div>
                        {!anomaly.discovered && !scannedAnomalies.has(anomaly.id) && (
                          <Button
                            size="sm"
                            className="w-full mt-2 bg-orange-600 hover:bg-orange-700"
                            onClick={() => scanMutation.mutate(anomaly)}
                            data-testid={`btn-scan-anomaly-${anomaly.id}`}
                          >
                            <Compass className="w-3 h-3 mr-1" /> Scan
                          </Button>
                        )}
                        {(anomaly.discovered || scannedAnomalies.has(anomaly.id)) && (
                          <div className="text-xs text-green-600 font-bold text-center mt-2">✓ Discovered</div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-violet-600" /> Wormhole Recon Grid
                </CardTitle>
                <CardDescription>EVE-inspired frontier routes now plug into exploration, research, refinery fuel chains, and fortress staging.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Card className="border-slate-200 bg-slate-50">
                    <CardContent className="p-3">
                      <div className="text-xs uppercase text-slate-500">Routes Mapped</div>
                      <div className="text-2xl font-bold text-slate-900">{surveyedCount}/{WORMHOLE_ROUTES.length}</div>
                    </CardContent>
                  </Card>
                  <Card className="border-green-200 bg-green-50">
                    <CardContent className="p-3">
                      <div className="text-xs uppercase text-green-700">Stable Routes</div>
                      <div className="text-2xl font-bold text-green-900">{stabilizedRoutes}</div>
                    </CardContent>
                  </Card>
                  <Card className="border-blue-200 bg-blue-50">
                    <CardContent className="p-3">
                      <div className="text-xs uppercase text-blue-700">Stronghold Intel</div>
                      <div className="text-2xl font-bold text-blue-900">{strongholdIntelCount}</div>
                    </CardContent>
                  </Card>
                  <Card className="border-amber-200 bg-amber-50">
                    <CardContent className="p-3">
                      <div className="text-xs uppercase text-amber-700">Frontier Unlocks</div>
                      <div className="text-2xl font-bold text-amber-900">{frontierUnlockCount}</div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {WORMHOLE_ROUTES.map((route) => {
                    const surveyed = surveyedWormholes.has(route.id);
                    return (
                      <Card key={route.id} className={cn("border-2", surveyed ? "border-violet-300 bg-violet-50/40" : "border-slate-200")}>
                        <CardContent className="p-4 space-y-3">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="font-orbitron font-bold text-slate-900">{route.name}</div>
                              <div className="text-xs text-slate-500">{route.className} · {route.locus}</div>
                            </div>
                            <Badge className={route.status === "stabilized" ? "bg-green-100 text-green-900" : route.status === "stabilizing" ? "bg-amber-100 text-amber-900" : "bg-slate-100 text-slate-900"}>
                              {route.status}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="rounded border border-slate-200 bg-white p-2">
                              <div className="text-slate-500">Exit Mask</div>
                              <div className="font-semibold text-slate-900">{route.destinationMask}</div>
                            </div>
                            <div className="rounded border border-slate-200 bg-white p-2">
                              <div className="text-slate-500">Transit Profile</div>
                              <div className="font-semibold text-slate-900">{route.transitProfile}</div>
                            </div>
                            <div className="rounded border border-slate-200 bg-white p-2">
                              <div className="text-slate-500">Lifetime</div>
                              <div className="font-semibold text-slate-900">{route.lifetimeHours}h</div>
                            </div>
                            <div className="rounded border border-slate-200 bg-white p-2">
                              <div className="text-slate-500">Risk</div>
                              <div className={cn("font-semibold", route.risk >= 8 ? "text-red-600" : route.risk >= 6 ? "text-amber-600" : "text-green-600")}>{route.risk}/10</div>
                            </div>
                          </div>

                          <div className="space-y-2 text-xs">
                            <div>
                              <div className="font-bold text-slate-700">Connected Systems</div>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {route.connectedSystems.map((system) => (
                                  <Badge key={system} variant="outline">{system}</Badge>
                                ))}
                              </div>
                            </div>
                            <div>
                              <div className="font-bold text-slate-700">Research Hooks</div>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {route.researchHooks.map((hook) => (
                                  <Badge key={hook} className="bg-blue-100 text-blue-900">{hook}</Badge>
                                ))}
                              </div>
                            </div>
                          </div>

                          <Button
                            size="sm"
                            className="w-full bg-violet-600 hover:bg-violet-700"
                            disabled={surveyed}
                            onClick={() => handleSurveyWormhole(route)}
                            data-testid={`btn-survey-wormhole-${route.id}`}
                          >
                            {surveyed ? "Signature Mapped" : "Survey Signature"}
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <Card className="bg-white border-slate-200">
                <CardHeader>
                  <CardTitle className="text-lg">Frontier Systems Added</CardTitle>
                  <CardDescription>Missing EVE-style loops translated into Stellar Dominion systems and menus.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {FRONTIER_FEATURES.map((feature) => (
                    <div key={feature.id} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                      <div className="flex items-center justify-between gap-3">
                        <div className="font-semibold text-slate-900">{feature.name}</div>
                        <Badge variant="outline">{feature.type}</Badge>
                      </div>
                      <div className="mt-1 text-sm text-slate-600">{feature.summary}</div>
                      <div className="mt-2 text-xs text-slate-500">{feature.gameplay}</div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {feature.linkedSystems.map((system) => (
                          <Badge key={system} className="bg-slate-100 text-slate-700">{system}</Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-white border-slate-200">
                <CardHeader>
                  <CardTitle className="text-lg">Stronghold Intelligence</CardTitle>
                  <CardDescription>Frontier bastions tie wormholes, stations, raids, blueprints, and research together.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {STRONGHOLD_PROGRAMS.map((program) => (
                    <div key={program.id} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-semibold text-slate-900">{program.name}</div>
                          <div className="text-xs text-slate-500">{program.tier} · {program.orbit}</div>
                        </div>
                        <Badge className={program.status === "operational" ? "bg-green-100 text-green-900" : program.status === "contested" ? "bg-red-100 text-red-900" : "bg-blue-100 text-blue-900"}>
                          {program.status}
                        </Badge>
                      </div>
                      <div className="mt-2 text-sm text-slate-600">{program.summary}</div>
                      <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                        <div className="rounded border border-slate-200 bg-white p-2">Defense <span className="font-bold text-slate-900">{program.defense}</span></div>
                        <div className="rounded border border-slate-200 bg-white p-2">Logistics <span className="font-bold text-slate-900">{program.logistics}</span></div>
                        <div className="rounded border border-slate-200 bg-white p-2">Command <span className="font-bold text-slate-900">{program.command}</span></div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Warp Network Tab */}
          <TabsContent value="warp" className="mt-6">
            <Card className="bg-white border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-purple-600" /> Warp Gate Network
                </CardTitle>
                <CardDescription>Control warp gates for instant travel across the universe.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {WARP_GATES.map(gate => (
                    <Card key={gate.id} className="border-slate-200">
                      <CardContent className="p-4 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-orbitron font-bold">{gate.name}</div>
                            <div className="text-xs text-slate-500 font-mono">{gate.coordinates}</div>
                          </div>
                          <Badge variant={gate.owned ? "default" : "secondary"}>
                            {gate.owned ? "Owned" : "Available"}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 text-xs space-y-1">
                          <div>Level: <span className="font-bold">{gate.level}/10</span></div>
                          <div>Energy: <span className="font-bold">{gate.energyCost} Deut</span></div>
                          <div>Travel Time: <span className="font-bold">{Math.ceil(calculateWarpTime(gate.level, 1) / 60)}m</span></div>
                          <div>Cooldown: <span className="font-bold">{gate.cooldown}s</span></div>
                        </div>
                        {gate.linkedGates.length > 0 && (
                          <div className="text-xs bg-slate-50 p-2 rounded">
                            <div className="font-bold mb-1">Linked Gates: {gate.linkedGates.length}</div>
                          </div>
                        )}
                        <Button
                          size="sm"
                          className="w-full mt-2"
                          variant={gate.owned ? "outline" : "default"}
                          onClick={() => gateMutation.mutate({ gate, action: gate.owned ? "jump" : "capture" })}
                          data-testid={`btn-gate-${gate.id}`}
                        >
                          {gate.owned ? "Jump" : "Capture"}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Trade Routes Tab */}
          <TabsContent value="trade" className="mt-6">
            <Card className="bg-white border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-emerald-600" /> Trade Route Network
                </CardTitle>
                <CardDescription>Establish profitable trade routes between systems.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {TRADE_ROUTES.map(route => (
                    <Card key={route.id} className="border-slate-200">
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex-1">
                            <div className="text-sm font-bold">{route.from} → {route.to}</div>
                            <div className="text-xs text-slate-600">Resource: <span className="font-bold capitalize">{route.resource}</span></div>
                          </div>
                          <Badge className={route.active ? "bg-green-100 text-green-900" : "bg-slate-100 text-slate-900"}>
                            {route.active ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-4 text-xs gap-2">
                          <div>Profit: <span className="font-bold text-green-600">+{route.profit}%</span></div>
                          <div>Distance: <span className="font-bold">{route.distance} ly</span></div>
                          <div>Risk: <span className="font-bold">{route.risk}/10</span></div>
                          <div>Freq: <span className="font-bold">{route.frequency}h</span></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Quests Tab */}
          <TabsContent value="quests" className="mt-6">
            <Card className="bg-white border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-600" /> Quests & Achievements
                </CardTitle>
                <CardDescription>Complete quests to earn rewards and unlock achievements.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="font-bold text-slate-900 mb-3">Active Quests</div>
                  {QUESTS.filter(q => q.active).map(quest => (
                    <Card key={quest.id} className={cn("cursor-pointer border-slate-200 transition-all", selectedQuest === quest.id ? "border-primary shadow-lg" : "")} onClick={() => setSelectedQuest(quest.id)} data-testid={`quest-card-${quest.id}`}>
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="font-bold text-slate-900">{quest.title}</div>
                            <div className="text-sm text-slate-600">{quest.description}</div>
                          </div>
                          <Badge className="bg-blue-100 text-blue-900">{quest.difficulty}</Badge>
                        </div>
                        <div className="text-xs space-y-1">
                          {quest.objectives.map(obj => (
                            <div key={obj.id} className="flex items-center gap-2">
                              <div className={cn("w-4 h-4 rounded border", obj.completed ? "bg-green-600 border-green-600" : "border-slate-300")} />
                              <span>{obj.title}</span>
                              <span className="text-slate-500">({obj.current}/{obj.target})</span>
                            </div>
                          ))}
                        </div>
                        <Button
                          size="sm"
                          className="w-full mt-3"
                          disabled={claimedQuestIds.has(quest.id) || questClaimMutation.isPending}
                          onClick={(event) => {
                            event.stopPropagation();
                            questClaimMutation.mutate(quest);
                          }}
                        >
                          {claimedQuestIds.has(quest.id) ? "Reward Claimed" : "Claim Reward"}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="mt-6">
            <Card className="bg-white border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" /> Universe Events & Debris
                </CardTitle>
                <CardDescription>Track active events and harvestable debris fields.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="font-bold text-slate-900 mb-3">Active Universe Events</div>
                  <div className="space-y-2">
                    {UNIVERSE_EVENTS.filter(e => e.active).map(event => (
                      <Card key={event.id} className={cn("border-l-4", event.severity > 7 ? "border-l-red-600" : event.severity > 4 ? "border-l-yellow-600" : "border-l-green-600")}>
                        <CardContent className="p-3">
                          <div className="flex items-start justify-between mb-1">
                            <div className="font-bold">{event.title}</div>
                            <Badge variant="outline">Severity {event.severity}/10</Badge>
                          </div>
                          <p className="text-sm text-slate-600">{event.description}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-4">
                  <div className="font-bold text-slate-900 mb-3">Debris Fields</div>
                  <div className="space-y-2">
                    {DEBRIS_FIELDS.map(debris => (
                      <Card key={debris.id} className="border-slate-200">
                        <CardContent className="p-3">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <div className="font-bold">{debris.name}</div>
                              <div className="text-xs text-slate-500">{debris.coordinates}</div>
                            </div>
                            {debris.harvestedBy && <Badge variant="secondary">Harvesting</Badge>}
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2 mb-2">
                            <div className="bg-blue-600 h-2 rounded-full" style={{width: `${debris.harvestProgress}%`}}></div>
                          </div>
                          <div className="grid grid-cols-3 text-xs">
                            <div><span className="text-amber-600">{debris.resources.metal.toLocaleString()}</span> Metal</div>
                            <div><span className="text-blue-600">{debris.resources.crystal.toLocaleString()}</span> Crystal</div>
                            <div><span className="text-green-600">{debris.resources.deuterium.toLocaleString()}</span> Deut</div>
                          </div>
                          <Button
                            size="sm"
                            className="w-full mt-3"
                            variant="outline"
                            disabled={harvestedDebrisIds.has(debris.id) || debrisHarvestMutation.isPending}
                            onClick={() => debrisHarvestMutation.mutate(debris)}
                          >
                            {harvestedDebrisIds.has(debris.id) ? "Harvested" : "Harvest Debris"}
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </GameLayout>
  );
}
