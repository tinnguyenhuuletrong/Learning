var Web3 = require('web3')
var net = require('net')

// docker run -it -p 8545:8545 -p 8546:8546 -p 8547:8547 -p 30303:30303 ethereum/client-go --shh --ws --nousb
const localWsProvider = new Web3.providers.WebsocketProvider(
  'ws://127.0.0.1:8546'
)

var web3 = new Web3(localWsProvider)

const YELLOW = '\x1b[33m%s\x1b[0m'
const GREEN = '\x1b[32m%s\x1b[0m'

async function getShhInfo() {
  try {
    const res = await web3.shh.getInfo()
    console.log(GREEN, '[getShhInfo]', res)
  } catch (error) {
    console.log('Error', error)
  }
}

ACC = {
  acc1: {
    symKey: {
      symKeyPass: 'acc1',
      raw: '0xe0a0f2cd2110bddbb38657d9538850b7d1cb98c721687f2b9d2fc97c6d8fb66d'
    },
    pairKey: {
      pubKey:
        '0x04081cd8eb6353220ae669abb0bdb5c0d607edcab1aa4971471cae5fb5376dff1790275dea94927e56f0578ace7e2508dac57297af29cc134959ee51c050b34e5d',
      privKey:
        '0x4ce5b7e2c398dc19f86d526c78c1580e3682e297728c12f9664a3e41fd17f707'
    }
  },
  acc2: {
    symKey: {
      symKeyPass: 'acc2',
      raw: '0xe92549923f114ebea7361647c32f29e3ecbe1840b220504cb27ff5c23e8e64d4'
    },
    pairKey: {
      pubKey:
        '0x0412c111acd2ad1c4f4c86b959ac411c65ebb6cc619f3545547843a1c272e3173bec52c9fba72362ad5e6aa334405edaa0b1ba098519d63b59ebca69fa1fb7a500',
      privKey:
        '0x0f73df0df020070e2b469e435969506bc4c4ee1e800b4b33bf2a17458bfcc9e1'
    }
  }
}

// async function loadAcc({ symKey, pairKey }) {
//   const symKeyId = await web3.shh.addSymKey(symKey.raw)
//   const pairKeyId = await web3.shh.addPrivateKey(pairKey.privKey)

//   console.log(symKeyId, pairKeyId)

//   web3.shh.sub
// }
// loadAcc(ACC.acc1)

const identities = []
Promise.all([
  web3.shh.addSymKey(ACC.acc1.symKey.raw).then(id => {
    identities.push(id)
  }),
  web3.shh.addPrivateKey(ACC.acc1.pairKey.privKey).then(id => {
    identities.push(id)
  })
])
  .then(() => {
    console.log('identities', identities)
    //   will receive also its own message send, below
    const subscription = web3.shh
      .subscribe('messages', {
        symKeyID: identities[0],
        topics: ['0xffaadd11']
      })
      .on('data', e => console.log('DATA', e))
  })
  .then(() => {
    web3.shh
      .post({
        symKeyID: identities[0], // encrypts using the sym key ID
        sig: identities[1], // signs the message using the keyPair ID
        ttl: 10,
        topic: '0xffaadd11',
        payload: `0x${Buffer.from('tintatoi').toString('hex')}`,
        powTime: 3,
        powTarget: 0.5
      })
      .then(hash =>
        console.log(`Message with hash ${hash} was successfuly sent`)
      )
      .catch(err => console.log('Error: ', err))
  })
