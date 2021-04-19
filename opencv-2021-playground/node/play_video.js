const cv = require("opencv4nodejs");

const VIDEO_PATH = `/Users/admin/Downloads/my_face.mp4`;
async function main() {
  const wCap = new cv.VideoCapture(VIDEO_PATH);
  let done = false;
  while (!done) {
    let frame = wCap.read();
    if (frame.empty) break;
    const frameResized = frame.resizeToMax(600);

    console.log(frameResized);
  }
}

main();
