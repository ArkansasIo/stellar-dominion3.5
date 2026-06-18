export interface Research {
  id: string;
  name: string;
  description: string;
  category: "drive" | "weapon" | "shield" | "armor" | "energy" | "computer" | "esp" | "upgrade";
  level: number;
  cost: { metal: number; crystal: number; deuterium: number };
  time: number; // seconds
  prerequisites?: { [key: string]: number };
  bonus?: { [key: string]: number | string };
}

export const OGAME_RESEARCH: Research[] = [
  // Energy Technologies
  {
    id: "energyTech",
    name: "Energy Technology",
    description: "Increases energy production.",
    category: "energy",
    level: 1,
    cost: { metal: 0, crystal: 400, deuterium: 0 },
    time: 54,
    bonus: { energyProduction: "10% per level" }
  },
  {
    id: "plasmaTech",
    name: "Plasma Technology",
    description: "Advanced energy techniques.",
    category: "energy",
    level: 1,
    cost: { metal: 2000, crystal: 4000, deuterium: 600 },
    time: 54,
    prerequisites: { energyTech: 6 },
    bonus: { energyProduction: "20% per level" }
  },

  // Weapon Systems
  {
    id: "weaponsTech",
    name: "Weapons Technology",
    description: "Improves all ship attack.",
    category: "weapon",
    level: 1,
    cost: { metal: 400, crystal: 0, deuterium: 0 },
    time: 54,
    bonus: { shipAttack: "10% per level" }
  },
  {
    id: "shieldingTech",
    name: "Shielding Technology",
    description: "Improves all ship defense.",
    category: "shield",
    level: 1,
    cost: { metal: 200, crystal: 600, deuterium: 0 },
    time: 54,
    bonus: { shipDefense: "10% per level" }
  },
  {
    id: "armourTech",
    name: "Armour Technology",
    description: "Improves ship hull strength.",
    category: "armor",
    level: 1,
    cost: { metal: 1000, crystal: 0, deuterium: 0 },
    time: 54,
    bonus: { shipHull: "10% per level" }
  },

  // Drive Technologies
  {
    id: "combustionDrive",
    name: "Combustion Drive",
    description: "Basic propulsion system.",
    category: "drive",
    level: 1,
    cost: { metal: 400, crystal: 0, deuterium: 600 },
    time: 54,
    bonus: { shipSpeed: "+" }
  },
  {
    id: "impulseDrive",
    name: "Impulse Drive",
    description: "Advanced propulsion.",
    category: "drive",
    level: 1,
    cost: { metal: 2000, crystal: 4000, deuterium: 600 },
    time: 54,
    prerequisites: { combustionDrive: 5 },
    bonus: { shipSpeed: "++" }
  },
  {
    id: "hyperspaceDrive",
    name: "Hyperspace Drive",
    description: "Warps through space.",
    category: "drive",
    level: 1,
    cost: { metal: 10000, crystal: 20000, deuterium: 6000 },
    time: 54,
    prerequisites: { impulseDrive: 5 },
    bonus: { shipSpeed: "+++", fuelConsumption: "-50%" }
  },

  // Computer Technology
  {
    id: "computerTech",
    name: "Computer Technology",
    description: "Improves fleet coordination.",
    category: "computer",
    level: 1,
    cost: { metal: 0, crystal: 400, deuterium: 600 },
    time: 54,
    bonus: { fleetSize: "+5 slots per level" }
  },
  {
    id: "aiTech",
    name: "Artificial Intelligence",
    description: "Advanced computing systems.",
    category: "computer",
    level: 1,
    cost: { metal: 5000, crystal: 10000, deuterium: 5000 },
    time: 54,
    prerequisites: { computerTech: 8 },
    bonus: { fleetSize: "+10 slots per level", combatEfficiency: "+10%" }
  },

  // Espionage Technology
  {
    id: "espionageTech",
    name: "Espionage Technology",
    description: "Enables spy probes.",
    category: "esp",
    level: 1,
    cost: { metal: 200, crystal: 1000, deuterium: 200 },
    time: 54,
    bonus: { spyCapacity: "+10% per level" }
  },
  {
    id: "interplanetaryResearch",
    name: "Interplanetary Research Network",
    description: "Trade research with alliance.",
    category: "esp",
    level: 1,
    cost: { metal: 30000, crystal: 40000, deuterium: 30000 },
    time: 54,
    prerequisites: { espionageTech: 4, computerTech: 8 }
  },

  // Hyperspace Research
  {
    id: "hyperspaceTech",
    name: "Hyperspace Technology",
    description: "Gateway to distant galaxies.",
    category: "upgrade",
    level: 1,
    cost: { metal: 0, crystal: 4000, deuterium: 0 },
    time: 54,
    prerequisites: { impulseDrive: 3 },
    bonus: { galaxyAccess: "+1 galaxy per level" }
  },

  // Advanced Technologies
  {
    id: "gravitonTech",
    name: "Graviton Technology",
    description: "Harnesses gravity.",
    category: "upgrade",
    level: 1,
    cost: { metal: 0, crystal: 300000, deuterium: 0 },
    time: 54,
    prerequisites: { hyperspaceTech: 12 },
    bonus: { jumpGateCapacity: "+10%" }
  },
  {
    id: "plasmaTechnology",
    name: "Plasma Technology",
    description: "Advanced weaponry.",
    category: "weapon",
    level: 1,
    cost: { metal: 20000, crystal: 40000, deuterium: 30000 },
    time: 54,
    prerequisites: { energyTech: 8, weaponsTech: 5 },
    bonus: { plasmaWeapons: "Enabled" }
  },

  // Support Research
  {
    id: "astrophysics",
    name: "Astrophysics",
    description: "Explore deeper space.",
    category: "upgrade",
    level: 1,
    cost: { metal: 1000, crystal: 8000, deuterium: 4000 },
    time: 54,
    prerequisites: { espionageTech: 4 },
    bonus: { explorationRange: "+1 system per level" }
  },
  {
    id: "quantumComputing",
    name: "Quantum Computing",
    description: "Breakthrough computing.",
    category: "computer",
    level: 1,
    cost: { metal: 50000, crystal: 100000, deuterium: 50000 },
    time: 54,
    prerequisites: { computerTech: 10, plasmaTech: 8 },
    bonus: { researchSpeed: "+20%", combatCalculations: "+50%" }
  },

  // Misc Research
  {
    id: "ionTech",
    name: "Ion Technology",
    description: "Energy weapons research.",
    category: "weapon",
    level: 1,
    cost: { metal: 1000, crystal: 4000, deuterium: 0 },
    time: 54,
    prerequisites: { energyTech: 3, weaponsTech: 2 },
    bonus: { ionCannonDamage: "+10% per level" }
  },
  {
    id: "laserTech",
    name: "Laser Technology",
    description: "Laser beam weapons.",
    category: "weapon",
    level: 1,
    cost: { metal: 200, crystal: 100, deuterium: 0 },
    time: 54,
    prerequisites: { energyTech: 2 },
    bonus: { laserDamage: "+10% per level" }
  },
];

export const getResearchCost = (research: Research, level: number) => {
  const multiplier = Math.pow(2, level - 1);
  return {
    metal: Math.ceil(research.cost.metal * multiplier),
    crystal: Math.ceil(research.cost.crystal * multiplier),
    deuterium: Math.ceil(research.cost.deuterium * multiplier),
  };
};

export const getResearchTime = (research: Research, level: number, labLevel: number = 1) => {
  const multiplier = Math.pow(1.75, level - 1);
  const baseTime = research.time * multiplier;
  const speedup = 1 - (labLevel * 0.01); // 1% per lab level
  return Math.ceil(baseTime * speedup);
};

export const canResearch = (research: Research, completedResearch: { [key: string]: number }): boolean => {
  if (!research.prerequisites) return true;
  return Object.entries(research.prerequisites).every(
    ([id, requiredLevel]) => (completedResearch[id] || 0) >= requiredLevel
  );
};
