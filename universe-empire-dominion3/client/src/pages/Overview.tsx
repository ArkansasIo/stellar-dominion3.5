import GameLayout from "@/components/layout/GameLayout";
import { useGame } from "@/lib/gameContext";
import { PLANET_ASSETS } from "@shared/config";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Gem, Database, Zap, Coins, Droplets, Box, Crown, Swords, FlaskConical, Rocket, Shield, Activity, Clock, Factory, Send, MessageSquare, CheckCircle, AlertTriangle, AlertCircle, Info, Bell, TrendingUp, Users, Trophy, Globe } from "lucide-react";
import { getPlanetDetails } from "@/lib/planetUtils";
import Navigation from "./Navigation";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface SeasonPassProgressResponse { success: boolean; state: { currentTier: number; xp: number; xpIntoTier: number; xpForNextTier: number; completionRatio: number; }; }
interface BattlePassOverviewResponse { state: { currentTier: number; xp: number; xpIntoTier: number; xpForNextTier: number; completionRatio: number; premiumUnlocked: boolean; eliteUnlocked: boolean; }; }
interface PopulationSnapshotResponse {
  success: boolean;
  snapshot: {
    frameTier: number; frame: { name: string };
    population: { current: number; capacity: number; utilization: number; happiness: number; estimatedGrowthPerHour: number };
    food: { pressure: "surplus" | "stable" | "strained" | "critical"; netPerHour: number; hoursToDepletion: number | null };
    water: { pressure: "surplus" | "stable" | "strained" | "critical"; netPerHour: number; hoursToDepletion: number | null };
    civilizationSystems: { projectedProductivity: number; foodDemandFromJobsPerHour: number; waterDemandFromJobsPerHour: number };
  };
}

function pressureColor(p: string) {
  if (p === "surplus") return "text-emerald-400 border-emerald-500/30";
  if (p === "stable") return "text-blue-400 border-blue-500/30";
  if (p === "strained") return "text-amber-400 border-amber-500/30";
  return "text-red-400 border-red-500/30";
}

function getPlanetImagePath(c: string): string {
  const u = c.toUpperCase();
  if (u === "M") return PLANET_ASSETS.TERRESTRIAL.EARTH_LIKE.path;
  if (u === "H" || u === "D") return PLANET_ASSETS.TERRESTRIAL.DESERT.path;
  if (u === "L") return PLANET_ASSETS.TERRESTRIAL.JUNGLE.path;
  if (u === "K") return PLANET_ASSETS.TERRESTRIAL.ICE.path;
  if (u === "Y") return PLANET_ASSETS.TERRESTRIAL.VOLCANIC.path;
  if (u === "J") return PLANET_ASSETS.GAS_GIANTS.JUPITER_CLASS.path;
  if (u === "T") return PLANET_ASSETS.GAS_GIANTS.NEPTUNE_CLASS.path;
  return PLANET_ASSETS.TERRESTRIAL.EARTH_LIKE.path;
}

export default function Overview() {
  const { toast } = useToast();
  const { planetName, resources, buildings, events, coordinates, username, queue, activeMissions, research, units, messages, alliance } = useGame();
  const coordParts = coordinates.split(':').map(p => parseInt(p) || 0);
  const seed = (coordParts[0] || 1) * 10000 + (coordParts[1] || 1) * 1000 + (coordParts[2] || 100) * 100 + (coordParts[3] || 3);
  const planetInfo = getPlanetDetails(seed);
  const commander = username || localStorage.getItem("stellar_username") || "Commander";

  const mProd = Math.floor(30 * buildings.metalMine * 1.1);
  const cProd = Math.floor(20 * buildings.crystalMine * 1.05);
  const dProd = Math.floor(10 * buildings.deuteriumSynthesizer * 1.02);
  const eProd = Math.floor(20 * buildings.solarPlant) - Math.floor(10 * (buildings.metalMine + buildings.crystalMine + buildings.deuteriumSynthesizer));
  const fProd = Math.floor(5 * ((buildings as any).farm || 1));
  const wProd = Math.floor(3 * ((buildings as any).waterExtractor || 1));

  const fleetPower = Object.values(units).reduce((s, c) => s + c * 100, 0);
  const resLevels = Object.values(research).reduce((s, l) => s + l, 0);
  const bLevels = Object.values(buildings).reduce((s, v) => s + v, 0);
  const empireScore = Math.floor(fleetPower / 10 + resLevels * 100 + bLevels * 50);
  const unreadMsgs = messages.filter((m: any) => !m.read && m.to === "Commander").length;
  const totalUnits = Object.values(units).reduce((s, c) => s + c, 0);
  const buildQ = queue.filter(q => q.type === "building");
  const resQ = queue.filter(q => q.type === "research");
  const unitQ = queue.filter(q => q.type === "unit");

  const alerts: Array<{ title: string; detail: string; level: "warning" | "danger" | "info" }> = [];
  if (eProd < 0) alerts.push({ title: "Energy Deficit", detail: `Production is ${eProd.toLocaleString()}/h. Upgrade Solar Plant.`, level: "danger" });
  if (resources.metal < 10000 || resources.crystal < 8000) alerts.push({ title: "Low Reserves", detail: "Metal/Crystal reserves low for upgrades.", level: "warning" });
  if (activeMissions.length === 0) alerts.push({ title: "Idle Fleet", detail: "No active missions. Deploy fleet.", level: "info" });
  if (queue.length === 0) alerts.push({ title: "Empty Queue", detail: "Queue next build/research.", level: "info" });

  const { data: seasonProg } = useQuery<SeasonPassProgressResponse>({ queryKey: ["/api/season-pass/progression"], queryFn: async () => { const r = await fetch("/api/season-pass/progression", { credentials: "include" }); if (!r.ok) throw new Error("Failed"); return r.json(); } });
  const { data: battleProg } = useQuery<BattlePassOverviewResponse>({ queryKey: ["/api/battle-pass/overview"], queryFn: async () => { const r = await fetch("/api/battle-pass/overview", { credentials: "include" }); if (!r.ok) throw new Error("Failed"); return r.json(); } });
  const { data: popSnap } = useQuery<PopulationSnapshotResponse>({ queryKey: ["/api/population/snapshot"], queryFn: async () => { const r = await fetch("/api/population/snapshot", { credentials: "include" }); if (!r.ok) throw new Error("Failed"); return r.json(); } });

  const seasonMut = useMutation({ mutationFn: async (xp: number) => (await apiRequest("POST", "/api/season-pass/xp", { xp })).json(), onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/season-pass/progression"] }); toast({ title: "Season XP Added" }); } });
  const battleMut = useMutation({ mutationFn: async (xp: number) => (await apiRequest("POST", "/api/battle-pass/xp", { xp })).json(), onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/battle-pass/overview"] }); toast({ title: "Battle XP Added" }); } });

  return (
    <GameLayout>
      <div className="max-w-7xl mx-auto p-4 space-y-4 animate-in fade-in duration-500">
        <Navigation />
        <Card className="border-slate-700/50 bg-gradient-to-r from-slate-900/80 to-slate-800/50">
          <CardContent className="p-3 flex items-center gap-4">
            <img src={getPlanetImagePath(planetInfo.class)} alt="" className="w-14 h-14 rounded-full object-cover ring-2 ring-blue-500/30 shrink-0" onError={e => { e.currentTarget.style.display = 'none'; }} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-white">{planetName}</h1>
                <Badge variant="outline" className="text-[10px] border-slate-600 text-slate-400">{coordinates}</Badge>
                <Badge variant="outline" className="text-[10px] border-blue-500/30 text-blue-400">CLASS {planetInfo.class}</Badge>
              </div>
              <p className="text-xs text-slate-400">Commander: {commander}</p>
            </div>
            <div className="text-right shrink-0">
              <div className="text-[10px] text-[var(--sd-text-secondary)] uppercase">Server Time</div>
              <div className="text-sm font-mono text-slate-300">{new Date().toLocaleTimeString()}</div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-7 gap-2">
          {([
            [Box, "Metal", resources.metal, mProd, "text-slate-300"],
            [Gem, "Crystal", resources.crystal, cProd, "text-blue-400"],
            [Database, "Deuterium", resources.deuterium, dProd, "text-emerald-400"],
            [Zap, "Energy", resources.energy, eProd, eProd >= 0 ? "text-amber-400" : "text-red-400"],
            [Coins, "Credits", resources.credits, 0, "text-yellow-400"],
            [Droplets, "Food", resources.food || 0, fProd, "text-green-400"],
            [Droplets, "Water", resources.water || 0, wProd, "text-cyan-400"],
          ] as const).map(([Icon, label, val, rate, color]) => (
            <Card key={label} className="border-slate-700/50">
              <CardContent className="p-2 flex items-center gap-2">
                <Icon className={cn("w-4 h-4 shrink-0", color)} />
                <div className="min-w-0">
                  <div className="text-[10px] text-[var(--sd-text-secondary)] truncate">{label}</div>
                  <div className="text-sm font-bold text-white font-mono">{val.toLocaleString()}</div>
                  <div className={cn("text-[10px] font-mono", rate >= 0 ? "text-emerald-400" : "text-red-400")}>{rate >= 0 ? "+" : ""}{rate.toLocaleString()}/h</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-4 gap-4">
          {([
            [Crown, "Empire Score", empireScore.toLocaleString(), `Level ${Math.floor(empireScore / 10000) + 1}`, "text-amber-400"],
            [Swords, "Fleet Power", fleetPower.toLocaleString(), `${totalUnits} ships`, "text-red-400"],
            [FlaskConical, "Research Level", resLevels.toLocaleString(), "Total tech levels", "text-blue-400"],
            [Globe, "Colony", "1", `${activeMissions.length} active missions`, "text-emerald-400"],
          ] as const).map(([Icon, label, value, sub, color]) => (
            <Card key={label} className="border-slate-700/50">
              <CardContent className="p-3">
                <div className="flex items-center gap-2 mb-1"><Icon className={cn("w-4 h-4", color)} /><span className="text-xs text-slate-400">{label}</span></div>
                <div className="text-xl font-bold text-white">{value}</div>
                <div className="text-[11px] text-[var(--sd-text-secondary)]">{sub}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-slate-700/50">
          <CardHeader className="pb-1"><CardTitle className="text-sm flex items-center gap-2"><Factory className="w-4 h-4 text-orange-400" /> Construction Queue</CardTitle></CardHeader>
          <CardContent>
            {queue.length === 0 ? (
              <div className="text-center py-3 text-[var(--sd-text-secondary)]"><Clock className="w-5 h-5 mx-auto mb-1 opacity-30" /><p className="text-xs">No active construction</p></div>
            ) : (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {buildQ.map((item, i) => { const t = Math.max(0, Math.floor((item.endTime - Date.now()) / 1000)); return (<div key={`b-${i}`} className="shrink-0 w-40 bg-slate-800/50 p-2 rounded border border-orange-500/20"><div className="flex justify-between text-[11px] mb-0.5"><span className="text-white truncate">{item.name}</span><span className="text-orange-400 font-mono">{t}s</span></div><Progress value={Math.max(0, 100 - (t / 10) * 100)} className="h-1" /></div>); })}
                {resQ.map((item, i) => { const t = Math.max(0, Math.floor((item.endTime - Date.now()) / 1000)); return (<div key={`r-${i}`} className="shrink-0 w-40 bg-slate-800/50 p-2 rounded border border-blue-500/20"><div className="flex justify-between text-[11px] mb-0.5"><span className="text-white truncate">{item.name}</span><span className="text-blue-400 font-mono">{t}s</span></div><Progress value={Math.max(0, 100 - (t / 5) * 100)} className="h-1" /></div>); })}
                {unitQ.map((item, i) => { const t = Math.max(0, Math.floor((item.endTime - Date.now()) / 1000)); return (<div key={`u-${i}`} className="shrink-0 w-40 bg-slate-800/50 p-2 rounded border border-purple-500/20"><div className="flex justify-between text-[11px] mb-0.5"><span className="text-white truncate">{item.amount}x {item.name}</span><span className="text-purple-400 font-mono">{t}s</span></div><Progress value={Math.max(0, 100 - (t / 2) * 100)} className="h-1" /></div>); })}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          <Card className="border-slate-700/50">
            <CardHeader className="pb-1"><CardTitle className="text-sm flex items-center gap-2"><Activity className="w-4 h-4 text-blue-400" /> Activity Feed</CardTitle></CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[200px] px-4">
                <div className="space-y-1.5 pb-3">
                  {events.length === 0 ? <div className="text-center py-5 text-[var(--sd-text-secondary)]"><Bell className="w-5 h-5 mx-auto mb-1 opacity-30" /><p className="text-xs">No events</p></div> : events.map(ev => (
                    <div key={ev.id} className="flex gap-2 items-start p-1.5 bg-slate-800/30 rounded border border-slate-700/30">
                      <div className="mt-0.5 shrink-0">{ev.type === "success" && <CheckCircle className="w-3 h-3 text-emerald-400" />}{ev.type === "warning" && <AlertTriangle className="w-3 h-3 text-amber-400" />}{ev.type === "danger" && <AlertCircle className="w-3 h-3 text-red-400" />}{ev.type === "info" && <Info className="w-3 h-3 text-blue-400" />}</div>
                      <div className="flex-1 min-w-0"><div className="text-[11px] font-medium text-white truncate">{ev.title}</div><div className="text-[10px] text-slate-400 truncate">{ev.description}</div></div>
                      <span className="text-[9px] text-[var(--sd-text-secondary)] shrink-0">{new Date(ev.timestamp).toLocaleTimeString()}</span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          <Card className="border-slate-700/50">
            <CardHeader className="pb-1"><CardTitle className="text-sm flex items-center gap-2"><Zap className="w-4 h-4 text-yellow-400" /> Quick Actions</CardTitle></CardHeader>
            <CardContent className="space-y-1.5">
              {([
                ["/facilities", Factory, "Build", "text-orange-400"],
                ["/research", FlaskConical, "Research", "text-blue-400"],
                ["/fleet", Rocket, "Fleet", "text-red-400"],
                ["/market", TrendingUp, "Market", "text-emerald-400"],
                ["/shipyard", Shield, "Shipyard", "text-purple-400"],
                ["/messages", MessageSquare, "Messages", "text-cyan-400", unreadMsgs],
              ] as const).map(([href, Icon, label, color, badge]) => (
                <Link key={href} href={href}>
                  <Button variant="outline" className="w-full justify-start h-8 border-slate-700/50 text-slate-300 hover:bg-slate-800/50 text-xs">
                    <Icon className={cn("w-3.5 h-3.5 mr-2", color)} /> {label}
                    {badge ? <Badge className="ml-auto bg-red-500/20 text-red-400 border-red-500/30 text-[9px] h-3.5">{badge}</Badge> : null}
                  </Button>
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Card className="border-slate-700/50">
            <CardHeader className="pb-1"><CardTitle className="text-sm flex items-center gap-2"><Trophy className="w-4 h-4 text-amber-400" /> Pass Progress</CardTitle></CardHeader>
            <CardContent className="space-y-2.5">
              <div><div className="flex justify-between text-[11px] mb-0.5"><span className="text-slate-400">Season Pass</span><span className="text-white font-mono">Tier {seasonProg?.state.currentTier || 1}</span></div><Progress value={Math.min(100, (seasonProg?.state.completionRatio || 0) * 100)} className="h-1.5" /><div className="text-[10px] text-[var(--sd-text-secondary)]">{seasonProg?.state.xpIntoTier || 0}/{seasonProg?.state.xpForNextTier || 1} XP</div></div>
              <div><div className="flex justify-between text-[11px] mb-0.5"><span className="text-slate-400">Battle Pass</span><span className="text-white font-mono">Tier {battleProg?.state.currentTier || 1}</span></div><Progress value={Math.min(100, (battleProg?.state.completionRatio || 0) * 100)} className="h-1.5" /><div className="text-[10px] text-[var(--sd-text-secondary)]">{battleProg?.state.xpIntoTier || 0}/{battleProg?.state.xpForNextTier || 1} XP</div></div>
              <Separator className="bg-slate-700/50" />
              <div className="grid grid-cols-2 gap-1.5">
                <Button size="sm" variant="outline" className="border-slate-700/50 text-slate-400 h-6 text-[10px]" disabled={seasonMut.isPending} onClick={() => seasonMut.mutate(1200)}>+1 Season Tier</Button>
                <Button size="sm" variant="outline" className="border-slate-700/50 text-slate-400 h-6 text-[10px]" disabled={battleMut.isPending} onClick={() => battleMut.mutate(900)}>+1 Battle Tier</Button>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <Link href="/season-pass"><Button variant="ghost" size="sm" className="w-full h-6 text-[10px] text-slate-400">Season Rewards</Button></Link>
                <Link href="/battle-pass"><Button variant="ghost" size="sm" className="w-full h-6 text-[10px] text-slate-400">Battle Rewards</Button></Link>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-700/50">
            <CardHeader className="pb-1"><CardTitle className="text-sm flex items-center gap-2"><Users className="w-4 h-4 text-cyan-400" /> Civilization</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-1.5">
                <div className="bg-slate-800/50 p-1.5 rounded border border-slate-700/30"><div className="text-[9px] text-[var(--sd-text-secondary)]">Population</div><div className="text-xs font-bold text-white">{(popSnap?.snapshot.population.current || 0).toLocaleString()}<span className="text-[var(--sd-text-secondary)] font-normal"> / {(popSnap?.snapshot.population.capacity || 0).toLocaleString()}</span></div></div>
                <div className="bg-slate-800/50 p-1.5 rounded border border-slate-700/30"><div className="text-[9px] text-[var(--sd-text-secondary)]">Growth</div><div className="text-xs font-bold text-emerald-400">+{(popSnap?.snapshot.population.estimatedGrowthPerHour || 0).toLocaleString()}/h</div></div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px]"><span className="text-slate-400">Food</span><Badge variant="outline" className={cn("text-[9px]", pressureColor(popSnap?.snapshot.food.pressure || "stable"))}>{(popSnap?.snapshot.food.pressure || "stable").toUpperCase()}</Badge></div>
                <div className="flex items-center justify-between text-[11px]"><span className="text-slate-400">Water</span><Badge variant="outline" className={cn("text-[9px]", pressureColor(popSnap?.snapshot.water.pressure || "stable"))}>{(popSnap?.snapshot.water.pressure || "stable").toUpperCase()}</Badge></div>
              </div>
              <Link href="/civilization-systems"><Button variant="outline" size="sm" className="w-full h-6 text-[10px] border-slate-700/50 text-slate-400">Open Systems</Button></Link>
            </CardContent>
          </Card>

          <Card className="border-slate-700/50">
            <CardHeader className="pb-1"><CardTitle className="text-sm flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-amber-400" /> Alerts & Actions</CardTitle></CardHeader>
            <CardContent className="space-y-1.5">
              {alerts.slice(0, 3).map((a, i) => (
                <div key={`${a.title}-${i}`} className={cn("rounded border p-1.5 text-[11px]", a.level === "danger" && "bg-red-500/10 border-red-500/20 text-red-400", a.level === "warning" && "bg-amber-500/10 border-amber-500/20 text-amber-400", a.level === "info" && "bg-blue-500/10 border-blue-500/20 text-blue-400")}><div className="font-semibold">{a.title}</div><div className="opacity-80">{a.detail}</div></div>
              ))}
              <Separator className="bg-slate-700/50" />
              {([
                [eProd < 0 ? "Fix energy economy" : "Scale production", "/resources"],
                [queue.length === 0 ? "Queue next build" : "Review queue", queue.length === 0 ? "/facilities" : "/research"],
                [activeMissions.length === 0 ? "Dispatch fleet" : "Track missions", "/fleet"],
              ] as const).map(([label, href]) => (
                <Link key={label} href={href}><Button variant="outline" className="w-full justify-between text-[11px] h-7 border-slate-700/50 text-slate-400"><span>{label}</span><span className="text-slate-600">→</span></Button></Link>
              ))}
            </CardContent>
          </Card>
        </div>

        {alliance && (
          <Card className="border-slate-700/50">
            <CardContent className="p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-blue-400" />
                <div><div className="text-[9px] text-[var(--sd-text-secondary)]">Alliance</div><div className="text-sm font-bold text-white">[{alliance.tag}] {alliance.name}</div></div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-center"><div className="text-[9px] text-[var(--sd-text-secondary)]">Members</div><div className="text-sm font-bold text-white">{alliance.members?.length || 0}</div></div>
                <div className="text-center"><div className="text-[9px] text-[var(--sd-text-secondary)]">Points</div><div className="text-sm font-bold text-white">{(alliance.members?.reduce((a: number, m: any) => a + m.points, 0) || 0).toLocaleString()}</div></div>
                <Link href="/alliance"><Button variant="outline" size="sm" className="border-slate-700/50 text-slate-400 h-7 text-[10px]">View</Button></Link>
              </div>
            </CardContent>
          </Card>
        )}

        {activeMissions.length > 0 && (
          <Card className="border-slate-700/50">
            <CardHeader className="pb-1"><CardTitle className="text-sm flex items-center gap-2"><Send className="w-4 h-4 text-red-400" /> Active Missions</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2">
                {activeMissions.slice(0, 6).map(m => {
                  const now = Date.now(), ret = m.status === "return" || now > m.arrivalTime;
                  const t = Math.max(0, (ret ? m.returnTime : m.arrivalTime) - now);
                  return (<div key={m.id} className={cn("p-2 rounded border", ret ? "bg-blue-500/10 border-blue-500/20" : "bg-red-500/10 border-red-500/20")}><div className="flex items-center justify-between mb-0.5"><Badge variant="outline" className={cn("text-[9px]", ret ? "border-blue-500/30 text-blue-400" : "border-red-500/30 text-red-400")}>{m.type}</Badge><span className="font-mono text-[11px] text-white">{Math.ceil(t / 1000)}s</span></div><div className="text-[10px] text-slate-400">[{m.target}]</div></div>);
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </GameLayout>
  );
}
