const fs = require("fs");
const http = require("http");
const WebSocket = require("ws");
const { URL } = require("url");
const jsonrpc = require("jsonrpc-lite");

const server = http.createServer();
const wss = new WebSocket.Server({ server });

wss.on("connection", async function connection(ws, req) {
  connectionIncomming(ws, req);
});

/**
 *
 * @param {WebSocket} ws
 * @param {http.IncomingMessage} req
 */
async function connectionIncomming(ws, req) {
  const _onConnectMiddlewares = [doPrintInfo, doAuth];

  ws.on("message", (message) => {
    console.log("received: %s", message);
  });

  ws.on("close", () => {
    console.log("closed");
  });

  try {
    for (const iterator of _onConnectMiddlewares) {
      await iterator(ws, req);
    }

    ws.send(
      jsonrpc
        .notification("status", {
          isConnect: true,
          isAuth: true,
          pingIntervalMs: 1000,
        })
        .serialize()
    );
  } catch (error) {
    console.error(error);
    ws.send(
      jsonrpc
        .notification("status", {
          isConnect: false,
          err: error.message,
        })
        .serialize()
    );

    // Bye
    ws.close(1008, error.message);
  }
}

async function onMessage() {}

/**
 *
 * @param {WebSocket} ws
 * @param {http.IncomingMessage} req
 */
async function doPrintInfo(ws, req) {
  const ip = req.socket.remoteAddress;
  const url = new URL(req.url, `http://${req.headers.host}`);

  req.params = url.searchParams;
  console.log("info", {
    ip,
    params: req.params,
  });
}

/**
 *
 * @param {WebSocket} ws
 * @param {http.IncomingMessage} req
 */
async function doAuth(ws, req) {
  const params = req.params;
  if (!params) throw new Error("Missing Auth info");

  const nounce = params.get("nounce");
  console.log(nounce);

  if (nounce % 2 === 0) return;
  throw new Error("invalid_nounce");
}

server.listen(8080);
