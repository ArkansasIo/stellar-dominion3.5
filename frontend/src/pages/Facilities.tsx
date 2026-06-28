import GameLayout from "@/components/layout/GameLayout";
import { useGame } from "@/lib/gameContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Factory, FlaskConical, Rocket, Shield, ArrowUpCircle, Box, Gem, Hammer, Clock, 
  Satellite, Moon, Globe, TrendingUp, Lock, Info, Zap, BarChart3, ChevronRight
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ORBITAL_BUILDINGS, StationBuilding } from "@/lib/stationData";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

type FacilityBase = "planet" | "moon" | "station";

const FacilityCard = ({ 
  id, 
  name, 
  level, 
  description, 
  icon: Icon, 
  onUpgrade, 
  resources,
  customCost,
  effect,
  nextEffect,
  requirement,
  requirementMet,
  iconColor
}: any) => {
  const baseMetal = customCost ? customCost.metal : 200;
  const baseCrystal = customCost ? customCost.crystal : 100;
  const baseDeut = customCost ? customCost.deuterium : 0;
  
  const metalCost = Math.floor(baseMetal * Math.pow(2, level));
  const crystalCost = Math.floor(baseCrystal * Math.pow(2, level));
  const deuteriumCost = Math.floor(baseDeut * Math.pow(2, level));
  
  const buildTime = (level + 1) * 20;

  const canAfford = resources.metal >= metalCost && resources.crystal >= crystalCost && resources.deuterium >= deuteriumCost;
  const canBuild = canAfford && (requirementMet !== false);

  return (
    <Card className={cn("bg-white border-slate-200 hover:border-primary/50 transition-all group overflow-hidden shadow-sm flex flex-col h-full", !requirementMet && requirementMet !== undefined && "opacity-60")} data-testid={`card-facility-${id}`}>
       <div className={cn("h-36 bg-gradient-to-br from-slate-50 to-slate-100 relative group-hover:from-slate-100 group-hover:to-slate-200 transition-colors duration-500 border-b border-slate-200")}>
          <div className="absolute inset-0 flex items-center justify-center">
            <Icon className={cn("w-20 h-20 opacity-20", iconColor || "text-slate-400")} />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Icon className={cn("w-16 h-16 transition-transform group-hover:scale-110", iconColor || "text-slate-500")} />
          </div>
          <div className="absolute bottom-2 right-2 bg-white px-3 py-1.5 rounded text-sm font-orbitron text-primary border border-slate-200 shadow-sm">
            Level {level}
          </div>
          {requirement && !requirementMet && (
            <div className="absolute top-2 left-2">
              <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200 text-xs">
                <Lock className="w-3 h-3 mr-1" /> Locked
              </Badge>
            </div>
          )}
       </div>
       
       <CardHeader className="pb-2">
         <CardTitle className="text-lg font-orbitron text-slate-900 group-hover:text-primary transition-colors">{name}</CardTitle>
       </CardHeader>
       
       <CardContent className="pb-2 flex-1 space-y-3">
         <p className="text-sm text-muted-foreground">{description}</p>
         
         {effect && (
           <div className="bg-slate-50 p-3 rounded border border-slate-100">
             <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-1">
               <BarChart3 className="w-3 h-3" /> Current Effect
             </div>
             <div className="text-sm font-medium text-slate-900">{effect}</div>
             {nextEffect && level > 0 && (
               <div className="mt-2 pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                 <span className="text-green-600 flex items-center gap-1">
                   <TrendingUp className="w-3 h-3" /> Next Level
                 </span>
                 <span className="font-medium text-green-700">{nextEffect}</span>
               </div>
             )}
           </div>
         )}
         
         {requirement && !requirementMet && (
           <div className="bg-red-50 p-3 rounded border border-red-200 text-xs text-red-700">
             <div className="font-bold mb-1 flex items-center gap-1">
               <Lock className="w-3 h-3" /> Requirement Not Met
             </div>
             {requirement}
           </div>
         )}
         
         <Separator />
         
         <div className="space-y-1">
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Upgrade Costs</div>
            {metalCost > 0 && (
              <div className="flex items-center justify-between text-sm">
                 <span className="flex items-center gap-2 text-slate-600"><Box className="w-3 h-3" /> Metal</span>
                 <span className={cn("font-mono", resources.metal < metalCost ? "text-red-600 font-bold" : "text-slate-900")}>{metalCost.toLocaleString()}</span>
              </div>
            )}
            {crystalCost > 0 && (
              <div className="flex items-center justify-between text-sm">
                 <span className="flex items-center gap-2 text-blue-600"><Gem className="w-3 h-3" /> Crystal</span>
                 <span className={cn("font-mono", resources.crystal < crystalCost ? "text-red-600 font-bold" : "text-slate-900")}>{crystalCost.toLocaleString()}</span>
              </div>
            )}
            {deuteriumCost > 0 && (
              <div className="flex items-center justify-between text-sm">
                 <span className="flex items-center gap-2 text-green-600"><FlaskConical className="w-3 h-3" /> Deuterium</span>
                 <span className={cn("font-mono", resources.deuterium < deuteriumCost ? "text-red-600 font-bold" : "text-slate-900")}>{deuteriumCost.toLocaleString()}</span>
              </div>
            )}
            <div className="flex items-center justify-between text-sm">
               <span className="flex items-center gap-2 text-slate-500"><Clock className="w-3 h-3" /> Build Time</span>
               <span className="text-slate-900 font-mono">{buildTime}s</span>
            </div>
         </div>
       </CardContent>
       
       <CardFooter>
         <Button 
            className="w-full bg-primary text-white hover:bg-primary/90 font-orbitron tracking-wider"
            disabled={!canBuild}
            onClick={() => onUpgrade(id, name, buildTime * 1000)}
            data-testid={`button-upgrade-${id}`}
         >
           {!requirementMet && requirementMet !== undefined ? (
             <><Lock className="w-4 h-4 mr-2" /> REQUIREMENTS NOT MET</>
           ) : canAfford ? (
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

export default function Facilities() {
  const { buildings, orbitalBuildings, resources, updateBuilding, queue, activeBase, setActiveBase, research } = useGame();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const baseParam = params.get("tab") || params.get("base");
    if (baseParam === "planet" || baseParam === "moon" || baseParam === "station") {
      setActiveBase(baseParam as FacilityBase);
    }
  }, [setActiveBase]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set("tab", activeBase);
    params.delete("base");

    const nextUrl = `/facilities?${params.toString()}`;
    const currentUrl = `${window.location.pathname}${window.location.search}`;

    if (currentUrl !== nextUrl) {
      window.history.replaceState(null, "", nextUrl);
    }
  }, [activeBase]);
  
  const buildQueue = queue.filter(q => q.type === "building");

  const moonBuildings = ORBITAL_BUILDINGS.filter(b => b.type === "moon");
  const stationBuildings = ORBITAL_BUILDINGS.filter(b => b.type === "station");

  const getFacilityEffect = (id: string, level: number) => {
    switch (id) {
      case "roboticsFactory":
        return {
          effect: level > 0 ? `-${(level * 10)}% construction time` : "No bonus yet",
          nextEffect: `-${((level + 1) * 10)}% construction time`
        };
      case "shipyard":
        return {
          effect: level > 0 ? `Can build ships up to tier ${Math.min(level, 5)}` : "No ships available",
          nextEffect: `Can build ships up to tier ${Math.min(level + 1, 5)}`
        };
      case "researchLab":
        return {
          effect: level > 0 ? `-${(level * 5)}% research time` : "Research unavailable",
          nextEffect: `-${((level + 1) * 5)}% research time`
        };
      default:
        return { effect: null, nextEffect: null };
    }
  };

  const totalBuildingsLevel = Object.values(buildings).reduce((a, b) => a + b, 0);
  const totalOrbitalLevel = Object.values(orbitalBuildings).reduce((a, b) => a + b, 0);

  return (
    <GameLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-between">
           <div>
             <h2 className="text-3xl font-orbitron font-bold text-slate-900">Infrastructure</h2>
             <p className="text-muted-foreground font-rajdhani text-lg">Manage surface facilities, lunar bases, and orbital stations.</p>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200" data-testid="card-stats-surface">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-xs text-blue-600 uppercase">Surface Level</div>
                  <div className="text-xl font-orbitron font-bold text-blue-900">{buildings.roboticsFactory + buildings.shipyard + buildings.researchLab}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200" data-testid="card-stats-moon">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-500/10 flex items-center justify-center">
                  <Moon className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <div className="text-xs text-slate-600 uppercase">Lunar Level</div>
                  <div className="text-xl font-orbitron font-bold text-slate-900">
                    {moonBuildings.reduce((acc, b) => acc + (orbitalBuildings[b.id] || 0), 0)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200" data-testid="card-stats-orbital">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                  <Satellite className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <div className="text-xs text-purple-600 uppercase">Orbital Level</div>
                  <div className="text-xl font-orbitron font-bold text-purple-900">
                    {stationBuildings.reduce((acc, b) => acc + (orbitalBuildings[b.id] || 0), 0)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200" data-testid="card-stats-total">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                  <Factory className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="text-xs text-green-600 uppercase">Total Infrastructure</div>
                  <div className="text-xl font-orbitron font-bold text-green-900">{totalBuildingsLevel + totalOrbitalLevel}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {buildQueue.length > 0 && (
          <Card className="bg-white border-primary/20 shadow-sm" data-testid="card-construction-queue">
             <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                   <Hammer className="w-4 h-4" /> Construction Queue
                </CardTitle>
             </CardHeader>
             <CardContent>
                <div className="space-y-2">
                   {buildQueue.map((item, i) => {
                      const timeLeft = Math.max(0, Math.floor((item.endTime - Date.now()) / 1000));
                      const totalTime = 20;
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

        <Tabs value={activeBase} className="w-full" onValueChange={(v) => setActiveBase(v as FacilityBase)}>
          <TabsList className="bg-white border border-slate-200 h-14 w-full justify-start p-1 gap-2">
            <TabsTrigger value="planet" className="font-orbitron h-12 px-6 data-[state=active]:bg-slate-100 data-[state=active]:border-primary border-2 border-transparent" data-testid="tab-planet">
               <Globe className="w-5 h-5 mr-2 text-blue-500" /> Surface Command
            </TabsTrigger>
            <TabsTrigger value="moon" className="font-orbitron h-12 px-6 data-[state=active]:bg-slate-100 data-[state=active]:border-primary border-2 border-transparent" data-testid="tab-moon">
               <Moon className="w-5 h-5 mr-2 text-slate-400" /> Lunar Base
            </TabsTrigger>
            <TabsTrigger value="station" className="font-orbitron h-12 px-6 data-[state=active]:bg-slate-100 data-[state=active]:border-primary border-2 border-transparent" data-testid="tab-station">
               <Satellite className="w-5 h-5 mr-2 text-purple-500" /> Orbital Station
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
             <TabsContent value="planet" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   <FacilityCard 
                      id="roboticsFactory"
                      name="Robotics Factory"
                      level={buildings.roboticsFactory}
                      description="Robotics factories provide automated construction units. Each level reduces all building construction times by 10%."
                      icon={Factory}
                      iconColor="text-orange-500"
                      resources={resources}
                      onUpgrade={updateBuilding}
                      {...getFacilityEffect("roboticsFactory", buildings.roboticsFactory)}
                      requirementMet={true}
                   />
                   <FacilityCard 
                      id="shipyard"
                      name="Shipyard"
                      level={buildings.shipyard}
                      description="The Shipyard constructs your fleet and defense systems. Higher levels unlock advanced ship classes and reduce build times."
                      icon={Rocket}
                      iconColor="text-blue-500"
                      resources={resources}
                      onUpgrade={updateBuilding}
                      {...getFacilityEffect("shipyard", buildings.shipyard)}
                      requirement={buildings.roboticsFactory < 2 ? "Requires Robotics Factory Lvl 2" : null}
                      requirementMet={buildings.roboticsFactory >= 2}
                   />
                   <FacilityCard 
                      id="researchLab"
                      name="Research Lab"
                      level={buildings.researchLab}
                      description="The Research Lab is essential for technological advancement. Higher levels reduce research time and unlock advanced technologies."
                      icon={FlaskConical}
                      iconColor="text-green-500"
                      resources={resources}
                      onUpgrade={updateBuilding}
                      {...getFacilityEffect("researchLab", buildings.researchLab)}
                      requirement={buildings.roboticsFactory < 1 ? "Requires Robotics Factory Lvl 1" : null}
                      requirementMet={buildings.roboticsFactory >= 1}
                   />
                </div>
                
                <Card className="mt-6 bg-slate-50 border-slate-200" data-testid="card-surface-bonuses">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                      <Zap className="w-4 h-4 text-yellow-500" /> Active Infrastructure Bonuses
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white p-4 rounded border border-slate-200">
                        <div className="text-sm font-bold text-slate-900 mb-1">Construction Speed</div>
                        <div className="text-2xl font-mono font-bold text-orange-600">-{buildings.roboticsFactory * 10}%</div>
                        <div className="text-xs text-muted-foreground">From Robotics Factory</div>
                      </div>
                      <div className="bg-white p-4 rounded border border-slate-200">
                        <div className="text-sm font-bold text-slate-900 mb-1">Ship Build Speed</div>
                        <div className="text-2xl font-mono font-bold text-blue-600">-{buildings.shipyard * 5}%</div>
                        <div className="text-xs text-muted-foreground">From Shipyard</div>
                      </div>
                      <div className="bg-white p-4 rounded border border-slate-200">
                        <div className="text-sm font-bold text-slate-900 mb-1">Research Speed</div>
                        <div className="text-2xl font-mono font-bold text-green-600">-{buildings.researchLab * 5}%</div>
                        <div className="text-xs text-muted-foreground">From Research Lab</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
             </TabsContent>

             <TabsContent value="moon" className="mt-0">
                <Card className="mb-6 bg-slate-800 text-white border-slate-700" data-testid="card-moon-info">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <Moon className="w-12 h-12 text-slate-300" />
                      <div>
                        <div className="font-orbitron font-bold text-lg">Lunar Base Operations</div>
                        <div className="text-sm text-slate-300">Your moon provides unique strategic advantages including sensor arrays and jump gates.</div>
                      </div>
                      <Badge variant="outline" className="ml-auto border-slate-500 text-slate-300">Diameter: 8,234 km</Badge>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {moonBuildings.map(b => (
                      <FacilityCard 
                         key={b.id}
                         id={b.id}
                         name={b.name}
                         level={orbitalBuildings[b.id] || 0}
                         description={b.description}
                         icon={b.icon}
                         iconColor="text-slate-500"
                         resources={resources}
                         onUpgrade={updateBuilding}
                         customCost={b.baseCost}
                         effect={orbitalBuildings[b.id] > 0 ? `Level ${orbitalBuildings[b.id]} active` : "Not built"}
                         requirementMet={true}
                      />
                   ))}
                </div>
             </TabsContent>

             <TabsContent value="station" className="mt-0">
                <Card className="mb-6 bg-purple-900 text-white border-purple-700" data-testid="card-station-info">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <Satellite className="w-12 h-12 text-purple-300" />
                      <div>
                        <div className="font-orbitron font-bold text-lg">Orbital Station Network</div>
                        <div className="text-sm text-purple-200">Orbital stations provide fleet coordination and deep space exploration capabilities.</div>
                      </div>
                      <Badge variant="outline" className="ml-auto border-purple-400 text-purple-200">Orbit: 450 km</Badge>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {stationBuildings.map(b => (
                      <FacilityCard 
                         key={b.id}
                         id={b.id}
                         name={b.name}
                         level={orbitalBuildings[b.id] || 0}
                         description={b.description}
                         icon={b.icon}
                         iconColor="text-purple-500"
                         resources={resources}
                         onUpgrade={updateBuilding}
                         customCost={b.baseCost}
                         effect={orbitalBuildings[b.id] > 0 ? `Level ${orbitalBuildings[b.id]} active` : "Not built"}
                         requirementMet={true}
                      />
                   ))}
                </div>
             </TabsContent>
          </div>
        </Tabs>
      </div>
    </GameLayout>
  );
}
