const electron = require("electron");

electron.contextBridge.exposeInMainWorld("electron", {
  addFile: (file: any) => electron.ipcRenderer.invoke("file:add", file),
  listFiles: () => electron.ipcRenderer.invoke("file:list"),
  clearFiles: () => electron.ipcRenderer.invoke("db:clearFiles"),
  openFileDialog: () => electron.ipcRenderer.invoke("dialog:openFile"),
  sendFile: (fileId: string, ip: string) =>
    electron.ipcRenderer.invoke("file:send", fileId, ip),
  getConfig: () => electron.ipcRenderer.invoke("config:get"),
  setConfig: (cfg: any) => electron.ipcRenderer.invoke("config:set", cfg),
  selectOutputDir: () => electron.ipcRenderer.invoke("config:selectOutputDir"),
  deleteFile: (fileId: number) =>
    electron.ipcRenderer.invoke("file:delete", fileId),
  onFileProgress: (cb: (data: { id: number; progress: number }) => void) =>
    electron.ipcRenderer.on(
      "file:progress",
      (_: any, data: { id: number; progress: number }) => cb(data)
    ),

  onFileStatus: (cb: (data: { id: number; status: string }) => void) =>
    electron.ipcRenderer.on(
      "file:status",
      (_: any, data: { id: number; status: string }) => cb(data)
    ),
});
