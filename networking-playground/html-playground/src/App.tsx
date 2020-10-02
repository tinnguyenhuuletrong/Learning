import React from "react";
import { CanvasSurface } from "./client/display/CanvasSurface";

const world = {
  i: 0,
  size: 100,
  render: (canvas: HTMLCanvasElement, ms: number) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { width, height } = canvas;
    const { size } = world;

    ctx.clearRect(0, 0, width, height);
    ctx.save();

    const x = width * Math.abs(Math.cos(world.i));
    const y = height / 2 - size;

    ctx.translate(x, y);
    ctx.beginPath();
    ctx.arc(size, size, size, 0, 2 * Math.PI);
    ctx.fill();
    ctx.restore();
    world.i += (1 * ms) / 1000;
  },
};

function App() {
  return (
    <main style={{ display: "flex", flexDirection: "column" }}>
      <div
        style={{
          width: "100%",
          height: 200,
          marginBottom: 20,
        }}
      >
        <CanvasSurface
          style={{ border: "solid" }}
          isRun
          renderer={world.render}
        />
      </div>

      <div
        style={{
          width: "100%",
          height: 200,
          marginTop: 20,
        }}
      >
        <CanvasSurface
          style={{ border: "solid" }}
          isRun
          renderer={world.render}
        />
      </div>
    </main>
  );
}

export default App;
