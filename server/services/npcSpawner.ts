/**
 * NPC Spawner Service
 * Handles spawning NPC entities (fleets, stations, colonies, pirates, mercenaries)
 * across the universe based on race territories, conflict zones, and procedural rules.
 * @tag #npc #spawner #fleets #pirates #mercenaries #service
 */

import { NPC_RACES, type NPCRace } from '../../Source/Shared/config/npcRaces';
import { PIRATE_FACTIONS, type PirateFaction } from '../../Source/Shared/config/pirateFactions';
import { MERCENARY_GUILDS, CONTRACT_TYPES, type MercenaryGuild, type ContractType } from '../../Source/Shared/config/mercenaryContracts';
import { UNIVERSE_CONFIG } from '../../Source/Shared/config/universeConfig';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface Coord {
  galaxy: number;
  sector: number;
  system: number;
}

export interface SpawnEvent {
  type: 'npc_fleet' | 'npc_station' | 'npc_colony' | 'pirate_raid' | 'mercenary_contract' | 'anomaly' | 'derelict' | 'trader_convoy';
  location: Coord;
  raceId?: string;
  factionId?: string;
  data: Record<string, any>;
  spawnTurn: number;
  expiryTurn?: number;
}

export interface SpawnResult {
  success: boolean;
  entityId?: string;
  entityType: string;
  location: Coord;
  message: string;
}

export interface NPCFleet {
  id: string;
  raceId: string;
  name: string;
  ships: { type: string; count: number; power: number }[];
  totalPower: number;
  location: Coord;
  destination?: Coord;
  status: 'idle' | 'moving' | 'patrolling' | 'engaged';
  spawnTurn: number;
}

export interface NPCStation {
  id: string;
  raceId: string;
  name: string;
  type: string;
  level: number;
  location: Coord;
  defense: number;
  status: 'active' | 'damaged' | 'destroyed';
  spawnTurn: number;
}

export interface NPCColony {
  id: string;
  raceId: string;
  name: string;
  planetId: string;
  location: Coord;
  population: number;
  developmentLevel: number;
  status: 'fledgling' | 'growing' | 'established' | 'major';
  spawnTurn: number;
}

export interface TerritoryEntry {
  raceId: string;
  controlledSystems: string[];
  borderSystems: string[];
  lastExpansionTurn: number;
}

export type SpawnEventType = SpawnEvent['type'];

// ============================================================================
// SPAWN CONFIGURATION
// ============================================================================

const SPAWN_INTERVALS: Record<SpawnEventType, number> = {
  npc_fleet: 5,
  npc_station: 10,
  npc_colony: 15,
  pirate_raid: 4,
  mercenary_contract: 6,
  anomaly: 8,
  derelict: 12,
  trader_convoy: 3,
};

const MAX_ACTIVE_EVENTS: Record<SpawnEventType, number> = {
  npc_fleet: 80,
  npc_station: 40,
  npc_colony: 30,
  pirate_raid: 25,
  mercenary_contract: 20,
  anomaly: 15,
  derelict: 30,
  trader_convoy: 10,
};

const BASE_SPAWN_CHANCE: Record<SpawnEventType, number> = {
  npc_fleet: 0.6,
  npc_station: 0.3,
  npc_colony: 0.2,
  pirate_raid: 0.45,
  mercenary_contract: 0.35,
  anomaly: 0.15,
  derelict: 0.25,
  trader_convoy: 0.5,
};

const ANOMALY_TYPES = [
  'spatial_anomaly',
  'temporal_rift',
  'gravitational_well',
  'energetic_nebula',
  'quantum_fluctuation',
  'dimensional_tear',
  'subspace_disturbance',
];

const DERELICT_TYPES = [
  'abandoned_freighter',
  'destroyed_warship',
  'crashed_scout',
  'derelict_station',
  'ancient_probe',
  'hulk_of_unknown_origin',
];

const STATION_TYPES = [
  'orbital_defense',
  'trade_hub',
  'research_outpost',
  'shipyard',
  'mining_station',
  'communications_relay',
  'fortress',
];

const FLEET_SHIP_TEMPLATES: Record<string, { type: string; basePower: number }[]> = {
  military: [
    { type: 'Frigate', basePower: 150 },
    { type: 'Cruiser', basePower: 400 },
    { type: 'Battlecruiser', basePower: 900 },
    { type: 'Dreadnought', basePower: 1200 },
  ],
  science: [
    { type: 'Science Vessel', basePower: 100 },
    { type: 'Research Cruiser', basePower: 300 },
    { type: 'Observation Ship', basePower: 200 },
  ],
  trade: [
    { type: 'Trade Freighter', basePower: 60 },
    { type: 'Cargo Hauler', basePower: 100 },
    { type: 'Merchant Cruiser', basePower: 250 },
  ],
  hive: [
    { type: 'Drone', basePower: 45 },
    { type: 'Assimilation Cube', basePower: 1000 },
    { type: 'Worker Ship', basePower: 80 },
  ],
  ancient: [
    { type: 'Timeship', basePower: 700 },
    { type: 'Gate Ship', basePower: 500 },
    { type: 'Guardian', basePower: 600 },
  ],
};

// ============================================================================
// SEEDED RANDOM NUMBER GENERATOR
// ============================================================================

class SeededRandom {
  private seed: number;

  constructor(seed: string) {
    this.seed = 0;
    for (let i = 0; i < seed.length; i++) {
      this.seed = ((this.seed << 5) - this.seed + seed.charCodeAt(i)) | 0;
    }
    this.seed = Math.abs(this.seed);
  }

  next(): number {
    this.seed = (this.seed * 1664525 + 1013904223) | 0;
    return (this.seed >>> 0) / 4294967296;
  }

  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  pick<T>(arr: T[]): T {
    return arr[this.nextInt(0, arr.length - 1)];
  }
}

// ============================================================================
// NPCSpawner CLASS
// ============================================================================

export class NPCSpawner {
  private universeSeed: string;
  private turn: number;
  private activeSpawns: Map<string, SpawnEvent>;
  private territoryMap: Map<string, TerritoryEntry>;
  private rng: SeededRandom;
  private lastSpawnCheck: Map<SpawnEventType, number>;
  private spawnedEntityCounts: Map<SpawnEventType, number>;
  private npcFleets: Map<string, NPCFleet>;
  private npcStations: Map<string, NPCStation>;
  private npcColonies: Map<string, NPCColony>;

  constructor(universeSeed: string) {
    this.universeSeed = universeSeed;
    this.turn = 0;
    this.activeSpawns = new Map();
    this.territoryMap = new Map();
    this.rng = new SeededRandom(universeSeed);
    this.lastSpawnCheck = new Map();
    this.spawnedEntityCounts = new Map();
    this.npcFleets = new Map();
    this.npcStations = new Map();
    this.npcColonies = new Map();

    for (const type of Object.keys(SPAWN_INTERVALS) as SpawnEventType[]) {
      this.lastSpawnCheck.set(type, 0);
      this.spawnedEntityCounts.set(type, 0);
    }
  }

  // --------------------------------------------------------------------------
  // MAIN TURN PROCESSING
  // --------------------------------------------------------------------------

  processTurn(turn: number): SpawnEvent[] {
    this.turn = turn;
    const events: SpawnEvent[] = [];

    this.expireOldSpawns(turn);

    const npcFleetEvents = this.processRaceSpawning(turn);
    events.push(...npcFleetEvents);

    const pirateEvents = this.processPirateSpawning(turn);
    events.push(...pirateEvents);

    const mercenaryEvents = this.processMercenarySpawning(turn);
    events.push(...mercenaryEvents);

    const envEvents = this.processEnvironmentalSpawning(turn);
    events.push(...envEvents);

    return events;
  }

  // --------------------------------------------------------------------------
  // RACE SPAWNING
  // --------------------------------------------------------------------------

  spawnRaceTerritory(raceId: string, galaxy: number, sector: number): SpawnEvent[] {
    const race = this.getRaceById(raceId);
    if (!race) return [];

    const events: SpawnEvent[] = [];
    const territorySize = race.territorySize;

    const territoryKey = `${galaxy}-${sector}-${raceId}`;
    const territory = this.territoryMap.get(territoryKey) ?? {
      raceId,
      controlledSystems: [],
      borderSystems: [],
      lastExpansionTurn: this.turn,
    };

    for (let i = 0; i < territorySize; i++) {
      const systemIndex = this.rng.nextInt(0, UNIVERSE_CONFIG.size.systemsPerSector - 1);
      const systemKey = `${galaxy}-${sector}-${systemIndex}`;

      if (!territory.controlledSystems.includes(systemKey)) {
        territory.controlledSystems.push(systemKey);
      }
    }

    territory.borderSystems = this.calculateBorderSystems(territory);
    this.territoryMap.set(territoryKey, territory);

    const colonyEvent = this.spawnRaceColony(raceId, `${raceId}-colony-${galaxy}-${sector}-${this.turn}`);
    if (colonyEvent) events.push(colonyEvent);

    const fleetCoord: Coord = {
      galaxy,
      sector,
      system: this.rng.nextInt(0, UNIVERSE_CONFIG.size.systemsPerSector - 1),
    };
    const fleetEvent = this.spawnRaceFleet(raceId, fleetCoord);
    if (fleetEvent) events.push(fleetEvent);

    const stationCoord: Coord = {
      galaxy,
      sector,
      system: this.rng.nextInt(0, UNIVERSE_CONFIG.size.systemsPerSector - 1),
    };
    const stationEvent = this.spawnRaceStation(raceId, stationCoord);
    if (stationEvent) events.push(stationEvent);

    return events;
  }

  spawnRaceFleet(raceId: string, location: Coord): SpawnEvent | null {
    if (!this.canSpawn('npc_fleet')) return null;

    const race = this.getRaceById(raceId);
    if (!race) return null;

    const powerLevel = race.fleetStrength;
    const fleet = this.generateFleet(raceId, powerLevel);
    this.npcFleets.set(fleet.id, fleet);

    const event: SpawnEvent = {
      type: 'npc_fleet',
      location,
      raceId,
      data: {
        fleetId: fleet.id,
        name: fleet.name,
        totalPower: fleet.totalPower,
        shipCount: fleet.ships.reduce((sum, s) => sum + s.count, 0),
      },
      spawnTurn: this.turn,
      expiryTurn: this.turn + 100,
    };

    this.registerSpawn(event);
    return event;
  }

  spawnRaceStation(raceId: string, location: Coord): SpawnEvent | null {
    if (!this.canSpawn('npc_station')) return null;

    const race = this.getRaceById(raceId);
    if (!race) return null;

    const stationType = this.selectStationType(race);
    const level = this.rng.nextInt(1, 5);
    const station = this.generateStation(raceId, stationType, level);
    this.npcStations.set(station.id, station);

    const event: SpawnEvent = {
      type: 'npc_station',
      location,
      raceId,
      data: {
        stationId: station.id,
        name: station.name,
        stationType,
        level,
        defense: station.defense,
      },
      spawnTurn: this.turn,
      expiryTurn: this.turn + 200,
    };

    this.registerSpawn(event);
    return event;
  }

  spawnRaceColony(raceId: string, planetId: string): SpawnEvent | null {
    if (!this.canSpawn('npc_colony')) return null;

    const race = this.getRaceById(raceId);
    if (!race) return null;

    const colony: NPCColony = {
      id: `colony-${raceId}-${this.turn}-${this.rng.nextInt(0, 9999)}`,
      raceId,
      name: `${race.name} Colony ${this.rng.nextInt(1, 99)}`,
      planetId,
      location: {
        galaxy: this.rng.nextInt(0, UNIVERSE_CONFIG.size.galaxyCount - 1),
        sector: this.rng.nextInt(0, UNIVERSE_CONFIG.size.sectorsPerGalaxy - 1),
        system: this.rng.nextInt(0, UNIVERSE_CONFIG.size.systemsPerSector - 1),
      },
      population: this.rng.nextInt(1000, 50000),
      developmentLevel: 1,
      status: 'fledgling',
      spawnTurn: this.turn,
    };
    this.npcColonies.set(colony.id, colony);

    const event: SpawnEvent = {
      type: 'npc_colony',
      location: colony.location,
      raceId,
      data: {
        colonyId: colony.id,
        name: colony.name,
        planetId,
        population: colony.population,
      },
      spawnTurn: this.turn,
      expiryTurn: this.turn + 500,
    };

    this.registerSpawn(event);
    return event;
  }

  // --------------------------------------------------------------------------
  // PIRATE SPAWNING
  // --------------------------------------------------------------------------

  spawnPirateRaid(factionId: string, targetSector: number): SpawnEvent | null {
    if (!this.canSpawn('pirate_raid')) return null;

    const faction = this.getPirateFactionById(factionId);
    if (!faction) return null;

    const fleetPower = this.calculatePirateFleetPower(faction);
    const fleetSize = this.rng.nextInt(3, Math.min(faction.maxFleetSize, 20));

    const location: Coord = {
      galaxy: this.rng.nextInt(0, UNIVERSE_CONFIG.size.galaxyCount - 1),
      sector: targetSector,
      system: this.rng.nextInt(0, UNIVERSE_CONFIG.size.systemsPerSector - 1),
    };

    const event: SpawnEvent = {
      type: 'pirate_raid',
      location,
      factionId,
      data: {
        factionName: faction.name,
        fleetPower,
        fleetSize,
        aggression: faction.aggression,
        preferredTargets: faction.preferredTargets,
        raidRange: faction.raidRange,
      },
      spawnTurn: this.turn,
      expiryTurn: this.turn + faction.raidFrequency,
    };

    this.registerSpawn(event);
    return event;
  }

  spawnPirateFleet(factionId: string, location: Coord): SpawnEvent | null {
    if (!this.canSpawn('pirate_raid')) return null;

    const faction = this.getPirateFactionById(factionId);
    if (!faction) return null;

    const fleetPower = this.calculatePirateFleetPower(faction);

    const event: SpawnEvent = {
      type: 'pirate_raid',
      location,
      factionId,
      data: {
        factionName: faction.name,
        fleetPower,
        fleetComposition: faction.fleetComposition,
        stealth: faction.stealth,
      },
      spawnTurn: this.turn,
      expiryTurn: this.turn + 20,
    };

    this.registerSpawn(event);
    return event;
  }

  // --------------------------------------------------------------------------
  // MERCENARY SPAWNING
  // --------------------------------------------------------------------------

  spawnMercenaryContract(guildId: string, location: Coord): SpawnEvent | null {
    if (!this.canSpawn('mercenary_contract')) return null;

    const guild = this.getGuildById(guildId);
    if (!guild) return null;

    const contractType = this.rng.pick(guild.availableContracts);
    const typeDef = CONTRACT_TYPES[contractType];
    const difficulty = this.rng.pick(typeDef.allowedDifficulties);

    const baseReward = this.calculateContractReward(difficulty);

    const event: SpawnEvent = {
      type: 'mercenary_contract',
      location,
      raceId: guild.headquartersRaceId,
      factionId: guildId,
      data: {
        guildName: guild.name,
        contractType,
        contractName: this.generateContractName(contractType),
        difficulty,
        reward: baseReward,
        duration: typeDef.baseDuration,
        riskLevel: typeDef.baseRiskLevel,
      },
      spawnTurn: this.turn,
      expiryTurn: this.turn + 30,
    };

    this.registerSpawn(event);
    return event;
  }

  spawnMercenaryPatrol(guildId: string, sector: number): SpawnEvent | null {
    if (!this.canSpawn('mercenary_contract')) return null;

    const guild = this.getGuildById(guildId);
    if (!guild) return null;

    const location: Coord = {
      galaxy: this.rng.nextInt(0, UNIVERSE_CONFIG.size.galaxyCount - 1),
      sector,
      system: this.rng.nextInt(0, UNIVERSE_CONFIG.size.systemsPerSector - 1),
    };

    const event: SpawnEvent = {
      type: 'mercenary_contract',
      location,
      raceId: guild.headquartersRaceId,
      factionId: guildId,
      data: {
        guildName: guild.name,
        contractType: 'defender',
        contractName: `${guild.name} Patrol`,
        difficulty: 'easy',
        reward: 500,
        duration: 5,
        patrolSector: sector,
      },
      spawnTurn: this.turn,
      expiryTurn: this.turn + 25,
    };

    this.registerSpawn(event);
    return event;
  }

  // --------------------------------------------------------------------------
  // ENVIRONMENTAL SPAWNING
  // --------------------------------------------------------------------------

  spawnAnomaly(location: Coord): SpawnEvent | null {
    if (!this.canSpawn('anomaly')) return null;

    const anomalyType = this.rng.pick(ANOMALY_TYPES);
    const severity = this.rng.nextInt(1, 10);

    const event: SpawnEvent = {
      type: 'anomaly',
      location,
      data: {
        anomalyType,
        severity,
        name: this.generateAnomalyName(anomalyType),
        description: this.getAnomalyDescription(anomalyType),
        rewards: severity > 7 ? ['rare_tech', 'ancient_artifact'] : ['resources', 'data'],
      },
      spawnTurn: this.turn,
      expiryTurn: this.turn + 50,
    };

    this.registerSpawn(event);
    return event;
  }

  spawnDerelict(location: Coord): SpawnEvent | null {
    if (!this.canSpawn('derelict')) return null;

    const derelictType = this.rng.pick(DERELICT_TYPES);
    const salvageValue = this.rng.nextInt(100, 5000);

    const event: SpawnEvent = {
      type: 'derelict',
      location,
      data: {
        derelictType,
        salvageValue,
        name: this.generateDerelictName(derelictType),
        condition: this.rng.pick(['poor', 'fair', 'good', 'excellent']),
        hasBoobyTrap: this.rng.next() < 0.15,
      },
      spawnTurn: this.turn,
      expiryTurn: this.turn + 40,
    };

    this.registerSpawn(event);
    return event;
  }

  spawnTraderConvoy(location: Coord, raceId: string): SpawnEvent | null {
    if (!this.canSpawn('trader_convoy')) return null;

    const race = this.getRaceById(raceId);
    if (!race) return null;

    const cargoValue = this.rng.nextInt(500, 10000);
    const escortStrength = Math.floor(race.fleetStrength * 0.3);

    const event: SpawnEvent = {
      type: 'trader_convoy',
      location,
      raceId,
      data: {
        raceName: race.name,
        cargoValue,
        escortStrength,
        cargoType: this.rng.pick(['raw_materials', 'technology', 'luxury_goods', 'military_supplies']),
        destination: this.getRandomSystemCoord(),
      },
      spawnTurn: this.turn,
      expiryTurn: this.turn + 15,
    };

    this.registerSpawn(event);
    return event;
  }

  // --------------------------------------------------------------------------
  // FLEET & STATION GENERATION
  // --------------------------------------------------------------------------

  generateFleet(raceId: string, powerLevel: number): NPCFleet {
    const race = this.getRaceById(raceId);
    const category = race?.category ?? 'military';
    const templates = FLEET_SHIP_TEMPLATES[category] ?? FLEET_SHIP_TEMPLATES.military;

    const ships: NPCFleet['ships'] = [];
    let remainingPower = powerLevel;

    const shuffled = [...templates].sort(() => this.rng.next() - 0.5);

    for (const template of shuffled) {
      if (remainingPower <= 0) break;

      const maxCount = Math.max(1, Math.floor(remainingPower / template.basePower));
      const count = this.rng.nextInt(1, Math.min(maxCount, 10));

      if (count > 0) {
        ships.push({
          type: template.type,
          count,
          power: template.basePower * count,
        });
        remainingPower -= template.basePower * count;
      }
    }

    const totalPower = ships.reduce((sum, s) => sum + s.power, 0);

    return {
      id: `fleet-${raceId}-${this.turn}-${this.rng.nextInt(0, 9999)}`,
      raceId,
      name: this.generateFleetName(race, ships),
      ships,
      totalPower,
      location: this.getRandomSystemCoord(),
      status: 'idle',
      spawnTurn: this.turn,
    };
  }

  generateStation(raceId: string, type: string, level: number): NPCStation {
    const baseDefense = 200 + level * 150;

    return {
      id: `station-${raceId}-${this.turn}-${this.rng.nextInt(0, 9999)}`,
      raceId,
      name: this.generateStationName(raceId, type),
      type,
      level,
      location: this.getRandomSystemCoord(),
      defense: baseDefense,
      status: 'active',
      spawnTurn: this.turn,
    };
  }

  // --------------------------------------------------------------------------
  // TERRITORY CONTROL
  // --------------------------------------------------------------------------

  initializeRaceTerritories(): void {
    for (const race of NPC_RACES) {
      const galaxy = this.rng.nextInt(0, UNIVERSE_CONFIG.size.galaxyCount - 1);
      const sector = this.rng.nextInt(0, UNIVERSE_CONFIG.size.sectorsPerGalaxy - 1);

      this.spawnRaceTerritory(race.id, galaxy, sector);
    }
  }

  expandTerritory(raceId: string): SpawnEvent[] {
    const events: SpawnEvent[] = [];
    const race = this.getRaceById(raceId);
    if (!race) return events;

    const existingEntries = Array.from(this.territoryMap.values()).filter(t => t.raceId === raceId);
    if (existingEntries.length === 0) return events;

    const sourceEntry = this.rng.pick(existingEntries);
    if (sourceEntry.borderSystems.length === 0) return events;

    const borderSystem = this.rng.pick(sourceEntry.borderSystems);
    const [galaxy, sector] = borderSystem.split('-').map(Number);

    if (race.bonuses.expansion > 15 && this.rng.next() < 0.3) {
      const fleetEvent = this.spawnRaceFleet(raceId, { galaxy, sector, system: this.rng.nextInt(0, UNIVERSE_CONFIG.size.systemsPerSector - 1) });
      if (fleetEvent) events.push(fleetEvent);
    }

    if (race.bonuses.expansion > 10 && this.rng.next() < 0.2) {
      const stationEvent = this.spawnRaceStation(raceId, { galaxy, sector, system: this.rng.nextInt(0, UNIVERSE_CONFIG.size.systemsPerSector - 1) });
      if (stationEvent) events.push(stationEvent);
    }

    return events;
  }

  defendTerritory(raceId: string, threatLocation: Coord): SpawnEvent[] {
    const events: SpawnEvent[] = [];
    const race = this.getRaceById(raceId);
    if (!race) return events;

    const defensePower = Math.floor(race.fleetStrength * (0.5 + race.bonuses.combat / 100));
    const fleet = this.generateFleet(raceId, defensePower);
    fleet.location = threatLocation;
    fleet.status = 'engaged';
    this.npcFleets.set(fleet.id, fleet);

    const event: SpawnEvent = {
      type: 'npc_fleet',
      location: threatLocation,
      raceId,
      data: {
        fleetId: fleet.id,
        name: fleet.name,
        totalPower: fleet.totalPower,
        purpose: 'territory_defense',
        threatLocation,
      },
      spawnTurn: this.turn,
      expiryTurn: this.turn + 10,
    };

    this.registerSpawn(event);
    events.push(event);

    if (race.bonuses.combat > 20 && this.rng.next() < 0.4) {
      const secondFleet = this.generateFleet(raceId, Math.floor(defensePower * 0.6));
      secondFleet.location = threatLocation;
      secondFleet.status = 'engaged';
      this.npcFleets.set(secondFleet.id, secondFleet);

      const event2: SpawnEvent = {
        type: 'npc_fleet',
        location: threatLocation,
        raceId,
        data: {
          fleetId: secondFleet.id,
          name: secondFleet.name,
          totalPower: secondFleet.totalPower,
          purpose: 'reinforcement',
        },
        spawnTurn: this.turn,
        expiryTurn: this.turn + 10,
      };

      this.registerSpawn(event2);
      events.push(event2);
    }

    return events;
  }

  // --------------------------------------------------------------------------
  // SPAWN PROBABILITY & RULES
  // --------------------------------------------------------------------------

  private processRaceSpawning(turn: number): SpawnEvent[] {
    const events: SpawnEvent[] = [];

    for (const race of NPC_RACES) {
      if (!this.shouldRaceSpawn(race, turn)) continue;

      const chance = this.calculateRaceSpawnChance(race, turn);
      if (this.rng.next() > chance) continue;

      const location = this.findSpawnLocationForRace(race);

      const spawnType = this.rng.pick(['npc_fleet', 'npc_station', 'npc_colony'] as SpawnEventType[]);

      switch (spawnType) {
        case 'npc_fleet': {
          const ev = this.spawnRaceFleet(race.id, location);
          if (ev) events.push(ev);
          break;
        }
        case 'npc_station': {
          const ev = this.spawnRaceStation(race.id, location);
          if (ev) events.push(ev);
          break;
        }
        case 'npc_colony': {
          const ev = this.spawnRaceColony(race.id, `${race.id}-planet-${turn}`);
          if (ev) events.push(ev);
          break;
        }
      }
    }

    return events;
  }

  private processPirateSpawning(turn: number): SpawnEvent[] {
    const events: SpawnEvent[] = [];

    for (const faction of PIRATE_FACTIONS) {
      if (!this.shouldPirateSpawn(faction, turn)) continue;

      const chance = this.calculatePirateSpawnChance(faction, turn);
      if (this.rng.next() > chance) continue;

      const targetSector = this.rng.nextInt(0, UNIVERSE_CONFIG.size.sectorsPerGalaxy - 1);
      const ev = this.spawnPirateRaid(faction.id, targetSector);
      if (ev) events.push(ev);
    }

    return events;
  }

  private processMercenarySpawning(turn: number): SpawnEvent[] {
    const events: SpawnEvent[] = [];

    for (const guild of MERCENARY_GUILDS) {
      if (!this.shouldMercenarySpawn(guild, turn)) continue;

      const chance = this.calculateMercenarySpawnChance(guild, turn);
      if (this.rng.next() > chance) continue;

      const location = this.getRandomSystemCoord();
      const ev = this.spawnMercenaryContract(guild.id, location);
      if (ev) events.push(ev);
    }

    return events;
  }

  private processEnvironmentalSpawning(turn: number): SpawnEvent[] {
    const events: SpawnEvent[] = [];

    if (this.shouldEnvironmentalSpawn('anomaly', turn)) {
      const location = this.getRandomSystemCoord();
      const ev = this.spawnAnomaly(location);
      if (ev) events.push(ev);
    }

    if (this.shouldEnvironmentalSpawn('derelict', turn)) {
      const location = this.getRandomUnoccupiedSystem();
      const ev = this.spawnDerelict(location);
      if (ev) events.push(ev);
    }

    if (this.shouldEnvironmentalSpawn('trader_convoy', turn)) {
      const alliedPairs = this.findAlliedRacePair();
      if (alliedPairs) {
        const { race1, race2 } = alliedPairs;
        const origin = this.findRaceHomeLocation(race1.id);
        if (origin) {
          const ev = this.spawnTraderConvoy(origin, race1.id);
          if (ev) events.push(ev);
        }
      }
    }

    return events;
  }

  // --------------------------------------------------------------------------
  // SPAWN CHANCE CALCULATION
  // --------------------------------------------------------------------------

  calculateSpawnChance(eventType: SpawnEventType, location: Coord, turn: number): number {
    let baseChance = BASE_SPAWN_CHANCE[eventType];

    baseChance += this.getLocationModifier(eventType, location);

    baseChance += this.getTurnScaling(eventType, turn);

    baseChance += this.getTerritoryModifier(eventType, location);

    return Math.max(0.01, Math.min(0.95, baseChance));
  }

  getSpawnInterval(eventType: SpawnEventType): number {
    return SPAWN_INTERVALS[eventType];
  }

  get_maxActiveEvents(eventType: SpawnEventType): number {
    return MAX_ACTIVE_EVENTS[eventType];
  }

  private calculateRaceSpawnChance(race: NPCRace, turn: number): number {
    let chance = race.spawnWeight / 100;

    chance *= 1 + turn / 500;

    if (race.category === 'military') chance *= 1.1;
    if (race.category === 'science') chance *= 0.9;

    const currentCount = this.getSpawnCountOfType('npc_fleet', race.id);
    const maxFleets = Math.floor(MAX_ACTIVE_EVENTS.npc_fleet / NPC_RACES.length * 2);
    if (currentCount >= maxFleets) chance *= 0.2;

    return Math.max(0.01, Math.min(0.9, chance));
  }

  private calculatePirateSpawnChance(faction: PirateFaction, turn: number): number {
    let chance = faction.spawnWeight / 100;

    chance *= 1 + turn / 400;

    const currentRaids = this.getSpawnCountOfType('pirate_raid', undefined, faction.id);
    if (currentRaids >= 3) chance *= 0.3;

    chance *= faction.aggression / 50;

    return Math.max(0.01, Math.min(0.8, chance));
  }

  private calculateMercenarySpawnChance(guild: MercenaryGuild, turn: number): number {
    let chance = 0.3;

    chance *= 1 + turn / 600;

    const currentContracts = this.getSpawnCountOfType('mercenary_contract', undefined, guild.id);
    if (currentContracts >= 2) chance *= 0.3;

    return Math.max(0.01, Math.min(0.7, chance));
  }

  private calculatePirateFleetPower(faction: PirateFaction): number {
    const { scouts, raiders, carriers, capitals } = faction.fleetComposition;
    const basePower = scouts * 50 + raiders * 150 + carriers * 400 + capitals * 800;
    const scale = 1 + this.turn / 200;
    return Math.floor(basePower * scale);
  }

  private calculateContractReward(difficulty: string): number {
    switch (difficulty) {
      case 'easy': return this.rng.nextInt(300, 800);
      case 'medium': return this.rng.nextInt(800, 2000);
      case 'hard': return this.rng.nextInt(2000, 5000);
      case 'extreme': return this.rng.nextInt(5000, 12000);
      case 'legendary': return this.rng.nextInt(12000, 30000);
      default: return 500;
    }
  }

  // --------------------------------------------------------------------------
  // LOCATION HELPERS
  // --------------------------------------------------------------------------

  private getLocationModifier(eventType: SpawnEventType, location: Coord): number {
    let modifier = 0;

    const territory = this.getTerritoryAt(location);
    if (territory) {
      if (eventType === 'pirate_raid') modifier -= 0.15;
      if (eventType === 'npc_fleet') modifier += 0.05;
      if (eventType === 'trader_convoy') modifier += 0.1;
    } else {
      if (eventType === 'derelict') modifier += 0.1;
      if (eventType === 'anomaly') modifier += 0.05;
    }

    return modifier;
  }

  private getTurnScaling(eventType: SpawnEventType, turn: number): number {
    const growthRate = turn / 1000;
    return growthRate * 0.1;
  }

  private getTerritoryModifier(eventType: SpawnEventType, location: Coord): number {
    const territory = this.getTerritoryAt(location);
    if (!territory) return 0;

    const entry = this.territoryMap.get(`${location.galaxy}-${location.sector}-${territory.raceId}`);
    if (!entry) return 0;

    const isBorder = entry.borderSystems.includes(
      `${location.galaxy}-${location.sector}-${location.system}`
    );

    if (isBorder) {
      if (eventType === 'pirate_raid') return 0.15;
      if (eventType === 'npc_fleet') return 0.1;
      if (eventType === 'mercenary_contract') return 0.1;
    }

    if (!isBorder) {
      if (eventType === 'trader_convoy') return 0.08;
      if (eventType === 'npc_colony') return 0.05;
    }

    return 0;
  }

  private findSpawnLocationForRace(race: NPCRace): Coord {
    const entries = Array.from(this.territoryMap.values()).filter(t => t.raceId === race.id);

    if (entries.length > 0 && this.rng.next() < 0.7) {
      const entry = this.rng.pick(entries);
      const systemStr = entry.controlledSystems.length > 0
        ? this.rng.pick(entry.controlledSystems)
        : entry.borderSystems.length > 0
          ? this.rng.pick(entry.borderSystems)
          : null;

      if (systemStr) {
        const [galaxy, sector, system] = systemStr.split('-').map(Number);
        return { galaxy, sector, system };
      }
    }

    return this.getRandomSystemCoord();
  }

  private getRandomSystemCoord(): Coord {
    return {
      galaxy: this.rng.nextInt(0, UNIVERSE_CONFIG.size.galaxyCount - 1),
      sector: this.rng.nextInt(0, UNIVERSE_CONFIG.size.sectorsPerGalaxy - 1),
      system: this.rng.nextInt(0, UNIVERSE_CONFIG.size.systemsPerSector - 1),
    };
  }

  private getRandomUnoccupiedSystem(): Coord {
    for (let attempt = 0; attempt < 20; attempt++) {
      const coord = this.getRandomSystemCoord();
      if (!this.getTerritoryAt(coord)) return coord;
    }
    return this.getRandomSystemCoord();
  }

  private findRaceHomeLocation(raceId: string): Coord | null {
    const entries = Array.from(this.territoryMap.values()).filter(t => t.raceId === raceId);
    if (entries.length === 0) return null;

    const entry = entries[0];
    if (entry.controlledSystems.length > 0) {
      const systemStr = entry.controlledSystems[0];
      const [galaxy, sector, system] = systemStr.split('-').map(Number);
      return { galaxy, sector, system };
    }
    return null;
  }

  private getTerritoryAt(location: Coord): TerritoryEntry | null {
    const systemKey = `${location.galaxy}-${location.sector}-${location.system}`;

    for (const [, territory] of this.territoryMap) {
      if (territory.controlledSystems.includes(systemKey)) {
        return territory;
      }
    }
    return null;
  }

  private calculateBorderSystems(territory: TerritoryEntry): string[] {
    const borders: string[] = [];

    for (const systemKey of territory.controlledSystems) {
      const [galaxy, sector, system] = systemKey.split('-').map(Number);

      const neighbors = [
        `${galaxy}-${sector}-${system - 1}`,
        `${galaxy}-${sector}-${system + 1}`,
        `${galaxy}-${sector - 1}-${system}`,
        `${galaxy}-${sector + 1}-${system}`,
      ];

      for (const neighbor of neighbors) {
        if (!territory.controlledSystems.includes(neighbor)) {
          if (!borders.includes(systemKey)) {
            borders.push(systemKey);
          }
          break;
        }
      }
    }

    return borders;
  }

  // --------------------------------------------------------------------------
  // SPAWN GATING
  // --------------------------------------------------------------------------

  private canSpawn(eventType: SpawnEventType): boolean {
    const activeCount = this.getSpawnCountByType(eventType);
    const maxEvents = MAX_ACTIVE_EVENTS[eventType];
    if (activeCount >= maxEvents) return false;

    const lastCheck = this.lastSpawnCheck.get(eventType) ?? 0;
    const interval = SPAWN_INTERVALS[eventType];
    if (this.turn - lastCheck < interval) return false;

    return true;
  }

  private shouldRaceSpawn(race: NPCRace, turn: number): boolean {
    if (turn < 3) return false;

    const spawnInterval = Math.max(3, Math.floor(10 - race.bonuses.expansion / 10));
    return turn % spawnInterval === 0;
  }

  private shouldPirateSpawn(faction: PirateFaction, turn: number): boolean {
    if (turn < 5) return false;

    return turn % faction.raidFrequency === 0;
  }

  private shouldMercenarySpawn(guild: MercenaryGuild, turn: number): boolean {
    if (turn < 8) return false;

    return turn % 6 === 0;
  }

  private shouldEnvironmentalSpawn(eventType: SpawnEventType, turn: number): boolean {
    if (turn < 2) return false;

    return turn % SPAWN_INTERVALS[eventType] === 0;
  }

  // --------------------------------------------------------------------------
  // SPAWN TRACKING
  // --------------------------------------------------------------------------

  private registerSpawn(event: SpawnEvent): void {
    const key = this.getSpawnKey(event);
    this.activeSpawns.set(key, event);

    const count = this.spawnedEntityCounts.get(event.type) ?? 0;
    this.spawnedEntityCounts.set(event.type, count + 1);

    this.lastSpawnCheck.set(event.type, this.turn);
  }

  private expireOldSpawns(currentTurn: number): void {
    for (const [key, event] of this.activeSpawns) {
      if (event.expiryTurn !== undefined && currentTurn > event.expiryTurn) {
        this.activeSpawns.delete(key);
      }
    }
  }

  private getSpawnKey(event: SpawnEvent): string {
    const id = event.data.fleetId ?? event.data.stationId ?? event.data.colonyId
      ?? event.data.factionId ?? `${event.type}-${event.location.galaxy}-${event.location.sector}-${event.location.system}`;
    return `${event.type}:${id}`;
  }

  private getSpawnCountByType(eventType: SpawnEventType): number {
    let count = 0;
    for (const event of this.activeSpawns.values()) {
      if (event.type === eventType) count++;
    }
    return count;
  }

  private getSpawnCountOfType(eventType: SpawnEventType, raceId?: string, factionId?: string): number {
    let count = 0;
    for (const event of this.activeSpawns.values()) {
      if (event.type !== eventType) continue;
      if (raceId && event.raceId !== raceId) continue;
      if (factionId && event.factionId !== factionId) continue;
      count++;
    }
    return count;
  }

  // --------------------------------------------------------------------------
  // NAME GENERATION
  // --------------------------------------------------------------------------

  private generateFleetName(race: NPCRace | undefined, ships: NPCFleet['ships']): string {
    const prefixes = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Omega', 'Sigma', 'Strike', 'Shield', 'Iron', 'Shadow'];
    const suffixes = ['Squadron', 'Flotilla', 'Armada', 'Task Force', 'Battle Group', 'Wing', 'Division'];
    const prefix = this.rng.pick(prefixes);
    const suffix = this.rng.pick(suffixes);
    const racePrefix = race ? race.name.split(' ')[0] : 'Unknown';
    return `${racePrefix} ${prefix} ${suffix}`;
  }

  private generateStationName(raceId: string, stationType: string): string {
    const race = this.getRaceById(raceId);
    const raceName = race?.name.split(' ')[0] ?? 'Deep';
    const typeNames: Record<string, string[]> = {
      orbital_defense: ['Bastion', 'Shield', 'Bulwark', 'Sentinel'],
      trade_hub: ['Exchange', 'Bazaar', 'Market', 'Crossroads'],
      research_outpost: ['Observatory', 'Lab', 'Institute', 'Nexus'],
      shipyard: ['Forge', 'Yard', 'Foundry', 'Construct'],
      mining_station: ['Extractor', 'Drill', 'Mine', 'Harvest'],
      communications_relay: ['Beacon', 'Relay', 'Tower', 'Signal'],
      fortress: ['Citadel', 'Fortress', 'Stronghold', 'Keep'],
    };
    const options = typeNames[stationType] ?? ['Station'];
    return `${raceName} ${this.rng.pick(options)} ${this.rng.nextInt(1, 99)}`;
  }

  private generateContractName(type: ContractType): string {
    const names: Record<ContractType, string[]> = {
      escort: ['Safe Passage', 'Shield Wall', 'Guardian Angel', 'Convoy Shield'],
      raider: ['Strike Force', 'Thunder Strike', 'Lightning Raid', 'Blitz Attack'],
      defender: ['Fortress Stand', 'Iron Wall', 'Last Bastion', 'Defiant Stand'],
      scout: ['Eagle Eye', 'Deep Scan', 'Pathfinder', 'Void Walker'],
      assassin: ['Silent Blade', 'Death Mark', 'Phantom Strike', 'Executioner'],
      smuggler: ['Shadow Run', 'Ghost Route', 'Black Cargo', 'Silent Transit'],
      bodyguard: ['Iron Shield', 'Living Fortress', 'Guardian Prime', 'Sentinel'],
      siege: ['Iron Fist', 'Doomsiege', 'Fortress Breaker', 'Battering Ram'],
      recon: ['Silent Observer', 'Deep Intelligence', 'Shadow Network', 'Eye in the Sky'],
      salvage: ['Salvage King', 'Wreck Diver', 'Derelict Hunter', 'Treasure Seeker'],
    };
    return this.rng.pick(names[type] ?? ['Operation']);
  }

  private generateAnomalyName(type: string): string {
    const adjectives = ['Strange', 'Mysterious', 'Uncharted', 'Anomalous', 'Peculiar', 'Baffling'];
    const nouns: Record<string, string[]> = {
      spatial_anomaly: ['Spatial Rift', 'Dimensional Fold', 'Warp Bubble'],
      temporal_rift: ['Time Fracture', 'Chronological Tear', 'Temporal Vortex'],
      gravitational_well: ['Gravity Sink', 'Mass Concentration', 'Graviton Field'],
      energetic_nebula: ['Plasma Storm', 'Ionic Cloud', 'Energy Matrix'],
      quantum_fluctuation: ['Quantum Foam', 'Probability Storm', 'Wave Collapse'],
      dimensional_tear: ['Dimensional Breach', 'Reality Tear', 'Planar Rift'],
      subspace_disturbance: ['Subspace Echo', 'Subspace Ripple', 'Comm Disruption'],
    };
    const options = nouns[type] ?? ['Phenomenon'];
    return `${this.rng.pick(adjectives)} ${this.rng.pick(options)}`;
  }

  private generateDerelictName(type: string): string {
    const prefixes = ['Lost', 'Forgotten', 'Abandoned', 'Ghost', 'Silent', 'Drifting'];
    const typeNames: Record<string, string[]> = {
      abandoned_freighter: ['Freighter', 'Cargo Hauler', 'Transport'],
      destroyed_warship: ['Warship', 'Battlecruiser', 'Frigate Wreckage'],
      crashed_scout: ['Scout Ship', 'Probe', 'Recon Vessel'],
      derelict_station: ['Station', 'Outpost', 'Platform'],
      ancient_probe: ['Probe', 'Relay', 'Beacon'],
      hulk_of_unknown_origin: ['Unknown Vessel', 'Anomalous Structure', 'Mystery Ship'],
    };
    const options = typeNames[type] ?? ['Wreckage'];
    return `${this.rng.pick(prefixes)} ${this.rng.pick(options)}`;
  }

  private getAnomalyDescription(type: string): string {
    const descriptions: Record<string, string> = {
      spatial_anomaly: 'A distortion in the fabric of space that warps sensors and threatens navigation.',
      temporal_rift: 'A crack in the timeline where past, present, and future bleed together.',
      gravitational_well: 'An intense gravitational concentration that pulls ships off course.',
      energetic_nebula: 'A swirling mass of ionized gas that interferes with shields and weapons.',
      quantum_fluctuation: 'Unpredictable quantum events that cause localized reality instabilities.',
      dimensional_tear: 'A breach between dimensions emitting exotic radiation and energy.',
      subspace_disturbance: 'Disruptions in subspace that cripple communications and warp drives.',
    };
    return descriptions[type] ?? 'An unexplained phenomenon defying conventional science.';
  }

  private selectStationType(race: NPCRace): string {
    if (race.category === 'military') {
      return this.rng.pick(['orbital_defense', 'fortress', 'shipyard']);
    }
    if (race.category === 'science') {
      return this.rng.pick(['research_outpost', 'communications_relay']);
    }
    if (race.category === 'trade') {
      return this.rng.pick(['trade_hub', 'mining_station']);
    }
    if (race.category === 'hive') {
      return this.rng.pick(['orbital_defense', 'shipyard']);
    }
    if (race.category === 'ancient') {
      return this.rng.pick(['research_outpost', 'communications_relay', 'fortress']);
    }
    return this.rng.pick(STATION_TYPES);
  }

  private findAlliedRacePair(): { race1: NPCRace; race2: NPCRace } | null {
    for (const race of NPC_RACES) {
      if (race.allianceAffinity.length > 0) {
        const allyId = this.rng.pick(race.allianceAffinity);
        const ally = this.getRaceById(allyId);
        if (ally) return { race1: race, race2: ally };
      }
    }
    return null;
  }

  // --------------------------------------------------------------------------
  // LOOKUP HELPERS
  // --------------------------------------------------------------------------

  private getRaceById(raceId: string): NPCRace | undefined {
    return NPC_RACES.find(r => r.id === raceId);
  }

  private getPirateFactionById(factionId: string): PirateFaction | undefined {
    return PIRATE_FACTIONS.find(f => f.id === factionId);
  }

  private getGuildById(guildId: string): MercenaryGuild | undefined {
    return MERCENARY_GUILDS.find(g => g.id === guildId);
  }

  // --------------------------------------------------------------------------
  // PUBLIC ACCESSORS
  // --------------------------------------------------------------------------

  getActiveSpawns(): Map<string, SpawnEvent> {
    return new Map(this.activeSpawns);
  }

  getTerritoryMapData(): Map<string, TerritoryEntry> {
    return new Map(this.territoryMap);
  }

  getNPCFleets(): Map<string, NPCFleet> {
    return new Map(this.npcFleets);
  }

  getNPCStations(): Map<string, NPCStation> {
    return new Map(this.npcStations);
  }

  getNPCColonies(): Map<string, NPCColony> {
    return new Map(this.npcColonies);
  }

  getActiveNPCsInSector(sector: number): (NPCFleet | NPCStation | NPCColony)[] {
    const results: (NPCFleet | NPCStation | NPCColony)[] = [];

    for (const fleet of this.npcFleets.values()) {
      if (fleet.location.sector === sector) results.push(fleet);
    }
    for (const station of this.npcStations.values()) {
      if (station.location.sector === sector) results.push(station);
    }
    for (const colony of this.npcColonies.values()) {
      if (colony.location.sector === sector) results.push(colony);
    }

    return results;
  }

  getSpawnEventsForTurn(turn: number): SpawnEvent[] {
    const events: SpawnEvent[] = [];
    for (const event of this.activeSpawns.values()) {
      if (event.spawnTurn === turn) {
        events.push(event);
      }
    }
    return events;
  }

  getTerritoryMap(): Map<string, TerritoryEntry> {
    return this.territoryMap;
  }

  getCurrentTurn(): number {
    return this.turn;
  }
}

// ============================================================================
// HELPER / FACTORY FUNCTIONS
// ============================================================================

let _globalSpawner: NPCSpawner | null = null;

export function initializeSpawner(seed: string): NPCSpawner {
  const spawner = new NPCSpawner(seed);
  spawner.initializeRaceTerritories();
  _globalSpawner = spawner;
  return spawner;
}

export function getSpawnEventsForTurn(turn: number): SpawnEvent[] {
  if (!_globalSpawner) return [];
  return _globalSpawner.getSpawnEventsForTurn(turn);
}

export function getActiveNPCsInSector(sector: number): (NPCFleet | NPCStation | NPCColony)[] {
  if (!_globalSpawner) return [];
  return _globalSpawner.getActiveNPCsInSector(sector);
}

export function getTerritoryMap(): Map<string, TerritoryEntry> {
  if (!_globalSpawner) return new Map();
  return _globalSpawner.getTerritoryMap();
}

export function getSpawner(): NPCSpawner | null {
  return _globalSpawner;
}

export function resetSpawner(): void {
  _globalSpawner = null;
}
