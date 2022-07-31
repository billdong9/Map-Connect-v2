import { app, Menu, shell } from 'electron';

const isMac = process.platform === 'darwin';

export default win => {
    const template = [
        ...(isMac ? [{
            label: 'Map Connect',
            submenu: [
                { role: 'about' },
                { type: 'separator' },
                { role: 'quit' }
            ]
        }] : []),
        {
            label: 'View',
            submenu: [
                { role: 'toggleDevTools' },
                { type: 'separator' },
                {
                    label: 'Main page',
                    click() {
                        win.webContents.send("change page", 'main');
                    }
                },
                {
                    label: 'Joysticks page',
                    click() {
                        win.webContents.send("change page", 'joysticks');
                    }
                },
                {
                    label: 'Tutorial page',
                    click() {
                        win.webContents.send("change page", 'tutorial');
                    }
                },
                { type: 'separator' },
                { role: 'togglefullscreen' }
            ]
        },
        {
            label: 'Window',
            submenu: [
                { role: 'minimize' },
                { role: 'zoom' },
                { type: 'separator' },
                { role: 'close' }
            ]
        },
        {
            role: 'help',
            submenu: [
                {
                    label: 'Learn More',
                    click: async () => {
                        await shell.openExternal('https://www.map-flight.com');
                    }
                }
            ]
        }
    ]

    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
}