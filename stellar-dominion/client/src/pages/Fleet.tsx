import GameLayout from "@/components/layout/GameLayout";
import { useGame } from "@/lib/gameContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Rocket, MapPin, Crosshair, Truck, Search, Play, Clock, AlertCircle, User, Anchor, 
  Zap, Skull, Disc, Target, Shield, Sword, TrendingUp, BarChart3, History, Info
} from "lucide-react";
import { useEffect, useState } from "react";
import { unitData } from "@/lib/unitData";
import { SHIP_ASSETS } from "@shared/config";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";

const TEMP_THEME_IMAGE = "/theme-temp.png";

type FleetTab = "dispatch" | "active" | "templates" | "combat";

export default function Fleet() {
   const { units, activeMissions } = useGame();
   const { toast } = useToast();

   const searchParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : new URLSearchParams();
   const initialMission = searchParams.get("mission");
   const initialTargetType = searchParams.get("targetType");
   const initialTab = searchParams.get("tab");
   const allowedMissions = new Set(["attack", "transport", "espionage", "sabotage", "colonize", "deploy"]);
   const allowedTargetTypes = new Set(["planet", "debris", "moon"]);
   const allowedTabs = new Set(["dispatch", "active", "templates", "combat"]);
  
  const [selectedUnits, setSelectedUnits] = useState<{[key: string]: number}>({});
   const [targetGalaxy, setTargetGalaxy] = useState(searchParams.get("g") ?? "1");
   const [targetSystem, setTargetSystem] = useState(searchParams.get("s") ?? "102");
   const [targetPlanet, setTargetPlanet] = useState(searchParams.get("p") ?? "8");
   const [missionType, setMissionType] = useState<any>(allowedMissions.has(initialMission || "") ? (initialMission ?? "attack") : "attack");
   const [targetType, setTargetType] = useState(allowedTargetTypes.has(initialTargetType || "") ? (initialTargetType ?? "planet") : "planet");
   const [activeTab, setActiveTab] = useState<FleetTab>(allowedTabs.has(initialTab || "") ? (initialTab as FleetTab) : "dispatch");

   const sendFleetMutation = useMutation({
      mutationFn: async (payload: { destination: string; missionType: string; ships: { [key: string]: number } }) => {
         const response = await fetch("/api/game/send-fleet", {
            method: "POST",
            credentials: "include",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
         });

         const data = await response.json().catch(() => null);
         if (!response.ok) {
            throw new Error(data?.error || data?.message || "Failed to send fleet");
         }

         return data;
      },
      onSuccess: (result, variables) => {
         setSelectedUnits({});
         setActiveTab("active");
         toast({
            title: "Fleet launched",
            description: result?.message || `${variables.missionType} mission dispatched to ${variables.destination}.`,
         });
      },
      onError: (error: Error) => {
         toast({ title: "Launch failed", description: error.message, variant: "destructive" });
      },
   });

   useEffect(() => {
      const params = new URLSearchParams(window.location.search);
      params.set("tab", activeTab);

      const nextUrl = `/fleet?${params.toString()}`;
      const currentUrl = `${window.location.pathname}${window.location.search}`;

      if (currentUrl !== nextUrl) {
         window.history.replaceState(null, "", nextUrl);
      }
   }, [activeTab]);

   const loadTemplate = (template: "attack" | "colony") => {
      if (template === "attack") {
         setMissionType("attack");
         setSelectedUnits((prev) => ({
            ...prev,
            lightFighter: Math.min(units.lightFighter || 0, 50),
            cruiser: Math.min(units.cruiser || 0, 10),
            smallCargo: Math.min(units.smallCargo || 0, 20),
         }));
         toast({ title: "Template loaded", description: "Raiding Party Alpha applied." });
         return;
      }

      setMissionType("colonize");
      setSelectedUnits((prev) => ({
         ...prev,
         colonist: Math.min(units.colonist || 0, 1),
         lightFighter: Math.min(units.lightFighter || 0, 5),
         largeCargo: Math.min(units.largeCargo || 0, 2),
      }));
      toast({ title: "Template loaded", description: "Colony Ship I applied." });
   };

  const handleUnitChange = (id: string, value: string) => {
     const num = parseInt(value) || 0;
     const max = units[id] || 0;
     setSelectedUnits(prev => ({
        ...prev,
        [id]: Math.min(Math.max(0, num), max)
     }));
  };

  const handleSelectAll = (id: string) => {
     setSelectedUnits(prev => ({
        ...prev,
        [id]: units[id] || 0
     }));
  };

  const handleDispatch = () => {
     const fleetComposition: {[key: string]: number} = {};
     let totalCount = 0;
     Object.entries(selectedUnits).forEach(([id, count]) => {
        if (count > 0) {
           fleetComposition[id] = count;
           totalCount += count;
        }
     });

     if (totalCount === 0) {
        toast({ title: "No ships selected", description: "Select at least one ship before launch.", variant: "destructive" });
        return;
     }

     const destinationParts = [targetGalaxy, targetSystem, targetPlanet].map((value) => Number.parseInt(value, 10));
     const hasInvalidCoordinate = destinationParts.some((value) => !Number.isFinite(value) || value <= 0);
     if (hasInvalidCoordinate) {
        toast({ title: "Invalid target", description: "Galaxy, system, and planet must be positive numbers.", variant: "destructive" });
        return;
     }

     if (missionType === "colonize" && ((fleetComposition.colonist || 0) + (fleetComposition.colonyShip || 0) < 1)) {
        toast({
           title: "Colonist required",
           description: "Colonization missions require at least 1 colonist or colony ship.",
           variant: "destructive",
        });
        return;
     }

     sendFleetMutation.mutate({
        destination: `${destinationParts[0]}:${destinationParts[1]}:${destinationParts[2]}`,
        missionType,
        ships: fleetComposition,
     });
  };

  const getUnitClass = (id: string) => {
     const u = unitData.find(ud => ud.id === id);
     return u ? u.class : "unknown";
  };

  const getUnitName = (id: string) => {
     const u = unitData.find(ud => ud.id === id);
     return u ? u.name : id;
  };

  const getUnitData = (id: string) => unitData.find(ud => ud.id === id);

  const selectedFleetPower = Object.entries(selectedUnits).reduce((sum, [id, count]) => {
    const unit = getUnitData(id);
    if (!unit) return sum;
    const power = unit.stats.attack + unit.stats.shield + (unit.stats.structure / 10);
    return sum + (power * count);
  }, 0);

  const selectedShipsCount = Object.values(selectedUnits).reduce((a, b) => a + b, 0);

  const slowestSpeed = Object.entries(selectedUnits).reduce((min, [id, count]) => {
    if (count === 0) return min;
    const unit = getUnitData(id);
    if (!unit) return min;
    return Math.min(min, unit.stats.speed);
  }, Infinity);

  const totalFleetPower = Object.entries(units).reduce((sum, [id, count]) => {
    const unit = getUnitData(id);
    if (!unit) return sum;
    const power = unit.stats.attack + unit.stats.shield + (unit.stats.structure / 10);
    return sum + (power * count);
  }, 0);

  return (
    <GameLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
          <h2 className="text-3xl font-orbitron font-bold text-slate-900">Fleet Command</h2>
          <p className="text-muted-foreground font-rajdhani text-lg">Manage active missions and dispatch fleets.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200" data-testid="card-stats-fleet-power">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center overflow-hidden">
                  <img src={SHIP_ASSETS.CAPITALS.BATTLECRUISER.path} alt="Fleet Power" className="w-8 h-8 object-contain" onError={(e)=>{e.currentTarget.onerror=null;e.currentTarget.src="/theme-temp.png";}} />
                </div>
                <div>
                  <div className="text-xs text-blue-600 uppercase">Total Fleet Power</div>
                  <div className="text-xl font-orbitron font-bold text-blue-900">{Math.floor(totalFleetPower).toLocaleString()}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200" data-testid="card-stats-active-missions">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center overflow-hidden">
                  <img src={SHIP_ASSETS.FIGHTERS.SCOUT.path} alt="Active Missions" className="w-8 h-8 object-contain" onError={(e)=>{e.currentTarget.onerror=null;e.currentTarget.src="/theme-temp.png";}} />
                </div>
                <div>
                  <div className="text-xs text-purple-600 uppercase">Active Missions</div>
                  <div className="text-xl font-orbitron font-bold text-purple-900">{activeMissions.length}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200" data-testid="card-stats-ships-available">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center overflow-hidden">
                  <img src={SHIP_ASSETS.FIGHTERS.FIGHTER.path} alt="Ships Available" className="w-8 h-8 object-contain" onError={(e)=>{e.currentTarget.onerror=null;e.currentTarget.src="/theme-temp.png";}} />
                </div>
                <div>
                  <div className="text-xs text-green-600 uppercase">Ships Available</div>
                  <div className="text-xl font-orbitron font-bold text-green-900">
                    {Object.values(units).reduce((a, b) => a + b, 0).toLocaleString()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200" data-testid="card-stats-ships-deployed">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center overflow-hidden">
                  <img src={SHIP_ASSETS.SPECIAL.CARRIER.path} alt="Ships Deployed" className="w-8 h-8 object-contain" onError={(e)=>{e.currentTarget.onerror=null;e.currentTarget.src="/theme-temp.png";}} />
                </div>
                <div>
                  <div className="text-xs text-orange-600 uppercase">Ships Deployed</div>
                  <div className="text-xl font-orbitron font-bold text-orange-900">
                    {activeMissions.reduce((sum, m) => sum + Object.values(m.units).reduce((a: number, b: any) => a + b, 0), 0).toLocaleString()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as FleetTab)} className="w-full">
           <TabsList className="bg-white border border-slate-200 h-12 w-full justify-start">
              <TabsTrigger value="dispatch" className="font-orbitron" data-testid="tab-dispatch"><Rocket className="w-4 h-4 mr-2" /> Dispatch Fleet</TabsTrigger>
              <TabsTrigger value="active" className="font-orbitron" data-testid="tab-active">
                 <Clock className="w-4 h-4 mr-2" /> Active Missions 
                 {activeMissions.length > 0 && <Badge className="ml-2 bg-primary text-white h-5">{activeMissions.length}</Badge>}
              </TabsTrigger>
              <TabsTrigger value="templates" className="font-orbitron" data-testid="tab-templates"><Anchor className="w-4 h-4 mr-2" /> Fleet Templates</TabsTrigger>
              <TabsTrigger value="combat" className="font-orbitron" data-testid="tab-combat"><Sword className="w-4 h-4 mr-2" /> Combat Simulator</TabsTrigger>
           </TabsList>

           <TabsContent value="dispatch" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="col-span-2 bg-white border-slate-200 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg font-orbitron flex items-center gap-2 text-slate-900">
                      <Rocket className="w-5 h-5 text-primary" /> Select Fleet Composition
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow className="border-slate-200 hover:bg-transparent">
                          <TableHead className="text-slate-900">Unit Class & Type</TableHead>
                          <TableHead className="text-right text-slate-900">Power</TableHead>
                          <TableHead className="text-right text-slate-900">Speed</TableHead>
                          <TableHead className="text-right text-slate-900">Available</TableHead>
                          <TableHead className="text-right text-slate-900 w-[140px]">Select</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {["fighter", "capital", "super", "titan", "civilian", "troop", "vehicle"].map(cls => {
                           const classUnits = Object.keys(units).filter(id => getUnitClass(id) === cls && units[id] > 0);
                           if (classUnits.length === 0) return null;

                           return (
                              <>
                                 <TableRow key={cls} className="bg-slate-50 hover:bg-slate-50 border-slate-200">
                                    <TableCell colSpan={5} className="font-bold uppercase text-xs tracking-widest text-muted-foreground py-2">
                                       {cls} Class
                                    </TableCell>
                                 </TableRow>
                                 {classUnits.map(id => {
                                    const uData = getUnitData(id);
                                    const power = uData ? uData.stats.attack + uData.stats.shield + (uData.stats.structure / 10) : 0;
                                    return (
                                       <TableRow key={id} className="border-slate-100 hover:bg-slate-50">
                                          <TableCell className="font-medium text-slate-700">
                                             <div className="flex items-center gap-2">
                                                {cls === "super" && <Skull className="w-4 h-4 text-purple-500" />}
                                                {cls === "titan" && <Skull className="w-4 h-4 text-red-500" />}
                                                {getUnitName(id)}
                                             </div>
                                          </TableCell>
                                          <TableCell className="text-right text-slate-500 text-xs font-mono">{Math.floor(power).toLocaleString()}</TableCell>
                                          <TableCell className="text-right text-slate-500 text-xs font-mono">{uData?.stats.speed.toLocaleString()}</TableCell>
                                          <TableCell className="text-right font-mono text-primary cursor-pointer hover:underline" onClick={() => handleSelectAll(id)}>
                                             {units[id]}
                                          </TableCell>
                                          <TableCell className="text-right">
                                             <div className="flex items-center gap-1 justify-end">
                                                <Input 
                                                   type="number" 
                                                   value={selectedUnits[id] || ""}
                                                   onChange={(e) => handleUnitChange(id, e.target.value)}
                                                   placeholder="0" 
                                                   className="h-8 bg-white border-slate-200 text-right w-20 text-slate-900" 
                                                   data-testid={`input-select-${id}`}
                                                />
                                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleSelectAll(id)}>
                                                   <Zap className="w-3 h-3" />
                                                </Button>
                                             </div>
                                          </TableCell>
                                       </TableRow>
                                    )
                                 })}
                              </>
                           )
                        })}
                        
                        {Object.values(units).every(val => val === 0) && (
                           <TableRow>
                              <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                                 No units available. Build some in the Shipyard!
                              </TableCell>
                           </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  {selectedShipsCount > 0 && (
                    <Card className="bg-primary/5 border-primary/20 shadow-sm" data-testid="card-fleet-summary">
                       <CardHeader className="pb-2">
                         <CardTitle className="text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                           <BarChart3 className="w-4 h-4" /> Fleet Summary
                         </CardTitle>
                       </CardHeader>
                       <CardContent className="space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                             <div className="bg-white p-3 rounded border border-slate-100">
                                <div className="text-xs text-muted-foreground">Ships Selected</div>
                                <div className="text-xl font-mono font-bold text-slate-900">{selectedShipsCount}</div>
                             </div>
                             <div className="bg-white p-3 rounded border border-slate-100">
                                <div className="text-xs text-muted-foreground">Fleet Power</div>
                                <div className="text-xl font-mono font-bold text-primary">{Math.floor(selectedFleetPower).toLocaleString()}</div>
                             </div>
                          </div>
                          <div className="bg-white p-3 rounded border border-slate-100">
                             <div className="text-xs text-muted-foreground mb-1">Slowest Unit Speed</div>
                             <div className="font-mono text-slate-900">{slowestSpeed === Infinity ? "-" : slowestSpeed.toLocaleString()}</div>
                          </div>
                       </CardContent>
                    </Card>
                  )}
                  
                  <Card className="bg-white border-slate-200 shadow-sm">
                     <CardHeader className="pb-2">
                       <CardTitle className="text-lg font-orbitron flex items-center gap-2 text-slate-900">
                         <MapPin className="w-5 h-5 text-blue-600" /> Target Coordinates
                       </CardTitle>
                     </CardHeader>
                     <CardContent className="space-y-4">
                        <div className="grid grid-cols-3 gap-2">
                           <div>
                              <label className="text-xs text-muted-foreground uppercase">Galaxy</label>
                              <Input value={targetGalaxy} onChange={e => setTargetGalaxy(e.target.value)} className="bg-slate-50 border-slate-200 font-mono text-slate-900" data-testid="input-galaxy" />
                           </div>
                           <div>
                              <label className="text-xs text-muted-foreground uppercase">System</label>
                              <Input value={targetSystem} onChange={e => setTargetSystem(e.target.value)} className="bg-slate-50 border-slate-200 font-mono text-slate-900" data-testid="input-system" />
                           </div>
                           <div>
                              <label className="text-xs text-muted-foreground uppercase">Planet</label>
                              <Input value={targetPlanet} onChange={e => setTargetPlanet(e.target.value)} className="bg-slate-50 border-slate-200 font-mono text-slate-900" data-testid="input-planet" />
                           </div>
                        </div>
                        
                        <Select value={targetType} onValueChange={setTargetType}>
                           <SelectTrigger className="bg-slate-50 border-slate-200 text-slate-900">
                              <SelectValue placeholder="Target Type" />
                           </SelectTrigger>
                           <SelectContent>
                              <SelectItem value="planet">Planet</SelectItem>
                              <SelectItem value="debris">Debris Field</SelectItem>
                              <SelectItem value="moon">Moon</SelectItem>
                           </SelectContent>
                        </Select>
                     </CardContent>
                  </Card>

                  <Card className="bg-white border-slate-200 shadow-sm">
                     <CardHeader className="pb-2">
                       <CardTitle className="text-lg font-orbitron flex items-center gap-2 text-slate-900">
                         <Crosshair className="w-5 h-5 text-red-600" /> Mission Type
                       </CardTitle>
                     </CardHeader>
                     <CardContent className="space-y-2">
                        {[
                           { id: "attack", icon: Crosshair, label: "Attack", desc: "Engage enemy defenses", color: "text-red-600" },
                           { id: "transport", icon: Truck, label: "Transport", desc: "Deliver resources", color: "text-green-600" },
                           { id: "espionage", icon: Search, label: "Espionage", desc: "Gather intelligence", color: "text-blue-600" },
                           { id: "sabotage", icon: Skull, label: "Sabotage", desc: "Destroy structures", color: "text-orange-600" },
                           { id: "colonize", icon: MapPin, label: "Colonize", desc: "Establish new colony", color: "text-yellow-600" },
                           { id: "deploy", icon: Anchor, label: "Deploy", desc: "Station fleet at target", color: "text-purple-600" },
                        ].map(m => (
                           <Button 
                              key={m.id}
                              variant={missionType === m.id ? "secondary" : "outline"} 
                              className={cn("w-full justify-start border-slate-200 text-slate-700 h-auto py-2", missionType === m.id && "bg-slate-100 border-slate-300")}
                              onClick={() => setMissionType(m.id)}
                              data-testid={`button-mission-${m.id}`}
                           >
                              <m.icon className={cn("w-4 h-4 mr-3", m.color)} />
                              <div className="text-left">
                                <div className="font-medium">{m.label}</div>
                                <div className="text-[10px] text-muted-foreground">{m.desc}</div>
                              </div>
                           </Button>
                        ))}
                     </CardContent>
                  </Card>
                  
                  <Button 
                     className="w-full bg-primary text-white hover:bg-primary/90 font-bold font-orbitron h-12 text-lg shadow-md"
                     onClick={handleDispatch}
                     disabled={selectedShipsCount === 0 || sendFleetMutation.isPending}
                     data-testid="button-launch-fleet"
                  >
                     <Play className="w-5 h-5 mr-2 fill-white" /> {sendFleetMutation.isPending ? "LAUNCHING..." : "LAUNCH FLEET"}
                  </Button>
                </div>
              </div>
           </TabsContent>

           <TabsContent value="active" className="mt-6">
              {activeMissions.length === 0 ? (
                 <div className="text-center py-20 bg-white border border-slate-200 rounded-lg border-dashed">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden">
                       <img
                          src={SHIP_ASSETS.FIGHTERS.SCOUT.path}
                          alt="idle fleet"
                          className="w-9 h-9 object-contain opacity-60"
                          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = TEMP_THEME_IMAGE; }}
                       />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">No Active Missions</h3>
                    <p className="text-slate-500">Fleet command is idle. Dispatch ships to see them here.</p>
                 </div>
              ) : (
                 <div className="space-y-4">
                    {activeMissions.map(mission => {
                       const now = Date.now();
                       const isReturn = mission.status === "return" || (now > mission.arrivalTime);
                       const endTime = isReturn ? mission.returnTime : mission.arrivalTime;
                       const totalTime = 10000;
                       const timeLeft = Math.max(0, endTime - now);
                       const progress = Math.max(0, 100 - (timeLeft / totalTime) * 100);

                       const missionPower = Object.entries(mission.units).reduce((sum, [id, count]: [string, any]) => {
                         const unit = getUnitData(id);
                         if (!unit) return sum;
                         const power = unit.stats.attack + unit.stats.shield + (unit.stats.structure / 10);
                         return sum + (power * count);
                       }, 0);

                       return (
                          <Card key={mission.id} className={cn("bg-white border-slate-200", isReturn ? "border-l-4 border-l-blue-500" : "border-l-4 border-l-red-500")}>
                             <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                   <div className="flex items-center gap-3">
                                      <div className={cn("w-12 h-12 rounded flex items-center justify-center", isReturn ? "bg-blue-100 text-blue-600" : "bg-red-100 text-red-600")}>
                                         {isReturn ? <Anchor className="w-6 h-6" /> : <Rocket className="w-6 h-6" />}
                                      </div>
                                      <div>
                                         <div className="font-bold text-slate-900 uppercase text-sm tracking-wider flex items-center gap-2">
                                            {mission.type} Mission
                                            <Badge variant="outline" className={isReturn ? "border-blue-200 text-blue-600" : "border-red-200 text-red-600"}>
                                              {isReturn ? "Returning" : "En Route"}
                                            </Badge>
                                         </div>
                                         <div className="text-sm text-slate-500">Target: [{mission.target}]</div>
                                      </div>
                                   </div>
                                   <div className="text-right">
                                      <div className="text-3xl font-mono font-bold text-slate-900">{Math.ceil(timeLeft / 1000)}s</div>
                                      <div className="text-xs text-muted-foreground">ETA</div>
                                   </div>
                                </div>
                                
                                <div className="space-y-1 mb-4">
                                   <div className="flex justify-between text-xs text-slate-500">
                                      <span>Origin</span>
                                      <span>Target</span>
                                   </div>
                                   <Progress value={progress} className="h-3" />
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                   <div className="bg-slate-50 p-3 rounded border border-slate-100">
                                      <div className="text-xs text-muted-foreground">Fleet Power</div>
                                      <div className="font-mono font-bold text-slate-900">{Math.floor(missionPower).toLocaleString()}</div>
                                   </div>
                                   <div className="bg-slate-50 p-3 rounded border border-slate-100">
                                      <div className="text-xs text-muted-foreground">Ship Count</div>
                                      <div className="font-mono font-bold text-slate-900">
                                        {Object.values(mission.units).reduce((a: number, b: any) => a + b, 0)}
                                      </div>
                                   </div>
                                   {Object.entries(mission.units).slice(0, 2).map(([id, count]) => (
                                      <div key={id} className="bg-slate-50 p-3 rounded border border-slate-100">
                                         <div className="text-xs text-muted-foreground truncate">{getUnitName(id)}</div>
                                         <div className="font-mono font-bold text-slate-900">{count}</div>
                                      </div>
                                   ))}
                                </div>
                             </CardContent>
                          </Card>
                       )
                    })}
                 </div>
              )}
           </TabsContent>

           <TabsContent value="templates" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <Card className="bg-white border-slate-200 cursor-pointer hover:border-primary transition-colors group">
                    <CardHeader>
                       <CardTitle className="text-slate-900 group-hover:text-primary flex items-center justify-between">
                          Raiding Party Alpha
                          <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">Attack</Badge>
                       </CardTitle>
                    </CardHeader>
                    <CardContent>
                       <div className="space-y-2 text-sm text-slate-600">
                          <div className="flex justify-between"><span>Light Fighter</span> <span className="font-mono">50</span></div>
                          <div className="flex justify-between"><span>Cruiser</span> <span className="font-mono">10</span></div>
                          <div className="flex justify-between"><span>Small Cargo</span> <span className="font-mono">20</span></div>
                       </div>
                       <Separator className="my-4" />
                       <div className="flex justify-between text-xs text-muted-foreground">
                         <span>Est. Power: 15,000</span>
                         <span>80 ships</span>
                       </div>
                       <Button className="w-full mt-4" variant="outline" onClick={() => loadTemplate("attack")} data-testid="button-load-template-alpha">Load Template</Button>
                    </CardContent>
                 </Card>

                 <Card className="bg-white border-slate-200 cursor-pointer hover:border-primary transition-colors group">
                    <CardHeader>
                       <CardTitle className="text-slate-900 group-hover:text-primary flex items-center justify-between">
                          Colony Ship I
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">Colonize</Badge>
                       </CardTitle>
                    </CardHeader>
                    <CardContent>
                       <div className="space-y-2 text-sm text-slate-600">
                          <div className="flex justify-between"><span>Colony Ship</span> <span className="font-mono">1</span></div>
                          <div className="flex justify-between"><span>Light Fighter</span> <span className="font-mono">5</span></div>
                          <div className="flex justify-between"><span>Large Cargo</span> <span className="font-mono">2</span></div>
                       </div>
                       <Separator className="my-4" />
                       <div className="flex justify-between text-xs text-muted-foreground">
                         <span>Est. Power: 2,500</span>
                         <span>8 ships</span>
                       </div>
                       <Button className="w-full mt-4" variant="outline" onClick={() => loadTemplate("colony")} data-testid="button-load-template-colony">Load Template</Button>
                    </CardContent>
                 </Card>

                 <Card className="border-2 border-dashed border-slate-200 flex items-center justify-center min-h-[200px] hover:bg-slate-50 cursor-pointer">
                    <div className="text-center text-slate-400">
                       <Anchor className="w-10 h-10 mx-auto mb-2" />
                       <span className="font-bold block">Create New Template</span>
                       <span className="text-xs">Save your fleet configurations</span>
                    </div>
                 </Card>
              </div>
           </TabsContent>

           <TabsContent value="combat" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <Card className="bg-white border-slate-200" data-testid="card-combat-simulator">
                    <CardHeader>
                       <CardTitle className="text-lg font-orbitron flex items-center gap-2 text-slate-900">
                          <Sword className="w-5 h-5 text-red-500" /> Combat Simulator
                       </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                       <p className="text-sm text-muted-foreground">Simulate battles before launching an attack to estimate your chances of victory.</p>
                       
                       <div className="grid grid-cols-2 gap-4">
                          <div className="bg-blue-50 p-4 rounded border border-blue-200">
                             <div className="text-xs text-blue-600 uppercase font-bold mb-2">Your Fleet</div>
                             <div className="text-2xl font-mono font-bold text-blue-900">{Math.floor(totalFleetPower).toLocaleString()}</div>
                             <div className="text-xs text-blue-600">Combat Power</div>
                          </div>
                          <div className="bg-red-50 p-4 rounded border border-red-200">
                             <div className="text-xs text-red-600 uppercase font-bold mb-2">Enemy (Est.)</div>
                             <Input placeholder="Enter power..." className="bg-white border-red-200 font-mono" />
                          </div>
                       </div>
                       
                       <Button className="w-full" variant="outline">
                          <Target className="w-4 h-4 mr-2" /> Run Simulation
                       </Button>
                       
                       <div className="bg-slate-50 p-4 rounded border border-slate-200 text-center">
                          <Info className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                          <p className="text-sm text-slate-500">Enter enemy fleet power to simulate combat outcome</p>
                       </div>
                    </CardContent>
                 </Card>

                 <Card className="bg-white border-slate-200" data-testid="card-combat-history">
                    <CardHeader>
                       <CardTitle className="text-lg font-orbitron flex items-center gap-2 text-slate-900">
                          <History className="w-5 h-5 text-slate-500" /> Recent Combat Reports
                       </CardTitle>
                    </CardHeader>
                    <CardContent>
                       <div className="text-center py-8">
                          <History className="w-12 h-12 mx-auto mb-4 text-slate-200" />
                          <p className="text-slate-500">No combat reports yet</p>
                          <p className="text-xs text-slate-400 mt-1">Attack or defend to see battle results here</p>
                       </div>
                    </CardContent>
                 </Card>
              </div>
           </TabsContent>
        </Tabs>
      </div>
    </GameLayout>
  );
}
