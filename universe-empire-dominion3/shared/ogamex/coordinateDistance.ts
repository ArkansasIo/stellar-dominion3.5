import { UNIVERSE_CONSTANTS } from "./universeConstants";

export interface Coordinate {
  galaxy: number;
  system: number;
  position: number;
}

export interface CoordinateDistanceSettings {
  ignoreEmptySystems?: boolean;
  ignoreInactiveSystems?: boolean;
  donutGalaxy?: boolean;
}

export interface CoordinateSystemState {
  galaxy: number;
  system: number;
  occupied: boolean;
  active: boolean;
}

function clampCoordinate(raw: Partial<Coordinate>): Coordinate {
  return {
    galaxy: Math.max(UNIVERSE_CONSTANTS.MIN_GALAXY, Math.trunc(raw.galaxy || UNIVERSE_CONSTANTS.MIN_GALAXY)),
    system: Math.max(UNIVERSE_CONSTANTS.MIN_SYSTEM, Math.trunc(raw.system || UNIVERSE_CONSTANTS.MIN_SYSTEM)),
    position: Math.max(
      UNIVERSE_CONSTANTS.MIN_PLANET_POSITION,
      Math.trunc(raw.position || UNIVERSE_CONSTANTS.MIN_PLANET_POSITION),
    ),
  };
}

function countSystemsInRange(
  from: Coordinate,
  to: Coordinate,
  systems: CoordinateSystemState[],
  predicate: (system: CoordinateSystemState) => boolean,
): number {
  const start = Math.min(from.system, to.system);
  const end = Math.max(from.system, to.system);
  return systems.filter(
    (system) => system.galaxy === from.galaxy && system.system >= start && system.system <= end && predicate(system),
  ).length;
}

function countBetweenWithWrap(
  from: Coordinate,
  to: Coordinate,
  systems: CoordinateSystemState[],
  mode: "empty" | "inactive",
): number {
  const diffSystems = Math.abs(from.system - to.system);
  const altDiff = UNIVERSE_CONSTANTS.MAX_SYSTEM_COUNT - diffSystems;

  if (altDiff >= diffSystems) {
    return mode === "empty"
      ? getNumEmptySystemsLinear(from, to, systems)
      : getNumInactiveSystemsLinear(from, to, systems);
  }

  const split1: Coordinate = {
    galaxy: from.galaxy,
    system: UNIVERSE_CONSTANTS.MIN_SYSTEM,
    position: UNIVERSE_CONSTANTS.MAX_PLANET_POSITION,
  };
  const split2: Coordinate = {
    galaxy: to.galaxy,
    system: UNIVERSE_CONSTANTS.MAX_SYSTEM_COUNT,
    position: UNIVERSE_CONSTANTS.MAX_PLANET_POSITION,
  };

  return mode === "empty"
    ? getNumEmptySystemsLinear(split1, to, systems) + getNumEmptySystemsLinear(split2, from, systems)
    : getNumInactiveSystemsLinear(split1, to, systems) + getNumInactiveSystemsLinear(split2, from, systems);
}

function getNumEmptySystemsLinear(from: Coordinate, to: Coordinate, systems: CoordinateSystemState[]): number {
  const start = Math.min(from.system, to.system);
  const end = Math.max(from.system, to.system);
  const totalSystems = end - start + 1;
  const occupiedSystems = countSystemsInRange(from, to, systems, (system) => system.occupied);
  return totalSystems - occupiedSystems;
}

function getNumInactiveSystemsLinear(from: Coordinate, to: Coordinate, systems: CoordinateSystemState[]): number {
  return countSystemsInRange(from, to, systems, (system) => system.occupied && !system.active);
}

export function getNumEmptySystems(
  fromRaw: Partial<Coordinate>,
  toRaw: Partial<Coordinate>,
  systems: CoordinateSystemState[],
  settings: CoordinateDistanceSettings = {},
): number {
  if (!settings.ignoreEmptySystems) return 0;

  const from = clampCoordinate(fromRaw);
  const to = clampCoordinate(toRaw);
  if (from.galaxy !== to.galaxy) return 0;

  return settings.donutGalaxy === false
    ? getNumEmptySystemsLinear(from, to, systems)
    : countBetweenWithWrap(from, to, systems, "empty");
}

export function getNumInactiveSystems(
  fromRaw: Partial<Coordinate>,
  toRaw: Partial<Coordinate>,
  systems: CoordinateSystemState[],
  settings: CoordinateDistanceSettings = {},
): number {
  if (!settings.ignoreInactiveSystems) return 0;

  const from = clampCoordinate(fromRaw);
  const to = clampCoordinate(toRaw);
  if (from.galaxy !== to.galaxy) return 0;

  return settings.donutGalaxy === false
    ? getNumInactiveSystemsLinear(from, to, systems)
    : countBetweenWithWrap(from, to, systems, "inactive");
}
