const { setWorldConstructor } = require('cucumber')

class CustomWorld {
  constructor() {
    this.clear()
  }

  async setTo(number) {
    this.variable = number
  }

  async incrementBy(number) {
    this.variable += number
  }

  async setKey(key, val) {
    this.db[key] = val
  }

  async getKey(key) {
    return this.db[key]
  }

  async clear() {
    this.variable = 0
    this.db = {}
  }
}

setWorldConstructor(CustomWorld)
