import GameLayout from "@/components/layout/GameLayout";
import { useGame } from "@/lib/gameContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  BACKGROUND_ASSETS,
  MENU_ASSETS,
  OGAMEX_FEATURED_ASSETS,
  SHIP_ASSETS,
  type YardEntry,
} from "@shared/config";
import {
  Box,
  Gem,
  Database,
  Plus,
  Shield,
  Sword,
  User,
  Truck,
  Hammer,
  Hexagon,
  Target,
  Rocket,
  Lock,
  Wrench,
  TimerReset,
  Factory,
  Orbit,
  Activity,
} from "lucide-react";
import { useMemo, useState } from "react";
import { unitData, type UnitItem } from "@/lib/unitData";
import { cn } from "@/lib/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import AdvancedConstructorDock from "@/components/shipyard/AdvancedConstructorDock";

const TEMP_THEME_IMAGE = "/theme-temp.png";

type ConstructorYardQueueItem = {
  id: string;
  entryId: string;
  domain: "mothership" | "starship";
  fromLevel: number;
  toLevel: number;
  startedAt: number;
  endsAt: number;
  status: "running" | "completed";
};

type ConstructorYardStatus = {
  state: {
    levels: Record<string, number>;
    upgrades: ConstructorYardQueueItem[];
    lastUpdated: number;
  };
  activeUpgrades: ConstructorYardQueueItem[];
  completedUpgrades: ConstructorYardQueueItem[];
  effectSummary: {
    totalHull: number;
    totalShields: number;
    totalFirepower: number;
    totalCargo: number;
  };
};

type ConstructorYardCatalogResponse = {
  success: boolean;
  total: number;
  entries: YardEntry[];
};

type ConstructorYardStatusResponse = {
  success: boolean;
  status: ConstructorYardStatus;
};

function getUnitImagePath(item: UnitItem) {
  if (item.id === "interceptor") return SHIP_ASSETS.FIGHTERS.INTERCEPTOR.path;
  if (item.id === "heavyFighter") return SHIP_ASSETS.FIGHTERS.FIGHTER.path;
  if (item.id === "lightFighter") return SHIP_ASSETS.FIGHTERS.SCOUT.path;
  if (item.id === "battleship") return SHIP_ASSETS.CAPITALS.BATTLESHIP.path;
  if (item.id === "battlecruiser") return SHIP_ASSETS.CAPITALS.BATTLECRUISER.path;
  if (item.id === "destroyer") return SHIP_ASSETS.CAPITALS.DESTROYER.path;
  if (item.id === "cruiser" || item.id === "bomber") return SHIP_ASSETS.CAPITALS.CORVETTE.path;
  if (item.id === "colonyShip") return SHIP_ASSETS.SPECIAL.COLONIZER.path;
  if (item.id === "smallCargo" || item.id === "largeCargo" || item.id === "recycler") return SHIP_ASSETS.SPECIAL.TRANSPORT.path;
  if (item.id === "espionageProbe") return SHIP_ASSETS.FIGHTERS.SCOUT.path;
  if (item.id === "mothership" || item.id === "deathstar") return SHIP_ASSETS.SPECIAL.CARRIER.path;
  if (item.class === "super" || item.class === "titan") return SHIP_ASSETS.SPECIAL.CARRIER.path;
  if (item.class === "troop") return MENU_ASSETS.BUILDINGS.SPACEPORT.path;
  if (item.class === "vehicle") return SHIP_ASSETS.CAPITALS.CORVETTE.path;
  return SHIP_ASSETS.FIGHTERS.FIGHTER.path;
}

function getQueueImagePath(itemId?: string, name?: string) {
  const unit = unitData.find((entry) => entry.id === itemId || entry.name === name);
  return unit ? getUnitImagePath(unit) : SHIP_ASSETS.SPECIAL.TRANSPORT.path;
}

function getYardImagePath(entry: YardEntry) {
  if (entry.domain === "mothership") {
    return entry.class.includes("Carrier") ? SHIP_ASSETS.SPECIAL.CARRIER.path : MENU_ASSETS.BUILDINGS.SPACEPORT.path;
  }
  if (entry.class.includes("Interceptor")) return SHIP_ASSETS.FIGHTERS.INTERCEPTOR.path;
  if (entry.class.includes("Frigate")) return SHIP_ASSETS.CAPITALS.CORVETTE.path;
  if (entry.class.includes("Cruiser")) return SHIP_ASSETS.CAPITALS.BATTLECRUISER.path;
  if (entry.class.includes("Battleship")) return SHIP_ASSETS.CAPITALS.BATTLESHIP.path;
  return SHIP_ASSETS.CAPITALS.DESTROYER.path;
}

function formatDuration(seconds: number) {
  if (seconds <= 0) return "Ready";
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${secs}s`;
  return `${secs}s`;
}

const UnitCard = ({
  item,
  count,
  onBuild,
  resources,
  buildings,
}: {
  item: UnitItem;
  count: number;
  onBuild: (id: string, amount: number, name: string, time: number) => void;
  resources: any;
  buildings: any;
}) => {
  const [amount, setAmount] = useState(1);
  const totalMetal = item.cost.metal * amount;
  const totalCrystal = item.cost.crystal * amount;
  const totalDeut = item.cost.deuterium * amount;
  const buildTime = 2000;
  const requiredShipyard = item.class === "titan" ? 12 : item.class === "super" ? 8 : item.class === "capital" ? 4 : 1;
  const meetsRequirement = (buildings?.shipyard || 0) >= requiredShipyard;
  const canAfford = resources.metal >= totalMetal && resources.crystal >= totalCrystal && resources.deuterium >= totalDeut;
  const canBuild = canAfford && meetsRequirement;
  const totalPower = item.stats.attack + item.stats.shield + item.stats.structure / 10;

  return (
    <Card className={cn("bg-white border-slate-200 hover:border-primary/50 transition-all group overflow-hidden shadow-sm flex flex-col h-full", !meetsRequirement && "opacity-60")} data-testid={`card-unit-${item.id}`}>
      <div className={cn("h-32 relative border-b border-slate-200 bg-cover bg-center", item.class === "titan" && "from-red-50 to-red-100", item.class === "super" && "from-purple-50 to-purple-100")} style={{ backgroundImage: `linear-gradient(rgba(248,250,252,0.92), rgba(241,245,249,0.88)), url(${BACKGROUND_ASSETS.SHIPYARD.path})` }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <img src={getUnitImagePath(item)} alt={item.name} className="w-24 h-24 object-contain" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = TEMP_THEME_IMAGE; }} />
        </div>
        <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded text-xs font-mono text-primary border border-slate-200 shadow-sm">Owned: {count}</div>
        <div className="absolute top-2 left-2 flex gap-2">
          <Badge variant="outline" className={cn("text-[10px] uppercase", item.class === "titan" ? "border-red-200 text-red-600 bg-red-50" : item.class === "super" ? "border-purple-200 text-purple-600 bg-purple-50" : "border-slate-200 text-slate-500 bg-white")}>{item.class}</Badge>
          <img src={MENU_ASSETS.BUILDINGS.SHIPYARD.path} alt="yard" className="w-6 h-6 rounded bg-white border border-slate-200 p-1" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = TEMP_THEME_IMAGE; }} />
        </div>
        {!meetsRequirement && <div className="absolute bottom-2 left-2"><Badge variant="outline" className="bg-red-50 text-red-600 border-red-200 text-[10px]"><Lock className="w-2 h-2 mr-1" /> Shipyard Lvl {requiredShipyard}</Badge></div>}
      </div>
      <CardHeader className="pb-2"><CardTitle className="text-base font-orbitron text-slate-900">{item.name}</CardTitle></CardHeader>
      <CardContent className="pb-2 flex-1 space-y-3">
        <p className="text-xs text-muted-foreground min-h-[2rem]">{item.description}</p>
        <div className="bg-slate-50 p-2 rounded border border-slate-100">
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[10px] uppercase tracking-wider text-slate-500">
            <div className="flex items-center gap-1"><Shield className="w-3 h-3 text-blue-500" /> Hull:<span className="text-slate-900 font-mono">{item.stats.structure.toLocaleString()}</span></div>
            <div className="flex items-center gap-1"><Sword className="w-3 h-3 text-red-500" /> Atk:<span className="text-slate-900 font-mono">{item.stats.attack.toLocaleString()}</span></div>
            <div className="flex items-center gap-1"><Shield className="w-3 h-3 text-green-500" /> Shld:<span className="text-slate-900 font-mono">{item.stats.shield.toLocaleString()}</span></div>
            <div className="flex items-center gap-1"><Rocket className="w-3 h-3 text-purple-500" /> Spd:<span className="text-slate-900 font-mono">{item.stats.speed.toLocaleString()}</span></div>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-200 flex items-center justify-between text-[10px]"><span className="text-slate-500 flex items-center gap-1"><Target className="w-3 h-3" /> Combat Power</span><span className="font-mono font-bold text-primary">{Math.floor(totalPower).toLocaleString()}</span></div>
        </div>
        <Separator />
        <div className="space-y-1">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Cost per unit</div>
          {item.cost.metal > 0 && <div className="flex items-center justify-between text-xs text-slate-600"><span className="flex items-center gap-1"><Box className="w-3 h-3" /> Metal</span><span className={cn("font-mono", resources.metal < totalMetal ? "text-red-600 font-bold" : "text-slate-900")}>{item.cost.metal.toLocaleString()}</span></div>}
          {item.cost.crystal > 0 && <div className="flex items-center justify-between text-xs text-blue-600"><span className="flex items-center gap-1"><Gem className="w-3 h-3" /> Crystal</span><span className={cn("font-mono", resources.crystal < totalCrystal ? "text-red-600 font-bold" : "text-slate-900")}>{item.cost.crystal.toLocaleString()}</span></div>}
          {item.cost.deuterium > 0 && <div className="flex items-center justify-between text-xs text-green-600"><span className="flex items-center gap-1"><Database className="w-3 h-3" /> Deuterium</span><span className={cn("font-mono", resources.deuterium < totalDeut ? "text-red-600 font-bold" : "text-slate-900")}>{item.cost.deuterium.toLocaleString()}</span></div>}
        </div>
        <div className="flex gap-2 pt-2">
          <Input type="number" min="1" max="1000" value={amount} onChange={(e) => setAmount(Math.max(1, parseInt(e.target.value) || 1))} className="bg-slate-50 border-slate-200 h-8 text-xs font-mono text-slate-900" data-testid={`input-amount-${item.id}`} />
          <div className="flex gap-1">{[1, 10, 100].map((n) => <Button key={n} variant="ghost" size="sm" className="h-8 px-2 text-xs" onClick={() => setAmount(n)}>{n}</Button>)}</div>
        </div>
        {amount > 1 && <div className="text-[10px] text-muted-foreground bg-slate-50 p-2 rounded">Total: {totalMetal.toLocaleString()} M / {totalCrystal.toLocaleString()} C / {totalDeut.toLocaleString()} D</div>}
      </CardContent>
      <CardFooter><Button className="w-full bg-primary text-white hover:bg-primary/90 font-orbitron text-xs h-9" disabled={!canBuild} onClick={() => onBuild(item.id, amount, item.name, buildTime)} data-testid={`button-build-${item.id}`}>{!meetsRequirement ? <><Lock className="w-3 h-3 mr-2" /> LOCKED</> : canAfford ? <><Plus className="w-3 h-3 mr-2" /> BUILD {amount > 1 ? `${amount}x` : ""}</> : "NO RESOURCES"}</Button></CardFooter>
    </Card>
  );
};
function ConstructorYardPanel({ title, description, domain, entries, status, onStartUpgrade, onCompleteUpgrade, isStarting, isCompleting }: { title: string; description: string; domain: "mothership" | "starship"; entries: YardEntry[]; status?: ConstructorYardStatus; onStartUpgrade: (entryId: string, targetLevel: number) => void; onCompleteUpgrade: (entryId: string) => void; isStarting: boolean; isCompleting: boolean; }) {
  const runningById = new Map((status?.activeUpgrades || []).map((item) => [item.entryId, item]));
  return (
    <div className="space-y-4">
      <Card className="overflow-hidden border-slate-200 shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4 text-white bg-cover bg-center" style={{ backgroundImage: `linear-gradient(rgba(15,23,42,0.85), rgba(15,23,42,0.92)), url(${domain === "mothership" ? OGAMEX_FEATURED_ASSETS.SHIPS.path : BACKGROUND_ASSETS.SHIPYARD.path})` }}>
          <div className="flex items-start gap-4">
            <img src={domain === "mothership" ? SHIP_ASSETS.SPECIAL.CARRIER.path : MENU_ASSETS.BUILDINGS.SHIPYARD.path} alt={title} className="w-14 h-14 rounded-xl bg-white/10 border border-white/10 p-2 object-contain" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = TEMP_THEME_IMAGE; }} />
            <div>
              <div className="text-[10px] uppercase tracking-[0.24em] text-cyan-200/80">{domain === "mothership" ? "Mothership Core" : "Starship Line"}</div>
              <h3 className="font-orbitron text-xl font-bold">{title}</h3>
              <p className="mt-1 text-sm text-slate-300">{description}</p>
            </div>
          </div>
        </div>
        <CardContent className="p-4 grid gap-3 md:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3"><div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Entries</div><div className="mt-1 text-2xl font-orbitron font-bold text-slate-900">{entries.length}</div></div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3"><div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Active Upgrades</div><div className="mt-1 text-2xl font-orbitron font-bold text-blue-700">{(status?.activeUpgrades || []).filter((item) => item.domain === domain).length}</div></div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3"><div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Total Hull</div><div className="mt-1 text-2xl font-orbitron font-bold text-emerald-700">{(status?.effectSummary.totalHull || 0).toLocaleString()}</div></div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3"><div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Total Firepower</div><div className="mt-1 text-2xl font-orbitron font-bold text-red-700">{(status?.effectSummary.totalFirepower || 0).toLocaleString()}</div></div>
        </CardContent>
      </Card>
      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {entries.map((entry) => {
          const currentLevel = status?.state.levels?.[entry.id] || 1;
          const running = runningById.get(entry.id);
          const remainingSec = running ? Math.max(0, Math.ceil((running.endsAt - Date.now()) / 1000)) : 0;
          return (
            <Card key={entry.id} className="overflow-hidden border-slate-200 shadow-sm">
              <div className="relative h-28 border-b border-slate-200 bg-slate-900">
                <img src={getYardImagePath(entry)} alt={entry.name} className="absolute inset-0 h-full w-full object-contain p-4" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = TEMP_THEME_IMAGE; }} />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-900/45 to-transparent" />
                <div className="absolute left-3 top-3 rounded-full border border-cyan-200/20 bg-cyan-300/10 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-100">{entry.rankTitle}</div>
                <div className="absolute right-3 top-3 rounded-full border border-white/20 bg-black/30 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white">Rarity {entry.rarity}</div>
              </div>
              <CardHeader className="pb-2"><CardTitle className="text-base font-orbitron text-slate-900">{entry.name}</CardTitle><p className="text-xs text-slate-500">{entry.class} / {entry.subClass} / Tier {entry.tier}</p></CardHeader>
              <CardContent className="space-y-3">
                <p className="text-xs text-slate-600">{entry.description}</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded border border-slate-200 bg-slate-50 p-2"><div className="text-slate-500">Current Level</div><div className="font-semibold text-slate-900">{currentLevel}</div></div>
                  <div className="rounded border border-slate-200 bg-slate-50 p-2"><div className="text-slate-500">Required</div><div className="font-semibold text-slate-900">{entry.requiredLevel}</div></div>
                  <div className="rounded border border-slate-200 bg-slate-50 p-2"><div className="text-slate-500">Hull</div><div className="font-semibold text-slate-900">{entry.stats.hull.toLocaleString()}</div></div>
                  <div className="rounded border border-slate-200 bg-slate-50 p-2"><div className="text-slate-500">Firepower</div><div className="font-semibold text-slate-900">{entry.stats.firepower.toLocaleString()}</div></div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-3">
                  <div className="mb-2 flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-slate-500"><span>Upgrade Cost</span><span>Base {formatDuration(entry.baseUpgradeTimeSec)}</span></div>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center justify-between"><span className="flex items-center gap-1"><Box className="w-3 h-3" /> Metal</span><span className="font-mono">{entry.baseUpgradeCost.metal.toLocaleString()}</span></div>
                    <div className="flex items-center justify-between"><span className="flex items-center gap-1"><Gem className="w-3 h-3" /> Crystal</span><span className="font-mono">{entry.baseUpgradeCost.crystal.toLocaleString()}</span></div>
                    <div className="flex items-center justify-between"><span className="flex items-center gap-1"><Database className="w-3 h-3" /> Deuterium</span><span className="font-mono">{entry.baseUpgradeCost.deuterium.toLocaleString()}</span></div>
                  </div>
                </div>
                {running ? <div className="rounded-xl border border-blue-200 bg-blue-50 p-3"><div className="flex items-center justify-between text-sm"><span className="font-semibold text-blue-900">Upgrade in progress</span><span className="font-mono text-blue-700">{formatDuration(remainingSec)}</span></div><div className="mt-2 text-xs text-blue-700">Level {running.fromLevel} to {running.toLevel}</div><Progress value={Math.max(3, Math.min(100, ((Date.now() - running.startedAt) / (running.endsAt - running.startedAt)) * 100))} className="mt-3 h-2" /></div> : null}
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button className="flex-1" variant={running ? "secondary" : "default"} disabled={isStarting || !!running} onClick={() => onStartUpgrade(entry.id, currentLevel + 1)}><Wrench className="w-4 h-4 mr-2" />Upgrade +1</Button>
                <Button className="flex-1" variant="outline" disabled={isCompleting || !running || remainingSec > 0} onClick={() => onCompleteUpgrade(entry.id)}><TimerReset className="w-4 h-4 mr-2" />Complete</Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default function Shipyard() {
  const { toast } = useToast();
  const { units, resources, buildUnit, queue, buildings } = useGame();
  const combatShips = unitData.filter((u) => u.class === "fighter" || u.class === "capital");
  const civilShips = unitData.filter((u) => u.class === "civilian");
  const troops = unitData.filter((u) => u.class === "troop");
  const vehicles = unitData.filter((u) => u.class === "vehicle");
  const supers = unitData.filter((u) => u.class === "super");
  const titans = unitData.filter((u) => u.class === "titan");
  const unitQueue = queue.filter((q) => q.type === "unit");
  const totalFleetPower = useMemo(() => Object.entries(units).reduce((sum, [id, count]) => { const unit = unitData.find((u) => u.id === id); if (!unit) return sum; const power = unit.stats.attack + unit.stats.shield + unit.stats.structure / 10; return sum + power * count; }, 0), [units]);
  const totalShips = useMemo(() => Object.values(units).reduce((a, b) => a + b, 0), [units]);

  const { data: starshipCatalog } = useQuery<ConstructorYardCatalogResponse>({ queryKey: ["/api/constructor-yard/catalog", "starship"], queryFn: async () => { const res = await fetch("/api/constructor-yard/catalog?domain=starship", { credentials: "include" }); if (!res.ok) throw new Error("Failed to load starship constructor yard"); return res.json(); } });
  const { data: mothershipCatalog } = useQuery<ConstructorYardCatalogResponse>({ queryKey: ["/api/constructor-yard/catalog", "mothership"], queryFn: async () => { const res = await fetch("/api/constructor-yard/catalog?domain=mothership", { credentials: "include" }); if (!res.ok) throw new Error("Failed to load mothership constructor yard"); return res.json(); } });
  const { data: yardStatusData } = useQuery<ConstructorYardStatusResponse>({ queryKey: ["/api/constructor-yard/status/me"], queryFn: async () => { const res = await fetch("/api/constructor-yard/status/me", { credentials: "include" }); if (!res.ok) throw new Error("Failed to load constructor yard status"); return res.json(); }, refetchInterval: 5000 });

  const startUpgradeMutation = useMutation({ mutationFn: async ({ entryId, targetLevel }: { entryId: string; targetLevel: number }) => { const res = await apiRequest("POST", "/api/constructor-yard/upgrade/start", { entryId, targetLevel }); return res.json(); }, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/constructor-yard/status/me"] }); toast({ title: "Constructor yard upgrade started", description: "The selected yard is now upgrading." }); }, onError: (error: any) => { toast({ title: "Upgrade failed", description: error?.message || "Unable to start upgrade.", variant: "destructive" }); } });
  const completeUpgradeMutation = useMutation({ mutationFn: async ({ entryId }: { entryId: string }) => { const res = await apiRequest("POST", "/api/constructor-yard/upgrade/complete", { entryId }); return res.json(); }, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/constructor-yard/status/me"] }); toast({ title: "Constructor yard upgrade complete", description: "The upgraded yard is now operational." }); }, onError: (error: any) => { toast({ title: "Completion failed", description: error?.message || "Upgrade is not ready yet.", variant: "destructive" }); } });

  const featuredStarshipYards = (starshipCatalog?.entries || []).slice(0, 6);
  const featuredMothershipYards = (mothershipCatalog?.entries || []).slice(0, 6);
  const yardStatus = yardStatusData?.status;
  const motherships = supers.filter((item) => item.id === "mothership" || item.id === "deathstar");

  return (
    <GameLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <section className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm bg-cover bg-center" style={{ backgroundImage: `linear-gradient(rgba(15,23,42,0.78), rgba(15,23,42,0.92)), url(${BACKGROUND_ASSETS.SHIPYARD.path})` }}>
          <div className="grid gap-6 p-5 lg:grid-cols-[1.4fr_0.8fr] lg:p-6">
            <div className="space-y-4 text-white">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200/20 bg-cyan-300/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-100"><Factory className="w-3.5 h-3.5" />Fleet Fabrication Wing</div>
              <div>
                <h2 className="text-3xl font-orbitron font-bold">Orbital Shipyard</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">Fleet construction, Spaceship Command-inspired constructor doctrines, mothership cores, 32 command categories, and a 90-hull starship line all run from this integrated shipyard deck while keeping the same shipyard menu structure.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                {[{ label: "Shipyard", image: MENU_ASSETS.BUILDINGS.SHIPYARD.path }, { label: "Constructor Yard", image: MENU_ASSETS.BUILDINGS.ROBOTICS_FACTORY.path }, { label: "Mothership Core", image: SHIP_ASSETS.SPECIAL.CARRIER.path }].map((item) => (
                  <div key={item.label} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                    <img src={item.image} alt={item.label} className="w-10 h-10 rounded-lg border border-white/10 bg-black/10 p-1.5 object-contain" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = TEMP_THEME_IMAGE; }} />
                    <div className="text-sm font-semibold">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {[{ label: "Fleet Power", value: Math.floor(totalFleetPower).toLocaleString(), image: SHIP_ASSETS.CAPITALS.BATTLECRUISER.path, tone: "text-blue-100" }, { label: "Active Queue", value: unitQueue.reduce((acc, q) => acc + (q.amount || 1), 0).toLocaleString(), image: MENU_ASSETS.BUILDINGS.SHIPYARD.path, tone: "text-amber-100" }, { label: "Yard Upgrades", value: (yardStatus?.activeUpgrades.length || 0).toLocaleString(), image: MENU_ASSETS.BUILDINGS.ROBOTICS_FACTORY.path, tone: "text-emerald-100" }].map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <img src={item.image} alt={item.label} className="w-12 h-12 rounded-xl border border-white/10 bg-black/10 p-2 object-contain" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = TEMP_THEME_IMAGE; }} />
                    <div><div className="text-[10px] uppercase tracking-[0.2em] text-slate-300">{item.label}</div><div className={cn("text-2xl font-orbitron font-bold", item.tone)}>{item.value}</div></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200" data-testid="card-stats-fleet-power"><CardContent className="p-4"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center overflow-hidden"><img src={SHIP_ASSETS.CAPITALS.BATTLECRUISER.path} alt="Fleet power" className="w-8 h-8 object-contain" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = TEMP_THEME_IMAGE; }} /></div><div><div className="text-xs text-blue-600 uppercase">Total Fleet Power</div><div className="text-xl font-orbitron font-bold text-blue-900">{Math.floor(totalFleetPower).toLocaleString()}</div></div></div></CardContent></Card>
          <Card className="bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200" data-testid="card-stats-total-ships"><CardContent className="p-4"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-slate-500/10 flex items-center justify-center overflow-hidden"><img src={SHIP_ASSETS.FIGHTERS.FIGHTER.path} alt="Total ships" className="w-8 h-8 object-contain" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = TEMP_THEME_IMAGE; }} /></div><div><div className="text-xs text-slate-600 uppercase">Total Ships</div><div className="text-xl font-orbitron font-bold text-slate-900">{totalShips.toLocaleString()}</div></div></div></CardContent></Card>
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200" data-testid="card-stats-shipyard"><CardContent className="p-4"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center overflow-hidden"><img src={MENU_ASSETS.BUILDINGS.SHIPYARD.path} alt="Shipyard" className="w-7 h-7 object-contain" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = TEMP_THEME_IMAGE; }} /></div><div><div className="text-xs text-orange-600 uppercase">Shipyard Level</div><div className="text-xl font-orbitron font-bold text-orange-900">{buildings?.shipyard || 0}</div></div></div></CardContent></Card>
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200" data-testid="card-stats-mothership-yard"><CardContent className="p-4"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center overflow-hidden"><img src={SHIP_ASSETS.SPECIAL.CARRIER.path} alt="Motherships" className="w-8 h-8 object-contain" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = TEMP_THEME_IMAGE; }} /></div><div><div className="text-xs text-purple-600 uppercase">Mothership Hulls</div><div className="text-xl font-orbitron font-bold text-purple-900">{motherships.reduce((sum, item) => sum + (units[item.id] || 0), 0)}</div></div></div></CardContent></Card>
        </div>

        {unitQueue.length > 0 && <Card className="bg-white border-primary/20 shadow-sm" data-testid="card-production-queue"><CardHeader className="pb-2"><CardTitle className="text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-2"><Hammer className="w-4 h-4" /> Production Queue</CardTitle></CardHeader><CardContent><div className="space-y-2">{unitQueue.map((item, i) => { const timeLeft = Math.max(0, Math.floor((item.endTime - Date.now()) / 1000)); return <div key={i} className="flex items-center gap-4 bg-slate-50 p-3 rounded border border-slate-100"><div className="w-12 h-12 flex items-center justify-center bg-white rounded border border-slate-200"><img src={getQueueImagePath(item.itemId, item.name)} alt="Queue item" className="w-9 h-9 object-contain" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = TEMP_THEME_IMAGE; }} /></div><div className="flex-1"><div className="flex justify-between text-sm font-medium text-slate-900 mb-1"><span>{item.amount}x {item.name}</span><span className="font-mono text-primary">{timeLeft}s remaining</span></div><Progress value={Math.max(0, 100 - (timeLeft / 2) * 100)} className="h-2" /></div></div>; })}</div></CardContent></Card>}

        <Tabs defaultValue="combat" className="w-full">
          <TabsList className="bg-white border border-slate-200 h-12 w-full justify-start overflow-x-auto">
            <TabsTrigger value="combat" className="font-orbitron" data-testid="tab-combat"><Sword className="w-4 h-4 mr-2" /> Combat Fleet</TabsTrigger>
            <TabsTrigger value="civil" className="font-orbitron" data-testid="tab-civil"><Box className="w-4 h-4 mr-2" /> Civil Ships</TabsTrigger>
            <TabsTrigger value="troops" className="font-orbitron" data-testid="tab-troops"><User className="w-4 h-4 mr-2" /> Personnel</TabsTrigger>
            <TabsTrigger value="vehicles" className="font-orbitron" data-testid="tab-vehicles"><Truck className="w-4 h-4 mr-2" /> Vehicles</TabsTrigger>
            <TabsTrigger value="constructor" className="font-orbitron" data-testid="tab-constructor"><Wrench className="w-4 h-4 mr-2" /> Constructor Yard</TabsTrigger>
            <TabsTrigger value="motherships" className="font-orbitron text-purple-700" data-testid="tab-motherships"><Orbit className="w-4 h-4 mr-2" /> Motherships</TabsTrigger>
            <TabsTrigger value="titan" className="font-orbitron text-red-600 font-bold" data-testid="tab-titan"><Hexagon className="w-4 h-4 mr-2" /> Titans</TabsTrigger>
          </TabsList>
          <div className="mt-6">
            <TabsContent value="combat" className="mt-0"><Card className="mb-6 bg-slate-50 border-slate-200" data-testid="card-combat-info"><CardContent className="p-4"><div className="flex items-center gap-4"><img src={SHIP_ASSETS.CAPITALS.DESTROYER.path} alt="Combat fleet" className="w-10 h-10 object-contain" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = TEMP_THEME_IMAGE; }} /><div><div className="font-bold text-slate-900">Combat Fleet</div><div className="text-sm text-slate-500">Fighters and capital ships for offensive and defensive operations. Upgrade your Shipyard to unlock advanced vessels.</div></div></div></CardContent></Card><div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">{combatShips.map((item) => <UnitCard key={item.id} item={item} count={units[item.id] || 0} onBuild={buildUnit} resources={resources} buildings={buildings} />)}</div></TabsContent>
            <TabsContent value="civil" className="mt-0"><Card className="mb-6 bg-blue-50 border-blue-200" data-testid="card-civil-info"><CardContent className="p-4"><div className="flex items-center gap-4"><img src={SHIP_ASSETS.SPECIAL.TRANSPORT.path} alt="Civil fleet" className="w-10 h-10 object-contain" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = TEMP_THEME_IMAGE; }} /><div><div className="font-bold text-slate-900">Civilian Fleet</div><div className="text-sm text-blue-700">Transport, colonization, and resource gathering vessels. Essential for empire expansion and logistics.</div></div></div></CardContent></Card><div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">{civilShips.map((item) => <UnitCard key={item.id} item={item} count={units[item.id] || 0} onBuild={buildUnit} resources={resources} buildings={buildings} />)}</div></TabsContent>
            <TabsContent value="troops" className="mt-0"><Card className="mb-6 bg-green-50 border-green-200" data-testid="card-troops-info"><CardContent className="p-4"><div className="flex items-center gap-4"><img src={MENU_ASSETS.BUILDINGS.SPACEPORT.path} alt="Personnel" className="w-10 h-10 object-contain" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = TEMP_THEME_IMAGE; }} /><div><div className="font-bold text-slate-900">Military Personnel</div><div className="text-sm text-green-700">Ground forces for planetary invasion and defense. Infantry, medics, engineers, and special operations units.</div></div></div></CardContent></Card><div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">{troops.map((item) => <UnitCard key={item.id} item={item} count={units[item.id] || 0} onBuild={buildUnit} resources={resources} buildings={buildings} />)}</div></TabsContent>
            <TabsContent value="vehicles" className="mt-0"><Card className="mb-6 bg-orange-50 border-orange-200" data-testid="card-vehicles-info"><CardContent className="p-4"><div className="flex items-center gap-4"><img src={SHIP_ASSETS.CAPITALS.CORVETTE.path} alt="Vehicles" className="w-10 h-10 object-contain" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = TEMP_THEME_IMAGE; }} /><div><div className="font-bold text-slate-900">Ground Vehicles</div><div className="text-sm text-orange-700">Armored vehicles, artillery, and mobile platforms for ground combat superiority.</div></div></div></CardContent></Card><div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">{vehicles.map((item) => <UnitCard key={item.id} item={item} count={units[item.id] || 0} onBuild={buildUnit} resources={resources} buildings={buildings} />)}</div></TabsContent>
            <TabsContent value="constructor" className="mt-0">
              <div className="space-y-6">
                <AdvancedConstructorDock />
                <ConstructorYardPanel title="Starship Constructor Yard" description="Upgrade live starship production lines, precision docks, and combat hull fabrication modules directly from the shipyard." domain="starship" entries={featuredStarshipYards} status={yardStatus} onStartUpgrade={(entryId, targetLevel) => startUpgradeMutation.mutate({ entryId, targetLevel })} onCompleteUpgrade={(entryId) => completeUpgradeMutation.mutate({ entryId })} isStarting={startUpgradeMutation.isPending} isCompleting={completeUpgradeMutation.isPending} />
              </div>
            </TabsContent>
            <TabsContent value="motherships" className="mt-0"><div className="space-y-6"><Card className="mb-0 bg-purple-100 border-purple-300" data-testid="card-mothership-info"><CardContent className="p-4"><div className="flex items-center gap-4"><img src={SHIP_ASSETS.SPECIAL.CARRIER.path} alt="Motherships" className="w-12 h-12 object-contain" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = TEMP_THEME_IMAGE; }} /><div><div className="font-bold text-purple-900 text-lg">Mothership Systems</div><div className="text-sm text-purple-700">Mobile command fortresses, heavy support hulls, and endgame command platforms all route through the mothership constructor yard.</div></div><Badge className="ml-auto bg-purple-700">CORE SYSTEM</Badge></div></CardContent></Card><div className="grid grid-cols-1 lg:grid-cols-2 gap-6">{motherships.map((item) => <UnitCard key={item.id} item={item} count={units[item.id] || 0} onBuild={buildUnit} resources={resources} buildings={buildings} />)}</div><ConstructorYardPanel title="Mothership Constructor Yard" description="Build out command cores, carrier cradles, siege hull sections, and mothership logistics relays for flagship-scale production." domain="mothership" entries={featuredMothershipYards} status={yardStatus} onStartUpgrade={(entryId, targetLevel) => startUpgradeMutation.mutate({ entryId, targetLevel })} onCompleteUpgrade={(entryId) => completeUpgradeMutation.mutate({ entryId })} isStarting={startUpgradeMutation.isPending} isCompleting={completeUpgradeMutation.isPending} /></div></TabsContent>
            <TabsContent value="titan" className="mt-0"><Card className="mb-6 bg-red-100 border-red-300" data-testid="card-titan-info"><CardContent className="p-4"><div className="flex items-center gap-4"><img src={SHIP_ASSETS.SPECIAL.CARRIER.path} alt="Titans" className="w-12 h-12 object-contain" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = TEMP_THEME_IMAGE; }} /><div><div className="font-orbitron font-bold text-red-900 text-lg">TITAN CLASS</div><div className="text-sm text-red-700">The ultimate expression of military might. These planet-killer class vessels require Shipyard Level 12 and massive resources to construct. Only one may exist per empire.</div></div><Badge className="ml-auto bg-red-600 animate-pulse">LEGENDARY</Badge></div></CardContent></Card><div className="grid grid-cols-1 lg:grid-cols-2 gap-6">{titans.map((item) => <UnitCard key={item.id} item={item} count={units[item.id] || 0} onBuild={buildUnit} resources={resources} buildings={buildings} />)}</div></TabsContent>
          </div>
        </Tabs>

        <Card className="border-slate-200 shadow-sm overflow-hidden"><div className="border-b border-slate-200 px-5 py-4 text-white bg-cover bg-center" style={{ backgroundImage: `linear-gradient(rgba(15,23,42,0.86), rgba(15,23,42,0.9)), url(${OGAMEX_FEATURED_ASSETS.SHIPS.path})` }}><div className="flex items-center gap-3"><img src={OGAMEX_FEATURED_ASSETS.SHIPS.path} alt="Asset integration" className="w-12 h-12 rounded-xl border border-white/10 bg-white/10 object-cover" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = TEMP_THEME_IMAGE; }} /><div><div className="text-[10px] uppercase tracking-[0.24em] text-cyan-200/80">Asset Placement</div><div className="font-orbitron text-lg font-bold">Linked UI Art Now In Use</div></div></div></div><CardContent className="p-4 grid gap-3 md:grid-cols-3">{[{ label: "Ship Hull PNGs", detail: "Starship, carrier, and battlecruiser art is now used across hero cards, stats, queues, and unit cards.", image: SHIP_ASSETS.CAPITALS.BATTLECRUISER.path }, { label: "Building PNGs", detail: "Shipyard, robotics factory, and spaceport art now anchors constructor-yard and personnel panels.", image: MENU_ASSETS.BUILDINGS.ROBOTICS_FACTORY.path }, { label: "OGameX Art", detail: "OGameX-linked background and ship feature art is now visible in the shipyard shell and constructor sections.", image: OGAMEX_FEATURED_ASSETS.SHIPS.path }].map((item) => <div key={item.label} className="rounded-xl border border-slate-200 bg-slate-50 p-3"><div className="flex items-center gap-3"><img src={item.image} alt={item.label} className="w-12 h-12 rounded-xl border border-slate-200 bg-white p-2 object-contain" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = TEMP_THEME_IMAGE; }} /><div className="font-semibold text-slate-900">{item.label}</div></div><div className="mt-2 text-sm text-slate-600">{item.detail}</div></div>)}</CardContent></Card>
      </div>
    </GameLayout>
  );
}
