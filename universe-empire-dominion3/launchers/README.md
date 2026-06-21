# Launchers - C++ EXE Build System

## Overview
Four C++ EXE launchers for Universe Empire Dominion, each in its own folder with build scripts and output directories.

## Launchers

| Launcher | EXE | Type | Purpose |
|----------|-----|------|---------|
| `game-client/` | `GameClientLauncher.exe` | Windows GUI | Starts server + opens game in browser |
| `server-backend/` | `ServerBackendLauncher.exe` | Console | Runs server with visible console output |
| `server-console/` | `ServerConsole.exe` | Console | Server with health monitoring + auto-restart |
| `combined-launcher/` | `UniverseEmpireDominion.exe` | Windows GUI | Main launcher: server + splash + game client |

## Folder Structure
```
launchers/
├── build-all.bat              # Build all 4 launchers at once
├── README.md                  # This file
├── game-client/
│   ├── game_client_launcher.cpp
│   ├── build.bat
│   ├── README.md
│   └── output/                # Built EXE goes here
├── server-backend/
│   ├── server_backend_launcher.cpp
│   ├── build.bat
│   ├── README.md
│   └── output/
├── server-console/
│   ├── server_console_launcher.cpp
│   ├── build.bat
│   ├── README.md
│   └── output/
└── combined-launcher/
    ├── combined_launcher.cpp
    ├── build.bat
    ├── README.md
    └── output/
```

## Requirements
- **MSVC Compiler** (Visual Studio 2022 Build Tools, Community, or Professional)
- **Windows SDK** (included with Visual Studio)
- OR **MinGW/MSYS2** with g++ (edit build scripts accordingly)

## Build All
From a Visual Studio Developer Command Prompt:
```batch
cd launchers
build-all.bat
```

## Build Individual
```batch
cd launchers\game-client
build.bat
```

## How They Work

### Game Client Launcher
1. Finds Node.js and server entry point
2. Starts server as hidden background process
3. Shows splash window while waiting
4. Opens `http://localhost:5001` in browser
5. Kills server on exit

### Server Backend Launcher
1. Finds Node.js and server entry point
2. Starts server with visible console (stdout/stderr forwarded)
3. Waits for server process to exit
4. Shows exit code on shutdown

### Server Console Launcher
1. Starts server as hidden background process
2. Runs health checks every 30 seconds via HTTP
3. Auto-restarts server after 5 consecutive failures
4. Shows timestamped status in console

### Combined Launcher (Main)
1. Finds Node.js and server entry point
2. Starts server as hidden background process
3. Shows splash screen during loading
4. Waits for server to be ready
5. Opens game in browser
6. Keeps message loop alive to manage server
