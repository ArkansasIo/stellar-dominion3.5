// Currency Configuration - Gold, Platinum, Silver, and their uses
export const CURRENCY_CONFIG = {
  // Currency types
  currencies: {
    gold: {
      name: "Gold",
      symbol: "Au",
      description: "Standard currency for trading and commerce",
      rarity: "common",
      color: "#FFD700",
      exchangeRate: 1.0,
    },
    silver: {
      name: "Silver",
      symbol: "Ag",
      description: "Common currency for small transactions",
      rarity: "common",
      color: "#C0C0C0",
      exchangeRate: 0.1, // 10 silver = 1 gold
    },
    platinum: {
      name: "Platinum",
      symbol: "Pt",
      description: "Premium currency for high-value items",
      rarity: "rare",
      color: "#E5E4E2",
      exchangeRate: 10.0, // 1 platinum = 10 gold
    },
  },

  // Currency uses and conversions
  currencyUses: {
    // Trading and commerce
    trading: {
      name: "Trading",
      description: "Buy and sell items on the market",
      currencies: ["gold", "silver"],
      conversionBonus: 0.02, // 2% bonus when converting
    },
    
    // Player-to-player transactions
    transactions: {
      name: "Player Transactions",
      description: "Send money to other players",
      currencies: ["gold", "platinum"],
      transactionFee: 0.01, // 1% fee
    },

    // Buying from NPCs
    npcPurchase: {
      name: "NPC Purchases",
      description: "Buy items from NPC vendors",
      currencies: ["gold", "silver", "platinum"],
      vendorDiscount: 0.05, // 5% volume discount
    },

    // Building and construction
    construction: {
      name: "Construction",
      description: "Accelerate building construction",
      currencies: ["platinum"],
      speedupCost: 1, // 1 platinum per hour of acceleration
    },

    // Research acceleration
    research: {
      name: "Research Acceleration",
      description: "Speed up research completion",
      currencies: ["platinum"],
      speedupCost: 1, // 1 platinum per hour of acceleration
    },

    // Training units
    training: {
      name: "Unit Training",
      description: "Purchase training for units",
      currencies: ["gold", "silver"],
      costPerLevel: 100, // 100 gold per training level
    },

    // Recruiting units
    recruitment: {
      name: "Unit Recruitment",
      description: "Recruit new units",
      currencies: ["gold"],
      costPerUnit: 50, // 50 gold per unit
    },

    // Equipment purchases
    equipment: {
      name: "Equipment",
      description: "Buy weapons, armor, and tools",
      currencies: ["gold", "platinum"],
      rarityMultiplier: 1, // rare items cost more
    },

    // Alliance management
    allianceManagement: {
      name: "Alliance Management",
      description: "Create, manage, and maintain alliances",
      currencies: ["platinum"],
      creationCost: 100, // 100 platinum to create alliance
      maintenanceCost: 10, // 10 platinum per day
    },

    // Cosmetics and skins
    cosmetics: {
      name: "Cosmetics",
      description: "Buy cosmetic items and skins",
      currencies: ["platinum"],
      skinCost: 50, // 50 platinum per cosmetic
    },

    // Battle Pass and seasons
    battlePass: {
      name: "Battle Pass",
      description: "Purchase battle pass access",
      currencies: ["platinum"],
      seasonCost: 100, // 100 platinum per season
    },

    // Resource conversion
    resourceConversion: {
      name: "Resource Conversion",
      description: "Convert platinum to resources",
      currencies: ["platinum"],
      conversionRate: 100, // 100 gold per platinum
    },

    // Special events
    eventTickets: {
      name: "Event Tickets",
      description: "Purchase special event tickets",
      currencies: ["gold", "platinum"],
      ticketCost: 50, // 50 gold or 5 platinum
    },

    // Premium features
    premiumFeatures: {
      name: "Premium Features",
      description: "Unlock premium game features",
      currencies: ["platinum"],
      monthlySubscription: 50, // 50 platinum per month
    },

    // Auction house fees
    auctionHouse: {
      name: "Auction House",
      description: "List items in auction house",
      currencies: ["gold"],
      listingFee: 0.05, // 5% of sale price
      saleFee: 0.1, // 10% of final sale price
    },

    // Guild/Alliance taxes
    allianceTaxes: {
      name: "Alliance Taxes",
      description: "Pay taxes to alliance treasury",
      currencies: ["gold", "silver"],
      taxRate: 0.05, // 5% tax rate
    },

    // Repair equipment
    repair: {
      name: "Repair Equipment",
      description: "Repair damaged equipment",
      currencies: ["gold"],
      repairCost: 10, // 10 gold per durability point
    },

    // Teleportation
    teleportation: {
      name: "Teleportation",
      description: "Fast travel between locations",
      currencies: ["gold"],
      distanceCost: 1, // 1 gold per unit of distance
    },

    // Bribery and negotiation
    bribery: {
      name: "Bribery",
      description: "Bribe NPCs or reduce penalties",
      currencies: ["platinum"],
      bribeCost: 100, // 100 platinum
    },
  },

  // Currency generation methods
  generationMethods: {
    trading: { name: "Market Trading", rate: "variable" },
    quests: { name: "Quest Rewards", rate: 50 }, // gold per quest
    missions: { name: "Mission Rewards", rate: 100 }, // gold per mission
    farming: { name: "Farming/Mining", rate: 1 }, // gold per second
    allianceMembership: { name: "Alliance Rewards", rate: 10 }, // gold per day
    marketplace: { name: "Marketplace Sales", rate: "variable" },
    battlePass: { name: "Battle Pass Rewards", rate: 500 }, // per tier
    achievements: { name: "Achievement Rewards", rate: 200 }, // per achievement
    pettyTheft: { name: "Petty Theft", rate: 5 }, // gold per steal (espionage)
  },

  // Conversion rates (for convenience)
  conversionRates: {
    silverToGold: 10, // 10 silver = 1 gold
    platinumToGold: 10, // 1 platinum = 10 gold
  },

  // Wealth caps and limits
  limits: {
    maxGoldPerPlayer: 9999999,
    maxSilverPerPlayer: 99999999,
    maxPlatinumPerPlayer: 999999,
    transactionLimit: 1000000, // max gold per transaction
    dailyEarningCap: 100000, // gold per day from passive income
  },

  // Inflation/deflation controls
  economyControls: {
    baseInflationRate: 0.01, // 1% per week
    sinkMechanisms: ["taxes", "repair", "travel", "services"],
    sourceMechanisms: ["quests", "missions", "farming", "marketplace"],
  },

  // Currency events and promotions
  events: {
    doubleGoldWeekend: { bonus: 2.0, duration: "weekend" },
    goldRush: { bonus: 1.5, duration: "event" },
    platinumHotDeal: { bonus: 1.25, duration: "limited" },
  },
};
