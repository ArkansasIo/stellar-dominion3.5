import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import GameLayout from "@/components/layout/GameLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { BACKGROUND_ASSETS, SHIP_ASSETS, MENU_ASSETS } from "@shared/config";
import { Compass, Swords, ScrollText, Zap, Globe, Coins, ShieldAlert, Award, Star, AlertTriangle, FileText, Box, Sparkles, Orbit, Database, User, FlaskConical, Building2, Send } from "lucide-react";

const TEMP_THEME_IMAGE = "/theme-temp.png";

interface AnomalyConfig {
  id: string;
  name: string;
  description: string;
  type: string;
  rarity: string;
  status: string;
  dangerLevel: number;
  recommendedPower: number;
  maxExplorers: number;
  respawnTimeHours: number;
  entryCost: Record<string, number>;
  rewards: { type: string; name: string; amount: number; chance: number }[];
  lore: string;
  effects: { type: string; value: number; description: string }[];
  region: string;
}

interface AnomalyStatus {
  id: string;
  anomalyId: string;
  discovered: boolean;
  exploredCount: number;
  lastExploredAt: string | null;
  cooldownUntil: string | null;
  anomaly: AnomalyConfig;
}

interface AbyssalGateTier {
  tier: number;
  name: string;
  description: string;
  icon: string;
  color: string;
  tokensPerGate: number;
  maxTokensForChest: number;
  powerRequirement: number;
  gateDifficulty: string;
  rewards: { type: string; amount: number; chance: number }[];
  chestRewards: { name: string; description: string; rarity: string; amount: number; chance: number }[];
}

interface AbyssalGateStatus {
  tier: number;
  completedCount: number;
  totalTokens: number;
  canOpenChest: boolean;
}

interface DimensionalContractTier {
  tier: number;
  name: string;
  description: string;
  icon: string;
  color: string;
  tokensPerRaid: number;
  maxTokensForChest: number;
  raidPowerRequirement: number;
  rewards: { type: string; amount: number; chance: number }[];
  chestRewards: { name: string; description: string; rarity: string; amount: number; chance: number }[];
}

interface ContractStatus {
  tier: number;
  completedRaids: number;
  totalTokens: number;
  canOpenChest: boolean;
}

interface PowerLevelData {
  powerLevel: number;
  tierColor: string;
}

interface PowerSource {
  id: string;
  name: string;
  description: string;
  icon: string;
  baseValue: number;
  multiplier: number;
  maxLevel: number;
}

interface PowerBreakdown {
  commander: number;
  fleet: number;
  research: number;
  buildings: number;
  empireAttributes: number;
  items: number;
  raidCareer: number;
}

interface GateTokenBalance {
  tokenType: string;
  quantity: number;
}

interface GateTokenHistory {
  id: string;
  tokenType: string;
  change: number;
  reason: string;
  createdAt: string;
}

const rarityColors: Record<string, string> = {
  common: "bg-slate-100 text-slate-900",
  uncommon: "bg-green-100 text-green-900",
  rare: "bg-blue-100 text-blue-900",
  epic: "bg-purple-100 text-purple-900",
  legendary: "bg-yellow-100 text-yellow-900",
  mythic: "bg-red-100 text-red-900",
};

const regions = ["Core", "Outer Rim", "Deep Space", "Exotic Space", "Unknown Space"];

export default function DimensionalHub() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [anomalyRegionFilter, setAnomalyRegionFilter] = useState<string>("");
  const [anomalyRarityFilter, setAnomalyRarityFilter] = useState<string>("");
  const [selectedTier, setSelectedTier] = useState<number>(1);
  const [purchaseTokenType, setPurchaseTokenType] = useState<string>("anomaly");
  const [purchaseQuantity, setPurchaseQuantity] = useState<number>(1);
  const [explorationResult, setExplorationResult] = useState<{ anomalyName: string; result: string; lore: string } | null>(null);

  const anomalyConfigQuery = useQuery<{ anomalies: AnomalyConfig[]; regions: string[]; stats: { total: number; discovered: number; explored: number } }>({
    queryKey: ["anomalies-config"],
    queryFn: async () => {
      const res = await fetch("/api/anomalies/config", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load anomaly config");
      return res.json();
    },
  });

  const anomalyStatusQuery = useQuery<{ anomalies: AnomalyStatus[]; summary: { discovered: number; explored: number } }>({
    queryKey: ["anomalies-status"],
    queryFn: async () => {
      const res = await fetch("/api/anomalies", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load anomalies");
      return res.json();
    },
  });

  const gateConfigQuery = useQuery<{ tiers: AbyssalGateTier[] }>({
    queryKey: ["abyssal-gates-config"],
    queryFn: async () => {
      const res = await fetch("/api/abyssal-gates/config", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load gate config");
      return res.json();
    },
  });

  const gateStatusQuery = useQuery<{ tokens: AbyssalGateStatus[] }>({
    queryKey: ["abyssal-gates"],
    queryFn: async () => {
      const res = await fetch("/api/abyssal-gates", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load gates");
      return res.json();
    },
  });

  const contractConfigQuery = useQuery<{ tiers: DimensionalContractTier[] }>({
    queryKey: ["dimensional-contracts-config"],
    queryFn: async () => {
      const res = await fetch("/api/dimensional-contracts/config", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load contract config");
      return res.json();
    },
  });

  const contractStatusQuery = useQuery<{ contracts: ContractStatus[] }>({
    queryKey: ["dimensional-contracts"],
    queryFn: async () => {
      const res = await fetch("/api/dimensional-contracts", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load contracts");
      return res.json();
    },
  });

  const powerLevelQuery = useQuery<PowerLevelData>({
    queryKey: ["power-level"],
    queryFn: async () => {
      const res = await fetch("/api/power-level", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load power level");
      return res.json();
    },
  });

  const powerSourcesQuery = useQuery<{ sources: PowerSource[] }>({
    queryKey: ["power-level-config"],
    queryFn: async () => {
      const res = await fetch("/api/power-level/config", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load power level config");
      return res.json();
    },
  });

  const tokenBalancesQuery = useQuery<{ balances: GateTokenBalance[] }>({
    queryKey: ["gate-tokens-balance"],
    queryFn: async () => {
      const res = await fetch("/api/gate-tokens/balance", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load token balances");
      return res.json();
    },
  });

  const tokenHistoryQuery = useQuery<{ history: GateTokenHistory[] }>({
    queryKey: ["gate-tokens-history"],
    queryFn: async () => {
      const res = await fetch("/api/gate-tokens/history", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load token history");
      return res.json();
    },
  });

  const dailyBonusQuery = useQuery<{ dailyBonus: { region: string; bonus: string } }>({
    queryKey: ["anomalies-daily-bonus"],
    queryFn: async () => {
      const res = await fetch("/api/anomalies/daily-bonus", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load daily bonus");
      return res.json();
    },
  });

  const discoverMutation = useMutation({
    mutationFn: async (anomalyId: string) => {
      const res = await fetch(`/api/anomalies/discover/${anomalyId}`, { method: "POST", credentials: "include" });
      if (!res.ok) { const body = await res.json().catch(() => ({})); throw new Error(body.error || "Failed to discover anomaly"); }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["anomalies-status"] });
      toast({ title: "Anomaly discovered!", description: "You have discovered a dimensional anomaly." });
    },
    onError: (err: Error) => toast({ title: "Discovery failed", description: err.message, variant: "destructive" }),
  });

  const exploreMutation = useMutation({
    mutationFn: async (anomalyId: string) => {
      const res = await fetch(`/api/anomalies/explore/${anomalyId}`, { method: "POST", credentials: "include" });
      if (!res.ok) { const body = await res.json().catch(() => ({})); throw new Error(body.error || "Failed to explore anomaly"); }
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["anomalies-status"] });
      setExplorationResult({ anomalyName: data.record?.anomaly?.name || "Unknown", result: data.explorationResult || "Exploration complete", lore: data.lore || "" });
      toast({ title: "Exploration complete", description: "You have explored the anomaly." });
    },
    onError: (err: Error) => toast({ title: "Exploration failed", description: err.message, variant: "destructive" }),
  });

  const completeGateMutation = useMutation({
    mutationFn: async (tier: number) => {
      const res = await fetch(`/api/abyssal-gates/${tier}/complete`, { method: "POST", credentials: "include" });
      if (!res.ok) { const body = await res.json().catch(() => ({})); throw new Error(body.error || "Failed to complete gate"); }
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["abyssal-gates"] });
      toast({ title: "Gate completed!", description: `Earned ${data.tokensEarned} gate tokens.` });
    },
    onError: (err: Error) => toast({ title: "Gate failed", description: err.message, variant: "destructive" }),
  });

  const openGateChestMutation = useMutation({
    mutationFn: async (tier: number) => {
      const res = await fetch(`/api/abyssal-gates/${tier}/open-chest`, { method: "POST", credentials: "include" });
      if (!res.ok) { const body = await res.json().catch(() => ({})); throw new Error(body.error || "Failed to open chest"); }
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["abyssal-gates"] });
      toast({ title: "Chest opened!", description: "Abyssal gate chest rewards claimed." });
    },
    onError: (err: Error) => toast({ title: "Chest failed", description: err.message, variant: "destructive" }),
  });

  const completeRaidMutation = useMutation({
    mutationFn: async (tier: number) => {
      const res = await fetch(`/api/dimensional-contracts/${tier}/complete-raid`, { method: "POST", credentials: "include" });
      if (!res.ok) { const body = await res.json().catch(() => ({})); throw new Error(body.error || "Failed to complete raid"); }
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["dimensional-contracts"] });
      toast({ title: "Raid complete!", description: `Earned ${data.tokensEarned} contract tokens.` });
    },
    onError: (err: Error) => toast({ title: "Raid failed", description: err.message, variant: "destructive" }),
  });

  const openContractChestMutation = useMutation({
    mutationFn: async (tier: number) => {
      const res = await fetch(`/api/dimensional-contracts/${tier}/open-chest`, { method: "POST", credentials: "include" });
      if (!res.ok) { const body = await res.json().catch(() => ({})); throw new Error(body.error || "Failed to open chest"); }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dimensional-contracts"] });
      toast({ title: "Chest opened!", description: "Contract chest rewards claimed." });
    },
    onError: (err: Error) => toast({ title: "Chest failed", description: err.message, variant: "destructive" }),
  });

  const purchaseTokensMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/gate-tokens/purchase", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tokenType: purchaseTokenType, quantity: purchaseQuantity }),
      });
      if (!res.ok) { const body = await res.json().catch(() => ({})); throw new Error(body.error || "Failed to purchase tokens"); }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gate-tokens-balance"] });
      queryClient.invalidateQueries({ queryKey: ["gate-tokens-history"] });
      toast({ title: "Tokens purchased", description: `Purchased ${purchaseQuantity} ${purchaseTokenType} tokens.` });
    },
    onError: (err: Error) => toast({ title: "Purchase failed", description: err.message, variant: "destructive" }),
  });

  const recalculatePowerMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/power-level", { method: "POST", credentials: "include" });
      if (!res.ok) { const body = await res.json().catch(() => ({})); throw new Error(body.error || "Failed to recalculate"); }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["power-level"] });
      toast({ title: "Power recalculated", description: "Your power level has been updated." });
    },
    onError: (err: Error) => toast({ title: "Recalculation failed", description: err.message, variant: "destructive" }),
  });

  const anomalies = anomalyConfigQuery.data?.anomalies || [];
  const anomalyStatuses = anomalyStatusQuery.data?.anomalies || [];
  const anomalyStats = anomalyConfigQuery.data?.stats || { total: 0, discovered: 0, explored: 0 };
  const anomalyStatusMap = new Map(anomalyStatuses.map((s: AnomalyStatus) => [s.anomalyId, s]));

  const filteredAnomalies = anomalies.filter((a: AnomalyConfig) => {
    if (anomalyRegionFilter && a.region !== anomalyRegionFilter) return false;
    if (anomalyRarityFilter && a.rarity !== anomalyRarityFilter) return false;
    return true;
  });

  const gateTiers = gateConfigQuery.data?.tiers || [];
  const gateStatuses = gateStatusQuery.data?.tokens || [];
  const gateStatusMap = new Map(gateStatuses.map((s: AbyssalGateStatus) => [s.tier, s]));

  const contractTiers = contractConfigQuery.data?.tiers || [];
  const contractStatuses = contractStatusQuery.data?.contracts || [];
  const contractStatusMap = new Map(contractStatuses.map((s: ContractStatus) => [s.tier, s]));

  const tokenBalances = tokenBalancesQuery.data?.balances || [];
  const tokenHistory = tokenHistoryQuery.data?.history || [];

  const getRarityBadge = (rarity: string) => {
    return rarityColors[rarity] || "bg-slate-100 text-slate-900";
  };

  const getDifficultyColor = (difficulty: string) => {
    const map: Record<string, string> = { easy: "text-green-600", medium: "text-yellow-600", hard: "text-orange-600", extreme: "text-red-600", nightmare: "text-purple-600" };
    return map[difficulty] || "text-slate-600";
  };

  const isOnCooldown = (anomalyId: string) => {
    const status = anomalyStatusMap.get(anomalyId);
    if (!status || !status.cooldownUntil) return false;
    return new Date(status.cooldownUntil) > new Date();
  };

  return (
    <GameLayout>
      <div className="space-y-6 animate-in fade-in duration-500">
        <section className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm bg-cover bg-center" style={{ backgroundImage: `linear-gradient(rgba(15,23,42,0.78), rgba(15,23,42,0.92)), url(${BACKGROUND_ASSETS.GALAXY_MAP.path})` }}>
          <div className="p-5 lg:p-6 space-y-4 text-white">
            <div className="flex items-center gap-2">
              <img src={MENU_ASSETS.NAVIGATION.EXPLORATION.path} alt="Icon" className="w-8 h-8 rounded-lg border border-white/10 bg-white/10 p-1.5 object-contain" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = TEMP_THEME_IMAGE; }} />
              <h1 className="text-2xl font-bold">Dimensional Hub</h1>
            </div>
            <p className="text-sm leading-6 text-slate-300">Manage dimensional rifts, abyssal gates, contracts, and your dimensional power level.</p>
            <div className="flex flex-wrap gap-3">
              {[{ label: "Anomalies", image: MENU_ASSETS.NAVIGATION.EXPLORATION.path }, { label: "Gates", image: SHIP_ASSETS.CAPITALS.BATTLESHIP.path }, { label: "Contracts", image: MENU_ASSETS.NAVIGATION.MILITARY.path }].map((item) => (
                <div key={item.label} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                  <img src={item.image} alt={item.label} className="w-10 h-10 rounded-lg border border-white/10 bg-black/10 p-1.5 object-contain" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = TEMP_THEME_IMAGE; }} />
                  <div className="text-sm font-semibold">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Tabs defaultValue="anomalies" className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-white border border-slate-200 h-16">
            <TabsTrigger value="anomalies" className="font-orbitron flex flex-col items-center justify-center h-full gap-1">
              <Compass className="w-4 h-4" /> Anomalies
            </TabsTrigger>
            <TabsTrigger value="gates" className="font-orbitron flex flex-col items-center justify-center h-full gap-1">
              <Globe className="w-4 h-4" /> Gates
            </TabsTrigger>
            <TabsTrigger value="contracts" className="font-orbitron flex flex-col items-center justify-center h-full gap-1">
              <ScrollText className="w-4 h-4" /> Contracts
            </TabsTrigger>
            <TabsTrigger value="power" className="font-orbitron flex flex-col items-center justify-center h-full gap-1">
              <Zap className="w-4 h-4" /> Power
            </TabsTrigger>
            <TabsTrigger value="tokens" className="font-orbitron flex flex-col items-center justify-center h-full gap-1">
              <Coins className="w-4 h-4" /> Tokens
            </TabsTrigger>
          </TabsList>

          {/* ANOMALIES TAB */}
          <TabsContent value="anomalies" className="mt-6 space-y-4">
            <Card className="bg-white border-slate-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Compass className="w-5 h-5 text-purple-600" /> Dimensional Anomalies
                    </CardTitle>
                    <CardDescription>Discover and explore dimensional anomalies across the galaxy.</CardDescription>
                  </div>
                  {dailyBonusQuery.data?.dailyBonus && (
                    <Badge className="bg-amber-100 text-amber-900 border-amber-200">
                      <Star className="w-3 h-3 mr-1" /> Daily Bonus: {dailyBonusQuery.data.dailyBonus.region}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                  <Card className="border-slate-200 bg-slate-50">
                    <CardContent className="p-3 text-center">
                      <div className="text-xs uppercase text-slate-500">Total</div>
                      <div className="text-2xl font-bold text-slate-900">{anomalyStats.total}</div>
                    </CardContent>
                  </Card>
                  <Card className="border-green-200 bg-green-50">
                    <CardContent className="p-3 text-center">
                      <div className="text-xs uppercase text-green-700">Discovered</div>
                      <div className="text-2xl font-bold text-green-900">{anomalyStats.discovered}</div>
                    </CardContent>
                  </Card>
                  <Card className="border-blue-200 bg-blue-50">
                    <CardContent className="p-3 text-center">
                      <div className="text-xs uppercase text-blue-700">Explored</div>
                      <div className="text-2xl font-bold text-blue-900">{anomalyStats.explored}</div>
                    </CardContent>
                  </Card>
                  <Card className="border-purple-200 bg-purple-50">
                    <CardContent className="p-3 text-center">
                      <div className="text-xs uppercase text-purple-700">Remaining</div>
                      <div className="text-2xl font-bold text-purple-900">{anomalyStats.total - anomalyStats.discovered}</div>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <Button variant={anomalyRegionFilter === "" ? "default" : "outline"} size="sm" onClick={() => setAnomalyRegionFilter("")}>All Regions</Button>
                  {regions.map((r) => (
                    <Button key={r} variant={anomalyRegionFilter === r ? "default" : "outline"} size="sm" onClick={() => setAnomalyRegionFilter(anomalyRegionFilter === r ? "" : r)}>{r}</Button>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <Button variant={anomalyRarityFilter === "" ? "default" : "outline"} size="sm" onClick={() => setAnomalyRarityFilter("")}>All Rarities</Button>
                  {["common", "uncommon", "rare", "epic", "legendary", "mythic"].map((r) => (
                    <Button key={r} variant={anomalyRarityFilter === r ? "default" : "outline"} size="sm" onClick={() => setAnomalyRarityFilter(anomalyRarityFilter === r ? "" : r)}>{r.charAt(0).toUpperCase() + r.slice(1)}</Button>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredAnomalies.length === 0 && (
                    <div className="col-span-full text-center py-8 text-slate-500">No anomalies match the current filters.</div>
                  )}
                  {filteredAnomalies.map((anomaly: AnomalyConfig) => {
                    const status = anomalyStatusMap.get(anomaly.id);
                    const discovered = status?.discovered || false;
                    const explored = (status?.exploredCount || 0) > 0;
                    const cooldown = isOnCooldown(anomaly.id);
                    return (
                      <Card key={anomaly.id} className="border-slate-200">
                        <CardContent className="p-4 space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="font-orbitron font-bold text-slate-900">{anomaly.name}</div>
                              <div className="text-xs text-slate-500">{anomaly.type.replace(/_/g, " ")}</div>
                            </div>
                            <Badge className={getRarityBadge(anomaly.rarity)}>{anomaly.rarity}</Badge>
                          </div>
                          <p className="text-xs text-slate-600 line-clamp-2">{anomaly.description}</p>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="flex items-center gap-1"><ShieldAlert className="w-3 h-3 text-red-500" /> Danger: <span className="font-bold">{anomaly.dangerLevel}/10</span></div>
                            <div className="flex items-center gap-1"><Zap className="w-3 h-3 text-amber-500" /> Power: <span className="font-bold">{anomaly.recommendedPower.toLocaleString()}</span></div>
                            <div className="flex items-center gap-1"><Globe className="w-3 h-3 text-blue-500" /> {anomaly.region}</div>
                            <div className="flex items-center gap-1">
                              <span className={`inline-block w-2 h-2 rounded-full ${anomaly.status === "active" ? "bg-green-500" : anomaly.status === "dormant" ? "bg-slate-400" : anomaly.status === "collapsed" ? "bg-red-500" : anomaly.status === "unstable" ? "bg-yellow-500" : "bg-blue-500"}`} />
                              {anomaly.status}
                            </div>
                          </div>
                          {discovered && (
                            <div className="text-xs text-slate-500">
                              Explored: {status?.exploredCount || 0} times
                              {cooldown && <span className="text-red-500 ml-2">(On cooldown)</span>}
                            </div>
                          )}
                          <div className="flex gap-2">
                            {!discovered ? (
                              <Button size="sm" className="flex-1 bg-purple-600 hover:bg-purple-700" onClick={() => discoverMutation.mutate(anomaly.id)} disabled={discoverMutation.isPending}>
                                <Compass className="w-3 h-3 mr-1" /> Discover
                              </Button>
                            ) : (
                              <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={() => exploreMutation.mutate(anomaly.id)} disabled={exploreMutation.isPending || cooldown}>
                                <Zap className="w-3 h-3 mr-1" /> Explore
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* GATES TAB */}
          <TabsContent value="gates" className="mt-6 space-y-4">
            <Card className="bg-white border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-emerald-600" /> Abyssal Gates
                </CardTitle>
                <CardDescription>Complete abyssal gates to earn tokens and open chests for rare rewards.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {gateTiers.map((tier: AbyssalGateTier) => {
                    const status = gateStatusMap.get(tier.tier);
                    const totalTokens = status?.totalTokens || 0;
                    const canOpenChest = status?.canOpenChest || false;
                    const progress = Math.min(totalTokens / tier.maxTokensForChest, 1);
                    return (
                      <Card key={tier.tier} className="border-slate-200">
                        <CardContent className="p-4 space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="font-orbitron font-bold text-slate-900">{tier.name}</div>
                              <div className="text-xs text-slate-500">Tier {tier.tier}</div>
                            </div>
                            <Badge variant="outline" className={getDifficultyColor(tier.gateDifficulty)}>
                              {tier.gateDifficulty}
                            </Badge>
                          </div>
                          <p className="text-xs text-slate-600 line-clamp-2">{tier.description}</p>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="flex items-center gap-1"><Zap className="w-3 h-3 text-amber-500" /> Power: <span className="font-bold">{tier.powerRequirement.toLocaleString()}</span></div>
                            <div className="flex items-center gap-1"><Coins className="w-3 h-3 text-cyan-500" /> Per Run: <span className="font-bold">{tier.tokensPerGate}</span></div>
                          </div>
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-slate-500">Token Progress</span>
                              <span className="font-bold">{totalTokens.toLocaleString()} / {tier.maxTokensForChest.toLocaleString()}</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2">
                              <div className="bg-emerald-500 h-2 rounded-full transition-all" style={{ width: `${(progress * 100).toFixed(1)}%` }} />
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" className="flex-1 bg-emerald-600 hover:bg-emerald-700" onClick={() => completeGateMutation.mutate(tier.tier)} disabled={completeGateMutation.isPending}>
                              Complete Gate
                            </Button>
                            <Button size="sm" variant="outline" className="flex-1" onClick={() => openGateChestMutation.mutate(tier.tier)} disabled={!canOpenChest || openGateChestMutation.isPending}>
                              Open Chest
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* CONTRACTS TAB */}
          <TabsContent value="contracts" className="mt-6 space-y-4">
            <Card className="bg-white border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ScrollText className="w-5 h-5 text-indigo-600" /> Dimensional Contracts
                </CardTitle>
                <CardDescription>Complete raid contracts to earn tokens and open reward chests.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {contractTiers.map((tier: DimensionalContractTier) => {
                    const status = contractStatusMap.get(tier.tier);
                    const totalTokens = status?.totalTokens || 0;
                    const completedRaids = status?.completedRaids || 0;
                    const canOpenChest = status?.canOpenChest || false;
                    const progress = Math.min(totalTokens / tier.maxTokensForChest, 1);
                    return (
                      <Card key={tier.tier} className="border-slate-200">
                        <CardContent className="p-4 space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="font-orbitron font-bold text-slate-900">{tier.name}</div>
                              <div className="text-xs text-slate-500">Tier {tier.tier}</div>
                            </div>
                            <Badge variant="outline" className={tier.color}>{tier.icon}</Badge>
                          </div>
                          <p className="text-xs text-slate-600 line-clamp-2">{tier.description}</p>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="flex items-center gap-1"><Zap className="w-3 h-3 text-amber-500" /> Power: <span className="font-bold">{tier.raidPowerRequirement.toLocaleString()}</span></div>
                            <div className="flex items-center gap-1"><Swords className="w-3 h-3 text-red-500" /> Raids: <span className="font-bold">{completedRaids}</span></div>
                            <div className="flex items-center gap-1"><Coins className="w-3 h-3 text-cyan-500" /> Per Raid: <span className="font-bold">{tier.tokensPerRaid}</span></div>
                          </div>
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-slate-500">Token Progress</span>
                              <span className="font-bold">{totalTokens.toLocaleString()} / {tier.maxTokensForChest.toLocaleString()}</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2">
                              <div className="bg-indigo-500 h-2 rounded-full transition-all" style={{ width: `${(progress * 100).toFixed(1)}%` }} />
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" className="flex-1 bg-indigo-600 hover:bg-indigo-700" onClick={() => completeRaidMutation.mutate(tier.tier)} disabled={completeRaidMutation.isPending}>
                              Complete Raid
                            </Button>
                            <Button size="sm" variant="outline" className="flex-1" onClick={() => openContractChestMutation.mutate(tier.tier)} disabled={!canOpenChest || openContractChestMutation.isPending}>
                              Open Chest
                            </Button>
                          </div>
                          <details className="text-xs">
                            <summary className="cursor-pointer text-slate-500 hover:text-slate-700">Chest rewards preview</summary>
                            <div className="mt-2 space-y-1">
                              {tier.chestRewards.map((r, i) => (
                                <div key={i} className="flex justify-between">
                                  <span>{r.name}</span>
                                  <Badge className={getRarityBadge(r.rarity)} variant="outline">{r.rarity}</Badge>
                                </div>
                              ))}
                            </div>
                          </details>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* POWER TAB */}
          <TabsContent value="power" className="mt-6 space-y-4">
            <Card className="bg-white border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-600" /> Power Level
                </CardTitle>
                <CardDescription>Your total dimensional power and breakdown by category.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {powerLevelQuery.data && (
                  <div className="text-center py-6">
                    <div className="text-sm uppercase tracking-wider text-slate-500 mb-2">Total Dimensional Power</div>
                    <div className="text-5xl font-orbitron font-bold" style={{ color: powerLevelQuery.data.tierColor || "#2563eb" }}>
                      {powerLevelQuery.data.powerLevel.toLocaleString()}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3">
                  {[
                    { key: "commander", label: "Commander", icon: User },
                    { key: "fleet", label: "Fleet", icon: Send },
                    { key: "research", label: "Research", icon: FlaskConical },
                    { key: "buildings", label: "Buildings", icon: Building2 },
                    { key: "empireAttributes", label: "Empire", icon: Globe },
                    { key: "items", label: "Items", icon: Box },
                    { key: "raidCareer", label: "Raid", icon: Swords },
                  ].map(({ key, label, icon: Icon }) => (
                    <Card key={key} className="border-slate-200 bg-slate-50">
                      <CardContent className="p-3 text-center">
                        <Icon className="w-4 h-4 mx-auto mb-1 text-slate-500" />
                        <div className="text-xs text-slate-500">{label}</div>
                        <div className="text-lg font-bold text-slate-900">{(powerLevelQuery.data as any)?.[key] || 0}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="border-t border-slate-200 pt-4">
                  <h3 className="font-bold text-slate-900 mb-3">Power Sources</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {(powerSourcesQuery.data?.sources || []).map((source: PowerSource) => (
                      <div key={source.id} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-semibold text-slate-900">{source.name}</div>
                            <div className="text-xs text-slate-500">{source.description}</div>
                          </div>
                          <Badge variant="outline">x{source.multiplier}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Button onClick={() => recalculatePowerMutation.mutate()} disabled={recalculatePowerMutation.isPending} className="w-full">
                  <Zap className="w-4 h-4 mr-2" /> Recalculate Power Level
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TOKENS TAB */}
          <TabsContent value="tokens" className="mt-6 space-y-4">
            <Card className="bg-white border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Coins className="w-5 h-5 text-yellow-600" /> Gate Tokens
                </CardTitle>
                <CardDescription>Manage your gate tokens, purchase more, and view transaction history.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {tokenBalances.map((bal: GateTokenBalance) => (
                    <Card key={bal.tokenType} className="border-slate-200">
                      <CardContent className="p-4 text-center">
                        <div className="text-xs uppercase text-slate-500 mb-1">{bal.tokenType} Tokens</div>
                        <div className="text-3xl font-orbitron font-bold text-slate-900">{bal.quantity}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card className="border-slate-200 bg-slate-50">
                  <CardContent className="p-4 space-y-3">
                    <h3 className="font-bold text-slate-900">Purchase Tokens</h3>
                    <div className="flex flex-wrap gap-3 items-end">
                      <div className="flex-1 min-w-[120px]">
                        <label className="text-xs text-slate-500 block mb-1">Token Type</label>
                        <select
                          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
                          value={purchaseTokenType}
                          onChange={(e) => setPurchaseTokenType(e.target.value)}
                        >
                          <option value="anomaly">Anomaly Token</option>
                          <option value="raid">Raid Token</option>
                          <option value="exploration">Exploration Token</option>
                        </select>
                      </div>
                      <div className="w-24">
                        <label className="text-xs text-slate-500 block mb-1">Quantity</label>
                        <input
                          type="number"
                          min={1}
                          max={10}
                          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
                          value={purchaseQuantity}
                          onChange={(e) => setPurchaseQuantity(parseInt(e.target.value) || 1)}
                        />
                      </div>
                      <Button onClick={() => purchaseTokensMutation.mutate()} disabled={purchaseTokensMutation.isPending}>
                        <Coins className="w-4 h-4 mr-1" /> Purchase
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <div>
                  <h3 className="font-bold text-slate-900 mb-3">Transaction History</h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {tokenHistory.length === 0 && <p className="text-sm text-slate-500">No transactions yet.</p>}
                    {tokenHistory.map((entry: GateTokenHistory) => (
                      <div key={entry.id} className="flex justify-between items-center rounded-lg border border-slate-200 bg-white p-3 text-sm">
                        <div>
                          <span className="font-semibold capitalize">{entry.tokenType}</span>
                          <span className="text-slate-500 ml-2">{entry.reason}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={entry.change > 0 ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                            {entry.change > 0 ? "+" : ""}{entry.change}
                          </span>
                          <span className="text-xs text-slate-400">{new Date(entry.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {explorationResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setExplorationResult(null)}>
          <Card className="w-full max-w-lg mx-4 bg-white" onClick={(e) => e.stopPropagation()}>
            <CardHeader>
              <CardTitle>Exploration Result: {explorationResult.anomalyName}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-700">{explorationResult.result}</p>
              {explorationResult.lore && (
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <div className="text-xs font-bold uppercase text-slate-500 mb-1">Lore</div>
                  <p className="text-sm text-slate-700 italic">{explorationResult.lore}</p>
                </div>
              )}
              <Button className="w-full" onClick={() => setExplorationResult(null)}>Close</Button>
            </CardContent>
          </Card>
        </div>
      )}
    </GameLayout>
  );
}
