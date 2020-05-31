const { EventEmitter } = require("events");
const { promisify } = require("util");
const waitMs = (ms) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });

// -----------------------------------------------------------------//
// RedisStreamSubscriber
// -----------------------------------------------------------------//
class RedisStreamSubscriber extends EventEmitter {
  constructor(
    redisClient,
    topic,
    options = {
      fromId: "latest", // ['latest', 'begin'] | anyId
      pullBlockMs: 10,
      pullIntervalMs: 100,
      pullSize: 100,
    }
  ) {
    super();
    this._redisClient = redisClient;
    this._topic = topic;
    this._tailPullId = options.fromId || "latest";
    this._pullBlockMs = options.pullBlockMs || 10;
    this._pullIntervalMs = options.pullIntervalMs || 100;
    this._pullMaxCount = options.pullSize || 100;
    this._enableDebugLog = Boolean(options.debug);
    this._isRunning = false;
  }

  // ---------------------------------------------------------//
  //  Public
  // ---------------------------------------------------------//
  async start() {
    this._isRunning = true;
    await this.summary();
    await this._onUpdate();
  }

  stop() {
    this._isRunning = false;
  }

  async summary() {
    return new Promise((resolve, reject) => {
      this._redisClient.xinfo("STREAM", this._topic, (err, data) => {
        if (err) return reject(err);

        resolve(this._transformObject(data));
      });
    });
  }

  async count() {
    return new Promise((resolve, reject) => {
      this._redisClient.xlen(this._topic, (err, data) => {
        if (err) return reject(err);

        resolve(data);
      });
    });
  }

  async first() {
    return new Promise((resolve, reject) => {
      this._redisClient.xrange(
        this._topic,
        "-", // From begin
        "+", // To end
        "COUNT",
        1,
        (err, data) => {
          if (err) return reject(err);

          resolve(this._transformEvents(data));
        }
      );
    });
  }

  async last() {
    return new Promise((resolve, reject) => {
      this._redisClient.xrevrange(
        this._topic,
        "+",
        "-",
        "COUNT",
        1,
        (err, data) => {
          if (err) return reject(err);

          resolve(this._transformEvents(data));
        }
      );
    });
  }

  async listFromId(fromId = 0, count = 0) {
    return new Promise((resolve, reject) => {
      this._redisClient.xread(
        "COUNT",
        count, // 0 -> list all
        "STREAMS",
        this._topic,
        fromId, // 0 -> begin
        (err, data) => {
          if (err) return reject(err);

          if (data && Array.isArray(data)) {
            data.forEach((itm) => {
              resolve({
                topic: itm[0],
                events: this._transformEvents(itm[1]),
              });
            });
          }
        }
      );
    });
  }

  // ---------------------------------------------------------//
  //  Private
  // ---------------------------------------------------------//
  _doPull() {
    return new Promise((resolve, reject) => {
      this._redisClient.xread(
        "BLOCK",
        this._pullBlockMs,
        "COUNT",
        5,
        "STREAMS",
        this._topic,
        this._tailPullId, // From lastest
        function (err, data) {
          if (err) return reject(err);
          resolve(data);
        }
      );
    });
  }

  _captureTail(dataArr) {
    const lastData = dataArr[dataArr.length - 1];
    this._tailPullId = lastData.events[lastData.events.length - 1].id;
  }

  async _onUpdate() {
    // Guide here
    // https://redis.io/commands/xread#the-special-codecode-id
    this._debugLog("start pull", this._tailPullId);
    if (this._tailPullId === "latest") {
      const summaryInfo = await this.summary();
      if (summaryInfo && summaryInfo["last-generated-id"]) {
        this._tailPullId = summaryInfo["last-generated-id"];
        this._debugLog("start tail", this._tailPullId);
      }
    } else if (this._tailPullId === "begin") {
      this._tailPullId = 0;
    }
    this._startLoop();
  }

  async _startLoop() {
    while (this._isRunning) {
      const data = await this._doPull();

      if (data && Array.isArray(data)) {
        const dataArr = data.map((itm) => {
          return {
            topic: itm[0],
            events: this._transformEvents(itm[1]),
          };
        });
        this._captureTail(dataArr);
        this._debugLog("update tail", this._tailPullId);
        this.emit("data", dataArr);
        this.emit("tail", this._tailPullId);
      }

      await waitMs(this._pullIntervalMs);
    }
  }

  _transformEvents(arrayLike) {
    if (!arrayLike) return [];
    const res = [];
    // [["id",["payload","{...}"]]]
    // console.log("JSON", JSON.stringify(arrayLike));
    for (let i = 0; i < arrayLike.length; i++) {
      const objLike = arrayLike[i];
      for (let j = 0; j < objLike.length; j++) {
        const id = objLike[j];
        const payload = this._transformObject(objLike[++j]);
        res.push({ id, ...payload });
      }
    }
    return res;
  }

  _transformObject(reply) {
    if (!Array.isArray(reply)) return reply;

    const res = {};
    for (let i = 0; i < reply.length; i++) {
      const key = reply[i];
      const val = reply[++i];
      res[key] = this._transformObject(val);
    }
    return res;
  }

  _debugLog() {
    if (!this._enableDebugLog) return;
    console.log("[RedisStreamSubscriber]", ...arguments);
  }
}

module.exports = RedisStreamSubscriber;
