export interface Skill {
  skillId: string;
  name: string;
  description: string;
  category: string;
  categoryName?: string;
  maxLevel: number;
  baseTrainingTime: number;
  attributes: string[];
  effects: Record<string, number>;
  prerequisites?: Record<string, number>;
}

export interface PlayerSkill {
  skillId: string;
  name: string;
  description: string;
  category: string;
  level: number;
  maxLevel: number;
  effect: Record<string, number>;
  effects?: Record<string, number>;
}

export interface AvailableSkill {
  skillId: string;
  name: string;
  description: string;
  category: string;
  categoryName?: string;
  currentLevel: number;
  maxLevel: number;
  trainingTime: number;
  attributes: string[];
  attributeNames?: string[];
  prerequisites?: Record<string, number>;
  prerequisitesMet?: boolean;
  locked?: boolean;
  maxed?: boolean;
  queued?: boolean;
  queueItem?: SkillQueueItem | null;
  effects?: Record<string, number>;
  nextLevel?: number;
}

export interface SkillQueueItem {
  skillId: string;
  level: number;
  startTime: number;
  endTime: number;
}

export interface Attributes {
  intelligence: number;
  memory: number;
  charisma: number;
  perception: number;
  willpower: number;
}

export const SKILL_CATEGORIES = {
  combat: "Combat",
  navigation: "Navigation",
  electronic: "Electronic Warfare",
  mechanical: "Mechanical Engineering",
  industry: "Industry",
  science: "Science",
  social: "Social & Diplomacy",
  strategic: "Strategic Command",
} as const;

export const ATTRIBUTE_NAMES = {
  intelligence: "Intelligence",
  memory: "Memory",
  charisma: "Charisma",
  perception: "Perception",
  willpower: "Willpower",
} as const;
