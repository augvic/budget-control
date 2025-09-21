const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const { spawn } = require('child_process');
const { join } = require('path');
const fs = require("fs");

class AppHandler {

    _startDjangoServer() {
        const serverPath = join(process.resourcesPath, "server", "Controle Verba Server.exe");
        const logDir = join(process.resourcesPath, "logs");
        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir);
        }
        const stdout = fs.openSync(join(logDir, `stdout${Date.now()}.txt`), "a");
        const stderr = fs.openSync(join(logDir, `stderr${Date.now()}.txt`), "a");
        this.djangoProcess = spawn(serverPath, ["runserver", "--noreload"], {
            stdio: ["ignore", stderr, stdout],
            windowsHide: true,
            shell: false
        });
        const end = Date.now() + 5000;
        while (Date.now() < end) {}
    }

    _instantiateBrowser() {
        return new BrowserWindow({
            width: 1100,
            height: 600,
            minWidth: 1100,
            minHeight: 600,
            frame: false,
            icon: join(__dirname, "..", "icon.png"),
            webPreferences: {
                preload: join(__dirname, "..", "preload.js"),
                contextIsolation: true,
            }
        });
    }

    _renderMainHtml(win) {
        win.loadFile("./main_window/main.html");
    }

    _startMinMaxCloLogic(win) {
        ipcMain.on("window-minimize", () => win.minimize());
        ipcMain.on("window-maximize", () => {
            if (win.isMaximized()) {
                win.unmaximize();
            } else {
                win.maximize();
            }
        });
        ipcMain.on("window-close", () => win.close());
    }

    _startDialog() {
        ipcMain.handle("selecionar-diretorio", async () => {
            const path = await dialog.showOpenDialog({
                properties: ["openDirectory"]
            });
            if (!path.canceled && path.filePaths.length > 0) {
                return path.filePaths[0];
            }
        });
    }

    _createElectronWindow() {
        const win = this._instantiateBrowser();
        this._renderMainHtml(win);
        this._startMinMaxCloLogic(win);
        this._startDialog();
    };

    _closeDjangoServer() {
        fetch('http://127.0.0.1:8000/shutdown/', {
            method: "POST"
        });
    }

    startApp() {
        const isDev = !app.isPackaged;
        app.whenReady().then(() => { 
            if(!isDev) {
                this._startDjangoServer();
            }
            this._createElectronWindow();
        });
        app.on('window-all-closed', () => {
            if (process.platform !== 'darwin') {
                if (!isDev) {
                    this._closeDjangoServer();
                }
                app.quit();
            }
        });
    }

}

module.exports = { AppHandler };