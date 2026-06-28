import { useMemo, useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Crown, Factory, Globe, Hammer, Moon, Orbit, Shield, Ship, Sparkles, Star, Users } from "lucide-react";

import GameLayout from "@/components/layout/GameLayout";
import { useGame } from "@/lib/gameContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
};

type PlanetsResponse = { planets: PlanetSummary[] };

type SubPlaneResponse = {
  moon: {
    exists: boolean;
    name: string;
    level: number;
    stability: number;
    structures: Array<{ key: string; label: string; level: number }>;
  };
  station: {
    exists: boolean;
    name: string;
    level: number;
    integrity: number;
    modules: Array<{ key: string; label: string; level: number }>;
  };
  commandSummary: {
    defenseRating: number;
    logisticsRating: number;
    productionBonus: number;
  };
};

type DefenseResponse = {
  planetId: string;
  systems: Array<{ key: string; label: string; level: number; power: number }>;
  summary: {
    totalDefenseScore: number;
    activeSystems: number;
    strongestSystem: string;
  };
};

type MegaStructuresResponse = {
  structures: Array<{
    id: string;
    name: string;
    templateId: string;
    level: number;
    tier: number;
    isOperational?: boolean;
    coordinates?: string;
  }>;
};

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

  return (
    <GameLayout>
      <div className="space-y-6" data-testid="empire-command-center-page">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-3">
          <div>
            <h1 className="text-3xl font-orbitron font-bold text-slate-900 flex items-center gap-2">
              <Crown className="w-8 h-8 text-amber-500" /> Empire Command Center
            </h1>
            <p className="text-slate-600">Unified overview for colonies, orbital command, megastructures, and construction-yard operations.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">Planets: {planetsQuery.data?.planets?.length || 0}</Badge>
            <Badge variant="outline">Missions: {activeMissions.length}</Badge>
            <Badge variant="outline">Fleet Units: {num(totalUnits)}</Badge>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card><CardContent className="p-4"><div className="text-xs text-slate-500 uppercase">Total Buildings</div><div className="text-2xl font-orbitron font-bold">{num(totalBuildings)}</div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="text-xs text-slate-500 uppercase">Research Levels</div><div className="text-2xl font-orbitron font-bold text-emerald-700">{num(totalResearch)}</div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="text-xs text-slate-500 uppercase">Orbital Structures</div><div className="text-2xl font-orbitron font-bold text-indigo-700">{num(totalOrbitalStructures)}</div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="text-xs text-slate-500 uppercase">Megastructures</div><div className="text-2xl font-orbitron font-bold text-rose-700">{megastructuresQuery.data?.structures?.length || 0}</div></CardContent></Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card><CardContent className="p-4"><div className="text-xs text-slate-500 uppercase">Unread Command Reports</div><div className="text-2xl font-orbitron font-bold text-amber-700">{unreadMessages}</div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="text-xs text-slate-500 uppercase">Defense Readiness</div><div className="text-2xl font-orbitron font-bold text-emerald-700">{defenseScore}</div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="text-xs text-slate-500 uppercase">Strategic Posture</div><div className="text-2xl font-orbitron font-bold text-indigo-700">{activeMissions.length > 3 ? "Aggressive" : "Balanced"}</div></CardContent></Card>
        </div>

        <Card>
          <CardHeader><CardTitle className="text-base">Command Doctrine</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-slate-600">
            <div className="rounded border border-slate-200 bg-slate-50 p-3">Maintain colony growth and orbital upgrades in parallel for steady macro scaling.</div>
            <div className="rounded border border-slate-200 bg-slate-50 p-3">Keep defense systems above baseline before committing high-value fleet missions.</div>
            <div className="rounded border border-slate-200 bg-slate-50 p-3">Use megastructures as long-cycle multipliers, not short-term resource fixes.</div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="colonies">Colonies</TabsTrigger>
            <TabsTrigger value="orbital">Moon/Station/Starbase</TabsTrigger>
            <TabsTrigger value="megastructures">Megastructures</TabsTrigger>
            <TabsTrigger value="construction">Construction Yard</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader><CardTitle className="text-base flex items-center gap-2"><Users className="w-4 h-4" /> Empire Identity</CardTitle></CardHeader>
                <CardContent className="space-y-2 text-sm text-slate-700">
                  <div>Commander: <span className="font-semibold">{commander.name}</span></div>
                  <div>Government: <span className="font-semibold">{government.type}</span></div>
                  <div>Alliance: <span className="font-semibold">{alliance?.name || "Independent"}</span></div>
                  <div>Unread Messages: <span className="font-semibold">{messages.filter((message) => !message.read).length}</span></div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="text-base flex items-center gap-2"><Globe className="w-4 h-4" /> Resource Outlook</CardTitle></CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div>Metal: <span className="font-mono font-semibold">{num(resources.metal)}</span></div>
                  <div>Crystal: <span className="font-mono font-semibold">{num(resources.crystal)}</span></div>
                  <div>Deuterium: <span className="font-mono font-semibold">{num(resources.deuterium)}</span></div>
                  <div>Energy: <span className="font-mono font-semibold">{num(resources.energy)}</span></div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="text-base flex items-center gap-2"><Ship className="w-4 h-4" /> Operations Snapshot</CardTitle></CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div>Active Missions: <span className="font-semibold">{activeMissions.length}</span></div>
                  <div>Total Units: <span className="font-semibold">{num(totalUnits)}</span></div>
                  <div>Primary Planet: <span className="font-semibold">{planetsQuery.data?.planets?.[0]?.name || "N/A"}</span></div>
                  <div>Defense Score: <span className="font-semibold">{defenseQuery.data?.summary?.totalDefenseScore || 0}</span></div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="colonies" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {(planetsQuery.data?.planets || []).map((planet) => (
                <Card key={planet.id}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center justify-between">
                      <span>{planet.name}</span>
                      <Badge variant={planet.colonized ? "default" : "outline"}>{planet.colonized ? "Colonized" : "Unclaimed"}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-slate-700">
                    <div>Coordinates: <span className="font-mono">[{planet.coordinates}]</span></div>
                    <div>Type/Class: <span className="font-semibold">{planet.type || "Unknown"} / {planet.class || "-"}</span></div>
                    <div>Population: <span className="font-semibold">{num(planet.population)}</span></div>
                    <div>Defense: <span className="font-semibold">{num(planet.defenses)}</span></div>
                    <div className="pt-2 flex gap-2">
                      <Link href={`/planet/${planet.id}`}><Button size="sm" variant="outline">Planet View</Button></Link>
                      <Link href="/colonies"><Button size="sm">Open Colonies</Button></Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="orbital" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader><CardTitle className="text-base flex items-center gap-2"><Moon className="w-4 h-4" /> Moon Base</CardTitle></CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div>Name: <span className="font-semibold">{subPlanesQuery.data?.moon?.name || "Moon Base"}</span></div>
                  <div>Level: <span className="font-semibold">{subPlanesQuery.data?.moon?.level || 0}</span></div>
                  <div>Stability: <span className="font-semibold">{subPlanesQuery.data?.moon?.stability || 0}%</span></div>
                  <div>Modules: <span className="font-semibold">{subPlanesQuery.data?.moon?.structures?.length || 0}</span></div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="text-base flex items-center gap-2"><Orbit className="w-4 h-4" /> Space Station</CardTitle></CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div>Name: <span className="font-semibold">{subPlanesQuery.data?.station?.name || "Space Station"}</span></div>
                  <div>Level: <span className="font-semibold">{subPlanesQuery.data?.station?.level || 0}</span></div>
                  <div>Integrity: <span className="font-semibold">{subPlanesQuery.data?.station?.integrity || 0}%</span></div>
                  <div>Modules: <span className="font-semibold">{subPlanesQuery.data?.station?.modules?.length || 0}</span></div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="text-base flex items-center gap-2"><Star className="w-4 h-4" /> Starbase Hub</CardTitle></CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div>Defense Rating: <span className="font-semibold">{subPlanesQuery.data?.commandSummary?.defenseRating || 0}</span></div>
                  <div>Logistics Rating: <span className="font-semibold">{subPlanesQuery.data?.commandSummary?.logisticsRating || 0}</span></div>
                  <div>Production Bonus: <span className="font-semibold">+{subPlanesQuery.data?.commandSummary?.productionBonus || 0}%</span></div>
                  <div>Defense Systems: <span className="font-semibold">{defenseQuery.data?.summary?.activeSystems || 0}</span></div>
                </CardContent>
              </Card>
            </div>
            <div className="flex gap-2">
              <Link href="/planet-command"><Button><Shield className="w-4 h-4 mr-2" /> Planet Command</Button></Link>
              <Link href="/stations"><Button variant="outline"><Orbit className="w-4 h-4 mr-2" /> Stations</Button></Link>
            </div>
          </TabsContent>

          <TabsContent value="megastructures" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {(megastructuresQuery.data?.structures || []).map((structure) => (
                <Card key={structure.id}>
                  <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><Sparkles className="w-4 h-4 text-rose-500" /> {structure.name}</CardTitle></CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div>Template: <span className="font-semibold">{structure.templateId}</span></div>
                    <div>Level/Tier: <span className="font-semibold">{structure.level} / {structure.tier}</span></div>
                    <div>Status: <span className="font-semibold">{structure.isOperational ? "Operational" : "Standby"}</span></div>
                    <div>Coordinates: <span className="font-mono">{structure.coordinates || "Unassigned"}</span></div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Link href="/megastructures"><Button><Orbit className="w-4 h-4 mr-2" /> Open Megastructures</Button></Link>
          </TabsContent>

          <TabsContent value="construction" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              <Card><CardHeader><CardTitle className="text-base flex items-center gap-2"><Hammer className="w-4 h-4" /> Construction Yard</CardTitle></CardHeader><CardContent className="text-sm space-y-1"><div>Robotics Factory: <span className="font-semibold">{buildings.roboticsFactory}</span></div><div>Shipyard: <span className="font-semibold">{buildings.shipyard}</span></div><div>Research Lab: <span className="font-semibold">{buildings.researchLab}</span></div></CardContent></Card>
              <Card><CardHeader><CardTitle className="text-base flex items-center gap-2"><Factory className="w-4 h-4" /> Planetary Industry</CardTitle></CardHeader><CardContent className="text-sm space-y-1"><div>Metal Mine: <span className="font-semibold">{buildings.metalMine}</span></div><div>Crystal Mine: <span className="font-semibold">{buildings.crystalMine}</span></div><div>Deuterium Synthesizer: <span className="font-semibold">{buildings.deuteriumSynthesizer}</span></div><div>Solar Plant: <span className="font-semibold">{buildings.solarPlant}</span></div></CardContent></Card>
              <Card><CardHeader><CardTitle className="text-base flex items-center gap-2"><Ship className="w-4 h-4" /> Fleet Construction</CardTitle></CardHeader><CardContent className="text-sm space-y-1"><div>Total Units Built: <span className="font-semibold">{num(totalUnits)}</span></div><div>Ready Missions: <span className="font-semibold">{activeMissions.length}</span></div><div>Best next action: <span className="font-semibold">Expand shipyard queue</span></div></CardContent></Card>
              <Card><CardHeader><CardTitle className="text-base flex items-center gap-2"><Star className="w-4 h-4" /> Orbital Yard</CardTitle></CardHeader><CardContent className="text-sm space-y-1"><div>Starbase Hub: <span className="font-semibold">{orbitalBuildings.starbaseHub || 0}</span></div><div>Orbital Shipyard: <span className="font-semibold">{orbitalBuildings.orbitalShipyard || 0}</span></div><div>Defense Grid: <span className="font-semibold">{orbitalBuildings.defenseGrid || 0}</span></div></CardContent></Card>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/facilities"><Button variant="outline">Facilities</Button></Link>
              <Link href="/shipyard"><Button>Shipyard</Button></Link>
              <Link href="/fleet"><Button variant="outline">Fleet</Button></Link>
              <Link href="/army"><Button variant="outline">Army</Button></Link>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </GameLayout>
  );
}