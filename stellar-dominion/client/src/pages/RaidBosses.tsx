import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sword, Shield, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const rarityColors: Record<string, string> = {
  common: "bg-slate-600",
  rare: "bg-blue-600",
  epic: "bg-purple-600",
  legendary: "bg-yellow-600",
  mythic: "bg-red-600",
  transcendent: "bg-pink-600",
};

export default function RaidBosses() {
  const { toast } = useToast();
  const [selectedRarity, setSelectedRarity] = useState<string | null>(null);
  const [selectedBossId, setSelectedBossId] = useState<string | null>(null);

  const { data: bosses = [] } = useQuery({
    queryKey: ["bosses"],
    queryFn: () => fetch("/api/bosses").then(r => r.json()).catch(() => []),
  });

  const filtered = selectedRarity ? bosses.filter((b: any) => b.rarity === selectedRarity) : bosses;
  const selectedBoss = filtered.find((boss: any) => boss.id === selectedBossId) || null;

  const avgRecommendedLevel =
    filtered.length > 0
      ? Math.round(filtered.reduce((sum: number, boss: any) => sum + Number(boss.recommendedLevel || 0), 0) / filtered.length)
      : 0;
  const maxHealth = filtered.reduce((max: number, boss: any) => Math.max(max, Number(boss.healthPoints || 0)), 0);

  const challengeMutation = useMutation({
    mutationFn: async (boss: any) => {
      const response = await fetch(`/api/bosses/${boss.id}/challenge`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ bossName: boss.name, recommendedLevel: boss.recommendedLevel }),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.message || body.error || "Failed to challenge boss");
      }
      return response.json();
    },
    onSuccess: (data, boss) => {
      toast({ title: "Raid launched", description: `${boss.name} engaged. ${data.message || "Battle in progress."}` });
    },
    onError: (error: Error) => {
      toast({ title: "Challenge failed", description: error.message, variant: "destructive" });
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 flex items-center gap-2">
          <Sword className="w-8 h-8 text-red-500" />
          Raid Bosses (90 Types)
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <div className="text-xs text-slate-400 uppercase">Visible Bosses</div>
              <div className="text-2xl font-bold text-white">{filtered.length}</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <div className="text-xs text-slate-400 uppercase">Avg Recommended</div>
              <div className="text-2xl font-bold text-blue-400">Lv {avgRecommendedLevel}</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <div className="text-xs text-slate-400 uppercase">Max Health Pool</div>
              <div className="text-2xl font-bold text-red-400">{maxHealth}</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <div className="text-xs text-slate-400 uppercase">Rarity Filter</div>
              <div className="text-2xl font-bold text-yellow-400 capitalize">{selectedRarity || 'all'}</div>
            </CardContent>
          </Card>
        </div>

        {/* Rarity Filter */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {["common", "rare", "epic", "legendary", "mythic", "transcendent"].map((rarity) => (
            <Button
              key={rarity}
              onClick={() => setSelectedRarity(selectedRarity === rarity ? null : rarity)}
              variant={selectedRarity === rarity ? "default" : "outline"}
              className="capitalize"
            >
              {rarity}
            </Button>
          ))}
        </div>

        {/* Bosses Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((boss: any) => (
            <Card key={boss.id} className={`bg-slate-800 border-slate-700 ${selectedBossId === boss.id ? 'ring-2 ring-primary' : ''}`}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-white">{boss.name}</CardTitle>
                  <Badge className={rarityColors[boss.rarity]}>
                    {boss.rarity}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-slate-300">{boss.description}</p>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <p className="text-xs text-slate-400">Health</p>
                    <p className="text-sm font-bold text-red-400">{boss.healthPoints} HP</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-slate-400">Attack</p>
                    <p className="text-sm font-bold text-orange-400">{boss.attackPower}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-slate-400">Defense</p>
                    <p className="text-sm font-bold text-blue-400">{boss.defense}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-slate-400">Speed</p>
                    <p className="text-sm font-bold text-yellow-400">{boss.speed}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-slate-400 mb-1">Recommended</p>
                  <div className="flex justify-between text-xs">
                    <span className="text-primary">Level {boss.recommendedLevel}+</span>
                    <span className="text-primary">{boss.recommendedPlayers} players</span>
                  </div>
                </div>

                {boss.abilities?.length > 0 && (
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Abilities</p>
                    <div className="flex flex-wrap gap-1">
                      {boss.abilities.map((ability: string, i: number) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {ability}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => setSelectedBossId(boss.id)}
                >
                  Inspect Boss
                </Button>
                <Button
                  className="w-full"
                  onClick={() => challengeMutation.mutate(boss)}
                  data-testid={`button-challenge-boss-${boss.id}`}
                >
                  Challenge Boss
                </Button>
              </CardContent>
            </Card>
          ))}
          </div>

          <Card className="bg-slate-800 border-slate-700 h-fit">
            <CardHeader>
              <CardTitle className="text-white">Boss Strategy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {!selectedBoss ? (
                <p className="text-slate-400">Select a boss to view tactical strategy and target profile.</p>
              ) : (
                <>
                  <div className="font-semibold text-white">{selectedBoss.name}</div>
                  <Badge className={rarityColors[selectedBoss.rarity]}>{selectedBoss.rarity}</Badge>
                  <div className="rounded border border-slate-700 bg-slate-900/50 p-3 text-slate-300">
                    <div>Recommended Level: {selectedBoss.recommendedLevel}+</div>
                    <div>Recommended Squad: {selectedBoss.recommendedPlayers}</div>
                    <div>Core Stats: ATK {selectedBoss.attackPower} · DEF {selectedBoss.defense} · SPD {selectedBoss.speed}</div>
                  </div>
                  <div className="space-y-1 text-slate-300">
                    <div>Primary Risk: {selectedBoss.attackPower > selectedBoss.defense ? 'Burst Damage' : 'Tank Endurance'}</div>
                    <div>Suggested Counter: {selectedBoss.speed > 70 ? 'Control + Accuracy' : 'Sustained DPS'}</div>
                    <div>Battle Readiness Index: {Math.round((selectedBoss.attackPower + selectedBoss.defense + selectedBoss.speed) / 3)}</div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
