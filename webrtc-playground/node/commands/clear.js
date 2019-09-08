module.exports = function(app) {
  app.command('clear', 'clear').action((args, callback = () => {}) => {
    process.stdout.write('\u001B[2J\u001B[0;0f')
    callback()
  })
}
