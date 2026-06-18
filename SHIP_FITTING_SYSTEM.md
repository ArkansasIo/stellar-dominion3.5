# Ship Fitting System - Complete Documentation

## Overview

The Ship Fitting System is a comprehensive EVE Online-inspired module management system for Universe Empire Dominion. It features **90+ modules** across multiple categories, classes, and types, allowing players to customize their starships with weapons, defense systems, propulsion, electronic warfare, and engineering modules.

## System Components

### 1. Module Catalog (`shipFittingModules.ts`)

**Total Modules: 90+**

#### Module Categories

1. **Weapons (30 modules)**
   - Projectile Weapons (Autocannons, Artillery)
   - Energy Weapons (Pulse Lasers, Beam Lasers, Tachyon)
   - Hybrid Weapons (Railguns, Blasters)
   - Missile Launchers (Light, Heavy, Cruise, Torpedoes)
   - Drones (Drone Bays)
   - Smart Bombs

2. **Defense (25 modules)**
   - Shield Boosters (Small, Medium, Large)
   - Shield Extenders (HP increase)
   - Shield Hardeners (EM, Thermal, Kinetic, Explosive)
   - Armor Repairers (Small, Medium, Large)
   - Armor Plates (HP increase)
   - Armor Hardeners (EM, Thermal, Kinetic, Explosive)

3. **Propulsion (8 modules)**
   - Afterburners (1MN, 10MN)
   - Microwarpdrives (5MN, 50MN)
   - Inertial Stabilizers
   - Overdrive Injectors

4. **Electronic Warfare (12 modules)**
   - ECM (Electronic Counter Measures)
   - Sensor Dampeners
   - Stasis Webifiers
   - Warp Disruptors
   - Warp Scramblers
   - Target Painters
   - Sensor Boosters
   - Tracking Computers

5. **Engineering (20 modules)**
   - Damage Modules (Gyrostabilizers, Heat Sinks, Magnetic Field Stabilizers, Ballistic Control Systems, Drone Damage Amplifiers)
   - Power/CPU Modules (Power Diagnostic Systems, Reactor Control Units, Co-Processors)
   - Capacitor Modules (Boosters, Batteries)
   - Cargo Expanders

6. **Rigs (15 modules)**
   - Armor Rigs (Repair, Resistance)
   - Shield Rigs (Extender, Resistance)
   - Weapon Rigs (Damage, Tracking, ROF)
   - Propulsion Rigs (Speed, Agility, Warp Speed)
   - Electronic Rigs (Targeting, Scan Resolution)
   - Utility Rigs (Cargo, Signature Reduction)

### 2. Module Properties

Each module has the following properties:

```typescript
interface ShipModule {
  id: string;                    // Unique identifier
  name: string;                  // Display name
  description: string;           // Module description
  category: string;              // weapon, defense, propulsion, electronic, engineering, utility
  class: string;                 // Main classification (projectile, energy, shield, armor, etc.)
  subclass: string;              // Detailed classification (autocannon, pulse_laser, booster, etc.)
  type: string;                  // Slot type: high, mid, low, rig, subsystem
  size: string;                  // small, medium, large, capital, universal
  meta: number;                  // Meta level 0-14 (0=T1, 5=T2, 6+=Faction/Officer/Deadspace)
  tech: number;                  // Tech level 1-3
  cpu: number;                   // CPU requirement
  powergrid: number;             // Powergrid requirement
  calibration?: number;          // Calibration cost (rigs only)
  capacitor?: number;            // Capacitor usage per cycle
  stats: { [key: string]: number | string | boolean };  // Module-specific stats
  requirements?: {
    skills?: { [key: string]: number };  // Required skills
    shipSize?: string[];                  // Compatible ship sizes
  };
  price: {
    isk: number;                 // ISK cost
    materials?: { [key: string]: number };  // Material requirements
  };
}
```

### 3. Slot Types

**High Slots** (Red)
- Weapons and offensive modules
- Drone bays
- Utility modules

**Mid Slots** (Blue)
- Shield modules
- Propulsion modules
- Electronic warfare
- Capacitor modules
- Sensor modules

**Low Slots** (Green)
- Armor modules
- Damage amplifiers
- Engineering modules
- Cargo expanders

**Rig Slots** (Purple)
- Permanent ship modifications
- Cannot be removed without destroying
- Use calibration points
- Provide bonuses with drawbacks

### 4. Ship Sizes

- **Small**: Frigates, Destroyers
- **Medium**: Cruisers, Battlecruisers
- **Large**: Battleships, Dreadnoughts
- **Capital**: Carriers, Supercarriers, Titans
- **Universal**: Fits all ship sizes

### 5. Tech Levels

**Tech I (T1)**
- Standard modules
- Basic performance
- Low skill requirements
- Affordable

**Tech II (T2)**
- Advanced modules
- Superior performance
- Higher skill requirements
- Expensive

**Tech III (T3)**
- Elite modules
- Exceptional performance
- Very high skill requirements
- Very expensive

### 6. Meta Levels

- **Meta 0**: Tech I baseline
- **Meta 1-4**: Improved T1 variants (faction drops)
- **Meta 5**: Tech II
- **Meta 6**: Faction modules
- **Meta 7**: Officer modules
- **Meta 8**: Deadspace modules
- **Meta 14**: Storyline modules

## Ship Fitting Interface

### Features

1. **Hull Selection**
   - Choose from multiple ship classes
   - View ship statistics and slot layout
   - See base resources (CPU, Powergrid, Calibration)

2. **Resource Management**
   - Real-time CPU usage tracking
   - Real-time Powergrid usage tracking
   - Real-time Calibration usage tracking
   - Visual progress bars with color coding

3. **Module Browser**
   - Search by name, description, or class
   - Filter by category (weapon, defense, etc.)
   - Filter by slot type (high, mid, low, rig)
   - Filter by ship size compatibility
   - View module stats and requirements

4. **Fitting Management**
   - Drag-and-drop module installation
   - Click-to-fit interface
   - Remove modules from slots
   - Save fittings to local storage
   - Clear all modules
   - Copy fittings

5. **Validation**
   - Check CPU availability
   - Check Powergrid availability
   - Check Calibration availability
   - Verify ship size compatibility
   - Validate skill requirements

## Module Examples

### Weapons

**125mm Autocannon I**
- Type: High Slot
- Size: Small
- CPU: 15 tf
- Powergrid: 5 MW
- Damage: 12
- Rate of Fire: 2.5s
- Range: 5,000m
- Tracking: 0.45
- Damage Type: Kinetic/Explosive

**Cruise Missile Launcher I**
- Type: High Slot
- Size: Large
- CPU: 95 tf
- Powergrid: 75 MW
- Damage: 650
- Rate of Fire: 15s
- Range: 150,000m
- Flight Time: 25s
- Damage Type: Kinetic/Explosive

### Defense

**Medium Shield Booster II**
- Type: Mid Slot
- Size: Medium
- CPU: 48 tf
- Powergrid: 65 MW
- Capacitor: 96 GJ
- Shield Repair: 280 HP
- Duration: 5s

**Large Armor Plate I**
- Type: Low Slot
- Size: Large
- CPU: 1 tf
- Powergrid: 12 MW
- Armor Bonus: +6,400 HP
- Mass Penalty: +50,000,000 kg
- Speed Penalty: -5%

### Propulsion

**5MN Microwarpdrive I**
- Type: Mid Slot
- Size: Small
- CPU: 45 tf
- Powergrid: 8 MW
- Capacitor: 55 GJ
- Speed Bonus: +500%
- Signature Penalty: +500%
- Mass Addition: +5,000,000 kg

### Electronic Warfare

**Warp Scrambler I**
- Type: Mid Slot
- Size: Universal
- CPU: 35 tf
- Powergrid: 1 MW
- Capacitor: 28 GJ
- Warp Scram Strength: 2
- Range: 9,000m
- Disables MWD: Yes

### Engineering

**Gyrostabilizer I**
- Type: Low Slot
- Size: Universal
- CPU: 28 tf
- Powergrid: 1 MW
- Damage Bonus: +10%
- Rate of Fire Bonus: +5%
- Weapon Type: Projectile

### Rigs

**Auxiliary Nano Pump I**
- Type: Rig Slot
- Size: Small
- Calibration: 50
- Armor Repair Bonus: +15%
- Drawback: Armor HP -10%

## Game Balance

### Resource Constraints

Ships have limited resources that constrain fitting options:

1. **CPU (Teraflops)**
   - Electronic and sensor modules use more CPU
   - Weapons use moderate CPU
   - Passive modules use less CPU

2. **Powergrid (Megawatts)**
   - Weapons use significant powergrid
   - Shield modules use moderate powergrid
   - Most other modules use minimal powergrid

3. **Calibration**
   - Only used by rigs
   - Typically 400 points total
   - Limits number of rigs that can be fitted

### Module Stacking Penalties

Multiple modules of the same type have diminishing returns:
- 1st module: 100% effectiveness
- 2nd module: 87% effectiveness
- 3rd module: 57% effectiveness
- 4th module: 28% effectiveness
- 5th module: 11% effectiveness
- 6th+ module: Minimal effect

### Fitting Strategies

**Tank Fitting**
- Focus on defense modules
- Shield tank: Shield boosters + hardeners
- Armor tank: Armor repairers + hardeners + plates
- Buffer tank: Maximum HP with extenders/plates

**DPS Fitting**
- Maximum damage output
- Damage amplifiers in low slots
- Tracking computers/enhancers
- Weapon upgrades

**Speed Fitting**
- Propulsion modules
- Inertial stabilizers
- Overdrive injectors
- Low signature radius

**EWAR Fitting**
- Electronic warfare modules
- Sensor boosters
- EWAR range scripts
- Capacitor management

**Balanced Fitting**
- Mix of offense and defense
- Sustainable capacitor
- Good mobility
- Versatile engagement options

## API Integration

### Endpoints

```typescript
// Get available modules
GET /api/fitting/modules
Response: { [moduleId: string]: ShipModule }

// Get ship fitting
GET /api/fitting/ship/:shipId
Response: ShipFitting

// Save fitting
POST /api/fitting/fit
Body: { shipId: string, modules: FittedModule[] }
Response: { success: boolean }

// Get saved fittings
GET /api/fitting/saved
Response: SavedFitting[]

// Delete fitting
DELETE /api/fitting/:fittingId
Response: { success: boolean }
```

### Data Structures

```typescript
interface ShipFitting {
  shipId: string;
  name: string;
  size: string;
  slots: { high: number; mid: number; low: number; rig: number };
  cpu: { total: number; used: number };
  powergrid: { total: number; used: number };
  calibration: { total: number; used: number };
  fitted_modules: { [slotType: string]: { [slotIndex: string]: string } };
}

interface FittedModule {
  moduleId: string;
  slotType: string;
  slotIndex: number;
}

interface SavedFitting {
  id: string;
  name: string;
  shipId: string;
  modules: FittedModule[];
  createdAt: string;
  updatedAt: string;
}
```

## Helper Functions

```typescript
// Get modules by category
getModulesByCategory(category: string): ShipModule[]

// Get modules by slot type
getModulesByType(type: string): ShipModule[]

// Get modules by ship size
getModulesBySize(size: string): ShipModule[]

// Get module by ID
getModuleById(id: string): ShipModule | undefined

// Get modules by class
getModulesByClass(moduleClass: string): ShipModule[]

// Get modules by subclass
getModulesBySubclass(subclass: string): ShipModule[]

// Get modules by tech level
getTechLevelModules(techLevel: number): ShipModule[]

// Get modules by meta level
getMetaLevelModules(metaLevel: number): ShipModule[]
```

## Future Enhancements

1. **Module Variants**
   - Faction modules (Caldari Navy, Federation Navy, etc.)
   - Officer modules (rare drops)
   - Deadspace modules (exploration rewards)

2. **Subsystems**
   - Tech 3 Strategic Cruiser subsystems
   - Defensive, Offensive, Propulsion, Engineering, Electronic subsystems

3. **Mutated Modules**
   - Abyssal deadspace mutaplasmids
   - Random stat modifications
   - Risk/reward module enhancement

4. **Fitting Simulator**
   - DPS calculator
   - Tank calculator
   - Engagement range analysis
   - Capacitor stability simulation

5. **Fitting Import/Export**
   - EFT format support
   - XML fitting format
   - Share fittings with alliance

6. **Module Market**
   - Buy/sell modules
   - Market orders
   - Price history
   - Regional availability

7. **Skill Training Integration**
   - Show required skills for modules
   - Training queue suggestions
   - Skill plan generation

8. **Ship Comparison**
   - Compare multiple fittings
   - Side-by-side statistics
   - Engagement simulation

## Technical Implementation

### File Structure

```
client/src/
├── lib/
│   └── shipFittingModules.ts      # Module catalog (1,891 lines)
├── pages/
│   ├── Fitting.tsx                 # Basic fitting page (324 lines)
│   └── FittingEnhanced.tsx        # Advanced fitting page (545 lines)
└── components/
    └── fitting/
        ├── ModuleBrowser.tsx       # Module selection interface
        ├── SlotManager.tsx         # Slot management
        ├── ResourceDisplay.tsx     # CPU/PG/Cal display
        └── FittingStats.tsx        # Ship statistics
```

### Performance Considerations

1. **Module Filtering**
   - Client-side filtering for instant response
   - Indexed by category, type, and size
   - Search uses lowercase comparison

2. **Resource Calculation**
   - Real-time calculation on module changes
   - Memoized calculations for performance
   - Visual feedback for resource usage

3. **State Management**
   - Local state for fitting interface
   - LocalStorage for saved fittings
   - API calls for persistence

## Conclusion

The Ship Fitting System provides a deep, engaging module management experience with 90+ modules across 6 categories, 4 slot types, and 3 ship sizes. The system balances complexity with usability, offering both casual and hardcore players meaningful customization options for their starships.

**Total Implementation:**
- 90+ unique modules
- 6 module categories
- 4 slot types
- 3 tech levels
- 10 meta levels
- Full resource management
- Complete validation system
- Save/load functionality
- Advanced filtering and search

The system is production-ready and fully integrated with the game's existing infrastructure.