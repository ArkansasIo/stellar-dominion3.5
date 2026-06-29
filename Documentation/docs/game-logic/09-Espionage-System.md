# Espionage System

## Espionage Mission Types

| Mission | Primary Stat | Base Duration (hours) | Risk Level | Description |
|---------|-------------|----------------------|------------|-------------|
| Spy | Espionage | 24 | Low | Gather intel on target colony/fleet |
| Sabotage | Demolition | 48 | High | Damage buildings, disrupt operations |
| Infiltrate | Stealth | 72 | Very High | Plant agent in enemy government |
| Steal Research | Intelligence | 36 | Medium | Copy enemy technology blueprints |
| Assassinate | Assassination | 96 | Extreme | Eliminate enemy leader/officer |
| Counter-Intel | Security | Continuous | Low | Protect against enemy espionage |

## Spy Unit Mechanics

### Recruitment

```
recruitCost = baseCost × (1 + spyCount × 0.1)
recruitTime = 24 hours × (1 - recruitmentBuildingBonus)

where:
  baseCost            = 500 credits
  spyCount            = current number of active spies
  recruitmentBuildingBonus = from spy academies (max 0.5)
```

### Training

| Training Type | Duration | Stat Bonus | Cost |
|--------------|----------|------------|------|
| Basic | 12 hours | +1 all stats | 200 |
| Advanced | 48 hours | +3 primary stat, +1 secondary | 800 |
| Elite | 120 hours | +5 primary stat, +3 secondary | 3000 |
| Specialization | 72 hours | +4 to chosen specialization | 1500 |

### Equipment

| Equipment | Slot | Bonus | Cost | Tech Required |
|-----------|------|-------|------|---------------|
| Stealth Suit Mk I | Armor | +2 Stealth | 500 | Basic Stealth |
| Stealth Suit Mk II | Armor | +4 Stealth | 1500 | Advanced Stealth |
| Encryption Device | Gadget | +3 Espionage | 400 | Cryptography |
| Forgery Kit | Gadget | +3 Infiltration | 600 | Forgery |
| Signal Jammer | Gadget | +2 Counter-Intel | 700 | Signal Theory |
| Neural Scanner | Tool | +3 Intelligence | 2000 | Neural Interfaces |
| Molecular Shredder | Weapon | +4 Assassination | 5000 | Molecular Disruption |

### Skill Levels

| Level | Title | XP Required | Effectiveness Multiplier |
|-------|-------|-------------|------------------------|
| 1 | Rookie | 0 | 1.0 |
| 2 | Operative | 500 | 1.2 |
| 3 | Agent | 1500 | 1.5 |
| 4 | Senior Agent | 3500 | 1.8 |
| 5 | Master Spy | 7000 | 2.2 |
| 6 | Legend | 12000 | 2.8 |

## Mission Success Formula

```
success = spyLevel × 1.2 + equipmentBonus + techBonus - targetSecurity

where:
  spyLevel      = spy's skill level (1-6)
  equipmentBonus = sum of equipment stat bonuses for the relevant stat
  techBonus     = espionage tech level × 0.5
  targetSecurity = target's security level (calculated from defenses)

success is rolled against d100:
  if success > random(0, 100): mission succeeds
  extra success > 100: critical success (bonus intel, faster, undetected)
```

### Critical Success Effects

| Margin | Effect |
|--------|--------|
| 0-20 | Normal success |
| 21-50 | 25% faster completion, extra intel |
| 51-80 | 50% faster, high-quality intel, undetected |
| 80+ | Instant completion, full intel, spy level up |

## Detection Formula

```
detection = targetSecurityLevel × 0.8 + counterIntelBonus - spyStealth

where:
  targetSecurityLevel = target colony security level (0-100)
  counterIntelBonus   = active counter-intelligence × 0.3
  spyStealth          = spy's stealth stat + stealth equipment bonuses

if detection > random(0, 100): spy is detected

detection effects:
  0-33: Warning (mission fails, spy escapes)
  34-66: Identified (mission fails, spy must flee)
  67+: Captured (spy lost, may leak information)
```

## Intel Levels

| Level | Information Available | Mission Type Required |
|-------|----------------------|----------------------|
| 1 | Basic resources (credits, minerals visible) | Initial scan |
| 2 | Population count, planet class | Spy (Basic) |
| 3 | Building list (unowned buildings hidden) | Spy |
| 4 | Fleet presence, ship count | Spy |
| 5 | Active research, tech level | Steal Research |
| 6 | Diplomatic relations with others | Infiltrate |
| 7 | Full fleet details (ship types, loadouts) | Spy (Deep) |
| 8 | Active construction queues | Infiltrate |
| 9 | Military unit positioning, defenses | Infiltrate (Deep) |
| 10 | Current orders, active missions, production schedules | Full Infiltration |

## Sabotage Effects

### Building Damage

```
damagePercent = spyLevel × 10 + equipmentBonus - targetDefenses
buildingDowntime = damagePercent × 2 (hours)
repairCost = buildingValue × damagePercent / 100
```

### Sabotage Targets

| Target | Effect | Duration |
|--------|--------|----------|
| Power Plant | Energy -50% | 24 hours |
| Research Lab | Research -75% | 48 hours |
| Shipyard | Production halted | 36 hours |
| Shield Generator | Planetary shields offline | 12 hours |
| Military Base | Troop training -100% | 48 hours |
| Trade Port | Trade income -100% | 24 hours |

### Fleet Sabotage

```
shipDamage = spyLevel × 15% max HP per sabotage action
crewLoss = spyLevel × 5% crew casualties
```

### Research Setback

```
stolenTechProgress = spyLevel × 10% of current research
researchDelay = stolenTechProgress hours worth of research
```

## Counter-Espionage

### Counter-Intel Operations

| Operation | Cost | Duration | Effect |
|-----------|------|----------|--------|
| Security Audit | 300 | 12h | +10 security for 48h |
| Hunter Teams | 500 | 24h | +20% detection chance |
| Signal Sweep | 400 | 8h | Reveals enemy spy presence |
| Double Agent Program | 2000 | 72h | Turn enemy spy if detected |
| Encryption Upgrade | 1000 | 48h | +15 security, permanent |

### Spy Hunting Formula

```
huntSuccess = hunterLevel × 15 + securityLevel × 0.5 - enemySpyStealth × 0.8

huntSuccess > 90: spy automatically captured
huntSuccess > 60: spy revealed
huntSuccess > 30: suspicion raised, no capture
```

## Espionage Technology Tree

| Tech | Prerequisites | Effect | Cost |
|------|-------------|--------|------|
| Cryptography | None | +1 Espionage, Encryption Device unlocked | 500 RP |
| Stealth Systems | None | +1 Stealth, Stealth Suit Mk I | 500 RP |
| Signal Theory | Cryptography | +1 Counter-Intel, Signal Jammer | 1000 RP |
| Forgery | Cryptography | +1 Infiltration, Forgery Kit | 1000 RP |
| Neural Interfaces | Advanced Computing | +3 Intelligence, Neural Scanner | 2000 RP |
| Advanced Stealth | Stealth Systems | +2 Stealth, Stealth Suit Mk II | 2000 RP |
| Molecular Disruption | Advanced Physics | +4 Assassination, Molecular Shredder | 5000 RP |
| AI Security | Neural Interfaces | +5 security all colonies | 8000 RP |
| Quantum Encryption | AI Security | Immune to level 1-3 intel | 15000 RP |

## Intelligence Report Format

```
INTELLIGENCE REPORT
─────────────────────────────────────────────
Target:        [Faction Name]
Colony:        [Colony Name]
Intel Level:   [1-10]
Report Date:   [Game Date]
Source:        [Spy Name] (Rank [Level])

─ COLONY OVERVIEW ─
  Population:   [value]
  Happiness:    [range]
  Defenses:     [shield/planetary values]

─ RESOURCES ─
  Credits:      [estimated range]
  Minerals:     [estimated range]
  [etc.]

─ MILITARY ─
  Fleet:        [ships detected]
  Garrison:     [troop estimate]
  [visible at intel level 7+]

─ NOTES ─
  [Intel analyst annotations]
  Confidence:   [Low/Medium/High/Confirmed]
─────────────────────────────────────────────
```
