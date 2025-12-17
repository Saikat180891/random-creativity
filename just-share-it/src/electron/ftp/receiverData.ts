import net from "net";
import fs from "fs";
import { getDB, updateFileProgress, updateFileStatus } from "../db.js";

export function startDataServer(port: number) {
  const server = net.createServer((socket) => {
    let fileId: number;
    let fileSize = 0;
    let receivedBytes = 0;
    let writeStream: fs.WriteStream;

    socket.once("data", (data) => {
      const payload = JSON.parse(data.toString());
      fileId = payload.fileId;
      fileSize = payload.size;

      const row = getDB()
        .prepare("SELECT path FROM files WHERE id = ?")
        .get(fileId) as { path: string };

      writeStream = fs.createWriteStream(row.path);
    });

    socket.on("data", (chunk) => {
      receivedBytes += chunk.length;
      writeStream.write(chunk);

      updateFileProgress(fileId, Math.floor((receivedBytes / fileSize) * 100));
    });

    socket.on("end", () => {
      updateFileProgress(fileId, 100);
      updateFileStatus(fileId, "completed");
      writeStream.close();
    });

    socket.on("error", () => {
      updateFileStatus(fileId, "error");
      writeStream?.close();
    });
  });

  server.listen(port, () => {
    console.log("📦 Data server listening on", port);
  });
}
