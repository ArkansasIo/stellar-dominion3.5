import { BACKGROUND_ASSETS, SHIP_ASSETS, MENU_ASSETS, OGAMEX_FEATURED_ASSETS } from "@shared/config";
import GameLayout from "@/components/layout/GameLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
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
  Search,
  Rocket,
  Orbit,
  Map,
  Users
} from "lucide-react";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

const TEMP_THEME_IMAGE = "/theme-temp.png";

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
  systemName?: string;
  star?: { type: string; name: string };
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

const PLANET_GRADIENT: Record<string, string> = {
  M: "from-blue-400 to-emerald-600",
  H: "from-yellow-500 to-orange-700",
  L: "from-lime-500 to-emerald-700",
  K: "from-red-700 to-stone-500",
  Y: "from-red-500 to-orange-900",
  D: "from-slate-400 to-stone-600",
  J: "from-amber-400 to-orange-700",
  T: "from-sky-300 to-indigo-600",
};

const getPlanetGradient = (cls?: string) =>
  cls && PLANET_GRADIENT[cls] ? PLANET_GRADIENT[cls] : "from-blue-500 to-purple-800";

const PLANET_CLASS_BADGE: Record<string, string> = {
  M: "bg-green-100 text-green-700",
  H: "bg-yellow-100 text-yellow-700",
  L: "bg-lime-100 text-lime-700",
  K: "bg-stone-100 text-stone-600",
  Y: "bg-red-100 text-red-700",
  D: "bg-slate-100 text-slate-600",
  J: "bg-orange-100 text-orange-700",
  T: "bg-sky-100 text-sky-700",
};

const STAR_INFO: Record<string, { label: string; color: string; glow: string }> = {
  O: { label: "Blue Giant",    color: "#9bb0ff", glow: "shadow-[0_0_16px_#9bb0ff]" },
  B: { label: "Blue-White",    color: "#aabfff", glow: "shadow-[0_0_14px_#aabfff]" },
  A: { label: "White Star",    color: "#e0e8ff", glow: "shadow-[0_0_12px_#cad7ff]" },
  F: { label: "Yellow-White",  color: "#fff8dc", glow: "shadow-[0_0_12px_#f8f7ff]" },
  G: { label: "Yellow Dwarf",  color: "#fff4ea", glow: "shadow-[0_0_12px_#ffe4a0]" },
  K: { label: "Orange Dwarf",  color: "#ffd2a1", glow: "shadow-[0_0_12px_#ffa060]" },
  M: { label: "Red Dwarf",     color: "#ffcc6f", glow: "shadow-[0_0_12px_#ff6040]" },
};

export default function Universe() {
   const { toast } = useToast();
   const [, setLocation] = useLocation();
   const searchParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : new URLSearchParams();
   const parsePositiveInt = (value: string | null, fallback: number) => {
      const parsed = Number.parseInt(value ?? "", 10);
      return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
   };

   const [universe, setUniverse] = useState(searchParams.get("universe") || "uni1");
   const [galaxy, setGalaxy] = useState(parsePositiveInt(searchParams.get("galaxy"), 1));
   const [sector, setSector] = useState(parsePositiveInt(searchParams.get("sector"), 1));
   const [system, setSystem] = useState(parsePositiveInt(searchParams.get("system"), 1));

  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      setUniverse(params.get("universe") || "uni1");
      setGalaxy(parsePositiveInt(params.get("galaxy"), 1));
      setSector(parsePositiveInt(params.get("sector"), 1));
      setSystem(parsePositiveInt(params.get("system"), 1));
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set("universe", universe);
    params.set("galaxy", String(galaxy));
    params.set("sector", String(sector));
    params.set("system", String(system));

    const nextUrl = `/universe?${params.toString()}`;
    const currentUrl = `${window.location.pathname}${window.location.search}`;

    if (currentUrl !== nextUrl) {
      window.history.replaceState(null, "", nextUrl);
    }
  }, [universe, galaxy, sector, system]);

  const { data: systemData, isFetching } = useQuery<SystemData>({
    queryKey: ["universe", universe, galaxy, sector, system],
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
            headers: { "Content-Type": "application/json" },
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
            headers: { "Content-Type": "application/json" },
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
            headers: { "Content-Type": "application/json" },
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

  const positions = systemData?.positions || [];
  const occupiedCount = positions.filter(p => p.type !== "empty").length;
  const playerCount = positions.filter(p => p.owner).length;
  const moonCount = positions.filter(p => p.moon).length;

  return (
    <GameLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <section className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm bg-cover bg-center" style={{ backgroundImage: `linear-gradient(rgba(15,23,42,0.78), rgba(15,23,42,0.92)), url(${BACKGROUND_ASSETS.GALAXY_MAP.path})` }}>
          <div className="p-5 lg:p-6 space-y-4 text-white">
            <div className="flex items-center gap-2">
              <img src={MENU_ASSETS.NAVIGATION.EMPIRE.path} alt="Icon" className="w-8 h-8 rounded-lg border border-white/10 bg-white/10 p-1.5 object-contain" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = TEMP_THEME_IMAGE; }} />
              <h1 className="text-2xl font-bold">Universe Map</h1>
            </div>
            <p className="text-sm leading-6 text-slate-300">Navigate and survey all known systems across the universe.</p>
            <div className="flex flex-wrap gap-3">
              {[{ label: "Galaxy Survey", image: SHIP_ASSETS.CAPITALS.BATTLECRUISER.path }, { label: "System Scanner", image: MENU_ASSETS.BUILDINGS.SHIPYARD.path }, { label: "Deep Space", image: OGAMEX_FEATURED_ASSETS.BACKGROUND.path }].map((item) => (
                <div key={item.label} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                  <img src={item.image} alt={item.label} className="w-10 h-10 rounded-lg border border-white/10 bg-black/10 p-1.5 object-contain" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = TEMP_THEME_IMAGE; }} />
                  <div className="text-sm font-semibold">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Universe Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card className="bg-white border-slate-200">
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center gap-2 text-xs uppercase text-slate-500 font-bold mb-1">
                <Map className="w-3 h-3" /> System Slots
              </div>
              <div className="text-xl font-bold text-slate-900">{positions.length}</div>
            </CardContent>
          </Card>
          <Card className="bg-white border-slate-200">
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center gap-2 text-xs uppercase text-slate-500 font-bold mb-1">
                <Globe className="w-3 h-3" /> Occupied
              </div>
              <div className="text-xl font-bold text-green-700">{occupiedCount}</div>
            </CardContent>
          </Card>
          <Card className="bg-white border-slate-200">
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center gap-2 text-xs uppercase text-slate-500 font-bold mb-1">
                <Users className="w-3 h-3" /> Players
              </div>
              <div className="text-xl font-bold text-blue-700">{playerCount}</div>
            </CardContent>
          </Card>
          <Card className="bg-white border-slate-200">
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center gap-2 text-xs uppercase text-slate-500 font-bold mb-1">
                <Orbit className="w-3 h-3" /> Moons
              </div>
              <div className="text-xl font-bold text-amber-700">{moonCount}</div>
            </CardContent>
          </Card>
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
           
           {/* Sector Nav */}
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

        {/* System Info / Star Display */}
        {systemData?.star && (
          <div className="bg-white border border-slate-200 p-4 rounded-lg flex items-center gap-4 shadow-sm">
            <div
              className={cn(
                "w-12 h-12 rounded-full flex-shrink-0",
                STAR_INFO[systemData.star.type]?.glow,
              )}
              style={{ background: `radial-gradient(circle at 35% 35%, white, ${STAR_INFO[systemData.star.type]?.color ?? "#ffe4a0"})` }}
            />
            <div>
              <div className="font-bold text-slate-900 font-orbitron text-lg">
                {systemData.systemName ?? systemData.star.name} System
              </div>
              <div className="text-sm text-muted-foreground font-rajdhani">
                Star: <span className="font-semibold text-slate-700">{systemData.star.name}</span>
                {" · "}Type <span className="font-semibold text-slate-700">{systemData.star.type}</span>
                {" · "}
                <span className="italic">{STAR_INFO[systemData.star.type]?.label ?? "Unknown"}</span>
                {" · "}
                <span className="font-semibold text-slate-700">{universe}</span>
                {" · "}
                <span className="font-mono text-xs">{galaxy}:{sector}:{system}</span>
              </div>
            </div>
          </div>
        )}

        {/* Universe Table */}
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm">
           <div className="max-h-[600px] overflow-y-auto">
           <Table>
             <TableHeader className="sticky top-0 bg-slate-50 z-10">
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
               {Array.from({ length: 50 }).map((_, i) => {
                 const pos = i + 1;
                 const data: SystemPosition = systemData?.positions?.find(p => p.position === pos) ||
                   { position: pos, type: "empty", name: "" };
                 const isMe = false;
                 
                 return (
                   <TableRow key={pos} className="border-slate-100 hover:bg-slate-50 transition-colors">
                      <TableCell className="text-center font-mono text-muted-foreground">{pos}</TableCell>
                      
                      {/* Visual Column */}
                      <TableCell>
                         {data.type === "planet" && (
                           <div className={cn("w-10 h-10 rounded-full bg-gradient-to-br shadow-sm border border-slate-200", getPlanetGradient(data.class))}></div>
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
                            data.class && PLANET_CLASS_BADGE[data.class]
                              ? PLANET_CLASS_BADGE[data.class]
                              : "bg-blue-100 text-blue-700"
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
      </div>
    </GameLayout>
  );
}
