var Web3 = require('web3');
var net = require('net');
const deployInfo = require('./deploy/deploy.json')['rinkeby']
const abi = require('./deploy/storage.abi.json')

const HttpProviderUrl = 'https://rinkeby.infura.io/GM5nJcgmyLduHVd0yuxy'
const WsProvider = new Web3.providers.WebsocketProvider('wss://rinkeby.infura.io/ws')

// local start command: geth --rinkeby --rpc --ws --wsorigins="*"
const localWsProvider = new Web3.providers.WebsocketProvider('ws://localhost:8546')
const localIpcProvider = new Web3.providers.IpcProvider('/Users/tinnguyen/Library/Ethereum/rinkeby/geth.ipc', net)

var web3 = new Web3(WsProvider);

const YELLOW = '\x1b[33m%s\x1b[0m'
const GREEN = '\x1b[32m%s\x1b[0m'
console.log(YELLOW, '[Deploy Info]', deployInfo)

var myContract = new web3.eth.Contract(abi, deployInfo.address);
const owner = '0x1830c900bad94334ae3179672c034b46b2587e44'
const privateKey = '0x12A4E9FBD0F84A5FED58D19CC24F0BCD4168181417FDE328E653F5CB6C1EA23D'

async function queryAbiPos0() {
    const res = await myContract.methods.getPos0().call()
    console.log(GREEN, '[queryAbiPos0]', res)
}

async function queryAbiPos1() {
    const res = await myContract.methods.getPos1().call({ from: owner })
    console.log(GREEN, '[queryAbiPos1]', res)
}

async function queryNativePos0(blockNum = "latest") {
    const res = await web3.eth.getStorageAt(deployInfo.address, 0, blockNum)
    const num = web3.utils.hexToNumber(res)
    console.log(GREEN, '[queryNativePos0]', num)
}

// https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_getstorageat
async function queryNativePos1(blockNum = "latest") {
    const key = web3.utils.padLeft(owner, 64)
    const offset = web3.utils.padLeft(1, 64)

    const finalPos = web3.utils.soliditySha3(key, offset)

    const res = await web3.eth.getStorageAt(deployInfo.address, finalPos, blockNum)
    const num = web3.utils.hexToNumber(res)

    console.log("key", key)
    console.log("offset", offset)
    console.log("finalPos", finalPos)

    console.log(GREEN, '[queryNativePos1]', num)

}

async function signAndSendTransaction(methodRawData, onTxHash = () => { }) {
    const to = deployInfo.address;
    const gas = 200000;
    const data = methodRawData;

    const tx = {
        to,
        data,
        gas
    }

    const returnSignature = await web3.eth.accounts.signTransaction(tx, privateKey)
    console.log(returnSignature)
    const { rawTransaction } = returnSignature;
    const receipt = web3.eth.sendSignedTransaction(rawTransaction);
    receipt.on('transactionHash', function (hash) {
        onTxHash(hash)
    })
    return await receipt;
}

// Required sign trans
async function exeSetPos0(val) {
    const methodRawData = myContract.methods.setVal(val).encodeABI()
    const confirmation = await signAndSendTransaction(methodRawData, (hash) => {
        console.log(GREEN, 'exeSetPos0 - txHash', hash)
    });
    console.log(GREEN, 'exeSetPos0', confirmation);
}

// ------------------------------
// History Pos-0:
//      Block (2259965): 10
//      Block (2259972): 9000
//      Block (2259972): 9000
//      Block (2259976): 8
//      Block (2260004): 2017

// queryAbiPos0()
// queryNativePos0(2260004)

// queryAbiPos1()
// queryNativePos1()

// exeSetPos0(2017)