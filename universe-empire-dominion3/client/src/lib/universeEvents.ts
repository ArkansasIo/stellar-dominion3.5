export interface UniverseEvent {
  id: string;
  title: string;
  description: string;
  type: "solar_flare" | "meteor_shower" | "cosmic_collision" | "wormhole_opening" | "wormhole_storm" | "stronghold_siege" | "frontier_incursion" | "faction_war" | "market_surge" | "plague" | "discovery";
  affectedSectors?: string[]; // Galaxy coordinates like "1:1" or "1:*" for all of galaxy 1
  severity: number; // 1-10
  startTime: number;
  endTime: number;
  effects: {
    resourceBonus?: number; // percentage
    productionBonus?: number;
    combatModifier?: number;
    fleetSpeedModifier?: number;
    dangerIncrease?: number;
  };
  active: boolean;
}

export interface DebrisField {
  id: string;
  name: string;
  coordinates: string;
  resources: {
    metal: number;
    crystal: number;
    deuterium: number;
  };
  harvestProgress: number; // 0-100
  maxCapacity: number;
  harvestedBy?: string;
  createdAt: number;
  expiresAt: number; // Auto-clears after time
}

export const UNIVERSE_EVENTS: UniverseEvent[] = [
  {
    id: "event_solar_flare_1",
    title: "Solar Flare Warning",
    description: "Intense solar flares detected across Galaxy 1",
    type: "solar_flare",
    affectedSectors: ["1:*"],
    severity: 6,
    startTime: Date.now() + 3600000,
    endTime: Date.now() + 7200000,
    effects: { dangerIncrease: 20, fleetSpeedModifier: -0.15 },
    active: false
  },
  {
    id: "event_meteor_shower_1",
    title: "Meteor Shower Alert",
    description: "Dense meteor field detected in sector 1:100",
    type: "meteor_shower",
    affectedSectors: ["1:100"],
    severity: 5,
    startTime: Date.now() + 1800000,
    endTime: Date.now() + 5400000,
    effects: { dangerIncrease: 25, combatModifier: 1.1 },
    active: false
  },
  {
    id: "event_discovery_1",
    title: "Ancient Artifact Discovery",
    description: "Researchers have detected an ancient artifact in deep space",
    type: "discovery",
    severity: 3,
    startTime: Date.now(),
    endTime: Date.now() + 86400000,
    effects: { resourceBonus: 15 },
    active: true
  },
  {
    id: "event_market_surge_1",
    title: "Market Surge - Crystal Demand",
    description: "High demand for crystal throughout the universe",
    type: "market_surge",
    severity: 4,
    startTime: Date.now(),
    endTime: Date.now() + 43200000,
    effects: { resourceBonus: 30 },
    active: true
  },
  {
    id: "event_wormhole_storm_1",
    title: "Wormhole Storm Front",
    description: "Spatial turbulence is creating unstable exits and rare traversal opportunities across frontier sectors.",
    type: "wormhole_storm",
    affectedSectors: ["5:*", "6:*"],
    severity: 8,
    startTime: Date.now(),
    endTime: Date.now() + 28800000,
    effects: { fleetSpeedModifier: 0.1, dangerIncrease: 35, productionBonus: 10 },
    active: true
  },
  {
    id: "event_stronghold_siege_1",
    title: "Stronghold Siege Window",
    description: "A contested frontier stronghold has entered a vulnerability cycle, drawing fleets and raiders into the region.",
    type: "stronghold_siege",
    affectedSectors: ["6:044"],
    severity: 9,
    startTime: Date.now() + 1800000,
    endTime: Date.now() + 12600000,
    effects: { combatModifier: 1.15, dangerIncrease: 30 },
    active: false
  }
];

export const DEBRIS_FIELDS: DebrisField[] = [
  {
    id: "debris_1",
    name: "Battle Remnants - Alpha Sector",
    coordinates: "1:102:7",
    resources: { metal: 50000, crystal: 30000, deuterium: 10000 },
    harvestProgress: 0,
    maxCapacity: 100000,
    createdAt: Date.now() - 86400000,
    expiresAt: Date.now() + 604800000
  },
  {
    id: "debris_2",
    name: "Destroyed Asteroid - Beta Sector",
    coordinates: "1:105:5",
    resources: { metal: 100000, crystal: 20000, deuterium: 5000 },
    harvestProgress: 35,
    maxCapacity: 150000,
    harvestedBy: "Commander",
    createdAt: Date.now() - 172800000,
    expiresAt: Date.now() + 432000000
  },
  {
    id: "debris_3",
    name: "Exploded Station - Gamma Sector",
    coordinates: "1:110:3",
    resources: { metal: 200000, crystal: 150000, deuterium: 80000 },
    harvestProgress: 0,
    maxCapacity: 500000,
    createdAt: Date.now() - 43200000,
    expiresAt: Date.now() + 864000000
  }
];

export function generateRandomEvent(): UniverseEvent {
  const types: UniverseEvent["type"][] = ["solar_flare", "meteor_shower", "cosmic_collision", "wormhole_opening", "wormhole_storm", "stronghold_siege", "market_surge"];
  const type = types[Math.floor(Math.random() * types.length)];
  const now = Date.now();
  
  return {
    id: `event_random_${now}`,
    title: `Random ${type} Event`,
    description: `A ${type} event has been detected`,
    type,
    severity: Math.ceil(Math.random() * 10),
    startTime: now + Math.random() * 3600000,
    endTime: now + 3600000 + Math.random() * 7200000,
    effects: {
      dangerIncrease: Math.random() * 30,
      fleetSpeedModifier: -0.1 + Math.random() * 0.2
    },
    active: false
  };
}

export function getActiveEvents(events: UniverseEvent[]): UniverseEvent[] {
  const now = Date.now();
  return events.filter(e => e.startTime <= now && e.endTime >= now && e.active);
}

export function calculateEventModifiers(events: UniverseEvent[]) {
  const activeEvents = getActiveEvents(events);
  const modifiers = {
    resourceBonus: 0,
    productionBonus: 0,
    combatModifier: 1,
    fleetSpeedModifier: 1,
    dangerIncrease: 0
  };
  
  activeEvents.forEach(event => {
    if (event.effects.resourceBonus) modifiers.resourceBonus += event.effects.resourceBonus;
    if (event.effects.productionBonus) modifiers.productionBonus += event.effects.productionBonus;
    if (event.effects.combatModifier) modifiers.combatModifier *= event.effects.combatModifier;
    if (event.effects.fleetSpeedModifier) modifiers.fleetSpeedModifier *= (1 + event.effects.fleetSpeedModifier);
    if (event.effects.dangerIncrease) modifiers.dangerIncrease += event.effects.dangerIncrease;
  });
  
  return modifiers;
}
