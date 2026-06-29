/**
 * Shared API Types for Universe Empire Dominion
 * Used by both client and server for type safety
 */

// ============================================================================
// AUTHENTICATION TYPES
// ============================================================================

export interface RegisterRequest {
  username: string;
  password: string;
  email?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  userId: string;
  username: string;
  token?: string;
}

// ============================================================================
// USER TYPES
// ============================================================================

export interface User {
  id: string;
  username: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  username: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
}

// ============================================================================
// PLAYER STATE TYPES
// ============================================================================

export interface Resources {
  metal: number;
  crystal: number;
  deuterium: number;
  energy: number;
}

export interface Buildings {
  [buildingId: string]: number;
}

export interface Research {
  [techId: string]: number;
}

export interface PlayerState {
  id: string;
  userId: string;
  setupComplete: boolean;
  planetName: string;
  coordinates: string;
  resources: Resources;
  buildings: Buildings;
  research: Research;
  tier: number;
  tierExperience: number;
  empireLevel: number;
  empireExperience: number;
  [key: string]: any;
}

// ============================================================================
// BUILDING TYPES
// ============================================================================

export interface BuildingInfo {
  id: string;
  name: string;
  description: string;
  category: string;
  level: number;
  maxLevel: number;
  cost: Resources;
  production?: Partial<Resources>;
  buildTime: number;
  requirements?: Record<string, number>;
}

export interface BuildRequest {
  buildingId: string;
  level?: number;
}

export interface BuildQueueItem {
  id: string;
  buildingId: string;
  level: number;
  startTime: string;
  endTime: string;
  cost: Resources;
}

// ============================================================================
// RESEARCH TYPES
// ============================================================================

export interface Technology {
  id: string;
  name: string;
  description: string;
  category: string;
  level: number;
  maxLevel: number;
  cost: Resources;
  researchTime: number;
  requirements?: Record<string, number>;
  bonuses?: TechBonus[];
}

export interface TechBonus {
  type: string;
  value: number;
  target?: string;
}

export interface ResearchQueueItem {
  id: string;
  techId: string;
  level: number;
  startTime: string;
  endTime: string;
  progress: number;
  priority: 'low' | 'normal' | 'high';
}

export interface StartResearchRequest {
  techId: string;
  priority?: 'low' | 'normal' | 'high';
}

// ============================================================================
// FLEET TYPES
// ============================================================================

export interface Ship {
  id: string;
  type: string;
  name: string;
  stats: ShipStats;
  cost: Resources;
}

export interface ShipStats {
  attack: number;
  defense: number;
  speed: number;
  cargo: number;
  fuel: number;
}

export interface Fleet {
  id: string;
  name: string;
  ownerId: string;
  ships: Record<string, number>;
  location: string;
  destination?: string;
  status: 'idle' | 'moving' | 'combat' | 'returning';
  mission?: string;
}

export interface CreateFleetRequest {
  name: string;
  ships: Record<string, number>;
  destination?: string;
}

// ============================================================================
// MISSION TYPES
// ============================================================================

export interface Mission {
  id: string;
  userId: string;
  type: 'attack' | 'transport' | 'colonize' | 'spy' | 'defend';
  status: 'pending' | 'active' | 'completed' | 'failed';
  targetCoordinates: string;
  fleetId?: string;
  resources?: Resources;
  startTime: string;
  endTime?: string;
  result?: MissionResult;
}

export interface MissionResult {
  success: boolean;
  rewards?: Resources;
  losses?: Record<string, number>;
  report: string;
}

export interface CreateMissionRequest {
  type: 'attack' | 'transport' | 'colonize' | 'spy' | 'defend';
  targetCoordinates: string;
  fleetId?: string;
  resources?: Resources;
}

// ============================================================================
// COMBAT TYPES
// ============================================================================

export interface CombatFormation {
  name: string;
  bonus: number;
  offense: number;
  defense: number;
}

export interface Battle {
  id: string;
  attackerId: string;
  defenderId: string;
  location: string;
  startTime: string;
  endTime?: string;
  status: 'pending' | 'active' | 'completed';
  result?: BattleResult;
}

export interface BattleResult {
  winner: 'attacker' | 'defender' | 'draw';
  attackerLosses: Record<string, number>;
  defenderLosses: Record<string, number>;
  loot?: Resources;
  report: string;
}

export interface SimulateCombatRequest {
  attacker: CombatSide;
  defender: CombatSide;
}

export interface CombatSide {
  ships: Record<string, number>;
  formation?: string;
  bonuses?: number[];
}

// ============================================================================
// ALLIANCE TYPES
// ============================================================================

export interface Alliance {
  id: string;
  name: string;
  tag: string;
  description?: string;
  leaderId: string;
  memberCount: number;
  level: number;
  createdAt: string;
}

export interface AllianceMember {
  userId: string;
  username: string;
  role: 'leader' | 'officer' | 'member';
  joinedAt: string;
  contribution: number;
}

export interface CreateAllianceRequest {
  name: string;
  tag: string;
  description?: string;
}

// ============================================================================
// MARKET TYPES
// ============================================================================

export interface MarketOrder {
  id: string;
  sellerId: string;
  sellerName: string;
  resource: string;
  quantity: number;
  price: number;
  type: 'buy' | 'sell';
  status: 'active' | 'completed' | 'cancelled';
  createdAt: string;
  expiresAt?: string;
}

export interface CreateOrderRequest {
  resource: string;
  quantity: number;
  price: number;
  type: 'buy' | 'sell';
}

// ============================================================================
// CURRENCY TYPES
// ============================================================================

export interface Currency {
  silver: number;
  gold: number;
  platinum: number;
}

export interface CurrencyTransaction {
  id: string;
  userId: string;
  type: 'earn' | 'spend' | 'transfer';
  amount: number;
  currency: 'silver' | 'gold' | 'platinum';
  reason: string;
  createdAt: string;
}

export interface AddCurrencyRequest {
  silver?: number;
  gold?: number;
  platinum?: number;
  reason?: string;
}

// ============================================================================
// BANK TYPES
// ============================================================================

export interface BankAccount {
  userId: string;
  accountBalance: number;
  totalDeposited: number;
  updatedAt: string;
}

export interface BankTransaction {
  id: string;
  userId: string;
  transactionType: 'deposit' | 'withdrawal';
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  createdAt: string;
}

// ============================================================================
// EMPIRE TYPES
// ============================================================================

export interface EmpireValue {
  userId: string;
  resourceValue: number;
  currencyValue: number;
  totalValue: number;
  calculatedAt: string;
}

export interface EmpireRanking {
  userId: string;
  username: string;
  totalValue: number;
  rank: number;
}

// ============================================================================
// PROGRESSION TYPES
// ============================================================================

export interface TierProgress {
  tier: number;
  tierExperience: number;
  nextTierAt: number;
}

export interface EmpireProgress {
  empireLevel: number;
  empireExperience: number;
  nextLevelAt: number;
}

// ============================================================================
// EXPEDITION TYPES
// ============================================================================

export interface Expedition {
  id: string;
  leaderId: string;
  name: string;
  type: 'exploration' | 'mining' | 'combat' | 'research';
  status: 'preparing' | 'active' | 'completed' | 'failed';
  targetCoordinates: string;
  fleetComposition: Record<string, number>;
  troopComposition: Record<string, number>;
  startedAt: string;
  completedAt?: string;
  discoveries: any[];
  casualties: Record<string, number>;
}

export interface CreateExpeditionRequest {
  name: string;
  type: 'exploration' | 'mining' | 'combat' | 'research';
  targetCoordinates: string;
  fleetComposition: Record<string, number>;
  troopComposition: Record<string, number>;
}

// ============================================================================
// GALAXY TYPES
// ============================================================================

export interface StarSystem {
  id: string;
  name: string;
  coordinates: string;
  type: string;
  planets: Planet[];
  owner?: string;
}

export interface Planet {
  id: string;
  name: string;
  type: string;
  size: number;
  temperature: number;
  resources: Resources;
  owner?: string;
}

// ============================================================================
// INVENTORY TYPES
// ============================================================================

export interface InventoryItem {
  id: string;
  playerId: string;
  itemId: string;
  itemName: string;
  itemType: string;
  quantity: number;
  rarity: string;
  metadata?: any;
}

// ============================================================================
// AUCTION TYPES
// ============================================================================

export interface AuctionListing {
  id: string;
  sellerId: string;
  sellerName: string;
  itemType: string;
  itemId: string;
  itemName: string;
  itemDescription?: string;
  itemRarity: string;
  quantity: number;
  startingPrice: number;
  buyoutPrice?: number;
  currentBid: number;
  currentBidderId?: string;
  currentBidderName?: string;
  bidCount: number;
  bidIncrement: number;
  duration: number;
  status: 'active' | 'sold' | 'expired' | 'cancelled';
  createdAt: string;
  expiresAt: string;
  completedAt?: string;
}

export interface AuctionBid {
  id: string;
  auctionId: string;
  bidderId: string;
  bidderName: string;
  bidAmount: number;
  createdAt: string;
}

export interface CreateAuctionRequest {
  itemType: string;
  itemId: string;
  itemName: string;
  itemDescription?: string;
  itemRarity?: string;
  quantity: number;
  startingPrice: number;
  buyoutPrice?: number;
  bidIncrement?: number;
  duration: number;
}

// ============================================================================
// STATUS TYPES
// ============================================================================

export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  uptime: number;
  timestamp: string;
  version: string;
}

export interface SystemMetrics {
  cpu: {
    usage: number;
    uptime: number;
  };
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  database: {
    connections: number;
    maxConnections: number;
    activeQueries: number;
    cacheHitRate: number;
  };
  requests: {
    totalRequests: number;
    requestsPerSecond: number;
    averageResponseTime: number;
    p95ResponseTime: number;
    p99ResponseTime: number;
  };
}

// ============================================================================
// PAGINATION TYPES
// ============================================================================

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// ============================================================================
// FILTER TYPES
// ============================================================================

export interface FilterParams {
  search?: string;
  category?: string;
  type?: string;
  status?: string;
  minValue?: number;
  maxValue?: number;
  dateFrom?: string;
  dateTo?: string;
}

// Made with Bob
