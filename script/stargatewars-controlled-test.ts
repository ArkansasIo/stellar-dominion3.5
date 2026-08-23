import crypto from "node:crypto";
import { eq, inArray } from "drizzle-orm";
import { db, pool } from "../server/db";
import { playerStates, users } from "../shared/schema";
import {
  TURN_INTERVAL_MS,
  calculateOverallRank,
  executeRaid,
  getStargateState,
  processStrategicTurns,
  trainPersonnel,
  upgradeTechnology,
  type StargateWarsState,
} from "../server/services/stargateWarsService";

const TAURI_ID = "test-tauri-commander";
const OPPONENT_ID = "test-asgard-fortress";
const now = Date.now();
const TEST_PASSWORD = "TauRiRaidTest!2026";

const strategicState = (race: StargateWarsState["race"], attackTurns: number, lastTurnAt: number): StargateWarsState => ({
  race,
  defcon: "none",
  attackTurns,
  marketTurns: 3,
  unitProduction: 20,
  spyLevel: 3,
  antiSpyLevel: 3,
  technologies: { offense: 0, defense: 0, covert: 0, antiCovert: 0, unique: 0, mercenary: 0 },
  glory: 0,
  reputation: 0,
  ascensionPoints: 0,
  ascensionLevel: 0,
  armory: { inventory: {} },
  lastTurnAt,
  logs: [],
});

async function seedControlledRealms() {
  await db.delete(playerStates).where(inArray(playerStates.userId, [TAURI_ID, OPPONENT_ID]));
  await db.delete(users).where(inArray(users.id, [TAURI_ID, OPPONENT_ID]));

  const passwordHash = crypto.createHash("sha256").update(TEST_PASSWORD).digest("hex");
  await db.insert(users).values([
    { id: TAURI_ID, username: "Tau'ri Test Commander", email: "tauri-test@local.invalid", passwordHash },
    { id: OPPONENT_ID, username: "Asgard Test Fortress", email: "asgard-test@local.invalid", passwordHash },
  ]);

  await db.insert(playerStates).values([
    {
      userId: TAURI_ID,
      setupComplete: true,
      planetName: "Tau'ri Test Realm",
      resources: { metal: 1000, crystal: 500, deuterium: 0, energy: 0, naquadah: 1_000_000, bankedNaquadah: 0 },
      units: { untrained: 300, miners: 25, lifers: 5, attackTroops: 0, superAttackTroops: 0, defenseTroops: 10, superDefenseTroops: 0, covertAgents: 0, antiIntelAgents: 5, attackWeapons: 0, defenseWeapons: 10 },
      commander: {},
      government: { stargateWars: strategicState("tauri", 100, now - TURN_INTERVAL_MS * 2) },
    },
    {
      userId: OPPONENT_ID,
      setupComplete: true,
      planetName: "Asgard Test Fortress",
      resources: { metal: 1000, crystal: 500, deuterium: 0, energy: 0, naquadah: 500_000, bankedNaquadah: 100_000 },
      units: { untrained: 150, miners: 20, lifers: 5, attackTroops: 5, superAttackTroops: 0, defenseTroops: 25, superDefenseTroops: 1, covertAgents: 4, antiIntelAgents: 12, attackWeapons: 5, defenseWeapons: 26 },
      commander: {},
      government: { stargateWars: strategicState("asgard", 80, now) },
    },
  ]);
}

async function main() {
  await seedControlledRealms();

  const initial = await getStargateState(TAURI_ID);
  const tick = await processStrategicTurns(TAURI_ID, now);

  await upgradeTechnology(TAURI_ID, "offense");
  await upgradeTechnology(TAURI_ID, "offense");
  await upgradeTechnology(TAURI_ID, "covert");
  await upgradeTechnology(TAURI_ID, "unique");

  await trainPersonnel(TAURI_ID, "attackTroop", 100);
  await trainPersonnel(TAURI_ID, "attackWeapon", 100);
  await trainPersonnel(TAURI_ID, "superAttackTroop", 12);
  await trainPersonnel(TAURI_ID, "covertAgent", 30);
  await trainPersonnel(TAURI_ID, "antiIntelAgent", 15);

  const prepared = await getStargateState(TAURI_ID);
  const raid = await executeRaid(TAURI_ID, OPPONENT_ID, 15);
  const attackerAfter = await getStargateState(TAURI_ID);
  const defenderAfter = await getStargateState(OPPONENT_ID);

  const result = {
    controlledRealmIds: { attacker: TAURI_ID, defender: OPPONENT_ID },
    initial: {
      race: initial.strategic.race,
      naquadah: initial.resources.naquadah,
      attackTurns: initial.strategic.attackTurns,
      overallRank: initial.metrics.overallRank,
    },
    tick: {
      processedTurns: tick.processedTurns,
      naquadahAfterTick: tick.resources.naquadah,
      untrainedAfterTick: tick.personnel.untrained,
      attackTurnsAfterTick: tick.strategic.attackTurns,
    },
    upgrades: {
      technologies: prepared.strategic.technologies,
      personnel: {
        attackTroops: prepared.personnel.attackTroops,
        superAttackTroops: prepared.personnel.superAttackTroops,
        attackWeapons: prepared.personnel.attackWeapons,
        covertAgents: prepared.personnel.covertAgents,
        antiIntelAgents: prepared.personnel.antiIntelAgents,
      },
      power: prepared.metrics,
      overallRank: calculateOverallRank(prepared.personnel, prepared.strategic),
    },
    raid: {
      victory: raid.victory,
      turnsSpent: raid.turnsSpent,
      loot: raid.loot,
      attackerLosses: raid.attackerLosses,
      defenderLosses: raid.defenderLosses,
      chance: raid.chance,
      attackPower: raid.report.attackPower,
      defensePower: raid.report.defensePower,
    },
    finalState: {
      attackerNaquadah: attackerAfter.resources.naquadah,
      attackerAttackTurns: attackerAfter.strategic.attackTurns,
      attackerGlory: attackerAfter.strategic.glory,
      attackerReputation: attackerAfter.strategic.reputation,
      defenderNaquadah: defenderAfter.resources.naquadah,
      defenderBankedNaquadah: defenderAfter.resources.bankedNaquadah,
      attackerLatestLog: attackerAfter.strategic.logs[0],
      defenderLatestLog: defenderAfter.strategic.logs[0],
    },
  };

  console.log(JSON.stringify(result, null, 2));
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
