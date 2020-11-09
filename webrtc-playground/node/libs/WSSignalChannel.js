const { EventEmitter } = require("events");
const WebSocket = require("ws");

class Deferred {
  constructor() {
    this.reset();
  }

  reset() {
    this.promise = new Promise((resolve, reject) => {
      this.reject = reject;
      this.resolve = resolve;
    });
  }
}

class WSSignalChannel extends EventEmitter {
  constructor(url) {
    super();
    this._initFunc();
    this.url = url;
    this.reset();
  }

  reset() {
    this.unsubcrible();
    this.ws = null;
    this.connectedPromise = new Deferred();
    this.roomReadyPromise = new Deferred();
    this.isAllive = false;
  }

  async connect({ signalRoom, mode }) {
    this.signalRoom = signalRoom;
    this.ws = new WebSocket(this.url);

    this.ws.addEventListener("open", async () => {
      this.isAllive = true;
      await this._doJoinRoom();
      this.connectedPromise.resolve();
    });

    this.ws.addEventListener("message", (msg) => {
      this._onMessage(JSON.parse(msg.data));
    });

    this.ws.addEventListener("close", (msg) => {
      // console.log("closed");
      this.reset();
    });

    return this.connectedPromise.promise;
  }

  disconnect() {
    this.ws && this.isAllive && this.ws.close();
    this.reset();
  }

  send(to, data) {
    if (!this.signalRoom) throw new Error("call connect(..) first");

    // waiting room ready before send
    return this.roomReadyPromise.promise.then(() => {
      this.ws.send(
        JSON.stringify({
          jsonrpc: "2.0",
          id: Date.now().toString(),
          method: "send",
          params: {
            roomId: this.signalRoom,
            data: JSON.stringify(data),
          },
        })
      );
    });
  }

  unsubcrible() {}

  _doJoinRoom() {
    this.ws.send(
      JSON.stringify({
        jsonrpc: "2.0",
        id: Date.now().toString(),
        method: "join",
        params: {
          roomId: this.signalRoom,
        },
      })
    );
  }

  _initFunc() {
    //-------------------------------------------------------//
    //  Event handler
    //-------------------------------------------------------//

    this._onMessage = (snapshot) => {
      const data = snapshot || {};

      const { method, params = {} } = data;
      if (method === "room-info") {
        if (params.isReady) this.roomReadyPromise.resolve();
      } else if (method === "connection-info") {
        this._peerId = params.id;
      } else if (method === "peer-info") {
        this.emit("message", JSON.parse(params.data));
      }

      // console.log(this._peerId, data);
    };
  }
}

module.exports = WSSignalChannel;
