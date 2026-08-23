# Unified Systems Integration

## Design model

Universe Civilization: Empire at War now treats the established empire and the newer Stargate layer as complementary command domains rather than separate games. Conventional Metal, Crystal, Deuterium, buildings, research, fleets, colonies, and missions remain the empire-development foundation. Naquadah, strategic personnel, doctrine, DefCon, intelligence, armory, worlds, alliances, rankings, and Ascension remain the strategic-command layer.

Both domains share one player-state record. Conventional values remain in `resources`, `buildings`, `research`, and legacy unit keys. Stargate resources are preserved in the same `resources` object, while strategic states remain under `government.stargateWars` and `government.stargateSystems`.

## Implemented integration safeguards

The conventional resource normalizer preserves Naquadah and banked Naquadah. The Stargate persistence method now merges strategic personnel into `units` rather than replacing the full unit record, so legacy fleet and army entries survive strategic actions. A shared `unitState` boundary separates legacy fleet totals from strategic personnel totals in aggregate dashboards.

Both the main Overview and Empire Command Center now include the live **Unified Command Network** panel. It displays conventional industry per hour, Naquadah balance and per-turn income, legacy fleet count, strategic personnel count, doctrine, DefCon, strategic action metrics, and direct links to Industry, Research, Fleet, and Strategic Command.

## Live verification

The public production runtime was checked at the Overview route and the Empire Command Center route. In both locations the panel loaded with the active account’s live state: 55 conventional resources per hour, 5,100 Naquadah per thirty-minute turn, zero legacy ships, 120 strategic personnel, Tau'ri doctrine, and DefCon none. Cross-system navigation links resolved to the intended established and Stargate hubs.

The isolated persistence simulation also confirmed that a strategic turn retains legacy `lightFighter` and `cruiser` keys while adding strategic personnel and Naquadah output. TypeScript validation passed before the production deployment.
