# Button Audit — Initial Findings

Date: 2026-08-24

## Static inventory

The client contains approximately 700+ button declarations and handlers across page and component files. A static candidate audit identified controls without an obvious local `onClick`, `onSubmit`, form-submit type, or direct link wrapper.

## Live checks

- Overview route loaded successfully in the authenticated demo session.
- Overview quick-action `Build Ships` was clicked successfully and navigated to `/shipyard`.
- Shipyard route loaded successfully after navigation, with fleet tabs and quantity controls rendered.

## High-risk candidate controls for targeted review

- Diplomacy: `Propose Treaty` and disabled Embassy `Upgrade` buttons.
- Factions: `Join` buttons.
- Merchants: quest `Accept` buttons.
- Fleet: `Run Simulation` button.
- Overview: shortcut buttons were confirmed link-wrapped despite appearing as unbound in the static heuristic.
- Story Mode: Season Pass and Storefront shortcuts were confirmed link-wrapped.
- Market: `Create Auction` was confirmed a DialogTrigger.
- Habitat Systems and 404 navigation controls were confirmed link-wrapped.

The static candidate list is in `notes/button-audit-candidates.txt`.

## Additional live checks

The authenticated Overview quick action `Build Ships` navigated correctly to `/shipyard`. The subsequent page state changed during interaction, so indexed browser clicks must be interpreted against the current rendered page rather than cached indices; the application remained stable and navigated to `/empire-view` without a crash. The live Shipyard DOM showed functioning tabs, quantity preset buttons, navigation links, and disabled states for unavailable actions.

## Critical runtime failure discovered

Opening `/fleet?tab=combat` in the live session produced the RouteErrorBoundary screen instead of Fleet. The captured error was `Maximum update depth exceeded`, and the boundary header was hard-coded as `Empire Progression could not render`. This is a separate runtime defect requiring repair before button verification can be considered complete.

The browser console did not expose a component stack, so the source-level effect audit is continuing in `GameProvider`, Fleet URL synchronization, and route-level state effects.

## Fleet Combat verification

After patching the Fleet crew synchronization effect, `/fleet?tab=combat` loaded normally; the maximum-update-depth white screen no longer occurred. Entering enemy power `5000` and activating `Run Simulation` produced a toast and an inline result: `High-risk engagement · estimated victory chance 0%`. This confirms the input and action handler are live.

## Training Center verification

`/training-center?tab=pipeline` loaded without a crash, but the page opened on the Tracks tab because Training Center does not currently initialize its tab state from the query string. The Pipeline tab is present and will be exercised directly; query-driven tab selection is a small navigation-state defect to consider fixing.

## Training pipeline interaction verification

The Pipeline tab activated correctly when clicked. Clicking Pause on the first program changed its state to `paused`, changed the control to `Resume`, and showed a `Training paused` toast. Clicking Expedite on the second program showed a `Training expedited` toast and kept the queue stable. These controls are now live in the current client state.

## Shipyard verification

The Shipyard route loaded normally. The construction and quantity controls are rendered, but the demo account currently shows ship entries as `LOCKED` and no visible active `Upgrade` action in the initial combat-fleet view. The page explains that Shipyard upgrades unlock advanced vessels; upgrade controls should remain disabled until the relevant economy/facility mutation path is available rather than acting as dead buttons.

## Facilities upgrade verification

The Facilities route loaded normally and exposed an enabled `UPGRADE TO LEVEL 1` control for Robotics Factory. Dependent Shipyard and Research Lab actions were correctly shown as `REQUIREMENTS NOT MET` because their prerequisites are not satisfied. The upgrade control is ready for direct activation testing.

## Facilities upgrade click

The enabled Robotics Factory `UPGRADE TO LEVEL 1` control was activated successfully without a crash. The page remained at Level 0 immediately afterward, consistent with the GameProvider implementation, which spends turns/resources and places construction into the queue before the level changes on completion. The route remained stable and the action was not a dead click.

## Social and merchant route verification

The Factions route loaded without errors, but the demo response contained zero memberships and no available factions, so Join could not be exercised against a rendered target. The Merchants route loaded normally with vendor selection, Overview, Offerings, and Quests tabs visible. The Quests tab is ready for direct interaction testing.

## Merchants quest verification

The Merchants Quests tab activated correctly and rendered three vendor quests with Accept buttons. Clicking the first Accept control did not produce a crash; the route remained stable. The page’s current vendor quest data is static, and the patched Factions quest acceptance state is not used by Merchants, so Merchants still needs a clear local acceptance state or a dedicated backend action before it can be considered fully functional.

## Merchant quest acceptance retest

After the local handler patch, the first Merchant quest Accept button changed to `Accepted` and became disabled on click. The route remained stable and the remaining two quests stayed actionable. This confirms the previously inert control now has visible behavior.

## Training Center deep-link and queue control

`/training-center?tab=pipeline` now opens the Pipeline tab directly. Clicking the first program’s Pause action produced a `Training paused` toast and changed the action to `Resume`, confirming the queue controls and feedback are working.

## Commerce Hub purchase feedback

Commerce Hub opened the Buy Resources tab correctly. Clicking `PURCHASE — COMING SOON` now produced the `Purchase lane unavailable` toast with guidance to use Market for active trading. The button is no longer an inert disabled control, while the product limitation remains explicit.

## Overview route note

The public root resolves to the landing page, and `/overview` resolves to the title/login screen when no active game session is present. The login screen exposes a safe `USE DEMO ACCOUNT (PLAYER1)` path for continuing authenticated button verification.

## Final validation boundary

`npm run check` and `npm run build` both passed after the button fixes. A subsequent attempt to re-enter the demo account from the public login screen returned `Too many auth attempts, please try again later`, so further authenticated route clicks were not repeated. Existing authenticated live checks already covered Overview-to-Shipyard navigation, Fleet Combat simulation, Training Center Pause/Resume behavior, Facilities upgrade initiation, Merchants quest acceptance, and Commerce Hub purchase feedback.
