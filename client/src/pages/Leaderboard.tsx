import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Trophy, Crown, Medal, Award, Search, TrendingUp, TrendingDown, Users, Star, Shield, Zap, Globe, Minus, Filter } from "lucide-react";
import GameLayout from "@/components/layout/GameLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useGame } from "@/lib/gameContext";
import { cn } from "@/lib/utils";
import { BACKGROUND_ASSETS, SHIP_ASSETS, MENU_ASSETS, OGAMEX_FEATURED_ASSETS } from "@shared/config";

const TEMP_THEME_IMAGE = "/theme-temp.png";

type LeaderboardType =
  | "empireValue"
  | "fleetPower"
  | "researchProgress"
  | "resourceProduction"
  | "combatVictories"
  | "explorationDiscoveries"
  | "prestige"
  | "xp"
  | "alliancePower"
  | "commanderLevel";

type TimePeriod = "weekly" | "monthly" | "allTime";

interface LeaderboardEntry {
  position: number;
  userId: string;
  displayName: string;
  commanderTitle: string;
  score: number;
  rank: string;
  rankTitle: string;
  change: number;
  isOnline: boolean;
  alliance?: string;
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
  displayName: string;
  commanderTitle: string;
}

const LEADERBOARD_LABELS: Record<LeaderboardType, string> = {
  empireValue: "Empire Value",
  fleetPower: "Fleet Power",
  researchProgress: "Research Progress",
  resourceProduction: "Resource Production",
  combatVictories: "Combat Victories",
  explorationDiscoveries: "Exploration Discoveries",
  prestige: "Prestige",
  xp: "Experience",
  alliancePower: "Alliance Power",
  commanderLevel: "Commander Level",
};

const LEADERBOARD_ICONS: Record<LeaderboardType, React.ReactNode> = {
  empireValue: <Trophy className="w-4 h-4" />,
  fleetPower: <Shield className="w-4 h-4" />,
  researchProgress: <Star className="w-4 h-4" />,
  resourceProduction: <TrendingUp className="w-4 h-4" />,
  combatVictories: <Zap className="w-4 h-4" />,
  explorationDiscoveries: <Globe className="w-4 h-4" />,
  prestige: <Crown className="w-4 h-4" />,
  xp: <Award className="w-4 h-4" />,
  alliancePower: <Users className="w-4 h-4" />,
  commanderLevel: <Star className="w-4 h-4" />,
};

const LEADERBOARD_TYPES = Object.keys(LEADERBOARD_LABELS) as LeaderboardType[];

function formatScore(value: number) {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return Math.floor(value).toLocaleString();
}

function getRankEmoji(position: number): string {
  if (position === 1) return "🥇";
  if (position === 2) return "🥈";
  if (position === 3) return "🥉";
  return `#${position}`;
}

function getChangeIcon(change: number) {
  if (change > 0) return <TrendingUp className="w-3 h-3 text-green-500" />;
  if (change < 0) return <TrendingDown className="w-3 h-3 text-red-500" />;
  return <Minus className="w-3 h-3 text-slate-400" />;
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
  const [searchQuery, setSearchQuery] = useState("");
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("allTime");

  const leaderboardQuery = useQuery({
    queryKey: ["leaderboard", selectedType, timePeriod],
    queryFn: () => fetchJson<LeaderboardResponse>(`/api/leaderboard/${selectedType}?limit=100&period=${timePeriod}`),
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
  const leaderboard = leaderboardQuery.data?.leaderboard ?? [];

  const filteredLeaderboard = useMemo(() => {
    if (!searchQuery) return leaderboard;
    const q = searchQuery.toLowerCase();
    return leaderboard.filter((e) =>
      e.displayName.toLowerCase().includes(q) ||
      e.alliance?.toLowerCase().includes(q) ||
      e.rankTitle.toLowerCase().includes(q)
    );
  }, [leaderboard, searchQuery]);

  const categorySummary = useMemo(() => {
    if (!personalRanksQuery.data?.ranks) return [];
    const ranks = personalRanksQuery.data.ranks;
    return (Object.keys(ranks) as LeaderboardType[]).map((key) => ({
      type: key,
      rank: ranks[key].rank,
      percentile: ranks[key].percentile,
    })).sort((a, b) => a.rank - b.rank);
  }, [personalRanksQuery.data?.ranks]);

  return (
    <GameLayout>
      <div className="space-y-6">
        <section className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm bg-cover bg-center" style={{ backgroundImage: `linear-gradient(rgba(15,23,42,0.78), rgba(15,23,42,0.92)), url(${BACKGROUND_ASSETS.GALAXY_MAP.path})` }}>
          <div className="p-5 lg:p-6 text-white">
            <div>
              <h1 className="text-4xl font-bold flex items-center gap-3" data-testid="text-leaderboard-title">
                <img src={MENU_ASSETS.NAVIGATION.HOME.path} alt="Leaderboard" className="w-10 h-10 rounded-lg border border-white/10 bg-white/10 p-1.5 object-contain" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = TEMP_THEME_IMAGE; }} />
                Leaderboards
              </h1>
              <p className="text-slate-300 mt-2">Track rankings, commander titles, and top empire names across the galaxy.</p>
            </div>
            <div className="flex flex-wrap gap-3 mt-4">
              {[{ label: "Galaxy Map", image: MENU_ASSETS.NAVIGATION.EMPIRE.path }, { label: "Rankings", image: SHIP_ASSETS.CAPITALS.BATTLECRUISER.path }, { label: "Empire", image: OGAMEX_FEATURED_ASSETS.BACKGROUND.path }].map((item) => (
                <div key={item.label} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                  <img src={item.image} alt={item.label} className="w-10 h-10 rounded-lg border border-white/10 bg-black/10 p-1.5 object-contain" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = TEMP_THEME_IMAGE; }} />
                  <div className="text-sm font-semibold">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Card className="bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <div className="w-8 h-8 mb-2 rounded-full bg-amber-500/10 flex items-center justify-center overflow-hidden"><img src={MENU_ASSETS.NAVIGATION.EMPIRE.path} alt="Players" className="w-6 h-6 object-contain" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = TEMP_THEME_IMAGE; }} /></div>
                <p className="text-xs uppercase tracking-wider text-slate-500">Global Players</p>
                <p className="text-2xl font-bold text-slate-900">{leaderboardQuery.data?.totalPlayers ?? 0}</p>
              </div>
              <div>
                <div className="w-8 h-8 mb-2 rounded-full bg-indigo-500/10 flex items-center justify-center overflow-hidden"><img src={SHIP_ASSETS.FIGHTERS.INTERCEPTOR.path} alt="Rank" className="w-6 h-6 object-contain" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = TEMP_THEME_IMAGE; }} /></div>
                <p className="text-xs uppercase tracking-wider text-slate-500">Your Rank ({LEADERBOARD_LABELS[selectedType]})</p>
                <p className="text-2xl font-bold text-amber-700">
                  #{personalRanksQuery.data?.ranks?.[selectedType]?.rank ?? "-"}
                </p>
              </div>
              <div>
                <div className="w-8 h-8 mb-2 rounded-full bg-indigo-500/10 flex items-center justify-center overflow-hidden"><img src={MENU_ASSETS.BUILDINGS.DEFENSE_TURRET.path} alt="Title" className="w-6 h-6 object-contain" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = TEMP_THEME_IMAGE; }} /></div>
                <p className="text-xs uppercase tracking-wider text-slate-500">Your Title</p>
                <p className="text-2xl font-bold text-indigo-700">
                  {personalRanksQuery.data?.ranks?.[selectedType]?.rankTitle ?? "Commander"}
                </p>
              </div>
              <div>
                <div className="w-8 h-8 mb-2 rounded-full bg-emerald-500/10 flex items-center justify-center overflow-hidden"><img src={OGAMEX_FEATURED_ASSETS.BACKGROUND.path} alt="Percentile" className="w-6 h-6 object-contain" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = TEMP_THEME_IMAGE; }} /></div>
                <p className="text-xs uppercase tracking-wider text-slate-500">Percentile</p>
                <p className="text-2xl font-bold text-emerald-700">
                  {selectedRank ? `${selectedRank.percentile.toFixed(1)}%` : "-"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {categorySummary.slice(0, 3).map((cat) => (
            <Card key={cat.type} className="bg-white border-slate-200">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-500">{LEADERBOARD_LABELS[cat.type]}</div>
                  <div className="text-lg font-bold text-slate-900">#{cat.rank}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-500">Top</div>
                  <div className="text-lg font-bold text-emerald-700">{cat.percentile.toFixed(1)}%</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Ranking Type</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedType} onValueChange={(value) => setSelectedType(value as LeaderboardType)}>
              <TabsList className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 h-auto gap-1 bg-transparent p-0 flex-wrap">
                {LEADERBOARD_TYPES.map((type) => (
                  <TabsTrigger
                    key={type}
                    value={type}
                    className="data-[state=active]:bg-primary data-[state=active]:text-white border border-slate-200 text-[11px] px-2 py-1"
                  >
                    {LEADERBOARD_ICONS[type]}
                    <span className="ml-1 truncate">{LEADERBOARD_LABELS[type]}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search players, alliances, titles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white border-slate-200"
            />
          </div>
          <div className="flex gap-2">
            {(["allTime", "monthly", "weekly"] as TimePeriod[]).map((period) => (
              <Button
                key={period}
                variant={timePeriod === period ? "default" : "outline"}
                size="sm"
                onClick={() => setTimePeriod(period)}
                className="text-xs"
              >
                {period === "allTime" ? "All Time" : period === "monthly" ? "Monthly" : "Weekly"}
              </Button>
            ))}
            <Badge variant="secondary" className="text-xs">
              <Filter className="w-3 h-3 mr-1" /> {filteredLeaderboard.length} players
            </Badge>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">{LEADERBOARD_LABELS[selectedType]} Rankings</CardTitle>
          </CardHeader>
          <CardContent>
            {leaderboardQuery.isLoading ? (
              <p className="text-slate-500 text-center py-8">Loading leaderboard...</p>
            ) : leaderboardQuery.isError ? (
              <p className="text-red-600 text-center py-8">Failed to load leaderboard.</p>
            ) : filteredLeaderboard.length === 0 ? (
              <p className="text-slate-500 text-center py-8">No players found matching your search.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-left">
                      <th className="py-2 pr-2 w-12">#</th>
                      <th className="py-2 pr-4">Player</th>
                      <th className="py-2 pr-4 hidden md:table-cell">Title</th>
                      <th className="py-2 pr-4 hidden lg:table-cell">Class</th>
                      <th className="py-2 pr-4 hidden md:table-cell">Alliance</th>
                      <th className="py-2 pr-4">Change</th>
                      <th className="py-2 text-right">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLeaderboard.map((entry) => {
                      const isCurrentUser = entry.userId === personalRanksQuery.data?.userId || entry.displayName === username;

                      return (
                        <tr
                          key={`${entry.userId}-${entry.position}`}
                          className={cn("border-b border-slate-100 transition-colors", isCurrentUser ? "bg-primary/5 hover:bg-primary/10" : "hover:bg-slate-50")}
                          data-testid={`row-leaderboard-${entry.position}`}
                        >
                          <td className="py-3 pr-2 font-bold">
                            <div className="flex items-center gap-1">
                              {entry.position === 1 && <Crown className="w-4 h-4 text-amber-500" />}
                              {entry.position === 2 && <Medal className="w-4 h-4 text-slate-500" />}
                              {entry.position === 3 && <Award className="w-4 h-4 text-orange-600" />}
                              <span>{entry.position <= 3 ? "" : `#${entry.position}`}</span>
                            </div>
                          </td>
                          <td className="py-3 pr-4">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{entry.displayName}</span>
                              {entry.isOnline && <span className="w-2 h-2 rounded-full bg-green-500" title="Online" />}
                              {isCurrentUser && <Badge variant="outline" className="text-[10px] text-primary border-primary">You</Badge>}
                            </div>
                          </td>
                          <td className="py-3 pr-4 text-slate-600 hidden md:table-cell">{entry.commanderTitle}</td>
                          <td className="py-3 pr-4 hidden lg:table-cell">
                            <Badge variant="outline" className="text-[10px]">{entry.rankTitle}</Badge>
                          </td>
                          <td className="py-3 pr-4 text-slate-600 hidden md:table-cell">{entry.alliance || "-"}</td>
                          <td className="py-3 pr-4">
                            <div className="flex items-center gap-1">
                              {getChangeIcon(entry.change)}
                              <span className={cn(
                                "text-xs font-mono",
                                entry.change > 0 ? "text-green-600" : entry.change < 0 ? "text-red-600" : "text-slate-400"
                              )}>
                                {entry.change !== 0 ? Math.abs(entry.change) : "-"}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 font-mono font-bold text-right">{formatScore(entry.score)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topThree.map((entry) => (
            <Card key={entry.userId} className={cn(
              "border-2",
              entry.position === 1 ? "border-amber-300 bg-amber-50/30" :
              entry.position === 2 ? "border-slate-300 bg-slate-50/30" :
              "border-orange-300 bg-orange-50/30"
            )}>
              <CardContent className="p-4 text-center">
                <div className="text-3xl mb-2">{getRankEmoji(entry.position)}</div>
                <div className="font-bold text-slate-900 text-lg">{entry.displayName}</div>
                <div className="text-sm text-slate-600">{entry.rankTitle}</div>
                <div className="text-sm text-primary font-bold mt-1">{formatScore(entry.score)}</div>
                {entry.isOnline && (
                  <Badge className="mt-2 bg-green-100 text-green-700 border-green-200 text-[10px]">Online</Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {myEntry && (
          <Card className="border-primary/40 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-500" /> Your Current Position
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
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
                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-500">Change</p>
                  <p className={cn("text-xl font-bold", myEntry.change > 0 ? "text-green-600" : myEntry.change < 0 ? "text-red-600" : "text-slate-500")}>
                    {myEntry.change > 0 ? "+" : ""}{myEntry.change}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </GameLayout>
  );
}
