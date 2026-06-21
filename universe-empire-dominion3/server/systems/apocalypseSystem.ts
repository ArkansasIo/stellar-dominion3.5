import { SCHEDULER_CONFIG } from "../../shared/config/xenoberage/schedulerConfig";
import { COLONIZATION_CONFIG } from "../../shared/config/xenoberage/colonizationConfig";

export interface ApocalypseEvent {
  type: "space_plague" | "plasma_storm" | "doomsday" | "none";
  sectorId?: string;
  planetId?: string;
  severity: number;
  description: string;
}

/**
 * Process apocalypse events per tick.
 * Random chance to trigger events based on scheduler rate.
 */
export async function processApocalypse(
  tick: number
): Promise<ApocalypseEvent[]> {
  const events: ApocalypseEvent[] = [];

  // Check if apocalypse should trigger this tick
  const chance = Math.random();
  if (chance < 0.05) {
    // 5% chance per tick
    const event = generateApocalypseEvent();
    if (event.type !== "none") {
      events.push(event);
    }
  }

  return events;
}

/**
 * Calculate space plague effect on a planet's population.
 * killed = population * plagueKills
 */
export function calculateSpacePlague(
  population: number,
  plagueKills: number = COLONIZATION_CONFIG.spacePlagueKills
): { survived: number; killed: number } {
  const killed = Math.floor(population * plagueKills);
  return {
    survived: population - killed,
    killed,
  };
}

/**
 * Calculate plasma storm damage to a sector.
 * Damages fighters and mines in the sector.
 */
export function calculatePlasmaStorm(sector: {
  fighters: number;
  mines: number;
}): { fighters: number; mines: number; damageDescription: string } {
  const fighterDamage = Math.floor(sector.fighters * 0.3);
  const mineDamage = Math.floor(sector.mines * 0.3);

  return {
    fighters: Math.max(0, sector.fighters - fighterDamage),
    mines: Math.max(0, sector.mines - mineDamage),
    damageDescription: `Plasma storm destroyed ${fighterDamage} fighters and ${mineDamage} mines`,
  };
}

/**
 * Process doomsday event for planets with large populations.
 * If population > doomsdayValue, a percentage is killed.
 */
export function processDoomsday(
  planet: { population: number; id: string },
  doomsdayValue: number = COLONIZATION_CONFIG.doomsdayValue
): { survived: number; killed: number; triggered: boolean } {
  if (planet.population <= doomsdayValue) {
    return { survived: planet.population, killed: 0, triggered: false };
  }

  const excess = planet.population - doomsdayValue;
  const killed = Math.floor(excess * 0.10);
  return {
    survived: planet.population - killed,
    killed,
    triggered: true,
  };
}

/**
 * Generate a random apocalypse event.
 */
export function generateApocalypseEvent(): ApocalypseEvent {
  const roll = Math.random();

  if (roll < 0.4) {
    return {
      type: "space_plague",
      severity: Math.random() * 0.5 + 0.1,
      description: "Space plague breaks out across the sector",
    };
  } else if (roll < 0.7) {
    return {
      type: "plasma_storm",
      severity: Math.random() * 0.5 + 0.1,
      description: "A violent plasma storm sweeps through the sector",
    };
  } else if (roll < 0.85) {
    return {
      type: "doomsday",
      severity: Math.random() * 0.3 + 0.1,
      description: "Doomsday event - massive population loss on overpopulated planets",
    };
  }

  return {
    type: "none",
    severity: 0,
    description: "The universe is calm... for now",
  };
}
