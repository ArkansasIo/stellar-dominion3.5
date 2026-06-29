# Progression System Examples

Examples of progression systems with config file references.

---

## Government Progression

Players advance through government types, unlocking new capabilities.

### Config

| File | Purpose |
|------|---------|
| `shared/config/governmentProgressionTreeConfig.ts` | Government advancement paths, prerequisites, and rewards |
| `shared/config/governmentLeadersConfig.ts` | Government leader definitions and bonuses |
| `shared/config/governmentBuildingStructuresConfig.ts` | Government building requirements |
| `shared/config/framingBuildingStructuresConfig.ts` | Framing building structures |

> **Source:** `shared/config/governmentProgressionTreeConfig.ts`
> **Source:** `shared/config/governmentLeadersConfig.ts`
> **Source:** `shared/config/governmentBuildingStructuresConfig.ts`

### Server

| File | Purpose |
|------|---------|
| `server/services/governmentProgressionService.ts` | Government advancement logic |
| `server/routes-government-progression.ts` | Government progression API |
| `server/routes-government-leaders.ts` | Leader API |
| `server/routes-government-buildings.ts` | Building API |

> **Source:** `server/services/governmentProgressionService.ts`
> **Source:** `server/routes-government-progression.ts`

### Client

| File | Purpose |
|------|---------|
| `client/src/lib/governmentSystems.ts` | Government system logic |
| `client/src/lib/governmentData.ts` | Government data definitions |
| `client/src/pages/Government.tsx` | Government UI |

> **Source:** `client/src/lib/governmentSystems.ts`
> **Source:** `client/src/pages/Government.tsx`

---

## Civilization Progression

Colonies advance through civilization tiers, unlocking jobs and structures.

### Config

| File | Purpose |
|------|---------|
| `shared/config/civilizationJobsConfig.ts` | Colony job definitions |
| `shared/config/civilizationSubsystemsConfig.ts` | Civilization subsystem configs |
| `shared/config/civilizationMilitaryJobConfig.ts` | Military job definitions |
| `shared/config/civilianStructuresConfig.ts` | Civilian structure definitions |
| `shared/config/planetsProgression.ts` | Planet progression rules |
| `shared/config/moonsProgression.ts` | Moon progression rules |
| `shared/config/buildingsProgression.ts` | Building progression rules |

> **Source:** `shared/config/civilizationJobsConfig.ts`
> **Source:** `shared/config/civilizationSubsystemsConfig.ts`
> **Source:** `shared/config/planetsProgression.ts`
> **Source:** `shared/config/buildingsProgression.ts`

### Server

| File | Purpose |
|------|---------|
| `server/services/civilizationSystemService.ts` | Civilization system logic |
| `server/routes-civilization-system.ts` | Civilization API |
| `server/routes-civilization.ts` | Civilization management API |

> **Source:** `server/services/civilizationSystemService.ts`
> **Source:** `server/routes-civilization-system.ts`

### Client

| File | Purpose |
|------|---------|
| `client/src/lib/colonySystems.ts` | Colony management logic |
| `client/src/lib/planetUtils.ts` | Planet utilities |
| `client/src/pages/Colonies.tsx` | Colony UI |
| `client/src/pages/CivilizationSystems.tsx` | Civilization systems UI |
| `client/src/pages/CivilizationManagement.tsx` | Civ management UI |

> **Source:** `client/src/lib/colonySystems.ts`
> **Source:** `client/src/pages/Colonies.tsx`

---

## Technology Progression

Research unlocks new technologies, buildings, ships, and capabilities.

### Config

| File | Purpose |
|------|---------|
| `shared/config/technologyTreeConfig.ts` | Tech tree structure |
| `shared/config/technologyTreeExpandedConfig.ts` | Expanded tree |
| `shared/config/technologyTreeCustomConfig.ts` | Custom extensions |
| `shared/config/technologyTreeQuickReference.ts` | Quick reference |
| `shared/config/researchProgression.ts` | Research progression rules |
| `shared/config/researchQueueConfig.ts` | Queue config |
| `shared/config/researchTechnologyLibraryConfig.ts` | Tech library |
| `shared/config/researchTechnologyOperationsConfig.ts` | Operations config |
| `shared/config/researchXPConfig.ts` | XP config |

> **Source:** `shared/config/technologyTreeConfig.ts`
> **Source:** `shared/config/researchProgression.ts`
> **Source:** `shared/config/researchXPConfig.ts`

### Server

| File | Purpose |
|------|---------|
| `server/services/technologyService.ts` | Tech research processing |
| `server/services/researchLabService.ts` | Lab management |
| `server/services/researchXPService.ts` | XP calculation |
| `server/routes-research.ts` | Research API |
| `server/routes-researchlab.ts` | Lab API |
| `server/routes-researchxp.ts` | XP API |

> **Source:** `server/services/technologyService.ts`
> **Source:** `server/routes-research.ts`

### Client

| File | Purpose |
|------|---------|
| `client/src/lib/researchTechnologyTreeCatalog.ts` | Tech tree catalog |
| `client/src/lib/researchLabAdministration.ts` | Lab admin |
| `client/src/lib/techData.ts` | Tech data |
| `client/src/pages/Research.tsx` | Research UI |
| `client/src/pages/ResearchLab.tsx` | Lab UI |

> **Source:** `client/src/lib/researchTechnologyTreeCatalog.ts`
> **Source:** `client/src/pages/Research.tsx`

---

## Commander Progression

Commanders gain skills, talents, and mastery levels.

### Config

| File | Purpose |
|------|---------|
| `shared/config/commander/skills/commanderSkillTreeSystem.ts` | Skill tree |
| `shared/config/commander/talent-tree/commanderTalentTree.ts` | Talent tree |
| `shared/config/commander/talent-tree/commanderTalentTreeConfig.ts` | Talent config |
| `shared/config/commander/mastery/commanderMasteryConfig.ts` | Mastery config |
| `shared/config/commander/gacha/commanderGachaCommandNexus.ts` | Gacha system |
| `shared/config/commander/vault/commanderBankVault.ts` | Bank vault |
| `shared/config/commander/vault/vaultBankSystem.ts` | Vault system |

> **Source:** `shared/config/commander/skills/commanderSkillTreeSystem.ts`
> **Source:** `shared/config/commander/talent-tree/commanderTalentTree.ts`
> **Source:** `shared/config/commander/mastery/commanderMasteryConfig.ts`

### Server

| File | Purpose |
|------|---------|
| `server/routes-commanders.ts` | Commander API |
| `server/routes-bank-vault.ts` | Bank vault API |

> **Source:** `server/routes-commanders.ts`

### Client

| File | Purpose |
|------|---------|
| `client/src/lib/commanderTypes.ts` | Commander types |
| `client/src/lib/commanderSystems.ts` | Commander logic |
| `client/src/pages/Commander.tsx` | Commander UI |

> **Source:** `client/src/lib/commanderTypes.ts`
> **Source:** `client/src/pages/Commander.tsx`

---

## Kardashev Scale Progression

Civilization energy advancement through Kardashev levels.

### Config

No dedicated config file — logic in client libraries.

### Client

| File | Purpose |
|------|---------|
| `client/src/lib/kardashevScale.ts` | Kardashev scale logic |
| `client/src/lib/kardashevUpgradeCatalog.ts` | Upgrade catalog |

> **Source:** `client/src/lib/kardashevScale.ts`
> **Source:** `client/src/lib/kardashevUpgradeCatalog.ts`

---

## Skills Progression

Player skill tree with 90 levels.

### Client

| File | Purpose |
|------|---------|
| `client/src/lib/skills90System.ts` | 90-level skills system |
| `client/src/lib/skillsData.ts` | Skills data |
| `client/src/pages/Skills.tsx` | Skills UI |

> **Source:** `client/src/lib/skills90System.ts`
> **Source:** `client/src/lib/skillsData.ts`
> **Source:** `client/src/pages/Skills.tsx`

---

## Fleet Progression

Ships advance through classes, with fitting and upgrade systems.

### Config

| File | Purpose |
|------|---------|
| `shared/config/staryardConfig.ts` | Shipyard config |
| `shared/config/shipClassificationSystem.ts` | Ship classes |
| `shared/config/starshipSystemsAndStructuresTaxonomyConfig.ts` | Systems taxonomy |
| `shared/config/starRaritySystem.ts` | Rarity system |
| `shared/config/starfleetBiomeCatalogConfig.ts` | Biome catalog |

> **Source:** `shared/config/staryardConfig.ts`
> **Source:** `shared/config/shipClassificationSystem.ts`
> **Source:** `shared/config/starRaritySystem.ts`

### Server

| File | Purpose |
|------|---------|
| `server/services/fleetService.ts` | Fleet management |
| `server/routes-gameactions.ts` | Fleet deployment |
| `server/routes-travel.ts` | Fleet travel |

> **Source:** `server/services/fleetService.ts`
> **Source:** `server/routes-gameactions.ts`

### Client

| File | Purpose |
|------|---------|
| `client/src/lib/unitData.ts` | Unit definitions |
| `client/src/lib/shipFittingModules.ts` | Fitting modules |
| `client/src/lib/ogameShips.ts` | OGame ships |
| `client/src/lib/starshipLineCatalog.ts` | Starship catalog |
| `client/src/pages/Fleet.tsx` | Fleet UI |
| `client/src/pages/Shipyard.tsx` | Shipyard UI |
| `client/src/pages/Fitting.tsx` | Fitting UI |

> **Source:** `client/src/lib/unitData.ts`
> **Source:** `client/src/pages/Fleet.tsx`
> **Source:** `client/src/pages/Shipyard.tsx`

---

## Army Progression

Ground units advance through tiers with research and upgrades.

### Config

| File | Purpose |
|------|---------|
| `shared/config/combat/army/unitConfig.ts` | Unit definitions |
| `shared/config/combat/army/unitsProgression.ts` | Unit progression |
| `shared/config/combat/army/unitSystemsConfig.ts` | Unit systems |
| `shared/config/combat/army/unitJobTaxonomyConfig.ts` | Unit jobs |
| `shared/config/combat/army/unitResearchConfig.ts` | Unit research |
| `shared/config/combat/army/armyCategoriesConfig.ts` | Army categories |
| `shared/config/combat/army/armySubsystemsConfig.ts` | Army subsystems |
| `shared/config/combat/army/armyManagementSystem.ts` | Army management |
| `shared/config/combat/army/armyBuildingStructuresConfig.ts` | Army buildings |

> **Source:** `shared/config/combat/army/unitConfig.ts`
> **Source:** `shared/config/combat/army/unitsProgression.ts`
> **Source:** `shared/config/combat/army/armyManagementSystem.ts`

### Server

| File | Purpose |
|------|---------|
| `server/services/armySystemService.ts` | Army system |
| `server/services/armyBuildingStructuresService.ts` | Army buildings |
| `server/routes-army-system.ts` | Army API |
| `server/routes-army-building-structures.ts` | Army building API |
| `server/routes-unitsystems.ts` | Unit system API |
| `server/routes-unit-taxonomy.ts` | Unit taxonomy API |

> **Source:** `server/services/armySystemService.ts`
> **Source:** `server/routes-army-system.ts`

### Client

| File | Purpose |
|------|---------|
| `client/src/hooks/useCivilizationArmy.ts` | Army hook |
| `client/src/pages/Army.tsx` | Army UI |
| `client/src/pages/ArmyManagement.tsx` | Army management UI |

> **Source:** `client/src/pages/Army.tsx`
> **Source:** `client/src/pages/ArmyManagement.tsx`

---

## Achievement Progression

Achievements track milestones and reward completion.

### Config

| File | Purpose |
|------|---------|
| `shared/config/achievementsConfig.ts` | Achievement definitions |
| `shared/config/achievementSystemConfig.ts` | Achievement system config |

> **Source:** `shared/config/achievementsConfig.ts`
> **Source:** `shared/config/achievementSystemConfig.ts`

### Server

| File | Purpose |
|------|---------|
| `server/services/achievementService.ts` | Achievement processing |
| `server/routes-achievements.ts` | Achievement API |

> **Source:** `server/services/achievementService.ts`
> **Source:** `server/routes-achievements.ts`

### Client

| File | Purpose |
|------|---------|
| `client/src/lib/achievementsSystem.ts` | Achievement tracking |
| `client/src/pages/Achievements.tsx` | Achievement UI |

> **Source:** `client/src/lib/achievementsSystem.ts`
> **Source:** `client/src/pages/Achievements.tsx`

---

## Durability Progression

Equipment, fleets, and buildings degrade over time and require repair.

### Config

| File | Purpose |
|------|---------|
| `shared/config/durabilityConfig.ts` | Durability rules & parameters |

> **Source:** `shared/config/durabilityConfig.ts`

### Schema

| Table | Purpose |
|-------|---------|
| `equipment_durability` | Equipment wear tracking |
| `fleet_durability` | Fleet wear tracking |
| `building_durability` | Building wear tracking |

> **Source:** `shared/schema.ts`
