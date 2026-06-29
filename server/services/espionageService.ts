/**
 * Espionage System Service
 * Spy missions, scanning, sabotage, and intelligence gathering
 */

import { db } from "../db";
import { eq, and } from "drizzle-orm";
import { playerStates, messages } from "../../Source/Shared/schema";

export const ESPIONAGE_CONFIG = {
  missionCosts: {
    scan: { deuterium: 50 },
    espionage: { deuterium: 150 },
    sabotage: { deuterium: 300, gold: 500 },
    steal_research: { deuterium: 400, gold: 1000 },
  },
  missionDurations: {
    scan: 300,
    espionage: 1800,
    sabotage: 3600,
    steal_research: 5400,
  },
  successFormulas: {
    baseChance: 0.4,
    levelBonus: 0.02,
    techBonus: 0.01,
    maxChance: 0.95,
  },
  detectionFormulas: {
    baseChance: 0.2,
    counterIntelReduction: 0.015,
    stealthReduction: 0.01,
    maxChance: 0.8,
  },
  spyLevelScaling: 100,
  maxActiveAgents: 5,
  sabotageDamagePercent: 0.15,
  researchStealPercent: 0.1,
  cooldownBetweenMissions: 600,
};

type MissionType = "scan" | "espionage" | "sabotage" | "steal_research";

function calculateSpySuccessChance(spyLevel: number, targetDefense: number): number {
  const { baseChance, levelBonus, techBonus, maxChance } = ESPIONAGE_CONFIG.successFormulas;
  const chance = baseChance + spyLevel * levelBonus + (targetDefense * techBonus * -1);
  return Math.min(maxChance, Math.max(0.05, chance));
}

function calculateSpyDetectionChance(spyLevel: number, targetCounterIntel: number): number {
  const { baseChance, counterIntelReduction, stealthReduction, maxChance } = ESPIONAGE_CONFIG.detectionFormulas;
  const chance = baseChance + targetCounterIntel * counterIntelReduction - spyLevel * stealthReduction;
  return Math.min(maxChance, Math.max(0.05, chance));
}

function getSpyLevel(research: Record<string, number>): number {
  const espionageLevel = research["espionage-tech"] || 0;
  return Math.floor(espionageLevel / 5) + 1;
}

function getCounterIntelLevel(research: Record<string, number>): number {
  return research["computer-1"] || 0;
}

async function getPlayerResources(userId: string) {
  const [state] = await db.select().from(playerStates).where(eq(playerStates.userId, userId));
  if (!state) throw new Error("Player state not found");
  const resources = (state.resources || {}) as Record<string, number>;
  return { state, resources };
}

async function deductDeuterium(userId: string, amount: number) {
  const [state] = await db.select().from(playerStates).where(eq(playerStates.userId, userId));
  if (!state) throw new Error("Player state not found");
  const resources = (state.resources || {}) as Record<string, number>;
  const current = resources.deuterium || 0;
  if (current < amount) throw new Error("Insufficient deuterium for espionage mission");
  resources.deuterium = current - amount;
  await db.update(playerStates).set({ resources }).where(eq(playerStates.userId, userId));
}

async function deductGold(userId: string, amount: number) {
  const [state] = await db.select().from(playerStates).where(eq(playerStates.userId, userId));
  if (!state) throw new Error("Player state not found");
  const resources = (state.resources || {}) as Record<string, number>;
  const current = resources.gold || 0;
  if (current < amount) throw new Error("Insufficient gold for espionage mission");
  resources.gold = current - amount;
  await db.update(playerStates).set({ resources }).where(eq(playerStates.userId, userId));
}

export class EspionageService {
  static async scanTarget(userId: string, targetId: string) {
    if (userId === targetId) throw new Error("Cannot scan yourself");

    const cost = ESPIONAGE_CONFIG.missionCosts.scan;
    await deductDeuterium(userId, cost.deuterium);

    const [targetState] = await db.select().from(playerStates).where(eq(playerStates.userId, targetId));
    if (!targetState) throw new Error("Target player not found");

    const [spyState] = await db.select().from(playerStates).where(eq(playerStates.userId, userId));
    const research = (spyState?.research || {}) as Record<string, number>;
    const spyLevel = getSpyLevel(research);

    const targetResearch = (targetState.research || {}) as Record<string, number>;
    const targetDefense = getCounterIntelLevel(targetResearch);

    const successChance = calculateSpySuccessChance(spyLevel, targetDefense);
    const detected = Math.random() > calculateSpyDetectionChance(spyLevel, targetDefense);

    const report = {
      scanType: "scan",
      targetId,
      successChance,
      detected,
      timestamp: new Date().toISOString(),
      fleet: detected ? (targetState.units || {}) : { _hidden: true },
      buildings: detected ? (targetState.buildings || {}) : { _hidden: true },
      resources: detected ? (targetState.resources || {}) : { _hidden: true },
    };

    await db.insert(messages).values({
      fromUserId: userId,
      toUserId: userId,
      from: "Intelligence Agency",
      to: userId,
      subject: `Scan Report: ${targetId}`,
      body: JSON.stringify(report),
      type: "espionage",
    });

    return report;
  }

  static async sendSpyMission(userId: string, targetId: string, missionType: MissionType) {
    if (userId === targetId) throw new Error("Cannot spy on yourself");

    const cost = ESPIONAGE_CONFIG.missionCosts[missionType];
    await deductDeuterium(userId, cost.deuterium);
    if ((cost as any).gold) await deductGold(userId, (cost as any).gold);

    const [spyState] = await db.select().from(playerStates).where(eq(playerStates.userId, userId));
    const research = (spyState?.research || {}) as Record<string, number>;
    const spyLevel = getSpyLevel(research);

    const [targetState] = await db.select().from(playerStates).where(eq(playerStates.userId, targetId));
    if (!targetState) throw new Error("Target player not found");

    const targetResearch = (targetState.research || {}) as Record<string, number>;
    const targetDefense = getCounterIntelLevel(targetResearch);

    const successChance = calculateSpySuccessChance(spyLevel, targetDefense);
    const detectionChance = calculateSpyDetectionChance(spyLevel, targetDefense);

    const success = Math.random() < successChance;
    const detected = Math.random() < detectionChance;

    let result: Record<string, any> = {
      missionType,
      targetId,
      success,
      detected,
      successChance,
      detectionChance,
      timestamp: new Date().toISOString(),
    };

    if (success) {
      switch (missionType) {
        case "espionage": {
          result.intel = {
            fleet: targetState.units || {},
            buildings: targetState.buildings || {},
            resources: targetState.resources || {},
          };
          break;
        }
        case "sabotage": {
          const buildings = (targetState.buildings || {}) as Record<string, number>;
          const buildingKeys = Object.keys(buildings);
          if (buildingKeys.length > 0) {
            const target = buildingKeys[0];
            const damage = ESPIONAGE_CONFIG.sabotageDamagePercent;
            buildings[target] = Math.max(0, Math.floor(buildings[target] * (1 - damage)));
            await db.update(playerStates).set({ buildings }).where(eq(playerStates.userId, targetId));
            result.sabotagedBuilding = target;
            result.damageApplied = damage;
          }
          break;
        }
        case "steal_research": {
          const targetResearchData = (targetState.research || {}) as Record<string, number>;
          const ownResearch = (spyState?.research || {}) as Record<string, number>;
          const stolenTechs: string[] = [];

          for (const [techId, level] of Object.entries(targetResearchData)) {
            if (level > 0 && (!ownResearch[techId] || ownResearch[techId] < level)) {
              const stealAmount = Math.max(1, Math.floor(level * ESPIONAGE_CONFIG.researchStealPercent));
              ownResearch[techId] = Math.min(level, (ownResearch[techId] || 0) + stealAmount);
              stolenTechs.push(techId);
            }
          }

          await db.update(playerStates).set({ research: ownResearch }).where(eq(playerStates.userId, userId));
          result.stolenTechs = stolenTechs;
          break;
        }
      }
    }

    if (detected) {
      await db.insert(messages).values({
        fromUserId: targetId,
        toUserId: targetId,
        from: "Security Bureau",
        to: targetId,
        subject: `Espionage Alert: ${missionType} attempt detected`,
        body: JSON.stringify({ detectedBy: "counter-intelligence", missionType, timestamp: result.timestamp }),
        type: "espionage",
      });
    }

    await db.insert(messages).values({
      fromUserId: userId,
      toUserId: userId,
      from: "Intelligence Agency",
      to: userId,
      subject: `Spy Mission ${success ? "Success" : "Failure"}: ${missionType}`,
      body: JSON.stringify(result),
      type: "espionage",
    });

    return result;
  }

  static async getSpyReports(userId: string) {
    const reports = await db.select().from(messages).where(
      and(eq(messages.toUserId, userId), eq(messages.type, "espionage"))
    );
    return reports.map((r) => ({
      id: r.id,
      subject: r.subject,
      body: (() => { try { return JSON.parse(r.body as string); } catch { return r.body; } })(),
      read: r.read,
      timestamp: r.timestamp,
    }));
  }

  static async sabotageMission(userId: string, targetId: string, targetBuilding: string) {
    if (userId === targetId) throw new Error("Cannot sabotage yourself");

    const cost = ESPIONAGE_CONFIG.missionCosts.sabotage;
    await deductDeuterium(userId, cost.deuterium);
    await deductGold(userId, cost.gold);

    const [spyState] = await db.select().from(playerStates).where(eq(playerStates.userId, userId));
    const research = (spyState?.research || {}) as Record<string, number>;
    const spyLevel = getSpyLevel(research);

    const [targetState] = await db.select().from(playerStates).where(eq(playerStates.userId, targetId));
    if (!targetState) throw new Error("Target player not found");

    const targetResearch = (targetState.research || {}) as Record<string, number>;
    const targetDefense = getCounterIntelLevel(targetResearch);

    const successChance = calculateSpySuccessChance(spyLevel, targetDefense);
    const success = Math.random() < successChance;

    if (!success) {
      const detected = Math.random() < calculateSpyDetectionChance(spyLevel, targetDefense);
      return { success: false, detected, damageDealt: 0 };
    }

    const buildings = (targetState.buildings || {}) as Record<string, number>;
    if (!buildings[targetBuilding] || buildings[targetBuilding] <= 0) {
      throw new Error(`Target building '${targetBuilding}' not found or already destroyed`);
    }

    const damage = ESPIONAGE_CONFIG.sabotageDamagePercent;
    buildings[targetBuilding] = Math.max(0, Math.floor(buildings[targetBuilding] * (1 - damage)));
    await db.update(playerStates).set({ buildings }).where(eq(playerStates.userId, targetId));

    const damageDealt = Math.floor(targetBuilding ? damage * 100 : 0);

    await db.insert(messages).values({
      fromUserId: userId,
      toUserId: userId,
      from: "Sabotage Division",
      to: userId,
      subject: `Sabotage Report: ${targetBuilding}`,
      body: JSON.stringify({ targetId, targetBuilding, damageDealt, success: true }),
      type: "espionage",
    });

    return { success: true, detected: false, damageDealt, targetBuilding };
  }

  static getActiveAgents(userId: string) {
    return {
      userId,
      activeAgents: [],
      maxAgents: ESPIONAGE_CONFIG.maxActiveAgents,
    };
  }
}

export default EspionageService;
