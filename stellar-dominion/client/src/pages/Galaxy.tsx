import GameLayout from "@/components/layout/GameLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Globe, 
  ChevronLeft, 
  ChevronRight, 
  MessageSquare, 
  ShieldAlert, 
  Hexagon, 
  Triangle, 
  CircleDot, 
  Orbit,
  Search,
  Rocket
} from "lucide-react";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

type SystemObjectType = "planet" | "asteroid" | "nebula" | "blackhole" | "station" | "empty";

interface SystemPosition {
  position: number;
  type: SystemObjectType;
  name: string;
  owner?: string;
  alliance?: string;
  debris?: { metal: number; crystal: number };
  moon?: boolean;
  class?: string;
}

interface SystemData {
  universe: string;
  galaxy: number;
  sector: number;
  system: number;
  positions: SystemPosition[];
}

interface ScanResponse {
   success: boolean;
   message: string;
   report: {
      targetName: string;
      targetType: SystemObjectType;
      threatLevel: "low" | "medium" | "high";
      anomalies: string[];
      estimatedResources: { metal: number; crystal: number; deuterium: number };
      timestamp: number;
   };
}

interface FleetActionPayload {
   targetName: string;
   destination: string;
   missionType: "attack" | "espionage";
   ships: Record<string, number>;
}

interface MessageActionPayload {
   targetName: string;
   recipientName: string;
   destination: string;
}

export default function Galaxy() {
   const { toast } = useToast();
   const [, setLocation] = useLocation();
   const searchParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : new URLSearchParams();
   const parsePositiveInt = (value: string | null, fallback: number) => {
      const parsed = Number.parseInt(value ?? "", 10);
      return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
   };

   const [universe, setUniverse] = useState(searchParams.get("universe") || "uni1");
   const [galaxy, setGalaxy] = useState(parsePositiveInt(searchParams.get("galaxy"), 1));
   const [sector, setSector] = useState(parsePositiveInt(searchParams.get("sector"), 4)); 
   const [system, setSystem] = useState(parsePositiveInt(searchParams.get("system"), 102));

  const { data: systemData, isFetching } = useQuery<SystemData>({
    queryKey: ["galaxy", universe, galaxy, sector, system],
    queryFn: async () => {
      const res = await fetch(`/api/galaxy/${universe}/${galaxy}/${sector}/${system}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load system data");
      return res.json();
    },
    staleTime: 30_000,
  });

   const deepScanMutation = useMutation({
      mutationFn: async (target: { position: number; name: string; type: SystemObjectType }) => {
         const response = await fetch(`/api/galaxy/${universe}/${galaxy}/${sector}/${system}/scan`, {
            method: "POST",
            credentials: "include",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               position: target.position,
               targetName: target.name,
               targetType: target.type,
            }),
         });

         const payload = await response.json().catch(() => null);
         if (!response.ok) {
            throw new Error(payload?.error || payload?.message || "Deep scan failed");
         }

         return payload as ScanResponse;
      },
      onSuccess: (result) => {
         const report = result.report;
         toast({
            title: `Scan Complete · ${report.targetName}`,
            description: `${report.threatLevel.toUpperCase()} threat | M ${report.estimatedResources.metal.toLocaleString()} · C ${report.estimatedResources.crystal.toLocaleString()} · D ${report.estimatedResources.deuterium.toLocaleString()} | ${report.anomalies.join(", ")}`,
         });
      },
      onError: (error: Error) => {
         toast({ title: "Deep scan failed", description: error.message, variant: "destructive" });
      },
   });

   const fleetActionMutation = useMutation({
      mutationFn: async (payload: FleetActionPayload) => {
         const response = await fetch("/api/game/send-fleet", {
            method: "POST",
            credentials: "include",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               destination: payload.destination,
               missionType: payload.missionType,
               ships: payload.ships,
            }),
         });

         const data = await response.json().catch(() => null);
         if (!response.ok) {
            throw new Error(data?.error || data?.message || "Fleet dispatch failed");
         }

         return { ...data, payload };
      },
      onSuccess: (result) => {
         toast({
            title: "Fleet dispatched",
            description: result?.message || `${result.payload.missionType} mission launched toward ${result.payload.targetName}.`,
         });
         setLocation("/fleet?tab=active");
      },
      onError: (error: Error) => {
         toast({ title: "Fleet dispatch failed", description: error.message, variant: "destructive" });
      },
   });

   const messageActionMutation = useMutation({
      mutationFn: async (payload: MessageActionPayload) => {
         const response = await fetch("/api/messages", {
            method: "POST",
            credentials: "include",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               to: payload.recipientName,
               subject: `Transmission from ${universe} ${galaxy}:${sector}:${system}`,
               body: `Scouting transmission for ${payload.targetName} at coordinates ${payload.destination}. Requesting diplomatic channel confirmation.`,
               type: "player",
            }),
         });

         const data = await response.json().catch(() => null);
         if (!response.ok) {
            throw new Error(data?.error || data?.message || "Message send failed");
         }

         return { ...data, payload };
      },
      onSuccess: (result) => {
         toast({
            title: "Message sent",
            description: `Transmission delivered to ${result.payload.recipientName}.`,
         });
      },
      onError: (error: Error) => {
         toast({ title: "Message failed", description: error.message, variant: "destructive" });
      },
   });

  return (
    <GameLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
          <h2 className="text-3xl font-orbitron font-bold text-slate-900">Galaxy View</h2>
          <p className="text-muted-foreground font-rajdhani text-lg">Scan surrounding sectors and systems for resources and anomalies.</p>
        </div>

        {/* Navigation Bar */}
        <div className="bg-white border border-slate-200 p-4 rounded-lg flex flex-wrap justify-center items-center gap-4 shadow-sm">
           
           {/* Universe Selector */}
           <div className="flex items-center gap-2">
              <span className="text-muted-foreground uppercase text-xs font-bold">Universe</span>
              <Select value={universe} onValueChange={setUniverse}>
                <SelectTrigger className="w-[140px] bg-slate-50 border-slate-200 text-slate-900 h-8">
                  <SelectValue placeholder="Select Universe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="uni1">Nexus-Alpha</SelectItem>
                  <SelectItem value="uni2">Cyborg-Beta</SelectItem>
                  <SelectItem value="uni3">Quantum-Gamma</SelectItem>
                </SelectContent>
              </Select>
           </div>

           <div className="h-8 w-px bg-slate-200 mx-2 hidden md:block" />

           {/* Galaxy Nav */}
           <div className="flex items-center gap-2">
              <span className="text-muted-foreground uppercase text-xs font-bold">Galaxy</span>
              <div className="flex items-center">
                 <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setGalaxy(g => Math.max(1, g - 1))}><ChevronLeft className="w-4 h-4" /></Button>
                 <Input className="w-14 h-8 text-center font-mono bg-slate-50 border-slate-200 text-slate-900" value={galaxy} onChange={(e) => setGalaxy(parseInt(e.target.value) || 1)} />
                 <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setGalaxy(g => g + 1)}><ChevronRight className="w-4 h-4" /></Button>
              </div>
           </div>
           
           {/* Sector Nav (New) */}
           <div className="flex items-center gap-2">
              <span className="text-muted-foreground uppercase text-xs font-bold text-primary">Sector</span>
              <div className="flex items-center">
                 <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSector(s => Math.max(1, s - 1))}><ChevronLeft className="w-4 h-4" /></Button>
                 <Input className="w-14 h-8 text-center font-mono bg-slate-50 border-primary/30 text-primary font-bold" value={sector} onChange={(e) => setSector(parseInt(e.target.value) || 1)} />
                 <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSector(s => s + 1)}><ChevronRight className="w-4 h-4" /></Button>
              </div>
           </div>

           {/* System Nav */}
           <div className="flex items-center gap-2">
              <span className="text-muted-foreground uppercase text-xs font-bold">System</span>
              <div className="flex items-center">
                 <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSystem(s => Math.max(1, s - 1))}><ChevronLeft className="w-4 h-4" /></Button>
                 <Input className="w-16 h-8 text-center font-mono bg-slate-50 border-slate-200 text-slate-900" value={system} onChange={(e) => setSystem(parseInt(e.target.value) || 1)} />
                 <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSystem(s => s + 1)}><ChevronRight className="w-4 h-4" /></Button>
              </div>
           </div>
           
           <Button className="ml-auto bg-primary/10 text-primary hover:bg-primary/20 border border-primary/30 h-8 text-xs uppercase tracking-wider">
              <Orbit className="w-3 h-3 mr-2" /> Expedition
           </Button>
        </div>

        {/* Galaxy Table */}
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
           <Table>
             <TableHeader>
               <TableRow className="bg-slate-50 border-slate-200 hover:bg-slate-50">
                 <TableHead className="text-center w-[60px] text-slate-700">Pos</TableHead>
                 <TableHead className="w-[80px] text-slate-700">Visual</TableHead>
                 <TableHead className="text-slate-700">Name</TableHead>
                 <TableHead className="text-slate-700">Class</TableHead>
                 <TableHead className="text-slate-700">Moon/Debris</TableHead>
                 <TableHead className="text-slate-700">Player / Status</TableHead>
                 <TableHead className="text-slate-700">Alliance</TableHead>
                 <TableHead className="text-right text-slate-700">Actions</TableHead>
               </TableRow>
             </TableHeader>
             <TableBody>
               {isFetching && !systemData && (
                 <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">Loading system data...</TableCell></TableRow>
               )}
               {Array.from({ length: 15 }).map((_, i) => {
                 const pos = i + 1;
                 const data: SystemPosition = systemData?.positions?.find(p => p.position === pos) ||
                   { position: pos, type: "empty", name: "" };
                 const isMe = false; // Server sets real owner names; local identity resolved server-side
                 
                 return (
                   <TableRow key={pos} className="border-slate-100 hover:bg-slate-50 transition-colors">
                      <TableCell className="text-center font-mono text-muted-foreground">{pos}</TableCell>
                      
                      {/* Visual Column */}
                      <TableCell>
                         {data.type === "planet" && (
                           <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-800 shadow-sm border border-slate-200"></div>
                         )}
                         {data.type === "asteroid" && (
                           <div className="w-10 h-10 flex items-center justify-center">
                             <div className="w-8 h-8 rounded bg-slate-300 rotate-45 border border-slate-400"></div>
                           </div>
                         )}
                         {data.type === "blackhole" && (
                           <div className="w-10 h-10 rounded-full bg-black shadow-[0_0_10px_rgba(0,0,0,0.5)] border border-slate-800 flex items-center justify-center">
                             <div className="w-9 h-9 rounded-full border border-white/20"></div>
                           </div>
                         )}
                         {data.type === "nebula" && (
                           <div className="w-10 h-10 rounded-full bg-purple-100 blur-sm opacity-80"></div>
                         )}
                         {data.type === "station" && (
                            <div className="w-10 h-10 flex items-center justify-center">
                              <Hexagon className="w-8 h-8 text-slate-600 fill-slate-200" />
                            </div>
                         )}
                      </TableCell>
                      
                      {/* Name Column */}
                      <TableCell>
                         {data.type !== "empty" ? (
                            <div className={cn("font-medium", isMe ? "text-primary" : "text-slate-700")}>
                               {data.name}
                            </div>
                         ) : (
                            <span className="text-muted-foreground/30 italic">-- Empty Space --</span>
                         )}
                      </TableCell>

                      {/* Class/Type Column */}
                      <TableCell>
                         {data.type === "asteroid" && <Badge variant="outline" className="border-slate-400 text-slate-600">Asteroid</Badge>}
                         {data.type === "blackhole" && <Badge variant="destructive" className="bg-black hover:bg-black text-white">Singularity</Badge>}
                         {data.type === "nebula" && <Badge variant="secondary" className="bg-purple-100 text-purple-700 hover:bg-purple-100">Nebula</Badge>}
                         {data.type === "station" && <Badge variant="outline" className="border-red-400 text-red-600">Pirate Base</Badge>}
                         {data.type === "planet" && <Badge variant="secondary" className={cn(
                            data.class === "M" ? "bg-green-100 text-green-700" :
                            data.class === "Y" ? "bg-red-100 text-red-700" :
                            data.class === "J" ? "bg-orange-100 text-orange-700" :
                            "bg-blue-100 text-blue-700"
                         )}>Class {data.class}</Badge>}
                      </TableCell>
                      
                      {/* Moon/Debris Column */}
                      <TableCell>
                         <div className="flex items-center gap-2">
                            {data.moon && <div className="w-4 h-4 rounded-full bg-slate-300 border border-slate-400" title="Moon"></div>}
                            {data.debris && (
                               <div className="flex items-center text-xs text-yellow-600 font-mono" title={`Metal: ${data.debris.metal}, Crystal: ${data.debris.crystal}`}>
                                  <Triangle className="w-3 h-3 mr-1 fill-yellow-600 rotate-180" /> 
                                  <span>D-Field</span>
                               </div>
                            )}
                         </div>
                      </TableCell>
                      
                      {/* Player Column */}
                      <TableCell>
                         {data.owner && (
                            <span className={cn(
                              "font-medium",
                              isMe ? "text-green-600" : data.type === "station" ? "text-red-600" : "text-red-500"
                            )}>
                               {data.owner}
                               {data.type === "station" && " (Hostile)"}
                            </span>
                         )}
                      </TableCell>
                      
                      {/* Alliance Column */}
                      <TableCell>
                         {data.alliance && <span className="text-blue-500 font-bold">[{data.alliance}]</span>}
                      </TableCell>
                      
                      {/* Actions Column */}
                      <TableCell className="text-right">
                         {data.type !== "empty" && !isMe && (
                            <div className="flex justify-end gap-2">
                                                                     <Button
                                                                        size="icon"
                                                                        variant="ghost"
                                                                        className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600"
                                                                        onClick={() => deepScanMutation.mutate({ position: pos, name: data.name || `Position ${pos}`, type: data.type })}
                                                                        disabled={deepScanMutation.isPending}
                                                                     >
                                 <Search className="w-4 h-4" />
                               </Button>
                               {(data.type === "planet" || data.type === "station") && (
                                 <>
                                                                                 <Button
                                                                                    size="icon"
                                                                                    variant="ghost"
                                                                                    className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600"
                                                                                    onClick={() => messageActionMutation.mutate({
                                                                                       targetName: data.name || `Position ${pos}`,
                                                                                       recipientName: data.owner || "",
                                                                                       destination: `${galaxy}:${system}:${pos}`,
                                                                                    })}
                                                                                    disabled={messageActionMutation.isPending || !data.owner}
                                                                                 ><MessageSquare className="w-4 h-4" /></Button>
                                                                                 <Button
                                                                                    size="icon"
                                                                                    variant="ghost"
                                                                                    className="h-8 w-8 hover:bg-red-50 hover:text-red-600"
                                                                                    onClick={() => fleetActionMutation.mutate({
                                                                                       targetName: data.name || `Position ${pos}`,
                                                                                       destination: `${galaxy}:${system}:${pos}`,
                                                                                       missionType: "attack",
                                                                                       ships: { lightFighter: 10, cruiser: 2 },
                                                                                    })}
                                                                                    disabled={fleetActionMutation.isPending}
                                                                                 ><ShieldAlert className="w-4 h-4" /></Button>
                                 </>
                               )}
                               {(data.type === "asteroid" || data.type === "blackhole") && (
                                                                            <Button
                                                                               size="icon"
                                                                               variant="ghost"
                                                                               className="h-8 w-8 hover:bg-yellow-50 hover:text-yellow-600"
                                                                               onClick={() => fleetActionMutation.mutate({
                                                                                  targetName: data.name || `Position ${pos}`,
                                                                                  destination: `${galaxy}:${system}:${pos}`,
                                                                                  missionType: "espionage",
                                                                                  ships: { espionageProbe: 3, smallCargo: 1 },
                                                                               })}
                                                                               disabled={fleetActionMutation.isPending}
                                                                            ><Rocket className="w-4 h-4" /></Button>
                               )}
                            </div>
                         )}
                      </TableCell>
                   </TableRow>
                 );
               })}
             </TableBody>
           </Table>
        </div>
      </div>
    </GameLayout>
  );
}
