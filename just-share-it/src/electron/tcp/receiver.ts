/* eslint-disable @typescript-eslint/no-explicit-any */
import net from "net";
import fs from "fs";
import path from "path";
import { app } from "electron";
import { getDB, updateFileProgress, updateFileStatus } from "../db.js";
import { loadConfig } from "../config/configManager.js";

export function startReceiver(port: number) {
  const server = net.createServer((socket) => {
    let headerBuffer = "";
    let writeStream: fs.WriteStream | null = null;
    let fileMeta: {
      name: string;
      size: number;
      type: string;
    };
    let fileId: number | null = null;
    let receivedBytes = 0;

    socket.on("data", (chunk: Buffer) => {
      if (!writeStream) {
        headerBuffer += chunk.toString();

        const headerEndIndex = headerBuffer.indexOf("\n");
        if (headerEndIndex === -1) return;

        const headerLine = headerBuffer.slice(0, headerEndIndex);
        fileMeta = JSON.parse(headerLine);

        // ✅ Resolve output directory from config
        const config = loadConfig();
        const outputDir =
          config.outputDirectory ??
          path.join(app.getPath("userData"), "received");

        // ✅ Ensure directory exists
        fs.mkdirSync(outputDir, { recursive: true });

        const savePath = path.join(outputDir, fileMeta.name);

        // ✅ Create write stream
        writeStream = fs.createWriteStream(savePath);

        // ✅ Persist receiving file in DB
        const db = getDB();
        const result = db
          .prepare(
            `
          INSERT INTO files (name, path, size, type, direction, status, progress)
          VALUES (?, ?, ?, ?, 'receive', 'receiving', 0)
        `
          )
          .run(fileMeta.name, savePath, fileMeta.size, fileMeta.type);

        fileId = Number(result.lastInsertRowid);
        receivedBytes = 0;

        // 🔴 IMPORTANT FIX: handle remaining bytes after header
        const remaining = Buffer.from(headerBuffer.slice(headerEndIndex + 1));

        if (remaining.length > 0) {
          receivedBytes += remaining.length;
          writeStream.write(remaining);

          if (fileId !== null) {
            const progress = Math.min(
              100,
              Math.floor((receivedBytes / fileMeta.size) * 100)
            );
            updateFileProgress(fileId, progress);
          }
        }

        headerBuffer = "";
        return;
      }

      receivedBytes += chunk.length;

      if (fileId !== null) {
        const progress = Math.min(
          100,
          Math.floor((receivedBytes / fileMeta.size) * 100)
        );
        updateFileProgress(fileId, progress);
      }

      writeStream.write(chunk);
    });

    socket.on("end", () => {
      if (fileId !== null) {
        updateFileProgress(fileId, 100);
        updateFileStatus(fileId, "completed");
      }
      writeStream?.close();
    });

    socket.on("error", (err) => {
      console.error("Receiver socket error:", err);
      if (fileId !== null) {
        updateFileStatus(fileId, "error");
      }
      writeStream?.close();
    });
  });

  server.listen(port, () => {
    console.log("📥 Receiver listening on port", port);
  });
}
