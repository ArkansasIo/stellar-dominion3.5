// Starbase Infrastructure System Configuration
// Defines starbase types, modules, upgrade costs, and progression

export type StarbaseType = "mining" | "refining" | "shipyard" | "research" | "trade" | "defense" | "command";

export type StarbaseModuleCategory = "production" | "storage" | "defense" | "offense" | "support" | "utility";

export type StarbaseModuleTier = "standard" | "advanced" | "elite" | "legendary";

export interface StarbaseModule {
  id: string;
  name: string;
  description: string;
  category: StarbaseModuleCategory;
  tier: StarbaseModuleTier;
  starbaseTypes: StarbaseType[];
  maxLevel: number;
  costs: {
    metal: number;
    crystal: number;
    deuterium: number;
    credits: number;
  };
  buildTime: number;
  effects: Record<string, number>;
  prerequisites: string[];
}

export interface StarbaseTypeInfo {
  id: StarbaseType;
  name: string;
  description: string;
  icon: string;
  maxLevel: number;
  baseStats: {
    metalStorage: number;
    crystalStorage: number;
    deuteriumStorage: number;
    metalProduction: number;
    crystalProduction: number;
    deuteriumProduction: number;
    hangarSlots: number;
    researchSlots: number;
    defenseLevel: number;
  };
  upgradeCostMultiplier: number;
  moduleSlots: number;
}

export const STARBASE_TYPES: Record<StarbaseType, StarbaseTypeInfo> = {
  mining: {
    id: "mining",
    name: "Mining Station",
    description: "Automated resource extraction facility. Produces metal, crystal, and deuterium at high rates.",
    icon: "⛏️",
    maxLevel: 50,
    baseStats: {
      metalStorage: 100000,
      crystalStorage: 50000,
      deuteriumStorage: 25000,
      metalProduction: 500,
      crystalProduction: 250,
      deuteriumProduction: 100,
      hangarSlots: 2,
      researchSlots: 0,
      defenseLevel: 10,
    },
    upgradeCostMultiplier: 1.0,
    moduleSlots: 6,
  },
  refining: {
    id: "refining",
    name: "Refinery Platform",
    description: "Processes raw materials into refined compounds. Boosts resource quality and conversion rates.",
    icon: "🏭",
    maxLevel: 50,
    baseStats: {
      metalStorage: 75000,
      crystalStorage: 75000,
      deuteriumStorage: 50000,
      metalProduction: 200,
      crystalProduction: 200,
      deuteriumProduction: 200,
      hangarSlots: 2,
      researchSlots: 1,
      defenseLevel: 15,
    },
    upgradeCostMultiplier: 1.2,
    moduleSlots: 6,
  },
  shipyard: {
    id: "shipyard",
    name: "Shipyard Complex",
    description: "Construction and maintenance facility for starships. Enables advanced ship production.",
    icon: "🚀",
    maxLevel: 50,
    baseStats: {
      metalStorage: 150000,
      crystalStorage: 100000,
      deuteriumStorage: 75000,
      metalProduction: 100,
      crystalProduction: 100,
      deuteriumProduction: 50,
      hangarSlots: 8,
      researchSlots: 0,
      defenseLevel: 20,
    },
    upgradeCostMultiplier: 1.5,
    moduleSlots: 8,
  },
  research: {
    id: "research",
    name: "Research Nexus",
    description: "Advanced scientific research facility. Accelerates technology development and unlocks exotic research.",
    icon: "🔬",
    maxLevel: 50,
    baseStats: {
      metalStorage: 50000,
      crystalStorage: 100000,
      deuteriumStorage: 50000,
      metalProduction: 50,
      crystalProduction: 50,
      deuteriumProduction: 50,
      hangarSlots: 1,
      researchSlots: 4,
      defenseLevel: 10,
    },
    upgradeCostMultiplier: 1.3,
    moduleSlots: 6,
  },
  trade: {
    id: "trade",
    name: "Trade Hub",
    description: "Commercial center for interstellar trade. Increases market access and reduces transaction fees.",
    icon: "📊",
    maxLevel: 50,
    baseStats: {
      metalStorage: 200000,
      crystalStorage: 200000,
      deuteriumStorage: 100000,
      metalProduction: 150,
      crystalProduction: 150,
      deuteriumProduction: 75,
      hangarSlots: 3,
      researchSlots: 1,
      defenseLevel: 12,
    },
    upgradeCostMultiplier: 1.1,
    moduleSlots: 7,
  },
  defense: {
    id: "defense",
    name: "Fortress Bastion",
    description: "Heavily armed defensive installation. Projects force and protects nearby assets.",
    icon: "🛡️",
    maxLevel: 50,
    baseStats: {
      metalStorage: 100000,
      crystalStorage: 50000,
      deuteriumStorage: 100000,
      metalProduction: 50,
      crystalProduction: 25,
      deuteriumProduction: 100,
      hangarSlots: 4,
      researchSlots: 0,
      defenseLevel: 50,
    },
    upgradeCostMultiplier: 1.4,
    moduleSlots: 8,
  },
  command: {
    id: "command",
    name: "Command Citadel",
    description: "Central command and control hub. Provides empire-wide bonuses and coordination capabilities.",
    icon: "👑",
    maxLevel: 50,
    baseStats: {
      metalStorage: 120000,
      crystalStorage: 120000,
      deuteriumStorage: 120000,
      metalProduction: 100,
      crystalProduction: 100,
      deuteriumProduction: 100,
      hangarSlots: 5,
      researchSlots: 2,
      defenseLevel: 30,
    },
    upgradeCostMultiplier: 2.0,
    moduleSlots: 10,
  },
};

export const STARBASE_MODULES: StarbaseModule[] = [
  // Production modules
  {
    id: "extractor-mk1",
    name: "Basic Extractor",
    description: "Standard resource extraction unit.",
    category: "production",
    tier: "standard",
    starbaseTypes: ["mining", "refining"],
    maxLevel: 10,
    costs: { metal: 5000, crystal: 2000, deuterium: 500, credits: 1000 },
    buildTime: 300,
    effects: { metalProduction: 50, crystalProduction: 25 },
    prerequisites: [],
  },
  {
    id: "extractor-mk2",
    name: "Advanced Extractor",
    description: "High-efficiency extraction with nano-assisted drilling.",
    category: "production",
    tier: "advanced",
    starbaseTypes: ["mining", "refining"],
    maxLevel: 10,
    costs: { metal: 15000, crystal: 8000, deuterium: 2000, credits: 5000 },
    buildTime: 600,
    effects: { metalProduction: 150, crystalProduction: 75 },
    prerequisites: ["extractor-mk1"],
  },
  {
    id: "crystallizer",
    name: "Crystallizer Array",
    description: "Converts raw materials into refined crystal.",
    category: "production",
    tier: "standard",
    starbaseTypes: ["refining", "trade"],
    maxLevel: 10,
    costs: { metal: 8000, crystal: 4000, deuterium: 1000, credits: 3000 },
    buildTime: 450,
    effects: { crystalProduction: 80, deuteriumProduction: 20 },
    prerequisites: [],
  },
  {
    id: "deuterium-synthesizer",
    name: "Deuterium Synthesizer",
    description: "Synthesizes deuterium from hydrogen isotopes.",
    category: "production",
    tier: "standard",
    starbaseTypes: ["mining", "refining", "shipyard"],
    maxLevel: 10,
    costs: { metal: 10000, crystal: 5000, deuterium: 2000, credits: 4000 },
    buildTime: 500,
    effects: { deuteriumProduction: 60 },
    prerequisites: [],
  },

  // Storage modules
  {
    id: "cargo-bay",
    name: "Expanded Cargo Bay",
    description: "Increases resource storage capacity.",
    category: "storage",
    tier: "standard",
    starbaseTypes: ["mining", "refining", "trade", "shipyard"],
    maxLevel: 10,
    costs: { metal: 3000, crystal: 1000, deuterium: 200, credits: 800 },
    buildTime: 200,
    effects: { metalStorage: 25000, crystalStorage: 25000, deuteriumStorage: 10000 },
    prerequisites: [],
  },
  {
    id: "reinforced-hull",
    name: "Reinforced Hull Storage",
    description: "Armored resource containers resistant to damage.",
    category: "storage",
    tier: "advanced",
    starbaseTypes: ["defense", "command"],
    maxLevel: 10,
    costs: { metal: 12000, crystal: 6000, deuterium: 1500, credits: 5000 },
    buildTime: 400,
    effects: { metalStorage: 50000, crystalStorage: 50000, deuteriumStorage: 25000 },
    prerequisites: ["cargo-bay"],
  },

  // Defense modules
  {
    id: "laser-turret",
    name: "Laser Defense Turret",
    description: "Point-defense laser system against incoming threats.",
    category: "defense",
    tier: "standard",
    starbaseTypes: ["defense", "mining", "trade"],
    maxLevel: 10,
    costs: { metal: 6000, crystal: 3000, deuterium: 800, credits: 2000 },
    buildTime: 350,
    effects: { defenseLevel: 5 },
    prerequisites: [],
  },
  {
    id: "shield-generator",
    name: "Shield Generator",
    description: "Energy barrier that absorbs incoming damage.",
    category: "defense",
    tier: "advanced",
    starbaseTypes: ["defense", "command", "research"],
    maxLevel: 10,
    costs: { metal: 15000, crystal: 10000, deuterium: 3000, credits: 8000 },
    buildTime: 700,
    effects: { defenseLevel: 15 },
    prerequisites: ["laser-turret"],
  },
  {
    id: "missile-battery",
    name: "Missile Battery",
    description: "Long-range missile defense system.",
    category: "defense",
    tier: "elite",
    starbaseTypes: ["defense", "command"],
    maxLevel: 5,
    costs: { metal: 25000, crystal: 15000, deuterium: 5000, credits: 15000 },
    buildTime: 900,
    effects: { defenseLevel: 25 },
    prerequisites: ["shield-generator"],
  },

  // Offense modules
  {
    id: "beam-platform",
    name: "Beam Weapon Platform",
    description: "Offensive directed-energy weapon system.",
    category: "offense",
    tier: "standard",
    starbaseTypes: ["defense", "shipyard"],
    maxLevel: 10,
    costs: { metal: 8000, crystal: 4000, deuterium: 1500, credits: 3000 },
    buildTime: 400,
    effects: { defenseLevel: 8 },
    prerequisites: [],
  },
  {
    id: "mass-driver",
    name: "Mass Driver Cannon",
    description: "Kinetic impactor weapon for long-range bombardment.",
    category: "offense",
    tier: "advanced",
    starbaseTypes: ["defense", "command"],
    maxLevel: 10,
    costs: { metal: 20000, crystal: 8000, deuterium: 3000, credits: 10000 },
    buildTime: 600,
    effects: { defenseLevel: 12 },
    prerequisites: ["beam-platform"],
  },

  // Support modules
  {
    id: "hangar-bay",
    name: "Expanded Hangar Bay",
    description: "Increases ship docking capacity.",
    category: "support",
    tier: "standard",
    starbaseTypes: ["shipyard", "defense", "command"],
    maxLevel: 5,
    costs: { metal: 10000, crystal: 5000, deuterium: 2000, credits: 5000 },
    buildTime: 500,
    effects: { hangarSlots: 2 },
    prerequisites: [],
  },
  {
    id: "research-lab-module",
    name: "Research Laboratory",
    description: "Adds a research slot to the starbase.",
    category: "support",
    tier: "standard",
    starbaseTypes: ["research", "command"],
    maxLevel: 3,
    costs: { metal: 12000, crystal: 8000, deuterium: 1000, credits: 6000 },
    buildTime: 600,
    effects: { researchSlots: 1 },
    prerequisites: [],
  },
  {
    id: "repair-bay",
    name: "Repair Bay",
    description: "Automated ship repair facility.",
    category: "support",
    tier: "standard",
    starbaseTypes: ["shipyard", "defense"],
    maxLevel: 5,
    costs: { metal: 8000, crystal: 4000, deuterium: 1500, credits: 4000 },
    buildTime: 400,
    effects: { hangarSlots: 1 },
    prerequisites: [],
  },

  // Utility modules
  {
    id: "sensor-array",
    name: "Sensor Array",
    description: "Extended detection range and scanning capability.",
    category: "utility",
    tier: "standard",
    starbaseTypes: ["command", "research", "trade"],
    maxLevel: 5,
    costs: { metal: 5000, crystal: 3000, deuterium: 500, credits: 2000 },
    buildTime: 300,
    effects: { defenseLevel: 2 },
    prerequisites: [],
  },
  {
    id: "comms-relay",
    name: "Communications Relay",
    description: "Boosts coordination and response times.",
    category: "utility",
    tier: "standard",
    starbaseTypes: ["command", "trade"],
    maxLevel: 5,
    costs: { metal: 4000, crystal: 2000, deuterium: 300, credits: 1500 },
    buildTime: 250,
    effects: { defenseLevel: 1 },
    prerequisites: [],
  },
];

export function getStarbaseUpgradeCost(type: StarbaseType, currentLevel: number) {
  const info = STARBASE_TYPES[type];
  const baseCost = 10000;
  const multiplier = Math.pow(1.15, currentLevel) * info.upgradeCostMultiplier;
  return {
    metal: Math.floor(baseCost * multiplier),
    crystal: Math.floor(baseCost * 0.6 * multiplier),
    deuterium: Math.floor(baseCost * 0.3 * multiplier),
    credits: Math.floor(baseCost * 0.5 * multiplier),
  };
}

export function getStarbaseBuildTime(type: StarbaseType, currentLevel: number) {
  const info = STARBASE_TYPES[type];
  return Math.floor(300 * Math.pow(1.1, currentLevel) * info.upgradeCostMultiplier);
}

export function calculateStarbaseStats(type: StarbaseType, level: number, installedModules: Array<{ moduleId: string; level: number }>) {
  const info = STARBASE_TYPES[type];
  const stats = { ...info.baseStats };

  // Apply level scaling
  const levelMultiplier = 1 + (level - 1) * 0.1;
  stats.metalStorage = Math.floor(stats.metalStorage * levelMultiplier);
  stats.crystalStorage = Math.floor(stats.crystalStorage * levelMultiplier);
  stats.deuteriumStorage = Math.floor(stats.deuteriumStorage * levelMultiplier);
  stats.metalProduction = Math.floor(stats.metalProduction * levelMultiplier);
  stats.crystalProduction = Math.floor(stats.crystalProduction * levelMultiplier);
  stats.deuteriumProduction = Math.floor(stats.deuteriumProduction * levelMultiplier);
  stats.defenseLevel = Math.floor(stats.defenseLevel * levelMultiplier);

  // Apply module effects
  for (const installed of installedModules) {
    const module = STARBASE_MODULES.find(m => m.id === installed.moduleId);
    if (!module) continue;
    for (const [key, value] of Object.entries(module.effects)) {
      const k = key as keyof typeof stats;
      if (k in stats && typeof stats[k] === "number") {
        (stats as any)[k] = (stats as any)[k] + value * installed.level;
      }
    }
  }

  return stats;
}

export function getModulesForStarbase(type: StarbaseType) {
  return STARBASE_MODULES.filter(m => m.starbaseTypes.includes(type));
}
