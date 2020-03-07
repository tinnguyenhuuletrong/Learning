const Deferred = require("./Deferred");
const _lockDb = {};

class MemoryMutex {
  constructor(name, ttlMs) {
    this._name = name;
    this._ticket = setTimeout(() => {
      this.unlock();
    }, ttlMs);
  }

  unlock() {
    const name = this._name;
    if (_lockDb[name]) {
      _lockDb[name].resolve();
      delete _lockDb[name];
      clearTimeout(this._ticket);
      // console.log("[MemoryMutex] unlock", name);
    }
  }
}

async function getLock(ins) {
  const name = ins._name;
  if (!_lockDb[name]) {
    const def = new Deferred();
    _lockDb[name] = def;
  } else {
    while (_lockDb[name]) await _lockDb[name].promise;
    const def = new Deferred();
    _lockDb[name] = def;
  }
}

module.exports = {
  createMutex: async function(name, ttlMs) {
    const ins = new MemoryMutex(name, ttlMs);
    await getLock(ins);
    // console.log("[MemoryMutex] lock", name);
    return ins;
  }
};
