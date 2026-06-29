export const COMMANDER_MAX_LEVEL = 999;
export const COMMANDER_MAX_TIER = 99;

export type CommanderTalentBranch =
  | 'warfare'
  | 'logistics'
  | 'science'
  | 'engineering'
  | 'diplomacy'
  | 'espionage';

export interface CommanderTitleTier {
  tier: number;
  title: string;
  badge: string;
}

export interface CommanderTalentNode {
  id: string;
  name: string;
  description: string;
  branch: CommanderTalentBranch;
  tier: number;
  requiredLevel: number;
  maxRank: number;
  prerequisiteNodeIds: string[];
  effects: Record<string, number>;
}

export interface CommanderTalentTreeDefinition {
  maxLevel: number;
  maxTier: number;
  levelsPerTier: number;
  titleTiers: CommanderTitleTier[];
  branches: CommanderTalentBranch[];
  nodes: CommanderTalentNode[];
}

const LEVELS_PER_TIER = Math.ceil(COMMANDER_MAX_LEVEL / COMMANDER_MAX_TIER);

const BRANCH_DESCRIPTORS: Record<CommanderTalentBranch, { label: string; stat: string; bonusScale: number }> = {
  warfare: { label: 'Warfare Doctrine', stat: 'attackPower', bonusScale: 1.8 },
  logistics: { label: 'Logistics Chain', stat: 'resourceEfficiency', bonusScale: 1.4 },
  science: { label: 'Scientific Mastery', stat: 'researchSpeed', bonusScale: 1.6 },
  engineering: { label: 'Engineering Matrix', stat: 'buildSpeed', bonusScale: 1.5 },
  diplomacy: { label: 'Diplomatic Influence', stat: 'tradeBonus', bonusScale: 1.3 },
  espionage: { label: 'Shadow Intelligence', stat: 'intelPower', bonusScale: 1.7 },
};

const TITLE_TRACK: Array<{ title: string; badge: string }> = [
  { title: 'Cadet', badge: '🟢' },
  { title: 'Lieutenant', badge: '🔷' },
  { title: 'Commander', badge: '⚔️' },
  { title: 'Captain', badge: '🛡️' },
  { title: 'Commodore', badge: '⭐' },
  { title: 'Admiral', badge: '👑' },
  { title: 'High Admiral', badge: '🌌' },
  { title: 'Star Marshal', badge: '☄️' },
  { title: 'Grand Regent', badge: '🜂' },
  { title: 'Eternal Strategos', badge: '♾️' },
];

function generateCommanderTitleTiers(): CommanderTitleTier[] {
  return Array.from({ length: COMMANDER_MAX_TIER }, (_, index) => {
    const tier = index + 1;
    const titleBand = Math.min(TITLE_TRACK.length - 1, Math.floor(index / 10));
    const titleEntry = TITLE_TRACK[titleBand];
    return {
      tier,
      title: `${titleEntry.title} T${tier}`,
      badge: titleEntry.badge,
    };
  });
}

function generateTalentNodes(): CommanderTalentNode[] {
  const branches = Object.keys(BRANCH_DESCRIPTORS) as CommanderTalentBranch[];

  return branches.flatMap((branch) => {
    const descriptor = BRANCH_DESCRIPTORS[branch];

    return Array.from({ length: COMMANDER_MAX_TIER }, (_, tierIndex) => {
      const tier = tierIndex + 1;
      const requiredLevel = Math.min(COMMANDER_MAX_LEVEL, (tier - 1) * LEVELS_PER_TIER + 1);
      const previousNodeId = tier > 1 ? `talent-${branch}-t${tier - 1}` : null;
      const potency = Number((descriptor.bonusScale * (1 + tier * 0.02)).toFixed(2));

      return {
        id: `talent-${branch}-t${tier}`,
        name: `${descriptor.label} Tier ${tier}`,
        description: `Increases ${descriptor.stat} through ${branch} specialization at tier ${tier}.`,
        branch,
        tier,
        requiredLevel,
        maxRank: 5,
        prerequisiteNodeIds: previousNodeId ? [previousNodeId] : [],
        effects: {
          [descriptor.stat]: potency,
          commanderPower: Number((1 + tier * 0.05).toFixed(2)),
        },
      } satisfies CommanderTalentNode;
    });
  });
}

export const COMMANDER_TALENT_TREE: CommanderTalentTreeDefinition = {
  maxLevel: COMMANDER_MAX_LEVEL,
  maxTier: COMMANDER_MAX_TIER,
  levelsPerTier: LEVELS_PER_TIER,
  titleTiers: generateCommanderTitleTiers(),
  branches: Object.keys(BRANCH_DESCRIPTORS) as CommanderTalentBranch[],
  nodes: generateTalentNodes(),
};

export function getCommanderTierForLevel(level: number): number {
  if (level <= 1) return 1;
  return Math.min(COMMANDER_MAX_TIER, Math.max(1, Math.floor((level - 1) / LEVELS_PER_TIER) + 1));
}

export function getCommanderTitleByTier(tier: number): CommanderTitleTier {
  const safeTier = Math.min(COMMANDER_MAX_TIER, Math.max(1, tier));
  return COMMANDER_TALENT_TREE.titleTiers[safeTier - 1];
}
