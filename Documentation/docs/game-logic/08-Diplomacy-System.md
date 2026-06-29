# Diplomacy System

## Diplomatic Relations Levels

| Level | Value | Description | Trade Allowed | Military Access | Alliance Possible |
|-------|-------|-------------|---------------|-----------------|-------------------|
| War | -100 | Active military conflict | No | No (hostile) | No |
| Hostile | -75 to -51 | Open hostility, no communication | No | No | No |
| Unfriendly | -50 to -26 | Cold relations, limited contact | Limited | No | No |
| Neutral | -25 to +25 | Default state | Basic | No | No |
| Friendly | +26 to +50 | Positive relations | Full | Requestable | No |
| Allied | +51 to +80 | Formal alliance | Full (preferential) | Yes | Mutual Defense |
| Federated | +81 to +100 | Political union | Full (shared) | Automatic | Shared Sovereignty |

## Diplomatic Actions

### Action Matrix

| Action | Requires | Effect on Relations | Cooldown |
|--------|----------|-------------------|----------|
| Declare War | Casus Belli (or -50 reputation) | Sets relations to War | None |
| Offer Peace | War state | -10 to proposer if rejected | 10 turns |
| Propose Treaty | Neutral+ | +5 if accepted | 5 turns |
| Trade Agreement | Neutral+ | +1/turn while active | 10 turns |
| Research Pact | Friendly+ | +2/turn while active | 20 turns |
| Non-Aggression Pact | Neutral+ | +1/turn, prevents war | 30 turns |
| Mutual Defense | Allied | +3/turn | 50 turns |
| Share Intel | Friendly+ | +5 one-time | 15 turns |
| Request Aid | Friendly+ | -10 if rejected | 20 turns |
| Form Federation | Allied, both Federated+ | +10 one-time | One-time decision |

### Diplomatic Action Formula

```
acceptanceChance = baseChance + relationModifier + reputationModifier
                   + powerModifier + agreementModifier

where:
  baseChance        = action-specific base (30-70%)
  relationModifier  = (relationLevel / 100) × 20
  reputationModifier = reputationScore / 10
  powerModifier     = (targetPower - ourPower) / targetPower × 15
  agreementModifier = +10 if existing treaties, -5 per broken treaty
```

## Treaty System

### Treaty Types

| Treaty | Duration (turns) | Terms | Breach Penalty |
|--------|-----------------|-------|----------------|
| Trade Agreement | 30 | % resource exchange | -20 rep, trade income loss |
| Research Pact | 50 | Shared tech progress | -30 rep, research setback |
| Non-Aggression | 60 | No war declaration | -40 rep, +50 war weariness if broken |
| Mutual Defense | 80 | Defend on attack | -50 rep, treaty dissolution |
| Peace Treaty | 20 | Post-war terms | -60 rep, renewed war valid Casus Belli |
| Federation | Permanent | Shared victory | Dissolution requires unanimous vote |

### Breach Consequences

```
reputationLoss = baseLoss × (1 + treatyImportanceModifier)

where:
  treatyImportanceModifier = 1.0 for Trade, 1.5 for Research, 2.0 for NAP,
                            2.5 for Mutual Defense, 3.0 for Federation
```

## Reputation System

### Reputation Changes

| Action | Reputation Change | Global Modifier |
|--------|------------------|-----------------|
| Declare war without Casus Belli | -30 | All factions: -10 |
| Honor defensive pact | +15 | All factions: +3 |
| Break treaty | -40 | All factions: -5 |
| Release captured planets post-war | +20 | All factions: +5 |
| Use weapons of mass destruction | -50 | All factions: -15 |
| Accept refugee population | +10 | All factions: +3 |
| Pirate/privateer actions | -15 per incident | Affected faction only |
| Genocide (species extermination) | -80 | All factions: -25 |

### Reputation Tiers

| Score | Title | Effects |
|-------|-------|---------|
| 100+ | Paragon | +20% trade income, easier diplomacy, +2 influence/turn |
| 50 to 99 | Honorable | +10% trade income, +1 influence/turn |
| 0 to 49 | Neutral | No bonuses |
| -50 to -1 | Dishonorable | -10% trade income, harder diplomacy |
| -100 to -51 | Pariah | -20% trade income, factions refuse deals, +2 unrest in empire |
| -100 or less | Outlaw | All factions hostile, can be attacked without Casus Belli |

## Diplomacy AI

### AI Decision Factors

```
decisionValue = relationshipWeight × relationship
              + threatWeight × threatAssessment
              + opportunityWeight × opportunityScore
              + personalityWeight × personalityBias
              + reputationWeight × reputationScore
              + trustFactor × pastBehaviorScore
```

### AI Personality Types

| Personality | Aggression | Trust | Expansionism | Diplomacy Weight |
|-------------|-----------|-------|-------------|-----------------|
| Expansionist | High | Low | High | 0.4 |
| Diplomatic | Low | High | Low | 1.5 |
| Militarist | High | Medium | High | 0.3 |
| Isolationist | Very Low | Very Low | Low | 0.1 |
| Scientific | Low | Medium | Medium | 0.6 |
| Merchant | Medium | High | Medium | 1.2 |
| Xenophobic | High | Very Low | Medium | 0.2 |
| Xenophilic | Very Low | Very High | Medium | 1.8 |

### Trust Factor

```
trustFactor = sum(pastPositiveActions) / (sum(pastPositiveActions) + sum(pastNegativeActions))

decay: trustFactor -= 0.01 per 10 turns without interaction
```

## Alliance Diplomacy

### Alliance-to-Alliance Relations

Blocs of allied factions can interact as groups:

- **Bloc relation** = average of member relations
- **Bloc treaties** require majority member approval
- **Bloc war** involves all members

### Federation Mechanics

```
federationVoteWeight = population^0.5 + economyScore^0.5 + militaryScore^0.5

federationPresident = member with highest total weight
  - Controls federation fleet (contributed by members)
  - Sets foreign policy (subject to council vote)
  - Can propose federation laws

federationLaws require 60% council approval
```

## War Mechanics

### War Declaration

```
warScore = sum of occupied objectives / sum of total objectives × 100
```

### War Goals

| Goal | War Score Cost | Effect on Peace |
|------|---------------|-----------------|
| Conquer Planet | 40 | Must occupy target planet |
| Humiliate | 20 | Demands tribute + reputation loss |
| Liberate | 30 | Free target from enemy control |
| Impose Ideology | 35 | Force government change |
| Tributary Status | 45 | Make enemy a vassal |
| Total Annihilation | 100 | Eliminate faction entirely |

### Surrender Terms

```
surrenderAcceptance = (warScore / 100) × 0.6 + exhaustionFactor × 0.4

where:
  exhaustionFactor = warWeariness / 100
```

## Casus Belli System

| Casus Belli | Conditions | War Score Cost Discount |
|-------------|-----------|------------------------|
| Territorial Claim | Contested border system | 20% |
| Revenge | Lost previous war to target | 15% |
| Ideology Clash | Opposing government ethics | 10% |
| Liberate Ally | Ally's planet occupied by enemy | 25% |
| Containment | Target has 50%+ more power | 15% |
| Total War | No restrictions (outlaw reputation) | 0% (no CB needed) |

## Embargo Mechanics

```
tradePenalty = embargoTarget × tradeVolume × 0.3
embargoEffect = targetIncome × 0.1 + targetHappiness × -5

reputationCost = 5 per embargo action

can be lifted: +10 reputation with embargoed faction
```

## Diplomatic Victory Conditions

| Condition | Requirement |
|-----------|-------------|
| Federation Victory | Form federation with >50% of surviving factions |
| Hegemony Victory | All other factions are vassals/tributaries |
| Galactic Council | Win council election with 2/3 majority vote |

### Council Vote Weighting

```
votes = 1 + (population^0.5 / 10) + (economy^0.5 / 20) + (military^0.5 / 15)

to win: >66% of total votes
```

## Influence System

### Influence Generation

```
influencePerTurn = baseInfluence + buildingBonus + techBonus + tradeRouteBonus
                   + reputationBonus

where:
  baseInfluence      = 1.0
  buildingBonus      = from embassies, cultural centers (+0.5 each)
  techBonus          = diplomacy tech level × 0.1
  tradeRouteBonus    = active trade routes × 0.05
  reputationBonus    = reputationTier × 0.2
```

### Influence Costs

| Action | Influence Cost |
|--------|---------------|
| Improve Relations | 20 (instant +10) |
| Harm Relations | 10 (instant -10) |
| Form Trade Agreement | 30 |
| Propose Research Pact | 50 |
| Support Faction in Council | 40 |
| Veto Council Resolution | 100 |
| Force Ideology | 150 |
