/**
 * DARK MATTER — PRIME CURRENCY SYSTEM
 * ============================================================================
 * Dark Matter is the premium "prime" currency of the Stellar Dominion universe.
 * It can be earned through gameplay, purchased, or exchanged from other currencies.
 * Used for premium upgrades, gacha pulls, speed-ups, cosmetics, and exclusive items.
 */

// ============================================================================
// TYPES
// ============================================================================

export type DarkMatterSource =
  | "daily_login"
  | "achievement"
  | "quest"
  | "event"
  | "battle_victory"
  | "exploration"
  | "trade"
  | "alliance"
  | "pvp_reward"
  | "raid_reward"
  | "research_completion"
  | "construction_completion"
  | "colony_production"
  | "salvage"
  | "gacha_conversion"
  | "purchase"
  | "exchange"
  | "referral"
  | "season_pass"
  | "daily_quest"
  | "weekly_quest"
  | "monthly_quest"
  | "tutorial"
  | "first_purchase"
  | "login_streak";

export type DarkMatterSink =
  | "gacha_pull"
  | "speed_up"
  | "premium_upgrade"
  | "cosmetic"
  | "commander_recruit"
  | "army_commander_recruit"
  | "exclusive_item"
  | "resource_pack"
  | "expansion"
  | "inventory_slot"
  | "name_change"
  | "server_transfer"
  | "revive"
  | "shield"
  | "boost"
  | "gacha_pity_reset"
  | "skill_reset"
  | "talent_reset"
  | "mastery_reset"
  | "equipment_enhance"
  | "crafting_accelerate"
  | "research_accelerate"
  | "construction_accelerate"
  | "training_accelerate"
  | "market_fee_waiver"
  | "premium_subscription"
  | "exclusive_cosmetic"
  | "legendary_commander"
  | "void_pack"
  | "stellar_pack"
  | "galactic_pack"
  | "universe_pack";

export interface DarkMatterEarningMethod {
  id: DarkMatterSource;
  name: string;
  description: string;
  baseAmount: number;
  dailyCap: number;
  icon: string;
  color: string;
  tier: "free" | "premium" | "exclusive";
  requiresLevel: number;
  cooldownMinutes: number;
  streakBonus: number;
}

export interface DarkMatterSpendingCategory {
  id: DarkMatterSink;
  name: string;
  description: string;
  icon: string;
  color: string;
  minCost: number;
  maxCost: number;
  isLimited: boolean;
  dailyLimit?: number;
  totalLimit?: number;
}

export interface DarkMatterStoreItem {
  id: string;
  name: string;
  description: string;
  category: DarkMatterSink;
  price: number;
  originalPrice?: number;
  discount?: number;
  icon: string;
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary" | "mythic";
  isLimited: boolean;
  stock?: number;
  dailyLimit?: number;
  refreshType?: "daily" | "weekly" | "monthly" | "never";
  tags: string[];
  bonus?: string;
}

export interface DarkMatterExchangeRate {
  fromCurrency: string;
  toDarkMatter: number;
  darkMatterTo: number;
  fee: number;
  minExchange: number;
  maxExchange: number;
}

export interface DarkMatterDailyRewards {
  day: number;
  amount: number;
  bonus?: string;
  isStreakBonus: boolean;
}

export interface DarkMatterSeasonPass {
  tier: number;
  name: string;
  freeReward: { amount: number; item?: string };
  premiumReward: { amount: number; item?: string };
  requiredXP: number;
}

// ============================================================================
// EARNING METHODS
// ============================================================================

export const DARK_MATTER_EARNING_METHODS: DarkMatterEarningMethod[] = [
  // Daily Login
  { id: "daily_login", name: "Daily Login", description: "Log in each day to claim Dark Matter", baseAmount: 10, dailyCap: 10, icon: "📅", color: "#3b82f6", tier: "free", requiresLevel: 1, cooldownMinutes: 1440, streakBonus: 2 },
  { id: "login_streak", name: "Login Streak", description: "Consecutive login bonus (7-day streak)", baseAmount: 50, dailyCap: 50, icon: "🔥", color: "#f97316", tier: "free", requiresLevel: 1, cooldownMinutes: 10080, streakBonus: 5 },

  // Achievements
  { id: "achievement", name: "Achievement", description: "Unlock achievements for Dark Matter rewards", baseAmount: 25, dailyCap: 500, icon: "🏆", color: "#eab308", tier: "free", requiresLevel: 1, cooldownMinutes: 0, streakBonus: 0 },

  // Quests
  { id: "daily_quest", name: "Daily Quest", description: "Complete daily quests", baseAmount: 15, dailyCap: 75, icon: "📋", color: "#22c55e", tier: "free", requiresLevel: 5, cooldownMinutes: 1440, streakBonus: 1 },
  { id: "weekly_quest", name: "Weekly Quest", description: "Complete weekly quests", baseAmount: 100, dailyCap: 100, icon: "📋", color: "#16a34a", tier: "free", requiresLevel: 10, cooldownMinutes: 10080, streakBonus: 10 },
  { id: "monthly_quest", name: "Monthly Quest", description: "Complete monthly quests", baseAmount: 500, dailyCap: 500, icon: "📋", color: "#15803d", tier: "free", requiresLevel: 20, cooldownMinutes: 43200, streakBonus: 50 },

  // Combat
  { id: "battle_victory", name: "Battle Victory", description: "Win PvE battles", baseAmount: 5, dailyCap: 100, icon: "⚔️", color: "#ef4444", tier: "free", requiresLevel: 3, cooldownMinutes: 5, streakBonus: 1 },
  { id: "pvp_reward", name: "PvP Reward", description: "Win PvP matches", baseAmount: 20, dailyCap: 200, icon: "🏆", color: "#dc2626", tier: "free", requiresLevel: 15, cooldownMinutes: 10, streakBonus: 3 },
  { id: "raid_reward", name: "Raid Reward", description: "Complete raids", baseAmount: 50, dailyCap: 300, icon: "🐉", color: "#b91c1c", tier: "free", requiresLevel: 25, cooldownMinutes: 30, streakBonus: 5 },

  // Exploration & Discovery
  { id: "exploration", name: "Exploration", description: "Discover new systems and anomalies", baseAmount: 15, dailyCap: 150, icon: "🔭", color: "#06b6d4", tier: "free", requiresLevel: 5, cooldownMinutes: 15, streakBonus: 2 },
  { id: "salvage", name: "Salvage", description: "Salvage wrecks and debris fields", baseAmount: 10, dailyCap: 100, icon: "♻️", color: "#0891b2", tier: "free", requiresLevel: 8, cooldownMinutes: 20, streakBonus: 1 },

  // Economy
  { id: "trade", name: "Trade Profit", description: "Earn from successful trades", baseAmount: 8, dailyCap: 80, icon: "💰", color: "#ca8a04", tier: "free", requiresLevel: 5, cooldownMinutes: 10, streakBonus: 1 },
  { id: "colony_production", name: "Colony Production", description: "Colony resource production bonus", baseAmount: 5, dailyCap: 50, icon: "🌍", color: "#16a34a", tier: "free", requiresLevel: 10, cooldownMinutes: 60, streakBonus: 0 },

  // Social
  { id: "alliance", name: "Alliance Activity", description: "Alliance contributions and events", baseAmount: 20, dailyCap: 100, icon: "🤝", color: "#8b5cf6", tier: "free", requiresLevel: 10, cooldownMinutes: 30, streakBonus: 2 },

  // Research & Construction
  { id: "research_completion", name: "Research Completion", description: "Complete research projects", baseAmount: 30, dailyCap: 300, icon: "🔬", color: "#a78bfa", tier: "free", requiresLevel: 8, cooldownMinutes: 60, streakBonus: 3 },
  { id: "construction_completion", name: "Construction Completion", description: "Complete building construction", baseAmount: 15, dailyCap: 150, icon: "🏗️", color: "#7c3aed", tier: "free", requiresLevel: 5, cooldownMinutes: 30, streakBonus: 1 },

  // Premium / Special
  { id: "gacha_conversion", name: "Gacha Duplicate", description: "Convert duplicate commanders/items to Dark Matter", baseAmount: 100, dailyCap: 1000, icon: "🎰", color: "#f59e0b", tier: "premium", requiresLevel: 1, cooldownMinutes: 0, streakBonus: 0 },
  { id: "tutorial", name: "Tutorial", description: "Complete tutorial steps", baseAmount: 200, dailyCap: 200, icon: "📖", color: "#22c55e", tier: "free", requiresLevel: 1, cooldownMinutes: 0, streakBonus: 0 },
  { id: "first_purchase", name: "First Purchase", description: "First-time purchase bonus", baseAmount: 500, dailyCap: 500, icon: "🎁", color: "#f59e0b", tier: "premium", requiresLevel: 1, cooldownMinutes: 0, streakBonus: 0 },
  { id: "referral", name: "Referral", description: "Refer a friend", baseAmount: 200, dailyCap: 1000, icon: "👥", color: "#3b82f6", tier: "free", requiresLevel: 10, cooldownMinutes: 0, streakBonus: 0 },
  { id: "season_pass", name: "Season Pass", description: "Season pass tier rewards", baseAmount: 0, dailyCap: 0, icon: "🎫", color: "#a855f7", tier: "premium", requiresLevel: 1, cooldownMinutes: 0, streakBonus: 0 },
];

// ============================================================================
// SPENDING CATEGORIES
// ============================================================================

export const DARK_MATTER_SPENDING_CATEGORIES: DarkMatterSpendingCategory[] = [
  { id: "gacha_pull", name: "Gacha Pulls", description: "Pull on commander and item banners", icon: "🎰", color: "#f59e0b", minCost: 300, maxCost: 5000, isLimited: false },
  { id: "speed_up", name: "Speed Ups", description: "Accelerate timers", icon: "⚡", color: "#22c55e", minCost: 10, maxCost: 500, isLimited: false },
  { id: "premium_upgrade", name: "Premium Upgrades", description: "Unlock premium upgrades and features", icon: "⭐", color: "#eab308", minCost: 100, maxCost: 5000, isLimited: false },
  { id: "cosmetic", name: "Cosmetics", description: "Skins, themes, and visual effects", icon: "🎨", color: "#a855f7", minCost: 50, maxCost: 2000, isLimited: false },
  { id: "commander_recruit", name: "Commander Recruitment", description: "Recruit space commanders", icon: "👨‍✈️", color: "#3b82f6", minCost: 300, maxCost: 5000, isLimited: false },
  { id: "army_commander_recruit", name: "Army Commander Recruitment", description: "Recruit army commanders", icon: "⚔️", color: "#ef4444", minCost: 300, maxCost: 5000, isLimited: false },
  { id: "exclusive_item", name: "Exclusive Items", description: "Limited-time exclusive items", icon: "💎", color: "#06b6d4", minCost: 200, maxCost: 3000, isLimited: true, dailyLimit: 5 },
  { id: "resource_pack", name: "Resource Packs", description: "Purchase resource bundles", icon: "📦", color: "#ca8a04", minCost: 50, maxCost: 1000, isLimited: false },
  { id: "expansion", name: "Empire Expansion", description: "Expand territory and colony slots", icon: "🌍", color: "#16a34a", minCost: 500, maxCost: 5000, isLimited: true, totalLimit: 20 },
  { id: "inventory_slot", name: "Inventory Slots", description: "Expand inventory capacity", icon: "🎒", color: "#94a3b8", minCost: 50, maxCost: 200, isLimited: true, totalLimit: 100 },
  { id: "name_change", name: "Name Change", description: "Change commander or empire name", icon: "✏️", color: "#6366f1", minCost: 100, maxCost: 100, isLimited: false },
  { id: "server_transfer", name: "Server Transfer", description: "Transfer to another server", icon: "🚀", color: "#f97316", minCost: 2000, maxCost: 2000, isLimited: true, totalLimit: 3 },
  { id: "revive", name: "Revive", description: "Instantly revive fallen units", icon: "💚", color: "#22c55e", minCost: 100, maxCost: 500, isLimited: false },
  { id: "shield", name: "Shield", description: "Activate protection shield", icon: "🛡️", color: "#3b82f6", minCost: 50, maxCost: 500, isLimited: false },
  { id: "boost", name: "Boost", description: "Temporary stat boosts", icon: "⬆️", color: "#eab308", minCost: 25, maxCost: 200, isLimited: false },
  { id: "skill_reset", name: "Skill Reset", description: "Reset skill points", icon: "🔄", color: "#a855f7", minCost: 100, maxCost: 500, isLimited: false },
  { id: "talent_reset", name: "Talent Reset", description: "Reset talent tree points", icon: "🔄", color: "#c084fc", minCost: 200, maxCost: 1000, isLimited: false },
  { id: "mastery_reset", name: "Mastery Reset", description: "Reset mastery progress", icon: "🔄", color: "#e879f9", minCost: 500, maxCost: 2000, isLimited: false },
  { id: "equipment_enhance", name: "Equipment Enhancement", description: "Enhance equipment stats", icon: "🔨", color: "#f97316", minCost: 50, maxCost: 1000, isLimited: false },
  { id: "crafting_accelerate", name: "Crafting Accelerate", description: "Speed up crafting process", icon: "⚙️", color: "#78716c", minCost: 20, maxCost: 200, isLimited: false },
  { id: "research_accelerate", name: "Research Accelerate", description: "Speed up research", icon: "🔬", color: "#a78bfa", minCost: 20, maxCost: 500, isLimited: false },
  { id: "construction_accelerate", name: "Construction Accelerate", description: "Speed up construction", icon: "🏗️", color: "#7c3aed", minCost: 20, maxCost: 500, isLimited: false },
  { id: "training_accelerate", name: "Training Accelerate", description: "Speed up unit training", icon: "🏋️", color: "#ef4444", minCost: 10, maxCost: 300, isLimited: false },
  { id: "market_fee_waiver", name: "Market Fee Waiver", description: "Waive market transaction fees", icon: "🏪", color: "#ca8a04", minCost: 30, maxCost: 100, isLimited: false },
  { id: "premium_subscription", name: "Premium Subscription", description: "Subscribe for daily Dark Matter and bonuses", icon: "👑", color: "#f59e0b", minCost: 1000, maxCost: 5000, isLimited: true, dailyLimit: 1 },
  { id: "void_pack", name: "Void Pack", description: "Exotic void material packs", icon: "⭕", color: "#6366f1", minCost: 200, maxCost: 2000, isLimited: true, dailyLimit: 3 },
  { id: "stellar_pack", name: "Stellar Pack", description: "Stellar resource packs", icon: "🌟", color: "#eab308", minCost: 300, maxCost: 3000, isLimited: true, dailyLimit: 3 },
  { id: "galactic_pack", name: "Galactic Pack", description: "Galactic empire packs", icon: "🌌", color: "#8b5cf6", minCost: 500, maxCost: 5000, isLimited: true, dailyLimit: 2 },
  { id: "universe_pack", name: "Universe Pack", description: "Ultimate universe packs", icon: "♾️", color: "#f59e0b", minCost: 1000, maxCost: 10000, isLimited: true, dailyLimit: 1 },
];

// ============================================================================
// STORE ITEMS
// ============================================================================

export const DARK_MATTER_STORE: DarkMatterStoreItem[] = [
  // Daily Deals
  { id: "daily_metal_pack", name: "Daily Metal Pack", description: "50,000 Metal for a discount", category: "resource_pack", price: 50, icon: "⛏️", rarity: "common", isLimited: true, stock: 3, refreshType: "daily", tags: ["daily", "resource"], bonus: "+20% bonus metal" },
  { id: "daily_crystal_pack", name: "Daily Crystal Pack", description: "30,000 Crystal for a discount", category: "resource_pack", price: 60, icon: "💎", rarity: "common", isLimited: true, stock: 3, refreshType: "daily", tags: ["daily", "resource"], bonus: "+15% bonus crystal" },
  { id: "daily_deuterium_pack", name: "Daily Deuterium Pack", description: "10,000 Deuterium for a discount", category: "resource_pack", price: 80, icon: "🛢️", rarity: "uncommon", isLimited: true, stock: 2, refreshType: "daily", tags: ["daily", "resource"], bonus: "+10% bonus deuterium" },

  // Speed-Ups
  { id: "speedup_1h", name: "1-Hour Speed Up", description: "Skip 1 hour of any timer", category: "speed_up", price: 15, icon: "⚡", rarity: "common", isLimited: false, tags: ["speedup"] },
  { id: "speedup_4h", name: "4-Hour Speed Up", description: "Skip 4 hours of any timer", category: "speed_up", price: 50, icon: "⚡", rarity: "uncommon", isLimited: false, tags: ["speedup"] },
  { id: "speedup_8h", name: "8-Hour Speed Up", description: "Skip 8 hours of any timer", category: "speed_up", price: 90, icon: "⚡", rarity: "rare", isLimited: false, tags: ["speedup"] },
  { id: "speedup_24h", name: "24-Hour Speed Up", description: "Skip 24 hours of any timer", category: "speed_up", price: 200, icon: "⚡", rarity: "epic", isLimited: false, tags: ["speedup"] },
  { id: "speedup_7d", name: "7-Day Speed Up", description: "Skip 7 days of any timer", category: "speed_up", price: 1000, icon: "⚡", rarity: "legendary", isLimited: true, dailyLimit: 5, tags: ["speedup", "premium"] },

  // Boosts
  { id: "boost_50_prod", name: "50% Production Boost (24h)", description: "+50% resource production for 24 hours", category: "boost", price: 100, icon: "⬆️", rarity: "uncommon", isLimited: true, dailyLimit: 2, tags: ["boost", "production"] },
  { id: "boost_100_prod", name: "100% Production Boost (24h)", description: "+100% resource production for 24 hours", category: "boost", price: 250, icon: "⬆️", rarity: "rare", isLimited: true, dailyLimit: 1, tags: ["boost", "production", "premium"] },
  { id: "boost_50_research", name: "50% Research Boost (24h)", description: "+50% research speed for 24 hours", category: "boost", price: 150, icon: "🔬", rarity: "rare", isLimited: true, dailyLimit: 2, tags: ["boost", "research"] },
  { id: "boost_50_build", name: "50% Build Boost (24h)", description: "+50% construction speed for 24 hours", category: "boost", price: 150, icon: "🏗️", rarity: "rare", isLimited: true, dailyLimit: 2, tags: ["boost", "construction"] },
  { id: "boost_50_combat", name: "50% Combat Boost (24h)", description: "+50% attack and defense for 24 hours", category: "boost", price: 200, icon: "⚔️", rarity: "epic", isLimited: true, dailyLimit: 1, tags: ["boost", "combat", "pvp"] },

  // Shields
  { id: "shield_4h", name: "4-Hour Shield", description: "Protection from attacks for 4 hours", category: "shield", price: 50, icon: "🛡️", rarity: "common", isLimited: true, dailyLimit: 5, tags: ["shield", "defense"] },
  { id: "shield_8h", name: "8-Hour Shield", description: "Protection from attacks for 8 hours", category: "shield", price: 80, icon: "🛡️", rarity: "uncommon", isLimited: true, dailyLimit: 3, tags: ["shield", "defense"] },
  { id: "shield_24h", name: "24-Hour Shield", description: "Protection from attacks for 24 hours", category: "shield", price: 200, icon: "🛡️", rarity: "rare", isLimited: true, dailyLimit: 2, tags: ["shield", "defense", "premium"] },
  { id: "shield_7d", name: "7-Day Shield", description: "Protection from attacks for 7 days", category: "shield", price: 800, icon: "🛡️", rarity: "epic", isLimited: true, dailyLimit: 1, tags: ["shield", "defense", "premium"] },

  // Gacha Tickets
  { id: "army_seal", name: "Army Seal", description: "Single pull on army commander banner", category: "army_commander_recruit", price: 300, icon: "🎖️", rarity: "uncommon", isLimited: false, tags: ["gacha", "army"] },
  { id: "army_seal_10", name: "Army Seal x10", description: "10 pulls on army commander banner (save 10%)", category: "army_commander_recruit", price: 2700, originalPrice: 3000, discount: 10, icon: "🎖️", rarity: "rare", isLimited: false, tags: ["gacha", "army", "multi"] },
  { id: "command_seal", name: "Command Seal", description: "Single pull on commander banner", category: "commander_recruit", price: 300, icon: "⭐", rarity: "uncommon", isLimited: false, tags: ["gacha", "commander"] },
  { id: "command_seal_10", name: "Command Seal x10", description: "10 pulls on commander banner (save 10%)", category: "commander_recruit", price: 2700, originalPrice: 3000, discount: 10, icon: "⭐", rarity: "rare", isLimited: false, tags: ["gacha", "commander", "multi"] },

  // Premium Packs
  { id: "beginner_pack", name: "Starter Pack", description: "Best value for new players", category: "resource_pack", price: 500, icon: "🎁", rarity: "epic", isLimited: true, stock: 1, refreshType: "never", tags: ["starter", "value", "limited"], bonus: "Includes 500 DM + resources + 3-star commander" },
  { id: "veteran_pack", name: "Veteran Pack", description: "For experienced commanders", category: "resource_pack", price: 1000, icon: "🎖️", rarity: "legendary", isLimited: true, stock: 1, refreshType: "never", tags: ["veteran", "value", "limited"], bonus: "Includes 1000 DM + epic resources + 4-star commander" },
  { id: "legendary_pack", name: "Legendary Pack", description: "Ultimate commander package", category: "legendary_commander", price: 5000, icon: "👑", rarity: "mythic", isLimited: true, stock: 1, refreshType: "never", tags: ["legendary", "ultimate", "limited"], bonus: "Guaranteed 5-star commander + exclusive skin" },

  // Cosmetics
  { id: "skin_infantry_01", name: "Crimson Infantry Skin", description: "Red-themed infantry skin", category: "cosmetic", price: 200, icon: "🎨", rarity: "rare", isLimited: false, tags: ["cosmetic", "infantry"] },
  { id: "skin_armor_01", name: "Shadow Armor Skin", description: "Dark-themed armor skin", category: "cosmetic", price: 250, icon: "🎨", rarity: "rare", isLimited: false, tags: ["cosmetic", "armor"] },
  { id: "skin_air_01", name: "Neon Air Wing Skin", description: "Neon-themed aircraft skin", category: "cosmetic", price: 300, icon: "🎨", rarity: "epic", isLimited: false, tags: ["cosmetic", "air"] },
  { id: "empire_flag_01", name: "Void Empire Flag", description: "Void-themed empire banner", category: "cosmetic", price: 100, icon: "🏴", rarity: "uncommon", isLimited: false, tags: ["cosmetic", "banner"] },
  { id: "commander_portrait_01", name: "Legendary Portrait Frame", description: "Gold-bordered commander portrait", category: "exclusive_cosmetic", price: 500, icon: "🖼️", rarity: "legendary", isLimited: true, dailyLimit: 1, tags: ["cosmetic", "portrait", "premium"] },

  // Revive
  { id: "revive_small", name: "Minor Revive", description: "Revive up to 100 fallen units", category: "revive", price: 100, icon: "💚", rarity: "uncommon", isLimited: false, tags: ["revive"] },
  { id: "revive_large", name: "Major Revive", description: "Revive up to 1000 fallen units", category: "revive", price: 500, icon: "💚", rarity: "rare", isLimited: true, dailyLimit: 3, tags: ["revive", "premium"] },

  // Resets
  { id: "skill_reset_ticket", name: "Skill Reset Ticket", description: "Reset all skill points", category: "skill_reset", price: 100, icon: "🔄", rarity: "uncommon", isLimited: false, tags: ["reset", "skill"] },
  { id: "talent_reset_ticket", name: "Talent Reset Ticket", description: "Reset all talent points", category: "talent_reset", price: 250, icon: "🔄", rarity: "rare", isLimited: false, tags: ["reset", "talent"] },
  { id: "mastery_reset_ticket", name: "Mastery Reset Ticket", description: "Reset all mastery progress", category: "mastery_reset", price: 500, icon: "🔄", rarity: "epic", isLimited: false, tags: ["reset", "mastery"] },
];

// ============================================================================
// EXCHANGE RATES
// ============================================================================

export const DARK_MATTER_EXCHANGE_RATES: DarkMatterExchangeRate[] = [
  { fromCurrency: "credits", toDarkMatter: 0.001, darkMatterTo: 1000, fee: 0.05, minExchange: 1000, maxExchange: 1000000 },
  { fromCurrency: "gold", toDarkMatter: 0.01, darkMatterTo: 100, fee: 0.03, minExchange: 100, maxExchange: 100000 },
  { fromCurrency: "silver", toDarkMatter: 0.001, darkMatterTo: 1000, fee: 0.05, minExchange: 1000, maxExchange: 1000000 },
  { fromCurrency: "platinum", toDarkMatter: 0.1, darkMatterTo: 10, fee: 0.02, minExchange: 10, maxExchange: 10000 },
  { fromCurrency: "antimatter", toDarkMatter: 0.5, darkMatterTo: 2, fee: 0.1, minExchange: 2, maxExchange: 5000 },
  { fromCurrency: "void-matter", toDarkMatter: 2, darkMatterTo: 0.5, fee: 0.1, minExchange: 0.5, maxExchange: 2000 },
  { fromCurrency: "celestial-essence", toDarkMatter: 10, darkMatterTo: 0.1, fee: 0.05, minExchange: 0.1, maxExchange: 500 },
];

// ============================================================================
// DAILY LOGIN REWARDS
// ============================================================================

export const DARK_MATTER_DAILY_REWARDS: DarkMatterDailyRewards[] = [
  { day: 1, amount: 10, isStreakBonus: false },
  { day: 2, amount: 15, isStreakBonus: false },
  { day: 3, amount: 20, isStreakBonus: false },
  { day: 4, amount: 25, isStreakBonus: false },
  { day: 5, amount: 30, isStreakBonus: false },
  { day: 6, amount: 40, isStreakBonus: false },
  { day: 7, amount: 100, bonus: "Weekly Streak Bonus!", isStreakBonus: true },
  { day: 8, amount: 15, isStreakBonus: false },
  { day: 9, amount: 20, isStreakBonus: false },
  { day: 10, amount: 25, isStreakBonus: false },
  { day: 11, amount: 30, isStreakBonus: false },
  { day: 12, amount: 40, isStreakBonus: false },
  { day: 13, amount: 50, isStreakBonus: false },
  { day: 14, amount: 200, bonus: "2-Week Streak Bonus!", isStreakBonus: true },
  { day: 15, amount: 25, isStreakBonus: false },
  { day: 16, amount: 30, isStreakBonus: false },
  { day: 17, amount: 35, isStreakBonus: false },
  { day: 18, amount: 40, isStreakBonus: false },
  { day: 19, amount: 50, isStreakBonus: false },
  { day: 20, amount: 60, isStreakBonus: false },
  { day: 21, amount: 300, bonus: "3-Week Streak Bonus!", isStreakBonus: true },
  { day: 22, amount: 30, isStreakBonus: false },
  { day: 23, amount: 35, isStreakBonus: false },
  { day: 24, amount: 40, isStreakBonus: false },
  { day: 25, amount: 50, isStreakBonus: false },
  { day: 26, amount: 60, isStreakBonus: false },
  { day: 27, amount: 75, isStreakBonus: false },
  { day: 28, amount: 500, bonus: "Monthly Streak Bonus!", isStreakBonus: true },
];

// ============================================================================
// SEASON PASS (30 tiers)
// ============================================================================

export const DARK_MATTER_SEASON_PASS: DarkMatterSeasonPass[] = [
  { tier: 1, name: "Recruit", freeReward: { amount: 25 }, premiumReward: { amount: 75, item: "Army Seal x1" }, requiredXP: 100 },
  { tier: 2, name: "Private", freeReward: { amount: 30 }, premiumReward: { amount: 90, item: "Speed Up 4h x2" }, requiredXP: 250 },
  { tier: 3, name: "Corporal", freeReward: { amount: 35, item: "Metal Pack" }, premiumReward: { amount: 105, item: "Crystal Pack x2" }, requiredXP: 500 },
  { tier: 4, name: "Sergeant", freeReward: { amount: 40 }, premiumReward: { amount: 120, item: "Boost 50% x1" }, requiredXP: 800 },
  { tier: 5, name: "Staff Sergeant", freeReward: { amount: 50, item: "Speed Up 1h x3" }, premiumReward: { amount: 150, item: "Army Seal x3" }, requiredXP: 1200 },
  { tier: 6, name: "Gunnery Sergeant", freeReward: { amount: 55 }, premiumReward: { amount: 165, item: "Shield 4h x2" }, requiredXP: 1600 },
  { tier: 7, name: "Master Sergeant", freeReward: { amount: 60, item: "Deuterium Pack" }, premiumReward: { amount: 180, item: "Speed Up 8h x2" }, requiredXP: 2000 },
  { tier: 8, name: "Sergeant Major", freeReward: { amount: 65 }, premiumReward: { amount: 195, item: "Command Seal x2" }, requiredXP: 2500 },
  { tier: 9, name: "Warrant Officer", freeReward: { amount: 70, item: "Speed Up 4h x2" }, premiumReward: { amount: 210, item: "Boost 100% x1" }, requiredXP: 3000 },
  { tier: 10, name: "Chief Warrant Officer", freeReward: { amount: 100, item: "Rare Equipment" }, premiumReward: { amount: 300, item: "Epic Equipment" }, requiredXP: 3500 },
  { tier: 11, name: "Second Lieutenant", freeReward: { amount: 75 }, premiumReward: { amount: 225, item: "Army Seal x5" }, requiredXP: 4000 },
  { tier: 12, name: "First Lieutenant", freeReward: { amount: 80, item: "Metal Pack x2" }, premiumReward: { amount: 240, item: "Crystal Pack x3" }, requiredXP: 4500 },
  { tier: 13, name: "Captain", freeReward: { amount: 85 }, premiumReward: { amount: 255, item: "Speed Up 24h x1" }, requiredXP: 5000 },
  { tier: 14, name: "Major", freeReward: { amount: 90, item: "Shield 4h x2" }, premiumReward: { amount: 270, item: "Shield 24h x1" }, requiredXP: 5500 },
  { tier: 15, name: "Lieutenant Colonel", freeReward: { amount: 100, item: "Command Seal x2" }, premiumReward: { amount: 300, item: "Command Seal x5" }, requiredXP: 6000 },
  { tier: 16, name: "Colonel", freeReward: { amount: 105 }, premiumReward: { amount: 315, item: "Boost 50% x2" }, requiredXP: 6500 },
  { tier: 17, name: "Brigadier General", freeReward: { amount: 110, item: "Deuterium Pack x2" }, premiumReward: { amount: 330, item: "Void Pack x1" }, requiredXP: 7000 },
  { tier: 18, name: "Major General", freeReward: { amount: 115 }, premiumReward: { amount: 345, item: "Speed Up 24h x2" }, requiredXP: 7500 },
  { tier: 19, name: "Lieutenant General", freeReward: { amount: 120, item: "Shield 8h x2" }, premiumReward: { amount: 360, item: "Shield 7d x1" }, requiredXP: 8000 },
  { tier: 20, name: "General", freeReward: { amount: 150, item: "Epic Equipment" }, premiumReward: { amount: 450, item: "Legendary Equipment" }, requiredXP: 8500 },
  { tier: 21, name: "Field Marshal", freeReward: { amount: 130 }, premiumReward: { amount: 390, item: "Army Seal x10" }, requiredXP: 9000 },
  { tier: 22, name: "Supreme Commander", freeReward: { amount: 140, item: "Boost 100% x1" }, premiumReward: { amount: 420, item: "Legendary Pack" }, requiredXP: 9500 },
  { tier: 23, name: "Grand Marshal", freeReward: { amount: 150, item: "Command Seal x3" }, premiumReward: { amount: 450, item: "Void Pack x3" }, requiredXP: 10000 },
  { tier: 24, name: "Fleet Admiral", freeReward: { amount: 160 }, premiumReward: { amount: 480, item: "Stellar Pack x2" }, requiredXP: 10500 },
  { tier: 25, name: "Star Marshal", freeReward: { amount: 175, item: "Speed Up 24h x3" }, premiumReward: { amount: 525, item: "Galactic Pack x1" }, requiredXP: 11000 },
  { tier: 26, name: "Galactic Commander", freeReward: { amount: 200 }, premiumReward: { amount: 600, item: "Legendary Equipment" }, requiredXP: 11500 },
  { tier: 27, name: "Cosmic Overlord", freeReward: { amount: 225, item: "Shield 24h x2" }, premiumReward: { amount: 675, item: "Universe Pack x1" }, requiredXP: 12000 },
  { tier: 28, name: "Void Emperor", freeReward: { amount: 250, item: "Command Seal x5" }, premiumReward: { amount: 750, item: "Mythic Equipment" }, requiredXP: 12500 },
  { tier: 29, name: "Celestial God", freeReward: { amount: 300, item: "Void Pack x2" }, premiumReward: { amount: 900, item: "Legendary Commander Token" }, requiredXP: 13000 },
  { tier: 30, name: "Eternal Sovereign", freeReward: { amount: 500, item: "Exclusive Skin" }, premiumReward: { amount: 1500, item: "Exclusive Legendary Commander" }, requiredXP: 14000 },
];

// ============================================================================
// PREMIUM SUBSCRIPTION TIERS
// ============================================================================

export interface DarkMatterSubscription {
  id: string;
  name: string;
  description: string;
  price: number;
  durationDays: number;
  dailyDarkMatter: number;
  bonuses: string[];
  icon: string;
  color: string;
}

export const DARK_MATTER_SUBSCRIPTIONS: DarkMatterSubscription[] = [
  {
    id: "sub_bronze", name: "Bronze Subscription", description: "Basic premium benefits",
    price: 500, durationDays: 30, dailyDarkMatter: 25,
    bonuses: ["+10% resource production", "+1 building queue", "Bronze badge", "Daily login bonus x2"],
    icon: "🥉", color: "#cd7f32",
  },
  {
    id: "sub_silver", name: "Silver Subscription", description: "Enhanced premium benefits",
    price: 1000, durationDays: 30, dailyDarkMatter: 50,
    bonuses: ["+20% resource production", "+2 building queues", "Silver badge", "Daily login bonus x3", "+5% research speed", "+5% build speed"],
    icon: "🥈", color: "#c0c0c0",
  },
  {
    id: "sub_gold", name: "Gold Subscription", description: "Premium benefits for serious commanders",
    price: 2000, durationDays: 30, dailyDarkMatter: 100,
    bonuses: ["+30% resource production", "+3 building queues", "Gold badge", "Daily login bonus x5", "+10% research speed", "+10% build speed", "Free daily gacha pull", "Exclusive Gold commander skin"],
    icon: "🥇", color: "#ffd700",
  },
  {
    id: "sub_diamond", name: "Diamond Subscription", description: "The ultimate commander experience",
    price: 5000, durationDays: 30, dailyDarkMatter: 250,
    bonuses: ["+50% resource production", "+5 building queues", "Diamond badge", "Daily login bonus x10", "+20% research speed", "+20% build speed", "Free daily gacha pull", "Exclusive Diamond commander skin", "Auto-collect resources", "Priority queue"],
    icon: "💎", color: "#b9f2ff",
  },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function calculateDailyDarkMatterEarnings(loginStreak: number): number {
  const dailyReward = DARK_MATTER_DAILY_REWARDS[Math.min(loginStreak - 1, DARK_MATTER_DAILY_REWARDS.length - 1)];
  return dailyReward ? dailyReward.amount : 10;
}

export function calculateStreakBonus(loginStreak: number): number {
  const streakDays = [7, 14, 21, 28];
  let bonus = 0;
  for (const day of streakDays) {
    if (loginStreak >= day) bonus += day * 5;
  }
  return bonus;
}

export function getStoreItemsByCategory(category: DarkMatterSink): DarkMatterStoreItem[] {
  return DARK_MATTER_STORE.filter(item => item.category === category);
}

export function getStoreItemsByRarity(rarity: DarkMatterStoreItem["rarity"]): DarkMatterStoreItem[] {
  return DARK_MATTER_STORE.filter(item => item.rarity === rarity);
}

export function calculateExchangeAmount(
  fromCurrency: string,
  amount: number
): { darkMatterReceived: number; fee: number; netReceived: number } | null {
  const rate = DARK_MATTER_EXCHANGE_RATES.find(r => r.fromCurrency === fromCurrency);
  if (!rate) return null;
  if (amount < rate.minExchange || amount > rate.maxExchange) return null;

  const darkMatterReceived = Math.floor(amount * rate.toDarkMatter);
  const fee = Math.floor(darkMatterReceived * rate.fee);
  const netReceived = darkMatterReceived - fee;

  return { darkMatterReceived, fee, netReceived };
}

export function getSeasonPassRewards(tier: number, isPremium: boolean): DarkMatterSeasonPass | undefined {
  return DARK_MATTER_SEASON_PASS.find(t => t.tier === tier);
}

export function calculateSeasonPassTotal(isPremium: boolean): number {
  return DARK_MATTER_SEASON_PASS.reduce((total, tier) => {
    return total + (isPremium ? tier.premiumReward.amount : tier.freeReward.amount);
  }, 0);
}
