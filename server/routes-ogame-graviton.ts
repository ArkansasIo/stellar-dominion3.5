import { isAuthenticated } from "./basicAuth";
import { db } from "./db";
import { eq, sql } from "drizzle-orm";
import { playerStates } from "../shared/schema";
import { OGAME_CATALOG_ENTRY_MAP } from "../shared/config/ogameCatalogConfig";
import type { Express } from "express";

const GRAVITON_ENTRY = OGAME_CATALOG_ENTRY_MAP.gravitonTech;

interface GravitonProject {
  id: string;
  name: string;
  description: string;
  gravitonLevelRequired: number;
  cost: { metal: number; crystal: number; deuterium: number };
  unlocks: string;
}

const GRAVITON_PROJECTS: GravitonProject[] = [
  {
    id: "deathstarConstruction",
    name: "Deathstar Construction",
    description: "Authorize the construction of Deathstar vessels. Requires Graviton Tech level 1.",
    gravitonLevelRequired: 1,
    cost: { metal: 5000000, crystal: 4000000, deuterium: 1000000 },
    unlocks: "deathstar",
  },
  {
    id: "gravitonShield",
    name: "Graviton Shield Matrix",
    description: "Advanced shielding using graviton fields. +10% shield strength for all ships. Requires Graviton Tech level 3.",
    gravitonLevelRequired: 3,
    cost: { metal: 8000000, crystal: 6000000, deuterium: 2000000 },
    unlocks: "shieldBonus",
  },
  {
    id: "gravitonWeapon",
    name: "Graviton Beam Cannon",
    description: "Weaponized graviton technology. +10% attack power for all ships. Requires Graviton Tech level 5.",
    gravitonLevelRequired: 5,
    cost: { metal: 12000000, crystal: 8000000, deuterium: 4000000 },
    unlocks: "weaponBonus",
  },
  {
    id: "gravitonDrive",
    name: "Graviton Propulsion",
    description: "Harness gravity for faster-than-light travel. +15% fleet speed. Requires Graviton Tech level 8.",
    gravitonLevelRequired: 8,
    cost: { metal: 20000000, crystal: 15000000, deuterium: 8000000 },
    unlocks: "speedBonus",
  },
];

export function registerOGameGravitonRoutes(app: Express) {
  app.get("/api/ogame/graviton/status", isAuthenticated as any, async (req: any, res: any) => {
    try {
      const userId = req.session?.userId;
      if (!userId) return res.status(401).json({ error: "Not authenticated" });

      const [state] = await db.select().from(playerStates).where(eq(playerStates.userId, userId)).limit(1);
      if (!state) return res.status(404).json({ error: "Player state not found" });

      const research = (state.research as any) ?? {};
      const gravitonLevel = research.gravitonTech ?? 0;
      const completedProjects: string[] = (state.gravitonProjects as string[]) ?? [];

      const available = GRAVITON_PROJECTS.filter(
        (p) => gravitonLevel >= p.gravitonLevelRequired && !completedProjects.includes(p.id)
      );
      const completed = GRAVITON_PROJECTS.filter((p) => completedProjects.includes(p.id));

      res.json({ gravitonLevel, available, completed });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/ogame/graviton/complete-project", isAuthenticated as any, async (req: any, res: any) => {
    try {
      const userId = req.session?.userId;
      if (!userId) return res.status(401).json({ error: "Not authenticated" });

      const [state] = await db.select().from(playerStates).where(eq(playerStates.userId, userId)).limit(1);
      if (!state) return res.status(404).json({ error: "Player state not found" });

      const { projectId } = req.body;
      if (!projectId) return res.status(400).json({ error: "Project ID required" });

      const project = GRAVITON_PROJECTS.find((p) => p.id === projectId);
      if (!project) return res.status(400).json({ error: "Unknown project" });

      const research = (state.research as any) ?? {};
      const gravitonLevel = research.gravitonTech ?? 0;
      if (gravitonLevel < project.gravitonLevelRequired) {
        return res.status(400).json({
          error: `Graviton Tech level ${project.gravitonLevelRequired} required (have ${gravitonLevel})`,
        });
      }

      const completedProjects: string[] = (state.gravitonProjects as string[]) ?? [];
      if (completedProjects.includes(projectId)) {
        return res.status(400).json({ error: "Project already completed" });
      }

      const resources = (state.resources as any) ?? {};
      if ((resources.metal ?? 0) < project.cost.metal) return res.status(400).json({ error: `Not enough metal (need ${project.cost.metal})` });
      if ((resources.crystal ?? 0) < project.cost.crystal) return res.status(400).json({ error: `Not enough crystal (need ${project.cost.crystal})` });
      if ((resources.deuterium ?? 0) < project.cost.deuterium) return res.status(400).json({ error: `Not enough deuterium (need ${project.cost.deuterium})` });

      const newCompletedProjects = [...completedProjects, projectId];
      const stateKey = "gravitonProjects" as const;

      await db.update(playerStates)
        .set({
          [stateKey]: sql`jsonb_set(COALESCE(${sql.raw("gravitonProjects")}, '[]'::jsonb), '{}', ${JSON.stringify(newCompletedProjects)}::jsonb)`,
          resources: sql`jsonb_set(COALESCE(resources, '{}'::jsonb), '{}', ${JSON.stringify({
            ...resources,
            metal: (resources.metal ?? 0) - project.cost.metal,
            crystal: (resources.crystal ?? 0) - project.cost.crystal,
            deuterium: (resources.deuterium ?? 0) - project.cost.deuterium,
          })}::jsonb)`,
        })
        .where(eq(playerStates.userId, userId));

      res.json({
        success: true,
        project: project.id,
        unlocks: project.unlocks,
        message: `Completed project: ${project.name}. ${project.unlocks === "deathstar" ? "You can now build Deathstars!" : ""}`,
      });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });
}
