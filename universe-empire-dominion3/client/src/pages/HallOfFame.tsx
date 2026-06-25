import React from "react";
import { useQuery } from "@tanstack/react-query";
import GameLayout from "@/components/layout/GameLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Medal, Crown, Award, Trophy, Star, Swords, Ship, Building2, Beaker, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface HoFEntry {
  rank: number;
  name: string;
  value: number;
  extra?: string;
}

interface HoFData {
  category: string;
  label: string;
  entries: HoFEntry[];
}

const CATEGORIES: Record<string, { label: string; icon: any; color: string }> = {
  topPlayers: { label: "Top Players", icon: Crown, color: "text-amber-500" },
  mostCombat: { label: "Most Combat", icon: Swords, color: "text-red-500" },
  richest: { label: "Richest", icon: Trophy, color: "text-yellow-500" },
  largestFleet: { label: "Largest Fleet", icon: Ship, color: "text-blue-500" },
  topResearchers: { label: "Top Researchers", icon: Beaker, color: "text-green-500" },
  mostMoons: { label: "Most Moons", icon: Star, color: "text-purple-500" },
  topBuilders: { label: "Top Builders", icon: Building2, color: "text-orange-500" },
  fastestRisers: { label: "Fastest Risers", icon: TrendingUp, color: "text-cyan-500" },
};

export default function HallOfFame() {
  const [category, setCategory] = React.useState("topPlayers");

  const { data, isLoading } = useQuery<HoFData>({
    queryKey: ["hall-of-fame", category],
    queryFn: async () => {
      const res = await fetch(`/api/hall-of-fame/${category}`);
      if (!res.ok) throw new Error("Failed to load");
      return res.json();
    },
  });

  return (
    <GameLayout>
      <div className="space-y-4 p-2">
        <div className="flex items-center gap-3">
          <Trophy className="w-8 h-8 text-amber-500" />
          <h1 className="text-2xl font-bold text-white">Hall of Fame</h1>
        </div>

        <Tabs value={category} onValueChange={setCategory}>
          <TabsList className="flex flex-wrap h-auto bg-slate-800/50 border border-slate-700/50 p-1 gap-1">
            {Object.entries(CATEGORIES).map(([key, cfg]) => {
              const Icon = cfg.icon;
              return (
                <TabsTrigger key={key} value={key}
                  className="data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-400 text-xs px-3 py-1.5">
                  <Icon className="w-3.5 h-3.5 mr-1.5" />
                  {cfg.label}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {Object.keys(CATEGORIES).map((cat) => (
            <TabsContent key={cat} value={cat}>
              <Card className="bg-slate-900/80 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-slate-100 text-lg flex items-center gap-2">
                    {React.createElement(CATEGORIES[cat].icon, { className: `w-5 h-5 ${CATEGORIES[cat].color}` })}
                    {CATEGORIES[cat].label}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <p className="text-slate-400 text-sm">Loading...</p>
                  ) : !data?.entries?.length ? (
                    <p className="text-slate-500 text-sm text-center py-8">No records yet</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-slate-700/50 text-left text-slate-400 text-xs uppercase tracking-wider">
                            <th className="py-2 pr-4 w-16">Rank</th>
                            <th className="py-2 pr-4">Player</th>
                            <th className="py-2 text-right">Score</th>
                            {data.entries[0]?.extra && <th className="py-2 text-right">Details</th>}
                          </tr>
                        </thead>
                        <tbody>
                          {data.entries.map((entry) => (
                            <tr key={`${cat}-${entry.rank}`}
                              className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                              <td className="py-2.5 pr-4">
                                <div className="flex items-center gap-2">
                                  {entry.rank === 1 && <Crown className="w-4 h-4 text-amber-400" />}
                                  {entry.rank === 2 && <Medal className="w-4 h-4 text-slate-400" />}
                                  {entry.rank === 3 && <Award className="w-4 h-4 text-orange-500" />}
                                  {entry.rank > 3 && <span className="font-mono text-slate-500 w-4 text-center">{entry.rank}</span>}
                                  <span className={cn("font-bold", entry.rank <= 3 ? "text-white" : "text-slate-300")}>
                                    #{entry.rank}
                                  </span>
                                </div>
                              </td>
                              <td className="py-2.5 pr-4 text-slate-200 font-medium">{entry.name}</td>
                              <td className="py-2.5 text-right font-mono text-slate-300">{entry.value.toLocaleString()}</td>
                              {entry.extra && <td className="py-2.5 text-right text-slate-500 text-xs">{entry.extra}</td>}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </GameLayout>
  );
}

