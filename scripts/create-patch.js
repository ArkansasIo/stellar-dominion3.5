#!/usr/bin/env node

// Patch Creation Script
// Creates update patches for distribution

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

// Parse command line arguments
const args = process.argv.slice(2);
const options = {
  type: 'minor', // major, minor, patch
  critical: false,
  changelog: []
};

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--type' && args[i + 1]) {
    options.type = args[i + 1];
    i++;
  } else if (args[i] === '--critical') {
    options.critical = true;
  } else if (args[i] === '--changelog' && args[i + 1]) {
    options.changelog.push(args[i + 1]);
    i++;
  }
}

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
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

// Read package.json
function readPackageJson() {
  const packagePath = path.join(__dirname, '..', 'package.json');
  return JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
}

// Write package.json
function writePackageJson(data) {
  const packagePath = path.join(__dirname, '..', 'package.json');
  fs.writeFileSync(packagePath, JSON.stringify(data, null, 2) + '\n');
}

// Increment version
function incrementVersion(currentVersion, type) {
  const [major, minor, patch] = currentVersion.split('.').map(Number);
  
  switch (type) {
    case 'major':
      return `${major + 1}.0.0`;
    case 'minor':
      return `${major}.${minor + 1}.0`;
    case 'patch':
      return `${major}.${minor}.${patch + 1}`;
    default:
      return currentVersion;
  }
}

// Prompt for changelog
async function promptChangelog() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const changelog = [];
  
  log('\nEnter changelog items (one per line, empty line to finish):', 'cyan');
  
  return new Promise((resolve) => {
    rl.on('line', (line) => {
      if (line.trim() === '') {
        rl.close();
        resolve(changelog);
      } else {
        changelog.push(line.trim());
        log(`  + ${line.trim()}`, 'green');
      }
    });
  });
}

// Main function
async function main() {
  console.log('');
  log('═══════════════════════════════════════════════', 'bright');
  log('  Universe Empire Dominion - Patch Creator', 'bright');
  log('═══════════════════════════════════════════════', 'bright');
  console.log('');

  try {
    // Read current version
    const packageJson = readPackageJson();
    const currentVersion = packageJson.version;
    const newVersion = incrementVersion(currentVersion, options.type);

    logInfo(`Current version: ${currentVersion}`);
    logInfo(`New version: ${newVersion}`);
    logInfo(`Update type: ${options.type}`);
    logInfo(`Critical: ${options.critical ? 'Yes' : 'No'}`);
    console.log('');

    // Get changelog if not provided
    if (options.changelog.length === 0) {
      options.changelog = await promptChangelog();
    }

    if (options.changelog.length === 0) {
      logError('No changelog provided. Aborting.');
      process.exit(1);
    }

    console.log('');
    log('Changelog:', 'cyan');
    options.changelog.forEach(item => log(`  • ${item}`, 'green'));
    console.log('');

    // Update package.json version
    logInfo('Updating package.json...');
    packageJson.version = newVersion;
    packageJson.build = new Date().toISOString();
    writePackageJson(packageJson);
    logSuccess('Package.json updated');

    // Build client
    logInfo('Building client...');
    try {
      execSync('npm run build:client', {
        cwd: path.join(__dirname, '..'),
        stdio: 'inherit'
      });
      logSuccess('Client built successfully');
    } catch (error) {
      logError('Client build failed');
      throw error;
    }

    // Create patch directory
    const patchDir = path.join(__dirname, '..', 'updates', newVersion);
    if (!fs.existsSync(patchDir)) {
      fs.mkdirSync(patchDir, { recursive: true });
    }
    logSuccess(`Created patch directory: ${patchDir}`);

    // Create manifest
    logInfo('Creating manifest...');
    const manifest = {
      version: newVersion,
      releaseDate: new Date().toISOString(),
      changelog: options.changelog,
      critical: options.critical,
      files: [],
      checksum: ''
    };

    // Scan client dist files
    const clientDist = path.join(__dirname, '..', 'client', 'dist');
    if (fs.existsSync(clientDist)) {
      const scanFiles = (dir, baseDir = '') => {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        
        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          const relativePath = path.join(baseDir, entry.name).replace(/\\/g, '/');
          
          if (entry.isDirectory()) {
            scanFiles(fullPath, relativePath);
          } else {
            const stats = fs.statSync(fullPath);
            const crypto = require('crypto');
            const hash = crypto.createHash('sha256')
              .update(fs.readFileSync(fullPath))
              .digest('hex');
            
            manifest.files.push({
              path: relativePath,
              hash,
              size: stats.size,
              type: 'modify'
            });

            // Copy file to patch directory
            const destPath = path.join(patchDir, relativePath);
            const destDir = path.dirname(destPath);
            if (!fs.existsSync(destDir)) {
              fs.mkdirSync(destDir, { recursive: true });
            }
            fs.copyFileSync(fullPath, destPath);
          }
        }
      };
      
      scanFiles(clientDist);
    }

    // Generate checksum
    const checksumData = manifest.files.map(f => `${f.path}:${f.hash}`).join('|');
    manifest.checksum = require('crypto')
      .createHash('sha256')
      .update(checksumData)
      .digest('hex');

    // Save manifest
    const manifestPath = path.join(patchDir, 'manifest.json');
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    logSuccess('Manifest created');

    // Create patch info file
    const patchInfo = `
Universe Empire Dominion - Patch ${newVersion}
${'='.repeat(50)}

Release Date: ${new Date().toLocaleDateString()}
Type: ${options.type.toUpperCase()}
Critical: ${options.critical ? 'YES' : 'NO'}

Changelog:
${options.changelog.map(item => `  • ${item}`).join('\n')}

Files: ${manifest.files.length}
Total Size: ${(manifest.files.reduce((sum, f) => sum + f.size, 0) / 1024 / 1024).toFixed(2)} MB
Checksum: ${manifest.checksum}
`;

    fs.writeFileSync(path.join(patchDir, 'PATCH_INFO.txt'), patchInfo);
    logSuccess('Patch info created');

    // Summary
    console.log('');
    log('═══════════════════════════════════════════════', 'bright');
    log('  Patch Created Successfully', 'bright');
    log('═══════════════════════════════════════════════', 'bright');
    console.log('');
    log(`Version: ${newVersion}`, 'cyan');
    log(`Files: ${manifest.files.length}`, 'cyan');
    log(`Size: ${(manifest.files.reduce((sum, f) => sum + f.size, 0) / 1024 / 1024).toFixed(2)} MB`, 'cyan');
    log(`Location: ${patchDir}`, 'cyan');
    console.log('');
    logInfo('Next steps:');
    console.log('  1. Review the patch files');
    console.log('  2. Test the patch locally');
    console.log('  3. Run "Deploy Patch to Server" task');
    console.log('  4. Commit changes to version control');
    console.log('');

  } catch (error) {
    console.error('');
    logError(`Patch creation failed: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
}

// Run
main();

// Made with Bob
