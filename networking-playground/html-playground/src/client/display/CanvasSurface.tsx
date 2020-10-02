import React, { useRef, useLayoutEffect } from "react";
import useRaf from "@rooks/use-raf";

const getPixelRatio = (context: any) => {
  var backingStore =
    context.backingStorePixelRatio ||
    context.webkitBackingStorePixelRatio ||
    context.mozBackingStorePixelRatio ||
    context.msBackingStorePixelRatio ||
    context.oBackingStorePixelRatio ||
    context.backingStorePixelRatio ||
    1;

  return (window.devicePixelRatio || 1) / backingStore;
};

export type RenderHandler = (canvas: HTMLCanvasElement, ms: number) => void;
export type CanvasSurfaceProps = {
  isRun: boolean;
  renderer: RenderHandler | undefined;
  style?: React.CSSProperties;
};
export const CanvasSurface = ({
  isRun = true,
  renderer,
  style = {},
}: CanvasSurfaceProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useLayoutEffect(() => {
    const canvas = canvasRef?.current;
    const context = canvas?.getContext("2d");

    if (!(canvas && context)) return;

    let ratio = getPixelRatio(context);
    let width = +getComputedStyle(canvas)
      .getPropertyValue("width")
      .slice(0, -2);
    let height = +getComputedStyle(canvas)
      .getPropertyValue("height")
      .slice(0, -2);

    canvas.width = width * ratio;
    canvas.height = height * ratio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    console.log(canvas.width, canvas.height);
  });

  useRaf((ms: number) => {
    if (canvasRef && canvasRef.current) {
      renderer && renderer(canvasRef.current, ms);
    }
  }, isRun);

  console.log(style);
  return (
    <canvas
      ref={canvasRef}
      style={{ width: "100%", height: "100%", ...style }}
    />
  );
};
