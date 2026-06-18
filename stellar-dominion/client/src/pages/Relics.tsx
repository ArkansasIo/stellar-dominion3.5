import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, Star } from "lucide-react";

const rarityColors: Record<string, string> = {
  common: "bg-slate-600",
  rare: "bg-blue-600",
  epic: "bg-purple-600",
  legendary: "bg-yellow-600",
  mythic: "bg-red-600",
};

export default function Relics() {
  const [selectedRarity, setSelectedRarity] = useState<string | null>(null);

  const { data: relics = [] } = useQuery({
    queryKey: ["relics"],
    queryFn: () => fetch("/api/relics").then(r => r.json()).catch(() => []),
  });

  const { data: inventory = [] } = useQuery({
    queryKey: ["relics-inventory"],
    queryFn: () => fetch("/api/relics/inventory").then(r => r.json()).catch(() => []),
  });

  const filtered = selectedRarity ? relics.filter((r: any) => r.rarity === selectedRarity) : relics;

  const equippedCount = inventory.filter((item: any) => item.isEquipped).length;
  const avgCondition =
    inventory.length > 0
      ? Math.round(
          inventory.reduce((sum: number, item: any) => sum + Number(item.condition || 0), 0) /
            inventory.length
        )
      : 0;
  const totalMarketValue = filtered.reduce((sum: number, relic: any) => sum + Number(relic.price || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 flex items-center gap-2">
          <Sparkles className="w-8 h-8 text-yellow-500" />
          Relics & Artifacts
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <div className="text-xs text-slate-400 uppercase">Collected</div>
              <div className="text-2xl font-bold text-white">{inventory.length}</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <div className="text-xs text-slate-400 uppercase">Equipped</div>
              <div className="text-2xl font-bold text-white">{equippedCount}</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <div className="text-xs text-slate-400 uppercase">Avg Condition</div>
              <div className="text-2xl font-bold text-white">{avgCondition}%</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <div className="text-xs text-slate-400 uppercase">Market Value</div>
              <div className="text-2xl font-bold text-white">{totalMarketValue}</div>
            </CardContent>
          </Card>
        </div>

        {/* Inventory Summary */}
        <Card className="bg-slate-800 border-slate-700 mb-6">
          <CardHeader>
            <CardTitle>Your Relics ({inventory.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-2">
              {inventory.map((item: any) => (
                <div
                  key={item.id}
                  className="p-2 bg-slate-700 rounded border border-slate-600"
                  data-testid={`relic-item-${item.relicId}`}
                >
                  <p className="text-xs text-slate-300 truncate">{item.name}</p>
                  <div className="flex justify-between items-center mt-1">
                    <Badge variant="outline" className="text-xs">
                      {item.condition}%
                    </Badge>
                    {item.isEquipped && <Star className="w-3 h-3 text-yellow-500" />}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Rarity Filter */}
        <div className="flex gap-2 mb-6">
          {["common", "rare", "epic", "legendary", "mythic"].map((rarity) => (
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

        {/* Relics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((relic: any) => (
            <Card key={relic.id} className="bg-slate-800 border-slate-700">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-white text-lg">{relic.name}</CardTitle>
                  <Badge className={rarityColors[relic.rarity]}>
                    {relic.rarity}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-slate-300">{relic.description}</p>
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-slate-400">Bonuses:</p>
                  {Object.entries(relic.bonuses).map(([key, value]: [string, any]) => (
                    <p key={key} className="text-xs text-primary">
                      +{(value as number).toFixed(1)}x {key}
                    </p>
                  ))}
                </div>
                <div className="rounded border border-slate-600 bg-slate-700/40 p-2 text-xs text-slate-300">
                  <div>Artifact Type: {relic.type}</div>
                  <div>Rarity Tier: {relic.rarity}</div>
                  <div>Maintenance: {(relic.maintenanceCost ?? 0)} / cycle</div>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-sm font-bold text-yellow-500">{relic.price} gold</span>
                  <span className="text-xs text-slate-400">{relic.type}</span>
                </div>
                <Button className="w-full" data-testid={`button-acquire-relic-${relic.id}`}>
                  Acquire
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
