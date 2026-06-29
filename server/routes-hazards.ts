import type { Express, Request, Response } from "express";
import { isAuthenticated } from "./basicAuth";
import { storage } from "./storage";
import { ALL_PLANET_TYPES } from "../Source/Shared/config/planetTypesConfig";
import { HAZARD_TYPES, assessPlanetHazards, type HazardSeverity } from "../Source/Shared/config/hazardSystemConfig";

function getUserId(req: Request): string {
  return (req.session as any)?.userId || "";
}

const SEVERITY_ORDER: HazardSeverity[] = ["none", "low", "moderate", "high", "extreme", "lethal"];

export function registerHazardRoutes(app: Express) {
  app.get("/api/hazards/config", (_req: Request, res: Response) => {
    res.json({
      success: true,
      hazardTypes: Object.values(HAZARD_TYPES).map((h) => ({
        id: h.id,
        name: h.name,
        icon: h.icon,
        description: h.description,
        severityLevels: h.thresholds.map((t) => t.severity),
      })),
    });
  });

  app.get("/api/hazards/planet-types", (_req: Request, res: Response) => {
    const assessments = ALL_PLANET_TYPES.map((pt) => {
      const assessment = assessPlanetHazards(
        pt.id,
        pt.name,
        pt.stats,
        pt.dangers || [],
      );
      return {
        id: pt.id,
        name: pt.name,
        family: pt.family,
        class: pt.class,
        rarity: pt.rarity,
        overallSeverity: assessment.overallSeverity,
        overallProductionMalus: assessment.overallProductionMalus,
        overallGrowthPenalty: assessment.overallGrowthPenalty,
        overallHappinessPenalty: assessment.overallHappinessPenalty,
        hazardCount: assessment.hazards.filter((h) => h.severity !== "none").length,
        safeForColonization: assessment.safeForColonization,
        topHazards: assessment.hazards
          .filter((h) => h.severity !== "none")
          .sort((a, b) => SEVERITY_ORDER.indexOf(b.severity) - SEVERITY_ORDER.indexOf(a.severity))
          .slice(0, 3)
          .map((h) => ({ type: h.type, name: h.name, severity: h.severity })),
      };
    });

    const bySeverity: Record<string, number> = {};
    for (const a of assessments) {
      bySeverity[a.overallSeverity] = (bySeverity[a.overallSeverity] || 0) + 1;
    }

    res.json({
      success: true,
      total: assessments.length,
      assessments,
      bySeverity,
      safeCount: assessments.filter((a) => a.safeForColonization).length,
      lethalCount: assessments.filter((a) => !a.safeForColonization).length,
    });
  });

  app.get("/api/hazards/planet-type/:id", (req: Request, res: Response) => {
    const id = req.params.id;
    const pt = ALL_PLANET_TYPES.find((p) => p.id === id);
    if (!pt) {
      return res.status(404).json({ success: false, message: "Planet type not found" });
    }

    const assessment = assessPlanetHazards(pt.id, pt.name, pt.stats, pt.dangers || []);

    res.json({
      success: true,
      assessment,
    });
  });

  app.get("/api/hazards/empire", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const state = await storage.getPlayerState(userId);
      if (!state) {
        return res.status(404).json({ success: false, message: "Player state not found" });
      }

      const buildings = (state.buildings || {}) as Record<string, number>;
      const research = (state.research || {}) as Record<string, number>;

      const hazardMitigationLevel = {
        radiation: (buildings.radiationShielding ?? 0) + (research.radiationTech ?? 0) * 0.5,
        seismic: (buildings.seismicDampener ?? 0) + (research.geologyTech ?? 0) * 0.5,
        storm: (buildings.stormShield ?? 0) + (research.atmosphericTech ?? 0) * 0.5,
        toxic: (buildings.airScrubber ?? 0) + (research.chemicalTech ?? 0) * 0.5,
        thermal: (buildings.thermalControl ?? 0) + (research.thermalTech ?? 0) * 0.5,
        gravity: (buildings.gravityGenerator ?? 0) + (research.gravityTech ?? 0) * 0.5,
        magnetic: (buildings.emShield ?? 0) + (research.magneticTech ?? 0) * 0.5,
        biological: (buildings.bioFilter ?? 0) + (research.bioTech ?? 0) * 0.5,
      };

      res.json({
        success: true,
        mitigationLevel: hazardMitigationLevel,
        totalMitigationPower: Object.values(hazardMitigationLevel).reduce((a, b) => a + b, 0),
      });
    } catch (error) {
      console.error("[hazards/empire]", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });
}
