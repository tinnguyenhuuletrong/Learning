const WebRTCPeer = require('../libs/WebRTCPeer')

module.exports = function(app, store) {
  app
    .command('rtc-signal-logs', 'webrtc logs')
    .action((args, callback = () => {}) => {
      const { connection } = store
      if (connection instanceof WebRTCPeer) {
        console.log(connection.signalLogs)
        return callback()
      }

      return callback()
    })

  app
    .command('rtc-status', 'webrtc logs')
    .action(async (args, callback = () => {}) => {
      const { connection } = store
      if (connection instanceof WebRTCPeer) {
        const { peer } = connection
        if (!peer) {
          console.error('not connect')
          return callback()
        }

        const { localAddress = '', localFamily = '', localPort = '' } = peer
        const { remoteAddress = '', remoteFamily = '', remotePort = '' } = peer

        console.log('Connected:', peer._connected)
        console.log('Local:', { localAddress, localFamily, localPort })
        console.log('Remote:', { remoteAddress, remoteFamily, remotePort })
        return callback()
      }

      return callback()
    })

  app
    .command('rtc-stats', 'webrtc logs')
    .action(async (args, callback = () => {}) => {
      const { connection } = store
      if (connection instanceof WebRTCPeer) {
        const { peer } = connection
        if (!peer) {
          console.error('not connect')
          return callback()
        }

        console.log(await connection.getPeerStats())
        return callback()
      }

      return callback()
    })

  monitorLogs(store)
}

function monitorLogs(store) {
  const { connection, eventSource } = store

  const msgLog = (msg, title = '') => () => {
    console.log(`${new Date()} - ${title} - ${msg}`)
  }

  const signalLog = msg => {
    // setLogs([transformSignalLog(msg), ...logs])
  }

  const msgLogConnect = msgLog('connected')
  const msgLogError = msgLog('error')
  const msgLogClose = () => {
    msgLog('disconnected')
    connection.reset()
    msgLog('... reset done')
  }

  const msgSendTextMsg = textMsg => msgLog(`Send -> ${textMsg}`)()
  const msgLogWithData = msg => msgLog(`Recv -> ${msg}`)()

  // Monitoring
  connection.on('connect', msgLogConnect)
  connection.on('error', msgLogError)
  connection.on('data', msgLogWithData)
  connection.on('close', msgLogClose)

  connection.on('signalLog', signalLog)
  eventSource.on('action-send-text', msgSendTextMsg)
}
