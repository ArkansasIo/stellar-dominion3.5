import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Activity, BatteryCharging, Compass, Crosshair, Factory, Globe2, HeartPulse, Pickaxe, Radar, Rocket, ScanLine, Shield, Users, Wrench, Zap } from "lucide-react";
import GameLayout from "@/components/layout/GameLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiRequest, queryClient } from "@/lib/queryClient";

type WorldType = "homeworld" | "frontier" | "mining" | "agri" | "military";
type MissionType = "exploration" | "survey" | "salvage" | "rescue";
type Bonus = "attack" | "defense" | "covert" | "unitProduction" | "income";
type Specialization = "frontier" | "mining" | "agri" | "military";

type WorldTelemetry = {
  attack: number;
  defense: number;
  covert: number;
  unitProductionPerDay: number;
  incomePerTurn: number;
  productionPerHour: { naquadah: number; food: number; water: number };
  capacity: { naquadah: number; food: number; water: number };
  stabilityFactor: number;
  conditionFactor: number;
  developmentFactor: number;
  populationFreeCapacity: number;
};

type World = {
  id: string;
  name: string;
  ownerId: string;
  worldType: WorldType;
  condition: number;
  defenses: number;
  developmentLevel: number;
  population: number;
  maxPopulation: number;
  stability: number;
  lastYieldAt: number;
  bonuses: Record<Bonus, number>;
  discoveredAt: number;
  telemetry: WorldTelemetry;
  developmentCost: number;
  repairCost: number;
};

type MissionProfile = { label: string; durationHours: number; cost: number; fuel: number; riskPercent: number; purpose: string };
type Mothership = { owned: boolean; name: string; capacity: number; usedCapacity: number; weapons: number; shields: number; hangars: number; hull: number; fuel: number; maxFuel: number; explorationReadyAt: number | null; missionType: MissionType | null; discoveries: number; missionsCompleted: number; missionsFailed: number; lastMissionAt: number };
type State = { resources: Record<string, number>; mothership: Mothership; telemetry: { combatPower: number; explorationRange: number; defenseRating: number; readiness: number; crewCapacity: number; fleetSupportSlots: number }; worlds: World[]; capacity: { naquadah: number; food: number; water: number }; productionPerHour: { naquadah: number; food: number; water: number }; missionProfiles?: Record<MissionType, MissionProfile>; rules?: Record<string, unknown> };

const num = (value: unknown) => new Intl.NumberFormat("en-US").format(Math.max(0, Math.floor(Number(value) || 0)));
const pct = (value: unknown) => `${Math.max(0, Math.min(100, Math.floor(Number(value) || 0)))}%`;
const duration = (hours: number) => hours < 1 ? `${Math.round(hours * 60)} min` : `${hours} hr`;
const missionLabels: Record<MissionType, string> = { exploration: "Deep Exploration", survey: "Resource Survey", salvage: "Derelict Salvage", rescue: "Humanitarian Rescue" };
const specializationLabels: Record<Specialization, string> = { frontier: "Frontier", mining: "Mining", agri: "Agri", military: "Military" };

export default function StargateWorlds() {
  const [name, setName] = useState("Stargate Flagship");
  const [quantity, setQuantity] = useState("10");
  const [missionType, setMissionType] = useState<MissionType>("exploration");
  const [selectedWorldId, setSelectedWorldId] = useState("");
  const [specialization, setSpecialization] = useState<Specialization>("mining");
  const [renameDrafts, setRenameDrafts] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState("");
  const { data: worlds, isLoading: worldsLoading } = useQuery<State>({ queryKey: ["/api/stargate/worlds"], queryFn: async () => (await apiRequest("GET", "/api/stargate/worlds")).json() });
  const { data: ship, isLoading: shipLoading } = useQuery<State>({ queryKey: ["/api/stargate/mothership"], queryFn: async () => (await apiRequest("GET", "/api/stargate/mothership")).json() });
  const action = useMutation({
    mutationFn: async ({ path, body }: { path: string; body?: unknown }) => (await apiRequest("POST", path, body)).json(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/stargate/worlds"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stargate/mothership"] });
      setNotice("World command accepted and state synchronized.");
    },
    onError: (error: Error) => setNotice(error.message.replace(/^\d+:\s*/, "")),
  });
  const submit = (path: string, body?: Record<string, unknown>) => action.mutate({ path, body });
  const amount = Math.max(1, Math.floor(Number(quantity) || 1));
  const selectedWorld = worlds?.worlds.find((world) => world.id === selectedWorldId) || worlds?.worlds[0];
  const profile = ship?.missionProfiles?.[missionType];
  const missionCountdown = useMemo(() => {
    if (!ship?.mothership.explorationReadyAt) return "No mission in flight";
    const remaining = Math.max(0, ship.mothership.explorationReadyAt - Date.now());
    if (!remaining) return "Mission ready to claim";
    return `${Math.ceil(remaining / 60_000)} min remaining`;
  }, [ship?.mothership.explorationReadyAt]);

  if (worldsLoading || shipLoading || !worlds || !ship) return <GameLayout><div className="p-8 font-rajdhani text-slate-300">Synchronizing world command...</div></GameLayout>;
  const m = ship.mothership;
  const st = ship.telemetry;
  return <GameLayout><div className="sd-win-command space-y-6 pb-10">
    <section className="sd-win-window rounded-2xl border border-blue-400/45 bg-[linear-gradient(135deg,rgba(7,28,61,0.95),rgba(20,92,168,0.92))] p-6">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between"><div><div className="flex items-center gap-2 text-cyan-200"><Globe2 className="h-5 w-5" /><span className="font-mono text-xs uppercase tracking-[0.28em]">World Operations Console</span></div><h1 className="mt-2 font-orbitron text-3xl font-bold text-white">Mothership & Strategic Worlds</h1><p className="mt-2 max-w-3xl font-rajdhani text-blue-100">Commission your flagship, run specialized missions, develop discovered worlds, and turn every controlled orbit into a strategic production node.</p></div><div className="grid grid-cols-3 gap-2 text-right"><ResourceChip label="Naquadah" value={worlds.resources.naquadah} /><ResourceChip label="Food" value={worlds.resources.food} /><ResourceChip label="Water" value={worlds.resources.water} /></div></div>
      {notice && <div className="mt-4 rounded-lg bg-blue-950/55 px-3 py-2 text-sm text-blue-50" role="status">{notice}</div>}
    </section>

    <section className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
      <Card className="sd-win-window border-blue-300/70 bg-white/90"><CardHeader><div className="flex items-start justify-between gap-3"><div><CardTitle className="font-orbitron">Mothership Command</CardTitle><CardDescription>{m.owned ? `${m.name} is online and assigned to the strategic world network.` : "Commission a flagship to unlock missions and world discovery."}</CardDescription></div><div className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${m.owned ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>{m.owned ? "Operational" : "Offline"}</div></div></CardHeader><CardContent className="space-y-5">{!m.owned ? <><div><Label>Flagship name</Label><Input className="mt-1" maxLength={36} value={name} onChange={(e) => setName(e.target.value)} /></div><div className="rounded-lg bg-blue-50 p-3 text-sm text-slate-700">Commission cost: <strong>{num(Number(ship.rules?.basePurchaseCost) || 50_000)} Naquadah</strong> · Includes 100 hull, 100 fuel, 10 crew capacity.</div><Button disabled={action.isPending || !name.trim()} onClick={() => submit("/api/stargate/mothership/buy", { name })}><Rocket className="mr-2 h-4 w-4" />Commission Mothership</Button></> : <>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4"><Metric icon={<Crosshair className="h-4 w-4" />} label="Combat power" value={num(st.combatPower)} /><Metric icon={<Radar className="h-4 w-4" />} label="Range" value={`${num(st.explorationRange)} AU`} /><Metric icon={<Shield className="h-4 w-4" />} label="Defense rating" value={num(st.defenseRating)} /><Metric icon={<Activity className="h-4 w-4" />} label="Readiness" value={pct(st.readiness)} /></div>
        <div className="grid gap-3 sm:grid-cols-3"><StatusBar label="Hull integrity" value={m.hull} color="bg-emerald-500" /><StatusBar label="Fuel reserves" value={m.maxFuel ? m.fuel / m.maxFuel * 100 : 0} color="bg-cyan-500" /><StatusBar label="Crew load" value={m.capacity ? m.usedCapacity / m.capacity * 100 : 0} color="bg-violet-500" /></div>
        <div><div className="mb-2 flex items-center justify-between"><div className="text-xs font-bold uppercase tracking-wider text-slate-500">Module lattice</div><div className="text-xs text-slate-500">Max level {String(ship.rules?.maxModuleLevel || 20)}</div></div><div className="grid gap-2 sm:grid-cols-4">{(["capacity", "weapons", "shields", "hangars"] as const).map((module) => { const level = module === "capacity" ? Math.floor(m.capacity / 10) : m[module]; return <Button key={module} size="sm" variant="outline" disabled={action.isPending || level >= Number(ship.rules?.maxModuleLevel || 20)} onClick={() => submit("/api/stargate/mothership/upgrade", { module })}>+ {module} <span className="ml-1 text-[10px] text-slate-500">L{level}</span></Button>; })}</div></div>
      </>}</CardContent></Card>

      <Card className="sd-win-window border-blue-300/70 bg-white/90"><CardHeader><CardTitle className="font-orbitron">Mission Control</CardTitle><CardDescription>Every mission consumes fuel and Naquadah, then resolves server-side when claimed.</CardDescription></CardHeader><CardContent className="space-y-4">{m.owned ? <><div className="grid gap-2 sm:grid-cols-2">{(Object.keys(missionLabels) as MissionType[]).map((type) => <button key={type} type="button" onClick={() => setMissionType(type)} className={`rounded-xl border p-3 text-left transition ${missionType === type ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200" : "border-slate-200 bg-white hover:border-blue-300"}`}><div className="flex items-center gap-2 text-sm font-bold text-slate-800"><MissionIcon type={type} />{missionLabels[type]}</div><div className="mt-1 text-xs text-slate-500">{ship.missionProfiles?.[type]?.purpose || "Strategic operation"}</div></button>)}</div><div className="rounded-xl bg-slate-950 p-4 text-sm text-blue-100"><div className="flex items-center justify-between"><strong>{profile?.label || missionLabels[missionType]}</strong><span>{profile ? duration(profile.durationHours) : "—"}</span></div><div className="mt-2 grid grid-cols-3 gap-2 text-xs"><div>Cost<strong className="ml-1 text-white">{num(profile?.cost)} NQD</strong></div><div>Fuel<strong className="ml-1 text-white">{num(profile?.fuel)}</strong></div><div>Risk<strong className="ml-1 text-white">{pct(profile?.riskPercent)}</strong></div></div></div><div className="flex flex-wrap gap-2"><Button disabled={action.isPending || Boolean(m.explorationReadyAt)} onClick={() => submit("/api/stargate/mothership/mission", { missionType })}><Compass className="mr-2 h-4 w-4" />{m.explorationReadyAt ? missionCountdown : "Launch Mission"}</Button><Button variant="outline" disabled={action.isPending || !m.explorationReadyAt || Boolean(m.explorationReadyAt && m.explorationReadyAt > Date.now())} onClick={() => submit("/api/stargate/mothership/claim")}><ScanLine className="mr-2 h-4 w-4" />Claim Result</Button></div><div className="grid grid-cols-3 gap-2 text-xs text-slate-500"><div>Discoveries<strong className="block text-lg text-slate-800">{num(m.discoveries)}</strong></div><div>Completed<strong className="block text-lg text-slate-800">{num(m.missionsCompleted)}</strong></div><div>Failed<strong className="block text-lg text-slate-800">{num(m.missionsFailed)}</strong></div></div></> : <div className="rounded-xl bg-blue-50 p-4 text-sm text-slate-700">Commission the mothership to activate exploration, survey, salvage, and rescue mission control.</div>}</CardContent></Card>
    </section>

    <section className="sd-win-window rounded-2xl border border-blue-300/60 bg-slate-950/80 p-5 text-white"><div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"><div><div className="flex items-center gap-2 text-cyan-300"><Factory className="h-4 w-4" /><span className="font-mono text-xs uppercase tracking-[0.24em]">Strategic production network</span></div><h2 className="mt-1 font-orbitron text-xl">World Development Orders</h2><p className="mt-1 text-sm text-blue-100">Collect accrued yields, then invest Naquadah into development, defenses, repairs, and planetary specialization.</p></div><div className="flex flex-wrap items-end gap-2"><div><Label htmlFor="defense-quantity" className="text-[10px] uppercase tracking-wider text-blue-100">Defense quantity</Label><Input id="defense-quantity" className="mt-1 h-9 w-28 border-blue-700 bg-blue-950 text-white" type="number" min="1" max="100000" value={quantity} onChange={(e) => setQuantity(e.target.value)} /></div><Button disabled={action.isPending} onClick={() => submit("/api/stargate/worlds/collect")}><Zap className="mr-2 h-4 w-4" />Collect Yields</Button><div className="rounded-lg bg-blue-900/60 px-3 py-2 text-xs text-blue-100">{worlds.worlds.length} controlled · {num(worlds.productionPerHour.naquadah)}/h Naquadah</div></div></div><div className="mt-4 grid gap-3 sm:grid-cols-3"><NetworkMetric icon={<Pickaxe className="h-4 w-4" />} label="Naquadah / hour" value={num(worlds.productionPerHour.naquadah)} /><NetworkMetric icon={<Users className="h-4 w-4" />} label="Food / hour" value={num(worlds.productionPerHour.food)} /><NetworkMetric icon={<BatteryCharging className="h-4 w-4" />} label="Water / hour" value={num(worlds.productionPerHour.water)} /></div></section>

    <section className="grid gap-5 lg:grid-cols-2">{worlds.worlds.map((world) => <WorldCard key={world.id} world={world} amount={amount} selected={selectedWorld?.id === world.id} renameValue={renameDrafts[world.id] ?? world.name} onSelect={() => setSelectedWorldId(world.id)} onRenameChange={(value) => setRenameDrafts((current) => ({ ...current, [world.id]: value }))} onCommand={submit} busy={action.isPending} specialization={specialization} setSpecialization={setSpecialization} />)}</section>
    <div className="sr-only" aria-live="polite">Selected world: {selectedWorld?.name || "none"}</div>
  </div></GameLayout>;
}

function WorldCard({ world, amount, selected, renameValue, onSelect, onRenameChange, onCommand, busy, specialization, setSpecialization }: { world: World; amount: number; selected: boolean; renameValue: string; onSelect: () => void; onRenameChange: (value: string) => void; onCommand: (path: string, body?: Record<string, unknown>) => void; busy: boolean; specialization: Specialization; setSpecialization: (value: Specialization) => void }) {
  return <Card className={`sd-win-window border-blue-300/70 bg-white/90 ${selected ? "ring-2 ring-blue-500" : ""}`}><CardHeader><div className="flex items-start justify-between gap-3"><div><div className="mb-1 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-600"><Globe2 className="h-4 w-4" />{world.worldType} world</div><CardTitle className="font-orbitron text-lg">{world.name}</CardTitle><CardDescription>Discovered {new Date(world.discoveredAt).toLocaleDateString()} · Level {world.developmentLevel}/20</CardDescription></div><button type="button" aria-label={`Select ${world.name}`} onClick={onSelect} className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700">{selected ? "Selected" : "Focus"}</button></div></CardHeader><CardContent className="space-y-4"><div className="grid grid-cols-2 gap-2 sm:grid-cols-4"><Metric icon={<HeartPulse className="h-4 w-4" />} label="Condition" value={pct(world.condition)} /><Metric icon={<Activity className="h-4 w-4" />} label="Stability" value={pct(world.stability)} /><Metric icon={<Shield className="h-4 w-4" />} label="Defense" value={num(world.telemetry.defense)} /><Metric icon={<Users className="h-4 w-4" />} label="Population" value={`${num(world.population)}/${num(world.maxPopulation)}`} /></div><div className="grid grid-cols-3 gap-2 rounded-xl bg-blue-50 p-3 text-center text-xs text-slate-600"><div>Naquadah/h<strong className="block text-slate-900">{num(world.telemetry.productionPerHour.naquadah)}</strong></div><div>Food/h<strong className="block text-slate-900">{num(world.telemetry.productionPerHour.food)}</strong></div><div>Water/h<strong className="block text-slate-900">{num(world.telemetry.productionPerHour.water)}</strong></div></div><div className="grid grid-cols-5 gap-1 text-center text-[10px]">{(["attack", "defense", "covert", "unitProduction", "income"] as Bonus[]).map((bonus) => <div key={bonus} className="rounded bg-slate-50 p-2"><div className="truncate capitalize text-slate-500">{bonus === "unitProduction" ? "Units" : bonus}</div><strong className="text-sm text-slate-800">{world.bonuses[bonus]}</strong><Button aria-label={`Upgrade ${bonus} on ${world.name}`} className="mt-1 h-6 w-full px-1 text-[10px]" size="sm" variant="outline" disabled={busy} onClick={() => onCommand("/api/stargate/worlds/bonus", { worldId: world.id, bonus })}>+</Button></div>)}</div><div className="grid gap-2 sm:grid-cols-2"><Button disabled={busy || !world.developmentCost} onClick={() => onCommand("/api/stargate/worlds/develop", { worldId: world.id })}><Factory className="mr-2 h-4 w-4" />Develop {world.developmentCost ? `· ${num(world.developmentCost)} NQD` : "Maxed"}</Button><Button variant="outline" disabled={busy || world.condition >= 100} onClick={() => onCommand("/api/stargate/worlds/repair", { worldId: world.id })}><Wrench className="mr-2 h-4 w-4" />Repair {world.repairCost ? `· ${num(world.repairCost)} NQD` : ""}</Button></div><div className="grid gap-2 sm:grid-cols-[1fr_auto_auto]"><Input aria-label={`Rename ${world.name}`} maxLength={36} value={renameValue} onChange={(e) => onRenameChange(e.target.value)} /><Button size="sm" variant="outline" disabled={busy || !renameValue.trim() || renameValue.trim() === world.name} onClick={() => onCommand("/api/stargate/worlds/rename", { worldId: world.id, name: renameValue })}>Rename</Button><Button size="sm" variant="outline" disabled={busy || world.condition >= 100} onClick={() => onCommand("/api/stargate/worlds/repair", { worldId: world.id })}><Wrench className="h-4 w-4" /></Button></div><div className="grid gap-2 sm:grid-cols-[1fr_auto]"><select aria-label={`Specialize ${world.name}`} disabled={busy || world.worldType === "homeworld"} className="h-10 rounded-md border border-input bg-background px-3 text-sm" value={specialization} onChange={(e) => setSpecialization(e.target.value as Specialization)}>{Object.entries(specializationLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select><Button variant="outline" disabled={busy || world.worldType === "homeworld" || world.worldType === specialization} onClick={() => onCommand("/api/stargate/worlds/specialize", { worldId: world.id, specialization })}>Respecialize</Button></div><div className="flex flex-wrap items-center gap-2"><Input aria-label={`Fortification quantity for ${world.name}`} className="max-w-36" type="number" min="1" max="100000" value={amount} readOnly /><Button size="sm" disabled={busy} onClick={() => onCommand("/api/stargate/worlds/fortify", { worldId: world.id, quantity: amount })}><Shield className="mr-1 h-3.5 w-3.5" />Fortify · {num(amount * 400)} NQD</Button><span className="text-xs text-slate-500">{num(world.defenses)} / 100,000 defenses</span></div></CardContent></Card>;
}

function ResourceChip({ label, value }: { label: string; value: unknown }) { return <div className="rounded-xl bg-slate-950/55 px-3 py-2 text-right"><div className="text-[10px] uppercase tracking-wider text-cyan-100">{label}</div><div className="font-orbitron text-lg text-white">{num(value)}</div></div>; }
function Metric({ icon, label, value }: { icon: ReactNode; label: string; value: string }) { return <div className="rounded-lg bg-blue-50 p-2 text-center"><div className="mb-1 flex items-center justify-center gap-1 text-blue-600">{icon}<span className="text-[10px] uppercase tracking-wide text-slate-500">{label}</span></div><strong className="block truncate font-orbitron text-sm text-slate-900">{value}</strong></div>; }
function NetworkMetric({ icon, label, value }: { icon: ReactNode; label: string; value: string }) { return <div className="rounded-xl border border-blue-800 bg-blue-950/60 p-3"><div className="flex items-center gap-2 text-cyan-300">{icon}<span className="text-xs uppercase tracking-wider">{label}</span></div><strong className="mt-1 block font-orbitron text-2xl">{value}</strong></div>; }
function StatusBar({ label, value, color }: { label: string; value: number; color: string }) { const safe = Math.max(0, Math.min(100, value)); return <div><div className="mb-1 flex justify-between text-xs text-slate-500"><span>{label}</span><strong>{pct(safe)}</strong></div><div className="h-2 overflow-hidden rounded-full bg-slate-200"><div className={`h-full ${color} transition-all`} style={{ width: `${safe}%` }} /></div></div>; }
function MissionIcon({ type }: { type: MissionType }) { if (type === "survey") return <Radar className="h-4 w-4 text-cyan-600" />; if (type === "salvage") return <Pickaxe className="h-4 w-4 text-amber-600" />; if (type === "rescue") return <HeartPulse className="h-4 w-4 text-rose-600" />; return <Compass className="h-4 w-4 text-blue-600" />; }
