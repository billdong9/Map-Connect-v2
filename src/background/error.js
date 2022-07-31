import process from 'process';

export default win => {
    process.on('uncaughtException', function (err) {
        console.log(err);
        switch (err.code) {
            case 'EADDRINUSE':
                win.webContents.send("connect error", 'Port ' + err.port + ' is already occupied by another app, please close the app occupying this port and restart Map Connect');
                break;
            default:
                win.webContents.send("connect error", err);
        }
    })
}