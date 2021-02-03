const vm = require('vm')

const script = new vm.Script(`
x = 0

function inc() {x++}
function log() {logger(x)}
`)
const cacheData = script.createCachedData()

const contexts = [
  {
    logger: console.log,
  },
  { logger: console.log },
  { logger: console.log },
]
contexts.forEach((context) => {
  script.runInNewContext(context)
})

contexts[0].inc()
console.log(contexts)

/*
[
  {
    logger: [Function: log],
    inc: [Function: inc],
    log: [Function: log],
    x: 1
  },
  {
    logger: [Function: log],
    inc: [Function: inc],
    log: [Function: log],
    x: 0
  },
  {
    logger: [Function: log],
    inc: [Function: inc],
    log: [Function: log],
    x: 0
  }
]
*/
