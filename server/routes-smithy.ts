/**
 * SMITHY SERVER ROUTES
 * ============================================================================
 */
import { type Express } from "express";
import { getDefaultSmithyState, MATERIALS, ENCHANTMENTS, CRAFTING_BLUEPRINTS, calculateSmithyLevel, experienceForNextLevel, processTemper, processMasterwork, processSalvage, processEnchant, processLearnBlueprint } from "../Source/Shared/config/smithySystem";
import type { SmithyState } from "../Source/Shared/config/smithySystem";
import type { EquipmentItem } from "../Source/Shared/config/equipmentTemperingSystem";

// In-memory state (would be DB-backed in production)
const smithyStates: Record<string, SmithyState> = {};

function getSmithyState(userId: string): SmithyState {
  if (!smithyStates[userId]) smithyStates[userId] = getDefaultSmithyState();
  return smithyStates[userId];
}

function setSmithyState(userId: string, state: SmithyState) {
  smithyStates[userId] = state;
}

export function registerSmithyRoutes(app: Express) {
  // Get full smithy state
  app.get("/api/smithy/status", (req: any, res) => {
    const userId = req.user?.id || "dev-user";
    const state = getSmithyState(userId);
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
  app.get("/api/smithy/materials", (req: any, res) => {
    const userId = req.user?.id || "dev-user";
    const state = getSmithyState(userId);
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
  app.get("/api/smithy/blueprints", (req: any, res) => {
    const userId = req.user?.id || "dev-user";
    const state = getSmithyState(userId);
    const blueprints = CRAFTING_BLUEPRINTS.map(bp => ({
      ...bp,
      isLearned: state.blueprints.includes(bp.id),
      canLearn: state.level >= bp.requiredSmithyLevel && !state.blueprints.includes(bp.id),
    }));
    res.json({ success: true, blueprints, learnedCount: state.blueprints.length });
  });

  // Temper equipment
  app.post("/api/smithy/temper", (req: any, res) => {
    const userId = req.user?.id || "dev-user";
    const { equipment, selectedSubStatIndex } = req.body;
    if (!equipment || selectedSubStatIndex === undefined) {
      return res.status(400).json({ message: "Missing equipment or selectedSubStatIndex" });
    }
    const state = getSmithyState(userId);
    const result = processTemper(state, equipment as EquipmentItem, selectedSubStatIndex);
    if (result.success) setSmithyState(userId, result.newState);
    res.json({ success: result.success, message: result.message, equipment: result.newEquipment });
  });

  // Masterwork equipment
  app.post("/api/smithy/masterwork", (req: any, res) => {
    const userId = req.user?.id || "dev-user";
    const { equipment } = req.body;
    if (!equipment) return res.status(400).json({ message: "Missing equipment" });
    const state = getSmithyState(userId);
    const result = processMasterwork(state, equipment as EquipmentItem);
    if (result.success) setSmithyState(userId, result.newState);
    res.json({ success: result.success, message: result.message, equipment: result.newEquipment });
  });

  // Salvage equipment
  app.post("/api/smithy/salvage", (req: any, res) => {
    const userId = req.user?.id || "dev-user";
    const { equipment } = req.body;
    if (!equipment) return res.status(400).json({ message: "Missing equipment" });
    const state = getSmithyState(userId);
    const result = processSalvage(state, equipment as EquipmentItem);
    setSmithyState(userId, result.newState);
    res.json({ success: true, credits: result.credits, materials: result.materials });
  });

  // Enchant equipment
  app.post("/api/smithy/enchant", (req: any, res) => {
    const userId = req.user?.id || "dev-user";
    const { equipmentId, enchantmentId } = req.body;
    if (!equipmentId || !enchantmentId) return res.status(400).json({ message: "Missing equipmentId or enchantmentId" });
    const state = getSmithyState(userId);
    const result = processEnchant(state, equipmentId, enchantmentId);
    if (result.success) setSmithyState(userId, result.newState);
    res.json({ success: result.success, message: result.message });
  });

  // Learn blueprint
  app.post("/api/smithy/learn-blueprint", (req: any, res) => {
    const userId = req.user?.id || "dev-user";
    const { blueprintId } = req.body;
    if (!blueprintId) return res.status(400).json({ message: "Missing blueprintId" });
    const state = getSmithyState(userId);
    const result = processLearnBlueprint(state, blueprintId, 0);
    if (result.success) setSmithyState(userId, result.newState);
    res.json({ success: result.success, message: result.message });
  });

  // Get smithy stats
  app.get("/api/smithy/stats", (req: any, res) => {
    const userId = req.user?.id || "dev-user";
    const state = getSmithyState(userId);
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