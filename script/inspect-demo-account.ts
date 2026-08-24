import { eq } from "drizzle-orm";
import { db, pool } from "../server/db";
import { playerStates, users } from "../shared/schema";

async function main() {
  const rows = await db.select({
    id: users.id,
    username: users.username,
    email: users.email,
    createdAt: users.createdAt,
    updatedAt: users.updatedAt,
  }).from(users).where(eq(users.username, "player1"));
  const user = rows[0];
  if (!user) {
    console.log(JSON.stringify({ exists: false }, null, 2));
    await pool.end();
    return;
  }
  const states = await db.select().from(playerStates).where(eq(playerStates.userId, user.id));
  console.log(JSON.stringify({
    exists: true,
    user,
    playerStateCount: states.length,
    playerState: states[0] ? {
      id: states[0].id,
      setupComplete: states[0].setupComplete,
      planetName: states[0].planetName,
      coordinates: states[0].coordinates,
      resources: states[0].resources,
      buildings: states[0].buildings,
      research: states[0].research,
      units: states[0].units,
      empireLevel: states[0].empireLevel,
      tier: states[0].tier,
      currentTurns: states[0].currentTurns,
      totalTurns: states[0].totalTurns,
      updatedAt: states[0].updatedAt,
    } : null,
  }, null, 2));
  await pool.end();
}

main().catch(async (error) => {
  console.error(error);
  await pool.end();
  process.exitCode = 1;
});
