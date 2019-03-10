const IPFS = require('ipfs')
const node = new IPFS({ repo: './tmp/ipfsData' })

node.on('ready', async () => {
  const version = await node.version()

  console.log('Version:', version.version)

  const filesAdded = await node.add({
    path: 'hello.txt',
    content: Buffer.from('Hello World 101 from TTin')
  })
  console.log('Added file:', filesAdded[0].path, filesAdded[0].hash)

  const fileBuffer = await node.cat(filesAdded[0].hash)
  console.log('Added file contents:', fileBuffer.toString())
})
