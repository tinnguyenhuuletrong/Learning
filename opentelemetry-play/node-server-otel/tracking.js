// Require dependencies
const opentelemetry = require("@opentelemetry/sdk-node");
const {
  getNodeAutoInstrumentations,
} = require("@opentelemetry/auto-instrumentations-node");
const { diag, DiagConsoleLogger, DiagLogLevel } = require("@opentelemetry/api");
const { Resource } = require("@opentelemetry/resources");
const {
  SemanticResourceAttributes,
} = require("@opentelemetry/semantic-conventions");
const { BatchSpanProcessor } = require("@opentelemetry/sdk-trace-base");
const {
  OTLPTraceExporter,
} = require("@opentelemetry/exporter-trace-otlp-http");

// For troubleshooting, set the log level to DiagLogLevel.DEBUG
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);

// const exporter = new opentelemetry.tracing.ConsoleSpanExporter();

const exporter = new OTLPTraceExporter({
  // optional - url default value is http://localhost:4318/v1/traces
  url: "http://localhost:4318/v1/traces",

  // optional - collection of custom headers to be sent with each request, empty by default
  headers: {},
});

const sdk = new opentelemetry.NodeSDK({
  resource: Resource.default().merge(
    new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: "node-express-otel-play",
      [SemanticResourceAttributes.SERVICE_NAMESPACE]: "dev",
    })
  ),
  spanProcessor: new BatchSpanProcessor(exporter),
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();
