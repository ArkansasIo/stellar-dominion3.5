export type StoreCurrency = 'silver' | 'gold' | 'platinum';

export interface StorefrontItem {
  id: string;
  name: string;
  category: 'boosters' | 'cosmetics' | 'resources' | 'bundles';
  description: string;
  currency: StoreCurrency;
  price: number;
  grantItemId: string;
  grantQuantity: number;
  tags: string[];
}

export interface SeasonPassReward {
  tier: number;
  rewardType: 'currency' | 'item';
  currency?: StoreCurrency;
  amount?: number;
  itemId?: string;
  quantity?: number;
}

export interface BattlePassMissionTemplate {
  id: string;
  title: string;
  missionType: 'daily' | 'weekly' | 'seasonal';
  objectiveType: 'battle' | 'research' | 'economy' | 'exploration' | 'construction';
  objectiveTarget: number;
  xpReward: number;
}

export interface BattlePassReward {
  tier: number;
  rewardType: 'currency' | 'item';
  currency?: StoreCurrency;
  amount?: number;
  itemId?: string;
  quantity?: number;
}

export interface StoryMissionTemplate {
  missionCode: string;
  act: number;
  chapter: number;
  missionType: 'main' | 'side';
  title: string;
  description: string;
  npcName: string;
  difficulty: number;
  rewardXp: number;
  rewardMetal: number;
  rewardCrystal: number;
  rewardDeuterium: number;
}

export interface StoryActDefinition {
  act: number;
  title: string;
  synopsis: string;
}

export const STORY_TOTAL_ACTS = 12;
export const STORY_CHAPTERS_PER_ACT = 5;
export const STORY_MISSIONS_PER_ACT = 50;
export const STORY_MAIN_MISSIONS_PER_ACT = 25;
export const STORY_SIDE_MISSIONS_PER_ACT = STORY_MISSIONS_PER_ACT - STORY_MAIN_MISSIONS_PER_ACT;

const ACT_THEMES = [
  { title: 'Embers of Origin', npc: 'Archivist Kora', theme: 'colonial stabilization' },
  { title: 'Fractured Alliances', npc: 'Envoy Halden', theme: 'diplomatic conflict' },
  { title: 'Echoes of the Void', npc: 'Oracle Nira', theme: 'anomaly incursions' },
  { title: 'Siege of the Rift', npc: 'Marshal Vex', theme: 'multi-front war' },
  { title: 'Crown of the Stars', npc: 'Regent Solari', theme: 'endgame sovereignty' },
  { title: 'Veil of Mirrors', npc: 'Cipher Yva', theme: 'espionage and counter-intelligence' },
  { title: 'Iron Communion', npc: 'Warden Torin', theme: 'industrial mobilization' },
  { title: 'Tides of Helios', npc: 'Admiral Zeph', theme: 'deep-space naval campaigns' },
  { title: 'Ashen Tribunal', npc: 'Magistrate Kheir', theme: 'civil unrest and tribunal politics' },
  { title: 'Stormline Ascendant', npc: 'Pathfinder Ryl', theme: 'frontier expansion under hostile skies' },
  { title: 'Shattered Zenith', npc: 'Highseer Vale', theme: 'ancient superweapon race' },
  { title: 'Dominion Eternal', npc: 'Sovereign Ardent', theme: 'final convergence and galactic rule' },
] as const;

const STORE_CATALOG_BLUEPRINT: Array<Omit<StorefrontItem, 'grantItemId'>> = [
  {
    id: 'store-booster-1',
    name: 'Research Booster Pack',
    category: 'boosters',
    description: 'Short-term acceleration pack for research and commander XP gain.',
    currency: 'gold',
    price: 140,
    grantQuantity: 1,
    tags: ['research', 'xp', 'booster'],
  },
  {
    id: 'store-cosmetic-1',
    name: 'Command Banner: Nebula Crest',
    category: 'cosmetics',
    description: 'A premium commander banner cosmetic with animated crest effects.',
    currency: 'platinum',
    price: 12,
    grantQuantity: 1,
    tags: ['cosmetic', 'banner'],
  },
  {
    id: 'store-resource-1',
    name: 'Strategic Resource Crate',
    category: 'resources',
    description: 'A crate containing mixed strategic materials for expansion rushes.',
    currency: 'silver',
    price: 20000,
    grantQuantity: 5,
    tags: ['resources', 'crate'],
  },
  {
    id: 'store-bundle-1',
    name: 'Frontier Expansion Bundle',
    category: 'bundles',
    description: 'Balanced set of consumables and tactical modules for campaign progression.',
    currency: 'gold',
    price: 300,
    grantQuantity: 1,
    tags: ['bundle', 'expansion'],
  },
  {
    id: 'store-booster-2',
    name: 'Fleet Supremacy Charge',
    category: 'boosters',
    description: 'Temporary fleet performance module for combat-heavy missions.',
    currency: 'gold',
    price: 110,
    grantQuantity: 1,
    tags: ['fleet', 'combat', 'booster'],
  },
  {
    id: 'store-booster-3',
    name: 'Season XP Accelerator',
    category: 'boosters',
    description: 'Boosts seasonal progression efficiency for limited-time operations.',
    currency: 'gold',
    price: 95,
    grantQuantity: 1,
    tags: ['season', 'xp', 'booster'],
  },
  {
    id: 'store-cosmetic-2',
    name: 'Dockyard Skin: Obsidian Frame',
    category: 'cosmetics',
    description: 'Dark metallic visual theme for shipyards and fleet docks.',
    currency: 'platinum',
    price: 18,
    grantQuantity: 1,
    tags: ['cosmetic', 'dockyard'],
  },
  {
    id: 'store-cosmetic-3',
    name: 'Bridge Theme: Azure Vector',
    category: 'cosmetics',
    description: 'High-contrast bridge skin for command interfaces.',
    currency: 'platinum',
    price: 14,
    grantQuantity: 1,
    tags: ['cosmetic', 'bridge'],
  },
  {
    id: 'store-resource-2',
    name: 'Rapid Foundry Metals',
    category: 'resources',
    description: 'Dense industrial shipment for emergency shipyard cycles.',
    currency: 'silver',
    price: 32000,
    grantQuantity: 8,
    tags: ['resources', 'metal'],
  },
  {
    id: 'store-resource-3',
    name: 'Crystal Conduit Cache',
    category: 'resources',
    description: 'Refined crystal reserves for advanced research chains.',
    currency: 'silver',
    price: 36000,
    grantQuantity: 8,
    tags: ['resources', 'crystal'],
  },
  {
    id: 'store-bundle-2',
    name: 'Story Operations Kit',
    category: 'bundles',
    description: 'Narrative progression support crate for story mission runs.',
    currency: 'gold',
    price: 260,
    grantQuantity: 1,
    tags: ['story', 'bundle'],
  },
  {
    id: 'store-bundle-3',
    name: 'Season Vanguard Bundle',
    category: 'bundles',
    description: 'Premium bundle aligned with season pass grind and unlock goals.',
    currency: 'platinum',
    price: 22,
    grantQuantity: 1,
    tags: ['season', 'bundle', 'premium'],
  },
];

export const STOREFRONT_ITEMS: StorefrontItem[] = STORE_CATALOG_BLUEPRINT.map((item) => ({
  ...item,
  grantItemId: `reward-${item.id}`,
}));

export const SEASON_PASS_CONFIG = {
  seasonId: 'season-alpha-01',
  name: 'Ascension Front',
  unlockTracks: {
    gold: {
      currency: 'gold' as const,
      cost: 950,
    },
    platinum: {
      currency: 'platinum' as const,
      cost: 25,
    },
  },
  maxTier: 100,
  xpPerTier: 1200,
  freeRewards: Array.from({ length: 100 }, (_, index): SeasonPassReward => {
    const tier = index + 1;
    if (tier % 10 === 0) {
      return { tier, rewardType: 'currency', currency: 'gold', amount: 50 + tier * 2 };
    }

    return {
      tier,
      rewardType: 'currency',
      currency: 'silver',
      amount: 1000 + tier * 125,
    };
  }),
  goldRewards: Array.from({ length: 100 }, (_, index): SeasonPassReward => {
    const tier = index + 1;

    if (tier % 10 === 0) {
      return {
        tier,
        rewardType: 'item',
        itemId: `season-gold-crate-${tier}`,
        quantity: 1,
      };
    }

    if (tier % 5 === 0) {
      return {
        tier,
        rewardType: 'currency',
        currency: 'gold',
        amount: 35 + tier,
      };
    }

    return {
      tier,
      rewardType: 'currency',
      currency: 'silver',
      amount: 1800 + tier * 130,
    };
  }),
  platinumRewards: Array.from({ length: 100 }, (_, index): SeasonPassReward => {
    const tier = index + 1;

    if (tier % 5 === 0) {
      return {
        tier,
        rewardType: 'item',
        itemId: `season-platinum-crate-${tier}`,
        quantity: 1,
      };
    }

    return {
      tier,
      rewardType: 'currency',
      currency: 'gold',
      amount: 20 + tier,
    };
  }),
};

export const BATTLE_PASS_CONFIG = {
  battlePassId: 'battlepass-omega-01',
  name: 'Warfront Omega',
  seasonAlignment: SEASON_PASS_CONFIG.seasonId,
  maxTier: 90,
  xpPerTier: 900,
  unlockTracks: {
    premium: {
      currency: 'gold' as const,
      cost: 1100,
    },
    elite: {
      currency: 'platinum' as const,
      cost: 30,
    },
  },
  freeRewards: Array.from({ length: 90 }, (_, index): BattlePassReward => {
    const tier = index + 1;
    if (tier % 15 === 0) {
      return {
        tier,
        rewardType: 'item',
        itemId: `battle-free-cache-${tier}`,
        quantity: 1,
      };
    }

    return {
      tier,
      rewardType: 'currency',
      currency: 'silver',
      amount: 1200 + tier * 135,
    };
  }),
  premiumRewards: Array.from({ length: 90 }, (_, index): BattlePassReward => {
    const tier = index + 1;
    if (tier % 10 === 0) {
      return {
        tier,
        rewardType: 'item',
        itemId: `battle-premium-cache-${tier}`,
        quantity: 1,
      };
    }

    return {
      tier,
      rewardType: 'currency',
      currency: 'gold',
      amount: 18 + tier,
    };
  }),
  eliteRewards: Array.from({ length: 90 }, (_, index): BattlePassReward => {
    const tier = index + 1;
    if (tier % 6 === 0) {
      return {
        tier,
        rewardType: 'item',
        itemId: `battle-elite-cache-${tier}`,
        quantity: 1,
      };
    }

    return {
      tier,
      rewardType: 'currency',
      currency: 'gold',
      amount: 32 + tier,
    };
  }),
} as const;

export const BATTLE_PASS_MISSIONS: BattlePassMissionTemplate[] = [
  ...Array.from({ length: 10 }, (_, index): BattlePassMissionTemplate => ({
    id: `battle-daily-${index + 1}`,
    title: `Daily Sortie ${index + 1}`,
    missionType: 'daily',
    objectiveType: 'battle',
    objectiveTarget: 1 + index,
    xpReward: 120 + index * 20,
  })),
  ...Array.from({ length: 10 }, (_, index): BattlePassMissionTemplate => ({
    id: `battle-weekly-${index + 1}`,
    title: `Weekly Campaign ${index + 1}`,
    missionType: 'weekly',
    objectiveType: 'construction',
    objectiveTarget: 4 + index,
    xpReward: 520 + index * 35,
  })),
  ...Array.from({ length: 10 }, (_, index): BattlePassMissionTemplate => ({
    id: `battle-seasonal-${index + 1}`,
    title: `Season Directive ${index + 1}`,
    missionType: 'seasonal',
    objectiveType: index % 2 === 0 ? 'research' : 'exploration',
    objectiveTarget: 8 + index,
    xpReward: 980 + index * 65,
  })),
];

export function getStoreItemsByCategory(category: StorefrontItem['category']): StorefrontItem[] {
  return STOREFRONT_ITEMS.filter((item) => item.category === category);
}

export function getStoreFeaturedItems(limit = 6): StorefrontItem[] {
  return [...STOREFRONT_ITEMS]
    .sort((left, right) => right.price - left.price)
    .slice(0, Math.max(1, limit));
}

export function calculateStorePurchaseTotals(itemId: string, quantity: number) {
  const item = STOREFRONT_ITEMS.find((entry) => entry.id === itemId);
  if (!item || quantity <= 0) {
    return null;
  }

  const safeQuantity = Math.max(1, Math.floor(quantity));
  return {
    item,
    quantity: safeQuantity,
    totalCost: item.price * safeQuantity,
    totalGrantQuantity: item.grantQuantity * safeQuantity,
  };
}

export function getSeasonPassTrackReward(tier: number, track: 'free' | 'gold' | 'platinum'): SeasonPassReward | undefined {
  const rewards =
    track === 'free'
      ? SEASON_PASS_CONFIG.freeRewards
      : track === 'gold'
        ? SEASON_PASS_CONFIG.goldRewards
        : SEASON_PASS_CONFIG.platinumRewards;
  return rewards.find((entry) => entry.tier === tier);
}

export function getSeasonPassTierProgress(xp: number) {
  const safeXp = Math.max(0, Math.floor(xp));
  const currentTier = Math.min(SEASON_PASS_CONFIG.maxTier, Math.floor(safeXp / SEASON_PASS_CONFIG.xpPerTier) + 1);
  const xpIntoTier = safeXp % SEASON_PASS_CONFIG.xpPerTier;
  return {
    xp: safeXp,
    currentTier,
    xpIntoTier,
    xpForNextTier: SEASON_PASS_CONFIG.xpPerTier,
    completionRatio: Number((xpIntoTier / SEASON_PASS_CONFIG.xpPerTier).toFixed(4)),
  };
}

export function getBattlePassTrackReward(tier: number, track: 'free' | 'premium' | 'elite'): BattlePassReward | undefined {
  const rewards =
    track === 'free'
      ? BATTLE_PASS_CONFIG.freeRewards
      : track === 'premium'
        ? BATTLE_PASS_CONFIG.premiumRewards
        : BATTLE_PASS_CONFIG.eliteRewards;
  return rewards.find((entry) => entry.tier === tier);
}

export function getBattlePassTierProgress(xp: number) {
  const safeXp = Math.max(0, Math.floor(xp));
  const currentTier = Math.min(BATTLE_PASS_CONFIG.maxTier, Math.floor(safeXp / BATTLE_PASS_CONFIG.xpPerTier) + 1);
  const xpIntoTier = safeXp % BATTLE_PASS_CONFIG.xpPerTier;
  return {
    xp: safeXp,
    currentTier,
    xpIntoTier,
    xpForNextTier: BATTLE_PASS_CONFIG.xpPerTier,
    completionRatio: Number((xpIntoTier / BATTLE_PASS_CONFIG.xpPerTier).toFixed(4)),
  };
}

export const STORY_ACTS: StoryActDefinition[] = ACT_THEMES.map((theme, index) => ({
  act: index + 1,
  title: theme.title,
  synopsis: `Act ${index + 1} focuses on ${theme.theme}, escalating your empire toward stellar dominion.`,
}));

const MAIN_MISSIONS_PER_CHAPTER = Math.max(1, Math.floor(STORY_MAIN_MISSIONS_PER_ACT / STORY_CHAPTERS_PER_ACT));
const SIDE_MISSIONS_PER_CHAPTER = Math.max(1, Math.floor(STORY_SIDE_MISSIONS_PER_ACT / STORY_CHAPTERS_PER_ACT));

function createMainMission(act: number, indexWithinAct: number): StoryMissionTemplate {
  const theme = ACT_THEMES[act - 1];
  const chapter = Math.min(STORY_CHAPTERS_PER_ACT, Math.floor((indexWithinAct - 1) / MAIN_MISSIONS_PER_CHAPTER) + 1);
  const missionNumber = (act - 1) * STORY_MAIN_MISSIONS_PER_ACT + indexWithinAct;
  const difficultyBase = Math.min(10, 1 + Math.floor((act + chapter) / 2));

  return {
    missionCode: `ACT${act}-MAIN-${indexWithinAct}`,
    act,
    chapter,
    missionType: 'main',
    title: `${theme.title}: Operation ${missionNumber}`,
    description: `Advance the primary war effort through chapter ${chapter} operations in ${theme.theme}.`,
    npcName: theme.npc,
    difficulty: difficultyBase,
    rewardXp: 350 + missionNumber * 15,
    rewardMetal: 450 + missionNumber * 32,
    rewardCrystal: 280 + missionNumber * 28,
    rewardDeuterium: 210 + missionNumber * 22,
  };
}

function createSideMission(act: number, indexWithinAct: number): StoryMissionTemplate {
  const theme = ACT_THEMES[act - 1];
  const chapter = Math.min(STORY_CHAPTERS_PER_ACT, Math.floor((indexWithinAct - 1) / SIDE_MISSIONS_PER_CHAPTER) + 1);
  const missionNumber = (act - 1) * STORY_SIDE_MISSIONS_PER_ACT + indexWithinAct;

  return {
    missionCode: `ACT${act}-SIDE-${indexWithinAct}`,
    act,
    chapter,
    missionType: 'side',
    title: `${theme.title}: Auxiliary Directive ${missionNumber}`,
    description: `Optional side objective tied to ${theme.theme}, unlocking support rewards.`,
    npcName: `${theme.npc} Liaison`,
    difficulty: Math.min(10, 1 + Math.floor((act + chapter + 1) / 2)),
    rewardXp: 220 + missionNumber * 12,
    rewardMetal: 280 + missionNumber * 20,
    rewardCrystal: 190 + missionNumber * 16,
    rewardDeuterium: 130 + missionNumber * 14,
  };
}

export const STORY_MAIN_MISSIONS: StoryMissionTemplate[] = Array.from({ length: STORY_TOTAL_ACTS }, (_, actIndex) => {
  const act = actIndex + 1;
  return Array.from({ length: STORY_MAIN_MISSIONS_PER_ACT }, (_, missionIndex) => createMainMission(act, missionIndex + 1));
}).flat();

export const STORY_SIDE_MISSIONS: StoryMissionTemplate[] = Array.from({ length: STORY_TOTAL_ACTS }, (_, actIndex) => {
  const act = actIndex + 1;
  return Array.from({ length: STORY_SIDE_MISSIONS_PER_ACT }, (_, sideIndex) => createSideMission(act, sideIndex + 1));
}).flat();

// Backward-compatible alias retained for older imports.
export const STORY_MAIN_MISSIONS_50 = STORY_MAIN_MISSIONS;

export const STORY_MISSIONS_ALL: StoryMissionTemplate[] = [
  ...STORY_MAIN_MISSIONS,
  ...STORY_SIDE_MISSIONS,
];
