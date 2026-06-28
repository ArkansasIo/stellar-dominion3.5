import {
  users,
  playerStates,
  missions,
  messages,
  alliances,
  allianceMembers,
  marketOrders,
  auctionListings,
  auctionBids,
  tradeOffers,
  tradeHistory,
  systemSettings,
  queueItems,
  playerColonies,
  resourceFields,
  equipmentDurability,
  fleetDurability,
  buildingDurability,
  battles,
  battleLogs,
  researchAreas,
  researchSubcategories,
  researchTechnologies,
  playerResearchProgress,
  expeditions,
  expeditionTeams,
  expeditionEncounters,
  starbases,
  moonBases,
  playerProfiles,
  megaStructures,
  empireDifficulties,
  storyCampaigns,
  storyMissions,
  achievements,
  elementBuffs,
  npcFactions,
  npcVendors,
  relics,
  relicInventory,
  friends,
  friendRequests,
  guilds,
  guildMembers,
  teams,
  raids,
  raidCombats,
  combatStats,
  universeEvents,
  universeBosses,
  bossEncounters,
  raidGroups,
  raidFinder,
  pveCombatLogs,
  items,
  playerItems,
  bankAccounts,
  bankTransactions,
  empireValues,
  playerCurrency,
  currencyTransactions,
  type User,
  type UpsertUser,
  type PlayerState,
  type InsertPlayerState,
  type Mission,
  type InsertMission,
  type Message,
  type InsertMessage,
  type Alliance,
  type InsertAlliance,
  type AllianceMember,
  type InsertAllianceMember,
  type MarketOrder,
  type InsertMarketOrder,
  type AuctionListing,
  type InsertAuctionListing,
  type AuctionBid,
  type InsertAuctionBid,
  type TradeOffer,
  type InsertTradeOffer,
  type TradeHistory,
  type SystemSettings,
  type InsertSystemSettings,
  type QueueItem,
  type InsertQueueItem,
  type PlayerColony,
  type ResourceField,
  type EquipmentDurability,
  type FleetDurability,
  type BuildingDurability,
  type Battle,
  type InsertBattle,
  type BattleLog,
  type InsertBattleLog,
  type AdminUser,
  type Starbase,
  type InsertStarbase,
  type MoonBase,
  type InsertMoonBase,
  type PlayerProfile,
  type InsertPlayerProfile,
  type MegaStructure,
  type InsertMegaStructure,
  type EmpireDifficulty,
  type InsertEmpireDifficulty,
  type StoryCampaign,
  type InsertStoryCampaign,
  type StoryMission,
  type InsertStoryMission,
  type Achievement,
  type InsertAchievement,
  type ElementBuff,
  type InsertElementBuff,
  type NPCFaction,
  type InsertNPCFaction,
  type NPCVendor,
  type InsertNPCVendor,
  type Relic,
  type InsertRelic,
  type RelicInventory,
  type InsertRelicInventory,
  type Friend,
  type InsertFriend,
  type FriendRequest,
  type InsertFriendRequest,
  type Guild,
  type InsertGuild,
  type GuildMember,
  type InsertGuildMember,
  type Team,
  type InsertTeam,
  type Raid,
  type InsertRaid,
  type RaidCombat,
  type InsertRaidCombat,
  type CombatStats,
  type InsertCombatStats,
  type UniverseEvent,
  type InsertUniverseEvent,
  type UniverseBoss,
  type InsertUniverseBoss,
  type BossEncounter,
  type InsertBossEncounter,
  type RaidGroup,
  type InsertRaidGroup,
  type RaidFinder,
  type InsertRaidFinder,
  type PveCombatLog,
  type InsertPveCombatLog,
  type Item,
  type InsertItem,
  type PlayerItem,
  type InsertPlayerItem,
  adminUsers
} from "@shared/schema";
import { db } from "./db/index";
import { eq, and, or, desc, asc, sql, inArray } from "drizzle-orm";

const MAX_LEVEL = 999;
const MAX_TIER = 99;
const MAX_VALUE = 999999999;

function boostNestedValues(value: any, path: string[] = []): any {
  if (value === null || value === undefined) return value;
  if (value instanceof Date) return value;

  if (Array.isArray(value)) {
    return value.map((entry, index) => boostNestedValues(entry, [...path, String(index)]));
  }

  if (typeof value === "number") {
    const joined = path.join(".").toLowerCase();
    const key = (path[path.length - 1] || "").toLowerCase();

    if (key.includes("tier") || joined.includes("tier")) return MAX_TIER;
    if (key.includes("level") || key === "lvl") return MAX_LEVEL;
    if (key.includes("experience") || key.includes("xp")) return MAX_VALUE;

    if (
      joined.includes("research") ||
      joined.includes("buildings") ||
      joined.includes("units") ||
      joined.includes("stats") ||
      joined.includes("substats") ||
      joined.includes("attributes") ||
      joined.includes("tierbonuses")
    ) {
      return MAX_LEVEL;
    }

    if (
      joined.includes("resources") ||
      joined.includes("currency") ||
      joined.includes("balance") ||
      joined.includes("kardashev")
    ) {
      return MAX_VALUE;
    }

    return Math.max(value, MAX_LEVEL);
  }

  if (typeof value === "object") {
    const result: Record<string, any> = {};
    for (const [k, v] of Object.entries(value)) {
      result[k] = boostNestedValues(v, [...path, k]);
    }
    return result;
  }

  return value;
}

function maximizePlayerState<T extends Record<string, any>>(state: T): T {
  const boosted = boostNestedValues(state) as T;
  if (typeof boosted === "object" && boosted !== null) {
    (boosted as any).empireLevel = MAX_LEVEL;
    (boosted as any).tier = MAX_TIER;
    (boosted as any).setupComplete = true;
  }
  return boosted;
}

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: UpsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<UpsertUser>): Promise<User>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Player state operations
  getPlayerState(userId: string): Promise<PlayerState | undefined>;
  createPlayerState(playerState: InsertPlayerState): Promise<PlayerState>;
  updatePlayerState(userId: string, updates: Partial<PlayerState>): Promise<PlayerState>;
  
  // Mission operations
  getMissionsByUser(userId: string): Promise<Mission[]>;
  getActiveMissions(userId: string): Promise<Mission[]>;
  createMission(mission: InsertMission): Promise<Mission>;
  updateMission(id: string, updates: Partial<Mission>): Promise<Mission>;
  updateMissionByUser(userId: string, id: string, updates: Partial<Mission>): Promise<Mission | null>;
  deleteMission(id: string): Promise<void>;
  deleteMissionByUser(userId: string, id: string): Promise<boolean>;
  
  // Message operations
  getMessagesByUser(userId: string, limit?: number): Promise<Message[]>;
  getUnreadCount(userId: string): Promise<number>;
  createMessage(message: InsertMessage): Promise<Message>;
  markMessageAsRead(id: string): Promise<void>;
  markMessageAsReadByUser(userId: string, id: string): Promise<boolean>;
  deleteMessage(id: string): Promise<void>;
  deleteMessageByUser(userId: string, id: string): Promise<boolean>;
  
  // Alliance operations
  getAllianceById(id: string): Promise<Alliance | undefined>;
  getAllianceByTag(tag: string): Promise<Alliance | undefined>;
  getAllAlliances(): Promise<Alliance[]>;
  createAlliance(alliance: InsertAlliance): Promise<Alliance>;
  updateAlliance(id: string, updates: Partial<Alliance>): Promise<Alliance>;
  
  // Alliance member operations
  getAllianceMembers(allianceId: string): Promise<AllianceMember[]>;
  getUserAlliance(userId: string): Promise<{ alliance: Alliance, member: AllianceMember } | undefined>;
  addAllianceMember(member: InsertAllianceMember): Promise<AllianceMember>;
  removeAllianceMember(allianceId: string, userId: string): Promise<void>;
  updateAllianceMember(id: string, updates: Partial<AllianceMember>): Promise<AllianceMember>;
  
  // Market operations
  getActiveMarketOrders(limit?: number): Promise<MarketOrder[]>;
  getUserMarketOrders(userId: string): Promise<MarketOrder[]>;
  createMarketOrder(order: InsertMarketOrder): Promise<MarketOrder>;
  updateMarketOrder(id: string, updates: Partial<MarketOrder>): Promise<MarketOrder>;
  deleteMarketOrder(id: string): Promise<void>;
  deleteMarketOrderByUser(userId: string, id: string): Promise<boolean>;
  
  // Queue operations
  getUserQueue(userId: string): Promise<QueueItem[]>;
  createQueueItem(item: InsertQueueItem): Promise<QueueItem>;
  deleteQueueItem(id: string): Promise<void>;
  
  // Leaderboard
  getLeaderboard(limit?: number): Promise<Array<{ user: User, state: PlayerState, points: number }>>;
  
  // Colony operations
  getPlayerColonies(userId: string): Promise<PlayerColony[]>;
  createPlayerColony(colony: any): Promise<PlayerColony>;
  
  // Starbase operations
  getPlayerStarbases(userId: string): Promise<Starbase[]>;
  getStarbaseById(id: string): Promise<Starbase | undefined>;
  createStarbase(starbase: InsertStarbase): Promise<Starbase>;
  updateStarbase(id: string, updates: Partial<Starbase>): Promise<Starbase>;
  deleteStarbase(id: string): Promise<void>;
  
  // Moon Base operations
  getPlayerMoonBases(userId: string): Promise<MoonBase[]>;
  getMoonBaseById(id: string): Promise<MoonBase | undefined>;
  createMoonBase(moonBase: InsertMoonBase): Promise<MoonBase>;
  updateMoonBase(id: string, updates: Partial<MoonBase>): Promise<MoonBase>;
  deleteMoonBase(id: string): Promise<void>;
  
  // Player Profile operations
  getPlayerProfile(userId: string): Promise<PlayerProfile | undefined>;
  getPlayerProfileByUid(uid: string): Promise<PlayerProfile | undefined>;
  createPlayerProfile(profile: InsertPlayerProfile): Promise<PlayerProfile>;
  updatePlayerProfile(userId: string, updates: Partial<PlayerProfile>): Promise<PlayerProfile>;
  
  // Mega Structure operations
  getPlayerMegaStructures(userId: string): Promise<MegaStructure[]>;
  getMegaStructureById(id: string): Promise<MegaStructure | undefined>;
  createMegaStructure(structure: InsertMegaStructure): Promise<MegaStructure>;
  updateMegaStructure(id: string, updates: Partial<MegaStructure>): Promise<MegaStructure>;
  deleteMegaStructure(id: string): Promise<void>;
  
  // Empire Difficulty operations
  getEmpireDifficulty(userId: string): Promise<EmpireDifficulty | undefined>;
  createEmpireDifficulty(difficulty: InsertEmpireDifficulty): Promise<EmpireDifficulty>;
  updateEmpireDifficulty(userId: string, updates: Partial<EmpireDifficulty>): Promise<EmpireDifficulty>;
  setDifficultyLevel(userId: string, level: number, kardashevLevel?: number): Promise<EmpireDifficulty>;
  
  // Story Campaign operations
  getStoryCampaign(userId: string): Promise<StoryCampaign | undefined>;
  createStoryCampaign(campaign: InsertStoryCampaign): Promise<StoryCampaign>;
  updateStoryCampaign(userId: string, updates: Partial<StoryCampaign>): Promise<StoryCampaign>;
  
  // Story Mission operations
  getStoryMission(missionId: string): Promise<StoryMission | undefined>;
  getUserStoryMissions(userId: string): Promise<StoryMission[]>;
  createStoryMission(mission: InsertStoryMission): Promise<StoryMission>;
  completeStoryMission(missionId: string, userId: string): Promise<StoryMission>;
  
  // Achievement operations
  getUserAchievements(userId: string): Promise<Achievement[]>;
  getAchievementByIdForUser(userId: string, achievementId: string): Promise<Achievement | undefined>;
  createAchievement(achievement: InsertAchievement): Promise<Achievement>;
  updateAchievementProgress(achievementId: string, userId: string, progress: number): Promise<Achievement>;
  
  // Element Buff operations
  getActiveBuffs(userId: string, missionId?: string): Promise<ElementBuff[]>;
  createElementBuff(buff: InsertElementBuff): Promise<ElementBuff>;
  
  // NPC Faction operations
  getPlayerFactions(userId: string): Promise<NPCFaction[]>;
  getPlayerFactionStanding(userId: string, factionId: string): Promise<NPCFaction | undefined>;
  createFactionStanding(standing: InsertNPCFaction): Promise<NPCFaction>;
  updateReputation(userId: string, factionId: string, delta: number): Promise<NPCFaction>;
  
  // NPC Vendor operations
  getAllVendors(): Promise<NPCVendor[]>;
  getVendorsByFaction(factionId: string): Promise<NPCVendor[]>;
  getVendorInventory(vendorId: string): Promise<any[]>;
  
  // Relic operations
  getAllRelics(): Promise<Relic[]>;
  getPlayerRelics(userId: string): Promise<Relic[]>;
  getPlayerRelicInventory(userId: string): Promise<RelicInventory[]>;
  acquireRelic(userId: string, relicId: string): Promise<RelicInventory>;
  equipRelic(userId: string, relicId: string, slot: string): Promise<RelicInventory>;
  
  // Friends operations (50 max per player)
  getPlayerFriends(userId: string): Promise<Friend[]>;
  getFriendsCount(userId: string): Promise<number>;
  addFriend(playerId: string, friendId: string, message?: string): Promise<FriendRequest>;
  acceptFriendRequest(requestId: string): Promise<Friend>;
  rejectFriendRequest(requestId: string): Promise<FriendRequest>;
  removeFriend(playerId: string, friendId: string): Promise<void>;
  getPlayerFriendRequests(userId: string): Promise<FriendRequest[]>;
  setFavorite(playerId: string, friendId: string, isFavorite: boolean): Promise<Friend>;
  updateFriendNickname(playerId: string, friendId: string, nickname: string): Promise<Friend>;
  
  // Guild operations
  createGuild(guild: InsertGuild): Promise<Guild>;
  getGuildById(guildId: string): Promise<Guild | undefined>;
  getPlayerGuild(userId: string): Promise<Guild | undefined>;
  updateGuild(guildId: string, updates: Partial<Guild>): Promise<Guild>;
  deleteGuild(guildId: string): Promise<void>;
  addGuildMember(guildId: string, playerId: string): Promise<GuildMember>;
  removeGuildMember(guildId: string, playerId: string): Promise<void>;
  getGuildMembers(guildId: string): Promise<GuildMember[]>;
  updateGuildMemberRole(guildId: string, playerId: string, role: string): Promise<GuildMember>;
  
  // Team operations (6 players max)
  createTeam(team: InsertTeam): Promise<Team>;
  getTeamById(teamId: string): Promise<Team | undefined>;
  getPlayerTeams(userId: string): Promise<Team[]>;
  updateTeam(teamId: string, updates: Partial<Team>): Promise<Team>;
  deleteTeam(teamId: string): Promise<void>;
  addTeamMember(teamId: string, playerId: string): Promise<Team>;
  removeTeamMember(teamId: string, playerId: string): Promise<Team>;
  getTeamMembers(teamId: string): Promise<any[]>;
  
  // Raid operations
  createRaid(raid: InsertRaid): Promise<Raid>;
  getRaidById(raidId: string): Promise<Raid | undefined>;
  updateRaidStatus(raidId: string, status: string, result?: string): Promise<Raid>;
  getTeamRaids(teamId: string): Promise<Raid[]>;
  
  // Raid combat operations
  createRaidCombat(combat: InsertRaidCombat): Promise<RaidCombat>;
  completeRaidCombat(combatId: string, winner: string, log: any[]): Promise<RaidCombat>;
  getRaidCombats(raidId: string): Promise<RaidCombat[]>;
  
  // Combat stats operations
  getCombatStats(userId: string): Promise<CombatStats | undefined>;
  createCombatStats(stats: InsertCombatStats): Promise<CombatStats>;
  updateCombatStats(userId: string, updates: Partial<CombatStats>): Promise<CombatStats>;
  
  // Universe events operations
  createUniverseEvent(event: InsertUniverseEvent): Promise<UniverseEvent>;
  getUniverseEvent(eventId: string): Promise<UniverseEvent | undefined>;
  getActiveEvents(): Promise<UniverseEvent[]>;
  updateEventStatus(eventId: string, status: string): Promise<UniverseEvent>;
  
  // Universe bosses operations (90 bosses)
  getAllBosses(): Promise<UniverseBoss[]>;
  getBossById(bossId: string): Promise<UniverseBoss | undefined>;
  getBossesByRarity(rarity: string): Promise<UniverseBoss[]>;
  
  // Boss encounters operations
  createBossEncounter(encounter: InsertBossEncounter): Promise<BossEncounter>;
  getBossEncounter(encounterId: string): Promise<BossEncounter | undefined>;
  updateEncounterStatus(encounterId: string, status: string): Promise<BossEncounter>;
  addEncounterParticipant(encounterId: string, playerId: string): Promise<BossEncounter>;
  
  // Raid groups operations
  createRaidGroup(group: InsertRaidGroup): Promise<RaidGroup>;
  getRaidGroup(groupId: string): Promise<RaidGroup | undefined>;
  getPlayerRaidGroups(playerId: string): Promise<RaidGroup[]>;
  addGroupMember(groupId: string, playerId: string): Promise<RaidGroup>;
  removeGroupMember(groupId: string, playerId: string): Promise<RaidGroup>;
  
  // Raid finder operations
  joinRaidFinder(finderId: InsertRaidFinder): Promise<RaidFinder>;
  getRaidFinderQueue(limit?: number): Promise<RaidFinder[]>;
  leaveRaidFinder(finderId: string): Promise<void>;
  updateFinderStatus(finderId: string, status: string): Promise<RaidFinder>;
  
  // PvE combat logs
  createCombatLog(log: InsertPveCombatLog): Promise<PveCombatLog>;
  getPlayerCombatLogs(playerId: string): Promise<PveCombatLog[]>;
  getEventCombatLogs(eventId: string): Promise<PveCombatLog[]>;
  
  // Items operations (1000 items)
  getAllItems(): Promise<Item[]>;
  getItemById(itemId: string): Promise<Item | undefined>;
  getItemsByType(itemType: string): Promise<Item[]>;
  getItemsByClass(itemClass: string): Promise<Item[]>;
  getItemsByRank(minRank: number, maxRank: number): Promise<Item[]>;
  getPlayerInventory(playerId: string): Promise<PlayerItem[]>;
  addItemToInventory(playerId: string, itemId: string, quantity: number): Promise<PlayerItem>;
  removeItemFromInventory(playerId: string, itemId: string, quantity: number): Promise<void>;
  equipItem(playerId: string, playerItemId: string, slot: string): Promise<PlayerItem>;
  
  // Resource field operations
  getFieldsByTerritory(territoryId: string): Promise<ResourceField[]>;
  
  // Mining operations
  getActiveMiningOperations(userId: string): Promise<any[]>;
  createMiningOperation(op: any): Promise<any>;
  
  // Durability operations
  getEquipmentDurability(userId: string, equipmentId: string): Promise<EquipmentDurability | undefined>;
  getFleetDurability(userId: string, fleetId: string): Promise<FleetDurability | undefined>;
  getBuildingDurability(userId: string, buildingId: string): Promise<BuildingDurability | undefined>;
  
  // Admin operations
  getAdminUser(userId: string): Promise<AdminUser | undefined>;
  
  // Research operations
  getResearchAreas(): Promise<any[]>;
  getResearchSubcategories(areaId: string): Promise<any[]>;
  getResearchTechnologies(subcategoryIds: string[]): Promise<any[]>;
  getPlayerResearchProgress(userId: string): Promise<any[]>;
  upsertPlayerResearch(userId: string, technologyId: string, status: string, progress: number): Promise<any>;
  
  // Expedition operations
  getExpeditions(userId: string): Promise<any[]>;
  createExpedition(userId: string, name: string, type: string, targetCoords: string, fleetComposition: any, troopComposition: any): Promise<any>;
  updateExpedition(expeditionId: string, updates: any): Promise<any>;
  getExpeditionTeams(expeditionId: string): Promise<any[]>;
  addTeamMember(expeditionId: string, unitId: string, role: string): Promise<any>;
  getExpeditionEncounters(expeditionId: string): Promise<any[]>;
  addEncounter(expeditionId: string, encounterType: string, description: string, rewards: any): Promise<any>;
  
  // Turn operations
  accrueAndGetTurns(userId: string): Promise<{ currentTurns: number; totalTurns: number; turnsAccrued: number; lastTurnUpdate: Date }>;
  spendTurns(userId: string, amount: number): Promise<{ success: boolean; currentTurns: number; totalTurns: number }>;
  
  // Auction operations
  getActiveAuctions(filters?: { itemType?: string; search?: string; sortBy?: string }): Promise<AuctionListing[]>;
  getAuctionById(id: string): Promise<AuctionListing | undefined>;
  getUserAuctions(userId: string): Promise<AuctionListing[]>;
  getUserBids(userId: string): Promise<AuctionListing[]>;
  createAuction(auction: InsertAuctionListing): Promise<AuctionListing>;
  placeBid(auctionId: string, bidderId: string, bidderName: string, bidAmount: number): Promise<{ success: boolean; auction?: AuctionListing; error?: string }>;
  buyoutAuction(auctionId: string, buyerId: string, buyerName: string): Promise<{ success: boolean; auction?: AuctionListing; error?: string }>;
  cancelAuction(auctionId: string, sellerId: string): Promise<{ success: boolean; error?: string }>;
  completeExpiredAuctions(): Promise<AuctionListing[]>;
  getAuctionBidHistory(auctionId: string): Promise<AuctionBid[]>;
  
  // Trade operations (mail-integrated player-to-player trading)
  getTradeOffers(userId: string): Promise<TradeOffer[]>;
  getTradeOfferById(id: string): Promise<TradeOffer | undefined>;
  getIncomingTradeOffers(userId: string): Promise<TradeOffer[]>;
  getOutgoingTradeOffers(userId: string): Promise<TradeOffer[]>;
  createTradeOffer(offer: InsertTradeOffer): Promise<TradeOffer>;
  acceptTradeOffer(tradeId: string, receiverId: string): Promise<{ success: boolean; trade?: TradeOffer; error?: string }>;
  declineTradeOffer(tradeId: string, receiverId: string): Promise<{ success: boolean; error?: string }>;
  cancelTradeOffer(tradeId: string, senderId: string): Promise<{ success: boolean; error?: string }>;
  counterTradeOffer(originalTradeId: string, counterOffer: InsertTradeOffer): Promise<{ success: boolean; trade?: TradeOffer; error?: string }>;
  getTradeHistory(userId: string): Promise<TradeHistory[]>;

  // System Settings operations
  getSetting(key: string): Promise<SystemSettings | undefined>;
  getAllSettings(): Promise<SystemSettings[]>;
  setSetting(key: string, value: any, description?: string, category?: string): Promise<SystemSettings>;
  seedDefaultSettings(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  private miningOpsTableReady = false;

  private async ensureMiningOperationsTable(): Promise<void> {
    if (this.miningOpsTableReady) return;

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS mining_operations (
        id varchar PRIMARY KEY,
        user_id varchar NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        resource_type varchar NOT NULL,
        amount_per_hour integer NOT NULL DEFAULT 0,
        status varchar NOT NULL DEFAULT 'active',
        started_at timestamp NOT NULL DEFAULT now(),
        ends_at timestamp,
        metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
        created_at timestamp NOT NULL DEFAULT now()
      )
    `);

    this.miningOpsTableReady = true;
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .returning();
    return user;
  }

  async updateUser(id: string, updates: Partial<UpsertUser>): Promise<User> {
    const [user] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Player state operations
  async getPlayerState(userId: string): Promise<PlayerState | undefined> {
    const [state] = await db.select().from(playerStates).where(eq(playerStates.userId, userId));
    
    if (!state) return undefined;
    
    // Ensure commander has default values if missing
    const commander = state.commander as any || {};
    const defaultCommander = {
      race: commander.race || "human",
      class: commander.class || "warrior",
      stats: commander.stats || { level: 1, xp: 0, warfare: 0, logistics: 0, engineering: 0 },
      equipment: commander.equipment || {},
      inventory: commander.inventory || [],
      title: commander.title || "Commander"
    };
    
    // Ensure government has default values if missing
    const government = state.government as any || {};
    const defaultGovernment = {
      type: government.type || "democracy",
      taxRate: government.taxRate || 10,
      policies: government.policies || [],
      stats: government.stats || { stability: 50, efficiency: 70, publicSupport: 60, militaryReadiness: 50 }
    };
    
    return maximizePlayerState({
      ...state,
      commander: defaultCommander,
      government: defaultGovernment
    });
  }

  // Tier and Empire progression
  async addTierExperience(userId: string, amount: number): Promise<PlayerState> {
    const state = await this.getPlayerState(userId);
    if (!state) throw new Error("Player state not found");
    
    const tierExp = (state.tierExperience || 0) + amount;
    const tierConfig = require("@shared/config/gameConfig").TIER_CONFIG;
    const currentTier = state.tier || 1;
    
    let newTier = currentTier;
    let remainingExp = tierExp;
    
    for (let i = currentTier; i <= tierConfig.maxTier && i < tierConfig.tiers.length; i++) {
      const tierReq = tierConfig.tiers[i - 1]?.expRequirement || 1000000;
      if (remainingExp >= tierReq) {
        remainingExp -= tierReq;
        newTier = i + 1;
      } else break;
    }
    
    return this.updatePlayerState(userId, { 
      tier: Math.min(newTier, tierConfig.maxTier),
      tierExperience: remainingExp
    });
  }

  async addEmpireExperience(userId: string, amount: number): Promise<PlayerState> {
    const state = await this.getPlayerState(userId);
    if (!state) throw new Error("Player state not found");
    
    const empireExp = (state.empireExperience || 0) + amount;
    const empireConfig = require("@shared/config/gameConfig").EMPIRE_LEVEL_CONFIG;
    const currentLevel = state.empireLevel || 1;
    
    let newLevel = currentLevel;
    let baseReq = empireConfig.baseExpRequirement;
    let totalExp = 0;
    
    for (let i = 1; i <= empireConfig.maxLevel; i++) {
      const reqForLevel = Math.floor(baseReq * Math.pow(empireConfig.expMultiplier, i - 1));
      if (totalExp + reqForLevel <= empireExp) {
        totalExp += reqForLevel;
        newLevel = i + 1;
      } else break;
    }
    
    return this.updatePlayerState(userId, {
      empireLevel: Math.min(newLevel, empireConfig.maxLevel),
      empireExperience: empireExp - totalExp
    });
  }

  // Currency operations  
  async getPlayerCurrency(userId: string): Promise<any> {
    const [currency] = await db.select().from(playerCurrency).where(eq(playerCurrency.userId, userId));
    return currency || { userId, silver: 0, gold: 0, platinum: 0 };
  }

  async addCurrency(userId: string, silver: number = 0, gold: number = 0, platinum: number = 0, reason: string = "unknown"): Promise<any> {
    const current = await this.getPlayerCurrency(userId);
    const newSilver = (current.silver || 0) + silver;
    const newGold = (current.gold || 0) + gold;
    const newPlatinum = (current.platinum || 0) + platinum;

    // Log transaction
    if (silver !== 0) await db.insert(currencyTransactions).values({
      userId, currencyType: "silver", amount: silver, reason,
      balanceBefore: current.silver || 0, balanceAfter: newSilver
    });
    if (gold !== 0) await db.insert(currencyTransactions).values({
      userId, currencyType: "gold", amount: gold, reason,
      balanceBefore: current.gold || 0, balanceAfter: newGold
    });
    if (platinum !== 0) await db.insert(currencyTransactions).values({
      userId, currencyType: "platinum", amount: platinum, reason,
      balanceBefore: current.platinum || 0, balanceAfter: newPlatinum
    });

    const [updated] = await db.insert(playerCurrency).values({
      userId, silver: newSilver, gold: newGold, platinum: newPlatinum
    }).onConflictDoUpdate({
      target: playerCurrency.userId,
      set: { silver: newSilver, gold: newGold, platinum: newPlatinum }
    }).returning();
    
    return updated;
  }

  async createPlayerState(playerState: InsertPlayerState): Promise<PlayerState> {
    const boostedState = maximizePlayerState(playerState as any) as InsertPlayerState;
    const [state] = await db
      .insert(playerStates)
      .values(boostedState)
      .returning();
    return maximizePlayerState(state as any) as PlayerState;
  }

  async updatePlayerState(userId: string, updates: Partial<PlayerState>): Promise<PlayerState> {
    const boostedUpdates = maximizePlayerState({ ...(updates as any) }) as Partial<PlayerState>;

    // First-time users may not have a player_states row yet.
    // Create one on-demand so setup/save flows do not fail.
    const existing = await this.getPlayerState(userId);
    if (!existing) {
      return this.createPlayerState({
        userId,
        commander: (boostedUpdates.commander as any) || {
          race: "human",
          class: "warrior",
          stats: { level: 1, xp: 0, warfare: 0, logistics: 0, engineering: 0 },
          equipment: {},
          inventory: [],
          title: "Commander",
        },
        government: (boostedUpdates.government as any) || {
          type: "democracy",
          taxRate: 10,
          policies: [],
          stats: { stability: 50, efficiency: 70, publicSupport: 60, militaryReadiness: 50 },
        },
        ...boostedUpdates,
        updatedAt: new Date(),
      } as InsertPlayerState);
    }

    const result = await db
      .update(playerStates)
      .set({ 
        ...boostedUpdates,
        updatedAt: new Date() 
      })
      .where(eq(playerStates.userId, userId))
      .returning();
    
    if (!result || result.length === 0) {
      throw new Error(`Failed to update player state for user ${userId}`);
    }
    
    return maximizePlayerState(result[0] as any) as PlayerState;
  }

  // Mission operations
  async getMissionsByUser(userId: string): Promise<Mission[]> {
    return db.select().from(missions).where(eq(missions.userId, userId)).orderBy(desc(missions.createdAt));
  }

  async getActiveMissions(userId: string): Promise<Mission[]> {
    return db.select().from(missions)
      .where(
        and(
          eq(missions.userId, userId),
          or(eq(missions.status, "outbound"), eq(missions.status, "return"))
        )
      )
      .orderBy(asc(missions.arrivalTime));
  }

  async createMission(mission: InsertMission): Promise<Mission> {
    const [newMission] = await db.insert(missions).values(mission).returning();
    return newMission;
  }

  async updateMission(id: string, updates: Partial<Mission>): Promise<Mission> {
    const [mission] = await db
      .update(missions)
      .set(updates)
      .where(eq(missions.id, id))
      .returning();
    return mission;
  }

  async updateMissionByUser(userId: string, id: string, updates: Partial<Mission>): Promise<Mission | null> {
    const [mission] = await db
      .update(missions)
      .set(updates)
      .where(and(eq(missions.id, id), eq(missions.userId, userId)))
      .returning();
    return mission || null;
  }

  async deleteMission(id: string): Promise<void> {
    await db.delete(missions).where(eq(missions.id, id));
  }

  async deleteMissionByUser(userId: string, id: string): Promise<boolean> {
    const result = await db
      .delete(missions)
      .where(and(eq(missions.id, id), eq(missions.userId, userId)))
      .returning({ id: missions.id });
    return result.length > 0;
  }

  // Message operations
  async getMessagesByUser(userId: string, limit: number = 50): Promise<Message[]> {
    return db.select().from(messages)
      .where(eq(messages.toUserId, userId))
      .orderBy(desc(messages.timestamp))
      .limit(limit);
  }

  async getUnreadCount(userId: string): Promise<number> {
    const result = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(messages)
      .where(and(eq(messages.toUserId, userId), eq(messages.read, false)));
    return result[0]?.count || 0;
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const [newMessage] = await db.insert(messages).values(message).returning();
    return newMessage;
  }

  async markMessageAsRead(id: string): Promise<void> {
    await db.update(messages).set({ read: true }).where(eq(messages.id, id));
  }

  async markMessageAsReadByUser(userId: string, id: string): Promise<boolean> {
    const result = await db
      .update(messages)
      .set({ read: true })
      .where(and(eq(messages.id, id), eq(messages.toUserId, userId)))
      .returning({ id: messages.id });
    return result.length > 0;
  }

  async deleteMessage(id: string): Promise<void> {
    await db.delete(messages).where(eq(messages.id, id));
  }

  async deleteMessageByUser(userId: string, id: string): Promise<boolean> {
    const result = await db
      .delete(messages)
      .where(and(eq(messages.id, id), eq(messages.toUserId, userId)))
      .returning({ id: messages.id });
    return result.length > 0;
  }

  // Alliance operations
  async getAllianceById(id: string): Promise<Alliance | undefined> {
    const [alliance] = await db.select().from(alliances).where(eq(alliances.id, id));
    return alliance;
  }

  async getAllianceByTag(tag: string): Promise<Alliance | undefined> {
    const [alliance] = await db.select().from(alliances).where(eq(alliances.tag, tag));
    return alliance;
  }

  async getAllAlliances(): Promise<Alliance[]> {
    return db.select().from(alliances).orderBy(desc(alliances.createdAt));
  }

  async createAlliance(alliance: InsertAlliance): Promise<Alliance> {
    const [newAlliance] = await db.insert(alliances).values(alliance).returning();
    return newAlliance;
  }

  async updateAlliance(id: string, updates: Partial<Alliance>): Promise<Alliance> {
    const [alliance] = await db
      .update(alliances)
      .set(updates)
      .where(eq(alliances.id, id))
      .returning();
    return alliance;
  }

  // Alliance member operations
  async getAllianceMembers(allianceId: string): Promise<AllianceMember[]> {
    return db.select().from(allianceMembers).where(eq(allianceMembers.allianceId, allianceId));
  }

  async getUserAlliance(userId: string): Promise<{ alliance: Alliance, member: AllianceMember } | undefined> {
    const result = await db
      .select()
      .from(allianceMembers)
      .innerJoin(alliances, eq(allianceMembers.allianceId, alliances.id))
      .where(eq(allianceMembers.userId, userId))
      .limit(1);
    
    if (result.length === 0) return undefined;
    
    return {
      alliance: result[0].alliances,
      member: result[0].alliance_members
    };
  }

  async addAllianceMember(member: InsertAllianceMember): Promise<AllianceMember> {
    const [newMember] = await db.insert(allianceMembers).values(member).returning();
    return newMember;
  }

  async removeAllianceMember(allianceId: string, userId: string): Promise<void> {
    await db.delete(allianceMembers)
      .where(and(
        eq(allianceMembers.allianceId, allianceId),
        eq(allianceMembers.userId, userId)
      ));
  }

  async updateAllianceMember(id: string, updates: Partial<AllianceMember>): Promise<AllianceMember> {
    const [member] = await db
      .update(allianceMembers)
      .set(updates)
      .where(eq(allianceMembers.id, id))
      .returning();
    return member;
  }

  // Market operations
  async getActiveMarketOrders(limit: number = 50): Promise<MarketOrder[]> {
    return db.select().from(marketOrders)
      .where(eq(marketOrders.status, "active"))
      .orderBy(desc(marketOrders.createdAt))
      .limit(limit);
  }

  async getUserMarketOrders(userId: string): Promise<MarketOrder[]> {
    return db.select().from(marketOrders)
      .where(eq(marketOrders.userId, userId))
      .orderBy(desc(marketOrders.createdAt));
  }

  async createMarketOrder(order: InsertMarketOrder): Promise<MarketOrder> {
    const [newOrder] = await db.insert(marketOrders).values(order).returning();
    return newOrder;
  }

  async updateMarketOrder(id: string, updates: Partial<MarketOrder>): Promise<MarketOrder> {
    const [order] = await db
      .update(marketOrders)
      .set(updates)
      .where(eq(marketOrders.id, id))
      .returning();
    return order;
  }

  async deleteMarketOrder(id: string): Promise<void> {
    await db.delete(marketOrders).where(eq(marketOrders.id, id));
  }

  async deleteMarketOrderByUser(userId: string, id: string): Promise<boolean> {
    const result = await db
      .delete(marketOrders)
      .where(and(eq(marketOrders.id, id), eq(marketOrders.userId, userId)))
      .returning({ id: marketOrders.id });
    return result.length > 0;
  }

  // Queue operations
  async getUserQueue(userId: string): Promise<QueueItem[]> {
    return db.select().from(queueItems)
      .where(eq(queueItems.userId, userId))
      .orderBy(asc(queueItems.endTime));
  }

  async createQueueItem(item: InsertQueueItem): Promise<QueueItem> {
    const [newItem] = await db.insert(queueItems).values(item).returning();
    return newItem;
  }

  async deleteQueueItem(id: string): Promise<void> {
    await db.delete(queueItems).where(eq(queueItems.id, id));
  }

  // Leaderboard
  async getLeaderboard(limit: number = 100): Promise<Array<{ user: User, state: PlayerState, points: number }>> {
    const result = await db
      .select()
      .from(playerStates)
      .innerJoin(users, eq(playerStates.userId, users.id))
      .orderBy(desc(sql`
        COALESCE((${playerStates.resources}->>'metal')::numeric, 0) + 
        COALESCE((${playerStates.resources}->>'crystal')::numeric, 0) * 2 + 
        COALESCE((${playerStates.resources}->>'deuterium')::numeric, 0) * 3
      `))
      .limit(limit);
    
    return result.map(row => ({
      user: row.users,
      state: row.player_states,
      points: Math.floor(
        (row.player_states.resources as any).metal + 
        (row.player_states.resources as any).crystal * 2 + 
        (row.player_states.resources as any).deuterium * 3
      )
    }));
  }
  
  // Colony operations
  async getPlayerColonies(userId: string): Promise<PlayerColony[]> {
    return await db.select().from(playerColonies).where(eq(playerColonies.playerId, userId));
  }
  
  async createPlayerColony(colony: any): Promise<PlayerColony> {
    const [newColony] = await db.insert(playerColonies).values(colony).returning();
    return newColony;
  }
  
  // Starbase operations
  async getPlayerStarbases(userId: string): Promise<Starbase[]> {
    return await db.select().from(starbases).where(eq(starbases.playerId, userId));
  }
  
  async getStarbaseById(id: string): Promise<Starbase | undefined> {
    const [starbase] = await db.select().from(starbases).where(eq(starbases.id, id));
    return starbase;
  }
  
  async createStarbase(starbase: InsertStarbase): Promise<Starbase> {
    const [newStarbase] = await db.insert(starbases).values(starbase).returning();
    return newStarbase;
  }
  
  async updateStarbase(id: string, updates: Partial<Starbase>): Promise<Starbase> {
    const [updated] = await db.update(starbases).set(updates).where(eq(starbases.id, id)).returning();
    return updated;
  }
  
  async deleteStarbase(id: string): Promise<void> {
    await db.delete(starbases).where(eq(starbases.id, id));
  }
  
  // Moon Base operations
  async getPlayerMoonBases(userId: string): Promise<MoonBase[]> {
    return await db.select().from(moonBases).where(eq(moonBases.playerId, userId));
  }
  
  async getMoonBaseById(id: string): Promise<MoonBase | undefined> {
    const [moonBase] = await db.select().from(moonBases).where(eq(moonBases.id, id));
    return moonBase;
  }
  
  async createMoonBase(moonBase: InsertMoonBase): Promise<MoonBase> {
    const [newMoonBase] = await db.insert(moonBases).values(moonBase).returning();
    return newMoonBase;
  }
  
  async updateMoonBase(id: string, updates: Partial<MoonBase>): Promise<MoonBase> {
    const [updated] = await db.update(moonBases).set(updates).where(eq(moonBases.id, id)).returning();
    return updated;
  }
  
  async deleteMoonBase(id: string): Promise<void> {
    await db.delete(moonBases).where(eq(moonBases.id, id));
  }
  
  // Player Profile operations
  async getPlayerProfile(userId: string): Promise<PlayerProfile | undefined> {
    const [profile] = await db.select().from(playerProfiles).where(eq(playerProfiles.userId, userId));
    return profile;
  }
  
  async getPlayerProfileByUid(uid: string): Promise<PlayerProfile | undefined> {
    const [profile] = await db.select().from(playerProfiles).where(eq(playerProfiles.uid, uid));
    return profile;
  }
  
  async createPlayerProfile(profile: InsertPlayerProfile): Promise<PlayerProfile> {
    const [newProfile] = await db.insert(playerProfiles).values(profile).returning();
    return newProfile;
  }
  
  async updatePlayerProfile(userId: string, updates: Partial<PlayerProfile>): Promise<PlayerProfile> {
    const [updated] = await db.update(playerProfiles).set(updates).where(eq(playerProfiles.userId, userId)).returning();
    return updated;
  }
  
  // Mega Structure operations
  async getPlayerMegaStructures(userId: string): Promise<MegaStructure[]> {
    return await db.select().from(megaStructures).where(eq(megaStructures.playerId, userId));
  }
  
  async getMegaStructureById(id: string): Promise<MegaStructure | undefined> {
    const [structure] = await db.select().from(megaStructures).where(eq(megaStructures.id, id));
    return structure;
  }
  
  async createMegaStructure(structure: InsertMegaStructure): Promise<MegaStructure> {
    const [newStructure] = await db.insert(megaStructures).values(structure).returning();
    return newStructure;
  }
  
  async updateMegaStructure(id: string, updates: Partial<MegaStructure>): Promise<MegaStructure> {
    const [updated] = await db.update(megaStructures).set(updates).where(eq(megaStructures.id, id)).returning();
    return updated;
  }
  
  async deleteMegaStructure(id: string): Promise<void> {
    await db.delete(megaStructures).where(eq(megaStructures.id, id));
  }
  
  // Empire Difficulty operations
  async getEmpireDifficulty(userId: string): Promise<EmpireDifficulty | undefined> {
    const [difficulty] = await db.select().from(empireDifficulties).where(eq(empireDifficulties.playerId, userId));
    return difficulty;
  }
  
  async createEmpireDifficulty(difficulty: InsertEmpireDifficulty): Promise<EmpireDifficulty> {
    const [newDifficulty] = await db.insert(empireDifficulties).values(difficulty).returning();
    return newDifficulty;
  }
  
  async updateEmpireDifficulty(userId: string, updates: Partial<EmpireDifficulty>): Promise<EmpireDifficulty> {
    const [updated] = await db.update(empireDifficulties).set(updates).where(eq(empireDifficulties.playerId, userId)).returning();
    return updated;
  }
  
  async setDifficultyLevel(userId: string, level: number, kardashevLevel: number = 1): Promise<EmpireDifficulty> {
    const existing = await this.getEmpireDifficulty(userId);
    
    if (existing) {
      return this.updateEmpireDifficulty(userId, {
        difficultyLevel: level,
        kardashevLevel: kardashevLevel
      });
    }
    
    return this.createEmpireDifficulty({
      playerId: userId,
      difficultyLevel: level,
      kardashevLevel: kardashevLevel,
      resourceMultiplier: 1.0,
      researchMultiplier: 1.0,
      combatMultiplier: 1.0,
      scalingFactor: 1.0,
      difficultyMultiplier: 1.0
    } as InsertEmpireDifficulty);
  }
  
  // Story Campaign operations
  async getStoryCampaign(userId: string): Promise<StoryCampaign | undefined> {
    const [campaign] = await db.select().from(storyCampaigns).where(eq(storyCampaigns.playerId, userId));
    return campaign;
  }
  
  async createStoryCampaign(campaign: InsertStoryCampaign): Promise<StoryCampaign> {
    const [newCampaign] = await db.insert(storyCampaigns).values(campaign).returning();
    return newCampaign;
  }
  
  async updateStoryCampaign(userId: string, updates: Partial<StoryCampaign>): Promise<StoryCampaign> {
    const [updated] = await db.update(storyCampaigns).set(updates).where(eq(storyCampaigns.playerId, userId)).returning();
    return updated;
  }
  
  // Story Mission operations
  async getStoryMission(missionId: string): Promise<StoryMission | undefined> {
    const [mission] = await db.select().from(storyMissions).where(eq(storyMissions.id, missionId));
    return mission;
  }
  
  async getUserStoryMissions(userId: string): Promise<StoryMission[]> {
    return await db.select().from(storyMissions).where(eq(storyMissions.playerId, userId));
  }
  
  async createStoryMission(mission: InsertStoryMission): Promise<StoryMission> {
    const [newMission] = await db.insert(storyMissions).values(mission).returning();
    return newMission;
  }
  
  async completeStoryMission(missionId: string, userId: string): Promise<StoryMission> {
    const [completed] = await db.update(storyMissions)
      .set({ isCompleted: true, completedAt: new Date() })
      .where(and(eq(storyMissions.id, missionId), eq(storyMissions.playerId, userId)))
      .returning();
    return completed;
  }
  
  // Achievement operations
  async getUserAchievements(userId: string): Promise<Achievement[]> {
    return await db.select().from(achievements).where(eq(achievements.playerId, userId));
  }
  
  async getAchievementByIdForUser(userId: string, achievementId: string): Promise<Achievement | undefined> {
    const [achievement] = await db.select().from(achievements)
      .where(and(eq(achievements.playerId, userId), eq(achievements.achievementId, achievementId)));
    return achievement;
  }
  
  async createAchievement(achievement: InsertAchievement): Promise<Achievement> {
    const [newAchievement] = await db.insert(achievements).values(achievement).returning();
    return newAchievement;
  }
  
  async updateAchievementProgress(achievementId: string, userId: string, progress: number): Promise<Achievement> {
    const existing = await db.select().from(achievements).where(and(eq(achievements.achievementId, achievementId), eq(achievements.playerId, userId)));
    const target = existing[0]?.target || 100;
    const [updated] = await db.update(achievements)
      .set({ progress, isCompleted: progress >= target })
      .where(and(eq(achievements.achievementId, achievementId), eq(achievements.playerId, userId)))
      .returning();
    return updated;
  }
  
  // Element Buff operations
  async getActiveBuffs(userId: string, missionId?: string): Promise<ElementBuff[]> {
    if (missionId) {
      return await db.select().from(elementBuffs)
        .where(and(eq(elementBuffs.playerId, userId), eq(elementBuffs.missionId, missionId), eq(elementBuffs.isActive, true)));
    }
    return await db.select().from(elementBuffs)
      .where(and(eq(elementBuffs.playerId, userId), eq(elementBuffs.isActive, true)));
  }
  
  async createElementBuff(buff: InsertElementBuff): Promise<ElementBuff> {
    const [newBuff] = await db.insert(elementBuffs).values(buff).returning();
    return newBuff;
  }
  
  // NPC Faction operations
  async getPlayerFactions(userId: string): Promise<NPCFaction[]> {
    return await db.select().from(npcFactions).where(eq(npcFactions.playerId, userId));
  }
  
  async getPlayerFactionStanding(userId: string, factionId: string): Promise<NPCFaction | undefined> {
    const [standing] = await db.select().from(npcFactions)
      .where(and(eq(npcFactions.playerId, userId), eq(npcFactions.factionId, factionId)));
    return standing;
  }
  
  async createFactionStanding(standing: InsertNPCFaction): Promise<NPCFaction> {
    const [newStanding] = await db.insert(npcFactions).values(standing).returning();
    return newStanding;
  }
  
  async updateReputation(userId: string, factionId: string, delta: number): Promise<NPCFaction> {
    const current = await this.getPlayerFactionStanding(userId, factionId);
    if (!current) {
      throw new Error("Faction standing not found");
    }
    
    const newRep = Math.max(-1000, Math.min(1000, (current.reputation || 0) + delta));
    let standing = "neutral";
    if (newRep < -500) standing = "hostile";
    else if (newRep < -100) standing = "unfriendly";
    else if (newRep < 100) standing = "neutral";
    else if (newRep < 300) standing = "friendly";
    else if (newRep < 600) standing = "honored";
    else standing = "exalted";
    
    const [updated] = await db.update(npcFactions)
      .set({ reputation: newRep, standing, lastInteraction: new Date() })
      .where(and(eq(npcFactions.playerId, userId), eq(npcFactions.factionId, factionId)))
      .returning();
    return updated;
  }
  
  // NPC Vendor operations
  async getAllVendors(): Promise<NPCVendor[]> {
    return await db.select().from(npcVendors);
  }
  
  async getVendorsByFaction(factionId: string): Promise<NPCVendor[]> {
    return await db.select().from(npcVendors).where(eq(npcVendors.factionId, factionId));
  }
  
  async getVendorInventory(vendorId: string): Promise<any[]> {
    const [vendor] = await db.select().from(npcVendors).where(eq(npcVendors.vendorId, vendorId));
    return (vendor?.inventory as any[]) || [];
  }
  
  // Relic operations
  async getAllRelics(): Promise<Relic[]> {
    return await db.select().from(relics);
  }
  
  async getPlayerRelics(userId: string): Promise<Relic[]> {
    return await db.select().from(relics).where(and(eq(relics.playerId, userId), eq(relics.isOwned, true)));
  }
  
  async getPlayerRelicInventory(userId: string): Promise<RelicInventory[]> {
    return await db.select().from(relicInventory).where(eq(relicInventory.playerId, userId));
  }
  
  async acquireRelic(userId: string, relicId: string): Promise<RelicInventory> {
    const [item] = await db.insert(relicInventory).values({
      playerId: userId,
      relicId: relicId,
    }).returning();
    return item;
  }
  
  async equipRelic(userId: string, relicId: string, slot: string): Promise<RelicInventory> {
    const [equipped] = await db.update(relicInventory)
      .set({ isEquipped: true, slot })
      .where(and(eq(relicInventory.playerId, userId), eq(relicInventory.relicId, relicId)))
      .returning();
    return equipped;
  }
  
  // Friends operations (50 max per player)
  async getPlayerFriends(userId: string): Promise<Friend[]> {
    return await db.select().from(friends).where(
      and(
        eq(friends.playerId, userId),
        eq(friends.friendshipStatus, "accepted")
      )
    );
  }
  
  async getFriendsCount(userId: string): Promise<number> {
    const result = await db.select({ count: sql`count(*)` }).from(friends).where(
      and(
        eq(friends.playerId, userId),
        eq(friends.friendshipStatus, "accepted")
      )
    );
    return result[0]?.count as number || 0;
  }
  
  async addFriend(playerId: string, friendId: string, message?: string): Promise<FriendRequest> {
    // Check if max friends reached (50)
    const friendCount = await this.getFriendsCount(playerId);
    if (friendCount >= 50) {
      throw new Error("Maximum friends list size reached (50)");
    }
    
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
    const [request] = await db.insert(friendRequests).values({
      senderId: playerId,
      receiverId: friendId,
      message,
      expiresAt,
    }).returning();
    return request;
  }
  
  async acceptFriendRequest(requestId: string): Promise<Friend> {
    const request = await db.select().from(friendRequests).where(eq(friendRequests.id, requestId)).then(r => r[0]);
    if (!request) throw new Error("Friend request not found");
    
    // Update request status
    await db.update(friendRequests)
      .set({ status: "accepted", respondedAt: new Date() })
      .where(eq(friendRequests.id, requestId));
    
    // Create friendship
    const [friendship] = await db.insert(friends).values({
      playerId: request.receiverId,
      friendId: request.senderId,
      friendshipStatus: "accepted",
      acceptedAt: new Date(),
    }).returning();
    return friendship;
  }
  
  async rejectFriendRequest(requestId: string): Promise<FriendRequest> {
    const [updated] = await db.update(friendRequests)
      .set({ status: "rejected", respondedAt: new Date() })
      .where(eq(friendRequests.id, requestId))
      .returning();
    return updated;
  }
  
  async removeFriend(playerId: string, friendId: string): Promise<void> {
    await db.delete(friends).where(
      and(
        eq(friends.playerId, playerId),
        eq(friends.friendId, friendId)
      )
    );
  }
  
  async getPlayerFriendRequests(userId: string): Promise<FriendRequest[]> {
    return await db.select().from(friendRequests).where(
      and(
        eq(friendRequests.receiverId, userId),
        eq(friendRequests.status, "pending")
      )
    );
  }
  
  async setFavorite(playerId: string, friendId: string, isFavorite: boolean): Promise<Friend> {
    const [updated] = await db.update(friends)
      .set({ isFavorite })
      .where(and(eq(friends.playerId, playerId), eq(friends.friendId, friendId)))
      .returning();
    return updated;
  }
  
  async updateFriendNickname(playerId: string, friendId: string, nickname: string): Promise<Friend> {
    const [updated] = await db.update(friends)
      .set({ nickname })
      .where(and(eq(friends.playerId, playerId), eq(friends.friendId, friendId)))
      .returning();
    return updated;
  }
  
  // Guild operations
  async createGuild(guild: InsertGuild): Promise<Guild> {
    const [newGuild] = await db.insert(guilds).values(guild).returning();
    return newGuild;
  }
  
  async getGuildById(guildId: string): Promise<Guild | undefined> {
    const [guild] = await db.select().from(guilds).where(eq(guilds.id, guildId));
    return guild;
  }
  
  async getPlayerGuild(userId: string): Promise<Guild | undefined> {
    const [member] = await db.select().from(guildMembers).where(eq(guildMembers.playerId, userId));
    if (!member) return undefined;
    return this.getGuildById(member.guildId);
  }
  
  async updateGuild(guildId: string, updates: Partial<Guild>): Promise<Guild> {
    const [updated] = await db.update(guilds).set(updates).where(eq(guilds.id, guildId)).returning();
    return updated;
  }
  
  async deleteGuild(guildId: string): Promise<void> {
    await db.delete(guilds).where(eq(guilds.id, guildId));
  }
  
  async addGuildMember(guildId: string, playerId: string): Promise<GuildMember> {
    const [member] = await db.insert(guildMembers).values({ guildId, playerId }).returning();
    return member;
  }
  
  async removeGuildMember(guildId: string, playerId: string): Promise<void> {
    await db.delete(guildMembers).where(and(eq(guildMembers.guildId, guildId), eq(guildMembers.playerId, playerId)));
  }
  
  async getGuildMembers(guildId: string): Promise<GuildMember[]> {
    return await db.select().from(guildMembers).where(eq(guildMembers.guildId, guildId));
  }
  
  async updateGuildMemberRole(guildId: string, playerId: string, role: string): Promise<GuildMember> {
    const [updated] = await db.update(guildMembers).set({ role }).where(and(eq(guildMembers.guildId, guildId), eq(guildMembers.playerId, playerId))).returning();
    return updated;
  }
  
  // Team operations (6 players max)
  async createTeam(team: InsertTeam): Promise<Team> {
    const [newTeam] = await db.insert(teams).values(team).returning();
    return newTeam;
  }
  
  async getTeamById(teamId: string): Promise<Team | undefined> {
    const [team] = await db.select().from(teams).where(eq(teams.id, teamId));
    return team;
  }
  
  async getPlayerTeams(userId: string): Promise<Team[]> {
    return await db.select().from(teams).where(sql`${userId} = ANY(members)`);
  }
  
  async updateTeam(teamId: string, updates: Partial<Team>): Promise<Team> {
    const [updated] = await db.update(teams).set(updates).where(eq(teams.id, teamId)).returning();
    return updated;
  }
  
  async deleteTeam(teamId: string): Promise<void> {
    await db.delete(teams).where(eq(teams.id, teamId));
  }
  
  async addTeamMember(teamId: string, playerId: string): Promise<Team> {
    const team = await this.getTeamById(teamId);
    if (!team) throw new Error("Team not found");
    if ((team.members as any[]).length >= 6) throw new Error("Team is full (6 max)");
    const [updated] = await db.update(teams).set({ members: sql`array_append(members, ${playerId})` }).where(eq(teams.id, teamId)).returning();
    return updated;
  }
  
  async removeTeamMember(teamId: string, playerId: string): Promise<Team> {
    const [updated] = await db.update(teams).set({ members: sql`array_remove(members, ${playerId})` }).where(eq(teams.id, teamId)).returning();
    return updated;
  }
  
  async getTeamMembers(teamId: string): Promise<any[]> {
    const team = await this.getTeamById(teamId);
    return (team?.members as any[]) || [];
  }
  
  // Raid operations
  async createRaid(raid: InsertRaid): Promise<Raid> {
    const [newRaid] = await db.insert(raids).values(raid).returning();
    return newRaid;
  }
  
  async getRaidById(raidId: string): Promise<Raid | undefined> {
    const [raid] = await db.select().from(raids).where(eq(raids.id, raidId));
    return raid;
  }
  
  async updateRaidStatus(raidId: string, status: string, result?: string): Promise<Raid> {
    const updates: any = { status };
    if (result) updates.result = result;
    if (status === "completed") updates.endedAt = new Date();
    const [updated] = await db.update(raids).set(updates).where(eq(raids.id, raidId)).returning();
    return updated;
  }
  
  async getTeamRaids(teamId: string): Promise<Raid[]> {
    return await db.select().from(raids).where(or(eq(raids.attackingTeamId, teamId), eq(raids.defendingTeamId, teamId)));
  }
  
  // Raid combat operations
  async createRaidCombat(combat: InsertRaidCombat): Promise<RaidCombat> {
    const [newCombat] = await db.insert(raidCombats).values(combat).returning();
    return newCombat;
  }
  
  async completeRaidCombat(combatId: string, winner: string, log: any[]): Promise<RaidCombat> {
    const [updated] = await db.update(raidCombats).set({ winner, endedAt: new Date(), combatLog: log }).where(eq(raidCombats.id, combatId)).returning();
    return updated;
  }
  
  async getRaidCombats(raidId: string): Promise<RaidCombat[]> {
    return await db.select().from(raidCombats).where(eq(raidCombats.raidId, raidId));
  }
  
  // Combat stats operations
  async getCombatStats(userId: string): Promise<CombatStats | undefined> {
    const [stats] = await db.select().from(combatStats).where(eq(combatStats.playerId, userId));
    return stats;
  }
  
  async createCombatStats(stats: InsertCombatStats): Promise<CombatStats> {
    const [newStats] = await db.insert(combatStats).values(stats).returning();
    return newStats;
  }
  
  async updateCombatStats(userId: string, updates: Partial<CombatStats>): Promise<CombatStats> {
    const [updated] = await db.update(combatStats).set(updates).where(eq(combatStats.playerId, userId)).returning();
    return updated;
  }
  
  // Universe events operations
  async createUniverseEvent(event: InsertUniverseEvent): Promise<UniverseEvent> {
    const [created] = await db.insert(universeEvents).values(event).returning();
    return created;
  }
  
  async getUniverseEvent(eventId: string): Promise<UniverseEvent | undefined> {
    const [event] = await db.select().from(universeEvents).where(eq(universeEvents.id, eventId));
    return event;
  }
  
  async getActiveEvents(): Promise<UniverseEvent[]> {
    return await db.select().from(universeEvents).where(eq(universeEvents.status, "active"));
  }
  
  async updateEventStatus(eventId: string, status: string): Promise<UniverseEvent> {
    const [updated] = await db.update(universeEvents).set({ status }).where(eq(universeEvents.id, eventId)).returning();
    return updated;
  }
  
  // Universe bosses operations (90 bosses)
  async getAllBosses(): Promise<UniverseBoss[]> {
    return await db.select().from(universeBosses);
  }
  
  async getBossById(bossId: string): Promise<UniverseBoss | undefined> {
    const [boss] = await db.select().from(universeBosses).where(eq(universeBosses.id, bossId));
    return boss;
  }
  
  async getBossesByRarity(rarity: string): Promise<UniverseBoss[]> {
    return await db.select().from(universeBosses).where(eq(universeBosses.rarity, rarity));
  }
  
  // Boss encounters operations
  async createBossEncounter(encounter: InsertBossEncounter): Promise<BossEncounter> {
    const [created] = await db.insert(bossEncounters).values(encounter).returning();
    return created;
  }
  
  async getBossEncounter(encounterId: string): Promise<BossEncounter | undefined> {
    const [encounter] = await db.select().from(bossEncounters).where(eq(bossEncounters.id, encounterId));
    return encounter;
  }
  
  async updateEncounterStatus(encounterId: string, status: string): Promise<BossEncounter> {
    const [updated] = await db.update(bossEncounters).set({ status }).where(eq(bossEncounters.id, encounterId)).returning();
    return updated;
  }
  
  async addEncounterParticipant(encounterId: string, playerId: string): Promise<BossEncounter> {
    const encounter = await this.getBossEncounter(encounterId);
    if (!encounter) throw new Error("Encounter not found");
    const members = (encounter.participants as any[]) || [];
    if (!members.includes(playerId)) members.push(playerId);
    const [updated] = await db.update(bossEncounters).set({ participants: members, participantCount: members.length }).where(eq(bossEncounters.id, encounterId)).returning();
    return updated;
  }
  
  // Raid groups operations
  async createRaidGroup(group: InsertRaidGroup): Promise<RaidGroup> {
    const [created] = await db.insert(raidGroups).values(group).returning();
    return created;
  }
  
  async getRaidGroup(groupId: string): Promise<RaidGroup | undefined> {
    const [group] = await db.select().from(raidGroups).where(eq(raidGroups.id, groupId));
    return group;
  }
  
  async getPlayerRaidGroups(playerId: string): Promise<RaidGroup[]> {
    return await db.select().from(raidGroups).where(sql`${playerId} = ANY(members)`);
  }
  
  async addGroupMember(groupId: string, playerId: string): Promise<RaidGroup> {
    const group = await this.getRaidGroup(groupId);
    if (!group) throw new Error("Group not found");
    const members = (group.members || []) as string[];
    if (members.length >= (group.maxMembers || 0)) throw new Error("Raid group is full");
    if (!members.includes(playerId)) members.push(playerId);
    const [updated] = await db.update(raidGroups).set({ members }).where(eq(raidGroups.id, groupId)).returning();
    return updated;
  }

  async removeGroupMember(groupId: string, playerId: string): Promise<RaidGroup> {
    const group = await this.getRaidGroup(groupId);
    if (!group) throw new Error("Group not found");
    const members = ((group.members || []) as string[]).filter(m => m !== playerId);
    const [updated] = await db.update(raidGroups).set({ members }).where(eq(raidGroups.id, groupId)).returning();
    return updated;
  }
  
  // Raid finder operations
  async joinRaidFinder(finder: InsertRaidFinder): Promise<RaidFinder> {
    const [created] = await db.insert(raidFinder).values(finder).returning();
    return created;
  }
  
  async getRaidFinderQueue(limit: number = 50): Promise<RaidFinder[]> {
    return await db.select().from(raidFinder).where(eq(raidFinder.status, "queued")).limit(limit);
  }
  
  async leaveRaidFinder(finderId: string): Promise<void> {
    await db.delete(raidFinder).where(eq(raidFinder.id, finderId));
  }
  
  async updateFinderStatus(finderId: string, status: string): Promise<RaidFinder> {
    const [updated] = await db.update(raidFinder).set({ status }).where(eq(raidFinder.id, finderId)).returning();
    return updated;
  }
  
  // PvE combat logs
  async createCombatLog(log: InsertPveCombatLog): Promise<PveCombatLog> {
    const [created] = await db.insert(pveCombatLogs).values(log).returning();
    return created;
  }
  
  async getPlayerCombatLogs(playerId: string): Promise<PveCombatLog[]> {
    return await db.select().from(pveCombatLogs).where(eq(pveCombatLogs.playerId, playerId));
  }
  
  async getEventCombatLogs(eventId: string): Promise<PveCombatLog[]> {
    return await db.select().from(pveCombatLogs).where(eq(pveCombatLogs.eventId, eventId));
  }
  
  // Items operations (1000 items)
  async getAllItems(): Promise<Item[]> {
    return await db.select().from(items);
  }
  
  async getItemById(itemId: string): Promise<Item | undefined> {
    const [item] = await db.select().from(items).where(eq(items.id, itemId));
    return item;
  }
  
  async getItemsByType(itemType: string): Promise<Item[]> {
    return await db.select().from(items).where(eq(items.itemType, itemType));
  }
  
  async getItemsByClass(itemClass: string): Promise<Item[]> {
    return await db.select().from(items).where(eq(items.itemClass, itemClass));
  }
  
  async getItemsByRank(minRank: number, maxRank: number): Promise<Item[]> {
    return await db.select().from(items).where(
      and(
        sql`${items.rank} >= ${minRank}`,
        sql`${items.rank} <= ${maxRank}`
      )
    );
  }
  
  async getPlayerInventory(playerId: string): Promise<PlayerItem[]> {
    return await db.select().from(playerItems).where(eq(playerItems.playerId, playerId));
  }
  
  async addItemToInventory(playerId: string, itemId: string, quantity: number): Promise<PlayerItem> {
    const existing = await db.select().from(playerItems).where(
      and(eq(playerItems.playerId, playerId), eq(playerItems.itemId, itemId))
    ).then(r => r[0]);
    
    if (existing) {
      const [updated] = await db.update(playerItems)
        .set({ quantity: (existing.quantity || 0) + quantity })
        .where(eq(playerItems.id, existing.id))
        .returning();
      return updated;
    }
    
    const [newItem] = await db.insert(playerItems).values({ playerId, itemId, quantity }).returning();
    return newItem;
  }
  
  async removeItemFromInventory(playerId: string, itemId: string, quantity: number): Promise<void> {
    const item = await db.select().from(playerItems).where(
      and(eq(playerItems.playerId, playerId), eq(playerItems.itemId, itemId))
    ).then(r => r[0]);
    
    if (!item) throw new Error("Item not found in inventory");
    
    if ((item.quantity || 0) <= quantity) {
      await db.delete(playerItems).where(eq(playerItems.id, item.id));
    } else {
      await db.update(playerItems)
        .set({ quantity: (item.quantity || 0) - quantity })
        .where(eq(playerItems.id, item.id));
    }
  }
  
  async equipItem(playerId: string, playerItemId: string, slot: string): Promise<PlayerItem> {
    const [updated] = await db.update(playerItems)
      .set({ isEquipped: true, slot })
      .where(eq(playerItems.id, playerItemId))
      .returning();
    return updated;
  }
  
  // Resource field operations
  async getFieldsByTerritory(territoryId: string): Promise<ResourceField[]> {
    return await db.select().from(resourceFields).where(eq(resourceFields.territoryId, territoryId));
  }
  
  // Mining operations
  async getActiveMiningOperations(userId: string): Promise<any[]> {
    await this.ensureMiningOperationsTable();

    const result = await db.execute(sql`
      SELECT id, user_id, resource_type, amount_per_hour, status, started_at, ends_at, metadata, created_at
      FROM mining_operations
      WHERE user_id = ${userId}
        AND status = 'active'
        AND (ends_at IS NULL OR ends_at > now())
      ORDER BY started_at DESC
    `);

    return result.rows as any[];
  }
  
  async createMiningOperation(op: any): Promise<any> {
    await this.ensureMiningOperationsTable();

    const now = Date.now();
    const id = op.id ?? `mining_${now}_${Math.floor(Math.random() * 100000)}`;
    const startedAt = op.startedAt ? new Date(op.startedAt) : new Date();
    const endsAt = op.endsAt ? new Date(op.endsAt) : null;

    const insertResult = await db.execute(sql`
      INSERT INTO mining_operations (
        id,
        user_id,
        resource_type,
        amount_per_hour,
        status,
        started_at,
        ends_at,
        metadata
      ) VALUES (
        ${id},
        ${String(op.userId)},
        ${String(op.resourceType ?? "metal")},
        ${Number(op.amountPerHour ?? 0)},
        ${String(op.status ?? "active")},
        ${startedAt},
        ${endsAt},
        ${op.metadata ?? {}}
      )
      RETURNING id, user_id, resource_type, amount_per_hour, status, started_at, ends_at, metadata, created_at
    `);

    return (insertResult.rows?.[0] as any) ?? {
      id,
      userId: op.userId,
      resourceType: op.resourceType ?? "metal",
      amountPerHour: Number(op.amountPerHour ?? 0),
      status: op.status ?? "active",
      startedAt,
      endsAt,
      metadata: op.metadata ?? {},
    };
  }
  
  // Durability operations
  async getEquipmentDurability(userId: string, equipmentId: string): Promise<EquipmentDurability | undefined> {
    const [durability] = await db
      .select()
      .from(equipmentDurability)
      .where(and(eq(equipmentDurability.playerId, userId), eq(equipmentDurability.equipmentId, equipmentId)));
    return durability;
  }
  
  async getFleetDurability(userId: string, fleetId: string): Promise<FleetDurability | undefined> {
    const [durability] = await db
      .select()
      .from(fleetDurability)
      .where(and(eq(fleetDurability.playerId, userId), eq(fleetDurability.fleetId, fleetId)));
    return durability;
  }
  
  async getBuildingDurability(userId: string, buildingId: string): Promise<BuildingDurability | undefined> {
    const [durability] = await db
      .select()
      .from(buildingDurability)
      .where(and(eq(buildingDurability.playerId, userId), eq(buildingDurability.buildingId, buildingId)));
    return durability;
  }
  
  // Admin operations
  async getAdminUser(userId: string): Promise<AdminUser | undefined> {
    const [adminUser] = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.userId, userId));
    return adminUser;
  }

  // Research operations
  async getResearchAreas(): Promise<any[]> {
    return await db.select().from(researchAreas);
  }

  async getResearchSubcategories(areaId: string): Promise<any[]> {
    return await db.select().from(researchSubcategories).where(eq(researchSubcategories.areaId, areaId));
  }

  async getResearchTechnologies(subcategoryIds: string[]): Promise<any[]> {
    if (subcategoryIds.length === 0) return [];
    return await db.select().from(researchTechnologies).where(inArray(researchTechnologies.subcategoryId, subcategoryIds));
  }

  async getPlayerResearchProgress(userId: string): Promise<any[]> {
    return await db.select().from(playerResearchProgress).where(eq(playerResearchProgress.userId, userId));
  }

  async upsertPlayerResearch(userId: string, technologyId: string, status: string, progress: number): Promise<any> {
    const [result] = await db
      .insert(playerResearchProgress)
      .values({ userId, technologyId, status, progress })
      .onConflictDoUpdate({
        target: [playerResearchProgress.userId, playerResearchProgress.technologyId],
        set: { status, progress, updatedAt: new Date() }
      })
      .returning();
    return result;
  }

  // Expedition operations
  async getExpeditions(userId: string): Promise<any[]> {
    return await db.select().from(expeditions).where(eq(expeditions.userId, userId)).orderBy(desc(expeditions.createdAt));
  }

  async createExpedition(userId: string, name: string, type: string, targetCoords: string, fleetComposition: any, troopComposition: any): Promise<any> {
    const [result] = await db
      .insert(expeditions)
      .values({
        userId,
        name,
        type,
        targetCoords,
        status: "preparing"
      })
      .returning();
    return result;
  }

  async updateExpedition(expeditionId: string, updates: any): Promise<any> {
    const [result] = await db
      .update(expeditions)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(expeditions.id, expeditionId))
      .returning();
    return result;
  }

  async getExpeditionTeams(expeditionId: string): Promise<any[]> {
    return await db.select().from(expeditionTeams).where(eq(expeditionTeams.expeditionId, expeditionId));
  }

  async addExpeditionMember(expeditionId: string, unitId: string, role: string): Promise<any> {
    const [result] = await db
      .insert(expeditionTeams)
      .values({ expeditionId, unitId, role })
      .returning();
    return result;
  }

  async getExpeditionEncounters(expeditionId: string): Promise<any[]> {
    return await db.select().from(expeditionEncounters).where(eq(expeditionEncounters.expeditionId, expeditionId));
  }

  async addEncounter(expeditionId: string, encounterType: string, description: string, rewards: any): Promise<any> {
    const [result] = await db
      .insert(expeditionEncounters)
      .values({ expeditionId, encounterType, description, rewards })
      .returning();
    return result;
  }

  // Turn operations - 6 turns per minute with offline accrual
  async accrueAndGetTurns(userId: string): Promise<{ currentTurns: number; totalTurns: number; turnsAccrued: number; lastTurnUpdate: Date }> {
    const TURNS_PER_MINUTE = 6;
    const MAX_CURRENT_TURNS = 1000;
    const MAX_OFFLINE_HOURS = 24;
    const now = new Date();
    
    // Get current player state
    let playerState = await this.getPlayerState(userId);
    
    if (!playerState) {
      // Create new player state with starting turns
      playerState = await this.createPlayerState({
        userId,
        resources: { metal: 1000, crystal: 500, deuterium: 0, energy: 0, credits: 1000, food: 500, water: 500 },
        commander: { race: "human", class: "warrior", stats: { level: 1, xp: 0 }, equipment: {}, inventory: [] },
        government: { type: "democracy", taxRate: 10, policies: [], stats: { stability: 50, efficiency: 70, publicSupport: 60, militaryReadiness: 50 } },
        currentTurns: 50,
        totalTurns: 50,
        lastTurnUpdate: now
      });
      return {
        currentTurns: 50,
        totalTurns: 50,
        turnsAccrued: 0,
        lastTurnUpdate: now
      };
    }
    
    const lastUpdate = playerState.lastTurnUpdate || now;
    const deltaMs = now.getTime() - new Date(lastUpdate).getTime();
    const deltaMinutes = Math.min(deltaMs / 60000, MAX_OFFLINE_HOURS * 60);
    
    // Calculate turns earned (6 per minute)
    const turnsEarned = Math.floor(deltaMinutes * TURNS_PER_MINUTE);
    
    if (turnsEarned > 0) {
      const currentTurns = playerState.currentTurns || 0;
      const totalTurns = playerState.totalTurns || 0;
      
      // Cap current turns at maximum
      const newCurrentTurns = Math.min(currentTurns + turnsEarned, MAX_CURRENT_TURNS);
      const actualAccrued = newCurrentTurns - currentTurns;
      const newTotalTurns = totalTurns + actualAccrued;
      
      // Update player state
      await this.updatePlayerState(userId, {
        currentTurns: newCurrentTurns,
        totalTurns: newTotalTurns,
        lastTurnUpdate: now
      });
      
      return {
        currentTurns: newCurrentTurns,
        totalTurns: newTotalTurns,
        turnsAccrued: actualAccrued,
        lastTurnUpdate: now
      };
    }
    
    return {
      currentTurns: playerState.currentTurns || 0,
      totalTurns: playerState.totalTurns || 0,
      turnsAccrued: 0,
      lastTurnUpdate: now
    };
  }

  async spendTurns(userId: string, amount: number): Promise<{ success: boolean; currentTurns: number; totalTurns: number }> {
    if (amount <= 0) {
      const state = await this.getPlayerState(userId);
      return {
        success: false,
        currentTurns: state?.currentTurns || 0,
        totalTurns: state?.totalTurns || 0
      };
    }
    
    // First accrue any pending turns
    const accrued = await this.accrueAndGetTurns(userId);
    
    if (accrued.currentTurns < amount) {
      return {
        success: false,
        currentTurns: accrued.currentTurns,
        totalTurns: accrued.totalTurns
      };
    }
    
    // Spend the turns atomically
    const [result] = await db
      .update(playerStates)
      .set({
        currentTurns: sql`${playerStates.currentTurns} - ${amount}`,
        lastTurnUpdate: new Date()
      })
      .where(
        and(
          eq(playerStates.userId, userId),
          sql`${playerStates.currentTurns} >= ${amount}`
        )
      )
      .returning();
    
    if (!result) {
      return {
        success: false,
        currentTurns: accrued.currentTurns,
        totalTurns: accrued.totalTurns
      };
    }
    
    return {
      success: true,
      currentTurns: result.currentTurns || 0,
      totalTurns: result.totalTurns || 0
    };
  }

  // Auction operations
  async getActiveAuctions(filters?: { itemType?: string; search?: string; sortBy?: string }): Promise<AuctionListing[]> {
    let query = db.select().from(auctionListings)
      .where(
        and(
          eq(auctionListings.status, "active"),
          sql`${auctionListings.expiresAt} > NOW()`
        )
      );
    
    const results = await query;
    
    let filtered = results;
    if (filters?.itemType && filters.itemType !== "all") {
      filtered = filtered.filter(a => a.itemType === filters.itemType);
    }
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(a => 
        a.itemName.toLowerCase().includes(searchLower) ||
        (a.itemDescription?.toLowerCase().includes(searchLower))
      );
    }
    
    if (filters?.sortBy === "price_low") {
      filtered.sort((a, b) => (a.currentBid || a.startingPrice) - (b.currentBid || b.startingPrice));
    } else if (filters?.sortBy === "price_high") {
      filtered.sort((a, b) => (b.currentBid || b.startingPrice) - (a.currentBid || a.startingPrice));
    } else if (filters?.sortBy === "ending_soon") {
      filtered.sort((a, b) => new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime());
    } else {
      filtered.sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
    }
    
    return filtered;
  }

  async getAuctionById(id: string): Promise<AuctionListing | undefined> {
    const [result] = await db.select().from(auctionListings).where(eq(auctionListings.id, id));
    return result;
  }

  async getUserAuctions(userId: string): Promise<AuctionListing[]> {
    return await db.select().from(auctionListings)
      .where(eq(auctionListings.sellerId, userId))
      .orderBy(desc(auctionListings.createdAt));
  }

  async getUserBids(userId: string): Promise<AuctionListing[]> {
    return await db.select().from(auctionListings)
      .where(
        and(
          eq(auctionListings.currentBidderId, userId),
          eq(auctionListings.status, "active")
        )
      )
      .orderBy(desc(auctionListings.expiresAt));
  }

  async createAuction(auction: InsertAuctionListing): Promise<AuctionListing> {
    const [result] = await db.insert(auctionListings).values(auction).returning();
    return result;
  }

  async placeBid(auctionId: string, bidderId: string, bidderName: string, bidAmount: number): Promise<{ success: boolean; auction?: AuctionListing; error?: string }> {
    const auction = await this.getAuctionById(auctionId);
    
    if (!auction) {
      return { success: false, error: "Auction not found" };
    }
    
    if (auction.status !== "active") {
      return { success: false, error: "Auction is no longer active" };
    }
    
    if (new Date(auction.expiresAt) < new Date()) {
      return { success: false, error: "Auction has expired" };
    }
    
    if (auction.sellerId === bidderId) {
      return { success: false, error: "You cannot bid on your own auction" };
    }
    
    const minBid = (auction.currentBid || auction.startingPrice) + auction.bidIncrement;
    if (bidAmount < minBid) {
      return { success: false, error: `Minimum bid is ${minBid}` };
    }
    
    // Record bid history
    await db.insert(auctionBids).values({
      auctionId,
      bidderId,
      bidderName,
      bidAmount
    });
    
    // Update auction
    const [updated] = await db.update(auctionListings)
      .set({
        currentBid: bidAmount,
        currentBidderId: bidderId,
        currentBidderName: bidderName,
        bidCount: sql`${auctionListings.bidCount} + 1`
      })
      .where(eq(auctionListings.id, auctionId))
      .returning();
    
    return { success: true, auction: updated };
  }

  async buyoutAuction(auctionId: string, buyerId: string, buyerName: string): Promise<{ success: boolean; auction?: AuctionListing; error?: string }> {
    const auction = await this.getAuctionById(auctionId);
    
    if (!auction) {
      return { success: false, error: "Auction not found" };
    }
    
    if (auction.status !== "active") {
      return { success: false, error: "Auction is no longer active" };
    }
    
    if (!auction.buyoutPrice) {
      return { success: false, error: "This auction does not have a buyout option" };
    }
    
    if (auction.sellerId === buyerId) {
      return { success: false, error: "You cannot buy your own auction" };
    }
    
    // Complete the auction
    const [updated] = await db.update(auctionListings)
      .set({
        status: "sold",
        currentBid: auction.buyoutPrice,
        currentBidderId: buyerId,
        currentBidderName: buyerName,
        completedAt: new Date()
      })
      .where(eq(auctionListings.id, auctionId))
      .returning();
    
    return { success: true, auction: updated };
  }

  async cancelAuction(auctionId: string, sellerId: string): Promise<{ success: boolean; error?: string }> {
    const auction = await this.getAuctionById(auctionId);
    
    if (!auction) {
      return { success: false, error: "Auction not found" };
    }
    
    if (auction.sellerId !== sellerId) {
      return { success: false, error: "You can only cancel your own auctions" };
    }
    
    if (auction.status !== "active") {
      return { success: false, error: "Auction is no longer active" };
    }
    
    if (auction.bidCount > 0) {
      return { success: false, error: "Cannot cancel auction with bids" };
    }
    
    await db.update(auctionListings)
      .set({ status: "cancelled", completedAt: new Date() })
      .where(eq(auctionListings.id, auctionId));
    
    return { success: true };
  }

  async completeExpiredAuctions(): Promise<AuctionListing[]> {
    const now = new Date();
    
    // Find expired active auctions
    const expired = await db.select().from(auctionListings)
      .where(
        and(
          eq(auctionListings.status, "active"),
          sql`${auctionListings.expiresAt} <= ${now}`
        )
      );
    
    const completed: AuctionListing[] = [];
    
    for (const auction of expired) {
      const newStatus = auction.bidCount > 0 ? "sold" : "expired";
      const [updated] = await db.update(auctionListings)
        .set({ status: newStatus, completedAt: now })
        .where(eq(auctionListings.id, auction.id))
        .returning();
      completed.push(updated);
    }
    
    return completed;
  }

  async getAuctionBidHistory(auctionId: string): Promise<AuctionBid[]> {
    return await db.select().from(auctionBids)
      .where(eq(auctionBids.auctionId, auctionId))
      .orderBy(desc(auctionBids.createdAt));
  }

  // Trade operations (mail-integrated player-to-player trading)
  async getTradeOffers(userId: string): Promise<TradeOffer[]> {
    return await db.select().from(tradeOffers)
      .where(
        or(
          eq(tradeOffers.senderId, userId),
          eq(tradeOffers.receiverId, userId)
        )
      )
      .orderBy(desc(tradeOffers.createdAt));
  }

  async getTradeOfferById(id: string): Promise<TradeOffer | undefined> {
    const [offer] = await db.select().from(tradeOffers).where(eq(tradeOffers.id, id));
    return offer;
  }

  async getIncomingTradeOffers(userId: string): Promise<TradeOffer[]> {
    return await db.select().from(tradeOffers)
      .where(
        and(
          eq(tradeOffers.receiverId, userId),
          eq(tradeOffers.status, "pending")
        )
      )
      .orderBy(desc(tradeOffers.createdAt));
  }

  async getOutgoingTradeOffers(userId: string): Promise<TradeOffer[]> {
    return await db.select().from(tradeOffers)
      .where(
        and(
          eq(tradeOffers.senderId, userId),
          eq(tradeOffers.status, "pending")
        )
      )
      .orderBy(desc(tradeOffers.createdAt));
  }

  async createTradeOffer(offer: InsertTradeOffer): Promise<TradeOffer> {
    // Set expiration to 7 days from now if not specified
    const expiresAt = offer.expiresAt || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    
    const [tradeOffer] = await db.insert(tradeOffers)
      .values({ ...offer, expiresAt })
      .returning();
    
    // Create a message for the receiver
    await db.insert(messages).values({
      fromUserId: offer.senderId,
      toUserId: offer.receiverId,
      from: offer.senderName,
      to: offer.receiverName,
      subject: `Trade Offer from ${offer.senderName}`,
      body: offer.message || `${offer.senderName} has sent you a trade offer. Check your trade inbox to review it.`,
      type: "trade"
    });
    
    return tradeOffer;
  }

  async acceptTradeOffer(tradeId: string, receiverId: string): Promise<{ success: boolean; trade?: TradeOffer; error?: string }> {
    const trade = await this.getTradeOfferById(tradeId);
    
    if (!trade) {
      return { success: false, error: "Trade offer not found" };
    }
    
    if (trade.receiverId !== receiverId) {
      return { success: false, error: "You can only accept trades sent to you" };
    }
    
    if (trade.status !== "pending") {
      return { success: false, error: "This trade offer is no longer pending" };
    }
    
    if (trade.expiresAt && new Date(trade.expiresAt) < new Date()) {
      await db.update(tradeOffers).set({ status: "expired" }).where(eq(tradeOffers.id, tradeId));
      return { success: false, error: "This trade offer has expired" };
    }
    
    // Get both player states
    const senderState = await this.getPlayerState(trade.senderId);
    const receiverState = await this.getPlayerState(receiverId);
    
    if (!senderState || !receiverState) {
      return { success: false, error: "Player state not found" };
    }
    
    const senderResources = senderState.resources as any;
    const receiverResources = receiverState.resources as any;
    
    // Check if sender has enough resources
    if (senderResources.metal < trade.offerMetal ||
        senderResources.crystal < trade.offerCrystal ||
        senderResources.deuterium < trade.offerDeuterium) {
      return { success: false, error: "Sender does not have enough resources" };
    }
    
    // Check if receiver has enough resources
    if (receiverResources.metal < trade.requestMetal ||
        receiverResources.crystal < trade.requestCrystal ||
        receiverResources.deuterium < trade.requestDeuterium) {
      return { success: false, error: "You do not have enough resources to complete this trade" };
    }
    
    // Update sender resources (subtract offered, add requested)
    await this.updatePlayerState(trade.senderId, {
      resources: {
        ...senderResources,
        metal: senderResources.metal - trade.offerMetal + trade.requestMetal,
        crystal: senderResources.crystal - trade.offerCrystal + trade.requestCrystal,
        deuterium: senderResources.deuterium - trade.offerDeuterium + trade.requestDeuterium
      }
    });
    
    // Update receiver resources (add offered, subtract requested)
    await this.updatePlayerState(receiverId, {
      resources: {
        ...receiverResources,
        metal: receiverResources.metal + trade.offerMetal - trade.requestMetal,
        crystal: receiverResources.crystal + trade.offerCrystal - trade.requestCrystal,
        deuterium: receiverResources.deuterium + trade.offerDeuterium - trade.requestDeuterium
      }
    });
    
    // Update trade status
    const [updated] = await db.update(tradeOffers)
      .set({ status: "accepted", completedAt: new Date() })
      .where(eq(tradeOffers.id, tradeId))
      .returning();
    
    // Record trade history
    await db.insert(tradeHistory).values({
      tradeOfferId: tradeId,
      senderId: trade.senderId,
      senderName: trade.senderName,
      receiverId: trade.receiverId,
      receiverName: trade.receiverName,
      senderGave: { metal: trade.offerMetal, crystal: trade.offerCrystal, deuterium: trade.offerDeuterium },
      receiverGave: { metal: trade.requestMetal, crystal: trade.requestCrystal, deuterium: trade.requestDeuterium },
      result: "completed"
    });
    
    // Send confirmation messages
    await db.insert(messages).values({
      fromUserId: receiverId,
      toUserId: trade.senderId,
      from: trade.receiverName,
      to: trade.senderName,
      subject: `Trade Accepted!`,
      body: `${trade.receiverName} has accepted your trade offer. Resources have been exchanged.`,
      type: "trade"
    });
    
    return { success: true, trade: updated };
  }

  async declineTradeOffer(tradeId: string, receiverId: string): Promise<{ success: boolean; error?: string }> {
    const trade = await this.getTradeOfferById(tradeId);
    
    if (!trade) {
      return { success: false, error: "Trade offer not found" };
    }
    
    if (trade.receiverId !== receiverId) {
      return { success: false, error: "You can only decline trades sent to you" };
    }
    
    if (trade.status !== "pending") {
      return { success: false, error: "This trade offer is no longer pending" };
    }
    
    await db.update(tradeOffers)
      .set({ status: "declined", completedAt: new Date() })
      .where(eq(tradeOffers.id, tradeId));
    
    // Notify sender
    await db.insert(messages).values({
      fromUserId: receiverId,
      toUserId: trade.senderId,
      from: trade.receiverName,
      to: trade.senderName,
      subject: `Trade Declined`,
      body: `${trade.receiverName} has declined your trade offer.`,
      type: "trade"
    });
    
    return { success: true };
  }

  async cancelTradeOffer(tradeId: string, senderId: string): Promise<{ success: boolean; error?: string }> {
    const trade = await this.getTradeOfferById(tradeId);
    
    if (!trade) {
      return { success: false, error: "Trade offer not found" };
    }
    
    if (trade.senderId !== senderId) {
      return { success: false, error: "You can only cancel your own trades" };
    }
    
    if (trade.status !== "pending") {
      return { success: false, error: "This trade offer is no longer pending" };
    }
    
    await db.update(tradeOffers)
      .set({ status: "cancelled", completedAt: new Date() })
      .where(eq(tradeOffers.id, tradeId));
    
    return { success: true };
  }

  async counterTradeOffer(originalTradeId: string, counterOffer: InsertTradeOffer): Promise<{ success: boolean; trade?: TradeOffer; error?: string }> {
    const originalTrade = await this.getTradeOfferById(originalTradeId);
    
    if (!originalTrade) {
      return { success: false, error: "Original trade offer not found" };
    }
    
    if (originalTrade.receiverId !== counterOffer.senderId) {
      return { success: false, error: "You can only counter trades sent to you" };
    }
    
    // Decline the original offer
    await db.update(tradeOffers)
      .set({ status: "countered", completedAt: new Date() })
      .where(eq(tradeOffers.id, originalTradeId));
    
    // Create new counter offer
    const [newTrade] = await db.insert(tradeOffers)
      .values({
        ...counterOffer,
        originalOfferId: originalTradeId,
        expiresAt: counterOffer.expiresAt || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      })
      .returning();
    
    // Notify original sender
    await db.insert(messages).values({
      fromUserId: counterOffer.senderId,
      toUserId: counterOffer.receiverId,
      from: counterOffer.senderName,
      to: counterOffer.receiverName,
      subject: `Counter Offer from ${counterOffer.senderName}`,
      body: counterOffer.message || `${counterOffer.senderName} has made a counter offer to your trade. Check your trade inbox to review it.`,
      type: "trade"
    });
    
    return { success: true, trade: newTrade };
  }

  async getTradeHistory(userId: string): Promise<TradeHistory[]> {
    return await db.select().from(tradeHistory)
      .where(
        or(
          eq(tradeHistory.senderId, userId),
          eq(tradeHistory.receiverId, userId)
        )
      )
      .orderBy(desc(tradeHistory.completedAt));
  }

  // System Settings operations
  async getSetting(key: string): Promise<SystemSettings | undefined> {
    const [setting] = await db.select().from(systemSettings).where(eq(systemSettings.key, key));
    return setting;
  }

  async getAllSettings(): Promise<SystemSettings[]> {
    return await db.select().from(systemSettings);
  }

  async setSetting(key: string, value: any, description?: string, category?: string): Promise<SystemSettings> {
    const [setting] = await db
      .insert(systemSettings)
      .values({ key, value, description, category })
      .onConflictDoUpdate({
        target: systemSettings.key,
        set: { value, description, category }
      })
      .returning();
    return setting;
  }

  async seedDefaultSettings(): Promise<void> {
    const defaults = [
      { key: "game_speed", value: { turnsPerMinute: 6, resourceProductionRate: 1.0, researchSpeedMultiplier: 1.0 }, category: "game", description: "Game speed multipliers" },
      { key: "resource_prices", value: { metal: 1, crystal: 1.5, deuterium: 2.0 }, category: "economy", description: "Resource market prices" },
      { key: "starting_resources", value: { metal: 1000, crystal: 500, deuterium: 0, energy: 0, credits: 1000, food: 500, water: 500 }, category: "economy", description: "New player starting resources" },
      { key: "player_limits", value: { maxFleets: 10, maxMissions: 50, maxAlliances: 1 }, category: "gameplay", description: "Player action limits" },
      { key: "turn_system", value: { turnsPerMinute: 6, offlineAccumulationCap: 24, maxCurrentTurns: 1000 }, category: "gameplay", description: "Turn system config" },
      { key: "combat_enabled", value: true, category: "gameplay", description: "Enable combat system" },
      { key: "alliance_enabled", value: true, category: "gameplay", description: "Enable alliance system" },
      { key: "trading_enabled", value: true, category: "gameplay", description: "Enable trading" },
      { key: "auction_enabled", value: true, category: "economy", description: "Enable auction house" },
      { key: "maintenance_mode", value: false, category: "system", description: "Maintenance mode status" },
      { key: "server_message", value: "", category: "system", description: "Server announcement" },
      { key: "rate_limit_login", value: { attempts: 5, windowMs: 900000 }, category: "security", description: "Login rate limits" },
      { key: "rate_limit_api", value: { requestsPerMinute: 60 }, category: "security", description: "API rate limits" },
      { key: "database_version", value: "1", category: "system", description: "Schema version" }
    ];

    for (const setting of defaults) {
      await this.setSetting(setting.key, setting.value, setting.description, setting.category);
    }
  }

  // Bank operations
  async getBankAccount(userId: string): Promise<any> {
    const [account] = await db.select().from(bankAccounts).where(eq(bankAccounts.userId, userId));
    if (!account) {
      const [newAccount] = await db.insert(bankAccounts).values({ userId }).returning();
      return newAccount;
    }
    return account;
  }

  async depositToBankAccount(userId: string, amount: number): Promise<any> {
    const account = await this.getBankAccount(userId);
    const newBalance = (account.accountBalance || 0) + amount;
    await db.insert(bankTransactions).values({
      userId, accountId: account.id, transactionType: "deposit", amount,
      balanceBefore: account.accountBalance || 0, balanceAfter: newBalance, description: `Deposit: +${amount}`
    });
    const [updated] = await db.update(bankAccounts).set({ accountBalance: newBalance, updatedAt: new Date() }).where(eq(bankAccounts.id, account.id)).returning();
    return updated;
  }

  async withdrawFromBankAccount(userId: string, amount: number): Promise<any> {
    const account = await this.getBankAccount(userId);
    const currentBalance = Number(account.accountBalance || 0);

    if (amount <= 0) {
      throw new Error("Invalid amount");
    }

    if (currentBalance < amount) {
      throw new Error("Insufficient bank balance");
    }

    const newBalance = currentBalance - amount;

    await db.insert(bankTransactions).values({
      userId,
      accountId: account.id,
      transactionType: "withdraw",
      amount,
      balanceBefore: currentBalance,
      balanceAfter: newBalance,
      description: `Withdrawal: -${amount}`,
    });

    const [updated] = await db
      .update(bankAccounts)
      .set({ accountBalance: newBalance, updatedAt: new Date() })
      .where(eq(bankAccounts.id, account.id))
      .returning();

    return updated;
  }

  // Empire value
  async calculateEmpireValue(userId: string): Promise<any> {
    const state = await this.getPlayerState(userId);
    const currency = await this.getPlayerCurrency(userId);
    const resources = (state?.resources as any) || {};
    const resourceValue = (resources.metal || 0) + (resources.crystal || 0) * 1.5 + (resources.deuterium || 0) * 2;
    const currencyValue = (currency?.silver || 0) + (currency?.gold || 0) * 100 + (currency?.platinum || 0) * 10000;
    const totalValue = resourceValue + currencyValue;
    const [updated] = await db.insert(empireValues).values({ userId, resourceValue, currencyValue, totalValue }).onConflictDoUpdate({ target: empireValues.userId, set: { resourceValue, currencyValue, totalValue } }).returning();
    return updated;
  }

  async getEmpireRankings(): Promise<any[]> {
    return db.select().from(empireValues).orderBy(desc(empireValues.totalValue)).limit(100);
  }
}
export const storage = new DatabaseStorage();
