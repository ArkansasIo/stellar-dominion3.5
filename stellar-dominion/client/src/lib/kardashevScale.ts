// Kardashev Scale - Empire Growth System (Level 1-18)
// Represents technological advancement from planetary to galactic/universal control

export type KardashevLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18;

export interface KardashevTier {
  level: KardashevLevel;
  name: string;
  description: string;
  requirementsMetal: number;
  requirementsCrystal: number;
  requirementsDeuterium: number;
  requiredResearchPoints: number;
  bonuses: {
    resourceProduction: number; // percentage
    energyProduction: number;
    buildSpeed: number;
    researchSpeed: number;
    fleetPower: number;
    defensePower: number;
    maxPlanets: number;
    maxFleets: number;
    maxBuildings: number;
    maxResearch: number;
  };
  effects: string[];
  unlocks: string[];
}

export const KARDASHEV_SCALE: Record<KardashevLevel, KardashevTier> = {
  1: {
    level: 1,
    name: "Planetary Settler",
    description: "Initial colonization of a single planet with basic resource extraction.",
    requirementsMetal: 0,
    requirementsCrystal: 0,
    requirementsDeuterium: 0,
    requiredResearchPoints: 0,
    bonuses: {
      resourceProduction: 0,
      energyProduction: 0,
      buildSpeed: 0,
      researchSpeed: 0,
      fleetPower: 0,
      defensePower: 0,
      maxPlanets: 1,
      maxFleets: 1,
      maxBuildings: 5,
      maxResearch: 3
    },
    effects: ["Basic Resource Extraction", "Single Planet Control"],
    unlocks: ["Basic Mining", "Robotics Factory"]
  },
  2: {
    level: 2,
    name: "Local Planetary Control",
    description: "Mastery of a single planet's resources with multiple extraction facilities.",
    requirementsMetal: 10000,
    requirementsCrystal: 5000,
    requirementsDeuterium: 1000,
    requiredResearchPoints: 100,
    bonuses: {
      resourceProduction: 10,
      energyProduction: 10,
      buildSpeed: 5,
      researchSpeed: 5,
      fleetPower: 5,
      defensePower: 5,
      maxPlanets: 1,
      maxFleets: 2,
      maxBuildings: 10,
      maxResearch: 5
    },
    effects: ["Enhanced Production", "Planetary Shields"],
    unlocks: ["Advanced Mining", "Energy Technology"]
  },
  3: {
    level: 3,
    name: "System Control",
    description: "Control over multiple planets in a single star system.",
    requirementsMetal: 50000,
    requirementsCrystal: 30000,
    requirementsDeuterium: 10000,
    requiredResearchPoints: 500,
    bonuses: {
      resourceProduction: 20,
      energyProduction: 20,
      buildSpeed: 10,
      researchSpeed: 10,
      fleetPower: 15,
      defensePower: 15,
      maxPlanets: 3,
      maxFleets: 5,
      maxBuildings: 20,
      maxResearch: 10
    },
    effects: ["System-wide Network", "Faster Communications"],
    unlocks: ["Shipyard Expansion", "Fleet Commands"]
  },
  4: {
    level: 4,
    name: "Sector Dominance",
    description: "Control of multiple systems within a galactic sector.",
    requirementsMetal: 200000,
    requirementsCrystal: 150000,
    requirementsDeuterium: 50000,
    requiredResearchPoints: 2000,
    bonuses: {
      resourceProduction: 35,
      energyProduction: 35,
      buildSpeed: 20,
      researchSpeed: 20,
      fleetPower: 30,
      defensePower: 30,
      maxPlanets: 8,
      maxFleets: 15,
      maxBuildings: 40,
      maxResearch: 20
    },
    effects: ["Sector Trade Routes", "Inter-system Logistics"],
    unlocks: ["Warp Technology", "Terraform Ability"]
  },
  5: {
    level: 5,
    name: "Galactic Frontier",
    description: "Presence across multiple sectors with limited galactic influence.",
    requirementsMetal: 800000,
    requirementsCrystal: 600000,
    requirementsDeuterium: 200000,
    requiredResearchPoints: 8000,
    bonuses: {
      resourceProduction: 50,
      energyProduction: 50,
      buildSpeed: 35,
      researchSpeed: 35,
      fleetPower: 50,
      defensePower: 50,
      maxPlanets: 20,
      maxFleets: 40,
      maxBuildings: 80,
      maxResearch: 35
    },
    effects: ["Galactic Database Access", "Remote Mining"],
    unlocks: ["Megastructures", "Advanced AI"]
  },
  6: {
    level: 6,
    name: "Regional Power",
    description: "Significant influence across a galactic region with stable supply chains.",
    requirementsMetal: 3000000,
    requirementsCrystal: 2500000,
    requirementsDeuterium: 1000000,
    requiredResearchPoints: 30000,
    bonuses: {
      resourceProduction: 70,
      energyProduction: 70,
      buildSpeed: 50,
      researchSpeed: 50,
      fleetPower: 80,
      defensePower: 80,
      maxPlanets: 50,
      maxFleets: 100,
      maxBuildings: 150,
      maxResearch: 60
    },
    effects: ["Monopoly Pricing", "Trade Dominance"],
    unlocks: ["Dyson Sphere", "Quantum Computing"]
  },
  7: {
    level: 7,
    name: "Galactic Hegemon",
    description: "Control of majority of a single galaxy with near-absolute authority.",
    requirementsMetal: 12000000,
    requirementsCrystal: 10000000,
    requirementsDeuterium: 5000000,
    requiredResearchPoints: 100000,
    bonuses: {
      resourceProduction: 100,
      energyProduction: 100,
      buildSpeed: 75,
      researchSpeed: 75,
      fleetPower: 120,
      defensePower: 120,
      maxPlanets: 150,
      maxFleets: 300,
      maxBuildings: 300,
      maxResearch: 100
    },
    effects: ["Galactic Emperor", "Absolute Command"],
    unlocks: ["Ring World", "Stellar Engineering"]
  },
  8: {
    level: 8,
    name: "Multi-Galactic Empire",
    description: "Control of multiple galaxies and inter-galactic trade networks.",
    requirementsMetal: 50000000,
    requirementsCrystal: 40000000,
    requirementsDeuterium: 20000000,
    requiredResearchPoints: 300000,
    bonuses: {
      resourceProduction: 150,
      energyProduction: 150,
      buildSpeed: 100,
      researchSpeed: 100,
      fleetPower: 180,
      defensePower: 180,
      maxPlanets: 300,
      maxFleets: 600,
      maxBuildings: 500,
      maxResearch: 150
    },
    effects: ["Intergalactic Authority", "Dimensional Awareness"],
    unlocks: ["Black Hole Harvesting", "Time Manipulation"]
  },
  9: {
    level: 9,
    name: "Local Universe Presence",
    description: "Expansion into neighboring universe regions with inter-dimensional tech.",
    requirementsMetal: 200000000,
    requirementsCrystal: 150000000,
    requirementsDeuterium: 100000000,
    requiredResearchPoints: 1000000,
    bonuses: {
      resourceProduction: 200,
      energyProduction: 200,
      buildSpeed: 150,
      researchSpeed: 150,
      fleetPower: 250,
      defensePower: 250,
      maxPlanets: 500,
      maxFleets: 1000,
      maxBuildings: 800,
      maxResearch: 200
    },
    effects: ["Pocket Dimension Creation", "Reality Bending"],
    unlocks: ["Matter-Energy Conversion", "Universal Constants Control"]
  },
  10: {
    level: 10,
    name: "Observable Universe Control",
    description: "Dominance across the observable universe with absolute power.",
    requirementsMetal: 1000000000,
    requirementsCrystal: 800000000,
    requirementsDeuterium: 500000000,
    requiredResearchPoints: 3000000,
    bonuses: {
      resourceProduction: 300,
      energyProduction: 300,
      buildSpeed: 200,
      researchSpeed: 200,
      fleetPower: 350,
      defensePower: 350,
      maxPlanets: 1000,
      maxFleets: 2000,
      maxBuildings: 1500,
      maxResearch: 300
    },
    effects: ["Omniscience Partial", "Physical Law Manipulation"],
    unlocks: ["Multiverse Gateway", "Singularity Weapons"]
  },
  11: {
    level: 11,
    name: "Multiverse Entity",
    description: "Existence across multiple parallel universes with quantum entanglement.",
    requirementsMetal: 5000000000,
    requirementsCrystal: 4000000000,
    requirementsDeuterium: 2000000000,
    requiredResearchPoints: 10000000,
    bonuses: {
      resourceProduction: 400,
      energyProduction: 400,
      buildSpeed: 300,
      researchSpeed: 300,
      fleetPower: 500,
      defensePower: 500,
      maxPlanets: 2000,
      maxFleets: 5000,
      maxBuildings: 2500,
      maxResearch: 400
    },
    effects: ["Reality Anchoring", "Probability Manipulation"],
    unlocks: ["Cosmic String Weapons", "Meta-dimensional Vaults"]
  },
  12: {
    level: 12,
    name: "Cosmic Ascendant",
    description: "Control over fundamental cosmic structures and universal expansion.",
    requirementsMetal: 20000000000,
    requirementsCrystal: 15000000000,
    requirementsDeuterium: 10000000000,
    requiredResearchPoints: 30000000,
    bonuses: {
      resourceProduction: 500,
      energyProduction: 500,
      buildSpeed: 400,
      researchSpeed: 400,
      fleetPower: 700,
      defensePower: 700,
      maxPlanets: 5000,
      maxFleets: 10000,
      maxBuildings: 4000,
      maxResearch: 500
    },
    effects: ["Entropy Control", "Gravity Mastery"],
    unlocks: ["Big Bang Simulation", "Artificial Universe Creation"]
  },
  13: {
    level: 13,
    name: "Supracosmic Force",
    description: "Transcendence beyond physical laws with reality-warping abilities.",
    requirementsMetal: 100000000000,
    requirementsCrystal: 80000000000,
    requirementsDeuterium: 50000000000,
    requiredResearchPoints: 100000000,
    bonuses: {
      resourceProduction: 600,
      energyProduction: 600,
      buildSpeed: 500,
      researchSpeed: 500,
      fleetPower: 1000,
      defensePower: 1000,
      maxPlanets: 10000,
      maxFleets: 20000,
      maxBuildings: 6000,
      maxResearch: 600
    },
    effects: ["Causality Alteration", "Timeline Branching"],
    unlocks: ["Omnipotence Engine", "Consciousness Expansion"]
  },
  14: {
    level: 14,
    name: "Meta-Universal Collective",
    description: "Integration with multiple meta-universes and higher dimensions.",
    requirementsMetal: 500000000000,
    requirementsCrystal: 400000000000,
    requirementsDeuterium: 300000000000,
    requiredResearchPoints: 300000000,
    bonuses: {
      resourceProduction: 750,
      energyProduction: 750,
      buildSpeed: 600,
      researchSpeed: 600,
      fleetPower: 1250,
      defensePower: 1250,
      maxPlanets: 20000,
      maxFleets: 50000,
      maxBuildings: 10000,
      maxResearch: 750
    },
    effects: ["Dimension Merging", "Hyperspace Tunneling"],
    unlocks: ["Verse Engine", "Thought Manifestation"]
  },
  15: {
    level: 15,
    name: "Transcendental Being",
    description: "Existence as pure energy and information across infinite dimensions.",
    requirementsMetal: 2000000000000,
    requirementsCrystal: 1500000000000,
    requirementsDeuterium: 1000000000000,
    requiredResearchPoints: 1000000000,
    bonuses: {
      resourceProduction: 1000,
      energyProduction: 1000,
      buildSpeed: 800,
      researchSpeed: 800,
      fleetPower: 1500,
      defensePower: 1500,
      maxPlanets: 50000,
      maxFleets: 100000,
      maxBuildings: 20000,
      maxResearch: 1000
    },
    effects: ["Omniscient Awareness", "Temporal Mastery"],
    unlocks: ["Reality Editor", "Meta-Consciousness"]
  },
  16: {
    level: 16,
    name: "Universal Architect",
    description: "Power to design and create universes with precise specifications.",
    requirementsMetal: 10000000000000,
    requirementsCrystal: 8000000000000,
    requirementsDeuterium: 5000000000000,
    requiredResearchPoints: 3000000000,
    bonuses: {
      resourceProduction: 1250,
      energyProduction: 1250,
      buildSpeed: 1000,
      researchSpeed: 1000,
      fleetPower: 2000,
      defensePower: 2000,
      maxPlanets: 100000,
      maxFleets: 200000,
      maxBuildings: 50000,
      maxResearch: 1250
    },
    effects: ["Cosmic Engineering", "Physics Configuration"],
    unlocks: ["Godhood Threshold", "Infinite Expansion"]
  },
  17: {
    level: 17,
    name: "Godlike Entity",
    description: "Near-omnipotent status with control over reality itself.",
    requirementsMetal: 50000000000000,
    requirementsCrystal: 40000000000000,
    requirementsDeuterium: 30000000000000,
    requiredResearchPoints: 10000000000,
    bonuses: {
      resourceProduction: 1500,
      energyProduction: 1500,
      buildSpeed: 1250,
      researchSpeed: 1250,
      fleetPower: 2500,
      defensePower: 2500,
      maxPlanets: 200000,
      maxFleets: 500000,
      maxBuildings: 100000,
      maxResearch: 1500
    },
    effects: ["Reality Weaving", "Existence Guarantee"],
    unlocks: ["Ascension", "Infinity Achieved"]
  },
  18: {
    level: 18,
    name: "Supreme Omnipotent",
    description: "Ultimate transcendence - complete mastery of all existence and dimensions.",
    requirementsMetal: 500000000000000,
    requirementsCrystal: 400000000000000,
    requirementsDeuterium: 300000000000000,
    requiredResearchPoints: 100000000000,
    bonuses: {
      resourceProduction: 2000,
      energyProduction: 2000,
      buildSpeed: 2000,
      researchSpeed: 2000,
      fleetPower: 3000,
      defensePower: 3000,
      maxPlanets: 999999,
      maxFleets: 999999,
      maxBuildings: 999999,
      maxResearch: 2000
    },
    effects: ["Unlimited Power", "Eternal Existence", "Infinite Potential"],
    unlocks: ["Victory Condition Met"]
  }
};

export function getKardashevLevel(level: number): KardashevLevel {
  if (level < 1) return 1;
  if (level > 18) return 18;
  return level as KardashevLevel;
}

export function getKardashevTier(level: KardashevLevel): KardashevTier {
  return KARDASHEV_SCALE[level as unknown as KardashevLevel];
}

export function calculateProgressToNext(current: KardashevLevel, metal: number, crystal: number, deuterium: number): number {
  if (current === 18) return 100;
  const nextLevel = (current + 1) as KardashevLevel;
  const requirements = KARDASHEV_SCALE[nextLevel];
  const metalProgress = Math.min(metal / requirements.requirementsMetal, 1);
  const crystalProgress = Math.min(crystal / requirements.requirementsCrystal, 1);
  const deuteriumProgress = Math.min(deuterium / requirements.requirementsDeuterium, 1);
  return Math.round((metalProgress + crystalProgress + deuteriumProgress) / 3 * 100);
}
