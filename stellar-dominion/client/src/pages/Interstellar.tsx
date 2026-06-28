import GameLayout from "@/components/layout/GameLayout";
import { useGame } from "@/lib/gameContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Rocket, Disc, CircleDot, Zap, MapPin, Navigation, AlertTriangle, Orbit, Database } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { DESTINATIONS, Destination } from "@/lib/interstellarData";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";

type TravelCoordinates = {
   galaxy: number;
   sector: number;
   system: number;
   x: number;
   y: number;
   z: number;
};

type StargateResponse = {
   count: number;
   stargates: Array<{
      id: string;
      name: string;
      location: TravelCoordinates;
      isActive: boolean;
      connectedGates: string[];
   }>;
};

type RouteCalculationResponse = {
   distance: number;
   travelTime: number;
   travelCost: {
      deuterium: number;
   };
};

function parseGameCoordinates(raw: string): TravelCoordinates {
   const parts = String(raw || "")
      .replace(/\[|\]/g, "")
      .split(":")
      .map((part) => Number.parseInt(part || "0", 10));

   return {
      galaxy: Number.isFinite(parts[0]) && parts[0] > 0 ? parts[0] : 1,
      sector: Number.isFinite(parts[1]) && parts[1] >= 0 ? parts[1] : 1,
      system: Number.isFinite(parts[2]) && parts[2] >= 0 ? parts[2] : 1,
      x: Number.isFinite(parts[3]) && parts[3] >= 0 ? parts[3] : 0,
      y: 0,
      z: 0,
   };
}

function coordsToGameString(coords: TravelCoordinates): string {
   return `${coords.galaxy}:${coords.sector}:${coords.system}`;
}

export default function Interstellar() {
  const [, setLocation] = useLocation();
  const { coordinates, resources, travelTo } = useGame();
   const { toast } = useToast();
  const [selectedDest, setSelectedDest] = useState<string>("");
  const [stargateAddress, setStargateAddress] = useState("");
  const [isDialing, setIsDialing] = useState(false);

   const deuteriumReserve = Number((resources as any)?.deuterium ?? 0);
   const safeCoordinates = typeof coordinates === "string" && coordinates.length > 0 ? coordinates : "1:1:100:3";
   const STARGATE_COST = 5000;
   const JUMPGATE_COST = 500;
   const currentTravelCoords = parseGameCoordinates(safeCoordinates);

   const currentDest = DESTINATIONS.find(d => d.coordinates === safeCoordinates);
  const target = DESTINATIONS.find(d => d.id === selectedDest);

   const { data: stargatesData } = useQuery<StargateResponse>({
      queryKey: ["travel-stargates"],
      queryFn: async () => {
         const response = await fetch("/api/travel/stargates", { credentials: "include" });
         if (!response.ok) throw new Error("Failed to load stargate network");
         return response.json();
      },
      staleTime: 120000,
   });

   const routePreviewQuery = useQuery<RouteCalculationResponse>({
      queryKey: ["travel-route-preview", safeCoordinates, target?.coordinates],
      queryFn: async () => {
         if (!target) throw new Error("No destination selected");
         const response = await fetch("/api/travel/route/calculate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
               from: currentTravelCoords,
               to: parseGameCoordinates(target.coordinates),
               method: "warp",
            }),
         });

         if (!response.ok) {
            const payload = await response.json().catch(() => ({}));
            throw new Error(payload.message || "Failed to calculate route");
         }

         return response.json();
      },
      enabled: Boolean(target),
      staleTime: 30000,
   });

   const playerRouteMutation = useMutation({
      mutationFn: async (payload: { to: TravelCoordinates; method: "warp" | "gate" | "wormhole"; routeName: string }) => {
         const response = await fetch("/api/travel/player/route", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
               from: currentTravelCoords,
               to: payload.to,
               method: payload.method,
               routeName: payload.routeName,
            }),
         });

         if (!response.ok) {
            const body = await response.json().catch(() => ({}));
            throw new Error(body.message || "Failed to register route");
         }

         return response.json();
      },
   });

  const calculateCost = (dist: number) => {
     return Math.floor(dist * 100); // 100 deuterium per light year
  };

  const handleJump = () => {
     if (!target) {
        toast({ title: "No destination selected", description: "Select a target system first.", variant: "destructive" });
        return;
     }
     const previewCost = Number(routePreviewQuery.data?.travelCost?.deuterium ?? calculateCost(target.distance));
     const cost = Number.isFinite(previewCost) ? previewCost : calculateCost(target.distance);
     if (deuteriumReserve < cost) {
        toast({ title: "Insufficient deuterium", description: `Need ${cost.toLocaleString()} deuterium for this jump.`, variant: "destructive" });
        return;
     }
     const destinationCoords = parseGameCoordinates(target.coordinates);
     playerRouteMutation.mutate(
        { to: destinationCoords, method: "warp", routeName: `Warp-${target.name}` },
        {
          onSuccess: () => {
            travelTo(target.name, target.coordinates, { deuterium: cost });
          },
          onError: (error: Error) => {
            toast({ title: "Route registration failed", description: error.message, variant: "destructive" });
          },
        },
     );
  };

  const handleGateJump = (dest: Destination) => {
     if (deuteriumReserve < JUMPGATE_COST) {
        toast({ title: "Insufficient deuterium", description: `Jump Gate requires ${JUMPGATE_COST} deuterium.`, variant: "destructive" });
        return;
     }
     playerRouteMutation.mutate(
        { to: parseGameCoordinates(dest.coordinates), method: "gate", routeName: `JumpGate-${dest.name}` },
        {
          onSuccess: () => {
            travelTo(dest.name, dest.coordinates, { deuterium: JUMPGATE_COST });
          },
          onError: (error: Error) => {
            toast({ title: "Jump gate failed", description: error.message, variant: "destructive" });
          },
        },
     );
  };

  const handleStargateDial = () => {
     const normalizedAddress = stargateAddress.replace(/[^0-9]/g, "");
     if (!normalizedAddress) {
        toast({ title: "Address required", description: "Enter a Stargate address before dialing.", variant: "destructive" });
        return;
     }
     if (deuteriumReserve < STARGATE_COST) {
        toast({ title: "Insufficient deuterium", description: `Stargate dial requires ${STARGATE_COST.toLocaleString()} deuterium.`, variant: "destructive" });
        return;
     }

     setIsDialing(true);
     setTimeout(() => {
        setIsDialing(false);
            const stargateList = stargatesData?.stargates || [];
            const addressParts = stargateAddress
               .split(/[^0-9]+/)
               .map((part) => Number.parseInt(part, 10))
               .filter((value) => Number.isFinite(value));

            const resolvedGate = addressParts.length >= 3
               ? stargateList.find(
                     (gate) => gate.location.galaxy === addressParts[0]
                        && gate.location.sector === addressParts[1]
                        && gate.location.system === addressParts[2],
                  )
               : null;

            if (resolvedGate) {
               playerRouteMutation.mutate(
                  { to: resolvedGate.location, method: "gate", routeName: `Stargate-${resolvedGate.name}` },
                  {
                     onSuccess: () => {
                        travelTo(resolvedGate.name, coordsToGameString(resolvedGate.location), { deuterium: STARGATE_COST });
                     },
                     onError: (error: Error) => {
                        toast({ title: "Stargate route failed", description: error.message, variant: "destructive" });
                     },
                  },
               );
            } else if (normalizedAddress === "777" || normalizedAddress === "777777777") {
                travelTo("Unknown Sector", "9:999:9", { deuterium: STARGATE_COST });
        } else {
           toast({ title: "Dial failed", description: "Chevron 7 will not lock. Invalid address.", variant: "destructive" });
        }
     }, 3000);
  };

  const handleVisitDestination = (dest: Destination) => {
     travelTo(dest.name, dest.coordinates, { deuterium: 0 });
     setTimeout(() => setLocation("/"), 100);
  };

  return (
    <GameLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
          <h2 className="text-3xl font-orbitron font-bold text-slate-900">Interstellar Travel</h2>
          <p className="text-muted-foreground font-rajdhani text-lg">Navigate the stars using advanced propulsion and gateway networks.</p>
        </div>

        <div className="bg-slate-900 text-white p-6 rounded-lg shadow-md border border-slate-700 flex justify-between items-center">
           <div>
              <div className="text-sm text-slate-400 uppercase tracking-widest mb-1">Current Location</div>
              <div className="text-2xl font-orbitron font-bold text-blue-400 flex items-center gap-2">
                 <MapPin className="w-6 h-6" />
                 {currentDest ? currentDest.name : "Deep Space"} 
                 <span className="text-slate-500 text-lg ml-2">[{safeCoordinates}]</span>
              </div>
           </div>
           <div className="text-right">
              <div className="text-sm text-slate-400 uppercase tracking-widest mb-1">Fuel Reserves</div>
              <div className="text-xl font-mono text-green-400 flex items-center justify-end gap-2">
                 <Database className="w-4 h-4" /> {deuteriumReserve.toLocaleString()}
              </div>
           </div>
        </div>

        <Tabs defaultValue="gallery" className="w-full">
           <TabsList className="grid w-full grid-cols-4 bg-white border border-slate-200 h-16">
              <TabsTrigger value="gallery" className="font-orbitron flex flex-col items-center justify-center h-full gap-1">
                 <Disc className="w-4 h-4" /> Gallery
              </TabsTrigger>
              <TabsTrigger value="hyperspace" className="font-orbitron flex flex-col items-center justify-center h-full gap-1">
                 <Rocket className="w-4 h-4" /> Hyperspace
              </TabsTrigger>
              <TabsTrigger value="jumpgate" className="font-orbitron flex flex-col items-center justify-center h-full gap-1">
                 <Orbit className="w-4 h-4" /> Jump Gates
              </TabsTrigger>
              <TabsTrigger value="stargate" className="font-orbitron flex flex-col items-center justify-center h-full gap-1">
                 <CircleDot className="w-4 h-4" /> Stargate
              </TabsTrigger>
           </TabsList>

           {/* Gallery Tab - Clickable Destinations */}
           <TabsContent value="gallery" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                 {DESTINATIONS.map(dest => (
                    <Card 
                       key={dest.id} 
                       className="bg-white border-slate-200 cursor-pointer transition-all hover:shadow-lg hover:border-primary"
                       onClick={() => handleVisitDestination(dest)}
                       data-testid={`destination-card-${dest.id}`}
                    >
                       <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                             <div>
                                <div className="font-orbitron text-lg font-bold text-slate-900">{dest.name}</div>
                                <div className="text-xs text-slate-500 font-mono">{dest.coordinates}</div>
                             </div>
                             <Disc className={cn("w-6 h-6", dest.type === "colony" ? "text-blue-500" : dest.type === "asteroid" ? "text-yellow-500" : dest.type === "nebula" ? "text-purple-500" : dest.type === "blackhole" ? "text-red-500" : "text-slate-400")} />
                          </div>
                          <div className="space-y-2 text-xs">
                             <div className="flex justify-between">
                                <span className="text-slate-500">Distance:</span>
                                <span className="font-mono">{dest.distance} ly</span>
                             </div>
                             <div className="flex justify-between">
                                <span className="text-slate-500">Type:</span>
                                <span className="capitalize font-bold">{dest.type}</span>
                             </div>
                             <div className="flex justify-between">
                                <span className="text-slate-500">Danger:</span>
                                <span className={cn("font-bold uppercase", dest.dangerLevel === "low" ? "text-green-600" : dest.dangerLevel === "medium" ? "text-yellow-600" : dest.dangerLevel === "high" ? "text-red-600" : "text-red-700")}>{dest.dangerLevel}</span>
                             </div>
                          </div>
                          <div className="mt-4 text-xs text-slate-500">Click to visit →</div>
                       </CardContent>
                    </Card>
                 ))}
              </div>
           </TabsContent>

           {/* Hyperspace Tab */}
           <TabsContent value="hyperspace" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <Card className="md:col-span-2 bg-white border-slate-200">
                    <CardHeader>
                       <CardTitle className="flex items-center gap-2">
                          <Navigation className="w-5 h-5 text-blue-600" /> Flight Computer
                       </CardTitle>
                       <CardDescription>Calculate jump vectors for FTL travel.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                       <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700">Target System</label>
                          <Select onValueChange={setSelectedDest} value={selectedDest}>
                             <SelectTrigger className="bg-slate-50 border-slate-200 h-12 text-lg">
                                <SelectValue placeholder="Select Destination" />
                             </SelectTrigger>
                             <SelectContent>
                                {DESTINATIONS.filter(d => d.id !== currentDest?.id).map(dest => (
                                   <SelectItem key={dest.id} value={dest.id}>
                                      [{dest.coordinates}] {dest.name} ({dest.distance} ly)
                                   </SelectItem>
                                ))}
                             </SelectContent>
                          </Select>
                       </div>

                       {target && (
                          <div className="bg-slate-50 p-4 rounded border border-slate-200 space-y-4">
                             <div className="grid grid-cols-2 gap-4">
                                <div>
                                   <div className="text-xs text-slate-500 uppercase">Distance</div>
                                   <div className="text-xl font-mono text-slate-900">{target.distance} ly</div>
                                </div>
                                <div>
                                   <div className="text-xs text-slate-500 uppercase">Est. Time</div>
                                   <div className="text-xl font-mono text-slate-900">{routePreviewQuery.data ? `${Math.max(1, Math.ceil(routePreviewQuery.data.travelTime / 60))}m` : "Calculating..."}</div>
                                </div>
                                <div>
                                   <div className="text-xs text-slate-500 uppercase">Fuel Cost</div>
                                   <div className={cn("text-xl font-mono", deuteriumReserve >= Number(routePreviewQuery.data?.travelCost?.deuterium ?? calculateCost(target.distance)) ? "text-green-600" : "text-red-600")}>
                                      {Number(routePreviewQuery.data?.travelCost?.deuterium ?? calculateCost(target.distance)).toLocaleString()} Deut
                                   </div>
                                </div>
                                <div>
                                   <div className="text-xs text-slate-500 uppercase">Danger Level</div>
                                   <div className={cn("text-xl font-bold uppercase", 
                                      target.dangerLevel === "low" ? "text-green-500" : 
                                      target.dangerLevel === "medium" ? "text-yellow-500" : "text-red-500"
                                   )}>
                                      {target.dangerLevel}
                                   </div>
                                </div>
                             </div>
                             
                             <Button 
                                className="w-full h-12 text-lg font-orbitron bg-blue-600 hover:bg-blue-700"
                                disabled={deuteriumReserve < Number(routePreviewQuery.data?.travelCost?.deuterium ?? calculateCost(target.distance)) || playerRouteMutation.isPending}
                                onClick={handleJump}
                             >
                                <Zap className="w-5 h-5 mr-2" /> ENGAGE HYPERDRIVE
                             </Button>
                          </div>
                       )}
                    </CardContent>
                 </Card>

                 <Card className="bg-white border-slate-200">
                    <CardHeader>
                       <CardTitle className="text-sm font-bold uppercase text-slate-500">System Info</CardTitle>
                    </CardHeader>
                    <CardContent>
                       {target ? (
                          <div className="space-y-4 text-center">
                             <div className="w-24 h-24 mx-auto bg-slate-900 rounded-full flex items-center justify-center shadow-inner">
                                <Disc className="w-12 h-12 text-blue-400 animate-pulse" />
                             </div>
                             <div>
                                <div className="font-orbitron text-xl font-bold text-slate-900">{target.name}</div>
                                <div className="text-sm text-slate-500 capitalize">{target.type}</div>
                             </div>
                             <div className="grid grid-cols-3 gap-2 text-xs">
                                <div className="bg-slate-50 p-2 rounded">
                                   <div className="font-bold text-slate-400">MET</div>
                                   <div className="capitalize">{target.resources.metal}</div>
                                </div>
                                <div className="bg-slate-50 p-2 rounded">
                                   <div className="font-bold text-blue-400">CRY</div>
                                   <div className="capitalize">{target.resources.crystal}</div>
                                </div>
                                <div className="bg-slate-50 p-2 rounded">
                                   <div className="font-bold text-green-400">DEU</div>
                                   <div className="capitalize">{target.resources.deuterium}</div>
                                </div>
                             </div>
                          </div>
                       ) : (
                          <div className="h-full flex items-center justify-center text-slate-400 italic">
                             Select a destination to view details.
                          </div>
                       )}
                    </CardContent>
                 </Card>
              </div>
           </TabsContent>

           {/* Jump Gate Tab */}
           <TabsContent value="jumpgate" className="mt-6">
              <Card className="bg-white border-slate-200">
                 <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                       <Orbit className="w-5 h-5 text-purple-600" /> Jump Gate Network
                    </CardTitle>
                    <CardDescription>Instantaneous travel between owned gates. Cooldown applies.</CardDescription>
                 </CardHeader>
                 <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                       {DESTINATIONS.filter(d => d.type === "gate").map(gate => (
                          <Button 
                             key={gate.id}
                             variant="outline" 
                             className="h-24 flex flex-col items-start justify-center gap-1 border-slate-200 hover:border-purple-400 hover:bg-purple-50"
                             onClick={() => handleGateJump(gate)}
                             disabled={gate.coordinates === safeCoordinates || deuteriumReserve < JUMPGATE_COST}
                          >
                             <div className="font-orbitron font-bold text-lg text-slate-900">{gate.name}</div>
                             <div className="text-xs text-slate-500 font-mono">[{gate.coordinates}]</div>
                             {gate.coordinates === safeCoordinates && <div className="text-xs text-green-600 font-bold mt-1">CURRENT LOCATION</div>}
                          </Button>
                       ))}
                    </div>
                 </CardContent>
              </Card>
           </TabsContent>

           {/* Stargate Tab */}
           <TabsContent value="stargate" className="mt-6">
              <Card className="bg-slate-900 border-slate-800 text-white overflow-hidden relative">
                 <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-20 pointer-events-none"></div>
                 <CardContent className="relative z-10 p-8 text-center space-y-8">
                    <div className="w-48 h-48 mx-auto rounded-full border-8 border-slate-700 flex items-center justify-center relative shadow-[0_0_50px_rgba(59,130,246,0.5)]">
                       {isDialing && <div className="absolute inset-0 rounded-full border-t-4 border-blue-500 animate-spin"></div>}
                       <div className="w-40 h-40 bg-black rounded-full flex items-center justify-center overflow-hidden">
                          {isDialing ? (
                             <div className="w-full h-full bg-blue-900/50 animate-pulse"></div>
                          ) : (
                             <div className="text-slate-600">OFFLINE</div>
                          )}
                       </div>
                    </div>

                    <div className="max-w-md mx-auto space-y-4">
                       <div className="text-blue-400 font-orbitron tracking-[0.5em] text-xl">STARGATE COMMAND</div>
                       <p className="text-slate-400 text-sm">Enter 9-symbol coordinate sequence to dial remote gate.</p>
                       
                       <div className="flex gap-2">
                          <Input 
                             placeholder="XXX-XXX-XXX" 
                             className="bg-slate-800 border-slate-700 text-center font-mono text-xl tracking-widest text-white uppercase"
                             maxLength={11}
                             value={stargateAddress}
                             onChange={(e) => setStargateAddress(e.target.value)}
                          />
                          <Button 
                             className="bg-blue-600 hover:bg-blue-500 font-bold px-8"
                             onClick={handleStargateDial}
                             disabled={isDialing || !stargateAddress.trim() || deuteriumReserve < STARGATE_COST}
                          >
                             DIAL
                          </Button>
                       </div>
                       <div className="text-xs text-red-400 flex items-center justify-center gap-2">
                          <AlertTriangle className="w-3 h-3" /> WARNING: Unstable wormhole connection
                       </div>
                       {stargatesData?.stargates?.length ? (
                         <div className="text-xs text-slate-300">
                            Known Stargate addresses: {stargatesData.stargates.map((gate) => `${gate.location.galaxy}-${gate.location.sector}-${gate.location.system}`).join(", ")}
                         </div>
                       ) : null}
                    </div>
                 </CardContent>
              </Card>
           </TabsContent>
        </Tabs>
      </div>
    </GameLayout>
  );
}
