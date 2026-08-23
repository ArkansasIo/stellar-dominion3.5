import { db } from "../../db";
import { type RankingCategory, RANKING_CATEGORIES } from "./rankingTypes";

export { RANKING_CATEGORIES, type RankingCategory } from "./rankingTypes";

const asRecord = (value: unknown): Record<string, unknown> => value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
const value = (input: unknown) => Math.max(0, Math.floor(Number(input) || 0));

function categoryScore(category: RankingCategory, row: { resources: unknown; units: unknown; government: unknown }) {
  const resources = asRecord(row.resources);
  const units = asRecord(row.units);
  const government = asRecord(row.government);
  const strategic = asRecord(government.stargateWars);
  const systems = asRecord(government.stargateSystems);
  const mothership = asRecord(systems.mothership);
  const alliance = asRecord(systems.alliance);
  const attack = value(units.attackTroops) * 5 + value(units.superAttackTroops) * 10 + value(units.attackWeapons) * 5;
  const defense = value(units.defenseTroops) * 5 + value(units.superDefenseTroops) * 10 + value(units.defenseWeapons) * 5;
  const covert = value(units.covertAgents) * 12 + value(strategic.spyLevel) * 120;
  const overall = attack + defense + covert + value(units.antiIntelAgents) * 10 + value(strategic.glory) + value(strategic.reputation);
  if (category === "attack") return attack;
  if (category === "defense") return defense;
  if (category === "covert") return covert;
  if (category === "mothership") return value(mothership.capacity) * 150 + value(mothership.weapons) * 300 + value(mothership.shields) * 300;
  if (category === "glory") return value(strategic.glory);
  if (category === "reputation") return value(strategic.reputation);
  if (category === "alliance") return alliance.id ? overall : 0;
  if (category === "race") return overall;
  return overall;
}

export async function getRankings(_userId: string, category: RankingCategory = "overall") {
  if (!RANKING_CATEGORIES.includes(category)) throw new Error("Unsupported ranking category");
  const rows = await db.query.playerStates.findMany();
  const standings = rows.map((row) => ({ userId: row.userId, planetName: row.planetName || "Strategic Realm", score: categoryScore(category, row) })).sort((left, right) => right.score - left.score || left.userId.localeCompare(right.userId)).map((entry, index) => ({ ...entry, rank: index + 1 }));
  return { category, categories: RANKING_CATEGORIES, standings, generatedAt: Date.now() };
}
