import GameLayout from "@/components/layout/GameLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MEGA_STRUCTURES,
  MEGA_STRUCTURE_CATEGORIES,
  calculateConstructionCost,
  getMegaStructuresByCategory,
} from "@/lib/megaStructures";
import { useGame } from "@/lib/gameContext";
import {
  MEGASTRUCTURE_CATEGORY_SYSTEMS,
  getMegastructureUpgradeSnapshot,
} from "@/lib/megastructureExpansionCatalog";
import { getCurrentKardashevUpgradeLevel } from "@/lib/kardashevUpgradeCatalog";
import { cn } from "@/lib/utils";
import {
  Clock3,
  Coins,
  Compass,
  Crosshair,
  Factory,
  FlaskConical,
  Globe,
  Handshake,
  Hexagon,
  Leaf,
  Network,
  Orbit,
  Radio,
  Rocket,
  ScanSearch,
  Shield,
  Sparkles,
  Sprout,
  TrendingUp,
  Users,
} from "lucide-react";

const CATEGORY_ICON_MAP = {
  network: Network,
  factory: Factory,
  flask: FlaskConical,
  shield: Shield,
  rocket: Rocket,
  sparkles: Sparkles,
  crosshair: Crosshair,
  users: Users,
  coins: Coins,
  handshake: Handshake,
  compass: Compass,
  globe: Globe,
  radio: Radio,
  "scan-search": ScanSearch,
  leaf: Leaf,
  sprout: Sprout,
  "clock-3": Clock3,
  hexagon: Hexagon,
} as const;

export default function MegaStructures() {
  const {
    constructMegastructure,
    megastructureSystems,
    technologyDivisionSystems,
    kardashevSystems,
    research,
    resources,
    upgradeMegastructureSystem,
  } = useGame();

  const researchTotal = Object.values(research).reduce((sum, value) => sum + (value || 0), 0);
  const technologyDivisionTotal = Object.values(technologyDivisionSystems).reduce((sum, value) => sum + (value || 0), 0);
  const kardashevLevel = getCurrentKardashevUpgradeLevel(kardashevSystems);

  const categoryStates = MEGASTRUCTURE_CATEGORY_SYSTEMS.map((system) => {
    const level = megastructureSystems[system.id] || 0;
    const snapshot = getMegastructureUpgradeSnapshot(system, level);
    const structureCount = getMegaStructuresByCategory(system.category).length;
    const unlocked =
      kardashevLevel >= system.requirements.kardashevLevel &&
      researchTotal >= system.requirements.totalResearch &&
      technologyDivisionTotal >= system.requirements.totalTechnologyDivisions;
    const canAfford =
      resources.metal >= snapshot.cost.metal &&
      resources.crystal >= snapshot.cost.crystal &&
      resources.deuterium >= snapshot.cost.deuterium;

    return {
      ...system,
      level,
      snapshot,
      structureCount,
      unlocked,
      canAfford,
      maxed: level >= snapshot.maxLevel,
    };
  });

  const activeCategories = categoryStates.filter((system) => system.level > 0).length;
  const totalCategoryLevels = categoryStates.reduce((sum, system) => sum + system.level, 0);
  const constructableCategories = MEGA_STRUCTURE_CATEGORIES;

  return (
    <GameLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">Megastructures</h1>
          <p className="mt-2 text-slate-600">All 18 megastructure categories now have their own upgrade systems, layered on top of the existing cosmic build projects.</p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <Card className="border-slate-200 bg-white">
            <CardContent className="pt-6">
              <div className="text-xs uppercase tracking-widest text-slate-500">Category Systems</div>
              <div className="mt-1 text-2xl font-bold text-slate-900">{categoryStates.length}</div>
            </CardContent>
          </Card>
          <Card className="border-slate-200 bg-white">
            <CardContent className="pt-6">
              <div className="text-xs uppercase tracking-widest text-slate-500">Active Categories</div>
              <div className="mt-1 text-2xl font-bold text-emerald-700">{activeCategories}</div>
            </CardContent>
          </Card>
          <Card className="border-slate-200 bg-white">
            <CardContent className="pt-6">
              <div className="text-xs uppercase tracking-widest text-slate-500">Total Category Levels</div>
              <div className="mt-1 text-2xl font-bold text-violet-700">{totalCategoryLevels}</div>
            </CardContent>
          </Card>
          <Card className="border-slate-200 bg-white">
            <CardContent className="pt-6">
              <div className="text-xs uppercase tracking-widest text-slate-500">Kardashev Gate</div>
              <div className="mt-1 text-2xl font-bold text-amber-700">Level {kardashevLevel}</div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-slate-200 bg-slate-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">18 Category Upgrade Matrix</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {categoryStates.map((system) => {
              const Icon = CATEGORY_ICON_MAP[system.icon as keyof typeof CATEGORY_ICON_MAP] || Orbit;

              return (
                <Card key={system.id} className={cn("border-slate-200 bg-white shadow-sm", !system.unlocked && "opacity-80")}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full border border-primary/20 bg-primary/10">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-base text-slate-900">{system.label}</CardTitle>
                          <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Category mastery level {system.level}</div>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-slate-50 text-slate-700">
                        {system.structureCount} projects
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-slate-600">{system.description}</p>

                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                      <div className="text-xs uppercase tracking-widest text-slate-500">Strategic Doctrine</div>
                      <div className="mt-1 text-sm font-medium text-slate-900">{system.doctrine}</div>
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
                      <div className="mb-2 text-xs uppercase tracking-widest text-slate-500">Unlock Gate</div>
                      <div className="space-y-1 text-slate-700">
                        <div>Kardashev: {kardashevLevel} / {system.requirements.kardashevLevel}</div>
                        <div>Research: {researchTotal} / {system.requirements.totalResearch}</div>
                        <div>Division Levels: {technologyDivisionTotal} / {system.requirements.totalTechnologyDivisions}</div>
                      </div>
                    </div>

                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm">
                      <div className="mb-2 text-xs uppercase tracking-widest text-slate-500">Upgrade Costs</div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600">Metal</span>
                          <span className={cn(resources.metal < system.snapshot.cost.metal && "font-bold text-red-600")}>{system.snapshot.cost.metal.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600">Crystal</span>
                          <span className={cn(resources.crystal < system.snapshot.cost.crystal && "font-bold text-red-600")}>{system.snapshot.cost.crystal.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600">Deuterium</span>
                          <span className={cn(resources.deuterium < system.snapshot.cost.deuterium && "font-bold text-red-600")}>{system.snapshot.cost.deuterium.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between pt-1 text-xs text-slate-500">
                          <span>Upgrade Time</span>
                          <span>{system.snapshot.buildTimeSeconds}s</span>
                        </div>
                      </div>
                    </div>

                    <Button
                      className="w-full font-orbitron tracking-wider"
                      disabled={!system.unlocked || !system.canAfford || system.maxed}
                      onClick={() =>
                        upgradeMegastructureSystem(
                          system.id,
                          `${system.label} Category Mastery`,
                          system.snapshot.cost,
                          system.snapshot.buildTimeSeconds * 1000,
                        )
                      }
                    >
                      {system.maxed ? "MAX LEVEL" : !system.unlocked ? "REQUIREMENTS NOT MET" : system.canAfford ? `UPGRADE TO LEVEL ${system.level + 1}` : "INSUFFICIENT RESOURCES"}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Constructable Megaprojects</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-600">Existing megastructure projects remain constructable here. Category mastery upgrades now sit above them and improve the strategic value of each class.</p>

            <Tabs defaultValue={constructableCategories[0]?.id || "infrastructure"} className="w-full">
              <TabsList className="flex h-auto w-full flex-wrap justify-start gap-2 border border-slate-200 bg-slate-50 p-2">
                {constructableCategories.map((category) => (
                  <TabsTrigger key={category.id} value={category.id} className="capitalize data-[state=active]:bg-white">
                    {category.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              {constructableCategories.map((category) => {
                const structures = getMegaStructuresByCategory(category.id);
                const categoryMastery = categoryStates.find((system) => system.category === category.id);

                return (
                  <TabsContent key={category.id} value={category.id} className="mt-6 space-y-4">
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <div>
                          <div className="text-xs uppercase tracking-[0.18em] text-slate-500">{category.label}</div>
                          <div className="mt-1 text-sm text-slate-600">{category.description}</div>
                        </div>
                        <Badge className="bg-violet-100 text-violet-800">
                          Mastery Bonus +{categoryMastery?.snapshot.currentBonus || 0}%
                        </Badge>
                      </div>
                    </div>

                    {structures.length === 0 ? (
                      <Card className="border-dashed border-slate-300 bg-slate-50">
                        <CardContent className="p-6 text-sm text-slate-600">
                          This category is now represented in the mastery system even if no direct constructable template is exposed yet.
                        </CardContent>
                      </Card>
                    ) : (
                      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                        {structures.map((structure) => {
                          const cost = calculateConstructionCost(structure);

                          return (
                            <Card key={structure.id} className="border-slate-200 bg-white shadow-sm">
                              <CardHeader className="pb-2">
                                <div className="flex items-start justify-between gap-3">
                                  <div>
                                    <CardTitle className="text-lg text-slate-900">{structure.name}</CardTitle>
                                    <div className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">{structure.type.replace(/_/g, " ")}</div>
                                  </div>
                                  <Badge variant="outline" className="bg-slate-50 text-slate-700">
                                    Tier {structure.tier}
                                  </Badge>
                                </div>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                <p className="text-sm text-slate-600">{structure.description}</p>

                                <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                                  <div className="text-xs uppercase tracking-widest text-amber-700">Special Ability</div>
                                  <div className="mt-1 text-sm font-medium text-amber-900">{structure.specialAbility}</div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                                    <div className="text-xs uppercase tracking-widest text-slate-500">Energy</div>
                                    <div className="mt-1 text-lg font-bold text-yellow-700">{structure.stats.energyOutput.toLocaleString()}</div>
                                  </div>
                                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                                    <div className="text-xs uppercase tracking-widest text-slate-500">Research</div>
                                    <div className="mt-1 text-lg font-bold text-violet-700">+{structure.stats.researchBonus}%</div>
                                  </div>
                                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                                    <div className="text-xs uppercase tracking-widest text-slate-500">Production</div>
                                    <div className="mt-1 text-lg font-bold text-emerald-700">+{structure.stats.productionBonus}%</div>
                                  </div>
                                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                                    <div className="text-xs uppercase tracking-widest text-slate-500">Population</div>
                                    <div className="mt-1 text-lg font-bold text-sky-700">{(structure.stats.populationCapacity / 1000000).toFixed(1)}M</div>
                                  </div>
                                </div>

                                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm">
                                  <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-widest text-slate-500">
                                    <TrendingUp className="h-3.5 w-3.5 text-primary" /> Construction Cost
                                  </div>
                                  <div className="space-y-1">
                                    <div className="flex items-center justify-between"><span className="text-slate-600">Metal</span><span>{cost.metal.toLocaleString()}</span></div>
                                    <div className="flex items-center justify-between"><span className="text-slate-600">Crystal</span><span>{cost.crystal.toLocaleString()}</span></div>
                                    <div className="flex items-center justify-between"><span className="text-slate-600">Deuterium</span><span>{cost.deuterium.toLocaleString()}</span></div>
                                    <div className="flex items-center justify-between pt-1 text-xs text-slate-500"><span>Build Time</span><span>{structure.stats.constructionTime.toLocaleString()} turns</span></div>
                                  </div>
                                </div>

                                <Button className="w-full font-orbitron tracking-wider" onClick={() => constructMegastructure(structure.templateId, structure.name, structure.stats.constructionTime)}>
                                  Begin Construction
                                </Button>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    )}
                  </TabsContent>
                );
              })}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </GameLayout>
  );
}
