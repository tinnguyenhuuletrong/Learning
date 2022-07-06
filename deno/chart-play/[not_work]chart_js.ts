import {
  createCanvas,
  EmulatedCanvas2D,
} from "https://deno.land/x/canvas@v1.4.1/mod.ts";
import * as ChartModule from "https://cdn.jsdelivr.net/npm/chart.js@3.8.0/dist/chart.esm.js";

const canvas = createCanvas(400, 400);

class DenoPlatform extends ChartModule.BasePlatform {
  acquireContext(item: EmulatedCanvas2D) {
    const context: any = item.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;
    const cloneObj = Object.assign({}, context, { canvas: {}, width, height });

    return cloneObj;
  }
  updateConfig(config: any) {
    config.options.animation = false;
    config.options.responsive = false;
  }
}

const labels = ["January", "February", "March", "April", "May", "June"];

const data = {
  labels: labels,
  datasets: [
    {
      label: "My First dataset",
      backgroundColor: "rgb(255, 99, 132)",
      borderColor: "rgb(255, 99, 132)",
      data: [0, 10, 5, 2, 20, 30, 45],
    },
  ],
};

const config = {
  type: "line",
  data: data,
  options: {},
  platform: DenoPlatform,
};

const ins = new ChartModule.Chart(canvas, config);
// ins.canvas = canvas;
// ins.width = canvas.width;
// ins.height = canvas.height;

ins.render();

await Deno.writeFile("image_chartjs.png", canvas.toBuffer());
