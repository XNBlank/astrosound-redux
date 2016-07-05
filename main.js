"use strict";

//var app = require('electron').app;
var BrowserWindow = require('electron').BrowserWindow;
var open = require('open');
const path = require('path');
const globalShortcut = require('electron').globalShortcut;
const mainWindow = null;

if (require('electron-squirrel-startup')) return;

const app = require('app');

// this should be placed at top of main.js to handle setup events quickly
if (handleSquirrelEvent()) {
  // squirrel event handled and app will exit in 1000ms, so don't do anything else
  return;
}

function handleSquirrelEvent() {
  if (process.argv.length === 1) {
    return false;
  }

  const ChildProcess = require('child_process');
  const path = require('path');

  const appFolder = path.resolve(process.execPath, '..');
  const rootAtomFolder = path.resolve(appFolder, '..');
  const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
  const exeName = path.basename(process.execPath);

  const spawn = function(command, args) {
    let spawnedProcess, error;

    try {
      spawnedProcess = ChildProcess.spawn(command, args, {detached: true});
    } catch (error) {}

    return spawnedProcess;
  };

  const spawnUpdate = function(args) {
    return spawn(updateDotExe, args);
  };

  const squirrelEvent = process.argv[1];
  switch (squirrelEvent) {
    case '--squirrel-install':
    case '--squirrel-updated':
      // Optionally do things such as:
      // - Add your .exe to the PATH
      // - Write to the registry for things like file associations and
      //   explorer context menus

      // Install desktop and start menu shortcuts
      spawnUpdate(['--createShortcut', exeName]);

      setTimeout(app.quit, 5000);
      return true;

    case '--squirrel-uninstall':
      // Undo anything you did in the --squirrel-install and
      // --squirrel-updated handlers

      // Remove desktop and start menu shortcuts
      spawnUpdate(['--removeShortcut', exeName]);

      setTimeout(app.quit, 1000);
      return true;

    case '--squirrel-obsolete':
      // This is called on the outgoing version of your app before
      // we update to the new version - it's the opposite of
      // --squirrel-updated

      app.quit();
      return true;
  }
};





app.on('window-all-closed', function() {
  if (process.platform != 'darwin')
    app.quit();
});

app.on('ready', function() {
    let mainWindow = new BrowserWindow({
        width: 700,
        height: 600,
        frame: false,
        minWidth: 670,
        minHeight: 580,
        acceptFirstMouse: true,
        titleBarStyle: 'hidden',
        icon: __dirname + '/app.png'
    });

    // Register a 'CommandOrControl+X' shortcut listener.
    const ret = globalShortcut.register('CommandOrControl+Shift+I', () => {
      mainWindow.openDevTools();
    });

    const rel = globalShortcut.register('CommandOrControl+R', () => {
      mainWindow.reload();
    });


    mainWindow.loadURL('file://' + __dirname + '/index.html');

    var webContents = mainWindow.webContents;

    mainWindow.on('closed', function() {
        mainWindow = null;
        app.quit();
    });

    webContents.on('new-window', function(event, url){
        event.preventDefault();
        open(url);
    });

});
