# Game Client Launcher

**EXE:** `output/GameClientLauncher.exe`

Starts the game server in the background, waits for it to be ready, then opens the game in a browser window. Shows a splash screen during loading.

## Features
- Splash screen with loading animation
- Background server process management
- Auto-detects Node.js and server files
- Health check before opening browser
- Clean shutdown on exit

## Build
```batch
build.bat
```
Requires MSVC (Visual Studio Build Tools or Developer Command Prompt).

## Usage
Copy `output/GameClientLauncher.exe` to the project root, then run it.
