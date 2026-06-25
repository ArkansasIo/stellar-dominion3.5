import { db } from "../db";
import { espionageReports } from "../../shared/schema";
import { eq, and, desc, lt } from "drizzle-orm";

export interface EspionageReportData {
  id: number;
  attackerId: string;
  targetId: string;
  galaxy: number;
  system: number;
  position: number;
  report: {
    resources?: { metal: number; crystal: number; deuterium: number };
    buildings?: Record<string, number>;
    research?: Record<string, number>;
    fleet?: Record<string, number>;
    defense?: Record<string, number>;
    timestamp: number;
  };
  createdAt: string;
}

export class EspionageReportService {
  /**
   * Create a new espionage report.
   */
  async createReport(data: {
    attackerId: string;
    targetId: string;
    galaxy: number;
    system: number;
    position: number;
    reportJson: any;
  }): Promise<void> {
    await db.insert(espionageReports).values({
      attackerId: data.attackerId,
      targetId: data.targetId,
      galaxy: data.galaxy,
      system: data.system,
      position: data.position,
      activityType: 3,
      reportJson: data.reportJson,
      createdAt: new Date(),
    });
  }

  /**
   * Get reports sent by a player (attacker view).
   */
  async getAttackerReports(
    attackerId: string,
    limit: number = 50,
    offset: number = 0,
  ): Promise<EspionageReportData[]> {
    const rows = await db
      .select()
      .from(espionageReports)
      .where(eq(espionageReports.attackerId, attackerId))
      .orderBy(desc(espionageReports.createdAt))
      .limit(limit)
      .offset(offset);

    return rows.map(r => ({
      id: r.id,
      attackerId: r.attackerId || "",
      targetId: r.targetId || "",
      galaxy: r.galaxy,
      system: r.system,
      position: r.position,
      report: r.reportJson as any,
      createdAt: r.createdAt?.toISOString() || "",
    }));
  }

  /**
   * Get reports received by a player (defender view, could be hacked/intercepted).
   */
  async getTargetReports(
    targetId: string,
    limit: number = 50,
    offset: number = 0,
  ): Promise<EspionageReportData[]> {
    const rows = await db
      .select()
      .from(espionageReports)
      .where(eq(espionageReports.targetId, targetId))
      .orderBy(desc(espionageReports.createdAt))
      .limit(limit)
      .offset(offset);

    return rows.map(r => ({
      id: r.id,
      attackerId: r.attackerId || "",
      targetId: r.targetId || "",
      galaxy: r.galaxy,
      system: r.system,
      position: r.position,
      report: r.reportJson as any,
      createdAt: r.createdAt?.toISOString() || "",
    }));
  }

  /**
   * Get a specific report by ID.
   */
  async getReportById(reportId: number): Promise<EspionageReportData | null> {
    const rows = await db
      .select()
      .from(espionageReports)
      .where(eq(espionageReports.id, reportId))
      .limit(1);

    if (rows.length === 0) return null;

    const r = rows[0];
    return {
      id: r.id,
      attackerId: r.attackerId || "",
      targetId: r.targetId || "",
      galaxy: r.galaxy,
      system: r.system,
      position: r.position,
      report: r.reportJson as any,
      createdAt: r.createdAt?.toISOString() || "",
    };
  }

  /**
   * Get the latest report for a specific target coordinate.
   */
  async getLatestReportForTarget(
    targetId: string,
    galaxy: number,
    system: number,
    position: number,
  ): Promise<EspionageReportData | null> {
    const rows = await db
      .select()
      .from(espionageReports)
      .where(and(
        eq(espionageReports.targetId, targetId),
        eq(espionageReports.galaxy, galaxy),
        eq(espionageReports.system, system),
        eq(espionageReports.position, position),
      ))
      .orderBy(desc(espionageReports.createdAt))
      .limit(1);

    if (rows.length === 0) return null;

    const r = rows[0];
    return {
      id: r.id,
      attackerId: r.attackerId || "",
      targetId: r.targetId || "",
      galaxy: r.galaxy,
      system: r.system,
      position: r.position,
      report: r.reportJson as any,
      createdAt: r.createdAt?.toISOString() || "",
    };
  }

  /**
   * Delete old reports (cleanup).
   */
  async pruneOldReports(daysOld: number = 30): Promise<void> {
    const cutoff = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000);
    await db.delete(espionageReports)
      .where(lt(espionageReports.createdAt, cutoff));
  }
}

export const espionageReportService = new EspionageReportService();
