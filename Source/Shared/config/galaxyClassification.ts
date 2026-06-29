/**
 * Galaxy Classification System
 * Complete taxonomy for galaxy types with Star Trek-inspired naming
 * Covers morphology, classes, subclasses, categories and procedural helpers
 * @tag #galaxy #classification #universe #morphology #star-trek
 */

// ============================================================================
// MORPHOLOGY TYPES
// ============================================================================

export type GalaxyMorphology =
  | 'spiral-normal'
  | 'spiral-barred'
  | 'spiral-grand-design'
  | 'elliptical-e0'
  | 'elliptical-e3'
  | 'elliptical-e5'
  | 'elliptical-e7'
  | 'lenticular'
  | 'irregular'
  | 'ring'
  | 'companion'
  | 'dwarf'
  | 'giant'
  | 'interacting'
  | 'peculiar'
  | 'cd'
  | 'magellanic';

export type GalaxySizeVariant = 'miniature' | 'small' | 'medium' | 'large' | 'colossal' | 'supergiant';

export type GalaxyPopulation = 'population-i' | 'population-ii' | 'population-iii' | 'mixed';

export type GalaxyMetallicity =
  | 'metal-poor'
  | 'sub-solar'
  | 'solar'
  | 'super-solar'
  | 'metal-rich'
  | 'enriched';

// ============================================================================
// CLASSIFICATION TIERS
// ============================================================================

export type GalaxyClass = 'class-a' | 'class-b' | 'class-c' | 'class-d' | 'class-e' | 'class-f';

export type GalaxySubclass =
  | 'alpha'
  | 'beta'
  | 'gamma'
  | 'delta'
  | 'epsilon'
  | 'zeta'
  | 'theta'
  | 'omega';

export type GalaxyCategory = 'hostile' | 'neutral' | 'fertile' | 'ancient' | 'volatile';

export type GalaxySubcategory =
  | 'frontier'
  | 'core-worlds'
  | 'wild-space'
  | 'claimed'
  | 'disputed'
  | 'void-touched'
  | 'nexus-point'
  | 'lost-sector';

// ============================================================================
// STAR TREK-INSPIRED DESIGNATIONS
// ============================================================================

export type GalaxyDesignation =
  | 'andromeda-class'
  | 'milky-way-class'
  | 'triangulum-class'
  | 'whirlpool-class'
  | 'pinwheel-class'
  | 'm87-class'
  | 'ngc-class'
  | 'magellanic-class'
  | 'ic-class'
  | 'bajoran-class'
  | 'cardassian-class'
  | 'romulan-class'
  | 'borg-collective'
  | 'dominion-class';

// ============================================================================
// INTERFACES
// ============================================================================

export interface GalaxyMorphologyType {
  readonly id: GalaxyMorphology;
  readonly name: string;
  readonly description: string;
  readonly designation: GalaxyDesignation;
  readonly baseSize: GalaxySizeVariant;
  readonly basePopulation: GalaxyPopulation;
  readonly baseMetallicity: GalaxyMetallicity;
  readonly minStars: number;
  readonly maxStars: number;
  readonly spiralArmCount: number;
  readonly luminosity: number;
  readonly avgAge: number;
}

export interface GalaxyClassification {
  readonly morphology: GalaxyMorphology;
  readonly class: GalaxyClass;
  readonly subclass: GalaxySubclass;
  readonly category: GalaxyCategory;
  readonly subcategory: GalaxySubcategory;
  readonly designation: GalaxyDesignation;
  readonly sizeVariant: GalaxySizeVariant;
  readonly population: GalaxyPopulation;
  readonly metallicity: GalaxyMetallicity;
}

export interface GalaxyProperties {
  readonly classification: GalaxyClassification;
  readonly name: string;
  readonly dangerLevel: number;
  readonly resourceMultiplier: number;
  readonly habitabilityScore: number;
  readonly estimatedStarCount: number;
  readonly estimatedSystemCount: number;
  readonly warpTravelModifier: number;
  readonly anomalyChance: number;
  readonly wormholePresence: boolean;
  readonly borgAssimilationRisk: number;
  readonly romulanCloakField: boolean;
  readonly dominionControlStrength: number;
  readonly bajoranWormholeStability: number;
  readonly cardassianMilitaryPresence: number;
}

// ============================================================================
// CLASS DEFINITIONS
// ============================================================================

export interface GalaxyClassDef {
  readonly id: GalaxyClass;
  readonly name: string;
  readonly rank: number;
  readonly habitabilityRange: [number, number];
  readonly resourceRichnessRange: [number, number];
  readonly description: string;
}

export interface GalaxySubclassDef {
  readonly id: GalaxySubclass;
  readonly name: string;
  readonly modifier: number;
  readonly description: string;
}

export interface GalaxyCategoryDef {
  readonly id: GalaxyCategory;
  readonly name: string;
  readonly description: string;
  readonly dangerRange: [number, number];
  readonly resourceRange: [number, number];
}

export interface GalaxySubcategoryDef {
  readonly id: GalaxySubcategory;
  readonly name: string;
  readonly description: string;
  readonly travelDifficulty: number;
}

// ============================================================================
// DATA REGISTRIES
// ============================================================================

export const GALAXY_MORPHOLOGY_TYPES: readonly GalaxyMorphologyType[] = [
  // ========== SPIRAL VARIANTS ==========
  {
    id: 'spiral-normal',
    name: 'Normal Spiral Galaxy',
    description: 'Classic spiral galaxy with winding arms of gas, dust, and young stars emanating from a central bulge.',
    designation: 'milky-way-class',
    baseSize: 'large',
    basePopulation: 'population-i',
    baseMetallicity: 'solar',
    minStars: 100_000_000,
    maxStars: 400_000_000,
    spiralArmCount: 2,
    luminosity: 0.85,
    avgAge: 10_000,
  },
  {
    id: 'spiral-barred',
    name: 'Barred Spiral Galaxy',
    description: 'Spiral galaxy with a prominent central bar of stars; the bar channels gas inward to fuel star formation.',
    designation: 'andromeda-class',
    baseSize: 'large',
    basePopulation: 'population-i',
    baseMetallicity: 'super-solar',
    minStars: 200_000_000,
    maxStars: 1_000_000_000,
    spiralArmCount: 2,
    luminosity: 0.92,
    avgAge: 12_000,
  },
  {
    id: 'spiral-grand-design',
    name: 'Grand Design Spiral',
    description: 'Spiral with exceptionally well-defined, symmetrical arms stretching across the entire disc.',
    designation: 'pinwheel-class',
    baseSize: 'colossal',
    basePopulation: 'population-i',
    baseMetallicity: 'enriched',
    minStars: 500_000_000,
    maxStars: 2_000_000_000,
    spiralArmCount: 2,
    luminosity: 1.0,
    avgAge: 8_000,
  },
  // ========== ELLIPTICAL VARIANTS ==========
  {
    id: 'elliptical-e0',
    name: 'Elliptical Galaxy E0',
    description: 'Nearly spherical elliptical galaxy composed of old, red stars with minimal gas or dust.',
    designation: 'm87-class',
    baseSize: 'colossal',
    basePopulation: 'population-ii',
    baseMetallicity: 'metal-rich',
    minStars: 1_000_000_000,
    maxStars: 10_000_000_000,
    spiralArmCount: 0,
    luminosity: 0.75,
    avgAge: 13_000,
  },
  {
    id: 'elliptical-e3',
    name: 'Elliptical Galaxy E3',
    description: 'Moderately elongated elliptical; ancient stellar population with occasional globular clusters.',
    designation: 'ngc-class',
    baseSize: 'large',
    basePopulation: 'population-ii',
    baseMetallicity: 'metal-rich',
    minStars: 500_000_000,
    maxStars: 5_000_000_000,
    spiralArmCount: 0,
    luminosity: 0.7,
    avgAge: 12_500,
  },
  {
    id: 'elliptical-e5',
    name: 'Elliptical Galaxy E5',
    description: 'Clearly elongated elliptical galaxy; host to massive globular cluster systems.',
    designation: 'ngc-class',
    baseSize: 'medium',
    basePopulation: 'population-ii',
    baseMetallicity: 'metal-poor',
    minStars: 100_000_000,
    maxStars: 2_000_000_000,
    spiralArmCount: 0,
    luminosity: 0.6,
    avgAge: 13_500,
  },
  {
    id: 'elliptical-e7',
    name: 'Elliptical Galaxy E7',
    description: 'Highly flattened elliptical galaxy near the lenticular transition boundary.',
    designation: 'ngc-class',
    baseSize: 'medium',
    basePopulation: 'population-ii',
    baseMetallicity: 'sub-solar',
    minStars: 50_000_000,
    maxStars: 1_000_000_000,
    spiralArmCount: 0,
    luminosity: 0.55,
    avgAge: 12_000,
  },
  // ========== LENTICULAR ==========
  {
    id: 'lenticular',
    name: 'Lenticular Galaxy',
    description: 'Disc galaxy that has exhausted its gas supply; no visible spiral arms, but retains a prominent bulge and disc.',
    designation: 'triangulum-class',
    baseSize: 'medium',
    basePopulation: 'mixed',
    baseMetallicity: 'solar',
    minStars: 50_000_000,
    maxStars: 500_000_000,
    spiralArmCount: 0,
    luminosity: 0.65,
    avgAge: 11_000,
  },
  // ========== IRREGULAR ==========
  {
    id: 'irregular',
    name: 'Irregular Galaxy',
    description: 'Galaxy lacking a distinct shape; often rich in gas and undergoing active star formation.',
    designation: 'ic-class',
    baseSize: 'small',
    basePopulation: 'population-i',
    baseMetallicity: 'sub-solar',
    minStars: 1_000_000,
    maxStars: 50_000_000,
    spiralArmCount: 0,
    luminosity: 0.4,
    avgAge: 5_000,
  },
  // ========== RING ==========
  {
    id: 'ring',
    name: 'Ring Galaxy',
    description: 'Galaxy with a prominent ring of star formation encircling a relatively empty central region.',
    designation: 'whirlpool-class',
    baseSize: 'medium',
    basePopulation: 'population-i',
    baseMetallicity: 'solar',
    minStars: 10_000_000,
    maxStars: 200_000_000,
    spiralArmCount: 0,
    luminosity: 0.7,
    avgAge: 7_000,
  },
  // ========== COMPANION ==========
  {
    id: 'companion',
    name: 'Companion Galaxy',
    description: 'Small galaxy gravitationally bound to a larger host; often tidally distorted.',
    designation: 'magellanic-class',
    baseSize: 'small',
    basePopulation: 'mixed',
    baseMetallicity: 'metal-poor',
    minStars: 10_000_000,
    maxStars: 100_000_000,
    spiralArmCount: 0,
    luminosity: 0.3,
    avgAge: 9_000,
  },
  // ========== DWARF ==========
  {
    id: 'dwarf',
    name: 'Dwarf Galaxy',
    description: 'Small, low-luminosity galaxy; the most common type in the local group.',
    designation: 'magellanic-class',
    baseSize: 'miniature',
    basePopulation: 'mixed',
    baseMetallicity: 'metal-poor',
    minStars: 1_000_000,
    maxStars: 20_000_000,
    spiralArmCount: 0,
    luminosity: 0.15,
    avgAge: 6_000,
  },
  // ========== GIANT ==========
  {
    id: 'giant',
    name: 'Giant Elliptical Galaxy',
    description: 'Among the most massive galaxies known; typically found at cluster centers with vast dark matter halos.',
    designation: 'm87-class',
    baseSize: 'supergiant',
    basePopulation: 'population-ii',
    baseMetallicity: 'enriched',
    minStars: 5_000_000_000,
    maxStars: 50_000_000_000,
    spiralArmCount: 0,
    luminosity: 1.2,
    avgAge: 13_800,
  },
  // ========== INTERACTING ==========
  {
    id: 'interacting',
    name: 'Interacting Galaxy Pair',
    description: 'Two or more galaxies in gravitational interaction; triggers massive starburst activity.',
    designation: 'whirlpool-class',
    baseSize: 'colossal',
    basePopulation: 'population-i',
    baseMetallicity: 'super-solar',
    minStars: 200_000_000,
    maxStars: 2_000_000_000,
    spiralArmCount: 0,
    luminosity: 1.1,
    avgAge: 8_000,
  },
  // ========== PECULIAR ==========
  {
    id: 'peculiar',
    name: 'Peculiar Galaxy',
    description: 'Galaxy with unusual structure caused by gravitational interaction or internal processes.',
    designation: 'bajoran-class',
    baseSize: 'medium',
    basePopulation: 'mixed',
    baseMetallicity: 'solar',
    minStars: 10_000_000,
    maxStars: 500_000_000,
    spiralArmCount: 0,
    luminosity: 0.6,
    avgAge: 9_500,
  },
  // ========== cD ==========
  {
    id: 'cd',
    name: 'cD Galaxy',
    description: 'Extended diffuse galaxy type typically found at the center of rich galaxy clusters; cannibalistic evolution.',
    designation: 'dominion-class',
    baseSize: 'supergiant',
    basePopulation: 'population-ii',
    baseMetallicity: 'metal-rich',
    minStars: 10_000_000_000,
    maxStars: 100_000_000_000,
    spiralArmCount: 0,
    luminosity: 1.4,
    avgAge: 13_800,
  },
  // ========== MAGELLANIC ==========
  {
    id: 'magellanic',
    name: 'Magellanic-type Galaxy',
    description: 'Irregular dwarf with some bar structure; named after the Large Magellanic Cloud.',
    designation: 'magellanic-class',
    baseSize: 'small',
    basePopulation: 'population-i',
    baseMetallicity: 'metal-poor',
    minStars: 5_000_000,
    maxStars: 30_000_000,
    spiralArmCount: 0,
    luminosity: 0.25,
    avgAge: 4_000,
  },
] as const;

// ============================================================================
// CLASS RANKINGS
// ============================================================================

export const GALAXY_CLASSES: readonly GalaxyClassDef[] = [
  {
    id: 'class-a',
    name: 'Prime Nexus',
    rank: 1,
    habitabilityRange: [85, 100],
    resourceRichnessRange: [90, 100],
    description: 'Galaxy of exceptional habitability and resource abundance. Core worlds flourish with advanced civilizations.',
  },
  {
    id: 'class-b',
    name: 'Stellar Haven',
    rank: 2,
    habitabilityRange: [65, 84],
    resourceRichnessRange: [70, 89],
    description: 'Highly habitable galaxy with rich resource deposits. Ideal for colonial expansion.',
  },
  {
    id: 'class-c',
    name: 'Balanced Realm',
    rank: 3,
    habitabilityRange: [40, 64],
    resourceRichnessRange: [45, 69],
    description: 'Moderate habitability and resources. Typical of established frontier regions.',
  },
  {
    id: 'class-d',
    name: 'Rimward Reach',
    rank: 4,
    habitabilityRange: [20, 39],
    resourceRichnessRange: [25, 44],
    description: 'Marginal habitability. Resources are present but extraction is costly.',
  },
  {
    id: 'class-e',
    name: 'Desolate Expanse',
    rank: 5,
    habitabilityRange: [5, 19],
    resourceRichnessRange: [10, 24],
    description: 'Hostile environment with sparse resources. Only hardened outposts survive.',
  },
  {
    id: 'class-f',
    name: 'Dead Void',
    rank: 6,
    habitabilityRange: [0, 4],
    resourceRichnessRange: [0, 9],
    description: 'Near-zero habitability. Empty space or lethal radiation zones.',
  },
] as const;

// ============================================================================
// SUBCLASS MODIFIERS
// ============================================================================

export const GALAXY_SUBCLASSES: readonly GalaxySubclassDef[] = [
  { id: 'alpha', name: 'Alpha', modifier: 1.5, description: 'Resource-rich, highly developed region' },
  { id: 'beta', name: 'Beta', modifier: 1.25, description: 'Well-established with moderate surplus' },
  { id: 'gamma', name: 'Gamma', modifier: 1.0, description: 'Standard conditions, unmodified' },
  { id: 'delta', name: 'Delta', modifier: 0.75, description: 'Dangerous, unstable, or contested space' },
  { id: 'epsilon', name: 'Epsilon', modifier: 0.5, description: 'Severely compromised, high risk' },
  { id: 'zeta', name: 'Zeta', modifier: 1.35, description: 'Ancient ruins and dormant technologies' },
  { id: 'theta', name: 'Theta', modifier: 0.6, description: 'Anomalous physics, reality distortions' },
  { id: 'omega', name: 'Omega', modifier: 0.25, description: 'Extinction-level hazard zone' },
] as const;

// ============================================================================
// CATEGORIES
// ============================================================================

export const GALAXY_CATEGORIES: readonly GalaxyCategoryDef[] = [
  {
    id: 'hostile',
    name: 'Hostile Expanse',
    description: 'Region dominated by aggressive empires, pirate enclaves, or predatory fauna. Travel and colonization are high-risk.',
    dangerRange: [60, 100],
    resourceRange: [20, 60],
  },
  {
    id: 'neutral',
    name: 'Neutral Space',
    description: 'Contested or independent territory with no dominant faction. Trade and diplomacy are possible but fragile.',
    dangerRange: [30, 59],
    resourceRange: [40, 70],
  },
  {
    id: 'fertile',
    name: 'Fertile Domain',
    description: 'Resource-rich and relatively safe. Prime territory for colony worlds and trade route development.',
    dangerRange: [5, 29],
    resourceRange: [60, 95],
  },
  {
    id: 'ancient',
    name: 'Ancient Remnant',
    description: 'Regions shaped by long-dead civilizations. Ruins, artifacts, and dormant megastructures are common.',
    dangerRange: [20, 65],
    resourceRange: [50, 90],
  },
  {
    id: 'volatile',
    name: 'Volatile Frontier',
    description: 'Unstable space subject to cosmic phenomena: supernovae remnants, black hole clusters, or dimensional rifts.',
    dangerRange: [50, 95],
    resourceRange: [30, 80],
  },
] as const;

// ============================================================================
// SUBCATEGORIES
// ============================================================================

export const GALAXY_SUBCATEGORIES: readonly GalaxySubcategoryDef[] = [
  { id: 'frontier', name: 'Frontier', description: 'Edge of known space. Exploration and opportunity in equal measure.', travelDifficulty: 0.8 },
  { id: 'core-worlds', name: 'Core Worlds', description: 'Heart of civilization. Dense infrastructure, high security, steep competition.', travelDifficulty: 0.5 },
  { id: 'wild-space', name: 'Wild Space', description: 'Uncharted regions beyond official borders. Anything goes.', travelDifficulty: 1.2 },
  { id: 'claimed', name: 'Claimed Territory', description: 'Sovereign space under established governance. Permits required for transit.', travelDifficulty: 0.6 },
  { id: 'disputed', name: 'Disputed Zone', description: 'Multiple factions contest control. Fleets are on high alert.', travelDifficulty: 1.0 },
  { id: 'void-touched', name: 'Void-Touched', description: 'Regions permeated by dark energy anomalies. FTL navigation is unreliable.', travelDifficulty: 1.4 },
  { id: 'nexus-point', name: 'Nexus Point', description: 'Strategic crossroads of wormholes and trade routes. High value, high attention.', travelDifficulty: 0.7 },
  { id: 'lost-sector', name: 'Lost Sector', description: 'Severed from normal space by cataclysmic events. Ancient relics and forgotten horrors.', travelDifficulty: 1.5 },
] as const;

// ============================================================================
// DESIGNATION MAP
// ============================================================================

export const GALAXY_DESIGNATIONS: Record<GalaxyMorphology, GalaxyDesignation> = {
  'spiral-normal': 'milky-way-class',
  'spiral-barred': 'andromeda-class',
  'spiral-grand-design': 'pinwheel-class',
  'elliptical-e0': 'm87-class',
  'elliptical-e3': 'ngc-class',
  'elliptical-e5': 'ngc-class',
  'elliptical-e7': 'ngc-class',
  'lenticular': 'triangulum-class',
  'irregular': 'ic-class',
  'ring': 'whirlpool-class',
  'companion': 'magellanic-class',
  'dwarf': 'magellanic-class',
  'giant': 'm87-class',
  'interacting': 'whirlpool-class',
  'peculiar': 'bajoran-class',
  'cd': 'dominion-class',
  'magellanic': 'magellanic-class',
} as const;

export const DESIGNATION_NAMES: Record<GalaxyDesignation, string> = {
  'andromeda-class': 'Andromeda-class',
  'milky-way-class': 'Milky Way-class',
  'triangulum-class': 'Triangulum-class',
  'whirlpool-class': 'Whirlpool-class',
  'pinwheel-class': 'Pinwheel-class',
  'm87-class': 'M87-class',
  'ngc-class': 'NGC-class',
  'magellanic-class': 'Magellanic-class',
  'ic-class': 'IC-class',
  'bajoran-class': 'Bajoran-class',
  'cardassian-class': 'Cardassian-class',
  'romulan-class': 'Romulan-class',
  'borg-collective': 'Borg-Collective',
  'dominion-class': 'Dominion-class',
} as const;

// ============================================================================
// HELPER: SEEDED PRNG (deterministic)
// ============================================================================

function mulberry32(seed: number): () => number {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function deterministicHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    hash = ((hash << 5) - hash + ch) | 0;
  }
  return hash;
}

// ============================================================================
// HELPER: classifyGalaxy
// ============================================================================

export function classifyGalaxy(
  morphology: GalaxyMorphology,
  size: GalaxySizeVariant,
  habitability: number,
): GalaxyClassification {
  const morpho = GALAXY_MORPHOLOGY_TYPES.find((m) => m.id === morphology);
  if (!morpho) throw new Error(`Unknown morphology: ${morphology}`);

  let galaxyClass: GalaxyClass;
  if (habitability >= 85) galaxyClass = 'class-a';
  else if (habitability >= 65) galaxyClass = 'class-b';
  else if (habitability >= 40) galaxyClass = 'class-c';
  else if (habitability >= 20) galaxyClass = 'class-d';
  else if (habitability >= 5) galaxyClass = 'class-e';
  else galaxyClass = 'class-f';

  let subclass: GalaxySubclass;
  if (habitability >= 80) subclass = 'alpha';
  else if (habitability >= 60) subclass = 'beta';
  else if (habitability >= 40) subclass = 'gamma';
  else if (habitability >= 25) subclass = 'delta';
  else if (habitability >= 10) subclass = 'epsilon';
  else subclass = 'omega';

  let category: GalaxyCategory;
  if (habitability >= 60) category = 'fertile';
  else if (habitability >= 40) category = 'neutral';
  else if (habitability >= 20) category = 'ancient';
  else if (habitability >= 10) category = 'volatile';
  else category = 'hostile';

  const subcategory: GalaxySubcategory = (['core-worlds', 'frontier', 'claimed', 'disputed', 'wild-space', 'nexus-point', 'void-touched', 'lost-sector'] as const)[
    Math.floor(habitability / 12.5) % 8
  ];

  return {
    morphology,
    class: galaxyClass,
    subclass,
    category,
    subcategory,
    designation: morpho.designation,
    sizeVariant: size,
    population: morpho.basePopulation,
    metallicity: morpho.baseMetallicity,
  };
}

// ============================================================================
// HELPER: getGalaxyName (deterministic from seed)
// ============================================================================

const GALAXY_PREFIXES = [
  'Utopia', 'Spira', 'Nebula', 'Quasar', 'Pulsar', 'Zenith', 'Apex', 'Crux',
  'Orion', 'Lyra', 'Cygnus', 'Draco', 'Phoenix', 'Vela', 'Centaurus', 'Aquila',
  'Andromeda', 'Carina', 'Gemini', 'Taurus', 'Sagittarius', 'Orion', 'Pegasus',
  'Perseus', 'Libra', 'Scorpius', 'Hydra', 'Chamaeleon', 'Octans', 'Tucana',
];

const GALAXY_SUFFIXES = [
  'Nebula', 'Reach', 'Expanse', 'Frontier', 'Domain', 'Sector', 'Quadrant',
  'Verge', 'Arm', 'Spur', 'Ring', 'Cluster', 'Stream', 'Void', 'Rift',
  'Depths', 'Marches', 'Bastion', 'Nexus', 'Gate', 'Crossing', 'Haven',
];

const GALAXY_ADJECTIVES = [
  'Crimson', 'Azure', 'Golden', 'Silver', 'Emerald', 'Obsidian', 'Crystal',
  'Iron', 'Shadow', 'Radiant', 'Frozen', 'Blazing', 'Phantom', 'Stellar',
  'Astral', 'Void', 'Eternal', 'Ancient', 'Forgotten', 'Shrouded',
];

export function getGalaxyName(type: GalaxyMorphology, seed: number): string {
  const rng = mulberry32(seed ^ deterministicHash(type));
  const prefix = GALAXY_PREFIXES[Math.floor(rng() * GALAXY_PREFIXES.length)];
  const adj = GALAXY_ADJECTIVES[Math.floor(rng() * GALAXY_ADJECTIVES.length)];
  const suffix = GALAXY_SUFFIXES[Math.floor(rng() * GALAXY_SUFFIXES.length)];
  const numeral = Math.floor(rng() * 900) + 100;

  return `${prefix} ${adj} ${suffix} ${numeral}`;
}

// ============================================================================
// HELPER: getGalaxyDangerLevel (1-100)
// ============================================================================

export function getGalaxyDangerLevel(classification: GalaxyClassification): number {
  const catDef = GALAXY_CATEGORIES.find((c) => c.id === classification.category);
  const classDef = GALAXY_CLASSES.find((c) => c.id === classification.class);
  const subDef = GALAXY_SUBCLASSES.find((s) => s.id === classification.subclass);

  if (!catDef || !classDef || !subDef) return 50;

  const midRange = (catDef.dangerRange[0] + catDef.dangerRange[1]) / 2;
  const classModifier = classDef.rank / 6;
  const subclassModifier = subDef.modifier;

  let danger = midRange * classModifier * (2 - subclassModifier);
  danger = Math.max(1, Math.min(100, Math.round(danger)));
  return danger;
}

// ============================================================================
// HELPER: getGalaxyResourceMultiplier
// ============================================================================

export function getGalaxyResourceMultiplier(classification: GalaxyClassification): number {
  const classDef = GALAXY_CLASSES.find((c) => c.id === classification.class);
  const subDef = GALAXY_SUBCLASSES.find((s) => s.id === classification.subclass);

  if (!classDef || !subDef) return 1.0;

  const midRichness = (classDef.resourceRichnessRange[0] + classDef.resourceRichnessRange[1]) / 2;
  const baseMultiplier = midRichness / 50;
  return Math.round(baseMultiplier * subDef.modifier * 100) / 100;
}

// ============================================================================
// LOOKUP HELPERS
// ============================================================================

export function getMorphologyType(id: GalaxyMorphology): GalaxyMorphologyType | undefined {
  return GALAXY_MORPHOLOGY_TYPES.find((m) => m.id === id);
}

export function getClassDef(id: GalaxyClass): GalaxyClassDef | undefined {
  return GALAXY_CLASSES.find((c) => c.id === id);
}

export function getSubclassDef(id: GalaxySubclass): GalaxySubclassDef | undefined {
  return GALAXY_SUBCLASSES.find((s) => s.id === id);
}

export function getCategoryDef(id: GalaxyCategory): GalaxyCategoryDef | undefined {
  return GALAXY_CATEGORIES.find((c) => c.id === id);
}

export function getSubcategoryDef(id: GalaxySubcategory): GalaxySubcategoryDef | undefined {
  return GALAXY_SUBCATEGORIES.find((s) => s.id === id);
}

export function getDesignationName(designation: GalaxyDesignation): string {
  return DESIGNATION_NAMES[designation] ?? designation;
}

// ============================================================================
// FULL PROPERTIES BUILDER
// ============================================================================

export function buildGalaxyProperties(
  classification: GalaxyClassification,
  seed: number,
): GalaxyProperties {
  const morpho = getMorphologyType(classification.morphology)!;
  const dangerLevel = getGalaxyDangerLevel(classification);
  const resourceMultiplier = getGalaxyResourceMultiplier(classification);
  const name = getGalaxyName(classification.morphology, seed);

  const sizeMultiplier: Record<GalaxySizeVariant, number> = {
    miniature: 0.01,
    small: 0.1,
    medium: 0.5,
    large: 1.0,
    colossal: 5.0,
    supergiant: 20.0,
  };

  const avgStars = Math.round(
    ((morpho.minStars + morpho.maxStars) / 2) * (sizeMultiplier[classification.sizeVariant] ?? 1),
  );
  const systemsPerStar = 0.001;
  const estimatedSystems = Math.round(avgStars * systemsPerStar);

  const habitabilityScore = classification.class === 'class-a' ? 90
    : classification.class === 'class-b' ? 75
    : classification.class === 'class-c' ? 50
    : classification.class === 'class-d' ? 30
    : classification.class === 'class-e' ? 12
    : 2;

  const warpTravelModifier = classification.subclass === 'omega' ? 0.2
    : classification.subcategory === 'void-touched' ? 0.4
    : classification.subcategory === 'wild-space' ? 0.7
    : classification.subcategory === 'core-worlds' ? 1.5
    : 1.0;

  const anomalyChance = classification.category === 'volatile' ? 0.35
    : classification.category === 'ancient' ? 0.25
    : classification.subcategory === 'nexus-point' ? 0.4
    : 0.05;

  const isBorg = classification.designation === 'borg-collective';
  const isRomulan = classification.designation === 'romulan-class';
  const isDominion = classification.designation === 'dominion-class';
  const isBajoran = classification.designation === 'bajoran-class';
  const isCardassian = classification.designation === 'cardassian-class';

  return {
    classification,
    name,
    dangerLevel,
    resourceMultiplier,
    habitabilityScore,
    estimatedStarCount: avgStars,
    estimatedSystemCount: estimatedSystems,
    warpTravelModifier: Math.round(warpTravelModifier * 100) / 100,
    anomalyChance: Math.round(anomalyChance * 100) / 100,
    wormholePresence: isBajoran || classification.subcategory === 'nexus-point',
    borgAssimilationRisk: isBorg ? 85 : classification.category === 'hostile' ? 15 : 0,
    romulanCloakField: isRomulan,
    dominionControlStrength: isDominion ? 90 : classification.subcategory === 'claimed' ? 30 : 0,
    bajoranWormholeStability: isBajoran ? 80 : 0,
    cardassianMilitaryPresence: isCardassian ? 75 : classification.category === 'hostile' ? 20 : 0,
  };
}
