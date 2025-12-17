import fs from "fs";
import net from "net";
import { getDB, updateFileProgress, updateFileStatus } from "../db.js";
import { loadConfig } from "../config/configManager.js";

export function sendFile(fileId: number, targetIp: string) {
  const db = getDB();

  const file = db.prepare("SELECT * FROM files WHERE id = ?").get(fileId) as {
    name: string;
    size: number;
    type: string;
    path: string;
  };

  if (!file) throw new Error("File not found");

  const { destinationPort } = loadConfig();
  if (!destinationPort) {
    throw new Error("Receiver port not configured");
  }

  const socket = net.connect(destinationPort, targetIp);

  socket.write(
    JSON.stringify({
      name: file.name,
      size: file.size,
      type: file.type,
    }) + "\n"
  );

  let bytesSent = 0;

  const readStream = fs.createReadStream(file.path);

  readStream.on("data", (chunk) => {
    bytesSent += chunk.length;

    const progress = Math.floor((bytesSent / file.size) * 100);

    updateFileProgress(fileId, progress);
  });

  readStream.on("end", () => {
    updateFileProgress(fileId, 100);
    updateFileStatus(fileId, "completed");
    socket.end();
  });

  readStream.on("error", () => {
    updateFileStatus(fileId, "error");
  });

  readStream.pipe(socket);
}
