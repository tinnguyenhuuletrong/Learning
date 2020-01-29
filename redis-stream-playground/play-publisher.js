const redis = require("redis");
const RedisStreamPublisher = require("./libs/RedisStreamPublisher");

const URI = "redis://127.0.0.1:6379";

/** @type {import('redis').RedisClient}  */
let redisClient, streamPublisher;
async function main() {
  redisClient = redis.createClient(URI);
  console.log("connected");
  streamPublisher = new RedisStreamPublisher(redisClient, "userEvents");
}

async function createUser(userInfo) {
  return streamPublisher.addToStream("userEvents", {
    type: "created",
    data: userInfo
  });
}

async function updateUser(userInfo) {
  return streamPublisher.addToStream("userEvents", {
    type: "updated",
    data: userInfo
  });
}

async function deleteUser(userInfo) {
  return streamPublisher.addToStream("userEvents", {
    type: "deleted",
    data: userInfo
  });
}

main();
