export interface CommanderLevelUnlock {
  level: number;
  unlocks: string[];
  bonuses: Record<string, number>;
}

export const COMMANDER_LEVEL_UNLOCKS: CommanderLevelUnlock[] = [
  { level: 1, unlocks: ['Homeworld Command'], bonuses: { resourceProduction: 0.02 } },
  { level: 5, unlocks: ['Hero Officer Assignment'], bonuses: { fleetAttack: 0.02, fleetDefense: 0.02 } },
  { level: 10, unlocks: ['Trade Routes'], bonuses: { tradeEfficiency: 0.05 } },
  { level: 15, unlocks: ['Second Colony'], bonuses: { colonyDevelopment: 0.05 } },
  { level: 20, unlocks: ['Fleet Formations'], bonuses: { fleetAttack: 0.05, fleetEvasion: 0.03 } },
  { level: 25, unlocks: ['Advanced Espionage'], bonuses: { espionagePower: 0.1 } },
  { level: 30, unlocks: ['Alliance Creation'], bonuses: { allianceBonus: 0.05 } },
  { level: 35, unlocks: ['Third Colony'], bonuses: { colonyDevelopment: 0.08 } },
  { level: 40, unlocks: ['Titan Ships'], bonuses: { fleetAttack: 0.08, fleetDefense: 0.05 } },
  { level: 45, unlocks: ['Deep Space Probes'], bonuses: { sensorRange: 0.1 } },
  { level: 50, unlocks: ['Galaxy Gate Access'], bonuses: { warpSpeed: 0.1, warpCapacity: 1 } },
  { level: 55, unlocks: ['Executive Officer'], bonuses: { buildSpeed: 0.1, researchSpeed: 0.05 } },
  { level: 60, unlocks: ['Fourth Colony'], bonuses: { colonyDevelopment: 0.1 } },
  { level: 65, unlocks: ['Fleet Admiral Title'], bonuses: { fleetAttack: 0.1, fleetDefense: 0.08, fleetEvasion: 0.05 } },
  { level: 70, unlocks: ['Orbital Shipyard'], bonuses: { shipBuildSpeed: 0.15 } },
  { level: 75, unlocks: ['Ancient Technology Access'], bonuses: { researchSpeed: 0.1 } },
  { level: 80, unlocks: ['Fifth Colony'], bonuses: { colonyDevelopment: 0.12 } },
  { level: 85, unlocks: ['Dyson Swarm Project'], bonuses: { energyProduction: 0.2 } },
  { level: 90, unlocks: ['Quantum Gate Network'], bonuses: { warpSpeed: 0.15, warpCapacity: 2 } },
  { level: 95, unlocks: ['Galactic Council Seat'], bonuses: { allianceBonus: 0.1, diplomacyPower: 0.1 } },
  { level: 100, unlocks: ['Intergalactic Empire'], bonuses: { resourceProduction: 0.25, fleetAttack: 0.15, fleetDefense: 0.12, researchSpeed: 0.15 } },
];

export function getCommanderLevelUnlocks(level: number): CommanderLevelUnlock[] {
  return COMMANDER_LEVEL_UNLOCKS.filter(u => level >= u.level);
}

export function getCommanderLevelBonus(level: number): Record<string, number> {
  const total: Record<string, number> = {};
  for (const unlock of COMMANDER_LEVEL_UNLOCKS) {
    if (level >= unlock.level) {
      for (const [key, value] of Object.entries(unlock.bonuses)) {
        total[key] = (total[key] || 0) + value;
      }
    }
  }
  return total;
}

export function getNextCommanderLevelUnlock(level: number): CommanderLevelUnlock | null {
  return COMMANDER_LEVEL_UNLOCKS.find(u => u.level > level) || null;
}
