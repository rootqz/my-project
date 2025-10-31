const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const si = require('systeminformation');

function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  win.loadFile('renderer/index.html');
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle('get-system-info', async () => {
  const cpu = await si.cpu();
  const gpu = await si.graphics();
  const mem = await si.mem();
  const res = gpu.displays[0]?.resolutionx + 'x' + gpu.displays[0]?.resolutiony;

  return {
    cpu: cpu.brand,
    gpu: gpu.controllers[0]?.model,
    memory: (mem.total / 1073741824).toFixed(1) + ' GB',
    resolution: res
  };
});