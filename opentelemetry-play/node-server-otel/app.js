require("./tracking");
const { promisify } = require("util");
const opentelemetry = require("@opentelemetry/api");
const express = require("express");

const waitMs = promisify(setTimeout);

const PORT = process.env.PORT || "8080";
const app = express();

app.get("/", (req, res) => {
  res.send(`
  <html>
  <h1>Opentelemetry node playground</h1>

  <ul>
   <li> /job_log_event - event log </li>
   <li> /job_nested_span - create nested span + event log </li>
   <li> /job_error - will raise exception </li>
   <li> /job_link_with_background - long run background job recorded as children span </li>
  </ul>
  </html>
  `);
});

app.get("/job_log_event", async (req, res) => {
  const span = opentelemetry.trace.getSpan(opentelemetry.context.active());
  const jobId = Date.now().toString();

  span.setAttribute("jobId", jobId);
  span.addEvent("begin-step-1");
  await waitMs(5000);
  span.addEvent("end-step-1");
  await waitMs(10000);
  span.addEvent("end-step-2");

  return res.json({ jobId, isDone: true });
});

app.get("/job_nested_span", async (req, res) => {
  const span = opentelemetry.trace.getSpan(opentelemetry.context.active());
  const jobId = Date.now().toString();

  await waitMs(1000);

  await doBackgroundTask();

  await waitMs(1000);

  return res.json({ jobId, isDone: true });
});

app.get("/job_error", async (req, res) => {
  const span = opentelemetry.trace.getSpan(opentelemetry.context.active());
  try {
    a = null;
    a.b = 1;
  } catch (error) {
    span.recordException(error);
    span.setStatus(opentelemetry.SpanStatusCode.ERROR);
    return res.status(500).json({ error: error.message });
  }
});

app.get("/job_link_with_background", async (req, res) => {
  const span = opentelemetry.trace.getSpan(opentelemetry.context.active());
  const jobId = Date.now().toString();

  await waitMs(1000);

  backgroundProcessRepeat(2);

  return res.json({ msg: "background task doing...", isDone: true });
});

app.listen(parseInt(PORT, 10), () => {
  console.log(`Listening for requests on http://localhost:${PORT}`);
});

async function doBackgroundTask() {
  const childSpan = opentelemetry.trace
    .getTracer()
    .startSpan("background_task", {}, opentelemetry.context.active());

  childSpan.addEvent("begin-step-1");
  await waitMs(2000);
  childSpan.addEvent("end-step-1");
  await waitMs(3000);
  childSpan.addEvent("end-step-2");
  childSpan.end();
}

//------------------------------------------------------------------------
//  Trace internal job
//------------------------------------------------------------------------

async function backgroundProcessRepeat(time = 2) {
  for (let i = 0; i < time; i++) {
    const tracer = opentelemetry.trace.getTracer();
    const span = tracer.startSpan("background_process_repeated");
    span.setAttribute("it", i);

    await waitMs((i + 1) * 2000);

    span.end();
  }
}

setTimeout(async () => {
  console.log("background task started ");
  await backgroundProcessRepeat(5);

  console.log("background task finished ");
}, 2000);
