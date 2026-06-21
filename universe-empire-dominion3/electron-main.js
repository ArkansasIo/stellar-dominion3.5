const { app, BrowserWindow, Menu, Tray, dialog } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;
let serverProcess;
let tray;

const SERVER_PORT = 5001;
const SERVER_URL = `http://localhost:${SERVER_PORT}`;

function startServer() {
  const serverPath = path.join(__dirname, 'dist', 'index.cjs');

  serverProcess = spawn('node', [serverPath], {
    env: {
      ...process.env,
      PORT: SERVER_PORT,
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

  return new Promise((resolve) => {
    setTimeout(resolve, 3000);
  });
}

function stopServer() {
  if (serverProcess) {
    serverProcess.kill();
    serverProcess = null;
  }
}

async function createWindow() {
  await startServer();

  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    title: 'Universe Empire Dominion',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    },
    autoHideMenuBar: true,
    backgroundColor: '#0a0a0a'
  });

  mainWindow.loadURL(SERVER_URL);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  createTray();
}

function createTray() {
  const iconPath = path.join(__dirname, 'assets', 'tray-icon.png');

  try {
    tray = new Tray(iconPath);

    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Show Universe Empire Dominion',
        click: () => {
          if (mainWindow) mainWindow.show();
        }
      },
      {
        label: 'Restart Server',
        click: async () => {
          stopServer();
          await startServer();
          if (mainWindow) mainWindow.reload();
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
      if (mainWindow) mainWindow.show();
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
