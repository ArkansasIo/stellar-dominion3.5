import GameLayout from "@/components/layout/GameLayout";
import { useGame } from "@/lib/gameContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BACKGROUND_ASSETS, MENU_ASSETS, SHIP_ASSETS
} from "@shared/config";
import {
  Rocket, Shield, Swords, Box, Crosshair, Zap,
  Skull, Anchor, Users, Truck, Eye, Disc,
  Activity, Target, Cpu, Globe, Hexagon, Pyramid,
  Warehouse, Gauge, Wrench, Send, Plus, Ship,
  BarChart3, Layers, Fuel, HardDrive, ArrowUpDown,
  Gem
} from "lucide-react";
import { useMemo, useState } from "react";
import { unitData, type UnitItem, type UnitClass } from "@/lib/unitData";
import { cn } from "@/lib/utils";
import { useLocation } from "wouter";

const TEMP_THEME_IMAGE = "/theme-temp.png";

const CLASS_ORDER: UnitClass[] = ["fighter", "capital", "civilian", "super", "titan"];
const CLASS_LABELS: Record<UnitClass, string> = {
  fighter: "Fighters", capital: "Capital Ships", civilian: "Civilian",
  defense: "Defense", troop: "Troops", vehicle: "Vehicles", super: "Super Capitals", titan: "Titans"
};
const CLASS_COLORS: Record<UnitClass, string> = {
  fighter: "border-blue-200 bg-blue-50 text-blue-700",
  capital: "border-purple-200 bg-purple-50 text-purple-700",
  civilian: "border-green-200 bg-green-50 text-green-700",
  defense: "border-red-200 bg-red-50 text-red-700",
  troop: "border-amber-200 bg-amber-50 text-amber-700",
  vehicle: "border-orange-200 bg-orange-50 text-orange-700",
  super: "border-indigo-200 bg-indigo-50 text-indigo-700",
  titan: "border-red-300 bg-red-100 text-red-800",
};
const CLASS_ICONS: Record<UnitClass, any> = {
  fighter: Swords, capital: Crosshair, civilian: Truck,
  defense: Shield, troop: Users, vehicle: Cpu, super: Activity, titan: Hexagon
};
const CLASS_BG: Record<UnitClass, string> = {
  fighter: "from-blue-50 to-blue-100",
  capital: "from-purple-50 to-purple-100",
  civilian: "from-green-50 to-green-100",
  defense: "from-red-50 to-red-100",
  troop: "from-amber-50 to-amber-100",
  vehicle: "from-orange-50 to-orange-100",
  super: "from-indigo-50 to-indigo-100",
  titan: "from-red-50 to-red-100",
};

function getUnitImage(item: UnitItem) {
  if (item.id === "interceptor") return SHIP_ASSETS.FIGHTERS.INTERCEPTOR.path;
  if (item.id === "heavyFighter") return SHIP_ASSETS.FIGHTERS.FIGHTER.path;
  if (item.id === "lightFighter") return SHIP_ASSETS.FIGHTERS.SCOUT.path;
  if (item.id === "battleship") return SHIP_ASSETS.CAPITALS.BATTLESHIP.path;
  if (item.id === "battlecruiser") return SHIP_ASSETS.CAPITALS.BATTLECRUISER.path;
  if (item.id === "destroyer") return SHIP_ASSETS.CAPITALS.DESTROYER.path;
  if (item.id === "cruiser" || item.id === "bomber") return SHIP_ASSETS.CAPITALS.CORVETTE.path;
  if (item.class === "civilian") return SHIP_ASSETS.SPECIAL.TRANSPORT.path;
  if (item.class === "super" || item.class === "titan") return SHIP_ASSETS.SPECIAL.CARRIER.path;
  return SHIP_ASSETS.FIGHTERS.FIGHTER.path;
}

function calcPower(item: UnitItem) {
  return item.stats.attack + item.stats.shield + item.stats.structure / 10;
}

function calcMaintenance(count: number) {
  return {
    metal: count * 5,
    crystal: count * 2,
    deuterium: count * 1,
  };
}

function formatCompact(n: number) {
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + "B";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toLocaleString();
}

export default function FleetYard() {
  const { units, buildings } = useGame();
  const [, navigate] = useLocation();
  const [expandedClass, setExpandedClass] = useState<UnitClass | null>(null);
  const [expandedShip, setExpandedShip] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  const fleetData = useMemo(() => {
    const ships = unitData.filter((u) =>
      ["fighter", "capital", "civilian", "super", "titan"].includes(u.class)
    );
    const owned = ships
      .map((u) => ({ item: u, count: units[u.id] || 0 }))
      .filter((e) => e.count > 0);
    const totalShips = owned.reduce((s, e) => s + e.count, 0);
    const totalPower = owned.reduce((s, e) => s + calcPower(e.item) * e.count, 0);
    const totalCargo = owned.reduce((s, e) => s + e.item.stats.cargo * e.count, 0);
    const byClass = {} as Record<UnitClass, { item: UnitItem; count: number }[]>;
    for (const entry of owned) {
      const cls = entry.item.class as UnitClass;
      if (!byClass[cls]) byClass[cls] = [];
      byClass[cls].push(entry);
    }
    const classStats = CLASS_ORDER.filter((c) => byClass[c]?.length).map((cls) => {
      const entries = byClass[cls] || [];
      const total = entries.reduce((s, e) => s + e.count, 0);
      const power = entries.reduce((s, e) => s + calcPower(e.item) * e.count, 0);
      const cargo = entries.reduce((s, e) => s + e.item.stats.cargo * e.count, 0);
      const hull = entries.reduce((s, e) => s + e.item.stats.structure * e.count, 0);
      const shield = entries.reduce((s, e) => s + e.item.stats.shield * e.count, 0);
      const attack = entries.reduce((s, e) => s + e.item.stats.attack * e.count, 0);
      return { cls, entries, total, power, cargo, hull, shield, attack };
    });
    const maintenance = calcMaintenance(totalShips);
    const shipyardLvl = buildings?.shipyard || 0;
    const capacity = 50 + shipyardLvl * 25;
    const capacityPct = Math.min(100, (totalShips / capacity) * 100);
    return { ships: owned, totalShips, totalPower, totalCargo, byClass, classStats, maintenance, shipyardLvl, capacity, capacityPct };
  }, [units, buildings]);

  const [sendTab, setSendTab] = useState<"send" | "info">("info");

  const ShipDetailCard = ({ item, count }: { item: UnitItem; count: number }) => {
    const power = calcPower(item);
    const maint = calcMaintenance(count);
    const isExpanded = expandedShip === item.id;
    return (
      <Card className={cn("border-slate-200 overflow-hidden transition-all", isExpanded ? "ring-2 ring-primary/30" : "")}>
        <div className="flex items-start gap-4 p-4 cursor-pointer" onClick={() => setExpandedShip(isExpanded ? null : item.id)}>
          <div className={cn("w-16 h-16 rounded-xl border-2 flex items-center justify-center shrink-0 bg-cover bg-center",
            item.class === "titan" ? "border-red-300 bg-red-50" :
            item.class === "super" ? "border-indigo-300 bg-indigo-50" :
            item.class === "capital" ? "border-purple-300 bg-purple-50" :
            item.class === "fighter" ? "border-blue-300 bg-blue-50" :
            "border-green-300 bg-green-50"
          )}>
            <img src={getUnitImage(item)} alt={item.name} className="w-12 h-12 object-contain" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = TEMP_THEME_IMAGE; }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-slate-900 text-base">{item.name}</h3>
              <Badge variant="outline" className={cn("text-[10px] uppercase", CLASS_COLORS[item.class as UnitClass])}>{item.class}</Badge>
              <Badge variant="secondary" className="text-[10px] font-mono">{count.toLocaleString()} owned</Badge>
            </div>
            <p className="text-xs text-slate-500 mt-1">{item.description}</p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-slate-600">
              <span><Swords className="w-3 h-3 inline mr-1 text-red-500" />{item.stats.attack.toLocaleString()}</span>
              <span><Shield className="w-3 h-3 inline mr-1 text-blue-500" />{item.stats.shield.toLocaleString()}</span>
              <span><HardDrive className="w-3 h-3 inline mr-1 text-slate-500" />{item.stats.structure.toLocaleString()}</span>
              <span><Truck className="w-3 h-3 inline mr-1 text-green-500" />{item.stats.cargo.toLocaleString()}</span>
              <span><Gauge className="w-3 h-3 inline mr-1 text-purple-500" />{item.stats.speed.toLocaleString()}</span>
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-lg font-bold text-primary font-orbitron">{formatCompact(Math.floor(power * count))}</div>
            <div className="text-[10px] text-slate-400 uppercase">Total Power</div>
          </div>
        </div>
        {isExpanded && (
          <div className="border-t border-slate-200 bg-slate-50 p-4 space-y-3">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-white rounded border border-slate-200 p-3">
                <div className="text-[10px] uppercase text-slate-500">Per Unit Power</div>
                <div className="text-lg font-bold text-slate-900">{formatCompact(Math.floor(power))}</div>
              </div>
              <div className="bg-white rounded border border-slate-200 p-3">
                <div className="text-[10px] uppercase text-slate-500">Cost per ship</div>
                <div className="space-y-0.5">
                  <div className="text-xs"><Box className="w-3 h-3 inline mr-1" />{item.cost.metal.toLocaleString()}</div>
                  <div className="text-xs"><Gem className="w-3 h-3 inline mr-1" />{item.cost.crystal.toLocaleString()}</div>
                  <div className="text-xs"><Fuel className="w-3 h-3 inline mr-1" />{item.cost.deuterium.toLocaleString()}</div>
                </div>
              </div>
              <div className="bg-white rounded border border-slate-200 p-3">
                <div className="text-[10px] uppercase text-slate-500">Maintenance /h</div>
                <div className="space-y-0.5">
                  <div className="text-xs"><Box className="w-3 h-3 inline mr-1" />{maint.metal.toLocaleString()}</div>
                  <div className="text-xs"><Gem className="w-3 h-3 inline mr-1" />{maint.crystal.toLocaleString()}</div>
                  <div className="text-xs"><Fuel className="w-3 h-3 inline mr-1" />{maint.deuterium.toLocaleString()}</div>
                </div>
              </div>
              <div className="bg-white rounded border border-slate-200 p-3">
                <div className="text-[10px] uppercase text-slate-500">Fleet Contribution</div>
                <div className="text-lg font-bold text-slate-900">
                  {fleetData.totalPower > 0 ? ((power * count / fleetData.totalPower) * 100).toFixed(1) : "0"}%
                </div>
              </div>
            </div>
            {item.requirements && (
              <div className="bg-amber-50 rounded border border-amber-200 p-3 text-xs text-amber-800">
                <span className="font-semibold">Requirements: </span>
                {Object.entries(item.requirements).map(([k, v]) => `${k} Lvl ${v}`).join(", ")}
              </div>
            )}
            <div className="flex gap-2 pt-2">
              <Button size="sm" variant="outline" onClick={() => navigate("/shipyard")}><Plus className="w-3 h-3 mr-1" /> Build More</Button>
              <Button size="sm" variant="outline" onClick={() => navigate("/fleet")}><Send className="w-3 h-3 mr-1" /> Dispatch</Button>
            </div>
          </div>
        )}
      </Card>
    );
  };

  return (
    <GameLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <section className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm bg-cover bg-center" style={{ backgroundImage: `linear-gradient(rgba(15,23,42,0.82), rgba(15,23,42,0.94)), url(${BACKGROUND_ASSETS.SHIPYARD.path})` }}>
          <div className="grid gap-6 p-5 lg:grid-cols-[1.4fr_0.8fr] lg:p-6">
            <div className="space-y-4 text-white">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200/20 bg-cyan-300/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-100"><Warehouse className="w-3.5 h-3.5" />Fleet Storage & Logistics</div>
              <div>
                <h2 className="text-3xl font-orbitron font-bold">Fleet Yard</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">Central fleet storage and organization hub. Review your starship inventory, manage fleet composition, track maintenance costs, and access your entire naval arsenal at a glance.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                {[
                  { label: "Fleet Ships", image: SHIP_ASSETS.CAPITALS.BATTLECRUISER.path },
                  { label: "Cargo Vessels", image: SHIP_ASSETS.SPECIAL.TRANSPORT.path },
                  { label: "Command Ships", image: SHIP_ASSETS.SPECIAL.CARRIER.path },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                    <img src={item.image} alt={item.label} className="w-10 h-10 rounded-lg border border-white/10 bg-black/10 p-1.5 object-contain" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = TEMP_THEME_IMAGE; }} />
                    <div className="text-sm font-semibold">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {[
                { label: "Storage Used", value: `${fleetData.totalShips.toLocaleString()} / ${fleetData.capacity.toLocaleString()}`, image: SHIP_ASSETS.FIGHTERS.FIGHTER.path, tone: fleetData.capacityPct > 80 ? "text-red-300" : fleetData.capacityPct > 50 ? "text-amber-300" : "text-emerald-300" },
                { label: "Fleet Power", value: formatCompact(Math.floor(fleetData.totalPower)), image: SHIP_ASSETS.CAPITALS.BATTLECRUISER.path, tone: "text-blue-300" },
                { label: "Ship Classes", value: `${fleetData.classStats.length} types`, image: MENU_ASSETS.BUILDINGS.SHIPYARD.path, tone: "text-cyan-300" },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <img src={item.image} alt={item.label} className="w-12 h-12 rounded-xl border border-white/10 bg-black/10 p-2 object-contain" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = TEMP_THEME_IMAGE; }} />
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.2em] text-slate-300">{item.label}</div>
                      <div className={cn("text-xl font-orbitron font-bold", item.tone)}>{item.value}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className="bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-500/10 flex items-center justify-center"><Ship className="w-5 h-5 text-slate-600" /></div>
                <div>
                  <div className="text-xs text-slate-500 uppercase">Total Ships</div>
                  <div className="text-xl font-orbitron font-bold text-slate-900">{fleetData.totalShips.toLocaleString()}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center"><Zap className="w-5 h-5 text-blue-600" /></div>
                <div>
                  <div className="text-xs text-blue-600 uppercase">Fleet Power</div>
                  <div className="text-xl font-orbitron font-bold text-blue-900">{formatCompact(Math.floor(fleetData.totalPower))}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center"><Truck className="w-5 h-5 text-green-600" /></div>
                <div>
                  <div className="text-xs text-green-600 uppercase">Total Cargo</div>
                  <div className="text-xl font-orbitron font-bold text-green-900">{formatCompact(fleetData.totalCargo)}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center"><Layers className="w-5 h-5 text-purple-600" /></div>
                <div>
                  <div className="text-xs text-purple-600 uppercase">Ship Classes</div>
                  <div className="text-xl font-orbitron font-bold text-purple-900">{fleetData.classStats.length}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center"><Wrench className="w-5 h-5 text-orange-600" /></div>
                <div>
                  <div className="text-xs text-orange-600 uppercase">Maintenance</div>
                  <div className="text-lg font-orbitron font-bold text-orange-900">{fleetData.maintenance.metal.toLocaleString()}/h</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-orbitron text-slate-900 flex items-center gap-2"><Warehouse className="w-4 h-4" /> Fleet Storage Capacity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Progress value={fleetData.capacityPct} className="h-4" />
              </div>
              <div className="text-sm font-mono text-slate-600 whitespace-nowrap">
                {fleetData.totalShips.toLocaleString()} / {fleetData.capacity.toLocaleString()} ({fleetData.capacityPct.toFixed(0)}%)
              </div>
            </div>
            <div className="mt-2 text-xs text-slate-500">
              Capacity scales with Shipyard level (base 50 + 25 per level). Current Shipyard: Lvl {fleetData.shipyardLvl}
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-white border border-slate-200 h-12 w-full justify-start overflow-x-auto">
            <TabsTrigger value="overview" className="font-orbitron"><BarChart3 className="w-4 h-4 mr-2" /> Fleet Overview</TabsTrigger>
            <TabsTrigger value="classes" className="font-orbitron"><Layers className="w-4 h-4 mr-2" /> By Class</TabsTrigger>
            <TabsTrigger value="all" className="font-orbitron"><Ship className="w-4 h-4 mr-2" /> All Ships</TabsTrigger>
            <TabsTrigger value="maintenance" className="font-orbitron"><Wrench className="w-4 h-4 mr-2" /> Maintenance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-slate-200">
                <CardHeader>
                  <CardTitle className="text-slate-900 text-base flex items-center gap-2"><BarChart3 className="w-5 h-5 text-blue-600" /> Power by Class</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {fleetData.classStats.map(({ cls, total, power, attack, hull, shield }) => {
                    const pct = fleetData.totalPower > 0 ? (power / fleetData.totalPower) * 100 : 0;
                    const Icon = CLASS_ICONS[cls];
                    return (
                      <div key={cls} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-2 text-slate-700">
                            <Icon className={cn("w-4 h-4", cls === "fighter" ? "text-blue-500" : cls === "capital" ? "text-purple-500" : cls === "civilian" ? "text-green-500" : cls === "super" ? "text-indigo-500" : "text-red-500")} />
                            {CLASS_LABELS[cls]}
                            <span className="text-xs text-slate-400">({total.toLocaleString()} ships)</span>
                          </span>
                          <span className="font-mono text-slate-900">{formatCompact(Math.floor(power))}</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className={cn("h-full rounded-full", cls === "fighter" ? "bg-blue-500" : cls === "capital" ? "bg-purple-500" : cls === "civilian" ? "bg-green-500" : cls === "super" ? "bg-indigo-500" : "bg-red-500")} style={{ width: `${pct}%` }} />
                        </div>
                        <div className="flex gap-3 text-[10px] text-slate-400">
                          <span>ATK: {formatCompact(attack)}</span>
                          <span>DEF: {formatCompact(shield)}</span>
                          <span>Hull: {formatCompact(hull)}</span>
                        </div>
                      </div>
                    );
                  })}
                  {!fleetData.classStats.length && <div className="text-center py-8 text-slate-500">No ships in fleet</div>}
                </CardContent>
              </Card>
              <Card className="border-slate-200">
                <CardHeader>
                  <CardTitle className="text-slate-900 text-base flex items-center gap-2"><Truck className="w-5 h-5 text-green-600" /> Fleet Logistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 rounded-lg border border-slate-200 p-4">
                      <div className="text-xs text-slate-500 uppercase">Cargo Capacity</div>
                      <div className="text-2xl font-bold text-slate-900">{formatCompact(fleetData.totalCargo)}</div>
                      <div className="text-xs text-green-600 mt-1">Total resource transport</div>
                    </div>
                    <div className="bg-slate-50 rounded-lg border border-slate-200 p-4">
                      <div className="text-xs text-slate-500 uppercase">Avg Power/Ship</div>
                      <div className="text-2xl font-bold text-slate-900">
                        {fleetData.totalShips > 0 ? formatCompact(Math.floor(fleetData.totalPower / fleetData.totalShips)) : "0"}
                      </div>
                      <div className="text-xs text-blue-600 mt-1">Fleet efficiency rating</div>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-slate-700 uppercase">Composition Breakdown</div>
                    {fleetData.classStats.map(({ cls, total, power }) => {
                      const pct = fleetData.totalShips > 0 ? (total / fleetData.totalShips) * 100 : 0;
                      const Icon = CLASS_ICONS[cls];
                      return (
                        <div key={cls} className="flex items-center gap-3 text-sm">
                          <Icon className={cn("w-4 h-4", cls === "fighter" ? "text-blue-500" : cls === "capital" ? "text-purple-500" : cls === "civilian" ? "text-green-500" : cls === "super" ? "text-indigo-500" : "text-red-500")} />
                          <span className="w-24 text-slate-600">{CLASS_LABELS[cls]}</span>
                          <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className={cn("h-full rounded-full", cls === "fighter" ? "bg-blue-500" : cls === "capital" ? "bg-purple-500" : cls === "civilian" ? "bg-green-500" : cls === "super" ? "bg-indigo-500" : "bg-red-500")} style={{ width: `${pct}%` }} />
                          </div>
                          <span className="w-16 text-right font-mono text-slate-700">{pct.toFixed(0)}%</span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-slate-900 text-base flex items-center gap-2"><Gauge className="w-5 h-5 text-indigo-600" /> Fleet Power Distribution</CardTitle>
                <CardDescription>How your fleet's combat power is allocated across ship classes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                  {fleetData.classStats.map(({ cls, power }) => {
                    const pct = fleetData.totalPower > 0 ? (power / fleetData.totalPower) * 100 : 0;
                    const Icon = CLASS_ICONS[cls];
                    return (
                      <div key={cls} className={cn("rounded-xl border-2 p-4 text-center", CLASS_BG[cls])}>
                        <Icon className={cn("w-8 h-8 mx-auto mb-2", cls === "fighter" ? "text-blue-600" : cls === "capital" ? "text-purple-600" : cls === "civilian" ? "text-green-600" : cls === "super" ? "text-indigo-600" : "text-red-600")} />
                        <div className="text-xs text-slate-500 uppercase">{CLASS_LABELS[cls]}</div>
                        <div className="text-2xl font-bold text-slate-900">{pct.toFixed(0)}%</div>
                        <div className="text-[10px] text-slate-400">{formatCompact(Math.floor(power))} power</div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="classes" className="mt-6 space-y-6">
            {CLASS_ORDER.filter((cls) => fleetData.byClass[cls]?.length).map((cls) => {
              const stats = fleetData.classStats.find((s) => s.cls === cls)!;
              const Icon = CLASS_ICONS[cls];
              const isExpanded = expandedClass === cls;
              return (
                <Card key={cls} className={cn("border-slate-200 overflow-hidden", isExpanded && "ring-2 ring-primary/20")}>
                  <div className={cn("bg-gradient-to-r p-4 cursor-pointer", CLASS_BG[cls])} onClick={() => setExpandedClass(isExpanded ? null : cls)}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-white/80 border border-slate-200 flex items-center justify-center">
                          <Icon className={cn("w-6 h-6", cls === "fighter" ? "text-blue-600" : cls === "capital" ? "text-purple-600" : cls === "civilian" ? "text-green-600" : cls === "super" ? "text-indigo-600" : "text-red-600")} />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-lg">{CLASS_LABELS[cls]}</h3>
                          <div className="flex gap-3 text-xs text-slate-500">
                            <span>{stats.total.toLocaleString()} ships</span>
                            <span>{formatCompact(Math.floor(stats.power))} power</span>
                            <span>{formatCompact(stats.cargo)} cargo</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-slate-900">{((stats.power / Math.max(fleetData.totalPower, 1)) * 100).toFixed(0)}%</div>
                        <div className="text-[10px] text-slate-500 uppercase">of Fleet</div>
                      </div>
                    </div>
                  </div>
                  {isExpanded && (
                    <CardContent className="p-4 space-y-3">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                          <div className="text-[10px] uppercase text-slate-500">Total Attack</div>
                          <div className="text-lg font-bold text-red-600">{formatCompact(stats.attack)}</div>
                        </div>
                        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                          <div className="text-[10px] uppercase text-slate-500">Total Shield</div>
                          <div className="text-lg font-bold text-blue-600">{formatCompact(stats.shield)}</div>
                        </div>
                        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                          <div className="text-[10px] uppercase text-slate-500">Total Hull</div>
                          <div className="text-lg font-bold text-emerald-600">{formatCompact(stats.hull)}</div>
                        </div>
                        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                          <div className="text-[10px] uppercase text-slate-500">Cargo Capacity</div>
                          <div className="text-lg font-bold text-orange-600">{formatCompact(stats.cargo)}</div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {stats.entries.map((entry) => (
                          <ShipDetailCard key={entry.item.id} item={entry.item} count={entry.count} />
                        ))}
                      </div>
                    </CardContent>
                  )}
                </Card>
              );
            })}
            {!fleetData.classStats.length && (
              <Card className="border-slate-200">
                <CardContent className="py-16 text-center">
                  <Ship className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                  <h3 className="text-lg font-bold text-slate-700 mb-2">Your Fleet Yard is Empty</h3>
                  <p className="text-sm text-slate-500 mb-6">Build ships at the Shipyard to start assembling your fleet.</p>
                  <Button onClick={() => navigate("/shipyard")}><Plus className="w-4 h-4 mr-2" /> Go to Shipyard</Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="all" className="mt-6 space-y-4">
            {fleetData.ships.length > 0 ? (
              <div className="space-y-3">
                {fleetData.ships.map((entry) => (
                  <ShipDetailCard key={entry.item.id} item={entry.item} count={entry.count} />
                ))}
              </div>
            ) : (
              <Card className="border-slate-200">
                <CardContent className="py-16 text-center">
                  <Ship className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                  <h3 className="text-lg font-bold text-slate-700 mb-2">No Ships in Storage</h3>
                  <p className="text-sm text-slate-500 mb-6">Head to the Shipyard to construct vessels for your fleet.</p>
                  <Button onClick={() => navigate("/shipyard")}><Plus className="w-4 h-4 mr-2" /> Go to Shipyard</Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="maintenance" className="mt-6 space-y-6">
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-slate-900 text-base flex items-center gap-2"><Wrench className="w-5 h-5 text-orange-600" /> Fleet Maintenance Costs</CardTitle>
                <CardDescription>Your fleet consumes resources every hour for upkeep and logistics.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="rounded-xl border-2 border-amber-200 bg-amber-50 p-5">
                    <div className="flex items-center gap-3">
                      <Box className="w-8 h-8 text-amber-600" />
                      <div>
                        <div className="text-xs uppercase text-amber-700">Metal / Hour</div>
                        <div className="text-2xl font-bold text-amber-900">{fleetData.maintenance.metal.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-5">
                    <div className="flex items-center gap-3">
                      <Gem className="w-8 h-8 text-blue-600" />
                      <div>
                        <div className="text-xs uppercase text-blue-700">Crystal / Hour</div>
                        <div className="text-2xl font-bold text-blue-900">{fleetData.maintenance.crystal.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-xl border-2 border-green-200 bg-green-50 p-5">
                    <div className="flex items-center gap-3">
                      <Fuel className="w-8 h-8 text-green-600" />
                      <div>
                        <div className="text-xs uppercase text-green-700">Deuterium / Hour</div>
                        <div className="text-2xl font-bold text-green-900">{fleetData.maintenance.deuterium.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="text-sm text-slate-600">
                  <p className="font-semibold mb-2">Maintenance per Ship Type</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-slate-200">
                          <th className="text-left py-2 text-slate-500">Ship</th>
                          <th className="text-right py-2 text-slate-500">Count</th>
                          <th className="text-right py-2 text-slate-500">Metal/h</th>
                          <th className="text-right py-2 text-slate-500">Crystal/h</th>
                          <th className="text-right py-2 text-slate-500">Deut/h</th>
                          <th className="text-right py-2 text-slate-500">Total/h</th>
                        </tr>
                      </thead>
                      <tbody>
                        {fleetData.ships.map(({ item, count }) => {
                          const m = calcMaintenance(count);
                          const total = m.metal + m.crystal + m.deuterium;
                          return (
                            <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50">
                              <td className="py-2 font-medium text-slate-900">{item.name}</td>
                              <td className="py-2 text-right font-mono">{count.toLocaleString()}</td>
                              <td className="py-2 text-right font-mono text-amber-700">{m.metal.toLocaleString()}</td>
                              <td className="py-2 text-right font-mono text-blue-700">{m.crystal.toLocaleString()}</td>
                              <td className="py-2 text-right font-mono text-green-700">{m.deuterium.toLocaleString()}</td>
                              <td className="py-2 text-right font-mono font-bold text-slate-900">{total.toLocaleString()}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex gap-3 justify-center pb-4">
          <Button onClick={() => navigate("/shipyard")}><Plus className="w-4 h-4 mr-2" /> Build Ships</Button>
          <Button variant="outline" onClick={() => navigate("/fleet")}><Send className="w-4 h-4 mr-2" /> Fleet Command</Button>
        </div>
      </div>
    </GameLayout>
  );
}
