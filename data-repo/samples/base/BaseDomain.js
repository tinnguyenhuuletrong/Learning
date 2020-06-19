const sift = require("sift").default;
const { EventEmitter } = require("events");

class BaseDomain extends EventEmitter {
  constructor() {
    super();
    this.db = {};
  }
  create({ _id, ...others }) {
    const obj = { _id, ...others };
    this.db[_id] = obj;
    this.emit("created", obj);
  }

  update({ _id, ...others }) {
    if (!this.db[_id]) throw new Error(`${_id} not found`);
    const obj = { _id, ...others };
    this.db[_id] = obj;
    this.emit("updated", obj);
  }

  delete({ _id }) {
    if (!this.db[_id]) throw new Error(`${_id} not found`);
    delete this.db[_id];
  }

  async findAsync(query) {
    const dataArr = Object.keys(this.db).map((key) => this.db[key]);
    if (Object.keys(query).length <= 0) return dataArr;
    return dataArr.filter(sift(query));
  }
}

module.exports = BaseDomain;
