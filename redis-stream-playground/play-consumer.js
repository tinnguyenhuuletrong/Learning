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
  const ins = new RedisStreamSubscriber(redisClient, topic);
  ins.start();
  ins.on("data", console.log);
  global.subcribles[topic] = ins;
}
console.log('call subcrible("userEvents")');
main();
