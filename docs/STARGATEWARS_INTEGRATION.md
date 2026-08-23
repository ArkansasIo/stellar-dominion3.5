# StargateWars Systems Integration

## Purpose

This integration adapts the supplied StargateWars design into **Universe Civilization: Empire at War** as a self-contained strategic layer rather than replacing the existing OGame-style economy, fleet, research, and diplomacy systems. The new layer shares the project’s existing `player_states` row and stores all added data in its JSON state fields. This preserves existing save data and avoids a destructive schema migration.

## Implemented Core Slice

| Area | Added capability | Persistence location |
|---|---|---|
| Identity | Four asymmetric strategic doctrines: Asgard, Goa'uld, Replicator, and Tau'ri | `government.stargateWars.race` |
| Economy | Naquadah wallet, protected bank balance, natural-income calculation, vault capacity, and DefCon income effects | `resources` and `government.stargateWars` |
| Turns | Thirty-minute catch-up processor, attack-turn reserve, 4,000 generation threshold, and 10,000 hard cap | `turnsData` and `government.stargateWars.lastTurnAt` |
| Personnel | Untrained personnel, miners, lifers, attack and defense troops, elite troops, covert agents, and counter-intelligence agents | `units` |
| Progression | Unit Production, spy levels, anti-spy levels, five technology tracks, market turns, glory, reputation, and ascension progress | `government.stargateWars` |
| Combat | Deterministic strength calculations, raid validation, protected-bank loot rules, proportional losses, and battle records | `government.stargateWars.logs` |
| Intelligence | Reconnaissance with race and DefCon modifiers, visibility tiers, detection, agent losses, and intelligence reports | `government.stargateWars.logs` |
| Player controls | Training, Unit Production upgrade, bank transfer, DefCon selection, technology upgrade, economy tick, raid, and reconnaissance APIs | `/api/stargate/*` |
| Interface | A dedicated Stargate Command page and left-navigation entry for state review and player actions | `/stargate-command` |

## Compatibility Rules

The strategic layer does not overwrite the project’s metal, crystal, deuterium, energy, credit, food, or water balances. It adds `naquadah` and `bankedNaquadah` keys to the existing resource object. Likewise, it adds personnel keys to the existing unit object without changing ship counts.

A player’s existing `government` JSON object receives a namespaced `stargateWars` member. This member holds all new progression data and append-only short reports. The implementation therefore remains backward compatible with existing player-state records: a default strategic state is created lazily the first time a player opens or acts through the new system.

## Canonical Rule Set

| Rule | Implementation |
|---|---|
| Race bonus | Asgard receives defense, Goa'uld income, Replicator covert, and Tau'ri offense bonuses. Each primary modifier is 25%. |
| Natural income | `(untrained × 20) + ((miners + lifers) × 80)`, then race and DefCon multipliers. |
| Vault capacity | `natural income × 48 × 1.5`. |
| Unit Production cost | `(current UP × 5,000) + 10,000` Naquadah. |
| Turn economy | A 30-minute tick grants one attack turn while below 4,000; all turn balances are capped at 10,000. |
| Combat | Weapon-weighted normal units contribute at 5× and elite units at 10×, then technology and race bonuses apply. |
| Covert action | Uses the supplied square-root spy-level model with a bounded success chance and deterministic request seed. |
| DefCon | None, Low, Medium, High, and Critical apply 0%, 10%, 20%, 40%, and 70% income reductions; alert also increases counter-intelligence. |

## Extension Points

The service layer is intentionally modular. Future phases can add persistent market orders, mercenary capacity, multi-planet conquest, commander/officer relationships, alliance distributions, mothership modules, and ascension resets as dedicated tables or services without changing the public strategic-state contract.

## Safety and Fairness

The new combat and intelligence endpoints reject self-targeting, consume turns only after validation, preserve banked Naquadah from ordinary raids, and constrain combat loot and losses. Battle and intelligence reports are retained on both participants’ strategic logs, providing player-visible auditability.
