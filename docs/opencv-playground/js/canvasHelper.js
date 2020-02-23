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
