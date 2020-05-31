class MemoryStore {
  constructor(options = {}) {
    this._keyField = options.keyField || "_id";
    this.clear();
  }

  async getStreamHead() {
    return this._head;
  }
  async setStreamHead(val) {
    this._head = val;
  }
  async clear() {
    this._items = {};
    this._head = 0;
  }
  async batchCreateItems(items) {
    for (const iterator of items) {
      this._items[this.getId(iterator)] = iterator;
    }
  }
  async createItem(item) {
    this._items[this.getId(item)] = item;
  }
  async updateItem(item) {
    this._items[this.getId(item)] = item;
  }
  async deleteItem(item) {
    delete this._items[this.getId(item)];
  }

  async findById(id) {
    return this._items[id];
  }

  toObjects() {
    const { _items: items, _head: head } = this;
    return {
      items,
      head: String(head),
    };
  }

  getId(item) {
    return item[this._keyField];
  }
}

module.exports = MemoryStore;
