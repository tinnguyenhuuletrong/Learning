const { promisify } = require("util");
const EventEmitter = require("events");

let redisClient;
let sub;
const globalEventObj = new EventEmitter();

module.exports = {
  sub: async function (topic, callback) {
    await sub.subscribeAsync(topic);
    globalEventObj.on(topic, callback);
  },
  unSub: async function (topic, callback) {
    await sub.unsubscribeAsync(topic);
    globalEventObj.off(topic, callback);
  },
  count: async function (topic) {
    return new Promise((resolve, reject) => {
      redisClient.pubsub("numsub", topic, function (err, res) {
        if (err) return reject(err);
        resolve(res[1]);
      });
    });
  },

  pub: async function (topic, payload) {
    return new Promise((resolve, reject) => {
      if (typeof payload !== "string") {
        throw new Error("[Event] data must type string");
      }
      redisClient.publish(topic, payload, function (err, res) {
        if (err) return reject(err);
        resolve(Boolean(res));
      });
    });
  },

  async start(client) {
    redisClient = client;
    sub = redisClient.duplicate();

    sub.subscribeAsync = promisify(sub.subscribe).bind(sub);
    sub.unsubscribeAsync = promisify(sub.unsubscribe).bind(sub);

    sub.on("error", function () {
      console.error("redis-error");
    });
    sub.on("message", function (channel, message) {
      const topic = channel;
      globalEventObj.emit(topic, JSON.parse(message));
    });
  },

  async stop() {
    if (sub) {
      sub.quit();
    }
  },
};
