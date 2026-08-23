import assert from "node:assert/strict";
import { eq } from "drizzle-orm";
import { db, pool } from "../server/db";
import { playerStates, users } from "../shared/schema";
import { calculateProduction, processResourceTick } from "../server/gameEngine";
import { calculateNaturalIncome, processStrategicTurns } from "../server/services/stargateWarsService";

const USER_ID = "test-resource-24h-simulation";
const NOW = Date.now();
const DAY_MS = 24 * 60 * 60 * 1000;

const buildings = {
  metalMine: 12,
  crystalMine: 8,
  deuteriumSynthesizer: 6,
  solarPlant: 10,
};

const initialResources = {
  metal: 1_000,
  crystal: 2_000,
  deuterium: 3_000,
  energy: 0,
  credits: 0,
  food: 0,
  water: 0,
  naquadah: 5_000,
  bankedNaquadah: 0,
};

const personnel = {
  untrained: 10,
  miners: 5,
  lifers: 2,
  attackTroops: 0,
  defenseTroops: 0,
  superAttackTroops: 0,
  superDefenseTroops: 0,
  attackWeapons: 0,
  defenseWeapons: 0,
  covertAgents: 0,
  antiIntelAgents: 0,
};

const strategic = {
  race: "tauri",
  defcon: "none",
  attackTurns: 0,
  marketTurns: 0,
  unitProduction: 0,
  spyLevel: 0,
  antiSpyLevel: 0,
  technologies: { offense: 0, defense: 0, covert: 0, antiCovert: 0, unique: 0, mercenary: 0 },
  glory: 0,
  reputation: 0,
  ascensionPoints: 0,
  ascensionLevel: 0,
  armory: { inventory: {} },
  lastTurnAt: NOW - DAY_MS,
  logs: [],
};

async function cleanup() {
  await db.delete(playerStates).where(eq(playerStates.userId, USER_ID));
  await db.delete(users).where(eq(users.id, USER_ID));
}

async function main() {
  await cleanup();
  await db.insert(users).values({
    id: USER_ID,
    username: "24h Resource Simulation",
    email: "resource-24h@local.invalid",
  });
  await db.insert(playerStates).values({
    userId: USER_ID,
    setupComplete: true,
    planetName: "Simulation Prime",
    resources: initialResources,
    buildings,
    research: {},
    units: { ...personnel, lightFighter: 7, cruiser: 2 },
    commander: {},
    government: { stargateWars: strategic },
    lastResourceUpdate: new Date(NOW - DAY_MS),
  });

  const perHour = calculateProduction(buildings, {});
  const expectedConventional = {
    metal: perHour.metal * 24,
    crystal: perHour.crystal * 24,
    deuterium: perHour.deuterium * 24,
  };
  const conventionalResult = await processResourceTick(USER_ID);

  assert.deepEqual(conventionalResult.produced, {
    ...expectedConventional,
    energy: perHour.energy,
  }, "24-hour conventional offline accrual must use canonical hourly rates");

  const naquadahPerTurn = calculateNaturalIncome(personnel as any, strategic as any);
  const strategicResult = await processStrategicTurns(USER_ID, NOW);
  const expectedNaquadahGain = naquadahPerTurn * 48;
  assert.equal(strategicResult.processedTurns, 48, "24 hours must equal 48 strategic turns");
  assert.equal(strategicResult.resources.naquadah, initialResources.naquadah + expectedNaquadahGain, "Naquadah offline accrual must persist for all elapsed strategic turns");

  const persisted = await db.query.playerStates.findFirst({ where: eq(playerStates.userId, USER_ID) });
  const persistedResources = persisted?.resources as Record<string, number>;
  assert.equal(persistedResources.metal, initialResources.metal + expectedConventional.metal, "Persisted Metal total mismatch");
  assert.equal(persistedResources.crystal, initialResources.crystal + expectedConventional.crystal, "Persisted Crystal total mismatch");
  assert.equal(persistedResources.deuterium, initialResources.deuterium + expectedConventional.deuterium, "Persisted Deuterium total mismatch");
  assert.equal(persistedResources.naquadah, initialResources.naquadah + expectedNaquadahGain, "Persisted Naquadah total mismatch");
  const persistedUnits = persisted?.units as Record<string, number>;
  assert.equal(persistedUnits.lightFighter, 7, "Legacy light fighters must survive strategic personnel persistence");
  assert.equal(persistedUnits.cruiser, 2, "Legacy cruisers must survive strategic personnel persistence");

  console.log(JSON.stringify({
    elapsed: { hours: 24, strategicTurns: strategicResult.processedTurns },
    perHour,
    conventional: {
      produced: expectedConventional,
      ending: {
        metal: persistedResources.metal,
        crystal: persistedResources.crystal,
        deuterium: persistedResources.deuterium,
      },
    },
    naquadah: {
      perTurn: naquadahPerTurn,
      produced: expectedNaquadahGain,
      ending: persistedResources.naquadah,
    },
    persistence: { resources: "verified", legacyUnits: "verified" },
  }, null, 2));
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await cleanup();
    await pool.end();
  });
