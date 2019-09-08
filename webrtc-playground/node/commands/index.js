const cmdClear = require('./clear')
const cmdStart = require('./start')
const cmdStop = require('./stop')
const cmdStore = require('./store')
const cmdRtcs = require('./rtc')
const cmdMsg = require('./msg')
const cmdRepl = require('./repl')

const allCmds = [
  cmdClear,
  cmdRepl,
  cmdStart,
  cmdStop,
  cmdStore,
  cmdRtcs,
  cmdMsg
]
module.exports = function(app, context) {
  allCmds.forEach(cmd => cmd(app, context))
  return app
}
