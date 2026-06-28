import GameLayout from "@/components/layout/GameLayout";
import HabitatSystemsPanel from "@/components/game/HabitatSystemsPanel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { ORBITAL_BUILDINGS, StationBuilding } from "@/lib/stationData";
import { STRONGHOLD_PROGRAMS } from "@/lib/wormholeStrongholdCatalog";
import {
  ORBITAL_STATION_CATEGORIES,
  ORBITAL_STATION_STATS,
  getOrbitalStationsByCategory,
  type OrbitalStation,
  type OrbitalCategoryMeta,
} from "@shared/config/orbitalStationsConfig";
import { MENU_ASSETS } from "@shared/config";
import {
  Satellite, Moon, Building2, Clock, Box, Gem, Database,
  TrendingUp, Hammer, ChevronDown, ChevronRight, Layers,
  Zap, Shield, FlaskConical, Truck, Radio, Users, Pickaxe,
  ShoppingCart, Sword, Anchor, Eye, HandshakeIcon, Wind,
  Search, Heart, Cpu, Play, Plus, Activity, Trash2
} from "lucide-react";
import { useEffect, useMemo, useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useGame } from "@/lib/gameContext";
import { Input } from "@/components/ui/input";
import { createHabitatConditionProfile } from "@/lib/environmentSystems";

type StationsTab = "moon" | "station" | "active" | "infrastructure";

const TEMP_THEME_IMAGE = "/theme-temp.png";

const STATION_IMAGE_MAP: Record<string, string> = {
  moonBase:       MENU_ASSETS.BUILDINGS.SPACEPORT.path,
  sensorPhalanx:  MENU_ASSETS.BUILDINGS.DEFENSE_TURRET.path,
  jumpGate:       MENU_ASSETS.BUILDINGS.SPACEPORT.path,
  spaceStation:   MENU_ASSETS.BUILDINGS.SPACEPORT.path,
  fleetAcademy:   MENU_ASSETS.BUILDINGS.SHIPYARD.path,
  allianceDepot:  MENU_ASSETS.BUILDINGS.TRADE_STATION.path,
};

function formatTime(seconds: number): string {
  if (seconds >= 86400) {
    return `${Math.round(seconds / 86400)}d`;
  } else if (seconds >= 3600) {
    return `${Math.round(seconds / 3600)}h`;
  } else if (seconds >= 60) {
    return `${Math.round(seconds / 60)}m`;
  }
  return `${seconds}s`;
}

function BuildingCard({
  building,
  level = 0,
  onConstruct,
  requirementLabel,
}: {
  building: StationBuilding;
  level?: number;
  onConstruct: (building: StationBuilding) => void;
  requirementLabel?: string | null;
}) {
  const imagePath = STATION_IMAGE_MAP[building.id] ?? MENU_ASSETS.BUILDINGS.SPACEPORT.path;
  const cost = {
    metal: Math.round(building.baseCost.metal * Math.pow(building.costFactor, level)),
    crystal: Math.round(building.baseCost.crystal * Math.pow(building.costFactor, level)),
    deuterium: Math.round(building.baseCost.deuterium * Math.pow(building.costFactor, level))
  };
  const buildTime = Math.round(building.buildTime * Math.pow(building.costFactor, level));
  
  const typeColors: Record<string, { bg: string; border: string; badge: string }> = {
    moon: { bg: "bg-slate-800", border: "border-slate-600", badge: "bg-slate-700 text-slate-300" },
    station: { bg: "bg-slate-800", border: "border-slate-600", badge: "bg-blue-900/50 text-blue-300" },
    planet: { bg: "bg-slate-800", border: "border-slate-600", badge: "bg-green-900/50 text-green-300" }
  };
  
  const colors = typeColors[building.type] || typeColors.planet;
  
  return (
    <Card className={`border-2 ${colors.border} ${colors.bg}`} data-testid={`card-building-${building.id}`}>
      <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-700 rounded-lg border border-slate-600 w-12 h-12 flex items-center justify-center overflow-hidden">
              <img
                src={imagePath}
                alt={building.name}
                className="w-9 h-9 object-contain"
                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = TEMP_THEME_IMAGE; }}
              />
            </div>
            <div>
              <CardTitle className="text-lg text-white">{building.name}</CardTitle>
              <Badge className={colors.badge}>
                {building.type === 'moon' ? '🌙 Moon' : building.type === 'station' ? '🛸 Station' : '🌍 Planet'}
              </Badge>
            </div>
          </div>
          <Badge variant="outline" className="text-xs">
            Level {level}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-slate-300">{building.description}</p>
        
        <div className="p-3 bg-slate-700/50 rounded-lg border border-slate-600">
          <p className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-1">
            <Hammer className="w-3 h-3" /> CONSTRUCTION COST (Level {level + 1})
          </p>
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center p-2 bg-slate-800 rounded">
              <Box className="w-4 h-4 text-slate-400 mx-auto mb-1" />
              <p className="text-xs text-slate-400">Metal</p>
              <p className="font-bold text-sm text-white">{cost.metal.toLocaleString()}</p>
            </div>
            <div className="text-center p-2 bg-blue-900/30 rounded">
              <Gem className="w-4 h-4 text-blue-300 mx-auto mb-1" />
              <p className="text-xs text-blue-400">Crystal</p>
              <p className="font-bold text-sm text-blue-300">{cost.crystal.toLocaleString()}</p>
            </div>
            <div className="text-center p-2 bg-green-900/30 rounded">
              <Database className="w-4 h-4 text-green-300 mx-auto mb-1" />
              <p className="text-xs text-green-400">Deuterium</p>
              <p className="font-bold text-sm text-green-300">{cost.deuterium.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-2 bg-amber-900/20 rounded border border-amber-800/50">
          <div className="flex items-center gap-2 text-amber-400">
            <Clock className="w-4 h-4" />
            <span className="text-sm">Build Time:</span>
          </div>
          <span className="font-bold text-amber-300">{formatTime(buildTime)}</span>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Cost Factor: x{building.costFactor}</span>
        </div>

        {requirementLabel && (
          <div className="rounded border border-amber-800/50 bg-amber-900/20 px-3 py-2 text-xs text-amber-400">
            {requirementLabel}
          </div>
        )}

        <Button className="w-full" onClick={() => onConstruct(building)} data-testid={`button-build-${building.id}`}>
          <TrendingUp className="w-4 h-4 mr-2" />
          {level === 0 ? 'Construct' : 'Upgrade to Level ' + (level + 1)}
        </Button>
      </CardContent>
    </Card>
  );
}

// ─── Orbital Station class colour palette ────────────────────────────────────
const CLASS_COLORS: Record<string, { border: string; badge: string; bg: string }> = {
  common:       { border: "border-slate-600",  badge: "bg-slate-700 text-slate-300",  bg: "bg-slate-800"  },
  uncommon:     { border: "border-green-700",  badge: "bg-green-900/50 text-green-300",  bg: "bg-slate-800"  },
  rare:         { border: "border-blue-700",   badge: "bg-blue-900/50 text-blue-300",    bg: "bg-slate-800"  },
  epic:         { border: "border-purple-700", badge: "bg-purple-900/50 text-purple-300",bg: "bg-slate-800"  },
  legendary:    { border: "border-amber-600",  badge: "bg-amber-900/50 text-amber-300",  bg: "bg-slate-800"  },
  mythic:       { border: "border-rose-600",   badge: "bg-rose-900/50 text-rose-300",    bg: "bg-slate-800"  },
  transcendent: { border: "border-cyan-600",   badge: "bg-cyan-900/50 text-cyan-300",    bg: "bg-slate-800"  },
};

// ─── Category icon map ────────────────────────────────────────────────────────
const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  command_control:       <Cpu className="w-4 h-4" />,
  energy_systems:        <Zap className="w-4 h-4" />,
  defense_systems:       <Shield className="w-4 h-4" />,
  manufacturing:         <Hammer className="w-4 h-4" />,
  research_development:  <FlaskConical className="w-4 h-4" />,
  logistics_supply:      <Truck className="w-4 h-4" />,
  communications:        <Radio className="w-4 h-4" />,
  habitation:            <Users className="w-4 h-4" />,
  mining_extraction:     <Pickaxe className="w-4 h-4" />,
  trade_commerce:        <ShoppingCart className="w-4 h-4" />,
  military_operations:   <Sword className="w-4 h-4" />,
  shipyard_operations:   <Anchor className="w-4 h-4" />,
  intelligence:          <Eye className="w-4 h-4" />,
  diplomacy:             <HandshakeIcon className="w-4 h-4" />,
  terraforming:          <Wind className="w-4 h-4" />,
  anomaly_research:      <Search className="w-4 h-4" />,
  medical:               <Heart className="w-4 h-4" />,
  megastructure_support: <Layers className="w-4 h-4" />,
};

// ─── OrbitalStationCard ───────────────────────────────────────────────────────
function OrbitalStationCard({
  station,
  buildCount,
  onConstruct,
  requirementLabel,
}: {
  station: OrbitalStation;
  buildCount: number;
  onConstruct: (station: OrbitalStation) => void;
  requirementLabel?: string | null;
}) {
  const [expanded, setExpanded] = useState(false);
  const colors = CLASS_COLORS[station.class] ?? CLASS_COLORS.common;

  return (
    <Card className={`border-2 ${colors.border} ${colors.bg}`} data-testid={`card-station-${station.id}`}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-base text-white">{station.name}</CardTitle>
            <p className="text-xs text-slate-400 mt-0.5">{station.title} · {station.rank}</p>
          </div>
          <div className="flex flex-col items-end gap-1 ml-2">
            <Badge className={`${colors.badge} text-xs capitalize`}>{station.class}</Badge>
            <Badge variant="outline" className="text-xs">
              T{station.tier} · {station.subClass}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Description */}
        <p className="text-xs text-slate-300">{station.description}</p>
        <p className="text-xs text-slate-400 italic">{station.subDescription}</p>

        {/* Type badges */}
        <div className="flex flex-wrap gap-1">
          <Badge variant="outline" className="text-xs text-slate-300 border-slate-600">{station.type}</Badge>
          <Badge variant="outline" className="text-xs text-slate-300 border-slate-600">{station.subType}</Badge>
          <Badge variant="outline" className="text-xs text-slate-300 border-slate-600">Tier {station.tier}–{station.maxTier}</Badge>
          <Badge variant="outline" className="text-xs text-slate-300 border-slate-600">Lv 1–{station.maxLevel}</Badge>
        </div>

        {/* Cost */}
        <div className="p-2 bg-slate-700/50 rounded-lg border border-slate-600">
          <p className="text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1">
            <Hammer className="w-3 h-3" /> Base Construction Cost
          </p>
          <div className="grid grid-cols-3 gap-1.5">
            <div className="text-center p-1.5 bg-slate-800 rounded">
              <Box className="w-3 h-3 text-slate-400 mx-auto mb-0.5" />
              <p className="text-xs text-slate-400">Metal</p>
              <p className="font-bold text-xs text-white">{station.cost.metal.toLocaleString()}</p>
            </div>
            <div className="text-center p-1.5 bg-blue-900/30 rounded">
              <Gem className="w-3 h-3 text-blue-300 mx-auto mb-0.5" />
              <p className="text-xs text-blue-400">Crystal</p>
              <p className="font-bold text-xs text-blue-300">{station.cost.crystal.toLocaleString()}</p>
            </div>
            <div className="text-center p-1.5 bg-green-900/30 rounded">
              <Database className="w-3 h-3 text-green-300 mx-auto mb-0.5" />
              <p className="text-xs text-green-400">Deut.</p>
              <p className="font-bold text-xs text-green-300">{station.cost.deuterium.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Build time */}
        <div className="flex items-center justify-between p-2 bg-amber-900/20 rounded border border-amber-800/50">
          <div className="flex items-center gap-1.5 text-amber-400">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-xs">Build Time:</span>
          </div>
          <span className="font-bold text-xs text-amber-300">{formatTime(station.attributes.constructionTimeSec)}</span>
        </div>

        {/* Expand / collapse toggle */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between text-xs text-slate-400 hover:text-slate-300 py-1 border-t border-slate-700 mt-1"
          data-testid={`toggle-details-${station.id}`}
        >
          <span>Details, Stats & Subjects</span>
          {expanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
        </button>

        {expanded && (
          <div className="space-y-3 pt-1">
            {/* Details */}
            <div className="p-2 bg-slate-700/50 rounded border border-slate-600 text-xs">
              <p className="font-semibold text-slate-300 mb-1">Details</p>
              <p className="text-slate-400">{station.details}</p>
              {station.subDetails && <p className="text-slate-500 italic mt-1">{station.subDetails}</p>}
            </div>

            {/* Stats */}
            {Object.keys(station.stats).length > 0 && (
              <div className="p-2 bg-slate-700/50 rounded border border-slate-600 text-xs">
                <p className="font-semibold text-slate-300 mb-1">Stats</p>
                <div className="grid grid-cols-2 gap-1">
                  {Object.entries(station.stats).map(([k, v]) => (
                    v !== undefined && (
                      <div key={k} className="flex justify-between">
                        <span className="text-slate-400 capitalize">{k.replace(/([A-Z])/g, ' $1').trim()}:</span>
                        <span className="font-medium text-white">{v.toLocaleString()}</span>
                      </div>
                    )
                  ))}
                </div>
              </div>
            )}

            {/* Sub-Stats */}
            {Object.keys(station.subStats).length > 0 && (
              <div className="p-2 bg-slate-700/50 rounded border border-slate-600 text-xs">
                <p className="font-semibold text-slate-300 mb-1">Sub-Stats</p>
                <div className="grid grid-cols-2 gap-1">
                  {Object.entries(station.subStats).map(([k, v]) => (
                    v !== undefined && (
                      <div key={k} className="flex justify-between">
                        <span className="text-slate-400 capitalize">{k.replace(/([A-Z])/g, ' $1').trim()}:</span>
                        <span className="font-medium text-white">
                          {typeof v === 'number' ? (v > 0 && v < 1 ? `${(v * 100).toFixed(1)}%` : v.toLocaleString()) : String(v)}
                        </span>
                      </div>
                    )
                  ))}
                </div>
              </div>
            )}

            {/* Attributes */}
            <div className="p-2 bg-slate-700/50 rounded border border-slate-600 text-xs">
              <p className="font-semibold text-slate-300 mb-1">Attributes</p>
              <div className="grid grid-cols-2 gap-1">
                <div className="flex justify-between"><span className="text-slate-400">Orbital:</span><span className="font-medium text-white">{station.attributes.isOrbital ? "Yes" : "No"}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Modular:</span><span className="font-medium text-white">{station.attributes.isModular ? "Yes" : "No"}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Needs Moon:</span><span className="font-medium text-white">{station.attributes.requiresMoon ? "Yes" : "No"}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Cost Factor:</span><span className="font-medium text-white">×{station.attributes.costFactor}</span></div>
                {station.attributes.requiresTech && (
                  <div className="flex justify-between col-span-2"><span className="text-slate-400">Required Tech:</span><span className="font-medium text-white">{station.attributes.requiresTech}</span></div>
                )}
                {station.attributes.maxInstances && (
                  <div className="flex justify-between"><span className="text-slate-400">Max Instances:</span><span className="font-medium text-white">{station.attributes.maxInstances}</span></div>
                )}
              </div>
            </div>

            {/* Sub-Attributes */}
            <div className="p-2 bg-slate-700/50 rounded border border-slate-600 text-xs">
              <p className="font-semibold text-slate-300 mb-1">Sub-Attributes</p>
              <div className="grid grid-cols-2 gap-1">
                {Object.entries(station.subAttributes).map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span className="text-slate-400 capitalize">{k.replace(/([A-Z])/g, ' $1').trim()}:</span>
                    <span className="font-medium text-white">{typeof v === 'boolean' ? (v ? 'Yes' : 'No') : String(v)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Subjects */}
            {station.subjects.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-300">Subjects</p>
                {station.subjects.map((subject, i) => (
                  <div key={i} className="p-2 bg-slate-700/50 rounded border border-slate-600 text-xs">
                    <p className="font-medium text-white">{subject.name}</p>
                    <p className="text-slate-400 mt-0.5">{subject.details}</p>
                    <p className="text-slate-500 italic mt-0.5">{subject.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {requirementLabel && (
          <div className="rounded border border-amber-800/50 bg-amber-900/20 px-3 py-2 text-xs text-amber-400">
            {requirementLabel}
          </div>
        )}

        <Button className="w-full text-sm" size="sm" onClick={() => onConstruct(station)} data-testid={`button-build-station-${station.id}`}>
          <TrendingUp className="w-3.5 h-3.5 mr-1.5" />
          {buildCount > 0 ? `Expand ${station.title} (${buildCount})` : `Construct ${station.title}`}
        </Button>
      </CardContent>
    </Card>
  );
}

// ─── CategorySection: one accordion-style category ───────────────────────────
function CategorySection({
  category,
  buildCounts,
  onConstruct,
  getRequirementLabel,
}: {
  category: OrbitalCategoryMeta;
  buildCounts: Record<string, number>;
  onConstruct: (station: OrbitalStation) => void;
  getRequirementLabel: (station: OrbitalStation) => string | null;
}) {
  const [open, setOpen] = useState(false);
  const stations = getOrbitalStationsByCategory(category.id);
  const icon = CATEGORY_ICONS[category.id] ?? <Satellite className="w-4 h-4" />;

  return (
    <div className="border border-slate-700 rounded-lg overflow-hidden" data-testid={`category-${category.id}`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-slate-800 hover:bg-slate-700 transition-colors text-left"
      >
        <div className="flex items-center gap-2.5">
          <span className="text-slate-400">{icon}</span>
          <div>
            <span className="font-semibold text-white text-sm">{category.label}</span>
            <span className="ml-2 text-xs text-slate-400">({category.subCategories.length} sub-categories · {stations.length} stations)</span>
          </div>
        </div>
        {open ? <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" /> : <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />}
      </button>

      {open && (
        <div className="p-4 space-y-4">
          <p className="text-sm text-slate-400">{category.description}</p>

          {/* Sub-category pills */}
          <div className="flex flex-wrap gap-1.5">
            {category.subCategories.map(sub => (
              <Badge key={sub.id} variant="outline" className="text-xs text-slate-300 border-slate-600" title={sub.description}>
                {sub.label}
              </Badge>
            ))}
          </div>

          {/* Station cards */}
          {stations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stations.map(s => (
                <OrbitalStationCard
                  key={s.id}
                  station={s}
                  buildCount={buildCounts[s.id] ?? 0}
                  onConstruct={onConstruct}
                  requirementLabel={getRequirementLabel(s)}
                />
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">No station definitions for this category yet.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default function Stations() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { orbitalBuildings, updateBuilding, resources } = useGame();

  const moonBuildings = ORBITAL_BUILDINGS.filter(b => b.type === 'moon');
  const stationBuildings = ORBITAL_BUILDINGS.filter(b => b.type === 'station');
  const [activeTab, setActiveTab] = useState<StationsTab>("moon");

  const [deployedStrongholds, setDeployedStrongholds] = useState<Record<string, number>>({});
  const activeBuildingPool = activeTab === "moon" ? moonBuildings : stationBuildings;
  
  const buildingLevels = orbitalBuildings || {};

  // Queries
  const { data: orbitalStatus } = useQuery<any>({
    queryKey: ["orbital-stations-status"],
    queryFn: async () => {
      const response = await fetch("/api/orbital-stations/status", { credentials: "include" });
      if (!response.ok) throw new Error("Failed to fetch status");
      return response.json();
    },
  });

  const { data: configPlatforms } = useQuery<any>({
    queryKey: ["orbital-platforms"],
    queryFn: async () => {
      const response = await fetch("/api/orbital-stations/platforms", { credentials: "include" });
      return response.json();
    },
  });

  const { data: configSatellites } = useQuery<any>({
    queryKey: ["orbital-satellites"],
    queryFn: async () => {
      const response = await fetch("/api/orbital-stations/satellites", { credentials: "include" });
      return response.json();
    },
  });

  const { data: configDefenses } = useQuery<any>({
    queryKey: ["orbital-defenses"],
    queryFn: async () => {
      const response = await fetch("/api/orbital-stations/defense-systems", { credentials: "include" });
      return response.json();
    },
  });

  const { data: configOffenses } = useQuery<any>({
    queryKey: ["orbital-offenses"],
    queryFn: async () => {
      const response = await fetch("/api/orbital-stations/offense-systems", { credentials: "include" });
      return response.json();
    },
  });

  const { data: configShields } = useQuery<any>({
    queryKey: ["orbital-shields"],
    queryFn: async () => {
      const response = await fetch("/api/orbital-stations/shield-systems", { credentials: "include" });
      return response.json();
    },
  });

  // Mutations
  const buildMutation = useMutation({
    mutationFn: async (body: { platformType: string; name?: string; x?: number; y?: number }) => {
      const res = await fetch("/api/orbital-stations/build", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        credentials: "include",
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.message || "Failed to build platform");
      }
      return res.json();
    },
    onSuccess: (data) => {
      toast({ title: "Build Success", description: `Constructed ${data.station.name}` });
      queryClient.invalidateQueries({ queryKey: ["orbital-stations-status"] });
    },
    onError: (err: any) => {
      toast({ title: "Build Failed", description: err.message, variant: "destructive" });
    },
  });

  const upgradeMutation = useMutation({
    mutationFn: async (stationId: string) => {
      const res = await fetch("/api/orbital-stations/upgrade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stationId }),
        credentials: "include",
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.message || "Failed to upgrade platform");
      }
      return res.json();
    },
    onSuccess: (data) => {
      toast({ title: "Upgrade Success", description: `Upgraded ${data.station.name} to Tier ${data.station.tier}` });
      queryClient.invalidateQueries({ queryKey: ["orbital-stations-status"] });
    },
    onError: (err: any) => {
      toast({ title: "Upgrade Failed", description: err.message, variant: "destructive" });
    },
  });

  const [stationRenaming, setStationRenaming] = useState<string | null>(null);
  const [stationNewName, setStationNewName] = useState("");
  const stationRenameRef = useRef<HTMLInputElement>(null);

  const renameStationMutation = useMutation({
    mutationFn: async ({ stationId, name }: { stationId: string; name: string }) => {
      const res = await fetch(`/api/orbital-stations/${stationId}/rename`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
        credentials: "include",
      });
      if (!res.ok) { const err = await res.json(); throw new Error(err.error || "Rename failed"); }
      return res.json();
    },
    onSuccess: (data) => { toast({ title: "Station Renamed", description: `Now known as ${data.name}` }); queryClient.invalidateQueries({ queryKey: ["orbital-stations-status"] }); setStationRenaming(null); },
    onError: (e: Error) => { toast({ title: "Rename Failed", description: e.message, variant: "destructive" }); },
  });

  const deploySatelliteMutation = useMutation({
    mutationFn: async (body: { stationId: string; satelliteType: string }) => {
      const res = await fetch("/api/orbital-stations/deploy-satellite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        credentials: "include",
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.message || "Failed to deploy satellite");
      }
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Satellite Deployed", description: "Successfully launched satellite into orbit." });
      queryClient.invalidateQueries({ queryKey: ["orbital-stations-status"] });
    },
    onError: (err: any) => {
      toast({ title: "Deployment Failed", description: err.message, variant: "destructive" });
    },
  });

  const installDefenseMutation = useMutation({
    mutationFn: async (body: { stationId: string; defenseType: string }) => {
      const res = await fetch("/api/orbital-stations/install-defense", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        credentials: "include",
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.message || "Failed to install defense");
      }
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Defense Installed", description: "System installed and integrated." });
      queryClient.invalidateQueries({ queryKey: ["orbital-stations-status"] });
    },
    onError: (err: any) => {
      toast({ title: "Installation Failed", description: err.message, variant: "destructive" });
    },
  });

  const installOffenseMutation = useMutation({
    mutationFn: async (body: { stationId: string; offenseType: string }) => {
      const res = await fetch("/api/orbital-stations/install-offense", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        credentials: "include",
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.message || "Failed to install offense");
      }
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Offense Installed", description: "Weapon grid online and loaded." });
      queryClient.invalidateQueries({ queryKey: ["orbital-stations-status"] });
    },
    onError: (err: any) => {
      toast({ title: "Installation Failed", description: err.message, variant: "destructive" });
    },
  });

  const installShieldMutation = useMutation({
    mutationFn: async (body: { stationId: string; shieldType: string }) => {
      const res = await fetch("/api/orbital-stations/install-shield", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        credentials: "include",
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.message || "Failed to install shield");
      }
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Shield Installed", description: "Deflector field calibrated." });
      queryClient.invalidateQueries({ queryKey: ["orbital-stations-status"] });
    },
    onError: (err: any) => {
      toast({ title: "Installation Failed", description: err.message, variant: "destructive" });
    },
  });

  const decommissionMutation = useMutation({
    mutationFn: async (stationId: string) => {
      const res = await fetch(`/api/orbital-stations/${stationId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.message || "Failed to decommission station");
      }
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Station Decommissioned", description: "Platform dismantled and removed from orbit." });
      queryClient.invalidateQueries({ queryKey: ["orbital-stations-status"] });
    },
    onError: (err: any) => {
      toast({ title: "Decommission Failed", description: err.message, variant: "destructive" });
    },
  });

  const tickMutation = useMutation({
    mutationFn: async (stationId?: string) => {
      const res = await fetch("/api/orbital-stations/tick", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stationId }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to process tick");
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Station Tick Processed", description: "Production rates and maintenance calculated." });
      queryClient.invalidateQueries({ queryKey: ["orbital-stations-status"] });
    },
  });

  const { data: infrastructureData, refetch: refetchInfrastructure } = useQuery<any>({
    queryKey: ["orbital-stations-infrastructure"],
    queryFn: async () => {
      const response = await fetch("/api/orbital-stations/infrastructure", { credentials: "include" });
      if (!response.ok) throw new Error("Failed to fetch infrastructure");
      return response.json();
    },
  });

  const { data: stationScores } = useQuery<any>({
    queryKey: ["orbital-stations-scores"],
    queryFn: async () => {
      const response = await fetch("/api/orbital-stations/scores", { credentials: "include" });
      if (!response.ok) throw new Error("Failed to fetch scores");
      return response.json();
    },
  });

  const infraDeployMutation = useMutation({
    mutationFn: async (body: { stationId: string; name: string; category: string; subCategory: string; stationClass: string }) => {
      const res = await fetch("/api/orbital-stations/infrastructure/deploy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        credentials: "include",
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.message || "Failed to deploy infrastructure");
      }
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Infrastructure Deployed", description: "Station deployed and saved." });
      refetchInfrastructure();
    },
    onError: (err: any) => {
      toast({ title: "Deployment Failed", description: err.message, variant: "destructive" });
    },
  });

  const totalFacilityLevels = Object.values(buildingLevels).reduce<number>((sum, level) => sum + level, 0);
  const infrastructureBuildCounts = (infrastructureData?.infrastructure || []).reduce((acc: Record<string, number>, dep: any) => {
    acc[dep.stationId] = (acc[dep.stationId] || 0) + dep.count;
    return acc;
  }, {} as Record<string, number>);
  const totalInfrastructureBuilt = infrastructureData?.summary?.totalDeployed || 0;
  const totalStrongholds = Object.values(deployedStrongholds).reduce<number>((sum, count) => sum + count, 0);
  const averageCostFactor =
    activeBuildingPool.length > 0
      ? (activeBuildingPool.reduce((sum, building) => sum + building.costFactor, 0) / activeBuildingPool.length).toFixed(2)
      : "0.00";
  const orbitalStoryAct = Math.max(1, Math.min(12, Math.ceil(totalInfrastructureBuilt / 6) || 1));
  const moonbaseProfile = useMemo(
    () =>
      createHabitatConditionProfile({
        kind: "moonbase",
        name: "Lunar Base Network",
        habitability: 42 + Math.min((buildingLevels.lunarBase as number) || 0, 18),
        population: totalFacilityLevels * 1500,
        level: Math.max((buildingLevels.lunarBase as number) || 1, 1),
        integrity: 52 + Math.min(totalFacilityLevels, 40),
        stability: 48 + Math.min(((buildingLevels.sensorPhalanx as number) || 0) * 6 + ((buildingLevels.jumpGate as number) || 0) * 5, 42),
        storyAct: orbitalStoryAct,
      }),
    [buildingLevels, orbitalStoryAct, totalFacilityLevels],
  );
  const stationProfile = useMemo(
    () =>
      createHabitatConditionProfile({
        kind: "space-station",
        name: "Orbital Dock Grid",
        habitability: 56 + Math.min(((buildingLevels.spaceStation as number) || 0) * 7, 28),
        population: totalFacilityLevels * 2200,
        level: Math.max((buildingLevels.spaceStation as number) || 1, 1),
        integrity: 58 + Math.min(totalFacilityLevels, 34),
        stability: 52 + Math.min(((buildingLevels.fleetAcademy as number) || 0) * 5 + ((buildingLevels.allianceDepot as number) || 0) * 4, 40),
        storyAct: orbitalStoryAct,
      }),
    [buildingLevels, orbitalStoryAct, totalFacilityLevels],
  );
  const starbaseProfile = useMemo(
    () =>
      createHabitatConditionProfile({
        kind: "starbase",
        name: "Starbase Command Hub",
        habitability: 60 + Math.min(totalInfrastructureBuilt, 16),
        population: totalInfrastructureBuilt * 3000,
        level: Math.max((buildingLevels.starbaseHub as number) || 1, 1),
        integrity: 60 + Math.min(totalInfrastructureBuilt * 2 + ((buildingLevels.starbaseHub as number) || 0) * 5, 38),
        stability: 54 + Math.min(totalInfrastructureBuilt + totalFacilityLevels, 36),
        storyAct: orbitalStoryAct,
      }),
    [buildingLevels, orbitalStoryAct, totalFacilityLevels, totalInfrastructureBuilt],
  );

  const getBuildingRequirementLabel = (building: StationBuilding) => {
    if (building.type === "moon" && building.id !== "lunarBase" && ((buildingLevels.lunarBase as number) ?? 0) === 0) {
      return "Requires Lunar Base level 1 before this structure can be built.";
    }
    if (building.type === "station" && building.id !== "starbaseHub" && ((buildingLevels.starbaseHub as number) ?? 0) === 0) {
      return "Requires Starbase Command Hub level 1 before advanced station modules.";
    }
    return null;
  };

  const handleConstructBuilding = (building: StationBuilding) => {
    const requirementLabel = getBuildingRequirementLabel(building);
    if (requirementLabel) {
      toast({ title: "Construction blocked", description: requirementLabel, variant: "destructive" });
      return;
    }
    updateBuilding(building.id, building.name, building.buildTime);
  };

  const getStationRequirementLabel = (station: OrbitalStation) => {
    if (station.attributes.requiresMoon && ((buildingLevels.lunarBase as number) ?? 0) === 0) {
      return "Requires an established Lunar Base before orbital deployment.";
    }

    const currentCount = infrastructureBuildCounts[station.id] ?? 0;
    if (station.attributes.maxInstances && currentCount >= station.attributes.maxInstances) {
      return `Maximum instances reached (${station.attributes.maxInstances}).`;
    }

    return null;
  };

  const handleConstructInfrastructure = (station: OrbitalStation) => {
    const requirementLabel = getStationRequirementLabel(station);
    if (requirementLabel) {
      toast({ title: "Deployment blocked", description: requirementLabel, variant: "destructive" });
      return;
    }

    infraDeployMutation.mutate({
      stationId: station.id,
      name: station.title,
      category: station.category,
      subCategory: station.subCategory,
      stationClass: station.class,
    });
  };

  const getStrongholdRequirementLabel = (program: typeof STRONGHOLD_PROGRAMS[number]) => {
    if (((buildingLevels.starbaseHub as number) ?? 0) === 0) {
      return "Requires Starbase Command Hub level 1 before frontier stronghold deployment.";
    }
    if (program.tier !== "Frontier Tier I" && ((buildingLevels.strongholdCommandNexus as number) ?? 0) === 0) {
      return "Requires Stronghold Command Nexus level 1 for advanced keep and citadel control.";
    }
    if (program.status === "contested" && ((buildingLevels.defenseGrid as number) || 0) < 1) {
      return "Requires Orbital Defense Grid level 1 before contesting hostile strongholds.";
    }
    return null;
  };

  const handleDeployStronghold = (program: typeof STRONGHOLD_PROGRAMS[number]) => {
    const requirementLabel = getStrongholdRequirementLabel(program);
    if (requirementLabel) {
      toast({ title: "Deployment blocked", description: requirementLabel, variant: "destructive" });
      return;
    }

    const nextCount = (deployedStrongholds[program.id] ?? 0) + 1;
    setDeployedStrongholds((current) => ({ ...current, [program.id]: nextCount }));
    toast({
      title: "Stronghold protocol deployed",
      description: `${program.name} is now anchoring ${program.role.toLowerCase()}. Active count: ${nextCount}.`,
    });
  };

  useEffect(() => {
    const syncFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab");
      if (tabParam === "moon" || tabParam === "station" || tabParam === "active" || tabParam === "infrastructure") {
        setActiveTab(tabParam as StationsTab);
      }
    };

    syncFromUrl();
    window.addEventListener("popstate", syncFromUrl);
    return () => window.removeEventListener("popstate", syncFromUrl);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set("tab", activeTab);

    const nextUrl = `/stations?${params.toString()}`;
    const currentUrl = `${window.location.pathname}${window.location.search}`;

    if (currentUrl !== nextUrl) {
      window.history.replaceState(null, "", nextUrl);
    }
  }, [activeTab]);
  
  return (
    <GameLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold text-white flex items-center gap-3" data-testid="text-stations-title">
            <Satellite className="w-10 h-10 text-blue-400" />
            Orbital Stations
          </h1>
          <p className="text-slate-400 mt-2">Construct and manage moon bases and space stations with progression from Tiers 1-99 and Levels 1-999.</p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
            <CardContent className="p-4 text-center">
              <Moon className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{moonBuildings.length}</p>
              <p className="text-xs text-slate-400">Moon Facilities</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-blue-900/40 to-blue-800/30 border-blue-800/50">
            <CardContent className="p-4 text-center">
              <Satellite className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-300">{stationBuildings.length}</p>
              <p className="text-xs text-blue-400">Station Facilities</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-900/40 to-purple-800/30 border-purple-800/50">
            <CardContent className="p-4 text-center">
              <Building2 className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-purple-300">{ORBITAL_STATION_STATS.totalStations}</p>
              <p className="text-xs text-purple-400">Infrastructure Stations</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-slate-900/80 border-slate-700">
            <CardContent className="pt-6">
              <div className="text-xs uppercase text-slate-400">Active Facility Pool</div>
              <div className="text-2xl font-bold text-white">{activeBuildingPool.length}</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/80 border-slate-700">
            <CardContent className="pt-6">
              <div className="text-xs uppercase text-slate-400">Average Cost Factor</div>
              <div className="text-2xl font-bold text-blue-400">x{averageCostFactor}</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/80 border-slate-700">
            <CardContent className="pt-6">
              <div className="text-xs uppercase text-slate-400">Facility Levels</div>
              <div className="text-2xl font-bold text-purple-400">{totalFacilityLevels}</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/80 border-slate-700">
            <CardContent className="pt-6">
              <div className="text-xs uppercase text-slate-400">Infrastructure Built</div>
              <div className="text-2xl font-bold text-rose-400">{totalInfrastructureBuilt}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-slate-900/80 border-slate-700">
            <CardContent className="pt-6">
              <div className="text-xs uppercase text-slate-400">Strongholds Online</div>
              <div className="text-2xl font-bold text-indigo-400">{totalStrongholds}</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/80 border-slate-700">
            <CardContent className="pt-6">
              <div className="text-xs uppercase text-slate-400">Wormhole Anchors</div>
              <div className="text-2xl font-bold text-cyan-400">{buildingLevels.wormholeAnchor ?? 0}</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/80 border-slate-700">
            <CardContent className="pt-6">
              <div className="text-xs uppercase text-slate-400">Command Nexus</div>
              <div className="text-2xl font-bold text-amber-400">{buildingLevels.strongholdCommandNexus ?? 0}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <HabitatSystemsPanel
            profile={moonbaseProfile}
            title="Moon Base Environment and Disease Systems"
            description="Seal stability, regolith contamination, lunar disease pressure, and emergency recovery paths for moon facilities."
            compact
            managementHref="/planet-command"
          />
          <HabitatSystemsPanel
            profile={stationProfile}
            title="Space Station Habitat Systems"
            description="Orbital vent health, civilian disease control, dockyard recovery, and event pressure across station facilities."
            compact
            managementHref="/planet-command"
          />
          <HabitatSystemsPanel
            profile={starbaseProfile}
            title="Starbase Crisis and Recovery Systems"
            description="Starbase hull stress, barracks disease spread, emergency repairs, and story-linked frontier events."
            compact
            managementHref="/planet-command"
          />
        </div>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as StationsTab)} className="w-full">
          <TabsList className="bg-slate-800 border border-slate-700">
            <TabsTrigger value="moon" data-testid="tab-moon-buildings" className="text-xs data-[state=active]:bg-slate-700">
              <Moon className="w-4 h-4 mr-2" />
              Moon Facilities
            </TabsTrigger>
            <TabsTrigger value="station" data-testid="tab-station-buildings" className="text-xs data-[state=active]:bg-slate-700">
              <Satellite className="w-4 h-4 mr-2" />
              Station Facilities
            </TabsTrigger>
            <TabsTrigger value="active" data-testid="tab-active-stations" className="text-xs data-[state=active]:bg-slate-700">
              <Cpu className="w-4 h-4 mr-2" />
              Active Platforms
            </TabsTrigger>
            <TabsTrigger value="infrastructure" data-testid="tab-infrastructure" className="text-xs data-[state=active]:bg-slate-700">
              <Layers className="w-4 h-4 mr-2" />
              Infrastructure
            </TabsTrigger>
          </TabsList>

          <TabsContent value="moon" className="mt-4">
            <div className="mb-4 p-4 bg-slate-800 rounded-lg border border-slate-700">
              <h3 className="font-bold text-slate-300 mb-2 flex items-center gap-2">
                <Moon className="w-5 h-5" />
                Moon Facilities
              </h3>
              <p className="text-sm text-slate-400">
                Moon facilities provide unique strategic advantages. The Sensor Phalanx allows you to spy on fleet movements, 
                while Jump Gates enable instant fleet transfers between your moons.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {moonBuildings.map(building => (
                <BuildingCard
                  key={building.id}
                  building={building}
                  level={buildingLevels[building.id] ?? 0}
                  onConstruct={handleConstructBuilding}
                  requirementLabel={getBuildingRequirementLabel(building)}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="station" className="mt-4">
            <div className="mb-4 p-4 bg-slate-800 rounded-lg border border-slate-700">
              <h3 className="font-bold text-slate-300 mb-2 flex items-center gap-2">
                <Satellite className="w-5 h-5" />
                Space Station Facilities
              </h3>
              <p className="text-sm text-slate-400">
                Space stations serve as orbital hubs for trade, defense, and ship construction. 
                Zero-gravity manufacturing allows for faster capital ship production.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stationBuildings.map(building => (
                <BuildingCard
                  key={building.id}
                  building={building}
                  level={buildingLevels[building.id] ?? 0}
                  onConstruct={handleConstructBuilding}
                  requirementLabel={getBuildingRequirementLabel(building)}
                />
              ))}
            </div>

            <Card className="mt-6 bg-slate-900/80 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Stronghold Command Programs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {STRONGHOLD_PROGRAMS.map((program) => (
                    <Card key={program.id} className="border-slate-700 bg-slate-800">
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="font-semibold text-white">{program.name}</div>
                            <div className="text-xs text-slate-400">{program.tier} · {program.orbit}</div>
                          </div>
                          <Badge className={program.status === "operational" ? "bg-green-900/50 text-green-300" : program.status === "contested" ? "bg-red-900/50 text-red-300" : "bg-blue-900/50 text-blue-300"}>
                            {program.status}
                          </Badge>
                        </div>

                        <p className="text-sm text-slate-300">{program.summary}</p>

                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div className="rounded border border-slate-600 bg-slate-700/50 p-2 text-slate-300">Defense <span className="font-bold text-white">{program.defense}</span></div>
                          <div className="rounded border border-slate-600 bg-slate-700/50 p-2 text-slate-300">Logistics <span className="font-bold text-white">{program.logistics}</span></div>
                          <div className="rounded border border-slate-600 bg-slate-700/50 p-2 text-slate-300">Command <span className="font-bold text-white">{program.command}</span></div>
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {program.facilities.map((facility) => (
                            <Badge key={facility} variant="outline" className="text-slate-300 border-slate-600">{facility}</Badge>
                          ))}
                        </div>

                        <div className="space-y-1 text-xs text-slate-400">
                          {program.upgradeTracks.map((track) => (
                            <div key={track.name}>
                              <span className="font-semibold text-slate-300">{track.name}:</span> {track.effect}
                            </div>
                          ))}
                        </div>

                        {getStrongholdRequirementLabel(program) && (
                          <div className="rounded border border-amber-800/50 bg-amber-900/20 px-3 py-2 text-xs text-amber-400">
                            {getStrongholdRequirementLabel(program)}
                          </div>
                        )}

                        <Button className="w-full" onClick={() => handleDeployStronghold(program)} data-testid={`button-deploy-stronghold-${program.id}`}>
                          Deploy Stronghold
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="active" className="mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
              <div className="space-y-6">
                {/* Active Stations Stats Dashboard */}
                <Card className="bg-slate-900/60 border-slate-800 text-white">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Activity className="w-5 h-5 text-blue-400" /> Active Platforms Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div className="p-3 bg-slate-950/40 rounded border border-slate-850">
                      <div className="text-xs text-slate-400">Deployed Platforms</div>
                      <div className="text-2xl font-bold mt-1">{orbitalStatus?.stationCount || 0} / {orbitalStatus?.maxStations || 5}</div>
                    </div>
                    <div className="p-3 bg-slate-950/40 rounded border border-slate-850">
                      <div className="text-xs text-slate-400">Total Defense Score</div>
                      <div className="text-2xl font-bold mt-1 text-emerald-400">{orbitalStatus?.totalDefenseScore || 0}</div>
                    </div>
                    <div className="p-3 bg-slate-950/40 rounded border border-slate-850">
                      <div className="text-xs text-slate-400">Total Offense Score</div>
                      <div className="text-2xl font-bold mt-1 text-rose-400">{orbitalStatus?.totalOffenseScore || 0}</div>
                    </div>
                    <div className="p-3 bg-slate-950/40 rounded border border-slate-850">
                      <div className="text-xs text-slate-400">Satellites Launched</div>
                      <div className="text-2xl font-bold mt-1 text-cyan-400">{orbitalStatus?.satellitesDeployed || 0}</div>
                    </div>
                  </CardContent>
                </Card>

                {/* Station Scores Breakdown */}
                {stationScores?.scores && stationScores.scores.length > 0 && (
                  <Card className="bg-slate-900/60 border-slate-800 text-white">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-amber-400" /> Station Scores Breakdown
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {stationScores.scores.map((s: any) => (
                          <div key={s.id} className="p-3 bg-slate-950/40 rounded border border-slate-850">
                            <div className="font-bold text-white text-sm mb-2">{s.name}</div>
                            <div className="grid grid-cols-3 gap-2 text-xs">
                              <div className="text-center">
                                <div className="text-emerald-400 font-bold">{s.defenseScore}</div>
                                <div className="text-slate-500">Defense</div>
                              </div>
                              <div className="text-center">
                                <div className="text-rose-400 font-bold">{s.offenseScore}</div>
                                <div className="text-slate-500">Offense</div>
                              </div>
                              <div className="text-center">
                                <div className="text-amber-400 font-bold">{s.production.metal}/{s.production.crystal}/{s.production.deuterium}</div>
                                <div className="text-slate-500">Prod.</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Built Station Cards */}
                {orbitalStatus?.stations && orbitalStatus.stations.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {orbitalStatus.stations.map((s: any) => (
                      <Card key={s.id} className="bg-slate-900/60 border-slate-800 text-white">
                        <CardHeader className="pb-2 border-b border-slate-800">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="text-xl font-bold text-white flex items-center gap-2">
                                <span>🛸</span>
                                {stationRenaming === s.id ? (
                                  <div className="flex items-center gap-2">
                                    <input ref={stationRenameRef} type="text" value={stationNewName}
                                      onChange={e => setStationNewName(e.target.value)}
                                      onKeyDown={e => { if (e.key === "Enter") renameStationMutation.mutate({ stationId: s.id, name: stationNewName }); if (e.key === "Escape") setStationRenaming(null); }}
                                      className="text-lg bg-slate-800 border border-slate-600 rounded px-2 py-0.5 text-white w-40" autoFocus />
                                    <Button size="sm" className="h-6 text-xs" onClick={() => renameStationMutation.mutate({ stationId: s.id, name: stationNewName })} disabled={renameStationMutation.isPending}>Save</Button>
                                    <Button size="sm" variant="ghost" className="h-6 text-xs" onClick={() => setStationRenaming(null)}>Cancel</Button>
                                  </div>
                                ) : (
                                  <span>{s.name}</span>
                                )}
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-slate-400 hover:text-white"
                                  onClick={() => { setStationNewName(s.name); setStationRenaming(s.id); setTimeout(() => stationRenameRef.current?.focus(), 50); }}>
                                  ✏️
                                </Button>
                              </div>
                              <div className="text-xs text-slate-400 mt-0.5">
                                Platform Type: <span className="font-semibold text-blue-400 capitalize">{s.platformType.replace("_", " ")}</span> · Coords: ({s.x}, {s.y})
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Badge className="bg-blue-950 text-blue-400 border border-blue-900">Tier {s.tier}</Badge>
                              <Badge className="bg-purple-950 text-purple-400 border border-purple-900">Lv. {s.level}</Badge>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="p-4 space-y-4">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                            <div className="p-2 bg-slate-950/30 rounded border border-slate-850">
                              <span className="text-slate-400 block mb-0.5">Metal Storage</span>
                              <span className="font-bold text-white">{Math.round(s.resourceStorage.metal).toLocaleString()} / {s.maxStorage.metal.toLocaleString()}</span>
                            </div>
                            <div className="p-2 bg-slate-950/30 rounded border border-slate-850">
                              <span className="text-slate-400 block mb-0.5">Crystal Storage</span>
                              <span className="font-bold text-blue-400">{Math.round(s.resourceStorage.crystal).toLocaleString()} / {s.maxStorage.crystal.toLocaleString()}</span>
                            </div>
                            <div className="p-2 bg-slate-950/30 rounded border border-slate-850">
                              <span className="text-slate-400 block mb-0.5">Deut. Storage</span>
                              <span className="font-bold text-green-400">{Math.round(s.resourceStorage.deuterium).toLocaleString()} / {s.maxStorage.deuterium.toLocaleString()}</span>
                            </div>
                            <div className="p-2 bg-slate-950/30 rounded border border-slate-850">
                              <span className="text-slate-400 block mb-0.5">Credits Storage</span>
                              <span className="font-bold text-amber-400">{Math.round(s.resourceStorage.credits).toLocaleString()} / {s.maxStorage.credits.toLocaleString()}</span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <Button size="sm" variant="outline" className="border-blue-600 text-blue-400 hover:text-white"
                              onClick={() => upgradeMutation.mutate(s.id)} disabled={upgradeMutation.isPending}>
                              <TrendingUp className="w-3.5 h-3.5 mr-1" /> Upgrade Tier
                            </Button>
                            <Button size="sm" variant="outline" className="border-green-600 text-green-400 hover:text-white"
                              onClick={() => tickMutation.mutate(s.id)} disabled={tickMutation.isPending}>
                              <Play className="w-3.5 h-3.5 mr-1" /> Process Tick
                            </Button>
                            <Button size="sm" variant="outline" className="border-red-800 text-red-400 hover:text-white hover:bg-red-900/30"
                              onClick={() => {
                                if (confirm(`Decommission "${s.name}"? This will dismantle the platform and remove all installed systems.`)) {
                                  decommissionMutation.mutate(s.id);
                                }
                              }} disabled={decommissionMutation.isPending}>
                              <Trash2 className="w-3.5 h-3.5 mr-1" /> Decommission
                            </Button>
                          </div>

                          {/* Modular Fittings Sub-grids */}
                          <div className="border-t border-slate-800/80 pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Satellites Fitting */}
                            <div className="space-y-2">
                              <div className="text-sm font-bold text-slate-300 flex items-center justify-between">
                                <span>Deployed Satellites ({s.satellites.length})</span>
                                <select className="bg-slate-950 text-xs border border-slate-805 rounded px-1.5 py-0.5 text-blue-400"
                                  onChange={(e) => {
                                    if (e.target.value) {
                                      deploySatelliteMutation.mutate({ stationId: s.id, satelliteType: e.target.value });
                                      e.target.value = "";
                                    }
                                  }}>
                                  <option value="">+ Deploy</option>
                                  {configSatellites?.satellites?.map((sat: any) => (
                                    <option key={sat.type} value={sat.type}>{sat.name}</option>
                                  ))}
                                </select>
                              </div>
                              <div className="space-y-1 max-h-24 overflow-y-auto">
                                {s.satellites.length > 0 ? s.satellites.map((sat: any, idx: number) => (
                                  <div key={idx} className="flex justify-between items-center text-xs p-1.5 bg-slate-950/20 border border-slate-850 rounded">
                                    <span className="capitalize">{sat.type.replace("_", " ")}</span>
                                    <span className="text-slate-400">Tier {sat.tier}</span>
                                  </div>
                                )) : <div className="text-xs text-slate-500 italic">No satellites deployed.</div>}
                              </div>
                            </div>

                            {/* Shield Systems Fitting */}
                            <div className="space-y-2">
                              <div className="text-sm font-bold text-slate-300 flex items-center justify-between">
                                <span>Shield Deflectors ({s.shields.length})</span>
                                <select className="bg-slate-950 text-xs border border-slate-805 rounded px-1.5 py-0.5 text-blue-400"
                                  onChange={(e) => {
                                    if (e.target.value) {
                                      installShieldMutation.mutate({ stationId: s.id, shieldType: e.target.value });
                                      e.target.value = "";
                                    }
                                  }}>
                                  <option value="">+ Install</option>
                                  {configShields?.shieldSystems?.map((sh: any) => (
                                    <option key={sh.type} value={sh.type}>{sh.name}</option>
                                  ))}
                                </select>
                              </div>
                              <div className="space-y-1 max-h-24 overflow-y-auto">
                                {s.shields.length > 0 ? s.shields.map((sh: any, idx: number) => (
                                  <div key={idx} className="flex justify-between items-center text-xs p-1.5 bg-slate-950/20 border border-slate-850 rounded">
                                    <span className="capitalize">{sh.type.replace("_", " ")}</span>
                                    <span className="text-emerald-400 font-mono">{sh.currentHp} / {sh.maxHp} HP</span>
                                  </div>
                                )) : <div className="text-xs text-slate-500 italic">No shields installed.</div>}
                              </div>
                            </div>

                            {/* Defenses Fitting */}
                            <div className="space-y-2">
                              <div className="text-sm font-bold text-slate-300 flex items-center justify-between">
                                <span>Defense Turrets ({s.defenses.length})</span>
                                <select className="bg-slate-950 text-xs border border-slate-805 rounded px-1.5 py-0.5 text-blue-400"
                                  onChange={(e) => {
                                    if (e.target.value) {
                                      installDefenseMutation.mutate({ stationId: s.id, defenseType: e.target.value });
                                      e.target.value = "";
                                    }
                                  }}>
                                  <option value="">+ Add Turret</option>
                                  {configDefenses?.defenseSystems?.map((def: any) => (
                                    <option key={def.type} value={def.type}>{def.name}</option>
                                  ))}
                                </select>
                              </div>
                              <div className="space-y-1 max-h-24 overflow-y-auto">
                                {s.defenses.length > 0 ? s.defenses.map((def: any, idx: number) => (
                                  <div key={idx} className="flex justify-between items-center text-xs p-1.5 bg-slate-950/20 border border-slate-850 rounded">
                                    <span className="capitalize">{def.type.replace("_", " ")}</span>
                                    <span className="text-slate-400">Level {def.level}</span>
                                  </div>
                                )) : <div className="text-xs text-slate-500 italic">No defenses installed.</div>}
                              </div>
                            </div>

                            {/* Offenses Fitting */}
                            <div className="space-y-2">
                              <div className="text-sm font-bold text-slate-300 flex items-center justify-between">
                                <span>Offensive Weaponry ({s.offenses.length})</span>
                                <select className="bg-slate-950 text-xs border border-slate-805 rounded px-1.5 py-0.5 text-blue-400"
                                  onChange={(e) => {
                                    if (e.target.value) {
                                      installOffenseMutation.mutate({ stationId: s.id, offenseType: e.target.value });
                                      e.target.value = "";
                                    }
                                  }}>
                                  <option value="">+ Add Cannon</option>
                                  {configOffenses?.offenseSystems?.map((off: any) => (
                                    <option key={off.type} value={off.type}>{off.name}</option>
                                  ))}
                                </select>
                              </div>
                              <div className="space-y-1 max-h-24 overflow-y-auto">
                                {s.offenses.length > 0 ? s.offenses.map((off: any, idx: number) => (
                                  <div key={idx} className="flex justify-between items-center text-xs p-1.5 bg-slate-950/20 border border-slate-850 rounded">
                                    <span className="capitalize">{off.type.replace("_", " ")}</span>
                                    <span className="text-slate-400">Level {off.level}</span>
                                  </div>
                                )) : <div className="text-xs text-slate-500 italic">No offenses installed.</div>}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="bg-slate-900/60 border-slate-800 text-slate-400 text-center py-12">
                    <CardContent className="space-y-3">
                      <Satellite className="w-12 h-12 text-slate-600 mx-auto" />
                      <div className="font-bold text-white text-base">No Deployed Orbital Platforms</div>
                      <p className="text-sm max-w-sm mx-auto">Establish customized space stations or moon bases to gather global bonuses, construct ships, and secure defenses.</p>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Build Platform Form */}
              <div className="space-y-4">
                <Card className="bg-slate-900 border-slate-800 text-white">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Plus className="w-4 h-4 text-blue-400" /> Deploy New Platform
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <form className="space-y-4" onSubmit={(e) => {
                      e.preventDefault();
                      const form = e.currentTarget;
                      const formData = new FormData(form);
                      const platformType = formData.get("platformType") as string;
                      const name = formData.get("name") as string;
                      if (!platformType) return;
                      buildMutation.mutate({ platformType, name });
                      form.reset();
                    }}>
                      <div className="space-y-2">
                        <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Platform Type</label>
                        <select name="platformType" required className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm text-white">
                          <option value="">Select Platform Type...</option>
                          {configPlatforms?.platforms?.map((plat: any) => (
                            <option key={plat.type} value={plat.type}>{plat.name} ({plat.description})</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Name (Optional)</label>
                        <Input name="name" placeholder="Custom platform name..." className="bg-slate-950 border-slate-850 text-white text-sm" />
                      </div>

                      <Button type="submit" className="w-full" disabled={buildMutation.isPending}>
                        Construct Platform
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="infrastructure" className="mt-4">
            <div className="mb-4 p-4 bg-purple-900/20 rounded-lg border border-purple-800/50">
              <h3 className="font-bold text-purple-300 mb-2 flex items-center gap-2">
                <Layers className="w-5 h-5" />
                Orbital Station Infrastructure
              </h3>
              <p className="text-sm text-purple-300/80">
                Manage the full spectrum of orbital station infrastructure across{" "}
                <strong>{ORBITAL_STATION_STATS.totalCategories} categories</strong> and{" "}
                <strong>{ORBITAL_STATION_STATS.totalSubCategories} sub-categories</strong>.
                Each station supports Tiers 1–{ORBITAL_STATION_STATS.maxTier} and Levels 1–{ORBITAL_STATION_STATS.maxLevel},
                with rich metadata including class, sub-class, type, sub-type, rank, title, stats, attributes, and subjects.
              </p>
            </div>

            {/* Progress overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              <Card className="bg-slate-900/80 border-slate-700">
                <CardContent className="p-3 text-center">
                  <p className="text-xl font-bold text-white">{ORBITAL_STATION_STATS.totalStations}</p>
                  <p className="text-xs text-slate-400">Total Stations</p>
                </CardContent>
              </Card>
              <Card className="bg-slate-900/80 border-slate-700">
                <CardContent className="p-3 text-center">
                  <p className="text-xl font-bold text-blue-400">{ORBITAL_STATION_STATS.maxTier}</p>
                  <p className="text-xs text-slate-400">Max Tier</p>
                </CardContent>
              </Card>
              <Card className="bg-slate-900/80 border-slate-700">
                <CardContent className="p-3 text-center">
                  <p className="text-xl font-bold text-purple-400">{ORBITAL_STATION_STATS.maxLevel}</p>
                  <p className="text-xs text-slate-400">Max Level</p>
                </CardContent>
              </Card>
              <Card className="bg-slate-900/80 border-slate-700">
                <CardContent className="p-3 text-center">
                  <p className="text-xl font-bold text-rose-400">7</p>
                  <p className="text-xs text-slate-400">Station Classes</p>
                </CardContent>
              </Card>
            </div>

            <Card className="mb-6 bg-indigo-900/20 border-indigo-800/50">
              <CardHeader>
                <CardTitle className="text-indigo-300">Frontier Stronghold Logic</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-indigo-300">
                <div className="rounded border border-indigo-800/50 bg-slate-800/80 p-3">Strongholds act as frontier command nodes for siege timers, route control, and fleet tethering.</div>
                <div className="rounded border border-indigo-800/50 bg-slate-800/80 p-3">Wormhole Anchor Arrays and Stronghold Command Nexus upgrades unlock deeper keep and citadel programs.</div>
                <div className="rounded border border-indigo-800/50 bg-slate-800/80 p-3">Infrastructure, raids, and research now share the same bastion progression instead of living in separate systems.</div>
              </CardContent>
            </Card>

            {/* Category accordion list */}
            <div className="space-y-2">
              {ORBITAL_STATION_CATEGORIES.map(cat => (
                <CategorySection
                  key={cat.id}
                  category={cat}
                  buildCounts={infrastructureBuildCounts}
                  onConstruct={handleConstructInfrastructure}
                  getRequirementLabel={getStationRequirementLabel}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Orbital Construction Tips</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-300 space-y-2">
            <p>
              <strong>Progression:</strong> Orbital facilities scale through <strong>Tiers 1-99</strong> and <strong>Levels 1-999</strong>, combining milestone upgrades with long-term level growth.
            </p>
            <p>
              <strong>Lunar Base:</strong> Required first before any other moon construction. 
              Provides the foundation for all lunar operations.
            </p>
            <p>
              <strong>Sensor Phalanx:</strong> Essential for intelligence gathering. 
              Can detect enemy fleet movements on neighboring planets.
            </p>
            <p>
              <strong>Jump Gates:</strong> Expensive but invaluable. 
              Allow instant, free fleet transfers between your moons - perfect for rapid response.
            </p>
            <p>
              <strong>Starbase Hub:</strong> The command center of your space station. 
              Increases overall station durability and unlocks advanced facilities.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Orbital Build Doctrine</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-slate-300">
            <div className="rounded border border-slate-700 bg-slate-800 p-3">
              <div className="font-semibold text-white">Moon Priority</div>
              <div>Secure intelligence and mobility first through phalanx and gate infrastructure.</div>
            </div>
            <div className="rounded border border-slate-700 bg-slate-800 p-3">
              <div className="font-semibold text-white">Station Priority</div>
              <div>Scale logistics and ship support before pushing expensive combat modules.</div>
            </div>
            <div className="rounded border border-slate-700 bg-slate-800 p-3">
              <div className="font-semibold text-white">Cost Control</div>
              <div>Stagger upgrades across structures to flatten cost-factor spikes.</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </GameLayout>
  );
}
