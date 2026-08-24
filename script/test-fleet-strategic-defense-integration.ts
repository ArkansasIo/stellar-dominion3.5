import assert from "node:assert/strict";
import { and, eq } from "drizzle-orm";
import { db, pool } from "../server/db";
import { battles, missions, playerStates, users } from "../shared/schema";
import { fleetMissionService } from "../server/services/fleetMissionService";

const ATTACKER_ID = "test-fleet-defense-attacker";
const DEFENDER_ID = "test-fleet-defense-defender";
const MISSION_ID = "test-fleet-defense-mission";

const baseResources = {
  metal: 100_000,
  crystal: 100_000,
  deuterium: 100_000,
  energy: 10_000,
  credits: 1_000_000,
  naquadah: 5_000_000,
  food: 10_000,
  water: 10_000,
  bankedNaquadah: 0,
};

async function cleanup() {
  await db.delete(battles).where(and(eq(battles.attackerId, ATTACKER_ID), eq(battles.defenderId, DEFENDER_ID)));
  await db.delete(missions).where(eq(missions.id, MISSION_ID));
  await db.delete(playerStates).where(eq(playerStates.userId, ATTACKER_ID));
  await db.delete(playerStates).where(eq(playerStates.userId, DEFENDER_ID));
  await db.delete(users).where(eq(users.id, ATTACKER_ID));
  await db.delete(users).where(eq(users.id, DEFENDER_ID));
}

async function main() {
  await cleanup();
  await db.insert(users).values([
    { id: ATTACKER_ID, username: ATTACKER_ID, email: `${ATTACKER_ID}@local.invalid` },
    { id: DEFENDER_ID, username: DEFENDER_ID, email: `${DEFENDER_ID}@local.invalid` },
  ]);

  await db.insert(playerStates).values([
    {
      userId: ATTACKER_ID,
      setupComplete: true,
      planetName: "Strikepoint",
      resources: baseResources,
      units: { lightFighter: 0, deuterium: 100_000 },
      commander: {},
      government: {},
    },
    {
      userId: DEFENDER_ID,
      setupComplete: true,
      planetName: "Aegis Prime",
      resources: baseResources,
      units: { lightFighter: 10, rocketLauncher: 20 },
      commander: {},
      government: {
        stargateSystems: {
          worlds: [{
            id: "world-aegis-prime",
            name: "Aegis Prime",
            worldType: "military",
            classCode: "V",
            sizeTier: 7,
            condition: 100,
            defenses: 0,
            developmentLevel: 10,
            moons: [{
              id: "MON-AEGIS-01",
              name: "Aegis Bastion",
              developmentLevel: 8,
              defenseNetwork: { level: 2, maxLevel: 10, defensePower: 4_000, antiShipPower: 3_000, interceptChance: 0.2, energyUpkeepPerHour: 10, operational: true },
              planetaryShield: { level: 2, maxLevel: 10, current: 30, capacity: 30, coverage: 100, rechargePerHour: 5, energyUpkeepPerHour: 10, status: "online" },
            }],
          }],
        },
      },
    },
  ]);

  const now = new Date();
  await db.insert(missions).values({
    id: MISSION_ID,
    userId: ATTACKER_ID,
    type: "attack",
    status: "outbound",
    target: "1:2:3",
    origin: "1:1:1",
    units: { lightFighter: 120 },
    cargo: { defenderId: DEFENDER_ID },
    departureTime: new Date(now.getTime() - 60_000),
    arrivalTime: new Date(now.getTime() - 1_000),
    returnTime: new Date(now.getTime() - 500),
    processed: false,
  });

  const service = fleetMissionService;
  assert.equal(await service.processArrivedMissions(), 1);

  const [battle] = await db.select().from(battles).where(and(eq(battles.attackerId, ATTACKER_ID), eq(battles.defenderId, DEFENDER_ID))).limit(1);
  assert.ok(battle, "timed attack should persist a battle record");
  assert.ok(battle.combatTelemetry, "battle should persist strategic-defense telemetry");
  const telemetry = battle.combatTelemetry as Record<string, any>;
  assert.ok(Number(telemetry.planetaryShield?.absorbedDamage ?? 0) > 0, "shield must absorb incoming damage");
  assert.ok(telemetry.orbitalNetwork && typeof telemetry.orbitalNetwork === "object", "network telemetry must be serialized");
  assert.ok(Number(telemetry.orbitalNetwork.fireLosses?.lightFighter ?? 0) > 0, "network fire must cause a fleet casualty");

  const [missionAfterBattle] = await db.select().from(missions).where(eq(missions.id, MISSION_ID)).limit(1);
  assert.equal(missionAfterBattle.status, "return");
  assert.equal(missionAfterBattle.processed, false);
  assert.ok((missionAfterBattle.cargo as Record<string, any>).losses, "mission return should carry attacker losses");

  assert.equal(await service.processReturnedMissions(), 1);
  const [attackerAfterReturn] = await db.select().from(playerStates).where(eq(playerStates.userId, ATTACKER_ID)).limit(1);
  const attackerUnits = attackerAfterReturn.units as Record<string, number>;
  assert.ok(attackerUnits.lightFighter < 120, "defensive resolution must reduce returning attacker units");

  const [defenderAfterBattle] = await db.select().from(playerStates).where(eq(playerStates.userId, DEFENDER_ID)).limit(1);
  const defenderSystems = (defenderAfterBattle.government as Record<string, any>).stargateSystems;
  const defendedMoon = defenderSystems.worlds[0].moons[0];
  assert.ok(defendedMoon.planetaryShield.current < 30, "shield charge must be depleted by combat");

  console.log(JSON.stringify({
    battleId: battle.id,
    winner: battle.winner,
    rounds: battle.rounds,
    telemetry,
    attackerUnitsAfterReturn: attackerUnits,
    shieldChargeAfterBattle: defendedMoon.planetaryShield.currentCharge,
  }, null, 2));
}

main()
  .catch((error) => { console.error(error); process.exitCode = 1; })
  .finally(async () => { await cleanup(); await pool.end(); });
