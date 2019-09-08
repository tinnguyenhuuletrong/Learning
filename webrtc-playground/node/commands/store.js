const util = require('util')

module.exports = function(app, store) {
  app.command('store', 'store').action((args, callback = () => {}) => {
    console.log(store)
    callback()
  })
}
