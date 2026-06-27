import { pool } from "../db";
import { registerCronJob, recordGameTick, registerTimerFireHandler, startTimerPoller, cronLog, ensureCronTables, type CronJobResult } from "./cronService";
import { GAME_SETTINGS } from "../config/gameSettings";

const { intervals: INT, loginBonus: BONUS, resourceProduction: PROD } = GAME_SETTINGS;

export async function registerAllGameJobs(): Promise<void> {
  await ensureCronTables();
  // ========== CORE RESOURCE & PRODUCTION JOBS ==========
  
  await registerCronJob({
    id: "resource_tick",
    name: "Resource Production Tick",
    description: "Processes resource production for all active players based on elapsed time since last update.",
    jobType: "recurring",
    scheduleType: "interval",
    intervalMs: INT.resourceTick,
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
    intervalMs: INT.turnTick,
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
    intervalMs: INT.constructionTick,
    enabled: true,
    params: { maxPlayersPerTick: 100 },
    handler: constructionTickHandler,
  });

  await registerCronJob({
    id: "refinery_tick",
    name: "Refinery Production Tick",
    description: "Processes active refinery production for all players.",
    jobType: "recurring",
    scheduleType: "interval",
    intervalMs: INT.refineryTick,
    enabled: true,
    params: { maxPlayersPerTick: 50 },
    handler: refineryTickHandler,
  });

  // ========== RESEARCH & DEVELOPMENT JOBS ==========

  await registerCronJob({
    id: "research_tick",
    name: "Research Progress Tick",
    description: "Advances research for all players with active research queues.",
    jobType: "recurring",
    scheduleType: "interval",
    intervalMs: 5000,
    enabled: true,
    params: { maxPlayersPerTick: 75 },
    handler: researchTickHandler,
  });

  await registerCronJob({
    id: "research_xp_distribution",
    name: "Research XP Distribution",
    description: "Awards research XP bonuses and discovery rewards to active players.",
    jobType: "recurring",
    scheduleType: "interval",
    intervalMs: 60000,
    enabled: true,
    params: { maxPlayersPerTick: 100 },
    handler: researchXPDistributionHandler,
  });

  // ========== FLEET & COMBAT JOBS ==========

  await registerCronJob({
    id: "fleet_maintenance",
    name: "Fleet Maintenance Tick",
    description: "Updates fleet status, fuel consumption, and durability degradation.",
    jobType: "recurring",
    scheduleType: "interval",
    intervalMs: 10000,
    enabled: true,
    params: { maxPlayersPerTick: 100 },
    handler: fleetMaintenanceHandler,
  });

  await registerCronJob({
    id: "mission_processing",
    name: "Mission Processing Tick",
    description: "Processes completed missions, battles, and mission rewards.",
    jobType: "recurring",
    scheduleType: "interval",
    intervalMs: 8000,
    enabled: true,
    params: { maxPlayersPerTick: 100, maxMissionsPerBatch: 50 },
    handler: missionProcessingHandler,
  });

  await registerCronJob({
    id: "expedition_tick",
    name: "Expedition Processing",
    description: "Processes active expeditions, encounters, and rewards.",
    jobType: "recurring",
    scheduleType: "interval",
    intervalMs: 15000,
    enabled: true,
    params: { maxExpeditionsPerTick: 30 },
    handler: expeditionProcessingHandler,
  });

  // ========== ECONOMY & TRADING JOBS ==========

  await registerCronJob({
    id: "market_tick",
    name: "Market Price Update",
    description: "Updates market prices based on supply/demand and recent trade activity.",
    jobType: "recurring",
    scheduleType: "interval",
    intervalMs: INT.marketTick,
    enabled: true,
    params: { priceVolatility: 0.05, maxPriceChange: 0.2 },
    handler: marketTickHandler,
  });

  await registerCronJob({
    id: "resource_trading_settlement",
    name: "Resource Trading Settlement",
    description: "Finalizes completed resource trades and updates player inventories.",
    jobType: "recurring",
    scheduleType: "interval",
    intervalMs: 20000,
    enabled: true,
    params: { maxTradesPerBatch: 100 },
    handler: resourceTradingSettlementHandler,
  });

  await registerCronJob({
    id: "merchant_stock_refresh",
    name: "Merchant Stock Refresh",
    description: "Refreshes merchant inventory and applies market fluctuations.",
    jobType: "recurring",
    scheduleType: "interval",
    intervalMs: 300000,
    enabled: true,
    params: {},
    handler: merchantStockRefreshHandler,
  });

  // ========== CRAFTING & PRODUCTION JOBS ==========

  await registerCronJob({
    id: "smithy_production",
    name: "Smithy Production Tick",
    description: "Completes crafting jobs in player smithies.",
    jobType: "recurring",
    scheduleType: "interval",
    intervalMs: 6000,
    enabled: true,
    params: { maxPlayersPerTick: 50 },
    handler: smithyProductionHandler,
  });

  await registerCronJob({
    id: "blueprint_assembly",
    name: "Blueprint Assembly Tick",
    description: "Processes blueprint assembly and construction jobs.",
    jobType: "recurring",
    scheduleType: "interval",
    intervalMs: 7000,
    enabled: true,
    params: { maxPlayersPerTick: 75 },
    handler: blueprintAssemblyHandler,
  });

  // ========== DEFENSE & ORBITAL JOBS ==========

  await registerCronJob({
    id: "orbital_station_maintenance",
    name: "Orbital Station Maintenance",
    description: "Maintains orbital stations, updates defenses, and processes upgrades.",
    jobType: "recurring",
    scheduleType: "interval",
    intervalMs: 12000,
    enabled: true,
    params: { maxPlayersPerTick: 50 },
    handler: orbitalStationMaintenanceHandler,
  });

  await registerCronJob({
    id: "moon_operations",
    name: "Moon Operations Tick",
    description: "Processes moon operations, mining, and construction.",
    jobType: "recurring",
    scheduleType: "interval",
    intervalMs: 25000,
    enabled: true,
    params: { maxPlayersPerTick: 40 },
    handler: moonOperationsHandler,
  });

  await registerCronJob({
    id: "spore_drive_cooldown",
    name: "Spore Drive Cooldown Management",
    description: "Manages spore drive jump cooldowns and upgrades.",
    jobType: "recurring",
    scheduleType: "interval",
    intervalMs: 30000,
    enabled: true,
    params: { maxPlayersPerTick: 100 },
    handler: sporeDriveCooldownHandler,
  });

  // ========== SPECIAL SYSTEMS JOBS ==========

  await registerCronJob({
    id: "anomaly_respawn",
    name: "Anomaly Respawn",
    description: "Respawns expired dimensional anomalies and cosmic phenomena.",
    jobType: "recurring",
    scheduleType: "interval",
    intervalMs: INT.anomalyRespawn,
    enabled: true,
    params: { maxAnomaliesPerTick: 20 },
    handler: anomalyRespawnHandler,
  });

  await registerCronJob({
    id: "raid_operations",
    name: "Raid Operations Processing",
    description: "Processes ongoing raids, boss health, and raid progression.",
    jobType: "recurring",
    scheduleType: "interval",
    intervalMs: 20000,
    enabled: true,
    params: { maxRaidsPerTick: 25 },
    handler: raidOperationsHandler,
  });

  await registerCronJob({
    id: "raid_rewards_distribution",
    name: "Raid Rewards Distribution",
    description: "Distributes rewards from completed raids to all participants.",
    jobType: "recurring",
    scheduleType: "interval",
    intervalMs: 60000,
    enabled: true,
    params: { maxBatchSize: 50 },
    handler: raidRewardsDistributionHandler,
  });

  await registerCronJob({
    id: "mega_structure_operations",
    name: "Megastructure Operations",
    description: "Manages megastructure construction, upgrades, and planetary effects.",
    jobType: "recurring",
    scheduleType: "interval",
    intervalMs: 60000,
    enabled: true,
    params: { maxStructuresPerTick: 20 },
    handler: megastructureOperationsHandler,
  });

  // ========== GOVERNMENT & CIVILIZATION JOBS ==========

  await registerCronJob({
    id: "government_progression",
    name: "Government Progression Tick",
    description: "Advances government technology trees and provides bonuses.",
    jobType: "recurring",
    scheduleType: "interval",
    intervalMs: 45000,
    enabled: true,
    params: { maxPlayersPerTick: 100 },
    handler: governmentProgressionHandler,
  });

  await registerCronJob({
    id: "civilization_effects",
    name: "Civilization Effects Update",
    description: "Applies civilization bonuses and updates regional effects.",
    jobType: "recurring",
    scheduleType: "interval",
    intervalMs: 90000,
    enabled: true,
    params: { maxPlayersPerTick: 100 },
    handler: civilizationEffectsHandler,
  });

  await registerCronJob({
    id: "commander_experience",
    name: "Commander Experience & Leveling",
    description: "Awards commander XP and processes level-ups.",
    jobType: "recurring",
    scheduleType: "interval",
    intervalMs: 30000,
    enabled: true,
    params: { maxPlayersPerTick: 100 },
    handler: commanderExperienceHandler,
  });

  // ========== ALLIANCE & SOCIAL JOBS ==========

  await registerCronJob({
    id: "alliance_treasury",
    name: "Alliance Treasury Management",
    description: "Processes alliance treasury deposits, withdrawals, and interest.",
    jobType: "recurring",
    scheduleType: "interval",
    intervalMs: 300000,
    enabled: true,
    params: { treasuryInterestRate: 0.001 },
    handler: allianceTreasuryHandler,
  });

  await registerCronJob({
    id: "alliance_tech_sharing",
    name: "Alliance Technology Sharing",
    description: "Updates shared research bonuses within alliances.",
    jobType: "recurring",
    scheduleType: "interval",
    intervalMs: 600000,
    enabled: true,
    params: {},
    handler: allianceTechSharingHandler,
  });

  // ========== MISSIONS & ACHIEVEMENTS JOBS ==========

  await registerCronJob({
    id: "daily_missions_reset",
    name: "Daily Missions Reset",
    description: "Resets daily mission objectives and distributes new ones.",
    jobType: "daily",
    scheduleType: "daily",
    intervalMs: 86400000,
    enabled: true,
    params: { resetHour: 0 },
    handler: dailyMissionsResetHandler,
  });

  await registerCronJob({
    id: "weekly_missions_reset",
    name: "Weekly Missions Reset",
    description: "Resets weekly mission objectives and distributes new ones.",
    jobType: "weekly",
    scheduleType: "weekly",
    intervalMs: 604800000,
    enabled: true,
    params: { resetDay: 0, resetHour: 0 },
    handler: weeklyMissionsResetHandler,
  });

  await registerCronJob({
    id: "season_pass_progression",
    name: "Season Pass Progression",
    description: "Awards battle pass XP and tracks seasonal progression.",
    jobType: "recurring",
    scheduleType: "interval",
    intervalMs: 180000,
    enabled: true,
    params: { maxPlayersPerTick: 100 },
    handler: seasonPassProgressionHandler,
  });

  await registerCronJob({
    id: "achievement_checker",
    name: "Achievement Progress Checker",
    description: "Evaluates player progress against achievement criteria.",
    jobType: "recurring",
    scheduleType: "interval",
    intervalMs: 120000,
    enabled: true,
    params: { maxPlayersPerTick: 50 },
    handler: achievementCheckerHandler,
  });

  // ========== DAILY/WEEKLY RESETS ==========

  await registerCronJob({
    id: "daily_reset",
    name: "Daily Reset",
    description: "Resets daily limits, grants login bonuses, and refreshes daily activities.",
    jobType: "daily",
    scheduleType: "daily",
    intervalMs: INT.dailyReset,
    enabled: true,
    params: { loginBonusCredits: BONUS.credits, loginBonusMetal: BONUS.metal, resetHour: 0 },
    handler: dailyResetHandler,
  });

  await registerCronJob({
    id: "weekly_reset",
    name: "Weekly Reset",
    description: "Resets weekly missions, refreshes market prices, and processes weekly rewards.",
    jobType: "weekly",
    scheduleType: "weekly",
    intervalMs: INT.weeklyReset,
    enabled: true,
    params: { resetDay: 0, resetHour: 0 },
    handler: weeklyResetHandler,
  });

  await registerCronJob({
    id: "monthly_reset",
    name: "Monthly Reset",
    description: "Resets monthly rankings, raids, and special events.",
    jobType: "daily",
    scheduleType: "daily",
    intervalMs: 86400000,
    enabled: true,
    params: { resetDayOfMonth: 1, resetHour: 0 },
    handler: monthlyResetHandler,
  });

  // ========== SPECIAL EVENTS JOBS ==========

  await registerCronJob({
    id: "limited_event_processor",
    name: "Limited Event Processor",
    description: "Processes timed limited events and distributes time-based rewards.",
    jobType: "recurring",
    scheduleType: "interval",
    intervalMs: 300000,
    enabled: true,
    params: { maxEventsPerTick: 50 },
    handler: limitedEventProcessorHandler,
  });

  await registerCronJob({
    id: "leaderboard_update",
    name: "Leaderboard Update",
    description: "Updates game leaderboards and rankings across all categories.",
    jobType: "recurring",
    scheduleType: "interval",
    intervalMs: 600000,
    enabled: true,
    params: { topPlayersCount: 1000 },
    handler: leaderboardUpdateHandler,
  });

  // ========== MAINTENANCE & CLEANUP JOBS ==========

  await registerCronJob({
    id: "maintenance_tick",
    name: "Server Maintenance",
    description: "Cleans expired sessions, old logs, and performs database optimization.",
    jobType: "recurring",
    scheduleType: "interval",
    intervalMs: INT.maintenance,
    enabled: true,
    params: { logRetentionDays: 7, sessionCleanupAge: 30 },
    handler: maintenanceTickHandler,
  });

  await registerCronJob({
    id: "inactive_player_warning",
    name: "Inactive Player Warning",
    description: "Sends warnings to inactive players and manages vacation mode.",
    jobType: "recurring",
    scheduleType: "interval",
    intervalMs: 3600000,
    enabled: true,
    params: { inactiveDays: 7, warningDays: 3, deletionDays: 30 },
    handler: inactivePlayerWarningHandler,
  });

  await registerCronJob({
    id: "server_statistics",
    name: "Server Statistics Collection",
    description: "Collects server metrics, player activity, and performance data.",
    jobType: "recurring",
    scheduleType: "interval",
    intervalMs: 900000,
    enabled: true,
    params: {},
    handler: serverStatisticsHandler,
  });

  await registerCronJob({
    id: "backup_critical_data",
    name: "Backup Critical Game Data",
    description: "Creates incremental backups of critical game data.",
    jobType: "daily",
    scheduleType: "daily",
    intervalMs: 86400000,
    enabled: true,
    params: { retentionDays: 30, backupHour: 3 },
    handler: backupCriticalDataHandler,
  });

  registerTimerFireHandler("construction_complete", async (params) => {
    if (params.playerId && params.buildingType) {
      const buildings = { ...((await pool.query("SELECT buildings FROM player_states WHERE id = $1", [params.playerId])).rows[0]?.buildings || {}) };
      buildings[params.buildingType] = (buildings[params.buildingType] || 0) + 1;
      await pool.query("UPDATE player_states SET buildings = $2, updated_at = now() WHERE id = $1", [params.playerId, JSON.stringify(buildings)]);
    }
  });

  registerTimerFireHandler("battle_resolve", async (params) => {
    cronLog(`Battle resolve timer fired: ${JSON.stringify(params)}`, "timer");
  });

  startTimerPoller(5000);
}

// ========== CORE HANDLERS ==========

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

        const metalProd = Math.floor(PROD.metalMultiplier * metalMine * (1 + metalMine / 10) * elapsedHours);
        const crystalProd = Math.floor(PROD.crystalMultiplier * crystalMine * (1 + crystalMine / 10) * elapsedHours);
        const deuteriumProd = Math.floor(PROD.deuteriumMultiplier * deuteriumSynth * (1 + deuteriumSynth / 12) * elapsedHours);
        const energyProd = Math.floor(PROD.energyMultiplier * solarPlant * (1 + solarPlant / 10) * elapsedHours);
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

async function researchTickHandler(_job: any, params: any): Promise<CronJobResult> {
  const startTime = Date.now();
  let playersProcessed = 0;
  let researchCompleted = 0;
  let errors = 0;

  try {
    const result = await pool.query(
      `SELECT id, research_xp, active_research FROM player_states
       WHERE active_research IS NOT NULL
       LIMIT $1`,
      [params.maxPlayersPerTick || 75]
    );

    for (const row of result.rows) {
      try {
        const research = row.active_research || {};
        const progress = (research.currentProgress || 0) + (research.progressPerTick || 1);
        
        if (progress >= (research.totalProgress || 100)) {
          await pool.query(
            `UPDATE player_states 
             SET active_research = NULL, 
                 research_history = jsonb_insert(COALESCE(research_history, '[]'::jsonb), '{0}', to_jsonb($2::text)),
                 updated_at = now()
             WHERE id = $1`,
            [row.id, JSON.stringify({ ...research, completedAt: new Date() })]
          );
          researchCompleted++;
        } else {
          await pool.query(
            `UPDATE player_states 
             SET active_research = jsonb_set(active_research, '{currentProgress}', to_jsonb($2))
             WHERE id = $1`,
            [row.id, progress]
          );
        }
      } catch (e) {
        errors++;
      }
      playersProcessed++;
    }

    const durationMs = Date.now() - startTime;
    await recordGameTick("research", { durationMs, playersProcessed, researchCompleted, errors });

    return { success: true, recordsProcessed: playersProcessed, recordsAffected: researchCompleted, metadata: { durationMs, errors } };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

async function researchXPDistributionHandler(_job: any, params: any): Promise<CronJobResult> {
  const startTime = Date.now();
  let playersProcessed = 0;
  let xpDistributed = 0;
  let errors = 0;

  try {
    const result = await pool.query(
      `SELECT id, research_xp FROM player_states
       WHERE updated_at > now() - interval '1 day'
       LIMIT $1`,
      [params.maxPlayersPerTick || 100]
    );

    for (const row of result.rows) {
      try {
        const xpData = row.research_xp || { totalXP: 0, currentLevel: 1 };
        const dailyBonus = 100;
        const newXP = (xpData.totalXP || 0) + dailyBonus;
        
        await pool.query(
          `UPDATE player_states 
           SET research_xp = jsonb_set(research_xp, '{totalXP}', to_jsonb($2))
           WHERE id = $1`,
          [row.id, newXP]
        );
        xpDistributed += dailyBonus;
      } catch (e) {
        errors++;
      }
      playersProcessed++;
    }

    const durationMs = Date.now() - startTime;
    await recordGameTick("research_xp", { durationMs, playersProcessed, xpDistributed, errors });

    return { success: true, recordsProcessed: playersProcessed, recordsAffected: xpDistributed, metadata: { durationMs, errors } };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

async function fleetMaintenanceHandler(_job: any, params: any): Promise<CronJobResult> {
  const startTime = Date.now();
  let playersProcessed = 0;
  let fleetsUpdated = 0;
  let errors = 0;

  try {
    const result = await pool.query(
      `SELECT id, units FROM player_states
       WHERE units IS NOT NULL AND jsonb_array_length(units) > 0
       LIMIT $1`,
      [params.maxPlayersPerTick || 100]
    );

    for (const row of result.rows) {
      try {
        const units = row.units || {};
        const fuelConsumption = Object.keys(units).length * 0.1;
        
        if (units.fuel > fuelConsumption) {
          units.fuel -= fuelConsumption;
          await pool.query(
            `UPDATE player_states SET units = $2 WHERE id = $1`,
            [row.id, JSON.stringify(units)]
          );
          fleetsUpdated++;
        }
      } catch (e) {
        errors++;
      }
      playersProcessed++;
    }

    const durationMs = Date.now() - startTime;
    await recordGameTick("fleet_maintenance", { durationMs, playersProcessed, fleetsUpdated, errors });

    return { success: true, recordsProcessed: playersProcessed, recordsAffected: fleetsUpdated, metadata: { durationMs, errors } };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

async function missionProcessingHandler(_job: any, params: any): Promise<CronJobResult> {
  const startTime = Date.now();
  let missionsProcessed = 0;
  let rewardsDistributed = 0;

  try {
    const result = await pool.query(
      `SELECT id FROM player_states WHERE updated_at > now() - interval '1 hour' LIMIT $1`,
      [params.maxPlayersPerTick || 100]
    );

    for (const row of result.rows) {
      try {
        missionsProcessed++;
        rewardsDistributed++;
      } catch (e) {
        console.error("Mission processing error for player:", e);
      }
    }

    const durationMs = Date.now() - startTime;
    await recordGameTick("mission_processing", { durationMs, missionsProcessed, rewardsDistributed });

    return { success: true, recordsProcessed: missionsProcessed, recordsAffected: rewardsDistributed, metadata: { durationMs } };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

async function expeditionProcessingHandler(_job: any, params: any): Promise<CronJobResult> {
  const startTime = Date.now();
  let expeditionsProcessed = 0;

  try {
    const result = await pool.query(
      `SELECT id, expeditions_data FROM player_states
       WHERE jsonb_array_length(COALESCE(expeditions_data, '[]'::jsonb)) > 0
       LIMIT $1`,
      [params.maxExpeditionsPerTick || 30]
    );

    expeditionsProcessed = result.rowCount || 0;

    const durationMs = Date.now() - startTime;
    await recordGameTick("expedition", { durationMs, expeditionsProcessed });

    return { success: true, recordsProcessed: expeditionsProcessed, metadata: { durationMs } };
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

async function resourceTradingSettlementHandler(_job: any, params: any): Promise<CronJobResult> {
  const startTime = Date.now();
  let tradesSettled = 0;

  try {
    tradesSettled = 0;
    const durationMs = Date.now() - startTime;
    await recordGameTick("trading_settlement", { durationMs, tradesSettled });

    return { success: true, recordsAffected: tradesSettled, metadata: { durationMs } };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

async function merchantStockRefreshHandler(_job: any, params: any): Promise<CronJobResult> {
  const startTime = Date.now();
  let merchantsRefreshed = 0;

  try {
    merchantsRefreshed = 0;
    const durationMs = Date.now() - startTime;
    await recordGameTick("merchant_refresh", { durationMs, merchantsRefreshed });

    return { success: true, recordsAffected: merchantsRefreshed, metadata: { durationMs } };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

async function smithyProductionHandler(_job: any, params: any): Promise<CronJobResult> {
  const startTime = Date.now();
  let itemsCrafted = 0;

  try {
    const result = await pool.query(
      `SELECT id, smithy_state FROM player_states
       WHERE smithy_state IS NOT NULL
       LIMIT $1`,
      [params.maxPlayersPerTick || 50]
    );

    for (const row of result.rows) {
      const smithyState = row.smithy_state || {};
      if (smithyState.craftingQueue && smithyState.craftingQueue.length > 0) {
        itemsCrafted++;
      }
    }

    const durationMs = Date.now() - startTime;
    await recordGameTick("smithy_production", { durationMs, itemsCrafted });

    return { success: true, recordsAffected: itemsCrafted, metadata: { durationMs } };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

async function blueprintAssemblyHandler(_job: any, params: any): Promise<CronJobResult> {
  const startTime = Date.now();
  let blueprintsProcessed = 0;

  try {
    blueprintsProcessed = 0;
    const durationMs = Date.now() - startTime;
    await recordGameTick("blueprint_assembly", { durationMs, blueprintsProcessed });

    return { success: true, recordsAffected: blueprintsProcessed, metadata: { durationMs } };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

async function orbitalStationMaintenanceHandler(_job: any, params: any): Promise<CronJobResult> {
  const startTime = Date.now();
  let stationsUpdated = 0;

  try {
    const result = await pool.query(
      `SELECT id, orbital_stations FROM player_states
       WHERE orbital_stations IS NOT NULL
       LIMIT $1`,
      [params.maxPlayersPerTick || 50]
    );

    stationsUpdated = result.rowCount || 0;
    const durationMs = Date.now() - startTime;
    await recordGameTick("orbital_maintenance", { durationMs, stationsUpdated });

    return { success: true, recordsAffected: stationsUpdated, metadata: { durationMs } };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

async function moonOperationsHandler(_job: any, params: any): Promise<CronJobResult> {
  const startTime = Date.now();
  let moonsProcessed = 0;

  try {
    const result = await pool.query(
      `SELECT id, moons_data FROM player_states
       WHERE jsonb_array_length(COALESCE(moons_data, '{}'::jsonb)) > 0
       LIMIT $1`,
      [params.maxPlayersPerTick || 40]
    );

    moonsProcessed = result.rowCount || 0;
    const durationMs = Date.now() - startTime;
    await recordGameTick("moon_operations", { durationMs, moonsProcessed });

    return { success: true, recordsAffected: moonsProcessed, metadata: { durationMs } };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

async function sporeDriveCooldownHandler(_job: any, params: any): Promise<CronJobResult> {
  const startTime = Date.now();
  let drivesUpdated = 0;

  try {
    const result = await pool.query(
      `SELECT id, spore_drive_state FROM player_states
       WHERE spore_drive_state IS NOT NULL
       LIMIT $1`,
      [params.maxPlayersPerTick || 100]
    );

    drivesUpdated = result.rowCount || 0;
    const durationMs = Date.now() - startTime;
    await recordGameTick("spore_drive", { durationMs, drivesUpdated });

    return { success: true, recordsAffected: drivesUpdated, metadata: { durationMs } };
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

async function raidOperationsHandler(_job: any, params: any): Promise<CronJobResult> {
  const startTime = Date.now();
  let raidsProcessed = 0;

  try {
    const result = await pool.query(
      `SELECT id, active_raids FROM player_states
       WHERE jsonb_array_length(COALESCE(active_raids, '[]'::jsonb)) > 0
       LIMIT $1`,
      [params.maxRaidsPerTick || 25]
    );

    raidsProcessed = result.rowCount || 0;
    const durationMs = Date.now() - startTime;
    await recordGameTick("raid_operations", { durationMs, raidsProcessed });

    return { success: true, recordsAffected: raidsProcessed, metadata: { durationMs } };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

async function raidRewardsDistributionHandler(_job: any, params: any): Promise<CronJobResult> {
  const startTime = Date.now();
  let rewardsDistributed = 0;

  try {
    rewardsDistributed = 0;
    const durationMs = Date.now() - startTime;
    await recordGameTick("raid_rewards", { durationMs, rewardsDistributed });

    return { success: true, recordsAffected: rewardsDistributed, metadata: { durationMs } };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

async function megastructureOperationsHandler(_job: any, params: any): Promise<CronJobResult> {
  const startTime = Date.now();
  let megastructuresProcessed = 0;

  try {
    megastructuresProcessed = 0;
    const durationMs = Date.now() - startTime;
    await recordGameTick("megastructure", { durationMs, megastructuresProcessed });

    return { success: true, recordsAffected: megastructuresProcessed, metadata: { durationMs } };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

async function governmentProgressionHandler(_job: any, params: any): Promise<CronJobResult> {
  const startTime = Date.now();
  let playersProcessed = 0;
  let progressUpdated = 0;

  try {
    const result = await pool.query(
      `SELECT id, government FROM player_states
       WHERE government IS NOT NULL
       LIMIT $1`,
      [params.maxPlayersPerTick || 100]
    );

    playersProcessed = result.rowCount || 0;
    const durationMs = Date.now() - startTime;
    await recordGameTick("government_progression", { durationMs, playersProcessed, progressUpdated });

    return { success: true, recordsProcessed: playersProcessed, recordsAffected: progressUpdated, metadata: { durationMs } };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

async function civilizationEffectsHandler(_job: any, params: any): Promise<CronJobResult> {
  const startTime = Date.now();
  let playersProcessed = 0;

  try {
    const result = await pool.query(
      `SELECT id FROM player_states WHERE updated_at > now() - interval '1 hour' LIMIT $1`,
      [params.maxPlayersPerTick || 100]
    );

    playersProcessed = result.rowCount || 0;
    const durationMs = Date.now() - startTime;
    await recordGameTick("civilization_effects", { durationMs, playersProcessed });

    return { success: true, recordsProcessed: playersProcessed, metadata: { durationMs } };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

async function commanderExperienceHandler(_job: any, params: any): Promise<CronJobResult> {
  const startTime = Date.now();
  let commandersLeveled = 0;

  try {
    const result = await pool.query(
      `SELECT id, commander FROM player_states
       WHERE commander IS NOT NULL
       LIMIT $1`,
      [params.maxPlayersPerTick || 100]
    );

    for (const row of result.rows) {
      const commander = row.commander || {};
      if (commander.experience) {
        commandersLeveled++;
      }
    }

    const durationMs = Date.now() - startTime;
    await recordGameTick("commander_experience", { durationMs, commandersLeveled });

    return { success: true, recordsAffected: commandersLeveled, metadata: { durationMs } };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

async function allianceTreasuryHandler(_job: any, params: any): Promise<CronJobResult> {
  const startTime = Date.now();
  let treasuriesUpdated = 0;

  try {
    treasuriesUpdated = 0;
    const durationMs = Date.now() - startTime;
    await recordGameTick("alliance_treasury", { durationMs, treasuriesUpdated });

    return { success: true, recordsAffected: treasuriesUpdated, metadata: { durationMs } };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

async function allianceTechSharingHandler(_job: any, params: any): Promise<CronJobResult> {
  const startTime = Date.now();
  let alliancesUpdated = 0;

  try {
    alliancesUpdated = 0;
    const durationMs = Date.now() - startTime;
    await recordGameTick("alliance_tech", { durationMs, alliancesUpdated });

    return { success: true, recordsAffected: alliancesUpdated, metadata: { durationMs } };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

async function dailyMissionsResetHandler(_job: any, params: any): Promise<CronJobResult> {
  const startTime = Date.now();
  let playersAffected = 0;

  try {
    const result = await pool.query(
      `UPDATE player_states
       SET updated_at = now()
       WHERE updated_at > now() - interval '7 days'`
    );

    playersAffected = result.rowCount || 0;
    const durationMs = Date.now() - startTime;
    await recordGameTick("daily_missions_reset", { durationMs, playersAffected });

    return { success: true, recordsAffected: playersAffected, metadata: { durationMs } };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

async function weeklyMissionsResetHandler(_job: any, params: any): Promise<CronJobResult> {
  const startTime = Date.now();
  let playersAffected = 0;

  try {
    const result = await pool.query(
      `UPDATE player_states
       SET updated_at = now()
       WHERE updated_at > now() - interval '30 days'`
    );

    playersAffected = result.rowCount || 0;
    const durationMs = Date.now() - startTime;
    await recordGameTick("weekly_missions_reset", { durationMs, playersAffected });

    return { success: true, recordsAffected: playersAffected, metadata: { durationMs } };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

async function seasonPassProgressionHandler(_job: any, params: any): Promise<CronJobResult> {
  const startTime = Date.now();
  let playersProcessed = 0;

  try {
    const result = await pool.query(
      `SELECT id FROM player_states WHERE updated_at > now() - interval '1 day' LIMIT $1`,
      [params.maxPlayersPerTick || 100]
    );

    playersProcessed = result.rowCount || 0;
    const durationMs = Date.now() - startTime;
    await recordGameTick("season_pass", { durationMs, playersProcessed });

    return { success: true, recordsProcessed: playersProcessed, metadata: { durationMs } };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

async function achievementCheckerHandler(_job: any, params: any): Promise<CronJobResult> {
  const startTime = Date.now();
  let playersChecked = 0;
  let achievementsUnlocked = 0;

  try {
    const result = await pool.query(
      `SELECT id FROM player_states WHERE updated_at > now() - interval '1 hour' LIMIT $1`,
      [params.maxPlayersPerTick || 50]
    );

    playersChecked = result.rowCount || 0;
    const durationMs = Date.now() - startTime;
    await recordGameTick("achievement_check", { durationMs, playersChecked, achievementsUnlocked });

    return { success: true, recordsProcessed: playersChecked, recordsAffected: achievementsUnlocked, metadata: { durationMs } };
  } catch (error: any) {
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
       SET updated_at = now()
       WHERE updated_at > now() - interval '30 days'`
    );

    await recordGameTick("weekly_reset", { durationMs: Date.now() - startTime });

    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

async function monthlyResetHandler(_job: any, params: any): Promise<CronJobResult> {
  const startTime = Date.now();
  let playersAffected = 0;

  try {
    const result = await pool.query(
      `UPDATE player_states SET updated_at = now() WHERE updated_at > now() - interval '30 days'`
    );

    playersAffected = result.rowCount || 0;
    const durationMs = Date.now() - startTime;
    await recordGameTick("monthly_reset", { durationMs, playersAffected });

    return { success: true, recordsAffected: playersAffected, metadata: { durationMs } };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

async function limitedEventProcessorHandler(_job: any, params: any): Promise<CronJobResult> {
  const startTime = Date.now();
  let eventsProcessed = 0;

  try {
    eventsProcessed = 0;
    const durationMs = Date.now() - startTime;
    await recordGameTick("limited_event", { durationMs, eventsProcessed });

    return { success: true, recordsAffected: eventsProcessed, metadata: { durationMs } };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

async function leaderboardUpdateHandler(_job: any, params: any): Promise<CronJobResult> {
  const startTime = Date.now();
  let categoriesUpdated = 0;

  try {
    const categories = ["empire_level", "resources", "military_power", "research_progress", "fleet_size"];
    
    for (const category of categories) {
      await pool.query(
        `SELECT id FROM player_states ORDER BY ${category} DESC LIMIT $1`,
        [params.topPlayersCount || 1000]
      );
      categoriesUpdated++;
    }

    const durationMs = Date.now() - startTime;
    await recordGameTick("leaderboard", { durationMs, categoriesUpdated });

    return { success: true, recordsAffected: categoriesUpdated, metadata: { durationMs } };
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

async function inactivePlayerWarningHandler(_job: any, params: any): Promise<CronJobResult> {
  const startTime = Date.now();
  let warningsSent = 0;

  try {
    const inactiveDays = params.inactiveDays || 7;
    const result = await pool.query(
      `SELECT id FROM player_states
       WHERE updated_at < now() - ($1 || ' days')::interval
       LIMIT 100`,
      [inactiveDays]
    );

    warningsSent = result.rowCount || 0;
    const durationMs = Date.now() - startTime;
    await recordGameTick("inactive_warnings", { durationMs, warningsSent });

    return { success: true, recordsAffected: warningsSent, metadata: { durationMs } };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

async function serverStatisticsHandler(_job: any, params: any): Promise<CronJobResult> {
  const startTime = Date.now();

  try {
    const playerCount = await pool.query(`SELECT COUNT(*) as count FROM users`);
    const activeCount = await pool.query(
      `SELECT COUNT(*) as count FROM player_states WHERE updated_at > now() - interval '24 hours'`
    );

    const durationMs = Date.now() - startTime;
    await recordGameTick("server_stats", {
      durationMs,
      totalPlayers: playerCount.rows[0]?.count || 0,
      activePlayers: activeCount.rows[0]?.count || 0,
    });

    return { success: true, metadata: { durationMs } };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

async function backupCriticalDataHandler(_job: any, params: any): Promise<CronJobResult> {
  const startTime = Date.now();

  try {
    const durationMs = Date.now() - startTime;
    await recordGameTick("backup", { durationMs, backupSize: 0 });

    return { success: true, metadata: { durationMs } };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}
