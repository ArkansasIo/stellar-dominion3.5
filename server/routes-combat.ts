import { Router } from "express";
import { db } from "./db";
import { battles, playerStates, users } from "../shared/schema";
import { desc, eq, inArray, or } from "drizzle-orm";
import { simulateBattle, calculateVictoryResources } from "./combatEngine";
import { isAuthenticated as authenticateRequest } from "./basicAuth";
import type { Request, Response } from "express";
import {
  BATTLE_SYSTEM_PROFILES,
  COMBAT_EFFECT_LIBRARY,
  buildProgressionSnapshot,
  getTierForLevel,
  type BattleMode,
} from "@shared/config";
import { getKardashevOperationalBonusesForPlayer } from "@shared/config/kardashevOperationalBonuses";

function toUnitCountMap(units: Record<string, any>): Record<string, number> {
  return Object.entries(units || {}).reduce((acc, [unitType, value]) => {
    if (typeof value === "number") {
      acc[unitType] = value;
      return acc;
    }

    if (typeof value === "object" && value && typeof (value as any).count === "number") {
      acc[unitType] = (value as any).count;
      return acc;
    }

    acc[unitType] = 0;
    return acc;
  }, {} as Record<string, number>);
}

function calculateUnitLosses(startUnits: Record<string, number>, remainingUnits: Record<string, number>): Record<string, number> {
  const allUnitTypes = new Set([...Object.keys(startUnits || {}), ...Object.keys(remainingUnits || {})]);
  const losses: Record<string, number> = {};

  for (const unitType of Array.from(allUnitTypes)) {
    const started = startUnits[unitType] ?? 0;
    const remaining = remainingUnits[unitType] ?? 0;
    losses[unitType] = Math.max(0, started - remaining);
  }

  return losses;
}

function toPlayerCombatLevel(research: Record<string, any>, shipyardLevel: number) {
  const techSignal =
    Number(research.weaponsTech || 0) +
    Number(research.shieldingTech || 0) +
    Number(research.armourTech || 0) +
    Number(research.militaryTech || 0) +
    Number(research.defenseTech || 0);
  const level = Math.max(1, Math.min(999, Math.floor(1 + techSignal * 6 + shipyardLevel * 4)));
  return level;
}

function getBattleProfile(mode: BattleMode) {
  return BATTLE_SYSTEM_PROFILES.find((profile) => profile.mode === mode) || BATTLE_SYSTEM_PROFILES[0];
}

function normalizePositiveUnitMap(rawUnits: unknown): Record<string, number> {
  if (!rawUnits || typeof rawUnits !== "object") return {};
  const normalized: Record<string, number> = {};
  for (const [unitType, rawValue] of Object.entries(rawUnits as Record<string, unknown>)) {
    const count = Math.max(0, Math.floor(Number(rawValue) || 0));
    if (count > 0) normalized[unitType] = count;
  }
  return normalized;
}

function applyBattleReturn(
  currentUnits: Record<string, number>,
  sentUnits: Record<string, number>,
  survivingSentUnits: Record<string, number>
): Record<string, number> {
  const updated = { ...currentUnits };
  const unitTypes = new Set([
    ...Object.keys(currentUnits || {}),
    ...Object.keys(sentUnits || {}),
    ...Object.keys(survivingSentUnits || {}),
  ]);

  for (const unitType of unitTypes) {
    const current = Number(updated[unitType] || 0);
    const sent = Number(sentUnits[unitType] || 0);
    const survived = Number(survivingSentUnits[unitType] || 0);
    updated[unitType] = Math.max(0, current - sent + survived);
  }

  return updated;
}

function normalizePositiveInt(value: unknown): number {
  const parsed = Math.floor(Number(value));
  if (!Number.isFinite(parsed)) return 0;
  return Math.max(0, parsed);
}

function readCombatDeployment(travelState: unknown): {
  rawTravelState: Record<string, unknown>;
  garrison: Record<string, number>;
  activeDefenses: Record<string, number>;
} {
  const rawTravelState: Record<string, unknown> =
    travelState && typeof travelState === "object"
      ? { ...(travelState as Record<string, unknown>) }
      : { activeRoute: null, discoveredWormholes: [] };

  const combatStateRaw =
    rawTravelState.combat && typeof rawTravelState.combat === "object"
      ? (rawTravelState.combat as Record<string, unknown>)
      : {};

  const garrison = normalizePositiveUnitMap(combatStateRaw.garrison);
  const activeDefenses = normalizePositiveUnitMap(combatStateRaw.activeDefenses);

  return { rawTravelState, garrison, activeDefenses };
}

export function registerCombatRoutes(app: Router) {
  /**
   * GET /api/combat/stats
   * Get combat statistics for player (power level, units, research)
   */
  app.get("/api/combat/stats", authenticateRequest as any, async (req: Request, res: Response) => {
    try {
      const userId = (req as any).session?.userId;
      if (!userId) return res.status(401).json({ error: "Not authenticated" });

      const playerState = await db
        .select()
        .from(playerStates)
        .where(eq(playerStates.userId, userId))
        .limit(1);

      if (!playerState.length) {
        return res
          .status(404)
          .json({ error: "Player state not found" });
      }

      const state = playerState[0];
      const units = state.units as any || {};
      const research = state.research as any || {};
      const buildings = state.buildings as any || {};
      const kardashev = getKardashevOperationalBonusesForPlayer(state);

      // Calculate total fleet power
      const UNIT_POWER = {
        lightFighter: 50,
        heavyFighter: 120,
        smallCargo: 30,
        largeCargo: 60,
        espionageProbe: 10,
        battleship: 300,
        cruiser: 200,
        destroyer: 150,
        dreadnought: 500,
        colonist: 5,
      } as any;

      let fleetPower = 0;
      for (const [unitType, count] of Object.entries(units)) {
        fleetPower += (UNIT_POWER[unitType] || 50) * (count as number);
      }

      // Calculate combat bonuses from research
      const weaponsBonus = (research.weaponsTech || 0) * 0.05; // 5% per level
      const shieldingBonus = (research.shieldingTech || 0) * 0.05;
      const armorBonus = (research.armourTech || 0) * 0.03;
      const combatLevel = toPlayerCombatLevel(research, Number(buildings.shipyard || 0));
      const progression = buildProgressionSnapshot("commander", combatLevel);
      const tier = getTierForLevel(combatLevel);

      res.json({
        totalUnits: Object.values(units).reduce((a: number, b: any) => a + (b as number), 0),
        fleetPower: Math.floor(fleetPower * (1 + weaponsBonus) * kardashev.fleetPowerMultiplier),
        unitComposition: units,
        research: {
          weaponsTech: research.weaponsTech || 0,
          shieldingTech: research.shieldingTech || 0,
          armourTech: research.armourTech || 0,
        },
        bonuses: {
          attack: weaponsBonus,
          defense: shieldingBonus,
          armor: armorBonus,
          kardashevFleetPower: kardashev.fleetPowerPercent / 100,
          kardashevDefensePower: kardashev.defensePowerPercent / 100,
        },
        kardashev,
        shipyard: buildings.shipyard || 0,
        progression: {
          level: combatLevel,
          tier,
          rank: progression.rank,
          title: progression.title,
          snapshot: progression,
        },
        profile: getBattleProfile("pvp"),
        suggestedEffects: COMBAT_EFFECT_LIBRARY.slice(0, 3),
      });
    } catch (error) {
      console.error("[combat-stats] Error:", error);
      res.status(500).json({ error: "Failed to get combat stats" });
    }
  });

  /**
   * POST /api/combat/attack
   * Attack another player
   * Body: { targetId: string, units: { shipType: count, ... } }
   */
  app.post("/api/combat/attack", authenticateRequest as any, async (req: Request, res: Response) => {
    try {
      const userId = (req as any).session?.userId;
      if (!userId) return res.status(401).json({ error: "Not authenticated" });

      const { targetId, units: rawAttackUnits } = req.body;
      const attackUnits = normalizePositiveUnitMap(rawAttackUnits);
      if (!targetId || !attackUnits) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      if (targetId === userId) {
        return res.status(400).json({ error: "Cannot attack yourself" });
      }

      if (Object.keys(attackUnits).length === 0) {
        return res.status(400).json({ error: "At least one attacking unit is required" });
      }

      // Get attacker state
      const attackerResult = await db
        .select()
        .from(playerStates)
        .where(eq(playerStates.userId, userId))
        .limit(1);

      if (!attackerResult.length) {
        return res.status(404).json({ error: "Attacker not found" });
      }

      // Get defender state
      const defenderResult = await db
        .select()
        .from(playerStates)
        .where(eq(playerStates.userId, targetId))
        .limit(1);

      if (!defenderResult.length) {
        return res.status(404).json({ error: "Defender not found" });
      }

      const attacker = attackerResult[0];
      const defender = defenderResult[0];
      const attackerKardashev = getKardashevOperationalBonusesForPlayer(attacker);
      const defenderKardashev = getKardashevOperationalBonusesForPlayer(defender);

      // Check attacker has units
      const attackerUnits = toUnitCountMap(attacker.units as Record<string, any>);
      for (const [unitType, count] of Object.entries(attackUnits)) {
        if ((attackerUnits[unitType] || 0) < (count as number)) {
          return res
            .status(400)
            .json({
              error: `Insufficient units: need ${count} ${unitType}, have ${attackerUnits[unitType] || 0}`,
            });
        }
      }

      // Simulate battle
      const defenderUnitsAtStart = toUnitCountMap(defender.units as Record<string, any>);
      const battleResult = simulateBattle(
        {
          units: Object.entries(attackUnits || {}).reduce((acc, [type, count]) => {
            acc[type] = { type, count: count as number };
            return acc;
          }, {} as any),
          research: attacker.research as any,
          bonusMultiplier:
            attackerKardashev.fleetPowerMultiplier *
            (1 + ((attacker.research as any)?.militaryTech || 0) * 0.02),
        },
        {
          units: Object.entries(defender.units || {}).reduce((acc, [type, count]) => {
            acc[type] = { type, count: count as number };
            return acc;
          }, {} as any),
          research: defender.research as any,
          bonusMultiplier:
            defenderKardashev.defensePowerMultiplier *
            (1 + ((defender.research as any)?.defenseTech || 0) * 0.02),
        }
      );

      const attackerUnitsAfterBattle = toUnitCountMap(battleResult.attackerUnits as Record<string, any>);
      const defenderUnitsAfterBattle = toUnitCountMap(battleResult.defenderUnits as Record<string, any>);
      const attackerLosses = calculateUnitLosses(attackUnits as Record<string, number>, attackerUnitsAfterBattle);
      const defenderLosses = calculateUnitLosses(defenderUnitsAtStart, defenderUnitsAfterBattle);
      const winnerTag = battleResult.winner === "attacker" ? "attacker" : "defender";
      const attackerLevel = toPlayerCombatLevel(attacker.research as Record<string, any>, Number((attacker.buildings as any)?.shipyard || 0));
      const defenderLevel = toPlayerCombatLevel(defender.research as Record<string, any>, Number((defender.buildings as any)?.shipyard || 0));
      const pvpProfile = getBattleProfile("pvp");

      // Process results
      if (battleResult.winner === "attacker") {
        // Calculate plunder
        const defenderResources = defender.resources as any || {};
        const plunder = calculateVictoryResources(defenderResources, "attacker");

        // Update attacker units
        const newAttackerUnits = applyBattleReturn(attackerUnits, attackUnits as Record<string, number>, attackerUnitsAfterBattle);
        const newDefenderUnits = defenderUnitsAfterBattle;

        // Update attacker resources
        const newAttackerResources = {
          ...(attacker.resources as any),
          metal: ((attacker.resources as any)?.metal || 0) + plunder.metal,
          crystal: ((attacker.resources as any)?.crystal || 0) + plunder.crystal,
          deuterium:
            ((attacker.resources as any)?.deuterium || 0) + plunder.deuterium,
        };

        // Update defender resources
        const newDefenderResources = {
          ...(defender.resources as any),
          metal:
            ((defender.resources as any)?.metal || 0) - plunder.metal < 0
              ? 0
              : ((defender.resources as any)?.metal || 0) - plunder.metal,
          crystal:
            ((defender.resources as any)?.crystal || 0) - plunder.crystal < 0
              ? 0
              : ((defender.resources as any)?.crystal || 0) - plunder.crystal,
          deuterium:
            ((defender.resources as any)?.deuterium || 0) - plunder.deuterium < 0
              ? 0
              : ((defender.resources as any)?.deuterium || 0) - plunder.deuterium,
        };

        // Update database
        await db
          .update(playerStates)
          .set({
            units: newAttackerUnits,
            resources: newAttackerResources,
            updatedAt: new Date(),
          })
          .where(eq(playerStates.userId, userId));

        await db
          .update(playerStates)
          .set({
            units: newDefenderUnits,
            resources: newDefenderResources,
            updatedAt: new Date(),
          })
          .where(eq(playerStates.userId, targetId));

        const battleRecord = await db
          .insert(battles)
          .values({
            attackerId: userId,
            defenderId: targetId,
            type: "attack",
            status: "completed",
            attackerCoordinates: attacker.coordinates,
            defenderCoordinates: defender.coordinates,
            winner: winnerTag,
            attackerFleet: attackUnits as Record<string, number>,
            defenderFleet: defenderUnitsAtStart,
            attackerLosses,
            defenderLosses,
            loot: plunder,
            debris: {
              metal: Math.floor(((plunder.metal || 0) + (plunder.crystal || 0)) * 0.1),
              crystal: Math.floor((plunder.deuterium || 0) * 0.05),
            },
            rounds: battleResult.rounds,
            completedAt: new Date(),
          })
          .returning();

        res.json({
          success: true,
          winner: "attacker",
          battleId: battleRecord[0]?.id,
          battleResult,
          battleProfile: pvpProfile,
          attackerProgression: buildProgressionSnapshot("commander", attackerLevel),
          defenderProgression: buildProgressionSnapshot("commander", defenderLevel),
          kardashev: { attacker: attackerKardashev, defender: defenderKardashev },
          activeEffects: COMBAT_EFFECT_LIBRARY.slice(0, 4),
          plunder,
          newAttackerUnits,
          newDefenderUnits,
          newAttackerResources,
        });
      } else {
        // Defender wins - attacker units destroyed
        const newAttackerUnits = applyBattleReturn(attackerUnits, attackUnits as Record<string, number>, attackerUnitsAfterBattle);
        const newDefenderUnits = defenderUnitsAfterBattle;

        // Update database
        await db
          .update(playerStates)
          .set({
            units: newDefenderUnits,
            updatedAt: new Date(),
          })
          .where(eq(playerStates.userId, targetId));

        await db
          .update(playerStates)
          .set({
            units: newAttackerUnits,
            updatedAt: new Date(),
          })
          .where(eq(playerStates.userId, userId));

        const battleRecord = await db
          .insert(battles)
          .values({
            attackerId: userId,
            defenderId: targetId,
            type: "attack",
            status: "completed",
            attackerCoordinates: attacker.coordinates,
            defenderCoordinates: defender.coordinates,
            winner: winnerTag,
            attackerFleet: attackUnits as Record<string, number>,
            defenderFleet: defenderUnitsAtStart,
            attackerLosses,
            defenderLosses,
            loot: { metal: 0, crystal: 0, deuterium: 0 },
            debris: {
              metal: Math.floor((Object.values(attackerLosses).reduce((sum, value) => sum + value, 0)) * 10),
              crystal: Math.floor((Object.values(defenderLosses).reduce((sum, value) => sum + value, 0)) * 5),
            },
            rounds: battleResult.rounds,
            completedAt: new Date(),
          })
          .returning();

        res.json({
          success: true,
          winner: "defender",
          battleId: battleRecord[0]?.id,
          battleResult,
          battleProfile: pvpProfile,
          attackerProgression: buildProgressionSnapshot("commander", attackerLevel),
          defenderProgression: buildProgressionSnapshot("commander", defenderLevel),
          kardashev: { attacker: attackerKardashev, defender: defenderKardashev },
          activeEffects: COMBAT_EFFECT_LIBRARY.slice(2, 6),
          plunder: { metal: 0, crystal: 0, deuterium: 0 },
          newAttackerUnits,
          newDefenderUnits,
        });
      }
    } catch (error) {
      console.error("[combat-attack] Error:", error);
      res.status(500).json({ error: "Failed to process combat" });
    }
  });

  /**
   * POST /api/combat/garrison
   * Assign units to defend a location
   * Body: { units: { shipType: count, ... } }
   */
  app.post("/api/combat/garrison", authenticateRequest as any, async (req: Request, res: Response) => {
    try {
      const userId = (req as any).session?.userId;
      if (!userId) return res.status(401).json({ error: "Not authenticated" });

      const { units: rawUnits } = req.body;
      if (!rawUnits) {
        return res.status(400).json({ error: "Missing units" });
      }

      const units = normalizePositiveUnitMap(rawUnits);
      if (Object.keys(units).length === 0) {
        return res.status(400).json({ error: "At least one garrison unit is required" });
      }

      const playerState = await db
        .select()
        .from(playerStates)
        .where(eq(playerStates.userId, userId))
        .limit(1);

      if (!playerState.length) {
        return res.status(404).json({ error: "Player not found" });
      }

      const currentUnits = (playerState[0].units as any) || {};

      // Verify player has units
      for (const [unitType, count] of Object.entries(units)) {
        if ((currentUnits[unitType] || 0) < (count as number)) {
          return res
            .status(400)
            .json({
              error: `Insufficient ${unitType}: have ${currentUnits[unitType] || 0}, need ${count}`,
            });
        }
      }

      const deploymentState = readCombatDeployment(playerState[0].travelState);
      const updatedTravelState = {
        ...deploymentState.rawTravelState,
        combat: {
          garrison: units,
          activeDefenses: deploymentState.activeDefenses,
          updatedAt: new Date().toISOString(),
        },
      };

      await db
        .update(playerStates)
        .set({
          travelState: updatedTravelState,
          updatedAt: new Date(),
        })
        .where(eq(playerStates.userId, userId));

      const garrison = {
        type: "garrison",
        units,
        createdAt: new Date(),
      };

      res.json({
        success: true,
        garrison,
        message: "Garrison assigned successfully",
      });
    } catch (error) {
      console.error("[combat-garrison] Error:", error);
      res.status(500).json({ error: "Failed to garrison units" });
    }
  });

  /**
   * POST /api/combat/defense/activate
   * Activate planetary defenses
   * Body: { unitType: string, quantity: number }
   */
  app.post("/api/combat/defense/activate", authenticateRequest as any, async (req: Request, res: Response) => {
    try {
      const userId = (req as any).session?.userId;
      if (!userId) return res.status(401).json({ error: "Not authenticated" });

      const { unitType, quantity } = req.body;
      if (!unitType || quantity === undefined) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const normalizedQuantity = normalizePositiveInt(quantity);
      if (normalizedQuantity <= 0) {
        return res.status(400).json({ error: "quantity must be a positive integer" });
      }

      const playerState = await db
        .select()
        .from(playerStates)
        .where(eq(playerStates.userId, userId))
        .limit(1);

      if (!playerState.length) {
        return res.status(404).json({ error: "Player not found" });
      }

      const state = playerState[0];
      const allUnits = toUnitCountMap((state.units as Record<string, any>) || {});
      const deployment = readCombatDeployment(state.travelState);

      const existingDefense = deployment.activeDefenses[unitType] || 0;
      const garrisoned = deployment.garrison[unitType] || 0;
      const availableToAssign = Math.max(0, (allUnits[unitType] || 0) - garrisoned - existingDefense);

      if (availableToAssign < normalizedQuantity) {
        return res.status(400).json({
          error: "Insufficient available units for defense activation",
          unitType,
          available: availableToAssign,
          requested: normalizedQuantity,
        });
      }

      const nextActiveDefenses = {
        ...deployment.activeDefenses,
        [unitType]: existingDefense + normalizedQuantity,
      };

      const updatedTravelState = {
        ...deployment.rawTravelState,
        combat: {
          garrison: deployment.garrison,
          activeDefenses: nextActiveDefenses,
          updatedAt: new Date().toISOString(),
        },
      };

      await db
        .update(playerStates)
        .set({
          travelState: updatedTravelState,
          updatedAt: new Date(),
        })
        .where(eq(playerStates.userId, userId));

      // Get buildings for defense bonus
      const buildings = (state.buildings as any) || {};
      const defenseBonus = (buildings.defenseGrid || 0) * 0.1; // +10% defense per level

      res.json({
        success: true,
        defense: {
          unitType,
          quantity: normalizedQuantity,
          defenseBonus,
          effectiveDefense: normalizedQuantity * (1 + defenseBonus),
          activeDefenses: nextActiveDefenses,
          availableRemaining: Math.max(0, availableToAssign - normalizedQuantity),
        },
      });
    } catch (error) {
      console.error("[combat-defense] Error:", error);
      res.status(500).json({ error: "Failed to activate defenses" });
    }
  });

  /**
   * GET /api/combat/battle-history
   * Get recent battles for player
   */
  app.get("/api/combat/battle-history", authenticateRequest as any, async (req: Request, res: Response) => {
    try {
      const userId = (req as any).session?.userId;
      if (!userId) return res.status(401).json({ error: "Not authenticated" });

      const playerBattles = await db
        .select()
        .from(battles)
        .where(or(eq(battles.attackerId, userId), eq(battles.defenderId, userId)))
        .orderBy(desc(battles.createdAt))
        .limit(50);

      const opponentIds = Array.from(
        new Set(
          playerBattles.map((battle) => (battle.attackerId === userId ? battle.defenderId : battle.attackerId))
        )
      );

      const opponentRows = opponentIds.length
        ? await db.select({ id: users.id, username: users.username }).from(users).where(inArray(users.id, opponentIds))
        : [];

      const opponentNameById = new Map(opponentRows.map((opponent) => [opponent.id, opponent.username || "Unknown Commander"]));

      const normalizedBattles = playerBattles.map((battle) => {
        const isAttacker = battle.attackerId === userId;
        const opponentId = isAttacker ? battle.defenderId : battle.attackerId;
        const result = battle.winner === "draw"
          ? "draw"
          : (battle.winner === (isAttacker ? "attacker" : "defender") ? "victory" : "defeat");
        const losses = isAttacker ? (battle.attackerLosses as Record<string, number> | null) : (battle.defenderLosses as Record<string, number> | null);
        const unitsCasualties = Object.values(losses || {}).reduce((sum, count) => sum + Number(count || 0), 0);

        return {
          id: battle.id,
          timestamp: battle.completedAt || battle.createdAt,
          opponent: opponentNameById.get(opponentId) || "Unknown Commander",
          result,
          unitsCasualties,
          plunder: (battle.loot as Record<string, number> | null) || { metal: 0, crystal: 0, deuterium: 0 },
          rounds: battle.rounds || 0,
          coordinates: isAttacker ? battle.defenderCoordinates : battle.attackerCoordinates,
          battleType: battle.type,
          role: isAttacker ? "attacker" : "defender",
        };
      });

      const totalVictories = normalizedBattles.filter((battle) => battle.result === "victory").length;
      const totalDefeats = normalizedBattles.filter((battle) => battle.result === "defeat").length;

      res.json({
        battles: normalizedBattles,
        totalVictories,
        totalDefeats,
      });
    } catch (error) {
      console.error("[combat-history] Error:", error);
      res.status(500).json({ error: "Failed to get battle history" });
    }
  });
}
