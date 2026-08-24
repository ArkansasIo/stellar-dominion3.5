import type { Express, Request, Response } from "express";
import { randomUUID } from "node:crypto";
import { storage } from "./storage";
import { isAuthenticated } from "./basicAuth";
import {
  ACHIEVEMENT_MILESTONES,
  COMPETITION_TYPES,
  GLOBAL_EVENTS,
  NARRATIVE_ARCS,
  RELEASE_GATES,
  ROADMAP_MILESTONES,
  SEASON_REWARDS,
  SUPPORTED_LOCALES,
  TUTORIAL_MISSIONS,
} from "../shared/config/liveOpsRoadmap";

type RoadmapState = {
  tutorialCompleted: string[];
  campaignProgress: Record<string, number>;
  joinedEvents: string[];
  joinedCompetitions: string[];
  seasonXp: number;
  claimedSeasonTiers: number[];
  achievements: string[];
  locale: string;
  updatedAt: number;
};

type Competition = {
  id: string;
  typeId: string;
  name: string;
  description: string;
  ownerId: string;
  startsAt: string;
  endsAt: string;
  participants: string[];
  status: "open" | "active" | "complete";
};

type SupportTicket = {
  id: string;
  userId: string;
  subject: string;
  category: string;
  message: string;
  status: "open" | "in_progress" | "resolved";
  createdAt: string;
};

const defaultState = (): RoadmapState => ({
  tutorialCompleted: [],
  campaignProgress: {},
  joinedEvents: [],
  joinedCompetitions: [],
  seasonXp: 0,
  claimedSeasonTiers: [],
  achievements: [],
  locale: "en",
  updatedAt: Date.now(),
});

function getUserId(req: Request): string {
  const userId = req.session?.userId;
  if (!userId) throw new Error("Unauthorized");
  return userId;
}

async function loadState(userId: string): Promise<RoadmapState> {
  const setting = await storage.getSetting(`roadmap_state:${userId}`);
  const value = setting?.value && typeof setting.value === "object" ? setting.value as Partial<RoadmapState> : {};
  return {
    ...defaultState(),
    ...value,
    tutorialCompleted: Array.isArray(value.tutorialCompleted) ? value.tutorialCompleted : [],
    campaignProgress: value.campaignProgress && typeof value.campaignProgress === "object" ? value.campaignProgress : {},
    joinedEvents: Array.isArray(value.joinedEvents) ? value.joinedEvents : [],
    joinedCompetitions: Array.isArray(value.joinedCompetitions) ? value.joinedCompetitions : [],
    claimedSeasonTiers: Array.isArray(value.claimedSeasonTiers) ? value.claimedSeasonTiers : [],
    achievements: Array.isArray(value.achievements) ? value.achievements : [],
  };
}

async function saveState(userId: string, state: RoadmapState): Promise<void> {
  state.updatedAt = Date.now();
  await storage.setSetting(`roadmap_state:${userId}`, state, "Phase 6-8 roadmap player progression", "player-state");
}

async function loadCompetitions(): Promise<Competition[]> {
  const setting = await storage.getSetting("roadmap_competitions");
  return Array.isArray(setting?.value) ? setting.value as Competition[] : [];
}

async function saveCompetitions(competitions: Competition[]): Promise<void> {
  await storage.setSetting("roadmap_competitions", competitions.slice(-200), "Player-created competitions and tournaments", "live-ops");
}

async function loadTickets(userId: string): Promise<SupportTicket[]> {
  const setting = await storage.getSetting(`roadmap_support:${userId}`);
  return Array.isArray(setting?.value) ? setting.value as SupportTicket[] : [];
}

export function registerRoadmapRoutes(app: Express): void {
  app.get("/api/roadmap/overview", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const state = await loadState(userId);
      const competitions = (await loadCompetitions()).filter((competition) => competition.status !== "complete");
      res.json({
        arcs: NARRATIVE_ARCS,
        tutorialMissions: TUTORIAL_MISSIONS,
        competitionTypes: COMPETITION_TYPES,
        competitions,
        globalEvents: GLOBAL_EVENTS,
        season: { id: "season-1", name: "Season 1: Frontier Awakening", rewards: SEASON_REWARDS, xp: state.seasonXp, claimedTiers: state.claimedSeasonTiers },
        achievements: ACHIEVEMENT_MILESTONES.map((achievement) => ({ ...achievement, completed: state.achievements.includes(achievement.id) })),
        releaseGates: RELEASE_GATES,
        milestones: ROADMAP_MILESTONES,
        locales: SUPPORTED_LOCALES,
        state,
      });
    } catch (error) {
      res.status(error instanceof Error && error.message === "Unauthorized" ? 401 : 500).json({ error: error instanceof Error ? error.message : "Failed to load roadmap" });
    }
  });

  app.post("/api/roadmap/tutorial/:missionId/complete", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const mission = TUTORIAL_MISSIONS.find((item) => item.id === req.params.missionId);
      if (!mission) return res.status(404).json({ error: "Tutorial mission not found" });
      const state = await loadState(userId);
      if (!state.tutorialCompleted.includes(mission.id)) state.tutorialCompleted.push(mission.id);
      state.seasonXp += 250;
      await saveState(userId, state);
      res.json({ success: true, mission, state });
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : "Failed to complete tutorial mission" });
    }
  });

  app.post("/api/roadmap/campaigns/:arcId/chapters/:chapter/complete", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const arc = NARRATIVE_ARCS.find((item) => item.id === req.params.arcId);
      const chapter = Number(req.params.chapter);
      if (!arc || !Number.isInteger(chapter) || chapter < 1 || chapter > arc.chapters) return res.status(400).json({ error: "Invalid campaign chapter" });
      const state = await loadState(userId);
      state.campaignProgress[arc.id] = Math.max(state.campaignProgress[arc.id] || 0, chapter);
      if (chapter >= arc.chapters && !state.achievements.includes("milestone-campaign-hero")) state.achievements.push("milestone-campaign-hero");
      state.seasonXp += 500;
      await saveState(userId, state);
      res.json({ success: true, arc, chapter, state });
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : "Failed to complete campaign chapter" });
    }
  });

  app.post("/api/roadmap/competitions", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const type = COMPETITION_TYPES.find((item) => item.id === req.body?.typeId);
      const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";
      if (!type || name.length < 3 || name.length > 80) return res.status(400).json({ error: "Choose a valid competition type and a name between 3 and 80 characters" });
      const startsAt = new Date(req.body?.startsAt || Date.now());
      const endsAt = new Date(req.body?.endsAt || Date.now() + 7 * 24 * 60 * 60 * 1000);
      if (!Number.isFinite(startsAt.getTime()) || !Number.isFinite(endsAt.getTime()) || endsAt <= startsAt) return res.status(400).json({ error: "Competition end must be after its start" });
      const competition: Competition = { id: `competition-${randomUUID()}`, typeId: type.id, name, description: type.description, ownerId: userId, startsAt: startsAt.toISOString(), endsAt: endsAt.toISOString(), participants: [userId], status: "open" };
      const competitions = await loadCompetitions();
      competitions.push(competition);
      await saveCompetitions(competitions);
      const state = await loadState(userId);
      state.joinedCompetitions.push(competition.id);
      await saveState(userId, state);
      res.status(201).json({ success: true, competition });
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : "Failed to create competition" });
    }
  });

  app.post("/api/roadmap/competitions/:competitionId/join", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const competitions = await loadCompetitions();
      const competition = competitions.find((item) => item.id === req.params.competitionId);
      if (!competition) return res.status(404).json({ error: "Competition not found" });
      const type = COMPETITION_TYPES.find((item) => item.id === competition.typeId)!;
      if (competition.status === "complete") return res.status(409).json({ error: "Competition is complete" });
      if (!competition.participants.includes(userId) && competition.participants.length >= type.maxParticipants) return res.status(409).json({ error: "Competition is full" });
      if (!competition.participants.includes(userId)) competition.participants.push(userId);
      await saveCompetitions(competitions);
      const state = await loadState(userId);
      if (!state.joinedCompetitions.includes(competition.id)) state.joinedCompetitions.push(competition.id);
      state.seasonXp += 100;
      await saveState(userId, state);
      res.json({ success: true, competition });
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : "Failed to join competition" });
    }
  });

  app.post("/api/roadmap/events/:eventId/join", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const event = GLOBAL_EVENTS.find((item) => item.id === req.params.eventId);
      if (!event) return res.status(404).json({ error: "Global event not found" });
      const state = await loadState(userId);
      if (!state.joinedEvents.includes(event.id)) state.joinedEvents.push(event.id);
      if (!state.achievements.includes("milestone-event-pioneer")) state.achievements.push("milestone-event-pioneer");
      state.seasonXp += 300;
      await saveState(userId, state);
      res.json({ success: true, event, state });
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : "Failed to join global event" });
    }
  });

  app.post("/api/roadmap/season/xp", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const amount = Math.floor(Number(req.body?.amount));
      if (!Number.isFinite(amount) || amount <= 0 || amount > 100_000) return res.status(400).json({ error: "Invalid season XP amount" });
      const state = await loadState(userId);
      state.seasonXp += amount;
      await saveState(userId, state);
      res.json({ success: true, xp: state.seasonXp });
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : "Failed to add season XP" });
    }
  });

  app.post("/api/roadmap/season/claim", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const tier = Number(req.body?.tier);
      const reward = SEASON_REWARDS.find((item) => item.tier === tier);
      const state = await loadState(userId);
      if (!reward || state.seasonXp < reward.xpRequired) return res.status(400).json({ error: "Season tier is not unlocked" });
      if (state.claimedSeasonTiers.includes(tier)) return res.status(409).json({ error: "Season reward already claimed" });
      state.claimedSeasonTiers.push(tier);
      if (tier >= 30 && !state.achievements.includes("milestone-season-veteran")) state.achievements.push("milestone-season-veteran");
      await saveState(userId, state);
      res.json({ success: true, reward, state });
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : "Failed to claim season reward" });
    }
  });

  app.get("/api/roadmap/support/tickets", isAuthenticated, async (req: Request, res: Response) => {
    try { res.json({ tickets: await loadTickets(getUserId(req)) }); }
    catch (error) { res.status(500).json({ error: error instanceof Error ? error.message : "Failed to load support tickets" }); }
  });

  app.post("/api/roadmap/support/tickets", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const subject = typeof req.body?.subject === "string" ? req.body.subject.trim() : "";
      const message = typeof req.body?.message === "string" ? req.body.message.trim() : "";
      const category = typeof req.body?.category === "string" ? req.body.category : "general";
      if (subject.length < 3 || subject.length > 120 || message.length < 10 || message.length > 2_000) return res.status(400).json({ error: "Subject or message length is invalid" });
      const ticket: SupportTicket = { id: `ticket-${randomUUID()}`, userId, subject, category, message, status: "open", createdAt: new Date().toISOString() };
      const tickets = await loadTickets(userId);
      tickets.push(ticket);
      await storage.setSetting(`roadmap_support:${userId}`, tickets.slice(-50), "Player support tickets", "support");
      res.status(201).json({ success: true, ticket });
    } catch (error) { res.status(500).json({ error: error instanceof Error ? error.message : "Failed to create support ticket" }); }
  });

  app.get("/api/roadmap/operations", isAuthenticated, async (_req: Request, res: Response) => {
    res.json({ releaseGates: RELEASE_GATES, milestones: ROADMAP_MILESTONES, locales: SUPPORTED_LOCALES, service: { status: "operational", version: "1.0.0-rc", generatedAt: new Date().toISOString(), apiP95TargetMs: 200, lighthouseTarget: 90 } });
  });
}
