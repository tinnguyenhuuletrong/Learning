const { inspect } = require('util')
const path = require('path')
const grpc = require('grpc')
const protoLoader = require('@grpc/proto-loader')

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function runSayHello(client, user) {
  client.sayHello({ name: user }, function(err, response) {
    console.log('Greeting:', response.message)
  })
}

function runSayHelloDelay(client, user) {
  client.sayHelloDelay({ name: user, delay: 2000 }, function(err, response) {
    console.log('Greeting:', response.message)
  })
}

function runSayHelloCrash(client, user) {
  client.sayHelloCrash({ name: user }, function(err, response) {
    console.log('Greeting:', err, response)
  })
}

function runServerCountToStream(client) {
  const stream = client.countTo({ from: 1, to: 10, interval: 1000 })
  stream.on('data', response => {
    console.log('[Output Stream] Progress:', response.message)
  })
  stream.on('end', _ => {
    console.log('[Output Stream] Completed')
  })
}

function runSumAllClientStream(client) {
  const totals = getRandomInt(10, 20)
  const intervalMs = 200
  let ticket

  console.log(`sumAll. Total samples: ${totals} update every ${intervalMs} ms`)
  const inputStream = client.sumAll((error, response) => {
    console.log('[Input Stream] end: ', error, response)
    clearInterval(ticket)
  })

  let progress = 0
  ticket = setInterval(_ => {
    if (progress >= totals) {
      inputStream.end()
      return clearInterval(ticket)
    }

    progress++
    const value = getRandomInt(10, 20)
    console.log(
      '[Input Stream] update: ',
      value,
      `progress ${progress}/${totals}`
    )
    inputStream.write({ value })
  }, intervalMs)
}

const PROTO_PATH = path.join(__dirname, 'helloworld.proto')
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
})
const hello_proto = grpc.loadPackageDefinition(packageDefinition).helloworld

function main() {
  const client = new hello_proto.Greeter(
    'localhost:50051',
    grpc.credentials.createInsecure()
  )
  var user
  if (process.argv.length >= 3) {
    user = process.argv[2]
  } else {
    user = 'world'
  }
  console.log(
    inspect(hello_proto.Greeter.service, { depth: null, colors: true })
  )

  // Basic
  // runSayHello(client, user)
  // runSayHelloDelay(client, user)
  // runSayHelloCrash(client, user)

  // Server Stream
  // runServerCountToStream(client)

  // Client Stream
  runSumAllClientStream(client)
}

main()
