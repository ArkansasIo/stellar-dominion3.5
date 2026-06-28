import GameLayout from "@/components/layout/GameLayout";
import { useGame } from "@/lib/gameContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Box, Gem, Database, Zap, ArrowUpCircle, Hammer, Clock, TrendingUp, Warehouse, Factory, BarChart3 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { BACKGROUND_ASSETS, SHIP_ASSETS, MENU_ASSETS, OGAMEX_FEATURED_ASSETS } from "@shared/config";
import { calculateResourceProduction, calculateStorageCapacity } from "@/lib/resourceMath";
import { getRefineryStage, getRefineryUpgradeSnapshot, type RefinerySystemDefinition } from "@/lib/refinerySystemsCatalog";

const TEMP_THEME_IMAGE = "/theme-temp.png";

const RESOURCE_IMAGE_MAP: Record<string, string> = {
  metalMine:             MENU_ASSETS.RESOURCES.METAL.path,
  crystalMine:           MENU_ASSETS.RESOURCES.CRYSTAL.path,
  deuteriumSynthesizer:  MENU_ASSETS.RESOURCES.DEUTERIUM.path,
  solarPlant:            MENU_ASSETS.BUILDINGS.POWER_PLANT.path,
};

const BuildingCard = ({ 
  id, 
  name, 
  level, 
  description, 
  icon: Icon, 
  onUpgrade, 
  resources,
  productionRate,
  nextLevelBonus,
  energyCost,
  iconColor
}: any) => {
  const imagePath = RESOURCE_IMAGE_MAP[id];
  const metalCost = Math.floor(100 * Math.pow(1.5, level));
  const crystalCost = Math.floor(50 * Math.pow(1.5, level));
  const buildTime = (level + 1) * 10;

  const canAfford = resources.metal >= metalCost && resources.crystal >= crystalCost;

  return (
    <Card className="bg-white border-slate-200 hover:border-primary/50 transition-all group overflow-hidden shadow-sm" data-testid={`card-building-${id}`}>
       <div className="h-36 bg-gradient-to-br from-slate-50 to-slate-100 relative group-hover:from-slate-100 group-hover:to-slate-200 transition-colors duration-500 border-b border-slate-200">
          {imagePath ? (
            <>
              <img
                src={imagePath}
                alt={name}
                className="absolute inset-0 w-full h-full object-contain opacity-20 pointer-events-none"
                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = TEMP_THEME_IMAGE; }}
              />
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <img
                  src={imagePath}
                  alt={name}
                  className="w-16 h-16 object-contain drop-shadow transition-transform group-hover:scale-110"
                  onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = TEMP_THEME_IMAGE; }}
                />
              </div>
            </>
          ) : (
            <>
              <div className="absolute inset-0 flex items-center justify-center">
                <Icon className={cn("w-20 h-20 opacity-20", iconColor || "text-slate-400")} />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Icon className={cn("w-16 h-16 transition-transform group-hover:scale-110", iconColor || "text-slate-500")} />
              </div>
            </>
          )}
          <div className="absolute bottom-2 right-2 bg-white px-3 py-1.5 rounded text-sm font-orbitron text-primary border border-slate-200 shadow-sm">
            Level {level}
          </div>
          <div className="absolute top-2 left-2">
            <Badge variant="outline" className="bg-white/80 text-xs">{id === "solarPlant" ? "Energy" : "Production"}</Badge>
          </div>
       </div>
       
       <CardHeader className="pb-2">
         <CardTitle className="text-lg font-orbitron text-slate-900 group-hover:text-primary transition-colors">{name}</CardTitle>
       </CardHeader>
       
       <CardContent className="pb-2 space-y-4">
         <p className="text-sm text-muted-foreground">{description}</p>
         
         <div className="bg-slate-50 p-3 rounded border border-slate-100">
           <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-1">
             <BarChart3 className="w-3 h-3" /> Current Output
           </div>
           <div className="flex items-center justify-between">
             <span className="text-lg font-mono font-bold text-slate-900">
               {productionRate > 0 ? `+${productionRate.toLocaleString()}` : productionRate.toLocaleString()}
             </span>
             <span className="text-xs text-slate-500">/hour</span>
           </div>
           {nextLevelBonus && (
             <div className="mt-2 pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
               <span className="text-green-600 flex items-center gap-1">
                 <TrendingUp className="w-3 h-3" /> Next Level
               </span>
               <span className="font-mono text-green-700">+{nextLevelBonus.toLocaleString()}/h</span>
             </div>
           )}
           {energyCost !== undefined && (
             <div className="mt-2 pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
               <span className="text-yellow-600 flex items-center gap-1">
                 <Zap className="w-3 h-3" /> Energy Usage
               </span>
               <span className="font-mono text-yellow-700">-{energyCost.toLocaleString()}</span>
             </div>
           )}
         </div>
         
         <Separator />
         
         <div className="space-y-1">
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Upgrade Costs</div>
            <div className="flex items-center justify-between text-sm">
               <span className="flex items-center gap-2 text-slate-600"><Box className="w-3 h-3" /> Metal</span>
               <span className={cn("font-mono", resources.metal < metalCost ? "text-red-600 font-bold" : "text-slate-900")}>{metalCost.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
               <span className="flex items-center gap-2 text-blue-600"><Gem className="w-3 h-3" /> Crystal</span>
               <span className={cn("font-mono", resources.crystal < crystalCost ? "text-red-600 font-bold" : "text-slate-900")}>{crystalCost.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
               <span className="flex items-center gap-2 text-slate-500"><Clock className="w-3 h-3" /> Build Time</span>
               <span className="text-slate-900 font-mono">{buildTime}s</span>
            </div>
         </div>
       </CardContent>
       
       <CardFooter>
         <Button 
            className="w-full bg-primary text-white hover:bg-primary/90 font-orbitron tracking-wider"
            disabled={!canAfford}
            onClick={() => onUpgrade(id, name, buildTime * 1000)}
            data-testid={`button-upgrade-${id}`}
         >
           {canAfford ? (
             <>
               <ArrowUpCircle className="w-4 h-4 mr-2" /> UPGRADE TO LEVEL {level + 1}
             </>
           ) : (
             "INSUFFICIENT RESOURCES"
           )}
         </Button>
       </CardFooter>
    </Card>
  );
};

function toPercent(value: number, total: number): number {
  if (!Number.isFinite(value) || !Number.isFinite(total) || total <= 0) {
    return 0;
  }

  return Math.max(0, Math.min(100, (value / total) * 100));
}

export default function Resources() {
  const { buildings, resources, updateBuilding, queue, refinerySystems, upgradeRefinerySystem } = useGame();

  const buildQueue = queue.filter(q => q.type === "building");

  const production = calculateResourceProduction(buildings);
  const metalProduction = production.metal;
  const crystalProduction = production.crystal;
  const deuteriumProduction = production.deuterium;
  const energyProduction = Math.max(0, production.energy);
  const energyConsumption = Math.max(0, -production.energy);

  const storageCapacity = {
    metal: calculateStorageCapacity(10000, buildings.metalMine),
    crystal: calculateStorageCapacity(10000, buildings.crystalMine),
    deuterium: calculateStorageCapacity(10000, buildings.deuteriumSynthesizer)
  };

  const refineryCatalog: RefinerySystemDefinition[] = [
    {
      id: "metal-refinery",
      name: "Metal Refinery System",
      linkedBuilding: "metalMine",
      linkedLabel: "Metal Mine",
      imagePath: MENU_ASSETS.RESOURCES.METAL.path,
      throughputFactor: 0.42,
      baseEfficiency: 60,
      stabilizationFactor: 0.14,
      outputLabel: "Structural Alloy Feed",
      description: "Smelters, separators, and pressure furnaces turn mined ore into construction-ready alloy batches for factories and hull plating.",
      tone: {
        shell: "border-slate-200 bg-gradient-to-br from-slate-50 to-white",
        badge: "bg-slate-100 text-slate-700 border-slate-200",
        rate: "text-slate-900",
        accent: "text-slate-600",
      },
    },
    {
      id: "crystal-refinery",
      name: "Crystal Purification Grid",
      linkedBuilding: "crystalMine",
      linkedLabel: "Crystal Mine",
      imagePath: MENU_ASSETS.RESOURCES.CRYSTAL.path,
      throughputFactor: 0.38,
      baseEfficiency: 58,
      stabilizationFactor: 0.17,
      outputLabel: "Optics-Grade Crystal",
      description: "Precision cutters and resonance baths refine mined crystal into high-clarity wafers used by targeting systems and advanced research arrays.",
      tone: {
        shell: "border-blue-200 bg-gradient-to-br from-blue-50 to-white",
        badge: "bg-blue-100 text-blue-700 border-blue-200",
        rate: "text-blue-900",
        accent: "text-blue-600",
      },
    },
    {
      id: "deuterium-refinery",
      name: "Deuterium Fractionation Line",
      linkedBuilding: "deuteriumSynthesizer",
      linkedLabel: "Deuterium Synthesizer",
      imagePath: MENU_ASSETS.RESOURCES.DEUTERIUM.path,
      throughputFactor: 0.34,
      baseEfficiency: 56,
      stabilizationFactor: 0.21,
      outputLabel: "Fuel-Grade Deuterium",
      description: "Cryogenic separators and isotope filters stabilize harvested heavy hydrogen into cleaner propellant reserves for fleets and reactors.",
      tone: {
        shell: "border-green-200 bg-gradient-to-br from-green-50 to-white",
        badge: "bg-green-100 text-green-700 border-green-200",
        rate: "text-green-900",
        accent: "text-green-600",
      },
    },
  ];

  const refinerySystemsState = refineryCatalog.map((system) => {
    const level = refinerySystems[system.id] || 0;
    const linkedLevel = buildings[system.linkedBuilding] || 0;
    const linkedProduction =
      system.linkedBuilding === "metalMine"
        ? metalProduction
        : system.linkedBuilding === "crystalMine"
          ? crystalProduction
          : deuteriumProduction;
    const snapshot = getRefineryUpgradeSnapshot(system, level, linkedProduction);
    const unlocked = linkedLevel > 0;
    const maxed = level >= snapshot.maxLevel;
    const canAfford =
      resources.metal >= snapshot.cost.metal &&
      resources.crystal >= snapshot.cost.crystal &&
      resources.deuterium >= snapshot.cost.deuterium;

    return {
      ...system,
      level,
      linkedLevel,
      unlocked,
      maxed,
      canAfford,
      snapshot,
    };
  });

  const refinerySummary = {
    activeLines: refinerySystemsState.filter((system) => system.level > 0).length,
    combinedThroughput: refinerySystemsState.reduce((total, system) => total + system.snapshot.throughput, 0),
    averageEfficiency:
      refinerySystemsState.length > 0
        ? Math.round(refinerySystemsState.reduce((total, system) => total + system.snapshot.efficiency, 0) / refinerySystemsState.length)
        : 0,
    stabilizedOutput: refinerySystemsState.reduce((total, system) => total + system.snapshot.stabilization, 0),
  };

  return (
    <GameLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <section className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm bg-cover bg-center" style={{ backgroundImage: `linear-gradient(rgba(15,23,42,0.78), rgba(15,23,42,0.92)), url(${BACKGROUND_ASSETS.ASTEROID_FIELD.path})` }}>
          <div className="p-5 lg:p-6 space-y-4 text-white">
            <div className="flex items-center gap-2">
              <img src={MENU_ASSETS.RESOURCES.METAL.path} alt="Icon" className="w-8 h-8 rounded-lg border border-white/10 bg-white/10 p-1.5 object-contain" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = TEMP_THEME_IMAGE; }} />
              <h1 className="text-2xl font-bold">Resource Management</h1>
            </div>
            <p className="text-sm leading-6 text-slate-300">Manage your resource production infrastructure and storage facilities.</p>
            <div className="flex flex-wrap gap-3">
              {[{ label: "Metal", image: MENU_ASSETS.RESOURCES.METAL.path }, { label: "Crystal", image: MENU_ASSETS.RESOURCES.CRYSTAL.path }, { label: "Power Plant", image: MENU_ASSETS.BUILDINGS.POWER_PLANT.path }].map((item) => (
                <div key={item.label} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                  <img src={item.image} alt={item.label} className="w-10 h-10 rounded-lg border border-white/10 bg-black/10 p-1.5 object-contain" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = TEMP_THEME_IMAGE; }} />
                  <div className="text-sm font-semibold">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200" data-testid="card-stats-metal">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-slate-500/10 flex items-center justify-center overflow-hidden">
                  <img src={MENU_ASSETS.RESOURCES.METAL.path} alt="metal" className="w-7 h-7 object-contain" onError={(e) => { (e.target as HTMLImageElement).src = TEMP_THEME_IMAGE; }} />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground uppercase">Metal</div>
                  <div className="text-xl font-orbitron font-bold text-slate-900">{Math.floor(resources.metal).toLocaleString()}</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Production</span>
                  <span className="font-mono text-green-600">+{metalProduction}/h</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Storage</span>
                  <span className="font-mono">{storageCapacity.metal.toLocaleString()}</span>
                </div>
                <Progress value={toPercent(resources.metal, storageCapacity.metal)} className="h-1 bg-slate-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200" data-testid="card-stats-crystal">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center overflow-hidden">
                  <img src={MENU_ASSETS.RESOURCES.CRYSTAL.path} alt="crystal" className="w-7 h-7 object-contain" onError={(e) => { (e.target as HTMLImageElement).src = TEMP_THEME_IMAGE; }} />
                </div>
                <div>
                  <div className="text-xs text-blue-600 uppercase">Crystal</div>
                  <div className="text-xl font-orbitron font-bold text-blue-900">{Math.floor(resources.crystal).toLocaleString()}</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-blue-500">Production</span>
                  <span className="font-mono text-green-600">+{crystalProduction}/h</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-blue-500">Storage</span>
                  <span className="font-mono">{storageCapacity.crystal.toLocaleString()}</span>
                </div>
                <Progress value={toPercent(resources.crystal, storageCapacity.crystal)} className="h-1 bg-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200" data-testid="card-stats-deuterium">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center overflow-hidden">
                  <img src={MENU_ASSETS.RESOURCES.DEUTERIUM.path} alt="deuterium" className="w-7 h-7 object-contain" onError={(e) => { (e.target as HTMLImageElement).src = TEMP_THEME_IMAGE; }} />
                </div>
                <div>
                  <div className="text-xs text-green-600 uppercase">Deuterium</div>
                  <div className="text-xl font-orbitron font-bold text-green-900">{Math.floor(resources.deuterium).toLocaleString()}</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-green-500">Production</span>
                  <span className="font-mono text-green-600">+{deuteriumProduction}/h</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-green-500">Storage</span>
                  <span className="font-mono">{storageCapacity.deuterium.toLocaleString()}</span>
                </div>
                <Progress value={toPercent(resources.deuterium, storageCapacity.deuterium)} className="h-1 bg-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className={cn("bg-gradient-to-br border", energyProduction >= energyConsumption ? "from-yellow-50 to-yellow-100 border-yellow-200" : "from-red-50 to-red-100 border-red-200")} data-testid="card-stats-energy">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", energyProduction >= energyConsumption ? "bg-yellow-500/10" : "bg-red-500/10")}>
                  <Zap className={cn("w-5 h-5", energyProduction >= energyConsumption ? "text-yellow-600" : "text-red-600")} />
                </div>
                <div>
                  <div className={cn("text-xs uppercase", energyProduction >= energyConsumption ? "text-yellow-600" : "text-red-600")}>Energy</div>
                  <div className={cn("text-xl font-orbitron font-bold", energyProduction >= energyConsumption ? "text-yellow-900" : "text-red-900")}>
                    {Math.floor(resources.energy).toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className={energyProduction >= energyConsumption ? "text-yellow-500" : "text-red-500"}>Production</span>
                  <span className="font-mono text-green-600">+{energyProduction}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className={energyProduction >= energyConsumption ? "text-yellow-500" : "text-red-500"}>Consumption</span>
                  <span className="font-mono text-red-600">-{energyConsumption}</span>
                </div>
                <div className="flex justify-between text-xs font-bold">
                  <span className={energyProduction >= energyConsumption ? "text-yellow-700" : "text-red-700"}>Balance</span>
                  <span className={cn("font-mono", energyProduction >= energyConsumption ? "text-green-600" : "text-red-600")}>
                    {energyProduction >= energyConsumption ? "+" : ""}{energyProduction - energyConsumption}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white border-slate-200 shadow-sm" data-testid="card-projections">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-500" /> Resource Projections
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-6">
              <div className="space-y-3">
                <div className="text-xs text-muted-foreground uppercase font-bold">Timeframe</div>
                <div className="text-sm font-medium text-slate-700">In 1 Hour</div>
                <div className="text-sm font-medium text-slate-700">In 6 Hours</div>
                <div className="text-sm font-medium text-slate-700">In 24 Hours</div>
              </div>
              <div className="space-y-3">
                <div className="text-xs text-slate-500 uppercase font-bold flex items-center gap-1"><Box className="w-3 h-3" /> Metal</div>
                <div className="text-sm font-mono text-slate-900">+{metalProduction.toLocaleString()}</div>
                <div className="text-sm font-mono text-slate-900">+{(metalProduction * 6).toLocaleString()}</div>
                <div className="text-sm font-mono text-slate-900">+{(metalProduction * 24).toLocaleString()}</div>
              </div>
              <div className="space-y-3">
                <div className="text-xs text-blue-500 uppercase font-bold flex items-center gap-1"><Gem className="w-3 h-3" /> Crystal</div>
                <div className="text-sm font-mono text-slate-900">+{crystalProduction.toLocaleString()}</div>
                <div className="text-sm font-mono text-slate-900">+{(crystalProduction * 6).toLocaleString()}</div>
                <div className="text-sm font-mono text-slate-900">+{(crystalProduction * 24).toLocaleString()}</div>
              </div>
              <div className="space-y-3">
                <div className="text-xs text-green-500 uppercase font-bold flex items-center gap-1"><Database className="w-3 h-3" /> Deuterium</div>
                <div className="text-sm font-mono text-slate-900">+{deuteriumProduction.toLocaleString()}</div>
                <div className="text-sm font-mono text-slate-900">+{(deuteriumProduction * 6).toLocaleString()}</div>
                <div className="text-sm font-mono text-slate-900">+{(deuteriumProduction * 24).toLocaleString()}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {buildQueue.length > 0 && (
          <Card className="bg-white border-primary/20 shadow-sm mb-6" data-testid="card-construction-queue">
             <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                   <Hammer className="w-4 h-4" /> Construction Queue
                </CardTitle>
             </CardHeader>
             <CardContent>
                <div className="space-y-2">
                   {buildQueue.map((item, i) => {
                      const timeLeft = Math.max(0, Math.floor((item.endTime - Date.now()) / 1000));
                      const totalTime = 10;
                      return (
                         <div key={i} className="flex items-center gap-4 bg-slate-50 p-3 rounded border border-slate-100">
                            <div className="w-10 h-10 flex items-center justify-center bg-white rounded border border-slate-200">
                               <Hammer className="w-5 h-5 text-primary" />
                            </div>
                            <div className="flex-1">
                               <div className="flex justify-between text-sm font-medium text-slate-900 mb-1">
                                  <span>{item.name}</span>
                                  <span className="font-mono text-primary">{timeLeft}s remaining</span>
                               </div>
                               <Progress value={Math.max(0, 100 - (timeLeft / totalTime) * 100)} className="h-2" />
                            </div>
                         </div>
                      )
                   })}
                </div>
             </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           <BuildingCard 
              id="metalMine"
              name="Metal Mine"
              level={buildings.metalMine}
              description="Extracts metal ore from planetary deposits. Metal is the primary construction material for all structures and ships."
              icon={Box}
              iconColor="text-slate-600"
              resources={resources}
              onUpgrade={updateBuilding}
              productionRate={metalProduction}
              nextLevelBonus={Math.floor(30 * (buildings.metalMine + 1) * 1.1) - metalProduction}
              energyCost={Math.floor(10 * buildings.metalMine)}
           />
           <BuildingCard 
              id="crystalMine"
              name="Crystal Mine"
              level={buildings.crystalMine}
              description="Harvests crystalline structures essential for advanced electronics and hull alloys. Required for technology research."
              icon={Gem}
              iconColor="text-blue-600"
              resources={resources}
              onUpgrade={updateBuilding}
              productionRate={crystalProduction}
              nextLevelBonus={Math.floor(20 * (buildings.crystalMine + 1) * 1.05) - crystalProduction}
              energyCost={Math.floor(10 * buildings.crystalMine)}
           />
           <BuildingCard 
              id="deuteriumSynthesizer"
              name="Deuterium Synthesizer"
              level={buildings.deuteriumSynthesizer}
              description="Separates heavy hydrogen isotopes from seawater. Deuterium powers ship engines and fusion reactors."
              icon={Database}
              iconColor="text-green-600"
              resources={resources}
              onUpgrade={updateBuilding}
              productionRate={deuteriumProduction}
              nextLevelBonus={Math.floor(10 * (buildings.deuteriumSynthesizer + 1) * 1.02) - deuteriumProduction}
              energyCost={Math.floor(10 * buildings.deuteriumSynthesizer)}
           />
           <BuildingCard 
              id="solarPlant"
              name="Solar Power Plant"
              level={buildings.solarPlant}
              description="Converts solar radiation into electrical energy. Powers all mining operations and planetary infrastructure."
              icon={Zap}
              iconColor="text-yellow-600"
              resources={resources}
              onUpgrade={updateBuilding}
              productionRate={energyProduction}
              nextLevelBonus={Math.floor(20 * (buildings.solarPlant + 1)) - energyProduction}
           />
        </div>

        <Card className="bg-white border-slate-200 shadow-sm" data-testid="card-refinery-systems">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <Factory className="w-4 h-4 text-primary" /> Refinery Systems
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Mining networks now feed dedicated refinery lines that clean, stabilize, and package raw extraction output for downstream industry.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs uppercase tracking-widest text-muted-foreground">Active Lines</div>
                <div className="mt-1 text-2xl font-orbitron font-bold text-slate-900">{refinerySummary.activeLines}</div>
                <div className="text-xs text-muted-foreground">Mining-linked refinery systems online</div>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs uppercase tracking-widest text-muted-foreground">Combined Throughput</div>
                <div className="mt-1 text-2xl font-orbitron font-bold text-slate-900">{refinerySummary.combinedThroughput.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Processed material per hour</div>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs uppercase tracking-widest text-muted-foreground">Average Efficiency</div>
                <div className="mt-1 text-2xl font-orbitron font-bold text-slate-900">{refinerySummary.averageEfficiency}%</div>
                <div className="text-xs text-muted-foreground">{refinerySummary.stabilizedOutput.toLocaleString()} units stabilized per hour</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {refinerySystemsState.map((system) => (
                <Card key={system.id} className={cn("shadow-sm", system.tone.shell)} data-testid={`card-${system.id}`}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/70 bg-white shadow-sm">
                          <img
                            src={system.imagePath}
                            alt={system.name}
                            className="h-8 w-8 object-contain"
                            onError={(e) => { (e.target as HTMLImageElement).src = TEMP_THEME_IMAGE; }}
                          />
                        </div>
                        <div>
                          <CardTitle className={cn("text-base font-orbitron", system.tone.rate)}>{system.name}</CardTitle>
                          <div className="text-xs text-muted-foreground">{system.linkedLabel} Level {system.linkedLevel} • Refinery Level {system.level}</div>
                        </div>
                      </div>
                      <Badge variant="outline" className={system.tone.badge}>
                        {getRefineryStage(system.level)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{system.description}</p>

                    <div className="rounded-lg border border-white/70 bg-white/80 p-3">
                      <div className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">Processing Output</div>
                      <div className="flex items-end justify-between gap-3">
                        <div className={cn("text-2xl font-orbitron font-bold", system.tone.rate)}>
                          {system.snapshot.throughput.toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground">/hour</div>
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground">{system.outputLabel}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-lg border border-white/70 bg-white/70 p-3">
                        <div className="text-xs uppercase tracking-widest text-muted-foreground">Efficiency</div>
                        <div className={cn("mt-1 text-lg font-bold", system.tone.rate)}>{system.snapshot.efficiency}%</div>
                      </div>
                      <div className="rounded-lg border border-white/70 bg-white/70 p-3">
                        <div className="text-xs uppercase tracking-widest text-muted-foreground">Stabilized Flow</div>
                        <div className={cn("mt-1 text-lg font-bold", system.tone.rate)}>{system.snapshot.stabilization.toLocaleString()}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="rounded-lg border border-slate-200 bg-white/70 p-3">
                        <div className="text-xs uppercase tracking-widest text-muted-foreground">Next Throughput</div>
                        <div className={cn("mt-1 font-semibold", system.tone.rate)}>{system.snapshot.nextThroughput.toLocaleString()}/h</div>
                      </div>
                      <div className="rounded-lg border border-slate-200 bg-white/70 p-3">
                        <div className="text-xs uppercase tracking-widest text-muted-foreground">Next Efficiency</div>
                        <div className={cn("mt-1 font-semibold", system.tone.rate)}>{system.snapshot.nextEfficiency}%</div>
                      </div>
                    </div>

                    <div className="rounded-lg border border-slate-200 bg-white/70 p-3 text-sm">
                      <div className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">Upgrade Costs</div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600">Metal</span>
                          <span className={cn(resources.metal < system.snapshot.cost.metal ? "font-bold text-red-600" : "text-slate-900")}>
                            {system.snapshot.cost.metal.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600">Crystal</span>
                          <span className={cn(resources.crystal < system.snapshot.cost.crystal ? "font-bold text-red-600" : "text-slate-900")}>
                            {system.snapshot.cost.crystal.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600">Deuterium</span>
                          <span className={cn(resources.deuterium < system.snapshot.cost.deuterium ? "font-bold text-red-600" : "text-slate-900")}>
                            {system.snapshot.cost.deuterium.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                          <span>Upgrade Time</span>
                          <span>{system.snapshot.buildTimeSeconds}s</span>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg border border-dashed border-slate-200 bg-white/60 p-3 text-sm text-slate-600">
                      <span className={cn("font-semibold", system.tone.accent)}>Refinery tie-in:</span> Upgrading the linked mining system expands this line's processing capacity automatically.
                    </div>

                    {!system.unlocked && (
                      <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                        Requires {system.linkedLabel} Level 1 to bring this refinery online.
                      </div>
                    )}

                    <Button
                      className="w-full font-orbitron tracking-wider"
                      disabled={!system.unlocked || !system.canAfford || system.maxed}
                      onClick={() =>
                        upgradeRefinerySystem(
                          system.id,
                          system.name,
                          system.snapshot.cost,
                          system.snapshot.buildTimeSeconds * 1000,
                        )
                      }
                    >
                      {system.maxed
                        ? "MAX LEVEL"
                        : !system.unlocked
                          ? "LINKED MINE REQUIRED"
                          : system.canAfford
                            ? `UPGRADE TO LEVEL ${system.level + 1}`
                            : "INSUFFICIENT RESOURCES"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-50 border-slate-200" data-testid="card-storage-info">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <Warehouse className="w-4 h-4 text-slate-500" /> Storage Facilities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded border border-slate-200">
                <div className="flex items-center gap-2 mb-2">
                  <Box className="w-4 h-4 text-slate-600" />
                  <span className="text-sm font-bold text-slate-900">Metal Storage</span>
                </div>
                <div className="text-2xl font-mono font-bold text-slate-900 mb-1">{storageCapacity.metal.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Current: {Math.floor(resources.metal).toLocaleString()} ({Math.floor((resources.metal / storageCapacity.metal) * 100)}%)</div>
                <Progress value={(resources.metal / storageCapacity.metal) * 100} className="h-2 mt-2 bg-slate-200" />
              </div>
              <div className="bg-white p-4 rounded border border-slate-200">
                <div className="flex items-center gap-2 mb-2">
                  <Gem className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-bold text-slate-900">Crystal Storage</span>
                </div>
                <div className="text-2xl font-mono font-bold text-slate-900 mb-1">{storageCapacity.crystal.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Current: {Math.floor(resources.crystal).toLocaleString()} ({Math.floor((resources.crystal / storageCapacity.crystal) * 100)}%)</div>
                <Progress value={(resources.crystal / storageCapacity.crystal) * 100} className="h-2 mt-2 bg-blue-200" />
              </div>
              <div className="bg-white p-4 rounded border border-slate-200">
                <div className="flex items-center gap-2 mb-2">
                  <Database className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-bold text-slate-900">Deuterium Tanks</span>
                </div>
                <div className="text-2xl font-mono font-bold text-slate-900 mb-1">{storageCapacity.deuterium.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Current: {Math.floor(resources.deuterium).toLocaleString()} ({Math.floor((resources.deuterium / storageCapacity.deuterium) * 100)}%)</div>
                <Progress value={(resources.deuterium / storageCapacity.deuterium) * 100} className="h-2 mt-2 bg-green-200" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </GameLayout>
  );
}
