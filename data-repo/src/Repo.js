const isFunction = require("lodash.isfunction");
const RpcServer = require("./RpcServer");
const RedisStreamPublisher = require("./RedisStreamPublisher");

class Repo {
  constructor(redisClient, topic, dataSource = {}) {
    this.redisClient = redisClient;

    this.topic = topic;
    this.dataSource = dataSource;

    this._validateDataSource();
    this.rpcServer = new RpcServer(topic, {
      requestHandlerAsync: this._onRpc,
    });
    this.stream = new RedisStreamPublisher(redisClient, topic);
  }

  _validateDataSource() {
    const { findAsync, on, off } = this.dataSource;
    if (!(isFunction(findAsync) && isFunction(on) && isFunction(off))) {
      throw new Error("DataSource must have functions: findAsync, on, off");
    }
  }

  async _upsertTopic() {
    try {
      const count = await this.stream.length();
      if (count <= 0)
        this.stream.addToStream({
          evt: "seed",
          payload: {},
        });
    } catch (error) {
      console.error(error);
    }
  }

  async start() {
    await this.rpcServer.start();
    await this._upsertTopic();
    this.dataSource.on("created", this._onCreated);
    this.dataSource.on("deleted", this._onDeleted);
    this.dataSource.on("updated", this._onUpdated);
  }
  async stop() {
    await this.rpcServer.stop();
    this.dataSource.off("created", this._onCreated);
    this.dataSource.off("deleted", this._onDeleted);
    this.dataSource.off("updated", this._onUpdated);
  }

  //-----------------------------------------------------------------
  //  Stream Component
  //-----------------------------------------------------------------

  _onCreated = async (obj) => {
    this.stream.addToStream({
      evt: "created",
      payload: obj,
    });
  };
  _onDeleted = async (obj) => {
    this.stream.addToStream({
      evt: "deleted",
      payload: obj,
    });
  };
  _onUpdated = async (obj) => {
    this.stream.addToStream({
      evt: "updated",
      payload: obj,
    });
  };

  //-----------------------------------------------------------------
  //  RPC Component
  //-----------------------------------------------------------------
  _onRpc = async (req) => {
    const { cmd, ...others } = req;
    switch (cmd) {
      case "ping":
        return { status: "success", data: "pong" };
        break;
      case "find":
        {
          try {
            const { query = {} } = others;
            const data = await this.dataSource.findAsync(query);
            return { status: "success", data };
          } catch (error) {
            return { status: "error", error: error.message };
          }
        }
        break;

      default:
        return { status: "error", error: "invalid cmd" };
        break;
    }
  };
}

module.exports = Repo;
