import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const page = readFileSync(resolve(process.cwd(), "client/src/pages/Resources.tsx"), "utf8");
const context = readFileSync(resolve(process.cwd(), "client/src/lib/gameContext.tsx"), "utf8");

assert.ok(page.includes("data-testid={`card-stats-${id}`}"), "Naquadah, Food, and Water cards must use stable mapped test IDs");
for (const marker of ["card-naquadah-management", "card-storage-upgrades"]) {
  assert.ok(page.includes(marker), `${marker} should be rendered on Resource Management`);
}

const requiredButtons = [
  "button-sync-resources",
  "button-process-resource-queue",
];
for (const marker of requiredButtons) {
  assert.ok(page.includes(marker), `${marker} should be present and addressable`);
}

for (const systemId of ["naquadahExtractor", "foodHydroponics", "waterRecycler"]) {
  assert.ok(page.includes(`id: "${systemId}"`), `${systemId} should be declared as an upgradeable resource system`);
}
for (const storageId of ["metalStorage", "crystalStorage", "deuteriumStorage", "energyStorage", "naquadahVault", "foodStorageFacility", "waterStorageFacility"]) {
  assert.ok(page.includes(`id: "${storageId}"`), `${storageId} should be declared as an upgradeable storage system`);
}

assert.match(page, /onClick=\{collectResources\}/, "Sync Production must call collectResources");
assert.match(page, /onClick=\{\(\) => processQueue\(\)\}/, "Process Queue must call processQueue");
assert.match(page, /onClick=\{\(\) => updateBuilding\(system\.id, system\.name/, "Strategic/life-support upgrades must call updateBuilding");
assert.match(page, /onClick=\{\(\) => updateBuilding\(storage\.id, storage\.name/, "Storage upgrades must call updateBuilding");
assert.match(context, /collectResources: async \(\) =>/, "GameProvider must expose collectResources");
assert.match(context, /apiRequest\('POST', '\/api\/game\/collect-resources'\)/, "collectResources must use the authoritative collect endpoint");
assert.match(context, /buildingType: surfaceBuilding/, "Construction must send the server’s buildingType payload");
assert.match(context, /apiRequest\("POST", "\/api\/turns\/spend", \{ amount \}\)/, "Actions must request turn spending from the server");
assert.doesNotMatch(context, /if \(currentTurns < amount\)/, "Actions must not be blocked by a stale local turn counter");
assert.match(context, /response\.currentTurns \?\? response\.turnsAvailable/, "Turn balance must be updated from the server response");

console.log("Resource Management button contract: PASS (15 control families checked)");
