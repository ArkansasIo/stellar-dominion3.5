# Update System Guide

Complete guide for the Universe Empire Dominion automatic update system.

## Overview

The update system provides seamless patch distribution from VS Code to the server backend and then to all connected frontend clients. It supports:

- **Automatic version management**
- **Patch creation and deployment**
- **Client-side automatic updates**
- **Critical update forcing**
- **Rollback capabilities**
- **Update statistics tracking**

## Architecture

```
┌─────────────┐
│  VS Code    │
│  Developer  │
└──────┬──────┘
       │ 1. Create Patch
       ▼
┌─────────────┐
│   Build     │
│   System    │
└──────┬──────┘
       │ 2. Deploy
       ▼
┌─────────────┐
│   Server    │
│   Backend   │
└──────┬──────┘
       │ 3. Distribute
       ▼
┌─────────────┐
│   Client    │
│  Frontend   │
└─────────────┘
```

## Components

### 1. Server-Side (`server/update-manager.ts`)

**UpdateManager** class handles:
- Version tracking and comparison
- Manifest creation and validation
- Patch file management
- Client version statistics
- API endpoints for updates

**Key Methods:**
- `checkForUpdates(clientVersion)` - Check if updates available
- `createManifest(changelog, critical)` - Generate update manifest
- `createPatch(version, changelog)` - Package patch files
- `applyPatch(patchPath)` - Apply patch to server
- `trackClientVersion(userId, version, platform)` - Track client versions

### 2. Client-Side (`client/src/lib/update-client.ts`)

**UpdateClient** class handles:
- Automatic update checking
- Update downloading and caching
- Installation and reload management
- Progress notifications
- Changelog display

**Key Methods:**
- `checkForUpdates(silent)` - Check for available updates
- `installUpdate(updateInfo)` - Download and install update
- `startAutoCheck(interval)` - Enable automatic checking
- `onProgress(callback)` - Listen to update progress

### 3. Build Scripts

**create-patch.js** - Creates update patches:
```bash
node scripts/create-patch.js --type minor --changelog "Bug fixes"
```

**deploy-patch.js** - Deploys patches to server:
```bash
node scripts/deploy-patch.js
```

### 4. VS Code Tasks (`.vscode/tasks.json`)

Pre-configured tasks for easy patch management:
- **Build Client** - Build frontend
- **Create Patch - Minor** - Create minor version patch
- **Create Patch - Major** - Create major version patch
- **Create Patch - Hotfix** - Create critical patch
- **Deploy Patch to Server** - Deploy to running server
- **Full Update Cycle** - Complete build → patch → deploy
- **Check Update Status** - View current version
- **View Client Statistics** - See client version distribution

## Usage

### Creating and Deploying Updates

#### Method 1: VS Code Tasks (Recommended)

1. **Open Command Palette** (`Ctrl+Shift+P` or `Cmd+Shift+P`)
2. **Run Task** → Select task:
   - `Full Update Cycle` - Complete automated process
   - Or run individual tasks in sequence

#### Method 2: Command Line

```bash
# Step 1: Build client
npm run build:client

# Step 2: Create patch
node scripts/create-patch.js --type minor

# Step 3: Deploy to server
node scripts/deploy-patch.js
```

### Patch Types

**Major Update** (`1.0.0` → `2.0.0`)
- Breaking changes
- Major new features
- Significant UI overhaul

```bash
node scripts/create-patch.js --type major --changelog "Complete UI redesign"
```

**Minor Update** (`1.0.0` → `1.1.0`)
- New features
- Enhancements
- Non-breaking changes

```bash
node scripts/create-patch.js --type minor --changelog "Added new ship types"
```

**Patch Update** (`1.0.0` → `1.0.1`)
- Bug fixes
- Small improvements
- Security patches

```bash
node scripts/create-patch.js --type patch --changelog "Fixed login bug"
```

**Critical Update** (Any version, forced install)
- Security vulnerabilities
- Game-breaking bugs
- Emergency fixes

```bash
node scripts/create-patch.js --type patch --critical --changelog "Security fix"
```

## API Endpoints

### Check for Updates
```http
GET /api/updates/check?version=1.0.0&platform=web
```

**Response:**
```json
{
  "available": true,
  "version": "1.1.0",
  "manifest": {
    "version": "1.1.0",
    "releaseDate": "2026-06-15T20:00:00.000Z",
    "changelog": ["Bug fixes", "New features"],
    "files": [...],
    "checksum": "abc123...",
    "critical": false
  }
}
```

### Get Current Version
```http
GET /api/updates/version
```

**Response:**
```json
{
  "version": "1.0.0",
  "major": 1,
  "minor": 0,
  "patch": 0,
  "build": "2026-06-15T20:00:00.000Z"
}
```

### Download Update Manifest
```http
GET /api/updates/manifest
```

### Download Update File
```http
GET /api/updates/download/:version/:file
```

### Create Patch (Admin Only)
```http
POST /api/updates/create-patch
Content-Type: application/json

{
  "version": "1.1.0",
  "changelog": ["Bug fixes"],
  "critical": false
}
```

### Get Client Statistics (Admin Only)
```http
GET /api/updates/stats
```

**Response:**
```json
{
  "total": 150,
  "byVersion": {
    "1.0.0": 100,
    "1.1.0": 50
  },
  "byPlatform": {
    "web": 120,
    "desktop": 30
  }
}
```

## Client Integration

### React Component Example

```tsx
import { updateClient } from '@/lib/update-client';
import { useEffect, useState } from 'react';

export function UpdateNotification() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    // Check for updates
    updateClient.checkForUpdates().then(info => {
      setUpdateAvailable(info.available);
    });

    // Listen to progress
    const unsubscribe = updateClient.onProgress(setProgress);
    return unsubscribe;
  }, []);

  const handleUpdate = async () => {
    const info = await updateClient.checkForUpdates();
    if (info.available) {
      await updateClient.installUpdate(info);
      window.location.reload();
    }
  };

  if (!updateAvailable) return null;

  return (
    <div className="update-notification">
      <p>Update available!</p>
      <button onClick={handleUpdate}>Install Now</button>
      {progress && <p>{progress.message} ({progress.progress}%)</p>}
    </div>
  );
}
```

### Manual Update Check

```typescript
import { updateClient } from '@/lib/update-client';

// Check for updates
const updateInfo = await updateClient.checkForUpdates();

if (updateInfo.available) {
  console.log(`Update ${updateInfo.version} available`);
  console.log('Changelog:', updateInfo.manifest?.changelog);
  
  // Install update
  const success = await updateClient.installUpdate(updateInfo);
  
  if (success) {
    // Reload to apply update
    window.location.reload();
  }
}
```

### Automatic Updates

```typescript
import { updateClient } from '@/lib/update-client';

// Start automatic checking (every hour)
updateClient.startAutoCheck(3600000);

// Stop automatic checking
updateClient.stopAutoCheck();

// Check if reload needed
if (updateClient.needsReload()) {
  window.location.reload();
}
```

## File Structure

```
Universe-Empire-Dominion/
├── server/
│   └── update-manager.ts          # Server-side update manager
├── client/
│   └── src/
│       └── lib/
│           └── update-client.ts   # Client-side update handler
├── scripts/
│   ├── create-patch.js            # Patch creation script
│   └── deploy-patch.js            # Patch deployment script
├── .vscode/
│   └── tasks.json                 # VS Code tasks
├── updates/                       # Patch storage (gitignored)
│   └── 1.1.0/
│       ├── manifest.json
│       ├── PATCH_INFO.txt
│       └── [client files]
└── UPDATE_SYSTEM_GUIDE.md         # This file
```

## Workflow Example

### Complete Update Workflow

1. **Make Changes**
   - Modify client code
   - Fix bugs or add features
   - Test locally

2. **Create Patch**
   - Run: `Ctrl+Shift+P` → `Tasks: Run Task` → `Full Update Cycle`
   - Or manually:
     ```bash
     npm run build:client
     node scripts/create-patch.js --type minor
     ```
   - Enter changelog items when prompted

3. **Review Patch**
   - Check `updates/[version]/` directory
   - Review `manifest.json`
   - Verify `PATCH_INFO.txt`

4. **Deploy to Server**
   - Automatic with "Full Update Cycle" task
   - Or manually: `node scripts/deploy-patch.js`

5. **Clients Auto-Update**
   - Clients check for updates automatically
   - Non-critical: User prompted to update
   - Critical: Auto-installed immediately

6. **Monitor Deployment**
   - Check client statistics: `GET /api/updates/stats`
   - View server logs for update activity
   - Verify clients receiving updates

## Best Practices

### Version Numbering

Follow Semantic Versioning (SemVer):
- **Major** (X.0.0): Breaking changes
- **Minor** (0.X.0): New features, backwards compatible
- **Patch** (0.0.X): Bug fixes, backwards compatible

### Changelog Guidelines

- Be specific and clear
- Group related changes
- Use action verbs (Added, Fixed, Changed, Removed)
- Include issue/ticket numbers if applicable

Example:
```
- Added new ship customization system
- Fixed login timeout issue (#123)
- Improved performance of galaxy map
- Removed deprecated API endpoints
```

### Testing

Before deploying:
1. Test patch locally
2. Verify all files included
3. Check manifest checksum
4. Test on staging environment
5. Monitor first few client updates

### Critical Updates

Use sparingly for:
- Security vulnerabilities
- Game-breaking bugs
- Data corruption fixes

Critical updates:
- Install automatically
- Cannot be postponed
- Require immediate reload

### Rollback Strategy

If update causes issues:
1. Create rollback patch with previous version
2. Mark as critical for immediate deployment
3. Investigate and fix issue
4. Deploy proper fix as new update

## Troubleshooting

### Patch Creation Fails

**Problem**: Build errors during patch creation

**Solution**:
```bash
# Clean and rebuild
rm -rf client/dist
npm run build:client
```

### Deployment Fails

**Problem**: Server not responding

**Solution**:
- Verify server is running
- Check server logs
- Ensure correct host/port in environment

### Clients Not Updating

**Problem**: Clients stay on old version

**Solution**:
- Check client console for errors
- Verify update checking is enabled
- Clear browser cache
- Check network connectivity

### Version Mismatch

**Problem**: Local and server versions don't match

**Solution**:
```bash
# Check versions
curl http://localhost:3000/api/updates/version

# Sync local version
# Edit package.json to match server
```

## Security Considerations

- **Checksum Verification**: All patches verified with SHA-256
- **Admin-Only Deployment**: Only admins can create patches
- **HTTPS Required**: Use HTTPS in production
- **Rate Limiting**: Implement rate limits on update endpoints
- **Authentication**: Require auth for sensitive endpoints

## Performance

### Update Sizes

Typical patch sizes:
- **Minor Update**: 2-5 MB
- **Major Update**: 5-15 MB
- **Hotfix**: < 1 MB

### Bandwidth Optimization

- Files compressed with GZip
- Incremental updates (only changed files)
- CDN distribution recommended for production
- Cache-Control headers for static assets

### Client Impact

- Background downloading (non-blocking)
- Progress notifications
- Graceful degradation if update fails
- Automatic retry on network errors

## Production Deployment

### Environment Variables

```env
# Server
DEPLOY_HOST=your-server.com
DEPLOY_PORT=443
UPDATE_CHECK_INTERVAL=3600000

# Client
VITE_UPDATE_CHECK_ENABLED=true
VITE_UPDATE_AUTO_INSTALL_CRITICAL=true
```

### CDN Integration

For production, serve updates from CDN:

```typescript
// In update-client.ts
const CDN_URL = 'https://cdn.your-domain.com/updates';

async downloadFile(version: string, file: UpdateFile) {
  const url = `${CDN_URL}/${version}/${file.path}`;
  // ... download logic
}
```

### Monitoring

Track update metrics:
- Update check frequency
- Download success rate
- Installation success rate
- Client version distribution
- Average update time

## Support

For issues or questions:
- Check server logs: `tail -f logs/server.log`
- Review client console errors
- Check update statistics: `GET /api/updates/stats`
- Consult main documentation: `README.md`

---

**Version**: 1.0.0  
**Last Updated**: 2026-06-15  
**Maintainer**: Development Team