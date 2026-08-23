export const STRATEGIC_PERSONNEL_KEYS = new Set([
  "untrained",
  "miners",
  "lifers",
  "attackTroops",
  "defenseTroops",
  "superAttackTroops",
  "superDefenseTroops",
  "attackWeapons",
  "defenseWeapons",
  "covertAgents",
  "antiIntelAgents",
]);

export function sumLegacyUnits(units: Record<string, number> | undefined): number {
  return Object.entries(units || {}).reduce((total, [key, value]) => {
    if (STRATEGIC_PERSONNEL_KEYS.has(key)) return total;
    const amount = Number(value);
    return total + (Number.isFinite(amount) && amount > 0 ? amount : 0);
  }, 0);
}

export function sumStrategicPersonnel(units: Record<string, number> | undefined): number {
  return [...STRATEGIC_PERSONNEL_KEYS].reduce((total, key) => {
    const amount = Number(units?.[key] || 0);
    return total + (Number.isFinite(amount) && amount > 0 ? amount : 0);
  }, 0);
}
