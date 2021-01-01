const path = require("path");

const cv = require("opencv4nodejs");

exports.cv = cv;

const grabFrames = (videoFile, delay, onFrame) => {
  const cap = new cv.VideoCapture(videoFile);
  let done = false;
  const intvl = setInterval(() => {
    let frame = cap.read();
    // loop back to start on end of stream reached
    if (frame.empty) {
      cap.reset();
      frame = cap.read();
    }
    onFrame(frame);

    const key = cv.waitKey(delay);
    done = key !== -1 && key !== 255;
    if (done) {
      clearInterval(intvl);
      console.log("Key pressed, exiting.");
    }
  }, 0);
};
exports.grabFrames = grabFrames;

exports.runVideoDetection = (src, detect) => {
  grabFrames(src, 1, (frame) => {
    detect(frame);
  });
};

exports.drawRectAroundBlobs = (
  binaryImg,
  dstImg,
  minPxSize,
  fixedRectWidth
) => {
  const { centroids, stats } = binaryImg.connectedComponentsWithStats();

  // pretend label 0 is background
  for (let label = 1; label < centroids.rows; label += 1) {
    const [x1, y1] = [
      stats.at(label, cv.CC_STAT_LEFT),
      stats.at(label, cv.CC_STAT_TOP),
    ];
    const [x2, y2] = [
      x1 + (fixedRectWidth || stats.at(label, cv.CC_STAT_WIDTH)),
      y1 + (fixedRectWidth || stats.at(label, cv.CC_STAT_HEIGHT)),
    ];
    const size = stats.at(label, cv.CC_STAT_AREA);
    const blue = new cv.Vec(255, 0, 0);
    if (minPxSize < size) {
      dstImg.drawRectangle(new cv.Point(x1, y1), new cv.Point(x2, y2), {
        color: blue,
        thickness: 2,
      });
    }
  }
};

const drawRect = (image, rect, color, opts = { thickness: 2 }) =>
  image.drawRectangle(rect, color, opts.thickness, cv.LINE_8);

exports.drawRect = drawRect;
exports.drawBlueRect = (image, rect, opts = { thickness: 2 }) =>
  drawRect(image, rect, new cv.Vec(255, 0, 0), opts);
exports.drawGreenRect = (image, rect, opts = { thickness: 2 }) =>
  drawRect(image, rect, new cv.Vec(0, 255, 0), opts);
exports.drawRedRect = (image, rect, opts = { thickness: 2 }) =>
  drawRect(image, rect, new cv.Vec(0, 0, 255), opts);

exports.extractSsdResults = function (outputBlob, imgDimensions) {
  return Array(outputBlob.rows)
    .fill(0)
    .map((res, i) => {
      const classLabel = outputBlob.at(i, 1);
      const confidence = outputBlob.at(i, 2);
      const bottomLeft = new cv.Point(
        outputBlob.at(i, 3) * imgDimensions.cols,
        outputBlob.at(i, 6) * imgDimensions.rows
      );
      const topRight = new cv.Point(
        outputBlob.at(i, 5) * imgDimensions.cols,
        outputBlob.at(i, 4) * imgDimensions.rows
      );
      const rect = new cv.Rect(
        bottomLeft.x,
        topRight.y,
        topRight.x - bottomLeft.x,
        bottomLeft.y - topRight.y
      );

      return {
        classLabel,
        confidence,
        rect,
      };
    });
};
