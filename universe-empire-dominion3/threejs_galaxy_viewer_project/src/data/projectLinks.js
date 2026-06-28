export const PROJECT_SOURCE_LINKS = [
  {
    id: "client",
    label: "Client UI",
    path: "client/",
    description: "Main game frontend pages, UI shells, and browser-facing application code.",
    category: "app",
  },
  {
    id: "server",
    label: "Server",
    path: "server/",
    description: "Backend route handlers, auth logic, and game service endpoints.",
    category: "app",
  },
  {
    id: "shared",
    label: "Shared",
    path: "shared/",
    description: "Shared types, models, and cross-layer game logic used by client and server.",
    category: "core",
  },
  {
    id: "src",
    label: "Root Source",
    path: "src/",
    description: "Primary source tree for shared runtime code and game systems.",
    category: "core",
  },
  {
    id: "backend",
    label: "Backend",
    path: "backend/",
    description: "Additional backend services and supporting server-side modules.",
    category: "app",
  },
  {
    id: "frontend",
    label: "Frontend",
    path: "frontend/",
    description: "Supporting frontend modules and alternate client-side source layout.",
    category: "app",
  },
  {
    id: "game-source-app",
    label: "Game Source App",
    path: "game-source/app/",
    description: "Game-source application layer tied to deployment and content workflows.",
    category: "game-source",
  },
  {
    id: "game-source-public",
    label: "Game Source Public",
    path: "game-source/public/",
    description: "Browser-delivered runtime files, including exported 3D assets.",
    category: "game-source",
  },
  {
    id: "game-source-resources",
    label: "Game Source Resources",
    path: "game-source/resources/",
    description: "Source resources and authoring-time 3D content for the main game.",
    category: "game-source",
  },
];

export const VIEWER_ASSET_MOUNTS = [
  {
    label: "Viewer Runtime Assets",
    path: "threejs_galaxy_viewer_project/assets/",
    purpose: "Standalone browser viewer textures, models, and placeholder templates.",
  },
  {
    label: "Main Game Public 3D",
    path: "game-source/public/assets/3d/",
    purpose: "Web-runtime 3D exports that the main game can deliver to players.",
  },
  {
    label: "Main Game Source 3D",
    path: "game-source/resources/3d/",
    purpose: "Higher-fidelity source assets before conversion into runtime packages.",
  },
];

export const GAME_FILE_LINKS = [
  {
    id: "shared-universe-config",
    label: "Universe Config",
    path: "shared/config/universeConfig.ts",
    description: "Core universe rules and high-level game structure values.",
    tags: ["command", "navigation", "celestials"],
  },
  {
    id: "shared-universe-generation",
    label: "Universe Generation",
    path: "shared/config/universeGenerationConfig.ts",
    description: "Universe and galaxy generation data that can feed viewer structure.",
    tags: ["command", "navigation", "intelligence", "celestials"],
  },
  {
    id: "shared-planet-types",
    label: "Planet Types",
    path: "shared/config/planetTypesConfig.ts",
    description: "Planet classes and biome-style data for world presentation.",
    tags: ["celestials", "economy"],
  },
  {
    id: "shared-interstellar-travel",
    label: "Interstellar Travel",
    path: "shared/config/interstellarTravelConfig.ts",
    description: "Travel, stargate, wormhole, and sector-to-sector movement rules.",
    tags: ["navigation", "fleets", "celestials"],
  },
  {
    id: "shared-schema",
    label: "Shared Schema",
    path: "shared/schema.ts",
    description: "Database schema for planets, fleets, universe events, and empire values.",
    tags: ["command", "economy", "fleets", "celestials", "intelligence"],
  },
  {
    id: "server-storage",
    label: "Server Storage",
    path: "server/storage.ts",
    description: "Server-side persistence and retrieval for fleets, universe events, and progression data.",
    tags: ["command", "economy", "fleets", "intelligence"],
  },
  {
    id: "client-celestial-objects",
    label: "Celestial Objects",
    path: "client/src/lib/celestialObjects.ts",
    description: "Client-side celestial object logic that can inform planet, moon, and deep-space display.",
    tags: ["celestials", "intelligence"],
  },
  {
    id: "client-interstellar-data",
    label: "Interstellar Data",
    path: "client/src/lib/interstellarData.ts",
    description: "Client-side interstellar structures, coordinates, and navigation-facing content.",
    tags: ["navigation", "celestials", "intelligence"],
  },
  {
    id: "client-empire-manager",
    label: "Empire Manager",
    path: "client/src/lib/empireManager.ts",
    description: "Empire and progression state used by command and economy screens.",
    tags: ["command", "economy", "diplomacy"],
  },
  {
    id: "client-military-data",
    label: "Military Data",
    path: "client/src/lib/militaryData.ts",
    description: "Fleet, force, and tactical data that can feed military scene overlays.",
    tags: ["fleets", "intelligence", "command"],
  },
  {
    id: "client-3d-browser-scene",
    label: "Client 3D Browser Scene",
    path: "client/src/components/views3d/BrowserStrategyScene.tsx",
    description: "Existing main-game 3D browser scene component for closer integration paths.",
    tags: ["settings", "celestials", "command"],
  },
  {
    id: "client-3d-scene-config",
    label: "Client 3D Scene Config",
    path: "client/src/components/views3d/sceneConfig.ts",
    description: "Scene-layer settings and configuration for the client 3D view stack.",
    tags: ["settings", "celestials", "navigation"],
  },
];

const PAGE_TAG_OVERRIDES = {
  "command-overview": ["command"],
  "command-posture": ["command", "intelligence"],
  "command-summits": ["command", "diplomacy"],
  "navigation-routes": ["navigation"],
  "navigation-sectors": ["navigation", "command"],
  "navigation-jump": ["navigation", "celestials"],
  "intel-threat": ["intelligence", "fleets"],
  "intel-recon": ["intelligence", "navigation"],
  "intel-anomalies": ["intelligence", "celestials"],
  "economy-extraction": ["economy", "celestials"],
  "economy-trade": ["economy", "diplomacy"],
  "economy-logistics": ["economy", "fleets", "navigation"],
  "fleets-formations": ["fleets", "command"],
  "fleets-patrols": ["fleets", "intelligence"],
  "fleets-expeditions": ["fleets", "celestials", "intelligence"],
  "diplomacy-alliances": ["diplomacy", "command"],
  "diplomacy-borders": ["diplomacy", "intelligence"],
  "diplomacy-envoys": ["diplomacy", "navigation"],
  "celestials-system": ["celestials", "navigation"],
  "celestials-planets": ["celestials", "economy"],
  "celestials-interstellar": ["celestials", "intelligence", "navigation"],
  "settings-overview": ["settings", "command"],
  "settings-keyboard": ["settings"],
  "settings-controller": ["settings"],
};

export function getGameFileLinksForPage(pageId) {
  const tags = PAGE_TAG_OVERRIDES[pageId] || [];
  return GAME_FILE_LINKS.filter((entry) => entry.tags.some((tag) => tags.includes(tag)));
}
