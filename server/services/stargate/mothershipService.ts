import { STARGATE_BALANCE_RULES } from "./balanceRules";
import { appendSystemEvent, buildSystemSnapshot, loadSystemContext, saveSystemContext, type StrategicWorld } from "./systemStateService";
import { getMissionProfile, getMothershipModuleCost, getMothershipModuleLevel, getMothershipTelemetry, isMissionType, MISSION_PROFILES, type MissionType } from "./worldOperationsService";
import { generateMoonsForWorld, getWorldSizeProfile, resolveWorldArchetype, stableWorldId, type WorldSize } from "../../../shared/config/worldMoonTaxonomy";

export type MothershipModule = "capacity" | "weapons" | "shields" | "hangars";
export type ClaimExplorationResult = ReturnType<typeof buildSystemSnapshot> & {
  mothership: Awaited<ReturnType<typeof getMothershipState>>["mothership"];
  telemetry: ReturnType<typeof getMothershipTelemetry>;
  discoveredWorld: StrategicWorld | null;
  missionResult: Record<string, unknown>;
};

function moduleAllowed(value: unknown): value is MothershipModule {
  return value === "capacity" || value === "weapons" || value === "shields" || value === "hangars";
}

function createDiscoveredWorld(userId: string, number: number, missionType: MissionType): StrategicWorld {
  const worldType: StrategicWorld["worldType"] = missionType === "survey" ? (["mining", "agri", "military"] as const)[(number - 1) % 3] : "frontier";
  const classCode = missionType === "survey" ? (["I", "O", "V"] as const)[(number - 1) % 3] : (["D", "E", "J", "M", "Q", "X", "Z"] as const)[(number - 1) % 7];
  const size = getWorldSizeProfile(Math.min(9, 3 + (number % 6)) as WorldSize);
  const archetype = resolveWorldArchetype(classCode, size.size);
  const now = Date.now();
  const id = stableWorldId(archetype.classCode, size.size, number);
  return {
    id,
    name: `${archetype.name} ${number}`,
    ownerId: userId,
    worldType,
    classCode: archetype.classCode,
    className: archetype.className,
    subclass: archetype.subclass,
    type: archetype.type,
    subtype: archetype.subtype,
    biome: archetype.biome,
    subBiome: archetype.subBiome,
    size: size.size,
    sizeLabel: size.label,
    environment: archetype.environment,
    modifiers: archetype.modifiers,
    moons: generateMoonsForWorld(id, archetype.classCode, size.size, now),
    condition: 100,
    defenses: 0,
    developmentLevel: 1,
    population: worldType === "agri" ? 1_500 : 1_000,
    maxPopulation: worldType === "military" ? 7_500 : 5_000,
    stability: 75,
    lastYieldAt: now,
    bonuses: { attack: worldType === "military" ? 1 : 0, defense: 0, covert: 0, unitProduction: worldType === "military" ? 1 : 0, income: worldType === "mining" ? 1 : 0 },
    discoveredAt: now,
  };
}

export async function getMothershipState(userId: string) {
  const context = await loadSystemContext(userId);
  return {
    ...buildSystemSnapshot(context),
    mothership: context.systems.mothership,
    telemetry: getMothershipTelemetry(context.systems.mothership),
    missionProfiles: MISSION_PROFILES,
    rules: STARGATE_BALANCE_RULES.mothership,
  };
}

export async function buyMothership(userId: string, name?: string) {
  const context = await loadSystemContext(userId);
  if (context.systems.mothership.owned) throw new Error("This realm already operates a mothership");
  const cost = STARGATE_BALANCE_RULES.mothership.basePurchaseCost;
  if (context.resources.naquadah < cost) throw new Error("Insufficient Naquadah to commission a mothership");
  context.resources.naquadah -= cost;
  context.systems.mothership = {
    owned: true,
    name: (name?.trim() || "Stargate Flagship").slice(0, 36),
    capacity: 10,
    usedCapacity: 0,
    weapons: 0,
    shields: 0,
    hangars: 0,
    hull: STARGATE_BALANCE_RULES.mothership.baseHull,
    fuel: STARGATE_BALANCE_RULES.mothership.baseFuel,
    maxFuel: STARGATE_BALANCE_RULES.mothership.baseFuel,
    explorationReadyAt: null,
    missionType: null,
    discoveries: 0,
    missionsCompleted: 0,
    missionsFailed: 0,
    lastMissionAt: 0,
  };
  context.systems = appendSystemEvent(context.systems, "mothership.commissioned", `Commissioned mothership ${context.systems.mothership.name}.`, { cost });
  await saveSystemContext(context);
  return getMothershipState(userId);
}

export async function upgradeMothership(userId: string, module: MothershipModule) {
  if (!moduleAllowed(module)) throw new Error("Unsupported mothership module");
  const context = await loadSystemContext(userId);
  const ship = context.systems.mothership;
  if (!ship.owned) throw new Error("Commission a mothership before upgrading modules");
  const level = getMothershipModuleLevel(ship, module);
  if (level >= STARGATE_BALANCE_RULES.mothership.maxModuleLevel) throw new Error("This mothership module is at maximum level");
  const cost = getMothershipModuleCost(ship, module);
  if (context.resources.naquadah < cost) throw new Error("Insufficient Naquadah for this mothership module");
  context.resources.naquadah -= cost;
  if (module === "capacity") ship.capacity += 10;
  else if (module === "shields") ship.shields += 1;
  else if (module === "weapons") ship.weapons += 1;
  else {
    ship.hangars += 1;
    ship.maxFuel += 10;
    ship.fuel = Math.min(ship.maxFuel, ship.fuel + 10);
  }
  context.systems = appendSystemEvent(context.systems, "mothership.upgrade", `Upgraded mothership ${module} to level ${level + 1}.`, { module, previousLevel: level, nextLevel: level + 1, cost });
  await saveSystemContext(context);
  return getMothershipState(userId);
}

export async function startStrategicMission(userId: string, missionType: MissionType = "exploration") {
  if (!isMissionType(missionType)) throw new Error("Choose a supported mission type");
  const context = await loadSystemContext(userId);
  const ship = context.systems.mothership;
  if (!ship.owned) throw new Error("Commission a mothership before starting missions");
  const now = Date.now();
  if (ship.explorationReadyAt && ship.explorationReadyAt > now) throw new Error("A strategic mission is already underway");
  const profile = getMissionProfile(missionType);
  if (context.resources.naquadah < profile.cost) throw new Error(`Insufficient Naquadah for ${profile.label.toLowerCase()}`);
  if (ship.fuel < profile.fuel) throw new Error("Insufficient mothership fuel for this mission");
  if (missionType === "exploration" && context.systems.worlds.length >= STARGATE_BALANCE_RULES.worlds.maximumPlanets) throw new Error("Strategic world limit reached");
  context.resources.naquadah -= profile.cost;
  ship.fuel -= profile.fuel;
  ship.missionType = missionType;
  ship.explorationReadyAt = now + profile.durationHours * 60 * 60 * 1000;
  ship.lastMissionAt = now;
  context.systems = appendSystemEvent(context.systems, "mothership.mission.started", `${profile.label} mission launched.`, { missionType, readyAt: ship.explorationReadyAt, cost: profile.cost, fuel: profile.fuel });
  await saveSystemContext(context);
  return getMothershipState(userId);
}

export async function startExploration(userId: string) {
  return startStrategicMission(userId, "exploration");
}

export async function claimExploration(userId: string, now = Date.now()): Promise<ClaimExplorationResult> {
  const context = await loadSystemContext(userId);
  const ship = context.systems.mothership;
  if (!ship.owned || !ship.explorationReadyAt) throw new Error("No strategic mission is ready to claim");
  if (ship.explorationReadyAt > now) throw new Error("Strategic mission is not complete yet");
  const missionType = ship.missionType || "exploration";
  const profile = getMissionProfile(missionType);
  const riskRoll = (now + ship.discoveries * 17) % 100;
  const failed = riskRoll < profile.riskPercent;
  ship.explorationReadyAt = null;
  ship.missionType = null;
  if (failed) {
    ship.missionsFailed += 1;
    ship.hull = Math.max(1, ship.hull - Math.max(5, Math.floor(profile.riskPercent / 2)));
    context.systems = appendSystemEvent(context.systems, "mothership.mission.failed", `${profile.label} mission returned with damage and no secured objective.`, { missionType, hull: ship.hull });
    await saveSystemContext(context);
    return { ...buildSystemSnapshot(context), mothership: ship, telemetry: getMothershipTelemetry(ship), discoveredWorld: null, missionResult: { missionType, status: "failed", hullDamage: true } };
  }

  ship.missionsCompleted += 1;
  if (missionType === "salvage") {
    const rewardSeed = Math.max(0, now % 10_000);
    const naquadah = 2_000 + (rewardSeed % 6_001);
    const food = 500 + (rewardSeed % 1_501);
    const water = 500 + ((rewardSeed * 3) % 1_501);
    context.resources.naquadah += naquadah;
    context.resources.food = Number(context.resources.food || 0) + food;
    context.resources.water = Number(context.resources.water || 0) + water;
    context.systems = appendSystemEvent(context.systems, "mothership.salvage.claimed", "Recovered strategic supplies from a derelict convoy.", { missionType, naquadah, food, water });
    await saveSystemContext(context);
    return { ...buildSystemSnapshot(context), mothership: ship, telemetry: getMothershipTelemetry(ship), discoveredWorld: null, missionResult: { missionType, status: "success", rewards: { naquadah, food, water } } };
  }
  if (missionType === "rescue") {
    const rescued = 500 + (now % 1_001);
    const homeworld = context.systems.worlds[0];
    homeworld.population = Math.min(homeworld.maxPopulation, homeworld.population + rescued);
    context.systems = appendSystemEvent(context.systems, "mothership.rescue.claimed", `Rescued ${rescued.toLocaleString()} colonists.`, { missionType, rescued, worldId: homeworld.id });
    await saveSystemContext(context);
    return { ...buildSystemSnapshot(context), mothership: ship, telemetry: getMothershipTelemetry(ship), discoveredWorld: null, missionResult: { missionType, status: "success", rescued } };
  }

  if (context.systems.worlds.length >= STARGATE_BALANCE_RULES.worlds.maximumPlanets) throw new Error("Strategic world limit reached");
  const world = createDiscoveredWorld(userId, context.systems.worlds.length, missionType);
  context.systems.worlds = [...context.systems.worlds, world];
  ship.discoveries += 1;
  context.systems = appendSystemEvent(context.systems, "mothership.exploration.claimed", `Secured ${world.name} during ${profile.label.toLowerCase()}.`, { missionType, worldId: world.id, worldType: world.worldType });
  await saveSystemContext(context);
  return { ...buildSystemSnapshot(context), mothership: ship, telemetry: getMothershipTelemetry(ship), discoveredWorld: world, missionResult: { missionType, status: "success", worldId: world.id } };
}
