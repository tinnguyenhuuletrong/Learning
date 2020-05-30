const redis = require("redis");
const RedisStreamSubscriber = require("./libs/RedisStreamSubscriber");
const URI = "redis://127.0.0.1:6379";

/** @type {import('redis').RedisClient}  */
let redisClient;
async function main() {
  redisClient = redis.createClient(URI);
  console.log("connected");
}

global.subcribles = {};
async function subcrible(topic) {
  const ins = new RedisStreamSubscriber(redisClient, topic, {
    fromId: "latest",
    pullIntervalMs: 0,
    pullSize: 100,
    debug: 1,
  });
  ins.start();
  ins.on("data", (data) => console.dir(data, { depth: 100 }));
  global.subcribles[topic] = ins;
}
console.log('call subcrible("userEvents")');
main();
