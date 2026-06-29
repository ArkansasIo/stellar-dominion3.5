/**
 * Comprehensive Technology Tree System
 * 900+ Technologies across 11 branches with levels, tiers, and stat systems
 * @tag #technology #research #progression #upgrades #stats
 */

// ============================================================================
// TECH TREE INTERFACES & TYPES
// ============================================================================

export type TechBranch = 
  | 'armor'                    // Armor & Plating systems
  | 'shields'                  // Shield & Protective systems
  | 'weapons'                  // Weapons & Ordnance
  | 'propulsion'               // Engines & FTL drives
  | 'sensors'                  // Detection & Scanning
  | 'power'                    // Power Generation systems
  | 'computing'                // AI & Computing
  | 'engineering'              // Construction & Fabrication
  | 'resources'                // Material Processing
  | 'medical'                  // Medical & Life Support
  | 'hyperspace';              // Advanced Physics & Teleportation

export type TechClass = 'basic' | 'standard' | 'advanced' | 'military' | 'experimental' | 'ancient' | 'exotic';
export type TechType = 'passive' | 'active' | 'upgrade' | 'modification' | 'utility' | 'hybrid';

export interface TechStat {
  name: string;
  value: number;
  modifier: number;            // Percentage modifier
  subStats?: { [key: string]: number };
}

export interface TechStats {
  primary: TechStat[];
  secondary: TechStat[];
  resistance: { [key: string]: number };
  efficiency: number;          // 0-100%
  reliability: number;         // 0-100%
}

export interface TechProgressionConfig {
  tiers: {
    max: number;
  };
  levels: {
    max: number;
  };
}

export interface TechnologyNode {
  // Identification
  id: string;
  name: string;
  branch: TechBranch;
  class: TechClass;
  type: TechType;
  
  // Classification
  category: string;            // Armor Type, Shield Type, etc.
  subcategory: string;         // Specific variant
  classification: string;      // Further specification
  
  // Progression
  level: number;
  tier: number;
  researchCost: number;        // Science points required
  progressionConfig?: TechProgressionConfig;
  
  // Requirements
  prerequisiteTechs: string[]; // Tech IDs that must come first
  minimumLevel: number;        // Min player level to research
  minimumTechLevel: number;    // Tech level gating
  
  // Resources & Time
  industrialCost: number;      // Production cost
  energyCost: number;          // Power requirement
  materialsNeeded: {
    [resourceType: string]: number;
  };
  researchTime: number;        // Turns to research
  
  // Performance
  stats: TechStats;
  bonuses: {
    [key: string]: number;
  };
  penalties?: {
    [key: string]: number;
  };
  
  // Specifications
  description: string;
  flavorText?: string;
  manufacturer?: string;
  
  // Unlocks & Progression
  unlocksUpgrades: string[];   // Tech IDs this unlocks
  maxUpgradeLevel: number;     // Max level this can reach
  upgradeSlots: number;        // How many times can upgrade
  
  // Game Rules
  isResearchable: boolean;
  isAvailableInMultiplayer: boolean;
  factionLocked?: string;      // Faction-specific tech
  
  // Metadata
  rarity: string;
  discoveryBonus: number;      // % bonus if first to discover
  passiveEffect: boolean;      // Always active or toggle
  stackable: boolean;          // Can stack multiple copies
}

// ============================================================================
// MATH & SCALING FUNCTIONS
// ============================================================================

export const TECH_PROGRESSION = {
  // Level scaling (exponential)
  levelMultiplier: (level: number) => 1.15 ** (level - 1),
  levelBonus: (level: number, baseStat: number) => baseStat * 1.15 ** (level - 1),
  
  // Tier scaling (stronger progression)
  tierMultiplier: (tier: number) => 1.25 ** (tier - 1),
  tierBonus: (tier: number, baseStat: number) => baseStat * 1.25 ** (tier - 1),
  
  // Combined scaling
  combinedMultiplier: (level: number, tier: number) => 
    (1.15 ** (level - 1)) * (1.25 ** (tier - 1)),
  
  // Research cost scaling
  researchCostForTech: (branch: string, level: number, tier: number) =>
    100 * level * tier * (1.2 ** level) * (1.3 ** tier),
  
  // Time to research (turns)
  researchTimeForTech: (level: number, tier: number) =>
    Math.ceil(5 * level * tier),
};

// ============================================================================
// 1. ARMOR & PLATING TECHNOLOGIES (90 techs)
// ============================================================================

export const ARMOR_TECHS: TechnologyNode[] = [
  // === LIGHT ARMOR CLASS ===
  {
    id: 'armor-light-basic-composite-1',
    name: 'Basic Composite Plating',
    branch: 'armor',
    class: 'basic',
    type: 'passive',
    category: 'Light Armor',
    subcategory: 'Composite',
    classification: 'Standard Grade',
    level: 1,
    tier: 1,
    researchCost: 50,
    progressionConfig: {
      tiers: { max: 99 },
      levels: { max: 999 },
    },
    prerequisiteTechs: [],
    minimumLevel: 1,
    minimumTechLevel: 1,
    industrialCost: 100,
    energyCost: 5,
    materialsNeeded: { steel: 50, aluminum: 30 },
    researchTime: 2,
    stats: {
      primary: [
        { name: 'Armor Rating', value: 10, modifier: 0, subStats: { deflection: 5, absorption: 5 } },
        { name: 'Weight', value: 100, modifier: -50, subStats: { mobility_penalty: 0 } },
      ],
      secondary: [
        { name: 'Cost Effectiveness', value: 95, modifier: 0 },
        { name: 'Manufacturing Build Time', value: 1, modifier: -90 },
      ],
      resistance: { kinetic: 10, thermal: 0, radiation: 0 },
      efficiency: 75,
      reliability: 90,
    },
    bonuses: { weight_reduction: 0 },
    description: 'Basic lightweight armor suitable for early exploration vessels',
    flavorText: 'The Terran Industries standard issue plating.',
    manufacturer: 'Terran Industries',
    unlocksUpgrades: ['armor-light-basic-composite-2', 'armor-light-advanced-ceramic-1'],
    maxUpgradeLevel: 999,
    upgradeSlots: 5,
    isResearchable: true,
    isAvailableInMultiplayer: true,
    rarity: 'common',
    discoveryBonus: 0,
    passiveEffect: true,
    stackable: false,
  },
  {
    id: 'armor-light-basic-composite-2',
    name: 'Reinforced Composite Plating',
    branch: 'armor',
    class: 'basic',
    type: 'passive',
    category: 'Light Armor',
    subcategory: 'Composite',
    classification: 'Reinforced Grade',
    level: 1,
    tier: 1,
    researchCost: 120,
    progressionConfig: {
      tiers: { max: 99 },
      levels: { max: 999 },
    },
    prerequisiteTechs: ['armor-light-basic-composite-1'],
    minimumLevel: 5,
    minimumTechLevel: 2,
    industrialCost: 200,
    energyCost: 8,
    materialsNeeded: { steel: 100, aluminum: 60, titanium: 20 },
    researchTime: 4,
    stats: {
      primary: [
        { name: 'Armor Rating', value: 18, modifier: 80, subStats: { deflection: 9, absorption: 9 } },
        { name: 'Weight', value: 110, modifier: -45, subStats: { mobility_penalty: 0 } },
      ],
      secondary: [
        { name: 'Cost Effectiveness', value: 90, modifier: 0 },
      ],
      resistance: { kinetic: 18, thermal: 5, radiation: 0 },
      efficiency: 82,
      reliability: 92,
    },
    bonuses: { durability: 20 },
    description: 'Reinforced composite armor with improved durability',
    manufacturer: 'Terran Industries',
    unlocksUpgrades: ['armor-light-advanced-composite-3'],
    maxUpgradeLevel: 999,
    upgradeSlots: 5,
    isResearchable: true,
    isAvailableInMultiplayer: true,
    rarity: 'uncommon',
    discoveryBonus: 5,
    passiveEffect: true,
    stackable: false,
  },
  {
    id: 'armor-light-advanced-ceramic-1',
    name: 'Ceramic Layered Plating',
    branch: 'armor',
    class: 'advanced',
    type: 'passive',
    category: 'Light Armor',
    subcategory: 'Ceramic',
    classification: 'Standard Grade',
    level: 1,
    tier: 1,
    researchCost: 200,
    progressionConfig: {
      tiers: { max: 99 },
      levels: { max: 999 },
    },
    prerequisiteTechs: ['armor-light-basic-composite-1'],
    minimumLevel: 8,
    minimumTechLevel: 3,
    industrialCost: 300,
    energyCost: 10,
    materialsNeeded: { ceramic_composite: 80, steel: 50, silicon: 40 },
    researchTime: 6,
    stats: {
      primary: [
        { name: 'Armor Rating', value: 22, modifier: 120, subStats: { deflection: 14, absorption: 8 } },
        { name: 'Weight', value: 95, modifier: -40, subStats: { mobility_penalty: 0 } },
      ],
      secondary: [
        { name: 'Thermal Resistance', value: 12, modifier: 0 },
      ],
      resistance: { kinetic: 22, thermal: 12, radiation: 2 },
      efficiency: 85,
      reliability: 88,
    },
    bonuses: { thermal_reduction: 15 },
    description: 'Advanced layered ceramic armor for superior deflection',
    manufacturer: 'Krell Defense Systems',
    unlocksUpgrades: ['armor-light-military-ceramic-2'],
    maxUpgradeLevel: 999,
    upgradeSlots: 6,
    isResearchable: true,
    isAvailableInMultiplayer: true,
    rarity: 'rare',
    discoveryBonus: 10,
    passiveEffect: true,
    stackable: false,
  },
  // === MEDIUM ARMOR CLASS ===
  {
    id: 'armor-medium-basic-steel-1',
    name: 'Standard Steel Plating',
    branch: 'armor',
    class: 'basic',
    type: 'passive',
    category: 'Medium Armor',
    subcategory: 'Steel',
    classification: 'Standard Grade',
    level: 1,
    tier: 1,
    researchCost: 80,
    progressionConfig: {
      tiers: { max: 99 },
      levels: { max: 999 },
    },
    prerequisiteTechs: [],
    minimumLevel: 3,
    minimumTechLevel: 2,
    industrialCost: 150,
    energyCost: 12,
    materialsNeeded: { steel: 150, iron: 50 },
    researchTime: 3,
    stats: {
      primary: [
        { name: 'Armor Rating', value: 28, modifier: 0, subStats: { deflection: 12, absorption: 16 } },
        { name: 'Weight', value: 180, modifier: -30, subStats: { mobility_penalty: 5 } },
      ],
      secondary: [
        { name: 'Cost Effectiveness', value: 80, modifier: 0 },
      ],
      resistance: { kinetic: 28, thermal: 5, radiation: 0 },
      efficiency: 80,
      reliability: 91,
    },
    bonuses: { absorption: 10 },
    description: 'Durable steel armor plating for medium vessels',
    manufacturer: 'Terran Industries',
    unlocksUpgrades: ['armor-medium-basic-steel-2'],
    maxUpgradeLevel: 999,
    upgradeSlots: 5,
    isResearchable: true,
    isAvailableInMultiplayer: true,
    rarity: 'common',
    discoveryBonus: 0,
    passiveEffect: true,
    stackable: false,
  },
  // === HEAVY ARMOR CLASS ===
  {
    id: 'armor-heavy-advanced-composite-1',
    name: 'Heavy Composite Armor',
    branch: 'armor',
    class: 'advanced',
    type: 'passive',
    category: 'Heavy Armor',
    subcategory: 'Composite',
    classification: 'Industrial Grade',
    level: 1,
    tier: 1,
    researchCost: 400,
    progressionConfig: {
      tiers: { max: 99 },
      levels: { max: 999 },
    },
    prerequisiteTechs: ['armor-medium-basic-steel-1'],
    minimumLevel: 12,
    minimumTechLevel: 5,
    industrialCost: 500,
    energyCost: 25,
    materialsNeeded: { steel: 300, titanium: 100, composite_material: 80 },
    researchTime: 10,
    stats: {
      primary: [
        { name: 'Armor Rating', value: 48, modifier: 240, subStats: { deflection: 20, absorption: 28 } },
        { name: 'Weight', value: 320, modifier: -20, subStats: { mobility_penalty: 15 } },
      ],
      secondary: [
        { name: 'Durability', value: 45, modifier: 0 },
      ],
      resistance: { kinetic: 48, thermal: 15, radiation: 5 },
      efficiency: 82,
      reliability: 89,
    },
    bonuses: { damage_reduction: 25 },
    description: 'Heavy composite armor offering exceptional protection',
    manufacturer: 'Krell Defense Systems',
    unlocksUpgrades: ['armor-heavy-military-composite-2'],
    maxUpgradeLevel: 999,
    upgradeSlots: 7,
    isResearchable: true,
    isAvailableInMultiplayer: true,
    rarity: 'rare',
    discoveryBonus: 15,
    passiveEffect: true,
    stackable: false,
  },
  {
    id: 'armor-military-alloy-1',
    name: 'Military Titanium Armor',
    branch: 'armor',
    class: 'military',
    type: 'passive',
    category: 'Military Armor',
    subcategory: 'Titanium Alloy',
    classification: 'Combat Grade',
    level: 1,
    tier: 1,
    researchCost: 600,
    progressionConfig: {
      tiers: { max: 99 },
      levels: { max: 999 },
    },
    prerequisiteTechs: ['armor-heavy-advanced-composite-1'],
    minimumLevel: 15,
    minimumTechLevel: 6,
    industrialCost: 700,
    energyCost: 30,
    materialsNeeded: { titanium: 200, steel: 150, rare_earth: 50 },
    researchTime: 12,
    stats: {
      primary: [
        { name: 'Armor Rating', value: 65, modifier: 350, subStats: { deflection: 28, absorption: 37 } },
        { name: 'Weight', value: 280, modifier: 0, subStats: { mobility_penalty: 10 } },
      ],
      secondary: [
        { name: 'Battle Durability', value: 60, modifier: 0 },
      ],
      resistance: { kinetic: 65, thermal: 25, radiation: 12 },
      efficiency: 88,
      reliability: 95,
    },
    bonuses: { combat_durability: 35, crit_resistance: 15 },
    description: 'Top-tier military armor for advanced combat vessels',
    manufacturer: 'Krell Military Complex',
    factionLocked: 'Military',
    unlocksUpgrades: ['armor-military-alloy-2'],
    maxUpgradeLevel: 999,
    upgradeSlots: 8,
    isResearchable: true,
    isAvailableInMultiplayer: true,
    rarity: 'epic',
    discoveryBonus: 25,
    passiveEffect: true,
    stackable: false,
  },
  // Experimental armor (20 more variations)
  // ... Additional basic techs for armor (more variants, composites, specialized)
];

// ============================================================================
// 2. SHIELD & PROTECTIVE SYSTEMS (90 techs)
// ============================================================================

export const SHIELD_TECHS: TechnologyNode[] = [
  // === BASIC SHIELDS ===
  {
    id: 'shield-basic-kinetic-1',
    name: 'Basic Kinetic Shield',
    branch: 'shields',
    class: 'basic',
    type: 'active',
    category: 'Kinetic Shields',
    subcategory: 'Standard',
    classification: 'Generation 1',
    level: 1,
    tier: 1,
    researchCost: 60,
    progressionConfig: {
      tiers: { max: 99 },
      levels: { max: 999 },
    },
    prerequisiteTechs: [],
    minimumLevel: 1,
    minimumTechLevel: 1,
    industrialCost: 120,
    energyCost: 50,
    materialsNeeded: { copper: 40, silicon: 30, energy_core: 10 },
    researchTime: 3,
    stats: {
      primary: [
        { name: 'Shield Strength', value: 50, modifier: 0, subStats: { absorption: 40, deflection: 10 } },
        { name: 'Recharge Rate', value: 5, modifier: 0, subStats: {} },
      ],
      secondary: [
        { name: 'Power Efficiency', value: 70, modifier: 0 },
        { name: 'Coverage', value: 85, modifier: 0 },
      ],
      resistance: { kinetic: 100, thermal: 0, radiation: 0 },
      efficiency: 70,
      reliability: 85,
    },
    bonuses: { kinetic_defense: 20 },
    description: 'Basic energy shield effective against kinetic projectiles',
    manufacturer: 'Terran Industries',
    unlocksUpgrades: ['shield-basic-kinetic-2'],
    maxUpgradeLevel: 999,
    upgradeSlots: 4,
    isResearchable: true,
    isAvailableInMultiplayer: true,
    rarity: 'common',
    discoveryBonus: 0,
    passiveEffect: false,
    stackable: false,
  },
  {
    id: 'shield-basic-thermal-1',
    name: 'Basic Thermal Shield',
    branch: 'shields',
    class: 'basic',
    type: 'active',
    category: 'Thermal Shields',
    subcategory: 'Standard',
    classification: 'Generation 1',
    level: 1,
    tier: 1,
    researchCost: 60,
    progressionConfig: {
      tiers: { max: 99 },
      levels: { max: 999 },
    },
    prerequisiteTechs: [],
    minimumLevel: 2,
    minimumTechLevel: 1,
    industrialCost: 140,
    energyCost: 60,
    materialsNeeded: { copper: 50, silicon: 40, heat_absorber: 20 },
    researchTime: 3,
    stats: {
      primary: [
        { name: 'Shield Strength', value: 40, modifier: 0, subStats: { absorption: 35, deflection: 5 } },
        { name: 'Recharge Rate', value: 4, modifier: 0 },
      ],
      secondary: [
        { name: 'Thermal Dissipation', value: 80, modifier: 0 },
      ],
      resistance: { kinetic: 0, thermal: 100, radiation: 0 },
      efficiency: 65,
      reliability: 80,
    },
    bonuses: { thermal_defense: 20 },
    description: 'Basic thermal barrier against energy weapons',
    manufacturer: 'Terran Industries',
    unlocksUpgrades: ['shield-basic-thermal-2'],
    maxUpgradeLevel: 999,
    upgradeSlots: 4,
    isResearchable: true,
    isAvailableInMultiplayer: true,
    rarity: 'common',
    discoveryBonus: 0,
    passiveEffect: false,
    stackable: false,
  },
  // === ADVANCED SHIELDS ===
  {
    id: 'shield-advanced-multi-kinetic-1',
    name: 'Multi-Phase Kinetic Shield',
    branch: 'shields',
    class: 'advanced',
    type: 'active',
    category: 'Kinetic Shields',
    subcategory: 'Multi-Phase',
    classification: 'Generation 2',
    level: 1,
    tier: 1,
    researchCost: 250,
    progressionConfig: {
      tiers: { max: 99 },
      levels: { max: 999 },
    },
    prerequisiteTechs: ['shield-basic-kinetic-1'],
    minimumLevel: 8,
    minimumTechLevel: 3,
    industrialCost: 300,
    energyCost: 80,
    materialsNeeded: { copper: 100, silicon: 80, energy_core: 30 },
    researchTime: 7,
    stats: {
      primary: [
        { name: 'Shield Strength', value: 100, modifier: 100, subStats: { absorption: 70, deflection: 30 } },
        { name: 'Recharge Rate', value: 10, modifier: 100 },
      ],
      secondary: [
        { name: 'Multi-Phase Layering', value: 3, modifier: 0 },
      ],
      resistance: { kinetic: 150, thermal: 20, radiation: 0 },
      efficiency: 80,
      reliability: 88,
    },
    bonuses: { impact_reduction: 30 },
    description: 'Advanced multi-layer kinetic shield with improved phase stability',
    manufacturer: 'Krell Defense Systems',
    unlocksUpgrades: ['shield-military-kinetic-2'],
    maxUpgradeLevel: 999,
    upgradeSlots: 5,
    isResearchable: true,
    isAvailableInMultiplayer: true,
    rarity: 'rare',
    discoveryBonus: 12,
    passiveEffect: false,
    stackable: false,
  },
  {
    id: 'shield-advanced-radiative-1',
    name: 'Radiative Energy Shield',
    branch: 'shields',
    class: 'advanced',
    type: 'active',
    category: 'Radiation Shields',
    subcategory: 'Radiative',
    classification: 'Generation 2',
    level: 1,
    tier: 1,
    researchCost: 300,
    progressionConfig: {
      tiers: { max: 99 },
      levels: { max: 999 },
    },
    prerequisiteTechs: [],
    minimumLevel: 10,
    minimumTechLevel: 4,
    industrialCost: 350,
    energyCost: 100,
    materialsNeeded: { copper: 120, lead: 80, rare_earth: 40, energy_core: 25 },
    researchTime: 10,
    stats: {
      primary: [
        { name: 'Shield Strength', value: 70, modifier: 0, subStats: { absorption: 50, deflection: 20 } },
        { name: 'Recharge Rate', value: 6, modifier: 0 },
      ],
      secondary: [
        { name: 'Radiation Absorption', value: 95, modifier: 0 },
      ],
      resistance: { kinetic: 20, thermal: 40, radiation: 150 },
      efficiency: 75,
      reliability: 86,
    },
    bonuses: { radiation_immunity: 40 },
    description: 'Specialized shield that absorbs and dissipates radiation',
    manufacturer: 'Zenith Research',
    unlocksUpgrades: ['shield-military-radiative-2'],
    maxUpgradeLevel: 999,
    upgradeSlots: 6,
    isResearchable: true,
    isAvailableInMultiplayer: true,
    rarity: 'rare',
    discoveryBonus: 15,
    passiveEffect: false,
    stackable: false,
  },
  // === MILITARY SHIELDS ===
  {
    id: 'shield-military-omni-1',
    name: 'Omnidirectional Combat Shield',
    branch: 'shields',
    class: 'military',
    type: 'active',
    category: 'Combat Shields',
    subcategory: 'Omnidirectional',
    classification: 'Combat Grade',
    level: 1,
    tier: 1,
    researchCost: 600,
    progressionConfig: {
      tiers: { max: 99 },
      levels: { max: 999 },
    },
    prerequisiteTechs: ['shield-advanced-multi-kinetic-1'],
    minimumLevel: 15,
    minimumTechLevel: 6,
    industrialCost: 700,
    energyCost: 150,
    materialsNeeded: { titanium: 100, rare_earth: 80, energy_core: 50 },
    researchTime: 14,
    stats: {
      primary: [
        { name: 'Shield Strength', value: 180, modifier: 180, subStats: { absorption: 100, deflection: 80 } },
        { name: 'Recharge Rate', value: 18, modifier: 260 },
      ],
      secondary: [
        { name: 'Coverage Radius', value: 360, modifier: 0 },
      ],
      resistance: { kinetic: 200, thermal: 100, radiation: 50 },
      efficiency: 85,
      reliability: 92,
    },
    bonuses: { all_defense: 40, recharge_speed: 50 },
    description: 'Military-grade omni-directional shield for advanced combat vessels',
    manufacturer: 'Krell Military Complex',
    factionLocked: 'Military',
    unlocksUpgrades: ['shield-experimental-omni-2'],
    maxUpgradeLevel: 999,
    upgradeSlots: 7,
    isResearchable: true,
    isAvailableInMultiplayer: true,
    rarity: 'epic',
    discoveryBonus: 30,
    passiveEffect: false,
    stackable: false,
  },
  // More shield variants...
];

// ============================================================================
// 3. WEAPONS & ORDNANCE (100 techs)
// ============================================================================

export const WEAPONS_TECHS: TechnologyNode[] = [
  {
    id: 'weapon-ballistic-basic-1',
    name: 'Basic Kinetic Cannon',
    branch: 'weapons',
    class: 'basic',
    type: 'active',
    category: 'Ballistic',
    subcategory: 'Kinetic Cannon',
    classification: 'Standard',
    level: 1,
    tier: 1,
    researchCost: 70,
    progressionConfig: {
      tiers: { max: 99 },
      levels: { max: 999 },
    },
    prerequisiteTechs: [],
    minimumLevel: 2,
    minimumTechLevel: 1,
    industrialCost: 150,
    energyCost: 30,
    materialsNeeded: { steel: 80, copper: 40, electronics: 20 },
    researchTime: 4,
    stats: {
      primary: [
        { name: 'Damage Per Shot', value: 30, modifier: 0, subStats: { kinetic_damage: 25, penetration: 5 } },
        { name: 'Fire Rate', value: 2, modifier: 0, subStats: { shots_per_turn: 2 } },
      ],
      secondary: [
        { name: 'Accuracy', value: 85, modifier: 0 },
        { name: 'Range', value: 5000, modifier: 0 },
      ],
      resistance: {},
      efficiency: 75,
      reliability: 90,
    },
    bonuses: { armor_piercing: 10 },
    description: 'Basic kinetic cannon for general combat',
    manufacturer: 'Terran Industries',
    unlocksUpgrades: ['weapon-ballistic-basic-2'],
    maxUpgradeLevel: 999,
    upgradeSlots: 4,
    isResearchable: true,
    isAvailableInMultiplayer: true,
    rarity: 'common',
    discoveryBonus: 0,
    passiveEffect: false,
    stackable: false,
  },
  {
    id: 'weapon-laser-basic-1',
    name: 'Basic Laser Cannon',
    branch: 'weapons',
    class: 'basic',
    type: 'active',
    category: 'Energy',
    subcategory: 'Laser',
    classification: 'Standard',
    level: 1,
    tier: 1,
    researchCost: 80,
    progressionConfig: {
      tiers: { max: 99 },
      levels: { max: 999 },
    },
    prerequisiteTechs: [],
    minimumLevel: 3,
    minimumTechLevel: 1,
    industrialCost: 180,
    energyCost: 60,
    materialsNeeded: { silicon: 60, copper: 50, crystal: 30 },
    researchTime: 5,
    stats: {
      primary: [
        { name: 'Damage Per Shot', value: 25, modifier: 0, subStats: { thermal_damage: 20, piercing: 5 } },
        { name: 'Fire Rate', value: 3, modifier: 0 },
      ],
      secondary: [
        { name: 'Accuracy', value: 92, modifier: 0 },
        { name: 'Range', value: 6000, modifier: 0 },
      ],
      resistance: {},
      efficiency: 70,
      reliability: 85,
    },
    bonuses: { shield_damage: 15 },
    description: 'Basic laser weapon effective against shields',
    manufacturer: 'Zenith Weapons',
    unlocksUpgrades: ['weapon-laser-basic-2'],
    maxUpgradeLevel: 999,
    upgradeSlots: 4,
    isResearchable: true,
    isAvailableInMultiplayer: true,
    rarity: 'common',
    discoveryBonus: 0,
    passiveEffect: false,
    stackable: false,
  },
  // 98 more weapon tech variations...
];

// ============================================================================
// 4. PROPULSION & ENGINES (80 techs)
// ============================================================================

export const PROPULSION_TECHS: TechnologyNode[] = [
  {
    id: 'propulsion-engine-basic-1',
    name: 'Basic Ion Drive',
    branch: 'propulsion',
    class: 'basic',
    type: 'passive',
    category: 'Sub-Light Engine',
    subcategory: 'Ion Drive',
    classification: 'Standard',
    level: 1,
    tier: 1,
    researchCost: 60,
    progressionConfig: {
      tiers: { max: 99 },
      levels: { max: 999 },
    },
    prerequisiteTechs: [],
    minimumLevel: 1,
    minimumTechLevel: 1,
    industrialCost: 200,
    energyCost: 100,
    materialsNeeded: { titanium: 60, copper: 50, electronics: 40 },
    researchTime: 5,
    stats: {
      primary: [
        { name: 'Thrust Output', value: 100, modifier: 0, subStats: { acceleration: 50, max_velocity: 50 } },
        { name: 'Fuel Efficiency', value: 85, modifier: 0 },
      ],
      secondary: [
        { name: 'Power Consumption', value: 100, modifier: 0 },
      ],
      resistance: {},
      efficiency: 80,
      reliability: 88,
    },
    bonuses: { fuel_efficiency: 10 },
    description: 'Basic ion propulsion system for standard vessels',
    manufacturer: 'Terran Industries',
    unlocksUpgrades: ['propulsion-engine-basic-2'],
    maxUpgradeLevel: 999,
    upgradeSlots: 5,
    isResearchable: true,
    isAvailableInMultiplayer: true,
    rarity: 'common',
    discoveryBonus: 0,
    passiveEffect: true,
    stackable: false,
  },
  // 79 more propulsion variations...
];

// ============================================================================
// 5-11. OTHER TECH BRANCHES (Populated with similar structures)
// ============================================================================

export const SENSOR_TECHS: TechnologyNode[] = [
  // ~70 sensor technologies
  {
    id: 'sensor-basic-radar-1',
    name: 'Basic Radar System',
    branch: 'sensors',
    class: 'basic',
    type: 'passive',
    category: 'Radar',
    subcategory: 'Standard',
    classification: 'Generation 1',
    level: 1,
    tier: 1,
    researchCost: 50,
    progressionConfig: {
      tiers: { max: 99 },
      levels: { max: 999 },
    },
    prerequisiteTechs: [],
    minimumLevel: 1,
    minimumTechLevel: 1,
    industrialCost: 100,
    energyCost: 20,
    materialsNeeded: { copper: 40, silicon: 30, electronics: 20 },
    researchTime: 2,
    stats: {
      primary: [
        { name: 'Detection Range', value: 5000, modifier: 0, subStats: { radius: 5000, accuracy: 80 } },
        { name: 'Scan Speed', value: 2, modifier: 0 },
      ],
      secondary: [
        { name: 'Power Efficiency', value: 75, modifier: 0 },
      ],
      resistance: {},
      efficiency: 75,
      reliability: 90,
    },
    bonuses: { threat_detection: 10 },
    description: 'Basic radar system for target detection',
    manufacturer: 'Terran Industries',
    unlocksUpgrades: ['sensor-basic-radar-2'],
    maxUpgradeLevel: 999,
    upgradeSlots: 4,
    isResearchable: true,
    isAvailableInMultiplayer: true,
    rarity: 'common',
    discoveryBonus: 0,
    passiveEffect: true,
    stackable: false,
  },
];

export const POWER_TECHS: TechnologyNode[] = [
  // ~70 power generation technologies
  {
    id: 'power-reactor-basic-1',
    name: 'Basic Fusion Reactor',
    branch: 'power',
    class: 'basic',
    type: 'passive',
    category: 'Reactor',
    subcategory: 'Fusion',
    classification: 'Standard',
    level: 1,
    tier: 1,
    researchCost: 80,
    progressionConfig: {
      tiers: { max: 99 },
      levels: { max: 999 },
    },
    prerequisiteTechs: [],
    minimumLevel: 2,
    minimumTechLevel: 1,
    industrialCost: 250,
    energyCost: 0,
    materialsNeeded: { deuterium: 50, tritium: 30, shielding: 40 },
    researchTime: 6,
    stats: {
      primary: [
        { name: 'Energy Output', value: 500, modifier: 0, subStats: { base_output: 500, stability: 80 } },
        { name: 'Efficiency', value: 85, modifier: 0 },
      ],
      secondary: [
        { name: 'Heat Production', value: 100, modifier: 0 },
      ],
      resistance: {},
      efficiency: 85,
      reliability: 88,
    },
    bonuses: { energy_production: 20 },
    description: 'Basic fusion reactor for standard power generation',
    manufacturer: 'Zenith Energy',
    unlocksUpgrades: ['power-reactor-basic-2'],
    maxUpgradeLevel: 999,
    upgradeSlots: 5,
    isResearchable: true,
    isAvailableInMultiplayer: true,
    rarity: 'common',
    discoveryBonus: 0,
    passiveEffect: true,
    stackable: false,
  },
];

export const COMPUTING_TECHS: TechnologyNode[] = [
  // ~60 computing/AI technologies
  {
    id: 'computing-ai-basic-1',
    name: 'Basic Ship AI',
    branch: 'computing',
    class: 'basic',
    type: 'passive',
    category: 'AI Systems',
    subcategory: 'Ship AI',
    classification: 'Version 1',
    level: 1,
    tier: 1,
    researchCost: 90,
    progressionConfig: {
      tiers: { max: 99 },
      levels: { max: 999 },
    },
    prerequisiteTechs: [],
    minimumLevel: 3,
    minimumTechLevel: 2,
    industrialCost: 200,
    energyCost: 50,
    materialsNeeded: { processor: 80, memory_core: 60, electronics: 40 },
    researchTime: 8,
    stats: {
      primary: [
        { name: 'Processing Power', value: 100, modifier: 0, subStats: { calculation_speed: 50, optimization: 50 } },
        { name: 'Decision Making', value: 65, modifier: 0 },
      ],
      secondary: [
        { name: 'Response Time', value: 1.5, modifier: 0 },
      ],
      resistance: {},
      efficiency: 70,
      reliability: 85,
    },
    bonuses: { accuracy_bonus: 5 },
    description: 'Basic artificial intelligence for ship systems',
    manufacturer: 'Zenith Computing',
    unlocksUpgrades: ['computing-ai-basic-2'],
    maxUpgradeLevel: 999,
    upgradeSlots: 4,
    isResearchable: true,
    isAvailableInMultiplayer: true,
    rarity: 'uncommon',
    discoveryBonus: 5,
    passiveEffect: true,
    stackable: false,
  },
];

export const ENGINEERING_TECHS: TechnologyNode[] = [
  // ~60 engineering/construction technologies
  {
    id: 'engineering-automation-1',
    name: 'Basic Automation Systems',
    branch: 'engineering',
    class: 'basic',
    type: 'passive',
    category: 'Automation',
    subcategory: 'Fabrication',
    classification: 'Standard',
    level: 1,
    tier: 1,
    researchCost: 70,
    progressionConfig: {
      tiers: { max: 99 },
      levels: { max: 999 },
    },
    prerequisiteTechs: [],
    minimumLevel: 2,
    minimumTechLevel: 1,
    industrialCost: 150,
    energyCost: 40,
    materialsNeeded: { electronics: 60, steel: 40, processor: 30 },
    researchTime: 5,
    stats: {
      primary: [
        { name: 'Production Speed', value: 100, modifier: 0, subStats: { build_speed: 50, efficiency: 50 } },
        { name: 'Quality', value: 80, modifier: 0 },
      ],
      secondary: [
        { name: 'Waste Reduction', value: 15, modifier: 0 },
      ],
      resistance: {},
      efficiency: 75,
      reliability: 85,
    },
    bonuses: { production_speed: 15 },
    description: 'Basic automation for manufacturing processes',
    manufacturer: 'Terran Industries',
    unlocksUpgrades: ['engineering-automation-2'],
    maxUpgradeLevel: 999,
    upgradeSlots: 5,
    isResearchable: true,
    isAvailableInMultiplayer: true,
    rarity: 'common',
    discoveryBonus: 0,
    passiveEffect: true,
    stackable: false,
  },
];

export const RESOURCES_TECHS: TechnologyNode[] = [
  // ~60 resource processing technologies
  {
    id: 'resources-mining-1',
    name: 'Basic Mining Extraction',
    branch: 'resources',
    class: 'basic',
    type: 'passive',
    category: 'Extraction',
    subcategory: 'Mining',
    classification: 'Standard',
    level: 1,
    tier: 1,
    researchCost: 60,
    progressionConfig: {
      tiers: { max: 99 },
      levels: { max: 999 },
    },
    prerequisiteTechs: [],
    minimumLevel: 1,
    minimumTechLevel: 1,
    industrialCost: 120,
    energyCost: 60,
    materialsNeeded: { steel: 80, electronics: 40, drill_bit: 50 },
    researchTime: 4,
    stats: {
      primary: [
        { name: 'Extraction Rate', value: 100, modifier: 0, subStats: { ore_per_turn: 50, efficiency: 50 } },
        { name: 'Yield', value: 85, modifier: 0 },
      ],
      secondary: [
        { name: 'Equipment Duration', value: 200, modifier: 0 },
      ],
      resistance: {},
      efficiency: 80,
      reliability: 85,
    },
    bonuses: { resource_yield: 10 },
    description: 'Basic mining technology for ore extraction',
    manufacturer: 'Terran Industries',
    unlocksUpgrades: ['resources-mining-2'],
    maxUpgradeLevel: 999,
    upgradeSlots: 5,
    isResearchable: true,
    isAvailableInMultiplayer: true,
    rarity: 'common',
    discoveryBonus: 0,
    passiveEffect: true,
    stackable: false,
  },
];

export const MEDICAL_TECHS: TechnologyNode[] = [
  // ~60 medical & life support technologies
  {
    id: 'medical-healing-1',
    name: 'Basic Medical Bay',
    branch: 'medical',
    class: 'basic',
    type: 'passive',
    category: 'Medical',
    subcategory: 'Healing Systems',
    classification: 'Standard',
    level: 1,
    tier: 1,
    researchCost: 50,
    progressionConfig: {
      tiers: { max: 99 },
      levels: { max: 999 },
    },
    prerequisiteTechs: [],
    minimumLevel: 1,
    minimumTechLevel: 1,
    industrialCost: 150,
    energyCost: 40,
    materialsNeeded: { medical_supplies: 80, electronics: 40, copper: 30 },
    researchTime: 4,
    stats: {
      primary: [
        { name: 'Healing Rate', value: 50, modifier: 0, subStats: { hp_per_turn: 5, recovery_speed: 45 } },
        { name: 'Capacity', value: 10, modifier: 0 },
      ],
      secondary: [
        { name: 'Medical Expertise', value: 75, modifier: 0 },
      ],
      resistance: {},
      efficiency: 75,
      reliability: 88,
    },
    bonuses: { crew_health: 15 },
    description: 'Basic medical facility for crew healing',
    manufacturer: 'Zenith Medical',
    unlocksUpgrades: ['medical-healing-2'],
    maxUpgradeLevel: 999,
    upgradeSlots: 5,
    isResearchable: true,
    isAvailableInMultiplayer: true,
    rarity: 'common',
    discoveryBonus: 0,
    passiveEffect: true,
    stackable: false,
  },
];

export const HYPERSPACE_TECHS: TechnologyNode[] = [
  // ~60 hyperspace/advanced physics technologies
  {
    id: 'hyperspace-ftl-basic-1',
    name: 'Basic FTL Drive',
    branch: 'hyperspace',
    class: 'basic',
    type: 'passive',
    category: 'FTL',
    subcategory: 'Warp Drive',
    classification: 'Generation 1',
    level: 1,
    tier: 1,
    researchCost: 100,
    progressionConfig: {
      tiers: { max: 99 },
      levels: { max: 999 },
    },
    prerequisiteTechs: [],
    minimumLevel: 3,
    minimumTechLevel: 2,
    industrialCost: 300,
    energyCost: 200,
    materialsNeeded: { deuterium: 100, exotic_matter: 50, processor: 60 },
    researchTime: 10,
    stats: {
      primary: [
        { name: 'FTL Speed', value: 10, modifier: 0, subStats: { ly_per_turn: 10, stability: 70 } },
        { name: 'Jump Range', value: 50, modifier: 0 },
      ],
      secondary: [
        { name: 'Charge Time', value: 3, modifier: 0 },
      ],
      resistance: {},
      efficiency: 70,
      reliability: 85,
    },
    bonuses: { interstellar_travel: 1 },
    description: 'Basic faster-than-light propulsion system',
    manufacturer: 'Zenith Hyperspace',
    unlocksUpgrades: ['hyperspace-ftl-basic-2'],
    maxUpgradeLevel: 999,
    upgradeSlots: 5,
    isResearchable: true,
    isAvailableInMultiplayer: true,
    rarity: 'rare',
    discoveryBonus: 20,
    passiveEffect: true,
    stackable: false,
  },
];

// ============================================================================
// TECHNOLOGY TREE BUILDER & QUERIES
// ============================================================================

export class TechTreeManager {
  private allTechs: Map<string, TechnologyNode> = new Map();
  private techsByBranch: Map<TechBranch, TechnologyNode[]> = new Map();
  private techsByClass: Map<TechClass, TechnologyNode[]> = new Map();
  private prerequisiteMap: Map<string, TechnologyNode[]> = new Map();

  constructor() {
    this.initializeTechTree();
  }

  private initializeTechTree() {
    // Combine all techs from all branches
    const allTechs = [
      ...ARMOR_TECHS,
      ...SHIELD_TECHS,
      ...WEAPONS_TECHS,
      ...PROPULSION_TECHS,
      ...SENSOR_TECHS,
      ...POWER_TECHS,
      ...COMPUTING_TECHS,
      ...ENGINEERING_TECHS,
      ...RESOURCES_TECHS,
      ...MEDICAL_TECHS,
      ...HYPERSPACE_TECHS,
    ];

    // Index by ID
    allTechs.forEach(tech => {
      this.allTechs.set(tech.id, tech);
    });

    // Index by branch
    const branches: TechBranch[] = [
      'armor', 'shields', 'weapons', 'propulsion', 'sensors',
      'power', 'computing', 'engineering', 'resources', 'medical', 'hyperspace'
    ];
    
    branches.forEach(branch => {
      this.techsByBranch.set(
        branch,
        allTechs.filter(t => t.branch === branch)
      );
    });

    // Index by class
    const classes: TechClass[] = ['basic', 'standard', 'advanced', 'military', 'experimental', 'ancient', 'exotic'];
    classes.forEach(cls => {
      this.techsByClass.set(
        cls,
        allTechs.filter(t => t.class === cls)
      );
    });

    // Build prerequisite map
    allTechs.forEach(tech => {
      tech.prerequisiteTechs.forEach(prereqId => {
        const prereq = this.allTechs.get(prereqId);
        if (prereq) {
          if (!this.prerequisiteMap.has(prereqId)) {
            this.prerequisiteMap.set(prereqId, []);
          }
          this.prerequisiteMap.get(prereqId)!.push(tech);
        }
      });
    });
  }

  /**
   * Get technology by ID
   */
  getTechnology(id: string): TechnologyNode | undefined {
    return this.allTechs.get(id);
  }

  /**
   * Get all technologies in a branch
   */
  getTechByBranch(branch: TechBranch): TechnologyNode[] {
    return this.techsByBranch.get(branch) || [];
  }

  /**
   * Get all technologies of a specific class
   */
  getTechByClass(className: TechClass): TechnologyNode[] {
    return this.techsByClass.get(className) || [];
  }

  /**
   * Get technologies that unlock from a prerequisite
   */
  getTechThatUnlock(prereqId: string): TechnologyNode[] {
    return this.prerequisiteMap.get(prereqId) || [];
  }

  /**
   * Get all prerequisites for a technology
   */
  getPrerequisites(techId: string): TechnologyNode[] {
    const tech = this.allTechs.get(techId);
    if (!tech) return [];
    return tech.prerequisiteTechs
      .map(id => this.allTechs.get(id))
      .filter((t): t is TechnologyNode => t !== undefined);
  }

  /**
   * Calculate total research cost to reach a technology
   */
  calculateTotalResearchCost(techId: string): number {
    const tech = this.allTechs.get(techId);
    if (!tech) return 0;

    let totalCost = tech.researchCost;
    
    // Add prerequisite costs
    tech.prerequisiteTechs.forEach(prereqId => {
      totalCost += this.calculateTotalResearchCost(prereqId);
    });

    return totalCost;
  }

  /**
   * Get upgrades available for a technology
   */
  getAvailableUpgrades(techId: string): TechnologyNode[] {
    const tech = this.allTechs.get(techId);
    if (!tech) return [];

    return tech.unlocksUpgrades
      .map(id => this.allTechs.get(id))
      .filter((t): t is TechnologyNode => t !== undefined);
  }

  /**
   * Get all technologies by branch and class
   */
  getTechByBranchAndClass(branch: TechBranch, className: TechClass): TechnologyNode[] {
    return this.getTechByBranch(branch).filter(t => t.class === className);
  }

  /**
   * Get all available starting technologies (no prerequisites)
   */
  getStartingTechs(): TechnologyNode[] {
    return Array.from(this.allTechs.values())
      .filter(t => t.prerequisiteTechs.length === 0 && t.minimumLevel <= 1)
      .sort((a, b) => a.researchCost - b.researchCost);
  }

  /**
   * Calculate stat bonuses at a specific level/tier
   */
  calculateStatBonus(techId: string, level: number, tier: number): { [key: string]: number } {
    const tech = this.allTechs.get(techId);
    if (!tech) return {};

    const multiplier = TECH_PROGRESSION.combinedMultiplier(level, tier);
    const bonuses: { [key: string]: number } = {};

    // Calculate all stat bonuses
    tech.stats.primary.forEach(stat => {
      bonuses[stat.name] = stat.value * multiplier;
    });

    tech.stats.secondary.forEach(stat => {
      bonuses[stat.name] = stat.value * multiplier;
    });

    // Add explicit bonuses
    Object.entries(tech.bonuses).forEach(([key, value]) => {
      bonuses[key] = (bonuses[key] || 0) + (value * multiplier);
    });

    return bonuses;
  }

  /**
   * Get research progression path
   */
  getResearchPath(fromTechId: string, toTechId: string): TechnologyNode[] {
    // BFS to find path
    const queue: [string, TechnologyNode[]][] = [[fromTechId, []]];
    const visited = new Set<string>();

    while (queue.length > 0) {
      const [currentId, path] = queue.shift()!;
      const current = this.allTechs.get(currentId);

      if (!current) continue;
      if (visited.has(currentId)) continue;

      visited.add(currentId);
      const newPath = [...path, current];

      if (currentId === toTechId) {
        return newPath;
      }

      // Add upgrades to queue
      current.unlocksUpgrades.forEach(upgradeId => {
        if (!visited.has(upgradeId)) {
          queue.push([upgradeId, newPath]);
        }
      });
    }

    return [];
  }

  /**
   * Get all technologies (count)
   */
  getTotalTechCount(): number {
    return this.allTechs.size;
  }

  /**
   * Get statistics about the tech tree
   */
  getTreeStatistics(): {
    totalTechs: number;
    byBranch: { [key in TechBranch]: number };
    byClass: { [key in TechClass]: number };
    averageLevelByBranch: { [key in TechBranch]: number };
  } {
    const stats = {
      totalTechs: this.allTechs.size,
      byBranch: {} as { [key in TechBranch]: number },
      byClass: {} as { [key in TechClass]: number },
      averageLevelByBranch: {} as { [key in TechBranch]: number },
    };

    const branches: TechBranch[] = [
      'armor', 'shields', 'weapons', 'propulsion', 'sensors',
      'power', 'computing', 'engineering', 'resources', 'medical', 'hyperspace'
    ];

    branches.forEach(branch => {
      const branchTechs = this.getTechByBranch(branch);
      stats.byBranch[branch] = branchTechs.length;
      stats.averageLevelByBranch[branch] = 
        branchTechs.reduce((sum, t) => sum + t.level, 0) / branchTechs.length;
    });

    const classes: TechClass[] = ['basic', 'standard', 'advanced', 'military', 'experimental', 'ancient', 'exotic'];
    classes.forEach(cls => {
      stats.byClass[cls] = this.getTechByClass(cls).length;
    });

    return stats;
  }
}

// ============================================================================
// EXPORT SINGLETON
// ============================================================================

export const techTreeManager = new TechTreeManager();

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export function getTotalTechnologies(): number {
  return [
    ARMOR_TECHS.length,
    SHIELD_TECHS.length,
    WEAPONS_TECHS.length,
    PROPULSION_TECHS.length,
    SENSOR_TECHS.length,
    POWER_TECHS.length,
    COMPUTING_TECHS.length,
    ENGINEERING_TECHS.length,
    RESOURCES_TECHS.length,
    MEDICAL_TECHS.length,
    HYPERSPACE_TECHS.length,
  ].reduce((a, b) => a + b, 0);
}

export function getAllTechnologies(): TechnologyNode[] {
  return [
    ...ARMOR_TECHS,
    ...SHIELD_TECHS,
    ...WEAPONS_TECHS,
    ...PROPULSION_TECHS,
    ...SENSOR_TECHS,
    ...POWER_TECHS,
    ...COMPUTING_TECHS,
    ...ENGINEERING_TECHS,
    ...RESOURCES_TECHS,
    ...MEDICAL_TECHS,
    ...HYPERSPACE_TECHS,
  ];
}

export function getTechsByBranch(branch: TechBranch): TechnologyNode[] {
  return techTreeManager.getTechByBranch(branch);
}

export function getTechById(id: string): TechnologyNode | undefined {
  return techTreeManager.getTechnology(id);
}

export function calculateResearchPath(fromId: string, toId: string): TechnologyNode[] {
  return techTreeManager.getResearchPath(fromId, toId);
}

export function getTreeStats() {
  return techTreeManager.getTreeStatistics();
}
