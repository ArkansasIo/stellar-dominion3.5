import GameLayout from "@/components/layout/GameLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Rocket, Calendar, Trophy, Zap, Shield, Star, Clock, Gift, Target,
  Swords, Globe, FlaskConical, TrendingUp, Users, Crown, Sparkles,
  ChevronRight, Lock, CheckCircle, RefreshCw, Coins, BookOpen
} from "lucide-react";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";

const THEME_COLORS: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  age_of_exploration: { bg: "from-blue-900/30 to-indigo-900/30", border: "border-blue-500/30", text: "text-blue-400", glow: "shadow-blue-500/20" },
  galactic_war: { bg: "from-red-900/30 to-orange-900/30", border: "border-red-500/30", text: "text-red-400", glow: "shadow-red-500/20" },
  corporate_expansion: { bg: "from-green-900/30 to-emerald-900/30", border: "border-green-500/30", text: "text-green-400", glow: "shadow-green-500/20" },
  alien_incursion: { bg: "from-purple-900/30 to-pink-900/30", border: "border-purple-500/30", text: "text-purple-400", glow: "shadow-purple-500/20" },
  dimensional_rift: { bg: "from-indigo-900/30 to-violet-900/30", border: "border-indigo-500/30", text: "text-indigo-400", glow: "shadow-indigo-500/20" },
  ancient_awakening: { bg: "from-amber-900/30 to-yellow-900/30", border: "border-amber-500/30", text: "text-amber-400", glow: "shadow-amber-500/20" },
};

const CATEGORY_ICONS: Record<string, any> = {
  combat: Swords,
  economy: TrendingUp,
  research: FlaskConical,
  exploration: Globe,
  social: Users,
};

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    active: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    upcoming: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    final_week: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    ended: "bg-slate-500/20 text-slate-400 border-slate-500/30",
  };
  return <Badge className={cn("border text-xs", colors[status] || colors.active)}>{status.replace("_", " ").toUpperCase()}</Badge>;
}

function MissionCard({ mission, onClaim, onComplete }: { mission: any; onClaim?: () => void; onComplete?: () => void }) {
  const progress = mission.objectiveTarget > 0 ? (mission.currentProgress / mission.objectiveTarget) * 100 : 0;
  const isComplete = mission.status === "completed";
  const isClaimed = mission.status === "claimed";
  const CatIcon = CATEGORY_ICONS[mission.category] || Target;

  return (
    <Card className={cn(
      "border transition-all",
      isClaimed ? "border-slate-700/50 opacity-50" : isComplete ? "border-emerald-500/30 shadow-emerald-500/10" : "border-slate-700/50"
    )}>
      <CardContent className="p-3">
        <div className="flex items-start gap-3">
          <div className={cn("p-1.5 rounded", isComplete ? "bg-emerald-500/20" : "bg-slate-700/50")}>
            <CatIcon className={cn("w-4 h-4", isComplete ? "text-emerald-400" : "text-slate-400")} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-medium text-white truncate">{mission.title}</h4>
              {isClaimed && <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
            </div>
            <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{mission.description}</p>
            <div className="flex items-center gap-3 mt-2">
              <Progress value={progress} className="h-1.5 flex-1" />
              <span className="text-xs text-slate-500 shrink-0">{mission.currentProgress}/{mission.objectiveTarget}</span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="text-[10px] border-slate-700 text-slate-400">
                <Zap className="w-2.5 h-2.5 mr-1" />{mission.xpReward} XP
              </Badge>
              <Badge variant="outline" className="text-[10px] border-slate-700 text-amber-400">
                <Coins className="w-2.5 h-2.5 mr-1" />{mission.tokenReward} Tokens
              </Badge>
            </div>
          </div>
          <div className="shrink-0">
            {isClaimed ? null : isComplete ? (
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-xs h-7" onClick={onClaim}>
                Claim
              </Button>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function TechNodeCard({ tech, onResearch }: { tech: any; onResearch: () => void }) {
  const isResearched = tech.researched;
  const canResearch = !isResearched && tech.prerequisites.every((p: string) => true);

  return (
    <Card className={cn(
      "border transition-all",
      isResearched ? "border-emerald-500/30 bg-emerald-950/20" : canResearch ? "border-blue-500/30 hover:border-blue-400/50" : "border-slate-700/30 opacity-60"
    )}>
      <CardContent className="p-3">
        <div className="flex items-center gap-2 mb-1">
          {isResearched ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : canResearch ? <FlaskConical className="w-4 h-4 text-blue-400" /> : <Lock className="w-4 h-4 text-slate-500" />}
          <h4 className="text-sm font-medium text-white">{tech.name}</h4>
          <Badge variant="outline" className="text-[10px] border-slate-700 ml-auto">T{tech.tier}</Badge>
        </div>
        <p className="text-xs text-slate-400 mb-2">{tech.effect.description}</p>
        <div className="flex items-center gap-2 text-[10px] text-slate-500">
          <span>{tech.cost.metal.toLocaleString()} M</span>
          <span>{tech.cost.crystal.toLocaleString()} C</span>
          <span>{tech.cost.deuterium.toLocaleString()} D</span>
          <span className="text-amber-400">{tech.cost.tokens} T</span>
        </div>
        {!isResearched && canResearch && (
          <Button size="sm" className="w-full mt-2 h-7 text-xs bg-blue-600 hover:bg-blue-500" onClick={onResearch}>
            Research
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export default function SeasonHub() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");

  const { data: seasonData, isLoading } = useQuery({
    queryKey: ["/api/season/overview"],
    queryFn: async () => {
      const res = await fetch("/api/season/overview", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load season data");
      return res.json();
    },
    refetchInterval: 30000,
  });

  const { data: seasonList } = useQuery({
    queryKey: ["/api/season/list"],
    queryFn: async () => {
      const res = await fetch("/api/season/list", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load season list");
      return res.json();
    },
  });

  const { data: universes } = useQuery({
    queryKey: ["/api/season/universes"],
    queryFn: async () => {
      const res = await fetch("/api/season/universes", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load universes");
      return res.json();
    },
  });

  const claimFreeMutation = useMutation({
    mutationFn: async (tier: number) => {
      const res = await apiRequest("POST", `/api/season/${seasonData?.season?.id}/claim-free`, { tier });
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/season/overview"] });
      toast({ title: "Reward Claimed", description: data.message });
    },
    onError: (err: any) => {
      toast({ title: "Claim Failed", description: err.message, variant: "destructive" });
    },
  });

  const researchMutation = useMutation({
    mutationFn: async (techId: string) => {
      const res = await apiRequest("POST", `/api/season/${seasonData?.season?.id}/research`, { techId });
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/season/overview"] });
      toast({ title: data.success ? "Research Complete" : "Research Failed", description: data.message });
    },
  });

  const refreshDailyMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", `/api/season/${seasonData?.season?.id}/refresh-daily`, {});
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/season/overview"] });
      toast({ title: "Refreshed", description: data.message });
    },
  });

  const season = seasonData?.season;
  const pass = seasonData?.pass;
  const tokens = seasonData?.tokens;
  const missions = seasonData?.missions;
  const techTree = seasonData?.techTree || [];
  const events = seasonData?.events || [];
  const themeColors = THEME_COLORS[season?.theme || "age_of_exploration"] || THEME_COLORS.age_of_exploration;

  const allSeasons = seasonList?.seasons || [];
  const allUniverses = universes?.all || [];
  const seasonalUniverses = universes?.seasonal || [];
  const permanentUniverses = universes?.permanent || [];

  if (isLoading) {
    return (
      <GameLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-400 text-sm">Loading season data...</p>
          </div>
        </div>
      </GameLayout>
    );
  }

  return (
    <GameLayout>
      <div className="max-w-7xl mx-auto p-4 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Crown className="w-6 h-6 text-amber-400" />
              Season Hub
            </h1>
            <p className="text-slate-400 text-sm mt-1">Compete, progress, and earn exclusive rewards each season.</p>
          </div>
          {season && (
            <div className="flex items-center gap-3">
              <StatusBadge status={season.status} />
              <Badge variant="outline" className="border-amber-500/30 text-amber-400">
                <Coins className="w-3 h-3 mr-1" />{tokens?.balance?.toLocaleString() || 0} Tokens
              </Badge>
            </div>
          )}
        </div>

        {season && (
          <Card className={cn("border bg-gradient-to-r", themeColors.border, themeColors.bg)}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 mb-2">Season {season.number}</Badge>
                  <h2 className="text-xl font-bold text-white">{season.name}</h2>
                  <p className="text-slate-300 text-sm mt-1">{season.tagline}</p>
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <Rocket className="w-3.5 h-3.5" />
                      <span>{season.speedMultiplier.economy}x Econ</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <Swords className="w-3.5 h-3.5" />
                      <span>{season.speedMultiplier.fleet}x Fleet</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <FlaskConical className="w-3.5 h-3.5" />
                      <span>{season.speedMultiplier.research}x Research</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-slate-400">Tier Progress</div>
                  <div className="text-2xl font-bold text-white">{pass?.currentTier || 1}/{season.maxTier}</div>
                  <Progress value={pass?.completionRatio ? pass.completionRatio * 100 : 0} className="w-48 mt-2" />
                  <div className="text-xs text-slate-500 mt-1">{pass?.xp || 0}/{pass?.xpForNextTier || 500} XP</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-7 bg-slate-900/50">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="missions">Missions</TabsTrigger>
            <TabsTrigger value="tech">Tech Tree</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="rankings">Rankings</TabsTrigger>
            <TabsTrigger value="cosmetics">Cosmetics</TabsTrigger>
            <TabsTrigger value="universes">Universes</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-4">
            <div className="grid grid-cols-4 gap-4">
              <Card className="border-slate-700/50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2"><Trophy className="w-4 h-4 text-amber-400" /><span className="text-sm text-slate-400">Tier</span></div>
                  <div className="text-2xl font-bold text-white">{pass?.currentTier || 1}</div>
                  <div className="text-xs text-slate-500">of {season?.maxTier || 100}</div>
                </CardContent>
              </Card>
              <Card className="border-slate-700/50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2"><Zap className="w-4 h-4 text-blue-400" /><span className="text-sm text-slate-400">Season XP</span></div>
                  <div className="text-2xl font-bold text-white">{pass?.xp?.toLocaleString() || 0}</div>
                  <div className="text-xs text-slate-500">{pass?.xpForNextTier || 500} per tier</div>
                </CardContent>
              </Card>
              <Card className="border-slate-700/50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2"><Coins className="w-4 h-4 text-amber-400" /><span className="text-sm text-slate-400">Galactic Tokens</span></div>
                  <div className="text-2xl font-bold text-white">{tokens?.balance?.toLocaleString() || 0}</div>
                  <div className="text-xs text-slate-500">{tokens?.totalEarned?.toLocaleString() || 0} earned total</div>
                </CardContent>
              </Card>
              <Card className="border-slate-700/50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2"><Target className="w-4 h-4 text-emerald-400" /><span className="text-sm text-slate-400">Missions Done</span></div>
                  <div className="text-2xl font-bold text-white">{seasonData?.completedMissions || 0}</div>
                  <div className="text-xs text-slate-500">{seasonData?.loginStreak || 0} day streak</div>
                </CardContent>
              </Card>
            </div>

            {pass?.premiumUnlocked === false && (
              <Card className="border-amber-500/30 bg-gradient-to-r from-amber-950/30 to-yellow-950/30">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Crown className="w-6 h-6 text-amber-400" />
                    <div>
                      <h3 className="text-sm font-semibold text-white">Unlock Premium Track</h3>
                      <p className="text-xs text-slate-400">Get exclusive cosmetics, boosters, and Dark Matter rewards at every tier.</p>
                    </div>
                  </div>
                  <Button className="bg-amber-600 hover:bg-amber-500" onClick={() => toast({ title: "Premium", description: "Premium unlock coming soon!" })}>
                    <Crown className="w-4 h-4 mr-1" /> Unlock
                  </Button>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-2 gap-4">
              <Card className="border-slate-700/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2"><Calendar className="w-4 h-4 text-blue-400" /> Daily Missions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {(missions?.daily?.missions || []).map((m: any) => (
                    <MissionCard key={m.templateId} mission={m} onClaim={() => toast({ title: "Claimed!" })} />
                  ))}
                  <Button variant="outline" size="sm" className="w-full border-slate-700 text-slate-400" onClick={() => refreshDailyMutation.mutate()}>
                    <RefreshCw className="w-3 h-3 mr-1" /> Refresh ({missions?.daily?.refreshCount || 0}/{missions?.daily?.maxRefreshes || 3})
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-slate-700/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2"><Clock className="w-4 h-4 text-purple-400" /> Weekly Missions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {(missions?.weekly?.missions || []).slice(0, 3).map((m: any) => (
                    <MissionCard key={m.templateId} mission={m} onClaim={() => toast({ title: "Claimed!" })} />
                  ))}
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span>Streak: {missions?.weekly?.streak || 0}</span>
                    <span>|</span>
                    <span>Best: {missions?.weekly?.bestStreak || 0}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="missions" className="space-y-4 mt-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2"><Calendar className="w-4 h-4 text-blue-400" /> Daily Missions</h3>
                <div className="space-y-2">
                  {(missions?.daily?.missions || []).map((m: any) => (
                    <MissionCard key={m.templateId} mission={m} onClaim={() => toast({ title: "Claimed!" })} />
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2"><Clock className="w-4 h-4 text-purple-400" /> Weekly Missions</h3>
                <div className="space-y-2">
                  {(missions?.weekly?.missions || []).map((m: any) => (
                    <MissionCard key={m.templateId} mission={m} onClaim={() => toast({ title: "Claimed!" })} />
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2"><Star className="w-4 h-4 text-amber-400" /> Seasonal Missions</h3>
                <div className="space-y-2">
                  {(missions?.seasonal?.missions || []).map((m: any) => (
                    <MissionCard key={m.templateId} mission={m} onClaim={() => toast({ title: "Claimed!" })} />
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="tech" className="space-y-4 mt-4">
            <div className="grid grid-cols-4 gap-3">
              {techTree.map((tech: any) => (
                <TechNodeCard key={tech.id} tech={tech} onResearch={() => researchMutation.mutate(tech.id)} />
              ))}
            </div>
            <p className="text-xs text-slate-500 text-center">Seasonal technologies disappear when the season ends.</p>
          </TabsContent>

          <TabsContent value="events" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              {events.map((evt: any) => (
                <Card key={evt.id} className="border-slate-700/50 hover:border-blue-500/30 transition-all">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-semibold text-white">{evt.name}</h3>
                      <Badge variant="outline" className="text-[10px] border-slate-700 text-slate-400">{evt.type.replace(/_/g, " ")}</Badge>
                    </div>
                    <p className="text-xs text-slate-400 mb-3">{evt.description}</p>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{Math.floor(evt.duration / 86400000)}d</span>
                      <span className="flex items-center gap-1"><Trophy className="w-3 h-3" />{evt.rewards?.length || 0} tiers</span>
                      {evt.leaderboard && <Badge variant="outline" className="text-[10px] border-blue-500/30 text-blue-400">Leaderboard</Badge>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="rankings" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <Card className="border-slate-700/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Individual Rankings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {["economy", "military", "research", "season_xp", "exploration"].map(cat => (
                    <div key={cat} className="flex items-center justify-between p-2 rounded bg-slate-800/50">
                      <span className="text-sm text-slate-300 capitalize">{cat.replace(/_/g, " ")}</span>
                      <ChevronRight className="w-4 h-4 text-slate-500" />
                    </div>
                  ))}
                </CardContent>
              </Card>
              <Card className="border-slate-700/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Alliance Rankings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {["combined_score", "event_points", "territory_control", "boss_damage", "resources_mined", "ships_destroyed"].map(cat => (
                    <div key={cat} className="flex items-center justify-between p-2 rounded bg-slate-800/50">
                      <span className="text-sm text-slate-300 capitalize">{cat.replace(/_/g, " ")}</span>
                      <ChevronRight className="w-4 h-4 text-slate-500" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="cosmetics" className="space-y-4 mt-4">
            <div className="grid grid-cols-4 gap-3">
              {["planet_skin", "fleet_skin", "avatar_frame", "profile_banner", "alliance_hq", "fleet_effect", "animated_avatar"].map(type => (
                <Card key={type} className="border-slate-700/50">
                  <CardContent className="p-3">
                    <h4 className="text-xs font-semibold text-slate-400 uppercase mb-2">{type.replace(/_/g, " ")}</h4>
                    <div className="space-y-2">
                      {[
                        { name: "Crystal World", cost: 200, rarity: "rare" },
                        { name: "Void Nexus", cost: 800, rarity: "legendary" },
                        { name: "Neon Trail", cost: 50, rarity: "common" },
                      ].map(item => (
                        <div key={item.name} className="flex items-center justify-between p-2 rounded bg-slate-800/50">
                          <div>
                            <div className="text-xs text-white">{item.name}</div>
                            <div className="text-[10px] text-amber-400">{item.cost} Tokens</div>
                          </div>
                          <Badge variant="outline" className={cn("text-[10px]",
                            item.rarity === "legendary" ? "border-amber-500/30 text-amber-400" :
                            item.rarity === "rare" ? "border-blue-500/30 text-blue-400" :
                            "border-slate-700 text-slate-400"
                          )}>{item.rarity}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="universes" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2"><Globe className="w-4 h-4 text-blue-400" /> Seasonal Universes</h3>
                <div className="space-y-2">
                  {seasonalUniverses.map((u: any) => (
                    <Card key={u.id} className={cn("border transition-all", u.status === "active" ? "border-emerald-500/30" : "border-slate-700/50")}>
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-sm font-medium text-white">{u.name}</h4>
                          <StatusBadge status={u.status} />
                        </div>
                        <p className="text-xs text-slate-400 mb-2">{u.description}</p>
                        <div className="flex items-center gap-3 text-xs text-slate-500">
                          <span>{u.currentPlayers?.toLocaleString()}/{u.maxPlayers?.toLocaleString()} players</span>
                          <span>{u.speed.economy}x Econ</span>
                          <span>{u.speed.fleet}x Fleet</span>
                        </div>
                        {u.migrationTarget && (
                          <div className="mt-2 text-[10px] text-blue-400">Migrates to: {u.migrationTarget}</div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2"><Shield className="w-4 h-4 text-emerald-400" /> Permanent Universes</h3>
                <div className="space-y-2">
                  {permanentUniverses.map((u: any) => (
                    <Card key={u.id} className="border border-slate-700/50">
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-sm font-medium text-white">{u.name}</h4>
                          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px]">PERMANENT</Badge>
                        </div>
                        <p className="text-xs text-slate-400 mb-2">{u.description}</p>
                        <div className="flex items-center gap-3 text-xs text-slate-500">
                          <span>{u.currentPlayers?.toLocaleString()}/{u.maxPlayers?.toLocaleString()} players</span>
                          <span className="flex items-center gap-1"><Sparkles className="w-3 h-3 text-amber-400" />{u.bonus}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </GameLayout>
  );
}
