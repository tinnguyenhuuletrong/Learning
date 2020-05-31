const isFunction = require("lodash.isfunction");
const RpcClient = require("./RpcClient");
const RedisStreamSubscriber = require("./RedisStreamSubscriber");

class RepoRemote {
  constructor(redisClient, topic, dataStorage = {}) {
    this.redisClient = redisClient;

    this.topic = topic;
    this.dataStorage = dataStorage;

    this._validateDataStorage();
    this.rpcClient = new RpcClient();
  }

  async start() {
    await this._restore();
    await this.stream.start();
  }
  async stop() {
    await this.stream.stop();
    this.stream.off("data", this._onSyncData);
    this.stream.off("tail", this._onSyncTail);
  }

  _validateDataStorage() {
    const missingFunc = [];

    [
      "getStreamHead",
      "setStreamHead",
      "clear",
      "batchCreateItems",
      "createItem",
      "updateItem",
      "deleteItem",
    ].forEach((key) => {
      if (!isFunction(this.dataStorage[key])) missingFunc.push(key);
    });

    if (missingFunc.length > 0)
      throw new Error(`DataStorage missing function ${missingFunc.join(",")}`);
  }

  async _restore() {
    const { redisClient, topic, dataStorage } = this;
    const streamHead = await dataStorage.getStreamHead();

    let fromId = "latest";
    if (!streamHead) {
      await dataStorage.clear();
      await this._scynAll();
    } else {
      fromId = streamHead;
    }

    this.stream = new RedisStreamSubscriber(redisClient, topic, {
      fromId,
      pullBlockMs: 1,
      pullIntervalMs: 100,
    });

    this.stream.on("data", this._onSyncData);
    this.stream.on("tail", this._onSyncTail);
  }

  async _scynAll() {
    const { dataStorage } = this;
    const topics = this.getRpcTopic();
    const res = await this.rpcClient.request({
      ...topics,
      msg: {
        cmd: "find",
        query: {},
      },
    });

    if (res.status !== "success")
      throw new Error(`[RepoRemote] syncAll error ${res.error}`);

    const items = res.data || [];
    await dataStorage.batchCreateItems(items);
  }

  _onSyncTail = async (streamHead) => {
    const { dataStorage } = this;
    await dataStorage.setStreamHead(streamHead);
  };

  _onSyncData = async (dataArr) => {
    const { dataStorage } = this;
    try {
      const topicInfo = dataArr[0];
      const { events } = topicInfo;

      for (const ev of events) {
        const body = JSON.parse(ev.payload);
        const { evt, payload } = body;

        switch (evt) {
          case "created":
            await dataStorage.createItem(payload);
            break;
          case "updated":
            await dataStorage.updateItem(payload);
            break;
          case "deleted":
            await dataStorage.deleteItem(payload);
            break;
          default:
            break;
        }
      }
    } catch (error) {
      console.error("[RepoRemote] syncData error", error);
    }
  };

  getRpcTopic() {
    const { topic } = this;
    const reqTopic = `${topic}:rpc:request`;
    const resTopic = `${topic}:rpc:response`;
    return {
      reqTopic,
      resTopic,
    };
  }
}

module.exports = RepoRemote;
