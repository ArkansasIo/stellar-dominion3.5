import GameLayout from "@/components/layout/GameLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Brain, Award, Lightbulb, Zap, Target, Users, Sword } from "lucide-react";

const KNOWLEDGE_TYPES = [
  { name: "Military", icon: Sword, color: "bg-red-100 text-red-900", description: "Combat & warfare tactics" },
  { name: "Engineering", icon: Lightbulb, color: "bg-orange-100 text-orange-900", description: "Building & construction" },
  { name: "Science", icon: Zap, color: "bg-blue-100 text-blue-900", description: "Research & discovery" },
  { name: "Agriculture", icon: Target, color: "bg-green-100 text-green-900", description: "Food & resources" },
  { name: "Commerce", icon: Lightbulb, color: "bg-yellow-100 text-yellow-900", description: "Trading & economy" },
  { name: "Diplomacy", icon: Users, color: "bg-purple-100 text-purple-900", description: "Alliance & negotiation" },
  { name: "Exploration", icon: Lightbulb, color: "bg-cyan-100 text-cyan-900", description: "Discovery & expansion" },
  { name: "Arcane", icon: Zap, color: "bg-indigo-100 text-indigo-900", description: "Magic & mystical arts" },
  { name: "Medicine", icon: Lightbulb, color: "bg-pink-100 text-pink-900", description: "Healing & health" },
  { name: "Espionage", icon: Target, color: "bg-slate-100 text-slate-900", description: "Spying & intelligence" },
];

const KNOWLEDGE_CLASSES = [
  { class: "Novice", tier: 1, levels: "1-10", bonus: 0.1 },
  { class: "Apprentice", tier: 2, levels: "11-30", bonus: 0.25 },
  { class: "Journeyman", tier: 3, levels: "31-50", bonus: 0.5 },
  { class: "Expert", tier: 4, levels: "51-100", bonus: 1.0 },
];

const KNOWLEDGE_TIERS = [
  { name: "Foundation", tier: 1, maxLevel: 100 },
  { name: "Intermediate", tier: 2, maxLevel: 100 },
  { name: "Advanced", tier: 3, maxLevel: 100 },
  { name: "Master", tier: 4, maxLevel: 100 },
  { name: "Supreme", tier: 5, maxLevel: 100 },
];

export default function KnowledgeLibrary() {
  return (
    <GameLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-orbitron font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-8 h-8" />
            Knowledge Library
          </h2>
          <p className="text-muted-foreground font-rajdhani text-lg">Master 10 knowledge types across 4 classes and 5 tiers (2000 unique knowledge points)</p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="types" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white border border-slate-200 h-14 shadow-sm">
            <TabsTrigger value="types" className="font-orbitron text-sm flex items-center gap-1">
              <Brain className="w-4 h-4" />
              Types
            </TabsTrigger>
            <TabsTrigger value="classes" className="font-orbitron text-sm flex items-center gap-1">
              <Award className="w-4 h-4" />
              Classes
            </TabsTrigger>
            <TabsTrigger value="progression" className="font-orbitron text-sm flex items-center gap-1">
              <Zap className="w-4 h-4" />
              Progression
            </TabsTrigger>
            <TabsTrigger value="synergies" className="font-orbitron text-sm flex items-center gap-1">
              <Target className="w-4 h-4" />
              Synergies
            </TabsTrigger>
          </TabsList>

          {/* Knowledge Types */}
          <TabsContent value="types" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {KNOWLEDGE_TYPES.map((type, idx) => {
                const Icon = type.icon;
                return (
                  <Card key={idx} className="bg-white border-slate-200 hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <CardTitle className="font-orbitron flex items-center gap-2">
                          <Icon className="w-5 h-5" />
                          {type.name}
                        </CardTitle>
                        <Badge className={type.color}>Type</Badge>
                      </div>
                      <CardDescription>{type.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="text-xs font-rajdhani font-semibold text-slate-600 mb-2">Knowledge Path Progress</p>
                        <Progress value={45} className="h-2" />
                        <p className="text-xs text-slate-500 mt-1">450/1000 mastery points</p>
                      </div>
                      <div className="grid grid-cols-4 gap-1">
                        {[1,2,3,4].map(i => (
                          <div key={i} className="bg-slate-50 border border-slate-200 rounded p-2 text-center">
                            <p className="text-xs font-bold text-slate-700">C{i}</p>
                            <p className="text-xs text-slate-600">50L</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Knowledge Classes */}
          <TabsContent value="classes" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {KNOWLEDGE_CLASSES.map((k, idx) => (
                <Card key={idx} className="bg-white border-slate-200">
                  <CardHeader>
                    <CardTitle className="font-orbitron">{k.class}</CardTitle>
                    <CardDescription>Levels {k.levels}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm font-rajdhani font-semibold mb-2">Mastery Bonus</p>
                      <Badge className="bg-blue-100 text-blue-900 font-bold text-lg py-2 px-4">
                        +{(k.bonus * 100).toFixed(0)}%
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs text-center">
                      <div className="bg-slate-50 border border-slate-200 rounded p-2">
                        <p className="font-bold">10</p>
                        <p className="text-slate-600">Types</p>
                      </div>
                      <div className="bg-slate-50 border border-slate-200 rounded p-2">
                        <p className="font-bold">5</p>
                        <p className="text-slate-600">Tiers</p>
                      </div>
                      <div className="bg-slate-50 border border-slate-200 rounded p-2">
                        <p className="font-bold">500</p>
                        <p className="text-slate-600">Points</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Progression */}
          <TabsContent value="progression" className="mt-6">
            <div className="space-y-4">
              {KNOWLEDGE_TIERS.map((tier, idx) => (
                <Card key={idx} className="bg-white border-slate-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="font-orbitron">{tier.name} Tier</CardTitle>
                      <Badge className="bg-primary/10 text-primary">Tier {tier.tier}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-rajdhani">Progress</span>
                        <span className="text-sm font-bold text-primary">{(tier.tier * 20)}%</span>
                      </div>
                      <Progress value={tier.tier * 20} className="h-3" />
                    </div>
                    <p className="text-xs text-slate-600">
                      Max Level: <span className="font-bold text-slate-900">{tier.maxLevel}</span> • 
                      {tier.maxLevel * 10} mastery points available
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Synergies */}
          <TabsContent value="synergies" className="mt-6">
            <Card className="bg-white border-slate-200">
              <CardHeader>
                <CardTitle className="font-orbitron">Knowledge Synergies</CardTitle>
                <CardDescription>Combining different knowledge types grants bonus effects</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { combo: "Military + Engineering", bonus: "Combat building efficiency +20%" },
                    { combo: "Science + Arcane", bonus: "Research speed +15%" },
                    { combo: "Commerce + Diplomacy", bonus: "Trade profit +25%" },
                    { combo: "Exploration + Navigation", bonus: "Fleet speed +10%" },
                    { combo: "Medicine + Agriculture", bonus: "Population growth +30%" },
                    { combo: "Espionage + Intelligence", bonus: "Detection range +40%" },
                  ].map((syn, idx) => (
                    <div key={idx} className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                      <p className="font-semibold font-rajdhani text-slate-900">{syn.combo}</p>
                      <Badge className="bg-green-100 text-green-900 mt-2">{syn.bonus}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </GameLayout>
  );
}
