export type SeasonTheme =
  | "age_of_exploration"
  | "galactic_war"
  | "corporate_expansion"
  | "alien_incursion"
  | "dimensional_rift"
  | "ancient_awakening";

export type SeasonStatus = "upcoming" | "active" | "final_week" | "ended";

export type MissionFrequency = "daily" | "weekly" | "seasonal";

export type RankingCategory =
  | "economy"
  | "military"
  | "research"
  | "season_xp"
  | "event_score"
  | "exploration";

export type AllianceRankingCategory =
  | "combined_score"
  | "event_points"
  | "territory_control"
  | "boss_damage"
  | "resources_mined"
  | "ships_destroyed";

export type CurrencyType = "galactic_tokens" | "dark_matter";

export type RewardRarity =
  | "common"
  | "uncommon"
  | "rare"
  | "epic"
  | "legendary"
  | "mythic";

export interface SeasonDefinition {
  id: string;
  number: number;
  theme: SeasonTheme;
  name: string;
  tagline: string;
  description: string;
  status: SeasonStatus;
  startDate: string;
  endDate: string;
  speedMultiplier: { economy: number; fleet: number; research: number };
  maxTier: number;
  xpPerTier: number;
  totalSeasonXP: number;
  content: SeasonContent;
  techTree: SeasonTechNode[];
  events: SeasonEvent[];
  rankings: SeasonRankingConfig;
  rewards: SeasonRewardConfig;
  alliances: SeasonAllianceConfig;
  championship: ChampionshipConfig;
}

export interface SeasonContent {
  theme: SeasonTheme;
  dailyMissions: DailyMissionTemplate[];
  weeklyMissions: WeeklyMissionTemplate[];
  seasonalMissions: SeasonalMissionTemplate[];
  galacticTokens: GalacticTokenSource[];
  cosmetics: SeasonCosmetic[];
}

export interface DailyMissionTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  objectiveType: string;
  objectiveTarget: number;
  xpReward: number;
  tokenReward: number;
  resourceRewards: { metal?: number; crystal?: number; deuterium?: number; credits?: number };
  cosmeticReward?: string;
  weight: number;
}

export interface WeeklyMissionTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: "easy" | "medium" | "hard" | "elite" | "legendary";
  objectiveType: string;
  objectiveTarget: number;
  xpReward: number;
  tokenReward: number;
  resourceRewards: { metal?: number; crystal?: number; deuterium?: number; credits?: number };
  commanderBooster?: string;
  weight: number;
}

export interface SeasonalMissionTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: "hard" | "elite" | "legendary" | "mythic";
  objectiveType: string;
  objectiveTarget: number;
  xpReward: number;
  tokenReward: number;
  resourceRewards: { metal?: number; crystal?: number; deuterium?: number; credits?: number };
  exclusiveReward: string;
  weight: number;
}

export interface GalacticTokenSource {
  source: string;
  amount: number;
  dailyCap: number;
  description: string;
}

export interface SeasonCosmetic {
  id: string;
  name: string;
  type: "planet_skin" | "fleet_skin" | "avatar_frame" | "profile_banner" | "decoration" | "alliance_hq" | "fleet_effect" | "animated_avatar";
  rarity: RewardRarity;
  tokenCost: number;
  description: string;
  previewUrl?: string;
  exclusiveToSeason: string;
}

export interface SeasonTechNode {
  id: string;
  name: string;
  description: string;
  category: "exploration" | "combat" | "economy" | "utility" | "research";
  tier: number;
  prerequisites: string[];
  cost: { metal: number; crystal: number; deuterium: number; tokens: number };
  researchTime: number;
  effect: SeasonTechEffect;
  temporary: true;
}

export interface SeasonTechEffect {
  type: string;
  value: number;
  description: string;
}

export interface SeasonEvent {
  id: string;
  name: string;
  description: string;
  type: "galaxy_storm" | "ancient_relics" | "alien_invasion" | "trade_rush" | "territory_war" | "boss_spawn";
  startDate: string;
  endDate: string;
  duration: number;
  rewards: SeasonEventReward[];
  mechanics: SeasonEventMechanics;
  leaderboard: boolean;
  maxParticipants?: number;
}

export interface SeasonEventMechanics {
  productionBonus?: number;
  expeditionRewardBonus?: number;
  pvpHotspots?: boolean;
  specialDebris?: boolean;
  npcFleets?: boolean;
  resourceRush?: boolean;
  territoryControl?: boolean;
}

export interface SeasonEventReward {
  rank?: { min: number; max: number };
  xp: number;
  tokens: number;
  resources: { metal: number; crystal: number; deuterium: number };
  cosmetic?: string;
  title?: string;
}

export interface SeasonRankingConfig {
  individual: IndividualRanking[];
  alliance: AllianceRanking[];
  finalWeek: FinalWeekConfig;
}

export interface IndividualRanking {
  category: RankingCategory;
  title: string;
  description: string;
  thresholds: RankingThreshold[];
}

export interface AllianceRanking {
  category: AllianceRankingCategory;
  title: string;
  description: string;
  thresholds: RankingThreshold[];
}

export interface RankingThreshold {
  rank: number;
  name: string;
  minScore: number;
  maxScore: number;
  reward: { xp: number; tokens: number; cosmetic?: string; title?: string };
}

export interface FinalWeekConfig {
  durationDays: number;
  pointSources: { source: string; pointsPerUnit: number }[];
  championshipTitle: string;
  prizes: ChampionshipPrize[];
}

export interface ChampionshipPrize {
  rank: number;
  title: string;
  tokens: number;
  exclusiveCosmetic: string;
  profileBorder: string;
  legacyTitle: string;
}

export interface SeasonRewardConfig {
  freeTrack: SeasonPassTier[];
  premiumTrack: SeasonPassTier[];
  prestigeRewards: PrestigeLevel[];
}

export interface SeasonPassTier {
  tier: number;
  xpRequired: number;
  freeReward?: SeasonTierReward;
  premiumReward?: SeasonTierReward;
}

export interface SeasonTierReward {
  type: "currency" | "cosmetic" | "item" | "booster" | "title" | "resource_pack";
  currency?: CurrencyType;
  amount?: number;
  cosmeticId?: string;
  itemId?: string;
  title?: string;
  resourcePack?: { metal: number; crystal: number; deuterium: number };
  duration?: number;
}

export interface PrestigeLevel {
  level: number;
  xpRequired: number;
  title: string;
  profileBorder: string;
  permanentUnlock: string;
  description: string;
}

export interface SeasonAllianceConfig {
  projects: AllianceProject[];
  leaderboards: AllianceLeaderboardConfig[];
  seasonalBuffs: AllianceSeasonalBuff[];
}

export interface AllianceProject {
  id: string;
  name: string;
  description: string;
  cost: { metal: number; crystal: number; deuterium: number };
  contributionSlots: number;
  reward: { allianceXP: number; cosmetic: string; rankingPoints: number };
  duration: number;
}

export interface AllianceLeaderboardConfig {
  category: AllianceRankingCategory;
  title: string;
  topReward: { cosmetic: string; title: string };
}

export interface AllianceSeasonalBuff {
  id: string;
  name: string;
  description: string;
  effect: { type: string; value: number };
  cost: number;
  maxLevel: number;
}

export interface ChampionshipConfig {
  enabled: boolean;
  finalWeekDuration: number;
  pointSources: { activity: string; pointsPerUnit: number }[];
  titles: { rank: number; name: string }[];
  grandPrize: { tokens: number; cosmetic: string; title: string; profileBorder: string };
}

export interface SeasonPassState {
  seasonId: string;
  userId: string;
  xp: number;
  currentTier: number;
  xpIntoTier: number;
  xpForNextTier: number;
  completionRatio: number;
  claimedFree: number[];
  claimedPremium: number[];
  premiumUnlocked: boolean;
  galacticTokens: number;
  totalTokensEarned: number;
  totalTokensSpent: number;
  dailyMissionState: DailyMissionState;
  weeklyMissionState: WeeklyMissionState;
  seasonalMissionState: SeasonalMissionState;
  techProgress: Record<string, number>;
  eventScores: Record<string, number>;
  rankings: Record<string, number>;
  championshipPoints: number;
  prestigeLevel: number;
  cosmetics: string[];
  titles: string[];
  completedMissions: number;
  loginStreak: number;
  lastLoginDate: string;
}

export interface DailyMissionState {
  date: string;
  missions: MissionAssignment[];
  refreshCount: number;
  maxRefreshes: number;
}

export interface WeeklyMissionState {
  weekId: string;
  weekStart: string;
  weekEnd: string;
  missions: MissionAssignment[];
  streak: number;
  bestStreak: number;
  completedCount: number;
}

export interface SeasonalMissionState {
  missions: MissionAssignment[];
  completedCount: number;
  totalSeasonalXP: number;
}

export interface MissionAssignment {
  templateId: string;
  title: string;
  description: string;
  category: string;
  objectiveType: string;
  objectiveTarget: number;
  currentProgress: number;
  xpReward: number;
  tokenReward: number;
  resourceRewards: Record<string, number>;
  status: "active" | "completed" | "claimed";
  completedAt?: string;
  claimedAt?: string;
}

const DAILY_MISSIONS: DailyMissionTemplate[] = [
  { id: "dm_build_mines", title: "Industrial Surge", description: "Upgrade 3 mine buildings across your colonies.", category: "economy", objectiveType: "upgrade_buildings", objectiveTarget: 3, xpReward: 50, tokenReward: 5, resourceRewards: { metal: 200, credits: 500 }, weight: 10 },
  { id: "dm_send_expeditions", title: "Into the Unknown", description: "Launch 3 expeditions into uncharted space.", category: "exploration", objectiveType: "send_expeditions", objectiveTarget: 3, xpReward: 75, tokenReward: 8, resourceRewards: { crystal: 150 }, weight: 8 },
  { id: "dm_produce_metal", title: "Metal Magnate", description: "Produce 2,000,000 metal through mining operations.", category: "economy", objectiveType: "produce_metal", objectiveTarget: 2000000, xpReward: 60, tokenReward: 6, resourceRewards: { credits: 800 }, weight: 9 },
  { id: "dm_win_attacks", title: "Combat Prowess", description: "Win 3 successful attacks against targets.", category: "combat", objectiveType: "win_attacks", objectiveTarget: 3, xpReward: 100, tokenReward: 12, resourceRewards: { metal: 300, crystal: 100 }, weight: 7 },
  { id: "dm_research_tech", title: "Scientific Inquiry", description: "Complete 2 technology research projects.", category: "research", objectiveType: "research_tech", objectiveTarget: 2, xpReward: 80, tokenReward: 10, resourceRewards: { crystal: 200 }, weight: 8 },
  { id: "dm_build_ships", title: "Fleet Expansion", description: "Construct 15 new ships at your shipyard.", category: "combat", objectiveType: "build_ships", objectiveTarget: 15, xpReward: 60, tokenReward: 7, resourceRewards: { metal: 250 }, weight: 9 },
  { id: "dm_trade_resources", title: "Market Maven", description: "Execute 5 successful market trades.", category: "economy", objectiveType: "market_trades", objectiveTarget: 5, xpReward: 55, tokenReward: 6, resourceRewards: { credits: 1000 }, weight: 8 },
  { id: "dm_collect_resources", title: "Resource Harvest", description: "Collect 500,000 of each primary resource.", category: "economy", objectiveType: "collect_resources", objectiveTarget: 500000, xpReward: 45, tokenReward: 5, resourceRewards: { metal: 150, crystal: 150, deuterium: 50 }, weight: 10 },
  { id: "dm_scan_anomalies", title: "Anomaly Hunter", description: "Scan 2 space anomalies in your sector.", category: "exploration", objectiveType: "scan_anomalies", objectiveTarget: 2, xpReward: 70, tokenReward: 8, resourceRewards: { crystal: 100, deuterium: 50 }, weight: 6 },
  { id: "dm_donate_alliance", title: "Alliance Spirit", description: "Donate 100,000 resources to your alliance treasury.", category: "social", objectiveType: "alliance_donate", objectiveTarget: 100000, xpReward: 65, tokenReward: 7, resourceRewards: { credits: 500 }, weight: 7 },
  { id: "dm_destroy_ships", title: "Fleet Annihilator", description: "Destroy 50 enemy ships in combat.", category: "combat", objectiveType: "destroy_ships", objectiveTarget: 50, xpReward: 90, tokenReward: 11, resourceRewards: { metal: 200, crystal: 100 }, weight: 6 },
  { id: "dm_produce_crystal", title: "Crystal Harvest", description: "Produce 1,000,000 crystal through mining operations.", category: "economy", objectiveType: "produce_crystal", objectiveTarget: 1000000, xpReward: 55, tokenReward: 6, resourceRewards: { crystal: 200 }, weight: 8 },
];

const WEEKLY_MISSIONS: WeeklyMissionTemplate[] = [
  { id: "wm_war_effort", title: "War Effort", description: "Win 20 battles across all combat fronts.", category: "combat", difficulty: "medium", objectiveType: "win_attacks", objectiveTarget: 20, xpReward: 500, tokenReward: 50, resourceRewards: { metal: 2000, crystal: 800, deuterium: 300 }, weight: 8 },
  { id: "wm_resource_empire", title: "Resource Empire", description: "Accumulate 50,000,000 total resources across all types.", category: "economy", difficulty: "hard", objectiveType: "accumulate_resources", objectiveTarget: 50000000, xpReward: 700, tokenReward: 70, resourceRewards: { credits: 5000 }, weight: 7 },
  { id: "wm_expedition_master", title: "Expedition Master", description: "Complete 20 expeditions into deep space.", category: "exploration", difficulty: "medium", objectiveType: "complete_expeditions", objectiveTarget: 20, xpReward: 600, tokenReward: 60, resourceRewards: { crystal: 1500, deuterium: 500 }, weight: 7 },
  { id: "wm_tech_breakthrough", title: "Tech Breakthrough", description: "Research 5 advanced technologies.", category: "research", difficulty: "hard", objectiveType: "research_advanced", objectiveTarget: 5, xpReward: 800, tokenReward: 80, resourceRewards: { crystal: 2000, deuterium: 800 }, weight: 6 },
  { id: "wm_fleet_constructor", title: "Fleet Constructor", description: "Build 100 ships across all shipyard classes.", category: "combat", difficulty: "medium", objectiveType: "build_ships", objectiveTarget: 100, xpReward: 550, tokenReward: 55, resourceRewards: { metal: 3000, crystal: 1000 }, weight: 8 },
  { id: "wm_colonizer", title: "Colonizer", description: "Establish 2 new colonies on distant worlds.", category: "exploration", difficulty: "hard", objectiveType: "colonize_planets", objectiveTarget: 2, xpReward: 900, tokenReward: 90, resourceRewards: { metal: 5000, crystal: 3000, deuterium: 1500 }, weight: 5 },
  { id: "wm_raider", title: "Raid Commander", description: "Participate in 5 raid boss encounters.", category: "combat", difficulty: "elite", objectiveType: "raid_participations", objectiveTarget: 5, xpReward: 1000, tokenReward: 100, resourceRewards: { metal: 4000, crystal: 2000, deuterium: 1000 }, weight: 5 },
  { id: "wm_trade_mogul", title: "Trade Mogul", description: "Complete 50 market transactions and earn 2,000,000 credits.", category: "economy", difficulty: "hard", objectiveType: "trade_profit", objectiveTarget: 2000000, xpReward: 750, tokenReward: 75, resourceRewards: { credits: 8000 }, weight: 6 },
  { id: "wm_ally_projects", title: "Alliance Builder", description: "Contribute to 3 alliance projects.", category: "social", difficulty: "medium", objectiveType: "alliance_projects", objectiveTarget: 3, xpReward: 600, tokenReward: 60, resourceRewards: { metal: 2500, crystal: 1500 }, weight: 6 },
  { id: "wm_destroy_armada", title: "Armada Destroyer", description: "Destroy 500 enemy ships in total combat.", category: "combat", difficulty: "elite", objectiveType: "destroy_ships", objectiveTarget: 500, xpReward: 1200, tokenReward: 120, resourceRewards: { metal: 5000, crystal: 3000, deuterium: 2000 }, weight: 4 },
];

const SEASONAL_MISSIONS: SeasonalMissionTemplate[] = [
  { id: "sm_conquer_sector", title: "Sector Conquest", description: "Conquer 10 enemy sectors throughout the season.", category: "combat", difficulty: "elite", objectiveType: "conquer_sectors", objectiveTarget: 10, xpReward: 5000, tokenReward: 500, resourceRewards: { metal: 20000, crystal: 15000, deuterium: 8000 }, exclusiveReward: "season_conqueror_title", weight: 5 },
  { id: "sm_galaxy_explorer", title: "Galaxy Explorer", description: "Discover 50 new star systems during the season.", category: "exploration", difficulty: "hard", objectiveType: "discover_systems", objectiveTarget: 50, xpReward: 4000, tokenReward: 400, resourceRewards: { crystal: 25000, deuterium: 10000 }, exclusiveReward: "galaxy_explorer_banner", weight: 5 },
  { id: "sm_wealth_of_empires", title: "Wealth of Empires", description: "Accumulate 1 billion total resources across all types.", category: "economy", difficulty: "legendary", objectiveType: "accumulate_resources", objectiveTarget: 1000000000, xpReward: 6000, tokenReward: 600, resourceRewards: { credits: 50000 }, exclusiveReward: "tycoon_avatar_frame", weight: 4 },
  { id: "sm_warlord_ascendant", title: "Warlord Ascendant", description: "Win 100 battles and destroy 5,000 enemy ships.", category: "combat", difficulty: "legendary", objectiveType: "total_combat_victories", objectiveTarget: 100, xpReward: 8000, tokenReward: 800, resourceRewards: { metal: 30000, crystal: 20000, deuterium: 12000 }, exclusiveReward: "warlord_fleet_skin", weight: 3 },
  { id: "sm_master_researcher", title: "Master Researcher", description: "Complete 30 technology research projects.", category: "research", difficulty: "elite", objectiveType: "research_tech", objectiveTarget: 30, xpReward: 5500, tokenReward: 550, resourceRewards: { crystal: 30000, deuterium: 15000 }, exclusiveReward: "scholar_planet_skin", weight: 4 },
  { id: "sm_alliance_supreme", title: "Alliance Supreme", description: "Reach top 100 in alliance rankings.", category: "social", difficulty: "mythic", objectiveType: "alliance_ranking", objectiveTarget: 100, xpReward: 10000, tokenReward: 1000, resourceRewards: { metal: 50000, crystal: 30000, deuterium: 20000 }, exclusiveReward: "supreme_alliance_banner", weight: 2 },
];

const SEASONAL_TECH_TREES: Record<SeasonTheme, SeasonTechNode[]> = {
  age_of_exploration: [
    { id: "exp_deep_scan", name: "Deep Space Navigation", description: "+5% expedition findings rate.", category: "exploration", tier: 1, prerequisites: [], cost: { metal: 10000, crystal: 5000, deuterium: 2000, tokens: 50 }, researchTime: 3600, effect: { type: "expedition_findings", value: 0.05, description: "+5% expedition findings" }, temporary: true },
    { id: "exp_adv_sensors", name: "Advanced Sensors", description: "+10% expedition speed.", category: "exploration", tier: 2, prerequisites: ["exp_deep_scan"], cost: { metal: 25000, crystal: 12000, deuterium: 5000, tokens: 100 }, researchTime: 7200, effect: { type: "expedition_speed", value: 0.10, description: "+10% expedition speed" }, temporary: true },
    { id: "exp_artifact_recovery", name: "Artifact Recovery", description: "Increased chance for rare discoveries by 15%.", category: "exploration", tier: 3, prerequisites: ["exp_adv_sensors"], cost: { metal: 50000, crystal: 25000, deuterium: 10000, tokens: 200 }, researchTime: 14400, effect: { type: "rare_discovery_chance", value: 0.15, description: "+15% rare discovery chance" }, temporary: true },
    { id: "exp_wormhole_theory", name: "Wormhole Theory", description: "Unlock wormhole travel between explored systems.", category: "exploration", tier: 4, prerequisites: ["exp_artifact_recovery"], cost: { metal: 100000, crystal: 50000, deuterium: 25000, tokens: 400 }, researchTime: 28800, effect: { type: "wormhole_travel", value: 1, description: "Unlock wormhole travel" }, temporary: true },
    { id: "exp_star_chart", name: "Stellar Cartography", description: "Reveals 20% more systems on the galaxy map.", category: "exploration", tier: 5, prerequisites: ["exp_wormhole_theory"], cost: { metal: 200000, crystal: 100000, deuterium: 50000, tokens: 800 }, researchTime: 57600, effect: { type: "map_visibility", value: 0.20, description: "+20% galaxy map visibility" }, temporary: true },
    { id: "exp_resource_scanner", name: "Resource Scanner", description: "+25% resource yield from expeditions.", category: "economy", tier: 2, prerequisites: ["exp_deep_scan"], cost: { metal: 20000, crystal: 10000, deuterium: 4000, tokens: 80 }, researchTime: 5400, effect: { type: "expedition_resource_yield", value: 0.25, description: "+25% expedition resource yield" }, temporary: true },
    { id: "exp_combat_scout", name: "Combat Scout Protocols", description: "+10% fleet speed during exploration missions.", category: "combat", tier: 3, prerequisites: ["exp_adv_sensors"], cost: { metal: 40000, crystal: 20000, deuterium: 8000, tokens: 150 }, researchTime: 10800, effect: { type: "exploration_fleet_speed", value: 0.10, description: "+10% fleet speed on expeditions" }, temporary: true },
    { id: "exp_ancient_knowledge", name: "Ancient Knowledge", description: "+20% research speed during season.", category: "research", tier: 4, prerequisites: ["exp_artifact_recovery"], cost: { metal: 80000, crystal: 40000, deuterium: 20000, tokens: 350 }, researchTime: 21600, effect: { type: "seasonal_research_speed", value: 0.20, description: "+20% research speed" }, temporary: true },
  ],
  galactic_war: [
    { id: "war_fleet_command", name: "Fleet Command Protocols", description: "+8% fleet attack power.", category: "combat", tier: 1, prerequisites: [], cost: { metal: 15000, crystal: 8000, deuterium: 3000, tokens: 60 }, researchTime: 3600, effect: { type: "fleet_attack", value: 0.08, description: "+8% fleet attack" }, temporary: true },
    { id: "war_shield_matrix", name: "Shield Matrix Enhancement", description: "+10% shield regeneration in combat.", category: "combat", tier: 2, prerequisites: ["war_fleet_command"], cost: { metal: 30000, crystal: 15000, deuterium: 6000, tokens: 120 }, researchTime: 7200, effect: { type: "shield_regen", value: 0.10, description: "+10% shield regen" }, temporary: true },
    { id: "war_espionage_network", name: "Espionage Network", description: "+15% espionage success rate.", category: "combat", tier: 3, prerequisites: ["war_shield_matrix"], cost: { metal: 60000, crystal: 30000, deuterium: 12000, tokens: 250 }, researchTime: 14400, effect: { type: "espionage_success", value: 0.15, description: "+15% espionage success" }, temporary: true },
    { id: "war_battle_tactics", name: "Battle Tactics", description: "+12% combat XP gained.", category: "combat", tier: 4, prerequisites: ["war_espionage_network"], cost: { metal: 120000, crystal: 60000, deuterium: 25000, tokens: 500 }, researchTime: 28800, effect: { type: "combat_xp", value: 0.12, description: "+12% combat XP" }, temporary: true },
    { id: "war_armada_supremacy", name: "Armada Supremacy", description: "+20% fleet capacity.", category: "combat", tier: 5, prerequisites: ["war_battle_tactics"], cost: { metal: 250000, crystal: 120000, deuterium: 50000, tokens: 1000 }, researchTime: 57600, effect: { type: "fleet_capacity", value: 0.20, description: "+20% fleet capacity" }, temporary: true },
    { id: "war_supply_lines", name: "Supply Lines", description: "-15% fleet maintenance costs.", category: "economy", tier: 2, prerequisites: ["war_fleet_command"], cost: { metal: 20000, crystal: 10000, deuterium: 5000, tokens: 80 }, researchTime: 5400, effect: { type: "fleet_maintenance", value: -0.15, description: "-15% fleet maintenance" }, temporary: true },
    { id: "war_defense_grid", name: "Defense Grid", description: "+15% defensive structure power.", category: "combat", tier: 3, prerequisites: ["war_shield_matrix"], cost: { metal: 50000, crystal: 25000, deuterium: 10000, tokens: 200 }, researchTime: 10800, effect: { type: "defense_power", value: 0.15, description: "+15% defense power" }, temporary: true },
    { id: "war_war_economy", name: "War Economy", description: "+10% resource production during wartime.", category: "economy", tier: 4, prerequisites: ["war_espionage_network"], cost: { metal: 100000, crystal: 50000, deuterium: 20000, tokens: 400 }, researchTime: 21600, effect: { type: "wartime_production", value: 0.10, description: "+10% wartime production" }, temporary: true },
  ],
  corporate_expansion: [
    { id: "corp_trade_routes", name: "Trade Route Optimization", description: "+10% trade profit margins.", category: "economy", tier: 1, prerequisites: [], cost: { metal: 8000, crystal: 4000, deuterium: 1000, tokens: 40 }, researchTime: 3600, effect: { type: "trade_profit", value: 0.10, description: "+10% trade profit" }, temporary: true },
    { id: "corp_mining_drone", name: "Mining Drone Swarm", description: "+15% mining output.", category: "economy", tier: 2, prerequisites: ["corp_trade_routes"], cost: { metal: 20000, crystal: 10000, deuterium: 3000, tokens: 80 }, researchTime: 7200, effect: { type: "mining_output", value: 0.15, description: "+15% mining output" }, temporary: true },
    { id: "corp_market_ai", name: "Market Prediction AI", description: "See market trends 24 hours ahead.", category: "economy", tier: 3, prerequisites: ["corp_mining_drone"], cost: { metal: 45000, crystal: 22000, deuterium: 8000, tokens: 180 }, researchTime: 14400, effect: { type: "market_forecast", value: 24, description: "24hr market forecast" }, temporary: true },
    { id: "corp_monopoly", name: "Market Monopoly", description: "-20% market transaction fees.", category: "economy", tier: 4, prerequisites: ["corp_market_ai"], cost: { metal: 90000, crystal: 45000, deuterium: 18000, tokens: 360 }, researchTime: 28800, effect: { type: "market_fee_reduction", value: 0.20, description: "-20% market fees" }, temporary: true },
    { id: "corp_corporate_empire", name: "Corporate Empire", description: "+25% all resource production.", category: "economy", tier: 5, prerequisites: ["corp_monopoly"], cost: { metal: 200000, crystal: 100000, deuterium: 40000, tokens: 800 }, researchTime: 57600, effect: { type: "all_production", value: 0.25, description: "+25% all production" }, temporary: true },
    { id: "corp_logistics", name: "Advanced Logistics", description: "-20% fleet travel time.", category: "utility", tier: 2, prerequisites: ["corp_trade_routes"], cost: { metal: 15000, crystal: 8000, deuterium: 2000, tokens: 60 }, researchTime: 5400, effect: { type: "fleet_travel_time", value: -0.20, description: "-20% travel time" }, temporary: true },
    { id: "corp_r_and_d", name: "Corporate R&D", description: "+15% research speed.", category: "research", tier: 3, prerequisites: ["corp_mining_drone"], cost: { metal: 40000, crystal: 20000, deuterium: 8000, tokens: 160 }, researchTime: 10800, effect: { type: "research_speed", value: 0.15, description: "+15% research speed" }, temporary: true },
    { id: "corp_hostile_takeover", name: "Hostile Takeover", description: "+10% plunder from successful attacks.", category: "combat", tier: 4, prerequisites: ["corp_market_ai"], cost: { metal: 80000, crystal: 40000, deuterium: 15000, tokens: 300 }, researchTime: 21600, effect: { type: "plunder_bonus", value: 0.10, description: "+10% plunder" }, temporary: true },
  ],
  alien_incursion: [
    { id: "ali_shield_boost", name: "Emergency Shields", description: "+15% shield strength against NPC fleets.", category: "combat", tier: 1, prerequisites: [], cost: { metal: 12000, crystal: 6000, deuterium: 2000, tokens: 50 }, researchTime: 3600, effect: { type: "npc_shield_bonus", value: 0.15, description: "+15% NPC shield bonus" }, temporary: true },
    { id: "ali_weapons_compat", name: "Weapon Calibration", description: "+12% damage against alien vessels.", category: "combat", tier: 2, prerequisites: ["ali_shield_boost"], cost: { metal: 28000, crystal: 14000, deuterium: 5000, tokens: 110 }, researchTime: 7200, effect: { type: "alien_damage_bonus", value: 0.12, description: "+12% alien damage" }, temporary: true },
    { id: "ali_scanner_array", name: "Scanner Array", description: "Detect alien fleets 50% earlier.", category: "utility", tier: 3, prerequisites: ["ali_weapons_compat"], cost: { metal: 55000, crystal: 28000, deuterium: 10000, tokens: 220 }, researchTime: 14400, effect: { type: "alien_detection_range", value: 0.50, description: "+50% detection range" }, temporary: true },
    { id: "ali_reverse_eng", name: "Reverse Engineering", description: "+20% loot from alien fleets.", category: "economy", tier: 4, prerequisites: ["ali_scanner_array"], cost: { metal: 110000, crystal: 55000, deuterium: 22000, tokens: 440 }, researchTime: 28800, effect: { type: "alien_loot_bonus", value: 0.20, description: "+20% alien loot" }, temporary: true },
    { id: "ali_swarm_tactics", name: "Swarm Tactics", description: "+25% fleet coordination against NPC armadas.", category: "combat", tier: 5, prerequisites: ["ali_reverse_eng"], cost: { metal: 220000, crystal: 110000, deuterium: 44000, tokens: 880 }, researchTime: 57600, effect: { type: "fleet_coordination", value: 0.25, description: "+25% fleet coordination" }, temporary: true },
    { id: "ali_repair_drones", name: "Repair Drones", description: "+10% hull repair rate after combat.", category: "combat", tier: 2, prerequisites: ["ali_shield_boost"], cost: { metal: 18000, crystal: 9000, deuterium: 3000, tokens: 70 }, researchTime: 5400, effect: { type: "hull_repair_rate", value: 0.10, description: "+10% hull repair" }, temporary: true },
    { id: "ali_salvage", name: "Salvage Operations", description: "+15% resource recovery from destroyed alien ships.", category: "economy", tier: 3, prerequisites: ["ali_weapons_compat"], cost: { metal: 35000, crystal: 18000, deuterium: 7000, tokens: 140 }, researchTime: 10800, effect: { type: "salvage_yield", value: 0.15, description: "+15% salvage yield" }, temporary: true },
    { id: "ali_pheromone_scout", name: "Pheromone Decryption", description: "Unlock alien diplomacy options.", category: "utility", tier: 4, prerequisites: ["ali_scanner_array"], cost: { metal: 75000, crystal: 38000, deuterium: 15000, tokens: 300 }, researchTime: 21600, effect: { type: "alien_diplomacy", value: 1, description: "Unlock alien diplomacy" }, temporary: true },
  ],
  dimensional_rift: [
    { id: "dim_rift_sensors", name: "Rift Sensors", description: "Detect dimensional anomalies 30% sooner.", category: "exploration", tier: 1, prerequisites: [], cost: { metal: 10000, crystal: 5000, deuterium: 2000, tokens: 45 }, researchTime: 3600, effect: { type: "anomaly_detection", value: 0.30, description: "+30% anomaly detection" }, temporary: true },
    { id: "dim_portal_tech", name: "Portal Technology", description: "Stabilize dimensional portals for resource extraction.", category: "economy", tier: 2, prerequisites: ["dim_rift_sensors"], cost: { metal: 22000, crystal: 11000, deuterium: 4000, tokens: 90 }, researchTime: 7200, effect: { type: "portal_resources", value: 0.15, description: "+15% portal resource yield" }, temporary: true },
    { id: "dim_void_shield", name: "Void Shield", description: "+20% defense against dimensional entities.", category: "combat", tier: 3, prerequisites: ["dim_portal_tech"], cost: { metal: 48000, crystal: 24000, deuterium: 9000, tokens: 190 }, researchTime: 14400, effect: { type: "void_defense", value: 0.20, description: "+20% void defense" }, temporary: true },
    { id: "dim_rift_weapons", name: "Rift Weapons", description: "+18% damage in dimensional combat zones.", category: "combat", tier: 4, prerequisites: ["dim_void_shield"], cost: { metal: 95000, crystal: 48000, deuterium: 18000, tokens: 380 }, researchTime: 28800, effect: { type: "rift_damage", value: 0.18, description: "+18% rift damage" }, temporary: true },
    { id: "dim_transcendence", name: "Dimensional Transcendence", description: "+30% all stats in rift zones.", category: "combat", tier: 5, prerequisites: ["dim_rift_weapons"], cost: { metal: 200000, crystal: 100000, deuterium: 40000, tokens: 800 }, researchTime: 57600, effect: { type: "rift_all_stats", value: 0.30, description: "+30% rift stats" }, temporary: true },
    { id: "dim_crystal_sync", name: "Crystal Synchronicity", description: "+20% crystal mining from rift deposits.", category: "economy", tier: 2, prerequisites: ["dim_rift_sensors"], cost: { metal: 16000, crystal: 8000, deuterium: 3000, tokens: 65 }, researchTime: 5400, effect: { type: "rift_crystal_mining", value: 0.20, description: "+20% rift crystal mining" }, temporary: true },
    { id: "dim_phasing", name: "Phase Shift", description: "Ships can phase through dimensions for faster travel.", category: "utility", tier: 3, prerequisites: ["dim_portal_tech"], cost: { metal: 40000, crystal: 20000, deuterium: 8000, tokens: 160 }, researchTime: 10800, effect: { type: "phase_travel", value: 0.25, description: "-25% rift travel time" }, temporary: true },
    { id: "dim_echo", name: "Dimensional Echo", description: "Chance to duplicate resources from rift events.", category: "economy", tier: 4, prerequisites: ["dim_void_shield"], cost: { metal: 80000, crystal: 40000, deuterium: 15000, tokens: 320 }, researchTime: 21600, effect: { type: "resource_duplication", value: 0.10, description: "10% resource duplication chance" }, temporary: true },
  ],
  ancient_awakening: [
    { id: "anc_ruins_scan", name: "Ruins Scanning", description: "+25% ancient ruin discovery rate.", category: "exploration", tier: 1, prerequisites: [], cost: { metal: 8000, crystal: 4000, deuterium: 1500, tokens: 35 }, researchTime: 3600, effect: { type: "ruin_discovery", value: 0.25, description: "+25% ruin discovery" }, temporary: true },
    { id: "anc_artifact_id", name: "Artifact Identification", description: "+20% artifact rarity when discovered.", category: "exploration", tier: 2, prerequisites: ["anc_ruins_scan"], cost: { metal: 18000, crystal: 9000, deuterium: 3500, tokens: 75 }, researchTime: 7200, effect: { type: "artifact_rarity", value: 0.20, description: "+20% artifact rarity" }, temporary: true },
    { id: "anc_power_tap", name: "Ancient Power Tap", description: "+15% energy from ancient reactors.", category: "economy", tier: 3, prerequisites: ["anc_artifact_id"], cost: { metal: 40000, crystal: 20000, deuterium: 7500, tokens: 160 }, researchTime: 14400, effect: { type: "ancient_energy", value: 0.15, description: "+15% ancient energy" }, temporary: true },
    { id: "anc_guardian", name: "Guardian Protocol", description: "+20% defense when fighting ancient guardians.", category: "combat", tier: 4, prerequisites: ["anc_power_tap"], cost: { metal: 85000, crystal: 42000, deuterium: 16000, tokens: 340 }, researchTime: 28800, effect: { type: "guardian_defense", value: 0.20, description: "+20% guardian defense" }, temporary: true },
    { id: "anc_apotheosis", name: "Apotheosis", description: "+30% all bonuses from ancient relics.", category: "utility", tier: 5, prerequisites: ["anc_guardian"], cost: { metal: 180000, crystal: 90000, deuterium: 35000, tokens: 750 }, researchTime: 57600, effect: { type: "relic_bonus", value: 0.30, description: "+30% relic bonuses" }, temporary: true },
    { id: "anc_knowledge", name: "Ancient Knowledge", description: "+15% research speed from ancient archives.", category: "research", tier: 2, prerequisites: ["anc_ruins_scan"], cost: { metal: 14000, crystal: 7000, deuterium: 2500, tokens: 55 }, researchTime: 5400, effect: { type: "archive_research_speed", value: 0.15, description: "+15% archive research speed" }, temporary: true },
    { id: "anc_construct", name: "Ancient Constructs", description: "Unlock ancient building upgrades.", category: "economy", tier: 3, prerequisites: ["anc_artifact_id"], cost: { metal: 35000, crystal: 18000, deuterium: 6500, tokens: 140 }, researchTime: 10800, effect: { type: "ancient_buildings", value: 1, description: "Unlock ancient buildings" }, temporary: true },
    { id: "anc_prophecy", name: "Prophecy Fulfillment", description: "Chance to gain bonus XP from all activities.", category: "utility", tier: 4, prerequisites: ["anc_power_tap"], cost: { metal: 70000, crystal: 35000, deuterium: 13000, tokens: 280 }, researchTime: 21600, effect: { type: "bonus_xp_chance", value: 0.15, description: "15% bonus XP chance" }, temporary: true },
  ],
};

const SEASONAL_EVENTS: SeasonEvent[] = [
  {
    id: "evt_galaxy_storm_alpha",
    name: "Galaxy Storm",
    description: "A massive energy storm sweeps through random galaxy sectors. Resource bonuses and PvP hotspots emerge as empires compete for control.",
    type: "galaxy_storm",
    startDate: "",
    endDate: "",
    duration: 172800000,
    rewards: [
      { rank: { min: 1, max: 1 }, xp: 5000, tokens: 200, resources: { metal: 100000, crystal: 50000, deuterium: 20000 }, cosmetic: "storm_rider_avatar", title: "Storm Lord" },
      { rank: { min: 2, max: 5 }, xp: 3000, tokens: 150, resources: { metal: 50000, crystal: 25000, deuterium: 10000 }, title: "Storm Rider" },
      { rank: { min: 6, max: 25 }, xp: 1500, tokens: 80, resources: { metal: 20000, crystal: 10000, deuterium: 5000 } },
      { rank: { min: 26, max: 100 }, xp: 800, tokens: 40, resources: { metal: 8000, crystal: 4000, deuterium: 2000 } },
      { rank: { min: 101, max: 500 }, xp: 400, tokens: 20, resources: { metal: 3000, crystal: 1500, deuterium: 500 } },
    ],
    mechanics: { productionBonus: 0.25, expeditionRewardBonus: 0.50, pvpHotspots: true },
    leaderboard: true,
  },
  {
    id: "evt_ancient_relics",
    name: "Ancient Relics",
    description: "Special debris fields appear across the galaxy containing powerful artifacts. Discover and claim them before your rivals.",
    type: "ancient_relics",
    startDate: "",
    endDate: "",
    duration: 259200000,
    rewards: [
      { rank: { min: 1, max: 1 }, xp: 8000, tokens: 300, resources: { metal: 200000, crystal: 100000, deuterium: 50000 }, cosmetic: "relic_hunter_frame", title: "Relic Sovereign" },
      { rank: { min: 2, max: 5 }, xp: 5000, tokens: 200, resources: { metal: 100000, crystal: 50000, deuterium: 25000 }, title: "Relic Hunter" },
      { rank: { min: 6, max: 25 }, xp: 2500, tokens: 100, resources: { metal: 40000, crystal: 20000, deuterium: 10000 } },
      { rank: { min: 26, max: 100 }, xp: 1200, tokens: 50, resources: { metal: 15000, crystal: 8000, deuterium: 3000 } },
      { rank: { min: 101, max: 500 }, xp: 600, tokens: 25, resources: { metal: 5000, crystal: 2500, deuterium: 1000 } },
    ],
    mechanics: { specialDebris: true },
    leaderboard: true,
  },
  {
    id: "evt_alien_invasion",
    name: "Alien Incursion",
    description: "Hostile alien armadas emerge from deep space. Rally your alliance to defend the galaxy and earn exclusive rewards.",
    type: "alien_invasion",
    startDate: "",
    endDate: "",
    duration: 432000000,
    rewards: [
      { rank: { min: 1, max: 1 }, xp: 12000, tokens: 500, resources: { metal: 300000, crystal: 150000, deuterium: 75000 }, cosmetic: "alien_slayer_fleet", title: "Galactic Defender" },
      { rank: { min: 2, max: 5 }, xp: 8000, tokens: 350, resources: { metal: 150000, crystal: 75000, deuterium: 35000 }, title: "Void Slayer" },
      { rank: { min: 6, max: 25 }, xp: 4000, tokens: 180, resources: { metal: 60000, crystal: 30000, deuterium: 15000 } },
      { rank: { min: 26, max: 100 }, xp: 2000, tokens: 90, resources: { metal: 25000, crystal: 12000, deuterium: 5000 } },
      { rank: { min: 101, max: 500 }, xp: 1000, tokens: 45, resources: { metal: 8000, crystal: 4000, deuterium: 1500 } },
    ],
    mechanics: { npcFleets: true },
    leaderboard: true,
    maxParticipants: 500,
  },
  {
    id: "evt_trade_rush",
    name: "Trade Rush",
    description: "A galactic economic boom creates massive trading opportunities. Merchant contracts and resource rushes reward the shrewdest traders.",
    type: "trade_rush",
    startDate: "",
    endDate: "",
    duration: 345600000,
    rewards: [
      { rank: { min: 1, max: 1 }, xp: 6000, tokens: 250, resources: { metal: 150000, crystal: 75000, deuterium: 30000 }, cosmetic: "merchant_king_banner", title: "Trade Magnate" },
      { rank: { min: 2, max: 5 }, xp: 4000, tokens: 180, resources: { metal: 80000, crystal: 40000, deuterium: 15000 }, title: "Trade Baron" },
      { rank: { min: 6, max: 25 }, xp: 2000, tokens: 90, resources: { metal: 30000, crystal: 15000, deuterium: 6000 } },
      { rank: { min: 26, max: 100 }, xp: 1000, tokens: 45, resources: { metal: 12000, crystal: 6000, deuterium: 2500 } },
      { rank: { min: 101, max: 500 }, xp: 500, tokens: 20, resources: { metal: 4000, crystal: 2000, deuterium: 800 } },
    ],
    mechanics: { resourceRush: true, productionBonus: 0.50 },
    leaderboard: true,
  },
  {
    id: "evt_territory_war",
    name: "Territory War",
    description: "Alliances battle for control of galactic sectors. Hold territory to earn points and exclusive alliance rewards.",
    type: "territory_war",
    startDate: "",
    endDate: "",
    duration: 518400000,
    rewards: [
      { rank: { min: 1, max: 1 }, xp: 15000, tokens: 600, resources: { metal: 400000, crystal: 200000, deuterium: 100000 }, cosmetic: "conqueror_throne", title: "Galactic Overlord" },
      { rank: { min: 2, max: 5 }, xp: 10000, tokens: 400, resources: { metal: 200000, crystal: 100000, deuterium: 50000 }, title: "Sector Lord" },
      { rank: { min: 6, max: 25 }, xp: 5000, tokens: 200, resources: { metal: 80000, crystal: 40000, deuterium: 20000 } },
      { rank: { min: 26, max: 100 }, xp: 2500, tokens: 100, resources: { metal: 30000, crystal: 15000, deuterium: 7000 } },
      { rank: { min: 101, max: 500 }, xp: 1200, tokens: 50, resources: { metal: 10000, crystal: 5000, deuterium: 2000 } },
    ],
    mechanics: { territoryControl: true },
    leaderboard: true,
  },
  {
    id: "evt_boss_spawn",
    name: "Cosmic Horror",
    description: "Ancient cosmic entities awaken from their slumber. Face impossible odds with your alliance to slay the unspeakable.",
    type: "boss_spawn",
    startDate: "",
    endDate: "",
    duration: 604800000,
    rewards: [
      { rank: { min: 1, max: 1 }, xp: 20000, tokens: 800, resources: { metal: 500000, crystal: 250000, deuterium: 125000 }, cosmetic: "cosmic_slayer_title", title: "Cosmic Slayer" },
      { rank: { min: 2, max: 5 }, xp: 12000, tokens: 500, resources: { metal: 250000, crystal: 125000, deuterium: 60000 }, title: "Eldritch Bane" },
      { rank: { min: 6, max: 25 }, xp: 6000, tokens: 250, resources: { metal: 100000, crystal: 50000, deuterium: 25000 } },
      { rank: { min: 26, max: 100 }, xp: 3000, tokens: 125, resources: { metal: 40000, crystal: 20000, deuterium: 10000 } },
      { rank: { min: 101, max: 500 }, xp: 1500, tokens: 60, resources: { metal: 15000, crystal: 7500, deuterium: 3000 } },
    ],
    mechanics: { npcFleets: true, territoryControl: true },
    leaderboard: true,
  },
];

const SEASON_COSMETICS: SeasonCosmetic[] = [
  { id: "cs_planet_crystal_world", name: "Crystal World", type: "planet_skin", rarity: "rare", tokenCost: 200, description: "Transform your home world into a shimmering crystal planet.", exclusiveToSeason: "any" },
  { id: "cs_planet_lava_fortress", name: "Lava Fortress", type: "planet_skin", rarity: "epic", tokenCost: 400, description: "Your planet becomes a volcanic fortress world.", exclusiveToSeason: "any" },
  { id: "cs_planet_void_nexus", name: "Void Nexus", type: "planet_skin", rarity: "legendary", tokenCost: 800, description: "A dark matter-infused planet skin with swirling void energy.", exclusiveToSeason: "any" },
  { id: "cs_fleet_neon_trail", name: "Neon Trail", type: "fleet_skin", rarity: "common", tokenCost: 50, description: "Add neon-colored engine trails to your fleet.", exclusiveToSeason: "any" },
  { id: "cs_fleet_phaser", name: "Phaser Effect", type: "fleet_skin", rarity: "uncommon", tokenCost: 150, description: "Your fleet phases in and out of reality during travel.", exclusiveToSeason: "any" },
  { id: "cs_fleet_cosmic_wrath", name: "Cosmic Wrath", type: "fleet_skin", rarity: "legendary", tokenCost: 600, description: "Fleet leaves a trail of cosmic energy in its wake.", exclusiveToSeason: "any" },
  { id: "cs_frame_starborn", name: "Starborn Frame", type: "avatar_frame", rarity: "rare", tokenCost: 250, description: "A radiant frame forged from captured starlight.", exclusiveToSeason: "any" },
  { id: "cs_frame_void_walker", name: "Void Walker Frame", type: "avatar_frame", rarity: "epic", tokenCost: 500, description: "A dark matter infused frame pulsing with void energy.", exclusiveToSeason: "any" },
  { id: "cs_frame_eternal", name: "Eternal Frame", type: "avatar_frame", rarity: "mythic", tokenCost: 1500, description: "An immortal frame that glows with the essence of eternity.", exclusiveToSeason: "any" },
  { id: "cs_banner_stellar_dominion", name: "Stellar Dominion Banner", type: "profile_banner", rarity: "common", tokenCost: 30, description: "Official Stellar Dominion season banner.", exclusiveToSeason: "any" },
  { id: "cs_banner_war_era", name: "War Era Banner", type: "profile_banner", rarity: "rare", tokenCost: 200, description: "Battle-scarred banner from the galactic wars.", exclusiveToSeason: "any" },
  { id: "cs_banner_ancient_power", name: "Ancient Power Banner", type: "profile_banner", rarity: "legendary", tokenCost: 700, description: "Banner infused with the power of ancient civilizations.", exclusiveToSeason: "any" },
  { id: "cs_hq_war_forge", name: "War Forge HQ", type: "alliance_hq", rarity: "epic", tokenCost: 600, description: "Your alliance HQ becomes a massive war forge.", exclusiveToSeason: "any" },
  { id: "cs_hq_crystal_palace", name: "Crystal Palace HQ", type: "alliance_hq", rarity: "legendary", tokenCost: 1000, description: "An alliance HQ made entirely of living crystal.", exclusiveToSeason: "any" },
  { id: "cs_effect_hyperdrive", name: "Hyperdrive Effect", type: "fleet_effect", rarity: "uncommon", tokenCost: 100, description: "Fleet jumps to hyperspace with a blue flash.", exclusiveToSeason: "any" },
  { id: "cs_effect_warp_breach", name: "Warp Breach Effect", type: "fleet_effect", rarity: "epic", tokenCost: 400, description: "Fleet tears through reality with a purple rift.", exclusiveToSeason: "any" },
  { id: "cs_avatar_animated_pulsar", name: "Pulsar Avatar", type: "animated_avatar", rarity: "rare", tokenCost: 300, description: "An animated pulsar star avatar.", exclusiveToSeason: "any" },
  { id: "cs_avatar_animated_blackhole", name: "Black Hole Avatar", type: "animated_avatar", rarity: "legendary", tokenCost: 900, description: "An animated black hole avatar with accretion disk.", exclusiveToSeason: "any" },
];

const PRESTIGE_LEVELS: PrestigeLevel[] = [
  { level: 1, xpRequired: 0, title: "Season Veteran", profileBorder: "border_bronze", permanentUnlock: "Bronze Profile Border", description: "Completed your first season." },
  { level: 2, xpRequired: 5000, title: "Seasoned Commander", profileBorder: "border_silver", permanentUnlock: "Silver Profile Border", description: "Season veteran with proven experience." },
  { level: 3, xpRequired: 15000, title: "Galactic Explorer", profileBorder: "border_gold", permanentUnlock: "Gold Profile Border", description: "Explored the galaxy across multiple seasons." },
  { level: 4, xpRequired: 30000, title: "War Hero", profileBorder: "border_platinum", permanentUnlock: "Platinum Profile Border", description: "Proven in battle across multiple campaigns." },
  { level: 5, xpRequired: 50000, title: "Galactic Admiral", profileBorder: "border_emerald", permanentUnlock: "Emerald Profile Border", description: "Commanded fleets across multiple seasons." },
  { level: 6, xpRequired: 80000, title: "Empire Architect", profileBorder: "border_diamond", permanentUnlock: "Diamond Profile Border", description: "Built empires that span the stars." },
  { level: 7, xpRequired: 120000, title: "Cosmic Warden", profileBorder: "border_ruby", permanentUnlock: "Ruby Profile Border", description: "Guardian of cosmic balance across seasons." },
  { level: 8, xpRequired: 180000, title: "Dimension Walker", profileBorder: "border_void", permanentUnlock: "Void Profile Border", description: "Traveled between dimensions." },
  { level: 9, xpRequired: 250000, title: "Eternal Champion", profileBorder: "border_eternal", permanentUnlock: "Eternal Profile Border", description: "Champion of the galaxy for all time." },
  { level: 10, xpRequired: 350000, title: "Eternal Emperor", profileBorder: "border_absolute", permanentUnlock: "Absolute Profile Border", description: "The supreme ruler of all existence." },
];

const ALLIANCE_PROJECTS: AllianceProject[] = [
  { id: "proj_stellar_gate", name: "Stellar Gate Project", description: "Construct a massive stellar gate for instant fleet travel.", cost: { metal: 100000000, crystal: 50000000, deuterium: 20000000 }, contributionSlots: 50, reward: { allianceXP: 5000, cosmetic: "cs_hq_war_forge", rankingPoints: 500 }, duration: 604800000 },
  { id: "proj_dyson_swarm", name: "Dyson Swarm Initiative", description: "Harness the full power of a star with a Dyson Swarm.", cost: { metal: 200000000, crystal: 100000000, deuterium: 50000000 }, contributionSlots: 100, reward: { allianceXP: 10000, cosmetic: "cs_hq_crystal_palace", rankingPoints: 1000 }, duration: 1209600000 },
  { id: "proj_galactic_senate", name: "Galactic Senate", description: "Establish a galactic senate to unite all alliances.", cost: { metal: 50000000, crystal: 50000000, deuterium: 10000000 }, contributionSlots: 30, reward: { allianceXP: 3000, cosmetic: "cs_banner_ancient_power", rankingPoints: 300 }, duration: 432000000 },
  { id: "proj_wormhole_network", name: "Wormhole Network", description: "Create a network of stable wormholes across the galaxy.", cost: { metal: 150000000, crystal: 75000000, deuterium: 30000000 }, contributionSlots: 75, reward: { allianceXP: 7500, cosmetic: "cs_effect_warp_breach", rankingPoints: 750 }, duration: 864000000 },
];

const CHAMPIONSHIP_CONFIG: ChampionshipConfig = {
  enabled: true,
  finalWeekDuration: 7,
  pointSources: [
    { activity: "pvp_victory", pointsPerUnit: 10 },
    { activity: "alliance_war_point", pointsPerUnit: 25 },
    { activity: "seasonal_objective", pointsPerUnit: 5 },
    { activity: "boss_damage_percent", pointsPerUnit: 50 },
    { activity: "territory_held", pointsPerUnit: 15 },
    { activity: "expedition_complete", pointsPerUnit: 3 },
  ],
  titles: [
    { rank: 1, name: "Galactic Explorer" },
    { rank: 2, name: "Supreme Commander" },
    { rank: 3, name: "Trade Magnate" },
    { rank: 4, name: "Conqueror of the Void" },
    { rank: 5, name: "Cosmic Champion" },
  ],
  grandPrize: { tokens: 2000, cosmetic: "cs_frame_eternal", title: "Eternal Champion", profileBorder: "border_eternal" },
};

const GALACTIC_TOKEN_SOURCES: GalacticTokenSource[] = [
  { source: "daily_mission", amount: 5, dailyCap: 60, description: "Complete daily missions" },
  { source: "weekly_mission", amount: 50, dailyCap: 350, description: "Complete weekly missions" },
  { source: "seasonal_mission", amount: 200, dailyCap: 2000, description: "Complete seasonal missions" },
  { source: "pvp_victory", amount: 10, dailyCap: 100, description: "Win PvP battles" },
  { source: "pve_victory", amount: 5, dailyCap: 50, description: "Win PvE battles" },
  { source: "expedition", amount: 8, dailyCap: 80, description: "Complete expeditions" },
  { source: "alliance_project", amount: 25, dailyCap: 200, description: "Contribute to alliance projects" },
  { source: "event_participation", amount: 15, dailyCap: 150, description: "Participate in seasonal events" },
  { source: "ranking_milestone", amount: 100, dailyCap: 500, description: "Reach ranking milestones" },
  { source: "login_streak", amount: 3, dailyCap: 30, description: "Maintain login streak" },
  { source: "achievement", amount: 20, dailyCap: 200, description: "Unlock achievements" },
  { source: "construction", amount: 3, dailyCap: 30, description: "Complete constructions" },
  { source: "research", amount: 5, dailyCap: 50, description: "Complete research projects" },
];

const ALLIANCE_SEASONAL_BUFFS: AllianceSeasonalBuff[] = [
  { id: "abuff_mining", name: "Mining Cooperative", description: "+5% mining output per level for all members.", effect: { type: "mining_output", value: 0.05 }, cost: 100, maxLevel: 5 },
  { id: "abuff_combat", name: "Combat Prowess", description: "+3% fleet attack per level.", effect: { type: "fleet_attack", value: 0.03 }, cost: 150, maxLevel: 5 },
  { id: "abuff_research", name: "Research Sharing", description: "+4% research speed per level.", effect: { type: "research_speed", value: 0.04 }, cost: 120, maxLevel: 5 },
  { id: "abuff_shield", name: "Shield Network", description: "+5% shield strength per level.", effect: { type: "shield_strength", value: 0.05 }, cost: 130, maxLevel: 5 },
  { id: "abuff_travel", name: "Fleet Logistics", description: "-5% fleet travel time per level.", effect: { type: "fleet_travel_time", value: -0.05 }, cost: 110, maxLevel: 3 },
];

function buildFreeTrack(maxTier: number): SeasonPassTier[] {
  const tiers: SeasonPassTier[] = [];
  for (let i = 1; i <= maxTier; i++) {
    const reward: SeasonTierReward =
      i % 10 === 0
        ? { type: "cosmetic", cosmeticId: SEASON_COSMETICS[i % SEASON_COSMETICS.length].id }
        : i % 5 === 0
          ? { type: "resource_pack", resourcePack: { metal: i * 5000, crystal: i * 2500, deuterium: i * 1000 } }
          : { type: "currency", currency: "galactic_tokens", amount: i * 5 };
    tiers.push({ tier: i, xpRequired: i * 500, freeReward: reward });
  }
  return tiers;
}

function buildPremiumTrack(maxTier: number): SeasonPassTier[] {
  const tiers: SeasonPassTier[] = [];
  for (let i = 1; i <= maxTier; i++) {
    const reward: SeasonTierReward =
      i % 10 === 0
        ? { type: "cosmetic", cosmeticId: SEASON_COSMETICS[(i * 3) % SEASON_COSMETICS.length].id }
        : i % 5 === 0
          ? { type: "booster", title: `Season Booster Lv${Math.ceil(i / 5)}`, duration: 86400000 }
          : { type: "currency", currency: "dark_matter", amount: i * 10 };
    tiers.push({ tier: i, xpRequired: i * 500, premiumReward: reward });
  }
  return tiers;
}

export const SEASON_DEFINITIONS: SeasonDefinition[] = [
  {
    id: "season_1_age_of_exploration",
    number: 1,
    theme: "age_of_exploration",
    name: "Age of Exploration",
    tagline: "Discover what lies beyond the frontier.",
    description: "Uncharted sectors await. Launch expeditions, discover ancient artifacts, and map the unknown galaxy. The Age of Exploration rewards the bold and the curious.",
    status: "active",
    startDate: "2026-01-15T00:00:00Z",
    endDate: "2026-04-09T00:00:00Z",
    speedMultiplier: { economy: 2, fleet: 1, research: 2 },
    maxTier: 100,
    xpPerTier: 500,
    totalSeasonXP: 50000,
    content: {
      theme: "age_of_exploration",
      dailyMissions: DAILY_MISSIONS,
      weeklyMissions: WEEKLY_MISSIONS,
      seasonalMissions: SEASONAL_MISSIONS,
      galacticTokens: GALACTIC_TOKEN_SOURCES,
      cosmetics: SEASON_COSMETICS,
    },
    techTree: SEASONAL_TECH_TREES.age_of_exploration,
    events: SEASONAL_EVENTS,
    rankings: {
      individual: [
        { category: "economy", title: "Economic Powerhouse", description: "Top economies of the season", thresholds: [
          { rank: 1, name: "Galactic Tycoon", minScore: 0, maxScore: Infinity, reward: { xp: 5000, tokens: 500, cosmetic: "cs_planet_void_nexus", title: "Galactic Tycoon" } },
          { rank: 10, name: "Trade Baron", minScore: 0, maxScore: Infinity, reward: { xp: 2000, tokens: 200, title: "Trade Baron" } },
          { rank: 100, name: "Merchant", minScore: 0, maxScore: Infinity, reward: { xp: 500, tokens: 50, title: "Merchant" } },
        ]},
        { category: "military", title: "Military Dominance", description: "Top military forces", thresholds: [
          { rank: 1, name: "Supreme Warlord", minScore: 0, maxScore: Infinity, reward: { xp: 5000, tokens: 500, cosmetic: "cs_fleet_cosmic_wrath", title: "Supreme Warlord" } },
          { rank: 10, name: "War Chief", minScore: 0, maxScore: Infinity, reward: { xp: 2000, tokens: 200, title: "War Chief" } },
          { rank: 100, name: "Soldier", minScore: 0, maxScore: Infinity, reward: { xp: 500, tokens: 50, title: "Soldier" } },
        ]},
        { category: "research", title: "Scientific Prowess", description: "Top researchers", thresholds: [
          { rank: 1, name: "Grand Scientist", minScore: 0, maxScore: Infinity, reward: { xp: 5000, tokens: 500, cosmetic: "cs_avatar_animated_blackhole", title: "Grand Scientist" } },
          { rank: 10, name: "Researcher", minScore: 0, maxScore: Infinity, reward: { xp: 2000, tokens: 200, title: "Researcher" } },
          { rank: 100, name: "Scholar", minScore: 0, maxScore: Infinity, reward: { xp: 500, tokens: 50, title: "Scholar" } },
        ]},
        { category: "season_xp", title: "Season Champions", description: "Top season XP earners", thresholds: [
          { rank: 1, name: "Season Champion", minScore: 0, maxScore: Infinity, reward: { xp: 10000, tokens: 1000, cosmetic: "cs_frame_eternal", title: "Season Champion" } },
          { rank: 10, name: "Season Elite", minScore: 0, maxScore: Infinity, reward: { xp: 4000, tokens: 400, title: "Season Elite" } },
          { rank: 100, name: "Season Player", minScore: 0, maxScore: Infinity, reward: { xp: 1000, tokens: 100 } },
        ]},
        { category: "exploration", title: "Exploration Masters", description: "Top explorers", thresholds: [
          { rank: 1, name: "Galaxy Cartographer", minScore: 0, maxScore: Infinity, reward: { xp: 5000, tokens: 500, cosmetic: "cs_frame_void_walker", title: "Galaxy Cartographer" } },
          { rank: 10, name: "Pathfinder", minScore: 0, maxScore: Infinity, reward: { xp: 2000, tokens: 200, title: "Pathfinder" } },
          { rank: 100, name: "Scout", minScore: 0, maxScore: Infinity, reward: { xp: 500, tokens: 50, title: "Scout" } },
        ]},
      ],
      alliance: [
        { category: "combined_score", title: "Alliance Power Rankings", description: "Overall alliance strength", thresholds: [
          { rank: 1, name: "Galactic Hegemon", minScore: 0, maxScore: Infinity, reward: { xp: 10000, tokens: 1000, cosmetic: "cs_hq_crystal_palace", title: "Galactic Hegemon" } },
          { rank: 5, name: "Major Power", minScore: 0, maxScore: Infinity, reward: { xp: 5000, tokens: 500, title: "Major Power" } },
          { rank: 25, name: "Rising Alliance", minScore: 0, maxScore: Infinity, reward: { xp: 1000, tokens: 100 } },
        ]},
        { category: "territory_control", title: "Territorial Dominance", description: "Most territory held", thresholds: [
          { rank: 1, name: "Territory Lord", minScore: 0, maxScore: Infinity, reward: { xp: 8000, tokens: 800, cosmetic: "cs_banner_war_era", title: "Territory Lord" } },
          { rank: 5, name: "Sector Controller", minScore: 0, maxScore: Infinity, reward: { xp: 4000, tokens: 400, title: "Sector Controller" } },
        ]},
      ],
      finalWeek: {
        durationDays: 7,
        pointSources: [
          { source: "pvp_victory", pointsPerUnit: 10 },
          { source: "alliance_war_point", pointsPerUnit: 25 },
          { source: "seasonal_objective", pointsPerUnit: 5 },
          { source: "boss_damage_percent", pointsPerUnit: 50 },
          { source: "territory_held", pointsPerUnit: 15 },
          { source: "expedition_complete", pointsPerUnit: 3 },
        ],
        championshipTitle: "Championship of the Stars",
        prizes: [
          { rank: 1, title: "Galactic Explorer", tokens: 2000, exclusiveCosmetic: "cs_frame_eternal", profileBorder: "border_eternal", legacyTitle: "Eternal Champion" },
          { rank: 2, title: "Supreme Commander", tokens: 1500, exclusiveCosmetic: "cs_fleet_cosmic_wrath", profileBorder: "border_diamond", legacyTitle: "Supreme Commander" },
          { rank: 3, title: "Trade Magnate", tokens: 1000, exclusiveCosmetic: "cs_planet_void_nexus", profileBorder: "border_ruby", legacyTitle: "Trade Magnate" },
          { rank: 4, title: "Conqueror of the Void", tokens: 750, exclusiveCosmetic: "cs_avatar_animated_blackhole", profileBorder: "border_platinum", legacyTitle: "Void Conqueror" },
          { rank: 5, title: "Cosmic Champion", tokens: 500, exclusiveCosmetic: "cs_banner_ancient_power", profileBorder: "border_gold", legacyTitle: "Cosmic Champion" },
        ],
      },
    },
    rewards: {
      freeTrack: buildFreeTrack(100),
      premiumTrack: buildPremiumTrack(100),
      prestigeRewards: PRESTIGE_LEVELS,
    },
    alliances: {
      projects: ALLIANCE_PROJECTS,
      leaderboards: [
        { category: "combined_score", title: "Alliance Power Rankings", topReward: { cosmetic: "cs_hq_crystal_palace", title: "Galactic Hegemon" } },
        { category: "event_points", title: "Event Champions", topReward: { cosmetic: "cs_banner_ancient_power", title: "Event Masters" } },
        { category: "territory_control", title: "Territorial Dominance", topReward: { cosmetic: "cs_planet_void_nexus", title: "Territory Lords" } },
        { category: "boss_damage", title: "Boss Slayers", topReward: { cosmetic: "cs_fleet_cosmic_wrath", title: "Boss Slayers" } },
        { category: "resources_mined", title: "Mining Empire", topReward: { cosmetic: "cs_planet_crystal_world", title: "Mining Kings" } },
        { category: "ships_destroyed", title: "War Machine", topReward: { cosmetic: "cs_effect_warp_breach", title: "War Machine" } },
      ],
      seasonalBuffs: ALLIANCE_SEASONAL_BUFFS,
    },
    championship: CHAMPIONSHIP_CONFIG,
  },
  {
    id: "season_2_galactic_war",
    number: 2,
    theme: "galactic_war",
    name: "Galactic War",
    tagline: "The galaxy burns. Only the strongest survive.",
    description: "All-out war engulfs the galaxy. PvP combat, alliance wars, and fleet tournaments determine who rules. The Galactic War season rewards military supremacy.",
    status: "upcoming",
    startDate: "2026-04-10T00:00:00Z",
    endDate: "2026-07-03T00:00:00Z",
    speedMultiplier: { economy: 1, fleet: 4, research: 1 },
    maxTier: 100,
    xpPerTier: 500,
    totalSeasonXP: 50000,
    content: {
      theme: "galactic_war",
      dailyMissions: DAILY_MISSIONS.map(m => ({ ...m, xpReward: Math.floor(m.xpReward * 1.5), tokenReward: Math.floor(m.tokenReward * 1.5) })),
      weeklyMissions: WEEKLY_MISSIONS.map(m => ({ ...m, xpReward: Math.floor(m.xpReward * 1.5), tokenReward: Math.floor(m.tokenReward * 1.5) })),
      seasonalMissions: SEASONAL_MISSIONS.map(m => ({ ...m, xpReward: Math.floor(m.xpReward * 1.5), tokenReward: Math.floor(m.tokenReward * 1.5) })),
      galacticTokens: GALACTIC_TOKEN_SOURCES,
      cosmetics: SEASON_COSMETICS,
    },
    techTree: SEASONAL_TECH_TREES.galactic_war,
    events: SEASONAL_EVENTS,
    rankings: {
      individual: [
        { category: "military", title: "War Champions", description: "Top military forces", thresholds: [
          { rank: 1, name: "Supreme Warlord", minScore: 0, maxScore: Infinity, reward: { xp: 10000, tokens: 1000, cosmetic: "cs_fleet_cosmic_wrath", title: "Supreme Warlord" } },
          { rank: 10, name: "War Chief", minScore: 0, maxScore: Infinity, reward: { xp: 4000, tokens: 400, title: "War Chief" } },
          { rank: 100, name: "Soldier", minScore: 0, maxScore: Infinity, reward: { xp: 1000, tokens: 100 } },
        ]},
        { category: "season_xp", title: "Season Champions", description: "Top season XP earners", thresholds: [
          { rank: 1, name: "Season Champion", minScore: 0, maxScore: Infinity, reward: { xp: 10000, tokens: 1000, cosmetic: "cs_frame_eternal", title: "Season Champion" } },
          { rank: 10, name: "Season Elite", minScore: 0, maxScore: Infinity, reward: { xp: 4000, tokens: 400, title: "Season Elite" } },
        ]},
      ],
      alliance: [
        { category: "combined_score", title: "Alliance Power Rankings", description: "Overall alliance strength", thresholds: [
          { rank: 1, name: "Galactic Hegemon", minScore: 0, maxScore: Infinity, reward: { xp: 10000, tokens: 1000, cosmetic: "cs_hq_crystal_palace", title: "Galactic Hegemon" } },
        ]},
      ],
      finalWeek: {
        durationDays: 7,
        pointSources: [
          { source: "pvp_victory", pointsPerUnit: 20 },
          { source: "alliance_war_point", pointsPerUnit: 50 },
          { source: "fleet_power_gained", pointsPerUnit: 5 },
        ],
        championshipTitle: "Galactic War Championship",
        prizes: CHAMPIONSHIP_CONFIG.titles.map(t => ({
          rank: t.rank,
          title: t.name,
          tokens: 2000 - (t.rank - 1) * 400,
          exclusiveCosmetic: `cs_war_champion_${t.rank}`,
          profileBorder: `border_war_${t.rank}`,
          legacyTitle: `${t.name} of War`,
        })),
      },
    },
    rewards: {
      freeTrack: buildFreeTrack(100),
      premiumTrack: buildPremiumTrack(100),
      prestigeRewards: PRESTIGE_LEVELS,
    },
    alliances: {
      projects: ALLIANCE_PROJECTS,
      leaderboards: [
        { category: "combined_score", title: "War Alliance Rankings", topReward: { cosmetic: "cs_hq_crystal_palace", title: "War Hegemon" } },
        { category: "ships_destroyed", title: "Fleet Destroyers", topReward: { cosmetic: "cs_fleet_cosmic_wrath", title: "Fleet Destroyers" } },
      ],
      seasonalBuffs: ALLIANCE_SEASONAL_BUFFS,
    },
    championship: CHAMPIONSHIP_CONFIG,
  },
  {
    id: "season_3_corporate_expansion",
    number: 3,
    theme: "corporate_expansion",
    name: "Corporate Expansion",
    tagline: "Money talks. Empires are built on credits.",
    description: "Mega-corporations vie for galactic dominance through trade routes, resource rushes, and economic warfare. The Corporate Expansion rewards the shrewdest traders.",
    status: "upcoming",
    startDate: "2026-07-04T00:00:00Z",
    endDate: "2026-09-26T00:00:00Z",
    speedMultiplier: { economy: 4, fleet: 1, research: 2 },
    maxTier: 100,
    xpPerTier: 500,
    totalSeasonXP: 50000,
    content: {
      theme: "corporate_expansion",
      dailyMissions: DAILY_MISSIONS.map(m => ({ ...m, xpReward: Math.floor(m.xpReward * 1.3), tokenReward: Math.floor(m.tokenReward * 1.3) })),
      weeklyMissions: WEEKLY_MISSIONS.map(m => ({ ...m, xpReward: Math.floor(m.xpReward * 1.3), tokenReward: Math.floor(m.tokenReward * 1.3) })),
      seasonalMissions: SEASONAL_MISSIONS,
      galacticTokens: GALACTIC_TOKEN_SOURCES,
      cosmetics: SEASON_COSMETICS,
    },
    techTree: SEASONAL_TECH_TREES.corporate_expansion,
    events: SEASONAL_EVENTS,
    rankings: {
      individual: [
        { category: "economy", title: "Economic Powerhouse", description: "Top economies", thresholds: [
          { rank: 1, name: "Galactic CEO", minScore: 0, maxScore: Infinity, reward: { xp: 10000, tokens: 1000, cosmetic: "cs_planet_void_nexus", title: "Galactic CEO" } },
        ]},
      ],
      alliance: [
        { category: "combined_score", title: "Corporate Alliance Rankings", description: "Top corporate alliances", thresholds: [
          { rank: 1, name: "Corporate Empire", minScore: 0, maxScore: Infinity, reward: { xp: 10000, tokens: 1000, cosmetic: "cs_hq_crystal_palace", title: "Corporate Empire" } },
        ]},
      ],
      finalWeek: CHAMPIONSHIP_CONFIG.titles.map(t => ({
        ...t,
        name: t.name,
      })).length > 0 ? { durationDays: 7, pointSources: [{ source: "trade_volume", pointsPerUnit: 1 }], championshipTitle: "Trade Championship", prizes: [] } : { durationDays: 7, pointSources: [], championshipTitle: "", prizes: [] },
    },
    rewards: {
      freeTrack: buildFreeTrack(100),
      premiumTrack: buildPremiumTrack(100),
      prestigeRewards: PRESTIGE_LEVELS,
    },
    alliances: {
      projects: ALLIANCE_PROJECTS,
      leaderboards: [
        { category: "resources_mined", title: "Mining Empire", topReward: { cosmetic: "cs_planet_crystal_world", title: "Mining Kings" } },
      ],
      seasonalBuffs: ALLIANCE_SEASONAL_BUFFS,
    },
    championship: CHAMPIONSHIP_CONFIG,
  },
  {
    id: "season_4_alien_incursion",
    number: 4,
    theme: "alien_incursion",
    name: "Alien Incursion",
    tagline: "They came from the void. Now we fight.",
    description: "Hostile alien armadas pour through dimensional rifts. Unite with alliances to defend the galaxy. The Alien Incursion rewards those who stand against the darkness.",
    status: "upcoming",
    startDate: "2026-09-27T00:00:00Z",
    endDate: "2026-12-19T00:00:00Z",
    speedMultiplier: { economy: 2, fleet: 2, research: 2 },
    maxTier: 100,
    xpPerTier: 500,
    totalSeasonXP: 50000,
    content: {
      theme: "alien_incursion",
      dailyMissions: DAILY_MISSIONS,
      weeklyMissions: WEEKLY_MISSIONS,
      seasonalMissions: SEASONAL_MISSIONS,
      galacticTokens: GALACTIC_TOKEN_SOURCES,
      cosmetics: SEASON_COSMETICS,
    },
    techTree: SEASONAL_TECH_TREES.alien_incursion,
    events: SEASONAL_EVENTS,
    rankings: {
      individual: [
        { category: "military", title: "Defender Rankings", description: "Top alien slayers", thresholds: [
          { rank: 1, name: "Galactic Defender", minScore: 0, maxScore: Infinity, reward: { xp: 10000, tokens: 1000, cosmetic: "cs_fleet_cosmic_wrath", title: "Galactic Defender" } },
        ]},
      ],
      alliance: [
        { category: "combined_score", title: "Defense Alliance Rankings", description: "Top defending alliances", thresholds: [
          { rank: 1, name: "Shield of the Galaxy", minScore: 0, maxScore: Infinity, reward: { xp: 10000, tokens: 1000, cosmetic: "cs_hq_crystal_palace", title: "Shield of the Galaxy" } },
        ]},
      ],
      finalWeek: CHAMPIONSHIP_CONFIG.titles.map(t => ({
        ...t,
        name: t.name,
      })).length > 0 ? { durationDays: 7, pointSources: [{ source: "alien_kills", pointsPerUnit: 15 }], championshipTitle: "Defender Championship", prizes: [] } : { durationDays: 7, pointSources: [], championshipTitle: "", prizes: [] },
    },
    rewards: {
      freeTrack: buildFreeTrack(100),
      premiumTrack: buildPremiumTrack(100),
      prestigeRewards: PRESTIGE_LEVELS,
    },
    alliances: {
      projects: ALLIANCE_PROJECTS,
      leaderboards: [
        { category: "boss_damage", title: "Alien Slayers", topReward: { cosmetic: "cs_fleet_cosmic_wrath", title: "Alien Slayers" } },
      ],
      seasonalBuffs: ALLIANCE_SEASONAL_BUFFS,
    },
    championship: CHAMPIONSHIP_CONFIG,
  },
];

export function getActiveSeason(): SeasonDefinition | undefined {
  return SEASON_DEFINITIONS.find(s => s.status === "active");
}

export function getSeasonByNumber(num: number): SeasonDefinition | undefined {
  return SEASON_DEFINITIONS.find(s => s.number === num);
}

export function getSeasonTechTree(theme: SeasonTheme): SeasonTechNode[] {
  return SEASONAL_TECH_TREES[theme] || [];
}

export function calculateSeasonXPFromActivity(activity: string, amount: number): number {
  const xpTable: Record<string, number> = {
    build_upgrade: 50,
    research_complete: 100,
    attack_victory: 150,
    expedition: 75,
    weekly_mission: 500,
    daily_mission: 100,
    alliance_contribution: 200,
    market_trade: 25,
    colonization: 300,
    pvp_win: 200,
    pve_win: 100,
    boss_damage: 150,
    territory_control: 250,
  };
  return Math.floor((xpTable[activity] || 10) * amount);
}

export function calculateTokenReward(source: string, amount: number, dailyState: Record<string, number>): { tokens: number; capped: boolean } {
  const sourceConfig = GALACTIC_TOKEN_SOURCES.find(s => s.source === source);
  if (!sourceConfig) return { tokens: 0, capped: true };

  const todayEarned = dailyState[source] || 0;
  const maxDaily = sourceConfig.dailyCap;
  const remaining = Math.max(0, maxDaily - todayEarned);
  const potentialTokens = sourceConfig.amount * amount;
  const actualTokens = Math.min(potentialTokens, remaining);

  return { tokens: actualTokens, capped: actualTokens < potentialTokens };
}
