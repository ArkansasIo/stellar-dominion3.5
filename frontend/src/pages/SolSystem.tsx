import GameLayout from "@/components/layout/GameLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Globe,
  Star,
  CircleDot,
  MapPin,
  Thermometer,
  Zap,
  Search,
} from "lucide-react";
import { useState } from "react";
import {
  SOL_SYSTEM,
  getSolSystemPlanets,
  getSolSystemMoons,
  getSolSystemDwarfPlanets,
  getMoonsOfPlanet,
  type CelestialBody,
} from "@/lib/solSystemData";
import { cn } from "@/lib/utils";

const ASTEROID_BELT = {
  name: "Main Asteroid Belt",
  type: "asteroid" as const,
  description: "The region between Mars and Jupiter containing most of the asteroids in the Solar System. Notable bodies include Ceres, Vesta, Pallas, and Hygiea.",
  distanceAU: "2.2–3.2 AU",
  notableBodies: ["Ceres (dwarf planet)", "Vesta", "Pallas", "Hygiea", "Interamnia"],
};

const KUIPER_BELT = {
  name: "Kuiper Belt",
  type: "asteroid" as const,
  description: "Region of the Solar System beyond Neptune's orbit containing many small icy bodies, dwarf planets, and short-period comets.",
  distanceAU: "30–50 AU",
  notableBodies: ["Pluto", "Eris", "Makemake", "Haumea", "Quaoar"],
};

const NOTABLE_COMETS = [
  { name: "Halley's Comet", period: "75.3 years", type: "Short-period", description: "Most famous periodic comet. Last perihelion: 1986, next: 2061." },
  { name: "Comet Hale-Bopp", period: "2,520 years", type: "Long-period", description: "Visible to naked eye for 18 months in 1996–1997. Great Comet." },
  { name: "Comet Shoemaker-Levy 9", period: "N/A (destroyed)", type: "Historical", description: "Broke apart and collided with Jupiter in July 1994." },
  { name: "Comet NEOWISE (C/2020 F3)", period: "~6,800 years", type: "Long-period", description: "Visible to naked eye in 2020. Bright naked-eye comet." },
  { name: "Comet Encke", period: "3.3 years", type: "Short-period", description: "Shortest known orbital period of any comet." },
];

const NOTABLE_METEORITES = [
  { name: "Allende meteorite", type: "Carbonaceous chondrite (CV3)", massKg: 2000, year: 1969, description: "Largest carbonaceous chondrite ever found. Contains pre-solar grains older than our Solar System." },
  { name: "Hoba meteorite", type: "Iron (IVB)", massKg: 60000, year: 1920, description: "Largest known intact meteorite on Earth. Found in Namibia." },
  { name: "Murchison meteorite", type: "Carbonaceous chondrite (CM2)", massKg: 100, year: 1969, description: "Contains over 70 amino acids, many not found in living things on Earth." },
  { name: "ALH84001", type: "Martian meteorite (SNC)", massKg: 1.93, year: 1984, description: "Martian rock with possible microfossils, sparking debate about ancient life on Mars." },
];

const typeColor: Record<string, string> = {
  star:         "bg-yellow-100 text-yellow-800 border-yellow-300",
  planet:       "bg-blue-100 text-blue-800 border-blue-300",
  dwarf_planet: "bg-amber-100 text-amber-800 border-amber-300",
  moon:         "bg-slate-100 text-slate-700 border-slate-300",
  asteroid:     "bg-stone-100 text-stone-700 border-stone-300",
  comet:        "bg-cyan-100 text-cyan-800 border-cyan-300",
};

const planetColors: Record<string, string> = {
  "sol-mercury": "from-stone-400 to-stone-600",
  "sol-venus":   "from-yellow-300 to-orange-400",
  "sol-earth":   "from-blue-500 to-green-600",
  "sol-mars":    "from-red-400 to-red-700",
  "sol-jupiter": "from-orange-300 to-amber-600",
  "sol-saturn":  "from-yellow-200 to-amber-500",
  "sol-uranus":  "from-cyan-300 to-teal-500",
  "sol-neptune": "from-blue-600 to-indigo-800",
};

function BodyCard({ body, showMoons = false }: { body: CelestialBody; showMoons?: boolean }) {
  const moons = showMoons ? getMoonsOfPlanet(body.id) : [];
  const planetGradient = planetColors[body.id] || "from-slate-400 to-slate-600";
  const p = body.properties;

  return (
    <Card className="bg-white border-slate-200 hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-3 mb-3">
          {body.type === "planet" ? (
            <div className={cn("w-10 h-10 rounded-full bg-gradient-to-br flex-shrink-0 shadow", planetGradient)} />
          ) : body.type === "star" ? (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-300 to-orange-500 flex-shrink-0 shadow-[0_0_12px_rgba(251,191,36,0.6)]" />
          ) : body.type === "dwarf_planet" ? (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-300 to-stone-500 flex-shrink-0 mt-1" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-slate-300 flex-shrink-0 mt-1 border border-slate-400" />
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-slate-900">{body.name}</h3>
              <Badge variant="outline" className={cn("text-xs border", typeColor[body.type] || "")}>
                {body.type.replace("_", " ")}
              </Badge>
            </div>
            <div className="text-xs text-slate-500 font-mono">{body.coordinateString}</div>
          </div>
        </div>

        {p.description && (
          <p className="text-xs text-slate-600 mb-3 leading-relaxed">{p.description}</p>
        )}

        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs mb-2">
          {p.mass != null && (
            <div className="flex justify-between">
              <span className="text-slate-500">Mass</span>
              <span className="font-mono text-slate-700">{p.mass.toExponential(2)} kg</span>
            </div>
          )}
          {p.radius != null && (
            <div className="flex justify-between">
              <span className="text-slate-500">Radius</span>
              <span className="font-mono text-slate-700">{p.radius.toLocaleString()} km</span>
            </div>
          )}
          {p.orbitalPeriod != null && (
            <div className="flex justify-between">
              <span className="text-slate-500">Orbital Period</span>
              <span className="font-mono text-slate-700">{p.orbitalPeriod.toLocaleString()} days</span>
            </div>
          )}
          {p.distanceFromParent != null && (
            <div className="flex justify-between">
              <span className="text-slate-500">Distance</span>
              <span className="font-mono text-slate-700">{p.distanceFromParent.toLocaleString()} Mkm</span>
            </div>
          )}
          {p.meanTemperature != null && (
            <div className="flex justify-between">
              <span className="text-slate-500">Temp</span>
              <span className="font-mono text-slate-700">{p.meanTemperature} K</span>
            </div>
          )}
          {p.surfaceGravity != null && (
            <div className="flex justify-between">
              <span className="text-slate-500">Gravity</span>
              <span className="font-mono text-slate-700">{p.surfaceGravity} m/s²</span>
            </div>
          )}
        </div>

        {p.atmosphere && p.atmosphere.length > 0 && (
          <div className="text-xs mt-2">
            <span className="text-slate-500">Atmosphere: </span>
            <span className="text-slate-700">{p.atmosphere.join(", ")}</span>
          </div>
        )}

        {p.composition && p.composition.length > 0 && body.type !== "star" && (
          <div className="text-xs mt-1">
            <span className="text-slate-500">Composition: </span>
            <span className="text-slate-700">{p.composition.slice(0, 3).join(", ")}</span>
          </div>
        )}

        {p.rings && (
          <Badge className="mt-2 bg-amber-100 text-amber-700 border border-amber-300 text-xs">Has Rings</Badge>
        )}

        {p.habitable && (
          <Badge className="mt-2 ml-1 bg-green-100 text-green-700 border border-green-300 text-xs">Habitable</Badge>
        )}

        {showMoons && moons.length > 0 && (
          <div className="mt-3 pt-3 border-t border-slate-100">
            <p className="text-xs text-slate-500 font-bold uppercase mb-1">{moons.length} Moon{moons.length > 1 ? "s" : ""}</p>
            <div className="flex flex-wrap gap-1">
              {moons.map(moon => (
                <span key={moon.id} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full border border-slate-200">
                  {moon.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function SolSystem() {
  const [searchQuery, setSearchQuery] = useState("");

  const planets = getSolSystemPlanets();
  const dwarfPlanets = getSolSystemDwarfPlanets();
  const moons = getSolSystemMoons();
  const star = SOL_SYSTEM.bodies.find(b => b.type === "star");

  const filteredBodies = SOL_SYSTEM.bodies.filter(b =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <GameLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
          <h2 className="text-3xl font-orbitron font-bold text-slate-900">Sol System</h2>
          <p className="text-muted-foreground font-rajdhani text-lg">
            Our home solar system — coordinate <span className="font-mono text-primary font-bold">0:0:0</span>.
            {" "}8 planets, {moons.length} known moons, {dwarfPlanets.length} dwarf planets, asteroid belt, Kuiper Belt, and known comets.
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { icon: <Star className="w-4 h-4 text-yellow-500" />, label: "Star", value: "Sol (G2V)", color: "text-yellow-700" },
            { icon: <Globe className="w-4 h-4 text-blue-500" />, label: "Planets", value: String(planets.length), color: "text-blue-700" },
            { icon: <CircleDot className="w-4 h-4 text-slate-500" />, label: "Moons", value: String(moons.length), color: "text-slate-700" },
            { icon: <CircleDot className="w-4 h-4 text-amber-500" />, label: "Dwarf Planets", value: String(dwarfPlanets.length), color: "text-amber-700" },
            { icon: <Thermometer className="w-4 h-4 text-orange-500" />, label: "Star Temp", value: "5,778 K", color: "text-orange-700" },
          ].map(stat => (
            <Card key={stat.label} className="bg-white border-slate-200">
              <CardContent className="p-3 flex items-center gap-3">
                {stat.icon}
                <div>
                  <p className="text-xs text-slate-500">{stat.label}</p>
                  <p className={cn("font-bold text-sm", stat.color)}>{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search */}
        <div className="bg-white border border-slate-200 p-3 rounded-lg shadow-sm flex gap-2 items-center">
          <Search className="w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search bodies (e.g. Earth, moon, dwarf...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-0 bg-transparent focus-visible:ring-0 p-0 h-auto text-slate-700 placeholder:text-slate-400"
          />
          {searchQuery && (
            <span className="text-xs text-slate-500 whitespace-nowrap">{filteredBodies.length} result{filteredBodies.length !== 1 ? "s" : ""}</span>
          )}
        </div>

        {searchQuery ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBodies.map(body => (
              <BodyCard key={body.id} body={body} showMoons={body.type === "planet"} />
            ))}
            {filteredBodies.length === 0 && (
              <div className="col-span-full text-center py-12 text-slate-400 italic">No celestial bodies found matching "{searchQuery}"</div>
            )}
          </div>
        ) : (
          <Tabs defaultValue="planets">
            <TabsList className="grid w-full grid-cols-5 bg-white border border-slate-200 h-12">
              <TabsTrigger value="planets" className="font-orbitron flex items-center gap-1">
                <Globe className="w-4 h-4" /> Planets
              </TabsTrigger>
              <TabsTrigger value="dwarf" className="font-orbitron flex items-center gap-1">
                <CircleDot className="w-4 h-4" /> Dwarf Planets
              </TabsTrigger>
              <TabsTrigger value="asteroids" className="font-orbitron flex items-center gap-1">
                <Zap className="w-4 h-4" /> Asteroids
              </TabsTrigger>
              <TabsTrigger value="comets" className="font-orbitron flex items-center gap-1">
                <Star className="w-4 h-4" /> Comets
              </TabsTrigger>
              <TabsTrigger value="meteorites" className="font-orbitron flex items-center gap-1">
                <MapPin className="w-4 h-4" /> Meteorites
              </TabsTrigger>
            </TabsList>

            {/* Planets Tab */}
            <TabsContent value="planets" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {star && <BodyCard key={star.id} body={star} />}
                {planets.map(planet => (
                  <BodyCard key={planet.id} body={planet} showMoons />
                ))}
              </div>
            </TabsContent>

            {/* Dwarf Planets Tab */}
            <TabsContent value="dwarf" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {dwarfPlanets.map(body => (
                  <BodyCard key={body.id} body={body} showMoons />
                ))}
              </div>
            </TabsContent>

            {/* Asteroids Tab */}
            <TabsContent value="asteroids" className="mt-6 space-y-4">
              {[ASTEROID_BELT, KUIPER_BELT].map(belt => (
                <Card key={belt.name} className="bg-white border-slate-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded bg-stone-300 rotate-45 border border-stone-400 flex-shrink-0" />
                      {belt.name}
                    </CardTitle>
                    <CardDescription>{belt.distanceAU} from Sun</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-600 mb-3">{belt.description}</p>
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase mb-1">Notable Bodies</p>
                      <div className="flex flex-wrap gap-1">
                        {belt.notableBodies.map(name => (
                          <Badge key={name} variant="outline" className="text-xs border-stone-300 text-stone-700">{name}</Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Card className="bg-white border-slate-200">
                <CardHeader className="pb-2">
                  <CardTitle>Oort Cloud</CardTitle>
                  <CardDescription>~2,000–100,000 AU from Sun</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600">
                    Distant, spherical shell of icy bodies surrounding the Solar System. Believed to be the source of long-period comets.
                    Extends to approximately one quarter of the distance to Proxima Centauri.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Comets Tab */}
            <TabsContent value="comets" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {NOTABLE_COMETS.map(comet => (
                  <Card key={comet.name} className="bg-white border-slate-200">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3 mb-2">
                        <Star className="w-8 h-8 text-cyan-400 fill-cyan-100 flex-shrink-0" />
                        <div>
                          <h3 className="font-bold text-slate-900">{comet.name}</h3>
                          <Badge variant="outline" className="text-xs border-cyan-300 text-cyan-700 mt-1">{comet.type}</Badge>
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 mb-2">{comet.description}</p>
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <span className="font-bold">Orbital Period:</span>
                        <span className="font-mono">{comet.period}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Meteorites Tab */}
            <TabsContent value="meteorites" className="mt-6">
              <div className="mb-4">
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4">
                    <p className="text-sm text-blue-800">
                      <strong>Meteoroids</strong> are small rocky or metallic bodies in outer space.
                      {" "}<strong>Meteors</strong> are meteoroids that enter Earth's atmosphere and burn up (shooting stars).
                      {" "}<strong>Meteorites</strong> are those that survive the journey and land on Earth's surface.
                    </p>
                  </CardContent>
                </Card>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {NOTABLE_METEORITES.map(m => (
                  <Card key={m.name} className="bg-white border-slate-200">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3 mb-2">
                        <div className="w-8 h-8 rounded-sm bg-stone-400 rotate-12 border border-stone-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <h3 className="font-bold text-slate-900">{m.name}</h3>
                          <Badge variant="outline" className="text-xs border-stone-300 text-stone-700 mt-1">{m.type}</Badge>
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 mb-2">{m.description}</p>
                      <div className="grid grid-cols-2 gap-2 text-xs text-slate-500">
                        <div><span className="font-bold">Mass:</span> {m.massKg.toLocaleString()} kg</div>
                        <div><span className="font-bold">Found:</span> {m.year}</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        )}

        {/* System Overview Footer */}
        <Card className="bg-gradient-to-r from-slate-900 to-slate-800 text-white border-slate-700">
          <CardContent className="p-6">
            <h3 className="font-orbitron font-bold text-lg mb-3 text-blue-300">Sol System — Quick Reference</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-slate-400 text-xs uppercase mb-1">Inner Planets</p>
                <p className="text-slate-200">Mercury · Venus · Earth · Mars</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs uppercase mb-1">Outer Planets</p>
                <p className="text-slate-200">Jupiter · Saturn · Uranus · Neptune</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs uppercase mb-1">Dwarf Planets</p>
                <p className="text-slate-200">Pluto · Eris · Makemake · Haumea · Ceres</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs uppercase mb-1">Interstellar Objects</p>
                <p className="text-slate-200">Asteroids · Comets · Meteoroids · Oort Cloud</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </GameLayout>
  );
}
