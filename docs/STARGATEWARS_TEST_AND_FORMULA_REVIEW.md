# Stargate Command Test and Formula Review

## Executive Summary

A **controlled end-to-end raid test** was completed in the isolated local database `stargatewars_test`. The test used a dedicated Tau'ri attacker and a dedicated Asgard defender, so no existing player state or production database data was targeted. The final API-level raid authenticated successfully, consumed the requested attack turns, resolved a victory, preserved the defender’s banked Naquadah, transferred only exposed Naquadah, applied casualties to both realms, and wrote reports for each side.

The strategic rules were also reviewed against the supplied design specification. This review identified and corrected two implementation details. Passive turn generation now stops exactly at the documented **4,000-turn generation threshold**, while the **10,000-turn hard storage cap** remains intact. The Replicator doctrine now applies only to covert action, rather than also affecting anti-covert action.

## Controlled Test Environment

| Item | Value |
|---|---|
| Test database | `stargatewars_test` |
| Attacker | `test-tauri-commander` — Tau'ri Test Commander |
| Defender | `test-asgard-fortress` — Asgard Test Fortress |
| Primary server database | Not modified by the raid test |
| API test server | Local port `5002`, shut down after verification |
| Primary game server | Local port `5001`, restarted with the reviewed implementation |

The test accounts are local-only fixtures. They were intentionally seeded with Naquadah, personnel, and a strategic-state payload so that the full operation could be exercised without relying on a live player account.

## Authenticated Stargate Command API Raid

The Tau'ri test commander authenticated through `POST /api/auth/login`, retrieved its strategic state from `GET /api/stargate/state`, and sent a raid through `POST /api/stargate/raid`.

| API action | Result |
|---|---|
| Login | Successful as `Tau'ri Test Commander` |
| Starting attack turns for API raid | 87 |
| Requested raid commitment | 3 attack turns |
| Strike action before API raid | 472 |
| Calculated attack power | 556.96 |
| Defender power | 170.90 |
| Resolved chance | 92.0% |
| Resolution roll | 22.58% |
| Outcome | Victory |
| Exposed Naquadah recovered | 53,170 |
| Attacker troop losses | 1 |
| Defender troop losses | 4 |

The test confirms that a protected bank balance is excluded from ordinary raid loot. The service computes loot only from `resources.naquadah`; the defender’s `bankedNaquadah` remained protected.

A preceding controlled service-level raid also validated a stronger 15-turn raid. It resolved at 91.2% strength advantage, recovered 175,000 exposed Naquadah, spent 15 attack turns, and left the defender’s 100,000 banked Naquadah untouched.

## Tau'ri Doctrine Upgrades and Personnel Recruitment

The controlled Tau'ri state received the requested technology and specialized personnel improvements before the raid sequence. The doctrine supplies a 25% multiplier to strike action after weapon and offense-technology calculations.

| Upgrade category | Final controlled value |
|---|---:|
| Offense Technology | Level 2 |
| Covert Technology | Level 1 |
| Unique Technology | Level 1 |
| Attack Troops | 38 after raid casualties |
| Super Attack Troops | 12 |
| Attack Weapons | 100 |
| Covert Agents | 30 |
| Counter-Intelligence Agents | 20 |
| Available Naquadah after tests | 1,179,970 |
| Attack Turns after tests | 84 |
| Glory | 20 |
| Reputation | 6 |

The Tau'ri strike profile advanced from a low initial rank score to a post-upgrade strategic score of **795**. After the two successful raid resolutions, its final calculated action values were 465 strike, 50 defense, 1,233 covert, and 1,331 anti-covert.

## Formula Review

### Doctrine Modifiers

| Doctrine | Implemented modifier | Applied to |
|---|---:|---|
| Asgard | +25% | Defense action |
| Goa'uld | +25% | Natural income |
| Replicator | +25% | Covert action |
| Tau'ri | +25% | Strike action |

The formula review confirmed that doctrine multipliers are applied after the related base calculation. The Replicator modifier was corrected so that it does not inflate anti-covert action.

### Economy and Vault

Natural income is calculated as follows:

```text
Natural Income = (Untrained Personnel × 20) + ((Miners + Lifers) × 80)
```

The result is then adjusted by the Goa'uld income multiplier and the active DefCon income multiplier. The vault capacity is based on baseline natural income, rather than DefCon-reduced income:

```text
Vault Capacity = Baseline Natural Income × 48 × 1.5
```

This means that a player cannot increase vault capacity by changing alert state, and ordinary raid loot never draws from `bankedNaquadah`.

### Military and Intelligence Power

Strike and defense action use weapon coverage. Regular armed troops contribute five weapon-weighted points and elite armed troops contribute ten points. The applicable technology multiplier adds 10% per level, after which the Tau'ri or Asgard doctrine bonus is applied.

```text
Strike = (Regular Armed Attack Troops × 5 + Elite Armed Attack Troops × 10)
         × (1 + Offense Technology × 0.10)
         × Tau'ri Modifier
```

Covert and anti-covert action use the supplied square-root level curve. Covert action uses the Replicator modifier; anti-covert action uses its technology and DefCon security bonus but no race multiplier.

```text
Covert = [sqrt(2^Spy Level) × Agents × Covert Technology Multiplier × Replicator Modifier + Agents] × 10

Anti-Covert = [sqrt(2^(Anti-Spy Level + 2)) × Agents × Anti-Covert Technology Multiplier + Agents]
              × 10 × DefCon Security Multiplier
```

### Turn Tick Mechanism

The strategic processor uses 30-minute intervals. It measures elapsed intervals from `lastTurnAt`, applies whole completed turns, and advances the stored timestamp by exactly the processed interval count. This avoids double-counting when the tick is invoked more than once.

| Tick behavior | Implemented rule |
|---|---|
| Interval | 30 minutes |
| Personnel generation | `Unit Production × completed turns` |
| Income generation | Natural income based on the state at the beginning of the tick × completed turns |
| Attack-turn generation | One per completed turn while the reserve is below 4,000 |
| Generation threshold | Stops exactly at 4,000 attack turns |
| Absolute storage cap | 10,000 attack turns |
| Catch-up behavior | Processes all whole elapsed intervals in one transaction-like state update |

A dedicated regression test began at 3,999 attack turns with three elapsed turns. It processed all three intervals, generated personnel for all three, and left the reserve at exactly **4,000** rather than incorrectly increasing it beyond the generation threshold.

### Raid Resolver

The raid resolver rejects self-targeting and checks attack-turn availability before it changes state. It calculates attack and defense power, applies a turn-based attack multiplier, and bounds the chance of success between 8% and 92%. The stored report includes the exact seed and roll, allowing the result to be audited after resolution.

```text
Attack Power = Strike Action × (1 + Turns Spent × 0.06)

Raid Chance = clamp(0.50 + (Attack Power − Defense Power) / max(500, Attack Power + Defense Power), 0.08, 0.92)
```

Victorious raids only loot exposed Naquadah. Casualty rates are proportional to the outcome and the computed chance. The attacker earns 10 glory and 3 reputation on victory; an unsuccessful attacker receives only 1 glory.

## Verification Record

| Verification | Result |
|---|---|
| TypeScript project check | Passed |
| Strategic formula test | Passed |
| 4,000-turn threshold regression | Passed |
| Controlled service-level raid | Passed, including loot and report persistence |
| Authenticated HTTP API raid | Passed |
| Primary server health after restart | Running on port 5001 |

## Resulting Implementation Notes

The main local server now runs the corrected Stargate Command implementation on port 5001. The controlled test database and fixtures remain separate from that server’s primary database. The new test scripts can be reused to validate future balancing changes:

| Script | Purpose |
|---|---|
| `script/verify-stargatewars.ts` | Core formula and doctrine checks |
| `script/verify-stargate-turn-threshold.ts` | Regression test for the 4,000-turn passive-generation threshold |
| `script/stargatewars-controlled-test.ts` | Seeds controlled realms, processes turns, upgrades Tau'ri forces, and resolves a raid |
