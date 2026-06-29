export const OGAMEX_ASSET_CATEGORIES = {
  BACKGROUNDS: "backgrounds",
  CONTENT: "content",
  FLEET: "fleet",
  INTERFACE: "interface",
  BUILDINGS: "buildings",
  RESEARCH: "research",
  PLANETARY: "planetary",
} as const;

export type OgamexAssetCategory =
  (typeof OGAMEX_ASSET_CATEGORIES)[keyof typeof OGAMEX_ASSET_CATEGORIES];

export interface OgamexAssetReference {
  id: string;
  name: string;
  category: OgamexAssetCategory;
  path: string;
  sourcePath: string;
  description: string;
  tags: string[];
}

export const OGAMEX_ASSET_COLLECTIONS: readonly OgamexAssetReference[] = [
  {
    id: "ogamex-bg-main",
    name: "Command Background",
    category: OGAMEX_ASSET_CATEGORIES.BACKGROUNDS,
    path: "/assets/ogamex/backgrounds/background-large.jpg",
    sourcePath: "ogamex-source/public/img/bg/background-large.jpg",
    description: "Primary OGameX starfield background adapted for the in-game shell.",
    tags: ["background", "shell", "hero"],
  },
  {
    id: "ogamex-content-research",
    name: "Research Overview",
    category: OGAMEX_ASSET_CATEGORIES.CONTENT,
    path: "/assets/ogamex/content/research_200.jpg",
    sourcePath: "ogamex-source/public/img/content/research_200.jpg",
    description: "Research feature artwork for science- and lab-focused panels.",
    tags: ["research", "lab", "feature"],
  },
  {
    id: "ogamex-content-ships",
    name: "Fleet Overview",
    category: OGAMEX_ASSET_CATEGORIES.CONTENT,
    path: "/assets/ogamex/content/ships_200.jpg",
    sourcePath: "ogamex-source/public/img/content/ships_200.jpg",
    description: "Ship overview art suited for fleet command and compendium pages.",
    tags: ["fleet", "ships", "feature"],
  },
  {
    id: "ogamex-content-defense",
    name: "Defense Panel",
    category: OGAMEX_ASSET_CATEGORIES.CONTENT,
    path: "/assets/ogamex/content/defense_80.png",
    sourcePath: "ogamex-source/public/img/content/defense_80.png",
    description: "Compact defense icon artwork from OGameX.",
    tags: ["defense", "combat", "icon"],
  },
  {
    id: "ogamex-content-sprite",
    name: "Content Sprite Sheet",
    category: OGAMEX_ASSET_CATEGORIES.INTERFACE,
    path: "/assets/ogamex/content/sprite.jpg",
    sourcePath: "ogamex-source/public/img/content/sprite.jpg",
    description: "Sprite sheet used for classic OGameX content presentation.",
    tags: ["sprite", "interface", "classic"],
  },
  {
    id: "ogamex-layout-detail-sprites",
    name: "Detail UI Sprite Sheet",
    category: OGAMEX_ASSET_CATEGORIES.INTERFACE,
    path: "/assets/ogamex/layout/detail-spriteset.png",
    sourcePath: "ogamex-source/public/img/layout/detail-spriteset.png",
    description: "Detail panel sprite sheet from the original OGameX interface.",
    tags: ["ui", "sprite", "panels"],
  },
  {
    id: "ogamex-layout-ui-elements",
    name: "UI Elements Sprite Sheet",
    category: OGAMEX_ASSET_CATEGORIES.INTERFACE,
    path: "/assets/ogamex/layout/sprite_ui_elements.png",
    sourcePath: "ogamex-source/public/img/layout/sprite_ui_elements.png",
    description: "General interface sprite sheet reused for status and chrome inspiration.",
    tags: ["ui", "sprite", "chrome"],
  },
  {
    id: "ogamex-fleet-attack",
    name: "Attack Mission",
    category: OGAMEX_ASSET_CATEGORIES.FLEET,
    path: "/assets/ogamex/fleet/mission-attack.gif",
    sourcePath: "ogamex-source/public/img/fleet/1.gif",
    description: "Animated attack mission indicator.",
    tags: ["fleet", "attack", "mission"],
  },
  {
    id: "ogamex-fleet-transport",
    name: "Transport Mission",
    category: OGAMEX_ASSET_CATEGORIES.FLEET,
    path: "/assets/ogamex/fleet/mission-transport.gif",
    sourcePath: "ogamex-source/public/img/fleet/3.gif",
    description: "Animated transport mission indicator.",
    tags: ["fleet", "transport", "mission"],
  },
  {
    id: "ogamex-fleet-spy",
    name: "Espionage Mission",
    category: OGAMEX_ASSET_CATEGORIES.FLEET,
    path: "/assets/ogamex/fleet/mission-spy.gif",
    sourcePath: "ogamex-source/public/img/fleet/6.gif",
    description: "Animated espionage mission indicator.",
    tags: ["fleet", "spy", "mission"],
  },
  {
    id: "ogamex-galaxy-activity",
    name: "Galaxy Activity",
    category: OGAMEX_ASSET_CATEGORIES.INTERFACE,
    path: "/assets/ogamex/galaxy/activity.gif",
    sourcePath: "ogamex-source/public/img/galaxy/activity.gif",
    description: "Galaxy activity signal used for live map feedback.",
    tags: ["galaxy", "activity", "indicator"],
  },
  {
    id: "ogamex-galaxy-ajax",
    name: "Ajax Indicator",
    category: OGAMEX_ASSET_CATEGORIES.INTERFACE,
    path: "/assets/ogamex/galaxy/ajax_indicator.gif",
    sourcePath: "ogamex-source/public/img/galaxy/ajax_indicator.gif",
    description: "Loading indicator from OGameX galaxy interactions.",
    tags: ["loading", "galaxy", "indicator"],
  },
  {
    id: "ogamex-header-defense",
    name: "Defense Header",
    category: OGAMEX_ASSET_CATEGORIES.CONTENT,
    path: "/assets/ogamex/headers/defense/defense.jpg",
    sourcePath: "ogamex-source/public/img/headers/defense/defense.jpg",
    description: "Defense page header artwork used as a shell banner accent.",
    tags: ["header", "defense", "banner"],
  },
  {
    id: "ogamex-building-metal-mine",
    name: "Metal Mine",
    category: OGAMEX_ASSET_CATEGORIES.BUILDINGS,
    path: "/assets/ogamex/objects/buildings/metal_mine_small.jpg",
    sourcePath: "ogamex-source/public/img/objects/buildings/metal_mine_small.jpg",
    description: "OGameX metal mine preview image.",
    tags: ["building", "economy", "metal"],
  },
  {
    id: "ogamex-building-crystal-mine",
    name: "Crystal Mine",
    category: OGAMEX_ASSET_CATEGORIES.BUILDINGS,
    path: "/assets/ogamex/objects/buildings/crystal_mine_small.jpg",
    sourcePath: "ogamex-source/public/img/objects/buildings/crystal_mine_small.jpg",
    description: "OGameX crystal mine preview image.",
    tags: ["building", "economy", "crystal"],
  },
  {
    id: "ogamex-building-deuterium-synthesizer",
    name: "Deuterium Synthesizer",
    category: OGAMEX_ASSET_CATEGORIES.BUILDINGS,
    path: "/assets/ogamex/objects/buildings/deuterium_synthesizer_small.jpg",
    sourcePath: "ogamex-source/public/img/objects/buildings/deuterium_synthesizer_small.jpg",
    description: "OGameX deuterium synthesizer preview image.",
    tags: ["building", "economy", "deuterium"],
  },
  {
    id: "ogamex-research-energy-tech",
    name: "Energy Technology",
    category: OGAMEX_ASSET_CATEGORIES.RESEARCH,
    path: "/assets/ogamex/objects/research/energy_technology_small.jpg",
    sourcePath: "ogamex-source/public/img/objects/research/energy_technology_small.jpg",
    description: "OGameX research panel art for energy technology.",
    tags: ["research", "energy", "technology"],
  },
  {
    id: "ogamex-research-hyperspace-drive",
    name: "Hyperspace Drive",
    category: OGAMEX_ASSET_CATEGORIES.RESEARCH,
    path: "/assets/ogamex/objects/research/hyperspace_drive_small.jpg",
    sourcePath: "ogamex-source/public/img/objects/research/hyperspace_drive_small.jpg",
    description: "OGameX research panel art for hyperspace drive development.",
    tags: ["research", "drive", "hyperspace"],
  },
  {
    id: "ogamex-planet-moon-view",
    name: "Moon View",
    category: OGAMEX_ASSET_CATEGORIES.PLANETARY,
    path: "/assets/ogamex/planets/normal_moon_view.jpg",
    sourcePath: "ogamex-source/public/img/planets/normal_moon_view.jpg",
    description: "Classic moon surface view used for planetary presentation.",
    tags: ["planet", "moon", "surface"],
  },
] as const;

export const OGAMEX_FEATURED_ASSETS = {
  BACKGROUND: { ...OGAMEX_ASSET_COLLECTIONS[0], path: "/assets/backgrounds/nebula.png" },
  RESEARCH: { ...OGAMEX_ASSET_COLLECTIONS[1], path: "/assets/research/astrophysics.png" },
  SHIPS: { ...OGAMEX_ASSET_COLLECTIONS[2], path: "/assets/backgrounds/fleet_bg.png" },
  DEFENSE: { ...OGAMEX_ASSET_COLLECTIONS[12], path: "/assets/buildings/defense_cannon.png" },
  MOON: { ...OGAMEX_ASSET_COLLECTIONS[18], path: "/assets/planets/dead.png" },
} as const;

export function getOgamexAssetsByCategory(category: OgamexAssetCategory): OgamexAssetReference[] {
  return OGAMEX_ASSET_COLLECTIONS.filter((asset) => asset.category === category);
}
