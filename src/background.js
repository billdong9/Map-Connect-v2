'use strict'

import path from 'path';
import { app, protocol, BrowserWindow, shell, powerSaveBlocker } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'

import addApis from './background/addApis';
import networkHandler from './background/net';
import setMenu from './background/setMenu';
import errHandler from './background/error';

const isDevelopment = process.env.NODE_ENV !== 'production'

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
    { scheme: 'app', privileges: { secure: true, standard: true } }
])

addApis();

app.enableSandbox();

async function createWindow() {
    // Create the browser window.
    const win = new BrowserWindow({
        width: 750,
        height: 600,
        minWidth: 750,
        minHeight: 600,
        webPreferences: {
            // Use pluginOptions.nodeIntegration, leave this alone
            // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
            nodeIntegration: false,
            contextIsolation: true,
            backgroundThrottling: false,
            preload: path.join(__dirname, '/preload.js')
        }
    })

    if (process.env.WEBPACK_DEV_SERVER_URL) {
        // Load the url of the dev server if in development mode
        await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
        if (!process.env.IS_TEST) win.webContents.openDevTools()
    } else {
        createProtocol('app')
        // Load the index.html when not in development
        win.loadURL('app://./index.html')
    }

    win.webContents.setWindowOpenHandler(details => {
        shell.openExternal(details.url);
        return {
            action: 'deny'
        }
    })

    errHandler(win);
    setMenu(win);
    networkHandler(win);
    setAppTitle(win);
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    app.quit();
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
    if (isDevelopment && !process.env.IS_TEST) {
        // Install Vue Devtools
        try {
            await installExtension(VUEJS_DEVTOOLS)
        } catch (e) {
            console.error('Vue Devtools failed to install:', e.toString())
        }
    }
    powerSaveBlocker.start('prevent-display-sleep');
    createWindow();
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
    if (process.platform === 'win32') {
        process.on('message', (data) => {
            if (data === 'graceful-exit') {
                app.quit()
            }
        })
    } else {
        process.on('SIGTERM', () => {
            app.quit()
        })
    }
}

function setAppTitle(win) {
    win.setTitle('Map Connect v' + app.getVersion());
}