import { ipcRenderer } from 'electron';

// get action list file
let actionList;

export default {
    async get() {
        actionList = await ipcRenderer.invoke('getActionList');
        return actionList;
    },
    async set(newActionList) {
        actionList = newActionList;
        await ipcRenderer.invoke('setActionList', newActionList);
    }
}