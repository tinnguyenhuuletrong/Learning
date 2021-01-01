const cv = require("opencv4nodejs");
const path = require("path");
const { drawBlueRect, extractSsdResults } = require("./utils");

// open capture from webcam
const devicePort = 0;
const wCap = new cv.VideoCapture(devicePort);

const classifier = new cv.CascadeClassifier(cv.HAAR_FRONTALFACE_DEFAULT);
function haar_detectFaces(img) {
  // restrict minSize and scaleFactor for faster processing
  const options = {
    minSize: new cv.Size(100, 100),
    scaleFactor: 1.2,
    minNeighbors: 10,
  };
  return classifier.detectMultiScaleGpu(img.bgrToGray(), options).objects;
}

const prototxt = path.join(__dirname, "dnn/deploy.prototxt");
const modelFile = path.join(
  __dirname,
  "dnn/res10_300x300_ssd_iter_140000.caffemodel"
);
const facenetModel = cv.readNetFromCaffe(prototxt, modelFile);
function facenet_detectFaces(img) {
  // facenet model works with 300 x 300 images
  const imgResized = img.resizeToMax(300);

  // network accepts blobs as input
  const inputBlob = cv.blobFromImage(imgResized);
  facenetModel.setInput(inputBlob);

  // forward pass input through entire network, will return
  // classification result as 1x1xNxM Mat
  let outputBlob = facenetModel.forward();
  // extract NxM Mat
  outputBlob = outputBlob.flattenFloat(
    outputBlob.sizes[2],
    outputBlob.sizes[3]
  );

  return extractSsdResults(outputBlob, img);
}

// loop through the capture
const delayMs = 1000 / 60;
let done = false;
const faceNetMinConfi = 0.2;
while (!done) {
  let frame = wCap.read();

  const frameResized = frame.resizeToMax(600);

  // haar - detect faces
  // const faceRects = haar_detectFaces(frameResized);
  // if (faceRects.length) {
  //   // draw detection
  //   faceRects.forEach((faceRect) => drawBlueRect(frameResized, faceRect));
  // }

  // facenet
  const predictions = facenet_detectFaces(frameResized);
  predictions
    .filter((res) => res.confidence > faceNetMinConfi)
    .forEach((p) => drawBlueRect(frameResized, p.rect));

  cv.imshow("face detection", frameResized);
  const key = cv.waitKey(delayMs);

  // ESC
  done = key === 27;
}
