let faceCascade;
let gray;
let faces;
let msize;

async function faceDetectInit() {
  await createFileFromUrl(
    // Virtual path
    "haarcascade_frontalface_default.xml",

    // Url
    "./haarcascade_frontalface_default.xml"
  );
  faceCascade = new cv.CascadeClassifier();
  if (!faceCascade.load("haarcascade_frontalface_default.xml"))
    throw new Error("Can not load haarcascade_frontalface_default.xml");

  gray = new cv.Mat();
  faces = new cv.RectVector();
  msize = new cv.Size(0, 0);
}

function createFileFromUrl(path, url) {
  return new Promise((resolve, reject) => {
    let request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";
    request.onload = function(ev) {
      if (request.readyState === 4) {
        if (request.status === 200) {
          let data = new Uint8Array(request.response);
          cv.FS_createDataFile("/", path, data, true, false, false);
          resolve();
        } else {
          self.printError(
            "Failed to load " + url + " status: " + request.status
          );
        }
      }
    };
    request.send();
  });
}

function clone(mat) {
  const n = new cv.Mat();
  mat.copyTo(n);
  return n;
}

async function processImage(inp, options = {}) {
  const revertConverter = {
    revertPoint: (x, y) => ({ x, y }),
    revertRangeX: x => x,
    revertRangeY: y => y
  };
  const src = options.shouldResize
    ? resizeKeepWitdh(inp, 400, revertConverter)
    : clone(inp);

  cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);

  faceCascade.detectMultiScale(gray, faces, 1.1, 3, 0, msize, msize);
  const results = [];
  for (let i = 0; i < faces.size(); ++i) {
    const faceInfo = faces.get(i);

    const { x: fx, y: fy, width: fwidth, height: fheight } = faceInfo;

    const { x, y } = revertConverter.revertPoint(fx, fy);
    const width = revertConverter.revertRangeX(fwidth);
    const height = revertConverter.revertRangeY(fheight);

    results.push({ x, y, width, height });
    let point1 = new cv.Point(x, y);
    let point2 = new cv.Point(x + width, y + height);
    cv.rectangle(inp, point1, point2, [0, 255, 0, 255]);
  }

  showImg(inp);
  return results;
}

function showImg(mat) {
  cv.imshow("canvasOutput", mat);
}
