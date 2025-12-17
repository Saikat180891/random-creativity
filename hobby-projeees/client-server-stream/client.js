// client-file.js
const net = require("net");
const fs = require("fs");
const path = require("path");
const { pipeline, Transform } = require("stream");

let headerBuffer = "";
let fileSize = 0;
let filename = "";

function createProgressStream(onProgress) {
  let received = 0;
  return new Transform({
    transform(chunk, enc, cb) {
      received += chunk.length;
      onProgress(received);
      cb(null, chunk);
    },
  });
}

// const filePath = path.resolve(__dirname, "received.mp4");

const client = net.createConnection({ port: 5000 }, () => {
  console.log("Connected to server, waiting for file...");
});

client.on("data", (chunk) => {
  if (!filename) {
    headerBuffer += chunk.toString();

    const newlineIndex = headerBuffer.indexOf("\n");
    if (newlineIndex !== -1) {
      const headerStr = headerBuffer.slice(0, newlineIndex);
    //   console.log("Header string:", headerStr);
      const header = JSON.parse(headerStr);
      console.log("Parsed header:", header);
      filename = path.resolve(__dirname, "copy_of_" + header.filename);
      console.log("Output filename:", filename);
      fileSize = header.size;

      console.log(`Metadata received:`, header);

      const remaining = headerBuffer.slice(newlineIndex + 1);

      client.removeAllListeners("data");

      startReceivingFile(remaining);
    }
  }
});

function startReceivingFile(initialChunk) {
  let received = 0;

  const writeStream = fs.createWriteStream(filename);

  // Write leftover file bytes (if any)
  if (initialChunk.length > 0) {
    writeStream.write(initialChunk);
    received += initialChunk.length;
    showProgress();
  }

  client.on("data", (chunk) => {
    writeStream.write(chunk);
    received += chunk.length;
    showProgress();

    if (received >= fileSize) {
      console.log("\nDownload complete!");
      writeStream.end();
      client.end();
    }
  });

  function showProgress() {
    const pct = ((received / fileSize) * 100).toFixed(2);
    process.stdout.write(`\rReceived: ${pct}%`);
  }
}
