import GameLayout from "@/components/layout/GameLayout";
import { useGame } from "@/lib/gameContext";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import {
  Sword, Shield, Eye, Target, Trophy, Zap, Crosshair, Users, AlertTriangle,
  ChevronDown, ChevronRight, CheckCircle2, XCircle, Search, Skull, Radio,
  ShieldCheck, Clock, BarChart3, Download, UserPlus, Bug, BookOpen, Lock
} from "lucide-react";
import { useState, useMemo } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

type BattleResult = {
  winner: "attacker" | "defender" | "draw";
  rounds: { round: number; attackerLosses: number; defenderLosses: number; events: string[] }[];
  attackerBefore: Record<string, number>;
  attackerAfter: Record<string, number>;
  plunder: { metal: number; crystal: number; deuterium: number };
  xpGained: number;
  rating: string;
};

type BattleEntry = {
  id: string; date: string; target: string; type: string;
  result: "victory" | "defeat" | "draw"; rating: string;
  fleetSent: Record<string, number>; shipsLost: number;
  plunder: { metal: number; crystal: number; deuterium: number };
};

const FORMATIONS = [
  { id: "balanced", name: "Balanced", atk: 0, def: 5, spd: 0 },
  { id: "aggressive", name: "Aggressive", atk: 15, def: -10, spd: 5 },
  { id: "defensive", name: "Defensive", atk: -5, def: 15, spd: -5 },
  { id: "flanking", name: "Flanking", atk: 10, def: 0, spd: 10 },
  { id: "pincer", name: "Pincer", atk: 10, def: 5, spd: -5 },
  { id: "wedge", name: "Wedge", atk: 20, def: -15, spd: 0 },
  { id: "circle", name: "Circle", atk: 0, def: 20, spd: -10 },
];

const TERRAINS = [
  { id: "space", name: "Open Space", atkMod: 0, defMod: 0, spdMod: 0 },
  { id: "asteroid", name: "Asteroid Field", atkMod: -5, defMod: 10, spdMod: -10 },
  { id: "nebula", name: "Nebula", atkMod: -10, defMod: 0, spdMod: 15 },
  { id: "planet", name: "Planet Orbit", atkMod: 5, defMod: 15, spdMod: 0 },
];

const RATINGS: Record<string, { color: string; desc: string }> = {
  S: { color: "text-yellow-400", desc: "Flawless victory - minimal losses" },
  A: { color: "text-green-400", desc: "Overwhelming victory" },
  B: { color: "text-blue-400", desc: "Decisive victory" },
  C: { color: "text-slate-400", desc: "Pyrrhic victory" },
  D: { color: "text-orange-400", desc: "Marginal defeat" },
  F: { color: "text-red-400", desc: "Catastrophic defeat" },
};

const AGENT_TIERS = [
  { id: "recruit", name: "Recruit", level: "Lv 1-10", cost: 50, success: 0.4, risk: 0.6 },
  { id: "operative", name: "Operative", level: "Lv 11-25", cost: 150, success: 0.7, risk: 0.3 },
  { id: "shadow", name: "Shadow Master", level: "Lv 26+", cost: 400, success: 0.9, risk: 0.1 },
];

const MISSIONS = [
  { id: "scan", name: "Intelligence Scan", desc: "Get fleet & resource info", icon: Eye, color: "text-blue-400" },
  { id: "sabotage", name: "Sabotage", desc: "Reduce building levels", icon: Zap, color: "text-red-400" },
  { id: "steal", name: "Steal Research", desc: "Copy target's tech", icon: BookOpen, color: "text-amber-400" },
  { id: "plant", name: "Plant Agent", desc: "Long-term intelligence", icon: Radio, color: "text-green-400" },
];

const DEFENSES = ["Laser Turret", "Plasma Cannon", "Shield Generator", "Missile Battery", "Ion Disruptor"];

function fmt(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

function SelectField({ label, value, onChange, items }: { label: string; value: string; onChange: (v: string) => void; items: { id: string; name: string }[] }) {
  return (
    <div className="flex-1">
      <label className="text-[11px] text-slate-500 uppercase mb-1 block">{label}</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="bg-slate-800 border-slate-700 text-white"><SelectValue /></SelectTrigger>
        <SelectContent className="bg-slate-800 border-slate-700">
          {items.map((i) => <SelectItem key={i.id} value={i.id} className="text-white">{i.name}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  );
}

function MiniCard({ label, value, icon: Icon, color }: { label: string; value: string; icon: any; color: string }) {
  return (
    <Card className="bg-slate-900 border-slate-700/50">
      <CardContent className="p-3 flex items-center gap-3">
        <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center", `bg-${color}-500/10`)}>
          <Icon className={cn("w-5 h-5", `text-${color}-400`)} />
        </div>
        <div>
          <div className="text-[11px] text-slate-500 uppercase tracking-wide">{label}</div>
          <div className="text-lg font-bold text-white">{value}</div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Combat() {
  const { units, research } = useGame();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("arena");
  const [formation, setFormation] = useState("balanced");
  const [terrain, setTerrain] = useState("space");
  const [targetType, setTargetType] = useState("player");
  const [targetId, setTargetId] = useState("");
  const [selectedUnits, setSelectedUnits] = useState<Record<string, number>>({});
  const [battleResult, setBattleResult] = useState<BattleResult | null>(null);
  const [showLaunchDialog, setShowLaunchDialog] = useState(false);
  const [expandedRound, setExpandedRound] = useState<number | null>(null);
  const [espionageTarget, setEspionageTarget] = useState("");
  const [selectedAgent, setSelectedAgent] = useState("operative");
  const [selectedMission, setSelectedMission] = useState("scan");
  const [historyFilter, setHistoryFilter] = useState("all");

  const { data: combatStats } = useQuery({
    queryKey: ["/api/combat/stats"],
    queryFn: async () => {
      const res = await fetch("/api/combat/stats", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch combat stats");
      return res.json();
    },
    refetchInterval: 30000,
  });

  const { data: battleHistory } = useQuery({
    queryKey: ["/api/combat/battle-history"],
    queryFn: async () => {
      const res = await fetch("/api/combat/battle-history", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch battle history");
      return res.json();
    },
    refetchInterval: 60000,
  });

  const attackMutation = useMutation({
    mutationFn: async () => {
      const hasUnits = Object.values(selectedUnits).some((c) => c > 0);
      if (!hasUnits) throw new Error("Select at least 1 unit");
      if (!targetId.trim()) throw new Error("Enter a target");
      const res = await fetch("/api/combat/attack", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ targetId, units: selectedUnits, formation, terrain }),
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error || "Attack failed"); }
      return res.json();
    },
    onSuccess: (data) => {
      setBattleResult({
        winner: data.winner || "attacker",
        rounds: data.battleResult?.rounds || [],
        attackerBefore: selectedUnits,
        attackerAfter: data.attackerAfter || {},
        plunder: data.plunder || { metal: 0, crystal: 0, deuterium: 0 },
        xpGained: data.xpGained || 0,
        rating: data.rating || "C",
      });
      setActiveTab("result");
      setShowLaunchDialog(false);
      toast({ title: "Battle resolved", description: "Engagement completed." });
    },
    onError: (err: any) => {
      toast({ title: "Attack failed", description: err.message, variant: "destructive" });
      setShowLaunchDialog(false);
    },
  });

  const unitTypes = Object.keys(units || {});
  const totalSelected = Object.values(selectedUnits).reduce((a, b) => a + b, 0);
  const weaponBonus = ((research as any)?.weaponsTech || 0) * 5;
  const defBonus = ((research as any)?.shieldingTech || 0) * 5;
  const fData = FORMATIONS.find((f) => f.id === formation)!;
  const tData = TERRAINS.find((t) => t.id === terrain)!;
  const totalAtkBonus = fData.atk + tData.atkMod;
  const totalDefBonus = fData.def + tData.defMod;
  const totalSpdBonus = fData.spd + tData.spdMod;
  const filteredHistory: BattleEntry[] = useMemo(() => {
    const list = battleHistory?.battles || [];
    return historyFilter === "all" ? list : list.filter((b: BattleEntry) => b.result === historyFilter);
  }, [battleHistory, historyFilter]);
  const stats = combatStats?.profile || {};
  const totalBattles = stats.totalBattles || 0;
  const wins = stats.wins || 0;
  const losses = stats.losses || 0;
  const winRate = totalBattles > 0 ? Math.round((wins / totalBattles) * 100) : 0;

  return (
    <GameLayout>
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="relative rounded-xl overflow-hidden shadow-lg" style={{ minHeight: 120 }}>
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-red-950/60 to-slate-950" />
          <div className="relative z-10 p-6 flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center">
              <Sword className="w-8 h-8 text-red-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Fleet Combat</h2>
              <p className="text-slate-400 text-sm">Command your fleet, execute tactics, conquer the stars.</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <MiniCard label="Attack Power" value={`+${weaponBonus + totalAtkBonus}%`} icon={Sword} color="red" />
          <MiniCard label="Defense Bonus" value={`+${defBonus + totalDefBonus}%`} icon={Shield} color="blue" />
          <MiniCard label="Fleet Size" value={fmt(Object.values(units || {}).reduce((a: number, b) => a + ((b as number) || 0), 0))} icon={Users} color="green" />
          <MiniCard label="Victories" value={wins.toString()} icon={Trophy} color="purple" />
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-slate-900 border border-slate-700/50 h-11 w-full justify-start">
            <TabsTrigger value="arena" className="gap-1.5 data-[state=active]:bg-slate-800"><Crosshair className="w-3.5 h-3.5" /> Battle Arena</TabsTrigger>
            <TabsTrigger value="result" className="gap-1.5 data-[state=active]:bg-slate-800" disabled={!battleResult}><Trophy className="w-3.5 h-3.5" /> Result</TabsTrigger>
            <TabsTrigger value="defense" className="gap-1.5 data-[state=active]:bg-slate-800"><ShieldCheck className="w-3.5 h-3.5" /> Defense</TabsTrigger>
            <TabsTrigger value="espionage" className="gap-1.5 data-[state=active]:bg-slate-800"><Eye className="w-3.5 h-3.5" /> Espionage</TabsTrigger>
            <TabsTrigger value="history" className="gap-1.5 data-[state=active]:bg-slate-800"><Clock className="w-3.5 h-3.5" /> History</TabsTrigger>
          </TabsList>

          <TabsContent value="arena" className="mt-4 space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Card className="lg:col-span-2 bg-slate-900 border-slate-700/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-sm flex items-center gap-2"><Users className="w-4 h-4 text-slate-400" /> Fleet Formation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-3">
                    <SelectField label="Formation" value={formation} onChange={setFormation} items={FORMATIONS} />
                    <SelectField label="Terrain" value={terrain} onChange={setTerrain} items={TERRAINS} />
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    {[
                      { label: "ATK", value: totalAtkBonus, color: totalAtkBonus >= 0 ? "text-green-400" : "text-red-400" },
                      { label: "DEF", value: totalDefBonus, color: totalDefBonus >= 0 ? "text-blue-400" : "text-red-400" },
                      { label: "SPD", value: totalSpdBonus, color: totalSpdBonus >= 0 ? "text-amber-400" : "text-red-400" },
                    ].map((m) => (
                      <div key={m.label} className="bg-slate-800 rounded-lg p-2 border border-slate-700/50">
                        <div className="text-[10px] text-slate-500">{m.label}</div>
                        <div className={cn("text-sm font-bold", m.color)}>{m.value >= 0 ? "+" : ""}{m.value}%</div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-slate-800 rounded-lg p-3 border border-slate-700/50">
                    <div className="text-[10px] text-slate-500 uppercase mb-2">Fleet Layout</div>
                    <div className="flex items-center justify-between">
                      <div className="text-center flex-1">
                        <div className="text-xs text-red-400 mb-1">YOUR FLEET</div>
                        <div className="flex gap-1 justify-center">
                          {unitTypes.slice(0, 4).map((u) => (
                            <div key={u} className="w-8 h-8 rounded bg-red-500/20 border border-red-500/30 flex items-center justify-center">
                              <Sword className="w-3.5 h-3.5 text-red-400" />
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="px-4">
                        <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
                          <Zap className="w-5 h-5 text-amber-400" />
                        </div>
                      </div>
                      <div className="text-center flex-1">
                        <div className="text-xs text-slate-400 mb-1">ENEMY</div>
                        <div className="flex gap-1 justify-center">
                          {[0, 1, 2, 3].map((i) => (
                            <div key={i} className="w-8 h-8 rounded bg-slate-700/50 border border-slate-600/50 flex items-center justify-center">
                              <Skull className="w-3.5 h-3.5 text-slate-500" />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <div className="space-y-4">
                <Card className="bg-slate-900 border-slate-700/50">
                  <CardHeader className="pb-3"><CardTitle className="text-white text-sm flex items-center gap-2"><Target className="w-4 h-4 text-slate-400" /> Target Selection</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-1.5">
                      {["player", "npc", "raid", "alliance"].map((t) => (
                        <Button key={t} variant={targetType === t ? "default" : "outline"} size="sm"
                          className={cn("text-[11px] capitalize", targetType === t ? "bg-red-600 hover:bg-red-700 text-white" : "border-slate-700 text-slate-400 hover:bg-slate-800")}
                          onClick={() => setTargetType(t)}>
                          {t === "npc" ? "NPC Fleet" : t === "raid" ? "Raid Boss" : t === "alliance" ? "Alliance" : "Player"}
                        </Button>
                      ))}
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-500 uppercase mb-1 block">Target ID / Name</label>
                      <Input placeholder="Enter target..." value={targetId} onChange={(e) => setTargetId(e.target.value)}
                        className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-600" />
                    </div>
                    <Button variant="outline" size="sm" className="w-full border-slate-700 text-slate-400 hover:bg-slate-800">
                      <Search className="w-3.5 h-3.5 mr-1.5" /> Spy Report
                    </Button>
                  </CardContent>
                </Card>
                <Card className="bg-slate-900 border-slate-700/50">
                  <CardHeader className="pb-3"><CardTitle className="text-white text-sm flex items-center gap-2"><BarChart3 className="w-4 h-4 text-slate-400" /> Battle Preview</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    <div className="bg-slate-800 rounded-lg p-3 border border-slate-700/50">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-slate-400">Your Fleet</span>
                        <span className="text-xs text-green-400 font-mono">~{fmt(totalSelected * 150)}</span>
                      </div>
                      <Progress value={65} className="h-2 bg-slate-700" />
                    </div>
                    <div className="bg-slate-800 rounded-lg p-3 border border-slate-700/50">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-slate-400">Enemy Fleet</span>
                        <span className="text-xs text-red-400 font-mono">~{fmt(totalSelected * 120)}</span>
                      </div>
                      <Progress value={52} className="h-2 bg-slate-700" />
                    </div>
                    <div className="bg-slate-800 rounded-lg p-3 border border-slate-700/50 flex justify-between items-center">
                      <span className="text-xs text-slate-400">Win Probability</span>
                      <span className="text-sm font-bold text-green-400">62%</span>
                    </div>
                    <div className="text-[10px] text-slate-600 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      {tData.name}: ATK {tData.atkMod >= 0 ? "+" : ""}{tData.atkMod}% / DEF {tData.defMod >= 0 ? "+" : ""}{tData.defMod}%
                    </div>
                    <Button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold"
                      disabled={totalSelected === 0 || !targetId.trim() || attackMutation.isPending}
                      onClick={() => setShowLaunchDialog(true)}>
                      <Sword className="w-4 h-4 mr-2" /> {attackMutation.isPending ? "Engaging..." : "Launch Battle"}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
            <Card className="bg-slate-900 border-slate-700/50">
              <CardHeader className="pb-3"><CardTitle className="text-white text-sm">Unit Deployment</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {unitTypes.map((u) => {
                    const owned = ((units as any)?.[u] || 0) as number;
                    const sel = selectedUnits[u] || 0;
                    return (
                      <div key={u} className="bg-slate-800 rounded-lg p-3 border border-slate-700/50">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-white capitalize">{u}</span>
                          <span className="text-[11px] text-slate-500">{sel}/{owned}</span>
                        </div>
                        <input type="range" min={0} max={owned} value={sel}
                          onChange={(e) => setSelectedUnits((p) => ({ ...p, [u]: parseInt(e.target.value) }))}
                          className="w-full h-1.5 bg-slate-700 rounded cursor-pointer accent-red-500" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="result" className="mt-4 space-y-4">
            {battleResult && (<>
              <Card className={cn("border", battleResult.winner === "attacker" ? "bg-green-950/30 border-green-800/50" : battleResult.winner === "defender" ? "bg-red-950/30 border-red-800/50" : "bg-slate-900 border-slate-700/50")}>
                <CardContent className="p-6 text-center">
                  <div className={cn("text-4xl font-black mb-2", battleResult.winner === "attacker" ? "text-green-400" : battleResult.winner === "defender" ? "text-red-400" : "text-slate-400")}>
                    {battleResult.winner === "attacker" ? "VICTORY" : battleResult.winner === "defender" ? "DEFEAT" : "DRAW"}
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-slate-500 text-sm">Rating:</span>
                    <span className={cn("text-2xl font-black", RATINGS[battleResult.rating]?.color || "text-slate-400")}>{battleResult.rating}</span>
                    <span className="text-slate-600 text-xs">— {RATINGS[battleResult.rating]?.desc}</span>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-slate-900 border-slate-700/50">
                <CardHeader className="pb-3"><CardTitle className="text-white text-sm">Round-by-Round Breakdown</CardTitle></CardHeader>
                <CardContent>
                  <ScrollArea className="max-h-[320px]">
                    <div className="space-y-2">
                      {battleResult.rounds.map((r, i) => (
                        <div key={i} className="bg-slate-800 rounded-lg border border-slate-700/50 overflow-hidden">
                          <button className="w-full flex items-center justify-between p-3 text-left" onClick={() => setExpandedRound(expandedRound === i ? null : i)}>
                            <div className="flex items-center gap-3">
                              <span className="text-xs text-slate-500 w-6">R{r.round}</span>
                              <span className="text-xs text-red-400">-{r.attackerLosses}</span>
                              <span className="text-[10px] text-slate-600">vs</span>
                              <span className="text-xs text-green-400">-{r.defenderLosses}</span>
                            </div>
                            {expandedRound === i ? <ChevronDown className="w-3.5 h-3.5 text-slate-500" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-500" />}
                          </button>
                          {expandedRound === i && (
                            <div className="px-3 pb-3 border-t border-slate-700/50 pt-2 space-y-1">
                              {r.events.map((ev, j) => (
                                <div key={j} className="text-[11px] text-slate-400 flex items-start gap-1.5">
                                  <Zap className="w-3 h-3 text-amber-400 mt-0.5 flex-shrink-0" />{ev}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-slate-900 border-slate-700/50">
                  <CardHeader className="pb-2"><CardTitle className="text-white text-xs">Fleet Summary</CardTitle></CardHeader>
                  <CardContent className="space-y-2 text-xs">
                    {Object.entries(battleResult.attackerBefore).map(([k, v]) => (
                      <div key={k} className="flex justify-between items-center">
                        <span className="text-slate-400 capitalize">{k}</span>
                        <span className="text-slate-500">{battleResult.attackerAfter[k] || 0}/{v}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
                <Card className="bg-slate-900 border-slate-700/50">
                  <CardHeader className="pb-2"><CardTitle className="text-white text-xs">Resources Plundered</CardTitle></CardHeader>
                  <CardContent className="space-y-2 text-xs">
                    {(["metal", "crystal", "deuterium"] as const).map((r) => (
                      <div key={r} className="flex justify-between items-center">
                        <span className="text-slate-400 capitalize">{r}</span>
                        <span className="text-green-400 font-mono">+{fmt(battleResult.plunder[r])}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
                <Card className="bg-slate-900 border-slate-700/50">
                  <CardHeader className="pb-2"><CardTitle className="text-white text-xs">Experience</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-center">
                      <span className="text-2xl font-bold text-amber-400">+{battleResult.xpGained}</span>
                      <span className="text-xs text-slate-500 block">XP Gained</span>
                    </div>
                    <Progress value={72} className="h-2 bg-slate-700" />
                    <div className="text-[10px] text-slate-600 text-center">Level 14 → Level 15 (72%)</div>
                  </CardContent>
                </Card>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 border-slate-700 text-slate-400 hover:bg-slate-800"><BookOpen className="w-4 h-4 mr-2" /> Full Report</Button>
                <Button className="flex-1 bg-red-600 hover:bg-red-700 text-white" onClick={() => { setBattleResult(null); setActiveTab("arena"); }}><Sword className="w-4 h-4 mr-2" /> Attack Again</Button>
                <Button variant="outline" className="flex-1 border-slate-700 text-slate-400 hover:bg-slate-800" onClick={() => setActiveTab("arena")}><Users className="w-4 h-4 mr-2" /> Return to Fleet</Button>
              </div>
            </>)}
          </TabsContent>

          <TabsContent value="defense" className="mt-4 space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="bg-slate-900 border-slate-700/50">
                <CardHeader className="pb-3"><CardTitle className="text-white text-sm flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-slate-400" /> Orbital Defenses</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  {DEFENSES.map((d, i) => (
                    <div key={d} className="flex items-center justify-between bg-slate-800 rounded-lg p-3 border border-slate-700/50">
                      <div>
                        <div className="text-sm text-white">{d}</div>
                        <div className="text-[10px] text-slate-500">Level {3 + i}</div>
                      </div>
                      <div className="text-xs text-blue-400 font-mono">{fmt((5 - i) * 2500)} PWR</div>
                    </div>
                  ))}
                </CardContent>
              </Card>
              <div className="space-y-4">
                <Card className="bg-slate-900 border-slate-700/50">
                  <CardHeader className="pb-3"><CardTitle className="text-white text-sm">Defense Formation</CardTitle></CardHeader>
                  <CardContent>
                    <Select value={formation} onValueChange={setFormation}>
                      <SelectTrigger className="bg-slate-800 border-slate-700 text-white"><SelectValue /></SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        {FORMATIONS.map((f) => <SelectItem key={f.id} value={f.id} className="text-white">{f.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <div className="mt-3 bg-slate-800 rounded-lg p-3 border border-slate-700/50 text-xs space-y-1">
                      <div className="flex justify-between"><span className="text-slate-500">Stationed Ships</span><span className="text-white">{fmt(totalSelected)}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Defense Rating</span><span className="text-blue-400">+{defBonus + totalDefBonus}%</span></div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-slate-900 border-slate-700/50">
                  <CardHeader className="pb-3"><CardTitle className="text-white text-sm">Defense Settings</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-400">Auto-Defend</span>
                      <div className="w-10 h-5 bg-red-600 rounded-full relative cursor-pointer"><div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full" /></div>
                    </div>
                    <Separator className="bg-slate-700/50" />
                    <div>
                      <label className="text-[11px] text-slate-500 uppercase mb-1 block">Alert Threshold</label>
                      <Select defaultValue="medium">
                        <SelectTrigger className="bg-slate-800 border-slate-700 text-white"><SelectValue /></SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          <SelectItem value="low" className="text-white">Low - All attacks</SelectItem>
                          <SelectItem value="medium" className="text-white">Medium - Strong attacks</SelectItem>
                          <SelectItem value="high" className="text-white">High - Overwhelming only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            <Card className="bg-slate-900 border-slate-700/50">
              <CardHeader className="pb-3"><CardTitle className="text-white text-sm flex items-center gap-2"><Clock className="w-4 h-4 text-slate-400" /> Recent Attacks Received</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {["Commander_X", "Void Raider", "Star Destroyer"].map((a, i) => (
                    <div key={i} className="flex items-center justify-between bg-slate-800 rounded-lg p-3 border border-slate-700/50">
                      <div className="flex items-center gap-3">
                        {i === 1 ? <XCircle className="w-4 h-4 text-red-400" /> : <CheckCircle2 className="w-4 h-4 text-green-400" />}
                        <div>
                          <div className="text-sm text-white">{a}</div>
                          <div className="text-[10px] text-slate-500">{2 + i}h ago</div>
                        </div>
                      </div>
                      <Badge variant={i === 1 ? "destructive" : "default"} className={cn(i !== 1 && "bg-green-900/50 text-green-400 border-green-800/50")}>
                        {i === 1 ? "DEFEATED" : "REPULSED"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="espionage" className="mt-4 space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="bg-slate-900 border-slate-700/50">
                <CardHeader className="pb-3"><CardTitle className="text-white text-sm flex items-center gap-2"><UserPlus className="w-4 h-4 text-slate-400" /> Agent Management</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {AGENT_TIERS.map((tier) => (
                    <div key={tier.id}
                      className={cn("bg-slate-800 rounded-lg p-3 border cursor-pointer transition-colors",
                        selectedAgent === tier.id ? "border-purple-500/50 bg-purple-950/20" : "border-slate-700/50 hover:border-slate-600")}
                      onClick={() => setSelectedAgent(tier.id)}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-white font-medium">{tier.name}</span>
                        <Badge variant="outline" className="text-[10px] border-purple-500/30 text-purple-400">{tier.level}</Badge>
                      </div>
                      <div className="flex gap-4 text-[11px] text-slate-500">
                        <span>Success: <span className="text-green-400">{Math.round(tier.success * 100)}%</span></span>
                        <span>Detection: <span className="text-red-400">{Math.round(tier.risk * 100)}%</span></span>
                        <span>Cost: <span className="text-purple-400">{tier.cost} DM</span></span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
              <Card className="bg-slate-900 border-slate-700/50">
                <CardHeader className="pb-3"><CardTitle className="text-white text-sm flex items-center gap-2"><Bug className="w-4 h-4 text-slate-400" /> Mission Types</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <label className="text-[11px] text-slate-500 uppercase mb-1 block">Target</label>
                    <Input placeholder="Target player ID..." value={espionageTarget} onChange={(e) => setEspionageTarget(e.target.value)}
                      className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-600" />
                  </div>
                  {MISSIONS.map((m) => (
                    <button key={m.id}
                      className={cn("w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-colors",
                        selectedMission === m.id ? "bg-purple-950/20 border-purple-500/50" : "bg-slate-800 border-slate-700/50 hover:border-slate-600")}
                      onClick={() => setSelectedMission(m.id)}>
                      <m.icon className={cn("w-5 h-5", m.color)} />
                      <div>
                        <div className="text-sm text-white">{m.name}</div>
                        <div className="text-[10px] text-slate-500">{m.desc}</div>
                      </div>
                    </button>
                  ))}
                  <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white" disabled={!espionageTarget.trim()}
                    onClick={() => toast({ title: "Mission dispatched", description: "Agent is en route." })}>
                    <Eye className="w-4 h-4 mr-2" /> Deploy Agent
                  </Button>
                </CardContent>
              </Card>
            </div>
            <Card className="bg-slate-900 border-slate-700/50">
              <CardHeader className="pb-3"><CardTitle className="text-white text-sm flex items-center gap-2"><Lock className="w-4 h-4 text-slate-400" /> Mission Results</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    { target: "Commander_X", type: "scan", result: "success", time: "2h ago" },
                    { target: "VoidRaider99", type: "sabotage", result: "detected", time: "6h ago" },
                    { target: "StarFleet_Admiral", type: "steal", result: "partial", time: "1d ago" },
                  ].map((r, i) => (
                    <div key={i} className="flex items-center justify-between bg-slate-800 rounded-lg p-3 border border-slate-700/50">
                      <div className="flex items-center gap-3">
                        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center",
                          r.result === "success" ? "bg-green-500/10" : r.result === "detected" ? "bg-red-500/10" : "bg-amber-500/10")}>
                          <Eye className={cn("w-4 h-4", r.result === "success" ? "text-green-400" : r.result === "detected" ? "text-red-400" : "text-amber-400")} />
                        </div>
                        <div>
                          <div className="text-sm text-white">{r.target}</div>
                          <div className="text-[10px] text-slate-500">{r.type} — {r.time}</div>
                        </div>
                      </div>
                      <Badge variant="outline" className={cn("text-[10px] capitalize",
                        r.result === "success" && "border-green-800 text-green-400",
                        r.result === "detected" && "border-red-800 text-red-400",
                        r.result === "partial" && "border-amber-800 text-amber-400")}>
                        {r.result}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="mt-4 space-y-4">
            <Card className="bg-slate-900 border-slate-700/50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white text-sm flex items-center gap-2"><Clock className="w-4 h-4 text-slate-400" /> Battle Log</CardTitle>
                  <div className="flex items-center gap-2">
                    <Select value={historyFilter} onValueChange={setHistoryFilter}>
                      <SelectTrigger className="bg-slate-800 border-slate-700 text-white w-32 h-8 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="all" className="text-white">All</SelectItem>
                        <SelectItem value="victory" className="text-white">Victories</SelectItem>
                        <SelectItem value="defeat" className="text-white">Defeats</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm" className="border-slate-700 text-slate-400 hover:bg-slate-800 h-8"><Download className="w-3.5 h-3.5" /></Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="max-h-[400px]">
                  <div className="space-y-2">
                    {filteredHistory.length === 0 && <div className="text-center py-8 text-slate-600 text-sm">No battles recorded yet.</div>}
                    {filteredHistory.map((b: BattleEntry) => (
                      <div key={b.id} className="bg-slate-800 rounded-lg p-3 border border-slate-700/50">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={cn("text-[10px] uppercase",
                              b.result === "victory" && "border-green-800 text-green-400",
                              b.result === "defeat" && "border-red-800 text-red-400",
                              b.result === "draw" && "border-slate-700 text-slate-400")}>{b.result}</Badge>
                            <span className="text-xs text-slate-400">vs {b.target}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={cn("text-sm font-bold", RATINGS[b.rating]?.color || "text-slate-400")}>{b.rating}</span>
                            <span className="text-[10px] text-slate-600">{b.date}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-[11px]">
                          <span className="text-slate-500"><Sword className="w-3 h-3 inline mr-1" />{Object.keys(b.fleetSent).length} types</span>
                          <span className="text-red-400">-{b.shipsLost} ships</span>
                          <span className="text-green-400">+{fmt(b.plunder.metal)}M +{fmt(b.plunder.crystal)}C</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
            <Card className="bg-slate-900 border-slate-700/50">
              <CardHeader className="pb-3"><CardTitle className="text-white text-sm flex items-center gap-2"><BarChart3 className="w-4 h-4 text-slate-400" /> Statistics Summary</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: "Total Battles", value: totalBattles.toString(), color: "text-white" },
                    { label: "Win Rate", value: `${winRate}%`, color: winRate >= 50 ? "text-green-400" : "text-red-400" },
                    { label: "Ships Destroyed", value: fmt(stats.shipsDestroyed || 0), color: "text-red-400" },
                    { label: "Ships Lost", value: fmt(stats.shipsLost || 0), color: "text-orange-400" },
                    { label: "Resources Plundered", value: fmt(stats.totalPlunder || 0), color: "text-green-400" },
                    { label: "Avg Rating", value: stats.avgRating || "C", color: "text-amber-400" },
                    { label: "Wins", value: wins.toString(), color: "text-green-400" },
                    { label: "Losses", value: losses.toString(), color: "text-red-400" },
                  ].map((s) => (
                    <div key={s.label} className="bg-slate-800 rounded-lg p-3 border border-slate-700/50 text-center">
                      <div className={cn("text-lg font-bold", s.color)}>{s.value}</div>
                      <div className="text-[10px] text-slate-500 uppercase">{s.label}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        <Dialog open={showLaunchDialog} onOpenChange={setShowLaunchDialog}>
          <DialogContent className="bg-slate-900 border-slate-700/50 text-white max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-amber-400" /> Confirm Battle Launch</DialogTitle>
              <DialogDescription className="text-slate-400">
                Deploy {totalSelected} ships against "{targetId}". Ships lost in combat are permanent.
              </DialogDescription>
            </DialogHeader>
            <div className="bg-slate-800 rounded-lg p-3 border border-slate-700/50 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-slate-500">Formation</span><span className="text-white capitalize">{formation}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Terrain</span><span className="text-white">{tData.name}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Fleet Size</span><span className="text-white">{totalSelected}</span></div>
              <Separator className="bg-slate-700/50" />
              <div className="flex justify-between"><span className="text-slate-500">ATK Bonus</span><span className={cn("font-mono", totalAtkBonus >= 0 ? "text-green-400" : "text-red-400")}>{totalAtkBonus >= 0 ? "+" : ""}{totalAtkBonus}%</span></div>
              <div className="flex justify-between"><span className="text-slate-500">DEF Bonus</span><span className={cn("font-mono", totalDefBonus >= 0 ? "text-blue-400" : "text-red-400")}>{totalDefBonus >= 0 ? "+" : ""}{totalDefBonus}%</span></div>
            </div>
            <DialogFooter className="gap-2">
              <Button variant="outline" className="border-slate-700 text-slate-400 hover:bg-slate-800" onClick={() => setShowLaunchDialog(false)}>Cancel</Button>
              <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={() => attackMutation.mutate()} disabled={attackMutation.isPending}>
                {attackMutation.isPending ? "Engaging..." : "Launch Attack"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </GameLayout>
  );
}
