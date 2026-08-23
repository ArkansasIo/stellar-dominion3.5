import { STARGATE_BALANCE_RULES } from "./balanceRules";
import { appendSystemEvent, buildSystemSnapshot, loadSystemContext, saveSystemContext } from "./systemStateService";

export type WorldBonus = "attack" | "defense" | "covert" | "unitProduction" | "income";
const WORLD_BONUSES: WorldBonus[] = ["attack", "defense", "covert", "unitProduction", "income"];

export async function getWorldState(userId: string) {
  const context = await loadSystemContext(userId);
  return { ...buildSystemSnapshot(context), worlds: context.systems.worlds, rules: STARGATE_BALANCE_RULES.worlds };
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
  return getWorldState(userId);
}

export async function fortifyWorld(userId: string, worldId: string, quantity: number) {
  const amount = Math.max(1, Math.min(10_000, Math.floor(quantity)));
  const context = await loadSystemContext(userId);
  const world = getOwnedWorld(context, worldId);
  const cost = amount * 400;
  if (context.resources.naquadah < cost) throw new Error("Insufficient Naquadah for strategic defenses");
  context.resources.naquadah -= cost;
  world.defenses += amount;
  context.systems = appendSystemEvent(context.systems, "world.defense.fortified", `Added ${amount.toLocaleString()} defenses to ${world.name}.`, { worldId, quantity: amount, cost });
  await saveSystemContext(context);
  return getWorldState(userId);
}

export async function repairWorld(userId: string, worldId: string) {
  const context = await loadSystemContext(userId);
  const world = getOwnedWorld(context, worldId);
  const missing = Math.max(0, 100 - world.condition);
  if (!missing) throw new Error("This world is already fully repaired");
  const cost = missing * 250;
  if (context.resources.naquadah < cost) throw new Error("Insufficient Naquadah for repairs");
  context.resources.naquadah -= cost;
  world.condition = 100;
  context.systems = appendSystemEvent(context.systems, "world.repaired", `Restored ${world.name} to full condition.`, { worldId, cost });
  await saveSystemContext(context);
  return getWorldState(userId);
}

export async function renameWorld(userId: string, worldId: string, name: string) {
  const context = await loadSystemContext(userId);
  const world = getOwnedWorld(context, worldId);
  const nextName = name.trim().slice(0, 36);
  if (!nextName) throw new Error("World name is required");
  world.name = nextName;
  context.systems = appendSystemEvent(context.systems, "world.renamed", `Renamed strategic world to ${nextName}.`, { worldId });
  await saveSystemContext(context);
  return getWorldState(userId);
}
