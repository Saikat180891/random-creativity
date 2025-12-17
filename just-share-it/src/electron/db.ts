/* eslint-disable @typescript-eslint/no-explicit-any */
import Database from "better-sqlite3";
import { app, BrowserWindow } from "electron";
import path from "path";

let db: Database.Database | null = null;

export function getDB() {
  if (db) return db;
  const dbPath = path.join(app.getPath("userData"), "files.db");
  db = new Database(dbPath);
  db.prepare("DROP TABLE IF EXISTS files").run();
  db.prepare(
    `
    CREATE TABLE IF NOT EXISTS files (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      path TEXT NOT NULL,
      size INTEGER NOT NULL,
      type TEXT NOT NULL,
      direction TEXT,
      progress INTEGER DEFAULT 0,
      status TEXT DEFAULT 'pending',   -- pending | sending | paused | done
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `
  ).run();

  return db;
}

function broadcast(event: string, payload: any) {
  for (const win of BrowserWindow.getAllWindows()) {
    win.webContents.send(event, payload);
  }
}

export function deleteFileById(id: number) {
  const db = getDB();

  // First get file path (needed if you want to delete from disk)
  const row = db.prepare("SELECT path FROM files WHERE id = ?").get(id) as
    | { path: string }
    | undefined;

  if (!row) {
    throw new Error("File not found");
  }

  db.prepare("DELETE FROM files WHERE id = ?").run(id);

  return row.path;
}

export function updateFileStatus(id: number, status: string) {
  getDB().prepare("UPDATE files SET status = ? WHERE id = ?").run(status, id);

  broadcast("file:status", { id, status });
}

export function updateFileProgress(id: number, progress: number) {
  getDB()
    .prepare("UPDATE files SET progress = ? WHERE id = ?")
    .run(progress, id);

  broadcast("file:progress", { id, progress });
}
