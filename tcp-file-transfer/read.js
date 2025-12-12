const fs = require("fs");

const readStream = fs.createReadStream("output.txt", {
    highWaterMark: 16 // 16 bytes per chunk
});

const chunks = []

readStream.on("data", (chunk) => {
    console.log(`Received ${chunk.length} bytes of data.`);
    chunks.push(chunk);
    console.log(chunk.toString());
});

readStream.on("end", () => {
    console.log(chunks);
    console.log(Buffer.concat(chunks).toString());
    console.log("No more data to read.");
});