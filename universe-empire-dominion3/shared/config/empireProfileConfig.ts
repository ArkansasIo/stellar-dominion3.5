export interface EmpireAttribute {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  maxLevel: number;
  baseCost: number;
  costMultiplier: number;
  effects: EmpireAttributeEffect[];
}

export interface EmpireAttributeEffect {
  type: "bonus" | "cap" | "unlock";
  target: string;
  value: number;
  description: string;
}

export const EMPIRE_ATTRIBUTES: EmpireAttribute[] = [
  {
    id: "military",
    name: "Military",
    description: "Overall military strength, fleet command capacity, and combat readiness. Higher levels unlock advanced fleet formations and increase ship damage output.",
    icon: "Swords",
    color: "text-red-500",
    maxLevel: 100,
    baseCost: 500,
    costMultiplier: 1.15,
    effects: [
      { type: "bonus", target: "fleetDamage", value: 0.02, description: "+2% Fleet Damage per level" },
      { type: "bonus", target: "shipCapacity", value: 1, description: "+1 Ship Slot per 10 levels" },
      { type: "unlock", target: "fleetFormations", value: 50, description: "Unlocks Advanced Formations at level 50" },
    ],
  },
  {
    id: "economy",
    name: "Economy",
    description: "Economic output, trade route efficiency, and resource generation rates. Higher levels increase resource production and reduce trade tariffs.",
    icon: "Coins",
    color: "text-yellow-500",
    maxLevel: 100,
    baseCost: 400,
    costMultiplier: 1.15,
    effects: [
      { type: "bonus", target: "resourceProduction", value: 0.03, description: "+3% Resource Production per level" },
      { type: "bonus", target: "tradeEfficiency", value: 0.02, description: "+2% Trade Efficiency per level" },
      { type: "unlock", target: "advancedTradeRoutes", value: 40, description: "Unlocks Advanced Trade Routes at level 40" },
    ],
  },
  {
    id: "research",
    name: "Research",
    description: "Scientific advancement, technology speed, and breakthrough chance. Higher levels accelerate research speed and increase discovery probability.",
    icon: "FlaskConical",
    color: "text-blue-500",
    maxLevel: 100,
    baseCost: 450,
    costMultiplier: 1.15,
    effects: [
      { type: "bonus", target: "researchSpeed", value: 0.025, description: "+2.5% Research Speed per level" },
      { type: "bonus", target: "breakthroughChance", value: 0.01, description: "+1% Breakthrough Chance per level" },
      { type: "unlock", target: "quantumComputing", value: 60, description: "Unlocks Quantum Computing at level 60" },
    ],
  },
  {
    id: "industry",
    name: "Industry",
    description: "Construction capacity, building speed, and production throughput. Higher levels reduce build times and increase facility output.",
    icon: "Factory",
    color: "text-orange-500",
    maxLevel: 100,
    baseCost: 350,
    costMultiplier: 1.15,
    effects: [
      { type: "bonus", target: "buildSpeed", value: 0.03, description: "+3% Build Speed per level" },
      { type: "bonus", target: "facilityOutput", value: 0.02, description: "+2% Facility Output per level" },
      { type: "unlock", target: "megastructureAccess", value: 70, description: "Unlocks Megastructure Access at level 70" },
    ],
  },
  {
    id: "diplomacy",
    name: "Diplomacy",
    description: "Alliance influence, negotiation power, and diplomatic reach. Higher levels unlock alliance perks and improve faction reputation gains.",
    icon: "Handshake",
    color: "text-purple-500",
    maxLevel: 100,
    baseCost: 300,
    costMultiplier: 1.15,
    effects: [
      { type: "bonus", target: "allianceInfluence", value: 0.03, description: "+3% Alliance Influence per level" },
      { type: "bonus", target: "reputationGain", value: 0.02, description: "+2% Reputation Gain per level" },
      { type: "unlock", target: "embassyNetwork", value: 45, description: "Unlocks Embassy Network at level 45" },
    ],
  },
  {
    id: "espionage",
    name: "Espionage",
    description: "Intelligence gathering, sabotage capability, and covert operations. Higher levels improve spy success rates and reduce detection chance.",
    icon: "Eye",
    color: "text-emerald-500",
    maxLevel: 100,
    baseCost: 350,
    costMultiplier: 1.15,
    effects: [
      { type: "bonus", target: "spySuccessRate", value: 0.02, description: "+2% Spy Success Rate per level" },
      { type: "bonus", target: "detectionReduction", value: 0.015, description: "+1.5% Detection Reduction per level" },
      { type: "unlock", target: "blackOps", value: 55, description: "Unlocks Black Operations at level 55" },
    ],
  },
  {
    id: "exploration",
    name: "Exploration",
    description: "Scout range, discovery rate, and frontier expansion. Higher levels reveal more of the map and increase anomaly detection.",
    icon: "Compass",
    color: "text-cyan-500",
    maxLevel: 100,
    baseCost: 300,
    costMultiplier: 1.15,
    effects: [
      { type: "bonus", target: "scoutRange", value: 0.03, description: "+3% Scout Range per level" },
      { type: "bonus", target: "anomalyDetection", value: 0.02, description: "+2% Anomaly Detection per level" },
      { type: "unlock", target: "deepSpaceScanning", value: 35, description: "Unlocks Deep Space Scanning at level 35" },
    ],
  },
  {
    id: "governance",
    name: "Governance",
    description: "Administrative efficiency, stability control, and policy effectiveness. Higher levels improve tax revenue and reduce corruption.",
    icon: "Landmark",
    color: "text-indigo-500",
    maxLevel: 100,
    baseCost: 250,
    costMultiplier: 1.15,
    effects: [
      { type: "bonus", target: "taxRevenue", value: 0.025, description: "+2.5% Tax Revenue per level" },
      { type: "bonus", target: "corruptionReduction", value: 0.02, description: "+2% Corruption Reduction per level" },
      { type: "unlock", target: "imperialDecree", value: 50, description: "Unlocks Imperial Decree at level 50" },
    ],
  },
  {
    id: "innovation",
    name: "Innovation",
    description: "Breakthrough potential, upgrade efficiency, and creative problem solving. Higher levels increase upgrade success chance and reduce research costs.",
    icon: "Lightbulb",
    color: "text-pink-500",
    maxLevel: 100,
    baseCost: 400,
    costMultiplier: 1.15,
    effects: [
      { type: "bonus", target: "upgradeSuccess", value: 0.02, description: "+2% Upgrade Success per level" },
      { type: "bonus", target: "researchCostReduction", value: 0.015, description: "+1.5% Research Cost Reduction per level" },
      { type: "unlock", target: "singularityEngine", value: 80, description: "Unlocks Singularity Engine at level 80" },
    ],
  },
];

export function getAttributeById(id: string): EmpireAttribute | undefined {
  return EMPIRE_ATTRIBUTES.find((attr) => attr.id === id);
}

export function calculateAttributeCost(level: number, baseCost: number, multiplier: number): number {
  return Math.floor(baseCost * Math.pow(multiplier, level));
}

export function calculateTotalAttributePoints(attributes: Record<string, number>): number {
  return Object.values(attributes).reduce((sum, level) => sum + level, 0);
}

export function getDefaultEmpireAttributes(): Record<string, number> {
  return Object.fromEntries(EMPIRE_ATTRIBUTES.map((attr) => [attr.id, 1]));
}

export function getEmpireOverallLevel(attributes: Record<string, number>): number {
  const values = Object.values(attributes);
  return Math.floor(values.reduce((sum, level) => sum + level, 0) / values.length);
}

export function getEmpirePowerRating(attributes: Record<string, number>): number {
  return Object.entries(attributes).reduce((total, [id, level]) => {
    const attr = getAttributeById(id);
    if (!attr) return total;
    return total + level * (attr.baseCost / 100);
  }, 0);
}
