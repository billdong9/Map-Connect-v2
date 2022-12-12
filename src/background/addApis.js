import { app, ipcMain } from 'electron';
import path from 'path';
import fs from 'fs';

import actionList from './../var/actionList';
import configFile from './../var/configFile';

const actionListFilePath = path.join(app.getPath('userData'), './actionList.json'),
    configFilePath = path.join(app.getPath('userData'), './appConfig.json');

export default () => {
    // action list
    ipcMain.handle('getActionList', async () => {
        if (fs.existsSync(actionListFilePath)) {
            const result = await fs.promises.readFile(actionListFilePath),
                resultObj = JSON.parse(result.toString());

            // action list file update check
            if (Object.keys(actionList).length !== Object.keys(resultObj).length) {
                await writeActionListFile(actionListFilePath);
                return actionList;
            }
            for (let i in actionList) {
                if (resultObj[i] === undefined || resultObj[i][0] !== actionList[i][0] || resultObj[i][1] !== actionList[i][1] || resultObj[i][2] !== actionList[i][2]) {
                    await writeActionListFile(actionListFilePath);
                    return actionList;
                }
            }

            return resultObj;
        } else {
            await writeActionListFile(actionListFilePath);
            return actionList;
        }
    })
    ipcMain.handle('setActionList', async (e, newActionList) => {
        await fs.promises.writeFile(actionListFilePath, JSON.stringify(newActionList));
        return true;
    })
    ipcMain.handle('getVersion', async () => {
        return app.getVersion();
    })
    ipcMain.handle('getConfig', async () => {
        if (fs.existsSync(configFilePath)) {
            const result = await fs.promises.readFile(configFilePath),
                resultObj = JSON.parse(result.toString());

            // config file update check
            if(JSON.stringify(Object.keys(resultObj)) !== JSON.stringify(Object.keys(configFile))) {
                await fs.promises.writeFile(configFilePath, JSON.stringify(configFile));
                return configFile;
            }

            return resultObj;
        } else {
            await fs.promises.writeFile(configFilePath, JSON.stringify(configFile));
            return configFile;
        }
    })
    ipcMain.handle('setConfig', async (e, configObj) => {
        
        return true;
    })
}

async function writeActionListFile(actionListFilePath) {
    // add assignment list to every action
    for (let i in actionList) {
        actionList[i].push([]);
    }

    await fs.promises.writeFile(actionListFilePath, JSON.stringify(actionList));
}