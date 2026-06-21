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
  Sparkles, ChevronRight, CheckCircle2, Circle, Lock,
} from "lucide-react";
import { useState } from "react";

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
  entryCost: { metal?: number; crystal?: number; deuterium?: number; darkMatter?: number };
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
  const [selectedRegion, setSelectedRegion] = useState<string>("all");

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

  return (
    <GameLayout title="Dimensional Anomalies" subtitle="Discover and explore 90 dimensional gates">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{stats?.discovered || 0}</div>
              <div className="text-xs text-muted-foreground">Discovered</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-500">{stats?.explored || 0}</div>
              <div className="text-xs text-muted-foreground">Explored</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-amber-500">{stats?.totalExplores || 0}</div>
              <div className="text-xs text-muted-foreground">Total Explores</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-500">{stats?.completionPercent || 0}%</div>
              <div className="text-xs text-muted-foreground">Completion</div>
            </CardContent>
          </Card>
        </div>

        {/* Region Filter */}
        <div className="flex flex-wrap gap-2">
          {regions.map((r) => (
            <Button
              key={r}
              variant={selectedRegion === r ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedRegion(r)}
              className="capitalize"
            >
              {r === "all" ? "All Regions" : r}
            </Button>
          ))}
        </div>

        {/* Anomaly Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {anomalies.map((anomaly) => (
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

        {anomalies.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Compass className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No anomalies found in this region.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </GameLayout>
  );
}
