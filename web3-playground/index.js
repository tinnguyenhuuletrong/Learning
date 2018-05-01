var Web3 = require('web3');

const HttpProviderUrl = 'https://rinkeby.infura.io/GM5nJcgmyLduHVd0yuxy'
const WsProvider = new Web3.providers.WebsocketProvider('wss://rinkeby.infura.io/ws')
var web3 = new Web3(WsProvider);

async function queryInfo() {
    const lastBlock = await web3.eth.getBlockNumber();
    console.log("lastBlock: ", lastBlock)

    const getProtocolVersion = await web3.eth.getProtocolVersion();
    console.log("protocolVersion: ", hashRate)

    const gasPrice = await web3.eth.getGasPrice();
    console.log("getGasPrice: ", gasPrice)
}

async function queryBlockInfo(blockNum) {
    const info = await web3.eth.getBlock(blockNum, true);
    console.log(`queryBlockInfo ${blockNum}: `, JSON.stringify(info))
    return info
}

async function queryTransactionInfo(txHash) {
    const info = await web3.eth.getTransaction(txHash);
    console.log(`tx info ${txHash}: `, info)
    return info;
}

async function queryTransactionReceipt(txHash) {
    const info = await web3.eth.getTransactionReceipt(txHash);
    console.log(`tx receipt ${txHash}: `, info)
    return info;
}

async function queryAddressBalance(addr) {
    const balance = await web3.eth.getBalance(addr);
    console.log(`balance ${addr}: ${balance} Eth`)
    return balance
}

async function queryPassLogs(options = {
    //fromBlock, // hex
    //toBlock, // hex
    //address,
    //topics
}) {
    try {
        const logs = await web3.eth.getPastLogs(options);
        console.log(`logs :`, logs)
    }
    catch (ex) {
        console.log(ex)
    }
}

async function subscribeTopic(name) {
    const topic = await web3.eth.subscribe(name)

    topic.on("data", function (transaction) {
        console.log(transaction);
    });

    return topic;
}

async function subscribeLogs(options = {}) {
    try {
        const topic = await web3.eth.subscribe('logs', options)

        topic.on("data", function (transaction) {
            console.log(transaction);
        });

        return topic;
    } catch (error) {
        console.log(error)
    }
}

// queryBlockInfo(2205747);
// queryAddressBalance('0xb279182d99e65703f0076e4812653aab85fca0f0')
// queryTransactionInfo('0xf1b24f829e7cee3fd3193009c14841f53acb0b4e2755422a0a9b2e041c2b6313');
// queryTransactionReceipt('0xf1b24f829e7cee3fd3193009c14841f53acb0b4e2755422a0a9b2e041c2b6313');

queryPassLogs({
    address: "0xe62d7ec4339d581543da8322889a0e92b5af7617",
    fromBlock: '0x' + Number(2158915).toString(16),
    topics: []
})


// const topic = subscribeTopic('newBlockHeaders'); // pendingTransactions
// topic.then(res => {
//     setTimeout(_ => {
//         console.log('unsub')
//         res.unsubscribe();
//     }, 20000)
// })

// subscribeLogs({
//     address: '0xE62d7Ec4339D581543da8322889a0e92B5aF7617',
//     topics: null,
//     fromBlock: 200
// });