import { db } from "../db";
import { eq } from "drizzle-orm";
import { playerStates } from "../../shared/schema";

export class PushProtectionService {
  static POINTS_RATIO_THRESHOLD = 3;

  static calculatePoints(state: any): number {
    const buildings = state.buildings ?? {};
    const research = state.research ?? {};
    const units = state.units ?? {};
    const resources = state.resources ?? {};
    const defenses = state.defense ?? {};

    let points = 0;
    for (const val of Object.values(buildings)) points += (val as number);
    for (const val of Object.values(research)) points += (val as number) * 2;
    for (const [type, count] of Object.entries(units)) {
      const costMap: Record<string, number> = {
        smallCargo: 2000 + 2000, largeCargo: 6000 + 6000,
        lightFighter: 3000 + 1000, heavyFighter: 6000 + 4000,
        cruiser: 20000 + 7000, battleship: 45000 + 15000,
        battlecruiser: 30000 + 40000, bomber: 50000 + 25000,
        destroyer: 60000 + 50000, deathstar: 5000000 + 4000000,
        recycler: 10000 + 6000, colonyShip: 10000 + 20000,
        espionageProbe: 0 + 1000, solarSatellite: 0 + 2000,
        pathfinder: 8000 + 15000,
      };
      const shipCost = costMap[type] ?? 1000;
      points += ((count as number) * shipCost) / 1000;
    }
    for (const [type, count] of Object.entries(defenses)) {
      points += ((count as number) * 2000) / 1000;
    }
    points += ((resources.metal ?? 0) + (resources.crystal ?? 0) + (resources.deuterium ?? 0)) / 1000;
    return Math.floor(points);
  }

  static async checkTransfer(senderId: string, recipientId: string, resources: { metal: number; crystal: number; deuterium: number }): Promise<{
    allowed: boolean;
    error?: string;
  }> {
    const [senderState] = await db.select().from(playerStates).where(eq(playerStates.userId, senderId)).limit(1);
    const [recipientState] = await db.select().from(playerStates).where(eq(playerStates.userId, recipientId)).limit(1);

    if (!senderState || !recipientState) {
      return { allowed: false, error: "Player state not found" };
    }

    const senderPoints = this.calculatePoints(senderState);
    const recipientPoints = this.calculatePoints(recipientState);

    if (senderPoints <= 0) return { allowed: true };

    const ratio = recipientPoints > 0 ? senderPoints / recipientPoints : Infinity;

    if (ratio >= this.POINTS_RATIO_THRESHOLD) {
      const maxTransfer = Math.floor(senderPoints * 10);
      const totalTransfer = (resources.metal ?? 0) + (resources.crystal ?? 0) + (resources.deuterium ?? 0);

      if (totalTransfer > maxTransfer) {
        return {
          allowed: false,
          error: `Push protection: cannot transfer ${totalTransfer.toLocaleString()} resources to a much weaker player. Maximum allowed: ${maxTransfer.toLocaleString()} (sender points: ${senderPoints}, recipient points: ${recipientPoints}, ratio: ${ratio.toFixed(1)}x)`,
        };
      }
    }

    return { allowed: true };
  }
}
