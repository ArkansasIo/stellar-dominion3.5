import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sword, Shield, Zap } from "lucide-react";

const rarityColors: Record<string, string> = {
  common: "bg-slate-600",
  rare: "bg-blue-600",
  epic: "bg-purple-600",
  legendary: "bg-yellow-600",
  mythic: "bg-red-600",
  transcendent: "bg-pink-600",
};

export default function RaidBosses() {
  const [selectedRarity, setSelectedRarity] = useState<string | null>(null);

  const { data: bosses = [] } = useQuery({
    queryKey: ["bosses"],
    queryFn: () => fetch("/api/bosses").then(r => r.json()).catch(() => []),
  });

  const filtered = selectedRarity ? bosses.filter((b: any) => b.rarity === selectedRarity) : bosses;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 flex items-center gap-2">
          <Sword className="w-8 h-8 text-red-500" />
          Raid Bosses (90 Types)
        </h1>

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((boss: any) => (
            <Card key={boss.id} className="bg-slate-800 border-slate-700">
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

                <Button className="w-full" onClick={() => alert("Challenging " + boss.name + "!")} data-testid={`button-challenge-boss-${boss.id}`}>
                  Challenge Boss
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
