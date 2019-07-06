const { Readable, Writable } = require('stream')

const createCounterReader = () => {
  let count = 0
  return new Readable({
    objectMode: true,
    read() {
      count += 1
      console.log('\t reading:', count)
      this.push(count)
    }
  })
}

const counterReader = createCounterReader()

const logWriter = new Writable({
  highWaterMark: 5,
  objectMode: true,
  write: (chunk, _, done) => {
    setTimeout(() => {
      console.log('writing:', chunk)
      done()
    }, 100)
  }
})

// Pipe
counterReader.pipe(logWriter)
