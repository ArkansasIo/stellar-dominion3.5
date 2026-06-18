import GameLayout from "@/components/layout/GameLayout";
import { useGame } from "@/lib/gameContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";
import { getPlanetDetails } from "@/lib/planetUtils";
import { KARDASHEV_SCALE, getKardashevLevel, calculateProgressToNext, KardashevLevel } from "@/lib/kardashevScale";
import {
  Globe, Zap, Database, Box, Gem, FlaskConical, Rocket, Factory,
  Pickaxe, Shield, Swords, Users, Landmark, Crown, Trophy, Star,
  MapPin, Thermometer, TrendingUp, BarChart2, Activity, ArrowRight,
  Building2, BookOpen, Ship, Target, Orbit, Home, MessageSquare
} from "lucide-react";

// ─── helpers ────────────────────────────────────────────────────────────────

function fmt(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000)     return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000)         return `${(n / 1_000).toFixed(2)}K`;
  return Math.floor(n).toLocaleString();
}

// Stat card shown in the top metrics row
function StatCard({
  label, value, sub, icon: Icon, colorClass, href,
}: {
  label: string; value: string | number; sub?: string;
  icon: React.ElementType; colorClass: string; href?: string;
}) {
  const inner = (
    <CardContent className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className={`text-xs uppercase tracking-wider font-semibold ${colorClass}`}>{label}</div>
          <div className="text-2xl font-orbitron font-bold text-slate-900 mt-0.5">{value}</div>
          {sub && <div className="text-xs text-slate-500 mt-0.5">{sub}</div>}
        </div>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-current/5`}>
          <Icon className={`w-6 h-6 ${colorClass}`} />
        </div>
      </div>
    </CardContent>
  );
  return href ? (
    <Link href={href}>
      <Card className="cursor-pointer hover:shadow-md transition-shadow border-slate-200">{inner}</Card>
    </Link>
  ) : (
    <Card className="border-slate-200">{inner}</Card>
  );
}

// Resource row inside the homeworld panel
function ResourceRow({
  icon: Icon, label, value, production, colorClass,
}: {
  icon: React.ElementType; label: string; value: number;
  production?: number; colorClass: string;
}) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-slate-100 last:border-0">
      <div className="flex items-center gap-2">
        <Icon className={`w-4 h-4 ${colorClass}`} />
        <span className="text-sm font-medium text-slate-700">{label}</span>
      </div>
      <div className="flex items-center gap-4">
        <span className={`font-mono font-bold text-sm ${colorClass}`}>{fmt(value)}</span>
        {production !== undefined && (
          <span className="text-xs text-slate-500 font-mono w-20 text-right">
            {production >= 0 ? "+" : ""}{fmt(production)}/h
          </span>
        )}
      </div>
    </div>
  );
}

// Quick-link tile for the management grid
function ManageTile({
  href, icon: Icon, label, description, colorClass,
}: {
  href: string; icon: React.ElementType; label: string;
  description: string; colorClass: string;
}) {
  return (
    <Link href={href}>
      <div className="group flex items-start gap-3 p-3 rounded-lg border border-slate-200 bg-white hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer">
        <div className={`p-2 rounded-md bg-slate-100 group-hover:bg-primary/10 ${colorClass}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <div className="text-sm font-bold text-slate-800 font-rajdhani uppercase tracking-wide">{label}</div>
          <div className="text-xs text-slate-500 truncate">{description}</div>
        </div>
        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-primary ml-auto self-center shrink-0" />
      </div>
    </Link>
  );
}

// ─── main component ──────────────────────────────────────────────────────────

export default function EmpireView() {
  const {
    planetName, coordinates, resources, buildings, orbitalBuildings,
    research, units, commander, government, activeMissions, alliance,
    messages, username,
  } = useGame();

  // Planet classification
  const coordParts = coordinates.split(":").map((p) => parseInt(p) || 0);
  const planetSeed =
    (coordParts[0] || 1) * 10_000 +
    (coordParts[1] || 1) * 1_000 +
    (coordParts[2] || 100) * 100 +
    (coordParts[3] || 3);
  const planetInfo = getPlanetDetails(planetSeed);

  // Homeworld production per hour (approximate)
  const metalProd  = Math.floor(30  * buildings.metalMine               * Math.pow(1.1,  buildings.metalMine));
  const crystalProd= Math.floor(20  * buildings.crystalMine             * Math.pow(1.1,  buildings.crystalMine));
  const deutProd   = Math.floor(10  * buildings.deuteriumSynthesizer    * Math.pow(1.02, buildings.deuteriumSynthesizer));
  const energyProd = Math.floor(20  * buildings.solarPlant              * Math.pow(1.1,  buildings.solarPlant))
                   - Math.floor(10  * (buildings.metalMine + buildings.crystalMine + buildings.deuteriumSynthesizer));

  // Empire metrics
  const totalFleetPower     = Object.values(units).reduce((s, n) => s + n * 100, 0);
  const totalResearchLevels = Object.values(research).reduce((s, n) => s + n, 0);
  const totalBuildingLevels = Object.values(buildings).reduce((s, n) => s + n, 0);
  const empireScore         = Math.floor(totalFleetPower / 10 + totalResearchLevels * 100 + totalBuildingLevels * 50);

  // Kardashev level
  const kardashevLevel = getKardashevLevel(totalResearchLevels);
  const kardashevTier  = KARDASHEV_SCALE[kardashevLevel];
  const kardashevProgress = calculateProgressToNext(
    kardashevLevel as KardashevLevel,
    resources.metal, resources.crystal, resources.deuterium
  );
  const nextTier = kardashevLevel < 18 ? KARDASHEV_SCALE[(kardashevLevel + 1) as KardashevLevel] : null;

  const displayUsername = username || localStorage.getItem("stellar_username") || "Commander";
  const unreadMessages  = messages.filter((m: any) => !m.read && m.to === "Commander").length;

  // Quick building summary (top 9 most-built)
  const buildingEntries = Object.entries(buildings)
    .filter(([, v]) => v > 0)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 9);

  const buildingLabels: Record<string, string> = {
    metalMine: "Metal Mine", crystalMine: "Crystal Mine",
    deuteriumSynthesizer: "Deut. Synth", solarPlant: "Solar Plant",
    roboticsFactory: "Robotics", shipyard: "Shipyard",
    researchLab: "Research Lab", allianceDepot: "Alliance Depot",
    missileSilo: "Missile Silo", naniteFactory: "Nanite Factory",
    terraformer: "Terraformer", spaceStation: "Space Station",
  };

  // Top fleet units
  const unitEntries = Object.entries(units)
    .filter(([, n]) => n > 0)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6);

  const unitLabels: Record<string, string> = {
    lightFighter: "Light Fighter", heavyFighter: "Heavy Fighter",
    cruiser: "Cruiser", battleship: "Battleship",
    smallCargo: "Small Cargo", largeCargo: "Large Cargo",
    colonyShip: "Colony Ship", recycler: "Recycler",
    espionageProbe: "Esp. Probe", destroyer: "Destroyer",
    deathStar: "Death Star", marine: "Marine", colonist: "Colonist",
  };

  return (
    <GameLayout>
      <div className="space-y-6 animate-in fade-in duration-500" data-testid="empire-view">

        {/* ── Page header ──────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-3xl font-orbitron font-bold text-slate-900 flex items-center gap-2">
              <Crown className="w-8 h-8 text-amber-500" />
              Empire Management
            </h1>
            <p className="text-muted-foreground font-rajdhani text-lg mt-1">
              {displayUsername} &nbsp;·&nbsp; {planetName} &nbsp;·&nbsp;
              <span className="font-mono text-sm">[{coordinates}]</span>
            </p>
          </div>
          <div className="text-right text-sm text-slate-500">
            <div className="font-mono">{new Date().toLocaleTimeString('en-US', { timeZone: 'UTC' })} UTC</div>
            <div className="text-xs">{new Date().toLocaleDateString()}</div>
          </div>
        </div>

        {/* ── Top stats row ─────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            label="Empire Score"
            value={fmt(empireScore)}
            icon={Trophy}
            colorClass="text-amber-600"
            href="/empire-progression"
          />
          <StatCard
            label="Fleet Power"
            value={fmt(totalFleetPower)}
            sub={`${Object.values(units).reduce((s, n) => s + n, 0)} units`}
            icon={Rocket}
            colorClass="text-blue-600"
            href="/fleet"
          />
          <StatCard
            label="Research Total"
            value={totalResearchLevels}
            sub="combined levels"
            icon={FlaskConical}
            colorClass="text-green-600"
            href="/research"
          />
          <StatCard
            label="Kardashev Level"
            value={`Lv ${kardashevLevel}`}
            sub={kardashevTier.name}
            icon={Crown}
            colorClass="text-purple-600"
            href="/empire-progression"
          />
        </div>

        {/* ── Main 3-column layout ──────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── LEFT col: Homeworld + Resources ─────────────────── */}
          <div className="space-y-4">

            {/* Homeworld card */}
            <Card className="border-slate-200 shadow-sm" data-testid="card-homeworld">
              <CardHeader className="pb-2 bg-gradient-to-r from-primary/10 to-blue-50 rounded-t-lg">
                <CardTitle className="text-base font-orbitron flex items-center gap-2">
                  <Globe className="w-5 h-5 text-primary" />
                  Home World
                  <Badge className="ml-auto bg-primary/10 text-primary border-primary/30 text-xs">Capital</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-green-500 flex items-center justify-center shadow-inner">
                    <Globe className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <div className="font-orbitron font-bold text-lg text-slate-900">{planetName}</div>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <MapPin className="w-3 h-3" />
                      <span className="font-mono">[{coordinates}]</span>
                    </div>
                    <Badge variant="outline" className="mt-1 text-xs">
                      Class {planetInfo.class} – {planetInfo.type}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-50 rounded p-2">
                    <div className="text-slate-400 uppercase tracking-wide">Temperature</div>
                    <div className="font-mono font-bold text-slate-700 flex items-center gap-1">
                      <Thermometer className="w-3 h-3 text-orange-400" />
                      {planetInfo.temperature}
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded p-2">
                    <div className="text-slate-400 uppercase tracking-wide">Gravity</div>
                    <div className="font-mono font-bold text-slate-700">{planetInfo.gravity}</div>
                  </div>
                  <div className="bg-slate-50 rounded p-2 col-span-2">
                    <div className="text-slate-400 uppercase tracking-wide">Atmosphere</div>
                    <div className="font-mono font-bold text-slate-700">{planetInfo.atmosphere}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Resources card */}
            <Card className="border-slate-200 shadow-sm" data-testid="card-resources">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <Database className="w-4 h-4 text-slate-400" />
                  Resources &amp; Production
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <ResourceRow icon={Pickaxe}  label="Metal"      value={resources.metal}      production={metalProd}   colorClass="text-slate-600" />
                <ResourceRow icon={Gem}      label="Crystal"    value={resources.crystal}    production={crystalProd} colorClass="text-blue-500" />
                <ResourceRow icon={Box}      label="Deuterium"  value={resources.deuterium}  production={deutProd}    colorClass="text-green-500" />
                <ResourceRow icon={Zap}      label="Energy"     value={resources.energy}     production={energyProd}  colorClass="text-yellow-500" />
              </CardContent>
            </Card>

            {/* Government / Commander */}
            <Card className="border-slate-200 shadow-sm" data-testid="card-gov-commander">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <Landmark className="w-4 h-4 text-slate-400" />
                  Leadership
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Government</span>
                  <Badge variant="outline" className="capitalize text-xs font-semibold">
                    {government.type}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Stability</span>
                  <span className="text-sm font-mono font-bold text-slate-900">
                    {government.stats.stability}%
                  </span>
                </div>
                <Progress value={government.stats.stability} className="h-1.5" />
                <div className="border-t border-slate-100 pt-2 flex items-center justify-between">
                  <span className="text-sm text-slate-600">Commander</span>
                  <span className="text-sm font-bold text-slate-900 capitalize">
                    {commander.name} &mdash; {commander.class}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Commander Level</span>
                  <span className="text-sm font-mono font-bold text-primary">
                    Lv {commander.stats.level}
                  </span>
                </div>
                <div className="flex gap-1 flex-wrap">
                  {["warfare", "logistics", "science", "engineering"].map((stat) => (
                    <Badge key={stat} variant="outline" className="text-xs capitalize">
                      {stat[0].toUpperCase()}: {(commander.stats as Record<string, number>)[stat] ?? 1}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ── CENTRE col: Buildings + Fleet ───────────────────── */}
          <div className="space-y-4">

            {/* Homeworld buildings */}
            <Card className="border-slate-200 shadow-sm" data-testid="card-buildings">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-slate-400" />
                  Homeworld Buildings
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                {buildingEntries.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-4">No buildings constructed yet.</p>
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    {buildingEntries.map(([key, level]) => (
                      <div
                        key={key}
                        className="bg-slate-50 border border-slate-200 rounded p-2 text-center"
                      >
                        <div className="text-[10px] text-slate-500 uppercase tracking-wide leading-tight">
                          {buildingLabels[key] ?? key}
                        </div>
                        <div className="text-lg font-orbitron font-bold text-slate-900 mt-0.5">
                          {level}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <Link href="/facilities">
                  <button className="mt-3 w-full text-xs text-primary font-semibold flex items-center justify-center gap-1 hover:underline">
                    Manage Facilities <ArrowRight className="w-3 h-3" />
                  </button>
                </Link>
              </CardContent>
            </Card>

            {/* Fleet summary */}
            <Card className="border-slate-200 shadow-sm" data-testid="card-fleet">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <Ship className="w-4 h-4 text-slate-400" />
                  Fleet &amp; Military
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                {unitEntries.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-4">No units deployed.</p>
                ) : (
                  <div className="space-y-2">
                    {unitEntries.map(([key, count]) => (
                      <div key={key} className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">{unitLabels[key] ?? key}</span>
                        <span className="font-mono font-bold text-slate-900">{fmt(count)}</span>
                      </div>
                    ))}
                  </div>
                )}
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Total fleet power</span>
                  <span className="font-orbitron font-bold text-blue-600">{fmt(totalFleetPower)}</span>
                </div>
                <div className="flex gap-2 mt-3">
                  <Link href="/shipyard">
                    <button className="flex-1 text-xs text-primary font-semibold flex items-center justify-center gap-1 hover:underline">
                      Shipyard <ArrowRight className="w-3 h-3" />
                    </button>
                  </Link>
                  <Link href="/fleet">
                    <button className="flex-1 text-xs text-primary font-semibold flex items-center justify-center gap-1 hover:underline">
                      Fleet Command <ArrowRight className="w-3 h-3" />
                    </button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Active missions */}
            <Card className="border-slate-200 shadow-sm" data-testid="card-missions">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <Target className="w-4 h-4 text-slate-400" />
                  Active Missions
                  {activeMissions.length > 0 && (
                    <Badge className="ml-auto bg-orange-100 text-orange-700 border-orange-300 text-xs">
                      {activeMissions.length}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                {activeMissions.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-4">No active missions.</p>
                ) : (
                  <div className="space-y-2">
                    {activeMissions.slice(0, 5).map((m: any) => (
                      <div key={m.id} className="flex items-center justify-between text-xs">
                        <Badge
                          variant="outline"
                          className={`capitalize ${
                            m.type === "attack" ? "border-red-300 text-red-600" :
                            m.type === "espionage" ? "border-yellow-300 text-yellow-600" :
                            "border-blue-300 text-blue-600"
                          }`}
                        >
                          {m.type}
                        </Badge>
                        <span className="font-mono text-slate-600">{m.target}</span>
                        <span className={`font-bold ${m.status === "returning" ? "text-green-600" : "text-orange-600"}`}>
                          {m.status}
                        </span>
                      </div>
                    ))}
                    {activeMissions.length > 5 && (
                      <p className="text-xs text-slate-400 text-center">
                        +{activeMissions.length - 5} more
                      </p>
                    )}
                  </div>
                )}
                <Link href="/fleet">
                  <button className="mt-3 w-full text-xs text-primary font-semibold flex items-center justify-center gap-1 hover:underline">
                    Fleet Command <ArrowRight className="w-3 h-3" />
                  </button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* ── RIGHT col: Kardashev + Alliance + Nav ───────────── */}
          <div className="space-y-4">

            {/* Kardashev progress */}
            <Card className="border-slate-200 shadow-sm" data-testid="card-kardashev">
              <CardHeader className="pb-2 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-t-lg">
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <Crown className="w-4 h-4 text-amber-500" />
                  Kardashev Scale
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-500">Current Level</div>
                    <div className="font-orbitron font-bold text-xl text-primary">
                      Level {kardashevLevel}
                    </div>
                    <div className="text-sm font-semibold text-slate-700">{kardashevTier.name}</div>
                  </div>
                  <Badge className="bg-primary/10 text-primary border-primary/30 text-2xl px-3 py-1">
                    {kardashevLevel}
                  </Badge>
                </div>
                <p className="text-xs text-slate-500">{kardashevTier.description}</p>

                {nextTier && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Progress to Level {kardashevLevel + 1}</span>
                      <span className="font-bold text-primary">{kardashevProgress}%</span>
                    </div>
                    <Progress value={kardashevProgress} className="h-2" />
                    <div className="text-xs text-slate-400">Next: {nextTier.name}</div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-blue-50 rounded p-2">
                    <div className="text-blue-500 uppercase tracking-wide">Production</div>
                    <div className="font-bold text-blue-800">+{kardashevTier.bonuses.resourceProduction}%</div>
                  </div>
                  <div className="bg-green-50 rounded p-2">
                    <div className="text-green-500 uppercase tracking-wide">Research</div>
                    <div className="font-bold text-green-800">+{kardashevTier.bonuses.researchSpeed}%</div>
                  </div>
                  <div className="bg-red-50 rounded p-2">
                    <div className="text-red-500 uppercase tracking-wide">Fleet</div>
                    <div className="font-bold text-red-800">+{kardashevTier.bonuses.fleetPower}%</div>
                  </div>
                  <div className="bg-amber-50 rounded p-2">
                    <div className="text-amber-500 uppercase tracking-wide">Max Planets</div>
                    <div className="font-bold text-amber-800">{kardashevTier.bonuses.maxPlanets}</div>
                  </div>
                </div>

                <Link href="/empire-progression">
                  <button className="w-full text-xs text-primary font-semibold flex items-center justify-center gap-1 hover:underline mt-1">
                    View Progression <ArrowRight className="w-3 h-3" />
                  </button>
                </Link>
              </CardContent>
            </Card>

            {/* Alliance info */}
            <Card className="border-slate-200 shadow-sm" data-testid="card-alliance">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <Shield className="w-4 h-4 text-slate-400" />
                  Alliance
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                {alliance ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-blue-100 text-blue-800 border-blue-300 font-bold text-base px-2">
                        [{alliance.tag}]
                      </Badge>
                      <span className="font-semibold text-slate-900">{alliance.name}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-slate-50 rounded p-2">
                        <div className="text-slate-400 uppercase">Members</div>
                        <div className="font-bold text-slate-900">{(alliance as any).memberCount ?? "–"}</div>
                      </div>
                      <div className="bg-slate-50 rounded p-2">
                        <div className="text-slate-400 uppercase">Rank</div>
                        <div className="font-bold text-slate-900">{(alliance as any).rank ?? "–"}</div>
                      </div>
                    </div>
                    <Link href="/alliance">
                      <button className="w-full text-xs text-primary font-semibold flex items-center justify-center gap-1 hover:underline">
                        Manage Alliance <ArrowRight className="w-3 h-3" />
                      </button>
                    </Link>
                  </div>
                ) : (
                  <div className="text-center py-3">
                    <p className="text-xs text-slate-400 mb-2">Not in an alliance.</p>
                    <Link href="/alliance">
                      <button className="text-xs text-primary font-semibold hover:underline">
                        Find or Create Alliance →
                      </button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Messages badge */}
            {unreadMessages > 0 && (
              <Card className="border-orange-200 bg-orange-50 shadow-sm">
                <CardContent className="p-4 flex items-center gap-3">
                  <MessageSquare className="w-6 h-6 text-orange-500" />
                  <div className="flex-1">
                    <div className="font-bold text-orange-900 text-sm">
                      {unreadMessages} unread message{unreadMessages > 1 ? "s" : ""}
                    </div>
                    <Link href="/messages">
                      <button className="text-xs text-orange-600 font-semibold hover:underline">
                        View messages →
                      </button>
                    </Link>
                  </div>
                  <Badge className="bg-orange-500 text-white">{unreadMessages}</Badge>
                </CardContent>
              </Card>
            )}

            {/* Research summary */}
            <Card className="border-slate-200 shadow-sm" data-testid="card-research">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-slate-400" />
                  Research Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {Object.entries(research)
                    .filter(([, v]) => v > 0)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 6)
                    .map(([key, level]) => (
                      <div key={key} className="bg-slate-50 rounded p-1.5 flex items-center justify-between">
                        <span className="text-slate-500 truncate capitalize">
                          {key.replace(/([A-Z])/g, " $1").trim()}
                        </span>
                        <span className="font-mono font-bold text-slate-800 ml-1">Lv {level}</span>
                      </div>
                    ))}
                </div>
                {Object.values(research).every((v) => v === 0) && (
                  <p className="text-xs text-slate-400 text-center py-4">No research completed yet.</p>
                )}
                <Link href="/research">
                  <button className="mt-3 w-full text-xs text-primary font-semibold flex items-center justify-center gap-1 hover:underline">
                    Research Lab <ArrowRight className="w-3 h-3" />
                  </button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* ── Management quick-links grid ───────────────────────── */}
        <Card className="border-slate-200 shadow-sm" data-testid="card-management-links">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <Activity className="w-4 h-4 text-slate-400" />
              Empire Management
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              <ManageTile href="/resources"     icon={Pickaxe}     label="Resources"         description="Mines & storage" colorClass="text-slate-600" />
              <ManageTile href="/facilities"    icon={Factory}     label="Facilities"         description="Build & upgrade" colorClass="text-blue-600" />
              <ManageTile href="/research"      icon={FlaskConical} label="Research Lab"      description="Tech progression" colorClass="text-green-600" />
              <ManageTile href="/shipyard"      icon={Rocket}      label="Shipyard"           description="Build fleet" colorClass="text-blue-500" />
              <ManageTile href="/fleet"         icon={Ship}        label="Fleet Command"      description="Manage & dispatch" colorClass="text-indigo-600" />
              <ManageTile href="/army"          icon={Swords}      label="Army"               description="Ground forces" colorClass="text-red-600" />
              <ManageTile href="/colonies"      icon={Home}        label="Colonies"           description="Manage planets" colorClass="text-amber-600" />
              <ManageTile href="/empire-planets" icon={Globe}      label="Planet Overview"    description="OGame-style table" colorClass="text-teal-600" />
              <ManageTile href="/commander"     icon={Star}        label="Commander"          description="Skills & equipment" colorClass="text-yellow-600" />
              <ManageTile href="/government"    icon={Landmark}    label="Government"         description="Policies & laws" colorClass="text-purple-600" />
              <ManageTile href="/alliance"      icon={Shield}      label="Alliance"           description="Diplomacy" colorClass="text-sky-600" />
              <ManageTile href="/empire-progression" icon={Crown}  label="Kardashev Scale"    description="Civilisation tier" colorClass="text-amber-500" />
              <ManageTile href="/megastructures" icon={Orbit}      label="Megastructures"     description="Wonders of the galaxy" colorClass="text-rose-600" />
              <ManageTile href="/expeditions"   icon={Orbit}       label="Expeditions"        description="Explore & discover" colorClass="text-orange-500" />
              <ManageTile href="/combat"        icon={Swords}      label="Combat"             description="Engage enemies" colorClass="text-red-500" />
              <ManageTile href="/messages"      icon={MessageSquare} label="Messages"         description={`${unreadMessages} unread`} colorClass="text-slate-500" />
            </div>
          </CardContent>
        </Card>

      </div>
    </GameLayout>
  );
}
