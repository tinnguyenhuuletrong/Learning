const { REDIS_URL } = process.env;

var Redis = require("ioredis");
const Queue = require("bull");

const client = new Redis(REDIS_URL);
const subscriber = new Redis(REDIS_URL);

const opts = {
  createClient: function(type) {
    switch (type) {
      case "client":
        return client;
      case "subscriber":
        return subscriber;
      default:
        return new Redis(REDIS_URL);
    }
  }
};

module.exports = {
  createQueue: (name, options) => {
    return new Queue(name, { ...opts, ...options });
  },
  getQueueList: async name => {
    const queueNameRegExp = new RegExp("(.*):(.*):id");
    const keys = await client.keys("*:*:id");
    return keys.map(function(key) {
      const match = queueNameRegExp.exec(key);
      if (match) {
        return {
          prefix: match[1],
          name: match[2]
        };
      }
    });
  }
};
