export type SkillCategory =
  | "combat"
  | "navigation"
  | "electronic"
  | "mechanical"
  | "industry"
  | "science"
  | "social"
  | "strategic";

export type SkillAttribute = "intelligence" | "memory" | "charisma" | "perception" | "willpower";

export type SkillEffects = Record<string, number>;

export interface EmpireSkillDefinition {
  id: string;
  name: string;
  description: string;
  category: SkillCategory;
  maxLevel: number;
  baseTrainingSeconds: number;
  primaryAttribute: SkillAttribute;
  secondaryAttribute: SkillAttribute;
  prerequisites: Record<string, number>;
  effects: SkillEffects;
}

const skill = (
  id: string,
  name: string,
  description: string,
  category: SkillCategory,
  primaryAttribute: SkillAttribute,
  secondaryAttribute: SkillAttribute,
  baseTrainingSeconds: number,
  effects: SkillEffects,
  prerequisites: Record<string, number> = {},
): EmpireSkillDefinition => ({
  id,
  name,
  description,
  category,
  maxLevel: 5,
  baseTrainingSeconds,
  primaryAttribute,
  secondaryAttribute,
  prerequisites,
  effects,
});

export const EMPIRE_SKILLS: EmpireSkillDefinition[] = [
  skill("combat-gunnery", "Gunnery", "Improve direct-fire accuracy and weapon output across the fleet.", "combat", "perception", "willpower", 900, { combatAttack: 0.025 }),
  skill("combat-ballistics", "Ballistics", "Master projectile prediction for cannons, missiles, and kinetic batteries.", "combat", "perception", "intelligence", 1200, { combatAttack: 0.02, missileDamage: 0.025 }, { "combat-gunnery": 2 }),
  skill("combat-shield-tactics", "Shield Tactics", "Coordinate shield cycling and defensive formations during engagements.", "combat", "willpower", "intelligence", 1500, { combatDefense: 0.03, shieldStrength: 0.03 }, { "combat-gunnery": 1 }),
  skill("combat-command-doctrine", "Command Doctrine", "Turn tactical data into coordinated fleet-wide combat decisions.", "combat", "willpower", "charisma", 2100, { combatAttack: 0.02, combatDefense: 0.02, fleetCapacity: 2 }, { "combat-ballistics": 2, "combat-shield-tactics": 2 }),

  skill("navigation-astrogation", "Astrogation", "Plot safer routes through conventional space and reduce travel errors.", "navigation", "intelligence", "perception", 900, { fleetSpeed: 0.025, fuelEfficiency: 0.02 }),
  skill("navigation-warp", "Warp Navigation", "Tune warp corridors for faster interplanetary and interstellar movement.", "navigation", "intelligence", "willpower", 1500, { fleetSpeed: 0.04, fuelEfficiency: 0.025 }, { "navigation-astrogation": 2 }),
  skill("navigation-expedition-piloting", "Expedition Piloting", "Extend fleet endurance and discovery yield during expeditions.", "navigation", "perception", "intelligence", 1200, { expeditionYield: 0.04, expeditionSafety: 0.03 }, { "navigation-astrogation": 1 }),
  skill("navigation-fleet-maneuvering", "Fleet Maneuvering", "Synchronize formations so large fleets turn, regroup, and retreat efficiently.", "navigation", "perception", "willpower", 2100, { fleetSpeed: 0.025, combatDefense: 0.02, fleetCapacity: 2 }, { "navigation-warp": 2, "navigation-expedition-piloting": 2 }),

  skill("electronic-sensor-fusion", "Sensor Fusion", "Combine orbital, fleet, and planetary sensors into a single tactical picture.", "electronic", "intelligence", "perception", 900, { sensorRange: 0.05, espionageDefense: 0.02 }),
  skill("electronic-warfare", "Electronic Warfare", "Disrupt hostile targeting, communications, and guidance systems.", "electronic", "intelligence", "willpower", 1500, { electronicAttack: 0.035, enemyAccuracyReduction: 0.02 }, { "electronic-sensor-fusion": 2 }),
  skill("electronic-countermeasures", "Countermeasures", "Deploy decoys and adaptive jamming to preserve ships under incoming fire.", "electronic", "perception", "willpower", 1200, { combatDefense: 0.025, interception: 0.025 }, { "electronic-sensor-fusion": 1 }),
  skill("electronic-network-intrusion", "Network Intrusion", "Penetrate hostile command networks and expose defensive vulnerabilities.", "electronic", "intelligence", "charisma", 2100, { espionage: 0.05, sensorRange: 0.025, combatAttack: 0.015 }, { "electronic-warfare": 2, "electronic-countermeasures": 2 }),

  skill("mechanical-hull-engineering", "Hull Engineering", "Reinforce structural members and improve fleet survivability.", "mechanical", "memory", "intelligence", 900, { hullStrength: 0.04, combatDefense: 0.015 }),
  skill("mechanical-reactor-management", "Reactor Management", "Balance reactor output for stronger systems and lower operating costs.", "mechanical", "memory", "willpower", 1200, { energyProduction: 0.04, fuelEfficiency: 0.03 }, { "mechanical-hull-engineering": 2 }),
  skill("mechanical-drone-operations", "Drone Operations", "Operate autonomous repair, mining, and defense drones at scale.", "mechanical", "memory", "perception", 1500, { shipyardSpeed: 0.03, miningOutput: 0.03, interception: 0.02 }, { "mechanical-hull-engineering": 1 }),
  skill("mechanical-damage-control", "Damage Control", "Coordinate emergency repairs before damage becomes permanent loss.", "mechanical", "willpower", "memory", 2100, { hullStrength: 0.025, repairSpeed: 0.05, combatDefense: 0.015 }, { "mechanical-reactor-management": 2, "mechanical-drone-operations": 2 }),

  skill("industry-mining-optimization", "Mining Optimization", "Increase extraction efficiency across metal, crystal, and strategic resource mines.", "industry", "memory", "intelligence", 900, { miningOutput: 0.05, resourceProduction: 0.02 }),
  skill("industry-metallurgy", "Metallurgy", "Refine stronger alloys for construction, armor, and orbital platforms.", "industry", "memory", "willpower", 1200, { metalProduction: 0.05, hullStrength: 0.02 }, { "industry-mining-optimization": 2 }),
  skill("industry-crystal-processing", "Crystal Processing", "Improve crystal purity and reduce waste in advanced manufacturing.", "industry", "intelligence", "memory", 1500, { crystalProduction: 0.05, researchSpeed: 0.02 }, { "industry-mining-optimization": 1 }),
  skill("industry-logistics-management", "Logistics Management", "Coordinate warehouses, queues, and supply convoys across the empire.", "industry", "charisma", "memory", 2100, { storageCapacity: 0.06, shipyardSpeed: 0.025, fleetCapacity: 2 }, { "industry-metallurgy": 2, "industry-crystal-processing": 2 }),

  skill("science-research-methodology", "Research Methodology", "Create repeatable research programs that accelerate every laboratory.", "science", "intelligence", "memory", 900, { researchSpeed: 0.05, researchOutput: 0.025 }),
  skill("science-xenobiology", "Xenobiology", "Study alien life and biospheres to improve food, water, and expedition returns.", "science", "intelligence", "charisma", 1200, { foodProduction: 0.04, waterProduction: 0.04, expeditionYield: 0.02 }, { "science-research-methodology": 2 }),
  skill("science-quantum-physics", "Quantum Physics", "Model quantum systems used by shields, gates, and high-energy weapons.", "science", "intelligence", "willpower", 1500, { shieldStrength: 0.05, energyProduction: 0.03, researchSpeed: 0.02 }, { "science-research-methodology": 1 }),
  skill("science-planetary-engineering", "Planetary Engineering", "Shape worlds for greater capacity, resilience, and long-term production.", "science", "memory", "intelligence", 2100, { resourceProduction: 0.03, storageCapacity: 0.05, populationGrowth: 0.03 }, { "science-xenobiology": 2, "science-quantum-physics": 2 }),

  skill("social-diplomacy", "Diplomacy", "Build trust with factions and reduce the cost of peaceful agreements.", "social", "charisma", "intelligence", 900, { diplomacy: 0.06, allianceCapacity: 1 }),
  skill("social-trade-negotiation", "Trade Negotiation", "Secure better exchange rates and stronger commercial contracts.", "social", "charisma", "memory", 1200, { tradeEfficiency: 0.05, resourceProduction: 0.02 }, { "social-diplomacy": 2 }),
  skill("social-leadership", "Leadership", "Raise morale and coordinate more personnel through clear command structures.", "social", "charisma", "willpower", 1500, { morale: 0.04, populationGrowth: 0.025, fleetCapacity: 2 }, { "social-diplomacy": 1 }),
  skill("social-espionage", "Espionage", "Recruit and direct intelligence assets behind hostile lines.", "social", "charisma", "perception", 2100, { espionage: 0.06, sensorRange: 0.02, enemyAccuracyReduction: 0.015 }, { "social-trade-negotiation": 2, "social-leadership": 2 }),

  skill("strategic-empire-planning", "Empire Planning", "Unify economic, military, and research priorities into a coherent growth doctrine.", "strategic", "intelligence", "charisma", 900, { empireGrowth: 0.04, resourceProduction: 0.02 }),
  skill("strategic-turn-management", "Turn Management", "Convert command time into more efficient construction and strategic actions.", "strategic", "memory", "willpower", 1200, { turnEfficiency: 0.04, constructionSpeed: 0.03 }, { "strategic-empire-planning": 2 }),
  skill("strategic-crisis-response", "Crisis Response", "Keep production and defense online during disasters, invasions, and shortages.", "strategic", "willpower", "memory", 1500, { hazardResistance: 0.05, combatDefense: 0.02, repairSpeed: 0.025 }, { "strategic-empire-planning": 1 }),
  skill("strategic-grand-strategy", "Grand Strategy", "Translate every empire system into compounding advantages across the galaxy.", "strategic", "willpower", "intelligence", 2400, { empireGrowth: 0.03, combatAttack: 0.02, researchSpeed: 0.02, resourceProduction: 0.03, fleetCapacity: 3 }, { "strategic-turn-management": 2, "strategic-crisis-response": 2 }),
];

export const SKILL_BY_ID = Object.fromEntries(EMPIRE_SKILLS.map((entry) => [entry.id, entry])) as Record<string, EmpireSkillDefinition>;

export const SKILL_CATEGORY_NAMES: Record<SkillCategory, string> = {
  combat: "Combat",
  navigation: "Navigation",
  electronic: "Electronic Warfare",
  mechanical: "Mechanical Engineering",
  industry: "Industry",
  science: "Science",
  social: "Social & Diplomacy",
  strategic: "Strategic Command",
};

export const SKILL_ATTRIBUTE_NAMES: Record<SkillAttribute, string> = {
  intelligence: "Intelligence",
  memory: "Memory",
  charisma: "Charisma",
  perception: "Perception",
  willpower: "Willpower",
};

export const DEFAULT_SKILL_ATTRIBUTES: Record<SkillAttribute, number> = {
  intelligence: 5,
  memory: 5,
  charisma: 5,
  perception: 5,
  willpower: 5,
};

export interface EmpireSkillState {
  skills: Record<string, number>;
  queue: Array<{ skillId: string; level: number; startTime: number; endTime: number }>;
  attributes: Record<SkillAttribute, number>;
}

export function createDefaultEmpireSkillState(): EmpireSkillState {
  return {
    skills: {},
    queue: [],
    attributes: { ...DEFAULT_SKILL_ATTRIBUTES },
  };
}

export function calculateSkillTrainingSeconds(definition: EmpireSkillDefinition, level: number, attributes: Record<SkillAttribute, number>): number {
  const primary = Math.max(1, Number(attributes[definition.primaryAttribute] || 5));
  const secondary = Math.max(1, Number(attributes[definition.secondaryAttribute] || 5));
  const attributeReduction = Math.min(0.45, Math.max(0, (primary - 5) * 0.025 + (secondary - 5) * 0.0125));
  const levelMultiplier = 1 + Math.max(0, level - 1) * 0.45;
  return Math.max(60, Math.round(definition.baseTrainingSeconds * levelMultiplier * (1 - attributeReduction)));
}

export function getSkillEffects(state: EmpireSkillState): SkillEffects {
  const totals: SkillEffects = {};
  for (const [skillId, level] of Object.entries(state.skills)) {
    const definition = SKILL_BY_ID[skillId];
    if (!definition) continue;
    for (const [effect, value] of Object.entries(definition.effects)) {
      totals[effect] = Number(((totals[effect] || 0) + value * level).toFixed(4));
    }
  }
  return totals;
}
