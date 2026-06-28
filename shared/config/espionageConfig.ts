export const SPY_COSTS = {
  light: { credits: 500, metal: 200, crystal: 100 },
  standard: { credits: 1500, metal: 600, crystal: 300 },
  heavy: { credits: 4000, metal: 1500, crystal: 800 },
} as const;

export const SUCCESS_RATES = {
  base: 65,
  perResearchLevel: 3,
  maxRate: 95,
  minRate: 15,
  targetDefenseModifiers: {
    none: 0,
    basic: -10,
    advanced: -20,
    elite: -35,
  },
} as const;

export const DETECTION_CHANCES = {
  base: 20,
  perCounterIntelLevel: 5,
  maxChance: 80,
  minChance: 5,
  stealthResearchReduction: 4,
} as const;

export const INTEL_CATEGORIES = [
  { id: "military", name: "Military Intelligence", description: "Fleet composition, ship counts, defense levels", icon: "Sword" },
  { id: "economy", name: "Economic Intelligence", description: "Resource stockpiles, production rates, market positions", icon: "Gem" },
  { id: "research", name: "Research Intelligence", description: "Technology levels, active research, lab capacity", icon: "FlaskConical" },
  { id: "fleet", name: "Fleet Intelligence", description: "Ship fittings, fleet positions, travel routes", icon: "Rocket" },
] as const;

export const COUNTER_INTEL_CONFIG = {
  activationCost: { credits: 2000, deuterium: 500 },
  durationMinutes: 10,
  detectionBonus: 25,
  maxActiveLevel: 5,
} as const;

export const SPY_UNITS = [
  { id: "operative", name: "Operative", tier: 1, cost: 300, stealth: 50, speed: 60, effectiveness: 40 },
  { id: "agent", name: "Agent", tier: 2, cost: 800, stealth: 65, speed: 55, effectiveness: 60 },
  { id: "shadow", name: "Shadow", tier: 3, cost: 2000, stealth: 80, speed: 70, effectiveness: 80 },
  { id: "phantom", name: "Phantom", tier: 4, cost: 5000, stealth: 95, speed: 85, effectiveness: 95 },
] as const;
