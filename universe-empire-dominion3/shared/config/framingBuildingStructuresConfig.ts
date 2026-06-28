/**
 * Framing Building Structures System
 * 18 categories, 32 sub-categories, 1-99 tiers, 1-999 levels
 * Includes classes, sub-classes, types, sub-types, names, ranks, titles,
 * stats, sub-stats, descriptions, sub-descriptions, attributes,
 * sub-attributes, and subjects with detail information.
 * @tag #framing #building #structures #tiers #levels #categories
 */

// ============================================================================
// CONSTANTS
// ============================================================================

export const FRAMING_CONSTANTS = {
  MAX_TIER: 99,
  MIN_TIER: 1,
  MAX_LEVEL: 999,
  MIN_LEVEL: 1,
  CATEGORY_COUNT: 18,
  SUBCATEGORY_COUNT: 32,
} as const;

// ============================================================================
// ENUMS & UNION TYPES
// ============================================================================

/** 18 top-level framing building structure categories */
export type FramingCategory =
  | 'foundation'
  | 'superstructure'
  | 'shell'
  | 'interior'
  | 'mechanical'
  | 'electrical'
  | 'plumbing'
  | 'thermal'
  | 'acoustic'
  | 'seismic'
  | 'orbital-frame'
  | 'subterranean'
  | 'modular'
  | 'megaframe'
  | 'adaptive'
  | 'bionic'
  | 'quantum-lattice'
  | 'temporal-anchor';

/**
 * 32 sub-categories distributed across the 18 categories:
 *   foundation (3), superstructure (3), shell (2), interior (2),
 *   mechanical (2), electrical (2), plumbing (1), thermal (1),
 *   acoustic (1), seismic (1), orbital-frame (2), subterranean (2),
 *   modular (2), megaframe (2), adaptive (1), bionic (1),
 *   quantum-lattice (2), temporal-anchor (2) = 32 total
 */
export type FramingSubCategory =
  | 'shallow-foundation'
  | 'deep-foundation'
  | 'special-foundation'
  | 'load-bearing-frame'
  | 'moment-frame'
  | 'truss-frame'
  | 'external-cladding'
  | 'curtain-wall'
  | 'partition-system'
  | 'floor-deck'
  | 'hvac-frame'
  | 'elevator-shaft'
  | 'power-grid-frame'
  | 'comm-conduit-frame'
  | 'pipe-chase-frame'
  | 'thermal-barrier-frame'
  | 'sound-isolation-frame'
  | 'seismic-isolator-frame'
  | 'zero-g-lattice'
  | 'tether-ring-frame'
  | 'tunnel-bore-frame'
  | 'cavern-reinforcement'
  | 'snap-lock-module'
  | 'reconfigurable-pod'
  | 'macro-truss'
  | 'planet-span-arch'
  | 'self-healing-frame'
  | 'bio-composite-frame'
  | 'entangled-strut'
  | 'phase-locked-beam'
  | 'chrono-stabilizer'
  | 'temporal-brace';

/** Structural class (quality / rarity tier) */
export type FramingClass =
  | 'standard'
  | 'reinforced'
  | 'advanced'
  | 'superior'
  | 'elite'
  | 'legendary'
  | 'mythic';

/** Structural sub-class within each class */
export type FramingSubClass =
  | 'basic'
  | 'intermediate'
  | 'expert'
  | 'master'
  | 'grandmaster';

/** Structural type (primary material / construction method) */
export type FramingType =
  | 'wood'
  | 'steel'
  | 'concrete'
  | 'composite'
  | 'alloy'
  | 'ceramic'
  | 'crystal-lattice'
  | 'plasma-weld'
  | 'nano-fiber'
  | 'graviton-mesh';

/** Structural sub-type (specific application variant) */
export type FramingSubType =
  | 'light'
  | 'medium'
  | 'heavy'
  | 'ultra-heavy'
  | 'micro'
  | 'macro'
  | 'hybrid'
  | 'resonant'
  | 'dampened'
  | 'accelerated';

// ============================================================================
// RANK & TITLE SYSTEM  (1-99 tier → rank name + title + honorific)
// ============================================================================

export interface TierRank {
  minTier: number;
  maxTier: number;
  rank: string;
  title: string;
  honorific: string;
  color: string;
}

export const FRAMING_TIER_RANKS: TierRank[] = [
  { minTier: 1,  maxTier: 9,  rank: 'Apprentice',  title: 'Framer',            honorific: 'Initiate',        color: '#808080' },
  { minTier: 10, maxTier: 19, rank: 'Journeyman',  title: 'Structural Framer', honorific: 'Framer',          color: '#4caf50' },
  { minTier: 20, maxTier: 29, rank: 'Craftsman',   title: 'Frame Engineer',    honorific: 'Engineer',        color: '#2196f3' },
  { minTier: 30, maxTier: 39, rank: 'Specialist',  title: 'Senior Engineer',   honorific: 'Senior Engineer', color: '#9c27b0' },
  { minTier: 40, maxTier: 49, rank: 'Expert',      title: 'Principal Framer',  honorific: 'Principal',       color: '#ff9800' },
  { minTier: 50, maxTier: 59, rank: 'Master',      title: 'Master Architect',  honorific: 'Master',          color: '#f44336' },
  { minTier: 60, maxTier: 69, rank: 'Grandmaster', title: 'Grand Architect',   honorific: 'Grand Master',    color: '#ff5722' },
  { minTier: 70, maxTier: 79, rank: 'Legendary',   title: 'Legendary Builder', honorific: 'Legend',          color: '#ffc107' },
  { minTier: 80, maxTier: 89, rank: 'Mythic',      title: 'Mythic Fabricator', honorific: 'Mythic',          color: '#e91e63' },
  { minTier: 90, maxTier: 99, rank: 'Ascendant',   title: 'Ascendant Framer',  honorific: 'Ascendant',       color: '#00bcd4' },
];

export function getFramingTierRank(tier: number): TierRank {
  return (
    FRAMING_TIER_RANKS.find(r => tier >= r.minTier && tier <= r.maxTier) ??
    FRAMING_TIER_RANKS[0]
  );
}

// ============================================================================
// STATS & SUB-STATS
// ============================================================================

export interface FramingStats {
  // Primary stats
  structuralIntegrity: number;
  loadCapacity: number;
  durability: number;
  stability: number;
  // Sub-stats
  tensileStrength: number;
  compressiveStrength: number;
  shearStrength: number;
  flexuralStrength: number;
  fatigueResistance: number;
  impactResistance: number;
  thermalResistance: number;
  corrosionResistance: number;
}

export interface FramingSubStats {
  // Operational sub-stats
  constructionSpeed: number;
  maintenanceCost: number;
  repairEfficiency: number;
  upgradeCapacity: number;
  // Environmental sub-stats
  seismicRating: number;
  windLoadRating: number;
  fireRating: number;
  radiationShielding: number;
}

// ============================================================================
// ATTRIBUTES & SUB-ATTRIBUTES
// ============================================================================

export interface FramingAttributes {
  // Core attributes
  weight: number;
  volume: number;
  density: number;
  conductivity: number;
  // Performance attributes
  resonanceFrequency: number;
  dampingCoefficient: number;
  thermalExpansion: number;
  elasticModulus: number;
}

export interface FramingSubAttributes {
  // Material sub-attributes
  grainStructure: number;
  porosity: number;
  surfaceHardness: number;
  crystallineAlignment: number;
  // System sub-attributes
  modularCompatibility: number;
  recyclingYield: number;
  environmentalFootprint: number;
  quantumCoherence: number;
}

// ============================================================================
// SUBJECTS (contextual detail / description information)
// ============================================================================

export interface FramingSubjectDetail {
  origin: string;
  application: string;
  materialScience: string;
  constructionMethod: string;
  maintenanceNotes: string;
}

export interface FramingSubject {
  id: string;
  name: string;
  description: string;
  subDescription: string;
  detail: string;
  subjectDetails: FramingSubjectDetail;
}

export const FRAMING_SUBJECTS: FramingSubject[] = [
  {
    id: 'load-transfer',
    name: 'Load Transfer',
    description: 'The process by which forces are distributed through structural members.',
    subDescription: 'Efficient load transfer reduces stress concentrations and improves overall integrity.',
    detail: 'Load transfer mechanics govern how gravitational, live, and dynamic loads propagate through a frame from point of application to the foundation system.',
    subjectDetails: {
      origin: 'Classical structural mechanics, refined over millennia.',
      application: 'Applied in every framing category to ensure safe force distribution.',
      materialScience: 'Dependent on material yield strength, cross-sectional geometry, and joint rigidity.',
      constructionMethod: 'Achieved through carefully dimensioned members and engineered connections.',
      maintenanceNotes: 'Inspect connection hardware periodically; replace worn bearing plates.',
    },
  },
  {
    id: 'resonance-control',
    name: 'Resonance Control',
    description: 'Techniques to prevent harmful vibrational resonance within structures.',
    subDescription: 'Mismatched resonance frequencies can amplify oscillations catastrophically.',
    detail: 'By tuning member stiffness and mass distribution, engineers shift natural frequencies away from expected excitation spectra caused by wind, seismic, or mechanical sources.',
    subjectDetails: {
      origin: 'Developed after several high-profile structural failures in early stellar construction.',
      application: 'Critical in orbital frames and megaframes subject to microgravity oscillations.',
      materialScience: 'Viscoelastic damping materials absorb vibrational energy efficiently.',
      constructionMethod: 'Tuned mass dampers and base isolators are embedded during construction.',
      maintenanceNotes: 'Recalibrate damper systems annually; monitor accelerometer logs.',
    },
  },
  {
    id: 'thermal-management',
    name: 'Thermal Management',
    description: 'Controlling heat flow through and around structural framing elements.',
    subDescription: 'Thermal gradients introduce differential expansion stresses into frames.',
    detail: 'Thermal management in framing addresses expansion joints, insulated connections, and radiative coatings to prevent warping and cracking under temperature cycles.',
    subjectDetails: {
      origin: 'Originally derived from aerospace structural engineering practices.',
      application: 'Essential in orbital and temporal-anchor framing systems.',
      materialScience: 'Phase-change materials and aerogel composites provide passive thermal buffering.',
      constructionMethod: 'Expansion joints at regular intervals; thermally broken connectors.',
      maintenanceNotes: 'Replace expansion joint sealants every 10 operational cycles.',
    },
  },
  {
    id: 'seismic-isolation',
    name: 'Seismic Isolation',
    description: 'Decoupling a structure from ground motion to reduce seismic forces.',
    subDescription: 'Isolation systems absorb and dissipate earthquake energy before it enters the frame.',
    detail: 'Seismic isolation uses layered elastomeric bearings, friction pendulum systems, or active magnetorheological dampers to reduce inter-story drifts and protect occupants.',
    subjectDetails: {
      origin: 'Pioneered in earthquake-prone regions; later adapted for planetary colonization.',
      application: 'Mandatory in seismic framing sub-category and recommended for all surface structures.',
      materialScience: 'High-damping natural rubber (HDNR) and lead-rubber bearings are standard.',
      constructionMethod: 'Isolators installed at the base level between foundation and superstructure.',
      maintenanceNotes: 'Full bearing inspection after any seismic event above threshold magnitude.',
    },
  },
  {
    id: 'quantum-entanglement-framing',
    name: 'Quantum Entanglement Framing',
    description: 'Experimental framing using entangled structural members for coherent load sharing.',
    subDescription: 'Entangled struts share stress state information instantaneously, enabling predictive load redistribution.',
    detail: 'Quantum lattice framing leverages particle entanglement to synchronize load-bearing members across distances, dramatically improving real-time structural response to dynamic loads.',
    subjectDetails: {
      origin: 'Theoretical framework established in post-singularity materials research.',
      application: 'Restricted to quantum-lattice category at tier 70+.',
      materialScience: 'Requires coherence-stabilized alloys cooled near absolute zero.',
      constructionMethod: 'Members must be entangled in a controlled lab environment before installation.',
      maintenanceNotes: 'Maintain coherence temperature; decoherence events must be reported immediately.',
    },
  },
  {
    id: 'temporal-anchoring',
    name: 'Temporal Anchoring',
    description: 'Fixing a structural frame in the temporal dimension to prevent chronological drift.',
    subDescription: 'Structures in regions of high spacetime curvature require temporal bracing.',
    detail: 'Temporal anchors use exotic matter fields to lock a building reference frame to a stable temporal coordinate, preventing material fatigue caused by relativistic time dilation effects.',
    subjectDetails: {
      origin: 'Discovered during the construction of the first near-singularity orbital station.',
      application: 'Exclusive to temporal-anchor framing category at tier 80+.',
      materialScience: 'Exotic negative-energy matter embedded in chrono-stabilizer nodes.',
      constructionMethod: 'Sequential temporal locking of chrono-stabilizer nodes during foundation pour.',
      maintenanceNotes: 'Temporal coherence diagnostics required before any structural modification.',
    },
  },
];

// ============================================================================
// CORE STRUCTURE DEFINITION
// ============================================================================

export interface FramingStructureStats {
  base: FramingStats;
  sub: FramingSubStats;
}

export interface FramingStructureAttributes {
  core: FramingAttributes;
  sub: FramingSubAttributes;
}

export interface FramingStructureDescriptions {
  main: string;
  sub: string;
  lore: string;
  technicalDetail: string;
}

export interface FramingStructureUnlockRequirements {
  minTier?: number;
  minLevel?: number;
  requiredCategory?: FramingCategory;
  requiredStructureId?: string;
}

export interface FramingStructure {
  id: string;
  name: string;
  category: FramingCategory;
  subCategory: FramingSubCategory;
  structureClass: FramingClass;
  structureSubClass: FramingSubClass;
  structureType: FramingType;
  structureSubType: FramingSubType;
  rank: string;
  title: string;

  tier: number;    // 1-99  (initial/minimum unlock tier)
  maxTier: number; // always 99
  level: number;   // 1-999 (initial level)
  maxLevel: number;// always 999

  descriptions: FramingStructureDescriptions;
  stats: FramingStructureStats;
  attributes: FramingStructureAttributes;

  /** ids referencing entries in FRAMING_SUBJECTS */
  subjects: string[];

  cost: { metal: number; crystal: number; deuterium: number };
  buildTime: number; // seconds
  maintenanceCost: { metal: number; crystal: number; deuterium: number };

  unlockRequirements: FramingStructureUnlockRequirements;
}

// ============================================================================
// STAT SCALING UTILITIES
// ============================================================================

function scaleStats(base: FramingStats, tier: number, level: number): FramingStats {
  const tierMult  = Math.pow(1.08,  tier  - 1);
  const levelMult = Math.pow(1.015, level - 1);
  const total = tierMult * levelMult;
  return {
    structuralIntegrity: Math.floor(base.structuralIntegrity * total),
    loadCapacity:        Math.floor(base.loadCapacity        * total),
    durability:          Math.floor(base.durability          * total),
    stability:           Math.floor(base.stability           * total),
    tensileStrength:     Math.floor(base.tensileStrength     * total),
    compressiveStrength: Math.floor(base.compressiveStrength * total),
    shearStrength:       Math.floor(base.shearStrength       * total),
    flexuralStrength:    Math.floor(base.flexuralStrength    * total),
    fatigueResistance:   Math.floor(base.fatigueResistance   * total),
    impactResistance:    Math.floor(base.impactResistance    * total),
    thermalResistance:   Math.floor(base.thermalResistance   * total),
    corrosionResistance: Math.floor(base.corrosionResistance * total),
  };
}

function scaleSubStats(base: FramingSubStats, tier: number, level: number): FramingSubStats {
  const tierMult  = Math.pow(1.06,  tier  - 1);
  const levelMult = Math.pow(1.012, level - 1);
  const total = tierMult * levelMult;
  return {
    constructionSpeed:  Math.floor(base.constructionSpeed  * total),
    maintenanceCost:    Math.floor(base.maintenanceCost    * total),
    repairEfficiency:   Math.floor(base.repairEfficiency   * total),
    upgradeCapacity:    Math.floor(base.upgradeCapacity    * total),
    seismicRating:      Math.floor(base.seismicRating      * total),
    windLoadRating:     Math.floor(base.windLoadRating     * total),
    fireRating:         Math.floor(base.fireRating         * total),
    radiationShielding: Math.floor(base.radiationShielding * total),
  };
}

function scaleAttributes(base: FramingAttributes, tier: number, level: number): FramingAttributes {
  const mult = Math.pow(1.05, tier - 1) * Math.pow(1.01, level - 1);
  return {
    weight:             parseFloat((base.weight             * mult).toFixed(2)),
    volume:             parseFloat((base.volume             * mult).toFixed(2)),
    density:            parseFloat((base.density            * mult).toFixed(2)),
    conductivity:       parseFloat((base.conductivity       * mult).toFixed(2)),
    resonanceFrequency: parseFloat((base.resonanceFrequency * mult).toFixed(2)),
    dampingCoefficient: parseFloat((base.dampingCoefficient * mult).toFixed(2)),
    thermalExpansion:   parseFloat((base.thermalExpansion   * mult).toFixed(2)),
    elasticModulus:     parseFloat((base.elasticModulus     * mult).toFixed(2)),
  };
}

/**
 * Calculate scaled stats, sub-stats, and attributes for any framing structure
 * at a given tier (1-99) and level (1-999).
 */
export function calculateFramingStructureScaledValues(
  structure: FramingStructure,
  tier: number,
  level: number
): { stats: FramingStructureStats; attributes: FramingStructureAttributes } {
  const clampedTier  = Math.max(1, Math.min(tier,  FRAMING_CONSTANTS.MAX_TIER));
  const clampedLevel = Math.max(1, Math.min(level, FRAMING_CONSTANTS.MAX_LEVEL));
  const t = clampedTier;

  return {
    stats: {
      base: scaleStats(structure.stats.base, clampedTier, clampedLevel),
      sub:  scaleSubStats(structure.stats.sub, clampedTier, clampedLevel),
    },
    attributes: {
      core: scaleAttributes(structure.attributes.core, clampedTier, clampedLevel),
      sub: {
        grainStructure:         parseFloat((structure.attributes.sub.grainStructure         * Math.pow(1.04, t - 1)).toFixed(2)),
        porosity:               parseFloat((structure.attributes.sub.porosity               * Math.pow(0.99, t - 1)).toFixed(2)),
        surfaceHardness:        parseFloat((structure.attributes.sub.surfaceHardness        * Math.pow(1.05, t - 1)).toFixed(2)),
        crystallineAlignment:   parseFloat((structure.attributes.sub.crystallineAlignment   * Math.pow(1.03, t - 1)).toFixed(2)),
        modularCompatibility:   parseFloat((structure.attributes.sub.modularCompatibility   * Math.pow(1.02, t - 1)).toFixed(2)),
        recyclingYield:         parseFloat((structure.attributes.sub.recyclingYield         * Math.pow(1.01, t - 1)).toFixed(2)),
        environmentalFootprint: parseFloat((structure.attributes.sub.environmentalFootprint * Math.pow(0.98, t - 1)).toFixed(2)),
        quantumCoherence:       parseFloat((structure.attributes.sub.quantumCoherence       * Math.pow(1.06, t - 1)).toFixed(2)),
      },
    },
  };
}

// ============================================================================
// BASE STAT TEMPLATES (shared by catalog entries)
// ============================================================================

const BASE_STATS_STANDARD: FramingStats = {
  structuralIntegrity: 100, loadCapacity: 80,  durability: 90,  stability: 85,
  tensileStrength: 70,  compressiveStrength: 80, shearStrength: 65, flexuralStrength: 75,
  fatigueResistance: 60, impactResistance: 55, thermalResistance: 50, corrosionResistance: 45,
};
const BASE_SUB_STATS_STANDARD: FramingSubStats = {
  constructionSpeed: 100, maintenanceCost: 50, repairEfficiency: 80, upgradeCapacity: 60,
  seismicRating: 50, windLoadRating: 55, fireRating: 60, radiationShielding: 30,
};
const BASE_ATTRS_STANDARD: FramingAttributes = {
  weight: 1000, volume: 50, density: 7.8, conductivity: 50,
  resonanceFrequency: 3.5, dampingCoefficient: 0.05, thermalExpansion: 11.7, elasticModulus: 200,
};
const BASE_SUB_ATTRS_STANDARD: FramingSubAttributes = {
  grainStructure: 5, porosity: 10, surfaceHardness: 60, crystallineAlignment: 40,
  modularCompatibility: 50, recyclingYield: 70, environmentalFootprint: 80, quantumCoherence: 0,
};

const BASE_STATS_ADVANCED: FramingStats = {
  structuralIntegrity: 300, loadCapacity: 250, durability: 280, stability: 260,
  tensileStrength: 220, compressiveStrength: 240, shearStrength: 200, flexuralStrength: 230,
  fatigueResistance: 180, impactResistance: 170, thermalResistance: 200, corrosionResistance: 160,
};
const BASE_SUB_STATS_ADVANCED: FramingSubStats = {
  constructionSpeed: 200, maintenanceCost: 80, repairEfficiency: 150, upgradeCapacity: 120,
  seismicRating: 150, windLoadRating: 160, fireRating: 180, radiationShielding: 100,
};
const BASE_ATTRS_ADVANCED: FramingAttributes = {
  weight: 3500, volume: 150, density: 8.5, conductivity: 120,
  resonanceFrequency: 5.2, dampingCoefficient: 0.10, thermalExpansion: 9.5, elasticModulus: 380,
};
const BASE_SUB_ATTRS_ADVANCED: FramingSubAttributes = {
  grainStructure: 15, porosity: 5, surfaceHardness: 85, crystallineAlignment: 70,
  modularCompatibility: 80, recyclingYield: 85, environmentalFootprint: 55, quantumCoherence: 5,
};

const BASE_STATS_LEGENDARY: FramingStats = {
  structuralIntegrity: 1000, loadCapacity: 900, durability: 950, stability: 920,
  tensileStrength: 800, compressiveStrength: 880, shearStrength: 750, flexuralStrength: 840,
  fatigueResistance: 700, impactResistance: 660, thermalResistance: 720, corrosionResistance: 680,
};
const BASE_SUB_STATS_LEGENDARY: FramingSubStats = {
  constructionSpeed: 500, maintenanceCost: 150, repairEfficiency: 400, upgradeCapacity: 350,
  seismicRating: 450, windLoadRating: 480, fireRating: 500, radiationShielding: 400,
};
const BASE_ATTRS_LEGENDARY: FramingAttributes = {
  weight: 12000, volume: 600, density: 12.0, conductivity: 350,
  resonanceFrequency: 9.8, dampingCoefficient: 0.25, thermalExpansion: 5.0, elasticModulus: 900,
};
const BASE_SUB_ATTRS_LEGENDARY: FramingSubAttributes = {
  grainStructure: 50, porosity: 1, surfaceHardness: 150, crystallineAlignment: 130,
  modularCompatibility: 120, recyclingYield: 95, environmentalFootprint: 20, quantumCoherence: 30,
};

// ============================================================================
// STRUCTURE CATALOG
// 18 categories x 32 sub-categories represented with at least one entry each
// ============================================================================

export const FRAMING_STRUCTURES: FramingStructure[] = [

  // ── 1. FOUNDATION ─────────────────────────────────────────────────────────

  {
    id: 'fnd-shallow-std',
    name: 'Shallow Spread Footing',
    category: 'foundation', subCategory: 'shallow-foundation',
    structureClass: 'standard', structureSubClass: 'basic',
    structureType: 'concrete', structureSubType: 'heavy',
    rank: 'Apprentice', title: 'Framer',
    tier: 1, maxTier: 99, level: 1, maxLevel: 999,
    descriptions: {
      main: 'A wide, shallow concrete footing that distributes column loads over a large bearing area.',
      sub: 'Best suited for stable, high-bearing-capacity soils with a low water table.',
      lore: 'The most ancient framing technique, unchanged in principle since the first permanent settlements.',
      technicalDetail: 'Reinforced with rebar grid; bearing pressure must not exceed soil allowable capacity.',
    },
    stats: { base: BASE_STATS_STANDARD, sub: BASE_SUB_STATS_STANDARD },
    attributes: { core: BASE_ATTRS_STANDARD, sub: BASE_SUB_ATTRS_STANDARD },
    subjects: ['load-transfer', 'seismic-isolation'],
    cost: { metal: 200, crystal: 50, deuterium: 0 },
    buildTime: 120,
    maintenanceCost: { metal: 2, crystal: 0, deuterium: 0 },
    unlockRequirements: {},
  },

  {
    id: 'fnd-deep-adv',
    name: 'Deep Pile Foundation',
    category: 'foundation', subCategory: 'deep-foundation',
    structureClass: 'advanced', structureSubClass: 'expert',
    structureType: 'steel', structureSubType: 'heavy',
    rank: 'Craftsman', title: 'Frame Engineer',
    tier: 10, maxTier: 99, level: 1, maxLevel: 999,
    descriptions: {
      main: 'High-capacity driven or bored piles extending to competent bearing strata.',
      sub: 'Required when surface soils cannot support structural loads directly.',
      lore: 'Developed for tower construction in soft deltaic soils of early colonized worlds.',
      technicalDetail: 'Pile capacity determined by skin friction and end bearing; load-tested before construction.',
    },
    stats: { base: BASE_STATS_ADVANCED, sub: BASE_SUB_STATS_ADVANCED },
    attributes: { core: BASE_ATTRS_ADVANCED, sub: BASE_SUB_ATTRS_ADVANCED },
    subjects: ['load-transfer', 'seismic-isolation'],
    cost: { metal: 800, crystal: 200, deuterium: 50 },
    buildTime: 480,
    maintenanceCost: { metal: 8, crystal: 2, deuterium: 1 },
    unlockRequirements: { minTier: 10 },
  },

  {
    id: 'fnd-special-leg',
    name: 'Magnetic Levitation Plinth',
    category: 'foundation', subCategory: 'special-foundation',
    structureClass: 'legendary', structureSubClass: 'master',
    structureType: 'graviton-mesh', structureSubType: 'ultra-heavy',
    rank: 'Legendary', title: 'Legendary Builder',
    tier: 50, maxTier: 99, level: 1, maxLevel: 999,
    descriptions: {
      main: 'A contactless foundation system using permanent superconducting magnets for frictionless support.',
      sub: 'Eliminates seismic coupling between ground and superstructure entirely.',
      lore: 'Inspired by the maglev propulsion systems of early generation ships.',
      technicalDetail: 'Requires cryogenic superconductor maintenance infrastructure below 20 K.',
    },
    stats: { base: BASE_STATS_LEGENDARY, sub: BASE_SUB_STATS_LEGENDARY },
    attributes: { core: BASE_ATTRS_LEGENDARY, sub: BASE_SUB_ATTRS_LEGENDARY },
    subjects: ['load-transfer', 'seismic-isolation', 'thermal-management'],
    cost: { metal: 50000, crystal: 30000, deuterium: 10000 },
    buildTime: 7200,
    maintenanceCost: { metal: 500, crystal: 300, deuterium: 100 },
    unlockRequirements: { minTier: 50 },
  },

  // ── 2. SUPERSTRUCTURE ─────────────────────────────────────────────────────

  {
    id: 'sup-load-std',
    name: 'Load-Bearing Masonry Frame',
    category: 'superstructure', subCategory: 'load-bearing-frame',
    structureClass: 'standard', structureSubClass: 'basic',
    structureType: 'concrete', structureSubType: 'medium',
    rank: 'Apprentice', title: 'Framer',
    tier: 1, maxTier: 99, level: 1, maxLevel: 999,
    descriptions: {
      main: 'Traditional load-bearing walls carrying gravity and lateral forces directly to the foundation.',
      sub: 'Simple construction with limited floor-plan flexibility.',
      lore: 'The default framing method for early planetary settlement shelters.',
      technicalDetail: 'Wall thickness governed by slenderness ratio and axial load demands.',
    },
    stats: { base: BASE_STATS_STANDARD, sub: BASE_SUB_STATS_STANDARD },
    attributes: { core: BASE_ATTRS_STANDARD, sub: BASE_SUB_ATTRS_STANDARD },
    subjects: ['load-transfer'],
    cost: { metal: 150, crystal: 30, deuterium: 0 },
    buildTime: 90,
    maintenanceCost: { metal: 1, crystal: 0, deuterium: 0 },
    unlockRequirements: {},
  },

  {
    id: 'sup-moment-adv',
    name: 'Rigid Moment Frame',
    category: 'superstructure', subCategory: 'moment-frame',
    structureClass: 'advanced', structureSubClass: 'expert',
    structureType: 'steel', structureSubType: 'heavy',
    rank: 'Craftsman', title: 'Frame Engineer',
    tier: 15, maxTier: 99, level: 1, maxLevel: 999,
    descriptions: {
      main: 'Fully restrained beam-column connections that resist lateral loads through bending.',
      sub: 'Offers architectural flexibility — no shear walls required.',
      lore: 'Popularized by mid-rise corporate towers before atmospheric colonization.',
      technicalDetail: 'Connections must develop full plastic moment capacity of the connected beam.',
    },
    stats: { base: BASE_STATS_ADVANCED, sub: BASE_SUB_STATS_ADVANCED },
    attributes: { core: BASE_ATTRS_ADVANCED, sub: BASE_SUB_ATTRS_ADVANCED },
    subjects: ['load-transfer', 'seismic-isolation', 'resonance-control'],
    cost: { metal: 1200, crystal: 400, deuterium: 100 },
    buildTime: 600,
    maintenanceCost: { metal: 12, crystal: 4, deuterium: 2 },
    unlockRequirements: { minTier: 15 },
  },

  {
    id: 'sup-truss-leg',
    name: 'Long-Span Space Truss',
    category: 'superstructure', subCategory: 'truss-frame',
    structureClass: 'legendary', structureSubClass: 'grandmaster',
    structureType: 'alloy', structureSubType: 'macro',
    rank: 'Legendary', title: 'Legendary Builder',
    tier: 55, maxTier: 99, level: 1, maxLevel: 999,
    descriptions: {
      main: 'Three-dimensional lattice truss spanning kilometers without intermediate supports.',
      sub: 'Enables unobstructed interior volumes for massive construction projects.',
      lore: 'Derived from orbital solar-array framing research.',
      technicalDetail: 'Nodal joints use interlocking spherical connectors rated for multi-axial tension.',
    },
    stats: { base: BASE_STATS_LEGENDARY, sub: BASE_SUB_STATS_LEGENDARY },
    attributes: { core: BASE_ATTRS_LEGENDARY, sub: BASE_SUB_ATTRS_LEGENDARY },
    subjects: ['load-transfer', 'resonance-control', 'thermal-management'],
    cost: { metal: 60000, crystal: 20000, deuterium: 8000 },
    buildTime: 9600,
    maintenanceCost: { metal: 600, crystal: 200, deuterium: 80 },
    unlockRequirements: { minTier: 55 },
  },

  // ── 3. SHELL ──────────────────────────────────────────────────────────────

  {
    id: 'shell-clad-std',
    name: 'Standard Cladding Panel',
    category: 'shell', subCategory: 'external-cladding',
    structureClass: 'standard', structureSubClass: 'basic',
    structureType: 'composite', structureSubType: 'light',
    rank: 'Apprentice', title: 'Framer',
    tier: 1, maxTier: 99, level: 1, maxLevel: 999,
    descriptions: {
      main: 'Prefabricated exterior panels providing weatherproofing and insulation.',
      sub: 'Snap-fit attachment system for rapid installation.',
      lore: 'Descended from prefab housing technology developed for early colonists.',
      technicalDetail: 'Panel joints sealed with silicone-based weatherseal rated from -80 C to +180 C.',
    },
    stats: { base: BASE_STATS_STANDARD, sub: BASE_SUB_STATS_STANDARD },
    attributes: { core: BASE_ATTRS_STANDARD, sub: BASE_SUB_ATTRS_STANDARD },
    subjects: ['thermal-management'],
    cost: { metal: 100, crystal: 40, deuterium: 0 },
    buildTime: 60,
    maintenanceCost: { metal: 1, crystal: 0, deuterium: 0 },
    unlockRequirements: {},
  },

  {
    id: 'shell-curtain-adv',
    name: 'Structural Glazed Curtain Wall',
    category: 'shell', subCategory: 'curtain-wall',
    structureClass: 'advanced', structureSubClass: 'intermediate',
    structureType: 'crystal-lattice', structureSubType: 'medium',
    rank: 'Craftsman', title: 'Frame Engineer',
    tier: 20, maxTier: 99, level: 1, maxLevel: 999,
    descriptions: {
      main: 'Non-load-bearing transparent envelope suspended from the primary frame.',
      sub: 'Maximizes natural lighting while maintaining thermal performance.',
      lore: 'Evolved from the transparent bio-domes of early terraformed worlds.',
      technicalDetail: 'Silicone structural glazing transfers wind load to mullion system at 6 kPa design pressure.',
    },
    stats: { base: BASE_STATS_ADVANCED, sub: BASE_SUB_STATS_ADVANCED },
    attributes: { core: BASE_ATTRS_ADVANCED, sub: BASE_SUB_ATTRS_ADVANCED },
    subjects: ['thermal-management'],
    cost: { metal: 600, crystal: 900, deuterium: 100 },
    buildTime: 360,
    maintenanceCost: { metal: 6, crystal: 9, deuterium: 1 },
    unlockRequirements: { minTier: 20 },
  },

  // ── 4. INTERIOR ───────────────────────────────────────────────────────────

  {
    id: 'int-part-std',
    name: 'Gypsum Partition System',
    category: 'interior', subCategory: 'partition-system',
    structureClass: 'standard', structureSubClass: 'basic',
    structureType: 'composite', structureSubType: 'light',
    rank: 'Apprentice', title: 'Framer',
    tier: 1, maxTier: 99, level: 1, maxLevel: 999,
    descriptions: {
      main: 'Lightweight demountable walls for flexible floor-plan layouts.',
      sub: 'Integrates cabling and ductwork within partition cavities.',
      lore: 'A staple of habitation modules across the colonized worlds.',
      technicalDetail: 'Steel stud framing at 600 mm centres; STC rating 40 in base configuration.',
    },
    stats: { base: BASE_STATS_STANDARD, sub: BASE_SUB_STATS_STANDARD },
    attributes: { core: BASE_ATTRS_STANDARD, sub: BASE_SUB_ATTRS_STANDARD },
    subjects: ['load-transfer'],
    cost: { metal: 80, crystal: 20, deuterium: 0 },
    buildTime: 45,
    maintenanceCost: { metal: 0, crystal: 0, deuterium: 0 },
    unlockRequirements: {},
  },

  {
    id: 'int-floor-adv',
    name: 'Composite Floor Deck',
    category: 'interior', subCategory: 'floor-deck',
    structureClass: 'advanced', structureSubClass: 'intermediate',
    structureType: 'steel', structureSubType: 'medium',
    rank: 'Journeyman', title: 'Structural Framer',
    tier: 8, maxTier: 99, level: 1, maxLevel: 999,
    descriptions: {
      main: 'Profiled steel deck acting compositely with a concrete topping slab.',
      sub: 'Reduces structural depth while increasing floor stiffness.',
      lore: 'Standard in mid-density habitation towers throughout the sector.',
      technicalDetail: 'Shear studs welded at deck flute crests to develop composite action.',
    },
    stats: { base: BASE_STATS_ADVANCED, sub: BASE_SUB_STATS_ADVANCED },
    attributes: { core: BASE_ATTRS_ADVANCED, sub: BASE_SUB_ATTRS_ADVANCED },
    subjects: ['load-transfer', 'resonance-control'],
    cost: { metal: 500, crystal: 100, deuterium: 20 },
    buildTime: 240,
    maintenanceCost: { metal: 5, crystal: 1, deuterium: 0 },
    unlockRequirements: { minTier: 8 },
  },

  // ── 5. MECHANICAL ─────────────────────────────────────────────────────────

  {
    id: 'mech-hvac-std',
    name: 'HVAC Structural Frame',
    category: 'mechanical', subCategory: 'hvac-frame',
    structureClass: 'standard', structureSubClass: 'basic',
    structureType: 'steel', structureSubType: 'light',
    rank: 'Apprentice', title: 'Framer',
    tier: 2, maxTier: 99, level: 1, maxLevel: 999,
    descriptions: {
      main: 'Dedicated framing system supporting HVAC ducts, coils, and fans.',
      sub: 'Isolated from primary structure to prevent vibration transmission.',
      lore: 'Climate control is the backbone of habitation in hostile environments.',
      technicalDetail: 'Spring isolators at duct hangers; inertia pads under fan units.',
    },
    stats: { base: BASE_STATS_STANDARD, sub: BASE_SUB_STATS_STANDARD },
    attributes: { core: BASE_ATTRS_STANDARD, sub: BASE_SUB_ATTRS_STANDARD },
    subjects: ['resonance-control', 'thermal-management'],
    cost: { metal: 180, crystal: 60, deuterium: 10 },
    buildTime: 100,
    maintenanceCost: { metal: 2, crystal: 1, deuterium: 0 },
    unlockRequirements: {},
  },

  {
    id: 'mech-elev-adv',
    name: 'High-Rise Elevator Shaft',
    category: 'mechanical', subCategory: 'elevator-shaft',
    structureClass: 'advanced', structureSubClass: 'expert',
    structureType: 'alloy', structureSubType: 'heavy',
    rank: 'Craftsman', title: 'Frame Engineer',
    tier: 18, maxTier: 99, level: 1, maxLevel: 999,
    descriptions: {
      main: 'Reinforced vertical shaft housing magnetic-levitation elevator cars.',
      sub: 'Doubles as a lateral force-resisting core element.',
      lore: 'Maglev shafts enable transit in megastructures spanning hundreds of floors.',
      technicalDetail: 'Guide rail tolerance plus or minus 0.3 mm; seismic isolator at base of guide rail bracket.',
    },
    stats: { base: BASE_STATS_ADVANCED, sub: BASE_SUB_STATS_ADVANCED },
    attributes: { core: BASE_ATTRS_ADVANCED, sub: BASE_SUB_ATTRS_ADVANCED },
    subjects: ['load-transfer', 'resonance-control'],
    cost: { metal: 2000, crystal: 500, deuterium: 200 },
    buildTime: 1200,
    maintenanceCost: { metal: 20, crystal: 5, deuterium: 2 },
    unlockRequirements: { minTier: 18 },
  },

  // ── 6. ELECTRICAL ─────────────────────────────────────────────────────────

  {
    id: 'elec-grid-std',
    name: 'Power Grid Frame Rack',
    category: 'electrical', subCategory: 'power-grid-frame',
    structureClass: 'standard', structureSubClass: 'basic',
    structureType: 'steel', structureSubType: 'light',
    rank: 'Apprentice', title: 'Framer',
    tier: 1, maxTier: 99, level: 1, maxLevel: 999,
    descriptions: {
      main: 'Modular steel racking for bus bars, switchgear, and distribution panels.',
      sub: 'Ground-bonded for electrical safety; fire-rated enclosure.',
      lore: 'Every building requires a power spine; this is the simplest viable form.',
      technicalDetail: 'Rated for 150 kA prospective short-circuit current; painted red oxide primer.',
    },
    stats: { base: BASE_STATS_STANDARD, sub: BASE_SUB_STATS_STANDARD },
    attributes: { core: BASE_ATTRS_STANDARD, sub: BASE_SUB_ATTRS_STANDARD },
    subjects: ['thermal-management'],
    cost: { metal: 120, crystal: 80, deuterium: 0 },
    buildTime: 75,
    maintenanceCost: { metal: 1, crystal: 1, deuterium: 0 },
    unlockRequirements: {},
  },

  {
    id: 'elec-comm-adv',
    name: 'Comm Conduit Lattice',
    category: 'electrical', subCategory: 'comm-conduit-frame',
    structureClass: 'advanced', structureSubClass: 'intermediate',
    structureType: 'nano-fiber', structureSubType: 'micro',
    rank: 'Journeyman', title: 'Structural Framer',
    tier: 12, maxTier: 99, level: 1, maxLevel: 999,
    descriptions: {
      main: 'High-density nano-fiber tray system routing quantum optical communication cables.',
      sub: 'Maintains cable separation and bend-radius compliance for signal integrity.',
      lore: 'Quantum comms require pristine cable management or coherence is lost.',
      technicalDetail: 'Minimum bend radius 50 mm; EMI shielded tray lids rated 120 dB attenuation.',
    },
    stats: { base: BASE_STATS_ADVANCED, sub: BASE_SUB_STATS_ADVANCED },
    attributes: { core: BASE_ATTRS_ADVANCED, sub: BASE_SUB_ATTRS_ADVANCED },
    subjects: ['thermal-management', 'quantum-entanglement-framing'],
    cost: { metal: 400, crystal: 600, deuterium: 50 },
    buildTime: 300,
    maintenanceCost: { metal: 4, crystal: 6, deuterium: 1 },
    unlockRequirements: { minTier: 12 },
  },

  // ── 7. PLUMBING ───────────────────────────────────────────────────────────

  {
    id: 'plumb-chase-std',
    name: 'Pipe Chase Frame',
    category: 'plumbing', subCategory: 'pipe-chase-frame',
    structureClass: 'standard', structureSubClass: 'basic',
    structureType: 'steel', structureSubType: 'light',
    rank: 'Apprentice', title: 'Framer',
    tier: 1, maxTier: 99, level: 1, maxLevel: 999,
    descriptions: {
      main: 'Vertical framed cavity routing supply, waste, and vent pipe stacks.',
      sub: 'Fire-stopped at each floor level to prevent vertical fire spread.',
      lore: 'Clean water delivery and waste removal are survival priorities on any world.',
      technicalDetail: 'Chase framing in 40 x 40 mm steel angles with mid-height restraint straps.',
    },
    stats: { base: BASE_STATS_STANDARD, sub: BASE_SUB_STATS_STANDARD },
    attributes: { core: BASE_ATTRS_STANDARD, sub: BASE_SUB_ATTRS_STANDARD },
    subjects: ['thermal-management'],
    cost: { metal: 90, crystal: 20, deuterium: 5 },
    buildTime: 50,
    maintenanceCost: { metal: 1, crystal: 0, deuterium: 0 },
    unlockRequirements: {},
  },

  // ── 8. THERMAL ────────────────────────────────────────────────────────────

  {
    id: 'therm-barrier-adv',
    name: 'Thermal Barrier Frame',
    category: 'thermal', subCategory: 'thermal-barrier-frame',
    structureClass: 'advanced', structureSubClass: 'expert',
    structureType: 'ceramic', structureSubType: 'medium',
    rank: 'Craftsman', title: 'Frame Engineer',
    tier: 14, maxTier: 99, level: 1, maxLevel: 999,
    descriptions: {
      main: 'Ceramic composite framing incorporating aerogel insulation within structural members.',
      sub: 'Reduces thermal bridging between exterior and interior zones.',
      lore: 'Extreme temperature differentials in deep space demand radical insulation solutions.',
      technicalDetail: 'Effective thermal conductivity not exceeding 0.015 W per m per K at operating temperature range.',
    },
    stats: { base: BASE_STATS_ADVANCED, sub: BASE_SUB_STATS_ADVANCED },
    attributes: { core: BASE_ATTRS_ADVANCED, sub: BASE_SUB_ATTRS_ADVANCED },
    subjects: ['thermal-management'],
    cost: { metal: 700, crystal: 300, deuterium: 80 },
    buildTime: 420,
    maintenanceCost: { metal: 7, crystal: 3, deuterium: 1 },
    unlockRequirements: { minTier: 14 },
  },

  // ── 9. ACOUSTIC ───────────────────────────────────────────────────────────

  {
    id: 'acou-iso-std',
    name: 'Sound Isolation Frame',
    category: 'acoustic', subCategory: 'sound-isolation-frame',
    structureClass: 'standard', structureSubClass: 'basic',
    structureType: 'composite', structureSubType: 'medium',
    rank: 'Apprentice', title: 'Framer',
    tier: 3, maxTier: 99, level: 1, maxLevel: 999,
    descriptions: {
      main: 'Resilient channel mounting system decoupling wall or ceiling linings from structure.',
      sub: 'Provides 10 to 15 dB additional airborne sound insulation over direct-fixed assembly.',
      lore: 'Dense multi-species habitation demands acoustic privacy for all residents.',
      technicalDetail: 'Z-channel clips at 400 mm centres; no rigid connections through to primary structure.',
    },
    stats: { base: BASE_STATS_STANDARD, sub: BASE_SUB_STATS_STANDARD },
    attributes: { core: BASE_ATTRS_STANDARD, sub: BASE_SUB_ATTRS_STANDARD },
    subjects: ['resonance-control'],
    cost: { metal: 100, crystal: 30, deuterium: 0 },
    buildTime: 60,
    maintenanceCost: { metal: 1, crystal: 0, deuterium: 0 },
    unlockRequirements: {},
  },

  // ── 10. SEISMIC ───────────────────────────────────────────────────────────

  {
    id: 'seis-iso-adv',
    name: 'Base Isolation Frame',
    category: 'seismic', subCategory: 'seismic-isolator-frame',
    structureClass: 'advanced', structureSubClass: 'master',
    structureType: 'alloy', structureSubType: 'heavy',
    rank: 'Expert', title: 'Principal Framer',
    tier: 25, maxTier: 99, level: 1, maxLevel: 999,
    descriptions: {
      main: 'Isolator pad support frame decoupling the superstructure from seismic ground motion.',
      sub: 'Reduces floor accelerations by up to 80% during design-level earthquakes.',
      lore: 'Mandatory on tectonic-class planets after the Sigma IV structural collapse.',
      technicalDetail: 'Lead-rubber bearing diameter 900 mm; vertical stiffness 2000 kN per mm.',
    },
    stats: { base: BASE_STATS_ADVANCED, sub: BASE_SUB_STATS_ADVANCED },
    attributes: { core: BASE_ATTRS_ADVANCED, sub: BASE_SUB_ATTRS_ADVANCED },
    subjects: ['seismic-isolation', 'load-transfer'],
    cost: { metal: 3000, crystal: 800, deuterium: 200 },
    buildTime: 1800,
    maintenanceCost: { metal: 30, crystal: 8, deuterium: 2 },
    unlockRequirements: { minTier: 25 },
  },

  // ── 11. ORBITAL-FRAME ─────────────────────────────────────────────────────

  {
    id: 'orb-zerog-adv',
    name: 'Zero-G Lattice Frame',
    category: 'orbital-frame', subCategory: 'zero-g-lattice',
    structureClass: 'advanced', structureSubClass: 'expert',
    structureType: 'alloy', structureSubType: 'light',
    rank: 'Craftsman', title: 'Frame Engineer',
    tier: 22, maxTier: 99, level: 1, maxLevel: 999,
    descriptions: {
      main: 'Triangulated truss lattice designed for zero-gravity assembly and operation.',
      sub: 'Members are pre-stressed to compensate for thermal cycling in orbit.',
      lore: 'First deployed on the Proxima orbital ring construction project.',
      technicalDetail: 'All joints are pinned to eliminate bending moments; axial loads only.',
    },
    stats: { base: BASE_STATS_ADVANCED, sub: BASE_SUB_STATS_ADVANCED },
    attributes: { core: BASE_ATTRS_ADVANCED, sub: BASE_SUB_ATTRS_ADVANCED },
    subjects: ['load-transfer', 'thermal-management', 'resonance-control'],
    cost: { metal: 5000, crystal: 2000, deuterium: 500 },
    buildTime: 3600,
    maintenanceCost: { metal: 50, crystal: 20, deuterium: 5 },
    unlockRequirements: { minTier: 22 },
  },

  {
    id: 'orb-tether-leg',
    name: 'Tether Ring Megaframe',
    category: 'orbital-frame', subCategory: 'tether-ring-frame',
    structureClass: 'legendary', structureSubClass: 'grandmaster',
    structureType: 'nano-fiber', structureSubType: 'macro',
    rank: 'Legendary', title: 'Legendary Builder',
    tier: 60, maxTier: 99, level: 1, maxLevel: 999,
    descriptions: {
      main: 'Kilometre-diameter ring frame providing anchor points for orbital tether systems.',
      sub: 'Rotates at precise angular velocity to maintain constant tension in tethers.',
      lore: 'Space elevators became viable only with the advent of nano-fiber tether rings.',
      technicalDetail: 'Tensile hoop stress 4.2 GPa; rotation rate 0.0022 rad per s at operational altitude.',
    },
    stats: { base: BASE_STATS_LEGENDARY, sub: BASE_SUB_STATS_LEGENDARY },
    attributes: { core: BASE_ATTRS_LEGENDARY, sub: BASE_SUB_ATTRS_LEGENDARY },
    subjects: ['load-transfer', 'thermal-management', 'resonance-control'],
    cost: { metal: 200000, crystal: 100000, deuterium: 50000 },
    buildTime: 43200,
    maintenanceCost: { metal: 2000, crystal: 1000, deuterium: 500 },
    unlockRequirements: { minTier: 60 },
  },

  // ── 12. SUBTERRANEAN ──────────────────────────────────────────────────────

  {
    id: 'sub-tunnel-adv',
    name: 'Tunnel Bore Frame',
    category: 'subterranean', subCategory: 'tunnel-bore-frame',
    structureClass: 'advanced', structureSubClass: 'expert',
    structureType: 'concrete', structureSubType: 'heavy',
    rank: 'Craftsman', title: 'Frame Engineer',
    tier: 16, maxTier: 99, level: 1, maxLevel: 999,
    descriptions: {
      main: 'Precast segmental tunnel lining installed directly behind the boring machine.',
      sub: 'Withstands groundwater pressure and surrounding soil or rock stresses.',
      lore: 'Subterranean cities were the first refuge from hostile surface conditions.',
      technicalDetail: 'Segment joints use EPDM gaskets; bolted connections provide annular stiffness.',
    },
    stats: { base: BASE_STATS_ADVANCED, sub: BASE_SUB_STATS_ADVANCED },
    attributes: { core: BASE_ATTRS_ADVANCED, sub: BASE_SUB_ATTRS_ADVANCED },
    subjects: ['load-transfer', 'seismic-isolation'],
    cost: { metal: 3500, crystal: 700, deuterium: 300 },
    buildTime: 2400,
    maintenanceCost: { metal: 35, crystal: 7, deuterium: 3 },
    unlockRequirements: { minTier: 16 },
  },

  {
    id: 'sub-cavern-leg',
    name: 'Cavern Reinforcement Shell',
    category: 'subterranean', subCategory: 'cavern-reinforcement',
    structureClass: 'legendary', structureSubClass: 'master',
    structureType: 'plasma-weld', structureSubType: 'ultra-heavy',
    rank: 'Mythic', title: 'Mythic Fabricator',
    tier: 65, maxTier: 99, level: 1, maxLevel: 999,
    descriptions: {
      main: 'Plasma-welded mega-shell conforming to natural cavern geometry for underground city vaults.',
      sub: 'Provides hoop tension reinforcement to counteract lithostatic pressure.',
      lore: 'The deep city of Vela Prime was built inside a hollowed-out asteroid with this technology.',
      technicalDetail: 'Shell thickness varies from 3 m at crown to 8 m at spring-line; plasma weld seams every 25 m.',
    },
    stats: { base: BASE_STATS_LEGENDARY, sub: BASE_SUB_STATS_LEGENDARY },
    attributes: { core: BASE_ATTRS_LEGENDARY, sub: BASE_SUB_ATTRS_LEGENDARY },
    subjects: ['load-transfer', 'seismic-isolation', 'thermal-management'],
    cost: { metal: 150000, crystal: 50000, deuterium: 20000 },
    buildTime: 86400,
    maintenanceCost: { metal: 1500, crystal: 500, deuterium: 200 },
    unlockRequirements: { minTier: 65 },
  },

  // ── 13. MODULAR ───────────────────────────────────────────────────────────

  {
    id: 'mod-snap-std',
    name: 'Snap-Lock Module Frame',
    category: 'modular', subCategory: 'snap-lock-module',
    structureClass: 'standard', structureSubClass: 'intermediate',
    structureType: 'alloy', structureSubType: 'medium',
    rank: 'Journeyman', title: 'Structural Framer',
    tier: 5, maxTier: 99, level: 1, maxLevel: 999,
    descriptions: {
      main: 'Standardised module frames with snap-fit connectors for rapid field assembly.',
      sub: 'Permits reconfiguration without special tools or heavy equipment.',
      lore: 'Deployed by rapid-response colonization teams across hundreds of worlds.',
      technicalDetail: 'Spring-loaded locking pins rated 40 kN shear; twist-release mechanism for disassembly.',
    },
    stats: { base: BASE_STATS_STANDARD, sub: BASE_SUB_STATS_STANDARD },
    attributes: { core: BASE_ATTRS_STANDARD, sub: BASE_SUB_ATTRS_STANDARD },
    subjects: ['load-transfer'],
    cost: { metal: 300, crystal: 80, deuterium: 10 },
    buildTime: 90,
    maintenanceCost: { metal: 3, crystal: 1, deuterium: 0 },
    unlockRequirements: { minTier: 5 },
  },

  {
    id: 'mod-reconfig-adv',
    name: 'Reconfigurable Pod System',
    category: 'modular', subCategory: 'reconfigurable-pod',
    structureClass: 'advanced', structureSubClass: 'expert',
    structureType: 'composite', structureSubType: 'hybrid',
    rank: 'Specialist', title: 'Senior Engineer',
    tier: 30, maxTier: 99, level: 1, maxLevel: 999,
    descriptions: {
      main: 'Intelligent self-reconfiguring modular pods repositioning based on usage patterns.',
      sub: 'Embedded actuators and AI-driven logistics optimize space utilization continuously.',
      lore: 'Adaptive architecture became essential when populations outgrew static planning.',
      technicalDetail: 'Linear actuators rated 200 kN; reconfiguration cycle time 4 hours.',
    },
    stats: { base: BASE_STATS_ADVANCED, sub: BASE_SUB_STATS_ADVANCED },
    attributes: { core: BASE_ATTRS_ADVANCED, sub: BASE_SUB_ATTRS_ADVANCED },
    subjects: ['load-transfer', 'resonance-control'],
    cost: { metal: 8000, crystal: 3000, deuterium: 500 },
    buildTime: 4800,
    maintenanceCost: { metal: 80, crystal: 30, deuterium: 5 },
    unlockRequirements: { minTier: 30 },
  },

  // ── 14. MEGAFRAME ─────────────────────────────────────────────────────────

  {
    id: 'mega-truss-leg',
    name: 'Macro Truss Megaframe',
    category: 'megaframe', subCategory: 'macro-truss',
    structureClass: 'legendary', structureSubClass: 'grandmaster',
    structureType: 'alloy', structureSubType: 'macro',
    rank: 'Master', title: 'Master Architect',
    tier: 45, maxTier: 99, level: 1, maxLevel: 999,
    descriptions: {
      main: 'Multi-kilometre primary truss frame supporting entire city districts.',
      sub: 'Acts as a mega-truss transfer structure allowing buildings within the truss volume.',
      lore: 'When you need to build a city on top of a city, you build a megaframe first.',
      technicalDetail: 'Chord section 10 m by 10 m box girder; diagonal web members 2 m diameter tubes.',
    },
    stats: { base: BASE_STATS_LEGENDARY, sub: BASE_SUB_STATS_LEGENDARY },
    attributes: { core: BASE_ATTRS_LEGENDARY, sub: BASE_SUB_ATTRS_LEGENDARY },
    subjects: ['load-transfer', 'resonance-control', 'thermal-management'],
    cost: { metal: 500000, crystal: 100000, deuterium: 30000 },
    buildTime: 172800,
    maintenanceCost: { metal: 5000, crystal: 1000, deuterium: 300 },
    unlockRequirements: { minTier: 45 },
  },

  {
    id: 'mega-arch-mythic',
    name: 'Planet-Span Arch',
    category: 'megaframe', subCategory: 'planet-span-arch',
    structureClass: 'mythic', structureSubClass: 'grandmaster',
    structureType: 'graviton-mesh', structureSubType: 'ultra-heavy',
    rank: 'Ascendant', title: 'Ascendant Framer',
    tier: 85, maxTier: 99, level: 1, maxLevel: 999,
    descriptions: {
      main: 'A graviton-mesh arch spanning continental distances, supporting floating city platforms.',
      sub: 'Self-compensates for planetary rotation and tidal forces via active gravity nodes.',
      lore: 'The Empire of Auren built three planet-span arches before ascending to hyperspace.',
      technicalDetail: 'Graviton node spacing 50 km; active control frequency 0.1 Hz; total span 14000 km.',
    },
    stats: { base: BASE_STATS_LEGENDARY, sub: BASE_SUB_STATS_LEGENDARY },
    attributes: { core: BASE_ATTRS_LEGENDARY, sub: BASE_SUB_ATTRS_LEGENDARY },
    subjects: ['load-transfer', 'temporal-anchoring', 'quantum-entanglement-framing'],
    cost: { metal: 10000000, crystal: 5000000, deuterium: 2000000 },
    buildTime: 2592000,
    maintenanceCost: { metal: 100000, crystal: 50000, deuterium: 20000 },
    unlockRequirements: { minTier: 85 },
  },

  // ── 15. ADAPTIVE ──────────────────────────────────────────────────────────

  {
    id: 'adapt-heal-adv',
    name: 'Self-Healing Frame Matrix',
    category: 'adaptive', subCategory: 'self-healing-frame',
    structureClass: 'advanced', structureSubClass: 'expert',
    structureType: 'nano-fiber', structureSubType: 'resonant',
    rank: 'Expert', title: 'Principal Framer',
    tier: 35, maxTier: 99, level: 1, maxLevel: 999,
    descriptions: {
      main: 'Nano-capsule embedded frame members releasing bonding agents to seal cracks autonomously.',
      sub: 'Eliminates undetected crack growth as a failure mode.',
      lore: 'Bio-inspired by the self-repair mechanisms of living organisms.',
      technicalDetail: 'Capsule density 12000 per square metre; healing agent viscosity 0.8 Pa per s at 20 C.',
    },
    stats: { base: BASE_STATS_ADVANCED, sub: BASE_SUB_STATS_ADVANCED },
    attributes: { core: BASE_ATTRS_ADVANCED, sub: BASE_SUB_ATTRS_ADVANCED },
    subjects: ['load-transfer', 'resonance-control', 'thermal-management'],
    cost: { metal: 15000, crystal: 8000, deuterium: 2000 },
    buildTime: 7200,
    maintenanceCost: { metal: 150, crystal: 80, deuterium: 20 },
    unlockRequirements: { minTier: 35 },
  },

  // ── 16. BIONIC ────────────────────────────────────────────────────────────

  {
    id: 'bio-comp-adv',
    name: 'Bio-Composite Frame',
    category: 'bionic', subCategory: 'bio-composite-frame',
    structureClass: 'advanced', structureSubClass: 'expert',
    structureType: 'composite', structureSubType: 'hybrid',
    rank: 'Specialist', title: 'Senior Engineer',
    tier: 28, maxTier: 99, level: 1, maxLevel: 999,
    descriptions: {
      main: 'Living mycelium-reinforced composite frame that grows stronger over time.',
      sub: 'Biological component adapts to load history, increasing cross-section where stressed.',
      lore: 'Bionic framing was pioneered by xeno-botanists on the forest world of Sylvara.',
      technicalDetail: 'Mycelium growth rate 0.5 mm per year; biological component contributes 30 percent of flexural strength after 5 years.',
    },
    stats: { base: BASE_STATS_ADVANCED, sub: BASE_SUB_STATS_ADVANCED },
    attributes: { core: BASE_ATTRS_ADVANCED, sub: BASE_SUB_ATTRS_ADVANCED },
    subjects: ['load-transfer', 'thermal-management'],
    cost: { metal: 5000, crystal: 3000, deuterium: 1000 },
    buildTime: 3600,
    maintenanceCost: { metal: 50, crystal: 30, deuterium: 10 },
    unlockRequirements: { minTier: 28 },
  },

  // ── 17. QUANTUM-LATTICE ───────────────────────────────────────────────────

  {
    id: 'qlt-entangled-leg',
    name: 'Entangled Strut Network',
    category: 'quantum-lattice', subCategory: 'entangled-strut',
    structureClass: 'legendary', structureSubClass: 'master',
    structureType: 'crystal-lattice', structureSubType: 'resonant',
    rank: 'Mythic', title: 'Mythic Fabricator',
    tier: 72, maxTier: 99, level: 1, maxLevel: 999,
    descriptions: {
      main: 'A network of quantum-entangled structural struts that share load state information instantaneously.',
      sub: 'Enables predictive load redistribution before macro-deformation can occur.',
      lore: 'Scientists once dismissed quantum structural engineering as theoretical fantasy.',
      technicalDetail: 'Coherence maintained below 15 mK; decoherence safety shutdown activates at 18 mK.',
    },
    stats: { base: BASE_STATS_LEGENDARY, sub: BASE_SUB_STATS_LEGENDARY },
    attributes: { core: BASE_ATTRS_LEGENDARY, sub: BASE_SUB_ATTRS_LEGENDARY },
    subjects: ['quantum-entanglement-framing', 'load-transfer', 'resonance-control'],
    cost: { metal: 500000, crystal: 300000, deuterium: 100000 },
    buildTime: 259200,
    maintenanceCost: { metal: 5000, crystal: 3000, deuterium: 1000 },
    unlockRequirements: { minTier: 72 },
  },

  {
    id: 'qlt-phase-mythic',
    name: 'Phase-Locked Quantum Beam',
    category: 'quantum-lattice', subCategory: 'phase-locked-beam',
    structureClass: 'mythic', structureSubClass: 'grandmaster',
    structureType: 'crystal-lattice', structureSubType: 'accelerated',
    rank: 'Ascendant', title: 'Ascendant Framer',
    tier: 88, maxTier: 99, level: 1, maxLevel: 999,
    descriptions: {
      main: 'Structural beams phase-locked to a quantum reference to maintain perfect geometry under any load.',
      sub: 'Dimensional deformation is actively corrected at quantum timescales.',
      lore: 'The Ascendant Builders used phase-locked beams to construct structures persisting across cosmic epochs.',
      technicalDetail: 'Position feedback loop at 10^15 Hz; correction actuators at sub-angstrom resolution.',
    },
    stats: { base: BASE_STATS_LEGENDARY, sub: BASE_SUB_STATS_LEGENDARY },
    attributes: { core: BASE_ATTRS_LEGENDARY, sub: BASE_SUB_ATTRS_LEGENDARY },
    subjects: ['quantum-entanglement-framing', 'temporal-anchoring', 'resonance-control'],
    cost: { metal: 2000000, crystal: 1500000, deuterium: 500000 },
    buildTime: 604800,
    maintenanceCost: { metal: 20000, crystal: 15000, deuterium: 5000 },
    unlockRequirements: { minTier: 88 },
  },

  // ── 18. TEMPORAL-ANCHOR ───────────────────────────────────────────────────

  {
    id: 'temp-chrono-leg',
    name: 'Chrono-Stabilizer Node',
    category: 'temporal-anchor', subCategory: 'chrono-stabilizer',
    structureClass: 'legendary', structureSubClass: 'master',
    structureType: 'graviton-mesh', structureSubType: 'dampened',
    rank: 'Mythic', title: 'Mythic Fabricator',
    tier: 78, maxTier: 99, level: 1, maxLevel: 999,
    descriptions: {
      main: 'Exotic-matter nodes anchoring a structural frame to a fixed temporal coordinate.',
      sub: 'Prevents relativistic time dilation from differentially aging structural members.',
      lore: 'Discovered accidentally when an orbital station near a neutron star refused to age.',
      technicalDetail: 'Exotic matter density -4.2 x 10^-27 kg per cubic metre; spatial lock radius 1 km per node.',
    },
    stats: { base: BASE_STATS_LEGENDARY, sub: BASE_SUB_STATS_LEGENDARY },
    attributes: { core: BASE_ATTRS_LEGENDARY, sub: BASE_SUB_ATTRS_LEGENDARY },
    subjects: ['temporal-anchoring', 'quantum-entanglement-framing'],
    cost: { metal: 1000000, crystal: 800000, deuterium: 300000 },
    buildTime: 1296000,
    maintenanceCost: { metal: 10000, crystal: 8000, deuterium: 3000 },
    unlockRequirements: { minTier: 78 },
  },

  {
    id: 'temp-brace-mythic',
    name: 'Temporal Brace Array',
    category: 'temporal-anchor', subCategory: 'temporal-brace',
    structureClass: 'mythic', structureSubClass: 'grandmaster',
    structureType: 'graviton-mesh', structureSubType: 'accelerated',
    rank: 'Ascendant', title: 'Ascendant Framer',
    tier: 95, maxTier: 99, level: 1, maxLevel: 999,
    descriptions: {
      main: 'A full-coverage temporal bracing array locking an entire megastructure in time.',
      sub: 'Theoretically extends structural lifespan to the heat death of the universe.',
      lore: 'Only three temporal brace arrays are known to exist, all built before recorded history.',
      technicalDetail: 'Array coherence requires 24 chrono-stabilizer nodes minimum; temporal drift under 1 ns per millennium.',
    },
    stats: { base: BASE_STATS_LEGENDARY, sub: BASE_SUB_STATS_LEGENDARY },
    attributes: { core: BASE_ATTRS_LEGENDARY, sub: BASE_SUB_ATTRS_LEGENDARY },
    subjects: ['temporal-anchoring', 'quantum-entanglement-framing', 'load-transfer'],
    cost: { metal: 9999999, crystal: 9999999, deuterium: 9999999 },
    buildTime: 31536000,
    maintenanceCost: { metal: 99999, crystal: 99999, deuterium: 99999 },
    unlockRequirements: { minTier: 95 },
  },
];

// ============================================================================
// CATEGORY METADATA
// ============================================================================

export interface FramingCategoryMeta {
  id: FramingCategory;
  label: string;
  description: string;
  subCategories: FramingSubCategory[];
  minTierUnlock: number;
  order: number;
}

export const FRAMING_CATEGORY_METADATA: Record<FramingCategory, FramingCategoryMeta> = {
  'foundation':      { id: 'foundation',      label: 'Foundation',      description: 'Base structural elements transferring loads to the ground.',                      subCategories: ['shallow-foundation', 'deep-foundation', 'special-foundation'],  minTierUnlock: 1,  order: 1  },
  'superstructure':  { id: 'superstructure',  label: 'Superstructure',  description: 'Primary vertical and lateral load-resisting frame systems.',                    subCategories: ['load-bearing-frame', 'moment-frame', 'truss-frame'],             minTierUnlock: 1,  order: 2  },
  'shell':           { id: 'shell',           label: 'Shell',           description: 'Exterior envelope framing protecting against weather and environment.',           subCategories: ['external-cladding', 'curtain-wall'],                             minTierUnlock: 1,  order: 3  },
  'interior':        { id: 'interior',        label: 'Interior',        description: 'Internal floor, wall, and partition framing systems.',                            subCategories: ['partition-system', 'floor-deck'],                                minTierUnlock: 1,  order: 4  },
  'mechanical':      { id: 'mechanical',      label: 'Mechanical',      description: 'Structural framing supporting mechanical equipment and systems.',                  subCategories: ['hvac-frame', 'elevator-shaft'],                                  minTierUnlock: 2,  order: 5  },
  'electrical':      { id: 'electrical',      label: 'Electrical',      description: 'Framing systems housing and routing electrical and communications infrastructure.', subCategories: ['power-grid-frame', 'comm-conduit-frame'],                       minTierUnlock: 1,  order: 6  },
  'plumbing':        { id: 'plumbing',        label: 'Plumbing',        description: 'Chase and service framing for fluid distribution systems.',                       subCategories: ['pipe-chase-frame'],                                             minTierUnlock: 1,  order: 7  },
  'thermal':         { id: 'thermal',         label: 'Thermal',         description: 'Insulated framing systems managing heat flow through structures.',                 subCategories: ['thermal-barrier-frame'],                                        minTierUnlock: 5,  order: 8  },
  'acoustic':        { id: 'acoustic',        label: 'Acoustic',        description: 'Vibration and sound isolation framing systems.',                                  subCategories: ['sound-isolation-frame'],                                        minTierUnlock: 3,  order: 9  },
  'seismic':         { id: 'seismic',         label: 'Seismic',         description: 'Earthquake-resistant and seismic isolation framing.',                             subCategories: ['seismic-isolator-frame'],                                       minTierUnlock: 10, order: 10 },
  'orbital-frame':   { id: 'orbital-frame',   label: 'Orbital Frame',   description: 'Space-rated structural framing for orbital and microgravity environments.',       subCategories: ['zero-g-lattice', 'tether-ring-frame'],                          minTierUnlock: 15, order: 11 },
  'subterranean':    { id: 'subterranean',    label: 'Subterranean',    description: 'Underground tunnels, caverns, and below-grade structural systems.',               subCategories: ['tunnel-bore-frame', 'cavern-reinforcement'],                    minTierUnlock: 12, order: 12 },
  'modular':         { id: 'modular',         label: 'Modular',         description: 'Prefabricated and reconfigurable modular framing systems.',                       subCategories: ['snap-lock-module', 'reconfigurable-pod'],                       minTierUnlock: 5,  order: 13 },
  'megaframe':       { id: 'megaframe',       label: 'Megaframe',       description: 'Continent and planet-scale primary structural frames.',                           subCategories: ['macro-truss', 'planet-span-arch'],                              minTierUnlock: 40, order: 14 },
  'adaptive':        { id: 'adaptive',        label: 'Adaptive',        description: 'Self-healing and environmentally responsive framing systems.',                    subCategories: ['self-healing-frame'],                                           minTierUnlock: 30, order: 15 },
  'bionic':          { id: 'bionic',          label: 'Bionic',          description: 'Living organism-inspired biological composite framing.',                          subCategories: ['bio-composite-frame'],                                          minTierUnlock: 25, order: 16 },
  'quantum-lattice': { id: 'quantum-lattice', label: 'Quantum Lattice', description: 'Quantum-entangled structural lattices for instantaneous load sharing.',           subCategories: ['entangled-strut', 'phase-locked-beam'],                         minTierUnlock: 65, order: 17 },
  'temporal-anchor': { id: 'temporal-anchor', label: 'Temporal Anchor', description: 'Exotic-matter framing anchoring structures in the temporal dimension.',           subCategories: ['chrono-stabilizer', 'temporal-brace'],                          minTierUnlock: 75, order: 18 },
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/** Get all framing structures for a given category */
export function getFramingStructuresByCategory(category: FramingCategory): FramingStructure[] {
  return FRAMING_STRUCTURES.filter(s => s.category === category);
}

/** Get all framing structures for a given sub-category */
export function getFramingStructuresBySubCategory(subCategory: FramingSubCategory): FramingStructure[] {
  return FRAMING_STRUCTURES.filter(s => s.subCategory === subCategory);
}

/** Get all framing structures of a given structural class */
export function getFramingStructuresByClass(structureClass: FramingClass): FramingStructure[] {
  return FRAMING_STRUCTURES.filter(s => s.structureClass === structureClass);
}

/** Get all framing structures unlocked at or below a given player tier */
export function getFramingStructuresForTier(playerTier: number): FramingStructure[] {
  return FRAMING_STRUCTURES.filter(s => {
    const minTier = s.unlockRequirements.minTier ?? 1;
    return playerTier >= minTier;
  });
}

/** Get a framing structure by its unique id */
export function getFramingStructureById(id: string): FramingStructure | undefined {
  return FRAMING_STRUCTURES.find(s => s.id === id);
}

/** Check whether a structure is unlocked for the given player tier and level */
export function isFramingStructureUnlocked(
  structure: FramingStructure,
  playerTier: number,
  playerLevel: number
): boolean {
  const req = structure.unlockRequirements;
  if (req.minTier  !== undefined && playerTier  < req.minTier)  return false;
  if (req.minLevel !== undefined && playerLevel < req.minLevel) return false;
  return true;
}

/** Get all category metadata sorted by their defined order */
export function getFramingCategoriesOrdered(): FramingCategoryMeta[] {
  return Object.values(FRAMING_CATEGORY_METADATA).sort((a, b) => a.order - b.order);
}

/** Get a subject entry by its id */
export function getFramingSubject(id: string): FramingSubject | undefined {
  return FRAMING_SUBJECTS.find(s => s.id === id);
}

/** Get all subject entries referenced by a given structure */
export function getFramingStructureSubjects(structure: FramingStructure): FramingSubject[] {
  return structure.subjects
    .map(id => getFramingSubject(id))
    .filter((s): s is FramingSubject => s !== undefined);
}

// ============================================================================
// CATALOGUE STATISTICS
// ============================================================================

export const FRAMING_CATALOG_STATS = {
  totalStructures:    FRAMING_STRUCTURES.length,
  totalCategories:    FRAMING_CONSTANTS.CATEGORY_COUNT,
  totalSubCategories: FRAMING_CONSTANTS.SUBCATEGORY_COUNT,
  maxTier:            FRAMING_CONSTANTS.MAX_TIER,
  maxLevel:           FRAMING_CONSTANTS.MAX_LEVEL,
  totalSubjects:      FRAMING_SUBJECTS.length,
  structuresByCategory: Object.fromEntries(
    (Object.keys(FRAMING_CATEGORY_METADATA) as FramingCategory[]).map(cat => [
      cat,
      FRAMING_STRUCTURES.filter(s => s.category === cat).length,
    ])
  ),
};
