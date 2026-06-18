import GameLayout from "@/components/layout/GameLayout";
import { useGame } from "@/lib/gameContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Box, Gem, Database, Zap, ArrowUpCircle, Hammer, Clock, TrendingUp, Warehouse, Info, ChevronRight, BarChart3 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

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
  const metalCost = Math.floor(100 * Math.pow(1.5, level));
  const crystalCost = Math.floor(50 * Math.pow(1.5, level));
  const buildTime = (level + 1) * 10;

  const canAfford = resources.metal >= metalCost && resources.crystal >= crystalCost;

  return (
    <Card className="bg-white border-slate-200 hover:border-primary/50 transition-all group overflow-hidden shadow-sm" data-testid={`card-building-${id}`}>
       <div className="h-36 bg-gradient-to-br from-slate-50 to-slate-100 relative group-hover:from-slate-100 group-hover:to-slate-200 transition-colors duration-500 border-b border-slate-200">
          <div className="absolute inset-0 flex items-center justify-center">
            <Icon className={cn("w-20 h-20 opacity-20", iconColor || "text-slate-400")} />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Icon className={cn("w-16 h-16 transition-transform group-hover:scale-110", iconColor || "text-slate-500")} />
          </div>
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

export default function Resources() {
  const { buildings, resources, updateBuilding, queue } = useGame();

  const buildQueue = queue.filter(q => q.type === "building");

  const metalProduction = Math.floor(30 * buildings.metalMine * 1.1);
  const crystalProduction = Math.floor(20 * buildings.crystalMine * 1.05);
  const deuteriumProduction = Math.floor(10 * buildings.deuteriumSynthesizer * 1.02);
  const energyProduction = Math.floor(20 * buildings.solarPlant);
  const energyConsumption = Math.floor(10 * (buildings.metalMine + buildings.crystalMine + buildings.deuteriumSynthesizer));

  const storageCapacity = {
    metal: Math.floor(10000 * Math.pow(1.5, buildings.metalMine)),
    crystal: Math.floor(10000 * Math.pow(1.5, buildings.crystalMine)),
    deuterium: Math.floor(10000 * Math.pow(1.5, buildings.deuteriumSynthesizer))
  };

  return (
    <GameLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-orbitron font-bold text-slate-900">Resource Management</h2>
            <p className="text-muted-foreground font-rajdhani text-lg">Manage your resource production infrastructure and storage facilities.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200" data-testid="card-stats-metal">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-slate-500/10 flex items-center justify-center">
                  <Box className="w-5 h-5 text-slate-600" />
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
                <Progress value={(resources.metal / storageCapacity.metal) * 100} className="h-1 bg-slate-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200" data-testid="card-stats-crystal">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Gem className="w-5 h-5 text-blue-600" />
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
                <Progress value={(resources.crystal / storageCapacity.crystal) * 100} className="h-1 bg-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200" data-testid="card-stats-deuterium">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                  <Database className="w-5 h-5 text-green-600" />
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
                <Progress value={(resources.deuterium / storageCapacity.deuterium) * 100} className="h-1 bg-green-200" />
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
