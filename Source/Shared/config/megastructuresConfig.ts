/**
 * Megastructures System with 999 Levels, 99 Tiers, and Advanced Stats
 * Comprehensive mega-scale construction systems across the galaxy
 * @tag #megastructures #construction #stats #defense #offense
 */

import type { ProgressionStats } from './progressionSystemConfig';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

const INFRASTRUCTURE_TYPE_FAMILIES = [
  { id: 'habitat-ring', name: 'Habitat Ring', description: 'High-capacity orbital habitation lattices' },
  { id: 'energy-spire', name: 'Energy Spire', description: 'Multi-star power relay and storage pillars' },
  { id: 'logistics-hub', name: 'Logistics Hub', description: 'Interstellar freight and routing complexes' },
  { id: 'terraform-array', name: 'Terraform Array', description: 'Planetary climate and biosphere stabilization grids' },
  { id: 'starlift-anchor', name: 'Starlift Anchor', description: 'Massive gravity-coupled launch/arrival anchors' },
  { id: 'quantum-grid', name: 'Quantum Grid', description: 'Entangled infrastructure coordination backbone' },
  { id: 'orbital-arcology', name: 'Orbital Arcology', description: 'Self-contained population and industry megacities' },
  { id: 'stellar-harvester', name: 'Stellar Harvester', description: 'Distributed stellar flux collection super-networks' },
  { id: 'void-refinery', name: 'Void Refinery', description: 'Deep-space extraction and resource conversion yards' },
  { id: 'transit-lattice', name: 'Transit Lattice', description: 'Long-range civilization-scale mobility corridors' },
] as const;

const INFRASTRUCTURE_SUBTYPE_VARIANTS = [
  { id: 'alpha', label: 'Alpha', subClass: 'support' as const, size: 'huge' as const },
  { id: 'beta', label: 'Beta', subClass: 'hybrid' as const, size: 'massive' as const },
  { id: 'gamma', label: 'Gamma', subClass: 'terraforming' as const, size: 'planetary' as const },
  { id: 'delta', label: 'Delta', subClass: 'defensive' as const, size: 'colossal' as const },
  { id: 'epsilon', label: 'Epsilon', subClass: 'support' as const, size: 'solar' as const },
  { id: 'zeta', label: 'Zeta', subClass: 'hybrid' as const, size: 'massive' as const },
  { id: 'eta', label: 'Eta', subClass: 'experimental' as const, size: 'planetary' as const },
  { id: 'theta', label: 'Theta', subClass: 'dimensional' as const, size: 'solar' as const },
  { id: 'iota', label: 'Iota', subClass: 'support' as const, size: 'galactic' as const },
] as const;

type InfrastructureTypeFamilyId = (typeof INFRASTRUCTURE_TYPE_FAMILIES)[number]['id'];
type InfrastructureSubtypeId = (typeof INFRASTRUCTURE_SUBTYPE_VARIANTS)[number]['id'];
type InfrastructureGeneratedType = `infra-${InfrastructureTypeFamilyId}-${InfrastructureSubtypeId}`;

export type MegastructureType = 
  | 'dyson-sphere' 
  | 'ringworld' 
  | 'megaforge' 
  | 'research-nexus' 
  | 'orbital-defense'
  | 'generation-ship'
  | 'matter-converter'
  | 'dimensional-gate'
  | 'stellar-engine'
  | 'nova-cannon'
  | InfrastructureGeneratedType;

// ============================================================================
// 18 CATEGORIES (MegastructureClass)
// ============================================================================

export type MegastructureClass = 
  | 'superweapon' 
  | 'infrastructure' 
  | 'research' 
  | 'production' 
  | 'defense' 
  | 'mobility' 
  | 'exotic'
  | 'civilization'
  | 'economic'
  | 'diplomatic'
  | 'exploration'
  | 'colonization'
  | 'communication'
  | 'surveillance'
  | 'terraforming'
  | 'ecological'
  | 'temporal'
  | 'dimensional-forge';

// ============================================================================
// 32 SUB-CATEGORIES (MegastructureSubCategory)
// ============================================================================

export type MegastructureSubCategory =
  // Infrastructure (3)
  | 'habitat-construction'
  | 'energy-grid'
  | 'transit-network'
  // Production (3)
  | 'factory-complex'
  | 'matter-fabrication'
  | 'resource-extraction'
  // Research (3)
  | 'scientific-array'
  | 'computation-matrix'
  | 'quantum-laboratory'
  // Defense (2)
  | 'planetary-fortress'
  | 'orbital-shield'
  // Mobility (2)
  | 'ftl-drive'
  | 'starlift-system'
  // Exotic (2)
  | 'dimensional-rift'
  | 'reality-anchor'
  // Superweapon (2)
  | 'stellar-weapon'
  | 'planetary-annihilator'
  // Civilization (2)
  | 'culture-nexus'
  | 'population-center'
  // Economic (2)
  | 'trade-exchange'
  | 'market-nexus'
  // Diplomatic (2)
  | 'diplomatic-station'
  | 'peace-beacon'
  // Exploration (1)
  | 'survey-array'
  // Colonization (2)
  | 'relay-network'
  | 'settlement-complex'
  // Communication (1)
  | 'broadcast-tower'
  // Surveillance (1)
  | 'sensor-array'
  // Terraforming (1)
  | 'terraforming-engine'
  // Ecological (1)
  | 'biome-reconstructor'
  // Temporal (1)
  | 'temporal-observatory'
  // Dimensional-forge (1)
  | 'forge-nexus';

// ============================================================================
// TIER CLASS & SUB-CLASS (1-99 Tiers)
// ============================================================================

export type MegastructureTierClass =
  | 'Alpha'    // Tiers  1-11
  | 'Beta'     // Tiers 12-22
  | 'Gamma'    // Tiers 23-33
  | 'Delta'    // Tiers 34-44
  | 'Epsilon'  // Tiers 45-55
  | 'Zeta'     // Tiers 56-66
  | 'Eta'      // Tiers 67-77
  | 'Theta'    // Tiers 78-88
  | 'Omega';   // Tiers 89-99

export type MegastructureTierSubClass =
  | 'Prime'     // Position 0 (first in each 11-tier band)
  | 'Minor'     // Position 1
  | 'Major'     // Position 2
  | 'Superior'  // Position 3
  | 'Apex'      // Position 4 and 9 within the 11-tier cycle
  | 'Ascendant' // Position 10 (last in each 11-tier band)
  | 'Void';     // Tier 99 only — pinnacle designation

export const MEGASTRUCTURE_CATEGORY_METADATA: Record<MegastructureClass, { label: string; description: string; order: number; subCategories: MegastructureSubCategory[] }> = {
  infrastructure: {
    label: 'Infrastructure',
    description: 'Large-scale energy and habitat backbone systems',
    order: 1,
    subCategories: ['habitat-construction', 'energy-grid', 'transit-network'],
  },
  production: {
    label: 'Production',
    description: 'Industrial-scale fabrication and conversion systems',
    order: 2,
    subCategories: ['factory-complex', 'matter-fabrication', 'resource-extraction'],
  },
  research: {
    label: 'Research',
    description: 'Scientific acceleration and advanced discovery systems',
    order: 3,
    subCategories: ['scientific-array', 'computation-matrix', 'quantum-laboratory'],
  },
  defense: {
    label: 'Defense',
    description: 'Fortification, shielding, and planetary protection',
    order: 4,
    subCategories: ['planetary-fortress', 'orbital-shield'],
  },
  mobility: {
    label: 'Mobility',
    description: 'Interstellar transit and stellar movement systems',
    order: 5,
    subCategories: ['ftl-drive', 'starlift-system'],
  },
  exotic: {
    label: 'Exotic',
    description: 'Dimensional and non-standard physics structures',
    order: 6,
    subCategories: ['dimensional-rift', 'reality-anchor'],
  },
  superweapon: {
    label: 'Superweapon',
    description: 'Strategic-scale offensive megastructures',
    order: 7,
    subCategories: ['stellar-weapon', 'planetary-annihilator'],
  },
  civilization: {
    label: 'Civilization',
    description: 'Culture, governance, and population administration megastructures',
    order: 8,
    subCategories: ['culture-nexus', 'population-center'],
  },
  economic: {
    label: 'Economic',
    description: 'Galactic-scale commerce, trade, and resource market systems',
    order: 9,
    subCategories: ['trade-exchange', 'market-nexus'],
  },
  diplomatic: {
    label: 'Diplomatic',
    description: 'Inter-faction diplomacy, treaties, and peace-keeping structures',
    order: 10,
    subCategories: ['diplomatic-station', 'peace-beacon'],
  },
  exploration: {
    label: 'Exploration',
    description: 'Deep-space surveying, scouting, and frontier expansion platforms',
    order: 11,
    subCategories: ['survey-array'],
  },
  colonization: {
    label: 'Colonization',
    description: 'Mass settlement infrastructure and planetary seeding platforms',
    order: 12,
    subCategories: ['relay-network', 'settlement-complex'],
  },
  communication: {
    label: 'Communication',
    description: 'Interstellar broadcast, relay, and data-link infrastructure',
    order: 13,
    subCategories: ['broadcast-tower'],
  },
  surveillance: {
    label: 'Surveillance',
    description: 'Galaxy-wide sensor grids and intelligence-gathering platforms',
    order: 14,
    subCategories: ['sensor-array'],
  },
  terraforming: {
    label: 'Terraforming',
    description: 'Climate engineering and planetary transformation systems',
    order: 15,
    subCategories: ['terraforming-engine'],
  },
  ecological: {
    label: 'Ecological',
    description: 'Biosphere reconstruction, ecosystem preservation, and life-seeding structures',
    order: 16,
    subCategories: ['biome-reconstructor'],
  },
  temporal: {
    label: 'Temporal',
    description: 'Chrono-observation platforms and time-dilation field generators',
    order: 17,
    subCategories: ['temporal-observatory'],
  },
  'dimensional-forge': {
    label: 'Dimensional Forge',
    description: 'Reality-shaping fabrication cores that bridge multiple dimensions',
    order: 18,
    subCategories: ['forge-nexus'],
  },
};

export type MegastructureSubClass = 
  | 'offensive' 
  | 'defensive' 
  | 'support' 
  | 'hybrid' 
  | 'experimental' 
  | 'terraforming' 
  | 'dimensional';

export interface OffensiveStats {
  firepower: number;
  accuracy: number;
  range: number;
  rateOfFire: number;
  ammoCapacity: number;
  penetration: number;
  criticalChance: number;
  damageType: string; // 'kinetic', 'energy', 'exotic', 'dimensional'
}

export interface DefensiveStats {
  armorStrength: number;
  shieldCapacity: number;
  shieldRegeneration: number;
  evasion: number;
  damageReduction: number;
  reflectionChance: number;
  repairRate: number;
  selfHealingCapacity: number;
}

export interface MegastructureAttributes {
  // Power & Energy
  powerGeneration: number;
  powerConsumption: number;
  energyStorage: number;
  efficiency: number;
  
  // Production
  productionRate: number;
  craftingSpeed: number;
  resourceProcessing: number;
  
  // Computational
  computingPower: number;
  dataProcessing: number;
  aiCapability: number;
  
  // Exotic
  dimensionalResonance: number;
  realityStability: number;
  quantumPotential: number;
}

// ============================================================================
// SUB-ATTRIBUTES (detailed attribute breakdowns)
// ============================================================================

export interface MegastructureSubAttributes {
  // Power Sub-Attributes
  powerSurgeCapacity: number;
  overloadThreshold: number;
  heatDissipationRate: number;

  // Production Sub-Attributes
  batchSize: number;
  outputVariance: number;
  wasteRecyclingRate: number;

  // Computational Sub-Attributes
  parallelProcessingThreads: number;
  errorCorrectionRate: number;
  memoryBandwidth: number;

  // Exotic Sub-Attributes
  anomalyResistance: number;
  warpFieldDensity: number;
  phaseShiftStability: number;
}

// ============================================================================
// SUB-STATS (granular stat breakdowns)
// ============================================================================

export interface MegastructureSubStats {
  // Power Sub-Stats
  thrustPower: number;
  radiationOutput: number;
  solarHarvestRate: number;

  // Defense Sub-Stats
  hullIntegrity: number;
  barrierResonance: number;
  redundancyIndex: number;

  // Operational Sub-Stats
  automationLevel: number;
  synchronizationRate: number;
  adaptability: number;

  // Special Sub-Stats
  phaseCoherence: number;
  gravimetricPotential: number;
  neuralNetworkBandwidth: number;
}

// ============================================================================
// SUBJECTS (subject taxonomy per megastructure)
// ============================================================================

export type MegastructureSubjectDomain =
  | 'strategic'
  | 'economic'
  | 'scientific'
  | 'civilizational'
  | 'military'
  | 'ecological'
  | 'temporal'
  | 'diplomatic';

export interface MegastructureSubject {
  id: string;
  name: string;
  domain: MegastructureSubjectDomain;
  description: string;
  subjectDetails: string;
  relevanceScore: number; // 0-100
}

// ============================================================================
// RANKS & TITLES (1-99 tier ranks, 1-999 level titles)
// ============================================================================

export type MegastructureRank =
  | 'Pioneer'      // Tiers  1-10
  | 'Apprentice'   // Tiers 11-20
  | 'Journeyman'   // Tiers 21-30
  | 'Adept'        // Tiers 31-40
  | 'Expert'       // Tiers 41-50
  | 'Master'       // Tiers 51-60
  | 'Grand Master' // Tiers 61-70
  | 'Archon'       // Tiers 71-80
  | 'Ascendant'    // Tiers 81-90
  | 'Transcendent' // Tiers 91-99
  | 'Mythic';      // Tier  99 apex only

/** 99 tier-specific titles, one per tier level. */
export const MEGASTRUCTURE_TIER_TITLES: Record<number, string> = {
  1: 'Novice Constructor',       2: 'Apprentice Builder',
  3: 'Basic Engineer',           4: 'Junior Architect',
  5: 'Standard Operator',        6: 'Skilled Technician',
  7: 'Proficient Overseer',      8: 'Competent Director',
  9: 'Advanced Manager',        10: 'Senior Coordinator',
  11: 'Lead Engineer',           12: 'Chief Technician',
  13: 'Expert Builder',          14: 'Master Planner',
  15: 'Senior Architect',        16: 'Grand Engineer',
  17: 'Elite Director',          18: 'Prime Overseer',
  19: 'Superior Commander',      20: 'Executive Builder',
  21: 'High Architect',          22: 'Sovereign Planner',
  23: 'Supreme Technician',      24: 'Imperial Engineer',
  25: 'Celestial Constructor',   26: 'Cosmic Architect',
  27: 'Stellar Planner',         28: 'Galactic Overseer',
  29: 'Universal Director',      30: 'Infinite Commander',
  31: 'Quantum Architect',       32: 'Temporal Engineer',
  33: 'Void Constructor',        34: 'Singularity Planner',
  35: 'Nexus Overseer',          36: 'Core Director',
  37: 'Apex Builder',            38: 'Zenith Architect',
  39: 'Pinnacle Engineer',       40: 'Summit Commander',
  41: 'Transcendent Overseer',   42: 'Ascendant Planner',
  43: 'Ethereal Architect',      44: 'Divine Engineer',
  45: 'Celestial Core Builder',  46: 'Astral Constructor',
  47: 'Cosmic Core Planner',     48: 'Universal Architect',
  49: 'Infinite Engineer',       50: 'Eternal Overseer',
  51: 'Mythic Constructor',      52: 'Legendary Engineer',
  53: 'Immortal Architect',      54: 'Timeless Planner',
  55: 'Primordial Overseer',     56: 'Ancient Commander',
  57: 'Elder Architect',         58: 'Primal Engineer',
  59: 'Origin Constructor',      60: 'Genesis Planner',
  61: 'Creation Overseer',       62: 'Manifestation Director',
  63: 'Revelation Engineer',     64: 'Enlightenment Builder',
  65: 'Awakened Architect',      66: 'Awakened Planner',
  67: 'Ascended Engineer',       68: 'Ascended Overseer',
  69: 'Exalted Constructor',     70: 'Exalted Director',
  71: 'Sovereign Architect',     72: 'Sovereign Engineer',
  73: 'Imperial Overseer',       74: 'Imperial Builder',
  75: 'Galactic Core Planner',   76: 'Universal Core Director',
  77: 'Infinite Core Architect', 78: 'Eternal Core Engineer',
  79: 'Mythic Core Overseer',    80: 'Legendary Core Builder',
  81: 'Omnipotent Planner',      82: 'Omniscient Director',
  83: 'Omnipresent Architect',   84: 'Omniversal Engineer',
  85: 'Transcended Overseer',    86: 'Transcended Builder',
  87: 'Absolute Planner',        88: 'Absolute Director',
  89: 'Ultimate Architect',      90: 'Ultimate Engineer',
  91: 'Supreme Existence',       92: 'Beyond-Apex Builder',
  93: 'Void-Born Architect',     94: 'Reality-Forger',
  95: 'Cosmos-Shaper',           96: 'Dimension-Weaver',
  97: 'Eternity-Crafter',        98: 'Universe-Sculptor',
  99: 'The Infinite Architect',
};

// ============================================================================
// TIER CLASS & SUB-CLASS METADATA
// ============================================================================

export interface MegastructureTierClassMeta {
  tierClass: MegastructureTierClass;
  tierSubClass: MegastructureTierSubClass;
  tierRange: [number, number];
  rank: MegastructureRank;
  title: string;
  description: string;
  subDescription: string;
  powerMultiplierBonus: number; // additional stat multiplier at this class tier
}

export const MEGASTRUCTURE_TIER_CLASS_TABLE: MegastructureTierClassMeta[] = Array.from({ length: 99 }, (_, i) => {
  const tier = i + 1;

  // Tier class (9 bands of ~11) — derive max index from classes array length
  const classes: MegastructureTierClass[] = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta', 'Omega'];
  const classIndex = Math.min(classes.length - 1, Math.floor((tier - 1) / 11));
  const tierClass = classes[classIndex];

  // Tier sub-class: 11-position cycle (0-4: Prime/Minor/Major/Superior/Apex, 5-9: repeat, 10: Ascendant)
  const posInBand = (tier - 1) % 11;
  const BASE_SUB_CLASSES: MegastructureTierSubClass[] = ['Prime', 'Minor', 'Major', 'Superior', 'Apex'];
  const tierSubClass: MegastructureTierSubClass =
    tier === 99 ? 'Void'
    : posInBand === 10 ? 'Ascendant'
    : BASE_SUB_CLASSES[posInBand % BASE_SUB_CLASSES.length];

  // Rank
  const rankBands: Array<[number, MegastructureRank]> = [
    [10, 'Pioneer'], [20, 'Apprentice'], [30, 'Journeyman'], [40, 'Adept'],
    [50, 'Expert'], [60, 'Master'], [70, 'Grand Master'], [80, 'Archon'],
    [90, 'Ascendant'], [98, 'Transcendent'], [99, 'Mythic'],
  ];
  const rank = (rankBands.find(([max]) => tier <= max)?.[1] ?? 'Transcendent') as MegastructureRank;

  // Title from table (guaranteed defined for all 1-99)
  const title = MEGASTRUCTURE_TIER_TITLES[tier] ?? `Tier ${tier} Architect`;

  const tierRangeStart = classIndex * 11 + 1;
  const tierRangeEnd = Math.min(99, tierRangeStart + 10);

  return {
    tierClass,
    tierSubClass,
    tierRange: [tierRangeStart, tierRangeEnd],
    rank,
    title,
    description: `${tierClass} ${tierSubClass} classification — ${rank} rank megastructure tier ${tier}`,
    subDescription: `Tier ${tier} structures in the ${tierClass} class exhibit ${tierSubClass.toLowerCase()} specialization. They are designated ${rank} rank within the galactic hierarchy.`,
    powerMultiplierBonus: parseFloat((0.005 * (tier - 1)).toFixed(3)), // 0.000 at T1 → 0.490 at T99
  };
});

export interface MegastructureStats {
  // Base Stats
  power: number;
  efficiency: number;
  resilience: number;
  capacity: number;
  
  // Sub Stats
  precision: number;
  endurance: number;
  output: number;
  control: number;
  
  // Combat Stats
  offense: OffensiveStats;
  defense: DefensiveStats;
  
  // Attributes
  tech: number;
  command: number;
  logistics: number;
  survivability: number;

  // Extended Sub-Stats
  subStats?: MegastructureSubStats;
}

export interface MegastructureProgressionConfig {
  tiers: {
    max: number;
  };
  levels: {
    max: number;
  };
}

export interface Megastructure {
  id: string;
  name: string;
  type: MegastructureType;
  subType?: string;
  class: MegastructureClass;
  subClass: MegastructureSubClass;

  // Category & Sub-Category (18 categories, 32 sub-categories)
  category?: MegastructureClass;
  subCategory?: MegastructureSubCategory;

  description: string;
  subDescription?: string;
  lore: string;

  // Rank, Title & Tier Classification
  rank?: MegastructureRank;
  title?: string;
  tierClass?: MegastructureTierClass;
  tierSubClass?: MegastructureTierSubClass;

  // Subjects (subject taxonomy with domain + detail)
  subjects?: MegastructureSubject[];
  
  // Progression
  level: number;
  tier: number;
  experience: number;
  progressionConfig: MegastructureProgressionConfig;
  
  // Stats
  baseStats: MegastructureStats;
  currentStats: MegastructureStats;

  // Attributes & Sub-Attributes
  attributes?: MegastructureAttributes;
  subAttributes?: MegastructureSubAttributes;
  
  // Progression multipliers
  levelMultiplier: number;
  tierMultiplier: number;
  totalMultiplier: number;
  
  // Properties
  size: 'compact' | 'huge' | 'massive' | 'colossal' | 'planetary' | 'solar' | 'galactic';
  constructionTime: number; // in game turns
  completionPercentage: number;
  
  // Location
  coordinates: { x: number; y: number; z: number };
  sector: string;
  orbitalBody: string;
  
  // Resources
  resourcesCost: {
    metal: number;
    crystal: number;
    deuterium: number;
    energy: number;
    rare: number;
  };
  
  maintenanceCost: {
    metal: number;
    crystal: number;
    deuterium: number;
    energy: number;
  };
  
  // Functionality
  isActive: boolean;
  uptime: number; // 0-100%
  efficiency: number; // 0-100%
  
  // Strategic
  strategicValue: number;
  threatLevel: number;
  primaryFunction: string;
  secondaryFunctions: string[];
}

export interface MegastructureCost {
  metal: number;
  crystal: number;
  deuterium: number;
  energy: number;
  rare: number;
}

// ============================================================================
// MEGASTRUCTURE DEFINITIONS (10 TYPES × MULTIPLE CLASSES)
// ============================================================================

function createMegastructureTemplate(
  id: string,
  name: string,
  type: MegastructureType,
  modelClass: MegastructureClass,
  subClass: MegastructureSubClass,
  size: Megastructure['size'],
  primaryFunction: string,
  baseStats: MegastructureStats,
  subType: string = 'standard',
): Omit<Megastructure, 'level' | 'tier' | 'experience' | 'currentStats' | 'levelMultiplier' | 'tierMultiplier' | 'totalMultiplier' | 'coordinates' | 'sector' | 'orbitalBody' | 'isActive' | 'uptime' | 'efficiency'> {
  return {
    id,
    name,
    type,
    subType,
    class: modelClass,
    subClass,
    description: `${name} - A ${size} megastructure of ${type} class`,
    lore: `Ancient technology of unimaginable scale and power`,
    baseStats,
    progressionConfig: {
      tiers: { max: 99 },
      levels: { max: 999 },
    },
    constructionTime: 1000,
    completionPercentage: 0,
    resourcesCost: {
      metal: 10000000,
      crystal: 8000000,
      deuterium: 6000000,
      energy: 5000000,
      rare: 2000000,
    },
    maintenanceCost: {
      metal: 100000,
      crystal: 80000,
      deuterium: 60000,
      energy: 50000,
    },
    size,
    strategicValue: 90,
    threatLevel: 85,
    primaryFunction,
    secondaryFunctions: [],
  };
}

const baseOffensiveStats: OffensiveStats = {
  firepower: 500,
  accuracy: 85,
  range: 10000,
  rateOfFire: 10,
  ammoCapacity: 100000,
  penetration: 80,
  criticalChance: 15,
  damageType: 'kinetic',
};

const baseDefensiveStats: DefensiveStats = {
  armorStrength: 400,
  shieldCapacity: 50000,
  shieldRegeneration: 100,
  evasion: 10,
  damageReduction: 60,
  reflectionChance: 20,
  repairRate: 250,
  selfHealingCapacity: 1000,
};

const baseAttributes: MegastructureAttributes = {
  powerGeneration: 1000000,
  powerConsumption: 500000,
  energyStorage: 10000000,
  efficiency: 95,
  productionRate: 1000,
  craftingSpeed: 5000,
  resourceProcessing: 50000,
  computingPower: 1000000,
  dataProcessing: 500000,
  aiCapability: 95,
  dimensionalResonance: 80,
  realityStability: 90,
  quantumPotential: 85,
};

function generateInfrastructureMegastructures(): Omit<Megastructure, 'level' | 'tier' | 'experience' | 'currentStats' | 'levelMultiplier' | 'tierMultiplier' | 'totalMultiplier' | 'coordinates' | 'sector' | 'orbitalBody' | 'isActive' | 'uptime' | 'efficiency'>[] {
  const templates: Omit<Megastructure, 'level' | 'tier' | 'experience' | 'currentStats' | 'levelMultiplier' | 'tierMultiplier' | 'totalMultiplier' | 'coordinates' | 'sector' | 'orbitalBody' | 'isActive' | 'uptime' | 'efficiency'>[] = [];

  INFRASTRUCTURE_TYPE_FAMILIES.forEach((family, familyIndex) => {
    INFRASTRUCTURE_SUBTYPE_VARIANTS.forEach((variant, variantIndex) => {
      const levelFactor = 1 + familyIndex * 0.07;
      const subtypeFactor = 1 + variantIndex * 0.06;
      const totalFactor = Number((levelFactor * subtypeFactor).toFixed(3));
      const generatedType = `infra-${family.id}-${variant.id}` as MegastructureType;

      templates.push(
        createMegastructureTemplate(
          `infra-${family.id}-${variant.id}`,
          `${family.name} ${variant.label}`,
          generatedType,
          'infrastructure',
          variant.subClass,
          variant.size,
          `${family.description} (${variant.label} specialization)`,
          {
            power: Math.floor(640 * totalFactor),
            efficiency: Math.min(99, Math.floor(88 + variantIndex * 1.2)),
            resilience: Math.floor(520 * totalFactor),
            capacity: Math.floor(4200 * totalFactor),
            precision: Math.floor(92 * totalFactor),
            endurance: Math.floor(560 * totalFactor),
            output: Math.floor(760 * totalFactor),
            control: Math.floor(840 * totalFactor),
            offense: {
              ...baseOffensiveStats,
              firepower: Math.floor(baseOffensiveStats.firepower * (0.75 + familyIndex * 0.05)),
              range: Math.floor(baseOffensiveStats.range * (1 + variantIndex * 0.02)),
            },
            defense: {
              ...baseDefensiveStats,
              armorStrength: Math.floor(baseDefensiveStats.armorStrength * (1 + familyIndex * 0.03)),
              shieldCapacity: Math.floor(baseDefensiveStats.shieldCapacity * (1 + variantIndex * 0.08)),
            },
            tech: Math.floor(160 * totalFactor),
            command: Math.floor(120 * totalFactor),
            logistics: Math.floor(200 * totalFactor),
            survivability: Math.floor(640 * totalFactor),
          },
          variant.id,
        ),
      );
    });
  });

  return templates;
}

const GENERATED_INFRASTRUCTURE_MEGASTRUCTURES = generateInfrastructureMegastructures();

export const MEGASTRUCTURES: Omit<Megastructure, 'level' | 'tier' | 'experience' | 'currentStats' | 'levelMultiplier' | 'tierMultiplier' | 'totalMultiplier' | 'coordinates' | 'sector' | 'orbitalBody' | 'isActive' | 'uptime' | 'efficiency'>[] = [
  // 1. DYSON SPHERE - Energy generation megastructure
  createMegastructureTemplate(
    'mega-dyson-01',
    'Dyson Sphere Prime',
    'dyson-sphere',
    'infrastructure',
    'support',
    'galactic',
    'Stellar energy harvesting',
    {
      power: 1000,
      efficiency: 98,
      resilience: 800,
      capacity: 10000,
      precision: 90,
      endurance: 850,
      output: 1200,
      control: 950,
      offense: { ...baseOffensiveStats, damageType: 'energy' },
      defense: { ...baseDefensiveStats, shieldCapacity: 100000 },
      tech: 200,
      command: 150,
      logistics: 180,
      survivability: 850,
    }
  ),
  
  // 2. RINGWORLD - Massive orbital habitat
  createMegastructureTemplate(
    'mega-ringworld-01',
    'Ringworld Constructor',
    'ringworld',
    'infrastructure',
    'support',
    'solar',
    'Planetary-scale habitat construction',
    {
      power: 950,
      efficiency: 96,
      resilience: 900,
      capacity: 15000,
      precision: 100,
      endurance: 950,
      output: 1100,
      control: 1000,
      offense: baseOffensiveStats,
      defense: { ...baseDefensiveStats, armorStrength: 600 },
      tech: 220,
      command: 160,
      logistics: 200,
      survivability: 900,
    }
  ),
  
  // 3. MEGAFORGE - Production facility
  createMegastructureTemplate(
    'mega-forge-01',
    'Megaforge Titan',
    'megaforge',
    'production',
    'hybrid',
    'massive',
    'Weapon and unit production',
    {
      power: 800,
      efficiency: 99,
      resilience: 600,
      capacity: 8000,
      precision: 110,
      endurance: 700,
      output: 1500,
      control: 1100,
      offense: baseOffensiveStats,
      defense: baseDefensiveStats,
      tech: 180,
      command: 120,
      logistics: 220,
      survivability: 700,
    }
  ),
  
  // 4. RESEARCH NEXUS - Scientific advancement
  createMegastructureTemplate(
    'mega-nexus-01',
    'Research Nexus Prime',
    'research-nexus',
    'research',
    'support',
    'massive',
    'Scientific breakthrough acceleration',
    {
      power: 700,
      efficiency: 99,
      resilience: 500,
      capacity: 5000,
      precision: 150,
      endurance: 600,
      output: 800,
      control: 1200,
      offense: baseOffensiveStats,
      defense: baseDefensiveStats,
      tech: 300,
      command: 100,
      logistics: 150,
      survivability: 600,
    }
  ),
  
  // 5. ORBITAL FORTRESS - Defense structure
  createMegastructureTemplate(
    'mega-fortress-01',
    'Orbital Fortress Omega',
    'orbital-defense',
    'defense',
    'defensive',
    'huge',
    'Planetary defense and orbital control',
    {
      power: 900,
      efficiency: 97,
      resilience: 1000,
      capacity: 7000,
      precision: 120,
      endurance: 1100,
      output: 600,
      control: 900,
      offense: { ...baseOffensiveStats, firepower: 800, range: 20000 },
      defense: { ...baseDefensiveStats, armorStrength: 800, shieldCapacity: 150000 },
      tech: 190,
      command: 200,
      logistics: 170,
      survivability: 1000,
    }
  ),
  
  // 6. GENERATION SHIP - Interstellar colonization
  createMegastructureTemplate(
    'mega-genship-01',
    'Generation Ship Exodus',
    'generation-ship',
    'mobility',
    'support',
    'planetary',
    'Interstellar colonization and migration',
    {
      power: 850,
      efficiency: 93,
      resilience: 750,
      capacity: 12000,
      precision: 85,
      endurance: 900,
      output: 700,
      control: 850,
      offense: { ...baseOffensiveStats, firepower: 300 },
      defense: { ...baseDefensiveStats, armorStrength: 500, shieldCapacity: 80000 },
      tech: 210,
      command: 140,
      logistics: 250,
      survivability: 800,
    }
  ),
  
  // 7. MATTER CONVERTER - Resource transformation
  createMegastructureTemplate(
    'mega-converter-01',
    'Matter Converter Nexus',
    'matter-converter',
    'production',
    'hybrid',
    'colossal',
    'Universal matter-energy conversion',
    {
      power: 920,
      efficiency: 98,
      resilience: 650,
      capacity: 9000,
      precision: 130,
      endurance: 750,
      output: 1400,
      control: 1050,
      offense: baseOffensiveStats,
      defense: { ...baseDefensiveStats, shieldCapacity: 90000 },
      tech: 250,
      command: 130,
      logistics: 210,
      survivability: 750,
    }
  ),
  
  // 8. DIMENSIONAL GATE - Exotic portal technology
  createMegastructureTemplate(
    'mega-gate-01',
    'Dimensional Gate Infinity',
    'dimensional-gate',
    'exotic',
    'experimental',
    'massive',
    'Dimensional rifts and exotic teleportation',
    {
      power: 1050,
      efficiency: 85,
      resilience: 550,
      capacity: 4000,
      precision: 200,
      endurance: 500,
      output: 500,
      control: 1500,
      offense: { ...baseOffensiveStats, damageType: 'dimensional', penetration: 150 },
      defense: { ...baseDefensiveStats, reflectionChance: 80 },
      tech: 350,
      command: 80,
      logistics: 100,
      survivability: 550,
    }
  ),
  
  // 9. STELLAR ENGINE - Star manipulation
  createMegastructureTemplate(
    'mega-engine-01',
    'Stellar Engine Dyson',
    'stellar-engine',
    'mobility',
    'hybrid',
    'solar',
    'Star system propulsion and movement',
    {
      power: 980,
      efficiency: 92,
      resilience: 850,
      capacity: 11000,
      precision: 110,
      endurance: 950,
      output: 1300,
      control: 1100,
      offense: baseOffensiveStats,
      defense: { ...baseDefensiveStats, armorStrength: 700 },
      tech: 290,
      command: 170,
      logistics: 240,
      survivability: 900,
    }
  ),
  
  // 10. NOVA CANNON - Ultimate weapon
  createMegastructureTemplate(
    'mega-cannon-01',
    'Nova Cannon Apocalypse',
    'nova-cannon',
    'superweapon',
    'offensive',
    'colossal',
    'Stellar-scale weaponized devastation',
    {
      power: 1100,
      efficiency: 94,
      resilience: 700,
      capacity: 6000,
      precision: 140,
      endurance: 800,
      output: 2000,
      control: 1000,
      offense: { ...baseOffensiveStats, firepower: 2000, range: 100000, damageType: 'stellar' },
      defense: { ...baseDefensiveStats, armorStrength: 900 },
      tech: 280,
      command: 180,
      logistics: 160,
      survivability: 800,
    }
  ),

  // 11-100. INFRASTRUCTURE EXPANSION - 90 generated infrastructure templates
  ...GENERATED_INFRASTRUCTURE_MEGASTRUCTURES,
];

export type MegastructureTemplate = (typeof MEGASTRUCTURES)[number];

// ============================================================================
// MEGASTRUCTURE LEVELS & TIERS
// ============================================================================

export class MegastructureProgression {
  /**
   * Calculate level multiplier (1-999)
   */
  static getLevelMultiplier(level: number): number {
    return 1.0 + (0.015 * (level - 1)); // 1.0 to 15.98x
  }
  
  /**
   * Calculate tier multiplier (1-99)
   */
  static getTierMultiplier(tier: number): number {
    return 1.0 + (0.08 * (tier - 1)); // 1.0 to 8.84x
  }
  
  /**
   * Calculate total multiplier
   */
  static getTotalMultiplier(level: number, tier: number): number {
    return this.getLevelMultiplier(level) * this.getTierMultiplier(tier);
  }
  
  /**
   * Calculate stat at level and tier
   */
  static calculateStat(baseStat: number, level: number, tier: number): number {
    const levelMult = this.getLevelMultiplier(level);
    const tierMult = this.getTierMultiplier(tier);
    const levelBonus = 8 * (level - 1);
    const tierBonus = 100 * (tier - 1);
    
    return Math.floor((baseStat * levelMult * tierMult) + levelBonus + tierBonus);
  }
  
  /**
   * Calculate all stats for a megastructure
   */
  static calculateAllStats(baseStats: MegastructureStats, level: number, tier: number): MegastructureStats {
    return {
      power: this.calculateStat(baseStats.power, level, tier),
      efficiency: this.calculateStat(baseStats.efficiency, level, tier),
      resilience: this.calculateStat(baseStats.resilience, level, tier),
      capacity: this.calculateStat(baseStats.capacity, level, tier),
      precision: this.calculateStat(baseStats.precision, level, tier),
      endurance: this.calculateStat(baseStats.endurance, level, tier),
      output: this.calculateStat(baseStats.output, level, tier),
      control: this.calculateStat(baseStats.control, level, tier),
      offense: {
        firepower: this.calculateStat(baseStats.offense.firepower, level, tier),
        accuracy: this.calculateStat(baseStats.offense.accuracy, level, tier),
        range: this.calculateStat(baseStats.offense.range, level, tier),
        rateOfFire: this.calculateStat(baseStats.offense.rateOfFire, level, tier),
        ammoCapacity: this.calculateStat(baseStats.offense.ammoCapacity, level, tier),
        penetration: this.calculateStat(baseStats.offense.penetration, level, tier),
        criticalChance: Math.min(this.calculateStat(baseStats.offense.criticalChance, level, tier), 100),
        damageType: baseStats.offense.damageType,
      },
      defense: {
        armorStrength: this.calculateStat(baseStats.defense.armorStrength, level, tier),
        shieldCapacity: this.calculateStat(baseStats.defense.shieldCapacity, level, tier),
        shieldRegeneration: this.calculateStat(baseStats.defense.shieldRegeneration, level, tier),
        evasion: Math.min(this.calculateStat(baseStats.defense.evasion, level, tier), 100),
        damageReduction: Math.min(this.calculateStat(baseStats.defense.damageReduction, level, tier), 95),
        reflectionChance: Math.min(this.calculateStat(baseStats.defense.reflectionChance, level, tier), 100),
        repairRate: this.calculateStat(baseStats.defense.repairRate, level, tier),
        selfHealingCapacity: this.calculateStat(baseStats.defense.selfHealingCapacity, level, tier),
      },
      tech: this.calculateStat(baseStats.tech, level, tier),
      command: this.calculateStat(baseStats.command, level, tier),
      logistics: this.calculateStat(baseStats.logistics, level, tier),
      survivability: this.calculateStat(baseStats.survivability, level, tier),
    };
  }
}

// ============================================================================
// MEGASTRUCTURE CREATION & MANAGEMENT
// ============================================================================

/**
 * Create a new megastructure at specified level and tier
 */
export function createMegastructure(
  templateId: string,
  customId: string,
  level: number = 1,
  tier: number = 1,
  x: number = 0,
  y: number = 0,
  z: number = 0,
  sector: string = 'Unknown'
): Megastructure | null {
  const template = MEGASTRUCTURES.find(m => m.id === templateId);
  if (!template) return null;
  
  const clampedLevel = Math.max(1, Math.min(level, template.progressionConfig.levels.max));
  const clampedTier = Math.max(1, Math.min(tier, template.progressionConfig.tiers.max));
  const levelMult = MegastructureProgression.getLevelMultiplier(clampedLevel);
  const tierMult = MegastructureProgression.getTierMultiplier(clampedTier);
  const totalMult = levelMult * tierMult;
  
  const currentStats = MegastructureProgression.calculateAllStats(template.baseStats, clampedLevel, clampedTier);
  
  return {
    ...template,
    id: customId,
    level: clampedLevel,
    tier: clampedTier,
    experience: 0,
    currentStats,
    levelMultiplier: levelMult,
    tierMultiplier: tierMult,
    totalMultiplier: totalMult,
    coordinates: { x, y, z },
    sector,
    orbitalBody: 'Unassigned',
    isActive: false,
    uptime: 0,
    efficiency: 100,
  };
}

/**
 * Upgrade megastructure level
 */
export function upgradeMegastructureLevel(mega: Megastructure, levels: number = 1): Megastructure {
  const newLevel = Math.min(mega.level + levels, mega.progressionConfig.levels.max);
  const newStats = MegastructureProgression.calculateAllStats(mega.baseStats, newLevel, mega.tier);
  
  return {
    ...mega,
    level: newLevel,
    currentStats: newStats,
    levelMultiplier: MegastructureProgression.getLevelMultiplier(newLevel),
    totalMultiplier: MegastructureProgression.getTotalMultiplier(newLevel, mega.tier),
  };
}

/**
 * Upgrade megastructure tier
 */
export function upgradeMegastructureTier(mega: Megastructure, tiers: number = 1): Megastructure {
  const newTier = Math.min(mega.tier + tiers, mega.progressionConfig.tiers.max);
  const newStats = MegastructureProgression.calculateAllStats(mega.baseStats, mega.level, newTier);
  
  return {
    ...mega,
    tier: newTier,
    currentStats: newStats,
    tierMultiplier: MegastructureProgression.getTierMultiplier(newTier),
    totalMultiplier: MegastructureProgression.getTotalMultiplier(mega.level, newTier),
  };
}

/**
 * Activate/deactivate megastructure
 */
export function toggleMegastructure(mega: Megastructure, active: boolean): Megastructure {
  return {
    ...mega,
    isActive: active,
  };
}

/**
 * Update megastructure efficiency
 */
export function updateMegastructureEfficiency(mega: Megastructure, efficiency: number): Megastructure {
  return {
    ...mega,
    efficiency: Math.max(0, Math.min(efficiency, 100)),
  };
}

/**
 * Get offensive power rating
 */
export function getOffensivePower(mega: Megastructure): number {
  const stats = mega.currentStats;
  return Math.floor(
    stats.offense.firepower * (stats.offense.accuracy / 100) * 
    (1 + stats.offense.penetration / 100) * 
    (1 + stats.offense.criticalChance / 100)
  );
}

/**
 * Get defensive power rating
 */
export function getDefensivePower(mega: Megastructure): number {
  const stats = mega.currentStats;
  return Math.floor(
    (stats.defense.armorStrength * 2) + 
    stats.defense.shieldCapacity + 
    (stats.defense.damageReduction * 100) +
    (stats.defense.reflectionChance * 50)
  );
}

/**
 * Get total strategic value
 */
export function getStrategicValue(mega: Megastructure): number {
  const offensive = getOffensivePower(mega);
  const defensive = getDefensivePower(mega);
  const efficiency = mega.currentStats.efficiency;
  
  return Math.floor((offensive + defensive) * (efficiency / 100));
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get megastructure by type
 */
export function getMegastructuresByType(type: MegastructureType): typeof MEGASTRUCTURES {
  return MEGASTRUCTURES.filter(m => m.type === type);
}

/**
 * Get megastructure by class
 */
export function getMegastructuresByClass(modelClass: MegastructureClass): typeof MEGASTRUCTURES {
  return MEGASTRUCTURES.filter(m => m.class === modelClass);
}

/**
 * Get megastructure by subclass
 */
export function getMegastructuresBySubClass(subClass: MegastructureSubClass): typeof MEGASTRUCTURES {
  return MEGASTRUCTURES.filter(m => m.subClass === subClass);
}

/**
 * Get all megastructure types
 */
export function getAllMegastructureTypes(): MegastructureType[] {
  return Array.from(new Set(MEGASTRUCTURES.map(m => m.type)));
}

/**
 * Get all megastructure classes
 */
export function getAllMegastructureClasses(): MegastructureClass[] {
  return Array.from(new Set(MEGASTRUCTURES.map(m => m.class)));
}

/**
 * Get all megastructure subclasses
 */
export function getAllMegastructureSubClasses(): MegastructureSubClass[] {
  return Array.from(new Set(MEGASTRUCTURES.map(m => m.subClass)));
}

/**
 * Resolve category-friendly display metadata by class.
 */
export function getMegastructureCategoryMeta(modelClass: MegastructureClass) {
  return MEGASTRUCTURE_CATEGORY_METADATA[modelClass];
}

/**
 * Calculate tier from level for a full 1-999 level / 1-99 tier progression.
 */
export function getMegastructureTierFromLevel(level: number, maxLevel: number = 999, maxTier: number = 99): number {
  const clampedLevel = Math.max(1, Math.min(level, maxLevel));
  const normalized = (clampedLevel - 1) / (maxLevel - 1);
  return Math.min(maxTier, Math.max(1, Math.floor(normalized * (maxTier - 1)) + 1));
}

/**
 * Calculate full construction cost for level/tier target.
 */
export function calculateMegastructureConstructionCost(
  templateOrId: MegastructureTemplate | string,
  level: number = 1,
  tier: number = 1,
): MegastructureCost {
  const template = typeof templateOrId === 'string'
    ? MEGASTRUCTURES.find(mega => mega.id === templateOrId)
    : templateOrId;

  if (!template) {
    return { metal: 0, crystal: 0, deuterium: 0, energy: 0, rare: 0 };
  }

  const clampedLevel = Math.max(1, Math.min(level, template.progressionConfig.levels.max));
  const clampedTier = Math.max(1, Math.min(tier, template.progressionConfig.tiers.max));
  const levelMultiplier = Math.pow(1.08, clampedLevel - 1);
  const tierMultiplier = Math.pow(1.2, clampedTier - 1);

  const sizeMultiplierByType: Record<Megastructure['size'], number> = {
    compact: 1,
    huge: 1.35,
    massive: 1.8,
    colossal: 2.4,
    planetary: 3.2,
    solar: 4.5,
    galactic: 6.5,
  };

  const sizeMultiplier = sizeMultiplierByType[template.size] ?? 1;
  const totalMultiplier = levelMultiplier * tierMultiplier * sizeMultiplier;

  return {
    metal: Math.floor(template.resourcesCost.metal * totalMultiplier),
    crystal: Math.floor(template.resourcesCost.crystal * totalMultiplier),
    deuterium: Math.floor(template.resourcesCost.deuterium * totalMultiplier),
    energy: Math.floor(template.resourcesCost.energy * totalMultiplier),
    rare: Math.floor(template.resourcesCost.rare * totalMultiplier),
  };
}

/**
 * Calculate upgrade delta cost from current to target progression.
 */
export function calculateMegastructureUpgradeCost(
  templateOrId: MegastructureTemplate | string,
  currentLevel: number,
  currentTier: number,
  targetLevel: number,
  targetTier: number,
): MegastructureCost {
  const currentCost = calculateMegastructureConstructionCost(templateOrId, currentLevel, currentTier);
  const targetCost = calculateMegastructureConstructionCost(templateOrId, targetLevel, targetTier);

  const deltaMultiplier = 0.6;

  return {
    metal: Math.max(0, Math.floor((targetCost.metal - currentCost.metal) * deltaMultiplier)),
    crystal: Math.max(0, Math.floor((targetCost.crystal - currentCost.crystal) * deltaMultiplier)),
    deuterium: Math.max(0, Math.floor((targetCost.deuterium - currentCost.deuterium) * deltaMultiplier)),
    energy: Math.max(0, Math.floor((targetCost.energy - currentCost.energy) * deltaMultiplier)),
    rare: Math.max(0, Math.floor((targetCost.rare - currentCost.rare) * deltaMultiplier)),
  };
}

/**
 * Build a category-indexed template map.
 */
export function getMegastructureCatalogByCategory() {
  const classes = getAllMegastructureClasses().sort(
    (left, right) => (MEGASTRUCTURE_CATEGORY_METADATA[left]?.order ?? 999) - (MEGASTRUCTURE_CATEGORY_METADATA[right]?.order ?? 999),
  );

  return classes.map(modelClass => ({
    category: modelClass,
    meta: getMegastructureCategoryMeta(modelClass),
    templates: getMegastructuresByClass(modelClass),
  }));
}

/**
 * Get tier class metadata for a given tier (1-99).
 */
export function getMegastructureTierClassMeta(tier: number): MegastructureTierClassMeta {
  const clampedTier = Math.max(1, Math.min(tier, 99));
  return MEGASTRUCTURE_TIER_CLASS_TABLE[clampedTier - 1];
}

/**
 * Get the rank for a given tier (1-99).
 */
export function getMegastructureRank(tier: number): MegastructureRank {
  return getMegastructureTierClassMeta(tier).rank;
}

/**
 * Get the title for a given tier (1-99).
 */
export function getMegastructureTitle(tier: number): string {
  return getMegastructureTierClassMeta(tier).title;
}

/**
 * Get all sub-categories for a given category class.
 */
export function getMegastructureSubCategories(modelClass: MegastructureClass): MegastructureSubCategory[] {
  return MEGASTRUCTURE_CATEGORY_METADATA[modelClass]?.subCategories ?? [];
}

/**
 * Get all 32 sub-categories across all 18 categories.
 */
export function getAllMegastructureSubCategories(): MegastructureSubCategory[] {
  return (Object.values(MEGASTRUCTURE_CATEGORY_METADATA) as { subCategories: MegastructureSubCategory[] }[])
    .flatMap(meta => meta.subCategories);
}

/**
 * Get megastructures filtered by sub-category.
 */
export function getMegastructuresBySubCategory(subCategory: MegastructureSubCategory): typeof MEGASTRUCTURES {
  return MEGASTRUCTURES.filter(m => m.subCategory === subCategory);
}

/**
 * Build default subjects for a megastructure based on its class.
 */
export function buildDefaultSubjects(modelClass: MegastructureClass): MegastructureSubject[] {
  const domainMap: Record<MegastructureClass, MegastructureSubjectDomain[]> = {
    infrastructure:       ['economic', 'civilizational'],
    production:           ['economic', 'military'],
    research:             ['scientific', 'civilizational'],
    defense:              ['military', 'strategic'],
    mobility:             ['strategic', 'civilizational'],
    exotic:               ['scientific', 'temporal'],
    superweapon:          ['military', 'strategic'],
    civilization:         ['civilizational', 'diplomatic'],
    economic:             ['economic', 'diplomatic'],
    diplomatic:           ['diplomatic', 'civilizational'],
    exploration:          ['scientific', 'strategic'],
    colonization:         ['civilizational', 'ecological'],
    communication:        ['civilizational', 'strategic'],
    surveillance:         ['strategic', 'military'],
    terraforming:         ['ecological', 'civilizational'],
    ecological:           ['ecological', 'scientific'],
    temporal:             ['temporal', 'scientific'],
    'dimensional-forge':  ['temporal', 'strategic'],
  };

  const domains = domainMap[modelClass] ?? ['strategic'];
  return domains.map((domain, idx) => ({
    id: `${modelClass}-subject-${idx + 1}`,
    name: `${domain.charAt(0).toUpperCase() + domain.slice(1)} Subject ${idx + 1}`,
    domain,
    description: `Primary ${domain} subject for ${modelClass} megastructures`,
    subjectDetails: `This subject governs the ${domain} interactions and influence of ${modelClass}-class megastructures within the galactic ecosystem.`,
    relevanceScore: idx === 0 ? 90 : 70,
  }));
}

/**
 * Generate default sub-attributes for a megastructure.
 */
export function buildDefaultSubAttributes(baseStats: MegastructureStats): MegastructureSubAttributes {
  return {
    powerSurgeCapacity: Math.floor(baseStats.power * 1.25),
    overloadThreshold: Math.floor(baseStats.power * 2.0),
    heatDissipationRate: Math.floor(baseStats.efficiency * 0.8),
    batchSize: Math.floor(baseStats.output * 0.5),
    outputVariance: Math.floor(baseStats.output * 0.1),
    wasteRecyclingRate: Math.floor(baseStats.efficiency * 0.5),
    parallelProcessingThreads: Math.floor(baseStats.control * 0.25),
    errorCorrectionRate: Math.floor(baseStats.precision * 0.6),
    memoryBandwidth: Math.floor(baseStats.control * 0.4),
    anomalyResistance: Math.floor(baseStats.resilience * 0.7),
    warpFieldDensity: Math.floor(baseStats.power * 0.3),
    phaseShiftStability: Math.floor(baseStats.resilience * 0.5),
  };
}

/**
 * Generate default sub-stats for a megastructure.
 */
export function buildDefaultSubStats(baseStats: MegastructureStats): MegastructureSubStats {
  return {
    thrustPower: Math.floor(baseStats.power * 0.6),
    radiationOutput: Math.floor(baseStats.output * 0.4),
    solarHarvestRate: Math.floor(baseStats.power * 0.35),
    hullIntegrity: Math.floor(baseStats.resilience * 1.1),
    barrierResonance: Math.floor(baseStats.defense.shieldCapacity * 0.02),
    redundancyIndex: Math.floor(baseStats.endurance * 0.7),
    automationLevel: Math.floor(baseStats.control * 0.55),
    synchronizationRate: Math.floor(baseStats.precision * 0.8),
    adaptability: Math.floor(baseStats.endurance * 0.5),
    phaseCoherence: Math.floor(baseStats.tech * 1.2),
    gravimetricPotential: Math.floor(baseStats.power * 0.45),
    neuralNetworkBandwidth: Math.floor(baseStats.control * 0.6),
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  MEGASTRUCTURES,
  MEGASTRUCTURE_CATEGORY_METADATA,
  MEGASTRUCTURE_TIER_CLASS_TABLE,
  MEGASTRUCTURE_TIER_TITLES,
  MegastructureProgression,
  createMegastructure,
  upgradeMegastructureLevel,
  upgradeMegastructureTier,
  toggleMegastructure,
  updateMegastructureEfficiency,
  getOffensivePower,
  getDefensivePower,
  getStrategicValue,
  getMegastructuresByType,
  getMegastructuresByClass,
  getMegastructuresBySubClass,
  getMegastructuresBySubCategory,
  getAllMegastructureTypes,
  getAllMegastructureClasses,
  getAllMegastructureSubClasses,
  getAllMegastructureSubCategories,
  getMegastructureCategoryMeta,
  getMegastructureSubCategories,
  getMegastructureTierFromLevel,
  getMegastructureTierClassMeta,
  getMegastructureRank,
  getMegastructureTitle,
  buildDefaultSubjects,
  buildDefaultSubAttributes,
  buildDefaultSubStats,
  calculateMegastructureConstructionCost,
  calculateMegastructureUpgradeCost,
  getMegastructureCatalogByCategory,
};
