/**
 * EVE ONLINE-INSPIRED BLUEPRINT SYSTEM
 * =============================================================================
 * Full blueprint manufacturing, research, copying, and invention system
 * including black market and legitimate trade networks
 * 
 * Systems:
 *   1. Blueprint Types & Rarity Tiers
 *   2. Manufacturing & Production
 *   3. Research (ME/TE)
 *   4. Copying & Invention
 *   5. Material Efficiency / Time Efficiency
 *   6. Decryptors & Datacores
 *   7. Black Market Trading
 *   8. Legitimate Market Trading
 */

export type BlueprintRarity = 
  | 'common' | 'uncommon' | 'rare' | 'exceptional' | 'faction' | 'deadspace' | 'officer' | 'ancient' | 'tech-2' | 'tech-3' | 'storyline';

export type BlueprintCategory =
  | 'ship' | 'module' | 'drone' | 'ammo' | 'structure' | 'rig' | 'subsystem' 
  | 'satellite' | 'weapon' | 'shield' | 'engine' | 'electronics' | 'mining'
  | 'component' | 'capital-ship' | 'supercapital' | 'titan' | 'commodity';

export type BlueprintActivity = 
  | 'manufacturing' | 'research-material' | 'research-time' | 'copying' | 'invention';

export type MarketType = 'legitimate' | 'black-market' | 'gray-market' | 'corporate' | 'faction-only';

export type TradeGoodCategory =
  | 'minerals' | 'ore' | 'gas' | 'ice' | 'moon-materials' | 'salvage' 
  | 'components' | 'blueprints' | 'datacores' | 'decryptors' | 'implants'
  | 'boosters' | 'drugs' | 'relics' | 'cargo-containers' | 'contraband';

// =============================================================================
// BLUEPRINT TYPES & RARITIES
// =============================================================================

export interface BlueprintMaterial {
  typeId: string;
  name: string;
  quantity: number;
  isSkill: boolean;
  isOptional: boolean;
}

export interface BlueprintProduct {
  typeId: string;
  name: string;
  quantity: number;
  probability: number;
}

export interface ManufacturingCosts {
  mineral: Partial<Record<string, number>>;
  component: Partial<Record<string, number>>;
  datacore: Partial<Record<string, number>>;
  decryptor?: string;
  isk: number;
  time: number; // seconds
}

export interface BlueprintConfig {
  id: string;
  name: string;
  description: string;
  rarity: BlueprintRarity;
  category: BlueprintCategory;
  techLevel: number;
  maxRuns: number;
  
  // Manufacturing
  materials: BlueprintMaterial[];
  products: BlueprintProduct[];
  manufacturingTime: number;
  
  // Research
  materialEfficiency: number; // 0-100 (ME level)
  timeEfficiency: number; // 0-100 (TE level)
  maxME: number;
  maxTE: number;
  researchMaterialTime: number;
  researchTimeTime: number;
  
  // Copying
  copyingTime: number;
  maxCopyRuns: number;
  
  // Invention
  inventionMaterials: BlueprintMaterial[];
  inventionTime: number;
  inventionChance: number;
  inventionProduct?: string;
  
  // Market
  marketType: MarketType;
  basePrice: number;
  estimatedValue: number;
  
  // Restrictions
  requiresFaction?: string;
  requiresSkill?: string;
  isContraband: boolean;
  securityStatus: number; // -1.0 to 1.0
  
  // Discovery
  origin: string;
  age: 'modern' | 'recent' | 'old' | 'ancient' | 'primordial';
}

export const BLUEPRINT_RARITY_MULTIPLIERS: Record<BlueprintRarity, number> = {
  'common': 1.0,
  'uncommon': 1.5,
  'rare': 3.0,
  'exceptional': 5.0,
  'faction': 8.0,
  'deadspace': 12.0,
  'officer': 18.0,
  'ancient': 25.0,
  'tech-2': 10.0,
  'tech-3': 30.0,
  'storyline': 15.0,
};

// =============================================================================
// BLUEPRINT CATALOG (Sample of key blueprints)
// =============================================================================

export const BLUEPRINT_CATALOG: BlueprintConfig[] = [
  // ---- Ship Blueprints ----
  {
    id: 'bp-frigate-f85',
    name: 'F85 Frigate Blueprint',
    description: 'Standard frigate hull designed for fast reconnaissance and light combat patrols.',
    rarity: 'common',
    category: 'ship',
    techLevel: 1,
    maxRuns: 300,
    materials: [
      { typeId: 'mat-tritanium', name: 'Tritanium', quantity: 50000, isSkill: false, isOptional: false },
      { typeId: 'mat-pyrite', name: 'Pyrite', quantity: 25000, isSkill: false, isOptional: false },
      { typeId: 'mat-isogen', name: 'Isogen', quantity: 10000, isSkill: false, isOptional: false },
    ],
    products: [{ typeId: 'ship-f85-frigate', name: 'F85 Frigate', quantity: 1, probability: 1.0 }],
    manufacturingTime: 3600,
    materialEfficiency: 0,
    timeEfficiency: 0,
    maxME: 20,
    maxTE: 20,
    researchMaterialTime: 1800,
    researchTimeTime: 900,
    copyingTime: 1800,
    maxCopyRuns: 100,
    inventionMaterials: [
      { typeId: 'datacore-hull', name: 'Datacore - Hull Engineering', quantity: 10, isSkill: false, isOptional: false },
      { typeId: 'mat-interface-circuit', name: 'Interface Circuit', quantity: 50, isSkill: false, isOptional: false },
    ],
    inventionTime: 7200,
    inventionChance: 0.35,
    inventionProduct: 'bp-frigate-f85-tech2',
    marketType: 'legitimate',
    basePrice: 150000,
    estimatedValue: 500000,
    isContraband: false,
    securityStatus: 1.0,
    origin: 'Federal Naval Archives',
    age: 'modern',
  },
  {
    id: 'bp-cruiser-mk7',
    name: 'MK-7 Cruiser Blueprint',
    description: 'Versatile cruiser platform adaptable for combat, logistics, or exploration roles.',
    rarity: 'uncommon',
    category: 'ship',
    techLevel: 2,
    maxRuns: 150,
    materials: [
      { typeId: 'mat-tritanium', name: 'Tritanium', quantity: 300000, isSkill: false, isOptional: false },
      { typeId: 'mat-pyrite', name: 'Pyrite', quantity: 150000, isSkill: false, isOptional: false },
      { typeId: 'mat-zydrine', name: 'Zydrine', quantity: 25000, isSkill: false, isOptional: false },
      { typeId: 'mat-mexallon', name: 'Mexallon', quantity: 50000, isSkill: false, isOptional: false },
    ],
    products: [{ typeId: 'ship-cruiser-mk7', name: 'MK-7 Cruiser', quantity: 1, probability: 1.0 }],
    manufacturingTime: 7200,
    materialEfficiency: 0,
    timeEfficiency: 0,
    maxME: 15,
    maxTE: 15,
    researchMaterialTime: 3600,
    researchTimeTime: 1800,
    copyingTime: 3600,
    maxCopyRuns: 50,
    inventionMaterials: [
      { typeId: 'datacore-mechanical', name: 'Datacore - Mechanical Engineering', quantity: 20, isSkill: false, isOptional: false },
      { typeId: 'datacore-astronautics', name: 'Datacore - Astronautics', quantity: 20, isSkill: false, isOptional: false },
    ],
    inventionTime: 14400,
    inventionChance: 0.28,
    inventionProduct: 'bp-cruiser-mk7-tech2',
    marketType: 'legitimate',
    basePrice: 750000,
    estimatedValue: 2500000,
    isContraband: false,
    securityStatus: 0.9,
    origin: 'Federal Naval Command',
    age: 'modern',
  },
  {
    id: 'bp-battleship-ares',
    name: 'Ares-Class Battleship Blueprint',
    description: 'Heavy battleship platform with massive firepower and reinforced armor layout.',
    rarity: 'rare',
    category: 'ship',
    techLevel: 3,
    maxRuns: 50,
    materials: [
      { typeId: 'mat-tritanium', name: 'Tritanium', quantity: 3000000, isSkill: false, isOptional: false },
      { typeId: 'mat-pyrite', name: 'Pyrite', quantity: 1500000, isSkill: false, isOptional: false },
      { typeId: 'mat-zydrine', name: 'Zydrine', quantity: 250000, isSkill: false, isOptional: false },
      { typeId: 'mat-mexallon', name: 'Mexallon', quantity: 500000, isSkill: false, isOptional: false },
      { typeId: 'mat-morphite', name: 'Morphite', quantity: 50000, isSkill: false, isOptional: false },
    ],
    products: [{ typeId: 'ship-battleship-ares', name: 'Ares-Class Battleship', quantity: 1, probability: 1.0 }],
    manufacturingTime: 28800,
    materialEfficiency: 0,
    timeEfficiency: 0,
    maxME: 10,
    maxTE: 10,
    researchMaterialTime: 14400,
    researchTimeTime: 7200,
    copyingTime: 7200,
    maxCopyRuns: 20,
    inventionMaterials: [
      { typeId: 'datacore-weapons', name: 'Datacore - Weapons Technology', quantity: 40, isSkill: false, isOptional: false },
      { typeId: 'datacore-armor', name: 'Datacore - Armor Technology', quantity: 40, isSkill: false, isOptional: false },
      { typeId: 'decryptor-mil-spec', name: 'Decryptor - Military Specifications', quantity: 1, isSkill: false, isOptional: true },
    ],
    inventionTime: 43200,
    inventionChance: 0.20,
    inventionProduct: 'bp-battleship-ares-tech2',
    marketType: 'legitimate',
    basePrice: 5000000,
    estimatedValue: 20000000,
    isContraband: false,
    securityStatus: 0.7,
    origin: 'Imperial Navy Shipyards',
    age: 'recent',
  },
  {
    id: 'bp-dreadnought-titan-buster',
    name: 'Titan-Buster Dreadnought Blueprint',
    description: 'Super-heavy dreadnought designed to engage capital and supercapital vessels.',
    rarity: 'faction',
    category: 'capital-ship',
    techLevel: 5,
    maxRuns: 10,
    materials: [
      { typeId: 'mat-tritanium', name: 'Tritanium', quantity: 50000000, isSkill: false, isOptional: false },
      { typeId: 'mat-zydrine', name: 'Zydrine', quantity: 5000000, isSkill: false, isOptional: false },
      { typeId: 'mat-morphite', name: 'Morphite', quantity: 1000000, isSkill: false, isOptional: false },
      { typeId: 'comp-capital-hull', name: 'Capital Hull Section', quantity: 50, isSkill: false, isOptional: false },
      { typeId: 'comp-superweapon', name: 'Superweapon Assembly', quantity: 10, isSkill: false, isOptional: false },
    ],
    products: [{ typeId: 'ship-dreadnought-titan-buster', name: 'Titan-Buster Dreadnought', quantity: 1, probability: 1.0 }],
    manufacturingTime: 172800,
    materialEfficiency: 0,
    timeEfficiency: 0,
    maxME: 5,
    maxTE: 5,
    researchMaterialTime: 86400,
    researchTimeTime: 43200,
    copyingTime: 43200,
    maxCopyRuns: 3,
    inventionMaterials: [
      { typeId: 'datacore-capital-tech', name: 'Datacore - Capital Technology', quantity: 100, isSkill: false, isOptional: false },
      { typeId: 'datacore-superweapon', name: 'Datacore - Superweapon Theory', quantity: 100, isSkill: false, isOptional: false },
    ],
    inventionTime: 259200,
    inventionChance: 0.10,
    marketType: 'corporate',
    basePrice: 50000000,
    estimatedValue: 500000000,
    isContraband: false,
    securityStatus: 0.5,
    origin: 'CONCORD Restricted Archive',
    age: 'old',
  },
  {
    id: 'bp-titan-eclipse',
    name: 'Eclipse-Class Titan Blueprint',
    description: 'Mythical titan-class vessel capable of system-wide devastation.',
    rarity: 'ancient',
    category: 'titan',
    techLevel: 10,
    maxRuns: 1,
    materials: [
      { typeId: 'mat-tritanium', name: 'Tritanium', quantity: 500000000, isSkill: false, isOptional: false },
      { typeId: 'mat-morphite', name: 'Morphite', quantity: 10000000, isSkill: false, isOptional: false },
      { typeId: 'comp-titan-hull', name: 'Titan Hull Section', quantity: 100, isSkill: false, isOptional: false },
      { typeId: 'comp-doomsday-device', name: 'Doomsday Device Core', quantity: 5, isSkill: false, isOptional: false },
      { typeId: 'mat-ancient-relic', name: 'Ancient Relic Core', quantity: 10, isSkill: false, isOptional: false },
    ],
    products: [{ typeId: 'ship-titan-eclipse', name: 'Eclipse-Class Titan', quantity: 1, probability: 0.85 }],
    manufacturingTime: 864000,
    materialEfficiency: 0,
    timeEfficiency: 0,
    maxME: 1,
    maxTE: 1,
    researchMaterialTime: 432000,
    researchTimeTime: 216000,
    copyingTime: 172800,
    maxCopyRuns: 1,
    inventionMaterials: [
      { typeId: 'datacore-ancient-tech', name: 'Datacore - Ancient Technology', quantity: 500, isSkill: false, isOptional: false },
      { typeId: 'decryptor-primordial', name: 'Decryptor - Primordial Pattern', quantity: 1, isSkill: false, isOptional: true },
    ],
    inventionTime: 604800,
    inventionChance: 0.05,
    marketType: 'black-market',
    basePrice: 1000000000,
    estimatedValue: 5000000000,
    isContraband: true,
    securityStatus: -1.0,
    origin: 'Lost Jovian Archive',
    age: 'primordial',
  },
  
  // ---- Module Blueprints ----
  {
    id: 'bp-shield-booster-x8',
    name: 'X8 Shield Booster Blueprint',
    description: 'Standard shield booster module for mid-class vessels.',
    rarity: 'uncommon',
    category: 'module',
    techLevel: 2,
    maxRuns: 500,
    materials: [
      { typeId: 'mat-tritanium', name: 'Tritanium', quantity: 50000, isSkill: false, isOptional: false },
      { typeId: 'mat-pyrite', name: 'Pyrite', quantity: 25000, isSkill: false, isOptional: false },
      { typeId: 'comp-power-system', name: 'Power System', quantity: 10, isSkill: false, isOptional: false },
    ],
    products: [{ typeId: 'module-shield-booster-x8', name: 'X8 Shield Booster', quantity: 1, probability: 1.0 }],
    manufacturingTime: 1800,
    materialEfficiency: 0,
    timeEfficiency: 0,
    maxME: 25,
    maxTE: 20,
    researchMaterialTime: 900,
    researchTimeTime: 450,
    copyingTime: 900,
    maxCopyRuns: 200,
    inventionMaterials: [
      { typeId: 'datacore-shield-tech', name: 'Datacore - Shield Technology', quantity: 8, isSkill: false, isOptional: false },
    ],
    inventionTime: 3600,
    inventionChance: 0.40,
    inventionProduct: 'bp-shield-booster-x8-tech2',
    marketType: 'legitimate',
    basePrice: 80000,
    estimatedValue: 300000,
    isContraband: false,
    securityStatus: 1.0,
    origin: 'Civilian Manufacturing',
    age: 'modern',
  },
  {
    id: 'bp-wpn-heavy-ion-blaster',
    name: 'Heavy Ion Blaster Blueprint',
    description: 'Advanced heavy energy weapon designed for cruiser-class vessels.',
    rarity: 'rare',
    category: 'weapon',
    techLevel: 4,
    maxRuns: 100,
    materials: [
      { typeId: 'mat-mexallon', name: 'Mexallon', quantity: 100000, isSkill: false, isOptional: false },
      { typeId: 'mat-zydrine', name: 'Zydrine', quantity: 30000, isSkill: false, isOptional: false },
      { typeId: 'comp-wpn-barrel', name: 'Weapon Barrel Assembly', quantity: 5, isSkill: false, isOptional: false },
      { typeId: 'comp-focusing-crystal', name: 'Focusing Crystal', quantity: 2, isSkill: false, isOptional: false },
    ],
    products: [{ typeId: 'wpn-heavy-ion-blaster', name: 'Heavy Ion Blaster', quantity: 1, probability: 1.0 }],
    manufacturingTime: 3600,
    materialEfficiency: 0,
    timeEfficiency: 0,
    maxME: 20,
    maxTE: 18,
    researchMaterialTime: 1800,
    researchTimeTime: 900,
    copyingTime: 1800,
    maxCopyRuns: 50,
    inventionMaterials: [
      { typeId: 'datacore-weapons', name: 'Datacore - Weapons Technology', quantity: 15, isSkill: false, isOptional: false },
      { typeId: 'datacore-energy-physics', name: 'Datacore - Energy Physics', quantity: 10, isSkill: false, isOptional: false },
    ],
    inventionTime: 7200,
    inventionChance: 0.32,
    inventionProduct: 'bp-wpn-heavy-ion-blaster-tech2',
    marketType: 'legitimate',
    basePrice: 500000,
    estimatedValue: 1500000,
    isContraband: false,
    securityStatus: 0.8,
    origin: 'Military R&D Division',
    age: 'recent',
  },
  {
    id: 'bp-rig-anti-EM',
    name: 'Anti-EM Shield Rig Blueprint',
    description: 'Advanced shield rig that provides exceptional electromagnetic damage resistance.',
    rarity: 'exceptional',
    category: 'rig',
    techLevel: 4,
    maxRuns: 50,
    materials: [
      { typeId: 'mat-morphite', name: 'Morphite', quantity: 10000, isSkill: false, isOptional: false },
      { typeId: 'comp-rig-shield', name: 'Shield Rig Framework', quantity: 3, isSkill: false, isOptional: false },
      { typeId: 'mat-salvage-energized', name: 'Energized Salvage', quantity: 20, isSkill: false, isOptional: false },
    ],
    products: [{ typeId: 'rig-anti-em-shield', name: 'Anti-EM Shield Rig', quantity: 1, probability: 1.0 }],
    manufacturingTime: 5400,
    materialEfficiency: 0,
    timeEfficiency: 0,
    maxME: 15,
    maxTE: 15,
    researchMaterialTime: 2700,
    researchTimeTime: 1350,
    copyingTime: 2700,
    maxCopyRuns: 20,
    inventionMaterials: [
      { typeId: 'datacore-shield-tech', name: 'Datacore - Shield Technology', quantity: 25, isSkill: false, isOptional: false },
      { typeId: 'datacore-engineering', name: 'Datacore - Engineering', quantity: 25, isSkill: false, isOptional: false },
    ],
    inventionTime: 14400,
    inventionChance: 0.22,
    marketType: 'legitimate',
    basePrice: 2000000,
    estimatedValue: 8000000,
    isContraband: false,
    securityStatus: 0.6,
    origin: 'Tech-2 Research Institute',
    age: 'recent',
  },
  {
    id: 'bp-contraband-cloak-void',
    name: 'Void Cloak MK-X Blueprint',
    description: 'ILLEGAL: Experimental phase-cloaking device that operates in deep null-security space. Possession is a capital offense.',
    rarity: 'deadspace',
    category: 'module',
    techLevel: 6,
    maxRuns: 5,
    materials: [
      { typeId: 'mat-morphite', name: 'Morphite', quantity: 50000, isSkill: false, isOptional: false },
      { typeId: 'comp-cloak-core', name: 'Cloaking Core', quantity: 10, isSkill: false, isOptional: false },
      { typeId: 'mat-dark-matter', name: 'Dark Matter Sample', quantity: 5, isSkill: false, isOptional: false },
      { typeId: 'mat-ancient-relic', name: 'Ancient Relic Core', quantity: 3, isSkill: false, isOptional: false },
    ],
    products: [{ typeId: 'module-cloak-void-mkx', name: 'Void Cloak MK-X', quantity: 1, probability: 0.75 }],
    manufacturingTime: 43200,
    materialEfficiency: 0,
    timeEfficiency: 0,
    maxME: 5,
    maxTE: 5,
    researchMaterialTime: 21600,
    researchTimeTime: 10800,
    copyingTime: 10800,
    maxCopyRuns: 2,
    inventionMaterials: [
      { typeId: 'datacore-cloaking', name: 'Datacore - Cloaking Technology', quantity: 50, isSkill: false, isOptional: false },
      { typeId: 'datacore-quantum-physics', name: 'Datacore - Quantum Physics', quantity: 50, isSkill: false, isOptional: false },
    ],
    inventionTime: 86400,
    inventionChance: 0.08,
    marketType: 'black-market',
    basePrice: 10000000,
    estimatedValue: 100000000,
    isContraband: true,
    securityStatus: -0.5,
    origin: 'Shadow Cartel Blacksite',
    age: 'old',
  },
  
  // ---- Mining/Trade Commodities ----
  {
    id: 'bp-mining-laser-amplifier',
    name: 'Mining Laser Amplifier Blueprint',
    description: 'Enhances mining laser yield for increased resource extraction.',
    rarity: 'uncommon',
    category: 'mining',
    techLevel: 2,
    maxRuns: 500,
    materials: [
      { typeId: 'mat-pyrite', name: 'Pyrite', quantity: 50000, isSkill: false, isOptional: false },
      { typeId: 'comp-power-system', name: 'Power System', quantity: 8, isSkill: false, isOptional: false },
    ],
    products: [{ typeId: 'module-mining-amp', name: 'Mining Laser Amplifier', quantity: 1, probability: 1.0 }],
    manufacturingTime: 2400,
    materialEfficiency: 0,
    timeEfficiency: 0,
    maxME: 20,
    maxTE: 20,
    researchMaterialTime: 1200,
    researchTimeTime: 600,
    copyingTime: 1200,
    maxCopyRuns: 200,
    inventionMaterials: [
      { typeId: 'datacore-geology', name: 'Datacore - Geology', quantity: 10, isSkill: false, isOptional: false },
    ],
    inventionTime: 3600,
    inventionChance: 0.38,
    marketType: 'legitimate',
    basePrice: 100000,
    estimatedValue: 400000,
    isContraband: false,
    securityStatus: 1.0,
    origin: 'Mining Corp Alliance',
    age: 'modern',
  },
];

// =============================================================================
// RESEARCH & EFFICIENCY
// =============================================================================

export interface ResearchLevelCost {
  level: number;
  time: number;
  material: Record<string, number>;
  skillRequirement?: string;
}

/**
 * Calculate material efficiency (ME) research cost
 * Each level reduces waste by ~5% compounding
 */
export function calcResearchMECost(currentME: number, targetME: number, blueprint: BlueprintConfig): ResearchLevelCost[] {
  const costs: ResearchLevelCost[] = [];
  
  for (let level = currentME + 1; level <= targetME; level++) {
    const levelCost = Math.pow(2, level) * blueprint.researchMaterialTime;
    costs.push({
      level,
      time: levelCost,
      material: {
        [blueprint.materials[0].typeId]: Math.floor(blueprint.materials[0].quantity * 0.01 * level),
      },
    });
  }
  
  return costs;
}

/**
 * Calculate time efficiency (TE) research cost
 * Each level reduces time by ~2.5% compounding
 */
export function calcResearchTECost(currentTE: number, targetTE: number, blueprint: BlueprintConfig): ResearchLevelCost[] {
  const costs: ResearchLevelCost[] = [];
  
  for (let level = currentTE + 1; level <= targetTE; level++) {
    const levelCost = Math.pow(2, level - 1) * blueprint.researchTimeTime;
    costs.push({
      level,
      time: levelCost,
      material: {
        [blueprint.materials[0].typeId]: Math.floor(blueprint.materials[0].quantity * 0.005 * level),
      },
    });
  }
  
  return costs;
}

/**
 * Calculate material waste factor based on ME level
 */
export function getMaterialWaste(meLevel: number): number {
  return Math.max(0.05, 1.0 - (meLevel * 0.05));
}

/**
 * Calculate time efficiency factor based on TE level
 */
export function getTimeEfficiency(teLevel: number): number {
  return Math.max(0.5, 1.0 - (teLevel * 0.025));
}

/**
 * Apply research bonuses to materials
 */
export function applyMESavings(materials: BlueprintMaterial[], meLevel: number): BlueprintMaterial[] {
  const wasteFactor = getMaterialWaste(meLevel);
  return materials.map(m => ({
    ...m,
    quantity: Math.ceil(m.quantity * wasteFactor),
  }));
}

// =============================================================================
// INVENTION SYSTEM
// =============================================================================

export interface DecryptorConfig {
  id: string;
  name: string;
  description: string;
  rarity: BlueprintRarity;
  inventionChanceMultiplier: number;
  maxRunMultiplier: number;
  meBonus: number;
  teBonus: number;
  cost: number;
}

export const DECRYPTORS: DecryptorConfig[] = [
  {
    id: 'decryptor-standard',
    name: 'Standard Decryptor',
    description: 'Basic decryptor with no modification to invention statistics.',
    rarity: 'common',
    inventionChanceMultiplier: 1.0,
    maxRunMultiplier: 1.0,
    meBonus: 0,
    teBonus: 0,
    cost: 50000,
  },
  {
    id: 'decryptor-optimized',
    name: 'Optimized Decryptor',
    description: 'Provides significant ME bonus at the cost of reduced invention chance.',
    rarity: 'rare',
    inventionChanceMultiplier: 0.7,
    maxRunMultiplier: 1.5,
    meBonus: 3,
    teBonus: 0,
    cost: 500000,
  },
  {
    id: 'decryptor-accelerant',
    name: 'Accelerant Decryptor',
    description: 'Provides TE bonus and more runs but reduces invention chance.',
    rarity: 'uncommon',
    inventionChanceMultiplier: 0.8,
    maxRunMultiplier: 2.0,
    meBonus: 0,
    teBonus: 2,
    cost: 300000,
  },
  {
    id: 'decryptor-mil-spec',
    name: 'Military-Spec Decryptor',
    description: 'Military-grade decryptor providing balanced bonuses.',
    rarity: 'exceptional',
    inventionChanceMultiplier: 0.9,
    maxRunMultiplier: 1.2,
    meBonus: 2,
    teBonus: 1,
    cost: 2000000,
  },
  {
    id: 'decryptor-primordial',
    name: 'Primordial Pattern Decryptor',
    description: 'Legendary decryptor with unparalleled capabilities.',
    rarity: 'ancient',
    inventionChanceMultiplier: 1.5,
    maxRunMultiplier: 3.0,
    meBonus: 5,
    teBonus: 5,
    cost: 50000000,
  },
];

export interface DatacoreConfig {
  id: string;
  name: string;
  description: string;
  field: string;
  cost: number;
  rarity: BlueprintRarity;
}

export const DATACORES: DatacoreConfig[] = [
  { id: 'datacore-hull', name: 'Datacore - Hull Engineering', description: 'Contains knowledge of hull construction techniques.', field: 'engineering', cost: 25000, rarity: 'uncommon' },
  { id: 'datacore-mechanical', name: 'Datacore - Mechanical Engineering', description: 'Mechanical systems and structural analysis.', field: 'mechanical', cost: 30000, rarity: 'uncommon' },
  { id: 'datacore-astronautics', name: 'Datacore - Astronautics', description: 'Propulsion and navigation systems.', field: 'astronautics', cost: 28000, rarity: 'uncommon' },
  { id: 'datacore-weapons', name: 'Datacore - Weapons Technology', description: 'Offensive weapon systems research.', field: 'weapons', cost: 35000, rarity: 'rare' },
  { id: 'datacore-armor', name: 'Datacore - Armor Technology', description: 'Defensive armor and plating techniques.', field: 'armor', cost: 32000, rarity: 'rare' },
  { id: 'datacore-shield-tech', name: 'Datacore - Shield Technology', description: 'Energy shield generation and management.', field: 'shields', cost: 35000, rarity: 'rare' },
  { id: 'datacore-energy-physics', name: 'Datacore - Energy Physics', description: 'Theoretical energy physics applications.', field: 'physics', cost: 40000, rarity: 'rare' },
  { id: 'datacore-engineering', name: 'Datacore - Engineering', description: 'General engineering principles and optimizations.', field: 'engineering', cost: 25000, rarity: 'uncommon' },
  { id: 'datacore-cloaking', name: 'Datacore - Cloaking Technology', description: 'ILLEGAL: Stealth and cloaking system research.', field: 'cloaking', cost: 100000, rarity: 'deadspace' },
  { id: 'datacore-quantum-physics', name: 'Datacore - Quantum Physics', description: 'Quantum mechanics and entanglement theory.', field: 'quantum', cost: 50000, rarity: 'exceptional' },
  { id: 'datacore-capital-tech', name: 'Datacore - Capital Technology', description: 'Capital ship construction and systems.', field: 'capital', cost: 200000, rarity: 'faction' },
  { id: 'datacore-superweapon', name: 'Datacore - Superweapon Theory', description: 'CLASSIFIED: Superweapon design theoretical framework.', field: 'weapons', cost: 500000, rarity: 'deadspace' },
  { id: 'datacore-ancient-tech', name: 'Datacore - Ancient Technology', description: 'Precursor civilization technology analysis.', field: 'ancient', cost: 1000000, rarity: 'ancient' },
  { id: 'datacore-geology', name: 'Datacore - Geology', description: 'Planetary geology and resource extraction.', field: 'mining', cost: 20000, rarity: 'common' },
];

/**
 * Calculate invention success probability
 */
export function calcInventionChance(
  blueprint: BlueprintConfig,
  decryptor?: DecryptorConfig,
  skillLevel: number = 1
): number {
  let chance = blueprint.inventionChance;
  
  if (decryptor) {
    chance *= decryptor.inventionChanceMultiplier;
  }
  
  // Skill bonus: +5% per skill level
  chance += (skillLevel - 1) * 0.05;
  
  // Rarity penalty: harder to invent higher rarity items
  const rarityPenalty = BLUEPRINT_RARITY_MULTIPLIERS[blueprint.rarity] * 0.002;
  chance -= rarityPenalty;
  
  return Math.max(0.01, Math.min(0.95, chance));
}

// =============================================================================
// TRADING SYSTEMS
// =============================================================================

export interface MarketOrder {
  id: string;
  type: 'buy' | 'sell';
  itemTypeId: string;
  itemName: string;
  quantity: number;
  pricePerUnit: number;
  totalPrice: number;
  remainingQuantity: number;
  expiresAt: number;
  listedAt: number;
  sellerId: string;
  sellerName: string;
  stationId: string;
  stationName: string;
  systemId: string;
  securityStatus: number;
  isContraband: boolean;
  minimumQuantity?: number;
  range: 'station' | 'system' | 'region' | 'galaxy';
}

export interface TradeRoute {
  id: string;
  name: string;
  originStationId: string;
  destinationStationId: string;
  originSystemId: string;
  destinationSystemId: string;
  commodityTypeId: string;
  commodityName: string;
  buyPrice: number;
  sellPrice: number;
  profitPerUnit: number;
  totalProfitPerTrip: number;
  tripDuration: number;
  riskFactor: number; // 0-1
  volumePerUnit: number;
  maxCargoCapacity: number;
  isBlackMarket: boolean;
  securityPenalty: number;
}

/**
 * Calculate market tax based on security status and faction standing
 */
export function calcMarketTax(securityStatus: number, factionStanding: number): number {
  const baseTax = securityStatus >= 0.5 ? 0.05 : securityStatus >= 0.0 ? 0.08 : 0.12;
  const standingReduction = Math.min(0.05, factionStanding * 0.001);
  return Math.max(0.01, baseTax - standingReduction);
}

/**
 * Calculate black market premium (markup over legitimate price)
 */
export function calcBlackMarketPremium(
  blueprint: BlueprintConfig,
  systemSecurity: number,
  demandLevel: number
): number {
  const basePremium = blueprint.isContraband ? 3.0 : 1.5;
  const securityModifier = 1.0 + (1.0 - Math.abs(systemSecurity));
  const demandModifier = 1.0 + (demandLevel * 0.1);
  return basePremium * securityModifier * demandModifier;
}

/**
 * Calculate smuggling risk
 */
export function calcSmugglingRisk(
  contrabandLevel: number,
  systemSecurity: number,
  cargoSize: number
): number {
  const baseRisk = systemSecurity >= 0.5 ? 0.8 : systemSecurity >= 0.0 ? 0.4 : 0.1;
  const cargoRisk = Math.min(0.9, cargoSize * 0.0001);
  return Math.min(0.95, baseRisk * contrabandLevel + cargoRisk);
}

/**
 * Generate a potential trade route profit calculation
 */
export function calculateTradeRouteProfit(
  buyPrice: number,
  sellPrice: number,
  volume: number,
  cargoCapacity: number,
  taxRate: number
): { grossProfit: number; netProfit: number; taxPaid: number; tripsRequired: number } {
  const maxLoad = Math.floor(cargoCapacity / volume);
  const grossProfit = (sellPrice - buyPrice) * maxLoad;
  const taxPaid = grossProfit * taxRate;
  const netProfit = grossProfit - taxPaid;
  const tripsRequired = Math.ceil(volume / cargoCapacity);
  
  return { grossProfit, netProfit, taxPaid, tripsRequired };
}

// =============================================================================
// MANUFACTURING SYSTEM
// =============================================================================

export interface ManufacturingJob {
  id: string;
  blueprintId: string;
  runs: number;
  startTime: number;
  endTime: number;
  status: 'queued' | 'active' | 'completed' | 'cancelled' | 'failed';
  facilityId: string;
  ownerId: string;
  appliedME: number;
  appliedTE: number;
  usedDecryptor?: string;
  isCopy: boolean;
  originalBlueprintRuns: number;
  materialSavings: number;
}

/**
 * Calculate total manufacturing time with TE bonus
 */
export function calcManufacturingTime(blueprint: BlueprintConfig, teLevel: number, runs: number): number {
  const efficiencyFactor = getTimeEfficiency(teLevel);
  return Math.ceil(blueprint.manufacturingTime * efficiencyFactor * runs);
}

/**
 * Calculate total materials required with ME bonus
 */
export function calcManufacturingMaterials(
  blueprint: BlueprintConfig,
  meLevel: number,
  runs: number
): BlueprintMaterial[] {
  return applyMESavings(blueprint.materials, meLevel).map(m => ({
    ...m,
    quantity: m.quantity * runs,
  }));
}

/**
 * Rarity color codes for UI
 */
export const RARITY_COLORS: Record<BlueprintRarity, string> = {
  'common': '#FFFFFF',
  'uncommon': '#1EFF00',
  'rare': '#0070FF',
  'exceptional': '#A335EE',
  'faction': '#FF8000',
  'deadspace': '#FF0000',
  'officer': '#00FFCC',
  'ancient': '#FFD700',
  'tech-2': '#00BFFF',
  'tech-3': '#FF00FF',
  'storyline': '#FF8C00',
};

export default BLUEPRINT_CATALOG;