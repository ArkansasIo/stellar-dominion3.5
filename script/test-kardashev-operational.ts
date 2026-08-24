import assert from "node:assert/strict";
import {
  countOwnedPlanets,
  getKardashevLevelFromSystems,
  getKardashevOperationalBonuses,
  getKardashevOperationalBonusesForPlayer,
} from "../shared/config/kardashevOperationalBonuses";

function testTierTable() {
  const tierOne = getKardashevOperationalBonuses(1);
  assert.equal(tierOne.level, 1);
  assert.equal(tierOne.fleetPowerMultiplier, 1);
  assert.equal(tierOne.defensePowerMultiplier, 1);
  assert.equal(tierOne.maxPlanets, 1);

  const tierTwo = getKardashevOperationalBonuses(2);
  assert.equal(tierTwo.fleetPowerPercent, 5);
  assert.equal(tierTwo.fleetPowerMultiplier, 1.05);
  assert.equal(tierTwo.defensePowerMultiplier, 1.05);
  assert.equal(tierTwo.maxPlanets, 1);
  assert.equal(tierTwo.maxFleets, 2);

  const tierThree = getKardashevOperationalBonuses(3);
  assert.equal(tierThree.fleetPowerMultiplier, 1.15);
  assert.equal(tierThree.maxPlanets, 3);

  const tierEighteen = getKardashevOperationalBonuses(18);
  assert.equal(tierEighteen.maxPlanets, 999999);
  assert.equal(tierEighteen.maxFleets, 999999);
}

function testContiguousUnlocksAndLegacyFallback() {
  assert.equal(getKardashevLevelFromSystems({}), 1);
  assert.equal(getKardashevLevelFromSystems({ "kardashev-tier-2": 1 }), 2);
  assert.equal(
    getKardashevLevelFromSystems({ "kardashev-tier-2": 1, "kardashev-tier-3": 1 }),
    3,
  );
  assert.equal(
    getKardashevLevelFromSystems({ "kardashev-tier-2": 1, "kardashev-tier-4": 1 }),
    2,
    "A skipped tier must not grant a higher operational level",
  );
  assert.equal(getKardashevLevelFromSystems({ currentLevel: 7 }), 7);
  assert.equal(
    getKardashevOperationalBonusesForPlayer({ tierBonuses: { kardashevLevel: 4 } }).level,
    4,
  );
}

function testPlanetCapacityCounting() {
  const knownPlanets = [
    { id: "scan-1", isColonizable: true },
    { id: "colony-1", ownerId: "player-1", owned: true },
    { id: "colony-2", claimedBy: "player-1" },
    { id: "other-claimed", ownerId: "player-2", owned: true },
  ];
  assert.equal(countOwnedPlanets(knownPlanets, "player-1"), 3, "homeworld plus two owned colonies");
  assert.equal(countOwnedPlanets([], "player-1"), 1, "homeworld counts as the first planet");
  assert.equal(countOwnedPlanets(undefined, "player-1"), 1);
}

testTierTable();
testContiguousUnlocksAndLegacyFallback();
testPlanetCapacityCounting();
console.log("Kardashev operational rules: PASS");
