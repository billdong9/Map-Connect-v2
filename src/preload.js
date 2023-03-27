import { contextBridge, ipcRenderer } from 'electron';

const validChannels = ['getVersion', 'button operation', 'axis operation', 'connected', 'lose connection', 'connect error', 'change page', 'refreshManifestComplete', 'refreshManifest', 'getActionList', 'setActionList', 'getConfig', 'setConfig'];

console.log("preload.js is loaded");

contextBridge.exposeInMainWorld('ipcRenderer', {
    send: (channel, ...args) => {
        if (validChannels.includes(channel)) {
            ipcRenderer.send(channel, ...args);
        } else {
            console.log("NOT A VALID CHANNEL: " + channel);
        }
    },
    on: (channel, func) => {
        if (validChannels.includes(channel)) {
            ipcRenderer.on(channel, (event, ...args) => func(event, ...args))
        } else {
            console.log("NOT A VALID CHANNEL: " + channel);
        }
    },
    invoke: async (channel, ...args) => {
        if (validChannels.includes(channel)) {
            return await ipcRenderer.invoke(channel, ...args);
        } else {
            console.log("NOT A VALID CHANNEL: " + channel);
        }
    }
})

contextBridge.exposeInMainWorld('versions', {
    mas: () => process.mas
})