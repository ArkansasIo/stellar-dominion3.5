import { BACKGROUND_ASSETS, SHIP_ASSETS, MENU_ASSETS, OGAMEX_FEATURED_ASSETS } from "@shared/config";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import GameLayout from "@/components/layout/GameLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useGame } from "@/lib/gameContext";
import {
  KARDASHEV_UPGRADE_SYSTEMS,
  getCurrentKardashevUpgradeLevel,
  getKardashevUpgradeSnapshot,
} from "@/lib/kardashevUpgradeCatalog";
import { KARDASHEV_SCALE, type KardashevLevel } from "@/lib/kardashevScale";
import {
  countOwnedPlanets,
  getKardashevOperationalBonuses,
} from "@shared/config/kardashevOperationalBonuses";
import { Crown, Factory, FlaskConical, Orbit, Rocket, Star, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

const TEMP_THEME_IMAGE = "/theme-temp.png";

type PlayerTelemetryState = {
  knownPlanets?: unknown;
  planetName?: string;
  kardashevSystems?: Record<string, number>;
};

function formatLargeNumber(num: number): string {
  if (num >= 1e12) return `${(num / 1e12).toFixed(1)}T`;
  if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
  return num.toString();
}

export default function EmpireProgression() {
  const {
    resources,
    research,
    kardashevSystems,
    infrastructureSystems,
    megastructureSystems,
    technologyDivisionSystems,
    megastructures,
    upgradeKardashevSystem,
  } = useGame();

  const { data: serverState } = useQuery<PlayerTelemetryState>({
    queryKey: ["/api/player/state"],
    queryFn: async () => (await apiRequest("GET", "/api/player/state")).json(),
  });

  const researchTotal = Object.values(research).reduce((sum, value) => sum + (value || 0), 0);
  const infrastructureTotal = Object.values(infrastructureSystems).reduce((sum, value) => sum + (value || 0), 0);
  const technologyDivisionTotal = Object.values(technologyDivisionSystems).reduce((sum, value) => sum + (value || 0), 0);
  const megastructureTotal = megastructures.length + Object.values(megastructureSystems).reduce((sum, value) => sum + (value || 0), 0);

  const currentLevel = getCurrentKardashevUpgradeLevel(kardashevSystems);
  const nextLevel = Math.min(18, currentLevel + 1) as KardashevLevel;
  const currentTier = KARDASHEV_SCALE[currentLevel];
  const operationalBonuses = getKardashevOperationalBonuses(kardashevSystems);
  const ownedPlanets = countOwnedPlanets(
    serverState?.knownPlanets,
    undefined,
    serverState?.planetName,
  );
  const nextTier = currentLevel < 18 ? KARDASHEV_SCALE[nextLevel] : null;
  const nextSystem = KARDASHEV_UPGRADE_SYSTEMS.find((system) => system.level === nextLevel);

  const nextRequirements = nextSystem?.requirements;
  const readinessChecks = nextRequirements
    ? [
        nextRequirements.totalResearch <= researchTotal,
        nextRequirements.totalInfrastructure <= infrastructureTotal,
        nextRequirements.totalTechnologyDivisions <= technologyDivisionTotal,
        nextRequirements.totalMegastructures <= megastructureTotal,
      ]
    : [true, true, true, true];
  const readiness = Math.round((readinessChecks.filter(Boolean).length / readinessChecks.length) * 100);

  return (
    <GameLayout>
      <div className="space-y-6">
        <section className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm bg-cover bg-center" style={{ backgroundImage: `linear-gradient(rgba(15,23,42,0.78), rgba(15,23,42,0.92)), url(${BACKGROUND_ASSETS.STAR_FIELD.path})` }}>
          <div className="p-5 lg:p-6 space-y-4 text-white">
            <div className="flex items-center gap-2">
              <img src={MENU_ASSETS.NAVIGATION.EMPIRE.path} alt="Icon" className="w-8 h-8 rounded-lg border border-white/10 bg-white/10 p-1.5 object-contain" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = TEMP_THEME_IMAGE; }} />
              <h1 className="text-2xl font-bold" data-testid="text-kardashev-title">Kardashev Scale</h1>
            </div>
            <p className="text-sm leading-6 text-slate-300">Empire progression from planetary settler to supreme omnipotent.</p>
            <div className="flex flex-wrap gap-3">
              {[{ label: "Ascension Path", image: SHIP_ASSETS.CAPITALS.BATTLECRUISER.path }, { label: "Progression Track", image: MENU_ASSETS.BUILDINGS.SHIPYARD.path }, { label: "Empire Tier", image: OGAMEX_FEATURED_ASSETS.BACKGROUND.path }].map((item) => (
                <div key={item.label} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                  <img src={item.image} alt={item.label} className="w-10 h-10 rounded-lg border border-white/10 bg-black/10 p-1.5 object-contain" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = TEMP_THEME_IMAGE; }} />
                  <div className="text-sm font-semibold">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

          <Card className="border-blue-800/60 bg-gradient-to-r from-slate-950 via-blue-950/90 to-slate-950 text-blue-50 shadow-lg shadow-blue-950/20">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-blue-300">Current Level</p>
                <h2 className="mt-2 text-3xl font-bold text-white">{currentTier.name}</h2>
                <p className="mt-2 max-w-2xl text-blue-200/75">{currentTier.description}</p>
              </div>
              <div className="text-right">
                <Badge className="bg-amber-500 px-4 py-2 text-xl text-white">Level {currentLevel}</Badge>
                <p className="mt-3 text-xs uppercase tracking-[0.18em] text-blue-300">{18 - currentLevel} tiers remaining</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <section className="overflow-hidden rounded-2xl border border-cyan-800/60 bg-gradient-to-br from-slate-950 via-blue-950/90 to-slate-950 p-5 text-blue-50 shadow-lg shadow-blue-950/20" data-testid="kardashev-active-bonuses">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">Live Operations Telemetry</div>
              <h2 className="mt-2 text-xl font-orbitron font-bold text-white">Tier {operationalBonuses.level} effects are active</h2>
              <p className="mt-1 text-sm text-blue-200/75">These modifiers are applied server-side to battle resolution and interstellar colonization.</p>
            </div>
            <Badge className="border border-cyan-400/40 bg-cyan-400/10 text-cyan-100">{operationalBonuses.tierName}</Badge>
          </div>
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-blue-800/60 bg-blue-900/35 p-4">
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-300">Fleet Power</div>
              <div className="mt-2 flex items-baseline gap-2 text-2xl font-orbitron font-bold text-white"><span>+{operationalBonuses.fleetPowerPercent}%</span><span className="text-sm font-normal text-cyan-200">×{operationalBonuses.fleetPowerMultiplier.toFixed(2)}</span></div>
              <div className="mt-1 text-xs text-blue-200/70">Battle attack stats multiplier</div>
            </div>
            <div className="rounded-xl border border-blue-800/60 bg-blue-900/35 p-4">
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-300">Defense Power</div>
              <div className="mt-2 flex items-baseline gap-2 text-2xl font-orbitron font-bold text-white"><span>+{operationalBonuses.defensePowerPercent}%</span><span className="text-sm font-normal text-cyan-200">×{operationalBonuses.defensePowerMultiplier.toFixed(2)}</span></div>
              <div className="mt-1 text-xs text-blue-200/70">Garrison and counter-fire multiplier</div>
            </div>
            <div className="rounded-xl border border-blue-800/60 bg-blue-900/35 p-4">
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-300">Colony Capacity</div>
              <div className="mt-2 text-2xl font-orbitron font-bold text-white">{ownedPlanets} / {operationalBonuses.maxPlanets}</div>
              <div className="mt-1 text-xs text-blue-200/70">Owned planets before next expansion</div>
            </div>
            <div className="rounded-xl border border-blue-800/60 bg-blue-900/35 p-4">
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-300">Fleet Command Ceiling</div>
              <div className="mt-2 text-2xl font-orbitron font-bold text-white">{operationalBonuses.maxFleets}</div>
              <div className="mt-1 text-xs text-blue-200/70">Strategic fleet formations available</div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <Card className="border-slate-200 bg-white">
            <CardContent className="pt-6">
              <div className="text-xs uppercase tracking-widest text-slate-500">Research Total</div>
              <div className="mt-1 text-2xl font-bold text-blue-700">{researchTotal}</div>
            </CardContent>
          </Card>
          <Card className="border-slate-200 bg-white">
            <CardContent className="pt-6">
              <div className="text-xs uppercase tracking-widest text-slate-500">Infrastructure Levels</div>
              <div className="mt-1 text-2xl font-bold text-orange-700">{infrastructureTotal}</div>
            </CardContent>
          </Card>
          <Card className="border-slate-200 bg-white">
            <CardContent className="pt-6">
              <div className="text-xs uppercase tracking-widest text-slate-500">Tech Division Levels</div>
              <div className="mt-1 text-2xl font-bold text-violet-700">{technologyDivisionTotal}</div>
            </CardContent>
          </Card>
          <Card className="border-slate-200 bg-white">
            <CardContent className="pt-6">
              <div className="text-xs uppercase tracking-widest text-slate-500">Next Tier Readiness</div>
              <div className="mt-1 text-2xl font-bold text-emerald-700">{nextTier ? `${readiness}%` : "Complete"}</div>
            </CardContent>
          </Card>
        </div>

        <section className="overflow-hidden rounded-2xl border border-blue-800/60 bg-gradient-to-br from-slate-950 via-blue-950/90 to-slate-950 p-5 text-blue-50 shadow-lg shadow-blue-950/20" data-testid="kardashev-control-matrix">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-cyan-300"><TrendingUp className="h-4 w-4" /> Ascension Control Matrix</div>
              <h2 className="mt-2 text-2xl font-orbitron font-bold text-white">Build the civilization, unlock the tier</h2>
              <p className="mt-1 max-w-3xl text-sm leading-6 text-blue-200/75">The Kardashev loop converts research knowledge and industrial infrastructure into megastructure mastery, then turns each unlocked tier into stronger production, science, fleet, and expansion capacity.</p>
            </div>
            <Badge className="border border-blue-400/40 bg-blue-400/10 text-blue-100">{readiness}% next-tier readiness</Badge>
          </div>
          <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-4">
            <div className="rounded-xl border border-blue-800/60 bg-blue-900/35 p-4"><div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-300"><FlaskConical className="h-3.5 w-3.5" /> Discover</div><div className="mt-2 text-xl font-orbitron font-bold text-white">{researchTotal}</div><div className="mt-1 text-xs text-blue-200/70">Research levels fund new unlocks.</div></div>
            <div className="rounded-xl border border-blue-800/60 bg-blue-900/35 p-4"><div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-300"><Factory className="h-3.5 w-3.5" /> Industrialize</div><div className="mt-2 text-xl font-orbitron font-bold text-white">{infrastructureTotal}</div><div className="mt-1 text-xs text-blue-200/70">Infrastructure creates build capacity.</div></div>
            <div className="rounded-xl border border-blue-800/60 bg-blue-900/35 p-4"><div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-300"><Orbit className="h-3.5 w-3.5" /> Ascend</div><div className="mt-2 text-xl font-orbitron font-bold text-white">{megastructureTotal}</div><div className="mt-1 text-xs text-blue-200/70">Megastructures prove civilization scale.</div></div>
            <div className="rounded-xl border border-blue-800/60 bg-blue-900/35 p-4"><div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-300"><Rocket className="h-3.5 w-3.5" /> Apply</div><div className="mt-2 text-xl font-orbitron font-bold text-white">{technologyDivisionTotal}</div><div className="mt-1 text-xs text-blue-200/70">Technology divisions convert unlocks into capability.</div></div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2 border-t border-blue-800/50 pt-4">
            <Link href="/research"><Button size="sm" className="bg-blue-600 text-white hover:bg-blue-500">Open Research</Button></Link>
            <Link href="/facilities"><Button size="sm" variant="outline" className="border-blue-500/50 text-blue-100 hover:bg-blue-900/50">Expand Infrastructure</Button></Link>
            <Link href="/megastructures"><Button size="sm" variant="outline" className="border-blue-500/50 text-blue-100 hover:bg-blue-900/50">Master Megastructures</Button></Link>
            <Link href="/technology-tree"><Button size="sm" variant="outline" className="border-blue-500/50 text-blue-100 hover:bg-blue-900/50">Plan Technology</Button></Link>
          </div>
        </section>

        {nextTier && nextSystem && (
          <Card className="border-blue-200 bg-blue-50/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-slate-900">Next Ascension Objective</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="text-xs uppercase tracking-[0.18em] text-blue-600">Target Tier</div>
                  <div className="mt-1 text-2xl font-bold text-slate-900">{nextTier.name}</div>
                  <div className="mt-1 text-sm text-slate-600">{nextSystem.focus}</div>
                </div>
                <div className="min-w-[220px]">
                  <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
                    <span>Ascension Readiness</span>
                    <span>{readiness}%</span>
                  </div>
                  <Progress value={readiness} className="h-2" />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-4 text-sm">
                <div className="rounded-lg border border-slate-200 bg-white p-3">
                  <div className="text-xs uppercase tracking-widest text-slate-500">Required Research</div>
                  <div className="mt-1 font-semibold text-slate-900">{nextSystem.requirements.totalResearch}</div>
                </div>
                <div className="rounded-lg border border-slate-200 bg-white p-3">
                  <div className="text-xs uppercase tracking-widest text-slate-500">Infrastructure</div>
                  <div className="mt-1 font-semibold text-slate-900">{nextSystem.requirements.totalInfrastructure}</div>
                </div>
                <div className="rounded-lg border border-slate-200 bg-white p-3">
                  <div className="text-xs uppercase tracking-widest text-slate-500">Tech Divisions</div>
                  <div className="mt-1 font-semibold text-slate-900">{nextSystem.requirements.totalTechnologyDivisions}</div>
                </div>
                <div className="rounded-lg border border-slate-200 bg-white p-3">
                  <div className="text-xs uppercase tracking-widest text-slate-500">Megastructure Mastery</div>
                  <div className="mt-1 font-semibold text-slate-900">{nextSystem.requirements.totalMegastructures}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {KARDASHEV_UPGRADE_SYSTEMS.map((system) => {
            const tier = KARDASHEV_SCALE[system.level];
            const completed = system.level === 1 || (kardashevSystems[system.id] || 0) > 0;
            const snapshot = getKardashevUpgradeSnapshot(system, kardashevSystems[system.id] || 0);
            const previousUnlocked = !system.requirements.previousLevel || currentLevel >= system.requirements.previousLevel;
            const requirementsMet =
              researchTotal >= system.requirements.totalResearch &&
              infrastructureTotal >= system.requirements.totalInfrastructure &&
              technologyDivisionTotal >= system.requirements.totalTechnologyDivisions &&
              megastructureTotal >= system.requirements.totalMegastructures;
            const canAfford =
              resources.metal >= snapshot.cost.metal &&
              resources.crystal >= snapshot.cost.crystal &&
              resources.deuterium >= snapshot.cost.deuterium;
            const isCurrent = currentLevel === system.level;
            const isNext = currentLevel + 1 === system.level;

            return (
              <Card
                key={system.id}
                className={cn(
                  "border-2 bg-white shadow-sm",
                  completed ? "border-emerald-200" : isNext ? "border-blue-200" : "border-slate-200",
                  isCurrent && "ring-2 ring-amber-200 ring-offset-2",
                )}
                data-testid={`card-kardashev-${system.level}`}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Level {system.level}</div>
                      <CardTitle className="mt-1 text-lg text-slate-900">{tier.name}</CardTitle>
                    </div>
                    <Badge className={cn(completed ? "bg-emerald-100 text-emerald-800" : isNext ? "bg-blue-100 text-blue-800" : "bg-slate-100 text-slate-700")}>
                      {completed ? "Established" : isNext ? "Next" : "Locked"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-slate-600">{tier.description}</p>

                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <div className="text-xs uppercase tracking-widest text-slate-500">Ascension Focus</div>
                    <div className="mt-1 font-semibold text-slate-900">{system.focus}</div>
                    <div className="mt-2 text-xs text-slate-600">{system.doctrine}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                      <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-slate-500">
                        <Factory className="h-3.5 w-3.5 text-orange-500" /> Production
                      </div>
                      <div className="mt-1 text-lg font-bold text-orange-700">+{tier.bonuses.resourceProduction}%</div>
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                      <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-slate-500">
                        <FlaskConical className="h-3.5 w-3.5 text-violet-500" /> Research
                      </div>
                      <div className="mt-1 text-lg font-bold text-violet-700">+{tier.bonuses.researchSpeed}%</div>
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                      <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-slate-500">
                        <Rocket className="h-3.5 w-3.5 text-red-500" /> Fleet
                      </div>
                      <div className="mt-1 text-lg font-bold text-red-700">+{tier.bonuses.fleetPower}%</div>
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                      <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-slate-500">
                        <Orbit className="h-3.5 w-3.5 text-sky-500" /> Expansion
                      </div>
                      <div className="mt-1 text-lg font-bold text-sky-700">{tier.bonuses.maxPlanets}</div>
                    </div>
                  </div>

                  <div className="rounded-lg border border-dashed border-slate-200 bg-white p-3 text-sm">
                    <div className="mb-2 text-xs uppercase tracking-widest text-slate-500">Unlock Requirements</div>
                    <div className="space-y-1 text-slate-700">
                      <div>Research Total: {researchTotal} / {system.requirements.totalResearch}</div>
                      <div>Infrastructure Levels: {infrastructureTotal} / {system.requirements.totalInfrastructure}</div>
                      <div>Tech Division Levels: {technologyDivisionTotal} / {system.requirements.totalTechnologyDivisions}</div>
                      <div>Megastructure Mastery: {megastructureTotal} / {system.requirements.totalMegastructures}</div>
                    </div>
                  </div>

                  {system.level > 1 && (
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm">
                      <div className="mb-2 text-xs uppercase tracking-widest text-slate-500">Ascension Cost</div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600">Metal</span>
                          <span className={cn(resources.metal < snapshot.cost.metal && "font-bold text-red-600")}>{formatLargeNumber(snapshot.cost.metal)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600">Crystal</span>
                          <span className={cn(resources.crystal < snapshot.cost.crystal && "font-bold text-red-600")}>{formatLargeNumber(snapshot.cost.crystal)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600">Deuterium</span>
                          <span className={cn(resources.deuterium < snapshot.cost.deuterium && "font-bold text-red-600")}>{formatLargeNumber(snapshot.cost.deuterium)}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {tier.unlocks.length > 0 && (
                    <div>
                      <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-widest text-slate-500">
                        <Star className="h-3.5 w-3.5 text-amber-500" /> Unlocks
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {tier.unlocks.map((unlock) => (
                          <Badge key={unlock} variant="outline" className="bg-amber-50 text-amber-800">
                            {unlock}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <Button
                    className="w-full font-orbitron tracking-wider"
                    disabled={system.level === 1 || completed || !previousUnlocked || !requirementsMet || !canAfford}
                    onClick={() => upgradeKardashevSystem(system.id, tier.name, snapshot.cost, snapshot.buildTimeSeconds * 1000)}
                  >
                    {system.level === 1
                      ? "FOUNDATIONAL TIER"
                      : completed
                        ? "ASCENSION COMPLETE"
                        : !previousUnlocked
                          ? "PREVIOUS TIER REQUIRED"
                          : !requirementsMet
                            ? "REQUIREMENTS NOT MET"
                            : canAfford
                              ? `ASCEND TO LEVEL ${system.level}`
                              : "INSUFFICIENT RESOURCES"}
                  </Button>

                  {isCurrent && (
                    <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
                      <div className="flex items-center gap-2 font-semibold">
                        <TrendingUp className="h-4 w-4" /> Current empire tier active
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="border-slate-200 bg-slate-50">
          <CardHeader>
            <CardTitle>Progression Doctrine</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-3 text-sm text-slate-700 md:grid-cols-3">
            <div className="rounded-lg border border-slate-200 bg-white p-4">Early tiers now depend on research volume and infrastructure maturity, not just static resources.</div>
            <div className="rounded-lg border border-slate-200 bg-white p-4">Mid-tier ascension pulls in Technology Division mastery so the research hub and tech tree feed empire scale directly.</div>
            <div className="rounded-lg border border-slate-200 bg-white p-4">Late tiers require megastructure mastery, turning galaxy-scale construction into the gateway to omnipotent progression.</div>
          </CardContent>
        </Card>
      </div>
    </GameLayout>
  );
}
