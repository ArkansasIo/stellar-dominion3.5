
Three.js Galaxy Control Viewer

Instructions:

1. Open index.html in a modern browser.
2. Orbit with the mouse.
3. Click a star to select a system.
4. Click a planet to switch into the local planet view.
5. Use the left rail menus and sub pages to change the active 3D layer.
6. Use the screen HUD and sub HUD cards to read live universe, planet, input, and overlay status.
7. Use the top pills to switch galaxy, system, and planet camera modes.
8. Use the ship mode pills to preview patrol, survey, intercept, and colonize behavior.
9. Open the Settings menu to see keyboard, mouse, Xbox, PS5, and generic controller mappings.
10. Press R to regenerate, F to focus, 1 / 2 / 3 to swap views, Q / E to cycle ship modes, [ / ] to cycle menus, and , / . to cycle sub pages.
11. Use W / A / S / D to pan, Arrow Keys to orbit, and Z / X to zoom with the keyboard.
12. Connect an Xbox or PS5 controller to use sticks for camera control and buttons for menu navigation.

Features:
- Stellaris-style galaxy scale presets for Tiny, Small, Medium, Large, and Huge maps
- scale summaries for star-system diameter, hyperlane spacing, galaxy width, and total celestial-body estimates
- data-driven main menus, sub menus, pages, and overlay logic
- screen HUD and sub HUD overlays styled for a strategy viewer command deck
- command, navigation, intelligence, economy, fleets, diplomacy, and celestials views
- dedicated settings pages for input profiles and control references
- keyboard layout cards and controller keybind tables inside the Settings pages
- source-link manifest that maps the viewer to the main game folders and 3D asset roots
- per-page code links that map active viewer menus to real main-game source files
- runtime bridge snapshot that injects main-game-derived systems, gates, destinations, and planet classes into the 3D scene
- galaxy, system, and planet camera modes
- procedural star systems with planets, moons, stations, asteroid belts, and interstellar objects
- 3D ship token controls for patrol, survey, intercept, and colonize posture
- keyboard, mouse, Xbox, PS5, and generic Gamepad API support for navigation and camera control
- responsive HUD for desktop and mobile
- asset template folders for browser delivery and Java-friendly 3D pipelines
- handcrafted sci-fi asset pack with browser-safe 2D plates and low-poly OBJ starter meshes
- in-viewer featured asset gallery showing sky, UI, planet, ship, and station packs
- nebula background and sector-grid overlay mounted directly into the live viewer shell

Folder notes:
- docs/asset_pipeline_guide.txt : format guidance for PNG, JPG, BMP, TGA, DDS, OBJ, FBX, GLTF, DAE, and J3O
- assets/textures : starter texture folders by format
- assets/models : starter model folders and template files
- src/data/assetCatalog.js : featured asset catalog mapped into the HUD by page context
- src/data/projectLinks.js : source-map manifest linking the viewer to the main game code and 3D content roots
- src/data/projectLinks.js : also maps active pages to concrete source files such as universe config, schema, storage, and client 3D modules
- src/data/gameRuntimeBridge.js : runtime bridge snapshot derived from main-game universe, travel, planet, and client 3D source data
- game-source/public/assets/3d : browser runtime asset template root
- game-source/resources/3d : higher-fidelity source asset template root

Stellaris-like Features:
- Galaxy Map View: Strategic overview of the entire galaxy with star systems
- System View: Detailed view of individual star systems with planets, stations, and ships
- Planet View: Close-up view of planetary systems and orbital mechanics
- Left Side Menu System: Hierarchical menus for Command, Navigation, Intelligence, Economy, Fleets, Diplomacy, and Celestials
- Right Side Panel: Detailed information panels with system stats, capabilities, and controls
- Multiple Camera Modes: Smooth transitions between galaxy, system, and planet perspectives
- Ship Control Modes: Different AI behaviors for fleet management (patrol, survey, intercept, colonize)
- Real-time HUD: Live status displays for selected systems and current view mode
- Input Support: Keyboard, mouse, and gamepad controls for full accessibility

3D Assets:
- assets/models/obj/ship_frigate_a.obj : Frigate ship model
- assets/models/obj/station_trade_hub_a.obj : Trade station model
- assets/models/obj/planet_verdant_01.obj : Verdant planet model
- asset_viewer.html : Standalone viewer for inspecting 3D models
