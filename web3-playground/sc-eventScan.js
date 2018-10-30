var Web3 = require('web3')
var net = require('net')
var fs = require('fs')
const assert = require('assert')

const abi = require('./deploy/pass.abi.json')

const HttpProviderUrl = 'https://ropsten.infura.io/VDzXYTpyoIcSNDP86lv0'

var web3 = new Web3(HttpProviderUrl)

const YELLOW = '\x1b[33m%s\x1b[0m'
const GREEN = '\x1b[32m%s\x1b[0m'
console.log(YELLOW, abi.contractName, abi.address)

var myContract = new web3.eth.Contract(abi.abi, abi.address)

async function checkWhitelist(address) {
  const res = await myContract.methods.checkUserWhiteList(address).call()
  console.log(res)
}
async function allWhitelistAddr() {
  const AddEvent = 'WhitelistedAddressAdded'
  const RemoveEvent = 'WhitelistedAddressRemoved'

  const whiteListAddEventsFull = await myContract.getPastEvents(AddEvent, {
    fromBlock: 0,
    toBlock: 'latest'
  })

  const whiteListRemoveEventsFull = await myContract.getPastEvents(
    RemoveEvent,
    {
      fromBlock: 0,
      toBlock: 'latest'
    }
  )
  let whiteListRemoveEvents = whiteListRemoveEventsFull.map(
    itm => itm.returnValues.addr
  )

  const addrs = whiteListAddEventsFull.filter(itm => {
    const index = whiteListRemoveEvents.indexOf(itm.returnValues.addr)
    if (index !== -1) {
      whiteListRemoveEvents.splice(index, 1)
      return false
    }
    return true
  })

  assert.strictEqual(whiteListRemoveEvents.length, 0)

  return addrs.map(({ transactionHash, returnValues }) => {
    return {
      txHash: transactionHash,
      addr: returnValues.addr
    }
  })
}

const main = async () => {
  const allEvents = await allEvent()
  console.log(allEvents.length)

  fs.writeFile(
    'WhitelistedAddressAdded.events.json',
    JSON.stringify(allEvents),
    console.log
  )
}
main()
