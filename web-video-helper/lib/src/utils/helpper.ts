declare global {
  interface Navigator {
    webkitGetUserMedia: any;
    mozGetUserMedia: any;
    msGetUserMedia: any;
  }
}

// polyfill based on https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
(function polyfillGetUserMedia() {
  if (typeof window === "undefined") {
    return;
  }

  // Older browsers might not implement mediaDevices at all, so we set an empty object first
  if (navigator.mediaDevices === undefined) {
    (navigator as any).mediaDevices = {};
  }

  // Some browsers partially implement mediaDevices. We can't just assign an object
  // with getUserMedia as it would overwrite existing properties.
  // Here, we will just add the getUserMedia property if it's missing.
  if (navigator.mediaDevices.getUserMedia === undefined) {
    navigator.mediaDevices.getUserMedia = function (constraints: any) {
      // First get ahold of the legacy getUserMedia, if present
      const getUserMedia =
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia;

      // Some browsers just don't implement it - return a rejected promise with an error
      // to keep a consistent interface
      if (!getUserMedia) {
        return Promise.reject(
          new Error("getUserMedia is not implemented in this browser")
        );
      }

      // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
      return new Promise(function (resolve, reject) {
        getUserMedia.call(navigator, constraints, resolve, reject);
      });
    };
  }
})();

export function hasGetUserMedia() {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}

export interface GetCanvasFromVideoOptions {
  mirrored?: boolean;
  imageSmoothing?: boolean;
  forceScreenshotSourceSize?: boolean;
  minScreenshotWidth?: number;
  minScreenshotHeight?: number;
}
export interface GetCanvasFromVideoReturn {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D | null;
  drawImage: (image: CanvasImageSource) => void;
}
export function getCanvasFromVideo(
  video: HTMLVideoElement,
  options: GetCanvasFromVideoOptions
): GetCanvasFromVideoReturn | null {
  if (!video) {
    return null;
  }

  const {
    mirrored,
    imageSmoothing = true,
    forceScreenshotSourceSize = true,
    minScreenshotWidth,
    minScreenshotHeight,
  } = options;

  let canvasWidth = video.videoWidth;
  let canvasHeight = video.videoHeight;
  if (!forceScreenshotSourceSize) {
    const aspectRatio = canvasWidth / canvasHeight;

    canvasWidth = minScreenshotWidth || video.clientWidth;
    canvasHeight = canvasWidth / aspectRatio;

    if (minScreenshotHeight && canvasHeight < minScreenshotHeight) {
      canvasHeight = minScreenshotHeight;
      canvasWidth = canvasHeight * aspectRatio;
    }
  }

  const canvas = document.createElement("canvas");
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  const ctx = canvas.getContext("2d");

  function drawImage(image: CanvasImageSource) {
    if (ctx && canvas) {
      // mirror the screenshot
      if (mirrored) {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      }

      ctx.imageSmoothingEnabled = imageSmoothing;
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

      // invert mirroring
      if (mirrored) {
        ctx.scale(-1, 1);
        ctx.translate(-canvas.width, 0);
      }
    }
  }

  return {
    canvas,
    ctx,
    drawImage,
  };
}
