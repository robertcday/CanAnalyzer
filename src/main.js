const { app, BrowserWindow, ipcMain } = require('electron');
const backend = require('./backend');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  mainWindow.loadFile('src/index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
  if (pyProc) pyProc.kill();
});

ipcMain.on('start-listen', (event, port) => {
  backend.startListening(port, (data) => {
    mainWindow.webContents.send('serial-data', data.trim());
  }, (err) => {
    mainWindow.webContents.send('serial-data', `ERROR: ${err.message}`);
  });
});

ipcMain.on('stop-listen', () => {
  backend.stopListening();
});


ipcMain.on('refresh-ports', (event) => {
  backend.listPorts().then(ports => {
    mainWindow.webContents.send('refresh-ports', `${ports.join('\n')}`);
  });
});