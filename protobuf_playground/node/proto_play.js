const { messasing } = require('./protoGenerated')

async function main() {
  const { AwesomeMessage, PingBody, PongBody } = messasing
  const ins = new AwesomeMessage({
    type: messasing.MSG_TYPE.PING,
    id: 1,
    pingBody: PingBody.fromObject({ nounce: 99 }),
    createdAt: Date.now()
  })
  ins.extra = { a: { type_url: 'string', value: Buffer.from('something') } }

  const buffer = AwesomeMessage.encode(ins).finish()
  console.log('encode', buffer.toString('base64'))
  console.log('decode', AwesomeMessage.decode(buffer).toJSON())
}

main()
