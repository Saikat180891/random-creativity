import { ipcMain, dialog } from "electron";
import fs from "fs";
import mime from "mime-types";
import path from "path";
import { deleteFileById, getDB } from "./db.js";
import { loadConfig, saveConfig } from "./config/configManager.js";
import { sendFile } from "./ftp/sendFile.js";

ipcMain.handle("file:add", (_, file) => {
  const db = getDB();
  if (!db) throw new Error("Database is not initialized");
  return db
    .prepare(
      `
    INSERT INTO files (name, path, size, type)
    VALUES (?, ?, ?, ?)
  `
    )
    .run(file.name, file.path, file.size, file.type);
});

ipcMain.handle("file:list", () => {
  const db = getDB();
  if (!db) throw new Error("Database is not initialized");
  return db.prepare(`SELECT * FROM files ORDER BY created_at DESC`).all();
});

ipcMain.handle("db:clearFiles", () => {
  const db = getDB();
  if (!db) throw new Error("Database is not initialized");
  db.prepare("DROP TABLE IF EXISTS files").run();
  return true;
});

ipcMain.handle("dialog:openFile", async () => {
  const db = getDB();
  if (!db) throw new Error("Database is not initialized");

  const result = await dialog.showOpenDialog({
    properties: ["openFile", "multiSelections"],
  });

  if (result.canceled) return [];

  const files = [];

  for (const filepath of result.filePaths) {
    const stats = fs.statSync(filepath);

    const file = {
      name: path.basename(filepath),
      path: filepath,
      size: stats.size,
      type: mime.lookup(filepath) || "application/octet-stream",
    };

    const insertResult = db
      .prepare(
        `
        INSERT INTO files (
          name,
          path,
          size,
          type,
          direction,
          status,
          progress
        )
        VALUES (?, ?, ?, ?, 'send', 'pending', 0)
      `
      )
      .run(file.name, file.path, file.size, file.type);

    files.push({
      id: insertResult.lastInsertRowid,
      ...file,
      direction: "send",
      status: "pending",
      progress: 0,
    });
  }

  return files;
});

ipcMain.handle("file:send", (_, fileId, ip) => {
  sendFile(fileId, ip);
});

ipcMain.handle("config:get", () => {
  return loadConfig();
});

ipcMain.handle("config:set", (_, partialConfig) => {
  saveConfig(partialConfig);
  return true;
});

ipcMain.handle("config:selectOutputDir", async () => {
  try {
    const result = await dialog.showOpenDialog({
      title: "Select Output Directory",
      properties: ["openDirectory", "createDirectory"],
    });

    if (result.canceled || result.filePaths.length === 0) {
      return null;
    }

    // Always return the first selected directory
    return result.filePaths[0];
  } catch (err) {
    console.error("Failed to select output directory:", err);
    return null;
  }
});

ipcMain.handle("file:delete", async (_, fileId: number) => {
  try {
    await deleteFileById(fileId);

    // OPTIONAL: delete file from disk if it exists
    // if (fs.existsSync(filePath)) {
    //   fs.unlinkSync(filePath);
    // }

    return true;
  } catch (err) {
    console.error("Failed to delete file:", err);
    throw err;
  }
});
