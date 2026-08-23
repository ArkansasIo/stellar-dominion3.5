import { STARGATE_BALANCE_RULES } from "./balanceRules";
import { appendSystemEvent, buildSystemSnapshot, loadSystemContext, saveSystemContext } from "./systemStateService";

export type MothershipModule = "capacity" | "weapons" | "shields" | "hangars";

export async function getMothershipState(userId: string) {
  const context = await loadSystemContext(userId);
  return { ...buildSystemSnapshot(context), mothership: context.systems.mothership, rules: STARGATE_BALANCE_RULES.mothership };
}

export async function buyMothership(userId: string, name?: string) {
  const context = await loadSystemContext(userId);
  if (context.systems.mothership.owned) throw new Error("This realm already operates a mothership");
  const cost = STARGATE_BALANCE_RULES.mothership.basePurchaseCost;
  if (context.resources.naquadah < cost) throw new Error("Insufficient Naquadah to commission a mothership");
  context.resources.naquadah -= cost;
  context.systems.mothership = { owned: true, name: (name || "Stargate Flagship").slice(0, 36), capacity: 10, usedCapacity: 0, weapons: 0, shields: 0, hangars: 0, explorationReadyAt: null, discoveries: 0 };
  context.systems = appendSystemEvent(context.systems, "mothership.commissioned", `Commissioned mothership ${context.systems.mothership.name}.`, { cost });
  await saveSystemContext(context);
  return getMothershipState(userId);
}

export async function upgradeMothership(userId: string, module: MothershipModule) {
  const context = await loadSystemContext(userId);
  const ship = context.systems.mothership;
  if (!ship.owned) throw new Error("Commission a mothership before upgrading modules");
  const level = module === "capacity" ? ship.capacity / 10 : ship[module];
  const cost = 8_000 + Math.floor(level) * 5_000;
  if (context.resources.naquadah < cost) throw new Error("Insufficient Naquadah for this mothership module");
  context.resources.naquadah -= cost;
  if (module === "capacity") ship.capacity += 10;
  else ship[module] += 1;
  context.systems = appendSystemEvent(context.systems, "mothership.upgrade", `Upgraded mothership ${module}.`, { module, cost });
  await saveSystemContext(context);
  return getMothershipState(userId);
}

export async function startExploration(userId: string) {
  const context = await loadSystemContext(userId);
  const ship = context.systems.mothership;
  if (!ship.owned) throw new Error("Commission a mothership before starting exploration");
  if (ship.explorationReadyAt && ship.explorationReadyAt > Date.now()) throw new Error("An exploration mission is already underway");
  const cost = 3_000;
  if (context.resources.naquadah < cost) throw new Error("Insufficient Naquadah for exploration logistics");
  context.resources.naquadah -= cost;
  ship.explorationReadyAt = Date.now() + STARGATE_BALANCE_RULES.mothership.explorationDurationHours * 60 * 60 * 1000;
  context.systems = appendSystemEvent(context.systems, "mothership.exploration.started", "Mothership dispatched on exploration mission.", { readyAt: ship.explorationReadyAt, cost });
  await saveSystemContext(context);
  return getMothershipState(userId);
}

export async function claimExploration(userId: string, now = Date.now()) {
  const context = await loadSystemContext(userId);
  const ship = context.systems.mothership;
  if (!ship.owned || !ship.explorationReadyAt) throw new Error("No exploration mission is ready to claim");
  if (ship.explorationReadyAt > now) throw new Error("Exploration mission is not complete yet");
  if (context.systems.worlds.length >= 10) throw new Error("Strategic world limit reached");
  const worldNumber = context.systems.worlds.length + 1;
  const world = { id: `world-${userId}-${Date.now()}`, name: `Explored World ${worldNumber}`, ownerId: userId, condition: 100, defenses: 0, bonuses: { attack: 1, defense: 0, covert: 0, unitProduction: 1, income: 1 }, discoveredAt: Date.now() };
  context.systems.worlds = [...context.systems.worlds, world];
  ship.explorationReadyAt = null;
  ship.discoveries += 1;
  context.systems = appendSystemEvent(context.systems, "mothership.exploration.claimed", `Exploration secured ${world.name}.`, { worldId: world.id });
  await saveSystemContext(context);
  return { ...buildSystemSnapshot(context), mothership: ship, discoveredWorld: world };
}
