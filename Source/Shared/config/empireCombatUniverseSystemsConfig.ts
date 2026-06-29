export type EntityTrack = 'starship' | 'mothership' | 'unit' | 'defense' | 'commander';

export type CombatAlignment = 'offense' | 'defense' | 'support' | 'hybrid';

export type BattleMode = 'pve' | 'pvp';

export type EffectType = 'buff' | 'debuff';

export interface CombatAttributes {
  kinetic: number;
  energy: number;
  explosive: number;
  shield: number;
  armor: number;
  evasion: number;
  targeting: number;
  command: number;
}

export interface CombatSubAttributes {
  critChance: number;
  critDamage: number;
  blockChance: number;
  penetration: number;
  resistance: number;
  regeneration: number;
  moraleImpact: number;
  disruption: number;
}

export interface CoreCombatStats {
  power: number;
  offense: number;
  defense: number;
  hull: number;
  shield: number;
  speed: number;
  initiative: number;
  cargo: number;
}

export interface CombatEffectTemplate {
  id: string;
  name: string;
  type: EffectType;
  category: 'damage' | 'mitigation' | 'control' | 'economy' | 'sustain';
  durationTurns: number;
  stackLimit: number;
  magnitude: number;
  appliesTo: 'self' | 'ally' | 'enemy' | 'all';
  description: string;
}

export interface EntityRankTitle {
  level: number;
  tier: number;
  rank: string;
  title: string;
}

export interface ProgressionSnapshot {
  track: EntityTrack;
  level: number;
  tier: number;
  rank: string;
  title: string;
  stats: CoreCombatStats;
  attributes: CombatAttributes;
  subAttributes: CombatSubAttributes;
  nextLevelExp: number;
}

export interface BattleSystemProfile {
  mode: BattleMode;
  maxRounds: number;
  rapidFireMultiplier: number;
  debrisFieldRate: number;
  plunderRate: number;
  retreatThreshold: number;
  initiativeVariance: number;
  moraleSwingFactor: number;
  criticalImpactFactor: number;
  description: string;
}

export interface EventBossTemplate {
  id: string;
  name: string;
  tier: number;
  level: number;
  rank: string;
  title: string;
  stats: CoreCombatStats;
  attributes: CombatAttributes;
  effects: string[];
  rewardProfile: {
    credits: number;
    metal: number;
    crystal: number;
    deuterium: number;
    xp: number;
  };
}

export interface NpcWorldTemplate {
  id: string;
  name: string;
  tier: number;
  level: number;
  rank: string;
  title: string;
  defenseRating: number;
  economyRating: number;
  lootMultiplier: number;
}

export interface UniverseEventTemplate {
  id: string;
  name: string;
  eventType: 'boss' | 'npcWorld' | 'cosmic' | 'allianceWar' | 'trade';
  recommendedTier: number;
  recommendedLevel: number;
  durationMinutes: number;
  participationMode: BattleMode | 'mixed';
  rewards: {
    credits: number;
    resourcesMultiplier: number;
    xp: number;
  };
  description: string;
}

const RANK_STEPS = [
  'Recruit',
  'Vanguard',
  'Lieutenant',
  'Captain',
  'Commander',
  'Commodore',
  'Admiral',
  'High Admiral',
  'Grand Marshal',
  'Ascendant',
];

const TITLE_PREFIX = {
  starship: 'Starship',
  mothership: 'Mothership',
  unit: 'Legion',
  defense: 'Bulwark',
  commander: 'Warlord',
} satisfies Record<EntityTrack, string>;

export const MAX_TIER = 99;
export const MAX_LEVEL = 999;

export const ENTITY_LEVEL_MATRIX: EntityRankTitle[] = Array.from({ length: MAX_LEVEL }, (_, index) => {
  const level = index + 1;
  const tier = Math.min(MAX_TIER, Math.floor((level - 1) / 10) + 1);
  const rankBand = Math.min(RANK_STEPS.length - 1, Math.floor((tier - 1) / 10));
  return {
    level,
    tier,
    rank: `${RANK_STEPS[rankBand]} T${tier}`,
    title: `Tier-${tier} Vanguard`,
  };
});

const baseStatsByTrack: Record<EntityTrack, CoreCombatStats> = {
  starship: { power: 140, offense: 95, defense: 80, hull: 120, shield: 90, speed: 125, initiative: 105, cargo: 140 },
  mothership: { power: 260, offense: 160, defense: 210, hull: 280, shield: 240, speed: 70, initiative: 65, cargo: 260 },
  unit: { power: 90, offense: 75, defense: 65, hull: 80, shield: 40, speed: 90, initiative: 85, cargo: 25 },
  defense: { power: 110, offense: 70, defense: 150, hull: 170, shield: 145, speed: 20, initiative: 25, cargo: 0 },
  commander: { power: 100, offense: 85, defense: 85, hull: 100, shield: 100, speed: 100, initiative: 120, cargo: 0 },
};

const scaleStat = (base: number, level: number, tier: number) => {
  const levelFactor = 1 + (level - 1) * 0.024;
  const tierFactor = 1 + (tier - 1) * 0.065;
  return Math.floor(base * levelFactor * tierFactor);
};

export function getTierForLevel(level: number) {
  const bounded = Math.max(1, Math.min(MAX_LEVEL, Math.floor(level)));
  return Math.min(MAX_TIER, Math.floor((bounded - 1) / 10) + 1);
}

export function getRankAndTitle(track: EntityTrack, level: number) {
  const boundedLevel = Math.max(1, Math.min(MAX_LEVEL, Math.floor(level)));
  const tier = getTierForLevel(boundedLevel);
  const rankBand = Math.min(RANK_STEPS.length - 1, Math.floor((tier - 1) / 10));
  return {
    rank: `${RANK_STEPS[rankBand]} T${tier}`,
    title: `${TITLE_PREFIX[track]} ${tier}.${((boundedLevel - 1) % 10) + 1}`,
  };
}

export function buildProgressionSnapshot(track: EntityTrack, level: number): ProgressionSnapshot {
  const boundedLevel = Math.max(1, Math.min(MAX_LEVEL, Math.floor(level)));
  const tier = getTierForLevel(boundedLevel);
  const base = baseStatsByTrack[track];
  const stats: CoreCombatStats = {
    power: scaleStat(base.power, boundedLevel, tier),
    offense: scaleStat(base.offense, boundedLevel, tier),
    defense: scaleStat(base.defense, boundedLevel, tier),
    hull: scaleStat(base.hull, boundedLevel, tier),
    shield: scaleStat(base.shield, boundedLevel, tier),
    speed: scaleStat(base.speed, boundedLevel, tier),
    initiative: scaleStat(base.initiative, boundedLevel, tier),
    cargo: scaleStat(base.cargo, boundedLevel, tier),
  };

  const attributes: CombatAttributes = {
    kinetic: Math.floor(stats.offense * 0.32),
    energy: Math.floor(stats.offense * 0.28),
    explosive: Math.floor(stats.offense * 0.22),
    shield: Math.floor(stats.shield * 0.65),
    armor: Math.floor(stats.defense * 0.6),
    evasion: Math.floor(stats.speed * 0.22),
    targeting: Math.floor(stats.initiative * 0.35),
    command: Math.floor((stats.power + tier * 5) * 0.1),
  };

  const subAttributes: CombatSubAttributes = {
    critChance: Math.min(65, 4 + Math.floor(tier * 0.5 + boundedLevel * 0.03)),
    critDamage: 125 + tier * 4,
    blockChance: Math.min(55, 3 + Math.floor(tier * 0.45)),
    penetration: Math.floor(attributes.kinetic * 0.12),
    resistance: Math.floor(attributes.armor * 0.15),
    regeneration: Math.floor((stats.hull + stats.shield) * 0.015),
    moraleImpact: Math.floor(attributes.command * 0.5),
    disruption: Math.floor(attributes.energy * 0.08),
  };

  const { rank, title } = getRankAndTitle(track, boundedLevel);
  const nextLevelExp = Math.floor(100 + boundedLevel * boundedLevel * 1.75);

  return {
    track,
    level: boundedLevel,
    tier,
    rank,
    title,
    stats,
    attributes,
    subAttributes,
    nextLevelExp,
  };
}

export const COMBAT_EFFECT_LIBRARY: CombatEffectTemplate[] = [
  { id: 'buff-command-overclock', name: 'Command Overclock', type: 'buff', category: 'damage', durationTurns: 3, stackLimit: 2, magnitude: 0.18, appliesTo: 'ally', description: 'Increases allied offense and initiative output.' },
  { id: 'buff-reactive-shields', name: 'Reactive Shields', type: 'buff', category: 'mitigation', durationTurns: 2, stackLimit: 1, magnitude: 0.25, appliesTo: 'self', description: 'Converts incoming burst damage into shield absorption.' },
  { id: 'buff-supply-surge', name: 'Supply Surge', type: 'buff', category: 'sustain', durationTurns: 4, stackLimit: 1, magnitude: 0.2, appliesTo: 'ally', description: 'Improves regeneration and morale recovery for the fleet.' },
  { id: 'debuff-target-lock', name: 'Target Lock', type: 'debuff', category: 'control', durationTurns: 2, stackLimit: 3, magnitude: 0.12, appliesTo: 'enemy', description: 'Reduces evasion and increases hit probability against the target.' },
  { id: 'debuff-armor-fracture', name: 'Armor Fracture', type: 'debuff', category: 'mitigation', durationTurns: 3, stackLimit: 2, magnitude: 0.16, appliesTo: 'enemy', description: 'Decreases armor efficiency and resistance layers.' },
  { id: 'debuff-engine-jam', name: 'Engine Jam', type: 'debuff', category: 'control', durationTurns: 2, stackLimit: 1, magnitude: 0.22, appliesTo: 'enemy', description: 'Slows speed and initiative to disrupt offensive tempo.' },
];

export const BATTLE_SYSTEM_PROFILES: BattleSystemProfile[] = [
  {
    mode: 'pve',
    maxRounds: 8,
    rapidFireMultiplier: 1.2,
    debrisFieldRate: 0.25,
    plunderRate: 0.35,
    retreatThreshold: 0.3,
    initiativeVariance: 0.12,
    moraleSwingFactor: 0.18,
    criticalImpactFactor: 1.35,
    description: 'PvE battles tuned for boss/NPC encounters and deterministic progression gains.',
  },
  {
    mode: 'pvp',
    maxRounds: 6,
    rapidFireMultiplier: 1.35,
    debrisFieldRate: 0.3,
    plunderRate: 0.4,
    retreatThreshold: 0.25,
    initiativeVariance: 0.18,
    moraleSwingFactor: 0.25,
    criticalImpactFactor: 1.5,
    description: 'PvP battles tuned for high-volatility commander-vs-commander engagements (OGame-like pacing).',
  },
];

export const EVENT_BOSSES: EventBossTemplate[] = [
  {
    id: 'boss-void-dreadnought',
    name: 'Void Dreadnought',
    tier: 35,
    level: 350,
    ...getRankAndTitle('mothership', 350),
    stats: buildProgressionSnapshot('mothership', 350).stats,
    attributes: buildProgressionSnapshot('mothership', 350).attributes,
    effects: ['debuff-engine-jam', 'debuff-armor-fracture'],
    rewardProfile: { credits: 600000, metal: 300000, crystal: 220000, deuterium: 150000, xp: 180000 },
  },
  {
    id: 'boss-emperor-flagship',
    name: 'Emperor Flagship',
    tier: 55,
    level: 550,
    ...getRankAndTitle('mothership', 550),
    stats: buildProgressionSnapshot('mothership', 550).stats,
    attributes: buildProgressionSnapshot('mothership', 550).attributes,
    effects: ['buff-reactive-shields', 'buff-command-overclock'],
    rewardProfile: { credits: 1200000, metal: 700000, crystal: 500000, deuterium: 380000, xp: 400000 },
  },
  {
    id: 'boss-omega-core',
    name: 'Omega Core Prime',
    tier: 85,
    level: 850,
    ...getRankAndTitle('mothership', 850),
    stats: buildProgressionSnapshot('mothership', 850).stats,
    attributes: buildProgressionSnapshot('mothership', 850).attributes,
    effects: ['debuff-target-lock', 'debuff-engine-jam', 'buff-reactive-shields'],
    rewardProfile: { credits: 2600000, metal: 1400000, crystal: 1100000, deuterium: 900000, xp: 900000 },
  },
];

export const NPC_WORLD_TEMPLATES: NpcWorldTemplate[] = [
  {
    id: 'npc-iron-bastion',
    name: 'Iron Bastion',
    tier: 28,
    level: 280,
    ...getRankAndTitle('defense', 280),
    defenseRating: 4200,
    economyRating: 2300,
    lootMultiplier: 1.15,
  },
  {
    id: 'npc-elysian-dome',
    name: 'Elysian Dome',
    tier: 47,
    level: 470,
    ...getRankAndTitle('defense', 470),
    defenseRating: 7200,
    economyRating: 5100,
    lootMultiplier: 1.35,
  },
  {
    id: 'npc-obsidian-citadel',
    name: 'Obsidian Citadel',
    tier: 76,
    level: 760,
    ...getRankAndTitle('defense', 760),
    defenseRating: 11800,
    economyRating: 8900,
    lootMultiplier: 1.65,
  },
];

export const UNIVERSE_EVENT_TEMPLATES: UniverseEventTemplate[] = [
  {
    id: 'event-cosmic-surge',
    name: 'Cosmic Surge',
    eventType: 'cosmic',
    recommendedTier: 20,
    recommendedLevel: 200,
    durationMinutes: 180,
    participationMode: 'mixed',
    rewards: { credits: 120000, resourcesMultiplier: 1.25, xp: 45000 },
    description: 'System-wide instability boosts production and combat volatility for all empires.',
  },
  {
    id: 'event-npc-incursion',
    name: 'NPC World Incursion',
    eventType: 'npcWorld',
    recommendedTier: 40,
    recommendedLevel: 400,
    durationMinutes: 240,
    participationMode: 'pve',
    rewards: { credits: 300000, resourcesMultiplier: 1.4, xp: 120000 },
    description: 'Hostile NPC worlds invade nearby sectors and can be raided for high rewards.',
  },
  {
    id: 'event-empire-boss-hunt',
    name: 'Empire Boss Hunt',
    eventType: 'boss',
    recommendedTier: 60,
    recommendedLevel: 600,
    durationMinutes: 300,
    participationMode: 'pve',
    rewards: { credits: 800000, resourcesMultiplier: 1.65, xp: 350000 },
    description: 'Empire-class boss fleets spawn and require alliance-scale engagement.',
  },
  {
    id: 'event-warfront-season',
    name: 'Warfront Season',
    eventType: 'allianceWar',
    recommendedTier: 50,
    recommendedLevel: 500,
    durationMinutes: 1440,
    participationMode: 'pvp',
    rewards: { credits: 500000, resourcesMultiplier: 1.35, xp: 210000 },
    description: 'Ranked alliance PvP cycle with territory points and debris-field bonuses.',
  },
];

export function getProgressionCatalogForTrack(track: EntityTrack) {
  return Array.from({ length: MAX_LEVEL }, (_, index) => buildProgressionSnapshot(track, index + 1));
}

export function getEventSystemSummary() {
  return {
    bossCount: EVENT_BOSSES.length,
    npcWorldCount: NPC_WORLD_TEMPLATES.length,
    universeEventCount: UNIVERSE_EVENT_TEMPLATES.length,
    maxTier: MAX_TIER,
    maxLevel: MAX_LEVEL,
  };
}