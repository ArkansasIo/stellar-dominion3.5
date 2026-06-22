/**
 * SMITHY SERVER ROUTES
 * ============================================================================
 */
import { type Express } from "express";
import { getDefaultSmithyState, MATERIALS, ENCHANTMENTS, CRAFTING_BLUEPRINTS, calculateSmithyLevel, experienceForNextLevel, processTemper, processMasterwork, processSalvage, processEnchant, processLearnBlueprint } from "../shared/config/economy/crafting/smithySystem";

import type { SmithyState } from "../shared/config/economy/crafting/smithySystem";

import type { EquipmentItem } from "../shared/config/economy/crafting/equipmentTemperingSystem";

import { db } from "./db";
import { playerStates } from "../shared/schema";
import { eq } from "drizzle-orm";

async function getSmithyState(userId: string): Promise<SmithyState> {
  const row = await db.query.playerStates.findFirst({
    where: eq(playerStates.userId, userId),
    columns: { smithyState: true },
  });
  const state = row?.smithyState as SmithyState | null;
  return state || getDefaultSmithyState();
}

async function setSmithyState(userId: string, state: SmithyState) {
  await db
    .update(playerStates)
    .set({ smithyState: state as any, updatedAt: new Date() })
    .where(eq(playerStates.userId, userId));
}

export function registerSmithyRoutes(app: Express) {
  // Get full smithy state
  app.get("/api/smithy/status", async (req: any, res) => {
    const userId = req.user?.id || "dev-user";
    const state = await getSmithyState(userId);
    res.json({
      success: true,
      level: state.level,
      experience: state.experience,
      nextLevelExp: experienceForNextLevel(state.level),
      materials: state.materials,
      blueprints: state.blueprints,
      craftingQueue: state.craftingQueue,
      totalCrafted: state.totalCrafted,
      totalTempered: state.totalTempered,
      totalMasterworked: state.totalMasterworked,
      totalSalvaged: state.totalSalvaged,
      smithyStats: state.smithyStats,
    });
  });

  // Get all materials
  app.get("/api/smithy/materials", async (req: any, res) => {
    const userId = req.user?.id || "dev-user";
    const state = await getSmithyState(userId);
    const materials = MATERIALS.map(m => ({
      ...m,
      owned: state.materials[m.id] || 0,
    }));
    res.json({ success: true, materials });
  });

  // Get all enchantments
  app.get("/api/smithy/enchantments", (_req, res) => {
    res.json({ success: true, enchantments: ENCHANTMENTS });
  });

  // Get all blueprints
  app.get("/api/smithy/blueprints", async (req: any, res) => {
    const userId = req.user?.id || "dev-user";
    const state = await getSmithyState(userId);
    const blueprints = CRAFTING_BLUEPRINTS.map(bp => ({
      ...bp,
      isLearned: state.blueprints.includes(bp.id),
      canLearn: state.level >= bp.requiredSmithyLevel && !state.blueprints.includes(bp.id),
    }));
    res.json({ success: true, blueprints, learnedCount: state.blueprints.length });
  });

  // Temper equipment
  app.post("/api/smithy/temper", async (req: any, res) => {
    const userId = req.user?.id || "dev-user";
    const { equipment, selectedSubStatIndex } = req.body;
    if (!equipment || selectedSubStatIndex === undefined) {
      return res.status(400).json({ message: "Missing equipment or selectedSubStatIndex" });
    }
    const state = await getSmithyState(userId);
    const result = processTemper(state, equipment as EquipmentItem, selectedSubStatIndex);
    if (result.success) await setSmithyState(userId, result.newState);
    res.json({ success: result.success, message: result.message, equipment: result.newEquipment });
  });

  // Masterwork equipment
  app.post("/api/smithy/masterwork", async (req: any, res) => {
    const userId = req.user?.id || "dev-user";
    const { equipment } = req.body;
    if (!equipment) return res.status(400).json({ message: "Missing equipment" });
    const state = await getSmithyState(userId);
    const result = processMasterwork(state, equipment as EquipmentItem);
    if (result.success) await setSmithyState(userId, result.newState);
    res.json({ success: result.success, message: result.message, equipment: result.newEquipment });
  });

  // Salvage equipment
  app.post("/api/smithy/salvage", async (req: any, res) => {
    const userId = req.user?.id || "dev-user";
    const { equipment } = req.body;
    if (!equipment) return res.status(400).json({ message: "Missing equipment" });
    const state = await getSmithyState(userId);
    const result = processSalvage(state, equipment as EquipmentItem);
    await setSmithyState(userId, result.newState);
    res.json({ success: true, credits: result.credits, materials: result.materials });
  });

  // Enchant equipment
  app.post("/api/smithy/enchant", async (req: any, res) => {
    const userId = req.user?.id || "dev-user";
    const { equipmentId, enchantmentId } = req.body;
    if (!equipmentId || !enchantmentId) return res.status(400).json({ message: "Missing equipmentId or enchantmentId" });
    const state = await getSmithyState(userId);
    const result = processEnchant(state, equipmentId, enchantmentId);
    if (result.success) await setSmithyState(userId, result.newState);
    res.json({ success: result.success, message: result.message });
  });

  // Learn blueprint
  app.post("/api/smithy/learn-blueprint", async (req: any, res) => {
    const userId = req.user?.id || "dev-user";
    const { blueprintId } = req.body;
    if (!blueprintId) return res.status(400).json({ message: "Missing blueprintId" });
    const state = await getSmithyState(userId);
    const result = processLearnBlueprint(state, blueprintId, 0);
    if (result.success) await setSmithyState(userId, result.newState);
    res.json({ success: result.success, message: result.message });
  });

  // Get smithy stats
  app.get("/api/smithy/stats", async (req: any, res) => {
    const userId = req.user?.id || "dev-user";
    const state = await getSmithyState(userId);
    res.json({
      success: true,
      stats: state.smithyStats,
      history: {
        temper: state.temperHistory.slice(-20),
        masterwork: state.masterworkHistory.slice(-20),
      },
    });
  });
}