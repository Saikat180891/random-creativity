import { app, BrowserWindow } from "electron";
import path from "path";
import { isDev } from "./util.js";
import { getPreloadPath } from "./pathResolver.js";

const PORT = Number(process.env.RECEIVER_PORT || 9000);

app.setPath("userData", `${app.getPath("userData")}-${PORT}`);

app.whenReady().then(async () => {
  await import("./ipc.js");
  const { startReceiver } = await import("./ftp/receiver.js");
  await import("./tcp/transferManager.js");

  if (startReceiver) startReceiver(PORT);

  const mainWindow = new BrowserWindow({
    webPreferences: {
      preload: getPreloadPath(),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  if (isDev()) {
    mainWindow.loadURL("http://localhost:5173");
  } else {
    mainWindow.loadFile(path.join(app.getAppPath(), "/dist-react/index.html"));
  }
});
