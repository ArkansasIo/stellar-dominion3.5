import assert from "node:assert/strict";
import { eq } from "drizzle-orm";
import { db, pool } from "../server/db";
import { playerStates, users } from "../shared/schema";
import { TURN_INTERVAL_MS, processStrategicTurns, type StargateWarsState } from "../server/services/stargateWarsService";

const USER_ID = "test-turn-threshold";
const now = Date.now();

const strategic: StargateWarsState = {
  race: "tauri",
  defcon: "none",
  attackTurns: 3999,
  marketTurns: 0,
  unitProduction: 1,
  spyLevel: 1,
  antiSpyLevel: 1,
  technologies: { offense: 0, defense: 0, covert: 0, antiCovert: 0, unique: 0, mercenary: 0 },
  glory: 0,
  reputation: 0,
  ascensionPoints: 0,
  ascensionLevel: 0,
  armory: { inventory: {} },
  lastTurnAt: now - TURN_INTERVAL_MS * 3,
  logs: [],
};

async function main() {
  await db.delete(playerStates).where(eq(playerStates.userId, USER_ID));
  await db.delete(users).where(eq(users.id, USER_ID));
  await db.insert(users).values({ id: USER_ID, username: "Turn Threshold Test", email: "turn-threshold@local.invalid" });
  await db.insert(playerStates).values({
    userId: USER_ID,
    setupComplete: true,
    resources: { naquadah: 0, bankedNaquadah: 0 },
    units: { untrained: 0, miners: 0, lifers: 0 },
    commander: {},
    government: { stargateWars: strategic },
  });

  const tick = await processStrategicTurns(USER_ID, now);
  assert.equal(tick.processedTurns, 3, "all elapsed half-hour turns should be processed");
  assert.equal(tick.strategic.attackTurns, 4000, "passive turn generation must stop exactly at the 4,000-turn threshold");
  assert.equal(tick.personnel.untrained, 3, "unit production continues for all elapsed turns");
  console.log(JSON.stringify({ attackTurns: tick.strategic.attackTurns, processedTurns: tick.processedTurns, untrained: tick.personnel.untrained }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}).finally(async () => {
  await pool.end();
});
