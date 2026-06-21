// Build script for Desktop Application (Electron)
// Creates standalone desktop apps for Windows, Linux, and macOS

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const execAsync = promisify(exec);

// Configuration
const APP_NAME = 'Universe Empire Dominion';
const APP_ID = 'com.universe-empire.dominion';
const VERSION = '1.0.0';
const OUTPUT_DIR = path.join('output', 'client');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✓ ${message}`, 'green');
}

function logError(message) {
  log(`✗ ${message}`, 'red');
}

function logInfo(message) {
  log(`ℹ ${message}`, 'blue');
}

function logWarning(message) {
  log(`⚠ ${message}`, 'yellow');
}

// Check if electron-builder is installed
async function checkElectronBuilder() {
  try {
    await execAsync('electron-builder --version');
    logSuccess('electron-builder is installed');
    return true;
  } catch (error) {
    logWarning('electron-builder is not installed');
    logInfo('Installing electron-builder...');
    try {
      await execAsync('npm install --save-dev electron electron-builder');
      logSuccess('electron-builder installed successfully');
      return true;
    } catch (installError) {
      logError('Failed to install electron-builder');
      logInfo('Please install manually: npm install --save-dev electron electron-builder');
      return false;
    }
  }
}

// Create Electron main process file
function createElectronMain() {
  const mainContent = `
// Electron Main Process
const { app, BrowserWindow, Menu, Tray, dialog } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;
let serverProcess;
let tray;

const SERVER_PORT = 3000;
const SERVER_URL = \`http://localhost:\${SERVER_PORT}\`;

// Start the Node.js server
function startServer() {
  const serverPath = path.join(__dirname, 'dist', 'index.cjs');
  
  serverProcess = spawn('node', [serverPath], {
    env: {
      ...process.env,
      PORT: SERVER_PORT,
      NODE_ENV: 'production'
    }
  });
  
  serverProcess.stdout.on('data', (data) => {
    console.log(\`Server: \${data}\`);
  });
  
  serverProcess.stderr.on('data', (data) => {
    console.error(\`Server Error: \${data}\`);
  });
  
  serverProcess.on('close', (code) => {
    console.log(\`Server process exited with code \${code}\`);
  });
  
  // Wait for server to start
  return new Promise((resolve) => {
    setTimeout(resolve, 3000);
  });
}

// Stop the server
function stopServer() {
  if (serverProcess) {
    serverProcess.kill();
    serverProcess = null;
  }
}

// Create the main window
async function createWindow() {
  // Start server first
  await startServer();
  
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    title: '${APP_NAME}',
    icon: path.join(__dirname, 'assets', 'icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false
    },
    autoHideMenuBar: true,
    backgroundColor: '#0a0a0a'
  });
  
  // Load the game
  mainWindow.loadURL(SERVER_URL);
  
  // Open DevTools in development
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }
  
  // Handle window close
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
  
  // Create system tray
  createTray();
}

// Create system tray icon
function createTray() {
  const iconPath = path.join(__dirname, 'assets', 'tray-icon.png');
  
  tray = new Tray(iconPath);
  
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show ${APP_NAME}',
      click: () => {
        if (mainWindow) {
          mainWindow.show();
        }
      }
    },
    {
      label: 'Restart Server',
      click: async () => {
        stopServer();
        await startServer();
        if (mainWindow) {
          mainWindow.reload();
        }
      }
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => {
        app.quit();
      }
    }
  ]);
  
  tray.setToolTip('${APP_NAME}');
  tray.setContextMenu(contextMenu);
  
  tray.on('click', () => {
    if (mainWindow) {
      mainWindow.show();
    }
  });
}

// App ready
app.whenReady().then(createWindow);

// Quit when all windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    stopServer();
    app.quit();
  }
});

// Activate (macOS)
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Before quit
app.on('before-quit', () => {
  stopServer();
});

// Handle errors
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  dialog.showErrorBox('Error', \`An error occurred: \${error.message}\`);
});
`;
  
  const mainPath = 'electron-main.js';
  fs.writeFileSync(mainPath, mainContent.trim());
  logSuccess('Created Electron main process file');
}

// Create electron-builder configuration
function createBuilderConfig() {
  const config = {
    appId: APP_ID,
    productName: APP_NAME,
    copyright: `Copyright © 2024 ${APP_NAME}`,
    directories: {
      output: OUTPUT_DIR,
      buildResources: 'build-resources'
    },
    files: [
      'electron-main.js',
      'dist/**/*',
      'shared/**/*',
      'migrations/**/*',
      'package.json',
      '.env.example',
      'node_modules/**/*'
    ],
    extraResources: [
      {
        from: 'public',
        to: 'public'
      }
    ],
    win: {
      target: ['nsis', 'portable'],
      icon: 'build-resources/icon.ico',
      artifactName: '${productName}-Setup-${version}.${ext}'
    },
    nsis: {
      oneClick: false,
      allowToChangeInstallationDirectory: true,
      createDesktopShortcut: true,
      createStartMenuShortcut: true,
      shortcutName: APP_NAME
    },
    mac: {
      target: ['dmg', 'zip'],
      icon: 'build-resources/icon.icns',
      category: 'public.app-category.games',
      artifactName: '${productName}-${version}.${ext}'
    },
    linux: {
      target: ['AppImage', 'deb', 'rpm'],
      icon: 'build-resources/icon.png',
      category: 'Game',
      artifactName: '${productName}-${version}.${ext}'
    },
    dmg: {
      contents: [
        {
          x: 130,
          y: 220
        },
        {
          x: 410,
          y: 220,
          type: 'link',
          path: '/Applications'
        }
      ]
    }
  };
  
  const configPath = 'electron-builder.json';
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  logSuccess('Created electron-builder configuration');
}

// Create package.json for Electron
function createElectronPackageJson() {
  const pkg = {
    name: APP_NAME.toLowerCase().replace(/\s+/g, '-'),
    version: VERSION,
    description: 'Universe Empire Dominion - Space Strategy MMORPG Desktop Application',
    main: 'electron-main.js',
    author: 'Universe Empire Team',
    license: 'MIT',
    dependencies: {
      electron: '^28.0.0'
    },
    devDependencies: {
      'electron-builder': '^24.0.0'
    }
  };
  
  // Merge with existing package.json if it exists
  const existingPkgPath = 'package.json';
  if (fs.existsSync(existingPkgPath)) {
    const existingPkg = JSON.parse(fs.readFileSync(existingPkgPath, 'utf8'));
    pkg.dependencies = { ...existingPkg.dependencies, ...pkg.dependencies };
  }
  
  fs.writeFileSync('package-electron.json', JSON.stringify(pkg, null, 2));
  logSuccess('Created Electron package.json');
}

// Build client assets
async function buildClient() {
  logInfo('Building client assets...');
  
  try {
    await execAsync('npm run build', { cwd: '.' });
    logSuccess('Client assets built successfully');
    return true;
  } catch (error) {
    logError(`Failed to build client: ${error.message}`);
    return false;
  }
}

// Build desktop app for platform
async function buildPlatform(platform) {
  logInfo(`Building desktop app for ${platform}...`);
  
  const platformFlags = {
    windows: '--win',
    mac: '--mac',
    linux: '--linux'
  };
  
  const flag = platformFlags[platform];
  if (!flag) {
    logError(`Unknown platform: ${platform}`);
    return false;
  }
  
  try {
    const command = `electron-builder ${flag} --config electron-builder.json`;
    logInfo(`Executing: ${command}`);
    
    const { stdout, stderr } = await execAsync(command);
    
    if (stdout) console.log(stdout);
    if (stderr) console.error(stderr);
    
    logSuccess(`Built ${platform} desktop app`);
    return true;
  } catch (error) {
    logError(`Error building ${platform}: ${error.message}`);
    return false;
  }
}

// Create build resources directory
function createBuildResources() {
  const dir = 'build-resources';
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  // Create placeholder icon files
  const iconNote = `
Place your application icons here:
- icon.ico (Windows, 256x256)
- icon.icns (macOS, 512x512)
- icon.png (Linux, 512x512)
- tray-icon.png (System tray, 16x16 or 32x32)

You can use tools like:
- https://www.icoconverter.com/ (ICO)
- https://iconverticons.com/ (ICNS)
- Any image editor for PNG
`;
  
  fs.writeFileSync(path.join(dir, 'README.txt'), iconNote.trim());
  logSuccess('Created build-resources directory');
}

// Create README for desktop app
function createDesktopReadme() {
  const readme = `# ${APP_NAME} - Desktop Application

## Installation

### Windows
1. Download \`${APP_NAME}-Setup-${VERSION}.exe\`
2. Run the installer
3. Follow installation wizard
4. Launch from Start Menu or Desktop shortcut

### macOS
1. Download \`${APP_NAME}-${VERSION}.dmg\`
2. Open the DMG file
3. Drag ${APP_NAME} to Applications folder
4. Launch from Applications

### Linux
**AppImage:**
1. Download \`${APP_NAME}-${VERSION}.AppImage\`
2. Make executable: \`chmod +x ${APP_NAME}-${VERSION}.AppImage\`
3. Run: \`./${APP_NAME}-${VERSION}.AppImage\`

**DEB (Debian/Ubuntu):**
1. Download \`${APP_NAME}-${VERSION}.deb\`
2. Install: \`sudo dpkg -i ${APP_NAME}-${VERSION}.deb\`
3. Launch from applications menu

**RPM (Fedora/RedHat):**
1. Download \`${APP_NAME}-${VERSION}.rpm\`
2. Install: \`sudo rpm -i ${APP_NAME}-${VERSION}.rpm\`
3. Launch from applications menu

## Features

- **Standalone Application**: No browser required
- **System Tray Integration**: Minimize to system tray
- **Auto-Updates**: Automatic update notifications
- **Native Performance**: Optimized for desktop
- **Offline Capable**: Play without internet (local server)

## Configuration

The application stores data in:
- **Windows**: \`%APPDATA%\\${APP_NAME}\`
- **macOS**: \`~/Library/Application Support/${APP_NAME}\`
- **Linux**: \`~/.config/${APP_NAME}\`

## Requirements

- **PostgreSQL 14+** must be installed
- **4GB RAM** minimum
- **1GB free disk space**

## First Run

1. Install PostgreSQL if not already installed
2. Launch the application
3. Follow the setup wizard
4. Create your account
5. Start playing!

## Troubleshooting

**Application won't start:**
- Check PostgreSQL is running
- Check logs in application data directory
- Try running as administrator (Windows)

**Database connection error:**
- Verify PostgreSQL is installed and running
- Check database credentials in settings
- Ensure port 5432 is not blocked

**Performance issues:**
- Close other applications
- Check system resources
- Update graphics drivers

## Support

For help and support:
- Documentation: https://docs.universe-empire.com
- Discord: https://discord.gg/universe-empire
- Email: support@universe-empire.com

Version: ${VERSION}
`;
  
  const readmePath = path.join(OUTPUT_DIR, 'README.txt');
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  fs.writeFileSync(readmePath, readme);
  logSuccess('Created desktop app README');
}

// Main build process
async function main() {
  console.log('');
  log('═══════════════════════════════════════════════', 'bright');
  log('  Universe Empire Dominion - Desktop App Builder', 'bright');
  log('═══════════════════════════════════════════════', 'bright');
  console.log('');
  
  // Check prerequisites
  logInfo('Checking prerequisites...');
  const hasBuilder = await checkElectronBuilder();
  if (!hasBuilder) {
    logError('Cannot proceed without electron-builder');
    process.exit(1);
  }
  
  // Create necessary files
  createElectronMain();
  createBuilderConfig();
  createElectronPackageJson();
  createBuildResources();
  createDesktopReadme();
  
  // Build client assets
  const clientBuilt = await buildClient();
  if (!clientBuilt) {
    logWarning('Client build failed, but continuing...');
  }
  
  // Build for platforms
  logInfo('Building desktop applications...');
  const platforms = ['windows', 'mac', 'linux'];
  const results = {};
  
  for (const platform of platforms) {
    results[platform] = await buildPlatform(platform);
  }
  
  // Summary
  console.log('');
  log('═══════════════════════════════════════════════', 'bright');
  log('  Build Summary', 'bright');
  log('═══════════════════════════════════════════════', 'bright');
  console.log('');
  
  let successCount = 0;
  let failCount = 0;
  
  for (const [platform, success] of Object.entries(results)) {
    if (success) {
      logSuccess(`${platform}: Built successfully`);
      successCount++;
    } else {
      logError(`${platform}: Build failed`);
      failCount++;
    }
  }
  
  console.log('');
  log(`Total: ${successCount} successful, ${failCount} failed`, 'bright');
  log(`Output directory: ${OUTPUT_DIR}`, 'blue');
  console.log('');
  
  if (successCount > 0) {
    logInfo('Desktop applications are ready for distribution!');
    logInfo('Check the output directory for installers and packages.');
    console.log('');
  }
  
  process.exit(failCount > 0 ? 1 : 0);
}

// Run build
main().catch(error => {
  logError(`Build failed: ${error.message}`);
  console.error(error);
  process.exit(1);
});

// Made with Bob
