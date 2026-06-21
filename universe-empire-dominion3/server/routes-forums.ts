import type { Express } from "express";
import { isAuthenticated } from "./basicAuth";
import { storage } from "./storage";
import { db } from "./db";
import { adminUsers } from "../shared/schema";
import { eq } from "drizzle-orm";

async function isAdminUser(userId: string) {
  if (!userId) return false;
  const [record] = await db
    .select({ id: adminUsers.id })
    .from(adminUsers)
    .where(eq(adminUsers.userId, userId))
    .limit(1);
  return Boolean(record);
}

export function registerForumRoutes(app: Express) {
  app.get("/api/forums/threads", async (req, res) => {
    try {
      const category = (req.query.category as string) || "all";
      const threads = await storage.getForumThreads(category);
      const threadsWithReplies = await Promise.all(
        threads.map(async (thread: any) => {
          const replies = await storage.getForumReplies(thread.id);
          return { ...thread, replies };
        })
      );
      res.json({ success: true, threads: threadsWithReplies, count: threadsWithReplies.length });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to load threads" });
    }
  });

  app.get("/api/forums/threads/:threadId", async (req, res) => {
    try {
      const thread = await storage.getForumThread(req.params.threadId);
      if (!thread) {
        return res.status(404).json({ success: false, message: "Thread not found" });
      }
      const replies = await storage.getForumReplies(thread.id);
      res.json({ success: true, thread: { ...thread, replies } });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to load thread" });
    }
  });

  app.post("/api/forums/threads", isAuthenticated, async (req, res) => {
    try {
      const userId = (req as any).user?.id;
      const username = String((req.body?.username || "").trim() || "Commander");
      const title = String((req.body?.title || "").trim());
      const category = String((req.body?.category || "General").trim());
      const content = String((req.body?.content || "").trim());

      if (!userId) {
        return res.status(401).json({ success: false, message: "Not authenticated" });
      }
      if (!title || title.length < 4) {
        return res.status(400).json({ success: false, message: "Thread title must be at least 4 characters" });
      }
      if (!content || content.length < 8) {
        return res.status(400).json({ success: false, message: "Thread content must be at least 8 characters" });
      }

      const thread = await storage.createForumThread({ title, category, authorId: userId, authorName: username, content });
      return res.json({ success: true, thread: { ...thread, replies: [] } });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to create thread" });
    }
  });

  app.post("/api/forums/threads/:threadId/reply", isAuthenticated, async (req, res) => {
    try {
      const userId = (req as any).user?.id;
      const username = String((req.body?.username || "").trim() || "Commander");
      const content = String((req.body?.content || "").trim());

      if (!userId) {
        return res.status(401).json({ success: false, message: "Not authenticated" });
      }
      if (!content || content.length < 2) {
        return res.status(400).json({ success: false, message: "Reply content is required" });
      }

      const thread = await storage.getForumThread(req.params.threadId);
      if (!thread) {
        return res.status(404).json({ success: false, message: "Thread not found" });
      }

      const reply = await storage.createForumReply({ threadId: thread.id, authorId: userId, authorName: username, content });
      return res.json({ success: true, reply });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to create reply" });
    }
  });

  app.post("/api/forums/reset", isAuthenticated, async (req, res) => {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Not authenticated" });
      }
      const isAdmin = await isAdminUser(userId);
      if (!isAdmin) {
        return res.status(403).json({ success: false, message: "Admin access required" });
      }
      await storage.deleteAllForumThreads();
      return res.json({ success: true, message: "Forum reset completed" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to reset forums" });
    }
  });
}
