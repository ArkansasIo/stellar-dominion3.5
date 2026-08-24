import type { Express, Request, Response } from "express";
import { isAuthenticated } from "./basicAuth";
import { storage } from "./storage";
import {
  EMPIRE_SKILLS,
  SKILL_BY_ID,
  SKILL_CATEGORY_NAMES,
  SKILL_ATTRIBUTE_NAMES,
  createDefaultEmpireSkillState,
  calculateSkillTrainingSeconds,
  getSkillEffects,
  type EmpireSkillState,
  type SkillAttribute,
} from "../shared/config/empireSkills";

const SKILL_STATE_PREFIX = "empire-skills:";
const MAX_TRAINING_QUEUE = 3;
const VALID_ATTRIBUTES = new Set<SkillAttribute>(["intelligence", "memory", "charisma", "perception", "willpower"]);

function stateKey(userId: string) {
  return `${SKILL_STATE_PREFIX}${userId}`;
}

function finiteNumber(value: unknown, fallback = 0) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

function normalizeState(raw: unknown): EmpireSkillState {
  const source = raw && typeof raw === "object" ? raw as Partial<EmpireSkillState> : {};
  const skills = source.skills && typeof source.skills === "object" ? source.skills : {};
  const queue = Array.isArray(source.queue) ? source.queue : [];
  const attributes = source.attributes && typeof source.attributes === "object" ? source.attributes : {};

  return {
    skills: Object.fromEntries(Object.entries(skills).map(([id, level]) => [id, Math.max(0, Math.floor(finiteNumber(level)))])),
    queue: queue.filter((item) => item && typeof item === "object").map((item: any) => ({
      skillId: String(item.skillId || ""),
      level: Math.max(1, Math.floor(finiteNumber(item.level, 1))),
      startTime: finiteNumber(item.startTime, Math.floor(Date.now() / 1000)),
      endTime: finiteNumber(item.endTime, Math.floor(Date.now() / 1000)),
    })).filter((item) => Boolean(SKILL_BY_ID[item.skillId]) && item.endTime > item.startTime),
    attributes: {
      intelligence: Math.max(1, Math.floor(finiteNumber((attributes as any).intelligence, 5))),
      memory: Math.max(1, Math.floor(finiteNumber((attributes as any).memory, 5))),
      charisma: Math.max(1, Math.floor(finiteNumber((attributes as any).charisma, 5))),
      perception: Math.max(1, Math.floor(finiteNumber((attributes as any).perception, 5))),
      willpower: Math.max(1, Math.floor(finiteNumber((attributes as any).willpower, 5))),
    },
  };
}

async function loadState(userId: string) {
  const setting = await storage.getSetting(stateKey(userId));
  return normalizeState(setting?.value ?? createDefaultEmpireSkillState());
}

async function saveState(userId: string, state: EmpireSkillState) {
  await storage.setSetting(
    stateKey(userId),
    state,
    "Empire Skills Training state, attributes, queue, and calculated effects",
    "progression",
  );
}

function completeDueTraining(state: EmpireSkillState, now = Math.floor(Date.now() / 1000)) {
  const completed = state.queue.filter((item) => item.endTime <= now);
  const remaining = state.queue.filter((item) => item.endTime > now);
  for (const item of completed) {
    state.skills[item.skillId] = Math.max(state.skills[item.skillId] || 0, item.level);
  }
  state.queue = remaining;
  return completed;
}

function hasPrerequisites(state: EmpireSkillState, skillId: string) {
  const definition = SKILL_BY_ID[skillId];
  if (!definition) return false;
  return Object.entries(definition.prerequisites).every(([requiredId, requiredLevel]) => (state.skills[requiredId] || 0) >= requiredLevel);
}

function serializeSkill(definition: typeof EMPIRE_SKILLS[number], state: EmpireSkillState) {
  const currentLevel = state.skills[definition.id] || 0;
  const queued = state.queue.find((item) => item.skillId === definition.id);
  const nextLevel = currentLevel + 1;
  const prerequisitesMet = hasPrerequisites(state, definition.id);
  const trainingTime = currentLevel < definition.maxLevel
    ? calculateSkillTrainingSeconds(definition, nextLevel, state.attributes)
    : 0;
  return {
    skillId: definition.id,
    name: definition.name,
    description: definition.description,
    category: definition.category,
    categoryName: SKILL_CATEGORY_NAMES[definition.category],
    currentLevel,
    maxLevel: definition.maxLevel,
    trainingTime,
    attributes: [definition.primaryAttribute, definition.secondaryAttribute],
    attributeNames: [SKILL_ATTRIBUTE_NAMES[definition.primaryAttribute], SKILL_ATTRIBUTE_NAMES[definition.secondaryAttribute]],
    primaryAttribute: definition.primaryAttribute,
    secondaryAttribute: definition.secondaryAttribute,
    prerequisites: definition.prerequisites,
    effects: definition.effects,
    queued: Boolean(queued),
    queueItem: queued || null,
    prerequisitesMet,
    locked: !prerequisitesMet,
    maxed: currentLevel >= definition.maxLevel,
    nextLevel,
  };
}

function getUserId(req: Request) {
  return req.session?.userId || "";
}

export function registerSkillsRoutes(app: Express) {
  app.get("/api/skills", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const state = await loadState(userId);
      const completed = completeDueTraining(state);
      if (completed.length) await saveState(userId, state);
      const skills = EMPIRE_SKILLS.filter((definition) => (state.skills[definition.id] || 0) > 0).map((definition) => ({
        ...serializeSkill(definition, state),
        level: state.skills[definition.id] || 0,
        effect: definition.effects,
      }));
      res.json({
        skills,
        attributes: state.attributes,
        effects: getSkillEffects(state),
        totalCatalogSize: EMPIRE_SKILLS.length,
      });
    } catch (error) {
      console.error("[skills] failed to load player skills", error);
      res.status(500).json({ message: "Failed to load skills" });
    }
  });

  app.get("/api/skills/available", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const state = await loadState(userId);
      const completed = completeDueTraining(state);
      if (completed.length) await saveState(userId, state);
      res.json(EMPIRE_SKILLS.map((definition) => serializeSkill(definition, state)));
    } catch (error) {
      console.error("[skills] failed to load skill catalog", error);
      res.status(500).json({ message: "Failed to load available skills" });
    }
  });

  app.get("/api/skills/tree", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const state = await loadState(getUserId(req));
      res.json({
        categories: Object.entries(SKILL_CATEGORY_NAMES).map(([id, name]) => ({ id, name, skills: EMPIRE_SKILLS.filter((entry) => entry.category === id).map((entry) => serializeSkill(entry, state)) })),
        totalSkills: EMPIRE_SKILLS.length,
        effects: getSkillEffects(state),
      });
    } catch (error) {
      console.error("[skills] failed to load tree", error);
      res.status(500).json({ message: "Failed to load skill tree" });
    }
  });

  app.get("/api/skills/queue", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const state = await loadState(userId);
      const completed = completeDueTraining(state);
      await saveState(userId, state);
      res.json({ queue: state.queue, completed, effects: getSkillEffects(state) });
    } catch (error) {
      console.error("[skills] failed to load queue", error);
      res.status(500).json({ message: "Failed to load skill queue" });
    }
  });

  app.post("/api/skills/train", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const skillId = String(req.body?.skillId || "");
      const definition = SKILL_BY_ID[skillId];
      if (!definition) return res.status(400).json({ message: "Invalid skill" });

      const state = await loadState(userId);
      const completed = completeDueTraining(state);
      const currentLevel = state.skills[skillId] || 0;
      if (currentLevel >= definition.maxLevel) return res.status(400).json({ message: "Skill already at maximum level" });
      if (state.queue.length >= MAX_TRAINING_QUEUE) return res.status(400).json({ message: `Training queue is full (${MAX_TRAINING_QUEUE} slots)` });
      if (state.queue.some((item) => item.skillId === skillId)) return res.status(400).json({ message: "Skill is already in the training queue" });
      if (!hasPrerequisites(state, skillId)) return res.status(400).json({ message: "Skill prerequisites are not met", prerequisites: definition.prerequisites });

      const level = currentLevel + 1;
      const startTime = Math.floor(Date.now() / 1000);
      const trainingTime = calculateSkillTrainingSeconds(definition, level, state.attributes);
      const queueItem = { skillId, level, startTime, endTime: startTime + trainingTime };
      state.queue.push(queueItem);
      await saveState(userId, state);
      res.json({ success: true, skillId, level, trainingTime, endTime: queueItem.endTime, queue: state.queue, completed });
    } catch (error) {
      console.error("[skills] failed to queue training", error);
      res.status(500).json({ message: "Failed to start skill training" });
    }
  });

  app.post("/api/skills/attributes", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const attribute = String(req.body?.attribute || "") as SkillAttribute;
      const amount = Math.max(1, Math.floor(finiteNumber(req.body?.amount, 1)));
      if (!VALID_ATTRIBUTES.has(attribute)) return res.status(400).json({ message: "Invalid attribute" });
      if (amount > 5) return res.status(400).json({ message: "Attribute allocation is limited to 5 points per action" });
      const userId = getUserId(req);
      const state = await loadState(userId);
      const totalAllocated = Object.values(state.attributes).reduce((sum, value) => sum + value, 0) - 25;
      if (totalAllocated + amount > 25) return res.status(400).json({ message: "No attribute points remaining" });
      state.attributes[attribute] += amount;
      await saveState(userId, state);
      res.json({ success: true, attributes: state.attributes, effects: getSkillEffects(state) });
    } catch (error) {
      console.error("[skills] failed to allocate attribute points", error);
      res.status(500).json({ message: "Failed to allocate attribute points" });
    }
  });
}
