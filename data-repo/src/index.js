const Repo = require("./Repo");
const RepoRemote = require("./RepoRemote");
const PubSub = require("./PubSub");
const RpcClient = require("./RpcClient");
const MemoryStorage = require("./storages/MemoryStore");
const FileStore = require("./storages/FileStore");

let _redisClient;
async function start(redisClient) {
  _redisClient = redisClient;
  await PubSub.start(redisClient);
}

async function stop() {
  await PubSub.stop();
}

async function createDataRepo({ topic, dataSource }) {
  return new Repo(_redisClient, topic, dataSource);
}

async function createDataRepoRemote({ topic, dataStore }) {
  return new RepoRemote(_redisClient, topic, dataStore);
}

async function createRpcClient() {
  return new RpcClient();
}

module.exports = {
  start,
  stop,
  createDataRepo,
  createRpcClient,
  createDataRepoRemote,

  storages: { MemoryStorage, FileStore },
};
