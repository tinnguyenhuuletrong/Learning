const {
  deployScript,
  addItem,
  purchaseItem,
  withdraw,
  voteCommit,
  voteReveal,
  issueCouponToken,
  setOracleStatus,
  _devResetData
} = require('../libs')
const { inspect } = require('util')
const scriptBase64 = require('./compiledScript')

const nodeUrl = 'https://testnodes.wavesnodes.com'
const chainId = 84

const dAppAddress = '3N7JoxehscqKiXcuQ1iEQ6pEv6mZvnYS9mC'
const devDappAccountSeed =
  'mouse snake animal evidence bind rely jazz ivory acid bomb later festival'

const supplierAddress = '3N25oHrEURnPpQ6j283hfofUeQXWuucXEVK'
const supplierAccountSeed =
  'hobby brain primary tortoise pioneer trash lady entry strong bacon blur clerk'

const supplierAddress1 = '3N1agX8S6XTYXNKG1CX7J6PjPagq2xnGLCH'
const supplierAccountSeed1 =
  'puzzle wood mobile drill rebel park angle zero kitten slam food eager inch whisper truly'

const customerAddress = '3MxNdvgdownJzey4PELbi455128G9adHG8u'
const cusomerAccountSeed =
  'chief own way magnet elevator grant alert edge jealous history legend nephew'

const oracleAddress = '3Mq8Cyz1NDBD7mz6qyc164YNKSunsrvJFBM'
const oracleAccountSeed =
  'robot ladder sample chunk identify milk earth drip illness repair sauce scare'

async function testDeploy() {
  try {
    const tx = await deployScript({
      chainId,
      scriptData: scriptBase64,
      dAppSeed: devDappAccountSeed,
      nodeUrl,
      fee: 1400000
    })
    console.log(tx)
  } catch (error) {
    console.log(error)
  }
}

async function testAddItem() {
  try {
    const dataJson = {
      title: 'mask with skull',
      coupon_price: 10000000,
      old_price: 100000000,
      address: 'Home',
      description: 'des',
      image:
        'https://www.wowcuz.com/wp-content/uploads/2018/07/NB1-Dabbing-Skull-HSRN-2-600x600.jpg'
    }

    const tx = await addItem({
      dAppAddress,
      nodeUrl,
      chainId,
      fee: 500000,
      dataJson,
      supplierSeed: supplierAccountSeed1
    })
    console.log(tx)
  } catch (error) {
    console.log(error)
  }
}

async function testPurchaseItem() {
  try {
    const itemId = 'item_6R8pRNEQ81prTiewj1X8guxtZuGgJCiWLLhW1rJwNKXf'

    const tx = await purchaseItem({
      dAppAddress,
      nodeUrl,
      chainId,
      fee: 500000,
      item: itemId,
      amount: 10000000,
      customerSeed: cusomerAccountSeed
    })
    console.log(tx)
  } catch (error) {
    console.log(error)
  }
}

async function testWithdraw() {
  try {
    const tx = await withdraw({
      dAppAddress,
      nodeUrl,
      chainId,
      fee: 500000,
      seed: supplierAccountSeed
    })
    console.log(tx)
  } catch (error) {
    console.error(error)
  }
}

let commits = [
  'G8ZMEiXEGefpEdgEFN5mYr6oEEABJrtcBBLkZf6Ujmcq',
  'Bf2yysmAoroXAzVidK1wxuVYpRGLy1nWe6cNAGXBf5Hi',
  'ACHSFMGY7bp3aHryCLYc499XvojeGrgBp59zSvwgLnkQ'
]

let reveals = ['delisted', 'featured', 'featured']
let salts = ['random1', 'random2', 'random3']
let seeds = [devDappAccountSeed, cusomerAccountSeed, supplierAccountSeed]
async function testVoteCommit() {
  try {
    const itemId = 'item_6R8pRNEQ81prTiewj1X8guxtZuGgJCiWLLhW1rJwNKXf'
    const user = 1

    const tx = await voteCommit({
      dAppAddress,
      nodeUrl,
      chainId,
      fee: 500000,
      seed: seeds[user],
      item: itemId,
      hash: commits[user]
    })
    console.log(tx)
  } catch (error) {
    console.error(error)
  }
}
async function testVoteReveal() {
  try {
    const itemId = 'item_6R8pRNEQ81prTiewj1X8guxtZuGgJCiWLLhW1rJwNKXf'
    const user = 0

    const tx = await voteReveal({
      dAppAddress,
      nodeUrl,
      chainId,
      fee: 900000,
      seed: seeds[user],
      item: itemId,
      vote: reveals[user],
      salt: salts[user]
    })
    console.log(tx)
  } catch (error) {
    console.error(error)
  }
}

async function fix_devResetData() {
  try {
    const tx = await _devResetData({
      dAppAddress,
      nodeUrl,
      chainId,
      fee: 500000,
      seed: devDappAccountSeed,
      dataSet: [
        {
          key:
            'item_6R8pRNEQ81prTiewj1X8guxtZuGgJCiWLLhW1rJwNKXf_3MxNdvgdownJzey4PELbi455128G9adHG8u_reveal',
          value: 'none'
        },
        {
          key:
            'item_6R8pRNEQ81prTiewj1X8guxtZuGgJCiWLLhW1rJwNKXf_3N25oHrEURnPpQ6j283hfofUeQXWuucXEVK_reveal',
          value: 'none'
        },
        {
          key:
            'item_6R8pRNEQ81prTiewj1X8guxtZuGgJCiWLLhW1rJwNKXf_3N7JoxehscqKiXcuQ1iEQ6pEv6mZvnYS9mC_reveal',
          value: 'none'
        }
      ]
    })
    console.log(tx)
  } catch (error) {
    console.error(error)
  }
}

async function test_issueCouponToken() {
  try {
    const tx = await issueCouponToken({
      dAppAddress,
      nodeUrl,
      chainId,
      seed: supplierAccountSeed,

      name: 'my bazzar coupon',
      compiledScript: require('./tokenCompiledScript'),
      quantity: 100,
      description: 'Example coupon token'
    })
    console.log(tx)
  } catch (error) {
    console.error(error)
  }
}

async function testDeployOracle() {
  try {
    const tx = await deployScript({
      chainId,
      scriptData: require('./oracleCompiledScript'),
      dAppSeed: oracleAccountSeed,
      nodeUrl,
      fee: 1400000
    })
    console.log(tx)
  } catch (error) {
    console.log(error)
  }
}

async function testSetOracleStatus() {
  try {
    const tx = await setOracleStatus({
      chainId,
      nodeUrl,
      fee: 900000,

      oracleAddr: oracleAddress,
      seed: oracleAccountSeed,

      supplierAddr: supplierAddress1,
      status: 'verified'
    })
    console.log(tx)
  } catch (error) {
    console.log(inspect(error, false, 99, true))
  }
}

// testDeploy()
testAddItem()
// testPurchaseItem()
// testWithdraw()
// testVoteCommit()
// testVoteReveal()
// fix_devResetData()
// test_issueCouponToken()
// testDeployOracle()
// testSetOracleStatus()
