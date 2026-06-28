import { useMemo, useState } from "react";
import GameLayout from "@/components/layout/GameLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ACHIEVEMENTS, QUESTS, Achievement, Quest, getCompletedCount, getTotalCount } from "@/lib/achievementsSystem";
import { Trophy, Star, Target, CheckCircle2, Circle, Clock, Zap, Search, Medal, Award, Sparkles, Lock, Gift, TrendingUp, Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import { BACKGROUND_ASSETS, SHIP_ASSETS, MENU_ASSETS, OGAMEX_FEATURED_ASSETS } from "@shared/config";

const TEMP_THEME_IMAGE = "/theme-temp.png";

const rarityColors: Record<string, string> = {
  common: "bg-slate-100 text-slate-700 border-slate-300",
  uncommon: "bg-green-100 text-green-700 border-green-300",
  rare: "bg-blue-100 text-blue-700 border-blue-300",
  epic: "bg-purple-100 text-purple-700 border-purple-300",
  legendary: "bg-amber-100 text-amber-700 border-amber-300",
};

const rarityBgColors: Record<string, string> = {
  common: "from-slate-50 to-slate-100 border-slate-200",
  uncommon: "from-green-50 to-green-100 border-green-200",
  rare: "from-blue-50 to-blue-100 border-blue-200",
  epic: "from-purple-50 to-purple-100 border-purple-200",
  legendary: "from-amber-50 to-amber-100 border-amber-200",
};

const rarityGradients: Record<string, string> = {
  common: "from-slate-400 to-slate-500",
  uncommon: "from-green-400 to-green-500",
  rare: "from-blue-400 to-blue-500",
  epic: "from-purple-400 to-purple-500",
  legendary: "from-amber-400 to-amber-500",
};

const categoryIcons: Record<string, string> = {
  exploration: "🔭",
  combat: "⚔️",
  economics: "💰",
  technology: "🔬",
  diplomacy: "🤝",
  milestones: "🏆",
};

const categoryDescriptions: Record<string, string> = {
  exploration: "Discover new worlds, anomalies, and cosmic phenomena",
  combat: "Dominate in battle, crush your enemies",
  economics: "Build your empire's wealth and industrial might",
  technology: "Push the boundaries of science and research",
  diplomacy: "Forge alliances, negotiate treaties",
  milestones: "Reach significant account milestones",
};

const difficultyColors: Record<string, string> = {
  easy: "bg-green-100 text-green-700",
  normal: "bg-blue-100 text-blue-700",
  hard: "bg-orange-100 text-orange-700",
  expert: "bg-red-100 text-red-700",
};

function AchievementCard({ achievement }: { achievement: Achievement }) {
  const progress = Math.round((achievement.progress / achievement.requirement) * 100);
  const isSecret = achievement.id.startsWith("secret_");
  const isHidden = isSecret && !achievement.completed;

  if (isHidden) {
    return (
      <Card className="border-dashed border-slate-300 bg-slate-50/50">
        <CardContent className="p-4 flex items-center gap-4">
          <div className="text-3xl p-2">
            <Lock className="w-8 h-8 text-slate-300" />
          </div>
          <div>
            <h3 className="font-bold text-slate-400">???</h3>
            <p className="text-sm text-slate-400 italic">Secret achievement - keep playing to discover!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("border-2 transition-all hover:shadow-md", achievement.completed ? "border-amber-300 bg-amber-50/50" : "border-slate-200")} data-testid={`card-achievement-${achievement.id}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className={cn("text-3xl p-2 rounded-lg", achievement.completed ? "bg-amber-100" : "bg-slate-100")}>
            {categoryIcons[achievement.category] || "🎯"}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-bold text-slate-900">{achievement.title}</h3>
              <div className="flex items-center gap-2">
                {achievement.completed && achievement.completedDate && (
                  <span className="text-[10px] text-slate-400">{new Date(achievement.completedDate).toLocaleDateString()}</span>
                )}
                <Badge className={rarityColors[achievement.rarity]}>
                  {achievement.rarity}
                </Badge>
              </div>
            </div>
            <p className="text-sm text-slate-600 mb-3">{achievement.description}</p>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Progress</span>
                <span className="font-mono font-bold">{achievement.completed ? "DONE" : `${achievement.progress.toLocaleString()} / ${achievement.requirement.toLocaleString()}`}</span>
              </div>
              <Progress value={achievement.completed ? 100 : progress} className={cn("h-2", achievement.completed && "bg-amber-200")} />
            </div>

            <div className="flex items-center gap-4 mt-3 text-xs">
              <div className="flex items-center gap-1 text-purple-600">
                <Star className="w-3 h-3" />
                <span>{achievement.rewards.xp} XP</span>
              </div>
              <div className="flex items-center gap-1 text-amber-600">
                <Trophy className="w-3 h-3" />
                <span>{achievement.rewards.prestige} Prestige</span>
              </div>
              {achievement.completed && (
                <div className="flex items-center gap-1 text-green-600 ml-auto">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="font-bold">Completed!</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function QuestCard({ quest }: { quest: Quest }) {
  const completedObjectives = quest.objectives.filter(o => o.completed).length;
  const totalObjectives = quest.objectives.length;
  const progress = totalObjectives > 0 ? Math.round((completedObjectives / totalObjectives) * 100) : 0;

  return (
    <Card className={cn("border-2 transition-all", quest.completed ? "border-green-300 bg-green-50/50" : quest.active ? "border-blue-200 bg-blue-50/30" : "border-slate-200")} data-testid={`card-quest-${quest.id}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className={cn("w-5 h-5", quest.active ? "text-blue-600" : quest.completed ? "text-green-600" : "text-slate-400")} />
            <CardTitle className="text-lg">{quest.title}</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={difficultyColors[quest.difficulty]}>
              {quest.difficulty}
            </Badge>
            {quest.active && <Badge className="bg-blue-600 text-white animate-pulse">Active</Badge>}
            {quest.completed && <Badge className="bg-green-600 text-white">Complete</Badge>}
          </div>
        </div>
        <p className="text-sm text-slate-600">{quest.description}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Objectives</span>
            <span>{completedObjectives} / {totalObjectives}</span>
          </div>
          <Progress value={quest.completed ? 100 : progress} className={cn("h-2", quest.completed && "bg-green-200")} />
        </div>

        <div className="space-y-2">
          {quest.objectives.map(obj => (
            <div key={obj.id} className="flex items-center gap-2 text-sm">
              {obj.completed ? (
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              ) : (
                <Circle className="w-4 h-4 text-slate-300" />
              )}
              <span className={obj.completed ? 'line-through text-slate-400' : 'text-slate-700'}>
                {obj.title}
              </span>
              <span className="text-xs text-slate-400 ml-auto">
                {obj.current.toLocaleString()}/{obj.target.toLocaleString()}
              </span>
            </div>
          ))}
        </div>

        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
          <p className="text-xs font-bold text-slate-600 mb-2 flex items-center gap-1">
            <Gift className="w-3 h-3" /> REWARDS
          </p>
          <div className="flex flex-wrap gap-3 text-xs">
            {quest.rewards.metal && <span className="text-slate-600">🔩 {quest.rewards.metal.toLocaleString()} Metal</span>}
            {quest.rewards.crystal && <span className="text-blue-600">💎 {quest.rewards.crystal.toLocaleString()} Crystal</span>}
            {quest.rewards.deuterium && <span className="text-green-600">⚗️ {quest.rewards.deuterium.toLocaleString()} Deuterium</span>}
            <span className="text-purple-600">⭐ {quest.rewards.xp} XP</span>
            {quest.rewards.technology && (
              <span className="text-amber-600 inline-flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Unlock: {quest.rewards.technology}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Achievements() {
  const [searchQuery, setSearchQuery] = useState("");
  const [rarityFilter, setRarityFilter] = useState<string>("all");
  const categories = ["all", "exploration", "combat", "economics", "technology", "diplomacy", "milestones"];
  const rarities = ["all", "common", "uncommon", "rare", "epic", "legendary"];

  const completedAchievements = ACHIEVEMENTS.filter((a) => a.completed).length;
  const totalAchievements = ACHIEVEMENTS.length;
  const activeQuests = QUESTS.filter((q) => q.active).length;
  const completedQuests = QUESTS.filter((q) => q.completed).length;
  const completionRate = totalAchievements > 0 ? Math.round((completedAchievements / totalAchievements) * 100) : 0;

  const totalAchievementXp = ACHIEVEMENTS
    .filter((a) => a.completed)
    .reduce((sum, a) => sum + a.rewards.xp, 0);
  const totalAchievementPrestige = ACHIEVEMENTS
    .filter((a) => a.completed)
    .reduce((sum, a) => sum + a.rewards.prestige, 0);

  const categoryBreakdown = useMemo(() => {
    return categories.filter(c => c !== "all").map((cat) => ({
      category: cat,
      total: ACHIEVEMENTS.filter((a) => a.category === cat).length,
      completed: ACHIEVEMENTS.filter((a) => a.category === cat && a.completed).length,
    }));
  }, []);

  const recentUnlocks = useMemo(() => {
    return ACHIEVEMENTS
      .filter((a) => a.completed && a.completedDate)
      .sort((a, b) => (b.completedDate || 0) - (a.completedDate || 0))
      .slice(0, 5);
  }, []);

  const filteredAchievements = useMemo(() => {
    return ACHIEVEMENTS.filter((a) => {
      if (rarityFilter !== "all" && a.rarity !== rarityFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return a.title.toLowerCase().includes(q) || a.description.toLowerCase().includes(q) || a.category.includes(q);
      }
      return true;
    });
  }, [searchQuery, rarityFilter]);

  return (
    <GameLayout>
      <div className="space-y-6">
        <section className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm bg-cover bg-center" style={{ backgroundImage: `linear-gradient(rgba(15,23,42,0.78), rgba(15,23,42,0.92)), url(${BACKGROUND_ASSETS.STAR_FIELD.path})` }}>
          <div className="p-5 lg:p-6 text-white">
            <div>
              <h1 className="text-4xl font-bold flex items-center gap-3" data-testid="text-achievements-title">
                <img src={OGAMEX_FEATURED_ASSETS.BACKGROUND.path} alt="Achievements" className="w-10 h-10 rounded-lg border border-white/10 bg-white/10 p-1.5 object-contain" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = TEMP_THEME_IMAGE; }} />
                Achievements & Quests
              </h1>
              <p className="text-slate-300 mt-2">Track your progress and earn rewards</p>
            </div>
            <div className="flex flex-wrap gap-3 mt-4">
              {[{ label: "Trophy", image: SHIP_ASSETS.CAPITALS.BATTLECRUISER.path }, { label: "Quests", image: MENU_ASSETS.BUILDINGS.SPACEPORT.path }, { label: "Ranks", image: MENU_ASSETS.NAVIGATION.DIPLOMACY.path }].map((item) => (
                <div key={item.label} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                  <img src={item.image} alt={item.label} className="w-10 h-10 rounded-lg border border-white/10 bg-black/10 p-1.5 object-contain" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = TEMP_THEME_IMAGE; }} />
                  <div className="text-sm font-semibold">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="grid grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-amber-500/10 flex items-center justify-center overflow-hidden"><img src={SHIP_ASSETS.CAPITALS.BATTLECRUISER.path} alt="Completed" className="w-8 h-8 object-contain" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = TEMP_THEME_IMAGE; }} /></div>
              <p className="text-2xl font-bold text-amber-900">{completedAchievements}</p>
              <p className="text-xs text-amber-700">Completed</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-blue-500/10 flex items-center justify-center overflow-hidden"><img src={MENU_ASSETS.NAVIGATION.RESEARCH.path} alt="Total" className="w-8 h-8 object-contain" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = TEMP_THEME_IMAGE; }} /></div>
              <p className="text-2xl font-bold text-blue-900">{totalAchievements}</p>
              <p className="text-xs text-blue-700">Total Achievements</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-green-500/10 flex items-center justify-center overflow-hidden"><img src={MENU_ASSETS.BUILDINGS.TRADE_STATION.path} alt="Quests Done" className="w-8 h-8 object-contain" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = TEMP_THEME_IMAGE; }} /></div>
              <p className="text-2xl font-bold text-green-900">{completedQuests}</p>
              <p className="text-xs text-green-700">Quests Done</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-purple-500/10 flex items-center justify-center overflow-hidden"><img src={SHIP_ASSETS.FIGHTERS.FIGHTER.path} alt="Active" className="w-8 h-8 object-contain" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = TEMP_THEME_IMAGE; }} /></div>
              <p className="text-2xl font-bold text-purple-900">{activeQuests}</p>
              <p className="text-xs text-purple-700">Active Quests</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-white border-slate-200">
            <CardContent className="pt-6">
              <p className="text-xs uppercase tracking-wide text-slate-500">Achievement Completion</p>
              <p className="text-2xl font-bold text-slate-900">{completionRate}%</p>
              <Progress value={completionRate} className="h-2 mt-2" />
              <div className="flex flex-wrap gap-2 mt-3">
                {categoryBreakdown.map(({ category, completed, total }) => (
                  <Badge key={category} variant="outline" className="text-[10px]">
                    {categoryIcons[category]} {completed}/{total}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border-slate-200">
            <CardContent className="pt-6">
              <p className="text-xs uppercase tracking-wide text-slate-500">XP Earned (Achievements)</p>
              <p className="text-2xl font-bold text-indigo-700">{totalAchievementXp.toLocaleString()}</p>
              <Progress value={totalAchievements > 0 ? (completedAchievements / totalAchievements) * 100 : 0} className="h-2 mt-2 bg-indigo-100" />
            </CardContent>
          </Card>
          <Card className="bg-white border-slate-200">
            <CardContent className="pt-6">
              <p className="text-xs uppercase tracking-wide text-slate-500">Prestige Earned</p>
              <p className="text-2xl font-bold text-amber-700">{totalAchievementPrestige.toLocaleString()}</p>
            </CardContent>
          </Card>
        </div>

        {recentUnlocks.length > 0 && (
          <Card className="bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 border-amber-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2 text-amber-800">
                <Flame className="w-5 h-5 text-amber-500" /> Recent Unlocks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {recentUnlocks.map((a) => (
                  <Badge key={a.id} className={cn("text-xs", rarityColors[a.rarity])}>
                    {categoryIcons[a.category]} {a.title}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="achievements" className="w-full">
          <TabsList className="bg-white border border-slate-200">
            <TabsTrigger value="achievements" data-testid="tab-achievements">
              <Trophy className="w-4 h-4 mr-2" /> Achievements
            </TabsTrigger>
            <TabsTrigger value="quests" data-testid="tab-quests">
              <Target className="w-4 h-4 mr-2" /> Quests
            </TabsTrigger>
            <TabsTrigger value="rarity">
              <Medal className="w-4 h-4 mr-2" /> By Rarity
            </TabsTrigger>
          </TabsList>

          <TabsContent value="achievements" className="space-y-4 mt-4">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search achievements..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white border-slate-200"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {rarities.map((r) => (
                  <Button
                    key={r}
                    variant={rarityFilter === r ? "default" : "outline"}
                    size="sm"
                    onClick={() => setRarityFilter(r)}
                    className="text-xs capitalize"
                  >
                    {r}
                  </Button>
                ))}
              </div>
            </div>

            <Tabs defaultValue="all">
              <TabsList className="bg-slate-100 flex-wrap h-auto gap-1 p-1">
                {categories.map(cat => (
                  <TabsTrigger key={cat} value={cat} className="capitalize text-xs">
                    {cat === "all" ? "All" : `${categoryIcons[cat] || ""} ${cat}`}
                  </TabsTrigger>
                ))}
              </TabsList>

              {categories.map(cat => {
                const catsToUse = cat === "all" ? categories.filter(c => c !== "all") : [cat];
                return (
                  <TabsContent key={cat} value={cat} className="space-y-3 mt-4">
                    {catsToUse.map((subCat) => {
                      const subAchievements = filteredAchievements.filter(a => a.category === subCat);
                      if (subAchievements.length === 0) return null;
                      return (
                        <div key={subCat}>
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                              <span>{categoryIcons[subCat]}</span> {subCat.charAt(0).toUpperCase() + subCat.slice(1)}
                            </h3>
                            <Badge variant="outline" className="text-xs">
                              {subAchievements.filter(a => a.completed).length}/{subAchievements.length}
                            </Badge>
                          </div>
                          <div className="space-y-3">
                            {subAchievements.map((achievement) => (
                              <AchievementCard key={achievement.id} achievement={achievement} />
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </TabsContent>
                );
              })}
            </Tabs>
          </TabsContent>

          <TabsContent value="quests" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs uppercase text-green-700">Available Quests</div>
                      <div className="text-2xl font-bold text-green-900">{QUESTS.filter(q => q.active && !q.completed).length}</div>
                    </div>
                    <TrendingUp className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs uppercase text-blue-700">Completion Rate</div>
                      <div className="text-2xl font-bold text-blue-900">{QUESTS.length > 0 ? Math.round((completedQuests / QUESTS.length) * 100) : 0}%</div>
                    </div>
                    <Award className="w-8 h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="space-y-4">
              {QUESTS.map(quest => (
                <QuestCard key={quest.id} quest={quest} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="rarity" className="mt-4">
            <div className="space-y-6">
              {rarities.filter(r => r !== "all").map((rarity) => {
                const rarityAchievements = ACHIEVEMENTS.filter(a => a.rarity === rarity);
                const completed = rarityAchievements.filter(a => a.completed).length;
                const total = rarityAchievements.length;
                const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

                return (
                  <Card key={rarity} className={cn("overflow-hidden", rarityBgColors[rarity])}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg capitalize flex items-center gap-2">
                          <Medal className={cn("w-5 h-5", rarity === "legendary" && "text-amber-500", rarity === "epic" && "text-purple-500", rarity === "rare" && "text-blue-500", rarity === "uncommon" && "text-green-500", rarity === "common" && "text-slate-500")} />
                          {rarity}
                        </CardTitle>
                        <Badge>{completed}/{total}</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1">
                          <Progress value={pct} className={cn("h-2", rarity === "legendary" && "bg-amber-200")} />
                        </div>
                        <span className="text-xs font-mono text-slate-500">{pct}%</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {rarityAchievements.map((a) => (
                          <AchievementCard key={a.id} achievement={a} />
                        ))}
                      </div>
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
