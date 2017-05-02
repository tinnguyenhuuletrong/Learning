class AsyncArray {
  constructor(promise) {
    this.$promise = promise || Promise.resolve();
  }

  then(resolve, reject) {
    return new AsyncArray(this.$promise.then(resolve, reject));
  }

  catch(reject) {
    return this.then(null, reject);
  }

  mapAsync(fn) {
    return this.then(arr => Promise.all(arr.map(fn)));
  }

  filterAsync(fn) {
    return new AsyncArray(Promise.all([this, this.mapAsync(fn)]).then(([arr, _arr]) => arr.filter((v, i) => !!_arr[i])));
  }

  forEachAsync(fn) {
    return this.then(arr => arr.reduce((promise, n, i) => promise.then(() => fn(n, i)), Promise.resolve()));
  }

  reduceAsync(fn, initial) {
    return Promise.resolve(initial).then(cur => {
      return this.forEachAsync((v, i) => {
        return new Promise((resolve, reject) => {
          Promise.resolve(fn(cur, v, i))
            .then(res => {
              cur = res
              resolve();
            })
        })
      })
        .then(() => cur);
    });
  }
}

module.exports = AsyncArray