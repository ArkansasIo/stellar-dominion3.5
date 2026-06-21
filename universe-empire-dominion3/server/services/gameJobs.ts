import { pool } from "../db";
import { registerCronJob, recordGameTick, type CronJobResult } from "./cronService";

const RESOURCE_TICK_INTERVAL = 10000;
const TURN_TICK_INTERVAL = 15000;
const CONSTRUCTION_TICK_INTERVAL = 5000;
const DAILY_RESET_INTERVAL = 86400000;
const WEEKLY_RESET_INTERVAL = 604800000;
const MAINTENANCE_INTERVAL = 3600000;
const MARKET_TICK_INTERVAL = 900000;

export async function registerAllGameJobs(): Promise<void> {
  await registerCronJob({
    id: "resource_tick",
    name: "Resource Production Tick",
    description: "Processes resource production for all active players based on elapsed time since last update.",
    jobType: "recurring",
    scheduleType: "interval",
    intervalMs: RESOURCE_TICK_INTERVAL,
    enabled: true,
    params: { maxPlayersPerTick: 50 },
    handler: resourceTickHandler,
  });

  await registerCronJob({
    id: "turn_tick",
    name: "Turn Generation Tick",
    description: "Generates offline turns for all players based on elapsed time.",
    jobType: "recurring",
    scheduleType: "interval",
    intervalMs: TURN_TICK_INTERVAL,
    enabled: true,
    params: { maxPlayersPerTick: 50, turnsPerMinute: 4 },
    handler: turnTickHandler,
  });

  await registerCronJob({
    id: "construction_tick",
    name: "Construction Queue Tick",
    description: "Completes building constructions whose timers have elapsed.",
    jobType: "recurring",
    scheduleType: "interval",
    intervalMs: CONSTRUCTION_TICK_INTERVAL,
    enabled: true,
    params: { maxPlayersPerTick: 100 },
    handler: constructionTickHandler,
  });

  await registerCronJob({
    id: "daily_reset",
    name: "Daily Reset",
    description: "Resets daily limits, grants login bonuses, and refreshes daily missions.",
    jobType: "daily",
    scheduleType: "daily",
    intervalMs: DAILY_RESET_INTERVAL,
    enabled: true,
    params: { loginBonusCredits: 500, loginBonusMetal: 1000 },
    handler: dailyResetHandler,
  });

  await registerCronJob({
    id: "weekly_reset",
    name: "Weekly Reset",
    description: "Resets weekly missions, refreshes market prices, and processes weekly rewards.",
    jobType: "weekly",
    scheduleType: "weekly",
    intervalMs: WEEKLY_RESET_INTERVAL,
    enabled: true,
    params: {},
    handler: weeklyResetHandler,
  });

  await registerCronJob({
    id: "market_tick",
    name: "Market Price Update",
    description: "Updates market prices based on supply/demand and recent trade activity.",
    jobType: "recurring",
    scheduleType: "interval",
    intervalMs: MARKET_TICK_INTERVAL,
    enabled: true,
    params: { priceVolatility: 0.05, maxPriceChange: 0.2 },
    handler: marketTickHandler,
  });

  await registerCronJob({
    id: "maintenance_tick",
    name: "Server Maintenance",
    description: "Cleans expired sessions, old logs, and performs database optimization.",
    jobType: "recurring",
    scheduleType: "interval",
    intervalMs: MAINTENANCE_INTERVAL,
    enabled: true,
    params: { logRetentionDays: 7 },
    handler: maintenanceTickHandler,
  });

  await registerCronJob({
    id: "refinery_tick",
    name: "Refinery Production Tick",
    description: "Processes active refinery production for all players.",
    jobType: "recurring",
    scheduleType: "interval",
    intervalMs: 30000,
    enabled: true,
    params: { maxPlayersPerTick: 50 },
    handler: refineryTickHandler,
  });

  await registerCronJob({
    id: "anomaly_respawn",
    name: "Anomaly Respawn",
    description: "Respawns expired dimensional anomalies.",
    jobType: "recurring",
    scheduleType: "interval",
    intervalMs: 300000,
    enabled: true,
    params: {},
    handler: anomalyRespawnHandler,
  });
}

async function resourceTickHandler(_job: any, params: any): Promise<CronJobResult> {
  const startTime = Date.now();
  let playersProcessed = 0;
  let resourcesUpdated = 0;
  let errors = 0;

  try {
    const result = await pool.query(
      `SELECT id, resources, buildings, last_resource_update, empire_level
       FROM player_states
       WHERE last_resource_update < now() - interval '10 seconds'
       ORDER BY last_resource_update ASC
       LIMIT $1`,
      [params.maxPlayersPerTick || 50]
    );

    for (const row of result.rows) {
      try {
        const buildings = row.buildings || {};
        const lastUpdate = new Date(row.last_resource_update).getTime();
        const now = Date.now();
        const elapsedHours = Math.min(24, (now - lastUpdate) / 3600000);

        if (elapsedHours < 0.003) continue;

        const metalMine = buildings.metalMine || 0;
        const crystalMine = buildings.crystalMine || 0;
        const deuteriumSynth = buildings.deuteriumSynthesizer || 0;
        const solarPlant = buildings.solarPlant || 0;

        const metalProd = Math.floor(30 * metalMine * (1 + metalMine / 10) * elapsedHours);
        const crystalProd = Math.floor(20 * crystalMine * (1 + crystalMine / 10) * elapsedHours);
        const deuteriumProd = Math.floor(10 * deuteriumSynth * (1 + deuteriumSynth / 12) * elapsedHours);
        const energyProd = Math.floor(20 * solarPlant * (1 + solarPlant / 10) * elapsedHours);
        const energyConsumed = Math.floor((10 * metalMine + 10 * crystalMine + 20 * deuteriumSynth) * elapsedHours);
        const netEnergy = Math.max(0, energyProd - energyConsumed);

        const resources = row.resources || {};
        const newResources = {
          ...resources,
          metal: Math.floor((resources.metal || 0) + metalProd),
          crystal: Math.floor((resources.crystal || 0) + crystalProd),
          deuterium: Math.floor((resources.deuterium || 0) + deuteriumProd),
          energy: netEnergy,
        };

        await pool.query(
          `UPDATE player_states SET resources = $2, last_resource_update = now() WHERE id = $1`,
          [row.id, JSON.stringify(newResources)]
        );
        resourcesUpdated++;
      } catch (e) {
        errors++;
      }
      playersProcessed++;
    }

    const durationMs = Date.now() - startTime;
    await recordGameTick("resource", { durationMs, playersProcessed, resourcesUpdated, errors });

    return { success: true, recordsProcessed: playersProcessed, recordsAffected: resourcesUpdated, metadata: { durationMs, errors } };
  } catch (error: any) {
    await recordGameTick("resource", { durationMs: Date.now() - startTime, errors: 1 });
    return { success: false, message: error.message };
  }
}

async function turnTickHandler(_job: any, params: any): Promise<CronJobResult> {
  const startTime = Date.now();
  let playersProcessed = 0;
  let turnsGenerated = 0;
  let errors = 0;

  try {
    const result = await pool.query(
      `SELECT id, turns_data, empire_level
       FROM player_states
       WHERE updated_at > now() - interval '7 days'
       ORDER BY updated_at DESC
       LIMIT $1`,
      [params.maxPlayersPerTick || 50]
    );

    for (const row of result.rows) {
      try {
        const turnsData = row.turns_data || {};
        const lastTurn = turnsData.lastTurnTimestamp || new Date(row.updated_at).getTime();
        const now = Date.now();
        const elapsedMinutes = (now - lastTurn) / 60000;
        const turnsPerMinute = params.turnsPerMinute || 4;
        const maxOfflineTurns = 8640;
        const newTurns = Math.min(maxOfflineTurns, Math.floor(elapsedMinutes * turnsPerMinute));

        if (newTurns <= 0) continue;

        const currentAvailable = turnsData.availableTurns || 0;
        const currentStreak = turnsData.streakTurns || 0;

        const streakBonus = currentStreak >= 10 ? Math.floor(newTurns * 0.1) : 0;
        const totalNew = newTurns + streakBonus;

        const updatedTurns = {
          ...turnsData,
          availableTurns: currentAvailable + totalNew,
          lastTurnTimestamp: now,
          streakTurns: currentStreak + newTurns,
          totalTurnsGenerated: (turnsData.totalTurnsGenerated || 0) + totalNew,
        };

        await pool.query(
          `UPDATE player_states SET turns_data = $2, updated_at = now() WHERE id = $1`,
          [row.id, JSON.stringify(updatedTurns)]
        );
        turnsGenerated += totalNew;
      } catch (e) {
        errors++;
      }
      playersProcessed++;
    }

    const durationMs = Date.now() - startTime;
    await recordGameTick("turns", { durationMs, playersProcessed, turnsGenerated, errors });

    return { success: true, recordsProcessed: playersProcessed, recordsAffected: turnsGenerated, metadata: { durationMs, errors } };
  } catch (error: any) {
    await recordGameTick("turns", { durationMs: Date.now() - startTime, errors: 1 });
    return { success: false, message: error.message };
  }
}

async function constructionTickHandler(_job: any, params: any): Promise<CronJobResult> {
  const startTime = Date.now();
  let playersProcessed = 0;
  let constructionsCompleted = 0;
  let errors = 0;

  try {
    const result = await pool.query(
      `SELECT id, cron_jobs, buildings
       FROM player_states
       WHERE jsonb_array_length(cron_jobs) > 0
       LIMIT $1`,
      [params.maxPlayersPerTick || 100]
    );

    for (const row of result.rows) {
      try {
        const queue = row.cron_jobs || [];
        const now = Date.now();
        const completed: any[] = [];
        const remaining: any[] = [];
        const updates: Record<string, any> = {};
        const buildings = { ...(row.buildings || {}) };

        for (const item of queue) {
          if (item.completeAt && new Date(item.completeAt).getTime() <= now) {
            completed.push(item);
            if (item.type === "building" && item.buildingType) {
              buildings[item.buildingType] = (buildings[item.buildingType] || 0) + 1;
            }
          } else {
            remaining.push(item);
          }
        }

        if (completed.length > 0) {
          updates.cron_jobs = remaining;
          updates.buildings = buildings;
          await pool.query(
            `UPDATE player_states SET cron_jobs = $2, buildings = $3, updated_at = now() WHERE id = $1`,
            [row.id, JSON.stringify(remaining), JSON.stringify(buildings)]
          );
          constructionsCompleted += completed.length;
        }
      } catch (e) {
        errors++;
      }
      playersProcessed++;
    }

    const durationMs = Date.now() - startTime;
    await recordGameTick("construction", { durationMs, playersProcessed, constructionsCompleted, errors });

    return { success: true, recordsProcessed: playersProcessed, recordsAffected: constructionsCompleted, metadata: { durationMs, errors } };
  } catch (error: any) {
    await recordGameTick("construction", { durationMs: Date.now() - startTime, errors: 1 });
    return { success: false, message: error.message };
  }
}

async function dailyResetHandler(_job: any, params: any): Promise<CronJobResult> {
  const startTime = Date.now();
  let affected = 0;

  try {
    const loginBonusCredits = params.loginBonusCredits || 500;
    const loginBonusMetal = params.loginBonusMetal || 1000;

    const result = await pool.query(
      `UPDATE player_states
       SET resources = jsonb_set(
         jsonb_set(resources, '{credits}', to_jsonb((COALESCE((resources->>'credits')::int, 0) + $1))),
         '{metal}', to_jsonb((COALESCE((resources->>'metal')::int, 0) + $2))
       ),
       updated_at = now()
       WHERE updated_at > now() - interval '7 days'
       RETURNING id`,
      [loginBonusCredits, loginBonusMetal]
    );

    affected = result.rowCount || 0;

    await recordGameTick("daily_reset", {
      durationMs: Date.now() - startTime,
      playersProcessed: affected,
      resourcesUpdated: affected,
    });

    return { success: true, recordsProcessed: affected, recordsAffected: affected };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

async function weeklyResetHandler(_job: any, _params: any): Promise<CronJobResult> {
  const startTime = Date.now();

  try {
    await pool.query(
      `UPDATE player_states
       SET weekly_missions_completed = 0,
           weekly_missions_claimed = false,
           updated_at = now()
       WHERE updated_at > now() - interval '30 days'`
    );

    await recordGameTick("weekly_reset", { durationMs: Date.now() - startTime });

    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

async function marketTickHandler(_job: any, params: any): Promise<CronJobResult> {
  const startTime = Date.now();

  try {
    const priceVolatility = params.priceVolatility || 0.05;

    const result = await pool.query(
      `SELECT id, travel_state FROM player_states WHERE travel_state IS NOT NULL LIMIT 10`
    );

    let updated = 0;
    for (const row of result.rows) {
      const travelState = row.travel_state || {};
      const orders = travelState.resourceOrders || [];
      if (orders.length === 0) continue;

      const updatedOrders = orders.map((order: any) => {
        const priceChange = 1 + (Math.random() - 0.5) * priceVolatility;
        return { ...order, currentPrice: Math.floor((order.currentPrice || order.price || 100) * priceChange) };
      });

      await pool.query(
        `UPDATE player_states SET travel_state = jsonb_set(travel_state, '{resourceOrders}', $2) WHERE id = $1`,
        [row.id, JSON.stringify(updatedOrders)]
      );
      updated++;
    }

    const durationMs = Date.now() - startTime;
    await recordGameTick("market", { durationMs, recordsAffected: updated });

    return { success: true, recordsAffected: updated };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

async function maintenanceTickHandler(_job: any, params: any): Promise<CronJobResult> {
  const startTime = Date.now();
  let cleaned = 0;

  try {
    const logRetentionDays = params.logRetentionDays || 7;

    const logResult = await pool.query(
      `DELETE FROM server_cron_logs WHERE started_at < now() - ($1 || ' days')::interval`,
      [logRetentionDays]
    );
    cleaned += logResult.rowCount || 0;

    const tickResult = await pool.query(
      `DELETE FROM server_game_ticks WHERE started_at < now() - ($1 || ' days')::interval`,
      [logRetentionDays]
    );
    cleaned += tickResult.rowCount || 0;

    await pool.query(`DELETE FROM sessions WHERE expire < now()`);

    const durationMs = Date.now() - startTime;
    await recordGameTick("maintenance", { durationMs, recordsAffected: cleaned });

    return { success: true, recordsAffected: cleaned };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

async function refineryTickHandler(_job: any, params: any): Promise<CronJobResult> {
  const startTime = Date.now();
  let playersProcessed = 0;
  let errors = 0;

  try {
    const result = await pool.query(
      `SELECT id, resources FROM player_states
       WHERE updated_at > now() - interval '7 days'
       LIMIT $1`,
      [params.maxPlayersPerTick || 50]
    );

    for (const row of result.rows) {
      try {
        const resources = row.resources || {};
        if (resources.refineryProduction && Object.keys(resources.refineryProduction).length > 0) {
          for (const [resource, amount] of Object.entries(resources.refineryProduction)) {
            if (typeof amount === "number" && amount > 0) {
              resources[resource] = (resources[resource] || 0) + amount;
            }
          }
          await pool.query(
            `UPDATE player_states SET resources = $2, updated_at = now() WHERE id = $1`,
            [row.id, JSON.stringify(resources)]
          );
        }
      } catch (e) {
        errors++;
      }
      playersProcessed++;
    }

    const durationMs = Date.now() - startTime;
    await recordGameTick("refinery", { durationMs, playersProcessed, errors });

    return { success: true, recordsProcessed: playersProcessed, metadata: { durationMs, errors } };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

async function anomalyRespawnHandler(_job: any, _params: any): Promise<CronJobResult> {
  const startTime = Date.now();

  try {
    const result = await pool.query(
      `UPDATE dimensional_anomalies
       SET cooldown_until = NULL, updated_at = now()
       WHERE cooldown_until IS NOT NULL AND cooldown_until < now()`
    );

    const durationMs = Date.now() - startTime;
    await recordGameTick("anomaly_respawn", { durationMs, recordsAffected: result.rowCount || 0 });

    return { success: true, recordsAffected: result.rowCount || 0 };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}
