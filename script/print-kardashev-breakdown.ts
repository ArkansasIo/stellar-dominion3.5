import { getKardashevOperationalBonuses } from "../shared/config/kardashevOperationalBonuses";

for (let level = 1; level <= 18; level += 1) {
  const bonus = getKardashevOperationalBonuses(level);
  console.log(JSON.stringify({
    level: bonus.level,
    tierName: bonus.tierName,
    fleetPowerPercent: bonus.fleetPowerPercent,
    fleetPowerMultiplier: bonus.fleetPowerMultiplier,
    defensePowerPercent: bonus.defensePowerPercent,
    defensePowerMultiplier: bonus.defensePowerMultiplier,
    maxPlanets: bonus.maxPlanets,
    maxFleets: bonus.maxFleets,
  }));
}
