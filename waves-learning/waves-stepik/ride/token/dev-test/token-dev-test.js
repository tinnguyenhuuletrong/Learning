const {
  broadcast,
  issue,
  waitForTx,
  reissue,
  transfer,
  burn,
  setScript,
  invokeScript,
  setAssetScript
} = require('@waves/waves-transactions')

const nodeUrl = 'https://testnodes.wavesnodes.com'
const chainId = 84
const tokenAccSeed =
  'elevator top badge glimpse battle spy list brown garbage eager increase fog stove ritual pink'

const tokenDappAddress = '3N8aUfhiN7gZyKPYimMvCHhqZRJLTSMsMWq'
const tokenDappSeed =
  'tiny draft welcome time need symptom loop chapter lucky hybrid throw quarter'

const wTTinAssetId = '9561GNM35uuW6eGsUTFGDZbbPTNajnKa5vkhKCEhDioH'

async function test_issueToken() {
  const issueTxObj = issue(
    {
      fee: 100000000, // 1 Waves
      chainId,

      name: 'wTTin',
      quantity: 1000000,
      decimals: 2,
      reissuable: false,
      description: 'Example of custom token for Mastering Web3 with Waves'
    },
    tokenAccSeed
  )

  const tx = await broadcast(issueTxObj, nodeUrl)
  await waitForTx(tx.id, { apiBase: nodeUrl })
  console.log(tx)
}

async function test_issueIndivisibleToken() {
  const issueTxObj = issue(
    {
      fee: 100000000, // 1 Waves
      chainId,

      name: 'ice cream coupon',
      quantity: 100,
      decimals: 0,
      reissuable: true,
      description:
        'Token 50% discount for one ice cream bucket in Coupon Bazaar marketplace'
    },
    tokenAccSeed
  )

  const tx = await broadcast(issueTxObj, nodeUrl)
  await waitForTx(tx.id, { apiBase: nodeUrl })
  console.log(tx)
}

async function test_reIssueIndivisibleToken() {
  const issueTxObj = reissue(
    {
      fee: 100000000, // 1 Waves
      chainId,

      quantity: 10,
      reissuable: true,
      assetId: '97DEKsqeVECUdmdSMk7wPgm9FDvECvbXgpVoYMPhhc34'
    },
    tokenAccSeed
  )

  const tx = await broadcast(issueTxObj, nodeUrl)
  await waitForTx(tx.id, { apiBase: nodeUrl })
  console.log(tx)
}

async function test_transferToken() {
  const issueTxObj = transfer(
    {
      chainId,

      assetId: '97DEKsqeVECUdmdSMk7wPgm9FDvECvbXgpVoYMPhhc34',
      recipient: '3N6VhXX89wLVLyufg9bN5GdpmKt9nkd1Li8',
      amount: 2
    },
    tokenAccSeed
  )

  const tx = await broadcast(issueTxObj, nodeUrl)
  await waitForTx(tx.id, { apiBase: nodeUrl })
  console.log(tx)
}

async function test_burnToken() {
  const issueTxObj = burn(
    {
      chainId,

      assetId: '97DEKsqeVECUdmdSMk7wPgm9FDvECvbXgpVoYMPhhc34',
      quantity: 10
    },
    tokenAccSeed
  )

  const tx = await broadcast(issueTxObj, nodeUrl)
  await waitForTx(tx.id, { apiBase: nodeUrl })
  console.log(tx)
}

async function test_deployScript() {
  const setScriptTxObj = setScript(
    {
      chainId,
      fee: 1400000,
      script: require('./compiled-script')
    },
    tokenDappSeed
  )
  const tx = await broadcast(setScriptTxObj, nodeUrl)
  await waitForTx(tx.id, { apiBase: nodeUrl })
  console.log(tx)
}

async function test_dApp_deposit() {
  const amount = 300
  const scriptInvokeTxObj = invokeScript(
    {
      dApp: tokenDappAddress,
      chainId,
      call: {
        function: 'deposit',
        args: []
      },
      payment: [{ amount, assetId: wTTinAssetId }]
    },
    tokenAccSeed
  )
  const tx = await broadcast(scriptInvokeTxObj, nodeUrl)
  await waitForTx(tx.id, { apiBase: nodeUrl })
  console.log(tx)
}

async function test_dApp_withdraw() {
  const amount = 100
  const scriptInvokeTxObj = invokeScript(
    {
      dApp: tokenDappAddress,
      chainId,
      call: {
        function: 'withdraw',
        args: [{ type: 'integer', value: amount }]
      },
      payment: []
    },
    tokenAccSeed
  )
  const tx = await broadcast(scriptInvokeTxObj, nodeUrl)
  await waitForTx(tx.id, { apiBase: nodeUrl })
  console.log(tx)
}

async function test_assetScript(params) {
  const scriptInvokeTxObj = setAssetScript(
    {
      assetId: '9561GNM35uuW6eGsUTFGDZbbPTNajnKa5vkhKCEhDioH',
      chainId,
      script:
        'AwQAAAAHJG1hdGNoMAUAAAACdHgDCQAAAQAAAAIFAAAAByRtYXRjaDACAAAAE0V4Y2hhbmdlVHJhbnNhY3Rpb24EAAAAAXQFAAAAByRtYXRjaDAGByPxj0E='
    },
    tokenAccSeed
  )
  const tx = await broadcast(scriptInvokeTxObj, nodeUrl)
  await waitForTx(tx.id, { apiBase: nodeUrl })
  console.log(tx)
}

async function test_NFToken() {
  const issueTxObj = issue(
    {
      fee: 1000000, // 0.01 Waves
      chainId,

      name: 'ice cream gift',
      quantity: 1,
      decimals: 0,
      reissuable: false,
      description:
        'NF Token 50% discount for one ice cream bucket in Coupon Bazaar marketplace'
    },
    tokenAccSeed
  )

  const tx = await broadcast(issueTxObj, nodeUrl)
  await waitForTx(tx.id, { apiBase: nodeUrl })
  console.log(tx)
}

// test_issueToken()
// test_issueIndivisibleToken()
// test_reIssueIndivisibleToken()
// test_transferToken()
// test_burnToken()
// test_deployScript()
// test_dApp_deposit()
// test_dApp_withdraw()
test_NFToken()
