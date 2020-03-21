const WebRTCPeer = require("../libs/WebRTCPeer");
const recordRTCVideoTrack = require("../helper/recordRTCVideoTrack");
const replayRTCVideoTrack = require("../helper/replayRTCVideoTrack");
const processRTCVideoTrack = require("../helper/processRTCVideoTrack");

module.exports = function(app, store) {
  app
    .command("send <msg>", "send message")
    .action((args, callback = () => {}) => {
      const { msg } = args;
      const { connection } = store;
      const { peer } = connection;
      if (!peer) {
        console.error("not connect");
        return callback();
      }

      if (connection instanceof WebRTCPeer) {
        connection.send(msg);
        return callback();
      }

      return callback();
    });

  store.connection.on("stream", async stream => {
    store.otherMedia = stream;
    const trackLengths = stream.getTracks().length;
    console.log("Stream", stream, trackLengths);
    if (trackLengths > 0) {
      const track = stream.getTracks()[0];

      // Save to file
      // recordRTCVideoTrack(track);

      // const videoSource = await store.connection.createVideoSource();
      // replayRTCVideoTrack(videoSource, track);

      const videoSource = await store.connection.createVideoSource();
      processRTCVideoTrack(videoSource, track);
    }
  });
};
