import { OGAMEX_FEATURED_ASSETS, PLANET_ASSETS, THREE_D_VIEW_ASSETS } from "@shared/config";

export interface BrowserStrategyPlaceholderAsset {
  id: string;
  label: string;
  path: string;
  fallbackPath?: string;
  description: string;
}

export const VIEWS_3D_PLACEHOLDER_ASSETS = {
  nebulaBackdrop: {
    id: "scene-nebula-backdrop",
    label: "Nebula Backdrop",
    path: THREE_D_VIEW_ASSETS.NEBULA_BACKDROP.path,
    fallbackPath: OGAMEX_FEATURED_ASSETS.BACKGROUND.path,
    description: "Primary browser-strategy skybox plate for the shared 3D scene layer.",
  },
  commandPlanet: {
    id: "scene-command-planet",
    label: "Command Planet",
    path: THREE_D_VIEW_ASSETS.COMMAND_PLANET.path,
    fallbackPath: PLANET_ASSETS.TERRESTRIAL.EARTH_LIKE.path,
    description: "Foreground planet placeholder used to anchor empire and exploration pages.",
  },
  moonOutpost: {
    id: "scene-moon-outpost",
    label: "Moon Outpost",
    path: THREE_D_VIEW_ASSETS.MOON_OUTPOST.path,
    fallbackPath: OGAMEX_FEATURED_ASSETS.MOON.path,
    description: "Moon and relay placeholder used for research and logistics layers.",
  },
  fleetSilhouette: {
    id: "scene-fleet-silhouette",
    label: "Fleet Silhouette",
    path: THREE_D_VIEW_ASSETS.STARSHIP_FRIGATE.path,
    fallbackPath: OGAMEX_FEATURED_ASSETS.SHIPS.path,
    description: "Fleet silhouette plate that sells an OGame-like strategic shell without blocking the UI.",
  },
  strategicGrid: {
    id: "scene-strategic-grid",
    label: "Strategic Grid",
    path: THREE_D_VIEW_ASSETS.NEBULA_BACKDROP.path,
    fallbackPath: OGAMEX_FEATURED_ASSETS.BACKGROUND.path,
    description: "Browser-strategy tactical grid texture shown beneath menus and page panels.",
  },
  stationRing: {
    id: "scene-station-ring",
    label: "Station Ring",
    path: THREE_D_VIEW_ASSETS.DEEP_SPACE_STATION.path,
    fallbackPath: PLANET_ASSETS.EXOTIC.RING_WORLD.path,
    description: "Orbital ring placeholder for military, diplomacy, and late-game shell variants.",
  },
  universeCore: {
    id: "scene-universe-core",
    label: "Universe Core",
    path: THREE_D_VIEW_ASSETS.UNIVERSE_CORE.path,
    description: "Macro universe placeholder for realm-level strategic views and cosmology dashboards.",
  },
  spiralGalaxy: {
    id: "scene-spiral-galaxy",
    label: "Spiral Galaxy",
    path: THREE_D_VIEW_ASSETS.SPIRAL_GALAXY.path,
    description: "Galaxy-scale placeholder used for map pages, navigation, and exploration shell art.",
  },
  starCluster: {
    id: "scene-star-cluster",
    label: "Star Cluster",
    path: THREE_D_VIEW_ASSETS.STAR_CLUSTER.path,
    description: "Local stellar cluster placeholder for system maps and sector-level navigation.",
  },
  anomaly: {
    id: "scene-interstellar-anomaly",
    label: "Interstellar Anomaly",
    path: THREE_D_VIEW_ASSETS.INTERSTELLAR_ANOMALY.path,
    description: "Anomaly placeholder for events, rifts, wormholes, and hazard pages.",
  },
  asteroidField: {
    id: "scene-asteroid-field",
    label: "Asteroid Field",
    path: THREE_D_VIEW_ASSETS.ASTEROID_FIELD.path,
    description: "Asteroid field placeholder for mining sectors, debris clouds, and interstellar objects.",
  },
  ringedGasGiant: {
    id: "scene-ringed-gas-giant",
    label: "Ringed Gas Giant",
    path: THREE_D_VIEW_ASSETS.RINGED_GAS_GIANT.path,
    description: "Gas giant placeholder for solar system browsers and planetary detail headers.",
  },
  oceanWorld: {
    id: "scene-ocean-world",
    label: "Ocean World",
    path: THREE_D_VIEW_ASSETS.OCEAN_WORLD_3D.path,
    description: "Ocean planet placeholder for colony, habitability, and scout views.",
  },
  volcanicMoon: {
    id: "scene-volcanic-moon",
    label: "Volcanic Moon",
    path: THREE_D_VIEW_ASSETS.VOLCANIC_MOON.path,
    description: "Volcanic moon placeholder for hostile moons and late-game extraction fronts.",
  },
  mothership: {
    id: "scene-mothership",
    label: "Mothership",
    path: THREE_D_VIEW_ASSETS.MOTHERSHIP_DREADNOUGHT.path,
    description: "Mothership placeholder for flagship command panels and boss-scale fleets.",
  },
  jumpGate: {
    id: "scene-jump-gate",
    label: "Jump Gate",
    path: THREE_D_VIEW_ASSETS.JUMP_GATE.path,
    description: "Jump gate placeholder for stargate, warp, and hyperspace travel interfaces.",
  },
} as const satisfies Record<string, BrowserStrategyPlaceholderAsset>;

export type Views3DPlaceholderAssetKey = keyof typeof VIEWS_3D_PLACEHOLDER_ASSETS;

export const VIEWS_3D_OBJECT_COLLECTIONS = {
  universe: [
    VIEWS_3D_PLACEHOLDER_ASSETS.nebulaBackdrop,
    VIEWS_3D_PLACEHOLDER_ASSETS.universeCore,
    VIEWS_3D_PLACEHOLDER_ASSETS.spiralGalaxy,
    VIEWS_3D_PLACEHOLDER_ASSETS.starCluster,
  ],
  interstellarObjects: [
    VIEWS_3D_PLACEHOLDER_ASSETS.anomaly,
    VIEWS_3D_PLACEHOLDER_ASSETS.asteroidField,
    VIEWS_3D_PLACEHOLDER_ASSETS.jumpGate,
  ],
  planetsAndMoons: [
    VIEWS_3D_PLACEHOLDER_ASSETS.commandPlanet,
    VIEWS_3D_PLACEHOLDER_ASSETS.oceanWorld,
    VIEWS_3D_PLACEHOLDER_ASSETS.ringedGasGiant,
    VIEWS_3D_PLACEHOLDER_ASSETS.moonOutpost,
    VIEWS_3D_PLACEHOLDER_ASSETS.volcanicMoon,
  ],
  fleetsAndStructures: [
    VIEWS_3D_PLACEHOLDER_ASSETS.fleetSilhouette,
    VIEWS_3D_PLACEHOLDER_ASSETS.mothership,
    VIEWS_3D_PLACEHOLDER_ASSETS.stationRing,
  ],
} as const;
