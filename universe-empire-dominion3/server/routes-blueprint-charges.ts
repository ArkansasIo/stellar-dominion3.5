import type { Express, Request, Response } from "express";
import { pool } from "./db";
import {
  BLUEPRINT_DEFINITIONS,
  CHARGE_CONFIG,
  PRINTER_CONFIG,
  getBlueprintDefinition,
  createBlueprintInstance,
  useCharge,
  repairBlueprint,
  calculateRepairCost,
  type BlueprintInstance,
  type PrinterJob,
} from "../shared/config/blueprintChargeSystem";
import { isAuthenticated } from "./basicAuth";

function getUserId(req: Request): string {
  return req.session?.userId as string;
}

export function registerBlueprintChargeRoutes(app: Express) {
  // GET /api/blueprint-charges/config - All blueprint definitions
  app.get("/api/blueprint-charges/config", (_req: Request, res: Response) => {
    res.json({ success: true, definitions: BLUEPRINT_DEFINITIONS, chargeConfig: CHARGE_CONFIG, printerConfig: PRINTER_CONFIG });
  });

  // GET /api/blueprint-charges - Player's blueprint instances
  app.get("/api/blueprint-charges", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const result = await pool.query(
        "SELECT * FROM blueprint_instances WHERE user_id = $1 ORDER BY created_at DESC",
        [userId]
      );
      const printerResult = await pool.query(
        "SELECT * FROM blueprint_printer_levels WHERE user_id = $1",
        [userId]
      );
      const jobsResult = await pool.query(
        "SELECT * FROM blueprint_printer_jobs WHERE user_id = $1 AND status IN ('queued', 'printing') ORDER BY created_at",
        [userId]
      );
      res.json({
        success: true,
        blueprints: result.rows,
        printer: printerResult.rows[0] || { printer_level: 1, printer_xp: 0, total_printed: 0, total_repaired: 0 },
        activeJobs: jobsResult.rows,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // POST /api/blueprint-charges/print - Start printing a blueprint
  app.post("/api/blueprint-charges/print", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const { blueprintDefinitionId } = req.body;

      const def = getBlueprintDefinition(blueprintDefinitionId);
      if (!def) return res.status(400).json({ message: "Unknown blueprint" });

      const printerResult = await pool.query("SELECT * FROM blueprint_printer_levels WHERE user_id = $1", [userId]);
      const printer = printerResult.rows[0] || { printer_level: 1 };
      if (printer.printer_level < def.unlockLevel) {
        return res.status(400).json({ message: `Requires printer level ${def.unlockLevel}` });
      }

      const activeJobs = await pool.query(
        "SELECT COUNT(*) as count FROM blueprint_printer_jobs WHERE user_id = $1 AND status IN ('queued', 'printing')",
        [userId]
      );
      if (parseInt(activeJobs.rows[0].count) >= PRINTER_CONFIG.maxConcurrentJobs) {
        return res.status(400).json({ message: `Max ${PRINTER_CONFIG.maxConcurrentJobs} concurrent jobs` });
      }

      const jobId = `pj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const printTime = Math.floor(def.craftingTimeSeconds / (1 + (printer.printer_level - 1) * PRINTER_CONFIG.efficiencyBonusPerLevel));
      const completeAt = new Date(Date.now() + printTime * 1000);

      await pool.query(
        `INSERT INTO blueprint_printer_jobs (id, user_id, blueprint_definition_id, status, started_at, complete_at, progress, quality, created_at)
         VALUES ($1, $2, $3, 'printing', now(), $4, 0, $5, now())`,
        [jobId, userId, blueprintDefinitionId, completeAt, def.baseQuality + PRINTER_CONFIG.qualityBonusPerLevel * (printer.printer_level - 1)]
      );

      res.json({ success: true, jobId, completeAt, printTimeSeconds: printTime });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // POST /api/blueprint-charges/collect/:jobId - Collect printed blueprint
  app.post("/api/blueprint-charges/collect/:jobId", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const { jobId } = req.params;

      const jobResult = await pool.query(
        "SELECT * FROM blueprint_printer_jobs WHERE id = $1 AND user_id = $2",
        [jobId, userId]
      );
      if (jobResult.rows.length === 0) return res.status(404).json({ message: "Job not found" });

      const job = jobResult.rows[0] as PrinterJob;
      if (job.status !== "printing" || !job.completeAt || new Date(job.completeAt) > new Date()) {
        return res.status(400).json({ message: "Job not ready" });
      }

      const def = getBlueprintDefinition(job.blueprintDefinitionId);
      if (!def) return res.status(400).json({ message: "Blueprint definition not found" });

      const printerResult = await pool.query("SELECT * FROM blueprint_printer_levels WHERE user_id = $1", [userId]);
      const printer = printerResult.rows[0] || { printer_level: 1 };

      const instance = createBlueprintInstance(def, userId, printer.printer_level);
      await pool.query(
        `INSERT INTO blueprint_instances (id, user_id, blueprint_definition_id, name, category, rarity, level, max_charges, current_charges, status, quality, material_efficiency, time_efficiency, total_uses, created_at, updated_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)`,
        [instance.id, instance.userId, instance.blueprintDefinitionId, instance.name, instance.category, instance.rarity, instance.level, instance.maxCharges, instance.currentCharges, instance.status, instance.quality, instance.materialEfficiency, instance.timeEfficiency, instance.totalUses, instance.createdAt, instance.updatedAt]
      );

      await pool.query("UPDATE blueprint_printer_jobs SET status = 'completed', progress = 100 WHERE id = $1", [jobId]);

      const printerUpdate = await pool.query(
        `UPDATE blueprint_printer_levels SET printer_xp = printer_xp + $2, total_printed = total_printed + 1, updated_at = now()
         WHERE user_id = $1 RETURNING *`,
        [userId, Math.floor(10 + def.baseQuality * 20)]
      );

      res.json({ success: true, blueprint: instance, printer: printerUpdate.rows[0] });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // POST /api/blueprint-charges/use/:blueprintId - Use a charge
  app.post("/api/blueprint-charges/use/:blueprintId", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const { blueprintId } = req.params;

      const result = await pool.query(
        "SELECT * FROM blueprint_instances WHERE id = $1 AND user_id = $2",
        [blueprintId, userId]
      );
      if (result.rows.length === 0) return res.status(404).json({ message: "Blueprint not found" });

      const bp = result.rows[0] as BlueprintInstance;
      if (bp.status === "depleted" || bp.status === "broken") {
        return res.status(400).json({ message: "Blueprint cannot be used" });
      }
      if (bp.currentCharges <= 0) {
        return res.status(400).json({ message: "No charges remaining" });
      }

      const updated = useCharge(bp);
      await pool.query(
        "UPDATE blueprint_instances SET current_charges = $2, quality = $3, status = $4, total_uses = total_uses + 1, updated_at = now() WHERE id = $1",
        [blueprintId, updated.currentCharges, updated.quality, updated.status]
      );

      res.json({ success: true, blueprint: updated, chargesRemaining: updated.currentCharges });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // POST /api/blueprint-charges/repair/:blueprintId - Repair charges
  app.post("/api/blueprint-charges/repair/:blueprintId", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const { blueprintId } = req.params;
      const { chargesToRepair } = req.body;

      const result = await pool.query(
        "SELECT * FROM blueprint_instances WHERE id = $1 AND user_id = $2",
        [blueprintId, userId]
      );
      if (result.rows.length === 0) return res.status(404).json({ message: "Blueprint not found" });

      const bp = result.rows[0] as BlueprintInstance;
      const repairCount = Math.max(1, chargesToRepair || 1);
      const updated = repairBlueprint(bp, repairCount);

      await pool.query(
        "UPDATE blueprint_instances SET current_charges = $2, status = 'active', updated_at = now() WHERE id = $1",
        [blueprintId, updated.currentCharges]
      );

      const printerUpdate = await pool.query(
        "UPDATE blueprint_printer_levels SET total_repaired = total_repaired + $2, updated_at = now() WHERE user_id = $1 RETURNING *",
        [userId, updated.currentCharges - bp.currentCharges]
      );

      res.json({ success: true, blueprint: updated, printer: printerUpdate.rows[0] });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // POST /api/blueprint-charges/scrap/:blueprintId - Scrap a depleted blueprint
  app.post("/api/blueprint-charges/scrap/:blueprintId", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const { blueprintId } = req.params;

      const result = await pool.query(
        "DELETE FROM blueprint_instances WHERE id = $1 AND user_id = $2 RETURNING *",
        [blueprintId, userId]
      );
      if (result.rows.length === 0) return res.status(404).json({ message: "Blueprint not found" });

      res.json({ success: true, scrapped: result.rows[0] });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // GET /api/blueprint-charges/printer - Get printer status
  app.get("/api/blueprint-charges/printer", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const result = await pool.query(
        "SELECT * FROM blueprint_printer_levels WHERE user_id = $1",
        [userId]
      );
      const printer = result.rows[0] || { printer_level: 1, printer_xp: 0, total_printed: 0, total_repaired: 0 };
      const xpNeeded = printer.printer_level * 100;
      res.json({ success: true, printer, xpNeeded, xpProgress: printer.printer_xp % xpNeeded });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });
}
