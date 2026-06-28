import type { Express, Request, Response } from "express";
import { and, desc, eq, sql } from "drizzle-orm";
import { isAuthenticated } from "./basicAuth";
import { db } from "./db";
import { storage } from "./storage";
import { guildMembers, guilds, users } from "../shared/schema";

type GuildChatMessage = {
  id: string;
  guildId: string;
  senderId: string;
  senderName: string;
  content: string;
  createdAt: number;
};

function getUserId(req: Request): string {
  return (req.session as any)?.userId || "";
}

async function getMembershipForUser(userId: string) {
  const [membership] = await db
    .select()
    .from(guildMembers)
    .where(eq(guildMembers.playerId, userId))
    .limit(1);

  return membership;
}

function getGuildChatKey(guildId: string): string {
  return `guild_chat:${guildId}`;
}

async function getGuildChat(guildId: string): Promise<GuildChatMessage[]> {
  const setting = await storage.getSetting(getGuildChatKey(guildId));
  if (!setting || !Array.isArray(setting.value)) {
    return [];
  }

  return (setting.value as GuildChatMessage[])
    .filter((item) => item && typeof item.content === "string")
    .slice(-100);
}

async function saveGuildChat(guildId: string, messages: GuildChatMessage[]): Promise<void> {
  await storage.setSetting(
    getGuildChatKey(guildId),
    messages.slice(-100),
    `Guild chat stream for ${guildId}`,
    "guild"
  );
}

export function registerGuildRoutes(app: Express) {
  app.get("/api/guilds", isAuthenticated, async (_req: Request, res: Response) => {
    try {
      const directory = await db.select().from(guilds).orderBy(desc(guilds.influence), desc(guilds.level), desc(guilds.createdAt));
      res.json(directory);
    } catch (error) {
      console.error("Failed to fetch guild directory:", error);
      res.status(500).json({ message: "Failed to load guild directory" });
    }
  });

  app.get("/api/guilds/mine", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const membership = await getMembershipForUser(userId);

      if (!membership) {
        return res.json(null);
      }

      const [guild] = await db.select().from(guilds).where(eq(guilds.id, membership.guildId)).limit(1);

      if (!guild) {
        return res.json(null);
      }

      res.json({
        ...guild,
        membership: {
          id: membership.id,
          role: membership.role,
          joinedAt: membership.joinedAt,
          contributedCurrency: membership.contributedCurrency,
          contributedResearch: membership.contributedResearch,
        },
      });
    } catch (error) {
      console.error("Failed to load player guild:", error);
      res.status(500).json({ message: "Failed to load player guild" });
    }
  });

  app.post("/api/guilds", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const name = String(req.body?.name || "").trim();
      const description = String(req.body?.description || "").trim();

      if (name.length < 3) {
        return res.status(400).json({ message: "Guild name must be at least 3 characters" });
      }

      const existingMembership = await getMembershipForUser(userId);
      if (existingMembership) {
        return res.status(409).json({ message: "Leave your current guild before creating a new one" });
      }

      const [existingGuild] = await db
        .select({ id: guilds.id })
        .from(guilds)
        .where(sql`lower(${guilds.name}) = lower(${name})`)
        .limit(1);

      if (existingGuild) {
        return res.status(409).json({ message: "A guild with that name already exists" });
      }

      const [createdGuild] = await db
        .insert(guilds)
        .values({
          name,
          description: description || "A newly founded guild prepares for expansion.",
          leaderId: userId,
          totalMembers: 1,
        })
        .returning();

      await db.insert(guildMembers).values({
        guildId: createdGuild.id,
        playerId: userId,
        role: "leader",
      });

      res.status(201).json(createdGuild);
    } catch (error) {
      console.error("Failed to create guild:", error);
      res.status(500).json({ message: "Failed to create guild" });
    }
  });

  app.post("/api/guilds/:guildId/join", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const { guildId } = req.params;

      const existingMembership = await getMembershipForUser(userId);
      if (existingMembership) {
        return res.status(409).json({ message: "You are already in a guild" });
      }

      const [guild] = await db.select().from(guilds).where(eq(guilds.id, guildId)).limit(1);
      if (!guild) {
        return res.status(404).json({ message: "Guild not found" });
      }

      if (!guild.isRecruiting) {
        return res.status(400).json({ message: "Guild recruitment is closed" });
      }

      if ((guild.totalMembers || 0) >= (guild.maxMembers || 0)) {
        return res.status(400).json({ message: "Guild is full" });
      }

      await db.insert(guildMembers).values({
        guildId,
        playerId: userId,
        role: "member",
      });

      const [updatedGuild] = await db
        .update(guilds)
        .set({
          totalMembers: (guild.totalMembers || 0) + 1,
          updatedAt: new Date(),
        })
        .where(eq(guilds.id, guildId))
        .returning();

      res.json(updatedGuild);
    } catch (error) {
      console.error("Failed to join guild:", error);
      res.status(500).json({ message: "Failed to join guild" });
    }
  });

  app.post("/api/guilds/:guildId/leave", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const { guildId } = req.params;

      const membership = await getMembershipForUser(userId);
      if (!membership || membership.guildId !== guildId) {
        return res.status(404).json({ message: "Guild membership not found" });
      }

      const [guild] = await db.select().from(guilds).where(eq(guilds.id, guildId)).limit(1);
      if (!guild) {
        return res.status(404).json({ message: "Guild not found" });
      }

      if (guild.leaderId === userId && (guild.totalMembers || 0) > 1) {
        return res.status(400).json({ message: "Transfer leadership or remove other members before leaving" });
      }

      if (guild.leaderId === userId) {
        await db.delete(guilds).where(eq(guilds.id, guildId));
        return res.json({ left: true, disbanded: true });
      }

      await db.delete(guildMembers).where(and(eq(guildMembers.guildId, guildId), eq(guildMembers.playerId, userId)));

      await db
        .update(guilds)
        .set({
          totalMembers: Math.max(0, (guild.totalMembers || 1) - 1),
          updatedAt: new Date(),
        })
        .where(eq(guilds.id, guildId));

      res.json({ left: true, disbanded: false });
    } catch (error) {
      console.error("Failed to leave guild:", error);
      res.status(500).json({ message: "Failed to leave guild" });
    }
  });

  app.get("/api/guilds/:guildId/members", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const { guildId } = req.params;

      const members = await db
        .select({
          id: guildMembers.id,
          playerId: guildMembers.playerId,
          role: guildMembers.role,
          joinedAt: guildMembers.joinedAt,
          contributedCurrency: guildMembers.contributedCurrency,
          contributedResearch: guildMembers.contributedResearch,
          playerName: users.username,
        })
        .from(guildMembers)
        .innerJoin(users, eq(guildMembers.playerId, users.id))
        .where(eq(guildMembers.guildId, guildId));

      res.json(members);
    } catch (error) {
      console.error("Failed to load guild members:", error);
      res.status(500).json({ message: "Failed to load guild members" });
    }
  });

  app.get("/api/guilds/:guildId/chat", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const { guildId } = req.params;
      const membership = await getMembershipForUser(userId);

      if (!membership || membership.guildId !== guildId) {
        return res.status(403).json({ message: "You must be a member of this guild to view chat" });
      }

      const messages = await getGuildChat(guildId);
      res.json({ messages });
    } catch (error) {
      console.error("Failed to load guild chat:", error);
      res.status(500).json({ message: "Failed to load guild chat" });
    }
  });

  app.post("/api/guilds/:guildId/chat", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const { guildId } = req.params;
      const content = String(req.body?.content || "").trim();

      if (!content) {
        return res.status(400).json({ message: "Message content is required" });
      }

      if (content.length > 500) {
        return res.status(400).json({ message: "Message must be 500 characters or less" });
      }

      const membership = await getMembershipForUser(userId);
      if (!membership || membership.guildId !== guildId) {
        return res.status(403).json({ message: "You must be a member of this guild to post" });
      }

      const [player] = await db.select({ username: users.username }).from(users).where(eq(users.id, userId)).limit(1);
      const senderName = player?.username || "Commander";

      const messages = await getGuildChat(guildId);
      const nextMessage: GuildChatMessage = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        guildId,
        senderId: userId,
        senderName,
        content,
        createdAt: Date.now(),
      };

      const nextMessages = [...messages, nextMessage];
      await saveGuildChat(guildId, nextMessages);

      res.status(201).json({ message: nextMessage });
    } catch (error) {
      console.error("Failed to post guild chat message:", error);
      res.status(500).json({ message: "Failed to post guild chat message" });
    }
  });
}