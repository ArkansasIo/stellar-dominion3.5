import assert from "node:assert/strict";
import {
  calculateLifeSupportEconomy,
  calculateManagedStorageCapacity,
  calculateResourceEconomy,
  calculateUpgradeCost,
  isResourceCostAffordable,
} from "../shared/config/resourceManagement";

function testStrategicAndLifeSupportProduction() {
  const economy = calculateResourceEconomy(
    {
      metalMine: 10,
      crystalMine: 8,
      deuteriumSynthesizer: 5,
      solarPlant: 12,
      naquadahExtractor: 2,
      foodHydroponics: 2,
      waterRecycler: 2,
      workerCount: 100,
      engineerCount: 10,
      civilianCount: 50,
    },
    { energyTech: 3 },
  );

  assert.ok(economy.naquadah > 0, "Naquadah extractor should produce strategic resource");
  assert.ok(economy.foodProduction > 0, "Hydroponics should produce Food");
  assert.ok(economy.waterProduction > 0, "Water recycler should produce Water");
  assert.ok(economy.foodConsumption > 0, "Population should consume Food");
  assert.ok(economy.waterConsumption > economy.foodConsumption, "Industrial Water demand should be included");
}

function testStorageGrowth() {
  const baseFood = calculateManagedStorageCapacity("food", {});
  const upgradedFood = calculateManagedStorageCapacity("food", { foodStorageFacility: 2 });
  const baseNaquadah = calculateManagedStorageCapacity("naquadah", {});
  const upgradedNaquadah = calculateManagedStorageCapacity("naquadah", { naquadahVault: 2 });

  assert.equal(baseFood, 5_000);
  assert.equal(baseNaquadah, 50_000);
  assert.ok(upgradedFood > baseFood, "Food storage should grow after facility upgrades");
  assert.ok(upgradedNaquadah > baseNaquadah, "Naquadah vault should grow strategic capacity");
}

function testUpgradeCostsAndAffordability() {
  const levelZero = calculateUpgradeCost("naquadahExtractor", 0);
  const levelTwo = calculateUpgradeCost("naquadahExtractor", 2);
  assert.ok(levelTwo.metal > levelZero.metal, "Upgrade costs should scale by level");
  assert.equal(isResourceCostAffordable({ metal: 2_000, crystal: 2_000, deuterium: 2_000 }, levelZero), true);
  assert.equal(isResourceCostAffordable({ metal: 1, crystal: 1, deuterium: 1 }, levelZero), false);
}

function testLifeSupportNetFlow() {
  const economy = calculateLifeSupportEconomy({ workerCount: 100, engineerCount: 10, civilianCount: 50 });
  assert.ok(Number.isFinite(economy.food), "Food net flow should be finite");
  assert.ok(Number.isFinite(economy.water), "Water net flow should be finite");
}

testStrategicAndLifeSupportProduction();
testStorageGrowth();
testUpgradeCostsAndAffordability();
testLifeSupportNetFlow();
console.log("Resource management rules: PASS");
