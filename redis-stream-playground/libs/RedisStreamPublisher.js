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

  async addToStream(topic, payload) {
    // * -> auto generate ID
    return new Promise((resolve, reject) => {
      redisClient.xadd(
        topic,
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
