import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { SHIP_ASSETS } from "@shared/config";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGame } from "@/lib/gameContext";
import { getCurrentKardashevUpgradeLevel } from "@/lib/kardashevUpgradeCatalog";
import {
  SHIPYARD_CATEGORY_SYSTEMS,
  STARSHIP_LINE_COUNTS,
  getShipyardCategoryUpgradeSnapshot,
  getStarshipBlueprintsByCategory,
  getStarshipBlueprintUpgradeSnapshot,
} from "@/lib/starshipLineCatalog";
import { cn } from "@/lib/utils";

const TEMP_THEME_IMAGE = "/theme-temp.png";

function getBlueprintImagePath(hullClass: string) {
  if (hullClass === "Fighter") return SHIP_ASSETS.FIGHTERS.INTERCEPTOR.path;
  if (hullClass === "Frigate") return SHIP_ASSETS.CAPITALS.CORVETTE.path;
  if (hullClass === "Destroyer") return SHIP_ASSETS.CAPITALS.DESTROYER.path;
  if (hullClass === "Cruiser") return SHIP_ASSETS.CAPITALS.BATTLECRUISER.path;
  if (hullClass === "Battleship") return SHIP_ASSETS.CAPITALS.BATTLESHIP.path;
  if (hullClass === "Carrier") return SHIP_ASSETS.SPECIAL.CARRIER.path;
  return SHIP_ASSETS.SPECIAL.TRANSPORT.path;
}

export default function AdvancedConstructorDock() {
  const [query, setQuery] = useState("");
  const {
    buildings,
    resources,
    research,
    kardashevSystems,
    shipyardCategorySystems,
    starshipLineSystems,
    upgradeShipyardCategorySystem,
    upgradeStarshipLineSystem,
  } = useGame();

  const kardashevLevel = getCurrentKardashevUpgradeLevel(kardashevSystems);
  const researchTotal = useMemo(() => Object.values(research).reduce((sum, value) => sum + (value || 0), 0), [research]);
  const totalBlueprintLevels = useMemo(() => Object.values(starshipLineSystems).reduce((sum, value) => sum + (value || 0), 0), [starshipLineSystems]);

  const categoryStates = SHIPYARD_CATEGORY_SYSTEMS.map((category) => {
    const level = shipyardCategorySystems[category.id] || 0;
    const snapshot = getShipyardCategoryUpgradeSnapshot(category, level);
    const unlocked = (buildings?.shipyard || 0) >= category.requirements.shipyardLevel && researchTotal >= category.requirements.researchTotal;
    const canAfford =
      resources.metal >= snapshot.cost.metal &&
      resources.crystal >= snapshot.cost.crystal &&
      resources.deuterium >= snapshot.cost.deuterium;

    return {
      ...category,
      level,
      snapshot,
      unlocked,
      canAfford,
      maxed: level >= snapshot.maxLevel,
    };
  });

  return (
    <div className="space-y-6">
      <Card className="border-slate-200 bg-slate-50 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-slate-900">Advanced Constructor Dock</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-4">
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="text-xs uppercase tracking-widest text-slate-500">Shipyard Categories</div>
            <div className="mt-1 text-2xl font-orbitron font-bold text-slate-900">{STARSHIP_LINE_COUNTS.categories}</div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="text-xs uppercase tracking-widest text-slate-500">Starship Blueprints</div>
            <div className="mt-1 text-2xl font-orbitron font-bold text-blue-700">{STARSHIP_LINE_COUNTS.blueprints}</div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="text-xs uppercase tracking-widest text-slate-500">Category Tracks Online</div>
            <div className="mt-1 text-2xl font-orbitron font-bold text-violet-700">{categoryStates.filter((category) => category.level > 0).length}</div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="text-xs uppercase tracking-widest text-slate-500">Kardashev / Blueprint Levels</div>
            <div className="mt-1 text-2xl font-orbitron font-bold text-amber-700">L{kardashevLevel} / {totalBlueprintLevels}</div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="categories" className="w-full">
        <TabsList className="flex h-auto w-full flex-wrap justify-start gap-2 border border-slate-200 bg-white p-2">
          <TabsTrigger value="categories" className="data-[state=active]:bg-slate-50">{STARSHIP_LINE_COUNTS.categories} Command Categories</TabsTrigger>
          <TabsTrigger value="blueprints" className="data-[state=active]:bg-slate-50">{STARSHIP_LINE_COUNTS.blueprints} Starships</TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="mt-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {categoryStates.map((category) => (
              <Card key={category.id} className={cn("border-slate-200 bg-white shadow-sm", !category.unlocked && "opacity-80")}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <CardTitle className="text-base text-slate-900">{category.name}</CardTitle>
                      <div className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">Category Level {category.level}</div>
                    </div>
                    <Badge variant="outline" className="bg-slate-50 text-slate-700">
                      {getStarshipBlueprintsByCategory(category.id).length} blueprints
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-slate-600">{category.description}</p>
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <div className="text-xs uppercase tracking-widest text-slate-500">Doctrine</div>
                    <div className="mt-1 text-sm font-medium text-slate-900">{category.doctrine}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3"><div className="text-xs uppercase tracking-widest text-slate-500">Current Bonus</div><div className="mt-1 text-lg font-bold text-emerald-700">+{category.snapshot.currentBonus}%</div></div>
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3"><div className="text-xs uppercase tracking-widest text-slate-500">Next Level</div><div className="mt-1 text-lg font-bold text-blue-700">+{category.snapshot.nextBonus}%</div></div>
                  </div>
                  <div className="rounded-lg border border-dashed border-slate-200 bg-white p-3 text-sm">
                    <div className="mb-2 text-xs uppercase tracking-widest text-slate-500">Requirements</div>
                    <div className="space-y-1 text-slate-700">
                      <div>Shipyard: {(buildings?.shipyard || 0)} / {category.requirements.shipyardLevel}</div>
                      <div>Research Total: {researchTotal} / {category.requirements.researchTotal}</div>
                    </div>
                  </div>
                  <Button className="w-full font-orbitron tracking-wider" disabled={!category.unlocked || !category.canAfford || category.maxed} onClick={() => upgradeShipyardCategorySystem(category.id, category.name, category.snapshot.cost, category.snapshot.buildTimeSeconds * 1000)}>
                    {category.maxed ? "MAX LEVEL" : !category.unlocked ? "REQUIREMENTS NOT MET" : category.canAfford ? `UPGRADE TO LEVEL ${category.level + 1}` : "INSUFFICIENT RESOURCES"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="blueprints" className="mt-6 space-y-6">
          <Card className="border-slate-200 bg-white">
            <CardContent className="p-4">
              <div className="relative max-w-xl">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search starship class, blueprint, doctrine, or role..." className="pl-9" />
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue={SHIPYARD_CATEGORY_SYSTEMS[0]?.id || ""} className="w-full">
            <TabsList className="flex h-auto w-full flex-wrap justify-start gap-2 border border-slate-200 bg-white p-2">
              {SHIPYARD_CATEGORY_SYSTEMS.map((category) => (
                <TabsTrigger key={category.id} value={category.id} className="data-[state=active]:bg-slate-50">
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {SHIPYARD_CATEGORY_SYSTEMS.map((category) => {
              const categoryLevel = shipyardCategorySystems[category.id] || 0;
              const blueprints = getStarshipBlueprintsByCategory(category.id).filter((blueprint) => {
                if (!query.trim()) return true;
                const search = query.toLowerCase();
                return (
                  blueprint.name.toLowerCase().includes(search) ||
                  blueprint.hullClass.toLowerCase().includes(search) ||
                  blueprint.role.toLowerCase().includes(search) ||
                  blueprint.description.toLowerCase().includes(search)
                );
              });

              return (
                <TabsContent key={category.id} value={category.id} className="mt-6 space-y-4">
                  <Card className="border-slate-200 bg-slate-50">
                    <CardContent className="grid gap-4 p-5 md:grid-cols-4">
                      <div className="rounded-lg border border-slate-200 bg-white p-4"><div className="text-xs uppercase tracking-widest text-slate-500">Category</div><div className="mt-1 text-lg font-bold text-slate-900">{category.name}</div></div>
                      <div className="rounded-lg border border-slate-200 bg-white p-4"><div className="text-xs uppercase tracking-widest text-slate-500">Category Level</div><div className="mt-1 text-lg font-bold text-violet-700">{categoryLevel}</div></div>
                      <div className="rounded-lg border border-slate-200 bg-white p-4"><div className="text-xs uppercase tracking-widest text-slate-500">Visible Blueprints</div><div className="mt-1 text-lg font-bold text-blue-700">{blueprints.length}</div></div>
                      <div className="rounded-lg border border-slate-200 bg-white p-4"><div className="text-xs uppercase tracking-widest text-slate-500">Doctrine</div><div className="mt-1 text-sm font-medium text-slate-700">{category.doctrine}</div></div>
                    </CardContent>
                  </Card>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {blueprints.map((blueprint) => {
                      const level = starshipLineSystems[blueprint.id] || 0;
                      const snapshot = getStarshipBlueprintUpgradeSnapshot(blueprint, level);
                      const requirementsMet =
                        (buildings?.shipyard || 0) >= blueprint.requirements.shipyardLevel &&
                        categoryLevel >= blueprint.requirements.categoryLevel &&
                        kardashevLevel >= blueprint.requirements.kardashevLevel;
                      const canAfford =
                        resources.metal >= snapshot.cost.metal &&
                        resources.crystal >= snapshot.cost.crystal &&
                        resources.deuterium >= snapshot.cost.deuterium;

                      return (
                        <Card key={blueprint.id} className={cn("overflow-hidden border-slate-200 bg-white shadow-sm", !requirementsMet && "opacity-80")}>
                          <div className="relative h-32 border-b border-slate-200 bg-slate-50">
                            <div className="absolute inset-0 flex items-center justify-center">
                              <img src={getBlueprintImagePath(blueprint.hullClass)} alt={blueprint.name} className="h-24 w-24 object-contain" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = TEMP_THEME_IMAGE; }} />
                            </div>
                            <div className="absolute left-2 top-2"><Badge variant="outline" className="bg-white/90 text-[10px] uppercase">{blueprint.hullClass}</Badge></div>
                            <div className="absolute right-2 top-2 rounded bg-white px-2 py-1 text-[10px] font-mono text-primary">Level {level}</div>
                          </div>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base text-slate-900">{blueprint.name}</CardTitle>
                            <p className="text-xs text-slate-500">{blueprint.role} • {blueprint.categoryName}</p>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <p className="text-sm text-slate-600">{blueprint.description}</p>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div className="rounded border border-slate-200 bg-slate-50 p-2">Hull {blueprint.stats.hull.toLocaleString()}</div>
                              <div className="rounded border border-slate-200 bg-slate-50 p-2">Shield {blueprint.stats.shields.toLocaleString()}</div>
                              <div className="rounded border border-slate-200 bg-slate-50 p-2">Firepower {blueprint.stats.firepower.toLocaleString()}</div>
                              <div className="rounded border border-slate-200 bg-slate-50 p-2">Cargo {blueprint.stats.cargo.toLocaleString()}</div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3"><div className="text-xs uppercase tracking-widest text-slate-500">Hull Bonus</div><div className="mt-1 text-lg font-bold text-emerald-700">+{snapshot.currentHullBonus}%</div></div>
                              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3"><div className="text-xs uppercase tracking-widest text-slate-500">Firepower Bonus</div><div className="mt-1 text-lg font-bold text-blue-700">+{snapshot.currentFirepowerBonus}%</div></div>
                            </div>
                            <div className="rounded-lg border border-dashed border-slate-200 bg-white p-3 text-sm">
                              <div className="mb-2 text-xs uppercase tracking-widest text-slate-500">Requirements</div>
                              <div className="space-y-1 text-slate-700">
                                <div>Shipyard: {(buildings?.shipyard || 0)} / {blueprint.requirements.shipyardLevel}</div>
                                <div>Category Level: {categoryLevel} / {blueprint.requirements.categoryLevel}</div>
                                <div>Kardashev: {kardashevLevel} / {blueprint.requirements.kardashevLevel}</div>
                              </div>
                            </div>
                            <Button className="w-full font-orbitron tracking-wider" disabled={!requirementsMet || !canAfford || level >= snapshot.maxLevel} onClick={() => upgradeStarshipLineSystem(blueprint.id, blueprint.name, snapshot.cost, snapshot.buildTimeSeconds * 1000)}>
                              {level >= snapshot.maxLevel ? "MAX LEVEL" : !requirementsMet ? "REQUIREMENTS NOT MET" : canAfford ? `UPGRADE TO LEVEL ${level + 1}` : "INSUFFICIENT RESOURCES"}
                            </Button>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </TabsContent>
              );
            })}
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  );
}
