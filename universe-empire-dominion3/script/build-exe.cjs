// Build script to create standalone executables
// Uses pkg to package Node.js application into executables

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const execAsync = promisify(exec);

// Configuration
const APP_NAME = 'UniverseEmpireDominion';
const VERSION = '1.0.0';
const OUTPUT_DIR = path.join('output', 'server');

// Build targets
const TARGETS = {
  windows: 'node18-win-x64',
  linux: 'node18-linux-x64',
  macos: 'node18-macos-x64',
  'raspberry-pi': 'node18-linux-arm64'
};

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

// Check if pkg is installed
async function checkPkg() {
  try {
    await execAsync('pkg --version');
    logSuccess('pkg is installed');
    return true;
  } catch (error) {
    logWarning('pkg is not installed');
    logInfo('Installing pkg...');
    try {
      await execAsync('npm install -g pkg');
      logSuccess('pkg installed successfully');
      return true;
    } catch (installError) {
      logError('Failed to install pkg');
      logInfo('Please install manually: npm install -g pkg');
      return false;
    }
  }
}

// Create output directory
function createOutputDir() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    logSuccess(`Created output directory: ${OUTPUT_DIR}`);
  }
}

// Build for specific platform
async function buildPlatform(platform, target) {
  logInfo(`Building for ${platform}...`);
  
  const outputName = platform === 'windows' 
    ? `${APP_NAME}-${platform}.exe`
    : `${APP_NAME}-${platform}`;
  
  const outputPath = path.join(OUTPUT_DIR, outputName);
  
  try {
    const command = `pkg dist/index.cjs --target ${target} --output ${outputPath} --compress GZip`;
    
    logInfo(`Executing: ${command}`);
    const { stdout, stderr } = await execAsync(command);
    
    if (stdout) console.log(stdout);
    if (stderr) console.error(stderr);
    
    // Check if file was created
    if (fs.existsSync(outputPath)) {
      const stats = fs.statSync(outputPath);
      const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
      logSuccess(`Built ${platform} executable (${sizeMB} MB)`);
      return true;
    } else {
      logError(`Failed to create ${platform} executable`);
      return false;
    }
  } catch (error) {
    logError(`Error building ${platform}: ${error.message}`);
    return false;
  }
}

// Create package.json for pkg
function createPkgConfig() {
  const pkgConfig = {
    name: APP_NAME.toLowerCase(),
    version: VERSION,
    main: 'dist/index.cjs',
    bin: 'dist/index.cjs',
    pkg: {
      assets: [
        'dist/**/*',
        'shared/**/*',
        'migrations/**/*',
        '.env.example',
        'package.json'
      ],
      scripts: [
        'dist/**/*.cjs'
      ],
      targets: Object.values(TARGETS),
      outputPath: OUTPUT_DIR
    }
  };
  
  const configPath = 'pkg-config.json';
  fs.writeFileSync(configPath, JSON.stringify(pkgConfig, null, 2));
  logSuccess(`Created pkg configuration: ${configPath}`);
}

// Create README for executables
function createReadme() {
  const readme = `# Universe Empire Dominion - Standalone Executables

## Installation

### Windows
1. Extract \`${APP_NAME}-windows.exe\`
2. Double-click to run
3. Server will start on http://localhost:3000

### Linux
1. Extract \`${APP_NAME}-linux\`
2. Make executable: \`chmod +x ${APP_NAME}-linux\`
3. Run: \`./${APP_NAME}-linux\`
4. Server will start on http://localhost:3000

### macOS
1. Extract \`${APP_NAME}-macos\`
2. Make executable: \`chmod +x ${APP_NAME}-macos\`
3. Run: \`./${APP_NAME}-macos\`
4. Server will start on http://localhost:3000

### Raspberry Pi
1. Extract \`${APP_NAME}-raspberry-pi\`
2. Make executable: \`chmod +x ${APP_NAME}-raspberry-pi\`
3. Run: \`./${APP_NAME}-raspberry-pi\`
4. Server will start on http://localhost:3000

## Configuration

Create a \`.env.local\` file in the same directory as the executable:

\`\`\`env
DATABASE_URL=postgresql://user:password@localhost:5432/universe_empire
PORT=3000
NODE_ENV=production
SESSION_SECRET=your-secret-key
\`\`\`

## Requirements

- PostgreSQL 14+ must be installed and running
- Database must be created before first run
- Port 3000 must be available (or change PORT in .env.local)

## First Run

1. Install PostgreSQL
2. Create database: \`createdb universe_empire\`
3. Create .env.local with database credentials
4. Run the executable
5. Open browser: http://localhost:3000

## Support

For issues and documentation, visit:
https://github.com/yourusername/Universe-Empire-Dominion

Version: ${VERSION}
`;
  
  const readmePath = path.join(OUTPUT_DIR, 'README.txt');
  fs.writeFileSync(readmePath, readme);
  logSuccess('Created README.txt');
}

// Create launcher scripts
function createLaunchers() {
  // Windows launcher
  const windowsLauncher = `@echo off
echo Starting Universe Empire Dominion Server...
echo.
echo Server will be available at: http://localhost:3000
echo Press Ctrl+C to stop the server
echo.
${APP_NAME}-windows.exe
pause
`;
  
  fs.writeFileSync(path.join(OUTPUT_DIR, 'start-windows.bat'), windowsLauncher);
  
  // Linux/macOS launcher
  const unixLauncher = `#!/bin/bash
echo "Starting Universe Empire Dominion Server..."
echo ""
echo "Server will be available at: http://localhost:3000"
echo "Press Ctrl+C to stop the server"
echo ""

# Detect platform
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    if grep -q "Raspberry Pi" /proc/cpuinfo 2>/dev/null; then
        ./${APP_NAME}-raspberry-pi
    else
        ./${APP_NAME}-linux
    fi
elif [[ "$OSTYPE" == "darwin"* ]]; then
    ./${APP_NAME}-macos
else
    echo "Unsupported platform: $OSTYPE"
    exit 1
fi
`;
  
  const launcherPath = path.join(OUTPUT_DIR, 'start-server.sh');
  fs.writeFileSync(launcherPath, unixLauncher);
  
  // Make launcher executable on Unix systems
  if (process.platform !== 'win32') {
    fs.chmodSync(launcherPath, '755');
  }
  
  logSuccess('Created launcher scripts');
}

// Create installation package info
function createPackageInfo() {
  const info = {
    name: APP_NAME,
    version: VERSION,
    description: 'Universe Empire Dominion - Space Strategy MMORPG',
    platforms: Object.keys(TARGETS),
    buildDate: new Date().toISOString(),
    requirements: {
      postgresql: '14.x or higher',
      port: 3000,
      memory: '2GB minimum, 4GB recommended',
      storage: '5GB free space'
    },
    files: []
  };
  
  // List all files in output directory
  if (fs.existsSync(OUTPUT_DIR)) {
    const files = fs.readdirSync(OUTPUT_DIR);
    files.forEach(file => {
      const filePath = path.join(OUTPUT_DIR, file);
      const stats = fs.statSync(filePath);
      info.files.push({
        name: file,
        size: stats.size,
        sizeMB: (stats.size / (1024 * 1024)).toFixed(2)
      });
    });
  }
  
  const infoPath = path.join(OUTPUT_DIR, 'package-info.json');
  fs.writeFileSync(infoPath, JSON.stringify(info, null, 2));
  logSuccess('Created package-info.json');
}

// Main build process
async function main() {
  console.log('');
  log('═══════════════════════════════════════════════', 'bright');
  log('  Universe Empire Dominion - Executable Builder', 'bright');
  log('═══════════════════════════════════════════════', 'bright');
  console.log('');
  
  // Check prerequisites
  logInfo('Checking prerequisites...');
  const hasPkg = await checkPkg();
  if (!hasPkg) {
    logError('Cannot proceed without pkg');
    process.exit(1);
  }
  
  // Create output directory
  createOutputDir();
  
  // Create pkg configuration
  createPkgConfig();
  
  // Build for each platform
  logInfo('Building executables...');
  const results = {};
  
  for (const [platform, target] of Object.entries(TARGETS)) {
    results[platform] = await buildPlatform(platform, target);
  }
  
  // Create additional files
  createReadme();
  createLaunchers();
  createPackageInfo();
  
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
  log(`Output directory: ${path.resolve(OUTPUT_DIR)}`, 'blue');
  console.log('');
  
  if (successCount > 0) {
    logInfo('Next steps:');
    console.log('  1. Test executables on target platforms');
    console.log('  2. Create installation packages');
    console.log('  3. Distribute to users');
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
