var c, ctx;

function canvasHelperInit(id) {
  c = document.getElementById(id);
  ctx = c.getContext("2d");
  return c;
}

function canvasHelperClear() {
  ctx.clearRect(0, 0, c.width, c.height);
}

function canvasHelperDrawRectangle({ x, y, width, height }) {
  ctx.beginPath();
  ctx.lineWidth = "2";
  ctx.strokeStyle = "red";
  ctx.rect(x, y, width, height);
  ctx.stroke();
}

function canvasHelperReadImgData(imageSource) {
  var img = null;
  if (typeof imageSource === "string") {
    img = document.getElementById(imageSource);
  } else {
    img = imageSource;
  }
  var canvas = null;
  var ctx = null;
  if (img instanceof HTMLImageElement) {
    canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, img.width, img.height);
  } else if (img instanceof HTMLCanvasElement) {
    canvas = img;
    ctx = canvas.getContext("2d");
  } else {
    throw new Error("Please input the valid canvas or img id.");
    return;
  }
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

function canvasHelperShowImgData(canvasElement, imgData) {
  var canvas = canvasElement;
  var ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  canvas.width = imgData.width;
  canvas.height = imgData.height;
  ctx.putImageData(imgData, 0, 0);
}
