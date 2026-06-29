// Orbital Stations System — Comprehensive Configuration
// 18 categories · 32 sub-categories · Tiers 1-99 · Levels 1-999
// Includes: class, subClass, type, subType, name, rank, title,
//           details, stats, subStats, descriptions, subDescriptions,
//           attributes, subAttributes, subjects, subjectDetails

// ─────────────────────────────────────────────────────────────────────────────
// ENUMERATIONS
// ─────────────────────────────────────────────────────────────────────────────

export type OrbitalStationClass =
  | "common"
  | "uncommon"
  | "rare"
  | "epic"
  | "legendary"
  | "mythic"
  | "transcendent";

export type OrbitalStationSubClass =
  | "Alpha"
  | "Beta"
  | "Gamma"
  | "Delta"
  | "Epsilon"
  | "Zeta"
  | "Omega";

export type OrbitalStationCategory =
  | "command_control"
  | "energy_systems"
  | "defense_systems"
  | "manufacturing"
  | "research_development"
  | "logistics_supply"
  | "communications"
  | "habitation"
  | "mining_extraction"
  | "trade_commerce"
  | "military_operations"
  | "shipyard_operations"
  | "intelligence"
  | "diplomacy"
  | "terraforming"
  | "anomaly_research"
  | "medical"
  | "megastructure_support";

export type OrbitalStationSubCategory =
  // command_control (2)
  | "tactical_command"
  | "strategic_operations"
  // energy_systems (2)
  | "fusion_power_core"
  | "antimatter_reactor"
  // defense_systems (2)
  | "kinetic_defense"
  | "energy_shield"
  // manufacturing (2)
  | "fabrication_bay"
  | "assembly_dock"
  // research_development (2)
  | "science_division"
  | "advanced_tech_lab"
  // logistics_supply (2)
  | "supply_depot"
  | "transit_hub"
  // communications (2)
  | "sensor_network"
  | "signal_relay"
  // habitation (2)
  | "crew_quarters"
  | "life_support"
  // mining_extraction (2)
  | "orbital_mining"
  | "resource_processing"
  // trade_commerce (2)
  | "market_hub"
  | "trade_terminal"
  // military_operations (2)
  | "infantry_garrison"
  | "mechanized_division"
  // shipyard_operations (2)
  | "light_vessel_shipyard"
  | "capital_ship_drydock"
  // intelligence (1)
  | "spy_network"
  // diplomacy (1)
  | "embassy_complex"
  // terraforming (1)
  | "atmospheric_processor"
  // anomaly_research (2)
  | "void_research"
  | "artifact_analysis"
  // medical (1)
  | "medical_bay"
  // megastructure_support (2)
  | "construction_support"
  | "megastructure_power_relay";

export type OrbitalStationType =
  | "surface"
  | "lunar"
  | "orbital"
  | "deep_space"
  | "lagrange_point";

export type OrbitalStationSubType =
  | "fixed"
  | "modular"
  | "mobile"
  | "anchored"
  | "ring_segment";

export type OrbitalStationRank =
  | "Initiate"
  | "Operator"
  | "Engineer"
  | "Specialist"
  | "Expert"
  | "Master"
  | "Elite"
  | "Veteran"
  | "Legend"
  | "Mythic";

// ─────────────────────────────────────────────────────────────────────────────
// INTERFACES
// ─────────────────────────────────────────────────────────────────────────────

export interface OrbitalStationStats {
  attack?: number;
  defense?: number;
  hp?: number;
  energy?: number;
  production?: number;
  range?: number;
  speed?: number;
  capacity?: number;
  crewCapacity?: number;
  powerOutput?: number;
}

export interface OrbitalStationSubStats {
  critChance?: number;
  critMultiplier?: number;
  armorPenetration?: number;
  shieldRecharge?: number;
  energyEfficiency?: number;
  researchBonus?: number;
  tradeBonus?: number;
  buildSpeedBonus?: number;
  scanRange?: number;
  diplomaticInfluence?: number;
}

export interface OrbitalStationAttributes {
  isOrbital: boolean;
  isModular: boolean;
  requiresMoon: boolean;
  requiresTech?: string;
  maxInstances?: number;
  constructionTimeSec: number;
  costFactor: number;
  canUpgrade: boolean;
  zoneLock?: OrbitalStationType;
}

export interface OrbitalStationSubAttributes {
  canBeDestroyed: boolean;
  hasCrew: boolean;
  automatable: boolean;
  expandable: boolean;
  shieldable: boolean;
  salvageable: boolean;
}

export interface OrbitalStationSubject {
  name: string;
  details: string;
  description: string;
}

export interface OrbitalStation {
  id: string;

  // Classification
  category: OrbitalStationCategory;
  subCategory: OrbitalStationSubCategory;
  type: OrbitalStationType;
  subType: OrbitalStationSubType;
  class: OrbitalStationClass;
  subClass: OrbitalStationSubClass;

  // Naming & Progression Identity
  name: string;
  rank: OrbitalStationRank;
  title: string;

  // Progression
  tier: number;        // 1–99
  maxTier: number;     // always 99
  level: number;       // 1–999
  maxLevel: number;    // always 999

  // Descriptions
  description: string;
  subDescription: string;
  details: string;
  subDetails: string;

  // Economy
  cost: { metal: number; crystal: number; deuterium: number };

  // Stats
  stats: OrbitalStationStats;
  subStats: OrbitalStationSubStats;

  // Attributes
  attributes: OrbitalStationAttributes;
  subAttributes: OrbitalStationSubAttributes;

  // Subjects (thematic lore / gameplay notes)
  subjects: OrbitalStationSubject[];
}

// ─────────────────────────────────────────────────────────────────────────────
// RANK LOOKUP HELPER
// ─────────────────────────────────────────────────────────────────────────────

export function getTierRank(tier: number): OrbitalStationRank {
  if (tier <= 10) return "Initiate";
  if (tier <= 20) return "Operator";
  if (tier <= 30) return "Engineer";
  if (tier <= 40) return "Specialist";
  if (tier <= 50) return "Expert";
  if (tier <= 60) return "Master";
  if (tier <= 70) return "Elite";
  if (tier <= 80) return "Veteran";
  if (tier <= 90) return "Legend";
  return "Mythic";
}

export function getClassTitle(stationClass: OrbitalStationClass): string {
  const titles: Record<OrbitalStationClass, string> = {
    common: "Station",
    uncommon: "Outpost",
    rare: "Base",
    epic: "Complex",
    legendary: "Fortress",
    mythic: "Citadel",
    transcendent: "Nexus",
  };
  return titles[stationClass];
}

// ─────────────────────────────────────────────────────────────────────────────
// CATEGORY METADATA
// ─────────────────────────────────────────────────────────────────────────────

export interface OrbitalCategoryMeta {
  id: OrbitalStationCategory;
  label: string;
  description: string;
  subCategories: OrbitalSubCategoryMeta[];
}

export interface OrbitalSubCategoryMeta {
  id: OrbitalStationSubCategory;
  label: string;
  description: string;
}

export const ORBITAL_STATION_CATEGORIES: OrbitalCategoryMeta[] = [
  {
    id: "command_control",
    label: "Command & Control",
    description: "Central command infrastructure for coordinating orbital and surface assets.",
    subCategories: [
      { id: "tactical_command",    label: "Tactical Command Center",    description: "Real-time battlefield coordination hub." },
      { id: "strategic_operations", label: "Strategic Operations Hub",  description: "Long-range planning and fleet doctrine management." },
    ],
  },
  {
    id: "energy_systems",
    label: "Energy Systems",
    description: "Power generation and distribution for all station operations.",
    subCategories: [
      { id: "fusion_power_core",   label: "Fusion Power Core",          description: "Sustained fusion reaction for primary power supply." },
      { id: "antimatter_reactor",  label: "Antimatter Reactor",         description: "High-density antimatter containment energy source." },
    ],
  },
  {
    id: "defense_systems",
    label: "Defense Systems",
    description: "Defensive armaments and countermeasure networks.",
    subCategories: [
      { id: "kinetic_defense",     label: "Kinetic Defense Battery",    description: "Railgun and missile platforms for kinetic interception." },
      { id: "energy_shield",       label: "Energy Shield Array",        description: "Projected energy fields protecting station hulls." },
    ],
  },
  {
    id: "manufacturing",
    label: "Manufacturing",
    description: "Zero-G fabrication and heavy construction facilities.",
    subCategories: [
      { id: "fabrication_bay",     label: "Fabrication Bay",            description: "Component manufacturing using orbital resources." },
      { id: "assembly_dock",       label: "Heavy Assembly Dock",        description: "Large-scale module and ship hull assembly." },
    ],
  },
  {
    id: "research_development",
    label: "Research & Development",
    description: "Scientific inquiry and technological advancement.",
    subCategories: [
      { id: "science_division",    label: "Science Division",           description: "Core research in physics, biology, and materials." },
      { id: "advanced_tech_lab",   label: "Advanced Tech Laboratory",   description: "Cutting-edge technology prototyping and testing." },
    ],
  },
  {
    id: "logistics_supply",
    label: "Logistics & Supply",
    description: "Resource storage, distribution, and transit coordination.",
    subCategories: [
      { id: "supply_depot",        label: "Supply Depot",               description: "Bulk resource storage and rapid dispatch." },
      { id: "transit_hub",         label: "Transit Hub",                description: "Fleet resupply and crew transfer operations." },
    ],
  },
  {
    id: "communications",
    label: "Communications",
    description: "Sensor networks and inter-system signal infrastructure.",
    subCategories: [
      { id: "sensor_network",      label: "Sensor Network Array",       description: "Wide-field sensor scanning of surrounding space." },
      { id: "signal_relay",        label: "Signal Relay Station",       description: "Boosted FTL-capable communication relay." },
    ],
  },
  {
    id: "habitation",
    label: "Habitation",
    description: "Crew living quarters and life-sustaining systems.",
    subCategories: [
      { id: "crew_quarters",       label: "Crew Quarters Complex",      description: "Pressurized housing for station personnel." },
      { id: "life_support",        label: "Life Support Systems",       description: "Atmospheric processing and emergency sustenance." },
    ],
  },
  {
    id: "mining_extraction",
    label: "Mining & Extraction",
    description: "Orbital and deep-space resource harvesting operations.",
    subCategories: [
      { id: "orbital_mining",      label: "Orbital Mining Rig",         description: "Extracts minerals from asteroids and debris fields." },
      { id: "resource_processing", label: "Resource Processing Bay",    description: "Refines raw ore into usable materials in situ." },
    ],
  },
  {
    id: "trade_commerce",
    label: "Trade & Commerce",
    description: "Economic infrastructure for inter-system trade.",
    subCategories: [
      { id: "market_hub",          label: "Market Hub",                 description: "Exchange and pricing center for commodity trade." },
      { id: "trade_terminal",      label: "Trade Route Terminal",       description: "Long-haul shipping coordination and customs." },
    ],
  },
  {
    id: "military_operations",
    label: "Military Operations",
    description: "Ground forces staging and armored warfare support.",
    subCategories: [
      { id: "infantry_garrison",   label: "Infantry Garrison",          description: "Housing and training for orbital assault troops." },
      { id: "mechanized_division", label: "Mechanized Division Bay",    description: "Staging for armored vehicles and mechs." },
    ],
  },
  {
    id: "shipyard_operations",
    label: "Shipyard Operations",
    description: "Ship construction, repair, and retrofit capabilities.",
    subCategories: [
      { id: "light_vessel_shipyard", label: "Light Vessel Shipyard",    description: "Rapid construction of frigates and fighters." },
      { id: "capital_ship_drydock",  label: "Capital Ship Drydock",    description: "Massive drydock for battleships and carriers." },
    ],
  },
  {
    id: "intelligence",
    label: "Intelligence",
    description: "Clandestine information gathering and counterintelligence.",
    subCategories: [
      { id: "spy_network",         label: "Spy Network Center",         description: "Coordination of covert assets across star systems." },
    ],
  },
  {
    id: "diplomacy",
    label: "Diplomacy",
    description: "Diplomatic relations and inter-faction negotiation.",
    subCategories: [
      { id: "embassy_complex",     label: "Embassy Complex",            description: "Official representation and treaty management." },
    ],
  },
  {
    id: "terraforming",
    label: "Terraforming",
    description: "Planetary and lunar atmosphere modification projects.",
    subCategories: [
      { id: "atmospheric_processor", label: "Atmospheric Processor",   description: "Large-scale gas injection for atmosphere seeding." },
    ],
  },
  {
    id: "anomaly_research",
    label: "Anomaly Research",
    description: "Investigation of spatial anomalies and recovered artifacts.",
    subCategories: [
      { id: "void_research",       label: "Void Research Chamber",      description: "Studies of null-space phenomena and warp distortions." },
      { id: "artifact_analysis",   label: "Artifact Analysis Lab",      description: "Classification and reverse-engineering of alien relics." },
    ],
  },
  {
    id: "medical",
    label: "Medical",
    description: "Crew health, trauma response, and biotech research.",
    subCategories: [
      { id: "medical_bay",         label: "Medical Bay Complex",        description: "Emergency surgery, recovery wards, and cloning support." },
    ],
  },
  {
    id: "megastructure_support",
    label: "Megastructure Support",
    description: "Infrastructure enabling the construction of megastructures.",
    subCategories: [
      { id: "construction_support",       label: "Construction Support Ring",       description: "Scaffolding and assembly logistics for megaprojects." },
      { id: "megastructure_power_relay",  label: "Megastructure Power Relay",       description: "Transfers gigawatt-scale power to megastructure frames." },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// STATION DEFINITIONS  (2 per category = 36 representative stations)
// ─────────────────────────────────────────────────────────────────────────────

// Helper factory keeps definitions concise
function makeStation(
  id: string,
  name: string,
  category: OrbitalStationCategory,
  subCategory: OrbitalStationSubCategory,
  type: OrbitalStationType,
  subType: OrbitalStationSubType,
  stationClass: OrbitalStationClass,
  subClass: OrbitalStationSubClass,
  tier: number,
  cost: { metal: number; crystal: number; deuterium: number },
  stats: OrbitalStationStats,
  subStats: OrbitalStationSubStats,
  attributes: OrbitalStationAttributes,
  subAttributes: OrbitalStationSubAttributes,
  description: string,
  subDescription: string,
  details: string,
  subDetails: string,
  subjects: OrbitalStationSubject[],
): OrbitalStation {
  return {
    id,
    category,
    subCategory,
    type,
    subType,
    class: stationClass,
    subClass,
    name,
    rank: getTierRank(tier),
    title: getClassTitle(stationClass),
    tier,
    maxTier: 99,
    level: 1,
    maxLevel: 999,
    description,
    subDescription,
    details,
    subDetails,
    cost,
    stats,
    subStats,
    attributes,
    subAttributes,
    subjects,
  };
}

// ── CATEGORY 1: Command & Control ────────────────────────────────────────────

export const COMMAND_CONTROL_STATIONS: OrbitalStation[] = [
  makeStation(
    "tacCmdCommon",
    "Tactical Command Station",
    "command_control", "tactical_command",
    "orbital", "fixed",
    "common", "Alpha",
    1,
    { metal: 50000, crystal: 30000, deuterium: 10000 },
    { defense: 200, hp: 5000, crewCapacity: 50 },
    { critChance: 0.02, scanRange: 100 },
    { isOrbital: true, isModular: false, requiresMoon: false, constructionTimeSec: 14400, costFactor: 1.5, canUpgrade: true, zoneLock: "orbital" },
    { canBeDestroyed: true, hasCrew: true, automatable: false, expandable: true, shieldable: true, salvageable: false },
    "A basic orbital command station for coordinating planetary defense.", "Provides tactical overview for nearby fleet assets.",
    "Level 1–999 upgrades increase scan radius and defense rating.", "Tier unlocks new sensor suites every 10 tiers.",
    [
      { name: "Fleet Coordination", details: "Syncs fleet movements within 5 AU", description: "Reduces response time by 10% per level." },
      { name: "Threat Assessment", details: "AI-driven threat classification", description: "Prioritises enemy targets for defensive fire." },
    ],
  ),
  makeStation(
    "stratOpsEpic",
    "Strategic Operations Nexus",
    "command_control", "strategic_operations",
    "orbital", "modular",
    "epic", "Delta",
    35,
    { metal: 2000000, crystal: 1500000, deuterium: 500000 },
    { defense: 8000, hp: 50000, crewCapacity: 500, powerOutput: 2000 },
    { critChance: 0.08, scanRange: 2000, diplomaticInfluence: 25 },
    { isOrbital: true, isModular: true, requiresMoon: false, requiresTech: "advancedLogistics", constructionTimeSec: 259200, costFactor: 1.8, canUpgrade: true, zoneLock: "orbital" },
    { canBeDestroyed: true, hasCrew: true, automatable: true, expandable: true, shieldable: true, salvageable: true },
    "An epic-class strategic hub managing empire-wide military doctrine.", "Integrates intelligence feeds, fleet positioning, and supply chain data.",
    "Tier 35 unlocks war-game simulation modules.", "Sub-stats scale with research investment.",
    [
      { name: "War Games Simulator", details: "Runs strategic scenarios in real-time", description: "Improves commander decision speed." },
      { name: "Doctrine Engine",     details: "AI-assisted strategy formulation",   description: "+5% fleet efficiency per tier above 30." },
    ],
  ),
];

// ── CATEGORY 2: Energy Systems ────────────────────────────────────────────────

export const ENERGY_SYSTEMS_STATIONS: OrbitalStation[] = [
  makeStation(
    "fusionCoreRare",
    "Fusion Power Core Station",
    "energy_systems", "fusion_power_core",
    "orbital", "fixed",
    "rare", "Beta",
    10,
    { metal: 300000, crystal: 150000, deuterium: 75000 },
    { energy: 5000, powerOutput: 1000, hp: 20000 },
    { energyEfficiency: 0.15, shieldRecharge: 200 },
    { isOrbital: true, isModular: false, requiresMoon: false, requiresTech: "fusionReactor", constructionTimeSec: 86400, costFactor: 1.6, canUpgrade: true, zoneLock: "orbital" },
    { canBeDestroyed: true, hasCrew: false, automatable: true, expandable: false, shieldable: true, salvageable: true },
    "Rare-class orbital fusion power core generating sustained megawatt output.", "Supplies energy to surrounding station modules via conduit arrays.",
    "Each level increases output by 2%. Tier 10 milestone enables surplus export.", "Orbital placement improves plasma containment efficiency.",
    [
      { name: "Plasma Containment",  details: "Magnetic bottle with 99.8% efficiency", description: "Reduces meltdown risk by 5% per tier." },
      { name: "Power Export Grid",   details: "Conduit network to adjacent modules",   description: "Shares 20% surplus with allied stations." },
    ],
  ),
  makeStation(
    "antimatterLeg",
    "Antimatter Reactor Complex",
    "energy_systems", "antimatter_reactor",
    "orbital", "anchored",
    "legendary", "Zeta",
    60,
    { metal: 8000000, crystal: 6000000, deuterium: 3000000 },
    { energy: 50000, powerOutput: 15000, hp: 120000 },
    { energyEfficiency: 0.45, shieldRecharge: 5000, critMultiplier: 2.0 },
    { isOrbital: true, isModular: true, requiresMoon: true, requiresTech: "antimatterContainment", constructionTimeSec: 2592000, costFactor: 2.2, canUpgrade: true, zoneLock: "orbital" },
    { canBeDestroyed: true, hasCrew: true, automatable: false, expandable: true, shieldable: true, salvageable: false },
    "Legendary antimatter annihilation reactor providing near-limitless power.", "Requires moon-anchoring due to gravitational stability requirements.",
    "Tier 60 enables antimatter warhead manufacturing as a secondary function.", "Level 500+ upgrades activate experimental zero-point energy taps.",
    [
      { name: "Annihilation Chamber",   details: "Pairs matter/antimatter in nanogram bursts", description: "99.99% conversion efficiency." },
      { name: "Containment Web",        details: "Warp-field bottle for particle isolation",    description: "Failure prevention scales with level." },
      { name: "Surplus Weapon Mode",    details: "Diverts excess energy to orbital weaponry",   description: "Unlocked at Tier 60." },
    ],
  ),
];

// ── CATEGORY 3: Defense Systems ───────────────────────────────────────────────

export const DEFENSE_SYSTEMS_STATIONS: OrbitalStation[] = [
  makeStation(
    "kineticDefCommon",
    "Kinetic Defense Battery",
    "defense_systems", "kinetic_defense",
    "orbital", "fixed",
    "common", "Alpha",
    1,
    { metal: 80000, crystal: 20000, deuterium: 5000 },
    { attack: 500, defense: 300, hp: 8000, range: 500 },
    { critChance: 0.05, armorPenetration: 0.1 },
    { isOrbital: true, isModular: false, requiresMoon: false, constructionTimeSec: 21600, costFactor: 1.5, canUpgrade: true, zoneLock: "orbital" },
    { canBeDestroyed: true, hasCrew: false, automatable: true, expandable: false, shieldable: true, salvageable: true },
    "Railgun and missile battery protecting orbital approaches.", "Auto-targeting system engages incoming threats.",
    "Attack rating scales linearly with level. Tier milestones unlock warhead types.", "Sub-stats improve with tier: AP increases 0.01 per tier.",
    [
      { name: "Railgun Array",     details: "Electromagnetic projectile launchers", description: "High velocity kinetic penetration." },
      { name: "Missile Battery",   details: "Smart-guided munitions cluster",       description: "Area-of-effect splash damage." },
    ],
  ),
  makeStation(
    "energyShieldEpic",
    "Energy Shield Array Complex",
    "defense_systems", "energy_shield",
    "orbital", "modular",
    "epic", "Gamma",
    40,
    { metal: 1500000, crystal: 2000000, deuterium: 750000 },
    { defense: 20000, hp: 80000, energy: -3000 },
    { shieldRecharge: 2000, energyEfficiency: 0.2 },
    { isOrbital: true, isModular: true, requiresMoon: false, requiresTech: "shieldTechnology", constructionTimeSec: 432000, costFactor: 1.9, canUpgrade: true },
    { canBeDestroyed: true, hasCrew: false, automatable: true, expandable: true, shieldable: false, salvageable: true },
    "Epic-class orbital shield array projecting layered defensive fields.", "Deploys overlapping shield domes around the station and adjacent structures.",
    "Shield recharge is the primary scaling stat. Tier 40 unlocks reflect mode.", "Consumes 3000 energy units but can be reduced with energy efficiency upgrades.",
    [
      { name: "Dome Projection",    details: "Multi-layer overlapping shield field",  description: "Each layer absorbs a percentage of incoming damage." },
      { name: "Reflect Mode",       details: "Bounces 10% of absorbed energy back",   description: "Unlocked at Tier 40; scales with sub-class." },
    ],
  ),
];

// ── CATEGORY 4: Manufacturing ─────────────────────────────────────────────────

export const MANUFACTURING_STATIONS: OrbitalStation[] = [
  makeStation(
    "fabBayUncommon",
    "Fabrication Bay Station",
    "manufacturing", "fabrication_bay",
    "orbital", "modular",
    "uncommon", "Beta",
    5,
    { metal: 120000, crystal: 60000, deuterium: 20000 },
    { production: 800, hp: 12000, crewCapacity: 100 },
    { buildSpeedBonus: 0.1, energyEfficiency: 0.05 },
    { isOrbital: true, isModular: true, requiresMoon: false, constructionTimeSec: 43200, costFactor: 1.6, canUpgrade: true },
    { canBeDestroyed: true, hasCrew: true, automatable: false, expandable: true, shieldable: true, salvageable: true },
    "Zero-gravity fabrication facility for component manufacturing.", "Produces modules, weapons components, and structural elements.",
    "Production rate increases 3% per level. Tier 5 unlocks rare alloy fabrication.", "Crew efficiency bonuses stack with civilization tech bonuses.",
    [
      { name: "Zero-G Forge",       details: "Microgravity metallurgy processes",   description: "Produces higher-quality alloys than planetary forges." },
      { name: "Auto-Assembly Line", details: "Robotic assembly with AI guidance",   description: "+10% build speed per uncommon class tier." },
    ],
  ),
  makeStation(
    "assemblyDockLeg",
    "Heavy Assembly Drydock",
    "manufacturing", "assembly_dock",
    "orbital", "anchored",
    "legendary", "Omega",
    70,
    { metal: 12000000, crystal: 8000000, deuterium: 4000000 },
    { production: 50000, hp: 500000, crewCapacity: 5000 },
    { buildSpeedBonus: 0.6, energyEfficiency: 0.3 },
    { isOrbital: true, isModular: true, requiresMoon: true, requiresTech: "megaConstruction", constructionTimeSec: 7776000, costFactor: 2.5, canUpgrade: true, zoneLock: "orbital" },
    { canBeDestroyed: false, hasCrew: true, automatable: true, expandable: true, shieldable: true, salvageable: false },
    "Legendary-class drydock for constructing capital ships and megastructure segments.", "Houses entire fleets for simultaneous refit and construction operations.",
    "Tier 70 grants priority queue slots for battleship construction.", "Sub-stat build speed bonus of 0.6 is among the highest in any manufacturing type.",
    [
      { name: "Capital Keel Slip",     details: "Dedicated keel-laying berths for dreadnoughts", description: "Reduces dreadnought build time by 40%." },
      { name: "Nanobot Swarm",         details: "Self-replicating nanobot construction teams",    description: "Doubles assembly speed at Tier 70." },
      { name: "Fleet Refit Bay",       details: "Multi-ship simultaneous upgrade slots",          description: "Up to 10 ships refitted simultaneously." },
    ],
  ),
];

// ── CATEGORY 5: Research & Development ────────────────────────────────────────

export const RESEARCH_DEVELOPMENT_STATIONS: OrbitalStation[] = [
  makeStation(
    "sciDivRare",
    "Science Division Station",
    "research_development", "science_division",
    "orbital", "modular",
    "rare", "Gamma",
    20,
    { metal: 500000, crystal: 800000, deuterium: 200000 },
    { production: 300, hp: 25000, crewCapacity: 200, energy: -1000 },
    { researchBonus: 0.2, energyEfficiency: 0.08 },
    { isOrbital: true, isModular: true, requiresMoon: false, requiresTech: "advancedLabs", constructionTimeSec: 172800, costFactor: 1.7, canUpgrade: true },
    { canBeDestroyed: true, hasCrew: true, automatable: false, expandable: true, shieldable: true, salvageable: true },
    "Rare-class orbital science station accelerating all research categories.", "Crew of scientists operate advanced instruments in microgravity conditions.",
    "Research bonus of 20% applies to all queued research projects. Tier 20 adds xenobiology lab.", "Each level adds 0.2% research bonus stacking globally.",
    [
      { name: "Zero-G Laboratory",     details: "Microgravity experimentation chambers", description: "+5% discovery chance per rare class tier." },
      { name: "Xenobiology Wing",      details: "Alien biology research division",       description: "Unlocked at Tier 20." },
    ],
  ),
  makeStation(
    "techLabMythic",
    "Advanced Tech Laboratory Nexus",
    "research_development", "advanced_tech_lab",
    "orbital", "ring_segment",
    "mythic", "Omega",
    90,
    { metal: 30000000, crystal: 25000000, deuterium: 10000000 },
    { production: 200000, hp: 1000000, crewCapacity: 10000, powerOutput: 5000 },
    { researchBonus: 1.0, buildSpeedBonus: 0.5, energyEfficiency: 0.5 },
    { isOrbital: true, isModular: true, requiresMoon: true, requiresTech: "transcendentScience", constructionTimeSec: 31536000, costFactor: 3.0, canUpgrade: true, maxInstances: 1 },
    { canBeDestroyed: false, hasCrew: true, automatable: true, expandable: false, shieldable: true, salvageable: false },
    "Mythic-class ring-segment tech lab representing the apex of imperial science.", "Contains every known instrument type and theoretical framework in active use.",
    "Research bonus doubles all research speeds. Only one may exist per empire.", "Tier 90 unlocks exotic matter research and warp field theory.",
    [
      { name: "Exotic Matter Lab",      details: "Experimental dark-matter manipulation",     description: "Enables exotic technology branches." },
      { name: "Warp Field Theoretics",  details: "Mathematical modelling of space-time",      description: "Unlocks advanced FTL and interstellar travel tech." },
      { name: "Omnidisciplinary Core",  details: "All science branches operating in parallel", description: "Max tier bonus: +100% research speed." },
    ],
  ),
];

// ── CATEGORY 6: Logistics & Supply ────────────────────────────────────────────

export const LOGISTICS_SUPPLY_STATIONS: OrbitalStation[] = [
  makeStation(
    "supplyDepotCommon",
    "Supply Depot Station",
    "logistics_supply", "supply_depot",
    "orbital", "fixed",
    "common", "Alpha",
    1,
    { metal: 30000, crystal: 10000, deuterium: 5000 },
    { capacity: 500000, hp: 6000 },
    { buildSpeedBonus: 0.05 },
    { isOrbital: true, isModular: false, requiresMoon: false, constructionTimeSec: 10800, costFactor: 1.4, canUpgrade: true },
    { canBeDestroyed: true, hasCrew: true, automatable: false, expandable: true, shieldable: false, salvageable: true },
    "Common orbital supply depot providing fleet resupply and resource staging.", "Stores fuel, munitions, and provisions for passing fleets.",
    "Capacity increases 10% per level. Tier 1 enables basic resupply of frigates and below.", "Sub-stat build speed bonus applies to all docked ships during refit.",
    [
      { name: "Fuel Bays",          details: "Deuterium storage for fleet resupply",     description: "Each level adds 50,000 unit capacity." },
      { name: "Munitions Locker",   details: "Ordnance storage and loading systems",     description: "Reduces fleet reload time by 2% per level." },
    ],
  ),
  makeStation(
    "transitHubEpic",
    "Transit Hub Complex",
    "logistics_supply", "transit_hub",
    "orbital", "modular",
    "epic", "Delta",
    45,
    { metal: 3000000, crystal: 2000000, deuterium: 800000 },
    { capacity: 20000000, hp: 100000, crewCapacity: 1000 },
    { tradeBonus: 0.3, buildSpeedBonus: 0.2 },
    { isOrbital: true, isModular: true, requiresMoon: false, requiresTech: "advancedLogistics", constructionTimeSec: 604800, costFactor: 2.0, canUpgrade: true },
    { canBeDestroyed: true, hasCrew: true, automatable: true, expandable: true, shieldable: true, salvageable: true },
    "Epic-class transit hub managing high-volume inter-system cargo and troop movement.", "Handles millions of tonnes of cargo simultaneously across dozens of berths.",
    "Tier 45 unlocks automated loading arms and AI routing.", "Trade bonus of 30% applies to all import/export operations at this hub.",
    [
      { name: "Automated Berths",   details: "Robotic docking and cargo handling",       description: "20 simultaneous ship dockings." },
      { name: "Route AI",           details: "AI-optimised cargo pathing",               description: "Reduces transport time by 15%." },
    ],
  ),
];

// ── CATEGORY 7: Communications ────────────────────────────────────────────────

export const COMMUNICATIONS_STATIONS: OrbitalStation[] = [
  makeStation(
    "sensorNetUncommon",
    "Sensor Network Array Station",
    "communications", "sensor_network",
    "orbital", "fixed",
    "uncommon", "Beta",
    8,
    { metal: 100000, crystal: 150000, deuterium: 30000 },
    { range: 2000, hp: 10000 },
    { scanRange: 500, critChance: 0.01 },
    { isOrbital: true, isModular: false, requiresMoon: false, constructionTimeSec: 28800, costFactor: 1.5, canUpgrade: true },
    { canBeDestroyed: true, hasCrew: false, automatable: true, expandable: false, shieldable: false, salvageable: true },
    "Uncommon orbital sensor array providing medium-range spatial awareness.", "Detects fleet movements and anomalies within sensor radius.",
    "Scan range increases 50 per level. Tier 8 enables stealth detection.", "Sub-stat scan range is primary scaling metric.",
    [
      { name: "Deep Space Radar",   details: "Long-range radiation detection",         description: "Detects cloaked vessels at reduced range." },
      { name: "Gravimetric Scanner", details: "Gravimetric anomaly detection",         description: "Identifies hidden mass concentrations." },
    ],
  ),
  makeStation(
    "signalRelayLeg",
    "Signal Relay Fortress",
    "communications", "signal_relay",
    "orbital", "ring_segment",
    "legendary", "Zeta",
    65,
    { metal: 6000000, crystal: 8000000, deuterium: 2000000 },
    { range: 100000, hp: 200000 },
    { scanRange: 50000, diplomaticInfluence: 50 },
    { isOrbital: true, isModular: true, requiresMoon: true, requiresTech: "quantumCommunication", constructionTimeSec: 3888000, costFactor: 2.3, canUpgrade: true },
    { canBeDestroyed: false, hasCrew: true, automatable: true, expandable: true, shieldable: true, salvageable: false },
    "Legendary FTL signal relay extending communications across star systems.", "Projects communications and intelligence feeds across multiple star systems.",
    "Range of 100,000 AU enables inter-sector coordination. Tier 65 enables encrypted diplomacy channels.", "Diplomatic influence bonus improves treaty terms.",
    [
      { name: "Quantum Entanglement Node", details: "Instantaneous FTL messaging",   description: "Zero-latency communications within relay range." },
      { name: "Encrypted Diplomacy",       details: "Secured channel for treaties",  description: "Reduces espionage interception by 40%." },
    ],
  ),
];

// ── CATEGORY 8: Habitation ────────────────────────────────────────────────────

export const HABITATION_STATIONS: OrbitalStation[] = [
  makeStation(
    "crewQuartersCommon",
    "Crew Quarters Station",
    "habitation", "crew_quarters",
    "orbital", "modular",
    "common", "Alpha",
    1,
    { metal: 40000, crystal: 15000, deuterium: 5000 },
    { crewCapacity: 200, hp: 5000 },
    { energyEfficiency: 0.02 },
    { isOrbital: true, isModular: true, requiresMoon: false, constructionTimeSec: 7200, costFactor: 1.3, canUpgrade: true },
    { canBeDestroyed: true, hasCrew: true, automatable: false, expandable: true, shieldable: false, salvageable: true },
    "Basic orbital habitation module providing pressurised living quarters.", "Houses station crew and transient military personnel.",
    "Crew capacity increases 50 per level. Required for any station with hasCrew = true.", "Efficiency bonus of 2% per level applies to all crew-operated modules.",
    [
      { name: "Pressurized Ring",   details: "Rotating habitat for artificial gravity",  description: "Reduces crew fatigue by 20%." },
      { name: "Recreation Deck",    details: "Morale-boosting entertainment facilities", description: "+5% crew efficiency per level." },
    ],
  ),
  makeStation(
    "lifeSupportRare",
    "Life Support Systems Base",
    "habitation", "life_support",
    "orbital", "fixed",
    "rare", "Gamma",
    15,
    { metal: 200000, crystal: 400000, deuterium: 100000 },
    { crewCapacity: 0, hp: 30000, energy: -500 },
    { energyEfficiency: 0.1 },
    { isOrbital: true, isModular: false, requiresMoon: false, requiresTech: "lifeSupportSystems", constructionTimeSec: 86400, costFactor: 1.6, canUpgrade: true },
    { canBeDestroyed: true, hasCrew: false, automatable: true, expandable: false, shieldable: true, salvageable: true },
    "Rare-class life support providing atmosphere processing for large stations.", "Recycles CO₂, purifies water, and maintains thermal regulation.",
    "Tier 15 enables biosphere domes for morale. Each level reduces energy consumption by 1%.", "This module is mandatory once crewCapacity exceeds 500 total across the station.",
    [
      { name: "Atmospheric Recycler", details: "Closed-loop CO₂ scrubbing",          description: "Supports 500 crew per level." },
      { name: "Thermal Regulation",   details: "Station-wide temperature management", description: "Prevents equipment thermal failure." },
    ],
  ),
];

// ── CATEGORY 9: Mining & Extraction ───────────────────────────────────────────

export const MINING_EXTRACTION_STATIONS: OrbitalStation[] = [
  makeStation(
    "orbitalMiningRare",
    "Orbital Mining Rig Station",
    "mining_extraction", "orbital_mining",
    "deep_space", "fixed",
    "rare", "Beta",
    12,
    { metal: 400000, crystal: 100000, deuterium: 50000 },
    { production: 2000, hp: 20000 },
    { critChance: 0.03, armorPenetration: 0 },
    { isOrbital: true, isModular: false, requiresMoon: false, constructionTimeSec: 129600, costFactor: 1.7, canUpgrade: true, zoneLock: "deep_space" },
    { canBeDestroyed: true, hasCrew: true, automatable: false, expandable: true, shieldable: false, salvageable: true },
    "Rare-class asteroid mining rig extracting minerals in deep space.", "Drills into asteroid bodies using plasma cutters and magnetic extractors.",
    "Production increases 5% per level. Tier 12 unlocks rare mineral extraction.", "Located in deep space requiring dedicated supply line infrastructure.",
    [
      { name: "Plasma Drill",          details: "High-temperature mineral extraction",    description: "Extracts core mineral veins." },
      { name: "Magnetic Collector",    details: "Captures ejected mineral particles",     description: "Zero-waste extraction process." },
    ],
  ),
  makeStation(
    "resourceProcEpic",
    "Resource Processing Bay Complex",
    "mining_extraction", "resource_processing",
    "orbital", "modular",
    "epic", "Delta",
    38,
    { metal: 1800000, crystal: 900000, deuterium: 400000 },
    { production: 15000, hp: 60000, energy: -2000 },
    { energyEfficiency: 0.15, buildSpeedBonus: 0.1 },
    { isOrbital: true, isModular: true, requiresMoon: false, requiresTech: "industrialProcessing", constructionTimeSec: 518400, costFactor: 1.9, canUpgrade: true },
    { canBeDestroyed: true, hasCrew: true, automatable: true, expandable: true, shieldable: true, salvageable: true },
    "Epic-class in-orbit resource refinery eliminating transport overhead.", "Processes raw ore directly in orbit, outputting refined metals and crystals.",
    "Production rate of 15,000 is top-tier for epic class. Tier 38 adds isotope separation.", "Automation level reduces crew requirements to maintenance staff only.",
    [
      { name: "Ore Smelter",          details: "High-pressure plasma smelting",          description: "Converts raw ore to pure metals." },
      { name: "Isotope Separator",    details: "Centrifugal isotope separation",         description: "Unlocked at Tier 38; produces exotic fuels." },
    ],
  ),
];

// ── CATEGORY 10: Trade & Commerce ─────────────────────────────────────────────

export const TRADE_COMMERCE_STATIONS: OrbitalStation[] = [
  makeStation(
    "marketHubCommon",
    "Market Hub Station",
    "trade_commerce", "market_hub",
    "orbital", "fixed",
    "common", "Alpha",
    1,
    { metal: 25000, crystal: 25000, deuterium: 0 },
    { capacity: 100000, hp: 4000 },
    { tradeBonus: 0.05 },
    { isOrbital: true, isModular: false, requiresMoon: false, constructionTimeSec: 7200, costFactor: 1.4, canUpgrade: true },
    { canBeDestroyed: true, hasCrew: true, automatable: false, expandable: false, shieldable: false, salvageable: true },
    "Common orbital market for basic commodity trading.", "Facilitates buy/sell operations for metal, crystal, and deuterium.",
    "Trade bonus of 5% reduces all transaction fees. Tier 1 enables market orders.", "Capacity limits the total daily trade volume.",
    [
      { name: "Commodity Exchange",   details: "Standard market for raw resources",    description: "5% fee reduction per level." },
      { name: "Price Board",          details: "Real-time pricing from sector data",   description: "Displays market trends within 10 AU." },
    ],
  ),
  makeStation(
    "tradeTermLeg",
    "Trade Route Terminal Fortress",
    "trade_commerce", "trade_terminal",
    "orbital", "modular",
    "legendary", "Epsilon",
    55,
    { metal: 5000000, crystal: 5000000, deuterium: 1000000 },
    { capacity: 1000000000, hp: 300000 },
    { tradeBonus: 0.8, diplomaticInfluence: 40 },
    { isOrbital: true, isModular: true, requiresMoon: false, requiresTech: "interstellarTrade", constructionTimeSec: 2592000, costFactor: 2.2, canUpgrade: true },
    { canBeDestroyed: true, hasCrew: true, automatable: true, expandable: true, shieldable: true, salvageable: true },
    "Legendary-class inter-system trade terminal managing galactic commerce routes.", "Coordinates freight, diplomacy, and market-making across star systems.",
    "Trade bonus of 80% is the maximum for legendary class. Tier 55 unlocks futures trading.", "Diplomatic influence bonus improves economic treaty terms.",
    [
      { name: "Futures Exchange",      details: "Forward contracts on commodities",     description: "Locks in prices for 100-turn contracts." },
      { name: "Diplomatic Market",     details: "Special trade terms for allied factions", description: "Grants preferred-nation status bonuses." },
    ],
  ),
];

// ── CATEGORY 11: Military Operations ─────────────────────────────────────────

export const MILITARY_OPERATIONS_STATIONS: OrbitalStation[] = [
  makeStation(
    "infantryGarrUncommon",
    "Infantry Garrison Station",
    "military_operations", "infantry_garrison",
    "orbital", "fixed",
    "uncommon", "Beta",
    6,
    { metal: 60000, crystal: 20000, deuterium: 10000 },
    { defense: 500, hp: 15000, crewCapacity: 2000 },
    { critChance: 0.04 },
    { isOrbital: true, isModular: false, requiresMoon: false, constructionTimeSec: 18000, costFactor: 1.5, canUpgrade: true },
    { canBeDestroyed: true, hasCrew: true, automatable: false, expandable: true, shieldable: true, salvageable: true },
    "Orbital garrison housing assault troops for rapid planetary insertion.", "Trooper pods deploy from orbit during planetary assault operations.",
    "Crew capacity represents billeted troops. Tier 6 enables marine specialist training.", "Defense rating improves as garrison fortifications are upgraded.",
    [
      { name: "Assault Pod Bay",       details: "Orbital drop-pod launch facility",       description: "Deploys 100 marines per launch event." },
      { name: "Marine Barracks",       details: "Permanent quarters for assault troops",  description: "+50 troop capacity per level." },
    ],
  ),
  makeStation(
    "mechDivEpic",
    "Mechanized Division Bay Complex",
    "military_operations", "mechanized_division",
    "orbital", "anchored",
    "epic", "Delta",
    42,
    { metal: 2500000, crystal: 1000000, deuterium: 500000 },
    { defense: 15000, hp: 80000, crewCapacity: 500 },
    { critChance: 0.06, armorPenetration: 0.25 },
    { isOrbital: true, isModular: true, requiresMoon: true, requiresTech: "advancedArmor", constructionTimeSec: 777600, costFactor: 2.0, canUpgrade: true },
    { canBeDestroyed: true, hasCrew: true, automatable: false, expandable: true, shieldable: true, salvageable: true },
    "Epic-class armored vehicle staging bay for orbital mechanized operations.", "Houses walkers, tanks, and mechs awaiting planetary insertion.",
    "Tier 42 unlocks titan-class mech deployment. Armor penetration sub-stat is a significant combat bonus.", "Moon anchor required for structural stability of heavy vehicle hangars.",
    [
      { name: "Vehicle Hangar",        details: "Pressurized vehicle storage bays",      description: "Holds 50 vehicles per hangar level." },
      { name: "Titan Bay",             details: "Oversized berths for titan mechs",       description: "Unlocked at Tier 42." },
    ],
  ),
];

// ── CATEGORY 12: Shipyard Operations ─────────────────────────────────────────

export const SHIPYARD_OPERATIONS_STATIONS: OrbitalStation[] = [
  makeStation(
    "lightShipyardRare",
    "Light Vessel Shipyard Base",
    "shipyard_operations", "light_vessel_shipyard",
    "orbital", "fixed",
    "rare", "Gamma",
    18,
    { metal: 500000, crystal: 200000, deuterium: 80000 },
    { production: 5000, hp: 40000 },
    { buildSpeedBonus: 0.25 },
    { isOrbital: true, isModular: false, requiresMoon: false, requiresTech: "orbitalConstruction", constructionTimeSec: 172800, costFactor: 1.8, canUpgrade: true },
    { canBeDestroyed: true, hasCrew: true, automatable: false, expandable: true, shieldable: true, salvageable: true },
    "Rare-class orbital shipyard specializing in fighter and frigate construction.", "Operates 24/7 in zero-gravity for uninterrupted hull assembly.",
    "Build speed bonus of 25% applies to light vessel queue. Tier 18 unlocks cruiser hull production.", "Production rate of 5,000 supports multi-ship simultaneous construction.",
    [
      { name: "Slipway Complex",       details: "Parallel construction slipways",        description: "Three ships built simultaneously." },
      { name: "Cruiser Module",        details: "Expanded facilities for cruiser class",  description: "Unlocked at Tier 18." },
    ],
  ),
  makeStation(
    "capitalDrydockLeg",
    "Capital Ship Drydock Fortress",
    "shipyard_operations", "capital_ship_drydock",
    "orbital", "anchored",
    "legendary", "Omega",
    75,
    { metal: 15000000, crystal: 10000000, deuterium: 5000000 },
    { production: 100000, hp: 800000 },
    { buildSpeedBonus: 0.7 },
    { isOrbital: true, isModular: true, requiresMoon: true, requiresTech: "capitalShipEngineering", constructionTimeSec: 15552000, costFactor: 2.8, canUpgrade: true, maxInstances: 3 },
    { canBeDestroyed: false, hasCrew: true, automatable: true, expandable: true, shieldable: true, salvageable: false },
    "Legendary capital drydock constructing the largest warships in the empire.", "Multi-kilometre structure accommodating dreadnoughts and orbital fortresses.",
    "Build speed bonus of 70% enables rapid capital fleet construction. Tier 75 adds titan-class keel slips.", "Up to 3 drydocks may be operated per empire to support maximum fleet production.",
    [
      { name: "Dreadnought Keel Slip", details: "Dedicated dreadnought hull frame",     description: "-40% build time for dreadnoughts." },
      { name: "Titan-Class Bay",       details: "Oversized bay for titans",             description: "Unlocked at Tier 75." },
      { name: "AI Weld Swarms",        details: "Nanobot welding and finishing",        description: "+10% quality on all hulls." },
    ],
  ),
];

// ── CATEGORY 13: Intelligence ─────────────────────────────────────────────────

export const INTELLIGENCE_STATIONS: OrbitalStation[] = [
  makeStation(
    "spyNetEpic",
    "Spy Network Center Complex",
    "intelligence", "spy_network",
    "orbital", "fixed",
    "epic", "Epsilon",
    30,
    { metal: 800000, crystal: 1200000, deuterium: 300000 },
    { range: 5000, hp: 30000 },
    { scanRange: 3000, diplomaticInfluence: 15 },
    { isOrbital: true, isModular: false, requiresMoon: false, requiresTech: "intelligenceOps", constructionTimeSec: 345600, costFactor: 1.9, canUpgrade: true, maxInstances: 1 },
    { canBeDestroyed: true, hasCrew: true, automatable: false, expandable: false, shieldable: true, salvageable: false },
    "Epic-class covert intelligence hub coordinating spy assets across the sector.", "Manages deep-cover agents, signal interception, and counter-espionage.",
    "Scan range of 3,000 AU enables long-range intelligence gathering. Tier 30 unlocks double-agent operations.", "Only one spy network center per empire to prevent power duplication.",
    [
      { name: "Deep Cover Assets",    details: "Agents embedded in enemy governments",  description: "Provides diplomatic intelligence feeds." },
      { name: "Signal Intercept",     details: "SIGINT arrays capturing transmissions", description: "+15% intel quality per level." },
      { name: "Counter-Intel Wing",   details: "Defensive counter-espionage division",  description: "Reduces enemy spy success by 20%." },
    ],
  ),
];

// ── CATEGORY 14: Diplomacy ────────────────────────────────────────────────────

export const DIPLOMACY_STATIONS: OrbitalStation[] = [
  makeStation(
    "embassyRare",
    "Embassy Complex Base",
    "diplomacy", "embassy_complex",
    "orbital", "modular",
    "rare", "Gamma",
    22,
    { metal: 400000, crystal: 600000, deuterium: 150000 },
    { hp: 20000, crewCapacity: 100 },
    { diplomaticInfluence: 30, tradeBonus: 0.1 },
    { isOrbital: true, isModular: true, requiresMoon: false, requiresTech: "diplomaticCorps", constructionTimeSec: 259200, costFactor: 1.6, canUpgrade: true },
    { canBeDestroyed: true, hasCrew: true, automatable: false, expandable: true, shieldable: false, salvageable: true },
    "Rare-class orbital embassy providing formal diplomatic representation.", "Hosts alien delegations and facilitates treaty negotiations.",
    "Diplomatic influence of 30 improves all treaty terms by base 15%. Tier 22 unlocks non-aggression protocols.", "Trade bonus of 10% applies to commerce conducted through allied factions.",
    [
      { name: "Delegate Quarters",    details: "Secure housing for alien diplomats",    description: "Improves faction relations by 5 per level." },
      { name: "Treaty Archive",       details: "Repository of all signed agreements",   description: "Prevents accidental treaty violations." },
    ],
  ),
];

// ── CATEGORY 15: Terraforming ─────────────────────────────────────────────────

export const TERRAFORMING_STATIONS: OrbitalStation[] = [
  makeStation(
    "atmProcEpic",
    "Atmospheric Processor Complex",
    "terraforming", "atmospheric_processor",
    "orbital", "ring_segment",
    "epic", "Delta",
    50,
    { metal: 5000000, crystal: 3000000, deuterium: 10000000 },
    { production: 0, hp: 150000, energy: -10000 },
    { energyEfficiency: 0.1 },
    { isOrbital: true, isModular: true, requiresMoon: false, requiresTech: "terraformingTech", constructionTimeSec: 1296000, costFactor: 2.1, canUpgrade: true, maxInstances: 2 },
    { canBeDestroyed: true, hasCrew: true, automatable: true, expandable: false, shieldable: true, salvageable: false },
    "Epic-class atmospheric processor seeding breathable atmosphere on target worlds.", "Releases precise gas mixtures calibrated to target planet biome specifications.",
    "Tier 50 enables dual-planet terraforming. Each level reduces terraforming project duration by 1%.", "High deuterium cost reflects the energy demands of planetary-scale gas injection.",
    [
      { name: "Gas Injection Array",   details: "Precision atmospheric gas seeding",   description: "Seeds target atmosphere with O₂/N₂ mixture." },
      { name: "Biome Calibrator",      details: "Biome-specific atmospheric tuning",   description: "Targets specific biome outcomes." },
    ],
  ),
];

// ── CATEGORY 16: Anomaly Research ─────────────────────────────────────────────

export const ANOMALY_RESEARCH_STATIONS: OrbitalStation[] = [
  makeStation(
    "voidResearchLeg",
    "Void Research Chamber Fortress",
    "anomaly_research", "void_research",
    "deep_space", "anchored",
    "legendary", "Zeta",
    68,
    { metal: 7000000, crystal: 10000000, deuterium: 4000000 },
    { hp: 200000, production: 1000, energy: -5000 },
    { researchBonus: 0.5, scanRange: 20000 },
    { isOrbital: true, isModular: false, requiresMoon: false, requiresTech: "voidScience", constructionTimeSec: 5184000, costFactor: 2.4, canUpgrade: true, maxInstances: 1, zoneLock: "deep_space" },
    { canBeDestroyed: false, hasCrew: true, automatable: false, expandable: false, shieldable: true, salvageable: false },
    "Legendary void research chamber studying spatial rifts and null-space phenomena.", "Positioned in deep space to avoid gravitational interference with experiments.",
    "Research bonus of 50% accelerates exotic science research branches only. Tier 68 enables wormhole mapping.", "Scan range of 20,000 AU detects void signatures at extreme distances.",
    [
      { name: "Rift Analyser",         details: "Instruments for null-space measurement", description: "Maps void rift formation patterns." },
      { name: "Wormhole Mapper",        details: "Charts stable wormhole entry points",    description: "Unlocked at Tier 68." },
    ],
  ),
  makeStation(
    "artifactLabMythic",
    "Artifact Analysis Laboratory Nexus",
    "anomaly_research", "artifact_analysis",
    "orbital", "modular",
    "mythic", "Omega",
    88,
    { metal: 20000000, crystal: 30000000, deuterium: 8000000 },
    { hp: 600000, production: 5000, energy: -8000 },
    { researchBonus: 0.9, buildSpeedBonus: 0.3 },
    { isOrbital: true, isModular: true, requiresMoon: true, requiresTech: "xenoArchaeology", constructionTimeSec: 25920000, costFactor: 2.9, canUpgrade: true, maxInstances: 1 },
    { canBeDestroyed: false, hasCrew: true, automatable: false, expandable: true, shieldable: true, salvageable: false },
    "Mythic artifact analysis nexus reverse-engineering ancient alien technology.", "Houses every known alien relic for deconstruction and knowledge extraction.",
    "Research bonus of 90% accelerates alien technology research only. Tier 88 enables tech replication.", "Build speed bonus of 30% applies when constructing research-derived technology.",
    [
      { name: "Deconstruction Chamber", details: "Safe disassembly of volatile artifacts", description: "Recovers 80% of artifact data." },
      { name: "Tech Replicator",        details: "Reproduces alien component schematics",  description: "Unlocked at Tier 88." },
      { name: "Alien Archive",          details: "Living database of alien civilisations", description: "+5% diplomatic influence vs. known factions." },
    ],
  ),
];

// ── CATEGORY 17: Medical ───────────────────────────────────────────────────────

export const MEDICAL_STATIONS: OrbitalStation[] = [
  makeStation(
    "medBayRare",
    "Medical Bay Complex Base",
    "medical", "medical_bay",
    "orbital", "modular",
    "rare", "Beta",
    14,
    { metal: 250000, crystal: 500000, deuterium: 80000 },
    { hp: 18000, crewCapacity: 500 },
    { energyEfficiency: 0.05 },
    { isOrbital: true, isModular: true, requiresMoon: false, requiresTech: "advancedMedicine", constructionTimeSec: 86400, costFactor: 1.6, canUpgrade: true },
    { canBeDestroyed: true, hasCrew: true, automatable: false, expandable: true, shieldable: false, salvageable: true },
    "Rare-class orbital medical bay providing full surgical and recovery facilities.", "Handles mass-casualty events from combat operations and accidents.",
    "Crew capacity represents patient beds. Tier 14 enables combat stasis pods.", "Efficiency bonus applies to crew-operated modules as morale improves from medical access.",
    [
      { name: "Surgical Suite",        details: "Zero-G microsurgery facilities",        description: "95% survival rate for critical injuries." },
      { name: "Combat Stasis Pods",    details: "Cryogenic preservation for casualties", description: "Unlocked at Tier 14." },
      { name: "Biotech Lab",           details: "Medical research and augmentation",     description: "+2% crew combat efficiency per level." },
    ],
  ),
];

// ── CATEGORY 18: Megastructure Support ────────────────────────────────────────

export const MEGASTRUCTURE_SUPPORT_STATIONS: OrbitalStation[] = [
  makeStation(
    "constructSupportEpic",
    "Construction Support Ring Complex",
    "megastructure_support", "construction_support",
    "orbital", "ring_segment",
    "epic", "Delta",
    55,
    { metal: 10000000, crystal: 5000000, deuterium: 2000000 },
    { production: 30000, hp: 400000, crewCapacity: 3000 },
    { buildSpeedBonus: 0.4, energyEfficiency: 0.2 },
    { isOrbital: true, isModular: true, requiresMoon: true, requiresTech: "megastructureEngineering", constructionTimeSec: 5184000, costFactor: 2.2, canUpgrade: true },
    { canBeDestroyed: false, hasCrew: true, automatable: true, expandable: false, shieldable: true, salvageable: false },
    "Epic-class ring-segment construction platform enabling megastructure assembly.", "Orbits the megastructure construction site providing materials and workforce.",
    "Build speed bonus of 40% applies to all megastructure projects. Tier 55 enables dyson sphere segments.", "Production of 30,000 covers the material flow demands of a partial megastructure.",
    [
      { name: "Construction Lattice",  details: "Nano-scale assembly framework",         description: "Allows precision segment placement." },
      { name: "Dyson Ring Module",     details: "Specialized dyson sphere construction", description: "Unlocked at Tier 55." },
    ],
  ),
  makeStation(
    "megaPowerRelayMythic",
    "Megastructure Power Relay Nexus",
    "megastructure_support", "megastructure_power_relay",
    "orbital", "ring_segment",
    "mythic", "Omega",
    95,
    { metal: 50000000, crystal: 30000000, deuterium: 20000000 },
    { powerOutput: 1000000, hp: 2000000, energy: 100000 },
    { energyEfficiency: 0.8, shieldRecharge: 50000 },
    { isOrbital: true, isModular: true, requiresMoon: true, requiresTech: "dysonSphereEngineering", constructionTimeSec: 94608000, costFactor: 3.5, canUpgrade: true, maxInstances: 1 },
    { canBeDestroyed: false, hasCrew: false, automatable: true, expandable: false, shieldable: true, salvageable: false },
    "The ultimate power relay for megastructure energy distribution at civilisation scale.", "Channels terawatt-scale power from a Dyson sphere to the empire's infrastructure grid.",
    "Power output of 1,000,000 units supplies an entire empire's energy needs. Tier 95 is the second-highest tier in existence.", "Energy efficiency of 80% represents near-perfect power transmission.",
    [
      { name: "Dyson Tap Array",       details: "Direct energy harvest from Dyson sphere", description: "Terawatt-level power extraction." },
      { name: "Empire Power Grid",     details: "Empire-wide energy distribution mesh",    description: "Eliminates all energy shortages." },
      { name: "Transcendent Core",     details: "Exotic matter power channelling",         description: "Enables post-scarcity energy for the entire empire." },
    ],
  ),
];

// ─────────────────────────────────────────────────────────────────────────────
// CONSOLIDATED EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

export const ALL_ORBITAL_STATIONS: OrbitalStation[] = [
  ...COMMAND_CONTROL_STATIONS,
  ...ENERGY_SYSTEMS_STATIONS,
  ...DEFENSE_SYSTEMS_STATIONS,
  ...MANUFACTURING_STATIONS,
  ...RESEARCH_DEVELOPMENT_STATIONS,
  ...LOGISTICS_SUPPLY_STATIONS,
  ...COMMUNICATIONS_STATIONS,
  ...HABITATION_STATIONS,
  ...MINING_EXTRACTION_STATIONS,
  ...TRADE_COMMERCE_STATIONS,
  ...MILITARY_OPERATIONS_STATIONS,
  ...SHIPYARD_OPERATIONS_STATIONS,
  ...INTELLIGENCE_STATIONS,
  ...DIPLOMACY_STATIONS,
  ...TERRAFORMING_STATIONS,
  ...ANOMALY_RESEARCH_STATIONS,
  ...MEDICAL_STATIONS,
  ...MEGASTRUCTURE_SUPPORT_STATIONS,
];

// ─────────────────────────────────────────────────────────────────────────────
// HELPER FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

export function getOrbitalStationsByCategory(category: OrbitalStationCategory): OrbitalStation[] {
  return ALL_ORBITAL_STATIONS.filter(s => s.category === category);
}

export function getOrbitalStationsBySubCategory(subCategory: OrbitalStationSubCategory): OrbitalStation[] {
  return ALL_ORBITAL_STATIONS.filter(s => s.subCategory === subCategory);
}

export function getOrbitalStationsByClass(stationClass: OrbitalStationClass): OrbitalStation[] {
  return ALL_ORBITAL_STATIONS.filter(s => s.class === stationClass);
}

export function getOrbitalStationsByType(type: OrbitalStationType): OrbitalStation[] {
  return ALL_ORBITAL_STATIONS.filter(s => s.type === type);
}

export function getOrbitalStationsByTierRange(minTier: number, maxTier: number): OrbitalStation[] {
  return ALL_ORBITAL_STATIONS.filter(s => s.tier >= minTier && s.tier <= maxTier);
}

export function getCategoryMeta(category: OrbitalStationCategory): OrbitalCategoryMeta | undefined {
  return ORBITAL_STATION_CATEGORIES.find(c => c.id === category);
}

// Summary statistics
export const ORBITAL_STATION_STATS = {
  totalStations: ALL_ORBITAL_STATIONS.length,
  totalCategories: ORBITAL_STATION_CATEGORIES.length,
  totalSubCategories: ORBITAL_STATION_CATEGORIES.reduce((acc, c) => acc + c.subCategories.length, 0),
  maxTier: 99,
  maxLevel: 999,
  byCategory: Object.fromEntries(
    ORBITAL_STATION_CATEGORIES.map(c => [c.id, getOrbitalStationsByCategory(c.id).length])
  ) as Record<OrbitalStationCategory, number>,
  byClass: {
    common: getOrbitalStationsByClass("common").length,
    uncommon: getOrbitalStationsByClass("uncommon").length,
    rare: getOrbitalStationsByClass("rare").length,
    epic: getOrbitalStationsByClass("epic").length,
    legendary: getOrbitalStationsByClass("legendary").length,
    mythic: getOrbitalStationsByClass("mythic").length,
    transcendent: getOrbitalStationsByClass("transcendent").length,
  },
};
