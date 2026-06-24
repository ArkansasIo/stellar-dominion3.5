import GameLayout from "@/components/layout/GameLayout";
import { useGame } from "@/lib/gameContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Factory, FlaskConical, Rocket, Shield, ArrowUpCircle, Box, Gem, Hammer,
  Satellite, Globe, TrendingUp, Lock, Zap, BarChart3, Cpu, Network,
  Swords, Crosshair, RotateCcw, Eye, Plus, Minus, Eye as EyeIcon,
  Package, Users, Ship, Cog, Gauge, BatteryCharging, Radar, Waves,
  BrainCircuit, Sparkles, Atom, Dna, Coins, ShieldCheck, Orbit, Rocket as RocketIcon,
  Wrench, X, Activity
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { useState, useMemo } from "react";

type Tab = "buildings" | "shipyard" | "defenses" | "research" | "colony" | "orbital" | "history";

const CC: Record<string, string> = {
  economy: "text-emerald-400 bg-emerald-950/40 border-emerald-700/40",
  military: "text-red-400 bg-red-950/40 border-red-700/40",
  research: "text-blue-400 bg-blue-950/40 border-blue-700/40",
  infrastructure: "text-amber-400 bg-amber-950/40 border-amber-700/40",
  orbital: "text-purple-400 bg-purple-950/40 border-purple-700/40",
};

const CD: Record<string, string> = {
  economy: "bg-emerald-400", military: "bg-red-400", research: "bg-blue-400",
  infrastructure: "bg-amber-400", orbital: "bg-purple-400",
};

interface BD { id: string; name: string; icon: typeof Factory; cat: "economy" | "military" | "research" | "infrastructure"; prod: string; cost: { metal: number; crystal: number; deuterium: number }; desc: string }

const BLDGS: BD[] = [
  { id: "metalMine", name: "Metal Mine", icon: Box, cat: "economy", prod: "+120 Metal/h", cost: { metal: 60, crystal: 15, deuterium: 0 }, desc: "Extracts raw metal ore from planetary deposits." },
  { id: "crystalMine", name: "Crystal Mine", icon: Gem, cat: "economy", prod: "+100 Crystal/h", cost: { metal: 48, crystal: 24, deuterium: 0 }, desc: "Harvests crystalline formations for advanced components." },
  { id: "deuteriumSynthesizer", name: "Deuterium Synthesizer", icon: Zap, cat: "economy", prod: "+40 Deuterium/h", cost: { metal: 225, crystal: 75, deuterium: 0 }, desc: "Synthesizes deuterium fuel from heavy water." },
  { id: "solarPlant", name: "Solar Plant", icon: BatteryCharging, cat: "economy", prod: "+300 Energy", cost: { metal: 75, crystal: 30, deuterium: 0 }, desc: "Converts stellar radiation into usable power." },
  { id: "roboticsFactory", name: "Robotics Factory", icon: Cog, cat: "infrastructure", prod: "-10% build time", cost: { metal: 200, crystal: 100, deuterium: 0 }, desc: "Automated construction units reduce all build times." },
  { id: "shipyard", name: "Shipyard", icon: Rocket, cat: "military", prod: "Unlocks ships", cost: { metal: 400, crystal: 200, deuterium: 100 }, desc: "Constructs fleet vessels and defense platforms." },
  { id: "researchLab", name: "Research Lab", icon: FlaskConical, cat: "research", prod: "-5% research time", cost: { metal: 225, crystal: 75, deuterium: 0 }, desc: "Enables technological advancement and discovery." },
];

interface SD { id: string; name: string; icon: typeof Rocket; tier: number; cat: "fighters" | "cruisers" | "capital" | "transports" | "utility"; atk: number; def: number; shd: number; hull: number; spd: number; cargo: number; cost: { metal: number; crystal: number; deuterium: number }; time: number; counter: string }

const SHIPS: SD[] = [
  { id: "lightFighter", name: "Light Fighter", icon: Swords, tier: 1, cat: "fighters", atk: 8, def: 3, shd: 0, hull: 25, spd: 12000, cargo: 50, cost: { metal: 3000, crystal: 1000, deuterium: 0 }, time: 30, counter: "Beats Transports" },
  { id: "heavyFighter", name: "Heavy Fighter", icon: Swords, tier: 2, cat: "fighters", atk: 25, def: 8, shd: 0, hull: 50, spd: 10000, cargo: 100, cost: { metal: 6000, crystal: 4000, deuterium: 0 }, time: 60, counter: "Beats Light Fighters" },
  { id: "lightCruiser", name: "Light Cruiser", icon: Crosshair, tier: 2, cat: "cruisers", atk: 30, def: 12, shd: 20, hull: 80, spd: 8000, cargo: 200, cost: { metal: 10000, crystal: 6000, deuterium: 2000 }, time: 120, counter: "Beats Fighters" },
  { id: "heavyCruiser", name: "Heavy Cruiser", icon: Crosshair, tier: 3, cat: "cruisers", atk: 65, def: 25, shd: 50, hull: 150, spd: 6000, cargo: 400, cost: { metal: 25000, crystal: 15000, deuterium: 5000 }, time: 240, counter: "Beats Fighters" },
  { id: "battleship", name: "Battleship", icon: Shield, tier: 3, cat: "capital", atk: 120, def: 50, shd: 100, hull: 300, spd: 4000, cargo: 800, cost: { metal: 60000, crystal: 30000, deuterium: 10000 }, time: 480, counter: "Beats Cruisers" },
  { id: "dreadnought", name: "Dreadnought", icon: Shield, tier: 4, cat: "capital", atk: 250, def: 120, shd: 200, hull: 600, spd: 2000, cargo: 1500, cost: { metal: 150000, crystal: 80000, deuterium: 30000 }, time: 960, counter: "Beats Battleships" },
  { id: "smallCargo", name: "Small Cargo", icon: Package, tier: 1, cat: "transports", atk: 0, def: 2, shd: 0, hull: 20, spd: 15000, cargo: 5000, cost: { metal: 2000, crystal: 2000, deuterium: 0 }, time: 20, counter: "Transport only" },
  { id: "largeCargo", name: "Large Cargo", icon: Package, tier: 2, cat: "transports", atk: 0, def: 5, shd: 0, hull: 40, spd: 8000, cargo: 25000, cost: { metal: 6000, crystal: 6000, deuterium: 0 }, time: 60, counter: "Transport only" },
  { id: "recycler", name: "Recycler", icon: RotateCcw, tier: 2, cat: "utility", atk: 0, def: 10, shd: 0, hull: 60, spd: 5000, cargo: 20000, cost: { metal: 10000, crystal: 6000, deuterium: 2000 }, time: 120, counter: "Salvages debris" },
  { id: "espionageProbe", name: "Espionage Probe", icon: EyeIcon, tier: 1, cat: "utility", atk: 0, def: 0, shd: 0, hull: 1, spd: 100000, cargo: 0, cost: { metal: 1000, crystal: 1000, deuterium: 0 }, time: 10, counter: "Intelligence" },
];

interface DD { id: string; name: string; icon: typeof Shield; power: string; cost: { metal: number; crystal: number; deuterium: number }; time: number; desc: string }

const DEFS: DD[] = [
  { id: "missileLauncher", name: "Missile Launcher", icon: RocketIcon, power: "25 ATK", cost: { metal: 2000, crystal: 500, deuterium: 0 }, time: 30, desc: "Basic ground-to-orbit missile defense system." },
  { id: "laserCannon", name: "Laser Cannon", icon: Zap, power: "50 ATK", cost: { metal: 3000, crystal: 1500, deuterium: 0 }, time: 60, desc: "Directed-energy weapon for anti-fleet defense." },
  { id: "plasmaShield", name: "Plasma Shield", icon: ShieldCheck, power: "200 DEF", cost: { metal: 5000, crystal: 3000, deuterium: 1000 }, time: 120, desc: "Orbital energy barrier that absorbs incoming fire." },
  { id: "gravityWell", name: "Gravity Well", icon: Waves, power: "50% slow", cost: { metal: 8000, crystal: 4000, deuterium: 2000 }, time: 180, desc: "Generates local gravity distortion to slow enemy fleets." },
  { id: "ionDisruptor", name: "Ion Disruptor", icon: Zap, power: "-30% shield", cost: { metal: 12000, crystal: 6000, deuterium: 3000 }, time: 240, desc: "Disables enemy shield generators on approach." },
  { id: "orbitalRing", name: "Orbital Ring", icon: Orbit, power: "500 DEF", cost: { metal: 50000, crystal: 25000, deuterium: 10000 }, time: 600, desc: "Ultimate planetary defense megastructure." },
];

interface RD { id: string; name: string; icon: typeof FlaskConical; eff: string; next: string; max: number; cost: { metal: number; crystal: number; deuterium: number }; prereq?: string }

const TECHS: RD[] = [
  { id: "weaponsTech", name: "Weapons Tech", icon: Swords, eff: "+5% ship attack", next: "+10% ship attack", max: 10, cost: { metal: 5000, crystal: 3000, deuterium: 1000 } },
  { id: "shieldingTech", name: "Shield Tech", icon: ShieldCheck, eff: "+5% shield strength", next: "+10% shield strength", max: 10, cost: { metal: 5000, crystal: 4000, deuterium: 1000 } },
  { id: "armourTech", name: "Hull Tech", icon: Shield, eff: "+5% hull integrity", next: "+10% hull integrity", max: 10, cost: { metal: 4000, crystal: 2000, deuterium: 500 }, prereq: "weaponsTech:3" },
  { id: "combustionDrive", name: "Drive Tech", icon: Gauge, eff: "+10% fleet speed", next: "+20% fleet speed", max: 10, cost: { metal: 3000, crystal: 2000, deuterium: 1000 } },
  { id: "energyTech", name: "Energy Tech", icon: BatteryCharging, eff: "+10% energy output", next: "+20% energy output", max: 10, cost: { metal: 2000, crystal: 3000, deuterium: 0 } },
  { id: "computerTech", name: "Resource Tech", icon: Cpu, eff: "+5% resource yield", next: "+10% resource yield", max: 10, cost: { metal: 3000, crystal: 2000, deuterium: 0 } },
  { id: "astrophysics", name: "Construction Tech", icon: Factory, eff: "-3% build time", next: "-6% build time", max: 10, cost: { metal: 4000, crystal: 4000, deuterium: 1000 } },
  { id: "espionageTech", name: "Fleet Tech", icon: EyeIcon, eff: "+5% fleet capacity", next: "+10% fleet capacity", max: 10, cost: { metal: 6000, crystal: 3000, deuterium: 2000 } },
  { id: "laserTech", name: "Espionage Tech", icon: Radar, eff: "+10% spy accuracy", next: "+20% spy accuracy", max: 10, cost: { metal: 2000, crystal: 4000, deuterium: 500 } },
  { id: "ionTech", name: "Colony Tech", icon: Globe, eff: "+1 colony slot", next: "+2 colony slots", max: 10, cost: { metal: 10000, crystal: 5000, deuterium: 5000 }, prereq: "astrophysics:3" },
  { id: "aiTech", name: "AI Tech", icon: BrainCircuit, eff: "-2% all build times", next: "-4% all build times", max: 10, cost: { metal: 8000, crystal: 8000, deuterium: 3000 }, prereq: "computerTech:5" },
  { id: "quantumTech", name: "Quantum Tech", icon: Atom, eff: "+5% research speed", next: "+10% research speed", max: 10, cost: { metal: 10000, crystal: 10000, deuterium: 5000 }, prereq: "energyTech:5" },
  { id: "gravitonTech", name: "Nano Tech", icon: Dna, eff: "+3% all production", next: "+6% all production", max: 10, cost: { metal: 15000, crystal: 15000, deuterium: 8000 }, prereq: "quantumTech:3" },
  { id: "hyperspaceTech", name: "Exotic Tech", icon: Sparkles, eff: "Unlocks wormholes", next: "Stable wormholes", max: 10, cost: { metal: 20000, crystal: 20000, deuterium: 10000 }, prereq: "gravitonTech:5" },
  { id: "intergalacticResearchNetwork", name: "Galactic Tech", icon: Network, eff: "+5% all research", next: "+10% all research", max: 10, cost: { metal: 25000, crystal: 25000, deuterium: 12000 }, prereq: "hyperspaceTech:3" },
];

const ORBITALS = [
  { id: "orbitalShipyard", name: "Shipyard Orbital", icon: Rocket, eff: "+15% ship build speed", cost: { metal: 20000, crystal: 10000, deuterium: 5000 }, time: 600 },
  { id: "researchStation", name: "Research Station", icon: FlaskConical, eff: "+20% research speed", cost: { metal: 15000, crystal: 15000, deuterium: 3000 }, time: 480 },
  { id: "defensePlatform", name: "Defense Platform", icon: Shield, eff: "+25% orbital defense", cost: { metal: 25000, crystal: 8000, deuterium: 4000 }, time: 720 },
  { id: "tradeCenter", name: "Trade Center", icon: Coins, eff: "+10% market rates", cost: { metal: 10000, crystal: 20000, deuterium: 2000 }, time: 360 },
  { id: "sensorArray", name: "Sensor Array", icon: Radar, eff: "+30% espionage range", cost: { metal: 8000, crystal: 12000, deuterium: 1000 }, time: 300 },
];

const fmt = (s: number) => s < 60 ? `${s}s` : s < 3600 ? `${Math.floor(s/60)}m ${s%60}s` : `${Math.floor(s/3600)}h ${Math.floor((s%3600)/60)}m`;
const cc = (b: { metal: number; crystal: number; deuterium: number }, l: number) => {
  const m = Math.pow(1.5, l);
  return { metal: Math.floor(b.metal * m), crystal: Math.floor(b.crystal * m), deuterium: Math.floor(b.deuterium * m) };
};

function BldgCard({ b, lv, res, up }: { b: BD; lv: number; res: any; up: (i: string, n: string, t: number) => void }) {
  const [ex, setEx] = useState(false);
  const c = cc(b.cost, lv); const t = (lv+1)*20; const ok = res.metal>=c.metal && res.crystal>=c.crystal && res.deuterium>=c.deuterium;
  return (
    <Card className={cn("bg-slate-900/60 border-slate-700/50 hover:border-slate-600 transition-all group overflow-hidden", !ok && "opacity-60")}>
      <div className={cn("h-28 relative flex items-center justify-center", CC[b.cat])}>
        <b.icon className="w-14 h-14 opacity-30 group-hover:opacity-50 transition-opacity" />
        <b.icon className="w-10 h-10 absolute group-hover:scale-110 transition-transform" />
        <div className="absolute top-2 left-2"><div className={cn("w-2 h-2 rounded-full", CD[b.cat])} /></div>
        <div className="absolute bottom-2 right-2 bg-slate-950/80 px-2 py-0.5 rounded text-xs font-mono border border-slate-700/50">Lv.{lv}</div>
      </div>
      <CardContent className="p-3 space-y-2">
        <span className="text-sm font-semibold text-slate-200">{b.name}</span>
        <p className="text-xs text-slate-400">{b.prod}</p>
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <span>{c.metal.toLocaleString()}</span><span>•</span><span>{c.crystal.toLocaleString()}</span><span>•</span><span>{c.deuterium.toLocaleString()}</span>
          <span className="ml-auto text-slate-500">{fmt(t)}</span>
        </div>
        <Button size="sm" className="w-full font-orbitron text-xs" disabled={!ok} onClick={() => up(b.id, b.name, t*1000)}>
          <ArrowUpCircle className="w-3 h-3 mr-1" /> Upgrade
        </Button>
        <Button variant="ghost" size="sm" className="w-full text-xs text-slate-400" onClick={() => setEx(!ex)}>
          {ex ? "Less" : "Details"}
        </Button>
        {ex && <div className="pt-2 border-t border-slate-700/50 text-xs text-slate-300">{b.desc}</div>}
      </CardContent>
    </Card>
  );
}

function ShipCard({ s, res, build }: { s: SD; res: any; build: (unitId: string, amount: number, name: string, time: number) => void }) {
  const [q, setQ] = useState(1);
  const tm = s.cost.metal*q, tc = s.cost.crystal*q, td = s.cost.deuterium*q, tt = s.time*q;
  const ok = res.metal>=tm && res.crystal>=tc && res.deuterium>=td;
  return (
    <Card className="bg-slate-900/60 border-slate-700/50 hover:border-slate-600 transition-all">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center border border-slate-700/50">
            <s.icon className="w-5 h-5 text-slate-300" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-200">{s.name}</span>
              <Badge variant="outline" className="text-[10px] px-1 py-0 border-slate-600 text-slate-400">T{s.tier}</Badge>
            </div>
            <div className="text-xs text-slate-500">{s.counter}</div>
          </div>
        </div>
        <div className="grid grid-cols-6 gap-1 text-[10px]">
          {[["ATK", s.atk, "text-red-400"], ["DEF", s.def, "text-blue-400"], ["SHD", s.shd, "text-cyan-400"], ["Hull", s.hull, "text-amber-400"], ["Spd", `${(s.spd/1000).toFixed(0)}k`, "text-green-400"], ["Crg", s.cargo.toLocaleString(), "text-purple-400"]].map(([l,v,c2]) => (
            <div key={l as string} className="bg-slate-800/50 rounded p-1 text-center">
              <div className="text-slate-500">{l}</div>
              <div className={cn("font-mono", c2 as string)}>{v}</div>
            </div>
          ))}
        </div>
        <div className="text-xs text-slate-500">
          {tm.toLocaleString()} M • {tc.toLocaleString()} C • {td.toLocaleString()} D • {fmt(tt)}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center border border-slate-700/50 rounded">
            <Button variant="ghost" size="sm" className="h-7 px-2" onClick={() => setQ(Math.max(1,q-1))}><Minus className="w-3 h-3" /></Button>
            <span className="text-sm font-mono px-2 min-w-[2rem] text-center text-slate-200">{q}</span>
            <Button variant="ghost" size="sm" className="h-7 px-2" onClick={() => setQ(q+1)}><Plus className="w-3 h-3" /></Button>
          </div>
          <Button size="sm" className="flex-1 font-orbitron text-xs" disabled={!ok} onClick={() => build(s.id, q, s.name, tt*1000)}>Build</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function DefCard({ d, lv, res, up }: { d: DD; lv: number; res: any; up: (i: string, n: string, t: number) => void }) {
  const c = cc(d.cost, lv); const ok = res.metal>=c.metal && res.crystal>=c.crystal && res.deuterium>=c.deuterium;
  return (
    <Card className="bg-slate-900/60 border-slate-700/50 hover:border-slate-600 transition-all">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-red-950/40 flex items-center justify-center border border-red-700/40">
            <d.icon className="w-5 h-5 text-red-400" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-slate-200">{d.name}</div>
            <div className="text-xs text-red-400 font-mono">{d.power}</div>
          </div>
          <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">Lv.{lv}</Badge>
        </div>
        <p className="text-xs text-slate-400">{d.desc}</p>
        <div className="text-xs text-slate-500">{c.metal.toLocaleString()} M • {c.crystal.toLocaleString()} C • {c.deuterium.toLocaleString()} D • {fmt(d.time)}</div>
        <Button size="sm" className="w-full font-orbitron text-xs" disabled={!ok} onClick={() => up(d.id, d.name, d.time*1000)}>
          <ArrowUpCircle className="w-3 h-3 mr-1" /> Build
        </Button>
      </CardContent>
    </Card>
  );
}

function TechCard({ t, lv, res, research }: { t: RD; lv: number; res: any; research: (i: string, n: string, tm: number) => void }) {
  const c = cc(t.cost, lv); const tm = (lv+1)*30;
  const ok = res.metal>=c.metal && res.crystal>=c.crystal && res.deuterium>=c.deuterium;
  const full = lv >= t.max;
  return (
    <Card className={cn("bg-slate-900/60 border-slate-700/50 hover:border-slate-600 transition-all", full && "border-emerald-700/40")}>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-950/40 flex items-center justify-center border border-blue-700/40">
            <t.icon className="w-5 h-5 text-blue-400" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-slate-200">{t.name}</div>
            <div className="text-xs text-blue-400">Lv.{lv}/{t.max}</div>
          </div>
          {full && <Badge variant="outline" className="text-xs border-emerald-600 text-emerald-400">MAX</Badge>}
        </div>
        <div className="bg-slate-800/50 rounded p-2 space-y-1 text-xs">
          <div className="flex justify-between"><span className="text-slate-500">Current:</span><span className="text-slate-300">{t.eff}</span></div>
          {!full && <div className="flex justify-between"><span className="text-slate-500">Next:</span><span className="text-emerald-400">{t.next}</span></div>}
        </div>
        {t.prereq && <div className="text-xs text-amber-400 flex items-center gap-1"><Lock className="w-3 h-3" /> Requires: {t.prereq}</div>}
        <div className="text-xs text-slate-500">{c.metal.toLocaleString()} M • {c.crystal.toLocaleString()} C • {c.deuterium.toLocaleString()} D • {fmt(tm)}</div>
        <Button size="sm" className="w-full font-orbitron text-xs" disabled={!ok||full} onClick={() => research(t.id, t.name, tm*1000)}>
          {full ? "Completed" : <><FlaskConical className="w-3 h-3 mr-1" /> Research</>}
        </Button>
      </CardContent>
    </Card>
  );
}

function OrbCard({ o, res, up }: { o: typeof ORBITALS[0]; res: any; up: (i: string, n: string, t: number) => void }) {
  const ok = res.metal>=o.cost.metal && res.crystal>=o.cost.crystal && res.deuterium>=o.cost.deuterium;
  return (
    <Card className="bg-slate-900/60 border-purple-700/30 hover:border-purple-600/50 transition-all">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-950/40 flex items-center justify-center border border-purple-700/40">
            <o.icon className="w-5 h-5 text-purple-400" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-slate-200">{o.name}</div>
            <div className="text-xs text-purple-400">{o.eff}</div>
          </div>
        </div>
        <div className="text-xs text-slate-500">{o.cost.metal.toLocaleString()} M • {o.cost.crystal.toLocaleString()} C • {o.cost.deuterium.toLocaleString()} D • {fmt(o.time)}</div>
        <Button size="sm" className="w-full font-orbitron text-xs" disabled={!ok} onClick={() => up(o.id, o.name, o.time*1000)}>
          <ArrowUpCircle className="w-3 h-3 mr-1" /> Construct
        </Button>
      </CardContent>
    </Card>
  );
}

export default function Facilities() {
  const { buildings, orbitalBuildings, resources, updateBuilding, queue, buildUnit, research, updateResearch, setTaxRate, government, units } = useGame();
  const [tab, setTab] = useState<Tab>("buildings");
  const [sCat, setSCat] = useState<string>("fighters");
  const [autoDef, setAutoDef] = useState(true);
  const [tax, setTax] = useState([government.taxRate]);
  const [wA, setWA] = useState(60); const [sA, setSA] = useState(25); const [solA, setSolA] = useState(15);
  const bq = queue.filter(q => q.type === "building"); const sq = queue.filter(q => q.type === "unit"); const rq = queue.filter(q => q.type === "research");
  const totLvl = Object.values(buildings).reduce((a,b)=>a+b,0);
  const fShips = useMemo(() => SHIPS.filter(s=>s.cat===sCat), [sCat]);
  const totUnits = Object.values(units).reduce((a,b)=>a+b,0);

  const renderQueue = (items: typeof queue, IconComp: typeof Hammer, color: string) => (
    <div className="space-y-2">
      {items.map((item, i) => {
        const tl = Math.max(0, Math.floor((item.endTime - Date.now()) / 1000));
        return (
          <div key={i} className="flex items-center gap-3 bg-slate-800/50 p-2 rounded border border-slate-700/30">
            <IconComp className={cn("w-4 h-4", color)} />
            <div className="flex-1">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-200">{item.name}{item.amount && item.amount > 1 ? ` x${item.amount}` : ""}</span>
                <span className={cn("font-mono", color)}>{fmt(tl)}</span>
              </div>
              <Progress value={Math.max(0, 100 - (tl / 20) * 100)} className="h-1.5" />
            </div>
            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs text-slate-400"><X className="w-3 h-3" /></Button>
          </div>
        );
      })}
    </div>
  );

  return (
    <GameLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="relative rounded-xl overflow-hidden shadow-lg" style={{ minHeight: 120 }}>
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900 to-transparent" />
          <div className="relative z-10 p-5 flex items-center gap-5">
            <div className="w-14 h-14 rounded-xl bg-slate-800 border border-slate-700/50 flex items-center justify-center">
              <Factory className="w-8 h-8 text-amber-400" />
            </div>
            <div>
              <h2 className="text-2xl font-orbitron font-bold text-white">Facilities Command</h2>
              <p className="text-slate-400 text-sm">Manage buildings, fleet, defenses, research, and orbital stations</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[["Metal", resources.metal, "text-amber-400"], ["Crystal", resources.crystal, "text-blue-400"], ["Deuterium", resources.deuterium, "text-cyan-400"], ["Energy", resources.energy, "text-yellow-400"], ["Dark Matter", resources.darkmatter, "text-purple-400"]].map(([l,v,c]) => (
            <Card key={l as string} className="bg-slate-900/60 border-slate-700/50">
              <CardContent className="p-3">
                <div className="text-xs text-slate-500 uppercase">{l}</div>
                <div className={cn("text-lg font-mono", c as string)}>{(v as number).toLocaleString()}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {bq.length > 0 && (
          <Card className="bg-slate-900/60 border-amber-700/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-amber-400 flex items-center gap-2">
                <Hammer className="w-4 h-4" /> Build Queue ({bq.length}/5)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {renderQueue(bq, Hammer, "text-amber-400")}
              {Array.from({ length: Math.max(0, 5 - bq.length) }).map((_, i) => (
                <div key={`e${i}`} className="flex items-center justify-center h-10 border border-dashed border-slate-700/30 rounded text-xs text-slate-600 mt-2">
                  Empty Slot
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        <Tabs value={tab} onValueChange={(v) => setTab(v as Tab)} className="w-full">
          <TabsList className="bg-slate-900/60 border border-slate-700/50 h-auto w-full flex-wrap justify-start gap-1 p-1">
            <TabsTrigger value="buildings" className="font-orbitron text-xs px-3 data-[state=active]:bg-slate-800 data-[state=active]:text-white"><Factory className="w-4 h-4 mr-1.5" /> Buildings</TabsTrigger>
            <TabsTrigger value="shipyard" className="font-orbitron text-xs px-3 data-[state=active]:bg-slate-800 data-[state=active]:text-white"><Rocket className="w-4 h-4 mr-1.5" /> Shipyard</TabsTrigger>
            <TabsTrigger value="defenses" className="font-orbitron text-xs px-3 data-[state=active]:bg-slate-800 data-[state=active]:text-white"><Shield className="w-4 h-4 mr-1.5" /> Defenses</TabsTrigger>
            <TabsTrigger value="research" className="font-orbitron text-xs px-3 data-[state=active]:bg-slate-800 data-[state=active]:text-white"><FlaskConical className="w-4 h-4 mr-1.5" /> Research</TabsTrigger>
            <TabsTrigger value="colony" className="font-orbitron text-xs px-3 data-[state=active]:bg-slate-800 data-[state=active]:text-white"><Globe className="w-4 h-4 mr-1.5" /> Colony</TabsTrigger>
            <TabsTrigger value="orbital" className="font-orbitron text-xs px-3 data-[state=active]:bg-slate-800 data-[state=active]:text-white"><Satellite className="w-4 h-4 mr-1.5" /> Orbital</TabsTrigger>
            <TabsTrigger value="history" className="font-orbitron text-xs px-3 data-[state=active]:bg-slate-800 data-[state=active]:text-white"><BarChart3 className="w-4 h-4 mr-1.5" /> History</TabsTrigger>
          </TabsList>

          <TabsContent value="buildings" className="mt-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {BLDGS.map(b => <BldgCard key={b.id} b={b} lv={buildings[b.id as keyof typeof buildings]||0} res={resources} up={updateBuilding} />)}
            </div>
          </TabsContent>

          <TabsContent value="shipyard" className="mt-4 space-y-4">
            <Card className="bg-slate-900/60 border-slate-700/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2"><Ship className="w-5 h-5 text-slate-400" /><span className="text-sm font-semibold text-slate-200">Fleet Supply</span></div>
                  <span className="text-xs text-slate-400 font-mono">{totUnits} / 500 units</span>
                </div>
                <Progress value={(totUnits / 500) * 100} className="h-2 mt-2" />
              </CardContent>
            </Card>
            <div className="flex gap-2 flex-wrap">
              {(["fighters","cruisers","capital","transports","utility"] as const).map(c => (
                <Button key={c} variant={sCat===c?"default":"outline"} size="sm" className="font-orbitron text-xs capitalize" onClick={() => setSCat(c)}>{c}</Button>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {fShips.map(s => <ShipCard key={s.id} s={s} res={resources} build={buildUnit} />)}
            </div>
            {sq.length > 0 && (
              <Card className="bg-slate-900/60 border-blue-700/30">
                <CardHeader className="pb-2"><CardTitle className="text-xs font-bold uppercase tracking-widest text-blue-400 flex items-center gap-2"><Wrench className="w-4 h-4" /> Active Builds</CardTitle></CardHeader>
                <CardContent>{renderQueue(sq, Ship, "text-blue-400")}</CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="defenses" className="mt-4 space-y-4">
            <Card className="bg-slate-900/60 border-slate-700/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2"><Shield className="w-5 h-5 text-red-400" /><span className="text-sm font-semibold text-slate-200">Defense Grid</span></div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">Auto-Defense</span>
                    <Button variant={autoDef?"default":"outline"} size="sm" className="h-7 text-xs" onClick={() => setAutoDef(!autoDef)}>{autoDef?"ON":"OFF"}</Button>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                  {[["Total Power","1,250","text-red-400"],["Coverage","85%","text-amber-400"],["Structures","12","text-blue-400"]].map(([l,v,c]) => (
                    <div key={l as string} className="bg-slate-800/50 rounded p-2 text-center">
                      <div className="text-slate-500">{l}</div>
                      <div className={cn("font-mono text-lg", c as string)}>{v}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {DEFS.map(d => <DefCard key={d.id} d={d} lv={0} res={resources} up={updateBuilding} />)}
            </div>
          </TabsContent>

          <TabsContent value="research" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {TECHS.map(t => <TechCard key={t.id} t={t} lv={research[t.id]||0} res={resources} research={updateResearch} />)}
            </div>
          </TabsContent>

          <TabsContent value="colony" className="mt-4 space-y-4">
            <Card className="bg-slate-900/60 border-emerald-700/30">
              <CardHeader className="pb-2"><CardTitle className="text-sm font-bold uppercase tracking-widest text-emerald-400 flex items-center gap-2"><Globe className="w-4 h-4" /> Colony Overview</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[["Population","12,450","text-emerald-400"],["Happiness","72%","text-amber-400"],["Buildings",String(totLvl),"text-blue-400"],["Defense","1,250","text-red-400"]].map(([l,v,c]) => (
                    <div key={l as string} className="bg-slate-800/50 rounded p-3 text-center">
                      <div className="text-xs text-slate-500">{l}</div>
                      <div className={cn("text-lg font-mono", c as string)}>{v}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-slate-900/60 border-slate-700/50">
              <CardHeader className="pb-2"><CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2"><Users className="w-4 h-4" /> Population Allocation</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-400">Workers</span>
                      <span className="text-emerald-400 font-mono">{wA}%</span>
                    </div>
                    <Slider value={[wA]} onValueChange={(v) => setWA(v[0])} max={100} step={5} />
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-400">Scientists</span>
                      <span className="text-blue-400 font-mono">{sA}%</span>
                    </div>
                    <Slider value={[sA]} onValueChange={(v) => setSA(v[0])} max={100} step={5} />
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-400">Soldiers</span>
                      <span className="text-red-400 font-mono">{solA}%</span>
                    </div>
                    <Slider value={[solA]} onValueChange={(v) => setSolA(v[0])} max={100} step={5} />
                  </div>
                </div>
                <Separator className="bg-slate-700/50" />
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-slate-400">Tax Rate</span>
                    <span className="text-amber-400 font-mono">{tax[0]}%</span>
                  </div>
                  <Slider value={tax} onValueChange={(v) => { setTax(v); setTaxRate(v[0]); }} max={50} step={1} />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-slate-900/60 border-slate-700/50">
              <CardHeader className="pb-2"><CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2"><Rocket className="w-4 h-4" /> Expansion</CardTitle></CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Button className="font-orbitron text-xs"><Plus className="w-4 h-4 mr-1" /> Colony Ship</Button>
                  <div className="text-xs text-slate-400">Cost: 10,000 M • 5,000 C • 10,000 D • Build: 20min</div>
                </div>
                <div className="mt-3 space-y-2">
                  {["Kepler-442b [4:102:8]","TRAPPIST-1e [7:55:12]","Proxima d [2:201:3]"].map(s => (
                    <div key={s} className="flex items-center justify-between bg-slate-800/50 p-2 rounded border border-slate-700/30">
                      <span className="text-xs text-slate-300">{s}</span>
                      <Button variant="outline" size="sm" className="h-6 text-xs">Colonize</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orbital" className="mt-4 space-y-4">
            <Card className="bg-slate-900/60 border-purple-700/30">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Satellite className="w-5 h-5 text-purple-400" />
                  <span className="text-sm font-semibold text-slate-200">Orbital Slots</span>
                  <span className="text-xs text-slate-400 ml-auto">2/5 used</span>
                </div>
                <div className="mt-2 flex gap-1">
                  {[1,2,3,4,5].map(s => <div key={s} className={cn("h-2 flex-1 rounded", s<=2?"bg-purple-500":"bg-slate-700/50")} />)}
                </div>
              </CardContent>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ORBITALS.map(o => <OrbCard key={o.id} o={o} res={resources} up={updateBuilding} />)}
            </div>
          </TabsContent>

          <TabsContent value="history" className="mt-4 space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[["Total Buildings",totLvl,"text-amber-400"],["Total Ships",totUnits,"text-blue-400"],["Research Levels",Object.values(research).reduce((a,b)=>a+b,0),"text-green-400"],["Total Defense","1,250","text-red-400"]].map(([l,v,c]) => (
                <Card key={l as string} className="bg-slate-900/60 border-slate-700/50">
                  <CardContent className="p-3 text-center">
                    <div className="text-xs text-slate-500">{l}</div>
                    <div className={cn("text-2xl font-mono", c as string)}>{typeof v==="number"?v.toLocaleString():v}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Card className="bg-slate-900/60 border-slate-700/50">
              <CardHeader className="pb-2"><CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2"><BarChart3 className="w-4 h-4" /> Construction Log</CardTitle></CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  <div className="space-y-2">
                    {[
                      { date: "2026-06-23 14:32", type: "Building", name: "Metal Mine → Lv.10", cost: "60 M • 15 C" },
                      { date: "2026-06-23 13:15", type: "Ship", name: "Light Fighter x5", cost: "15,000 M • 5,000 C" },
                      { date: "2026-06-23 11:48", type: "Research", name: "Weapons Tech → Lv.3", cost: "5,000 M • 3,000 C" },
                      { date: "2026-06-23 09:22", type: "Defense", name: "Missile Launcher x2", cost: "4,000 M • 1,000 C" },
                      { date: "2026-06-22 22:10", type: "Building", name: "Crystal Mine → Lv.8", cost: "48 M • 24 C" },
                      { date: "2026-06-22 18:45", type: "Ship", name: "Small Cargo x3", cost: "6,000 M • 6,000 C" },
                      { date: "2026-06-22 15:30", type: "Research", name: "Energy Tech → Lv.5", cost: "2,000 M • 3,000 C" },
                    ].map((e, i) => (
                      <div key={i} className="flex items-center gap-3 bg-slate-800/30 p-2 rounded border border-slate-700/20">
                        <Badge variant="outline" className={cn("text-[10px] px-1.5 py-0 shrink-0",
                          e.type==="Building"&&"border-amber-600 text-amber-400",
                          e.type==="Ship"&&"border-blue-600 text-blue-400",
                          e.type==="Research"&&"border-green-600 text-green-400",
                          e.type==="Defense"&&"border-red-600 text-red-400",
                        )}>{e.type}</Badge>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs text-slate-200 truncate">{e.name}</div>
                          <div className="text-[10px] text-slate-500">{e.date}</div>
                        </div>
                        <div className="text-[10px] text-slate-400 shrink-0">{e.cost}</div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </GameLayout>
  );
}
