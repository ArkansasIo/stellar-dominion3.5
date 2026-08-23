# Resource Production and Deployment Verification

## Mechanics review

| Resource | Authoritative production model | Current verified behavior |
|---|---|---|
| Metal | `30 × mine level × (1 + level / 10)` per hour | The production API, game engine, client interpolation, and scheduled persistence now use the same canonical hourly model. |
| Crystal | `20 × mine level × (1 + level / 10)` per hour | The production API, game engine, client interpolation, and scheduled persistence now use the same canonical hourly model. |
| Deuterium | `10 × synthesizer level × (1 + level / 12)` per hour | The production API, game engine, client interpolation, and scheduled persistence now use the same canonical hourly model. |
| Naquadah | `(untrained × 20) + ((miners + lifers) × 80)` per 30-minute strategic turn, then doctrine and DefCon modifiers | The balance and `naturalIncome` metric are server-authoritative through `/api/stargate/state`. |

The review found that the scheduled conventional-resource job previously used an unscaled version of the mine formulas. This created a mismatch with the game engine, production API, and visible client counter. The scheduled job now delegates Metal, Crystal, and Deuterium rates to `calculateProduction`, eliminating the drift.

A deterministic level-10 verification produced **600 Metal/hour**, **400 Crystal/hour**, and **183 Deuterium/hour**. A strategic workforce of five untrained personnel, three miners, and two lifers produced **500 Naquadah/turn** under Tau'ri and **625 Naquadah/turn** under the Goa'uld income doctrine.

## Authenticated counter verification

The active `player1` account currently has no conventional mines, so `/api/game/production` correctly returned zero Metal, Crystal, and Deuterium hourly production and baseline Energy 20. Its Stargate state returned zero spendable/banked Naquadah and a live projected income of **5,100 Naquadah per 30-minute strategic turn**. These results agree with the displayed header and Strategic Command values.

## Production deployment verification

| Check | Result |
|---|---|
| TypeScript validation | Passed |
| Deterministic resource formula test | Passed |
| Production client bundle | Passed |
| Production server bundle | Passed (`dist/index.cjs`) |
| Production artifact size | 78 MB |
| Production health endpoint | Healthy, score 100 |
| Declared static and parameterized route patterns | 115 checked, 0 failures |
| Authenticated `/api/game/production` | HTTP 200 |
| Authenticated `/api/stargate/state` | HTTP 200 |
| Public Stargate Command route | Loaded from the production runtime |

The active port-5001 server is now the freshly built production artifact, not the development runtime.
