export type BlueprintChargeStatus = "active" | "depleted" | "broken";

export interface BlueprintInstance {
  id: string;
  userId: string;
  blueprintDefinitionId: string;
  name: string;
  category: string;
  rarity: string;
  level: number;
  maxCharges: number;
  currentCharges: number;
  status: BlueprintChargeStatus;
  quality: number;
  materialEfficiency: number;
  timeEfficiency: number;
  totalUses: number;
  printCost?: { metal: number; crystal: number; deuterium: number; energy: number; credits: number };
  createdAt: string;
  updatedAt: string;
}

export interface BlueprintDefinition {
  id: string;
  name: string;
  category: string;
  description: string;
  rarity: string;
  baseCharges: number;
  baseQuality: number;
  materialEfficiency: number;
  timeEfficiency: number;
  printCost: BlueprintPrintCost;
  materials: BlueprintMaterial[];
  outputItem: string;
  outputQuantity: number;
  craftingTimeSeconds: number;
  unlockLevel: number;
  effects: BlueprintEffect[];
}

export interface BlueprintPrintCost {
  metal: number;
  crystal: number;
  deuterium: number;
  energy: number;
  credits: number;
}

export interface BlueprintMaterial {
  resource: string;
  amount: number;
  bonusPerLevel: number;
}

export interface BlueprintEffect {
  type: string;
  value: number;
  description: string;
}

export interface PrinterJob {
  id: string;
  userId: string;
  blueprintDefinitionId: string;
  status: "queued" | "printing" | "completed" | "failed";
  startedAt: string | null;
  completeAt: string | null;
  progress: number;
  quality: number;
  createdAt: string;
}

export const CHARGE_CONFIG = {
  baseMaxCharges: 12,
  chargesPerQualityLevel: 1,
  repairCostPerCharge: 0.1,
  depletionThreshold: 0,
  qualityDecayPerUse: 0.005,
  maxRepairPercent: 0.5,
  breakChanceAtZero: 0.25,
};

export const PRINTER_CONFIG = {
  maxConcurrentJobs: 3,
  basePrintTimeSeconds: 300,
  qualityBonusPerLevel: 0.01,
  efficiencyBonusPerLevel: 0.005,
  criticalFailureChance: 0.02,
  criticalFailureChancePerQuality: 0.001,
  maxPrinterLevel: 50,
  upgradeCostMultiplier: 1.3,
};

export const BLUEPRINT_DEFINITIONS: BlueprintDefinition[] = [
  {
    id: "bp_light_fighter_1", name: "Light Fighter Blueprint", category: "Ships",
    description: "Basic combat fighter. High speed, low armor.", rarity: "common",
    baseCharges: 12, baseQuality: 0.7, materialEfficiency: 0.8, timeEfficiency: 0.9,
    printCost: { metal: 500, crystal: 200, deuterium: 50, energy: 100, credits: 200 },
    materials: [{ resource: "metal", amount: 1000, bonusPerLevel: 10 }],
    outputItem: "light_fighter", outputQuantity: 5, craftingTimeSeconds: 120,
    unlockLevel: 1, effects: [{ type: "fleetDamage", value: 5, description: "+5 fleet damage per unit" }],
  },
  {
    id: "bp_heavy_fighter_1", name: "Heavy Fighter Blueprint", category: "Ships",
    description: "Armored combat fighter. High damage, medium speed.", rarity: "uncommon",
    baseCharges: 10, baseQuality: 0.75, materialEfficiency: 0.85, timeEfficiency: 0.85,
    printCost: { metal: 1200, crystal: 600, deuterium: 150, energy: 250, credits: 500 },
    materials: [{ resource: "metal", amount: 2500, bonusPerLevel: 25 }, { resource: "crystal", amount: 800, bonusPerLevel: 10 }],
    outputItem: "heavy_fighter", outputQuantity: 3, craftingTimeSeconds: 180,
    unlockLevel: 5, effects: [{ type: "fleetDamage", value: 15, description: "+15 fleet damage per unit" }],
  },
  {
    id: "bp_cruiser_1", name: "Cruiser Blueprint", category: "Ships",
    description: "Versatile warship. Balanced stats across the board.", rarity: "rare",
    baseCharges: 8, baseQuality: 0.8, materialEfficiency: 0.9, timeEfficiency: 0.8,
    printCost: { metal: 3000, crystal: 1500, deuterium: 500, energy: 500, credits: 1500 },
    materials: [{ resource: "metal", amount: 8000, bonusPerLevel: 80 }, { resource: "crystal", amount: 3000, bonusPerLevel: 30 }],
    outputItem: "cruiser", outputQuantity: 1, craftingTimeSeconds: 360,
    unlockLevel: 15, effects: [{ type: "fleetDamage", value: 40, description: "+40 fleet damage per unit" }, { type: "fleetHealth", value: 100, description: "+100 fleet health per unit" }],
  },
  {
    id: "bp_battleship_1", name: "Battleship Blueprint", category: "Ships",
    description: "Heavy capital ship. Massive firepower and armor.", rarity: "epic",
    baseCharges: 6, baseQuality: 0.85, materialEfficiency: 0.95, timeEfficiency: 0.75,
    printCost: { metal: 10000, crystal: 5000, deuterium: 2000, energy: 1500, credits: 5000 },
    materials: [{ resource: "metal", amount: 25000, bonusPerLevel: 250 }, { resource: "crystal", amount: 10000, bonusPerLevel: 100 }, { resource: "deuterium", amount: 3000, bonusPerLevel: 30 }],
    outputItem: "battleship", outputQuantity: 1, craftingTimeSeconds: 720,
    unlockLevel: 25, effects: [{ type: "fleetDamage", value: 100, description: "+100 fleet damage per unit" }, { type: "fleetHealth", value: 500, description: "+500 fleet health per unit" }],
  },
  {
    id: "bp_destroyer_1", name: "Destroyer Blueprint", category: "Ships",
    description: "Anti-capital ship specialist. Devastating first strike.", rarity: "legendary",
    baseCharges: 5, baseQuality: 0.9, materialEfficiency: 1.0, timeEfficiency: 0.7,
    printCost: { metal: 25000, crystal: 12000, deuterium: 5000, energy: 3000, credits: 12000 },
    materials: [{ resource: "metal", amount: 60000, bonusPerLevel: 600 }, { resource: "crystal", amount: 25000, bonusPerLevel: 250 }, { resource: "deuterium", amount: 8000, bonusPerLevel: 80 }],
    outputItem: "destroyer", outputQuantity: 1, craftingTimeSeconds: 1200,
    unlockLevel: 40, effects: [{ type: "fleetDamage", value: 250, description: "+250 fleet damage per unit" }, { type: "criticalChance", value: 0.15, description: "+15% critical hit chance" }],
  },
  {
    id: "bp_mining激光_1", name: "Mining Laser Blueprint", category: "Equipment",
    description: "Enhanced mining laser for increased resource extraction.", rarity: "common",
    baseCharges: 15, baseQuality: 0.65, materialEfficiency: 0.75, timeEfficiency: 0.95,
    printCost: { metal: 300, crystal: 150, deuterium: 0, energy: 50, credits: 100 },
    materials: [{ resource: "metal", amount: 500, bonusPerLevel: 5 }],
    outputItem: "mining_laser", outputQuantity: 1, craftingTimeSeconds: 60,
    unlockLevel: 1, effects: [{ type: "miningSpeed", value: 0.05, description: "+5% mining speed" }],
  },
  {
    id: "bp_shield_generator_1", name: "Shield Generator Blueprint", category: "Equipment",
    description: "Personal shield generator for fleet protection.", rarity: "uncommon",
    baseCharges: 12, baseQuality: 0.75, materialEfficiency: 0.85, timeEfficiency: 0.9,
    printCost: { metal: 800, crystal: 400, deuterium: 100, energy: 200, credits: 400 },
    materials: [{ resource: "crystal", amount: 1500, bonusPerLevel: 15 }, { resource: "energy", amount: 500, bonusPerLevel: 5 }],
    outputItem: "shield_generator", outputQuantity: 1, craftingTimeSeconds: 150,
    unlockLevel: 8, effects: [{ type: "fleetShield", value: 0.08, description: "+8% fleet shield strength" }],
  },
  {
    id: "bp_warp_drive_1", name: "Warp Drive Blueprint", category: "Equipment",
    description: "Advanced warp drive for faster fleet movement.", rarity: "rare",
    baseCharges: 10, baseQuality: 0.8, materialEfficiency: 0.9, timeEfficiency: 0.85,
    printCost: { metal: 2000, crystal: 1000, deuterium: 400, energy: 400, credits: 1000 },
    materials: [{ resource: "deuterium", amount: 2000, bonusPerLevel: 20 }, { resource: "crystal", amount: 1500, bonusPerLevel: 15 }],
    outputItem: "warp_drive", outputQuantity: 1, craftingTimeSeconds: 240,
    unlockLevel: 12, effects: [{ type: "fleetSpeed", value: 0.15, description: "+15% fleet speed" }],
  },
  {
    id: "bp_power_reactor_1", name: "Power Reactor Blueprint", category: "Infrastructure",
    description: "Compact fusion reactor for colony power generation.", rarity: "uncommon",
    baseCharges: 14, baseQuality: 0.7, materialEfficiency: 0.8, timeEfficiency: 0.9,
    printCost: { metal: 600, crystal: 300, deuterium: 80, energy: 150, credits: 300 },
    materials: [{ resource: "metal", amount: 1000, bonusPerLevel: 10 }, { resource: "deuterium", amount: 200, bonusPerLevel: 2 }],
    outputItem: "power_reactor", outputQuantity: 1, craftingTimeSeconds: 180,
    unlockLevel: 5, effects: [{ type: "energyProduction", value: 0.1, description: "+10% energy production" }],
  },
  {
    id: "bp_research_scanner_1", name: "Research Scanner Blueprint", category: "Research",
    description: "Deep-space scanner that accelerates research progress.", rarity: "rare",
    baseCharges: 10, baseQuality: 0.8, materialEfficiency: 0.85, timeEfficiency: 0.85,
    printCost: { metal: 1500, crystal: 800, deuterium: 200, energy: 300, credits: 800 },
    materials: [{ resource: "crystal", amount: 2000, bonusPerLevel: 20 }, { resource: "energy", amount: 800, bonusPerLevel: 8 }],
    outputItem: "research_scanner", outputQuantity: 1, craftingTimeSeconds: 300,
    unlockLevel: 10, effects: [{ type: "researchSpeed", value: 0.1, description: "+10% research speed" }],
  },
  {
    id: "bp_trade_module_1", name: "Trade Module Blueprint", category: "Infrastructure",
    description: "Automated trade module that reduces market fees.", rarity: "uncommon",
    baseCharges: 14, baseQuality: 0.7, materialEfficiency: 0.8, timeEfficiency: 0.9,
    printCost: { metal: 500, crystal: 250, deuterium: 50, energy: 100, credits: 500 },
    materials: [{ resource: "credits", amount: 5000, bonusPerLevel: 50 }],
    outputItem: "trade_module", outputQuantity: 1, craftingTimeSeconds: 120,
    unlockLevel: 8, effects: [{ type: "tradeFeeReduction", value: 0.03, description: "-3% market fees" }],
  },
  {
    id: "bp_colony_habitat_1", name: "Colony Habitat Blueprint", category: "Infrastructure",
    description: "Modular habitat for establishing new colonies.", rarity: "common",
    baseCharges: 15, baseQuality: 0.65, materialEfficiency: 0.75, timeEfficiency: 0.95,
    printCost: { metal: 400, crystal: 200, deuterium: 30, energy: 80, credits: 150 },
    materials: [{ resource: "metal", amount: 800, bonusPerLevel: 8 }],
    outputItem: "colony_habitat", outputQuantity: 1, craftingTimeSeconds: 90,
    unlockLevel: 3, effects: [{ type: "colonyCapacity", value: 50, description: "+50 colony population capacity" }],
  },
];

export function getBlueprintDefinition(id: string): BlueprintDefinition | undefined {
  return BLUEPRINT_DEFINITIONS.find((bp) => bp.id === id);
}

export function calculateChargesRemaining(currentCharges: number, quality: number): number {
  return Math.max(0, currentCharges);
}

export function calculateRepairCost(blueprint: BlueprintInstance, chargesToRepair: number): BlueprintPrintCost {
  const baseRepairCost = blueprint.printCost || { metal: 100, crystal: 50, deuterium: 10, energy: 20, credits: 100 };
  const repairMultiplier = CHARGE_CONFIG.repairCostPerCharge * chargesToRepair;
  return {
    metal: Math.floor(baseRepairCost.metal * repairMultiplier),
    crystal: Math.floor(baseRepairCost.crystal * repairMultiplier),
    deuterium: Math.floor(baseRepairCost.deuterium * repairMultiplier),
    energy: Math.floor(baseCost(baseRepairCost.energy) * repairMultiplier),
    credits: Math.floor(baseRepairCost.credits * repairMultiplier),
  };
}

function baseCost(val: number): number { return val; }

export function useCharge(blueprint: BlueprintInstance): BlueprintInstance {
  const newCharges = blueprint.currentCharges - 1;
  const newQuality = Math.max(0.1, blueprint.quality - CHARGE_CONFIG.qualityDecayPerUse);
  const newStatus: BlueprintChargeStatus = newCharges <= 0 ? "depleted" : "active";

  return {
    ...blueprint,
    currentCharges: newCharges,
    quality: newQuality,
    status: newStatus,
    totalUses: blueprint.totalUses + 1,
    updatedAt: new Date().toISOString(),
  };
}

export function repairBlueprint(blueprint: BlueprintInstance, chargesToRepair: number): BlueprintInstance {
  const maxRepairable = Math.floor(blueprint.maxCharges * CHARGE_CONFIG.maxRepairPercent);
  const actualRepair = Math.min(chargesToRepair, maxRepairable, blueprint.maxCharges - blueprint.currentCharges);

  return {
    ...blueprint,
    currentCharges: blueprint.currentCharges + actualRepair,
    status: "active",
    updatedAt: new Date().toISOString(),
  };
}

export function createBlueprintInstance(definition: BlueprintDefinition, userId: string, printerLevel: number = 1): BlueprintInstance {
  const qualityBonus = PRINTER_CONFIG.qualityBonusPerLevel * (printerLevel - 1);
  const quality = Math.min(1, definition.baseQuality + qualityBonus);
  const maxCharges = definition.baseCharges + Math.floor(quality * CHARGE_CONFIG.chargesPerQualityLevel);

  return {
    id: `bp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId,
    blueprintDefinitionId: definition.id,
    name: definition.name,
    category: definition.category,
    rarity: definition.rarity,
    level: 1,
    maxCharges,
    currentCharges: maxCharges,
    status: "active",
    quality,
    materialEfficiency: definition.materialEfficiency,
    timeEfficiency: definition.timeEfficiency,
    totalUses: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
