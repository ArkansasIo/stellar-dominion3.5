import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  boolean,
  real,
  serial,
  bigint
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: varchar("username").unique(),
  passwordHash: varchar("password_hash"),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// Player game state - stores all player progression
export const playerStates = pgTable("player_states", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  
  // Setup tracking
  setupComplete: boolean("setup_complete").notNull().default(false),
  
  // Planet Info
  planetName: varchar("planet_name").notNull().default("New Colony"),
  coordinates: varchar("coordinates").notNull().default("[1:1:1]"),
  knownPlanets: jsonb("known_planets").notNull().default([]),
  travelState: jsonb("travel_state").notNull().default({ activeRoute: null, discoveredWormholes: [] }),
  travelLog: jsonb("travel_log").notNull().default([]),
  
  // Resources (stored as JSON for flexibility)
  resources: jsonb("resources").notNull().default({ metal: 1000, crystal: 500, deuterium: 0, energy: 0 }),
  
  // Buildings (JSON object with building levels)
  buildings: jsonb("buildings").notNull().default({ roboticsFactory: 0, shipyard: 0, researchLab: 0 }),
  orbitalBuildings: jsonb("orbital_buildings").notNull().default({}),
  
  // Research (JSON object with tech levels)
  research: jsonb("research").notNull().default({}),
  
  // Research Queue System
  researchQueue: jsonb("research_queue").notNull().default([]),  // [] of ResearchQueuedItem
  researchHistory: jsonb("research_history").notNull().default([]),  // Completed research
  activeResearch: jsonb("active_research").notNull().default(null),  // Current research
  researchBonuses: jsonb("research_bonuses").notNull().default([]),  // Active bonuses
  researchModifiers: jsonb("research_modifiers").notNull().default([]),  // Tech/gov modifiers
  researchLab: jsonb("research_lab").notNull().default({
    type: "standard",
    level: 1,
    specialization: "general",
    durability: 100
  }),  // Currently using lab
  availableLabs: jsonb("available_labs").notNull().default([]),  // Accessible labs
  
  // Turn System - Track turn generation and progression
  turnsData: jsonb("turns_data").notNull().default({
    totalTurnsGenerated: 0,
    currentTurn: 0,
    lastTurnTimestamp: 0,
    turnsAvailable: 0,
    currentResearchTurns: 0,
    researchTurnHistory: []
  }),  // Turn tracking and generation
  
  // Research XP & Discovery System
  researchXP: jsonb("research_xp").notNull().default({
    totalXP: 0,
    currentLevelXP: 0,
    currentLevel: 1,
    researchesCompleted: 0,
    discoveredTechs: [],
    discoveries: [],
    discoveryStreak: 0,
    lastDiscoveryTime: 0,
    discoveryMultiplier: 1.0
  }),  // XP and discovery tracking
  
  // Units/Fleet (JSON object with unit counts)
  units: jsonb("units").notNull().default({}),
  
  // Commander data
  commander: jsonb("commander").notNull(),
  
  // Government data
  government: jsonb("government").notNull(),
  
  // Artifacts
  artifacts: jsonb("artifacts").notNull().default([]),
  
  // Cron jobs
  cronJobs: jsonb("cron_jobs").notNull().default([]),
  
  // Empire progression (1-999 levels)
  empireLevel: integer("empire_level").notNull().default(1),
  empireExperience: bigint("empire_experience", { mode: "number" }).notNull().default(0),
  
  // Tier system (1-21 tiers)
  tier: integer("tier").notNull().default(1),
  tierExperience: bigint("tier_experience", { mode: "number" }).notNull().default(0),
  
  // Prestige system
  prestigeLevel: integer("prestige_level").notNull().default(0),
  prestigeBonus: jsonb("prestige_bonus").notNull().default({ resourceMultiplier: 1.0, experienceMultiplier: 1.0, researchMultiplier: 1.0 }),
  
  // Tier bonuses
  tierBonuses: jsonb("tier_bonuses").notNull().default({}),
  
  kardashevProgress: jsonb("kardashev_progress").notNull().default({ metal: 0, crystal: 0, deuterium: 0, research: 0 }),
  
  // Turn system (3-5 turns per minute)
  totalTurns: integer("total_turns").notNull().default(0),
  currentTurns: integer("current_turns").notNull().default(0),
  lastTurnUpdate: timestamp("last_turn_update").defaultNow(),
  
  // Last resource update timestamp
  lastResourceUpdate: timestamp("last_resource_update").defaultNow(),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertPlayerStateSchema = createInsertSchema(playerStates).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertPlayerState = z.infer<typeof insertPlayerStateSchema>;
export type PlayerState = typeof playerStates.$inferSelect;

// Army Troops System - individual troops/units with full stats
export const troops = pgTable("troops", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  
  // Identity
  name: varchar("name").notNull(),
  troopType: varchar("troop_type").notNull(), // "infantry", "cavalry", "mage", "archer", "support", "siege"
  troopClass: varchar("troop_class").notNull(), // "warrior", "knight", "berserker", "paladin", "ranger", etc.
  
  // Hierarchy
  rank: varchar("rank").notNull().default("recruit"), // "recruit", "soldier", "veteran", "elite", "commander", "general"
  title: varchar("title"), // "Blade Master", "Dragon Slayer", etc.
  
  // Primary Stats
  health: integer("health").notNull().default(100),
  maxHealth: integer("max_health").notNull().default(100),
  attack: integer("attack").notNull().default(10),
  defense: integer("defense").notNull().default(5),
  speed: integer("speed").notNull().default(8),
  morale: integer("morale").notNull().default(100),
  
  // Sub Stats (JSON for flexibility)
  substats: jsonb("substats").notNull().default({
    critChance: 5,
    critDamage: 50,
    armor: 0,
    magicResist: 0,
    accuracy: 90,
    evasion: 10,
    regeneration: 0,
    lifesteal: 0,
    experience: 0,
    level: 1
  }),
  
  // Combat properties
  weaponType: varchar("weapon_type"), // "sword", "spear", "bow", "staff", "hammer"
  armorType: varchar("armor_type"), // "cloth", "leather", "mail", "plate", "mithril"
  specialAbility: varchar("special_ability"), // Special ability name
  
  // Squad assignment
  squadId: varchar("squad_id"), // Reference to squad grouping
  position: varchar("position"), // "front", "middle", "back"
  
  // Status
  status: varchar("status").notNull().default("active"), // "active", "wounded", "resting", "dead", "captured"
  combatReady: boolean("combat_ready").default(true),
  
  // Metadata
  loyaltyPercent: integer("loyalty_percent").default(100),
  experiencePoints: integer("experience_points").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type Troop = typeof troops.$inferSelect;
export const insertTroopSchema = createInsertSchema(troops).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertTroop = z.infer<typeof insertTroopSchema>;

// Army Squads - groups of troops
export const squads = pgTable("squads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  
  name: varchar("name").notNull(),
  squadType: varchar("squad_type").notNull(), // "strike", "defense", "balanced", "elite"
  commanderId: varchar("commander_id").references(() => troops.id),
  
  morale: integer("morale").default(100),
  combatExperience: integer("combat_experience").default(0),
  victoriesCount: integer("victories_count").default(0),
  
  createdAt: timestamp("created_at").defaultNow(),
});

export type Squad = typeof squads.$inferSelect;
export const insertSquadSchema = createInsertSchema(squads).omit({ id: true, createdAt: true });
export type InsertSquad = z.infer<typeof insertSquadSchema>;

// Active missions (fleet movements, attacks, espionage, etc.)
export const missions = pgTable("missions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  
  type: varchar("type").notNull(), // "attack", "transport", "espionage", "sabotage", "colonize"
  status: varchar("status").notNull().default("outbound"), // "outbound", "return", "completed"
  target: varchar("target").notNull(),
  origin: varchar("origin").notNull(),
  
  units: jsonb("units").notNull(), // Fleet composition
  cargo: jsonb("cargo"), // Resources being transported
  
  departureTime: timestamp("departure_time").notNull(),
  arrivalTime: timestamp("arrival_time").notNull(),
  returnTime: timestamp("return_time"),
  
  processed: boolean("processed").default(false),
  
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertMissionSchema = createInsertSchema(missions).omit({ id: true, createdAt: true });
export type InsertMission = z.infer<typeof insertMissionSchema>;
export type Mission = typeof missions.$inferSelect;

// Messages (player communications, battle reports, espionage reports)
export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  
  fromUserId: varchar("from_user_id").references(() => users.id, { onDelete: "cascade" }),
  toUserId: varchar("to_user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  
  from: varchar("from").notNull(), // Display name
  to: varchar("to").notNull(), // Display name
  subject: varchar("subject").notNull(),
  body: text("body").notNull(),
  
  type: varchar("type").notNull().default("player"), // "player", "combat", "espionage", "system"
  read: boolean("read").default(false),
  
  battleReport: jsonb("battle_report"),
  espionageReport: jsonb("espionage_report"),
  
  timestamp: timestamp("timestamp").defaultNow(),
});

export const insertMessageSchema = createInsertSchema(messages).omit({ id: true, timestamp: true });
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

// Alliances
export const alliances = pgTable("alliances", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull().unique(),
  tag: varchar("tag", { length: 10 }).notNull().unique(),
  description: text("description").notNull().default("A new alliance rises."),
  announcement: text("announcement").default("Welcome to the alliance."),
  
  resources: jsonb("resources").notNull().default({ metal: 0, crystal: 0, deuterium: 0 }),
  
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertAllianceSchema = createInsertSchema(alliances).omit({ id: true, createdAt: true });
export type InsertAlliance = z.infer<typeof insertAllianceSchema>;
export type Alliance = typeof alliances.$inferSelect;

// Alliance members
export const allianceMembers = pgTable("alliance_members", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  allianceId: varchar("alliance_id").notNull().references(() => alliances.id, { onDelete: "cascade" }),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  
  rank: varchar("rank").notNull().default("recruit"), // "leader", "officer", "member", "recruit"
  points: integer("points").notNull().default(0),
  
  joinedAt: timestamp("joined_at").defaultNow(),
});

export const insertAllianceMemberSchema = createInsertSchema(allianceMembers).omit({ id: true, joinedAt: true });
export type InsertAllianceMember = z.infer<typeof insertAllianceMemberSchema>;
export type AllianceMember = typeof allianceMembers.$inferSelect;

// Market orders
export const marketOrders = pgTable("market_orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  
  type: varchar("type").notNull(), // "buy" or "sell"
  resource: varchar("resource").notNull(), // "metal", "crystal", "deuterium"
  amount: integer("amount").notNull(),
  pricePerUnit: real("price_per_unit").notNull(),
  
  status: varchar("status").notNull().default("active"), // "active", "completed", "cancelled"
  
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const insertMarketOrderSchema = createInsertSchema(marketOrders).omit({ id: true, createdAt: true, completedAt: true });
export type InsertMarketOrder = z.infer<typeof insertMarketOrderSchema>;
export type MarketOrder = typeof marketOrders.$inferSelect;

// Auction House - Player-to-Player Trading
export const auctionListings = pgTable("auction_listings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sellerId: varchar("seller_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  sellerName: varchar("seller_name").notNull(),
  
  // Item details
  itemType: varchar("item_type").notNull(), // "equipment", "material", "resource", "blueprint", "artifact"
  itemId: varchar("item_id").notNull(),
  itemName: varchar("item_name").notNull(),
  itemDescription: text("item_description"),
  itemRarity: varchar("item_rarity").default("common"), // "common", "uncommon", "rare", "epic", "legendary"
  itemData: jsonb("item_data"), // Additional item properties (stats, modifiers, etc.)
  quantity: integer("quantity").notNull().default(1),
  
  // Pricing
  startingPrice: integer("starting_price").notNull(), // In credits/metal
  buyoutPrice: integer("buyout_price"), // Optional instant buy price
  currentBid: integer("current_bid").default(0),
  bidIncrement: integer("bid_increment").notNull().default(10), // Minimum bid increase
  
  // Bidder info
  currentBidderId: varchar("current_bidder_id").references(() => users.id, { onDelete: "set null" }),
  currentBidderName: varchar("current_bidder_name"),
  bidCount: integer("bid_count").notNull().default(0),
  
  // Timing
  duration: integer("duration").notNull().default(24), // Hours
  expiresAt: timestamp("expires_at").notNull(),
  
  // Status
  status: varchar("status").notNull().default("active"), // "active", "sold", "expired", "cancelled"
  
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const insertAuctionListingSchema = createInsertSchema(auctionListings).omit({ 
  id: true, 
  currentBid: true, 
  currentBidderId: true, 
  currentBidderName: true, 
  bidCount: true, 
  status: true, 
  createdAt: true, 
  completedAt: true 
});
export type InsertAuctionListing = z.infer<typeof insertAuctionListingSchema>;
export type AuctionListing = typeof auctionListings.$inferSelect;

// Auction bid history
export const auctionBids = pgTable("auction_bids", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  auctionId: varchar("auction_id").notNull().references(() => auctionListings.id, { onDelete: "cascade" }),
  bidderId: varchar("bidder_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  bidderName: varchar("bidder_name").notNull(),
  
  bidAmount: integer("bid_amount").notNull(),
  
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertAuctionBidSchema = createInsertSchema(auctionBids).omit({ id: true, createdAt: true });
export type InsertAuctionBid = z.infer<typeof insertAuctionBidSchema>;
export type AuctionBid = typeof auctionBids.$inferSelect;

// Player-to-Player Trade Offers (Mail Integrated)
export const tradeOffers = pgTable("trade_offers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  
  // Participants
  senderId: varchar("sender_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  senderName: varchar("sender_name").notNull(),
  receiverId: varchar("receiver_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  receiverName: varchar("receiver_name").notNull(),
  
  // What sender offers
  offerMetal: integer("offer_metal").notNull().default(0),
  offerCrystal: integer("offer_crystal").notNull().default(0),
  offerDeuterium: integer("offer_deuterium").notNull().default(0),
  offerItems: jsonb("offer_items").default([]), // Array of item objects
  
  // What sender requests
  requestMetal: integer("request_metal").notNull().default(0),
  requestCrystal: integer("request_crystal").notNull().default(0),
  requestDeuterium: integer("request_deuterium").notNull().default(0),
  requestItems: jsonb("request_items").default([]), // Array of item objects
  
  // Message
  message: text("message"),
  
  // Status
  status: varchar("status").notNull().default("pending"), // "pending", "accepted", "declined", "cancelled", "expired", "countered"
  
  // Associated message IDs for mail integration
  senderMessageId: varchar("sender_message_id"),
  receiverMessageId: varchar("receiver_message_id"),
  
  // Counter offer reference
  counterOfferId: varchar("counter_offer_id"),
  originalOfferId: varchar("original_offer_id"),
  
  // Expiration
  expiresAt: timestamp("expires_at"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const insertTradeOfferSchema = createInsertSchema(tradeOffers).omit({ 
  id: true, 
  status: true, 
  senderMessageId: true,
  receiverMessageId: true,
  createdAt: true, 
  updatedAt: true, 
  completedAt: true 
});
export type InsertTradeOffer = z.infer<typeof insertTradeOfferSchema>;
export type TradeOffer = typeof tradeOffers.$inferSelect;

// Trade history log
export const tradeHistory = pgTable("trade_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tradeOfferId: varchar("trade_offer_id").notNull(),
  
  // Participants
  senderId: varchar("sender_id").notNull(),
  senderName: varchar("sender_name").notNull(),
  receiverId: varchar("receiver_id").notNull(),
  receiverName: varchar("receiver_name").notNull(),
  
  // What was traded
  senderGave: jsonb("sender_gave").notNull(), // { metal, crystal, deuterium, items }
  receiverGave: jsonb("receiver_gave").notNull(),
  
  // Result
  result: varchar("result").notNull(), // "completed", "cancelled", "expired"
  
  completedAt: timestamp("completed_at").defaultNow(),
});

export type TradeHistory = typeof tradeHistory.$inferSelect;

// Construction/Research Queue
export const queueItems = pgTable("queue_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  
  type: varchar("type").notNull(), // "building", "research", "unit"
  itemId: varchar("item_id").notNull(), // ID of the building/tech/unit
  itemName: varchar("item_name").notNull(),
  amount: integer("amount"), // For units
  
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertQueueItemSchema = createInsertSchema(queueItems).omit({ id: true, createdAt: true });
export type InsertQueueItem = z.infer<typeof insertQueueItemSchema>;
export type QueueItem = typeof queueItems.$inferSelect;

// Battle/Combat records
export const battles = pgTable("battles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  attackerId: varchar("attacker_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  defenderId: varchar("defender_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  
  type: varchar("type").notNull(), // "raid", "attack", "spy", "sabotage"
  status: varchar("status").notNull().default("completed"), // "pending", "completed", "failed"
  
  attackerCoordinates: varchar("attacker_coordinates").notNull(),
  defenderCoordinates: varchar("defender_coordinates").notNull(),
  
  winner: varchar("winner"), // "attacker", "defender", "draw", "spy_success", "spy_failed"
  
  attackerFleet: jsonb("attacker_fleet").notNull(),
  defenderFleet: jsonb("defender_fleet").notNull(),
  
  attackerLosses: jsonb("attacker_losses"), // { unitId: count }
  defenderLosses: jsonb("defender_losses"),
  
  loot: jsonb("loot"), // { metal, crystal, deuterium }
  debris: jsonb("debris"), // { metal, crystal }
  
  rounds: integer("rounds").default(0),
  
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const insertBattleSchema = createInsertSchema(battles).omit({ id: true, createdAt: true, completedAt: true });
export type InsertBattle = z.infer<typeof insertBattleSchema>;
export type Battle = typeof battles.$inferSelect;

// Battle logs
export const battleLogs = pgTable("battle_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  battleId: varchar("battle_id").notNull().references(() => battles.id, { onDelete: "cascade" }),
  
  round: integer("round").notNull(),
  
  attackerDamageDealt: integer("attacker_damage_dealt").default(0),
  defenderDamageDealt: integer("defender_damage_dealt").default(0),
  
  unitsDestroyed: jsonb("units_destroyed"),
  
  log: text("log"),
  
  timestamp: timestamp("timestamp").defaultNow(),
});

export const insertBattleLogSchema = createInsertSchema(battleLogs).omit({ id: true, timestamp: true });
export type InsertBattleLog = z.infer<typeof insertBattleLogSchema>;
export type BattleLog = typeof battleLogs.$inferSelect;

// Durability System
export const equipmentDurability = pgTable("equipment_durability", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  playerId: varchar("player_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  equipmentId: varchar("equipment_id").notNull(),
  equipmentType: varchar("equipment_type").notNull(),
  currentDurability: real("current_durability").notNull().default(100),
  maxDurability: real("max_durability").notNull().default(100),
  durabilityPercent: integer("durability_percent").default(100),
  degradationRate: real("degradation_rate").default(0.5),
  isBroken: boolean("is_broken").default(false),
  repairCostGold: real("repair_cost_gold").default(0),
  repairCostPlatinum: real("repair_cost_platinum").default(0),
  repairCostResources: jsonb("repair_cost_resources"),
  lastRepairedAt: timestamp("last_repaired_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type EquipmentDurability = typeof equipmentDurability.$inferSelect;

export const fleetDurability = pgTable("fleet_durability", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  playerId: varchar("player_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  fleetId: varchar("fleet_id").notNull(),
  shipType: varchar("ship_type").notNull(),
  shipCount: integer("ship_count").notNull(),
  currentDurability: real("current_durability").notNull().default(100),
  maxDurability: real("max_durability").notNull().default(100),
  durabilityPercent: integer("durability_percent").default(100),
  healthStatus: varchar("health_status").default("optimal"),
  battleDamage: real("battle_damage").default(0),
  lastRepairedAt: timestamp("last_repaired_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type FleetDurability = typeof fleetDurability.$inferSelect;

export const buildingDurability = pgTable("building_durability", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  playerId: varchar("player_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  buildingId: varchar("building_id").notNull(),
  buildingType: varchar("building_type").notNull(),
  buildingLevel: integer("building_level").notNull(),
  currentDurability: real("current_durability").notNull().default(100),
  maxDurability: real("max_durability").notNull().default(100),
  durabilityPercent: integer("durability_percent").default(100),
  structuralIntegrity: varchar("structural_integrity").default("intact"),
  damageFromAttack: real("damage_from_attack").default(0),
  lastRepairedAt: timestamp("last_repaired_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type BuildingDurability = typeof buildingDurability.$inferSelect;

export const repairHistory = pgTable("repair_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  playerId: varchar("player_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  itemType: varchar("item_type").notNull(),
  itemId: varchar("item_id").notNull(),
  durabilityBefore: real("durability_before").notNull(),
  durabilityAfter: real("durability_after").notNull(),
  repairCostGold: real("repair_cost_gold").default(0),
  repairCostPlatinum: real("repair_cost_platinum").default(0),
  repairType: varchar("repair_type").notNull(),
  repairedAt: timestamp("repaired_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export type RepairHistory = typeof repairHistory.$inferSelect;

export const durabilityDegradationLog = pgTable("durability_degradation_log", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  playerId: varchar("player_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  itemType: varchar("item_type").notNull(),
  itemId: varchar("item_id").notNull(),
  degradationAmount: real("degradation_amount").notNull(),
  degradationSource: varchar("degradation_source").notNull(),
  durabilityBefore: real("durability_before").notNull(),
  durabilityAfter: real("durability_after").notNull(),
  loggedAt: timestamp("logged_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export type DurabilityDegradationLog = typeof durabilityDegradationLog.$inferSelect;

// Research areas and technologies
export const researchAreas = pgTable("research_areas", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  areaName: varchar("area_name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type ResearchArea = typeof researchAreas.$inferSelect;

export const researchSubcategories = pgTable("research_subcategories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  areaId: varchar("area_id").notNull().references(() => researchAreas.id),
  subcategoryName: varchar("subcategory_name").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export type ResearchSubcategory = typeof researchSubcategories.$inferSelect;

export const researchTechnologies = pgTable("research_technologies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  subcategoryId: varchar("subcategory_id").notNull().references(() => researchSubcategories.id),
  techName: varchar("tech_name").notNull(),
  description: text("description"),
  requirements: jsonb("requirements"),
  effects: jsonb("effects"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type ResearchTechnology = typeof researchTechnologies.$inferSelect;

export const playerResearchProgress = pgTable("player_research_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  technologyId: varchar("technology_id").notNull().references(() => researchTechnologies.id),
  status: varchar("status").notNull().default("available"),
  progress: integer("progress").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type PlayerResearchProgress = typeof playerResearchProgress.$inferSelect;

// Expeditions
export const expeditions = pgTable("expeditions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name").notNull(),
  type: varchar("type").notNull(),
  targetCoords: varchar("target_coords").notNull(),
  status: varchar("status").notNull().default("active"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type Expedition = typeof expeditions.$inferSelect;

export const expeditionTeams = pgTable("expedition_teams", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  expeditionId: varchar("expedition_id").notNull().references(() => expeditions.id),
  unitId: varchar("unit_id").notNull(),
  role: varchar("role").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export type ExpeditionTeam = typeof expeditionTeams.$inferSelect;

export const expeditionEncounters = pgTable("expedition_encounters", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  expeditionId: varchar("expedition_id").notNull().references(() => expeditions.id),
  encounterType: varchar("encounter_type").notNull(),
  description: text("description"),
  rewards: jsonb("rewards"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type ExpeditionEncounter = typeof expeditionEncounters.$inferSelect;

// Admin Users
export const adminUsers = pgTable("admin_users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().unique().references(() => users.id, { onDelete: "cascade" }),
  role: varchar("role").notNull().default("moderator"),
  permissions: jsonb("permissions").notNull().default([]),
  createdAt: timestamp("created_at").defaultNow(),
});

export type AdminUser = typeof adminUsers.$inferSelect;

// Geography/Worldbuilding tables
export const continents = pgTable("continents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  continentName: varchar("continent_name").notNull(),
  areaSqkm: real("area_sqkm"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type Continent = typeof continents.$inferSelect;

export const countries = pgTable("countries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  continentId: varchar("continent_id").notNull().references(() => continents.id, { onDelete: "cascade" }),
  countryName: varchar("country_name").notNull(),
  countryType: varchar("country_type").notNull(),
  ownerPlayerId: varchar("owner_player_id").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").defaultNow(),
});

export type Country = typeof countries.$inferSelect;

export const territories = pgTable("territories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  countryId: varchar("country_id").notNull().references(() => countries.id, { onDelete: "cascade" }),
  territoryName: varchar("territory_name").notNull(),
  territoryType: varchar("territory_type").notNull(),
  areaSqkm: real("area_sqkm"),
  controlledByPlayerId: varchar("controlled_by_player_id").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").defaultNow(),
});

export type Territory = typeof territories.$inferSelect;

export const resourceFields = pgTable("resource_fields", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  territoryId: varchar("territory_id").notNull().references(() => territories.id, { onDelete: "cascade" }),
  fieldName: varchar("field_name").notNull(),
  fieldType: varchar("field_type").notNull(),
  fieldSize: varchar("field_size").notNull(),
  metalPerHour: real("metal_per_hour").default(0),
  crystalPerHour: real("crystal_per_hour").default(0),
  deuteriumPerHour: real("deuterium_per_hour").default(0),
  maxExtractionCapacity: integer("max_extraction_capacity").default(100),
  depletionPercent: integer("depletion_percent").default(0),
  isDepleted: boolean("is_depleted").default(false),
  minedByPlayerId: varchar("mined_by_player_id").references(() => users.id, { onDelete: "set null" }),
  totalMetalExtracted: real("total_metal_extracted").default(0),
  totalCrystalExtracted: real("total_crystal_extracted").default(0),
  totalDeuteriumExtracted: real("total_deuterium_extracted").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export type ResourceField = typeof resourceFields.$inferSelect;

export const playerColonies = pgTable("player_colonies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  playerId: varchar("player_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  planetId: integer("planet_id").notNull(),
  colonyName: varchar("colony_name").notNull(),
  colonyType: varchar("colony_type").notNull(),
  colonyLevel: integer("colony_level").default(1),
  population: integer("population").default(1000),
  builtAt: timestamp("built_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export type PlayerColony = typeof playerColonies.$inferSelect;

// Starbases - orbital stations for resource gathering and fleet operations
export const starbases = pgTable("starbases", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  playerId: varchar("player_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  starbaseType: varchar("starbase_type").notNull(), // "mining", "refining", "shipyard", "research", "trade"
  name: varchar("name").notNull(),
  level: integer("level").notNull().default(1),
  coordinates: varchar("coordinates").notNull(),
  
  // Resources
  metalStorage: integer("metal_storage").default(10000),
  crystalStorage: integer("crystal_storage").default(10000),
  deuteriumStorage: integer("deuterium_storage").default(5000),
  
  // Production rates (per hour)
  metalProductionRate: real("metal_production_rate").default(100),
  crystalProductionRate: real("crystal_production_rate").default(50),
  deuteriumProductionRate: real("deuterium_production_rate").default(25),
  
  // Fleet operations
  hangarSlots: integer("hangar_slots").default(50),
  researchSlots: integer("research_slots").default(5),
  defenseLevel: integer("defense_level").default(1),
  
  // Status
  isActive: boolean("is_active").default(true),
  lastResourceUpdate: timestamp("last_resource_update").defaultNow(),
  builtAt: timestamp("built_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type Starbase = typeof starbases.$inferSelect;
export const insertStarbaseSchema = createInsertSchema(starbases).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertStarbase = z.infer<typeof insertStarbaseSchema>;

// Moon Bases - lunar settlements for mining and advanced operations
export const moonBases = pgTable("moon_bases", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  playerId: varchar("player_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  baseType: varchar("base_type").notNull(), // "mining", "research", "military", "industrial"
  name: varchar("name").notNull(),
  level: integer("level").notNull().default(1),
  coordinates: varchar("coordinates").notNull(),
  moonName: varchar("moon_name").notNull(),
  
  // Resources
  metalReserves: integer("metal_reserves").default(5000),
  crystalReserves: integer("crystal_reserves").default(3000),
  deuteriumReserves: integer("deuterium_reserves").default(1000),
  
  // Mining operations
  miningCapacity: integer("mining_capacity").default(1000),
  activeMiningOps: integer("active_mining_ops").default(0),
  totalMined: integer("total_mined").default(0),
  
  // Scientific research
  researchPoints: real("research_points").default(0),
  researchMultiplier: real("research_multiplier").default(1.0),
  
  // Population and workforce
  population: integer("population").default(500),
  workers: integer("workers").default(100),
  
  // Defense
  shieldLevel: integer("shield_level").default(0),
  turrets: integer("turrets").default(0),
  
  // Status
  isActive: boolean("is_active").default(true),
  discoveredAt: timestamp("discovered_at").defaultNow(),
  builtAt: timestamp("built_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type MoonBase = typeof moonBases.$inferSelect;
export const insertMoonBaseSchema = createInsertSchema(moonBases).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertMoonBase = z.infer<typeof insertMoonBaseSchema>;

// Player Profiles - account info with UID
export const playerProfiles = pgTable("player_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().unique().references(() => users.id, { onDelete: "cascade" }),
  uid: varchar("uid").notNull().unique(), // Unique account identifier
  
  // Profile info
  displayName: varchar("display_name").notNull(),
  bio: text("bio"),
  profileImageUrl: varchar("profile_image_url"),
  
  // Game progression
  level: integer("level").default(1),
  totalExperience: integer("total_experience").default(0),
  prestigeLevel: integer("prestige_level").default(0),
  
  // Rankings & Stats
  galaxyRank: integer("galaxy_rank"),
  fleetPower: integer("fleet_power").default(0),
  empirePower: integer("empire_power").default(0),
  
  // Attributes
  attributes: jsonb("attributes").notNull().default({
    strength: 10,
    intelligence: 10,
    endurance: 10,
    agility: 10,
    wisdom: 10,
    charisma: 10
  }),
  
  // Sub-attributes
  subAttributes: jsonb("sub_attributes").notNull().default({
    critChance: 5,
    critDamage: 50,
    dodge: 10,
    accuracy: 90,
    magicResist: 0,
    lifeSteal: 0
  }),
  
  // Categories & progression
  categories: jsonb("categories").notNull().default({
    military: 1,
    engineering: 1,
    science: 1,
    commerce: 1,
    diplomacy: 1,
    exploration: 1
  }),
  
  // Badges & achievements
  badges: jsonb("badges").notNull().default([]),
  achievements: jsonb("achievements").notNull().default([]),
  
  // Status
  isOnline: boolean("is_online").default(false),
  lastActivityAt: timestamp("last_activity_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type PlayerProfile = typeof playerProfiles.$inferSelect;
export const insertPlayerProfileSchema = createInsertSchema(playerProfiles).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertPlayerProfile = z.infer<typeof insertPlayerProfileSchema>;

// Mega Structures - massive end-game constructs
export const megaStructures = pgTable("mega_structures", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  playerId: varchar("player_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  profileId: varchar("profile_id").references(() => playerProfiles.id, { onDelete: "cascade" }),
  
  // Identity & Classification
  name: varchar("name").notNull(),
  structureType: varchar("structure_type").notNull(), // "dyson_sphere", "ring_world", "matrioshka_brain", "megastructure_fleet", "stellar_engine"
  structureClass: varchar("structure_class").notNull(), // "omega", "alpha", "beta", "gamma", "delta"
  kind: varchar("kind").notNull(), // "weapon", "habitation", "research", "industrial", "defense"
  category: varchar("category").notNull(), // "megastructure", "orbital", "interstellar"
  subCategory: varchar("sub_category"), // "partial", "full", "experimental"
  
  // Progression & Status
  level: integer("level").notNull().default(1),
  completionPercent: integer("completion_percent").default(0),
  isOperational: boolean("is_operational").default(false),
  
  // Location
  coordinates: varchar("coordinates").notNull(),
  galaxyId: integer("galaxy_id"),
  
  // Core Stats
  health: integer("health").default(1000000),
  maxHealth: integer("max_health").default(1000000),
  power: integer("power").default(100000),
  efficiency: real("efficiency").default(1.0),
  
  // Sub-stats (JSON for flexibility)
  substats: jsonb("substats").notNull().default({
    productionRate: 1000,
    researchMultiplier: 2.0,
    defenseMultiplier: 1.5,
    capacityMultiplier: 3.0,
    efficiencyRating: 95
  }),
  
  // Attributes
  attributes: jsonb("attributes").notNull().default({
    durability: 100,
    reliability: 95,
    adaptability: 80,
    scalability: 90,
    sustainability: 85
  }),
  
  // Sub-attributes
  subAttributes: jsonb("sub_attributes").notNull().default({
    maintenanceCost: 10000,
    powerConsumption: 50000,
    productionCapacity: 500000,
    storageCapacity: 1000000,
    repairRate: 5000
  }),
  
  // Resource Production & Storage
  resourceProduction: jsonb("resource_production").notNull().default({
    metal: 50000,
    crystal: 25000,
    deuterium: 10000,
    energy: 100000
  }),
  
  resourceStorage: jsonb("resource_storage").notNull().default({
    metal: 5000000,
    crystal: 2500000,
    deuterium: 1000000,
    energy: 10000000
  }),
  
  currentResources: jsonb("current_resources").notNull().default({
    metal: 1000000,
    crystal: 500000,
    deuterium: 250000,
    energy: 5000000
  }),
  
  // Modules & Systems (JSON for flexibility)
  modules: jsonb("modules").notNull().default([]),
  systems: jsonb("systems").notNull().default([]),
  weapons: jsonb("weapons").notNull().default([]),
  defenses: jsonb("defenses").notNull().default([]),
  
  // Details & Information
  description: text("description"),
  about: text("about"),
  details: jsonb("details").notNull().default({
    constructionTime: 0,
    estimatedCompletion: null,
    workforce: 10000,
    researchTeams: 100
  }),
  
  // Menus & Sub-menus (Navigation/management structure)
  menus: jsonb("menus").notNull().default({
    construction: { status: "planning", progress: 0 },
    production: { enabled: false, rates: {} },
    research: { projects: [], completed: [] },
    defense: { shields: true, weapons: true },
    management: { staffing: 100, efficiency: 95 }
  }),
  
  // Game Mechanics
  gameMechanics: jsonb("game_mechanics").notNull().default({
    captureable: false,
    destroyable: true,
    transferable: false,
    scalable: true,
    networked: false,
    effects: []
  }),
  
  // Crew & Population
  population: integer("population").default(100000),
  scientists: integer("scientists").default(1000),
  engineers: integer("engineers").default(5000),
  workers: integer("workers").default(50000),
  soldiers: integer("soldiers").default(20000),
  
  // Combat Stats
  attack: integer("attack").default(10000),
  defense: integer("defense").default(5000),
  damageOutput: real("damage_output").default(15000),
  
  // Metadata
  constructedAt: timestamp("constructed_at"),
  lastOperationalAt: timestamp("last_operational_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type MegaStructure = typeof megaStructures.$inferSelect;
export const insertMegaStructureSchema = createInsertSchema(megaStructures).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertMegaStructure = z.infer<typeof insertMegaStructureSchema>;

// Empire Difficulty - progression system linked to Kardashev scale
export const empireDifficulties = pgTable("empire_difficulties", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  playerId: varchar("player_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  profileId: varchar("profile_id").references(() => playerProfiles.id, { onDelete: "cascade" }),
  
  // Difficulty level (0-5: Peaceful to Impossible)
  difficultyLevel: integer("difficulty_level").notNull().default(2), // 0=Peaceful, 2=Normal, 5=Impossible
  
  // Kardashev scale link
  kardashevLevel: integer("kardashev_level").notNull().default(1),
  kardashevProgress: integer("kardashev_progress").default(0), // 0-100%
  
  // Resource multipliers based on difficulty
  resourceMultiplier: real("resource_multiplier").default(1.0),
  researchMultiplier: real("research_multiplier").default(1.0),
  combatMultiplier: real("combat_multiplier").default(1.0),
  
  // Scaling factors
  scalingFactor: real("scaling_factor").default(1.0),
  difficultyMultiplier: real("difficulty_multiplier").default(1.0),
  
  // Stats & progression
  totalPower: integer("total_power").default(0),
  empirePower: integer("empire_power").default(0),
  galaxyPosition: integer("galaxy_position"),
  
  // Mechanics
  npcDifficulty: varchar("npc_difficulty").default("normal"), // npc difficulty scaling
  enemyStrength: real("enemy_strength").default(1.0),
  resourceScarcity: real("resource_scarcity").default(1.0), // 1.0 = normal, >1.0 = scarce
  
  // Achievements based on difficulty
  achievementsUnlocked: jsonb("achievements_unlocked").notNull().default([]),
  bonusesApplied: jsonb("bonuses_applied").notNull().default([]),
  
  // Challenge information
  challengeDescription: text("challenge_description"),
  challengeRequirements: jsonb("challenge_requirements").notNull().default({}),
  rewardsForCompletion: jsonb("rewards_for_completion").notNull().default({}),
  
  // Status
  isActive: boolean("is_active").default(true),
  startedAt: timestamp("started_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export type EmpireDifficulty = typeof empireDifficulties.$inferSelect;
export const insertEmpireDifficultySchema = createInsertSchema(empireDifficulties).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertEmpireDifficulty = z.infer<typeof insertEmpireDifficultySchema>;

// System Settings table for game configuration
export const systemSettings = pgTable("system_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  key: varchar("key").unique().notNull(),
  value: jsonb("value").notNull(),
  description: text("description"),
  category: varchar("category").default("general"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertSystemSettingsSchema = createInsertSchema(systemSettings).omit({ id: true, updatedAt: true });
export type InsertSystemSettings = z.infer<typeof insertSystemSettingsSchema>;
export type SystemSettings = typeof systemSettings.$inferSelect;

// Story Mode - Campaign and Mission progression
export const storyCampaigns = pgTable("story_campaigns", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  playerId: varchar("player_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  
  // Campaign tracking
  currentAct: integer("current_act").default(1),
  currentChapter: integer("current_chapter").default(1),
  completedActs: integer("completed_acts").default(0),
  isCompleted: boolean("is_completed").default(false),
  
  // Progress
  storyProgress: real("story_progress").default(0), // 0-100%
  totalXpEarned: integer("total_xp_earned").default(0),
  
  // Campaign state
  campaignState: jsonb("campaign_state").notNull().default({}),
  npcsEncountered: jsonb("npcs_encountered").notNull().default([]),
  completedMissions: jsonb("completed_missions").notNull().default([]),
  
  // Timestamps
  startedAt: timestamp("started_at").defaultNow(),
  lastPlayedAt: timestamp("last_played_at").defaultNow(),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type StoryCampaign = typeof storyCampaigns.$inferSelect;
export const insertStoryCampaignSchema = createInsertSchema(storyCampaigns).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertStoryCampaign = z.infer<typeof insertStoryCampaignSchema>;

// Story Missions - Individual missions within chapters
export const storyMissions = pgTable("story_missions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  playerId: varchar("player_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  campaignId: varchar("campaign_id").references(() => storyCampaigns.id, { onDelete: "cascade" }),
  
  // Mission classification
  act: integer("act").notNull(),
  chapter: integer("chapter").notNull(),
  missionType: varchar("mission_type").notNull(), // "main", "side", "optional"
  
  // Mission details
  title: varchar("title").notNull(),
  description: text("description"),
  lore: text("lore"),
  difficulty: integer("difficulty").default(1),
  
  // NPC involved
  npcName: varchar("npc_name"),
  npcRole: varchar("npc_role"),
  npcTrait: varchar("npc_trait"),
  
  // Objectives
  objectives: jsonb("objectives").notNull().default([]),
  
  // Rewards
  rewardXp: integer("reward_xp").default(0),
  rewardMetal: integer("reward_metal").default(0),
  rewardCrystal: integer("reward_crystal").default(0),
  rewardDeuterium: integer("reward_deuterium").default(0),
  rewardBadge: varchar("reward_badge"),
  rewardItems: jsonb("reward_items").notNull().default([]),
  
  // Status
  isCompleted: boolean("is_completed").default(false),
  isActive: boolean("is_active").default(true),
  completedAt: timestamp("completed_at"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type StoryMission = typeof storyMissions.$inferSelect;
export const insertStoryMissionSchema = createInsertSchema(storyMissions).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertStoryMission = z.infer<typeof insertStoryMissionSchema>;

// Achievements - Player achievement tracking
export const achievements = pgTable("achievements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  playerId: varchar("player_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  
  // Achievement details
  achievementId: varchar("achievement_id").notNull(),
  name: varchar("name").notNull(),
  description: text("description"),
  category: varchar("category").notNull(), // "story", "combat", "economic", "exploration"
  
  // Progress
  progress: integer("progress").default(0),
  target: integer("target").default(1),
  isCompleted: boolean("is_completed").default(false),
  
  // Rewards
  rewardXp: integer("reward_xp").default(0),
  rewardBadge: varchar("reward_badge"),
  
  // Status
  unlockedAt: timestamp("unlocked_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type Achievement = typeof achievements.$inferSelect;
export const insertAchievementSchema = createInsertSchema(achievements).omit({ id: true, createdAt: true });
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;

// Element Buffs/Debuffs - Combat element system
export const elementBuffs = pgTable("element_buffs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  playerId: varchar("player_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  missionId: varchar("mission_id").references(() => storyMissions.id, { onDelete: "cascade" }),
  
  // Element info
  elementType: varchar("element_type").notNull(), // fire, water, lightning, earth, ice, shadow, light
  buffType: varchar("buff_type").notNull(), // "damage", "defense", "speed", "healing"
  magnitude: real("magnitude").default(1.0),
  
  // Status
  isActive: boolean("is_active").default(true),
  activatedAt: timestamp("activated_at").defaultNow(),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type ElementBuff = typeof elementBuffs.$inferSelect;
export const insertElementBuffSchema = createInsertSchema(elementBuffs).omit({ id: true, createdAt: true });
export type InsertElementBuff = z.infer<typeof insertElementBuffSchema>;

// NPC Factions - Player reputation with factions
export const npcFactions = pgTable("npc_factions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  playerId: varchar("player_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  
  // Faction info
  factionId: varchar("faction_id").notNull(),
  factionName: varchar("faction_name").notNull(),
  
  // Reputation tracking
  reputation: integer("reputation").default(0), // -1000 to 1000
  standing: varchar("standing").default("neutral"), // "hostile", "unfriendly", "neutral", "friendly", "honored", "exalted"
  
  // Status
  isUnlocked: boolean("is_unlocked").default(false),
  lastInteraction: timestamp("last_interaction"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type NPCFaction = typeof npcFactions.$inferSelect;
export const insertNPCFactionSchema = createInsertSchema(npcFactions).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertNPCFaction = z.infer<typeof insertNPCFactionSchema>;

// NPC Vendors - Merchant NPCs selling items
export const npcVendors = pgTable("npc_vendors", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  
  // Vendor info
  vendorId: varchar("vendor_id").notNull(),
  vendorName: varchar("vendor_name").notNull(),
  factionId: varchar("faction_id").notNull(),
  location: varchar("location").notNull(),
  specialty: varchar("specialty"),
  
  // Requirements
  minReputation: integer("min_reputation").default(0),
  restockTime: integer("restock_time").default(86400), // seconds (24 hours)
  lastRestock: timestamp("last_restock").defaultNow(),
  
  // Inventory
  inventory: jsonb("inventory").notNull().default([]), // Array of item IDs
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type NPCVendor = typeof npcVendors.$inferSelect;
export const insertNPCVendorSchema = createInsertSchema(npcVendors).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertNPCVendor = z.infer<typeof insertNPCVendorSchema>;

// Relics - Powerful artifacts with special abilities
export const relics = pgTable("relics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  playerId: varchar("player_id").references(() => users.id, { onDelete: "cascade" }),
  
  // Relic classification
  relicId: varchar("relic_id").notNull(),
  name: varchar("name").notNull(),
  rarity: varchar("rarity").notNull(), // common, rare, epic, legendary, mythic
  
  // Details
  description: text("description"),
  type: varchar("type").notNull(), // navigation, knowledge, power, magic, blueprint, weapon, technology
  bonuses: jsonb("bonuses").notNull().default({}),
  
  // Source and trading
  source: varchar("source"), // Which faction/vendor sells it
  price: integer("price").default(0),
  
  // Possession
  isOwned: boolean("is_owned").default(false),
  acquiredAt: timestamp("acquired_at"),
  
  createdAt: timestamp("created_at").defaultNow(),
});

export type Relic = typeof relics.$inferSelect;
export const insertRelicSchema = createInsertSchema(relics).omit({ id: true, createdAt: true });
export type InsertRelic = z.infer<typeof insertRelicSchema>;

// Relic Inventory - Player relic collection
export const relicInventory = pgTable("relic_inventory", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  playerId: varchar("player_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  relicId: varchar("relic_id").notNull().references(() => relics.id, { onDelete: "cascade" }),
  
  // Status
  isEquipped: boolean("is_equipped").default(false),
  slot: varchar("slot"), // equipment slot
  
  // Durability and condition
  condition: integer("condition").default(100), // 0-100%
  uses: integer("uses").default(0),
  
  acquiredAt: timestamp("acquired_at").defaultNow(),
});

export type RelicInventory = typeof relicInventory.$inferSelect;
export const insertRelicInventorySchema = createInsertSchema(relicInventory).omit({ id: true, acquiredAt: true });
export type InsertRelicInventory = z.infer<typeof insertRelicInventorySchema>;

// Friends List - Social system (50 max per player)
export const friends = pgTable("friends", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  playerId: varchar("player_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  friendId: varchar("friend_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  
  // Relationship details
  friendshipStatus: varchar("friendship_status").notNull().default("pending"), // "pending", "accepted", "blocked"
  nickname: varchar("nickname"), // Custom name for friend
  notes: text("notes"), // Personal notes about friend
  
  // Interaction tracking
  isOnline: boolean("is_online").default(false),
  lastSeen: timestamp("last_seen"),
  isFavorite: boolean("is_favorite").default(false),
  
  // Timestamps
  addedAt: timestamp("added_at").defaultNow(),
  acceptedAt: timestamp("accepted_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type Friend = typeof friends.$inferSelect;
export const insertFriendSchema = createInsertSchema(friends).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertFriend = z.infer<typeof insertFriendSchema>;

// Friend Requests - Pending friend requests
export const friendRequests = pgTable("friend_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  senderId: varchar("sender_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  receiverId: varchar("receiver_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  
  // Request details
  message: text("message"), // Optional message with request
  status: varchar("status").notNull().default("pending"), // "pending", "accepted", "rejected", "expired"
  
  // Timestamps
  sentAt: timestamp("sent_at").defaultNow(),
  respondedAt: timestamp("responded_at"),
  expiresAt: timestamp("expires_at"), // Default 30 days
  createdAt: timestamp("created_at").defaultNow(),
});

export type FriendRequest = typeof friendRequests.$inferSelect;
export const insertFriendRequestSchema = createInsertSchema(friendRequests).omit({ id: true, createdAt: true });
export type InsertFriendRequest = z.infer<typeof insertFriendRequestSchema>;

// Guilds - Player organizations (enhanced alliances)
export const guilds = pgTable("guilds", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  
  // Guild info
  name: varchar("name").notNull(),
  description: text("description"),
  emblem: varchar("emblem"), // URL to guild emblem
  
  // Leadership
  leaderId: varchar("leader_id").notNull().references(() => users.id),
  coLeaders: jsonb("co_leaders").notNull().default([]),
  
  // Stats
  level: integer("level").default(1),
  totalMembers: integer("total_members").default(1),
  treasury: integer("treasury").default(0), // Shared currency
  influence: integer("influence").default(0), // Political power
  
  // Settings
  maxMembers: integer("max_members").default(100),
  joinRequirementLevel: integer("join_requirement_level").default(1),
  isRecruiting: boolean("is_recruiting").default(true),
  
  // Permissions and roles
  roles: jsonb("roles").notNull().default([]), // Custom guild roles
  permissions: jsonb("permissions").notNull().default({}),
  
  // Timestamps
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type Guild = typeof guilds.$inferSelect;
export const insertGuildSchema = createInsertSchema(guilds).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertGuild = z.infer<typeof insertGuildSchema>;

// Guild Members - Player membership in guilds
export const guildMembers = pgTable("guild_members", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  guildId: varchar("guild_id").notNull().references(() => guilds.id, { onDelete: "cascade" }),
  playerId: varchar("player_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  
  // Role and status
  role: varchar("role").notNull().default("member"), // leader, officer, member
  joinedAt: timestamp("joined_at").defaultNow(),
  
  // Contributions
  contributedCurrency: integer("contributed_currency").default(0),
  contributedResearch: integer("contributed_research").default(0),
});

export type GuildMember = typeof guildMembers.$inferSelect;
export const insertGuildMemberSchema = createInsertSchema(guildMembers).omit({ id: true, joinedAt: true });
export type InsertGuildMember = z.infer<typeof insertGuildMemberSchema>;

// Teams - Squad of 6 players for raids
export const teams = pgTable("teams", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  guildId: varchar("guild_id").references(() => guilds.id, { onDelete: "cascade" }),
  
  // Team info
  name: varchar("name").notNull(),
  description: text("description"),
  leaderId: varchar("leader_id").notNull().references(() => users.id),
  
  // Members (6 max)
  members: jsonb("members").notNull().default([]), // Array of player IDs
  maxMembers: integer("max_members").default(6),
  
  // Stats
  totalRaids: integer("total_raids").default(0),
  winsCount: integer("wins_count").default(0),
  level: integer("level").default(1),
  
  // Settings
  isLocked: boolean("is_locked").default(false),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type Team = typeof teams.$inferSelect;
export const insertTeamSchema = createInsertSchema(teams).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertTeam = z.infer<typeof insertTeamSchema>;

// Raids - Guild vs Guild or Team vs Team combat encounters
export const raids = pgTable("raids", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  
  // Participants
  attackingTeamId: varchar("attacking_team_id").notNull().references(() => teams.id),
  defendingTeamId: varchar("defending_team_id").notNull().references(() => teams.id),
  
  // Raid details
  raidType: varchar("raid_type").notNull(), // "guild_war", "pvp_team", "boss_raid", "stronghold_attack"
  objectiveId: varchar("objective_id"), // Optional: resource to steal, stronghold to attack
  
  // Status
  status: varchar("status").notNull().default("preparing"), // "preparing", "active", "completed"
  result: varchar("result"), // "attacker_victory", "defender_victory", "tie", "cancelled"
  
  // Rewards/Losses
  attackerLosses: jsonb("attacker_losses").notNull().default({}), // Resources/units lost
  defenderLosses: jsonb("defender_losses").notNull().default({}),
  rewards: jsonb("rewards").notNull().default({}),
  
  // Timestamps
  startedAt: timestamp("started_at").defaultNow(),
  endedAt: timestamp("ended_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type Raid = typeof raids.$inferSelect;
export const insertRaidSchema = createInsertSchema(raids).omit({ id: true, createdAt: true });
export type InsertRaid = z.infer<typeof insertRaidSchema>;

// Raid Combat Encounters - Individual combat rounds in a raid
export const raidCombats = pgTable("raid_combats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  raidId: varchar("raid_id").notNull().references(() => raids.id, { onDelete: "cascade" }),
  
  // Combatants
  attackerId: varchar("attacker_id").notNull().references(() => users.id),
  defenderId: varchar("defender_id").notNull().references(() => users.id),
  
  // Combat details
  round: integer("round").default(1),
  attackerShips: jsonb("attacker_ships").notNull().default([]),
  defenderShips: jsonb("defender_ships").notNull().default([]),
  
  // Results
  winner: varchar("winner"), // "attacker", "defender", "draw"
  attackerDamage: integer("attacker_damage").default(0),
  defenderDamage: integer("defender_damage").default(0),
  combatLog: jsonb("combat_log").notNull().default([]),
  
  // Timestamps
  startedAt: timestamp("started_at").defaultNow(),
  endedAt: timestamp("ended_at"),
});

export type RaidCombat = typeof raidCombats.$inferSelect;
export const insertRaidCombatSchema = createInsertSchema(raidCombats).omit({ id: true, startedAt: true });
export type InsertRaidCombat = z.infer<typeof insertRaidCombatSchema>;

// Combat Statistics - Track player combat performance
export const combatStats = pgTable("combat_stats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  playerId: varchar("player_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  
  // Battle stats
  totalBattles: integer("total_battles").default(0),
  wins: integer("wins").default(0),
  losses: integer("losses").default(0),
  draws: integer("draws").default(0),
  
  // Raid stats
  raidParticipations: integer("raid_participations").default(0),
  raidVictories: integer("raid_victories").default(0),
  
  // Unit stats
  unitsDestroyed: integer("units_destroyed").default(0),
  unitsLost: integer("units_lost").default(0),
  
  // Rankings
  combatRating: integer("combat_rating").default(1000),
  raidRating: integer("raid_rating").default(1000),
  
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type CombatStats = typeof combatStats.$inferSelect;
export const insertCombatStatsSchema = createInsertSchema(combatStats).omit({ id: true, updatedAt: true });
export type InsertCombatStats = z.infer<typeof insertCombatStatsSchema>;

// Universe Events - 50 types of world events
export const universeEvents = pgTable("universe_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  
  // Event details
  name: varchar("name").notNull(),
  description: text("description"),
  eventType: varchar("event_type").notNull(), // "boss_raid", "meteor_strike", "invasion", "anomaly", "treasure_hunt", etc (50 types)
  eventClass: varchar("event_class").notNull(), // "common", "rare", "epic", "legendary", "mythic"
  
  // Location & timing
  galaxyId: varchar("galaxy_id"),
  sector: varchar("sector"),
  duration: integer("duration"), // In minutes
  startTime: timestamp("start_time").defaultNow(),
  endTime: timestamp("end_time"),
  
  // Mechanics
  participantLimit: integer("participant_limit").default(50),
  minimumLevel: integer("minimum_level").default(1),
  rewards: jsonb("rewards").notNull().default({}),
  difficulty: integer("difficulty").default(1),
  
  // Status
  status: varchar("status").default("active"), // "preparing", "active", "completed", "failed"
  
  createdAt: timestamp("created_at").defaultNow(),
});

export type UniverseEvent = typeof universeEvents.$inferSelect;
export const insertUniverseEventSchema = createInsertSchema(universeEvents).omit({ id: true, createdAt: true });
export type InsertUniverseEvent = z.infer<typeof insertUniverseEventSchema>;

// Universe Bosses - 90 different bosses
export const universeBosses = pgTable("universe_bosses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  
  // Boss details
  name: varchar("name").notNull(),
  description: text("description"),
  bossType: varchar("boss_type").notNull(), // 90 unique types
  rarity: varchar("rarity").notNull(), // "common", "rare", "epic", "legendary", "mythic", "transcendent"
  
  // Combat stats
  healthPoints: integer("health_points").notNull().default(10000),
  attackPower: integer("attack_power").default(100),
  defense: integer("defense").default(50),
  speed: integer("speed").default(50),
  
  // Mechanics
  abilities: jsonb("abilities").notNull().default([]), // Special boss abilities
  weaknesses: jsonb("weaknesses").notNull().default({}),
  resistances: jsonb("resistances").notNull().default({}),
  
  // Loot
  lootTable: jsonb("loot_table").notNull().default([]),
  bossReward: jsonb("boss_reward").notNull().default({}),
  
  // Difficulty & requirements
  recommendedLevel: integer("recommended_level").default(50),
  recommendedPlayers: integer("recommended_players").default(6),
  minPlayers: integer("min_players").default(1),
  
  createdAt: timestamp("created_at").defaultNow(),
});

export type UniverseBoss = typeof universeBosses.$inferSelect;
export const insertUniverseBossSchema = createInsertSchema(universeBosses).omit({ id: true, createdAt: true });
export type InsertUniverseBoss = z.infer<typeof insertUniverseBossSchema>;

// Boss Encounters - Active boss battles
export const bossEncounters = pgTable("boss_encounters", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  
  eventId: varchar("event_id").references(() => universeEvents.id, { onDelete: "cascade" }),
  bossId: varchar("boss_id").notNull().references(() => universeBosses.id),
  
  // Encounter state
  currentHealth: integer("current_health"),
  status: varchar("status").default("active"), // "active", "defeated", "failed", "abandoned"
  
  // Participants
  participants: jsonb("participants").notNull().default([]),
  participantCount: integer("participant_count").default(0),
  
  // Combat
  totalDamageDealt: integer("total_damage_dealt").default(0),
  combatLog: jsonb("combat_log").notNull().default([]),
  
  // Rewards
  totalRewards: jsonb("total_rewards").notNull().default({}),
  
  startedAt: timestamp("started_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

export type BossEncounter = typeof bossEncounters.$inferSelect;
export const insertBossEncounterSchema = createInsertSchema(bossEncounters).omit({ id: true, startedAt: true });
export type InsertBossEncounter = z.infer<typeof insertBossEncounterSchema>;

// Raid Groups - Groups of 6-50 players for raids
export const raidGroups = pgTable("raid_groups", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  
  // Group info
  name: varchar("name").notNull(),
  description: text("description"),
  leaderId: varchar("leader_id").notNull().references(() => users.id),
  
  // Members (6-50)
  members: jsonb("members").notNull().default([]),
  minMembers: integer("min_members").default(6),
  maxMembers: integer("max_members").default(50),
  
  // Status
  status: varchar("status").default("forming"), // "forming", "ready", "raiding", "disbanded"
  targetBossId: varchar("target_boss_id").references(() => universeBosses.id),
  
  createdAt: timestamp("created_at").defaultNow(),
});

export type RaidGroup = typeof raidGroups.$inferSelect;
export const insertRaidGroupSchema = createInsertSchema(raidGroups).omit({ id: true, createdAt: true });
export type InsertRaidGroup = z.infer<typeof insertRaidGroupSchema>;

// Raid Finder - Matchmaking for raid groups
export const raidFinder = pgTable("raid_finder", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  
  playerId: varchar("player_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  
  // Preferences
  preferredRole: varchar("preferred_role"), // "tank", "dps", "healer", "support"
  minRaidLevel: integer("min_raid_level").default(1),
  maxRaidLevel: integer("max_raid_level").default(99),
  
  // Looking for
  lookingForBossId: varchar("looking_for_boss_id").references(() => universeBosses.id),
  eventId: varchar("event_id").references(() => universeEvents.id),
  
  // Status
  status: varchar("status").default("queued"), // "queued", "matched", "raiding", "completed"
  queuedAt: timestamp("queued_at").defaultNow(),
  
  createdAt: timestamp("created_at").defaultNow(),
});

export type RaidFinder = typeof raidFinder.$inferSelect;
export const insertRaidFinderSchema = createInsertSchema(raidFinder).omit({ id: true, createdAt: true });
export type InsertRaidFinder = z.infer<typeof insertRaidFinderSchema>;

// PvE Combat Logs - Individual player combat during events
export const pveCombatLogs = pgTable("pve_combat_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  
  eventId: varchar("event_id").notNull().references(() => universeEvents.id, { onDelete: "cascade" }),
  encounterId: varchar("encounter_id").references(() => bossEncounters.id, { onDelete: "cascade" }),
  playerId: varchar("player_id").notNull().references(() => users.id),
  
  // Combat details
  roleInCombat: varchar("role_in_combat"), // "tank", "dps", "healer", "support"
  damageDealt: integer("damage_dealt").default(0),
  damageReceived: integer("damage_received").default(0),
  healsProvided: integer("heals_provided").default(0),
  controlsApplied: integer("controls_applied").default(0),
  
  // Results
  survived: boolean("survived").default(true),
  contribution: integer("contribution").default(0), // Percentage
  rewards: jsonb("rewards").notNull().default({}),
  
  // Status
  participationStatus: varchar("participation_status").default("completed"), // "completed", "abandoned", "failed"
  
  startedAt: timestamp("started_at").defaultNow(),
  endedAt: timestamp("ended_at"),
});

export type PveCombatLog = typeof pveCombatLogs.$inferSelect;
export const insertPveCombatLogSchema = createInsertSchema(pveCombatLogs).omit({ id: true, startedAt: true });
export type InsertPveCombatLog = z.infer<typeof insertPveCombatLogSchema>;

// Items System - 1000 different types, classes, ranks
export const items = pgTable("items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  
  // Basic info
  name: varchar("name").notNull(),
  description: text("description"),
  itemType: varchar("item_type").notNull(), // "weapon", "armor", "accessory", "consumable", "quest", "crafting", "blueprint", "relic", "artifact", "equipment", "material", "key", "currency", "cosmetic"
  itemClass: varchar("item_class").notNull(), // "common", "rare", "epic", "legendary", "mythic", "transcendent", "ancient"
  rank: integer("rank").notNull().default(1), // 1-100
  
  // Stats & bonuses
  rarity: varchar("rarity").notNull(), // Redundant with class but for clarity
  stats: jsonb("stats").notNull().default({}), // Attack, Defense, Speed, HP, etc.
  bonuses: jsonb("bonuses").notNull().default({}), // Skill bonuses, resistances, etc.
  
  // Requirements
  requiredLevel: integer("required_level").default(1),
  requiredClass: varchar("required_class"), // "warrior", "mage", "rogue", "paladin", "ranger"
  requiredRank: integer("required_rank").default(1),
  
  // Economy
  sellPrice: integer("sell_price").default(0),
  craftPrice: integer("craft_price").default(0),
  marketPrice: integer("market_price").default(0),
  
  // Crafting & acquisition
  craftingRecipe: jsonb("crafting_recipe"), // { item_id: quantity, ... }
  sources: jsonb("sources").notNull().default([]), // "quest", "craft", "boss_drop", "vendor", "mission"
  
  // Special properties
  isUnique: boolean("is_unique").default(false),
  isBound: boolean("is_bound").default(false),
  isStackable: boolean("is_stackable").default(true),
  maxStack: integer("max_stack").default(999),
  
  createdAt: timestamp("created_at").defaultNow(),
});

export type Item = typeof items.$inferSelect;
export const insertItemSchema = createInsertSchema(items).omit({ id: true, createdAt: true });
export type InsertItem = z.infer<typeof insertItemSchema>;

// Player Item Inventory
export const playerItems = pgTable("player_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  playerId: varchar("player_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  itemId: varchar("item_id").notNull().references(() => items.id),
  
  quantity: integer("quantity").default(1),
  isEquipped: boolean("is_equipped").default(false),
  slot: varchar("slot"), // "head", "chest", "legs", "feet", "mainhand", "offhand", "ring1", "ring2"
  
  // Custom properties per instance
  durability: integer("durability").default(100),
  enchantments: jsonb("enchantments").notNull().default([]),
  customStats: jsonb("custom_stats"), // Enhanced/modified stats
  
  acquiredAt: timestamp("acquired_at").defaultNow(),
});

export type PlayerItem = typeof playerItems.$inferSelect;
export const insertPlayerItemSchema = createInsertSchema(playerItems).omit({ id: true, acquiredAt: true });
export type InsertPlayerItem = z.infer<typeof insertPlayerItemSchema>;

// 3-Tier Currency System (Silver, Gold, Platinum)
export const playerCurrency = pgTable("player_currency", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  
  // 3-tier currency balances
  silver: bigint("silver", { mode: "number" }).notNull().default(0),
  gold: bigint("gold", { mode: "number" }).notNull().default(0),
  platinum: bigint("platinum", { mode: "number" }).notNull().default(0),
  
  // Lifetime earned/spent tracking
  silverEarned: bigint("silver_earned", { mode: "number" }).notNull().default(0),
  silverSpent: bigint("silver_spent", { mode: "number" }).notNull().default(0),
  goldEarned: bigint("gold_earned", { mode: "number" }).notNull().default(0),
  goldSpent: bigint("gold_spent", { mode: "number" }).notNull().default(0),
  platinumEarned: bigint("platinum_earned", { mode: "number" }).notNull().default(0),
  platinumSpent: bigint("platinum_spent", { mode: "number" }).notNull().default(0),
  
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export type PlayerCurrency = typeof playerCurrency.$inferSelect;
export const insertPlayerCurrencySchema = createInsertSchema(playerCurrency).omit({ id: true, lastUpdated: true });
export type InsertPlayerCurrency = z.infer<typeof insertPlayerCurrencySchema>;

// Currency transaction log
export const currencyTransactions = pgTable("currency_transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  
  currencyType: varchar("currency_type").notNull(), // "silver", "gold", "platinum"
  amount: bigint("amount", { mode: "number" }).notNull(), // positive for income, negative for expense
  reason: varchar("reason").notNull(), // "quest_reward", "combat_loot", "construction_cost", "research_cost", "trade", "market_fee", etc
  relatedId: varchar("related_id"), // quest ID, battle ID, etc
  
  balanceBefore: bigint("balance_before", { mode: "number" }).notNull(),
  balanceAfter: bigint("balance_after", { mode: "number" }).notNull(),
  
  createdAt: timestamp("created_at").defaultNow(),
});

export type CurrencyTransaction = typeof currencyTransactions.$inferSelect;
export const insertCurrencyTransactionSchema = createInsertSchema(currencyTransactions).omit({ id: true, createdAt: true });
export type InsertCurrencyTransaction = z.infer<typeof insertCurrencyTransactionSchema>;

// Bank System - Player Banking
export const bankAccounts = pgTable("bank_accounts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  
  // Account info
  accountType: varchar("account_type").notNull().default("standard"), // "standard", "savings", "vault"
  accountBalance: bigint("account_balance", { mode: "number" }).notNull().default(0),
  
  // Interest tracking
  interestRate: real("interest_rate").notNull().default(0.05), // 5% default
  lastInterestPayment: timestamp("last_interest_payment").defaultNow(),
  totalInterestEarned: bigint("total_interest_earned", { mode: "number" }).notNull().default(0),
  
  // Account limits
  maxWithdrawal: bigint("max_withdrawal", { mode: "number" }).notNull().default(1000000),
  maxDeposit: bigint("max_deposit", { mode: "number" }).notNull().default(10000000),
  
  // Status
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type BankAccount = typeof bankAccounts.$inferSelect;
export const insertBankAccountSchema = createInsertSchema(bankAccounts).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertBankAccount = z.infer<typeof insertBankAccountSchema>;

// Bank Transactions (deposits, withdrawals, interest)
export const bankTransactions = pgTable("bank_transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  accountId: varchar("account_id").notNull().references(() => bankAccounts.id, { onDelete: "cascade" }),
  
  transactionType: varchar("transaction_type").notNull(), // "deposit", "withdrawal", "interest", "fee", "transfer"
  amount: bigint("amount", { mode: "number" }).notNull(),
  description: varchar("description"),
  
  balanceBefore: bigint("balance_before", { mode: "number" }).notNull(),
  balanceAfter: bigint("balance_after", { mode: "number" }).notNull(),
  
  createdAt: timestamp("created_at").defaultNow(),
});

export type BankTransaction = typeof bankTransactions.$inferSelect;
export const insertBankTransactionSchema = createInsertSchema(bankTransactions).omit({ id: true, createdAt: true });
export type InsertBankTransaction = z.infer<typeof insertBankTransactionSchema>;

// Empire Value Tracking
export const empireValues = pgTable("empire_values", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  
  // Resource values
  resourceValue: bigint("resource_value", { mode: "number" }).notNull().default(0), // metal + crystal + deuterium
  
  // Building values
  buildingValue: bigint("building_value", { mode: "number" }).notNull().default(0),
  
  // Fleet values
  fleetValue: bigint("fleet_value", { mode: "number" }).notNull().default(0),
  
  // Currency values
  currencyValue: bigint("currency_value", { mode: "number" }).notNull().default(0), // silver + gold + platinum
  
  // Total empire value
  totalValue: bigint("total_value", { mode: "number" }).notNull().default(0),
  
  // Ranking
  empireRank: integer("empire_rank").default(0),
  
  // Updated timestamp
  lastCalculated: timestamp("last_calculated").defaultNow(),
});

export type EmpireValue = typeof empireValues.$inferSelect;
export const insertEmpireValueSchema = createInsertSchema(empireValues).omit({ id: true, lastCalculated: true });
export type InsertEmpireValue = z.infer<typeof insertEmpireValueSchema>;

// OGame Catalog Categories - normalized compendium categories
export const ogameCatalogCategories = pgTable("ogame_catalog_categories", {
  id: varchar("id").primaryKey(),
  name: varchar("name").notNull(),
  description: text("description").notNull().default(""),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export type OgameCatalogCategory = typeof ogameCatalogCategories.$inferSelect;
export const insertOgameCatalogCategorySchema = createInsertSchema(ogameCatalogCategories).omit({ createdAt: true });
export type InsertOgameCatalogCategory = z.infer<typeof insertOgameCatalogCategorySchema>;

// OGame Catalog Entries - buildings, ships, research, defenses, moon facilities, officers
export const ogameCatalogEntries = pgTable("ogame_catalog_entries", {
  id: varchar("id").primaryKey(),
  categoryId: varchar("category_id").notNull().references(() => ogameCatalogCategories.id, { onDelete: "cascade" }),
  entryType: varchar("entry_type").notNull(),
  name: varchar("name").notNull(),
  description: text("description").notNull().default(""),
  baseCost: jsonb("base_cost").notNull().default({ metal: 0, crystal: 0, deuterium: 0 }),
  baseTimeSeconds: integer("base_time_seconds").notNull().default(0),
  growthFactor: real("growth_factor").notNull().default(1),
  prerequisites: jsonb("prerequisites").notNull().default({}),
  stats: jsonb("stats").notNull().default({}),
  isMoonOnly: boolean("is_moon_only").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type OgameCatalogEntry = typeof ogameCatalogEntries.$inferSelect;
export const insertOgameCatalogEntrySchema = createInsertSchema(ogameCatalogEntries).omit({ createdAt: true, updatedAt: true });
export type InsertOgameCatalogEntry = z.infer<typeof insertOgameCatalogEntrySchema>;
