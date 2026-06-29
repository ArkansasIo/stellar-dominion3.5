export interface RefineryRecipe {
  id: string;
  name: string;
  description: string;
  inputs: { resource: string; amount: number }[];
  output: { resource: string; amount: number };
  baseTimeSeconds: number;
  energyCost: number;
}

export interface RefineryType {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  maxLevel: number;
  baseBuildCost: { metal: number; crystal: number; deuterium: number };
  baseBuildTimeSeconds: number;
  upgradeCostMultiplier: number;
  baseThroughput: number;
  recipes: RefineryRecipe[];
}

export interface PlayerRefinery {
  id: string;
  userId: string;
  refineryType: string;
  level: number;
  activeRecipe: string | null;
  isActive: boolean;
  efficiency: number;
  throughput: number;
  totalProcessed: number;
  lastCollectedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export const REFINERY_TYPES: RefineryType[] = [
  {
    id: "metal_refinery",
    name: "Metal Refinery",
    description: "Converts raw crystal into refined metal alloys using intense heat processes.",
    icon: "Hammer",
    color: "text-orange-500",
    maxLevel: 50,
    baseBuildCost: { metal: 2000, crystal: 1000, deuterium: 200 },
    baseBuildTimeSeconds: 300,
    upgradeCostMultiplier: 1.35,
    baseThroughput: 100,
    recipes: [
      { id: "crystal_to_metal", name: "Crystal Smelting", description: "Smelt crystal into metal", inputs: [{ resource: "crystal", amount: 150 }], output: { resource: "metal", amount: 200 }, baseTimeSeconds: 60, energyCost: 10 },
      { id: "deuterium_to_metal", name: "Deuterium Fusion", description: "Fuse deuterium into metal", inputs: [{ resource: "deuterium", amount: 50 }], output: { resource: "metal", amount: 300 }, baseTimeSeconds: 90, energyCost: 20 },
      { id: "alloy_forge", name: "Alloy Forge", description: "Create metal alloys", inputs: [{ resource: "metal", amount: 500 }, { resource: "crystal", amount: 200 }], output: { resource: "metal", amount: 800 }, baseTimeSeconds: 120, energyCost: 30 },
    ],
  },
  {
    id: "crystal_purifier",
    name: "Crystal Purifier",
    description: "Purifies raw metal deposits into high-grade crystal compounds.",
    icon: "Gem",
    color: "text-blue-500",
    maxLevel: 50,
    baseBuildCost: { metal: 1500, crystal: 2000, deuterium: 300 },
    baseBuildTimeSeconds: 350,
    upgradeCostMultiplier: 1.35,
    baseThroughput: 80,
    recipes: [
      { id: "metal_to_crystal", name: "Metal Purification", description: "Extract crystal from metal", inputs: [{ resource: "metal", amount: 200 }], output: { resource: "crystal", amount: 150 }, baseTimeSeconds: 60, energyCost: 10 },
      { id: "energy_to_crystal", name: "Energy Crystallization", description: "Crystallize energy into crystal", inputs: [{ resource: "energy", amount: 100 }], output: { resource: "crystal", amount: 120 }, baseTimeSeconds: 45, energyCost: 5 },
      { id: "exotic_crystal", name: "Exotic Synthesis", description: "Create exotic crystal", inputs: [{ resource: "crystal", amount: 400 }, { resource: "energy", amount: 150 }], output: { resource: "crystal", amount: 600 }, baseTimeSeconds: 120, energyCost: 25 },
    ],
  },
  {
    id: "deuterium_synthesizer",
    name: "Deuterium Synthesizer",
    description: "Synthesizes deuterium from metal and crystal using nuclear fusion.",
    icon: "Atom",
    color: "text-cyan-500",
    maxLevel: 50,
    baseBuildCost: { metal: 3000, crystal: 1500, deuterium: 500 },
    baseBuildTimeSeconds: 400,
    upgradeCostMultiplier: 1.4,
    baseThroughput: 50,
    recipes: [
      { id: "metal_crystal_to_deut", name: "Fusion Synthesis", description: "Synthesize deuterium", inputs: [{ resource: "metal", amount: 250 }, { resource: "crystal", amount: 250 }], output: { resource: "deuterium", amount: 100 }, baseTimeSeconds: 90, energyCost: 25 },
      { id: "energy_to_deut", name: "Energy Conversion", description: "Convert energy to deuterium", inputs: [{ resource: "energy", amount: 300 }], output: { resource: "deuterium", amount: 80 }, baseTimeSeconds: 120, energyCost: 15 },
      { id: "heavy_water", name: "Heavy Water Process", description: "Produce heavy deuterium", inputs: [{ resource: "deuterium", amount: 100 }, { resource: "energy", amount: 200 }], output: { resource: "deuterium", amount: 200 }, baseTimeSeconds: 150, energyCost: 30 },
    ],
  },
  {
    id: "dark_matter_extractor",
    name: "Dark Matter Extractor",
    description: "Extracts dark matter from the void using exotic energy fields.",
    icon: "Eye",
    color: "text-purple-500",
    maxLevel: 30,
    baseBuildCost: { metal: 10000, crystal: 8000, deuterium: 5000 },
    baseBuildTimeSeconds: 1800,
    upgradeCostMultiplier: 1.5,
    baseThroughput: 10,
    recipes: [
      { id: "void_extraction", name: "Void Extraction", description: "Extract dark matter from void", inputs: [{ resource: "metal", amount: 1000 }, { resource: "crystal", amount: 500 }, { resource: "deuterium", amount: 200 }], output: { resource: "dark_matter", amount: 5 }, baseTimeSeconds: 300, energyCost: 50 },
      { id: "dark_catalyst", name: "Dark Catalyst", description: "Catalyze dark matter production", inputs: [{ resource: "dark_matter", amount: 2 }, { resource: "energy", amount: 500 }], output: { resource: "dark_matter", amount: 5 }, baseTimeSeconds: 240, energyCost: 40 },
    ],
  },
  {
    id: "energy_converter",
    name: "Energy Converter",
    description: "Converts raw materials into usable energy for empire operations.",
    icon: "Zap",
    color: "text-yellow-500",
    maxLevel: 50,
    baseBuildCost: { metal: 1000, crystal: 800, deuterium: 100 },
    baseBuildTimeSeconds: 200,
    upgradeCostMultiplier: 1.3,
    baseThroughput: 200,
    recipes: [
      { id: "metal_to_energy", name: "Metal Combustion", description: "Burn metal for energy", inputs: [{ resource: "metal", amount: 100 }], output: { resource: "energy", amount: 150 }, baseTimeSeconds: 30, energyCost: 0 },
      { id: "crystal_to_energy", name: "Crystal Resonance", description: "Resonate crystal for energy", inputs: [{ resource: "crystal", amount: 80 }], output: { resource: "energy", amount: 120 }, baseTimeSeconds: 30, energyCost: 0 },
      { id: "deuterium_to_energy", name: "Deuterium Fusion", description: "Fuse deuterium for massive energy", inputs: [{ resource: "deuterium", amount: 30 }], output: { resource: "energy", amount: 500 }, baseTimeSeconds: 60, energyCost: 0 },
    ],
  },
  {
    id: "resource_recycler",
    name: "Resource Recycler",
    description: "Recycles any resource type into galactic credits.",
    icon: "RefreshCw",
    color: "text-green-500",
    maxLevel: 40,
    baseBuildCost: { metal: 800, crystal: 600, deuterium: 50 },
    baseBuildTimeSeconds: 150,
    upgradeCostMultiplier: 1.3,
    baseThroughput: 300,
    recipes: [
      { id: "metal_to_credits", name: "Metal Recycling", description: "Recycle metal for credits", inputs: [{ resource: "metal", amount: 200 }], output: { resource: "credits", amount: 150 }, baseTimeSeconds: 30, energyCost: 5 },
      { id: "crystal_to_credits", name: "Crystal Recycling", description: "Recycle crystal for credits", inputs: [{ resource: "crystal", amount: 150 }], output: { resource: "credits", amount: 200 }, baseTimeSeconds: 30, energyCost: 5 },
      { id: "deuterium_to_credits", name: "Deuterium Recycling", description: "Recycle deuterium for credits", inputs: [{ resource: "deuterium", amount: 50 }], output: { resource: "credits", amount: 300 }, baseTimeSeconds: 30, energyCost: 5 },
    ],
  },
  {
    id: "antimatter_lab",
    name: "Antimatter Lab",
    description: "Produces antimatter from deuterium and energy. Extremely dangerous.",
    icon: "Skull",
    color: "text-red-500",
    maxLevel: 25,
    baseBuildCost: { metal: 15000, crystal: 12000, deuterium: 8000 },
    baseBuildTimeSeconds: 2400,
    upgradeCostMultiplier: 1.6,
    baseThroughput: 5,
    recipes: [
      { id: "deut_to_antimatter", name: "Antimatter Synthesis", description: "Synthesize antimatter", inputs: [{ resource: "deuterium", amount: 500 }, { resource: "energy", amount: 800 }], output: { resource: "antimatter", amount: 2 }, baseTimeSeconds: 600, energyCost: 100 },
      { id: "catalyzed_antimatter", name: "Catalyzed Production", description: "Catalyze antimatter production", inputs: [{ resource: "antimatter", amount: 1 }, { resource: "deuterium", amount: 200 }], output: { resource: "antimatter", amount: 3 }, baseTimeSeconds: 480, energyCost: 80 },
    ],
  },
];

export const RESOURCE_NAMES: Record<string, string> = {
  metal: "Metal",
  crystal: "Crystal",
  deuterium: "Deuterium",
  energy: "Energy",
  credits: "Credits",
  dark_matter: "Dark Matter",
  antimatter: "Antimatter",
};

export function getRefineryById(id: string): RefineryType | undefined {
  return REFINERY_TYPES.find((r) => r.id === id);
}

export function getRecipeById(refineryId: string, recipeId: string): RefineryRecipe | undefined {
  const refinery = getRefineryById(refineryId);
  return refinery?.recipes.find((r) => r.id === recipeId);
}

export function calculateRefineryCost(level: number, baseCost: { metal: number; crystal: number; deuterium: number }, multiplier: number) {
  return {
    metal: Math.floor(baseCost.metal * Math.pow(multiplier, level)),
    crystal: Math.floor(baseCost.crystal * Math.pow(multiplier, level)),
    deuterium: Math.floor(baseCost.deuterium * Math.pow(multiplier, level)),
  };
}

export function calculateRefineryEfficiency(level: number): number {
  return Math.min(1, 0.5 + level * 0.01);
}

export function calculateRefineryThroughput(baseThroughput: number, level: number): number {
  return Math.floor(baseThroughput * (1 + level * 0.05));
}

export function calculateRecipeYield(recipe: RefineryRecipe, efficiency: number, throughput: number): { amount: number; timeSeconds: number } {
  const amount = Math.floor(recipe.output.amount * efficiency * (throughput / 100));
  const timeSeconds = Math.max(10, Math.floor(recipe.baseTimeSeconds / (1 + (throughput - 100) / 200)));
  return { amount, timeSeconds };
}
