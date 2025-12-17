// server-file.js
const net = require("net");
const fs = require("fs");
const path = require("path");
const { pipeline, Transform } = require("stream");

const filePath = path.resolve(__dirname, "largefile.mp4");

function createProgressStream(totalSize) {
  let transferred = 0;
  return new Transform({
    transform(chunk, encoding, callback) {
      transferred += chunk.length;
      const percent = ((transferred / totalSize) * 100).toFixed(2);
      process.stdout.write(`\rTransferred: ${percent}%`);
      callback(null, chunk);
    },
  });
}

const server = net.createServer((socket) => {
  const readStream = fs.createReadStream(filePath, ({ highWaterMark: 64 * 1024 })); // 64KB chunks
  const stat = fs.statSync(filePath);
  const totalSize = stat.size;

  const header = JSON.stringify({
    filename: path.basename(filePath),
    size: totalSize,
  }) + "\n";
  
  socket.write(header);

  const progressStream = createProgressStream(totalSize);

  pipeline(readStream, progressStream, socket, (err) => {
    if (err) {
      console.error("Pipeline failed.", err);
    } else {
      console.log("Pipeline succeeded.");
    }
    socket.end();
  });
});

server.listen(5000, () => console.log("Server sending file..."));
