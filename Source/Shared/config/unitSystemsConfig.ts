/**
 * Unit Systems Configuration
 * Covers:
 * - Unit type catalogs (troop, civilian, government, military)
 * - Train / untrain unit lifecycle
 * - Unit combat simulation
 * - Starship blueprint + construction yard queue
 */

export type ResourceBundle = {
  metal: number;
  crystal: number;
  deuterium: number;
};

export type UnitDomain = 'troop' | 'civilian' | 'government' | 'military';
export type UnitTrainingState = 'untrained' | 'trained' | 'elite';

export interface UnitTemplate {
  id: string;
  name: string;
  domain: UnitDomain;
  unitType: string;
  class: string;
  subClass: string;
  subType: string;
  tier: number;
  maxLevel: number;
  trainingTimeSec: number;
  trainingCost: ResourceBundle;
  upkeepPerHour: ResourceBundle;
  combat: {
    attack: number;
    defense: number;
    hp: number;
    speed: number;
    morale: number;
  };
}

export interface UnitPoolEntry {
  untrained: number;
  trained: number;
  elite: number;
}

export interface TrainingOrder {
  id: string;
  unitId: string;
  quantity: number;
  fromState: UnitTrainingState;
  toState: UnitTrainingState;
  startedAt: number;
  finishAt: number;
}

export interface CombatSideUnit {
  unitId: string;
  count: number;
  trainingState: UnitTrainingState;
  level?: number;
}

export interface CombatSideInput {
  name: string;
  units: CombatSideUnit[];
}

export interface CombatSimulationResult {
  winner: 'attacker' | 'defender' | 'draw';
  rounds: number;
  attackerPower: number;
  defenderPower: number;
  attackerLosses: number;
  defenderLosses: number;
  summary: string;
}

export interface StarshipBlueprint {
  id: string;
  name: string;
  class: string;
  subClass: string;
  type: string;
  subType: string;
  tier: number;
  yardTierRequired: number;
  buildTimeSec: number;
  resourceCost: ResourceBundle;
  combat: {
    attack: number;
    defense: number;
    hp: number;
    speed: number;
    cargo: number;
  };
}

export interface ConstructionOrder {
  id: string;
  blueprintId: string;
  quantity: number;
  startedAt: number;
  finishAt: number;
}

export interface ConstructionYardState {
  tier: number;
  efficiency: number;
  queue: ConstructionOrder[];
  completedShips: Record<string, number>;
}

export interface PlayerUnitSystemState {
  resources: ResourceBundle;
  unitPools: Record<string, UnitPoolEntry>;
  trainingQueue: TrainingOrder[];
  constructionYard: ConstructionYardState;
  unlockedBlueprints: string[];
}

const UNIT_DOMAIN_BASE: Array<Omit<UnitTemplate, 'id' | 'name' | 'class' | 'subClass' | 'subType' | 'unitType'>> = [
  {
    domain: 'troop',
    tier: 2,
    maxLevel: 999,
    trainingTimeSec: 240,
    trainingCost: { metal: 400, crystal: 120, deuterium: 0 },
    upkeepPerHour: { metal: 8, crystal: 3, deuterium: 1 },
    combat: { attack: 40, defense: 30, hp: 120, speed: 45, morale: 60 },
  },
  {
    domain: 'civilian',
    tier: 1,
    maxLevel: 999,
    trainingTimeSec: 180,
    trainingCost: { metal: 220, crystal: 90, deuterium: 0 },
    upkeepPerHour: { metal: 5, crystal: 2, deuterium: 0 },
    combat: { attack: 8, defense: 15, hp: 60, speed: 35, morale: 40 },
  },
  {
    domain: 'government',
    tier: 3,
    maxLevel: 999,
    trainingTimeSec: 320,
    trainingCost: { metal: 550, crystal: 260, deuterium: 80 },
    upkeepPerHour: { metal: 9, crystal: 6, deuterium: 3 },
    combat: { attack: 15, defense: 24, hp: 90, speed: 30, morale: 75 },
  },
  {
    domain: 'military',
    tier: 4,
    maxLevel: 999,
    trainingTimeSec: 420,
    trainingCost: { metal: 900, crystal: 400, deuterium: 150 },
    upkeepPerHour: { metal: 15, crystal: 7, deuterium: 5 },
    combat: { attack: 70, defense: 55, hp: 180, speed: 40, morale: 80 },
  },
];

const UNIT_VARIANTS: Record<UnitDomain, Array<{ unitType: string; class: string; subClass: string; subType: string; name: string }>> = {
  troop: [
    { unitType: 'infantry', class: 'Ground', subClass: 'Line', subType: 'Rifle', name: 'Rifle Trooper' },
    { unitType: 'infantry', class: 'Ground', subClass: 'Heavy', subType: 'Breach', name: 'Breach Trooper' },
    { unitType: 'support', class: 'Ground', subClass: 'Medical', subType: 'Field', name: 'Field Medic' },
    { unitType: 'support', class: 'Ground', subClass: 'Engineer', subType: 'Siege', name: 'Siege Engineer' },
    { unitType: 'airborne', class: 'Aerial', subClass: 'Assault', subType: 'Jump', name: 'Jump Trooper' },
  ],
  civilian: [
    { unitType: 'worker', class: 'Labor', subClass: 'Industrial', subType: 'Mine', name: 'Mine Worker' },
    { unitType: 'researcher', class: 'Science', subClass: 'Lab', subType: 'Data', name: 'Research Analyst' },
    { unitType: 'trader', class: 'Commerce', subClass: 'Market', subType: 'Logistics', name: 'Market Trader' },
    { unitType: 'colonist', class: 'Expansion', subClass: 'Settlement', subType: 'Habitat', name: 'Habitat Colonist' },
    { unitType: 'technician', class: 'Operations', subClass: 'Maintenance', subType: 'Energy', name: 'Grid Technician' },
  ],
  government: [
    { unitType: 'administrator', class: 'Administration', subClass: 'Civil', subType: 'Policy', name: 'Policy Administrator' },
    { unitType: 'diplomat', class: 'Diplomacy', subClass: 'Treaty', subType: 'Envoy', name: 'Treaty Envoy' },
    { unitType: 'governor', class: 'Leadership', subClass: 'Sector', subType: 'Command', name: 'Sector Governor' },
    { unitType: 'auditor', class: 'Oversight', subClass: 'Treasury', subType: 'Compliance', name: 'Treasury Auditor' },
    { unitType: 'magistrate', class: 'Judicial', subClass: 'Security', subType: 'Regulation', name: 'Civic Magistrate' },
  ],
  military: [
    { unitType: 'marine', class: 'Combat', subClass: 'Assault', subType: 'Boarding', name: 'Boarding Marine' },
    { unitType: 'specops', class: 'Combat', subClass: 'Covert', subType: 'Infiltration', name: 'Infiltration Operative' },
    { unitType: 'officer', class: 'Command', subClass: 'Fleet', subType: 'Tactical', name: 'Fleet Officer' },
    { unitType: 'artillery', class: 'Combat', subClass: 'Siege', subType: 'Long-Range', name: 'Siege Artillery Team' },
    { unitType: 'guardian', class: 'Defense', subClass: 'Bastion', subType: 'Shield', name: 'Shield Guardian' },
  ],
};

function getDomainBase(domain: UnitDomain) {
  return UNIT_DOMAIN_BASE.find(base => base.domain === domain) ?? UNIT_DOMAIN_BASE[0];
}

function multiplyCost(cost: ResourceBundle, factor: number): ResourceBundle {
  return {
    metal: Math.floor(cost.metal * factor),
    crystal: Math.floor(cost.crystal * factor),
    deuterium: Math.floor(cost.deuterium * factor),
  };
}

export const UNIT_SYSTEM_TEMPLATES: UnitTemplate[] = (Object.keys(UNIT_VARIANTS) as UnitDomain[]).flatMap((domain, domainIndex) => {
  const domainBase = getDomainBase(domain);

  return UNIT_VARIANTS[domain].map((variant, variantIndex) => {
    const progressionFactor = 1 + domainIndex * 0.2 + variantIndex * 0.12;
    return {
      id: `${domain}-${variant.unitType}-${variantIndex + 1}`,
      name: variant.name,
      domain,
      unitType: variant.unitType,
      class: variant.class,
      subClass: variant.subClass,
      subType: variant.subType,
      tier: Math.min(99, domainBase.tier + variantIndex),
      maxLevel: domainBase.maxLevel,
      trainingTimeSec: Math.floor(domainBase.trainingTimeSec * progressionFactor),
      trainingCost: multiplyCost(domainBase.trainingCost, progressionFactor),
      upkeepPerHour: multiplyCost(domainBase.upkeepPerHour, progressionFactor),
      combat: {
        attack: Math.floor(domainBase.combat.attack * progressionFactor),
        defense: Math.floor(domainBase.combat.defense * progressionFactor),
        hp: Math.floor(domainBase.combat.hp * progressionFactor),
        speed: Math.max(10, Math.floor(domainBase.combat.speed + variantIndex * 1.5)),
        morale: Math.min(100, Math.floor(domainBase.combat.morale + variantIndex * 2)),
      },
    };
  });
});

const BLUEPRINT_FAMILIES = [
  { class: 'Frigate', subClass: 'Escort', type: 'Combat', baseCost: { metal: 14000, crystal: 7000, deuterium: 3000 }, baseTime: 900, yardTier: 1, baseCombat: { attack: 380, defense: 260, hp: 1200, speed: 110, cargo: 3000 } },
  { class: 'Destroyer', subClass: 'Assault', type: 'Combat', baseCost: { metal: 26000, crystal: 14000, deuterium: 7000 }, baseTime: 1400, yardTier: 2, baseCombat: { attack: 760, defense: 500, hp: 2500, speed: 95, cargo: 4500 } },
  { class: 'Cruiser', subClass: 'Command', type: 'Command', baseCost: { metal: 38000, crystal: 21000, deuterium: 12000 }, baseTime: 1900, yardTier: 3, baseCombat: { attack: 980, defense: 780, hp: 4200, speed: 85, cargo: 7000 } },
  { class: 'Carrier', subClass: 'Support', type: 'Support', baseCost: { metal: 52000, crystal: 32000, deuterium: 18000 }, baseTime: 2600, yardTier: 4, baseCombat: { attack: 1150, defense: 980, hp: 6000, speed: 72, cargo: 14000 } },
  { class: 'Battleship', subClass: 'Capital', type: 'Capital', baseCost: { metal: 82000, crystal: 50000, deuterium: 28000 }, baseTime: 3400, yardTier: 5, baseCombat: { attack: 1700, defense: 1300, hp: 9000, speed: 62, cargo: 10000 } },
] as const;

const BLUEPRINT_SUBTYPES = ['Assault', 'Sentinel', 'Vanguard', 'Prime', 'Nexus', 'Aegis'] as const;

export const STARSHIP_BLUEPRINTS: StarshipBlueprint[] = BLUEPRINT_FAMILIES.flatMap((family, familyIndex) =>
  BLUEPRINT_SUBTYPES.map((subType, variantIndex) => {
    const factor = 1 + familyIndex * 0.22 + variantIndex * 0.14;
    const tier = Math.min(99, familyIndex + variantIndex + 2);

    return {
      id: `${family.class.toLowerCase()}-${subType.toLowerCase()}-bp`,
      name: `${subType} ${family.class} Blueprint`,
      class: family.class,
      subClass: family.subClass,
      type: family.type,
      subType,
      tier,
      yardTierRequired: Math.min(99, family.yardTier + Math.floor(variantIndex / 2)),
      buildTimeSec: Math.floor(family.baseTime * factor),
      resourceCost: multiplyCost(family.baseCost, factor),
      combat: {
        attack: Math.floor(family.baseCombat.attack * factor),
        defense: Math.floor(family.baseCombat.defense * factor),
        hp: Math.floor(family.baseCombat.hp * factor),
        speed: Math.max(20, Math.floor(family.baseCombat.speed - variantIndex * 2)),
        cargo: Math.floor(family.baseCombat.cargo * (1 + variantIndex * 0.08)),
      },
    };
  })
);

export const TRAINING_STATE_MULTIPLIER: Record<UnitTrainingState, number> = {
  untrained: 0.65,
  trained: 1,
  elite: 1.35,
};

export function getUnitTemplatesByDomain(domain: UnitDomain): UnitTemplate[] {
  return UNIT_SYSTEM_TEMPLATES.filter(template => template.domain === domain);
}

export function getUnitTemplate(unitId: string): UnitTemplate | undefined {
  return UNIT_SYSTEM_TEMPLATES.find(template => template.id === unitId);
}

export function getBlueprint(blueprintId: string): StarshipBlueprint | undefined {
  return STARSHIP_BLUEPRINTS.find(blueprint => blueprint.id === blueprintId);
}

export function createDefaultPlayerUnitSystemState(): PlayerUnitSystemState {
  const initialPools = UNIT_SYSTEM_TEMPLATES.reduce<Record<string, UnitPoolEntry>>((acc, template) => {
    acc[template.id] = { untrained: 30, trained: 0, elite: 0 };
    return acc;
  }, {});

  return {
    resources: { metal: 500000, crystal: 300000, deuterium: 200000 },
    unitPools: initialPools,
    trainingQueue: [],
    constructionYard: {
      tier: 3,
      efficiency: 1,
      queue: [],
      completedShips: {},
    },
    unlockedBlueprints: STARSHIP_BLUEPRINTS.slice(0, 8).map(blueprint => blueprint.id),
  };
}

function hasEnoughResources(resources: ResourceBundle, cost: ResourceBundle): boolean {
  return resources.metal >= cost.metal && resources.crystal >= cost.crystal && resources.deuterium >= cost.deuterium;
}

function subtractResources(resources: ResourceBundle, cost: ResourceBundle): ResourceBundle {
  return {
    metal: resources.metal - cost.metal,
    crystal: resources.crystal - cost.crystal,
    deuterium: resources.deuterium - cost.deuterium,
  };
}

export function queueUnitTraining(
  state: PlayerUnitSystemState,
  unitId: string,
  quantity: number,
  toState: Exclude<UnitTrainingState, 'untrained'>,
  now = Date.now(),
): { success: boolean; message: string; state: PlayerUnitSystemState } {
  const template = getUnitTemplate(unitId);
  if (!template || quantity <= 0) {
    return { success: false, message: 'Invalid training request', state };
  }

  const pool = state.unitPools[unitId] ?? { untrained: 0, trained: 0, elite: 0 };
  const sourceState: UnitTrainingState = toState === 'trained' ? 'untrained' : 'trained';
  if (pool[sourceState] < quantity) {
    return { success: false, message: `Not enough ${sourceState} units`, state };
  }

  const cost = multiplyCost(template.trainingCost, quantity);
  if (!hasEnoughResources(state.resources, cost)) {
    return { success: false, message: 'Insufficient resources for training', state };
  }

  const duration = template.trainingTimeSec * quantity;
  const updatedPool: UnitPoolEntry = { ...pool, [sourceState]: pool[sourceState] - quantity };

  return {
    success: true,
    message: `${quantity} ${template.name} queued for ${toState} training`,
    state: {
      ...state,
      resources: subtractResources(state.resources, cost),
      unitPools: {
        ...state.unitPools,
        [unitId]: updatedPool,
      },
      trainingQueue: [
        ...state.trainingQueue,
        {
          id: `train-${unitId}-${now}-${Math.floor(Math.random() * 1000)}`,
          unitId,
          quantity,
          fromState: sourceState,
          toState,
          startedAt: now,
          finishAt: now + duration * 1000,
        },
      ],
    },
  };
}

export function untrainUnits(
  state: PlayerUnitSystemState,
  unitId: string,
  quantity: number,
  fromState: Exclude<UnitTrainingState, 'untrained'>,
): { success: boolean; message: string; state: PlayerUnitSystemState } {
  const template = getUnitTemplate(unitId);
  if (!template || quantity <= 0) {
    return { success: false, message: 'Invalid untrain request', state };
  }

  const pool = state.unitPools[unitId] ?? { untrained: 0, trained: 0, elite: 0 };
  if (pool[fromState] < quantity) {
    return { success: false, message: `Not enough ${fromState} units`, state };
  }

  return {
    success: true,
    message: `${quantity} ${template.name} reverted to untrained`,
    state: {
      ...state,
      unitPools: {
        ...state.unitPools,
        [unitId]: {
          ...pool,
          [fromState]: pool[fromState] - quantity,
          untrained: pool.untrained + quantity,
        },
      },
    },
  };
}

export function processTrainingQueue(state: PlayerUnitSystemState, now = Date.now()): PlayerUnitSystemState {
  const completed = state.trainingQueue.filter(order => order.finishAt <= now);
  const pending = state.trainingQueue.filter(order => order.finishAt > now);

  if (!completed.length) {
    return state;
  }

  const unitPools = { ...state.unitPools };

  for (const order of completed) {
    const pool = unitPools[order.unitId] ?? { untrained: 0, trained: 0, elite: 0 };
    unitPools[order.unitId] = {
      ...pool,
      [order.toState]: pool[order.toState] + order.quantity,
    };
  }

  return {
    ...state,
    unitPools,
    trainingQueue: pending,
  };
}

function getCombatPower(side: CombatSideInput): number {
  return side.units.reduce((acc, unit) => {
    const template = getUnitTemplate(unit.unitId);
    if (!template || unit.count <= 0) {
      return acc;
    }

    const levelMultiplier = 1 + ((unit.level ?? 1) - 1) * 0.02;
    const trainingMultiplier = TRAINING_STATE_MULTIPLIER[unit.trainingState];
    const unitPower =
      (template.combat.attack * 1.1 + template.combat.defense + template.combat.hp * 0.3 + template.combat.morale * 0.8) *
      levelMultiplier *
      trainingMultiplier;

    return acc + unitPower * unit.count;
  }, 0);
}

export function simulateUnitCombat(attacker: CombatSideInput, defender: CombatSideInput): CombatSimulationResult {
  const attackerPower = Math.max(1, Math.floor(getCombatPower(attacker)));
  const defenderPower = Math.max(1, Math.floor(getCombatPower(defender)));

  const attackerRatio = attackerPower / (attackerPower + defenderPower);
  const defenderRatio = defenderPower / (attackerPower + defenderPower);

  const attackerLosses = Math.max(1, Math.floor((1 - attackerRatio) * 100));
  const defenderLosses = Math.max(1, Math.floor((1 - defenderRatio) * 100));

  let winner: 'attacker' | 'defender' | 'draw' = 'draw';
  if (attackerPower > defenderPower * 1.05) winner = 'attacker';
  else if (defenderPower > attackerPower * 1.05) winner = 'defender';

  const rounds = Math.max(1, Math.min(12, Math.ceil(Math.abs(attackerPower - defenderPower) / 4000) + 2));

  return {
    winner,
    rounds,
    attackerPower,
    defenderPower,
    attackerLosses,
    defenderLosses,
    summary: `${attacker.name} vs ${defender.name}: ${winner.toUpperCase()} in ${rounds} rounds`,
  };
}

export function queueStarshipConstruction(
  state: PlayerUnitSystemState,
  blueprintId: string,
  quantity: number,
  now = Date.now(),
): { success: boolean; message: string; state: PlayerUnitSystemState } {
  const blueprint = getBlueprint(blueprintId);
  if (!blueprint || quantity <= 0) {
    return { success: false, message: 'Invalid blueprint or quantity', state };
  }

  if (!state.unlockedBlueprints.includes(blueprintId)) {
    return { success: false, message: 'Blueprint is not unlocked', state };
  }

  if (state.constructionYard.tier < blueprint.yardTierRequired) {
    return { success: false, message: 'Construction yard tier too low', state };
  }

  const cost = multiplyCost(blueprint.resourceCost, quantity);
  if (!hasEnoughResources(state.resources, cost)) {
    return { success: false, message: 'Insufficient resources for construction', state };
  }

  const duration = Math.floor((blueprint.buildTimeSec * quantity) / Math.max(0.25, state.constructionYard.efficiency));

  return {
    success: true,
    message: `${quantity}x ${blueprint.name} queued in construction yard`,
    state: {
      ...state,
      resources: subtractResources(state.resources, cost),
      constructionYard: {
        ...state.constructionYard,
        queue: [
          ...state.constructionYard.queue,
          {
            id: `yard-${blueprintId}-${now}-${Math.floor(Math.random() * 1000)}`,
            blueprintId,
            quantity,
            startedAt: now,
            finishAt: now + duration * 1000,
          },
        ],
      },
    },
  };
}

export function processConstructionYard(state: PlayerUnitSystemState, now = Date.now()): PlayerUnitSystemState {
  const completed = state.constructionYard.queue.filter(order => order.finishAt <= now);
  const pending = state.constructionYard.queue.filter(order => order.finishAt > now);

  if (!completed.length) {
    return state;
  }

  const completedShips = { ...state.constructionYard.completedShips };

  for (const order of completed) {
    completedShips[order.blueprintId] = (completedShips[order.blueprintId] || 0) + order.quantity;
  }

  return {
    ...state,
    constructionYard: {
      ...state.constructionYard,
      completedShips,
      queue: pending,
    },
  };
}
