# Game Design

## Overview

`Universe Empire Dominions` is a browser-based sci-fi empire game that combines real-time progression, menu-driven strategy, long-form empire management, and RPG-flavored progression layers.

The current playable shape is a hybrid of:

- classic browser empire management
- linked page and submenu navigation
- resource, building, research, and fleet loops
- exploration, occupation, and combat management
- account, settings, and system telemetry layers

## Product Pillars

1. Persistent empire growth across many specialized pages
2. Clear command flow through one shared in-game shell
3. Broad system coverage: empire, research, military, diplomacy, economy, exploration
4. Imported-source enrichment without losing the current app identity
5. Accessibility across desktop, mobile widths, and touch devices

## Current Player Experience

### Title Screen

The front page is not the in-game shell. It is a command-themed title screen centered around login and account entry.

Key elements:

- left panel: `Nine Realms` with realm names, ranks, universe groupings, and realm details
- center panel: login, account creation, forgot-password flow, and demo access
- right panel: `Server Health` summary sourced from `/api/status/health`
- top strip: external/community links
- bottom strip: game version, build channel, universe id, and developer info

### In-Game Shell

After login, the player uses one consistent shell:

- top bar for resources, credits, food, water, turn data, and quick links
- left sidebar for the main menu tree
- submenu card strip for sibling pages inside the active section
- shared page banner that reflects the active menu context

This shell is the core navigation rule of the game and is intended to stay consistent across all main in-game pages and sub pages.

## Core Loop

1. Review empire state from the top bar, command pages, and alerts
2. Allocate resources into facilities, research, fleets, armies, or expansion
3. Use exploration, raids, combat, and occupation systems to create pressure or gain rewards
4. Return to empire, diplomacy, and economy pages to stabilize and scale
5. Tune display, notification, and control settings for the player�s device

## Major Design Domains

### Empire

Empire pages cover:

- empire command center
- empire overview
- planet and colony browsing
- facilities and stations
- megastructures
- civilization systems and Kardashev progression

The intent is to make empire management feel like a command network rather than a single dashboard.

### Research

Research is split between operational pages and reference pages:

- `Research Hub`
- `Research Management`
- `Technology Tree`
- `Tech Tree Legacy`
- blueprint, relic, and artifact pages

The player should always be able to see both immediate research actions and the longer progression graph.

### Military

Military systems currently center on:

- shipyard and fleet command
- army and army management
- expeditions
- combat center
- battle logs
- planet occupation
- raid operations, raid finder, and raid bosses

The design direction is to keep space forces, ground forces, and battle history connected rather than isolated.

### Exploration

Exploration is a broad domain that includes:

- interstellar view
- galaxy map
- universe view
- universe generator
- warp network
- celestial browser
- biome codex
- live universe events

This domain supports discovery, travel planning, system inspection, and event response.

### Diplomacy

Diplomacy pages currently include:

- commander
- government
- factions
- leaderboard
- alliance
- guilds
- friends
- messages

The game treats player identity and social structure as part of strategic power, not a separate meta layer.

### Economy

Economy pages cover:

- market
- merchants
- storefront
- achievements
- season pass
- battle pass
- story mode

This blends hard economy, reward loops, and progression incentives into one category because players usually cross these systems together during sessions.

## Resource Model

The top bar and empire state currently emphasize:

- metal
- crystal
- deuterium
- energy
- credits
- food
- water

Food and water extend the older space-economy loop into population and colony support systems.

## Device And Control Design

The current game design explicitly includes multi-device support.

Player settings support:

- device profile selection
- mobile optimization toggle
- touch controls toggle
- touch target size
- browser width preference
- sticky mobile bars
- compact view
- animation visibility
- resource-rate visibility

This is now part of the game design, not just a UI implementation detail, because the shell needs to remain usable on desktop, mobile browsers, and touch-first devices.

## Imported Asset And Reference Strategy

The game uses imported upstream visual assets and selected domain logic as enrichment, not as a full one-to-one clone.

Current design rule:

- the live experience is this game
- imported source is reference material and asset provenance
- the UI should stay consistent with the current left-sidebar shell and title-screen identity

## Current Boundaries

Some systems already exist as pages, configs, or partial APIs but are still evolving in depth. The documentation reflects the live structure first and avoids claiming that every page is fully simulation-complete.

## Design Outcome

The current version is best described as a broad command-shell browser game with strong page coverage, shared layout cohesion, imported-source integration, and an expanding set of empire, combat, and exploration mechanics.
