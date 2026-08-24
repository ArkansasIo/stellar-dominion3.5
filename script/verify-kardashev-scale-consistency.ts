import assert from "node:assert/strict";
import { KARDASHEV_SCALE } from "../client/src/lib/kardashevScale";
import { getKardashevOperationalBonuses } from "../shared/config/kardashevOperationalBonuses";

for (let level = 1; level <= 18; level += 1) {
  const source = KARDASHEV_SCALE[level as keyof typeof KARDASHEV_SCALE];
  const operational = getKardashevOperationalBonuses(level);
  assert.equal(operational.fleetPowerPercent, source.bonuses.fleetPower, `fleet power mismatch at tier ${level}`);
  assert.equal(operational.defensePowerPercent, source.bonuses.defensePower, `defense power mismatch at tier ${level}`);
  assert.equal(operational.maxPlanets, source.bonuses.maxPlanets, `planet cap mismatch at tier ${level}`);
  assert.equal(operational.maxFleets, source.bonuses.maxFleets, `fleet cap mismatch at tier ${level}`);
}

console.log("Kardashev scale consistency: PASS (18/18 tiers)");
