import { ipcRenderer } from 'electron';

export default {
    async get() {
        return await ipcRenderer.invoke('getConfig');
    },
    async set(newConfigFile) {
        await ipcRenderer.invoke('setConfig', newConfigFile);
    }
}