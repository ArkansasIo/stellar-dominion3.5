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

export type MegastructureClass = 
  | 'superweapon' 
  | 'infrastructure' 
  | 'research' 
  | 'production' 
  | 'defense' 
  | 'mobility' 
  | 'exotic';

export const MEGASTRUCTURE_CATEGORY_METADATA: Record<MegastructureClass, { label: string; description: string; order: number }> = {
  infrastructure: {
    label: 'Infrastructure',
    description: 'Large-scale energy and habitat backbone systems',
    order: 1,
  },
  production: {
    label: 'Production',
    description: 'Industrial-scale fabrication and conversion systems',
    order: 2,
  },
  research: {
    label: 'Research',
    description: 'Scientific acceleration and advanced discovery systems',
    order: 3,
  },
  defense: {
    label: 'Defense',
    description: 'Fortification, shielding, and planetary protection',
    order: 4,
  },
  mobility: {
    label: 'Mobility',
    description: 'Interstellar transit and stellar movement systems',
    order: 5,
  },
  exotic: {
    label: 'Exotic',
    description: 'Dimensional and non-standard physics structures',
    order: 6,
  },
  superweapon: {
    label: 'Superweapon',
    description: 'Strategic-scale offensive megastructures',
    order: 7,
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
  
  description: string;
  lore: string;
  
  // Progression
  level: number;
  tier: number;
  experience: number;
  progressionConfig: MegastructureProgressionConfig;
  
  // Stats
  baseStats: MegastructureStats;
  currentStats: MegastructureStats;
  
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

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  MEGASTRUCTURES,
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
  getAllMegastructureTypes,
  getAllMegastructureClasses,
  getAllMegastructureSubClasses,
  getMegastructureCategoryMeta,
  getMegastructureTierFromLevel,
  calculateMegastructureConstructionCost,
  calculateMegastructureUpgradeCost,
  getMegastructureCatalogByCategory,
};
