import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import GameLayout from "@/components/layout/GameLayout";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, CheckCircle2, Compass, Zap } from "lucide-react";
import { Link } from "wouter";

interface StoryCampaignData {
  currentAct: number;
  storyProgress: number;
  totalXpEarned: number;
  actDefinitions: Array<{ act: number; title: string; synopsis: string }>;
  missionCounts: {
    total: number;
    main: number;
    side: number;
    completed: number;
  };
}

interface StoryMission {
  id: string;
  title: string;
  description: string;
  npcName: string;
  rewardXp: number;
  missionType: "main" | "side";
  act: number;
  chapter: number;
  difficulty: number;
  isCompleted: boolean;
}

export default function StoryMode() {
  const { toast } = useToast();
  const [selectedAct, setSelectedAct] = useState<number>(1);
  const [missionType, setMissionType] = useState<"all" | "main" | "side">("all");

  const { data: campaign } = useQuery<StoryCampaignData>({
    queryKey: ["story-campaign"],
    queryFn: async () => {
      const res = await fetch("/api/story/campaign", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load story campaign");
      return res.json();
    },
  });

  const { data: missions = [] } = useQuery<StoryMission[]>({
    queryKey: ["story-missions", selectedAct, missionType],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set("act", String(selectedAct));
      params.set("type", missionType);
      const res = await fetch(`/api/story/missions?${params.toString()}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load story missions");
      return res.json();
    },
  });

  const { data: allMissions = [] } = useQuery<StoryMission[]>({
    queryKey: ["story-missions-all-acts"],
    queryFn: async () => {
      const res = await fetch("/api/story/missions", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load all story missions");
      return res.json();
    },
  });

  const completeMissionMutation = useMutation({
    mutationFn: async (missionId: string) => {
      const res = await apiRequest("POST", `/api/story/missions/${missionId}/complete`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["story-campaign"] });
      queryClient.invalidateQueries({ queryKey: ["story-missions", selectedAct, missionType] });
      toast({ title: "Mission completed", description: "Rewards have been applied." });
    },
    onError: (error: any) => {
      toast({ title: "Mission completion failed", description: error?.message || "Unknown error", variant: "destructive" });
    },
  });

  const difficultyColors: Record<number, string> = {
    1: "bg-green-600",
    2: "bg-blue-600",
    3: "bg-purple-600",
    4: "bg-orange-600",
    5: "bg-red-600",
    6: "bg-red-800",
  };

  const selectedActMissions = allMissions.filter((mission) => mission.act === selectedAct);
  const selectedActCompleted = selectedActMissions.filter((mission) => mission.isCompleted).length;
  const selectedActTotal = selectedActMissions.length;

  const actProgressByAct = allMissions.reduce<Record<number, { total: number; completed: number }>>((acc, mission) => {
    if (!acc[mission.act]) {
      acc[mission.act] = { total: 0, completed: 0 };
    }
    acc[mission.act].total += 1;
    if (mission.isCompleted) {
      acc[mission.act].completed += 1;
    }
    return acc;
  }, {});

  const sortedSelectedActMissions = [...selectedActMissions].sort((left, right) => {
    if (left.chapter !== right.chapter) return left.chapter - right.chapter;
    if (left.missionType !== right.missionType) return left.missionType === "main" ? -1 : 1;
    return left.title.localeCompare(right.title);
  });
  const nextRecommendedMission = sortedSelectedActMissions.find((mission) => !mission.isCompleted) || null;
  const selectedActCompletionRate = selectedActTotal > 0 ? Math.round((selectedActCompleted / selectedActTotal) * 100) : 0;
  const totalMainCompleted = allMissions.filter((mission) => mission.missionType === "main" && mission.isCompleted).length;
  const totalSideCompleted = allMissions.filter((mission) => mission.missionType === "side" && mission.isCompleted).length;

  return (
    <GameLayout>
      <div className="space-y-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2 flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-primary" />
            Story Mode
          </h1>
          <p className="text-muted-foreground">Play through 12 acts, 5 chapters per act, and 50 missions per act including side directives.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link href="/season-pass">
              <Button variant="outline" size="sm">Open Season Pass</Button>
            </Link>
            <Link href="/storefront">
              <Button variant="outline" size="sm">Open Storefront</Button>
            </Link>
          </div>
        </div>

        {/* Campaign Progress */}
        <Card className="bg-white border-slate-200 mb-6">
          <CardHeader>
            <CardTitle className="text-slate-900">Campaign Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Act {campaign?.currentAct || 1} of {campaign?.actDefinitions?.length || 12}</span>
              <div className="w-64 h-2 bg-slate-200 rounded">
                <div
                  className="h-full bg-primary rounded transition-all"
                  style={{ width: `${campaign?.storyProgress || 0}%` }}
                />
              </div>
              <span className="text-primary font-bold">{campaign?.storyProgress || 0}%</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-sm">
              <div className="bg-slate-50 border border-slate-200 rounded p-2">Main Missions: <span className="font-semibold">{campaign?.missionCounts?.main || 0}</span></div>
              <div className="bg-slate-50 border border-slate-200 rounded p-2">Side Missions: <span className="font-semibold">{campaign?.missionCounts?.side || 0}</span></div>
              <div className="bg-slate-50 border border-slate-200 rounded p-2">Completed: <span className="font-semibold">{campaign?.missionCounts?.completed || 0}</span></div>
              <div className="bg-slate-50 border border-slate-200 rounded p-2">XP Earned: <span className="font-semibold">{campaign?.totalXpEarned || 0}</span></div>
            </div>
          </CardContent>
        </Card>

        {/* Acts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(campaign?.actDefinitions || []).map((actDef) => (
            (() => {
              const actProgress = actProgressByAct[actDef.act] || { total: 0, completed: 0 };
              const isActComplete = actProgress.total > 0 && actProgress.completed === actProgress.total;
              return (
            <Card
              key={actDef.act}
              onClick={() => setSelectedAct(actDef.act)}
              className={`bg-white border-slate-200 cursor-pointer transition-all ${
                selectedAct === actDef.act ? "ring-2 ring-primary" : "hover:border-primary"
              }`}
              data-testid={`act-card-${actDef.act}`}
            >
              <CardHeader>
                <CardTitle className="text-slate-900">Act {actDef.act}: {actDef.title}</CardTitle>
                <CardDescription>{actDef.synopsis}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Badge className={difficultyColors[Math.min(actDef.act, 6)]}>
                    Difficulty {Math.min(10, actDef.act + 2)}
                  </Badge>
                  <Badge variant="outline" className={isActComplete ? "border-green-300 text-green-700" : "border-slate-300 text-slate-600"}>
                    {actProgress.completed}/{actProgress.total || 0}
                  </Badge>
                </div>
                <div className="mt-2 text-xs text-slate-600">
                  {isActComplete ? "Act Complete" : "In Progress"}
                </div>
              </CardContent>
            </Card>
              );
            })()
          ))}
        </div>

        {/* Selected Act Missions */}
        <div className="mt-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
              <h2 className="text-2xl font-bold text-slate-900">Act {selectedAct} Missions</h2>
              <Tabs value={missionType} onValueChange={(value) => setMissionType(value as "all" | "main" | "side")}>
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="main">Main</TabsTrigger>
                  <TabsTrigger value="side">Side</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <Card className="bg-white border-slate-200 mb-4">
              <CardContent className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                    <Compass className="w-4 h-4 text-primary" /> Next Recommended Mission
                  </div>
                  {nextRecommendedMission ? (
                    <div className="text-sm text-slate-600">
                      {nextRecommendedMission.title} · Chapter {nextRecommendedMission.chapter} · {nextRecommendedMission.missionType}
                    </div>
                  ) : (
                    <div className="text-sm text-green-700">All missions in this act are completed.</div>
                  )}
                </div>
                <Badge variant="outline" className="w-fit">
                  {selectedActCompleted}/{selectedActTotal} Completed
                </Badge>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
              <Card className="bg-white border-slate-200">
                <CardContent className="pt-4">
                  <div className="text-xs uppercase text-slate-500">Selected Act Completion</div>
                  <div className="text-2xl font-bold text-slate-900">{selectedActCompletionRate}%</div>
                </CardContent>
              </Card>
              <Card className="bg-white border-slate-200">
                <CardContent className="pt-4">
                  <div className="text-xs uppercase text-slate-500">Main Missions Completed</div>
                  <div className="text-2xl font-bold text-blue-700">{totalMainCompleted}</div>
                </CardContent>
              </Card>
              <Card className="bg-white border-slate-200">
                <CardContent className="pt-4">
                  <div className="text-xs uppercase text-slate-500">Side Missions Completed</div>
                  <div className="text-2xl font-bold text-purple-700">{totalSideCompleted}</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4">
              {missions.map((mission: any) => (
                <Card key={mission.id} className="bg-white border-slate-200">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-slate-900">{mission.title}</CardTitle>
                        <CardDescription>{mission.description}</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="text-primary">{mission.rewardXp} XP</Badge>
                        <Badge className={mission.missionType === "main" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"}>{mission.missionType}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-slate-600">
                      NPC: <span className="text-primary">{mission.npcName}</span>
                    </p>
                    <p className="text-sm text-slate-600">Difficulty: {mission.difficulty} · Chapter {mission.chapter}</p>
                    <Button
                      data-testid={`button-complete-mission-${mission.id}`}
                      className="w-full"
                      variant={mission.isCompleted ? "secondary" : "default"}
                      disabled={mission.isCompleted || completeMissionMutation.isPending}
                      onClick={() => completeMissionMutation.mutate(mission.id)}
                    >
                      {mission.isCompleted ? (
                        <span className="inline-flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Completed</span>
                      ) : (
                        <span className="inline-flex items-center gap-2"><Zap className="w-4 h-4" /> Complete Mission</span>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

        <Card className="bg-white border-slate-200">
          <CardHeader>
            <CardTitle>Narrative Progression Guidance</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-slate-600">
            <div className="rounded border border-slate-200 bg-slate-50 p-3">
              <div className="font-semibold text-slate-900">Core Path</div>
              <div>Prioritize main missions to unlock acts and key mechanics first.</div>
            </div>
            <div className="rounded border border-slate-200 bg-slate-50 p-3">
              <div className="font-semibold text-slate-900">Side Directives</div>
              <div>Use side missions for bonus XP and support resource acceleration.</div>
            </div>
            <div className="rounded border border-slate-200 bg-slate-50 p-3">
              <div className="font-semibold text-slate-900">Act Readiness</div>
              <div>Keep mission completion above 70% before pushing into higher-difficulty acts.</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </GameLayout>
  );
}
