# Backend Console Workflows

This folder contains multiple server management workflows for Stellar Dominion.

## Available Workflows

### 1. Main Console Menu (`index.ts`)
Interactive CLI menu for comprehensive server management.

**Features:**
- View system status and server health
- Browse and filter logs by type/category
- Access server settings
- Clear logs and export data

**Run as workflow:**
```ini
[backend-console]
run = "tsx server/console/index.ts"
```

**Command line:**
```bash
npm run tsx server/console/index.ts
```

---

### 2. Database Monitor (`database-monitor.ts`)
Real-time database connection monitoring.

**Features:**
- Test database connectivity
- Display connection configuration
- Monitor database status

**Run as workflow:**
```ini
[db-monitor]
run = "tsx server/console/database-monitor.ts"
```

---

### 3. Auth & Session Monitor (`auth-monitor.ts`)
Real-time authentication and session event monitoring.

**Features:**
- Live auth event statistics
- Login attempt tracking
- Failed attempt detection
- Success rate calculation
- Real-time event feed

**Run as workflow:**
```ini
[auth-monitor]
run = "tsx server/console/auth-monitor.ts"
```

---

### 4. Performance Monitor (`performance-monitor.ts`)
Real-time API performance and system health monitoring.

**Features:**
- API response time tracking (avg/max)
- Request volume monitoring
- Error rate analysis
- System uptime and memory usage
- Live updates every 5 seconds

**Run as workflow:**
```ini
[performance-monitor]
run = "tsx server/console/performance-monitor.ts"
```

---

### 5. Log Export & Analytics (`log-export.ts`)
One-time export of logs and analytics reports.

**Features:**
- Export all logs to JSON file
- Generate analytics summary
- Calculate error rates
- Saves to `server/logs/` directory

**Run as workflow:**
```ini
[log-export]
run = "tsx server/console/log-export.ts"
```

**Command line:**
```bash
npm run tsx server/console/log-export.ts
```

---

## Setup: Adding Workflows to `.replit`

Add these to your `.replit` file to create separate workflow panels:

```ini
[Start application]
run = "npm run dev"

[backend-console]
run = "tsx server/console/index.ts"

[db-monitor]
run = "tsx server/console/database-monitor.ts"

[auth-monitor]
run = "tsx server/console/auth-monitor.ts"

[performance-monitor]
run = "tsx server/console/performance-monitor.ts"

[log-export]
run = "tsx server/console/log-export.ts"
```

Each workflow runs independently and can be started/stopped separately.

---

## Usage Guide

### Interactive Console (Main Menu)
```
1. View System Status    → Shows server health, log stats
2. View Logs             → Filter logs by level/category
3. Server Settings       → Database, session, environment info
4. Clear Logs            → Wipe all logs
5. Export Logs           → Save logs to JSON
0. Exit
```

### Live Monitoring Workflows
All monitoring workflows update every 5 seconds and display real-time metrics:

**Database Monitor:**
- Connection status
- Configuration details

**Auth Monitor:**
- Recent auth events
- Login statistics
- Success/failure rates

**Performance Monitor:**
- API response times
- Request volume
- Error counts
- Memory/uptime info

**Log Export:**
- Exports logs and stats
- Generates analytics report
- Saves files to `server/logs/`

---

## Log Categories

- **AUTH** - Authentication, login, session events
- **API** - HTTP requests, responses, timing
- **DB** - Database operations
- **SESSION** - Session lifecycle events
- **SERVER** - General server events

## Log Levels

- **INFO** - General information
- **WARN** - Warning conditions
- **ERROR** - Error events
- **DEBUG** - Debug information

---

## Colors & Symbols

| Symbol | Meaning |
|--------|---------|
| ✅ | Success/Active |
| ❌ | Error/Failed |
| ⚠️ | Warning |
| 🔍 | Debug |
| ℹ️ | Information |
| ● | Status indicator |

---

## Architecture

```
server/console/
├── index.ts                 # Main interactive console
├── database-monitor.ts      # DB monitoring workflow
├── auth-monitor.ts          # Auth/session monitoring
├── performance-monitor.ts   # API performance monitoring
├── log-export.ts            # Log export workflow
├── README.md                # This file
└── (consoleMenu.ts in parent - shared menu implementation)
```

---

## Tips

1. **Run Multiple Workflows**: All workflows can run simultaneously
2. **Shared Logs**: All workflows read from the same in-memory log store
3. **No Authentication**: Console workflows don't require auth
4. **Real-time Updates**: Monitoring workflows refresh every 5 seconds
5. **Exit Safely**: Press Ctrl+C to exit any monitoring workflow

