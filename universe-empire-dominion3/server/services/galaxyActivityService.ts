import { db } from "../db";
import { galaxyActivity, users, playerStates } from "../../shared/schema";
import { eq, and, sql, inArray, lt, gte } from "drizzle-orm";

export type ActivityType = 1 | 2 | 3 | 4;

export const ACTIVITY_TYPES = {
  LOGIN: 1,
  FLEET: 2,
  ESPIONAGE: 3,
  COMBAT: 4,
} as const;

export interface PositionActivity {
  position: number;
  userId: string;
  activityType: ActivityType;
  createdAt: Date;
}

export class GalaxyActivityService {
  /**
   * Record a new activity at a galaxy coordinate.
   */
  async recordActivity(
    userId: string,
    galaxy: number,
    system: number,
    position: number,
    activityType: ActivityType,
  ): Promise<void> {
    await db.insert(galaxyActivity).values({
      userId,
      galaxy,
      system,
      position,
      activityType,
      createdAt: new Date(),
    });

    // Keep only recent activity (last 24h) for performance
    await db.delete(galaxyActivity)
      .where(lt(galaxyActivity.createdAt, sql`NOW() - INTERVAL '24 hours'`));
  }

  /**
   * Get all recent activity (last 15 min) for a given system.
   * This powers the "red dots" on the galaxy map.
   */
  async getSystemActivity(
    galaxy: number,
    system: number,
    sinceMinutes: number = 15,
  ): Promise<Map<number, PositionActivity[]>> {
    const since = sql`NOW() - INTERVAL '${sql.raw(String(sinceMinutes))} minutes'`;

    const rows = await db
      .select()
      .from(galaxyActivity)
      .where(and(
        eq(galaxyActivity.galaxy, galaxy),
        eq(galaxyActivity.system, system),
        gte(galaxyActivity.createdAt, since),
      ))
      .orderBy(galaxyActivity.createdAt);

    const grouped = new Map<number, PositionActivity[]>();
    for (const row of rows) {
      const existing = grouped.get(row.position) || [];
      existing.push({
        position: row.position,
        userId: row.userId || "",
        activityType: row.activityType as ActivityType,
        createdAt: row.createdAt!,
      });
      grouped.set(row.position, existing);
    }

    return grouped;
  }

  /**
   * Get a summary map of which positions have recent activity.
   * Returns a Set of position numbers with any activity.
   */
  async getActivitySummary(
    galaxy: number,
    system: number,
    sinceMinutes: number = 15,
  ): Promise<Set<number>> {
    const activity = await this.getSystemActivity(galaxy, system, sinceMinutes);
    return new Set(activity.keys());
  }

  /**
   * Get user-friendly status for a position based on activity.
   */
  getPositionStatus(
    activity: PositionActivity[] | undefined,
    isInactive: boolean,
    isVacation: boolean,
  ): "active" | "inactive" | "vacation" {
    if (isVacation) return "vacation";
    if (isInactive) return "inactive";
    if (activity && activity.length > 0) return "active";
    return "inactive";
  }

  /**
   * Check if there's activity at a position (for red dot display).
   */
  hasRecentActivity(
    activityMap: Map<number, PositionActivity[]>,
    position: number,
  ): boolean {
    return activityMap.has(position) && (activityMap.get(position)?.length ?? 0) > 0;
  }

  /**
   * Get activity type icons (for frontend mapping).
   */
  getActivityTypeIcon(activityType: ActivityType): string {
    switch (activityType) {
      case ACTIVITY_TYPES.LOGIN: return "user";
      case ACTIVITY_TYPES.FLEET: return "rocket";
      case ACTIVITY_TYPES.ESPIONAGE: return "eye";
      case ACTIVITY_TYPES.COMBAT: return "crosshair";
      default: return "circle";
    }
  }
}

export const galaxyActivityService = new GalaxyActivityService();
