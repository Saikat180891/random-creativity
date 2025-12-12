const fs  = require('fs');

const writeStream = fs.createWriteStream('output.txt');

writeStream.write("Hello World!\n");
writeStream.write("This is a test file.\n");
writeStream.write("Writing data using streams in Node.js.\n");

writeStream.end();

writeStream.on("finish", () => {
    console.log("All data has been written to output.txt");
})