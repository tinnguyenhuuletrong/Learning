const app = require('vorpal')()
const { EventEmitter } = require('events')
const Firebase = require('firebase/app')
const WebRTCPeer = require('./libs/WebRTCPeer')
const FirebaseSignalChannel = require('./libs/FirebaseSignalChannel')

require('firebase/database')

const firebaseConfig = {
  apiKey: 'AIzaSyBe719lkdeQBL0McXykgBMUClMUN3UgpUQ',
  databaseURL: 'https://weeklyhack-ff068.firebaseio.com/'
}
Firebase.initializeApp(firebaseConfig)

const store = {
  roomId: `room-${Date.now()}`,
  mode: '',
  mineMedia: null,
  otherMedia: null,
  simplePeerConfig: {
    trickle: true,
    config: {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:global.stun.twilio.com:3478?transport=udp' }
      ]
    }
  },
  connection: new WebRTCPeer(new FirebaseSignalChannel(Firebase.database())),
  eventSource: new EventEmitter()
}

global.store = store

// Register commands
require('./commands')(app, store)

//Show
app.show()

function cleanup() {
  console.log('.... stop begin')
  store.connection.reset()
  console.log('.... stop end')
}

//do something when app is closing
process.on('exit', cleanup)
//catches ctrl+c event
process.on('SIGINT', cleanup)
// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', cleanup)
process.on('SIGUSR2', cleanup)