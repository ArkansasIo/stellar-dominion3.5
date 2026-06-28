import type { Express, Request, Response } from "express";
import { eq, inArray } from "drizzle-orm";
import { isAuthenticated } from "./basicAuth";
import { storage } from "./storage";
import { db } from "./db";
import { users } from "../shared/schema";

type DiplomacyState = "war" | "hostile" | "neutral" | "friendly" | "allied";

type AllianceDiplomacyRelation = {
  allianceId: string;
  allianceName: string;
  allianceTag: string;
  state: DiplomacyState;
  since: string;
  updatedAt: string;
  lastAction: string;
};

type AllianceWar = {
  id: string;
  enemyAllianceId: string;
  enemyTag: string;
  enemyName: string;
  startDate: string;
  kills: number;
  deaths: number;
  status: "active" | "ended";
  updatedAt: string;
};

type AllianceOperationType = "raid" | "siege" | "expedition";

type AllianceJointOperationParticipant = {
  userId: string;
  contributionPower: number;
  joinedAt: string;
};

type AllianceJointOperation = {
  id: string;
  allianceId: string;
  targetCoordinates: string;
  missionType: AllianceOperationType;
  status: "draft" | "launched" | "completed" | "failed";
  createdBy: string;
  createdAt: string;
  launchAt?: string;
  resolveAt?: string;
  totalPower: number;
  participants: AllianceJointOperationParticipant[];
  rewardCredits?: number;
  report?: string;
};

const ALLIANCE_MEMBER_CAP = 150;
const ALLIANCE_COORDINATES_PATTERN = /^\d+:\d+:\d+$/;

function getUserId(req: Request): string {
  return (req.session as any)?.userId || "";
}

function getDiplomacyKey(allianceId: string): string {
  return `alliance_diplomacy:${allianceId}`;
}

function getWarsKey(allianceId: string): string {
  return `alliance_wars:${allianceId}`;
}

function getAllianceOperationsKey(allianceId: string): string {
  return `alliance_joint_operations:${allianceId}`;
}

function canManageAllianceOperations(rank: unknown): boolean {
  const normalizedRank = String(rank ?? "").toLowerCase();
  return normalizedRank === "leader" || normalizedRank === "officer";
}

function parseContributionPower(value: unknown, fallback: number): number | null {
  const parsedValue = Number(value ?? fallback);
  if (!Number.isFinite(parsedValue)) {
    return null;
  }

  return Math.max(100, Math.round(parsedValue));
}

async function getAllianceDiplomacy(allianceId: string): Promise<AllianceDiplomacyRelation[]> {
  const setting = await storage.getSetting(getDiplomacyKey(allianceId));
  if (!setting || !Array.isArray(setting.value)) {
    return [];
  }

  return (setting.value as AllianceDiplomacyRelation[]).filter((entry) => entry && typeof entry.allianceId === "string");
}

async function saveAllianceDiplomacy(allianceId: string, relations: AllianceDiplomacyRelation[]): Promise<void> {
  await storage.setSetting(
    getDiplomacyKey(allianceId),
    relations,
    `Diplomatic state for alliance ${allianceId}`,
    "alliance"
  );
}

async function getAllianceWars(allianceId: string): Promise<AllianceWar[]> {
  const setting = await storage.getSetting(getWarsKey(allianceId));
  if (!setting || !Array.isArray(setting.value)) {
    return [];
  }

  return (setting.value as AllianceWar[]).filter((entry) => entry && typeof entry.enemyAllianceId === "string");
}

async function saveAllianceWars(allianceId: string, wars: AllianceWar[]): Promise<void> {
  await storage.setSetting(
    getWarsKey(allianceId),
    wars,
    `War ledger for alliance ${allianceId}`,
    "alliance"
  );
}

async function getAllianceOperations(allianceId: string): Promise<AllianceJointOperation[]> {
  const setting = await storage.getSetting(getAllianceOperationsKey(allianceId));
  if (!setting || !Array.isArray(setting.value)) {
    return [];
  }

  return (setting.value as AllianceJointOperation[])
    .filter((entry) => entry && typeof entry.id === "string")
    .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime());
}

async function saveAllianceOperations(allianceId: string, operations: AllianceJointOperation[]): Promise<void> {
  await storage.setSetting(
    getAllianceOperationsKey(allianceId),
    operations,
    `Joint operations for alliance ${allianceId}`,
    "alliance"
  );
}

function upsertRelation(
  relations: AllianceDiplomacyRelation[],
  relation: AllianceDiplomacyRelation
): AllianceDiplomacyRelation[] {
  const next = relations.filter((entry) => entry.allianceId !== relation.allianceId);
  next.push(relation);
  return next.sort((left, right) => left.allianceName.localeCompare(right.allianceName));
}

function upsertWar(wars: AllianceWar[], war: AllianceWar): AllianceWar[] {
  const next = wars.filter((entry) => entry.enemyAllianceId !== war.enemyAllianceId || entry.status !== "active");
  next.unshift(war);
  return next.slice(0, 50);
}

function createRelation(
  targetAlliance: { id: string; name: string; tag: string },
  state: DiplomacyState,
  action: string,
  existingSince?: string
): AllianceDiplomacyRelation {
  const now = new Date().toISOString();
  return {
    allianceId: targetAlliance.id,
    allianceName: targetAlliance.name,
    allianceTag: targetAlliance.tag,
    state,
    since: existingSince || now,
    updatedAt: now,
    lastAction: action,
  };
}

async function requireAllianceMembership(req: Request, allianceId: string) {
  const userId = getUserId(req);
  const membership = await storage.getUserAlliance(userId);

  if (!membership || membership.alliance.id !== allianceId) {
    return { userId, membership: null };
  }

  return { userId, membership };
}

export function registerAllianceRoutes(app: Express) {
  app.get("/api/alliances", isAuthenticated, async (_req: Request, res: Response) => {
    try {
      const alliances = await storage.getAllAlliances();
      const directory = await Promise.all(
        alliances.map(async (alliance) => {
          const members = await storage.getAllianceMembers(alliance.id);
          const wars = await getAllianceWars(alliance.id);
          return {
            ...alliance,
            memberCount: members.length,
            activeWars: wars.filter((war) => war.status === "active").length,
          };
        })
      );

      res.json(directory);
    } catch (error) {
      console.error("Failed to load alliances:", error);
      res.status(500).json({ message: "Failed to load alliances" });
    }
  });

  app.get("/api/alliances/mine", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const membership = await storage.getUserAlliance(userId);

      if (!membership) {
        return res.json(null);
      }

      const members = await storage.getAllianceMembers(membership.alliance.id);
      const memberUserIds = members.map((member) => member.userId);
      const memberUsers = memberUserIds.length
        ? await db
            .select({ id: users.id, username: users.username })
            .from(users)
            .where(inArray(users.id, memberUserIds))
        : [];

      const userMap = new Map(memberUsers.map((user) => [user.id, user.username || "Commander"]));

      res.json({
        ...membership.alliance,
        member: membership.member,
        members: members.map((member) => ({
          id: member.userId,
          name: userMap.get(member.userId) || "Commander",
          rank: member.rank,
          points: member.points,
          status: "online",
        })),
      });
    } catch (error) {
      console.error("Failed to load player alliance:", error);
      res.status(500).json({ message: "Failed to load player alliance" });
    }
  });

  app.post("/api/alliances", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const name = String(req.body?.name || "").trim();
      const tag = String(req.body?.tag || "").trim().toUpperCase();
      const description = String(req.body?.description || "A new alliance rises.").trim();

      if (name.length < 3 || tag.length < 2) {
        return res.status(400).json({ message: "Alliance name and tag are required" });
      }

      const existingMembership = await storage.getUserAlliance(userId);
      if (existingMembership) {
        return res.status(409).json({ message: "Leave your current alliance first" });
      }

      const existingByTag = await storage.getAllianceByTag(tag);
      if (existingByTag) {
        return res.status(409).json({ message: "Alliance tag already exists" });
      }

      const alliance = await storage.createAlliance({
        name,
        tag,
        description,
        announcement: "Welcome to the alliance.",
        resources: { metal: 0, crystal: 0, deuterium: 0 },
      });

      await storage.addAllianceMember({
        allianceId: alliance.id,
        userId,
        rank: "leader",
        points: 0,
      });

      res.status(201).json(alliance);
    } catch (error) {
      console.error("Failed to create alliance:", error);
      res.status(500).json({ message: "Failed to create alliance" });
    }
  });

  app.post("/api/alliances/:id/join", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const allianceId = req.params.id;

      const existingMembership = await storage.getUserAlliance(userId);
      if (existingMembership) {
        return res.status(409).json({ message: "You are already in an alliance" });
      }

      const alliance = await storage.getAllianceById(allianceId);
      if (!alliance) {
        return res.status(404).json({ message: "Alliance not found" });
      }

      const members = await storage.getAllianceMembers(allianceId);
      if (members.length >= ALLIANCE_MEMBER_CAP) {
        return res.status(409).json({ message: `Alliance is at max capacity (${ALLIANCE_MEMBER_CAP} players)` });
      }

      await storage.addAllianceMember({
        allianceId,
        userId,
        rank: "recruit",
        points: 0,
      });

      res.json({ joined: true, allianceId });
    } catch (error) {
      console.error("Failed to join alliance:", error);
      res.status(500).json({ message: "Failed to join alliance" });
    }
  });

  app.post("/api/alliances/:id/leave", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const allianceId = req.params.id;

      const membership = await storage.getUserAlliance(userId);
      if (!membership || membership.alliance.id !== allianceId) {
        return res.status(404).json({ message: "Alliance membership not found" });
      }

      await storage.removeAllianceMember(allianceId, userId);
      res.json({ left: true });
    } catch (error) {
      console.error("Failed to leave alliance:", error);
      res.status(500).json({ message: "Failed to leave alliance" });
    }
  });

  app.get("/api/alliances/:id/members", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const allianceId = req.params.id;
      const members = await storage.getAllianceMembers(allianceId);
      res.json(members);
    } catch (error) {
      console.error("Failed to load alliance members:", error);
      res.status(500).json({ message: "Failed to load alliance members" });
    }
  });

  app.get("/api/alliances/:id/diplomacy", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const allianceId = req.params.id;
      const { membership } = await requireAllianceMembership(req, allianceId);

      if (!membership) {
        return res.status(403).json({ message: "Alliance membership required" });
      }

      const relations = await getAllianceDiplomacy(allianceId);
      res.json({ relations, count: relations.length });
    } catch (error) {
      console.error("Failed to load diplomacy:", error);
      res.status(500).json({ message: "Failed to load diplomacy" });
    }
  });

  app.get("/api/alliances/:id/wars", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const allianceId = req.params.id;
      const { membership } = await requireAllianceMembership(req, allianceId);

      if (!membership) {
        return res.status(403).json({ message: "Alliance membership required" });
      }

      const wars = await getAllianceWars(allianceId);
      res.json({ wars, count: wars.length });
    } catch (error) {
      console.error("Failed to load alliance wars:", error);
      res.status(500).json({ message: "Failed to load alliance wars" });
    }
  });

  app.post("/api/alliances/:id/diplomacy/actions", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const allianceId = req.params.id;
      const targetTag = String(req.body?.targetTag || "").trim().toUpperCase();
      const action = String(req.body?.action || "").trim();
      const { membership } = await requireAllianceMembership(req, allianceId);

      if (!membership) {
        return res.status(403).json({ message: "Alliance membership required" });
      }

      if (!targetTag) {
        return res.status(400).json({ message: "Target alliance tag is required" });
      }

      const sourceAlliance = await storage.getAllianceById(allianceId);
      const targetAlliance = await storage.getAllianceByTag(targetTag);

      if (!sourceAlliance) {
        return res.status(404).json({ message: "Alliance not found" });
      }

      if (!targetAlliance) {
        return res.status(404).json({ message: "Target alliance not found" });
      }

      if (targetAlliance.id === sourceAlliance.id) {
        return res.status(400).json({ message: "Cannot target your own alliance" });
      }

      const actionMap: Record<string, { state: DiplomacyState; label: string }> = {
        proposeAlliance: { state: "allied", label: "Alliance proposal sent" },
        openTalks: { state: "friendly", label: "Diplomatic talks opened" },
        issueWarning: { state: "hostile", label: "Strategic warning issued" },
        declareWar: { state: "war", label: "War declared" },
      };

      const nextAction = actionMap[action];
      if (!nextAction) {
        return res.status(400).json({ message: "Unsupported diplomatic action" });
      }

      const currentRelations = await getAllianceDiplomacy(sourceAlliance.id);
      const targetRelations = await getAllianceDiplomacy(targetAlliance.id);
      const existingRelation = currentRelations.find((entry) => entry.allianceId === targetAlliance.id);

      const sourceRelation = createRelation(
        { id: targetAlliance.id, name: targetAlliance.name, tag: targetAlliance.tag },
        nextAction.state,
        action,
        existingRelation?.since
      );
      const reciprocalRelation = createRelation(
        { id: sourceAlliance.id, name: sourceAlliance.name, tag: sourceAlliance.tag },
        nextAction.state,
        action,
        existingRelation?.since
      );

      await saveAllianceDiplomacy(sourceAlliance.id, upsertRelation(currentRelations, sourceRelation));
      await saveAllianceDiplomacy(targetAlliance.id, upsertRelation(targetRelations, reciprocalRelation));

      let war: AllianceWar | null = null;
      if (nextAction.state === "war") {
        const sourceWars = await getAllianceWars(sourceAlliance.id);
        const targetWars = await getAllianceWars(targetAlliance.id);
        const now = new Date().toISOString();

        war = {
          id: `war_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
          enemyAllianceId: targetAlliance.id,
          enemyTag: targetAlliance.tag,
          enemyName: targetAlliance.name,
          startDate: now,
          kills: 0,
          deaths: 0,
          status: "active",
          updatedAt: now,
        };

        const reciprocalWar: AllianceWar = {
          id: war.id,
          enemyAllianceId: sourceAlliance.id,
          enemyTag: sourceAlliance.tag,
          enemyName: sourceAlliance.name,
          startDate: now,
          kills: 0,
          deaths: 0,
          status: "active",
          updatedAt: now,
        };

        await saveAllianceWars(sourceAlliance.id, upsertWar(sourceWars, war));
        await saveAllianceWars(targetAlliance.id, upsertWar(targetWars, reciprocalWar));
      }

      res.json({
        success: true,
        message: nextAction.label,
        relation: sourceRelation,
        war,
      });
    } catch (error) {
      console.error("Failed to apply diplomatic action:", error);
      res.status(500).json({ message: "Failed to apply diplomatic action" });
    }
  });

  app.get("/api/alliances/:id/operations", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const allianceId = req.params.id;
      const { membership } = await requireAllianceMembership(req, allianceId);

      if (!membership) {
        return res.status(403).json({ message: "Alliance membership required" });
      }

      const operations = await getAllianceOperations(allianceId);
      res.json({ operations, count: operations.length });
    } catch (error) {
      console.error("Failed to load alliance operations:", error);
      res.status(500).json({ message: "Failed to load alliance operations" });
    }
  });

  app.post("/api/alliances/:id/operations", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const allianceId = req.params.id;
      const { userId, membership } = await requireAllianceMembership(req, allianceId);

      if (!membership) {
        return res.status(403).json({ message: "Alliance membership required" });
      }

      const targetCoordinates = String(req.body?.targetCoordinates || "").trim();
      const missionType = String(req.body?.missionType || "raid").trim().toLowerCase() as AllianceOperationType;
      const contributionPower = parseContributionPower(req.body?.contributionPower, 1000);

      if (!targetCoordinates) {
        return res.status(400).json({ message: "Target coordinates are required" });
      }

      if (!ALLIANCE_COORDINATES_PATTERN.test(targetCoordinates)) {
        return res.status(400).json({ message: "Target coordinates must use galaxy:system:position format" });
      }

      if (!["raid", "siege", "expedition"].includes(missionType)) {
        return res.status(400).json({ message: "Unsupported mission type" });
      }

      if (contributionPower === null) {
        return res.status(400).json({ message: "Contribution power must be a valid number" });
      }

      const operations = await getAllianceOperations(allianceId);
      const nowIso = new Date().toISOString();
      const operation: AllianceJointOperation = {
        id: `op_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
        allianceId,
        targetCoordinates,
        missionType,
        status: "draft",
        createdBy: userId,
        createdAt: nowIso,
        totalPower: contributionPower,
        participants: [
          {
            userId,
            contributionPower,
            joinedAt: nowIso,
          },
        ],
      };

      const nextOperations = [operation, ...operations].slice(0, 150);
      await saveAllianceOperations(allianceId, nextOperations);

      res.status(201).json({ success: true, operation });
    } catch (error) {
      console.error("Failed to create alliance operation:", error);
      res.status(500).json({ message: "Failed to create alliance operation" });
    }
  });

  app.post("/api/alliances/:id/operations/:operationId/join", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const allianceId = req.params.id;
      const operationId = req.params.operationId;
      const { userId, membership } = await requireAllianceMembership(req, allianceId);

      if (!membership) {
        return res.status(403).json({ message: "Alliance membership required" });
      }

      const parsedContributionPower = parseContributionPower(req.body?.contributionPower, 500);
      const operations = await getAllianceOperations(allianceId);
      const operation = operations.find((entry) => entry.id === operationId);

      if (parsedContributionPower === null) {
        return res.status(400).json({ message: "Contribution power must be a valid number" });
      }

      if (!operation) {
        return res.status(404).json({ message: "Operation not found" });
      }

      if (operation.status !== "draft") {
        return res.status(409).json({ message: "Operation can only be joined while in draft state" });
      }

      const participantIndex = operation.participants.findIndex((participant) => participant.userId === userId);
      if (participantIndex >= 0) {
        operation.participants[participantIndex].contributionPower += parsedContributionPower;
      } else {
        operation.participants.push({ userId, contributionPower: parsedContributionPower, joinedAt: new Date().toISOString() });
      }
      operation.totalPower = operation.participants.reduce((sum, participant) => sum + participant.contributionPower, 0);

      await saveAllianceOperations(allianceId, operations);
      res.json({ success: true, operation });
    } catch (error) {
      console.error("Failed to join alliance operation:", error);
      res.status(500).json({ message: "Failed to join alliance operation" });
    }
  });

  app.post("/api/alliances/:id/operations/:operationId/launch", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const allianceId = req.params.id;
      const operationId = req.params.operationId;
      const { membership } = await requireAllianceMembership(req, allianceId);

      if (!membership) {
        return res.status(403).json({ message: "Alliance membership required" });
      }

      if (!membership.member || !canManageAllianceOperations(membership.member.rank)) {
        return res.status(403).json({ message: "Leader or officer rank required to launch operation" });
      }

      const operations = await getAllianceOperations(allianceId);
      const operation = operations.find((entry) => entry.id === operationId);
      if (!operation) {
        return res.status(404).json({ message: "Operation not found" });
      }

      if (operation.status !== "draft") {
        return res.status(409).json({ message: "Operation is not in draft state" });
      }

      operation.status = "launched";
      operation.launchAt = new Date().toISOString();
      operation.resolveAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

      await saveAllianceOperations(allianceId, operations);
      res.json({ success: true, operation });
    } catch (error) {
      console.error("Failed to launch alliance operation:", error);
      res.status(500).json({ message: "Failed to launch alliance operation" });
    }
  });

  app.post("/api/alliances/:id/operations/:operationId/resolve", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const allianceId = req.params.id;
      const operationId = req.params.operationId;
      const { membership } = await requireAllianceMembership(req, allianceId);

      if (!membership) {
        return res.status(403).json({ message: "Alliance membership required" });
      }

      if (!membership.member || !canManageAllianceOperations(membership.member.rank)) {
        return res.status(403).json({ message: "Leader or officer rank required to resolve operation" });
      }

      const operations = await getAllianceOperations(allianceId);
      const operation = operations.find((entry) => entry.id === operationId);
      if (!operation) {
        return res.status(404).json({ message: "Operation not found" });
      }

      if (operation.status !== "launched") {
        return res.status(409).json({ message: "Only launched operations can be resolved" });
      }

      const successThreshold = operation.missionType === "siege" ? 4000 : operation.missionType === "expedition" ? 2500 : 1800;
      const outcomeRoll = operation.totalPower + Math.floor(Math.random() * 1500);
      const success = outcomeRoll >= successThreshold;

      operation.status = success ? "completed" : "failed";
      operation.rewardCredits = success ? Math.round(operation.totalPower * 0.45) : Math.round(operation.totalPower * 0.08);
      operation.report = success
        ? `Operation succeeded at ${operation.targetCoordinates}. Alliance forces secured strategic gains.`
        : `Operation failed at ${operation.targetCoordinates}. Enemy resistance outmatched deployed force.`;
      operation.resolveAt = new Date().toISOString();

      await saveAllianceOperations(allianceId, operations);
      res.json({ success: true, operation });
    } catch (error) {
      console.error("Failed to resolve alliance operation:", error);
      res.status(500).json({ message: "Failed to resolve alliance operation" });
    }
  });
}
