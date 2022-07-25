import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-http";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";
import { Resource } from "@opentelemetry/resources";
import {
  MeterProvider,
  PeriodicExportingMetricReader,
} from "@opentelemetry/sdk-metrics-base";

const metricExporter = new OTLPMetricExporter({
  // optional - url default value is http://localhost:4318/v1/traces
  url: "http://localhost:4318/v1/metrics",

  // optional - collection of custom headers to be sent with each request, empty by default
  headers: {},
});
const resource = new Resource({
  [SemanticResourceAttributes.SERVICE_NAME]: "web-reactjs",
  [SemanticResourceAttributes.SERVICE_NAMESPACE]: "dev",
});

export const meterProvider = new MeterProvider({
  resource: Resource.default().merge(resource),
});

meterProvider.addMetricReader(
  new PeriodicExportingMetricReader({
    exporter: metricExporter,
    exportIntervalMillis: 30000,
  })
);

export const hitCounter = meterProvider
  .getMeter("web-reactjs-meter")
  .createCounter("ip-resolve-counter");

export const forceSync = () => meterProvider.forceFlush();
