# Game Design Document: EVE-Inspired Features for StellarDominion

## Overview

This Game Design Document (GDD) proposes the integration of several key features and mechanics inspired by EVE Online into the StellarDominion (Universe Empire Dominions) game. The goal is to enhance the sandbox experience, deepen player-driven content, and expand the scope of empire management, combat, and social interactions.

Based on a scan of the EVE University Wiki (https://wiki.eveuniversity.org/Main_Page), the following features have been identified as absent from the current StellarDominion implementation but present in EVE Online. These features would complement the existing systems of empire building, research, military operations, exploration, diplomacy, and economy.

## Proposed Features

### 1. Real-Time Skill Training System

**Description**: Players train skills in real-time, even while logged off. Skills provide bonuses to ship performance, module effectiveness, and unlock new abilities.

**Current State in StellarDominion**: Research system exists but is turn-based or resource-gated.

**EVE Implementation**: Skills train continuously with exponential time costs per level. Queue up to 24 hours of training.

**Proposed Integration**:
- Replace or augment research with skill training.
- Skills affect ship stats, fitting options, and empire management efficiency.
- Alpha/Omega clone states limit skill training for free players.

**Benefits**: Adds long-term progression and planning depth.

### 2. Advanced Ship Fitting and Modules

**Description**: Ships equipped with interchangeable modules (high, mid, low slots), rigs, and subsystems for customization.

**Current State**: Military system has fleets and combat, but fitting details are minimal.

**EVE Implementation**: Detailed fitting with CPU/Powergrid constraints, capacitor management, resistances.

**Proposed Integration**:
- Expand shipyard to include fitting interface.
- Modules for weapons, defenses, propulsion, utility.
- Fitting simulator tool (in-game or external).

**Benefits**: Increases strategy in ship combat and personalization.

### 3. Player-Driven Market with Buy/Sell Orders

**Description**: Player-to-player trading with buy and sell orders, regional markets.

**Current State**: Economy has market, but likely simplified.

**EVE Implementation**: Complex market with orders, margins, manipulation.

**Proposed Integration**:
- Implement order-based trading.
- Market hubs in key systems.
- Economic simulation with supply/demand.

**Benefits**: Creates player-driven economy, trading careers.

### 4. Corporation Roles and Permissions

**Description**: Corporations with hierarchical roles, permissions for managing assets, wars, etc.

**Current State**: Diplomacy has alliances and guilds.

**EVE Implementation**: CEO, directors, roles for hangar access, wallet, etc.

**Proposed Integration**:
- Expand corporation management with roles.
- Permissions for facilities, fleets, diplomacy.

**Benefits**: Enhances social and organizational gameplay.

### 5. Alliance Politics and Wars

**Description**: Alliances form coalitions, declare wars, control territory.

**Current State**: Diplomacy has alliances.

**EVE Implementation**: Sovereignty wars, coalition politics.

**Proposed Integration**:
- Alliance-level diplomacy and warfare.
- Territorial control mechanics.

**Benefits**: Large-scale conflict and politics.

### 6. Sovereignty and Territorial Control

**Description**: Players claim and defend systems, build infrastructure.

**Current State**: Exploration has systems, but no ownership.

**EVE Implementation**: Null-sec sovereignty with structures, timers.

**Proposed Integration**:
- System ownership via alliances.
- Defensible structures (stations, citadels).

**Benefits**: Strategic depth in exploration and warfare.

### 7. Wormhole Exploration

**Description**: Dynamic wormhole systems connecting different regions.

**Current State**: Warp network exists.

**EVE Implementation**: Unstable wormholes with mass limits, collapse.

**Proposed Integration**:
- Add wormhole space with random connections.
- Exploration risks and rewards.

**Benefits**: Adds unpredictability and discovery.

### 8. Capital and Supercapital Ships

**Description**: Large ships for fleet command, logistics, destruction.

**Current State**: Military has fleets, but ship sizes limited.

**EVE Implementation**: Titans, supercarriers with special abilities.

**Proposed Integration**:
- Introduce capital ship classes.
- Require special facilities for construction.

**Benefits**: Escalates fleet battles.

### 9. Faction Warfare

**Description**: Players join factions, capture systems, earn rewards.

**Current State**: Diplomacy has factions.

**EVE Implementation**: Militia warfare with plexing, complexes.

**Proposed Integration**:
- Faction allegiance system.
- Contested systems with capture mechanics.

**Benefits**: Casual PvP and faction loyalty.

### 10. Incursions and Large-Scale PvE Events

**Description**: Community events with high rewards, requiring coordination.

**Current State**: Military has raids and expeditions.

**EVE Implementation**: Incursions with multiple sites, scaling difficulty.

**Proposed Integration**:
- Event-driven PvE with fleet requirements.
- Dynamic spawning based on player activity.

**Benefits**: Community engagement and high-stakes content.

### 11. Planetary Industry and Interaction

**Description**: Players manage planetary colonies for resources.

**Current State**: Empire has planets and colonies.

**EVE Implementation**: PI with extractors, processors, customs offices.

**Proposed Integration**:
- Expand colony management with resource extraction.
- Interplanetary trade.

**Benefits**: Economic diversification.

### 12. Invention and Reverse Engineering

**Description**: Research new technologies from blueprints.

**Current State**: Research system exists.

**EVE Implementation**: Invention with datacores, success rates.

**Proposed Integration**:
- Add invention mechanics to research.
- Blueprint copying and invention.

**Benefits**: Tech progression depth.

### 13. Clone States and Jump Clones

**Description**: Medical clones for respawning, jump clones for travel.

**Current State**: Not present.

**EVE Implementation**: Alpha/Omega, jump clones for instant travel.

**Proposed Integration**:
- Clone system for character safety.
- Jump clones for strategic positioning.

**Benefits**: Risk management and mobility.

### 14. Implants and Attribute Boosts

**Description**: Cybernetic implants enhance skills and attributes.

**Current State**: Not present.

**EVE Implementation**: Slot-based implants with risks.

**Proposed Integration**:
- Implant system tied to skills.
- Destruction penalties.

**Benefits**: Character customization and risk/reward.

### 15. Scams and Player Interactions

**Description**: Allow player scams, contracts, etc.

**Current State**: Economy has merchants.

**EVE Implementation**: Contract scams, market manipulation.

**Proposed Integration**:
- Enable player deception mechanics.
- Reporting system.

**Benefits**: Adds social depth and caution.

## Implementation Priorities

1. **High Priority**: Real-time skills, advanced fitting, player market.
2. **Medium Priority**: Corporation roles, sovereignty, wormholes.
3. **Low Priority**: Capitals, incursions, implants.

## Technical Considerations

- Backend: Need real-time processing for skill training.
- UI: Fitting interface, market orders.
- Balance: Ensure features integrate without breaking existing economy/military balance.

## Conclusion

Integrating these EVE-inspired features would transform StellarDominion into a more immersive sandbox MMO, emphasizing player agency and emergent gameplay. This GDD serves as a roadmap for phased implementation.</content>
<parameter name="filePath">d:\New folder\StellarDominion-2\GDD.md