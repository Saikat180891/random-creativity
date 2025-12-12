// client-file.js
const net = require("net");
const fs = require("fs");
const path = require("path");
const { pipeline } = require("stream");

const client = net.createConnection({ port: 5000 }, () => {
  const writeStream = fs.createWriteStream(
    path.resolve(__dirname, "received.txt")
  );

  pipeline(client, writeStream, (err) => {
    if (err) {
      console.error("Pipeline failed.", err);
    } else {
      console.log("Pipeline succeeded.");
    }
  });
});
