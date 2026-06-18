import GameLayout from "@/components/layout/GameLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  AiDoctrine,
  DOCTRINES,
  ENERGY_SOURCES,
  GRID_NODES,
  GridPriority,
  POWER_TECHNOLOGIES,
  TRANSMISSION_SYSTEMS,
} from "@/lib/interplanetaryPowerGrid";
import {
  advanceGridCycle,
  createInitialGridState,
  getProjectAvailability,
  getTechnologyAvailability,
  GRID_PROJECTS,
  GridIncident,
  hydrateGridState,
  InterplanetaryGridState,
  repairGridLink,
  repairGridNode,
  researchGridTechnology,
  resolveGridIncident,
  setGridDoctrine,
  setGridPriority,
  startGridProject,
  toggleGridLink,
  toggleGridNode,
  triggerGridIncident,
} from "@/lib/interplanetaryPowerSimulation";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  Atom,
  BatteryCharging,
  Bot,
  BrainCircuit,
  Cable,
  CheckCircle2,
  CircleOff,
  Coins,
  Database,
  Factory,
  FlaskConical,
  Gauge,
  Globe2,
  Hammer,
  HardDrive,
  Lock,
  Network,
  Orbit,
  Pause,
  Pickaxe,
  Play,
  RadioTower,
  RefreshCw,
  RotateCcw,
  Satellite,
  Shield,
  Sparkles,
  Sun,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "ued_interplanetary_power_grid_v2";

const priorityLabels: Record<GridPriority, string> = {
  civilian: "Civilian & Life Support",
  industry: "Industry & Construction",
  research: "Research & Computation",
  defense: "Defense & Fleet Support",
};

const priorityIcons: Record<GridPriority, LucideIcon> = {
  civilian: Globe2,
  industry: Factory,
  research: FlaskConical,
  defense: Shield,
};

const branchColors: Record<string, string> = {
  Generation: "border-amber-200 bg-amber-50 text-amber-800",
  Transmission: "border-cyan-200 bg-cyan-50 text-cyan-800",
  Storage: "border-violet-200 bg-violet-50 text-violet-800",
  "AI Control": "border-blue-200 bg-blue-50 text-blue-800",
  Extraction: "border-emerald-200 bg-emerald-50 text-emerald-800",
};

const conditionTone = {
  nominal: "bg-emerald-100 text-emerald-800",
  strained: "bg-amber-100 text-amber-800",
  brownout: "bg-orange-100 text-orange-800",
  blackout: "bg-red-100 text-red-800",
  isolated: "bg-slate-200 text-slate-700",
};

const severityTone = {
  advisory: "border-blue-200 bg-blue-50 text-blue-900",
  warning: "border-amber-200 bg-amber-50 text-amber-950",
  critical: "border-red-300 bg-red-50 text-red-950",
};

const resourceLabels: Record<string, string> = {
  metal: "Metal",
  crystal: "Crystal",
  deuterium: "Deuterium",
  helium3: "Helium-3",
  antimatter: "Antimatter",
  exoticMatter: "Exotic Matter",
  quantumCores: "Quantum Cores",
  credits: "Credits",
  data: "Data",
};

function formatAmount(value: number) {
  if (Math.abs(value) >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (Math.abs(value) >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return Math.round(value).toLocaleString();
}

function StatCard({ label, value, helper, icon: Icon, tone }: { label: string; value: string; helper: string; icon: LucideIcon; tone: string }) {
  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardContent className="flex items-center gap-4 pt-6">
        <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border", tone)}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="min-w-0">
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">{label}</div>
          <div className="truncate text-2xl font-orbitron font-bold text-slate-900">{value}</div>
          <div className="text-xs text-slate-500">{helper}</div>
        </div>
      </CardContent>
    </Card>
  );
}

function CostBadges<T extends object>({ cost }: { cost: T }) {
  return (
    <div className="flex flex-wrap gap-1">
      {Object.entries(cost).map(([resource, amount]) => amount ? (
        <Badge key={resource} variant="outline" className="bg-white text-[10px]">
          {resourceLabels[resource] ?? resource} {formatAmount(amount)}
        </Badge>
      ) : null)}
    </div>
  );
}

function IncidentCard({ incident, state, onResolve }: { incident: GridIncident; state: InterplanetaryGridState; onResolve: (id: string) => void }) {
  const target = incident.nodeId
    ? GRID_NODES.find((node) => node.id === incident.nodeId)?.name
    : state.links.find((link) => link.id === incident.linkId)?.id;
  return (
    <Card className={cn("border", severityTone[incident.severity], incident.resolved && "opacity-60")}>
      <CardContent className="space-y-3 pt-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
            <div>
              <h3 className="font-bold">{incident.title}</h3>
              <p className="mt-1 text-xs opacity-80">{incident.description}</p>
            </div>
          </div>
          <Badge variant="outline" className="bg-white/70">{incident.severity}</Badge>
        </div>
        <div className="text-xs">Target: {target ?? "System-wide"} • {incident.resolved ? "Resolved" : `${incident.remainingCycles} cycles remaining`}</div>
        <CostBadges cost={incident.resolutionCost} />
        <Button size="sm" variant={incident.severity === "critical" ? "destructive" : "outline"} disabled={incident.resolved} onClick={() => onResolve(incident.id)} className="w-full">
          {incident.resolved ? "Response complete" : "Deploy response team"}
        </Button>
      </CardContent>
    </Card>
  );
}

export default function PowerGrid() {
  const { toast } = useToast();
  const [state, setState] = useState<InterplanetaryGridState>(() => {
    if (typeof window === "undefined") return createInitialGridState();
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      return saved ? hydrateGridState(JSON.parse(saved)) : createInitialGridState();
    } catch {
      return createInitialGridState();
    }
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const doctrineInfo = DOCTRINES[state.doctrine];
  const activeIncidents = state.incidents.filter((incident) => !incident.resolved);
  const criticalIncidents = activeIncidents.filter((incident) => incident.severity === "critical").length;
  const activeLinks = state.links.filter((link) => link.enabled).length;
  const healthyNodes = state.nodes.filter((node) => node.condition === "nominal").length;
  const storagePercent = state.metrics.storageCapacity
    ? (state.metrics.storageStored / state.metrics.storageCapacity) * 100
    : 0;

  const forecast = useMemo(() => {
    const projected = state.metrics.reserve >= 0
      ? `Surplus can sustain current expansion and charge ${formatAmount(state.metrics.reserve * 0.42)} PWh next cycle.`
      : `Storage must discharge ${formatAmount(Math.abs(state.metrics.reserve))} PWh to avoid deeper load shedding.`;
    const risk = criticalIncidents
      ? `${criticalIncidents} critical incident${criticalIncidents === 1 ? "" : "s"} require command attention.`
      : state.metrics.integrity < 80
        ? "Maintenance debt is becoming the dominant network risk."
        : "No immediate cascade failure is forecast.";
    return { projected, risk };
  }, [criticalIncidents, state.metrics]);

  const update = (producer: (current: InterplanetaryGridState) => InterplanetaryGridState) => {
    setState((current) => producer(current));
  };

  const runCycle = (count = 1) => {
    setState((current) => {
      let next = current;
      for (let index = 0; index < count; index += 1) next = advanceGridCycle(next);
      return next;
    });
    toast({ title: `${count} grid cycle${count === 1 ? "" : "s"} processed`, description: "Generation, demand, storage, projects, extraction, research, wear, and incidents were settled." });
  };

  const applyDoctrine = (doctrine: AiDoctrine) => {
    update((current) => setGridDoctrine(current, doctrine));
    toast({ title: `${DOCTRINES[doctrine].label} online`, description: DOCTRINES[doctrine].description });
  };

  const resetSimulation = () => {
    const fresh = createInitialGridState();
    setState(fresh);
    toast({ title: "Grid simulation reset", description: "The initial Helios network state has been restored." });
  };

  return (
    <GameLayout>
      <div className="space-y-6">
        <Card className="relative overflow-hidden border-slate-800 bg-slate-950 text-white shadow-xl">
          <div className="absolute inset-0 opacity-35 [background-image:radial-gradient(circle_at_20%_20%,#22d3ee_0,transparent_28%),radial-gradient(circle_at_80%_10%,#f59e0b_0,transparent_23%),linear-gradient(115deg,transparent_40%,#1e40af44_50%,transparent_60%)]" />
          <CardContent className="relative grid gap-8 p-7 xl:grid-cols-[1.35fr_0.85fr]">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-200">
                <BrainCircuit className="h-3.5 w-3.5" /> AIC Interplanetary Utility Command
              </div>
              <h1 className="max-w-4xl text-3xl font-orbitron font-bold md:text-4xl">Stellar Power Grid & Autonomous Resource Network</h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
                A persistent strategic simulation for generation, transmission, storage, extraction, maintenance, incidents, construction, research, and AI load dispatch across planets, moons, stations, and resource fields.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Badge className={state.metrics.coverage >= 100 ? "bg-emerald-500/20 text-emerald-200" : "bg-red-500/25 text-red-200"}>
                  {state.metrics.coverage >= 100 ? "Demand fully covered" : `${Math.round(state.metrics.coverage)}% demand coverage`}
                </Badge>
                <Badge className="bg-blue-500/20 text-blue-200">Cycle {state.cycle}</Badge>
                <Badge className="bg-white/10 text-slate-200">{healthyNodes}/{state.nodes.length} nominal nodes</Badge>
                <Badge className={criticalIncidents ? "bg-red-500/30 text-red-100" : "bg-white/10 text-slate-200"}>{activeIncidents.length} active incidents</Badge>
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">AIC Doctrine</div>
                  <div className="mt-1 font-orbitron text-lg font-bold text-cyan-200">{doctrineInfo.label}</div>
                </div>
                <Bot className="h-8 w-8 text-cyan-300" />
              </div>
              <p className="mt-3 text-sm text-slate-300">{doctrineInfo.description}</p>
              <div className="mt-4 flex items-center justify-between text-xs text-slate-400"><span>Network efficiency</span><span>{state.metrics.efficiency}%</span></div>
              <Progress value={state.metrics.efficiency} className="mt-2 h-2" />
              <div className="mt-5 grid grid-cols-2 gap-2">
                <Button onClick={() => runCycle()} className="bg-cyan-600 hover:bg-cyan-500" data-testid="button-run-grid-cycle"><Play className="mr-2 h-4 w-4" /> Run cycle</Button>
                <Button onClick={() => runCycle(5)} variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10"><RefreshCw className="mr-2 h-4 w-4" /> Run 5</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <StatCard label="Delivered Power" value={`${formatAmount(state.metrics.delivered)} PW`} helper={`${formatAmount(state.metrics.generation)} PW generated`} icon={Zap} tone="border-amber-200 bg-amber-50 text-amber-700" />
          <StatCard label="Network Demand" value={`${formatAmount(state.metrics.demand)} PW`} helper={`${state.metrics.coverage}% coverage`} icon={Gauge} tone="border-blue-200 bg-blue-50 text-blue-700" />
          <StatCard label="Dispatch Reserve" value={`${state.metrics.reserve >= 0 ? "+" : ""}${formatAmount(state.metrics.reserve)} PW`} helper={`${Math.round(storagePercent)}% storage charged`} icon={BatteryCharging} tone="border-violet-200 bg-violet-50 text-violet-700" />
          <StatCard label="Grid Integrity" value={`${state.metrics.integrity}%`} helper={`${activeLinks}/${state.links.length} lanes active`} icon={Shield} tone="border-emerald-200 bg-emerald-50 text-emerald-700" />
          <StatCard label="Research Output" value={`${formatAmount(state.metrics.researchPerCycle)} RP`} helper={`${formatAmount(state.researchPoints)} available`} icon={Atom} tone="border-cyan-200 bg-cyan-50 text-cyan-700" />
        </div>

        <Card className="border-cyan-200 bg-gradient-to-r from-cyan-50 to-blue-50">
          <CardContent className="grid gap-4 pt-6 lg:grid-cols-[auto_1fr_1fr] lg:items-center">
            <BrainCircuit className="h-8 w-8 text-cyan-700" />
            <div><div className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-800">AIC Cycle Forecast</div><p className="mt-1 text-sm text-slate-700">{forecast.projected}</p></div>
            <div><div className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-800">Risk Assessment</div><p className="mt-1 text-sm text-slate-700">{forecast.risk}</p></div>
          </CardContent>
        </Card>

        <Tabs defaultValue="command" className="space-y-5">
          <TabsList className="grid h-auto w-full grid-cols-2 gap-1 border border-slate-200 bg-white p-1 md:grid-cols-4 xl:grid-cols-8">
            <TabsTrigger value="command" className="gap-2 py-3"><Gauge className="h-4 w-4" /> Command</TabsTrigger>
            <TabsTrigger value="network" className="gap-2 py-3"><Network className="h-4 w-4" /> Nodes</TabsTrigger>
            <TabsTrigger value="links" className="gap-2 py-3"><Cable className="h-4 w-4" /> Links</TabsTrigger>
            <TabsTrigger value="operations" className="gap-2 py-3"><Hammer className="h-4 w-4" /> Projects</TabsTrigger>
            <TabsTrigger value="resources" className="gap-2 py-3"><Pickaxe className="h-4 w-4" /> Economy</TabsTrigger>
            <TabsTrigger value="technology" className="gap-2 py-3"><Atom className="h-4 w-4" /> Research</TabsTrigger>
            <TabsTrigger value="catalog" className="gap-2 py-3"><Database className="h-4 w-4" /> Catalog</TabsTrigger>
            <TabsTrigger value="intel" className="gap-2 py-3"><AlertTriangle className="h-4 w-4" /> Intel</TabsTrigger>
          </TabsList>

          <TabsContent value="command" className="space-y-5">
            <div className="grid gap-4 lg:grid-cols-5">
              {(Object.keys(DOCTRINES) as AiDoctrine[]).map((doctrine) => (
                <button key={doctrine} onClick={() => applyDoctrine(doctrine)} className={cn("rounded-xl border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500", state.doctrine === doctrine ? "border-blue-500 bg-blue-50 shadow-sm" : "border-slate-200 bg-white hover:border-blue-300")}>
                  <Bot className={cn("mb-3 h-5 w-5", state.doctrine === doctrine ? "text-blue-700" : "text-slate-500")} />
                  <div className="font-bold text-slate-900">{DOCTRINES[doctrine].label}</div>
                  <div className="mt-2 text-xs text-slate-500">{DOCTRINES[doctrine].bonus}</div>
                </button>
              ))}
            </div>

            <Card className="border-slate-200 bg-white">
              <CardHeader>
                <CardTitle>Automated load priority</CardTitle>
                <p className="text-sm text-slate-500">Adjusting one sector automatically normalizes all four allocations to 100%. Hard life-support safety floors remain enforced by the AIC.</p>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                {(Object.keys(state.priorities) as GridPriority[]).map((priority) => {
                  const Icon = priorityIcons[priority];
                  return (
                    <div key={priority} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <div className="mb-3 flex items-center justify-between"><span className="flex items-center gap-2 font-semibold"><Icon className="h-4 w-4" />{priorityLabels[priority]}</span><b>{state.priorities[priority]}%</b></div>
                      <Slider value={[state.priorities[priority]]} min={5} max={60} step={1} onValueChange={([value]) => update((current) => setGridPriority(current, priority, value))} />
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <div className="grid gap-4 lg:grid-cols-3">
              <Card className="border-slate-200 bg-white">
                <CardHeader><CardTitle className="text-base">Storage & black-start</CardTitle></CardHeader>
                <CardContent>
                  <div className="mb-2 flex justify-between text-sm"><span>{formatAmount(state.metrics.storageStored)} PWh stored</span><b>{Math.round(storagePercent)}%</b></div>
                  <Progress value={storagePercent} />
                  <p className="mt-3 text-xs text-slate-500">Storage covers peaks, starts isolated worlds, and absorbs stellar surplus before curtailment.</p>
                </CardContent>
              </Card>
              <Card className="border-slate-200 bg-white">
                <CardHeader><CardTitle className="text-base">Operating expense</CardTitle></CardHeader>
                <CardContent>
                  <div className="text-2xl font-orbitron font-bold text-slate-900">{formatAmount(state.metrics.maintenanceCost)} cr</div>
                  <p className="mt-2 text-xs text-slate-500">Per-cycle link maintenance plus deferred node repair liabilities.</p>
                </CardContent>
              </Card>
              <Card className="border-slate-200 bg-white">
                <CardHeader><CardTitle className="text-base">Manual controls</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-2 gap-2">
                  <Button variant="outline" onClick={() => setState((current) => ({ ...current, paused: !current.paused }))}>{state.paused ? <Play className="mr-2 h-4 w-4" /> : <Pause className="mr-2 h-4 w-4" />}{state.paused ? "Resume" : "Pause"}</Button>
                  <Button variant="outline" onClick={() => update((current) => triggerGridIncident(current))}><AlertTriangle className="mr-2 h-4 w-4" /> Drill</Button>
                  <Button variant="outline" onClick={() => setState((current) => ({ ...current, automationEnabled: !current.automationEnabled }))} className="col-span-2"><Bot className="mr-2 h-4 w-4" /> Automation {state.automationEnabled ? "enabled" : "disabled"}</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="network" className="space-y-4">
            <div className="grid gap-4 xl:grid-cols-2">
              {GRID_NODES.map((baseNode) => {
                const node = state.nodes.find((entry) => entry.id === baseNode.id);
                if (!node) return null;
                const surplus = node.deliveredPower - (baseNode.demand * node.demandMultiplier);
                return (
                  <Card key={node.id} className={cn("border-slate-200 bg-white shadow-sm", node.condition === "blackout" && "border-red-300")}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-200 bg-cyan-50 text-cyan-700">
                            {baseNode.bodyType === "star" ? <Sun className="h-5 w-5" /> : baseNode.bodyType === "station" ? <Satellite className="h-5 w-5" /> : <Orbit className="h-5 w-5" />}
                          </div>
                          <div><CardTitle>{baseNode.name}</CardTitle><p className="text-xs text-slate-500">{baseNode.role}</p></div>
                        </div>
                        <Badge className={conditionTone[node.condition]}>{node.condition}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-4 gap-2 text-center text-xs">
                        <div className="rounded-lg bg-slate-50 p-2"><div className="text-slate-500">Base gen</div><b>{formatAmount(baseNode.generation)}</b></div>
                        <div className="rounded-lg bg-slate-50 p-2"><div className="text-slate-500">Delivered</div><b>{formatAmount(node.deliveredPower)}</b></div>
                        <div className="rounded-lg bg-slate-50 p-2"><div className="text-slate-500">Balance</div><b className={surplus < 0 ? "text-red-700" : "text-emerald-700"}>{surplus >= 0 ? "+" : ""}{formatAmount(surplus)}</b></div>
                        <div className="rounded-lg bg-slate-50 p-2"><div className="text-slate-500">Threat</div><b>{Math.round(node.threat)}%</b></div>
                      </div>
                      <div>
                        <div className="mb-1 flex justify-between text-xs text-slate-500"><span>Integrity</span><span>{Math.round(node.integrity)}%</span></div>
                        <Progress value={node.integrity} className="h-2" />
                      </div>
                      <div>
                        <div className="mb-1 flex justify-between text-xs text-slate-500"><span>Storage</span><span>{formatAmount(node.storageLevel)} / {formatAmount(node.storageCapacity)} PWh</span></div>
                        <Progress value={(node.storageLevel / Math.max(1, node.storageCapacity)) * 100} className="h-2" />
                      </div>
                      <div className="flex flex-wrap gap-2">{baseNode.resources.map((resource) => <Badge key={resource} variant="outline">{resource}</Badge>)}</div>
                      <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" onClick={() => update((current) => toggleGridNode(current, node.id))}>{node.enabled ? <CircleOff className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}{node.enabled ? "Isolate" : "Reconnect"}</Button>
                        <Button variant="outline" disabled={node.integrity >= 99} onClick={() => update((current) => repairGridNode(current, node.id))}><Wrench className="mr-2 h-4 w-4" /> Repair</Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="links" className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-2">
              {state.links.map((link) => {
                const from = GRID_NODES.find((node) => node.id === link.from)?.name ?? link.from;
                const to = GRID_NODES.find((node) => node.id === link.to)?.name ?? link.to;
                return (
                  <Card key={link.id} className={cn("border-slate-200 bg-white", !link.enabled && "opacity-75")}>
                    <CardContent className="space-y-4 pt-6">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex gap-3"><RadioTower className="h-6 w-6 text-cyan-700" /><div><h3 className="font-orbitron font-bold">{from} → {to}</h3><p className="text-xs capitalize text-slate-500">{link.type} transmission lane</p></div></div>
                        <Badge className={link.enabled ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-700"}>{link.enabled ? "online" : "offline"}</Badge>
                      </div>
                      <div className="grid grid-cols-4 gap-2 text-center text-xs">
                        <div className="rounded-lg bg-slate-50 p-2"><div className="text-slate-500">Flow</div><b>{formatAmount(link.flow)}</b></div>
                        <div className="rounded-lg bg-slate-50 p-2"><div className="text-slate-500">Capacity</div><b>{formatAmount(link.capacity)}</b></div>
                        <div className="rounded-lg bg-slate-50 p-2"><div className="text-slate-500">Efficiency</div><b>{Math.round(link.efficiency)}%</b></div>
                        <div className="rounded-lg bg-slate-50 p-2"><div className="text-slate-500">Threat</div><b>{Math.round(link.threat)}%</b></div>
                      </div>
                      <div><div className="mb-1 flex justify-between text-xs text-slate-500"><span>Lane integrity</span><span>{Math.round(link.integrity)}%</span></div><Progress value={link.integrity} /></div>
                      <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" onClick={() => update((current) => toggleGridLink(current, link.id))}>{link.enabled ? "Take offline" : "Activate lane"}</Button>
                        <Button variant="outline" disabled={link.integrity >= 99} onClick={() => update((current) => repairGridLink(current, link.id))}><Wrench className="mr-2 h-4 w-4" /> Repair</Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="operations" className="space-y-5">
            {state.activeProjects.length > 0 && (
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader><CardTitle>Active construction queue</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  {state.activeProjects.map((project) => {
                    const definition = GRID_PROJECTS.find((entry) => entry.id === project.definitionId);
                    return (
                      <div key={project.id} className="rounded-lg border border-blue-200 bg-white p-4">
                        <div className="flex justify-between gap-3"><div><b>{definition?.name}</b><p className="text-xs text-slate-500">{definition?.effect}</p></div><span className="text-sm font-bold">{Math.round((project.progress / project.duration) * 100)}%</span></div>
                        <Progress value={(project.progress / project.duration) * 100} className="mt-3" />
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            )}
            <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
              {GRID_PROJECTS.map((project) => {
                const availability = getProjectAvailability(state, project);
                return (
                  <Card key={project.id} className={cn("border-slate-200 bg-white", availability.alreadyBuilt && "border-emerald-300 bg-emerald-50/30")}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-3"><CardTitle className="text-base">{project.name}</CardTitle><Badge variant="outline" className="capitalize">{project.category}</Badge></div>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      <p className="text-slate-600">{project.description}</p>
                      <div className="rounded-lg bg-slate-50 p-3 font-medium">{project.effect}</div>
                      <div className="text-xs text-slate-500">Duration: {project.duration} cycles{project.requiredTechnology ? ` • Requires ${POWER_TECHNOLOGIES.find((tech) => tech.id === project.requiredTechnology)?.name}` : ""}</div>
                      <CostBadges cost={project.cost} />
                      <Button className="w-full" disabled={!availability.available} onClick={() => update((current) => startGridProject(current, project.id))}>
                        {availability.alreadyBuilt ? "Operational" : availability.active ? "Under construction" : !availability.technologyMet ? "Technology locked" : !availability.affordable ? "Insufficient resources" : "Commission project"}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="resources" className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {Object.entries(state.stockpile).map(([resource, amount]) => (
                <Card key={resource} className="border-slate-200 bg-white">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between"><span className="text-xs font-bold uppercase tracking-wider text-slate-500">{resourceLabels[resource]}</span>{resource === "credits" ? <Coins className="h-4 w-4 text-amber-600" /> : resource === "data" ? <HardDrive className="h-4 w-4 text-blue-600" /> : <Pickaxe className="h-4 w-4 text-emerald-600" />}</div>
                    <div className="mt-2 text-2xl font-orbitron font-bold">{formatAmount(amount)}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
              <StatCard label="Extraction Yield" value={`${formatAmount(state.metrics.extraction)}/cycle`} helper="Scaled by field power and automation" icon={Pickaxe} tone="border-emerald-200 bg-emerald-50 text-emerald-700" />
              <StatCard label="Lifetime Energy" value={`${formatAmount(state.lifetimeEnergy)} PW`} helper="Delivered since simulation start" icon={Zap} tone="border-amber-200 bg-amber-50 text-amber-700" />
              <StatCard label="Lifetime Research" value={`${formatAmount(state.lifetimeResearch)} RP`} helper="Generated by grid-linked laboratories" icon={FlaskConical} tone="border-blue-200 bg-blue-50 text-blue-700" />
            </div>
            <Card className="border-slate-200 bg-white">
              <CardHeader><CardTitle>Economy mechanics</CardTitle></CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {[
                  ["Powered extraction", "Remote fields produce in proportion to delivered power, integrity, and autonomous-mining upgrades."],
                  ["Surplus markets", "Unused power earns credits; an interstellar exchange adds a second export premium."],
                  ["Maintenance debt", "Every active lane and damaged node consumes credits each cycle. Unpaid costs eventually starve construction."],
                  ["Matter conversion", "Final-era technologies turn stellar surplus into antimatter, exotic matter, data, and strategic manufacturing capacity."],
                ].map(([title, detail]) => <div key={title} className="rounded-lg border border-slate-200 bg-slate-50 p-4"><b>{title}</b><p className="mt-2 text-xs text-slate-600">{detail}</p></div>)}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="technology" className="space-y-5">
            <Card className="border-slate-200 bg-slate-950 text-white">
              <CardContent className="flex flex-col justify-between gap-4 pt-6 sm:flex-row sm:items-center">
                <div><div className="text-xs uppercase tracking-[0.2em] text-slate-400">Available grid science</div><div className="mt-1 text-3xl font-orbitron font-bold text-cyan-300">{formatAmount(state.researchPoints)} RP</div></div>
                <div className="text-sm text-slate-300">{state.unlockedTechnologies.length} / {POWER_TECHNOLOGIES.length} technologies operational</div>
              </CardContent>
            </Card>
            {[1, 2, 3, 4, 5].map((era) => (
              <div key={era} className="space-y-3">
                <div className="flex items-center gap-3"><div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 font-bold text-white">{era}</div><h3 className="font-orbitron text-lg font-bold">Era {era}</h3><div className="h-px flex-1 bg-slate-200" /></div>
                <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
                  {POWER_TECHNOLOGIES.filter((technology) => technology.era === era).map((technology) => {
                    const availability = getTechnologyAvailability(state, technology.id);
                    return (
                      <Card key={technology.id} className={cn("border-slate-200 bg-white", availability.researched && "border-emerald-300 bg-emerald-50/30", !availability.prerequisitesMet && "opacity-75")}>
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between gap-2"><CardTitle className="text-base">{technology.name}</CardTitle>{availability.researched ? <CheckCircle2 className="h-5 w-5 text-emerald-600" /> : availability.prerequisitesMet ? <Atom className="h-5 w-5 text-blue-600" /> : <Lock className="h-5 w-5 text-slate-400" />}</div>
                          <Badge variant="outline" className={cn("w-fit", branchColors[technology.branch])}>{technology.branch}</Badge>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                          <p className="text-slate-600">{technology.description}</p>
                          <div className="rounded-lg bg-slate-50 p-3 font-medium text-slate-800">{technology.effect}</div>
                          <div className="text-xs text-slate-500">Prerequisites: {technology.prerequisites.length ? technology.prerequisites.map((id) => POWER_TECHNOLOGIES.find((entry) => entry.id === id)?.name).join(", ") : "None"}</div>
                          <CostBadges cost={technology.resourceCost} />
                          <Button className="w-full" disabled={!availability.available} onClick={() => update((current) => researchGridTechnology(current, technology.id))}>
                            {availability.researched ? "Operational" : !availability.prerequisitesMet ? "Prerequisites locked" : !availability.affordable ? "Resources unavailable" : `Research • ${formatAmount(technology.researchCost)} RP`}
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="catalog" className="space-y-5">
            <div>
              <h2 className="text-xl font-orbitron font-bold">Generation families</h2>
              <div className="mt-3 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
                {ENERGY_SOURCES.map((source) => (
                  <Card key={source.id} className="border-slate-200 bg-white">
                    <CardHeader><div className="flex justify-between gap-3"><CardTitle className="text-base">{source.name}</CardTitle><Badge className="bg-amber-100 text-amber-800">{source.output} PW</Badge></div><p className="text-xs text-slate-500">{source.family} • {source.worlds.join(", ")}</p></CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      <div className="grid grid-cols-2 gap-2"><div className="rounded-lg bg-slate-50 p-2"><span className="text-xs text-slate-500">Stability</span><div className="font-bold">{source.stability}%</div></div><div className="rounded-lg bg-slate-50 p-2"><span className="text-xs text-slate-500">Ramp</span><div className="font-bold">{source.ramp}</div></div></div>
                      <div><b>Fuel:</b> {source.fuel}</div><div><b>Byproducts:</b> {source.byproducts.join(", ")}</div>
                      <div className="flex gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />{source.risk}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-xl font-orbitron font-bold">Transmission technologies</h2>
              <div className="mt-3 grid gap-4 lg:grid-cols-2">
                {TRANSMISSION_SYSTEMS.map((system) => (
                  <Card key={system.id} className="border-slate-200 bg-white"><CardContent className="space-y-3 pt-6"><div className="flex justify-between gap-3"><div className="flex gap-3"><RadioTower className="h-5 w-5 text-cyan-700" /><div><b>{system.name}</b><p className="text-xs text-slate-500">{system.range}</p></div></div><Badge variant="outline">{system.efficiency}%</Badge></div><p className="text-sm text-slate-600">{system.purpose}</p><div className="rounded-lg bg-red-50 p-3 text-xs text-red-900"><b>Counterplay:</b> {system.counterplay}</div></CardContent></Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="intel" className="space-y-5">
            {activeIncidents.length ? (
              <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
                {state.incidents.slice(0, 9).map((incident) => <IncidentCard key={incident.id} incident={incident} state={state} onResolve={(id) => update((current) => resolveGridIncident(current, id))} />)}
              </div>
            ) : (
              <Card className="border-emerald-200 bg-emerald-50"><CardContent className="flex items-center gap-3 pt-6 text-emerald-900"><CheckCircle2 className="h-6 w-6" /><div><b>No active incidents</b><p className="text-sm">AIC monitoring has not detected a current operational emergency.</p></div></CardContent></Card>
            )}
            <Card className="border-slate-200 bg-white">
              <CardHeader><CardTitle>Command audit log</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {state.log.slice(0, 20).map((entry) => (
                  <div key={entry.id} className="grid gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3 md:grid-cols-[90px_150px_1fr] md:items-center">
                    <span className="text-xs font-mono text-slate-500">Cycle {entry.cycle}</span>
                    <Badge variant="outline" className="w-fit capitalize">{entry.category}</Badge>
                    <div><b className="text-sm">{entry.title}</b><p className="text-xs text-slate-600">{entry.detail}</p></div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="border-slate-300 bg-slate-100">
          <CardContent className="flex flex-col justify-between gap-4 pt-6 md:flex-row md:items-center">
            <div><h3 className="font-orbitron font-bold text-slate-900">Persistent simulation controls</h3><p className="mt-1 text-sm text-slate-600">State is automatically saved in this browser after every command and cycle.</p></div>
            <Button variant="outline" onClick={resetSimulation}><RotateCcw className="mr-2 h-4 w-4" /> Reset power grid</Button>
          </CardContent>
        </Card>
      </div>
    </GameLayout>
  );
}
