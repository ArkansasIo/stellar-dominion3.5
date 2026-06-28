#!/usr/bin/env node

// Patch Deployment Script
// Deploys patches to the running server

const fs = require('fs');
const path = require('path');
const http = require('http');

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

// Make HTTP request
function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      
      res.on('data', (chunk) => {
        body += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          resolve({ status: res.statusCode, data: response });
        } catch (error) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });
    
    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

// Check server status
async function checkServer(host, port) {
  try {
    const response = await makeRequest({
      hostname: host,
      port: port,
      path: '/api/updates/version',
      method: 'GET'
    });
    
    return response.status === 200 ? response.data : null;
  } catch (error) {
    return null;
  }
}

// Deploy patch
async function deployPatch(host, port, version, changelog, critical) {
  try {
    const response = await makeRequest({
      hostname: host,
      port: port,
      path: '/api/updates/create-patch',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }, {
      version,
      changelog,
      critical
    });
    
    return response;
  } catch (error) {
    throw new Error(`Deployment failed: ${error.message}`);
  }
}

// Main function
async function main() {
  console.log('');
  log('═══════════════════════════════════════════════', 'bright');
  log('  Universe Empire Dominion - Patch Deployer', 'bright');
  log('═══════════════════════════════════════════════', 'bright');
  console.log('');

  try {
    // Configuration
    const host = process.env.DEPLOY_HOST || 'localhost';
    const port = parseInt(process.env.DEPLOY_PORT || '3000');
    
    logInfo(`Target server: ${host}:${port}`);
    console.log('');

    // Check server
    logInfo('Checking server status...');
    const serverInfo = await checkServer(host, port);
    
    if (!serverInfo) {
      logError('Server is not responding');
      logWarning('Make sure the server is running');
      process.exit(1);
    }
    
    logSuccess(`Server is online (version: ${serverInfo.version})`);
    console.log('');

    // Read local version
    const packageJson = readPackageJson();
    const localVersion = packageJson.version;
    
    logInfo(`Local version: ${localVersion}`);
    logInfo(`Server version: ${serverInfo.version}`);
    console.log('');

    // Check if update is needed
    if (localVersion === serverInfo.version) {
      logWarning('Local and server versions match');
      logInfo('No deployment needed');
      process.exit(0);
    }

    // Read manifest
    const manifestPath = path.join(__dirname, '..', 'updates', localVersion, 'manifest.json');
    
    if (!fs.existsSync(manifestPath)) {
      logError(`Manifest not found: ${manifestPath}`);
      logWarning('Run "Create Patch" task first');
      process.exit(1);
    }

    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
    
    log('Patch Details:', 'cyan');
    log(`  Version: ${manifest.version}`, 'cyan');
    log(`  Files: ${manifest.files.length}`, 'cyan');
    log(`  Critical: ${manifest.critical ? 'Yes' : 'No'}`, 'cyan');
    log(`  Changelog:`, 'cyan');
    manifest.changelog.forEach(item => log(`    • ${item}`, 'green'));
    console.log('');

    // Deploy
    logInfo('Deploying patch to server...');
    
    const response = await deployPatch(
      host,
      port,
      manifest.version,
      manifest.changelog,
      manifest.critical
    );

    if (response.status === 200 && response.data.success) {
      logSuccess('Patch deployed successfully');
      console.log('');
      log('═══════════════════════════════════════════════', 'bright');
      log('  Deployment Complete', 'bright');
      log('═══════════════════════════════════════════════', 'bright');
      console.log('');
      logInfo('Clients will receive the update automatically');
      logInfo('Critical updates will be installed immediately');
      console.log('');
    } else {
      logError('Deployment failed');
      if (response.data.error) {
        logError(`Error: ${response.data.error}`);
      }
      process.exit(1);
    }

  } catch (error) {
    console.error('');
    logError(`Deployment failed: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
}

// Run
main();

// Made with Bob
