import GameLayout from "@/components/layout/GameLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  calculatePlatformStats,
  advanceOrbitalCycle,
  assignOrbitalZone,
  createOrbitalDefenseState,
  decommissionOrbitalPlatform,
  getFleetSummary,
  hydrateOrbitalDefenseState,
  installInventoryModule,
  installOrbitalModule,
  launchOrbitalMission,
  OrbitalMissionType,
  OrbitalDefenseState,
  OrbitalDoctrine,
  ORBITAL_ABILITIES,
  ORBITAL_DOCTRINES,
  ORBITAL_MODULES,
  ORBITAL_MISSIONS,
  ORBITAL_PLATFORM_CLASSES,
  ORBITAL_TECHNOLOGIES,
  ORBIT_ZONES,
  queueOrbitalOrder,
  removeOrbitalModule,
  renameOrbitalPlatform,
  repairOrbitalPlatform,
  researchOrbitalTechnology,
  setOrbitalDoctrine,
  setPlatformDoctrine,
  simulateOrbitalBattle,
  THREAT_PROFILES,
  upgradeOrbitalPlatform,
} from "@/lib/orbitalDefenseSystem";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  Atom,
  BatteryCharging,
  Bot,
  CheckCircle2,
  Crosshair,
  Cpu,
  Gauge,
  Hammer,
  Lock,
  Orbit,
  RadioTower,
  RefreshCw,
  Rocket,
  Satellite,
  Shield,
  ShieldCheck,
  Sparkles,
  Sword,
  Target,
  Thermometer,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "ued_orbital_defense_v1";

const roleTone: Record<string, string> = {
  interceptor: "border-cyan-200 bg-cyan-50 text-cyan-800",
  gunship: "border-red-200 bg-red-50 text-red-800",
  missile: "border-orange-200 bg-orange-50 text-orange-800",
  shield: "border-blue-200 bg-blue-50 text-blue-800",
  command: "border-violet-200 bg-violet-50 text-violet-800",
  sensor: "border-emerald-200 bg-emerald-50 text-emerald-800",
  carrier: "border-indigo-200 bg-indigo-50 text-indigo-800",
  fortress: "border-amber-300 bg-amber-50 text-amber-900",
};

const categoryIcons: Record<string, LucideIcon> = {
  weapon: Crosshair,
  shield: Shield,
  armor: ShieldCheck,
  reactor: BatteryCharging,
  sensor: RadioTower,
  utility: Cpu,
  hangar: Rocket,
};

function compact(value: number) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return Math.round(value).toLocaleString();
}

function Metric({ label, value, helper, icon: Icon, tone }: { label: string; value: string; helper: string; icon: LucideIcon; tone: string }) {
  return (
    <Card className="border-slate-200 bg-white">
      <CardContent className="flex items-center gap-3 pt-6">
        <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border", tone)}><Icon className="h-5 w-5" /></div>
        <div className="min-w-0"><div className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">{label}</div><div className="truncate text-2xl font-orbitron font-bold">{value}</div><div className="text-xs text-slate-500">{helper}</div></div>
      </CardContent>
    </Card>
  );
}

function CostLine({ cost }: { cost: { metal: number; crystal: number; deuterium: number; credits: number } }) {
  return (
    <div className="flex flex-wrap gap-1">
      <Badge variant="outline">Metal {compact(cost.metal)}</Badge>
      <Badge variant="outline">Crystal {compact(cost.crystal)}</Badge>
      <Badge variant="outline">Deut. {compact(cost.deuterium)}</Badge>
      <Badge variant="outline">Credits {compact(cost.credits)}</Badge>
    </div>
  );
}

export default function OrbitalDefense() {
  const { toast } = useToast();
  const [state, setState] = useState<OrbitalDefenseState>(() => {
    if (typeof window === "undefined") return createOrbitalDefenseState();
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      return raw ? hydrateOrbitalDefenseState(JSON.parse(raw)) : createOrbitalDefenseState();
    } catch {
      return createOrbitalDefenseState();
    }
  });
  const [selectedPlatformId, setSelectedPlatformId] = useState(state.platforms[0]?.id ?? "");
  const [renameValue, setRenameValue] = useState("");
  const [missionType, setMissionType] = useState<OrbitalMissionType>("patrol");

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    if (!state.platforms.some((platform) => platform.id === selectedPlatformId)) {
      setSelectedPlatformId(state.platforms[0]?.id ?? "");
    }
  }, [selectedPlatformId, state.platforms]);

  const fleet = useMemo(() => getFleetSummary(state), [state]);
  const selectedPlatform = state.platforms.find((platform) => platform.id === selectedPlatformId);
  const selectedClass = ORBITAL_PLATFORM_CLASSES.find((entry) => entry.id === selectedPlatform?.classId);
  const selectedStats = selectedPlatform ? calculatePlatformStats(selectedPlatform, state) : null;

  const update = (producer: (current: OrbitalDefenseState) => OrbitalDefenseState) => setState((current) => producer(current));

  const runBattle = (threatId: string) => {
    const threat = THREAT_PROFILES.find((entry) => entry.id === threatId);
    setState((current) => simulateOrbitalBattle(current, threatId));
    toast({ title: `Combat drill: ${threat?.name}`, description: "Detection, interception, abilities, shields, armor, hull damage, salvage, and experience have been resolved." });
  };

  return (
    <GameLayout>
      <div className="space-y-6">
        <Card className="relative overflow-hidden border-slate-800 bg-slate-950 text-white">
          <div className="absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_18%_20%,#2563eb_0,transparent_25%),radial-gradient(circle_at_82%_25%,#dc2626_0,transparent_20%),linear-gradient(125deg,transparent_30%,#0891b244_50%,transparent_70%)]" />
          <CardContent className="relative grid gap-7 p-7 xl:grid-cols-[1.4fr_0.8fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-200"><Satellite className="h-3.5 w-3.5" /> Orbital Warfare Command</div>
              <h1 className="mt-4 text-3xl font-orbitron font-bold md:text-4xl">Satellite & Orbital Platform Defense Network</h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
                Construct autonomous satellites, missile platforms, shield projectors, carriers, command stations, and orbital fortresses. Fit weapons and defensive modules, advance tiers and levels, research combat technologies, select doctrines, and defend planetary orbit.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Badge className="bg-blue-500/20 text-blue-100">{fleet.platforms} active platforms</Badge>
                <Badge className="bg-red-500/20 text-red-100">{compact(fleet.combatPower)} firepower</Badge>
                <Badge className="bg-emerald-500/20 text-emerald-100">{fleet.readiness}% readiness</Badge>
                <Badge className="bg-white/10 text-slate-200">Command level {state.commandLevel}</Badge>
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <div className="flex items-center justify-between"><div><div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Fleet doctrine</div><div className="mt-1 font-orbitron text-lg font-bold text-cyan-200">{ORBITAL_DOCTRINES[state.doctrine].label}</div></div><Target className="h-8 w-8 text-red-300" /></div>
              <p className="mt-3 text-sm text-slate-300">{ORBITAL_DOCTRINES[state.doctrine].description}</p>
              <div className="mt-4"><div className="mb-1 flex justify-between text-xs text-slate-400"><span>Combined readiness</span><span>{fleet.readiness}%</span></div><Progress value={fleet.readiness} /></div>
              <Button className="mt-5 w-full bg-red-600 hover:bg-red-500" onClick={() => runBattle("pirate-swarm")}><Sword className="mr-2 h-4 w-4" /> Run readiness drill</Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
          <Metric label="Combat Power" value={compact(fleet.combatPower)} helper="Effective damage per round" icon={Crosshair} tone="border-red-200 bg-red-50 text-red-700" />
          <Metric label="Shield Capacity" value={compact(fleet.shields)} helper="Projected defensive screens" icon={Shield} tone="border-blue-200 bg-blue-50 text-blue-700" />
          <Metric label="Armor + Hull" value={compact(fleet.armorHull)} helper="Structural staying power" icon={ShieldCheck} tone="border-slate-300 bg-slate-100 text-slate-700" />
          <Metric label="Interception" value={compact(fleet.interception)} helper="Missile and drone defense" icon={Rocket} tone="border-orange-200 bg-orange-50 text-orange-700" />
          <Metric label="Sensor Net" value={compact(fleet.sensor)} helper="Detection and command reach" icon={RadioTower} tone="border-emerald-200 bg-emerald-50 text-emerald-700" />
          <Metric label="Research" value={compact(state.resources.research)} helper="Orbital technology points" icon={Atom} tone="border-violet-200 bg-violet-50 text-violet-700" />
        </div>

        <Tabs defaultValue="fleet" className="space-y-5">
          <TabsList className="grid h-auto w-full grid-cols-2 gap-1 border border-slate-200 bg-white p-1 md:grid-cols-5 xl:grid-cols-9">
            <TabsTrigger value="fleet" className="gap-2 py-3"><Satellite className="h-4 w-4" /> Fleet</TabsTrigger>
            <TabsTrigger value="construction" className="gap-2 py-3"><Hammer className="h-4 w-4" /> Construction</TabsTrigger>
            <TabsTrigger value="fitting" className="gap-2 py-3"><Wrench className="h-4 w-4" /> Fitting</TabsTrigger>
            <TabsTrigger value="doctrine" className="gap-2 py-3"><Target className="h-4 w-4" /> Doctrine</TabsTrigger>
            <TabsTrigger value="research" className="gap-2 py-3"><Atom className="h-4 w-4" /> Technology</TabsTrigger>
            <TabsTrigger value="combat" className="gap-2 py-3"><Sword className="h-4 w-4" /> Combat</TabsTrigger>
            <TabsTrigger value="abilities" className="gap-2 py-3"><Sparkles className="h-4 w-4" /> Abilities</TabsTrigger>
            <TabsTrigger value="logistics" className="gap-2 py-3"><BatteryCharging className="h-4 w-4" /> Logistics</TabsTrigger>
            <TabsTrigger value="missions" className="gap-2 py-3"><Rocket className="h-4 w-4" /> Missions</TabsTrigger>
          </TabsList>

          <TabsContent value="fleet" className="space-y-4">
            <div className="grid gap-4 xl:grid-cols-2">
              {state.platforms.map((platform) => {
                const hullClass = ORBITAL_PLATFORM_CLASSES.find((entry) => entry.id === platform.classId)!;
                const stats = calculatePlatformStats(platform, state);
                const health = ((platform.hull + platform.armor + platform.shield) / Math.max(1, stats.hull + stats.armor + stats.shield)) * 100;
                return (
                  <Card key={platform.id} className={cn("border-slate-200 bg-white", selectedPlatformId === platform.id && "border-cyan-400 ring-1 ring-cyan-200")}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-200 bg-cyan-50 text-cyan-700"><Orbit className="h-5 w-5" /></div><div><CardTitle className="text-lg">{platform.name}</CardTitle><p className="text-xs text-slate-500">{hullClass.name} • {platform.orbit}</p></div></div>
                        <div className="flex flex-col items-end gap-1"><Badge className={roleTone[hullClass.role]}>{hullClass.role}</Badge><Badge variant="outline">T{platform.tier} • L{platform.level}</Badge></div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-4 gap-2 text-center text-xs">
                        <div className="rounded-lg bg-red-50 p-2"><div className="text-red-600">DPR</div><b>{compact(stats.damagePerRound)}</b></div>
                        <div className="rounded-lg bg-blue-50 p-2"><div className="text-blue-600">Shield</div><b>{compact(stats.shield)}</b></div>
                        <div className="rounded-lg bg-slate-100 p-2"><div className="text-slate-600">Hull</div><b>{compact(stats.hull)}</b></div>
                        <div className="rounded-lg bg-emerald-50 p-2"><div className="text-emerald-600">Sensor</div><b>{stats.sensor}</b></div>
                      </div>
                      <div><div className="mb-1 flex justify-between text-xs text-slate-500"><span>Combat condition</span><span>{Math.round(health)}%</span></div><Progress value={health} /></div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className={cn("rounded-lg border p-3", stats.powerUsed > stats.powerGenerated ? "border-red-300 bg-red-50" : "border-amber-200 bg-amber-50")}><div className="flex items-center gap-1 text-slate-600"><Zap className="h-3.5 w-3.5" /> Power</div><b>{stats.powerUsed} / {stats.powerGenerated}</b></div>
                        <div className={cn("rounded-lg border p-3", stats.heatGenerated > stats.heatCapacity ? "border-red-300 bg-red-50" : "border-orange-200 bg-orange-50")}><div className="flex items-center gap-1 text-slate-600"><Thermometer className="h-3.5 w-3.5" /> Heat</div><b>{stats.heatGenerated} / {stats.heatCapacity}</b></div>
                      </div>
                      <div className="flex flex-wrap gap-1">{platform.modules.map((id, index) => <button key={`${id}-${index}`} onClick={() => update((current) => removeOrbitalModule(current, platform.id, index))} className="rounded-full border border-slate-200 bg-white px-2 py-1 text-xs hover:border-red-300 hover:text-red-700" title="Remove module to inventory">{ORBITAL_MODULES.find((module) => module.id === id)?.name ?? id} ×</button>)}</div>
                      <div className="grid grid-cols-3 gap-2">
                        <Button variant="outline" onClick={() => setSelectedPlatformId(platform.id)}>Select</Button>
                        <Button variant="outline" onClick={() => update((current) => upgradeOrbitalPlatform(current, platform.id))}><RefreshCw className="mr-1 h-4 w-4" /> Upgrade</Button>
                        <Button variant="outline" disabled={health >= 99} onClick={() => update((current) => repairOrbitalPlatform(current, platform.id))}><Wrench className="mr-1 h-4 w-4" /> Repair</Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            {selectedPlatform && (
              <Card className="border-cyan-200 bg-cyan-50/50">
                <CardHeader><CardTitle>Selected platform command</CardTitle></CardHeader>
                <CardContent className="grid gap-4 lg:grid-cols-4">
                  <div className="space-y-2"><div className="text-xs font-bold uppercase text-slate-500">Designation</div><div className="flex gap-2"><Input value={renameValue} onChange={(event) => setRenameValue(event.target.value)} placeholder={selectedPlatform.name} /><Button onClick={() => { update((current) => renameOrbitalPlatform(current, selectedPlatform.id, renameValue)); setRenameValue(""); }}>Rename</Button></div></div>
                  <div className="space-y-2"><div className="text-xs font-bold uppercase text-slate-500">Orbit assignment</div><Select value={selectedPlatform.orbit} onValueChange={(value) => update((current) => assignOrbitalZone(current, selectedPlatform.id, value))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{ORBIT_ZONES.map((zone) => <SelectItem key={zone.id} value={zone.id}>{zone.name}</SelectItem>)}</SelectContent></Select></div>
                  <div className="space-y-2"><div className="text-xs font-bold uppercase text-slate-500">Local doctrine</div><Select value={selectedPlatform.doctrine} onValueChange={(value) => update((current) => setPlatformDoctrine(current, selectedPlatform.id, value as OrbitalDoctrine))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{(Object.keys(ORBITAL_DOCTRINES) as OrbitalDoctrine[]).map((doctrine) => <SelectItem key={doctrine} value={doctrine}>{ORBITAL_DOCTRINES[doctrine].label}</SelectItem>)}</SelectContent></Select></div>
                  <div className="space-y-2"><div className="text-xs font-bold uppercase text-slate-500">Lifecycle</div><div className="grid grid-cols-2 gap-2"><Button variant="outline" onClick={() => update((current) => queueOrbitalOrder(current, "resupply", selectedPlatform.id))}>Resupply</Button><Button variant="destructive" onClick={() => update((current) => decommissionOrbitalPlatform(current, selectedPlatform.id))}>Decommission</Button></div></div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="construction" className="space-y-5">
            <Card className="border-slate-200 bg-slate-950 text-white"><CardContent className="grid gap-4 pt-6 sm:grid-cols-4">{Object.entries(state.resources).filter(([key]) => key !== "research").map(([key, value]) => <div key={key}><div className="text-[10px] uppercase tracking-widest text-slate-400">{key}</div><div className="text-xl font-orbitron font-bold text-cyan-200">{compact(value)}</div></div>)}</CardContent></Card>
            <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
              {ORBITAL_PLATFORM_CLASSES.map((hullClass) => {
                const unlocked = !hullClass.requiredTech || state.unlockedTech.includes(hullClass.requiredTech);
                return (
                  <Card key={hullClass.id} className={cn("border-slate-200 bg-white", !unlocked && "opacity-75")}>
                    <CardHeader><div className="flex justify-between gap-3"><CardTitle className="text-base">{hullClass.name}</CardTitle><Badge className={roleTone[hullClass.role]}>{hullClass.role}</Badge></div><p className="text-xs text-slate-500">{hullClass.category} • Tier {hullClass.tier}-{hullClass.maxTier} • Level 1-{hullClass.maxLevel}</p></CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-slate-600">{hullClass.description}</p>
                      <div className="grid grid-cols-4 gap-2 text-center text-xs"><div className="rounded bg-slate-50 p-2">Hull<br /><b>{compact(hullClass.base.hull)}</b></div><div className="rounded bg-blue-50 p-2">Shield<br /><b>{compact(hullClass.base.shield)}</b></div><div className="rounded bg-red-50 p-2">Slots<br /><b>{Object.values(hullClass.slots).reduce((sum, value) => sum + (value ?? 0), 0)}</b></div><div className="rounded bg-amber-50 p-2">Power<br /><b>{hullClass.base.power}</b></div></div>
                      <CostLine cost={hullClass.cost} />
                      <Button className="w-full" disabled={!unlocked} onClick={() => update((current) => queueOrbitalOrder(current, "construct", hullClass.id))}>{unlocked ? "Queue construction" : `Requires ${ORBITAL_TECHNOLOGIES.find((tech) => tech.id === hullClass.requiredTech)?.name}`}</Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="fitting" className="space-y-5">
            {!selectedPlatform || !selectedClass || !selectedStats ? (
              <Card><CardContent className="pt-6">Select a platform from the Fleet tab.</CardContent></Card>
            ) : (
              <>
                <Card className="border-cyan-200 bg-cyan-50">
                  <CardContent className="grid gap-4 pt-6 lg:grid-cols-[1fr_1.4fr]">
                    <div><div className="text-xs uppercase tracking-widest text-cyan-800">Selected platform</div><div className="mt-1 text-2xl font-orbitron font-bold">{selectedPlatform.name}</div><p className="text-sm text-slate-600">{selectedClass.description}</p></div>
                    <div className="grid grid-cols-3 gap-2 text-center text-xs sm:grid-cols-6"><div className="rounded bg-white p-2">DPR<br /><b>{compact(selectedStats.damagePerRound)}</b></div><div className="rounded bg-white p-2">Range<br /><b>{selectedStats.range}</b></div><div className="rounded bg-white p-2">Tracking<br /><b>{selectedStats.tracking}</b></div><div className="rounded bg-white p-2">PD<br /><b>{selectedStats.pointDefense}</b></div><div className="rounded bg-white p-2">Repair<br /><b>{selectedStats.repair}</b></div><div className="rounded bg-white p-2">Command<br /><b>{selectedStats.command}</b></div></div>
                  </CardContent>
                </Card>
                {Object.values(state.inventory).some((count) => count > 0) && (
                  <Card className="border-emerald-200 bg-emerald-50/50">
                    <CardHeader><CardTitle>Recovered module inventory</CardTitle></CardHeader>
                    <CardContent className="flex flex-wrap gap-2">
                      {Object.entries(state.inventory).filter(([, count]) => count > 0).map(([moduleId, count]) => (
                        <Button key={moduleId} size="sm" variant="outline" onClick={() => update((current) => installInventoryModule(current, selectedPlatform.id, moduleId))}>
                          Install {ORBITAL_MODULES.find((module) => module.id === moduleId)?.name ?? moduleId} ({count})
                        </Button>
                      ))}
                    </CardContent>
                  </Card>
                )}
                <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
                  {ORBITAL_MODULES.map((module) => {
                    const Icon = categoryIcons[module.category] ?? Cpu;
                    const unlocked = !module.requiredTech || state.unlockedTech.includes(module.requiredTech);
                    const used = selectedPlatform.modules.filter((id) => ORBITAL_MODULES.find((entry) => entry.id === id)?.category === module.category).length;
                    const capacity = selectedClass.slots[module.category] ?? 0;
                    const hasSlot = used < capacity;
                    return (
                      <Card key={module.id} className={cn("border-slate-200 bg-white", (!unlocked || !hasSlot) && "opacity-75")}>
                        <CardHeader className="pb-3"><div className="flex justify-between gap-2"><div className="flex gap-2"><Icon className="h-5 w-5 text-cyan-700" /><CardTitle className="text-base">{module.name}</CardTitle></div><Badge variant="outline">T{module.tier}</Badge></div><p className="text-xs capitalize text-slate-500">{module.category} • slots {used}/{capacity}</p></CardHeader>
                        <CardContent className="space-y-3 text-sm">
                          <p className="text-slate-600">{module.description}</p>
                          <div className="grid grid-cols-2 gap-2 text-xs"><div className="rounded bg-amber-50 p-2">Power <b>{module.powerUse}</b></div><div className="rounded bg-orange-50 p-2">Heat <b>{module.heat}</b></div></div>
                          {module.weapon && <div className="rounded bg-red-50 p-3 text-xs">Damage {module.weapon.damage} × {module.weapon.rateOfFire} • Accuracy {module.weapon.accuracy}% • Range {module.weapon.range} • {module.weapon.damageType}</div>}
                          {module.defense && <div className="rounded bg-blue-50 p-3 text-xs">Shield +{module.defense.shield} • Armor +{module.defense.armor} • Hull +{module.defense.hull} • PD +{module.defense.pointDefense}</div>}
                          <CostLine cost={module.cost} />
                          <Button className="w-full" disabled={!unlocked || !hasSlot} onClick={() => update((current) => installOrbitalModule(current, selectedPlatform.id, module.id))}>{!unlocked ? "Technology locked" : !hasSlot ? "No compatible slot" : "Install module"}</Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="doctrine" className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-5">
              {(Object.keys(ORBITAL_DOCTRINES) as OrbitalDoctrine[]).map((doctrine) => (
                <button key={doctrine} onClick={() => update((current) => setOrbitalDoctrine(current, doctrine))} className={cn("rounded-xl border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500", state.doctrine === doctrine ? "border-cyan-500 bg-cyan-50" : "border-slate-200 bg-white hover:border-cyan-300")}>
                  <Target className="mb-3 h-5 w-5 text-cyan-700" /><div className="font-bold">{ORBITAL_DOCTRINES[doctrine].label}</div><p className="mt-2 text-xs text-slate-500">{ORBITAL_DOCTRINES[doctrine].description}</p><Badge variant="outline" className="mt-3">{ORBITAL_DOCTRINES[doctrine].bonuses}</Badge>
                </button>
              ))}
            </div>
            <Card className="border-slate-200 bg-white"><CardHeader><CardTitle>Targeting and engagement mechanics</CardTitle></CardHeader><CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{[
              ["Detection", "Sensor strength contests enemy stealth and evasion before weapons can acquire a firing solution."],
              ["Tracking", "Tracking offsets target evasion. Point defense adds specialized tracking against missiles and drones."],
              ["Power & heat", "Over-budget platforms lose damage and readiness. Reactors and cooling raise sustainable output."],
              ["Damage layers", "Shields absorb first, armor mitigates penetrations, and hull loss can disable the platform."],
            ].map(([title, detail]) => <div key={title} className="rounded-lg border border-slate-200 bg-slate-50 p-4"><b>{title}</b><p className="mt-2 text-xs text-slate-600">{detail}</p></div>)}</CardContent></Card>
          </TabsContent>

          <TabsContent value="research" className="space-y-5">
            {[1, 2, 3, 4, 5].map((tier) => (
              <div key={tier} className="space-y-3">
                <div className="flex items-center gap-3"><div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 font-bold text-white">{tier}</div><h3 className="font-orbitron font-bold">Technology Tier {tier}</h3><div className="h-px flex-1 bg-slate-200" /></div>
                <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
                  {ORBITAL_TECHNOLOGIES.filter((tech) => tech.tier === tier).map((tech) => {
                    const researched = state.unlockedTech.includes(tech.id);
                    const prerequisites = tech.prerequisites.every((id) => state.unlockedTech.includes(id));
                    const affordable = state.resources.research >= tech.researchCost;
                    return (
                      <Card key={tech.id} className={cn("border-slate-200 bg-white", researched && "border-emerald-300 bg-emerald-50/30", !prerequisites && "opacity-75")}>
                        <CardHeader className="pb-3"><div className="flex justify-between gap-2"><CardTitle className="text-base">{tech.name}</CardTitle>{researched ? <CheckCircle2 className="h-5 w-5 text-emerald-600" /> : prerequisites ? <Atom className="h-5 w-5 text-violet-600" /> : <Lock className="h-5 w-5 text-slate-400" />}</div><Badge variant="outline" className="w-fit capitalize">{tech.category}</Badge></CardHeader>
                        <CardContent className="space-y-3 text-sm"><p className="text-slate-600">{tech.description}</p><div className="rounded bg-slate-50 p-3 font-medium">{tech.effect}</div><p className="text-xs text-slate-500">Prerequisites: {tech.prerequisites.length ? tech.prerequisites.map((id) => ORBITAL_TECHNOLOGIES.find((entry) => entry.id === id)?.name).join(", ") : "None"}</p><Button className="w-full" disabled={researched || !prerequisites || !affordable} onClick={() => update((current) => researchOrbitalTechnology(current, tech.id))}>{researched ? "Researched" : !prerequisites ? "Prerequisites locked" : !affordable ? "Research unavailable" : `${compact(tech.researchCost)} RP`}</Button></CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="combat" className="space-y-5">
            <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
              {THREAT_PROFILES.map((threat) => (
                <Card key={threat.id} className="border-slate-200 bg-white">
                  <CardHeader><div className="flex justify-between gap-3"><CardTitle className="text-base">{threat.name}</CardTitle><Badge className={threat.tier >= 4 ? "bg-red-100 text-red-800" : "bg-amber-100 text-amber-800"}>Threat T{threat.tier}</Badge></div></CardHeader>
                  <CardContent className="space-y-3 text-sm"><p className="text-slate-600">{threat.description}</p><div className="grid grid-cols-4 gap-2 text-center text-xs"><div className="rounded bg-red-50 p-2">Power<br /><b>{compact(threat.strength)}</b></div><div className="rounded bg-blue-50 p-2">Shield<br /><b>{compact(threat.shield)}</b></div><div className="rounded bg-slate-100 p-2">Hull<br /><b>{compact(threat.hull)}</b></div><div className="rounded bg-orange-50 p-2">Missiles<br /><b>{threat.missiles}</b></div></div><Button variant={threat.tier >= 4 ? "destructive" : "default"} className="w-full" onClick={() => runBattle(threat.id)}><Sword className="mr-2 h-4 w-4" /> Simulate engagement</Button></CardContent>
                </Card>
              ))}
            </div>
            {state.reports.length > 0 && (
              <Card className="border-slate-200 bg-white">
                <CardHeader><CardTitle>After-action reports</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {state.reports.slice(0, 8).map((report) => {
                    const threat = THREAT_PROFILES.find((entry) => entry.id === report.threatId);
                    return (
                      <div key={report.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                        <div className="flex flex-wrap items-center justify-between gap-3"><div><b>{threat?.name}</b><p className="text-xs text-slate-500">Cycle {report.cycle} • {report.rounds.length} rounds</p></div><Badge className={report.victory ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}>{report.victory ? "Victory" : "Defense failed"}</Badge></div>
                        <div className="mt-3 grid grid-cols-2 gap-2 text-xs md:grid-cols-5"><div>Damage dealt<br /><b>{compact(report.totalDamageDealt)}</b></div><div>Damage taken<br /><b>{compact(report.totalDamageTaken)}</b></div><div>Disabled<br /><b>{report.destroyedPlatforms.length}</b></div><div>Experience<br /><b>{compact(report.experience)}</b></div><div>Salvage<br /><b>{compact(report.salvage.metal + report.salvage.crystal)}</b></div></div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="logistics" className="space-y-5">
            <Card className="border-slate-800 bg-slate-950 text-white">
              <CardContent className="grid gap-4 pt-6 md:grid-cols-[1fr_auto] md:items-center">
                <div><div className="text-xs uppercase tracking-widest text-slate-400">Orbital operations cycle</div><div className="mt-1 text-2xl font-orbitron font-bold text-cyan-200">Cycle {state.cycle}</div><p className="mt-2 text-sm text-slate-300">Advancing a cycle progresses construction, repairs, upgrades, resupply, missions, shield recharge, cooldowns, research collection, and fleet upkeep.</p></div>
                <Button onClick={() => update((current) => advanceOrbitalCycle(current))} className="bg-cyan-600 hover:bg-cyan-500"><RefreshCw className="mr-2 h-4 w-4" /> Advance cycle</Button>
              </CardContent>
            </Card>
            <div className="grid gap-4 md:grid-cols-4">
              <Metric label="Fleet Upkeep" value={`${compact(fleet.upkeep)} cr`} helper="Charged each operations cycle" icon={Gauge} tone="border-amber-200 bg-amber-50 text-amber-700" />
              <Metric label="Active Orders" value={String(state.orders.length)} helper="Construction and service queue" icon={Hammer} tone="border-blue-200 bg-blue-50 text-blue-700" />
              <Metric label="Stored Modules" value={String(Object.values(state.inventory).reduce((sum, count) => sum + count, 0))} helper="Reusable recovered equipment" icon={Wrench} tone="border-emerald-200 bg-emerald-50 text-emerald-700" />
              <Metric label="Lifetime Victories" value={String(state.lifetime.victories)} helper={`${state.lifetime.defeats} defense failures`} icon={ShieldCheck} tone="border-violet-200 bg-violet-50 text-violet-700" />
            </div>
            <Card className="border-slate-200 bg-white">
              <CardHeader><CardTitle>Operations queue</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {state.orders.length === 0 ? <p className="text-sm text-slate-500">No construction or service orders are active.</p> : state.orders.map((order) => <div key={order.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4"><div className="flex justify-between text-sm"><b>{order.label}</b><span>{order.progress}/{order.duration} cycles</span></div><Progress className="mt-2" value={(order.progress / order.duration) * 100} /></div>)}
              </CardContent>
            </Card>
            <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
              {ORBIT_ZONES.map((zone) => {
                const occupied = state.platforms.filter((platform) => platform.orbit === zone.id).length;
                return <Card key={zone.id} className="border-slate-200 bg-white"><CardHeader><div className="flex justify-between gap-2"><CardTitle className="text-base">{zone.name}</CardTitle><Badge variant="outline">{occupied}/{zone.capacity}</Badge></div></CardHeader><CardContent className="space-y-3 text-sm"><p className="text-slate-600">{zone.description}</p><div className="grid grid-cols-3 gap-2 text-center text-xs"><div className="rounded bg-emerald-50 p-2">Sensor<br /><b>+{zone.sensorBonus}%</b></div><div className="rounded bg-blue-50 p-2">Defense<br /><b>{zone.defenseBonus >= 0 ? "+" : ""}{zone.defenseBonus}%</b></div><div className="rounded bg-red-50 p-2">Damage<br /><b>+{zone.damageBonus}%</b></div></div></CardContent></Card>;
              })}
            </div>
          </TabsContent>

          <TabsContent value="missions" className="space-y-5">
            <Card className="border-cyan-200 bg-cyan-50">
              <CardContent className="grid gap-4 pt-6 lg:grid-cols-[1fr_1fr_auto] lg:items-end">
                <div className="space-y-2"><div className="text-xs font-bold uppercase text-cyan-800">Mission type</div><Select value={missionType} onValueChange={(value) => setMissionType(value as OrbitalMissionType)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{(Object.keys(ORBITAL_MISSIONS) as OrbitalMissionType[]).map((type) => <SelectItem key={type} value={type}>{ORBITAL_MISSIONS[type].label}</SelectItem>)}</SelectContent></Select></div>
                <div><div className="text-xs font-bold uppercase text-cyan-800">Current assignment</div><p className="mt-2 text-sm text-slate-700">{ORBITAL_MISSIONS[missionType].description} Duration {ORBITAL_MISSIONS[missionType].duration} cycles • Risk {ORBITAL_MISSIONS[missionType].risk}%.</p></div>
                <Button onClick={() => selectedPlatform && update((current) => launchOrbitalMission(current, missionType, [selectedPlatform.id], selectedPlatform.orbit))} disabled={!selectedPlatform}><Rocket className="mr-2 h-4 w-4" /> Launch selected</Button>
              </CardContent>
            </Card>
            <div className="grid gap-4 lg:grid-cols-2">
              {state.missions.length === 0 ? <Card><CardContent className="pt-6 text-sm text-slate-500">No missions have been launched.</CardContent></Card> : state.missions.slice().reverse().map((mission) => <Card key={mission.id} className={cn("border-slate-200 bg-white", mission.status === "success" && "border-emerald-300", mission.status === "failed" && "border-red-300")}><CardContent className="space-y-3 pt-6"><div className="flex justify-between gap-3"><div><b>{ORBITAL_MISSIONS[mission.type].label}</b><p className="text-xs text-slate-500">{mission.platformIds.length} assigned platform(s) • {ORBIT_ZONES.find((zone) => zone.id === mission.orbitId)?.name}</p></div><Badge className={mission.status === "active" ? "bg-blue-100 text-blue-800" : mission.status === "success" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}>{mission.status}</Badge></div><Progress value={(mission.progress / mission.duration) * 100} /><div className="text-xs text-slate-500">Progress {mission.progress}/{mission.duration} • Risk {mission.risk}%</div></CardContent></Card>)}
            </div>
            <Card className="border-slate-200 bg-white"><CardHeader><CardTitle>Lifetime combat record</CardTitle></CardHeader><CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{Object.entries(state.lifetime).map(([key, value]) => <div key={key} className="rounded-lg border border-slate-200 bg-slate-50 p-3"><div className="text-[10px] uppercase tracking-wider text-slate-500">{key.replace(/([A-Z])/g, " $1")}</div><div className="mt-1 text-lg font-orbitron font-bold">{compact(value)}</div></div>)}</CardContent></Card>
          </TabsContent>

          <TabsContent value="abilities" className="space-y-5">
            <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
              {ORBITAL_ABILITIES.map((ability) => (
                <Card key={ability.id} className="border-violet-200 bg-violet-50/40"><CardHeader className="pb-3"><div className="flex justify-between gap-2"><CardTitle className="text-base">{ability.name}</CardTitle><Badge variant="outline">CD {ability.cooldown}</Badge></div></CardHeader><CardContent className="space-y-3 text-sm"><p className="text-slate-600">{ability.description}</p><div className="rounded bg-white p-3 text-xs"><b>Trigger:</b> {ability.trigger}</div><div className="rounded bg-violet-100 p-3 text-xs text-violet-900"><b>Effect:</b> {ability.effect}</div></CardContent></Card>
              ))}
            </div>
            <Card className="border-slate-200 bg-white"><CardHeader><CardTitle>Recent command alerts</CardTitle></CardHeader><CardContent className="space-y-2">{state.alerts.slice(0, 12).map((alert, index) => <div key={`${alert}-${index}`} className="flex gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm"><Gauge className="mt-0.5 h-4 w-4 shrink-0 text-cyan-700" />{alert}</div>)}</CardContent></Card>
          </TabsContent>
        </Tabs>

        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="flex flex-col justify-between gap-4 pt-6 md:flex-row md:items-center">
            <div className="flex gap-3"><AlertTriangle className="mt-0.5 h-6 w-6 text-amber-700" /><div><h3 className="font-orbitron font-bold text-amber-950">Orbital state persists automatically</h3><p className="text-sm text-amber-900">Platforms, levels, tiers, modules, research, resources, damage, experience, and reports are saved after every command.</p></div></div>
            <Button variant="outline" onClick={() => { const fresh = createOrbitalDefenseState(); setState(fresh); setSelectedPlatformId(fresh.platforms[0]?.id ?? ""); toast({ title: "Orbital network reset" }); }}><RefreshCw className="mr-2 h-4 w-4" /> Reset network</Button>
          </CardContent>
        </Card>
      </div>
    </GameLayout>
  );
}
