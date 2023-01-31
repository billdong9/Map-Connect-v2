// Thanks to Gzhynko and Velocity23 for making InfiniteFlight.js :)

import dgram from 'dgram';
import net from 'net';
import { PromiseSocket } from 'promise-socket';
import { ipcMain } from 'electron';
import actionCmdList from './../var/actionCmdList';
import actionUnstableCmdList from './../var/actionUnstableCmdList';

export default win => {
    const client = new Client();
    establishConnection(client, win);

    ipcMain.on("axis operation", (e, actionID, val) => {
        if (client.connected) {
            parseAxisAction(client, actionID, val);
        }
    })

    ipcMain.on("button operation", (e, actionID, val) => {
        console.log('button', actionID, val)
        if (client.connected) {
            parseButtonAction(client, actionID, val);
        }
    })

    ipcMain.on('refreshManifest', async () => {
        console.log("retrive manifest");
        client.manifestStr = '';
        client.totalManifestLen = 0;
        client.curManifestLen = 0;
        client.isGettingManifestDone = false;
        client.retrieveManifest();
    })
}

function parseButtonAction(client, actionID, val) {
    switch (actionID) {
        case 'reversethrust':
            if (client.cmdList[actionUnstableCmdList.reversethrust]) {
                client.writeInt(client.cmdList[actionUnstableCmdList.reversethrust].id);
                client.writeBool(true);
                client.writeBool(val);
            }
            break;
        default:
            client.runCmd(client.cmdList[actionCmdList[actionID]].id);
    }
}

function parseAxisAction(client, actionID, val) {
    val = parseInt(val * 1024);
    switch (actionID) {
        case 'roll':
            client.writeInt(4);
            client.writeBool(true);
            client.writeInt(val);
            break;

        case 'pitch':
            client.writeInt(2);
            client.writeBool(true);
            client.writeInt(val);
            break;

        case 'yaw':
            client.writeInt(6);
            client.writeBool(true);
            client.writeInt(val);
            break;

        case 'throttle':
            client.writeInt(8);
            client.writeBool(true);
            client.writeInt(val);
            break;

        case 'leftbrake':
            if (client.cmdList[actionUnstableCmdList.leftbrake]) {
                client.writeInt(client.cmdList[actionUnstableCmdList.leftbrake].id);
                client.writeBool(true);
                client.writeFloat((val / 1024 + 1) / 2);
            }
            break;

        case 'rightbrake':
            if (client.cmdList[actionUnstableCmdList.rightbrake]) {
                client.writeInt(client.cmdList[actionUnstableCmdList.rightbrake].id);
                client.writeBool(true);
                client.writeFloat((val / 1024 + 1) / 2);
            }
            break;
    }
}

function establishConnection(client, win) {
    client.establishConnection(win, () => {
        win.webContents.send("connected");
    }, (e) => {
        client.isError = true;
        win.webContents.send("connect error", e);
    }, () => {
        if (client.isError || !client.connected) return;
        win.webContents.send("lose connection");
        client.connected = false;
        establishConnection(client, win);
    })
}

class Client {
    constructor() {
        this.client = null;
        this.ipAddress = "";
        this.connected = false;
        this.isError = false;
        this.cmdList = {};
        this.manifestStr = '';
        this.totalManifestLen = 0;
        this.curManifestLen = 0;
        this.isGettingManifestDone = false;
        this.isFirstTimeGettingManifest = true;
    }

    connect(client, ip, port) {
        return client.connect(parseInt(port), ip);
    }

    establishConnection(win, success, error, close, logStatus = false) {
        this.client = null;
        this.ipAddress = "";
        this.connected = false;
        this.cmdList = {};
        this.manifestStr = '';
        this.totalManifestLen = 0;
        this.curManifestLen = 0;
        this.isGettingManifestDone = false;
        this.isFirstTimeGettingManifest = true;

        let s = dgram.createSocket('udp4');
        s.bind(15000);

        if (logStatus)
            console.log("Connecting to Infinite Flight...");

        s.on('message', function (msg) {
            const response = JSON.parse(msg.toString()),
                addr = this.getIPAddr(response.Addresses);

            console.log(response);
            console.log(addr);

            if (addr && response.Port) {
                this.ipAddress = addr;
                s.close();

                const newSocket = new net.Socket();
                newSocket.on('close', close);
                this.client = new PromiseSocket(newSocket);

                // Connect API V2
                this.connect(this.client, this.ipAddress, 10112).then(async function () {
                    // get manifest
                    this.client.stream.on('data', chunk => {
                        if (this.isGettingManifestDone || chunk.length < 12) return;
                        if (chunk.slice(0, 4).equals(Buffer.from([0xff, 0xff, 0xff, 0xff]))) {
                            this.manifestStr += this.parseResponseByType(chunk.slice(12), 4);
                            this.totalManifestLen = parseInt(chunk.slice(8, 12).toString('hex').match(/.{2}/g).reverse().join(""), 16);
                        } else {
                            if (this.totalManifestLen === 0) {
                                this.totalManifestLen = 0;
                                this.curManifestLen = 0;
                                this.isGettingManifestDone = false;
                                this.retrieveManifest();
                                return;
                            }
                            this.manifestStr += this.parseResponseByType(chunk, 4);
                        }
                        this.curManifestLen += chunk.length;
                        this.isGettingManifestDone = true;
                        for (let i in actionCmdList) {
                            console.log(actionCmdList[i], this.manifestStr.includes(actionCmdList[i]));
                            if (!this.manifestStr.includes(actionCmdList[i])) {
                                this.isGettingManifestDone = false;
                                break;
                            }
                        }
                        if (!this.isGettingManifestDone && (this.curManifestLen - 12) >= this.totalManifestLen) {
                            this.totalManifestLen = 0;
                            this.curManifestLen = 0;
                            this.isGettingManifestDone = false;
                            this.retrieveManifest();
                            return;
                        }
                        if (this.isGettingManifestDone) {
                            // call generate cmdList fn
                            console.log('done');
                            this.generateCmdList();
                            if (this.isFirstTimeGettingManifest) {
                                this.connected = true;
                                success();
                                this.isFirstTimeGettingManifest = false;
                            } else {
                                win.webContents.send('refreshManifestComplete');
                            }
                        }
                    })

                    this.retrieveManifest();
                }.bind(this)).catch((reason) => {
                    this.connected = false;
                    error(reason);
                })
            }
        }.bind(this));
    }

    generateCmdList() {
        const manifestArr = this.manifestStr.split('\n');
        for (let i = 0; i < manifestArr.length; i++) {
            const item = manifestArr[i].split(',');
            if (item.length < 3 || isNaN(parseInt(item[0])) || isNaN(parseInt(item[1]))) {
                continue;
            }
            this.cmdList[item[2]] = {
                id: item[0],
                dataType: item[1]
            }
        }
        console.log(this.cmdList);
    }

    getIPAddr(addrs) {
        let lastAddr;
        for (let i = 0; i < addrs.length; i++) {
            const regexp = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/gi;
            if (addrs[i] == "127.0.0.1" || !regexp.test(addrs[i])) continue;
            lastAddr = addrs[i];
        }
        return lastAddr;
    }

    writeBool(val) {
        if (val === true) {
            this.client.write(Buffer.from([1]));
        } else {
            this.client.write(Buffer.from([0]));
        }
    }

    writeInt(val) {
        const data = Buffer.allocUnsafe(4);
        data.writeInt32LE(val);
        this.client.write(data);
    }

    writeFloat(val) {
        const data = Buffer.allocUnsafe(4);
        data.writeFloatLE(val);
        this.client.write(data);
    }

    writeDouble(val) {
        const data = Buffer.allocUnsafe(4);
        data.writeDoubleLE(val);
        this.client.write(data);
    }

    writeString(val) {
        const data = new Uint8Array(val.length + 4);
        data[0] = val.length;
        for (let i = 0; i < val.length; i++) {
            data[i + 4] = val.charCodeAt(i);
        }
        this.client.write(data);
    }

    readBool(val) {
        return (val.toJSON() === true);
    }

    readInt(val) {
        return val.readInt32LE();
    }

    readFloat(val) {
        return val.readFloatLE();
    }

    readDouble(val) {
        return val.readDoubleLE();
    }

    readString(val) {
        return String.fromCharCode.apply(null, new Uint8Array(val));
    }

    parseResponseByType(val, type) {
        switch (type) {
            case 0:
                return this.readBool(val);
            case 1:
                return this.readInt(val);
            case 2:
                return this.readFloat(val);
            case 3:
                return this.readDouble(val);
            case 4:
                return this.readString(val);
            case 5:
                throw new Error("Not Implemented");
        }
    }

    runCmd(commandID) {
        this.writeInt(commandID);
        this.writeBool(false);
    }

    retrieveManifest() {
        this.runCmd(-1);
    }
}