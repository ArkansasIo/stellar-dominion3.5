export type HazardTypeId =
  | 'radiation'
  | 'seismic'
  | 'storm'
  | 'toxic'
  | 'thermal'
  | 'gravity'
  | 'magnetic'
  | 'biological';

export type HazardSeverity = 'none' | 'low' | 'moderate' | 'high' | 'extreme' | 'lethal';

export interface HazardType {
  id: HazardTypeId;
  name: string;
  icon: string;
  description: string;
  thresholds: { min: number; max: number; severity: HazardSeverity }[];
  effects: Record<HazardSeverity, HazardEffect>;
  mitigations: string[];
}

export interface HazardEffect {
  productionMalus: number;
  growthPenalty: number;
  happinessPenalty: number;
  healthRisk: number;
  description: string;
}

export interface PlanetHazardAssessment {
  planetTypeId: string;
  planetName: string;
  hazards: {
    type: HazardTypeId;
    name: string;
    icon: string;
    severity: HazardSeverity;
    rawValue: number;
    effect: HazardEffect;
    description: string;
  }[];
  overallSeverity: HazardSeverity;
  overallProductionMalus: number;
  overallGrowthPenalty: number;
  overallHappinessPenalty: number;
  mitigations: string[];
  dangers: string[];
  safeForColonization: boolean;
}

export const HAZARD_TYPES: Record<HazardTypeId, HazardType> = {
  radiation: {
    id: 'radiation',
    name: 'Radiation',
    icon: '☢️',
    description: 'Ionizing radiation from stellar activity, radioactive decay, or cosmic sources',
    thresholds: [
      { min: 0, max: 10, severity: 'none' },
      { min: 10, max: 25, severity: 'low' },
      { min: 25, max: 45, severity: 'moderate' },
      { min: 45, max: 70, severity: 'high' },
      { min: 70, max: 100, severity: 'extreme' },
      { min: 100, max: Infinity, severity: 'lethal' },
    ],
    effects: {
      none: { productionMalus: 0, growthPenalty: 0, happinessPenalty: 0, healthRisk: 0, description: 'No radiation hazard' },
      low: { productionMalus: 0.02, growthPenalty: 0.01, happinessPenalty: 0.02, healthRisk: 0.1, description: 'Mild radiation — minor health concerns' },
      moderate: { productionMalus: 0.05, growthPenalty: 0.03, happinessPenalty: 0.05, healthRisk: 0.3, description: 'Elevated radiation — shielding recommended' },
      high: { productionMalus: 0.12, growthPenalty: 0.08, happinessPenalty: 0.12, healthRisk: 0.6, description: 'High radiation — specialized shielding required' },
      extreme: { productionMalus: 0.25, growthPenalty: 0.15, happinessPenalty: 0.2, healthRisk: 0.85, description: 'Extreme radiation — hazardous to all known life' },
      lethal: { productionMalus: 0.5, growthPenalty: 0.3, happinessPenalty: 0.4, healthRisk: 1.0, description: 'Lethal radiation — colonization impossible without full protection' },
    },
    mitigations: ['Radiation shielding (Research L4)', 'Lead-lined habitats (Building)', 'Underground settlements (Infrastructure)', 'Radiation scrubbers (Tech)'],
  },
  seismic: {
    id: 'seismic',
    name: 'Seismic Activity',
    icon: '🌋',
    description: 'Earthquakes, volcanic eruptions, and tectonic instability',
    thresholds: [
      { min: 0, max: 10, severity: 'none' },
      { min: 10, max: 25, severity: 'low' },
      { min: 25, max: 50, severity: 'moderate' },
      { min: 50, max: 75, severity: 'high' },
      { min: 75, max: 100, severity: 'extreme' },
      { min: 100, max: Infinity, severity: 'lethal' },
    ],
    effects: {
      none: { productionMalus: 0, growthPenalty: 0, happinessPenalty: 0, healthRisk: 0, description: 'Tectonically stable' },
      low: { productionMalus: 0.01, growthPenalty: 0.02, happinessPenalty: 0.01, healthRisk: 0.05, description: 'Minor tremors — occasional disruptions' },
      moderate: { productionMalus: 0.04, growthPenalty: 0.05, happinessPenalty: 0.03, healthRisk: 0.15, description: 'Regular seismic events — damage risk to buildings' },
      high: { productionMalus: 0.1, growthPenalty: 0.1, happinessPenalty: 0.08, healthRisk: 0.35, description: 'Frequent earthquakes — reinforced construction essential' },
      extreme: { productionMalus: 0.2, growthPenalty: 0.18, happinessPenalty: 0.15, healthRisk: 0.65, description: 'Constant volcanic activity — extreme structural demands' },
      lethal: { productionMalus: 0.4, growthPenalty: 0.3, happinessPenalty: 0.3, healthRisk: 0.9, description: 'Planet-cracking events — surface colonization infeasible' },
    },
    mitigations: ['Seismic dampeners (Building)', 'Deep foundations (Infrastructure)', 'Active tectonic stabilization (Tech L6)', 'Floating platforms (Building)'],
  },
  storm: {
    id: 'storm',
    name: 'Atmospheric Storms',
    icon: '🌀',
    description: 'Extreme weather including hurricanes, tornadoes, and electrical storms',
    thresholds: [
      { min: 0, max: 15, severity: 'none' },
      { min: 15, max: 30, severity: 'low' },
      { min: 30, max: 55, severity: 'moderate' },
      { min: 55, max: 80, severity: 'high' },
      { min: 80, max: 110, severity: 'extreme' },
      { min: 110, max: Infinity, severity: 'lethal' },
    ],
    effects: {
      none: { productionMalus: 0, growthPenalty: 0, happinessPenalty: 0, healthRisk: 0, description: 'Calm atmosphere' },
      low: { productionMalus: 0.01, growthPenalty: 0.01, happinessPenalty: 0.01, healthRisk: 0.03, description: 'Occasional strong winds' },
      moderate: { productionMalus: 0.03, growthPenalty: 0.03, happinessPenalty: 0.03, healthRisk: 0.1, description: 'Regular storm systems — some disruption' },
      high: { productionMalus: 0.08, growthPenalty: 0.06, happinessPenalty: 0.07, healthRisk: 0.25, description: 'Frequent superstorms — damage to exposed structures' },
      extreme: { productionMalus: 0.18, growthPenalty: 0.12, happinessPenalty: 0.12, healthRisk: 0.55, description: 'Perpetual megastorms — fortified habitats mandatory' },
      lethal: { productionMalus: 0.35, growthPenalty: 0.25, happinessPenalty: 0.25, healthRisk: 0.85, description: 'Unstoppable tempests — surface operations untenable' },
    },
    mitigations: ['Storm shields (Building)', 'Underground habitats (Infrastructure)', 'Atmospheric processors (Tech L5)', 'Energy harvester integration (Tech)'],
  },
  toxic: {
    id: 'toxic',
    name: 'Toxicity',
    icon: '☠️',
    description: 'Chemical toxins, acid rain, corrosive atmosphere or water',
    thresholds: [
      { min: 0, max: 5, severity: 'none' },
      { min: 5, max: 20, severity: 'low' },
      { min: 20, max: 40, severity: 'moderate' },
      { min: 40, max: 65, severity: 'high' },
      { min: 65, max: 90, severity: 'extreme' },
      { min: 90, max: Infinity, severity: 'lethal' },
    ],
    effects: {
      none: { productionMalus: 0, growthPenalty: 0, happinessPenalty: 0, healthRisk: 0, description: 'Non-toxic environment' },
      low: { productionMalus: 0.02, growthPenalty: 0.01, happinessPenalty: 0.02, healthRisk: 0.08, description: 'Minor pollutants — filtration adequate' },
      moderate: { productionMalus: 0.06, growthPenalty: 0.03, happinessPenalty: 0.05, healthRisk: 0.25, description: 'Toxic compounds present — atmospheric processors needed' },
      high: { productionMalus: 0.15, growthPenalty: 0.08, happinessPenalty: 0.1, healthRisk: 0.5, description: 'Hazardous atmosphere — sealed habitats required' },
      extreme: { productionMalus: 0.3, growthPenalty: 0.18, happinessPenalty: 0.2, healthRisk: 0.8, description: 'Corrosive environment — extreme protective measures' },
      lethal: { productionMalus: 0.55, growthPenalty: 0.35, happinessPenalty: 0.35, healthRisk: 1.0, description: 'Immediately lethal — planetary engineering required' },
    },
    mitigations: ['Atmospheric processors (Building)', 'Sealed habitats (Building)', 'Chemical scrubbers (Infrastructure)', 'Bio-remediation (Research L7)'],
  },
  thermal: {
    id: 'thermal',
    name: 'Thermal Extremes',
    icon: '🌡️',
    description: 'Extreme temperatures from freezing cold to searing heat',
    thresholds: [
      { min: -1, max: 1, severity: 'none' },
      { min: 1, max: 15, severity: 'low' },
      { min: 15, max: 30, severity: 'moderate' },
      { min: 30, max: 50, severity: 'high' },
      { min: 50, max: 75, severity: 'extreme' },
      { min: 75, max: Infinity, severity: 'lethal' },
    ],
    effects: {
      none: { productionMalus: 0, growthPenalty: 0, happinessPenalty: 0, healthRisk: 0, description: 'Temperate climate' },
      low: { productionMalus: 0.01, growthPenalty: 0.01, happinessPenalty: 0.02, healthRisk: 0.02, description: 'Mild temperature variations' },
      moderate: { productionMalus: 0.03, growthPenalty: 0.03, happinessPenalty: 0.05, healthRisk: 0.08, description: 'Noticeable temperature stress — HVAC essential' },
      high: { productionMalus: 0.08, growthPenalty: 0.08, happinessPenalty: 0.1, healthRisk: 0.2, description: 'Severe temperatures — specialized cooling/heating needed' },
      extreme: { productionMalus: 0.2, growthPenalty: 0.15, happinessPenalty: 0.18, healthRisk: 0.45, description: 'Extreme thermal conditions — heavily insulated structures' },
      lethal: { productionMalus: 0.4, growthPenalty: 0.3, happinessPenalty: 0.3, healthRisk: 0.8, description: 'Temperature beyond material tolerances — requires exotic solutions' },
    },
    mitigations: ['Thermal control systems (Building)', 'Insulated habitats (Infrastructure)', 'Geothermal regulation (Tech L4)', 'Orbital sunshades (Megastructure)'],
  },
  gravity: {
    id: 'gravity',
    name: 'Gravity Anomaly',
    icon: '⚡',
    description: 'Abnormal gravitational forces affecting operations and health',
    thresholds: [
      { min: 0, max: 0.3, severity: 'none' },
      { min: 0.3, max: 1, severity: 'low' },
      { min: 1, max: 2, severity: 'moderate' },
      { min: 2, max: 3.5, severity: 'high' },
      { min: 3.5, max: 5, severity: 'extreme' },
      { min: 5, max: Infinity, severity: 'lethal' },
    ],
    effects: {
      none: { productionMalus: 0, growthPenalty: 0, happinessPenalty: 0, healthRisk: 0, description: 'Standard gravity' },
      low: { productionMalus: 0.01, growthPenalty: 0.01, happinessPenalty: 0.01, healthRisk: 0.02, description: 'Slight gravity deviation — minimal effect' },
      moderate: { productionMalus: 0.04, growthPenalty: 0.03, happinessPenalty: 0.03, healthRisk: 0.1, description: 'Noticeable gravity difference — physical strain' },
      high: { productionMalus: 0.1, growthPenalty: 0.08, happinessPenalty: 0.08, healthRisk: 0.3, description: 'High gravity — impaired mobility, reinforced structures' },
      extreme: { productionMalus: 0.25, growthPenalty: 0.18, happinessPenalty: 0.15, healthRisk: 0.6, description: 'Extreme gravity — specialized equipment mandatory' },
      lethal: { productionMalus: 0.5, growthPenalty: 0.35, happinessPenalty: 0.3, healthRisk: 0.95, description: 'Crushing gravity — only automated operations possible' },
    },
    mitigations: ['Artificial gravity generators (Tech L8)', 'Structural reinforcement (Building)', 'Low-G adaptation training (Facility)', 'Exoskeleton support (Equipment)'],
  },
  magnetic: {
    id: 'magnetic',
    name: 'Magnetic Anomaly',
    icon: '🧲',
    description: 'Disruptive magnetic fields interfering with electronics and navigation',
    thresholds: [
      { min: 0, max: 30, severity: 'none' },
      { min: 30, max: 60, severity: 'low' },
      { min: 60, max: 90, severity: 'moderate' },
      { min: 90, max: 120, severity: 'high' },
      { min: 120, max: 160, severity: 'extreme' },
      { min: 160, max: Infinity, severity: 'lethal' },
    ],
    effects: {
      none: { productionMalus: 0, growthPenalty: 0, happinessPenalty: 0, healthRisk: 0, description: 'Stable magnetic field' },
      low: { productionMalus: 0.01, growthPenalty: 0, happinessPenalty: 0.01, healthRisk: 0.02, description: 'Mild magnetic interference' },
      moderate: { productionMalus: 0.04, growthPenalty: 0.01, happinessPenalty: 0.03, healthRisk: 0.08, description: 'Disruptive to unshielded electronics' },
      high: { productionMalus: 0.1, growthPenalty: 0.03, happinessPenalty: 0.06, healthRisk: 0.2, description: 'Strong magnetic fields — full EM shielding required' },
      extreme: { productionMalus: 0.22, growthPenalty: 0.06, happinessPenalty: 0.12, healthRisk: 0.5, description: 'Intense magnetic activity — data corruption risks' },
      lethal: { productionMalus: 0.45, growthPenalty: 0.15, happinessPenalty: 0.25, healthRisk: 0.85, description: 'Magnetic chaos — biological systems disrupted' },
    },
    mitigations: ['EM shielding (Building)', 'Magnetic dampeners (Tech L5)', 'Underground bunkers (Infrastructure)', 'Optical data transmission (Tech)'],
  },
  biological: {
    id: 'biological',
    name: 'Biohazard',
    icon: '🦠',
    description: 'Pathogenic organisms, allergens, and biological risks',
    thresholds: [
      { min: 0, max: 10, severity: 'none' },
      { min: 10, max: 30, severity: 'low' },
      { min: 30, max: 55, severity: 'moderate' },
      { min: 55, max: 75, severity: 'high' },
      { min: 75, max: 95, severity: 'extreme' },
      { min: 95, max: Infinity, severity: 'lethal' },
    ],
    effects: {
      none: { productionMalus: 0, growthPenalty: 0, happinessPenalty: 0, healthRisk: 0, description: 'No biological hazards' },
      low: { productionMalus: 0.01, growthPenalty: 0.02, happinessPenalty: 0.01, healthRisk: 0.05, description: 'Mild allergens — minor health precautions' },
      moderate: { productionMalus: 0.04, growthPenalty: 0.05, happinessPenalty: 0.03, healthRisk: 0.18, description: 'Pathogenic organisms — biofilters needed' },
      high: { productionMalus: 0.1, growthPenalty: 0.1, happinessPenalty: 0.08, healthRisk: 0.4, description: 'Hazardous biosphere — full quarantine protocols' },
      extreme: { productionMalus: 0.22, growthPenalty: 0.2, happinessPenalty: 0.15, healthRisk: 0.7, description: 'Extreme biohazard — sterile habitats only' },
      lethal: { productionMalus: 0.45, growthPenalty: 0.35, happinessPenalty: 0.3, healthRisk: 1.0, description: 'Lethal pathogens — colonization infeasible' },
    },
    mitigations: ['Biofiltration systems (Building)', 'Quarantine protocols (Infrastructure)', 'Medical research (Research L5)', 'Genetic adaptation (Tech L8)'],
  },
};

const HAZARD_MAP: Record<string, { type: HazardTypeId; pattern: RegExp | null; value: number | null }[]> = {
  'earth-like': [
    { type: 'radiation', pattern: null, value: 5 },
    { type: 'seismic', pattern: null, value: 15 },
    { type: 'storm', pattern: null, value: 10 },
    { type: 'toxic', pattern: null, value: 3 },
    { type: 'thermal', pattern: null, value: 2 },
    { type: 'gravity', pattern: null, value: 0.1 },
    { type: 'magnetic', pattern: null, value: 20 },
    { type: 'biological', pattern: null, value: 8 },
  ],
};

export function getDefaultHazardMap(planetTypeId: string, stats: { radioactivity: number; seismicActivity: number; stormIntensity: number; gravity: number; magneticField: number; avgTemp: number; waterCoverage: number }): { type: HazardTypeId; value: number }[] {
  const thermalValue = Math.abs(stats.avgTemp) / 20;
  const gravityDiff = Math.abs(stats.gravity - 1);
  const bioValue = Math.max(0, (stats.waterCoverage > 50 ? 30 : 0) + (stats.avgTemp > -10 && stats.avgTemp < 40 ? 15 : 0));

  return [
    { type: 'radiation', value: stats.radioactivity },
    { type: 'seismic', value: stats.seismicActivity },
    { type: 'storm', value: stats.stormIntensity },
    { type: 'toxic', value: 0 },
    { type: 'thermal', value: Math.min(100, thermalValue * 20) },
    { type: 'gravity', value: Math.min(10, gravityDiff * 3) },
    { type: 'magnetic', value: stats.magneticField },
    { type: 'biological', value: Math.min(100, bioValue) },
  ];
}

export function assessHazardSeverity(rawValue: number, thresholds: { min: number; max: number; severity: HazardSeverity }[]): HazardSeverity {
  for (const t of thresholds) {
    if (rawValue >= t.min && rawValue < t.max) return t.severity;
  }
  return 'lethal';
}

export function assessPlanetHazards(
  planetTypeId: string,
  planetName: string,
  stats: { radioactivity: number; seismicActivity: number; stormIntensity: number; gravity: number; magneticField: number; avgTemp: number; waterCoverage: number },
  dangers: string[],
): PlanetHazardAssessment {
  const hazardValues = getDefaultHazardMap(planetTypeId, stats);

  const hazards = hazardValues.map((hv) => {
    const hazardType = HAZARD_TYPES[hv.type];
    const severity = assessHazardSeverity(hv.value, hazardType.thresholds);
    return {
      type: hv.type,
      name: hazardType.name,
      icon: hazardType.icon,
      severity,
      rawValue: hv.value,
      effect: hazardType.effects[severity],
      description: hazardType.effects[severity].description,
    };
  });

  let maxSevIdx = 0;
  const sevOrder: HazardSeverity[] = ['none', 'low', 'moderate', 'high', 'extreme', 'lethal'];
  for (const h of hazards) {
    const idx = sevOrder.indexOf(h.severity);
    if (idx > maxSevIdx) maxSevIdx = idx;
  }
  const overallSeverity = sevOrder[maxSevIdx];

  const overallProductionMalus = hazards.reduce((sum, h) => sum + h.effect.productionMalus, 0);
  const overallGrowthPenalty = hazards.reduce((sum, h) => sum + h.effect.growthPenalty, 0);
  const overallHappinessPenalty = hazards.reduce((sum, h) => sum + h.effect.happinessPenalty, 0);

  const mitigations = hazards.flatMap((h) => {
    const ht = HAZARD_TYPES[h.type];
    return h.severity !== 'none' ? ht.mitigations : [];
  });

  return {
    planetTypeId,
    planetName,
    hazards,
    overallSeverity,
    overallProductionMalus: Math.min(1, overallProductionMalus),
    overallGrowthPenalty: Math.min(1, overallGrowthPenalty),
    overallHappinessPenalty: Math.min(1, overallHappinessPenalty),
    mitigations: [...new Set(mitigations)],
    dangers,
    safeForColonization: overallSeverity !== 'lethal',
  };
}
