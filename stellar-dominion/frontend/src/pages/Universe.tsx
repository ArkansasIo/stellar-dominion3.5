import GameLayout from "@/components/layout/GameLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Globe,
  MapPin,
  Zap,
  Users,
  Clock,
  ChevronRight,
  Map,
  Grid3x3,
  Hexagon
} from "lucide-react";
import { useState } from "react";

interface Planet {
  id: string;
  name: string;
  class: string;
  owner?: string;
  alliance?: string;
  coordinates: string;
}

interface System {
  id: string;
  name: string;
  coordinates: string;
  planets: Planet[];
  activity: number;
}

interface Sector {
  id: string;
  name: string;
  coordinates: string;
  systems: System[];
}

interface Galaxy {
  id: string;
  name: string;
  coordinates: string;
  sectors: Sector[];
}

const GALAXIES: Galaxy[] = [
  {
    id: "gal1",
    name: "Nexus-Alpha",
    coordinates: "[1:0:0]",
    sectors: [
      {
        id: "sec1",
        name: "Sector 1",
        coordinates: "[1:1:0]",
        systems: [
          {
            id: "sys1",
            name: "Sol System",
            coordinates: "[1:1:100]",
            activity: 95,
            planets: [
              { id: "pl1", name: "Mercury", class: "R", coordinates: "[1:1:100:1]", owner: "Neutral" },
              { id: "pl2", name: "Venus", class: "V", coordinates: "[1:1:100:2]", owner: "Neutral" },
              { id: "pl3", name: "Earth", class: "M", coordinates: "[1:1:100:3]", owner: "Commander", alliance: "ADMIN" },
              { id: "pl4", name: "Mars", class: "D", coordinates: "[1:1:100:4]", owner: "Player_412", alliance: "SETTLERS" },
            ]
          },
          {
            id: "sys2",
            name: "Kepler System",
            coordinates: "[1:1:205]",
            activity: 72,
            planets: [
              { id: "pl5", name: "Kepler-452b", class: "M", coordinates: "[1:1:205:1]", owner: "Player_891", alliance: "EXPLORERS" },
              { id: "pl6", name: "Kepler-186f", class: "G", coordinates: "[1:1:205:2]", owner: "NPC_Station" },
            ]
          }
        ]
      },
      {
        id: "sec2",
        name: "Sector 2",
        coordinates: "[1:2:0]",
        systems: [
          {
            id: "sys3",
            name: "Andromeda Crossing",
            coordinates: "[1:2:156]",
            activity: 45,
            planets: [
              { id: "pl7", name: "Andromeda Prime", class: "M", coordinates: "[1:2:156:1]", owner: "Pirate Gang" },
              { id: "pl8", name: "Andromeda Minor", class: "A", coordinates: "[1:2:156:2]" },
            ]
          }
        ]
      }
    ]
  },
  {
    id: "gal2",
    name: "Cyborg-Beta",
    coordinates: "[2:0:0]",
    sectors: [
      {
        id: "sec3",
        name: "Sector 1",
        coordinates: "[2:1:0]",
        systems: [
          {
            id: "sys4",
            name: "Binary Star",
            coordinates: "[2:1:98]",
            activity: 88,
            planets: [
              { id: "pl9", name: "Twin Alpha", class: "T", coordinates: "[2:1:98:1]", owner: "TechCorp", alliance: "INDUSTRIAL" },
            ]
          }
        ]
      }
    ]
  }
];

export default function Universe() {
  const [selectedGalaxy, setSelectedGalaxy] = useState<Galaxy | null>(GALAXIES[0]);
  const [selectedSector, setSelectedSector] = useState<Sector | null>(GALAXIES[0].sectors[0]);
  const [selectedSystem, setSelectedSystem] = useState<System | null>(GALAXIES[0].sectors[0].systems[0]);
  const [searchCoordinates, setSearchCoordinates] = useState("");

  const handleGalaxySelect = (galaxy: Galaxy) => {
    setSelectedGalaxy(galaxy);
    setSelectedSector(galaxy.sectors[0]);
    setSelectedSystem(galaxy.sectors[0].systems[0]);
  };

  const handleSectorSelect = (sector: Sector) => {
    setSelectedSector(sector);
    setSelectedSystem(sector.systems[0]);
  };

  const getPlanetColor = (planetClass: string) => {
    const colors: Record<string, string> = {
      M: "bg-emerald-500",
      G: "bg-amber-400",
      D: "bg-slate-400",
      R: "bg-orange-600",
      V: "bg-yellow-500",
      T: "bg-cyan-500",
      A: "bg-gray-300"
    };
    return colors[planetClass] || "bg-blue-400";
  };

  const getActivityColor = (activity: number) => {
    if (activity > 75) return "text-red-600";
    if (activity > 50) return "text-yellow-600";
    return "text-green-600";
  };

  return (
    <GameLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
          <h2 className="text-3xl font-orbitron font-bold text-slate-900">Universe Map</h2>
          <p className="text-muted-foreground font-rajdhani text-lg">Navigate galaxies, sectors, systems, and planets across the known universe.</p>
        </div>

        {/* Search Bar */}
        <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-sm">
          <div className="flex gap-2 items-center">
            <MapPin className="w-5 h-5 text-slate-600" />
            <Input
              placeholder="Search by coordinates (e.g., [1:1:100:3])"
              value={searchCoordinates}
              onChange={(e) => setSearchCoordinates(e.target.value)}
              className="flex-1 bg-slate-50 border-slate-200"
              data-testid="input-search-coordinates"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Galaxies List */}
          <Card className="bg-white border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Globe className="w-5 h-5 text-slate-600" />
                Galaxies
              </CardTitle>
              <CardDescription>Known Galaxies in Universe</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {GALAXIES.map(gal => (
                <Button
                  key={gal.id}
                  variant={selectedGalaxy?.id === gal.id ? "default" : "outline"}
                  className="w-full justify-between text-left h-auto py-3"
                  onClick={() => handleGalaxySelect(gal)}
                  data-testid={`button-galaxy-${gal.id}`}
                >
                  <div>
                    <p className="font-semibold">{gal.name}</p>
                    <p className="text-xs opacity-75">{gal.coordinates}</p>
                  </div>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Sectors List */}
          <Card className="bg-white border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Grid3x3 className="w-5 h-5 text-slate-600" />
                Sectors
              </CardTitle>
              <CardDescription>{selectedGalaxy?.name}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {selectedGalaxy?.sectors.map(sec => (
                <Button
                  key={sec.id}
                  variant={selectedSector?.id === sec.id ? "default" : "outline"}
                  className="w-full justify-between text-left h-auto py-3"
                  onClick={() => handleSectorSelect(sec)}
                  data-testid={`button-sector-${sec.id}`}
                >
                  <div>
                    <p className="font-semibold">{sec.name}</p>
                    <p className="text-xs opacity-75">{sec.coordinates}</p>
                  </div>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Systems List */}
          <Card className="bg-white border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Hexagon className="w-5 h-5 text-slate-600" />
                Systems
              </CardTitle>
              <CardDescription>{selectedSector?.name}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {selectedSector?.systems.map(sys => (
                <Button
                  key={sys.id}
                  variant={selectedSystem?.id === sys.id ? "default" : "outline"}
                  className="w-full justify-between text-left h-auto py-3"
                  onClick={() => setSelectedSystem(sys)}
                  data-testid={`button-system-${sys.id}`}
                >
                  <div className="flex-1">
                    <p className="font-semibold">{sys.name}</p>
                    <div className="flex items-center gap-2 text-xs opacity-75">
                      <MapPin className="w-3 h-3" />
                      {sys.coordinates}
                    </div>
                  </div>
                  <div className={`text-xs font-bold ${getActivityColor(sys.activity)}`}>
                    {sys.activity}%
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Planets in Selected System */}
          <Card className="bg-white border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Map className="w-5 h-5 text-slate-600" />
                Planets
              </CardTitle>
              <CardDescription>{selectedSystem?.name}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {selectedSystem?.planets.map(planet => (
                <div
                  key={planet.id}
                  className="p-3 bg-slate-50 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer"
                  data-testid={`card-planet-${planet.id}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${getPlanetColor(planet.class)}`} />
                      <div>
                        <p className="font-semibold text-sm">{planet.name}</p>
                        <p className="text-xs text-slate-500">{planet.class}-Class</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">{planet.class}</Badge>
                  </div>
                  <div className="text-xs space-y-1">
                    <p className="text-slate-600 flex items-center gap-2">
                      <MapPin className="w-3 h-3" />
                      {planet.coordinates}
                    </p>
                    {planet.owner && (
                      <p className="text-slate-600">
                        Owner: <span className="font-semibold">{planet.owner}</span>
                      </p>
                    )}
                    {planet.alliance && (
                      <p className="text-slate-600">
                        Alliance: <span className="font-semibold text-primary">{planet.alliance}</span>
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Detailed Information Panel */}
        {selectedSystem && (
          <Card className="bg-gradient-to-r from-slate-50 to-blue-50 border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                System Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <p className="text-xs text-slate-600 uppercase font-bold mb-1">System Name</p>
                  <p className="text-lg font-bold text-slate-900">{selectedSystem.name}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-600 uppercase font-bold mb-1">Coordinates</p>
                  <p className="text-lg font-mono text-slate-900">{selectedSystem.coordinates}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-600 uppercase font-bold mb-1">Activity Level</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${selectedSystem.activity > 75 ? "bg-red-500" : selectedSystem.activity > 50 ? "bg-yellow-500" : "bg-green-500"}`}
                        style={{ width: `${selectedSystem.activity}%` }}
                      />
                    </div>
                    <span className="font-bold text-slate-900">{selectedSystem.activity}%</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-slate-600 uppercase font-bold mb-1">Planets</p>
                  <p className="text-lg font-bold text-slate-900">{selectedSystem.planets.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </GameLayout>
  );
}
