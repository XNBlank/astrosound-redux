"use strict";

var app = require('app');
var BrowserWindow = require('browser-window');
var open = require('open');

var mainWindow = null;

app.on('window-all-closed', function() {
  if (process.platform != 'darwin')
    app.quit();
});

app.on('ready', function() {
    mainWindow = new BrowserWindow({
        width: 700,
        height: 600,
        frame: false,
        'min-width': 670,
        'min-height': 580,
        'accept-first-mouse': true,
        'title-bar-style': 'hidden'
    });

    mainWindow.loadUrl('file://' + __dirname + '/index.html');

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
