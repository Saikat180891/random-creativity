import net from "net";
import fs from "fs";
import { getDB, updateFileStatus } from "../db.js";
import { loadConfig } from "../config/configManager.js";

export function sendFile(fileId: number, targetIp: string) {
  const db = getDB();
  const file = db.prepare("SELECT * FROM files WHERE id = ?").get(fileId) as {
    name: string;
    path: string;
    size: number;
    type: string;
  };

  const { destinationPort } = loadConfig();

  updateFileStatus(fileId, "sending");

  // ───── CONTROL SOCKET ─────
  const controlSocket = net.connect(destinationPort, targetIp);

  controlSocket.write(
    JSON.stringify({
      name: file.name,
      size: file.size,
      type: file.type,
    })
  );

  controlSocket.once("data", (data) => {
    const { ok, fileId: recvFileId, dataPort } = JSON.parse(data.toString());

    if (!ok) throw new Error("Receiver rejected file");

    // ───── DATA SOCKET ─────
    const dataSocket = net.connect(dataPort, targetIp);

    dataSocket.write(
      JSON.stringify({
        fileId: recvFileId,
        size: file.size,
      })
    );

    fs.createReadStream(file.path).pipe(dataSocket);
  });
}
