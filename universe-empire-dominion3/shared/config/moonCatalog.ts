/**
 * Star Trek-Inspired Moon Classification System
 * 20+ moon types with full classification, properties, and utility functions
 * @tag #moons #classification #universe #star-trek
 */

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export type MoonClassId =
  | 'Terrestrial'   // Rocky moons with solid surfaces
  | 'Ice'           // Frozen moons with ice shells
  | 'Volcanic'      // Moons with active volcanism
  | 'Gas-moon'      // Gas-rich moons or captured atmospheres
  | 'Captured'      // Captured asteroids or irregular bodies
  | 'Artificial'    // Constructed moons or megastructures
  | 'Dwarf'         // Small dwarf moons
  | 'Rogue';        // Unbound or ejected moons

export type MoonSubclassId =
  // Terrestrial subclasses
  | 'Large-terrestrial'
  | 'Small-terrestrial'
  | 'Habitable-terrestrial'
  | 'Barren-terrestrial'
  // Ice subclasses
  | 'Surface-ice'
  | 'Deep-ice'
  | 'Ice-volcanic'
  // Volcanic subclasses
  | 'Active-volcanic'
  | 'Dormant-volcanic'
  | 'Cryovolcanic'
  // Gas-moon subclasses
  | 'Sub-atmospheric'
  | 'Dense-atmospheric'
  // Captured subclasses
  | 'Irregular-captured'
  | 'Binary-captured'
  // Artificial subclasses
  | 'Orbital-habitat'
  | 'Defense-platform'
  // Dwarf subclasses
  | 'Micro-dwarf'
  | 'Binary-dwarf'
  // Rogue subclasses
  | 'Free-floating'
  | 'Interstellar-rogue';

export type MoonCategory =
  | 'habitable'
  | 'mineral'
  | 'volatile'
  | 'gas'
  | 'barren'
  | 'artificial';

export type MoonSizeClassId = 'Micro' | 'Small' | 'Medium' | 'Large' | 'Major' | 'Mega';

export interface MoonSizeClass {
  readonly id: MoonSizeClassId;
  readonly name: string;
  readonly minDiameter: number;
  readonly maxDiameter: number;
  readonly description: string;
}

export interface MoonClassification {
  readonly classId: MoonClassId;
  readonly className: string;
  readonly subclasses: readonly MoonSubclassId[];
  readonly category: MoonCategory;
  readonly description: string;
  readonly diameterRange: { readonly min: number; readonly max: number };
  readonly gravityRange: { readonly min: number; readonly max: number };
  readonly atmosphereType: 'none' | 'trace' | 'thin' | 'moderate' | 'dense';
  readonly temperatureRange: { readonly min: number; readonly max: number };
  readonly habitabilityRating: { readonly min: number; readonly max: number };
  readonly resourceSlots: number;
  readonly specialFeatures: readonly string[];
}

export interface MoonCatalogEntry {
  readonly id: string;
  readonly name: string;
  readonly classId: MoonClassId;
  readonly subclassId: MoonSubclassId;
  readonly category: MoonCategory;
  readonly description: string;
  readonly diameter: number;
  readonly gravity: number;
  readonly atmosphereType: 'none' | 'trace' | 'thin' | 'moderate' | 'dense';
  readonly atmosphereComposition: Readonly<Record<string, number>>;
  readonly temperature: number;
  readonly temperatureMin: number;
  readonly temperatureMax: number;
  readonly habitabilityRating: number;
  readonly resourceSlots: number;
  readonly specialFeatures: readonly string[];
  readonly rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

// ============================================================================
// MOON SIZE CLASSIFICATIONS
// ============================================================================

export const MOON_SIZE_CLASSES: readonly MoonSizeClass[] = [
  { id: 'Micro', name: 'Micro', minDiameter: 0, maxDiameter: 100, description: 'Tiny moonlets and captured debris' },
  { id: 'Small', name: 'Small', minDiameter: 100, maxDiameter: 500, description: 'Small captured asteroids' },
  { id: 'Medium', name: 'Medium', minDiameter: 500, maxDiameter: 2000, description: 'Moon-sized bodies like Ceres to Titan' },
  { id: 'Large', name: 'Large', minDiameter: 2000, maxDiameter: 5000, description: 'Large moons like Luna to Callisto' },
  { id: 'Major', name: 'Major', minDiameter: 5000, maxDiameter: 10000, description: 'Major moons like Ganymede and Titan' },
  { id: 'Mega', name: 'Mega', minDiameter: 10000, maxDiameter: 50000, description: 'Super-moons exceeding Titan size' },
] as const;

// ============================================================================
// MOON CLASSIFICATIONS (8 Primary Classes)
// ============================================================================

export const MOON_CLASSIFICATIONS: readonly MoonClassification[] = [
  // ========== Terrestrial ==========
  {
    classId: 'Terrestrial',
    className: 'Terrestrial Moon',
    subclasses: ['Large-terrestrial', 'Small-terrestrial', 'Habitable-terrestrial', 'Barren-terrestrial'],
    category: 'mineral',
    description: 'Rocky moons with solid surfaces, thin atmospheres, and mineral deposits',
    diameterRange: { min: 200, max: 8000 },
    gravityRange: { min: 0.05, max: 0.9 },
    atmosphereType: 'thin',
    temperatureRange: { min: -180, max: 80 },
    habitabilityRating: { min: 0, max: 70 },
    resourceSlots: 4,
    specialFeatures: ['solid_surface', 'thin_atmosphere', 'mineral_deposits', 'cratered_terrain'],
  },
  // ========== Ice ==========
  {
    classId: 'Ice',
    className: 'Ice Moon',
    subclasses: ['Surface-ice', 'Deep-ice', 'Ice-volcanic'],
    category: 'volatile',
    description: 'Frozen moons with water ice surfaces and potential subsurface oceans',
    diameterRange: { min: 100, max: 6000 },
    gravityRange: { min: 0.02, max: 0.5 },
    atmosphereType: 'trace',
    temperatureRange: { min: -220, max: -80 },
    habitabilityRating: { min: 0, max: 40 },
    resourceSlots: 5,
    specialFeatures: ['water_ice', 'subsurface_ocean', 'geysers', 'cryogenic_deposits'],
  },
  // ========== Volcanic ==========
  {
    classId: 'Volcanic',
    className: 'Volcanic Moon',
    subclasses: ['Active-volcanic', 'Dormant-volcanic', 'Cryovolcanic'],
    category: 'mineral',
    description: 'Moons with active volcanism, lava flows, and geothermal energy',
    diameterRange: { min: 300, max: 5000 },
    gravityRange: { min: 0.03, max: 0.4 },
    atmosphereType: 'trace',
    temperatureRange: { min: -50, max: 400 },
    habitabilityRating: { min: 0, max: 15 },
    resourceSlots: 6,
    specialFeatures: ['active_volcanism', 'lava_flows', 'sulfur_deposits', 'geothermal_energy'],
  },
  // ========== Gas-moon ==========
  {
    classId: 'Gas-moon',
    className: 'Gas Moon',
    subclasses: ['Sub-atmospheric', 'Dense-atmospheric'],
    category: 'gas',
    description: 'Moons with significant atmospheres or gas envelopes',
    diameterRange: { min: 500, max: 5000 },
    gravityRange: { min: 0.1, max: 0.6 },
    atmosphereType: 'moderate',
    temperatureRange: { min: -180, max: 50 },
    habitabilityRating: { min: 0, max: 10 },
    resourceSlots: 4,
    specialFeatures: ['significant_atmosphere', 'gas_harvesting', 'volatile_compounds'],
  },
  // ========== Captured ==========
  {
    classId: 'Captured',
    className: 'Captured Moon',
    subclasses: ['Irregular-captured', 'Binary-captured'],
    category: 'barren',
    description: 'Captured asteroids or irregular bodies in non-standard orbits',
    diameterRange: { min: 10, max: 2000 },
    gravityRange: { min: 0.001, max: 0.2 },
    atmosphereType: 'none',
    temperatureRange: { min: -200, max: 100 },
    habitabilityRating: { min: 0, max: 5 },
    resourceSlots: 3,
    specialFeatures: ['irregular_orbit', 'retrograde_motion', 'exotic_composition', 'instability'],
  },
  // ========== Artificial ==========
  {
    classId: 'Artificial',
    className: 'Artificial Moon',
    subclasses: ['Orbital-habitat', 'Defense-platform'],
    category: 'artificial',
    description: 'Constructed orbital habitats, stations, or megastructures',
    diameterRange: { min: 1, max: 500 },
    gravityRange: { min: 0.1, max: 1.0 },
    atmosphereType: 'dense',
    temperatureRange: { min: 15, max: 25 },
    habitabilityRating: { min: 50, max: 100 },
    resourceSlots: 6,
    specialFeatures: ['advanced_tech', 'self_sustaining', 'unknown_origin', 'orbital_habitat'],
  },
  // ========== Dwarf ==========
  {
    classId: 'Dwarf',
    className: 'Dwarf Moon',
    subclasses: ['Micro-dwarf', 'Binary-dwarf'],
    category: 'barren',
    description: 'Tiny irregular moons too small for significant gravity',
    diameterRange: { min: 1, max: 200 },
    gravityRange: { min: 0.0001, max: 0.02 },
    atmosphereType: 'none',
    temperatureRange: { min: -220, max: 120 },
    habitabilityRating: { min: 0, max: 0 },
    resourceSlots: 1,
    specialFeatures: ['tiny_size', 'irregular_shape', 'low_gravity', 'tumbling_rotation'],
  },
  // ========== Rogue ==========
  {
    classId: 'Rogue',
    className: 'Rogue Moon',
    subclasses: ['Free-floating', 'Interstellar-rogue'],
    category: 'barren',
    description: 'Unbound moons ejected from their parent systems into interstellar space',
    diameterRange: { min: 50, max: 4000 },
    gravityRange: { min: 0.01, max: 0.3 },
    atmosphereType: 'trace',
    temperatureRange: { min: -250, max: -100 },
    habitabilityRating: { min: 0, max: 3 },
    resourceSlots: 3,
    specialFeatures: ['no_parent_star', 'interstellar_drift', 'frozen_surface', 'dark_approach'],
  },
] as const;

// ============================================================================
// MOON CATALOG (20+ Individual Types)
// ============================================================================

export const MOON_CATALOG: readonly MoonCatalogEntry[] = [
  // ==================== Terrestrial Types (5) ====================
  {
    id: 'T-LT', name: 'Lunar Analog', classId: 'Terrestrial', subclassId: 'Large-terrestrial',
    category: 'mineral',
    description: 'Large cratered rocky moon similar to Earth\'s Luna',
    diameter: 3474, gravity: 0.165, atmosphereType: 'none',
    atmosphereComposition: {},
    temperature: -20, temperatureMin: -173, temperatureMax: 127,
    habitabilityRating: 5, resourceSlots: 3,
    specialFeatures: ['cratered_surface', 'regolith', 'helium_3_deposits', 'low_dust'],
    rarity: 'common',
  },
  {
    id: 'T-ST', name: 'Mineria', classId: 'Terrestrial', subclassId: 'Small-terrestrial',
    category: 'mineral',
    description: 'Small rocky moon rich in surface metals',
    diameter: 1200, gravity: 0.08, atmosphereType: 'none',
    atmosphereComposition: {},
    temperature: -40, temperatureMin: -150, temperatureMax: 80,
    habitabilityRating: 2, resourceSlots: 4,
    specialFeatures: ['metal_rich', 'cratered', 'low_gravity_mining', 'rare_minerals'],
    rarity: 'uncommon',
  },
  {
    id: 'T-HT', name: 'Terra Nova', classId: 'Terrestrial', subclassId: 'Habitable-terrestrial',
    category: 'habitable',
    description: 'Rare habitable moon with thin breathable atmosphere and liquid water',
    diameter: 4500, gravity: 0.35, atmosphereType: 'thin',
    atmosphereComposition: { nitrogen: 78, oxygen: 20, argon: 1.5, other: 0.5 },
    temperature: 10, temperatureMin: -20, temperatureMax: 35,
    habitabilityRating: 65, resourceSlots: 4,
    specialFeatures: ['thin_atmosphere', 'liquid_water', 'native_life', 'habitable'],
    rarity: 'rare',
  },
  {
    id: 'T-BT', name: 'Barren Rock', classId: 'Terrestrial', subclassId: 'Barren-terrestrial',
    category: 'barren',
    description: 'Completely barren rocky moon with no atmosphere',
    diameter: 2000, gravity: 0.12, atmosphereType: 'none',
    atmosphereComposition: {},
    temperature: -60, temperatureMin: -180, temperatureMax: 100,
    habitabilityRating: 0, resourceSlots: 2,
    specialFeatures: ['barren_surface', 'cratered', 'no_atmosphere', 'raw_minerals'],
    rarity: 'common',
  },
  {
    id: 'T-CT', name: 'Cavern Moon', classId: 'Terrestrial', subclassId: 'Large-terrestrial',
    category: 'mineral',
    description: 'Rocky moon riddled with underground caverns and crystal formations',
    diameter: 3200, gravity: 0.22, atmosphereType: 'trace',
    atmosphereComposition: { nitrogen: 60, argon: 30, other: 10 },
    temperature: 5, temperatureMin: -30, temperatureMax: 40,
    habitabilityRating: 15, resourceSlots: 5,
    specialFeatures: ['underground_caverns', 'crystal_formations', 'subsurface_lakes', 'bioluminescence'],
    rarity: 'uncommon',
  },

  // ==================== Ice Types (5) ====================
  {
    id: 'I-SI', name: 'Europa-type', classId: 'Ice', subclassId: 'Surface-ice',
    category: 'volatile',
    description: 'Ice-covered moon with smooth surface and potential subsurface ocean',
    diameter: 3100, gravity: 0.134, atmosphereType: 'trace',
    atmosphereComposition: { oxygen: 100 },
    temperature: -160, temperatureMin: -220, temperatureMax: -100,
    habitabilityRating: 20, resourceSlots: 5,
    specialFeatures: ['smooth_ice', 'subsurface_ocean', 'geysers', 'potential_life'],
    rarity: 'uncommon',
  },
  {
    id: 'I-DI', name: 'Enceladus-type', classId: 'Ice', subclassId: 'Deep-ice',
    category: 'volatile',
    description: 'Small icy moon with subsurface water ocean and cryovolcanic plumes',
    diameter: 500, gravity: 0.011, atmosphereType: 'trace',
    atmosphereComposition: { water: 100 },
    temperature: -200, temperatureMin: -240, temperatureMax: -150,
    habitabilityRating: 10, resourceSlots: 4,
    specialFeatures: ['water_geysers', 'plume_activity', 'subsurface_ocean', 'organic_molecules'],
    rarity: 'rare',
  },
  {
    id: 'I-IV', name: 'Cryo-Volcanic', classId: 'Ice', subclassId: 'Ice-volcanic',
    category: 'volatile',
    description: 'Ice moon with cryovolcanism erupting water and ammonia',
    diameter: 1800, gravity: 0.06, atmosphereType: 'trace',
    atmosphereComposition: { water: 70, ammonia: 20, methane: 10 },
    temperature: -170, temperatureMin: -200, temperatureMax: -120,
    habitabilityRating: 5, resourceSlots: 4,
    specialFeatures: ['cryovolcanism', 'ammonia_ice', 'water_eruptions', 'volatile_deposits'],
    rarity: 'uncommon',
  },
  {
    id: 'I-TI', name: 'Titan-type', classId: 'Ice', subclassId: 'Deep-ice',
    category: 'volatile',
    description: 'Large icy moon with thick nitrogen atmosphere and methane lakes',
    diameter: 5150, gravity: 0.14, atmosphereType: 'moderate',
    atmosphereComposition: { nitrogen: 95, methane: 5 },
    temperature: -180, temperatureMin: -200, temperatureMax: -140,
    habitabilityRating: 25, resourceSlots: 5,
    specialFeatures: ['thick_atmosphere', 'methane_lakes', 'hydrocarbon_rains', 'prebiotic_chemistry'],
    rarity: 'rare',
  },
  {
    id: 'I-MI', name: 'Methane Ice', classId: 'Ice', subclassId: 'Surface-ice',
    category: 'volatile',
    description: 'Frozen moon covered in methane and ethane ice layers',
    diameter: 2200, gravity: 0.08, atmosphereType: 'trace',
    atmosphereComposition: { methane: 80, nitrogen: 15, ethane: 5 },
    temperature: -190, temperatureMin: -220, temperatureMax: -160,
    habitabilityRating: 2, resourceSlots: 4,
    specialFeatures: ['methane_ice', 'ethane_frost', 'hydrocarbon_deposits', 'cryogenic_minerals'],
    rarity: 'uncommon',
  },

  // ==================== Volcanic Types (4) ====================
  {
    id: 'V-AV', name: 'Io-type', classId: 'Volcanic', subclassId: 'Active-volcanic',
    category: 'mineral',
    description: 'Hyperactive volcanic moon with sulfur-covered surface and lava flows',
    diameter: 3640, gravity: 0.183, atmosphereType: 'trace',
    atmosphereComposition: { sulfurDioxide: 100 },
    temperature: 80, temperatureMin: -100, temperatureMax: 200,
    habitabilityRating: 3, resourceSlots: 6,
    specialFeatures: ['active_volcanoes', 'sulfur_vaults', 'lava_lakes', 'tidal_heating'],
    rarity: 'uncommon',
  },
  {
    id: 'V-DV', name: 'Dormant Volcanic', classId: 'Volcanic', subclassId: 'Dormant-volcanic',
    category: 'mineral',
    description: 'Volcanic moon in dormancy with ancient lava tubes and mineral deposits',
    diameter: 2800, gravity: 0.12, atmosphereType: 'trace',
    atmosphereComposition: { argon: 60, nitrogen: 30, other: 10 },
    temperature: 20, temperatureMin: -80, temperatureMax: 100,
    habitabilityRating: 8, resourceSlots: 5,
    specialFeatures: ['lava_tubes', 'dormant_volcanoes', 'mineral_deposits', 'ancient_flows'],
    rarity: 'common',
  },
  {
    id: 'V-CV', name: 'Cryovolcanic', classId: 'Volcanic', subclassId: 'Cryovolcanic',
    category: 'volatile',
    description: 'Moon with cryovolcanoes erupting water, ammonia, and methane',
    diameter: 1500, gravity: 0.04, atmosphereType: 'trace',
    atmosphereComposition: { nitrogen: 50, water: 30, methane: 20 },
    temperature: -150, temperatureMin: -200, temperatureMax: -80,
    habitabilityRating: 5, resourceSlots: 4,
    specialFeatures: ['cryovolcanic_peaks', 'water_geysers', 'ammonia_flows', 'volatile_surface'],
    rarity: 'uncommon',
  },
  {
    id: 'V-HV', name: 'Hydrovolcanic', classId: 'Volcanic', subclassId: 'Active-volcanic',
    category: 'mineral',
    description: 'Volcanic moon with water-magma interactions and steam geysers',
    diameter: 2200, gravity: 0.09, atmosphereType: 'thin',
    atmosphereComposition: { waterVapor: 60, sulfurDioxide: 30, other: 10 },
    temperature: 50, temperatureMin: -30, temperatureMax: 150,
    habitabilityRating: 10, resourceSlots: 5,
    specialFeatures: ['hydrovolcanism', 'steam_geysers', 'mineral_hot_springs', 'unique_chemistry'],
    rarity: 'rare',
  },

  // ==================== Gas-moon Types (2) ====================
  {
    id: 'G-SA', name: 'Sub-Atmospheric', classId: 'Gas-moon', subclassId: 'Sub-atmospheric',
    category: 'gas',
    description: 'Moon with thin but significant atmosphere from volcanic outgassing',
    diameter: 2000, gravity: 0.08, atmosphereType: 'thin',
    atmosphereComposition: { nitrogen: 50, methane: 30, argon: 15, other: 5 },
    temperature: -100, temperatureMin: -180, temperatureMax: -20,
    habitabilityRating: 3, resourceSlots: 3,
    specialFeatures: ['thin_atmosphere', 'outgassing', 'volatile_compounds', 'faint_haze'],
    rarity: 'common',
  },
  {
    id: 'G-DA', name: 'Dense Atmospheric', classId: 'Gas-moon', subclassId: 'Dense-atmospheric',
    category: 'gas',
    description: 'Moon with surprisingly thick atmosphere, possibly from captured gas',
    diameter: 3500, gravity: 0.25, atmosphereType: 'dense',
    atmosphereComposition: { nitrogen: 70, methane: 20, hydrogen: 8, other: 2 },
    temperature: -80, temperatureMin: -150, temperatureMax: 0,
    habitabilityRating: 5, resourceSlots: 4,
    specialFeatures: ['thick_atmosphere', 'gas_harvesting', 'atmospheric_pressure', 'cloud_layers'],
    rarity: 'rare',
  },

  // ==================== Captured Types (2) ====================
  {
    id: 'C-IC', name: 'Irregular Captured', classId: 'Captured', subclassId: 'Irregular-captured',
    category: 'barren',
    description: 'Captured asteroid in irregular, often retrograde orbit',
    diameter: 800, gravity: 0.015, atmosphereType: 'none',
    atmosphereComposition: {},
    temperature: -70, temperatureMin: -190, temperatureMax: 80,
    habitabilityRating: 0, resourceSlots: 3,
    specialFeatures: ['retrograde_orbit', 'irregular_shape', 'metallic_composition', 'unstable_orbit'],
    rarity: 'common',
  },
  {
    id: 'C-BC', name: 'Binary Captured', classId: 'Captured', subclassId: 'Binary-captured',
    category: 'barren',
    description: 'Binary asteroid pair captured together in orbit',
    diameter: 600, gravity: 0.01, atmosphereType: 'none',
    atmosphereComposition: {},
    temperature: -90, temperatureMin: -200, temperatureMax: 60,
    habitabilityRating: 0, resourceSlots: 2,
    specialFeatures: ['binary_pair', 'mutual_orbit', 'tidal_forces', 'shared_composition'],
    rarity: 'uncommon',
  },

  // ==================== Artificial Types (2) ====================
  {
    id: 'A-OH', name: 'Orbital Habitat', classId: 'Artificial', subclassId: 'Orbital-habitat',
    category: 'artificial',
    description: 'Constructed rotating habitat simulating gravity and environment',
    diameter: 10, gravity: 0.9, atmosphereType: 'dense',
    atmosphereComposition: { nitrogen: 78, oxygen: 21, other: 1 },
    temperature: 22, temperatureMin: 18, temperatureMax: 26,
    habitabilityRating: 95, resourceSlots: 6,
    specialFeatures: ['rotating_habitat', 'artificial_gravity', 'self_sustaining', 'advanced_tech'],
    rarity: 'epic',
  },
  {
    id: 'A-DP', name: 'Defense Platform', classId: 'Artificial', subclassId: 'Defense-platform',
    category: 'artificial',
    description: 'Orbital defense platform with shields and weapons systems',
    diameter: 2, gravity: 0, atmosphereType: 'dense',
    atmosphereComposition: { nitrogen: 78, oxygen: 21, other: 1 },
    temperature: 20, temperatureMin: 15, temperatureMax: 25,
    habitabilityRating: 40, resourceSlots: 3,
    specialFeatures: ['weapons_systems', 'shield_generators', 'automated_defense', 'orbital_fortress'],
    rarity: 'epic',
  },

  // ==================== Dwarf Types (2) ====================
  {
    id: 'D-MD', name: 'Micro Dwarf', classId: 'Dwarf', subclassId: 'Micro-dwarf',
    category: 'barren',
    description: 'Tiny captured moonlet too small for hydrostatic equilibrium',
    diameter: 50, gravity: 0.0003, atmosphereType: 'none',
    atmosphereComposition: {},
    temperature: -120, temperatureMin: -200, temperatureMax: 50,
    habitabilityRating: 0, resourceSlots: 1,
    specialFeatures: ['tiny_size', 'irregular_shape', 'tumbling_rotation', 'captured_debris'],
    rarity: 'common',
  },
  {
    id: 'D-BD', name: 'Binary Dwarf', classId: 'Dwarf', subclassId: 'Binary-dwarf',
    category: 'barren',
    description: 'Pair of tiny dwarf moons orbiting each other',
    diameter: 80, gravity: 0.0005, atmosphereType: 'none',
    atmosphereComposition: {},
    temperature: -140, temperatureMin: -210, temperatureMax: 30,
    habitabilityRating: 0, resourceSlots: 1,
    specialFeatures: ['binary_pair', 'tiny_dwarfs', 'tidal_locking', 'mutual_orbit'],
    rarity: 'uncommon',
  },

  // ==================== Rogue Types (2) ====================
  {
    id: 'R-FF', name: 'Free Floating', classId: 'Rogue', subclassId: 'Free-floating',
    category: 'barren',
    description: 'Moon ejected from its system, drifting through interstellar space',
    diameter: 1500, gravity: 0.03, atmosphereType: 'none',
    atmosphereComposition: {},
    temperature: -220, temperatureMin: -250, temperatureMax: -180,
    habitabilityRating: 0, resourceSlots: 2,
    specialFeatures: ['interstellar_drift', 'frozen_surface', 'dark_approach', 'no_star'],
    rarity: 'rare',
  },
  {
    id: 'R-IR', name: 'Interstellar Rogue', classId: 'Rogue', subclassId: 'Interstellar-rogue',
    category: 'barren',
    description: 'Large rogue body ejected from ancient system, rich in primordial materials',
    diameter: 3000, gravity: 0.15, atmosphereType: 'trace',
    atmosphereComposition: { hydrogen: 50, helium: 40, other: 10 },
    temperature: -230, temperatureMin: -250, temperatureMax: -180,
    habitabilityRating: 2, resourceSlots: 4,
    specialFeatures: ['primordial_materials', 'ancient_composition', 'interstellar_trajectory', 'rare_elements'],
    rarity: 'epic',
  },
] as const;

// ============================================================================
// STAR TREK MOON NAMES
// ============================================================================

export const STAR_TREK_MOON_NAMES: Readonly<Record<string, readonly string[]>> = {
  'Vulcan': ['T\'Kul-klar', 'Seleya', 'D\'Kyr', 'Vostok'],
  'Romulus': ['Remus', 'Cheron', 'Galorndon'],
  'Qo\'noS': ['Praxis', 'Vault', 'Quo\'tas'],
  'Bajor': ['Bajor VIII', 'Nevat', 'Monorath'],
  'Earth': ['Luna', 'Callypso', 'Artemis'],
  'Andoria': ['Teneebia', 'Kodos', 'Anea'],
  'Tellar': ['Belleair', 'Nikkar', 'Mesrak'],
  'Trill': ['Arbazan', 'Lormenta', 'Coral'],
  'Betazed': ['Betazed III', 'Omicron', 'Lwaxana'],
  'Cardassia': ['Koranak', 'Ezri', 'Orias'],
  'Rigel': ['Rigel I', 'Rigel II', 'Rigel III', 'Rigel IV', 'Rigel V'],
  'Denobula': ['Denobula I', 'Denobula II', 'Denobula III'],
  'Orion': ['Orion I', 'Orion II', 'Orion III'],
  'Vega': ['Vega I', 'Vega II', 'Vega III'],
  'Alpha Centauri': ['Proxima', 'Toliman', 'Rigil Kentaurus'],
  'Sirius': ['Sirius I', 'Sirius II', 'Dog Star'],
  'Arcturus': ['Arcturus I', 'Arcturus II', 'Arcturus III'],
  'Regulus': ['Regulus I', 'Regulus II', 'Regulus III'],
  'Pollux': ['Pollux I', 'Pollux II', 'Pollux III'],
  'Castor': ['Castor I', 'Castor II', 'Castor III'],
} as const;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get moon size class from diameter in km
 */
export function getMoonSizeClass(diameter: number): MoonSizeClass {
  for (const sizeClass of MOON_SIZE_CLASSES) {
    if (diameter >= sizeClass.minDiameter && diameter <= sizeClass.maxDiameter) {
      return sizeClass;
    }
  }
  return MOON_SIZE_CLASSES[MOON_SIZE_CLASSES.length - 1];
}

/**
 * Generate a unique moon ID
 * Format: "G001-S01-S001-P01-M01"
 */
export function generateMoonId(planetId: string, moonIndex: number): string {
  const m = String(moonIndex).padStart(2, '0');
  return `${planetId}-M${m}`;
}

/**
 * Get a display name for a classified moon
 */
export function getMoonDisplayName(
  classification: MoonClassification,
  parentPlanet: string
): string {
  const planetNames = STAR_TREK_MOON_NAMES[parentPlanet];
  if (planetNames && planetNames.length > 0) {
    const randomIndex = Math.floor(Math.random() * planetNames.length);
    return planetNames[randomIndex];
  }

  // Generate a name based on class
  const prefixes: Record<MoonClassId, string> = {
    'Terrestrial': 'Rock',
    'Ice': 'Frost',
    'Volcanic': 'Pyro',
    'Gas-moon': 'Atmo',
    'Captured': 'Wanderer',
    'Artificial': 'Forge',
    'Dwarf': 'Pebble',
    'Rogue': 'Drifter',
  };

  const suffixes = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta'];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];

  return `${prefixes[classification.classId]}-${suffix}`;
}

/**
 * Classify a moon from raw physical parameters
 */
export function classifyMoon(params: {
  diameter: number;
  gravity: number;
  atmosphereType: 'none' | 'trace' | 'thin' | 'moderate' | 'dense';
  temperature: number;
  habitabilityRating: number;
  hasParent: boolean;
}): MoonClassification {
  const { diameter, gravity, atmosphereType, temperature, habitabilityRating } = params;

  for (const classification of MOON_CLASSIFICATIONS) {
    const diameterMatch = diameter >= classification.diameterRange.min && diameter <= classification.diameterRange.max;
    const gravityMatch = gravity >= classification.gravityRange.min && gravity <= classification.gravityRange.max;
    const tempMatch = temperature >= classification.temperatureRange.min && temperature <= classification.temperatureRange.max;
    const habitMatch = habitabilityRating >= classification.habitabilityRating.min && habitabilityRating <= classification.habitabilityRating.max;

    if (diameterMatch && gravityMatch && tempMatch && habitMatch) {
      return classification;
    }
  }

  // Fallback to Captured if no match
  return MOON_CLASSIFICATIONS.find(c => c.classId === 'Captured')!;
}

/**
 * Get a moon catalog entry by ID
 */
export function getMoonCatalogEntry(id: string): MoonCatalogEntry | undefined {
  return MOON_CATALOG.find(m => m.id === id);
}

/**
 * Get all moon entries for a given class
 */
export function getMoonsByClass(classId: MoonClassId): readonly MoonCatalogEntry[] {
  return MOON_CATALOG.filter(m => m.classId === classId);
}

/**
 * Get all moon entries for a given category
 */
export function getMoonsByCategory(category: MoonCategory): readonly MoonCatalogEntry[] {
  return MOON_CATALOG.filter(m => m.category === category);
}

/**
 * Get all habitable moon entries
 */
export function getHabitableMoons(): readonly MoonCatalogEntry[] {
  return MOON_CATALOG.filter(m => m.habitabilityRating >= 20);
}

/**
 * Get all moons with high resource slots
 */
export function getResourceRichMoons(): readonly MoonCatalogEntry[] {
  return MOON_CATALOG.filter(m => m.resourceSlots >= 5);
}

/**
 * Get Star Trek moon names for a parent planet
 */
export function getStarTrekMoonNames(parentPlanet: string): readonly string[] {
  return STAR_TREK_MOON_NAMES[parentPlanet] || [];
}

/**
 * Get a random moon name from the Star Trek pool
 */
export function getRandomMoonName(): string {
  const allNames = Object.values(STAR_TREK_MOON_NAMES).flat();
  return allNames[Math.floor(Math.random() * allNames.length)];
}
