/*
Required 
  npm i canvas
*/
const {
  RTCVideoSink,
  RTCVideoSource,
  rgbaToI420,
  i420ToRgba,
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

  function _lazyinit() {
    if (canvas) return;
    canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    context = canvas.getContext("2d", { pixelFormat: "RGBA24" });
  }

  function _processFrame(frame) {
    _lazyinit();
    const imgData = frame2ImageData(frame);
    context.putImageData(imgData, 0, 0);

    grayscale(imgData);
    context.putImageData(imgData, CANVAS_WIDTH / 2, 0);

    invertColor(imgData);
    context.putImageData(imgData, 0, CANVAS_HEIGHT / 2);

    // draw overlay text
    context.font = "30px Arial";
    context.fillStyle = "white";
    context.fillText("node-webrct", 10, 40);

    const canvasImg = context.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    const nexFrame = imageData2Frame(CANVAS_WIDTH, CANVAS_HEIGHT, canvasImg);
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

function frame2ImageData(frame) {
  const rgba = new Uint8ClampedArray(frame.width * frame.height * 4);
  const rgbaFrame = createImageData(rgba, frame.width, frame.height);
  i420ToRgba(frame, rgbaFrame);

  return rgbaFrame;
}

function imageData2Frame(width, height, imgData) {
  const i420Frame = {
    width,
    height,
    data: new Uint8ClampedArray(1.5 * width * height),
  };
  rgbaToI420(imgData, i420Frame);
  return i420Frame;
}

function grayscale(imgData) {
  const data = imgData.data;
  for (var i = 0; i < data.length; i += 4) {
    var brightness = 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2];
    // red
    data[i] = brightness;
    // green
    data[i + 1] = brightness;
    // blue
    data[i + 2] = brightness;
  }
}

function invertColor(imgData) {
  const data = imgData.data;
  for (var i = 0; i < data.length; i += 4) {
    // red
    data[i] = 255 - data[i];
    // green
    data[i + 1] = 255 - data[i + 1];
    // blue
    data[i + 2] = 255 - data[i + 2];
  }
}

module.exports = processRTCVideoTrack;
