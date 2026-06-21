import { SCHEDULER_CONFIG } from "../../shared/config/xenoberage/schedulerConfig";
import { processPlanetProduction, applyResourceLimits } from "./resourceProductionSystem";
import { regeneratePortResources } from "./portTradingSystem";
import { processColonistTick } from "./colonizationSystem";
import { processDefenseDegrade, processSectorFighters } from "./defenseSystem";
import { processApocalypse } from "./apocalypseSystem";
import { processIGBTick } from "./igbSystem";
import { updateRankings, calculatePlayerScore } from "./rankingSystem";
import { db } from "../db";
import { eq, and, desc } from "drizzle-orm";
import { playerStates, users } from "../../shared/schema";

export class SchedulerSystem {
  private lastRunTimes: Record<string, number> = {};

  /**
   * Main scheduler tick - orchestrates all game systems.
   */
  async processTick(): Promise<void> {
    const now = Date.now();

    if (this.shouldRun(SCHEDULER_CONFIG.schedTurns, this.lastRunTimes.turns)) {
      await this.processTurns();
      this.lastRunTimes.turns = now;
    }

    if (this.shouldRun(SCHEDULER_CONFIG.schedPorts, this.lastRunTimes.ports)) {
      await this.processPortProduction();
      this.lastRunTimes.ports = now;
    }

    if (this.shouldRun(SCHEDULER_CONFIG.schedPlanets, this.lastRunTimes.planets)) {
      await this.processPlanetProduction();
      this.lastRunTimes.planets = now;
    }

    if (this.shouldRun(SCHEDULER_CONFIG.schedIgb, this.lastRunTimes.igb)) {
      await this.processIGB();
      this.lastRunTimes.igb = now;
    }

    if (this.shouldRun(SCHEDULER_CONFIG.schedRanking, this.lastRunTimes.ranking)) {
      await this.processRanking();
      this.lastRunTimes.ranking = now;
    }

    if (this.shouldRun(SCHEDULER_CONFIG.schedNews, this.lastRunTimes.news)) {
      await this.processNews();
      this.lastRunTimes.news = now;
    }

    if (this.shouldRun(SCHEDULER_CONFIG.schedDegrade, this.lastRunTimes.degrade)) {
      await this.processDefenseDegrade();
      this.lastRunTimes.degrade = now;
    }

    if (this.shouldRun(SCHEDULER_CONFIG.schedApocalypse, this.lastRunTimes.apocalypse)) {
      await this.processApocalypse();
      this.lastRunTimes.apocalypse = now;
    }

    if (this.shouldRun(SCHEDULER_CONFIG.schedTheGovernor, this.lastRunTimes.governor)) {
      await this.processGovernor();
      this.lastRunTimes.governor = now;
    }

    if (this.shouldRun(SCHEDULER_CONFIG.schedEmpire, this.lastRunTimes.empire)) {
      await this.processEmpire();
      this.lastRunTimes.empire = now;
    }
  }

  /**
   * Generate turns for all active players.
   */
  async processTurns(): Promise<void> {
    try {
      const activePlayers = await db
        .select({ id: playerStates.id, turnsData: playerStates.turnsData, currentTurns: playerStates.currentTurns })
        .from(playerStates)
        .innerJoin(users, eq(playerStates.userId, users.id))
        .where(desc(playerStates.updatedAt))
        .limit(200);

      for (const player of activePlayers) {
        const turnsData = (player.turnsData as any) || {};
        const currentAvailable = turnsData.availableTurns || player.currentTurns || 0;
        const newTurns = SCHEDULER_CONFIG.turnsPerTick;
        const maxTurns = 10000;
        const updatedAvailable = Math.min(maxTurns, currentAvailable + newTurns);

        await db
          .update(playerStates)
          .set({
            turnsData: { ...turnsData, availableTurns: updatedAvailable, lastTurnTimestamp: Date.now() },
            currentTurns: updatedAvailable,
            totalTurns: (player.turnsData as any)?.totalTurnsGenerated ? (player.turnsData as any).totalTurnsGenerated + newTurns : newTurns,
            updatedAt: new Date(),
          })
          .where(eq(playerStates.id, player.id));
      }
    } catch (error) {
      console.error("[Scheduler] processTurns error:", error);
    }
  }

  /**
   * Process port resource regeneration.
   */
  async processPortProduction(): Promise<void> {
    try {
      const activePlayers = await db
        .select({ id: playerStates.id, resources: playerStates.resources })
        .from(playerStates)
        .innerJoin(users, eq(playerStates.userId, users.id))
        .where(desc(playerStates.updatedAt))
        .limit(200);

      for (const player of activePlayers) {
        const resources = (player.resources as any) || {};
        const regenResources = regeneratePortResources({
          ore: resources.metal || 0,
          organics: resources.crystal || 0,
          goods: resources.deuterium || 0,
          energy: resources.energy || 0,
        });

        await db
          .update(playerStates)
          .set({
            resources: { ...resources, metal: regenResources.ore, crystal: regenResources.organics, deuterium: regenResources.goods, energy: regenResources.energy },
            updatedAt: new Date(),
          })
          .where(eq(playerStates.id, player.id));
      }
    } catch (error) {
      console.error("[Scheduler] processPortProduction error:", error);
    }
  }

  /**
   * Process planet production for all owned planets.
   */
  async processPlanetProduction(): Promise<void> {
    try {
      const activePlayers = await db
        .select({ id: playerStates.id, resources: playerStates.resources, buildings: playerStates.buildings })
        .from(playerStates)
        .innerJoin(users, eq(playerStates.userId, users.id))
        .where(desc(playerStates.updatedAt))
        .limit(200);

      for (const player of activePlayers) {
        const resources = (player.resources as any) || {};
        const buildings = (player.buildings as any) || {};

        const produced = processPlanetProduction({
          level: 1,
          prodOre: buildings.metalMine || 0,
          prodOrganics: buildings.crystalMine || 0,
          prodGoods: buildings.deuteriumSynthesizer || 0,
          prodEnergy: buildings.solarPlant || 0,
          prodFighters: 0,
          prodTorpedoes: 0,
          credits: resources.credits || 0,
        });

        const newResources = applyResourceLimits({
          ...resources,
          metal: (resources.metal || 0) + produced.ore,
          crystal: (resources.crystal || 0) + produced.organics,
          deuterium: (resources.deuterium || 0) + produced.goods,
          energy: produced.energy,
          fighters: produced.fighters || 0,
          torpedoes: produced.torpedoes || 0,
          credits: produced.credits,
        });

        await db
          .update(playerStates)
          .set({ resources: newResources, lastResourceUpdate: new Date(), updatedAt: new Date() })
          .where(eq(playerStates.id, player.id));
      }
    } catch (error) {
      console.error("[Scheduler] processPlanetProduction error:", error);
    }
  }

  /**
   * Process IGB interest for all accounts.
   */
  async processIGB(): Promise<void> {
    try {
      const activePlayers = await db
        .select({ id: playerStates.id, resources: playerStates.resources })
        .from(playerStates)
        .innerJoin(users, eq(playerStates.userId, users.id))
        .where(desc(playerStates.updatedAt))
        .limit(200);

      for (const player of activePlayers) {
        const resources = (player.resources as any) || {};
        const credits = resources.credits || 0;
        const interestRate = 1.001;
        const newCredits = Math.floor(credits * interestRate);

        if (newCredits !== credits) {
          await db
            .update(playerStates)
            .set({ resources: { ...resources, credits: newCredits }, updatedAt: new Date() })
            .where(eq(playerStates.id, player.id));
        }
      }
    } catch (error) {
      console.error("[Scheduler] processIGB error:", error);
    }
  }

  /**
   * Update player rankings.
   */
  async processRanking(): Promise<void> {
    try {
      const allPlayers = await db
        .select({ id: playerStates.id, userId: playerStates.userId, resources: playerStates.resources, empireLevel: playerStates.empireLevel, units: playerStates.units })
        .from(playerStates)
        .innerJoin(users, eq(playerStates.userId, users.id));

      const playerScores = allPlayers.map((p) => {
        const resources = (p.resources as any) || {};
        const units = (p.units as any) || {};
        const fleetStrength = Object.values(units).reduce((sum: number, count: any) => sum + (typeof count === "number" ? count : 0), 0);
        return {
          userId: p.userId,
          score: calculatePlayerScore({
            resources: { credits: resources.credits || 0, ore: resources.metal || 0, goods: resources.deuterium || 0, organics: resources.crystal || 0 },
            empireLevel: p.empireLevel || 1,
            fleetStrength,
            planetCount: 1,
            techLevel: 1,
            colonies: 0,
          }),
          empireValue: 0,
          rank: 0,
        };
      });

      const ranked = await updateRankings(playerScores);
      const rankMap = new Map(ranked.map((r) => [r.userId, r.rank]));

      for (const player of allPlayers) {
        const rank = rankMap.get(player.userId) || 0;
        await db
          .update(playerStates)
          .set({ empireExperience: rank * 100, updatedAt: new Date() })
          .where(eq(playerStates.id, player.id));
      }
    } catch (error) {
      console.error("[Scheduler] processRanking error:", error);
    }
  }

  /**
   * Generate news events.
   */
  async processNews(): Promise<void> {
    try {
      const events: string[] = [];
      const recentBattles = await db
        .select()
        .from(playerStates)
        .where(desc(playerStates.updatedAt))
        .limit(5);

      if (recentBattles.length > 0) {
        events.push(`${recentBattles.length} empires updated their production cycles.`);
      }

      console.log(`[Scheduler] News tick: ${events.length} events generated`);
    } catch (error) {
      console.error("[Scheduler] processNews error:", error);
    }
  }

  /**
   * Process defense degradation for unsupported sectors.
   */
  async processDefenseDegrade(): Promise<void> {
    try {
      const activePlayers = await db
        .select({ id: playerStates.id, units: playerStates.units, buildings: playerStates.buildings })
        .from(playerStates)
        .innerJoin(users, eq(playerStates.userId, users.id))
        .where(desc(playerStates.updatedAt))
        .limit(200);

      for (const player of activePlayers) {
        const units = (player.units as any) || {};
        const buildings = (player.buildings as any) || {};
        const hasPlanetOwner = Object.keys(buildings).length > 0;

        const degraded = processDefenseDegrade({
          fighters: units.fighters || 0,
          mines: units.mines || 0,
          hasPlanetOwner,
        });

        if (degraded.fighters !== (units.fighters || 0) || degraded.mines !== (units.mines || 0)) {
          await db
            .update(playerStates)
            .set({ units: { ...units, fighters: degraded.fighters, mines: degraded.mines }, updatedAt: new Date() })
            .where(eq(playerStates.id, player.id));
        }
      }
    } catch (error) {
      console.error("[Scheduler] processDefenseDegrade error:", error);
    }
  }

  /**
   * Process random apocalypse events.
   */
  async processApocalypse(): Promise<void> {
    try {
      const events = await processApocalypse(Date.now());
      if (events.length > 0) {
        console.log(`[Scheduler] Apocalypse: ${events.map((e) => e.description).join(", ")}`);
      }
    } catch (error) {
      console.error("[Scheduler] processApocalypse error:", error);
    }
  }

  /**
   * Governor cleanup - fix out-of-bound values.
   */
  async processGovernor(): Promise<void> {
    try {
      const activePlayers = await db
        .select({ id: playerStates.id, resources: playerStates.resources, currentTurns: playerStates.currentTurns })
        .from(playerStates)
        .innerJoin(users, eq(playerStates.userId, users.id))
        .where(desc(playerStates.updatedAt))
        .limit(200);

      for (const player of activePlayers) {
        const resources = (player.resources as any) || {};
        const clamped = applyResourceLimits(resources);
        const currentTurns = Math.max(0, player.currentTurns || 0);

        if (JSON.stringify(clamped) !== JSON.stringify(resources) || currentTurns !== player.currentTurns) {
          await db
            .update(playerStates)
            .set({ resources: clamped, currentTurns, updatedAt: new Date() })
            .where(eq(playerStates.id, player.id));
        }
      }
    } catch (error) {
      console.error("[Scheduler] processGovernor error:", error);
    }
  }

  /**
   * Process empire updates.
   */
  async processEmpire(): Promise<void> {
    try {
      const activePlayers = await db
        .select({ id: playerStates.id, empireLevel: playerStates.empireLevel, empireExperience: playerStates.empireExperience })
        .from(playerStates)
        .innerJoin(users, eq(playerStates.userId, users.id))
        .where(desc(playerStates.updatedAt))
        .limit(200);

      for (const player of activePlayers) {
        const expNeeded = (player.empireLevel || 1) * 1000;
        const currentExp = Number(player.empireExperience || 0);

        if (currentExp >= expNeeded) {
          await db
            .update(playerStates)
            .set({ empireLevel: (player.empireLevel || 1) + 1, updatedAt: new Date() })
            .where(eq(playerStates.id, player.id));
        }
      }
    } catch (error) {
      console.error("[Scheduler] processEmpire error:", error);
    }
  }

  /**
   * Check if a scheduler event should run based on interval and last run time.
   */
  shouldRun(schedulerRateMinutes: number, lastRun?: number): boolean {
    if (!lastRun) return true;
    const elapsed = Date.now() - lastRun;
    const intervalMs = schedulerRateMinutes * 60 * 1000;
    return elapsed >= intervalMs;
  }
}
