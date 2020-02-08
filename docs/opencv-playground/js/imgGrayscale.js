function processImage(mat) {
  // Gray scale
  cv.cvtColor(mat, mat, cv.COLOR_RGBA2GRAY, 0);
  cv.imshow("canvasOutput", mat);
  mat.delete();
}
