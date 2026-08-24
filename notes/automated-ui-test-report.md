# Automated UI Test Report

## Route smoke test

The route smoke test extracted 115 concrete routes from `client/src/App.tsx`, substituted safe values for dynamic parameters, and requested each route from the local server at `http://localhost:5001`. All 115 routes returned HTTP 200 and an application-shell marker. No route-level HTTP failure or missing-shell warning was detected.

## Automated command status

Results recorded during the current test run:

- `npm run check`: PASS
- `npm run build`: PASS
- `npm run smoke:life-support`: PASS
- `npm run test:boss-sim`: PASS — 54 typed encounters, 9/9 boss classes, 27/27 subclasses
- `npm run test:kardashev`: PASS
- `npm run test:tier18-stress`: PASS
- `python3 scripts/audit_buttons.py`: PASS — 67 static candidate lines after existing handler fixes

The route-level check validates server delivery and application-shell availability. It does not by itself prove that every React event handler completed successfully; live control checks are recorded separately below.

## Live control checks

Previously verified authenticated controls include Overview-to-Shipyard navigation, Fleet Combat simulation, Facilities upgrade initiation, Training Center Pipeline deep-linking, Training Center Pause/Resume, Merchants quest acceptance, and Commerce Hub purchase feedback. The current session may be authentication-rate-limited for additional browser checks.

## Live browser verification

The live authenticated Overview route loaded without a white-screen crash. Clicking `ENABLE AUDIO` changed the dock to `MUTE AUDIO` and changed the status to `Audio link active`, confirming the command-audio toggle responds correctly.

Additional live checks passed: `PLAY BRIEFING` changed to `PAUSE BRIEFING`, and the Overview `BUILD SHIPS` action navigated to `/shipyard` successfully.

The global Research navigation opened `/research` successfully. The page rendered Core Research, division tabs, and multiple active RESEARCH controls without a visible white-screen error. The browser console remained empty after the preceding Overview/Shipyard navigation.

The live Research route rendered successfully after navigation from Shipyard. The page displayed its core/division tabs and multiple `RESEARCH` action buttons without a white-screen failure. The button action was exercised before the client research-flow correction; the corrected flow now waits for server confirmation before adding local queue state.
