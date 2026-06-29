# Systems Overview

This document summarizes the major live systems in the current project and where they are represented in code.

## Shell And Navigation

- Title/auth screen: [Auth.tsx](/d:/New%20folder/StellarDominion-2/client/src/pages/Auth.tsx)
- Shared in-game shell: [GameLayout.tsx](/d:/New%20folder/StellarDominion-2/client/src/components/layout/GameLayout.tsx)
- Page modules: [client/src/pages](/d:/New%20folder/StellarDominion-2/client/src/pages)

Current shell behavior:

- left main menu grouped by empire, research, military, exploration, diplomacy, economy, and system
- sibling submenu cards under the active group
- top resource bar with core and life-support resources
- mobile sheet navigation on smaller screens

## Title Screen Systems

Current title screen systems include:

- login and account entry
- forgot-password flow
- demo entry
- `Nine Realms` info panel
- `Server Health` telemetry panel
- version/build/footer identity strip

## Settings And Device Support

Player options are first-class system data.

Key settings routes and pages:

- [server/routes-settings.ts](/d:/New%20folder/StellarDominion-2/server/routes-settings.ts)
- [Settings.tsx](/d:/New%20folder/StellarDominion-2/client/src/pages/Settings.tsx)

Current display fields include:

- `deviceProfile`
- `mobileOptimized`
- `touchControls`
- `touchTargetSize`
- `browserWidth`
- `stickyMobileBars`
- `compactView`
- `showAnimations`
- `showResourceRates`

## Empire Systems

Representative pages:

- `EmpireCommandCenter.tsx`
- `EmpireView.tsx`
- `EmpirePlanetViewer.tsx`
- `PlanetCommand.tsx`
- `Colonies.tsx`
- `Facilities.tsx`
- `Stations.tsx`
- `MegaStructures.tsx`
- `CivilizationSystems.tsx`
- `CivilizationManagement.tsx`
- `EmpireProgression.tsx`

Core responsibilities:

- planet and colony oversight
- infrastructure growth
- empire-scale progression
- megastructure and station management

## Research Systems

Representative pages:

- `Research.tsx`
- `ResearchLab.tsx`
- `TechnologyTree.tsx`
- `TechTree.tsx`
- `Blueprints.tsx`
- `Artifacts.tsx`
- `Relics.tsx`
- `OgameCompendium.tsx`

Core responsibilities:

- active research management
- long-form technology reference
- blueprint and relic cataloging
- imported-source reference surfacing where useful

## Military Systems

Representative pages:

- `Shipyard.tsx`
- `Fleet.tsx`
- `Army.tsx`
- `ArmyManagement.tsx`
- `Expeditions.tsx`
- `Combat.tsx`
- `BattleLogs.tsx`
- `PlanetaryOccupation.tsx`
- `Raids.tsx`
- `RaidFinder.tsx`
- `RaidBosses.tsx`

Core responsibilities:

- fleet creation and dispatch
- army management
- combat presentation
- expedition loops
- occupation control
- raid discovery and boss tracking

## Exploration Systems

Representative pages:

- `Interstellar.tsx`
- `Galaxy.tsx`
- `Universe.tsx`
- `UniverseGenerator.tsx`
- `WarpNetwork.tsx`
- `Exploration.tsx`
- `CelestialBrowser.tsx`
- `BiomeCodex.tsx`
- `BiomeDetail.tsx`
- `UniverseEvents.tsx`

Core responsibilities:

- spatial browsing
- route planning
- generated world inspection
- environmental discovery
- live event monitoring

## Diplomacy And Social Systems

Representative pages:

- `Commander.tsx`
- `Government.tsx`
- `Factions.tsx`
- `Alliance.tsx`
- `Guilds.tsx`
- `FriendsList.tsx`
- `Messages.tsx`
- `Leaderboard.tsx`

Core responsibilities:

- player identity
- state structure and faction relations
- social coordination
- messaging and rankings

## Economy And Progression Systems

Representative pages:

- `Market.tsx`
- `Merchants.tsx`
- `Storefront.tsx`
- `Achievements.tsx`
- `SeasonPass.tsx`
- `BattlePass.tsx`
- `StoryMode.tsx`

Core responsibilities:

- trade and merchant interactions
- reward loops
- pass-based progression
- narrative progression entry points

## Asset And Imported-Source Systems

Key references:

- [shared/config/ogamexAssetsConfig.ts](/d:/New%20folder/StellarDominion-2/shared/config/ogamexAssetsConfig.ts)
- [GameAssetsGallery.tsx](/d:/New%20folder/StellarDominion-2/client/src/pages/GameAssetsGallery.tsx)
- [shared/ogamex](/d:/New%20folder/StellarDominion-2/shared/ogamex)
- [generated/ogamex-ts](/d:/New%20folder/StellarDominion-2/generated/ogamex-ts)

The project currently uses imported-source materials in three ways:

- asset reuse
- handwritten TypeScript bridge modules
- generated migration scaffolds for later curation

## Health And Operations

Operational systems visible in the current app include:

- `/api/status/health` for title-screen telemetry
- settings persistence via `/api/settings/player/options`
- diagnostics and server-console pages

## Current Reality Check

The game has wide system coverage and a strong shared shell. Some systems are page-complete before they are simulation-complete, so documentation should describe what is wired and present now without overstating backend depth.
