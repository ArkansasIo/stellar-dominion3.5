/**
 * Custom Lab Creation System Configuration
 * Defines lab customization options, templates, and progression
 */

export const CUSTOM_LAB_CONFIG = {
  // Lab size tiers
  LAB_SIZES: {
    SMALL: {
      capacity: 1,
      slots: 3,
      researchSpeedBonus: 0,
      costMultiplier: 1.0,
      upgradeCost: 10000,
    },
    MEDIUM: {
      capacity: 3,
      slots: 6,
      researchSpeedBonus: 0.05,
      costMultiplier: 1.5,
      upgradeCost: 50000,
    },
    LARGE: {
      capacity: 5,
      slots: 10,
      researchSpeedBonus: 0.10,
      costMultiplier: 2.0,
      upgradeCost: 150000,
    },
    MASSIVE: {
      capacity: 8,
      slots: 15,
      researchSpeedBonus: 0.15,
      costMultiplier: 3.0,
      upgradeCost: 500000,
    },
  },

  // Lab specializations
  SPECIALIZATIONS: {
    BALANCED: {
      bonusTypes: ['general'],
      speedBonus: 0,
      discoveryBonus: 0,
      costReduction: 0,
      workstations: ['research', 'analysis', 'documentation'],
    },
    EXPERIMENTAL: {
      bonusTypes: ['discovery', 'innovation'],
      speedBonus: 0.15,
      discoveryBonus: 0.25,
      costReduction: 0,
      workstations: ['experimental', 'testing', 'prototyping'],
    },
    ECONOMIC: {
      bonusTypes: ['efficiency', 'cost'],
      speedBonus: 0,
      discoveryBonus: 0,
      costReduction: 0.20,
      workstations: ['accounting', 'optimization', 'efficiency'],
    },
    MILITARY: {
      bonusTypes: ['weaponry', 'defense'],
      speedBonus: 0.10,
      discoveryBonus: 0.10,
      costReduction: 0.05,
      workstations: ['weapons', 'defense', 'armor'],
    },
    BIOTECHNOLOGY: {
      bonusTypes: ['biology', 'genetics', 'medicine'],
      speedBonus: 0.08,
      discoveryBonus: 0.15,
      costReduction: 0.05,
      workstations: ['genetics', 'biology', 'medicine'],
    },
  },

  // Lab modules (add-ons)
  MODULES: {
    QUANTUM_REACTOR: {
      speedBonus: 0.20,
      costPerLevel: 100000,
      maxLevel: 5,
      researchTypes: ['exotic', 'advanced'],
    },
    SYNTHESIS_CHAMBER: {
      discoveryBonus: 0.15,
      costPerLevel: 80000,
      maxLevel: 4,
      researchTypes: ['chemistry', 'materials'],
    },
    DATA_NEXUS: {
      speedBonus: 0.10,
      discoverBonus: 0.10,
      costPerLevel: 75000,
      maxLevel: 5,
      researchTypes: ['computing', 'artificial_intelligence'],
    },
    POWER_GRID: {
      costReduction: 0.15,
      costPerLevel: 60000,
      maxLevel: 3,
      researchTypes: ['all'],
    },
    REINFORCED_STRUCTURE: {
      capacityBonus: 2,
      costPerLevel: 50000,
      maxLevel: 3,
      researchTypes: ['all'],
    },
  },

  // Lab themes
  THEMES: {
    FUTURISTIC: {
      aesthetic: 'neon_tech',
      speedBonus: 0.02,
      morale: 0.05,
    },
    CLASSICAL: {
      aesthetic: 'traditional',
      speedBonus: 0,
      morale: 0.03,
    },
    ORGANIC: {
      aesthetic: 'bio_inspired',
      speedBonus: 0.03,
      morale: 0.08,
    },
    MINIMALIST: {
      aesthetic: 'clean_simple',
      speedBonus: 0.05,
      morale: 0,
    },
    INDUSTRIAL: {
      aesthetic: 'heavy_machinery',
      speedBonus: 0.08,
      morale: 0,
    },
  },

  // Progression unlocks
  PROGRESSION_UNLOCKS: {
    'TIER_2': {
      minTechCount: 5,
      unlocksSize: 'MEDIUM',
      unlocksModules: ['POWER_GRID'],
    },
    'TIER_3': {
      minTechCount: 15,
      unlocksSize: 'LARGE',
      unlocksModules: ['QUANTUM_REACTOR', 'SYNTHESIS_CHAMBER'],
    },
    'TIER_4': {
      minTechCount: 30,
      unlocksSize: 'MASSIVE',
      unlocksModules: ['DATA_NEXUS', 'REINFORCED_STRUCTURE'],
    },
  },

  // Staff hiring
  STAFF_POSITIONS: {
    DIRECTOR: {
      salary: 5000,
      speedBonus: 0.10,
      maxHire: 1,
      unlockAt: 10,
    },
    SENIOR_RESEARCHER: {
      salary: 3000,
      speedBonus: 0.07,
      maxHire: 2,
      unlockAt: 5,
    },
    JUNIOR_RESEARCHER: {
      salary: 1000,
      speedBonus: 0.03,
      maxHire: 5,
      unlockAt: 0,
    },
    TECHNICIAN: {
      salary: 800,
      costReduction: 0.05,
      maxHire: 3,
      unlockAt: 3,
    },
  },
};

export interface LabModule {
  type: keyof typeof CUSTOM_LAB_CONFIG['MODULES'];
  level: number;
}

export interface StaffMember {
  name: string;
  position: keyof typeof CUSTOM_LAB_CONFIG['STAFF_POSITIONS'];
  hiredAt: number;
  experience: number;
  morale: number;
}

export interface CustomLab {
  id: string;
  name: string;
  size: keyof typeof CUSTOM_LAB_CONFIG['LAB_SIZES'];
  specialization: keyof typeof CUSTOM_LAB_CONFIG['SPECIALIZATIONS'];
  theme: keyof typeof CUSTOM_LAB_CONFIG['THEMES'];
  modules: LabModule[];
  staff: StaffMember[];
  createdAt: number;
  lastUpgradedAt: number;
  resourcesInvested: number;
  researchCompleted: number;
  activeResearch?: string;
  customization: {
    color: string;
    name: string;
    description: string;
  };
}

/**
 * Calculate combined lab bonuses
 */
export function calculateLabBonuses(lab: Partial<CustomLab>): {
  speedBonus: number;
  discoveryBonus: number;
  costReduction: number;
  capacityBonus: number;
} {
  let speedBonus = 0;
  let discoveryBonus = 0;
  let costReduction = 0;
  let capacityBonus = 0;

  // Size bonuses
  if (lab.size) {
    speedBonus += CUSTOM_LAB_CONFIG.LAB_SIZES[lab.size].researchSpeedBonus;
  }

  // Specialization bonuses
  if (lab.specialization) {
    const spec = CUSTOM_LAB_CONFIG.SPECIALIZATIONS[lab.specialization];
    speedBonus += spec.speedBonus;
    discoveryBonus += spec.discoveryBonus;
    costReduction += spec.costReduction;
  }

  // Theme bonuses
  if (lab.theme) {
    const theme = CUSTOM_LAB_CONFIG.THEMES[lab.theme];
    speedBonus += theme.speedBonus;
  }

  // Module bonuses
  if (lab.modules) {
    lab.modules.forEach((module) => {
      const moduleConfig = CUSTOM_LAB_CONFIG.MODULES[module.type];
      if ('speedBonus' in moduleConfig) {
        speedBonus += (moduleConfig.speedBonus as number) * module.level * 0.1;
      }
      if ('discoveryBonus' in moduleConfig) {
        discoveryBonus += (moduleConfig.discoveryBonus as number) * module.level * 0.1;
      }
      if ('costReduction' in moduleConfig) {
        costReduction += (moduleConfig.costReduction as number) * module.level * 0.1;
      }
      if ('capacityBonus' in moduleConfig) {
        capacityBonus += (moduleConfig.capacityBonus as number) * module.level;
      }
    });
  }

  // Staff bonuses
  if (lab.staff) {
    lab.staff.forEach((staff) => {
      const staffConfig = CUSTOM_LAB_CONFIG.STAFF_POSITIONS[staff.position];
      if ('speedBonus' in staffConfig) {
        speedBonus += (staffConfig.speedBonus as number) * (1 + staff.experience * 0.01);
      }
      if ('costReduction' in staffConfig) {
        costReduction += (staffConfig.costReduction as number) * (1 + staff.experience * 0.01);
      }
    });
  }

  return {
    speedBonus: Math.min(speedBonus, 1.5), // Cap at 1.5x
    discoveryBonus: Math.min(discoveryBonus, 1.0), // Cap at 100%
    costReduction: Math.min(costReduction, 0.4), // Cap at 40%
    capacityBonus,
  };
}

/**
 * Calculate total upkeep cost
 */
export function calculateLabUpkeep(lab: Partial<CustomLab>): number {
  let upkeep = 500; // Base upkeep

  // Size upkeep
  if (lab.size) {
    upkeep += CUSTOM_LAB_CONFIG.LAB_SIZES[lab.size].upgradeCost * 0.01;
  }

  // Module upkeep
  if (lab.modules) {
    lab.modules.forEach((module) => {
      const moduleConfig = CUSTOM_LAB_CONFIG.MODULES[module.type];
      upkeep += moduleConfig.costPerLevel * module.level * 0.01;
    });
  }

  // Staff salaries
  if (lab.staff) {
    lab.staff.forEach((staff) => {
      upkeep += CUSTOM_LAB_CONFIG.STAFF_POSITIONS[staff.position].salary;
    });
  }

  return upkeep;
}

export type LabSizeType = keyof typeof CUSTOM_LAB_CONFIG['LAB_SIZES'];
export type SpecializationType = keyof typeof CUSTOM_LAB_CONFIG['SPECIALIZATIONS'];
export type ThemeType = keyof typeof CUSTOM_LAB_CONFIG['THEMES'];
