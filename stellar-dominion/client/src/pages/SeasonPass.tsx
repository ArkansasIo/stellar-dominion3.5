import GameLayout from "@/components/layout/GameLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Award, Gift } from "lucide-react";

interface SeasonPassReward {
  tier: number;
  rewardType: "currency" | "item";
  currency?: "silver" | "gold" | "platinum";
  amount?: number;
  itemId?: string;
  quantity?: number;
}

interface SeasonPassOverview {
  config: {
    seasonId: string;
    name: string;
    unlockTracks: {
      gold: { currency: "silver" | "gold" | "platinum"; cost: number };
      platinum: { currency: "silver" | "gold" | "platinum"; cost: number };
    };
    maxTier: number;
    xpPerTier: number;
    freeRewards: SeasonPassReward[];
    goldRewards: SeasonPassReward[];
    platinumRewards: SeasonPassReward[];
  };
  state: {
    seasonId: string;
    xp: number;
    currentTier: number;
    claimedFree: number[];
    claimedGold: number[];
    claimedPlatinum: number[];
    goldUnlocked: boolean;
    platinumUnlocked: boolean;
  };
}

function rewardLabel(reward: SeasonPassReward): string {
  if (reward.rewardType === "currency") {
    return `${(reward.amount || 0).toLocaleString()} ${reward.currency || "silver"}`;
  }
  return `${reward.quantity || 1}x ${reward.itemId || "reward item"}`;
}

export default function SeasonPass() {
  const { toast } = useToast();

  const { data, isLoading } = useQuery<SeasonPassOverview>({
    queryKey: ["/api/season-pass/overview"],
    queryFn: async () => {
      const res = await fetch("/api/season-pass/overview", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load season pass overview");
      return res.json();
    },
  });

  const addXpMutation = useMutation({
    mutationFn: async (xp: number) => {
      const res = await apiRequest("POST", "/api/season-pass/xp", { xp });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/season-pass/overview"] });
      toast({ title: "Season XP Added", description: "Progress updated." });
    },
    onError: (error: any) => {
      toast({ title: "Failed to add XP", description: error?.message || "Unknown error", variant: "destructive" });
    },
  });

  const claimMutation = useMutation({
    mutationFn: async ({ tier, track }: { tier: number; track: "free" | "gold" | "platinum" }) => {
      const res = await apiRequest("POST", "/api/season-pass/claim", { tier, track });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/season-pass/overview"] });
      toast({ title: "Reward Claimed", description: "Season pass reward delivered." });
    },
    onError: (error: any) => {
      toast({ title: "Claim failed", description: error?.message || "Unknown error", variant: "destructive" });
    },
  });

  const unlockTrackMutation = useMutation({
    mutationFn: async (track: "gold" | "platinum") => {
      const res = await apiRequest("POST", "/api/season-pass/premium/unlock", { track });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/season-pass/overview"] });
      toast({ title: "Track Unlocked", description: "Season track is now active." });
    },
    onError: (error: any) => {
      toast({ title: "Unlock failed", description: error?.message || "Unknown error", variant: "destructive" });
    },
  });

  const season = data?.state;
  const config = data?.config;
  const progressPct = season && config ? Math.min(100, (season.currentTier / config.maxTier) * 100) : 0;
  const freeClaimed = season?.claimedFree?.length || 0;
  const goldClaimed = season?.claimedGold?.length || 0;
  const platinumClaimed = season?.claimedPlatinum?.length || 0;
  const totalTrackRewards = (config?.freeRewards?.length || 0) + (config?.goldRewards?.length || 0) + (config?.platinumRewards?.length || 0);

  return (
    <GameLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-orbitron font-bold text-slate-900">Season Pass</h2>
          <p className="text-muted-foreground font-rajdhani text-lg">Advance through 100 tiers and claim Free, Gold, and Platinum rewards.</p>
        </div>

        <Card className="bg-white border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Award className="w-5 h-5 text-primary" /> {config?.name || "Loading Season"}</CardTitle>
            <CardDescription>{config?.seasonId || "season"}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <div className="text-sm text-slate-500">Loading season pass...</div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-50 border border-slate-200 rounded p-3">
                    <div className="text-xs text-slate-500 uppercase">Current Tier</div>
                    <div className="text-2xl font-orbitron text-slate-900">{season?.currentTier || 1}</div>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded p-3">
                    <div className="text-xs text-slate-500 uppercase">Season XP</div>
                    <div className="text-2xl font-orbitron text-slate-900">{(season?.xp || 0).toLocaleString()}</div>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded p-3">
                    <div className="text-xs text-slate-500 uppercase">XP / Tier</div>
                    <div className="text-2xl font-orbitron text-slate-900">{(config?.xpPerTier || 0).toLocaleString()}</div>
                  </div>
                </div>

                <Progress value={progressPct} className="h-2" />

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => addXpMutation.mutate(1200)} disabled={addXpMutation.isPending}>
                    +1 Tier XP
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => addXpMutation.mutate(2400)} disabled={addXpMutation.isPending}>
                    +2 Tier XP
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-white border-slate-200"><CardContent className="p-4"><div className="text-xs uppercase text-slate-500">Total Rewards</div><div className="text-2xl font-orbitron font-bold text-slate-900">{totalTrackRewards}</div></CardContent></Card>
          <Card className="bg-white border-slate-200"><CardContent className="p-4"><div className="text-xs uppercase text-slate-500">Free Claimed</div><div className="text-2xl font-orbitron font-bold text-emerald-700">{freeClaimed}</div></CardContent></Card>
          <Card className="bg-white border-slate-200"><CardContent className="p-4"><div className="text-xs uppercase text-slate-500">Gold Claimed</div><div className="text-2xl font-orbitron font-bold text-amber-700">{goldClaimed}</div></CardContent></Card>
          <Card className="bg-white border-slate-200"><CardContent className="p-4"><div className="text-xs uppercase text-slate-500">Platinum Claimed</div><div className="text-2xl font-orbitron font-bold text-indigo-700">{platinumClaimed}</div></CardContent></Card>
        </div>

        <Card className="bg-indigo-50 border-indigo-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-indigo-900">Season Progression Doctrine</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-indigo-900">
            <div className="rounded border border-indigo-200 bg-white/70 p-3">Schedule XP bursts around season reset events to secure leaderboard momentum early.</div>
            <div className="rounded border border-indigo-200 bg-white/70 p-3">Use gold unlock when your active tier exceeds reward breakpoints to claim backlog immediately.</div>
            <div className="rounded border border-indigo-200 bg-white/70 p-3">Reserve platinum activation for weeks with high-value item tiers and fleet expansion windows.</div>
          </CardContent>
        </Card>

        <Tabs defaultValue="free" className="w-full">
          <TabsList className="bg-white border border-slate-200 h-11">
            <TabsTrigger value="free">Free Track</TabsTrigger>
            <TabsTrigger value="gold">Gold Track</TabsTrigger>
            <TabsTrigger value="platinum">Platinum Track</TabsTrigger>
          </TabsList>

          <TabsContent value="free" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(config?.freeRewards || []).map((reward) => {
                const claimed = Boolean(season?.claimedFree?.includes(reward.tier));
                const unlocked = (season?.currentTier || 1) >= reward.tier;
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

          <TabsContent value="gold" className="mt-4">
            <Card className="bg-white border-slate-200 mb-4">
              <CardContent className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-slate-900">Gold Track Access</div>
                  <div className="text-sm text-slate-600">
                    {season?.goldUnlocked
                      ? "Gold track unlocked for this season."
                      : `Unlock Gold for ${config?.unlockTracks?.gold?.cost || 0} ${config?.unlockTracks?.gold?.currency || "gold"}.`}
                  </div>
                </div>
                <Button
                  size="sm"
                  variant={season?.goldUnlocked ? "secondary" : "default"}
                  disabled={Boolean(season?.goldUnlocked) || unlockTrackMutation.isPending}
                  onClick={() => unlockTrackMutation.mutate("gold")}
                >
                  {season?.goldUnlocked ? "Unlocked" : "Unlock Gold"}
                </Button>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(config?.goldRewards || []).map((reward) => {
                const claimed = Boolean(season?.claimedGold?.includes(reward.tier));
                const unlocked = (season?.currentTier || 1) >= reward.tier;
                const goldActive = Boolean(season?.goldUnlocked);
                return (
                  <Card key={`gold-${reward.tier}`} className="bg-white border-slate-200">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center justify-between">
                        <span>Tier {reward.tier}</span>
                        <Badge className="bg-amber-100 text-amber-800 border-amber-300">Gold</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-sm text-slate-700 flex items-center gap-2"><Gift className="w-4 h-4" /> {rewardLabel(reward)}</div>
                      <Button
                        className="w-full"
                        size="sm"
                        variant={claimed ? "secondary" : "default"}
                        disabled={!goldActive || !unlocked || claimed || claimMutation.isPending}
                        onClick={() => claimMutation.mutate({ tier: reward.tier, track: "gold" })}
                      >
                        {claimed ? "Claimed" : !goldActive ? "Gold Locked" : unlocked ? "Claim Reward" : "Locked"}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="platinum" className="mt-4">
            <Card className="bg-white border-slate-200 mb-4">
              <CardContent className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-slate-900">Platinum Track Access</div>
                  <div className="text-sm text-slate-600">
                    {season?.platinumUnlocked
                      ? "Platinum track unlocked for this season."
                      : `Unlock Platinum for ${config?.unlockTracks?.platinum?.cost || 0} ${config?.unlockTracks?.platinum?.currency || "platinum"}.`}
                  </div>
                </div>
                <Button
                  size="sm"
                  variant={season?.platinumUnlocked ? "secondary" : "default"}
                  disabled={Boolean(season?.platinumUnlocked) || !Boolean(season?.goldUnlocked) || unlockTrackMutation.isPending}
                  onClick={() => unlockTrackMutation.mutate("platinum")}
                >
                  {season?.platinumUnlocked ? "Unlocked" : !season?.goldUnlocked ? "Unlock Gold First" : "Unlock Platinum"}
                </Button>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(config?.platinumRewards || []).map((reward) => {
                const claimed = Boolean(season?.claimedPlatinum?.includes(reward.tier));
                const unlocked = (season?.currentTier || 1) >= reward.tier;
                const platinumActive = Boolean(season?.platinumUnlocked);
                return (
                  <Card key={`platinum-${reward.tier}`} className="bg-white border-slate-200">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center justify-between">
                        <span>Tier {reward.tier}</span>
                        <Badge className="bg-indigo-100 text-indigo-800 border-indigo-300">Platinum</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-sm text-slate-700 flex items-center gap-2"><Gift className="w-4 h-4" /> {rewardLabel(reward)}</div>
                      <Button
                        className="w-full"
                        size="sm"
                        variant={claimed ? "secondary" : "default"}
                        disabled={!platinumActive || !unlocked || claimed || claimMutation.isPending}
                        onClick={() => claimMutation.mutate({ tier: reward.tier, track: "platinum" })}
                      >
                        {claimed ? "Claimed" : !platinumActive ? "Platinum Locked" : unlocked ? "Claim Reward" : "Locked"}
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
