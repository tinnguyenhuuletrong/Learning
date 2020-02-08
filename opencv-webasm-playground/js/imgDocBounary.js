function processImage(src) {
  const begin = Date.now();
  //console.log("1");
  const gray = new cv.Mat();
  const blur = new cv.Mat();
  const canny = new cv.Mat();
  const contours = new cv.MatVector();
  const hierarchy = new cv.Mat();

  //console.log("2", Date.now() - begin);

  // Gray scale
  cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);

  //console.log("3", Date.now() - begin);

  // Blur
  const ksize = new cv.Size(5, 5);
  cv.GaussianBlur(gray, blur, ksize, 0, 0, cv.BORDER_DEFAULT);

  //console.log("4", Date.now() - begin);

  // Cany
  cv.Canny(blur, canny, 75, 200);

  //console.log("5", Date.now() - begin);

  // Contours
  cv.findContours(
    canny,
    contours,
    hierarchy,
    cv.RETR_CCOMP,
    cv.CHAIN_APPROX_SIMPLE
  );

  //console.log("6", Date.now() - begin);

  const docRegion = filtercontours(contours);

  window.tmp = {
    docRegion
  };

  if (docRegion) {
    let color = new cv.Scalar(0, 255, 0, 255);

    cv.drawContours(src, docRegion.poly, 0, color, 2, cv.LINE_AA, hierarchy, 0);
    docRegion.poly.delete();
  }

  showImg(src);

  gray.delete();
  blur.delete();
  canny.delete();
  contours.delete();
  hierarchy.delete();
}

function filtercontours(contours, hierarchy) {
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
    const approxCurve = new cv.Mat();

    //cv.arcLength (curve, closed)
    const peri = cv.arcLength(element, true);

    // cv.approxPolyDP (curve, approxCurve, epsilon, closed)
    cv.approxPolyDP(element, approxCurve, 0.02 * peri, true);

    if (approxCurve.rows === 4) {
      poly.push_back(approxCurve);
      return { index: tmp[i].i, peri, area: tmp[i].area, poly };
    }

    approxCurve.delete();
  }
  return null;
}

function showImg(mat) {
  cv.imshow("canvasOutput", mat);
}
