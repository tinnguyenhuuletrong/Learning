function resizeKeepWitdh(mat, maxWidth, revertObj = {}) {
  const { width, height } = mat.size();

  const dst = new cv.Mat();
  const ratio = width / height;
  const newWidth = maxWidth;
  const newHeight = newWidth / ratio;
  const dsize = new cv.Size(Math.round(newWidth), Math.round(newHeight));

  cv.resize(mat, dst, dsize, 0, 0, cv.INTER_AREA);

  revertObj.revertPoint = (x, y) => {
    const dx = x / newWidth;
    const dy = y / newHeight;
    return { x: dx * width, y: dy * height };
  };
  revertObj.revertRangeX = xRange => {
    const dx = xRange / newWidth;
    return dx * width;
  };
  revertObj.revertRangeY = yRange => {
    const dy = yRange / newHeight;
    return dy * height;
  };

  return dst;
}

function resizeKeepHeight(mat, maxHeight, revertObj = {}) {
  const { width, height } = mat.size();

  const dst = new cv.Mat();
  const ratio = width / height;
  const newHeight = maxHeight;
  const newWidth = ratio * newHeight;

  const dsize = new cv.Size(Math.round(newWidth), Math.round(newHeight));

  cv.resize(mat, dst, dsize, 0, 0, cv.INTER_AREA);

  revertObj.revertPoint = (x, y) => {
    const dx = x / newWidth;
    const dy = y / newHeight;
    return { x: dx * width, y: dy * height };
  };
  revertObj.revertRangeX = xRange => {
    const dx = xRange / newWidth;
    return dx * width;
  };
  revertObj.revertRangeY = yRange => {
    const dy = yRange / newHeight;
    return dy * height;
  };

  return dst;
}
