const { app, BrowserWindow } = require('electron');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const expressApp = require('./app');

let mainWindow;

async function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // Start Express server
  const port = 3000;
  expressApp.listen(port, () => {
    console.log(`Express server running at http://localhost:${port}`);
  });

  // Connect to local MongoDB
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/hardware_inventory', {});
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }

  // Load the app
  mainWindow.loadURL('http://localhost:3000');

  // Open DevTools in development
  // mainWindow.webContents.openDevTools();

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});