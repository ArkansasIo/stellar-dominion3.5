// Pirate Factions Configuration
// Defines pirate groups, behavior, territories, raid mechanics, and loot

export interface LootEntry {
  type: 'credits' | 'resources' | 'blueprint' | 'artifact' | 'crew';
  itemId: string;
  name: string;
  weight: number; // drop weight (higher = more common)
  minQuantity: number;
  maxQuantity: number;
}

export interface PirateFaction {
  id: string;
  name: string;
  description: string;
  originRaceId: string;

  // Territory
  homeSector: string;
  controlledSectors: string[];
  raidRange: number;

  // Fleet
  fleetComposition: {
    scouts: number;
    raiders: number;
    carriers: number;
    capitals: number;
  };

  // Behavior
  aggression: number;
  stealth: number;
  loyalty: number;
  greed: number;

  // Raid patterns
  preferredTargets: string[];
  raidFrequency: number;
  maxFleetSize: number;

  // Loot
  lootTable: LootEntry[];

  // Diplomacy
  canBeBribed: boolean;
  bribeCost: number;
  canBeAllied: boolean;
  betrayChance: number;

  // Spawning
  spawnWeight: number;
  respawnTime: number;
  maxFactions: number;

  // Visual
  color: string;
  emblem: string;
}

export interface PirateRaid {
  id: string;
  factionId: string;
  targetSector: string;
  targetFactionId: string | null;
  turnInitiated: number;
  fleetSize: number;
  fleetPower: number;
  loot: LootEntry[];
  outcome: 'pending' | 'victory' | 'defeat' | 'retreat' | 'bribed';
  lootCollected: number;
  damageDealt: number;
}

export interface RaidOutcome {
  success: boolean;
  lootCollected: { type: string; itemId: string; quantity: number }[];
  damageDealt: number;
  fleetLosses: { scouts: number; raiders: number; carriers: number; capitals: number };
  reputationChange: number;
}

// --- Pirate Faction Definitions ---

export const PIRATE_FACTIONS: PirateFaction[] = [
  {
    id: 'pirate-crimson-corsairs',
    name: 'The Crimson Corsairs',
    description: 'A notorious Orion-backed pirate fleet that balances plunder with pragmatism. They strike fast, loot thoroughly, and vanish before reinforcements arrive.',
    originRaceId: 'race-orion-syndicate',
    homeSector: 'sector-orion-nebula',
    controlledSectors: ['sector-orion-nebula', 'sector-crimson-void', 'sector-amber-drift'],
    raidRange: 5,
    fleetComposition: { scouts: 6, raiders: 10, carriers: 2, capitals: 1 },
    aggression: 55,
    stealth: 45,
    loyalty: 60,
    greed: 70,
    preferredTargets: ['trade-route', 'mining-station', 'freighter-convoy'],
    raidFrequency: 4,
    maxFleetSize: 40,
    lootTable: [
      { type: 'credits', itemId: 'credits', name: 'Purloined Credits', weight: 40, minQuantity: 500, maxQuantity: 3000 },
      { type: 'resources', itemId: 'res-dilithium', name: 'Stolen Dilithium', weight: 25, minQuantity: 10, maxQuantity: 50 },
      { type: 'resources', itemId: 'res-titanium', name: 'Pilfered Titanium', weight: 20, minQuantity: 15, maxQuantity: 60 },
      { type: 'blueprint', itemId: 'bp-orion-raider-hull', name: 'Orion Raider Hull Blueprint', weight: 8, minQuantity: 1, maxQuantity: 1 },
      { type: 'artifact', itemId: 'art-emerald-tablet', name: 'Emerald Tablet of Orion', weight: 2, minQuantity: 1, maxQuantity: 1 },
      { type: 'crew', itemId: 'crew-mercenary', name: 'Mercenary Crew', weight: 5, minQuantity: 2, maxQuantity: 8 },
    ],
    canBeBribed: true,
    bribeCost: 2000,
    canBeAllied: true,
    betrayChance: 15,
    spawnWeight: 30,
    respawnTime: 5,
    maxFactions: 3,
    color: '#DC143C',
    emblem: 'skull-crossed-cutlasses',
  },
  {
    id: 'pirate-void-reavers',
    name: 'Void Reavers',
    description: 'Born from proximity to the Void Swarm, these Reavers adopt swarm tactics and show no mercy. They strip worlds bare and leave only silence.',
    originRaceId: 'race-krell',
    homeSector: 'sector-void-edge',
    controlledSectors: ['sector-void-edge', 'sector-hollow-expanse', 'sector-dark-iris'],
    raidRange: 6,
    fleetComposition: { scouts: 8, raiders: 14, carriers: 3, capitals: 2 },
    aggression: 90,
    stealth: 20,
    loyalty: 40,
    greed: 60,
    preferredTargets: ['colony', 'research-outpost', 'military-base'],
    raidFrequency: 3,
    maxFleetSize: 60,
    lootTable: [
      { type: 'credits', itemId: 'credits', name: 'Siphoned Credits', weight: 30, minQuantity: 800, maxQuantity: 4000 },
      { type: 'resources', itemId: 'res-antimatter', name: 'Antimatter Residue', weight: 20, minQuantity: 5, maxQuantity: 25 },
      { type: 'resources', itemId: 'res-plasma', name: 'Plasma Conduits', weight: 25, minQuantity: 10, maxQuantity: 40 },
      { type: 'blueprint', itemId: 'bp-void-boarding-pod', name: 'Void Boarding Pod Schematic', weight: 10, minQuantity: 1, maxQuantity: 1 },
      { type: 'blueprint', itemId: 'bp-swarm-pheromone-disruptor', name: 'Swarm Pheromone Disruptor', weight: 5, minQuantity: 1, maxQuantity: 1 },
      { type: 'artifact', itemId: 'art-void-fragment', name: 'Void Fragment', weight: 3, minQuantity: 1, maxQuantity: 1 },
    ],
    canBeBribed: false,
    bribeCost: 0,
    canBeAllied: false,
    betrayChance: 0,
    spawnWeight: 20,
    respawnTime: 4,
    maxFactions: 2,
    color: '#4B0082',
    emblem: 'swirling-vortex',
  },
  {
    id: 'pirate-krell-marauders',
    name: 'Krell Marauders',
    description: 'Deserters from Krell war-clans who reject the hive. They fight with disciplined ferocity and prize military hardware above all else.',
    originRaceId: 'race-krell',
    homeSector: 'sector-krell-wastes',
    controlledSectors: ['sector-krell-wastes', 'sector-dust-basin', 'sector-iron-flatlands'],
    raidRange: 4,
    fleetComposition: { scouts: 4, raiders: 12, carriers: 1, capitals: 3 },
    aggression: 75,
    stealth: 15,
    loyalty: 80,
    greed: 45,
    preferredTargets: ['military-base', 'weapons-factory', 'armory-depot'],
    raidFrequency: 5,
    maxFleetSize: 50,
    lootTable: [
      { type: 'credits', itemId: 'credits', name: 'War Spoils', weight: 25, minQuantity: 1000, maxQuantity: 5000 },
      { type: 'resources', itemId: 'res-titanium', name: 'Requisitioned Titanium', weight: 30, minQuantity: 20, maxQuantity: 80 },
      { type: 'resources', itemId: 'res-tritanium', name: 'Tritanium Plating', weight: 15, minQuantity: 5, maxQuantity: 20 },
      { type: 'blueprint', itemId: 'bp-krell-war-plate', name: 'Krell War Plate Blueprint', weight: 12, minQuantity: 1, maxQuantity: 1 },
      { type: 'blueprint', itemId: 'bp-heavy-disruptor-array', name: 'Heavy Disruptor Array', weight: 6, minQuantity: 1, maxQuantity: 1 },
      { type: 'artifact', itemId: 'art-krell-war-horn', name: 'Krell War Horn', weight: 4, minQuantity: 1, maxQuantity: 1 },
      { type: 'crew', itemId: 'crew-krell-warrior', name: 'Krell Warrior Squad', weight: 8, minQuantity: 3, maxQuantity: 10 },
    ],
    canBeBribed: true,
    bribeCost: 3500,
    canBeAllied: true,
    betrayChance: 20,
    spawnWeight: 22,
    respawnTime: 6,
    maxFactions: 2,
    color: '#8B4513',
    emblem: 'broken-chain',
  },
  {
    id: 'pirate-nausicaan-berserkers',
    name: 'Nausicaan Berserkers',
    description: 'Violent Nausicaan raiders who live for the thrill of combat. They board vessels personally and take trophies from their victims.',
    originRaceId: 'race-nausicaan-clans',
    homeSector: 'sector-nausicaan-border',
    controlledSectors: ['sector-nausicaan-border', 'sector-razor-coast', 'sector-skull-reach'],
    raidRange: 4,
    fleetComposition: { scouts: 3, raiders: 16, carriers: 1, capitals: 2 },
    aggression: 95,
    stealth: 10,
    loyalty: 30,
    greed: 50,
    preferredTargets: ['freighter-convoy', 'passenger-liner', 'colony'],
    raidFrequency: 2,
    maxFleetSize: 45,
    lootTable: [
      { type: 'credits', itemId: 'credits', name: 'Plundered Credits', weight: 30, minQuantity: 300, maxQuantity: 2000 },
      { type: 'resources', itemId: 'res-dilithium', name: 'Mined Dilithium', weight: 20, minQuantity: 8, maxQuantity: 35 },
      { type: 'blueprint', itemId: 'bp-nausicaan-blade-cannon', name: 'Nausicaan Blade Cannon', weight: 10, minQuantity: 1, maxQuantity: 1 },
      { type: 'artifact', itemId: 'art-nausicaan-trophy-skull', name: 'Nausicaan Trophy Skull', weight: 8, minQuantity: 1, maxQuantity: 1 },
      { type: 'crew', itemId: 'crew-nausicaan-berserker', name: 'Nausicaan Berserker Gang', weight: 15, minQuantity: 5, maxQuantity: 15 },
    ],
    canBeBribed: true,
    bribeCost: 1500,
    canBeAllied: false,
    betrayChance: 40,
    spawnWeight: 28,
    respawnTime: 3,
    maxFactions: 4,
    color: '#B22222',
    emblem: 'fang-crescent',
  },
  {
    id: 'pirate-shadow-syndicate',
    name: 'The Shadow Syndicate',
    description: 'A Romulan-funded intelligence and piracy operation. They strike unseen, eliminate witnesses, and vanish like ghosts.',
    originRaceId: 'race-orion-syndicate',
    homeSector: 'sector-shadow-nexus',
    controlledSectors: ['sector-shadow-nexus', 'sector-midnight-veil', 'sector-cloaked-depths'],
    raidRange: 7,
    fleetComposition: { scouts: 10, raiders: 8, carriers: 1, capitals: 1 },
    aggression: 40,
    stealth: 95,
    loyalty: 70,
    greed: 80,
    preferredTargets: ['intelligence-outpost', 'embassy', 'research-lab', 'trade-route'],
    raidFrequency: 6,
    maxFleetSize: 30,
    lootTable: [
      { type: 'credits', itemId: 'credits', name: 'Embezzled Funds', weight: 35, minQuantity: 1500, maxQuantity: 8000 },
      { type: 'resources', itemId: 'res-neutronium', name: 'Neutronium Slivers', weight: 15, minQuantity: 3, maxQuantity: 12 },
      { type: 'blueprint', itemId: 'bp-cloaking-enhancement', name: 'Cloaking Enhancement Module', weight: 10, minQuantity: 1, maxQuantity: 1 },
      { type: 'blueprint', itemId: 'bp-romulan-espionage-probe', name: 'Romulan Espionage Probe', weight: 7, minQuantity: 1, maxQuantity: 1 },
      { type: 'artifact', itemId: 'art-drd-prototype', name: 'DRD Prototype', weight: 3, minQuantity: 1, maxQuantity: 1 },
      { type: 'artifact', itemId: 'art-shadow-codex', name: 'Shadow Codex', weight: 2, minQuantity: 1, maxQuantity: 1 },
    ],
    canBeBribed: true,
    bribeCost: 5000,
    canBeAllied: true,
    betrayChance: 35,
    spawnWeight: 15,
    respawnTime: 8,
    maxFactions: 2,
    color: '#2F4F4F',
    emblem: 'closed-eye-mask',
  },
  {
    id: 'pirate-borg-scavengers',
    name: 'Borg Scavengers',
    description: 'A rogue collective of disconnected drones and assimilated hybrids who salvage technology from derelict ships and abandoned installations.',
    originRaceId: 'race-krell',
    homeSector: 'sector-derelict-grid',
    controlledSectors: ['sector-derelict-grid', 'sector-salvage-wastes', 'sector-broken-nodes'],
    raidRange: 5,
    fleetComposition: { scouts: 5, raiders: 7, carriers: 4, capitals: 2 },
    aggression: 50,
    stealth: 60,
    loyalty: 85,
    greed: 30,
    preferredTargets: ['research-lab', 'shipyard', 'derelict-field'],
    raidFrequency: 7,
    maxFleetSize: 35,
    lootTable: [
      { type: 'credits', itemId: 'credits', name: 'Scrap Value', weight: 20, minQuantity: 200, maxQuantity: 1500 },
      { type: 'resources', itemId: 'res-neutronium', name: 'Neutronium Alloys', weight: 20, minQuantity: 5, maxQuantity: 20 },
      { type: 'resources', itemId: 'res-duranium', name: 'Duranium Plating', weight: 20, minQuantity: 8, maxQuantity: 30 },
      { type: 'blueprint', itemId: 'bp-borg-assimilation-tubule', name: 'Assimilation Tubule Array', weight: 10, minQuantity: 1, maxQuantity: 1 },
      { type: 'blueprint', itemId: 'bp-nanoprobe-dispersal', name: 'Nanoprobe Dispersal System', weight: 6, minQuantity: 1, maxQuantity: 1 },
      { type: 'artifact', itemId: 'art-borg-cortical-node', name: 'Borg Cortical Node', weight: 4, minQuantity: 1, maxQuantity: 1 },
    ],
    canBeBribed: false,
    bribeCost: 0,
    canBeAllied: false,
    betrayChance: 0,
    spawnWeight: 12,
    respawnTime: 10,
    maxFactions: 2,
    color: '#006400',
    emblem: 'hive-hexagon',
  },
  {
    id: 'pirate-ferengi-smugglers',
    name: 'Ferengi Smugglers',
    description: 'Black marketeers who deal in contraband, stolen goods, and information. They prefer profit over violence but will fight when cornered.',
    originRaceId: 'race-dosi-syndicate',
    homeSector: 'sector-ferenginar-rim',
    controlledSectors: ['sector-ferenginar-rim', 'sector-bazaar-expanse', 'sector-deal-makers'],
    raidRange: 8,
    fleetComposition: { scouts: 12, raiders: 6, carriers: 1, capitals: 0 },
    aggression: 20,
    stealth: 70,
    loyalty: 15,
    greed: 95,
    preferredTargets: ['trade-route', 'freighter-convoy', 'market-station'],
    raidFrequency: 3,
    maxFleetSize: 25,
    lootTable: [
      { type: 'credits', itemId: 'credits', name: 'Smuggled Profits', weight: 45, minQuantity: 2000, maxQuantity: 12000 },
      { type: 'resources', itemId: 'res-dilithium', name: 'Black Market Dilithium', weight: 15, minQuantity: 15, maxQuantity: 60 },
      { type: 'resources', itemId: 'res-tritanium', name: 'Contraband Tritanium', weight: 15, minQuantity: 10, maxQuantity: 40 },
      { type: 'blueprint', itemId: 'bp-ferengi-sensor-baffle', name: 'Sensor Baffle System', weight: 8, minQuantity: 1, maxQuantity: 1 },
      { type: 'blueprint', itemId: 'bp-automated-trade-computer', name: 'Automated Trade Computer', weight: 10, minQuantity: 1, maxQuantity: 1 },
      { type: 'artifact', itemId: 'art-ornate-lock-box', name: 'Ornate Lock Box', weight: 4, minQuantity: 1, maxQuantity: 1 },
      { type: 'artifact', itemId: 'art-ferengi-contract', name: 'Ferengi Contract', weight: 3, minQuantity: 1, maxQuantity: 1 },
    ],
    canBeBribed: true,
    bribeCost: 1000,
    canBeAllied: true,
    betrayChance: 50,
    spawnWeight: 25,
    respawnTime: 3,
    maxFactions: 4,
    color: '#DAA520',
    emblem: 'bag-of-credits',
  },
  {
    id: 'pirate-hirogen-trophy',
    name: 'Hirogen Trophy Hunters',
    description: 'Splinter clan of the Hirogen who hunt sentient prey across the quadrant. They collect trophies and sell rare biological specimens.',
    originRaceId: 'race-hirogen-hunters',
    homeSector: 'sector-hirogen-hunting-grounds',
    controlledSectors: ['sector-hirogen-hunting-grounds', 'sector-prey-trails', 'sector-stalker-moon'],
    raidRange: 6,
    fleetComposition: { scouts: 8, raiders: 10, carriers: 2, capitals: 1 },
    aggression: 70,
    stealth: 55,
    loyalty: 50,
    greed: 40,
    preferredTargets: ['colony', 'passenger-liner', 'science-vessel'],
    raidFrequency: 5,
    maxFleetSize: 38,
    lootTable: [
      { type: 'credits', itemId: 'credits', name: 'Bounty Proceeds', weight: 25, minQuantity: 600, maxQuantity: 3500 },
      { type: 'resources', itemId: 'res-biomass', name: 'Biological Specimens', weight: 20, minQuantity: 5, maxQuantity: 25 },
      { type: 'resources', itemId: 'res-dilithium', name: 'Trophy Fuel Cells', weight: 15, minQuantity: 8, maxQuantity: 30 },
      { type: 'blueprint', itemId: 'bp-hirogen-sensor-spool', name: 'Hunter Sensor Spool', weight: 10, minQuantity: 1, maxQuantity: 1 },
      { type: 'blueprint', itemId: 'bp-hirogen-tracking-pod', name: 'Tracking Pod Schematic', weight: 8, minQuantity: 1, maxQuantity: 1 },
      { type: 'artifact', itemId: 'art-hunter-mask', name: 'Hirogen Hunter Mask', weight: 5, minQuantity: 1, maxQuantity: 1 },
      { type: 'artifact', itemId: 'art-prey-trophy', name: 'Sentient Prey Trophy', weight: 3, minQuantity: 1, maxQuantity: 1 },
    ],
    canBeBribed: true,
    bribeCost: 2500,
    canBeAllied: true,
    betrayChance: 30,
    spawnWeight: 18,
    respawnTime: 6,
    maxFactions: 2,
    color: '#CD853F',
    emblem: 'hunting-spear',
  },
  {
    id: 'pirate-dark-nebula',
    name: 'Dark Nebula Pirates',
    description: 'Mysterious raiders who emerge from uncharted nebulae. No one knows their true origin. Their ships are impossibly advanced.',
    originRaceId: 'race-krell',
    homeSector: 'sector-dark-nebula-prime',
    controlledSectors: ['sector-dark-nebula-prime', 'sector-obsidian-cloud', 'sector-abyssal-reach'],
    raidRange: 9,
    fleetComposition: { scouts: 6, raiders: 10, carriers: 3, capitals: 3 },
    aggression: 65,
    stealth: 80,
    loyalty: 90,
    greed: 55,
    preferredTargets: ['research-lab', 'military-base', 'colony', 'embassy'],
    raidFrequency: 8,
    maxFleetSize: 55,
    lootTable: [
      { type: 'credits', itemId: 'credits', name: 'Unknown Origin Credits', weight: 20, minQuantity: 2000, maxQuantity: 10000 },
      { type: 'resources', itemId: 'res-neutronium', name: 'Exotic Matter', weight: 15, minQuantity: 10, maxQuantity: 40 },
      { type: 'resources', itemId: 'res-antimatter', name: 'Stabilized Antimatter', weight: 15, minQuantity: 8, maxQuantity: 30 },
      { type: 'blueprint', itemId: 'bp-dark-matter-lance', name: 'Dark Matter Lance', weight: 6, minQuantity: 1, maxQuantity: 1 },
      { type: 'blueprint', itemId: 'bp-phase-cloaking-field', name: 'Phase Cloaking Field', weight: 4, minQuantity: 1, maxQuantity: 1 },
      { type: 'artifact', itemId: 'art-nebula-heart', name: 'Nebula Heart Crystal', weight: 3, minQuantity: 1, maxQuantity: 1 },
      { type: 'artifact', itemId: 'art-void-cipher', name: 'Void Cipher Device', weight: 2, minQuantity: 1, maxQuantity: 1 },
    ],
    canBeBribed: false,
    bribeCost: 0,
    canBeAllied: false,
    betrayChance: 0,
    spawnWeight: 8,
    respawnTime: 12,
    maxFactions: 1,
    color: '#191970',
    emblem: 'nebula-eye',
  },
  {
    id: 'pirate-orion-slavers',
    name: 'Orion Slavers',
    description: 'The ruthless criminal arm of the Orion Syndicate specializing in kidnapping, forced labor, and the slave trade.',
    originRaceId: 'race-orion-syndicate',
    homeSector: 'sector-orion-underworld',
    controlledSectors: ['sector-orion-underworld', 'sector-green-dark', 'sector-chains'],
    raidRange: 5,
    fleetComposition: { scouts: 5, raiders: 12, carriers: 3, capitals: 1 },
    aggression: 80,
    stealth: 35,
    loyalty: 50,
    greed: 90,
    preferredTargets: ['colony', 'passenger-liner', 'refugee-convoy'],
    raidFrequency: 3,
    maxFleetSize: 42,
    lootTable: [
      { type: 'credits', itemId: 'credits', name: 'Slave Trade Profits', weight: 30, minQuantity: 1200, maxQuantity: 6000 },
      { type: 'resources', itemId: 'res-biomass', name: 'Captive Populace', weight: 20, minQuantity: 5, maxQuantity: 20 },
      { type: 'resources', itemId: 'res-dilithium', name: 'Extorted Dilithium', weight: 15, minQuantity: 10, maxQuantity: 40 },
      { type: 'blueprint', itemId: 'bp-neural-collar', name: 'Neural Control Collar', weight: 8, minQuantity: 1, maxQuantity: 1 },
      { type: 'blueprint', itemId: 'bp-slave-pod', name: 'Automated Slave Pod', weight: 6, minQuantity: 1, maxQuantity: 1 },
      { type: 'artifact', itemId: 'art-emerald-collar', name: 'Emerald Control Collar', weight: 4, minQuantity: 1, maxQuantity: 1 },
      { type: 'crew', itemId: 'crew-slave-labor', name: 'Freed Slave Laborers', weight: 10, minQuantity: 10, maxQuantity: 30 },
    ],
    canBeBribed: true,
    bribeCost: 2500,
    canBeAllied: true,
    betrayChance: 45,
    spawnWeight: 20,
    respawnTime: 4,
    maxFactions: 3,
    color: '#008000',
    emblem: 'broken-shackle',
  },
  {
    id: 'pirate-void-swarmlings',
    name: 'Void Swarmlings',
    description: 'Offshoot organisms from the Void Swarm that have developed a parasitic relationship with stolen starships.',
    originRaceId: 'race-krell',
    homeSector: 'sector-void-nest',
    controlledSectors: ['sector-void-nest', 'sector-hive-reach', 'sector-consume-field'],
    raidRange: 5,
    fleetComposition: { scouts: 10, raiders: 12, carriers: 5, capitals: 0 },
    aggression: 85,
    stealth: 25,
    loyalty: 95,
    greed: 10,
    preferredTargets: ['colony', 'mining-station', 'shipyard'],
    raidFrequency: 2,
    maxFleetSize: 65,
    lootTable: [
      { type: 'resources', itemId: 'res-biomass', name: 'Swarm Biomass', weight: 35, minQuantity: 15, maxQuantity: 60 },
      { type: 'resources', itemId: 'res-plasma', name: 'Plasma Residue', weight: 25, minQuantity: 10, maxQuantity: 40 },
      { type: 'credits', itemId: 'credits', name: 'Consumed Resources', weight: 15, minQuantity: 200, maxQuantity: 1500 },
      { type: 'blueprint', itemId: 'bp-swarm-spore-launcher', name: 'Swarm Spore Launcher', weight: 10, minQuantity: 1, maxQuantity: 1 },
      { type: 'blueprint', itemId: 'bp-adaptive-carapace', name: 'Adaptive Carapace Plating', weight: 6, minQuantity: 1, maxQuantity: 1 },
      { type: 'artifact', itemId: 'art-swarm-queen-egg', name: 'Swarm Queen Egg', weight: 3, minQuantity: 1, maxQuantity: 1 },
    ],
    canBeBribed: false,
    bribeCost: 0,
    canBeAllied: false,
    betrayChance: 0,
    spawnWeight: 18,
    respawnTime: 3,
    maxFactions: 3,
    color: '#32CD32',
    emblem: 'hive-cluster',
  },
  {
    id: 'pirate-crimson-legion',
    name: 'Crimson Legion',
    description: 'War criminals and disgraced officers from the Cardassian military. They operate with ruthless precision and ideological zeal.',
    originRaceId: 'race-krell',
    homeSector: 'sector-legion-fortress',
    controlledSectors: ['sector-legion-fortress', 'sector-occupied-zone', 'sector-iron-rim'],
    raidRange: 5,
    fleetComposition: { scouts: 5, raiders: 11, carriers: 2, capitals: 2 },
    aggression: 80,
    stealth: 30,
    loyalty: 75,
    greed: 55,
    preferredTargets: ['military-base', 'colony', 'embassy', 'shipyard'],
    raidFrequency: 4,
    maxFleetSize: 48,
    lootTable: [
      { type: 'credits', itemId: 'credits', name: 'Confiscated Assets', weight: 25, minQuantity: 1000, maxQuantity: 5000 },
      { type: 'resources', itemId: 'res-titanium', name: 'Cardassian Titanium', weight: 25, minQuantity: 15, maxQuantity: 60 },
      { type: 'resources', itemId: 'res-duranium', name: 'Duranium Armor', weight: 15, minQuantity: 10, maxQuantity: 35 },
      { type: 'blueprint', itemId: 'bp-cardassian-disruptor-cannon', name: 'Cardassian Disruptor Cannon', weight: 10, minQuantity: 1, maxQuantity: 1 },
      { type: 'blueprint', itemId: 'bp-legion-fortification', name: 'Legion Fortification Module', weight: 6, minQuantity: 1, maxQuantity: 1 },
      { type: 'artifact', itemId: 'art-legion-standard', name: 'Crimson Legion Standard', weight: 4, minQuantity: 1, maxQuantity: 1 },
      { type: 'crew', itemId: 'crew-legion-soldier', name: 'Legion Veteran Squad', weight: 8, minQuantity: 4, maxQuantity: 12 },
    ],
    canBeBribed: true,
    bribeCost: 3000,
    canBeAllied: true,
    betrayChance: 25,
    spawnWeight: 16,
    respawnTime: 7,
    maxFactions: 2,
    color: '#8B0000',
    emblem: 'cardassian-star',
  },
  {
    id: 'pirate-unaffiliated',
    name: 'The Unaffiliated',
    description: 'A loose coalition of mercenaries, exiles, and outcasts from many races. They fight for whoever pays and betray whoever doesnt.',
    originRaceId: 'race-dosi-syndicate',
    homeSector: 'sector-freeport-drift',
    controlledSectors: ['sector-freeport-drift', 'sector-neutral-ground', 'sector-no-mans-land'],
    raidRange: 10,
    fleetComposition: { scouts: 7, raiders: 9, carriers: 2, capitals: 1 },
    aggression: 45,
    stealth: 40,
    loyalty: 10,
    greed: 85,
    preferredTargets: ['trade-route', 'freighter-convoy', 'mining-station', 'colony'],
    raidFrequency: 3,
    maxFleetSize: 35,
    lootTable: [
      { type: 'credits', itemId: 'credits', name: 'Contract Payment', weight: 40, minQuantity: 800, maxQuantity: 4000 },
      { type: 'resources', itemId: 'res-dilithium', name: 'Salvaged Dilithium', weight: 20, minQuantity: 10, maxQuantity: 40 },
      { type: 'resources', itemId: 'res-titanium', name: 'Scrap Titanium', weight: 20, minQuantity: 10, maxQuantity: 40 },
      { type: 'blueprint', itemId: 'bp-modular-weapon-rack', name: 'Modular Weapon Rack', weight: 8, minQuantity: 1, maxQuantity: 1 },
      { type: 'blueprint', itemId: 'bp-merc-comms-array', name: 'Mercenary Comms Array', weight: 6, minQuantity: 1, maxQuantity: 1 },
      { type: 'crew', itemId: 'crew-merc-squad', name: 'Mercenary Squad for Hire', weight: 10, minQuantity: 3, maxQuantity: 10 },
    ],
    canBeBribed: true,
    bribeCost: 1500,
    canBeAllied: true,
    betrayChance: 60,
    spawnWeight: 22,
    respawnTime: 4,
    maxFactions: 5,
    color: '#808080',
    emblem: 'question-mark',
  },
  {
    id: 'pirate-solar-pirates',
    name: 'Solar Pirates',
    description: 'Klingon warriors dishonored by their houses who turned to piracy rather than commit ritual suicide. They fight with savage pride.',
    originRaceId: 'race-krell',
    homeSector: 'sector-solar-flare',
    controlledSectors: ['sector-solar-flare', 'sector-honors-grave', 'sector-fallen-empire'],
    raidRange: 5,
    fleetComposition: { scouts: 4, raiders: 13, carriers: 1, capitals: 2 },
    aggression: 85,
    stealth: 15,
    loyalty: 55,
    greed: 35,
    preferredTargets: ['military-base', 'colony', 'freighter-convoy'],
    raidFrequency: 4,
    maxFleetSize: 45,
    lootTable: [
      { type: 'credits', itemId: 'credits', name: 'Ransom Payments', weight: 25, minQuantity: 800, maxQuantity: 4000 },
      { type: 'resources', itemId: 'res-titanium', name: 'Klingon Steel', weight: 25, minQuantity: 15, maxQuantity: 55 },
      { type: 'resources', itemId: 'res-dilithium', name: 'Captured Dilithium', weight: 15, minQuantity: 10, maxQuantity: 35 },
      { type: 'blueprint', itemId: 'bp-klingon-disruptor-cannon', name: 'Klingon Disruptor Cannon', weight: 10, minQuantity: 1, maxQuantity: 1 },
      { type: 'blueprint', itemId: 'bp-bird-of-prey-retrofit', name: 'Bird of Prey Retrofit Kit', weight: 5, minQuantity: 1, maxQuantity: 1 },
      { type: 'artifact', itemId: 'art-dishonored-dahar-masters-sword', name: "Dahar Master's Dishonored Sword", weight: 3, minQuantity: 1, maxQuantity: 1 },
      { type: 'crew', itemId: 'crew-klingon-warrior', name: 'Klingon Warrior Band', weight: 10, minQuantity: 4, maxQuantity: 12 },
    ],
    canBeBribed: true,
    bribeCost: 2800,
    canBeAllied: true,
    betrayChance: 20,
    spawnWeight: 20,
    respawnTime: 5,
    maxFactions: 3,
    color: '#FF4500',
    emblem: 'broken-klingon-emblem',
  },
  {
    id: 'pirate-ghost-fleet',
    name: 'Ghost Fleet',
    description: 'An armada of derelict ships crewed by unknown entities. They appear without warning, annihilate their targets, and leave no survivors.',
    originRaceId: 'race-krell',
    homeSector: 'sector-ghost-lane',
    controlledSectors: ['sector-ghost-lane', 'sector-dead-signal', 'sector-echo-void'],
    raidRange: 12,
    fleetComposition: { scouts: 4, raiders: 8, carriers: 4, capitals: 4 },
    aggression: 70,
    stealth: 90,
    loyalty: 100,
    greed: 0,
    preferredTargets: ['military-base', 'colony', 'embassy', 'research-lab', 'shipyard'],
    raidFrequency: 10,
    maxFleetSize: 70,
    lootTable: [
      { type: 'credits', itemId: 'credits', name: 'Ancient Currency', weight: 15, minQuantity: 3000, maxQuantity: 15000 },
      { type: 'resources', itemId: 'res-neutronium', name: 'Neutronium Core Fragment', weight: 15, minQuantity: 15, maxQuantity: 50 },
      { type: 'resources', itemId: 'res-antimatter', name: 'Pure Antimatter', weight: 15, minQuantity: 10, maxQuantity: 35 },
      { type: 'blueprint', itemId: 'bp-ghost-phase-cannon', name: 'Ghost Phase Cannon', weight: 5, minQuantity: 1, maxQuantity: 1 },
      { type: 'blueprint', itemId: 'bp-spectral-cloaking', name: 'Spectral Cloaking Device', weight: 3, minQuantity: 1, maxQuantity: 1 },
      { type: 'artifact', itemId: 'art-ghost-core', name: 'Ghost Fleet Core', weight: 2, minQuantity: 1, maxQuantity: 1 },
      { type: 'artifact', itemId: 'art-ancient-log', name: "Ancient Ship's Log", weight: 2, minQuantity: 1, maxQuantity: 1 },
    ],
    canBeBribed: false,
    bribeCost: 0,
    canBeAllied: false,
    betrayChance: 0,
    spawnWeight: 5,
    respawnTime: 15,
    maxFactions: 1,
    color: '#C0C0C0',
    emblem: 'spectral-galleon',
  },
];

// --- Raid Event System ---

export function createRaidEvent(
  faction: PirateFaction,
  targetSector: string,
  targetFactionId: string | null,
  turn: number,
): PirateRaid {
  const fleetSize = calculateRaidFleetSize(faction, turn);
  const fleetPower = calculateRaidStrength(faction, turn);
  const loot = generateLootTable(faction, Math.floor(fleetPower / 1000));

  return {
    id: `raid-${faction.id}-${turn}-${Math.floor(Math.random() * 10000)}`,
    factionId: faction.id,
    targetSector,
    targetFactionId,
    turnInitiated: turn,
    fleetSize,
    fleetPower,
    loot,
    outcome: 'pending',
    lootCollected: 0,
    damageDealt: 0,
  };
}

export function resolveRaid(
  raid: PirateRaid,
  faction: PirateFaction,
  defenderPower: number,
): RaidOutcome {
  const attackerPower = raid.fleetPower;
  const powerRatio = attackerPower / Math.max(defenderPower, 1);

  let success: boolean;
  let reputationChange: number;

  if (powerRatio > 1.5) {
    success = true;
    reputationChange = -5;
  } else if (powerRatio > 0.8) {
    success = Math.random() < 0.5 + (powerRatio - 0.8) * 1.25;
    reputationChange = success ? -3 : -1;
  } else {
    success = false;
    reputationChange = 2;
  }

  const lootCollected: { type: string; itemId: string; quantity: number }[] = [];
  let totalLootValue = 0;

  if (success) {
    for (const entry of raid.loot) {
      const roll = Math.random() * 100;
      if (roll < entry.weight) {
        const quantity =
          Math.floor(Math.random() * (entry.maxQuantity - entry.minQuantity + 1)) +
          entry.minQuantity;
        lootCollected.push({ type: entry.type, itemId: entry.itemId, quantity });
        if (entry.type === 'credits') {
          totalLootValue += quantity;
        } else {
          totalLootValue += quantity * 50;
        }
      }
    }
  }

  const fleetLosses = calculateFleetLosses(faction, !success, powerRatio);
  const damageDealt = success ? Math.floor(raid.fleetPower * (0.5 + Math.random() * 0.5)) : 0;

  return {
    success,
    lootCollected,
    damageDealt,
    fleetLosses,
    reputationChange,
  };
}

function calculateFleetLosses(
  faction: PirateFaction,
  defenderWon: boolean,
  powerRatio: number,
): { scouts: number; raiders: number; carriers: number; capitals: number } {
  const baseLossRate = defenderWon ? 0.4 + Math.random() * 0.3 : 0.05 + Math.random() * 0.15;
  const scaledLoss = baseLossRate / Math.max(powerRatio, 0.5);

  return {
    scouts: Math.floor(faction.fleetComposition.scouts * scaledLoss),
    raiders: Math.floor(faction.fleetComposition.raiders * scaledLoss),
    carriers: Math.floor(faction.fleetComposition.carriers * scaledLoss),
    capitals: Math.floor(faction.fleetComposition.capitals * scaledLoss),
  };
}

// --- Bribery System ---

export function calculateBribeCost(faction: PirateFaction, playerReputation: number): number {
  if (!faction.canBeBribed) return Infinity;

  const baseCost = faction.bribeCost;
  const aggressionMultiplier = 1 + faction.aggression / 100;
  const greedMultiplier = 1 + faction.greed / 100;
  const reputationDiscount = Math.max(0, 1 - playerReputation / 200);

  return Math.floor(baseCost * aggressionMultiplier * greedMultiplier * reputationDiscount);
}

export function attemptBribe(
  faction: PirateFaction,
  playerCredits: number,
  playerReputation: number,
): { success: boolean; cost: number; message: string } {
  if (!faction.canBeBribed) {
    return { success: false, cost: 0, message: `${faction.name} cannot be bribed.` };
  }

  const cost = calculateBribeCost(faction, playerReputation);

  if (playerCredits < cost) {
    return {
      success: false,
      cost,
      message: `Insufficient credits. ${faction.name} demands ${cost.toLocaleString()} credits.`,
    };
  }

  const baseChance = 40 + playerReputation / 2 - faction.aggression / 4;
  const loyaltyPenalty = faction.loyalty / 5;
  const successChance = Math.min(95, Math.max(5, baseChance - loyaltyPenalty));
  const roll = Math.random() * 100;

  if (roll < successChance) {
    return {
      success: true,
      cost,
      message: `${faction.name} accepts the bribe and stands down.`,
    };
  }

  const betrayRoll = Math.random() * 100;
  if (betrayRoll < faction.betrayChance) {
    return {
      success: false,
      cost,
      message: `${faction.name} takes your credits AND attacks anyway. Betrayal!`,
    };
  }

  return {
    success: false,
    cost,
    message: `${faction.name} rejects the bribe but honors the negotiation. They withdraw.`,
  };
}

// --- Loot Generation ---

export function generateLootTable(
  faction: PirateFaction,
  difficulty: number,
): LootEntry[] {
  const loot: LootEntry[] = [];

  for (const entry of faction.lootTable) {
    const adjustedWeight = entry.weight * (1 + difficulty * 0.01);
    loot.push({
      ...entry,
      weight: Math.min(100, adjustedWeight),
      minQuantity: Math.floor(entry.minQuantity * (1 + difficulty * 0.05)),
      maxQuantity: Math.floor(entry.maxQuantity * (1 + difficulty * 0.1)),
    });
  }

  return loot;
}

// --- Fleet Strength Calculation ---

const SCOUT_POWER = 50;
const RAIDER_POWER = 150;
const CARRIER_POWER = 400;
const CAPITAL_POWER = 800;

export function calculateRaidStrength(faction: PirateFaction, turn: number): number {
  const basePower =
    faction.fleetComposition.scouts * SCOUT_POWER +
    faction.fleetComposition.raiders * RAIDER_POWER +
    faction.fleetComposition.carriers * CARRIER_POWER +
    faction.fleetComposition.capitals * CAPITAL_POWER;

  const turnGrowth = 1 + (turn / 100) * 0.5;
  const aggressionBonus = 1 + faction.aggression / 200;

  return Math.floor(basePower * turnGrowth * aggressionBonus);
}

function calculateRaidFleetSize(faction: PirateFaction, turn: number): number {
  const base =
    faction.fleetComposition.scouts +
    faction.fleetComposition.raiders +
    faction.fleetComposition.carriers +
    faction.fleetComposition.capitals;

  const growth = 1 + (turn / 100) * 0.3;
  const variability = 0.8 + Math.random() * 0.4;

  return Math.min(faction.maxFleetSize, Math.floor(base * growth * variability));
}

// --- Helper Functions ---

export function getPirateFactionById(id: string): PirateFaction | undefined {
  return PIRATE_FACTIONS.find((f) => f.id === id);
}

export function getPiratesInSector(sectorId: string): PirateFaction[] {
  return PIRATE_FACTIONS.filter(
    (f) => f.homeSector === sectorId || f.controlledSectors.includes(sectorId),
  );
}

export function getAllPirateFactions(): readonly PirateFaction[] {
  return PIRATE_FACTIONS;
}

export function getPirateFactionsByOrigin(raceId: string): PirateFaction[] {
  return PIRATE_FACTIONS.filter((f) => f.originRaceId === raceId);
}

export function rollLoot(faction: PirateFaction, difficulty: number): { type: string; itemId: string; name: string; quantity: number }[] {
  const table = generateLootTable(faction, difficulty);
  const results: { type: string; itemId: string; name: string; quantity: number }[] = [];

  for (const entry of table) {
    const roll = Math.random() * 100;
    if (roll < entry.weight) {
      const quantity =
        Math.floor(Math.random() * (entry.maxQuantity - entry.minQuantity + 1)) +
        entry.minQuantity;
      results.push({ type: entry.type, itemId: entry.itemId, name: entry.name, quantity });
    }
  }

  return results;
}

export function getBribableFactions(): PirateFaction[] {
  return PIRATE_FACTIONS.filter((f) => f.canBeBribed);
}

export function getAggressiveFactions(): PirateFaction[] {
  return PIRATE_FACTIONS.filter((f) => f.aggression >= 70);
}

export function getStealthyFactions(): PirateFaction[] {
  return PIRATE_FACTIONS.filter((f) => f.stealth >= 60);
}
