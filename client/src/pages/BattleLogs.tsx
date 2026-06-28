import { useMemo, useState } from "react";
import GameLayout from "@/components/layout/GameLayout";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Sword, Eye, AlertTriangle, Zap, TrendingUp, TrendingDown, Search, ChevronDown, ChevronUp, Skull, Shield, Crosshair, Box, Gem, Database, Star, Clock, Filter, Calendar, Target, Track, Ship, Trophy } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { BACKGROUND_ASSETS, SHIP_ASSETS, MENU_ASSETS, OGAMEX_FEATURED_ASSETS } from "@shared/config";

const TEMP_THEME_IMAGE = "/theme-temp.png";

interface BattleRound {
  round: number;
  attackerDamage: number;
  defenderDamage: number;
  attackerLosses: Record<string, number>;
  defenderLosses: Record<string, number>;
}

interface DebrisField {
  metal: number;
  crystal: number;
}

interface FleetComposition {
  ships: Record<string, number>;
  totalCount: number;
  totalPower: number;
}

interface BattleLogEntry {
  id: string;
  timestamp: string;
  opponent: string;
  result: "victory" | "defeat" | "draw";
  role: "attacker" | "defender";
  battleType: string;
  rounds: number;
  unitsCasualties: number;
  plunder: { metal: number; crystal: number; deuterium: number };
  coordinates?: string;
  attackerFleet?: FleetComposition;
  defenderFleet?: FleetComposition;
  roundsDetail?: BattleRound[];
  debris?: DebrisField;
  lootPercent?: number;
  combatScore?: number;
  xpGained?: number;
}

interface CombatStats {
  totalBattles: number;
  victories: number;
  defeats: number;
  draws: number;
  winRate: number;
  totalDamageDealt: number;
  totalDamageTaken: number;
  totalPlunder: number;
  totalLosses: number;
  totalEnemyKills: number;
  bestCombatScore: number;
  currentStreak: number;
  bestStreak: number;
}

type BattleHistoryResponse = {
  battles: BattleLogEntry[];
  stats: CombatStats;
};

const typeIcons: Record<string, React.ReactNode> = {
  raid: <Sword className="w-4 h-4" />,
  attack: <Zap className="w-4 h-4" />,
  spy: <Eye className="w-4 h-4" />,
  sabotage: <AlertTriangle className="w-4 h-4" />,
  defense: <Shield className="w-4 h-4" />,
  expedition: <Target className="w-4 h-4" />,
};

const typeLabels: Record<string, string> = {
  raid: "Raid",
  attack: "Attack",
  spy: "Espionage",
  sabotage: "Sabotage",
  defense: "Defense",
  expedition: "Expedition",
};

const typeColors: Record<string, string> = {
  raid: "bg-orange-50 border-orange-200 text-orange-700",
  attack: "bg-red-50 border-red-200 text-red-700",
  spy: "bg-purple-50 border-purple-200 text-purple-700",
  sabotage: "bg-rose-50 border-rose-200 text-rose-700",
  defense: "bg-blue-50 border-blue-200 text-blue-700",
  expedition: "bg-teal-50 border-teal-200 text-teal-700",
};

function getWinnerColor(result: BattleLogEntry["result"]) {
  if (result === "victory") return "bg-green-50 border-green-200";
  if (result === "defeat") return "bg-red-50 border-red-200";
  return "bg-slate-50 border-slate-200";
}

function getWinnerBadge(result: BattleLogEntry["result"]) {
  if (result === "victory") return <Badge className="bg-green-600">Victory</Badge>;
  if (result === "defeat") return <Badge className="bg-red-600">Defeat</Badge>;
  return <Badge className="bg-slate-500">Draw</Badge>;
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

function getStreakIcon(streak: number): string {
  if (streak >= 10) return "🔥";
  if (streak >= 5) return "⚡";
  if (streak >= 3) return "✅";
  return "●";
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, { credentials: "include" });
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(payload?.message || payload?.error || "Request failed");
  }
  return payload as T;
}

const SHIP_NAMES: Record<string, string> = {
  lightFighter: "Light Fighter",
  heavyFighter: "Heavy Fighter",
  interceptor: "Interceptor",
  battleship: "Battleship",
  battlecruiser: "Battlecruiser",
  destroyer: "Destroyer",
  cruiser: "Cruiser",
  bomber: "Bomber",
  smallCargo: "Small Cargo",
  largeCargo: "Large Cargo",
  colonyShip: "Colony Ship",
  recycler: "Recycler",
  espionageProbe: "Espionage Probe",
  mothership: "Mothership",
  deathstar: "Deathstar",
  solarSatellite: "Solar Satellite",
};

export default function BattleLogs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedBattle, setExpandedBattle] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<"all" | "7d" | "30d" | "90d">("all");

  const { data, isLoading } = useQuery<BattleHistoryResponse>({
    queryKey: ["combat-battle-history"],
    queryFn: () => fetchJson<BattleHistoryResponse>("/api/combat/battle-history"),
  });

  const battles = data?.battles || [];
  const stats: CombatStats = data?.stats || {
    totalBattles: 0, victories: 0, defeats: 0, draws: 0, winRate: 0,
    totalDamageDealt: 0, totalDamageTaken: 0, totalPlunder: 0,
    totalLosses: 0, totalEnemyKills: 0, bestCombatScore: 0,
    currentStreak: 0, bestStreak: 0,
  };

  const filteredBattles = useMemo(() => {
    const now = Date.now();
    const cutoffMap = {
      "7d": now - 7 * 24 * 60 * 60 * 1000,
      "30d": now - 30 * 24 * 60 * 60 * 1000,
      "90d": now - 90 * 24 * 60 * 60 * 1000,
      "all": 0,
    };
    const cutoff = cutoffMap[dateRange];

    return battles.filter((b) => {
      const matchesSearch = searchQuery === "" ||
        b.opponent.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.battleType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (b.coordinates || "").includes(searchQuery);
      const matchesDate = dateRange === "all" || new Date(b.timestamp).getTime() >= cutoff;
      return matchesSearch && matchesDate;
    });
  }, [battles, searchQuery, dateRange]);

  const averageCasualties = battles.length
    ? Math.round(battles.reduce((sum, b) => sum + b.unitsCasualties, 0) / battles.length)
    : 0;

  const totalPlunder = battles.reduce(
    (sum, b) => sum + (b.plunder?.metal || 0) + (b.plunder?.crystal || 0) + (b.plunder?.deuterium || 0), 0,
  );

  const recentBattles = battles.slice(0, 5);
  const pendingReview = battles.filter(b => b.result === "defeat").length;

  return (
    <GameLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="relative rounded-xl overflow-hidden shadow-lg mb-2" style={{ minHeight: 140 }}>
          <img src={BACKGROUND_ASSETS.COMBAT.path} alt="Battle Logs" className="absolute inset-0 w-full h-full object-cover" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = TEMP_THEME_IMAGE; }} />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/92 via-rose-950/60 to-transparent" />
          <div className="relative z-10 p-6 flex items-center gap-6">
            <img src={SHIP_ASSETS.CAPITALS.DESTROYER.path} alt="Destroyer" className="w-20 h-20 rounded-xl object-cover ring-2 ring-rose-400/60 shadow-lg" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = TEMP_THEME_IMAGE; }} />
            <div>
              <h2 className="text-3xl font-orbitron font-bold text-white drop-shadow">Battle Logs</h2>
              <p className="text-rose-300 font-rajdhani text-lg">Review your combat history and raid records.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-500/10 flex items-center justify-center overflow-hidden"><img src={SHIP_ASSETS.FIGHTERS.INTERCEPTOR.path} alt="Battles Logged" className="w-8 h-8 object-contain" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = TEMP_THEME_IMAGE; }} /></div>
                <div>
                  <div className="text-xs uppercase text-slate-500">Battles Logged</div>
                  <div className="text-2xl font-orbitron font-bold text-slate-900">{stats.totalBattles}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center overflow-hidden"><img src={OGAMEX_FEATURED_ASSETS.SHIPS.path} alt="Win Rate" className="w-8 h-8 object-contain" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = TEMP_THEME_IMAGE; }} /></div>
                <div>
                  <div className="text-xs uppercase text-emerald-600">Win Rate</div>
                  <div className="text-2xl font-orbitron font-bold text-emerald-800">{stats.winRate}%</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center overflow-hidden"><img src={SHIP_ASSETS.CAPITALS.DESTROYER.path} alt="Best Score" className="w-8 h-8 object-contain" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = TEMP_THEME_IMAGE; }} /></div>
                <div>
                  <div className="text-xs uppercase text-amber-600">Best Score</div>
                  <div className="text-2xl font-orbitron font-bold text-amber-800">{stats.bestCombatScore.toLocaleString()}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-rose-50 to-rose-100 border-rose-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center overflow-hidden"><img src={SHIP_ASSETS.CAPITALS.BATTLESHIP.path} alt="Streak" className="w-8 h-8 object-contain" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = TEMP_THEME_IMAGE; }} /></div>
                <div>
                  <div className="text-xs uppercase text-rose-600">Streak</div>
                  <div className="text-2xl font-orbitron font-bold text-rose-800">{getStreakIcon(stats.currentStreak)} {stats.currentStreak}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-white border-slate-200">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <div className="text-xs uppercase text-slate-500">Total Damage Dealt</div>
                <div className="text-xl font-bold text-red-700">{stats.totalDamageDealt.toLocaleString()}</div>
              </div>
              <Crosshair className="w-8 h-8 text-red-400" />
            </CardContent>
          </Card>
          <Card className="bg-white border-slate-200">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <div className="text-xs uppercase text-slate-500">Total Plunder</div>
                <div className="text-xl font-bold text-amber-700">{totalPlunder.toLocaleString()}</div>
              </div>
              <Box className="w-8 h-8 text-amber-400" />
            </CardContent>
          </Card>
          <Card className="bg-white border-slate-200">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <div className="text-xs uppercase text-slate-500">Enemy Ships Destroyed</div>
                <div className="text-xl font-bold text-indigo-700">{stats.totalEnemyKills.toLocaleString()}</div>
              </div>
              <Ship className="w-8 h-8 text-indigo-400" />
            </CardContent>
          </Card>
        </div>

        <Card className="bg-indigo-50 border-indigo-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-indigo-900">Combat Review Doctrine</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-indigo-900">
            <div className="rounded border border-indigo-200 bg-white/70 p-3">Review defeat logs first to identify recurring matchup weaknesses and formation gaps.</div>
            <div className="rounded border border-indigo-200 bg-white/70 p-3">Compare casualties against plunder values to optimize risk-adjusted raid targets.</div>
            <div className="rounded border border-indigo-200 bg-white/70 p-3">Segment espionage outcomes before launching heavy fleets to reduce blind engagements.</div>
          </CardContent>
        </Card>

        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search by opponent, type, or coordinates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white border-slate-200"
            />
          </div>
          <div className="flex gap-2">
            {(["all", "7d", "30d", "90d"] as const).map((range) => (
              <Button
                key={range}
                variant={dateRange === range ? "default" : "outline"}
                size="sm"
                onClick={() => setDateRange(range)}
                className="text-xs"
              >
                {range === "all" ? "All Time" : range}
              </Button>
            ))}
            <Badge variant="secondary" className="text-xs">
              <Filter className="w-3 h-3 mr-1" /> {filteredBattles.length} results
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="bg-white border border-slate-200 h-12 w-full justify-start">
            <TabsTrigger value="all" className="font-orbitron">All Battles</TabsTrigger>
            <TabsTrigger value="attacks" className="font-orbitron"><Sword className="w-4 h-4 mr-2" /> Attacks</TabsTrigger>
            <TabsTrigger value="raids" className="font-orbitron"><TrendingUp className="w-4 h-4 mr-2" /> Raids</TabsTrigger>
            <TabsTrigger value="defenses" className="font-orbitron"><TrendingDown className="w-4 h-4 mr-2" /> Defenses</TabsTrigger>
            <TabsTrigger value="espionage" className="font-orbitron"><Eye className="w-4 h-4 mr-2" /> Espionage</TabsTrigger>
            <TabsTrigger value="stats" className="font-orbitron"><Target className="w-4 h-4 mr-2" /> Analysis</TabsTrigger>
          </TabsList>

          {isLoading ? (
            <div className="text-center py-12 text-slate-500">Loading battle logs...</div>
          ) : filteredBattles.length === 0 ? (
            <TabsContent value="all" className="text-center py-12 text-slate-500">No battle logs match your filters.</TabsContent>
          ) : (
            <>
              <TabsContent value="all" className="space-y-4 mt-6">
                {filteredBattles.map((battle) => (
                  <BattleCard
                    key={battle.id}
                    battle={battle}
                    isExpanded={expandedBattle === battle.id}
                    onToggle={() => setExpandedBattle(expandedBattle === battle.id ? null : battle.id)}
                  />
                ))}
              </TabsContent>

              <TabsContent value="attacks" className="space-y-4 mt-6">
                {filteredBattles.filter(b => b.role === "attacker").length === 0 ? (
                  <div className="text-center py-12 text-slate-500">No attack records found.</div>
                ) : (
                  filteredBattles.filter(b => b.role === "attacker").map((battle) => (
                    <BattleCard key={battle.id} battle={battle} isExpanded={expandedBattle === battle.id} onToggle={() => setExpandedBattle(expandedBattle === battle.id ? null : battle.id)} />
                  ))
                )}
              </TabsContent>

              <TabsContent value="raids" className="space-y-4 mt-6">
                {filteredBattles.filter(b => b.battleType === "raid").length === 0 ? (
                  <div className="text-center py-12 text-slate-500">No raid records found.</div>
                ) : (
                  filteredBattles.filter(b => b.battleType === "raid").map((battle) => (
                    <BattleCard key={battle.id} battle={battle} isExpanded={expandedBattle === battle.id} onToggle={() => setExpandedBattle(expandedBattle === battle.id ? null : battle.id)} />
                  ))
                )}
              </TabsContent>

              <TabsContent value="defenses" className="space-y-4 mt-6">
                {filteredBattles.filter(b => b.role === "defender").length === 0 ? (
                  <div className="text-center py-12 text-slate-500">Your defense battles will appear here.</div>
                ) : (
                  filteredBattles.filter(b => b.role === "defender").map((battle) => (
                    <BattleCard key={battle.id} battle={battle} isExpanded={expandedBattle === battle.id} onToggle={() => setExpandedBattle(expandedBattle === battle.id ? null : battle.id)} />
                  ))
                )}
              </TabsContent>

              <TabsContent value="espionage" className="space-y-4 mt-6">
                {filteredBattles.filter(b => b.battleType === "spy").length === 0 ? (
                  <div className="text-center py-12 text-slate-500">No espionage records found.</div>
                ) : (
                  filteredBattles.filter(b => b.battleType === "spy").map((battle) => (
                    <BattleCard key={battle.id} battle={battle} isExpanded={expandedBattle === battle.id} onToggle={() => setExpandedBattle(expandedBattle === battle.id ? null : battle.id)} />
                  ))
                )}
              </TabsContent>

              <TabsContent value="stats" className="mt-6">
                <CombatAnalysisPanel stats={stats} battles={battles} />
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </GameLayout>
  );
}

function BattleCard({ battle, isExpanded, onToggle }: { battle: BattleLogEntry; isExpanded: boolean; onToggle: () => void }) {
  const totalPlunder = (battle.plunder?.metal || 0) + (battle.plunder?.crystal || 0) + (battle.plunder?.deuterium || 0);
  const attackerCount = battle.attackerFleet?.totalCount || 0;
  const defenderCount = battle.defenderFleet?.totalCount || 0;
  const attackerPower = battle.attackerFleet?.totalPower || 0;
  const defenderPower = battle.defenderFleet?.totalPower || 0;
  const powerRatio = defenderPower > 0 ? (attackerPower / defenderPower).toFixed(2) : "N/A";

  return (
    <Card className={cn("border cursor-pointer transition-all hover:shadow-md", getWinnerColor(battle.result))}>
      <CardContent className="p-6" onClick={onToggle}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={cn("p-2 rounded-lg", typeColors[battle.battleType] || "bg-slate-100")}>
              {typeIcons[battle.battleType] || typeIcons.attack}
            </div>
            <div>
              <div className="font-bold text-slate-900">
                You <span className="text-slate-400">vs</span> {battle.opponent}
              </div>
              <div className="text-xs text-slate-500 flex items-center gap-2">
                <Clock className="w-3 h-3" />
                {formatDistanceToNow(new Date(battle.timestamp), { addSuffix: true })}
                {battle.coordinates && <span className="text-slate-400">• [{battle.coordinates}]</span>}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getWinnerBadge(battle.result)}
            {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </div>
        </div>

        <div className="grid grid-cols-5 gap-4 text-sm">
          <div>
            <div className="text-xs text-slate-500 mb-1">Rounds</div>
            <div className="font-mono font-bold text-slate-900">{battle.rounds}</div>
          </div>
          <div>
            <div className="text-xs text-slate-500 mb-1">Role</div>
            <div className="font-mono font-bold text-blue-600 capitalize">{battle.role}</div>
          </div>
          <div>
            <div className="text-xs text-slate-500 mb-1">Casualties</div>
            <div className="font-mono font-bold text-red-600">{battle.unitsCasualties.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-xs text-slate-500 mb-1">Loot</div>
            <div className="font-mono font-bold text-amber-600">{totalPlunder.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-xs text-slate-500 mb-1">Type</div>
            <Badge variant="outline" className="capitalize">{typeLabels[battle.battleType] || battle.battleType}</Badge>
          </div>
        </div>

        {(attackerCount > 0 || defenderCount > 0) && (
          <div className="mt-4 grid grid-cols-3 gap-4 text-xs">
            <div className="rounded bg-white/60 border border-slate-200 p-2">
              <span className="text-slate-500">Your fleet: </span>
              <span className="font-bold text-slate-900">{attackerCount} ships ({attackerPower.toLocaleString()} power)</span>
            </div>
            <div className="rounded bg-white/60 border border-slate-200 p-2">
              <span className="text-slate-500">Enemy fleet: </span>
              <span className="font-bold text-slate-900">{defenderCount} ships ({defenderPower.toLocaleString()} power)</span>
            </div>
            <div className="rounded bg-white/60 border border-slate-200 p-2">
              <span className="text-slate-500">Power ratio: </span>
              <span className="font-bold text-slate-900">{powerRatio}</span>
            </div>
          </div>
        )}

        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-slate-200 space-y-4" onClick={(e) => e.stopPropagation()}>
            {battle.roundsDetail && battle.roundsDetail.length > 0 && (
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4" /> Round-by-Round Combat
                </h4>
                <div className="space-y-2">
                  {battle.roundsDetail.map((round) => {
                    const totalAttackerLosses = Object.values(round.attackerLosses).reduce((a, b) => a + b, 0);
                    const totalDefenderLosses = Object.values(round.defenderLosses).reduce((a, b) => a + b, 0);
                    const roundDominance = round.attackerDamage > round.defenderDamage ? "attacker" : round.defenderDamage > round.attackerDamage ? "defender" : "even";

                    return (
                      <div key={round.round} className={cn(
                        "rounded-lg border p-3 text-xs",
                        roundDominance === "attacker" ? "bg-green-50 border-green-200" :
                        roundDominance === "defender" ? "bg-red-50 border-red-200" : "bg-slate-50 border-slate-200"
                      )}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-slate-900">Round {round.round}</span>
                          <Badge variant="outline" className="text-[10px]">
                            {roundDominance === "attacker" ? "You dominant" : roundDominance === "defender" ? "Enemy dominant" : "Even"}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                          <div>
                            <span className="text-slate-500">Your dmg: </span>
                            <span className={cn("font-mono font-bold", round.attackerDamage >= round.defenderDamage ? "text-green-600" : "text-red-600")}>
                              {round.attackerDamage.toLocaleString()}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-500">Enemy dmg: </span>
                            <span className="font-mono font-bold text-slate-900">{round.defenderDamage.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-slate-500">Your losses: </span>
                            <span className="font-mono font-bold text-red-600">{totalAttackerLosses}</span>
                          </div>
                          <div>
                            <span className="text-slate-500">Enemy losses: </span>
                            <span className="font-mono font-bold text-red-600">{totalDefenderLosses}</span>
                          </div>
                        </div>
                        {totalAttackerLosses > 0 && (
                          <div className="mt-2 text-[10px] text-slate-500">
                            Lost: {Object.entries(round.attackerLosses).filter(([_, qty]) => qty > 0).map(([ship, qty]) => `${qty}x ${SHIP_NAMES[ship] || ship}`).join(", ") || "None"}
                          </div>
                        )}
                        {totalDefenderLosses > 0 && (
                          <div className="mt-1 text-[10px] text-slate-500">
                            Destroyed: {Object.entries(round.defenderLosses).filter(([_, qty]) => qty > 0).map(([ship, qty]) => `${qty}x ${SHIP_NAMES[ship] || ship}`).join(", ") || "None"}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {battle.attackerFleet && battle.attackerFleet.ships && Object.keys(battle.attackerFleet.ships).length > 0 && (
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <Ship className="w-4 h-4" /> Fleet Composition
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                  {Object.entries(battle.attackerFleet.ships).map(([shipId, count]) => (
                    <div key={shipId} className="rounded border border-slate-200 bg-white/60 p-2 flex justify-between">
                      <span className="text-slate-600">{SHIP_NAMES[shipId] || shipId}</span>
                      <span className="font-mono font-bold text-slate-900">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {battle.debris && (
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <h4 className="text-xs font-bold text-slate-600 mb-2 flex items-center gap-1">
                  <Box className="w-3 h-3" /> Debris Field
                </h4>
                <div className="flex gap-4 text-xs">
                  <span className="flex items-center gap-1"><Box className="w-3 h-3 text-slate-500" /> Metal: <strong className="text-slate-900">{battle.debris.metal.toLocaleString()}</strong></span>
                  <span className="flex items-center gap-1"><Gem className="w-3 h-3 text-blue-500" /> Crystal: <strong className="text-slate-900">{battle.debris.crystal.toLocaleString()}</strong></span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              {battle.xpGained !== undefined && (
                <div className="rounded border border-purple-200 bg-purple-50 p-2 text-center">
                  <Star className="w-3 h-3 text-purple-500 mx-auto mb-1" />
                  <span className="text-purple-700">{battle.xpGained} XP gained</span>
                </div>
              )}
              {battle.combatScore !== undefined && (
                <div className="rounded border border-amber-200 bg-amber-50 p-2 text-center">
                  <Trophy className="w-3 h-3 text-amber-500 mx-auto mb-1" />
                  <span className="text-amber-700">Score: {battle.combatScore}</span>
                </div>
              )}
              {battle.lootPercent !== undefined && (
                <div className="rounded border border-emerald-200 bg-emerald-50 p-2 text-center">
                  <TrendingUp className="w-3 h-3 text-emerald-500 mx-auto mb-1" />
                  <span className="text-emerald-700">{Math.round(battle.lootPercent * 100)}% loot efficiency</span>
                </div>
              )}
              {battle.rounds > 0 && (
                <div className="rounded border border-blue-200 bg-blue-50 p-2 text-center">
                  <Target className="w-3 h-3 text-blue-500 mx-auto mb-1" />
                  <span className="text-blue-700">{battle.rounds} rounds fought</span>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function CombatAnalysisPanel({ stats, battles }: { stats: CombatStats; battles: BattleLogEntry[] }) {
  const victoryTrend = useMemo(() => {
    const sorted = [...battles].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    const chunks: { label: string; wins: number; total: number }[] = [];
    const chunkSize = Math.max(1, Math.ceil(sorted.length / 10));

    for (let i = 0; i < sorted.length; i += chunkSize) {
      const chunk = sorted.slice(i, i + chunkSize);
      chunks.push({
        label: `Batch ${chunks.length + 1}`,
        wins: chunk.filter((b) => b.result === "victory").length,
        total: chunk.length,
      });
    }
    return chunks;
  }, [battles]);

  const battleTypeBreakdown = useMemo(() => {
    const breakdown: Record<string, number> = {};
    battles.forEach((b) => {
      breakdown[b.battleType] = (breakdown[b.battleType] || 0) + 1;
    });
    return Object.entries(breakdown).sort((a, b) => b[1] - a[1]);
  }, [battles]);

  return (
    <div className="space-y-6">
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Target className="w-4 h-4" /> Combat Performance Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs uppercase text-slate-500">Victories</div>
              <div className="text-2xl font-bold text-green-700">{stats.victories}</div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs uppercase text-slate-500">Defeats</div>
              <div className="text-2xl font-bold text-red-700">{stats.defeats}</div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs uppercase text-slate-500">Best Streak</div>
              <div className="text-2xl font-bold text-amber-700">{stats.bestStreak}</div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs uppercase text-slate-500">Avg. Damage/Battle</div>
              <div className="text-2xl font-bold text-indigo-700">{stats.totalBattles > 0 ? Math.round(stats.totalDamageDealt / stats.totalBattles).toLocaleString() : 0}</div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="font-medium text-slate-700">Overall Win Rate</span>
              <span className="font-bold text-slate-900">{stats.winRate}%</span>
            </div>
            <Progress value={stats.winRate} className="h-3" />
          </div>

          {victoryTrend.length > 1 && (
            <div>
              <h4 className="text-sm font-bold text-slate-900 mb-3">Victory Trend (Recent Battles)</h4>
              <div className="space-y-2">
                {victoryTrend.map((chunk, i) => (
                  <div key={i} className="flex items-center gap-3 text-xs">
                    <span className="w-20 text-slate-500">{chunk.label}</span>
                    <div className="flex-1 bg-slate-100 rounded-full h-4 overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full transition-all"
                        style={{ width: `${chunk.total > 0 ? (chunk.wins / chunk.total) * 100 : 0}%` }}
                      />
                    </div>
                    <span className="font-mono text-slate-700 w-16 text-right">{chunk.wins}/{chunk.total}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {battleTypeBreakdown.length > 0 && (
            <div>
              <h4 className="text-sm font-bold text-slate-900 mb-3">Battle Type Distribution</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {battleTypeBreakdown.map(([type, count]) => (
                  <div key={type} className={cn("rounded-lg border p-3 text-center", typeColors[type] || "bg-slate-50 border-slate-200")}>
                    <div className="font-bold text-lg">{count}</div>
                    <div className="text-xs capitalize">{typeLabels[type] || type}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-slate-700">
              <span className="font-semibold text-slate-900">Efficiency rating: </span>
              {stats.totalBattles > 0 && stats.totalLosses > 0
                ? `${(stats.totalEnemyKills / stats.totalLosses).toFixed(2)} kills per loss`
                : "No data yet"}
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-slate-700">
              <span className="font-semibold text-slate-900">Plunder efficiency: </span>
              {stats.totalBattles > 0
                ? `${(stats.totalPlunder / stats.totalBattles).toLocaleString()} avg per battle`
                : "No data yet"}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
