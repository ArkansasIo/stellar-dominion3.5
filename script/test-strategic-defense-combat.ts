import assert from "node:assert/strict";
import { applyNetworkFireCasualties, resolveStrategicDefense } from "../server/services/stargate/strategicDefenseService";
import type { StrategicWorld } from "../server/services/stargate/systemStateService";

function buildWorld(overrides: Partial<StrategicWorld["moons"][number]> = {}): StrategicWorld {
  return {
    id: "world-defense-test",
    name: "Aegis Prime",
    ownerId: "defender-test",
    worldType: "military",
    classCode: "V",
    className: "Verdant",
    subclass: "Terrestrial",
    type: "temperate",
    subtype: "continental",
    biome: "temperate forest",
    subBiome: "river delta",
    size: 7,
    sizeLabel: "Colossal",
    environment: {} as StrategicWorld["environment"],
    modifiers: {} as StrategicWorld["modifiers"],
    moons: [{
      id: "moon-defense-test",
      parentWorldId: "world-defense-test",
      orbitSlot: 1,
      archetypeId: "M01",
      moonClass: "Aegis",
      subclass: "Fortress",
      type: "defense",
      subtype: "citadel",
      biome: "barren",
      subBiome: "regolith",
      atmosphere: "thin",
      size: 5,
      habitability: 20,
      gravity: 0.6,
      resourceDensity: 1.2,
      condition: 100,
      developmentLevel: 8,
      defenseRating: 1000,
      researchRating: 900,
      productionMultiplier: 1,
      defenseNetwork: { level: 4, maxLevel: 10, defensePower: 12_000, antiShipPower: 15_000, interceptChance: 0.5, energyUpkeepPerHour: 30, operational: true },
      planetaryShield: { level: 4, maxLevel: 8, capacity: 100_000, current: 100_000, coverage: 80, rechargePerHour: 5_000, energyUpkeepPerHour: 45, status: "online" },
      ...overrides,
    }],
    condition: 100,
    defenses: 0,
    developmentLevel: 10,
    population: 100_000,
    maxPopulation: 150_000,
    stability: 100,
    lastYieldAt: Date.now(),
    bonuses: { attack: 0, defense: 0, covert: 0, unitProduction: 0, income: 0 },
    discoveredAt: Date.now(),
  } as StrategicWorld;
}

const activeWorld = buildWorld();
const activeResolution = resolveStrategicDefense({
  world: activeWorld,
  attackerUnits: { lightFighter: 100 },
  unitAttackPower: { lightFighter: 50 },
  random: () => 0,
});
assert.equal(activeResolution.report.interception.triggered, true);
assert.ok(activeResolution.report.interception.interceptedPower > 0);
assert.ok(activeResolution.attackerLosses.lightFighter > 0);
assert.ok(activeResolution.report.planetaryShield.absorbedDamage > 0);
assert.ok(activeWorld.moons[0].planetaryShield.current < 100_000);
assert.equal(activeWorld.moons[0].planetaryShield.status, "charging");
assert.ok(activeResolution.networkFireUnits > 0);

const networkFire = applyNetworkFireCasualties({ lightFighter: 10, battleship: 3 }, { lightFighter: 50, battleship: 200 }, 15_000);
assert.equal(networkFire.losses.lightFighter, 2);
assert.equal(networkFire.units.lightFighter, 8);

const offlineWorld = buildWorld({
  defenseNetwork: { level: 4, maxLevel: 10, defensePower: 12_000, antiShipPower: 15_000, interceptChance: 0.5, energyUpkeepPerHour: 30, operational: false },
  planetaryShield: { level: 4, maxLevel: 8, capacity: 100_000, current: 100_000, coverage: 80, rechargePerHour: 5_000, energyUpkeepPerHour: 45, status: "offline" },
});
const offlineResolution = resolveStrategicDefense({ world: offlineWorld, attackerUnits: { lightFighter: 10 }, unitAttackPower: { lightFighter: 50 }, random: () => 0 });
assert.equal(offlineResolution.report.interception.triggered, false);
assert.equal(offlineResolution.report.planetaryShield.status, "offline");
assert.deepEqual(offlineResolution.attackerLosses, {});
assert.equal(offlineResolution.networkFirePower, 0);

const breachedWorld = buildWorld({
  planetaryShield: { level: 8, maxLevel: 8, capacity: 100, current: 100, coverage: 100, rechargePerHour: 0, energyUpkeepPerHour: 1, status: "online" },
  defenseNetwork: { level: 0, maxLevel: 10, defensePower: 0, antiShipPower: 0, interceptChance: 0, energyUpkeepPerHour: 0, operational: false },
});
const breachedResolution = resolveStrategicDefense({ world: breachedWorld, attackerUnits: { dreadnought: 100 }, unitAttackPower: { dreadnought: 300 }, random: () => 1 });
assert.equal(breachedResolution.report.planetaryShield.status, "breached");
assert.equal(breachedWorld.moons[0].planetaryShield.current, 0);
assert.equal(breachedResolution.defenderAttackMultiplier, 1.65);

console.log("Strategic defense combat simulations passed: active defense, offline state, shield breach, interception, shield absorption, and network fire.");
