const {
  RTCVideoSink,
  RTCVideoSource,
  rgbaToI420
} = require("wrtc").nonstandard;

/**
 *
 * @param {RTCVideoSource} outputVideoSource
 * @param {MediaStreamTrack} videoTrack
 */
function replayRTCVideoTrack(outputVideoSource, videoTrack) {
  const videoSkink = new RTCVideoSink(videoTrack);
  const trackId = videoTrack.id;
  const kind = videoTrack.kind;

  console.log("\t[replayRTCVideoTrack]", { trackId, kind });

  videoSkink.onframe = ({ frame }) => {
    outputVideoSource.onFrame(frame);
  };

  // watching for track end
  const _watcher = setInterval(() => {
    const readyState = videoTrack.readyState;
    if (readyState === "ended") {
      console.log("\t[replayRTCVideoTrack]", "track end");
      clearInterval(_watcher);
      videoSkink.stop();
    }
  }, 1000);
}

module.exports = replayRTCVideoTrack;
