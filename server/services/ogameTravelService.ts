export interface Coordinate {
  galaxy: number;
  system: number;
  position: number;
  type: "planet" | "moon" | "debris";
}

export function parseCoordinates(raw: string): Coordinate {
  const parts = raw.split(/[:.]/);
  return {
    galaxy: parseInt(parts[0]) || 1,
    system: parseInt(parts[1]) || 1,
    position: parseInt(parts[2]) || 1,
    type: "planet",
  };
}

export function calculateDistance(a: Coordinate, b: Coordinate): number {
  if (a.galaxy !== b.galaxy) {
    return 20000 * Math.abs(a.galaxy - b.galaxy);
  }
  if (a.system !== b.system) {
    return 2700 + 95 * Math.abs(a.system - b.system);
  }
  return 1000 + 5 * Math.abs(a.position - b.position);
}

export function calculateTravelTime(
  distance: number,
  speed: number,
  fleetSpeedPercent: number,
  isReturn: boolean,
): number {
  const speedFactor = fleetSpeedPercent / 100;
  const durationSeconds = (35000 / speed * Math.sqrt(distance * 10 / speedFactor) + 10) * (isReturn ? 1 : 1);
  return Math.ceil(durationSeconds * 1000);
}

export function calculateFuelConsumption(
  distance: number,
  shipSpeed: number,
  fuelPerUnit: number,
  unitCount: number,
  fleetSpeedPercent: number,
): number {
  const speedFactor = fleetSpeedPercent / 100;
  const fuelNeeded = unitCount * fuelPerUnit * Math.ceil(distance / 35000) * (1 + speedFactor * 0.5);
  return Math.ceil(fuelNeeded);
}

export function getFleetSpeed(units: Record<string, number>, shipSpeeds: Record<string, number>): number {
  let slowest = Infinity;
  for (const [id, count] of Object.entries(units)) {
    if (count > 0 && shipSpeeds[id] !== undefined) {
      slowest = Math.min(slowest, shipSpeeds[id]);
    }
  }
  return slowest === Infinity ? 1000 : slowest;
}

export function getTotalCargo(units: Record<string, number>, shipCapacities: Record<string, number>): number {
  let total = 0;
  for (const [id, count] of Object.entries(units)) {
    if (count > 0 && shipCapacities[id] !== undefined) {
      total += shipCapacities[id] * count;
    }
  }
  return total;
}

export const OGameShipSpeeds: Record<string, number> = {
  lightFighter: 12500,
  heavyFighter: 10000,
  cruiser: 15000,
  battleship: 10000,
  battlecruiser: 15000,
  bomber: 5000,
  destroyer: 5000,
  deathstar: 100,
  smallCargo: 5000,
  largeCargo: 7500,
  colonyShip: 2500,
  recycler: 2000,
  espionageProbe: 100000000,
  solarSatellite: 0,
};

export const OGameShipCargo: Record<string, number> = {
  lightFighter: 50,
  heavyFighter: 100,
  cruiser: 800,
  battleship: 1500,
  battlecruiser: 750,
  bomber: 500,
  destroyer: 2000,
  deathstar: 1000000,
  smallCargo: 5000,
  largeCargo: 25000,
  colonyShip: 7500,
  recycler: 20000,
  espionageProbe: 5,
  solarSatellite: 0,
};

export const OGameShipFuel: Record<string, number> = {
  lightFighter: 20,
  heavyFighter: 75,
  cruiser: 300,
  battleship: 500,
  battlecruiser: 250,
  bomber: 1000,
  destroyer: 1000,
  deathstar: 1,
  smallCargo: 20,
  largeCargo: 50,
  colonyShip: 1000,
  recycler: 300,
  espionageProbe: 1,
  solarSatellite: 0,
};
