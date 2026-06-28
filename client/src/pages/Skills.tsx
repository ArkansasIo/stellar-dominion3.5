import { useState, useEffect, useMemo } from "react";
import GameLayout from "@/components/layout/GameLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  type PlayerSkill,
  type AvailableSkill,
  type SkillQueueItem,
  type Attributes,
  SKILL_CATEGORIES,
  ATTRIBUTE_NAMES
} from "@/lib/skillsData";
import {
  BookOpen,
  Clock,
  Zap,
  Target,
  Navigation,
  Cpu,
  Cog,
  Factory,
  Microscope,
  Users,
  CheckCircle2,
  ArrowRight,
  Lock,
  TrendingUp,
  GraduationCap,
  Sparkles,
  GitBranch,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BACKGROUND_ASSETS, SHIP_ASSETS, MENU_ASSETS, OGAMEX_FEATURED_ASSETS } from "@shared/config";

const TEMP_THEME_IMAGE = "/theme-temp.png";

const CATEGORY_ICONS: Record<string, React.ComponentType<any>> = {
  combat: Target,
  navigation: Navigation,
  electronic: Cpu,
  mechanical: Cog,
  industry: Factory,
  science: Microscope,
  social: Users,
};

const CATEGORY_COLORS: Record<string, string> = {
  combat: "from-red-500 to-rose-600",
  navigation: "from-cyan-500 to-blue-600",
  electronic: "from-violet-500 to-purple-600",
  mechanical: "from-amber-500 to-orange-600",
  industry: "from-slate-500 to-slate-700",
  science: "from-emerald-500 to-green-600",
  social: "from-pink-500 to-fuchsia-600",
};

const CATEGORY_BG: Record<string, string> = {
  combat: "bg-red-50 border-red-200",
  navigation: "bg-cyan-50 border-cyan-200",
  electronic: "bg-violet-50 border-violet-200",
  mechanical: "bg-amber-50 border-amber-200",
  industry: "bg-slate-50 border-slate-200",
  science: "bg-emerald-50 border-emerald-200",
  social: "bg-pink-50 border-pink-200",
};

interface SkillNode {
  skillId: string;
  name: string;
  description: string;
  level: number;
  maxLevel: number;
  category: string;
  prerequisites: string[];
  tier: number;
  trained: boolean;
  training: boolean;
}

async function apiCall(url: string, method: string = "GET", body?: unknown): Promise<any> {
  const response = await fetch(url, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.json();
}

export default function Skills() {
  const [skills, setSkills] = useState<PlayerSkill[]>([]);
  const [availableSkills, setAvailableSkills] = useState<AvailableSkill[]>([]);
  const [skillQueue, setSkillQueue] = useState<SkillQueueItem[]>([]);
  const [attributes, setAttributes] = useState<Attributes>({
    intelligence: 5,
    memory: 5,
    charisma: 5,
    perception: 5,
    willpower: 5,
  });
  const [loading, setLoading] = useState(true);
  const [selectedSkill, setSelectedSkill] = useState<AvailableSkill | null>(null);
  const [skillTreeView, setSkillTreeView] = useState(false);

  useEffect(() => {
    loadSkills();
    loadAvailableSkills();
    loadSkillQueue();
  }, []);

  const loadSkills = async () => {
    try {
      const response = await apiCall("/api/skills");
      setSkills(response.skills || []);
      setAttributes(response.attributes || attributes);
    } catch (error) {
      console.error("Failed to load skills:", error);
    }
  };

  const loadAvailableSkills = async () => {
    try {
      const response = await apiCall("/api/skills/available");
      setAvailableSkills(response || []);
    } catch (error) {
      console.error("Failed to load available skills:", error);
    }
  };

  const loadSkillQueue = async () => {
    try {
      const response = await apiCall("/api/skills/queue");
      setSkillQueue(response.queue || []);
      if (response.completed && response.completed.length > 0) {
        loadSkills();
        loadAvailableSkills();
      }
    } catch (error) {
      console.error("Failed to load skill queue:", error);
    } finally {
      setLoading(false);
    }
  };

  const trainSkill = async (skillId: string) => {
    try {
      await apiCall("/api/skills/train", "POST", { skillId });
      loadAvailableSkills();
      loadSkillQueue();
    } catch (error) {
      console.error("Failed to train skill:", error);
    }
  };

  const formatTime = (seconds: number) => {
    if (seconds <= 0) return "Ready";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m ${secs}s`;
    return `${secs}s`;
  };

  const getQueueProgress = (item: SkillQueueItem) => {
    const now = Date.now() / 1000;
    const total = item.endTime - item.startTime;
    const elapsed = now - item.startTime;
    return Math.min((elapsed / total) * 100, 100);
  };

  const getTimeRemaining = (item: SkillQueueItem) => {
    const now = Date.now() / 1000;
    const remaining = item.endTime - now;
    return Math.max(remaining, 0);
  };

  const totalSkillLevels = skills.reduce((sum, s) => sum + s.level, 0);
  const skillsInQueue = skillQueue.length;
  const trainedCount = skills.length;

  const skillTree = useMemo(() => {
    const nodes: SkillNode[] = availableSkills.map((avail) => {
      const trained = skills.find((s) => s.skillId === avail.skillId);
      const inQueue = skillQueue.find((q) => q.skillId === avail.skillId);
      return {
        skillId: avail.skillId,
        name: avail.name,
        description: avail.description,
        level: trained?.level || 0,
        maxLevel: avail.maxLevel,
        category: avail.category,
        prerequisites: avail.attributes || [],
        tier: avail.currentLevel || 1,
        trained: !!trained,
        training: !!inQueue,
      };
    });
    return nodes;
  }, [availableSkills, skills, skillQueue]);

  const categoriesWithSkills = useMemo(() => {
    return Object.entries(SKILL_CATEGORIES).map(([key, name]) => {
      const trained = skills.filter((s) => s.category === key);
      const available = availableSkills.filter((s) => s.category === key);
      return { key, name, trained, available };
    }).filter((c) => c.trained.length > 0 || c.available.length > 0);
  }, [skills, availableSkills]);

  if (loading) {
    return (
      <GameLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading skills...</div>
        </div>
      </GameLayout>
    );
  }

  return (
    <GameLayout>
      <div className="space-y-6">
      <section className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm bg-cover bg-center" style={{ backgroundImage: `linear-gradient(rgba(15,23,42,0.78), rgba(15,23,42,0.92)), url(${BACKGROUND_ASSETS.RESEARCH_LAB.path})` }}>
          <div className="p-5 lg:p-6 space-y-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img src={MENU_ASSETS.BUILDINGS.RESEARCH_LAB.path} alt="Research" className="w-8 h-8 rounded-lg border border-white/10 bg-white/10 p-1.5 object-contain" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = TEMP_THEME_IMAGE; }} />
                <h1 className="text-2xl font-bold">Skills Training</h1>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSkillTreeView(!skillTreeView)}
                className="text-xs bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                {skillTreeView ? <Layers className="w-4 h-4 mr-2" /> : <GitBranch className="w-4 h-4 mr-2" />}
                {skillTreeView ? "List View" : "Tree View"}
              </Button>
            </div>
            <p className="text-sm leading-6 text-slate-300">Research and train new skills to enhance your empire's capabilities across combat, navigation, and industry.</p>
            <div className="flex flex-wrap gap-3">
              {[{ label: "Research Lab", image: MENU_ASSETS.BUILDINGS.RESEARCH_LAB.path }, { label: "Skill Tree", image: SHIP_ASSETS.FIGHTERS.SCOUT.path }, { label: "Attributes", image: MENU_ASSETS.NAVIGATION.RESEARCH.path }].map((item) => (
                <div key={item.label} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                  <img src={item.image} alt={item.label} className="w-10 h-10 rounded-lg border border-white/10 bg-black/10 p-1.5 object-contain" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = TEMP_THEME_IMAGE; }} />
                  <div className="text-sm font-semibold">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Attributes */}
        <Card>
          <CardHeader>
            <CardTitle>Attributes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {Object.entries(attributes).map(([attr, value]) => (
                <div key={attr} className="text-center p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="text-sm text-slate-500">
                    {ATTRIBUTE_NAMES[attr as keyof typeof ATTRIBUTE_NAMES]}
                  </div>
                  <div className="text-2xl font-bold text-slate-900">{value}</div>
                  <div className="mt-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${(value / 20) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center overflow-hidden"><img src={MENU_ASSETS.BUILDINGS.RESEARCH_LAB.path} alt="Skills Trained" className="w-8 h-8 object-contain" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = TEMP_THEME_IMAGE; }} /></div>
                <div>
                  <div className="text-xs uppercase text-indigo-600">Skills Trained</div>
                  <div className="text-2xl font-bold text-indigo-900">{trainedCount}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center overflow-hidden"><img src={SHIP_ASSETS.FIGHTERS.SCOUT.path} alt="Total Levels" className="w-8 h-8 object-contain" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = TEMP_THEME_IMAGE; }} /></div>
                <div>
                  <div className="text-xs uppercase text-amber-600">Total Levels</div>
                  <div className="text-2xl font-bold text-amber-900">{totalSkillLevels}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center overflow-hidden"><img src={SHIP_ASSETS.CAPITALS.CORVETTE.path} alt="In Queue" className="w-8 h-8 object-contain" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = TEMP_THEME_IMAGE; }} /></div>
                <div>
                  <div className="text-xs uppercase text-blue-600">In Queue</div>
                  <div className="text-2xl font-bold text-blue-900">{skillsInQueue}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center overflow-hidden"><img src={OGAMEX_FEATURED_ASSETS.RESEARCH.path} alt="Available to Train" className="w-8 h-8 object-contain" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = TEMP_THEME_IMAGE; }} /></div>
                <div>
                  <div className="text-xs uppercase text-green-600">Available to Train</div>
                  <div className="text-2xl font-bold text-green-900">{availableSkills.length}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {skillTreeView ? (
          <SkillTreeView
            skillTree={skillTree}
            selectedSkill={selectedSkill}
            setSelectedSkill={setSelectedSkill}
            onTrain={trainSkill}
            formatTime={formatTime}
            availableSkills={availableSkills}
          />
        ) : (
          <Tabs defaultValue="trained" className="space-y-4">
            <TabsList>
              <TabsTrigger value="trained">Trained Skills ({trainedCount})</TabsTrigger>
              <TabsTrigger value="available">Available ({availableSkills.length})</TabsTrigger>
              <TabsTrigger value="queue">Training Queue ({skillsInQueue})</TabsTrigger>
            </TabsList>

            <TabsContent value="trained" className="space-y-4">
              {categoriesWithSkills.filter(c => c.trained.length > 0).length === 0 ? (
                <Card><CardContent className="py-8 text-center text-slate-500">No skills trained yet. Start training from the Available tab.</CardContent></Card>
              ) : (
                categoriesWithSkills.filter(c => c.trained.length > 0).map(({ key, name, trained }) => {
                  const Icon = CATEGORY_ICONS[key] || BookOpen;
                  return (
                    <Card key={key}>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Icon className="h-5 w-5" />
                          {name}
                          <Badge className="ml-auto" variant="secondary">{trained.length} trained</Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-2">
                          {trained.map((skill) => (
                            <div key={skill.skillId} className="flex items-center justify-between p-3 border rounded-lg bg-white">
                              <div className="flex-1">
                                <div className="font-medium flex items-center gap-2">
                                  {skill.name}
                                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                                </div>
                                <div className="text-sm text-slate-500">{skill.description}</div>
                              </div>
                              <div className="text-right">
                                <Badge variant="secondary">
                                  Level {skill.level}/{skill.maxLevel}
                                </Badge>
                                <div className="mt-1 w-24">
                                  <Progress value={(skill.level / skill.maxLevel) * 100} className="h-1.5" />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </TabsContent>

            <TabsContent value="available" className="space-y-4">
              {availableSkills.length === 0 ? (
                <Card><CardContent className="py-8 text-center text-slate-500">No new skills available. Progress further to unlock more.</CardContent></Card>
              ) : (
                <div className="grid gap-4">
                  {Object.entries(SKILL_CATEGORIES).map(([category, name]) => {
                    const categorySkills = availableSkills.filter(skill => skill.category === category);
                    if (categorySkills.length === 0) return null;
                    const Icon = CATEGORY_ICONS[category] || BookOpen;

                    return (
                      <Card key={category}>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Icon className="h-5 w-5" />
                            {name}
                            <Badge className="ml-auto" variant="secondary">{categorySkills.length} available</Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid gap-2">
                            {categorySkills.map((skill) => (
                              <div
                                key={skill.skillId}
                                className="flex items-center justify-between p-3 border rounded-lg bg-white hover:border-primary/30 cursor-pointer transition-colors"
                                onClick={() => setSelectedSkill(selectedSkill?.skillId === skill.skillId ? null : skill)}
                              >
                                <div className="flex-1">
                                  <div className="font-medium">{skill.name}</div>
                                  <div className="text-sm text-slate-500">{skill.description}</div>
                                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                                    <span>Attributes: {skill.attributes.map(attr =>
                                      ATTRIBUTE_NAMES[attr as keyof typeof ATTRIBUTE_NAMES]
                                    ).join(", ")}</span>
                                  </div>
                                  {selectedSkill?.skillId === skill.skillId && (
                                    <div className="mt-2 p-2 bg-slate-50 rounded border border-slate-200 text-xs text-slate-600">
                                      <div className="font-medium text-slate-800 mb-1">Skill Details</div>
                                      <div>Training Time: {formatTime(skill.trainingTime)}</div>
                                      <div>Next Level: {skill.currentLevel + 1}/{skill.maxLevel}</div>
                                      <div>Category Bonus: +{(skill as any).bonusValue || 0}% per level</div>
                                    </div>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 ml-4">
                                  <div className="text-right text-sm">
                                    <div className="font-mono text-slate-700">Lvl {skill.currentLevel + 1}/{skill.maxLevel}</div>
                                    <div className="flex items-center gap-1 text-xs text-slate-400">
                                      <Clock className="h-3 w-3" />
                                      {formatTime(skill.trainingTime)}
                                    </div>
                                  </div>
                                  <Button
                                    size="sm"
                                    onClick={(e) => { e.stopPropagation(); trainSkill(skill.skillId); }}
                                  >
                                    Train
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            <TabsContent value="queue" className="space-y-4">
              {skillQueue.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center text-slate-500">
                    <GraduationCap className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                    No skills currently training
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {skillQueue.map((item, index) => {
                    const progress = getQueueProgress(item);
                    const remaining = getTimeRemaining(item);
                    const skill = availableSkills.find(s => s.skillId === item.skillId) ||
                                 skills.find(s => s.skillId === item.skillId);

                    return (
                      <Card key={`${item.skillId}-${index}`}>
                        <CardContent className="py-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className={cn(
                                "w-2 h-2 rounded-full animate-pulse",
                                remaining > 0 ? "bg-blue-500" : "bg-green-500"
                              )} />
                              <div>
                                <div className="font-medium">
                                  {skill?.name || item.skillId} - Level {item.level}
                                </div>
                                <div className="text-sm text-slate-500">
                                  {remaining > 0 ? `${formatTime(remaining)} remaining` : "Completing..."}
                                </div>
                              </div>
                            </div>
                            <Badge variant={remaining > 0 ? "secondary" : "default"}>
                              {remaining > 0 ? "Training" : "Finishing"}
                            </Badge>
                          </div>
                          <Progress value={progress} className="h-2" />
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </GameLayout>
  );
}

function SkillTreeView({
  skillTree,
  selectedSkill,
  setSelectedSkill,
  onTrain,
  formatTime,
  availableSkills,
}: {
  skillTree: SkillNode[];
  selectedSkill: AvailableSkill | null;
  setSelectedSkill: (skill: any) => void;
  onTrain: (id: string) => void;
  formatTime: (s: number) => string;
  availableSkills: AvailableSkill[];
}) {
  const [filter, setFilter] = useState<string>("all");

  const categories = [...new Set(skillTree.map((n) => n.category))];

  const filtered = useMemo(() => {
    if (filter === "all") return skillTree;
    if (filter === "trained") return skillTree.filter((n) => n.trained);
    if (filter === "available") return skillTree.filter((n) => !n.trained && !n.training);
    if (filter === "training") return skillTree.filter((n) => n.training);
    return skillTree.filter((n) => n.category === filter);
  }, [skillTree, filter]);

  const tiered = useMemo(() => {
    const tiers: Record<number, SkillNode[]> = {};
    filtered.forEach((n) => {
      if (!tiers[n.tier]) tiers[n.tier] = [];
      tiers[n.tier].push(n);
    });
    return Object.entries(tiers).sort(([a], [b]) => Number(a) - Number(b));
  }, [filtered]);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <GitBranch className="w-5 h-5" /> Skill Progression Tree
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>All</Button>
            <Button variant={filter === "trained" ? "default" : "outline"} size="sm" onClick={() => setFilter("trained")}>Trained</Button>
            <Button variant={filter === "available" ? "default" : "outline"} size="sm" onClick={() => setFilter("available")}>Available</Button>
            <Button variant={filter === "training" ? "default" : "outline"} size="sm" onClick={() => setFilter("training")}>Training</Button>
            {categories.map((cat: string) => {
              const Icon = CATEGORY_ICONS[cat as keyof typeof CATEGORY_ICONS] || BookOpen;
              return (
                <Button key={cat} variant={filter === cat ? "default" : "outline"} size="sm" onClick={() => setFilter(cat)} className="text-xs">
                  <Icon className="w-3 h-3 mr-1" /> {SKILL_CATEGORIES[cat as keyof typeof SKILL_CATEGORIES] || cat}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {tiered.length === 0 ? (
        <Card><CardContent className="py-8 text-center text-slate-500">No skills match the current filter.</CardContent></Card>
      ) : (
        tiered.map(([tier, nodes]) => (
          <div key={tier}>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="outline" className="text-xs">Tier {tier}</Badge>
              <Separator className="flex-1" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {nodes.map((node) => {
                const Icon = CATEGORY_ICONS[node.category] || BookOpen;
                const isSelectable = !node.trained && !node.training;
                return (
                  <Card
                    key={node.skillId}
                    className={cn(
                      "border transition-all cursor-pointer",
                      node.trained && "border-green-200 bg-green-50/30",
                      node.training && "border-blue-200 bg-blue-50/30",
                      isSelectable && "hover:border-primary/40",
                      !isSelectable && !node.trained && !node.training && "border-slate-200",
                    )}
                    onClick={() => {
                      if (node.trained) return;
                      const avail = availableSkills.find((s) => s.skillId === node.skillId);
                      if (avail) setSelectedSkill(selectedSkill?.skillId === node.skillId ? null : avail);
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Icon className={cn("w-4 h-4", node.trained ? "text-green-600" : "text-slate-400")} />
                          <span className="font-medium text-sm">{node.name}</span>
                        </div>
                        {node.trained && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                        {node.training && <Clock className="w-4 h-4 text-blue-500" />}
                      </div>
                      <div className="text-xs text-slate-500 mb-2">{node.description}</div>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-[10px]">
                          Lvl {node.level}/{node.maxLevel}
                        </Badge>
                        {isSelectable && (
                          <Button size="sm" className="h-7 text-xs" onClick={(e) => { e.stopPropagation(); onTrain(node.skillId); }}>
                            Train
                          </Button>
                        )}
                      </div>
                      {node.prerequisites.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1 text-[10px] text-slate-400">
                          <ArrowRight className="w-3 h-3" />
                          {node.prerequisites.join(", ")}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
