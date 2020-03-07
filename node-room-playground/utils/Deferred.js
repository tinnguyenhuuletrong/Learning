class Deferred {
  constructor() {
    this.reset()
  }

  reset() {
    this.promise = new Promise((resolve, reject) => {
      this.reject = reject
      this.resolve = resolve
    })
  }
}
module.exports = Deferred
