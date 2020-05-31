const PubSub = require("./PubSub");

class RpcClient {
  constructor() {
    this.reqId = Date.now();
  }

  async request({ msg, reqTopic, resTopic }) {
    const reqId = this.reqId++;
    return new Promise(async (resolve, reject) => {
      const handler = (response) => {
        if (response.requestId !== reqId) return;
        PubSub.unSub(resTopic, handler);
        const { status, data } = response;
        resolve({ status, data });
      };
      await PubSub.sub(resTopic, handler);
      await PubSub.pub(reqTopic, JSON.stringify({ requestId: reqId, ...msg }));
    });
  }
}

module.exports = RpcClient;
