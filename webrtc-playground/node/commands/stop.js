const WebRTCPeer = require('../libs/WebRTCPeer')

module.exports = function(app, store) {
  app.command('stop', 'stop session').action((args, callback = () => {}) => {
    const { connection } = store
    if (connection instanceof WebRTCPeer) {
      connection.reset()
      return callback()
    }

    return callback()
  })
}
