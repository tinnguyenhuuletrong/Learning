const express = require("express");
const ws = require("ws");
const { uuid } = require("uuidv4");
const jsonrpc = require("jsonrpc-lite");

const app = express();
const activeWsDb = new Map();
const activeRooms = new Map();

function pluginHeartbeat(wss) {
  const noop = () => {};
  const interval = setInterval(() => {
    wss.clients.forEach(function each(ws) {
      if (ws.isAlive === false) return ws.terminate();

      ws.isAlive = false;
      ws.ping(noop);
    });
  }, 30000);

  wsServer.on("close", () => clearInterval(interval));
}

function debugRoom(event, roomInfo) {
  console.log(`room ${event}`, {
    roomId: roomInfo.id,
    ids: roomInfo.sockets.map((itm) => itm.id),
  });
}

class RoomInfo {
  constructor(id) {
    this.id = id;
    this.sockets = [];
  }

  toObj() {
    const { id, sockets } = this;
    return {
      roomId: id,
      ids: sockets.map((itm) => itm.id),
    };
  }

  isIncludeSocket(ws) {
    const { sockets } = this;
    return !!sockets.find((itm) => itm.id === ws.id);
  }

  broadcast(msg, excludeIds = []) {
    const { sockets } = this;
    sockets.forEach((ws) => {
      if (excludeIds.includes(ws.id)) return;
      ws.send(msg);
    });
  }

  isFull() {
    const { sockets } = this;
    return sockets.length === 2;
  }
}

function addSocketToRoom(roomId, ws) {
  let roomInfo = activeRooms.get(roomId);
  if (!roomInfo) {
    roomInfo = new RoomInfo(roomId);
    debugRoom("create", roomInfo);
  }

  if (roomInfo.sockets.length === 2) {
    throw new Error("room full");
  }

  const hasExists = !!roomInfo.sockets.find((itm) => itm.id === ws.id);
  if (hasExists) throw new Error("already joined");

  roomInfo.sockets.push(ws);
  activeRooms.set(roomId, roomInfo);
  debugRoom("join", roomInfo);

  roomInfo.broadcast(
    jsonrpc
      .notification("room-info", { isReady: roomInfo.isFull() })
      .serialize()
  );
  return;
}

function removeSocketFromRoom(roomId, ws) {
  const roomInfo = activeRooms.get(roomId);
  if (!roomInfo) throw new Error("room not found");
  roomInfo.sockets = roomInfo.sockets.filter((itm) => itm.id !== ws.id);
  ws.roomId = undefined;
  debugRoom("leave", roomInfo);

  roomInfo.broadcast(
    jsonrpc
      .notification("room-info", { isReady: roomInfo.isFull() })
      .serialize()
  );

  if (roomInfo.sockets.length === 0) {
    activeRooms.delete(roomId);
    debugRoom("delete", roomInfo);
  }
}

const wsServer = new ws.Server({ noServer: true });
pluginHeartbeat(wsServer);
wsServer.on("connection", async (ws) => {
  try {
    ws.id = uuid();
    ws.isAlive = true;
    activeWsDb.set(ws.id, ws);

    console.log("connection open ", ws.id);
    ws.send(
      jsonrpc
        .notification("connection-info", {
          id: ws.id,
        })
        .serialize()
    );

    ws.on("pong", () => {
      ws.isAlive = true;
    });

    ws.on("message", async (msg) => {
      const rpcMsg = jsonrpc.parse(msg);
      try {
        if (rpcMsg.type !== "request") throw new Error("wrong msg format");
        console.log(rpcMsg);
        const { method, params, id: msgId } = rpcMsg.payload;
        switch (method) {
          case "join":
            {
              const { roomId } = params;
              addSocketToRoom(roomId, ws);
              ws.roomId = roomId;
              ws.send(jsonrpc.success(msgId, "OK").serialize());
            }
            break;

          case "send":
            {
              const { roomId, data = {} } = params;
              const roomInfo = activeRooms.get(roomId);
              if (!roomInfo) throw new Error("room not found");
              if (!roomInfo.isIncludeSocket(ws))
                throw new Error("permission error");

              roomInfo.broadcast(
                jsonrpc
                  .notification("peer-info", { from: ws.id, data })
                  .serialize(),
                [ws.id]
              );
              ws.send(jsonrpc.success(msgId, "OK").serialize());
            }
            break;
          default:
            break;
        }
      } catch (error) {
        console.error(error);
        ws.send(
          jsonrpc
            .error(
              rpcMsg.payload.id,
              new jsonrpc.JsonRpcError(error.message, error.code || 1)
            )
            .serialize()
        );
      }
    });

    ws.on("close", () => {
      activeWsDb.delete(ws.id);
      ws.roomId && removeSocketFromRoom(ws.roomId, ws);
      console.log("connection close ", ws.id);
    });
  } catch (error) {
    console.error(error);
  }
});
app.use("/static", express.static("./public"));
app.use("/", (req, res) => res.json({ ok: 1 }));

// Bind to express
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT);
server.on("upgrade", (request, socket, head) => {
  wsServer.handleUpgrade(request, socket, head, (socket) => {
    wsServer.emit("connection", socket, request);
  });
});

server.on("listening", () => {
  console.log("server started at ", PORT);
});
