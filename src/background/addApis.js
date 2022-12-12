import { app, ipcMain } from 'electron';
import path from 'path';
import fs from 'fs';

import actionList from './../var/actionList';

const dataPath = path.join(app.getPath('userData'), './actionList.json');

export default () => {
    // action list
    ipcMain.handle('getActionList', async () => {
        if (fs.existsSync(dataPath)) {
            const result = await fs.promises.readFile(dataPath),
                resultObj = JSON.parse(result.toString());

            // action list file update check
            if (Object.keys(actionList).length !== Object.keys(resultObj).length) {
                await writeActionListFile(dataPath);
                return actionList;
            }
            for (let i in actionList) {
                if (resultObj[i] === undefined || resultObj[i][0] !== actionList[i][0] || resultObj[i][1] !== actionList[i][1] || resultObj[i][2] !== actionList[i][2]) {
                    await writeActionListFile(dataPath);
                    return actionList;
                }
            }

            return resultObj;
        } else {
            await writeActionListFile(dataPath);
            return actionList;
        }
    })
    ipcMain.handle('setActionList', async (e, newActionList) => {
        await fs.promises.writeFile(dataPath, JSON.stringify(newActionList));
        return true;
    })
    ipcMain.handle('getVersion', async () => {
        return app.getVersion();
    })
}

async function writeActionListFile(dataPath) {
    // add assignment list to every action
    for (let i in actionList) {
        actionList[i].push([]);
    }

    await fs.promises.writeFile(dataPath, JSON.stringify(actionList));
}