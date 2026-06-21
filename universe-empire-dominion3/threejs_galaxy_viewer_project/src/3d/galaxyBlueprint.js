function createRng(seed) {
  let value = seed >>> 0;
  return function next() {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

function pick(list, index) {
  return list[index % list.length];
}

const STAR_PREFIX = [
  "Aegis", "Helios", "Nyx", "Orion", "Vesper", "Atlas", "Solace", "Meridian",
  "Obsidian", "Lumen", "Cinder", "Aurora", "Zephyr", "Echo", "Bastion", "Nova",
];

const STAR_SUFFIX = [
  "Reach", "Crown", "Basin", "Nexus", "Spindle", "Drift", "Gate", "Spire",
  "Harbor", "March", "Line", "Anchor", "Current", "Belt", "Arc", "Frontier",
];

const ALLIANCES = ["Solar Accord", "Iron Helix", "Verdant League", "Crimson Pact"];

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function createMoons(rng, systemIndex, planetIndex, biome) {
  const moonCount = Math.floor(rng() * 4);
  const moons = [];

  for (let index = 0; index < moonCount; index += 1) {
    moons.push({
      id: `moon-${systemIndex}-${planetIndex}-${index}`,
      name: `${pick(["Selene", "Khepri", "Tethys", "Rhea", "Noctis", "Pavo"], systemIndex + planetIndex + index)}-${index + 1}`,
      size: 0.2 + rng() * 0.75,
      orbitRadius: 2.4 + index * 1.8 + rng() * 1.2,
      orbitSpeed: 0.006 + rng() * 0.01,
      orbitAngle: rng() * Math.PI * 2,
      biome: biome === "ice" ? "ice" : pick(["rocky", "ice", "dust", "volcanic"], systemIndex + planetIndex + index),
    });
  }

  return moons;
}

function createPlanets(rng, systemIndex, economy, threat) {
  const planetCount = 2 + Math.floor(rng() * 5);
  const planets = [];

  for (let index = 0; index < planetCount; index += 1) {
    const orbitRadius = 14 + index * (7 + rng() * 2);
    const biome = pick(["forge", "oceanic", "verdant", "barren", "storm", "ice", "gas_giant"], systemIndex + index);
    const isGasGiant = biome === "gas_giant";
    planets.push({
      id: `planet-${systemIndex}-${index}`,
      name: `${pick(["Ilios", "Tark", "Velis", "Rune", "Ceto", "Mira", "Jupiter", "Saturn", "Uranus", "Neptune"], systemIndex + index)}-${index + 1}`,
      size: isGasGiant ? (2.5 + rng() * 3) : (1.2 + rng() * 2.4),
      orbitRadius,
      orbitSpeed: 0.0008 + rng() * 0.0018,
      orbitAngle: rng() * Math.PI * 2,
      eccentricity: 0.1 + rng() * 0.3, // Elliptical orbits
      color: `hsl(${Math.floor(180 + economy * 0.8 + threat * 0.2)} 65% ${45 + index * 5}%)`,
      biome,
      worldClass: pick(["agri", "forge", "research", "core", "frontier", "fortress"], systemIndex + economy + index),
      habitability: isGasGiant ? 0 : clamp(Math.round(25 + rng() * 70 + economy * 0.08 - threat * 0.05), 0, 100),
      resourceValue: clamp(Math.round(18 + rng() * 82), 5, 100),
      moons: isGasGiant ? createMoons(rng, systemIndex, index, biome).slice(0, 8) : createMoons(rng, systemIndex, index, biome),
    });
  }

  return planets;
}

function createStations(rng, systemIndex, logistics, command) {
  const stationCount = 1 + Math.floor(rng() * 3);
  const stations = [];

  for (let index = 0; index < stationCount; index += 1) {
    stations.push({
      id: `station-${systemIndex}-${index}`,
      name: `${pick(["Bastion", "Harbor", "Relay", "Citadel", "Dock", "Spire"], systemIndex + index)}-${index + 1}`,
      role: pick(["shipyard", "trade", "defense", "science"], systemIndex + logistics + index),
      orbitRadius: 18 + index * 11 + rng() * 8,
      orbitAngle: rng() * Math.PI * 2,
      orbitSpeed: 0.0014 + rng() * 0.002,
      tier: clamp(Math.round((logistics + command) * 0.5 + rng() * 20), 10, 100),
    });
  }

  return stations;
}

function createInterstellarObjects(rng, systemIndex, anomaly, threat) {
  const objectCount = 2 + Math.floor(rng() * 5);
  const objects = [];

  for (let index = 0; index < objectCount; index += 1) {
    const type = pick(
      ["asteroid", "comet", "debris", "relay", "derelict", "anomaly"],
      systemIndex + index + anomaly,
    );
    objects.push({
      id: `object-${systemIndex}-${index}`,
      name: `${pick(["Shard", "Halo", "Drift", "Pylon", "Echo", "Remnant"], systemIndex + index)}-${index + 1}`,
      type,
      orbitRadius: 26 + index * 10 + rng() * 12,
      orbitAngle: rng() * Math.PI * 2,
      orbitSpeed: 0.0007 + rng() * 0.0024,
      elevation: (rng() - 0.5) * 8,
      size: 0.7 + rng() * 2.4,
      severity: clamp(Math.round((anomaly + threat) * 0.45 + rng() * 30), 0, 100),
    });
  }

  return objects;
}

function createAsteroidBelts(rng, threat) {
  const beltCount = 1 + Math.floor(rng() * 2);
  const belts = [];

  for (let index = 0; index < beltCount; index += 1) {
    belts.push({
      id: `belt-${index}`,
      radius: 30 + index * 18 + rng() * 14,
      thickness: 1.4 + rng() * 2.4,
      density: clamp(Math.round(40 + threat * 0.35 + rng() * 35), 20, 100),
    });
  }

  return belts;
}

function normalizeBridgeSystem(system, index) {
  return {
    ...system,
    index,
    id: system.id || `runtime-system-${index}`,
  };
}

function createProceduralSystem(rng, index, systemCount, arms, radiusScale) {
  const arm = index % arms;
  const normalized = index / systemCount;
  const spiral = normalized * Math.PI * 8.5;
  const distance = 45 + normalized * 930 + rng() * 20;
  const armOffset = (arm / arms) * Math.PI * 2;
  const wobble = (rng() - 0.5) * 0.55;
  const angle = spiral + armOffset + wobble;
  const x = Math.cos(angle) * (distance + (rng() - 0.5) * radiusScale);
  const z = Math.sin(angle) * (distance + (rng() - 0.5) * radiusScale);
  const y = (rng() - 0.5) * 120;
  const economy = clamp(Math.round(25 + rng() * 75 + (1 - normalized) * 18), 5, 100);
  const threat = clamp(Math.round(20 + rng() * 80 + normalized * 10), 4, 100);
  const logistics = clamp(Math.round(30 + rng() * 70 + economy * 0.2), 8, 100);
  const command = clamp(Math.round(18 + rng() * 85 + logistics * 0.18), 6, 100);
  const diplomacy = clamp(Math.round(15 + rng() * 85), 3, 100);
  const recon = clamp(Math.round(10 + rng() * 90), 4, 100);
  const anomaly = clamp(Math.round(rng() * 100), 0, 100);
  const jump = clamp(Math.round(logistics * 0.5 + rng() * 50), 0, 100);
  const alliance = ALLIANCES[Math.floor(rng() * ALLIANCES.length)];

  const system = {
    id: `system-${index}`,
    index,
    name: `${pick(STAR_PREFIX, index)} ${pick(STAR_SUFFIX, Math.floor(rng() * 1000) + index)}`,
    position: { x, y, z },
    arm,
    sector: `A${arm + 1}-S${String(Math.floor(distance / 120)).padStart(2, "0")}`,
    starSize: 1.7 + rng() * 2.9,
    temperature: Math.round(3100 + rng() * 6900),
    planets: createPlanets(rng, index, economy, threat),
    stations: createStations(rng, index, logistics, command),
    interstellarObjects: createInterstellarObjects(rng, index, anomaly, threat),
    asteroidBelts: createAsteroidBelts(rng, threat),
    metrics: {
      economy,
      threat,
      logistics,
      command,
      diplomacy,
      recon,
      anomaly,
      jump,
    },
    alliance,
    hasJumpGate: jump > 70,
    hasAnomaly: anomaly > 72,
    description: `${alliance} foothold in sector ${Math.floor(distance / 120) + 1} with ${economy}% economic output, ${threat}% threat pressure, and ${logistics}% logistics readiness.`,
  };

  system.primaryPlanetId =
    [...system.planets].sort(
      (left, right) => right.habitability + right.resourceValue - (left.habitability + left.resourceValue),
    )[0]?.id || null;

  return system;
}

export function buildGalaxyBlueprint(options) {
  const seed = options.seed || 1;
  const systemCount = options.systemCount || 420;
  const rng = createRng(seed);
  const bridgeSystems = (options.bridgeData?.viewerSystems || []).map(normalizeBridgeSystem);
  const systems = [...bridgeSystems];
  const arms = 5;
  const radiusScale = 22;
  const routeLanes = [...(options.bridgeData?.routeLanes || [])];
  const tradeLanes = [...(options.bridgeData?.tradeLanes || [])];
  const diplomacyLinks = [...(options.bridgeData?.diplomacyLinks || [])];
  const jumpGateLinks = [];

  for (let index = bridgeSystems.length; index < systemCount; index += 1) {
    systems.push(createProceduralSystem(rng, index, systemCount, arms, radiusScale));
  }

  const sortedByLogistics = [...systems].sort((left, right) => right.metrics.logistics - left.metrics.logistics);
  const sortedByEconomy = [...systems].sort((left, right) => right.metrics.economy - left.metrics.economy);
  const capitals = [...systems].sort((left, right) => right.metrics.command - left.metrics.command).slice(0, 10);

  for (let index = 0; index < sortedByLogistics.length - 1; index += 18) {
    const from = sortedByLogistics[index];
    const to = sortedByLogistics[Math.min(index + 1, sortedByLogistics.length - 1)];
    if (from && to) {
      routeLanes.push({ type: "route", fromId: from.id, toId: to.id });
    }
  }

  for (let index = 0; index < sortedByEconomy.length - 2; index += 24) {
    const from = sortedByEconomy[index];
    const to = sortedByEconomy[index + 2];
    if (from && to) {
      tradeLanes.push({ type: "trade", fromId: from.id, toId: to.id });
    }
  }

  for (let index = 0; index < capitals.length - 1; index += 1) {
    diplomacyLinks.push({
      fromId: capitals[index].id,
      toId: capitals[index + 1].id,
      alliance: capitals[index].alliance,
    });
  }

  // Create jump gate connections between systems with jump gates
  const jumpGateSystems = systems.filter(system => system.hasJumpGate);
  for (let i = 0; i < jumpGateSystems.length; i++) {
    for (let j = i + 1; j < jumpGateSystems.length; j++) {
      const from = jumpGateSystems[i];
      const to = jumpGateSystems[j];
      const distance = Math.sqrt(
        Math.pow(from.position.x - to.position.x, 2) +
        Math.pow(from.position.y - to.position.y, 2) +
        Math.pow(from.position.z - to.position.z, 2)
      );
      // Only connect jump gates within reasonable distance
      if (distance < 800) {
        jumpGateLinks.push({ fromId: from.id, toId: to.id });
      }
    }
  }

  return {
    systems,
    routeLanes,
    tradeLanes,
    diplomacyLinks,
    jumpGateLinks,
    capitals: capitals.map((system) => system.id),
  };
}
