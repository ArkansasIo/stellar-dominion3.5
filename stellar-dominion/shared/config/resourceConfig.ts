// Resource Configuration - Mining, equipment, and resource management
export const RESOURCE_CONFIG = {
  // Core resources
  resources: {
    metal: { name: "Metal", description: "Industrial metal ore", category: "mining" },
    crystal: { name: "Crystal", description: "Crystalline compounds", category: "mining" },
    deuterium: { name: "Deuterium", description: "Heavy hydrogen isotope", category: "mining" },
    energy: { name: "Energy", description: "Power generation", category: "production" },
    food: { name: "Food", description: "Agricultural produce", category: "sustenance" },
    water: { name: "Water", description: "Fresh water supplies", category: "sustenance" },
  },

  // Mining equipment
  miningEquipment: {
    basicPickaxe: { name: "Basic Pickaxe", resourceYield: { metal: 10 }, durability: 50, level: 1, rarity: "common" },
    reinforcedDrill: { name: "Reinforced Drill", resourceYield: { metal: 25, crystal: 5 }, durability: 100, level: 2, rarity: "uncommon" },
    quantumExtractor: { name: "Quantum Extractor", resourceYield: { metal: 50, crystal: 25, deuterium: 10 }, durability: 200, level: 3, rarity: "rare" },
    advancedProbe: { name: "Advanced Probe", resourceYield: { deuterium: 50 }, durability: 150, level: 4, rarity: "epic" },
    legendaryHarvester: { name: "Legendary Harvester", resourceYield: { metal: 100, crystal: 75, deuterium: 50 }, durability: 500, level: 5, rarity: "legendary" },
  },

  // Equipment types
  equipmentTypes: {
    weapon: { name: "Weapon", slots: 1, bonus: "damage" },
    armor: { name: "Armor", slots: 1, bonus: "defense" },
    tool: { name: "Tool", slots: 1, bonus: "productivity" },
    accessory: { name: "Accessory", slots: 2, bonus: "utility" },
  },

  // Rarity system
  rarities: {
    common: { level: 1, color: "#FFFFFF", statMultiplier: 1.0, dropRate: 0.6 },
    uncommon: { level: 2, color: "#1EFF00", statMultiplier: 1.15, dropRate: 0.25 },
    rare: { level: 3, color: "#0070DD", statMultiplier: 1.35, dropRate: 0.1 },
    epic: { level: 4, color: "#A335EE", statMultiplier: 1.60, dropRate: 0.04 },
    legendary: { level: 5, color: "#FF8000", statMultiplier: 2.0, dropRate: 0.01 },
  },
};
