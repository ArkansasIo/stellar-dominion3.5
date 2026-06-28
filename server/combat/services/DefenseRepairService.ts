export function calculateRepairedDefenses(
  destroyedUnits: Record<string, number>,
  repairRate: number,
): Record<string, number> {
  const repaired: Record<string, number> = {};
  if (repairRate <= 0) return repaired;

  for (const [machineName, amount] of Object.entries(destroyedUnits)) {
    if (amount <= 0) continue;

    let repairedCount = 0;
    for (let i = 0; i < amount; i++) {
      if (Math.random() * 100 < repairRate) {
        repairedCount++;
      }
    }

    if (repairedCount > 0) {
      repaired[machineName] = repairedCount;
    }
  }

  return repaired;
}
