/**
 * Comprehensive Entities Expansion Configuration
 * 350+ unique starships, motherships, megastructures, buildings, troops, and vehicles
 * @tag #entities #config #content
 */

// ====================
// STARSHIP TYPES (90)
// ====================

type StarshipTypeDefinition = {
  name: string;
  class: string;
  subclass: string;
  type: string;
  subtype: string;
  tier: number;
  power: number;
  defense: number;
  mobility: number;
  utility: number;
};

const STARSHIP_CLASS_FAMILIES = [
  { key: "INTERCEPTOR", name: "Interceptor", type: "Combat", tier: 1, power: 55, defense: 32, mobility: 95, utility: 24 },
  { key: "FRIGATE", name: "Frigate", type: "Combat", tier: 2, power: 82, defense: 58, mobility: 76, utility: 42 },
  { key: "DESTROYER", name: "Destroyer", type: "Combat", tier: 3, power: 126, defense: 84, mobility: 54, utility: 66 },
  { key: "CRUISER", name: "Cruiser", type: "Command", tier: 4, power: 168, defense: 112, mobility: 51, utility: 98 },
  { key: "BATTLESHIP", name: "Battleship", type: "Capital", tier: 5, power: 252, defense: 186, mobility: 35, utility: 166 },
  { key: "CARRIER", name: "Carrier", type: "Support", tier: 5, power: 208, defense: 162, mobility: 39, utility: 226 },
  { key: "EXPLORER", name: "Explorer", type: "Recon", tier: 3, power: 98, defense: 74, mobility: 82, utility: 142 },
  { key: "SIEGE", name: "Siege Platform", type: "Assault", tier: 4, power: 188, defense: 126, mobility: 41, utility: 88 },
  { key: "AUXILIARY", name: "Auxiliary Vessel", type: "Logistics", tier: 3, power: 88, defense: 78, mobility: 64, utility: 164 },
] as const;

const STARSHIP_SUBTYPE_VARIANTS = [
  { key: "ASSAULT", name: "Assault", subtype: "Linebreaker" },
  { key: "SKIRMISH", name: "Skirmish", subtype: "Raider" },
  { key: "STEALTH", name: "Stealth", subtype: "Infiltration" },
  { key: "DEFENDER", name: "Defender", subtype: "Bulwark" },
  { key: "GUARDIAN", name: "Guardian", subtype: "Escort" },
  { key: "RANGER", name: "Ranger", subtype: "Pathfinder" },
  { key: "VANGUARD", name: "Vanguard", subtype: "Shock" },
  { key: "SENTINEL", name: "Sentinel", subtype: "Ward" },
  { key: "NEXUS", name: "Nexus", subtype: "Command-Link" },
  { key: "PRIME", name: "Prime", subtype: "Prototype" },
] as const;

function clampStat(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function generateStarshipTypes(): Record<string, StarshipTypeDefinition> {
  const entries = STARSHIP_CLASS_FAMILIES.flatMap((family, familyIndex) =>
    STARSHIP_SUBTYPE_VARIANTS.map((variant, variantIndex) => {
      const key = `${family.key}_${variant.key}`;
      const power = Math.round(family.power + familyIndex * 5 + variantIndex * 3);
      const defense = Math.round(family.defense + familyIndex * 4 + variantIndex * 2);
      const mobility = clampStat(Math.round(family.mobility - familyIndex * 2 + (variantIndex % 5) * 2), 18, 110);
      const utility = Math.round(family.utility + familyIndex * 6 + variantIndex * 5);

      const definition: StarshipTypeDefinition = {
        name: `${variant.name} ${family.name}`,
        class: family.name,
        subclass: variant.name,
        type: family.type,
        subtype: variant.subtype,
        tier: family.tier,
        power,
        defense,
        mobility,
        utility,
      };

      return [key, definition] as const;
    })
  );

  return Object.fromEntries(entries);
}

export const STARSHIP_TYPES = generateStarshipTypes();

// ====================
// MOTHERSHIP TYPES (45)
// ====================

export const MOTHERSHIP_TYPES = {
  // Standard Motherships (10)
  COMMAND_SHIP: { name: "Command Ship", tier: 5, power: 200, defense: 250, mobility: 30, utility: 400 },
  FACTORY_SHIP: { name: "Factory Ship", tier: 5, power: 180, defense: 200, mobility: 25, utility: 500 },
  HOSPITAL_SHIP: { name: "Hospital Ship", tier: 5, power: 150, defense: 180, mobility: 28, utility: 600 },
  COLONY_SHIP: { name: "Colony Ship", tier: 5, power: 160, defense: 190, mobility: 22, utility: 800 },
  RESOURCE_HARVESTER: { name: "Resource Harvester", tier: 5, power: 140, defense: 160, mobility: 20, utility: 700 },
  MOBILE_FORTRESS: { name: "Mobile Fortress", tier: 5, power: 250, defense: 350, mobility: 18, utility: 300 },
  RESEARCH_VESSEL: { name: "Research Vessel", tier: 5, power: 130, defense: 140, mobility: 26, utility: 900 },
  DIPLOMATIC_VESSEL: { name: "Diplomatic Vessel", tier: 5, power: 120, defense: 130, mobility: 35, utility: 1000 },
  EXPLORER_VESSEL: { name: "Explorer Vessel", tier: 5, power: 140, defense: 120, mobility: 50, utility: 700 },
  TRANSPORT_VESSEL: { name: "Transport Vessel", tier: 5, power: 150, defense: 150, mobility: 28, utility: 950 },

  // Advanced Motherships (15)
  NEXUS_MOTHERSHIP: { name: "Nexus Mothership", tier: 6, power: 300, defense: 400, mobility: 28, utility: 1200 },
  OMEGA_MOTHERSHIP: { name: "Omega Mothership", tier: 6, power: 350, defense: 450, mobility: 25, utility: 1400 },
  ALPHA_MOTHERSHIP: { name: "Alpha Mothership", tier: 6, power: 320, defense: 420, mobility: 27, utility: 1300 },
  CENTURION_MOTHERSHIP: { name: "Centurion Mothership", tier: 6, power: 280, defense: 380, mobility: 29, utility: 1100 },
  SENTINEL_MOTHERSHIP: { name: "Sentinel Mothership", tier: 6, power: 310, defense: 460, mobility: 22, utility: 1000 },
  GUARDIAN_MOTHERSHIP: { name: "Guardian Mothership", tier: 6, power: 290, defense: 480, mobility: 20, utility: 950 },
  PROTECTOR_MOTHERSHIP: { name: "Protector Mothership", tier: 6, power: 270, defense: 500, mobility: 19, utility: 900 },
  FORTRESS_MOTHERSHIP: { name: "Fortress Mothership", tier: 6, power: 260, defense: 550, mobility: 15, utility: 800 },
  ARSENAL_MOTHERSHIP: { name: "Arsenal Mothership", tier: 6, power: 400, defense: 350, mobility: 30, utility: 600 },
  TITAN_MOTHERSHIP: { name: "Titan Mothership", tier: 6, power: 450, defense: 380, mobility: 26, utility: 700 },
  LEVIATHAN_MOTHERSHIP: { name: "Leviathan Mothership", tier: 6, power: 500, defense: 420, mobility: 23, utility: 800 },
  MONUMENT_MOTHERSHIP: { name: "Monument Mothership", tier: 6, power: 200, defense: 300, mobility: 35, utility: 2000 },
  EMBASSY_MOTHERSHIP: { name: "Embassy Mothership", tier: 6, power: 180, defense: 250, mobility: 40, utility: 2500 },
  ACADEMY_MOTHERSHIP: { name: "Academy Mothership", tier: 6, power: 190, defense: 260, mobility: 38, utility: 2200 },
  ARCHIVE_MOTHERSHIP: { name: "Archive Mothership", tier: 6, power: 170, defense: 240, mobility: 42, utility: 3000 },

  // Specialized Motherships (20)
  SANCTUARY_SHIP: { name: "Sanctuary Ship", tier: 6, power: 160, defense: 280, mobility: 32, utility: 1800 },
  SANCTUARY_PRIME: { name: "Sanctuary Prime", tier: 6, power: 180, defense: 320, mobility: 30, utility: 2000 },
  MONASTERY_SHIP: { name: "Monastery Ship", tier: 6, power: 150, defense: 260, mobility: 34, utility: 1900 },
  TEMPLE_SHIP: { name: "Temple Ship", tier: 6, power: 140, defense: 240, mobility: 36, utility: 2100 },
  HOLY_VESSEL: { name: "Holy Vessel", tier: 6, power: 130, defense: 220, mobility: 40, utility: 2300 },
  GENESIS_SHIP: { name: "Genesis Ship", tier: 6, power: 200, defense: 350, mobility: 25, utility: 2500 },
  PROMETHEUS_SHIP: { name: "Prometheus Ship", tier: 6, power: 210, defense: 360, mobility: 24, utility: 2400 },
  ATHENA_SHIP: { name: "Athena Ship", tier: 6, power: 220, defense: 370, mobility: 23, utility: 2350 },
  APOLLO_SHIP: { name: "Apollo Ship", tier: 6, power: 190, defense: 330, mobility: 28, utility: 2600 },
  ARTEMIS_SHIP: { name: "Artemis Ship", tier: 6, power: 185, defense: 320, mobility: 29, utility: 2550 },
  MERCHANT_MOTHERSHIP: { name: "Merchant Mothership", tier: 6, power: 140, defense: 180, mobility: 50, utility: 3500 },
  TRADER_MOTHERSHIP: { name: "Trader Mothership", tier: 6, power: 130, defense: 170, mobility: 55, utility: 3800 },
  COMMERCE_VESSEL: { name: "Commerce Vessel", tier: 6, power: 120, defense: 150, mobility: 60, utility: 4000 },
  MARKET_VESSEL: { name: "Market Vessel", tier: 6, power: 115, defense: 140, mobility: 65, utility: 4200 },
  HARVESTER_PRIME: { name: "Harvester Prime", tier: 6, power: 160, defense: 200, mobility: 22, utility: 2800 },
  COLLECTOR_PRIME: { name: "Collector Prime", tier: 6, power: 155, defense: 190, mobility: 24, utility: 2700 },
  MINER_MOTHERSHIP: { name: "Miner Mothership", tier: 6, power: 145, defense: 170, mobility: 26, utility: 2600 },
  EXTRACTOR_SHIP: { name: "Extractor Ship", tier: 6, power: 135, defense: 160, mobility: 28, utility: 2500 },
  REFINERY_SHIP: { name: "Refinery Ship", tier: 6, power: 130, defense: 150, mobility: 30, utility: 2400 },
  PROCESSOR_SHIP: { name: "Processor Ship", tier: 6, power: 125, defense: 140, mobility: 32, utility: 2300 },
} as const;

// ====================
// MEGASTRUCTURES (80)
// ====================

export const MEGASTRUCTURE_TYPES = {
  // Energy & Power (15)
  DYSON_SPHERE: { name: "Dyson Sphere", tier: 10, power: 1000, efficiency: 0.95, capacity: 500000, maintenance: 5000 },
  DYSON_SHELL: { name: "Dyson Shell", tier: 9, power: 800, efficiency: 0.92, capacity: 400000, maintenance: 4000 },
  DYSON_RING: { name: "Dyson Ring", tier: 8, power: 600, efficiency: 0.88, capacity: 300000, maintenance: 3000 },
  STELLAR_CONVERTER: { name: "Stellar Converter", tier: 9, power: 900, efficiency: 0.94, capacity: 450000, maintenance: 4500 },
  STELLAR_ENGINE: { name: "Stellar Engine", tier: 9, power: 1300, efficiency: 0.90, capacity: 600000, maintenance: 5500 },
  SOLAR_COLLECTOR: { name: "Solar Collector", tier: 7, power: 400, efficiency: 0.85, capacity: 200000, maintenance: 2000 },
  SOLAR_ARRAY: { name: "Solar Array", tier: 8, power: 700, efficiency: 0.89, capacity: 350000, maintenance: 3500 },
  POWER_NEXUS: { name: "Power Nexus", tier: 8, power: 750, efficiency: 0.91, capacity: 380000, maintenance: 3800 },
  ENERGY_CORE: { name: "Energy Core", tier: 9, power: 950, efficiency: 0.93, capacity: 470000, maintenance: 4700 },
  REACTOR_PRIME: { name: "Reactor Prime", tier: 10, power: 1200, efficiency: 0.96, capacity: 580000, maintenance: 5200 },
  FUSION_NEXUS: { name: "Fusion Nexus", tier: 8, power: 680, efficiency: 0.87, capacity: 330000, maintenance: 3300 },
  ANTIMATTER_REACTOR: { name: "Antimatter Reactor", tier: 10, power: 1400, efficiency: 0.97, capacity: 650000, maintenance: 6000 },
  QUANTUM_REACTOR: { name: "Quantum Reactor", tier: 10, power: 1500, efficiency: 0.98, capacity: 700000, maintenance: 6500 },
  ZERO_POINT_REACTOR: { name: "Zero Point Reactor", tier: 10, power: 2000, efficiency: 0.99, capacity: 900000, maintenance: 8000 },
  VACUUM_ENERGY_HARVESTER: { name: "Vacuum Energy Harvester", tier: 10, power: 1800, efficiency: 0.99, capacity: 850000, maintenance: 7500 },

  // Habitation & Living Space (15)
  RINGWORLD: { name: "Ringworld", tier: 9, power: 500, efficiency: 0.90, capacity: 15000, maintenance: 2000 },
  MEGACITY: { name: "Megacity", tier: 8, power: 300, efficiency: 0.85, capacity: 10000, maintenance: 1500 },
  ECUMENOPOLIS: { name: "Ecumenopolis", tier: 9, power: 400, efficiency: 0.88, capacity: 12000, maintenance: 1800 },
  ARCOLOGY: { name: "Arcology", tier: 7, power: 250, efficiency: 0.82, capacity: 8000, maintenance: 1200 },
  ARCOLOGY_PRIME: { name: "Arcology Prime", tier: 8, power: 350, efficiency: 0.87, capacity: 11000, maintenance: 1700 },
  ORBITAL_HABITAT: { name: "Orbital Habitat", tier: 6, power: 150, efficiency: 0.78, capacity: 5000, maintenance: 800 },
  SPACE_STATION_ALPHA: { name: "Space Station Alpha", tier: 7, power: 200, efficiency: 0.80, capacity: 6000, maintenance: 1000 },
  COLONY_MEGASTRUCTURE: { name: "Colony Megastructure", tier: 8, power: 380, efficiency: 0.89, capacity: 13000, maintenance: 1900 },
  GENERATION_SHIP: { name: "Generation Ship", tier: 8, power: 300, efficiency: 0.84, capacity: 12000, maintenance: 1600 },
  WORLDSHIP: { name: "Worldship", tier: 9, power: 420, efficiency: 0.91, capacity: 14000, maintenance: 2100 },
  EXODUS_VESSEL: { name: "Exodus Vessel", tier: 8, power: 340, efficiency: 0.86, capacity: 11500, maintenance: 1750 },
  SANCTUARY_SPHERE: { name: "Sanctuary Sphere", tier: 9, power: 480, efficiency: 0.93, capacity: 15500, maintenance: 2200 },
  GARDEN_WORLD: { name: "Garden World", tier: 8, power: 320, efficiency: 0.85, capacity: 10500, maintenance: 1600 },
  PARADISE_STATION: { name: "Paradise Station", tier: 9, power: 450, efficiency: 0.92, capacity: 14500, maintenance: 2000 },
  EDEN_SPHERE: { name: "Eden Sphere", tier: 9, power: 460, efficiency: 0.92, capacity: 15000, maintenance: 2050 },

  // Production & Manufacturing (15)
  MEGAFORGE: { name: "Megaforge", tier: 9, power: 800, efficiency: 0.90, capacity: 5000, maintenance: 3000 },
  FACTORY_MATRIX: { name: "Factory Matrix", tier: 8, power: 600, efficiency: 0.88, capacity: 3500, maintenance: 2200 },
  PRODUCTION_NEXUS: { name: "Production Nexus", tier: 8, power: 550, efficiency: 0.86, capacity: 3200, maintenance: 1900 },
  AUTOMATED_FACTORY: { name: "Automated Factory", tier: 7, power: 400, efficiency: 0.82, capacity: 2500, maintenance: 1500 },
  ROBOT_FACTORY: { name: "Robot Factory", tier: 8, power: 500, efficiency: 0.85, capacity: 3000, maintenance: 1800 },
  SHIPYARD_NEXUS: { name: "Shipyard Nexus", tier: 9, power: 750, efficiency: 0.89, capacity: 4500, maintenance: 2800 },
  WEAPONS_FOUNDRY: { name: "Weapons Foundry", tier: 8, power: 650, efficiency: 0.87, capacity: 3800, maintenance: 2400 },
  ARMOR_FORGE: { name: "Armor Forge", tier: 8, power: 620, efficiency: 0.86, capacity: 3600, maintenance: 2200 },
  TOOL_FACTORY: { name: "Tool Factory", tier: 7, power: 300, efficiency: 0.80, capacity: 2000, maintenance: 1200 },
  COMPONENT_FACTORY: { name: "Component Factory", tier: 7, power: 350, efficiency: 0.81, capacity: 2200, maintenance: 1300 },
  NANOBOT_FACTORY: { name: "Nanobot Factory", tier: 9, power: 900, efficiency: 0.92, capacity: 5200, maintenance: 3200 },
  REPLICATOR_NEXUS: { name: "Replicator Nexus", tier: 9, power: 850, efficiency: 0.91, capacity: 4800, maintenance: 3000 },
  MATTER_COMPILER: { name: "Matter Compiler", tier: 10, power: 1000, efficiency: 0.94, capacity: 6000, maintenance: 3500 },
  ASSEMBLER_MATRIX: { name: "Assembler Matrix", tier: 8, power: 700, efficiency: 0.89, capacity: 4200, maintenance: 2500 },
  CONSTRUCTION_NEXUS: { name: "Construction Nexus", tier: 8, power: 680, efficiency: 0.88, capacity: 4100, maintenance: 2400 },

  // Research & Science (15)
  RESEARCH_NEXUS: { name: "Research Nexus", tier: 10, power: 500, efficiency: 0.99, capacity: 300, maintenance: 1000 },
  SUPER_COLLIDER: { name: "Super Collider", tier: 9, power: 450, efficiency: 0.97, capacity: 250, maintenance: 900 },
  RESEARCH_COMPLEX: { name: "Research Complex", tier: 8, power: 350, efficiency: 0.94, capacity: 200, maintenance: 700 },
  QUANTUM_LABORATORY: { name: "Quantum Laboratory", tier: 9, power: 400, efficiency: 0.96, capacity: 230, maintenance: 850 },
  OBSERVATORY: { name: "Observatory", tier: 8, power: 250, efficiency: 0.91, capacity: 150, maintenance: 500 },
  MEGA_OBSERVATORY: { name: "Mega Observatory", tier: 9, power: 350, efficiency: 0.95, capacity: 210, maintenance: 750 },
  SENSOR_ARRAY: { name: "Sensor Array", tier: 8, power: 300, efficiency: 0.93, capacity: 180, maintenance: 600 },
  DETECTION_NEXUS: { name: "Detection Nexus", tier: 9, power: 420, efficiency: 0.96, capacity: 240, maintenance: 880 },
  LABORATORY_NEXUS: { name: "Laboratory Nexus", tier: 8, power: 380, efficiency: 0.95, capacity: 220, maintenance: 800 },
  RESEARCH_INSTITUTE: { name: "Research Institute", tier: 7, power: 280, efficiency: 0.90, capacity: 160, maintenance: 550 },
  ACADEMY_NEXUS: { name: "Academy Nexus", tier: 8, power: 360, efficiency: 0.94, capacity: 210, maintenance: 750 },
  KNOWLEDGE_ARCHIVE: { name: "Knowledge Archive", tier: 8, power: 320, efficiency: 0.92, capacity: 190, maintenance: 700 },
  DATA_VAULT: { name: "Data Vault", tier: 7, power: 200, efficiency: 0.85, capacity: 120, maintenance: 400 },
  COMPUTATION_NEXUS: { name: "Computation Nexus", tier: 9, power: 500, efficiency: 0.98, capacity: 280, maintenance: 950 },
  THINK_TANK: { name: "Think Tank", tier: 8, power: 340, efficiency: 0.93, capacity: 200, maintenance: 720 },

  // Defense & Military (15)
  ORBITAL_FORTRESS: { name: "Orbital Fortress", tier: 9, power: 800, efficiency: 0.88, capacity: 150000, maintenance: 4000 },
  DEFENSE_NEXUS: { name: "Defense Nexus", tier: 8, power: 600, efficiency: 0.86, capacity: 120000, maintenance: 3000 },
  FORTRESS_RING: { name: "Fortress Ring", tier: 8, power: 550, efficiency: 0.85, capacity: 100000, maintenance: 2800 },
  NOVA_CANNON: { name: "Nova Cannon", tier: 10, power: 2000, efficiency: 0.92, capacity: 200000, maintenance: 5000 },
  DEATH_STAR: { name: "Death Star", tier: 10, power: 2500, efficiency: 0.94, capacity: 250000, maintenance: 6000 },
  PLANETARY_SHIELD: { name: "Planetary Shield", tier: 9, power: 700, efficiency: 0.89, capacity: 180000, maintenance: 3500 },
  SHIELD_GENERATOR: { name: "Shield Generator", tier: 8, power: 550, efficiency: 0.87, capacity: 130000, maintenance: 2500 },
  LASER_ARRAY: { name: "Laser Array", tier: 8, power: 650, efficiency: 0.85, capacity: 110000, maintenance: 3200 },
  WEAPON_PLATFORM: { name: "Weapon Platform", tier: 7, power: 400, efficiency: 0.80, capacity: 80000, maintenance: 1800 },
  DEFENSE_STATION: { name: "Defense Station", tier: 7, power: 350, efficiency: 0.79, capacity: 70000, maintenance: 1600 },
  SENTINEL_ARRAY: { name: "Sentinel Array", tier: 8, power: 500, efficiency: 0.83, capacity: 95000, maintenance: 2200 },
  GUARDIAN_MATRIX: { name: "Guardian Matrix", tier: 8, power: 520, efficiency: 0.84, capacity: 105000, maintenance: 2400 },
  PROTECTOR_NEXUS: { name: "Protector Nexus", tier: 8, power: 480, efficiency: 0.82, capacity: 90000, maintenance: 2100 },
  BULWARK_FORTRESS: { name: "Bulwark Fortress", tier: 9, power: 750, efficiency: 0.90, capacity: 160000, maintenance: 3800 },
  BASTION_ARRAY: { name: "Bastion Array", tier: 9, power: 720, efficiency: 0.89, capacity: 150000, maintenance: 3600 },

  // Transport & Mobility (5)
  WARP_GATE: { name: "Warp Gate", tier: 9, power: 500, efficiency: 0.95, capacity: 1000000, maintenance: 2000 },
  PORTAL_NEXUS: { name: "Portal Nexus", tier: 9, power: 480, efficiency: 0.94, capacity: 950000, maintenance: 1900 },
  DIMENSIONAL_GATE: { name: "Dimensional Gate", tier: 10, power: 600, efficiency: 0.97, capacity: 1200000, maintenance: 2500 },
  TRANSIT_HUB: { name: "Transit Hub", tier: 8, power: 350, efficiency: 0.90, capacity: 800000, maintenance: 1500 },
  TELEPORT_NEXUS: { name: "Teleport Nexus", tier: 9, power: 420, efficiency: 0.92, capacity: 900000, maintenance: 1800 },
} as const;

// ====================
// BUILDINGS (75)
// ====================

export const BUILDING_TYPES = {
  // Resource Production (15)
  METAL_MINE: { name: "Metal Mine", tier: 1, production: 100, cost: 500, maintenance: 50 },
  CRYSTAL_MINE: { name: "Crystal Mine", tier: 1, production: 75, cost: 750, maintenance: 60 },
  DEUTERIUM_EXTRACTOR: { name: "Deuterium Extractor", tier: 1, production: 50, cost: 1000, maintenance: 70 },
  ADVANCED_METAL_MINE: { name: "Advanced Metal Mine", tier: 3, production: 300, cost: 5000, maintenance: 150 },
  ADVANCED_CRYSTAL_FACILITY: { name: "Advanced Crystal Facility", tier: 3, production: 225, cost: 7500, maintenance: 180 },
  DEUTERIUM_FACILITY: { name: "Deuterium Facility", tier: 3, production: 150, cost: 10000, maintenance: 200 },
  MEGA_MINE: { name: "Mega Mine", tier: 5, production: 800, cost: 25000, maintenance: 400 },
  SUPER_FACILITY: { name: "Super Facility", tier: 5, production: 600, cost: 35000, maintenance: 500 },
  POWER_PLANT: { name: "Power Plant", tier: 2, production: 200, cost: 3000, maintenance: 100 },
  FUSION_REACTOR: { name: "Fusion Reactor", tier: 4, production: 600, cost: 15000, maintenance: 300 },
  SOLAR_POWER_PLANT: { name: "Solar Power Plant", tier: 2, production: 250, cost: 2500, maintenance: 80 },
  GEOTHERMAL_PLANT: { name: "Geothermal Plant", tier: 3, production: 350, cost: 8000, maintenance: 200 },
  ANTIMATTER_GENERATOR: { name: "Antimatter Generator", tier: 6, production: 1500, cost: 50000, maintenance: 800 },
  ZERO_POINT_TAP: { name: "Zero Point Tap", tier: 6, production: 2000, cost: 75000, maintenance: 1000 },
  QUANTUM_EXTRACTOR: { name: "Quantum Extractor", tier: 5, production: 900, cost: 40000, maintenance: 600 },

  // Military Production (15)
  SHIPYARD: { name: "Shipyard", tier: 2, production: 50, cost: 5000, maintenance: 200 },
  ADVANCED_SHIPYARD: { name: "Advanced Shipyard", tier: 4, production: 150, cost: 20000, maintenance: 600 },
  MEGA_SHIPYARD: { name: "Mega Shipyard", tier: 6, production: 400, cost: 60000, maintenance: 1500 },
  WEAPONS_FACTORY: { name: "Weapons Factory", tier: 3, production: 100, cost: 8000, maintenance: 250 },
  LASER_WEAPONS_FACTORY: { name: "Laser Weapons Factory", tier: 4, production: 200, cost: 18000, maintenance: 500 },
  PLASMA_WEAPONS_FACTORY: { name: "Plasma Weapons Factory", tier: 5, production: 350, cost: 35000, maintenance: 800 },
  MISSILE_FACTORY: { name: "Missile Factory", tier: 3, production: 120, cost: 10000, maintenance: 300 },
  ARMOR_FACILITY: { name: "Armor Facility", tier: 3, production: 90, cost: 7000, maintenance: 200 },
  SHIELD_GENERATOR_FACTORY: { name: "Shield Generator Factory", tier: 4, production: 180, cost: 16000, maintenance: 450 },
  BOMB_FACTORY: { name: "Bomb Factory", tier: 4, production: 140, cost: 14000, maintenance: 350 },
  DEFENSE_TURRET: { name: "Defense Turret", tier: 2, production: 30, cost: 3000, maintenance: 100 },
  AUTOMATED_DEFENSE: { name: "Automated Defense", tier: 4, production: 120, cost: 12000, maintenance: 350 },
  UNIT_BARRACKS: { name: "Unit Barracks", tier: 2, production: 40, cost: 4000, maintenance: 150 },
  ELITE_BARRACKS: { name: "Elite Barracks", tier: 4, production: 160, cost: 25000, maintenance: 600 },
  TROOP_ASSEMBLY: { name: "Troop Assembly", tier: 3, production: 80, cost: 9000, maintenance: 250 },

  // Support Facilities (15)
  RESEARCH_LAB: { name: "Research Lab", tier: 2, production: 100, cost: 5000, maintenance: 150 },
  ADVANCED_RESEARCH: { name: "Advanced Research", tier: 4, production: 350, cost: 20000, maintenance: 500 },
  QUANTUM_RESEARCH: { name: "Quantum Research", tier: 5, production: 650, cost: 40000, maintenance: 1000 },
  HOSPITAL: { name: "Hospital", tier: 2, production: 75, cost: 6000, maintenance: 200 },
  ADVANCED_HOSPITAL: { name: "Advanced Hospital", tier: 4, production: 250, cost: 18000, maintenance: 600 },
  MEDICAL_CENTER: { name: "Medical Center", tier: 3, production: 150, cost: 12000, maintenance: 350 },
  STORAGE_FACILITY: { name: "Storage Facility", tier: 1, production: 500, cost: 2000, maintenance: 100 },
  MEGA_STORAGE: { name: "Mega Storage", tier: 3, production: 2000, cost: 8000, maintenance: 300 },
  VAULT: { name: "Vault", tier: 4, production: 5000, cost: 25000, maintenance: 800 },
  BANK: { name: "Bank", tier: 2, production: 300, cost: 4000, maintenance: 150 },
  MARKET: { name: "Market", tier: 2, production: 250, cost: 3500, maintenance: 120 },
  TRADING_POST: { name: "Trading Post", tier: 3, production: 600, cost: 10000, maintenance: 300 },
  CUSTOMS_OFFICE: { name: "Customs Office", tier: 2, production: 150, cost: 3000, maintenance: 80 },
  UNIVERSITY: { name: "University", tier: 3, production: 200, cost: 12000, maintenance: 400 },
  ACADEMY: { name: "Academy", tier: 4, production: 500, cost: 25000, maintenance: 800 },

  // Economic & Social (15)
  FARM: { name: "Farm", tier: 1, production: 60, cost: 1000, maintenance: 40 },
  HYDROPONICS: { name: "Hydroponics", tier: 3, production: 200, cost: 8000, maintenance: 200 },
  AGRI_DOME: { name: "Agri Dome", tier: 4, production: 400, cost: 18000, maintenance: 500 },
  HOUSING: { name: "Housing", tier: 1, production: 50, cost: 800, maintenance: 30 },
  ADVANCED_HOUSING: { name: "Advanced Housing", tier: 3, production: 150, cost: 6000, maintenance: 150 },
  LUXURY_HOUSING: { name: "Luxury Housing", tier: 4, production: 300, cost: 15000, maintenance: 400 },
  ENTERTAINMENT_COMPLEX: { name: "Entertainment Complex", tier: 2, production: 100, cost: 5000, maintenance: 150 },
  SPORTS_ARENA: { name: "Sports Arena", tier: 3, production: 200, cost: 10000, maintenance: 300 },
  CASINO: { name: "Casino", tier: 3, production: 250, cost: 12000, maintenance: 350 },
  TEMPLE: { name: "Temple", tier: 2, production: 80, cost: 4000, maintenance: 100 },
  MONUMENT: { name: "Monument", tier: 3, production: 150, cost: 15000, maintenance: 250 },
  CULTURAL_CENTER: { name: "Cultural Center", tier: 3, production: 200, cost: 10000, maintenance: 300 },
  DIPLOMATIC_EMBASSY: { name: "Diplomatic Embassy", tier: 3, production: 120, cost: 12000, maintenance: 250 },
  GOVERNMENT_COMPLEX: { name: "Government Complex", tier: 4, production: 300, cost: 25000, maintenance: 600 },
  CAPITAL_BUILDING: { name: "Capital Building", tier: 4, production: 400, cost: 35000, maintenance: 800 },

  // Technology (15)
  ANDROID_FACTORY: { name: "Android Factory", tier: 4, production: 200, cost: 20000, maintenance: 500 },
  AI_CORE: { name: "AI Core", tier: 4, production: 250, cost: 22000, maintenance: 600 },
  ROBOT_ASSEMBLY: { name: "Robot Assembly", tier: 3, production: 120, cost: 10000, maintenance: 250 },
  NANOTECH_FACILITY: { name: "Nanotech Facility", tier: 5, production: 500, cost: 40000, maintenance: 1000 },
  BIOTECHNOLOGY_LAB: { name: "Biotechnology Lab", tier: 4, production: 300, cost: 25000, maintenance: 700 },
  GENETIC_ENGINEERING: { name: "Genetic Engineering", tier: 5, production: 600, cost: 45000, maintenance: 1200 },
  QUANTUM_COMPUTER: { name: "Quantum Computer", tier: 5, production: 400, cost: 35000, maintenance: 900 },
  SUPERCOMPUTER: { name: "Supercomputer", tier: 4, production: 250, cost: 20000, maintenance: 500 },
  NEURAL_NEXUS: { name: "Neural Nexus", tier: 5, production: 550, cost: 42000, maintenance: 1100 },
  DIMENSIONAL_RESEARCH: { name: "Dimensional Research", tier: 6, production: 1000, cost: 75000, maintenance: 2000 },
  TIME_LABORATORY: { name: "Time Laboratory", tier: 6, production: 800, cost: 80000, maintenance: 1800 },
  PARTICLE_ACCELERATOR: { name: "Particle Accelerator", tier: 5, production: 450, cost: 38000, maintenance: 900 },
  TELEPORTATION_NEXUS: { name: "Teleportation Nexus", tier: 5, production: 350, cost: 32000, maintenance: 800 },
  CLOAKING_DEVICE: { name: "Cloaking Device", tier: 5, production: 300, cost: 28000, maintenance: 700 },
  TRACTOR_BEAM_EMITTER: { name: "Tractor Beam Emitter", tier: 4, production: 180, cost: 18000, maintenance: 450 },
} as const;

// ====================
// TROOPS (40)
// ====================

export const TROOP_TYPES = {
  // Basic Infantry (10)
  INFANTRY: { name: "Infantry", tier: 1, power: 10, defense: 8, mobility: 6, cost: 100 },
  HEAVY_INFANTRY: { name: "Heavy Infantry", tier: 2, power: 20, defense: 16, mobility: 4, cost: 250 },
  SPECIAL_FORCES: { name: "Special Forces", tier: 2, power: 25, defense: 12, mobility: 10, cost: 350 },
  SNIPER: { name: "Sniper", tier: 2, power: 30, defense: 6, mobility: 8, cost: 300 },
  MEDIC: { name: "Medic", tier: 2, power: 5, defense: 6, mobility: 8, cost: 200 },
  ENGINEER: { name: "Engineer", tier: 2, power: 8, defense: 7, mobility: 7, cost: 220 },
  SCOUT: { name: "Scout", tier: 1, power: 5, defense: 3, mobility: 15, cost: 80 },
  ASSAULT_TEAM: { name: "Assault Team", tier: 2, power: 22, defense: 10, mobility: 8, cost: 280 },
  PARATROOPER: { name: "Paratrooper", tier: 2, power: 15, defense: 9, mobility: 12, cost: 240 },
  COMMANDO: { name: "Commando", tier: 3, power: 35, defense: 14, mobility: 11, cost: 400 },

  // Advanced Infantry (10)
  ELITE_GUARD: { name: "Elite Guard", tier: 3, power: 40, defense: 25, mobility: 8, cost: 500 },
  ROYAL_GUARD: { name: "Royal Guard", tier: 3, power: 45, defense: 28, mobility: 7, cost: 600 },
  SPEC_OPS: { name: "Spec Ops", tier: 3, power: 50, defense: 18, mobility: 14, cost: 550 },
  HAZMAT_TROOPER: { name: "Hazmat Trooper", tier: 3, power: 12, defense: 30, mobility: 5, cost: 400 },
  CRYOGENIC_SOLDIER: { name: "Cryogenic Soldier", tier: 4, power: 60, defense: 20, mobility: 6, cost: 800 },
  THERMAL_WARRIOR: { name: "Thermal Warrior", tier: 4, power: 65, defense: 19, mobility: 5, cost: 850 },
  RADIATION_TROOPER: { name: "Radiation Trooper", tier: 4, power: 55, defense: 22, mobility: 7, cost: 750 },
  PLASMA_WARRIOR: { name: "Plasma Warrior", tier: 4, power: 70, defense: 17, mobility: 6, cost: 900 },
  CYBER_SOLDIER: { name: "Cyber Soldier", tier: 4, power: 75, defense: 21, mobility: 8, cost: 950 },
  ANDROID_TROOPER: { name: "Android Trooper", tier: 4, power: 80, defense: 24, mobility: 9, cost: 1000 },

  // Support Troops (10)
  TECHNICIAN: { name: "Technician", tier: 2, power: 6, defense: 5, mobility: 7, cost: 150 },
  SCIENTIST: { name: "Scientist", tier: 2, power: 4, defense: 4, mobility: 6, cost: 140 },
  COMMUNICATIONS_OFFICER: { name: "Communications Officer", tier: 2, power: 3, defense: 5, mobility: 8, cost: 130 },
  SUPPLY_OFFICER: { name: "Supply Officer", tier: 2, power: 2, defense: 4, mobility: 5, cost: 120 },
  NAVIGATOR: { name: "Navigator", tier: 2, power: 5, defense: 4, mobility: 10, cost: 160 },
  LOGISTICS_SPECIALIST: { name: "Logistics Specialist", tier: 3, power: 8, defense: 8, mobility: 9, cost: 300 },
  MEDICAL_SPECIALIST: { name: "Medical Specialist", tier: 3, power: 6, defense: 10, mobility: 7, cost: 280 },
  RADIATION_SHIELDING_TECH: { name: "Radiation Shielding Tech", tier: 3, power: 7, defense: 12, mobility: 5, cost: 320 },
  HACKER: { name: "Hacker", tier: 3, power: 4, defense: 6, mobility: 8, cost: 350 },
  INTELLIGENCE_AGENT: { name: "Intelligence Agent", tier: 3, power: 12, defense: 7, mobility: 12, cost: 400 },

  // Officer Ranks (10)
  MARINE: { name: "Marine", tier: 2, power: 18, defense: 14, mobility: 9, cost: 200 },
  PILOT: { name: "Pilot", tier: 2, power: 15, defense: 10, mobility: 12, cost: 220 },
  OFFICER: { name: "Officer", tier: 2, power: 20, defense: 12, mobility: 10, cost: 280 },
  SERGEANT: { name: "Sergeant", tier: 3, power: 30, defense: 16, mobility: 9, cost: 420 },
  CAPTAIN: { name: "Captain", tier: 3, power: 45, defense: 22, mobility: 10, cost: 650 },
  GENERAL: { name: "General", tier: 4, power: 80, defense: 35, mobility: 12, cost: 1500 },
  ADMIRAL: { name: "Admiral", tier: 4, power: 100, defense: 40, mobility: 13, cost: 2000 },
  COMMANDER: { name: "Commander", tier: 4, power: 90, defense: 38, mobility: 12, cost: 1800 },
  MARSHAL: { name: "Marshal", tier: 5, power: 150, defense: 50, mobility: 14, cost: 3000 },
  WARLORD: { name: "Warlord", tier: 5, power: 200, defense: 60, mobility: 15, cost: 4000 },
} as const;

// ====================
// VEHICLES & UNITS (40)
// ====================

export const VEHICLE_TYPES = {
  // Ground Vehicles (20)
  TANK: { name: "Tank", tier: 2, power: 50, defense: 60, mobility: 30, cost: 800 },
  HEAVY_TANK: { name: "Heavy Tank", tier: 3, power: 100, defense: 100, mobility: 20, cost: 1500 },
  LIGHT_TANK: { name: "Light Tank", tier: 2, power: 40, defense: 40, mobility: 50, cost: 600 },
  SUPER_HEAVY_TANK: { name: "Super Heavy Tank", tier: 4, power: 150, defense: 150, mobility: 15, cost: 3000 },
  ARTILLERY: { name: "Artillery", tier: 2, power: 80, defense: 30, mobility: 20, cost: 1000 },
  MOBILE_ARTILLERY: { name: "Mobile Artillery", tier: 3, power: 120, defense: 40, mobility: 35, cost: 1800 },
  MECH: { name: "Mech", tier: 3, power: 110, defense: 70, mobility: 40, cost: 2200 },
  ASSAULT_MECH: { name: "Assault Mech", tier: 4, power: 180, defense: 100, mobility: 30, cost: 3500 },
  DRONE: { name: "Drone", tier: 2, power: 30, defense: 20, mobility: 80, cost: 400 },
  FIGHT_DRONE: { name: "Fight Drone", tier: 3, power: 60, defense: 35, mobility: 90, cost: 1200 },
  WALKER: { name: "Walker", tier: 2, power: 45, defense: 50, mobility: 35, cost: 750 },
  GUNSHIP: { name: "Gunship", tier: 3, power: 90, defense: 45, mobility: 60, cost: 1600 },
  TRANSPORT: { name: "Transport", tier: 2, power: 20, defense: 35, mobility: 40, cost: 600 },
  SUPPLY_TRUCK: { name: "Supply Truck", tier: 2, power: 10, defense: 30, mobility: 50, cost: 400 },
  SUPPORT_VEHICLE: { name: "Support Vehicle", tier: 2, power: 25, defense: 40, mobility: 45, cost: 700 },
  RECON_UNIT: { name: "Recon Unit", tier: 2, power: 15, defense: 15, mobility: 95, cost: 300 },
  HEAVY_ARMOR: { name: "Heavy Armor", tier: 3, power: 140, defense: 120, mobility: 22, cost: 2500 },
  COMBAT_WALKER: { name: "Combat Walker", tier: 3, power: 95, defense: 75, mobility: 40, cost: 1800 },
  SIEGE_ENGINE: { name: "Siege Engine", tier: 4, power: 200, defense: 140, mobility: 10, cost: 4000 },
  BATTLE_WALKER: { name: "Battle Walker", tier: 4, power: 160, defense: 120, mobility: 35, cost: 3200 },

  // Air & Aerial Vehicles (10)
  AIR_FIGHTER: { name: "Air Fighter", tier: 2, power: 55, defense: 35, mobility: 90, cost: 1200 },
  AIR_BOMBER: { name: "Air Bomber", tier: 3, power: 110, defense: 50, mobility: 60, cost: 1800 },
  HELICOPTER: { name: "Helicopter", tier: 2, power: 50, defense: 40, mobility: 75, cost: 1000 },
  TRANSPORT_CHOPPER: { name: "Transport Chopper", tier: 2, power: 20, defense: 35, mobility: 70, cost: 900 },
  GUNSHIP_CHOPPER: { name: "Gunship Chopper", tier: 3, power: 85, defense: 50, mobility: 65, cost: 1600 },
  SKY_FORTRESS: { name: "Sky Fortress", tier: 4, power: 200, defense: 100, mobility: 40, cost: 3500 },
  DRONE_SWARM: { name: "Drone Swarm", tier: 3, power: 100, defense: 40, mobility: 95, cost: 1400 },
  AIRSHIP: { name: "Airship", tier: 3, power: 70, defense: 80, mobility: 45, cost: 2000 },
  STEALTH_COPTER: { name: "Stealth Copter", tier: 4, power: 60, defense: 55, mobility: 85, cost: 2500 },
  FLYING_FORTRESS: { name: "Flying Fortress", tier: 4, power: 180, defense: 120, mobility: 35, cost: 3800 },

  // Naval Units (10)
  BATTLESHIP: { name: "Battleship", tier: 3, power: 150, defense: 110, mobility: 25, cost: 2500 },
  CRUISER_SHIP: { name: "Cruiser Ship", tier: 3, power: 100, defense: 80, mobility: 50, cost: 1600 },
  DESTROYER_SHIP: { name: "Destroyer Ship", tier: 3, power: 90, defense: 70, mobility: 70, cost: 1400 },
  SUBMARINE: { name: "Submarine", tier: 3, power: 80, defense: 90, mobility: 60, cost: 1800 },
  AIRCRAFT_CARRIER: { name: "Aircraft Carrier", tier: 4, power: 120, defense: 100, mobility: 30, cost: 3000 },
  TORPEDO_BOAT: { name: "Torpedo Boat", tier: 2, power: 60, defense: 30, mobility: 80, cost: 800 },
  MINE_SWEEPER: { name: "Mine Sweeper", tier: 2, power: 20, defense: 50, mobility: 60, cost: 900 },
  PATROL_BOAT: { name: "Patrol Boat", tier: 2, power: 35, defense: 25, mobility: 85, cost: 600 },
  SUPPLY_SHIP: { name: "Supply Ship", tier: 2, power: 15, defense: 40, mobility: 40, cost: 800 },
  RESEARCH_VESSEL: { name: "Research Vessel", tier: 3, power: 30, defense: 50, mobility: 45, cost: 1400 },
} as const;

// ====================
// EXPORT COLLECTIONS
// ====================

export const ENTITIES_EXPANSION_CONFIG = {
  STARSHIP_TYPES,
  MOTHERSHIP_TYPES,
  MEGASTRUCTURE_TYPES,
  BUILDING_TYPES,
  TROOP_TYPES,
  VEHICLE_TYPES,
} as const;

/**
 * Get all entity types across all categories
 */
export function getAllEntityTypes() {
  return {
    ...STARSHIP_TYPES,
    ...MOTHERSHIP_TYPES,
    ...MEGASTRUCTURE_TYPES,
    ...BUILDING_TYPES,
    ...TROOP_TYPES,
    ...VEHICLE_TYPES,
  };
}

/**
 * Count total entities across all categories
 */
export function getTotalEntityCount(): number {
  return (
    Object.keys(STARSHIP_TYPES).length +
    Object.keys(MOTHERSHIP_TYPES).length +
    Object.keys(MEGASTRUCTURE_TYPES).length +
    Object.keys(BUILDING_TYPES).length +
    Object.keys(TROOP_TYPES).length +
    Object.keys(VEHICLE_TYPES).length
  );
}

/**
 * Get entity by category
 */
export function getEntitiesByCategory(category: keyof typeof ENTITIES_EXPANSION_CONFIG) {
  return ENTITIES_EXPANSION_CONFIG[category];
}

/**
 * Search for entity by name
 */
export function findEntityByName(name: string) {
  const allEntities = getAllEntityTypes();
  for (const key in allEntities) {
    if (allEntities[key as keyof typeof allEntities]?.name.toLowerCase() === name.toLowerCase()) {
      return allEntities[key as keyof typeof allEntities];
    }
  }
  return null;
}

export default ENTITIES_EXPANSION_CONFIG;
