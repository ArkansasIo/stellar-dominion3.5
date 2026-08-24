import assert from "node:assert/strict";
import {
  applyManagedResourceTick,
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

function testTickUpdatesAndCaps() {
  const result = applyManagedResourceTick(
    { metal: 100, crystal: 100, deuterium: 100, naquadah: 100, food: 2_000, water: 2_000 },
    {
      metalMine: 4,
      crystalMine: 4,
      deuteriumSynthesizer: 2,
      solarPlant: 5,
      naquadahExtractor: 2,
      foodHydroponics: 3,
      waterRecycler: 3,
      workerCount: 10,
      engineerCount: 2,
      civilianCount: 4,
      shipyard: 1,
      researchLab: 1,
      foodStorageFacility: 1,
      waterStorageFacility: 1,
      naquadahVault: 1,
    },
    {},
    1,
  );

  assert.ok(result.resources.naquadah > 100, "Naquadah should update from extractor minus demand");
  assert.ok(result.resources.food !== 2_000, "Food should update from production and consumption");
  assert.ok(result.resources.water !== 2_000, "Water should update from production and consumption");
  assert.ok(result.resources.naquadah <= result.capacities.naquadah, "Naquadah must respect vault capacity");
  assert.ok(result.resources.food <= result.capacities.food, "Food must respect storage capacity");
  assert.ok(result.resources.water <= result.capacities.water, "Water must respect reservoir capacity");
}

testStrategicAndLifeSupportProduction();
testStorageGrowth();
testUpgradeCostsAndAffordability();
testLifeSupportNetFlow();
testTickUpdatesAndCaps();
console.log("Resource management rules: PASS");
