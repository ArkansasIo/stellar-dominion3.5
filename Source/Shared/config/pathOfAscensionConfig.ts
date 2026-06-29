export type AscensionMissionCategory = "combat" | "mining" | "exploration" | "crafting" | "research" | "trading" | "social" | "diplomacy" | "construction" | "fleet";
export type AscensionMissionDifficulty = "trivial" | "easy" | "medium" | "hard" | "epic" | "legendary";

export interface AscensionTier {
  tier: number;
  name: string;
  title: string;
  description: string;
  xpRequired: number;
  totalXpRequired: number;
  resourceMultiplier: number;
  combatBonus: number;
  miningBonus: number;
  researchBonus: number;
  tradeBonus: number;
  fleetCapacity: number;
  missionCount: number;
  missions: AscensionMission[];
  tierReward: { xp: number; credits: number; resources: { metal: number; crystal: number; deuterium: number } };
}

export interface AscensionMission {
  id: string;
  title: string;
  description: string;
  category: AscensionMissionCategory;
  difficulty: AscensionMissionDifficulty;
  objectiveType: string;
  objectiveTarget: number;
  xpReward: number;
  creditReward: number;
  resourceReward: { metal: number; crystal: number; deuterium: number };
}

export interface AscensionPlayerProgress {
  currentTier: number;
  currentTierXp: number;
  totalXp: number;
  completedMissions: string[];
  claimedTiers: number[];
  unlockedUpToTier: number;
}

const TIER_NAMES: [number, string][] = [
  [1, "Dust Walker"], [2, "Scrap Collector"], [3, "Salvage Runner"], [4, "Junkyard Scout"], [5, "Waste Picker"],
  [6, "Scrap Mechanic"], [7, "Jury-Rigger"], [8, "Parts Scavenger"], [9, "Salvage Chief"], [10, "Junkyard Boss"],
  [11, "Scrap Baron"], [12, "Salvage Lord"], [13, "Wreckage King"], [14, "Junkyard Emperor"], [15, "Scrap Sovereign"],
  [16, "Metal Seeker"], [17, "Ore Hunter"], [18, "Mineral Prospector"], [19, "Crystal Gatherer"], [20, "Deep Miner"],
  [21, "Core Extractor"], [22, "Asteroid Breaker"], [23, "Planet Crusher"], [24, "Resource Baron"], [25, "Mining Overlord"],
  [26, "Hull Builder"], [27, "Frame Welder"], [28, "Shipwright"], [29, "Hull Master"], [30, "Vessel Architect"],
  [31, "Fleet Designer"], [32, "Naval Engineer"], [33, "Capital Shaper"], [34, "Titan Forger"], [35, "Dreadnought Smith"],
  [36, "Scout Pilot"], [37, "Pathfinder"], [38, "Trailblazer"], [39, "Explorer"], [40, "Void Walker"],
  [41, "Star Wanderer"], [42, "Sector Surveyor"], [43, "Galaxy Cartographer"], [44, "Universe Mapper"], [45, "Cosmic Voyager"],
  [46, "Laser Jockey"], [47, "Plasma Technician"], [48, "Energy Specialist"], [49, "Photon Engineer"], [50, "Radiance Master"],
  [51, "Shield Warden"], [52, "Defense Architect"], [53, "Fortress Builder"], [54, "Barrier Lord"], [55, "Bastion Commander"],
  [56, "Fleet Lieutenant"], [57, "Squad Leader"], [58, "Wing Commander"], [59, "Battle Admiral"], [60, "Fleet Marshal"],
  [61, "Diplomat"], [62, "Envoy"], [63, "Ambassador"], [64, "Chancellor"], [65, "Imperial Emissary"],
  [66, "Trade Runner"], [67, "Merchant Captain"], [68, "Trade Baron"], [69, "Commerce Lord"], [70, "Trade Emperor"],
  [71, "Tech Adept"], [72, "Science Officer"], [73, "Research Director"], [74, "Innovation Chief"], [75, "Tech Sovereign"],
  [76, "Battalion Leader"], [77, "Regiment Commander"], [78, "Division General"], [79, "Army Marshal"], [80, "War Commander"],
  [81, "Station Commander"], [82, "Platform Governor"], [83, "Orbital Architect"], [84, "Megastructure Designer"], [85, "Star Builder"],
  [86, "Void Admiral"], [87, "Deep Space Lord"], [88, "Cosmic Warden"], [89, "Galaxy Guardian"], [90, "Universe Protector"],
  [91, "Transcendent Commander"], [92, "Immortal Admiral"], [93, "Celestial Sovereign"], [94, "Divine Architect"], [95, "Titan Supreme"],
  [96, "Eternal Overlord"], [97, "Omniscient Ruler"], [98, "Almighty Emperor"], [99, "Absolute Dominion"],
];

const CATEGORY_TITLES: Record<AscensionMissionCategory, string[]> = {
  combat: ["Destroy", "Eliminate", "Annihilate", "Purge", "Eradicate", "Crush", "Obliterate", "Vanquish"],
  mining: ["Extract", "Harvest", "Mine", "Gather", "Collect", "Procure", "Reap", "Glean"],
  exploration: ["Explore", "Survey", "Chart", "Map", "Discover", "Investigate", "Scan", "Probe"],
  crafting: ["Construct", "Fabricate", "Build", "Forge", "Assemble", "Manufacture", "Produce", "Engineer"],
  research: ["Research", "Analyze", "Study", "Investigate", "Experiment", "Theorize", "Develop", "Unlock"],
  trading: ["Trade", "Sell", "Purchase", "Exchange", "Broker", "Negotiate", "Barter", "Commerce"],
  social: ["Donate", "Contribute", "Support", "Aid", "Strengthen", "Unify", "Rally", "Mobilize"],
  diplomacy: ["Negotiate", "Diplomatize", "Mediate", "Treaty", "Alliance", "Accord", "Pact", "Compact"],
  construction: ["Build", "Construct", "Establish", "Erect", "Assemble", "Commission", "Launch", "Deploy"],
  fleet: ["Command", "Lead", "Deploy", "Coordinate", "Organize", "Manage", "Direct", "Orchestrate"],
};

const OBJECTIVE_TYPES: Record<AscensionMissionCategory, string[]> = {
  combat: ["destroy_ships", "boss_kills", "pvp_wins", "raid_clears", "defense_wins", "fleet_battles"],
  mining: ["mine_metal", "mine_crystal", "produce_deuterium", "mine_rare", "asteroid_break", "deep_core"],
  exploration: ["explore_systems", "anomaly_scan", "wormhole_chart", "signal_trace", "planet_survey", "sector_map"],
  crafting: ["craft_ships", "craft_equipment", "craft_modules", "build_structures", "refine_materials", "manufacture"],
  research: ["research_tech", "unlock_tech", "study_anomaly", "analyze_data", "develop_proto", "complete_study"],
  trading: ["market_trades", "sell_resources", "buy_resources", "trade_profit", "bulk_trade", "rare_trade"],
  social: ["alliance_donate", "guild_event", "help_ally", "resource_share", "training_boost", "morale_boost"],
  diplomacy: ["trade_agreement", "non_aggression", "defense_pact", "open_borders", "cultural_exchange", "summit"],
  construction: ["build_mining", "build_military", "build_research", "build_habitat", "upgrade_station", "expand_base"],
  fleet: ["train_fleet", "upgrade_fleet", "deploy_fleet", "fleet_maneuver", "fleet_battle", "fleet_return"],
};

const TARGETS_PER_CATEGORY: Record<AscensionMissionCategory, [number, number]> = {
  combat: [3, 200],
  mining: [500, 500000],
  exploration: [1, 50],
  crafting: [1, 30],
  research: [1, 15],
  trading: [5, 500],
  social: [100, 10000],
  diplomacy: [1, 20],
  construction: [1, 25],
  fleet: [1, 40],
};

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function generateMissionsForTier(tier: number, count: number): AscensionMission[] {
  const rng = seededRandom(tier * 7919 + 1337);
  const categories: AscensionMissionCategory[] = ["combat", "mining", "exploration", "crafting", "research", "trading", "social", "diplomacy", "construction", "fleet"];
  const difficulties: AscensionMissionDifficulty[] = ["trivial", "easy", "medium", "hard", "epic", "legendary"];

  const missions: AscensionMission[] = [];
  const usedTitles = new Set<string>();

  for (let i = 0; i < count; i++) {
    const catIdx = Math.floor(rng() * categories.length);
    const category = categories[catIdx];

    const diffIdx = tier <= 20 ? Math.floor(rng() * 3) : tier <= 50 ? Math.floor(rng() * 4) : tier <= 80 ? Math.floor(rng() * 5) : Math.floor(rng() * 6);
    const difficulty = difficulties[Math.min(diffIdx, difficulties.length - 1)];

    const diffMultiplier = { trivial: 0.3, easy: 0.5, medium: 1.0, hard: 1.8, epic: 3.0, legendary: 5.0 }[difficulty];

    const categoryVerbs = CATEGORY_TITLES[category];
    const verb = categoryVerbs[Math.floor(rng() * categoryVerbs.length)];

    const objectiveTypes = OBJECTIVE_TYPES[category];
    const objectiveType = objectiveTypes[Math.floor(rng() * objectiveTypes.length)];

    const [minTarget, maxTarget] = TARGETS_PER_CATEGORY[category];
    const tierScale = 1 + (tier - 1) * 0.15;
    const baseTarget = minTarget + rng() * (maxTarget - minTarget) * Math.min(1, tier / 50);
    const objectiveTarget = Math.max(1, Math.round(baseTarget * tierScale * diffMultiplier));

    const categoryLabels: Record<AscensionMissionCategory, string> = {
      combat: "pirate ships", mining: "mineral deposits", exploration: "star systems", crafting: "equipment modules",
      research: "tech nodes", trading: "market deals", social: "alliance credits", diplomacy: "trade agreements",
      construction: "station modules", fleet: "fleet operations",
    };

    let title = `${verb} ${objectiveTarget.toLocaleString()} ${categoryLabels[category]}`;
    let attempt = 0;
    while (usedTitles.has(title) && attempt < 20) {
      const newVerb = categoryVerbs[(categoryVerbs.indexOf(verb) + attempt + 1) % categoryVerbs.length];
      title = `${newVerb} ${objectiveTarget.toLocaleString()} ${categoryLabels[category]}`;
      attempt++;
    }
    usedTitles.add(title);

    const xpBase = { trivial: 10, easy: 25, medium: 60, hard: 150, epic: 400, legendary: 1000 }[difficulty];
    const xpReward = Math.round(xpBase * (1 + tier * 0.08) * diffMultiplier);
    const creditReward = Math.round(xpReward * 4 * (1 + tier * 0.03));
    const resourceScale = tier * diffMultiplier;

    missions.push({
      id: `asc_t${tier}_m${i}`,
      title,
      description: `Tier ${tier} objective: ${title.toLowerCase()}.`,
      category,
      difficulty,
      objectiveType,
      objectiveTarget,
      xpReward,
      creditReward,
      resourceReward: {
        metal: Math.round(resourceScale * 20 * diffMultiplier),
        crystal: Math.round(resourceScale * 15 * diffMultiplier),
        deuterium: Math.round(resourceScale * 5 * diffMultiplier),
      },
    });
  }

  return missions;
}

function generateTierMissions(tier: number): AscensionMission[] {
  const baseCount = 15;
  const extraPerTier = Math.floor((tier - 1) / 10);
  const count = Math.min(35, baseCount + extraPerTier + Math.floor(seededRandom(tier * 31)() * 3));
  return generateMissionsForTier(tier, count);
}

export const ASCENSION_TIERS: AscensionTier[] = TIER_NAMES.map(([tier, name], index) => {
  const rng = seededRandom(tier * 17);
  const xpRequired = Math.round(1000 * Math.pow(1.12, tier - 1) * (1 + tier * 0.02));
  const missions = generateTierMissions(tier);
  const missionCount = missions.length;

  const totalXpRequired = ASCENSION_TIERS_ACCUMULATED[index] || 0;

  const titleAdjectives = ["Novice", "Apprentice", "Journeyman", "Adept", "Expert", "Master", "Elite", "Grandmaster", "Legendary", "Mythic"];
  const titleIdx = Math.min(9, Math.floor((tier - 1) / 10));
  const title = `${titleAdjectives[titleIdx]} ${name}`;

  return {
    tier,
    name,
    title,
    description: `Ascend through the ranks as a ${title}.`,
    xpRequired,
    totalXpRequired,
    resourceMultiplier: 1 + (tier - 1) * 0.03,
    combatBonus: 1 + (tier - 1) * 0.02,
    miningBonus: 1 + (tier - 1) * 0.025,
    researchBonus: 1 + (tier - 1) * 0.015,
    tradeBonus: 1 + (tier - 1) * 0.02,
    fleetCapacity: 10 + tier * 2,
    missionCount,
    missions,
    tierReward: {
      xp: Math.round(xpRequired * 0.1),
      credits: Math.round(xpRequired * 0.5),
      resources: {
        metal: Math.round(tier * 500),
        crystal: Math.round(tier * 300),
        deuterium: Math.round(tier * 100),
      },
    },
  };
});

const ASCENSION_TIERS_ACCUMULATED: number[] = [];
let accumulated = 0;
for (let i = 0; i < 99; i++) {
  ASCENSION_TIERS_ACCUMULATED.push(accumulated);
  accumulated += Math.round(1000 * Math.pow(1.12, i) * (1 + (i + 1) * 0.02));
}

export function getAscensionTier(tier: number): AscensionTier | undefined {
  return ASCENSION_TIERS.find((t) => t.tier === tier);
}

export function getAscensionMission(missionId: string): { tier: number; mission: AscensionMission } | undefined {
  for (const tier of ASCENSION_TIERS) {
    const mission = tier.missions.find((m) => m.id === missionId);
    if (mission) return { tier: tier.tier, mission };
  }
  return undefined;
}

export function calculateAscensionLevel(totalXp: number): { tier: number; tierXp: number; tierProgress: number } {
  let tier = 1;
  let remainingXp = totalXp;

  for (const tierData of ASCENSION_TIERS) {
    if (remainingXp < tierData.xpRequired) {
      return { tier: tierData.tier, tierXp: remainingXp, tierProgress: (remainingXp / tierData.xpRequired) * 100 };
    }
    remainingXp -= tierData.xpRequired;
  }

  return { tier: 99, tierXp: remainingXp, tierProgress: 100 };
}

export function getAscensionMissionCategoryColor(category: AscensionMissionCategory): string {
  return {
    combat: "#ef4444", mining: "#f59e0b", exploration: "#3b82f6", crafting: "#6b7280",
    research: "#8b5cf6", trading: "#10b981", social: "#14b8a6", diplomacy: "#06b6d4",
    construction: "#f97316", fleet: "#6366f1",
  }[category];
}

export function getAscensionDifficultyColor(difficulty: AscensionMissionDifficulty): string {
  return {
    trivial: "#94a3b8", easy: "#22c55e", medium: "#3b82f6", hard: "#f59e0b", epic: "#a855f7", legendary: "#ec4899",
  }[difficulty];
}

export function formatAscensionXp(xp: number): string {
  if (xp >= 1000000) return `${(xp / 1000000).toFixed(1)}M`;
  if (xp >= 1000) return `${(xp / 1000).toFixed(1)}K`;
  return xp.toString();
}
