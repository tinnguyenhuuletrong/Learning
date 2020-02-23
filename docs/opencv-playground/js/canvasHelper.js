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
  var ctx = canvasElement._ctx;
  if (!ctx) {
    canvasElement._ctx = canvas.getContext("2d");
    ctx = canvasElement._ctx;
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  canvas.width = imgData.width;
  canvas.height = imgData.height;
  ctx.putImageData(imgData, 0, 0);
}

function canvasHelperCreateVideoCapture(videoSource) {
  var video = null;
  if (typeof videoSource === "string") {
    video = document.getElementById(videoSource);
  } else {
    video = videoSource;
  }
  if (!(video instanceof HTMLVideoElement)) {
    throw new Error("Please input the valid video element or id.");
    return;
  }

  var canvas = document.createElement("canvas");
  canvas.width = video.width;
  canvas.height = video.height;
  var ctx = canvas.getContext("2d");

  return {
    readDataDrame: () => {
      ctx.drawImage(video, 0, 0, video.width, video.height);
      return ctx.getImageData(0, 0, video.width, video.height);
    }
  };
}
