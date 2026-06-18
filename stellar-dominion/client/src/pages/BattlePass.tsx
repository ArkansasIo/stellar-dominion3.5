import GameLayout from "@/components/layout/GameLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Swords, Gift } from "lucide-react";

interface BattleReward {
  tier: number;
  rewardType: "currency" | "item";
  currency?: "silver" | "gold" | "platinum";
  amount?: number;
  itemId?: string;
  quantity?: number;
}

interface BattleMission {
  id: string;
  title: string;
  missionType: "daily" | "weekly" | "seasonal";
  objectiveType: "battle" | "research" | "economy" | "exploration" | "construction";
  objectiveTarget: number;
  xpReward: number;
}

interface BattlePassOverview {
  config: {
    battlePassId: string;
    name: string;
    seasonAlignment: string;
    maxTier: number;
    xpPerTier: number;
    unlockTracks: {
      premium: { currency: "silver" | "gold" | "platinum"; cost: number };
      elite: { currency: "silver" | "gold" | "platinum"; cost: number };
    };
    freeRewards: BattleReward[];
    premiumRewards: BattleReward[];
    eliteRewards: BattleReward[];
    missions: BattleMission[];
  };
  state: {
    battlePassId: string;
    xp: number;
    currentTier: number;
    xpIntoTier: number;
    xpForNextTier: number;
    completionRatio: number;
    claimedFree: number[];
    claimedPremium: number[];
    claimedElite: number[];
    premiumUnlocked: boolean;
    eliteUnlocked: boolean;
  };
}

function rewardLabel(reward: BattleReward): string {
  if (reward.rewardType === "currency") {
    return `${(reward.amount || 0).toLocaleString()} ${reward.currency || "silver"}`;
  }
  return `${reward.quantity || 1}x ${reward.itemId || "reward item"}`;
}

export default function BattlePass() {
  const { toast } = useToast();

  const { data, isLoading } = useQuery<BattlePassOverview>({
    queryKey: ["/api/battle-pass/overview"],
    queryFn: async () => {
      const res = await fetch("/api/battle-pass/overview", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load battle pass overview");
      return res.json();
    },
  });

  const addXpMutation = useMutation({
    mutationFn: async (xp: number) => {
      const res = await apiRequest("POST", "/api/battle-pass/xp", { xp });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/battle-pass/overview"] });
      toast({ title: "Battle XP Added", description: "Battle pass progression updated." });
    },
    onError: (error: any) => {
      toast({ title: "Failed to add XP", description: error?.message || "Unknown error", variant: "destructive" });
    },
  });

  const claimMutation = useMutation({
    mutationFn: async ({ tier, track }: { tier: number; track: "free" | "premium" | "elite" }) => {
      const res = await apiRequest("POST", "/api/battle-pass/claim", { tier, track });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/battle-pass/overview"] });
      toast({ title: "Reward Claimed", description: "Battle pass reward delivered." });
    },
    onError: (error: any) => {
      toast({ title: "Claim failed", description: error?.message || "Unknown error", variant: "destructive" });
    },
  });

  const unlockTrackMutation = useMutation({
    mutationFn: async (track: "premium" | "elite") => {
      const res = await apiRequest("POST", "/api/battle-pass/premium/unlock", { track });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/battle-pass/overview"] });
      toast({ title: "Track Unlocked", description: "Battle pass premium track activated." });
    },
    onError: (error: any) => {
      toast({ title: "Unlock failed", description: error?.message || "Unknown error", variant: "destructive" });
    },
  });

  const battle = data?.state;
  const config = data?.config;
  const progressPct = Math.min(100, (battle?.completionRatio || 0) * 100);
  const totalMissions = config?.missions?.length || 0;
  const freeClaims = battle?.claimedFree?.length || 0;
  const premiumClaims = battle?.claimedPremium?.length || 0;
  const eliteClaims = battle?.claimedElite?.length || 0;

  return (
    <GameLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-orbitron font-bold text-slate-900">Battle Pass</h2>
          <p className="text-muted-foreground font-rajdhani text-lg">Complete missions, gain battle XP, and claim Free, Premium, and Elite rewards.</p>
        </div>

        <Card className="bg-white border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Swords className="w-5 h-5 text-primary" /> {config?.name || "Loading Battle Pass"}</CardTitle>
            <CardDescription>{config?.battlePassId || "battle-pass"} • aligned with {config?.seasonAlignment || "season"}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <div className="text-sm text-slate-500">Loading battle pass...</div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-slate-50 border border-slate-200 rounded p-3">
                    <div className="text-xs text-slate-500 uppercase">Current Tier</div>
                    <div className="text-2xl font-orbitron text-slate-900">{battle?.currentTier || 1}</div>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded p-3">
                    <div className="text-xs text-slate-500 uppercase">Battle XP</div>
                    <div className="text-2xl font-orbitron text-slate-900">{(battle?.xp || 0).toLocaleString()}</div>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded p-3">
                    <div className="text-xs text-slate-500 uppercase">XP Into Tier</div>
                    <div className="text-2xl font-orbitron text-slate-900">{(battle?.xpIntoTier || 0).toLocaleString()}</div>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded p-3">
                    <div className="text-xs text-slate-500 uppercase">XP / Tier</div>
                    <div className="text-2xl font-orbitron text-slate-900">{(battle?.xpForNextTier || config?.xpPerTier || 0).toLocaleString()}</div>
                  </div>
                </div>

                <Progress value={progressPct} className="h-2" />

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => addXpMutation.mutate(900)} disabled={addXpMutation.isPending}>
                    +1 Tier XP
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => addXpMutation.mutate(1800)} disabled={addXpMutation.isPending}>
                    +2 Tier XP
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-white border-slate-200"><CardContent className="p-4"><div className="text-xs uppercase text-slate-500">Missions</div><div className="text-2xl font-orbitron font-bold text-slate-900">{totalMissions}</div></CardContent></Card>
          <Card className="bg-white border-slate-200"><CardContent className="p-4"><div className="text-xs uppercase text-slate-500">Free Claimed</div><div className="text-2xl font-orbitron font-bold text-emerald-700">{freeClaims}</div></CardContent></Card>
          <Card className="bg-white border-slate-200"><CardContent className="p-4"><div className="text-xs uppercase text-slate-500">Premium Claimed</div><div className="text-2xl font-orbitron font-bold text-amber-700">{premiumClaims}</div></CardContent></Card>
          <Card className="bg-white border-slate-200"><CardContent className="p-4"><div className="text-xs uppercase text-slate-500">Elite Claimed</div><div className="text-2xl font-orbitron font-bold text-indigo-700">{eliteClaims}</div></CardContent></Card>
        </div>

        <Card className="bg-amber-50 border-amber-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-amber-900">Battle Pass Optimization Guide</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-amber-900">
            <div className="rounded border border-amber-200 bg-white/70 p-3">Prioritize weekly missions to smooth progression and reduce daily grind volatility.</div>
            <div className="rounded border border-amber-200 bg-white/70 p-3">Delay claim windows until major build queues begin to stack resource injections efficiently.</div>
            <div className="rounded border border-amber-200 bg-white/70 p-3">Unlock premium before tier spikes so claimable backlog converts immediately into power gains.</div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200">
          <CardHeader>
            <CardTitle>Mission Board</CardTitle>
            <CardDescription>Daily, weekly, and seasonal directives for battle pass XP gains.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {(config?.missions || []).slice(0, 9).map((mission) => (
              <div key={mission.id} className="bg-slate-50 border border-slate-200 rounded p-3 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="font-semibold text-slate-900 text-sm">{mission.title}</div>
                  <Badge variant="outline" className="capitalize">{mission.missionType}</Badge>
                </div>
                <div className="text-xs text-slate-500 uppercase">{mission.objectiveType} • target {mission.objectiveTarget}</div>
                <div className="text-sm font-medium text-primary">+{mission.xpReward} XP</div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Tabs defaultValue="free" className="w-full">
          <TabsList className="bg-white border border-slate-200 h-11">
            <TabsTrigger value="free">Free Track</TabsTrigger>
            <TabsTrigger value="premium">Premium Track</TabsTrigger>
            <TabsTrigger value="elite">Elite Track</TabsTrigger>
          </TabsList>

          <TabsContent value="free" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(config?.freeRewards || []).map((reward) => {
                const claimed = Boolean(battle?.claimedFree?.includes(reward.tier));
                const unlocked = (battle?.currentTier || 1) >= reward.tier;
                return (
                  <Card key={`free-${reward.tier}`} className="bg-white border-slate-200">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center justify-between">
                        <span>Tier {reward.tier}</span>
                        <Badge variant="outline">Free</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-sm text-slate-700 flex items-center gap-2"><Gift className="w-4 h-4" /> {rewardLabel(reward)}</div>
                      <Button
                        className="w-full"
                        size="sm"
                        variant={claimed ? "secondary" : "default"}
                        disabled={!unlocked || claimed || claimMutation.isPending}
                        onClick={() => claimMutation.mutate({ tier: reward.tier, track: "free" })}
                      >
                        {claimed ? "Claimed" : unlocked ? "Claim Reward" : "Locked"}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="premium" className="mt-4">
            <Card className="bg-white border-slate-200 mb-4">
              <CardContent className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-slate-900">Premium Track Access</div>
                  <div className="text-sm text-slate-600">
                    {battle?.premiumUnlocked
                      ? "Premium track unlocked for this battle pass."
                      : `Unlock Premium for ${config?.unlockTracks?.premium?.cost || 0} ${config?.unlockTracks?.premium?.currency || "gold"}.`}
                  </div>
                </div>
                <Button
                  size="sm"
                  variant={battle?.premiumUnlocked ? "secondary" : "default"}
                  disabled={Boolean(battle?.premiumUnlocked) || unlockTrackMutation.isPending}
                  onClick={() => unlockTrackMutation.mutate("premium")}
                >
                  {battle?.premiumUnlocked ? "Unlocked" : "Unlock Premium"}
                </Button>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(config?.premiumRewards || []).map((reward) => {
                const claimed = Boolean(battle?.claimedPremium?.includes(reward.tier));
                const unlocked = (battle?.currentTier || 1) >= reward.tier;
                const premiumActive = Boolean(battle?.premiumUnlocked);
                return (
                  <Card key={`premium-${reward.tier}`} className="bg-white border-slate-200">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center justify-between">
                        <span>Tier {reward.tier}</span>
                        <Badge className="bg-amber-100 text-amber-800 border-amber-300">Premium</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-sm text-slate-700 flex items-center gap-2"><Gift className="w-4 h-4" /> {rewardLabel(reward)}</div>
                      <Button
                        className="w-full"
                        size="sm"
                        variant={claimed ? "secondary" : "default"}
                        disabled={!premiumActive || !unlocked || claimed || claimMutation.isPending}
                        onClick={() => claimMutation.mutate({ tier: reward.tier, track: "premium" })}
                      >
                        {claimed ? "Claimed" : !premiumActive ? "Premium Locked" : unlocked ? "Claim Reward" : "Locked"}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="elite" className="mt-4">
            <Card className="bg-white border-slate-200 mb-4">
              <CardContent className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-slate-900">Elite Track Access</div>
                  <div className="text-sm text-slate-600">
                    {battle?.eliteUnlocked
                      ? "Elite track unlocked for this battle pass."
                      : `Unlock Elite for ${config?.unlockTracks?.elite?.cost || 0} ${config?.unlockTracks?.elite?.currency || "platinum"}.`}
                  </div>
                </div>
                <Button
                  size="sm"
                  variant={battle?.eliteUnlocked ? "secondary" : "default"}
                  disabled={Boolean(battle?.eliteUnlocked) || !Boolean(battle?.premiumUnlocked) || unlockTrackMutation.isPending}
                  onClick={() => unlockTrackMutation.mutate("elite")}
                >
                  {battle?.eliteUnlocked ? "Unlocked" : !battle?.premiumUnlocked ? "Unlock Premium First" : "Unlock Elite"}
                </Button>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(config?.eliteRewards || []).map((reward) => {
                const claimed = Boolean(battle?.claimedElite?.includes(reward.tier));
                const unlocked = (battle?.currentTier || 1) >= reward.tier;
                const eliteActive = Boolean(battle?.eliteUnlocked);
                return (
                  <Card key={`elite-${reward.tier}`} className="bg-white border-slate-200">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center justify-between">
                        <span>Tier {reward.tier}</span>
                        <Badge className="bg-indigo-100 text-indigo-800 border-indigo-300">Elite</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-sm text-slate-700 flex items-center gap-2"><Gift className="w-4 h-4" /> {rewardLabel(reward)}</div>
                      <Button
                        className="w-full"
                        size="sm"
                        variant={claimed ? "secondary" : "default"}
                        disabled={!eliteActive || !unlocked || claimed || claimMutation.isPending}
                        onClick={() => claimMutation.mutate({ tier: reward.tier, track: "elite" })}
                      >
                        {claimed ? "Claimed" : !eliteActive ? "Elite Locked" : unlocked ? "Claim Reward" : "Locked"}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </GameLayout>
  );
}
