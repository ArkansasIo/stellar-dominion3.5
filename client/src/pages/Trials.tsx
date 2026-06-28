import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import GameLayout from "@/components/layout/GameLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { BACKGROUND_ASSETS, SHIP_ASSETS, MENU_ASSETS, OGAMEX_FEATURED_ASSETS } from "@shared/config";
import { Swords, Trophy, Timer, Star, Zap, Users, Shield, Crown, ChevronRight } from "lucide-react";

const TEMP_THEME_IMAGE = "/theme-temp.png";

interface TrialWave {
  waveNumber: number;
  name: string;
  description: string;
  enemyCount: number;
  enemyPower: number;
  difficulty: string;
  rewards: { type: string; amount: number; chance: number }[];
}

interface TrialTier {
  tier: number;
  name: string;
  description: string;
  icon: string;
  color: string;
  powerRequirement: number;
  entryCost: number;
  waves: TrialWave[];
  rewards: { type: string; amount: number; chance: number }[];
  firstClearRewards: { type: string; amount: number }[];
  timeBonus: { underMinutes: number; bonusMultiplier: number }[];
}

interface ActiveTrial {
  id: string;
  tier: number;
  startTime: string;
  completedWaves: number;
  totalWaves: number;
  totalPoints: number;
  flawless: boolean;
}

interface TrialResult {
  wavesCompleted: number;
  totalPoints: number;
  rewards: { type: string; amount: number }[];
  flawless: boolean;
  timeBonus: { earned: boolean; seconds: number; bonus: number };
}

interface LeaderboardEntry {
  rank: number;
  userId: string;
  bestTime: number | null;
  bestWave: number;
  points: number;
}

interface PlayerRecord {
  trialTier: number;
  bestWave: number;
  bestTime: number | null;
  totalPointsEarned: number;
}

export default function Trials() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedTier, setSelectedTier] = useState<number>(1);
  const [activeTrial, setActiveTrial] = useState<ActiveTrial | null>(null);
  const [trialResult, setTrialResult] = useState<TrialResult | null>(null);
  const [currentWaveResult, setCurrentWaveResult] = useState<any>(null);
  const [leaderboardTier, setLeaderboardTier] = useState<number>(1);

  const configQuery = useQuery<{ tiers: TrialTier[] }>({
    queryKey: ["trials-config"],
    queryFn: async () => {
      const res = await fetch("/api/trials/config", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load trial config");
      return res.json();
    },
  });

  const trialsQuery = useQuery<{ trials: PlayerRecord[] }>({
    queryKey: ["trials"],
    queryFn: async () => {
      const res = await fetch("/api/trials", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load trials");
      return res.json();
    },
  });

  const leaderboardQuery = useQuery<{ leaderboard: LeaderboardEntry[] }>({
    queryKey: ["trials-leaderboard", leaderboardTier],
    queryFn: async () => {
      const res = await fetch(`/api/trials/leaderboard/${leaderboardTier}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load leaderboard");
      return res.json();
    },
    enabled: true,
  });

  const startTrialMutation = useMutation({
    mutationFn: async (tier: number) => {
      const res = await fetch(`/api/trials/${tier}/start`, { method: "POST", credentials: "include" });
      if (!res.ok) { const body = await res.json().catch(() => ({})); throw new Error(body.error || "Failed to start trial"); }
      return res.json();
    },
    onSuccess: (data) => {
      const attempt = data.attempt;
      setActiveTrial({
        id: attempt.id,
        tier: attempt.trialTier,
        startTime: attempt.createdAt,
        completedWaves: attempt.wavesCompleted || 0,
        totalWaves: attempt.totalWaves || data.totalWaves,
        totalPoints: attempt.pointsEarned || 0,
        flawless: attempt.flawless || false,
      });
      setTrialResult(null);
      setCurrentWaveResult(null);
      toast({ title: "Trial started!", description: `Tier ${attempt.trialTier} trial begun.` });
    },
    onError: (err: Error) => toast({ title: "Failed to start trial", description: err.message, variant: "destructive" }),
  });

  const resolveWaveMutation = useMutation({
    mutationFn: async () => {
      if (!activeTrial) throw new Error("No active trial");
      const powerQuery = await fetch("/api/power-level", { credentials: "include" });
      const powerData = await powerQuery.json();
      const playerPower = powerData.powerLevel || 0;
      const res = await fetch(`/api/trials/${activeTrial.tier}/resolve-wave`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ attemptId: activeTrial.id, playerPower }),
      });
      if (!res.ok) { const body = await res.json().catch(() => ({})); throw new Error(body.error || "Failed to resolve wave"); }
      return res.json();
    },
    onSuccess: (data) => {
      setCurrentWaveResult(data);
      if (data.completed) {
        setTrialResult({
          wavesCompleted: data.wavesCleared || 0,
          totalPoints: (activeTrial?.totalPoints || 0) + 0,
          rewards: data.rewards || [],
          flawless: data.flawless || false,
          timeBonus: { earned: false, seconds: 0, bonus: 0 },
        });
      }
      toast({ title: "Wave resolved", description: data.waveCompleted ? "Wave completed!" : "Wave failed." });
      queryClient.invalidateQueries({ queryKey: ["trials"] });
    },
    onError: (err: Error) => toast({ title: "Wave failed", description: err.message, variant: "destructive" }),
  });

  const completeTrialMutation = useMutation({
    mutationFn: async () => {
      if (!activeTrial) throw new Error("No active trial");
      const res = await fetch(`/api/trials/${activeTrial.tier}/complete`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ attemptId: activeTrial.id }),
      });
      if (!res.ok) { const body = await res.json().catch(() => ({})); throw new Error(body.error || "Failed to complete trial"); }
      return res.json();
    },
    onSuccess: (data) => {
      setTrialResult(data.result);
      setActiveTrial(null);
      setCurrentWaveResult(null);
      queryClient.invalidateQueries({ queryKey: ["trials"] });
      toast({ title: "Trial complete!", description: `Completed ${data.result.wavesCompleted} waves.` });
    },
    onError: (err: Error) => toast({ title: "Failed to complete trial", description: err.message, variant: "destructive" }),
  });

  const tiers = configQuery.data?.tiers || [];
  const playerRecords = trialsQuery.data?.trials || [];
  const playerRecordMap = new Map(playerRecords.map((r: PlayerRecord) => [r.trialTier, r]));
  const leaderboard = leaderboardQuery.data?.leaderboard || [];
  const selectedTierConfig = tiers.find((t: TrialTier) => t.tier === selectedTier);

  const getDifficultyColor = (difficulty: string) => {
    const map: Record<string, string> = { easy: "text-green-600 bg-green-50", medium: "text-yellow-600 bg-yellow-50", hard: "text-orange-600 bg-orange-50", extreme: "text-red-600 bg-red-50", nightmare: "text-purple-600 bg-purple-50" };
    return map[difficulty] || "text-slate-600 bg-slate-50";
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <GameLayout>
      <div className="space-y-6 animate-in fade-in duration-500">
        <section className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm bg-cover bg-center" style={{ backgroundImage: `linear-gradient(rgba(15,23,42,0.78), rgba(15,23,42,0.92)), url(${BACKGROUND_ASSETS.GALAXY_MAP.path})` }}>
          <div className="p-5 lg:p-6 space-y-4 text-white">
            <div className="flex items-center gap-2">
              <img src={MENU_ASSETS.NAVIGATION.MILITARY.path} alt="Icon" className="w-8 h-8 rounded-lg border border-white/10 bg-white/10 p-1.5 object-contain" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = TEMP_THEME_IMAGE; }} />
              <h1 className="text-2xl font-bold">Trials</h1>
            </div>
            <p className="text-sm leading-6 text-slate-300">Wave-based combat challenges. Prove your strength and climb the leaderboards.</p>
            <div className="flex flex-wrap gap-3">
              {[{ label: "Combat Trials", image: MENU_ASSETS.NAVIGATION.MILITARY.path }, { label: "Leaderboards", image: SHIP_ASSETS.CAPITALS.BATTLESHIP.path }, { label: "Rewards", image: OGAMEX_FEATURED_ASSETS.RESEARCH.path }].map((item) => (
                <div key={item.label} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                  <img src={item.image} alt={item.label} className="w-10 h-10 rounded-lg border border-white/10 bg-black/10 p-1.5 object-contain" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = TEMP_THEME_IMAGE; }} />
                  <div className="text-sm font-semibold">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Tabs defaultValue="lobby" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white border border-slate-200 h-16">
            <TabsTrigger value="lobby" className="font-orbitron flex flex-col items-center justify-center h-full gap-1">
              <Swords className="w-4 h-4" /> Lobby
            </TabsTrigger>
            <TabsTrigger value="active" className="font-orbitron flex flex-col items-center justify-center h-full gap-1">
              <Zap className="w-4 h-4" /> Active Trial
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="font-orbitron flex flex-col items-center justify-center h-full gap-1">
              <Trophy className="w-4 h-4" /> Leaderboard
            </TabsTrigger>
          </TabsList>

          {/* LOBBY TAB */}
          <TabsContent value="lobby" className="mt-6 space-y-4">
            <Card className="bg-white border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Swords className="w-5 h-5 text-red-600" /> Trial Tiers
                </CardTitle>
                <CardDescription>Select a trial tier to begin your challenge. Higher tiers offer greater rewards.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tiers.length === 0 && (
                    <div className="col-span-full text-center py-8 text-slate-500">No trial tiers available.</div>
                  )}
                  {tiers.map((tier: TrialTier) => {
                    const record = playerRecordMap.get(tier.tier);
                    return (
                      <Card key={tier.tier} className={`border-slate-200 transition-all ${selectedTier === tier.tier ? "ring-2 ring-primary" : ""}`}>
                        <CardContent className="p-4 space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="font-orbitron font-bold text-slate-900">{tier.name}</div>
                              <div className="text-xs text-slate-500">Tier {tier.tier}</div>
                            </div>
                            <Badge variant="outline" className="text-lg">{tier.icon}</Badge>
                          </div>
                          <p className="text-xs text-slate-600 line-clamp-2">{tier.description}</p>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="flex items-center gap-1"><Zap className="w-3 h-3 text-amber-500" /> Power: <span className="font-bold">{tier.powerRequirement.toLocaleString()}</span></div>
                            <div className="flex items-center gap-1"><Swords className="w-3 h-3 text-red-500" /> Waves: <span className="font-bold">{tier.waves.length}</span></div>
                          </div>
                          {record && (
                            <div className="rounded-lg bg-blue-50 border border-blue-200 p-2 text-xs">
                              <div className="font-bold text-blue-800 mb-1">Your Best</div>
                              <div className="flex justify-between text-blue-700">
                                <span>Waves: {record.bestWave}/{tier.waves.length}</span>
                                <span>Points: {record.totalPointsEarned.toLocaleString()}</span>
                              </div>
                              {(record.bestTime ?? 0) > 0 && <div className="text-blue-700">Time: {formatTime(record.bestTime ?? 0)}</div>}
                            </div>
                          )}
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="flex-1 bg-red-600 hover:bg-red-700"
                              onClick={() => {
                                setSelectedTier(tier.tier);
                                startTrialMutation.mutate(tier.tier);
                              }}
                              disabled={startTrialMutation.isPending}
                            >
                              <Swords className="w-3 h-3 mr-1" /> Start Trial
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {selectedTierConfig && (
                  <div className="mt-6 border-t border-slate-200 pt-4">
                    <h3 className="font-bold text-slate-900 mb-3">Tier {selectedTierConfig.tier} Wave Preview</h3>
                    <div className="space-y-2">
                      {selectedTierConfig.waves.map((wave: TrialWave) => (
                        <div key={wave.waveNumber} className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-700">
                              {wave.waveNumber}
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-slate-900">{wave.name}</div>
                              <div className="text-xs text-slate-500">{wave.description}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 text-xs">
                            <span className="text-slate-500">{wave.enemyCount} enemies</span>
                            <Badge variant="outline" className={getDifficultyColor(wave.difficulty)}>
                              {wave.difficulty}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ACTIVE TRIAL TAB */}
          <TabsContent value="active" className="mt-6 space-y-4">
            {!activeTrial ? (
              <Card className="bg-white border-slate-200">
                <CardContent className="p-10 text-center text-slate-500">
                  <Swords className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                  <p className="text-lg font-semibold text-slate-700 mb-2">No Active Trial</p>
                  <p className="text-sm">Start a trial from the Lobby tab to begin your challenge.</p>
                </CardContent>
              </Card>
            ) : (
              <>
                <Card className="bg-white border-slate-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-amber-600" /> Active Trial - Tier {activeTrial.tier}
                    </CardTitle>
                    <CardDescription>
                      Wave {activeTrial.completedWaves + 1} / {activeTrial.totalWaves} | Points: {activeTrial.totalPoints}
                      {activeTrial.flawless && <Badge className="ml-2 bg-yellow-100 text-yellow-900">Flawless</Badge>}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {selectedTierConfig && activeTrial.completedWaves + 1 <= selectedTierConfig.waves.length && (
                      <Card className="border-red-200 bg-red-50">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="font-orbitron font-bold text-slate-900">
                                Wave {selectedTierConfig.waves[activeTrial.completedWaves]?.waveNumber}: {selectedTierConfig.waves[activeTrial.completedWaves]?.name}
                              </div>
                              <p className="text-sm text-slate-600 mt-1">
                                {selectedTierConfig.waves[activeTrial.completedWaves]?.description}
                              </p>
                            </div>
                            <Badge variant="outline" className={getDifficultyColor(selectedTierConfig.waves[activeTrial.completedWaves]?.difficulty || "medium")}>
                              {selectedTierConfig.waves[activeTrial.completedWaves]?.difficulty}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-3 mt-3">
                            <div className="rounded-lg border border-red-200 bg-white p-2 text-center">
                              <div className="text-xs text-slate-500">Enemies</div>
                              <div className="text-lg font-bold text-slate-900">{selectedTierConfig.waves[activeTrial.completedWaves]?.enemyCount}</div>
                            </div>
                            <div className="rounded-lg border border-red-200 bg-white p-2 text-center">
                              <div className="text-xs text-slate-500">Enemy Power</div>
                              <div className="text-lg font-bold text-slate-900">{selectedTierConfig.waves[activeTrial.completedWaves]?.enemyPower.toLocaleString()}</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {currentWaveResult && (
                      <Card className="border-green-200 bg-green-50">
                        <CardContent className="p-4">
                          <div className="font-bold text-green-800 mb-2">Last Wave Result</div>
                          <p className="text-sm text-green-700">{currentWaveResult.waveCompleted ? "Wave completed successfully!" : "Wave failed."}</p>
                          {currentWaveResult.rewards && currentWaveResult.rewards.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {currentWaveResult.rewards.map((r: any, i: number) => (
                                <Badge key={i} className="bg-green-100 text-green-900">+{r.amount} {r.type}</Badge>
                              ))}
                            </div>
                          )}
                          {currentWaveResult.nextWave && (
                            <div className="mt-3 text-sm text-slate-600">
                              Next wave: {currentWaveResult.nextWave?.name || ""} ({currentWaveResult.nextWave?.enemyCount} enemies)
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )}

                    <div className="flex gap-3">
                      <Button
                        className="flex-1 bg-amber-600 hover:bg-amber-700"
                        onClick={() => resolveWaveMutation.mutate()}
                        disabled={resolveWaveMutation.isPending || !!trialResult}
                      >
                        <Zap className="w-4 h-4 mr-2" /> Resolve Wave
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => completeTrialMutation.mutate()}
                        disabled={completeTrialMutation.isPending || !!trialResult}
                      >
                        <Trophy className="w-4 h-4 mr-2" /> Complete Trial
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {trialResult && (
              <Card className="bg-white border-slate-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-600" /> Trial Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <Card className="border-slate-200 bg-slate-50">
                      <CardContent className="p-3 text-center">
                        <div className="text-xs text-slate-500">Waves Completed</div>
                        <div className="text-2xl font-bold text-slate-900">{trialResult.wavesCompleted}</div>
                      </CardContent>
                    </Card>
                    <Card className="border-blue-200 bg-blue-50">
                      <CardContent className="p-3 text-center">
                        <div className="text-xs text-blue-700">Total Points</div>
                        <div className="text-2xl font-bold text-blue-900">{trialResult.totalPoints.toLocaleString()}</div>
                      </CardContent>
                    </Card>
                    <Card className="border-purple-200 bg-purple-50">
                      <CardContent className="p-3 text-center">
                        <div className="text-xs text-purple-700">Flawless</div>
                        <div className="text-2xl font-bold text-purple-900">{trialResult.flawless ? "Yes" : "No"}</div>
                      </CardContent>
                    </Card>
                    <Card className="border-amber-200 bg-amber-50">
                      <CardContent className="p-3 text-center">
                        <div className="text-xs text-amber-700">Time Bonus</div>
                        <div className="text-2xl font-bold text-amber-900">{trialResult.timeBonus?.earned ? `${trialResult.timeBonus.bonus} pts` : "None"}</div>
                      </CardContent>
                    </Card>
                  </div>

                  {trialResult.rewards && trialResult.rewards.length > 0 && (
                    <div>
                      <h3 className="font-bold text-slate-900 mb-2">Rewards</h3>
                      <div className="flex flex-wrap gap-2">
                        {trialResult.rewards.map((r: any, i: number) => (
                          <Badge key={i} className="bg-green-100 text-green-900 text-sm px-3 py-1">
                            +{r.amount.toLocaleString()} {r.type}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <Button className="w-full" onClick={() => { setTrialResult(null); setActiveTrial(null); setCurrentWaveResult(null); }}>
                    Return to Lobby
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* LEADERBOARD TAB */}
          <TabsContent value="leaderboard" className="mt-6 space-y-4">
            <Card className="bg-white border-slate-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-yellow-600" /> Trial Leaderboard
                    </CardTitle>
                    <CardDescription>Top players ranked by performance in each trial tier.</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-slate-500">Tier:</label>
                    <select
                      className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm"
                      value={leaderboardTier}
                      onChange={(e) => setLeaderboardTier(parseInt(e.target.value))}
                    >
                      {tiers.map((t: TrialTier) => (
                        <option key={t.tier} value={t.tier}>Tier {t.tier} - {t.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {leaderboard.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">No leaderboard entries yet for this tier.</div>
                ) : (
                  <div className="space-y-2">
                    {leaderboard.map((entry: LeaderboardEntry) => (
                      <div key={entry.rank} className={`flex items-center justify-between rounded-lg border p-3 ${
                        entry.rank <= 3 ? "bg-yellow-50 border-yellow-200" : "bg-white border-slate-200"
                      }`}>
                        <div className="flex items-center gap-3">
                          <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                            entry.rank === 1 ? "bg-yellow-100 text-yellow-800" :
                            entry.rank === 2 ? "bg-slate-100 text-slate-800" :
                            entry.rank === 3 ? "bg-orange-100 text-orange-800" : "bg-slate-100 text-slate-600"
                          }`}>
                            {entry.rank === 1 ? <Crown className="w-4 h-4" /> : entry.rank}
                          </div>
                          <div>
                              <div className="font-semibold text-slate-900">{entry.userId.slice(0, 8) + "..."}</div>
                            <div className="text-xs text-slate-500">{entry.bestWave} waves</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-slate-900">{entry.points.toLocaleString()} pts</div>
                          {entry.bestTime != null && <div className="text-xs text-slate-500">{formatTime(entry.bestTime)}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </GameLayout>
  );
}
