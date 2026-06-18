# Building Standalone Executables

This guide explains how to build standalone executable files for Universe Empire Dominion that can run on Windows, Linux, macOS, and Raspberry Pi without requiring Node.js installation.

## Overview

The build system uses [pkg](https://github.com/vercel/pkg) to package the Node.js application and all dependencies into single executable files.

## Prerequisites

- Node.js 18.x or higher
- npm 8.x or higher
- 10GB free disk space (for building all platforms)
- Internet connection (for downloading Node.js binaries)

## Quick Build

### Build All Platforms

```bash
npm run build:exe
```

This will create executables for:
- Windows (x64)
- Linux (x64)
- macOS (x64)
- Raspberry Pi (ARM64)

### Build Specific Platform

```bash
# Windows only
npm run build:exe:windows

# Linux only
npm run build:exe:linux

# macOS only
npm run build:exe:macos

# Raspberry Pi only
npm run build:exe:pi
```

## Output

All executables are created in the `dist-exe/` directory:

```
dist-exe/
├── UniverseEmpireDominion-windows.exe    (Windows executable)
├── UniverseEmpireDominion-linux          (Linux executable)
├── UniverseEmpireDominion-macos          (macOS executable)
├── UniverseEmpireDominion-raspberry-pi   (Raspberry Pi executable)
├── start-windows.bat                     (Windows launcher)
├── start-server.sh                       (Unix launcher)
├── README.txt                            (User instructions)
└── package-info.json                     (Build information)
```

## File Sizes

Typical executable sizes:
- Windows: ~50-70 MB
- Linux: ~50-70 MB
- macOS: ~50-70 MB
- Raspberry Pi: ~50-70 MB

## What's Included

Each executable contains:
- Node.js runtime (v18)
- All server code
- All dependencies
- Client files (HTML, CSS, JS)
- Database migrations
- Configuration templates

## What's NOT Included

Users must install separately:
- PostgreSQL database
- Database must be created and configured
- `.env.local` configuration file

## Distribution

### Creating Installation Packages

#### Windows Installer (NSIS)

1. Install NSIS: https://nsis.sourceforge.io/
2. Create installer script:

```nsis
; Universe Empire Dominion Installer
!define APP_NAME "Universe Empire Dominion"
!define APP_VERSION "1.0.0"
!define APP_PUBLISHER "Your Company"
!define APP_EXE "UniverseEmpireDominion-windows.exe"

Name "${APP_NAME}"
OutFile "UniverseEmpireDominion-Setup.exe"
InstallDir "$PROGRAMFILES64\${APP_NAME}"

Section "Install"
    SetOutPath "$INSTDIR"
    File "dist-exe\${APP_EXE}"
    File "dist-exe\start-windows.bat"
    File "dist-exe\README.txt"
    
    CreateDirectory "$SMPROGRAMS\${APP_NAME}"
    CreateShortcut "$SMPROGRAMS\${APP_NAME}\${APP_NAME}.lnk" "$INSTDIR\${APP_EXE}"
    CreateShortcut "$DESKTOP\${APP_NAME}.lnk" "$INSTDIR\${APP_EXE}"
    
    WriteUninstaller "$INSTDIR\Uninstall.exe"
SectionEnd

Section "Uninstall"
    Delete "$INSTDIR\${APP_EXE}"
    Delete "$INSTDIR\start-windows.bat"
    Delete "$INSTDIR\README.txt"
    Delete "$INSTDIR\Uninstall.exe"
    RMDir "$INSTDIR"
    
    Delete "$SMPROGRAMS\${APP_NAME}\${APP_NAME}.lnk"
    Delete "$DESKTOP\${APP_NAME}.lnk"
    RMDir "$SMPROGRAMS\${APP_NAME}"
SectionEnd
```

3. Compile: `makensis installer.nsi`

#### Linux Package (DEB)

```bash
# Create package structure
mkdir -p universe-empire-dominion_1.0.0/DEBIAN
mkdir -p universe-empire-dominion_1.0.0/usr/local/bin
mkdir -p universe-empire-dominion_1.0.0/usr/share/applications

# Copy executable
cp dist-exe/UniverseEmpireDominion-linux universe-empire-dominion_1.0.0/usr/local/bin/

# Create control file
cat > universe-empire-dominion_1.0.0/DEBIAN/control << EOF
Package: universe-empire-dominion
Version: 1.0.0
Section: games
Priority: optional
Architecture: amd64
Depends: postgresql (>= 14)
Maintainer: Your Name <your@email.com>
Description: Universe Empire Dominion - Space Strategy MMORPG
 A comprehensive space strategy MMORPG game server.
EOF

# Build package
dpkg-deb --build universe-empire-dominion_1.0.0
```

#### macOS App Bundle

```bash
# Create app structure
mkdir -p UniverseEmpireDominion.app/Contents/MacOS
mkdir -p UniverseEmpireDominion.app/Contents/Resources

# Copy executable
cp dist-exe/UniverseEmpireDominion-macos UniverseEmpireDominion.app/Contents/MacOS/

# Create Info.plist
cat > UniverseEmpireDominion.app/Contents/Info.plist << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleExecutable</key>
    <string>UniverseEmpireDominion-macos</string>
    <key>CFBundleIdentifier</key>
    <string>com.universe-empire.dominion</string>
    <key>CFBundleName</key>
    <string>Universe Empire Dominion</string>
    <key>CFBundleVersion</key>
    <string>1.0.0</string>
</dict>
</plist>
EOF

# Create DMG
hdiutil create -volname "Universe Empire Dominion" -srcfolder UniverseEmpireDominion.app -ov -format UDZO UniverseEmpireDominion.dmg
```

## Testing Executables

### Windows

```powershell
# Test executable
.\dist-exe\UniverseEmpireDominion-windows.exe

# Or use launcher
.\dist-exe\start-windows.bat
```

### Linux

```bash
# Make executable
chmod +x dist-exe/UniverseEmpireDominion-linux

# Test
./dist-exe/UniverseEmpireDominion-linux

# Or use launcher
chmod +x dist-exe/start-server.sh
./dist-exe/start-server.sh
```

### macOS

```bash
# Make executable
chmod +x dist-exe/UniverseEmpireDominion-macos

# Test
./dist-exe/UniverseEmpireDominion-macos

# Or use launcher
chmod +x dist-exe/start-server.sh
./dist-exe/start-server.sh
```

### Raspberry Pi

```bash
# Make executable
chmod +x dist-exe/UniverseEmpireDominion-raspberry-pi

# Test
./dist-exe/UniverseEmpireDominion-raspberry-pi
```

## Configuration

Users need to create `.env.local` file in the same directory as the executable:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/universe_empire
PORT=3000
NODE_ENV=production
SESSION_SECRET=your-secret-key-here
```

## Troubleshooting

### Build Fails

**Error**: `pkg: command not found`

**Solution**:
```bash
npm install -g pkg
```

**Error**: `Cannot find module`

**Solution**: Ensure all dependencies are in `package.json` and run `npm install` before building.

### Executable Won't Run

**Windows**: "Windows protected your PC"
- Click "More info" → "Run anyway"
- Or sign the executable with a code signing certificate

**Linux/macOS**: "Permission denied"
```bash
chmod +x UniverseEmpireDominion-*
```

**macOS**: "App is damaged and can't be opened"
```bash
xattr -cr UniverseEmpireDominion.app
```

### Database Connection Fails

Ensure:
1. PostgreSQL is installed and running
2. Database exists: `createdb universe_empire`
3. `.env.local` has correct credentials
4. Port 5432 is accessible

### Port Already in Use

Change port in `.env.local`:
```env
PORT=8080
```

## Advanced Configuration

### Custom Build Options

Edit `build-exe.js` to customize:

```javascript
// Change output directory
const OUTPUT_DIR = 'my-custom-output';

// Add more targets
const TARGETS = {
  'windows-32bit': 'node18-win-x86',
  'linux-alpine': 'node18-alpine-x64'
};

// Include additional assets
pkg: {
  assets: [
    'custom-files/**/*'
  ]
}
```

### Compression

Executables are compressed with GZip by default. To disable:

```javascript
const command = `pkg ... --compress None`;
```

### Node.js Version

To use a different Node.js version:

```javascript
const TARGETS = {
  windows: 'node20-win-x64',  // Node.js 20
  linux: 'node20-linux-x64'
};
```

## CI/CD Integration

### GitHub Actions

```yaml
name: Build Executables

on:
  push:
    tags:
      - 'v*'

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Build executables
        run: npm run build:exe
      
      - name: Upload artifacts
        uses: actions/upload-artifact@v2
        with:
          name: executables
          path: dist-exe/
```

### GitLab CI

```yaml
build-executables:
  stage: build
  image: node:18
  script:
    - npm install
    - npm run build:exe
  artifacts:
    paths:
      - dist-exe/
  only:
    - tags
```

## Security Considerations

1. **Code Signing**: Sign executables for Windows and macOS
2. **Checksums**: Generate SHA256 checksums for verification
3. **Virus Scanning**: Scan executables before distribution
4. **HTTPS**: Use HTTPS for downloads
5. **Updates**: Implement auto-update mechanism

## Generating Checksums

```bash
# Windows (PowerShell)
Get-FileHash dist-exe\UniverseEmpireDominion-windows.exe -Algorithm SHA256

# Linux/macOS
sha256sum dist-exe/UniverseEmpireDominion-*
```

## Distribution Checklist

- [ ] Build all platform executables
- [ ] Test each executable on target platform
- [ ] Generate checksums
- [ ] Create installation packages
- [ ] Write release notes
- [ ] Update documentation
- [ ] Sign executables (Windows/macOS)
- [ ] Scan for viruses
- [ ] Upload to distribution server
- [ ] Announce release

## Support

For build issues:
- Check build logs in console
- Verify Node.js and npm versions
- Ensure all dependencies are installed
- Check disk space (10GB+ required)

For runtime issues:
- Check executable has execute permissions
- Verify PostgreSQL is installed
- Check `.env.local` configuration
- Review application logs

## Resources

- pkg documentation: https://github.com/vercel/pkg
- Node.js downloads: https://nodejs.org
- PostgreSQL downloads: https://www.postgresql.org

---

**Last Updated**: 2024
**Version**: 1.0.0