const redis = require("redis");
const vorpal = require("vorpal")();

const DataRepo = require("../../src");
const REDIS_URI = process.env.REDIS_URI || "redis://127.0.0.1:6379";

async function waitForConnect(client) {
  return new Promise((resolve, reject) => {
    client.once("connect", () => resolve(client));
    client.once("error", () => reject());
  });
}

class App {
  constructor(name) {
    this.appName = name;
    this.dbDataRepo = {};
    this.dbDataRemoteRepo = {};
  }

  _basicCommand() {}

  showCLI() {
    vorpal.history(this.appName).delimiter(this.appName).show();
  }

  async start() {
    const { dbDataRepo } = this;
    this.redisClient = redis.createClient(REDIS_URI);
    await waitForConnect(this.redisClient);
    await DataRepo.start(this.redisClient);

    this._basicCommand();
  }

  async addDataRepo(repoName, dataRepoIns) {
    this.dbDataRepo[repoName] = dataRepoIns;
    await dataRepoIns.start();
  }

  async addRemoteDataRepo(repoName, dataRepoRemoteIns) {
    this.dbDataRemoteRepo[repoName] = dataRepoRemoteIns;
  }

  getVorpal() {
    return vorpal;
  }

  async stop() {
    this.redisClient.end(true);
    await DataRepo.stop();
  }
}

module.exports = App;
