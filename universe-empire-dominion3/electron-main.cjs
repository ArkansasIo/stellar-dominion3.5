const { app, BrowserWindow, Menu, Tray, dialog } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const net = require('net');

let mainWindow;
let serverProcess;
let tray;

const SERVER_PORT = 5001;
const SERVER_URL = `http://localhost:${SERVER_PORT}`;

function getAssetPath(relativePath) {
  const isPackaged = app.isPackaged;
  const basePath = isPackaged ? process.resourcesPath : __dirname;
  return path.join(basePath, relativePath);
}

function waitForServer(url, maxRetries = 30, intervalMs = 500) {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    function tryConnect() {
      const req = net.request(url);
      req.on('response', () => resolve());
      req.on('error', () => {
        if (++attempts >= maxRetries) {
          reject(new Error('Server failed to start within timeout'));
        } else {
          setTimeout(tryConnect, intervalMs);
        }
      });
      req.end();
    }
    tryConnect();
  });
}

function startServer() {
  const isPackaged = app.isPackaged;
  const basePath = isPackaged ? process.resourcesPath : __dirname;
  const serverPath = path.join(basePath, 'dist', 'index.cjs');
  const nodeExec = isPackaged ? process.execPath : 'node';

  serverProcess = spawn(nodeExec, [serverPath], {
    env: {
      ...process.env,
      PORT: String(SERVER_PORT),
      NODE_ENV: 'production'
    },
    stdio: ['ignore', 'pipe', 'pipe']
  });

  serverProcess.stdout.on('data', (data) => {
    console.log(`Server: ${data}`);
  });

  serverProcess.stderr.on('data', (data) => {
    console.error(`Server Error: ${data}`);
  });

  serverProcess.on('close', (code) => {
    console.log(`Server process exited with code ${code}`);
  });

  serverProcess.on('error', (err) => {
    console.error('Failed to start server process:', err);
  });

  return waitForServer(SERVER_URL);
}

function stopServer() {
  if (serverProcess) {
    serverProcess.kill();
    serverProcess = null;
  }
}

async function createWindow() {
  try {
    await startServer();
  } catch (err) {
    console.error('Server startup error:', err);
    dialog.showErrorBox('Server Error', `Failed to start the game server: ${err.message}`);
    app.quit();
    return;
  }

  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    title: 'Universe Empire Dominion',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    },
    autoHideMenuBar: true,
    backgroundColor: '#0a0a0a',
    show: false
  });

  mainWindow.loadURL(SERVER_URL);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  createTray();
}

function createTray() {
  const iconPath = getAssetPath(path.join('assets', 'tray-icon.png'));

  try {
    tray = new Tray(iconPath);

    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Show Universe Empire Dominion',
        click: () => {
          if (mainWindow) {
            mainWindow.show();
            mainWindow.focus();
          }
        }
      },
      {
        label: 'Restart Server',
        click: async () => {
          stopServer();
          try {
            await startServer();
            if (mainWindow) mainWindow.reload();
          } catch (err) {
            console.error('Server restart error:', err);
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

    tray.setToolTip('Universe Empire Dominion');
    tray.setContextMenu(contextMenu);

    tray.on('click', () => {
      if (mainWindow) {
        mainWindow.show();
        mainWindow.focus();
      }
    });
  } catch (e) {
    console.log('Tray icon not found, skipping tray setup');
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    stopServer();
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on('before-quit', () => {
  stopServer();
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});
