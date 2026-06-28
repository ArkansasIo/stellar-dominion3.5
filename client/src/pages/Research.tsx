import GameLayout from "@/components/layout/GameLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGame } from "@/lib/gameContext";
import { TECHS, type TechArea, type TechItem } from "@/lib/techData";
import {
  TECHNOLOGY_DIVISIONS,
  TECHNOLOGY_DIVISION_COUNTS,
  getTechnologyDivisionSystemsByDivision,
  getTechnologyDivisionUpgradeSnapshot,
} from "@/lib/technologyDivisionCatalog";
import { getCurrentKardashevUpgradeLevel } from "@/lib/kardashevUpgradeCatalog";
import { cn } from "@/lib/utils";
import { BACKGROUND_ASSETS, MENU_ASSETS, OGAMEX_FEATURED_ASSETS } from "@shared/config";
import {
  ArrowUpCircle,
  Atom,
  Bot,
  Box,
  Clock,
  Cog,
  Cpu,
  Crosshair,
  Eye,
  Flame,
  FlaskConical,
  Gauge,
  Gem,
  Globe,
  Layers,
  Microscope,
  MoveRight,
  Network,
  Orbit,
  Rocket,
  Shield,
  Sparkles,
  Swords,
  Telescope,
  TrendingUp,
  Zap,
} from "lucide-react";

const DIVISION_ICON_MAP = {
  zap: Zap,
  crosshair: Crosshair,
  flask: FlaskConical,
  layers: Layers,
  flame: Flame,
  rocket: Rocket,
  gauge: Gauge,
  "move-right": MoveRight,
  eye: Eye,
  cpu: Cpu,
  telescope: Telescope,
  network: Network,
  orbit: Orbit,
  swords: Swords,
  shield: Shield,
  box: Box,
  bot: Bot,
  sparkles: Sparkles,
} as const;

function areaTone(area: TechArea) {
  if (area === "physics") return "border-blue-200 bg-blue-50 text-blue-700";
  if (area === "society") return "border-emerald-200 bg-emerald-50 text-emerald-700";
  return "border-orange-200 bg-orange-50 text-orange-700";
}

function ResearchCard({
  item,
  level,
  resources,
  onUpgrade,
}: {
  item: TechItem;
  level: number;
  resources: { metal: number; crystal: number; deuterium: number; energy: number };
  onUpgrade: (id: string, name: string, time: number) => void;
}) {
  const Icon = item.icon;
  const metalCost = Math.floor(item.baseCost.metal * Math.pow(item.costFactor, level));
  const crystalCost = Math.floor(item.baseCost.crystal * Math.pow(item.costFactor, level));
  const deuteriumCost = Math.floor(item.baseCost.deuterium * Math.pow(item.costFactor, level));
  const energyCost = item.baseCost.energy ? Math.floor(item.baseCost.energy * Math.pow(item.costFactor, level)) : 0;
  const buildTime = (level + 1) * 5000;

  const canAfford =
    resources.metal >= metalCost &&
    resources.crystal >= crystalCost &&
    resources.deuterium >= deuteriumCost &&
    (energyCost === 0 || resources.energy >= energyCost);

  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={cn("flex h-11 w-11 items-center justify-center rounded-full border", areaTone(item.area))}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base text-slate-900">{item.name}</CardTitle>
              <div className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">Level {level}</div>
            </div>
          </div>
          <Badge variant="outline" className={areaTone(item.area)}>
            {item.category.replace(/_/g, " ")}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-slate-600">{item.description}</p>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
          <div className="mb-2 text-xs uppercase tracking-widest text-slate-500">Research Effects</div>
          <div className="space-y-2">
            {item.effects.map((effect) => (
              <div key={`${item.id}-${effect.name}`} className="flex items-center justify-between text-sm">
                <span className="text-slate-700">{effect.name}</span>
                <span className="font-medium text-slate-900">
                  {effect.value}
                  {effect.perLevel ? ` (${effect.perLevel})` : ""}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm">
          <div className="mb-2 text-xs uppercase tracking-widest text-slate-500">Upgrade Costs</div>
          <div className="space-y-1">
            <div className="flex items-center justify-between"><span className="text-slate-600">Metal</span><span className={cn(resources.metal < metalCost && "font-bold text-red-600")}>{metalCost.toLocaleString()}</span></div>
            <div className="flex items-center justify-between"><span className="text-slate-600">Crystal</span><span className={cn(resources.crystal < crystalCost && "font-bold text-red-600")}>{crystalCost.toLocaleString()}</span></div>
            <div className="flex items-center justify-between"><span className="text-slate-600">Deuterium</span><span className={cn(resources.deuterium < deuteriumCost && "font-bold text-red-600")}>{deuteriumCost.toLocaleString()}</span></div>
            {energyCost > 0 && (
              <div className="flex items-center justify-between"><span className="text-slate-600">Energy</span><span className={cn(resources.energy < energyCost && "font-bold text-red-600")}>{energyCost.toLocaleString()}</span></div>
            )}
            <div className="flex items-center justify-between pt-1 text-xs text-slate-500"><span>Duration</span><span>{buildTime / 1000}s</span></div>
          </div>
        </div>

        <Button className="w-full font-orbitron tracking-wider" disabled={!canAfford} onClick={() => onUpgrade(item.id, item.name, buildTime)}>
          {canAfford ? (
            <>
              <ArrowUpCircle className="mr-2 h-4 w-4" /> {level === 0 ? "RESEARCH" : "IMPROVE"}
            </>
          ) : (
            "INSUFFICIENT RESOURCES"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

export default function Research() {
  const {
    research,
    resources,
    queue,
    updateResearch,
    kardashevSystems,
    technologyDivisionSystems,
    upgradeTechnologyDivisionSystem,
  } = useGame();

  const kardashevLevel = getCurrentKardashevUpgradeLevel(kardashevSystems);
  const researchQueue = queue.filter((item) => item.type === "research");
  const researchTotal = Object.values(research).reduce((sum, value) => sum + (value || 0), 0);
  const technologyDivisionLevelTotal = Object.values(technologyDivisionSystems).reduce((sum, value) => sum + (value || 0), 0);
  const activeDivisionSystems = Object.values(technologyDivisionSystems).filter((value) => (value || 0) > 0).length;

  const areas: Array<{ id: TechArea; label: string; icon: typeof Atom }> = [
    { id: "physics", label: "Physics", icon: Atom },
    { id: "society", label: "Society", icon: Microscope },
    { id: "engineering", label: "Engineering", icon: Cog },
  ];

  return (
    <GameLayout>
      <div className="space-y-6">
        <div className="relative rounded-xl overflow-hidden shadow-lg mb-2" style={{ minHeight: 140 }}>
          <img src={BACKGROUND_ASSETS.RESEARCH_LAB.path} alt="Research" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-blue-950/60 to-transparent" />
          <div className="relative z-10 p-6 flex items-center gap-6">
            <div className="flex gap-2 items-center">
              <img src={MENU_ASSETS.BUILDINGS.RESEARCH_LAB.path} alt="Research Lab" className="w-12 h-12 object-contain" />
              <img src={MENU_ASSETS.NAVIGATION.RESEARCH.path} alt="Research" className="w-12 h-12 object-contain" />
              <img src={OGAMEX_FEATURED_ASSETS.RESEARCH.path} alt="Featured Research" className="w-12 h-12 object-contain" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white drop-shadow">Technology Division</h2>
              <p className="text-blue-300 mt-1">Core research in Physics, Society, and Engineering — driving your empire's advancement.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <Card className="border-slate-200 bg-white">
            <CardContent className="pt-6">
              <div className="text-xs uppercase tracking-widest text-slate-500">Research Levels</div>
              <div className="mt-1 text-2xl font-bold text-blue-700">{researchTotal}</div>
            </CardContent>
          </Card>
          <Card className="border-slate-200 bg-white">
            <CardContent className="pt-6">
              <div className="text-xs uppercase tracking-widest text-slate-500">Division Systems</div>
              <div className="mt-1 text-2xl font-bold text-violet-700">{TECHNOLOGY_DIVISION_COUNTS.totalSystems}</div>
            </CardContent>
          </Card>
          <Card className="border-slate-200 bg-white">
            <CardContent className="pt-6">
              <div className="text-xs uppercase tracking-widest text-slate-500">Active Division Tracks</div>
              <div className="mt-1 text-2xl font-bold text-emerald-700">{activeDivisionSystems}</div>
            </CardContent>
          </Card>
          <Card className="border-slate-200 bg-white">
            <CardContent className="pt-6">
              <div className="text-xs uppercase tracking-widest text-slate-500">Kardashev Gate</div>
              <div className="mt-1 text-2xl font-bold text-amber-700">Level {kardashevLevel}</div>
            </CardContent>
          </Card>
        </div>

        {researchQueue.length > 0 && (
          <Card className="border-primary/20 bg-white shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm uppercase tracking-widest text-primary">Active Research</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {researchQueue.map((item) => {
                const timeLeft = Math.max(0, Math.floor((item.endTime - Date.now()) / 1000));
                return (
                  <div key={item.id} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <div className="flex items-center justify-between text-sm font-medium text-slate-900">
                      <span>{item.name}</span>
                      <span className="font-mono text-slate-500">{timeLeft}s</span>
                    </div>
                    <Progress value={Math.max(0, 100 - (timeLeft / 5) * 100)} className="mt-2 h-1.5" />
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="core-research" className="w-full">
          <TabsList className="flex h-auto w-full flex-wrap justify-start gap-2 border border-slate-200 bg-slate-50 p-2">
            <TabsTrigger value="core-research" className="font-orbitron data-[state=active]:bg-white">Core Research</TabsTrigger>
            <TabsTrigger value="division-matrix" className="font-orbitron data-[state=active]:bg-white">
              Division Matrix {TECHNOLOGY_DIVISION_COUNTS.divisions} x {TECHNOLOGY_DIVISION_COUNTS.systemsPerDivision}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="core-research" className="mt-6 space-y-6">
            <Tabs defaultValue="physics" className="w-full">
              <TabsList className="grid h-14 w-full grid-cols-3 border border-slate-200 bg-white p-1">
                {areas.map((area) => {
                  const Icon = area.icon;
                  return (
                    <TabsTrigger key={area.id} value={area.id} className="flex h-full gap-2 font-orbitron data-[state=active]:bg-slate-50">
                      <Icon className="h-5 w-5" /> {area.label}
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              {areas.map((area) => (
                <TabsContent key={area.id} value={area.id} className="mt-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {TECHS.filter((item) => item.area === area.id).map((item) => (
                      <ResearchCard
                        key={item.id}
                        item={item}
                        level={research[item.id] || 0}
                        resources={resources}
                        onUpgrade={updateResearch}
                      />
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </TabsContent>

          <TabsContent value="division-matrix" className="mt-6 space-y-6">
            <Card className="border-slate-200 bg-slate-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Technology Division Matrix</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-4 text-sm">
                <div className="rounded-lg border border-slate-200 bg-white p-4">
                  <div className="text-xs uppercase tracking-widest text-slate-500">Divisions</div>
                  <div className="mt-1 text-2xl font-bold text-slate-900">{TECHNOLOGY_DIVISION_COUNTS.divisions}</div>
                </div>
                <div className="rounded-lg border border-slate-200 bg-white p-4">
                  <div className="text-xs uppercase tracking-widest text-slate-500">Systems Per Division</div>
                  <div className="mt-1 text-2xl font-bold text-slate-900">{TECHNOLOGY_DIVISION_COUNTS.systemsPerDivision}</div>
                </div>
                <div className="rounded-lg border border-slate-200 bg-white p-4">
                  <div className="text-xs uppercase tracking-widest text-slate-500">Total Division Levels</div>
                  <div className="mt-1 text-2xl font-bold text-violet-700">{technologyDivisionLevelTotal}</div>
                </div>
                <div className="rounded-lg border border-slate-200 bg-white p-4">
                  <div className="text-xs uppercase tracking-widest text-slate-500">Tree Link</div>
                  <div className="mt-1 text-sm font-medium text-slate-700">Each division uses a core tech as its anchor unlock.</div>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue={TECHNOLOGY_DIVISIONS[0]?.id || "energy-systems"} className="w-full">
              <TabsList className="flex h-auto w-full flex-wrap justify-start gap-2 border border-slate-200 bg-white p-2">
                {TECHNOLOGY_DIVISIONS.map((division) => {
                  const Icon = DIVISION_ICON_MAP[division.icon as keyof typeof DIVISION_ICON_MAP] || Cpu;
                  return (
                    <TabsTrigger key={division.id} value={division.id} className="data-[state=active]:bg-slate-50">
                      <Icon className="mr-2 h-4 w-4" /> {division.name}
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              {TECHNOLOGY_DIVISIONS.map((division) => {
                const Icon = DIVISION_ICON_MAP[division.icon as keyof typeof DIVISION_ICON_MAP] || Cpu;
                const anchorLevel = research[division.anchorTechId] || 0;
                const divisionSystems = getTechnologyDivisionSystemsByDivision(division.id).map((system) => {
                  const level = technologyDivisionSystems[system.id] || 0;
                  const snapshot = getTechnologyDivisionUpgradeSnapshot(system, division.order, level);
                  const completedInDivision = getTechnologyDivisionSystemsByDivision(division.id).filter((entry) => (technologyDivisionSystems[entry.id] || 0) > 0).length;
                  const unlocked =
                    anchorLevel >= system.requirements.anchorResearchLevel &&
                    kardashevLevel >= system.requirements.kardashevLevel &&
                    completedInDivision >= system.requirements.priorSystems;
                  const canAfford =
                    resources.metal >= snapshot.cost.metal &&
                    resources.crystal >= snapshot.cost.crystal &&
                    resources.deuterium >= snapshot.cost.deuterium;

                  return {
                    ...system,
                    level,
                    snapshot,
                    unlocked,
                    canAfford,
                    maxed: level >= snapshot.maxLevel,
                  };
                });

                const divisionCompleted = divisionSystems.filter((system) => system.level > 0).length;

                return (
                  <TabsContent key={division.id} value={division.id} className="mt-6 space-y-4">
                    <Card className="border-slate-200 bg-slate-50">
                      <CardContent className="p-5">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                          <div className="flex items-center gap-4">
                            <div className={cn("flex h-14 w-14 items-center justify-center rounded-full border", areaTone(division.area))}>
                              <Icon className="h-6 w-6" />
                            </div>
                            <div>
                              <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Division {division.order}</div>
                              <div className="mt-1 text-2xl font-bold text-slate-900">{division.name}</div>
                              <div className="mt-1 text-sm text-slate-600">{division.summary}</div>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 gap-3 text-sm md:grid-cols-3">
                            <div className="rounded-lg border border-slate-200 bg-white p-3">
                              <div className="text-xs uppercase tracking-widest text-slate-500">Anchor Tech</div>
                              <div className="mt-1 font-semibold text-slate-900">{division.anchorTechLabel} L{anchorLevel}</div>
                            </div>
                            <div className="rounded-lg border border-slate-200 bg-white p-3">
                              <div className="text-xs uppercase tracking-widest text-slate-500">Completed Systems</div>
                              <div className="mt-1 font-semibold text-slate-900">{divisionCompleted} / {TECHNOLOGY_DIVISION_COUNTS.systemsPerDivision}</div>
                            </div>
                            <div className="rounded-lg border border-slate-200 bg-white p-3">
                              <div className="text-xs uppercase tracking-widest text-slate-500">Specialty</div>
                              <div className="mt-1 font-semibold text-slate-900">{division.specialty}</div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                      {divisionSystems.map((system) => (
                        <Card key={system.id} className={cn("border-slate-200 bg-white shadow-sm", !system.unlocked && "opacity-80")} data-testid={`card-division-${system.id}`}>
                          <CardHeader className="pb-2">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <CardTitle className="text-base text-slate-900">{system.name}</CardTitle>
                                <div className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">
                                  Node {system.sequence} • Level {system.level}
                                </div>
                              </div>
                              <Badge variant="outline" className={areaTone(division.area)}>
                                {system.phase}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <p className="text-sm text-slate-600">{system.description}</p>

                            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                              <div className="text-xs uppercase tracking-widest text-slate-500">Specialty Effect</div>
                              <div className="mt-1 text-sm font-medium text-slate-900">{system.effect}</div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                                <div className="text-xs uppercase tracking-widest text-slate-500">Current Bonus</div>
                                <div className="mt-1 text-lg font-bold text-emerald-700">+{system.snapshot.currentBonus}%</div>
                              </div>
                              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                                <div className="text-xs uppercase tracking-widest text-slate-500">Next Level</div>
                                <div className="mt-1 text-lg font-bold text-blue-700">+{system.snapshot.nextBonus}%</div>
                              </div>
                            </div>

                            <div className="rounded-lg border border-dashed border-slate-200 bg-white p-3 text-sm">
                              <div className="mb-2 text-xs uppercase tracking-widest text-slate-500">Unlock Requirements</div>
                              <div className="space-y-1 text-slate-700">
                                <div>{division.anchorTechLabel}: {anchorLevel} / {system.requirements.anchorResearchLevel}</div>
                                <div>Kardashev Level: {kardashevLevel} / {system.requirements.kardashevLevel}</div>
                                <div>Prior Systems: {divisionCompleted} / {system.requirements.priorSystems}</div>
                              </div>
                            </div>

                            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm">
                              <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-widest text-slate-500">
                                <TrendingUp className="h-3.5 w-3.5 text-primary" /> Upgrade Costs
                              </div>
                              <div className="space-y-1">
                                <div className="flex items-center justify-between"><span className="text-slate-600">Metal</span><span className={cn(resources.metal < system.snapshot.cost.metal && "font-bold text-red-600")}>{system.snapshot.cost.metal.toLocaleString()}</span></div>
                                <div className="flex items-center justify-between"><span className="text-slate-600">Crystal</span><span className={cn(resources.crystal < system.snapshot.cost.crystal && "font-bold text-red-600")}>{system.snapshot.cost.crystal.toLocaleString()}</span></div>
                                <div className="flex items-center justify-between"><span className="text-slate-600">Deuterium</span><span className={cn(resources.deuterium < system.snapshot.cost.deuterium && "font-bold text-red-600")}>{system.snapshot.cost.deuterium.toLocaleString()}</span></div>
                                <div className="flex items-center justify-between pt-1 text-xs text-slate-500"><span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Upgrade Time</span><span>{system.snapshot.buildTimeSeconds}s</span></div>
                              </div>
                            </div>

                            <Button
                              className="w-full font-orbitron tracking-wider"
                              disabled={!system.unlocked || !system.canAfford || system.maxed}
                              onClick={() =>
                                upgradeTechnologyDivisionSystem(
                                  system.id,
                                  system.name,
                                  system.snapshot.cost,
                                  system.snapshot.buildTimeSeconds * 1000,
                                )
                              }
                            >
                              {system.maxed ? "MAX LEVEL" : !system.unlocked ? "REQUIREMENTS NOT MET" : system.canAfford ? `UPGRADE TO LEVEL ${system.level + 1}` : "INSUFFICIENT RESOURCES"}
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                );
              })}
            </Tabs>
          </TabsContent>
        </Tabs>
      </div>
    </GameLayout>
  );
}
