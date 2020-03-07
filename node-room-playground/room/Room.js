const Deferred = require("../utils/Deferred");

class Room {
  constructor(id) {
    this.id = id;
    this.ready = new Deferred();
    this.db = { count: 0 };
    this._start();
  }

  async waitForReady() {
    return await this.ready.promise;
  }

  async _start() {
    this.ready.resolve(this);
  }

  async inc(topic = "count", step = 1) {
    await this.waitForReady();
    this.db[topic] = this.getCount(topic) + step;
    return this.db[topic];
  }

  async exeCmd(batchCmds) {
    await this.inc();
    return this.db;
  }

  getCount(topic) {
    return this.db[topic] || 0;
  }
}

module.exports = Room;
