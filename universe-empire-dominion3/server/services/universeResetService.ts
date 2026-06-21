import { sql } from "drizzle-orm";
import { db } from "../db";
import { storage } from "../storage";
import { playerStates, type InsertPlayerState, users } from "@shared/schema";

type UniverseResetSummary = {
  resetAt: string;
  accountCount: number;
};

const GAMEPLAY_TABLES = [
  "player_states",
  "missions",
  "messages",
  "alliances",
  "alliance_members",
  "market_orders",
  "auction_listings",
  "auction_bids",
  "trade_offers",
  "trade_history",
  "queue_items",
  "player_colonies",
  "resource_fields",
  "equipment_durability",
  "fleet_durability",
  "building_durability",
  "battles",
  "battle_logs",
  "player_research_progress",
  "expeditions",
  "expedition_teams",
  "expedition_encounters",
  "starbases",
  "moon_bases",
  "player_profiles",
  "mega_structures",
  "empire_difficulties",
  "story_campaigns",
  "story_missions",
  "achievements",
  "element_buffs",
  "npc_factions",
  "npc_vendors",
  "relics",
  "relic_inventory",
  "friends",
  "friend_requests",
  "guilds",
  "guild_members",
  "teams",
  "raids",
  "raid_combats",
  "combat_stats",
  "universe_events",
  "universe_bosses",
  "boss_encounters",
  "raid_groups",
  "raid_finder",
  "pve_combat_logs",
  "items",
  "player_items",
  "bank_accounts",
  "bank_transactions",
  "empire_values",
  "player_currency",
  "currency_transactions",
] as const;

function buildFreshPlayerState(userId: string): InsertPlayerState {
  return {
    userId,
    setupComplete: false,
    planetName: "New Colony",
    coordinates: "[1:1:1]",
    resources: {
      metal: 1000,
      crystal: 500,
      deuterium: 0,
      energy: 0,
      credits: 1000,
      food: 500,
      water: 500,
    },
    units: {},
    commander: {
      race: "human",
      class: "warrior",
      stats: {
        level: 1,
        xp: 0,
        warfare: 0,
        logistics: 0,
        engineering: 0,
      },
      equipment: {},
      inventory: [],
      title: "Commander",
    },
    government: {
      type: "democracy",
      taxRate: 10,
      policies: [],
      stats: {
        stability: 50,
        efficiency: 70,
        publicSupport: 60,
        militaryReadiness: 50,
      },
    },
    currentTurns: 50,
    totalTurns: 50,
    lastTurnUpdate: new Date(),
    lastResourceUpdate: new Date(),
  };
}

export class UniverseResetService {
  static async resetUniverse(): Promise<UniverseResetSummary> {
    const existingUsers = await db.select({ id: users.id }).from(users);
    const resetAt = new Date().toISOString();

    const tableList = GAMEPLAY_TABLES.map((name) => `"${name}"`).join(", ");
    await db.execute(sql.raw(`TRUNCATE TABLE IF EXISTS ${tableList} RESTART IDENTITY CASCADE`));

    await db.execute(sql`
      DELETE FROM system_settings
      WHERE key LIKE 'universe_seed:%'
         OR key = 'admin_universe_reset_queue'
    `);

    if (existingUsers.length > 0) {
      await db.insert(playerStates).values(existingUsers.map((user) => buildFreshPlayerState(user.id)));
    }

    await storage.setSetting(
      "admin_last_universe_reset",
      {
        resetAt,
        accountCount: existingUsers.length,
      },
      "Most recent completed universe reset",
      "admin",
    );

    return {
      resetAt,
      accountCount: existingUsers.length,
    };
  }
}
