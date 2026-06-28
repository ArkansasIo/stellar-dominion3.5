# Universe Empire Dominion - Launcher Troubleshooting Guide

## Common Issues and Solutions

### 1. Database Error: "database 'universe_empire' does not exist"

**Symptoms:**
- Server starts but shows database connection errors
- Features may not work correctly
- Error message: `database "universe_empire" does not exist`

**Solutions:**

#### Option A: Create Database Manually
```bash
# Make sure PostgreSQL is running
pg_isready

# Create the database
createdb universe_empire

# Restart the launcher
node game-launcher.cjs
```

#### Option B: Use Setup Script
```bash
# Run the database setup script
npm run db:setup

# Or use PowerShell script
.\create-db.ps1
```

#### Option C: Check PostgreSQL Installation
```bash
# Verify PostgreSQL is installed
psql --version

# Check if PostgreSQL service is running (Windows)
Get-Service postgresql*

# Start PostgreSQL if needed (Windows)
Start-Service postgresql-x64-14
```

---

### 2. Build Directory Error: "Could not find the build directory"

**Symptoms:**
- Server crashes immediately after starting
- Error message: `Could not find the build directory`
- Missing client files

**Solutions:**

#### Option A: Build the Client
```bash
# Build the client application
npm run build

# Or build everything
npm run build:complete
```

#### Option B: Build Executables
```bash
# Build server and client executables
npm run build:exe

# This creates the complete output directory structure
```

#### Option C: Check Build Output
```bash
# Verify the dist directory exists
ls dist/public

# If missing, rebuild
npm install
npm run build
```

---

### 3. Server Won't Start

**Symptoms:**
- Launcher shows "Server failed to start within timeout"
- No server process running
- Port may be in use

**Solutions:**

#### Check Port Availability
```bash
# Windows: Check if port 3000 is in use
netstat -ano | findstr :3000

# Kill process using port 3000 (replace PID)
taskkill /PID <PID> /F
```

#### Check Server Executable
```bash
# Verify server executable exists
ls output/server/UniverseEmpireDominion-windows.exe

# If missing, rebuild
npm run build:exe
```

#### Check Configuration
```bash
# Verify .env.local exists
cat output/server/.env.local

# Check database URL is correct
# Should be: postgresql://postgres:postgres@localhost:5432/universe_empire
```

---

### 4. Browser Won't Open

**Symptoms:**
- Server starts successfully
- Browser doesn't open automatically
- Manual access works

**Solutions:**

#### Manual Browser Access
1. Open your browser manually
2. Navigate to: `http://localhost:3000`
3. The game should load

#### Check Default Browser
- Make sure you have a default browser set in Windows
- Try different browsers (Chrome, Firefox, Edge)

---

### 5. Server Crashes After Starting

**Symptoms:**
- Server starts then immediately crashes
- Exit code 1 or other error codes
- Error messages in console

**Solutions:**

#### Check Logs
```bash
# Run server directly to see full logs
cd output/server
.\UniverseEmpireDominion-windows.exe
```

#### Verify Dependencies
```bash
# Reinstall dependencies
npm install

# Rebuild everything
npm run build:complete
```

#### Check Node Version
```bash
# Verify Node.js version (should be 18.x or higher)
node --version

# Update if needed
```

---

## Quick Fixes

### Reset Everything
```bash
# 1. Stop all processes
# Press Ctrl+C in launcher

# 2. Clean build
npm run clean
npm install

# 3. Rebuild
npm run build:complete

# 4. Setup database
npm run db:setup

# 5. Start launcher
node game-launcher.cjs
```

### Database Reset
```bash
# Drop and recreate database
dropdb universe_empire
createdb universe_empire

# Run migrations
npm run db:migrate

# Restart launcher
node game-launcher.cjs
```

---

## Environment Variables

The launcher uses these environment variables from `output/server/.env.local`:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/universe_empire
PORT=3000
NODE_ENV=production
SESSION_SECRET=universe-empire-dominion-secret-key-change-in-production
DEBUG=false
```

### Customizing Configuration

1. Edit `output/server/.env.local`
2. Change values as needed
3. Restart the launcher

**Common Changes:**
- **Database URL**: Update if using different PostgreSQL credentials
- **Port**: Change if 3000 is in use
- **Debug**: Set to `true` for verbose logging

---

## System Requirements

### Minimum Requirements
- **OS**: Windows 10/11 (64-bit)
- **RAM**: 4GB minimum, 8GB recommended
- **Node.js**: v18.5.0 or higher
- **PostgreSQL**: v12 or higher
- **Disk Space**: 500MB free space

### Recommended Setup
- **OS**: Windows 11
- **RAM**: 16GB
- **Node.js**: Latest LTS version
- **PostgreSQL**: v14 or higher
- **SSD**: For better performance

---

## Getting Help

### Check Status
The launcher shows real-time status:
- **Server**: ● ONLINE / ● OFFLINE
- **Client**: ● OPEN / ● WAITING

### Enable Debug Mode
```bash
# Set DEBUG=true in .env.local
# Restart launcher for verbose logging
```

### Report Issues
If problems persist:
1. Check the error messages in the console
2. Review this troubleshooting guide
3. Check the GitHub issues page
4. Create a new issue with:
   - Error messages
   - System information
   - Steps to reproduce

---

## Advanced Troubleshooting

### Check PostgreSQL Connection
```bash
# Test database connection
psql -U postgres -d universe_empire -c "SELECT version();"
```

### Verify File Permissions
```bash
# Windows: Check if executable has permissions
icacls output\server\UniverseEmpireDominion-windows.exe
```

### Network Issues
```bash
# Check if localhost resolves
ping localhost

# Check firewall settings
# Make sure port 3000 is not blocked
```

---

## Prevention Tips

1. **Always build before running**: `npm run build:complete`
2. **Keep PostgreSQL running**: Set it to start automatically
3. **Use the launcher**: Don't run server/client separately
4. **Check logs**: Monitor console output for warnings
5. **Update regularly**: Keep dependencies up to date

---

## Quick Reference

| Issue | Quick Fix |
|-------|-----------|
| Database error | `createdb universe_empire` |
| Build error | `npm run build` |
| Port in use | `netstat -ano \| findstr :3000` |
| Server won't start | `npm run build:exe` |
| Browser won't open | Open `http://localhost:3000` manually |

---

**Last Updated**: 2026-06-15
**Version**: 1.0.0
**Made with ❤️ by Bob**