# 24-Hour Resource Accumulation Simulation

## Scope

An isolated temporary player was seeded in `stargatewars_test` with fixed conventional mines, strategic personnel, a resource timestamp exactly 24 hours in the past, and a Stargate turn timestamp exactly 24 hours in the past. The test invoked the live conventional `processResourceTick` and strategic `processStrategicTurns` services, inspected the persisted database row, and removed all simulation records afterward.

## Simulated configuration and result

| Item | Input | 24-hour result |
|---|---:|---:|
| Metal Mine | Level 12 | 792/hour; 19,008 produced; 20,008 ending balance |
| Crystal Mine | Level 8 | 288/hour; 6,912 produced; 8,912 ending balance |
| Deuterium Synthesizer | Level 6 | 90/hour; 2,160 produced; 5,160 ending balance |
| Strategic workforce | 10 untrained, 5 miners, 2 lifers | 760 Naquadah/turn; 48 turns; 36,480 produced; 41,480 ending balance |

All persisted totals matched the independently calculated expectation. The strategic turn processor correctly resolved 24 hours as 48 thirty-minute turns.

## Defect found and corrected

The first run exposed a cross-system persistence defect. The conventional resource tick normalized only Metal, Crystal, Deuterium, Energy, Credits, Food, and Water before saving the `resources` JSON object. It unintentionally removed `naquadah` and `bankedNaquadah`, causing a following strategic tick to lose the pre-existing Naquadah balance.

`normalizeResources` in `server/gameEngine.ts` now preserves existing resource keys before normalizing conventional values. The rerun retained the original 5,000 Naquadah and added the expected 36,480, producing the verified 41,480 ending balance.

## Deployment verification

The production application was rebuilt and restarted on port 5001 after the correction. The health endpoint reported `healthy` with a score of `100`. The route audit checked 115 declared static and parameterized route patterns with zero failures. The simulation account and player-state row were removed after verification, leaving the active player state untouched.
