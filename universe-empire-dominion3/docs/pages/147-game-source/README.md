# Game Source - PHP Laravel Backend

> Legacy PHP Laravel game source documentation

## Overview

**Location**: `game-source/`  
**Framework**: Laravel PHP  
**Status**: Legacy (being migrated to TypeScript)

## Directory Structure

```
game-source/
├── app/
│   ├── Models/          # Eloquent models (32 files)
│   ├── Services/       # Business logic (34 files)
│   ├── Http/Controllers/  # Route controllers (50+ files)
│   ├── Console/Commands/   # Artisan commands
│   ├── Events/          # Event handlers
│   ├── Facades/         # Static proxies
│   └── Factories/       # Model factories
├── routes/
│   ├── api.php        # API endpoints
│   ├── web.php        # Web routes
│   └── console.php   # Console routes
└── database/
    ├── migrations/   # DB migrations
    └── seeders/     # Data seeders
```

## Models

| Model | File | Key Methods |
|-------|------|-----------|
| User | `app/Models/User.php` | `isOnline()`, `getCharacterClassEnum()` |
| Planet | `app/Models/Planet.php` | |
| BuildingQueue | `app/Models/BuildingQueue.php` | |
| ResearchQueue | `app/Models/ResearchQueue.php` | |
| FleetMission | `app/Models/FleetMission.php` | |
| Alliance | `app/Models/Alliance.php` | |
| Message | `app/Models/Message.php` | |

### All Models
- `User.php`
- `Planet.php`
- `BuildingQueue.php`
- `ResearchQueue.php`
- `UnitQueue.php`
- `FleetMission.php`
- `FleetTemplate.php`
- `FleetUnion.php`
- `ResearchArea.php`
- `ResearchTechnology.php`
- `Alliance.php`
- `AllianceMember.php`
- `Message.php`
- `Highscore.php`

## Services

| Service | Purpose |
|---------|---------|
| `PlanetService.php` | Planet management |
| `PlayerService.php` | Player operations |
| `FleetMissionService.php` | Fleet missions |
| `BuildingQueueService.php` | Construction |
| `ResearchQueueService.php` | Research |
| `ResourceService.php` | Resources |
| `AllianceService.php` | Alliances |
| `MessageService.php` | Messaging |
| `MerchantService.php` | NPC merchants |
| `DarkMatterService.php` | Premium currency |

### All Services (34 total)
- AllianceDepotService
- AllianceService
- BbCodeParserService
- BuddyService
- BuildingQueueService
- CharacterClassService
- ChatService
- CoordinateDistanceCalculator
- CounterEspionageService
- DarkMatterService
- DarkMatterTransactionService
- DebrisFieldService
- FleetMissionService
- FleetUnionService
- HalvingService
- HighscoreService
- JumpGateService
- MerchantService
- MessageService
- NPCFleetGeneratorService
- NPCPlanetService
- NPCPlayerService
- ObjectService
- PhalanxService
- PlanetListService
- PlanetMoveService
- PlanetService
- PlayerService
- ResearchQueueService
- SettingsService
- UnitQueueService
- WreckFieldService

## Controllers

| Controller | Route Prefix | Purpose |
|-----------|------------|---------|
| `OverviewController` | `/` | Dashboard |
| `ResourcesController` | `/resources` | Resource view |
| `FacilitiesController` | `/facilities` | Buildings |
| `ShipyardController` | `/shipyard` | Shipyard |
| `FleetController` | `/fleet` | Fleet |
| `ResearchController` | `/research` | Research |
| `TechtreeController` | `/techtree` | Tech tree |
| `GalaxyController` | `/galaxy` | Galaxy map |
| `AllianceController` | `/alliance` | Alliances |
| `MessagesController` | `/messages` | Messages |
| `CombatController` | `/combat` | Combat |
| `HighscoreController` | `/highscore` | Rankings |
| `MerchantController` | `/merchant` | Shop |

## Key Files

- **Entry**: `bootstrap/app.php`
- **Config**: `config/game.php`
- **Routes**: `routes/web.php`, `routes/api.php`

## Migration

This PHP backend is being **migrated to TypeScript**.  
**Primary backend**: `server/` (Express.js/TypeScript)

---

*Part of Stellar Dominion 3.5 documentation*
