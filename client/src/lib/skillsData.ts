export interface Skill {
  skillId: string;
  name: string;
  description: string;
  category: string;
  maxLevel: number;
  baseTrainingTime: number;
  attributes: string[];
  effect: Record<string, number>;
}

export interface PlayerSkill {
  skillId: string;
  name: string;
  description: string;
  category: string;
  level: number;
  maxLevel: number;
  effect: Record<string, number>;
}

export interface AvailableSkill {
  skillId: string;
  name: string;
  description: string;
  category: string;
  currentLevel: number;
  maxLevel: number;
  trainingTime: number;
  attributes: string[];
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
  electronic: "Electronic",
  mechanical: "Mechanical",
  industry: "Industry",
  science: "Science",
  social: "Social"
};

export const ATTRIBUTE_NAMES = {
  intelligence: "Intelligence",
  memory: "Memory",
  charisma: "Charisma",
  perception: "Perception",
  willpower: "Willpower"
};