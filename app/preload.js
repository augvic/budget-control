const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld("api", {
    minimizar: () => ipcRenderer.send("window-minimize"),
    maximizar: () => ipcRenderer.send("window-maximize"),
    fechar: () => ipcRenderer.send("window-close"),
    selecionarDiretorio: () => ipcRenderer.invoke("selecionar-diretorio")
});