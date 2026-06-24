import { useState } from "react";
import GameLayout from "@/components/layout/GameLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useGame } from "@/lib/gameContext";
import {
  Moon, Globe, ArrowUp, Home, Shield, Thermometer, Wind, Activity,
  Zap, Pickaxe, Users, Box, Gem, Database, AlertTriangle, Clock,
  ChevronRight, Orbit, Radio, Satellite, Radar, Building2, Swords,
  Star, Info, BarChart3, Cpu, Droplets, Flame, Mountain, Snowflake,
  Atom, Crosshair, ChevronDown, Heart, FlaskConical,
} from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { MOON_BASE_TYPES, type MoonBaseType, type MoonBaseTypeConfig } from "@shared/config/moonsProgression";

type MoonsResponse = { moons: any[]; count: number; planetId: string };

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { credentials: "include", headers: { "Content-Type": "application/json", ...(init?.headers || {}) }, ...init });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message || "Request failed");
  return data as T;
}

const MOON_CONDITION_ICONS: Record<string, typeof AlertTriangle> = {
  stable: Activity, "tidal-locked": Orbit, "volcanic-activity": Flame,
  "ice-quakes": Snowflake, "dust-storms": Wind, "radiation-storm": Zap,
  "meteor-shower": Crosshair, "mycelial-bloom": Atom,
  "dimensional-thin": Cpu, "quantum-flux": Radio,
};

const MOON_BIOME_ICONS: Record<string, typeof Mountain> = {
  "barren-rock": Mountain, "cratered-highlands": Mountain, "mare-basins": Globe,
  "mountain-ranges": Mountain, "ice-fields": Snowflake, "lava-tubes": Flame,
  "crystal-caverns": Gem, "organic-swamps": Droplets,
  "mycelial-forests": Atom, "dimensional-rifts": Cpu,
};

const RARITY_COLORS: Record<string, string> = {
  common: "bg-slate-100 text-slate-700 border-slate-300",
  uncommon: "bg-green-100 text-green-700 border-green-300",
  rare: "bg-blue-100 text-blue-700 border-blue-300",
  epic: "bg-purple-100 text-purple-700 border-purple-300",
  legendary: "bg-amber-100 text-amber-800 border-amber-400",
  mythic: "bg-rose-100 text-rose-800 border-rose-400",
  ascended: "bg-cyan-100 text-cyan-800 border-cyan-400",
};

export default function MoonsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { resources } = useGame();
  const [selectedMoonId, setSelectedMoonId] = useState<string | null>(null);
  const [buildBaseType, setBuildBaseType] = useState<string | null>(null);
  const [showBuildBase, setShowBuildBase] = useState(false);

  const { data: moonsData, isLoading } = useQuery<MoonsResponse>({
    queryKey: ["moons"],
    queryFn: () => fetchJson("/api/moons/planet/default"),
  });

  const moons = moonsData?.moons || [];
  const selectedMoon = moons.find((m: any) => m.id === selectedMoonId) || null;

  const colonizeMutation = useMutation({
    mutationFn: (moonId: string) => fetchJson(`/api/moons/${moonId}/colonize`, { method: "POST" }),
    onSuccess: () => { toast({ title: "Moon colonized!" }); queryClient.invalidateQueries({ queryKey: ["moons"] }); },
    onError: (e: Error) => { toast({ title: "Failed", description: e.message, variant: "destructive" }); },
  });

  const upgradeMutation = useMutation({
    mutationFn: (moonId: string) => fetchJson(`/api/moons/${moonId}/upgrade`, { method: "POST" }),
    onSuccess: () => { toast({ title: "Moon upgraded!" }); queryClient.invalidateQueries({ queryKey: ["moons"] }); },
    onError: (e: Error) => { toast({ title: "Failed", description: e.message, variant: "destructive" }); },
  });

  const buildBaseMutation = useMutation({
    mutationFn: ({ moonId, baseType }: { moonId: string; baseType: string }) =>
      fetchJson(`/api/moons/${moonId}/build-base`, { method: "POST", body: JSON.stringify({ baseType, baseClass: "small" }), headers: { "Content-Type": "application/json" } }),
    onSuccess: () => {
      toast({ title: "Base constructed!" });
      queryClient.invalidateQueries({ queryKey: ["moons"] });
      setShowBuildBase(false);
      setBuildBaseType(null);
    },
    onError: (e: Error) => { toast({ title: "Failed", description: e.message, variant: "destructive" }); },
  });

  const colonizedCount = moons.filter((m: any) => m.status?.isColonized || m.details?.currentOwner).length;
  const baseCount = moons.filter((m: any) => m.base).length;

  if (isLoading) return <GameLayout><div className="flex items-center justify-center h-64 text-slate-400">Loading...</div></GameLayout>;

  const renderMoonOverview = (moon: any) => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="bg-white rounded-lg border border-slate-200 p-3 text-center cursor-help">
              <Orbit className="w-4 h-4 text-slate-500 mx-auto mb-1" />
              <div className="text-xs text-slate-500">Tier</div>
              <div className="font-bold text-slate-900">{moon.tier || 1}</div>
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="w-56 p-2 space-y-1">
            <div className="text-xs font-bold">Tier {moon.tier || 1}</div>
            <div className="text-[11px] text-slate-300">Milestone progression bracket. Higher tiers unlock stronger moons, better base types, and richer resource deposits.</div>
            <div className="border-t border-slate-600 pt-1 text-[11px] text-slate-400">Scales resource density ×{(1 + ((moon.tier || 1) - 1) * 0.2).toFixed(1)}</div>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="bg-white rounded-lg border border-slate-200 p-3 text-center cursor-help">
              <ArrowUp className="w-4 h-4 text-blue-500 mx-auto mb-1" />
              <div className="text-xs text-slate-500">Level</div>
              <div className="font-bold text-slate-900">{moon.level || 1}</div>
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="w-56 p-2 space-y-1">
            <div className="text-xs font-bold">Level {moon.level || 1}</div>
            <div className="text-[11px] text-slate-300">Precise progression within the tier. Each level improves stats, unlocks new infrastructure, and increases resource output.</div>
            <div className="border-t border-slate-600 pt-1 text-[11px] text-slate-400">Max: Level 999</div>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="bg-white rounded-lg border border-slate-200 p-3 text-center cursor-help">
              <Star className="w-4 h-4 text-amber-500 mx-auto mb-1" />
              <div className="text-xs text-slate-500">Mass</div>
              <div className="font-bold text-slate-900">{moon.stats?.mass?.toFixed(2) || "—"}</div>
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="w-56 p-2 space-y-1">
            <div className="text-xs font-bold">Mass: {moon.stats?.mass?.toFixed(2) || "—"}</div>
            <div className="text-[11px] text-slate-300">Relative mass compared to a standard moon. Higher mass increases gravity, resource density, and stability but makes colonization more expensive.</div>
            <div className="border-t border-slate-600 pt-1 text-[11px] text-slate-400">Resource Density: {moon.stats?.resourceDensity?.toFixed(2) || "—"}</div>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="bg-white rounded-lg border border-slate-200 p-3 text-center cursor-help">
              <Wind className="w-4 h-4 text-green-500 mx-auto mb-1" />
              <div className="text-xs text-slate-500">Gravity</div>
              <div className="font-bold text-slate-900">{moon.stats?.gravity?.toFixed(2) || "—"} m/s²</div>
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="w-56 p-2 space-y-1">
            <div className="text-xs font-bold">Gravity: {moon.stats?.gravity?.toFixed(2) || "—"} m/s²</div>
            <div className="text-[11px] text-slate-300">Surface gravity affects troop deployment, ship landing requirements, and base construction costs. Lower gravity means cheaper launches but weaker hold.</div>
            <div className="border-t border-slate-600 pt-1 text-[11px] text-slate-400">Mineral Wealth: {moon.stats?.mineralWealth?.toFixed(0) || "—"}/100</div>
          </TooltipContent>
        </Tooltip>
      </div>

      {moon.stats && (
        <div className="bg-slate-50 rounded-lg border border-slate-200 p-3">
          <h4 className="text-xs font-bold text-slate-600 mb-2 flex items-center gap-1">
            <BarChart3 className="w-3 h-3" /> Orbital Mechanics
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div><span className="text-slate-500">Orbit Radius:</span> <span className="font-medium">{(moon.stats.orbitRadius / 1000).toFixed(0)}k km</span></div>
            <div><span className="text-slate-500">Period:</span> <span className="font-medium">{moon.stats.orbitPeriod?.toFixed(1) || "—"} days</span></div>
            <div><span className="text-slate-500">Stability:</span> <span className="font-medium">{moon.stats.stability?.toFixed(0) || "—"}%</span></div>
            <div><span className="text-slate-500">Energy Output:</span> <span className="font-medium">{moon.stats.energyOutput?.toFixed(0) || "—"}</span></div>
          </div>
        </div>
      )}

      {moon.resources && (
        <div className="bg-white rounded-lg border border-slate-200 p-3">
          <h4 className="text-xs font-bold text-slate-600 mb-2 flex items-center gap-1">
            <Pickaxe className="w-3 h-3" /> Available Resources
          </h4>
          <div className="grid grid-cols-3 gap-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="text-center p-2 bg-amber-50 rounded border border-amber-200 cursor-help">
                  <Box className="w-4 h-4 text-amber-600 mx-auto mb-0.5" />
                  <div className="text-xs text-amber-600">Metal</div>
                  <div className="font-bold text-sm text-amber-900">{moon.resources.metal?.toLocaleString() || 0}</div>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="w-52 p-2 space-y-1">
                <div className="text-xs font-bold">Metal Resources</div>
                <div className="text-[11px] text-slate-300">Primary construction material. Used for buildings, ships, and defenses.</div>
                {moon.subStats?.metalBonus !== undefined && <div className="border-t border-slate-600 pt-1 text-[11px]"><span className="text-slate-400">Mining Bonus:</span> <span className="font-medium text-amber-400">+{moon.subStats.metalBonus}%</span></div>}
                {moon.attributes?.resourceRichness?.metal !== undefined && <div className="text-[11px]"><span className="text-slate-400">Richness:</span> <span className="font-medium">{moon.attributes.resourceRichness.metal}/100</span></div>}
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="text-center p-2 bg-blue-50 rounded border border-blue-200 cursor-help">
                  <Gem className="w-4 h-4 text-blue-600 mx-auto mb-0.5" />
                  <div className="text-xs text-blue-600">Crystal</div>
                  <div className="font-bold text-sm text-blue-900">{moon.resources.crystal?.toLocaleString() || 0}</div>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="w-52 p-2 space-y-1">
                <div className="text-xs font-bold">Crystal Resources</div>
                <div className="text-[11px] text-slate-300">Advanced material for electronics, shields, and energy systems.</div>
                {moon.subStats?.crystalBonus !== undefined && <div className="border-t border-slate-600 pt-1 text-[11px]"><span className="text-slate-400">Mining Bonus:</span> <span className="font-medium text-blue-400">+{moon.subStats.crystalBonus}%</span></div>}
                {moon.attributes?.resourceRichness?.crystal !== undefined && <div className="text-[11px]"><span className="text-slate-400">Richness:</span> <span className="font-medium">{moon.attributes.resourceRichness.crystal}/100</span></div>}
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="text-center p-2 bg-green-50 rounded border border-green-200 cursor-help">
                  <Database className="w-4 h-4 text-green-600 mx-auto mb-0.5" />
                  <div className="text-xs text-green-600">Deuterium</div>
                  <div className="font-bold text-sm text-green-900">{moon.resources.deuterium?.toLocaleString() || 0}</div>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="w-52 p-2 space-y-1">
                <div className="text-xs font-bold">Deuterium Resources</div>
                <div className="text-[11px] text-slate-300">Fuel source for ships, reactors, and FTL drives. Critical for fleet operations.</div>
                {moon.subStats?.deuteriumBonus !== undefined && <div className="border-t border-slate-600 pt-1 text-[11px]"><span className="text-slate-400">Mining Bonus:</span> <span className="font-medium text-green-400">+{moon.subStats.deuteriumBonus}%</span></div>}
                {moon.attributes?.resourceRichness?.deuterium !== undefined && <div className="text-[11px]"><span className="text-slate-400">Richness:</span> <span className="font-medium">{moon.attributes.resourceRichness.deuterium}/100</span></div>}
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      )}

      {moon.subStats && (
        <div className="bg-white rounded-lg border border-slate-200 p-3">
          <h4 className="text-xs font-bold text-slate-600 mb-2 flex items-center gap-1">
            <Zap className="w-3 h-3" /> Production Modifiers
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex justify-between p-1.5 bg-slate-50 rounded cursor-help">
                  <span className="text-slate-500">Metal Bonus:</span>
                  <span className="font-medium text-amber-700">+{moon.subStats.metalBonus || 0}%</span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="w-56 p-2">
                <div className="text-xs font-bold">Metal Production Bonus</div>
                <div className="text-[11px] text-slate-300 mt-1">Increases all metal mining rates on this moon by the shown percentage. Affected by moon type, tier, and installed infrastructure.</div>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex justify-between p-1.5 bg-slate-50 rounded cursor-help">
                  <span className="text-slate-500">Crystal Bonus:</span>
                  <span className="font-medium text-blue-700">+{moon.subStats.crystalBonus || 0}%</span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="w-56 p-2">
                <div className="text-xs font-bold">Crystal Production Bonus</div>
                <div className="text-[11px] text-slate-300 mt-1">Increases all crystal mining rates on this moon. Crystal-rich moons (crystalline, icy) have higher base bonuses.</div>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex justify-between p-1.5 bg-slate-50 rounded cursor-help">
                  <span className="text-slate-500">Energy Bonus:</span>
                  <span className="font-medium text-yellow-700">+{moon.subStats.energyBonus || 0}%</span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="w-56 p-2">
                <div className="text-xs font-bold">Energy Production Bonus</div>
                <div className="text-[11px] text-slate-300 mt-1">Boosts energy output from reactors and solar collectors. Higher energy allows more base modules and shield uptime.</div>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex justify-between p-1.5 bg-slate-50 rounded cursor-help">
                  <span className="text-slate-500">Mining Speed:</span>
                  <span className="font-medium">×{moon.subStats.miningSpeed?.toFixed(1) || "1.0"}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="w-56 p-2">
                <div className="text-xs font-bold">Mining Speed Multiplier</div>
                <div className="text-[11px] text-slate-300 mt-1">Global multiplier applied to all mining operations. Affected by biome, atmosphere, and infrastructure. Rocky and metallic moons have higher multipliers.</div>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      )}
    </div>
  );

  const renderMoonDetails = (moon: any) => (
    <div className="space-y-4">
      {moon.type && (
        <div className="bg-slate-50 rounded-lg border border-slate-200 p-3">
          <h4 className="text-xs font-bold text-slate-600 mb-2">Classification</h4>
          <div className="flex flex-wrap gap-1.5 mb-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="outline" className="text-xs capitalize cursor-help">{moon.type}</Badge>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="w-56 p-2 space-y-1">
                <div className="text-xs font-bold capitalize">{moon.type} Moon</div>
                <div className="text-[11px] text-slate-300">{moon.description || "A moon of this classification."}</div>
                {(moon.stats?.mineralWealth !== undefined || moon.stats?.resourceDensity !== undefined) && (
                  <div className="border-t border-slate-600 pt-1 text-[11px]">
                    <div className="text-slate-400">Mineral Wealth: {moon.stats.mineralWealth?.toFixed(0)}/100</div>
                    <div className="text-slate-400">Resource Density: ×{moon.stats.resourceDensity?.toFixed(2)}</div>
                  </div>
                )}
              </TooltipContent>
            </Tooltip>
            {moon.biome && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="outline" className="text-xs capitalize cursor-help">{moon.biome.replace(/-/g, " ")}</Badge>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="w-56 p-2">
                  <div className="text-xs font-bold capitalize">{moon.biome.replace(/-/g, " ")}</div>
                  <div className="text-[11px] text-slate-300 mt-1">Surface biome classification. Affects building suitability, resource types available, and colonization difficulty.</div>
                </TooltipContent>
              </Tooltip>
            )}
            {moon.atmosphere && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="outline" className="text-xs capitalize cursor-help">{moon.atmosphere.replace(/-/g, " ")}</Badge>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="w-56 p-2">
                  <div className="text-xs font-bold capitalize">{moon.atmosphere.replace(/-/g, " ")}</div>
                  <div className="text-[11px] text-slate-300 mt-1">Atmospheric composition. Determines whether the moon supports life, affects shield efficiency, and enables different building types.</div>
                </TooltipContent>
              </Tooltip>
            )}
            {moon.rarity && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge className={`text-xs capitalize cursor-help ${RARITY_COLORS[moon.rarity] || RARITY_COLORS.common}`}>
                    {moon.rarity}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="w-56 p-2">
                  <div className="text-xs font-bold capitalize">{moon.rarity}</div>
                  <div className="text-[11px] text-slate-300 mt-1">Rarity determines the moon's strategic importance. Higher rarity moons have richer deposits, better biome properties, and unique features.</div>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
          {moon.description && <p className="text-xs text-slate-600">{moon.description}</p>}
          {moon.lore && <p className="text-xs text-slate-500 italic mt-1">{moon.lore}</p>}
        </div>
      )}

      {moon.attributes && (
        <div className="bg-white rounded-lg border border-slate-200 p-3">
          <h4 className="text-xs font-bold text-slate-600 mb-2 flex items-center gap-1">
            <Thermometer className="w-3 h-3" /> Physical Attributes
          </h4>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex justify-between cursor-help"><span className="text-slate-500">Diameter:</span><span className="font-medium">{moon.attributes.diameter?.toLocaleString() || "—"} km</span></div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="w-56 p-2"><div className="text-[11px] text-slate-300">Equatorial diameter. Larger moons have more surface area for bases and can support larger populations.</div></TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex justify-between cursor-help"><span className="text-slate-500">Mass:</span><span className="font-medium">{moon.attributes.mass || "—"} Earths</span></div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="w-56 p-2"><div className="text-[11px] text-slate-300">Relative mass compared to Earth. Higher mass increases gravity and resource density but also colonization costs.</div></TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex justify-between cursor-help"><span className="text-slate-500">Gravity:</span><span className="font-medium">{moon.attributes.gravity || "—"} m/s²</span></div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="w-56 p-2"><div className="text-[11px] text-slate-300">Surface gravity. Affects ship landing costs, troop deployment, and construction efficiency. Lower gravity reduces launch costs.</div></TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex justify-between cursor-help"><span className="text-slate-500">Escape Velocity:</span><span className="font-medium">{moon.attributes.escapeVelocity || "—"} km/s</span></div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="w-56 p-2"><div className="text-[11px] text-slate-300">Speed required to break orbit. Lower escape velocity means cheaper cargo launches and faster shuttle turnaround.</div></TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex justify-between cursor-help"><span className="text-slate-500">Orbital Period:</span><span className="font-medium">{moon.attributes.orbitalPeriod || "—"} days</span></div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="w-56 p-2"><div className="text-[11px] text-slate-300">Time to complete one orbit around its parent planet. Shorter periods mean more frequent launch windows.</div></TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex justify-between cursor-help">
                  <span className="text-slate-500">Temperature:</span>
                  <span className="font-medium">
                    {moon.attributes.surfaceTemperature
                      ? `${moon.attributes.surfaceTemperature.min}~${moon.attributes.surfaceTemperature.max}°C`
                      : "—"}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="w-56 p-2"><div className="text-[11px] text-slate-300">Surface temperature range. Affects habitability, energy consumption for heating/cooling, and what structures can be built.</div></TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex justify-between cursor-help"><span className="text-slate-500">Atm. Pressure:</span><span className="font-medium">{moon.attributes.atmosphericPressure || 0} kPa</span></div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="w-56 p-2"><div className="text-[11px] text-slate-300">Atmospheric pressure at surface level. Higher pressure reduces radiation exposure but increases structural stress on buildings.</div></TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex justify-between cursor-help"><span className="text-slate-500">Mag. Field:</span><span className="font-medium">{moon.attributes.magneticField || 0}%</span></div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="w-56 p-2"><div className="text-[11px] text-slate-300">Magnetic field strength. Protects against cosmic radiation and solar flares. Higher values reduce radiation damage to crew and equipment.</div></TooltipContent>
            </Tooltip>
          </div>
        </div>
      )}

      {moon.attributes?.resourceRichness && (
        <div className="bg-white rounded-lg border border-slate-200 p-3">
          <h4 className="text-xs font-bold text-slate-600 mb-2 flex items-center gap-1">
            <Pickaxe className="w-3 h-3" /> Resource Richness
          </h4>
          <div className="grid grid-cols-3 gap-2 text-xs">
            {Object.entries(moon.attributes.resourceRichness).map(([k, v]: [string, any]) => (
              <div key={k} className="text-center p-2 bg-slate-50 rounded border border-slate-200">
                <div className="text-slate-500 capitalize mb-0.5">{k.replace(/([A-Z])/g, " $1").trim()}</div>
                <Progress value={v} className="h-1.5 mb-0.5" />
                <div className="font-medium text-slate-700">{v}%</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {moon.details && (
        <div className="bg-white rounded-lg border border-slate-200 p-3">
          <h4 className="text-xs font-bold text-slate-600 mb-2 flex items-center gap-1">
            <Building2 className="w-3 h-3" /> Colony Information
          </h4>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
            <div className="flex justify-between"><span className="text-slate-500">Population:</span><span className="font-medium">{moon.details.population?.toLocaleString() || "—"}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Capacity:</span><span className="font-medium">{moon.details.populationCapacity?.toLocaleString() || "—"}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Stage:</span><span className="font-medium capitalize">{moon.details.developmentStage || "undeveloped"}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">GDP:</span><span className="font-medium">{moon.details.gdp?.toLocaleString() || "—"}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Defense:</span><span className="font-medium">{moon.details.defenseRating || 0}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Shield:</span><span className="font-medium capitalize">{moon.details.shieldStatus || "offline"}</span></div>
            <div className="flex justify-between col-span-2"><span className="text-slate-500">Strategic Value:</span><span className="font-medium">{moon.details.strategicValue || 0}/100</span></div>
          </div>
        </div>
      )}
    </div>
  );

  const renderMoonStatus = (moon: any) => (
    <div className="space-y-4">
      {moon.status && (
        <>
          <div className="bg-slate-50 rounded-lg border border-slate-200 p-3">
            <h4 className="text-xs font-bold text-slate-600 mb-2 flex items-center gap-1">
              <Activity className="w-3 h-3" /> Condition & Stability
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {moon.status.condition && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="text-center p-2 bg-white rounded border border-slate-200 cursor-help">
                      <div className="text-2xl mb-1">
                        {(() => {
                          const Icon = MOON_CONDITION_ICONS[moon.status.condition] || Activity;
                          return <Icon className="w-5 h-5 mx-auto text-slate-600" />;
                        })()}
                      </div>
                      <div className="text-xs text-slate-500">Condition</div>
                      <div className="font-bold text-sm text-slate-900 capitalize">{moon.status.condition.replace(/-/g, " ")}</div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="w-60 p-2 space-y-1">
                    <div className="text-xs font-bold capitalize">{moon.status.condition.replace(/-/g, " ")}</div>
                    <div className="text-[11px] text-slate-300">
                      {moon.status.condition === "stable" && "No environmental disturbances. Operations proceed normally."}
                      {moon.status.condition === "tidal-locked" && "One face permanently faces the planet. Affects solar power availability and temperature distribution."}
                      {moon.status.condition === "volcanic-activity" && "Active volcanism detected. Increases mineral output but damages structures over time."}
                      {moon.status.condition === "ice-quakes" && "Cryogenic seismic events. Risk to infrastructure but may expose subsurface resources."}
                      {moon.status.condition === "dust-storms" && "Surface dust storms reduce visibility and damage exposed equipment."}
                      {moon.status.condition === "radiation-storm" && "Elevated radiation levels. Crew health at risk, electronics may be damaged."}
                      {!["stable","tidal-locked","volcanic-activity","ice-quakes","dust-storms","radiation-storm"].includes(moon.status.condition) && "Anomalous environmental condition affecting operations."}
                    </div>
                  </TooltipContent>
                </Tooltip>
              )}
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="text-center p-2 bg-white rounded border border-slate-200 cursor-help">
                    <Shield className="w-5 h-5 text-green-600 mx-auto mb-1" />
                    <div className="text-xs text-slate-500">Stability</div>
                    <div className="font-bold text-sm text-green-700">{moon.status.stability || 0}%</div>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="w-60 p-2">
                  <div className="text-xs font-bold">Stability Rating</div>
                  <div className="text-[11px] text-slate-300 mt-1">Overall structural and orbital stability. Below 50% risks seismic events, infrastructure damage, and population unrest. Restored by upgrading infrastructure and managing conditions.</div>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="text-center p-2 bg-white rounded border border-slate-200 cursor-help">
                    <Heart className="w-5 h-5 text-rose-600 mx-auto mb-1" />
                    <div className="text-xs text-slate-500">Health</div>
                    <div className="font-bold text-sm text-rose-700">{moon.status.health || 0}%</div>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="w-60 p-2">
                  <div className="text-xs font-bold">Colony Health</div>
                  <div className="text-[11px] text-slate-300 mt-1">Population well-being and infrastructure integrity. Below 30% causes population decline and production penalties. Improved by medical facilities, shield systems, and environmental controls.</div>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-3">
            <h4 className="text-xs font-bold text-slate-600 mb-2 flex items-center gap-1">
              <Radio className="w-3 h-3" /> Connectivity
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1.5 p-1.5 bg-slate-50 rounded cursor-help">
                    <div className={`w-2 h-2 rounded-full ${moon.status.isInhabited ? "bg-green-500" : "bg-slate-300"}`} />
                    <span>Inhabited</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="w-56 p-2"><div className="text-[11px] text-slate-300">Crew or colonists present on the moon. Enables manual operations and local production.</div></TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1.5 p-1.5 bg-slate-50 rounded cursor-help">
                    <div className={`w-2 h-2 rounded-full ${moon.status.isColonized ? "bg-green-500" : "bg-slate-300"}`} />
                    <span>Colonized</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="w-56 p-2"><div className="text-[11px] text-slate-300">Formally claimed and settled. Colonized moons can have bases built and contribute to empire resource income.</div></TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1.5 p-1.5 bg-slate-50 rounded cursor-help">
                    <div className={`w-2 h-2 rounded-full ${moon.status.isDeveloped ? "bg-green-500" : "bg-slate-300"}`} />
                    <span>Developed</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="w-56 p-2"><div className="text-[11px] text-slate-300">Full infrastructure established. Developed moons have running water, power grids, medical facilities, and automated mining.</div></TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1.5 p-1.5 bg-slate-50 rounded cursor-help">
                    <div className={`w-2 h-2 rounded-full ${moon.status.supplyLinesStatus === "optimal" ? "bg-green-500" : moon.status.supplyLinesStatus === "degraded" ? "bg-amber-500" : "bg-red-500"}`} />
                    <span>Supply: {moon.status.supplyLinesStatus || "optimal"}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="w-56 p-2">
                  <div className="text-[11px] text-slate-300">
                    {moon.status.supplyLinesStatus === "optimal" && "Supply lines fully operational. Resources flow freely between this moon and your empire."}
                    {moon.status.supplyLinesStatus === "degraded" && "Supply lines partially disrupted. Resource transfer efficiency reduced by 50%."}
                    {moon.status.supplyLinesStatus === "critical" && "Supply lines severely compromised. Resource transfer at 25% efficiency. Immediate attention required."}
                    {moon.status.supplyLinesStatus === "cut" && "Supply lines completely severed. No resources can reach or leave this moon."}
                    {!["optimal","degraded","critical","cut"].includes(moon.status.supplyLinesStatus) && "Supply status unknown."}
                  </div>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          {moon.status.activeEvents?.length > 0 && (
            <div className="bg-amber-50 rounded-lg border border-amber-200 p-3">
              <h4 className="text-xs font-bold text-amber-700 mb-2 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Active Events
              </h4>
              <div className="space-y-1.5">
                {moon.status.activeEvents.map((evt: any, i: number) => (
                  <div key={i} className="flex items-start gap-2 text-xs p-1.5 bg-white rounded border border-amber-200">
                    <AlertTriangle className={`w-3 h-3 mt-0.5 ${evt.severity === "critical" ? "text-red-500" : evt.severity === "major" ? "text-amber-500" : "text-yellow-500"}`} />
                    <div className="flex-1">
                      <div className="font-medium text-amber-900">{evt.type}</div>
                      <div className="text-amber-700">{evt.description}</div>
                      <div className="text-amber-500">{evt.duration} min remaining</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {moon.status.alerts?.length > 0 && (
            <div className="bg-red-50 rounded-lg border border-red-200 p-3">
              <h4 className="text-xs font-bold text-red-700 mb-2">Alerts</h4>
              <div className="space-y-1">
                {moon.status.alerts.map((alert: any, i: number) => (
                  <div key={i} className="flex items-center gap-1.5 text-xs">
                    <AlertTriangle className={`w-3 h-3 ${alert.level === "critical" ? "text-red-500" : alert.level === "danger" ? "text-orange-500" : "text-amber-500"}`} />
                    <span className="text-red-800">{alert.message}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {!moon.status && (
        <div className="text-center py-8 text-slate-400 text-sm">
          <Activity className="w-8 h-8 mx-auto mb-2 text-slate-300" />
          No status data available
        </div>
      )}
    </div>
  );

  const renderMoonBase = (moon: any) => (
    <div className="space-y-4">
      {moon.base ? (
        <>
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg border border-indigo-200 p-3">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h4 className="font-bold text-indigo-900 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4" /> {moon.base.name || "Base"}
                </h4>
                <p className="text-xs text-indigo-600 capitalize">{moon.base.class} · {moon.base.type.replace(/-/g, " ")}</p>
              </div>
              <Badge className="bg-indigo-100 text-indigo-800 border-indigo-300">Lv.{moon.base.level}</Badge>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs mt-2">
              <div className="text-center p-1.5 bg-white/80 rounded">
                <Users className="w-3 h-3 text-slate-500 mx-auto mb-0.5" />
                <div className="font-medium">{moon.base.population?.toLocaleString() || "—"}</div>
                <div className="text-slate-400">Population</div>
              </div>
              <div className="text-center p-1.5 bg-white/80 rounded">
                <Shield className="w-3 h-3 text-red-500 mx-auto mb-0.5" />
                <div className="font-medium">{moon.base.defense || 0}</div>
                <div className="text-slate-400">Defense</div>
              </div>
              <div className="text-center p-1.5 bg-white/80 rounded">
                <Zap className="w-3 h-3 text-amber-500 mx-auto mb-0.5" />
                <div className="font-medium">{moon.base.production || 0}</div>
                <div className="text-slate-400">Production</div>
              </div>
              <div className="text-center p-1.5 bg-white/80 rounded">
                <FlaskConical className="w-3 h-3 text-purple-500 mx-auto mb-0.5" />
                <div className="font-medium">{moon.base.research || 0}</div>
                <div className="text-slate-400">Research</div>
              </div>
            </div>
            {moon.base.garrison?.length > 0 && (
              <div className="mt-2 p-2 bg-white/80 rounded border border-indigo-200">
                <h5 className="text-xs font-bold text-indigo-700 mb-1 flex items-center gap-1">
                  <Swords className="w-3 h-3" /> Garrison
                </h5>
                <div className="flex flex-wrap gap-1">
                  {moon.base.garrison.map((g: any, i: number) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {g.unitType}: {g.quantity}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-3">
            <h4 className="text-xs font-bold text-slate-600 mb-2">Storage Capacity</h4>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="text-center p-2 bg-amber-50 rounded border border-amber-200">
                <div className="font-bold text-amber-700">{moon.base.storage?.toLocaleString() || "—"}</div>
                <div className="text-amber-500">Total Storage</div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          {moon.details?.currentOwner ? (
            <div className="space-y-3">
              <div className="text-center py-4 text-slate-500">
                <Building2 className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p className="text-sm">No base constructed on this moon.</p>
              </div>
              {!showBuildBase ? (
                <Button className="w-full" variant="outline" onClick={() => setShowBuildBase(true)}>
                  <Building2 className="w-4 h-4 mr-2" /> Construct Base
                </Button>
              ) : (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-600">Select Base Type</h4>
                  <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                    {(Object.entries(MOON_BASE_TYPES) as [MoonBaseType, MoonBaseTypeConfig][]).map(([type, config]) => (
                      <Tooltip key={type}>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => setBuildBaseType(type)}
                            className={`p-2 rounded-lg border-2 text-left transition-all text-xs w-full ${
                              buildBaseType === type
                                ? "border-indigo-400 bg-indigo-50"
                                : "border-slate-200 hover:border-slate-300 bg-white"
                            }`}
                          >
                            <div className="font-medium text-slate-900">{config.name}</div>
                            <div className="text-slate-500 mt-0.5">{config.description}</div>
                            <div className="flex items-center gap-1 mt-1 text-slate-400">
                              <Shield className="w-3 h-3" /> {config.baseDefense}
                              <Zap className="w-3 h-3 ml-1" /> {config.baseProduction}
                            </div>
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="w-72 p-3 space-y-2">
                          <div className="font-bold text-sm">{config.name}</div>
                          <div className="text-xs text-slate-300">{config.description}</div>
                          <div className="grid grid-cols-2 gap-1.5 text-xs border-t border-slate-600 pt-2 mt-1">
                            <div><span className="text-slate-400">Defense:</span> <span className="font-medium text-white">{config.baseDefense}</span></div>
                            <div><span className="text-slate-400">Production:</span> <span className="font-medium text-white">{config.baseProduction}</span></div>
                            <div><span className="text-slate-400">Research:</span> <span className="font-medium text-white">{config.baseResearch}</span></div>
                            <div><span className="text-slate-400">Storage:</span> <span className="font-medium text-white">{config.baseStorage.toLocaleString()}</span></div>
                            <div><span className="text-slate-400">Crew:</span> <span className="font-medium text-white">{config.baseCrew.toLocaleString()}</span></div>
                            <div><span className="text-slate-400">Min Tier:</span> <span className="font-medium text-white">{config.minTierRequired}</span></div>
                          </div>
                          {config.specialAbilities.length > 0 && (
                            <div className="border-t border-slate-600 pt-2">
                              <div className="text-xs text-slate-400 mb-1">Special Abilities:</div>
                              <div className="flex flex-wrap gap-1">
                                {config.specialAbilities.map((a: string) => (
                                  <Badge key={a} variant="outline" className="text-[10px] bg-slate-800 text-slate-300 border-slate-600">
                                    {a.replace(/-/g, " ")}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                  {buildBaseType && (
                    <div className="flex gap-2 pt-2">
                      <Button
                        className="flex-1"
                        onClick={() => buildBaseMutation.mutate({ moonId: moon.id, baseType: buildBaseType })}
                        disabled={buildBaseMutation.isPending}
                      >
                        <Building2 className="w-4 h-4 mr-2" /> Build {MOON_BASE_TYPES[buildBaseType as MoonBaseType]?.name}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => { setShowBuildBase(false); setBuildBaseType(null); }}>
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-4 text-slate-500">
              <Building2 className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p className="text-sm">Colonize this moon first to build a base.</p>
            </div>
          )}
        </>
      )}
    </div>
  );

  return (
    <GameLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Moon className="w-8 h-8 text-blue-400" /> Moons
          </h1>
          <p className="text-slate-400 mt-1">Discover, colonize, and develop moon bases across your empire</p>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <Card className="bg-slate-900/80 border-slate-700">
            <CardContent className="p-4 text-center">
              <Moon className="w-6 h-6 text-blue-400 mx-auto mb-1" />
              <p className="text-xl font-bold text-white">{moonsData?.count || 0}</p>
              <p className="text-xs text-slate-400">Discovered</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/80 border-slate-700">
            <CardContent className="p-4 text-center">
              <Globe className="w-6 h-6 text-green-400 mx-auto mb-1" />
              <p className="text-xl font-bold text-white">{colonizedCount}</p>
              <p className="text-xs text-slate-400">Colonized</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/80 border-slate-700">
            <CardContent className="p-4 text-center">
              <Building2 className="w-6 h-6 text-purple-400 mx-auto mb-1" />
              <p className="text-xl font-bold text-white">{baseCount}</p>
              <p className="text-xs text-slate-400">Bases</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/80 border-slate-700">
            <CardContent className="p-4 text-center">
              <Users className="w-6 h-6 text-amber-400 mx-auto mb-1" />
              <p className="text-xl font-bold text-white">
                {moons.reduce((s: number, m: any) => s + (m.details?.population || m.base?.population || 0), 0).toLocaleString()}
              </p>
              <p className="text-xs text-slate-400">Total Pop.</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Satellite className="w-5 h-5 text-blue-400" /> Moon Registry
            </h2>
            <ScrollArea className="h-[600px] pr-2">
              <div className="space-y-2">
                {moons.map((moon: any) => {
                  const isSelected = selectedMoonId === moon.id;
                  const resourceSummary = moon.resources
                    ? `M:${(moon.resources.metal || 0).toLocaleString()} C:${(moon.resources.crystal || 0).toLocaleString()} D:${(moon.resources.deuterium || 0).toLocaleString()}`
                    : "No resource data";
                  return (
                    <Tooltip key={moon.id}>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => setSelectedMoonId(isSelected ? null : moon.id)}
                          className={`w-full text-left p-3 rounded-lg border transition-all ${
                            isSelected
                              ? "bg-slate-800 border-blue-500"
                              : "bg-slate-900/80 border-slate-700 hover:border-slate-600"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-xl">{moon.icon || "🌙"}</span>
                              <div>
                                <div className="font-bold text-white text-sm">{moon.name}</div>
                                <div className="text-xs text-slate-400">T{moon.tier} · Lv.{moon.level}</div>
                              </div>
                            </div>
                            <ChevronRight className={`w-4 h-4 text-slate-500 transition-transform ${isSelected ? "rotate-90" : ""}`} />
                          </div>
                          <div className="flex items-center gap-1.5 mt-1.5">
                            {moon.type && <Badge variant="outline" className="text-[10px] px-1 py-0">{moon.type}</Badge>}
                            {moon.rarity && <Badge variant="outline" className="text-[10px] px-1 py-0">{moon.rarity}</Badge>}
                            {moon.status?.isColonized && <Badge className="text-[10px] px-1 py-0 bg-green-900 text-green-300">Owned</Badge>}
                            {moon.base && <Badge className="text-[10px] px-1 py-0 bg-purple-900 text-purple-300">Base</Badge>}
                          </div>
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="w-72 p-3 space-y-2">
                        <div className="font-bold text-sm">{moon.name}</div>
                        <div className="grid grid-cols-2 gap-1.5 text-xs">
                          <div><span className="text-slate-400">Type:</span> <span className="font-medium text-white capitalize">{moon.type || "Unknown"}</span></div>
                          <div><span className="text-slate-400">Rarity:</span> <span className="font-medium text-white capitalize">{moon.rarity || "Common"}</span></div>
                          <div><span className="text-slate-400">Tier:</span> <span className="font-medium text-white">{moon.tier || 1}</span></div>
                          <div><span className="text-slate-400">Level:</span> <span className="font-medium text-white">{moon.level || 1}</span></div>
                          {moon.biome && <div className="col-span-2"><span className="text-slate-400">Biome:</span> <span className="font-medium text-white capitalize">{moon.biome.replace(/-/g, " ")}</span></div>}
                          {moon.atmosphere && <div className="col-span-2"><span className="text-slate-400">Atmosphere:</span> <span className="font-medium text-white capitalize">{moon.atmosphere.replace(/-/g, " ")}</span></div>}
                        </div>
                        <div className="border-t border-slate-600 pt-2 text-xs">
                          <div className="flex flex-wrap gap-1.5">
                            <Badge variant="outline" className="bg-slate-800 text-green-400 border-green-700">{resourceSummary}</Badge>
                          </div>
                        </div>
                        {moon.details?.developmentStage && (
                          <div className="border-t border-slate-600 pt-2 text-xs">
                            <span className="text-slate-400">Development:</span>{" "}
                            <Badge variant="outline" className="bg-slate-800 text-amber-400 border-amber-700 capitalize">
                              {moon.details.developmentStage}
                            </Badge>
                          </div>
                        )}
                        {moon.status?.condition && (
                          <div className="border-t border-slate-600 pt-2 text-xs">
                            <span className="text-slate-400">Condition:</span>{" "}
                            <span className="font-medium text-white capitalize">{moon.status.condition.replace(/-/g, " ")}</span>
                            <span className="text-slate-400 ml-2">Stability:</span>{" "}
                            <span className="font-medium text-white">{moon.status.stability || 0}%</span>
                          </div>
                        )}
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            </ScrollArea>
          </div>

          <div className="lg:col-span-2">
            {selectedMoon ? (
              <Card className="bg-slate-900/80 border-slate-700">
                <CardHeader className="pb-2 border-b border-slate-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{selectedMoon.icon || "🌙"}</span>
                      <div>
                        <CardTitle className="text-white text-xl flex items-center gap-2">
                          {selectedMoon.name}
                          {selectedMoon.rarity && (
                            <Badge className={`text-xs capitalize ${RARITY_COLORS[selectedMoon.rarity] || RARITY_COLORS.common}`}>
                              {selectedMoon.rarity}
                            </Badge>
                          )}
                        </CardTitle>
                        <p className="text-xs text-slate-400">{selectedMoon.description}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {!selectedMoon.details?.currentOwner && (
                        <Button size="sm" variant="outline" className="border-green-600 text-green-400"
                          onClick={() => colonizeMutation.mutate(selectedMoon.id)} disabled={colonizeMutation.isPending}>
                          <Globe className="w-3 h-3 mr-1" /> Colonize
                        </Button>
                      )}
                      {selectedMoon.details?.currentOwner && (
                        <Button size="sm" variant="outline" className="border-cyan-600 text-cyan-400"
                          onClick={() => upgradeMutation.mutate(selectedMoon.id)} disabled={upgradeMutation.isPending}>
                          <ArrowUp className="w-3 h-3 mr-1" /> Upgrade
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <Tabs defaultValue="overview">
                    <TabsList className="bg-slate-800 border-slate-600">
                      <TabsTrigger value="overview" className="text-xs data-[state=active]:bg-slate-700">
                        <BarChart3 className="w-3 h-3 mr-1" /> Overview
                      </TabsTrigger>
                      <TabsTrigger value="details" className="text-xs data-[state=active]:bg-slate-700">
                        <Info className="w-3 h-3 mr-1" /> Details
                      </TabsTrigger>
                      <TabsTrigger value="status" className="text-xs data-[state=active]:bg-slate-700">
                        <Activity className="w-3 h-3 mr-1" /> Status
                      </TabsTrigger>
                      <TabsTrigger value="base" className="text-xs data-[state=active]:bg-slate-700">
                        <Building2 className="w-3 h-3 mr-1" /> Base
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="overview" className="mt-4">{renderMoonOverview(selectedMoon)}</TabsContent>
                    <TabsContent value="details" className="mt-4">{renderMoonDetails(selectedMoon)}</TabsContent>
                    <TabsContent value="status" className="mt-4">{renderMoonStatus(selectedMoon)}</TabsContent>
                    <TabsContent value="base" className="mt-4">{renderMoonBase(selectedMoon)}</TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-slate-900/80 border-slate-700 h-full flex items-center justify-center">
                <CardContent className="text-center py-12">
                  <Moon className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-white">Select a Moon</h3>
                  <p className="text-sm text-slate-400 mt-1">Choose a moon from the registry to view its details</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </GameLayout>
  );
}
