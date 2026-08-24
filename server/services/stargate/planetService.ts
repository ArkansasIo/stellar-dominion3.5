import { STARGATE_BALANCE_RULES } from "./balanceRules";
import { appendSystemEvent, buildSystemSnapshot, loadSystemContext, saveSystemContext, type StrategicWorld } from "./systemStateService";
import { getDefenseCost, getRepairCost, getWorldDevelopmentCost, getWorldTelemetry } from "./worldOperationsService";
import { getWorldCatalog } from "../../../shared/config/worldMoonTaxonomy";

export type WorldBonus = "attack" | "defense" | "covert" | "unitProduction" | "income";
export type WorldSpecialization = "frontier" | "mining" | "agri" | "military";
const WORLD_BONUSES: WorldBonus[] = ["attack", "defense", "covert", "unitProduction", "income"];
const WORLD_SPECIALIZATIONS: WorldSpecialization[] = ["frontier", "mining", "agri", "military"];

function makeWorldResponse(context: Awaited<ReturnType<typeof loadSystemContext>>) {
  const worlds = context.systems.worlds.map((world) => ({
    ...world,
    telemetry: getWorldTelemetry(world),
    developmentCost: world.developmentLevel >= STARGATE_BALANCE_RULES.worlds.maxDevelopmentLevel ? 0 : getWorldDevelopmentCost(world),
    repairCost: getRepairCost(world),
  }));
  const capacity = worlds.reduce((totals, world) => ({
    naquadah: totals.naquadah + world.telemetry.capacity.naquadah,
    food: totals.food + world.telemetry.capacity.food,
    water: totals.water + world.telemetry.capacity.water,
  }), { naquadah: 0, food: 0, water: 0 });
  const productionPerHour = worlds.reduce((totals, world) => ({
    naquadah: totals.naquadah + world.telemetry.productionPerHour.naquadah,
    food: totals.food + world.telemetry.productionPerHour.food,
    water: totals.water + world.telemetry.productionPerHour.water,
  }), { naquadah: 0, food: 0, water: 0 });
  return { ...buildSystemSnapshot(context), worlds, capacity, productionPerHour, catalog: getWorldCatalog(), rules: STARGATE_BALANCE_RULES.worlds };
}

export async function getWorldState(userId: string) {
  return makeWorldResponse(await loadSystemContext(userId));
}

function getOwnedWorld(context: Awaited<ReturnType<typeof loadSystemContext>>, worldId: string) {
  const world = context.systems.worlds.find((entry) => entry.id === worldId && entry.ownerId === context.userId);
  if (!world) throw new Error("Strategic world not found or not owned by this realm");
  return world;
}

export async function upgradeWorldBonus(userId: string, worldId: string, bonus: WorldBonus) {
  if (!WORLD_BONUSES.includes(bonus)) throw new Error("Unsupported world bonus");
  const context = await loadSystemContext(userId);
  const world = getOwnedWorld(context, worldId);
  const level = world.bonuses[bonus];
  const cost = 7_500 + level * 5_000;
  if (context.resources.naquadah < cost) throw new Error("Insufficient Naquadah for this world upgrade");
  context.resources.naquadah -= cost;
  world.bonuses[bonus] += 1;
  context.systems = appendSystemEvent(context.systems, "world.bonus.upgraded", `${world.name} ${bonus} bonus advanced to level ${world.bonuses[bonus]}.`, { worldId, bonus, cost });
  await saveSystemContext(context);
  return makeWorldResponse(context);
}

export async function upgradeWorldDevelopment(userId: string, worldId: string) {
  const context = await loadSystemContext(userId);
  const world = getOwnedWorld(context, worldId);
  if (world.developmentLevel >= STARGATE_BALANCE_RULES.worlds.maxDevelopmentLevel) throw new Error("This world has reached maximum development");
  const previousLevel = world.developmentLevel;
  const cost = getWorldDevelopmentCost(world);
  if (context.resources.naquadah < cost) throw new Error("Insufficient Naquadah for world development");
  context.resources.naquadah -= cost;
  world.developmentLevel += 1;
  world.maxPopulation += 1_000;
  world.stability = Math.min(100, world.stability + 2);
  context.systems = appendSystemEvent(context.systems, "world.developed", `${world.name} advanced to development level ${world.developmentLevel}.`, { worldId, previousLevel, nextLevel: world.developmentLevel, cost });
  await saveSystemContext(context);
  return makeWorldResponse(context);
}

export async function upgradeWorldMoon(userId: string, worldId: string, moonId: string) {
  const context = await loadSystemContext(userId);
  const world = getOwnedWorld(context, worldId);
  const moon = world.moons.find((entry) => entry.id === moonId);
  if (!moon) throw new Error("Moon not found or not attached to this world");
  if (moon.developmentLevel >= 20) throw new Error("This moon has reached maximum development");
  const previousLevel = moon.developmentLevel;
  const cost = 4_500 + previousLevel * 2_500;
  if (context.resources.naquadah < cost) throw new Error("Insufficient Naquadah for moon development");
  context.resources.naquadah -= cost;
  moon.developmentLevel += 1;
  moon.condition = Math.min(100, moon.condition + 2);
  moon.defenseRating += Math.floor(25 * moon.productionMultiplier);
  moon.researchRating += Math.floor(15 * moon.productionMultiplier);
  moon.productionMultiplier = Number((moon.productionMultiplier + 0.05).toFixed(2));
  context.systems = appendSystemEvent(context.systems, "moon.developed", `${moon.name} advanced to development level ${moon.developmentLevel}.`, { worldId, moonId, previousLevel, nextLevel: moon.developmentLevel, cost });
  await saveSystemContext(context);
  return makeWorldResponse(context);
}

export async function specializeWorld(userId: string, worldId: string, specialization: WorldSpecialization) {
  if (!WORLD_SPECIALIZATIONS.includes(specialization)) throw new Error("Unsupported world specialization");
  const context = await loadSystemContext(userId);
  const world = getOwnedWorld(context, worldId);
  if (world.worldType === "homeworld") throw new Error("Homeworld specialization cannot be changed");
  if (world.worldType === specialization) throw new Error("This world already has that specialization");
  const cost = 12_000 + world.developmentLevel * 2_000;
  if (context.resources.naquadah < cost) throw new Error("Insufficient Naquadah to respecialize this world");
  context.resources.naquadah -= cost;
  const previousType = world.worldType;
  world.worldType = specialization;
  context.systems = appendSystemEvent(context.systems, "world.specialized", `${world.name} converted from ${previousType} to ${specialization}.`, { worldId, previousType, specialization, cost });
  await saveSystemContext(context);
  return makeWorldResponse(context);
}

export async function collectWorldYields(userId: string, now = Date.now()) {
  const context = await loadSystemContext(userId);
  const response = makeWorldResponse(context);
  const elapsedByWorld = context.systems.worlds.map((world) => Math.min(24, Math.max(0, (now - world.lastYieldAt) / 3_600_000)));
  const produced = context.systems.worlds.reduce((totals, world, index) => {
    const perHour = getWorldTelemetry(world).productionPerHour;
    const hours = elapsedByWorld[index];
    return { naquadah: totals.naquadah + Math.floor(perHour.naquadah * hours), food: totals.food + Math.floor(perHour.food * hours), water: totals.water + Math.floor(perHour.water * hours) };
  }, { naquadah: 0, food: 0, water: 0 });
  const caps = response.capacity;
  context.resources.naquadah = Math.min(caps.naquadah, Number(context.resources.naquadah || 0) + produced.naquadah);
  context.resources.food = Math.min(caps.food, Number(context.resources.food || 0) + produced.food);
  context.resources.water = Math.min(caps.water, Number(context.resources.water || 0) + produced.water);
  context.systems.worlds.forEach((world) => { world.lastYieldAt = now; });
  context.systems = appendSystemEvent(context.systems, "world.yields.collected", "Collected production from all controlled strategic worlds.", { produced, capacity: caps });
  await saveSystemContext(context);
  return { ...makeWorldResponse(context), collected: produced, collectedAt: now };
}

export async function fortifyWorld(userId: string, worldId: string, quantity: number) {
  if (!Number.isFinite(quantity)) throw new Error("Fortification quantity must be a finite number");
  const amount = Math.max(1, Math.min(STARGATE_BALANCE_RULES.worlds.maxFortifications, Math.floor(quantity)));
  const context = await loadSystemContext(userId);
  const world = getOwnedWorld(context, worldId);
  if (world.defenses + amount > STARGATE_BALANCE_RULES.worlds.maxFortifications) throw new Error("This world has reached its fortification limit");
  const cost = getDefenseCost(amount);
  if (context.resources.naquadah < cost) throw new Error("Insufficient Naquadah for strategic defenses");
  context.resources.naquadah -= cost;
  world.defenses += amount;
  context.systems = appendSystemEvent(context.systems, "world.defense.fortified", `Added ${amount.toLocaleString()} defenses to ${world.name}.`, { worldId, quantity: amount, cost });
  await saveSystemContext(context);
  return makeWorldResponse(context);
}

export async function repairWorld(userId: string, worldId: string) {
  const context = await loadSystemContext(userId);
  const world = getOwnedWorld(context, worldId);
  const missing = Math.max(0, 100 - world.condition);
  if (!missing) throw new Error("This world is already fully repaired");
  const cost = getRepairCost(world);
  if (context.resources.naquadah < cost) throw new Error("Insufficient Naquadah for repairs");
  context.resources.naquadah -= cost;
  world.condition = 100;
  world.stability = Math.min(100, world.stability + 5);
  context.systems = appendSystemEvent(context.systems, "world.repaired", `Restored ${world.name} to full condition.`, { worldId, cost });
  await saveSystemContext(context);
  return makeWorldResponse(context);
}

export async function renameWorld(userId: string, worldId: string, name: string) {
  const context = await loadSystemContext(userId);
  const world = getOwnedWorld(context, worldId);
  const nextName = name.trim().slice(0, 36);
  if (!nextName) throw new Error("World name is required");
  world.name = nextName;
  context.systems = appendSystemEvent(context.systems, "world.renamed", `Renamed strategic world to ${nextName}.`, { worldId });
  await saveSystemContext(context);
  return makeWorldResponse(context);
}
