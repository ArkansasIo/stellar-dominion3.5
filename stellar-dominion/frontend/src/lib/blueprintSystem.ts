export interface BlueprintRequirement {
  itemId: string;
  itemName: string;
  quantity: number;
}

export type Rarity = "common" | "uncommon" | "rare" | "epic" | "legendary" | "exotic";
export type Rank = "I" | "II" | "III" | "IV" | "V" | "VI" | "VII" | "VIII" | "IX" | "X";

export interface Blueprint {
  id: string;
  name: string;
  displayName: string;
  description: string;
  detailedDescription: string;
  type: "ship" | "building" | "component" | "module";
  outputId: string;
  outputName: string;
  outputQuantity: number;
  category: string;
  
  // Rarity & Progression
  rarity: Rarity;
  level: number; // 1-100
  rank: Rank;
  color: string; // hex color for rarity
  
  // Manufacturing parameters
  baseManufacturingTime: number; // seconds
  baseMaterialNeeded: BlueprintRequirement[];
  
  // Blueprint Copy parameters
  maxRuns: number; // -1 for original (infinite)
  currentRuns: number;
  remainingRuns: number; // -1 for original
  
  // Copy parameters
  isOriginal: boolean;
  isCopy: boolean;
  quality: number; // 0-100 for copy quality
  
  // Manufacturing properties
  baseSuccessRate: number; // 0-100
  materialEfficiency: number; // percentage material waste
  timeEfficiency: number; // percentage time reduction
  
  // Status
  status: "active" | "used_up" | "archived";
  location: string; // coordinates
  owner: string;
  createdAt: number;
}

export interface ProductionJob {
  id: string;
  blueprintId: string;
  blueprintName: string;
  quantity: number;
  status: "queued" | "in_progress" | "completed" | "failed";
  startTime: number;
  endTime: number;
  totalTime: number;
  progress: number; // 0-100
  successRate: number;
  wasSuccessful?: boolean;
  outputQuantity?: number;
  failureReason?: string;
}

// Rarity color mapping
export const rarityColors: {[key in Rarity]: string} = {
  common: "#94a3b8",
  uncommon: "#22c55e",
  rare: "#3b82f6",
  epic: "#a855f7",
  legendary: "#f59e0b",
  exotic: "#ec4899",
};

// Base blueprints available in game
export const BASE_BLUEPRINTS: Blueprint[] = [
  // Ship Blueprints
  {
    id: "bp_lightfighter",
    name: "Light Fighter Blueprint",
    displayName: "Sentinel Fighter",
    description: "Blueprint for manufacturing Light Fighter ships.",
    detailedDescription: "Entry-level combat vessel. Lightweight frame with rapid acceleration. Ideal for novice commanders seeking to build their first combat fleet. Reliable atmospheric and space operations.",
    type: "ship",
    outputId: "lightFighter",
    outputName: "Light Fighter",
    outputQuantity: 1,
    category: "combat",
    rarity: "common",
    level: 1,
    rank: "I",
    color: "#94a3b8",
    baseManufacturingTime: 300,
    baseMaterialNeeded: [
      { itemId: "metal", itemName: "Metal", quantity: 1000 },
      { itemId: "crystal", itemName: "Crystal", quantity: 400 },
    ],
    maxRuns: -1,
    currentRuns: -1,
    remainingRuns: -1,
    isOriginal: true,
    isCopy: false,
    quality: 100,
    status: "active",
    baseSuccessRate: 95,
    materialEfficiency: 100,
    timeEfficiency: 100,
    location: "1:1:100:3",
    owner: "Commander",
    createdAt: Date.now(),
  },
  {
    id: "bp_heavyfighter",
    name: "Heavy Fighter Blueprint",
    displayName: "Vanguard Striker",
    description: "Blueprint for manufacturing Heavy Fighter ships.",
    detailedDescription: "Advanced combat vessel with enhanced armor plating and weapons systems. Moderately rare blueprint featuring improved damage output and durability. Superior firepower for experienced commanders.",
    type: "ship",
    outputId: "heavyFighter",
    outputName: "Heavy Fighter",
    outputQuantity: 1,
    category: "combat",
    rarity: "uncommon",
    level: 10,
    rank: "II",
    color: "#22c55e",
    baseManufacturingTime: 600,
    baseMaterialNeeded: [
      { itemId: "metal", itemName: "Metal", quantity: 6000 },
      { itemId: "crystal", itemName: "Crystal", quantity: 4000 },
    ],
    maxRuns: -1,
    currentRuns: -1,
    remainingRuns: -1,
    isOriginal: true,
    isCopy: false,
    quality: 100,
    status: "active",
    baseSuccessRate: 90,
    materialEfficiency: 100,
    timeEfficiency: 100,
    location: "1:1:100:3",
    owner: "Commander",
    createdAt: Date.now(),
  },
  {
    id: "bp_cruiser",
    name: "Cruiser Blueprint",
    displayName: "Dominion Cruiser",
    description: "Blueprint for manufacturing Cruiser ships.",
    detailedDescription: "Rare military-grade cruiser platform. Balanced design featuring adequate firepower, speed, and cargo capacity. Preferred vessel for mid-tier naval operations and trade route protection.",
    type: "ship",
    outputId: "cruiser",
    outputName: "Cruiser",
    outputQuantity: 1,
    category: "capital",
    rarity: "rare",
    level: 25,
    rank: "III",
    color: "#3b82f6",
    baseManufacturingTime: 1200,
    baseMaterialNeeded: [
      { itemId: "metal", itemName: "Metal", quantity: 20000 },
      { itemId: "crystal", itemName: "Crystal", quantity: 7000 },
      { itemId: "deuterium", itemName: "Deuterium", quantity: 2000 },
    ],
    maxRuns: -1,
    currentRuns: -1,
    remainingRuns: -1,
    isOriginal: true,
    isCopy: false,
    quality: 100,
    status: "active",
    baseSuccessRate: 85,
    materialEfficiency: 100,
    timeEfficiency: 100,
    location: "1:1:100:3",
    owner: "Commander",
    createdAt: Date.now(),
  },
  {
    id: "bp_smallcargo",
    name: "Small Cargo Ship Blueprint",
    displayName: "Merchant Hauler",
    description: "Blueprint for manufacturing Small Cargo Ships.",
    detailedDescription: "Common logistics vessel designed for interstellar trade. Efficient cargo capacity with minimal combat capability. Essential for empire-wide resource distribution and commercial operations.",
    type: "ship",
    outputId: "smallCargo",
    outputName: "Small Cargo Ship",
    outputQuantity: 1,
    category: "transport",
    rarity: "common",
    level: 3,
    rank: "I",
    color: "#94a3b8",
    baseManufacturingTime: 400,
    baseMaterialNeeded: [
      { itemId: "metal", itemName: "Metal", quantity: 2000 },
      { itemId: "crystal", itemName: "Crystal", quantity: 2000 },
    ],
    maxRuns: -1,
    currentRuns: -1,
    remainingRuns: -1,
    isOriginal: true,
    isCopy: false,
    quality: 100,
    status: "active",
    baseSuccessRate: 95,
    materialEfficiency: 100,
    timeEfficiency: 100,
    location: "1:1:100:3",
    owner: "Commander",
    createdAt: Date.now(),
  },

  // Building Blueprints
  {
    id: "bp_metalmine",
    name: "Metal Mine Blueprint",
    displayName: "Ore Extraction Facility",
    description: "Blueprint for constructing Metal Mines.",
    detailedDescription: "Basic extraction facility for harvesting metal ore deposits. Foundational industrial structure for any growing empire. Increases planetary production output significantly.",
    type: "building",
    outputId: "metalMine",
    outputName: "Metal Mine",
    outputQuantity: 1,
    category: "production",
    rarity: "common",
    level: 1,
    rank: "I",
    color: "#94a3b8",
    baseManufacturingTime: 30,
    baseMaterialNeeded: [
      { itemId: "metal", itemName: "Metal", quantity: 60 },
      { itemId: "crystal", itemName: "Crystal", quantity: 15 },
    ],
    maxRuns: -1,
    currentRuns: -1,
    remainingRuns: -1,
    isOriginal: true,
    isCopy: false,
    quality: 100,
    status: "active",
    baseSuccessRate: 99,
    materialEfficiency: 100,
    timeEfficiency: 100,
    location: "1:1:100:3",
    owner: "Commander",
    createdAt: Date.now(),
  },
  {
    id: "bp_shipyard",
    name: "Shipyard Blueprint",
    displayName: "Advanced Shipyard",
    description: "Blueprint for constructing Shipyards.",
    detailedDescription: "Industrial complex specializing in starship construction and maintenance. Epic-tier facility enabling production of advanced capital vessels. Doubles fleet construction speed.",
    type: "building",
    outputId: "shipyard",
    outputName: "Shipyard",
    outputQuantity: 1,
    category: "production",
    rarity: "epic",
    level: 50,
    rank: "V",
    color: "#a855f7",
    baseManufacturingTime: 30,
    baseMaterialNeeded: [
      { itemId: "metal", itemName: "Metal", quantity: 400 },
      { itemId: "crystal", itemName: "Crystal", quantity: 200 },
      { itemId: "deuterium", itemName: "Deuterium", quantity: 100 },
    ],
    maxRuns: -1,
    currentRuns: -1,
    remainingRuns: -1,
    isOriginal: true,
    isCopy: false,
    quality: 100,
    status: "active",
    baseSuccessRate: 98,
    materialEfficiency: 100,
    timeEfficiency: 100,
    location: "1:1:100:3",
    owner: "Commander",
    createdAt: Date.now(),
  },
];

// Calculate manufacturing cost with efficiency modifiers
export function calculateManufacturingCost(
  blueprint: Blueprint,
  quantity: number,
  industrySkill: number = 1
): BlueprintRequirement[] {
  const wastePercentage = (100 - blueprint.materialEfficiency) * (1 - industrySkill * 0.01);
  const materialWaste = 1 + wastePercentage / 100;

  return blueprint.baseMaterialNeeded.map(req => ({
    ...req,
    quantity: Math.ceil(req.quantity * quantity * materialWaste),
  }));
}

// Calculate manufacturing time with modifiers
export function calculateManufacturingTime(
  blueprint: Blueprint,
  quantity: number,
  industrySkill: number = 1,
  shipdyardLevel: number = 1
): number {
  let baseTime = blueprint.baseManufacturingTime * quantity;
  
  // Apply time efficiency
  const timeReduction = blueprint.timeEfficiency * (1 + industrySkill * 0.05);
  baseTime = baseTime * (1 - timeReduction / 100);
  
  // Shipyard level speeds up production
  baseTime = baseTime / (1 + shipdyardLevel * 0.1);
  
  return Math.ceil(baseTime);
}

// Calculate success rate for manufacturing
export function calculateSuccessRate(
  blueprint: Blueprint,
  industrySkill: number = 1,
  scientistSkill: number = 1
): number {
  let successRate = blueprint.baseSuccessRate;
  
  // Industry skill improves success rate
  successRate += industrySkill * 2;
  
  // Scientist skill improves success rate for complex items
  if (blueprint.type === "ship") {
    successRate += scientistSkill * 1.5;
  }
  
  // Copy quality affects success rate
  if (blueprint.isCopy) {
    successRate = successRate * (blueprint.quality / 100);
  }
  
  return Math.min(100, Math.max(0, successRate));
}

// Create a blueprint copy from an original
export function createBlueprintCopy(
  original: Blueprint,
  runs: number = 10,
  quality: number = 85
): Blueprint {
  // Quality affects rarity downgrade
  let copyRarity = original.rarity;
  if (quality < 90 && original.rarity !== "common") {
    copyRarity = (["common", "uncommon", "rare", "epic", "legendary", "exotic"] as Rarity[])[
      Math.max(0, (["common", "uncommon", "rare", "epic", "legendary", "exotic"] as Rarity[]).indexOf(original.rarity) - 1)
    ];
  }

  return {
    ...original,
    id: `${original.id}_copy_${Date.now()}`,
    isOriginal: false,
    isCopy: true,
    maxRuns: runs,
    currentRuns: runs,
    remainingRuns: runs,
    quality: quality,
    rarity: copyRarity,
    color: rarityColors[copyRarity],
    status: "active",
  };
}

// Simulate manufacturing job completion
export function completeManufacturingJob(
  job: ProductionJob,
  blueprint: Blueprint
): ProductionJob {
  const successRate = blueprint.baseSuccessRate;
  const random = Math.random() * 100;
  const wasSuccessful = random <= successRate;

  return {
    ...job,
    status: wasSuccessful ? "completed" : "failed",
    wasSuccessful,
    progress: 100,
    outputQuantity: wasSuccessful ? job.quantity * blueprint.outputQuantity : 0,
    failureReason: wasSuccessful ? undefined : "Manufacturing failed due to process issues",
  };
}
