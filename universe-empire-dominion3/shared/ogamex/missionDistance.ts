export interface ParsedMissionCoordinates {
  galaxy: number;
  system: number;
  planet: number;
}

export interface MissionDistanceOptions {
  galaxyCount?: number;
  systemCount?: number;
  donutGalaxy?: boolean;
  donutSystem?: boolean;
}

const DEFAULT_MISSION_DISTANCE_OPTIONS: Required<MissionDistanceOptions> = {
  galaxyCount: 256,
  systemCount: 499,
  donutGalaxy: true,
  donutSystem: true,
};

export function parseMissionCoordinates(raw: unknown): ParsedMissionCoordinates {
  const parts = String(raw || "")
    .match(/\d+/g)
    ?.map((part) => Number(part))
    .filter((value) => Number.isFinite(value) && value >= 0) || [];

  return {
    galaxy: parts[0] || 0,
    system: parts[1] || 0,
    planet: parts[2] || 0,
  };
}

export function calculateOgameMissionDistance(
  originRaw: unknown,
  destinationRaw: unknown,
  options: MissionDistanceOptions = {},
): number {
  const origin = parseMissionCoordinates(originRaw);
  const destination = parseMissionCoordinates(destinationRaw);
  const limits = { ...DEFAULT_MISSION_DISTANCE_OPTIONS, ...options };

  const galaxyDelta = Math.abs(origin.galaxy - destination.galaxy);
  const systemDelta = Math.abs(origin.system - destination.system);
  const planetDelta = Math.abs(origin.planet - destination.planet);

  if (galaxyDelta > 0) {
    const wrappedDelta = limits.donutGalaxy
      ? Math.abs(galaxyDelta - limits.galaxyCount)
      : galaxyDelta;
    return Math.min(galaxyDelta, wrappedDelta) * 20000;
  }

  if (systemDelta > 0) {
    const wrappedDelta = limits.donutSystem
      ? Math.abs(systemDelta - limits.systemCount)
      : systemDelta;
    const effectiveDelta = Math.max(1, Math.min(systemDelta, wrappedDelta));
    return effectiveDelta * 95 + 2700;
  }

  if (planetDelta > 0) {
    return planetDelta * 5 + 1000;
  }

  return 5;
}

export function calculateOgameTravelTimeSeconds(params: {
  origin: unknown;
  destination: unknown;
  slowestSpeed: number;
  speedPercent?: number;
  fleetSpeedMultiplier?: number;
  distanceOptions?: MissionDistanceOptions;
}): number {
  const {
    origin,
    destination,
    slowestSpeed,
    speedPercent = 10,
    fleetSpeedMultiplier = 1,
    distanceOptions,
  } = params;

  const distance = calculateOgameMissionDistance(origin, destination, distanceOptions);
  const effectiveSpeedPercent = Math.max(1, speedPercent);
  const effectiveFleetSpeed = Math.max(1, fleetSpeedMultiplier);
  const effectiveSlowestSpeed = Math.max(1, slowestSpeed);

  return Math.max(
    1,
    Math.round(
      (35000 / effectiveSpeedPercent * Math.sqrt((distance * 10) / effectiveSlowestSpeed) + 10) /
        effectiveFleetSpeed,
    ),
  );
}
