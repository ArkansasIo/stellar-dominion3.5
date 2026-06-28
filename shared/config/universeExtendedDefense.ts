import type { OgameCatalogEntryDefinition } from "./ogameCatalogConfig";

/**
 * Extended defense from UniEngine (ID 409).
 * A super-heavy planetary shield/defense platform with extreme stats.
 * Not present in standard OGame (defense IDs are 401-408, 502-503).
 */
export const UNIVERSE_EXTENDED_DEFENSES: OgameCatalogEntryDefinition[] = [
  {
    id: "planetaryShieldGenerator",
    categoryId: "defense",
    entryType: "defense",
    name: "Planetary Shield Generator",
    description: "Ultimate planetary defense system generating an impenetrable shield matrix with integrated counter-battery cannons.",
    baseCost: { metal: 10000000, crystal: 5000000, deuterium: 2500000 },
    baseTimeSeconds: 18000,
    growthFactor: 1,
    prerequisites: { shipyard: 15, shieldingTech: 15, plasmaTech: 12, energyTech: 15 },
    stats: { attack: 1000000, shield: 1000000, hull: 25000000, limitPerPlanet: 1 },
  },
];

export const UNIVERSE_EXTENDED_DEFENSE_MAP: Record<string, OgameCatalogEntryDefinition> =
  Object.fromEntries(UNIVERSE_EXTENDED_DEFENSES.map((entry) => [entry.id, entry]));
