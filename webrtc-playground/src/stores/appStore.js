class AppStore {
  connection = null
  mode = ''
  signalData = ''

  setSignalData = data => {
    this.signalData = data
  }
  setMode = mode => {
    this.mode = mode
  }
  setConnection = con => {
    this.connection = con
    con.on('connect', () => {
      console.log('CONNECT')
    })
    con.on('data', data => {
      console.log('data: ' + data)
    })
  }
  reset = () => {
    this.connection = null
    this.mode = ''
    this.signalData = ''
  }
}

export default AppStore
