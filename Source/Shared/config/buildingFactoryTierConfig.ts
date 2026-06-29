/**
 * Building & Factory Tier Classification System
 * Covers 1-99 tiers, each with class, subClass, type, subType, name, rank,
 * title, description, subDescription, details, stats, subStats, attributes,
 * subAttributes, subjects, and subjectDetails.
 *
 * Companion to the 1-999 level system defined in progressionSystemConfig.ts.
 */

// ============================================================================
// TYPES
// ============================================================================

export type TierClassName =
  | 'Foundational'
  | 'Structural'
  | 'Advanced'
  | 'Elite'
  | 'Masterwork'
  | 'Legendary'
  | 'Mythic'
  | 'Transcendent'
  | 'Cosmic';

export type TierSubClassName = 'Prime' | 'Ascendant' | 'Apex';

export type TierTypeName = 'Standard' | 'Enhanced' | 'Superior' | 'Pinnacle';

export type TierSubTypeName =
  | 'Alpha'
  | 'Beta'
  | 'Gamma'
  | 'Delta'
  | 'Epsilon'
  | 'Zeta'
  | 'Eta'
  | 'Theta'
  | 'Iota'
  | 'Kappa'
  | 'Lambda';

export type TierRankName =
  | 'Initiate'
  | 'Apprentice'
  | 'Journeyman'
  | 'Expert'
  | 'Master'
  | 'Champion'
  | 'Legend'
  | 'Transcendent'
  | 'Cosmic';

export interface TierStats {
  production: number;
  efficiency: number;
  capacity: number;
  speed: number;
}

export interface TierSubStats {
  maintenance: number;
  durability: number;
  resilience: number;
  upkeep: number;
}

export interface TierAttributes {
  powerDraw: number;
  crewRequired: number;
  automationLevel: number;
  constructionCost: number;
}

export interface TierSubAttributes {
  synergyBonus: number;
  expansionSlots: number;
  overrideCapable: boolean;
  environmentalResistance: number;
}

export interface BuildingFactoryTierDefinition {
  tier: number;
  name: string;
  class: TierClassName;
  subClass: TierSubClassName;
  type: TierTypeName;
  subType: TierSubTypeName;
  rank: TierRankName;
  title: string;
  description: string;
  subDescription: string;
  details: string;
  stats: TierStats;
  subStats: TierSubStats;
  attributes: TierAttributes;
  subAttributes: TierSubAttributes;
  subjects: string[];
  subjectDetails: Record<string, string>;
}

// ============================================================================
// CLASSIFICATION TABLES
// ============================================================================

const TIER_CLASS_NAMES: TierClassName[] = [
  'Foundational',
  'Structural',
  'Advanced',
  'Elite',
  'Masterwork',
  'Legendary',
  'Mythic',
  'Transcendent',
  'Cosmic',
];

const TIER_SUBCLASS_NAMES: TierSubClassName[] = ['Prime', 'Ascendant', 'Apex'];

const TIER_TYPE_NAMES: TierTypeName[] = ['Standard', 'Enhanced', 'Superior', 'Pinnacle'];

const TIER_SUBTYPE_NAMES: TierSubTypeName[] = [
  'Alpha',
  'Beta',
  'Gamma',
  'Delta',
  'Epsilon',
  'Zeta',
  'Eta',
  'Theta',
  'Iota',
  'Kappa',
  'Lambda',
];

const TIER_RANK_NAMES: TierRankName[] = [
  'Initiate',
  'Apprentice',
  'Journeyman',
  'Expert',
  'Master',
  'Champion',
  'Legend',
  'Transcendent',
  'Cosmic',
];

const TIER_TITLE_SUFFIXES: string[] = [
  'Architect',
  'Planner',
  'Builder',
  'Engineer',
  'Constructor',
  'Designer',
  'Creator',
  'Visionary',
  'Ascendant',
];

const TIER_CLASS_DESCRIPTIONS: Record<TierClassName, string> = {
  Foundational:
    'Foundational tier structures represent the initial stage of building and factory development, focused on basic resource extraction and elementary production workflows.',
  Structural:
    'Structural tier facilities enable organized industrial operations with improved efficiency, expanded production lines, and coordinated workforce management.',
  Advanced:
    'Advanced tier buildings exhibit high-performance capabilities with specialized functions, elevated production rates, and integrated research support systems.',
  Elite:
    'Elite tier constructions operate at peak performance using superior automation, precision resource optimization, and cutting-edge operational protocols.',
  Masterwork:
    'Masterwork tier facilities demonstrate exceptional craftsmanship with near-optimal efficiency, maximum throughput, and fully autonomous production cycles.',
  Legendary:
    'Legendary tier infrastructure transcends conventional engineering, operating with revolutionary efficiency, empire-scale output, and persistent resource amplification.',
  Mythic:
    'Mythic tier structures harness exotic technologies and rare materials, achieving outputs far beyond standard theoretical limits with unparalleled reliability.',
  Transcendent:
    'Transcendent tier installations operate at the boundaries of known physics, yielding extraordinary production values and capabilities that defy conventional modeling.',
  Cosmic:
    'The Cosmic tier represents the absolute pinnacle of construction and factory science, exerting universe-scale industrial influence with near-infinite productive capacity.',
};

const TIER_SUBJECTS_BY_CLASS: Record<TierClassName, string[]> = {
  Foundational: ['Resource Extraction', 'Basic Production', 'Energy Generation', 'Foundation Systems'],
  Structural: ['Structural Engineering', 'Industrial Operations', 'Supply Chain', 'Workforce Management'],
  Advanced: ['Advanced Manufacturing', 'Research Integration', 'Defense Systems', 'Storage Optimization'],
  Elite: ['Elite Engineering', 'High-Performance Operations', 'Strategic Planning', 'System Integration'],
  Masterwork: ['Masterwork Crafting', 'Peak Efficiency', 'Autonomous Operations', 'Resource Mastery'],
  Legendary: ['Legendary Innovation', 'Revolutionary Technology', 'Empire-Scale Operations', 'Transcendent Output'],
  Mythic: ['Mythic Engineering', 'Exotic Technology', 'Reality-Bending Production', 'Universal Supply'],
  Transcendent: ['Transcendent Architecture', 'Beyond-Physics Engineering', 'Infinite Scalability', 'Dimensional Fabrication'],
  Cosmic: ['Cosmic Construction', 'Universe-Scale Capacity', 'Absolute Efficiency', 'Omnipotent Production'],
};

function buildSubjectDetails(tierClass: TierClassName, tier: number): Record<string, string> {
  const subjects = TIER_SUBJECTS_BY_CLASS[tierClass];
  const capacityPct = Math.min(100, 50 + tier);
  return {
    [subjects[0]]: `Tier ${tier} ${subjects[0].toLowerCase()} systems operate at ${capacityPct}% base capacity.`,
    [subjects[1]]: `${subjects[1]} is enabled at tier ${tier}, granting ${tier * 5} efficiency points.`,
    [subjects[2]]: `${subjects[2]} modules are unlocked, providing a ${tier * 2}% output bonus.`,
    [subjects[3]]: `${subjects[3]} integration at tier ${tier} yields a productivity score of ${tier * 3}.`,
  };
}

// ============================================================================
// TIER CATALOG (1-99)
// ============================================================================

export const BUILDING_FACTORY_TIER_CATALOG: BuildingFactoryTierDefinition[] = Array.from(
  { length: 99 },
  (_, index) => {
    const tier = index + 1;

    // Class: 9 classes across 99 tiers (≈11 tiers each, last class covers 89-99)
    const classIndex = Math.min(8, Math.floor((tier - 1) / 11));
    // SubClass: 3 sub-classes within each class block of 11 tiers (4-4-3)
    const subClassIndex = Math.min(2, Math.floor(((tier - 1) % 11) / 4));
    // Type: cycles through 4 types per position within subClass
    const typeIndex = (tier - 1) % 4;
    // SubType: 11 Greek-letter subtypes cycling within each class
    const subTypeIndex = (tier - 1) % 11;

    const tierClass = TIER_CLASS_NAMES[classIndex];
    const tierSubClass = TIER_SUBCLASS_NAMES[subClassIndex];
    const tierType = TIER_TYPE_NAMES[typeIndex];
    const tierSubType = TIER_SUBTYPE_NAMES[subTypeIndex];
    const tierRank = TIER_RANK_NAMES[classIndex];
    const tierTitleSuffix = TIER_TITLE_SUFFIXES[classIndex];

    const minLevel = (tier - 1) * 10 + 1;

    return {
      tier,
      name: `Tier ${tier} – ${tierClass} ${tierSubType}`,
      class: tierClass,
      subClass: tierSubClass,
      type: tierType,
      subType: tierSubType,
      rank: tierRank,
      title: `${tierClass} ${tierTitleSuffix} [${tierSubClass} ${tierType}]`,
      description: TIER_CLASS_DESCRIPTIONS[tierClass],
      subDescription: `${tierSubClass} ${tierType} specialization grants enhanced ${tierSubType.toLowerCase()}-phase bonuses at tier ${tier}.`,
      details: `Tier ${tier} facilities unlock ${tierClass.toLowerCase()} capabilities. SubClass: ${tierSubClass}. Type: ${tierType}. SubType: ${tierSubType}. Min Level: ${minLevel}.`,
      stats: {
        production: 10 + tier * 8,
        efficiency: parseFloat((0.5 + tier * 0.005).toFixed(3)),
        capacity: 1000 + tier * 500,
        speed: parseFloat((1.0 + tier * 0.02).toFixed(2)),
      },
      subStats: {
        maintenance: parseFloat((0.1 + tier * 0.003).toFixed(3)),
        durability: 100 + tier * 10,
        resilience: 50 + tier * 5,
        upkeep: parseFloat((0.05 + tier * 0.002).toFixed(3)),
      },
      attributes: {
        powerDraw: 10 + tier * 3,
        crewRequired: Math.max(1, Math.floor(5 + tier * 0.5)),
        automationLevel: Math.min(10, Math.floor(tier / 10) + 1),
        constructionCost: 100 + tier * 50,
      },
      subAttributes: {
        synergyBonus: parseFloat((0.01 + tier * 0.005).toFixed(3)),
        expansionSlots: Math.min(20, Math.floor(tier / 5) + 1),
        overrideCapable: tier >= 10,
        environmentalResistance: Math.min(100, tier * 2),
      },
      subjects: TIER_SUBJECTS_BY_CLASS[tierClass],
      subjectDetails: buildSubjectDetails(tierClass, tier),
    };
  }
);

// ============================================================================
// HELPERS
// ============================================================================

export function getTierDefinition(tier: number): BuildingFactoryTierDefinition | undefined {
  const bounded = Math.max(1, Math.min(99, Math.floor(tier)));
  return BUILDING_FACTORY_TIER_CATALOG[bounded - 1];
}

export function getTiersByClass(tierClass: TierClassName): BuildingFactoryTierDefinition[] {
  return BUILDING_FACTORY_TIER_CATALOG.filter(t => t.class === tierClass);
}

export function getTiersBySubClass(subClass: TierSubClassName): BuildingFactoryTierDefinition[] {
  return BUILDING_FACTORY_TIER_CATALOG.filter(t => t.subClass === subClass);
}

export function getTiersByRank(rank: TierRankName): BuildingFactoryTierDefinition[] {
  return BUILDING_FACTORY_TIER_CATALOG.filter(t => t.rank === rank);
}

export function getTierClassNames(): TierClassName[] {
  return [...TIER_CLASS_NAMES];
}

export function getTierSubClassNames(): TierSubClassName[] {
  return [...TIER_SUBCLASS_NAMES];
}

// ============================================================================
// META
// ============================================================================

export const BUILDING_FACTORY_TIER_META = {
  maxTier: 99,
  maxLevel: 999,
  totalTiers: BUILDING_FACTORY_TIER_CATALOG.length,
  classes: TIER_CLASS_NAMES,
  subClasses: TIER_SUBCLASS_NAMES,
  types: TIER_TYPE_NAMES,
  subTypes: TIER_SUBTYPE_NAMES,
  ranks: TIER_RANK_NAMES,
  classCount: TIER_CLASS_NAMES.length,
  subClassCount: TIER_SUBCLASS_NAMES.length,
  typeCount: TIER_TYPE_NAMES.length,
  subTypeCount: TIER_SUBTYPE_NAMES.length,
} as const;
