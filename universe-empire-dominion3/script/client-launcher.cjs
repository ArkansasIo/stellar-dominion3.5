#!/usr/bin/env node

// Client Launcher - Opens the game in default browser
const { exec } = require('child_process');
const path = require('path');
const http = require('http');
const fs = require('fs');

const SERVER_URL = 'http://localhost:3000';
const LOG_FILE = path.join(__dirname, 'client-launcher.log');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  yellow: '\x1b[33m'
};

function log(message, color = 'reset') {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}`;
  console.log(`${colors[color]}${message}${colors.reset}`);
  
  // Also write to log file
  try {
    fs.appendFileSync(LOG_FILE, logMessage + '\n');
  } catch (err) {
    // Ignore log file errors
  }
}

function logError(message, error) {
  log(`ERROR: ${message}`, 'red');
  if (error) {
    log(`Details: ${error.message}`, 'red');
    log(`Stack: ${error.stack}`, 'red');
  }
}

// Check if server is running
function checkServer() {
  return new Promise((resolve) => {
    http.get(SERVER_URL, (res) => {
      resolve(res.statusCode === 200);
    }).on('error', () => {
      resolve(false);
    });
  });
}

// Open browser
function openBrowser(url) {
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
      log(`Error opening browser: ${error.message}`, 'red');
      log(`Please manually open: ${url}`, 'blue');
    }
  });
}

async function main() {
  try {
    console.log('');
    log('═══════════════════════════════════════════════', 'bright');
    log('  Universe Empire Dominion - Client Launcher', 'bright');
    log('═══════════════════════════════════════════════', 'bright');
    console.log('');
    
    log('Checking server connection...', 'blue');
    
    let serverRunning = false;
    try {
      serverRunning = await checkServer();
    } catch (error) {
      logError('Failed to check server', error);
    }
    
    if (!serverRunning) {
      log('Server is not running!', 'red');
      log('Please start the server first:', 'blue');
      log('  - Run: server/UniverseEmpireDominion-windows.exe', 'blue');
      log('  - Or: Use the full launcher', 'blue');
      log('  - Or: npm run dev', 'blue');
      console.log('');
      log('Press any key to exit...', 'yellow');
      
      // Wait for keypress before exiting
      process.stdin.setRawMode(true);
      process.stdin.resume();
      process.stdin.once('data', () => {
        process.exit(1);
      });
      return;
    }
    
    log('Server is running!', 'green');
    log(`Opening game at: ${SERVER_URL}`, 'blue');
    console.log('');
    
    try {
      openBrowser(SERVER_URL);
    } catch (error) {
      logError('Failed to open browser', error);
      log(`Please open manually: ${SERVER_URL}`, 'yellow');
    }
    
    log('Game launched in your browser!', 'green');
    log('Keep this window open while playing.', 'blue');
    log('Press Ctrl+C to close this launcher.', 'blue');
    console.log('');
    
    // Keep process alive and monitor server
    setInterval(async () => {
      try {
        const isRunning = await checkServer();
        if (!isRunning) {
          log('Warning: Server connection lost!', 'yellow');
          log('Please check if the server is still running.', 'blue');
        }
      } catch (error) {
        // Silently ignore monitoring errors
      }
    }, 30000); // Check every 30 seconds
    
    // Keep process running
    process.stdin.resume();
    
  } catch (error) {
    logError('Launcher error', error);
    log('Press any key to exit...', 'yellow');
    
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.once('data', () => {
      process.exit(1);
    });
  }
}

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  logError('Uncaught exception', error);
  log('Press any key to exit...', 'yellow');
  
  process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdin.once('data', () => {
    process.exit(1);
  });
});

process.on('unhandledRejection', (error) => {
  logError('Unhandled rejection', error);
});

main().catch(error => {
  logError('Main function error', error);
  process.exit(1);
});

// Made with Bob
