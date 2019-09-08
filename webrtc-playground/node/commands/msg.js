const WebRTCPeer = require('../libs/WebRTCPeer')

module.exports = function(app, store) {
  app
    .command('send <msg>', 'send message')
    .action((args, callback = () => {}) => {
      const { msg } = args
      const { connection } = store
      const { peer } = connection
      if (!peer) {
        console.error('not connect')
        return callback()
      }

      if (connection instanceof WebRTCPeer) {
        connection.send(msg)
        return callback()
      }

      return callback()
    })

  store.connection.on('stream', stream => {
    console.log('Stream', stream)
    store.otherMedia = stream
  })
}
