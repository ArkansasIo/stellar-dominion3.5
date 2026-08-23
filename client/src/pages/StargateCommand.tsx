import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  BadgeDollarSign,
  Banknote,
  Crosshair,
  Eye,
  FlaskConical,
  LockKeyhole,
  Radar,
  ShieldAlert,
  Swords,
  TimerReset,
  Users,
  Vault,
  Zap,
} from "lucide-react";
import GameLayout from "@/components/layout/GameLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { apiRequest, queryClient } from "@/lib/queryClient";

type Race = "asgard" | "goauld" | "replicator" | "tauri";
type Defcon = "none" | "low" | "medium" | "high" | "critical";

type StrategicSnapshot = {
  strategic: {
    race: Race;
    defcon: Defcon;
    attackTurns: number;
    marketTurns: number;
    unitProduction: number;
    spyLevel: number;
    antiSpyLevel: number;
    technologies: Record<string, number>;
    glory: number;
    reputation: number;
    ascensionPoints: number;
    ascensionLevel: number;
    logs: Array<{ id: string; createdAt: number; kind: string; title: string; summary: string }>;
  };
  resources: { naquadah: number; bankedNaquadah: number };
  personnel: Record<string, number>;
  metrics: {
    naturalIncome: number;
    bankCapacity: number;
    strikeAction: number;
    defenseAction: number;
    covertAction: number;
    antiCovertAction: number;
    overallRank: number;
    nextUnitProductionCost: number;
    turnIntervalMinutes: number;
    turnGenerationThreshold: number;
    turnStorageCap: number;
  };
  processedTurns?: number;
};

type StrategicOperationResult = StrategicSnapshot & {
  state?: StrategicSnapshot;
  victory?: boolean;
  success?: boolean;
  processedTurns?: number;
};

const numberFormat = new Intl.NumberFormat("en-US");
const formatNumber = (value: number | undefined) => numberFormat.format(Math.max(0, Math.floor(value || 0)));

const RACE_DETAILS: Array<{ id: Race; name: string; focus: string; description: string; tone: string }> = [
  { id: "asgard", name: "Asgard", focus: "+25% Defense", description: "Fortress doctrine that strengthens defensive action.", tone: "border-sky-300 bg-sky-50/90" },
  { id: "goauld", name: "Goa'uld", focus: "+25% Income", description: "Extraction doctrine that increases natural Naquadah income.", tone: "border-amber-300 bg-amber-50/90" },
  { id: "replicator", name: "Replicator", focus: "+25% Covert", description: "Infiltration doctrine that empowers covert operations.", tone: "border-violet-300 bg-violet-50/90" },
  { id: "tauri", name: "Tau'ri", focus: "+25% Offense", description: "Expeditionary doctrine that amplifies strike action.", tone: "border-rose-300 bg-rose-50/90" },
];

const TRAINING: Array<{ type: string; label: string; description: string; key: string; icon: typeof Users }> = [
  { type: "miner", label: "Miners", description: "Economic workforce; each generates 80 Naquadah per turn.", key: "miners", icon: BadgeDollarSign },
  { type: "lifer", label: "Lifers", description: "Permanent workforce cadres; convert 10 Miners to generate 800 Naquadah per turn through Ascension.", key: "lifers", icon: BadgeDollarSign },
  { type: "attackTroop", label: "Attack Troops", description: "Offensive personnel requiring attack weapons.", key: "attackTroops", icon: Swords },
  { type: "defenseTroop", label: "Defense Troops", description: "Garrison personnel requiring defense weapons.", key: "defenseTroops", icon: ShieldAlert },
  { type: "covertAgent", label: "Covert Agents", description: "Reconnaissance and infiltration specialists.", key: "covertAgents", icon: Eye },
  { type: "antiIntelAgent", label: "Counter-Intelligence", description: "Defends the realm from hostile intelligence.", key: "antiIntelAgents", icon: LockKeyhole },
  { type: "attackWeapon", label: "Attack Weapons", description: "Arm offensive troops and improve strike action.", key: "attackWeapons", icon: Crosshair },
];

const TECHNOLOGIES = [
  { id: "offense", label: "Offense Technology", icon: Swords },
  { id: "defense", label: "Defense Technology", icon: ShieldAlert },
  { id: "covert", label: "Covert Technology", icon: Eye },
  { id: "antiCovert", label: "Anti-Covert Technology", icon: LockKeyhole },
  { id: "unique", label: "Unique Technology", icon: Zap },
  { id: "mercenary", label: "Mercenary Technology", icon: Users },
];

export default function StargateCommand() {
  const [bankAmount, setBankAmount] = useState("1000");
  const [targetUserId, setTargetUserId] = useState("");
  const [raidTurns, setRaidTurns] = useState("3");
  const [trainingAmount, setTrainingAmount] = useState("1");
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery<StrategicSnapshot>({
    queryKey: ["/api/stargate/state"],
    queryFn: async () => (await apiRequest("GET", "/api/stargate/state")).json(),
  });

  const strategicMutation = useMutation({
    mutationFn: async ({ path, body }: { path: string; body?: Record<string, unknown> }) => {
      const response = await apiRequest("POST", path, body);
      return response.json();
    },
    onSuccess: (result: StrategicOperationResult) => {
      queryClient.setQueryData(["/api/stargate/state"], result.state || result);
      queryClient.invalidateQueries({ queryKey: ["/api/stargate/state"] });
      if (typeof result.victory === "boolean") setActionMessage(result.victory ? "Raid successful. Battle report logged." : "Raid repelled. Battle report logged.");
      else if (typeof result.success === "boolean") setActionMessage(result.success ? "Intelligence report received." : "Reconnaissance was blocked.");
      else if (result.processedTurns) setActionMessage(`${result.processedTurns} strategic turn(s) processed.`);
      else setActionMessage("Strategic order completed.");
    },
    onError: (mutationError: Error) => setActionMessage(mutationError.message.replace(/^\d+:\s*/, "")),
  });

  const metrics = data?.metrics as StrategicSnapshot["metrics"];
  const personnel = data?.personnel ?? {};
  const strategic = data?.strategic as StrategicSnapshot["strategic"];
  const turnProgress = useMemo(() => strategic ? Math.min(100, (strategic.attackTurns / metrics!.turnStorageCap) * 100) : 0, [strategic, metrics]);

  const runOrder = (path: string, body?: Record<string, unknown>) => strategicMutation.mutate({ path, body });

  if (isLoading) {
    return <GameLayout><div className="p-8 text-slate-300 font-rajdhani">Connecting to Stargate Command...</div></GameLayout>;
  }

  if (!data || error) {
    return <GameLayout><div className="p-8 text-red-300 font-rajdhani">Strategic command is unavailable: {(error as Error)?.message || "No strategic state returned."}</div></GameLayout>;
  }

  return (
    <GameLayout>
      <div className="sd-win-command space-y-6 pb-10">
        <section className="sd-win-window rounded-2xl border border-cyan-500/35 bg-[radial-gradient(circle_at_top_right,_rgba(8,145,178,0.24),_transparent_37%),linear-gradient(135deg,_rgba(8,15,34,0.98),_rgba(20,25,50,0.92))] p-6 shadow-2xl shadow-cyan-950/30">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-cyan-300"><Radar className="h-5 w-5" /><span className="font-mono text-xs uppercase tracking-[0.3em]">Strategic Layer Online</span></div>
              <h1 className="font-orbitron text-3xl font-bold tracking-tight text-white">Stargate Command</h1>
              <p className="mt-2 max-w-2xl font-rajdhani text-base text-slate-300">Develop an asymmetric realm through thirty-minute turns, Naquadah allocation, troop doctrine, covert pressure, and protected reserves.</p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-xl border border-cyan-400/20 bg-slate-950/45 px-4 py-3"><div className="text-[10px] uppercase tracking-widest text-cyan-300">Doctrine</div><div className="mt-1 font-orbitron text-sm capitalize text-white">{strategic.race}</div></div>
              <div className="rounded-xl border border-cyan-400/20 bg-slate-950/45 px-4 py-3"><div className="text-[10px] uppercase tracking-widest text-cyan-300">DefCon</div><div className="mt-1 font-orbitron text-sm capitalize text-white">{strategic.defcon}</div></div>
              <div className="rounded-xl border border-cyan-400/20 bg-slate-950/45 px-4 py-3"><div className="text-[10px] uppercase tracking-widest text-cyan-300">Glory</div><div className="mt-1 font-orbitron text-sm text-white">{formatNumber(strategic.glory)}</div></div>
              <div className="rounded-xl border border-cyan-400/20 bg-slate-950/45 px-4 py-3"><div className="text-[10px] uppercase tracking-widest text-cyan-300">Rank Score</div><div className="mt-1 font-orbitron text-sm text-white">{formatNumber(metrics.overallRank)}</div></div>
            </div>
          </div>
          {actionMessage && <div className="mt-5 rounded-lg border border-cyan-400/25 bg-cyan-950/35 px-4 py-3 font-rajdhani text-sm text-cyan-100">{actionMessage}</div>}
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Available Naquadah" value={formatNumber(data.resources.naquadah)} helper={`+${formatNumber(metrics.naturalIncome)} per turn`} icon={BadgeDollarSign} tone="text-amber-300" />
          <MetricCard label="Protected Vault" value={formatNumber(data.resources.bankedNaquadah)} helper={`${formatNumber(metrics.bankCapacity)} capacity`} icon={Vault} tone="text-cyan-300" />
          <MetricCard label="Attack Turns" value={formatNumber(strategic.attackTurns)} helper={`Generation under ${formatNumber(metrics.turnGenerationThreshold)}`} icon={TimerReset} tone="text-rose-300" />
          <MetricCard label="Untrained Personnel" value={formatNumber(personnel.untrained)} helper={`UP ${formatNumber(strategic.unitProduction)} / strategic turn`} icon={Users} tone="text-violet-300" />
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
          <Card className="sd-win-window border-slate-700/80 bg-slate-950/75 text-slate-100">
            <CardHeader><CardTitle className="font-orbitron text-lg">Realm Doctrine & Alert State</CardTitle><CardDescription className="text-slate-400">Doctrine determines your primary 25% strategic advantage. DefCon trades income for counter-intelligence.</CardDescription></CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-3 sm:grid-cols-2">
                {RACE_DETAILS.map((race) => <button key={race.id} onClick={() => runOrder("/api/stargate/race", { race: race.id })} disabled={strategicMutation.isPending} className={`rounded-xl border p-4 text-left transition hover:-translate-y-0.5 disabled:opacity-50 ${race.tone} ${strategic.race === race.id ? "ring-2 ring-white/70" : "opacity-80 hover:opacity-100"}`}><div className="flex items-center justify-between"><span className="font-orbitron text-sm text-white">{race.name}</span>{strategic.race === race.id && <Badge className="bg-white text-slate-900">Active</Badge>}</div><div className="mt-2 text-sm font-semibold text-white">{race.focus}</div><div className="mt-1 text-xs text-slate-300">{race.description}</div></button>)}
              </div>
              <div className="flex flex-col gap-3 rounded-xl border border-slate-700 bg-slate-900/60 p-4 sm:flex-row sm:items-center sm:justify-between"><div><div className="font-rajdhani text-sm font-bold uppercase tracking-wider text-white">Realm alert protocol</div><div className="text-xs text-slate-400">Critical alert cuts income by 70% but maximizes counter-intelligence.</div></div><Select value={strategic.defcon} onValueChange={(defcon) => runOrder("/api/stargate/defcon", { defcon })}><SelectTrigger aria-label="Select realm alert protocol" className="w-full border-slate-600 bg-slate-950 sm:w-44"><SelectValue /></SelectTrigger><SelectContent>{["none", "low", "medium", "high", "critical"].map((level) => <SelectItem key={level} value={level} className="capitalize">{level}</SelectItem>)}</SelectContent></Select></div>
            </CardContent>
          </Card>

          <Card className="sd-win-window border-slate-700/80 bg-slate-950/75 text-slate-100"><CardHeader><CardTitle className="font-orbitron text-lg">Turn Reserve</CardTitle><CardDescription className="text-slate-400">A 30-minute tick awards income, personnel, and attack turns.</CardDescription></CardHeader><CardContent className="space-y-4"><div className="flex justify-between font-rajdhani text-sm"><span>Attack-turn reserve</span><span>{formatNumber(strategic.attackTurns)} / {formatNumber(metrics.turnStorageCap)}</span></div><Progress aria-label="Attack-turn reserve utilization" value={turnProgress} className="h-3 bg-slate-800" /><Button className="w-full bg-cyan-600 hover:bg-cyan-500" disabled={strategicMutation.isPending} onClick={() => runOrder("/api/stargate/tick")}><TimerReset className="mr-2 h-4 w-4" />Process available turns</Button><div className="grid grid-cols-2 gap-3 text-sm"><div className="rounded-lg bg-slate-900 p-3"><div className="text-xs text-slate-500">Market Turns</div><div className="mt-1 font-orbitron text-lg">{formatNumber(strategic.marketTurns)}</div></div><div className="rounded-lg bg-slate-900 p-3"><div className="text-xs text-slate-500">Ascension Points</div><div className="mt-1 font-orbitron text-lg">{formatNumber(strategic.ascensionPoints)}</div></div></div></CardContent></Card>
        </section>

        <section className="grid gap-6 xl:grid-cols-3">
          <Card className="border-slate-700/80 bg-slate-950/75 text-slate-100 xl:col-span-2"><CardHeader><CardTitle className="font-orbitron text-lg">Personnel & Armory</CardTitle><CardDescription className="text-slate-400">Convert untrained personnel into economic, military, and intelligence capacity. Weapons cost Naquadah.</CardDescription></CardHeader><CardContent><div className="mb-4 flex items-center gap-3"><Label htmlFor="training-quantity" className="text-slate-400">Order quantity</Label><Input id="training-quantity" type="number" min="1" value={trainingAmount} onChange={(event) => setTrainingAmount(event.target.value)} className="w-28 border-slate-700 bg-slate-900" /></div><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{TRAINING.map((item) => { const Icon = item.icon; return <div key={item.type} className="rounded-xl border border-slate-700 bg-slate-900/55 p-4"><div className="flex items-start justify-between"><Icon className="h-5 w-5 text-cyan-300" /><span className="font-orbitron text-lg text-white">{formatNumber(personnel[item.key])}</span></div><div className="mt-3 font-rajdhani font-bold text-white">{item.label}</div><p className="mt-1 min-h-10 text-xs text-slate-400">{item.description}</p><Button variant="outline" className="mt-4 w-full border-slate-600 bg-slate-950 hover:bg-slate-800" disabled={strategicMutation.isPending} onClick={() => runOrder("/api/stargate/train", { type: item.type, quantity: Number(trainingAmount) })}>Train</Button></div>})}</div><div className="mt-4 rounded-lg border border-dashed border-slate-700 p-3 text-xs text-slate-400">Elite units are upgraded from their regular troop types: five attack troops form one elite attacker, and five defense troops form one elite defender.</div></CardContent></Card>

          <Card className="sd-win-window border-slate-700/80 bg-slate-950/75 text-slate-100"><CardHeader><CardTitle className="font-orbitron text-lg">Vault Controls</CardTitle><CardDescription className="text-slate-400">Banked Naquadah is protected from ordinary raid loot.</CardDescription></CardHeader><CardContent className="space-y-4"><div className="rounded-xl border border-cyan-400/20 bg-cyan-950/20 p-4"><div className="text-xs uppercase tracking-wider text-cyan-200">Vault utilization</div><div className="mt-2 flex justify-between text-sm"><span>{formatNumber(data.resources.bankedNaquadah)}</span><span>{formatNumber(metrics.bankCapacity)}</span></div><Progress aria-label="Vault capacity utilization" value={metrics.bankCapacity ? (data.resources.bankedNaquadah / metrics.bankCapacity) * 100 : 0} className="mt-2 h-2 bg-slate-800" /></div><Label htmlFor="bank-amount" className="text-slate-400">Naquadah amount</Label><Input id="bank-amount" type="number" min="1" value={bankAmount} onChange={(event) => setBankAmount(event.target.value)} className="border-slate-700 bg-slate-900" /><div className="grid grid-cols-2 gap-3"><Button className="bg-cyan-700 hover:bg-cyan-600" disabled={strategicMutation.isPending} onClick={() => runOrder("/api/stargate/bank", { direction: "deposit", amount: Number(bankAmount) })}><Banknote className="mr-2 h-4 w-4" />Deposit</Button><Button variant="outline" className="border-slate-600 bg-slate-950 hover:bg-slate-800" disabled={strategicMutation.isPending} onClick={() => runOrder("/api/stargate/bank", { direction: "withdraw", amount: Number(bankAmount) })}>Withdraw</Button></div></CardContent></Card>
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <Card className="sd-win-window border-slate-700/80 bg-slate-950/75 text-slate-100"><CardHeader><CardTitle className="font-orbitron text-lg">Strategic Technologies</CardTitle><CardDescription className="text-slate-400">Each level supplies a 10% multiplier to the corresponding action.</CardDescription></CardHeader><CardContent className="grid gap-3 sm:grid-cols-2">{TECHNOLOGIES.map((technology) => { const Icon = technology.icon; const level = strategic.technologies[technology.id] || 0; return <div key={technology.id} className="rounded-lg border border-slate-700 bg-slate-900/50 p-3"><div className="flex items-center justify-between"><span className="flex items-center gap-2 text-sm font-semibold"><Icon className="h-4 w-4 text-violet-300" />{technology.label}</span><Badge variant="outline" className="border-slate-600 text-slate-200">L{level}</Badge></div><Button size="sm" variant="outline" className="mt-3 w-full border-slate-600 bg-slate-950 hover:bg-slate-800" disabled={strategicMutation.isPending} onClick={() => runOrder("/api/stargate/technology", { technology: technology.id })}><FlaskConical className="mr-2 h-3.5 w-3.5" />Upgrade</Button></div>})}<div className="col-span-full rounded-lg bg-slate-900 p-3 text-xs text-slate-400">Next Unit Production upgrade: <span className="font-semibold text-amber-300">{formatNumber(metrics.nextUnitProductionCost)} Naquadah</span><Button size="sm" className="ml-3 bg-amber-600 hover:bg-amber-500" disabled={strategicMutation.isPending} onClick={() => runOrder("/api/stargate/unit-production")}>Upgrade UP</Button></div></CardContent></Card>

          <Card className="sd-win-window border-slate-700/80 bg-slate-950/75 text-slate-100"><CardHeader><CardTitle className="font-orbitron text-lg">Operations Console</CardTitle><CardDescription className="text-slate-400">Enter a target player ID for deterministic raid or reconnaissance resolution.</CardDescription></CardHeader><CardContent className="space-y-4"><Label htmlFor="target-realm" className="text-slate-400">Target user ID</Label><Input id="target-realm" value={targetUserId} onChange={(event) => setTargetUserId(event.target.value)} placeholder="Target player UUID" className="border-slate-700 bg-slate-900" /><div className="grid gap-3 sm:grid-cols-[1fr_auto]"><Input aria-label="Attack turns committed to this raid" type="number" min="1" max="15" value={raidTurns} onChange={(event) => setRaidTurns(event.target.value)} className="border-slate-700 bg-slate-900" /><span className="flex items-center text-xs text-slate-500">Attack turns (1–15)</span></div><div className="grid gap-3 sm:grid-cols-2"><Button className="bg-rose-700 hover:bg-rose-600" disabled={strategicMutation.isPending || !targetUserId.trim()} onClick={() => runOrder("/api/stargate/raid", { targetUserId: targetUserId.trim(), turns: Number(raidTurns) })}><Swords className="mr-2 h-4 w-4" />Launch Raid</Button><Button variant="outline" className="border-violet-500/50 bg-violet-950/25 hover:bg-violet-900/50" disabled={strategicMutation.isPending || !targetUserId.trim()} onClick={() => runOrder("/api/stargate/recon", { targetUserId: targetUserId.trim() })}><Eye className="mr-2 h-4 w-4" />Recon</Button></div><div className="grid grid-cols-2 gap-3 pt-2"><PowerReadout label="Strike Action" value={metrics.strikeAction} icon={Crosshair} tone="text-rose-300" /><PowerReadout label="Defense Action" value={metrics.defenseAction} icon={ShieldAlert} tone="text-cyan-300" /><PowerReadout label="Covert Action" value={metrics.covertAction} icon={Eye} tone="text-violet-300" /><PowerReadout label="Anti-Covert" value={metrics.antiCovertAction} icon={LockKeyhole} tone="text-emerald-300" /></div></CardContent></Card>
        </section>

        <Card className="sd-win-window border-slate-700/80 bg-slate-950/75 text-slate-100"><CardHeader><CardTitle className="font-orbitron text-lg">Strategic Intelligence Log</CardTitle><CardDescription className="text-slate-400">Latest economy, training, combat, and intelligence reports.</CardDescription></CardHeader><CardContent><div className="space-y-2">{strategic.logs.length ? strategic.logs.map((log) => <div key={log.id} className="flex flex-col gap-1 rounded-lg border border-slate-800 bg-slate-900/45 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"><div><div className="font-rajdhani font-semibold text-slate-100">{log.title}</div><div className="text-sm text-slate-400">{log.summary}</div></div><Badge variant="outline" className="w-fit border-slate-600 text-[10px] uppercase text-slate-300">{log.kind}</Badge></div>) : <div className="rounded-lg border border-dashed border-slate-700 p-5 text-sm text-slate-400">No strategic reports yet.</div>}</div></CardContent></Card>

        {strategicMutation.isPending && <div className="fixed bottom-6 right-6 flex items-center gap-2 rounded-full border border-cyan-400/30 bg-slate-950 px-4 py-3 text-sm text-cyan-100 shadow-xl"><AlertTriangle className="h-4 w-4 animate-pulse" />Resolving strategic order...</div>}
      </div>
    </GameLayout>
  );
}

function MetricCard({ label, value, helper, icon: Icon, tone }: { label: string; value: string; helper: string; icon: typeof Users; tone: string }) {
  return <Card className="sd-win-window border-slate-700/80 bg-slate-950/75 text-slate-100"><CardContent className="p-5"><div className="flex items-center justify-between"><span className="text-xs font-bold uppercase tracking-widest text-slate-500">{label}</span><Icon className={`h-5 w-5 ${tone}`} /></div><div className="mt-3 font-orbitron text-2xl font-bold text-white">{value}</div><div className="mt-1 text-xs text-slate-400">{helper}</div></CardContent></Card>;
}

function PowerReadout({ label, value, icon: Icon, tone }: { label: string; value: number; icon: typeof Users; tone: string }) {
  return <div className="rounded-lg bg-slate-900 p-3"><div className={`flex items-center gap-2 text-xs ${tone}`}><Icon className="h-3.5 w-3.5" />{label}</div><div className="mt-1 font-orbitron text-lg text-white">{formatNumber(value)}</div></div>;
}
