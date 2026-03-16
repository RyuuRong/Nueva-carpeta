const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('browserInfo', {
  engine: 'Chromium (Electron)',
  sidebarMode: 'Opera-like sidebars'
});
