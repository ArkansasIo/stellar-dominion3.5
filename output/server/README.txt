# Universe Empire Dominion - Standalone Executables

## Installation

### Windows
1. Extract `UniverseEmpireDominion-windows.exe`
2. Double-click to run
3. Server will start on http://localhost:3000

### Linux
1. Extract `UniverseEmpireDominion-linux`
2. Make executable: `chmod +x UniverseEmpireDominion-linux`
3. Run: `./UniverseEmpireDominion-linux`
4. Server will start on http://localhost:3000

### macOS
1. Extract `UniverseEmpireDominion-macos`
2. Make executable: `chmod +x UniverseEmpireDominion-macos`
3. Run: `./UniverseEmpireDominion-macos`
4. Server will start on http://localhost:3000

### Raspberry Pi
1. Extract `UniverseEmpireDominion-raspberry-pi`
2. Make executable: `chmod +x UniverseEmpireDominion-raspberry-pi`
3. Run: `./UniverseEmpireDominion-raspberry-pi`
4. Server will start on http://localhost:3000

## Configuration

Create a `.env.local` file in the same directory as the executable:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/universe_empire
PORT=3000
NODE_ENV=production
SESSION_SECRET=your-secret-key
```

## Requirements

- PostgreSQL 14+ must be installed and running
- Database must be created before first run
- Port 3000 must be available (or change PORT in .env.local)

## First Run

1. Install PostgreSQL
2. Create database: `createdb universe_empire`
3. Create .env.local with database credentials
4. Run the executable
5. Open browser: http://localhost:3000

## Support

For issues and documentation, visit:
https://github.com/yourusername/Universe-Empire-Dominion

Version: 1.0.0
