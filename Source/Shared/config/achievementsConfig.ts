// Achievements System - Player milestones and rewards
export const ACHIEVEMENTS_CONFIG = {
  achievements: {
    // Combat Achievements
    firstBlood: { id: "first_blood", name: "First Blood", category: "combat", requirement: 1, type: "battles_won" },
    warLord: { id: "war_lord", name: "War Lord", category: "combat", requirement: 100, type: "battles_won" },
    conqueror: { id: "conqueror", name: "Conqueror", category: "combat", requirement: 1000, type: "battles_won" },
    undefeated: { id: "undefeated", name: "Undefeated", category: "combat", requirement: 50, type: "consecutive_wins" },
    fleetMaster: { id: "fleet_master", name: "Fleet Master", category: "combat", requirement: 10000, type: "fleet_size" },

    // Economy Achievements
    merchant: { id: "merchant", name: "Merchant", category: "economy", requirement: 10, type: "trades_completed" },
    tycoon: { id: "tycoon", name: "Tycoon", category: "economy", requirement: 1000000, type: "wealth_accumulated" },
    richBeyondMeasure: { id: "rich_beyond_measure", name: "Rich Beyond Measure", category: "economy", requirement: 10000000, type: "total_wealth" },
    millionaire: { id: "millionaire", name: "Millionaire", category: "economy", requirement: 1000000, type: "currency_earned" },

    // Exploration Achievements
    explorer: { id: "explorer", name: "Explorer", category: "exploration", requirement: 100, type: "systems_discovered" },
    cartographer: { id: "cartographer", name: "Cartographer", category: "exploration", requirement: 1000, type: "planets_mapped" },
    voyager: { id: "voyager", name: "Voyager", category: "exploration", requirement: 10000, type: "distance_traveled" },

    // Diplomacy Achievements
    peacemaker: { id: "peacemaker", name: "Peacemaker", category: "diplomacy", requirement: 10, type: "treaties_signed" },
    ambassador: { id: "ambassador", name: "Ambassador", category: "diplomacy", requirement: 100, type: "alliances_formed" },
    kingMaker: { id: "king_maker", name: "King Maker", category: "diplomacy", requirement: 5, type: "empires_allied" },

    // Knowledge Achievements
    scholar: { id: "scholar", name: "Scholar", category: "knowledge", requirement: 100, type: "research_completed" },
    genius: { id: "genius", name: "Genius", category: "knowledge", requirement: 1000, type: "knowledge_gained" },
    oracle: { id: "oracle", name: "Oracle", category: "knowledge", requirement: 10, type: "tech_tiers_unlocked" },

    // Special Achievements
    levelUp: { id: "level_up", name: "Level Up!", category: "special", requirement: 1, type: "levels_gained" },
    century: { id: "century", name: "Century Club", category: "special", requirement: 100, type: "level_reached" },
    prestige: { id: "prestige", name: "Prestigious", category: "special", requirement: 1, type: "prestige_resets" },
    legendary: { id: "legendary", name: "Legendary", category: "special", requirement: 999, type: "level_reached" },
    earlyAdopter: { id: "early_adopter", name: "Early Adopter", category: "special", requirement: 0, type: "join_date" },
  },

  rewards: {
    gold: { amount: 100, rarity: "common" },
    platinum: { amount: 10, rarity: "rare" },
    title: { permanent: true, rarity: "epic" },
    badge: { display: true, rarity: "epic" },
    cosmetic: { type: "empire_skin", rarity: "legendary" },
  },

  unlockProgression: {
    level10: ["first_blood", "merchant"],
    level50: ["war_lord", "explorer"],
    level100: ["century", "tycoon"],
    level500: ["conqueror", "oracle"],
    level999: ["legendary"],
  },
};
