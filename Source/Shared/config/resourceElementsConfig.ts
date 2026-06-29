/**
 * Resource Elements Configuration
 * 18 new resource elements with full taxonomy:
 *   - 18 categories and 32 sub-categories
 *   - Tier class and sub-class system (1-99)
 *   - Types and sub-types
 *   - Names, ranks, and titles
 *   - Stats and sub-stats
 *   - Descriptions and sub-descriptions
 *   - Attributes and sub-attributes
 *   - Subjects and subject details
 *   - 1-999 level system
 */

import { ProgressionSystem } from './progressionSystem';

// ─────────────────────────────────────────────────────────────────────────────
// CATEGORY & SUB-CATEGORY TAXONOMY
// 18 categories, 32 sub-categories
// ─────────────────────────────────────────────────────────────────────────────

export type ResourceElementCategory =
  | 'stellar'           // 1  – Star-derived elements
  | 'nebular'           // 2  – Nebula-derived compounds
  | 'plasma'            // 3  – High-energy plasma states
  | 'quantum'           // 4  – Quantum-state materials
  | 'dimensional'       // 5  – Cross-dimensional matter
  | 'temporal'          // 6  – Time-infused substances
  | 'psionic'           // 7  – Mind-energy materials
  | 'biological'        // 8  – Organic / bio-organic matter
  | 'mechanical'        // 9  – Engineered meta-materials
  | 'crystalline'       // 10 – Advanced crystal matrices
  | 'gravitational'     // 11 – Gravity-warped matter
  | 'electromagnetic'   // 12 – EM-charged compounds
  | 'nuclear'           // 13 – Fissile / fusion materials
  | 'spectral'          // 14 – Light-spectrum materials
  | 'void'              // 15 – Void / null-space matter
  | 'cosmic'            // 16 – Universe-scale forces
  | 'ethereal'          // 17 – Spirit-realm substances
  | 'primordial';       // 18 – Pre-universe fundamentals

export type ResourceElementSubCategory =
  // stellar (2)
  | 'stellar-corona'
  | 'stellar-core'
  // nebular (2)
  | 'nebular-gas'
  | 'nebular-dust'
  // plasma (2)
  | 'plasma-cold'
  | 'plasma-hot'
  // quantum (2)
  | 'quantum-entangled'
  | 'quantum-superposed'
  // dimensional (2)
  | 'dimensional-rift'
  | 'dimensional-fold'
  // temporal (2)
  | 'temporal-echo'
  | 'temporal-shard'
  // psionic (2)
  | 'psionic-raw'
  | 'psionic-refined'
  // biological (2)
  | 'bio-organic'
  | 'bio-synthetic'
  // mechanical (2)
  | 'meta-alloy'
  | 'nano-composite'
  // crystalline (2)
  | 'crystal-lattice'
  | 'crystal-resonant'
  // gravitational (2)
  | 'graviton-dense'
  | 'graviton-fluid'
  // electromagnetic (2)
  | 'em-pulse'
  | 'em-flux'
  // nuclear (2)
  | 'fissile-core'
  | 'fusion-plasma'
  // spectral (2)
  | 'photon-dense'
  | 'spectrum-shift'
  // void (2)
  | 'void-shard'
  | 'void-essence'
  // cosmic (2)
  | 'cosmic-ray'
  | 'cosmic-string'
  // ethereal (1)
  | 'ethereal-mist'
  // primordial (1)
  | 'primordial-spark';

// ─────────────────────────────────────────────────────────────────────────────
// TIER CLASS & SUB-CLASS SYSTEM (1-99)
// ─────────────────────────────────────────────────────────────────────────────

export type TierClass =
  | 'novice'        // Tier 1-9
  | 'apprentice'    // Tier 10-19
  | 'journeyman'    // Tier 20-29
  | 'adept'         // Tier 30-39
  | 'expert'        // Tier 40-49
  | 'master'        // Tier 50-59
  | 'grandmaster'   // Tier 60-69
  | 'legendary'     // Tier 70-79
  | 'mythic'        // Tier 80-89
  | 'transcendent'; // Tier 90-99

export type TierSubClass =
  | 'alpha'   // Lower third of tier class band
  | 'beta'    // Middle third of tier class band
  | 'gamma';  // Upper third of tier class band

export function getTierClass(tier: number): TierClass {
  if (tier <= 9)  return 'novice';
  if (tier <= 19) return 'apprentice';
  if (tier <= 29) return 'journeyman';
  if (tier <= 39) return 'adept';
  if (tier <= 49) return 'expert';
  if (tier <= 59) return 'master';
  if (tier <= 69) return 'grandmaster';
  if (tier <= 79) return 'legendary';
  if (tier <= 89) return 'mythic';
  return 'transcendent';
}

export function getTierSubClass(tier: number): TierSubClass {
  const band = ((tier - 1) % 10);
  if (band <= 2) return 'alpha';
  if (band <= 6) return 'beta';
  return 'gamma';
}

// ─────────────────────────────────────────────────────────────────────────────
// TYPE & SUB-TYPE SYSTEM
// ─────────────────────────────────────────────────────────────────────────────

export type ResourceElementType =
  | 'raw'           // Unprocessed ore / gas / solid
  | 'refined'       // Processed into usable form
  | 'compound'      // Multi-element compound
  | 'alloy'         // Metal alloy
  | 'crystal'       // Crystalline form
  | 'gas'           // Gaseous state
  | 'liquid'        // Liquid state
  | 'plasma'        // Plasma state
  | 'energy'        // Pure energy form
  | 'exotic';       // Physics-defying form

export type ResourceElementSubType =
  | 'primary'       // First-order of its type
  | 'secondary'     // Derived from primary
  | 'tertiary'      // Further processed
  | 'catalytic'     // Acts as a catalyst
  | 'reactive'      // High-reactivity variant
  | 'stable'        // Low-reactivity, long shelf-life
  | 'volatile'      // Degrades rapidly
  | 'inert'         // Non-reactive, acts as buffer
  | 'charged'       // Carries electrical/EM charge
  | 'resonant';     // Resonates at specific frequencies

// ─────────────────────────────────────────────────────────────────────────────
// RANK & TITLE SYSTEM
// ─────────────────────────────────────────────────────────────────────────────

export type ResourceElementRank =
  | 'common'        // Rank 1 – Freely available
  | 'uncommon'      // Rank 2 – Moderate scarcity
  | 'rare'          // Rank 3 – Hard to find
  | 'epic'          // Rank 4 – Extremely scarce
  | 'legendary'     // Rank 5 – Near-mythical
  | 'mythic'        // Rank 6 – Once-in-an-age
  | 'divine'        // Rank 7 – Cosmically rare
  | 'primordial';   // Rank 8 – Pre-universe artifacts

export const RANK_TITLES: Record<ResourceElementRank, string> = {
  common:     'Standard-Grade Material',
  uncommon:   'Quality-Grade Material',
  rare:       'Superior-Grade Material',
  epic:       'Exceptional-Grade Material',
  legendary:  'Legendary-Grade Material',
  mythic:     'Mythic-Grade Material',
  divine:     'Divine-Grade Material',
  primordial: 'Primordial-Grade Material',
};

export const RANK_COLORS: Record<ResourceElementRank, string> = {
  common:     '#9D9D9D',
  uncommon:   '#1EFF00',
  rare:       '#0070DD',
  epic:       '#A335EE',
  legendary:  '#FF8000',
  mythic:     '#E6CC80',
  divine:     '#00CCFF',
  primordial: '#FF4500',
};

// ─────────────────────────────────────────────────────────────────────────────
// STAT & SUB-STAT SYSTEM
// ─────────────────────────────────────────────────────────────────────────────

export interface ResourceElementStats {
  // Primary stats
  purity: number;          // 0-100 – How refined the material is
  potency: number;         // 0-100 – Effective yield per unit
  stability: number;       // 0-100 – How stable it is over time
  conductivity: number;    // 0-100 – Energy transmission efficiency
  density: number;         // 0-100 – Mass per unit volume factor

  // Sub-stats
  extractionDifficulty: number;  // 0-100 – How hard to mine/gather
  processingTime: number;        // seconds per unit to refine
  halfLifeDays: number;          // decay half-life (0 = no decay)
  resonanceFrequency: number;    // Hz – 0 means non-resonant
  criticalYieldChance: number;   // 0-1 – probability of bonus yield
}

export interface ResourceElementSubStats {
  // Sub-stats derived from primary stats at runtime
  effectivePotency: number;   // potency × (purity / 100)
  decayRate: number;          // daily decay fraction from halfLifeDays
  yieldMultiplier: number;    // combined production multiplier
  processedValue: number;     // baseValue × (purity / 50)
  researchBoost: number;      // bonus to research speed (0-10)
}

// ─────────────────────────────────────────────────────────────────────────────
// ATTRIBUTE & SUB-ATTRIBUTE SYSTEM
// ─────────────────────────────────────────────────────────────────────────────

export interface ResourceElementAttributes {
  // Core attributes
  isFlammable: boolean;
  isCorrosive: boolean;
  isRadioactive: boolean;
  isMagnetic: boolean;
  isCrystalline: boolean;
  isLuminescent: boolean;
  isSuperconducting: boolean;
  isAntigravitic: boolean;
}

export interface ResourceElementSubAttributes {
  // Derived / contextual attributes
  militaryGrade: boolean;   // Cleared for military use
  researchGrade: boolean;   // High enough purity for science
  constructionGrade: boolean; // Structurally sound for building
  fuelGrade: boolean;       // Usable as propulsion fuel
  medicalGrade: boolean;    // Safe for biological applications
  diplomaticValue: boolean; // Used as trade / gift resource
}

// ─────────────────────────────────────────────────────────────────────────────
// SUBJECT & SUBJECT DETAILS SYSTEM
// ─────────────────────────────────────────────────────────────────────────────

export interface ResourceElementSubject {
  domain: string;            // Primary domain of use
  subDomain: string;         // Specific field within domain
  applicationArea: string;   // Where it is applied in the game
  relatedSystems: string[];  // Game systems that consume it
  loreReference: string;     // Short in-universe lore snippet
}

// ─────────────────────────────────────────────────────────────────────────────
// LEVEL SYSTEM (1-999) PER RESOURCE ELEMENT
// ─────────────────────────────────────────────────────────────────────────────

export interface ResourceElementLevelProfile {
  level: number;     // 1-999
  tier: number;      // 1-99 (auto-derived from level)
  tierClass: TierClass;
  tierSubClass: TierSubClass;
  /** Combined stats multiplier at this level+tier */
  totalMultiplier: number;
  /** Unlocked new abilities or bonuses at this level */
  levelMilestone: string | null;
}

export function getResourceElementLevelProfile(level: number): ResourceElementLevelProfile {
  const clamped = Math.max(1, Math.min(999, level));
  const tier = ProgressionSystem.getTierFromLevel(clamped);
  return {
    level:          clamped,
    tier,
    tierClass:      getTierClass(tier),
    tierSubClass:   getTierSubClass(tier),
    totalMultiplier: ProgressionSystem.getTotalMultiplier(clamped, tier),
    levelMilestone: getResourceLevelMilestone(clamped),
  };
}

function getResourceLevelMilestone(level: number): string | null {
  const milestones: Record<number, string> = {
    1:   'Initial unlock',
    10:  'Basic processing unlocked',
    25:  'Refined extraction technique',
    50:  'Advanced compound synthesis',
    75:  'Expert-grade refinement',
    100: 'Master processing protocols',
    150: 'Critical yield probability +5%',
    200: 'Quantum-assisted extraction',
    250: 'Resonance tuning mastered',
    300: 'Zero-decay storage achieved',
    400: 'Dimensional compression storage',
    500: 'Tier-5 processing unlocked',
    600: 'Cosmic purity threshold reached',
    700: 'Primordial resonance attuned',
    800: 'Transcendent refinery unlocked',
    900: 'Near-perfect purity achieved',
    999: 'Absolute mastery — max output',
  };
  return milestones[level] ?? null;
}

// ─────────────────────────────────────────────────────────────────────────────
// FULL RESOURCE ELEMENT DEFINITION
// ─────────────────────────────────────────────────────────────────────────────

export interface ResourceElement {
  id: string;
  name: string;
  symbol: string;
  icon: string;

  // Taxonomy
  category: ResourceElementCategory;
  subCategory: ResourceElementSubCategory;
  type: ResourceElementType;
  subType: ResourceElementSubType;

  // Rank/Title
  rank: ResourceElementRank;
  title: string;  // Flavor title derived from rank + category

  // Stats
  baseStats: ResourceElementStats;

  // Attributes
  attributes: ResourceElementAttributes;
  subAttributes: ResourceElementSubAttributes;

  // Descriptions
  description: string;         // Primary lore/gameplay description
  subDescription: string;      // Technical/secondary description

  // Subject details
  subject: ResourceElementSubject;

  // Progression
  unlockTier: number;          // Minimum tier to encounter this element
  unlockLevel: number;         // Minimum level to unlock processing
  baseProductionRate: number;  // Units per minute at level 1, tier 1
  baseStorageCapacity: number; // Max storable units at level 1, tier 1
  baseMarketValue: number;     // Credits per unit at base conditions
}

// ─────────────────────────────────────────────────────────────────────────────
// 18 NEW RESOURCE ELEMENTS
// ─────────────────────────────────────────────────────────────────────────────

export const SOLAR_PLASMA: ResourceElement = {
  id: 'solar-plasma',
  name: 'Solar Plasma',
  symbol: 'SP',
  icon: '☀️',
  category: 'stellar',
  subCategory: 'stellar-corona',
  type: 'plasma',
  subType: 'primary',
  rank: 'uncommon',
  title: 'Quality-Grade Stellar Plasma',
  baseStats: {
    purity: 60, potency: 70, stability: 45,
    conductivity: 85, density: 20,
    extractionDifficulty: 50, processingTime: 30,
    halfLifeDays: 5, resonanceFrequency: 0, criticalYieldChance: 0.05,
  },
  attributes: {
    isFlammable: true, isCorrosive: false, isRadioactive: false,
    isMagnetic: true, isCrystalline: false, isLuminescent: true,
    isSuperconducting: false, isAntigravitic: false,
  },
  subAttributes: {
    militaryGrade: false, researchGrade: true,
    constructionGrade: false, fuelGrade: true,
    medicalGrade: false, diplomaticValue: false,
  },
  description: 'Superheated ionized gas harvested directly from stellar coronae. Rich in free electrons and photons, it serves as a potent fuel and energy amplifier.',
  subDescription: 'Maintained in magnetic containment vessels. Degrades rapidly outside high-field environments; decay half-life is ~5 days without active containment.',
  subject: {
    domain: 'Energy',
    subDomain: 'Stellar Harvesting',
    applicationArea: 'Power generation, advanced propulsion',
    relatedSystems: ['powerPlant', 'propulsion', 'research'],
    loreReference: '"The stars give freely to those brave enough to reach into the fire." — Helios Expedition Log 7',
  },
  unlockTier: 5,
  unlockLevel: 40,
  baseProductionRate: 15,
  baseStorageCapacity: 20000,
  baseMarketValue: 45,
};

export const STELLAR_ASH: ResourceElement = {
  id: 'stellar-ash',
  name: 'Stellar Ash',
  symbol: 'SA',
  icon: '🌟',
  category: 'stellar',
  subCategory: 'stellar-core',
  type: 'raw',
  subType: 'secondary',
  rank: 'rare',
  title: 'Superior-Grade Stellar Residue',
  baseStats: {
    purity: 40, potency: 55, stability: 80,
    conductivity: 30, density: 90,
    extractionDifficulty: 65, processingTime: 60,
    halfLifeDays: 0, resonanceFrequency: 120, criticalYieldChance: 0.08,
  },
  attributes: {
    isFlammable: false, isCorrosive: false, isRadioactive: true,
    isMagnetic: false, isCrystalline: false, isLuminescent: true,
    isSuperconducting: false, isAntigravitic: false,
  },
  subAttributes: {
    militaryGrade: false, researchGrade: true,
    constructionGrade: true, fuelGrade: false,
    medicalGrade: false, diplomaticValue: true,
  },
  description: 'The dense residual matter ejected during stellar death events. Extraordinarily stable and laced with heavy nucleosynthesis products.',
  subDescription: 'No natural decay. Radioactive isotopes require shielded storage. Extremely high density makes it valuable as ballast and building aggregate.',
  subject: {
    domain: 'Construction & Research',
    subDomain: 'Stellar Remnants',
    applicationArea: 'Advanced alloys, orbital construction, exotic research',
    relatedSystems: ['megastructure', 'research', 'orbitalBuildings'],
    loreReference: '"What the stars leave behind is worth more than what they burned." — Dyson Ring Construction Manifesto',
  },
  unlockTier: 8,
  unlockLevel: 70,
  baseProductionRate: 8,
  baseStorageCapacity: 50000,
  baseMarketValue: 150,
};

export const NEBULA_GAS: ResourceElement = {
  id: 'nebula-gas',
  name: 'Nebula Gas',
  symbol: 'NG',
  icon: '🌌',
  category: 'nebular',
  subCategory: 'nebular-gas',
  type: 'gas',
  subType: 'primary',
  rank: 'common',
  title: 'Standard-Grade Nebula Gas',
  baseStats: {
    purity: 35, potency: 40, stability: 70,
    conductivity: 55, density: 10,
    extractionDifficulty: 20, processingTime: 15,
    halfLifeDays: 0, resonanceFrequency: 0, criticalYieldChance: 0.03,
  },
  attributes: {
    isFlammable: true, isCorrosive: false, isRadioactive: false,
    isMagnetic: false, isCrystalline: false, isLuminescent: false,
    isSuperconducting: false, isAntigravitic: false,
  },
  subAttributes: {
    militaryGrade: false, researchGrade: false,
    constructionGrade: false, fuelGrade: true,
    medicalGrade: false, diplomaticValue: false,
  },
  description: 'Diffuse interstellar gas gathered from nebula clouds. Low density but enormous volume makes collection economically viable for fuel synthesis.',
  subDescription: 'Primarily hydrogen and helium with trace compounds. Requires compression before use. Forms the feedstock for deuterium synthesis.',
  subject: {
    domain: 'Fuel Production',
    subDomain: 'Gas Harvesting',
    applicationArea: 'Deuterium production, atmospheric processing',
    relatedSystems: ['deuteriumSynthesizer', 'powerPlant'],
    loreReference: '"The nebulae are the galaxy\'s fuel reserves, waiting to be tapped." — Colonial Survey Report 3',
  },
  unlockTier: 2,
  unlockLevel: 15,
  baseProductionRate: 40,
  baseStorageCapacity: 200000,
  baseMarketValue: 5,
};

export const NEBULA_DUST: ResourceElement = {
  id: 'nebula-dust',
  name: 'Nebula Dust',
  symbol: 'ND',
  icon: '✨',
  category: 'nebular',
  subCategory: 'nebular-dust',
  type: 'raw',
  subType: 'secondary',
  rank: 'uncommon',
  title: 'Quality-Grade Nebula Particulate',
  baseStats: {
    purity: 50, potency: 45, stability: 85,
    conductivity: 20, density: 30,
    extractionDifficulty: 30, processingTime: 45,
    halfLifeDays: 0, resonanceFrequency: 0, criticalYieldChance: 0.04,
  },
  attributes: {
    isFlammable: false, isCorrosive: false, isRadioactive: false,
    isMagnetic: false, isCrystalline: true, isLuminescent: false,
    isSuperconducting: false, isAntigravitic: false,
  },
  subAttributes: {
    militaryGrade: false, researchGrade: true,
    constructionGrade: true, fuelGrade: false,
    medicalGrade: false, diplomaticValue: false,
  },
  description: 'Fine particulate matter suspended in nebulae, rich in silicates and metallic micro-grains. A precursor to many industrial alloys.',
  subDescription: 'Requires electrostatic collection arrays. Useful as a raw feedstock for metal production and exotic crystal synthesis.',
  subject: {
    domain: 'Manufacturing',
    subDomain: 'Particulate Processing',
    applicationArea: 'Metal production augmentation, crystal growth',
    relatedSystems: ['metalMine', 'crystalMine', 'research'],
    loreReference: '"From dust, the universe was built. From dust, so shall our empire rise." — Founding Charter of New Terra',
  },
  unlockTier: 3,
  unlockLevel: 20,
  baseProductionRate: 25,
  baseStorageCapacity: 80000,
  baseMarketValue: 18,
};

export const COLD_PLASMA: ResourceElement = {
  id: 'cold-plasma',
  name: 'Cold Plasma',
  symbol: 'CP',
  icon: '🔵',
  category: 'plasma',
  subCategory: 'plasma-cold',
  type: 'plasma',
  subType: 'stable',
  rank: 'uncommon',
  title: 'Quality-Grade Cold Plasma',
  baseStats: {
    purity: 75, potency: 50, stability: 90,
    conductivity: 95, density: 15,
    extractionDifficulty: 40, processingTime: 20,
    halfLifeDays: 30, resonanceFrequency: 440, criticalYieldChance: 0.06,
  },
  attributes: {
    isFlammable: false, isCorrosive: true, isRadioactive: false,
    isMagnetic: true, isCrystalline: false, isLuminescent: true,
    isSuperconducting: true, isAntigravitic: false,
  },
  subAttributes: {
    militaryGrade: true, researchGrade: true,
    constructionGrade: false, fuelGrade: false,
    medicalGrade: true, diplomaticValue: false,
  },
  description: 'A low-temperature ionized gas with extraordinary electrical conductivity. Used in advanced electronics and medical sterilization systems.',
  subDescription: 'Relatively stable at 30-day half-life. Superconducting properties make it invaluable for advanced computing and shield technology.',
  subject: {
    domain: 'Electronics & Medicine',
    subDomain: 'Plasma Engineering',
    applicationArea: 'Shields, computing, medical systems',
    relatedSystems: ['shields', 'computing', 'lifeSupportSystems'],
    loreReference: '"The cold flame that heals and defends — Cold Plasma is the surgeon\'s star." — Imperial Medical Corps Handbook',
  },
  unlockTier: 6,
  unlockLevel: 50,
  baseProductionRate: 12,
  baseStorageCapacity: 30000,
  baseMarketValue: 80,
};

export const HOT_PLASMA: ResourceElement = {
  id: 'hot-plasma',
  name: 'Hot Plasma',
  symbol: 'HP',
  icon: '🔴',
  category: 'plasma',
  subCategory: 'plasma-hot',
  type: 'plasma',
  subType: 'volatile',
  rank: 'rare',
  title: 'Superior-Grade Thermic Plasma',
  baseStats: {
    purity: 55, potency: 90, stability: 25,
    conductivity: 70, density: 25,
    extractionDifficulty: 70, processingTime: 10,
    halfLifeDays: 2, resonanceFrequency: 0, criticalYieldChance: 0.10,
  },
  attributes: {
    isFlammable: true, isCorrosive: true, isRadioactive: true,
    isMagnetic: true, isCrystalline: false, isLuminescent: true,
    isSuperconducting: false, isAntigravitic: false,
  },
  subAttributes: {
    militaryGrade: true, researchGrade: false,
    constructionGrade: false, fuelGrade: true,
    medicalGrade: false, diplomaticValue: false,
  },
  description: 'Intensely energetic plasma extracted from stellar flare events and magnetar outbursts. Extremely volatile but carries enormous energy potential.',
  subDescription: 'Degrades rapidly (half-life ~2 days). Requires triple-layer magnetic containment. Critical yields occur frequently due to plasma instabilities.',
  subject: {
    domain: 'Weapons & Propulsion',
    subDomain: 'Thermic Engineering',
    applicationArea: 'Plasma weapons, extreme propulsion',
    relatedSystems: ['weapons', 'propulsion', 'combatEngine'],
    loreReference: '"Handle it with reverence, for it will not hesitate to consume you." — Weapons Division Safety Protocol Omega',
  },
  unlockTier: 12,
  unlockLevel: 100,
  baseProductionRate: 6,
  baseStorageCapacity: 10000,
  baseMarketValue: 350,
};

export const QUANTUM_FIBER: ResourceElement = {
  id: 'quantum-fiber',
  name: 'Quantum Fiber',
  symbol: 'QF',
  icon: '🌀',
  category: 'quantum',
  subCategory: 'quantum-entangled',
  type: 'exotic',
  subType: 'resonant',
  rank: 'epic',
  title: 'Exceptional-Grade Quantum Filament',
  baseStats: {
    purity: 80, potency: 75, stability: 65,
    conductivity: 100, density: 5,
    extractionDifficulty: 80, processingTime: 120,
    halfLifeDays: 0, resonanceFrequency: 9999, criticalYieldChance: 0.15,
  },
  attributes: {
    isFlammable: false, isCorrosive: false, isRadioactive: false,
    isMagnetic: false, isCrystalline: true, isLuminescent: false,
    isSuperconducting: true, isAntigravitic: false,
  },
  subAttributes: {
    militaryGrade: true, researchGrade: true,
    constructionGrade: true, fuelGrade: false,
    medicalGrade: false, diplomaticValue: true,
  },
  description: 'Strings of quantum-entangled matter woven at the sub-Planck scale. Transmit information and energy instantaneously across any distance.',
  subDescription: 'No decay. Resonates at nearly infinite frequency. Used in FTL communication arrays, advanced sensors, and quantum computing cores.',
  subject: {
    domain: 'Communications & Computing',
    subDomain: 'Quantum Engineering',
    applicationArea: 'FTL comms, quantum computers, advanced sensors',
    relatedSystems: ['sensors', 'computing', 'interstellarTravel'],
    loreReference: '"In the weave of quantum fiber, distance becomes a myth." — Quantum Sciences Academy Thesis 0001',
  },
  unlockTier: 20,
  unlockLevel: 180,
  baseProductionRate: 3,
  baseStorageCapacity: 5000,
  baseMarketValue: 1200,
};

export const SUPERPOSED_CRYSTAL: ResourceElement = {
  id: 'superposed-crystal',
  name: 'Superposed Crystal',
  symbol: 'SC',
  icon: '🔷',
  category: 'quantum',
  subCategory: 'quantum-superposed',
  type: 'crystal',
  subType: 'resonant',
  rank: 'epic',
  title: 'Exceptional-Grade Superposition Crystal',
  baseStats: {
    purity: 90, potency: 80, stability: 50,
    conductivity: 60, density: 40,
    extractionDifficulty: 85, processingTime: 180,
    halfLifeDays: 0, resonanceFrequency: 7777, criticalYieldChance: 0.12,
  },
  attributes: {
    isFlammable: false, isCorrosive: false, isRadioactive: false,
    isMagnetic: false, isCrystalline: true, isLuminescent: true,
    isSuperconducting: true, isAntigravitic: false,
  },
  subAttributes: {
    militaryGrade: false, researchGrade: true,
    constructionGrade: false, fuelGrade: false,
    medicalGrade: false, diplomaticValue: true,
  },
  description: 'A crystal that exists in multiple quantum states simultaneously until observed. Collapsed into usable form by precision measurement fields.',
  subDescription: 'Perfect purity is theoretically achievable. Stability is limited by observer effects; handling requires automated systems to avoid collapsing its state.',
  subject: {
    domain: 'Research & Technology',
    subDomain: 'Quantum Crystallography',
    applicationArea: 'Research speed bonuses, tech unlocks, exotic labs',
    relatedSystems: ['customLab', 'research', 'technologyTree'],
    loreReference: '"It is and is not — until the machine looks." — Quantum Lab Journal, Entry 404',
  },
  unlockTier: 22,
  unlockLevel: 200,
  baseProductionRate: 2,
  baseStorageCapacity: 3000,
  baseMarketValue: 2000,
};

export const RIFT_SHARD: ResourceElement = {
  id: 'rift-shard',
  name: 'Rift Shard',
  symbol: 'RS',
  icon: '⚡',
  category: 'dimensional',
  subCategory: 'dimensional-rift',
  type: 'exotic',
  subType: 'charged',
  rank: 'legendary',
  title: 'Legendary-Grade Dimensional Fragment',
  baseStats: {
    purity: 70, potency: 95, stability: 30,
    conductivity: 80, density: 60,
    extractionDifficulty: 90, processingTime: 240,
    halfLifeDays: 10, resonanceFrequency: 3333, criticalYieldChance: 0.18,
  },
  attributes: {
    isFlammable: false, isCorrosive: true, isRadioactive: false,
    isMagnetic: false, isCrystalline: true, isLuminescent: true,
    isSuperconducting: false, isAntigravitic: true,
  },
  subAttributes: {
    militaryGrade: true, researchGrade: true,
    constructionGrade: false, fuelGrade: false,
    medicalGrade: false, diplomaticValue: true,
  },
  description: 'Crystallized fragments of dimensional rifts — tears in the fabric of spacetime. Carry latent energies from multiple overlapping dimensions.',
  subDescription: 'Antigravitationally buoyant; must be stored in gravity-anchored containers. Decays as rift energy bleeds off; containment extends useful life significantly.',
  subject: {
    domain: 'Dimensional Engineering',
    subDomain: 'Rift Technology',
    applicationArea: 'Dimensional gates, exotic weapons, megastructures',
    relatedSystems: ['megastructure', 'weapons', 'dimensionalGate'],
    loreReference: '"From the edge of everything, something sharp always falls." — Rift Expedition Field Notes',
  },
  unlockTier: 30,
  unlockLevel: 270,
  baseProductionRate: 1.5,
  baseStorageCapacity: 2000,
  baseMarketValue: 5000,
};

export const FOLD_ESSENCE: ResourceElement = {
  id: 'fold-essence',
  name: 'Fold Essence',
  symbol: 'FE',
  icon: '🌊',
  category: 'dimensional',
  subCategory: 'dimensional-fold',
  type: 'energy',
  subType: 'reactive',
  rank: 'legendary',
  title: 'Legendary-Grade Spatial Fold Essence',
  baseStats: {
    purity: 85, potency: 88, stability: 40,
    conductivity: 75, density: 2,
    extractionDifficulty: 92, processingTime: 300,
    halfLifeDays: 7, resonanceFrequency: 1111, criticalYieldChance: 0.20,
  },
  attributes: {
    isFlammable: false, isCorrosive: false, isRadioactive: false,
    isMagnetic: false, isCrystalline: false, isLuminescent: true,
    isSuperconducting: false, isAntigravitic: true,
  },
  subAttributes: {
    militaryGrade: true, researchGrade: true,
    constructionGrade: false, fuelGrade: true,
    medicalGrade: false, diplomaticValue: true,
  },
  description: 'The pure energetic essence extracted from spatial fold points where the universe has bent back on itself. Required for advanced FTL drives.',
  subDescription: 'Antigravitic and reactive with normal spacetime. Used as the primary fuel for fold-drive propulsion; small quantities enable enormous spatial displacement.',
  subject: {
    domain: 'Propulsion & Navigation',
    subDomain: 'Spatial Folding',
    applicationArea: 'FTL drives, wormhole generators, interstellar travel',
    relatedSystems: ['interstellarTravel', 'propulsion', 'wormholes'],
    loreReference: '"Space bends, and from the bend we harvest the journey itself." — FTL Drive Research Notes',
  },
  unlockTier: 35,
  unlockLevel: 310,
  baseProductionRate: 1,
  baseStorageCapacity: 1500,
  baseMarketValue: 8000,
};

export const TEMPORAL_ECHO: ResourceElement = {
  id: 'temporal-echo',
  name: 'Temporal Echo',
  symbol: 'TE',
  icon: '⏳',
  category: 'temporal',
  subCategory: 'temporal-echo',
  type: 'energy',
  subType: 'resonant',
  rank: 'mythic',
  title: 'Mythic-Grade Temporal Resonance',
  baseStats: {
    purity: 95, potency: 92, stability: 20,
    conductivity: 50, density: 1,
    extractionDifficulty: 95, processingTime: 600,
    halfLifeDays: 3, resonanceFrequency: 6000, criticalYieldChance: 0.25,
  },
  attributes: {
    isFlammable: false, isCorrosive: false, isRadioactive: false,
    isMagnetic: false, isCrystalline: false, isLuminescent: true,
    isSuperconducting: false, isAntigravitic: false,
  },
  subAttributes: {
    militaryGrade: false, researchGrade: true,
    constructionGrade: false, fuelGrade: false,
    medicalGrade: false, diplomaticValue: true,
  },
  description: 'Resonant energy imprints left by significant historical events in time itself. Collecting these requires temporal sensor arrays tuned to past moments.',
  subDescription: 'Extremely unstable — half-life of 3 days as the echo fades. Massively accelerates research when applied. Used in high-tier temporal labs.',
  subject: {
    domain: 'Research & History',
    subDomain: 'Temporal Studies',
    applicationArea: 'Research acceleration, historical records, temporal weapons',
    relatedSystems: ['research', 'customLab', 'achievementSystem'],
    loreReference: '"The past is not gone — it hums, faintly, if you know how to listen." — Chronomancer\'s Primer',
  },
  unlockTier: 45,
  unlockLevel: 400,
  baseProductionRate: 0.5,
  baseStorageCapacity: 500,
  baseMarketValue: 25000,
};

export const TEMPORAL_SHARD: ResourceElement = {
  id: 'temporal-shard',
  name: 'Temporal Shard',
  symbol: 'TS',
  icon: '🕰️',
  category: 'temporal',
  subCategory: 'temporal-shard',
  type: 'crystal',
  subType: 'stable',
  rank: 'mythic',
  title: 'Mythic-Grade Crystallized Time',
  baseStats: {
    purity: 88, potency: 85, stability: 75,
    conductivity: 35, density: 70,
    extractionDifficulty: 97, processingTime: 900,
    halfLifeDays: 0, resonanceFrequency: 2000, criticalYieldChance: 0.22,
  },
  attributes: {
    isFlammable: false, isCorrosive: false, isRadioactive: false,
    isMagnetic: false, isCrystalline: true, isLuminescent: true,
    isSuperconducting: false, isAntigravitic: false,
  },
  subAttributes: {
    militaryGrade: true, researchGrade: true,
    constructionGrade: true, fuelGrade: false,
    medicalGrade: false, diplomaticValue: true,
  },
  description: 'Solid crystallized fragments of frozen time, found near temporal anomalies and collapsed causality loops. Stable and dense with temporal potential.',
  subDescription: 'No decay — time itself does not decay. Dense enough for construction use in temporal structures. Slow to process but highly rewarding.',
  subject: {
    domain: 'Temporal Construction & Defense',
    subDomain: 'Causality Engineering',
    applicationArea: 'Temporal shields, time-locked vaults, chrono-fortifications',
    relatedSystems: ['megastructure', 'shields', 'defense'],
    loreReference: '"To hold a piece of frozen time in your hand is to feel the weight of all that was." — Temporal Archive Record 1',
  },
  unlockTier: 50,
  unlockLevel: 450,
  baseProductionRate: 0.3,
  baseStorageCapacity: 1000,
  baseMarketValue: 40000,
};

export const PSIONIC_CRYSTAL: ResourceElement = {
  id: 'psionic-crystal',
  name: 'Psionic Crystal',
  symbol: 'PC',
  icon: '🔮',
  category: 'psionic',
  subCategory: 'psionic-refined',
  type: 'crystal',
  subType: 'resonant',
  rank: 'epic',
  title: 'Exceptional-Grade Mind-Resonant Crystal',
  baseStats: {
    purity: 78, potency: 82, stability: 60,
    conductivity: 65, density: 45,
    extractionDifficulty: 75, processingTime: 150,
    halfLifeDays: 0, resonanceFrequency: 432, criticalYieldChance: 0.14,
  },
  attributes: {
    isFlammable: false, isCorrosive: false, isRadioactive: false,
    isMagnetic: false, isCrystalline: true, isLuminescent: true,
    isSuperconducting: false, isAntigravitic: false,
  },
  subAttributes: {
    militaryGrade: true, researchGrade: true,
    constructionGrade: false, fuelGrade: false,
    medicalGrade: true, diplomaticValue: true,
  },
  description: 'Crystals grown in regions of intense psychic resonance, capable of storing and transmitting psionic energy fields. Central to psionic technologies.',
  subDescription: 'Resonates at 432 Hz — the frequency of psionic coherence. Used in commander enhancements, AI cores, and diplomatic communication relays.',
  subject: {
    domain: 'Command & Diplomacy',
    subDomain: 'Psionic Technology',
    applicationArea: 'Commander bonuses, AI, diplomatic comm, morale systems',
    relatedSystems: ['commanderTalentTree', 'computing', 'diplomacy'],
    loreReference: '"The mind is a weapon. Psionic Crystal is the trigger." — Commander\'s Field Manual, Chapter 9',
  },
  unlockTier: 25,
  unlockLevel: 230,
  baseProductionRate: 4,
  baseStorageCapacity: 8000,
  baseMarketValue: 1800,
};

export const BIO_RESIN: ResourceElement = {
  id: 'bio-resin',
  name: 'Bio-Resin',
  symbol: 'BR',
  icon: '🌿',
  category: 'biological',
  subCategory: 'bio-organic',
  type: 'liquid',
  subType: 'catalytic',
  rank: 'uncommon',
  title: 'Quality-Grade Biological Resin',
  baseStats: {
    purity: 55, potency: 60, stability: 80,
    conductivity: 10, density: 35,
    extractionDifficulty: 25, processingTime: 30,
    halfLifeDays: 20, resonanceFrequency: 0, criticalYieldChance: 0.04,
  },
  attributes: {
    isFlammable: false, isCorrosive: false, isRadioactive: false,
    isMagnetic: false, isCrystalline: false, isLuminescent: false,
    isSuperconducting: false, isAntigravitic: false,
  },
  subAttributes: {
    militaryGrade: false, researchGrade: false,
    constructionGrade: true, fuelGrade: false,
    medicalGrade: true, diplomaticValue: false,
  },
  description: 'A thick organic resin harvested from engineered bio-organisms. Acts as a biological adhesive, medical compound, and construction sealant.',
  subDescription: 'Degrades over 20 days without refrigeration. Catalytic properties allow it to accelerate many chemical and biological processes.',
  subject: {
    domain: 'Medicine & Construction',
    subDomain: 'Bio-Engineering',
    applicationArea: 'Medical supplies, building sealants, life support',
    relatedSystems: ['lifeSupportSystems', 'buildings', 'research'],
    loreReference: '"Life itself provides the mortar between our stars." — Bio-Engineering Guild Charter',
  },
  unlockTier: 4,
  unlockLevel: 30,
  baseProductionRate: 20,
  baseStorageCapacity: 60000,
  baseMarketValue: 25,
};

export const NANO_ALLOY: ResourceElement = {
  id: 'nano-alloy',
  name: 'Nano-Alloy',
  symbol: 'NA',
  icon: '⚙️',
  category: 'mechanical',
  subCategory: 'nano-composite',
  type: 'alloy',
  subType: 'primary',
  rank: 'rare',
  title: 'Superior-Grade Nano-Engineered Alloy',
  baseStats: {
    purity: 85, potency: 70, stability: 95,
    conductivity: 50, density: 80,
    extractionDifficulty: 60, processingTime: 90,
    halfLifeDays: 0, resonanceFrequency: 0, criticalYieldChance: 0.07,
  },
  attributes: {
    isFlammable: false, isCorrosive: false, isRadioactive: false,
    isMagnetic: false, isCrystalline: false, isLuminescent: false,
    isSuperconducting: false, isAntigravitic: false,
  },
  subAttributes: {
    militaryGrade: true, researchGrade: false,
    constructionGrade: true, fuelGrade: false,
    medicalGrade: false, diplomaticValue: false,
  },
  description: 'A structural alloy manufactured at the nanoscale for unprecedented strength-to-weight ratio. Used in hull plating and advanced building frameworks.',
  subDescription: 'No decay. Near-perfect structural stability. The manufacturing process requires quantum-precision fabricators; yields are limited by factory throughput.',
  subject: {
    domain: 'Manufacturing & Defense',
    subDomain: 'Advanced Materials',
    applicationArea: 'Ship hulls, fortifications, megastructure framing',
    relatedSystems: ['shipyard', 'defense', 'megastructure'],
    loreReference: '"The future of armor is so small it cannot be seen — only felt when the shots don\'t penetrate." — Fleet Admiral Kovacs',
  },
  unlockTier: 15,
  unlockLevel: 130,
  baseProductionRate: 7,
  baseStorageCapacity: 40000,
  baseMarketValue: 300,
};

export const RESONANT_LATTICE: ResourceElement = {
  id: 'resonant-lattice',
  name: 'Resonant Lattice',
  symbol: 'RL',
  icon: '🔶',
  category: 'crystalline',
  subCategory: 'crystal-resonant',
  type: 'crystal',
  subType: 'resonant',
  rank: 'rare',
  title: 'Superior-Grade Resonance Lattice Crystal',
  baseStats: {
    purity: 80, potency: 65, stability: 88,
    conductivity: 90, density: 50,
    extractionDifficulty: 55, processingTime: 75,
    halfLifeDays: 0, resonanceFrequency: 528, criticalYieldChance: 0.09,
  },
  attributes: {
    isFlammable: false, isCorrosive: false, isRadioactive: false,
    isMagnetic: false, isCrystalline: true, isLuminescent: true,
    isSuperconducting: true, isAntigravitic: false,
  },
  subAttributes: {
    militaryGrade: false, researchGrade: true,
    constructionGrade: true, fuelGrade: false,
    medicalGrade: true, diplomaticValue: false,
  },
  description: 'A crystal grown in a precisely tuned resonance field, locking in a stable vibrational pattern. Excellent conductor and energy amplifier.',
  subDescription: 'Resonates at 528 Hz — associated with DNA repair frequencies in some species. Superconducting at room temperature, enabling lossless power grids.',
  subject: {
    domain: 'Power & Medicine',
    subDomain: 'Crystal Engineering',
    applicationArea: 'Power grids, medical devices, energy shields',
    relatedSystems: ['powerPlant', 'lifeSupportSystems', 'shields'],
    loreReference: '"A crystal that sings is a crystal that works." — Power Grid Engineering Manual v7',
  },
  unlockTier: 18,
  unlockLevel: 160,
  baseProductionRate: 5,
  baseStorageCapacity: 25000,
  baseMarketValue: 500,
};

export const GRAVITON_ORE: ResourceElement = {
  id: 'graviton-ore',
  name: 'Graviton Ore',
  symbol: 'GO',
  icon: '🪨',
  category: 'gravitational',
  subCategory: 'graviton-dense',
  type: 'raw',
  subType: 'primary',
  rank: 'epic',
  title: 'Exceptional-Grade Graviton-Infused Ore',
  baseStats: {
    purity: 60, potency: 88, stability: 92,
    conductivity: 20, density: 99,
    extractionDifficulty: 88, processingTime: 360,
    halfLifeDays: 0, resonanceFrequency: 0, criticalYieldChance: 0.11,
  },
  attributes: {
    isFlammable: false, isCorrosive: false, isRadioactive: false,
    isMagnetic: false, isCrystalline: false, isLuminescent: false,
    isSuperconducting: false, isAntigravitic: false,
  },
  subAttributes: {
    militaryGrade: true, researchGrade: true,
    constructionGrade: true, fuelGrade: false,
    medicalGrade: false, diplomaticValue: false,
  },
  description: 'An extraordinarily dense ore saturated with graviton particles. Distorts local gravity around large deposits; mining requires antigravity rigs.',
  subDescription: 'Maximum density at 99/100 — the heaviest natural substance known. Used in gravity-weapon systems, structural anchoring, and gravitational research.',
  subject: {
    domain: 'Weapons & Engineering',
    subDomain: 'Gravitational Physics',
    applicationArea: 'Gravity weapons, structural anchors, gravitational labs',
    relatedSystems: ['weapons', 'megastructure', 'research'],
    loreReference: '"To hold this ore is to hold a small piece of a collapsed star." — Geological Survey Unit 7',
  },
  unlockTier: 28,
  unlockLevel: 250,
  baseProductionRate: 2,
  baseStorageCapacity: 8000,
  baseMarketValue: 3000,
};

export const EM_FLUX_COMPOUND: ResourceElement = {
  id: 'em-flux-compound',
  name: 'EM Flux Compound',
  symbol: 'EF',
  icon: '🔌',
  category: 'electromagnetic',
  subCategory: 'em-flux',
  type: 'compound',
  subType: 'charged',
  rank: 'rare',
  title: 'Superior-Grade Electromagnetic Flux Compound',
  baseStats: {
    purity: 70, potency: 75, stability: 55,
    conductivity: 100, density: 20,
    extractionDifficulty: 58, processingTime: 60,
    halfLifeDays: 15, resonanceFrequency: 60, criticalYieldChance: 0.08,
  },
  attributes: {
    isFlammable: false, isCorrosive: false, isRadioactive: false,
    isMagnetic: true, isCrystalline: false, isLuminescent: true,
    isSuperconducting: true, isAntigravitic: false,
  },
  subAttributes: {
    militaryGrade: true, researchGrade: true,
    constructionGrade: false, fuelGrade: true,
    medicalGrade: false, diplomaticValue: false,
  },
  description: 'A stabilized electromagnetic flux compound with maximum conductivity. Central to advanced power distribution and EM-pulse weapon systems.',
  subDescription: 'Resonates at 60 Hz — standard grid frequency. Decays over 15 days as charge bleeds into the environment. Superconducting under normal space conditions.',
  subject: {
    domain: 'Power & Weapons',
    subDomain: 'Electromagnetic Systems',
    applicationArea: 'Power distribution, EMP weapons, shield boosters',
    relatedSystems: ['powerPlant', 'weapons', 'shields'],
    loreReference: '"The EM grid is only as good as the compound flowing through it." — Power Systems Engineer\'s Digest',
  },
  unlockTier: 16,
  unlockLevel: 140,
  baseProductionRate: 9,
  baseStorageCapacity: 30000,
  baseMarketValue: 400,
};

export const PHOTON_CRYSTAL: ResourceElement = {
  id: 'photon-crystal',
  name: 'Photon Crystal',
  symbol: 'PhC',
  icon: '💡',
  category: 'spectral',
  subCategory: 'photon-dense',
  type: 'crystal',
  subType: 'charged',
  rank: 'rare',
  title: 'Superior-Grade Photonic Crystal',
  baseStats: {
    purity: 72, potency: 68, stability: 70,
    conductivity: 85, density: 30,
    extractionDifficulty: 62, processingTime: 80,
    halfLifeDays: 0, resonanceFrequency: 750, criticalYieldChance: 0.09,
  },
  attributes: {
    isFlammable: false, isCorrosive: false, isRadioactive: false,
    isMagnetic: false, isCrystalline: true, isLuminescent: true,
    isSuperconducting: false, isAntigravitic: false,
  },
  subAttributes: {
    militaryGrade: false, researchGrade: true,
    constructionGrade: false, fuelGrade: false,
    medicalGrade: true, diplomaticValue: true,
  },
  description: 'A crystal dense with trapped photons, forming a standing-wave lattice of light. Used in advanced optics, laser systems, and medical scanners.',
  subDescription: 'No decay. Emits soft light continuously. Used in deep-space sensor arrays, precision targeting systems, and holographic communications.',
  subject: {
    domain: 'Sensors & Medicine',
    subDomain: 'Photonics',
    applicationArea: 'Laser weapons, medical scanners, sensor arrays, holo-comms',
    relatedSystems: ['sensors', 'weapons', 'lifeSupportSystems'],
    loreReference: '"Light made solid — the universe\'s most elegant gift." — Photonics Research Symposium 48',
  },
  unlockTier: 17,
  unlockLevel: 150,
  baseProductionRate: 6,
  baseStorageCapacity: 20000,
  baseMarketValue: 450,
};

export const COSMIC_STRING_FRAGMENT: ResourceElement = {
  id: 'cosmic-string-fragment',
  name: 'Cosmic String Fragment',
  symbol: 'CSF',
  icon: '🌠',
  category: 'cosmic',
  subCategory: 'cosmic-string',
  type: 'exotic',
  subType: 'primary',
  rank: 'divine',
  title: 'Divine-Grade Cosmic String Fragment',
  baseStats: {
    purity: 99, potency: 99, stability: 15,
    conductivity: 99, density: 99,
    extractionDifficulty: 99, processingTime: 3600,
    halfLifeDays: 30, resonanceFrequency: 99999, criticalYieldChance: 0.30,
  },
  attributes: {
    isFlammable: false, isCorrosive: true, isRadioactive: true,
    isMagnetic: true, isCrystalline: false, isLuminescent: true,
    isSuperconducting: true, isAntigravitic: true,
  },
  subAttributes: {
    militaryGrade: true, researchGrade: true,
    constructionGrade: true, fuelGrade: true,
    medicalGrade: false, diplomaticValue: true,
  },
  description: 'A fragment of a cosmic string — a one-dimensional topological defect from the Big Bang. Carries universe-scale energies in an impossibly thin filament.',
  subDescription: 'Virtually perfect in all attributes but extremely unstable — degrades over 30 days as string tension dissipates. Unlocks the highest tiers of technology.',
  subject: {
    domain: 'Universal Engineering',
    subDomain: 'Cosmic Topology',
    applicationArea: 'Tier-7+ technologies, universe-scale megastructures, ultimate weapons',
    relatedSystems: ['megastructure', 'technologyTree', 'weapons', 'research'],
    loreReference: '"It is a thread left over from the loom on which the universe was woven." — The Omnis Archives, Fragment 1',
  },
  unlockTier: 70,
  unlockLevel: 630,
  baseProductionRate: 0.1,
  baseStorageCapacity: 100,
  baseMarketValue: 999999,
};

export const ETHEREAL_MIST: ResourceElement = {
  id: 'ethereal-mist',
  name: 'Ethereal Mist',
  symbol: 'ETM',
  icon: '👻',
  category: 'ethereal',
  subCategory: 'ethereal-mist',
  type: 'gas',
  subType: 'inert',
  rank: 'mythic',
  title: 'Mythic-Grade Ethereal Vapor',
  baseStats: {
    purity: 92, potency: 78, stability: 35,
    conductivity: 40, density: 3,
    extractionDifficulty: 94, processingTime: 480,
    halfLifeDays: 5, resonanceFrequency: 11, criticalYieldChance: 0.22,
  },
  attributes: {
    isFlammable: false, isCorrosive: false, isRadioactive: false,
    isMagnetic: false, isCrystalline: false, isLuminescent: true,
    isSuperconducting: false, isAntigravitic: false,
  },
  subAttributes: {
    militaryGrade: false, researchGrade: true,
    constructionGrade: false, fuelGrade: false,
    medicalGrade: true, diplomaticValue: true,
  },
  description: 'A barely-perceptible vapor that drifts between the spiritual and material realms. Enhances psionic abilities and accelerates mystical research paths.',
  subDescription: 'Degrades to nothingness in 5 days. Inert relative to most chemistry but highly reactive to psionic fields. Central to the Ethereal Sciences research branch.',
  subject: {
    domain: 'Psionic Science & Diplomacy',
    subDomain: 'Ethereal Studies',
    applicationArea: 'Psionic amplifiers, spiritual research, rare diplomatic gifts',
    relatedSystems: ['research', 'commanderTalentTree', 'diplomacy'],
    loreReference: '"Some say it is the breath of dead gods. We say it is the future of science." — Ethereal Sciences Institute',
  },
  unlockTier: 55,
  unlockLevel: 500,
  baseProductionRate: 0.4,
  baseStorageCapacity: 300,
  baseMarketValue: 55000,
};

export const PRIMORDIAL_SPARK: ResourceElement = {
  id: 'primordial-spark',
  name: 'Primordial Spark',
  symbol: 'PrS',
  icon: '🔥',
  category: 'primordial',
  subCategory: 'primordial-spark',
  type: 'energy',
  subType: 'reactive',
  rank: 'primordial',
  title: 'Primordial-Grade Creation Energy',
  baseStats: {
    purity: 100, potency: 100, stability: 10,
    conductivity: 100, density: 50,
    extractionDifficulty: 99, processingTime: 7200,
    halfLifeDays: 1, resonanceFrequency: 1, criticalYieldChance: 0.50,
  },
  attributes: {
    isFlammable: true, isCorrosive: true, isRadioactive: true,
    isMagnetic: true, isCrystalline: false, isLuminescent: true,
    isSuperconducting: true, isAntigravitic: true,
  },
  subAttributes: {
    militaryGrade: true, researchGrade: true,
    constructionGrade: true, fuelGrade: true,
    medicalGrade: false, diplomaticValue: true,
  },
  description: 'A spark of primordial creation energy — the same force that ignited the universe. Impossible to create artificially; only harvestable from the oldest cosmic events.',
  subDescription: 'Perfect purity and potency but catastrophically unstable (1-day half-life). Every attribute is at maximum. A single spark can power a civilization for centuries.',
  subject: {
    domain: 'Absolute Power',
    subDomain: 'Cosmogeny',
    applicationArea: 'God-tier technologies, prestige systems, ultimate megastructures',
    relatedSystems: ['megastructure', 'technologyTree', 'prestigeSystem', 'research'],
    loreReference: '"Before the first atom, there was only this. We found a way to hold it, briefly." — The Primordial Archives',
  },
  unlockTier: 90,
  unlockLevel: 810,
  baseProductionRate: 0.01,
  baseStorageCapacity: 10,
  baseMarketValue: 99999999,
};

// ─────────────────────────────────────────────────────────────────────────────
// REGISTRY
// ─────────────────────────────────────────────────────────────────────────────

export const RESOURCE_ELEMENTS: ResourceElement[] = [
  SOLAR_PLASMA,
  STELLAR_ASH,
  NEBULA_GAS,
  NEBULA_DUST,
  COLD_PLASMA,
  HOT_PLASMA,
  QUANTUM_FIBER,
  SUPERPOSED_CRYSTAL,
  RIFT_SHARD,
  FOLD_ESSENCE,
  TEMPORAL_ECHO,
  TEMPORAL_SHARD,
  PSIONIC_CRYSTAL,
  BIO_RESIN,
  NANO_ALLOY,
  RESONANT_LATTICE,
  GRAVITON_ORE,
  EM_FLUX_COMPOUND,
  PHOTON_CRYSTAL,
  COSMIC_STRING_FRAGMENT,
  ETHEREAL_MIST,
  PRIMORDIAL_SPARK,
];

// ─────────────────────────────────────────────────────────────────────────────
// ECONOMY CONFIGURATION (per element)
// ─────────────────────────────────────────────────────────────────────────────

export interface ResourceElementEconomy {
  supplyMultiplier: number;  // 0.0001–1.0
  demandMultiplier: number;  // 1.0–10.0
  priceMultiplier: number;   // 0.5–999999
  productionBonus: number;   // % bonus to empire production
  storageBonus: number;      // % bonus to storage capacity
  decayRatePerDay: number;   // Fraction lost per day (0 = none)
}

export const RESOURCE_ELEMENT_ECONOMIES: Record<string, ResourceElementEconomy> = {
  'solar-plasma':           { supplyMultiplier: 0.4,    demandMultiplier: 1.5, priceMultiplier: 45,       productionBonus: 0.15, storageBonus: 0.05, decayRatePerDay: 0.139 },
  'stellar-ash':            { supplyMultiplier: 0.2,    demandMultiplier: 2.0, priceMultiplier: 150,      productionBonus: 0.30, storageBonus: 0.20, decayRatePerDay: 0 },
  'nebula-gas':             { supplyMultiplier: 0.9,    demandMultiplier: 1.1, priceMultiplier: 5,        productionBonus: 0.05, storageBonus: 0.00, decayRatePerDay: 0 },
  'nebula-dust':            { supplyMultiplier: 0.7,    demandMultiplier: 1.2, priceMultiplier: 18,       productionBonus: 0.08, storageBonus: 0.05, decayRatePerDay: 0 },
  'cold-plasma':            { supplyMultiplier: 0.3,    demandMultiplier: 1.8, priceMultiplier: 80,       productionBonus: 0.20, storageBonus: 0.10, decayRatePerDay: 0.023 },
  'hot-plasma':             { supplyMultiplier: 0.15,   demandMultiplier: 2.5, priceMultiplier: 350,      productionBonus: 0.50, storageBonus: 0.00, decayRatePerDay: 0.347 },
  'quantum-fiber':          { supplyMultiplier: 0.05,   demandMultiplier: 3.0, priceMultiplier: 1200,     productionBonus: 1.00, storageBonus: 0.50, decayRatePerDay: 0 },
  'superposed-crystal':     { supplyMultiplier: 0.04,   demandMultiplier: 3.5, priceMultiplier: 2000,     productionBonus: 1.50, storageBonus: 0.80, decayRatePerDay: 0 },
  'rift-shard':             { supplyMultiplier: 0.02,   demandMultiplier: 4.0, priceMultiplier: 5000,     productionBonus: 2.00, storageBonus: 1.00, decayRatePerDay: 0.069 },
  'fold-essence':           { supplyMultiplier: 0.015,  demandMultiplier: 4.5, priceMultiplier: 8000,     productionBonus: 3.00, storageBonus: 1.50, decayRatePerDay: 0.099 },
  'temporal-echo':          { supplyMultiplier: 0.008,  demandMultiplier: 5.0, priceMultiplier: 25000,    productionBonus: 5.00, storageBonus: 2.00, decayRatePerDay: 0.231 },
  'temporal-shard':         { supplyMultiplier: 0.005,  demandMultiplier: 5.5, priceMultiplier: 40000,    productionBonus: 6.00, storageBonus: 3.00, decayRatePerDay: 0 },
  'psionic-crystal':        { supplyMultiplier: 0.06,   demandMultiplier: 3.0, priceMultiplier: 1800,     productionBonus: 1.20, storageBonus: 0.60, decayRatePerDay: 0 },
  'bio-resin':              { supplyMultiplier: 0.6,    demandMultiplier: 1.3, priceMultiplier: 25,       productionBonus: 0.10, storageBonus: 0.10, decayRatePerDay: 0.035 },
  'nano-alloy':             { supplyMultiplier: 0.18,   demandMultiplier: 2.2, priceMultiplier: 300,      productionBonus: 0.40, storageBonus: 0.30, decayRatePerDay: 0 },
  'resonant-lattice':       { supplyMultiplier: 0.12,   demandMultiplier: 2.0, priceMultiplier: 500,      productionBonus: 0.60, storageBonus: 0.40, decayRatePerDay: 0 },
  'graviton-ore':           { supplyMultiplier: 0.03,   demandMultiplier: 4.0, priceMultiplier: 3000,     productionBonus: 2.50, storageBonus: 1.00, decayRatePerDay: 0 },
  'em-flux-compound':       { supplyMultiplier: 0.14,   demandMultiplier: 1.9, priceMultiplier: 400,      productionBonus: 0.55, storageBonus: 0.25, decayRatePerDay: 0.046 },
  'photon-crystal':         { supplyMultiplier: 0.13,   demandMultiplier: 1.8, priceMultiplier: 450,      productionBonus: 0.50, storageBonus: 0.20, decayRatePerDay: 0 },
  'cosmic-string-fragment': { supplyMultiplier: 0.001,  demandMultiplier: 8.0, priceMultiplier: 999999,   productionBonus: 50.0, storageBonus: 20.0, decayRatePerDay: 0.023 },
  'ethereal-mist':          { supplyMultiplier: 0.003,  demandMultiplier: 6.0, priceMultiplier: 55000,    productionBonus: 8.00, storageBonus: 3.00, decayRatePerDay: 0.139 },
  'primordial-spark':       { supplyMultiplier: 0.0001, demandMultiplier: 10.0, priceMultiplier: 99999999, productionBonus: 99.0, storageBonus: 99.0, decayRatePerDay: 0.693 },
};

// ─────────────────────────────────────────────────────────────────────────────
// UTILITY FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

/** Compute the runtime sub-stats for an element at a given amount */
export function computeSubStats(
  element: ResourceElement,
  amount: number
): ResourceElementSubStats {
  const s = element.baseStats;
  const decayRate = s.halfLifeDays > 0
    ? 1 - Math.pow(0.5, 1 / s.halfLifeDays)
    : 0;
  const effectivePotency = s.potency * (s.purity / 100);
  const yieldMultiplier = (effectivePotency / 100) * (1 + s.criticalYieldChance);
  const processedValue = element.baseMarketValue * (s.purity / 50);
  const researchBoost = Math.min(10, (s.potency + s.purity) / 20);
  return {
    effectivePotency,
    decayRate,
    yieldMultiplier,
    processedValue,
    researchBoost,
  };
}

/** Compute extraction rate at a given mine level/tier */
export function calculateElementExtractionRate(
  elementId: string,
  mineLevel: number,
  mineTier: number,
  veinQuality: number = 100
): number {
  const element = RESOURCE_ELEMENTS.find(e => e.id === elementId);
  if (!element) return 0;
  const economy = RESOURCE_ELEMENT_ECONOMIES[elementId];
  if (!economy) return 0;
  const multiplier = ProgressionSystem.getTotalMultiplier(mineLevel, mineTier);
  const production = element.baseProductionRate * multiplier;
  const qualityFactor = veinQuality / 100;
  return production * qualityFactor * economy.supplyMultiplier;
}

/** Compute storage capacity at a given storage level/tier */
export function calculateElementStorageCapacity(
  elementId: string,
  storageLevel: number,
  storageTier: number
): number {
  const element = RESOURCE_ELEMENTS.find(e => e.id === elementId);
  if (!element) return 0;
  const economy = RESOURCE_ELEMENT_ECONOMIES[elementId];
  if (!economy) return 0;
  const multiplier = ProgressionSystem.getTotalMultiplier(storageLevel, storageTier);
  return Math.floor(element.baseStorageCapacity * multiplier * (1 + economy.storageBonus));
}

/** Compute market value of a given quantity */
export function calculateElementMarketValue(
  elementId: string,
  amount: number,
  marketMultiplier: number = 1.0
): number {
  const element = RESOURCE_ELEMENTS.find(e => e.id === elementId);
  if (!element) return 0;
  const economy = RESOURCE_ELEMENT_ECONOMIES[elementId];
  if (!economy) return 0;
  const price = element.baseMarketValue * economy.priceMultiplier * marketMultiplier;
  return Math.floor(amount * price);
}

/** Compute remaining amount after time-based decay */
export function calculateElementDecay(
  elementId: string,
  amount: number,
  daysPassed: number
): number {
  const economy = RESOURCE_ELEMENT_ECONOMIES[elementId];
  if (!economy || economy.decayRatePerDay === 0) return amount;
  return Math.floor(amount * Math.pow(1 - economy.decayRatePerDay, daysPassed));
}

/** Get all elements unlocked at or below a given tier */
export function getElementsForTier(tier: number): ResourceElement[] {
  return RESOURCE_ELEMENTS.filter(e => e.unlockTier <= tier);
}

/** Get all elements in a given category */
export function getElementsByCategory(
  category: ResourceElementCategory
): ResourceElement[] {
  return RESOURCE_ELEMENTS.filter(e => e.category === category);
}

/** Get all elements by rank */
export function getElementsByRank(rank: ResourceElementRank): ResourceElement[] {
  return RESOURCE_ELEMENTS.filter(e => e.rank === rank);
}

/** Get element by ID */
export function getElement(id: string): ResourceElement | undefined {
  return RESOURCE_ELEMENTS.find(e => e.id === id);
}

/** Summary statistics for the entire registry */
export const RESOURCE_ELEMENTS_META = {
  total: RESOURCE_ELEMENTS.length,
  categories: 18 as const,
  subCategories: 32 as const,
  maxTier: ProgressionSystem.MAX_TIER,
  maxLevel: ProgressionSystem.MAX_LEVEL,
  tierClasses: [
    'novice', 'apprentice', 'journeyman', 'adept', 'expert',
    'master', 'grandmaster', 'legendary', 'mythic', 'transcendent',
  ] as TierClass[],
  rankOrder: [
    'common', 'uncommon', 'rare', 'epic', 'legendary',
    'mythic', 'divine', 'primordial',
  ] as ResourceElementRank[],
};
