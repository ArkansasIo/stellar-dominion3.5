// Enhanced Technology System with Types, Classes, Rarity, and Effects

export type TechRarity = "common" | "uncommon" | "rare" | "epic" | "legendary" | "mythic" | "transcendent";
export type TechClass = "energy" | "propulsion" | "weapons" | "defense" | "production" | "research" | "engineering" | "quantum" | "cosmic";
export type TechStatus = "locked" | "available" | "researching" | "completed" | "obsolete";

export interface TechEffect {
  type: "bonus" | "unlock" | "synergy" | "passive" | "active";
  value: number;
  description: string;
}

export interface TechAttribute {
  name: string;
  type: "offensive" | "defensive" | "economic" | "scientific" | "diplomatic";
  bonus: number;
  level: number;
}

export interface Technology {
  id: string;
  name: string;
  description: string;
  rarity: TechRarity;
  class: TechClass;
  level: number; // 1-18 aligned with Kardashev scale
  status: TechStatus;
  
  // Prerequisites
  requiresResearch: string[];
  requiresKardashevLevel: number;
  
  // Costs
  researchTime: number; // in seconds
  metalCost: number;
  crystalCost: number;
  deuteriumCost: number;
  
  // Effects
  effects: TechEffect[];
  attributes: TechAttribute[];
  
  // Bonuses
  stats: {
    energyProduction?: number;
    energyConsumption?: number;
    speed?: number;
    damage?: number;
    armor?: number;
    resourceProduction?: number;
    researchSpeed?: number;
    buildSpeed?: number;
  };
  
  // Synergies
  synergizesWith: string[];
  synergyBonus: number; // percentage
}

export const TECHNOLOGIES: Record<string, Technology> = {
  // Energy Technologies (Tier 1)
  "energyTech1": {
    id: "energyTech1",
    name: "Solar Panel Optimization",
    description: "Harness solar energy more efficiently with advanced photovoltaic arrays.",
    rarity: "common",
    class: "energy",
    level: 1,
    status: "available",
    requiresResearch: [],
    requiresKardashevLevel: 1,
    researchTime: 300,
    metalCost: 400,
    crystalCost: 200,
    deuteriumCost: 0,
    effects: [
      { type: "bonus", value: 10, description: "Energy production +10%" },
      { type: "passive", value: 0, description: "Unlocks solar farms" }
    ],
    attributes: [
      { name: "Solar Efficiency", type: "economic", bonus: 10, level: 1 }
    ],
    stats: { energyProduction: 10 },
    synergizesWith: ["energyTech2"],
    synergyBonus: 5
  },
  
  // Propulsion Technologies
  "propulsionTech1": {
    id: "propulsionTech1",
    name: "Chemical Rocket Drives",
    description: "Classical chemical propulsion for interplanetary travel.",
    rarity: "uncommon",
    class: "propulsion",
    level: 1,
    status: "available",
    requiresResearch: [],
    requiresKardashevLevel: 1,
    researchTime: 600,
    metalCost: 800,
    crystalCost: 400,
    deuteriumCost: 200,
    effects: [
      { type: "bonus", value: 5, description: "Fleet speed +5%" },
      { type: "unlock", value: 0, description: "Enables basic space travel" }
    ],
    attributes: [
      { name: "Thrust", type: "offensive", bonus: 5, level: 1 },
      { name: "Efficiency", type: "economic", bonus: 3, level: 1 }
    ],
    stats: { speed: 5 },
    synergizesWith: ["propulsionTech2", "energyTech1"],
    synergyBonus: 8
  },

  // Weapons Technologies
  "weaponsTech1": {
    id: "weaponsTech1",
    name: "Laser Cannons",
    description: "Beam weapons utilizing focused light energy for precise targeting.",
    rarity: "rare",
    class: "weapons",
    level: 2,
    status: "available",
    requiresResearch: ["energyTech1"],
    requiresKardashevLevel: 2,
    researchTime: 1200,
    metalCost: 1200,
    crystalCost: 800,
    deuteriumCost: 400,
    effects: [
      { type: "bonus", value: 15, description: "Weapon damage +15%" },
      { type: "synergy", value: 0, description: "Synergizes with energy tech" }
    ],
    attributes: [
      { name: "Accuracy", type: "offensive", bonus: 20, level: 2 },
      { name: "Damage", type: "offensive", bonus: 15, level: 2 }
    ],
    stats: { damage: 15 },
    synergizesWith: ["energyTech1", "weaponsTech2"],
    synergyBonus: 12
  },

  // Defense Technologies
  "defenseTech1": {
    id: "defenseTech1",
    name: "Shield Generators",
    description: "Energy shield technology to protect against hostile attacks.",
    rarity: "epic",
    class: "defense",
    level: 3,
    status: "available",
    requiresResearch: ["energyTech1", "weaponsTech1"],
    requiresKardashevLevel: 3,
    researchTime: 2400,
    metalCost: 2000,
    crystalCost: 1500,
    deuteriumCost: 800,
    effects: [
      { type: "bonus", value: 20, description: "Defense power +20%" },
      { type: "passive", value: 0, description: "Reduces damage taken" }
    ],
    attributes: [
      { name: "Shield Strength", type: "defensive", bonus: 20, level: 3 },
      { name: "Recharge Rate", type: "defensive", bonus: 15, level: 3 }
    ],
    stats: { armor: 20 },
    synergizesWith: ["energyTech1", "defenseTech2"],
    synergyBonus: 10
  },

  // Production Technologies
  "productionTech1": {
    id: "productionTech1",
    name: "Automated Mining Drones",
    description: "Robotic systems for autonomous resource extraction.",
    rarity: "uncommon",
    class: "production",
    level: 2,
    status: "available",
    requiresResearch: [],
    requiresKardashevLevel: 2,
    researchTime: 800,
    metalCost: 600,
    crystalCost: 300,
    deuteriumCost: 100,
    effects: [
      { type: "bonus", value: 12, description: "Resource production +12%" },
      { type: "passive", value: 0, description: "Reduces labor costs" }
    ],
    attributes: [
      { name: "Efficiency", type: "economic", bonus: 12, level: 2 },
      { name: "Capacity", type: "economic", bonus: 8, level: 2 }
    ],
    stats: { resourceProduction: 12 },
    synergizesWith: ["productionTech2", "energyTech1"],
    synergyBonus: 15
  },

  // Research Technologies
  "researchTech1": {
    id: "researchTech1",
    name: "Advanced Computing",
    description: "Quantum-assisted computing for accelerated research processes.",
    rarity: "epic",
    class: "research",
    level: 4,
    status: "available",
    requiresResearch: ["energyTech1"],
    requiresKardashevLevel: 4,
    researchTime: 3600,
    metalCost: 3000,
    crystalCost: 2500,
    deuteriumCost: 1500,
    effects: [
      { type: "bonus", value: 25, description: "Research speed +25%" },
      { type: "synergy", value: 0, description: "Boosts all tech research" }
    ],
    attributes: [
      { name: "Processing Power", type: "scientific", bonus: 25, level: 4 },
      { name: "Innovation Rate", type: "scientific", bonus: 15, level: 4 }
    ],
    stats: { researchSpeed: 25 },
    synergizesWith: ["researchTech2", "energyTech1"],
    synergyBonus: 20
  },

  // Quantum Technologies
  "quantumTech1": {
    id: "quantumTech1",
    name: "Quantum Entanglement Communication",
    description: "Instantaneous communication across vast distances via quantum states.",
    rarity: "legendary",
    class: "quantum",
    level: 8,
    status: "locked",
    requiresResearch: ["researchTech1", "propulsionTech1"],
    requiresKardashevLevel: 8,
    researchTime: 18000,
    metalCost: 50000,
    crystalCost: 40000,
    deuteriumCost: 20000,
    effects: [
      { type: "unlock", value: 0, description: "Enables instant communication" },
      { type: "active", value: 0, description: "Reduce latency to 0ms" }
    ],
    attributes: [
      { name: "Communication Speed", type: "scientific", bonus: 100, level: 8 },
      { name: "Range", type: "scientific", bonus: 999, level: 8 }
    ],
    stats: { speed: 50 },
    synergizesWith: ["quantumTech2", "researchTech1"],
    synergyBonus: 35
  },

  // Cosmic Technologies
  "cosmicTech1": {
    id: "cosmicTech1",
    name: "Dyson Sphere Construction",
    description: "Megastructure technology to harness the power of a star completely.",
    rarity: "mythic",
    class: "cosmic",
    level: 12,
    status: "locked",
    requiresResearch: ["quantumTech1", "energyTech1"],
    requiresKardashevLevel: 12,
    researchTime: 86400,
    metalCost: 1000000,
    crystalCost: 800000,
    deuteriumCost: 500000,
    effects: [
      { type: "unlock", value: 0, description: "Enables Dyson Sphere construction" },
      { type: "bonus", value: 500, description: "Energy production x5" }
    ],
    attributes: [
      { name: "Power Output", type: "economic", bonus: 500, level: 12 },
      { name: "Coverage", type: "economic", bonus: 100, level: 12 }
    ],
    stats: { energyProduction: 500 },
    synergizesWith: ["cosmicTech2"],
    synergyBonus: 50
  }
};

export function getTechnologyRarityColor(rarity: TechRarity): string {
  const colors: Record<TechRarity, string> = {
    common: "text-slate-600",
    uncommon: "text-green-600",
    rare: "text-blue-600",
    epic: "text-purple-600",
    legendary: "text-yellow-600",
    mythic: "text-red-600",
    transcendent: "text-pink-600"
  };
  return colors[rarity];
}

export function getTechnologyRarityBg(rarity: TechRarity): string {
  const colors: Record<TechRarity, string> = {
    common: "bg-slate-100",
    uncommon: "bg-green-100",
    rare: "bg-blue-100",
    epic: "bg-purple-100",
    legendary: "bg-yellow-100",
    mythic: "bg-red-100",
    transcendent: "bg-pink-100"
  };
  return colors[rarity];
}

export function calculateSynergyBonus(techIds: string[]): number {
  let totalBonus = 0;
  for (const id of techIds) {
    const tech = TECHNOLOGIES[id];
    if (tech) {
      for (const synergy of tech.synergizesWith) {
        if (techIds.includes(synergy)) {
          totalBonus += tech.synergyBonus;
        }
      }
    }
  }
  return totalBonus;
}
