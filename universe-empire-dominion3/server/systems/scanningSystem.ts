import { COMBAT_CONFIG } from "../../shared/config/xenoberage/combatConfig";
import { FEATURE_FLAGS_CONFIG } from "../../shared/config/xenoberage/featureFlagsConfig";
import { db } from "../db";
import { playerStates } from "../../shared/schema";
import { eq, desc } from "drizzle-orm";

export interface ScanResult {
  sectorId: string;
  planets: Array<{ id: string; name: string; owner: string; level: number }>;
  ports: Array<{ id: string; type: string; owner: string }>;
  ships: Array<{ id: string; name: string; owner: string; hull: number }>;
  fighters: number;
  mines: number;
  errorOccurred: boolean;
  errorMessage?: string;
}

/**
 * Scan a sector for contents.
 * Returns scan results based on scan type.
 */
export async function scanSector(
  userId: string,
  sectorId: string,
  scanType: "basic" | "full" | "detailed"
): Promise<ScanResult> {
  const baseResult: ScanResult = {
    sectorId,
    planets: [],
    ports: [],
    ships: [],
    fighters: 0,
    mines: 0,
    errorOccurred: false,
  };

  // Query sector data from database based on scan type
  const allPlayers = await db
    .select({ userId: playerStates.userId, resources: playerStates.resources, units: playerStates.units, buildings: playerStates.buildings })
    .from(playerStates)
    .limit(50);

  for (const player of allPlayers) {
    const units = (player.units as any) || {};
    const resources = (player.resources as any) || {};
    const buildings = (player.buildings as any) || {};

    baseResult.ships.push({
      id: player.userId,
      name: `${player.userId}'s fleet`,
      owner: player.userId,
      hull: Object.values(units).reduce((sum: number, count: any) => sum + (typeof count === "number" ? count : 0), 0),
    });

    if (scanType === "full" || scanType === "detailed") {
      baseResult.fighters += units.fighters || 0;
      baseResult.mines += units.mines || 0;
    }

    if (Object.keys(buildings).length > 0) {
      baseResult.planets.push({
        id: player.userId,
        name: `Planet of ${player.userId}`,
        owner: player.userId,
        level: Object.values(buildings).reduce((sum: number, level: any) => sum + (typeof level === "number" ? level : 0), 0),
      });
    }
  }

  return baseResult;
}

/**
 * Calculate scan error probability based on cloak vs sensor levels.
 * errorChance = (cloakLevel - sensorLevel + scanErrorFactor) / 100
 * Returns true if error occurs (roll > success threshold).
 */
export function calculateScanError(
  cloakLevel: number,
  sensorLevel: number,
  errorFactor: number = COMBAT_CONFIG.scanErrorFactor
): { errorChance: number; errorOccurred: boolean } {
  const errorChance = Math.max(0, (cloakLevel - sensorLevel + errorFactor)) / 100;
  const roll = Math.random();
  return {
    errorChance,
    errorOccurred: roll < errorChance,
  };
}

/**
 * Perform a full long range scan.
 * Costs turns and shows entire sector contents.
 */
export async function fullScan(
  userId: string,
  sectorId: string,
  cost: number = COMBAT_CONFIG.fullscanCost
): Promise<{ success: boolean; result?: ScanResult; turnsDeducted: number }> {
  if (!FEATURE_FLAGS_CONFIG.allowFullscan) {
    return { success: false, turnsDeducted: 0 };
  }

  const playerState = await db.query.playerStates.findFirst({
    where: eq(playerStates.userId, userId),
  });

  if (!playerState) {
    return { success: false, turnsDeducted: 0 };
  }

  const turnsData = (playerState.turnsData as any) || {};
  const availableTurns = turnsData.availableTurns || playerState.currentTurns || 0;

  if (availableTurns < cost) {
    return { success: false, turnsDeducted: 0 };
  }

  const updatedTurns = availableTurns - cost;
  await db.update(playerStates).set({
    turnsData: { ...turnsData, availableTurns: updatedTurns },
    currentTurns: updatedTurns,
    updatedAt: new Date(),
  }).where(eq(playerStates.userId, userId));

  const result = await scanSector(userId, sectorId, "full");
  return { success: true, result, turnsDeducted: cost };
}

/**
 * Calculate scan range based on sensor level.
 * range = sensorLevel * 2
 */
export function calculateScanRange(sensorLevel: number): number {
  return sensorLevel * 2;
}

/**
 * Get scan results with error processing applied.
 * If error occurred, returns partial/incorrect data.
 */
export function getScanResults(
  scanData: ScanResult,
  errorRoll: number
): ScanResult {
  if (errorRoll < 0.5) {
    // Simulate error: randomize some data
    return {
      ...scanData,
      errorOccurred: true,
      errorMessage: "Scan interference detected - results may be inaccurate",
      fighters: Math.floor(scanData.fighters * (0.5 + Math.random())),
      mines: Math.floor(scanData.mines * (0.5 + Math.random())),
    };
  }
  return scanData;
}
