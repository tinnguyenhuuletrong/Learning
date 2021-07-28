const fs = require("fs");
const net = require("net");

const VIDEO_PATH = "/Users/admin/Downloads/money.mp4";
const PORT = 3000;

const server = net.createServer((client) => {
  // 'connection' listener
  console.log("client connected", client);

  const stream = fs.createReadStream(VIDEO_PATH);
  stream.pipe(client);

  client.on("close", () => {
    console.log("closed");
  });
});

server.on("error", (err) => {
  throw err;
});

server.listen(PORT, () => {
  console.log("domain socket bound ", PORT);
});

function cleanUp() {
  server.close(function () {
    console.log("Finished all requests");
    process.exit(0);
  });
}

process.on("SIGTERM", function () {
  cleanUp();
});

process.on("SIGINT", function () {
  cleanUp();
});
