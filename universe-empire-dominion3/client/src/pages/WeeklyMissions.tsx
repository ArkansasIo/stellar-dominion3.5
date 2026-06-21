import { useMemo, useState } from "react";
import {
  Award,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock,
  Flame,
  Gift,
  History,
  Swords,
  Target,
  Trophy,
  Zap,
} from "lucide-react";

import GameLayout from "@/components/layout/GameLayout";
import Navigation from "./Navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useMutation, useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

import {
  type WeeklyMissionState,
  type WeeklyMissionAssignment,
  type MissionCategory,
  type MissionDifficulty,
  getMissionDifficultyColor,
  getMissionCategoryIcon,
} from "@shared/config/weeklyMissionsConfig";

const difficultyBadgeClass: Record<MissionDifficulty, string> = {
  easy: "bg-green-100 text-green-800 border-green-300",
  medium: "bg-blue-100 text-blue-800 border-blue-300",
  hard: "bg-amber-100 text-amber-800 border-amber-300",
  elite: "bg-purple-100 text-purple-800 border-purple-300",
  legendary: "bg-pink-100 text-pink-800 border-pink-300",
};

const categoryColor: Record<MissionCategory, string> = {
  combat: "from-red-500 to-red-700",
  mining: "from-amber-500 to-amber-700",
  exploration: "from-blue-500 to-blue-700",
  crafting: "from-slate-500 to-slate-700",
  research: "from-violet-500 to-violet-700",
  trading: "from-emerald-500 to-emerald-700",
  social: "from-teal-500 to-teal-700",
};

function formatTimeRemaining(ms: number): string {
  if (ms <= 0) return "Resets soon";
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

export default function WeeklyMissions() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("missions");

  const { data, isLoading } = useQuery<{
    success: boolean;
    state: WeeklyMissionState;
    bonusMultiplier: number;
    weekId: string;
    weekStart: string;
    weekEnd: string;
    timeRemaining: number;
  }>({
    queryKey: ["/api/weekly-missions"],
    queryFn: async () => {
      const res = await fetch("/api/weekly-missions", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load weekly missions");
      return res.json();
    },
  });

  const progressMutation = useMutation({
    mutationFn: async ({ templateId, amount }: { templateId: string; amount: number }) => {
      const res = await apiRequest("POST", "/api/weekly-missions/progress", { templateId, amount });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/weekly-missions"] });
      toast({ title: "Progress Updated", description: "Mission progress has been recorded." });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error?.message || "Failed to update progress", variant: "destructive" });
    },
  });

  const claimMutation = useMutation({
    mutationFn: async ({ templateId }: { templateId: string }) => {
      const res = await apiRequest("POST", "/api/weekly-missions/claim", { templateId });
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/weekly-missions"] });
      const rewards = data.rewards;
      toast({
        title: "Rewards Claimed!",
        description: `+${rewards.xp} XP, +${rewards.credits.toLocaleString()} Credits${rewards.bonusMultiplier > 1 ? ` (${rewards.bonusMultiplier}x bonus)` : ""}`,
      });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error?.message || "Failed to claim rewards", variant: "destructive" });
    },
  });

  const { data: historyData } = useQuery<{
    success: boolean;
    history: Array<{ weekId: string; completedCount: number; totalCount: number; streak: number; bonusPool: number }>;
  }>({
    queryKey: ["/api/weekly-missions/history"],
    queryFn: async () => {
      const res = await fetch("/api/weekly-missions/history", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load history");
      return res.json();
    },
    enabled: activeTab === "history",
  });

  const state = data?.state;
  const bonusMultiplier = data?.bonusMultiplier || 1;
  const timeRemaining = data?.timeRemaining || 0;

  const claimedCount = useMemo(() => state?.missions.filter((m) => m.status === "claimed").length || 0, [state]);
  const completedCount = state?.completedCount || 0;
  const totalCount = state?.totalCount || 1;
  const completionPercent = Math.round((completedCount / totalCount) * 100);
  const allClaimed = claimedCount === totalCount && completedCount === totalCount;

  return (
    <GameLayout>
      <div className="space-y-6 animate-in fade-in duration-500">
        <Navigation />

        <div className="relative rounded-xl overflow-hidden shadow-lg" style={{ minHeight: 160 }}>
          <img src="/assets/backgrounds/space_station.png" alt="Weekly Missions" className="absolute inset-0 w-full h-full object-cover" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
          <div className="absolute inset-0 bg-gradient-to-r from-amber-950/90 via-amber-900/60 to-transparent" />
          <div className="relative z-10 p-6 flex items-center gap-6">
            <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-amber-500 to-orange-700 flex items-center justify-center shadow-lg ring-2 ring-amber-300/50">
              <Target className="w-10 h-10 text-white" />
            </div>
            <div>
              <h2 className="font-orbitron text-3xl font-bold text-white drop-shadow">Weekly Missions</h2>
              <p className="text-amber-200 font-rajdhani text-lg">Complete objectives to earn XP, credits, and resources. Bonus multiplier scales with completion rate.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          <Card className="border-amber-200 bg-white">
            <CardContent className="p-3 text-center">
              <div className="text-xs text-slate-500">Completed</div>
              <div className="font-orbitron text-2xl text-amber-700">{completedCount}/{totalCount}</div>
            </CardContent>
          </Card>
          <Card className="border-amber-200 bg-white">
            <CardContent className="p-3 text-center">
              <div className="text-xs text-slate-500">Claimed</div>
              <div className="font-orbitron text-2xl text-amber-700">{claimedCount}/{totalCount}</div>
            </CardContent>
          </Card>
          <Card className="border-amber-200 bg-white">
            <CardContent className="p-3 text-center">
              <div className="text-xs text-slate-500">Bonus</div>
              <div className="font-orbitron text-2xl text-emerald-700">{bonusMultiplier.toFixed(1)}x</div>
            </CardContent>
          </Card>
          <Card className="border-amber-200 bg-white">
            <CardContent className="p-3 text-center">
              <div className="text-xs text-slate-500">Streak</div>
              <div className="font-orbitron text-2xl text-orange-700">{state?.streak || 0}</div>
            </CardContent>
          </Card>
          <Card className="border-amber-200 bg-white">
            <CardContent className="p-3 text-center">
              <div className="text-xs text-slate-500">Bonus Pool</div>
              <div className="font-orbitron text-2xl text-purple-700">{(state?.bonusPool || 0).toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card className="border-amber-200 bg-white">
            <CardContent className="p-3 text-center">
              <div className="text-xs text-slate-500">Resets In</div>
              <div className="font-orbitron text-lg text-slate-700">{formatTimeRemaining(timeRemaining)}</div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-amber-200 bg-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-slate-900">Weekly Completion</span>
              <span className="text-sm font-semibold text-amber-700">{completionPercent}%</span>
            </div>
            <Progress value={completionPercent} className="h-3" />
            <div className="mt-2 flex items-center gap-2 text-xs text-slate-600">
              <Flame className="h-3.5 w-3.5 text-orange-500" />
              <span>Complete all missions for a <strong className="text-amber-700">3.0x</strong> bonus multiplier. Earn streaks by completing every week.</span>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid h-12 w-full grid-cols-3 border border-slate-200 bg-white">
            <TabsTrigger value="missions" className="font-orbitron text-xs"><Swords className="mr-1 h-3.5 w-3.5" /> Missions</TabsTrigger>
            <TabsTrigger value="rewards" className="font-orbitron text-xs"><Gift className="mr-1 h-3.5 w-3.5" /> Rewards</TabsTrigger>
            <TabsTrigger value="history" className="font-orbitron text-xs"><History className="mr-1 h-3.5 w-3.5" /> History</TabsTrigger>
          </TabsList>

          <TabsContent value="missions" className="mt-4">
            {isLoading ? (
              <Card className="border-dashed border-slate-300 bg-slate-50">
                <CardContent className="p-10 text-center text-slate-600">Loading missions...</CardContent>
              </Card>
            ) : state ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {state.missions.map((mission) => (
                  <MissionCard
                    key={mission.templateId}
                    mission={mission}
                    bonusMultiplier={bonusMultiplier}
                    onProgress={() => progressMutation.mutate({ templateId: mission.templateId, amount: 1 })}
                    onClaim={() => claimMutation.mutate({ templateId: mission.templateId })}
                    isPending={progressMutation.isPending || claimMutation.isPending}
                  />
                ))}
              </div>
            ) : (
              <Card className="border-dashed border-slate-300 bg-slate-50">
                <CardContent className="p-10 text-center text-slate-600">No missions available.</CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="rewards" className="mt-4">
            <Card className="border-slate-200 bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-amber-500" />
                  Bonus Multiplier Tiers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    { rate: "0-49%", mult: "1.0x", label: "Base", color: "bg-slate-100 border-slate-300" },
                    { rate: "50-79%", mult: "1.5x", label: "Committed", color: "bg-blue-50 border-blue-300" },
                    { rate: "80-99%", mult: "2.0x", label: "Dedicated", color: "bg-purple-50 border-purple-300" },
                    { rate: "100%", mult: "3.0x", label: "Master", color: "bg-amber-50 border-amber-300" },
                  ].map((tier) => (
                    <div key={tier.label} className={cn("rounded-xl border-2 p-4 text-center", tier.color)}>
                      <div className="text-xs text-slate-500 mb-1">{tier.rate} Completion</div>
                      <div className="font-orbitron text-3xl font-bold text-slate-900">{tier.mult}</div>
                      <Badge className="mt-2">{tier.label}</Badge>
                    </div>
                  ))}
                </div>
                <div className="mt-6 rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
                  <div className="font-semibold text-slate-900 mb-2">How Bonuses Work</div>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>Your bonus multiplier is based on how many missions you complete this week.</li>
                    <li>Complete 100% of missions for a 3.0x bonus on all rewards.</li>
                    <li>Complete every week to build your streak for additional prestige.</li>
                    <li>Bonus applies to credits and XP rewards when claiming.</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="mt-4">
            <Card className="border-slate-200 bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5 text-slate-500" />
                  Weekly History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {historyData?.history && historyData.history.length > 0 ? (
                  <div className="space-y-3">
                    {historyData.history.map((week) => (
                      <div key={week.weekId} className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3">
                        <div>
                          <div className="font-semibold text-slate-900">Week of {week.weekId}</div>
                          <div className="text-xs text-slate-500">
                            {week.completedCount}/{week.totalCount} completed
                            {week.streak > 0 && ` · Streak: ${week.streak}`}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-amber-700">+{week.bonusPool.toLocaleString()}</div>
                          <div className="text-xs text-slate-500">bonus credits</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-slate-600 py-8">
                    <History className="mx-auto mb-3 h-8 w-8 text-slate-400" />
                    No mission history yet. Complete your first week to see your record here.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </GameLayout>
  );
}

function MissionCard({
  mission,
  bonusMultiplier,
  onProgress,
  onClaim,
  isPending,
}: {
  mission: WeeklyMissionAssignment;
  bonusMultiplier: number;
  onProgress: () => void;
  onClaim: () => void;
  isPending: boolean;
}) {
  const progressPercent = Math.min(100, Math.round((mission.currentProgress / mission.objectiveTarget) * 100));
  const gradient = categoryColor[mission.category] || "from-slate-500 to-slate-700";
  const diffColor = getMissionDifficultyColor(mission.difficulty);
  const categoryIcon = getMissionCategoryIcon(mission.category);
  const bonusCredits = Math.floor(mission.rewardCredits * (bonusMultiplier - 1));

  return (
    <Card className={cn("border-2 transition-all overflow-hidden bg-white", mission.status === "claimed" ? "opacity-60 border-slate-200" : "border-slate-200 hover:shadow-md")}>
      <div className={cn("h-1.5 bg-gradient-to-r", gradient)} />
      <CardContent className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className={cn("w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center shrink-0 text-white text-lg", gradient)}>
              {categoryIcon}
            </div>
            <div className="min-w-0">
              <div className="font-orbitron text-sm font-bold text-slate-900">{mission.title}</div>
              <div className="text-xs text-slate-500 capitalize">{mission.category} Mission</div>
            </div>
          </div>
          <Badge className={cn("capitalize border text-[10px] shrink-0", difficultyBadgeClass[mission.difficulty])}>
            {mission.difficulty}
          </Badge>
        </div>

        <p className="text-xs text-slate-600">{mission.description}</p>

        <div className="space-y-1">
          <div className="flex justify-between text-xs text-slate-600">
            <span>Progress</span>
            <span className="font-semibold">{mission.currentProgress}/{mission.objectiveTarget}</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>

        <div className="rounded-lg bg-slate-50 p-3 text-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-700">Rewards</span>
            {bonusMultiplier > 1 && <span className="text-emerald-600 font-semibold">{bonusMultiplier.toFixed(1)}x</span>}
          </div>
          <div className="flex justify-between text-slate-600">
            <span className="flex items-center gap-1"><Zap className="h-3 w-3 text-amber-500" /> XP</span>
            <span className="font-mono font-semibold text-slate-900">
              {mission.rewardXp.toLocaleString()}
              {bonusMultiplier > 1 && <span className="text-emerald-600 ml-1">+{Math.floor(mission.rewardXp * (bonusMultiplier - 1)).toLocaleString()}</span>}
            </span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span className="flex items-center gap-1"><Award className="h-3 w-3 text-amber-500" /> Credits</span>
            <span className="font-mono font-semibold text-slate-900">
              {mission.rewardCredits.toLocaleString()}
              {bonusMultiplier > 1 && <span className="text-emerald-600 ml-1">+{bonusCredits.toLocaleString()}</span>}
            </span>
          </div>
          {mission.rewardResources.metal && (
            <div className="flex justify-between text-slate-600">
              <span>Metal</span>
              <span className="font-mono font-semibold text-slate-900">{mission.rewardResources.metal.toLocaleString()}</span>
            </div>
          )}
          {mission.rewardResources.crystal && (
            <div className="flex justify-between text-slate-600">
              <span>Crystal</span>
              <span className="font-mono font-semibold text-slate-900">{mission.rewardResources.crystal.toLocaleString()}</span>
            </div>
          )}
          {mission.rewardResources.deuterium && (
            <div className="flex justify-between text-slate-600">
              <span>Deuterium</span>
              <span className="font-mono font-semibold text-slate-900">{mission.rewardResources.deuterium.toLocaleString()}</span>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          {mission.status === "active" && (
            <Button
              size="sm"
              className="flex-1 bg-amber-600 hover:bg-amber-700"
              disabled={isPending || mission.currentProgress >= mission.objectiveTarget}
              onClick={onProgress}
            >
              {mission.currentProgress >= mission.objectiveTarget ? (
                <><CheckCircle2 className="mr-1 h-3.5 w-3.5" /> Complete</>
              ) : (
                <><Target className="mr-1 h-3.5 w-3.5" /> Add Progress</>
              )}
            </Button>
          )}
          {mission.status === "completed" && (
            <Button size="sm" className="flex-1 bg-emerald-600 hover:bg-emerald-700" disabled={isPending} onClick={onClaim}>
              <Gift className="mr-1 h-3.5 w-3.5" /> Claim Rewards
            </Button>
          )}
          {mission.status === "claimed" && (
            <div className="flex-1 flex items-center justify-center gap-1 text-sm text-emerald-600 font-semibold">
              <CheckCircle2 className="h-4 w-4" /> Claimed
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
