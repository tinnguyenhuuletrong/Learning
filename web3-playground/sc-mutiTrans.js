var Web3 = require('web3');
var net = require('net');
const deployInfo = {
    address: '0x44198d209d0cf4aebd28752760da870adae1d6e5'
}
const abi = require('./deploy/inc.abi.json')

const HttpProviderUrl = 'https://rinkeby.infura.io/GM5nJcgmyLduHVd0yuxy'
// const WsProvider = new Web3.providers.WebsocketProvider('wss://rinkeby.infura.io/ws')

// local start command: geth --rinkeby --rpc --ws --wsorigins="*"
// const localWsProvider = new Web3.providers.WebsocketProvider('ws://localhost:8546')
// const localIpcProvider = new Web3.providers.IpcProvider('/Users/tinnguyen/Library/Ethereum/rinkeby/geth.ipc', net)

var web3 = new Web3(HttpProviderUrl);

const YELLOW = '\x1b[33m%s\x1b[0m'
const GREEN = '\x1b[32m%s\x1b[0m'
console.log(YELLOW, '[Deploy Info]', deployInfo)

var myContract = new web3.eth.Contract(abi, deployInfo.address);
const owner = '0x1830c900bad94334ae3179672c034b46b2587e44'
const privateKey = '0xc08e7ef30486140e7469737cdce171f207444323096fbb64af7c84b2c4a397c0'

async function signAndSendTransaction(methodRawData, onTxHash = () => { }) {
    const to = deployInfo.address;
    const gas = 200003;
    const data = methodRawData;


    const txCount = await web3.eth.getTransactionCount(owner, 'pending');

    console.log(YELLOW, txCount)

    const tx = {
        to,
        data,
        gas,
        nonce: txCount
    }

    return new Promise(async (resolve, reject) => {
        const returnSignature = await web3.eth.accounts.signTransaction(tx, privateKey)
        const { rawTransaction } = returnSignature;
        console.log(returnSignature)
        const receipt = web3.eth.sendSignedTransaction(rawTransaction);
        receipt.once('receipt', function (hash) {
           
        })
        receipt.once('transactionHash', function (hash) {
            console.log(YELLOW, '[receipt]', hash)
            onTxHash(hash)
            resolve()
        })
    });
}

// Required sign trans
async function inc(val) {
    const methodRawData = myContract.methods.inc().encodeABI()
    const confirmation = await signAndSendTransaction(methodRawData, (hash) => {
        console.log(GREEN, 'inc - txHash', hash)
    });
    console.log(GREEN, 'inc', confirmation);
}

async function main(params) {

    for (let i = 0; i < 10; i++) {
        await inc()
    }
}

main()