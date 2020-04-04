require("firebase/database");
const Firebase = require("firebase/app");
const WebRTCPeer = require("../libs/WebRTCPeer");
const FirebaseSignalChannel = require("../libs/FirebaseSignalChannel");

// Canvas processing
const processRTCVideoTrack = require("../helper/processRTCVideoTrack");

/** Parse args */
let mode, roomName;
for (let i = 0; i < process.argv.length; i++) {
  const val = process.argv[i];
  if (val === "-m" || val === "-mode") mode = process.argv[++i];
  if (val === "-r" || val === "-room") roomName = process.argv[++i];
}

if (!(mode && roomName)) {
  console.error("Usage: echoVideo.js -m [HOST|PEER] -r <roomName> ");
  process.exit(0);
}

console.info("args: ", { mode, roomName });

/** Store */
const firebaseConfig = {
  apiKey: "AIzaSyBe719lkdeQBL0McXykgBMUClMUN3UgpUQ",
  databaseURL: "https://weeklyhack-ff068.firebaseio.com/",
};
Firebase.initializeApp(firebaseConfig);
const store = {
  roomId: roomName,
  mode: mode,
  simplePeerConfig: {
    trickle: true,
    config: {
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:global.stun.twilio.com:3478?transport=udp" },
        {
          urls: "turn:numb.viagenie.ca",
          username: "ilu20009@gmail.com",
          credential: "Abc12345",
        },
      ],
    },
  },
  connection: new WebRTCPeer(new FirebaseSignalChannel(Firebase.database())),
};

/** Cleanup */
function cleanup() {
  console.log(".... stop begin");
  store.connection.reset();
  console.log(".... stop end");
  process.exit(0);
}

//catches ctrl+c event
process.on("SIGINT", cleanup);
// catches "kill pid" (for example: nodemon restart)
process.on("SIGUSR1", cleanup);
process.on("SIGUSR2", cleanup);

/** Functions */
function initMediaSupport() {
  const { connection } = store;
  const peerConnection = connection.peer;
  const audioTransceiver = peerConnection.addTransceiver("audio", {});
  const videoTransceiver = peerConnection.addTransceiver("video", {});
  console.log("init Media Support completed");
}

async function start() {
  const { connection } = store;

  connection.start({
    mode: store.mode,
    signalRoom: store.roomId,
    simplePeerConfig: store.simplePeerConfig,
  });

  connection.on("connect", () => {
    console.info("connected");
    initMediaSupport();
  });
  connection.on("error", (err) => {
    console.error(err);
  });
  connection.on("data", (msg) => {
    console.info("-> ", msg.toString());
    const echo = `echo - ${msg.toString()}`;
    console.info("\t <-", echo);
    connection.send(echo);
  });
  connection.on("close", (err) => {
    console.info("disconnected");
    cleanup();
  });

  connection.on("stream", async (stream) => {
    store.otherMedia = stream;
    const trackLengths = stream.getTracks().length;
    console.log("Stream", stream, trackLengths);
    if (trackLengths > 0) {
      const track = stream.getTracks()[0];
      const videoSource = await store.connection.createVideoSource();
      processRTCVideoTrack(videoSource, track);
    }
  });
}

start();
