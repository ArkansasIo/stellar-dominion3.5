import type { Express } from "express";
import { isAuthenticated } from "./basicAuth";
import { db } from "./db";
import { adminUsers } from "../shared/schema";
import { eq } from "drizzle-orm";

type ForumReply = {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: number;
};

type ForumThread = {
  id: string;
  title: string;
  category: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: number;
  replies: ForumReply[];
};

const forumThreads: ForumThread[] = [
  {
    id: "thread-openers",
    title: "Empire Opening Build Orders",
    category: "Strategy",
    authorId: "system",
    authorName: "Command Archive",
    content: "Share your first 30-turn opener and explain why it scales.",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
    replies: [],
  },
  {
    id: "thread-workforce",
    title: "Civilization Workforce Optimization",
    category: "Economy",
    authorId: "system",
    authorName: "Command Archive",
    content: "Post labor assignment templates for production-heavy runs.",
    createdAt: Date.now() - 1000 * 60 * 60 * 24,
    replies: [],
  },
];

function createId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

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
  app.get("/api/forums/threads", (_req, res) => {
    const sorted = [...forumThreads].sort((a, b) => b.createdAt - a.createdAt);
    res.json({ success: true, threads: sorted, count: sorted.length });
  });

  app.post("/api/forums/threads", isAuthenticated, (req, res) => {
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

    const thread: ForumThread = {
      id: createId("thread"),
      title,
      category,
      authorId: userId,
      authorName: username,
      content,
      createdAt: Date.now(),
      replies: [],
    };

    forumThreads.unshift(thread);
    return res.json({ success: true, thread });
  });

  app.post("/api/forums/threads/:threadId/reply", isAuthenticated, (req, res) => {
    const userId = (req as any).user?.id;
    const username = String((req.body?.username || "").trim() || "Commander");
    const content = String((req.body?.content || "").trim());

    if (!userId) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }
    if (!content || content.length < 2) {
      return res.status(400).json({ success: false, message: "Reply content is required" });
    }

    const thread = forumThreads.find((item) => item.id === req.params.threadId);
    if (!thread) {
      return res.status(404).json({ success: false, message: "Thread not found" });
    }

    const reply: ForumReply = {
      id: createId("reply"),
      authorId: userId,
      authorName: username,
      content,
      createdAt: Date.now(),
    };

    thread.replies.push(reply);
    return res.json({ success: true, reply });
  });

  app.post("/api/forums/reset", isAuthenticated, async (req, res) => {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    const isAdmin = await isAdminUser(userId);
    if (!isAdmin) {
      return res.status(403).json({ success: false, message: "Admin access required" });
    }

    forumThreads.splice(0, forumThreads.length);
    return res.json({ success: true, message: "Forum reset completed" });
  });
}
