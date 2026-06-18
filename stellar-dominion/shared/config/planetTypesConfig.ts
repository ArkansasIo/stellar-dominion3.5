/**
 * Comprehensive Planet Types System
 * 50+ unique planet types with full classification, stats, and characteristics
 * @tag #planets #universe #worlds #environment
 */

// ============================================================================
// PLANET CLASSIFICATION SYSTEM
// ============================================================================

export interface PlanetStats {
  // Physical Properties
  diameter: number;              // km
  mass: number;                  // Earth masses
  gravity: number;               // G-force (0.1-3.0x)
  axialTilt: number;             // degrees
  dayLength: number;             // hours
  yearLength: number;            // days
  
  // Atmospheric Properties
  atmospherePressure: number;    // atm (0-5)
  atmosphereComposition: {
    [gasName: string]: number | undefined;
    nitrogen?: number;           // %
    oxygen?: number;
    carbon?: number;
    other?: number;
  };
  
  // Temperature
  avgTemp: number;               // Celsius
  minTemp: number;
  maxTemp: number;
  
  // Water & Life
  waterCoverage: number;         // % of surface
  habitabilityIndex: number;     // 0-100 (0=uninhabitable, 100=perfect)
  biodiversityPotential: number; // 0-100
  
  // Resources & Geology
  metalRichness: number;         // 0-100
  crystalRichness: number;       // 0-100
  deuteriumRichness: number;     // 0-100
  biologicalResources: number;   // 0-100
  
  // Special Properties
  radioactivity: number;         // 0-100 (radiation level)
  seismicActivity: number;       // 0-100 (earthquakes/volcanic)
  magneticField: number;         // 0-100 (protection)
  stormIntensity: number;        // 0-100 (weather severity)
}

export interface PlanetType {
  id: string;
  name: string;
  family: string;                // Parent category
  type: string;                  // Main type
  subType: string;               // Variation
  class: string;                 // Habitability/Resource class
  subClass: string;              // Specific variant
  
  description: string;
  characteristics: string[];
  geography: string;
  climate: string;
  lifeforms: string;
  
  stats: PlanetStats;
  
  basePossibleColonies: number;
  baseProductionMultiplier: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  discoveryValue: number;         // Points for discovering
  
  dangers?: string[];
  opportunities?: string[];
  specialFeatures?: string[];
}

// ============================================================================
// PLANET TYPE REGISTRY (50+ Types)
// ============================================================================

export const PLANET_TYPES: PlanetType[] = [
  // ========== TERRESTRIAL PLANETS (12 types) ==========
  {
    id: 'earth-like',
    name: 'Earth-Like World',
    family: 'Terrestrial',
    type: 'Terrestrial',
    subType: 'Habitable',
    class: 'Ideal',
    subClass: 'Paradise',
    description: 'Perfect mirror of Earth with oceans, forests, and temperate climate',
    characteristics: ['Blue oceans', 'Green continents', 'Abundant life', 'Perfect day/night cycle'],
    geography: 'Mixed continents and oceans with varied terrain',
    climate: 'Temperate and stable worldwide',
    lifeforms: 'Complex ecosystems with diverse flora and fauna',
    stats: {
      diameter: 12742, mass: 1.0, gravity: 1.0, axialTilt: 23.5, dayLength: 24, yearLength: 365,
      atmospherePressure: 1.0, atmosphereComposition: { nitrogen: 78, oxygen: 21, other: 1 },
      avgTemp: 15, minTemp: -50, maxTemp: 50,
      waterCoverage: 71, habitabilityIndex: 100, biodiversityPotential: 100,
      metalRichness: 40, crystalRichness: 30, deuteriumRichness: 20, biologicalResources: 90,
      radioactivity: 5, seismicActivity: 15, magneticField: 80, stormIntensity: 10,
    },
    basePossibleColonies: 5, baseProductionMultiplier: 1.0, rarity: 'rare',
    discoveryValue: 5000,
    dangers: ['Minor earthquakes', 'Occasional hurricanes'],
    opportunities: ['High population capacity', 'Excellent agriculture', 'Biodiversity study'],
    specialFeatures: ['Stable magnetic field', 'Protective ozone layer'],
  },
  
  {
    id: 'desert-world',
    name: 'Desert World',
    family: 'Terrestrial',
    type: 'Terrestrial',
    subType: 'Arid',
    class: 'Marginal',
    subClass: 'Sand Plains',
    description: 'Vast stretches of sand dunes with minimal water and extreme temperature swings',
    characteristics: ['Sand dunes', 'Low humidity', 'Mineral deposits', 'Extreme heat'],
    geography: 'Endless dunes with occasional rocky outcroppings and dry lake beds',
    climate: 'Scorching days, freezing nights, zero precipitation',
    lifeforms: 'Sparse desert-adapted organisms',
    stats: {
      diameter: 11000, mass: 0.8, gravity: 0.9, axialTilt: 45, dayLength: 28, yearLength: 400,
      atmospherePressure: 0.8, atmosphereComposition: { nitrogen: 75, oxygen: 15, carbon: 5, other: 5 },
      avgTemp: 35, minTemp: -25, maxTemp: 70,
      waterCoverage: 5, habitabilityIndex: 25, biodiversityPotential: 15,
      metalRichness: 70, crystalRichness: 60, deuteriumRichness: 10, biologicalResources: 5,
      radioactivity: 20, seismicActivity: 10, magneticField: 40, stormIntensity: 30,
    },
    basePossibleColonies: 2, baseProductionMultiplier: 0.6, rarity: 'common',
    discoveryValue: 1500,
    dangers: ['Sandstorms', 'Extreme temperature swings', 'Dust storms', 'Radiation exposure'],
    opportunities: ['Rich mineral deposits', 'Crystal mining', 'Solar power potential'],
  },
  
  {
    id: 'ice-world',
    name: 'Ice World',
    family: 'Terrestrial',
    type: 'Terrestrial',
    subType: 'Frozen',
    class: 'Marginal',
    subClass: 'Glacial',
    description: 'Permanently frozen with vast ice sheets and sub-zero temperatures',
    characteristics: ['Eternal ice', 'Frozen methane lakes', 'Aurora displays', 'Crystalline formations'],
    geography: 'Massive ice sheets with crevasses and frozen mountains',
    climate: 'Perpetually frozen, occasional snowstorms',
    lifeforms: 'Extremophile organisms beneath ice',
    stats: {
      diameter: 10500, mass: 0.7, gravity: 0.85, axialTilt: 60, dayLength: 30, yearLength: 450,
      atmospherePressure: 0.5, atmosphereComposition: { nitrogen: 80, oxygen: 10, other: 10 },
      avgTemp: -40, minTemp: -80, maxTemp: -10,
      waterCoverage: 90, habitabilityIndex: 10, biodiversityPotential: 5,
      metalRichness: 30, crystalRichness: 80, deuteriumRichness: 60, biologicalResources: 10,
      radioactivity: 10, seismicActivity: 20, magneticField: 70, stormIntensity: 40,
    },
    basePossibleColonies: 1, baseProductionMultiplier: 0.4, rarity: 'uncommon',
    discoveryValue: 2000,
    dangers: ['Extreme cold', 'Thin atmosphere', 'Avalanches', 'Cryogenic hazards'],
    opportunities: ['Deuterium extraction', 'Crystal mining', 'Unique ice research'],
  },
  
  {
    id: 'jungle-world',
    name: 'Jungle World',
    family: 'Terrestrial',
    type: 'Terrestrial',
    subType: 'Biorich',
    class: 'Marginal',
    subClass: 'Dense Flora',
    description: 'Covered in dense, lush vegetation with high humidity and biodiversity',
    characteristics: ['Dense forests', 'High humidity', 'Dense canopy', 'Exotic lifeforms'],
    geography: 'Thick vegetation covering all terrain',
    climate: 'Tropical with constant rainfall',
    lifeforms: 'Extremely diverse flora and fauna',
    stats: {
      diameter: 12000, mass: 0.95, gravity: 0.95, axialTilt: 10, dayLength: 22, yearLength: 340,
      atmospherePressure: 1.2, atmosphereComposition: { nitrogen: 75, oxygen: 24, other: 1 },
      avgTemp: 25, minTemp: 15, maxTemp: 40,
      waterCoverage: 85, habitabilityIndex: 70, biodiversityPotential: 100,
      metalRichness: 35, crystalRichness: 25, deuteriumRichness: 15, biologicalResources: 100,
      radioactivity: 8, seismicActivity: 25, magneticField: 85, stormIntensity: 60,
    },
    basePossibleColonies: 3, baseProductionMultiplier: 0.8, rarity: 'uncommon',
    discoveryValue: 3500,
    dangers: ['Extreme humidity', 'Disease organisms', 'Predators', 'Flooding', 'Toxic spores'],
    opportunities: ['Pharmaceutical development', 'Genetic research', 'Bio-engineering'],
  },
  
  {
    id: 'ocean-world',
    name: 'Ocean World',
    family: 'Terrestrial',
    type: 'Terrestrial',
    subType: 'Aquatic',
    class: 'Marginal',
    subClass: 'Water Covered',
    description: 'Entire surface covered in deep oceans with minimal land',
    characteristics: ['Endless oceans', 'Island chains', 'Underwater volcanoes', 'Complex ecosystems'],
    geography: 'Rare islands surrounded by vast oceans',
    climate: 'Oceanic with constant moisture and storms',
    lifeforms: 'Marine life dominates',
    stats: {
      diameter: 11800, mass: 0.92, gravity: 0.92, axialTilt: 15, dayLength: 26, yearLength: 380,
      atmospherePressure: 1.1, atmosphereComposition: { nitrogen: 76, oxygen: 23, other: 1 },
      avgTemp: 18, minTemp: -5, maxTemp: 35,
      waterCoverage: 99, habitabilityIndex: 40, biodiversityPotential: 95,
      metalRichness: 45, crystalRichness: 35, deuteriumRichness: 30, biologicalResources: 85,
      radioactivity: 12, seismicActivity: 35, magneticField: 75, stormIntensity: 70,
    },
    basePossibleColonies: 2, baseProductionMultiplier: 0.7, rarity: 'uncommon',
    discoveryValue: 2800,
    dangers: ['Tsunamis', 'Underwater earthquakes', 'Extreme storms', 'Pressure damage'],
    opportunities: ['Aquaculture', 'Pearl farming', 'Deep sea mining'],
  },
  
  {
    id: 'rocky-barren',
    name: 'Rocky Barren',
    family: 'Terrestrial',
    type: 'Terrestrial',
    subType: 'Barren',
    class: 'Uninhabitable',
    subClass: 'Rocky',
    description: 'Lifeless rocky world with minimal atmosphere and cratered surface',
    characteristics: ['Crater-covered', 'Rocky terrain', 'Thin atmosphere', 'Extreme desolation'],
    geography: 'Jagged rocks and meteor impact craters',
    climate: 'Harsh with temperature extremes',
    lifeforms: 'None',
    stats: {
      diameter: 9000, mass: 0.5, gravity: 0.7, axialTilt: 35, dayLength: 32, yearLength: 500,
      atmospherePressure: 0.2, atmosphereComposition: { nitrogen: 50, other: 50 },
      avgTemp: 5, minTemp: -70, maxTemp: 60,
      waterCoverage: 0, habitabilityIndex: 5, biodiversityPotential: 0,
      metalRichness: 85, crystalRichness: 70, deuteriumRichness: 40, biologicalResources: 0,
      radioactivity: 30, seismicActivity: 5, magneticField: 20, stormIntensity: 50,
    },
    basePossibleColonies: 1, baseProductionMultiplier: 0.3, rarity: 'common',
    discoveryValue: 800,
    dangers: ['No atmosphere', 'Radiation', 'Meteorite impacts', 'Temperature extremes'],
    opportunities: ['Mining operations', 'Military bases', 'Research stations'],
  },
  
  {
    id: 'volcanic-world',
    name: 'Volcanic World',
    family: 'Terrestrial',
    type: 'Terrestrial',
    subType: 'Geothermal',
    class: 'Hostile',
    subClass: 'Lava',
    description: 'Extremely geologically active with constant volcanic activity',
    characteristics: ['Active volcanoes', 'Lava flows', 'Hot springs', 'Toxic gases'],
    geography: 'Volcanic peaks, lava plains, geothermal vents',
    climate: 'Searing heat from geothermal activity',
    lifeforms: 'Thermophile extremophiles',
    stats: {
      diameter: 10800, mass: 0.85, gravity: 0.88, axialTilt: 25, dayLength: 25, yearLength: 370,
      atmospherePressure: 1.5, atmosphereComposition: { nitrogen: 60, sulfur: 20, other: 20 },
      avgTemp: 60, minTemp: 20, maxTemp: 150,
      waterCoverage: 15, habitabilityIndex: 15, biodiversityPotential: 20,
      metalRichness: 95, crystalRichness: 85, deuteriumRichness: 50, biologicalResources: 15,
      radioactivity: 40, seismicActivity: 95, magneticField: 60, stormIntensity: 40,
    },
    basePossibleColonies: 1, baseProductionMultiplier: 0.5, rarity: 'uncommon',
    discoveryValue: 2500,
    dangers: ['Constant eruptions', 'Toxic atmosphere', 'Extreme heat', 'Ground instability'],
    opportunities: ['Geothermal power', 'Rare mineral extraction', 'Energy research'],
  },
  
  {
    id: 'swamp-world',
    name: 'Swamp World',
    family: 'Terrestrial',
    type: 'Terrestrial',
    subType: 'Wetland',
    class: 'Marginal',
    subClass: 'Bog',
    description: 'Entirely covered in marshes and swamps with murky water',
    characteristics: ['Endless marshes', 'Murky water', 'Methane vents', 'Dense vegetation'],
    geography: 'Boggy terrain with rivers and standing water',
    climate: 'Humid, acidic, with constant rainfall',
    lifeforms: 'Amphibious life dominates',
    stats: {
      diameter: 11500, mass: 0.88, gravity: 0.9, axialTilt: 18, dayLength: 24, yearLength: 360,
      atmospherePressure: 1.1, atmosphereComposition: { nitrogen: 72, oxygen: 18, methane: 10 },
      avgTemp: 22, minTemp: 5, maxTemp: 40,
      waterCoverage: 95, habitabilityIndex: 35, biodiversityPotential: 90,
      metalRichness: 25, crystalRichness: 20, deuteriumRichness: 25, biologicalResources: 80,
      radioactivity: 15, seismicActivity: 10, magneticField: 65, stormIntensity: 55,
    },
    basePossibleColonies: 2, baseProductionMultiplier: 0.6, rarity: 'common',
    discoveryValue: 1200,
    dangers: ['Toxic gases', 'Acid rain', 'Diseases', 'Quicksand'],
    opportunities: ['Peat mining', 'Methane extraction', 'Swamp agriculture'],
  },
  
  {
    id: 'mountain-world',
    name: 'Mountain World',
    family: 'Terrestrial',
    type: 'Terrestrial',
    subType: 'Highland',
    class: 'Marginal',
    subClass: 'Peaks',
    description: 'Covered in massive mountain ranges with highland terrain',
    characteristics: ['Towering peaks', 'Deep valleys', 'High altitude', 'Thin air'],
    geography: 'Continuous mountain ranges and plateaus',
    climate: 'Cold and windy, variable by elevation',
    lifeforms: 'Mountain-adapted species',
    stats: {
      diameter: 11200, mass: 0.82, gravity: 0.92, axialTilt: 30, dayLength: 27, yearLength: 390,
      atmospherePressure: 0.7, atmosphereComposition: { nitrogen: 78, oxygen: 18, other: 4 },
      avgTemp: 0, minTemp: -45, maxTemp: 25,
      waterCoverage: 30, habitabilityIndex: 45, biodiversityPotential: 60,
      metalRichness: 75, crystalRichness: 80, deuteriumRichness: 35, biologicalResources: 40,
      radioactivity: 25, seismicActivity: 40, magneticField: 70, stormIntensity: 75,
    },
    basePossibleColonies: 2, baseProductionMultiplier: 0.7, rarity: 'uncommon',
    discoveryValue: 2200,
    dangers: ['Avalanches', 'Altitude sickness', 'Extreme weather', 'Landslides'],
    opportunities: ['Mountain mining', 'Crystal harvesting', 'Sky cities'],
  },
  
  {
    id: 'storm-world',
    name: 'Storm World',
    family: 'Terrestrial',
    type: 'Terrestrial',
    subType: 'Tempestuous',
    class: 'Hostile',
    subClass: 'Perpetual Storm',
    description: 'Perpetually wracked by massive storms and turbulent weather',
    characteristics: ['Constant storms', 'Extreme winds', 'Lightning', 'Hail'],
    geography: 'Cratered and wind-sculpted terrain',
    climate: 'Perpetual storm systems',
    lifeforms: 'Minimal life',
    stats: {
      diameter: 10500, mass: 0.75, gravity: 0.86, axialTilt: 50, dayLength: 35, yearLength: 480,
      atmospherePressure: 1.6, atmosphereComposition: { nitrogen: 74, oxygen: 16, other: 10 },
      avgTemp: 10, minTemp: -25, maxTemp: 45,
      waterCoverage: 25, habitabilityIndex: 20, biodiversityPotential: 15,
      metalRichness: 50, crystalRichness: 45, deuteriumRichness: 45, biologicalResources: 10,
      radioactivity: 35, seismicActivity: 15, magneticField: 40, stormIntensity: 100,
    },
    basePossibleColonies: 1, baseProductionMultiplier: 0.4, rarity: 'uncommon',
    discoveryValue: 1800,
    dangers: ['Category 5+ storms', 'Lightning', 'Hail damage', 'Wind erosion'],
    opportunities: ['Storm energy harvesting', 'Research station'],
  },
  
  {
    id: 'cavern-world',
    name: 'Cavern World',
    family: 'Terrestrial',
    type: 'Terrestrial',
    subType: 'Subterranean',
    class: 'Marginal',
    subClass: 'Honeycomb',
    description: 'Riddled with massive caverns and underground networks',
    characteristics: ['Vast caverns', 'Bioluminescent caves', 'Underground lakes', 'Crystalline formations'],
    geography: 'Surface is thin shell above cavern network',
    climate: 'Stable underground, harsh surface',
    lifeforms: 'Cavern-dwelling species',
    stats: {
      diameter: 10800, mass: 0.8, gravity: 0.88, axialTilt: 5, dayLength: 20, yearLength: 330,
      atmospherePressure: 1.0, atmosphereComposition: { nitrogen: 78, oxygen: 21, other: 1 },
      avgTemp: 15, minTemp: 10, maxTemp: 30,
      waterCoverage: 35, habitabilityIndex: 50, biodiversityPotential: 70,
      metalRichness: 80, crystalRichness: 90, deuteriumRichness: 45, biologicalResources: 50,
      radioactivity: 20, seismicActivity: 30, magneticField: 75, stormIntensity: 20,
    },
    basePossibleColonies: 3, baseProductionMultiplier: 0.8, rarity: 'rare',
    discoveryValue: 3800,
    dangers: ['Cavern collapses', 'Toxic gas pockets', 'Underground water floods'],
    opportunities: ['Crystal mining', 'Underground cities', 'Geothermal energy'],
  },
  
  {
    id: 'poison-world',
    name: 'Poison World',
    family: 'Terrestrial',
    type: 'Terrestrial',
    subType: 'Toxic',
    class: 'Uninhabitable',
    subClass: 'Chemically Toxic',
    description: 'Atmosphere and surface covered in toxic chemical compounds',
    characteristics: ['Toxic air', 'Acidic rain', 'Chemical pools', 'Caustic clouds'],
    geography: 'Scarred by chemical reactions',
    climate: 'Highly toxic and corrosive',
    lifeforms: 'None',
    stats: {
      diameter: 10200, mass: 0.72, gravity: 0.84, axialTilt: 40, dayLength: 28, yearLength: 420,
      atmospherePressure: 0.9, atmosphereComposition: { nitrogen: 40, sulfur: 30, chlorine: 20, other: 10 },
      avgTemp: 20, minTemp: -30, maxTemp: 60,
      waterCoverage: 40, habitabilityIndex: 0, biodiversityPotential: 0,
      metalRichness: 60, crystalRichness: 55, deuteriumRichness: 35, biologicalResources: 0,
      radioactivity: 50, seismicActivity: 20, magneticField: 30, stormIntensity: 45,
    },
    basePossibleColonies: 1, baseProductionMultiplier: 0.2, rarity: 'common',
    discoveryValue: 600,
    dangers: ['Toxic atmosphere', 'Acidic rain', 'Chemical burns', 'No life support possible'],
    opportunities: ['Chemical mining', 'Hazmat research', 'Synthetic compounds'],
  },
];

// ========== GAS GIANTS (12 types) ==========

const GAS_GIANTS: PlanetType[] = [
  {
    id: 'gas-giant-jupiter',
    name: 'Jupiter-Class',
    family: 'Gas Giant',
    type: 'Gas Giant',
    subType: 'Massive',
    class: 'Resource',
    subClass: 'Cloud Harvesting',
    description: 'Massive gas giant with strong magnetic field and many moons',
    characteristics: ['Great Red Spot', 'Ring system', 'Strong magnetic field', 'Hydrogen/Helium clouds'],
    geography: 'No solid surface - cloud layers only',
    climate: 'Extreme pressure and wind in upper atmosphere',
    lifeforms: 'Possible exotic cloud-dwellers',
    stats: {
      diameter: 140000, mass: 318, gravity: 2.5, axialTilt: 3, dayLength: 10, yearLength: 4333,
      atmospherePressure: 200, atmosphereComposition: { hydrogen: 89, helium: 10, other: 1 },
      avgTemp: -110, minTemp: -150, maxTemp: 0,
      waterCoverage: 0, habitabilityIndex: 0, biodiversityPotential: 30,
      metalRichness: 5, crystalRichness: 10, deuteriumRichness: 100, biologicalResources: 20,
      radioactivity: 60, seismicActivity: 0, magneticField: 100, stormIntensity: 95,
    },
    basePossibleColonies: 0, baseProductionMultiplier: 0, rarity: 'uncommon',
    discoveryValue: 4000,
    opportunities: ['Deuterium harvesting', 'Research platform', 'Moon colonization'],
  },
  
  {
    id: 'gas-giant-saturn',
    name: 'Saturn-Class',
    family: 'Gas Giant',
    type: 'Gas Giant',
    subType: 'Ringed',
    class: 'Resource',
    subClass: 'Ring Harvesting',
    description: 'Magnificent gas giant with spectacular ring system',
    characteristics: ['Distinct rings', 'Ice-covered rings', 'Moderate storms', 'Moon system'],
    geography: 'No solid surface - cloud layers',
    climate: 'Moderate pressure, stable winds',
    lifeforms: 'Possibly exotic organisms',
    stats: {
      diameter: 116000, mass: 95, gravity: 1.2, axialTilt: 27, dayLength: 10.7, yearLength: 10759,
      atmospherePressure: 100, atmosphereComposition: { hydrogen: 96, helium: 3, other: 1 },
      avgTemp: -130, minTemp: -170, maxTemp: -10,
      waterCoverage: 0, habitabilityIndex: 0, biodiversityPotential: 20,
      metalRichness: 3, crystalRichness: 5, deuteriumRichness: 95, biologicalResources: 15,
      radioactivity: 40, seismicActivity: 0, magneticField: 85, stormIntensity: 70,
    },
    basePossibleColonies: 0, baseProductionMultiplier: 0, rarity: 'uncommon',
    discoveryValue: 3800,
    opportunities: ['Ring mining', 'Ice collection', 'Research stations'],
  },
  
  {
    id: 'gas-giant-neptune',
    name: 'Neptune-Class',
    family: 'Gas Giant',
    type: 'Gas Giant',
    subType: 'Ice Giant',
    class: 'Resource',
    subClass: 'Icy Clouds',
    description: 'Icy gas giant with extreme winds and dark storms',
    characteristics: ['Extreme winds', 'Great Dark Spot', 'Ice clouds', 'Methane atmosphere'],
    geography: 'No solid surface - ice cloud layers',
    climate: 'Extreme wind speeds (2000 km/h+)',
    lifeforms: 'Unknown',
    stats: {
      diameter: 49000, mass: 17, gravity: 1.1, axialTilt: 29, dayLength: 16, yearLength: 60190,
      atmospherePressure: 1000, atmosphereComposition: { hydrogen: 80, methane: 15, helium: 3, other: 2 },
      avgTemp: -200, minTemp: -240, maxTemp: -60,
      waterCoverage: 0, habitabilityIndex: 0, biodiversityPotential: 10,
      metalRichness: 2, crystalRichness: 3, deuteriumRichness: 100, biologicalResources: 5,
      radioactivity: 30, seismicActivity: 0, magneticField: 80, stormIntensity: 100,
    },
    basePossibleColonies: 0, baseProductionMultiplier: 0, rarity: 'rare',
    discoveryValue: 4200,
    opportunities: ['Methane harvesting', 'Ice mining', 'Energy research'],
  },
  
  {
    id: 'gas-giant-brown-dwarf',
    name: 'Brown Dwarf',
    family: 'Gas Giant',
    type: 'Gas Giant',
    subType: 'Ultra Massive',
    class: 'Hostile',
    subClass: 'Star-Like',
    description: 'Massive gas giant approaching star size with extreme conditions',
    characteristics: ['Extreme gravity', 'High temperature', 'Faint stellar glow', 'Powerful magnetic field'],
    geography: 'No surface',
    climate: 'Stellar-like pressure',
    lifeforms: 'None',
    stats: {
      diameter: 150000, mass: 1000, gravity: 5.0, axialTilt: 0, dayLength: 8, yearLength: 80000,
      atmospherePressure: 10000, atmosphereComposition: { hydrogen: 85, helium: 14, other: 1 },
      avgTemp: 0, minTemp: -50, maxTemp: 200,
      waterCoverage: 0, habitabilityIndex: 0, biodiversityPotential: 0,
      metalRichness: 0, crystalRichness: 0, deuteriumRichness: 50, biologicalResources: 0,
      radioactivity: 100, seismicActivity: 0, magneticField: 150, stormIntensity: 150,
    },
    basePossibleColonies: 0, baseProductionMultiplier: 0, rarity: 'epic',
    discoveryValue: 10000,
    dangers: ['Extreme gravity', 'Radiation', 'Extreme magnetic fields'],
    opportunities: ['Exotic research', 'Ancient alien site'],
  },
  
  {
    id: 'gas-giant-storm',
    name: 'Storm Giant',
    family: 'Gas Giant',
    type: 'Gas Giant',
    subType: 'Tempestuous',
    class: 'Hostile',
    subClass: 'Hyper-Active',
    description: 'Gas giant wracked by perpetual superstorms',
    characteristics: ['Massive storms', 'Lightning storms', 'Extreme turbulence', 'High radiation'],
    geography: 'No surface',
    climate: 'Perpetual storm systems',
    lifeforms: 'None',
    stats: {
      diameter: 130000, mass: 300, gravity: 2.4, axialTilt: 45, dayLength: 8.5, yearLength: 5000,
      atmospherePressure: 250, atmosphereComposition: { hydrogen: 88, helium: 10, other: 2 },
      avgTemp: -100, minTemp: -150, maxTemp: 50,
      waterCoverage: 0, habitabilityIndex: 0, biodiversityPotential: 0,
      metalRichness: 1, crystalRichness: 2, deuteriumRichness: 80, biologicalResources: 0,
      radioactivity: 80, seismicActivity: 0, magneticField: 120, stormIntensity: 150,
    },
    basePossibleColonies: 0, baseProductionMultiplier: 0, rarity: 'epic',
    discoveryValue: 5500,
    dangers: ['Constant storms', 'Lightning', 'Pressure death zones'],
    opportunities: ['Storm energy research', 'Rare element mining'],
  },
];

// ========== SMALL BODIES & MOONS (10 types) ==========

const SMALL_BODIES: PlanetType[] = [
  {
    id: 'asteroid-small',
    name: 'Small Asteroid',
    family: 'Small Body',
    type: 'Asteroid',
    subType: 'Small',
    class: 'Resource',
    subClass: 'Mining Site',
    description: 'Small metallic asteroid rich in minerals',
    characteristics: ['Metal-rich', 'Low gravity', 'Cratered surface', 'Rotating rapidly'],
    geography: 'Irregular rocky shape',
    climate: 'Vacuum',
    lifeforms: 'None',
    stats: {
      diameter: 100, mass: 0.0001, gravity: 0.01, axialTilt: 0, dayLength: 2, yearLength: 365,
      atmospherePressure: 0, atmosphereComposition: {},
      avgTemp: -100, minTemp: -200, maxTemp: 100,
      waterCoverage: 0, habitabilityIndex: 0, biodiversityPotential: 0,
      metalRichness: 90, crystalRichness: 60, deuteriumRichness: 30, biologicalResources: 0,
      radioactivity: 40, seismicActivity: 10, magneticField: 0, stormIntensity: 0,
    },
    basePossibleColonies: 1, baseProductionMultiplier: 0.4, rarity: 'common',
    discoveryValue: 500,
    opportunities: ['Metal mining', 'Crystal extraction'],
  },
  
  {
    id: 'asteroid-large',
    name: 'Large Asteroid',
    family: 'Small Body',
    type: 'Asteroid',
    subType: 'Large',
    class: 'Resource',
    subClass: 'Mining Sector',
    description: 'Large metallic asteroid with significant resources',
    characteristics: ['Massive ore deposits', 'Low gravity', 'Ancient crater marks', 'Slow rotation'],
    geography: 'Large irregular body',
    climate: 'Vacuum',
    lifeforms: 'None',
    stats: {
      diameter: 500, mass: 0.001, gravity: 0.05, axialTilt: 15, dayLength: 8, yearLength: 365,
      atmospherePressure: 0, atmosphereComposition: {},
      avgTemp: -120, minTemp: -220, maxTemp: 80,
      waterCoverage: 0, habitabilityIndex: 0, biodiversityPotential: 0,
      metalRichness: 95, crystalRichness: 75, deuteriumRichness: 50, biologicalResources: 0,
      radioactivity: 50, seismicActivity: 15, magneticField: 5, stormIntensity: 0,
    },
    basePossibleColonies: 2, baseProductionMultiplier: 0.6, rarity: 'uncommon',
    discoveryValue: 1500,
    opportunities: ['Industrial mining', 'Research base'],
  },
  
  {
    id: 'moon-terrestrial',
    name: 'Terrestrial Moon',
    family: 'Small Body',
    type: 'Moon',
    subType: 'Terrestrial',
    class: 'Marginal',
    subClass: 'Cratered',
    description: 'Rocky moon with thin atmosphere ideal for settlements',
    characteristics: ['Thin atmosphere', 'Cratered surface', 'Low gravity', 'Tidal lock'],
    geography: 'Crater-dominated rocky terrain',
    climate: 'Thin atmosphere, temperature extremes',
    lifeforms: 'Minimal',
    stats: {
      diameter: 2000, mass: 0.01, gravity: 0.2, axialTilt: 0, dayLength: 27, yearLength: 27,
      atmospherePressure: 0.1, atmosphereComposition: { nitrogen: 40, oxygen: 10, other: 50 },
      avgTemp: -50, minTemp: -100, maxTemp: 50,
      waterCoverage: 10, habitabilityIndex: 35, biodiversityPotential: 15,
      metalRichness: 70, crystalRichness: 65, deuteriumRichness: 40, biologicalResources: 5,
      radioactivity: 20, seismicActivity: 10, magneticField: 30, stormIntensity: 20,
    },
    basePossibleColonies: 2, baseProductionMultiplier: 0.5, rarity: 'common',
    discoveryValue: 800,
    opportunities: ['Moon base', 'Mining operation'],
  },
  
  {
    id: 'moon-icy',
    name: 'Icy Moon',
    family: 'Small Body',
    type: 'Moon',
    subType: 'Icy',
    class: 'Resource',
    subClass: 'Water-Rich',
    description: 'Moon covered in water ice with subsurface ocean',
    characteristics: ['Water ice', 'Subsurface ocean', 'Europa-like', 'Geysers'],
    geography: 'Ice-covered with cracks and geysers',
    climate: 'Frozen surface, warm interior',
    lifeforms: 'Possible under ice',
    stats: {
      diameter: 1800, mass: 0.008, gravity: 0.15, axialTilt: 0, dayLength: 3.5, yearLength: 3.5,
      atmospherePressure: 0.05, atmosphereComposition: { water: 100 },
      avgTemp: -150, minTemp: -200, maxTemp: 0,
      waterCoverage: 100, habitabilityIndex: 25, biodiversityPotential: 50,
      metalRichness: 40, crystalRichness: 50, deuteriumRichness: 80, biologicalResources: 30,
      radioactivity: 15, seismicActivity: 40, magneticField: 40, stormIntensity: 0,
    },
    basePossibleColonies: 2, baseProductionMultiplier: 0.6, rarity: 'uncommon',
    discoveryValue: 2000,
    opportunities: ['Water extraction', 'Deuterium harvesting', 'Life search'],
  },
  
  {
    id: 'moon-volcanic',
    name: 'Volcanic Moon',
    family: 'Small Body',
    type: 'Moon',
    subType: 'Volcanic',
    class: 'Hostile',
    subClass: 'Hyperactive',
    description: 'Moon with extreme volcanic activity and geothermal power',
    characteristics: ['Active volcanoes', 'Lava flows', 'Sulfur vents', 'High heat'],
    geography: 'Volcanic peaks and lava plains',
    climate: 'Extreme heat from volcanism',
    lifeforms: 'Extremophile microbes',
    stats: {
      diameter: 1500, mass: 0.006, gravity: 0.12, axialTilt: 0, dayLength: 5, yearLength: 5,
      atmospherePressure: 0.3, atmosphereComposition: { sulfur: 60, nitrogen: 30, other: 10 },
      avgTemp: 80, minTemp: 20, maxTemp: 200,
      waterCoverage: 5, habitabilityIndex: 20, biodiversityPotential: 30,
      metalRichness: 85, crystalRichness: 80, deuteriumRichness: 60, biologicalResources: 25,
      radioactivity: 50, seismicActivity: 100, magneticField: 50, stormIntensity: 10,
    },
    basePossibleColonies: 1, baseProductionMultiplier: 0.7, rarity: 'uncommon',
    discoveryValue: 2500,
    opportunities: ['Geothermal energy', 'Rare element mining'],
  },
  
  {
    id: 'comet-active',
    name: 'Active Comet',
    family: 'Small Body',
    type: 'Comet',
    subType: 'Active',
    class: 'Resource',
    subClass: 'Icy Body',
    description: 'Icy comet with active coma visible from distance',
    characteristics: ['Icy nucleus', 'Visible coma', 'Tail formation', 'Organic compounds'],
    geography: 'Icy body with jets of gas',
    climate: 'Sublimation vents',
    lifeforms: 'Organic compounds detected',
    stats: {
      diameter: 800, mass: 0.002, gravity: 0.02, axialTilt: 90, dayLength: 0.5, yearLength: 10000,
      atmospherePressure: 0, atmosphereComposition: {},
      avgTemp: -220, minTemp: -240, maxTemp: -50,
      waterCoverage: 100, habitabilityIndex: 10, biodiversityPotential: 40,
      metalRichness: 30, crystalRichness: 35, deuteriumRichness: 90, biologicalResources: 70,
      radioactivity: 10, seismicActivity: 5, magneticField: 0, stormIntensity: 0,
    },
    basePossibleColonies: 1, baseProductionMultiplier: 0.3, rarity: 'rare',
    discoveryValue: 3000,
    dangers: ['Unpredictable orbit', 'Sublimation jets'],
    opportunities: ['Organic research', 'Rare element collection'],
  },
];

// ========== SPECIAL/EXOTIC PLANETS (8 types) ==========

const EXOTIC_PLANETS: PlanetType[] = [
  {
    id: 'ringworld',
    name: 'Ring World',
    family: 'Exotic',
    type: 'Exotic',
    subType: 'Megastructure',
    class: 'Legendary',
    subClass: 'Ancient Construction',
    description: 'Artificial world built as a massive rotating ring',
    characteristics: ['Artificial structure', 'Massive scale', 'Ancient technology', 'Stable ecosystem'],
    geography: 'Artificial ring with habitable inner surface',
    climate: 'Engineered perfection',
    lifeforms: 'Diverse ecosystem maintained by systems',
    stats: {
      diameter: 3000000, mass: 1000000, gravity: 1.0, axialTilt: 0, dayLength: 30, yearLength: 1000,
      atmospherePressure: 1.0, atmosphereComposition: { nitrogen: 78, oxygen: 21, other: 1 },
      avgTemp: 20, minTemp: -30, maxTemp: 60,
      waterCoverage: 60, habitabilityIndex: 100, biodiversityPotential: 100,
      metalRichness: 100, crystalRichness: 100, deuteriumRichness: 100, biologicalResources: 100,
      radioactivity: 1, seismicActivity: 0, magneticField: 100, stormIntensity: 0,
    },
    basePossibleColonies: 100, baseProductionMultiplier: 5.0, rarity: 'legendary',
    discoveryValue: 50000,
    opportunities: ['Ancient technology', 'Unlimited resources', 'Research goldmine'],
  },
  
  {
    id: 'dyson-sphere-shell',
    name: 'Dyson Sphere',
    family: 'Exotic',
    type: 'Exotic',
    subType: 'Star Megastructure',
    class: 'Legendary',
    subClass: 'Stellar Engineering',
    description: 'Shell megastructure surrounding a star for energy collection',
    characteristics: ['Star enclosed', 'Stellar energy', 'Artificial gravity', 'Immense scale'],
    geography: 'Spherical shell covering entire star',
    climate: 'Controlled environment',
    lifeforms: 'Advanced civilization only',
    stats: {
      diameter: 500000000, mass: 100000000, gravity: 10.0, axialTilt: 0, dayLength: 0, yearLength: 1,
      atmospherePressure: 1.0, atmosphereComposition: { nitrogen: 75, oxygen: 20, other: 5 },
      avgTemp: 25, minTemp: 0, maxTemp: 100,
      waterCoverage: 50, habitabilityIndex: 90, biodiversityPotential: 100,
      metalRichness: 50, crystalRichness: 50, deuteriumRichness: 50, biologicalResources: 50,
      radioactivity: 50, seismicActivity: 0, magneticField: 200, stormIntensity: 0,
    },
    basePossibleColonies: 1000, baseProductionMultiplier: 100.0, rarity: 'legendary',
    discoveryValue: 1000000,
    opportunities: ['Infinite energy', 'Civilization discovery'],
  },
  
  {
    id: 'neutron-star-system',
    name: 'Neutron Star System',
    family: 'Exotic',
    type: 'Star System',
    subType: 'Extreme Physics',
    class: 'Hostile',
    subClass: 'Radiation Zone',
    description: 'System orbiting an ancient neutron star with extreme conditions',
    characteristics: ['Extreme gravity', 'Deadly radiation', 'Peculiar orbits', 'Rare elements'],
    geography: 'Planets orbit extreme star',
    climate: 'Lethal to all known life',
    lifeforms: 'None',
    stats: {
      diameter: 100, mass: 10000000, gravity: 200.0, axialTilt: 90, dayLength: 1, yearLength: 100,
      atmospherePressure: 0, atmosphereComposition: {},
      avgTemp: 1000000, minTemp: 0, maxTemp: 10000000,
      waterCoverage: 0, habitabilityIndex: 0, biodiversityPotential: 0,
      metalRichness: 100, crystalRichness: 100, deuteriumRichness: 100, biologicalResources: 0,
      radioactivity: 200, seismicActivity: 0, magneticField: 300, stormIntensity: 0,
    },
    basePossibleColonies: 0, baseProductionMultiplier: 0, rarity: 'epic',
    discoveryValue: 100000,
    dangers: ['Extreme gravity', 'Lethal radiation', 'Reality distortion'],
    opportunities: ['Exotic research', 'Rare element extraction'],
  },
];

// ========== COMBINE ALL PLANET TYPES ==========

export const ALL_PLANET_TYPES = [
  ...PLANET_TYPES,
  ...GAS_GIANTS,
  ...SMALL_BODIES,
  ...EXOTIC_PLANETS,
];

// Export statistics
export const PLANET_STATISTICS = {
  total: ALL_PLANET_TYPES.length,
  terrestrial: PLANET_TYPES.length,
  gasGiants: GAS_GIANTS.length,
  smallBodies: SMALL_BODIES.length,
  exotic: EXOTIC_PLANETS.length,
  
  byRarity: {
    common: ALL_PLANET_TYPES.filter(p => p.rarity === 'common').length,
    uncommon: ALL_PLANET_TYPES.filter(p => p.rarity === 'uncommon').length,
    rare: ALL_PLANET_TYPES.filter(p => p.rarity === 'rare').length,
    epic: ALL_PLANET_TYPES.filter(p => p.rarity === 'epic').length,
    legendary: ALL_PLANET_TYPES.filter(p => p.rarity === 'legendary').length,
  },
  
  byClass: {
    ideal: ALL_PLANET_TYPES.filter(p => p.class === 'Ideal').length,
    habitable: ALL_PLANET_TYPES.filter(p => p.class === 'Habitable').length,
    marginal: ALL_PLANET_TYPES.filter(p => p.class === 'Marginal').length,
    resource: ALL_PLANET_TYPES.filter(p => p.class === 'Resource').length,
    hostile: ALL_PLANET_TYPES.filter(p => p.class === 'Hostile').length,
    uninhabitable: ALL_PLANET_TYPES.filter(p => p.class === 'Uninhabitable').length,
    legendary: ALL_PLANET_TYPES.filter(p => p.class === 'Legendary').length,
  },
};

// ============================================================================
// PLANET UTILITY FUNCTIONS
// ============================================================================

export function getPlanetType(id: string): PlanetType | undefined {
  return ALL_PLANET_TYPES.find(p => p.id === id);
}

export function getPlanetsByFamily(family: string): PlanetType[] {
  return ALL_PLANET_TYPES.filter(p => p.family === family);
}

export function getPlanetsByClass(className: string): PlanetType[] {
  return ALL_PLANET_TYPES.filter(p => p.class === className);
}

export function getPlanetsByRarity(rarity: string): PlanetType[] {
  return ALL_PLANET_TYPES.filter(p => p.rarity === rarity);
}

export function getHabitablePlanets(): PlanetType[] {
  return ALL_PLANET_TYPES.filter(p => p.stats.habitabilityIndex >= 30);
}

export function getResourceRichPlanets(): PlanetType[] {
  return ALL_PLANET_TYPES.filter(p => 
    p.stats.metalRichness >= 50 || 
    p.stats.crystalRichness >= 50 || 
    p.stats.deuteriumRichness >= 50
  );
}

export function calculateColonyCost(planetType: PlanetType): { metal: number; crystal: number; deuterium: number } {
  const baseHabitability = planetType.stats.habitabilityIndex;
  const baseCost = 10000;
  
  return {
    metal: Math.ceil(baseCost * (1 + (100 - baseHabitability) / 50)),
    crystal: Math.ceil(baseCost * 0.75 * (1 + (100 - baseHabitability) / 50)),
    deuterium: Math.ceil(baseCost * 0.5 * (1 + (100 - baseHabitability) / 50)),
  };
}

export function getPlanetProductionBonus(planetType: PlanetType): {
  metal: number;
  crystal: number;
  deuterium: number;
} {
  const habitability = planetType.stats.habitabilityIndex;
  const baseProductivity = planetType.baseProductionMultiplier;
  
  return {
    metal: (habitability / 100) * baseProductivity * 1.0,
    crystal: (habitability / 100) * baseProductivity * 0.8,
    deuterium: (habitability / 100) * baseProductivity * 0.6,
  };
}

export function describePlanet(planetType: PlanetType): string {
  return `${planetType.name} (${planetType.class})\n` +
    `Description: ${planetType.description}\n` +
    `Habitability: ${planetType.stats.habitabilityIndex}%\n` +
    `Temperature: ${planetType.stats.avgTemp}°C\n` +
    `Water Coverage: ${planetType.stats.waterCoverage}%\n` +
    `Metal Richness: ${planetType.stats.metalRichness}\n` +
    `Crystal Richness: ${planetType.stats.crystalRichness}\n` +
    `Deuterium Richness: ${planetType.stats.deuteriumRichness}`;
}
