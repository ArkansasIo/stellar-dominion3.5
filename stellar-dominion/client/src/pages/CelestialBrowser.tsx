import GameLayout from "@/components/layout/GameLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Star, Zap, Droplets, Thermometer, Radio, Users } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { PLANET_ASSETS } from "@shared/config";

const SAMPLE_PLANETS = [
  {
    id: "P001",
    name: "Kepler-452b",
    type: "temperate",
    size: "large",
    class: "terrestrial",
    coordinates: "1:1:1",
    temperature: 288,
    habitability: 95,
    resources: { metal: 50000, crystal: 30000, deuterium: 20000 },
    colonized: false,
    waterPercentage: 65,
  },
  {
    id: "P002",
    name: "Mars Prime",
    type: "desert",
    size: "medium",
    class: "terrestrial",
    coordinates: "1:1:2",
    temperature: 210,
    habitability: 45,
    resources: { metal: 100000, crystal: 50000, deuterium: 0 },
    colonized: true,
    waterPercentage: 5,
    owner: "RedColonist",
  },
];

const SAMPLE_STARS = [
  {
    id: "S001",
    name: "Proxima Centauri",
    coordinates: "1:2:18",
    class: "M",
    type: "red-giant",
    luminosity: 0.0017,
    temperature: 3042,
    mass: 0.12,
    planetsCount: 3,
  },
  {
    id: "S002",
    name: "Sol",
    coordinates: "1:4:102",
    class: "G",
    type: "main-sequence",
    luminosity: 1.0,
    temperature: 5778,
    mass: 1.0,
    planetsCount: 8,
  },
];

const TEMP_THEME_IMAGE = "/theme-temp.png";

function getPlanetImagePath(type: string, planetClass: string) {
  const normalizedType = type.toLowerCase();
  const normalizedClass = planetClass.toLowerCase();
  if (normalizedType.includes("desert")) return PLANET_ASSETS.TERRESTRIAL.DESERT.path;
  if (normalizedType.includes("ice")) return PLANET_ASSETS.TERRESTRIAL.ICE.path;
  if (normalizedType.includes("ocean")) return PLANET_ASSETS.TERRESTRIAL.OCEAN.path;
  if (normalizedType.includes("volcanic")) return PLANET_ASSETS.TERRESTRIAL.VOLCANIC.path;
  if (normalizedClass.includes("gas")) return PLANET_ASSETS.GAS_GIANTS.JUPITER_CLASS.path;
  return PLANET_ASSETS.TERRESTRIAL.EARTH_LIKE.path;
}

function getStarImagePath(starClass: string) {
  const normalized = starClass.toUpperCase();
  if (normalized === "G") return PLANET_ASSETS.EXOTIC.DYSON_SPHERE.path;
  if (normalized === "M") return PLANET_ASSETS.EXOTIC.RING_WORLD.path;
  return PLANET_ASSETS.EXOTIC.DYSON_SPHERE.path;
}

export default function CelestialBrowser() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<"all" | "planets" | "stars">("all");

  const filteredPlanets = SAMPLE_PLANETS.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.type.includes(searchTerm.toLowerCase())
  );

  const filteredStars = SAMPLE_STARS.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.class.includes(searchTerm.toUpperCase())
  );

  const totalMetal = filteredPlanets.reduce((sum, planet) => sum + planet.resources.metal, 0);
  const totalCrystal = filteredPlanets.reduce((sum, planet) => sum + planet.resources.crystal, 0);
  const habitableTargets = filteredPlanets.filter((planet) => planet.habitability >= 70).length;
  const colonizedTargets = filteredPlanets.filter((planet) => planet.colonized).length;

  return (
    <GameLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
          <h2 className="text-3xl font-orbitron font-bold text-slate-900" data-testid="text-celestial-title">
            Celestial Database
          </h2>
          <p className="text-muted-foreground font-rajdhani text-lg">Explore planets, stars, and celestial bodies in the galaxy.</p>
        </div>

        <Card className="bg-white border-slate-200">
          <CardContent className="pt-6 space-y-4">
            <Input
              placeholder="Search by name or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              data-testid="input-celestial-search"
              className="border-slate-200"
            />

            <Tabs value={selectedType} onValueChange={(v: any) => setSelectedType(v)} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">All Celestial Objects</TabsTrigger>
                <TabsTrigger value="planets">Planets ({filteredPlanets.length})</TabsTrigger>
                <TabsTrigger value="stars">Stars ({filteredStars.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-4">
                <div className="space-y-4">
                  {selectedType === "all" && (
                    <>
                      <div>
                        <h3 className="font-bold text-lg text-slate-900 mb-3">Planets</h3>
                        <div className="grid gap-3">
                          {filteredPlanets.map((planet) => (
                            <Card key={planet.id} className="border-slate-200" data-testid={`planet-card-${planet.id}`}>
                              <CardContent className="pt-4">
                                <div className="flex items-start justify-between mb-3">
                                  <div className="flex items-center gap-3">
                                    <img
                                      src={getPlanetImagePath(planet.type, planet.class)}
                                      alt={planet.name}
                                      className="w-14 h-14 rounded object-cover border border-slate-200 bg-slate-100"
                                      onError={(event) => {
                                        event.currentTarget.onerror = null;
                                        event.currentTarget.src = TEMP_THEME_IMAGE;
                                      }}
                                    />
                                    <div>
                                      <h4 className="font-bold text-slate-900">{planet.name}</h4>
                                      <p className="text-xs text-slate-500">{planet.coordinates}</p>
                                    </div>
                                  </div>
                                  <div className="flex gap-2">
                                    <Badge variant="outline">{planet.type}</Badge>
                                    {planet.colonized && (
                                      <Badge className="bg-green-100 text-green-800">Colonized</Badge>
                                    )}
                                  </div>
                                </div>

                                <div className="grid grid-cols-4 gap-2 mb-3">
                                  <div className="bg-slate-50 p-2 rounded text-center">
                                    <Thermometer className="w-4 h-4 mx-auto text-orange-500 mb-1" />
                                    <span className="text-xs font-mono">{planet.temperature}K</span>
                                  </div>
                                  <div className="bg-slate-50 p-2 rounded text-center">
                                    <Droplets className="w-4 h-4 mx-auto text-blue-500 mb-1" />
                                    <span className="text-xs font-mono">{planet.waterPercentage}%</span>
                                  </div>
                                  <div className="bg-slate-50 p-2 rounded text-center">
                                    <Zap className="w-4 h-4 mx-auto text-yellow-500 mb-1" />
                                    <span className="text-xs font-mono">{planet.habitability}%</span>
                                  </div>
                                  <div className="bg-slate-50 p-2 rounded text-center">
                                    <Users className="w-4 h-4 mx-auto text-purple-500 mb-1" />
                                    <span className="text-xs font-mono">{planet.size}</span>
                                  </div>
                                </div>

                                <div className="grid grid-cols-3 gap-2 mb-3">
                                  <div className="text-center">
                                    <span className="text-xs text-slate-500">Metal</span>
                                    <p className="font-mono text-sm text-slate-900">
                                      {planet.resources.metal.toLocaleString()}
                                    </p>
                                  </div>
                                  <div className="text-center">
                                    <span className="text-xs text-slate-500">Crystal</span>
                                    <p className="font-mono text-sm text-blue-600">
                                      {planet.resources.crystal.toLocaleString()}
                                    </p>
                                  </div>
                                  <div className="text-center">
                                    <span className="text-xs text-slate-500">Deuterium</span>
                                    <p className="font-mono text-sm text-green-600">
                                      {planet.resources.deuterium.toLocaleString()}
                                    </p>
                                  </div>
                                </div>

                                {planet.colonized && planet.owner && (
                                  <div className="text-xs bg-green-50 text-green-700 p-2 rounded mb-2">
                                    Controlled by: {planet.owner}
                                  </div>
                                )}

                                <Link href={`/planet/${planet.id}`}>
                                  <Button className="w-full" size="sm">
                                    {planet.colonized ? "Visit Colony" : "View Planet"}
                                  </Button>
                                </Link>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="font-bold text-lg text-slate-900 mb-3">Stars</h3>
                        <div className="grid gap-3">
                          {filteredStars.map((star) => (
                            <Card key={star.id} className="border-slate-200">
                              <CardContent className="pt-4">
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <img
                                      src={getStarImagePath(star.class)}
                                      alt={star.name}
                                      className="w-10 h-10 rounded object-cover border border-slate-200 bg-slate-100"
                                      onError={(event) => {
                                        event.currentTarget.onerror = null;
                                        event.currentTarget.src = TEMP_THEME_IMAGE;
                                      }}
                                    />
                                    <div>
                                      <h4 className="font-bold text-slate-900">{star.name}</h4>
                                      <p className="text-xs text-slate-500">Class {star.class} {star.type}</p>
                                    </div>
                                  </div>
                                </div>

                                <div className="grid grid-cols-4 gap-2">
                                  <div className="text-center bg-slate-50 p-2 rounded">
                                    <span className="text-xs text-slate-500">Temp</span>
                                    <p className="text-xs font-mono">{star.temperature}K</p>
                                  </div>
                                  <div className="text-center bg-slate-50 p-2 rounded">
                                    <span className="text-xs text-slate-500">Mass</span>
                                    <p className="text-xs font-mono">{star.mass}M☉</p>
                                  </div>
                                  <div className="text-center bg-slate-50 p-2 rounded">
                                    <span className="text-xs text-slate-500">Luminosity</span>
                                    <p className="text-xs font-mono">{star.luminosity.toFixed(3)}L☉</p>
                                  </div>
                                  <div className="text-center bg-slate-50 p-2 rounded">
                                    <span className="text-xs text-slate-500">Planets</span>
                                    <p className="text-xs font-mono">{star.planetsCount}</p>
                                  </div>
                                </div>

                                <div className="mt-2 text-xs text-slate-500">Coordinates: {star.coordinates}</div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="planets" className="mt-4 space-y-3">
                {filteredPlanets.map((planet) => (
                  <Card key={planet.id} className="border-slate-200">
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <img
                          src={getPlanetImagePath(planet.type, planet.class)}
                          alt={planet.name}
                          className="w-8 h-8 rounded object-cover border border-slate-200 bg-slate-100"
                          onError={(event) => {
                            event.currentTarget.onerror = null;
                            event.currentTarget.src = TEMP_THEME_IMAGE;
                          }}
                        />
                        <h4 className="font-bold">{planet.name}</h4>
                      </div>
                      <Button size="sm" className="w-full" onClick={() => setLocation(`/planet/${planet.id}`)}>
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="stars" className="mt-4 space-y-3">
                {filteredStars.map((star) => (
                  <Card key={star.id} className="border-slate-200">
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <img
                          src={getStarImagePath(star.class)}
                          alt={star.name}
                          className="w-8 h-8 rounded object-cover border border-slate-200 bg-slate-100"
                          onError={(event) => {
                            event.currentTarget.onerror = null;
                            event.currentTarget.src = TEMP_THEME_IMAGE;
                          }}
                        />
                        <h4 className="font-bold">{star.name}</h4>
                      </div>
                      <Button
                        size="sm"
                        className="w-full"
                        onClick={() => {
                          const [galaxy = "1", sector = "1", system = "1"] = star.coordinates.split(":");
                          toast({ title: "Star selected", description: `Opening Galaxy Map for ${star.name}.` });
                          setLocation(`/galaxy?universe=uni1&galaxy=${galaxy}&sector=${sector}&system=${system}`);
                        }}
                      >
                        View Star System
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-white border-slate-200"><CardContent className="p-4"><div className="text-xs uppercase text-slate-500">Habitable Targets</div><div className="text-2xl font-orbitron font-bold text-emerald-700">{habitableTargets}</div></CardContent></Card>
          <Card className="bg-white border-slate-200"><CardContent className="p-4"><div className="text-xs uppercase text-slate-500">Colonized Worlds</div><div className="text-2xl font-orbitron font-bold text-blue-700">{colonizedTargets}</div></CardContent></Card>
          <Card className="bg-white border-slate-200"><CardContent className="p-4"><div className="text-xs uppercase text-slate-500">Metal in View</div><div className="text-2xl font-orbitron font-bold text-amber-700">{totalMetal.toLocaleString()}</div></CardContent></Card>
          <Card className="bg-white border-slate-200"><CardContent className="p-4"><div className="text-xs uppercase text-slate-500">Crystal in View</div><div className="text-2xl font-orbitron font-bold text-cyan-700">{totalCrystal.toLocaleString()}</div></CardContent></Card>
        </div>

        <Card className="bg-indigo-50 border-indigo-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-indigo-900">Exploration Protocol</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-indigo-900">
            <div className="rounded border border-indigo-200 bg-white/70 p-3">Use high-habitability worlds as first-wave colony candidates to lower stabilization cost.</div>
            <div className="rounded border border-indigo-200 bg-white/70 p-3">Match star class scouting with your tech branch to maximize anomaly discovery efficiency.</div>
            <div className="rounded border border-indigo-200 bg-white/70 p-3">Track deuterium-zero planets for industrial roles where fleet fuel logistics are externalized.</div>
          </CardContent>
        </Card>
      </div>
    </GameLayout>
  );
}
