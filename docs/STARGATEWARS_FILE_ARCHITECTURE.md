# StargateWars File Architecture

The existing application remains TypeScript, React, Express, and PostgreSQL. The following structure translates the complete supplied system blueprint into compatible modules without replacing the working strategic core.

| System domain | Server service file | Route file | Player interface |
|---|---|---|---|
| Shared rules and module registry | `server/services/stargate/moduleRegistry.ts` | — | — |
| Balance definitions | `server/services/stargate/balanceRules.ts` | — | — |
| Economy and market | `server/services/stargate/marketService.ts` | `server/routes-stargate-market.ts` | `client/src/pages/StargateMarket.tsx` |
| Mothership and exploration | `server/services/stargate/mothershipService.ts` | `server/routes-stargate-world.ts` | `client/src/pages/StargateWorlds.tsx` |
| Strategic planets | `server/services/stargate/planetService.ts` | `server/routes-stargate-world.ts` | `client/src/pages/StargateWorlds.tsx` |
| Commander and officers | `server/services/stargate/commanderService.ts` | `server/routes-stargate-social.ts` | `client/src/pages/StargateSocial.tsx` |
| Alliances and diplomatic coordination | `server/services/stargate/allianceService.ts` | `server/routes-stargate-social.ts` | `client/src/pages/StargateSocial.tsx` |
| Rankings, Glory, and Reputation | `server/services/stargate/rankingService.ts` | `server/routes-stargate-progression.ts` | `client/src/pages/StargateProgression.tsx` |
| Ascension lifecycle | `server/services/stargate/ascensionService.ts` | `server/routes-stargate-progression.ts` | `client/src/pages/StargateProgression.tsx` |
| Protection and anti-farming | `server/services/stargate/protectionService.ts` | `server/routes-stargate-operations.ts` | `client/src/pages/StargateOperations.tsx` |
| Event and audit logging | `server/services/stargate/eventService.ts` | `server/routes-stargate-operations.ts` | `client/src/pages/StargateOperations.tsx` |
| Operations facade | `server/services/stargate/operationsService.ts` | `server/routes-stargate-operations.ts` | `client/src/pages/StargateOperations.tsx` |
| API overview | `server/services/stargate/systemOverviewService.ts` | `server/routes-stargate-systems.ts` | `client/src/pages/StargateSystems.tsx` |

The first implementation pass creates every listed source file with explicit contracts, stable endpoint namespaces, feature metadata, and safe placeholder state responses. Existing implemented mechanics remain in `server/services/stargateWarsService.ts` and `server/routes-stargatewars.ts`; the new modules do not duplicate or replace those working systems.

> **Status key:** `implemented` represents working gameplay logic already connected to the strategic service. `foundation` represents a created module and API boundary ready for full mechanics. `planned` represents a documented future action that remains intentionally unavailable until its dependencies and protection rules are complete.
