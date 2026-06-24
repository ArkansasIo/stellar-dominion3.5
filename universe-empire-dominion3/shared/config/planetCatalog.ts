/**
 * Star Trek-Inspired Planet Classification System
 * 50+ planet types with full classification, properties, and utility functions
 * @tag #planets #classification #universe #star-trek
 */

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export type PlanetClassId =
  | 'M'  // Terrestrial/Habitable
  | 'G'  // Gas giant
  | 'D'  // Desert/Arid
  | 'R'  // Rocky
  | 'V'  // Volcanic
  | 'T'  // Tropical
  | 'A'  // Arctic/Frozen
  | 'K'  // Marginal
  | 'J'  // Jovian
  | 'I'  // Ice giant
  | 'H'  // Hostile
  | 'N'; // Toxic

export type PlanetCategory =
  | 'habitable'
  | 'marginal'
  | 'hostile'
  | 'gas'
  | 'barren'
  | 'special';

export type PlanetSubcategory =
  | 'agricultural'
  | 'mineral-rich'
  | 'energy-rich'
  | 'crystal-rich'
  | 'strategic'
  | 'precursor';

export type PlanetSizeClassId = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'G' | 'SG';

export type AtmosphereType =
  | 'none'
  | 'trace'
  | 'thin-nitrogen'
  | 'standard-nitrogen-oxygen'
  | 'dense-nitrogen-oxygen'
  | 'thick-co2'
  | 'toxic-sulfur'
  | 'corrosive'
  | 'methane-heavy'
  | 'hydrogen-helium'
  | 'hydrogen-helium-methane'
  | 'exotic'
  | 'artificial';

export interface PlanetSizeClass {
  readonly id: PlanetSizeClassId;
  readonly name: string;
  readonly minDiameter: number;
  readonly maxDiameter: number;
  readonly description: string;
}

export interface PlanetClassification {
  readonly classId: PlanetClassId;
  readonly className: string;
  readonly subclassRange: string;
  readonly category: PlanetCategory;
  readonly subcategory: PlanetSubcategory;
  readonly description: string;
  readonly diameterRange: { readonly min: number; readonly max: number };
  readonly massRange: { readonly min: number; readonly max: number };
  readonly gravityRange: { readonly min: number; readonly max: number };
  readonly atmosphereType: AtmosphereType;
  readonly temperatureRange: { readonly min: number; readonly max: number };
  readonly waterPercent: { readonly min: number; readonly max: number };
  readonly habitabilityRating: { readonly min: number; readonly max: number };
  readonly resourceSlots: number;
  readonly maxMoons: number;
  readonly specialFeatures: readonly string[];
  readonly atmosphereComposition: Readonly<Record<string, number>>;
  readonly surfacePressure: { readonly min: number; readonly max: number };
}

export interface PlanetCatalogEntry {
  readonly id: string;
  readonly name: string;
  readonly classId: PlanetClassId;
  readonly subclassId: string;
  readonly subclassCode: string;
  readonly category: PlanetCategory;
  readonly subcategory: PlanetSubcategory;
  readonly description: string;
  readonly diameter: number;
  readonly mass: number;
  readonly gravity: number;
  readonly atmosphereType: AtmosphereType;
  readonly atmosphereComposition: Readonly<Record<string, number>>;
  readonly surfacePressure: number;
  readonly temperature: number;
  readonly temperatureMin: number;
  readonly temperatureMax: number;
  readonly waterPercent: number;
  readonly habitabilityRating: number;
  readonly resourceSlots: number;
  readonly maxMoons: number;
  readonly specialFeatures: readonly string[];
  readonly rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

// ============================================================================
// PLANET SIZE CLASSIFICATIONS
// ============================================================================

export const PLANET_SIZE_CLASSES: readonly PlanetSizeClass[] = [
  { id: 'XS', name: 'Extra-Small', minDiameter: 200, maxDiameter: 2000, description: 'Dwarf planet or large asteroid' },
  { id: 'S', name: 'Small', minDiameter: 2000, maxDiameter: 6000, description: 'Mercury to Mars sized' },
  { id: 'M', name: 'Medium', minDiameter: 6000, maxDiameter: 14000, description: 'Earth to super-Earth range' },
  { id: 'L', name: 'Large', minDiameter: 14000, maxDiameter: 50000, description: 'Super-Earth to Neptune range' },
  { id: 'XL', name: 'Extra-Large', minDiameter: 50000, maxDiameter: 120000, description: 'Saturn-sized' },
  { id: 'G', name: 'Giant', minDiameter: 120000, maxDiameter: 200000, description: 'Jupiter-sized' },
  { id: 'SG', name: 'Super-Giant', minDiameter: 200000, maxDiameter: 500000, description: 'Brown dwarf or super-Jupiter' },
] as const;

// ============================================================================
// PLANET CLASSIFICATIONS (12 Primary Classes)
// ============================================================================

export const PLANET_CLASSIFICATIONS: readonly PlanetClassification[] = [
  // ========== Class M - Terrestrial/Habitable ==========
  {
    classId: 'M',
    className: 'Terrestrial (Habitable)',
    subclassRange: 'M0-M9',
    category: 'habitable',
    subcategory: 'agricultural',
    description: 'Earth-like worlds with nitrogen-oxygen atmospheres, liquid water, and complex ecosystems',
    diameterRange: { min: 8000, max: 16000 },
    massRange: { min: 0.4, max: 3.0 },
    gravityRange: { min: 0.7, max: 1.5 },
    atmosphereType: 'standard-nitrogen-oxygen',
    temperatureRange: { min: -20, max: 45 },
    waterPercent: { min: 30, max: 85 },
    habitabilityRating: { min: 60, max: 100 },
    resourceSlots: 5,
    maxMoons: 4,
    specialFeatures: ['complex_ecosystem', 'stable_magnetic_field', 'liquid_water', 'ozone_layer', 'plate_tectonics'],
    atmosphereComposition: { nitrogen: 78, oxygen: 21, argon: 0.9, other: 0.1 },
    surfacePressure: { min: 0.8, max: 1.3 },
  },
  // ========== Class G - Gas Giant ==========
  {
    classId: 'G',
    className: 'Gas Giant',
    subclassRange: 'G0-G9',
    category: 'gas',
    subcategory: 'energy-rich',
    description: 'Massive hydrogen-helium dominated worlds with deep atmospheres and ring systems',
    diameterRange: { min: 50000, max: 200000 },
    massRange: { min: 15, max: 1000 },
    gravityRange: { min: 1.0, max: 5.0 },
    atmosphereType: 'hydrogen-helium',
    temperatureRange: { min: -200, max: 200 },
    waterPercent: { min: 0, max: 0 },
    habitabilityRating: { min: 0, max: 5 },
    resourceSlots: 7,
    maxMoons: 15,
    specialFeatures: ['ring_system', 'storm_systems', 'magnetic_field', 'moon_nursery', 'gas_mining'],
    atmosphereComposition: { hydrogen: 89, helium: 10, methane: 0.5, other: 0.5 },
    surfacePressure: { min: 100, max: 10000 },
  },
  // ========== Class D - Desert/Arid ==========
  {
    classId: 'D',
    className: 'Desert (Arid)',
    subclassRange: 'D0-D9',
    category: 'marginal',
    subcategory: 'mineral-rich',
    description: 'Arid worlds with minimal water, extreme temperatures, and rich mineral deposits',
    diameterRange: { min: 5000, max: 14000 },
    massRange: { min: 0.3, max: 1.2 },
    gravityRange: { min: 0.5, max: 1.1 },
    atmosphereType: 'thin-nitrogen',
    temperatureRange: { min: -30, max: 70 },
    waterPercent: { min: 0, max: 10 },
    habitabilityRating: { min: 10, max: 40 },
    resourceSlots: 6,
    maxMoons: 2,
    specialFeatures: ['sand_dunes', 'rare_minerals', 'solar_reserves', 'subsurface_water'],
    atmosphereComposition: { nitrogen: 80, carbonDioxide: 15, argon: 4, other: 1 },
    surfacePressure: { min: 0.2, max: 0.8 },
  },
  // ========== Class R - Rocky ==========
  {
    classId: 'R',
    className: 'Rocky',
    subclassRange: 'R0-R9',
    category: 'barren',
    subcategory: 'mineral-rich',
    description: 'Barren rocky worlds with minimal atmosphere and cratered surfaces',
    diameterRange: { min: 3000, max: 12000 },
    massRange: { min: 0.1, max: 0.8 },
    gravityRange: { min: 0.3, max: 0.9 },
    atmosphereType: 'trace',
    temperatureRange: { min: -100, max: 80 },
    waterPercent: { min: 0, max: 5 },
    habitabilityRating: { min: 0, max: 15 },
    resourceSlots: 8,
    maxMoons: 1,
    specialFeatures: ['cratered_surface', 'heavy_metals', 'tectonic_shards', 'magnetic_anomalies'],
    atmosphereComposition: { nitrogen: 40, carbonDioxide: 30, other: 30 },
    surfacePressure: { min: 0.01, max: 0.1 },
  },
  // ========== Class V - Volcanic ==========
  {
    classId: 'V',
    className: 'Volcanic',
    subclassRange: 'V0-V9',
    category: 'hostile',
    subcategory: 'energy-rich',
    description: 'Tectonically hyperactive worlds with constant eruptions and lava flows',
    diameterRange: { min: 5000, max: 14000 },
    massRange: { min: 0.3, max: 1.5 },
    gravityRange: { min: 0.5, max: 1.2 },
    atmosphereType: 'toxic-sulfur',
    temperatureRange: { min: 50, max: 500 },
    waterPercent: { min: 0, max: 15 },
    habitabilityRating: { min: 0, max: 20 },
    resourceSlots: 7,
    maxMoons: 1,
    specialFeatures: ['active_volcanism', 'lava_flows', 'geothermal_vents', 'rare_minerals', 'sulfur_deposits'],
    atmosphereComposition: { sulfurDioxide: 60, nitrogen: 25, carbonDioxide: 10, other: 5 },
    surfacePressure: { min: 0.5, max: 3.0 },
  },
  // ========== Class T - Tropical ==========
  {
    classId: 'T',
    className: 'Tropical',
    subclassRange: 'T0-T9',
    category: 'habitable',
    subcategory: 'agricultural',
    description: 'Warm, humid worlds with dense vegetation and rich biodiversity',
    diameterRange: { min: 8000, max: 15000 },
    massRange: { min: 0.5, max: 2.5 },
    gravityRange: { min: 0.7, max: 1.4 },
    atmosphereType: 'dense-nitrogen-oxygen',
    temperatureRange: { min: 15, max: 45 },
    waterPercent: { min: 50, max: 95 },
    habitabilityRating: { min: 50, max: 90 },
    resourceSlots: 4,
    maxMoons: 3,
    specialFeatures: ['dense_jungle', 'biodiversity', 'rare_flora', 'tropical_storms', 'pharmaceutical_plants'],
    atmosphereComposition: { nitrogen: 74, oxygen: 24, waterVapor: 1.5, other: 0.5 },
    surfacePressure: { min: 1.0, max: 1.8 },
  },
  // ========== Class A - Arctic/Frozen ==========
  {
    classId: 'A',
    className: 'Arctic (Frozen)',
    subclassRange: 'A0-A9',
    category: 'marginal',
    subcategory: 'crystal-rich',
    description: 'Permanently frozen worlds covered in ice sheets and cryogenic deposits',
    diameterRange: { min: 4000, max: 13000 },
    massRange: { min: 0.2, max: 1.0 },
    gravityRange: { min: 0.4, max: 1.0 },
    atmosphereType: 'thin-nitrogen',
    temperatureRange: { min: -200, max: -10 },
    waterPercent: { min: 60, max: 100 },
    habitabilityRating: { min: 5, max: 25 },
    resourceSlots: 5,
    maxMoons: 2,
    specialFeatures: ['ice_cap', 'cryogenic_deposits', 'frozen_gas', 'geysers', 'subsurface_ocean'],
    atmosphereComposition: { nitrogen: 85, oxygen: 10, methane: 3, other: 2 },
    surfacePressure: { min: 0.1, max: 0.5 },
  },
  // ========== Class K - Marginal ==========
  {
    classId: 'K',
    className: 'Marginal',
    subclassRange: 'K0-K9',
    category: 'marginal',
    subcategory: 'strategic',
    description: 'Marginal worlds requiring terraforming or specialized habitats for colonization',
    diameterRange: { min: 5000, max: 14000 },
    massRange: { min: 0.3, max: 1.5 },
    gravityRange: { min: 0.5, max: 1.2 },
    atmosphereType: 'thin-nitrogen',
    temperatureRange: { min: -40, max: 60 },
    waterPercent: { min: 5, max: 30 },
    habitabilityRating: { min: 20, max: 50 },
    resourceSlots: 6,
    maxMoons: 2,
    specialFeatures: ['terraforming_candidate', 'mineral_deposits', 'thin_atmosphere', 'extreme_weather'],
    atmosphereComposition: { nitrogen: 70, carbonDioxide: 20, argon: 8, other: 2 },
    surfacePressure: { min: 0.2, max: 0.7 },
  },
  // ========== Class J - Jovian ==========
  {
    classId: 'J',
    className: 'Jovian',
    subclassRange: 'J0-J9',
    category: 'gas',
    subcategory: 'energy-rich',
    description: 'Jupiter-class gas giants with complex storm systems and intense radiation belts',
    diameterRange: { min: 100000, max: 180000 },
    massRange: { min: 100, max: 800 },
    gravityRange: { min: 2.0, max: 4.5 },
    atmosphereType: 'hydrogen-helium',
    temperatureRange: { min: -180, max: 100 },
    waterPercent: { min: 0, max: 0 },
    habitabilityRating: { min: 0, max: 2 },
    resourceSlots: 6,
    maxMoons: 20,
    specialFeatures: ['great_red_spot', 'powerful_magnetic_field', 'intense_radiation', 'ring_system', 'storm_bands'],
    atmosphereComposition: { hydrogen: 86, helium: 13, methane: 0.5, ammonia: 0.5 },
    surfacePressure: { min: 500, max: 5000 },
  },
  // ========== Class I - Ice Giant ==========
  {
    classId: 'I',
    className: 'Ice Giant',
    subclassRange: 'I0-I9',
    category: 'gas',
    subcategory: 'crystal-rich',
    description: 'Ice giants with heavy-element-rich mantles and diamond rain phenomena',
    diameterRange: { min: 30000, max: 60000 },
    massRange: { min: 10, max: 80 },
    gravityRange: { min: 0.8, max: 1.5 },
    atmosphereType: 'hydrogen-helium-methane',
    temperatureRange: { min: -220, max: -50 },
    waterPercent: { min: 0, max: 0 },
    habitabilityRating: { min: 0, max: 3 },
    resourceSlots: 5,
    maxMoons: 10,
    specialFeatures: ['diamond_rain', 'ice_mantle', 'exotic_materials', 'magnetic_anomalies', 'methane_clouds'],
    atmosphereComposition: { hydrogen: 80, helium: 15, methane: 4, other: 1 },
    surfacePressure: { min: 100, max: 5000 },
  },
  // ========== Class H - Hostile ==========
  {
    classId: 'H',
    className: 'Hostile',
    subclassRange: 'H0-H9',
    category: 'hostile',
    subcategory: 'strategic',
    description: 'Extremely hostile worlds with lethal atmospheres, extreme temperatures, or radiation',
    diameterRange: { min: 4000, max: 15000 },
    massRange: { min: 0.2, max: 2.0 },
    gravityRange: { min: 0.4, max: 1.5 },
    atmosphereType: 'corrosive',
    temperatureRange: { min: -150, max: 300 },
    waterPercent: { min: 0, max: 20 },
    habitabilityRating: { min: 0, max: 10 },
    resourceSlots: 7,
    maxMoons: 1,
    specialFeatures: ['corrosive_atmosphere', 'extreme_radiation', 'toxic_clouds', 'acid_rain', 'hostile_terrain'],
    atmosphereComposition: { sulfurDioxide: 40, chlorine: 20, nitrogen: 15, carbonDioxide: 15, other: 10 },
    surfacePressure: { min: 0.5, max: 5.0 },
  },
  // ========== Class N - Toxic ==========
  {
    classId: 'N',
    className: 'Toxic',
    subclassRange: 'N0-N9',
    category: 'hostile',
    subcategory: 'mineral-rich',
    description: 'Worlds with poisonous atmospheres and chemically hostile surface conditions',
    diameterRange: { min: 4000, max: 13000 },
    massRange: { min: 0.2, max: 1.2 },
    gravityRange: { min: 0.4, max: 1.1 },
    atmosphereType: 'toxic-sulfur',
    temperatureRange: { min: -30, max: 80 },
    waterPercent: { min: 0, max: 25 },
    habitabilityRating: { min: 0, max: 8 },
    resourceSlots: 6,
    maxMoons: 1,
    specialFeatures: ['toxic_clouds', 'acid_lakes', 'corrosive_minerals', 'chemical_vents', 'barren_wasteland'],
    atmosphereComposition: { nitrogen: 40, sulfurDioxide: 30, chlorine: 15, carbonDioxide: 10, other: 5 },
    surfacePressure: { min: 0.3, max: 2.0 },
  },
] as const;

// ============================================================================
// PLANET CATALOG (50+ Individual Types)
// ============================================================================

export const PLANET_CATALOG: readonly PlanetCatalogEntry[] = [
  // ==================== Class M Types (10) ====================
  {
    id: 'M0', name: 'Tropical Rainforest', classId: 'M', subclassId: 'M0', subclassCode: 'Tropical',
    category: 'habitable', subcategory: 'agricultural',
    description: 'Dense tropical rainforest with high humidity and abundant biodiversity',
    diameter: 12500, mass: 1.0, gravity: 1.0, atmosphereType: 'dense-nitrogen-oxygen',
    atmosphereComposition: { nitrogen: 75, oxygen: 24, waterVapor: 0.8, other: 0.2 },
    surfacePressure: 1.2, temperature: 30, temperatureMin: 15, temperatureMax: 45,
    waterPercent: 80, habitabilityRating: 85, resourceSlots: 4, maxMoons: 3,
    specialFeatures: ['dense_canopy', 'mega_fauna', 'pharmaceutical_resources', 'extreme_biodiversity'],
    rarity: 'uncommon',
  },
  {
    id: 'M1', name: 'Savanna World', classId: 'M', subclassId: 'M1', subclassCode: 'Savanna',
    category: 'habitable', subcategory: 'agricultural',
    description: 'Warm grassland world with seasonal rains and vast plains',
    diameter: 11800, mass: 0.9, gravity: 0.95, atmosphereType: 'standard-nitrogen-oxygen',
    atmosphereComposition: { nitrogen: 77, oxygen: 22, argon: 0.8, other: 0.2 },
    surfacePressure: 1.0, temperature: 25, temperatureMin: 5, temperatureMax: 40,
    waterPercent: 40, habitabilityRating: 75, resourceSlots: 4, maxMoons: 2,
    specialFeatures: ['vast_plains', 'herd_migrations', 'seasonal_rains', 'agricultural_potential'],
    rarity: 'common',
  },
  {
    id: 'M2', name: 'Temperate Forest', classId: 'M', subclassId: 'M2', subclassCode: 'Temperate',
    category: 'habitable', subcategory: 'agricultural',
    description: 'Balanced temperate world with four seasons and deciduous forests',
    diameter: 12700, mass: 1.0, gravity: 1.0, atmosphereType: 'standard-nitrogen-oxygen',
    atmosphereComposition: { nitrogen: 78, oxygen: 21, argon: 0.9, other: 0.1 },
    surfacePressure: 1.0, temperature: 15, temperatureMin: -20, temperatureMax: 35,
    waterPercent: 60, habitabilityRating: 95, resourceSlots: 5, maxMoons: 3,
    specialFeatures: ['four_seasons', 'stable_climate', 'diverse_ecosystems', 'ideal_colonization'],
    rarity: 'rare',
  },
  {
    id: 'M3', name: 'Continental World', classId: 'M', subclassId: 'M3', subclassCode: 'Continental',
    category: 'habitable', subcategory: 'agricultural',
    description: 'World with large continents and shallow seas, ideal for civilization',
    diameter: 13000, mass: 1.1, gravity: 1.05, atmosphereType: 'standard-nitrogen-oxygen',
    atmosphereComposition: { nitrogen: 78, oxygen: 21, argon: 0.8, other: 0.2 },
    surfacePressure: 1.05, temperature: 18, temperatureMin: -15, temperatureMax: 38,
    waterPercent: 55, habitabilityRating: 100, resourceSlots: 5, maxMoons: 4,
    specialFeatures: ['large_continents', 'shallow_seas', 'optimal_habitability', 'resource_diversity'],
    rarity: 'epic',
  },
  {
    id: 'M4', name: 'Archipelago World', classId: 'M', subclassId: 'M4', subclassCode: 'Archipelago',
    category: 'habitable', subcategory: 'agricultural',
    description: 'Ocean world with thousands of islands and rich marine ecosystems',
    diameter: 12000, mass: 0.95, gravity: 0.97, atmosphereType: 'standard-nitrogen-oxygen',
    atmosphereComposition: { nitrogen: 76, oxygen: 23, waterVapor: 0.8, other: 0.2 },
    surfacePressure: 1.1, temperature: 22, temperatureMin: 10, temperatureMax: 35,
    waterPercent: 75, habitabilityRating: 80, resourceSlots: 4, maxMoons: 2,
    specialFeatures: ['thousands_of_islands', 'marine_biodiversity', 'coral_reefs', 'fishing_grounds'],
    rarity: 'uncommon',
  },
  {
    id: 'M5', name: 'Earth Prime', classId: 'M', subclassId: 'M5', subclassCode: 'Earth-like',
    category: 'habitable', subcategory: 'agricultural',
    description: 'Near-perfect Earth analog with balanced biome and stable geology',
    diameter: 12742, mass: 1.0, gravity: 1.0, atmosphereType: 'standard-nitrogen-oxygen',
    atmosphereComposition: { nitrogen: 78, oxygen: 21, argon: 0.9, other: 0.1 },
    surfacePressure: 1.0, temperature: 15, temperatureMin: -50, temperatureMax: 50,
    waterPercent: 71, habitabilityRating: 100, resourceSlots: 5, maxMoons: 3,
    specialFeatures: ['stable_magnetic_field', 'ozone_layer', 'plate_tectonics', 'native_intelligence'],
    rarity: 'legendary',
  },
  {
    id: 'M6', name: 'Gaia World', classId: 'M', subclassId: 'M6', subclassCode: 'Paradise',
    category: 'habitable', subcategory: 'precursor',
    description: 'Perfectly balanced paradise world with sentience-enhancing properties',
    diameter: 13500, mass: 1.2, gravity: 1.1, atmosphereType: 'dense-nitrogen-oxygen',
    atmosphereComposition: { nitrogen: 76, oxygen: 23, traceGases: 1 },
    surfacePressure: 1.15, temperature: 20, temperatureMin: 5, temperatureMax: 35,
    waterPercent: 65, habitabilityRating: 100, resourceSlots: 6, maxMoons: 4,
    specialFeatures: ['sentience_enhancement', 'perfect_ecosystem', 'zero_pathogens', 'psionic_resonance'],
    rarity: 'legendary',
  },
  {
    id: 'M7', name: 'Tundra World', classId: 'M', subclassId: 'M7', subclassCode: 'Tundra',
    category: 'habitable', subcategory: 'mineral-rich',
    description: 'Cold but habitable world with permafrost and taiga biomes',
    diameter: 10500, mass: 0.7, gravity: 0.85, atmosphereType: 'standard-nitrogen-oxygen',
    atmosphereComposition: { nitrogen: 80, oxygen: 19, argon: 0.8, other: 0.2 },
    surfacePressure: 0.9, temperature: -5, temperatureMin: -60, temperatureMax: 20,
    waterPercent: 45, habitabilityRating: 55, resourceSlots: 6, maxMoons: 2,
    specialFeatures: ['permafrost', 'taiga_biome', 'mineral_exposure', 'cold_adapted_life'],
    rarity: 'common',
  },
  {
    id: 'M8', name: 'Prairie World', classId: 'M', subclassId: 'M8', subclassCode: 'Prairie',
    category: 'habitable', subcategory: 'agricultural',
    description: 'Vast grassland world with deep soils and agricultural potential',
    diameter: 11500, mass: 0.85, gravity: 0.92, atmosphereType: 'standard-nitrogen-oxygen',
    atmosphereComposition: { nitrogen: 78, oxygen: 21, argon: 0.9, other: 0.2 },
    surfacePressure: 1.0, temperature: 18, temperatureMin: -25, temperatureMax: 38,
    waterPercent: 30, habitabilityRating: 80, resourceSlots: 5, maxMoons: 2,
    specialFeatures: ['deep_fertile_soil', 'vast_grasslands', 'wind_farming', 'bison_analogues'],
    rarity: 'uncommon',
  },
  {
    id: 'M9', name: 'Highland World', classId: 'M', subclassId: 'M9', subclassCode: 'Highland',
    category: 'habitable', subcategory: 'mineral-rich',
    description: 'Mountainous habitable world with high plateaus and mineral veins',
    diameter: 11000, mass: 0.8, gravity: 0.9, atmosphereType: 'thin-nitrogen',
    atmosphereComposition: { nitrogen: 79, oxygen: 19, argon: 1.5, other: 0.5 },
    surfacePressure: 0.75, temperature: 10, temperatureMin: -30, temperatureMax: 25,
    waterPercent: 25, habitabilityRating: 60, resourceSlots: 7, maxMoons: 2,
    specialFeatures: ['towering_peaks', 'mineral_veins', 'plateau_settlements', 'thin_air'],
    rarity: 'uncommon',
  },

  // ==================== Class G Types (5) ====================
  {
    id: 'G0', name: 'Gas Dwarf', classId: 'G', subclassId: 'G0', subclassCode: 'Sub-Giant',
    category: 'gas', subcategory: 'energy-rich',
    description: 'Small gas giant with thin hydrogen atmosphere',
    diameter: 45000, mass: 20, gravity: 1.1, atmosphereType: 'hydrogen-helium',
    atmosphereComposition: { hydrogen: 85, helium: 14, methane: 0.5, other: 0.5 },
    surfacePressure: 150, temperature: -120, temperatureMin: -180, temperatureMax: -50,
    waterPercent: 0, habitabilityRating: 2, resourceSlots: 5, maxMoons: 8,
    specialFeatures: ['thin_rings', 'small_storms', 'moon_system'],
    rarity: 'common',
  },
  {
    id: 'G1', name: 'Ringed Giant', classId: 'G', subclassId: 'G1', subclassCode: 'Saturnian',
    category: 'gas', subcategory: 'crystal-rich',
    description: 'Magnificent gas giant with spectacular ice and rock ring system',
    diameter: 110000, mass: 80, gravity: 1.2, atmosphereType: 'hydrogen-helium',
    atmosphereComposition: { hydrogen: 90, helium: 9, methane: 0.5, other: 0.5 },
    surfacePressure: 200, temperature: -140, temperatureMin: -180, temperatureMax: -80,
    waterPercent: 0, habitabilityRating: 1, resourceSlots: 6, maxMoons: 12,
    specialFeatures: ['spectacular_rings', 'ice_ring_particles', 'ring_mining', 'moon_resonance'],
    rarity: 'uncommon',
  },
  {
    id: 'G2', name: 'Storm Giant', classId: 'G', subclassId: 'G2', subclassCode: 'Tempest',
    category: 'gas', subcategory: 'energy-rich',
    description: 'Gas giant wracked by perpetual superstorms and massive lightning',
    diameter: 140000, mass: 350, gravity: 2.5, atmosphereType: 'hydrogen-helium',
    atmosphereComposition: { hydrogen: 88, helium: 10, ammonia: 1, other: 1 },
    surfacePressure: 500, temperature: -100, temperatureMin: -150, temperatureMax: 50,
    waterPercent: 0, habitabilityRating: 0, resourceSlots: 6, maxMoons: 15,
    specialFeatures: ['supercell_storms', 'lightning_network', 'deep_harvesting', 'radiation_belts'],
    rarity: 'rare',
  },
  {
    id: 'G3', name: 'Hot Jupiter', classId: 'G', subclassId: 'G3', subclassCode: 'Inflated',
    category: 'gas', subcategory: 'energy-rich',
    description: 'Gas giant orbiting extremely close to its star with inflated atmosphere',
    diameter: 160000, mass: 500, gravity: 3.0, atmosphereType: 'hydrogen-helium',
    atmosphereComposition: { hydrogen: 85, helium: 13, sodium: 1, other: 1 },
    surfacePressure: 1000, temperature: 800, temperatureMin: 500, temperatureMax: 2000,
    waterPercent: 0, habitabilityRating: 0, resourceSlots: 5, maxMoons: 5,
    specialFeatures: ['inflated_atmosphere', 'atmospheric_escape', 'thermal_emission', 'tidal_locked'],
    rarity: 'rare',
  },
  {
    id: 'G4', name: 'Super Jupiter', classId: 'G', subclassId: 'G4', subclassCode: 'Massive',
    category: 'gas', subcategory: 'energy-rich',
    description: 'Extremely massive gas giant approaching brown dwarf territory',
    diameter: 180000, mass: 900, gravity: 4.5, atmosphereType: 'hydrogen-helium',
    atmosphereComposition: { hydrogen: 82, helium: 16, deuterium: 1.5, other: 0.5 },
    surfacePressure: 5000, temperature: -80, temperatureMin: -120, temperatureMax: 200,
    waterPercent: 0, habitabilityRating: 0, resourceSlots: 7, maxMoons: 20,
    specialFeatures: ['extreme_mass', 'deuterium_fusion', 'brown_dwarf_boundary', 'intense_gravity'],
    rarity: 'epic',
  },

  // ==================== Class D Types (5) ====================
  {
    id: 'D0', name: 'Sand Sea', classId: 'D', subclassId: 'D0', subclassCode: 'Erg',
    category: 'marginal', subcategory: 'mineral-rich',
    description: 'Vast sand dune seas stretching across the entire hemisphere',
    diameter: 10000, mass: 0.6, gravity: 0.8, atmosphereType: 'thin-nitrogen',
    atmosphereComposition: { nitrogen: 82, carbonDioxide: 12, argon: 5, other: 1 },
    surfacePressure: 0.4, temperature: 40, temperatureMin: -20, temperatureMax: 65,
    waterPercent: 2, habitabilityRating: 20, resourceSlots: 6, maxMoons: 1,
    specialFeatures: ['endless_dunes', 'sandstorms', 'buried_ruins', 'rare_earth_metals'],
    rarity: 'common',
  },
  {
    id: 'D1', name: 'Rocky Desert', classId: 'D', subclassId: 'D1', subclassCode: 'Hamada',
    category: 'marginal', subcategory: 'mineral-rich',
    description: 'Flat rocky desert with exposed geological formations',
    diameter: 9500, mass: 0.55, gravity: 0.75, atmosphereType: 'thin-nitrogen',
    atmosphereComposition: { nitrogen: 80, carbonDioxide: 15, argon: 4, other: 1 },
    surfacePressure: 0.35, temperature: 35, temperatureMin: -25, temperatureMax: 60,
    waterPercent: 1, habitabilityRating: 15, resourceSlots: 7, maxMoons: 1,
    specialFeatures: ['exposed_ore', 'geological_formations', 'meteor_craters', 'mining_outposts'],
    rarity: 'common',
  },
  {
    id: 'D2', name: 'Salt Flat', classId: 'D', subclassId: 'D2', subclassCode: 'Playa',
    category: 'marginal', subcategory: 'crystal-rich',
    description: 'Dried lake bed covered in vast salt and mineral flats',
    diameter: 9000, mass: 0.5, gravity: 0.72, atmosphereType: 'thin-nitrogen',
    atmosphereComposition: { nitrogen: 83, carbonDioxide: 10, argon: 6, other: 1 },
    surfacePressure: 0.3, temperature: 38, temperatureMin: -15, temperatureMax: 55,
    waterPercent: 3, habitabilityRating: 18, resourceSlots: 6, maxMoons: 1,
    specialFeatures: ['salt_crystals', 'mineral_flats', 'mirror_surface', 'evaporation_deposits'],
    rarity: 'uncommon',
  },
  {
    id: 'D3', name: 'Canyon World', classId: 'D', subclassId: 'D3', subclassCode: 'Wadi',
    category: 'marginal', subcategory: 'mineral-rich',
    description: 'Arid world carved with deep canyons and ancient riverbeds',
    diameter: 10500, mass: 0.65, gravity: 0.82, atmosphereType: 'thin-nitrogen',
    atmosphereComposition: { nitrogen: 78, carbonDioxide: 16, argon: 5, other: 1 },
    surfacePressure: 0.4, temperature: 30, temperatureMin: -20, temperatureMax: 50,
    waterPercent: 5, habitabilityRating: 25, resourceSlots: 7, maxMoons: 2,
    specialFeatures: ['deep_canyons', 'ancient_riverbeds', 'subsurface_water', 'fossil_beds'],
    rarity: 'uncommon',
  },
  {
    id: 'D4', name: 'Dune World', classId: 'D', subclassId: 'D4', subclassCode: 'Arrakis',
    category: 'marginal', subcategory: 'strategic',
    description: 'Extreme desert world with massive dune patterns and sandworm analogues',
    diameter: 11000, mass: 0.75, gravity: 0.88, atmosphereType: 'thin-nitrogen',
    atmosphereComposition: { nitrogen: 79, carbonDioxide: 14, argon: 6, other: 1 },
    surfacePressure: 0.45, temperature: 45, temperatureMin: -10, temperatureMax: 70,
    waterPercent: 1, habitabilityRating: 15, resourceSlots: 8, maxMoons: 2,
    specialFeatures: ['massive_dunes', 'sandworm_analogues', 'spice_deposits', 'deep_wells'],
    rarity: 'rare',
  },

  // ==================== Class R Types (5) ====================
  {
    id: 'R0', name: 'Airless Rock', classId: 'R', subclassId: 'R0', subclassCode: 'Barren',
    category: 'barren', subcategory: 'mineral-rich',
    description: 'Completely barren airless rock with cratered surface',
    diameter: 5000, mass: 0.3, gravity: 0.6, atmosphereType: 'trace',
    atmosphereComposition: { other: 100 },
    surfacePressure: 0.001, temperature: -50, temperatureMin: -180, temperatureMax: 120,
    waterPercent: 0, habitabilityRating: 0, resourceSlots: 7, maxMoons: 0,
    specialFeatures: ['cratered_surface', 'no_atmosphere', 'extreme_temperatures', 'raw_minerals'],
    rarity: 'common',
  },
  {
    id: 'R1', name: 'Iron World', classId: 'R', subclassId: 'R1', subclassCode: 'Ferrous',
    category: 'barren', subcategory: 'mineral-rich',
    description: 'Iron-rich rocky world with exposed metal deposits and magnetic anomalies',
    diameter: 7000, mass: 0.5, gravity: 0.75, atmosphereType: 'trace',
    atmosphereComposition: { nitrogen: 50, other: 50 },
    surfacePressure: 0.01, temperature: -30, temperatureMin: -150, temperatureMax: 100,
    waterPercent: 0, habitabilityRating: 2, resourceSlots: 8, maxMoons: 1,
    specialFeatures: ['iron_deposits', 'magnetic_anomalies', 'metal_surface', 'rust_bands'],
    rarity: 'uncommon',
  },
  {
    id: 'R2', name: 'Silicate World', classId: 'R', subclassId: 'R2', subclassCode: 'Sial',
    category: 'barren', subcategory: 'crystal-rich',
    description: 'Silicate-rich rocky world with crystalline surface formations',
    diameter: 6500, mass: 0.45, gravity: 0.7, atmosphereType: 'trace',
    atmosphereComposition: { carbonDioxide: 60, nitrogen: 30, other: 10 },
    surfacePressure: 0.02, temperature: -40, temperatureMin: -160, temperatureMax: 110,
    waterPercent: 0, habitabilityRating: 1, resourceSlots: 7, maxMoons: 0,
    specialFeatures: ['crystal_formations', 'silicate_surface', 'glass_plains', 'mineral_veins'],
    rarity: 'uncommon',
  },
  {
    id: 'R3', name: 'Heavy Metal', classId: 'R', subclassId: 'R3', subclassCode: 'Dense',
    category: 'barren', subcategory: 'strategic',
    description: 'Extremely dense rocky world with concentrated heavy metal deposits',
    diameter: 8000, mass: 0.7, gravity: 0.85, atmosphereType: 'trace',
    atmosphereComposition: { nitrogen: 40, argon: 30, other: 30 },
    surfacePressure: 0.015, temperature: -20, temperatureMin: -140, temperatureMax: 90,
    waterPercent: 0, habitabilityRating: 3, resourceSlots: 9, maxMoons: 1,
    specialFeatures: ['heavy_metals', 'uranium_deposits', 'high_density', 'radiation_belts'],
    rarity: 'rare',
  },
  {
    id: 'R4', name: 'Shattered World', classId: 'R', subclassId: 'R4', subclassCode: 'Fragmented',
    category: 'barren', subcategory: 'mineral-rich',
    description: 'Planetary body shattered by impact, now a collection of orbiting fragments',
    diameter: 4000, mass: 0.2, gravity: 0.5, atmosphereType: 'trace',
    atmosphereComposition: { other: 100 },
    surfacePressure: 0.001, temperature: -60, temperatureMin: -190, temperatureMax: 130,
    waterPercent: 0, habitabilityRating: 0, resourceSlots: 6, maxMoons: 0,
    specialFeatures: ['orbital_debris', 'exposed_core', 'mineral_rich_fragments', 'impact_glass'],
    rarity: 'rare',
  },

  // ==================== Class V Types (5) ====================
  {
    id: 'V0', name: 'Lava World', classId: 'V', subclassId: 'V0', subclassCode: 'Magma',
    category: 'hostile', subcategory: 'energy-rich',
    description: 'Surface covered in molten lava with constant volcanic eruptions',
    diameter: 10000, mass: 0.7, gravity: 0.85, atmosphereType: 'toxic-sulfur',
    atmosphereComposition: { sulfurDioxide: 65, nitrogen: 20, carbonDioxide: 10, other: 5 },
    surfacePressure: 1.5, temperature: 200, temperatureMin: 80, temperatureMax: 500,
    waterPercent: 0, habitabilityRating: 0, resourceSlots: 7, maxMoons: 0,
    specialFeatures: ['molten_surface', 'lava_rivers', 'volcanic_bombs', 'extreme_heat'],
    rarity: 'uncommon',
  },
  {
    id: 'V1', name: 'Ash World', classId: 'V', subclassId: 'V1', subclassCode: 'Pyroclastic',
    category: 'hostile', subcategory: 'mineral-rich',
    description: 'World buried under volcanic ash with buried mineral wealth',
    diameter: 9500, mass: 0.6, gravity: 0.78, atmosphereType: 'toxic-sulfur',
    atmosphereComposition: { sulfurDioxide: 50, nitrogen: 30, ash: 15, other: 5 },
    surfacePressure: 1.2, temperature: 80, temperatureMin: 20, temperatureMax: 200,
    waterPercent: 5, habitabilityRating: 5, resourceSlots: 8, maxMoons: 1,
    specialFeatures: ['volcanic_ash', 'buried_minerals', 'geothermal_energy', 'ash_clouds'],
    rarity: 'uncommon',
  },
  {
    id: 'V2', name: 'Geothermal Paradise', classId: 'V', subclassId: 'V2', subclassCode: 'Thermal',
    category: 'hostile', subcategory: 'energy-rich',
    description: 'Hyperactive volcanic world with accessible geothermal energy sources',
    diameter: 11000, mass: 0.8, gravity: 0.9, atmosphereType: 'toxic-sulfur',
    atmosphereComposition: { sulfurDioxide: 45, nitrogen: 35, carbonDioxide: 15, other: 5 },
    surfacePressure: 1.8, temperature: 120, temperatureMin: 50, temperatureMax: 350,
    waterPercent: 10, habitabilityRating: 8, resourceSlots: 7, maxMoons: 1,
    specialFeatures: ['geothermal_vents', 'hot_springs', 'energy_extracts', 'thermophilic_life'],
    rarity: 'rare',
  },
  {
    id: 'V3', name: 'Tidally Heated', classId: 'V', subclassId: 'V3', subclassCode: 'Io-like',
    category: 'hostile', subcategory: 'energy-rich',
    description: 'Moon-sized body tidally heated by parent gas giant with extreme volcanism',
    diameter: 5000, mass: 0.25, gravity: 0.55, atmosphereType: 'toxic-sulfur',
    atmosphereComposition: { sulfurDioxide: 70, sulfur: 20, other: 10 },
    surfacePressure: 0.3, temperature: 100, temperatureMin: 30, temperatureMax: 280,
    waterPercent: 0, habitabilityRating: 3, resourceSlots: 6, maxMoons: 0,
    specialFeatures: ['tidal_heating', 'sulfur_vaults', 'lava_lakes', 'gas_giant_umbra'],
    rarity: 'rare',
  },
  {
    id: 'V4', name: 'Supervolcanic', classId: 'V', subclassId: 'V4', subclassCode: 'Cataclysm',
    category: 'hostile', subcategory: 'mineral-rich',
    description: 'World in perpetual volcanic cataclysm with planet-wide eruptions',
    diameter: 12000, mass: 1.0, gravity: 1.0, atmosphereType: 'toxic-sulfur',
    atmosphereComposition: { sulfurDioxide: 55, carbonDioxide: 25, nitrogen: 15, other: 5 },
    surfacePressure: 2.5, temperature: 250, temperatureMin: 100, temperatureMax: 450,
    waterPercent: 0, habitabilityRating: 0, resourceSlots: 8, maxMoons: 0,
    specialFeatures: ['supervolcano', 'planet_wide_eruption', 'pyroclastic_flows', 'crustal_melting'],
    rarity: 'epic',
  },

  // ==================== Class T Types (4) ====================
  {
    id: 'T0', name: 'Jungle World', classId: 'T', subclassId: 'T0', subclassCode: 'Rainforest',
    category: 'habitable', subcategory: 'agricultural',
    description: 'Dense tropical jungle covering entire surface with extreme biodiversity',
    diameter: 12000, mass: 0.95, gravity: 0.97, atmosphereType: 'dense-nitrogen-oxygen',
    atmosphereComposition: { nitrogen: 74, oxygen: 24, waterVapor: 1.5, other: 0.5 },
    surfacePressure: 1.3, temperature: 32, temperatureMin: 20, temperatureMax: 42,
    waterPercent: 85, habitabilityRating: 70, resourceSlots: 4, maxMoons: 2,
    specialFeatures: ['dense_canopy', 'mega_flora', 'canopy_cities', 'exotic_biodiversity'],
    rarity: 'uncommon',
  },
  {
    id: 'T1', name: 'Humid World', classId: 'T', subclassId: 'T1', subclassCode: 'Steam',
    category: 'habitable', subcategory: 'energy-rich',
    description: 'Extremely humid tropical world with perpetual cloud cover',
    diameter: 11500, mass: 0.85, gravity: 0.92, atmosphereType: 'dense-nitrogen-oxygen',
    atmosphereComposition: { nitrogen: 72, oxygen: 22, waterVapor: 5, other: 1 },
    surfacePressure: 1.4, temperature: 35, temperatureMin: 25, temperatureMax: 45,
    waterPercent: 90, habitabilityRating: 55, resourceSlots: 4, maxMoons: 2,
    specialFeatures: ['perpetual_clouds', 'water_cycle', 'geothermal_vents', 'steam_vents'],
    rarity: 'uncommon',
  },
  {
    id: 'T2', name: 'Monsoon World', classId: 'T', subclassId: 'T2', subclassCode: 'Seasonal',
    category: 'habitable', subcategory: 'agricultural',
    description: 'Tropical world with extreme seasonal monsoon cycles',
    diameter: 11800, mass: 0.9, gravity: 0.95, atmosphereType: 'standard-nitrogen-oxygen',
    atmosphereComposition: { nitrogen: 76, oxygen: 22, waterVapor: 1.5, other: 0.5 },
    surfacePressure: 1.1, temperature: 28, temperatureMin: 15, temperatureMax: 40,
    waterPercent: 65, habitabilityRating: 65, resourceSlots: 5, maxMoons: 2,
    specialFeatures: ['extreme_monsoons', 'flood_plains', 'seasonal_biodiversity', 'rice_paddies'],
    rarity: 'common',
  },
  {
    id: 'T3', name: 'Swamp World', classId: 'T', subclassId: 'T3', subclassCode: 'Wetland',
    category: 'marginal', subcategory: 'agricultural',
    description: 'Entire surface covered in tropical swamps and mangrove analogues',
    diameter: 11000, mass: 0.8, gravity: 0.9, atmosphereType: 'dense-nitrogen-oxygen',
    atmosphereComposition: { nitrogen: 70, oxygen: 20, methane: 8, other: 2 },
    surfacePressure: 1.2, temperature: 30, temperatureMin: 20, temperatureMax: 40,
    waterPercent: 95, habitabilityRating: 40, resourceSlots: 5, maxMoons: 1,
    specialFeatures: ['endless_swamps', 'methane_bogs', 'amphibious_life', 'peat_deposits'],
    rarity: 'common',
  },

  // ==================== Class A Types (5) ====================
  {
    id: 'A0', name: 'Ice Ball', classId: 'A', subclassId: 'A0', subclassCode: 'Cryo',
    category: 'marginal', subcategory: 'crystal-rich',
    description: 'Completely frozen world with global ice shell',
    diameter: 8000, mass: 0.4, gravity: 0.65, atmosphereType: 'thin-nitrogen',
    atmosphereComposition: { nitrogen: 88, oxygen: 8, methane: 3, other: 1 },
    surfacePressure: 0.15, temperature: -120, temperatureMin: -200, temperatureMax: -60,
    waterPercent: 100, habitabilityRating: 5, resourceSlots: 5, maxMoons: 1,
    specialFeatures: ['global_ice_shell', 'ice_volcanoes', 'frozen_lakes', 'cryogenic_deposits'],
    rarity: 'common',
  },
  {
    id: 'A1', name: 'Snowball World', classId: 'A', subclassId: 'A1', subclassCode: 'Glacial',
    category: 'marginal', subcategory: 'crystal-rich',
    description: 'World locked in ice age with glaciers covering most landmasses',
    diameter: 10000, mass: 0.6, gravity: 0.8, atmosphereType: 'thin-nitrogen',
    atmosphereComposition: { nitrogen: 85, oxygen: 12, methane: 2, other: 1 },
    surfacePressure: 0.3, temperature: -60, temperatureMin: -100, temperatureMax: -10,
    waterPercent: 80, habitabilityRating: 10, resourceSlots: 5, maxMoons: 2,
    specialFeatures: ['glacial_cover', 'ice_cores', 'frozen_oceans', 'snowball_earth_analogue'],
    rarity: 'uncommon',
  },
  {
    id: 'A2', name: 'Methane World', classId: 'A', subclassId: 'A2', subclassCode: 'Cryogenic',
    category: 'marginal', subcategory: 'energy-rich',
    description: 'Frozen world with lakes and rivers of liquid methane',
    diameter: 7500, mass: 0.35, gravity: 0.6, atmosphereType: 'thin-nitrogen',
    atmosphereComposition: { nitrogen: 80, methane: 15, argon: 4, other: 1 },
    surfacePressure: 0.2, temperature: -170, temperatureMin: -200, temperatureMax: -140,
    waterPercent: 0, habitabilityRating: 2, resourceSlots: 6, maxMoons: 1,
    specialFeatures: ['methane_lakes', 'hydrocarbon_rains', 'cryogenic_geology', 'titan_analogue'],
    rarity: 'rare',
  },
  {
    id: 'A3', name: 'Diamond Ice', classId: 'A', subclassId: 'A3', subclassCode: 'Crystalline',
    category: 'marginal', subcategory: 'crystal-rich',
    description: 'Frozen world with exotic ice crystal formations under extreme pressure',
    diameter: 9000, mass: 0.5, gravity: 0.72, atmosphereType: 'thin-nitrogen',
    atmosphereComposition: { nitrogen: 87, oxygen: 10, argon: 2, other: 1 },
    surfacePressure: 0.25, temperature: -80, temperatureMin: -150, temperatureMax: -30,
    waterPercent: 90, habitabilityRating: 8, resourceSlots: 7, maxMoons: 1,
    specialFeatures: ['diamond_crystals', 'exotic_ice', 'pressure_crystals', 'lattice_formations'],
    rarity: 'epic',
  },
  {
    id: 'A4', name: 'Subsurface Ocean', classId: 'A', subclassId: 'A4', subclassCode: 'Europa',
    category: 'habitable', subcategory: 'energy-rich',
    description: 'Frozen exterior hiding vast subsurface ocean with potential life',
    diameter: 6000, mass: 0.3, gravity: 0.55, atmosphereType: 'trace',
    atmosphereComposition: { oxygen: 50, hydrogen: 30, other: 20 },
    surfacePressure: 0.01, temperature: -160, temperatureMin: -200, temperatureMax: -80,
    waterPercent: 100, habitabilityRating: 35, resourceSlots: 6, maxMoons: 0,
    specialFeatures: ['subsurface_ocean', 'hydrothermal_vents', 'potential_life', 'geysers'],
    rarity: 'rare',
  },

  // ==================== Class K Types (4) ====================
  {
    id: 'K0', name: 'Sparse Atmosphere', classId: 'K', subclassId: 'K0', subclassCode: 'Thin',
    category: 'marginal', subcategory: 'strategic',
    description: 'World with thin atmosphere requiring supplemental life support',
    diameter: 8000, mass: 0.45, gravity: 0.68, atmosphereType: 'thin-nitrogen',
    atmosphereComposition: { nitrogen: 75, carbonDioxide: 18, argon: 5, other: 2 },
    surfacePressure: 0.3, temperature: 10, temperatureMin: -40, temperatureMax: 45,
    waterPercent: 10, habitabilityRating: 30, resourceSlots: 6, maxMoons: 2,
    specialFeatures: ['thin_atmosphere', 'terraforming_candidate', 'mineral_deposits', 'low_shielding'],
    rarity: 'common',
  },
  {
    id: 'K1', name: 'Alkaline World', classId: 'K', subclassId: 'K1', subclassCode: 'Basic',
    category: 'marginal', subcategory: 'mineral-rich',
    description: 'World with highly alkaline surface chemistry and mineral lakes',
    diameter: 9000, mass: 0.5, gravity: 0.72, atmosphereType: 'thin-nitrogen',
    atmosphereComposition: { nitrogen: 70, carbonDioxide: 22, argon: 6, other: 2 },
    surfacePressure: 0.4, temperature: 20, temperatureMin: -20, temperatureMax: 50,
    waterPercent: 15, habitabilityRating: 25, resourceSlots: 7, maxMoons: 1,
    specialFeatures: ['alkaline_lakes', 'mineral_deposits', 'chemical_basins', 'exotic_minerals'],
    rarity: 'uncommon',
  },
  {
    id: 'K2', name: 'High Radiation', classId: 'K', subclassId: 'K2', subclassCode: 'Irradiated',
    category: 'marginal', subcategory: 'strategic',
    description: 'World with high surface radiation from nearby star or weak magnetosphere',
    diameter: 10000, mass: 0.6, gravity: 0.8, atmosphereType: 'thin-nitrogen',
    atmosphereComposition: { nitrogen: 78, oxygen: 15, argon: 5, other: 2 },
    surfacePressure: 0.5, temperature: 15, temperatureMin: -30, temperatureMax: 45,
    waterPercent: 20, habitabilityRating: 20, resourceSlots: 7, maxMoons: 2,
    specialFeatures: ['high_radiation', 'shielded_colonies', 'radioactive_minerals', 'mutation_zones'],
    rarity: 'uncommon',
  },
  {
    id: 'K3', name: 'Variable Climate', classId: 'K', subclassId: 'K3', subclassCode: 'Unstable',
    category: 'marginal', subcategory: 'strategic',
    description: 'World with extreme climate swings between habitable and hostile',
    diameter: 11000, mass: 0.75, gravity: 0.88, atmosphereType: 'thin-nitrogen',
    atmosphereComposition: { nitrogen: 72, carbonDioxide: 20, argon: 6, other: 2 },
    surfacePressure: 0.6, temperature: 25, temperatureMin: -40, temperatureMax: 55,
    waterPercent: 25, habitabilityRating: 35, resourceSlots: 6, maxMoons: 2,
    specialFeatures: ['climate_cycles', 'ice_ages', 'extreme_weather', 'terraformable'],
    rarity: 'uncommon',
  },

  // ==================== Class J Types (4) ====================
  {
    id: 'J0', name: 'Jupiter Analog', classId: 'J', subclassId: 'J0', subclassCode: 'Standard',
    category: 'gas', subcategory: 'energy-rich',
    description: 'Standard Jupiter-class gas giant with banded atmosphere',
    diameter: 140000, mass: 300, gravity: 2.5, atmosphereType: 'hydrogen-helium',
    atmosphereComposition: { hydrogen: 86, helium: 13, ammonia: 0.5, methane: 0.5 },
    surfacePressure: 800, temperature: -110, temperatureMin: -150, temperatureMax: 0,
    waterPercent: 0, habitabilityRating: 1, resourceSlots: 6, maxMoons: 15,
    specialFeatures: ['banded_atmosphere', 'great_red_spot', 'intense_radiation', 'moon_system'],
    rarity: 'uncommon',
  },
  {
    id: 'J1', name: 'Luminous Jovian', classId: 'J', subclassId: 'J1', subclassCode: 'Radiant',
    category: 'gas', subcategory: 'energy-rich',
    description: 'Gas giant emitting significant infrared radiation from internal heat',
    diameter: 130000, mass: 250, gravity: 2.2, atmosphereType: 'hydrogen-helium',
    atmosphereComposition: { hydrogen: 84, helium: 14, deuterium: 1.5, other: 0.5 },
    surfacePressure: 600, temperature: -80, temperatureMin: -120, temperatureMax: 200,
    waterPercent: 0, habitabilityRating: 0, resourceSlots: 5, maxMoons: 12,
    specialFeatures: ['infrared_emission', 'internal_heat', 'aurora_displays', 'magnetic_torus'],
    rarity: 'rare',
  },
  {
    id: 'J2', name: 'Binary Jovian', classId: 'J', subclassId: 'J2', subclassCode: 'Double',
    category: 'gas', subcategory: 'energy-rich',
    description: 'Binary gas giant system with two massive worlds orbiting each other',
    diameter: 120000, mass: 200, gravity: 2.0, atmosphereType: 'hydrogen-helium',
    atmosphereComposition: { hydrogen: 88, helium: 11, methane: 0.5, other: 0.5 },
    surfacePressure: 500, temperature: -100, temperatureMin: -140, temperatureMax: 50,
    waterPercent: 0, habitabilityRating: 0, resourceSlots: 7, maxMoons: 18,
    specialFeatures: ['binary_orbit', 'tidal_forces', 'roche_limit', 'complex_moon_system'],
    rarity: 'epic',
  },
  {
    id: 'J3', name: 'Rogue Jovian', classId: 'J', subclassId: 'J3', subclassCode: 'Drifter',
    category: 'gas', subcategory: 'strategic',
    description: 'Gas giant ejected from its system, drifting through interstellar space',
    diameter: 150000, mass: 400, gravity: 2.8, atmosphereType: 'hydrogen-helium',
    atmosphereComposition: { hydrogen: 90, helium: 9, deuterium: 0.5, other: 0.5 },
    surfacePressure: 1000, temperature: -200, temperatureMin: -220, temperatureMax: -150,
    waterPercent: 0, habitabilityRating: 0, resourceSlots: 5, maxMoons: 10,
    specialFeatures: ['interstellar_drift', 'frozen_moons', 'dark_approach', 'gravitational_lensing'],
    rarity: 'epic',
  },

  // ==================== Class I Types (4) ====================
  {
    id: 'I0', name: 'Neptune Analog', classId: 'I', subclassId: 'I0', subclassCode: 'Standard',
    category: 'gas', subcategory: 'crystal-rich',
    description: 'Standard ice giant with blue methane atmosphere',
    diameter: 48000, mass: 17, gravity: 1.1, atmosphereType: 'hydrogen-helium-methane',
    atmosphereComposition: { hydrogen: 80, helium: 15, methane: 4, other: 1 },
    surfacePressure: 100, temperature: -200, temperatureMin: -220, temperatureMax: -100,
    waterPercent: 0, habitabilityRating: 2, resourceSlots: 5, maxMoons: 8,
    specialFeatures: ['blue_atmosphere', 'methane_clouds', 'great_dark_spot', 'diamond_rain'],
    rarity: 'uncommon',
  },
  {
    id: 'I1', name: 'Diamond World', classId: 'I', subclassId: 'I1', subclassCode: 'Crystalline',
    category: 'gas', subcategory: 'crystal-rich',
    description: 'Ice giant with extreme internal pressure creating diamond precipitation',
    diameter: 50000, mass: 20, gravity: 1.2, atmosphereType: 'hydrogen-helium-methane',
    atmosphereComposition: { hydrogen: 75, helium: 18, methane: 6, other: 1 },
    surfacePressure: 200, temperature: -180, temperatureMin: -210, temperatureMax: -80,
    waterPercent: 0, habitabilityRating: 1, resourceSlots: 6, maxMoons: 6,
    specialFeatures: ['diamond_rain', 'exotic_ice', 'crystal_formation', 'deep_harvesting'],
    rarity: 'rare',
  },
  {
    id: 'I2', name: 'Uranus Analog', classId: 'I', subclassId: 'I2', subclassCode: 'Tilted',
    category: 'gas', subcategory: 'energy-rich',
    description: 'Ice giant with extreme axial tilt, rolling through its orbit',
    diameter: 45000, mass: 14, gravity: 0.9, atmosphereType: 'hydrogen-helium-methane',
    atmosphereComposition: { hydrogen: 82, helium: 15, methane: 2, other: 1 },
    surfacePressure: 80, temperature: -210, temperatureMin: -224, temperatureMax: -150,
    waterPercent: 0, habitabilityRating: 1, resourceSlots: 5, maxMoons: 5,
    specialFeatures: ['extreme_tilt', 'retrograde_rotation', 'methane_haze', 'ice_mantle'],
    rarity: 'uncommon',
  },
  {
    id: 'I3', name: 'Helium Giant', classId: 'I', subclassId: 'I3', subclassCode: 'Degenerate',
    category: 'gas', subcategory: 'energy-rich',
    description: 'Unusual ice giant enriched in helium from stellar evolution',
    diameter: 40000, mass: 12, gravity: 1.0, atmosphereType: 'hydrogen-helium',
    atmosphereComposition: { hydrogen: 50, helium: 45, methane: 4, other: 1 },
    surfacePressure: 150, temperature: -170, temperatureMin: -200, temperatureMax: -60,
    waterPercent: 0, habitabilityRating: 0, resourceSlots: 5, maxMoons: 5,
    specialFeatures: ['helium_rain', 'degenerate_matter', 'unusual_composition', 'stellar_evolution'],
    rarity: 'rare',
  },

  // ==================== Class H Types (5) ====================
  {
    id: 'H0', name: 'Chthonian', classId: 'H', subclassId: 'H0', subclassCode: 'Stripped',
    category: 'hostile', subcategory: 'mineral-rich',
    description: 'Stripped core of a gas giant with exposed metallic hydrogen',
    diameter: 12000, mass: 1.5, gravity: 1.3, atmosphereType: 'trace',
    atmosphereComposition: { hydrogen: 60, helium: 30, other: 10 },
    surfacePressure: 0.05, temperature: 500, temperatureMin: 300, temperatureMax: 2000,
    waterPercent: 0, habitabilityRating: 0, resourceSlots: 9, maxMoons: 0,
    specialFeatures: ['exposed_core', 'metallic_hydrogen', 'extreme_density', 'stellar_scrubbed'],
    rarity: 'epic',
  },
  {
    id: 'H1', name: 'Radiation World', classId: 'H', subclassId: 'H1', subclassCode: 'Irradiated',
    category: 'hostile', subcategory: 'strategic',
    description: 'World bathed in lethal stellar radiation from nearby pulsar or flare star',
    diameter: 8000, mass: 0.45, gravity: 0.68, atmosphereType: 'trace',
    atmosphereComposition: { nitrogen: 50, oxygen: 30, other: 20 },
    surfacePressure: 0.1, temperature: 100, temperatureMin: -50, temperatureMax: 300,
    waterPercent: 0, habitabilityRating: 0, resourceSlots: 6, maxMoons: 0,
    specialFeatures: ['lethal_radiation', 'ionized_surface', 'plasma_storms', 'sterilized_ground'],
    rarity: 'rare',
  },
  {
    id: 'H2', name: 'Crushed World', classId: 'H', subclassId: 'H2', subclassCode: 'Dense',
    category: 'hostile', subcategory: 'mineral-rich',
    description: 'Extremely dense world with crushing gravity and exotic matter',
    diameter: 6000, mass: 2.0, gravity: 1.5, atmosphereType: 'trace',
    atmosphereComposition: { other: 100 },
    surfacePressure: 0.001, temperature: -30, temperatureMin: -100, temperatureMax: 50,
    waterPercent: 0, habitabilityRating: 0, resourceSlots: 8, maxMoons: 0,
    specialFeatures: ['crushing_gravity', 'exotic_matter', 'degenerate_core', 'heavy_element_rich'],
    rarity: 'rare',
  },
  {
    id: 'H3', name: 'Tidally Devastated', classId: 'H', subclassId: 'H3', subclassCode: 'Shredded',
    category: 'hostile', subcategory: 'strategic',
    description: 'World being torn apart by tidal forces from a nearby massive object',
    diameter: 7000, mass: 0.35, gravity: 0.6, atmosphereType: 'trace',
    atmosphereComposition: { nitrogen: 40, sulfur: 30, other: 30 },
    surfacePressure: 0.02, temperature: 80, temperatureMin: -20, temperatureMax: 200,
    waterPercent: 5, habitabilityRating: 0, resourceSlots: 7, maxMoons: 0,
    specialFeatures: ['tidal_shredding', 'volcanic_bombardment', 'orbital_decay', 'molten_surface'],
    rarity: 'epic',
  },
  {
    id: 'H4', name: 'Dead Zone', classId: 'H', subclassId: 'H4', subclassCode: 'Necrosphere',
    category: 'hostile', subcategory: 'precursor',
    description: 'Ancient dead world with no magnetic field and stripped atmosphere',
    diameter: 9000, mass: 0.5, gravity: 0.72, atmosphereType: 'trace',
    atmosphereComposition: { argon: 60, carbonDioxide: 30, other: 10 },
    surfacePressure: 0.03, temperature: -40, temperatureMin: -130, temperatureMax: 60,
    waterPercent: 0, habitabilityRating: 0, resourceSlots: 6, maxMoons: 0,
    specialFeatures: ['dead_surface', 'ancient_ruins', 'stripped_mantle', 'precursor_burial'],
    rarity: 'rare',
  },

  // ==================== Class N Types (5) ====================
  {
    id: 'N0', name: 'Acid World', classId: 'N', subclassId: 'N0', subclassCode: 'Corrosive',
    category: 'hostile', subcategory: 'mineral-rich',
    description: 'World with sulfuric acid rain and corrosive surface chemistry',
    diameter: 10000, mass: 0.65, gravity: 0.82, atmosphereType: 'toxic-sulfur',
    atmosphereComposition: { carbonDioxide: 85, nitrogen: 10, sulfurDioxide: 4, other: 1 },
    surfacePressure: 0.9, temperature: 300, temperatureMin: 250, temperatureMax: 400,
    waterPercent: 0, habitabilityRating: 0, resourceSlots: 6, maxMoons: 0,
    specialFeatures: ['sulfuric_acid', 'corrosive_surface', 'lead_clouds', 'chemical_storms'],
    rarity: 'uncommon',
  },
  {
    id: 'N1', name: 'Ammonia World', classId: 'N', subclassId: 'N1', subclassCode: 'Basic',
    category: 'hostile', subcategory: 'energy-rich',
    description: 'World with ammonia-dominated atmosphere and liquid ammonia lakes',
    diameter: 9000, mass: 0.5, gravity: 0.72, atmosphereType: 'toxic-sulfur',
    atmosphereComposition: { nitrogen: 60, ammonia: 30, hydrogen: 8, other: 2 },
    surfacePressure: 0.6, temperature: -60, temperatureMin: -100, temperatureMax: -30,
    waterPercent: 0, habitabilityRating: 0, resourceSlots: 5, maxMoons: 1,
    specialFeatures: ['ammonia_atmosphere', 'ammonia_lakes', 'nitrogen_ice', 'chemical_cycles'],
    rarity: 'uncommon',
  },
  {
    id: 'N2', name: 'Chlorine World', classId: 'N', subclassId: 'N2', subclassCode: 'Halogen',
    category: 'hostile', subcategory: 'strategic',
    description: 'World with chlorine-rich atmosphere and toxic mineral deposits',
    diameter: 8500, mass: 0.45, gravity: 0.68, atmosphereType: 'corrosive',
    atmosphereComposition: { chlorine: 40, nitrogen: 30, carbonDioxide: 20, other: 10 },
    surfacePressure: 0.5, temperature: 40, temperatureMin: -10, temperatureMax: 70,
    waterPercent: 5, habitabilityRating: 0, resourceSlots: 7, maxMoons: 0,
    specialFeatures: ['chlorine_gas', 'toxic_minerals', 'corrosive_rain', 'halogen_deposits'],
    rarity: 'rare',
  },
  {
    id: 'N3', name: 'Phosphine World', classId: 'N', subclassId: 'N3', subclassCode: 'Toxic',
    category: 'hostile', subcategory: 'energy-rich',
    description: 'World with phosphine-rich atmosphere and toxic surface chemistry',
    diameter: 9500, mass: 0.55, gravity: 0.76, atmosphereType: 'toxic-sulfur',
    atmosphereComposition: { nitrogen: 55, phosphine: 25, methane: 15, other: 5 },
    surfacePressure: 0.55, temperature: 20, temperatureMin: -30, temperatureMax: 60,
    waterPercent: 10, habitabilityRating: 0, resourceSlots: 5, maxMoons: 1,
    specialFeatures: ['phosphine_gas', 'toxic_clouds', 'phosphorus_deposits', 'chemical_weathering'],
    rarity: 'uncommon',
  },
  {
    id: 'N4', name: 'Cyanide World', classId: 'N', subclassId: 'N4', subclassCode: 'Lethal',
    category: 'hostile', subcategory: 'strategic',
    description: 'World with hydrogen cyanide atmosphere and toxic organic chemistry',
    diameter: 8000, mass: 0.4, gravity: 0.65, atmosphereType: 'corrosive',
    atmosphereComposition: { nitrogen: 50, hydrogen_cyanide: 30, methane: 15, other: 5 },
    surfacePressure: 0.4, temperature: 25, temperatureMin: -20, temperatureMax: 55,
    waterPercent: 15, habitabilityRating: 0, resourceSlots: 6, maxMoons: 0,
    specialFeatures: ['hydrogen_cyanide', 'toxic_organics', 'lethal_chemistry', 'prebiotic_molecules'],
    rarity: 'rare',
  },

  // ==================== Special Types (3) ====================
  {
    id: 'X0', name: 'Ringworld', classId: 'M', subclassId: 'X0', subclassCode: 'Megastructure',
    category: 'special', subcategory: 'precursor',
    description: 'Artificial ring-shaped megastructure with engineered habitable environment',
    diameter: 3000000, mass: 1000000, gravity: 1.0, atmosphereType: 'artificial',
    atmosphereComposition: { nitrogen: 78, oxygen: 21, argon: 0.9, other: 0.1 },
    surfacePressure: 1.0, temperature: 20, temperatureMin: -10, temperatureMax: 40,
    waterPercent: 60, habitabilityRating: 100, resourceSlots: 10, maxMoons: 0,
    specialFeatures: ['artificial_ecosystem', 'ancient_tech', 'massive_scale', 'perfect_climate'],
    rarity: 'legendary',
  },
  {
    id: 'X1', name: 'Dyson Fragment', classId: 'G', subclassId: 'X1', subclassCode: 'Ruins',
    category: 'special', subcategory: 'precursor',
    description: 'Fragment of a partially constructed Dyson sphere around a star',
    diameter: 500000, mass: 50000, gravity: 0.5, atmosphereType: 'artificial',
    atmosphereComposition: { nitrogen: 70, oxygen: 25, other: 5 },
    surfacePressure: 0.8, temperature: 30, temperatureMin: -20, temperatureMax: 60,
    waterPercent: 30, habitabilityRating: 60, resourceSlots: 9, maxMoons: 0,
    specialFeatures: ['alien_megastructure', 'partial_construction', 'energy_harvesting', 'ancient_ai'],
    rarity: 'legendary',
  },
  {
    id: 'X2', name: 'Precursor Relic', classId: 'R', subclassId: 'X2', subclassCode: 'Ancient',
    category: 'special', subcategory: 'precursor',
    description: 'Ancient alien world converted into a planetary-scale computing device',
    diameter: 11000, mass: 0.8, gravity: 0.9, atmosphereType: 'artificial',
    atmosphereComposition: { nitrogen: 60, oxygen: 30, exotic: 10 },
    surfacePressure: 1.0, temperature: 18, temperatureMin: 5, temperatureMax: 30,
    waterPercent: 40, habitabilityRating: 50, resourceSlots: 8, maxMoons: 0,
    specialFeatures: ['planetary_computer', 'ancient_tech', 'nanotech_surface', 'quantum_core'],
    rarity: 'legendary',
  },
] as const;

// ============================================================================
// STAR TREK PLANET NAMES
// ============================================================================

export const STAR_TREK_PLANET_NAMES = [
  'Vulcan', 'Risa', 'Romulus', 'Qo\'noS', 'Bajor', 'Ferenginar',
  'Andoria', 'Tellar', 'Trill', 'Betazed', 'Cardassia', 'Breen',
  'Tholia', 'Gorn', 'Orion', 'Nimbus III', 'Rigel', 'Denobula',
  'Xyrillian', 'Ilaria', 'Vega', 'Tau Ceti IV', 'Aldebaran III',
  'Altair IV', 'Sirius IX', 'Proxima Centauri b', 'Alpha Centauri III',
  'Arret', 'Exo III', 'Deneva', 'Cestus III', 'Rigel VII',
  'Talos IV', 'M-113', 'Vaalel', 'Vandermeer', 'Merak II',
  'Sauria', 'Mintaka III', 'Alnilam II', 'Alnitak IV',
  'Regulus V', 'Pollux IV', 'Castor VI', 'Arcturus III',
  'Capella IV', 'K HttpNotFound', 'Epsilon Eridani III',
  'Wolf 359 IV', 'Barnard\'s Star II', 'Sirius VI',
  'Lave', 'Leesti', 'Diso', 'Tionisla', 'Riedquat',
  'Alioth', 'Mizar', 'Alcor V', 'Dubhe IX', 'Merak VI',
  'Phecda II', 'Megrez III', 'Alioth IV', 'Mizar VIII',
  'Alkaid IX', 'Nashira IV', 'Sualocin III', 'Rotanev II',
  'Markab V', 'Scheat VI', 'Algenib III', 'Enif VIII',
  'Fomalhaut IV', 'Achernar VI', 'Acrux III', 'Gacrux V',
  'Mimosa IV', 'Shaula III', 'Lesath II', 'Sargas VI',
  'Kornephoros IV', 'Zubeneschamali III', 'Dschubba II',
  'Acrab V', 'Wei II', 'Deneb Algedi VI', 'Nashira III',
  'Sadelain II', 'Enif VI', 'Scheat IV', 'Markab IV',
  'Algenib IV', 'Fomalhaut V', 'Achernar VII', 'Acrux IV',
] as const;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get planet size class from diameter in km
 */
export function getPlanetSizeClass(diameter: number): PlanetSizeClass {
  for (const sizeClass of PLANET_SIZE_CLASSES) {
    if (diameter >= sizeClass.minDiameter && diameter <= sizeClass.maxDiameter) {
      return sizeClass;
    }
  }
  return PLANET_SIZE_CLASSES[PLANET_SIZE_CLASSES.length - 1];
}

/**
 * Generate a unique planet ID
 * Format: "G001-S01-S001-P01"
 */
export function generatePlanetId(
  galaxy: number,
  sector: number,
  system: number,
  orbit: number
): string {
  const g = String(galaxy).padStart(3, '0');
  const s = String(sector).padStart(2, '0');
  const sys = String(system).padStart(3, '0');
  const p = String(orbit).padStart(2, '0');
  return `G${g}-S${s}-S${sys}-P${p}`;
}

/**
 * Get a Star Trek-style display name for a classified planet
 */
export function getPlanetDisplayName(
  classification: PlanetClassification,
  index: number
): string {
  const baseName = STAR_TREK_PLANET_NAMES[index % STAR_TREK_PLANET_NAMES.length];
  const suffix = classification.classId === 'M' ? ''
    : classification.classId === 'G' ? ' Gamma'
    : classification.classId === 'D' ? ' Delta'
    : classification.classId === 'R' ? ' Rho'
    : classification.classId === 'V' ? ' Vulkan'
    : classification.classId === 'T' ? ' Theta'
    : classification.classId === 'A' ? ' Alpha'
    : classification.classId === 'K' ? ' Kappa'
    : classification.classId === 'J' ? ' Jura'
    : classification.classId === 'I' ? ' Iota'
    : classification.classId === 'H' ? ' Horus'
    : classification.classId === 'N' ? ' Nyx'
    : '';
  return `${baseName}${suffix}`;
}

/**
 * Classify a planet from raw physical parameters
 */
export function classifyPlanet(params: {
  diameter: number;
  mass: number;
  gravity: number;
  atmosphereType: AtmosphereType;
  temperature: number;
  waterPercent: number;
  habitabilityRating: number;
}): PlanetClassification {
  const { diameter, gravity, atmosphereType, temperature, waterPercent, habitabilityRating } = params;

  for (const classification of PLANET_CLASSIFICATIONS) {
    const diameterMatch = diameter >= classification.diameterRange.min && diameter <= classification.diameterRange.max;
    const gravityMatch = gravity >= classification.gravityRange.min && gravity <= classification.gravityRange.max;
    const tempMatch = temperature >= classification.temperatureRange.min && temperature <= classification.temperatureRange.max;
    const waterMatch = waterPercent >= classification.waterPercent.min && waterPercent <= classification.waterPercent.max;
    const habitMatch = habitabilityRating >= classification.habitabilityRating.min && habitabilityRating <= classification.habitabilityRating.max;

    if (diameterMatch && gravityMatch && tempMatch && waterMatch && habitMatch) {
      return classification;
    }
  }

  // Fallback to Class K (Marginal) if no match
  return PLANET_CLASSIFICATIONS.find(c => c.classId === 'K')!;
}

/**
 * Get a planet catalog entry by ID
 */
export function getPlanetCatalogEntry(id: string): PlanetCatalogEntry | undefined {
  return PLANET_CATALOG.find(p => p.id === id);
}

/**
 * Get all planet entries for a given class
 */
export function getPlanetsByClass(classId: PlanetClassId): readonly PlanetCatalogEntry[] {
  return PLANET_CATALOG.filter(p => p.classId === classId);
}

/**
 * Get all planet entries for a given category
 */
export function getPlanetsByCategory(category: PlanetCategory): readonly PlanetCatalogEntry[] {
  return PLANET_CATALOG.filter(p => p.category === category);
}

/**
 * Get all planet entries for a given subcategory
 */
export function getPlanetsBySubcategory(subcategory: PlanetSubcategory): readonly PlanetCatalogEntry[] {
  return PLANET_CATALOG.filter(p => p.subcategory === subcategory);
}

/**
 * Get all habitable planet entries
 */
export function getHabitablePlanets(): readonly PlanetCatalogEntry[] {
  return PLANET_CATALOG.filter(p => p.habitabilityRating >= 30);
}

/**
 * Get all planets with high resource slots
 */
export function getResourceRichPlanets(): readonly PlanetCatalogEntry[] {
  return PLANET_CATALOG.filter(p => p.resourceSlots >= 7);
}

/**
 * Get a random Star Trek planet name
 */
export function getRandomPlanetName(): string {
  return STAR_TREK_PLANET_NAMES[Math.floor(Math.random() * STAR_TREK_PLANET_NAMES.length)];
}
