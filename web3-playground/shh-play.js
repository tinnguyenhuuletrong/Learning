var Web3 = require('web3');
var net = require('net');
const deployInfo = require('./deploy/deploy.json')['rinkeby']
const abi = require('./deploy/storage.abi.json')

const HttpProviderUrl = 'https://rinkeby.infura.io/GM5nJcgmyLduHVd0yuxy'
const WsProvider = new Web3.providers.WebsocketProvider('wss://rinkeby.infura.io/ws')

// local start command: geth --rinkeby --rpc --shh --ws --wsorigins="*"
const localWsProvider = new Web3.providers.WebsocketProvider('ws://localhost:8546')
const localIpcProvider = new Web3.providers.IpcProvider('/Users/tinnguyen/Library/Ethereum/rinkeby/geth.ipc', net)

var web3 = new Web3(localIpcProvider);

const YELLOW = '\x1b[33m%s\x1b[0m'
const GREEN = '\x1b[32m%s\x1b[0m'

async function getShhInfo() {
    const res = await web3.shh.getInfo()
    console.log(GREEN, '[getShhInfo]', res)
}


// getShhInfo();
var identities = [];
var subscription = null;

Promise.all([
    web3.shh.newSymKey().then((id) => {identities.push(id);}),
    web3.shh.newKeyPair().then((id) => {identities.push(id);})

]).then(() => {

    // will receive also its own message send, below
    subscription = web3.shh.subscribe("messages", {
        symKeyID: identities[0],
        topics: ['0xffaadd11']
    }).on('data', console.log);

}).then(() => {
   web3.shh.post({
        symKeyID: identities[0], // encrypts using the sym key ID
        sig: identities[1], // signs the message using the keyPair ID
        ttl: 10,
        topic: '0xffaadd11',
        payload: '0xffffffdddddd1122',
        powTime: 3,
        powTarget: 0.5
    }).then(h => console.log(`Message with hash ${h} was successfuly sent`))
    .catch(err => console.log("Error: ", err));
});