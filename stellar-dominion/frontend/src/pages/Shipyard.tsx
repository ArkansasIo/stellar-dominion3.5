import GameLayout from "@/components/layout/GameLayout";
import { useGame } from "@/lib/gameContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Box, Gem, Database, Plus, Info, Shield, Sword, Zap, User, Truck, Clock, 
  Hammer, Skull, Hexagon, TrendingUp, Target, Rocket, BarChart3, Lock, ChevronRight
} from "lucide-react";
import { useState, useEffect } from "react";
import { unitData, UnitItem } from "@/lib/unitData";
import { cn } from "@/lib/utils";

const UnitCard = ({ 
  item, 
  count, 
  onBuild, 
  resources,
  buildings 
}: { 
  item: UnitItem, 
  count: number, 
  onBuild: (id: string, amount: number, name: string, time: number) => void, 
  resources: any,
  buildings: any
}) => {
  const [amount, setAmount] = useState(1);
  const Icon = item.icon;
  
  const totalMetal = item.cost.metal * amount;
  const totalCrystal = item.cost.crystal * amount;
  const totalDeut = item.cost.deuterium * amount;
  
  const buildTime = 2000;

  const requiredShipyard = item.class === "titan" ? 12 : item.class === "super" ? 8 : item.class === "capital" ? 4 : 1;
  const meetsRequirement = (buildings?.shipyard || 0) >= requiredShipyard;

  const canAfford = 
    resources.metal >= totalMetal && 
    resources.crystal >= totalCrystal && 
    resources.deuterium >= totalDeut;

  const canBuild = canAfford && meetsRequirement;

  const totalPower = item.stats.attack + item.stats.shield + (item.stats.structure / 10);

  return (
    <Card className={cn("bg-white border-slate-200 hover:border-primary/50 transition-all group overflow-hidden shadow-sm flex flex-col h-full", !meetsRequirement && "opacity-60")} data-testid={`card-unit-${item.id}`}>
       <div className={cn("h-28 bg-gradient-to-br from-slate-50 to-slate-100 relative border-b border-slate-200", item.class === "titan" && "from-red-50 to-red-100", item.class === "super" && "from-purple-50 to-purple-100")}>
          <div className="absolute inset-0 flex items-center justify-center">
            <Icon className={cn("w-14 h-14 text-slate-300 group-hover:text-primary/30 transition-colors", item.class === "titan" && "text-red-300", item.class === "super" && "text-purple-300")} />
          </div>
          <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded text-xs font-mono text-primary border border-slate-200 shadow-sm">
            Owned: {count}
          </div>
          <div className="absolute top-2 left-2">
            <Badge variant="outline" className={cn("text-[10px] uppercase", item.class === "titan" ? "border-red-200 text-red-600 bg-red-50" : item.class === "super" ? "border-purple-200 text-purple-600 bg-purple-50" : "border-slate-200 text-slate-500 bg-white")}>
              {item.class}
            </Badge>
          </div>
          {!meetsRequirement && (
            <div className="absolute bottom-2 left-2">
              <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200 text-[10px]">
                <Lock className="w-2 h-2 mr-1" /> Shipyard Lvl {requiredShipyard}
              </Badge>
            </div>
          )}
       </div>
       
       <CardHeader className="pb-2">
         <CardTitle className="text-base font-orbitron text-slate-900">{item.name}</CardTitle>
       </CardHeader>
       
       <CardContent className="pb-2 flex-1 space-y-3">
         <p className="text-xs text-muted-foreground min-h-[2rem]">{item.description}</p>
         
         <div className="bg-slate-50 p-2 rounded border border-slate-100">
           <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[10px] uppercase tracking-wider text-slate-500">
              <div className="flex items-center gap-1"><Shield className="w-3 h-3 text-blue-500" /> Hull: <span className="text-slate-900 font-mono">{item.stats.structure.toLocaleString()}</span></div>
              <div className="flex items-center gap-1"><Sword className="w-3 h-3 text-red-500" /> Atk: <span className="text-slate-900 font-mono">{item.stats.attack.toLocaleString()}</span></div>
              <div className="flex items-center gap-1"><Shield className="w-3 h-3 text-green-500" /> Shld: <span className="text-slate-900 font-mono">{item.stats.shield.toLocaleString()}</span></div>
              <div className="flex items-center gap-1"><Rocket className="w-3 h-3 text-purple-500" /> Spd: <span className="text-slate-900 font-mono">{item.stats.speed.toLocaleString()}</span></div>
           </div>
           <div className="mt-2 pt-2 border-t border-slate-200 flex items-center justify-between text-[10px]">
             <span className="text-slate-500 flex items-center gap-1"><Target className="w-3 h-3" /> Combat Power</span>
             <span className="font-mono font-bold text-primary">{Math.floor(totalPower).toLocaleString()}</span>
           </div>
         </div>

         <Separator />

         <div className="space-y-1">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Cost per unit</div>
            {item.cost.metal > 0 && (
              <div className="flex items-center justify-between text-xs text-slate-600">
                 <span className="flex items-center gap-1"><Box className="w-3 h-3" /> Metal</span>
                 <span className={cn("font-mono", resources.metal < totalMetal ? "text-red-600 font-bold" : "text-slate-900")}>{item.cost.metal.toLocaleString()}</span>
              </div>
            )}
            {item.cost.crystal > 0 && (
              <div className="flex items-center justify-between text-xs text-blue-600">
                 <span className="flex items-center gap-1"><Gem className="w-3 h-3" /> Crystal</span>
                 <span className={cn("font-mono", resources.crystal < totalCrystal ? "text-red-600 font-bold" : "text-slate-900")}>{item.cost.crystal.toLocaleString()}</span>
              </div>
            )}
            {item.cost.deuterium > 0 && (
              <div className="flex items-center justify-between text-xs text-green-600">
                 <span className="flex items-center gap-1"><Database className="w-3 h-3" /> Deuterium</span>
                 <span className={cn("font-mono", resources.deuterium < totalDeut ? "text-red-600 font-bold" : "text-slate-900")}>{item.cost.deuterium.toLocaleString()}</span>
              </div>
            )}
         </div>

         <div className="flex gap-2 pt-2">
            <Input 
              type="number" 
              min="1" 
              max="1000"
              value={amount}
              onChange={(e) => setAmount(Math.max(1, parseInt(e.target.value) || 1))}
              className="bg-slate-50 border-slate-200 h-8 text-xs font-mono text-slate-900"
              data-testid={`input-amount-${item.id}`}
            />
            <div className="flex gap-1">
              {[1, 10, 100].map(n => (
                <Button key={n} variant="ghost" size="sm" className="h-8 px-2 text-xs" onClick={() => setAmount(n)}>{n}</Button>
              ))}
            </div>
         </div>

         {amount > 1 && (
           <div className="text-[10px] text-muted-foreground bg-slate-50 p-2 rounded">
             Total: {(totalMetal).toLocaleString()} M / {(totalCrystal).toLocaleString()} C / {(totalDeut).toLocaleString()} D
           </div>
         )}
       </CardContent>
       
       <CardFooter>
         <Button 
            className="w-full bg-primary text-white hover:bg-primary/90 font-orbitron text-xs h-9"
            disabled={!canBuild}
            onClick={() => onBuild(item.id, amount, item.name, buildTime)}
            data-testid={`button-build-${item.id}`}
         >
           {!meetsRequirement ? (
             <><Lock className="w-3 h-3 mr-2" /> LOCKED</>
           ) : canAfford ? (
             <>
               <Plus className="w-3 h-3 mr-2" /> BUILD {amount > 1 ? `${amount}x` : ""}
             </>
           ) : (
             "NO RESOURCES"
           )}
         </Button>
       </CardFooter>
    </Card>
  );
};

export default function Shipyard() {
  const { units, resources, buildUnit, queue, buildings } = useGame();

  const combatShips = unitData.filter(u => u.class === "fighter" || u.class === "capital");
  const civilShips = unitData.filter(u => u.class === "civilian");
  const troops = unitData.filter(u => u.class === "troop");
  const vehicles = unitData.filter(u => u.class === "vehicle");
  const supers = unitData.filter(u => u.class === "super");
  const titans = unitData.filter(u => u.class === "titan");

  const unitQueue = queue.filter(q => q.type === "unit");

  const totalFleetPower = Object.entries(units).reduce((sum, [id, count]) => {
    const unit = unitData.find(u => u.id === id);
    if (!unit) return sum;
    const power = unit.stats.attack + unit.stats.shield + (unit.stats.structure / 10);
    return sum + (power * count);
  }, 0);

  const totalShips = Object.values(units).reduce((a, b) => a + b, 0);

  return (
    <GameLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
          <h2 className="text-3xl font-orbitron font-bold text-slate-900">Orbital Shipyard</h2>
          <p className="text-muted-foreground font-rajdhani text-lg">Construct fleets, recruit personnel, and build ground vehicles.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200" data-testid="card-stats-fleet-power">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Target className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-xs text-blue-600 uppercase">Total Fleet Power</div>
                  <div className="text-xl font-orbitron font-bold text-blue-900">{Math.floor(totalFleetPower).toLocaleString()}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200" data-testid="card-stats-total-ships">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-500/10 flex items-center justify-center">
                  <Rocket className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <div className="text-xs text-slate-600 uppercase">Total Ships</div>
                  <div className="text-xl font-orbitron font-bold text-slate-900">{totalShips.toLocaleString()}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200" data-testid="card-stats-shipyard">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center">
                  <Hammer className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <div className="text-xs text-orange-600 uppercase">Shipyard Level</div>
                  <div className="text-xl font-orbitron font-bold text-orange-900">{buildings?.shipyard || 0}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200" data-testid="card-stats-in-production">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="text-xs text-green-600 uppercase">In Production</div>
                  <div className="text-xl font-orbitron font-bold text-green-900">{unitQueue.reduce((acc, q) => acc + (q.amount || 1), 0)}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {unitQueue.length > 0 && (
          <Card className="bg-white border-primary/20 shadow-sm" data-testid="card-production-queue">
             <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                   <Hammer className="w-4 h-4" /> Production Queue
                </CardTitle>
             </CardHeader>
             <CardContent>
                <div className="space-y-2">
                   {unitQueue.map((item, i) => {
                      const timeLeft = Math.max(0, Math.floor((item.endTime - Date.now()) / 1000));
                      return (
                         <div key={i} className="flex items-center gap-4 bg-slate-50 p-3 rounded border border-slate-100">
                            <div className="w-10 h-10 flex items-center justify-center bg-white rounded border border-slate-200">
                               <Rocket className="w-5 h-5 text-primary" />
                            </div>
                            <div className="flex-1">
                               <div className="flex justify-between text-sm font-medium text-slate-900 mb-1">
                                  <span>{item.amount}x {item.name}</span>
                                  <span className="font-mono text-primary">{timeLeft}s remaining</span>
                               </div>
                               <Progress value={Math.max(0, 100 - (timeLeft / 2) * 100)} className="h-2" />
                            </div>
                         </div>
                      )
                   })}
                </div>
             </CardContent>
          </Card>
        )}

        <Tabs defaultValue="combat" className="w-full">
          <TabsList className="bg-white border border-slate-200 h-12 w-full justify-start overflow-x-auto">
            <TabsTrigger value="combat" className="font-orbitron" data-testid="tab-combat"><Sword className="w-4 h-4 mr-2" /> Combat Fleet</TabsTrigger>
            <TabsTrigger value="civil" className="font-orbitron" data-testid="tab-civil"><Box className="w-4 h-4 mr-2" /> Civil Ships</TabsTrigger>
            <TabsTrigger value="troops" className="font-orbitron" data-testid="tab-troops"><User className="w-4 h-4 mr-2" /> Personnel</TabsTrigger>
            <TabsTrigger value="vehicles" className="font-orbitron" data-testid="tab-vehicles"><Truck className="w-4 h-4 mr-2" /> Vehicles</TabsTrigger>
            <TabsTrigger value="super" className="font-orbitron text-purple-600" data-testid="tab-super"><Zap className="w-4 h-4 mr-2" /> Super Capital</TabsTrigger>
            <TabsTrigger value="titan" className="font-orbitron text-red-600 font-bold border-red-200 bg-red-50" data-testid="tab-titan"><Hexagon className="w-4 h-4 mr-2" /> TITANS</TabsTrigger>
          </TabsList>

          <div className="mt-6">
             <TabsContent value="combat" className="mt-0">
               <Card className="mb-6 bg-slate-50 border-slate-200" data-testid="card-combat-info">
                 <CardContent className="p-4">
                   <div className="flex items-center gap-4">
                     <Sword className="w-8 h-8 text-slate-400" />
                     <div>
                       <div className="font-bold text-slate-900">Combat Fleet</div>
                       <div className="text-sm text-slate-500">Fighters and capital ships for offensive and defensive operations. Upgrade your Shipyard to unlock advanced vessels.</div>
                     </div>
                   </div>
                 </CardContent>
               </Card>
               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                 {combatShips.map(item => (
                    <UnitCard key={item.id} item={item} count={units[item.id] || 0} onBuild={buildUnit} resources={resources} buildings={buildings} />
                 ))}
               </div>
             </TabsContent>

             <TabsContent value="civil" className="mt-0">
               <Card className="mb-6 bg-blue-50 border-blue-200" data-testid="card-civil-info">
                 <CardContent className="p-4">
                   <div className="flex items-center gap-4">
                     <Box className="w-8 h-8 text-blue-400" />
                     <div>
                       <div className="font-bold text-slate-900">Civilian Fleet</div>
                       <div className="text-sm text-blue-700">Transport, colonization, and resource gathering vessels. Essential for empire expansion and logistics.</div>
                     </div>
                   </div>
                 </CardContent>
               </Card>
               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                 {civilShips.map(item => (
                    <UnitCard key={item.id} item={item} count={units[item.id] || 0} onBuild={buildUnit} resources={resources} buildings={buildings} />
                 ))}
               </div>
             </TabsContent>

             <TabsContent value="troops" className="mt-0">
               <Card className="mb-6 bg-green-50 border-green-200" data-testid="card-troops-info">
                 <CardContent className="p-4">
                   <div className="flex items-center gap-4">
                     <User className="w-8 h-8 text-green-400" />
                     <div>
                       <div className="font-bold text-slate-900">Military Personnel</div>
                       <div className="text-sm text-green-700">Ground forces for planetary invasion and defense. Infantry, medics, engineers, and special operations units.</div>
                     </div>
                   </div>
                 </CardContent>
               </Card>
               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                 {troops.map(item => (
                    <UnitCard key={item.id} item={item} count={units[item.id] || 0} onBuild={buildUnit} resources={resources} buildings={buildings} />
                 ))}
               </div>
             </TabsContent>

             <TabsContent value="vehicles" className="mt-0">
               <Card className="mb-6 bg-orange-50 border-orange-200" data-testid="card-vehicles-info">
                 <CardContent className="p-4">
                   <div className="flex items-center gap-4">
                     <Truck className="w-8 h-8 text-orange-400" />
                     <div>
                       <div className="font-bold text-slate-900">Ground Vehicles</div>
                       <div className="text-sm text-orange-700">Armored vehicles, artillery, and mobile platforms for ground combat superiority.</div>
                     </div>
                   </div>
                 </CardContent>
               </Card>
               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                 {vehicles.map(item => (
                    <UnitCard key={item.id} item={item} count={units[item.id] || 0} onBuild={buildUnit} resources={resources} buildings={buildings} />
                 ))}
               </div>
             </TabsContent>

             <TabsContent value="super" className="mt-0">
               <Card className="mb-6 bg-purple-100 border-purple-300" data-testid="card-super-info">
                 <CardContent className="p-4">
                   <div className="flex items-center gap-4">
                     <Zap className="w-8 h-8 text-purple-500" />
                     <div>
                       <div className="font-bold text-purple-900">Super Capital Ships</div>
                       <div className="text-sm text-purple-700">Massive warships capable of devastating firepower. Requires Shipyard Level 8 to construct.</div>
                     </div>
                     <Badge className="ml-auto bg-purple-600">ADVANCED</Badge>
                   </div>
                 </CardContent>
               </Card>
               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                 {supers.map(item => (
                    <UnitCard key={item.id} item={item} count={units[item.id] || 0} onBuild={buildUnit} resources={resources} buildings={buildings} />
                 ))}
               </div>
             </TabsContent>

             <TabsContent value="titan" className="mt-0">
               <Card className="mb-6 bg-red-100 border-red-300" data-testid="card-titan-info">
                 <CardContent className="p-4">
                   <div className="flex items-center gap-4">
                     <Hexagon className="w-10 h-10 text-red-600" />
                     <div>
                       <div className="font-orbitron font-bold text-red-900 text-lg">TITAN CLASS</div>
                       <div className="text-sm text-red-700">The ultimate expression of military might. These planet-killer class vessels require Shipyard Level 12 and massive resources to construct. Only one may exist per empire.</div>
                     </div>
                     <Badge className="ml-auto bg-red-600 animate-pulse">LEGENDARY</Badge>
                   </div>
                 </CardContent>
               </Card>
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 {titans.map(item => (
                    <UnitCard key={item.id} item={item} count={units[item.id] || 0} onBuild={buildUnit} resources={resources} buildings={buildings} />
                 ))}
               </div>
             </TabsContent>
          </div>
        </Tabs>
      </div>
    </GameLayout>
  );
}
