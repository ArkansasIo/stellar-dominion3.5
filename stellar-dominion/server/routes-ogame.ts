import { Router } from "express";
import {
  calculateOgameCombatRating,
  calculateOgameCost,
  calculateOgameProduction,
  getOgameCatalogGrouped,
  getOgameCategories,
  getOgameEntries,
  getOgameEntryById,
  getUnlockState,
  seedOgameCatalogIfNeeded,
} from "./services/ogameCatalogService";

const router = Router();

router.post("/seed", async (_req, res) => {
  try {
    const result = await seedOgameCatalogIfNeeded();
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

router.get("/categories", async (_req, res) => {
  try {
    const categories = await getOgameCategories();
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

router.get("/catalog", async (_req, res) => {
  try {
    const catalog = await getOgameCatalogGrouped();
    res.json({ success: true, data: catalog });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

router.get("/entries", async (req, res) => {
  try {
    const moonOnlyRaw = req.query.moonOnly;
    const moonOnly =
      typeof moonOnlyRaw === "string"
        ? moonOnlyRaw.toLowerCase() === "true"
        : undefined;

    const entries = await getOgameEntries({
      categoryId: typeof req.query.categoryId === "string" ? req.query.categoryId : undefined,
      entryType: typeof req.query.entryType === "string" ? req.query.entryType : undefined,
      search: typeof req.query.search === "string" ? req.query.search : undefined,
      moonOnly,
    });

    res.json({ success: true, data: entries });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

router.get("/entries/:entryId", async (req, res) => {
  try {
    const entry = await getOgameEntryById(req.params.entryId);
    if (!entry) {
      return res.status(404).json({ success: false, error: "Entry not found" });
    }

    res.json({ success: true, data: entry });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

router.post("/simulate/cost", async (req, res) => {
  try {
    const entryId = String(req.body?.entryId || "");
    const level = Number(req.body?.level || 1);
    const quantity = Number(req.body?.quantity || 1);

    if (!entryId) {
      return res.status(400).json({ success: false, error: "entryId is required" });
    }

    const entry = await getOgameEntryById(entryId);
    if (!entry) {
      return res.status(404).json({ success: false, error: "Entry not found" });
    }

    const cost = calculateOgameCost(entry, level, quantity);

    res.json({
      success: true,
      data: {
        entryId,
        level: Math.max(1, Math.floor(level)),
        quantity: Math.max(1, Math.floor(quantity)),
        cost,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

router.post("/simulate/production", (req, res) => {
  try {
    const buildings = (req.body?.buildings || {}) as Record<string, number>;
    const research = (req.body?.research || {}) as Record<string, number>;

    const production = calculateOgameProduction(buildings, research);

    res.json({ success: true, data: production });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
});

router.post("/simulate/combat", (req, res) => {
  try {
    const fleet = (req.body?.fleet || {}) as Record<string, number>;
    const research = (req.body?.research || {}) as Record<string, number>;

    const combat = calculateOgameCombatRating(fleet, research);

    res.json({ success: true, data: combat });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
});

router.post("/simulate/unlocks", (req, res) => {
  try {
    const levels = (req.body?.levels || {}) as Record<string, number>;
    const unlocks = getUnlockState(levels);

    res.json({ success: true, data: unlocks });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
});

export default router;
