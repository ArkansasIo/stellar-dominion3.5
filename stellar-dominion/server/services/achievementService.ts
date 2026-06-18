/**
 * Research Achievement System Service
 * Persistent implementation with profile storage.
 */

import { db } from "../db";
import { sql } from "drizzle-orm";
import {
  ACHIEVEMENT_CONFIG,
  AchievementProgress,
  PlayerAchievements,
  getAchievementById,
} from "../../shared/config/achievementSystemConfig";

const RESERVED_TIERS: Record<string, number> = {
  bronze: 100,
  silver: 250,
  gold: 500,
  platinum: 1000,
  diamond: 2000,
};

function asAchievementsMap(value: unknown): Record<string, AchievementProgress> {
  if (!value || typeof value !== "object") return {};
  return value as Record<string, AchievementProgress>;
}

function asStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.map(String) : [];
}

function nowUnixMs() {
  return Date.now();
}

function flattenAchievements() {
  const categories = [
    ACHIEVEMENT_CONFIG.RESEARCH_MILESTONES,
    ACHIEVEMENT_CONFIG.DISCOVERY_ACHIEVEMENTS,
    ACHIEVEMENT_CONFIG.SPEED_ACHIEVEMENTS,
    ACHIEVEMENT_CONFIG.SPECIALIZATION_ACHIEVEMENTS,
    ACHIEVEMENT_CONFIG.LEVEL_ACHIEVEMENTS,
    ACHIEVEMENT_CONFIG.CHALLENGE_ACHIEVEMENTS,
    ACHIEVEMENT_CONFIG.HIDDEN_ACHIEVEMENTS,
  ];

  const rows: Array<{ id: string; category: string; definition: any }> = [];
  for (const category of categories) {
    for (const [id, definition] of Object.entries(category)) {
      rows.push({ id, category: "achievement", definition });
    }
  }

  return rows;
}

export class AchievementService {
  private static tableReady = false;

  private static async ensureTable() {
    if (this.tableReady) return;

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS research_achievement_profiles (
        user_id varchar PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
        total_points integer NOT NULL DEFAULT 0,
        achievements jsonb NOT NULL DEFAULT '{}'::jsonb,
        badges jsonb NOT NULL DEFAULT '[]'::jsonb,
        tech_count integer NOT NULL DEFAULT 0,
        discovery_count integer NOT NULL DEFAULT 0,
        current_level integer NOT NULL DEFAULT 1,
        specialization_progress jsonb NOT NULL DEFAULT '{}'::jsonb,
        updated_at timestamp NOT NULL DEFAULT now()
      )
    `);

    this.tableReady = true;
  }

  private static async getOrCreateProfile(userId: string) {
    await this.ensureTable();

    await db.execute(sql`
      INSERT INTO research_achievement_profiles (user_id)
      VALUES (${userId})
      ON CONFLICT (user_id) DO NOTHING
    `);

    const rows = await db.execute(sql`
      SELECT * FROM research_achievement_profiles WHERE user_id = ${userId} LIMIT 1
    `);

    return rows.rows[0] as any;
  }

  private static async saveProfile(userId: string, updates: Record<string, unknown>) {
    await db.execute(sql`
      UPDATE research_achievement_profiles
      SET
        total_points = COALESCE(${updates.total_points as any}, total_points),
        achievements = COALESCE(${updates.achievements as any}, achievements),
        badges = COALESCE(${updates.badges as any}, badges),
        tech_count = COALESCE(${updates.tech_count as any}, tech_count),
        discovery_count = COALESCE(${updates.discovery_count as any}, discovery_count),
        current_level = COALESCE(${updates.current_level as any}, current_level),
        specialization_progress = COALESCE(${updates.specialization_progress as any}, specialization_progress),
        updated_at = now()
      WHERE user_id = ${userId}
    `);
  }

  private static toPlayerAchievements(row: any): PlayerAchievements {
    return {
      userId: String(row.user_id),
      totalPoints: Number(row.total_points ?? 0),
      achievements: asAchievementsMap(row.achievements),
      badges: asStringArray(row.badges),
    };
  }

  private static upsertProgress(
    achievements: Record<string, AchievementProgress>,
    achievementId: string,
    progress: number,
    requirement: number,
    tier: string
  ): { achievements: Record<string, AchievementProgress>; newlyUnlocked: boolean } {
    const existing = achievements[achievementId];
    const completed = progress >= requirement;

    const next: AchievementProgress = {
      achievementId,
      category: "achievement",
      progress,
      requirement,
      completed,
      unlockedAt: completed ? (existing?.unlockedAt ?? nowUnixMs()) : existing?.unlockedAt,
      tier,
    };

    const newlyUnlocked = Boolean(completed && !existing?.completed);

    return {
      achievements: {
        ...achievements,
        [achievementId]: next,
      },
      newlyUnlocked,
    };
  }

  static async initializeAchievements(userId: string): Promise<PlayerAchievements> {
    const profile = await this.getOrCreateProfile(userId);
    return this.toPlayerAchievements(profile);
  }

  static async getPlayerAchievements(userId: string): Promise<PlayerAchievements> {
    return this.initializeAchievements(userId);
  }

  static async updateResearchMilestone(userId: string, techCount: number): Promise<boolean> {
    const profile = await this.getOrCreateProfile(userId);

    let achievements = asAchievementsMap(profile.achievements);
    let badges = asStringArray(profile.badges);
    let points = Number(profile.total_points ?? 0);
    let changed = false;

    for (const [id, definition] of Object.entries(ACHIEVEMENT_CONFIG.RESEARCH_MILESTONES)) {
      const requirement = Number((definition as any).requirement ?? 0);
      const tier = String((definition as any).tier ?? "bronze");
      const result = this.upsertProgress(achievements, id, techCount, requirement, tier);
      achievements = result.achievements;

      if (result.newlyUnlocked) {
        changed = true;
        points += RESERVED_TIERS[tier] ?? 100;
        const badge = String((definition as any).reward?.badge ?? "");
        if (badge && !badges.includes(badge)) badges.push(badge);
      }
    }

    if (!changed && Number(profile.tech_count ?? 0) === techCount) {
      return false;
    }

    await this.saveProfile(userId, {
      total_points: points,
      achievements,
      badges,
      tech_count: techCount,
    });

    return true;
  }

  static async recordDiscovery(userId: string, discoveryCount: number): Promise<boolean> {
    const profile = await this.getOrCreateProfile(userId);

    let achievements = asAchievementsMap(profile.achievements);
    let badges = asStringArray(profile.badges);
    let points = Number(profile.total_points ?? 0);
    let changed = false;

    for (const [id, definition] of Object.entries(ACHIEVEMENT_CONFIG.DISCOVERY_ACHIEVEMENTS)) {
      const requirement = Number((definition as any).requirement ?? 0);
      const tier = String((definition as any).tier ?? "bronze");
      const result = this.upsertProgress(achievements, id, discoveryCount, requirement, tier);
      achievements = result.achievements;

      if (result.newlyUnlocked) {
        changed = true;
        points += RESERVED_TIERS[tier] ?? 100;
        const badge = String((definition as any).reward?.badge ?? "");
        if (badge && !badges.includes(badge)) badges.push(badge);
      }
    }

    if (!changed && Number(profile.discovery_count ?? 0) === discoveryCount) {
      return false;
    }

    await this.saveProfile(userId, {
      total_points: points,
      achievements,
      badges,
      discovery_count: discoveryCount,
    });

    return true;
  }

  static async updateLevelAchievement(userId: string, currentLevel: number): Promise<boolean> {
    const profile = await this.getOrCreateProfile(userId);

    let achievements = asAchievementsMap(profile.achievements);
    let badges = asStringArray(profile.badges);
    let points = Number(profile.total_points ?? 0);
    let changed = false;

    for (const [id, definition] of Object.entries(ACHIEVEMENT_CONFIG.LEVEL_ACHIEVEMENTS)) {
      const requirement = Number((definition as any).requirement ?? 0);
      const tier = String((definition as any).tier ?? "bronze");
      const result = this.upsertProgress(achievements, id, currentLevel, requirement, tier);
      achievements = result.achievements;

      if (result.newlyUnlocked) {
        changed = true;
        points += RESERVED_TIERS[tier] ?? 100;
        const badge = String((definition as any).reward?.badge ?? "");
        if (badge && !badges.includes(badge)) badges.push(badge);
      }
    }

    if (!changed && Number(profile.current_level ?? 1) === currentLevel) {
      return false;
    }

    await this.saveProfile(userId, {
      total_points: points,
      achievements,
      badges,
      current_level: currentLevel,
    });

    return true;
  }

  static async getAchievementDetails(achievementId: string): Promise<any> {
    return getAchievementById(achievementId);
  }

  static async getPlayerBadges(userId: string) {
    const profile = await this.getOrCreateProfile(userId);
    return asStringArray(profile.badges);
  }

  static async getAchievementStats(userId: string) {
    const profile = await this.getOrCreateProfile(userId);
    const achievements = asAchievementsMap(profile.achievements);

    const totalAchievements = flattenAchievements().length;
    const completedAchievements = Object.values(achievements).filter((a) => a.completed).length;
    const totalBadges = asStringArray(profile.badges).length;
    const totalPoints = Number(profile.total_points ?? 0);

    return {
      totalAchievements,
      completedAchievements,
      totalBadges,
      totalPoints,
      completionPercentage: totalAchievements ? Math.round((completedAchievements / totalAchievements) * 100) : 0,
    };
  }

  static async getAchievementLeaderboard(limit: number = 50) {
    await this.ensureTable();

    const rows = await db.execute(sql`
      SELECT
        rap.user_id,
        rap.total_points,
        rap.badges,
        COALESCE(u.username, rap.user_id) AS username
      FROM research_achievement_profiles rap
      LEFT JOIN users u ON u.id = rap.user_id
      ORDER BY rap.total_points DESC
      LIMIT ${Math.max(1, Math.min(200, limit))}
    `);

    return rows.rows.map((row: any, index: number) => ({
      rank: index + 1,
      userId: String(row.user_id),
      username: String(row.username),
      totalPoints: Number(row.total_points ?? 0),
      totalBadges: asStringArray(row.badges).length,
    }));
  }

  static async awardSpecificAchievement(userId: string, achievementId: string): Promise<boolean> {
    const achievement = getAchievementById(achievementId);
    if (!achievement) return false;

    const profile = await this.getOrCreateProfile(userId);
    const achievements = asAchievementsMap(profile.achievements);
    if (achievements[achievementId]?.completed) return false;

    const requirementRaw = (achievement as any).requirement;
    const requirement = typeof requirementRaw === "number" ? requirementRaw : 1;
    const tier = String((achievement as any).tier ?? "bronze");

    const result = this.upsertProgress(achievements, achievementId, requirement, requirement, tier);
    const badges = asStringArray(profile.badges);
    const badge = String((achievement as any).reward?.badge ?? "");
    if (badge && !badges.includes(badge)) badges.push(badge);

    await this.saveProfile(userId, {
      achievements: result.achievements,
      badges,
      total_points: Number(profile.total_points ?? 0) + (RESERVED_TIERS[tier] ?? 100),
    });

    return true;
  }

  static async updateSpecializationAchievement(userId: string, category: string, techCount: number): Promise<boolean> {
    const profile = await this.getOrCreateProfile(userId);

    let achievements = asAchievementsMap(profile.achievements);
    let badges = asStringArray(profile.badges);
    let points = Number(profile.total_points ?? 0);
    let changed = false;

    for (const [id, definition] of Object.entries(ACHIEVEMENT_CONFIG.SPECIALIZATION_ACHIEVEMENTS)) {
      const req = (definition as any).requirement;
      if (!req || req.category !== category) continue;

      const requirement = Number(req.count ?? 0);
      const tier = String((definition as any).tier ?? "bronze");
      const result = this.upsertProgress(achievements, id, techCount, requirement, tier);
      achievements = result.achievements;

      if (result.newlyUnlocked) {
        changed = true;
        points += RESERVED_TIERS[tier] ?? 100;
        const badge = String((definition as any).reward?.badge ?? "");
        if (badge && !badges.includes(badge)) badges.push(badge);
      }
    }

    if (!changed) return false;

    await this.saveProfile(userId, {
      total_points: points,
      achievements,
      badges,
    });

    return true;
  }
}
