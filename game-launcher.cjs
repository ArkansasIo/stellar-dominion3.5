#!/usr/bin/env node

// Universe Empire Dominion - Full Game Launcher
// Manages both server and client processes

const { spawn, exec } = require('child_process');
const path = require('path');
const http = require('http');
const fs = require('fs');

// Configuration
const SERVER_PORT = 3000;
const SERVER_URL = `http://localhost:${SERVER_PORT}`;
const CHECK_INTERVAL = 5000; // 5 seconds
const DB_CHECK_ENABLED = false; // Disable strict DB checking for now

// Colors
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

// State
let serverProcess = null;
let serverRunning = false;
let clientOpened = false;
let statusCheckInterval = null;
let hasDbError = false;
let hasBuildError = false;

// Utility functions
function log(message, color = 'reset') {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`${colors.dim}[${timestamp}]${colors.reset} ${colors[color]}${message}${colors.reset}`);
}

function logHeader(message) {
  console.log('');
  console.log(`${colors.bright}${colors.cyan}${'═'.repeat(70)}${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}  ${message}${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}${'═'.repeat(70)}${colors.reset}`);
  console.log('');
}

function logSection(message) {
  console.log('');
  console.log(`${colors.bright}${colors.blue}▶ ${message}${colors.reset}`);
  console.log(`${colors.dim}${'─'.repeat(70)}${colors.reset}`);
}

function logSuccess(message) {
  log(`✓ ${message}`, 'green');
}

function logError(message) {
  log(`✗ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠ ${message}`, 'yellow');
}

function logInfo(message) {
  log(`ℹ ${message}`, 'blue');
}

// Check if server is responding
function checkServer() {
  return new Promise((resolve) => {
    const req = http.get(SERVER_URL, (res) => {
      resolve(res.statusCode === 200 || res.statusCode === 302 || res.statusCode === 404);
    });
    
    req.on('error', () => {
      resolve(false);
    });
    
    req.setTimeout(2000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

// Check if PostgreSQL is running
function checkPostgreSQL() {
  return new Promise((resolve) => {
    exec('pg_isready', (error, stdout) => {
      if (error) {
        resolve(false);
      } else {
        resolve(stdout.includes('accepting connections'));
      }
    });
  });
}

// Start server process
function startServer() {
  return new Promise((resolve, reject) => {
    logSection('Starting Server Backend');
    
    const serverExe = path.join(__dirname, 'output', 'server', 'UniverseEmpireDominion-windows.exe');
    
    if (!fs.existsSync(serverExe)) {
      logError(`Server executable not found: ${serverExe}`);
      reject(new Error('Server executable not found'));
      return;
    }
    
    logInfo('Launching server process...');
    
    serverProcess = spawn(serverExe, [], {
      cwd: path.join(__dirname, 'output', 'server'),
      stdio: ['ignore', 'pipe', 'pipe']
    });
    
    serverProcess.stdout.on('data', (data) => {
      const output = data.toString().trim();
      if (output) {
        // Check for specific errors
        if (output.includes('database') && output.includes('does not exist')) {
          hasDbError = true;
        }
        if (output.includes('Could not find') && output.includes('build directory')) {
          hasBuildError = true;
        }
        
        // Filter out verbose logs
        if (!output.includes('ExperimentalWarning') && 
            !output.includes('injecting env') &&
            !output.includes('tip:')) {
          log(`[SERVER] ${output}`, 'cyan');
        }
      }
    });
    
    serverProcess.stderr.on('data', (data) => {
      const output = data.toString().trim();
      if (output && !output.includes('ExperimentalWarning')) {
        // Check for errors
        if (output.includes('database') && output.includes('does not exist')) {
          hasDbError = true;
        }
        if (output.includes('Could not find') && output.includes('build directory')) {
          hasBuildError = true;
        }
        log(`[SERVER] ${output}`, 'yellow');
      }
    });
    
    serverProcess.on('error', (error) => {
      logError(`Server process error: ${error.message}`);
      serverRunning = false;
    });
    
    serverProcess.on('exit', (code) => {
      if (code !== 0 && code !== null) {
        logError(`Server exited with code ${code}`);
        
        // Provide helpful error messages
        if (hasDbError) {
          console.log('');
          logWarning('Database Error Detected!');
          logInfo('The database "universe_empire" does not exist.');
          logInfo('To fix this:');
          logInfo('  1. Make sure PostgreSQL is installed and running');
          logInfo('  2. Run: createdb universe_empire');
          logInfo('  3. Or run: npm run db:setup');
          console.log('');
        }
        
        if (hasBuildError) {
          console.log('');
          logWarning('Build Directory Error Detected!');
          logInfo('The client build files are missing.');
          logInfo('To fix this:');
          logInfo('  1. Run: npm run build');
          logInfo('  2. Or run: npm run build:complete');
          console.log('');
        }
      } else {
        logInfo('Server process stopped');
      }
      serverRunning = false;
    });
    
    // Wait for server to start
    logInfo('Waiting for server to be ready...');
    let attempts = 0;
    const maxAttempts = 30;
    
    const checkInterval = setInterval(async () => {
      attempts++;
      const isRunning = await checkServer();
      
      if (isRunning) {
        clearInterval(checkInterval);
        serverRunning = true;
        logSuccess(`Server is running on ${SERVER_URL}`);
        
        // Show warnings if there were errors but server still started
        if (hasDbError) {
          console.log('');
          logWarning('Server started with database errors');
          logInfo('Some features may not work correctly');
          console.log('');
        }
        
        resolve();
      } else if (attempts >= maxAttempts) {
        clearInterval(checkInterval);
        logError('Server failed to start within timeout');
        reject(new Error('Server startup timeout'));
      } else {
        process.stdout.write('.');
      }
    }, 1000);
  });
}

// Open browser
function openBrowser(url) {
  logSection('Opening Game Client');
  
  const platform = process.platform;
  let command;
  
  if (platform === 'win32') {
    command = `start ${url}`;
  } else if (platform === 'darwin') {
    command = `open ${url}`;
  } else {
    command = `xdg-open ${url}`;
  }
  
  exec(command, (error) => {
    if (error) {
      logError(`Failed to open browser: ${error.message}`);
      logInfo(`Please open manually: ${url}`);
    } else {
      logSuccess('Game opened in browser');
      clientOpened = true;
    }
  });
}

// Monitor status
function startStatusMonitor() {
  logSection('Status Monitor Active');
  logInfo('Monitoring server health every 5 seconds...');
  logInfo('Press Ctrl+C to stop the game');
  console.log('');
  
  statusCheckInterval = setInterval(async () => {
    const isRunning = await checkServer();
    
    if (isRunning && !serverRunning) {
      serverRunning = true;
      logSuccess('Server connection restored');
    } else if (!isRunning && serverRunning) {
      serverRunning = false;
      logWarning('Server connection lost!');
    }
    
    // Status line
    const status = serverRunning ? 
      `${colors.green}● ONLINE${colors.reset}` : 
      `${colors.red}● OFFLINE${colors.reset}`;
    
    const timestamp = new Date().toLocaleTimeString();
    process.stdout.write(`\r${colors.dim}[${timestamp}]${colors.reset} Server: ${status} | Client: ${clientOpened ? colors.green + '● OPEN' : colors.yellow + '● WAITING'}${colors.reset}   `);
  }, CHECK_INTERVAL);
}

// Cleanup
function cleanup() {
  console.log('');
  logSection('Shutting Down');
  
  if (statusCheckInterval) {
    clearInterval(statusCheckInterval);
  }
  
  if (serverProcess) {
    logInfo('Stopping server...');
    serverProcess.kill();
    serverProcess = null;
  }
  
  logSuccess('Cleanup complete');
  console.log('');
  logInfo('Thank you for playing Universe Empire Dominion!');
  console.log('');
  
  process.exit(0);
}

// Handle signals
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
process.on('exit', cleanup);

// Main function
async function main() {
  try {
    // Header
    logHeader('UNIVERSE EMPIRE DOMINION - GAME LAUNCHER');
    
    logInfo('Version: 1.0.0');
    logInfo('Platform: Windows x64');
    console.log('');
    
    // Check prerequisites
    logSection('Checking Prerequisites');
    
    const serverExe = path.join(__dirname, 'output', 'server', 'UniverseEmpireDominion-windows.exe');
    const envFile = path.join(__dirname, 'output', 'server', '.env.local');
    
    if (!fs.existsSync(serverExe)) {
      logError('Server executable not found!');
      logInfo('Please run the build script first: npm run build:exe');
      process.exit(1);
    }
    logSuccess('Server executable found');
    
    if (!fs.existsSync(envFile)) {
      logWarning('Configuration file not found');
      logInfo('Using default configuration');
    } else {
      logSuccess('Configuration file found');
    }
    
    // Check PostgreSQL (optional)
    if (DB_CHECK_ENABLED) {
      const pgRunning = await checkPostgreSQL();
      if (!pgRunning) {
        logWarning('PostgreSQL may not be running');
        logInfo('Database features may not work');
      } else {
        logSuccess('PostgreSQL is running');
      }
    }
    
    // Start server
    await startServer();
    
    // Wait a moment
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Open client
    openBrowser(SERVER_URL);
    
    // Start monitoring
    startStatusMonitor();
    
    // Keep alive
    process.stdin.resume();
    
  } catch (error) {
    logError(`Launcher error: ${error.message}`);
    console.error(error);
    cleanup();
  }
}

// Run
main();

// Made with ❤️ by Bob

// Made with Bob
