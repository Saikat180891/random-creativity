// server-file.js
const net = require("net");
const fs = require("fs");
const path = require("path");
const { pipeline } = require("stream");

const server = net.createServer((socket) => {
  const readStream = fs.createReadStream(
    path.resolve(__dirname, "bigfile.txt")
  );

  pipeline(readStream, socket, (err) => {
    if (err) {
      console.error("Pipeline failed.", err);
    } else {
      console.log("Pipeline succeeded.");
    }
    socket.end();
  });
});

server.listen(5000, () => console.log("Server sending file..."));
