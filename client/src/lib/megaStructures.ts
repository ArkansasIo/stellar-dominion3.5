
import {
  MEGASTRUCTURES as baseMegastructures,
  MEGASTRUCTURE_CATEGORY_METADATA,
  createMegastructure,
  calculateMegastructureConstructionCost,
  getMegastructureTierFromLevel,
  type Megastructure,
  type MegastructureClass,
  type MegastructureCost,
} from '@shared/config/megastructuresConfig';

const megaStructureIcons: { [key: string]: string } = {
  'dyson-sphere': '☀️',
  'ringworld': '🪐',
  'megaforge': '🔨',
  'research-nexus': '🧠',
  'orbital-defense': '🛡️',
  'generation-ship': '🚀',
  'matter-converter': '✨',
  'dimensional-gate': '🌀',
  'stellar-engine': '⚙️',
  'nova-cannon': '💥',
};

export type MegaStructureViewModel = Megastructure & {
  templateId: string;
  icon: string;
  tier: number;
  category: MegastructureClass;
  specialAbility: string;
  stats: {
    energyOutput: number;
    productionBonus: number;
    researchBonus: number;
    populationCapacity: number;
    maintenanceCost: Megastructure['maintenanceCost'];
    constructionTime: number;
  };
  subStats: Array<{ name: string; value: number; description: string; icon: string }>;
  researchRequired: string[];
  buildingRequirements: Array<{ name: string; level: number }>;
};

const tierByCategoryOrder: Record<MegastructureClass, number> = Object.entries(MEGASTRUCTURE_CATEGORY_METADATA).reduce((acc, [key, value]) => {
  acc[key as MegastructureClass] = value.order;
  return acc;
}, {} as Record<MegastructureClass, number>);

export const MEGA_STRUCTURES = baseMegastructures.map((base: any) => {
  const mega = createMegastructure(base.id, `my-${base.id}`);
  if (!mega) return null;

  const categoryTier = tierByCategoryOrder[mega.class] || getMegastructureTierFromLevel(mega.level);

  return {
    ...mega,
    templateId: base.id,
    icon: megaStructureIcons[mega.type] || '❓',
    tier: categoryTier,
    category: mega.class,
    specialAbility: mega.primaryFunction,
    stats: {
      ...mega.currentStats,
      energyOutput: mega.currentStats.power,
      productionBonus: mega.currentStats.output,
      researchBonus: mega.currentStats.tech,
      populationCapacity: mega.currentStats.capacity * 1000,
      maintenanceCost: mega.maintenanceCost,
      constructionTime: mega.constructionTime,
    },
    subStats: [
      { name: 'Power', value: mega.currentStats.power / 10, description: 'Energy generation and output.', icon: '⚡️' },
      { name: 'Resilience', value: mega.currentStats.resilience / 10, description: 'Structural integrity and defense.', icon: '🦾' },
      { name: 'Efficiency', value: mega.currentStats.efficiency, description: 'Operational effectiveness.', icon: '✅' },
      { name: 'Capacity', value: mega.currentStats.capacity / 100, description: 'Population or resource capacity.', icon: '👥' },
    ],
    researchRequired: ['Advanced Engineering', 'Exotic Materials'],
    buildingRequirements: [{ name: 'Spaceport', level: 10 }],
  };
}).filter(Boolean) as MegaStructureViewModel[];

export const MEGA_STRUCTURE_CATEGORIES = Array.from(new Set(MEGA_STRUCTURES.map(structure => structure.category)))
  .sort((left, right) => (tierByCategoryOrder[left] || 999) - (tierByCategoryOrder[right] || 999))
  .map(category => ({
    id: category,
    label: MEGASTRUCTURE_CATEGORY_METADATA[category]?.label || category,
    description: MEGASTRUCTURE_CATEGORY_METADATA[category]?.description || '',
    order: MEGASTRUCTURE_CATEGORY_METADATA[category]?.order || 999,
  }));

export const getMegaStructuresByTier = (tier: number) => {
  return MEGA_STRUCTURES.filter(s => s.tier === tier);
}

export const getMegaStructuresByCategory = (category: MegastructureClass) => {
  return MEGA_STRUCTURES.filter(s => s.category === category);
}

export const MEGA_STRUCTURE_CLASSES = Array.from(new Set(MEGA_STRUCTURES.map(s => s.class)));

export const calculateConstructionCost = (structure: MegaStructureViewModel, level: number = 1, tier?: number) => {
  return calculateMegastructureConstructionCost(structure.templateId, level, tier ?? structure.tier);
}

export const getMegaStructureTemplateById = (templateId: string) => {
  return MEGA_STRUCTURES.find(structure => structure.templateId === templateId);
}
