import { config } from "dotenv";
import { pool } from "../server/db";
import { UniverseResetService } from "../server/services/universeResetService";

config();

async function resetUniverse() {
  try {
    console.log("🔄 Resetting universe...");
    const result = await UniverseResetService.resetUniverse();
    console.log(`✅ Universe reset complete!`);
    console.log(`   Reset at: ${result.resetAt}`);
    console.log(`   Accounts preserved: ${result.accountCount}`);
    console.log("\n🌌 Galaxy map data is cached in the database and has been cleared.");
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error resetting universe:", error);
    process.exit(1);
  }
}

resetUniverse();
