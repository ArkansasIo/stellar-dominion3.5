/**
 * HIGH COMMAND SYSTEM
 * ============================================================================
 * Unified command system that ties commanders, equipment, government leaders,
 * and advanced strategic operations together under one umbrella.
 *
 * Components:
 *   1. Command Hierarchy – Rank-based authority system for commanders
 *   2. Officer Corps – Assign commanders to officer positions for empire-wide bonuses
 *   3. Strategic Orders – Issue multi-turn orders that affect empire operations
 *   4. Leader Synergies – Commander + Government Leader combo bonuses
 *   5. Command Ranks – Progressive rank-up system with increasing authority
 *   6. War Council – Collective commander bonuses for fleet operations
 *   7. Intelligence Network – Espionage and reconnaissance bonuses from commanders
 *   8. Logistics Command – Supply chain and resource routing bonuses
 */

// ============================================================================
// TYPES
// ============================================================================

export type CommandRank =
  | 'ensign'
  | 'lieutenant'
  | 'commander'
  | 'captain'
  | 'commodore'
  | 'rear_admiral'
  | 'vice_admiral'
  | 'admiral'
  | 'fleet_admiral'
  | 'grand_admiral';

export type OfficerSlot =
  | 'fleet_commander'
  | 'weapons_officer'
  | 'science_officer'
  | 'engineering_officer'
  | 'tactical_officer'
  | 'navigation_officer'
  | 'communications_officer'
  | 'intelligence_officer'
  | 'logistics_officer'
  | 'diplomatic_envoy';

export type StrategicOrderType =
  | 'full_assault'
  | 'defensive_stance'
  | 'rapid_deployment'
  | 'resource_conservation'
  | 'diplomatic_mission'
  | 'espionage_operation'
  | 'research_focus'
  | 'trade_expansion'
  | 'fleet_reorganization'
  | 'fortification';

export type CommandAbilityCategory =
  | 'combat'
  | 'logistics'
  | 'diplomacy'
  | 'espionage'
  | 'research'
  | 'economy';

// ============================================================================
// COMMAND RANKS
// ============================================================================

export interface CommandRankConfig {
  rank: CommandRank;
  name: string;
  description: string;
  icon: string;
  requiredLevel: number;
  requiredPrestige: number;
  officerSlotsUnlocked: number;
  maxStrategicOrders: number;
  bonusEffects: {
    statType: string;
    value: number;
    isPercent: boolean;
  }[];
  privileges: string[];
}

export const COMMAND_RANKS: CommandRankConfig[] = [
  {
    rank: 'ensign',
    name: 'Ensign',
    description: 'Fresh recruit beginning their command journey.',
    icon: '⭐',
    requiredLevel: 1,
    requiredPrestige: 0,
    officerSlotsUnlocked: 2,
    maxStrategicOrders: 1,
    bonusEffects: [],
    privileges: ['Basic command access'],
  },
  {
    rank: 'lieutenant',
    name: 'Lieutenant',
    description: 'Proven officer with field experience.',
    icon: '⭐⭐',
    requiredLevel: 25,
    requiredPrestige: 100,
    officerSlotsUnlocked: 3,
    maxStrategicOrders: 1,
    bonusEffects: [
      { statType: 'weaponDamage', value: 5, isPercent: true },
    ],
    privileges: ['Basic command access', 'Fleet assignment'],
  },
  {
    rank: 'commander',
    name: 'Commander',
    description: 'Senior officer capable of independent operations.',
    icon: '⭐⭐⭐',
    requiredLevel: 50,
    requiredPrestige: 500,
    officerSlotsUnlocked: 4,
    maxStrategicOrders: 2,
    bonusEffects: [
      { statType: 'weaponDamage', value: 10, isPercent: true },
      { statType: 'researchSpeed', value: 5, isPercent: true },
    ],
    privileges: ['Basic command access', 'Fleet assignment', 'Strategic orders'],
  },
  {
    rank: 'captain',
    name: 'Captain',
    description: 'Commanding officer of a single vessel or station.',
    icon: '🎖️',
    requiredLevel: 100,
    requiredPrestige: 1500,
    officerSlotsUnlocked: 5,
    maxStrategicOrders: 2,
    bonusEffects: [
      { statType: 'weaponDamage', value: 15, isPercent: true },
      { statType: 'hullHp', value: 10, isPercent: true },
      { statType: 'researchSpeed', value: 10, isPercent: true },
    ],
    privileges: ['Basic command access', 'Fleet assignment', 'Strategic orders', 'Officer recruitment'],
  },
  {
    rank: 'commodore',
    name: 'Commodore',
    description: 'Commands a small flotilla of vessels.',
    icon: '🏅',
    requiredLevel: 200,
    requiredPrestige: 5000,
    officerSlotsUnlocked: 6,
    maxStrategicOrders: 3,
    bonusEffects: [
      { statType: 'weaponDamage', value: 20, isPercent: true },
      { statType: 'hullHp', value: 15, isPercent: true },
      { statType: 'shieldHp', value: 10, isPercent: true },
      { statType: 'resourceBonus', value: 10, isPercent: true },
    ],
    privileges: ['Basic command access', 'Fleet assignment', 'Strategic orders', 'Officer recruitment', 'War council'],
  },
  {
    rank: 'rear_admiral',
    name: 'Rear Admiral',
    description: 'Commands a battle group within a fleet.',
    icon: '🚩',
    requiredLevel: 300,
    requiredPrestige: 15000,
    officerSlotsUnlocked: 7,
    maxStrategicOrders: 3,
    bonusEffects: [
      { statType: 'weaponDamage', value: 25, isPercent: true },
      { statType: 'hullHp', value: 20, isPercent: true },
      { statType: 'shieldHp', value: 15, isPercent: true },
      { statType: 'resourceBonus', value: 15, isPercent: true },
      { statType: 'researchSpeed', value: 15, isPercent: true },
    ],
    privileges: ['Basic command access', 'Fleet assignment', 'Strategic orders', 'Officer recruitment', 'War council', 'Intelligence network'],
  },
  {
    rank: 'vice_admiral',
    name: 'Vice Admiral',
    description: 'Second-in-command of an entire fleet.',
    icon: '⚜️',
    requiredLevel: 450,
    requiredPrestige: 40000,
    officerSlotsUnlocked: 8,
    maxStrategicOrders: 4,
    bonusEffects: [
      { statType: 'weaponDamage', value: 30, isPercent: true },
      { statType: 'hullHp', value: 25, isPercent: true },
      { statType: 'shieldHp', value: 20, isPercent: true },
      { statType: 'resourceBonus', value: 20, isPercent: true },
      { statType: 'researchSpeed', value: 20, isPercent: true },
      { statType: 'buildSpeedBonus', value: 10, isPercent: true },
    ],
    privileges: ['All previous', 'Logistics command'],
  },
  {
    rank: 'admiral',
    name: 'Admiral',
    description: 'Supreme commander of a fleet.',
    icon: '👑',
    requiredLevel: 600,
    requiredPrestige: 100000,
    officerSlotsUnlocked: 9,
    maxStrategicOrders: 4,
    bonusEffects: [
      { statType: 'weaponDamage', value: 35, isPercent: true },
      { statType: 'hullHp', value: 30, isPercent: true },
      { statType: 'shieldHp', value: 25, isPercent: true },
      { statType: 'resourceBonus', value: 25, isPercent: true },
      { statType: 'researchSpeed', value: 25, isPercent: true },
      { statType: 'buildSpeedBonus', value: 15, isPercent: true },
      { statType: 'diplomacyBonus', value: 10, isPercent: true },
    ],
    privileges: ['All previous', 'Empire-wide bonuses'],
  },
  {
    rank: 'fleet_admiral',
    name: 'Fleet Admiral',
    description: 'Commands multiple fleets across star systems.',
    icon: '🌟',
    requiredLevel: 800,
    requiredPrestige: 250000,
    officerSlotsUnlocked: 10,
    maxStrategicOrders: 5,
    bonusEffects: [
      { statType: 'weaponDamage', value: 40, isPercent: true },
      { statType: 'hullHp', value: 35, isPercent: true },
      { statType: 'shieldHp', value: 30, isPercent: true },
      { statType: 'resourceBonus', value: 30, isPercent: true },
      { statType: 'researchSpeed', value: 30, isPercent: true },
      { statType: 'buildSpeedBonus', value: 20, isPercent: true },
      { statType: 'diplomacyBonus', value: 15, isPercent: true },
      { statType: 'xpBonus', value: 10, isPercent: true },
    ],
    privileges: ['All previous', 'Grand strategy'],
  },
  {
    rank: 'grand_admiral',
    name: 'Grand Admiral',
    description: 'The highest military authority in the empire.',
    icon: '💎',
    requiredLevel: 999,
    requiredPrestige: 500000,
    officerSlotsUnlocked: 10,
    maxStrategicOrders: 5,
    bonusEffects: [
      { statType: 'weaponDamage', value: 50, isPercent: true },
      { statType: 'hullHp', value: 40, isPercent: true },
      { statType: 'shieldHp', value: 35, isPercent: true },
      { statType: 'resourceBonus', value: 40, isPercent: true },
      { statType: 'researchSpeed', value: 40, isPercent: true },
      { statType: 'buildSpeedBonus', value: 25, isPercent: true },
      { statType: 'diplomacyBonus', value: 20, isPercent: true },
      { statType: 'xpBonus', value: 20, isPercent: true },
      { statType: 'prestigeBonus', value: 15, isPercent: true },
    ],
    privileges: ['All previous', 'Supreme command authority'],
  },
];

// ============================================================================
// OFFICER CORPS
// ============================================================================

export interface OfficerSlotConfig {
  slot: OfficerSlot;
  name: string;
  description: string;
  icon: string;
  primaryStatBonus: string;
  bonusValue: number;
  isPercent: boolean;
  synergyCategories: CommandAbilityCategory[];
}

export const OFFICER_SLOTS: OfficerSlotConfig[] = [
  {
    slot: 'fleet_commander',
    name: 'Fleet Commander',
    description: 'Overall fleet coordination and morale boost.',
    icon: '⚓',
    primaryStatBonus: 'weaponDamage',
    bonusValue: 15,
    isPercent: true,
    synergyCategories: ['combat', 'logistics'],
  },
  {
    slot: 'weapons_officer',
    name: 'Weapons Officer',
    description: 'Directs火力 and weapon systems optimization.',
    icon: '🎯',
    primaryStatBonus: 'weaponDamage',
    bonusValue: 20,
    isPercent: true,
    synergyCategories: ['combat'],
  },
  {
    slot: 'science_officer',
    name: 'Science Officer',
    description: 'Accelerates research and technology development.',
    icon: '🔬',
    primaryStatBonus: 'researchSpeed',
    bonusValue: 20,
    isPercent: true,
    synergyCategories: ['research', 'espionage'],
  },
  {
    slot: 'engineering_officer',
    name: 'Engineering Officer',
    description: 'Optimizes construction and ship repair.',
    icon: '🔧',
    primaryStatBonus: 'buildSpeedBonus',
    bonusValue: 20,
    isPercent: true,
    synergyCategories: ['logistics', 'economy'],
  },
  {
    slot: 'tactical_officer',
    name: 'Tactical Officer',
    description: 'Enhances combat tactics and fleet maneuvers.',
    icon: '⚔️',
    primaryStatBonus: 'weaponCritChance',
    bonusValue: 10,
    isPercent: true,
    synergyCategories: ['combat', 'espionage'],
  },
  {
    slot: 'navigation_officer',
    name: 'Navigation Officer',
    description: 'Improves fleet speed and travel efficiency.',
    icon: '🧭',
    primaryStatBonus: 'warpSpeed',
    bonusValue: 25,
    isPercent: true,
    synergyCategories: ['logistics', 'economy'],
  },
  {
    slot: 'communications_officer',
    name: 'Communications Officer',
    description: 'Enhances diplomatic relations and alliance coordination.',
    icon: '📡',
    primaryStatBonus: 'diplomacyBonus',
    bonusValue: 20,
    isPercent: true,
    synergyCategories: ['diplomacy'],
  },
  {
    slot: 'intelligence_officer',
    name: 'Intelligence Officer',
    description: 'Manages espionage operations and counter-intelligence.',
    icon: '🕵️',
    primaryStatBonus: 'sensorStrength',
    bonusValue: 25,
    isPercent: true,
    synergyCategories: ['espionage', 'combat'],
  },
  {
    slot: 'logistics_officer',
    name: 'Logistics Officer',
    description: 'Optimizes resource flow and supply chains.',
    icon: '📦',
    primaryStatBonus: 'resourceBonus',
    bonusValue: 20,
    isPercent: true,
    synergyCategories: ['economy', 'logistics'],
  },
  {
    slot: 'diplomatic_envoy',
    name: 'Diplomatic Envoy',
    description: 'Represents the empire in diplomatic negotiations.',
    icon: '🤝',
    primaryStatBonus: 'diplomacyBonus',
    bonusValue: 25,
    isPercent: true,
    synergyCategories: ['diplomacy', 'economy'],
  },
];

// ============================================================================
// STRATEGIC ORDERS
// ============================================================================

export interface StrategicOrderConfig {
  type: StrategicOrderType;
  name: string;
  description: string;
  icon: string;
  duration: number; // in turns
  requiredRank: CommandRank;
  effects: {
    statType: string;
    value: number;
    isPercent: boolean;
  }[];
  cost: {
    metal?: number;
    crystal?: number;
    deuterium?: number;
    prestige?: number;
  };
  cooldown: number; // in turns
}

export const STRATEGIC_ORDERS: StrategicOrderConfig[] = [
  {
    type: 'full_assault',
    name: 'Full Assault',
    description: 'Maximum offensive posture. All weapons systems at full power.',
    icon: '💥',
    duration: 3,
    requiredRank: 'commander',
    effects: [
      { statType: 'weaponDamage', value: 50, isPercent: true },
      { statType: 'weaponSpeed', value: 25, isPercent: true },
    ],
    cost: { deuterium: 5000, prestige: 100 },
    cooldown: 5,
  },
  {
    type: 'defensive_stance',
    name: 'Defensive Stance',
    description: 'Shields up, hull reinforced. Maximum defensive capability.',
    icon: '🛡️',
    duration: 5,
    requiredRank: 'lieutenant',
    effects: [
      { statType: 'hullHp', value: 40, isPercent: true },
      { statType: 'shieldHp', value: 40, isPercent: true },
      { statType: 'shieldRecharge', value: 30, isPercent: true },
    ],
    cost: { metal: 3000, prestige: 50 },
    cooldown: 3,
  },
  {
    type: 'rapid_deployment',
    name: 'Rapid Deployment',
    description: 'Fast fleet movement and quick strike capability.',
    icon: '⚡',
    duration: 2,
    requiredRank: 'commander',
    effects: [
      { statType: 'warpSpeed', value: 50, isPercent: true },
      { statType: 'flightVelocity', value: 40, isPercent: true },
    ],
    cost: { deuterium: 3000, prestige: 75 },
    cooldown: 4,
  },
  {
    type: 'resource_conservation',
    name: 'Resource Conservation',
    description: 'Ration resources for maximum efficiency.',
    icon: '♻️',
    duration: 4,
    requiredRank: 'ensign',
    effects: [
      { statType: 'resourceBonus', value: 30, isPercent: true },
      { statType: 'cargoCapacity', value: 25, isPercent: true },
    ],
    cost: { prestige: 25 },
    cooldown: 3,
  },
  {
    type: 'diplomatic_mission',
    name: 'Diplomatic Mission',
    description: 'Send envoys to improve relations with other empires.',
    icon: '🕊️',
    duration: 6,
    requiredRank: 'captain',
    effects: [
      { statType: 'diplomacyBonus', value: 50, isPercent: true },
    ],
    cost: { crystal: 2000, prestige: 150 },
    cooldown: 8,
  },
  {
    type: 'espionage_operation',
    name: 'Espionage Operation',
    description: 'Deploy intelligence assets for covert operations.',
    icon: '🕵️',
    duration: 4,
    requiredRank: 'commodore',
    effects: [
      { statType: 'sensorStrength', value: 40, isPercent: true },
      { statType: 'scanResolution', value: 30, isPercent: true },
      { statType: 'electronicWarfare', value: 35, isPercent: true },
    ],
    cost: { crystal: 4000, deuterium: 2000, prestige: 200 },
    cooldown: 6,
  },
  {
    type: 'research_focus',
    name: 'Research Focus',
    description: 'Redirect all available resources to research.',
    icon: '🧪',
    duration: 5,
    requiredRank: 'captain',
    effects: [
      { statType: 'researchSpeed', value: 60, isPercent: true },
    ],
    cost: { crystal: 5000, prestige: 100 },
    cooldown: 7,
  },
  {
    type: 'trade_expansion',
    name: 'Trade Expansion',
    description: 'Expand trade routes and commercial operations.',
    icon: '💰',
    duration: 6,
    requiredRank: 'rear_admiral',
    effects: [
      { statType: 'resourceBonus', value: 40, isPercent: true },
      { statType: 'buildSpeedBonus', value: 20, isPercent: true },
    ],
    cost: { metal: 5000, crystal: 3000, prestige: 250 },
    cooldown: 8,
  },
  {
    type: 'fleet_reorganization',
    name: 'Fleet Reorganization',
    description: 'Restructure fleet composition for maximum efficiency.',
    icon: '🔄',
    duration: 3,
    requiredRank: 'commodore',
    effects: [
      { statType: 'weaponDamage', value: 20, isPercent: true },
      { statType: 'hullHp', value: 20, isPercent: true },
      { statType: 'warpSpeed', value: 15, isPercent: true },
    ],
    cost: { metal: 3000, prestige: 150 },
    cooldown: 5,
  },
  {
    type: 'fortification',
    name: 'Fortification',
    description: 'Harden all defenses and prepare for siege.',
    icon: '🏰',
    duration: 7,
    requiredRank: 'rear_admiral',
    effects: [
      { statType: 'armorValue', value: 50, isPercent: true },
      { statType: 'hullHp', value: 35, isPercent: true },
      { statType: 'shieldHp', value: 35, isPercent: true },
      { statType: 'damageReduction', value: 20, isPercent: true },
    ],
    cost: { metal: 8000, crystal: 4000, prestige: 300 },
    cooldown: 10,
  },
];

// ============================================================================
// LEADER SYNERGIES
// ============================================================================

export type LeaderArchetype =
  | 'military'
  | 'scientific'
  | 'economic'
  | 'diplomatic'
  | 'espionage'
  | 'industrial';

export interface LeaderSynergy {
  id: string;
  name: string;
  description: string;
  icon: string;
  requiredLeaderArchetype: LeaderArchetype;
  requiredCommanderClass: string;
  bonusEffects: {
    statType: string;
    value: number;
    isPercent: boolean;
  }[];
  unlockCondition: string;
}

export const LEADER_SYNERGIES: LeaderSynergy[] = [
  {
    id: 'synergy_war_council',
    name: 'War Council',
    description: 'Military leader and tactical commander coordinate strike operations.',
    icon: '⚔️',
    requiredLeaderArchetype: 'military',
    requiredCommanderClass: 'tactical',
    bonusEffects: [
      { statType: 'weaponDamage', value: 25, isPercent: true },
      { statType: 'weaponCritChance', value: 10, isPercent: true },
    ],
    unlockCondition: 'Assign a military leader with a tactical commander',
  },
  {
    id: 'synergy_research_dividend',
    name: 'Research Dividend',
    description: 'Scientific leader and research commander accelerate breakthroughs.',
    icon: '🔬',
    requiredLeaderArchetype: 'scientific',
    requiredCommanderClass: 'science',
    bonusEffects: [
      { statType: 'researchSpeed', value: 35, isPercent: true },
      { statType: 'xpBonus', value: 15, isPercent: true },
    ],
    unlockCondition: 'Assign a scientific leader with a science commander',
  },
  {
    id: 'synergy_trade_route',
    name: 'Trade Route Optimization',
    description: 'Economic leader and logistics commander maximize trade profits.',
    icon: '💰',
    requiredLeaderArchetype: 'economic',
    requiredCommanderClass: 'logistics',
    bonusEffects: [
      { statType: 'resourceBonus', value: 30, isPercent: true },
      { statType: 'cargoCapacity', value: 25, isPercent: true },
    ],
    unlockCondition: 'Assign an economic leader with a logistics commander',
  },
  {
    id: 'synergy_ambassador',
    name: 'Ambassador Protocol',
    description: 'Diplomatic leader and envoy commander forge powerful alliances.',
    icon: '🤝',
    requiredLeaderArchetype: 'diplomatic',
    requiredCommanderClass: 'support',
    bonusEffects: [
      { statType: 'diplomacyBonus', value: 40, isPercent: true },
    ],
    unlockCondition: 'Assign a diplomatic leader with a support commander',
  },
  {
    id: 'synergy_shadow_network',
    name: 'Shadow Network',
    description: 'Espionage leader and intelligence commander operate covert networks.',
    icon: '🕵️',
    requiredLeaderArchetype: 'espionage',
    requiredCommanderClass: 'reconnaissance',
    bonusEffects: [
      { statType: 'sensorStrength', value: 30, isPercent: true },
      { statType: 'electronicWarfare', value: 25, isPercent: true },
    ],
    unlockCondition: 'Assign an espionage leader with a reconnaissance commander',
  },
  {
    id: 'synergy_industrial_might',
    name: 'Industrial Might',
    description: 'Industrial leader and engineering commander supercharge production.',
    icon: '🏭',
    requiredLeaderArchetype: 'industrial',
    requiredCommanderClass: 'engineering',
    bonusEffects: [
      { statType: 'buildSpeedBonus', value: 35, isPercent: true },
      { statType: 'miningYield', value: 20, isPercent: true },
    ],
    unlockCondition: 'Assign an industrial leader with an engineering commander',
  },
  {
    id: 'synergy_fortress',
    name: 'Fortress Command',
    description: 'Military leader and defensive commander create an impenetrable defense.',
    icon: '🏰',
    requiredLeaderArchetype: 'military',
    requiredCommanderClass: 'defensive',
    bonusEffects: [
      { statType: 'hullHp', value: 30, isPercent: true },
      { statType: 'shieldHp', value: 30, isPercent: true },
      { statType: 'armorValue', value: 25, isPercent: true },
    ],
    unlockCondition: 'Assign a military leader with a defensive commander',
  },
  {
    id: 'synergy_blitzkrieg',
    name: 'Blitzkrieg',
    description: 'Military leader and assault commander execute devastating rapid strikes.',
    icon: '⚡',
    requiredLeaderArchetype: 'military',
    requiredCommanderClass: 'assault',
    bonusEffects: [
      { statType: 'weaponDamage', value: 40, isPercent: true },
      { statType: 'weaponSpeed', value: 20, isPercent: true },
      { statType: 'flightVelocity', value: 15, isPercent: true },
    ],
    unlockCondition: 'Assign a military leader with an assault commander',
  },
];

// ============================================================================
// HIGH COMMAND STATE
// ============================================================================

export interface OfficerAssignment {
  slot: OfficerSlot;
  commanderInstanceId: string | null;
  assignedAt: number | null;
  synergyId: string | null;
}

export interface ActiveStrategicOrder {
  type: StrategicOrderType;
  startedAt: number;
  expiresAt: number;
  turnsRemaining: number;
  totalTurns: number;
}

export interface WarCouncilMember {
  commanderInstanceId: string;
  role: string;
  joinedAt: number;
  contributionBonus: number;
}

export interface HighCommandState {
  rank: CommandRank;
  prestige: number;
  experience: number;
  officerAssignments: OfficerAssignment[];
  activeOrders: ActiveStrategicOrder[];
  orderCooldowns: Record<StrategicOrderType, number>;
  warCouncil: WarCouncilMember[];
  unlockedSynergies: string[];
  totalOrdersIssued: number;
  totalBattlesWon: number;
  rankUpHistory: { rank: CommandRank; timestamp: number }[];
  commandStats: {
    combatBonus: number;
    logisticsBonus: number;
    diplomacyBonus: number;
    espionageBonus: number;
    researchBonus: number;
    economyBonus: number;
  };
}

// ============================================================================
// DEFAULT STATE
// ============================================================================

export function getDefaultHighCommandState(): HighCommandState {
  return {
    rank: 'ensign',
    prestige: 0,
    experience: 0,
    officerAssignments: OFFICER_SLOTS.slice(0, 2).map((s) => ({
      slot: s.slot,
      commanderInstanceId: null,
      assignedAt: null,
      synergyId: null,
    })),
    activeOrders: [],
    orderCooldowns: {} as Record<StrategicOrderType, number>,
    warCouncil: [],
    unlockedSynergies: [],
    totalOrdersIssued: 0,
    totalBattlesWon: 0,
    rankUpHistory: [{ rank: 'ensign', timestamp: Date.now() }],
    commandStats: {
      combatBonus: 0,
      logisticsBonus: 0,
      diplomacyBonus: 0,
      espionageBonus: 0,
      researchBonus: 0,
      economyBonus: 0,
    },
  };
}

// ============================================================================
// GAME LOGIC FUNCTIONS
// ============================================================================

/**
 * Calculate the current command rank based on level and prestige.
 */
export function calculateCommandRank(level: number, prestige: number): CommandRank {
  let currentRank: CommandRank = 'ensign';
  for (const rankConfig of COMMAND_RANKS) {
    if (level >= rankConfig.requiredLevel && prestige >= rankConfig.requiredPrestige) {
      currentRank = rankConfig.rank;
    }
  }
  return currentRank;
}

/**
 * Get the rank configuration for a given rank.
 */
export function getRankConfig(rank: CommandRank): CommandRankConfig | undefined {
  return COMMAND_RANKS.find((r) => r.rank === rank);
}

/**
 * Get all rank-up milestones between two ranks.
 */
export function getRankProgression(fromRank: CommandRank, toRank: CommandRank): CommandRankConfig[] {
  const fromIndex = COMMAND_RANKS.findIndex((r) => r.rank === fromRank);
  const toIndex = COMMAND_RANKS.findIndex((r) => r.rank === toRank);
  if (fromIndex === -1 || toIndex === -1 || fromIndex >= toIndex) return [];
  return COMMAND_RANKS.slice(fromIndex + 1, toIndex + 1);
}

/**
 * Calculate total bonus effects from rank, officers, and active orders.
 */
export function calculateTotalCommandBonuses(state: HighCommandState): Record<string, number> {
  const bonuses: Record<string, number> = {};

  // Rank bonuses
  const rankConfig = getRankConfig(state.rank);
  if (rankConfig) {
    for (const effect of rankConfig.bonusEffects) {
      const key = effect.statType;
      bonuses[key] = (bonuses[key] || 0) + (effect.isPercent ? effect.value : 0);
    }
  }

  // Officer bonuses
  for (const assignment of state.officerAssignments) {
    if (!assignment.commanderInstanceId) continue;
    const slotConfig = OFFICER_SLOTS.find((s) => s.slot === assignment.slot);
    if (slotConfig) {
      const key = slotConfig.primaryStatBonus;
      bonuses[key] = (bonuses[key] || 0) + (slotConfig.isPercent ? slotConfig.bonusValue : 0);
    }
  }

  // Synergy bonuses
  for (const synergyId of state.unlockedSynergies) {
    const synergy = LEADER_SYNERGIES.find((s) => s.id === synergyId);
    if (synergy) {
      for (const effect of synergy.bonusEffects) {
        const key = effect.statType;
        bonuses[key] = (bonuses[key] || 0) + (effect.isPercent ? effect.value : 0);
      }
    }
  }

  // Active order bonuses
  for (const order of state.activeOrders) {
    const orderConfig = STRATEGIC_ORDERS.find((o) => o.type === order.type);
    if (orderConfig) {
      for (const effect of orderConfig.effects) {
        const key = effect.statType;
        bonuses[key] = (bonuses[key] || 0) + (effect.isPercent ? effect.value : 0);
      }
    }
  }

  return bonuses;
}

/**
 * Check if a commander can be assigned to a given officer slot.
 */
export function canAssignToSlot(
  state: HighCommandState,
  slot: OfficerSlot,
  commanderLevel: number
): { canAssign: boolean; reason?: string } {
  const slotConfig = OFFICER_SLOTS.find((s) => s.slot === slot);
  if (!slotConfig) return { canAssign: false, reason: 'Invalid officer slot' };

  const rankConfig = getRankConfig(state.rank);
  if (!rankConfig) return { canAssign: false, reason: 'Invalid rank' };

  const slotIndex = OFFICER_SLOTS.findIndex((s) => s.slot === slot);
  const unlockedSlots = state.officerAssignments.length;
  if (slotIndex >= unlockedSlots) {
    return { canAssign: false, reason: `Slot not yet unlocked. Current rank allows ${unlockedSlots} slots.` };
  }

  if (commanderLevel < 10) {
    return { canAssign: false, reason: 'Commander must be at least level 10' };
  }

  return { canAssign: true };
}

/**
 * Process a strategic order activation.
 */
export function processStrategicOrder(
  state: HighCommandState,
  orderType: StrategicOrderType
): { success: boolean; newState?: HighCommandState; error?: string } {
  const orderConfig = STRATEGIC_ORDERS.find((o) => o.type === orderType);
  if (!orderConfig) return { success: false, error: 'Invalid order type' };

  const rankConfig = getRankConfig(state.rank);
  if (!rankConfig) return { success: false, error: 'Invalid rank' };

  // Check rank requirement
  const requiredRankIndex = COMMAND_RANKS.findIndex((r) => r.rank === orderConfig.requiredRank);
  const currentRankIndex = COMMAND_RANKS.findIndex((r) => r.rank === state.rank);
  if (currentRankIndex < requiredRankIndex) {
    return { success: false, error: `Requires rank ${orderConfig.requiredRank} or higher` };
  }

  // Check max orders
  if (state.activeOrders.length >= rankConfig.maxStrategicOrders) {
    return { success: false, error: `Maximum active orders reached (${rankConfig.maxStrategicOrders})` };
  }

  // Check cooldown
  const cooldownEnd = state.orderCooldowns[orderType] || 0;
  if (Date.now() < cooldownEnd) {
    const turnsLeft = Math.ceil((cooldownEnd - Date.now()) / (30 * 60 * 1000)); // assuming 30min turns
    return { success: false, error: `Order on cooldown. ${turnsLeft} turns remaining` };
  }

  // Activate order
  const now = Date.now();
  const turnDuration = orderConfig.duration * 30 * 60 * 1000; // 30 min per turn
  const activeOrder: ActiveStrategicOrder = {
    type: orderType,
    startedAt: now,
    expiresAt: now + turnDuration,
    turnsRemaining: orderConfig.duration,
    totalTurns: orderConfig.duration,
  };

  const newState = { ...state };
  newState.activeOrders = [...state.activeOrders, activeOrder];
  newState.totalOrdersIssued += 1;
  newState.prestige = Math.max(0, state.prestige - (orderConfig.cost.prestige || 0));
  newState.experience += 50;

  return { success: true, newState };
}

/**
 * Process tick for active orders (called each game turn).
 */
export function processOrderTick(state: HighCommandState): HighCommandState {
  const newState = { ...state };
  const now = Date.now();
  const expiredOrders: StrategicOrderType[] = [];

  newState.activeOrders = state.activeOrders
    .map((order) => {
      const updated = { ...order, turnsRemaining: order.turnsRemaining - 1 };
      if (updated.turnsRemaining <= 0) {
        expiredOrders.push(order.type);
      }
      return updated;
    })
    .filter((order) => order.turnsRemaining > 0);

  // Set cooldowns for expired orders
  for (const expired of expiredOrders) {
    const orderConfig = STRATEGIC_ORDERS.find((o) => o.type === expired);
    if (orderConfig) {
      const cooldownEnd = now + orderConfig.cooldown * 30 * 60 * 1000;
      newState.orderCooldowns = { ...newState.orderCooldowns, [expired]: cooldownEnd };
    }
  }

  return newState;
}

/**
 * Calculate synergy bonuses based on leader and commander assignments.
 */
export function detectSynergies(
  state: HighCommandState,
  leaderArchetypes: Record<OfficerSlot, LeaderArchetype | null>,
  commanderClasses: Record<OfficerSlot, string | null>
): string[] {
  const detected: string[] = [];

  for (const synergy of LEADER_SYNERGIES) {
    for (const slot of Object.keys(leaderArchetypes) as OfficerSlot[]) {
      const leaderArch = leaderArchetypes[slot];
      const commanderClass = commanderClasses[slot];

      if (
        leaderArch === synergy.requiredLeaderArchetype &&
        commanderClass === synergy.requiredCommanderClass
      ) {
        detected.push(synergy.id);
      }
    }
  }

  return [...new Set(detected)];
}

/**
 * Calculate war council fleet bonus.
 */
export function calculateWarCouncilBonus(
  councilMembers: WarCouncilMember[]
): { weaponDamage: number; hullHp: number; shieldHp: number } {
  let weaponDamage = 0;
  let hullHp = 0;
  let shieldHp = 0;

  for (const member of councilMembers) {
    const bonus = member.contributionBonus;
    weaponDamage += bonus * 0.5;
    hullHp += bonus * 0.3;
    shieldHp += bonus * 0.2;
  }

  // Diminishing returns after 5 members
  if (councilMembers.length > 5) {
    const overCap = councilMembers.length - 5;
    const reductionFactor = Math.max(0.2, 1 - overCap * 0.15);
    weaponDamage *= reductionFactor;
    hullHp *= reductionFactor;
    shieldHp *= reductionFactor;
  }

  return { weaponDamage, hullHp, shieldHp };
}

/**
 * Calculate prestige gain from battle victory.
 */
export function calculatePrestigeGain(
  enemyRank: CommandRank,
  victoryType: 'decisive' | 'marginal' | 'pyrrhic',
  councilBonus: number
): number {
  const rankMultiplier: Record<CommandRank, number> = {
    ensign: 1,
    lieutenant: 2,
    commander: 3,
    captain: 5,
    commodore: 8,
    rear_admiral: 12,
    vice_admiral: 18,
    admiral: 25,
    fleet_admiral: 35,
    grand_admiral: 50,
  };

  const victoryMultiplier = victoryType === 'decisive' ? 1.5 : victoryType === 'marginal' ? 1.0 : 0.5;

  return Math.floor(rankMultiplier[enemyRank] * victoryMultiplier * (1 + councilBonus / 100));
}