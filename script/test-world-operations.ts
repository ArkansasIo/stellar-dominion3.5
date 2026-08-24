import assert from "node:assert/strict";
import { eq } from "drizzle-orm";
import { db, pool } from "../server/db";
import { playerStates, users } from "../shared/schema";
import { buyMothership, claimExploration, getMothershipState, startStrategicMission, upgradeMothership } from "../server/services/stargate/mothershipService";
import { collectWorldYields, fortifyWorld, getWorldState, specializeWorld, upgradeWorldDevelopment } from "../server/services/stargate/planetService";

const USER_ID = "test-world-operations-alpha";

async function seed() {
  await db.delete(playerStates).where(eq(playerStates.userId, USER_ID));
  await db.delete(users).where(eq(users.id, USER_ID));
  await db.insert(users).values({ id: USER_ID, username: USER_ID, email: `${USER_ID}@local.invalid` });
  await db.insert(playerStates).values({
    userId: USER_ID,
    setupComplete: true,
    planetName: "Operations Prime",
    resources: { metal: 100_000, crystal: 100_000, deuterium: 50_000, energy: 1_000, credits: 1_000_000, naquadah: 5_000_000, food: 1_000, water: 1_000, bankedNaquadah: 0 },
    units: { untrained: 1_000, lifers: 10, attackTroops: 50, defenseTroops: 50 },
    commander: {},
    government: {},
  });
}

async function main() {
  await seed();
  const commissioned = await buyMothership(USER_ID, "World Operations Test Flagship");
  assert.equal(commissioned.mothership.owned, true);
  assert.equal(commissioned.mothership.hull, 100);
  assert.equal(commissioned.mothership.fuel, 100);

  const upgraded = await upgradeMothership(USER_ID, "hangars");
  assert.equal(upgraded.mothership.hangars, 1);
  assert.equal(upgraded.mothership.maxFuel, 110);

  const initialWorlds = await getWorldState(USER_ID);
  const homeworld = initialWorlds.worlds[0];
  assert.equal(homeworld.worldType, "homeworld");
  assert.ok(homeworld.telemetry.productionPerHour.food > 0);
  assert.ok(homeworld.telemetry.capacity.naquadah > 25_000);

  const developed = await upgradeWorldDevelopment(USER_ID, homeworld.id);
  assert.equal(developed.worlds[0].developmentLevel, 2);
  await assert.rejects(() => specializeWorld(USER_ID, homeworld.id, "mining"), /Homeworld specialization/);

  const fortified = await fortifyWorld(USER_ID, homeworld.id, 7);
  assert.equal(fortified.worlds[0].defenses, 7);
  await assert.rejects(() => fortifyWorld(USER_ID, homeworld.id, Number.NaN), /finite number/);

  const collected = await collectWorldYields(USER_ID, Date.now() + 3_600_000);
  assert.ok(collected.collected.food > 0);
  assert.ok(collected.collected.water > 0);

  const survey = await startStrategicMission(USER_ID, "survey");
  assert.equal(survey.mothership.missionType, "survey");
  await assert.rejects(() => startStrategicMission(USER_ID, "salvage"), /already underway/);
  const surveyResult = await claimExploration(USER_ID, Number(survey.mothership.explorationReadyAt) + 1);
  assert.equal(surveyResult.missionResult.missionType, "survey");
  assert.ok(surveyResult.missionResult.status === "success" || surveyResult.missionResult.status === "failed");

  const salvage = await startStrategicMission(USER_ID, "salvage");
  const salvageResult = await claimExploration(USER_ID, Number(salvage.mothership.explorationReadyAt) + 1);
  assert.equal(salvageResult.missionResult.missionType, "salvage");
  assert.ok(salvageResult.missionResult.status === "success" || salvageResult.missionResult.status === "failed");

  const rescue = await startStrategicMission(USER_ID, "rescue");
  const rescueResult = await claimExploration(USER_ID, Number(rescue.mothership.explorationReadyAt) + 1);
  assert.equal(rescueResult.missionResult.missionType, "rescue");
  assert.ok(rescueResult.missionResult.status === "success" || rescueResult.missionResult.status === "failed");

  const finalShip = await getMothershipState(USER_ID);
  const finalWorlds = await getWorldState(USER_ID);
  assert.equal(finalShip.mothership.explorationReadyAt, null);
  assert.ok(finalShip.mothership.missionsCompleted + finalShip.mothership.missionsFailed >= 3);
  assert.ok(finalWorlds.worlds.length >= 1);
  console.log(JSON.stringify({
    mothership: { name: finalShip.mothership.name, hangars: finalShip.mothership.hangars, fuel: finalShip.mothership.fuel, missionsCompleted: finalShip.mothership.missionsCompleted, missionsFailed: finalShip.mothership.missionsFailed },
    worlds: { count: finalWorlds.worlds.length, homeDevelopment: finalWorlds.worlds[0].developmentLevel, homeDefenses: finalWorlds.worlds[0].defenses, collected },
    missionStatuses: [surveyResult.missionResult.status, salvageResult.missionResult.status, rescueResult.missionResult.status],
  }, null, 2));
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(async () => {
  await db.delete(playerStates).where(eq(playerStates.userId, USER_ID));
  await db.delete(users).where(eq(users.id, USER_ID));
  await pool.end();
});
