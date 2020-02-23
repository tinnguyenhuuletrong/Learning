self.importScripts("./opencv_worker.js");
self.importScripts("../imgFaceDetect.js");

let isRunning = true;
let front, back;

function waitMs(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

function swap() {
  front = back;
  back = null;
}

async function onQueue(imgData, callback) {
  if (back) {
    back.callback && back.callback(null);
  }
  back = { imgData, callback };
}

async function detectFaces(imgData) {
  const inp = imgData2Mat(imgData);
  const faces = await processImage(inp, {
    shouldResize: false,
    skipShowImg: true
  });
  inp.delete();
  return faces;
}

onmessage = async e => {
  const { id, cmd, extra } = e.data;

  try {
    switch (cmd) {
      case "cmd.detect_faces":
        {
          onQueue(extra, response => {
            postMessage({
              namespace: "system.opencv",
              ev: "cmd.response",
              extra: { id, response }
            });
          });
        }
        break;

      default:
        break;
    }
  } catch (error) {
    console.error(error);
  }
};

start();
function showImg() {
  // Dummy
}
async function loadFaceLib() {
  await ready.promise;
  console.log("loadFaceLib begin");
  faceDetectInit();
  console.log("loadFaceLib end. running loop start");

  while (isRunning) {
    swap();
    if (front) {
      const res = await detectFaces(front.imgData);
      front.callback && front.callback(res);
    }
    await waitMs(1);
  }
}
loadFaceLib();
