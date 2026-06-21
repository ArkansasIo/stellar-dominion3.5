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
  Search, Heart, Cpu,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { createHabitatConditionProfile } from "@/lib/environmentSystems";

type StationsTab = "moon" | "station" | "infrastructure";

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
    moon: { bg: "bg-slate-50", border: "border-slate-300", badge: "bg-slate-100 text-slate-700" },
    station: { bg: "bg-blue-50", border: "border-blue-300", badge: "bg-blue-100 text-blue-700" },
    planet: { bg: "bg-green-50", border: "border-green-300", badge: "bg-green-100 text-green-700" }
  };
  
  const colors = typeColors[building.type] || typeColors.planet;
  
  return (
    <Card className={`border-2 ${colors.border} ${colors.bg}`} data-testid={`card-building-${building.id}`}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-lg border border-slate-200 w-12 h-12 flex items-center justify-center overflow-hidden">
              <img
                src={imagePath}
                alt={building.name}
                className="w-9 h-9 object-contain"
                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = TEMP_THEME_IMAGE; }}
              />
            </div>
            <div>
              <CardTitle className="text-lg">{building.name}</CardTitle>
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
        <p className="text-sm text-slate-600">{building.description}</p>
        
        <div className="p-3 bg-white rounded-lg border border-slate-200">
          <p className="text-xs font-bold text-slate-600 mb-2 flex items-center gap-1">
            <Hammer className="w-3 h-3" /> CONSTRUCTION COST (Level {level + 1})
          </p>
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center p-2 bg-slate-50 rounded">
              <Box className="w-4 h-4 text-slate-600 mx-auto mb-1" />
              <p className="text-xs text-slate-500">Metal</p>
              <p className="font-bold text-sm">{cost.metal.toLocaleString()}</p>
            </div>
            <div className="text-center p-2 bg-blue-50 rounded">
              <Gem className="w-4 h-4 text-blue-600 mx-auto mb-1" />
              <p className="text-xs text-blue-500">Crystal</p>
              <p className="font-bold text-sm text-blue-700">{cost.crystal.toLocaleString()}</p>
            </div>
            <div className="text-center p-2 bg-green-50 rounded">
              <Database className="w-4 h-4 text-green-600 mx-auto mb-1" />
              <p className="text-xs text-green-500">Deuterium</p>
              <p className="font-bold text-sm text-green-700">{cost.deuterium.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-2 bg-amber-50 rounded border border-amber-200">
          <div className="flex items-center gap-2 text-amber-700">
            <Clock className="w-4 h-4" />
            <span className="text-sm">Build Time:</span>
          </div>
          <span className="font-bold text-amber-900">{formatTime(buildTime)}</span>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>Cost Factor: x{building.costFactor}</span>
        </div>

        {requirementLabel && (
          <div className="rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
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
  common:       { border: "border-slate-300",  badge: "bg-slate-100 text-slate-700",  bg: "bg-slate-50"  },
  uncommon:     { border: "border-green-300",  badge: "bg-green-100 text-green-700",  bg: "bg-green-50"  },
  rare:         { border: "border-blue-300",   badge: "bg-blue-100 text-blue-700",    bg: "bg-blue-50"   },
  epic:         { border: "border-purple-300", badge: "bg-purple-100 text-purple-700",bg: "bg-purple-50" },
  legendary:    { border: "border-amber-400",  badge: "bg-amber-100 text-amber-800",  bg: "bg-amber-50"  },
  mythic:       { border: "border-rose-400",   badge: "bg-rose-100 text-rose-800",    bg: "bg-rose-50"   },
  transcendent: { border: "border-cyan-400",   badge: "bg-cyan-100 text-cyan-800",    bg: "bg-cyan-50"   },
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
            <CardTitle className="text-base">{station.name}</CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">{station.title} · {station.rank}</p>
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
        <p className="text-xs text-slate-600">{station.description}</p>
        <p className="text-xs text-slate-500 italic">{station.subDescription}</p>

        {/* Type badges */}
        <div className="flex flex-wrap gap-1">
          <Badge variant="outline" className="text-xs">{station.type}</Badge>
          <Badge variant="outline" className="text-xs">{station.subType}</Badge>
          <Badge variant="outline" className="text-xs">Tier {station.tier}–{station.maxTier}</Badge>
          <Badge variant="outline" className="text-xs">Lv 1–{station.maxLevel}</Badge>
        </div>

        {/* Cost */}
        <div className="p-2 bg-white rounded-lg border border-slate-200">
          <p className="text-xs font-bold text-slate-600 mb-1.5 flex items-center gap-1">
            <Hammer className="w-3 h-3" /> Base Construction Cost
          </p>
          <div className="grid grid-cols-3 gap-1.5">
            <div className="text-center p-1.5 bg-slate-50 rounded">
              <Box className="w-3 h-3 text-slate-600 mx-auto mb-0.5" />
              <p className="text-xs text-slate-500">Metal</p>
              <p className="font-bold text-xs">{station.cost.metal.toLocaleString()}</p>
            </div>
            <div className="text-center p-1.5 bg-blue-50 rounded">
              <Gem className="w-3 h-3 text-blue-600 mx-auto mb-0.5" />
              <p className="text-xs text-blue-500">Crystal</p>
              <p className="font-bold text-xs text-blue-700">{station.cost.crystal.toLocaleString()}</p>
            </div>
            <div className="text-center p-1.5 bg-green-50 rounded">
              <Database className="w-3 h-3 text-green-600 mx-auto mb-0.5" />
              <p className="text-xs text-green-500">Deut.</p>
              <p className="font-bold text-xs text-green-700">{station.cost.deuterium.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Build time */}
        <div className="flex items-center justify-between p-2 bg-amber-50 rounded border border-amber-200">
          <div className="flex items-center gap-1.5 text-amber-700">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-xs">Build Time:</span>
          </div>
          <span className="font-bold text-xs text-amber-900">{formatTime(station.attributes.constructionTimeSec)}</span>
        </div>

        {/* Expand / collapse toggle */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between text-xs text-slate-500 hover:text-slate-700 py-1 border-t border-slate-200 mt-1"
          data-testid={`toggle-details-${station.id}`}
        >
          <span>Details, Stats & Subjects</span>
          {expanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
        </button>

        {expanded && (
          <div className="space-y-3 pt-1">
            {/* Details */}
            <div className="p-2 bg-white rounded border border-slate-200 text-xs">
              <p className="font-semibold text-slate-700 mb-1">Details</p>
              <p className="text-slate-600">{station.details}</p>
              {station.subDetails && <p className="text-slate-500 italic mt-1">{station.subDetails}</p>}
            </div>

            {/* Stats */}
            {Object.keys(station.stats).length > 0 && (
              <div className="p-2 bg-white rounded border border-slate-200 text-xs">
                <p className="font-semibold text-slate-700 mb-1">Stats</p>
                <div className="grid grid-cols-2 gap-1">
                  {Object.entries(station.stats).map(([k, v]) => (
                    v !== undefined && (
                      <div key={k} className="flex justify-between">
                        <span className="text-slate-500 capitalize">{k.replace(/([A-Z])/g, ' $1').trim()}:</span>
                        <span className="font-medium text-slate-700">{v.toLocaleString()}</span>
                      </div>
                    )
                  ))}
                </div>
              </div>
            )}

            {/* Sub-Stats */}
            {Object.keys(station.subStats).length > 0 && (
              <div className="p-2 bg-white rounded border border-slate-200 text-xs">
                <p className="font-semibold text-slate-700 mb-1">Sub-Stats</p>
                <div className="grid grid-cols-2 gap-1">
                  {Object.entries(station.subStats).map(([k, v]) => (
                    v !== undefined && (
                      <div key={k} className="flex justify-between">
                        <span className="text-slate-500 capitalize">{k.replace(/([A-Z])/g, ' $1').trim()}:</span>
                        <span className="font-medium text-slate-700">
                          {typeof v === 'number' ? (v > 0 && v < 1 ? `${(v * 100).toFixed(1)}%` : v.toLocaleString()) : String(v)}
                        </span>
                      </div>
                    )
                  ))}
                </div>
              </div>
            )}

            {/* Attributes */}
            <div className="p-2 bg-white rounded border border-slate-200 text-xs">
              <p className="font-semibold text-slate-700 mb-1">Attributes</p>
              <div className="grid grid-cols-2 gap-1">
                <div className="flex justify-between"><span className="text-slate-500">Orbital:</span><span className="font-medium">{station.attributes.isOrbital ? "Yes" : "No"}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Modular:</span><span className="font-medium">{station.attributes.isModular ? "Yes" : "No"}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Needs Moon:</span><span className="font-medium">{station.attributes.requiresMoon ? "Yes" : "No"}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Cost Factor:</span><span className="font-medium">×{station.attributes.costFactor}</span></div>
                {station.attributes.requiresTech && (
                  <div className="flex justify-between col-span-2"><span className="text-slate-500">Required Tech:</span><span className="font-medium">{station.attributes.requiresTech}</span></div>
                )}
                {station.attributes.maxInstances && (
                  <div className="flex justify-between"><span className="text-slate-500">Max Instances:</span><span className="font-medium">{station.attributes.maxInstances}</span></div>
                )}
              </div>
            </div>

            {/* Sub-Attributes */}
            <div className="p-2 bg-white rounded border border-slate-200 text-xs">
              <p className="font-semibold text-slate-700 mb-1">Sub-Attributes</p>
              <div className="grid grid-cols-2 gap-1">
                {Object.entries(station.subAttributes).map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span className="text-slate-500 capitalize">{k.replace(/([A-Z])/g, ' $1').trim()}:</span>
                    <span className="font-medium">{typeof v === 'boolean' ? (v ? 'Yes' : 'No') : String(v)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Subjects */}
            {station.subjects.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-700">Subjects</p>
                {station.subjects.map((subject, i) => (
                  <div key={i} className="p-2 bg-slate-50 rounded border border-slate-200 text-xs">
                    <p className="font-medium text-slate-800">{subject.name}</p>
                    <p className="text-slate-600 mt-0.5">{subject.details}</p>
                    <p className="text-slate-500 italic mt-0.5">{subject.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {requirementLabel && (
          <div className="rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
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
    <div className="border border-slate-200 rounded-lg overflow-hidden" data-testid={`category-${category.id}`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
      >
        <div className="flex items-center gap-2.5">
          <span className="text-slate-600">{icon}</span>
          <div>
            <span className="font-semibold text-slate-800 text-sm">{category.label}</span>
            <span className="ml-2 text-xs text-slate-500">({category.subCategories.length} sub-categories · {stations.length} stations)</span>
          </div>
        </div>
        {open ? <ChevronDown className="w-4 h-4 text-slate-500 flex-shrink-0" /> : <ChevronRight className="w-4 h-4 text-slate-500 flex-shrink-0" />}
      </button>

      {open && (
        <div className="p-4 space-y-4">
          <p className="text-sm text-slate-600">{category.description}</p>

          {/* Sub-category pills */}
          <div className="flex flex-wrap gap-1.5">
            {category.subCategories.map(sub => (
              <Badge key={sub.id} variant="outline" className="text-xs" title={sub.description}>
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
  const moonBuildings = ORBITAL_BUILDINGS.filter(b => b.type === 'moon');
  const stationBuildings = ORBITAL_BUILDINGS.filter(b => b.type === 'station');
  const [activeTab, setActiveTab] = useState<StationsTab>("moon");
  const [buildingLevels, setBuildingLevels] = useState<Record<string, number>>({});
  const [infrastructureBuildCounts, setInfrastructureBuildCounts] = useState<Record<string, number>>({});
  const [deployedStrongholds, setDeployedStrongholds] = useState<Record<string, number>>({});
  const activeBuildingPool = activeTab === "moon" ? moonBuildings : stationBuildings;
  const totalFacilityLevels = Object.values(buildingLevels).reduce((sum, level) => sum + level, 0);
  const totalInfrastructureBuilt = Object.values(infrastructureBuildCounts).reduce((sum, count) => sum + count, 0);
  const totalStrongholds = Object.values(deployedStrongholds).reduce((sum, count) => sum + count, 0);
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
        habitability: 42 + Math.min(buildingLevels.lunarBase || 0, 18),
        population: totalFacilityLevels * 1500,
        level: Math.max(buildingLevels.lunarBase || 1, 1),
        integrity: 52 + Math.min(totalFacilityLevels, 40),
        stability: 48 + Math.min((buildingLevels.sensorPhalanx || 0) * 6 + (buildingLevels.jumpGate || 0) * 5, 42),
        storyAct: orbitalStoryAct,
      }),
    [buildingLevels, orbitalStoryAct, totalFacilityLevels],
  );
  const stationProfile = useMemo(
    () =>
      createHabitatConditionProfile({
        kind: "space-station",
        name: "Orbital Dock Grid",
        habitability: 56 + Math.min((buildingLevels.spaceStation || 0) * 7, 28),
        population: totalFacilityLevels * 2200,
        level: Math.max(buildingLevels.spaceStation || 1, 1),
        integrity: 58 + Math.min(totalFacilityLevels, 34),
        stability: 52 + Math.min((buildingLevels.fleetAcademy || 0) * 5 + (buildingLevels.allianceDepot || 0) * 4, 40),
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
        level: Math.max(buildingLevels.starbaseHub || 1, 1),
        integrity: 60 + Math.min(totalInfrastructureBuilt * 2 + (buildingLevels.starbaseHub || 0) * 5, 38),
        stability: 54 + Math.min(totalInfrastructureBuilt + totalFacilityLevels, 36),
        storyAct: orbitalStoryAct,
      }),
    [buildingLevels, orbitalStoryAct, totalFacilityLevels, totalInfrastructureBuilt],
  );

  const getBuildingRequirementLabel = (building: StationBuilding) => {
    if (building.type === "moon" && building.id !== "lunarBase" && (buildingLevels.lunarBase ?? 0) === 0) {
      return "Requires Lunar Base level 1 before this structure can be built.";
    }
    if (building.type === "station" && building.id !== "starbaseHub" && (buildingLevels.starbaseHub ?? 0) === 0) {
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

    const currentLevel = buildingLevels[building.id] ?? 0;
    const nextLevel = currentLevel + 1;
    const multiplier = Math.pow(building.costFactor, currentLevel);
    const cost = {
      metal: Math.round(building.baseCost.metal * multiplier),
      crystal: Math.round(building.baseCost.crystal * multiplier),
      deuterium: Math.round(building.baseCost.deuterium * multiplier),
    };

    setBuildingLevels((current) => ({ ...current, [building.id]: nextLevel }));
    toast({
      title: currentLevel === 0 ? "Construction queued" : "Upgrade queued",
      description: `${building.name} now targeting level ${nextLevel}. Cost ${cost.metal.toLocaleString()} metal, ${cost.crystal.toLocaleString()} crystal, ${cost.deuterium.toLocaleString()} deuterium.`,
    });
  };

  const getStationRequirementLabel = (station: OrbitalStation) => {
    if (station.attributes.requiresMoon && (buildingLevels.lunarBase ?? 0) === 0) {
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

    const nextCount = (infrastructureBuildCounts[station.id] ?? 0) + 1;
    setInfrastructureBuildCounts((current) => ({ ...current, [station.id]: nextCount }));
    toast({
      title: "Infrastructure deployed",
      description: `${station.title} online. Total deployed: ${nextCount}.`,
    });
  };

  const getStrongholdRequirementLabel = (program: typeof STRONGHOLD_PROGRAMS[number]) => {
    if ((buildingLevels.starbaseHub ?? 0) === 0) {
      return "Requires Starbase Command Hub level 1 before frontier stronghold deployment.";
    }
    if (program.tier !== "Frontier Tier I" && (buildingLevels.strongholdCommandNexus ?? 0) === 0) {
      return "Requires Stronghold Command Nexus level 1 for advanced keep and citadel control.";
    }
    if (program.status === "contested" && (buildingLevels.defenseGrid ?? 0) < 1) {
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
      if (tabParam === "moon" || tabParam === "station" || tabParam === "infrastructure") {
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
          <h1 className="text-4xl font-bold text-slate-900 flex items-center gap-3" data-testid="text-stations-title">
            <Satellite className="w-10 h-10 text-blue-500" />
            Orbital Stations
          </h1>
          <p className="text-slate-600 mt-2">Construct and manage moon bases and space stations with progression from Tiers 1-99 and Levels 1-999.</p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200">
            <CardContent className="p-4 text-center">
              <Moon className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-slate-900">{moonBuildings.length}</p>
              <p className="text-xs text-slate-700">Moon Facilities</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-4 text-center">
              <Satellite className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-900">{stationBuildings.length}</p>
              <p className="text-xs text-blue-700">Station Facilities</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-4 text-center">
              <Building2 className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-purple-900">{ORBITAL_STATION_STATS.totalStations}</p>
              <p className="text-xs text-purple-700">Infrastructure Stations</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-white border-slate-200">
            <CardContent className="pt-6">
              <div className="text-xs uppercase text-slate-500">Active Facility Pool</div>
              <div className="text-2xl font-bold text-slate-900">{activeBuildingPool.length}</div>
            </CardContent>
          </Card>
          <Card className="bg-white border-slate-200">
            <CardContent className="pt-6">
              <div className="text-xs uppercase text-slate-500">Average Cost Factor</div>
              <div className="text-2xl font-bold text-blue-700">x{averageCostFactor}</div>
            </CardContent>
          </Card>
          <Card className="bg-white border-slate-200">
            <CardContent className="pt-6">
              <div className="text-xs uppercase text-slate-500">Facility Levels</div>
              <div className="text-2xl font-bold text-purple-700">{totalFacilityLevels}</div>
            </CardContent>
          </Card>
          <Card className="bg-white border-slate-200">
            <CardContent className="pt-6">
              <div className="text-xs uppercase text-slate-500">Infrastructure Built</div>
              <div className="text-2xl font-bold text-rose-700">{totalInfrastructureBuilt}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-white border-slate-200">
            <CardContent className="pt-6">
              <div className="text-xs uppercase text-slate-500">Strongholds Online</div>
              <div className="text-2xl font-bold text-indigo-700">{totalStrongholds}</div>
            </CardContent>
          </Card>
          <Card className="bg-white border-slate-200">
            <CardContent className="pt-6">
              <div className="text-xs uppercase text-slate-500">Wormhole Anchors</div>
              <div className="text-2xl font-bold text-cyan-700">{buildingLevels.wormholeAnchor ?? 0}</div>
            </CardContent>
          </Card>
          <Card className="bg-white border-slate-200">
            <CardContent className="pt-6">
              <div className="text-xs uppercase text-slate-500">Command Nexus</div>
              <div className="text-2xl font-bold text-amber-700">{buildingLevels.strongholdCommandNexus ?? 0}</div>
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
          <TabsList className="bg-white border border-slate-200">
            <TabsTrigger value="moon" data-testid="tab-moon-buildings">
              <Moon className="w-4 h-4 mr-2" />
              Moon Facilities
            </TabsTrigger>
            <TabsTrigger value="station" data-testid="tab-station-buildings">
              <Satellite className="w-4 h-4 mr-2" />
              Station Facilities
            </TabsTrigger>
            <TabsTrigger value="infrastructure" data-testid="tab-infrastructure">
              <Layers className="w-4 h-4 mr-2" />
              Infrastructure
            </TabsTrigger>
          </TabsList>

          <TabsContent value="moon" className="mt-4">
            <div className="mb-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <h3 className="font-bold text-slate-700 mb-2 flex items-center gap-2">
                <Moon className="w-5 h-5" />
                Moon Facilities
              </h3>
              <p className="text-sm text-slate-600">
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
            <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-bold text-blue-700 mb-2 flex items-center gap-2">
                <Satellite className="w-5 h-5" />
                Space Station Facilities
              </h3>
              <p className="text-sm text-blue-600">
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

            <Card className="mt-6 bg-white border-slate-200">
              <CardHeader>
                <CardTitle>Stronghold Command Programs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {STRONGHOLD_PROGRAMS.map((program) => (
                    <Card key={program.id} className="border-slate-200 bg-slate-50">
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="font-semibold text-slate-900">{program.name}</div>
                            <div className="text-xs text-slate-500">{program.tier} · {program.orbit}</div>
                          </div>
                          <Badge className={program.status === "operational" ? "bg-green-100 text-green-900" : program.status === "contested" ? "bg-red-100 text-red-900" : "bg-blue-100 text-blue-900"}>
                            {program.status}
                          </Badge>
                        </div>

                        <p className="text-sm text-slate-600">{program.summary}</p>

                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div className="rounded border border-slate-200 bg-white p-2">Defense <span className="font-bold text-slate-900">{program.defense}</span></div>
                          <div className="rounded border border-slate-200 bg-white p-2">Logistics <span className="font-bold text-slate-900">{program.logistics}</span></div>
                          <div className="rounded border border-slate-200 bg-white p-2">Command <span className="font-bold text-slate-900">{program.command}</span></div>
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {program.facilities.map((facility) => (
                            <Badge key={facility} variant="outline">{facility}</Badge>
                          ))}
                        </div>

                        <div className="space-y-1 text-xs text-slate-500">
                          {program.upgradeTracks.map((track) => (
                            <div key={track.name}>
                              <span className="font-semibold text-slate-700">{track.name}:</span> {track.effect}
                            </div>
                          ))}
                        </div>

                        {getStrongholdRequirementLabel(program) && (
                          <div className="rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
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

          <TabsContent value="infrastructure" className="mt-4">
            <div className="mb-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h3 className="font-bold text-purple-700 mb-2 flex items-center gap-2">
                <Layers className="w-5 h-5" />
                Orbital Station Infrastructure
              </h3>
              <p className="text-sm text-purple-600">
                Manage the full spectrum of orbital station infrastructure across{" "}
                <strong>{ORBITAL_STATION_STATS.totalCategories} categories</strong> and{" "}
                <strong>{ORBITAL_STATION_STATS.totalSubCategories} sub-categories</strong>.
                Each station supports Tiers 1–{ORBITAL_STATION_STATS.maxTier} and Levels 1–{ORBITAL_STATION_STATS.maxLevel},
                with rich metadata including class, sub-class, type, sub-type, rank, title, stats, attributes, and subjects.
              </p>
            </div>

            {/* Progress overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              <Card className="bg-white border-slate-200">
                <CardContent className="p-3 text-center">
                  <p className="text-xl font-bold text-slate-900">{ORBITAL_STATION_STATS.totalStations}</p>
                  <p className="text-xs text-slate-500">Total Stations</p>
                </CardContent>
              </Card>
              <Card className="bg-white border-slate-200">
                <CardContent className="p-3 text-center">
                  <p className="text-xl font-bold text-blue-700">{ORBITAL_STATION_STATS.maxTier}</p>
                  <p className="text-xs text-slate-500">Max Tier</p>
                </CardContent>
              </Card>
              <Card className="bg-white border-slate-200">
                <CardContent className="p-3 text-center">
                  <p className="text-xl font-bold text-purple-700">{ORBITAL_STATION_STATS.maxLevel}</p>
                  <p className="text-xs text-slate-500">Max Level</p>
                </CardContent>
              </Card>
              <Card className="bg-white border-slate-200">
                <CardContent className="p-3 text-center">
                  <p className="text-xl font-bold text-rose-700">7</p>
                  <p className="text-xs text-slate-500">Station Classes</p>
                </CardContent>
              </Card>
            </div>

            <Card className="mb-6 bg-indigo-50 border-indigo-200">
              <CardHeader>
                <CardTitle className="text-indigo-900">Frontier Stronghold Logic</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-indigo-900">
                <div className="rounded border border-indigo-200 bg-white/80 p-3">Strongholds act as frontier command nodes for siege timers, route control, and fleet tethering.</div>
                <div className="rounded border border-indigo-200 bg-white/80 p-3">Wormhole Anchor Arrays and Stronghold Command Nexus upgrades unlock deeper keep and citadel programs.</div>
                <div className="rounded border border-indigo-200 bg-white/80 p-3">Infrastructure, raids, and research now share the same bastion progression instead of living in separate systems.</div>
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

        <Card className="bg-slate-50 border-slate-200">
          <CardHeader>
            <CardTitle>Orbital Construction Tips</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-700 space-y-2">
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

        <Card className="bg-white border-slate-200">
          <CardHeader>
            <CardTitle>Orbital Build Doctrine</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-slate-600">
            <div className="rounded border border-slate-200 bg-slate-50 p-3">
              <div className="font-semibold text-slate-900">Moon Priority</div>
              <div>Secure intelligence and mobility first through phalanx and gate infrastructure.</div>
            </div>
            <div className="rounded border border-slate-200 bg-slate-50 p-3">
              <div className="font-semibold text-slate-900">Station Priority</div>
              <div>Scale logistics and ship support before pushing expensive combat modules.</div>
            </div>
            <div className="rounded border border-slate-200 bg-slate-50 p-3">
              <div className="font-semibold text-slate-900">Cost Control</div>
              <div>Stagger upgrades across structures to flatten cost-factor spikes.</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </GameLayout>
  );
}
