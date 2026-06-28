import {
  SEASON_DEFINITIONS,
  type SeasonDefinition,
  type SeasonPassState,
  type DailyMissionState,
  type WeeklyMissionState,
  type SeasonalMissionState,
  type MissionAssignment,
  type SeasonTechNode,
  calculateSeasonXPFromActivity,
  calculateTokenReward,
} from "../../shared/config/seasonConfig";

const seasonStates = new Map<string, SeasonPassState>();

function getDefaultDailyMissions(season: SeasonDefinition): DailyMissionState {
  const pool = season.content.dailyMissions;
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, 3);
  const missions: MissionAssignment[] = selected.map(t => ({
    templateId: t.id,
    title: t.title,
    description: t.description,
    category: t.category,
    objectiveType: t.objectiveType,
    objectiveTarget: t.objectiveTarget,
    currentProgress: 0,
    xpReward: t.xpReward,
    tokenReward: t.tokenReward,
    resourceRewards: t.resourceRewards,
    status: "active" as const,
  }));
  return {
    date: new Date().toISOString().split("T")[0],
    missions,
    refreshCount: 0,
    maxRefreshes: 3,
  };
}

function getDefaultWeeklyMissions(season: SeasonDefinition): WeeklyMissionState {
  const pool = season.content.weeklyMissions;
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, 5);
  const now = new Date();
  const weekEnd = new Date(now);
  weekEnd.setDate(weekEnd.getDate() + (7 - weekEnd.getDay()));
  const missions: MissionAssignment[] = selected.map(t => ({
    templateId: t.id,
    title: t.title,
    description: t.description,
    category: t.category,
    objectiveType: t.objectiveType,
    objectiveTarget: t.objectiveTarget,
    currentProgress: 0,
    xpReward: t.xpReward,
    tokenReward: t.tokenReward,
    resourceRewards: t.resourceRewards,
    status: "active" as const,
  }));
  return {
    weekId: `w${now.getFullYear()}-${String(Math.ceil((now.getTime() - new Date(now.getFullYear(), 0, 1).getTime()) / 604800000)).padStart(2, "0")}`,
    weekStart: now.toISOString(),
    weekEnd: weekEnd.toISOString(),
    missions,
    streak: 0,
    bestStreak: 0,
    completedCount: 0,
  };
}

function getDefaultSeasonalMissions(season: SeasonDefinition): SeasonalMissionState {
  const missions: MissionAssignment[] = season.content.seasonalMissions.map(t => ({
    templateId: t.id,
    title: t.title,
    description: t.description,
    category: t.category,
    objectiveType: t.objectiveType,
    objectiveTarget: t.objectiveTarget,
    currentProgress: 0,
    xpReward: t.xpReward,
    tokenReward: t.tokenReward,
    resourceRewards: t.resourceRewards,
    status: "active" as const,
  }));
  return { missions, completedCount: 0, totalSeasonalXP: 0 };
}

export function getOrCreateSeasonState(userId: string, seasonId: string): SeasonPassState {
  const key = `${userId}:${seasonId}`;
  if (seasonStates.has(key)) return seasonStates.get(key)!;

  const season = SEASON_DEFINITIONS.find(s => s.id === seasonId);
  if (!season) throw new Error(`Season ${seasonId} not found`);

  const state: SeasonPassState = {
    seasonId,
    userId,
    xp: 0,
    currentTier: 1,
    xpIntoTier: 0,
    xpForNextTier: season.xpPerTier,
    completionRatio: 0,
    claimedFree: [],
    claimedPremium: [],
    premiumUnlocked: false,
    galacticTokens: 0,
    totalTokensEarned: 0,
    totalTokensSpent: 0,
    dailyMissionState: getDefaultDailyMissions(season),
    weeklyMissionState: getDefaultWeeklyMissions(season),
    seasonalMissionState: getDefaultSeasonalMissions(season),
    techProgress: {},
    eventScores: {},
    rankings: {},
    championshipPoints: 0,
    prestigeLevel: 0,
    cosmetics: [],
    titles: [],
    completedMissions: 0,
    loginStreak: 0,
    lastLoginDate: new Date().toISOString().split("T")[0],
  };

  seasonStates.set(key, state);
  return state;
}

export function addSeasonXP(userId: string, seasonId: string, xp: number): SeasonPassState {
  const state = getOrCreateSeasonState(userId, seasonId);
  const season = SEASON_DEFINITIONS.find(s => s.id === seasonId);
  if (!season) return state;

  state.xp += xp;

  while (state.currentTier < season.maxTier && state.xp >= state.xpForNextTier) {
    state.xp -= state.xpForNextTier;
    state.currentTier++;
    state.xpForNextTier = season.xpPerTier;
  }

  state.completionRatio = state.currentTier / season.maxTier;
  return state;
}

export function claimFreeReward(userId: string, seasonId: string, tier: number): { success: boolean; message: string } {
  const state = getOrCreateSeasonState(userId, seasonId);
  const season = SEASON_DEFINITIONS.find(s => s.id === seasonId);
  if (!season) return { success: false, message: "Season not found" };
  if (state.currentTier < tier) return { success: false, message: "Tier not reached" };
  if (state.claimedFree.includes(tier)) return { success: false, message: "Already claimed" };

  state.claimedFree.push(tier);
  const tierConfig = season.rewards.freeTrack.find(t => t.tier === tier);
  if (tierConfig?.freeReward?.type === "currency" && tierConfig.freeReward.currency === "galactic_tokens") {
    const tokens = tierConfig.freeReward.amount || 0;
    state.galacticTokens += tokens;
    state.totalTokensEarned += tokens;
  }
  return { success: true, message: `Claimed tier ${tier} reward` };
}

export function claimPremiumReward(userId: string, seasonId: string, tier: number): { success: boolean; message: string } {
  const state = getOrCreateSeasonState(userId, seasonId);
  const season = SEASON_DEFINITIONS.find(s => s.id === seasonId);
  if (!season) return { success: false, message: "Season not found" };
  if (!state.premiumUnlocked) return { success: false, message: "Premium track not unlocked" };
  if (state.currentTier < tier) return { success: false, message: "Tier not reached" };
  if (state.claimedPremium.includes(tier)) return { success: false, message: "Already claimed" };

  state.claimedPremium.push(tier);
  return { success: true, message: `Claimed premium tier ${tier} reward` };
}

export function unlockPremiumTrack(userId: string, seasonId: string, cost: number): { success: boolean; message: string } {
  const state = getOrCreateSeasonState(userId, seasonId);
  if (state.premiumUnlocked) return { success: false, message: "Already unlocked" };
  if (state.galacticTokens < cost) return { success: false, message: "Insufficient tokens" };

  state.galacticTokens -= cost;
  state.totalTokensEarned -= cost;
  state.premiumUnlocked = true;
  return { success: true, message: "Premium track unlocked" };
}

export function updateMissionProgress(userId: string, seasonId: string, objectiveType: string, amount: number): { missionsCompleted: string[]; xpGained: number; tokensGained: number } {
  const state = getOrCreateSeasonState(userId, seasonId);
  const completed: string[] = [];
  let totalXP = 0;
  let totalTokens = 0;

  const allMissions = [
    ...state.dailyMissionState.missions,
    ...state.weeklyMissionState.missions,
    ...state.seasonalMissionState.missions,
  ];

  for (const mission of allMissions) {
    if (mission.status !== "active") continue;
    if (mission.objectiveType !== objectiveType) continue;

    mission.currentProgress = Math.min(mission.objectiveTarget, mission.currentProgress + amount);

    if (mission.currentProgress >= mission.objectiveTarget && mission.status === "active") {
      mission.status = "completed";
      completed.push(mission.templateId);
      totalXP += mission.xpReward;
      totalTokens += mission.tokenReward;
      state.completedMissions++;
    }
  }

  if (totalXP > 0) addSeasonXP(userId, seasonId, totalXP);
  state.galacticTokens += totalTokens;
  state.totalTokensEarned += totalTokens;

  return { missionsCompleted: completed, xpGained: totalXP, tokensGained: totalTokens };
}

export function startResearch(userId: string, seasonId: string, techId: string): { success: boolean; message: string } {
  const state = getOrCreateSeasonState(userId, seasonId);
  const season = SEASON_DEFINITIONS.find(s => s.id === seasonId);
  if (!season) return { success: false, message: "Season not found" };

  const tech = season.techTree.find(t => t.id === techId);
  if (!tech) return { success: false, message: "Tech not found" };
  if (state.techProgress[techId]) return { success: false, message: "Already researched" };

  for (const prereq of tech.prerequisites) {
    if (!state.techProgress[prereq]) return { success: false, message: `Requires: ${prereq}` };
  }

  if (state.galacticTokens < tech.cost.tokens) return { success: false, message: "Insufficient tokens" };

  state.galacticTokens -= tech.cost.tokens;
  state.totalTokensSpent += tech.cost.tokens;
  state.techProgress[techId] = 1;

  return { success: true, message: `Researched: ${tech.name}` };
}

export function getSeasonOverview(userId: string, seasonId: string) {
  const state = getOrCreateSeasonState(userId, seasonId);
  const season = SEASON_DEFINITIONS.find(s => s.id === seasonId);
  if (!season) return null;

  return {
    season: {
      id: season.id,
      number: season.number,
      name: season.name,
      tagline: season.tagline,
      description: season.description,
      theme: season.theme,
      status: season.status,
      startDate: season.startDate,
      endDate: season.endDate,
      speedMultiplier: season.speedMultiplier,
      maxTier: season.maxTier,
    },
    pass: {
      xp: state.xp,
      currentTier: state.currentTier,
      xpForNextTier: state.xpForNextTier,
      completionRatio: state.completionRatio,
      claimedFree: state.claimedFree,
      claimedPremium: state.claimedPremium,
      premiumUnlocked: state.premiumUnlocked,
    },
    tokens: {
      balance: state.galacticTokens,
      totalEarned: state.totalTokensEarned,
      totalSpent: state.totalTokensSpent,
    },
    missions: {
      daily: state.dailyMissionState,
      weekly: state.weeklyMissionState,
      seasonal: state.seasonalMissionState,
    },
    techTree: season.techTree.map(t => ({
      ...t,
      researched: !!state.techProgress[t.id],
    })),
    events: season.events,
    cosmetics: state.cosmetics,
    titles: state.titles,
    prestigeLevel: state.prestigeLevel,
    championshipPoints: state.championshipPoints,
    completedMissions: state.completedMissions,
    loginStreak: state.loginStreak,
  };
}

export function getSeasonLeaderboard(seasonId: string, category: string) {
  const season = SEASON_DEFINITIONS.find(s => s.id === seasonId);
  if (!season) return [];

  const rankings = season.rankings.individual.find(r => r.category === category);
  if (!rankings) return [];

  return rankings.thresholds;
}

export function getSeasonAllianceProjects(seasonId: string) {
  const season = SEASON_DEFINITIONS.find(s => s.id === seasonId);
  if (!season) return [];
  return season.alliances.projects;
}

export function getSeasonAllianceBuffs(seasonId: string) {
  const season = SEASON_DEFINITIONS.find(s => s.id === seasonId);
  if (!season) return [];
  return season.alliances.seasonalBuffs;
}

export function refreshDailyMissions(userId: string, seasonId: string): { success: boolean; message: string } {
  const state = getOrCreateSeasonState(userId, seasonId);
  const season = SEASON_DEFINITIONS.find(s => s.id === seasonId);
  if (!season) return { success: false, message: "Season not found" };

  if (state.dailyMissionState.refreshCount >= state.dailyMissionState.maxRefreshes) {
    return { success: false, message: "No refreshes remaining" };
  }

  state.dailyMissionState = getDefaultDailyMissions(season);
  state.dailyMissionState.refreshCount++;
  return { success: true, message: "Daily missions refreshed" };
}
