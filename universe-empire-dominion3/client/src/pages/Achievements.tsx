import GameLayout from "@/components/layout/GameLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ACHIEVEMENTS, QUESTS, Achievement, Quest } from "@/lib/achievementsSystem";
import { Trophy, Star, Target, CheckCircle2, Circle, Clock, Zap } from "lucide-react";

const rarityColors: Record<string, string> = {
  common: "bg-slate-100 text-slate-700 border-slate-300",
  uncommon: "bg-green-100 text-green-700 border-green-300",
  rare: "bg-blue-100 text-blue-700 border-blue-300",
  epic: "bg-purple-100 text-purple-700 border-purple-300",
  legendary: "bg-amber-100 text-amber-700 border-amber-300"
};

const categoryIcons: Record<string, any> = {
  exploration: "🔭",
  combat: "⚔️",
  economics: "💰",
  technology: "🔬",
  diplomacy: "🤝",
  milestones: "🏆"
};

const difficultyColors: Record<string, string> = {
  easy: "bg-green-100 text-green-700",
  normal: "bg-blue-100 text-blue-700",
  hard: "bg-orange-100 text-orange-700",
  expert: "bg-red-100 text-red-700"
};

function AchievementCard({ achievement }: { achievement: Achievement }) {
  const progress = Math.round((achievement.progress / achievement.requirement) * 100);
  
  return (
    <Card className={`border-2 ${achievement.completed ? 'border-amber-300 bg-amber-50/50' : 'border-slate-200'}`} data-testid={`card-achievement-${achievement.id}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className={`text-3xl p-2 rounded-lg ${achievement.completed ? 'bg-amber-100' : 'bg-slate-100'}`}>
            {categoryIcons[achievement.category] || "🎯"}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-bold text-slate-900">{achievement.title}</h3>
              <Badge className={rarityColors[achievement.rarity]}>
                {achievement.rarity}
              </Badge>
            </div>
            <p className="text-sm text-slate-600 mb-3">{achievement.description}</p>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Progress</span>
                <span className="font-mono font-bold">{achievement.progress} / {achievement.requirement}</span>
              </div>
              <Progress value={progress} className="h-2" />
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
  const progress = Math.round((completedObjectives / totalObjectives) * 100);
  
  return (
    <Card className={`border-2 ${quest.completed ? 'border-green-300 bg-green-50/50' : quest.active ? 'border-blue-200' : 'border-slate-200'}`} data-testid={`card-quest-${quest.id}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className={`w-5 h-5 ${quest.active ? 'text-blue-600' : 'text-slate-400'}`} />
            <CardTitle className="text-lg">{quest.title}</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={difficultyColors[quest.difficulty]}>
              {quest.difficulty}
            </Badge>
            {quest.active && <Badge className="bg-blue-500 text-white">Active</Badge>}
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
          <Progress value={progress} className="h-2" />
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
                {obj.current}/{obj.target}
              </span>
            </div>
          ))}
        </div>
        
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
          <p className="text-xs font-bold text-slate-600 mb-2">REWARDS</p>
          <div className="flex flex-wrap gap-3 text-xs">
            {quest.rewards.metal && (
              <span className="text-slate-600">🔩 {quest.rewards.metal.toLocaleString()} Metal</span>
            )}
            {quest.rewards.crystal && (
              <span className="text-blue-600">💎 {quest.rewards.crystal.toLocaleString()} Crystal</span>
            )}
            {quest.rewards.deuterium && (
              <span className="text-green-600">⚗️ {quest.rewards.deuterium.toLocaleString()} Deuterium</span>
            )}
            <span className="text-purple-600">⭐ {quest.rewards.xp} XP</span>
            {quest.rewards.technology && (
              <span className="text-amber-600">🔬 Unlock: {quest.rewards.technology}</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Achievements() {
  const categories = ["all", "exploration", "combat", "economics", "technology", "diplomacy", "milestones"];
  const completedAchievements = ACHIEVEMENTS.filter((achievement) => achievement.completed).length;
  const totalAchievements = ACHIEVEMENTS.length;
  const activeQuests = QUESTS.filter((quest) => quest.active).length;
  const completedQuests = QUESTS.filter((quest) => quest.completed).length;
  const completionRate = totalAchievements > 0 ? Math.round((completedAchievements / totalAchievements) * 100) : 0;

  const totalAchievementXp = ACHIEVEMENTS
    .filter((achievement) => achievement.completed)
    .reduce((sum, achievement) => sum + achievement.rewards.xp, 0);
  const totalAchievementPrestige = ACHIEVEMENTS
    .filter((achievement) => achievement.completed)
    .reduce((sum, achievement) => sum + achievement.rewards.prestige, 0);
  
  return (
    <GameLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 flex items-center gap-3" data-testid="text-achievements-title">
            <Trophy className="w-10 h-10 text-amber-500" />
            Achievements & Quests
          </h1>
          <p className="text-slate-600 mt-2">Track your progress and earn rewards</p>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
            <CardContent className="p-4 text-center">
              <Trophy className="w-8 h-8 text-amber-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-amber-900">{completedAchievements}</p>
              <p className="text-xs text-amber-700">Completed</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-4 text-center">
              <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-900">{totalAchievements}</p>
              <p className="text-xs text-blue-700">Total Achievements</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-4 text-center">
              <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-900">{completedQuests}</p>
              <p className="text-xs text-green-700">Quests Done</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-4 text-center">
              <Clock className="w-8 h-8 text-purple-600 mx-auto mb-2" />
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
            </CardContent>
          </Card>
          <Card className="bg-white border-slate-200">
            <CardContent className="pt-6">
              <p className="text-xs uppercase tracking-wide text-slate-500">XP Earned (Achievements)</p>
              <p className="text-2xl font-bold text-indigo-700">{totalAchievementXp.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card className="bg-white border-slate-200">
            <CardContent className="pt-6">
              <p className="text-xs uppercase tracking-wide text-slate-500">Prestige Earned</p>
              <p className="text-2xl font-bold text-amber-700">{totalAchievementPrestige.toLocaleString()}</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="achievements" className="w-full">
          <TabsList className="bg-white border border-slate-200">
            <TabsTrigger value="achievements" data-testid="tab-achievements">Achievements</TabsTrigger>
            <TabsTrigger value="quests" data-testid="tab-quests">Quests</TabsTrigger>
          </TabsList>

          <TabsContent value="achievements" className="space-y-4 mt-4">
            <Tabs defaultValue="all">
              <TabsList className="bg-slate-100 flex-wrap h-auto gap-1 p-1">
                {categories.map(cat => (
                  <TabsTrigger key={cat} value={cat} className="capitalize text-xs">
                    {cat === "all" ? "All" : `${categoryIcons[cat] || ""} ${cat}`}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {categories.map(cat => (
                <TabsContent key={cat} value={cat} className="space-y-3 mt-4">
                  {ACHIEVEMENTS
                    .filter(a => cat === "all" || a.category === cat)
                    .map(achievement => (
                      <AchievementCard key={achievement.id} achievement={achievement} />
                    ))}
                </TabsContent>
              ))}
            </Tabs>
          </TabsContent>

          <TabsContent value="quests" className="space-y-4 mt-4">
            <div className="space-y-4">
              {QUESTS.map(quest => (
                <QuestCard key={quest.id} quest={quest} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </GameLayout>
  );
}
