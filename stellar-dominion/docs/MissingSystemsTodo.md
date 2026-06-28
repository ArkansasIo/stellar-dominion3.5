# Missing Systems TODO (Source Audit)

This checklist captures systems that are still stubbed, mocked, or UI-placeholder-only in the current codebase.

## Priority P0 — Core game loop and persistence

- [x] Persist combat history instead of mock response in `server/routes-combat.ts` (`/api/combat/battle-history` now reads from `battles`).
- [x] Implement mining operations persistence currently marked stubbed in `server/storage.ts` (`mining_operations` table auto-created and used).
- [x] Replace remaining critical gameplay placeholders with API-backed mutations for:
  - [x] `client/src/pages/Fleet.tsx` (mission dispatch now posts to `/api/game/send-fleet` with coordinate/colonist validation)
  - [x] `client/src/pages/Combat.tsx` (inline error state + stricter launch validation)
  - [x] `client/src/pages/Colonies.tsx` (colonization now queues mission via `/api/game/send-fleet`)
  - [x] `client/src/pages/Galaxy.tsx` (scan/message/attack/launch wired to API-backed actions)

## Priority P1 — Backend systems marked as stubs

- [x] Complete research achievement logic in `server/services/achievementService.ts`.
- [x] Complete custom lab creation and progression in `server/services/customLabService.ts`.
- [x] Complete multiplayer research bonus logic in `server/services/multiplayerBonusesService.ts`.
- [ ] Replace all trade mocks in `server/services/researchTradingService.ts` with DB-backed flows:
  - listing, details, status updates, cancel/settle, history, rating/reputation,
  - disputes, blocking, bulk accept, eligibility checks, recommendations.
- [ ] Replace asset-management stubs in `server/services/gameAssetsService.ts` with production storage flows:
  - asset CRUD, bundle CRUD, manifest generation/versioning,
  - CDN sync, integrity validation, cache control, rollback, stats/reporting.
- [ ] Replace placeholder DB connection metrics in `server/services/serverStatusService.ts` with real live metrics.

## Priority P1 — Frontend features still placeholder-only

- [x] Implement alliance diplomacy/chat actions now wired to API mutations in `client/src/pages/Alliance.tsx`.
- [x] Implement army equipment/deploy workflows in `client/src/pages/Army.tsx`.
- [x] Implement celestial browser detail/system navigation actions in `client/src/pages/CelestialBrowser.tsx`.
- [x] Implement exploration anomaly scan and gate capture/jump actions in `client/src/pages/Exploration.tsx`.
- [x] Implement friend request accept/reject backend actions in `client/src/pages/FriendsList.tsx`.
- [x] Implement market exchange action in `client/src/pages/Market.tsx`.
- [x] Implement raid boss challenge action in `client/src/pages/RaidBosses.tsx`.
- [x] Replace admin panel placeholder actions (`Export CSV`, `View user`) in `client/src/pages/Admin.tsx`.
- [x] Replace settings admin-tool placeholder actions (`Backup snapshot`, `Reset universe`, `Restart server`) in `client/src/pages/Settings.tsx`.

## Priority P2 — Content/system completeness

- [x] Replace Galaxy page synthetic data generation with server-side canonical universe data (`client/src/pages/Galaxy.tsx`).
  - New route `GET /api/galaxy/:universe/:galaxy/:sector/:system` added (`server/routes-galaxy.ts`).
  - Client now uses `useQuery` instead of local `getSystemData()`.
- [x] Replace static troop roster seed (`MOCK_TROOPS`) with account/fleet-backed unit persistence (`client/src/pages/Army.tsx`).
- [x] Implement planet defense systems panel (`client/src/pages/PlanetDetail.tsx`) — full upgrade UI with `defenseUpgradeMutation`.
- [x] Implement alliance real-time chat (`client/src/pages/Alliance.tsx`) — polling + typing/send wiring present.

## P0 carried-forward fixes (session)

- [x] Replace `alert()` calls in `client/src/lib/gameContext.tsx` (`craftItem`, `activateArtifact`, `travelTo`) with `toast()` notifications.

## Suggested implementation order

1. Combat and mining persistence (P0)
2. Research trading + achievements/custom labs/multiplayer bonuses (P1 backend)
3. Replace gameplay `alert(...)` handlers with API actions (P0/P1 frontend)
4. Asset pipeline and server status hardening (P1)
5. Remaining content completeness tasks (P2)
