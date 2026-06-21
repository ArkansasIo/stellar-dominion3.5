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
import { Crown, Factory, FlaskConical, Orbit, Rocket, Star, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

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

  const researchTotal = Object.values(research).reduce((sum, value) => sum + (value || 0), 0);
  const infrastructureTotal = Object.values(infrastructureSystems).reduce((sum, value) => sum + (value || 0), 0);
  const technologyDivisionTotal = Object.values(technologyDivisionSystems).reduce((sum, value) => sum + (value || 0), 0);
  const megastructureTotal = megastructures.length + Object.values(megastructureSystems).reduce((sum, value) => sum + (value || 0), 0);

  const currentLevel = getCurrentKardashevUpgradeLevel(kardashevSystems);
  const nextLevel = Math.min(18, currentLevel + 1) as KardashevLevel;
  const currentTier = KARDASHEV_SCALE[currentLevel];
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
        <div>
          <h1 className="flex items-center gap-3 text-4xl font-bold text-slate-900" data-testid="text-kardashev-title">
            <Crown className="h-10 w-10 text-amber-500" />
            Kardashev Scale
          </h1>
          <p className="mt-2 text-slate-600">Empire progression from planetary settler to supreme omnipotent.</p>
        </div>

        <Card className="border-amber-200 bg-gradient-to-r from-amber-50 via-white to-orange-50">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Current Level</p>
                <h2 className="mt-2 text-3xl font-bold text-slate-900">{currentTier.name}</h2>
                <p className="mt-2 max-w-2xl text-slate-600">{currentTier.description}</p>
              </div>
              <div className="text-right">
                <Badge className="bg-amber-500 px-4 py-2 text-xl text-white">Level {currentLevel}</Badge>
                <p className="mt-3 text-xs uppercase tracking-[0.18em] text-slate-500">{18 - currentLevel} tiers remaining</p>
              </div>
            </div>
          </CardContent>
        </Card>

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
