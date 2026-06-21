import { useState, useEffect } from "react";
import GameLayout from "@/components/layout/GameLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
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
  Users
} from "lucide-react";

const CATEGORY_ICONS = {
  combat: Target,
  navigation: Navigation,
  electronic: Cpu,
  mechanical: Cog,
  industry: Factory,
  science: Microscope,
  social: Users
};

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
    willpower: 5
  });
  const [loading, setLoading] = useState(true);

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
        // Reload skills if any completed
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
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
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
        <div className="flex items-center gap-2">
          <BookOpen className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Skills Training</h1>
        </div>

        {/* Attributes */}
        <Card>
          <CardHeader>
            <CardTitle>Attributes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {Object.entries(attributes).map(([attr, value]) => (
                <div key={attr} className="text-center">
                  <div className="text-sm text-muted-foreground">
                    {ATTRIBUTE_NAMES[attr as keyof typeof ATTRIBUTE_NAMES]}
                  </div>
                  <div className="text-2xl font-bold">{value}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="trained" className="space-y-4">
          <TabsList>
            <TabsTrigger value="trained">Trained Skills</TabsTrigger>
            <TabsTrigger value="available">Available Skills</TabsTrigger>
            <TabsTrigger value="queue">Training Queue</TabsTrigger>
          </TabsList>

          <TabsContent value="trained" className="space-y-4">
            <div className="grid gap-4">
              {Object.entries(SKILL_CATEGORIES).map(([category, name]) => {
                const categorySkills = skills.filter(skill => skill.category === category);
                if (categorySkills.length === 0) return null;

                const Icon = CATEGORY_ICONS[category as keyof typeof CATEGORY_ICONS] || BookOpen;

                return (
                  <Card key={category}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Icon className="h-5 w-5" />
                        {name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-2">
                        {categorySkills.map((skill) => (
                          <div key={skill.skillId} className="flex items-center justify-between p-2 border rounded">
                            <div>
                              <div className="font-medium">{skill.name}</div>
                              <div className="text-sm text-muted-foreground">{skill.description}</div>
                            </div>
                            <div className="text-right">
                              <Badge variant="secondary">
                                Level {skill.level}/{skill.maxLevel}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="available" className="space-y-4">
            <div className="grid gap-4">
              {Object.entries(SKILL_CATEGORIES).map(([category, name]) => {
                const categorySkills = availableSkills.filter(skill => skill.category === category);
                if (categorySkills.length === 0) return null;

                const Icon = CATEGORY_ICONS[category as keyof typeof CATEGORY_ICONS] || BookOpen;

                return (
                  <Card key={category}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Icon className="h-5 w-5" />
                        {name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-2">
                        {categorySkills.map((skill) => (
                          <div key={skill.skillId} className="flex items-center justify-between p-2 border rounded">
                            <div className="flex-1">
                              <div className="font-medium">{skill.name}</div>
                              <div className="text-sm text-muted-foreground">{skill.description}</div>
                              <div className="text-xs text-muted-foreground mt-1">
                                Attributes: {skill.attributes.map(attr =>
                                  ATTRIBUTE_NAMES[attr as keyof typeof ATTRIBUTE_NAMES]
                                ).join(", ")}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="text-right text-sm">
                                <div>Level {skill.currentLevel + 1}/{skill.maxLevel}</div>
                                <div className="flex items-center gap-1 text-muted-foreground">
                                  <Clock className="h-3 w-3" />
                                  {formatTime(skill.trainingTime)}
                                </div>
                              </div>
                              <Button
                                size="sm"
                                onClick={() => trainSkill(skill.skillId)}
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
          </TabsContent>

          <TabsContent value="queue" className="space-y-4">
            {skillQueue.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
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
                          <div>
                            <div className="font-medium">
                              {skill?.name || item.skillId} - Level {item.level}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {remaining > 0 ? `${formatTime(remaining)} remaining` : "Completing..."}
                            </div>
                          </div>
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
      </div>
    </GameLayout>
  );
}
