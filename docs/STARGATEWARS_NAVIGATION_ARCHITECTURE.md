# StargateWars Compact Navigation Architecture

The StargateWars experience is condensed into **three left-side command groups** and **eight live interactive hubs**. Each hub contains its operational controls, status panels, logs, and related actions. This removes the repetitive per-feature page layer while preserving every strategic capability.

| Command group | Live hubs | Consolidated capabilities |
|---|---|---|
| Stargate Command | Strategic Command, Arsenal & Intelligence, System Directory | Turns, Naquadah economy, training, technology, DefCon, raids, reconnaissance, armory, sabotage, reports, system rules, and module status. |
| Expansion & Economy | Strategic Market, Mothership & Worlds | Exchange, offers, mercenaries, motherships, exploration, world bonuses, defense, and repairs. |
| Alliance & Operations | Commanders & Alliances, Rankings & Ascension, Protection & Reports | Commander profiles, officers, alliance administration, rankings, prestige, Ascension, vacation mode, anti-farming controls, events, and audit reports. |

## Live routes

| Hub | Route |
|---|---|
| Strategic Command | `/stargate-command` |
| Arsenal & Intelligence | `/stargate-arsenal` |
| System Directory | `/stargate-systems` |
| Strategic Market | `/stargate-market` |
| Mothership & Worlds | `/stargate-worlds` |
| Commanders & Alliances | `/stargate-social` |
| Rankings & Ascension | `/stargate-progression` |
| Protection & Reports | `/stargate-operations` |

> **Compatibility routing:** Earlier focused URLs, such as `/stargate-market/offers` and `/stargate-command/technology`, continue to resolve to their appropriate live hub. They are no longer separate pages or menu entries.

This compact model keeps the Windows Blue interface discoverable without forcing the player through duplicate page titles, repeated state previews, or deep nested side-menu lists.
