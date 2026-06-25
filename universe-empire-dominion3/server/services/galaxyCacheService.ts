import { db } from "../db";
import { galaxyCache, ogamePositions, ogameSystems, users, playerStates } from "../../shared/schema";
import { eq, and, inArray, lt } from "drizzle-orm";
import { OGameGalaxyService, type OGamePositionData } from "./ogameGalaxyService";
import { galaxyActivityService } from "./galaxyActivityService";

const CACHE_TTL_MINUTES = 5;

export interface CachedPositionEntry {
  type: "planet" | "debris" | "moon" | "empty";
  player?: string;
  ally?: string;
  activity?: 0 | 1;
  metal?: number;
  crystal?: number;
}

export interface GalaxyCacheData {
  galaxy: number;
  system: number;
  systemName: string;
  starType: string;
  starName: string;
  positions: CachedPositionEntry[];
  generatedAt: string;
}

export class GalaxyCacheService {
  /**
   * Build a galaxy view for a given (galaxy, system).
   * Uses DB cache when available and fresh.
   */
  async getGalaxyView(galaxy: number, system: number): Promise<GalaxyCacheData> {
    // Try cache first
    const cached = await this.getFromCache(galaxy, system);
    if (cached) return cached;

    // Build fresh view
    const view = await this.buildGalaxyView(galaxy, system);
    await this.storeCache(galaxy, system, view);
    return view;
  }

  /**
   * Invalidate cache for a specific system (e.g., after battle, fleet movement).
   */
  async invalidateCache(galaxy: number, system: number): Promise<void> {
    await db.delete(galaxyCache)
      .where(and(
        eq(galaxyCache.galaxy, galaxy),
        eq(galaxyCache.system, system),
      ));
  }

  /**
   * Invalidate all stale cache entries (e.g., on a cron job).
   */
  async pruneStaleCache(): Promise<number> {
    const result = await db.delete(galaxyCache)
      .where(lt(galaxyCache.updatedAt, new Date(Date.now() - CACHE_TTL_MINUTES * 60 * 1000)));
    return 0;
  }

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  private async getFromCache(galaxy: number, system: number): Promise<GalaxyCacheData | null> {
    const rows = await db
      .select()
      .from(galaxyCache)
      .where(and(
        eq(galaxyCache.galaxy, galaxy),
        eq(galaxyCache.system, system),
      ))
      .limit(1);

    if (rows.length === 0) return null;

    const row = rows[0];
    const age = Date.now() - (row.updatedAt?.getTime() || 0);
    if (age > CACHE_TTL_MINUTES * 60 * 1000) {
      await this.invalidateCache(galaxy, system);
      return null;
    }

    return row.cacheJson as unknown as GalaxyCacheData;
  }

  private async storeCache(galaxy: number, system: number, data: GalaxyCacheData): Promise<void> {
    await db.insert(galaxyCache).values({
      galaxy,
      system,
      cacheJson: JSON.parse(JSON.stringify(data)),
      updatedAt: new Date(),
    }).onConflictDoNothing();
  }

  private async buildGalaxyView(galaxy: number, system: number): Promise<GalaxyCacheData> {
    // Load system from DB or generate
    const sysRows = await db
      .select()
      .from(ogameSystems)
      .where(and(
        eq(ogameSystems.galaxyNumber, galaxy),
        eq(ogameSystems.systemNumber, system),
      ))
      .limit(1);

    let systemName: string;
    let starType: string;
    let starName: string;
    let positions: OGamePositionData[];

    if (sysRows.length > 0) {
      const sysRow = sysRows[0];
      systemName = sysRow.name;
      starType = sysRow.starType;
      starName = sysRow.starName;

      const posRows = await db
        .select()
        .from(ogamePositions)
        .where(eq(ogamePositions.systemId, sysRow.id))
        .orderBy(ogamePositions.position);

      positions = posRows.map(p => ({
        position: p.position,
        celestialType: (p.celestialType || "planet") as any,
        planetName: p.planetName || "",
        planetType: p.planetType || "",
        planetClass: p.planetClass || "",
        planetDiameter: p.planetDiameter || 0,
        planetTemperature: p.planetTemperature || 0,
        playerName: p.playerName || "",
        playerRank: p.playerRank || 0,
        allianceTag: p.allianceTag || "",
        allianceName: p.allianceName || "",
        status: p.status || "active",
        moonExists: p.moonExists || false,
        moonName: p.moonName || "",
        moonSize: p.moonSize || 0,
        debrisMetal: p.debrisMetal || 0,
        debrisCrystal: p.debrisCrystal || 0,
      }));
    } else {
      const generated = OGameGalaxyService.generateSystemFromHash(galaxy, system);
      systemName = generated.systemName;
      starType = generated.starType;
      starName = generated.starName;
      positions = generated.positions;
    }

    // Get recent activity
    const activitySummary = await galaxyActivityService.getActivitySummary(galaxy, system);

    // Convert to cache format
    const cachePositions: CachedPositionEntry[] = [];

    for (const pos of positions) {
      const hasActivity = activitySummary.has(pos.position);

      if (pos.celestialType === "planet" && pos.playerName) {
        cachePositions.push({
          type: "planet",
          player: pos.playerName,
          ally: pos.allianceTag || undefined,
          activity: hasActivity ? 1 : 0,
        });
      } else if (pos.debrisMetal > 0 || pos.debrisCrystal > 0) {
        cachePositions.push({
          type: "debris",
          metal: pos.debrisMetal,
          crystal: pos.debrisCrystal,
          activity: hasActivity ? 1 : 0,
        });
      } else if (pos.moonExists && pos.playerName) {
        cachePositions.push({
          type: "moon",
          player: pos.playerName,
          activity: 0,
        });
      } else {
        cachePositions.push({
          type: "empty",
          activity: hasActivity ? 1 : 0,
        });
      }
    }

    return {
      galaxy,
      system,
      systemName,
      starType,
      starName,
      positions: cachePositions,
      generatedAt: new Date().toISOString(),
    };
  }
}

export const galaxyCacheService = new GalaxyCacheService();
