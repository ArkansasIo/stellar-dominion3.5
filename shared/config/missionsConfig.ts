// Missions Configuration — GDD-aligned (12 mission types)
// Covers: Transport, Attack, Defend, Spy, Colonize, Expedition,
//         Harvest, Trade, Escort, Patrol, Blockade, Bombardment

export type MissionType =
  | 'transport'
  | 'attack'
  | 'defend'
  | 'spy'
  | 'colonize'
  | 'expedition'
  | 'harvest'
  | 'trade'
  | 'escort'
  | 'patrol'
  | 'blockade'
  | 'bombardment';

export type MissionDifficulty = 'easy' | 'medium' | 'hard' | 'elite' | 'legendary';

export type MissionCategory = 'military' | 'economic' | 'exploration' | 'diplomacy';

export interface MissionDefinition {
  id: MissionType;
  name: string;
  description: string;
  category: MissionCategory;
  minTier: number;
  maxTier: number;
  durationMinutes: number;
  cooldownMinutes: number;
  baseRewardCredits: number;
  baseRewardXp: number;
  baseRewardResources: { metal?: number; crystal?: number; deuterium?: number };
  requiresShipTypes?: string[];
  requiresFleetPower?: number;
  failureChance: number;
  specialRules?: string[];
}

export interface MissionDifficultyConfig {
  difficulty: MissionDifficulty;
  multiplier: number;
  minTier: number;
  color: string;
}

export const MISSION_TYPES: MissionDefinition[] = [
  {
    id: 'transport',
    name: 'Transport Mission',
    description: 'Transport resources between colonies or to allied worlds',
    category: 'economic',
    minTier: 1, maxTier: 99,
    durationMinutes: 30,
    cooldownMinutes: 60,
    baseRewardCredits: 1000,
    baseRewardXp: 50,
    baseRewardResources: { metal: 5000, crystal: 2500 },
    requiresShipTypes: ['cargo'],
    failureChance: 0.05,
    specialRules: ['Cargo ships required', 'Pirate interception possible'],
  },
  {
    id: 'attack',
    name: 'Attack Mission',
    description: 'Launch a military strike against an enemy target',
    category: 'military',
    minTier: 3, maxTier: 99,
    durationMinutes: 60,
    cooldownMinutes: 120,
    baseRewardCredits: 5000,
    baseRewardXp: 200,
    baseRewardResources: { metal: 2000, crystal: 1000 },
    requiresShipTypes: ['fighter', 'bomber', 'destroyer'],
    requiresFleetPower: 1000,
    failureChance: 0.2,
    specialRules: ['Combat ships required', 'Casualties expected'],
  },
  {
    id: 'defend',
    name: 'Defend Mission',
    description: 'Protect a colony, station, or allied world from attack',
    category: 'military',
    minTier: 3, maxTier: 99,
    durationMinutes: 45,
    cooldownMinutes: 90,
    baseRewardCredits: 4000,
    baseRewardXp: 175,
    baseRewardResources: { metal: 1500, crystal: 1500, deuterium: 1000 },
    requiresShipTypes: ['fighter', 'cruiser', 'battleship'],
    requiresFleetPower: 1500,
    failureChance: 0.15,
    specialRules: ['Defense platforms count', 'Shields reduce losses'],
  },
  {
    id: 'spy',
    name: 'Spy Mission',
    description: 'Gather intelligence on enemy colonies, fleets, or activities',
    category: 'diplomacy',
    minTier: 2, maxTier: 99,
    durationMinutes: 120,
    cooldownMinutes: 240,
    baseRewardCredits: 3000,
    baseRewardXp: 150,
    baseRewardResources: {},
    requiresShipTypes: ['explorer', 'stealth'],
    failureChance: 0.35,
    specialRules: ['Stealth ships reduce detection', 'Espionage tech reduces failure'],
  },
  {
    id: 'colonize',
    name: 'Colonize Mission',
    description: 'Establish a new colony on an unoccupied world',
    category: 'exploration',
    minTier: 2, maxTier: 99,
    durationMinutes: 180,
    cooldownMinutes: 360,
    baseRewardCredits: 8000,
    baseRewardXp: 300,
    baseRewardResources: { metal: 10000, crystal: 5000, deuterium: 2500 },
    requiresShipTypes: ['colony'],
    failureChance: 0.1,
    specialRules: ['Colony ship required', 'Terraforming improves success'],
  },
  {
    id: 'expedition',
    name: 'Expedition Mission',
    description: 'Explore unknown space for discoveries and anomalies',
    category: 'exploration',
    minTier: 1, maxTier: 99,
    durationMinutes: 240,
    cooldownMinutes: 480,
    baseRewardCredits: 6000,
    baseRewardXp: 250,
    baseRewardResources: { deuterium: 3000 },
    requiresShipTypes: ['explorer', 'science'],
    failureChance: 0.25,
    specialRules: ['Science ships boost rewards', 'Random events possible'],
  },
  {
    id: 'harvest',
    name: 'Harvest Mission',
    description: 'Extract resources from asteroid fields or gas clouds',
    category: 'economic',
    minTier: 1, maxTier: 99,
    durationMinutes: 60,
    cooldownMinutes: 120,
    baseRewardCredits: 2000,
    baseRewardXp: 75,
    baseRewardResources: { metal: 8000, crystal: 4000, deuterium: 2000 },
    requiresShipTypes: ['miner', 'recycler'],
    failureChance: 0.08,
    specialRules: ['Mining ships increase yield'],
  },
  {
    id: 'trade',
    name: 'Trade Mission',
    description: 'Establish or maintain a trade route between two points',
    category: 'economic',
    minTier: 1, maxTier: 99,
    durationMinutes: 90,
    cooldownMinutes: 180,
    baseRewardCredits: 4000,
    baseRewardXp: 100,
    baseRewardResources: { metal: 3000, crystal: 3000 },
    requiresShipTypes: ['cargo', 'freighter'],
    failureChance: 0.05,
    specialRules: ['Diplomatic relations improve rewards'],
  },
  {
    id: 'escort',
    name: 'Escort Mission',
    description: 'Protect civilian or allied ships through dangerous space',
    category: 'military',
    minTier: 4, maxTier: 99,
    durationMinutes: 60,
    cooldownMinutes: 180,
    baseRewardCredits: 5000,
    baseRewardXp: 200,
    baseRewardResources: { metal: 2500, crystal: 1500 },
    requiresShipTypes: ['fighter', 'cruiser', 'battleship'],
    requiresFleetPower: 2000,
    failureChance: 0.2,
    specialRules: ['Protect valuable assets', 'Fleet speed matters'],
  },
  {
    id: 'patrol',
    name: 'Patrol Mission',
    description: 'Patrol a sector for threats and maintain security',
    category: 'military',
    minTier: 2, maxTier: 99,
    durationMinutes: 120,
    cooldownMinutes: 240,
    baseRewardCredits: 3000,
    baseRewardXp: 125,
    baseRewardResources: { deuterium: 1500 },
    requiresShipTypes: ['fighter', 'frigate'],
    failureChance: 0.1,
    specialRules: ['Detection chance for ambushes'],
  },
  {
    id: 'blockade',
    name: 'Blockade Mission',
    description: 'Establish a blockade around an enemy planet or station',
    category: 'military',
    minTier: 5, maxTier: 99,
    durationMinutes: 180,
    cooldownMinutes: 360,
    baseRewardCredits: 10000,
    baseRewardXp: 400,
    baseRewardResources: { metal: 5000, crystal: 2500 },
    requiresShipTypes: ['battleship', 'cruiser', 'destroyer'],
    requiresFleetPower: 5000,
    failureChance: 0.3,
    specialRules: ['Enemy may attempt to break blockade', 'Cut off enemy resources'],
  },
  {
    id: 'bombardment',
    name: 'Bombardment Mission',
    description: 'Orbital bombardment of enemy planetary defenses and infrastructure',
    category: 'military',
    minTier: 6, maxTier: 99,
    durationMinutes: 30,
    cooldownMinutes: 480,
    baseRewardCredits: 15000,
    baseRewardXp: 500,
    baseRewardResources: {},
    requiresShipTypes: ['bomber', 'battleship', 'dreadnought'],
    requiresFleetPower: 10000,
    failureChance: 0.4,
    specialRules: ['Planetary defenses reduce effectiveness', 'Heavy casualties expected'],
  },
];

export const MISSION_DIFFICULTIES: MissionDifficultyConfig[] = [
  { difficulty: 'easy', multiplier: 1.0, minTier: 1, color: '#4ade80' },
  { difficulty: 'medium', multiplier: 1.5, minTier: 10, color: '#fbbf24' },
  { difficulty: 'hard', multiplier: 2.5, minTier: 25, color: '#fb923c' },
  { difficulty: 'elite', multiplier: 4.0, minTier: 50, color: '#ef4444' },
  { difficulty: 'legendary', multiplier: 6.0, minTier: 80, color: '#a855f7' },
];

export function getMissionReward(mission: MissionDefinition, difficulty: MissionDifficultyConfig): {
  credits: number;
  xp: number;
  resources: { metal?: number; crystal?: number; deuterium?: number };
} {
  return {
    credits: Math.floor(mission.baseRewardCredits * difficulty.multiplier),
    xp: Math.floor(mission.baseRewardXp * difficulty.multiplier),
    resources: Object.fromEntries(
      Object.entries(mission.baseRewardResources).map(([k, v]) => [k, Math.floor(v * difficulty.multiplier)])
    ) as { metal?: number; crystal?: number; deuterium?: number },
  };
}

export function getMissionsByCategory(category: MissionCategory): MissionDefinition[] {
  return MISSION_TYPES.filter(m => m.category === category);
}

export function getMissionById(id: MissionType): MissionDefinition | undefined {
  return MISSION_TYPES.find(m => m.id === id);
}
