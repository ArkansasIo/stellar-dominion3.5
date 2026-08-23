import assert from "node:assert/strict";
import { eq, inArray } from "drizzle-orm";
import { db, pool } from "../server/db";
import { playerStates, users } from "../shared/schema";
import {
  executeSabotage,
  getArmory,
  getAscensionStatus,
  getStargateState,
  manageArmory,
  upgradeCovertLevel,
  type StargateWarsState,
} from "../server/services/stargateWarsService";

const ATTACKER_ID = "test-armory-tauri";
const DEFENDER_ID = "test-armory-asgard";
const now = Date.now();

const state = (race: StargateWarsState["race"], armory: StargateWarsState["armory"]): StargateWarsState => ({
  race,
  defcon: "none",
  attackTurns: 20,
  marketTurns: 3,
  unitProduction: 10,
  spyLevel: race === "tauri" ? 5 : 1,
  antiSpyLevel: 1,
  technologies: { offense: race === "tauri" ? 1 : 0, defense: race === "asgard" ? 1 : 0, covert: 4, antiCovert: 0, unique: 0, mercenary: 0 },
  glory: 99,
  reputation: 29,
  ascensionPoints: 0,
  ascensionLevel: 0,
  armory,
  lastTurnAt: now,
  logs: [],
});

async function seed() {
  await db.delete(playerStates).where(inArray(playerStates.userId, [ATTACKER_ID, DEFENDER_ID]));
  await db.delete(users).where(inArray(users.id, [ATTACKER_ID, DEFENDER_ID]));
  await db.insert(users).values([
    { id: ATTACKER_ID, username: "Armory Tau'ri Test", email: "armory-tauri@local.invalid" },
    { id: DEFENDER_ID, username: "Armory Asgard Test", email: "armory-asgard@local.invalid" },
  ]);
  await db.insert(playerStates).values([
    {
      userId: ATTACKER_ID,
      setupComplete: true,
      resources: { naquadah: 100_000, bankedNaquadah: 0 },
      units: { untrained: 100, miners: 0, lifers: 0, attackTroops: 20, superAttackTroops: 0, defenseTroops: 0, superDefenseTroops: 0, covertAgents: 100, antiIntelAgents: 0, attackWeapons: 20, defenseWeapons: 0 },
      commander: {},
      government: { stargateWars: state("tauri", { inventory: {} }) },
    },
    {
      userId: DEFENDER_ID,
      setupComplete: true,
      resources: { naquadah: 50_000, bankedNaquadah: 0 },
      units: { untrained: 100, miners: 0, lifers: 0, attackTroops: 0, superAttackTroops: 0, defenseTroops: 20, superDefenseTroops: 0, covertAgents: 0, antiIntelAgents: 1, attackWeapons: 0, defenseWeapons: 20 },
      commander: {},
      government: { stargateWars: state("asgard", { inventory: { "asgard-shield": { owned: 2, equipped: 2, condition: 100 } } }) },
    },
  ]);
}

async function main() {
  await seed();
  const before = await getStargateState(ATTACKER_ID);
  const catalog = await getArmory(ATTACKER_ID);
  const railgun = catalog.catalog.find((weapon) => weapon.id === "tau-railgun");
  assert.equal(railgun?.available, true, "Tau'ri Railgun should unlock for Tau'ri with Offense Technology L1");

  await manageArmory(ATTACKER_ID, "buy", "tau-railgun", 2);
  const equipped = await manageArmory(ATTACKER_ID, "equip", "tau-railgun", 2);
  assert.equal(equipped.strategic.armory.inventory["tau-railgun"].equipped, 2, "purchased railguns should equip");
  assert.ok(equipped.metrics.strikeAction > before.metrics.strikeAction, "equipped armory strength must increase strike action");

  const upgradedCovert = await upgradeCovertLevel(ATTACKER_ID, "spy");
  assert.equal(upgradedCovert.strategic.spyLevel, 6, "spy upgrade should advance the level by one");

  let sabotage = await executeSabotage(ATTACKER_ID, DEFENDER_ID);
  for (let attempt = 0; !sabotage.success && attempt < 4; attempt += 1) sabotage = await executeSabotage(ATTACKER_ID, DEFENDER_ID);
  assert.equal(sabotage.success, true, "high-covert controlled scenario should produce a sabotage success");
  assert.equal(sabotage.target, "asgard-shield", "sabotage should select equipped defender armory");
  assert.ok(sabotage.damage >= 8 && sabotage.damage <= 30, "sabotage damage must be bounded by configured range");

  const defender = await getStargateState(DEFENDER_ID);
  assert.ok(defender.strategic.armory.inventory["asgard-shield"].condition < 100, "successful sabotage should lower the defender item condition");
  const ascension = await getAscensionStatus(ATTACKER_ID);
  assert.equal(ascension.eligible, false, "near-threshold test realm should not be considered eligible");
  assert.ok(ascension.unmet.some((entry) => entry.includes("Glory")), "Ascension status should identify missing Glory");

  console.log(JSON.stringify({
    beforeStrike: before.metrics.strikeAction,
    equippedStrike: equipped.metrics.strikeAction,
    spyLevel: upgradedCovert.strategic.spyLevel,
    sabotage: { success: sabotage.success, target: sabotage.target, damage: sabotage.damage, chance: sabotage.chance },
    defenderCondition: defender.strategic.armory.inventory["asgard-shield"].condition,
    ascension: { eligible: ascension.eligible, unmet: ascension.unmet },
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}).finally(async () => {
  await pool.end();
});
