import GameLayout from "@/components/layout/GameLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { BarChart3, TrendingUp, RefreshCw } from "lucide-react";

interface PowerLevelData {
  id: string;
  totalPower: number;
  raidPower: number;
  combatPower: number;
  empirePower: number;
  itemPower: number;
  commanderPower: number;
  fleetPower: number;
  researchPower: number;
  buildingPower: number;
  raidCareerPower: number;
  powerTier: string;
  lastCalculatedAt: string | null;
}

interface PowerSource {
  id: string;
  name: string;
  description: string;
  icon: string;
  baseValue: number;
  multiplier: number;
  maxLevel: number;
}

const TIER_COLORS: Record<string, string> = {
  Novice: "text-gray-600",
  Common: "text-gray-400",
  Uncommon: "text-green-500",
  Rare: "text-blue-500",
  Epic: "text-purple-500",
  Legendary: "text-yellow-500",
};

export default function PowerLevelPage() {
  const { toast } = useToast();

  const { data: powerData, isLoading, refetch } = useQuery<{ success: boolean; powerLevel: PowerLevelData; tierColor: string }>({
    queryKey: ["/api/power-level"],
    queryFn: async () => {
      const res = await fetch("/api/power-level", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load power level");
      return res.json();
    },
  });

  const { data: configData } = useQuery<{ success: boolean; sources: PowerSource[] }>({
    queryKey: ["/api/power-level/config"],
    queryFn: async () => {
      const res = await fetch("/api/power-level/config", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load config");
      return res.json();
    },
  });

  const level = powerData?.powerLevel;
  const sources = configData?.sources || [];

  const breakdown = level ? [
    { name: "Commander", value: level.commanderPower, icon: "👤", max: 15000 },
    { name: "Fleet", value: level.fleetPower, icon: "🚀", max: 50000 },
    { name: "Research", value: level.researchPower, icon: "🔬", max: 20000 },
    { name: "Buildings", value: level.buildingPower, icon: "🏗️", max: 10000 },
    { name: "Empire", value: level.empirePower, icon: "👑", max: 15000 },
    { name: "Items", value: level.itemPower, icon: "⚔️", max: 20000 },
    { name: "Raid Career", value: level.raidCareerPower, icon: "🎯", max: 20000 },
  ] : [];

  const maxBreakdown = breakdown.length > 0 ? Math.max(...breakdown.map((b) => b.value), 1) : 1;

  return (
    <GameLayout title="Power Level" subtitle="View and track your overall power rating">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm">Your Power Level</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-1 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {level && (
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5" />
            <CardContent className="relative pt-6">
              <div className="flex flex-col items-center text-center">
                <BarChart3 className="w-12 h-12 text-blue-500 mb-3" />
                <div className="text-5xl font-bold font-orbitron text-white mb-1">
                  {level.totalPower.toLocaleString()}
                </div>
                <Badge className={`text-lg px-4 py-1 ${TIER_COLORS[level.powerTier] || "text-gray-400"}`}>
                  {level.powerTier}
                </Badge>
                <p className="text-slate-500 text-xs mt-2">
                  {level.lastCalculatedAt ? `Last updated: ${new Date(level.lastCalculatedAt).toLocaleString()}` : "Not yet calculated"}
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
                <div className="text-center p-3 rounded-lg bg-slate-800/50">
                  <div className="text-xs text-slate-400">Raid Power</div>
                  <div className="text-lg font-bold text-white">{level.raidPower.toLocaleString()}</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-slate-800/50">
                  <div className="text-xs text-slate-400">Combat Power</div>
                  <div className="text-lg font-bold text-white">{level.combatPower.toLocaleString()}</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-slate-800/50">
                  <div className="text-xs text-slate-400">Empire Power</div>
                  <div className="text-lg font-bold text-white">{level.empirePower.toLocaleString()}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Power Breakdown
            </CardTitle>
            <CardDescription>Contribution from each power source</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {breakdown.map((item) => (
              <div key={item.name} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-slate-300">
                    <span>{item.icon}</span>
                    {item.name}
                  </span>
                  <span className="text-white font-mono">{item.value.toLocaleString()}</span>
                </div>
                <Progress value={Math.min(100, (item.value / maxBreakdown) * 100)} className="h-1.5" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Power Sources</CardTitle>
            <CardDescription>How each source contributes to your power</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {sources.map((source) => (
                <div key={source.id} className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">{source.icon}</span>
                    <span className="text-sm text-white font-medium">{source.name}</span>
                  </div>
                  <p className="text-xs text-slate-400">{source.description}</p>
                  <div className="flex justify-between text-xs text-slate-500 mt-2">
                    <span>Base: {source.baseValue}</span>
                    <span>×{source.multiplier}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </GameLayout>
  );
}
