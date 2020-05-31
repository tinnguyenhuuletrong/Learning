const fs = require("fs");
const MemoryStore = require("./MemoryStore");

class FileStore extends MemoryStore {
  constructor(path, options = {}) {
    super(options);
    this._flushInterval = options.flushInterval || 1000;
    this._path = path;
    this._lastHead;

    this._ticket = setInterval(() => {
      this._flushToFile();
    }, this._flushInterval);

    this._loadFromFile();
  }

  async stop() {
    clearInterval(this._ticket);
  }

  _loadFromFile() {
    if (fs.existsSync(this._path)) {
      const savedData = JSON.parse(fs.readFileSync(this._path).toString());
      const { head = 0, items = [] } = savedData;

      this._head = head;
      this._items = items;
    }
  }

  _flushToFile() {
    if (this._head !== this._lastHead) {
      this._lastHead = this._head;
      fs.writeFile(this._path, JSON.stringify(this.toObjects()), () => {});
    }
  }
}

module.exports = FileStore;
