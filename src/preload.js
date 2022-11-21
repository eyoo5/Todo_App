const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("todoAPI", {
  saveToFile(data) {
    return ipcRenderer.invoke("save-to-file", data);
  },
  restoreFromFile() {
    return ipcRenderer.invoke("restore-from-file");
  },
  node: () => process.versions.node,
  electron: () => proecess.versions.electron,
  chrome: () => process.versions.chrome,
  setTitle: (title) => ipcRenderer.send("set-title", title),
});
