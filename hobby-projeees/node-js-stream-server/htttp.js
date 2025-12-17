const http = require("http");
const server = http.createServer();

server.on("request", (req, res) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Hello, this is a streaming server!\n");
});

server.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
