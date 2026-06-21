export type HabitatKind = "planet" | "moon" | "moonbase" | "starbase" | "space-station";

export interface HabitatConditionInput {
  kind: HabitatKind;
  name: string;
  coordinates?: string;
  temperature?: number;
  waterPercentage?: number;
  habitability?: number;
  population?: number;
  level?: number;
  integrity?: number;
  stability?: number;
  storyAct?: number;
}

export interface HabitatStatLine {
  label: string;
  value: number;
  max: number;
  helper: string;
}

export interface HabitatModifier {
  name: string;
  effect: string;
  source: string;
}

export interface DiseaseProfile {
  name: string;
  severity: "low" | "moderate" | "high" | "critical";
  spread: string;
  symptoms: string[];
  gameplayEffects: string[];
}

export interface RecoveryMethod {
  name: string;
  type: "medical" | "engineering" | "policy" | "logistics";
  effect: string;
  requirement: string;
}

export interface HabitatEvent {
  name: string;
  category: "environment" | "disease" | "infrastructure" | "story";
  severity: "minor" | "major" | "critical";
  description: string;
  gameplayImpact: string;
  response: string;
}

export interface StoryTieIn {
  title: string;
  summary: string;
  missionDirective: string;
  stakes: string;
}

export interface HabitatConditionProfile {
  habitat: HabitatKind;
  habitatLabel: string;
  name: string;
  environmentClass: string;
  healthRating: number;
  riskRating: number;
  stats: HabitatStatLine[];
  subStats: HabitatStatLine[];
  buffs: HabitatModifier[];
  debuffs: HabitatModifier[];
  disease: DiseaseProfile;
  recoveryMethods: RecoveryMethod[];
  events: HabitatEvent[];
  storyTieIn: StoryTieIn;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function hashString(value: string) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }
  return hash;
}

function pickFromSeed<T>(entries: T[], seed: number, offset = 0): T {
  return entries[(seed + offset) % entries.length] as T;
}

function getHabitatLabel(kind: HabitatKind) {
  switch (kind) {
    case "moon":
      return "Moon";
    case "moonbase":
      return "Moon Base";
    case "starbase":
      return "Starbase";
    case "space-station":
      return "Space Station";
    default:
      return "Planet";
  }
}

function getEnvironmentClass(kind: HabitatKind, temperature: number, waterPercentage: number, seed: number) {
  if (kind === "planet") {
    if (temperature > 340) return "Scorched Frontier";
    if (waterPercentage > 55) return "Hydrosphere World";
    if (temperature < 230) return "Cryo Frontier";
    return pickFromSeed(["Temperate Core", "Dust Belt Colony", "Stormline Basin"], seed);
  }
  if (kind === "moon") return pickFromSeed(["Regolith Expanse", "Vacuum Scar", "Tidal Fracture"], seed);
  if (kind === "moonbase") return pickFromSeed(["Shielded Lunar Habitat", "Subsurface Bastion", "Helium-3 Stronghold"], seed);
  if (kind === "starbase") return pickFromSeed(["Fortress Anchor", "Border Citadel", "Relay Bastion"], seed);
  return pickFromSeed(["Orbital Habitat Ring", "Dockyard Platform", "Trade Spine"], seed);
}

function getDiseaseTemplate(kind: HabitatKind, riskRating: number, seed: number): DiseaseProfile {
  const severity: DiseaseProfile["severity"] =
    riskRating >= 82 ? "critical" : riskRating >= 66 ? "high" : riskRating >= 42 ? "moderate" : "low";

  const diseaseMap: Record<HabitatKind, Array<Omit<DiseaseProfile, "severity">>> = {
    planet: [
      {
        name: "Dust Lung Fever",
        spread: "Airborne spores carried through mining districts and crop domes.",
        symptoms: ["Respiratory strain", "Worker fatigue", "Reduced morale"],
        gameplayEffects: ["Population growth slowed", "Mining yield reduced", "Food upkeep increased"],
      },
      {
        name: "Crimson Mire Pox",
        spread: "Waterborne contamination in reservoir and marsh biomes.",
        symptoms: ["Fever spikes", "Water purity collapse", "Civil panic"],
        gameplayEffects: ["Water efficiency reduced", "Happiness lowered", "Hospital load increased"],
      },
      {
        name: "Aurora Nerve Sickness",
        spread: "Electromagnetic storms destabilize implants and nervous systems.",
        symptoms: ["Coordination loss", "Drone mishaps", "Blackout episodes"],
        gameplayEffects: ["Automation reduced", "Research cadence lowered", "Construction delays"],
      },
    ],
    moon: [
      {
        name: "Regolith Fever",
        spread: "Microscopic dust intrusion through seals and excavation tunnels.",
        symptoms: ["Lung irritation", "Suit contamination", "Readiness loss"],
        gameplayEffects: ["Scout efficiency reduced", "Repair queue increases", "Defensive response slowed"],
      },
      {
        name: "Vacuum Stress Syndrome",
        spread: "Seal micro-fractures expose crews to repeated decompression stress.",
        symptoms: ["Bone fatigue", "Sleep disruption", "Fear spikes"],
        gameplayEffects: ["Morale reduced", "Personnel recovery slowed", "Intel uptime reduced"],
      },
      {
        name: "Darkside Isolation Shock",
        spread: "Extended low-light deployment impacts cognitive stability.",
        symptoms: ["Alertness drop", "Command friction", "Crew turnover"],
        gameplayEffects: ["Sensor efficiency lowered", "Reaction speed reduced", "Policy unrest increased"],
      },
    ],
    moonbase: [
      {
        name: "Seal Breach Rot",
        spread: "Recycled-air microbial bloom inside lunar habitation decks.",
        symptoms: ["Filter overload", "Coughing fits", "Crew loss of confidence"],
        gameplayEffects: ["Habitation capacity reduced", "Maintenance costs increased", "Stealth rating lowered"],
      },
      {
        name: "Helium Burn Syndrome",
        spread: "Improper reactor venting saturates service corridors.",
        symptoms: ["Skin irritation", "Instrument drift", "Dock accidents"],
        gameplayEffects: ["Jump gate cooldown increased", "Resource amplification reduced", "Repair throughput lowered"],
      },
      {
        name: "Lunar Spine Degradation",
        spread: "Low-gravity service stress weakens long-term staff performance.",
        symptoms: ["Mobility loss", "Medical demand spikes", "Command turnover"],
        gameplayEffects: ["Population support reduced", "Hospital demand increased", "Training speed reduced"],
      },
    ],
    starbase: [
      {
        name: "Dockyard Rust Bloom",
        spread: "Nanocorrosion propagates through high-traffic docking spines.",
        symptoms: ["Hull pitting", "Fuel leaks", "Defense relay failures"],
        gameplayEffects: ["Ship repair speed reduced", "Integrity drain increased", "Defense coordination lowered"],
      },
      {
        name: "Reactor Ash Syndrome",
        spread: "Particulate contamination from overloaded power cores.",
        symptoms: ["Heat spikes", "Crew respiratory risk", "Sensor ghosts"],
        gameplayEffects: ["Power reserve reduced", "Weapon lock instability", "Sortie uptime lowered"],
      },
      {
        name: "Barracks Contagion",
        spread: "High-density troop staging creates rapid disease transmission.",
        symptoms: ["Readiness drop", "Training stoppage", "Medical strain"],
        gameplayEffects: ["Army morale reduced", "Garrison output reduced", "Mobilization cost increased"],
      },
    ],
    "space-station": [
      {
        name: "Zero-G Atrophy",
        spread: "Long-term orbital exposure without full gravitic recovery cycles.",
        symptoms: ["Muscle loss", "Navigation sickness", "Crew fatigue"],
        gameplayEffects: ["Trade throughput reduced", "Dock crew efficiency lowered", "Construction uptime reduced"],
      },
      {
        name: "Vent Bloom",
        spread: "Humidity pockets foster microbial growth in life-support ducts.",
        symptoms: ["Allergic flare", "System clogging", "Civilian concern"],
        gameplayEffects: ["Life support strain increased", "Population happiness reduced", "Medical costs increased"],
      },
      {
        name: "Circuit Vein Parasite",
        spread: "Bio-electric contamination interferes with shipyard control lines.",
        symptoms: ["Drone desync", "Power flicker", "Cargo misrouting"],
        gameplayEffects: ["Factory speed reduced", "Logistics penalties", "Drone attrition increased"],
      },
    ],
  };

  const template = pickFromSeed(diseaseMap[kind], seed, 3);
  return { ...template, severity };
}

function buildRecoveryMethods(kind: HabitatKind, disease: DiseaseProfile): RecoveryMethod[] {
  const shared: RecoveryMethod[] = [
    {
      name: "Emergency Medical Sweep",
      type: "medical",
      effect: `Cuts ${disease.name} spread and restores population readiness.`,
      requirement: "Requires hospital capacity, med supplies, and trained staff.",
    },
    {
      name: "Quarantine Grid",
      type: "policy",
      effect: "Reduces outbreak spread at the cost of short-term production.",
      requirement: "Requires stability above 40 and active command compliance.",
    },
    {
      name: "Supply Purge and Reissue",
      type: "logistics",
      effect: "Cleans contaminated food, water, or parts to remove pressure debuffs.",
      requirement: "Consumes extra logistics cycles and reserve stock.",
    },
  ];

  if (kind === "starbase" || kind === "space-station" || kind === "moonbase") {
    shared.push({
      name: "Hull and Ventilation Overhaul",
      type: "engineering",
      effect: "Repairs structural breaches, clears ducts, and restores environmental integrity.",
      requirement: "Requires engineering crews, parts, and dock availability.",
    });
  } else {
    shared.push({
      name: "Biosphere Remediation",
      type: "engineering",
      effect: "Stabilizes terrain, water, and climate systems to recover habitability.",
      requirement: "Requires terraforming or environmental control infrastructure.",
    });
  }

  return shared;
}

function buildEvents(_kind: HabitatKind, seed: number, riskRating: number, storyAct: number): HabitatEvent[] {
  const environmentalEvents: Array<Omit<HabitatEvent, "severity">> = [
    {
      name: "Magnetic Storm Front",
      category: "environment",
      description: "Unstable electromagnetic weather scrambles sensors and autonomous systems.",
      gameplayImpact: "Research, targeting, and drone uptime are reduced for one cycle.",
      response: "Route extra power into shielded relays and delay sensitive launches.",
    },
    {
      name: "Pathogen Bloom",
      category: "disease",
      description: "Dormant contaminants reactivate in air, water, or filter systems.",
      gameplayImpact: "Population morale drops and workforce efficiency is penalized.",
      response: "Deploy quarantine teams, med drones, and purification sweeps.",
    },
    {
      name: "Structural Fatigue Cascade",
      category: "infrastructure",
      description: "Critical support beams, domes, or docking spines hit a maintenance threshold.",
      gameplayImpact: "Integrity loss raises repair costs and slows military readiness.",
      response: "Redirect engineers, suspend expansion queues, and stabilize the frame.",
    },
    {
      name: "Narrative Crisis Trigger",
      category: "story",
      description: `Act ${storyAct} escalates local pressure with story-linked sabotage and unrest.`,
      gameplayImpact: "Hazard levels intensify until the linked chapter mission is addressed.",
      response: "Advance story missions to unlock stabilizing bonuses and emergency aid.",
    },
  ];

  const generatedEvents: HabitatEvent[] = environmentalEvents.slice(0, 3).map((entry, index) => ({
    ...entry,
    severity:
      riskRating + index * 8 >= 84
        ? "critical"
        : riskRating + index * 8 >= 60
          ? "major"
          : "minor",
  }));

  return generatedEvents.concat([
    {
      ...environmentalEvents[3],
      severity: storyAct >= 8 ? "critical" : storyAct >= 4 ? "major" : "minor",
    },
  ]);
}

export function createHabitatConditionProfile(input: HabitatConditionInput): HabitatConditionProfile {
  const seed = hashString(`${input.kind}:${input.name}:${input.coordinates || ""}`);
  const storyAct = clamp(input.storyAct || 1, 1, 12);
  const temperature = input.temperature ?? (input.kind === "planet" ? 285 : input.kind === "moon" ? 180 : 295);
  const waterPercentage = input.waterPercentage ?? (input.kind === "planet" ? 32 : 2);
  const habitability = input.habitability ?? (input.kind === "planet" ? 72 : input.kind === "moon" ? 24 : 68);
  const level = input.level ?? 1;
  const population = input.population ?? 0;
  const integrity = input.integrity ?? 72;
  const stability = input.stability ?? 70;

  const environmentalPressure = clamp(
    (Math.abs(temperature - 288) / 2.8) +
      (100 - habitability) * 0.42 +
      (input.kind === "planet" ? Math.abs(28 - waterPercentage) * 0.4 : 14) +
      Math.max(0, 45 - stability) * 0.55,
    5,
    100,
  );
  const diseasePressure = clamp(
    environmentalPressure * 0.45 + Math.min(population / 50000, 18) + Math.max(0, 70 - integrity) * 0.35 + storyAct * 1.5,
    4,
    100,
  );
  const healthRating = clamp(100 - Math.round((environmentalPressure * 0.55) + (diseasePressure * 0.35)), 5, 99);
  const riskRating = clamp(Math.round((environmentalPressure + diseasePressure) / 2), 1, 99);
  const environmentClass = getEnvironmentClass(input.kind, temperature, waterPercentage, seed);
  const disease = getDiseaseTemplate(input.kind, riskRating, seed);

  const stats: HabitatStatLine[] = [
    {
      label: "Biosphere Stability",
      value: clamp(Math.round(habitability * 0.7 + stability * 0.3), 1, 100),
      max: 100,
      helper: "Controls long-term population performance and environmental collapse risk.",
    },
    {
      label: "Atmospheric Integrity",
      value: clamp(Math.round((integrity + habitability) / 2), 1, 100),
      max: 100,
      helper: "Determines air quality, pressure retention, and seal safety.",
    },
    {
      label: "Pathogen Pressure",
      value: diseasePressure,
      max: 100,
      helper: "Represents disease spread, contamination load, and medical demand.",
    },
    {
      label: "Structural Stress",
      value: clamp(Math.round(100 - integrity + level * 2), 1, 100),
      max: 100,
      helper: "Tracks framework fatigue, dome cracking, hull wear, and service overload.",
    },
  ];

  const subStats: HabitatStatLine[] = [
    {
      label: "Water Purity",
      value: clamp(Math.round(waterPercentage + integrity * 0.4), 1, 100),
      max: 100,
      helper: "Water quality affects disease spread, morale, and farm efficiency.",
    },
    {
      label: "Medical Coverage",
      value: clamp(Math.round(55 + level * 3 + stability * 0.2 - diseasePressure * 0.35), 1, 100),
      max: 100,
      helper: "Higher coverage improves recovery speed and reduces outbreak downtime.",
    },
    {
      label: "Quarantine Readiness",
      value: clamp(Math.round(40 + level * 4 + integrity * 0.2 - storyAct * 2), 1, 100),
      max: 100,
      helper: "Emergency containment strength for disease, sabotage, and toxic leaks.",
    },
    {
      label: "Repair Throughput",
      value: clamp(Math.round(45 + level * 5 + integrity * 0.25 - environmentalPressure * 0.25), 1, 100),
      max: 100,
      helper: "Determines how fast the habitat can recover from event and debuff damage.",
    },
  ];

  const buffs: HabitatModifier[] = [
    {
      name: "Local Adaptation",
      effect: `+${clamp(Math.round(level * 1.6), 1, 25)}% resistance to recurring ${input.kind} hazards.`,
      source: `${getHabitatLabel(input.kind)} crews have adapted to the local pressure profile.`,
    },
    {
      name: "Doctrine Resilience",
      effect: `+${clamp(Math.round(stability / 8), 4, 14)} stability and quarantine efficiency.`,
      source: "Command discipline reduces panic during health and environmental crises.",
    },
  ];

  const debuffs: HabitatModifier[] = [
    {
      name: disease.name,
      effect: `-${clamp(Math.round(diseasePressure / 9), 4, 18)}% workforce efficiency until controlled.`,
      source: disease.spread,
    },
    {
      name: "Environmental Strain",
      effect: `-${clamp(Math.round(environmentalPressure / 10), 3, 16)}% production, morale, or sortie uptime.`,
      source: `${environmentClass} conditions continue to pressure local systems.`,
    },
  ];

  const storyTieIn: StoryTieIn = {
    title: `Act ${storyAct} Crisis Thread`,
    summary: `${input.name} sits on a live frontline where planetary survival, orbital control, and civilian morale feed directly into campaign momentum.`,
    missionDirective: `Stabilize ${getHabitatLabel(input.kind).toLowerCase()} conditions before pushing deeper into chapter ${Math.min(10, storyAct)} objectives.`,
    stakes: "Unchecked hazards raise unrest, lower logistics readiness, and make story missions harder to close cleanly.",
  };

  return {
    habitat: input.kind,
    habitatLabel: getHabitatLabel(input.kind),
    name: input.name,
    environmentClass,
    healthRating,
    riskRating,
    stats,
    subStats,
    buffs,
    debuffs,
    disease,
    recoveryMethods: buildRecoveryMethods(input.kind, disease),
    events: buildEvents(input.kind, seed, riskRating, storyAct),
    storyTieIn,
  };
}
