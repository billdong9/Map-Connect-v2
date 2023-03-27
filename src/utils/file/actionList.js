const ipcRenderer = window.ipcRenderer;

export default {
    async get() {
        return await ipcRenderer.invoke('getActionList');
    },
    async set(newActionList) {
        await ipcRenderer.invoke('setActionList', newActionList);
    }
}