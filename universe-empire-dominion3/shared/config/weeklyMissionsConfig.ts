export type MissionCategory = "combat" | "mining" | "exploration" | "crafting" | "research" | "trading" | "social";
export type MissionDifficulty = "easy" | "medium" | "hard" | "elite" | "legendary";

export interface WeeklyMissionTemplate {
  id: string;
  title: string;
  description: string;
  category: MissionCategory;
  difficulty: MissionDifficulty;
  objectiveType: string;
  objectiveTarget: number;
  rewardXp: number;
  rewardCredits: number;
  rewardResources: { metal?: number; crystal?: number; deuterium?: number };
  bonusMultiplier: number;
}

export interface WeeklyMissionState {
  weekId: string;
  weekStart: string;
  weekEnd: string;
  missions: WeeklyMissionAssignment[];
  bonusPool: number;
  completedCount: number;
  totalCount: number;
  streak: number;
}

export interface WeeklyMissionAssignment {
  templateId: string;
  title: string;
  description: string;
  category: MissionCategory;
  difficulty: MissionDifficulty;
  objectiveType: string;
  objectiveTarget: number;
  currentProgress: number;
  rewardXp: number;
  rewardCredits: number;
  rewardResources: { metal?: number; crystal?: number; deuterium?: number };
  status: "active" | "completed" | "claimed";
  claimedAt?: string;
  completedAt?: string;
}

const MISSION_POOL: WeeklyMissionTemplate[] = [
  { id: "wm_combat_01", title: "Pirate Purge", description: "Destroy pirate ships in contested sectors.", category: "combat", difficulty: "easy", objectiveType: "destroy_ships", objectiveTarget: 5, rewardXp: 200, rewardCredits: 1000, rewardResources: { metal: 100 }, bonusMultiplier: 1.0 },
  { id: "wm_combat_02", title: "Void Hunt", description: "Eliminate void entities in deep space.", category: "combat", difficulty: "medium", objectiveType: "destroy_ships", objectiveTarget: 15, rewardXp: 500, rewardCredits: 3000, rewardResources: { metal: 250, crystal: 100 }, bonusMultiplier: 1.2 },
  { id: "wm_combat_03", title: "Warlord Assassination", description: "Track and eliminate a pirate warlord.", category: "combat", difficulty: "hard", objectiveType: "boss_kills", objectiveTarget: 1, rewardXp: 1200, rewardCredits: 8000, rewardResources: { metal: 500, crystal: 300, deuterium: 100 }, bonusMultiplier: 1.5 },
  { id: "wm_combat_04", title: "Arena Champion", description: "Win PvP arena matches against other commanders.", category: "combat", difficulty: "elite", objectiveType: "pvp_wins", objectiveTarget: 10, rewardXp: 2000, rewardCredits: 15000, rewardResources: { metal: 800, crystal: 500, deuterium: 200 }, bonusMultiplier: 2.0 },
  { id: "wm_combat_05", title: "Raid Commander", description: "Participate in raid boss encounters.", category: "combat", difficulty: "legendary", objectiveType: "raid_participations", objectiveTarget: 5, rewardXp: 5000, rewardCredits: 30000, rewardResources: { metal: 1500, crystal: 1000, deuterium: 500 }, bonusMultiplier: 2.5 },

  { id: "wm_mining_01", title: "Mineral Sweep", description: "Extract metal from asteroid mining operations.", category: "mining", difficulty: "easy", objectiveType: "mine_metal", objectiveTarget: 5000, rewardXp: 150, rewardCredits: 800, rewardResources: { metal: 500 }, bonusMultiplier: 1.0 },
  { id: "wm_mining_02", title: "Crystal Harvest", description: "Mine crystal deposits across your colonies.", category: "mining", difficulty: "medium", objectiveType: "mine_crystal", objectiveTarget: 3000, rewardXp: 400, rewardCredits: 2500, rewardResources: { crystal: 300 }, bonusMultiplier: 1.2 },
  { id: "wm_mining_03", title: "Deuterium Refinery", description: "Produce deuterium fuel for your fleet.", category: "mining", difficulty: "hard", objectiveType: "produce_deuterium", objectiveTarget: 2000, rewardXp: 800, rewardCredits: 5000, rewardResources: { deuterium: 400 }, bonusMultiplier: 1.5 },
  { id: "wm_mining_04", title: "Deep Core Extraction", description: "Mine rare minerals from deep-core operations.", category: "mining", difficulty: "elite", objectiveType: "mine_rare", objectiveTarget: 500, rewardXp: 1500, rewardCredits: 10000, rewardResources: { metal: 1000, crystal: 800, deuterium: 300 }, bonusMultiplier: 2.0 },

  { id: "wm_explore_01", title: "Scout Patrol", description: "Explore new star systems in your sector.", category: "exploration", difficulty: "easy", objectiveType: "explore_systems", objectiveTarget: 3, rewardXp: 200, rewardCredits: 1200, rewardResources: { crystal: 50 }, bonusMultiplier: 1.0 },
  { id: "wm_explore_02", title: "Anomaly Investigation", description: "Investigate anomalous signals in deep space.", category: "exploration", difficulty: "medium", objectiveType: "anomaly_scan", objectiveTarget: 5, rewardXp: 600, rewardCredits: 4000, rewardResources: { crystal: 200, deuterium: 50 }, bonusMultiplier: 1.2 },
  { id: "wm_explore_03", title: "Wormhole Mapping", description: "Chart wormhole connections between sectors.", category: "exploration", difficulty: "hard", objectiveType: "wormhole_chart", objectiveTarget: 3, rewardXp: 1000, rewardCredits: 7000, rewardResources: { crystal: 400, deuterium: 200 }, bonusMultiplier: 1.5 },
  { id: "wm_explore_04", title: "Frontier Expedition", description: "Establish footholds in uncharted territory.", category: "exploration", difficulty: "elite", objectiveType: "colonize_planets", objectiveTarget: 2, rewardXp: 2500, rewardCredits: 20000, rewardResources: { metal: 1200, crystal: 800, deuterium: 400 }, bonusMultiplier: 2.0 },

  { id: "wm_craft_01", title: "Shipyard Production", description: "Construct ships at your shipyard facilities.", category: "crafting", difficulty: "easy", objectiveType: "build_ships", objectiveTarget: 10, rewardXp: 180, rewardCredits: 900, rewardResources: { metal: 150 }, bonusMultiplier: 1.0 },
  { id: "wm_craft_02", title: "Equipment Forge", description: "Craft equipment modules at your foundries.", category: "crafting", difficulty: "medium", objectiveType: "craft_equipment", objectiveTarget: 5, rewardXp: 450, rewardCredits: 2800, rewardResources: { metal: 200, crystal: 150 }, bonusMultiplier: 1.2 },
  { id: "wm_craft_03", title: "Advanced Fabrication", description: "Produce advanced components using rare materials.", category: "crafting", difficulty: "hard", objectiveType: "craft_advanced", objectiveTarget: 3, rewardXp: 900, rewardCredits: 6000, rewardResources: { metal: 400, crystal: 300, deuterium: 100 }, bonusMultiplier: 1.5 },
  { id: "wm_craft_04", title: "Blueprint Mastery", description: "Manufacture items from rare blueprints.", category: "crafting", difficulty: "elite", objectiveType: "manufacture_blueprints", objectiveTarget: 5, rewardXp: 1800, rewardCredits: 12000, rewardResources: { metal: 600, crystal: 400, deuterium: 200 }, bonusMultiplier: 2.0 },

  { id: "wm_research_01", title: "Basic Research", description: "Complete technology research projects.", category: "research", difficulty: "easy", objectiveType: "research_tech", objectiveTarget: 2, rewardXp: 250, rewardCredits: 1100, rewardResources: { crystal: 100 }, bonusMultiplier: 1.0 },
  { id: "wm_research_02", title: "Advanced Studies", description: "Research advanced technology blueprints.", category: "research", difficulty: "medium", objectiveType: "research_advanced", objectiveTarget: 3, rewardXp: 550, rewardCredits: 3500, rewardResources: { crystal: 250, deuterium: 80 }, bonusMultiplier: 1.2 },
  { id: "wm_research_03", title: "Breakthrough Discovery", description: "Achieve a major research breakthrough.", category: "research", difficulty: "hard", objectiveType: "research_breakthrough", objectiveTarget: 1, rewardXp: 1100, rewardCredits: 7500, rewardResources: { crystal: 500, deuterium: 200 }, bonusMultiplier: 1.5 },
  { id: "wm_research_04", title: "Quantum Theorist", description: "Master quantum-level research disciplines.", category: "research", difficulty: "elite", objectiveType: "research_quantum", objectiveTarget: 2, rewardXp: 2200, rewardCredits: 18000, rewardResources: { crystal: 800, deuterium: 400 }, bonusMultiplier: 2.0 },

  { id: "wm_trade_01", title: "Market Trader", description: "Complete market transactions for profit.", category: "trading", difficulty: "easy", objectiveType: "market_trades", objectiveTarget: 10, rewardXp: 150, rewardCredits: 1500, rewardResources: { metal: 80, crystal: 80 }, bonusMultiplier: 1.0 },
  { id: "wm_trade_02", title: "Resource Broker", description: "Trade resources across multiple colonies.", category: "trading", difficulty: "medium", objectiveType: "resource_trades", objectiveTarget: 20, rewardXp: 400, rewardCredits: 3500, rewardResources: { metal: 200, crystal: 200, deuterium: 50 }, bonusMultiplier: 1.2 },
  { id: "wm_trade_03", title: "Black Market Deal", description: "Complete high-value underground trades.", category: "trading", difficulty: "hard", objectiveType: "high_value_trades", objectiveTarget: 5, rewardXp: 800, rewardCredits: 6000, rewardResources: { metal: 300, crystal: 300, deuterium: 150 }, bonusMultiplier: 1.5 },
  { id: "wm_trade_04", title: "Trade Empire", description: "Establish dominance in the galactic market.", category: "trading", difficulty: "elite", objectiveType: "trade_volume", objectiveTarget: 100000, rewardXp: 1600, rewardCredits: 12000, rewardResources: { metal: 500, crystal: 500, deuterium: 300 }, bonusMultiplier: 2.0 },

  { id: "wm_social_01", title: "Alliance Duty", description: "Contribute resources to your alliance.", category: "social", difficulty: "easy", objectiveType: "alliance_donate", objectiveTarget: 1000, rewardXp: 200, rewardCredits: 1000, rewardResources: { metal: 100, crystal: 50 }, bonusMultiplier: 1.0 },
  { id: "wm_social_02", title: "Guild Operations", description: "Participate in guild raids and activities.", category: "social", difficulty: "medium", objectiveType: "guild_activities", objectiveTarget: 5, rewardXp: 500, rewardCredits: 3000, rewardResources: { metal: 200, crystal: 200 }, bonusMultiplier: 1.2 },
  { id: "wm_social_03", title: "Diplomatic Envoy", description: "Establish trade agreements with other empires.", category: "social", difficulty: "hard", objectiveType: "trade_agreements", objectiveTarget: 3, rewardXp: 900, rewardCredits: 6000, rewardResources: { crystal: 400, deuterium: 150 }, bonusMultiplier: 1.5 },
  { id: "wm_social_04", title: "Galactic Council", description: "Influence galactic politics through diplomatic actions.", category: "social", difficulty: "elite", objectiveType: "diplomatic_actions", objectiveTarget: 10, rewardXp: 2000, rewardCredits: 15000, rewardResources: { metal: 600, crystal: 600, deuterium: 300 }, bonusMultiplier: 2.0 },
];

export function getWeekId(date: Date = new Date()): string {
  const d = new Date(date);
  const day = d.getUTCDay();
  const diff = d.getUTCDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), diff));
  return monday.toISOString().split("T")[0];
}

export function getWeekStart(weekId: string): Date {
  return new Date(weekId + "T00:00:00Z");
}

export function getWeekEnd(weekId: string): Date {
  const start = getWeekStart(weekId);
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 7);
  return end;
}

export function selectWeeklyMissions(weekId: string, count: number = 5): WeeklyMissionTemplate[] {
  let seed = 0;
  for (let i = 0; i < weekId.length; i++) seed = ((seed << 5) - seed + weekId.charCodeAt(i)) | 0;

  const shuffled = [...MISSION_POOL];
  for (let i = shuffled.length - 1; i > 0; i--) {
    seed = (seed * 16807 + 0) % 2147483647;
    const j = seed % (i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const selected: WeeklyMissionTemplate[] = [];
  const categories = new Set<MissionCategory>();
  const difficulties: MissionDifficulty[] = ["easy", "medium", "hard", "elite", "legendary"];

  for (const diff of difficulties) {
    const candidates = shuffled.filter((m) => m.difficulty === diff && !selected.some((s) => s.id === m.id));
    if (candidates.length > 0) {
      selected.push(candidates[0]);
    }
    if (selected.length >= count) break;
  }

  while (selected.length < count) {
    const remaining = shuffled.filter((m) => !selected.some((s) => s.id === m.id));
    if (remaining.length === 0) break;
    selected.push(remaining[0]);
  }

  return selected.slice(0, count);
}

export function buildWeeklyMissionState(weekId: string, templateIds: string[]): WeeklyMissionState {
  const missions: WeeklyMissionAssignment[] = templateIds.map((tid) => {
    const template = MISSION_POOL.find((m) => m.id === tid);
    if (!template) return null;
    return {
      templateId: template.id,
      title: template.title,
      description: template.description,
      category: template.category,
      difficulty: template.difficulty,
      objectiveType: template.objectiveType,
      objectiveTarget: template.objectiveTarget,
      currentProgress: 0,
      rewardXp: template.rewardXp,
      rewardCredits: template.rewardCredits,
      rewardResources: template.rewardResources,
      status: "active" as const,
    };
  }).filter(Boolean) as WeeklyMissionAssignment[];

  return {
    weekId,
    weekStart: getWeekStart(weekId).toISOString(),
    weekEnd: getWeekEnd(weekId).toISOString(),
    missions,
    bonusPool: 0,
    completedCount: 0,
    totalCount: missions.length,
    streak: 0,
  };
}

export function calculateWeeklyBonus(state: WeeklyMissionState): number {
  const completionRate = state.totalCount > 0 ? state.completedCount / state.totalCount : 0;
  if (completionRate >= 1.0) return 3.0;
  if (completionRate >= 0.8) return 2.0;
  if (completionRate >= 0.5) return 1.5;
  return 1.0;
}

export function getMissionDifficultyColor(difficulty: MissionDifficulty): string {
  return { easy: "#22c55e", medium: "#3b82f6", hard: "#f59e0b", elite: "#a855f7", legendary: "#ec4899" }[difficulty];
}

export function getMissionCategoryIcon(category: MissionCategory): string {
  return { combat: "⚔️", mining: "⛏️", exploration: "🔭", crafting: "🔧", research: "🔬", trading: "💰", social: "🤝" }[category];
}
