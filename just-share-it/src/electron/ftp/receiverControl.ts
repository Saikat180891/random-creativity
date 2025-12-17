import net from "net";
import path from "path";
import fs from "fs";
import { app } from "electron";
import { loadConfig } from "../config/configManager.js";
import { getDB } from "../db.js";

export function startControlServer(port: number) {
  const server = net.createServer((socket) => {
    socket.once("data", (data) => {
      const meta = JSON.parse(data.toString());

      const config = loadConfig();
      const outputDir =
        config.outputDirectory ??
        path.join(app.getPath("userData"), "received");

      fs.mkdirSync(outputDir, { recursive: true });

      const savePath = path.join(outputDir, meta.name);

      const result = getDB()
        .prepare(
          `
          INSERT INTO files (
            name, path, size, type, direction, status, progress
          )
          VALUES (?, ?, ?, ?, 'receive', 'receiving', 0)
        `
        )
        .run(meta.name, savePath, meta.size, meta.type);

      socket.write(
        JSON.stringify({
          ok: true,
          fileId: result.lastInsertRowid,
          dataPort: port + 1,
        })
      );
    });
  });

  server.listen(port, () => {
    console.log("🧠 Control server listening on", port);
  });
}
