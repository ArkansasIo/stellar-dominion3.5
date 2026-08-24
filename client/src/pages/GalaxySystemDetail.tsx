import GameLayout from "@/components/layout/GameLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronRight as ChevronRightIcon,
  Star,
  Orbit,
  LayoutGrid,
  Triangle,
  Hexagon,
  Home,
  MapPin,
  Moon,
} from "lucide-react";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { Link, useLocation, useRoute } from "wouter";
import { BACKGROUND_ASSETS, MENU_ASSETS, OGAMEX_FEATURED_ASSETS, getCelestialVisual, getCelestialVisualLabel } from "@shared/config";

const TEMP_THEME_IMAGE = "/theme-temp.png";

const SYSTEMS_PER_SECTOR = 128;
const TOTAL_SYSTEMS_PER_GALAXY = 64 * 128;
const MAX_SYSTEM_POSITIONS = 50;

type SystemObjectType = "planet" | "asteroid" | "nebula" | "blackhole" | "station" | "empty" | "comet";

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

const STAR_INFO: Record<string, { label: string; color: string; glow: string }> = {
  O: { label: "Blue Giant",    color: "#9bb0ff", glow: "shadow-[0_0_16px_#9bb0ff]" },
  B: { label: "Blue-White",    color: "#aabfff", glow: "shadow-[0_0_14px_#aabfff]" },
  A: { label: "White Star",    color: "#e0e8ff", glow: "shadow-[0_0_12px_#cad7ff]" },
  F: { label: "Yellow-White",  color: "#fff8dc", glow: "shadow-[0_0_12px_#f8f7ff]" },
  G: { label: "Yellow Dwarf",  color: "#fff4ea", glow: "shadow-[0_0_12px_#ffe4a0]" },
  K: { label: "Orange Dwarf",  color: "#ffd2a1", glow: "shadow-[0_0_12px_#ffa060]" },
  M: { label: "Red Dwarf",     color: "#ffcc6f", glow: "shadow-[0_0_12px_#ff6040]" },
};

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

function systemIndexToCoordinates(index: number): { sector: number; system: number } {
  const i = Math.max(1, Math.floor(index));
  const sector = Math.floor((i - 1) / SYSTEMS_PER_SECTOR) + 1;
  const system = ((i - 1) % SYSTEMS_PER_SECTOR) + 1;
  return { sector, system };
}

export default function GalaxySystemDetail() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/galaxy-systems/:galaxy/:system");

  const galaxy = Math.max(1, Math.min(Number.parseInt(params?.galaxy ?? "1", 10) || 1, 30));
  const systemIndex = Math.max(1, Math.min(Number.parseInt(params?.system ?? "1", 10) || 1, TOTAL_SYSTEMS_PER_GALAXY));

  const searchParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const universe = searchParams.get("universe") || "uni1";

  const coords = useMemo(() => systemIndexToCoordinates(systemIndex), [systemIndex]);

  const { data: systemData, isFetching } = useQuery<SystemData>({
    queryKey: ["galaxy", universe, galaxy, coords.sector, coords.system],
    queryFn: async () => {
      const res = await fetch(`/api/galaxy/${universe}/${galaxy}/${coords.sector}/${coords.system}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load system data");
      return res.json();
    },
    enabled: Boolean(universe),
    staleTime: 30_000,
  });

  const positions = systemData?.positions ?? [];

  const planets = positions.filter((p) => p.type === "planet");
  const owned = planets.filter((p) => p.owner);
  const moons = planets.filter((p) => p.moon);
  const specials = positions.filter((p) => p.type !== "planet" && p.type !== "empty");

  const goToSystem = (index: number) => {
    const clamped = Math.max(1, Math.min(index, TOTAL_SYSTEMS_PER_GALAXY));
    setLocation(`/galaxy-systems/${galaxy}/${clamped}?universe=${universe}`);
  };

  return (
    <GameLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <section className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm bg-cover bg-center" style={{ backgroundImage: `linear-gradient(rgba(15,23,42,0.78), rgba(15,23,42,0.92)), url(${BACKGROUND_ASSETS.GALAXY_MAP.path})` }}>
          <div className="p-5 lg:p-6 space-y-4 text-white">
            <div className="flex items-center gap-2">
              <img src={MENU_ASSETS.NAVIGATION.HOME.path} alt="Icon" className="w-8 h-8 rounded-lg border border-white/10 bg-white/10 p-1.5 object-contain" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = TEMP_THEME_IMAGE; }} />
              <h1 className="text-2xl font-bold">
                {systemData?.systemName ? `${systemData.systemName} System` : `System #${systemIndex}`}
              </h1>
            </div>
            <p className="text-sm leading-6 text-slate-300">
              System detail subpage · Galaxy {galaxy} · Sector {coords.sector} · System {coords.system}
            </p>
            <div className="flex flex-wrap gap-3">
              {[{ label: "Star Survey", image: OGAMEX_FEATURED_ASSETS.BACKGROUND.path }, { label: "Orbital Scan", image: OGAMEX_FEATURED_ASSETS.MOON.path }, { label: "System Catalog", image: MENU_ASSETS.NAVIGATION.HOME.path }].map((item) => (
                <div key={item.label} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                  <img src={item.image} alt={item.label} className="w-10 h-10 rounded-lg border border-white/10 bg-black/10 p-1.5 object-contain" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = TEMP_THEME_IMAGE; }} />
                  <div className="text-sm font-semibold">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Breadcrumb + back */}
        <nav className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
          <Link href="/universe" className="font-semibold text-slate-500 uppercase tracking-wider hover:text-primary">Universe</Link>
          <ChevronRightIcon className="w-3.5 h-3.5" />
          <Link href={`/galaxy-systems?universe=${universe}&galaxy=${galaxy}`} className="font-semibold text-slate-500 uppercase tracking-wider hover:text-primary">Galaxy {galaxy}</Link>
          <ChevronRightIcon className="w-3.5 h-3.5" />
          <span className="font-semibold text-primary">System #{systemIndex}</span>
        </nav>

        {/* Submenu: back + prev/next system */}
        <div className="bg-white border border-slate-200 p-4 rounded-lg flex flex-wrap items-center gap-4 shadow-sm">
          <Button variant="outline" size="sm" onClick={() => setLocation(`/galaxy-systems?universe=${universe}&galaxy=${galaxy}`)}>
            <LayoutGrid className="w-3.5 h-3.5 mr-1.5" /> Back to Galaxy List
          </Button>
          <Button variant="outline" size="sm" onClick={() => setLocation("/galaxy?universe=" + universe + "&galaxy=" + galaxy)}>
            <Home className="w-3.5 h-3.5 mr-1.5" /> Galaxy Grid
          </Button>
          <div className="h-8 w-px bg-slate-200 hidden md:block" />
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground uppercase text-xs font-bold">System</span>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => goToSystem(systemIndex - 1)} disabled={systemIndex <= 1}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="font-mono text-sm text-slate-900 font-bold min-w-16 text-center">#{systemIndex}</span>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => goToSystem(systemIndex + 1)} disabled={systemIndex >= TOTAL_SYSTEMS_PER_GALAXY}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="ml-auto flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Orbit className="w-3.5 h-3.5 text-blue-500" /> {planets.length} planets</span>
            <span className="flex items-center gap-1"><Moon className="w-3.5 h-3.5 text-slate-400" /> {moons.length} moons</span>
            <span className="flex items-center gap-1"><Triangle className="w-3 h-3 fill-yellow-600 rotate-180" /> {specials.length} anomalies</span>
          </div>
        </div>

        {/* System info / star */}
        {isFetching && !systemData ? (
          <div className="bg-white border border-slate-200 p-4 rounded-lg animate-pulse h-24 shadow-sm" />
        ) : (
          systemData?.star && (
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
                  {" · "}<span className="italic">{STAR_INFO[systemData.star.type]?.label ?? "Unknown"}</span>
                  {" · "}<span className="font-mono text-xs">{galaxy}:{coords.sector}:{coords.system}</span>
                </div>
              </div>
              <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span className="font-mono"># {systemIndex} / {TOTAL_SYSTEMS_PER_GALAXY.toLocaleString()}</span>
              </div>
            </div>
          )
        )}

        {/* Positions table */}
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
          <div className="max-h-[600px] overflow-y-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-slate-50 z-10">
                <TableRow className="bg-slate-50 border-slate-200 hover:bg-slate-50">
                  <TableHead className="text-center w-[60px] text-slate-700">Pos</TableHead>
                  <TableHead className="w-[80px] text-slate-700">Visual</TableHead>
                  <TableHead className="text-slate-700">Name</TableHead>
                  <TableHead className="text-slate-700">Class / Type</TableHead>
                  <TableHead className="text-slate-700">Moon / Debris</TableHead>
                  <TableHead className="text-slate-700">Owner</TableHead>
                  <TableHead className="text-slate-700">Alliance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isFetching && !systemData && (
                  <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">Loading system data...</TableCell></TableRow>
                )}
                {Array.from({ length: MAX_SYSTEM_POSITIONS }).map((_, i) => {
                  const pos = i + 1;
                  const data: SystemPosition = systemData?.positions?.find((p) => p.position === pos) ||
                    { position: pos, type: "empty", name: "" };
                  return (
                    <TableRow key={pos} className="border-slate-100 hover:bg-slate-50 transition-colors">
                      <TableCell className="text-center font-mono text-muted-foreground">{pos}</TableCell>

                      <TableCell>
                        {data.type === "planet" && (
                          <img src={getCelestialVisual("planet", data.class)} alt={getCelestialVisualLabel("planet", data.class)} className="w-10 h-10 rounded-full object-cover shadow-sm border border-slate-200" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = TEMP_THEME_IMAGE; }} />
                        )}
                        {data.type === "asteroid" && (
                          <img src={getCelestialVisual("asteroid")} alt="Asteroid field" className="w-10 h-10 rounded-lg object-cover border border-slate-300" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = TEMP_THEME_IMAGE; }} />
                        )}
                        {data.type === "blackhole" && (
                          <img src={getCelestialVisual("blackhole")} alt="Singularity" className="w-10 h-10 rounded-full object-cover border border-slate-800" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = TEMP_THEME_IMAGE; }} />
                        )}
                        {data.type === "nebula" && <img src={getCelestialVisual("nebula")} alt="Nebula" className="w-10 h-10 rounded-full object-cover blur-[1px] opacity-80" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = TEMP_THEME_IMAGE; }} />}
                        {data.type === "station" && (
                          <div className="w-10 h-10 flex items-center justify-center">
                            <Hexagon className="w-8 h-8 text-slate-600 fill-slate-200" />
                          </div>
                        )}
                        {data.type === "comet" && (
                          <div className="w-10 h-10 flex items-center justify-center">
                            <Triangle className="w-6 h-6 text-cyan-500 fill-cyan-200 rotate-180" />
                          </div>
                        )}
                        {data.type === "empty" && <div className="w-10 h-10" />}
                      </TableCell>

                      <TableCell>
                        {data.type !== "empty" ? (
                          <div className={cn("font-medium", data.owner ? "text-primary" : "text-slate-700")}>
                            {data.name}
                            {data.owner && <span className="ml-1 text-red-500 text-xs font-semibold">(Colonized)</span>}
                          </div>
                        ) : (
                          <span className="text-muted-foreground/30 italic">-- Empty Space --</span>
                        )}
                      </TableCell>

                      <TableCell>
                        {data.type === "asteroid" && <Badge variant="outline" className="border-slate-400 text-slate-600">Asteroid</Badge>}
                        {data.type === "blackhole" && <Badge variant="destructive" className="bg-black hover:bg-black text-white">Singularity</Badge>}
                        {data.type === "nebula" && <Badge variant="secondary" className="bg-purple-100 text-purple-700 hover:bg-purple-100">Nebula</Badge>}
                        {data.type === "station" && <Badge variant="outline" className="border-red-400 text-red-600">Pirate Base</Badge>}
                        {data.type === "comet" && <Badge variant="outline" className="border-cyan-400 text-cyan-600">Comet</Badge>}
                        {data.type === "planet" && (
                          <Badge variant="secondary" className={cn(
                            data.class && PLANET_CLASS_BADGE[data.class] ? PLANET_CLASS_BADGE[data.class] : "bg-blue-100 text-blue-700"
                          )}>Class {data.class}</Badge>
                        )}
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2">
                          {data.moon && <img src={getCelestialVisual("moon", data.class, true)} alt="Moon" className="w-4 h-4 rounded-full object-cover border border-slate-400" title="Moon" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = TEMP_THEME_IMAGE; }} />}
                          {data.debris && (
                            <div className="flex items-center text-xs text-yellow-600 font-mono" title={`Metal: ${data.debris.metal.toLocaleString()}, Crystal: ${data.debris.crystal.toLocaleString()}`}>
                              <Triangle className="w-3 h-3 mr-1 fill-yellow-600 rotate-180" />
                              <span>D-Field</span>
                            </div>
                          )}
                        </div>
                      </TableCell>

                      <TableCell>
                        {data.owner && <span className="font-medium text-red-500">{data.owner}</span>}
                      </TableCell>

                      <TableCell>
                        {data.alliance && <span className="text-blue-500 font-bold">[{data.alliance}]</span>}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Bottom prev/next subpage nav */}
        <div className="flex items-center justify-between gap-3">
          <Button variant="outline" size="sm" onClick={() => goToSystem(systemIndex - 1)} disabled={systemIndex <= 1}>
            <ChevronLeft className="w-3.5 h-3.5 mr-1.5" /> Previous System
          </Button>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="w-3.5 h-3.5" /> Galaxy {galaxy} · System #{systemIndex}
          </span>
          <Button variant="outline" size="sm" onClick={() => goToSystem(systemIndex + 1)} disabled={systemIndex >= TOTAL_SYSTEMS_PER_GALAXY}>
            Next System <ChevronRight className="w-3.5 h-3.5 ml-1.5" />
          </Button>
        </div>
      </div>
    </GameLayout>
  );
}
