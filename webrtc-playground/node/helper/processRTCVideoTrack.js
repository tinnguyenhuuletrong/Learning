/*
Required 
  npm i canvas
*/
const {
  RTCVideoSink,
  RTCVideoSource,
  rgbaToI420,
  i420ToRgba
} = require("wrtc").nonstandard;
const { createCanvas, createImageData } = require("canvas");

const CANVAS_WIDTH = 640;
const CANVAS_HEIGHT = 480;

/**
 *
 * @param {RTCVideoSource} outputVideoSource
 * @param {MediaStreamTrack} videoTrack
 */
function processRTCVideoTrack(outputVideoSource, videoTrack) {
  const videoSkink = new RTCVideoSink(videoTrack);
  const trackId = videoTrack.id;
  const kind = videoTrack.kind;
  console.log("\t[processRTCVideoTrack]", { trackId, kind });

  let canvas, context;

  function _init() {
    if (canvas) return;
    canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    context = canvas.getContext("2d", { pixelFormat: "RGBA24" });
  }

  function _processFrame(frame) {
    _init();
    const imgData = frame2ImageData(frame);
    context.drawImage(imgData, 0, 0);

    // draw overlay text
    context.font = "30px Arial";
    context.fillStyle = "white";
    context.fillText("node-webrct", 10, 40);

    const canvasImg = context.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    const nexFrame = imageData2Frame(canvas, canvasImg);
    outputVideoSource.onFrame(nexFrame);
  }

  videoSkink.onframe = ({ frame }) => {
    _processFrame(frame);
  };

  // watching for track end
  const _watcher = setInterval(() => {
    const readyState = videoTrack.readyState;
    if (readyState === "ended") {
      console.log("\t[processRTCVideoTrack]", "track end");
      clearInterval(_watcher);
      videoSkink.stop();
    }
  }, 1000);
}

function frame2ImageData(lastFrame) {
  const lastFrameCanvas = createCanvas(lastFrame.width, lastFrame.height);
  const lastFrameContext = lastFrameCanvas.getContext("2d", {
    pixelFormat: "RGBA24"
  });

  const rgba = new Uint8ClampedArray(lastFrame.width * lastFrame.height * 4);
  const rgbaFrame = createImageData(rgba, lastFrame.width, lastFrame.height);
  i420ToRgba(lastFrame, rgbaFrame);

  lastFrameContext.putImageData(rgbaFrame, 0, 0);
  return lastFrameCanvas;
}

function imageData2Frame(canvas, imgData) {
  const { width, height } = canvas;
  const i420Frame = {
    width,
    height,
    data: new Uint8ClampedArray(1.5 * width * height)
  };
  rgbaToI420(imgData, i420Frame);
  return i420Frame;
}

module.exports = processRTCVideoTrack;
