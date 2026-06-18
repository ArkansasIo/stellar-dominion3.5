import GameLayout from "@/components/layout/GameLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Star, Zap, Droplets, Thermometer, Radio, Users } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

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
    class: "G",
    type: "main-sequence",
    luminosity: 1.0,
    temperature: 5778,
    mass: 1.0,
    planetsCount: 8,
  },
];

export default function CelestialBrowser() {
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
                                  <div>
                                    <h4 className="font-bold text-slate-900">{planet.name}</h4>
                                    <p className="text-xs text-slate-500">{planet.coordinates}</p>
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
                                    <Star className="w-5 h-5 text-yellow-500" />
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
                      <h4 className="font-bold mb-2">{planet.name}</h4>
                      <Button size="sm" className="w-full" onClick={() => alert("Viewing details for " + planet.name)}>
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
                        <Star className="w-4 h-4 text-yellow-500" />
                        <h4 className="font-bold">{star.name}</h4>
                      </div>
                      <Button size="sm" className="w-full" onClick={() => alert("Viewing star system " + star.name)}>
                        View Star System
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </GameLayout>
  );
}
