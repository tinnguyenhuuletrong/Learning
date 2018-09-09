const { inspect } = require('util')
const path = require('path')
const grpc = require('grpc')
const protoLoader = require('@grpc/proto-loader')

const PROTO_PATH = path.join(__dirname, 'helloworld.proto')
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
})
const hello_proto = grpc.loadPackageDefinition(packageDefinition).helloworld
console.log(inspect(hello_proto, { depth: true }))

function requestActivityLog(tag, ...args) {
  console.log(
    '[request]',
    new Date().toLocaleString(),
    tag,
    inspect(args, { colors: true, depth: null })
  )
}

// --------------------------------------------------------------------
//  Basic
// --------------------------------------------------------------------
function sayHello(call, callback) {
  requestActivityLog('sayHello', call)
  callback(null, { message: 'Hello ' + call.request.name })
}

function sayHelloDelay(call, callback) {
  requestActivityLog('sayHelloDelay', call)
  const { delay = 1000 } = call.request
  setTimeout(() => {
    callback(null, {
      message: `Hello ${call.request.name} after ${delay / 1000}s`
    })
  }, delay)
}

function sayHelloCrash(call, callback) {
  requestActivityLog('sayHelloCrash', call)
  setTimeout(() => {
    callback(new Error('crash'))
  }, 1000)
}

// --------------------------------------------------------------------
//  Stream
// --------------------------------------------------------------------

/**
 * Stream count [from, to]. Count one after interval and
 */
function countTo(call, callback) {
  requestActivityLog('countTo', call)

  const { from, to, interval = 1000 } = call.request
  let count = from
  const ticket = setInterval(_ => {
    if (count >= to) {
      call.end()
      return clearInterval(ticket)
    }
    call.write({ message: `progress ${count}/${to}` })
    count += 1
  }, interval)
}

/**
 * Sum all input stream data
 */
function sumAll(call, callback) {
  requestActivityLog('countTo', call)

  let sum = 0,
    sampleCount = 0,
    beginTime = Date.now()

  call.on('data', request => {
    const { value } = request
    sum += value
    sampleCount += 1
    requestActivityLog('countTo', 'update', value)
  })
  call.on('end', request => {
    const results = {
      sum,
      sampleCount,
      elapsedTime: (Date.now() - beginTime) / 1000
    }
    requestActivityLog('countTo', 'end', results)
    callback(null, results)
  })
}

/**
 * Starts an RPC server that receives requests for the Greeter service at the
 * sample server port
 */
function main() {
  const server = new grpc.Server()
  server.addService(hello_proto.Greeter.service, {
    sayHello,
    sayHelloCrash,
    sayHelloDelay,
    countTo,
    sumAll
  })
  server.bind('0.0.0.0:50051', grpc.ServerCredentials.createInsecure())
  server.start()
}

main()
