import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Award, Zap } from "lucide-react";

export default function StoryMode() {
  const [selectedAct, setSelectedAct] = useState<number | null>(null);

  const { data: campaign = {} } = useQuery({
    queryKey: ["story-campaign"],
    queryFn: () => fetch("/api/story/campaign").then(r => r.json()).catch(() => ({})),
  });

  const { data: missions = [] } = useQuery({
    queryKey: ["story-missions", selectedAct],
    queryFn: () =>
      fetch("/api/story/missions").then(r => r.json()).catch(() => []),
  });

  const difficultyColors: Record<number, string> = {
    1: "bg-green-600",
    2: "bg-blue-600",
    3: "bg-purple-600",
    4: "bg-orange-600",
    5: "bg-red-600",
    6: "bg-red-800",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-primary" />
            Story Mode
          </h1>
          <p className="text-slate-400">Follow the epic saga of your empire</p>
        </div>

        {/* Campaign Progress */}
        <Card className="bg-slate-800 border-slate-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white">Campaign Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Act {campaign.currentAct || 1} of 12</span>
              <div className="w-64 h-2 bg-slate-700 rounded">
                <div
                  className="h-full bg-primary rounded transition-all"
                  style={{ width: `${(campaign.storyProgress || 0)}%` }}
                />
              </div>
              <span className="text-primary font-bold">{campaign.storyProgress || 0}%</span>
            </div>
            <p className="text-sm text-slate-400">
              XP Earned: <span className="text-white">{campaign.totalXpEarned || 0}</span>
            </p>
          </CardContent>
        </Card>

        {/* Acts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((act) => (
            <Card
              key={act}
              onClick={() => setSelectedAct(act)}
              className={`bg-slate-800 border-slate-700 cursor-pointer transition-all ${
                selectedAct === act ? "ring-2 ring-primary" : "hover:border-primary"
              }`}
              data-testid={`act-card-${act}`}
            >
              <CardHeader>
                <CardTitle className="text-white">Act {act}</CardTitle>
                <CardDescription>Chapter {act} of the saga</CardDescription>
              </CardHeader>
              <CardContent>
                <Badge className={difficultyColors[Math.min(act, 6)]}>
                  Difficulty {Math.min(act, 10)}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Selected Act Missions */}
        {selectedAct && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-white mb-4">Act {selectedAct} Missions</h2>
            <div className="grid gap-4">
              {missions.map((mission: any) => (
                <Card key={mission.id} className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-white">{mission.title}</CardTitle>
                        <CardDescription>{mission.description}</CardDescription>
                      </div>
                      <Badge variant="outline" className="text-primary">
                        {mission.rewardXp} XP
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-slate-300">
                      NPC: <span className="text-primary">{mission.npcName}</span>
                    </p>
                    <Button
                      data-testid={`button-start-mission-${mission.id}`}
                      className="w-full"
                    >
                      Start Mission
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
