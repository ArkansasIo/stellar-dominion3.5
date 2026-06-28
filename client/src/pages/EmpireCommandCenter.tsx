import { useMemo, useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Crown, Factory, Globe, Hammer, Moon, Orbit, Shield, Ship, Sparkles, Star, Users, Rocket, Swords, BookOpen, BarChart3, Bell, Settings, Zap, Clock, TrendingUp, Target, Navigation } from "lucide-react";

import GameLayout from "@/components/layout/GameLayout";
import { useGame } from "@/lib/gameContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { BACKGROUND_ASSETS, SHIP_ASSETS, MENU_ASSETS, OGAMEX_FEATURED_ASSETS } from "@shared/config";

type PlanetSummary = {
  id: string;
  name: string;
  coordinates: string;
  colonized: boolean;
  type?: string;
  class?: string;
  population?: number;
  defenses?: number;
  waterPercentage?: number;
  temperature?: number;
  size?: number;
  image?: string;
};

type PlanetsResponse = { planets: PlanetSummary[] };

type SubPlaneResponse = {
  moon: { exists: boolean; name: string; level: number; stability: number; structures: Array<{ key: string; label: string; level: number }> };
  station: { exists: boolean; name: string; level: number; integrity: number; modules: Array<{ key: string; label: string; level: number }> };
  commandSummary: { defenseRating: number; logisticsRating: number; productionBonus: number };
};

type DefenseResponse = {
  planetId: string;
  systems: Array<{ key: string; label: string; level: number; power: number }>;
  summary: { totalDefenseScore: number; activeSystems: number; strongestSystem: string };
};

type MegaStructuresResponse = {
  structures: Array<{ id: string; name: string; templateId: string; level: number; tier: number; isOperational?: boolean; coordinates?: string }>;
};

const TEMP_THEME_IMAGE = "/theme-temp.png";

function num(value: number | undefined) {
  return Math.floor(value || 0).toLocaleString();
}

export default function EmpireCommandCenter() {
  const { resources, buildings, orbitalBuildings, research, units, activeMissions, alliance, messages, commander, government } = useGame();
  const [activeTab, setActiveTab] = useState("overview");

  const planetsQuery = useQuery<PlanetsResponse>({ queryKey: ["/api/planets"] });
  const primaryPlanetId = planetsQuery.data?.planets?.[0]?.id;

  const subPlanesQuery = useQuery<SubPlaneResponse>({
    queryKey: ["empire-command-subplanes", primaryPlanetId || "none"],
    queryFn: async () => {
      const response = await fetch(`/api/planets/${primaryPlanetId}/sub-planes`, { credentials: "include" });
      if (!response.ok) throw new Error("Failed to load sub-plane data");
      return response.json();
    },
    enabled: Boolean(primaryPlanetId),
  });

  const defenseQuery = useQuery<DefenseResponse>({
    queryKey: ["empire-command-defense", primaryPlanetId || "none"],
    queryFn: async () => {
      const response = await fetch(`/api/planets/${primaryPlanetId}/defense`, { credentials: "include" });
      if (!response.ok) throw new Error("Failed to load defense data");
      return response.json();
    },
    enabled: Boolean(primaryPlanetId),
  });

  const megastructuresQuery = useQuery<MegaStructuresResponse>({ queryKey: ["/api/megastructures/player"] });

  const totalUnits = useMemo(() => Object.values(units).reduce((sum, amount) => sum + amount, 0), [units]);
  const totalResearch = useMemo(() => Object.values(research).reduce((sum, amount) => sum + amount, 0), [research]);
  const totalBuildings = useMemo(() => Object.values(buildings).reduce((sum, amount) => sum + amount, 0), [buildings]);
  const totalOrbitalStructures = useMemo(() => Object.values(orbitalBuildings).reduce((sum, amount) => sum + amount, 0), [orbitalBuildings]);
  const unreadMessages = messages.filter((message) => !message.read).length;
  const defenseScore = defenseQuery.data?.summary?.totalDefenseScore || 0;

  const resourceRate = useMemo(() => ({
    metal: Math.floor((buildings.metalMine || 0) * 30 * (1 + 0.1 * (buildings.metalMine || 0))),
    crystal: Math.floor((buildings.crystalMine || 0) * 20 * (1 + 0.1 * (buildings.crystalMine || 0))),
    deuterium: Math.floor((buildings.deuteriumSynthesizer || 0) * 10 * (1 + 0.1 * (buildings.deuteriumSynthesizer || 0))),
  }), [buildings]);

  const planets = planetsQuery.data?.planets || [];
  const colonizedPlanets = planets.filter((p) => p.colonized);
  const uncolonizedPlanets = planets.filter((p) => !p.colonized);

  return (
    <GameLayout>
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 shadow-sm bg-cover bg-center mb-6" style={{ backgroundImage: `linear-gradient(rgba(15,23,42,0.78), rgba(15,23,42,0.92)), url(${BACKGROUND_ASSETS.GALAXY_MAP.path})` }}>
        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-4">
            <img src={SHIP_ASSETS.CAPITALS.BATTLESHIP.path} alt="Empire Command Center" className="w-16 h-16 rounded-2xl border border-white/10 bg-white/5 p-2 object-contain" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = TEMP_THEME_IMAGE; }} />
            <div>
              <h1 className="text-2xl font-orbitron font-bold text-white">Empire Command Center</h1>
              <p className="text-slate-300 text-sm mt-1">Unified overview for colonies, orbital command, megastructures, and construction-yard operations.</p>
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-6" data-testid="empire-command-center-page">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-3">
          <div>
            <h1 className="text-3xl font-orbitron font-bold text-slate-900 flex items-center gap-2">
              <Crown className="w-8 h-8 text-amber-500" /> Empire Command Center
            </h1>
            <p className="text-slate-600">Unified overview for colonies, orbital command, megastructures, and construction-yard operations.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">Planets: {planets.length}</Badge>
            <Badge variant="outline">Missions: {activeMissions.length}</Badge>
            <Badge variant="outline">Fleet: {num(totalUnits)}</Badge>
            {unreadMessages > 0 && <Badge className="bg-amber-500 text-white">{unreadMessages} unread</Badge>}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center overflow-hidden">
                  <img src={MENU_ASSETS.BUILDINGS.ROBOTICS_FACTORY.path} alt="Buildings" className="w-8 h-8 object-contain" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = TEMP_THEME_IMAGE; }} />
                </div>
                <div>
                  <div className="text-xs text-indigo-600 uppercase">Total Buildings</div>
                  <div className="text-2xl font-orbitron font-bold text-indigo-900">{num(totalBuildings)}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center overflow-hidden">
                  <img src={MENU_ASSETS.BUILDINGS.RESEARCH_LAB.path} alt="Research" className="w-8 h-8 object-contain" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = TEMP_THEME_IMAGE; }} />
                </div>
                <div>
                  <div className="text-xs text-emerald-600 uppercase">Research Levels</div>
                  <div className="text-2xl font-orbitron font-bold text-emerald-900">{num(totalResearch)}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-violet-50 to-violet-100 border-violet-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-violet-500/10 flex items-center justify-center overflow-hidden">
                  <img src={SHIP_ASSETS.SPECIAL.CARRIER.path} alt="Orbital" className="w-8 h-8 object-contain" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = TEMP_THEME_IMAGE; }} />
                </div>
                <div>
                  <div className="text-xs text-violet-600 uppercase">Orbital Structures</div>
                  <div className="text-2xl font-orbitron font-bold text-violet-900">{num(totalOrbitalStructures)}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-rose-50 to-rose-100 border-rose-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center overflow-hidden">
                  <img src={OGAMEX_FEATURED_ASSETS.SHIPS.path} alt="Megastructures" className="w-8 h-8 object-contain" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = TEMP_THEME_IMAGE; }} />
                </div>
                <div>
                  <div className="text-xs text-rose-600 uppercase">Megastructures</div>
                  <div className="text-2xl font-orbitron font-bold text-rose-900">{megastructuresQuery.data?.structures?.length || 0}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center overflow-hidden">
                  <img src={MENU_ASSETS.BUILDINGS.TRADE_STATION.path} alt="Reports" className="w-8 h-8 object-contain" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = TEMP_THEME_IMAGE; }} />
                </div>
                <div>
                  <div className="text-xs text-slate-500 uppercase">Unread Reports</div>
                  <div className="text-2xl font-orbitron font-bold text-amber-700">{unreadMessages}</div>
                </div>
              </div>
              <Bell className="w-8 h-8 text-amber-400" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center overflow-hidden">
                  <img src={SHIP_ASSETS.CAPITALS.BATTLESHIP.path} alt="Defense" className="w-8 h-8 object-contain" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = TEMP_THEME_IMAGE; }} />
                </div>
                <div>
                  <div className="text-xs text-slate-500 uppercase">Defense Readiness</div>
                  <div className="text-2xl font-orbitron font-bold text-emerald-700">{defenseScore.toLocaleString()}</div>
                </div>
              </div>
              <Shield className="w-8 h-8 text-emerald-400" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center overflow-hidden">
                  <img src={MENU_ASSETS.RESOURCES.METAL.path} alt="Resources" className="w-8 h-8 object-contain" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = TEMP_THEME_IMAGE; }} />
                </div>
                <div>
                  <div className="text-xs text-slate-500 uppercase">Resource Rate</div>
                  <div className="text-2xl font-orbitron font-bold text-blue-700">{resourceRate.metal.toLocaleString()}/h</div>
                </div>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-400" />
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-6 w-full">
            <TabsTrigger value="overview"><Crown className="w-4 h-4 mr-1" /> Overview</TabsTrigger>
            <TabsTrigger value="colonies"><Globe className="w-4 h-4 mr-1" /> Colonies</TabsTrigger>
            <TabsTrigger value="orbital"><Orbit className="w-4 h-4 mr-1" /> Orbital</TabsTrigger>
            <TabsTrigger value="military"><Swords className="w-4 h-4 mr-1" /> Military</TabsTrigger>
            <TabsTrigger value="megastructures"><Sparkles className="w-4 h-4 mr-1" /> Mega</TabsTrigger>
            <TabsTrigger value="economy"><BarChart3 className="w-4 h-4 mr-1" /> Economy</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader><CardTitle className="text-base flex items-center gap-2"><Users className="w-4 h-4" /> Empire Identity</CardTitle></CardHeader>
                <CardContent className="space-y-2 text-sm text-slate-700">
                  <div>Commander: <span className="font-semibold">{commander.name}</span></div>
                  <div>Government: <span className="font-semibold">{government.type || "None"}</span></div>
                  <div>Alliance: <span className="font-semibold">{alliance?.name || "Independent"}</span></div>
                  <div>Messages: <span className="font-semibold">{unreadMessages} unread / {messages.length} total</span></div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="text-base flex items-center gap-2"><Globe className="w-4 h-4" /> Resource Stockpile</CardTitle></CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div>Metal: <span className="font-mono font-semibold">{num(resources.metal)}</span></div>
                  <div>Crystal: <span className="font-mono font-semibold">{num(resources.crystal)}</span></div>
                  <div>Deuterium: <span className="font-mono font-semibold">{num(resources.deuterium)}</span></div>
                  <div>Energy: <span className="font-mono font-semibold">{num(resources.energy)}</span></div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="text-base flex items-center gap-2"><Ship className="w-4 h-4" /> Operations</CardTitle></CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div>Active Missions: <span className="font-semibold">{activeMissions.length}</span></div>
                  <div>Total Units: <span className="font-semibold">{num(totalUnits)}</span></div>
                  <div>Primary Planet: <span className="font-semibold">{planets[0]?.name || "N/A"}</span></div>
                  <div>Defense Score: <span className="font-semibold">{defenseScore.toLocaleString()}</span></div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="colonies" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <div className="text-xs uppercase text-green-700">Colonized</div>
                    <div className="text-2xl font-bold text-green-900">{colonizedPlanets.length}</div>
                  </div>
                  <Globe className="w-8 h-8 text-green-500" />
                </CardContent>
              </Card>
              <Card className="bg-slate-50 border-slate-200">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <div className="text-xs uppercase text-slate-600">Unclaimed</div>
                    <div className="text-2xl font-bold text-slate-900">{uncolonizedPlanets.length}</div>
                  </div>
                  <Star className="w-8 h-8 text-slate-400" />
                </CardContent>
              </Card>
            </div>

            {planets.length === 0 ? (
              <div className="text-center py-8 text-slate-500">No planets found. Explore the galaxy to discover new worlds.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {planets.map((planet) => (
                  <Card key={planet.id} className={cn(!planet.colonized && "opacity-70")}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{planet.name}</CardTitle>
                        <Badge variant={planet.colonized ? "default" : "outline"}>
                          {planet.colonized ? "Colonized" : "Unclaimed"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div><span className="text-slate-500">Coords: </span><span className="font-mono">[{planet.coordinates}]</span></div>
                        <div><span className="text-slate-500">Class: </span><span>{planet.class || planet.type || "Unknown"}</span></div>
                        {planet.population !== undefined && <div><span className="text-slate-500">Pop: </span><span>{num(planet.population)}</span></div>}
                        {planet.defenses !== undefined && <div><span className="text-slate-500">Def: </span><span>{num(planet.defenses)}</span></div>}
                        {planet.temperature !== undefined && <div><span className="text-slate-500">Temp: </span><span>{planet.temperature}°C</span></div>}
                        {planet.size !== undefined && <div><span className="text-slate-500">Size: </span><span>{num(planet.size)} km</span></div>}
                      </div>
                      <div className="pt-2 flex gap-2">
                        <Link href={`/planet/${planet.id}`}><Button size="sm" variant="outline">View</Button></Link>
                        {planet.colonized && <Link href={`/planet-command`}><Button size="sm">Command</Button></Link>}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="orbital" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Card className="bg-indigo-50 border-indigo-200">
                <CardHeader><CardTitle className="text-base flex items-center gap-2"><Moon className="w-4 h-4" /> Moon Base</CardTitle></CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between"><span>Name</span><span className="font-semibold">{subPlanesQuery.data?.moon?.name || "Moon Base"}</span></div>
                  <div className="flex justify-between"><span>Level</span><span className="font-semibold">{subPlanesQuery.data?.moon?.level || 0}</span></div>
                  <div className="flex justify-between"><span>Stability</span><span className="font-semibold">{subPlanesQuery.data?.moon?.stability || 0}%</span></div>
                  <Progress value={subPlanesQuery.data?.moon?.stability || 0} className="h-2" />
                  <div className="flex justify-between"><span>Modules</span><span className="font-semibold">{subPlanesQuery.data?.moon?.structures?.length || 0}</span></div>
                </CardContent>
              </Card>
              <Card className="bg-sky-50 border-sky-200">
                <CardHeader><CardTitle className="text-base flex items-center gap-2"><Orbit className="w-4 h-4" /> Space Station</CardTitle></CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between"><span>Name</span><span className="font-semibold">{subPlanesQuery.data?.station?.name || "Space Station"}</span></div>
                  <div className="flex justify-between"><span>Level</span><span className="font-semibold">{subPlanesQuery.data?.station?.level || 0}</span></div>
                  <div className="flex justify-between"><span>Integrity</span><span className="font-semibold">{subPlanesQuery.data?.station?.integrity || 0}%</span></div>
                  <Progress value={subPlanesQuery.data?.station?.integrity || 0} className="h-2" />
                  <div className="flex justify-between"><span>Modules</span><span className="font-semibold">{subPlanesQuery.data?.station?.modules?.length || 0}</span></div>
                </CardContent>
              </Card>
              <Card className="bg-amber-50 border-amber-200">
                <CardHeader><CardTitle className="text-base flex items-center gap-2"><Star className="w-4 h-4" /> Starbase Hub</CardTitle></CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between"><span>Defense Rating</span><span className="font-semibold">{subPlanesQuery.data?.commandSummary?.defenseRating || 0}</span></div>
                  <div className="flex justify-between"><span>Logistics Rating</span><span className="font-semibold">{subPlanesQuery.data?.commandSummary?.logisticsRating || 0}</span></div>
                  <div className="flex justify-between"><span>Production Bonus</span><span className="font-semibold">+{subPlanesQuery.data?.commandSummary?.productionBonus || 0}%</span></div>
                  <Progress value={(subPlanesQuery.data?.commandSummary?.productionBonus || 0) / 2} className="h-2" />
                  <div className="flex justify-between"><span>Defense Systems</span><span className="font-semibold">{defenseQuery.data?.summary?.activeSystems || 0}</span></div>
                </CardContent>
              </Card>
            </div>
            <div className="flex gap-2">
              <Link href="/planet-command"><Button><Shield className="w-4 h-4 mr-2" /> Planet Command</Button></Link>
              <Link href="/stations"><Button variant="outline"><Orbit className="w-4 h-4 mr-2" /> Stations</Button></Link>
              <Link href="/starbases"><Button variant="outline"><Star className="w-4 h-4 mr-2" /> Starbases</Button></Link>
            </div>
          </TabsContent>

          <TabsContent value="military" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader><CardTitle className="text-base flex items-center gap-2"><Swords className="w-4 h-4" /> Fleet Summary</CardTitle></CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between"><span>Total Ships</span><span className="font-bold">{num(totalUnits)}</span></div>
                  <div className="flex justify-between"><span>Active Missions</span><span className="font-bold">{activeMissions.length}</span></div>
                  <div className="flex justify-between"><span>Defense Score</span><span className="font-bold">{defenseScore.toLocaleString()}</span></div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="text-base flex items-center gap-2"><Users className="w-4 h-4" /> Personnel</CardTitle></CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between"><span>Commander Level</span><span className="font-bold">{commander.stats.level || 1}</span></div>
                  <div className="flex justify-between"><span>Government Type</span><span className="font-bold capitalize">{government.type || "None"}</span></div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="text-base flex items-center gap-2"><Target className="w-4 h-4" /> Quick Actions</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  <Link href="/fleet"><Button variant="outline" size="sm" className="w-full"><Ship className="w-3 h-3 mr-2" /> Fleet Command</Button></Link>
                  <Link href="/ground-combat"><Button variant="outline" size="sm" className="w-full"><Swords className="w-3 h-3 mr-2" /> Ground Combat</Button></Link>
                  <Link href="/army"><Button variant="outline" size="sm" className="w-full"><Users className="w-3 h-3 mr-2" /> Army</Button></Link>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="megastructures" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {(megastructuresQuery.data?.structures || []).length === 0 ? (
                <div className="col-span-full text-center py-8 text-slate-500">
                  <Sparkles className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                  No megastructures yet. Build them from the Megastructures page.
                </div>
              ) : (
                (megastructuresQuery.data?.structures || []).map((structure) => (
                  <Card key={structure.id}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-rose-500" /> {structure.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div className="flex justify-between"><span>Template</span><span className="font-semibold">{structure.templateId}</span></div>
                      <div className="flex justify-between"><span>Level/Tier</span><span className="font-semibold">{structure.level}/{structure.tier}</span></div>
                      <div className="flex justify-between">
                        <span>Status</span>
                        <Badge variant={structure.isOperational ? "default" : "secondary"}>
                          {structure.isOperational ? "Operational" : "Standby"}
                        </Badge>
                      </div>
                      <div className="flex justify-between"><span>Location</span><span className="font-mono text-xs">{structure.coordinates || "Unassigned"}</span></div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
            <Link href="/megastructures"><Button><Orbit className="w-4 h-4 mr-2" /> Megastructures Hub</Button></Link>
          </TabsContent>

          <TabsContent value="economy" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              <Card>
                <CardHeader><CardTitle className="text-base flex items-center gap-2"><Hammer className="w-4 h-4" /> Construction</CardTitle></CardHeader>
                <CardContent className="text-sm space-y-1">
                  <div className="flex justify-between"><span>Robotics</span><span className="font-semibold">{buildings.roboticsFactory}</span></div>
                  <div className="flex justify-between"><span>Shipyard</span><span className="font-semibold">{buildings.shipyard}</span></div>
                  <div className="flex justify-between"><span>Research Lab</span><span className="font-semibold">{buildings.researchLab}</span></div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="text-base flex items-center gap-2"><Factory className="w-4 h-4" /> Production</CardTitle></CardHeader>
                <CardContent className="text-sm space-y-1">
                  <div className="flex justify-between"><span>Metal Mine</span><span className="font-semibold">{buildings.metalMine}</span></div>
                  <div className="flex justify-between"><span>Crystal Mine</span><span className="font-semibold">{buildings.crystalMine}</span></div>
                  <div className="flex justify-between"><span>Deuterium</span><span className="font-semibold">{buildings.deuteriumSynthesizer}</span></div>
                  <div className="flex justify-between"><span>Solar Plant</span><span className="font-semibold">{buildings.solarPlant}</span></div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="text-base flex items-center gap-2"><TrendingUp className="w-4 h-4" /> Rates (per hour)</CardTitle></CardHeader>
                <CardContent className="text-sm space-y-1">
                  <div className="flex justify-between"><span>Metal</span><span className="font-mono font-semibold">{resourceRate.metal.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span>Crystal</span><span className="font-mono font-semibold">{resourceRate.crystal.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span>Deuterium</span><span className="font-mono font-semibold">{resourceRate.deuterium.toLocaleString()}</span></div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="text-base flex items-center gap-2"><Ship className="w-4 h-4" /> Orbital</CardTitle></CardHeader>
                <CardContent className="text-sm space-y-1">
                  <div className="flex justify-between"><span>Starbase Hub</span><span className="font-semibold">{orbitalBuildings.starbaseHub || 0}</span></div>
                  <div className="flex justify-between"><span>Orbital Shipyard</span><span className="font-semibold">{orbitalBuildings.orbitalShipyard || 0}</span></div>
                  <div className="flex justify-between"><span>Defense Grid</span><span className="font-semibold">{orbitalBuildings.defenseGrid || 0}</span></div>
                </CardContent>
              </Card>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/facilities"><Button variant="outline">Facilities</Button></Link>
              <Link href="/resources"><Button variant="outline">Resources</Button></Link>
              <Link href="/shipyard"><Button>Shipyard</Button></Link>
              <Link href="/market"><Button variant="outline">Market</Button></Link>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </GameLayout>
  );
}
