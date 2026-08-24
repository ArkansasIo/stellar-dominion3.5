/**
 * Canonical world and moon taxonomy.
 *
 * World IDs are stable when generated from class code, size, and instance number:
 * WRL-{class code}-{size}-{instance number}.
 * The first 26 classes are A-Z; AA-AP are late-game advanced classes.
 */

export type WorldSize = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type WorldRarity = "common" | "uncommon" | "rare" | "epic" | "legendary" | "mythic";
export type WorldClassCode = string;
export type MoonArchetypeCode = "M01" | "M02" | "M03" | "M04" | "M05" | "M06" | "M07" | "M08" | "M09" | "M10" | "M11" | "M12";

export interface WorldSizeProfile {
  readonly size: WorldSize;
  readonly label: string;
  readonly diameterKm: number;
  readonly gravityMultiplier: number;
  readonly populationMultiplier: number;
  readonly resourceMultiplier: number;
  readonly maximumMoons: number;
  readonly buildSlots: number;
}

export interface WorldEnvironment {
  readonly temperatureC: { readonly min: number; readonly max: number; readonly average: number };
  readonly atmosphericPressureKpa: number;
  readonly waterPercent: number;
  readonly radiationPercent: number;
  readonly gravity: number;
  readonly habitability: number;
  readonly stormActivity: number;
  readonly tectonicActivity: number;
  readonly magneticField: number;
}

export interface WorldGameplayModifiers {
  readonly naquadahProduction: number;
  readonly metalProduction: number;
  readonly crystalProduction: number;
  readonly foodProduction: number;
  readonly waterProduction: number;
  readonly energyProduction: number;
  readonly researchSpeed: number;
  readonly shipyardSpeed: number;
  readonly defenseStrength: number;
  readonly covertStrength: number;
  readonly populationGrowth: number;
  readonly explorationRisk: number;
  readonly colonizationCost: number;
  readonly storageMultiplier: number;
}

export interface MoonArchetype {
  readonly id: MoonArchetypeCode;
  readonly name: string;
  readonly moonClass: string;
  readonly subclass: string;
  readonly type: string;
  readonly subtype: string;
  readonly biome: string;
  readonly subBiome: string;
  readonly atmosphere: string;
  readonly rarity: WorldRarity;
  readonly resourceFocus: string;
  readonly facilityHooks: readonly string[];
  readonly modifiers: Readonly<Pick<WorldGameplayModifiers, "naquadahProduction" | "metalProduction" | "crystalProduction" | "foodProduction" | "waterProduction" | "energyProduction" | "researchSpeed" | "shipyardSpeed" | "defenseStrength" | "covertStrength">>;
}

export interface WorldArchetype {
  readonly id: string;
  readonly classCode: WorldClassCode;
  readonly className: string;
  readonly subclass: string;
  readonly type: string;
  readonly subtype: string;
  readonly name: string;
  readonly biome: string;
  readonly subBiome: string;
  readonly rarity: WorldRarity;
  readonly preferredMoonArchetypes: readonly MoonArchetypeCode[];
  readonly environment: WorldEnvironment;
  readonly modifiers: WorldGameplayModifiers;
  readonly specialSystems: readonly string[];
  readonly lore: string;
}

export interface GeneratedMoonProfile {
  readonly id: string;
  readonly name: string;
  readonly parentWorldId: string;
  readonly archetypeId: MoonArchetypeCode;
  readonly moonClass: string;
  readonly subclass: string;
  readonly type: string;
  readonly subtype: string;
  readonly biome: string;
  readonly subBiome: string;
  readonly atmosphere: string;
  readonly size: WorldSize;
  readonly orbitSlot: number;
  readonly condition: number;
  readonly developmentLevel: number;
  readonly habitability: number;
  readonly gravity: number;
  readonly resourceDensity: number;
  readonly defenseRating: number;
  readonly researchRating: number;
  readonly productionMultiplier: number;
  readonly specialSystems: readonly string[];
  readonly createdAt: number;
}

export const WORLD_SIZE_PROFILES: readonly WorldSizeProfile[] = [
  { size: 1, label: "Dwarf", diameterKm: 1_500, gravityMultiplier: 0.35, populationMultiplier: 0.25, resourceMultiplier: 0.6, maximumMoons: 0, buildSlots: 2 },
  { size: 2, label: "Small", diameterKm: 4_500, gravityMultiplier: 0.6, populationMultiplier: 0.5, resourceMultiplier: 0.8, maximumMoons: 1, buildSlots: 4 },
  { size: 3, label: "Compact", diameterKm: 7_000, gravityMultiplier: 0.8, populationMultiplier: 0.75, resourceMultiplier: 0.95, maximumMoons: 2, buildSlots: 6 },
  { size: 4, label: "Standard", diameterKm: 10_000, gravityMultiplier: 1, populationMultiplier: 1, resourceMultiplier: 1, maximumMoons: 3, buildSlots: 8 },
  { size: 5, label: "Large", diameterKm: 14_000, gravityMultiplier: 1.1, populationMultiplier: 1.25, resourceMultiplier: 1.15, maximumMoons: 4, buildSlots: 10 },
  { size: 6, label: "Super", diameterKm: 19_000, gravityMultiplier: 1.3, populationMultiplier: 1.6, resourceMultiplier: 1.3, maximumMoons: 5, buildSlots: 12 },
  { size: 7, label: "Giant", diameterKm: 32_000, gravityMultiplier: 1.7, populationMultiplier: 2.1, resourceMultiplier: 1.55, maximumMoons: 6, buildSlots: 15 },
  { size: 8, label: "Colossal", diameterKm: 75_000, gravityMultiplier: 2.4, populationMultiplier: 2.8, resourceMultiplier: 1.9, maximumMoons: 8, buildSlots: 18 },
  { size: 9, label: "Megaworld", diameterKm: 150_000, gravityMultiplier: 3.2, populationMultiplier: 4, resourceMultiplier: 2.4, maximumMoons: 12, buildSlots: 24 },
] as const;

const CLASS_SEEDS: readonly Omit<WorldArchetype, "id" | "environment" | "modifiers">[] = [
  { classCode: "A", className: "Aurelia", subclass: "Terrestrial", type: "Temperate", subtype: "Continental", name: "Aurelia Prime", biome: "temperate forest", subBiome: "river delta", rarity: "common", preferredMoonArchetypes: ["M01", "M02"], specialSystems: ["biosphere", "orbital_lift"], lore: "Balanced continental worlds that support the fastest reliable empire starts." },
  { classCode: "B", className: "Pelagia", subclass: "Oceanic", type: "Hydrosphere", subtype: "Deep Ocean", name: "Pelagia Reach", biome: "global ocean", subBiome: "abyssal trench", rarity: "uncommon", preferredMoonArchetypes: ["M02", "M05"], specialSystems: ["tidal_power", "floating_habitats"], lore: "Water-rich worlds with enormous food and life-support potential." },
  { classCode: "C", className: "Viridia", subclass: "Tropical", type: "Jungle", subtype: "Rainforest", name: "Viridia Canopy", biome: "tropical jungle", subBiome: "cloud forest", rarity: "uncommon", preferredMoonArchetypes: ["M01", "M06"], specialSystems: ["biolab", "gene_reserve"], lore: "Dense living worlds where biological science and population growth flourish." },
  { classCode: "D", className: "Duneshard", subclass: "Arid", type: "Desert", subtype: "Erg Basin", name: "Duneshard Expanse", biome: "desert", subBiome: "glass-sand erg", rarity: "common", preferredMoonArchetypes: ["M03", "M04"], specialSystems: ["solar_fields", "deep_wells"], lore: "Dry mineral frontiers with clear skies and efficient solar collection." },
  { classCode: "E", className: "Cryostead", subclass: "Arctic", type: "Frozen", subtype: "Glacial", name: "Cryostead", biome: "ice sheet", subBiome: "subglacial ocean", rarity: "uncommon", preferredMoonArchetypes: ["M02", "M05"], specialSystems: ["ice_mining", "cryolab"], lore: "Frozen vaults of water and crystal guarded by extreme cold." },
  { classCode: "F", className: "Tundralis", subclass: "Tundra", type: "Cold", subtype: "Permafrost", name: "Tundralis March", biome: "tundra", subBiome: "permafrost basin", rarity: "common", preferredMoonArchetypes: ["M01", "M04"], specialSystems: ["thermal_storage", "hardy_agriculture"], lore: "Resilient frontier worlds that reward careful infrastructure planning." },
  { classCode: "G", className: "Pyraxis", subclass: "Volcanic", type: "Geothermal", subtype: "Shield Volcano", name: "Pyraxis Forge", biome: "volcanic", subBiome: "magma caldera", rarity: "rare", preferredMoonArchetypes: ["M03", "M07"], specialSystems: ["geothermal_grid", "forgemantle"], lore: "Violent geologies that turn planetary heat into industry and weapons." },
  { classCode: "H", className: "Hallowrock", subclass: "Barren", type: "Rocky", subtype: "Craterland", name: "Hallowrock", biome: "barren rock", subBiome: "impact highlands", rarity: "common", preferredMoonArchetypes: ["M03", "M04"], specialSystems: ["automated_mines", "subsurface_shelters"], lore: "Sparse worlds whose silence hides dependable mineral deposits." },
  { classCode: "I", className: "Ironveil", subclass: "Metallic", type: "Heavy Metal", subtype: "Core Exposed", name: "Ironveil", biome: "metallic plain", subBiome: "magnetic scar", rarity: "rare", preferredMoonArchetypes: ["M03", "M08"], specialSystems: ["alloy_foundry", "magnetic_launch"], lore: "Core-rich planets that accelerate armor and ship construction." },
  { classCode: "J", className: "Gemora", subclass: "Crystalline", type: "Crystal", subtype: "Prismatic", name: "Gemora Array", biome: "crystal desert", subBiome: "prism caverns", rarity: "rare", preferredMoonArchetypes: ["M04", "M09"], specialSystems: ["crystal_lattice", "beam_research"], lore: "Prismatic formations amplify energy weapons and research networks." },
  { classCode: "K", className: "Kharon", subclass: "Toxic", type: "Chemically Hostile", subtype: "Acid Cloud", name: "Kharon Veil", biome: "toxic marsh", subBiome: "acid rain basin", rarity: "uncommon", preferredMoonArchetypes: ["M04", "M07"], specialSystems: ["chemical_refinery", "hazard_training"], lore: "Hostile chemistry becomes a resource when containment is mastered." },
  { classCode: "L", className: "Luminar", subclass: "Radiant", type: "High Energy", subtype: "Aurora Belt", name: "Luminar Crown", biome: "radiant plateau", subBiome: "aurora belt", rarity: "rare", preferredMoonArchetypes: ["M06", "M10"], specialSystems: ["aurora_collectors", "shield_calibration"], lore: "Radiant worlds feed powerful grids but punish unshielded populations." },
  { classCode: "M", className: "Mirefall", subclass: "Swamp", type: "Wetland", subtype: "Mangrove", name: "Mirefall", biome: "organic swamp", subBiome: "mangrove labyrinth", rarity: "uncommon", preferredMoonArchetypes: ["M01", "M06"], specialSystems: ["biofuel", "wetland_ecology"], lore: "Wetland labyrinths hide fertile soil, rare compounds, and covert routes." },
  { classCode: "N", className: "Nexflora", subclass: "Mycelial", type: "Spore", subtype: "Mycelial Forest", name: "Nexflora", biome: "mycelial forest", subBiome: "spore cathedral", rarity: "rare", preferredMoonArchetypes: ["M06", "M11"], specialSystems: ["spore_drive", "symbiotic_network"], lore: "Living fungal networks connect settlements and alter travel itself." },
  { classCode: "O", className: "Orchardis", subclass: "Agricultural", type: "Garden", subtype: "Seed Vault", name: "Orchardis", biome: "agricultural meadow", subBiome: "seed vault valley", rarity: "common", preferredMoonArchetypes: ["M01", "M02"], specialSystems: ["seed_vault", "food_export"], lore: "Food-focused worlds form the dependable economic heart of long wars." },
  { classCode: "P", className: "Paxion", subclass: "Gaian", type: "Super-Habitable", subtype: "Balanced Biosphere", name: "Paxion Garden", biome: "gaian biosphere", subBiome: "continental shelf", rarity: "epic", preferredMoonArchetypes: ["M01", "M05", "M06"], specialSystems: ["population_hub", "diplomatic_capital"], lore: "Rarely balanced biospheres support dense populations and diplomatic capitals." },
  { classCode: "Q", className: "Quasarion", subclass: "Gas Giant", type: "Hydrogenic", subtype: "Storm Bands", name: "Quasarion", biome: "gas cloud", subBiome: "storm bands", rarity: "uncommon", preferredMoonArchetypes: ["M02", "M04", "M07"], specialSystems: ["gas_siphons", "storm_harvesters"], lore: "Deep atmospheres provide gas, energy, and a nursery for moon systems." },
  { classCode: "R", className: "Ravager", subclass: "Jovian", type: "Radiation Giant", subtype: "Magnetosphere", name: "Ravager", biome: "jovian cloud", subBiome: "radiation belts", rarity: "rare", preferredMoonArchetypes: ["M03", "M07", "M10"], specialSystems: ["magnetosphere_taps", "radiation_lab"], lore: "Dangerous giants hide strategic moons behind fierce radiation belts." },
  { classCode: "S", className: "Selenic", subclass: "Ice Giant", type: "Cryogenic", subtype: "Diamond Rain", name: "Selenic", biome: "ice giant", subBiome: "diamond rain mantle", rarity: "rare", preferredMoonArchetypes: ["M02", "M09"], specialSystems: ["diamond_extraction", "cryogenic_fuel"], lore: "Ice giants produce exotic materials and high-grade cryogenic fuels." },
  { classCode: "T", className: "Tessera", subclass: "Carbon", type: "Carbon World", subtype: "Graphite Shelf", name: "Tessera", biome: "carbon plain", subBiome: "graphite shelf", rarity: "rare", preferredMoonArchetypes: ["M03", "M08"], specialSystems: ["carbon_fabrication", "nanotube_yard"], lore: "Carbon-rich crusts support lightweight hulls and precision fabrication." },
  { classCode: "U", className: "Umbracore", subclass: "Super-Earth", type: "High Mass", subtype: "Dense Continental", name: "Umbracore", biome: "dense continent", subBiome: "basalt shelf", rarity: "uncommon", preferredMoonArchetypes: ["M03", "M05"], specialSystems: ["deep_mantle_mining", "gravity_foundry"], lore: "High-mass worlds trade difficult logistics for durable infrastructure." },
  { classCode: "V", className: "Vesper", subclass: "High Gravity", type: "Compression", subtype: "Pressure Basin", name: "Vesper", biome: "pressure basin", subBiome: "gravity canyon", rarity: "rare", preferredMoonArchetypes: ["M04", "M08"], specialSystems: ["gravity_assist", "pressure_industry"], lore: "Heavy gravity strengthens defenses and trains exceptional ground forces." },
  { classCode: "W", className: "Wanderer", subclass: "Rogue", type: "Nomad", subtype: "Free-Floating", name: "Wanderer", biome: "rogue ice", subBiome: "subsurface refuge", rarity: "epic", preferredMoonArchetypes: ["M02", "M11"], specialSystems: ["dark_orbit", "mobile_colony"], lore: "Rogue worlds cannot rely on starlight and therefore master mobility." },
  { classCode: "X", className: "Xylophane", subclass: "Ringed", type: "Ring World", subtype: "Debris Halo", name: "Xylophane", biome: "ringed world", subBiome: "debris halo", rarity: "uncommon", preferredMoonArchetypes: ["M03", "M05", "M09"], specialSystems: ["ring_mining", "orbital_docks"], lore: "Ring systems provide abundant construction material and defensive cover." },
  { classCode: "Y", className: "Ydrassil", subclass: "World-Tree", type: "Super-Biome", subtype: "Canopy Continents", name: "Ydrassil", biome: "canopy continent", subBiome: "skywood basin", rarity: "epic", preferredMoonArchetypes: ["M01", "M06", "M11"], specialSystems: ["canopy_cities", "living_starport"], lore: "Gigantic biospheres turn ecology into architecture and logistics." },
  { classCode: "Z", className: "Zenith", subclass: "Megaworld", type: "Ultra-Habitable", subtype: "Multi-Biosphere", name: "Zenith", biome: "multi-biome supercontinent", subBiome: "climate arcology", rarity: "legendary", preferredMoonArchetypes: ["M01", "M02", "M05", "M06"], specialSystems: ["planetary_council", "mega_arcology"], lore: "Zenith worlds can host the population and industry of an entire region." },
  { classCode: "AA", className: "Arcadia", subclass: "Arcology", type: "Artificial", subtype: "City Planet", name: "Arcadia Prime", biome: "arcology surface", subBiome: "vertical megacity", rarity: "epic", preferredMoonArchetypes: ["M08", "M10"], specialSystems: ["arcology_grid", "civic_ai"], lore: "Artificial continents convert every square kilometer into managed capacity." },
  { classCode: "AB", className: "Automata", subclass: "Machine", type: "Synthetic", subtype: "Factory World", name: "Automata", biome: "machine lattice", subBiome: "assembly continent", rarity: "epic", preferredMoonArchetypes: ["M08", "M12"], specialSystems: ["autofactory", "drone_mind"], lore: "Machine worlds scale production through self-repairing industrial intelligence." },
  { classCode: "AC", className: "Acheron", subclass: "Necrotic", type: "Dead World", subtype: "Ash Biosphere", name: "Acheron", biome: "ash wasteland", subBiome: "necrotic basin", rarity: "rare", preferredMoonArchetypes: ["M04", "M07"], specialSystems: ["death_resilience", "relic_dig"], lore: "Acheron worlds preserve dangerous relics beneath a dead biosphere." },
  { classCode: "AD", className: "Aetheris", subclass: "Dimensional", type: "Phase World", subtype: "Rift Surface", name: "Aetheris", biome: "phase terrain", subBiome: "dimensional rift", rarity: "mythic", preferredMoonArchetypes: ["M10", "M11", "M12"], specialSystems: ["rift_gate", "phase_storage"], lore: "Phase-shifted terrain opens strategic shortcuts at the cost of instability." },
  { classCode: "AE", className: "Echora", subclass: "Quantum", type: "Probability", subtype: "Forked Reality", name: "Echora", biome: "quantum plain", subBiome: "probability fold", rarity: "mythic", preferredMoonArchetypes: ["M09", "M10", "M12"], specialSystems: ["quantum_compute", "probability_lab"], lore: "Quantum worlds produce multiple possible futures for commanders to exploit." },
  { classCode: "AF", className: "Astralith", subclass: "Starforged", type: "Stellar", subtype: "Living Crust", name: "Astralith", biome: "stellar crust", subBiome: "coronal shelf", rarity: "mythic", preferredMoonArchetypes: ["M07", "M10"], specialSystems: ["stellar_forge", "coronal_shields"], lore: "Starforged crusts transform stellar energy directly into strategic power." },
  { classCode: "AG", className: "Gloam", subclass: "Void", type: "Dark Matter", subtype: "Shadow Basin", name: "Gloam", biome: "void surface", subBiome: "shadow basin", rarity: "legendary", preferredMoonArchetypes: ["M04", "M11", "M12"], specialSystems: ["dark_matter_well", "stealth_orbit"], lore: "Gloam worlds hide fleets and facilities from conventional detection." },
  { classCode: "AH", className: "Heliarch", subclass: "Solar", type: "Stellar Orbit", subtype: "Corona Habitat", name: "Heliarch", biome: "corona habitat", subBiome: "flare shield", rarity: "legendary", preferredMoonArchetypes: ["M07", "M10"], specialSystems: ["flare_sails", "solar_mirror"], lore: "Heliarch settlements ride close to stars to harvest overwhelming energy." },
  { classCode: "AI", className: "Ionstrand", subclass: "Plasma", type: "Magnetized", subtype: "Ion Sea", name: "Ionstrand", biome: "plasma sea", subBiome: "ion storm", rarity: "legendary", preferredMoonArchetypes: ["M07", "M10", "M12"], specialSystems: ["ion_accelerator", "plasma_shields"], lore: "Ion seas provide unmatched propulsion research and volatile defense systems." },
  { classCode: "AJ", className: "Junction", subclass: "Transit", type: "Gate World", subtype: "Wormhole Nexus", name: "Junction", biome: "transit nexus", subBiome: "gate confluence", rarity: "legendary", preferredMoonArchetypes: ["M08", "M10", "M12"], specialSystems: ["wormhole_anchor", "transit_market"], lore: "Junctions sit at routes that make logistics and diplomacy exponentially faster." },
  { classCode: "AK", className: "Kaleid", subclass: "Mirror", type: "Reflective", subtype: "Light Shell", name: "Kaleid", biome: "mirror shell", subBiome: "spectral basin", rarity: "mythic", preferredMoonArchetypes: ["M09", "M10"], specialSystems: ["beam_reflector", "mirror_defense"], lore: "Reflective shells redirect energy and confuse hostile targeting systems." },
  { classCode: "AL", className: "Leviathan", subclass: "Shellworld", type: "Constructed", subtype: "Nested Habitat", name: "Leviathan", biome: "shellworld", subBiome: "nested habitat", rarity: "mythic", preferredMoonArchetypes: ["M08", "M11", "M12"], specialSystems: ["nested_orbits", "shell_reactor"], lore: "Shellworlds create layers of habitable space and deep strategic reserves." },
  { classCode: "AM", className: "Mnemosyne", subclass: "Archive", type: "Memory World", subtype: "Ancient Library", name: "Mnemosyne", biome: "archive surface", subBiome: "memory vault", rarity: "mythic", preferredMoonArchetypes: ["M09", "M11"], specialSystems: ["precursor_archive", "memory_engine"], lore: "Archive worlds store technologies and histories that reshape research progression." },
  { classCode: "AN", className: "Nadir", subclass: "Gravitic", type: "Singularity", subtype: "Event Horizon", name: "Nadir", biome: "singularity shelf", subBiome: "event horizon", rarity: "mythic", preferredMoonArchetypes: ["M10", "M12"], specialSystems: ["gravity_well", "time_dilation"], lore: "Nadir worlds bend time and gravity around a tightly controlled horizon." },
  { classCode: "AO", className: "Ophion", subclass: "Relic", type: "Precursor", subtype: "Ruined World", name: "Ophion", biome: "precursor ruins", subBiome: "relic megastructure", rarity: "legendary", preferredMoonArchetypes: ["M08", "M09", "M11"], specialSystems: ["relic_salvage", "ancient_defense"], lore: "Relic worlds offer immense rewards to empires willing to restore their systems." },
  { classCode: "AP", className: "Paragon", subclass: "Ascendant", type: "Transcendent", subtype: "Crown World", name: "Paragon", biome: "ascendant garden", subBiome: "crown nexus", rarity: "mythic", preferredMoonArchetypes: ["M09", "M10", "M11", "M12"], specialSystems: ["ascension_gate", "crown_network"], lore: "Paragon worlds are late-game capitals where every subsystem reaches its highest expression." },
];

export const WORLD_CLASS_COUNT = CLASS_SEEDS.length;
export const WORLD_CLASS_CODES = CLASS_SEEDS.map((entry) => entry.classCode) as readonly string[];

const MOON_SEEDS: readonly MoonArchetype[] = [
  { id: "M01", name: "Verdant Moon", moonClass: "Terrestrial", subclass: "Life Moon", type: "Garden", subtype: "Forest Basin", biome: "forest", subBiome: "river valley", atmosphere: "nitrogen-oxygen", rarity: "common", resourceFocus: "food", facilityHooks: ["hydroponics", "biosphere_dome"], modifiers: { naquadahProduction: 0.05, metalProduction: 0, crystalProduction: 0.05, foodProduction: 0.25, waterProduction: 0.15, energyProduction: 0.05, researchSpeed: 0.1, shipyardSpeed: 0, defenseStrength: 0.05, covertStrength: 0.1 } },
  { id: "M02", name: "Glacier Moon", moonClass: "Icy", subclass: "Cryogenic", type: "Ice", subtype: "Subsurface Ocean", biome: "ice fields", subBiome: "blue fissure", atmosphere: "trace gases", rarity: "common", resourceFocus: "water", facilityHooks: ["ice_drills", "deuterium_plant"], modifiers: { naquadahProduction: 0, metalProduction: 0.05, crystalProduction: 0.15, foodProduction: 0.05, waterProduction: 0.3, energyProduction: 0.05, researchSpeed: 0.15, shipyardSpeed: 0, defenseStrength: 0.08, covertStrength: 0.05 } },
  { id: "M03", name: "Iron Moon", moonClass: "Metallic", subclass: "Mining", type: "Metal", subtype: "Core Fragment", biome: "metallic craters", subBiome: "ore ridge", atmosphere: "none", rarity: "uncommon", resourceFocus: "metal", facilityHooks: ["ore_smelter", "orbital_forge"], modifiers: { naquadahProduction: 0.05, metalProduction: 0.35, crystalProduction: 0.1, foodProduction: 0, waterProduction: 0, energyProduction: 0.05, researchSpeed: 0, shipyardSpeed: 0.2, defenseStrength: 0.15, covertStrength: 0 } },
  { id: "M04", name: "Cinder Moon", moonClass: "Volcanic", subclass: "Geothermal", type: "Volcanic", subtype: "Lava Tube", biome: "lava tubes", subBiome: "magma vent", atmosphere: "sulfur trace", rarity: "uncommon", resourceFocus: "energy", facilityHooks: ["geothermal_tap", "thermal_foundry"], modifiers: { naquadahProduction: 0.1, metalProduction: 0.2, crystalProduction: 0.05, foodProduction: 0, waterProduction: 0, energyProduction: 0.35, researchSpeed: 0, shipyardSpeed: 0.05, defenseStrength: 0.2, covertStrength: 0 } },
  { id: "M05", name: "Tidal Moon", moonClass: "Oceanic", subclass: "Hydrospheric", type: "Water", subtype: "Tidal Ocean", biome: "global sea", subBiome: "tidal shelf", atmosphere: "oxygen-rich", rarity: "rare", resourceFocus: "water", facilityHooks: ["tidal_generators", "ocean_farms"], modifiers: { naquadahProduction: 0.05, metalProduction: 0, crystalProduction: 0.1, foodProduction: 0.15, waterProduction: 0.4, energyProduction: 0.25, researchSpeed: 0.1, shipyardSpeed: 0, defenseStrength: 0.05, covertStrength: 0.05 } },
  { id: "M06", name: "Mycelial Moon", moonClass: "Organic", subclass: "Spore", type: "Living", subtype: "Fungal Network", biome: "mycelial forest", subBiome: "spore grove", atmosphere: "nitrogen-rich", rarity: "rare", resourceFocus: "research", facilityHooks: ["spore_drive", "bio_archive"], modifiers: { naquadahProduction: 0.05, metalProduction: 0, crystalProduction: 0.05, foodProduction: 0.2, waterProduction: 0.1, energyProduction: 0, researchSpeed: 0.35, shipyardSpeed: 0, defenseStrength: 0, covertStrength: 0.25 } },
  { id: "M07", name: "Forge Moon", moonClass: "Industrial", subclass: "Foundry", type: "Metallic", subtype: "Forge Crust", biome: "industrial basalt", subBiome: "forge canyon", atmosphere: "thin", rarity: "rare", resourceFocus: "shipbuilding", facilityHooks: ["shipyard_ring", "armor_forge"], modifiers: { naquadahProduction: 0.15, metalProduction: 0.25, crystalProduction: 0.05, foodProduction: 0, waterProduction: 0, energyProduction: 0.2, researchSpeed: 0.05, shipyardSpeed: 0.35, defenseStrength: 0.25, covertStrength: 0 } },
  { id: "M08", name: "Citadel Moon", moonClass: "Fortress", subclass: "Military", type: "Bastion", subtype: "Shield Citadel", biome: "fortified highlands", subBiome: "shield trench", atmosphere: "artificial", rarity: "epic", resourceFocus: "defense", facilityHooks: ["moon_fortress", "sensor_array"], modifiers: { naquadahProduction: 0.05, metalProduction: 0.1, crystalProduction: 0.05, foodProduction: 0, waterProduction: 0, energyProduction: 0.1, researchSpeed: 0.1, shipyardSpeed: 0.1, defenseStrength: 0.6, covertStrength: 0.15 } },
  { id: "M09", name: "Prism Moon", moonClass: "Crystalline", subclass: "Research", type: "Crystal", subtype: "Quantum Cavern", biome: "crystal caverns", subBiome: "prismatic fault", atmosphere: "trace gases", rarity: "epic", resourceFocus: "crystal", facilityHooks: ["quantum_lab", "beam_lattice"], modifiers: { naquadahProduction: 0.1, metalProduction: 0.05, crystalProduction: 0.5, foodProduction: 0, waterProduction: 0, energyProduction: 0.15, researchSpeed: 0.45, shipyardSpeed: 0, defenseStrength: 0.1, covertStrength: 0.1 } },
  { id: "M10", name: "Aurora Moon", moonClass: "Radiant", subclass: "Energy", type: "Plasma", subtype: "Aurora Belt", biome: "radiant ice", subBiome: "aurora basin", atmosphere: "ionized", rarity: "epic", resourceFocus: "energy", facilityHooks: ["aurora_collector", "jump_beacon"], modifiers: { naquadahProduction: 0.2, metalProduction: 0, crystalProduction: 0.1, foodProduction: 0, waterProduction: 0.05, energyProduction: 0.55, researchSpeed: 0.2, shipyardSpeed: 0.05, defenseStrength: 0.2, covertStrength: 0.2 } },
  { id: "M11", name: "Void Moon", moonClass: "Dimensional", subclass: "Anomaly", type: "Void", subtype: "Rift Core", biome: "dimensional rifts", subBiome: "null crater", atmosphere: "none", rarity: "legendary", resourceFocus: "covert", facilityHooks: ["rift_anchor", "cloaking_array"], modifiers: { naquadahProduction: 0.25, metalProduction: 0, crystalProduction: 0.15, foodProduction: 0, waterProduction: 0, energyProduction: 0.1, researchSpeed: 0.35, shipyardSpeed: 0, defenseStrength: 0.15, covertStrength: 0.65 } },
  { id: "M12", name: "Relic Moon", moonClass: "Precursor", subclass: "Ancient", type: "Relic", subtype: "Archive Engine", biome: "precursor ruins", subBiome: "archive vault", atmosphere: "artificial", rarity: "mythic", resourceFocus: "ancient technology", facilityHooks: ["precursor_archive", "ascension_relay"], modifiers: { naquadahProduction: 0.3, metalProduction: 0.2, crystalProduction: 0.2, foodProduction: 0, waterProduction: 0, energyProduction: 0.25, researchSpeed: 0.6, shipyardSpeed: 0.25, defenseStrength: 0.3, covertStrength: 0.3 } },
];

export const MOON_ARCHETYPES: readonly MoonArchetype[] = MOON_SEEDS;

const SIZE_BY_WORLD_SIZE = (size: WorldSize) => WORLD_SIZE_PROFILES[size - 1];
const CLASS_INDEX = new Map(CLASS_SEEDS.map((seed, index) => [seed.classCode, index]));

export function getWorldSizeProfile(size: number): WorldSizeProfile {
  const normalized = Math.max(1, Math.min(9, Math.floor(Number(size) || 4))) as WorldSize;
  return SIZE_BY_WORLD_SIZE(normalized);
}

export function stableWorldId(classCode: string, size: number, instanceNumber = 1) {
  const safeClass = classCode.trim().toUpperCase().replace(/[^A-Z0-9]/g, "") || "A";
  const safeSize = getWorldSizeProfile(size).size;
  const safeInstance = Math.max(1, Math.floor(Number(instanceNumber) || 1));
  return `WRL-${safeClass}-${safeSize}-${safeInstance.toString().padStart(3, "0")}`;
}

export function stableMoonId(parentWorldId: string, orbitSlot: number) {
  return `MON-${parentWorldId.replace(/[^A-Z0-9-]/gi, "")}-${Math.max(1, Math.floor(Number(orbitSlot) || 1)).toString().padStart(2, "0")}`;
}

function buildEnvironment(index: number, size: WorldSize, seed: typeof CLASS_SEEDS[number]): WorldEnvironment {
  const sizeProfile = getWorldSizeProfile(size);
  const temperature = seed.type.includes("Frozen") || seed.biome.includes("ice") ? -80 : seed.type.includes("Volcanic") || seed.type.includes("Stellar") ? 180 : seed.type.includes("Arid") ? 45 : 22;
  const radiation = seed.type.includes("Radiant") || seed.type.includes("Stellar") || seed.type.includes("Plasma") ? 55 : seed.classCode.length > 1 ? 35 : 12;
  const water = seed.biome.includes("ocean") || seed.biome.includes("hydro") ? 90 : seed.biome.includes("ice") ? 75 : seed.biome.includes("swamp") || seed.biome.includes("jungle") ? 65 : seed.biome.includes("desert") || seed.biome.includes("rock") ? 8 : 45;
  const habitability = Math.max(5, Math.min(98, seed.rarity === "mythic" ? 72 : seed.rarity === "legendary" ? 65 : seed.classCode === "P" || seed.classCode === "Z" ? 92 : 48 + (index % 5) * 7));
  return { temperatureC: { min: temperature - 35, max: temperature + 35, average: temperature }, atmosphericPressureKpa: Math.max(0.1, Math.round((seed.type.includes("Gas") ? 800 : seed.type.includes("Artificial") ? 95 : 60 + (index % 6) * 8) * 10) / 10), waterPercent: water, radiationPercent: radiation, gravity: Number((sizeProfile.gravityMultiplier * (0.85 + (index % 4) * 0.08)).toFixed(2)), habitability, stormActivity: Math.min(100, 15 + (index * 7) % 80), tectonicActivity: Math.min(100, 10 + (index * 11) % 85), magneticField: Math.min(100, 35 + (index * 9) % 65) };
}

function buildModifiers(index: number, size: WorldSize, seed: typeof CLASS_SEEDS[number]): WorldGameplayModifiers {
  const sizeProfile = getWorldSizeProfile(size);
  const hostile = seed.rarity === "rare" || seed.rarity === "epic" || seed.rarity === "legendary" || seed.rarity === "mythic";
  const mining = seed.subclass.includes("Metal") || seed.type.includes("Crystal") || seed.type.includes("Metal") || seed.specialSystems.some((system) => system.includes("mine") || system.includes("forge"));
  const science = seed.subclass.includes("Quantum") || seed.subclass.includes("Archive") || seed.type.includes("Precursor") || seed.specialSystems.some((system) => system.includes("research") || system.includes("archive"));
  const food = seed.subclass.includes("Agricultural") || seed.subclass.includes("Gaian") || seed.type.includes("Jungle") || seed.type.includes("Garden");
  const energy = seed.type.includes("Radiant") || seed.type.includes("Stellar") || seed.type.includes("Plasma") || seed.type.includes("Volcanic");
  return { naquadahProduction: Number((0.9 + (index % 8) * 0.12 + (hostile ? 0.1 : 0)).toFixed(2)), metalProduction: Number((mining ? 1.45 : 0.9 + (index % 4) * 0.08).toFixed(2)), crystalProduction: Number((seed.type.includes("Crystal") || seed.subclass.includes("Quantum") ? 1.5 : 0.85 + (index % 3) * 0.12).toFixed(2)), foodProduction: Number((food ? 1.65 : 0.7 + (index % 5) * 0.1).toFixed(2)), waterProduction: Number((seed.biome.includes("ocean") || seed.biome.includes("ice") ? 1.6 : 0.8 + (index % 4) * 0.1).toFixed(2)), energyProduction: Number((energy ? 1.55 : 0.85 + (index % 5) * 0.1).toFixed(2)), researchSpeed: Number((science ? 1.55 : 0.9 + (index % 4) * 0.08).toFixed(2)), shipyardSpeed: Number((mining || seed.subclass.includes("Industrial") ? 1.3 : 0.9 + (index % 3) * 0.08).toFixed(2)), defenseStrength: Number((1 + sizeProfile.gravityMultiplier * 0.08 + (seed.subclass.includes("Military") || seed.subclass.includes("Fortress") ? 0.5 : 0)).toFixed(2)), covertStrength: Number((seed.subclass.includes("Dimensional") || seed.subclass.includes("Void") ? 1.6 : 0.9 + (index % 4) * 0.1).toFixed(2)), populationGrowth: Number((food ? 1.35 : 0.75 + (index % 4) * 0.08).toFixed(2)), explorationRisk: Number(Math.max(0.25, 1 - (seed.rarity === "common" ? 0 : index % 3 * 0.08)).toFixed(2)), colonizationCost: Number((1 + sizeProfile.gravityMultiplier * 0.2 + (hostile ? 0.15 : 0)).toFixed(2)), storageMultiplier: Number((sizeProfile.resourceMultiplier * (1 + (index % 3) * 0.1)).toFixed(2)) };
}

export function resolveWorldArchetype(classCode: string, size: number): WorldArchetype {
  const normalized = classCode.trim().toUpperCase();
  const index = CLASS_INDEX.get(normalized) ?? 0;
  const seed = CLASS_SEEDS[index];
  const worldSize = getWorldSizeProfile(size).size;
  return { ...seed, id: `WCA-${seed.classCode}-${worldSize}`, environment: buildEnvironment(index, worldSize, seed), modifiers: buildModifiers(index, worldSize, seed) };
}

export function getWorldCatalog() {
  return { classes: CLASS_SEEDS.map((seed, index) => ({ ...resolveWorldArchetype(seed.classCode, 4), classIndex: index + 1, supportedSizes: WORLD_SIZE_PROFILES.map((profile) => profile.size) })), sizes: WORLD_SIZE_PROFILES, moons: MOON_ARCHETYPES, totalClasses: WORLD_CLASS_COUNT };
}

export function generateMoonProfile(parentWorldId: string, parent: WorldArchetype, size: WorldSize, orbitSlot: number, createdAt = Date.now()): GeneratedMoonProfile {
  const archetypeId = parent.preferredMoonArchetypes[(orbitSlot - 1) % parent.preferredMoonArchetypes.length] || "M01";
  const moon = MOON_ARCHETYPES.find((entry) => entry.id === archetypeId) || MOON_ARCHETYPES[0];
  const moonSize = Math.max(1, Math.min(9, Math.floor((size + orbitSlot) / 2))) as WorldSize;
  const sizeProfile = getWorldSizeProfile(moonSize);
  return { id: stableMoonId(parentWorldId, orbitSlot), name: `${moon.name} ${orbitSlot}`, parentWorldId, archetypeId: moon.id, moonClass: moon.moonClass, subclass: moon.subclass, type: moon.type, subtype: moon.subtype, biome: moon.biome, subBiome: moon.subBiome, atmosphere: moon.atmosphere, size: moonSize, orbitSlot, condition: 100, developmentLevel: 1, habitability: Math.max(1, Math.min(100, parent.environment.habitability + (moon.id === "M01" || moon.id === "M05" ? 12 : -10))), gravity: Number((sizeProfile.gravityMultiplier * 0.35).toFixed(2)), resourceDensity: Number((sizeProfile.resourceMultiplier * 0.8 + moon.modifiers.naquadahProduction).toFixed(2)), defenseRating: Math.floor(50 * moon.modifiers.defenseStrength), researchRating: Math.floor(50 * moon.modifiers.researchSpeed), productionMultiplier: Number((1 + moon.modifiers.naquadahProduction * 0.2 + moon.modifiers.energyProduction * 0.15).toFixed(2)), specialSystems: moon.facilityHooks, createdAt };
}

export function generateMoonsForWorld(parentWorldId: string, classCode: string, size: WorldSize, createdAt = Date.now()) {
  const parent = resolveWorldArchetype(classCode, size);
  const count = Math.min(getWorldSizeProfile(size).maximumMoons, Math.max(0, 1 + (CLASS_INDEX.get(parent.classCode) || 0) % 3));
  return Array.from({ length: count }, (_, index) => generateMoonProfile(parentWorldId, parent, size, index + 1, createdAt));
}
