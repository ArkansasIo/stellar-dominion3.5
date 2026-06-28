import GameLayout from "@/components/layout/GameLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Globe, 
  Zap, 
  Droplets, 
  Flame,
  MapPin,
  RefreshCw,
  Scan,
  Maximize2,
  Moon,
  Activity,
  Sun,
  Star,
  Orbit,
  Compass,
  Thermometer,
  Gauge
} from "lucide-react";
import { useState } from "react";
import { 
  generateSystem, 
  generateGalaxy, 
  CelestialObject, 
  Habitability,
  SOL_SYSTEM,
  NEARBY_GALAXIES,
  getSolSystemPlanets,
  getSolSystemMoons,
  getSolSystemDwarfPlanets,
  getMoonsOfPlanet,
  UniverseGenerator,
  DEFAULT_UNIVERSE_SEED
} from "@/lib/universeSeed";

function getHabitabilityColor(habitability: Habitability | undefined): string {
  switch (habitability) {
    case "ideal": return "text-green-600";
    case "adequate": return "text-blue-600";
    case "marginal": return "text-yellow-600";
    case "barren": return "text-slate-600";
    case "hostile": return "text-red-600";
    default: return "text-slate-500";
  }
}

function getPlanetClassColor(planetClass: string): string {
  const colors: Record<string, string> = {
    M: "bg-blue-500",
    G: "bg-amber-400",
    D: "bg-slate-400",
    R: "bg-orange-600",
    V: "bg-yellow-500",
    T: "bg-cyan-500",
    A: "bg-gray-300",
    K: "bg-purple-500",
    J: "bg-orange-200",
    I: "bg-blue-300"
  };
  return colors[planetClass] || "bg-slate-400";
}

function getPlanetTypeColor(type: string): string {
  const colors: Record<string, string> = {
    planet: "bg-blue-500",
    dwarf_planet: "bg-purple-500",
    moon: "bg-slate-400",
    star: "bg-yellow-500",
    asteroid: "bg-amber-600",
    comet: "bg-cyan-400"
  };
  return colors[type] || "bg-slate-400";
}

export default function UniverseGeneratorPage() {
  const [galaxyX, setGalaxyX] = useState(1);
  const [galaxyY, setGalaxyY] = useState(1);
  const [galaxyZ, setGalaxyZ] = useState(1);
  const [systemX, setSystemX] = useState(0);
  const [systemY, setSystemY] = useState(0);
  const [systemZ, setSystemZ] = useState(0);
  const [customSeed, setCustomSeed] = useState(DEFAULT_UNIVERSE_SEED.masterSeed);
  const [objects, setObjects] = useState<CelestialObject[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);

  const handleGenerateSystem = () => {
    setLoading(true);
    setTimeout(() => {
      const coords = { x: systemX, y: systemY, z: systemZ };
      const generated = generateSystem(coords);
      setObjects(generated);
      setLoading(false);
    }, 100);
  };

  const handleGenerateGalaxy = () => {
    setLoading(true);
    setTimeout(() => {
      const generated = generateGalaxy(galaxyX, galaxyY, galaxyZ);
      setObjects(generated);
      setLoading(false);
    }, 500);
  };

  const planets = objects.filter(obj => obj.type === "planet");
  const moons = objects.filter(obj => obj.type === "moon");
  const asteroids = objects.filter(obj => obj.type === "asteroid");
  const stars = objects.filter(obj => obj.type === "star");

  const solPlanets = getSolSystemPlanets();
  const solMoons = getSolSystemMoons();
  const solDwarfPlanets = getSolSystemDwarfPlanets();

  return (
    <GameLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
          <h2 className="text-3xl font-orbitron font-bold text-slate-900">Universe Generator</h2>
          <p className="text-muted-foreground font-rajdhani text-lg">Procedurally generate entire star systems and galaxies with deterministic seeding.</p>
        </div>

        <Tabs defaultValue="sol" className="w-full">
          <TabsList className="bg-white border border-slate-200 h-12 w-full justify-start overflow-x-auto">
            <TabsTrigger value="sol" className="font-orbitron" data-testid="tab-sol">
              <Sun className="w-4 h-4 mr-2" /> Sol System
            </TabsTrigger>
            <TabsTrigger value="galaxies" className="font-orbitron" data-testid="tab-galaxies">
              <Star className="w-4 h-4 mr-2" /> Nearby Galaxies
            </TabsTrigger>
            <TabsTrigger value="generator" className="font-orbitron" data-testid="tab-generator">
              <Compass className="w-4 h-4 mr-2" /> Procedural Generator
            </TabsTrigger>
            <TabsTrigger value="seed" className="font-orbitron" data-testid="tab-seed">
              <Orbit className="w-4 h-4 mr-2" /> Universe Seed
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sol" className="mt-6 space-y-6">
            <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sun className="w-5 h-5 text-yellow-600" />
                  Sol System - Our Home
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-3 bg-white rounded-lg border border-yellow-200">
                    <p className="text-2xl font-bold text-yellow-600">1</p>
                    <p className="text-xs text-slate-600 uppercase">Star (G2V)</p>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg border border-blue-200">
                    <p className="text-2xl font-bold text-blue-600">{solPlanets.length}</p>
                    <p className="text-xs text-slate-600 uppercase">Planets</p>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg border border-purple-200">
                    <p className="text-2xl font-bold text-purple-600">{solDwarfPlanets.length}</p>
                    <p className="text-xs text-slate-600 uppercase">Dwarf Planets</p>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg border border-slate-200">
                    <p className="text-2xl font-bold text-slate-600">{solMoons.length}</p>
                    <p className="text-xs text-slate-600 uppercase">Moons</p>
                  </div>
                </div>

                <div className="p-4 bg-yellow-100 rounded-lg mb-6 border border-yellow-300">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
                      <Sun className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-yellow-900">Sol (The Sun)</h3>
                      <p className="text-sm text-yellow-800">Type: G2V Yellow Dwarf Star</p>
                      <p className="text-xs text-yellow-700">Temperature: 5,778 K | Mass: 1.989 × 10³⁰ kg</p>
                      <p className="text-xs text-yellow-600 mt-1">Coordinates: 0:0:0:0:0</p>
                    </div>
                  </div>
                </div>

                <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Globe className="w-5 h-5" /> Planets
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {solPlanets.map((planet) => {
                    const planetMoons = getMoonsOfPlanet(planet.id);
                    return (
                      <div
                        key={planet.id}
                        className={`p-4 bg-white rounded-lg border-2 transition-all cursor-pointer ${
                          selectedPlanet === planet.id 
                            ? 'border-blue-500 shadow-lg' 
                            : 'border-slate-200 hover:border-blue-300'
                        }`}
                        onClick={() => setSelectedPlanet(selectedPlanet === planet.id ? null : planet.id)}
                        data-testid={`card-sol-planet-${planet.id}`}
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`w-10 h-10 rounded-full ${getPlanetTypeColor(planet.type)} flex items-center justify-center`}>
                            <Globe className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{planet.name}</p>
                            <p className="text-xs text-slate-500">Orbit {planet.coordinates.orbit}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span className="text-slate-600">Radius:</span>
                            <span className="font-mono">{planet.properties.radius?.toLocaleString()} km</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Gravity:</span>
                            <span className="font-mono">{planet.properties.surfaceGravity?.toFixed(2)} m/s²</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Temp:</span>
                            <span className="font-mono">{planet.properties.meanTemperature} K</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Orbital Period:</span>
                            <span className="font-mono">{planet.properties.orbitalPeriod} days</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Moons:</span>
                            <span className="font-mono font-bold text-blue-600">{planetMoons.length}</span>
                          </div>
                        </div>

                        {planet.properties.rings && (
                          <Badge className="mt-2 bg-purple-100 text-purple-700">Has Rings</Badge>
                        )}
                        {planet.properties.habitable && (
                          <Badge className="mt-2 ml-1 bg-green-100 text-green-700">Habitable</Badge>
                        )}

                        <p className="text-xs text-slate-500 mt-3 line-clamp-2">{planet.properties.description}</p>
                        
                        <div className="mt-2 pt-2 border-t border-slate-100">
                          <p className="text-xs text-slate-400 font-mono">📍 {planet.coordinateString}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {selectedPlanet && (
                  <div className="mb-6">
                    <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                      <Moon className="w-5 h-5" /> Moons of {SOL_SYSTEM.bodies.find(b => b.id === selectedPlanet)?.name}
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                      {getMoonsOfPlanet(selectedPlanet).map((moon) => (
                        <div
                          key={moon.id}
                          className="p-3 bg-slate-50 rounded-lg border border-slate-200"
                          data-testid={`card-sol-moon-${moon.id}`}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-6 h-6 rounded-full bg-slate-400 flex items-center justify-center">
                              <Moon className="w-3 h-3 text-white" />
                            </div>
                            <p className="font-bold text-sm text-slate-900">{moon.name}</p>
                          </div>
                          <div className="space-y-1 text-xs text-slate-600">
                            <p>Radius: {moon.properties.radius?.toLocaleString()} km</p>
                            <p>Period: {moon.properties.orbitalPeriod?.toFixed(1)} days</p>
                          </div>
                          <p className="text-xs text-slate-400 font-mono mt-2">📍 {moon.coordinateString}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Orbit className="w-5 h-5" /> Dwarf Planets
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {solDwarfPlanets.map((dwarf) => (
                    <div
                      key={dwarf.id}
                      className="p-3 bg-purple-50 rounded-lg border border-purple-200"
                      data-testid={`card-sol-dwarf-${dwarf.id}`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-purple-400 flex items-center justify-center">
                          <Globe className="w-4 h-4 text-white" />
                        </div>
                        <p className="font-bold text-sm text-purple-900">{dwarf.name}</p>
                      </div>
                      <div className="space-y-1 text-xs text-purple-700">
                        <p>Radius: {dwarf.properties.radius?.toLocaleString()} km</p>
                        <p>Orbit: {dwarf.properties.orbitalPeriod?.toLocaleString()} days</p>
                        <p>Distance: {dwarf.properties.distanceFromParent} AU</p>
                      </div>
                      <p className="text-xs text-purple-500 font-mono mt-2">📍 {dwarf.coordinateString}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="galaxies" className="mt-6 space-y-6">
            <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-indigo-600" />
                  Nearby Galaxies in the Local Group
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {NEARBY_GALAXIES.map((galaxy) => (
                    <div
                      key={galaxy.id}
                      className="p-4 bg-white rounded-lg border border-indigo-200 hover:border-indigo-400 transition-all"
                      data-testid={`card-galaxy-${galaxy.id}`}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          galaxy.type === 'spiral' ? 'bg-gradient-to-br from-blue-400 to-purple-500' :
                          galaxy.type === 'elliptical' ? 'bg-gradient-to-br from-yellow-400 to-orange-500' :
                          'bg-gradient-to-br from-slate-400 to-slate-600'
                        }`}>
                          <Star className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{galaxy.name}</p>
                          <Badge className="text-xs capitalize">{galaxy.type}</Badge>
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Stars:</span>
                          <span className="font-mono">{(galaxy.starCount / 1e9).toFixed(0)}B</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Diameter:</span>
                          <span className="font-mono">{galaxy.diameter.toLocaleString()} ly</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Size Class:</span>
                          <span className="font-mono capitalize">{galaxy.size}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Distance:</span>
                          <span className="font-mono">{Math.sqrt(galaxy.coordinates.x**2 + galaxy.coordinates.y**2).toLocaleString()} ly</span>
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t border-slate-100">
                        <p className="text-xs text-slate-400">
                          Position: ({galaxy.coordinates.x.toLocaleString()}, {galaxy.coordinates.y.toLocaleString()}, {galaxy.coordinates.z.toLocaleString()})
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="generator" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="bg-white border-slate-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Generate System
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-xs font-bold text-slate-600 uppercase mb-1 block">X Coordinate</label>
                      <Input
                        type="number"
                        value={systemX}
                        onChange={(e) => setSystemX(parseInt(e.target.value) || 0)}
                        className="h-8 text-sm"
                        data-testid="input-system-x"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-600 uppercase mb-1 block">Y Coordinate</label>
                      <Input
                        type="number"
                        value={systemY}
                        onChange={(e) => setSystemY(parseInt(e.target.value) || 0)}
                        className="h-8 text-sm"
                        data-testid="input-system-y"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-600 uppercase mb-1 block">Z Coordinate</label>
                      <Input
                        type="number"
                        value={systemZ}
                        onChange={(e) => setSystemZ(parseInt(e.target.value) || 0)}
                        className="h-8 text-sm"
                        data-testid="input-system-z"
                      />
                    </div>
                  </div>
                  <Button
                    onClick={handleGenerateSystem}
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    data-testid="button-generate-system"
                  >
                    {loading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Scan className="w-4 h-4 mr-2" />}
                    Generate System
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white border-slate-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Maximize2 className="w-5 h-5" />
                    Generate Galaxy
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-xs font-bold text-slate-600 uppercase mb-1 block">Galaxy X</label>
                      <Input
                        type="number"
                        value={galaxyX}
                        onChange={(e) => setGalaxyX(parseInt(e.target.value) || 0)}
                        className="h-8 text-sm"
                        data-testid="input-galaxy-x"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-600 uppercase mb-1 block">Galaxy Y</label>
                      <Input
                        type="number"
                        value={galaxyY}
                        onChange={(e) => setGalaxyY(parseInt(e.target.value) || 0)}
                        className="h-8 text-sm"
                        data-testid="input-galaxy-y"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-600 uppercase mb-1 block">Galaxy Z</label>
                      <Input
                        type="number"
                        value={galaxyZ}
                        onChange={(e) => setGalaxyZ(parseInt(e.target.value) || 0)}
                        className="h-8 text-sm"
                        data-testid="input-galaxy-z"
                      />
                    </div>
                  </div>
                  <Button
                    onClick={handleGenerateGalaxy}
                    disabled={loading}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    data-testid="button-generate-galaxy"
                  >
                    {loading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Maximize2 className="w-4 h-4 mr-2" />}
                    Generate Galaxy (Slow)
                  </Button>
                </CardContent>
              </Card>
            </div>

            {objects.length > 0 && (
              <>
                <Card className="bg-gradient-to-r from-slate-50 to-blue-50 border-slate-200">
                  <CardHeader>
                    <CardTitle className="text-lg">Generation Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-slate-900">{stars.length}</p>
                        <p className="text-xs text-slate-600 uppercase">Stars</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">{planets.length}</p>
                        <p className="text-xs text-slate-600 uppercase">Planets</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-slate-600">{moons.length}</p>
                        <p className="text-xs text-slate-600 uppercase">Moons</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-amber-600">{asteroids.length}</p>
                        <p className="text-xs text-slate-600 uppercase">Asteroids</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-emerald-600">{objects.length}</p>
                        <p className="text-xs text-slate-600 uppercase">Total Objects</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {planets.length > 0 && (
                  <Card className="bg-white border-slate-200">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Globe className="w-5 h-5" />
                        Generated Planets ({planets.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {planets.slice(0, 12).map((planet) => (
                          <div
                            key={planet.id}
                            className="p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-slate-300"
                            data-testid={`card-planet-${planet.id}`}
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <div className={`w-6 h-6 rounded-full ${getPlanetClassColor(planet.planetClass || "M")}`} />
                                <div>
                                  <p className="font-bold text-sm text-slate-900">{planet.name}</p>
                                  <p className="text-xs text-slate-500">{planet.planetClass}-Class</p>
                                </div>
                              </div>
                              <Badge className={getHabitabilityColor(planet.habitability)}>
                                {planet.habitability}
                              </Badge>
                            </div>
                            
                            <div className="space-y-2 text-xs">
                              <div className="flex items-center justify-between">
                                <span className="text-slate-600">Diameter:</span>
                                <span className="font-mono font-bold">{planet.diameter?.toLocaleString()}km</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-slate-600">Gravity:</span>
                                <span className="font-mono font-bold">{planet.gravity?.toFixed(2)}G</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-slate-600">Temperature:</span>
                                <span className="font-mono font-bold">{planet.temperature}°C</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-slate-600">Water:</span>
                                <span className="font-mono font-bold">{planet.waterPercentage?.toFixed(1)}%</span>
                              </div>
                            </div>

                            {planet.mineralAbundance && (
                              <div className="mt-3 pt-3 border-t border-slate-200 space-y-1">
                                <div className="flex items-center gap-2 text-xs">
                                  <Zap className="w-3 h-3 text-yellow-600" />
                                  <span className="font-mono">Metal: {planet.mineralAbundance.metal}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                  <Activity className="w-3 h-3 text-blue-600" />
                                  <span className="font-mono">Crystal: {planet.mineralAbundance.crystal}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                  <Droplets className="w-3 h-3 text-cyan-600" />
                                  <span className="font-mono">Deuterium: {planet.mineralAbundance.deuterium}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {asteroids.length > 0 && (
                  <Card className="bg-white border-slate-200">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Flame className="w-5 h-5" />
                        Generated Asteroids ({asteroids.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                        {asteroids.slice(0, 20).map((asteroid) => (
                          <div
                            key={asteroid.id}
                            className="p-3 bg-amber-50 rounded border border-amber-200 text-xs"
                            data-testid={`card-asteroid-${asteroid.id}`}
                          >
                            <p className="font-bold text-amber-900 mb-2">{asteroid.name}</p>
                            <div className="space-y-1 text-amber-800">
                              <p>Type: {asteroid.asteroidType}</p>
                              <p>Size: {asteroid.size}km</p>
                              <p>Metal: {asteroid.mineralAbundance?.metal}</p>
                              <p>Rare: {asteroid.mineralAbundance?.deuterium}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </TabsContent>

          <TabsContent value="seed" className="mt-6 space-y-6">
            <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Orbit className="w-5 h-5 text-emerald-600" />
                  Universe Seed Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-white rounded-lg border border-emerald-200">
                  <h4 className="font-bold text-lg mb-4">No Man's Sky-Style Seed System</h4>
                  <p className="text-sm text-slate-600 mb-4">
                    Enter a custom seed to generate a unique, deterministic universe. The same seed will always 
                    produce the exact same galaxies, star systems, planets, and moons.
                  </p>
                  <div className="flex gap-3">
                    <Input
                      value={customSeed}
                      onChange={(e) => setCustomSeed(e.target.value)}
                      placeholder="Enter universe seed..."
                      className="flex-1"
                      data-testid="input-universe-seed"
                    />
                    <Button 
                      className="bg-emerald-600 hover:bg-emerald-700"
                      data-testid="button-apply-seed"
                    >
                      Apply Seed
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-white rounded-lg border border-slate-200">
                    <h5 className="font-bold mb-3 flex items-center gap-2">
                      <Gauge className="w-4 h-4" /> Universe Size Parameters
                    </h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Galaxies:</span>
                        <span className="font-mono font-bold">{DEFAULT_UNIVERSE_SEED.galaxyCount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Sectors per Galaxy:</span>
                        <span className="font-mono font-bold">{DEFAULT_UNIVERSE_SEED.sectorsPerGalaxy}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Systems per Sector:</span>
                        <span className="font-mono font-bold">{DEFAULT_UNIVERSE_SEED.systemsPerSector}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Planets per System:</span>
                        <span className="font-mono font-bold">{DEFAULT_UNIVERSE_SEED.minPlanetsPerSystem} - {DEFAULT_UNIVERSE_SEED.maxPlanetsPerSystem}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-white rounded-lg border border-slate-200">
                    <h5 className="font-bold mb-3 flex items-center gap-2">
                      <Thermometer className="w-4 h-4" /> Star Type Distribution
                    </h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">O (Blue Giant):</span>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-blue-400" />
                          <span className="font-mono">0.003%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">G (Yellow Dwarf):</span>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-yellow-400" />
                          <span className="font-mono">7.6%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">K (Orange Dwarf):</span>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-orange-400" />
                          <span className="font-mono">12.1%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">M (Red Dwarf):</span>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-red-400" />
                          <span className="font-mono">76.5%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-100 rounded-lg">
                  <h5 className="font-bold mb-2">Current Master Seed</h5>
                  <p className="font-mono text-lg text-emerald-700 break-all">{customSeed}</p>
                  <p className="text-xs text-slate-500 mt-2">
                    Total potential objects: ~{(
                      DEFAULT_UNIVERSE_SEED.galaxyCount * 
                      DEFAULT_UNIVERSE_SEED.sectorsPerGalaxy * 
                      DEFAULT_UNIVERSE_SEED.systemsPerSector * 
                      ((DEFAULT_UNIVERSE_SEED.minPlanetsPerSystem + DEFAULT_UNIVERSE_SEED.maxPlanetsPerSystem) / 2)
                    ).toLocaleString()} planets
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </GameLayout>
  );
}
