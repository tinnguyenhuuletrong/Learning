const PubSub = require("./PubSub");

class RpcClient {
  constructor() {
    this.reqId = 0;
  }

  async request({ msg, reqTopic, resTopic }) {
    const reqId = this.reqId++;
    return new Promise(async (resolve, reject) => {
      const handler = (data) => {
        if (data.requestId !== reqId) return;
        PubSub.unSub(resTopic, handler);
        resolve(data);
      };
      await PubSub.sub(resTopic, handler);
      await PubSub.pub(reqTopic, JSON.stringify({ requestId: reqId, ...msg }));
    });
  }
}

module.exports = RpcClient;
