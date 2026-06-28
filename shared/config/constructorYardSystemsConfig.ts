/**
 * Constructor Yard Systems Configuration
 * - Mothership Constructor Yard
 * - Starship Shipyard
 *
 * Ranges:
 * - Rarity: 1-9
 * - Tier: 1-99
 * - Level: 1-999
 */

export type YardDomain = 'mothership' | 'starship';

export interface YardStats {
  hull: number;
  shields: number;
  firepower: number;
  speed: number;
  accuracy: number;
  cargo: number;
}

export interface YardSubStats {
  critChance: number;
  evasion: number;
  resistance: number;
  regen: number;
  fuelEfficiency: number;
  commandSync: number;
}

export interface YardEffect {
  id: string;
  name: string;
  value: number;
  unit: '%' | 'flat';
  description: string;
}

export interface YardBuff {
  id: string;
  name: string;
  value: number;
  durationSec: number;
  description: string;
}

export interface YardDebuff {
  id: string;
  name: string;
  value: number;
  durationSec: number;
  description: string;
}

export interface YardEntry {
  id: string;
  code: string;
  domain: YardDomain;
  name: string;
  class: string;
  subClass: string;
  type: string;
  subType: string;
  tier: number; // 1-99
  rarity: number; // 1-9
  requiredLevel: number; // 1-999
  maxLevel: number; // 999
  rankTitle: string;
  description: string;
  subDescription: string;
  stats: YardStats;
  subStats: YardSubStats;
  effects: YardEffect[];
  buffs: YardBuff[];
  debuffs: YardDebuff[];
  baseUpgradeCost: {
    metal: number;
    crystal: number;
    deuterium: number;
  };
  baseUpgradeTimeSec: number;
}

const MOTHERSHIP_CLASSES = ['Flag Core', 'Siege Core', 'Support Core', 'Carrier Core', 'Command Core'] as const;
const MOTHERSHIP_SUB_CLASSES = ['Atlas', 'Leviathan', 'Bastion', 'Aegis', 'Ascendant'] as const;
const MOTHERSHIP_TYPES = ['Fortress', 'Assault', 'Logistics', 'Intel', 'Terraform'] as const;
const MOTHERSHIP_SUB_TYPES = ['Prime', 'Vanguard', 'Sentinel', 'Overlord', 'Dominion'] as const;

const STARSHIP_CLASSES = ['Interceptor', 'Frigate', 'Cruiser', 'Battleship', 'Dreadnought'] as const;
const STARSHIP_SUB_CLASSES = ['Raider', 'Guardian', 'Skirmisher', 'Arbiter', 'Executioner'] as const;
const STARSHIP_TYPES = ['Kinetic', 'Energy', 'Missile', 'Hybrid', 'Disruptor'] as const;
const STARSHIP_SUB_TYPES = ['Burst', 'Sustained', 'Precision', 'Siege', 'Adaptive'] as const;

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function rankTitleForTier(tier: number): string {
  if (tier <= 9) return `Cadet-${tier}`;
  if (tier <= 19) return `Ensign-${tier - 9}`;
  if (tier <= 29) return `Lieutenant-${tier - 19}`;
  if (tier <= 39) return `Commander-${tier - 29}`;
  if (tier <= 49) return `Captain-${tier - 39}`;
  if (tier <= 59) return `Commodore-${tier - 49}`;
  if (tier <= 69) return `RearAdmiral-${tier - 59}`;
  if (tier <= 79) return `ViceAdmiral-${tier - 69}`;
  if (tier <= 89) return `Admiral-${tier - 79}`;
  return `GrandAdmiral-${tier - 89}`;
}

function createEntry(domain: YardDomain, tier: number): YardEntry {
  const index = tier - 1;
  const rarity = clamp(Math.ceil(tier / 11), 1, 9);
  const requiredLevel = clamp(1 + (tier - 1) * 10, 1, 999);

  const classes = domain === 'mothership' ? MOTHERSHIP_CLASSES : STARSHIP_CLASSES;
  const subClasses = domain === 'mothership' ? MOTHERSHIP_SUB_CLASSES : STARSHIP_SUB_CLASSES;
  const types = domain === 'mothership' ? MOTHERSHIP_TYPES : STARSHIP_TYPES;
  const subTypes = domain === 'mothership' ? MOTHERSHIP_SUB_TYPES : STARSHIP_SUB_TYPES;

  const cls = classes[index % classes.length];
  const subClass = subClasses[index % subClasses.length];
  const type = types[index % types.length];
  const subType = subTypes[index % subTypes.length];

  const base = domain === 'mothership' ? 220 : 140;
  const scalar = 1 + tier * 0.08;

  return {
    id: `${domain}-yard-tier-${String(tier).padStart(2, '0')}`,
    code: `${domain.substring(0, 3).toUpperCase()}-T${String(tier).padStart(2, '0')}`,
    domain,
    name: `${domain === 'mothership' ? 'Mothership' : 'Starship'} ${cls} ${tier}`,
    class: cls,
    subClass,
    type,
    subType,
    tier,
    rarity,
    requiredLevel,
    maxLevel: 999,
    rankTitle: rankTitleForTier(tier),
    description: `${cls} platform with ${type} doctrine tuned for tier ${tier} operations.`,
    subDescription: `${subClass} ${subType} profile for ${domain} constructor yard progression.`,
    stats: {
      hull: Math.floor(base * scalar * 2.2),
      shields: Math.floor(base * scalar * 1.9),
      firepower: Math.floor(base * scalar * 2.1),
      speed: Math.floor(base * 0.6 + tier * (domain === 'mothership' ? 2 : 4)),
      accuracy: Math.floor(base * 0.5 + tier * 3),
      cargo: Math.floor(base * scalar * (domain === 'mothership' ? 2.8 : 1.3)),
    },
    subStats: {
      critChance: Number((2 + tier * 0.2).toFixed(2)),
      evasion: Number((3 + tier * 0.18).toFixed(2)),
      resistance: Number((5 + tier * 0.25).toFixed(2)),
      regen: Number((1 + tier * 0.15).toFixed(2)),
      fuelEfficiency: Number((4 + tier * 0.22).toFixed(2)),
      commandSync: Number((3 + tier * 0.2).toFixed(2)),
    },
    effects: [
      {
        id: `${domain}-effect-attack-${tier}`,
        name: 'Tactical Output',
        value: Number((4 + tier * 0.35).toFixed(2)),
        unit: '%',
        description: 'Increases total offensive system output.',
      },
      {
        id: `${domain}-effect-defense-${tier}`,
        name: 'Defensive Matrix',
        value: Number((3 + tier * 0.3).toFixed(2)),
        unit: '%',
        description: 'Improves shield and hull mitigation layers.',
      },
    ],
    buffs: [
      {
        id: `${domain}-buff-overclock-${tier}`,
        name: 'Overclock Pulse',
        value: Number((5 + tier * 0.28).toFixed(2)),
        durationSec: 600,
        description: 'Temporary increase to firepower and speed output.',
      },
      {
        id: `${domain}-buff-efficiency-${tier}`,
        name: 'Logistics Surge',
        value: Number((4 + tier * 0.22).toFixed(2)),
        durationSec: 900,
        description: 'Temporary reduction in fuel usage and queue delay.',
      },
    ],
    debuffs: [
      {
        id: `${domain}-debuff-heat-${tier}`,
        name: 'Thermal Saturation',
        value: Number((2 + tier * 0.2).toFixed(2)),
        durationSec: 300,
        description: 'Reduces regen while systems cool down after heavy use.',
      },
      {
        id: `${domain}-debuff-drift-${tier}`,
        name: 'Target Drift',
        value: Number((1.5 + tier * 0.12).toFixed(2)),
        durationSec: 240,
        description: 'Slight temporary reduction in precision handling.',
      },
    ],
    baseUpgradeCost: {
      metal: Math.floor((domain === 'mothership' ? 18000 : 9000) * (1 + tier * 0.14)),
      crystal: Math.floor((domain === 'mothership' ? 12000 : 7000) * (1 + tier * 0.14)),
      deuterium: Math.floor((domain === 'mothership' ? 9000 : 5000) * (1 + tier * 0.14)),
    },
    baseUpgradeTimeSec: Math.floor((domain === 'mothership' ? 1800 : 900) * (1 + tier * 0.06)),
  };
}

function generateEntries(domain: YardDomain): YardEntry[] {
  return Array.from({ length: 99 }, (_, i) => createEntry(domain, i + 1));
}

export const MOTHERSHIP_CONSTRUCTOR_YARD_99: YardEntry[] = generateEntries('mothership');
export const STARSHIP_SHIPYARD_99: YardEntry[] = generateEntries('starship');

export const CONSTRUCTOR_YARD_CATALOG = [...MOTHERSHIP_CONSTRUCTOR_YARD_99, ...STARSHIP_SHIPYARD_99];

export const CONSTRUCTOR_YARD_META = {
  totalEntries: CONSTRUCTOR_YARD_CATALOG.length,
  domains: {
    mothership: MOTHERSHIP_CONSTRUCTOR_YARD_99.length,
    starship: STARSHIP_SHIPYARD_99.length,
  },
  ranges: {
    rarity: { min: 1, max: 9 },
    tier: { min: 1, max: 99 },
    level: { min: 1, max: 999 },
  },
};

export function getYardEntriesByDomain(domain: YardDomain): YardEntry[] {
  return CONSTRUCTOR_YARD_CATALOG.filter((entry) => entry.domain === domain);
}

export function getYardEntryById(id: string): YardEntry | undefined {
  return CONSTRUCTOR_YARD_CATALOG.find((entry) => entry.id === id);
}

export function getYardEntriesByRarity(rarity: number): YardEntry[] {
  const safe = clamp(Math.floor(rarity), 1, 9);
  return CONSTRUCTOR_YARD_CATALOG.filter((entry) => entry.rarity === safe);
}

export function getYardEntriesByTierRange(minTier: number, maxTier: number): YardEntry[] {
  const minSafe = clamp(Math.floor(minTier), 1, 99);
  const maxSafe = clamp(Math.floor(maxTier), minSafe, 99);
  return CONSTRUCTOR_YARD_CATALOG.filter((entry) => entry.tier >= minSafe && entry.tier <= maxSafe);
}

export function calculateYardUpgradeCost(entry: YardEntry, currentLevel: number, targetLevel: number) {
  const start = clamp(currentLevel, 1, 999);
  const target = clamp(targetLevel, start, 999);
  const steps = target - start;
  const scale = Math.pow(1.045, Math.max(0, start - 1));

  return {
    metal: Math.floor(entry.baseUpgradeCost.metal * steps * scale),
    crystal: Math.floor(entry.baseUpgradeCost.crystal * steps * scale),
    deuterium: Math.floor(entry.baseUpgradeCost.deuterium * steps * scale),
  };
}

export function calculateYardUpgradeTimeSec(entry: YardEntry, currentLevel: number, targetLevel: number): number {
  const start = clamp(currentLevel, 1, 999);
  const target = clamp(targetLevel, start, 999);
  const steps = target - start;
  const scale = Math.pow(1.02, Math.max(0, entry.tier - 1));
  return Math.max(30, Math.floor(entry.baseUpgradeTimeSec * Math.max(1, steps) * scale));
}

export function calculateYardScaledStats(entry: YardEntry, level: number): YardStats {
  const safeLevel = clamp(level, 1, 999);
  const levelScale = Math.pow(1.012, safeLevel - 1);

  return {
    hull: Math.floor(entry.stats.hull * levelScale),
    shields: Math.floor(entry.stats.shields * levelScale),
    firepower: Math.floor(entry.stats.firepower * levelScale),
    speed: Math.floor(entry.stats.speed * Math.pow(1.006, safeLevel - 1)),
    accuracy: Math.floor(entry.stats.accuracy * Math.pow(1.008, safeLevel - 1)),
    cargo: Math.floor(entry.stats.cargo * Math.pow(1.01, safeLevel - 1)),
  };
}

export function calculateYardScaledSubStats(entry: YardEntry, level: number): YardSubStats {
  const safeLevel = clamp(level, 1, 999);
  const bonus = safeLevel * 0.02;

  return {
    critChance: Number((entry.subStats.critChance + bonus).toFixed(2)),
    evasion: Number((entry.subStats.evasion + bonus).toFixed(2)),
    resistance: Number((entry.subStats.resistance + bonus).toFixed(2)),
    regen: Number((entry.subStats.regen + bonus).toFixed(2)),
    fuelEfficiency: Number((entry.subStats.fuelEfficiency + bonus).toFixed(2)),
    commandSync: Number((entry.subStats.commandSync + bonus).toFixed(2)),
  };
}
