const PubSub = require("./PubSub");

const noopFunc = () => ({});
class RpcServer {
  constructor(topic, { requestHandlerAsync }) {
    this.topic = topic;
    this.requestHandlerAsync = requestHandlerAsync || noopFunc;
  }

  async start() {
    await this._initRPCChannel();
  }

  async stop() {
    await this._stopRPCChannel();
  }

  getRpcTopic() {
    const { topic } = this;
    const reqTopic = `${topic}:rpc:request`;
    const resTopic = `${topic}:rpc:response`;
    return {
      reqTopic,
      resTopic,
    };
  }

  async _initRPCChannel() {
    const { reqTopic } = this.getRpcTopic();
    await PubSub.sub(reqTopic, this._onRpcRequest);
  }
  async _stopRPCChannel() {
    const { reqTopic } = this.getRpcTopic();
    await PubSub.unSub(reqTopic, this._onRpcRequest);
  }

  async _rpcResponse(data) {
    const { resTopic } = this.getRpcTopic();
    await PubSub.pub(resTopic, JSON.stringify(data));
  }

  _onRpcRequest = async (data) => {
    const { requestHandlerAsync } = this;
    const res = await requestHandlerAsync(data);
    this._rpcResponse({ ...res, requestId: data.requestId });
  };
}

module.exports = RpcServer;
