import { ipcRenderer } from 'electron';

export default {
    async get() {
        return await ipcRenderer.invoke('getConfig');
    },
    async set(newConfigObj) {
        await ipcRenderer.invoke('setConfig', newConfigObj);
    }
}