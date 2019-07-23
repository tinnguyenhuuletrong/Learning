const {
  waitForTx,
  setScript,
  broadcast,
  invokeScript,
  data,
  issue
} = require('@waves/waves-transactions')

async function deployScript({ nodeUrl, chainId, fee, scriptData, dAppSeed }) {
  const txScriptObj = setScript(
    {
      chainId,
      fee,
      script: scriptData
    },
    dAppSeed
  )
  const tx = await broadcast(txScriptObj, nodeUrl)
  await waitForTx(tx.id, { apiBase: nodeUrl })
  return tx
}

async function addItem({
  nodeUrl,
  chainId,
  fee,
  dAppAddress,
  dataJson,
  supplierSeed
}) {
  const txIvScriptObj = invokeScript(
    {
      dApp: dAppAddress,
      nodeUrl,
      chainId,
      fee,
      call: {
        function: 'addItem',
        args: [
          { type: 'string', value: dataJson.title },
          { type: 'integer', value: dataJson.coupon_price },
          { type: 'string', value: JSON.stringify(dataJson) }
        ]
      },
      payment: []
    },
    supplierSeed
  )
  const tx = await broadcast(txIvScriptObj, nodeUrl)
  await waitForTx(tx.id, { apiBase: nodeUrl })
  return tx
}

async function purchaseItem({
  dAppAddress,
  nodeUrl,
  chainId,
  fee,
  item,
  amount,
  customerSeed
}) {
  const txIvScriptObj = invokeScript(
    {
      dApp: dAppAddress,
      nodeUrl,
      chainId,
      fee,
      call: {
        function: 'purchase',
        args: [{ type: 'string', value: item }]
      },
      payment: [{ amount, assetId: null }]
    },
    customerSeed
  )
  const tx = await broadcast(txIvScriptObj, nodeUrl)
  await waitForTx(tx.id, { apiBase: nodeUrl })
  return tx
}

async function withdraw({ dAppAddress, nodeUrl, chainId, fee, seed }) {
  const txIvScriptObj = invokeScript(
    {
      dApp: dAppAddress,
      nodeUrl,
      chainId,
      fee,
      call: {
        function: 'withdraw',
        args: []
      },
      payment: []
    },
    seed
  )
  const tx = await broadcast(txIvScriptObj, nodeUrl)
  await waitForTx(tx.id, { apiBase: nodeUrl })
  return tx
}

async function voteCommit({
  dAppAddress,
  nodeUrl,
  chainId,
  fee,
  seed,
  item,
  hash
}) {
  const txIvScriptObj = invokeScript(
    {
      dApp: dAppAddress,
      nodeUrl,
      chainId,
      fee,
      call: {
        function: 'voteCommit',
        args: [{ type: 'string', value: item }, { type: 'string', value: hash }]
      },
      payment: []
    },
    seed
  )
  const tx = await broadcast(txIvScriptObj, nodeUrl)
  await waitForTx(tx.id, { apiBase: nodeUrl })
  return tx
}

async function voteReveal({
  dAppAddress,
  nodeUrl,
  chainId,
  fee,
  seed,
  item,
  vote,
  salt
}) {
  const txIvScriptObj = invokeScript(
    {
      dApp: dAppAddress,
      nodeUrl,
      chainId,
      fee,
      call: {
        function: 'voteReveal',
        args: [
          { type: 'string', value: item },
          { type: 'string', value: vote },
          { type: 'string', value: salt }
        ]
      },
      payment: []
    },
    seed
  )
  const tx = await broadcast(txIvScriptObj, nodeUrl)
  await waitForTx(tx.id, { apiBase: nodeUrl })
  return tx
}

async function _devResetData({
  dAppAddress,
  nodeUrl,
  chainId,
  fee,
  seed,
  dataSet
}) {
  const txDataObj = data(
    {
      dApp: dAppAddress,
      nodeUrl,
      chainId,
      fee,
      data: [...dataSet]
    },
    seed
  )
  const tx = await broadcast(txDataObj, nodeUrl)
  await waitForTx(tx.id, { apiBase: nodeUrl })
  return tx
}

async function issueCouponToken({
  nodeUrl,
  chainId,
  fee,
  seed,

  name,
  compiledScript,
  quantity,
  description
}) {
  const txIssueData = issue(
    {
      nodeUrl,
      chainId,
      fee,

      name,
      script: compiledScript,
      quantity,
      decimals: 0,
      reissuable: true,
      description
    },
    seed
  )

  const tx = await broadcast(txIssueData, nodeUrl)
  await waitForTx(tx.id, { apiBase: nodeUrl })
  return tx
}

async function setOracleStatus({
  oracleAddr,
  nodeUrl,
  chainId,
  fee,
  seed,

  supplierAddr,
  status
}) {
  const txIssueData = invokeScript(
    {
      dApp: oracleAddr,
      nodeUrl,
      chainId,
      fee,
      call: {
        function: 'setStatus',
        args: [
          { type: 'string', value: supplierAddr },
          { type: 'string', value: status }
        ]
      },
      payment: []
    },
    seed
  )

  const tx = await broadcast(txIssueData, nodeUrl)
  await waitForTx(tx.id, { apiBase: nodeUrl })
  return tx
}

module.exports = {
  deployScript,
  addItem,
  purchaseItem,
  withdraw,
  voteCommit,
  voteReveal,
  issueCouponToken,
  setOracleStatus,
  _devResetData
}
