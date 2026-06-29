// Alliance System Configuration — GDD-aligned

export type AllianceRank = 'member' | 'officer' | 'co-leader' | 'leader';

export interface AllianceFeature {
  id: string;
  name: string;
  description: string;
  unlockedByDefault: boolean;
  requiredLevel?: number;
  cost?: { credits: number };
}

export interface AllianceMissionTemplate {
  id: string;
  name: string;
  description: string;
  type: 'resource' | 'combat' | 'diplomacy' | 'exploration' | 'construction' | 'research';
  durationHours: number;
  rewardCredits: number;
  rewardReputation: number;
  requiredMembers: number;
}

export interface AllianceWarConfig {
  minDurationHours: number;
  maxDurationHours: number;
  surrenderAllowed: boolean;
  victorRewardCredits: number;
  victorRewardReputation: number;
  loserPenaltyCredits: number;
  cooldownHours: number;
}

export interface AllianceTaxConfig {
  rate: number;
  maxRate: number;
  collectionIntervalHours: number;
  treasuryCap: number;
}

export interface AllianceTerritoryConfig {
  baseTerritory: number;
  territoryPerLevel: number;
  territoryPerMember: number;
  maxTerritory: number;
  claimingCost: { credits: number; metal: number; crystal: number };
}

export interface AllianceEventConfig {
  type: string;
  name: string;
  description: string;
  durationHours: number;
  cooldownDays: number;
  minMembers: number;
  rewardPool: { credits: number; reputation: number };
}

export const ALLIANCE_SYSTEM_CONFIG = {
  creation: {
    cost: { credits: 100000, metal: 50000, crystal: 25000 },
    minMembers: 2,
    maxTagLength: 5,
    maxNameLength: 30,
  },

  ranks: {
    member: { name: 'Member', permissions: ['view_chat', 'view_treasury'] },
    officer: { name: 'Officer', permissions: ['manage_members', 'invite', 'kick', 'manage_treasury'] },
    'co-leader': { name: 'Co-Leader', permissions: ['all_except_delete'] },
    leader: { name: 'Leader', permissions: ['all'] },
  } satisfies Record<AllianceRank, { name: string; permissions: string[] }>,

  features: [
    { id: 'chat', name: 'Alliance Chat', description: 'Real-time alliance communication', unlockedByDefault: true },
    { id: 'treasury', name: 'Alliance Treasury', description: 'Shared resource pool', unlockedByDefault: true },
    { id: 'shared_research', name: 'Shared Research', description: 'Pool research progress', unlockedByDefault: false, requiredLevel: 3 },
    { id: 'missions', name: 'Alliance Missions', description: 'Complete missions for rewards', unlockedByDefault: true },
    { id: 'wars', name: 'Alliance Wars', description: 'Declare war on other alliances', unlockedByDefault: false, requiredLevel: 5 },
    { id: 'ranking', name: 'Alliance Ranking', description: 'Compete on leaderboards', unlockedByDefault: true },
    { id: 'territory', name: 'Alliance Territory', description: 'Claim and control sectors', unlockedByDefault: false, requiredLevel: 7 },
    { id: 'diplomacy', name: 'Alliance Diplomacy', description: 'Form treaties and pacts', unlockedByDefault: false, requiredLevel: 3 },
    { id: 'tax', name: 'Alliance Tax', description: 'Collect taxes from members', unlockedByDefault: false, requiredLevel: 2 },
    { id: 'events', name: 'Alliance Events', description: 'Participate in alliance events', unlockedByDefault: false, requiredLevel: 4 },
  ] satisfies AllianceFeature[],

  missions: [
    { id: 'am_research', name: 'Research Drive', description: 'Members complete research tasks', type: 'research', durationHours: 24, rewardCredits: 5000, rewardReputation: 100, requiredMembers: 3 },
    { id: 'am_combat', name: 'War Effort', description: 'Engage in combat missions', type: 'combat', durationHours: 48, rewardCredits: 10000, rewardReputation: 250, requiredMembers: 5 },
    { id: 'am_resource', name: 'Resource Drive', description: 'Contribute resources to treasury', type: 'resource', durationHours: 24, rewardCredits: 3000, rewardReputation: 75, requiredMembers: 2 },
    { id: 'am_exploration', name: 'Deep Survey', description: 'Explore unknown sectors', type: 'exploration', durationHours: 72, rewardCredits: 8000, rewardReputation: 150, requiredMembers: 3 },
    { id: 'am_construction', name: 'Build Up', description: 'Construct buildings across member colonies', type: 'construction', durationHours: 48, rewardCredits: 6000, rewardReputation: 125, requiredMembers: 4 },
  ] satisfies AllianceMissionTemplate[],

  war: {
    minDurationHours: 24,
    maxDurationHours: 168,
    surrenderAllowed: true,
    victorRewardCredits: 50000,
    victorRewardReputation: 1000,
    loserPenaltyCredits: 15000,
    cooldownHours: 72,
  } satisfies AllianceWarConfig,

  tax: {
    rate: 0.05,
    maxRate: 0.25,
    collectionIntervalHours: 24,
    treasuryCap: 10000000,
  } satisfies AllianceTaxConfig,

  territory: {
    baseTerritory: 1,
    territoryPerLevel: 1,
    territoryPerMember: 0.1,
    maxTerritory: 100,
    claimingCost: { credits: 25000, metal: 10000, crystal: 5000 },
  } satisfies AllianceTerritoryConfig,

  events: [
    { type: 'mining_contest', name: 'Mining Contest', description: 'Who can mine the most resources', durationHours: 48, cooldownDays: 14, minMembers: 5, rewardPool: { credits: 100000, reputation: 2000 } },
    { type: 'fleet_week', name: 'Fleet Week', description: 'Build the strongest fleet', durationHours: 72, cooldownDays: 30, minMembers: 8, rewardPool: { credits: 200000, reputation: 5000 } },
    { type: 'war_drills', name: 'War Drills', description: 'Participate in simulated battles', durationHours: 24, cooldownDays: 7, minMembers: 4, rewardPool: { credits: 50000, reputation: 1000 } },
  ] satisfies AllianceEventConfig[],
};
