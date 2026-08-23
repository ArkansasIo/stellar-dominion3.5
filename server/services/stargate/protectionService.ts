import { STARGATE_BALANCE_RULES } from "./balanceRules";
import { appendSystemEvent, buildSystemSnapshot, loadSystemContext, saveSystemContext } from "./systemStateService";

export async function getProtectionState(userId: string) {
  const context = await loadSystemContext(userId);
  const now = Date.now();
  return {
    ...buildSystemSnapshot(context),
    protection: {
      ...context.systems.protection,
      raidCooldownRemainingSeconds: Math.max(0, Math.ceil((context.systems.protection.lastRaidAt + STARGATE_BALANCE_RULES.protection.attackCooldownMinutes * 60_000 - now) / 1000)),
      pptActive: context.systems.protection.pptUntil > now,
      covertAttemptsInLastHour: context.systems.protection.covertAttempts.filter((entry) => entry > now - 60 * 60 * 1000).length,
    },
    rules: STARGATE_BALANCE_RULES.protection,
  };
}

export async function setVacationMode(userId: string, enabled: boolean) {
  const context = await loadSystemContext(userId);
  context.systems.protection.vacationMode = enabled;
  context.systems = appendSystemEvent(context.systems, "protection.vacation", enabled ? "Vacation protection enabled." : "Vacation protection disabled.", { enabled });
  await saveSystemContext(context);
  return getProtectionState(userId);
}

export async function enforceStrategicOperation(attackerId: string, defenderId: string, kind: "raid" | "covert") {
  const [attacker, defender] = await Promise.all([loadSystemContext(attackerId), loadSystemContext(defenderId)]);
  const now = Date.now();
  if (defender.systems.protection.vacationMode) throw new Error("Target is protected by vacation mode");
  if (defender.systems.protection.pptUntil > now) throw new Error("Target is protected by player protection time");
  if (kind === "raid" && attacker.systems.protection.lastRaidAt + STARGATE_BALANCE_RULES.protection.attackCooldownMinutes * 60_000 > now) throw new Error("Raid cooldown is still active");
  if (kind === "covert" && attacker.systems.protection.covertAttempts.filter((entry) => entry > now - 60 * 60 * 1000).length >= STARGATE_BALANCE_RULES.protection.covertSaturationLimit) throw new Error("Covert saturation limit reached for this hour");
  return { attacker, defender };
}

export async function recordStrategicOperation(userId: string, kind: "raid" | "covert") {
  const context = await loadSystemContext(userId);
  const now = Date.now();
  if (kind === "raid") context.systems.protection.lastRaidAt = now;
  else context.systems.protection.covertAttempts = [...context.systems.protection.covertAttempts.filter((entry) => entry > now - 60 * 60 * 1000), now];
  context.systems = appendSystemEvent(context.systems, `protection.${kind}`, `${kind === "raid" ? "Raid" : "Covert"} operation recorded for protection controls.`);
  await saveSystemContext(context);
}

export async function setPlayerProtectionUntil(userId: string, pptUntil: number) {
  const context = await loadSystemContext(userId);
  context.systems.protection.pptUntil = Math.max(0, Math.floor(pptUntil));
  await saveSystemContext(context);
}
