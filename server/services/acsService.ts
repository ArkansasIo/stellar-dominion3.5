import { db } from "../db";
import { playerStates, missions, users, alliances, allianceMembers, battles } from "../../shared/schema";
import { eq, and, sql, inArray } from "drizzle-orm";

interface ACSFleet {
  userId: string;
  username: string;
  units: Record<string, number>;
  joinedAt: Date;
}

interface ACSGroup {
  id: string;
  ownerId: string;
  targetCoordinates: string;
  targetType: "planet" | "moon" | "debris";
  missionType: "attack" | "transport" | "defense";
  fleets: ACSFleet[];
  status: "forming" | "in_transit" | "arrived" | "completed" | "cancelled";
  departureTime: Date | null;
  arrivalTime: Date | null;
  createdAt: Date;
}

const ACS_GROUPS_KEY = "acs_groups_data";
const acsGroups: Map<string, ACSGroup> = new Map();

class ACSService {
  private async persistGroups(): Promise<void> {
    try {
      const data = Array.from(acsGroups.entries()).map(([id, group]) => ({ id, group }));
      const { storage } = await import("../storage");
      await storage.setSetting(ACS_GROUPS_KEY, data, "ACS groups persistence", "game-state");
    } catch {}
  }

  private async loadGroups(): Promise<void> {
    try {
      const { storage } = await import("../storage");
      const saved = await storage.getSetting(ACS_GROUPS_KEY);
      if (saved?.value && Array.isArray(saved.value)) {
        for (const entry of saved.value) {
          if (entry?.id && entry?.group) {
            acsGroups.set(entry.id, {
              ...entry.group,
              departureTime: entry.group.departureTime ? new Date(entry.group.departureTime) : null,
              arrivalTime: entry.group.arrivalTime ? new Date(entry.group.arrivalTime) : null,
              createdAt: new Date(entry.group.createdAt),
              fleets: entry.group.fleets?.map((f: any) => ({ ...f, joinedAt: new Date(f.joinedAt) })) || [],
            });
          }
        }
      }
    } catch {}
  }

  async createGroup(
    ownerId: string,
    targetCoordinates: string,
    targetType: "planet" | "moon" | "debris",
    missionType: "attack" | "transport" | "defense"
  ): Promise<ACSGroup> {
    const id = `acs_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const group: ACSGroup = {
      id,
      ownerId,
      targetCoordinates,
      targetType,
      missionType,
      fleets: [],
      status: "forming",
      departureTime: null,
      arrivalTime: null,
      createdAt: new Date(),
    };
    acsGroups.set(id, group);
    await this.persistGroups();
    return group;
  }

  getGroup(groupId: string): ACSGroup | undefined {
    return acsGroups.get(groupId);
  }

  async joinGroup(groupId: string, userId: string, username: string, units: Record<string, number>): Promise<ACSGroup> {
    const group = acsGroups.get(groupId);
    if (!group) throw new Error("ACS group not found");
    if (group.status !== "forming") throw new Error("ACS group is no longer accepting fleets");
    if (group.fleets.some((f) => f.userId === userId)) throw new Error("You already joined this ACS group");

    // Verify player owns the units
    const [state] = await db
      .select({ units: playerStates.units })
      .from(playerStates)
      .where(eq(playerStates.userId, userId))
      .limit(1);
    if (!state) throw new Error("Player state not found");

    const playerUnits = (state.units as Record<string, number>) || {};
    for (const [unitType, count] of Object.entries(units)) {
      if ((playerUnits[unitType] || 0) < count) {
        throw new Error(`Not enough ${unitType}. Available: ${playerUnits[unitType] || 0}, required: ${count}`);
      }
    }

    // Deduct units from player
    for (const [unitType, count] of Object.entries(units)) {
      playerUnits[unitType] = (playerUnits[unitType] || 0) - count;
    }
    await db
      .update(playerStates)
      .set({ units: playerUnits as any, updatedAt: new Date() })
      .where(eq(playerStates.userId, userId));

    group.fleets.push({ userId, username, units, joinedAt: new Date() });
    await this.persistGroups();
    return group;
  }

  async leaveGroup(groupId: string, userId: string): Promise<ACSGroup> {
    const group = acsGroups.get(groupId);
    if (!group) throw new Error("ACS group not found");
    if (group.ownerId === userId) throw new Error("Use cancel to disband your group");

    const fleet = group.fleets.find((f) => f.userId === userId);
    if (fleet) {
      // Return units to player
      const [state] = await db
        .select({ units: playerStates.units })
        .from(playerStates)
        .where(eq(playerStates.userId, userId))
        .limit(1);
      if (state) {
        const playerUnits = (state.units as Record<string, number>) || {};
        for (const [unitType, count] of Object.entries(fleet.units)) {
          playerUnits[unitType] = (playerUnits[unitType] || 0) + count;
        }
        await db
          .update(playerStates)
          .set({ units: playerUnits as any, updatedAt: new Date() })
          .where(eq(playerStates.userId, userId));
      }
    }

    group.fleets = group.fleets.filter((f) => f.userId !== userId);
    await this.persistGroups();
    return group;
  }

  async cancelGroup(groupId: string, userId: string): Promise<boolean> {
    const group = acsGroups.get(groupId);
    if (!group) throw new Error("ACS group not found");
    if (group.ownerId !== userId) throw new Error("Only the group owner can cancel");

    // Return units to all participants
    for (const fleet of group.fleets) {
      const [state] = await db
        .select({ units: playerStates.units })
        .from(playerStates)
        .where(eq(playerStates.userId, fleet.userId))
        .limit(1);
      if (state) {
        const playerUnits = (state.units as Record<string, number>) || {};
        for (const [unitType, count] of Object.entries(fleet.units)) {
          playerUnits[unitType] = (playerUnits[unitType] || 0) + count;
        }
        await db
          .update(playerStates)
          .set({ units: playerUnits as any, updatedAt: new Date() })
          .where(eq(playerStates.userId, fleet.userId));
      }
    }

    acsGroups.delete(groupId);
    await this.persistGroups();
    return true;
  }

  async launchGroup(groupId: string, userId: string): Promise<ACSGroup> {
    const group = acsGroups.get(groupId);
    if (!group) throw new Error("ACS group not found");
    if (group.ownerId !== userId) throw new Error("Only the group owner can launch");
    if (group.fleets.length === 0) throw new Error("No fleets in group");

    const now = new Date();
    const travelTimeMs = 5 * 60 * 1000;
    group.departureTime = now;
    group.arrivalTime = new Date(now.getTime() + travelTimeMs);
    group.status = "in_transit";

    for (const fleet of group.fleets) {
      const missionId = `acs_${groupId}_${fleet.userId}`;
      try {
        await db.insert(missions).values({
          id: missionId,
          userId: fleet.userId,
          type: "acs_" + group.missionType,
          status: "outbound",
          target: group.targetCoordinates,
          origin: group.targetCoordinates,
          units: fleet.units,
          departureTime: now,
          arrivalTime: group.arrivalTime,
          returnTime: new Date(now.getTime() + travelTimeMs * 2),
          processed: false,
        });
      } catch {}
    }

    await this.persistGroups();
    return group;
  }

  async getPlayerACSGroups(userId: string): Promise<ACSGroup[]> {
    return Array.from(acsGroups.values()).filter(
      (g) => g.ownerId === userId || g.fleets.some((f) => f.userId === userId)
    );
  }

  async getAllianceACSGroups(allianceId: string): Promise<ACSGroup[]> {
    const members = await db
      .select({ userId: allianceMembers.userId })
      .from(allianceMembers)
      .where(eq(allianceMembers.allianceId, allianceId));

    const memberIds = new Set(members.map((m) => m.userId));
    return Array.from(acsGroups.values()).filter(
      (g) => memberIds.has(g.ownerId) || g.fleets.some((f) => memberIds.has(f.userId))
    );
  }

  async resolveACSCombat(groupId: string, defenderUnits: Record<string, number>): Promise<any> {
    const group = acsGroups.get(groupId);
    if (!group) throw new Error("ACS group not found");

    const combinedAttackerUnits: Record<string, number> = {};
    for (const fleet of group.fleets) {
      for (const [unitType, count] of Object.entries(fleet.units)) {
        combinedAttackerUnits[unitType] = (combinedAttackerUnits[unitType] || 0) + count;
      }
    }

    group.status = "completed";

    // Return surviving units (simplified: 70% survival)
    for (const fleet of group.fleets) {
      const [state] = await db
        .select({ units: playerStates.units })
        .from(playerStates)
        .where(eq(playerStates.userId, fleet.userId))
        .limit(1);
      if (state) {
        const playerUnits = (state.units as Record<string, number>) || {};
        for (const [unitType, count] of Object.entries(fleet.units)) {
          playerUnits[unitType] = (playerUnits[unitType] || 0) + Math.floor(count * 0.7);
        }
        await db
          .update(playerStates)
          .set({ units: playerUnits as any, updatedAt: new Date() })
          .where(eq(playerStates.userId, fleet.userId));
      }
    }

    await this.persistGroups();

    return {
      groupId,
      attackers: group.fleets.length,
      combinedUnits: combinedAttackerUnits,
      defenderUnits,
    };
  }

  cleanupExpiredGroups(): void {
    const now = Date.now();
    const maxAge = 30 * 60 * 1000;
    for (const [id, group] of acsGroups.entries()) {
      if (group.status === "forming" && now - group.createdAt.getTime() > maxAge) {
        acsGroups.delete(id);
      }
    }
  }
}

export const acsService = new ACSService();

setInterval(() => acsService.cleanupExpiredGroups(), 60 * 1000);
(acsService as any).loadGroups().catch(() => {});
