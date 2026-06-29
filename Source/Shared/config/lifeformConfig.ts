export interface LifeformBonus {
  fieldBonus: number;
  resourceBonus: number;
  researchBonus: number;
  defenseBonus: number;
  shipBonus: number;
  speedBonus: number;
  energyBonus: number;
}

export interface LifeformDefinition {
  id: string;
  name: string;
  description: string;
  bonuses: LifeformBonus;
  color: string;
}

export const LIFEFORM_DEFINITIONS: LifeformDefinition[] = [
  {
    id: "humans",
    name: "Humans",
    description: "Adaptable species with balanced bonuses across all domains.",
    bonuses: { fieldBonus: 0, resourceBonus: 1, researchBonus: 1, defenseBonus: 1, shipBonus: 1, speedBonus: 1, energyBonus: 1 },
    color: "text-blue-600",
  },
  {
    id: "rocktal",
    name: "Rock'tal",
    description: "Silicon-based lifeform with enhanced defense and resource production.",
    bonuses: { fieldBonus: 5, resourceBonus: 1.1, researchBonus: 1, defenseBonus: 1.2, shipBonus: 1, speedBonus: 1, energyBonus: 1 },
    color: "text-amber-600",
  },
  {
    id: "mechas",
    name: "Mechas",
    description: "Cybernetic beings with a focus on technology and ship performance.",
    bonuses: { fieldBonus: 10, resourceBonus: 1, researchBonus: 1.25, defenseBonus: 1, shipBonus: 1.15, speedBonus: 1, energyBonus: 1 },
    color: "text-cyan-600",
  },
  {
    id: "kaelesh",
    name: "Kaelesh",
    description: "Ethereal beings with exploration abilities and fleet speed bonuses.",
    bonuses: { fieldBonus: 15, resourceBonus: 1, researchBonus: 1, defenseBonus: 1, shipBonus: 1, speedBonus: 1.2, energyBonus: 1 },
    color: "text-purple-600",
  },
];

export const LIFEFORM_MAP: Record<string, LifeformDefinition> = Object.fromEntries(
  LIFEFORM_DEFINITIONS.map((lf) => [lf.id, lf])
);

export const DEFAULT_LIFEFORM = "humans";
