const WebRTCPeer = require('../libs/WebRTCPeer')

module.exports = function(app, store) {
  app
    .command('get-config', 'peer config')
    .action((args, callback = () => {}) => {
      const { peerConfig } = args
      console.log(JSON.stringify(store.simplePeerConfig))
      return callback()
    })

  app
    .command('set-config', 'peer config')
    .action(function(args, callback = () => {}) {
      this.prompt(
        {
          type: 'input',
          name: 'peerConfig',
          message: 'Simple Peer config: '
        },
        function(result) {
          try {
            const { peerConfig } = result
            console.log(peerConfig)
            const jsonVal = JSON.parse(peerConfig)
            store.simplePeerConfig = jsonVal
          } catch (error) {
            console.error('Invalid JSON')
          }
          return callback()
        }
      )
    })

  app
    .command('start <mode> [roomId]', 'start new session')
    .action((args, callback = () => {}) => {
      const { roomId, mode } = args

      if (!WebRTCPeer.MODE[mode]) {
        console.error('Invalid mode. Must be ', JSON.stringify(WebRTCPeer.MODE))
        return callback()
      }

      // Override roomId
      store.roomId = roomId || store.roomId
      store.mode = mode

      const { connection, simplePeerConfig } = store
      if (connection instanceof WebRTCPeer) {
        connection.start({ mode, signalRoom: store.roomId, simplePeerConfig })
        console.log('start...', {
          mode,
          signalRoom: store.roomId,
          simplePeerConfig
        })
        return callback()
      }

      return callback()
    })
}
