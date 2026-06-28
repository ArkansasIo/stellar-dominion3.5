import { db } from "../db";
import { playerStates } from "../../shared/schema";
import { eq } from "drizzle-orm";

class ResourceService {
  public async getResources(userId: string) {
    const playerState = await db.query.playerStates.findFirst({
      where: eq(playerStates.userId, userId),
    });

    if (!playerState) {
      return { metal: 0, crystal: 0, deuterium: 0, energy: 0 };
    }

    const resources = (playerState.resources as any) || {};
    return {
      metal: resources.metal || 0,
      crystal: resources.crystal || 0,
      deuterium: resources.deuterium || 0,
      energy: resources.energy || 0,
    };
  }

  public async updateResources(userId: string, updates: Record<string, number>) {
    const playerState = await db.query.playerStates.findFirst({
      where: eq(playerStates.userId, userId),
    });

    if (!playerState) return null;

    const current = (playerState.resources as any) || {};
    const newResources = { ...current, ...updates };

    await db
      .update(playerStates)
      .set({ resources: newResources, updatedAt: new Date() })
      .where(eq(playerStates.userId, userId));

    return newResources;
  }
}

export const resourceService = new ResourceService();
