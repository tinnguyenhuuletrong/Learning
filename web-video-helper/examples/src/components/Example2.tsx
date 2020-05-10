import React from "react";
import { WebcamRenderToCanvas } from "web-video-helper";
import useFaceDetectWorker from "../hooks/useFaceDetectWorker";
const videoConstraints = {
  width: 512,
};

export const Example2 = () => {
  const context = React.useRef<any>({
    faceArr: [],
  });
  const onFaces = (faceArr: any) => {
    context.current.faceArr = faceArr;
  };
  const [ready, onFrame]: any = useFaceDetectWorker({
    detectFps: 10,
    onFaces,
  });

  const postRender = (
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D
  ) => {
    const { width, height } = canvas;
    const imageData = ctx.getImageData(0, 0, width, height);
    onFrame(imageData);

    for (const itm of context.current.faceArr) {
      const { x, y, width, height } = itm;
      // rec
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#0f0";
      ctx.rect(x, y, width, height);
      ctx.stroke();
    }
  };

  return (
    <>
      <h3>Canvas Face detect element</h3>
      {ready && (
        <WebcamRenderToCanvas
          syncFps={60}
          audio={false}
          forceScreenshotSourceSize
          videoConstraints={videoConstraints}
          onPostRender={postRender}
        />
      )}
    </>
  );
};
