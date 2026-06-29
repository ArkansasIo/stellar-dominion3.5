/**
 * Complete Technology Tree - Expanded Technologies (800+ entries)
 * Organized across 11 branches with full tier/level systems
 * @tag #technology #research #expansions #upgrades
 */

import type { TechnologyNode } from './technologyTreeConfig';

// ============================================================================
// HELPER FUNCTION TO GENERATE TECH VARIANTS
// ============================================================================

export function generateArmorTechs(): TechnologyNode[] {
  const armors: TechnologyNode[] = [];
  const classes = ['basic', 'advanced', 'military', 'experimental'] as const;
  const categories = ['Light', 'Medium', 'Heavy', 'Ultra-Heavy', 'Exotic'];
  const materials = ['Composite', 'Ceramic', 'Steel', 'Titanium', 'Polyalloy', 'Graphite', 'Diamond-Reinforced', 'Quantum-Layered'];
  const grades = ['Reinforced', 'Advanced', 'Military', 'Experimental', 'Prototype'];

  let techCount = 0;
  for (let cat = 0; cat < categories.length; cat++) {
    for (let mat = 0; mat < materials.length; mat++) {
      for (let grade = 0; grade < grades.length; grade++) {
        for (let level = 1; level <= 3; level++) {
          const baseLevel = level + (cat + mat + grade) * 0.5;
          const tier = Math.min(5, Math.ceil((cat + mat + grade) / 3));
          const techClass = classes[Math.min(cat + grade, classes.length - 1)];

          armors.push({
            id: `armor-${cat}-${mat}-${grade}-${level}`,
            name: `${categories[cat]} ${materials[mat]} ${grades[grade]} Armor L${level}`,
            branch: 'armor',
            class: techClass,
            type: 'passive',
            category: `${categories[cat]} Armor`,
            subcategory: materials[mat],
            classification: `${grades[grade]} Grade`,
            level: baseLevel,
            tier,
            researchCost: Math.floor(50 * (level + 1) * tier * (1.2 ** baseLevel)),
            prerequisiteTechs: techCount > 0 ? [`armor-${Math.max(0, cat - 1)}-${mat}-${grade}-${Math.max(1, level - 1)}`] : [],
            minimumLevel: Math.floor(1 + baseLevel),
            minimumTechLevel: Math.floor(baseLevel),
            industrialCost: Math.floor(100 * (level + 1) * tier),
            energyCost: Math.floor(5 * (level + 1) * tier),
            materialsNeeded: {
              steel: Math.floor(50 * (level + 1)),
              aluminum: Math.floor(30 * level),
              titanium: Math.floor(20 * (level + 1) * tier),
            },
            researchTime: Math.ceil(2 + level * tier),
            stats: {
              primary: [
                {
                  name: 'Armor Rating',
                  value: 10 + baseLevel * 8,
                  modifier: 0,
                  subStats: { deflection: 5 + baseLevel * 4, absorption: 5 + baseLevel * 4 },
                },
              ],
              secondary: [],
              resistance: {
                kinetic: 10 + baseLevel * 8,
                thermal: 5 * grade,
                radiation: 2 * tier,
              },
              efficiency: 75 + tier * 3,
              reliability: 90 + tier * 2,
            },
            bonuses: {
              durability: baseLevel * 2,
              weight: -baseLevel,
            },
            description: `${categories[cat]} ${materials[mat]} armor - ${grades[grade]} specification`,
            manufacturer: ['Terran Industries', 'Krell Defense Systems', 'Zenith Armor'][techCount % 3],
            unlocksUpgrades: [],
            maxUpgradeLevel: 3 + tier,
            upgradeSlots: 5,
            isResearchable: true,
            isAvailableInMultiplayer: true,
            rarity: ['common', 'uncommon', 'rare', 'epic', 'legendary'][Math.min(4, grade)],
            discoveryBonus: baseLevel * 2,
            passiveEffect: true,
            stackable: false,
          });

          techCount++;
        }
      }
    }
  }

  return armors;
}

export function generateShieldTechs(): TechnologyNode[] {
  const shields: TechnologyNode[] = [];
  const shieldTypes = ['Kinetic', 'Thermal', 'Radiation', 'Electromagnetic', 'Exotic'];
  const shieldClasses = ['basic', 'advanced', 'military', 'experimental'] as const;
  const configurations = ['Single-Layer', 'Multi-Phase', 'Omni-Directional', 'Dynamic', 'Distributed'];
  const generations = ['Gen 1', 'Gen 2', 'Gen 3', 'Gen 4', 'Gen 5'];

  let techCount = 0;
  for (let type = 0; type < shieldTypes.length; type++) {
    for (let config = 0; config < configurations.length; config++) {
      for (let gen = 0; gen < generations.length; gen++) {
        for (let level = 1; level <= 2; level++) {
          const baseLevel = level + (type + config + gen) * 0.3;
          const tier = Math.min(5, Math.ceil((type + config + gen) / 3));
          const techClass = shieldClasses[Math.min(type + config, shieldClasses.length - 1)];

          shields.push({
            id: `shield-${type}-${config}-${gen}-${level}`,
            name: `${shieldTypes[type]} ${configurations[config]} Shield ${generations[gen]} L${level}`,
            branch: 'shields',
            class: techClass,
            type: 'active',
            category: `${shieldTypes[type]} Shields`,
            subcategory: configurations[config],
            classification: generations[gen],
            level: baseLevel,
            tier,
            researchCost: Math.floor(60 * (level + 1) * tier * (1.2 ** baseLevel)),
            prerequisiteTechs: techCount > 0 ? [`shield-${Math.max(0, type - 1)}-${config}-${gen}-${level}`] : [],
            minimumLevel: Math.floor(1 + baseLevel),
            minimumTechLevel: Math.floor(baseLevel),
            industrialCost: Math.floor(120 * (level + 1) * tier),
            energyCost: Math.floor(50 * (level + 1) * tier),
            materialsNeeded: {
              copper: Math.floor(40 * (level + 1)),
              silicon: Math.floor(30 * level),
              energy_core: Math.floor(10 * tier),
            },
            researchTime: Math.ceil(3 + level * tier),
            stats: {
              primary: [
                {
                  name: 'Shield Strength',
                  value: 50 + baseLevel * 15,
                  modifier: 0,
                  subStats: { absorption: 30 + baseLevel * 10, deflection: 20 + baseLevel * 5 },
                },
              ],
              secondary: [],
              resistance: {
                kinetic: type === 0 ? 100 + baseLevel * 20 : 20,
                thermal: type === 1 ? 100 + baseLevel * 20 : 20,
                radiation: type === 2 ? 100 + baseLevel * 20 : 10,
              },
              efficiency: 70 + tier * 3,
              reliability: 85 + tier * 2,
            },
            bonuses: {
              recharge_rate: baseLevel * 2,
              defense: baseLevel * 1.5,
            },
            description: `${shieldTypes[type]} shield - ${configurations[config]} configuration`,
            manufacturer: ['Terran Industries', 'Krell Defense', 'Zenith Shields'][techCount % 3],
            unlocksUpgrades: [],
            maxUpgradeLevel: 3 + tier,
            upgradeSlots: 5,
            isResearchable: true,
            isAvailableInMultiplayer: true,
            rarity: ['common', 'uncommon', 'rare', 'epic', 'legendary'][Math.min(4, gen)],
            discoveryBonus: baseLevel * 2,
            passiveEffect: false,
            stackable: false,
          });

          techCount++;
        }
      }
    }
  }

  return shields;
}

export function generateWeaponTechs(): TechnologyNode[] {
  const weapons: TechnologyNode[] = [];
  const weaponTypes = ['Ballistic', 'Laser', 'Missile', 'Plasma', 'Pulse', 'Particle', 'Exotic'];
  const configurations = ['Standard', 'Rapid-Fire', 'Heavy', 'Point-Defense', 'Array', 'Swarm'];
  const grades = ['Mark I', 'Mark II', 'Mark III', 'Mark IV', 'Mark V'];

  let techCount = 0;
  for (let type = 0; type < weaponTypes.length; type++) {
    for (let config = 0; config < configurations.length; config++) {
      for (let grade = 0; grade < grades.length; grade++) {
        for (let level = 1; level <= 2; level++) {
          const baseLevel = level + (type + config + grade) * 0.35;
          const tier = Math.min(5, Math.ceil((type + config + grade) / 3));

          weapons.push({
            id: `weapon-${type}-${config}-${grade}-${level}`,
            name: `${weaponTypes[type]} ${configurations[config]} ${grades[grade]} L${level}`,
            branch: 'weapons',
            class: grade < 2 ? 'basic' : grade < 3 ? 'advanced' : 'military',
            type: 'active',
            category: weaponTypes[type],
            subcategory: configurations[config],
            classification: grades[grade],
            level: baseLevel,
            tier,
            researchCost: Math.floor(70 * (level + 1) * tier * (1.2 ** baseLevel)),
            prerequisiteTechs: techCount > 0 ? [`weapon-${Math.max(0, type - 1)}-${config}-${grade}-${level}`] : [],
            minimumLevel: Math.floor(2 + baseLevel),
            minimumTechLevel: Math.floor(baseLevel),
            industrialCost: Math.floor(150 * (level + 1) * tier),
            energyCost: Math.floor(30 * (level + 1) * tier),
            materialsNeeded: {
              steel: Math.floor(80 * (level + 1)),
              copper: Math.floor(40 * level),
              electronics: Math.floor(20 * tier),
            },
            researchTime: Math.ceil(4 + level * tier),
            stats: {
              primary: [
                {
                  name: 'Damage Per Shot',
                  value: 30 + baseLevel * 12,
                  modifier: 0,
                  subStats: { damage: 25 + baseLevel * 10, penetration: 5 + baseLevel * 2 },
                },
              ],
              secondary: [],
              resistance: {},
              efficiency: 75 + tier * 2,
              reliability: 85 + tier * 2,
            },
            bonuses: {
              accuracy: baseLevel * 1.5,
              fire_rate: baseLevel * 0.5,
            },
            description: `${weaponTypes[type]} weapon system - ${configurations[config]}`,
            manufacturer: ['Terran Industries', 'Zenith Weapons', 'Krell Arms'][techCount % 3],
            unlocksUpgrades: [],
            maxUpgradeLevel: 3 + tier,
            upgradeSlots: 5,
            isResearchable: true,
            isAvailableInMultiplayer: true,
            rarity: ['common', 'uncommon', 'rare', 'epic', 'legendary'][Math.min(4, grade)],
            discoveryBonus: baseLevel * 2,
            passiveEffect: false,
            stackable: false,
          });

          techCount++;
        }
      }
    }
  }

  return weapons;
}

export function generatePropulsionTechs(): TechnologyNode[] {
  const propulsion: TechnologyNode[] = [];
  const engineTypes = ['Ion Drive', 'Plasma Drive', 'Nuclear Drive', 'Anti-Matter', 'Exotic'];
  const configurations = ['Standard', 'Turbo', 'Cruise', 'Hybrid', 'Experimental'];
  const versions = ['v1.0', 'v2.0', 'v3.0', 'v4.0', 'v5.0'];

  let techCount = 0;
  for (let type = 0; type < engineTypes.length; type++) {
    for (let config = 0; config < configurations.length; config++) {
      for (let ver = 0; ver < versions.length; ver++) {
        for (let level = 1; level <= 2; level++) {
          const baseLevel = level + (type + config + ver) * 0.4;
          const tier = Math.min(5, Math.ceil((type + config + ver) / 3));

          propulsion.push({
            id: `propulsion-${type}-${config}-${ver}-${level}`,
            name: `${engineTypes[type]} ${configurations[config]} ${versions[ver]} L${level}`,
            branch: 'propulsion',
            class: ver < 2 ? 'basic' : ver < 3 ? 'standard' : 'advanced',
            type: 'passive',
            category: engineTypes[type],
            subcategory: configurations[config],
            classification: versions[ver],
            level: baseLevel,
            tier,
            researchCost: Math.floor(60 * (level + 1) * tier * (1.2 ** baseLevel)),
            prerequisiteTechs: techCount > 0 ? [`propulsion-${Math.max(0, type - 1)}-${config}-${ver}-${level}`] : [],
            minimumLevel: Math.floor(1 + baseLevel),
            minimumTechLevel: Math.floor(baseLevel),
            industrialCost: Math.floor(200 * (level + 1) * tier),
            energyCost: Math.floor(100 * (level + 1) * tier),
            materialsNeeded: {
              titanium: Math.floor(60 * (level + 1)),
              copper: Math.floor(50 * level),
              electronics: Math.floor(40 * tier),
            },
            researchTime: Math.ceil(5 + level * tier),
            stats: {
              primary: [
                {
                  name: 'Thrust Output',
                  value: 100 + baseLevel * 20,
                  modifier: 0,
                  subStats: { acceleration: 50 + baseLevel * 10, max_velocity: 50 + baseLevel * 10 },
                },
              ],
              secondary: [],
              resistance: {},
              efficiency: 80 + tier * 2,
              reliability: 85 + tier * 2,
            },
            bonuses: {
              fuel_efficiency: baseLevel * 2,
              top_speed: baseLevel * 1.5,
            },
            description: `${engineTypes[type]} propulsion system - ${configurations[config]} configuration`,
            manufacturer: ['Terran Industries', 'Zenith Propulsion', 'Krell Motors'][techCount % 3],
            unlocksUpgrades: [],
            maxUpgradeLevel: 4 + tier,
            upgradeSlots: 6,
            isResearchable: true,
            isAvailableInMultiplayer: true,
            rarity: ['common', 'uncommon', 'rare', 'epic'][Math.min(3, ver)],
            discoveryBonus: baseLevel * 2,
            passiveEffect: true,
            stackable: false,
          });

          techCount++;
        }
      }
    }
  }

  return propulsion;
}

export function generateSensorTechs(): TechnologyNode[] {
  const sensors: TechnologyNode[] = [];
  const sensorTypes = ['Radar', 'LIDAR', 'Thermal', 'Gravitational', 'Quantum', 'Multispectral', 'Exotic'];
  const ranges = ['Short-Range', 'Medium-Range', 'Long-Range', 'Ultra-Long', 'Planetary', 'System-Wide'];
  const generations = ['Gen 1', 'Gen 2', 'Gen 3', 'Gen 4'];

  let techCount = 0;
  for (let type = 0; type < sensorTypes.length; type++) {
    for (let range = 0; range < ranges.length; range++) {
      for (let gen = 0; gen < generations.length; gen++) {
        const baseLevel = 1 + (type + range + gen) * 0.3;
        const tier = Math.min(5, Math.ceil((type + range + gen) / 3));

        sensors.push({
          id: `sensor-${type}-${range}-${gen}`,
          name: `${sensorTypes[type]} ${ranges[range]} ${generations[gen]}`,
          branch: 'sensors',
          class: gen < 2 ? 'basic' : gen < 3 ? 'advanced' : 'military',
          type: 'passive',
          category: sensorTypes[type],
          subcategory: ranges[range],
          classification: generations[gen],
          level: baseLevel,
          tier,
          researchCost: Math.floor(50 * tier * (1.2 ** baseLevel)),
          prerequisiteTechs: techCount > 0 ? [`sensor-${Math.max(0, type - 1)}-${range}-${gen}`] : [],
          minimumLevel: Math.floor(1 + baseLevel),
          minimumTechLevel: Math.floor(baseLevel),
          industrialCost: Math.floor(100 * tier),
          energyCost: Math.floor(20 * tier * (type + 1)),
          materialsNeeded: {
            copper: Math.floor(40 * (range + 1)),
            silicon: Math.floor(30 * (range + 1)),
            electronics: Math.floor(20 * tier),
          },
          researchTime: Math.ceil(2 + tier),
          stats: {
            primary: [
              {
                name: 'Detection Range',
                value: 5000 + baseLevel * 2000 + range * 3000,
                modifier: 0,
                subStats: { accuracy: 80 + tier * 3 },
              },
            ],
            secondary: [],
            resistance: {},
            efficiency: 75 + tier * 3,
            reliability: 88 + tier * 2,
          },
          bonuses: {
            threat_detection: baseLevel * 2,
            scan_speed: baseLevel * 1.5,
          },
          description: `${sensorTypes[type]} detection array - ${ranges[range]}`,
          manufacturer: ['Terran Industries', 'Zenith Sensors', 'Krell Tech'][techCount % 3],
          unlocksUpgrades: [],
          maxUpgradeLevel: 4 + tier,
          upgradeSlots: 5,
          isResearchable: true,
          isAvailableInMultiplayer: true,
          rarity: ['common', 'uncommon', 'rare', 'epic'][Math.min(3, gen)],
          discoveryBonus: baseLevel * 2,
          passiveEffect: true,
          stackable: false,
        });

        techCount++;
      }
    }
  }

  return sensors;
}

export function generatePowerTechs(): TechnologyNode[] {
  const power: TechnologyNode[] = [];
  const reactorTypes = ['Fusion', 'Antimatter', 'Zero-Point', 'Quantum', 'Exotic', 'Stellar'];
  const scales = ['Compact', 'Standard', 'Large', 'Massive', 'Unlimited'];
  const generations = ['Gen 1', 'Gen 2', 'Gen 3', 'Gen 4', 'Gen 5'];

  let techCount = 0;
  for (let type = 0; type < reactorTypes.length; type++) {
    for (let scale = 0; scale < scales.length; scale++) {
      for (let gen = 0; gen < generations.length; gen++) {
        const baseLevel = 1 + (type + scale + gen) * 0.3;
        const tier = Math.min(5, Math.ceil((type + scale + gen) / 3));

        power.push({
          id: `power-${type}-${scale}-${gen}`,
          name: `${reactorTypes[type]} Reactor ${scales[scale]} ${generations[gen]}`,
          branch: 'power',
          class: gen < 2 ? 'basic' : gen < 3 ? 'advanced' : 'military',
          type: 'passive',
          category: reactorTypes[type],
          subcategory: scales[scale],
          classification: generations[gen],
          level: baseLevel,
          tier,
          researchCost: Math.floor(80 * tier * (1.2 ** baseLevel)),
          prerequisiteTechs: techCount > 0 ? [`power-${Math.max(0, type - 1)}-${scale}-${gen}`] : [],
          minimumLevel: Math.floor(2 + baseLevel),
          minimumTechLevel: Math.floor(baseLevel),
          industrialCost: Math.floor(250 * tier * (scale + 1)),
          energyCost: 0,
          materialsNeeded: {
            deuterium: Math.floor(50 * (scale + 1)),
            tritium: Math.floor(30 * (scale + 1)),
            shielding: Math.floor(40 * tier),
          },
          researchTime: Math.ceil(6 + tier),
          stats: {
            primary: [
              {
                name: 'Energy Output',
                value: 500 + baseLevel * 200 + scale * 300,
                modifier: 0,
                subStats: { stability: 80 + tier * 3 },
              },
            ],
            secondary: [],
            resistance: {},
            efficiency: 80 + tier * 3,
            reliability: 85 + tier * 2,
          },
          bonuses: {
            energy_production: baseLevel * 10,
            efficiency: baseLevel * 1.5,
          },
          description: `${reactorTypes[type]} reactor - ${scales[scale]} scale`,
          manufacturer: ['Zenith Energy', 'Krell Power', 'Terran Industries'][techCount % 3],
          unlocksUpgrades: [],
          maxUpgradeLevel: 5 + tier,
          upgradeSlots: 6,
          isResearchable: true,
          isAvailableInMultiplayer: true,
          rarity: ['common', 'uncommon', 'rare', 'epic', 'legendary'][Math.min(4, gen)],
          discoveryBonus: baseLevel * 3,
          passiveEffect: true,
          stackable: false,
        });

        techCount++;
      }
    }
  }

  return power;
}

export function generateComputingTechs(): TechnologyNode[] {
  const computing: TechnologyNode[] = [];
  const aiTypes = ['Ship AI', 'Combat AI', 'Navigation AI', 'Science AI', 'Exotic AI'];
  const proficiencies = ['Basic', 'Specialized', 'Expert', 'Master', 'Legendary'];
  const versions = ['v1.0', 'v2.0', 'v3.0', 'v4.0'];

  let techCount = 0;
  for (let type = 0; type < aiTypes.length; type++) {
    for (let prof = 0; prof < proficiencies.length; prof++) {
      for (let ver = 0; ver < versions.length; ver++) {
        const baseLevel = 1 + (type + prof + ver) * 0.35;
        const tier = Math.min(5, Math.ceil((type + prof + ver) / 3));

        computing.push({
          id: `computing-ai-${type}-${prof}-${ver}`,
          name: `${aiTypes[type]} ${proficiencies[prof]} ${versions[ver]}`,
          branch: 'computing',
          class: prof < 2 ? 'basic' : prof < 3 ? 'advanced' : 'military',
          type: 'passive',
          category: aiTypes[type],
          subcategory: proficiencies[prof],
          classification: versions[ver],
          level: baseLevel,
          tier,
          researchCost: Math.floor(90 * tier * (1.2 ** baseLevel)),
          prerequisiteTechs: techCount > 0 ? [`computing-ai-${Math.max(0, type - 1)}-${prof}-${ver}`] : [],
          minimumLevel: Math.floor(3 + baseLevel),
          minimumTechLevel: Math.floor(baseLevel),
          industrialCost: Math.floor(200 * tier),
          energyCost: Math.floor(50 * tier),
          materialsNeeded: {
            processor: Math.floor(80 * (prof + 1)),
            memory_core: Math.floor(60 * (prof + 1)),
            electronics: Math.floor(40 * tier),
          },
          researchTime: Math.ceil(8 + tier),
          stats: {
            primary: [
              {
                name: 'Processing Power',
                value: 100 + baseLevel * 25 + prof * 20,
                modifier: 0,
                subStats: { speed: 50 + baseLevel * 12, optimization: 50 + baseLevel * 13 },
              },
            ],
            secondary: [],
            resistance: {},
            efficiency: 70 + tier * 3,
            reliability: 85 + tier * 2,
          },
          bonuses: {
            accuracy: baseLevel * 1.5,
            decision_speed: baseLevel * 2,
          },
          description: `${aiTypes[type]} - ${proficiencies[prof]} level`,
          manufacturer: ['Zenith Computing', 'Krell AI', 'Terran Systems'][techCount % 3],
          unlocksUpgrades: [],
          maxUpgradeLevel: 3 + tier,
          upgradeSlots: 4,
          isResearchable: true,
          isAvailableInMultiplayer: true,
          rarity: ['common', 'uncommon', 'rare', 'epic'][Math.min(3, prof)],
          discoveryBonus: baseLevel * 2,
          passiveEffect: true,
          stackable: false,
        });

        techCount++;
      }
    }
  }

  return computing;
}

export function generateEngineeringTechs(): TechnologyNode[] {
  const engineering: TechnologyNode[] = [];
  const systems = ['Automation', 'Fabrication', 'Repair', 'Optimization', 'Modular Systems', 'Adaptive Tech'];
  const complexity = ['Simple', 'Moderate', 'Complex', 'Advanced', 'Expert'];
  const generations = ['Gen 1', 'Gen 2', 'Gen 3', 'Gen 4'];

  let techCount = 0;
  for (let sys = 0; sys < systems.length; sys++) {
    for (let comp = 0; comp < complexity.length; comp++) {
      for (let gen = 0; gen < generations.length; gen++) {
        const baseLevel = 1 + (sys + comp + gen) * 0.3;
        const tier = Math.min(5, Math.ceil((sys + comp + gen) / 3));

        engineering.push({
          id: `engineering-${sys}-${comp}-${gen}`,
          name: `${systems[sys]} System ${complexity[comp]} ${generations[gen]}`,
          branch: 'engineering',
          class: gen < 2 ? 'basic' : gen < 3 ? 'standard' : 'advanced',
          type: 'passive',
          category: systems[sys],
          subcategory: complexity[comp],
          classification: generations[gen],
          level: baseLevel,
          tier,
          researchCost: Math.floor(70 * tier * (1.2 ** baseLevel)),
          prerequisiteTechs: techCount > 0 ? [`engineering-${Math.max(0, sys - 1)}-${comp}-${gen}`] : [],
          minimumLevel: Math.floor(2 + baseLevel),
          minimumTechLevel: Math.floor(baseLevel),
          industrialCost: Math.floor(150 * tier),
          energyCost: Math.floor(40 * tier),
          materialsNeeded: {
            electronics: Math.floor(60 * (comp + 1)),
            steel: Math.floor(40 * (comp + 1)),
            processor: Math.floor(30 * tier),
          },
          researchTime: Math.ceil(5 + tier),
          stats: {
            primary: [
              {
                name: 'Production Speed',
                value: 100 + baseLevel * 20 + comp * 15,
                modifier: 0,
                subStats: { efficiency: 50 + baseLevel * 10 },
              },
            ],
            secondary: [],
            resistance: {},
            efficiency: 75 + tier * 3,
            reliability: 85 + tier * 2,
          },
          bonuses: {
            production_speed: baseLevel * 2,
            waste_reduction: baseLevel * 1,
          },
          description: `${systems[sys]} engineering system - ${complexity[comp]}`,
          manufacturer: ['Terran Industries', 'Krell Manufacturing', 'Zenith Engineering'][techCount % 3],
          unlocksUpgrades: [],
          maxUpgradeLevel: 4 + tier,
          upgradeSlots: 5,
          isResearchable: true,
          isAvailableInMultiplayer: true,
          rarity: ['common', 'uncommon', 'rare', 'epic'][Math.min(3, gen)],
          discoveryBonus: baseLevel * 1.5,
          passiveEffect: true,
          stackable: false,
        });

        techCount++;
      }
    }
  }

  return engineering;
}

export function generateResourceTechs(): TechnologyNode[] {
  const resources: TechnologyNode[] = [];
  const extractionTypes = ['Mining', 'Drilling', 'Purification', 'Refining', 'Synthesis', 'Crystallization'];
  const efficiency = ['Basic', 'Improved', 'Advanced', 'Optimized', 'Expert'];
  const scales = ['Small', 'Medium', 'Large', 'Industrial'];

  let techCount = 0;
  for (let type = 0; type < extractionTypes.length; type++) {
    for (let eff = 0; eff < efficiency.length; eff++) {
      for (let scale = 0; scale < scales.length; scale++) {
        const baseLevel = 1 + (type + eff + scale) * 0.3;
        const tier = Math.min(5, Math.ceil((type + eff + scale) / 3));

        resources.push({
          id: `resources-${type}-${eff}-${scale}`,
          name: `${extractionTypes[type]} ${efficiency[eff]} ${scales[scale]} Scale`,
          branch: 'resources',
          class: eff < 2 ? 'basic' : eff < 3 ? 'advanced' : 'military',
          type: 'passive',
          category: extractionTypes[type],
          subcategory: efficiency[eff],
          classification: scales[scale],
          level: baseLevel,
          tier,
          researchCost: Math.floor(60 * tier * (1.2 ** baseLevel)),
          prerequisiteTechs: techCount > 0 ? [`resources-${Math.max(0, type - 1)}-${eff}-${scale}`] : [],
          minimumLevel: Math.floor(1 + baseLevel),
          minimumTechLevel: Math.floor(baseLevel),
          industrialCost: Math.floor(120 * tier * (scale + 1)),
          energyCost: Math.floor(60 * tier * (scale + 1)),
          materialsNeeded: {
            steel: Math.floor(80 * (scale + 1)),
            electronics: Math.floor(40 * (scale + 1)),
            drill_bit: Math.floor(50 * tier),
          },
          researchTime: Math.ceil(4 + tier),
          stats: {
            primary: [
              {
                name: 'Extraction Rate',
                value: 100 + baseLevel * 20 + scale * 25,
                modifier: 0,
                subStats: { yield: 85 + tier * 3 },
              },
            ],
            secondary: [],
            resistance: {},
            efficiency: 80 + tier * 2,
            reliability: 85 + tier * 2,
          },
          bonuses: {
            resource_yield: baseLevel * 2,
            extraction_speed: baseLevel * 1.5,
          },
          description: `${extractionTypes[type]} extraction - ${efficiency[eff]} configuration`,
          manufacturer: ['Terran Industries', 'Zenith Resources', 'Krell Mining'][techCount % 3],
          unlocksUpgrades: [],
          maxUpgradeLevel: 4 + tier,
          upgradeSlots: 5,
          isResearchable: true,
          isAvailableInMultiplayer: true,
          rarity: ['common', 'uncommon', 'rare', 'epic'][Math.min(3, eff)],
          discoveryBonus: baseLevel * 1.5,
          passiveEffect: true,
          stackable: false,
        });

        techCount++;
      }
    }
  }

  return resources;
}

export function generateMedicalTechs(): TechnologyNode[] {
  const medical: TechnologyNode[] = [];
  const treatments = ['Healing', 'Regeneration', 'Resurrection', 'Enhancement', 'Prevention', 'Cryogenics'];
  const effectiveness = ['Basic', 'Effective', 'Superior', 'Advanced', 'Extreme'];
  const methods = ['Surgical', 'Chemical', 'Biological', 'Nanite-Based', 'Genetic'];

  let techCount = 0;
  for (let treat = 0; treat < treatments.length; treat++) {
    for (let eff = 0; eff < effectiveness.length; eff++) {
      for (let method = 0; method < methods.length; method++) {
        const baseLevel = 1 + (treat + eff + method) * 0.3;
        const tier = Math.min(5, Math.ceil((treat + eff + method) / 3));

        medical.push({
          id: `medical-${treat}-${eff}-${method}`,
          name: `${treatments[treat]} Treatment ${effectiveness[eff]} ${methods[method]}`,
          branch: 'medical',
          class: eff < 2 ? 'basic' : eff < 3 ? 'advanced' : 'military',
          type: 'passive',
          category: treatments[treat],
          subcategory: effectiveness[eff],
          classification: methods[method],
          level: baseLevel,
          tier,
          researchCost: Math.floor(50 * tier * (1.2 ** baseLevel)),
          prerequisiteTechs: techCount > 0 ? [`medical-${Math.max(0, treat - 1)}-${eff}-${method}`] : [],
          minimumLevel: Math.floor(1 + baseLevel),
          minimumTechLevel: Math.floor(baseLevel),
          industrialCost: Math.floor(150 * tier),
          energyCost: Math.floor(40 * tier),
          materialsNeeded: {
            medical_supplies: Math.floor(80 * (eff + 1)),
            electronics: Math.floor(40 * (eff + 1)),
            rare_elements: Math.floor(30 * tier),
          },
          researchTime: Math.ceil(4 + tier),
          stats: {
            primary: [
              {
                name: 'Healing Rate',
                value: 50 + baseLevel * 15 + eff * 10,
                modifier: 0,
                subStats: { recovery: 40 + baseLevel * 10 },
              },
            ],
            secondary: [],
            resistance: {},
            efficiency: 75 + tier * 3,
            reliability: 88 + tier * 2,
          },
          bonuses: {
            crew_health: baseLevel * 2,
            recovery_speed: baseLevel * 1.5,
          },
          description: `${treatments[treat]} treatment system - ${methods[method]} method`,
          manufacturer: ['Zenith Medical', 'Krell Healthcare', 'Terran Biotech'][techCount % 3],
          unlocksUpgrades: [],
          maxUpgradeLevel: 4 + tier,
          upgradeSlots: 5,
          isResearchable: true,
          isAvailableInMultiplayer: true,
          rarity: ['common', 'uncommon', 'rare', 'epic'][Math.min(3, eff)],
          discoveryBonus: baseLevel * 2,
          passiveEffect: true,
          stackable: false,
        });

        techCount++;
      }
    }
  }

  return medical;
}

export function generateHyperspaceTechs(): TechnologyNode[] {
  const hyperspace: TechnologyNode[] = [];
  const ftlTypes = ['Warp Drive', 'Jump Gate', 'Quantum Tunnel', 'Exotic Travel', 'Teleportation'];
  const capabilities = ['Basic', 'Advanced', 'Military', 'Experimental', 'Legendary'];
  const stability = ['Gen 1', 'Gen 2', 'Gen 3', 'Gen 4', 'Gen 5'];

  let techCount = 0;
  for (let type = 0; type < ftlTypes.length; type++) {
    for (let cap = 0; cap < capabilities.length; cap++) {
      for (let stab = 0; stab < stability.length; stab++) {
        const baseLevel = 1 + (type + cap + stab) * 0.4;
        const tier = Math.min(5, Math.ceil((type + cap + stab) / 3));

        hyperspace.push({
          id: `hyperspace-${type}-${cap}-${stab}`,
          name: `${ftlTypes[type]} ${capabilities[cap]} ${stability[stab]}`,
          branch: 'hyperspace',
          class: cap < 2 ? 'basic' : cap < 3 ? 'advanced' : 'military',
          type: 'passive',
          category: ftlTypes[type],
          subcategory: capabilities[cap],
          classification: stability[stab],
          level: baseLevel,
          tier,
          researchCost: Math.floor(100 * tier * (1.2 ** baseLevel)),
          prerequisiteTechs: techCount > 0 ? [`hyperspace-${Math.max(0, type - 1)}-${cap}-${stab}`] : [],
          minimumLevel: Math.floor(3 + baseLevel),
          minimumTechLevel: Math.floor(baseLevel),
          industrialCost: Math.floor(300 * tier),
          energyCost: Math.floor(200 * tier),
          materialsNeeded: {
            deuterium: Math.floor(100 * (cap + 1)),
            exotic_matter: Math.floor(50 * (cap + 1)),
            processor: Math.floor(60 * tier),
          },
          researchTime: Math.ceil(10 + tier),
          stats: {
            primary: [
              {
                name: 'FTL Speed',
                value: 10 + baseLevel * 15 + cap * 8,
                modifier: 0,
                subStats: { range: 50 + baseLevel * 10 + cap * 5 },
              },
            ],
            secondary: [],
            resistance: {},
            efficiency: 70 + tier * 3,
            reliability: 85 + tier * 2,
          },
          bonuses: {
            interstellar_travel: baseLevel * 1,
            jump_range: baseLevel * 5,
          },
          description: `${ftlTypes[type]} technology - ${capabilities[cap]} tier`,
          manufacturer: ['Zenith Hyperspace', 'Krell Propulsion', 'Terran Research'][techCount % 3],
          unlocksUpgrades: [],
          maxUpgradeLevel: 5 + tier,
          upgradeSlots: 6,
          isResearchable: true,
          isAvailableInMultiplayer: true,
          rarity: ['common', 'uncommon', 'rare', 'epic', 'legendary'][Math.min(4, cap)],
          discoveryBonus: baseLevel * 3,
          passiveEffect: true,
          stackable: false,
        });

        techCount++;
      }
    }
  }

  return hyperspace;
}

// ============================================================================
// EXPORT ALL GENERATED TECHNOLOGIES
// ============================================================================

export const EXPANDED_ARMOR_TECHS = generateArmorTechs();
export const EXPANDED_SHIELD_TECHS = generateShieldTechs();
export const EXPANDED_WEAPON_TECHS = generateWeaponTechs();
export const EXPANDED_PROPULSION_TECHS = generatePropulsionTechs();
export const EXPANDED_SENSOR_TECHS = generateSensorTechs();
export const EXPANDED_POWER_TECHS = generatePowerTechs();
export const EXPANDED_COMPUTING_TECHS = generateComputingTechs();
export const EXPANDED_ENGINEERING_TECHS = generateEngineeringTechs();
export const EXPANDED_RESOURCE_TECHS = generateResourceTechs();
export const EXPANDED_MEDICAL_TECHS = generateMedicalTechs();
export const EXPANDED_HYPERSPACE_TECHS = generateHyperspaceTechs();

export function getAllExpandedTechnologies(): TechnologyNode[] {
  return [
    ...EXPANDED_ARMOR_TECHS,
    ...EXPANDED_SHIELD_TECHS,
    ...EXPANDED_WEAPON_TECHS,
    ...EXPANDED_PROPULSION_TECHS,
    ...EXPANDED_SENSOR_TECHS,
    ...EXPANDED_POWER_TECHS,
    ...EXPANDED_COMPUTING_TECHS,
    ...EXPANDED_ENGINEERING_TECHS,
    ...EXPANDED_RESOURCE_TECHS,
    ...EXPANDED_MEDICAL_TECHS,
    ...EXPANDED_HYPERSPACE_TECHS,
  ];
}

export function getExpandedTechCount(): {
  armor: number;
  shields: number;
  weapons: number;
  propulsion: number;
  sensors: number;
  power: number;
  computing: number;
  engineering: number;
  resources: number;
  medical: number;
  hyperspace: number;
  total: number;
} {
  return {
    armor: EXPANDED_ARMOR_TECHS.length,
    shields: EXPANDED_SHIELD_TECHS.length,
    weapons: EXPANDED_WEAPON_TECHS.length,
    propulsion: EXPANDED_PROPULSION_TECHS.length,
    sensors: EXPANDED_SENSOR_TECHS.length,
    power: EXPANDED_POWER_TECHS.length,
    computing: EXPANDED_COMPUTING_TECHS.length,
    engineering: EXPANDED_ENGINEERING_TECHS.length,
    resources: EXPANDED_RESOURCE_TECHS.length,
    medical: EXPANDED_MEDICAL_TECHS.length,
    hyperspace: EXPANDED_HYPERSPACE_TECHS.length,
    total: getAllExpandedTechnologies().length,
  };
}
