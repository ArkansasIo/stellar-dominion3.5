export type RelationshipType = "hostile" | "unfriendly" | "neutral" | "friendly" | "allied" | "war";

export type DiplomaticAction =
  | "send_tribute"
  | "propose_trade_route"
  | "declare_war"
  | "sign_peace"
  | "form_alliance"
  | "break_alliance"
  | "spy_operation"
  | "demand_submission"
  | "non_aggression_pact"
  | "joint_venture";

export type TradeRouteType = "resource_only" | "tech_sharing" | "military_cooperation" | "full_partnership";

export type EspionageMission = "intelligence" | "sabotage" | "steal_tech" | "plant_agent";

export type AgentTier = "recruit" | "operative" | "shadow_master";

export interface DiplomaticActionConfig {
  id: DiplomaticAction;
  name: string;
  description: string;
  costs: { credits: number; metal: number; crystal: number; deuterium: number };
  cooldownMinutes: number;
  requiredRelationship?: RelationshipType;
  minReputation?: number;
}

export interface TradeRouteLevel {
  level: number;
  name: string;
  incomeMultiplier: number;
  maxDistance: number;
  capacityBonus: number;
  setupCost: { credits: number; metal: number; crystal: number };
  maintenancePerTurn: { credits: number };
}

export interface TradeRouteConfig {
  type: TradeRouteType;
  name: string;
  description: string;
  bonusMultiplier: number;
  requiredLevel: number;
  techSharingBonus?: number;
  militaryBonus?: number;
}

export interface EspionageAgentTier {
  tier: AgentTier;
  name: string;
  description: string;
  baseSuccessRate: number;
  stealthRating: number;
  trainingCost: { credits: number; metal: number; crystal: number };
  trainingTimeMinutes: number;
  maxConcurrentMissions: number;
}

export interface EspionageMissionConfig {
  mission: EspionageMission;
  name: string;
  description: string;
  baseCost: { credits: number; metal: number; crystal: number };
  durationMinutes: number;
  detectionRisk: number;
  requiredAgentTier: AgentTier;
}

export interface FactionDiplomacyBonus {
  relationship: RelationshipType;
  tradeDiscount: number;
  tributeMultiplier: number;
  intelAccuracy: number;
  warWearinessReduction: number;
  description: string;
}

export interface DiplomaticHistoryEntry {
  id: string;
  fromPlayerId: string;
  fromPlayerName: string;
  toPlayerId: string;
  toPlayerName: string;
  action: DiplomaticAction;
  timestamp: string;
  details: string;
  reputationChange: number;
}

export interface ReputationTier {
  minReputation: number;
  maxReputation: number;
  name: string;
  title: string;
  description: string;
  bonuses: { tradeEfficiency: number; diplomaticInfluence: number; espionageDefense: number };
}

export const RELATIONSHIP_TYPES: Record<RelationshipType, { name: string; color: string; icon: string; description: string }> = {
  war: { name: "At War", color: "red", icon: "Swords", description: "Open military conflict" },
  hostile: { name: "Hostile", color: "orange", icon: "AlertTriangle", description: "Active tensions and provocations" },
  unfriendly: { name: "Unfriendly", color: "amber", icon: "Minus", description: "Cool diplomatic relations" },
  neutral: { name: "Neutral", color: "slate", icon: "Circle", description: "Standard diplomatic standing" },
  friendly: { name: "Friendly", color: "blue", icon: "ThumbsUp", description: "Positive diplomatic relations" },
  allied: { name: "Allied", color: "green", icon: "Handshake", description: "Formal alliance partnership" },
};

export const RELATIONSHIP_THRESHOLDS: Record<RelationshipType, { min: number; max: number }> = {
  war: { min: -100, max: -60 },
  hostile: { min: -60, max: -20 },
  unfriendly: { min: -20, max: 0 },
  neutral: { min: 0, max: 20 },
  friendly: { min: 20, max: 60 },
  allied: { min: 60, max: 100 },
};

export const DIPLOMATIC_ACTIONS: DiplomaticActionConfig[] = [
  { id: "send_tribute", name: "Send Tribute", description: "Offer resources to improve relations", costs: { credits: 5000, metal: 2000, crystal: 1000, deuterium: 500 }, cooldownMinutes: 60, minReputation: 0 },
  { id: "propose_trade_route", name: "Propose Trade Route", description: "Establish a mutual trade agreement", costs: { credits: 3000, metal: 1500, crystal: 800, deuterium: 200 }, cooldownMinutes: 120, requiredRelationship: "neutral" },
  { id: "declare_war", name: "Declare War", description: "Begin open military hostilities", costs: { credits: 10000, metal: 5000, crystal: 2500, deuterium: 1000 }, cooldownMinutes: 480, minReputation: 20 },
  { id: "sign_peace", name: "Sign Peace Treaty", description: "Propose ending hostilities", costs: { credits: 8000, metal: 1000, crystal: 500, deuterium: 200 }, cooldownMinutes: 240, requiredRelationship: "war" },
  { id: "form_alliance", name: "Form Alliance", description: "Propose a formal alliance partnership", costs: { credits: 20000, metal: 8000, crystal: 4000, deuterium: 2000 }, cooldownMinutes: 720, requiredRelationship: "friendly", minReputation: 40 },
  { id: "break_alliance", name: "Break Alliance", description: "Dissolve an existing alliance", costs: { credits: 5000, metal: 1000, crystal: 500, deuterium: 100 }, cooldownMinutes: 1440, requiredRelationship: "allied" },
  { id: "spy_operation", name: "Spy Operation", description: "Deploy espionage agents for intelligence", costs: { credits: 4000, metal: 1000, crystal: 500, deuterium: 300 }, cooldownMinutes: 90 },
  { id: "demand_submission", name: "Demand Submission", description: "Demand tribute and subservience", costs: { credits: 2000, metal: 500, crystal: 250, deuterium: 100 }, cooldownMinutes: 180, minReputation: 30 },
  { id: "non_aggression_pact", name: "Non-Aggression Pact", description: "Mutual agreement to avoid conflict", costs: { credits: 6000, metal: 2000, crystal: 1000, deuterium: 400 }, cooldownMinutes: 360, requiredRelationship: "unfriendly" },
  { id: "joint_venture", name: "Joint Venture", description: "Collaborate on a shared project", costs: { credits: 15000, metal: 6000, crystal: 3000, deuterium: 1500 }, cooldownMinutes: 600, requiredRelationship: "friendly", minReputation: 50 },
];

export const TRADE_ROUTE_LEVELS: TradeRouteLevel[] = [
  { level: 1, name: "Basic", incomeMultiplier: 1.0, maxDistance: 50, capacityBonus: 0, setupCost: { credits: 2000, metal: 1000, crystal: 500 }, maintenancePerTurn: { credits: 100 } },
  { level: 2, name: "Standard", incomeMultiplier: 1.3, maxDistance: 80, capacityBonus: 10, setupCost: { credits: 5000, metal: 2500, crystal: 1200 }, maintenancePerTurn: { credits: 250 } },
  { level: 3, name: "Advanced", incomeMultiplier: 1.7, maxDistance: 120, capacityBonus: 25, setupCost: { credits: 10000, metal: 5000, crystal: 2500 }, maintenancePerTurn: { credits: 500 } },
  { level: 4, name: "Premium", incomeMultiplier: 2.2, maxDistance: 180, capacityBonus: 40, setupCost: { credits: 20000, metal: 10000, crystal: 5000 }, maintenancePerTurn: { credits: 1000 } },
  { level: 5, name: "Galactic", incomeMultiplier: 3.0, maxDistance: 300, capacityBonus: 60, setupCost: { credits: 50000, metal: 25000, crystal: 12500 }, maintenancePerTurn: { credits: 2500 } },
];

export const TRADE_ROUTE_TYPES: TradeRouteConfig[] = [
  { type: "resource_only", name: "Resource Exchange", description: "Basic resource trading between empires", bonusMultiplier: 1.0, requiredLevel: 1 },
  { type: "tech_sharing", name: "Technology Sharing", description: "Exchange research data and blueprints", bonusMultiplier: 1.2, requiredLevel: 2, techSharingBonus: 15 },
  { type: "military_cooperation", name: "Military Cooperation", description: "Shared defensive pacts and fleet support", bonusMultiplier: 1.5, requiredLevel: 3, militaryBonus: 20 },
  { type: "full_partnership", name: "Full Partnership", description: "Complete economic and military integration", bonusMultiplier: 2.0, requiredLevel: 4, techSharingBonus: 25, militaryBonus: 30 },
];

export const ESPIONAGE_AGENT_TIERS: EspionageAgentTier[] = [
  { tier: "recruit", name: "Recruit", description: "Novice agent with basic training", baseSuccessRate: 45, stealthRating: 30, trainingCost: { credits: 1000, metal: 500, crystal: 250 }, trainingTimeMinutes: 30, maxConcurrentMissions: 1 },
  { tier: "operative", name: "Operative", description: "Experienced agent with advanced skills", baseSuccessRate: 65, stealthRating: 60, trainingCost: { credits: 5000, metal: 2500, crystal: 1200 }, trainingTimeMinutes: 120, maxConcurrentMissions: 2 },
  { tier: "shadow_master", name: "Shadow Master", description: "Elite agent with unmatched expertise", baseSuccessRate: 85, stealthRating: 90, trainingCost: { credits: 20000, metal: 10000, crystal: 5000 }, trainingTimeMinutes: 480, maxConcurrentMissions: 3 },
];

export const ESPIONAGE_MISSIONS: EspionageMissionConfig[] = [
  { mission: "intelligence", name: "Gather Intelligence", description: "Collect information on target empire", baseCost: { credits: 2000, metal: 500, crystal: 250 }, durationMinutes: 60, detectionRisk: 15, requiredAgentTier: "recruit" },
  { mission: "sabotage", name: "Sabotage Operations", description: "Disrupt target production and defenses", baseCost: { credits: 8000, metal: 3000, crystal: 1500 }, durationMinutes: 180, detectionRisk: 40, requiredAgentTier: "operative" },
  { mission: "steal_tech", name: "Steal Technology", description: "Extract research data and blueprints", baseCost: { credits: 15000, metal: 5000, crystal: 2500 }, durationMinutes: 300, detectionRisk: 55, requiredAgentTier: "operative" },
  { mission: "plant_agent", name: "Plant Deep Cover Agent", description: "Embed a long-term mole in target empire", baseCost: { credits: 30000, metal: 10000, crystal: 5000 }, durationMinutes: 600, detectionRisk: 70, requiredAgentTier: "shadow_master" },
];

export const FACTION_DIPLOMACY_BONUSES: Record<RelationshipType, FactionDiplomacyBonus> = {
  war: { relationship: "war", tradeDiscount: 0, tributeMultiplier: 0, intelAccuracy: 50, warWearinessReduction: 0, description: "No trade or tribute possible" },
  hostile: { relationship: "hostile", tradeDiscount: 0, tributeMultiplier: 0.5, intelAccuracy: 60, warWearinessReduction: 0, description: "Severely limited interactions" },
  unfriendly: { relationship: "unfriendly", tradeDiscount: 0.9, tributeMultiplier: 0.75, intelAccuracy: 70, warWearinessReduction: 5, description: "Limited trade at inflated prices" },
  neutral: { relationship: "neutral", tradeDiscount: 1.0, tributeMultiplier: 1.0, intelAccuracy: 80, warWearinessReduction: 10, description: "Standard diplomatic terms" },
  friendly: { relationship: "friendly", tradeDiscount: 0.85, tributeMultiplier: 1.25, intelAccuracy: 90, warWearinessReduction: 20, description: "Favorable trade rates" },
  allied: { relationship: "allied", tradeDiscount: 0.7, tributeMultiplier: 1.5, intelAccuracy: 95, warWearinessReduction: 35, description: "Best possible diplomatic terms" },
};

export const REPUTATION_TIERS: ReputationTier[] = [
  { minReputation: 0, maxReputation: 19, name: "Unknown", title: "Unproven", description: "New to the galactic stage", bonuses: { tradeEfficiency: 0.9, diplomaticInfluence: 0.8, espionageDefense: 0.7 } },
  { minReputation: 20, maxReputation: 39, name: "Emerging", title: "Rising Power", description: "Building a reputation among peers", bonuses: { tradeEfficiency: 1.0, diplomaticInfluence: 1.0, espionageDefense: 0.85 } },
  { minReputation: 40, maxReputation: 59, name: "Established", title: "Recognized Empire", description: "Respected in galactic affairs", bonuses: { tradeEfficiency: 1.1, diplomaticInfluence: 1.15, espionageDefense: 1.0 } },
  { minReputation: 60, maxReputation: 79, name: "Influential", title: "Power Player", description: "Significant diplomatic weight", bonuses: { tradeEfficiency: 1.2, diplomaticInfluence: 1.3, espionageDefense: 1.15 } },
  { minReputation: 80, maxReputation: 100, name: "Dominant", title: "Galactic Leader", description: "Unmatched diplomatic standing", bonuses: { tradeEfficiency: 1.35, diplomaticInfluence: 1.5, espionageDefense: 1.3 } },
];

export const REPUTATION_CHANGES: Record<DiplomaticAction, number> = {
  send_tribute: 5,
  propose_trade_route: 3,
  declare_war: -15,
  sign_peace: 10,
  form_alliance: 8,
  break_alliance: -20,
  spy_operation: -10,
  demand_submission: -12,
  non_aggression_pact: 6,
  joint_venture: 12,
};

export const DISTANCE_INCOME_FORMULA = {
  baseIncome: 100,
  distanceDecay: 0.98,
  minIncome: 10,
  levelBonus: 0.25,
  typeBonus: 0.15,
} as const;
