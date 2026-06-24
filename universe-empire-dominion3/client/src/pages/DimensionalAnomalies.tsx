import GameLayout from "@/components/layout/GameLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Compass, Eye, Zap, Shield, Map, AlertTriangle, Clock, Trophy, Star, Skull,
  Sparkles, ChevronRight, CheckCircle2, Circle, Lock, BarChart3, GitBranch,
  Package, ScrollText, Crosshair, Radar,
} from "lucide-react";
import { useState } from "react";
import { TokensDisplay } from "@/components/gate-tokens/TokensDisplay";

const RARITY_COLORS: Record<string, string> = {
  common: "text-gray-400 border-gray-500/30",
  uncommon: "text-green-400 border-green-500/30",
  rare: "text-blue-400 border-blue-500/30",
  epic: "text-purple-400 border-purple-500/30",
  legendary: "text-amber-400 border-amber-500/30",
  mythic: "text-red-500 border-red-500/30",
};

const RARITY_BG: Record<string, string> = {
  common: "bg-gray-500/10",
  uncommon: "bg-green-500/10",
  rare: "bg-blue-500/10",
  epic: "bg-purple-500/10",
  legendary: "bg-amber-500/10",
  mythic: "bg-red-500/10",
};

const TYPE_ICONS: Record<string, any> = {
  wormhole: Compass,
  rift: Zap,
  void_portal: Eye,
  temporal: Clock,
  nexus: Star,
  gate: Shield,
  abyss: Skull,
  shard: Sparkles,
  mirror: Circle,
  echo: AlertTriangle,
};

const TYPE_DESCRIPTIONS: Record<string, string> = {
  wormhole: "Stable transit corridors connecting distant regions of space",
  rift: "Unstable spatial tears with unpredictable destinations",
  void_portal: "Gateways to extradimensional spaces and pocket universes",
  temporal: "Time-distorted anomalies with temporal manipulation potential",
  nexus: "Central hub anomalies connecting multiple gate networks",
  gate: "Standard dimensional gates with controlled access points",
  abyss: "Dangerous anomalies leading to hostile or unknown realms",
  shard: "Fragmented dimensional fragments with isolated environments",
  mirror: "Reflective anomalies that duplicate or echo spatial properties",
  echo: "Residual dimensional imprints with limited transit capability",
};

interface EntryCost {
  metal?: number;
  crystal?: number;
  deuterium?: number;
  darkMatter?: number;
}

interface AnomalyData {
  id: string;
  name: string;
  description: string;
  type: string;
  rarity: string;
  status: string;
  dangerLevel: number;
  recommendedPower: number;
  region: string;
  discovered: boolean;
  explored: boolean;
  explorationCount: number;
  lastExploredAt: string | null;
  cooldownUntil: string | null;
  entryCost: EntryCost;
  rewards: Array<{ type: string; name: string; amount: number; chance: number }>;
  lore: string;
}

function AnomalyCard({
  anomaly,
  onDiscover,
  onExplore,
  isDiscovering,
  isExploring,
}: {
  anomaly: AnomalyData;
  onDiscover: (id: string) => void;
  onExplore: (id: string) => void;
  isDiscovering: boolean;
  isExploring: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const isOnCooldown = anomaly.cooldownUntil && new Date(anomaly.cooldownUntil) > new Date();
  const cooldownRemaining = isOnCooldown
    ? Math.ceil((new Date(anomaly.cooldownUntil!).getTime() - Date.now()) / (1000 * 60 * 60))
    : 0;
  const Icon = TYPE_ICONS[anomaly.type] || Compass;

  return (
    <Card
      className={cn(
        "relative overflow-hidden cursor-pointer transition-all hover:scale-[1.01]",
        RARITY_BG[anomaly.rarity],
        `border ${RARITY_COLORS[anomaly.rarity]}`
      )}
      onClick={() => setExpanded(!expanded)}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={cn("p-2 rounded-lg", RARITY_BG[anomaly.rarity])}>
              <Icon className={cn("w-5 h-5", RARITY_COLORS[anomaly.rarity])} />
            </div>
            <div>
              <CardTitle className="text-sm">{anomaly.name}</CardTitle>
              <CardDescription className="text-xs">
                {anomaly.region} | Danger {anomaly.dangerLevel}/10
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={cn("text-[10px] capitalize", RARITY_COLORS[anomaly.rarity])}>
              {anomaly.rarity}
            </Badge>
            {anomaly.explored ? (
              <CheckCircle2 className="w-4 h-4 text-green-500" />
            ) : anomaly.discovered ? (
              <Eye className="w-4 h-4 text-blue-400" />
            ) : (
              <Lock className="w-4 h-4 text-slate-500" />
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <p className="text-xs text-muted-foreground">{anomaly.description}</p>

        <div className="flex flex-wrap gap-1">
          {anomaly.rewards.slice(0, 3).map((r, i) => (
            <Badge key={i} variant="secondary" className="text-[10px]">
              {r.name} ({Math.round(r.chance * 100)}%)
            </Badge>
          ))}
        </div>

        {expanded && (
          <div className="space-y-3 pt-2 border-t" onClick={(e) => e.stopPropagation()}>
            <div className="text-xs text-muted-foreground italic">"{anomaly.lore}"</div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-muted-foreground">Power Needed:</span>{" "}
                <span className="font-mono">{anomaly.recommendedPower}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Explorations:</span>{" "}
                <span className="font-mono">{anomaly.explorationCount}</span>
              </div>
            </div>

            <div className="text-xs">
              <span className="text-muted-foreground">Entry Cost:</span>
              <div className="flex gap-2 mt-1">
                {anomaly.entryCost.metal && <span>Metal: {anomaly.entryCost.metal.toLocaleString()}</span>}
                {anomaly.entryCost.crystal && <span>Crystal: {anomaly.entryCost.crystal.toLocaleString()}</span>}
                {anomaly.entryCost.deuterium && <span>Deuterium: {anomaly.entryCost.deuterium.toLocaleString()}</span>}
                {anomaly.entryCost.darkMatter && <span>DM: {anomaly.entryCost.darkMatter}</span>}
              </div>
            </div>

            <div className="text-xs">
              <span className="text-muted-foreground">All Rewards:</span>
              <div className="space-y-1 mt-1">
                {anomaly.rewards.map((r, i) => (
                  <div key={i} className="flex justify-between">
                    <span>{r.name}</span>
                    <span className="text-muted-foreground">
                      {r.amount.toLocaleString()} ({Math.round(r.chance * 100)}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              {!anomaly.discovered ? (
                <Button
                  size="sm"
                  onClick={() => onDiscover(anomaly.id)}
                  disabled={isDiscovering}
                  className="flex-1"
                >
                  {isDiscovering ? "Discovering..." : "Discover"}
                </Button>
              ) : isOnCooldown ? (
                <Button size="sm" disabled className="flex-1">
                  Cooldown ({cooldownRemaining}h)
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={() => onExplore(anomaly.id)}
                  disabled={isExploring}
                  className="flex-1"
                >
                  {isExploring ? "Exploring..." : "Explore"}
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function DimensionalAnomaliesPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedRarity, setSelectedRarity] = useState<string>("all");
  const [expandedAnomaly, setExpandedAnomaly] = useState<string | null>(null);

  const { data: anomaliesData } = useQuery<{ success: boolean; anomalies: AnomalyData[]; summary: any }>({
    queryKey: ["/api/anomalies", selectedRegion],
    queryFn: async () => {
      const url = selectedRegion === "all"
        ? "/api/anomalies"
        : `/api/anomalies?region=${selectedRegion}`;
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load anomalies");
      return res.json();
    },
  });

  const { data: statsData } = useQuery<{ success: boolean; stats: any }>({
    queryKey: ["/api/anomalies/stats"],
    queryFn: async () => {
      const res = await fetch("/api/anomalies/stats", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load stats");
      return res.json();
    },
  });

  const discoverMutation = useMutation({
    mutationFn: async (anomalyId: string) => {
      const res = await fetch(`/api/anomalies/discover/${anomalyId}`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to discover");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/anomalies"] });
      toast({ title: "Anomaly Discovered", description: "New anomaly location recorded" });
    },
  });

  const exploreMutation = useMutation({
    mutationFn: async (anomalyId: string) => {
      const res = await fetch(`/api/anomalies/explore/${anomalyId}`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to explore");
      }
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/anomalies"] });
      const rewards = data.explorationResult?.rewards || [];
      const rewardNames = rewards.map((r: any) => r.name).join(", ");
      toast({
        title: "Exploration Complete",
        description: rewardNames || "No rewards found",
      });
    },
    onError: (error: Error) => {
      toast({ title: "Exploration Failed", description: error.message, variant: "destructive" });
    },
  });

  const anomalies = anomaliesData?.anomalies || [];
  const summary = anomaliesData?.summary;
  const stats = statsData?.stats;
  const regions = ["all", "Core", "Outer Rim", "Deep Space", "Exotic Space", "Unknown Space"];
  const anomalyTypes = Array.from(new Set(anomalies.map(a => a.type)));
  const rarityTypes = Array.from(new Set(anomalies.map(a => a.rarity)));

  const filteredAnomalies = anomalies.filter(a => {
    const typeMatch = selectedType === "all" || a.type === selectedType;
    const rarityMatch = selectedRarity === "all" || a.rarity === selectedRarity;
    return typeMatch && rarityMatch;
  });

  const discoveredAnomalies = anomalies.filter(a => a.discovered);
  const exploredAnomalies = anomalies.filter(a => a.explored);
  const lockedAnomalies = anomalies.filter(a => !a.discovered);

  const getCompletionPercentage = () => {
    if (!anomalies.length) return 0;
    return Math.round((exploredAnomalies.length / anomalies.length) * 100);
  };

  const getTypeStats = () => {
    const typeStats: Record<string, number> = {};
    anomalies.forEach(a => {
      typeStats[a.type] = (typeStats[a.type] || 0) + 1;
    });
    return typeStats;
  };

  const getRarityStats = () => {
    const rarityStats: Record<string, number> = {};
    anomalies.forEach(a => {
      rarityStats[a.rarity] = (rarityStats[a.rarity] || 0) + 1;
    });
    return rarityStats;
  };

  const typeStats = getTypeStats();
  const rarityStats = getRarityStats();

  return (
    <GameLayout title="Dimensional Anomalies" subtitle="Discover and explore 90 dimensional gates">
      <div className="space-y-6">
        {/* Gate Tokens Display */}
        <TokensDisplay />

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="database" className="flex items-center gap-2">
              <ScrollText className="w-4 h-4" />
              Database
            </TabsTrigger>
            <TabsTrigger value="network" className="flex items-center gap-2">
              <GitBranch className="w-4 h-4" />
              Gate Network
            </TabsTrigger>
            <TabsTrigger value="exploration" className="flex items-center gap-2">
              <Radar className="w-4 h-4" />
              Exploration Log
            </TabsTrigger>
            <TabsTrigger value="rewards" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Rewards
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-blue-600 uppercase tracking-wider">Discovered</div>
                      <div className="text-2xl font-orbitron font-bold text-blue-900">{discoveredAnomalies.length}</div>
                    </div>
                    <Eye className="w-8 h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-green-600 uppercase tracking-wider">Explored</div>
                      <div className="text-2xl font-orbitron font-bold text-green-900">{exploredAnomalies.length}</div>
                    </div>
                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-amber-600 uppercase tracking-wider">Locked</div>
                      <div className="text-2xl font-orbitron font-bold text-amber-900">{lockedAnomalies.length}</div>
                    </div>
                    <Lock className="w-8 h-8 text-amber-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-purple-600 uppercase tracking-wider">Completion</div>
                      <div className="text-2xl font-orbitron font-bold text-purple-900">{getCompletionPercentage()}%</div>
                    </div>
                    <Trophy className="w-8 h-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Type Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crosshair className="w-5 h-5" />
                  Anomaly Type Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {Object.entries(typeStats).map(([type, count]) => {
                    const Icon = TYPE_ICONS[type] || Compass;
                    return (
                      <div key={type} className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Icon className="w-4 h-4 text-primary" />
                          <div className="text-xs font-bold uppercase tracking-wider text-slate-600 capitalize">{type}</div>
                        </div>
                        <div className="text-xl font-orbitron font-bold text-slate-900">{count}</div>
                        <div className="text-[10px] text-slate-500 mt-1">{TYPE_DESCRIPTIONS[type] || "Unknown anomaly type"}</div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Rarity Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Rarity Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                  {Object.entries(rarityStats).map(([rarity, count]) => (
                    <div key={rarity} className={cn("rounded-lg p-3 border", RARITY_BG[rarity], RARITY_COLORS[rarity])}>
                      <div className="text-xs font-bold uppercase tracking-wider capitalize mb-1">{rarity}</div>
                      <div className="text-xl font-orbitron font-bold">{count}</div>
                      <div className="text-[10px] text-slate-500 mt-1">
                        {Math.round((count / anomalies.length) * 100)}% of total
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Recent Exploration Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {exploredAnomalies.slice(0, 5).map(anomaly => (
                    <div key={anomaly.id} className="flex items-center justify-between p-2 bg-slate-50 rounded border border-slate-200">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <div>
                          <div className="text-sm font-semibold text-slate-900">{anomaly.name}</div>
                          <div className="text-xs text-slate-500">{anomaly.region} • {anomaly.type}</div>
                        </div>
                      </div>
                      <div className="text-xs text-slate-500">
                        {anomaly.lastExploredAt ? new Date(anomaly.lastExploredAt).toLocaleDateString() : "Unknown"}
                      </div>
                    </div>
                  ))}
                  {exploredAnomalies.length === 0 && (
                    <div className="text-center py-4 text-sm text-muted-foreground">
                      No explorations yet. Start discovering anomalies!
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Database Tab */}
          <TabsContent value="database" className="space-y-4">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Filter Anomalies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">Region</label>
                    <select
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={selectedRegion}
                      onChange={(e) => setSelectedRegion(e.target.value)}
                    >
                      {regions.map(r => (
                        <option key={r} value={r}>{r === "all" ? "All Regions" : r}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">Type</label>
                    <select
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                    >
                      <option value="all">All Types</option>
                      {anomalyTypes.map(type => (
                        <option key={type} value={type} className="capitalize">{type}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">Rarity</label>
                    <select
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={selectedRarity}
                      onChange={(e) => setSelectedRarity(e.target.value)}
                    >
                      <option value="all">All Rarities</option>
                      {rarityTypes.map(rarity => (
                        <option key={rarity} value={rarity} className="capitalize">{rarity}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Anomaly List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAnomalies.map((anomaly) => (
                <AnomalyCard
                  key={anomaly.id}
                  anomaly={anomaly}
                  onDiscover={(id) => discoverMutation.mutate(id)}
                  onExplore={(id) => exploreMutation.mutate(id)}
                  isDiscovering={discoverMutation.isPending}
                  isExploring={exploreMutation.isPending}
                />
              ))}
            </div>

            {filteredAnomalies.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <Compass className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No anomalies match the current filters.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Gate Network Tab */}
          <TabsContent value="network" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GitBranch className="w-5 h-5" />
                  Dimensional Gate Network Topology
                </CardTitle>
                <CardDescription>
                  Visualize connections between discovered anomalies and gate routes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Network Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                      <div className="text-xs text-slate-600 uppercase tracking-wider mb-2">Active Gates</div>
                      <div className="text-2xl font-orbitron font-bold text-slate-900">{discoveredAnomalies.length}</div>
                      <div className="text-xs text-slate-500 mt-1">Operational connections</div>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                      <div className="text-xs text-slate-600 uppercase tracking-wider mb-2">Network Coverage</div>
                      <div className="text-2xl font-orbitron font-bold text-slate-900">{regions.length - 1}</div>
                      <div className="text-xs text-slate-500 mt-1">Regions connected</div>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                      <div className="text-xs text-slate-600 uppercase tracking-wider mb-2">Avg. Power</div>
                      <div className="text-2xl font-orbitron font-bold text-slate-900">
                        {discoveredAnomalies.length ? Math.round(discoveredAnomalies.reduce((sum, a) => sum + a.recommendedPower, 0) / discoveredAnomalies.length) : 0}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">Power requirement</div>
                    </div>
                  </div>

                  {/* Gate Registry */}
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 mb-3">Discovered Gate Registry</h3>
                    <ScrollArea className="h-[400px] rounded-md border border-slate-200">
                      <div className="space-y-2 p-3">
                        {discoveredAnomalies.map(anomaly => {
                          const Icon = TYPE_ICONS[anomaly.type] || Compass;
                          return (
                            <div key={anomaly.id} className="bg-white rounded-lg p-3 border border-slate-200 hover:border-primary/50 transition-colors">
                              <div className="flex items-start justify-between">
                                <div className="flex items-start gap-3">
                                  <div className={cn("p-2 rounded-lg", RARITY_BG[anomaly.rarity])}>
                                    <Icon className={cn("w-5 h-5", RARITY_COLORS[anomaly.rarity])} />
                                  </div>
                                  <div>
                                    <div className="font-semibold text-slate-900">{anomaly.name}</div>
                                    <div className="text-xs text-slate-500 mt-1">{anomaly.region} • {anomaly.type}</div>
                                    <div className="text-xs text-slate-600 mt-2">{TYPE_DESCRIPTIONS[anomaly.type]}</div>
                                  </div>
                                </div>
                                <Badge variant="outline" className={cn("text-[10px] capitalize", RARITY_COLORS[anomaly.rarity])}>
                                  {anomaly.rarity}
                                </Badge>
                              </div>
                              <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-xs">
                                <div>
                                  <span className="text-muted-foreground">Power:</span>{" "}
                                  <span className="font-mono font-bold">{anomaly.recommendedPower}</span>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Danger:</span>{" "}
                                  <span className="font-mono font-bold">{anomaly.dangerLevel}/10</span>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Status:</span>{" "}
                                  <span className="font-bold capitalize text-green-600">Active</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        {discoveredAnomalies.length === 0 && (
                          <div className="text-center py-8 text-sm text-muted-foreground">
                            No gates discovered yet. Explore anomalies to build the network!
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Exploration Log Tab */}
          <TabsContent value="exploration" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Radar className="w-5 h-5" />
                  Exploration Mission Log
                </CardTitle>
                <CardDescription>
                  Track all exploration missions and their outcomes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {exploredAnomalies.length === 0 ? (
                    <div className="text-center py-12">
                      <Radar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-2">No exploration missions completed</p>
                      <p className="text-xs text-muted-foreground">Discover and explore anomalies to build your mission log</p>
                    </div>
                  ) : (
                    <ScrollArea className="h-[500px] rounded-md border border-slate-200">
                      <div className="space-y-2 p-3">
                        {exploredAnomalies.map(anomaly => {
                          const Icon = TYPE_ICONS[anomaly.type] || Compass;
                          return (
                            <div key={anomaly.id} className="bg-white rounded-lg p-4 border border-slate-200">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-start gap-3">
                                  <div className={cn("p-2 rounded-lg", RARITY_BG[anomaly.rarity])}>
                                    <Icon className={cn("w-5 h-5", RARITY_COLORS[anomaly.rarity])} />
                                  </div>
                                  <div>
                                    <div className="font-semibold text-slate-900">{anomaly.name}</div>
                                    <div className="text-xs text-slate-500 mt-1">
                                      {anomaly.region} • Explored {anomaly.explorationCount} times
                                    </div>
                                  </div>
                                </div>
                                <Badge variant="outline" className={cn("text-[10px] capitalize", RARITY_COLORS[anomaly.rarity])}>
                                  {anomaly.rarity}
                                </Badge>
                              </div>

                              <div className="bg-slate-50 rounded p-3 mb-3">
                                <div className="text-xs text-slate-600 italic">"{anomaly.lore}"</div>
                              </div>

                              <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                                <div>
                                  <span className="text-muted-foreground">Danger Level:</span>{" "}
                                  <span className="font-mono font-bold">{anomaly.dangerLevel}/10</span>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Power Used:</span>{" "}
                                  <span className="font-mono font-bold">{anomaly.recommendedPower}</span>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Last Explored:</span>{" "}
                                  <span className="font-mono">
                                    {anomaly.lastExploredAt ? new Date(anomaly.lastExploredAt).toLocaleString() : "Unknown"}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Status:</span>{" "}
                                  <span className="font-bold capitalize text-green-600">Complete</span>
                                </div>
                              </div>

                              <div>
                                <div className="text-xs font-bold text-slate-700 mb-2">Rewards Obtained:</div>
                                <div className="space-y-1">
                                  {anomaly.rewards.map((r, i) => (
                                    <div key={i} className="flex justify-between text-xs bg-white p-2 rounded border border-slate-200">
                                      <span className="font-semibold">{r.name}</span>
                                      <span className="text-muted-foreground">
                                        {r.amount.toLocaleString()} ({Math.round(r.chance * 100)}%)
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </ScrollArea>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Rewards Tab */}
          <TabsContent value="rewards" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Reward Inventory & Analysis
                </CardTitle>
                <CardDescription>
                  Comprehensive breakdown of all obtainable rewards from anomalies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Reward Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 rounded-lg p-4">
                      <div className="text-xs text-amber-600 uppercase tracking-wider mb-2">Total Reward Types</div>
                      <div className="text-3xl font-orbitron font-bold text-amber-900">
                        {new Set(anomalies.flatMap(a => a.rewards.map(r => r.type))).size}
                      </div>
                      <div className="text-xs text-amber-600 mt-1">Unique reward categories</div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 rounded-lg p-4">
                      <div className="text-xs text-blue-600 uppercase tracking-wider mb-2">Total Exploration Rewards</div>
                      <div className="text-3xl font-orbitron font-bold text-blue-900">
                        {anomalies.reduce((sum, a) => sum + a.rewards.length, 0)}
                      </div>
                      <div className="text-xs text-blue-600 mt-1">Reward instances available</div>
                    </div>
                  </div>

                  {/* Reward Catalog */}
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 mb-3">Reward Catalog by Anomaly</h3>
                    <ScrollArea className="h-[500px] rounded-md border border-slate-200">
                      <div className="space-y-3 p-3">
                        {anomalies.map(anomaly => {
                          const Icon = TYPE_ICONS[anomaly.type] || Compass;
                          return (
                            <div key={anomaly.id} className="bg-white rounded-lg p-4 border border-slate-200">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-start gap-3">
                                  <div className={cn("p-2 rounded-lg", RARITY_BG[anomaly.rarity])}>
                                    <Icon className={cn("w-5 h-5", RARITY_COLORS[anomaly.rarity])} />
                                  </div>
                                  <div>
                                    <div className="font-semibold text-slate-900">{anomaly.name}</div>
                                    <div className="text-xs text-slate-500 mt-1">{anomaly.region} • {anomaly.rarity}</div>
                                  </div>
                                </div>
                                <Badge variant="outline" className={cn("text-[10px] capitalize", RARITY_COLORS[anomaly.rarity])}>
                                  {anomaly.rarity}
                                </Badge>
                              </div>

                              <div className="space-y-1">
                                {anomaly.rewards.map((reward, i) => (
                                  <div key={i} className="flex items-center justify-between p-2 bg-slate-50 rounded border border-slate-200">
                                    <div className="flex items-center gap-2">
                                      <Package className="w-3 h-3 text-primary" />
                                      <span className="text-xs font-semibold">{reward.name}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      <span className="text-xs font-mono font-bold">{reward.amount.toLocaleString()}</span>
                                      <span className="text-[10px] text-muted-foreground">
                                        {Math.round(reward.chance * 100)}%
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </ScrollArea>
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
