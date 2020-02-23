self.importScripts("./opencv_worker.js");

async function processGrayScale(imgData) {
  await ready.promise;
  const inp = imgData2Mat(imgData);
  cv.cvtColor(inp, inp, cv.COLOR_RGBA2GRAY, 0);
  return mat2ImgData(inp);
}

onmessage = async e => {
  const { id, cmd, extra } = e.data;
  console.log(id, cmd, extra);
  try {
    switch (cmd) {
      case "cmd.process_grayscale":
        {
          const { width, height, data } = extra;
          const response = await processGrayScale({ width, height, data });
          postMessage({
            namespace: "system.opencv",
            ev: "cmd.response",
            extra: { id, response }
          });
        }
        break;

      default:
        break;
    }
  } catch (error) {
    console.error(error);
  }
};

start();
