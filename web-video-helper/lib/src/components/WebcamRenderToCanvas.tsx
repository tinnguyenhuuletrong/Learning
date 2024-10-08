import * as React from "react";
import {
  hasGetUserMedia,
  getCanvasFromVideo,
  GetCanvasFromVideoReturn,
} from "../utils/helpper";
import { WebcamPropsCanvas } from "../types";
import requestUserMedia from "../hooks/requestUserMedia";
import useAnimationFrame from "../hooks/useRequestAnimationFrame";

const hiddenVideoStyle = {
  display: "none",
};

const WebcamRenderToCanvas = ({
  syncFps = 60,
  audio = true,
  forceScreenshotSourceSize = false,
  imageSmoothing = true,
  mirrored = false,
  onUserMedia = () => {},
  onUserMediaError = () => {},
  onPostRender,
  screenshotFormat = "image/jpeg",
  screenshotQuality = 0.92,
  style = {},
  audioConstraints,
  videoConstraints,
}: WebcamPropsCanvas) => {
  const video = React.useRef<any>(null);
  const canvas = React.useRef<HTMLCanvasElement | null>(null);
  const canvasHelper = React.useRef<GetCanvasFromVideoReturn | null>(null);

  const [src, setVideoSrc] = React.useState<MediaStream>();

  // Capture func
  const doCapture = React.useCallback(() => {
    if (!canvasHelper.current) return;

    canvasHelper.current.drawImage(video.current);
    return canvasHelper.current.canvas.toDataURL(
      screenshotFormat,
      screenshotQuality
    );
  }, []);

  // Request user media
  React.useEffect(() => {
    requestUserMedia({
      audio,
      audioConstraints,
      videoConstraints,
      handleUserMedia: (err: any, stream?: MediaStream) => {
        if (err) {
          onUserMediaError(err);
          return;
        }
        setVideoSrc(stream);
        onUserMedia({ doCapture });
      },
    });
  }, []);

  // Bind to video
  React.useEffect(() => {
    if (!src) return;

    if ("srcObject" in video.current) {
      video.current.srcObject = src;
    } else {
      // Avoid using this in new browsers, as it is going away.
      video.current.src = window.URL.createObjectURL(src);
    }

    video.current.onloadedmetadata = () => {
      // create displaying canvas
      canvasHelper.current = getCanvasFromVideo(video.current, {
        canvas: canvas.current as HTMLCanvasElement,
        forceScreenshotSourceSize,
        imageSmoothing,
        mirrored,
      });
    };

    // Destroy
    return () => {
      try {
        src.getTracks().forEach((track) => track.stop());
      } catch (error) {
        console.error("can not stop");
      }
    };
  }, [src]);

  // Animation Frame sync
  const syncFrame = React.useCallback(() => {
    if (!(canvasHelper.current && video.current)) return;

    let nextFrame = video.current;
    const { ctx, canvas, drawImage } = canvasHelper.current;
    drawImage(nextFrame);
    onPostRender && onPostRender(canvas, ctx);
  }, []);
  useAnimationFrame(syncFps)(syncFrame);

  if (!hasGetUserMedia()) {
    onUserMediaError("getUserMedia not supported");
    return null;
  }

  return (
    <>
      <video
        ref={video}
        autoPlay
        muted={audio}
        playsInline
        style={{ ...hiddenVideoStyle }}
      />
      <canvas ref={canvas} style={style} />
    </>
  );
};

export default WebcamRenderToCanvas;
