import { db } from "../db";
import { playerStates } from "../../shared/schema";
import { eq } from "drizzle-orm";

class TechnologyService {
  public async getTechnologyTree(userId: string) {
    const playerState = await db.query.playerStates.findFirst({
      where: eq(playerStates.userId, userId),
    });

    if (!playerState) {
      return {};
    }

    return (playerState.research as any) || {};
  }

  public async updateTechnology(userId: string, techUpdates: Record<string, number>) {
    const playerState = await db.query.playerStates.findFirst({
      where: eq(playerStates.userId, userId),
    });

    if (!playerState) return null;

    const current = (playerState.research as any) || {};
    const newResearch = { ...current, ...techUpdates };

    await db
      .update(playerStates)
      .set({ research: newResearch, updatedAt: new Date() })
      .where(eq(playerStates.userId, userId));

    return newResearch;
  }

  public async getTechLevel(userId: string): Promise<number> {
    const tech = await this.getTechnologyTree(userId);
    return Object.values(tech).reduce((sum: number, level: any) => sum + (typeof level === "number" ? level : 0), 0);
  }
}

export const technologyService = new TechnologyService();
