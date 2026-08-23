# StargateWars Complete Systems Roadmap

**Author:** Manus AI  
**Scope:** Current Universe Civilization: Empire at War integration against the user-supplied complete StargateWars systems specification.

## Executive assessment

The current game already contains a functional, server-authoritative strategic core. It has authenticated state access, a thirty-minute turn processor, four doctrine bonuses, personnel conversion, protected Naquadah banking, six technology tracks, deterministic raids, reconnaissance, DefCon, and strategic logs. The implementation stores the strategic extension in the existing player-state JSON fields, allowing it to coexist with the main game without a destructive schema migration.

The supplied specification describes a much broader persistent MMORPG. The remaining work is not a single feature but a staged expansion across equipment, intelligence, market, world systems, social systems, protection, rankings, and prestige. Where the supplied design marks historical values as reconstructed or uncertain, the game must expose configuration rather than present invented constants as historical facts.

## Current coverage

| Specification domain | Current status | Existing capability | Delivery priority |
|---|---|---|---|
| Authentication and sessions | Available | Login, sessions, account setup, logout, local development access | Maintain |
| Strategic dashboard | Available | Stargate Command, strategic snapshot, logs, core metrics | Maintain |
| Thirty-minute turns | Available | Income, untrained personnel, attack-turn generation, 4,000 generation threshold, 10,000 storage cap | Maintain |
| Economy and vault | Available | Naquadah, miners, lifers, protected vault capacity | Enhance |
| Personnel and training | Available | Regular and super attack/defense units, covert and counter-intelligence agents, weapons as counts | Enhance |
| Race doctrines and DefCon | Available | Asgard defense, Goa'uld income, Replicator covert, Tau'ri offense, five DefCon levels | Maintain |
| Technology | Available | Six strategic tracks with server-side upgrades | Enhance |
| Raids and reports | Available | Deterministic resolution, losses, loot, defender log, protected banked reserves | Enhance |
| Reconnaissance | Available | Detection, agent losses, partial/full visibility, intelligence logs | Enhance |
| Armory | Partial | Attack and defense weapon quantities only | Implement next |
| Sabotage and spy missions | Missing | Reconnaissance only | Implement next |
| Strategic progression | Partial | Glory, reputation, ascension counters exist | Implement next |
| Market and mercenaries | Partial elsewhere | Existing general market page is not integrated with strategic Naquadah state | Follow-on |
| Planets and motherships | Partial elsewhere | Existing planet features are not connected to Stargate strategic calculations | Follow-on |
| Rankings | Partial | Per-player overall strategic score exists but no league snapshots | Follow-on |
| Protection and anti-farming | Missing | Basic self-target prevention and operation caps only | Critical before public PvP |
| Social and alliances | Partial elsewhere | Existing general social/alliance pages are not strategic-aware | Follow-on |
| Ascension | Partial | Counters only, no qualification or reset lifecycle | Follow-on |
| Admin, audit, events | Partial | Strategic logs and server tooling exist | Follow-on |

## Architecture decision

The existing TypeScript/Express/PostgreSQL architecture remains the correct host. The PHP/MySQL layout in the specification is a conceptual decomposition, not a requirement to replace the current project. The implementation will preserve these boundaries:

| Layer | Responsibility |
|---|---|
| React command interface | Displays authoritative snapshots and sends player intent only |
| Authenticated routes | Validates requests and derives player identity from the session |
| Strategic service | Resolves rules, validates affordability and eligibility, creates logs, and persists changes |
| Player state | Holds low-risk incremental strategic data in the existing JSON state while the rules remain in flux |
| Balance configuration | Holds doctrine, weapon, technology, combat, and economy values as named rule definitions |
| Audit records | Stores detailed immutable operation snapshots as the project matures toward public competitive play |

> **Server-authoritative rule:** The browser may request an action, but it never supplies balances, turns, equipment strength, combat outcomes, rankings, or prestige values.

## Delivery sequence

| Release | Scope | Player-visible outcome | Completion gate |
|---|---|---|---|
| 1. Strategic foundation | Turns, economy, training, doctrines, technologies, raids, reconnaissance | Already delivered | Existing deterministic checks pass |
| 2. Armory and intelligence | Weapon catalog, purchase/sell/equip/repair/scrap, durability, spy levels, sabotage, intelligence reports | Equipment has identity and maintenance; covert play becomes active | Server formula and affordability tests pass |
| 3. Progression and rankings | Configurable rank categories, glory/reputation rules, Ascension eligibility and preview | Players can see strategic progression and prestige readiness | State-transition tests and reset safeguards pass |
| 4. Strategic market | Naquadah-to-personnel exchange, market turns, mercenary capacity, private-trade escrow | Economy expands without client-side trust | Escrow invariant tests pass |
| 5. World expansion | Mothership, exploration, planet bonuses, defenses, conquest hooks | Strategic operations gain world-level objectives | Timed-operation and ownership tests pass |
| 6. Social and protection | Alliances, commander/officers, PPT, vacation, cooldowns, rank-range restrictions, anti-farming | Multiplayer play gains safety and coordination | Abuse-control tests pass |
| 7. Operations maturity | Persistent battle reports, event stream, rankings snapshots, administration dashboards | Public game operation is auditable and supportable | End-to-end operations review passes |

## Immediate implementation: Release 2 and Release 3 foundations

The immediate code increment will provide the highest-value compatible systems without migrating the existing player schema.

| Capability | Planned implementation |
|---|---|
| Weapon catalog | Named configurable weapons with race compatibility, category, strength, cost, durability, repair cost, and technology requirement |
| Player armory | Itemized inventory with ownership, equipped counts, condition, sell value, repair, and scrap operations |
| Combat integration | Strike and defense calculations derive from equipped, serviceable equipment instead of only raw weapon counts, while retaining legacy count compatibility |
| Spy levels | Server-side upgrades for Spy and Anti-Spy Level with increasing Naquadah costs |
| Sabotage | Deterministic covert operation with operation cost, detection, covert casualties, a bounded disruption effect, and both-player reports |
| Intelligence records | Structured report entries exposing only information earned by successful covert operations |
| Progression | Formal Glory/Reputation award rules, configurable Ascension threshold preview, and non-destructive eligibility/status endpoint |
| Visual interface | Windows Blue command panels for armory, covert orders, reports, and Ascension status |

## Rules requiring configuration rather than historical claims

The supplied content explicitly identifies the following categories as incomplete historical reconstruction. The implementation will use constants and named catalog definitions with clear extension points instead of claiming provenance: weapon catalog values, weapon durability damage, casualty equations, sabotage effects, exact loot percentages, planet generation, mothership modules, Ascension conversion, and market exchange prices.

## Completion definition for the current increment

The next increment is complete when the authenticated player can view an armory catalog, acquire and maintain equipment, equip usable equipment, upgrade spy skills, execute reconnaissance or sabotage through server-authoritative routes, inspect immutable operation details in the strategic log, and view an Ascension readiness assessment. The implementation must pass TypeScript validation, deterministic rule checks, and a live browser verification using the Windows Blue interface.

## Remaining-system status

The roadmap intentionally separates a **playable strategic core** from a **complete public MMORPG**. Releases 4–7 remain unimplemented until their dependencies, migration shape, and abuse controls are ready. This prevents incomplete market, social, and PvP systems from being represented as production-ready features.
