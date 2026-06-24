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

const acsGroups: Map<string, ACSGroup> = new Map();

class ACSService {
  createGroup(
    ownerId: string,
    targetCoordinates: string,
    targetType: "planet" | "moon" | "debris",
    missionType: "attack" | "transport" | "defense"
  ): ACSGroup {
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
    return group;
  }

  getGroup(groupId: string): ACSGroup | undefined {
    return acsGroups.get(groupId);
  }

  joinGroup(groupId: string, userId: string, username: string, units: Record<string, number>): ACSGroup {
    const group = acsGroups.get(groupId);
    if (!group) throw new Error("ACS group not found");
    if (group.status !== "forming") throw new Error("ACS group is no longer accepting fleets");
    if (group.fleets.some((f) => f.userId === userId)) throw new Error("You already joined this ACS group");

    group.fleets.push({ userId, username, units, joinedAt: new Date() });
    return group;
  }

  leaveGroup(groupId: string, userId: string): ACSGroup {
    const group = acsGroups.get(groupId);
    if (!group) throw new Error("ACS group not found");
    if (group.ownerId === userId) throw new Error("Use cancel to disband your group");
    group.fleets = group.fleets.filter((f) => f.userId !== userId);
    return group;
  }

  cancelGroup(groupId: string, userId: string): boolean {
    const group = acsGroups.get(groupId);
    if (!group) throw new Error("ACS group not found");
    if (group.ownerId !== userId) throw new Error("Only the group owner can cancel");
    acsGroups.delete(groupId);
    return true;
  }

  launchGroup(groupId: string, userId: string): ACSGroup {
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
      db.insert(missions)
        .values({
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
        })
        .then(() => {})
        .catch(() => {});
    }

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
