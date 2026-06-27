import type { Express, Request, Response } from "express";
import { isAuthenticated } from "./basicAuth";
import { storage } from "./storage";

type NewsArticle = {
  id: string;
  title: string;
  content: string;
  category: "update" | "event" | "announcement" | "war" | "economy" | "patch";
  author: string;
  createdAt: string;
  pinned: boolean;
  tags: string[];
  imageUrl?: string;
};

type ServerAnnouncement = {
  id: string;
  message: string;
  priority: "low" | "medium" | "high" | "critical";
  createdAt: string;
  expiresAt?: string;
};

function getNewsKey(): string {
  return "news_feed_articles";
}

function getAnnouncementsKey(): string {
  return "server_announcements";
}

async function getNewsArticles(): Promise<NewsArticle[]> {
  const setting = await storage.getSetting(getNewsKey());
  if (!setting || !Array.isArray(setting.value)) {
    return [];
  }
  return (setting.value as NewsArticle[]).filter((a) => a && typeof a.title === "string");
}

async function saveNewsArticles(articles: NewsArticle[]): Promise<void> {
  await storage.setSetting(getNewsKey(), articles.slice(-200), "News feed articles", "news");
}

async function getAnnouncements(): Promise<ServerAnnouncement[]> {
  const setting = await storage.getSetting(getAnnouncementsKey());
  if (!setting || !Array.isArray(setting.value)) {
    return [];
  }
  const now = Date.now();
  return (setting.value as ServerAnnouncement[]).filter(
    (a) => a && typeof a.message === "string" && (!a.expiresAt || new Date(a.expiresAt).getTime() > now)
  );
}

async function saveAnnouncements(announcements: ServerAnnouncement[]): Promise<void> {
  await storage.setSetting(getAnnouncementsKey(), announcements.slice(-100), "Server announcements", "news");
}

const SEED_NEWS: NewsArticle[] = [
  {
    id: "news_001",
    title: "Stellar Dominion v1.6.0 — Galactic Command Update",
    content: "The latest update brings Starbase Infrastructure, Moon Colonization, and a complete overhaul of the fleet combat system. New module slots allow deep customization of your starbases. Moon bases now generate passive resources and unlock unique research paths.",
    category: "update",
    author: "Stellar Command",
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    pinned: true,
    tags: ["v1.6.0", "starbases", "moons", "combat"],
  },
  {
    id: "news_002",
    title: "Galactic War Alert — Sector 7 Under Siege",
    content: "Multiple alliances have reported hostile fleet movements in Sector 7. Commanders are advised to reinforce defensive positions and coordinate with allied fleets. The first alliance to secure the sector will gain exclusive access to the Ancient Gateway megastructure.",
    category: "war",
    author: "Galactic Intelligence",
    createdAt: new Date(Date.now() - 6 * 3600000).toISOString(),
    pinned: true,
    tags: ["war", "sector-7", "megastructure"],
  },
  {
    id: "news_003",
    title: "Market Fluctuations — Deuterium Prices Surge",
    content: "Deuterium prices have risen 340% over the past week due to increased demand for fleet operations and starbase construction. Traders are advised to secure deuterium reserves before the next galactic trade cycle. Crystal remains stable.",
    category: "economy",
    author: "Trade Federation",
    createdAt: new Date(Date.now() - 12 * 3600000).toISOString(),
    pinned: false,
    tags: ["economy", "deuterium", "market"],
  },
  {
    id: "news_004",
    title: "Dimensional Anomaly Detected in Alpha Quadrant",
    content: "Long-range sensors have detected a massive dimensional anomaly forming in Alpha Quadrant. Exploratory fleets are being assembled. Commanders with Spore Drive technology are especially encouraged to investigate. Rewards include unique relics and blueprint fragments.",
    category: "event",
    author: "Exploration Corps",
    createdAt: new Date(Date.now() - 18 * 3600000).toISOString(),
    pinned: false,
    tags: ["anomaly", "exploration", "relics"],
  },
  {
    id: "news_005",
    title: "Alliance Tournament — Registration Now Open",
    content: "The first inter-alliance tournament is officially open for registration. Teams of 5 commanders will compete in a bracket-style elimination. Top 3 alliances receive exclusive commander skins and a permanent leaderboard title. Registration closes in 72 hours.",
    category: "event",
    author: "Tournament Committee",
    createdAt: new Date(Date.now() - 24 * 3600000).toISOString(),
    pinned: false,
    tags: ["tournament", "alliance", "pvp"],
  },
  {
    id: "news_006",
    title: "Patch 1.5.1 — Balance Tuning & Bug Fixes",
    content: "Adjusted resource mine scaling for metal and crystal at levels 50+. Fixed an issue where fleet combat would sometimes freeze on round 47. Reduced espionage scan cooldown from 120s to 60s. Improved WebSocket reconnect reliability.",
    category: "patch",
    author: "Dev Team",
    createdAt: new Date(Date.now() - 48 * 3600000).toISOString(),
    pinned: false,
    tags: ["balance", "bugfix", "v1.5.1"],
  },
  {
    id: "news_007",
    title: "Guild Wars System — Coming in v1.7.0",
    content: "Get ready for guild-vs-guild combat! The upcoming v1.7.0 patch will introduce territory control, guild resource nodes, and structured guild wars with season rankings. Guild leaders can now start preparing by building up treasury reserves.",
    category: "announcement",
    author: "Stellar Command",
    createdAt: new Date(Date.now() - 72 * 3600000).toISOString(),
    pinned: false,
    tags: ["guild-wars", "roadmap", "v1.7.0"],
  },
  {
    id: "news_008",
    title: "Raid Boss: The Void Titan Awakens",
    content: "A new raid boss has emerged from the deep void. The Void Titan requires coordinated alliance fleets of 50,000+ combined power to defeat. Defeating it drops the legendary Void Core artifact and exclusive Void Titan commander skin. Form your alliances and prepare for battle!",
    category: "event",
    author: "Combat Division",
    createdAt: new Date(Date.now() - 96 * 3600000).toISOString(),
    pinned: false,
    tags: ["raid-boss", "void-titan", "legendary"],
  },
];

const SEED_ANNOUNCEMENTS: ServerAnnouncement[] = [
  {
    id: "ann_001",
    message: "Welcome to Stellar Dominion! Server maintenance scheduled for Sunday 04:00 UTC.",
    priority: "medium",
    createdAt: new Date(Date.now() - 1 * 3600000).toISOString(),
  },
];

export function registerNewsRoutes(app: Express) {
  app.get("/api/news", async (_req: Request, res: Response) => {
    try {
      let articles = await getNewsArticles();
      if (articles.length === 0) {
        articles = SEED_NEWS;
        await saveNewsArticles(articles);
      }
      const sorted = articles.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      res.json({ articles: sorted, count: sorted.length });
    } catch (error) {
      console.error("Failed to load news:", error);
      res.status(500).json({ message: "Failed to load news feed" });
    }
  });

  app.get("/api/news/:articleId", async (req: Request, res: Response) => {
    try {
      const articles = await getNewsArticles();
      const article = articles.find((a) => a.id === req.params.articleId);
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      res.json(article);
    } catch (error) {
      console.error("Failed to load article:", error);
      res.status(500).json({ message: "Failed to load article" });
    }
  });

  app.post("/api/news", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = req.session?.userId || "";
      const title = String(req.body?.title || "").trim();
      const content = String(req.body?.content || "").trim();
      const category = String(req.body?.category || "announcement").trim() as NewsArticle["category"];
      const tags = Array.isArray(req.body?.tags) ? req.body.tags.map(String) : [];

      if (!title || !content) {
        return res.status(400).json({ message: "Title and content are required" });
      }

      const articles = await getNewsArticles();
      const newArticle: NewsArticle = {
        id: `news_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
        title,
        content,
        category,
        author: userId,
        createdAt: new Date().toISOString(),
        pinned: false,
        tags,
      };

      articles.push(newArticle);
      await saveNewsArticles(articles);
      res.status(201).json({ success: true, article: newArticle });
    } catch (error) {
      console.error("Failed to create news article:", error);
      res.status(500).json({ message: "Failed to create article" });
    }
  });

  app.get("/api/announcements", async (_req: Request, res: Response) => {
    try {
      let announcements = await getAnnouncements();
      if (announcements.length === 0) {
        announcements = SEED_ANNOUNCEMENTS;
        await saveAnnouncements(announcements);
      }
      const sorted = announcements.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      res.json({ announcements: sorted, count: sorted.length });
    } catch (error) {
      console.error("Failed to load announcements:", error);
      res.status(500).json({ message: "Failed to load announcements" });
    }
  });

  app.post("/api/announcements", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const message = String(req.body?.message || "").trim();
      const priority = String(req.body?.priority || "medium").trim() as ServerAnnouncement["priority"];

      if (!message) {
        return res.status(400).json({ message: "Announcement message is required" });
      }

      const announcements = await getAnnouncements();
      const newAnnouncement: ServerAnnouncement = {
        id: `ann_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
        message,
        priority,
        createdAt: new Date().toISOString(),
        expiresAt: req.body?.expiresAt ? String(req.body.expiresAt) : undefined,
      };

      announcements.push(newAnnouncement);
      await saveAnnouncements(announcements);
      res.status(201).json({ success: true, announcement: newAnnouncement });
    } catch (error) {
      console.error("Failed to create announcement:", error);
      res.status(500).json({ message: "Failed to create announcement" });
    }
  });
}
