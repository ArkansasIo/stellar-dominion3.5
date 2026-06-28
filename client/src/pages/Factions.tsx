import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Crown, Star, Shield, Swords, Heart, Globe, Zap, Target, Gift, Award, ArrowRight, Clock, TrendingUp, Users, BookOpen, CheckCircle, Lock, AlertTriangle, BarChart3, Sparkles, Handshake } from "lucide-react";

import GameLayout from "@/components/layout/GameLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { BACKGROUND_ASSETS, SHIP_ASSETS, MENU_ASSETS, OGAMEX_FEATURED_ASSETS } from "@shared/config";

type FactionMembership = {
  id: string;
  factionId: string;
  factionName: string;
  factionDescription: string;
  factionAlignment: string;
  reputation: number;
  tier: number;
  joinDate: string;
  questsCompleted: number;
  factionColor: string;
  factionIcon: string;
  reputationLevel: string;
  nextLevelAt: number;
  reputationToNextLevel: number;
  factionQuests: QuestSummary[];
  rewards: RewardTrackTier[];
};

type QuestSummary = {
  id: string;
  title: string;
  description: string;
  factionId: string;
  type: string;
  difficulty: "easy" | "medium" | "hard" | "epic";
  rewards: { reputation?: number; prestige?: number; items?: string[] };
  progress: number;
  progressGoal: number;
  status: "available" | "active" | "completed" | "failed";
  expiresAt?: string;
  completedAt?: string;
  prerequisites?: string[];
  repeatable: boolean;
};

type RewardTrackTier = {
  tier: number;
  name: string;
  reputationRequired: number;
  rewards: { label: string; type: string; quantity: number }[];
  claimed: boolean;
  canClaim: boolean;
};

type FactionsResponse = {
  memberships: FactionMembership[];
  availableToJoin: Array<{ id: string; name: string; description: string; alignment: string; color: string; icon: string }>;
};

const TEMP_THEME_IMAGE = "/theme-temp.png";

function ReputationBadge({ level }: { level: string }) {
  const colors: Record<string, string> = {
    hated: "bg-red-100 text-red-800 border-red-300",
    hostile: "bg-orange-100 text-orange-800 border-orange-300",
    unfriendly: "bg-amber-100 text-amber-800 border-amber-300",
    neutral: "bg-slate-100 text-slate-800 border-slate-300",
    friendly: "bg-emerald-100 text-emerald-800 border-emerald-300",
    honored: "bg-teal-100 text-teal-800 border-teal-300",
    revered: "bg-blue-100 text-blue-800 border-blue-300",
    exalted: "bg-purple-100 text-purple-800 border-purple-300",
  };
  return (
    <Badge className={cn("capitalize", colors[level] || "bg-slate-100 text-slate-800")}>
      {level}
    </Badge>
  );
}

function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const colors: Record<string, string> = {
    easy: "bg-emerald-100 text-emerald-700",
    medium: "bg-amber-100 text-amber-700",
    hard: "bg-red-100 text-red-700",
    epic: "bg-purple-100 text-purple-700",
  };
  return (
    <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full", colors[difficulty] || "bg-slate-100 text-slate-700")}>
      {difficulty.toUpperCase()}
    </span>
  );
}

function TierProgress({ current, next, reputation }: { current: number; next: number; reputation: number }) {
  const progress = next > 0 ? Math.min(100, ((reputation - current) / (next - current)) * 100) : 100;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-slate-500">
        <span>Tier {Math.floor(reputation / next) + 1}</span>
        <span>{reputation.toLocaleString()} / {next.toLocaleString()} rep</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
}

export default function Factions() {
  const [activeTab, setActiveTab] = useState("overview");
  const [questSearch, setQuestSearch] = useState("");
  const [selectedFaction, setSelectedFaction] = useState<string | null>(null);
  const [rewardFilter, setRewardFilter] = useState<"all" | "available" | "claimed">("all");

  const factionsQuery = useQuery<FactionsResponse>({
    queryKey: ["/api/factions"],
  });

  const memberships = factionsQuery.data?.memberships || [];
  const availableToJoin = factionsQuery.data?.availableToJoin || [];

  const activeMembership = memberships.find((m) => m.factionId === selectedFaction) || memberships[0];
  const factionQuests = activeMembership?.factionQuests || [];
  const filteredQuests = factionQuests.filter((q) => {
    const matchesSearch = questSearch === "" || q.title.toLowerCase().includes(questSearch.toLowerCase());
    return matchesSearch;
  });
  const availableRewards = rewardFilter === "all" ? (activeMembership?.rewards || []) : rewardFilter === "available" ? (activeMembership?.rewards || []).filter((r) => !r.claimed) : (activeMembership?.rewards || []).filter((r) => r.claimed);

  const totalQuestsCompleted = memberships.reduce((sum, m) => sum + m.questsCompleted, 0);
  const highestReputation = memberships.length > 0 ? Math.max(...memberships.map((m) => m.reputation)) : 0;

  return (
    <GameLayout>
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 shadow-sm bg-cover bg-center mb-6" style={{ backgroundImage: `linear-gradient(rgba(15,23,42,0.78), rgba(15,23,42,0.92)), url(${BACKGROUND_ASSETS.STAR_FIELD.path})` }}>
        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-4">
            <img src={MENU_ASSETS.BUILDINGS.TRADE_STATION.path} alt="Factions" className="w-16 h-16 rounded-2xl border border-white/10 bg-white/5 p-2 object-contain" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = TEMP_THEME_IMAGE; }} />
            <div>
              <h1 className="text-2xl font-orbitron font-bold text-white">Factions & Reputation</h1>
              <p className="text-slate-300 text-sm mt-1">Build reputation, complete quests, and unlock faction rewards.</p>
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-6" data-testid="factions-page">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-3">
          <div>
            <h1 className="text-3xl font-orbitron font-bold text-slate-900 flex items-center gap-2">
              <Handshake className="w-8 h-8 text-indigo-500" /> Factions & Reputation
            </h1>
            <p className="text-slate-600">Build reputation, complete quests, and unlock faction rewards.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">Memberships: {memberships.length}</Badge>
            <Badge variant="outline">Quests Done: {totalQuestsCompleted}</Badge>
            <Badge variant="outline">Top Rep: {highestReputation.toLocaleString()}</Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {memberships.map((m) => (
            <Card
              key={m.id}
              className={cn(
                "cursor-pointer transition-all hover:shadow-md",
                selectedFaction === m.factionId || (!selectedFaction && memberships[0]?.factionId === m.factionId)
                  ? "ring-2 ring-indigo-400"
                  : ""
              )}
              onClick={() => setSelectedFaction(m.factionId)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center overflow-hidden">
                    <img src={MENU_ASSETS.NAVIGATION.DIPLOMACY.path} alt={m.factionName} className="w-6 h-6 object-contain" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = TEMP_THEME_IMAGE; }} />
                  </div>
                  <Crown className="w-5 h-5" style={{ color: m.factionColor }} />
                  <CardTitle className="text-sm">{m.factionName}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Reputation</span>
                  <span className="font-semibold">{m.reputation.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Level</span>
                  <ReputationBadge level={m.reputationLevel} />
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Quests</span>
                  <span className="font-semibold">{m.questsCompleted}</span>
                </div>
                <Progress
                  value={m.reputationToNextLevel > 0 ? (m.reputation / m.reputationToNextLevel) * 100 : 100}
                  className="h-1.5"
                />
              </CardContent>
            </Card>
          ))}
        </div>

        {availableToJoin.length > 0 && (
          <Card className="border-dashed border-indigo-300 bg-indigo-50/50">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2"><Star className="w-4 h-4" /> Available Factions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {availableToJoin.map((f) => (
                <div key={f.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden">
                      <img src={MENU_ASSETS.NAVIGATION.DIPLOMACY.path} alt={f.name} className="w-6 h-6 object-contain" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = TEMP_THEME_IMAGE; }} />
                    </div>
                    <Globe className="w-5 h-5" style={{ color: f.color }} />
                    <span className="font-semibold text-sm">{f.name}</span>
                  </div>
                  <Button size="sm" variant="outline">Join</Button>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {!activeMembership ? (
          <div className="text-center py-12 text-slate-500">
            <Handshake className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p className="text-lg font-semibold">No faction memberships yet.</p>
            <p className="text-sm">Join a faction above to start earning reputation.</p>
          </div>
        ) : (
          <>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="overview"><BookOpen className="w-4 h-4 mr-1" /> Overview</TabsTrigger>
                <TabsTrigger value="quests"><Target className="w-4 h-4 mr-1" /> Quests</TabsTrigger>
                <TabsTrigger value="rewards"><Gift className="w-4 h-4 mr-1" /> Reward Track</TabsTrigger>
                <TabsTrigger value="progress"><TrendingUp className="w-4 h-4 mr-1" /> Progress</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4 mt-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center overflow-hidden">
                            <img src={MENU_ASSETS.BUILDINGS.TRADE_STATION.path} alt={activeMembership.factionName} className="w-10 h-10 object-contain" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = TEMP_THEME_IMAGE; }} />
                          </div>
                          <Crown className="w-8 h-8" style={{ color: activeMembership.factionColor }} />
                          <div>
                            <h3 className="text-xl font-bold">{activeMembership.factionName}</h3>
                            <ReputationBadge level={activeMembership.reputationLevel} />
                          </div>
                        </div>
                        <p className="text-sm text-slate-600">{activeMembership.factionDescription}</p>
                        <div className="flex gap-4 pt-2">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-indigo-700">{activeMembership.reputation.toLocaleString()}</div>
                            <div className="text-xs text-slate-500">Reputation</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-emerald-700">{activeMembership.questsCompleted}</div>
                            <div className="text-xs text-slate-500">Quests Done</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-amber-700">{activeMembership.tier}</div>
                            <div className="text-xs text-slate-500">Tier</div>
                          </div>
                        </div>
                        <div className="pt-3">
                          <TierProgress current={0} next={activeMembership.nextLevelAt || 1000} reputation={activeMembership.reputation} />
                        </div>
                      </div>
                      <div className="md:w-48 space-y-2">
                        <div className="text-sm font-semibold text-slate-500">JOINED</div>
                        <div className="text-sm">{new Date(activeMembership.joinDate).toLocaleDateString()}</div>
                        <Separator />
                        <div className="text-sm font-semibold text-slate-500">ALIGNMENT</div>
                        <Badge className="capitalize">{activeMembership.factionAlignment}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="quests" className="space-y-4 mt-4">
                <div className="flex items-center gap-3">
                  <Input
                    placeholder="Search quests..."
                    value={questSearch}
                    onChange={(e) => setQuestSearch(e.target.value)}
                    className="max-w-xs"
                  />
                  <span className="text-xs text-slate-500">{filteredQuests.length} quests</span>
                </div>
                {filteredQuests.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <Target className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                    {questSearch ? "No quests match your search." : "No quests available for this faction."}
                    {!questSearch && <p className="text-sm">Check back later for new contracts.</p>}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filteredQuests.map((quest) => (
                      <Card key={quest.id} className={cn(
                        "flex flex-col",
                        quest.status === "completed" && "border-emerald-300 bg-emerald-50/50",
                        quest.status === "failed" && "border-red-300 bg-red-50/50",
                      )}>
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <CardTitle className="text-sm flex-1">{quest.title}</CardTitle>
                            <DifficultyBadge difficulty={quest.difficulty} />
                          </div>
                          <CardDescription className="text-xs mt-1">{quest.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1 space-y-2 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500">Progress</span>
                            <span>{quest.progress}/{quest.progressGoal}</span>
                          </div>
                          <Progress value={(quest.progress / quest.progressGoal) * 100} className="h-2" />
                          <div className="flex flex-wrap gap-2 pt-1">
                            {quest.rewards.reputation && (
                              <Badge variant="outline" className="text-xs">
                                +{quest.rewards.reputation} Rep
                              </Badge>
                            )}
                            {quest.rewards.prestige && (
                              <Badge variant="outline" className="text-xs">
                                +{quest.rewards.prestige} Prestige
                              </Badge>
                            )}
                            {quest.repeatable && (
                              <Badge variant="secondary" className="text-xs">Repeatable</Badge>
                            )}
                          </div>
                          <div className="flex items-center justify-between pt-1">
                            <Badge className={cn(
                              "capitalize",
                              quest.status === "available" && "bg-blue-100 text-blue-800",
                              quest.status === "active" && "bg-amber-100 text-amber-800",
                              quest.status === "completed" && "bg-emerald-100 text-emerald-800",
                              quest.status === "failed" && "bg-red-100 text-red-800",
                            )}>{quest.status}</Badge>
                            {quest.expiresAt && <span className="text-xs text-red-500">Expires {new Date(quest.expiresAt).toLocaleDateString()}</span>}
                          </div>
                        </CardContent>
                        <CardFooter className="pt-0">
                          <Button size="sm" className="w-full" disabled={quest.status === "completed" || quest.status === "failed"}>
                            {quest.status === "completed" ? "Completed" : quest.status === "failed" ? "Failed" : quest.status === "active" ? "In Progress" : "Accept Quest"}
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="rewards" className="space-y-4 mt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Button size="sm" variant={rewardFilter === "all" ? "default" : "outline"} onClick={() => setRewardFilter("all")}>All</Button>
                  <Button size="sm" variant={rewardFilter === "available" ? "default" : "outline"} onClick={() => setRewardFilter("available")}>Available</Button>
                  <Button size="sm" variant={rewardFilter === "claimed" ? "default" : "outline"} onClick={() => setRewardFilter("claimed")}>Claimed</Button>
                </div>

                {(activeMembership.rewards || []).length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <Gift className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                    No reward tiers configured for this faction.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {(activeMembership.rewards || []).map((tier) => (
                      <Card key={tier.tier} className={cn(
                        tier.claimed && "border-emerald-300 bg-emerald-50/50",
                        tier.canClaim && !tier.claimed && "border-amber-300 bg-amber-50/50",
                      )}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold">Tier {tier.tier}</span>
                              <span className="text-sm font-semibold">{tier.name}</span>
                              <Badge variant="outline" className="text-xs">{tier.reputationRequired.toLocaleString()} rep</Badge>
                            </div>
                            {tier.claimed ? (
                              <Badge className="bg-emerald-500"><CheckCircle className="w-3 h-3 mr-1" /> Claimed</Badge>
                            ) : tier.canClaim ? (
                              <Badge className="bg-amber-500"><Gift className="w-3 h-3 mr-1" /> Claim Now</Badge>
                            ) : (
                              <Badge variant="secondary"><Lock className="w-3 h-3 mr-1" /> Locked</Badge>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {tier.rewards.map((reward, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {reward.label} x{reward.quantity}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="progress" className="space-y-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {memberships.map((m) => (
                    <Card key={m.id}>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Crown className="w-4 h-4" style={{ color: m.factionColor }} /> {m.factionName}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Reputation</span>
                          <span className="font-semibold">{m.reputation.toLocaleString()}</span>
                        </div>
                        <Progress value={m.reputationToNextLevel > 0 ? (m.reputation / m.reputationToNextLevel) * 100 : 100} className="h-2" />
                        <div className="flex justify-between">
                          <span className="text-slate-500">Next Level</span>
                          <span className="font-semibold">{m.reputationToNextLevel.toLocaleString()} rep</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between">
                          <span className="text-slate-500">Quests Completed</span>
                          <span className="font-semibold">{m.questsCompleted}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Current Tier</span>
                          <span className="font-semibold">{m.tier}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Joined</span>
                          <span className="font-semibold">{new Date(m.joinDate).toLocaleDateString()}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </GameLayout>
  );
}
