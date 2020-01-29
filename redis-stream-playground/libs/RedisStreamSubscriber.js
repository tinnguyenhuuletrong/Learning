const { EventEmitter } = require("events");
const { promisify } = require("util");

const waitMs = promisify(setTimeout);

//-----------------------------------------------------------------//
// RedisStreamSubscriber
//-----------------------------------------------------------------//
class RedisStreamSubscriber extends EventEmitter {
  constructor(redisClient, topic) {
    super();
    this._redisClient = redisClient;
    this._topic = topic;
    this._isRunning = false;
  }

  //---------------------------------------------------------//
  //  Public
  //---------------------------------------------------------//
  async start() {
    this._isRunning = true;
    setImmediate(() => {
      this._onUpdate();
    });
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
            data.forEach(itm => {
              resolve({
                topic: itm[0],
                events: this._transformEvents(itm[1])
              });
            });
          }
        }
      );
    });
  }

  //---------------------------------------------------------//
  //  Private
  //---------------------------------------------------------//
  _doPull() {
    return new Promise((resolve, reject) => {
      this._redisClient.xread(
        "BLOCK",
        1000,
        "STREAMS",
        this._topic,
        "$", // From lastest
        function(err, data) {
          if (err) return reject(err);
          resolve(data);
        }
      );
    });
  }

  async _onUpdate() {
    while (this._isRunning) {
      const data = await this._doPull();

      if (data && Array.isArray(data)) {
        data.forEach(itm => {
          this.emit("data", {
            topic: itm[0],
            events: this._transformEvents(itm[1])
          });
        });
      }
    }
  }

  _transformEvents(arrayLike) {
    if (!arrayLike) return [];
    const res = [];
    //[["id",["payload","{...}"]]]
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
}

module.exports = RedisStreamSubscriber;
