import { config } from "dotenv";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { seedOgameCatalogIfNeeded } from "../server/services/ogameCatalogService";

const currentFilePath = fileURLToPath(import.meta.url);
const currentDir = dirname(currentFilePath);
const projectRoot = resolve(currentDir, "..");

config({ path: resolve(projectRoot, ".env") });
config();

async function run() {
  const result = await seedOgameCatalogIfNeeded();

  if (result.seeded) {
    console.log(
      `Seeded OGame catalog: ${result.categoryCount} categories, ${result.entryCount} entries`,
    );
  } else {
    console.log(
      `OGame catalog already populated: ${result.categoryCount} categories, ${result.entryCount} entries`,
    );
  }
}

run().catch((error) => {
  console.error("Failed to seed OGame catalog:", error);
  process.exit(1);
});
