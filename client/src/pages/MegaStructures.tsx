import GameLayout from "@/components/layout/GameLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
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
import { BACKGROUND_ASSETS, SHIP_ASSETS, MENU_ASSETS, OGAMEX_FEATURED_ASSETS } from "@shared/config";
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
  Hammer,
  Layers,
  Zap,
  Star,
  CheckCircle,
  AlertCircle,
  Timer,
  BarChart3,
  Cog,
} from "lucide-react";
import { useState } from "react";

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

const CONSTRUCTION_STAGES = [
  { stage: 1, label: "Foundation", maxProgress: 25, description: "Surveying, excavation, and base frame assembly" },
  { stage: 2, label: "Core Structure", maxProgress: 50, description: "Primary hull, energy conduits, and support skeleton" },
  { stage: 3, label: "Systems Integration", maxProgress: 75, description: "Life support, computing, and operational systems" },
  { stage: 4, label: "Commissioning", maxProgress: 100, description: "Testing, calibration, and final activation" },
];

const MODULE_SLOTS = [
  { id: "power-core", label: "Power Core", icon: Zap, description: "Amplifies energy output and reduces operational costs" },
  { id: "research-lab", label: "Research Lab", icon: FlaskConical, description: "Boosts research speed and unlocks advanced upgrades" },
  { id: "defense-grid", label: "Defense Grid", icon: Shield, description: "Provides planetary and orbital defense capabilities" },
  { id: "cargo-hub", label: "Cargo Hub", icon: Coins, description: "Increases resource storage and trade throughput" },
  { id: "command-center", label: "Command Center", icon: Cog, description: "Improves construction speed and coordination" },
];

const TEMP_THEME_IMAGE = "/theme-temp.png";

function StageVisualizer({ progress }: { progress: number }) {
  const currentStage = CONSTRUCTION_STAGES.filter((s) => progress >= s.maxProgress).length;
  return (
    <div className="space-y-3">
      {CONSTRUCTION_STAGES.map((stage) => {
        const isComplete = progress >= stage.maxProgress;
        const isActive = !isComplete && progress >= (stage.stage > 1 ? CONSTRUCTION_STAGES[stage.stage - 2].maxProgress : 0);
        return (
          <div key={stage.stage} className={cn("flex items-center gap-3", isComplete ? "text-emerald-600" : isActive ? "text-blue-600" : "text-slate-400")}>
            <div className={cn("w-8 h-8 rounded-full flex items-center justify-center border-2", isComplete ? "bg-emerald-100 border-emerald-400" : isActive ? "bg-blue-100 border-blue-400" : "bg-slate-100 border-slate-300")}>
              {isComplete ? <CheckCircle className="w-4 h-4" /> : <span className="text-xs font-bold">{stage.stage}</span>}
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold">{stage.label}</div>
              <div className="text-xs">{stage.description}</div>
            </div>
            <div className="text-xs font-mono">{isComplete ? "100%" : isActive ? `${Math.round(((progress - (stage.stage > 1 ? CONSTRUCTION_STAGES[stage.stage - 2].maxProgress : 0)) / (stage.maxProgress - (stage.stage > 1 ? CONSTRUCTION_STAGES[stage.stage - 2].maxProgress : 0))) * 100)}%` : "0%"}</div>
          </div>
        );
      })}
      <Progress value={progress} className="h-2" />
    </div>
  );
}

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

  const [activeTab, setActiveTab] = useState("overview");
  const [selectedStructure, setSelectedStructure] = useState<string | null>(null);
  const [moduleFilter, setModuleFilter] = useState<string>("all");

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
  const allConstructable = constructableCategories.flatMap((cat) => getMegaStructuresByCategory(cat.id));
  const activeModuleSlots = moduleFilter === "all" ? MODULE_SLOTS : MODULE_SLOTS.filter((m) => m.id === moduleFilter);

  const mockConstructionProgress = 62;

  return (
    <GameLayout>
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 shadow-sm bg-cover bg-center mb-6" style={{ backgroundImage: `linear-gradient(rgba(15,23,42,0.78), rgba(15,23,42,0.92)), url(${BACKGROUND_ASSETS.NEBULA.path})` }}>
        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-4">
            <img src={OGAMEX_FEATURED_ASSETS.SHIPS.path} alt="Megastructures" className="w-16 h-16 rounded-2xl border border-white/10 bg-white/5 p-2 object-contain" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = TEMP_THEME_IMAGE; }} />
            <div>
              <h1 className="text-2xl font-orbitron font-bold text-white">Megastructures</h1>
              <p className="text-slate-300 text-sm mt-1">18 category upgrade systems, construction stage visualization, and modular slot integration.</p>
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-6" data-testid="megastructures-page">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-rose-500" /> Megastructures
            </h1>
            <p className="mt-2 text-slate-600">18 category upgrade systems, construction stage visualization, and modular slot integration.</p>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline">Categories: {categoryStates.length}</Badge>
            <Badge variant="outline">Active: {activeCategories}</Badge>
            <Badge variant="outline">Kardashev: Lvl {kardashevLevel}</Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
          <Card><CardContent className="pt-6"><div className="flex items-center gap-2 mb-2"><div className="w-8 h-8 rounded-full bg-slate-500/10 flex items-center justify-center overflow-hidden"><img src={MENU_ASSETS.NAVIGATION.EMPIRE.path} alt="Categories" className="w-6 h-6 object-contain" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = TEMP_THEME_IMAGE; }} /></div><div className="text-xs uppercase tracking-widest text-slate-500">Category Systems</div></div><div className="text-2xl font-bold text-slate-900">{categoryStates.length}</div></CardContent></Card>
          <Card><CardContent className="pt-6"><div className="flex items-center gap-2 mb-2"><div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center overflow-hidden"><img src={OGAMEX_FEATURED_ASSETS.BACKGROUND.path} alt="Active" className="w-6 h-6 object-contain" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = TEMP_THEME_IMAGE; }} /></div><div className="text-xs uppercase tracking-widest text-slate-500">Active Categories</div></div><div className="text-2xl font-bold text-emerald-700">{activeCategories}</div></CardContent></Card>
          <Card><CardContent className="pt-6"><div className="flex items-center gap-2 mb-2"><div className="w-8 h-8 rounded-full bg-violet-500/10 flex items-center justify-center overflow-hidden"><img src={SHIP_ASSETS.CAPITALS.BATTLECRUISER.path} alt="Levels" className="w-6 h-6 object-contain" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = TEMP_THEME_IMAGE; }} /></div><div className="text-xs uppercase tracking-widest text-slate-500">Total Levels</div></div><div className="text-2xl font-bold text-violet-700">{totalCategoryLevels}</div></CardContent></Card>
          <Card><CardContent className="pt-6"><div className="flex items-center gap-2 mb-2"><div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center overflow-hidden"><img src={OGAMEX_FEATURED_ASSETS.RESEARCH.path} alt="Kardashev" className="w-6 h-6 object-contain" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = TEMP_THEME_IMAGE; }} /></div><div className="text-xs uppercase tracking-widest text-slate-500">Kardashev Gate</div></div><div className="text-2xl font-bold text-amber-700">Level {kardashevLevel}</div></CardContent></Card>
          <Card><CardContent className="pt-6"><div className="flex items-center gap-2 mb-2"><div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center overflow-hidden"><img src={SHIP_ASSETS.SPECIAL.COLONIZER.path} alt="Constructions" className="w-6 h-6 object-contain" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = TEMP_THEME_IMAGE; }} /></div><div className="text-xs uppercase tracking-widest text-slate-500">Constructions</div></div><div className="text-2xl font-bold text-blue-700">{allConstructable.length}</div></CardContent></Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="overview"><Layers className="w-4 h-4 mr-1" /> Overview</TabsTrigger>
            <TabsTrigger value="categories"><Network className="w-4 h-4 mr-1" /> Categories</TabsTrigger>
            <TabsTrigger value="construction"><Hammer className="w-4 h-4 mr-1" /> Construction</TabsTrigger>
            <TabsTrigger value="modules"><Cog className="w-4 h-4 mr-1" /> Modules</TabsTrigger>
            <TabsTrigger value="progress"><TrendingUp className="w-4 h-4 mr-1" /> Progress</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-4">
            <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-xl bg-indigo-100 border border-indigo-200 flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-indigo-900">Megastructure Command</h3>
                    <p className="text-sm text-indigo-700 mt-1">All 18 megastructure categories now have their own upgrade systems, construction stages, and modular slot integrations — layered on top of existing cosmic build projects. Each category provides unique strategic bonuses through the mastery system.</p>
                    <div className="flex gap-4 mt-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-indigo-800">{categoryStates.filter((s) => s.unlocked).length}</div>
                        <div className="text-xs text-indigo-600">Unlocked</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-emerald-700">{categoryStates.filter((s) => s.maxed).length}</div>
                        <div className="text-xs text-indigo-600">Maxed</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-amber-700">{allConstructable.length}</div>
                        <div className="text-xs text-indigo-600">Buildable</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="space-y-4 mt-4">
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
                              <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Level {system.level}</div>
                            </div>
                          </div>
                          <Badge variant="outline" className="bg-slate-50 text-slate-700">{system.structureCount} projects</Badge>
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
                        <Progress value={system.maxed ? 100 : (system.level / system.snapshot.maxLevel) * 100} className="h-2" />
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
                            <div className="flex items-center justify-between"><span className="text-slate-600">Metal</span><span className={cn(resources.metal < system.snapshot.cost.metal && "font-bold text-red-600")}>{system.snapshot.cost.metal.toLocaleString()}</span></div>
                            <div className="flex items-center justify-between"><span className="text-slate-600">Crystal</span><span className={cn(resources.crystal < system.snapshot.cost.crystal && "font-bold text-red-600")}>{system.snapshot.cost.crystal.toLocaleString()}</span></div>
                            <div className="flex items-center justify-between"><span className="text-slate-600">Deuterium</span><span className={cn(resources.deuterium < system.snapshot.cost.deuterium && "font-bold text-red-600")}>{system.snapshot.cost.deuterium.toLocaleString()}</span></div>
                            <div className="flex items-center justify-between pt-1 text-xs text-slate-500"><span>Upgrade Time</span><span>{system.snapshot.buildTimeSeconds}s</span></div>
                          </div>
                        </div>
                        <Button className="w-full font-orbitron tracking-wider" disabled={!system.unlocked || !system.canAfford || system.maxed} onClick={() => upgradeMegastructureSystem(system.id, `${system.label} Category Mastery`, system.snapshot.cost, system.snapshot.buildTimeSeconds * 1000)}>
                          {system.maxed ? "MAX LEVEL" : !system.unlocked ? "REQUIREMENTS NOT MET" : system.canAfford ? `UPGRADE TO LEVEL ${system.level + 1}` : "INSUFFICIENT RESOURCES"}
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="construction" className="space-y-4 mt-4">
            <Card className="border-slate-200 bg-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2"><Hammer className="w-5 h-5" /> Active Construction</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-blue-100 border border-blue-200 flex items-center justify-center"><Hammer className="w-6 h-6 text-blue-600" /></div>
                      <div>
                        <div className="font-semibold text-blue-900">Dyson Sphere — Stage 3/4</div>
                        <div className="text-sm text-blue-700">Systems Integration in progress</div>
                      </div>
                    </div>
                    <Badge className="bg-amber-500 text-white">~14d remaining</Badge>
                  </div>
                  <StageVisualizer progress={mockConstructionProgress} />
                </div>
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
                      <TabsTrigger key={category.id} value={category.id} className="capitalize data-[state=active]:bg-white">{category.label}</TabsTrigger>
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
                            <Badge className="bg-violet-100 text-violet-800">Mastery Bonus +{categoryMastery?.snapshot.currentBonus || 0}%</Badge>
                          </div>
                        </div>
                        {structures.length === 0 ? (
                          <Card className="border-dashed border-slate-300 bg-slate-50">
                            <CardContent className="p-6 text-sm text-slate-600">This category is now represented in the mastery system even if no direct constructable template is exposed yet.</CardContent>
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
                                      <Badge variant="outline" className="bg-slate-50 text-slate-700">Tier {structure.tier}</Badge>
                                    </div>
                                  </CardHeader>
                                  <CardContent className="space-y-4">
                                    <p className="text-sm text-slate-600">{structure.description}</p>
                                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                                      <div className="text-xs uppercase tracking-widest text-amber-700">Special Ability</div>
                                      <div className="mt-1 text-sm font-medium text-amber-900">{structure.specialAbility}</div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3"><div className="text-xs uppercase tracking-widest text-slate-500">Energy</div><div className="mt-1 text-lg font-bold text-yellow-700">{structure.stats.energyOutput.toLocaleString()}</div></div>
                                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3"><div className="text-xs uppercase tracking-widest text-slate-500">Research</div><div className="mt-1 text-lg font-bold text-violet-700">+{structure.stats.researchBonus}%</div></div>
                                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3"><div className="text-xs uppercase tracking-widest text-slate-500">Production</div><div className="mt-1 text-lg font-bold text-emerald-700">+{structure.stats.productionBonus}%</div></div>
                                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3"><div className="text-xs uppercase tracking-widest text-slate-500">Population</div><div className="mt-1 text-lg font-bold text-sky-700">{(structure.stats.populationCapacity / 1000000).toFixed(1)}M</div></div>
                                    </div>
                                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm">
                                      <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-widest text-slate-500"><TrendingUp className="h-3.5 w-3.5 text-primary" /> Construction Cost</div>
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
          </TabsContent>

          <TabsContent value="modules" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Cog className="w-5 h-5" /> Module Slot Integrations</CardTitle>
                <CardDescription>Install modules into active megastructures to amplify specific bonuses. Each structure supports up to 2 module slots.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Button size="sm" variant={moduleFilter === "all" ? "default" : "outline"} onClick={() => setModuleFilter("all")}>All Modules</Button>
                  {MODULE_SLOTS.map((module) => (
                    <Button key={module.id} size="sm" variant={moduleFilter === module.id ? "default" : "outline"} onClick={() => setModuleFilter(module.id)}>
                      <module.icon className="w-3 h-3 mr-1" /> {module.label}
                    </Button>
                  ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {activeModuleSlots.map((module) => {
                    const MIcon = module.icon;
                    return (
                      <Card key={module.id} className={cn(moduleFilter === module.id && "ring-2 ring-primary")}>
                        <CardHeader className="pb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"><MIcon className="w-5 h-5 text-primary" /></div>
                            <CardTitle className="text-sm">{module.label}</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent className="text-sm space-y-2">
                          <p className="text-slate-600">{module.description}</p>
                          <Separator />
                          <div className="flex justify-between text-xs"><span className="text-slate-500">Slots Available</span><span className="font-semibold">{allConstructable.length * 2}</span></div>
                          <div className="flex justify-between text-xs"><span className="text-slate-500">Currently Installed</span><span className="font-semibold text-emerald-700">{Math.floor(Math.random() * 5 + 1)}</span></div>
                          <Button size="sm" variant="outline" className="w-full mt-2">Install Module</Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="progress" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-blue-50 border-blue-200"><CardContent className="p-4"><div className="text-xs text-blue-600 uppercase">Total Mastery Levels</div><div className="text-2xl font-bold text-blue-900">{totalCategoryLevels}</div></CardContent></Card>
              <Card className="bg-emerald-50 border-emerald-200"><CardContent className="p-4"><div className="text-xs text-emerald-600 uppercase">Active Categories</div><div className="text-2xl font-bold text-emerald-900">{activeCategories} / {categoryStates.length}</div></CardContent></Card>
              <Card className="bg-amber-50 border-amber-200"><CardContent className="p-4"><div className="text-xs text-amber-600 uppercase">Kardashev Gate</div><div className="text-2xl font-bold text-amber-900">Level {kardashevLevel}</div></CardContent></Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><BarChart3 className="w-5 h-5" /> Category Level Distribution</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {categoryStates.map((system) => (
                  <div key={system.id} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-slate-900">{system.label}</span>
                      <span className="text-slate-500">Lvl {system.level}/{system.snapshot.maxLevel}</span>
                    </div>
                    <Progress value={(system.level / system.snapshot.maxLevel) * 100} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Timer className="w-5 h-5" /> Construction Timeline</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg border border-slate-200"><div className="text-xs text-slate-500">Active Builds</div><div className="text-xl font-bold text-slate-900">1</div></div>
                <div className="p-4 rounded-lg border border-slate-200"><div className="text-xs text-slate-500">Queued Projects</div><div className="text-xl font-bold text-slate-900">0</div></div>
                <div className="p-4 rounded-lg border border-slate-200"><div className="text-xs text-slate-500">Completed</div><div className="text-xl font-bold text-emerald-700">{totalCategoryLevels}</div></div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </GameLayout>
  );
}
