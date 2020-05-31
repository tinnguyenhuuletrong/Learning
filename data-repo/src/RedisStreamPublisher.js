const { EventEmitter } = require("events");
const { promisify } = require("util");

const waitMs = promisify(setTimeout);

//-----------------------------------------------------------------//
// RedisStreamPublisher
//-----------------------------------------------------------------//
class RedisStreamPublisher {
  constructor(redisClient, topic) {
    this._redisClient = redisClient;
    this._topic = topic;
  }

  //---------------------------------------------------------//
  //  Public
  //---------------------------------------------------------//

  async length() {
    return new Promise((resolve, reject) => {
      this._redisClient.xlen(this._topic, (err, data) => {
        if (err) return reject(err);
        resolve(data);
      });
    });
  }

  async addToStream(payload) {
    // * -> auto generate ID
    return new Promise((resolve, reject) => {
      this._redisClient.xadd(
        this._topic,
        "*",
        "payload",
        JSON.stringify(payload),
        (err, data) => {
          if (err) return reject(err);

          resolve(data);
        }
      );
    });
  }
}

module.exports = RedisStreamPublisher;
