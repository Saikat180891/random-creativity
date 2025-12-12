const fs = require('fs');
const path = require('path');

const readStream = fs.createReadStream(path.resolve(__dirname, "random_20MB.txt"))
const writeStream = fs.createWriteStream(path.resolve(__dirname, "copy_of_random_20MB.txt"));

readStream.pipe(writeStream);
