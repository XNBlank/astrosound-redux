"use strict";

var app = require('app');
var BrowserWindow = require('browser-window');

var mainWindow = null;

app.on('window-all-closed', function() {
  if (process.platform != 'darwin')
    app.quit();
});

app.on('ready', function() {
  mainWindow = new BrowserWindow({
    width: 1500,
    height: 850,
    frame: false,
    'min-width': 1200,
    'min-height': 310,
    'accept-first-mouse': true,
    'title-bar-style': 'hidden'
  });

  mainWindow.loadUrl('file://' + __dirname + '/index.html');
  mainWindow.on('closed', function() {
    mainWindow = null;
    app.quit();
  });

});
