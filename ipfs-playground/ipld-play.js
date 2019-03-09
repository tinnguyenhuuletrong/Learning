const util = require('util')
const Ipld = require('ipld')
const CID = require('cids')
const IpfsRepo = require('ipfs-repo')
const inMemory = require('ipld-in-memory')
const pull = require('pull-stream')
const IpfsBlockService = require('ipfs-block-service')

const initIpld = (ipfsRepoPath, callback) => {
  const repo = new IpfsRepo(ipfsRepoPath)
  repo.init({}, err => {
    if (err) {
      return callback(err)
    }
    repo.open(err => {
      if (err) {
        return callback(err)
      }
      const blockService = new IpfsBlockService(repo)
      const ipld = new Ipld({ blockService: blockService })
      return callback(null, ipld)
    })
  })
}

const initInMemory = callback => {
  inMemory(Ipld, callback)
}

// initIpld('./tmp/ifpsrepo', start)
initInMemory(start)

async function start(err, ipld) {
  const putAsync = util.promisify(ipld.put.bind(ipld))
  const getAsync = util.promisify(ipld.get.bind(ipld))
  const readFileAsync = util.promisify(require('fs').readFile)

  const node1Data = { a: 1, b: 2, person: { name: 'ttin' } }
  const cid1 = await putAsync(node1Data, { format: 'dag-cbor' })

  const node2Data = { ref: cid1 }
  const cid2 = await putAsync(node2Data, { format: 'dag-cbor' })

  console.log('node1', node1Data, cid1.toBaseEncodedString())
  console.log('node2', { ref: `<node1>` }, cid2.toBaseEncodedString())

  const queryContent = await getAsync(
    new CID('zdpuArGqnMwdoL2VexpDknBa2LZjSvYR3n5HZY7LCc8bDw7PN'),
    '/ref/person',
    {
      format: 'dag-cbor'
    }
  )
  console.log('cid2/ref/a', queryContent)

  const content = await readFileAsync('./longText.txt')
  const cid3 = await putAsync(content, { format: 'raw' })
  pull(
    ipld.getStream(cid3),
    pull.collect(function(err, array) {
      const node = array[0]
      // console.log(node.value.toString())
    })
  )
}
