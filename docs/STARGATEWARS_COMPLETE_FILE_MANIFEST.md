# StargateWars Compact File Manifest

**Author:** Manus AI  
**Scope:** Condensed Windows Blue StargateWars interface with eight server-authoritative interactive hubs and compact left-side navigation.

The interface uses the existing live systems directly instead of duplicating them into isolated focused pages. Every player-facing capability is consolidated into one of the eight command hubs below.

| Command group | Hub page | Route | Included live capabilities |
|---|---|---|---|
| Stargate Command | `StargateCommand.tsx` | `/stargate-command` | Turn processing, Naquadah economy, vault, personnel, training, technology, doctrine, DefCon, raids, and reconnaissance. |
| Stargate Command | `StargateArsenal.tsx` | `/stargate-arsenal` | Armory, equipment maintenance, Spy/Anti-Spy upgrades, sabotage, intelligence reports, and Ascension readiness. |
| Stargate Command | `StargateSystems.tsx` | `/stargate-systems` | System registry, balance boundaries, module delivery status, and strategic API overview. |
| Expansion & Economy | `StargateMarket.tsx` | `/stargate-market` | Naquadah exchange, market listings, offers, purchases, cancellations, and mercenary recruitment. |
| Expansion & Economy | `StargateWorlds.tsx` | `/stargate-worlds` | Mothership commission and upgrades, exploration, world claims, bonuses, fortification, and repair. |
| Alliance & Operations | `StargateSocial.tsx` | `/stargate-social` | Commander identity, officers, alliances, applications, notices, and membership. |
| Alliance & Operations | `StargateProgression.tsx` | `/stargate-progression` | Rankings, Glory, Reputation, Ascension preview, execution, and history. |
| Alliance & Operations | `StargateOperations.tsx` | `/stargate-operations` | Vacation protection, player protection, cooldowns, anti-farming controls, events, and audit records. |

## Compact navigation implementation

| File | Responsibility |
|---|---|
| `client/src/components/layout/GameLayout.tsx` | Three Stargate navigation groups containing eight hub links: **Stargate Command**, **Expansion & Economy**, and **Alliance & Operations**. |
| `client/src/App.tsx` | Eight hub routes plus nine compatibility routes that resolve historic focused URLs to their parent hub. |
| `client/src/pages/StargateCommand.tsx` | Core strategic command hub. |
| `client/src/pages/StargateArsenal.tsx` | Armory and intelligence hub. |
| `client/src/pages/StargateSystems.tsx` | System directory hub. |
| `client/src/pages/StargateMarket.tsx` | Strategic market hub. |
| `client/src/pages/StargateWorlds.tsx` | Mothership and worlds hub. |
| `client/src/pages/StargateSocial.tsx` | Commander and alliance hub. |
| `client/src/pages/StargateProgression.tsx` | Rankings and Ascension hub. |
| `client/src/pages/StargateOperations.tsx` | Protection and reports hub. |

> **Compatibility policy:** A previously shared focused URL, including `/stargate-command/technology`, `/stargate-market/offers`, or `/stargate-systems/api`, resolves to the relevant parent hub rather than presenting a duplicate page or a 404 error.

The obsolete generated focused-page directory and generation scripts were removed. The result is a smaller source surface, fewer route declarations, a shorter side menu, and no loss of live strategic gameplay.
