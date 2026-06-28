# Combined Launcher

**EXE:** `output/UniverseEmpireDominion.exe`

The main game launcher. Starts the server, shows a splash screen, waits for the server to be ready, then opens the game client. Keeps running to manage the server process.

## Features
- Splash screen with game branding
- Server process management
- Health check before client launch
- Message loop to keep server alive
- Clean shutdown on exit

## Build
```batch
build.bat
```

## Usage
Copy `output/UniverseEmpireDominion.exe` to the project root, then run it. This is the recommended launcher for end users.
