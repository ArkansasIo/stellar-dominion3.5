import { ALL_PLANET_TYPES, type ConfigPlanetType } from "@shared/config";

export interface PlanetDossierInput {
  id: string;
  name: string;
  coordinates: string;
  type: string;
  class: string;
  size: string;
  temperature: number;
  habitability: number;
  waterPercentage: number;
  colonized: boolean;
  owner?: string;
  population?: number;
  defenses?: number;
  resources: {
    metal: number;
    crystal: number;
    deuterium: number;
  };
  buildings?: {
    metalMine: number;
    crystalMine: number;
    deuteriumSynthesizer: number;
    solarPlant: number;
    roboticsFactory: number;
  };
}

export interface PlanetDossier {
  archetype: ConfigPlanetType;
  status: {
    condition: string;
    colonyReadiness: number;
    strategicValue: number;
    threatLevel: string;
    surveyConfidence: number;
    developmentLevel: number;
  };
  physical: {
    diameter: number;
    mass: number;
    gravity: number;
    axialTilt: number;
    dayLength: number;
    yearLength: number;
  };
  atmosphere: {
    pressure: number;
    composition: Array<{ gas: string; percentage: number }>;
    breathability: string;
    climate: string;
  };
  biosphere: {
    habitability: number;
    waterCoverage: number;
    biodiversity: number;
    biologicalResources: number;
    lifeforms: string;
  };
  geology: {
    metalRichness: number;
    crystalRichness: number;
    deuteriumRichness: number;
    seismicActivity: number;
    radioactivity: number;
    magneticField: number;
    stormIntensity: number;
  };
  colony: {
    populationCapacity: number;
    populationUtilization: number;
    infrastructure: number;
    defenseCoverage: number;
    productionMultiplier: number;
    possibleColonies: number;
  };
  attributes: Array<{ label: string; value: number; description: string }>;
}

const TYPE_MAP: Record<string, string> = {
  temperate: "earth-like",
  terrestrial: "earth-like",
  desert: "desert-world",
  arid: "desert-world",
  ice: "ice-world",
  frozen: "ice-world",
  ocean: "ocean-world",
  jungle: "jungle-world",
  swamp: "swamp-world",
  volcanic: "volcanic-world",
  barren: "rocky-barren",
  rocky: "rocky-barren",
  gas: "gas-giant-jupiter",
  "gas giant": "gas-giant-jupiter",
  moon: "moon-terrestrial",
};

function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Math.round(value)));
}

function hashSeed(value: string) {
  return [...value].reduce((hash, character) => ((hash * 31) + character.charCodeAt(0)) >>> 0, 2166136261);
}

function selectArchetype(planet: PlanetDossierInput) {
  const normalizedType = planet.type.trim().toLowerCase();
  const mappedId = TYPE_MAP[normalizedType];
  const mapped = ALL_PLANET_TYPES.find((candidate) => candidate.id === mappedId);
  if (mapped) return mapped;

  const byClass = ALL_PLANET_TYPES.filter((candidate) =>
    candidate.class.toLowerCase().includes(planet.class.toLowerCase()) ||
    candidate.subClass.toLowerCase().includes(planet.class.toLowerCase()),
  );
  if (byClass.length) return byClass[hashSeed(planet.id) % byClass.length];

  return ALL_PLANET_TYPES[hashSeed(`${planet.id}:${planet.coordinates}`) % ALL_PLANET_TYPES.length];
}

function getSizeMultiplier(size: string) {
  if (size === "tiny") return 0.55;
  if (size === "small") return 0.75;
  if (size === "large") return 1.2;
  if (size === "massive") return 1.55;
  return 1;
}

export function createPlanetDossier(planet: PlanetDossierInput): PlanetDossier {
  const archetype = selectArchetype(planet);
  const stats = archetype.stats;
  const sizeMultiplier = getSizeMultiplier(planet.size.toLowerCase());
  const seed = hashSeed(`${planet.id}:${planet.coordinates}`);
  const variance = ((seed % 17) - 8) / 100;
  const buildingLevels = Object.values(planet.buildings || {}).reduce((sum, level) => sum + level, 0);
  const resourceTotal = planet.resources.metal + planet.resources.crystal + planet.resources.deuterium;
  const resourceScore = clamp(resourceTotal / 2800);
  const defenseCoverage = clamp((planet.defenses || 0) / 8);
  const infrastructure = clamp(buildingLevels * 4 + (planet.colonized ? 10 : 0));
  const biodiversity = clamp((stats.biodiversityPotential + planet.habitability) / 2);
  const magneticField = clamp(stats.magneticField + variance * 100);
  const temperatureC = planet.temperature > 170 ? planet.temperature - 273.15 : planet.temperature;
  const climateStress = clamp(Math.abs(temperatureC - 15) * 1.5);
  const environmentalSafety = clamp(
    planet.habitability * 0.45 +
    magneticField * 0.2 +
    (100 - stats.radioactivity) * 0.15 +
    (100 - stats.stormIntensity) * 0.1 +
    (100 - climateStress) * 0.1,
  );
  const colonyReadiness = clamp(environmentalSafety * 0.55 + resourceScore * 0.2 + infrastructure * 0.25);
  const strategicValue = clamp(
    resourceScore * 0.35 +
    planet.habitability * 0.25 +
    defenseCoverage * 0.15 +
    archetype.discoveryValue / 120 +
    (planet.colonized ? 12 : 0),
  );
  const populationCapacity = Math.round(
    Math.max(10_000, 1_500_000 * sizeMultiplier * Math.max(0.08, planet.habitability / 100) * (1 + infrastructure / 180)),
  );
  const populationUtilization = clamp(((planet.population || 0) / populationCapacity) * 100);
  const dangerScore = clamp(
    stats.radioactivity * 0.3 +
    stats.seismicActivity * 0.25 +
    stats.stormIntensity * 0.25 +
    climateStress * 0.2,
  );
  const threatLevel = dangerScore >= 70 ? "Extreme" : dangerScore >= 45 ? "Elevated" : dangerScore >= 25 ? "Guarded" : "Low";
  const condition = colonyReadiness >= 80 ? "Prime" : colonyReadiness >= 60 ? "Stable" : colonyReadiness >= 40 ? "Marginal" : "Hostile";
  const oxygen = stats.atmosphereComposition.oxygen || 0;
  const breathability = oxygen >= 18 && oxygen <= 26 && stats.atmospherePressure >= 0.6 && stats.atmospherePressure <= 1.8
    ? "Breathable"
    : oxygen > 0
      ? "Assisted"
      : "Sealed habitat required";

  return {
    archetype,
    status: {
      condition,
      colonyReadiness,
      strategicValue,
      threatLevel,
      surveyConfidence: clamp(72 + (seed % 29)),
      developmentLevel: clamp(infrastructure + defenseCoverage * 0.25),
    },
    physical: {
      diameter: Math.round(stats.diameter * sizeMultiplier),
      mass: Number((stats.mass * sizeMultiplier * (1 + variance)).toFixed(2)),
      gravity: Number((stats.gravity * Math.sqrt(sizeMultiplier) * (1 + variance / 2)).toFixed(2)),
      axialTilt: Number((stats.axialTilt * (1 + variance)).toFixed(1)),
      dayLength: Number((stats.dayLength * (1 - variance)).toFixed(1)),
      yearLength: Math.round(stats.yearLength * (1 + variance)),
    },
    atmosphere: {
      pressure: Number((stats.atmospherePressure * (1 + variance)).toFixed(2)),
      composition: Object.entries(stats.atmosphereComposition)
        .filter((entry): entry is [string, number] => typeof entry[1] === "number")
        .map(([gas, percentage]) => ({ gas, percentage }))
        .sort((a, b) => b.percentage - a.percentage),
      breathability,
      climate: archetype.climate,
    },
    biosphere: {
      habitability: planet.habitability,
      waterCoverage: planet.waterPercentage,
      biodiversity,
      biologicalResources: clamp(stats.biologicalResources + variance * 60),
      lifeforms: archetype.lifeforms,
    },
    geology: {
      metalRichness: clamp((stats.metalRichness + resourceScore) / 2 + variance * 70),
      crystalRichness: clamp((stats.crystalRichness + planet.resources.crystal / 1200) / 2 + variance * 70),
      deuteriumRichness: clamp((stats.deuteriumRichness + planet.resources.deuterium / 700) / 2 + variance * 70),
      seismicActivity: clamp(stats.seismicActivity + variance * 80),
      radioactivity: clamp(stats.radioactivity + variance * 60),
      magneticField,
      stormIntensity: clamp(stats.stormIntensity + variance * 80),
    },
    colony: {
      populationCapacity,
      populationUtilization,
      infrastructure,
      defenseCoverage,
      productionMultiplier: Number((archetype.baseProductionMultiplier * (1 + infrastructure / 300)).toFixed(2)),
      possibleColonies: archetype.basePossibleColonies,
    },
    attributes: [
      { label: "Environmental Safety", value: environmentalSafety, description: "Combined climate, radiation, storm, and magnetic protection rating." },
      { label: "Resource Potential", value: resourceScore, description: "Estimated long-term extraction value across all surveyed deposits." },
      { label: "Biosphere Complexity", value: biodiversity, description: "Potential diversity and resilience of native biological systems." },
      { label: "Industrial Readiness", value: infrastructure, description: "Maturity of mining, power, robotics, and colony support infrastructure." },
      { label: "Defense Coverage", value: defenseCoverage, description: "Planetary protection against orbital and surface threats." },
      { label: "Strategic Value", value: strategicValue, description: "Overall command priority based on location, resources, safety, and development." },
    ],
  };
}
