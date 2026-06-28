# Server Console Launcher

**EXE:** `output/ServerConsole.exe`

Full server window with health monitoring. Runs the server in the background and continuously checks health endpoints. Auto-restarts if the server becomes unhealthy.

## Features
- Background server process
- 30-second health check interval
- Auto-restart after 5 consecutive failures
- Timestamped health status in console
- Graceful shutdown handling

## Build
```batch
build.bat
```

## Usage
Copy `output/ServerConsole.exe` to the project root, then run it.
