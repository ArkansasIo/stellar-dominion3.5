export type ArtifactRarity = "common" | "uncommon" | "rare" | "epic" | "legendary" | "ancient";
export type ArtifactType = "passive" | "active";

export interface Artifact {
  id: string;
  name: string;
  description: string;
  lore: string;
  rarity: ArtifactRarity;
  type: ArtifactType;
  bonuses: string[];
  cooldown?: number; // For active relics (ms)
  lastUsed?: number;
  image?: string; // Placeholder for now
}

export const ARTIFACTS: Artifact[] = [
  {
    id: "ancient_star_map",
    name: "Ancient Star Map",
    description: "A holographic map detailing lost hyperlanes.",
    lore: "Found in the ruins of a precursor outpost, this map shimmers with data from a million years ago.",
    rarity: "rare",
    type: "passive",
    bonuses: ["+20% Fleet Speed", "+10% Expedition Success Chance"]
  },
  {
    id: "void_crystal",
    name: "Void Crystal shard",
    description: "A crystal that pulses with dark energy.",
    lore: "It seems to absorb light around it, humming with a frequency that unsettles the crew.",
    rarity: "epic",
    type: "passive",
    bonuses: ["+15% Energy Production", "+5% Shield Strength"]
  },
  {
    id: "chronos_device",
    name: "Chronos Device",
    description: "Manipulates local spacetime.",
    lore: "A terrifying weapon or a tool for salvation? It can freeze time in a localized bubble.",
    rarity: "legendary",
    type: "active",
    bonuses: ["Instantly finish all construction queues (24h Cooldown)"],
    cooldown: 86400000 // 24h
  },
  {
    id: "terran_banner",
    name: "Old Earth Banner",
    description: "A tattered flag from the homeworld.",
    lore: "A symbol of unity and resilience from the cradle of humanity.",
    rarity: "common",
    type: "passive",
    bonuses: ["+5% Public Support", "+5% Stability"]
  },
  {
    id: "precursor_core",
    name: "Precursor AI Core",
    description: "A dormant machine intelligence.",
    lore: "It whispers equations in your sleep. It wants to build.",
    rarity: "ancient",
    type: "passive",
    bonuses: ["+25% Research Speed", "+25% Construction Speed", "-10% Stability"]
  }
];
