class Deferred {
  constructor() {
    this.reset();
  }

  reset() {
    this.promise = new Promise((resolve, reject) => {
      this.reject = reject;
      this.resolve = resolve;
    });
  }
}

let ready = new Deferred();
let opencv;
self.importScripts("/build/bin/wasm/opencv.js");

function openCVReady() {
  console.log("opencv ready");
  cv = opencv;
  postMessage({ namespace: "system.opencv", ev: "ready" });
  ready.resolve();
}

function imgData2Mat(imgData) {
  return new cv.matFromImageData(imgData);
}
function mat2ImgData(mat) {
  var img = new cv.Mat();
  var depth = mat.type() % 8;
  var scale = depth <= cv.CV_8S ? 1 : depth <= cv.CV_32S ? 1 / 256 : 255;
  var shift = depth === cv.CV_8S || depth === cv.CV_16S ? 128 : 0;
  mat.convertTo(img, cv.CV_8U, scale, shift);
  switch (img.type()) {
    case cv.CV_8UC1:
      cv.cvtColor(img, img, cv.COLOR_GRAY2RGBA);
      break;
    case cv.CV_8UC3:
      cv.cvtColor(img, img, cv.COLOR_RGB2RGBA);
      break;
    case cv.CV_8UC4:
      break;
    default:
      throw new Error(
        "Bad number of channels (Source image must have 1, 3 or 4 channels)"
      );
      return;
  }
  var imgData = new ImageData(
    new Uint8ClampedArray(img.data),
    img.cols,
    img.rows
  );

  img.delete();
  return imgData;
}

async function start() {
  console.log("worker start");
  opencv = cv();

  if (opencv.getBuildInformation) {
    openCVReady();
  } else {
    // WASM
    opencv["onRuntimeInitialized"] = () => {
      openCVReady();
    };
  }
}
