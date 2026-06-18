import GameLayout from "@/components/layout/GameLayout";
import { useGame } from "@/lib/gameContext";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Factory, FlaskConical, Rocket, Shield, ArrowUpCircle, Box, Gem, Hammer, Clock, 
  Satellite, Moon, Globe, TrendingUp, Lock, Info, Zap, BarChart3, ChevronRight, Cpu, Network, Search
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ORBITAL_BUILDINGS, StationBuilding } from "@/lib/stationData";
import { INFRASTRUCTURE_EXPANSION_SYSTEMS, TECHNOLOGY_RESEARCH_SYSTEMS, getExpansionSystemUpgradeSnapshot, type ExpansionSystem, type ExpansionSystemRequirements } from "@/lib/facilityExpansionCatalog";
import {
  CORE_FACILITY_CATEGORIES,
  FACILITY_OPERATIONS_COUNTS,
  INFRASTRUCTURE_CATEGORY_SPLIT,
  TECHNOLOGY_CATEGORY_SPLIT,
  getCoreFacilitySelections,
  getInfrastructureSelections,
  getTechnologySelections,
  type FacilityCategory,
  type FacilityOperationsDomain,
  type FacilitySelection,
} from "@/lib/facilityOperationsCatalog";
import { MENU_ASSETS } from "@shared/config";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

const TEMP_THEME_IMAGE = "/theme-temp.png";

const FACILITY_IMAGE_MAP: Record<string, string> = {
  roboticsFactory:       MENU_ASSETS.BUILDINGS.ROBOTICS_FACTORY.path,
  shipyard:              MENU_ASSETS.BUILDINGS.SHIPYARD.path,
  researchLab:           MENU_ASSETS.BUILDINGS.RESEARCH_LAB.path,
  naniteFactory:         MENU_ASSETS.BUILDINGS.ROBOTICS_FACTORY.path,
  terraformer:           MENU_ASSETS.BUILDINGS.SPACEPORT.path,
  spaceStation:          MENU_ASSETS.BUILDINGS.SPACEPORT.path,
  allianceDepot:         MENU_ASSETS.BUILDINGS.TRADE_STATION.path,
  missileSilo:           MENU_ASSETS.BUILDINGS.DEFENSE_TURRET.path,
  metalMine:             "/assets/buildings/metal_mine.png",
  crystalMine:           "/assets/buildings/crystal_mine.png",
  deuteriumSynthesizer:  "/assets/buildings/deuterium.png",
  solarPlant:            "/assets/buildings/power_plant.png",
  commandCenter:         "/assets/buildings/command_center.png",
  missileBattery:        "/assets/buildings/missile_battery.png",
  defenseCannon:         "/assets/buildings/defense_cannon.png",
};

type FacilityBase = "planet" | "moon" | "station";

const BUILDING_REQUIREMENT_LABELS: Record<string, string> = {
  metalMine: "Metal Mine",
  crystalMine: "Crystal Mine",
  deuteriumSynthesizer: "Deuterium Synthesizer",
  solarPlant: "Solar Plant",
  roboticsFactory: "Robotics Factory",
  shipyard: "Shipyard",
  researchLab: "Research Lab",
};

const RESEARCH_REQUIREMENT_LABELS: Record<string, string> = {
  energyTech: "Energy Tech",
  laserTech: "Laser Tech",
  ionTech: "Ion Tech",
  hyperspaceTech: "Hyperspace Tech",
  plasmaTech: "Plasma Tech",
  combustionDrive: "Combustion Drive",
  impulseDrive: "Impulse Drive",
  hyperspaceDrive: "Hyperspace Drive",
  espionageTech: "Espionage Tech",
  computerTech: "Computer Tech",
  astrophysics: "Astrophysics",
  gravitonTech: "Graviton Tech",
  weaponsTech: "Weapons Tech",
  shieldingTech: "Shielding Tech",
  armourTech: "Armour Tech",
  aiTech: "AI Tech",
  quantumTech: "Quantum Tech",
};

const EXPANSION_ICON_MAP = {
  factory: Factory,
  flask: FlaskConical,
  rocket: Rocket,
  shield: Shield,
  satellite: Satellite,
  globe: Globe,
  zap: Zap,
  "bar-chart": BarChart3,
  cpu: Cpu,
  network: Network,
  search: Search,
  database: Box,
  hammer: Hammer,
} as const;

function formatExpansionRequirements(requirements?: ExpansionSystemRequirements): string {
  if (!requirements) {
    return "Available by default";
  }

  const parts: string[] = [];

  if (requirements.buildings) {
    for (const [building, level] of Object.entries(requirements.buildings)) {
      parts.push(`${BUILDING_REQUIREMENT_LABELS[building] || building} ${level}`);
    }
  }

  if (requirements.research) {
    for (const [tech, level] of Object.entries(requirements.research)) {
      parts.push(`${RESEARCH_REQUIREMENT_LABELS[tech] || tech} ${level}`);
    }
  }

  if (requirements.totalInfrastructure) {
    parts.push(`Total Infrastructure ${requirements.totalInfrastructure}`);
  }

  return parts.length > 0 ? parts.join(" • ") : "Available by default";
}

function expansionRequirementsMet(
  requirements: ExpansionSystemRequirements | undefined,
  buildings: Record<string, number>,
  research: Record<string, number>,
  totalInfrastructure: number,
): boolean {
  if (!requirements) {
    return true;
  }

  if (requirements.buildings) {
    for (const [building, level] of Object.entries(requirements.buildings)) {
      if ((buildings[building] || 0) < level) {
        return false;
      }
    }
  }

  if (requirements.research) {
    for (const [tech, level] of Object.entries(requirements.research)) {
      if ((research[tech] || 0) < level) {
        return false;
      }
    }
  }

  if (requirements.totalInfrastructure && totalInfrastructure < requirements.totalInfrastructure) {
    return false;
  }

  return true;
}

function getOrbitalRequirementLabel(building: StationBuilding, orbitalBuildings: Record<string, number>): string | null {
  if (building.type === "moon" && building.id !== "lunarBase" && (orbitalBuildings.lunarBase || 0) < 1) {
    return "Requires Lunar Base level 1";
  }

  if (building.type === "station" && building.id !== "starbaseHub" && (orbitalBuildings.starbaseHub || 0) < 1) {
    return "Requires Starbase Command Hub level 1";
  }

  return null;
}

function getOrbitalFacilityEffect(building: StationBuilding, level: number) {
  switch (building.id) {
    case "lunarBase":
      return {
        effect: level > 0 ? `Supports ${level * 3} lunar construction fields and +${level * 5}% moon stability.` : "Establish your first lunar foothold.",
        nextEffect: `Supports ${(level + 1) * 3} lunar construction fields and +${(level + 1) * 5}% moon stability.`,
      };
    case "sensorPhalanx":
      return {
        effect: level > 0 ? `Extends fleet scan coverage by ${level * 2} systems.` : "No fleet scan coverage yet.",
        nextEffect: `Extends fleet scan coverage by ${(level + 1) * 2} systems.`,
      };
    case "jumpGate":
      return {
        effect: level > 0 ? `Enables ${level} concurrent jump corridors between owned moons.` : "Jump transfer network offline.",
        nextEffect: `Enables ${level + 1} concurrent jump corridors between owned moons.`,
      };
    case "starbaseHub":
      return {
        effect: level > 0 ? `Adds +${level * 8}% station command integrity and unlocks orbital modules.` : "Orbital command shell not yet established.",
        nextEffect: `Adds +${(level + 1) * 8}% station command integrity and unlocks orbital modules.`,
      };
    case "orbitalShipyard":
      return {
        effect: level > 0 ? `Improves orbital ship construction speed by ${level * 6}%.` : "Zero-G hull assembly offline.",
        nextEffect: `Improves orbital ship construction speed by ${(level + 1) * 6}%.`,
      };
    case "tradeDock":
      return {
        effect: level > 0 ? `Boosts orbital trade throughput by ${level * 7}%.` : "No large-scale docking bonuses active.",
        nextEffect: `Boosts orbital trade throughput by ${(level + 1) * 7}%.`,
      };
    case "defenseGrid":
      return {
        effect: level > 0 ? `Raises orbital defense coverage by ${level * 9}%.` : "Automated orbital defenses inactive.",
        nextEffect: `Raises orbital defense coverage by ${(level + 1) * 9}%.`,
      };
    default:
      return {
        effect: level > 0 ? `Level ${level} active` : "Not built",
        nextEffect: `Level ${level + 1} active`,
      };
  }
}

const FacilityCard = ({ 
  id, 
  name, 
  level, 
  description, 
  icon: Icon, 
  onUpgrade, 
  resources,
  customCost,
  effect,
  nextEffect,
  requirement,
  requirementMet,
  iconColor,
  imagePath,
}: any) => {
  const baseMetal = customCost ? customCost.metal : 200;
  const baseCrystal = customCost ? customCost.crystal : 100;
  const baseDeut = customCost ? customCost.deuterium : 0;
  
  const metalCost = Math.floor(baseMetal * Math.pow(2, level));
  const crystalCost = Math.floor(baseCrystal * Math.pow(2, level));
  const deuteriumCost = Math.floor(baseDeut * Math.pow(2, level));
  
  const buildTime = (level + 1) * 20;

  const canAfford = resources.metal >= metalCost && resources.crystal >= crystalCost && resources.deuterium >= deuteriumCost;
  const canBuild = canAfford && (requirementMet !== false);

  return (
    <Card className={cn("bg-white border-slate-200 hover:border-primary/50 transition-all group overflow-hidden shadow-sm flex flex-col h-full", !requirementMet && requirementMet !== undefined && "opacity-60")} data-testid={`card-facility-${id}`}>
       <div className={cn("h-36 bg-gradient-to-br from-slate-50 to-slate-100 relative group-hover:from-slate-100 group-hover:to-slate-200 transition-colors duration-500 border-b border-slate-200")}>
          {imagePath ? (
            <>
              <img
                src={imagePath}
                alt={name}
                className="absolute inset-0 w-full h-full object-contain opacity-20 pointer-events-none"
                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = TEMP_THEME_IMAGE; }}
              />
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <img
                  src={imagePath}
                  alt={name}
                  className="w-16 h-16 object-contain drop-shadow transition-transform group-hover:scale-110"
                  onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = TEMP_THEME_IMAGE; }}
                />
              </div>
            </>
          ) : (
            <>
              <div className="absolute inset-0 flex items-center justify-center">
                <Icon className={cn("w-20 h-20 opacity-20", iconColor || "text-slate-400")} />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Icon className={cn("w-16 h-16 transition-transform group-hover:scale-110", iconColor || "text-slate-500")} />
              </div>
            </>
          )}
          <div className="absolute bottom-2 right-2 bg-white px-3 py-1.5 rounded text-sm font-orbitron text-primary border border-slate-200 shadow-sm">
            Level {level}
          </div>
          {requirement && !requirementMet && (
            <div className="absolute top-2 left-2">
              <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200 text-xs">
                <Lock className="w-3 h-3 mr-1" /> Locked
              </Badge>
            </div>
          )}
       </div>
       
       <CardHeader className="pb-2">
         <CardTitle className="text-lg font-orbitron text-slate-900 group-hover:text-primary transition-colors">{name}</CardTitle>
       </CardHeader>
       
       <CardContent className="pb-2 flex-1 space-y-3">
         <p className="text-sm text-muted-foreground">{description}</p>
         
         {effect && (
           <div className="bg-slate-50 p-3 rounded border border-slate-100">
             <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-1">
               <BarChart3 className="w-3 h-3" /> Current Effect
             </div>
             <div className="text-sm font-medium text-slate-900">{effect}</div>
             {nextEffect && level > 0 && (
               <div className="mt-2 pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                 <span className="text-green-600 flex items-center gap-1">
                   <TrendingUp className="w-3 h-3" /> Next Level
                 </span>
                 <span className="font-medium text-green-700">{nextEffect}</span>
               </div>
             )}
           </div>
         )}
         
         {requirement && !requirementMet && (
           <div className="bg-red-50 p-3 rounded border border-red-200 text-xs text-red-700">
             <div className="font-bold mb-1 flex items-center gap-1">
               <Lock className="w-3 h-3" /> Requirement Not Met
             </div>
             {requirement}
           </div>
         )}
         
         <Separator />
         
         <div className="space-y-1">
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Upgrade Costs</div>
            {metalCost > 0 && (
              <div className="flex items-center justify-between text-sm">
                 <span className="flex items-center gap-2 text-slate-600"><Box className="w-3 h-3" /> Metal</span>
                 <span className={cn("font-mono", resources.metal < metalCost ? "text-red-600 font-bold" : "text-slate-900")}>{metalCost.toLocaleString()}</span>
              </div>
            )}
            {crystalCost > 0 && (
              <div className="flex items-center justify-between text-sm">
                 <span className="flex items-center gap-2 text-blue-600"><Gem className="w-3 h-3" /> Crystal</span>
                 <span className={cn("font-mono", resources.crystal < crystalCost ? "text-red-600 font-bold" : "text-slate-900")}>{crystalCost.toLocaleString()}</span>
              </div>
            )}
            {deuteriumCost > 0 && (
              <div className="flex items-center justify-between text-sm">
                 <span className="flex items-center gap-2 text-green-600"><FlaskConical className="w-3 h-3" /> Deuterium</span>
                 <span className={cn("font-mono", resources.deuterium < deuteriumCost ? "text-red-600 font-bold" : "text-slate-900")}>{deuteriumCost.toLocaleString()}</span>
              </div>
            )}
            <div className="flex items-center justify-between text-sm">
               <span className="flex items-center gap-2 text-slate-500"><Clock className="w-3 h-3" /> Build Time</span>
               <span className="text-slate-900 font-mono">{buildTime}s</span>
            </div>
         </div>
       </CardContent>
       
       <CardFooter>
         <Button 
            className="w-full bg-primary text-white hover:bg-primary/90 font-orbitron tracking-wider"
            disabled={!canBuild}
            onClick={() => onUpgrade(id, name, buildTime * 1000)}
            data-testid={`button-upgrade-${id}`}
         >
           {!requirementMet && requirementMet !== undefined ? (
             <><Lock className="w-4 h-4 mr-2" /> REQUIREMENTS NOT MET</>
           ) : canAfford ? (
             <>
               <ArrowUpCircle className="w-4 h-4 mr-2" /> UPGRADE TO LEVEL {level + 1}
             </>
           ) : (
             "INSUFFICIENT RESOURCES"
           )}
         </Button>
       </CardFooter>
    </Card>
  );
};

const ExpansionSystemCard = ({
  system,
  unlocked,
  level,
  canAfford,
  maxed,
  onUpgrade,
}: {
  system: ExpansionSystem;
  unlocked: boolean;
  level: number;
  canAfford: boolean;
  maxed: boolean;
  onUpgrade: () => void;
}) => {
  const Icon = EXPANSION_ICON_MAP[system.icon as keyof typeof EXPANSION_ICON_MAP] || Factory;
  const snapshot = getExpansionSystemUpgradeSnapshot(system, level);
  const tierTone =
    system.tier === "apex"
      ? "border-amber-200 bg-amber-50 text-amber-700"
      : system.tier === "elite"
        ? "border-violet-200 bg-violet-50 text-violet-700"
        : system.tier === "advanced"
          ? "border-blue-200 bg-blue-50 text-blue-700"
          : "border-slate-200 bg-slate-50 text-slate-700";

  return (
    <Card className={cn("shadow-sm border-slate-200", unlocked ? "bg-white" : "bg-slate-50/70 opacity-80")} data-testid={`card-expansion-${system.id}`}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={cn("flex h-11 w-11 items-center justify-center rounded-full border", unlocked ? "border-primary/20 bg-primary/10" : "border-slate-200 bg-white")}>
              <Icon className={cn("h-5 w-5", unlocked ? "text-primary" : "text-slate-500")} />
            </div>
            <div>
              <CardTitle className="text-base font-orbitron text-slate-900">{system.name}</CardTitle>
              <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{system.cluster} • Level {level}</div>
            </div>
          </div>
          <Badge variant="outline" className={tierTone}>
            {system.tier.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">{system.description}</p>
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
          <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">System Effect</div>
          <div className="text-sm font-medium text-slate-900">{system.effect}</div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Current Bonus</div>
            <div className={cn("mt-1 text-lg font-bold", snapshot.isNegative ? "text-rose-700" : "text-emerald-700")}>
              {snapshot.isNegative ? "-" : "+"}
              {snapshot.currentBonus}
              {snapshot.unit}
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Next Level</div>
            <div className={cn("mt-1 text-lg font-bold", snapshot.isNegative ? "text-rose-700" : "text-blue-700")}>
              {snapshot.isNegative ? "-" : "+"}
              {snapshot.nextBonus}
              {snapshot.unit}
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
          <div className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">Upgrade Costs</div>
          <div className="space-y-1 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Metal</span>
              <span>{snapshot.cost.metal.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Crystal</span>
              <span>{snapshot.cost.crystal.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Deuterium</span>
              <span>{snapshot.cost.deuterium.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between pt-1 text-xs text-muted-foreground">
              <span>Upgrade Time</span>
              <span>{snapshot.buildTimeSeconds}s</span>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-dashed border-slate-200 bg-white p-3">
          <div className="flex items-center justify-between gap-3 text-xs uppercase tracking-widest text-muted-foreground mb-1">
            <span>Unlock Requirements</span>
            <span className={cn("font-bold tracking-[0.18em]", unlocked ? "text-green-600" : "text-amber-600")}>
              {unlocked ? "READY" : "LOCKED"}
            </span>
          </div>
          <div className="text-sm text-slate-700">{formatExpansionRequirements(system.requirements)}</div>
        </div>
        <Button className="w-full font-orbitron tracking-wider" disabled={!unlocked || !canAfford || maxed} onClick={onUpgrade}>
          {maxed ? "MAX LEVEL" : !unlocked ? "REQUIREMENTS NOT MET" : canAfford ? `UPGRADE TO LEVEL ${level + 1}` : "INSUFFICIENT RESOURCES"}
        </Button>
      </CardContent>
    </Card>
  );
};

function SelectionCard({ selection }: { selection: FacilitySelection }) {
  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-orbitron text-slate-900">{selection.title}</CardTitle>
        <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{selection.subtitle}</div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-slate-600">{selection.description}</p>
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
          <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Doctrine</div>
          <div className="text-sm font-medium text-slate-900">{selection.doctrine}</div>
        </div>
        <div className="text-xs uppercase tracking-[0.18em] text-slate-500">{selection.emphasis}</div>
      </CardContent>
    </Card>
  );
}

function CategoryTabs({
  categories,
  title,
  description,
  renderCategory,
}: {
  categories: FacilityCategory[];
  title: string;
  description: string;
  renderCategory: (category: FacilityCategory) => ReactNode;
}) {
  return (
    <div className="space-y-4">
      <Card className="border-slate-200 bg-slate-50 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">{title}</CardTitle>
          <p className="text-sm text-muted-foreground">{description}</p>
        </CardHeader>
      </Card>
      <Tabs defaultValue={categories[0]?.id || ""} className="w-full">
        <TabsList className="flex h-auto w-full flex-wrap justify-start gap-2 border border-slate-200 bg-white p-2">
          {categories.map((category) => (
            <TabsTrigger key={category.id} value={category.id} className="data-[state=active]:bg-slate-50">
              {category.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {categories.map((category) => (
          <TabsContent key={category.id} value={category.id} className="mt-6 space-y-4">
            <Card className="border-slate-200 bg-white shadow-sm">
              <CardContent className="p-4">
                <div className="text-xs uppercase tracking-[0.18em] text-slate-500">{category.label}</div>
                <div className="mt-1 text-sm text-slate-600">{category.summary}</div>
              </CardContent>
            </Card>
            {renderCategory(category)}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

function renderSelectionGrid(selections: FacilitySelection[]) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {selections.map((selection) => (
        <SelectionCard key={selection.id} selection={selection} />
      ))}
    </div>
  );
}

export default function Facilities() {
  const {
    buildings,
    orbitalBuildings,
    resources,
    updateBuilding,
    queue,
    activeBase,
    setActiveBase,
    research,
    infrastructureSystems: infrastructureSystemsState,
    technologySystems: technologySystemsState,
    upgradeInfrastructureSystem,
    upgradeTechnologySystem,
  } = useGame();

  useEffect(() => {
    const syncFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      const baseParam = params.get("tab") || params.get("base");
      if (baseParam === "planet" || baseParam === "moon" || baseParam === "station") {
        setActiveBase(baseParam as FacilityBase);
      }
    };

    syncFromUrl();
    window.addEventListener("popstate", syncFromUrl);
    return () => window.removeEventListener("popstate", syncFromUrl);
  }, [setActiveBase]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set("tab", activeBase);
    params.delete("base");

    const nextUrl = `/facilities?${params.toString()}`;
    const currentUrl = `${window.location.pathname}${window.location.search}`;

    if (currentUrl !== nextUrl) {
      window.history.replaceState(null, "", nextUrl);
    }
  }, [activeBase]);
  
  const buildQueue = queue.filter(q => q.type === "building");

  const moonBuildings = ORBITAL_BUILDINGS.filter(b => b.type === "moon");
  const stationBuildings = ORBITAL_BUILDINGS.filter(b => b.type === "station");

  const getFacilityEffect = (id: string, level: number) => {
    switch (id) {
      case "roboticsFactory":
        return {
          effect: level > 0 ? `-${(level * 10)}% construction time` : "No bonus yet",
          nextEffect: `-${((level + 1) * 10)}% construction time`
        };
      case "shipyard":
        return {
          effect: level > 0 ? `Can build ships up to tier ${Math.min(level, 5)}` : "No ships available",
          nextEffect: `Can build ships up to tier ${Math.min(level + 1, 5)}`
        };
      case "researchLab":
        return {
          effect: level > 0 ? `-${(level * 5)}% research time` : "Research unavailable",
          nextEffect: `-${((level + 1) * 5)}% research time`
        };
      default:
        return { effect: null, nextEffect: null };
    }
  };

  const totalBuildingsLevel = Object.values(buildings).reduce((a, b) => a + b, 0);
  const totalOrbitalLevel = Object.values(orbitalBuildings).reduce((a, b) => a + b, 0);
  const infrastructureSystems = INFRASTRUCTURE_EXPANSION_SYSTEMS.map((system) => {
    const level = infrastructureSystemsState[system.id] || 0;
    const snapshot = getExpansionSystemUpgradeSnapshot(system, level);
    return {
      ...system,
      level,
      snapshot,
      canAfford:
        resources.metal >= snapshot.cost.metal &&
        resources.crystal >= snapshot.cost.crystal &&
        resources.deuterium >= snapshot.cost.deuterium,
      maxed: level >= snapshot.maxLevel,
      unlocked: expansionRequirementsMet(
        system.requirements,
        buildings as unknown as Record<string, number>,
        research as Record<string, number>,
        totalBuildingsLevel + totalOrbitalLevel,
      ),
    };
  });
  const technologySystems = TECHNOLOGY_RESEARCH_SYSTEMS.map((system) => {
    const level = technologySystemsState[system.id] || 0;
    const snapshot = getExpansionSystemUpgradeSnapshot(system, level);
    return {
      ...system,
      level,
      snapshot,
      canAfford:
        resources.metal >= snapshot.cost.metal &&
        resources.crystal >= snapshot.cost.crystal &&
        resources.deuterium >= snapshot.cost.deuterium,
      maxed: level >= snapshot.maxLevel,
      unlocked: expansionRequirementsMet(
        system.requirements,
        buildings as unknown as Record<string, number>,
        research as Record<string, number>,
        totalBuildingsLevel + totalOrbitalLevel,
      ),
    };
  });
  const unlockedInfrastructureSystems = infrastructureSystems.filter((system) => system.unlocked).length;
  const unlockedTechnologySystems = technologySystems.filter((system) => system.unlocked).length;
  const infrastructureClusters = new Set(infrastructureSystems.map((system) => system.cluster)).size;
  const technologyClusters = new Set(technologySystems.map((system) => system.cluster)).size;
  const moonCoreLevel = moonBuildings.reduce((acc, building) => acc + (orbitalBuildings[building.id] || 0), 0);
  const stationCoreLevel = stationBuildings.reduce((acc, building) => acc + (orbitalBuildings[building.id] || 0), 0);
  const planetCoreSelections = getCoreFacilitySelections("planet");
  const moonCoreSelections = getCoreFacilitySelections("moon");
  const stationCoreSelections = getCoreFacilitySelections("station");
  const planetInfrastructureSelections = getInfrastructureSelections("planet", infrastructureSystems);
  const moonInfrastructureSelections = getInfrastructureSelections("moon", infrastructureSystems);
  const stationInfrastructureSelections = getInfrastructureSelections("station", infrastructureSystems);
  const planetTechnologySelections = getTechnologySelections("planet", technologySystems);
  const moonTechnologySelections = getTechnologySelections("moon", technologySystems);
  const stationTechnologySelections = getTechnologySelections("station", technologySystems);

  return (
    <GameLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="relative rounded-xl overflow-hidden shadow-lg mb-2" style={{ minHeight: 140 }}>
          <img src="/assets/backgrounds/planet_surface.png" alt="Infrastructure" className="absolute inset-0 w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display='none'; }} />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-amber-950/60 to-transparent" />
          <div className="relative z-10 p-6 flex items-center gap-6">
            <img src="/assets/buildings/command_center.png" alt="Command Center" className="w-20 h-20 rounded-xl object-cover ring-2 ring-amber-400/60 shadow-lg" onError={(e) => { e.currentTarget.style.display='none'; }} />
            <div>
              <h2 className="text-3xl font-orbitron font-bold text-white drop-shadow">Infrastructure</h2>
              <p className="text-amber-300 font-rajdhani text-lg">Manage surface facilities, lunar bases, and orbital stations.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200" data-testid="card-stats-surface">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center overflow-hidden">
                  <img src={MENU_ASSETS.BUILDINGS.ROBOTICS_FACTORY.path} alt="surface" className="w-7 h-7 object-contain" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = TEMP_THEME_IMAGE; }} />
                </div>
                <div>
                  <div className="text-xs text-blue-600 uppercase">Surface Level</div>
                  <div className="text-xl font-orbitron font-bold text-blue-900">{buildings.roboticsFactory + buildings.shipyard + buildings.researchLab}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200" data-testid="card-stats-moon">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-500/10 flex items-center justify-center overflow-hidden">
                  <img src={MENU_ASSETS.BUILDINGS.SPACEPORT.path} alt="moon" className="w-7 h-7 object-contain" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = TEMP_THEME_IMAGE; }} />
                </div>
                <div>
                  <div className="text-xs text-slate-600 uppercase">Lunar Level</div>
                  <div className="text-xl font-orbitron font-bold text-slate-900">
                    {moonBuildings.reduce((acc, b) => acc + (orbitalBuildings[b.id] || 0), 0)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200" data-testid="card-stats-orbital">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center overflow-hidden">
                  <img src={MENU_ASSETS.BUILDINGS.SHIPYARD.path} alt="orbital" className="w-7 h-7 object-contain" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = TEMP_THEME_IMAGE; }} />
                </div>
                <div>
                  <div className="text-xs text-purple-600 uppercase">Orbital Level</div>
                  <div className="text-xl font-orbitron font-bold text-purple-900">
                    {stationBuildings.reduce((acc, b) => acc + (orbitalBuildings[b.id] || 0), 0)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200" data-testid="card-stats-total">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center overflow-hidden">
                  <img src={MENU_ASSETS.BUILDINGS.RESEARCH_LAB.path} alt="infrastructure" className="w-7 h-7 object-contain" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = TEMP_THEME_IMAGE; }} />
                </div>
                <div>
                  <div className="text-xs text-green-600 uppercase">Total Infrastructure</div>
                  <div className="text-xl font-orbitron font-bold text-green-900">{totalBuildingsLevel + totalOrbitalLevel}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {buildQueue.length > 0 && (
          <Card className="bg-white border-primary/20 shadow-sm" data-testid="card-construction-queue">
             <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                   <Hammer className="w-4 h-4" /> Construction Queue
                </CardTitle>
             </CardHeader>
             <CardContent>
                <div className="space-y-2">
                   {buildQueue.map((item, i) => {
                      const timeLeft = Math.max(0, Math.floor((item.endTime - Date.now()) / 1000));
                      const totalTime = 20;
                      return (
                         <div key={i} className="flex items-center gap-4 bg-slate-50 p-3 rounded border border-slate-100">
                            <div className="w-10 h-10 flex items-center justify-center bg-white rounded border border-slate-200">
                               <Hammer className="w-5 h-5 text-primary" />
                            </div>
                            <div className="flex-1">
                               <div className="flex justify-between text-sm font-medium text-slate-900 mb-1">
                                  <span>{item.name}</span>
                                  <span className="font-mono text-primary">{timeLeft}s remaining</span>
                               </div>
                               <Progress value={Math.max(0, 100 - (timeLeft / totalTime) * 100)} className="h-2" />
                            </div>
                         </div>
                      )
                   })}
                </div>
             </CardContent>
          </Card>
        )}

        <Tabs value={activeBase} className="w-full" onValueChange={(v) => setActiveBase(v as FacilityBase)}>
          <TabsList className="bg-white border border-slate-200 h-14 w-full justify-start p-1 gap-2">
            <TabsTrigger value="planet" className="font-orbitron h-12 px-6 data-[state=active]:bg-slate-100 data-[state=active]:border-primary border-2 border-transparent" data-testid="tab-planet">
               <Globe className="w-5 h-5 mr-2 text-blue-500" /> Surface Command
            </TabsTrigger>
            <TabsTrigger value="moon" className="font-orbitron h-12 px-6 data-[state=active]:bg-slate-100 data-[state=active]:border-primary border-2 border-transparent" data-testid="tab-moon">
               <Moon className="w-5 h-5 mr-2 text-slate-400" /> Lunar Base
            </TabsTrigger>
            <TabsTrigger value="station" className="font-orbitron h-12 px-6 data-[state=active]:bg-slate-100 data-[state=active]:border-primary border-2 border-transparent" data-testid="tab-station">
               <Satellite className="w-5 h-5 mr-2 text-purple-500" /> Orbital Station
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
             <TabsContent value="planet" className="mt-0">
                <Tabs defaultValue="core" className="w-full">
                  <TabsList className="mb-6 h-auto w-full flex-wrap justify-start gap-2 border border-slate-200 bg-white p-2">
                    <TabsTrigger value="core" className="font-orbitron data-[state=active]:bg-slate-100">
                      Core Facilities {FACILITY_OPERATIONS_COUNTS.coreSelections}
                    </TabsTrigger>
                    <TabsTrigger value="infrastructure-matrix" className="font-orbitron data-[state=active]:bg-slate-100">
                      Infrastructure Matrix {FACILITY_OPERATIONS_COUNTS.infrastructureSelections}
                    </TabsTrigger>
                    <TabsTrigger value="technology-systems" className="font-orbitron data-[state=active]:bg-slate-100">
                      Tech Systems {FACILITY_OPERATIONS_COUNTS.technologySelections}
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="core" className="mt-0 space-y-6">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                      <Card className="border-slate-200 bg-white shadow-sm"><CardContent className="pt-6"><div className="text-xs uppercase tracking-widest text-muted-foreground">Categories</div><div className="mt-1 text-2xl font-orbitron font-bold text-slate-900">{FACILITY_OPERATIONS_COUNTS.coreCategories}</div></CardContent></Card>
                      <Card className="border-slate-200 bg-white shadow-sm"><CardContent className="pt-6"><div className="text-xs uppercase tracking-widest text-muted-foreground">Selections</div><div className="mt-1 text-2xl font-orbitron font-bold text-blue-700">{FACILITY_OPERATIONS_COUNTS.coreSelections}</div></CardContent></Card>
                      <Card className="border-slate-200 bg-white shadow-sm"><CardContent className="pt-6"><div className="text-xs uppercase tracking-widest text-muted-foreground">Core Facilities</div><div className="mt-1 text-2xl font-orbitron font-bold text-slate-900">3</div></CardContent></Card>
                      <Card className="border-slate-200 bg-white shadow-sm"><CardContent className="pt-6"><div className="text-xs uppercase tracking-widest text-muted-foreground">Command Layer</div><div className="mt-1 text-2xl font-orbitron font-bold text-emerald-700">Planet</div></CardContent></Card>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                       <FacilityCard id="roboticsFactory" name="Robotics Factory" level={buildings.roboticsFactory} description="Robotics factories provide automated construction units. Each level reduces all building construction times by 10%." icon={Factory} iconColor="text-orange-500" imagePath={FACILITY_IMAGE_MAP["roboticsFactory"]} resources={resources} onUpgrade={updateBuilding} {...getFacilityEffect("roboticsFactory", buildings.roboticsFactory)} requirementMet={true} />
                       <FacilityCard id="shipyard" name="Shipyard" level={buildings.shipyard} description="The Shipyard constructs your fleet and defense systems. Higher levels unlock advanced ship classes and reduce build times." icon={Rocket} iconColor="text-blue-500" imagePath={FACILITY_IMAGE_MAP["shipyard"]} resources={resources} onUpgrade={updateBuilding} {...getFacilityEffect("shipyard", buildings.shipyard)} requirement={buildings.roboticsFactory < 2 ? "Requires Robotics Factory Lvl 2" : null} requirementMet={buildings.roboticsFactory >= 2} />
                       <FacilityCard id="researchLab" name="Research Lab" level={buildings.researchLab} description="The Research Lab is essential for technological advancement. Higher levels reduce research time and unlock advanced technologies." icon={FlaskConical} iconColor="text-green-500" imagePath={FACILITY_IMAGE_MAP["researchLab"]} resources={resources} onUpgrade={updateBuilding} {...getFacilityEffect("researchLab", buildings.researchLab)} requirement={buildings.roboticsFactory < 1 ? "Requires Robotics Factory Lvl 1" : null} requirementMet={buildings.roboticsFactory >= 1} />
                    </div>
                    
                    <Card className="bg-slate-50 border-slate-200" data-testid="card-surface-bonuses">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                          <Zap className="w-4 h-4 text-yellow-500" /> Active Infrastructure Bonuses
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-white p-4 rounded border border-slate-200"><div className="text-sm font-bold text-slate-900 mb-1">Construction Speed</div><div className="text-2xl font-mono font-bold text-orange-600">-{buildings.roboticsFactory * 10}%</div><div className="text-xs text-muted-foreground">From Robotics Factory</div></div>
                          <div className="bg-white p-4 rounded border border-slate-200"><div className="text-sm font-bold text-slate-900 mb-1">Ship Build Speed</div><div className="text-2xl font-mono font-bold text-blue-600">-{buildings.shipyard * 5}%</div><div className="text-xs text-muted-foreground">From Shipyard</div></div>
                          <div className="bg-white p-4 rounded border border-slate-200"><div className="text-sm font-bold text-slate-900 mb-1">Research Speed</div><div className="text-2xl font-mono font-bold text-green-600">-{buildings.researchLab * 5}%</div><div className="text-xs text-muted-foreground">From Research Lab</div></div>
                        </div>
                      </CardContent>
                    </Card>

                    <CategoryTabs
                      categories={CORE_FACILITY_CATEGORIES}
                      title="Planetary Core Facilities"
                      description="Nine category wings and forty-three selections now organize the core colony shell, pairing your active upgrade buildings with a much richer operations map."
                      renderCategory={(category) =>
                        renderSelectionGrid(planetCoreSelections.filter((selection) => selection.categoryId === category.id))
                      }
                    />
                  </TabsContent>

                  <TabsContent value="infrastructure-matrix" className="mt-0 space-y-6">
                    <Card className="bg-white border-slate-200 shadow-sm" data-testid="card-infrastructure-matrix-summary">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                          <Factory className="w-4 h-4 text-primary" /> 42 Infrastructure Expansion Systems
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          The matrix is now organized into 9 categories and 42 selections while keeping the same upgrade systems underneath.
                        </p>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4"><div className="text-xs uppercase tracking-widest text-muted-foreground">Categories</div><div className="mt-1 text-2xl font-orbitron font-bold text-slate-900">{FACILITY_OPERATIONS_COUNTS.infrastructureCategories}</div></div>
                          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4"><div className="text-xs uppercase tracking-widest text-muted-foreground">Selections</div><div className="mt-1 text-2xl font-orbitron font-bold text-slate-900">{FACILITY_OPERATIONS_COUNTS.infrastructureSelections}</div></div>
                          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4"><div className="text-xs uppercase tracking-widest text-muted-foreground">Ready Now</div><div className="mt-1 text-2xl font-orbitron font-bold text-green-700">{unlockedInfrastructureSystems}</div></div>
                          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4"><div className="text-xs uppercase tracking-widest text-muted-foreground">Legacy Clusters</div><div className="mt-1 text-2xl font-orbitron font-bold text-slate-900">{infrastructureClusters}</div></div>
                        </div>
                      </CardContent>
                    </Card>

                    <CategoryTabs
                      categories={INFRASTRUCTURE_CATEGORY_SPLIT}
                      title="Infrastructure Matrix"
                      description="Each category groups live upgrade systems into a strategic command lane while preserving their existing costs, requirements, and progression."
                      renderCategory={(category) => (
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                          {planetInfrastructureSelections
                            .filter((selection) => selection.categoryId === category.id)
                            .map((selection) => {
                              const system = infrastructureSystems.find((entry) => entry.id === selection.linkedAsset);
                              return system ? (
                                <ExpansionSystemCard
                                  key={selection.id}
                                  system={system}
                                  unlocked={system.unlocked}
                                  level={system.level}
                                  canAfford={system.canAfford}
                                  maxed={system.maxed}
                                  onUpgrade={() => upgradeInfrastructureSystem(system.id, system.name, system.snapshot.cost, system.snapshot.buildTimeSeconds * 1000)}
                                />
                              ) : null;
                            })}
                        </div>
                      )}
                    />
                  </TabsContent>

                  <TabsContent value="technology-systems" className="mt-0 space-y-6">
                    <Card className="bg-white border-slate-200 shadow-sm" data-testid="card-tech-systems-summary">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                          <FlaskConical className="w-4 h-4 text-green-600" /> 28 Technology and Research Systems
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          The research layer now breaks into 9 category lanes and 28 selections while still using the same live upgrade systems.
                        </p>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4"><div className="text-xs uppercase tracking-widest text-muted-foreground">Categories</div><div className="mt-1 text-2xl font-orbitron font-bold text-slate-900">{FACILITY_OPERATIONS_COUNTS.technologyCategories}</div></div>
                          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4"><div className="text-xs uppercase tracking-widest text-muted-foreground">Selections</div><div className="mt-1 text-2xl font-orbitron font-bold text-slate-900">{FACILITY_OPERATIONS_COUNTS.technologySelections}</div></div>
                          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4"><div className="text-xs uppercase tracking-widest text-muted-foreground">Research-Ready</div><div className="mt-1 text-2xl font-orbitron font-bold text-green-700">{unlockedTechnologySystems}</div></div>
                          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4"><div className="text-xs uppercase tracking-widest text-muted-foreground">Legacy Clusters</div><div className="mt-1 text-2xl font-orbitron font-bold text-slate-900">{technologyClusters}</div></div>
                        </div>
                      </CardContent>
                    </Card>

                    <CategoryTabs
                      categories={TECHNOLOGY_CATEGORY_SPLIT}
                      title="Tech Systems"
                      description="Nine research-control categories now frame your 28 technology selections for faster scanning and clearer progression planning."
                      renderCategory={(category) => (
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                          {planetTechnologySelections
                            .filter((selection) => selection.categoryId === category.id)
                            .map((selection) => {
                              const system = technologySystems.find((entry) => entry.id === selection.linkedAsset);
                              return system ? (
                                <ExpansionSystemCard
                                  key={selection.id}
                                  system={system}
                                  unlocked={system.unlocked}
                                  level={system.level}
                                  canAfford={system.canAfford}
                                  maxed={system.maxed}
                                  onUpgrade={() => upgradeTechnologySystem(system.id, system.name, system.snapshot.cost, system.snapshot.buildTimeSeconds * 1000)}
                                />
                              ) : null;
                            })}
                        </div>
                      )}
                    />
                  </TabsContent>
                </Tabs>
             </TabsContent>

             <TabsContent value="moon" className="mt-0">
                <Card className="mb-6 bg-slate-800 text-white border-slate-700" data-testid="card-moon-info">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <Moon className="w-12 h-12 text-slate-300" />
                      <div>
                        <div className="font-orbitron font-bold text-lg">Lunar Base Operations</div>
                        <div className="text-sm text-slate-300">Nine category layers now organize lunar core facilities, infrastructure matrix systems, and tech systems with the same structure as the main colony.</div>
                      </div>
                      <Badge variant="outline" className="ml-auto border-slate-500 text-slate-300">Diameter: 8,234 km</Badge>
                    </div>
                  </CardContent>
                </Card>
                <Tabs defaultValue="core" className="w-full">
                  <TabsList className="mb-6 h-auto w-full flex-wrap justify-start gap-2 border border-slate-200 bg-white p-2">
                    <TabsTrigger value="core" className="font-orbitron data-[state=active]:bg-slate-100">Core Facilities {FACILITY_OPERATIONS_COUNTS.coreSelections}</TabsTrigger>
                    <TabsTrigger value="infrastructure" className="font-orbitron data-[state=active]:bg-slate-100">Infrastructure Matrix {FACILITY_OPERATIONS_COUNTS.infrastructureSelections}</TabsTrigger>
                    <TabsTrigger value="technology" className="font-orbitron data-[state=active]:bg-slate-100">Tech Systems {FACILITY_OPERATIONS_COUNTS.technologySelections}</TabsTrigger>
                  </TabsList>

                  <TabsContent value="core" className="mt-0 space-y-6">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                      <Card className="border-slate-200 bg-white shadow-sm"><CardContent className="pt-6"><div className="text-xs uppercase tracking-widest text-muted-foreground">Categories</div><div className="mt-1 text-2xl font-orbitron font-bold text-slate-900">{FACILITY_OPERATIONS_COUNTS.coreCategories}</div></CardContent></Card>
                      <Card className="border-slate-200 bg-white shadow-sm"><CardContent className="pt-6"><div className="text-xs uppercase tracking-widest text-muted-foreground">Selections</div><div className="mt-1 text-2xl font-orbitron font-bold text-blue-700">{FACILITY_OPERATIONS_COUNTS.coreSelections}</div></CardContent></Card>
                      <Card className="border-slate-200 bg-white shadow-sm"><CardContent className="pt-6"><div className="text-xs uppercase tracking-widest text-muted-foreground">Lunar Levels</div><div className="mt-1 text-2xl font-orbitron font-bold text-slate-900">{moonCoreLevel}</div></CardContent></Card>
                      <Card className="border-slate-200 bg-white shadow-sm"><CardContent className="pt-6"><div className="text-xs uppercase tracking-widest text-muted-foreground">Command Layer</div><div className="mt-1 text-2xl font-orbitron font-bold text-slate-700">Moon</div></CardContent></Card>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {moonBuildings.map((b) => {
                        const level = orbitalBuildings[b.id] || 0;
                        const requirement = getOrbitalRequirementLabel(b, orbitalBuildings);
                        const effects = getOrbitalFacilityEffect(b, level);
                        return <FacilityCard key={b.id} id={b.id} name={b.name} level={level} description={b.description} icon={b.icon} iconColor="text-slate-500" resources={resources} onUpgrade={updateBuilding} customCost={b.baseCost} effect={effects.effect} nextEffect={effects.nextEffect} requirement={requirement} requirementMet={!requirement} />;
                      })}
                    </div>
                    <CategoryTabs categories={CORE_FACILITY_CATEGORIES} title="Lunar Core Facilities" description="The lunar command layer now has 9 categories and 43 selections, matching the surface core-facility structure while focusing on moonbase operations." renderCategory={(category) => renderSelectionGrid(moonCoreSelections.filter((selection) => selection.categoryId === category.id))} />
                  </TabsContent>

                  <TabsContent value="infrastructure" className="mt-0 space-y-6">
                    <Card className="bg-white border-slate-200 shadow-sm"><CardHeader className="pb-2"><CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Lunar Infrastructure Matrix</CardTitle><p className="text-sm text-muted-foreground">Nine categories and forty-two selections frame the same infrastructure upgrade systems for lunar planning and orbital support coordination.</p></CardHeader></Card>
                    <CategoryTabs categories={INFRASTRUCTURE_CATEGORY_SPLIT} title="Lunar Infrastructure Matrix" description="Moon operations share the same 42 upgrade selections, now sorted into 9 category lanes for clearer scaling and unlock planning." renderCategory={(category) => (
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {moonInfrastructureSelections.filter((selection) => selection.categoryId === category.id).map((selection) => {
                          const system = infrastructureSystems.find((entry) => entry.id === selection.linkedAsset);
                          return system ? <ExpansionSystemCard key={selection.id} system={system} unlocked={system.unlocked} level={system.level} canAfford={system.canAfford} maxed={system.maxed} onUpgrade={() => upgradeInfrastructureSystem(system.id, system.name, system.snapshot.cost, system.snapshot.buildTimeSeconds * 1000)} /> : null;
                        })}
                      </div>
                    )} />
                  </TabsContent>

                  <TabsContent value="technology" className="mt-0 space-y-6">
                    <Card className="bg-white border-slate-200 shadow-sm"><CardHeader className="pb-2"><CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Lunar Tech Systems</CardTitle><p className="text-sm text-muted-foreground">Nine category lanes organize the 28 technology selections that strengthen sensing, energy, propulsion, and lunar deployment science.</p></CardHeader></Card>
                    <CategoryTabs categories={TECHNOLOGY_CATEGORY_SPLIT} title="Lunar Tech Systems" description="The moonbase now mirrors the surface research shell, with the same 28 upgrade selections presented through 9 more readable domains." renderCategory={(category) => (
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {moonTechnologySelections.filter((selection) => selection.categoryId === category.id).map((selection) => {
                          const system = technologySystems.find((entry) => entry.id === selection.linkedAsset);
                          return system ? <ExpansionSystemCard key={selection.id} system={system} unlocked={system.unlocked} level={system.level} canAfford={system.canAfford} maxed={system.maxed} onUpgrade={() => upgradeTechnologySystem(system.id, system.name, system.snapshot.cost, system.snapshot.buildTimeSeconds * 1000)} /> : null;
                        })}
                      </div>
                    )} />
                  </TabsContent>
                </Tabs>
             </TabsContent>

             <TabsContent value="station" className="mt-0">
                <Card className="mb-6 bg-purple-900 text-white border-purple-700" data-testid="card-station-info">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <Satellite className="w-12 h-12 text-purple-300" />
                      <div>
                        <div className="font-orbitron font-bold text-lg">Orbital Station Network</div>
                        <div className="text-sm text-purple-200">The orbital layer now mirrors the same 9-category structure for core facilities, infrastructure matrix systems, and tech systems.</div>
                      </div>
                      <Badge variant="outline" className="ml-auto border-purple-400 text-purple-200">Orbit: 450 km</Badge>
                    </div>
                  </CardContent>
                </Card>
                <Tabs defaultValue="core" className="w-full">
                  <TabsList className="mb-6 h-auto w-full flex-wrap justify-start gap-2 border border-slate-200 bg-white p-2">
                    <TabsTrigger value="core" className="font-orbitron data-[state=active]:bg-slate-100">Core Facilities {FACILITY_OPERATIONS_COUNTS.coreSelections}</TabsTrigger>
                    <TabsTrigger value="infrastructure" className="font-orbitron data-[state=active]:bg-slate-100">Infrastructure Matrix {FACILITY_OPERATIONS_COUNTS.infrastructureSelections}</TabsTrigger>
                    <TabsTrigger value="technology" className="font-orbitron data-[state=active]:bg-slate-100">Tech Systems {FACILITY_OPERATIONS_COUNTS.technologySelections}</TabsTrigger>
                  </TabsList>

                  <TabsContent value="core" className="mt-0 space-y-6">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                      <Card className="border-slate-200 bg-white shadow-sm"><CardContent className="pt-6"><div className="text-xs uppercase tracking-widest text-muted-foreground">Categories</div><div className="mt-1 text-2xl font-orbitron font-bold text-slate-900">{FACILITY_OPERATIONS_COUNTS.coreCategories}</div></CardContent></Card>
                      <Card className="border-slate-200 bg-white shadow-sm"><CardContent className="pt-6"><div className="text-xs uppercase tracking-widest text-muted-foreground">Selections</div><div className="mt-1 text-2xl font-orbitron font-bold text-blue-700">{FACILITY_OPERATIONS_COUNTS.coreSelections}</div></CardContent></Card>
                      <Card className="border-slate-200 bg-white shadow-sm"><CardContent className="pt-6"><div className="text-xs uppercase tracking-widest text-muted-foreground">Orbital Levels</div><div className="mt-1 text-2xl font-orbitron font-bold text-purple-700">{stationCoreLevel}</div></CardContent></Card>
                      <Card className="border-slate-200 bg-white shadow-sm"><CardContent className="pt-6"><div className="text-xs uppercase tracking-widest text-muted-foreground">Command Layer</div><div className="mt-1 text-2xl font-orbitron font-bold text-purple-700">Station</div></CardContent></Card>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {stationBuildings.map((b) => {
                        const level = orbitalBuildings[b.id] || 0;
                        const requirement = getOrbitalRequirementLabel(b, orbitalBuildings);
                        const effects = getOrbitalFacilityEffect(b, level);
                        return <FacilityCard key={b.id} id={b.id} name={b.name} level={level} description={b.description} icon={b.icon} iconColor="text-purple-500" resources={resources} onUpgrade={updateBuilding} customCost={b.baseCost} effect={effects.effect} nextEffect={effects.nextEffect} requirement={requirement} requirementMet={!requirement} />;
                      })}
                    </div>
                    <CategoryTabs categories={CORE_FACILITY_CATEGORIES} title="Orbital Core Facilities" description="The orbital station now tracks 9 categories and 43 selections for command, fabrication, logistics, power, and support systems." renderCategory={(category) => renderSelectionGrid(stationCoreSelections.filter((selection) => selection.categoryId === category.id))} />
                  </TabsContent>

                  <TabsContent value="infrastructure" className="mt-0 space-y-6">
                    <Card className="bg-white border-slate-200 shadow-sm"><CardHeader className="pb-2"><CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Orbital Infrastructure Matrix</CardTitle><p className="text-sm text-muted-foreground">The station layer now uses the same 9-category / 42-selection matrix for logistics, defense, traffic control, and orbital support growth.</p></CardHeader></Card>
                    <CategoryTabs categories={INFRASTRUCTURE_CATEGORY_SPLIT} title="Orbital Infrastructure Matrix" description="The same 42 infrastructure upgrades are now categorized for the orbital shell, making station-scale planning match the planet and moon layouts." renderCategory={(category) => (
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {stationInfrastructureSelections.filter((selection) => selection.categoryId === category.id).map((selection) => {
                          const system = infrastructureSystems.find((entry) => entry.id === selection.linkedAsset);
                          return system ? <ExpansionSystemCard key={selection.id} system={system} unlocked={system.unlocked} level={system.level} canAfford={system.canAfford} maxed={system.maxed} onUpgrade={() => upgradeInfrastructureSystem(system.id, system.name, system.snapshot.cost, system.snapshot.buildTimeSeconds * 1000)} /> : null;
                        })}
                      </div>
                    )} />
                  </TabsContent>

                  <TabsContent value="technology" className="mt-0 space-y-6">
                    <Card className="bg-white border-slate-200 shadow-sm"><CardHeader className="pb-2"><CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Orbital Tech Systems</CardTitle><p className="text-sm text-muted-foreground">The orbital research shell mirrors the same 9-category / 28-selection technology structure for clearer dockyard and station progression.</p></CardHeader></Card>
                    <CategoryTabs categories={TECHNOLOGY_CATEGORY_SPLIT} title="Orbital Tech Systems" description="Every station-facing technology selection now sits in a readable category lane while still using the same active upgrade progression underneath." renderCategory={(category) => (
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {stationTechnologySelections.filter((selection) => selection.categoryId === category.id).map((selection) => {
                          const system = technologySystems.find((entry) => entry.id === selection.linkedAsset);
                          return system ? <ExpansionSystemCard key={selection.id} system={system} unlocked={system.unlocked} level={system.level} canAfford={system.canAfford} maxed={system.maxed} onUpgrade={() => upgradeTechnologySystem(system.id, system.name, system.snapshot.cost, system.snapshot.buildTimeSeconds * 1000)} /> : null;
                        })}
                      </div>
                    )} />
                  </TabsContent>
                </Tabs>
             </TabsContent>
          </div>
        </Tabs>
      </div>
    </GameLayout>
  );
}
