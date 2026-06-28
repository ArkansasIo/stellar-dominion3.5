export interface PlanetResources {
  metal: number;
  crystal: number;
  deuterium: number;
}

export interface CargoFleetData {
  totalCargoCapacity: number;
}

export function calculateLoot(
  defenderResources: PlanetResources,
  lootPercentage: number,
  totalCargoCapacity: number,
): PlanetResources {
  const loot: PlanetResources = {
    metal: Math.max(0, Math.floor(defenderResources.metal * (lootPercentage / 100))),
    crystal: Math.max(0, Math.floor(defenderResources.crystal * (lootPercentage / 100))),
    deuterium: Math.max(0, Math.floor(defenderResources.deuterium * (lootPercentage / 100))),
  };

  const totalLoot = loot.metal + loot.crystal + loot.deuterium;

  if (totalCargoCapacity >= totalLoot) {
    return loot;
  }

  return distributeLoot(loot, totalCargoCapacity);
}

export function distributeLoot(loot: PlanetResources, totalCargo: number): PlanetResources {
  const totalLoot = loot.metal + loot.crystal + loot.deuterium;
  if (totalCargo >= totalLoot) return loot;

  const distributed: PlanetResources = { metal: 0, crystal: 0, deuterium: 0 };
  const resourceNames: Array<keyof PlanetResources> = ["metal", "crystal", "deuterium"];

  let maxPerResource = Math.floor(totalCargo / resourceNames.length);

  for (const name of resourceNames) {
    distributed[name] = Math.min(loot[name], maxPerResource);
  }

  let remaining = totalCargo - (distributed.metal + distributed.crystal + distributed.deuterium);

  while (remaining > 0) {
    let unfilled = 0;
    for (const name of resourceNames) {
      if (loot[name] > distributed[name]) unfilled++;
    }
    if (unfilled === 0) break;

    for (const name of resourceNames) {
      if (loot[name] > distributed[name]) {
        const add = Math.ceil(remaining / unfilled);
        distributed[name] = Math.min(loot[name], distributed[name] + add);
      }
    }
    remaining = totalCargo - (distributed.metal + distributed.crystal + distributed.deuterium);
    if (remaining <= 0) break;
  }

  return distributed;
}
