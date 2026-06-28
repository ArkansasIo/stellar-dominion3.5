import { and, asc, eq, ilike } from "drizzle-orm";
import { db } from "../db";
import {
  ogameCatalogCategories,
  ogameCatalogEntries,
  type OgameCatalogCategory,
  type OgameCatalogEntry,
} from "@shared/schema";
import {
  OGAME_CATALOG_CATEGORIES,
  OGAME_CATALOG_ENTRIES,
  OGAME_CATALOG_ENTRY_MAP,
  type OgameCatalogCost,
} from "@shared/config/ogameCatalogConfig";

const asNumber = (value: unknown): number =>
  typeof value === "number" && Number.isFinite(value) ? value : 0;

const asLevel = (value: unknown): number =>
  Math.max(0, Math.floor(asNumber(value)));

const normalizeCost = (raw: unknown): OgameCatalogCost => {
  if (!raw || typeof raw !== "object") {
    return { metal: 0, crystal: 0, deuterium: 0 };
  }

  const cost = raw as Record<string, unknown>;
  return {
    metal: Math.max(0, asNumber(cost.metal)),
    crystal: Math.max(0, asNumber(cost.crystal)),
    deuterium: Math.max(0, asNumber(cost.deuterium)),
    energy: Math.max(0, asNumber(cost.energy)),
    darkMatter: Math.max(0, asNumber(cost.darkMatter)),
  };
};

const isScalableByLevel = (entryType: string): boolean =>
  entryType === "building" || entryType === "research" || entryType === "moon";

export async function seedOgameCatalogIfNeeded(): Promise<{
  seeded: boolean;
  categoryCount: number;
  entryCount: number;
}> {
  const existing = await db
    .select({ id: ogameCatalogEntries.id })
    .from(ogameCatalogEntries)
    .limit(1);

  if (existing.length > 0) {
    const categories = await db
      .select({ id: ogameCatalogCategories.id })
      .from(ogameCatalogCategories);
    const entries = await db
      .select({ id: ogameCatalogEntries.id })
      .from(ogameCatalogEntries);

    return {
      seeded: false,
      categoryCount: categories.length,
      entryCount: entries.length,
    };
  }

  await db
    .insert(ogameCatalogCategories)
    .values(OGAME_CATALOG_CATEGORIES)
    .onConflictDoNothing();

  await db
    .insert(ogameCatalogEntries)
    .values(
      OGAME_CATALOG_ENTRIES.map((entry) => ({
        ...entry,
        isMoonOnly: entry.isMoonOnly ?? false,
      })),
    )
    .onConflictDoNothing();

  return {
    seeded: true,
    categoryCount: OGAME_CATALOG_CATEGORIES.length,
    entryCount: OGAME_CATALOG_ENTRIES.length,
  };
}

export async function getOgameCategories(): Promise<OgameCatalogCategory[]> {
  await seedOgameCatalogIfNeeded();
  return db
    .select()
    .from(ogameCatalogCategories)
    .orderBy(asc(ogameCatalogCategories.sortOrder), asc(ogameCatalogCategories.name));
}

export async function getOgameEntries(filters?: {
  categoryId?: string;
  entryType?: string;
  search?: string;
  moonOnly?: boolean;
}): Promise<OgameCatalogEntry[]> {
  await seedOgameCatalogIfNeeded();

  const conditions = [];

  if (filters?.categoryId) {
    conditions.push(eq(ogameCatalogEntries.categoryId, filters.categoryId));
  }

  if (filters?.entryType) {
    conditions.push(eq(ogameCatalogEntries.entryType, filters.entryType));
  }

  if (typeof filters?.moonOnly === "boolean") {
    conditions.push(eq(ogameCatalogEntries.isMoonOnly, filters.moonOnly));
  }

  if (filters?.search) {
    conditions.push(ilike(ogameCatalogEntries.name, `%${filters.search}%`));
  }

  if (conditions.length === 0) {
    return db
      .select()
      .from(ogameCatalogEntries)
      .orderBy(asc(ogameCatalogEntries.name));
  }

  if (conditions.length === 1) {
    return db
      .select()
      .from(ogameCatalogEntries)
      .where(conditions[0])
      .orderBy(asc(ogameCatalogEntries.name));
  }

  return db
    .select()
    .from(ogameCatalogEntries)
    .where(and(...conditions))
    .orderBy(asc(ogameCatalogEntries.name));
}

export async function getOgameEntryById(entryId: string): Promise<OgameCatalogEntry | undefined> {
  await seedOgameCatalogIfNeeded();

  const [entry] = await db
    .select()
    .from(ogameCatalogEntries)
    .where(eq(ogameCatalogEntries.id, entryId))
    .limit(1);

  return entry;
}

export async function getOgameCatalogGrouped() {
  const [categories, entries] = await Promise.all([
    getOgameCategories(),
    getOgameEntries(),
  ]);

  return categories.map((category) => ({
    ...category,
    entries: entries.filter((entry) => entry.categoryId === category.id),
  }));
}

export function calculateOgameCost(
  entry: Pick<OgameCatalogEntry, "baseCost" | "entryType" | "growthFactor">,
  level: number,
  quantity = 1,
): OgameCatalogCost {
  const safeLevel = Math.max(1, Math.floor(level));
  const safeQuantity = Math.max(1, Math.floor(quantity));
  const baseCost = normalizeCost(entry.baseCost);

  const growthMultiplier = isScalableByLevel(entry.entryType)
    ? Math.pow(Math.max(entry.growthFactor || 1, 1), safeLevel - 1)
    : 1;

  const finalMultiplier = growthMultiplier * safeQuantity;

  return {
    metal: Math.ceil(baseCost.metal * finalMultiplier),
    crystal: Math.ceil(baseCost.crystal * finalMultiplier),
    deuterium: Math.ceil(baseCost.deuterium * finalMultiplier),
    energy: Math.ceil((baseCost.energy || 0) * finalMultiplier),
    darkMatter: Math.ceil((baseCost.darkMatter || 0) * finalMultiplier),
  };
}

export function calculateOgameProduction(
  buildings: Record<string, number>,
  research: Record<string, number> = {},
) {
  const metalMine = asLevel(buildings.metalMine);
  const crystalMine = asLevel(buildings.crystalMine);
  const deuteriumSynthesizer = asLevel(buildings.deuteriumSynthesizer);
  const solarPlant = asLevel(buildings.solarPlant);
  const fusionReactor = asLevel(buildings.fusionReactor);
  const plasmaTech = asLevel(research.plasmaTech);
  const energyTech = asLevel(research.energyTech);

  const rawMetalPerHour = 30 * metalMine * Math.pow(1.1, metalMine);
  const rawCrystalPerHour = 20 * crystalMine * Math.pow(1.1, crystalMine);
  const rawDeuteriumPerHour = 10 * deuteriumSynthesizer * Math.pow(1.1, deuteriumSynthesizer);

  const energyProducedFromSolar = 20 * solarPlant * Math.pow(1.1, solarPlant);
  const energyProducedFromFusion =
    30 * fusionReactor * Math.pow(1.05, fusionReactor) * (1 + energyTech * 0.01);

  const energyConsumedByMines =
    10 * metalMine * Math.pow(1.1, metalMine) +
    10 * crystalMine * Math.pow(1.1, crystalMine) +
    20 * deuteriumSynthesizer * Math.pow(1.1, deuteriumSynthesizer);

  const energyProduced = energyProducedFromSolar + energyProducedFromFusion;
  const energyFactor = energyConsumedByMines <= 0
    ? 1
    : Math.min(1, energyProduced / energyConsumedByMines);

  const plasmaMetalBonus = 1 + plasmaTech * 0.01;
  const plasmaCrystalBonus = 1 + plasmaTech * 0.0066;
  const plasmaDeutBonus = 1 + plasmaTech * 0.0033;

  return {
    perHour: {
      metal: Math.floor(rawMetalPerHour * energyFactor * plasmaMetalBonus),
      crystal: Math.floor(rawCrystalPerHour * energyFactor * plasmaCrystalBonus),
      deuterium: Math.floor(rawDeuteriumPerHour * energyFactor * plasmaDeutBonus),
    },
    energy: {
      produced: Math.floor(energyProduced),
      consumed: Math.floor(energyConsumedByMines),
      net: Math.floor(energyProduced - energyConsumedByMines),
      efficiency: Number(energyFactor.toFixed(4)),
    },
  };
}

export function calculateOgameCombatRating(
  fleet: Record<string, number>,
  research: Record<string, number> = {},
) {
  const weaponBonus = 1 + asLevel(research.weaponsTech) * 0.1;
  const shieldBonus = 1 + asLevel(research.shieldingTech) * 0.1;
  const hullBonus = 1 + asLevel(research.armourTech) * 0.1;

  let totalAttack = 0;
  let totalShield = 0;
  let totalHull = 0;
  let totalUnits = 0;

  for (const [entryId, amount] of Object.entries(fleet)) {
    const quantity = Math.max(0, Math.floor(amount));
    if (quantity === 0) continue;

    const entry = OGAME_CATALOG_ENTRY_MAP[entryId];
    if (!entry) continue;
    if (entry.entryType !== "ship" && entry.entryType !== "defense") continue;

    const attack = asNumber(entry.stats.attack) * quantity;
    const shield = asNumber(entry.stats.shield) * quantity;
    const hull = asNumber(entry.stats.hull) * quantity;

    totalAttack += attack;
    totalShield += shield;
    totalHull += hull;
    totalUnits += quantity;
  }

  const finalAttack = totalAttack * weaponBonus;
  const finalShield = totalShield * shieldBonus;
  const finalHull = totalHull * hullBonus;

  // Weighted overall score intended for quick matchup heuristics.
  const combatRating = Math.round(finalAttack * 0.5 + finalShield * 0.3 + finalHull * 0.2);

  return {
    units: totalUnits,
    attack: Math.round(finalAttack),
    shield: Math.round(finalShield),
    hull: Math.round(finalHull),
    combatRating,
  };
}

export function getUnlockState(levels: Record<string, number>) {
  return OGAME_CATALOG_ENTRIES.map((entry) => {
    const missing = Object.entries(entry.prerequisites)
      .filter(([key, required]) => (levels[key] || 0) < required)
      .map(([key, required]) => ({
        key,
        required,
        current: levels[key] || 0,
      }));

    return {
      id: entry.id,
      name: entry.name,
      entryType: entry.entryType,
      unlocked: missing.length === 0,
      missing,
    };
  });
}
