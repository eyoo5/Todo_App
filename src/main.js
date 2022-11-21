const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

function handleSetTitle(event, title) {
  const webContents = event.sender;
  const win = BrowserWindow.fromWebContents(webContents);
  win.setTitle(title);
}

const handleCommunication = () => {
  ipcMain.removeHandler("save-to-file");
  ipcMain.removeHandler("restore-from-file");
  ipcMain.handle("save-to-file", async (event, data) => {
    try {
      const { canceled, filePath } = await dialog.showSaveDialog({
        defaultPath: "todo.json",
      });

      if (!canceled) {
        await fs.writeFile(filePath, data, "utf8");

        return { success: true };
      }
      return {
        canceled,
      };
    } catch (error) {
      return { error };
    }
  });
  ipcMain.handle("restore-from-file", async () => {
    try {
      const { canceled, filePaths } = await dialog.showOpenDialog({
        properties: ["openFile"],
        filters: [
          {
            name: "json",
            extensions: ["json"],
          },
        ],
      });

      if (!canceled) {
        const [filePath] = filePaths;
        const data = await fs.readFile(filePath, "utf8");

        return { success: true, data };
      } else {
        return { canceled };
      }
    } catch (error) {
      return { error };
    }
  });
};
const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    backgroundColor: "#faf0e6",
    icon: "./images/Icon.png",
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      enableRemoteModule: true,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
  handleCommunication();
};

app.whenReady().then(() => {
  ipcMain.on("set-title", handleSetTitle);
  createWindow();
});
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
// app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
