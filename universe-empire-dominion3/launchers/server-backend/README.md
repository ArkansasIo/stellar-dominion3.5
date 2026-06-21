# Server Backend Launcher

**EXE:** `output/ServerBackendLauncher.exe`

Runs the Node.js game server in a visible console window. Displays server output, errors, and status in real-time.

## Features
- Visible console output from the server
- Proper stdio forwarding (stdout, stderr, stdin)
- Auto-detects Node.js and server files
- Graceful shutdown on Ctrl+C

## Build
```batch
build.bat
```

## Usage
Copy `output/ServerBackendLauncher.exe` to the project root, then run it.
The server will start and listen on port 5001.
