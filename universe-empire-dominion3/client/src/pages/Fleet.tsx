import GameLayout from "@/components/layout/GameLayout";
import { useGame } from "@/lib/gameContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import {
  Rocket, Swords, Truck, Eye, Globe, Shield, Target, Clock, Zap,
  BarChart3, History, Users, Plus, Save, Download, AlertTriangle,
  RotateCcw, ChevronDown, ChevronUp, Trophy, Skull, Send, Gauge
} from "lucide-react";
import { useMemo, useState } from "react";
import { unitData } from "@/lib/unitData";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";

type FleetTab = "overview" | "dispatch" | "active" | "templates" | "reports" | "stats";
type MissionType = "attack" | "transport" | "espionage" | "colonize" | "deploy" | "recycle";

const MISSION_CONFIG: Record<MissionType, { label: string; icon: any; color: string; bg: string }> = {
  attack: { label: "Attack", icon: Swords, color: "text-red-400", bg: "bg-red-500/20 border-red-500/40" },
  transport: { label: "Transport", icon: Truck, color: "text-green-400", bg: "bg-green-500/20 border-green-500/40" },
  espionage: { label: "Espionage", icon: Eye, color: "text-purple-400", bg: "bg-purple-500/20 border-purple-500/40" },
  colonize: { label: "Colonize", icon: Globe, color: "text-blue-400", bg: "bg-blue-500/20 border-blue-500/40" },
  deploy: { label: "Deploy", icon: Shield, color: "text-orange-400", bg: "bg-orange-500/20 border-orange-500/40" },
  recycle: { label: "Recycle", icon: RotateCcw, color: "text-slate-400", bg: "bg-slate-500/20 border-slate-500/40" },
};

const TEMPLATES = [
  { id: "quick-attack", name: "Quick Attack", mission: "attack" as MissionType, ships: { lightFighter: 50, cruiser: 10, smallCargo: 20 }, icon: Zap },
  { id: "full-assault", name: "Full Assault", mission: "attack" as MissionType, ships: { heavyFighter: 30, battleship: 5, battlecruiser: 10, interceptor: 20 }, icon: Swords },
  { id: "colonization", name: "Colonization Force", mission: "colonize" as MissionType, ships: { colonist: 1, lightFighter: 5, largeCargo: 2 }, icon: Globe },
  { id: "spy-fleet", name: "Spy Fleet", mission: "espionage" as MissionType, ships: { scout: 5, lightFighter: 10 }, icon: Eye },
  { id: "transport-convoy", name: "Transport Convoy", mission: "transport" as MissionType, ships: { smallCargo: 30, largeCargo: 10, lightFighter: 5 }, icon: Truck },
];

const unitName = (id: string) => unitData.find((u) => u.id === id)?.name ?? id;
const unitGet = (id: string) => unitData.find((u) => u.id === id);
const unitClass = (id: string) => unitGet(id)?.class ?? "unknown";
const calcPower = (id: string, count: number) => { const u = unitGet(id); return u ? (u.stats.attack + u.stats.shield + u.stats.structure / 10) * count : 0; };

const MOCK_REPORTS = [
  { id: "r1", date: "2026-06-22 14:30", target: "1:105:12", result: "victory" as const, shipsLost: 2, plundered: 15000, log: ["15 fighters engaged", "Enemy defenses crumbled", "Victory achieved"], ships: { lightFighter: 50, cruiser: 5 }, power: 12500 },
  { id: "r2", date: "2026-06-21 09:15", target: "2:42:7", result: "defeat" as const, shipsLost: 28, plundered: 0, log: ["Fleet arrived", "Heavy resistance", "Fleet destroyed"], ships: { heavyFighter: 10, lightFighter: 18 }, power: 2400 },
  { id: "r3", date: "2026-06-20 21:45", target: "1:88:3", result: "victory" as const, shipsLost: 0, plundered: 45000, log: ["Espionage successful", "Intelligence gathered", "Raid completed"], ships: { scout: 3 }, power: 300 },
];

export default function Fleet() {
  const { units, activeMissions } = useGame();
  const { toast } = useToast();
  const [tab, setTab] = useState<FleetTab>("overview");
  const [mission, setMission] = useState<MissionType>("attack");
  const [sel, setSel] = useState<Record<string, number>>({});
  const [tgtG, setTgtG] = useState("1"); const [tgtS, setTgtS] = useState("102"); const [tgtP, setTgtP] = useState("8");
  const [speed, setSpeed] = useState([100]);
  const [expandM, setExpandM] = useState<string | null>(null);
  const [expandR, setExpandR] = useState<string | null>(null);
  const [rFilter, setRFilter] = useState<"all" | "victories" | "defeats" | "raids">("all");
  const [customTpls, setCustomTpls] = useState<{ name: string; ships: Record<string, number> }[]>([]);
  const [tplName, setTplName] = useState("");

  const sendMut = useMutation({
    mutationFn: async (p: { destination: string; missionType: string; ships: Record<string, number> }) => {
      const r = await fetch("/api/game/send-fleet", { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify(p) });
      const d = await r.json().catch(() => null);
      if (!r.ok) throw new Error(d?.error || d?.message || "Failed to send fleet");
      return d;
    },
    onSuccess: (_, v) => { setSel({}); setTab("active"); toast({ title: "Fleet launched", description: `${v.missionType} dispatched to ${v.destination}.` }); },
    onError: (e: Error) => { toast({ title: "Launch failed", description: e.message, variant: "destructive" }); },
  });

  const totalCount = useMemo(() => Object.values(units).reduce((a, b) => a + b, 0), [units]);
  const totalPower = useMemo(() => Object.entries(units).reduce((s, [id, c]) => s + calcPower(id, c), 0), [units]);
  const selCount = useMemo(() => Object.values(sel).reduce((a, b) => a + b, 0), [sel]);
  const selPower = useMemo(() => Object.entries(sel).reduce((s, [id, c]) => s + calcPower(id, c), 0), [sel]);
  const slowSpeed = useMemo(() => { let m = Infinity; Object.entries(sel).forEach(([id, c]) => { if (c > 0) { const u = unitGet(id); if (u) m = Math.min(m, u.stats.speed); } }); return m; }, [sel]);
  const totalCargo = useMemo(() => Object.entries(sel).reduce((s, [id, c]) => s + (unitGet(id)?.stats.cargo || 0) * c, 0), [sel]);
  const fuel = useMemo(() => selCount === 0 || slowSpeed === Infinity ? 0 : Math.floor((selCount * (100 - speed[0]) * 1.5) / 100), [selCount, slowSpeed, speed]);
  const travelT = useMemo(() => slowSpeed === Infinity || slowSpeed === 0 ? 0 : Math.floor(300 / (slowSpeed / 10000) / (speed[0] / 100)), [slowSpeed, speed]);
  const classPower = useMemo(() => { const cp: Record<string, number> = {}; Object.entries(units).forEach(([id, c]) => { const cls = unitClass(id); cp[cls] = (cp[cls] || 0) + calcPower(id, c); }); const mx = Math.max(...Object.values(cp), 1); return Object.entries(cp).map(([cls, p]) => ({ cls, p, pct: (p / mx) * 100 })).sort((a, b) => b.p - a.p); }, [units]);
  const selByClass = useMemo(() => { const g: Record<string, { id: string; count: number }[]> = {}; Object.entries(sel).forEach(([id, c]) => { if (c > 0) { const cls = unitClass(id); (g[cls] ??= []).push({ id, count: c }); } }); return g; }, [sel]);
  const filteredReports = useMemo(() => rFilter === "all" ? MOCK_REPORTS : rFilter === "victories" ? MOCK_REPORTS.filter((r) => r.result === "victory") : rFilter === "defeats" ? MOCK_REPORTS.filter((r) => r.result === "defeat") : MOCK_REPORTS.filter((r) => r.plundered > 0), [rFilter]);

  const setUnit = (id: string, v: number) => setSel((p) => ({ ...p, [id]: Math.max(0, Math.min(v, units[id] || 0)) }));
  const setPct = (id: string, pct: number) => setSel((p) => ({ ...p, [id]: Math.floor(((units[id] || 0) * pct) / 100) }));
  const loadTpl = (t: (typeof TEMPLATES)[0]) => { const s: Record<string, number> = {}; Object.entries(t.ships).forEach(([id, c]) => { s[id] = Math.min(c, units[id] || 0); }); setSel(s); setMission(t.mission); setTab("dispatch"); toast({ title: "Template loaded", description: t.name }); };
  const loadCustom = (t: { name: string; ships: Record<string, number> }) => { const s: Record<string, number> = {}; Object.entries(t.ships).forEach(([id, c]) => { s[id] = Math.min(c, units[id] || 0); }); setSel(s); setTab("dispatch"); toast({ title: "Template loaded", description: t.name }); };
  const saveCustom = () => { const filled = Object.entries(sel).filter(([, c]) => c > 0); if (!filled.length) { toast({ title: "No ships", variant: "destructive" }); return; } const n = tplName.trim() || `Custom ${customTpls.length + 1}`; setCustomTpls((p) => [...p, { name: n, ships: { ...sel } }]); setTplName(""); toast({ title: "Saved", description: n }); };
  const dispatch = () => { const comp: Record<string, number> = {}; let n = 0; Object.entries(sel).forEach(([id, c]) => { if (c > 0) { comp[id] = c; n += c; } }); if (!n) { toast({ title: "No ships selected", variant: "destructive" }); return; } if (mission === "colonize" && !comp["colonist"] && !comp["colonyShip"]) { toast({ title: "Colonist required", variant: "destructive" }); return; } sendMut.mutate({ destination: `${tgtG}:${tgtS}:${tgtP}`, missionType: mission, ships: comp }); };

  const TabBtn = ({ v, icon: Icon, label, badge }: { v: FleetTab; icon: any; label: string; badge?: number }) => (
    <TabsTrigger value={v} className="text-slate-300 data-[state=active]:bg-slate-700 data-[state=active]:text-white">
      <Icon className="w-4 h-4 mr-2" /> {label}{badge ? <Badge className="ml-2 bg-blue-600 text-white h-5">{badge}</Badge> : null}
    </TabsTrigger>
  );

  const InfoCard = ({ label, value, color }: { label: string; value: string; color: string }) => (
    <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
      <div className="text-xs text-slate-400">{label}</div>
      <div className={cn("font-mono font-bold", color)}>{value}</div>
    </div>
  );

  return (
    <GameLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="relative rounded-xl overflow-hidden shadow-lg mb-2" style={{ minHeight: 140 }}>
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-blue-950/70 to-transparent" />
          <div className="relative z-10 p-6 flex items-center gap-6">
            <div className="w-16 h-16 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center"><Rocket className="w-8 h-8 text-blue-400" /></div>
            <div><h2 className="text-3xl font-bold text-white">Fleet Command</h2><p className="text-slate-400 text-lg">Manage fleet, dispatch missions, track combat.</p></div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Rocket, label: "Total Ships", val: totalCount.toLocaleString(), color: "text-blue-400" },
            { icon: Zap, label: "Fleet Power", val: Math.floor(totalPower).toLocaleString(), color: "text-red-400" },
            { icon: Clock, label: "Active Missions", val: String(activeMissions.length), color: "text-purple-400" },
            { icon: Truck, label: "Fleet Supply", val: totalCargo.toLocaleString(), color: "text-green-400" },
          ].map((c) => (
            <Card key={c.label} className="bg-slate-900 border-slate-700/50"><CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center"><c.icon className={cn("w-5 h-5", c.color)} /></div>
                <div><div className="text-xs text-slate-400 uppercase">{c.label}</div><div className="text-xl font-bold text-white">{c.val}</div></div>
              </div>
            </CardContent></Card>
          ))}
        </div>

        <Tabs value={tab} onValueChange={(v) => setTab(v as FleetTab)} className="w-full">
          <TabsList className="bg-slate-900 border border-slate-700/50 h-12 w-full justify-start">
            <TabBtn v="overview" icon={BarChart3} label="Overview" />
            <TabBtn v="dispatch" icon={Send} label="Dispatch" />
            <TabBtn v="active" icon={Clock} label="Active Missions" badge={activeMissions.length || undefined} />
            <TabBtn v="templates" icon={Save} label="Templates" />
            <TabBtn v="reports" icon={History} label="Combat Reports" />
            <TabBtn v="stats" icon={Trophy} label="Fleet Stats" />
          </TabsList>

          <TabsContent value="overview" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-900 border-slate-700/50">
                <CardHeader><CardTitle className="text-white flex items-center gap-2"><BarChart3 className="w-5 h-5 text-blue-400" /> Power by Class</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {classPower.map(({ cls, p, pct }) => (
                    <div key={cls} className="space-y-1">
                      <div className="flex justify-between text-sm"><span className="text-slate-300 capitalize">{cls}</span><span className="text-slate-400 font-mono">{Math.floor(p).toLocaleString()}</span></div>
                      <div className="h-2 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-blue-500 rounded-full" style={{ width: `${pct}%` }} /></div>
                    </div>
                  ))}
                  {!classPower.length && <div className="text-center py-8 text-slate-500">No ships</div>}
                </CardContent>
              </Card>
              <Card className="bg-slate-900 border-slate-700/50">
                <CardHeader><CardTitle className="text-white flex items-center gap-2"><Gauge className="w-5 h-5 text-orange-400" /> Fleet Maintenance</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <InfoCard label="Metal / Hour" value={`${(totalCount * 5).toLocaleString()}`} color="text-white" />
                    <InfoCard label="Crystal / Hour" value={`${(totalCount * 2).toLocaleString()}`} color="text-white" />
                    <InfoCard label="Deuterium / Hour" value={`${totalCount}`} color="text-white" />
                    <InfoCard label="Total Power" value={Math.floor(totalPower).toLocaleString()} color="text-white" />
                  </div>
                </CardContent>
              </Card>
            </div>
            <Card className="bg-slate-900 border-slate-700/50">
              <CardHeader><CardTitle className="text-white flex items-center gap-2"><Rocket className="w-5 h-5 text-green-400" /> Ship Inventory</CardTitle></CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b border-slate-700/50">
                      {["Ship", "Class", "Count", "Power", "Speed", "Range", "Cargo"].map((h) => <th key={h} className={cn("py-3 px-2 text-slate-400 font-medium", h !== "Ship" && h !== "Class" && "text-right")}>{h}</th>)}
                    </tr></thead>
                    <tbody>
                      {unitData.map((u) => { const c = units[u.id] || 0; if (!c) return null; const pw = u.stats.attack + u.stats.shield + u.stats.structure / 10; return (
                        <tr key={u.id} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                          <td className="py-3 px-2 text-white font-medium">{u.name}</td>
                          <td className="py-3 px-2"><Badge variant="outline" className="border-slate-600 text-slate-300 text-xs capitalize">{u.class}</Badge></td>
                          <td className="py-3 px-2 text-right text-white font-mono">{c.toLocaleString()}</td>
                          <td className="py-3 px-2 text-right text-red-400 font-mono">{Math.floor(pw).toLocaleString()}</td>
                          <td className="py-3 px-2 text-right text-blue-400 font-mono">{u.stats.speed.toLocaleString()}</td>
                          <td className="py-3 px-2 text-right text-green-400 font-mono">{u.stats.speed.toLocaleString()}</td>
                          <td className="py-3 px-2 text-right text-orange-400 font-mono">{u.stats.cargo.toLocaleString()}</td>
                        </tr>); })}
                      {!totalCount && <tr><td colSpan={7} className="py-12 text-center text-slate-500">No ships available</td></tr>}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dispatch" className="mt-6 space-y-6">
            <Card className="bg-slate-900 border-slate-700/50">
              <CardHeader><CardTitle className="text-white flex items-center gap-2"><Target className="w-5 h-5 text-red-400" /> Mission Type</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                  {(Object.entries(MISSION_CONFIG) as [MissionType, typeof MISSION_CONFIG[MissionType]][]).map(([k, cfg]) => {
                    const I = cfg.icon; return (
                      <Button key={k} variant="outline" className={cn("h-auto py-4 flex flex-col items-center gap-2 border transition-all", mission === k ? cfg.bg + " text-white border-current" : "bg-slate-800/50 border-slate-700/50 text-slate-400 hover:bg-slate-800")} onClick={() => setMission(k)}>
                        <I className={cn("w-6 h-6", mission === k ? cfg.color : "")} /><span className="text-xs font-medium">{cfg.label}</span>
                      </Button>);
                  })}
                </div>
              </CardContent>
            </Card>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 bg-slate-900 border-slate-700/50">
                <CardHeader><div className="flex items-center justify-between"><CardTitle className="text-white flex items-center gap-2"><Rocket className="w-5 h-5 text-blue-400" /> Fleet Selection</CardTitle>
                  <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white" onClick={() => setSel({})}>Clear All</Button>
                </div></CardHeader>
                <CardContent><ScrollArea className="h-[400px]"><div className="space-y-3">
                  {Object.entries(units).map(([id, count]) => { if (!count) return null; const u = unitGet(id); if (!u) return null; const s = sel[id] || 0; const pw = u.stats.attack + u.stats.shield + u.stats.structure / 10; return (
                    <div key={id} className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                      <div className="flex items-center justify-between mb-2">
                        <div><div className="text-white font-medium text-sm">{u.name}</div><div className="text-xs text-slate-400">Power: <span className="text-red-400">{Math.floor(pw).toLocaleString()}</span> · Speed: <span className="text-blue-400">{u.stats.speed.toLocaleString()}</span> · Cargo: <span className="text-orange-400">{u.stats.cargo.toLocaleString()}</span></div></div>
                        <div className="text-right"><div className="text-xs text-slate-400">{count.toLocaleString()} avail</div><div className="text-sm font-bold text-white">{s} sel</div></div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Slider value={[s]} max={count} step={1} onValueChange={(v) => setUnit(id, v[0])} className="flex-1" />
                        <div className="flex gap-1">{[25, 50, 75, 100].map((p) => <Button key={p} variant="ghost" size="sm" className="h-6 px-2 text-xs text-slate-400 hover:text-white" onClick={() => setPct(id, p)}>{p}%</Button>)}</div>
                      </div>
                    </div>); })}
                  {!totalCount && <div className="text-center py-12 text-slate-500">No ships</div>}
                </div></ScrollArea></CardContent>
              </Card>
              <div className="space-y-4">
                <Card className="bg-slate-900 border-slate-700/50">
                  <CardHeader><CardTitle className="text-white flex items-center gap-2"><Globe className="w-5 h-5 text-blue-400" /> Target</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-2">
                      <div><label className="text-xs text-slate-400 uppercase">Galaxy</label><Input value={tgtG} onChange={(e) => setTgtG(e.target.value)} className="bg-slate-800 border-slate-700 text-white font-mono" /></div>
                      <div><label className="text-xs text-slate-400 uppercase">System</label><Input value={tgtS} onChange={(e) => setTgtS(e.target.value)} className="bg-slate-800 border-slate-700 text-white font-mono" /></div>
                      <div><label className="text-xs text-slate-400 uppercase">Planet</label><Input value={tgtP} onChange={(e) => setTgtP(e.target.value)} className="bg-slate-800 border-slate-700 text-white font-mono" /></div>
                    </div>
                    <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50 text-center">
                      <div className="text-xs text-slate-400 mb-1">Target</div>
                      <div className="text-lg font-mono font-bold text-white">[{tgtG}:{tgtS}:{tgtP}]</div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-slate-900 border-slate-700/50">
                  <CardHeader><CardTitle className="text-white flex items-center gap-2"><Gauge className="w-5 h-5 text-green-400" /> Speed & Cost</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <Slider value={speed} max={100} step={10} onValueChange={setSpeed} />
                    <div className="flex justify-between text-xs text-slate-400"><span>10% Slow</span><span className="text-white font-bold">{speed[0]}%</span><span>100% Fast</span></div>
                    <Separator className="bg-slate-700/50" />
                    <InfoCard label="Travel Time" value={`${travelT}s`} color="text-white" />
                    <InfoCard label="Fuel Cost" value={`${fuel.toLocaleString()} D`} color="text-blue-400" />
                    <InfoCard label="Cargo" value={totalCargo.toLocaleString()} color="text-orange-400" />
                  </CardContent>
                </Card>
                <Card className="bg-slate-900 border-slate-700/50">
                  <CardHeader><CardTitle className="text-white flex items-center gap-2"><Zap className="w-5 h-5 text-yellow-400" /> Summary</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-3"><InfoCard label="Ships" value={String(selCount)} color="text-white" /><InfoCard label="Power" value={Math.floor(selPower).toLocaleString()} color="text-red-400" /></div>
                    {selCount > 0 && <div className="space-y-1">{Object.entries(selByClass).map(([cls, ships]) => <div key={cls} className="text-xs text-slate-400 capitalize">{cls}: {ships.map((s) => `${unitName(s.id)} x${s.count}`).join(", ")}</div>)}</div>}
                  </CardContent>
                </Card>
                {selPower < 1000 && selCount > 0 && <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-red-400 shrink-0" /><span className="text-xs text-red-300">Fleet power is very low.</span></div>}
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 text-lg" onClick={dispatch} disabled={!selCount || sendMut.isPending}><Send className="w-5 h-5 mr-2" /> {sendMut.isPending ? "LAUNCHING..." : "CONFIRM DISPATCH"}</Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="active" className="mt-6">
            {!activeMissions.length ? (
              <Card className="bg-slate-900 border-slate-700/50"><CardContent className="py-20 text-center"><Clock className="w-16 h-16 mx-auto mb-4 text-slate-600" /><h3 className="text-xl font-bold text-white mb-2">No Active Missions</h3><p className="text-slate-400">Fleet command is idle.</p></CardContent></Card>
            ) : (
              <div className="space-y-4">
                {activeMissions.map((m) => {
                  const now = Date.now(); const isRet = m.status === "return" || now > m.arrivalTime;
                  const endT = isRet ? m.returnTime : m.arrivalTime; const elapsed = now - ((m as any).departureTime || m.arrivalTime - 60000);
                  const total = isRet ? m.returnTime - m.arrivalTime : m.arrivalTime - ((m as any).departureTime || m.arrivalTime - 60000);
                  const prog = Math.max(0, Math.min(100, (elapsed / Math.max(total, 1)) * 100));
                  const eta = Math.max(0, Math.ceil((endT - now) / 1000));
                  const sc = Object.values(m.units).reduce((a: number, b: any) => a + b, 0);
                  const pw = Object.entries(m.units).reduce((s: number, [id, c]: [string, any]) => s + calcPower(id, c), 0);
                  const cfg = MISSION_CONFIG[m.type as MissionType] || MISSION_CONFIG.attack; const I = cfg.icon;
                  return (
                    <Card key={m.id} className="bg-slate-900 border-slate-700/50">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center", cfg.bg)}><I className={cn("w-6 h-6", cfg.color)} /></div>
                            <div><div className="flex items-center gap-2"><span className="font-bold text-white uppercase text-sm">{m.type} Mission</span><Badge variant="outline" className={isRet ? "border-blue-500/50 text-blue-400" : "border-red-500/50 text-red-400"}>{isRet ? "Returning" : "En Route"}</Badge></div><div className="text-sm text-slate-400">Target: [{m.target}]</div></div>
                          </div>
                          <div className="text-right"><div className="text-3xl font-mono font-bold text-white">{eta}s</div><div className="text-xs text-slate-400">ETA</div></div>
                        </div>
                        <div className="space-y-1 mb-4"><div className="flex justify-between text-xs text-slate-400"><span>Origin</span><span>{isRet ? "Home" : "Target"}</span></div><Progress value={prog} className="h-2 bg-slate-800" /></div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                          <InfoCard label="Power" value={Math.floor(pw).toLocaleString()} color="text-white" />
                          <InfoCard label="Ships" value={String(sc)} color="text-white" />
                          <InfoCard label="Departure" value={new Date((m as any).departureTime || m.arrivalTime - 60000).toLocaleTimeString()} color="text-white" />
                          <InfoCard label="Arrival" value={new Date(m.arrivalTime).toLocaleTimeString()} color="text-white" />
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800" onClick={() => setExpandM(expandM === m.id ? null : m.id)}>
                            {expandM === m.id ? <ChevronUp className="w-4 h-4 mr-1" /> : <ChevronDown className="w-4 h-4 mr-1" />}Details
                          </Button>
                          {!isRet && <><Button variant="outline" size="sm" className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10"><Zap className="w-4 h-4 mr-1" /> Speed Up</Button><Button variant="outline" size="sm" className="border-red-500/50 text-red-400 hover:bg-red-500/10"><RotateCcw className="w-4 h-4 mr-1" /> Recall</Button></>}
                        </div>
                        {expandM === m.id && <div className="mt-4 pt-4 border-t border-slate-700/50 space-y-2"><div className="text-xs text-slate-400 uppercase font-medium mb-2">Fleet Composition</div>{Object.entries(m.units).map(([id, c]) => <div key={id} className="flex justify-between text-sm"><span className="text-slate-300">{unitName(id)}</span><span className="text-white font-mono">{c as number}</span></div>)}</div>}
                      </CardContent>
                    </Card>); })}
              </div>)}
          </TabsContent>

          <TabsContent value="templates" className="mt-6 space-y-6">
            <Card className="bg-slate-900 border-slate-700/50">
              <CardHeader><CardTitle className="text-white flex items-center gap-2"><Save className="w-5 h-5 text-yellow-400" /> Pre-built Templates</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {TEMPLATES.map((t) => { const I = t.icon; const cfg = MISSION_CONFIG[t.mission]; const ts = Object.values(t.ships).reduce((a, b) => a + b, 0); const tp = Object.entries(t.ships).reduce((s, [id, c]) => s + calcPower(id, c), 0); return (
                    <Card key={t.id} className="bg-slate-800/50 border-slate-700/50 hover:border-slate-600 transition-colors cursor-pointer" onClick={() => loadTpl(t)}>
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-center justify-between"><div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", cfg.bg)}><I className={cn("w-5 h-5", cfg.color)} /></div><Badge variant="outline" className={cn("text-xs border-current", cfg.color)}>{cfg.label}</Badge></div>
                        <div><div className="text-white font-bold text-sm">{t.name}</div><div className="text-xs text-slate-400">{ts} ships · {Math.floor(tp).toLocaleString()} power</div></div>
                        <div className="space-y-1">{Object.entries(t.ships).slice(0, 3).map(([id, c]) => <div key={id} className="flex justify-between text-xs"><span className="text-slate-400">{unitName(id)}</span><span className="text-slate-300 font-mono">{c}</span></div>)}</div>
                        <Button variant="outline" size="sm" className="w-full border-slate-600 text-slate-300 hover:text-white"><Download className="w-3 h-3 mr-1" /> Load</Button>
                      </CardContent>
                    </Card>); })}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-slate-900 border-slate-700/50">
              <CardHeader><CardTitle className="text-white flex items-center gap-2"><Plus className="w-5 h-5 text-green-400" /> Custom Templates</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2"><Input value={tplName} onChange={(e) => setTplName(e.target.value)} placeholder="Template name..." className="bg-slate-800 border-slate-700 text-white" /><Button className="bg-green-600 hover:bg-green-700 text-white" onClick={saveCustom}><Save className="w-4 h-4 mr-1" /> Save</Button></div>
                {customTpls.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {customTpls.map((t, i) => { const ts = Object.values(t.ships).reduce((a, b) => a + b, 0); const tp = Object.entries(t.ships).reduce((s, [id, c]) => s + calcPower(id, c), 0); return (
                      <Card key={i} className="bg-slate-800/50 border-slate-700/50 cursor-pointer hover:border-slate-600 transition-colors" onClick={() => loadCustom(t)}>
                        <CardContent className="p-4 space-y-2"><div className="text-white font-bold">{t.name}</div><div className="text-xs text-slate-400">{ts} ships · {Math.floor(tp).toLocaleString()} power</div><Button variant="outline" size="sm" className="w-full border-slate-600 text-slate-300"><Download className="w-3 h-3 mr-1" /> Load</Button></CardContent>
                      </Card>); })}
                  </div>) : <div className="text-center py-8 text-slate-500">Select ships in Dispatch tab, then save.</div>}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="mt-6 space-y-6">
            <div className="flex gap-2">{(["all", "victories", "defeats", "raids"] as const).map((f) => <Button key={f} variant="outline" size="sm" className={cn("border-slate-700 capitalize", rFilter === f ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white")} onClick={() => setRFilter(f)}>{f}</Button>)}</div>
            <div className="space-y-4">
              {filteredReports.map((r) => (
                <Card key={r.id} className="bg-slate-900 border-slate-700/50">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center", r.result === "victory" ? "bg-green-500/20" : "bg-red-500/20")}>{r.result === "victory" ? <Trophy className="w-6 h-6 text-green-400" /> : <Skull className="w-6 h-6 text-red-400" />}</div>
                        <div><div className="flex items-center gap-2"><span className="font-bold text-white uppercase text-sm">{r.result}</span><Badge variant="outline" className={r.result === "victory" ? "border-green-500/50 text-green-400" : "border-red-500/50 text-red-400"}>{r.result === "victory" ? "Victory" : "Defeat"}</Badge></div><div className="text-sm text-slate-400">[{r.target}] · {r.date}</div></div>
                      </div>
                      <div className="text-right"><div className="text-lg font-bold text-white">{Math.floor(r.power).toLocaleString()}</div><div className="text-xs text-slate-400">Power</div></div>
                    </div>
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <InfoCard label="Ships Lost" value={String(r.shipsLost)} color="text-red-400" />
                      <InfoCard label="Plundered" value={r.plundered.toLocaleString()} color="text-green-400" />
                      <InfoCard label="Fleet Size" value={String(Object.values(r.ships).reduce((a, b) => a + b, 0))} color="text-white" />
                    </div>
                    <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white" onClick={() => setExpandR(expandR === r.id ? null : r.id)}>
                      {expandR === r.id ? <ChevronUp className="w-4 h-4 mr-1" /> : <ChevronDown className="w-4 h-4 mr-1" />}Battle Log
                    </Button>
                    {expandR === r.id && <div className="mt-4 pt-4 border-t border-slate-700/50 space-y-2">
                      <div className="text-xs text-slate-400 uppercase font-medium mb-2">Composition</div>
                      {Object.entries(r.ships).map(([id, c]) => <div key={id} className="flex justify-between text-sm"><span className="text-slate-300">{unitName(id)}</span><span className="text-white font-mono">{c}</span></div>)}
                      <Separator className="bg-slate-700/50 my-3" />
                      <div className="text-xs text-slate-400 uppercase font-medium mb-2">Battle Log</div>
                      {r.log.map((l, i) => <div key={i} className="text-sm text-slate-300 bg-slate-800/30 p-2 rounded">{l}</div>)}
                    </div>}
                  </CardContent>
                </Card>))}
              {!filteredReports.length && <Card className="bg-slate-900 border-slate-700/50"><CardContent className="py-12 text-center"><History className="w-12 h-12 mx-auto mb-4 text-slate-600" /><p className="text-slate-400">No reports</p></CardContent></Card>}
            </div>
          </TabsContent>

          <TabsContent value="stats" className="mt-6 space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[{ v: totalCount.toLocaleString(), l: "Total Ships Built", c: "text-white" }, { v: "28", l: "Total Destroyed", c: "text-red-400" }, { v: "3", l: "Total Battles", c: "text-purple-400" }, { v: "67%", l: "Win/Loss Ratio", c: "text-green-400" }].map((s) => (
                <Card key={s.l} className="bg-slate-900 border-slate-700/50"><CardContent className="p-4 text-center"><div className={cn("text-3xl font-bold", s.c)}>{s.v}</div><div className="text-xs text-slate-400 uppercase mt-1">{s.l}</div></CardContent></Card>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-900 border-slate-700/50">
                <CardHeader><CardTitle className="text-white flex items-center gap-2"><BarChart3 className="w-5 h-5 text-blue-400" /> Fleet Power Over Time</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {[{ w: "Week 1", p: 8500 }, { w: "Week 2", p: 12400 }, { w: "Week 3", p: 18200 }, { w: "Week 4", p: totalPower }].map(({ w, p }) => (
                    <div key={w} className="space-y-1"><div className="flex justify-between text-sm"><span className="text-slate-400">{w}</span><span className="text-white font-mono">{Math.floor(p).toLocaleString()}</span></div><div className="h-2 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full" style={{ width: `${(p / Math.max(totalPower, 1)) * 100}%` }} /></div></div>
                  ))}
                </CardContent>
              </Card>
              <Card className="bg-slate-900 border-slate-700/50">
                <CardHeader><CardTitle className="text-white flex items-center gap-2"><Swords className="w-5 h-5 text-red-400" /> Combat Efficiency</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50 text-center"><div className="text-5xl font-bold text-green-400 mb-2">B+</div><div className="text-xs text-slate-400 uppercase">Combat Rating</div></div>
                  <div className="space-y-3">
                    {[{ l: "Most Used Ship", v: "Viper", p: 78, c: "bg-green-500" }, { l: "Attack Success", v: "67%", p: 67, c: "bg-blue-500" }, { l: "Espionage Success", v: "100%", p: 100, c: "bg-purple-500" }].map((s) => (
                      <div key={s.l} className="space-y-1"><div className="flex justify-between text-sm"><span className="text-slate-400">{s.l}</span><span className="text-white">{s.v}</span></div><div className="h-2 bg-slate-800 rounded-full overflow-hidden"><div className={cn("h-full rounded-full", s.c)} style={{ width: `${s.p}%` }} /></div></div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </GameLayout>
  );
}
