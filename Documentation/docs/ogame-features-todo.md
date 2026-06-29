# OGame Feature Implementation TODO

> Compiled from the [OGame Fandom Wiki](https://ogame.fandom.com/wiki/Main_Page) — all pages, categories, and subpages scanned against current codebase.
> Legend: ✅ Implemented | ⚠️ Partial | ❌ Missing

---

## 1. Universe & Map System

| Feature | Status | Notes |
|---------|--------|-------|
| Galaxy view | ✅ | |
| Solar System view | ✅ | |
| Planet management | ✅ | |
| Moon creation/destruction | ✅ | Debris-based, Deathstar required |
| Coordinates system | ✅ | Galaxy:SolarSystem:Position |
| Universe types (speed, ACScs, etc.) | ✅ | 90 procedurally generated universes |

---

## 2. Resource Buildings

| Building | Status | Notes |
|----------|--------|-------|
| Metal Mine | ✅ | |
| Crystal Mine | ✅ | |
| Deuterium Synthesizer | ✅ | |
| Solar Plant | ✅ | |
| Fusion Reactor | ✅ | |
| Metal Storage | ✅ | |
| Crystal Storage | ✅ | |
| Deuterium Tank | ✅ | |
| Crawler | ✅ | Collector class ship, production bonus |

---

## 3. Facilities

| Facility | Status | Notes |
|----------|--------|-------|
| Robotics Factory | ✅ | |
| Shipyard | ✅ | |
| Research Lab | ✅ | Multiple lab types with specialization |
| Alliance Depot | ✅ | Deuterium supply rocket mechanic |
| Missile Silo | ✅ | |
| Nanite Factory | ✅ | |
| Terraformer | ✅ | |
| Space Dock | ✅ | Orbital, no planet field usage, ship repair |
| Sensor Phalanx | ✅ | Moon-only, range = level² - 1 |
| Jump Gate | ✅ | Moon-only, cooldown after use |

---

## 4. Technologies (All 16)

| Technology | Status | Notes |
|------------|--------|-------|
| Espionage Technology | ✅ | |
| Computer Technology | ✅ | |
| Weapons Technology | ✅ | Named "Weapons Technology" |
| Shielding Technology | ✅ | |
| Armour Technology | ✅ | |
| Energy Technology | ✅ | |
| Hyperspace Technology | ✅ | |
| Combustion Drive | ✅ | |
| Impulse Drive | ✅ | |
| Hyperspace Drive | ✅ | |
| Laser Technology | ✅ | |
| Ion Technology | ✅ | |
| Plasma Technology | ✅ | |
| Intergalactic Research Network | ✅ | |
| Astrophysics | ✅ | Old name: Expedition Technology |
| Graviton Technology | ✅ | |

---

## 5. Civil Ships

| Ship | Status | Notes |
|------|--------|-------|
| Small Cargo Ship | ✅ | |
| Large Cargo Ship | ✅ | |
| Colony Ship | ✅ | |
| Recycler | ✅ | Debris field harvesting |
| Espionage Probe | ✅ | |
| Solar Satellite | ✅ | |

---

## 6. Combat Ships

| Ship | Status | Notes |
|------|--------|-------|
| Light Fighter | ✅ | Hamill Manoeuvre vs Deathstar (General) |
| Heavy Fighter | ✅ | |
| Cruiser | ✅ | |
| Battleship | ✅ | |
| Battlecruiser | ✅ | |
| Bomber | ✅ | |
| Destroyer | ✅ | |
| Deathstar | ✅ | Moon destruction mechanic |
| Reaper | ✅ | Discoverer class only |
| Pathfinder | ✅ | Discoverer class only, expedition debris |

---

## 7. Defense Structures

| Structure | Status | Notes |
|-----------|--------|-------|
| Rocket Launcher | ✅ | |
| Light Laser | ✅ | |
| Heavy Laser | ✅ | |
| Ion Cannon | ✅ | |
| Gauss Cannon | ✅ | |
| Plasma Turret | ✅ | |
| Small Shield Dome | ✅ | |
| Large Shield Dome | ✅ | |
| Anti-Ballistic Missile | ✅ | |

---

## 8. Fleet Missions

| Mission | Status | Notes |
|---------|--------|-------|
| Attack | ✅ | |
| ACS Attack | ✅ | Alliance Combat System |
| ACS Defend | ✅ | |
| Transport | ✅ | |
| Deploy | ✅ | |
| Hold Position | ✅ | |
| Espionage | ✅ | |
| Colonize | ✅ | |
| Recycle | ✅ | Debris field harvesting |
| Destroy (Moon) | ✅ | Deathstar required |
| Expedition | ✅ | Full event system |
| Trade | ✅ | |
| Missile Attack | ✅ | |

---

## 9. Gameplay Systems

| System | Status | Notes |
|--------|--------|-------|
| Research queue | ✅ | |
| Construction queue | ✅ | |
| Fleet movement / flight times | ✅ | |
| Debris fields | ✅ | Configurable rates per galaxy |
| Moon creation from debris | ✅ | |
| Espionage reports | ✅ | |
| Battle reports | ✅ | |
| ACS (Alliance Combat System) | ✅ | Group attacks & defends |
| Fleetsaving mechanics | ✅ | |
| Vacation mode | ✅ | |
| Outlaw system | ✅ | |
| Bashing limit | | ⚠️ Check enforcement |
| Push protection | ✅ | |
| Occupation system | ✅ | Planet/moon occupation |

---

## 10. Player Classes

| Class | Status | Notes |
|-------|--------|-------|
| Collector | ✅ | +10% mine production, +50% crawler bonus |
| Discoverer | ✅ | Expedition bonus, +20% phalanx range, Pathfinder/Reaper |
| General | ✅ | Combat bonuses, Hamill Manoeuvre |
| Trader | ✅ | Trade bonuses |
| Researcher | ✅ | Research speed bonuses |
| Warrior | ✅ | Combat-oriented class |

---

## 11. Premium / Officer System

| Feature | Status | Notes |
|---------|--------|-------|
| Dark Matter | ✅ | Premium currency |
| Merchant | ✅ | Resource trading |
| Relocation | ✅ | Planet/moon relocation |
| Commander | ✅ | Recruit/level commanders |
| Officers (Admiral) | ⚠️ | Partial - commander system exists, full OGame officers missing |
| Officers (Engineer) | ⚠️ | Partial |
| Officers (Geologist) | ⚠️ | Partial |
| Officers (Technocrat) | ⚠️ | Partial |

---

## 12. Lifeforms (OGame Feature)

| Lifeform | Status | Notes |
|----------|--------|-------|
| General lifeform system | ✅ | Tech bonuses, population, protection |
| Kaelesh | ❌ | OGame-specific race not implemented |
| Rock'tal | ❌ | OGame-specific race not implemented |
| Mechas | ❌ | OGame-specific race not implemented |
| Humans | ❌ | OGame-specific race not implemented |
| Lifeform Research | ⚠️ | Partial - custom lifeform tech tree exists |
| Lifeform Buildings | ⚠️ | Partial - custom buildings exist |

---

## 13. Trade & Economy

| Feature | Status | Notes |
|---------|--------|-------|
| Resource trading | ✅ | |
| Marketplace | ✅ | Resource & celestial trading |
| Auction house | ✅ | Player-to-player auctions |
| Trade offers | ✅ | Direct P2P trading |
| Alliance bank | ❌ | Not found in codebase |
| Resource refineries | ✅ | |
| 3-tier currency (Silver/Gold/Platinum) | ✅ | |

---

## 14. Alliance / Social

| Feature | Status | Notes |
|---------|--------|-------|
| Alliances | ✅ | Full management with ranks |
| Alliance Depot | ✅ | Deuterium supply rocket |
| ACS (Alliance Combat System) | ✅ | Group attacks & defends |
| Alliance bank | ❌ | Missing |
| Guilds | ✅ | Enhanced guild system |
| Friends | ✅ | |
| Messages / mail | ✅ | |
| Forums | ✅ | In-game forums |
| Teams | ✅ | 6-player raid teams |

---

## 15. Combat Systems

| Feature | Status | Notes |
|---------|--------|-------|
| OGame-style battle engine | ✅ | Shield/armor/hull, rapid fire, formations |
| Ground combat | ✅ | Planetary invasions |
| Missile system | ✅ | ABM/IPM, silo |
| Debris field calculation | ✅ | Configurable rates |
| Wreck field repair | ✅ | Space Dock |
| Ship repair | ✅ | |
| Defense repair | ✅ | |

---

## 16. Events & Content

| Feature | Status | Notes |
|---------|--------|-------|
| Expeditions | ✅ | Full event types (resources, pirates, aliens, etc.) |
| Universe events | ✅ | 50 types (boss raids, meteor strikes, etc.) |
| Universe bosses | ✅ | 90 unique bosses |
| Raids | ✅ | Guild vs guild, team vs team |
| Trials | ✅ | Tiered challenge waves |
| Weekly missions | ✅ | |
| Season / Battle pass | ✅ | |
| Story mode | ✅ | Campaign with acts, chapters |
| Dimensional anomalies | ✅ | |
| Abyssal gates | ✅ | Token-based |

---

## 17. Other OGame Mechanics

| Mechanic | Status | Notes |
|----------|--------|-------|
| Wreck field from combat | ✅ | |
| Recycler debris harvesting | ✅ | |
| Espionage probe mechanics | ✅ | |
| ACS joint attacks | ✅ | |
| ACS joint defense | ✅ | |
| Moon destruction (Deathstar) | ✅ | |
| Jump gate cooldown | ✅ | |
| Phalanx scanning cost (5k deut) | ✅ | |
| Fleetsaving | ✅ | |
| Colony Ship colonization | ✅ | |

---

## Summary: Priority TODO

### Immediate (Missing Features)
1. **Alliance bank** — storage/deposit/withdrawal system for alliance resources
2. **Full OGame officer roster** — Admiral, Engineer, Geologist, Technocrat with specific bonuses
3. **OGame lifeform races** — Kaelesh, Rock'tal, Mechas, Humans with unique bonuses

### Enhancement (Partial Features)
4. **Bashing limit enforcement** — verify limits are active
5. **Lifeform research tree** — align closer with OGame lifeform tech structure
6. **Officer abilities** — flesh out full officer skill trees

### Polish (Existing Features)
7. **Weapons Technology naming** — consistent naming across codebase
8. **UI alignment** — verify all building/ship icons and labels match OGame convention

---

> Document generated from OGame Fandom Wiki (Main Page + all subpages/categories) analyzed against codebase at `C:\Users\Shadow\Music\New folder\universe-empire-dominion3`.
> Wiki reference: [OGame Fandom Wiki](https://ogame.fandom.com/wiki/Main_Page)
