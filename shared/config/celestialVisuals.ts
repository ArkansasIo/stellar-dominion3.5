/**
 * Stellar Dominion 2D celestial visual system.
 *
 * The registry keeps planet and moon art consistent across Galaxy, Universe,
 * Planet Command, Stations, and all related subpages.
 */

export type CelestialVisualObjectType =
  | "planet"
  | "moon"
  | "asteroid"
  | "nebula"
  | "blackhole"
  | "station"
  | "comet"
  | "empty";

export const CELESTIAL_VISUALS = {
  planets: {
    habitable: "/assets/planets/terra.png",
    jungle: "/assets/planets/terra.png",
    ocean: "/assets/planets/terra.png",
    desert: "/assets/planets/volcanic.png",
    volcanic: "/assets/planets/volcanic.png",
    ice: "/assets/planets/ice.png",
    gasGiant: "/assets/planets/gas_giant.png",
    dead: "/assets/planets/dead.png",
    exotic: "/assets/planets/star.png",
  },
  moons: {
    command: "/assets/ogamex/planets/normal_moon_view.jpg",
    cratered: "/assets/planets/dead.png",
  },
  objects: {
    asteroid: "/assets/backgrounds/asteroid_field.png",
    nebula: "/assets/backgrounds/deep_space.png",
    blackhole: "/assets/backgrounds/galaxy_map.png",
    station: "/assets/backgrounds/space_station.png",
    comet: "/assets/backgrounds/deep_space.png",
    empty: "/assets/backgrounds/deep_space.png",
  },
} as const;

const PLANET_CLASS_TO_VISUAL: Record<string, keyof typeof CELESTIAL_VISUALS.planets> = {
  M: "habitable",
  H: "desert",
  L: "jungle",
  K: "ice",
  Y: "volcanic",
  D: "dead",
  J: "gasGiant",
  T: "gasGiant",
};

export function getCelestialVisual(type: CelestialVisualObjectType, planetClass?: string, hasMoon = false): string {
  if (type === "moon") return hasMoon ? CELESTIAL_VISUALS.moons.command : CELESTIAL_VISUALS.moons.cratered;
  if (type === "planet") {
    const visual = PLANET_CLASS_TO_VISUAL[planetClass ?? "M"] ?? "habitable";
    return CELESTIAL_VISUALS.planets[visual];
  }
  return CELESTIAL_VISUALS.objects[type] ?? CELESTIAL_VISUALS.objects.empty;
}

export function getCelestialVisualLabel(type: CelestialVisualObjectType, planetClass?: string): string {
  if (type === "moon") return "Lunar orbital view";
  if (type === "planet") return `${planetClass ?? "M"}-class planetary view`;
  return `${type} field view`;
}
