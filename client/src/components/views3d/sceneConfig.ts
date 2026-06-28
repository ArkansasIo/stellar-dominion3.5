import { VIEWS_3D_PLACEHOLDER_ASSETS } from "./placeholderAssets";
import type { BrowserStrategyPlaceholderAsset } from "./placeholderAssets";

export type BrowserStrategySceneTheme =
  | "empire"
  | "research"
  | "military"
  | "exploration"
  | "diplomacy"
  | "economy"
  | "system";

export interface BrowserStrategyScenePreset {
  id: BrowserStrategySceneTheme;
  title: string;
  palette: {
    base: string;
    accent: string;
    glow: string;
    grid: string;
  };
  starCount: number;
  driftSpeed: number;
  orbiters: number;
  assetLayout: {
    hero: BrowserStrategyPlaceholderAsset;
    support: BrowserStrategyPlaceholderAsset;
    fleet: BrowserStrategyPlaceholderAsset;
    grid: BrowserStrategyPlaceholderAsset;
    ring: BrowserStrategyPlaceholderAsset;
    skybox: BrowserStrategyPlaceholderAsset;
  };
}

export const BROWSER_STRATEGY_SCENE_PRESETS: Record<BrowserStrategySceneTheme, BrowserStrategyScenePreset> = {
  empire: {
    id: "empire",
    title: "Empire Command",
    palette: {
      base: "#07101e",
      accent: "#3aa9ff",
      glow: "#86ffe1",
      grid: "rgba(70, 155, 255, 0.18)",
    },
    starCount: 130,
    driftSpeed: 0.34,
    orbiters: 4,
    assetLayout: {
      hero: VIEWS_3D_PLACEHOLDER_ASSETS.commandPlanet,
      support: VIEWS_3D_PLACEHOLDER_ASSETS.moonOutpost,
      fleet: VIEWS_3D_PLACEHOLDER_ASSETS.fleetSilhouette,
      grid: VIEWS_3D_PLACEHOLDER_ASSETS.strategicGrid,
      ring: VIEWS_3D_PLACEHOLDER_ASSETS.stationRing,
      skybox: VIEWS_3D_PLACEHOLDER_ASSETS.nebulaBackdrop,
    },
  },
  research: {
    id: "research",
    title: "Research Array",
    palette: {
      base: "#08131c",
      accent: "#4bc0ff",
      glow: "#77f9ff",
      grid: "rgba(93, 220, 255, 0.2)",
    },
    starCount: 150,
    driftSpeed: 0.24,
    orbiters: 5,
    assetLayout: {
      hero: VIEWS_3D_PLACEHOLDER_ASSETS.moonOutpost,
      support: VIEWS_3D_PLACEHOLDER_ASSETS.commandPlanet,
      fleet: VIEWS_3D_PLACEHOLDER_ASSETS.fleetSilhouette,
      grid: VIEWS_3D_PLACEHOLDER_ASSETS.strategicGrid,
      ring: VIEWS_3D_PLACEHOLDER_ASSETS.stationRing,
      skybox: VIEWS_3D_PLACEHOLDER_ASSETS.nebulaBackdrop,
    },
  },
  military: {
    id: "military",
    title: "Fleet Theater",
    palette: {
      base: "#120c14",
      accent: "#ff7a4d",
      glow: "#ffcf66",
      grid: "rgba(255, 116, 72, 0.16)",
    },
    starCount: 120,
    driftSpeed: 0.4,
    orbiters: 3,
    assetLayout: {
      hero: VIEWS_3D_PLACEHOLDER_ASSETS.fleetSilhouette,
      support: VIEWS_3D_PLACEHOLDER_ASSETS.stationRing,
      fleet: VIEWS_3D_PLACEHOLDER_ASSETS.fleetSilhouette,
      grid: VIEWS_3D_PLACEHOLDER_ASSETS.strategicGrid,
      ring: VIEWS_3D_PLACEHOLDER_ASSETS.commandPlanet,
      skybox: VIEWS_3D_PLACEHOLDER_ASSETS.nebulaBackdrop,
    },
  },
  exploration: {
    id: "exploration",
    title: "Frontier Survey",
    palette: {
      base: "#04131b",
      accent: "#72b7ff",
      glow: "#8dfff1",
      grid: "rgba(122, 193, 255, 0.18)",
    },
    starCount: 170,
    driftSpeed: 0.46,
    orbiters: 6,
    assetLayout: {
      hero: VIEWS_3D_PLACEHOLDER_ASSETS.spiralGalaxy,
      support: VIEWS_3D_PLACEHOLDER_ASSETS.ringedGasGiant,
      fleet: VIEWS_3D_PLACEHOLDER_ASSETS.jumpGate,
      grid: VIEWS_3D_PLACEHOLDER_ASSETS.strategicGrid,
      ring: VIEWS_3D_PLACEHOLDER_ASSETS.starCluster,
      skybox: VIEWS_3D_PLACEHOLDER_ASSETS.nebulaBackdrop,
    },
  },
  diplomacy: {
    id: "diplomacy",
    title: "Diplomatic Orbit",
    palette: {
      base: "#100c1a",
      accent: "#b783ff",
      glow: "#8df5ff",
      grid: "rgba(167, 123, 255, 0.18)",
    },
    starCount: 110,
    driftSpeed: 0.2,
    orbiters: 4,
    assetLayout: {
      hero: VIEWS_3D_PLACEHOLDER_ASSETS.stationRing,
      support: VIEWS_3D_PLACEHOLDER_ASSETS.commandPlanet,
      fleet: VIEWS_3D_PLACEHOLDER_ASSETS.fleetSilhouette,
      grid: VIEWS_3D_PLACEHOLDER_ASSETS.strategicGrid,
      ring: VIEWS_3D_PLACEHOLDER_ASSETS.moonOutpost,
      skybox: VIEWS_3D_PLACEHOLDER_ASSETS.nebulaBackdrop,
    },
  },
  economy: {
    id: "economy",
    title: "Trade Constellation",
    palette: {
      base: "#12110d",
      accent: "#fbb24d",
      glow: "#ffe47c",
      grid: "rgba(251, 178, 77, 0.16)",
    },
    starCount: 100,
    driftSpeed: 0.16,
    orbiters: 3,
    assetLayout: {
      hero: VIEWS_3D_PLACEHOLDER_ASSETS.commandPlanet,
      support: VIEWS_3D_PLACEHOLDER_ASSETS.stationRing,
      fleet: VIEWS_3D_PLACEHOLDER_ASSETS.fleetSilhouette,
      grid: VIEWS_3D_PLACEHOLDER_ASSETS.strategicGrid,
      ring: VIEWS_3D_PLACEHOLDER_ASSETS.moonOutpost,
      skybox: VIEWS_3D_PLACEHOLDER_ASSETS.nebulaBackdrop,
    },
  },
  system: {
    id: "system",
    title: "System Diagnostics Field",
    palette: {
      base: "#091016",
      accent: "#7fa8ff",
      glow: "#87f1ff",
      grid: "rgba(127, 168, 255, 0.18)",
    },
    starCount: 90,
    driftSpeed: 0.12,
    orbiters: 2,
    assetLayout: {
      hero: VIEWS_3D_PLACEHOLDER_ASSETS.universeCore,
      support: VIEWS_3D_PLACEHOLDER_ASSETS.anomaly,
      fleet: VIEWS_3D_PLACEHOLDER_ASSETS.fleetSilhouette,
      grid: VIEWS_3D_PLACEHOLDER_ASSETS.strategicGrid,
      ring: VIEWS_3D_PLACEHOLDER_ASSETS.stationRing,
      skybox: VIEWS_3D_PLACEHOLDER_ASSETS.nebulaBackdrop,
    },
  },
};

const SECTION_THEME_MAP: Record<string, BrowserStrategySceneTheme> = {
  Empire: "empire",
  Research: "research",
  Military: "military",
  Exploration: "exploration",
  Diplomacy: "diplomacy",
  Economy: "economy",
  System: "system",
};

export function resolveShellScenePreset(section?: string): BrowserStrategyScenePreset {
  if (!section) {
    return BROWSER_STRATEGY_SCENE_PRESETS.empire;
  }

  return BROWSER_STRATEGY_SCENE_PRESETS[SECTION_THEME_MAP[section] ?? "system"];
}
