/*
Required 
  brew install ffmpeg
  npm i fluent-ffmpeg
*/
const ffmpeg = require("fluent-ffmpeg");
const { PassThrough } = require("stream");
const { RTCVideoSink, RTCVideoSource } = require("wrtc").nonstandard;

const VIDEO_OUTPUT_SIZE = "320x240";
const VIDEO_OUTPUT_FILE = "./recording.mp4";

function recordRTCVideoTrack(videoTrack, options = {}) {
  let stream;
  const videoSkink = new RTCVideoSink(videoTrack);
  const trackId = videoTrack.id;
  const kind = videoTrack.kind;

  console.log("\t[recordRTCVideoTrack]", { trackId, kind });

  function init(width, height) {
    if (stream) return;

    size = width + "x" + height;
    stream = {
      recordPath: options.fileName || `./track_${videoTrack.id}.mp4`,
      size,
      recordEnd: false,
      video: new PassThrough()
    };

    stream.proc = ffmpeg()
      .addInput(stream.video)
      .addInputOptions([
        "-f",
        "rawvideo",
        "-pix_fmt",
        "yuv420p",
        "-s",
        stream.size,
        "-r",
        "30"
      ])
      .on("start", () => {
        console.log(
          "\t[recordRTCVideoTrack]",
          "Start recording >> ",
          stream.recordPath
        );
      })
      .on("end", () => {
        stream.recordEnd = true;
        console.log(
          "\t[recordRTCVideoTrack]",
          "Stop recording >> ",
          stream.recordPath
        );
      })
      .size(VIDEO_OUTPUT_SIZE)
      .output(stream.recordPath);

    stream.proc.run();
  }

  videoSkink.onframe = ({ frame: { width, height, data } }) => {
    init(width, height);
    if (!stream.recordEnd) stream.video.push(Buffer.from(data));
  };

  // watching for track end
  const _watcher = setInterval(() => {
    const readyState = videoTrack.readyState;
    if (readyState === "ended") {
      console.log("\t[recordRTCVideoTrack]", "track end");
      clearInterval(_watcher);
      videoSkink.stop();
      stream.video.end();
    }
  }, 1000);
}

module.exports = recordRTCVideoTrack;
