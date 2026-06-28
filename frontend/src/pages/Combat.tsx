import GameLayout from "@/components/layout/GameLayout";
import { useGame } from "@/lib/gameContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Sword, Eye, Flame, Zap, Shield, Users, Trophy, AlertCircle, Check, X, Zap as ZapIcon
} from "lucide-react";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";

export default function Combat() {
  const { units, resources, research, buildings } = useGame();
  const [targetId, setTargetId] = useState("");
  const [combatType, setCombatType] = useState<"raid" | "attack" | "spy" | "sabotage">("attack");
  const [selectedUnits, setSelectedUnits] = useState<{ [key: string]: number }>({});
  const [battleResult, setBattleResult] = useState<any>(null);

  // Fetch combat stats
  const { data: combatStats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/combat/stats"],
    queryFn: async () => {
      const res = await fetch("/api/combat/stats", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch combat stats");
      return res.json();
    },
    refetchInterval: 30000,
  });

  // Fetch battle history
  const { data: battleHistory } = useQuery({
    queryKey: ["/api/combat/battle-history"],
    queryFn: async () => {
      const res = await fetch("/api/combat/battle-history", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch battle history");
      return res.json();
    },
    refetchInterval: 60000,
  });

  // Attack mutation
  const attackMutation = useMutation({
    mutationFn: async () => {
      const hasUnits = Object.values(selectedUnits).some((count) => count > 0);
      if (!hasUnits) throw new Error("Select at least 1 unit");
      if (!targetId.trim()) throw new Error("Enter a target player ID");

      const res = await fetch("/api/combat/attack", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ targetId, units: selectedUnits }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Attack failed");
      }
      return res.json();
    },
    onSuccess: (data) => {
      setBattleResult(data);
      setSelectedUnits({});
    },
    onError: (error: any) => {
      alert(`Attack failed: ${error.message}`);
    },
  });

  const unitTypes = Object.keys(units || {});
  const totalSelected = Object.values(selectedUnits).reduce((a, b) => a + b, 0);
  const weaponBonus = ((research as any)?.weaponsTech || 0) * 5;
  const defenseBonus = ((research as any)?.shieldingTech || 0) * 5;

  return (
    <GameLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
          <h2 className="text-3xl font-orbitron font-bold text-slate-900">Fleet Combat</h2>
          <p className="text-muted-foreground font-rajdhani text-lg">
            Engage in tactical battles, defend your empire, and plunder resources.
          </p>
        </div>

        {/* Combat Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                  <Sword className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <div className="text-xs text-red-600 uppercase">Attack Power</div>
                  <div className="text-xl font-orbitron font-bold text-red-900">
                    +{weaponBonus}%
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-xs text-blue-600 uppercase">Defense Bonus</div>
                  <div className="text-xl font-orbitron font-bold text-blue-900">
                    +{defenseBonus}%
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="text-xs text-green-600 uppercase">Total Fleet</div>
                  <div className="text-xl font-orbitron font-bold text-green-900">
                    {Object.values(units || {}).reduce((a, b) => a + (b as number), 0).toLocaleString()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <div className="text-xs text-purple-600 uppercase">Victories</div>
                  <div className="text-xl font-orbitron font-bold text-purple-900">
                    {battleHistory?.totalVictories || 0}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Battle Result */}
        {battleResult && (
          <Card className={battleResult.winner === "attacker" ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {battleResult.winner === "attacker" ? (
                  <>
                    <Check className="w-5 h-5 text-green-600" />
                    <span className="text-green-900">Victory!</span>
                  </>
                ) : (
                  <>
                    <X className="w-5 h-5 text-red-600" />
                    <span className="text-red-900">Defeat!</span>
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-slate-600">Rounds</div>
                  <div className="font-bold text-lg">{battleResult.battleResult?.rounds || 0}</div>
                </div>
                <div>
                  <div className="text-slate-600">Plunder</div>
                  <div className="font-mono">
                    M:{battleResult.plunder?.metal || 0} C:{battleResult.plunder?.crystal || 0}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Combat Interface */}
        <Tabs defaultValue="attack" className="w-full">
          <TabsList className="bg-white border border-slate-200 h-12 w-full justify-start">
            <TabsTrigger value="attack" className="font-orbitron">
              <Sword className="w-4 h-4 mr-2" /> Attack
            </TabsTrigger>
            <TabsTrigger value="defend" className="font-orbitron">
              <Shield className="w-4 h-4 mr-2" /> Defend
            </TabsTrigger>
            <TabsTrigger value="history" className="font-orbitron">
              <Trophy className="w-4 h-4 mr-2" /> History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="attack" className="mt-6 space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sword className="w-5 h-5" /> Fleet Selection
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-bold text-slate-900 block mb-2">Target Player ID</label>
                    <Input
                      placeholder="Enter target player ID"
                      value={targetId}
                      onChange={(e) => setTargetId(e.target.value)}
                      className="font-mono"
                    />
                  </div>

                  <div className="bg-slate-50 p-4 rounded border border-slate-200">
                    <div className="text-sm font-bold text-slate-900 mb-3">Select Units</div>
                    <div className="space-y-3">
                      {unitTypes.map((unitType) => {
                        const owned = (units as any)?.[unitType] || 0;
                        const selected = selectedUnits[unitType] || 0;

                        return (
                          <div key={unitType} className="flex items-center justify-between">
                            <span className="text-sm capitalize">{unitType}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                                {owned} available
                              </span>
                              <input
                                type="range"
                                min="0"
                                max={owned}
                                value={selected}
                                onChange={(e) => {
                                  setSelectedUnits((prev) => ({
                                    ...prev,
                                    [unitType]: parseInt(e.target.value),
                                  }));
                                }}
                                className="w-32 h-2 bg-slate-200 rounded cursor-pointer"
                              />
                              <span className="font-mono text-sm bg-white px-2 py-1 rounded border border-slate-200 w-12 text-right">
                                {selected}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <Button
                    onClick={() => attackMutation.mutate()}
                    disabled={attackMutation.isPending}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-orbitron"
                  >
                    {attackMutation.isPending ? "Battle In Progress..." : `Launch Attack (${totalSelected} units)`}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Attack Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="bg-blue-50 p-3 rounded border border-blue-200 flex gap-2">
                    <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-xs text-blue-900">
                      Defeated units are permanently lost. Victory grants 30% of defender's resources.
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-500 mb-1">Selected Units</div>
                    <div className="font-bold text-lg">{totalSelected}</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="defend" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" /> Defense Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="text-sm mb-2">
                    <strong>Current Defense Bonus:</strong> +{defenseBonus}% from shields research
                  </div>
                  <div className="text-xs text-slate-700">
                    Defending is passive - your garrison automatically defends when attacked.
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            {battleHistory?.battles && battleHistory.battles.length > 0 ? (
              <div className="space-y-3">
                {battleHistory.battles.map((battle: any) => (
                  <Card key={battle.id} className={battle.result === "victory" ? "bg-green-50" : "bg-red-50"}>
                    <CardContent className="p-4 flex justify-between items-center">
                      <div>
                        <div className="font-semibold text-slate-900">{battle.opponent}</div>
                        <div className="text-xs text-slate-500">{new Date(battle.timestamp).toLocaleDateString()}</div>
                      </div>
                      <div className="text-right">
                        <Badge variant={battle.result === "victory" ? "default" : "destructive"}>
                          {battle.result.toUpperCase()}
                        </Badge>
                        <div className="text-xs text-slate-600 mt-1">-{battle.unitsCasualties} units</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center text-slate-500">
                  No battles yet. Launch your first attack!
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </GameLayout>
  );
}
