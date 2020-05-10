import React from "react";
import { WebcamRenderToVideo, WebcamRenderToCanvas } from "web-video-helper";

const videoConstraints = {
  width: 256,
};

declare global {
  interface Window {
    doCapture: Function;
  }
}

function grayscale(imgData: ImageData) {
  const data = imgData.data;
  for (var i = 0; i < data.length; i += 4) {
    var brightness = 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2];
    // red
    data[i] = brightness;
    // green
    data[i + 1] = brightness;
    // blue
    data[i + 2] = brightness;
  }
  return imgData;
}

function postRender(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
  const { width, height } = canvas;
  const imageData = ctx.getImageData(0, 0, width, height);
  grayscale(imageData);
  ctx.putImageData(imageData, 0, 0);
}

export const Example1 = () => {
  const context = React.useRef<any>({});
  const [captureSrc, setCaptureSrc] = React.useState<string>();

  const captureCallback = () => {
    context.current.captureFn && setCaptureSrc(context.current.captureFn());
  };

  return (
    <>
      <h3>Canvas element</h3>
      <WebcamRenderToCanvas
        syncFps={60}
        audio={false}
        forceScreenshotSourceSize
        videoConstraints={videoConstraints}
        onUserMedia={({ doCapture }) => {
          window.doCapture = doCapture;
          context.current.captureFn = doCapture;
        }}
        onPostRender={postRender}
      />
      <button onClick={captureCallback}>capture</button>
      <img src={captureSrc} alt="" />
    </>
  );
};
