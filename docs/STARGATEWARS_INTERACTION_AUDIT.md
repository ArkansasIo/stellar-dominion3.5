# StargateWars Interaction Audit

The active core already persists `stargateWars` under each player’s existing government JSON. The remaining modules currently expose metadata only. The interactive implementation will add a normalized `stargateSystems` sibling to the same JSON record, avoiding a destructive migration while providing server-authoritative persistence for every new page.

| Module | Current gap | Interactive state | Player actions |
|---|---|---|---|
| Market | Registry only | Offer book, personal listing, escrow reserve, market turns | Buy exchange units, create/cancel offers, recruit mercenaries |
| Mothership | Registry only | Owned hull, capacity, modules, exploration timestamp | Purchase, upgrade capacity, configure modules, start/claim exploration |
| Worlds | Registry only | Discovered worlds, bonuses, defenses, condition, ownership | Explore, upgrade a bonus, fortify, repair, claim an unowned world |
| Commander | Registry only | Commander name, officer slots, income-share setting | Rename command, recruit/remove officers, set income share |
| Alliances | Registry only | Alliance tag/name, membership applications, roster derived from player state | Create, apply, accept, leave, post alliance notice |
| Rankings | Registry only | Calculated live from player strategic snapshots | Inspect category standings |
| Ascension | Readiness only | Preview and guarded reset record | Preview, execute when requirements are met |
| Protection | Registry only | PPT, vacation state, operation cooldowns | Enable vacation, view protection state |
| Events | Registry only | Append-only bounded system-event array | Inspect recent events and reports |

The implementation must enforce authentication, resource affordability, capacity limits, owner checks, target restrictions, and persistent state updates in routes and services. Player pages must call the new APIs and render actual state rather than module metadata.
