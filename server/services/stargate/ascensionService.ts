import { ASCENSION_RULES, getAscensionStatus } from "../stargateWarsService";
import { appendSystemEvent, buildSystemSnapshot, getStrategicNumber, loadSystemContext, saveSystemContext, setStrategicNumber } from "./systemStateService";

export async function getAscensionLifecycle(userId: string) {
  const readiness = await getAscensionStatus(userId);
  const context = await loadSystemContext(userId);
  return { ...buildSystemSnapshot(context), readiness, history: context.systems.ascensionHistory, rules: ASCENSION_RULES };
}

export async function previewAscension(userId: string) {
  const lifecycle = await getAscensionLifecycle(userId);
  return {
    ...lifecycle,
    preview: {
      preserved: ["lifers", "ascensionPoints", "ascensionLevel", "ascensionHistory"],
      reset: ["available Naquadah", "banked Naquadah", "trained forces", "attack turns", "armory equipment", "strategic worlds except Homeworld"],
      reward: "One permanent Ascension Point and next Ascension Level.",
    },
  };
}

export async function executeAscension(userId: string) {
  const readiness = await getAscensionStatus(userId);
  if (!readiness.eligible) throw new Error(`Ascension requirements unmet: ${readiness.unmet.join(", ")}`);
  const context = await loadSystemContext(userId);
  const currentLevel = getStrategicNumber(context, "ascensionLevel");
  if (currentLevel >= ASCENSION_RULES.maximumAscensionLevel) throw new Error("Maximum Ascension Level reached");
  const nextLevel = currentLevel + 1;
  const race = typeof context.strategic.race === "string" ? context.strategic.race : "tauri";
  context.resources.naquadah = 25_000;
  context.resources.bankedNaquadah = 0;
  context.units = { ...context.units, untrained: 100, attackTroops: 0, defenseTroops: 0, attackWeapons: 0, defenseWeapons: 0, covertAgents: 0, antiIntelAgents: 0 };
  setStrategicNumber(context, "ascensionLevel", nextLevel);
  setStrategicNumber(context, "ascensionPoints", getStrategicNumber(context, "ascensionPoints") + 1);
  setStrategicNumber(context, "glory", 0);
  setStrategicNumber(context, "reputation", 0);
  setStrategicNumber(context, "attackTurns", 20);
  context.systems.worlds = context.systems.worlds.slice(0, 1);
  context.systems.mothership = { owned: false, name: "Uncommissioned Mothership", capacity: 0, usedCapacity: 0, weapons: 0, shields: 0, hangars: 0, explorationReadyAt: null, discoveries: 0 };
  context.systems.ascensionHistory = [{ level: nextLevel, ascendedAt: Date.now(), race }, ...context.systems.ascensionHistory].slice(0, 10);
  context.systems = appendSystemEvent(context.systems, "ascension.executed", `Ascended to level ${nextLevel}.`, { race, nextLevel });
  await saveSystemContext(context);
  return getAscensionLifecycle(userId);
}
