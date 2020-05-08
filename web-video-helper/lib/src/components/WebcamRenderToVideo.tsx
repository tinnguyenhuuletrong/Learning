import * as React from "react";
import { hasGetUserMedia, getCanvasFromVideo } from "../utils/helpper";
import { WebcamProps } from "../types";
import requestUserMedia from "../hooks/requestUserMedia";

const WebcamBasic = ({
  audio = true,
  forceScreenshotSourceSize = false,
  imageSmoothing = true,
  mirrored = false,
  onUserMedia = () => {},
  onUserMediaError = () => {},
  screenshotFormat = "image/jpeg",
  screenshotQuality = 0.92,
  audioConstraints,
  videoConstraints,
  style = {},
}: WebcamProps) => {
  const video = React.useRef<any>(null);
  const [src, setVideoSrc] = React.useState<MediaStream>();

  // Capture func
  const doCapture = React.useCallback(() => {
    const canvasHelper = getCanvasFromVideo(video.current, {
      forceScreenshotSourceSize,
      imageSmoothing,
    });
    if (!canvasHelper) return;

    canvasHelper.drawImage(video.current);
    return canvasHelper.canvas.toDataURL(screenshotFormat, screenshotQuality);
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

    // Destroy
    return () => {
      try {
        src.getTracks().forEach((track) => track.stop());
      } catch (error) {
        console.error("can not stop");
      }
    };
  }, [src]);

  if (!hasGetUserMedia()) {
    onUserMediaError("getUserMedia not supported");
    return null;
  }

  const videoStyle = mirrored
    ? { ...style, transform: `${style.transform || ""} scaleX(-1)` }
    : style;

  return (
    <video ref={video} autoPlay muted={audio} playsInline style={videoStyle} />
  );
};

export default WebcamBasic;
