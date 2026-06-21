import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Trophy, Crown, Medal, Award } from "lucide-react";
import GameLayout from "@/components/layout/GameLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useGame } from "@/lib/gameContext";

type LeaderboardType =
  | "empireValue"
  | "fleetPower"
  | "researchProgress"
  | "resourceProduction"
  | "combatVictories"
  | "explorationDiscoveries";

interface LeaderboardEntry {
  position: number;
  userId: string;
  displayName: string;
  commanderTitle: string;
  score: number;
  rank: string;
  rankTitle: string;
}

interface LeaderboardResponse {
  leaderboard: LeaderboardEntry[];
  type: LeaderboardType;
  totalPlayers: number;
  count: number;
}

interface PersonalRank {
  rank: number;
  score: number;
  outOf: number;
  percentile: number;
  rankClass: string;
  rankTitle: string;
}

interface PersonalRanksResponse {
  userId: string;
  ranks: Record<LeaderboardType, PersonalRank>;
  overallRank: number;
}

const LEADERBOARD_LABELS: Record<LeaderboardType, string> = {
  empireValue: "Empire Value",
  fleetPower: "Fleet Power",
  researchProgress: "Research Progress",
  resourceProduction: "Resource Production",
  combatVictories: "Combat Victories",
  explorationDiscoveries: "Exploration Discoveries",
};

const LEADERBOARD_TYPES = Object.keys(LEADERBOARD_LABELS) as LeaderboardType[];

function formatScore(value: number) {
  return Math.floor(value).toLocaleString();
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed (${response.status})`);
  }

  return response.json() as Promise<T>;
}

export default function Leaderboard() {
  const { username } = useGame();
  const [selectedType, setSelectedType] = useState<LeaderboardType>("empireValue");

  const leaderboardQuery = useQuery({
    queryKey: ["leaderboard", selectedType],
    queryFn: () => fetchJson<LeaderboardResponse>(`/api/leaderboard/${selectedType}?limit=50`),
  });

  const personalRanksQuery = useQuery({
    queryKey: ["leaderboard-ranks-all"],
    queryFn: () => fetchJson<PersonalRanksResponse>("/api/leaderboard/ranks/all"),
  });

  const myEntry = useMemo(() => {
    const leaderboard = leaderboardQuery.data?.leaderboard ?? [];
    return leaderboard.find((entry) => entry.displayName === username || entry.userId === personalRanksQuery.data?.userId);
  }, [leaderboardQuery.data?.leaderboard, personalRanksQuery.data?.userId, username]);

  const selectedRank = personalRanksQuery.data?.ranks?.[selectedType];
  const topThree = (leaderboardQuery.data?.leaderboard ?? []).slice(0, 3);

  return (
    <GameLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 flex items-center gap-3" data-testid="text-leaderboard-title">
            <Trophy className="w-10 h-10 text-amber-500" />
            Leaderboards
          </h1>
          <p className="text-slate-600 mt-2">Track rankings, commander titles, and top empire names across the galaxy.</p>
        </div>

        <Card className="bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-500">Global Players</p>
                <p className="text-2xl font-bold text-slate-900">{leaderboardQuery.data?.totalPlayers ?? 0}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-500">Your Rank ({LEADERBOARD_LABELS[selectedType]})</p>
                <p className="text-2xl font-bold text-amber-700">
                  #{personalRanksQuery.data?.ranks?.[selectedType]?.rank ?? "-"}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-500">Your Title</p>
                <p className="text-2xl font-bold text-indigo-700">
                  {personalRanksQuery.data?.ranks?.[selectedType]?.rankTitle ?? "Commander"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <p className="text-xs uppercase tracking-wider text-slate-500">Percentile</p>
              <p className="text-2xl font-bold text-slate-900">
                {selectedRank ? `${selectedRank.percentile.toFixed(1)}%` : "-"}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-xs uppercase tracking-wider text-slate-500">Rank Class</p>
              <p className="text-2xl font-bold text-indigo-700">{selectedRank?.rankClass || "Unranked"}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-xs uppercase tracking-wider text-slate-500">Overall Rank</p>
              <p className="text-2xl font-bold text-amber-700">#{personalRanksQuery.data?.overallRank ?? "-"}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Ranking Type</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedType} onValueChange={(value) => setSelectedType(value as LeaderboardType)}>
              <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 h-auto gap-2 bg-transparent p-0">
                {LEADERBOARD_TYPES.map((type) => (
                  <TabsTrigger
                    key={type}
                    value={type}
                    className="data-[state=active]:bg-primary data-[state=active]:text-white border border-slate-200"
                  >
                    {LEADERBOARD_LABELS[type]}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{LEADERBOARD_LABELS[selectedType]} Rankings</CardTitle>
          </CardHeader>
          <CardContent>
            {leaderboardQuery.isLoading ? (
              <p className="text-slate-500">Loading leaderboard...</p>
            ) : leaderboardQuery.isError ? (
              <p className="text-red-600">Failed to load leaderboard.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-left">
                      <th className="py-2 pr-4">Rank</th>
                      <th className="py-2 pr-4">Name</th>
                      <th className="py-2 pr-4">Title</th>
                      <th className="py-2 pr-4">Class</th>
                      <th className="py-2">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(leaderboardQuery.data?.leaderboard ?? []).map((entry) => {
                      const isCurrentUser = entry.userId === personalRanksQuery.data?.userId || entry.displayName === username;

                      return (
                        <tr
                          key={`${entry.userId}-${entry.position}`}
                          className={`border-b border-slate-100 ${isCurrentUser ? "bg-primary/10" : ""}`}
                          data-testid={`row-leaderboard-${entry.position}`}
                        >
                          <td className="py-3 pr-4 font-semibold">
                            <div className="flex items-center gap-2">
                              {entry.position === 1 && <Crown className="w-4 h-4 text-amber-500" />}
                              {entry.position === 2 && <Medal className="w-4 h-4 text-slate-500" />}
                              {entry.position === 3 && <Award className="w-4 h-4 text-orange-600" />}
                              #{entry.position}
                            </div>
                          </td>
                          <td className="py-3 pr-4 font-medium">{entry.displayName}</td>
                          <td className="py-3 pr-4">{entry.commanderTitle}</td>
                          <td className="py-3 pr-4">
                            <Badge variant="outline">{entry.rankTitle}</Badge>
                          </td>
                          <td className="py-3 font-mono">{formatScore(entry.score)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Commanders Snapshot</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {topThree.map((entry) => (
              <div key={entry.userId} className="rounded border border-slate-200 bg-slate-50 p-3">
                <div className="text-xs text-slate-500">Rank #{entry.position}</div>
                <div className="font-semibold text-slate-900">{entry.displayName}</div>
                <div className="text-sm text-slate-600">{entry.rankTitle}</div>
                <div className="text-sm font-mono text-slate-900 mt-1">{formatScore(entry.score)}</div>
              </div>
            ))}
          </CardContent>
        </Card>

        {myEntry && (
          <Card className="border-primary/40">
            <CardHeader>
              <CardTitle>Your Current Position</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-500">Rank</p>
                  <p className="text-xl font-bold text-primary">#{myEntry.position}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-500">Name</p>
                  <p className="text-xl font-bold text-slate-900">{myEntry.displayName}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-500">Title</p>
                  <p className="text-xl font-bold text-slate-900">{myEntry.commanderTitle}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-500">Score</p>
                  <p className="text-xl font-bold text-slate-900">{formatScore(myEntry.score)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </GameLayout>
  );
}
