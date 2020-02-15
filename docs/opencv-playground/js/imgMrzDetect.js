let rectKernel, sqKernel;

function _lazyInit() {
  rectKernel = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(13, 5));
  sqKernel = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(21, 21));
}

function clone(mat) {
  const n = new cv.Mat();
  mat.copyTo(n);
  return n;
}

function processImage(
  inp,
  options = {
    shouldResize: true
  }
) {
  const begin = Date.now();

  const revertConverter = {
    revertPoint: (x, y) => ({ x, y }),
    revertRangeX: x => x,
    revertRangeY: y => y
  };
  const src = options.shouldResize
    ? resizeKeepWitdh(inp, 400, revertConverter)
    : clone(inp);

  const gray = new cv.Mat();
  const blur = new cv.Mat();
  const blackhat = new cv.Mat();
  const gradX = new cv.Mat();
  const thresh = new cv.Mat();
  const contours = new cv.MatVector();
  const hierarchy = new cv.Mat();

  //console.log("1", Date.now() - begin);

  // lazy init
  if (!rectKernel) {
    _lazyInit();
  }

  // Gray scale
  cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);

  //console.log("2", Date.now() - begin);

  // Blur
  const ksize = new cv.Size(3, 3);
  cv.GaussianBlur(gray, blur, ksize, 0);

  //console.log("3", Date.now() - begin);

  cv.morphologyEx(gray, blackhat, cv.MORPH_BLACKHAT, rectKernel);

  //console.log("4", Date.now() - begin);

  // Sobel - Highpass filter
  // cv.Sobel (src, dst, ddepth, dx, dy, ksize = 3, scale = 1, delta = 0, borderType = cv.BORDER_DEFAULT)
  cv.Sobel(blackhat, gradX, cv.CV_32F, 1, 0, -1);

  // Convert to int and scale result into the range [0, 255]
  const { minVal, maxVal } = cv.minMaxLoc(gradX);
  const d = maxVal - minVal;
  cv.convertScaleAbs(gradX, gradX, 255 / d, -minVal / d);

  //console.log("5", Date.now() - begin);

  // apply a closing operation using the rectangular kernel to close gaps in between letters -- then apply Otsu's thresholding method
  cv.morphologyEx(gradX, gradX, cv.MORPH_CLOSE, rectKernel);
  cv.threshold(gradX, thresh, 0, 255, cv.THRESH_BINARY | cv.THRESH_OTSU);
  cv.morphologyEx(thresh, thresh, cv.MORPH_CLOSE, sqKernel);
  let M = cv.Mat.ones(3, 3, cv.CV_8U);
  cv.erode(thresh, thresh, M, new cv.Point(-1, -1), 4);

  //console.log("6", Date.now() - begin);

  // Contours
  cv.findContours(
    thresh,
    contours,
    hierarchy,
    cv.RETR_CCOMP,
    cv.CHAIN_APPROX_SIMPLE
  );
  const docRegion = filtercontours(contours, gray.size());
  if (docRegion) {
    let color = new cv.Scalar(0, 255, 0, 255);

    const { x, y } = revertConverter.revertPoint(
      docRegion.rect.x,
      docRegion.rect.y
    );
    const width = revertConverter.revertRangeX(docRegion.rect.width);
    const height = revertConverter.revertRangeY(docRegion.rect.height);

    //  // console.log(docRegion.rect, "->", { x, y, width, height });

    cv.rectangle(
      inp,
      new cv.Point(x, y),
      new cv.Point(x + width, y + height),
      color,
      2
    );
  }

  //console.log("7", Date.now() - begin);

  //  window.tmp = { blackhat, gradX, thresh };

  showImg(inp);

  src.delete();
  gray.delete();
  blur.delete();
  blackhat.delete();
  gradX.delete();
  thresh.delete();
  contours.delete();
  hierarchy.delete();
}

function showImg(mat) {
  cv.imshow("canvasOutput", mat);
}

function filtercontours(contours, { width, height }) {
  const len = contours.size();
  const tmp = [];
  for (let i = 0; i < len; i++) {
    const element = contours.get(i);
    const area = cv.contourArea(element, false);
    tmp.push({ i, area });
  }

  tmp.sort((a, b) => b.area - a.area);

  const TOP = 5;
  let poly = new cv.MatVector();
  for (let i = 0; i < TOP; i++) {
    if (!tmp[i]) continue;

    const element = contours.get(tmp[i].i);

    // compute the bounding box of the contour and use the contour to
    // compute the aspect ratio and coverage ratio of the bounding box
    // width to the width of the image
    const rect = cv.boundingRect(element);
    const ar = rect.width / rect.height;
    const crWidth = rect.width / width;
    // console.log(tmp[i], rect, ar, crWidth);

    // check to see if the aspect ratio and coverage width are within
    // acceptable criteria
    if (ar > 5 && crWidth > 0.6) {
      // console.log("\t pick", tmp[i]);
      return {
        index: tmp[i].i,
        ar,
        crWidth,
        rect
      };
    }
  }
  return null;
}

function showImg(mat) {
  cv.imshow("canvasOutput", mat);
}
