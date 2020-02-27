const path = require("path");
const express = require("express");

const SSE = require("express-sse");
const sse = new SSE(["initial content"]);
const port = 3000;

const app = express();

app.use("/static", express.static(path.join(__dirname, "./public")));
app.get("/stream", sse.init);

let count = 0;
setInterval(() => {
  sse.send({ no: count++, intervalMs: 1000 }, undefined, count);
}, 1000);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
