# Combat Formula Engine

A 19-step damage pipeline supporting PvP/PvE branching, EWAR, critical/heavy strikes, and position multipliers.

## Architecture

```
simulateFullCombat() ─► simulateCombatRound() ─► computeFinalDamage() ─► DamageOutput
                        ├── computeEWAR() ─► EWAResult
                        └── computeTotalEffectiveHP()
```

**Source:** `shared/config/combatFormulaEngine.ts`
**Service:** `server/services/combatFormulaService.ts`
**API:** `POST /api/progression/combat-simulate` `{ attacker, defender, baseAtkDamage, baseDefDamage, mode: "pvp"|"pve" }`
**API:** `POST /api/progression/combat-stats` `{ stats }`

## Damage Pipeline (19 steps)

1. Raw base damage
2. Attack Power multiplier (`firepower.attackPower / 100`)
3. Combat Efficiency multiplier (`combatEfficiency / 100`)
4. Weapon Systems Bonus (`1 + weaponSystemsBonus / 100`)
5. Species Combat Bonus (`1 + speciesCombatBonus / 100`)
6. Position multiplier (front 1.0 / flank 1.4 / rear 2.0)
7. Formation bonus
8. Mode damage bonus (PvP: `pvpDamageBonus`, PvE: other)
9. Empire bonuses (fleet, weapon technology, humanoid)
10. Accuracy vs Evasion hit check
11. Critical hit check
12. Heavy strike check
13. Shield absorption
14. Hull damage reduction (flat)
15. Armor mitigation (`armor / (armor + 500)`)
16. Fleet Damage Resistance (%)
17. Critical Damage Resistance (if crit)
18. Heavy Strike Resistance (if heavy strike)
19. Mode-specific reductions (PvE: alien damage reduction)

## Stat Type Hierarchy

```
EmpireCombatStats
├── fleet: FleetCombatStats
│   ├── firepower (attackPower, weaponSystemsBonus, attackSpeed, combatEfficiency, engagementRange, sensorRangeBonus, speciesCombatBonus)
│   ├── accuracy (fleetAccuracy, missileAccuracy, energyWeaponAccuracy, commanderTargetingBonus)
│   ├── critical (fleetCriticalChance, criticalDamageBonus, fleetHeavyStrike, heavyStrikeDamage, etc.)
│   ├── defense (fleetArmor, shieldRating, energyShield, hullDamageReduction, fleetDamageResistance, etc.)
│   └── evasion (fleetEvasion, missileEvasion, energyWeaponEvasion, heavyStrikeEvasion, rearAssaultAvoidance)
├── empire: EmpireAttributes (commander, resources, mobility)
├── technology: TechnologyStats (researchEfficiency, buffDuration, enemyDebuffDuration, etc.)
├── resistance: ResistanceSystems (empResistance, jammingResistance, hackResistance, etc.)
├── electronicWarfare: ElectronicWarfareStats (empChance, signalJamChance, systemCorruptionChance, etc.)
├── pvp: PvPWarfareStats (fleetAccuracy, fleetEvasion, pvpDamageBonus, heavyStrikeChance, etc.)
├── pve: PvEStats (fleetAccuracy, fleetEvasion, alienDamageReduction, fleetHeavyStrikeChance, etc.)
├── tactical: TacticalCombatStats (flankingAccuracy, flankingEvasion, rearAssaultHeavyStrike)
└── bonuses: EmpireBonuses (speciesCombatBonus, humanoidEmpireDamageBonus, weaponTechnologyBonus, fleetDamageBonus)
```

## EWAR Types

| Type | Base Duration | Resistance Stat | Chance Stat |
|------|--------------|----------------|-------------|
| EMP | 8s | empResistance | empChance |
| Fear Broadcast | 12s | panicResistance | fearBroadcastChance |
| Tractor Beam | 6s | tractorBeamResistance | tractorBeamChance |
| Ion Lock | 4s | jammingResistance | ionLockChance |
| Sleep Virus | 10s | hackResistance | sleepVirusChance |
| Collision Attack | 1s | collisionResistance | collisionAttackChance |
| Signal Jam | 8s | communicationsResistance | signalJamChance |
| System Corruption | 15s | sensorBlindResistance | systemCorruptionChance |

## Integration Points

- **Server:** `server/services/combatFormulaService.ts` wraps all functions
- **Routes:** `server/routes-empire-progression.ts` exposes API endpoints
- **Existing combat engine:** `server/combat/PhpBattleEngine.ts` uses OGame-style formulas; new engine is a parallel system
- **Database:** Empire stats stored in `empires` table, fleet stats in `fleet_classes`, weapons in `weapons`
