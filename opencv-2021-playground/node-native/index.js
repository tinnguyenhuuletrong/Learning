const { Worker, SHARE_ENV } = require("worker_threads");
const Addon = require("./build/Release/addon.node");

console.log(Addon);

// Addon.cvImgShow("./data/1img.jpg");
Addon.cvVideoShow("/Users/admin/Downloads/money.mp4");
// Webcam
// Addon.cvVideoShow("");
// Addon.cvVideoShow("");

// TCP media server worker
// const work = new Worker(
//   `
// function media_tcp_server(VIDEO_PATH, PORT) {
//   const fs = require("fs");
//   const net = require("net");

//   const server = net.createServer((client) => {
//     // 'connection' listener
//     console.log("client connected");

//     const stream = fs.createReadStream(VIDEO_PATH);
//     stream.pipe(client);

//     client.on("close", () => {
//       console.log("closed");
//     });
//   });

//   server.on("error", (err) => {
//     throw err;
//   });

//   server.listen(PORT, () => {
//     console.log("domain socket bound ", PORT);
//   });

//   function cleanUp() {
//     server.close(function () {
//       console.log("Finished all requests");
//       process.exit(0);
//     });
//   }

//   process.on("SIGTERM", function () {
//     cleanUp();
//   });

//   process.on("SIGINT", function () {
//     cleanUp();
//   });
// }

// media_tcp_server("/Users/admin/Downloads/money.mp4", 3000);
// `,
//   { eval: true }
// );
// work.on("exit", () => {
//   console.log("fin");
// });

// setTimeout(() => {
//   Addon.cvVideoShow("tcp://localhost:3000");
// }, 1000);
